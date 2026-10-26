package docker

import (
	"strings"
	"testing"
)

func TestSandbox_HardLimitsAndSecurityFlags(t *testing.T) {
	specs := DefaultSandboxSpecs("herocms_edge_net")

	// 1. Memory limit must be 256MB
	expectedMem := int64(256 * 1024 * 1024)
	if specs.MemoryLimitBytes != expectedMem {
		t.Errorf("expected MemoryLimitBytes %d, got %d", expectedMem, specs.MemoryLimitBytes)
	}

	// 2. CPU limit must be 0.5 vCPU
	expectedCPU := int64(500_000_000)
	if specs.NanoCPUs != expectedCPU {
		t.Errorf("expected NanoCPUs %d, got %d", expectedCPU, specs.NanoCPUs)
	}

	// 3. User must be non-root
	if specs.NonRootUser != "10001:10001" {
		t.Errorf("expected NonRootUser '10001:10001', got %s", specs.NonRootUser)
	}

	// 4. HostConfig audit
	hostConfig := BuildHostConfig(specs, "/var/data", "/var/uploads", "/var/public")

	if hostConfig.Resources.Memory != expectedMem {
		t.Errorf("expected hostConfig Memory %d, got %d", expectedMem, hostConfig.Resources.Memory)
	}
	if hostConfig.Resources.MemorySwap != expectedMem {
		t.Errorf("expected swap disabled (MemorySwap == Memory %d), got %d", expectedMem, hostConfig.Resources.MemorySwap)
	}
	if hostConfig.Resources.NanoCPUs != expectedCPU {
		t.Errorf("expected NanoCPUs %d, got %d", expectedCPU, hostConfig.Resources.NanoCPUs)
	}
	if *hostConfig.Resources.PidsLimit != 50 {
		t.Errorf("expected PidsLimit 50, got %d", *hostConfig.Resources.PidsLimit)
	}
	if !hostConfig.ReadonlyRootfs {
		t.Errorf("expected ReadonlyRootfs to be true for defense-in-depth")
	}

	// 5. Capability drops
	if len(hostConfig.CapDrop) == 0 || hostConfig.CapDrop[0] != "ALL" {
		t.Errorf("expected CapDrop to contain 'ALL', got %v", hostConfig.CapDrop)
	}

	// 6. SecurityOpt no-new-privileges
	foundNoNewPriv := false
	for _, opt := range hostConfig.SecurityOpt {
		if opt == "no-new-privileges:true" {
			foundNoNewPriv = true
			break
		}
	}
	if !foundNoNewPriv {
		t.Errorf("expected security opt 'no-new-privileges:true'")
	}

	// 7. Verify bind mounts
	foundData := false
	foundUploads := false
	for _, b := range hostConfig.Binds {
		if strings.Contains(b, "/app/data:rw") {
			foundData = true
		}
		if strings.Contains(b, "/app/uploads:rw") {
			foundUploads = true
		}
	}
	if !foundData || !foundUploads {
		t.Errorf("expected binds to mount /app/data and /app/uploads, got %v", hostConfig.Binds)
	}
}

func TestSandbox_BuildTraefikLabels(t *testing.T) {
	labels := BuildTraefikLabels("kucing-lucu", "kucing.com", "tenant-t100", "herocms_edge_net")

	if labels["traefik.enable"] != "true" {
		t.Errorf("expected traefik.enable=true")
	}
	if labels["traefik.docker.network"] != "herocms_edge_net" {
		t.Errorf("expected traefik.docker.network=herocms_edge_net, got %s", labels["traefik.docker.network"])
	}

	rule := labels["traefik.http.routers.tenant-t100.rule"]
	if !strings.Contains(rule, "Host(`kucing-lucu.stacbyte.id`)") {
		t.Errorf("expected rule to contain subdomain host, got %s", rule)
	}
	if !strings.Contains(rule, "Host(`kucing.com`)") {
		t.Errorf("expected rule to contain custom domain host, got %s", rule)
	}
}
