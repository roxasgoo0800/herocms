package docker

import (
	"context"
	"fmt"
	"log"

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
	cli *client.Client
}

func NewProvisioner() (*Provisioner, error) {
	cli, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	if err != nil {
		return nil, fmt.Errorf("failed to create docker client: %w", err)
	}
	return &Provisioner{cli: cli}, nil
}

// DeployTenantContainer spins up an isolated Docker container with Traefik labels & cgroup limits
func (p *Provisioner) DeployTenantContainer(ctx context.Context, params TenantDeployParams) (string, error) {
	containerName := fmt.Sprintf("tenant_%s_%s", params.TenantID, params.VersionHash[:8])
	imageName := "cloudcms-tenant-runtime:alpine-v1"

	// Routing rules for Traefik
	rule := fmt.Sprintf("Host(`%s.cloudcms.app`)", params.Subdomain)
	if params.CustomDomain != "" {
		rule += fmt.Sprintf(" || Host(`%s`)", params.CustomDomain)
	}

	labels := map[string]string{
		"traefik.enable": "true",
		"traefik.docker.network": "cloudcms_edge_network",
		fmt.Sprintf("traefik.http.routers.tenant-%s.rule", params.TenantID): rule,
		fmt.Sprintf("traefik.http.routers.tenant-%s.entrypoints", params.TenantID): "websecure",
		fmt.Sprintf("traefik.http.routers.tenant-%s.tls.certresolver", params.TenantID): "letsencrypt",
		fmt.Sprintf("traefik.http.services.tenant-%s.loadbalancer.server.port", params.TenantID): "80",
	}

	config := &container.Config{
		Image:  imageName,
		User:   "10001:10001", // Non-root security
		Labels: labels,
		Env: []string{
			"NODE_ENV=production",
			fmt.Sprintf("TENANT_ID=%s", params.TenantID),
			fmt.Sprintf("SITE_ID=%s", params.SiteID),
		},
	}

	// Linux cgroup constraints: 256MB RAM, 0.5 CPU, read-only rootfs
	hostConfig := &container.HostConfig{
		Resources: container.Resources{
			Memory:     256 * 1024 * 1024,
			MemorySwap: 256 * 1024 * 1024,
			NanoCPUs:   500000000,
			PidsLimit:  func(i int64) *int64 { return &i }(50),
		},
		ReadonlyRootfs: true,
		SecurityOpt: []string{
			"no-new-privileges:true",
		},
		CapDrop: []string{"ALL"},
		CapAdd:  []string{"NET_BIND_SERVICE"},
		Tmpfs: map[string]string{
			"/tmp": "size=16m,noexec,nosuid,nodev",
		},
		RestartPolicy: container.RestartPolicy{
			Name:              "on-failure",
			MaximumRetryCount: 3,
		},
	}

	networkConfig := &network.NetworkingConfig{
		EndpointsConfig: map[string]*network.EndpointSettings{
			"cloudcms_edge_network": {},
		},
	}

	resp, err := p.cli.ContainerCreate(ctx, config, hostConfig, networkConfig, nil, containerName)
	if err != nil {
		return "", fmt.Errorf("failed to create tenant container: %w", err)
	}

	if err := p.cli.ContainerStart(ctx, resp.ID, container.StartOptions{}); err != nil {
		return "", fmt.Errorf("failed to start container: %w", err)
	}

	log.Printf("[PROVISIONER] Container %s (%s) successfully started with Traefik rules: %s", containerName, resp.ID[:12], rule)
	return resp.ID, nil
}
