package docker

import (
	"fmt"
	"strings"

	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/network"
)

// SandboxSpecs defines the isolation constraints applied to tenant containers
type SandboxSpecs struct {
	MemoryLimitBytes int64
	NanoCPUs         int64
	PidsLimit        int64
	NonRootUser      string
	EdgeNetwork      string
}

// DefaultSandboxSpecs returns production-hardened cgroups v2 resource quotas
func DefaultSandboxSpecs(edgeNetwork string) SandboxSpecs {
	if edgeNetwork == "" {
		edgeNetwork = "herocms_edge_net"
	}
	return SandboxSpecs{
		MemoryLimitBytes: 256 * 1024 * 1024, // 256 MB hard limit
		NanoCPUs:         500_000_000,        // 0.5 vCPU
		PidsLimit:        50,                 // Anti-fork bomb
		NonRootUser:      "10001:10001",      // cmsrunner UID/GID
		EdgeNetwork:      edgeNetwork,
	}
}

// BuildTraefikLabels generates dynamic router and service labels for Traefik v3 ingress
func BuildTraefikLabels(subdomain, customDomain, routerName, edgeNetwork string) map[string]string {
	cleanSub := strings.TrimSuffix(subdomain, ".stacbyte.id")
	cleanSub = strings.TrimSuffix(cleanSub, ".herocms.stackbyte.id")
	cleanSub = strings.TrimSuffix(cleanSub, ".cloudcms.app")
	rule := fmt.Sprintf("Host(`%s.stacbyte.id`)", cleanSub)
	if customDomain != "" {
		rule += fmt.Sprintf(" || Host(`%s`)", customDomain)
	}

	return map[string]string{
		"traefik.enable":         "true",
		"traefik.docker.network": edgeNetwork,
		fmt.Sprintf("traefik.http.routers.%s.rule", routerName):                    rule,
		fmt.Sprintf("traefik.http.routers.%s.entrypoints", routerName):             "web",
		fmt.Sprintf("traefik.http.services.%s.loadbalancer.server.port", routerName): "80",
		// Security middleware references if configured
		fmt.Sprintf("traefik.http.routers.%s.middlewares", routerName):            "secure-headers@file",
	}
}

// BuildHostConfig produces container.HostConfig enforcing Linux cgroups v2 sandboxing & volume mounts
func BuildHostConfig(specs SandboxSpecs, dataPath, uploadsPath, publicPath string) *container.HostConfig {
	binds := []string{}
	if dataPath != "" {
		binds = append(binds, fmt.Sprintf("%s:/app/data:rw", dataPath))
	}
	if uploadsPath != "" {
		binds = append(binds, fmt.Sprintf("%s:/app/uploads:rw", uploadsPath))
	}
	if publicPath != "" {
		binds = append(binds, fmt.Sprintf("%s:/app/public:ro", publicPath))
	}

	pids := specs.PidsLimit

	return &container.HostConfig{
		Resources: container.Resources{
			Memory:     specs.MemoryLimitBytes,
			MemorySwap: specs.MemoryLimitBytes, // Swap strictly disabled
			NanoCPUs:   specs.NanoCPUs,
			PidsLimit:  &pids,
		},
		Binds:          binds,
		ReadonlyRootfs: true,
		SecurityOpt: []string{
			"no-new-privileges:true",
		},
		CapDrop: []string{"ALL"},
		CapAdd:  []string{"NET_BIND_SERVICE"},
		Tmpfs: map[string]string{
			"/tmp": "size=16m,noexec,nosuid,nodev",
			"/run": "size=4m,noexec,nosuid,nodev",
		},
		RestartPolicy: container.RestartPolicy{
			Name:              "on-failure",
			MaximumRetryCount: 3,
		},
	}
}

// BuildNetworkConfig links container directly to the Traefik edge network
func BuildNetworkConfig(edgeNetwork string) *network.NetworkingConfig {
	return &network.NetworkingConfig{
		EndpointsConfig: map[string]*network.EndpointSettings{
			edgeNetwork: {},
		},
	}
}
