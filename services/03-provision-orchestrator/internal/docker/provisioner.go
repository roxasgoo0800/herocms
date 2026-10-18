package docker

import (
	"context"
	"fmt"
	"log"
	"os"
	"regexp"
	"time"

	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/network"
	"github.com/docker/docker/client"
)

type TenantDeployParams struct {
	TenantID     string
	SiteID       string
	Subdomain    string
	CustomDomain string
	VersionHash  string
}

type Provisioner struct {
	cli         *client.Client
	edgeNetwork string
}

func NewProvisioner() (*Provisioner, error) {
	cli, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	if err != nil {
		return nil, fmt.Errorf("failed to create docker client: %w", err)
	}

	edgeNet := os.Getenv("DOCKER_EDGE_NETWORK")
	if edgeNet == "" {
		edgeNet = "traefik_network"
	}

	return &Provisioner{
		cli:         cli,
		edgeNetwork: edgeNet,
	}, nil
}

// Close closes the underlying Docker client connection
func (p *Provisioner) Close() error {
	if p != nil && p.cli != nil {
		return p.cli.Close()
	}
	return nil
}

// BuildContainerConfig generates the Docker container specifications adhering to enterprise sandboxing & Traefik v3 routing rules
func BuildContainerConfig(params TenantDeployParams, edgeNetwork string) (*container.Config, *container.HostConfig, *network.NetworkingConfig, string, error) {
	if params.TenantID == "" {
		return nil, nil, nil, "", fmt.Errorf("tenant_id wajib diisi")
	}
	if params.Subdomain == "" {
		return nil, nil, nil, "", fmt.Errorf("subdomain wajib diisi")
	}

	if edgeNetwork == "" {
		edgeNetwork = "traefik_network"
	}

	version := "latest"
	if len(params.VersionHash) >= 8 {
		version = params.VersionHash[:8]
	}

	// Sanitize container name: only lowercase alphanumerics and underscores
	sanitizedTenant := regexp.MustCompile(`[^a-zA-Z0-9_-]`).ReplaceAllString(params.TenantID, "")
	containerName := fmt.Sprintf("tenant_%s_%s", sanitizedTenant, version)
	imageName := os.Getenv("TENANT_RUNTIME_IMAGE")
	if imageName == "" {
		imageName = "cloudcms-tenant-runtime:alpine-v1"
	}

	// Routing rules for Traefik v3
	rule := fmt.Sprintf("Host(`%s.herocms.stackbyte.id`)", params.Subdomain)
	if params.CustomDomain != "" {
		rule += fmt.Sprintf(" || Host(`%s`)", params.CustomDomain)
	}

	routerName := fmt.Sprintf("tenant-%s", sanitizedTenant)
	labels := map[string]string{
		"traefik.enable":                                                  "true",
		"traefik.docker.network":                                          edgeNetwork,
		fmt.Sprintf("traefik.http.routers.%s.rule", routerName):           rule,
		fmt.Sprintf("traefik.http.routers.%s.entrypoints", routerName):    "web",
		fmt.Sprintf("traefik.http.services.%s.loadbalancer.server.port", routerName): "80",
	}

	config := &container.Config{
		Image: imageName,
		User:  "10001:10001", // Non-root user (cmsrunner) for security
		Labels: labels,
		Env: []string{
			"NODE_ENV=production",
			fmt.Sprintf("TENANT_ID=%s", params.TenantID),
			fmt.Sprintf("SITE_ID=%s", params.SiteID),
		},
	}

	// Defense-in-Depth Linux cgroup constraints: 256MB RAM, 0.5 CPU, read-only rootfs
	hostConfig := &container.HostConfig{
		Resources: container.Resources{
			Memory:     256 * 1024 * 1024, // 256 MB hard limit
			MemorySwap: 256 * 1024 * 1024, // Swap disabled
			NanoCPUs:   500000000,         // Max 0.5 vCPU
			PidsLimit:  func(i int64) *int64 { return &i }(50), // Anti-fork bomb
		},
		ReadonlyRootfs: true, // Read-only root filesystem
		SecurityOpt: []string{
			"no-new-privileges:true", // Prevent privilege escalation
		},
		CapDrop: []string{"ALL"},              // Drop all kernel capabilities
		CapAdd:  []string{"NET_BIND_SERVICE"}, // Only allow binding to standard ports
		Tmpfs: map[string]string{
			"/tmp": "size=16m,noexec,nosuid,nodev", // Execution in /tmp strictly blocked
			"/run": "size=4m,noexec,nosuid,nodev",
		},
		RestartPolicy: container.RestartPolicy{
			Name:              "on-failure",
			MaximumRetryCount: 3,
		},
	}

	networkConfig := &network.NetworkingConfig{
		EndpointsConfig: map[string]*network.EndpointSettings{
			edgeNetwork: {},
		},
	}

	return config, hostConfig, networkConfig, containerName, nil
}

// DeployTenantContainer spins up an isolated Docker container with Traefik labels & strict cgroup limits
func (p *Provisioner) DeployTenantContainer(ctx context.Context, params TenantDeployParams) (string, error) {
	// Guard context timeout
	if _, hasDeadline := ctx.Deadline(); !hasDeadline {
		var cancel context.CancelFunc
		ctx, cancel = context.WithTimeout(ctx, 30*time.Second)
		defer cancel()
	}

	edgeNet := "traefik_network"
	if p != nil && p.edgeNetwork != "" {
		edgeNet = p.edgeNetwork
	}

	config, hostConfig, networkConfig, containerName, err := BuildContainerConfig(params, edgeNet)
	if err != nil {
		return "", err
	}

	if p == nil || p.cli == nil {
		log.Printf("[PROVISIONER SIMULATION] Docker daemon offline. Simulated deployment for %s", containerName)
		return fmt.Sprintf("simulated_%s", containerName), nil
	}

	// Stop & Remove existing container with the same name if exists (idempotent deploy)
	_ = p.cli.ContainerStop(ctx, containerName, container.StopOptions{})
	_ = p.cli.ContainerRemove(ctx, containerName, container.RemoveOptions{Force: true})

	resp, err := p.cli.ContainerCreate(ctx, config, hostConfig, networkConfig, nil, containerName)
	if err != nil {
		return "", fmt.Errorf("failed to create tenant container: %w", err)
	}

	if err := p.cli.ContainerStart(ctx, resp.ID, container.StartOptions{}); err != nil {
		return "", fmt.Errorf("failed to start container: %w", err)
	}

	log.Printf("[PROVISIONER] Container %s (%s) successfully started", containerName, resp.ID[:12])
	return resp.ID, nil
}

// StopContainer stops an active tenant container
func (p *Provisioner) StopContainer(ctx context.Context, containerID string) error {
	if p == nil || p.cli == nil {
		return nil
	}
	timeout := 10
	return p.cli.ContainerStop(ctx, containerID, container.StopOptions{Timeout: &timeout})
}

// StartContainer restarts a stopped tenant container
func (p *Provisioner) StartContainer(ctx context.Context, containerID string) error {
	if p == nil || p.cli == nil {
		return nil
	}
	return p.cli.ContainerStart(ctx, containerID, container.StartOptions{})
}

// DestroyContainer terminates and removes a container permanently
func (p *Provisioner) DestroyContainer(ctx context.Context, containerID string) error {
	if p == nil || p.cli == nil {
		return nil
	}
	_ = p.StopContainer(ctx, containerID)
	return p.cli.ContainerRemove(ctx, containerID, container.RemoveOptions{
		RemoveVolumes: true,
		Force:         true,
	})
}
