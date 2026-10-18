package docker

import (
	"context"
	"strings"
	"testing"
)

func TestBuildContainerConfig_Success(t *testing.T) {
	params := TenantDeployParams{
		TenantID:     "tenant-alpha-001",
		SiteID:       "site-9942",
		Subdomain:    "techlead",
		CustomDomain: "",
		VersionHash:  "a1b2c3d4e5f6",
	}

	cfg, hostCfg, netCfg, containerName, err := BuildContainerConfig(params, "traefik_network")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	// 1. Container Name & Versioning
	expectedName := "tenant_tenant-alpha-001_a1b2c3d4"
	if containerName != expectedName {
		t.Errorf("expected containerName %q, got %q", expectedName, containerName)
	}

	// 2. Non-root user
	if cfg.User != "10001:10001" {
		t.Errorf("expected user '10001:10001', got %q", cfg.User)
	}

	// 3. Environment Variables
	expectedEnv := []string{
		"NODE_ENV=production",
		"TENANT_ID=tenant-alpha-001",
		"SITE_ID=site-9942",
	}
	for _, env := range expectedEnv {
		found := false
		for _, e := range cfg.Env {
			if e == env {
				found = true
				break
			}
		}
		if !found {
			t.Errorf("expected env %q not found in container config", env)
		}
	}

	// 4. Linux cgroups v2 Constraints (Anti-DoS)
	expectedMemory := int64(256 * 1024 * 1024)
	if hostCfg.Resources.Memory != expectedMemory {
		t.Errorf("expected memory %d bytes, got %d", expectedMemory, hostCfg.Resources.Memory)
	}
	if hostCfg.Resources.NanoCPUs != 500000000 {
		t.Errorf("expected NanoCPUs 500000000 (0.5 vCPU), got %d", hostCfg.Resources.NanoCPUs)
	}
	if hostCfg.Resources.PidsLimit == nil || *hostCfg.Resources.PidsLimit != 50 {
		t.Errorf("expected PidsLimit 50, got %v", hostCfg.Resources.PidsLimit)
	}

	// 5. Sandboxing & Capabilities
	if !hostCfg.ReadonlyRootfs {
		t.Errorf("expected ReadonlyRootfs to be true")
	}
	if len(hostCfg.CapDrop) == 0 || hostCfg.CapDrop[0] != "ALL" {
		t.Errorf("expected CapDrop to contain 'ALL', got %v", hostCfg.CapDrop)
	}
	if len(hostCfg.CapAdd) == 0 || hostCfg.CapAdd[0] != "NET_BIND_SERVICE" {
		t.Errorf("expected CapAdd to contain 'NET_BIND_SERVICE', got %v", hostCfg.CapAdd)
	}

	// 6. RAM-only tmpfs (noexec)
	tmpOpt, ok := hostCfg.Tmpfs["/tmp"]
	if !ok || !strings.Contains(tmpOpt, "noexec") {
		t.Errorf("expected /tmp tmpfs to contain 'noexec', got %q", tmpOpt)
	}

	// 7. Traefik v3 Labels
	expectedRule := "Host(`techlead.herocms.stackbyte.id`)"
	routerKey := "traefik.http.routers.tenant-tenant-alpha-001.rule"
	if cfg.Labels[routerKey] != expectedRule {
		t.Errorf("expected label %s=%q, got %q", routerKey, expectedRule, cfg.Labels[routerKey])
	}
	if cfg.Labels["traefik.enable"] != "true" {
		t.Errorf("expected traefik.enable=true")
	}

	// 8. Network isolation
	if _, ok := netCfg.EndpointsConfig["traefik_network"]; !ok {
		t.Errorf("expected network 'traefik_network' in EndpointsConfig")
	}
}

func TestBuildContainerConfig_CustomDomain(t *testing.T) {
	params := TenantDeployParams{
		TenantID:     "t_99",
		SiteID:       "s_1",
		Subdomain:    "portfolio",
		CustomDomain: "rizalpratama.com",
		VersionHash:  "abcd1234ef",
	}

	cfg, _, _, _, err := BuildContainerConfig(params, "traefik_network")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	routerRule := cfg.Labels["traefik.http.routers.tenant-t_99.rule"]
	if !strings.Contains(routerRule, "Host(`portfolio.herocms.stackbyte.id`)") {
		t.Errorf("expected subdomain in rule, got %q", routerRule)
	}
	if !strings.Contains(routerRule, "Host(`rizalpratama.com`)") {
		t.Errorf("expected custom domain in rule, got %q", routerRule)
	}
}

func TestBuildContainerConfig_Validation(t *testing.T) {
	// Missing TenantID
	_, _, _, _, err := BuildContainerConfig(TenantDeployParams{Subdomain: "sub"}, "traefik_network")
	if err == nil {
		t.Errorf("expected error for empty tenant_id, got nil")
	}

	// Missing Subdomain
	_, _, _, _, err = BuildContainerConfig(TenantDeployParams{TenantID: "t1"}, "traefik_network")
	if err == nil {
		t.Errorf("expected error for empty subdomain, got nil")
	}
}

func TestProvisioner_SimulationAndNilSafety(t *testing.T) {
	// 1. Nil provisioner safety
	var nilP *Provisioner = nil
	ctx := context.Background()

	if err := nilP.Close(); err != nil {
		t.Errorf("expected nil error on nil Provisioner Close")
	}
	if err := nilP.StopContainer(ctx, "c1"); err != nil {
		t.Errorf("expected nil error on nil Provisioner StopContainer")
	}
	if err := nilP.StartContainer(ctx, "c1"); err != nil {
		t.Errorf("expected nil error on nil Provisioner StartContainer")
	}
	if err := nilP.DestroyContainer(ctx, "c1"); err != nil {
		t.Errorf("expected nil error on nil Provisioner DestroyContainer")
	}

	simID, err := nilP.DeployTenantContainer(ctx, TenantDeployParams{
		TenantID:  "tenant-nil",
		SiteID:    "site-1",
		Subdomain: "nilsub",
	})
	if err != nil || !strings.Contains(simID, "simulated_") {
		t.Errorf("expected simulated container id from nil provisioner, got: %v, %s", err, simID)
	}

	// 2. Provisioner with nil cli (simulation mode)
	simP := &Provisioner{
		cli:         nil,
		edgeNetwork: "traefik_network",
	}

	if err := simP.Close(); err != nil {
		t.Errorf("expected nil error on simP Close")
	}
	if err := simP.StopContainer(ctx, "sim-c"); err != nil {
		t.Errorf("expected nil error on simP StopContainer")
	}
	if err := simP.StartContainer(ctx, "sim-c"); err != nil {
		t.Errorf("expected nil error on simP StartContainer")
	}
	if err := simP.DestroyContainer(ctx, "sim-c"); err != nil {
		t.Errorf("expected nil error on simP DestroyContainer")
	}

	simDeployID, err := simP.DeployTenantContainer(ctx, TenantDeployParams{
		TenantID:  "tenant-sim-01",
		SiteID:    "site-01",
		Subdomain: "simsub",
	})
	if err != nil || !strings.Contains(simDeployID, "simulated_") {
		t.Errorf("expected simulated id, got: %v, %s", err, simDeployID)
	}
}
