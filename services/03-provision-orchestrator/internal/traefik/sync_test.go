package traefik

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestTraefikManager_SyncAndRemove(t *testing.T) {
	tmpDir := filepath.Join(os.TempDir(), "traefik_test_"+t.Name())
	defer os.RemoveAll(tmpDir)

	mgr := NewManager(tmpDir)

	// 1. Sync new tenant route
	err := mgr.SyncTenantRoute("tenant-alpha", "mybrand", "mybrand.com", "tenant_alpha_container")
	if err != nil {
		t.Fatalf("unexpected error syncing route: %v", err)
	}

	content, err := os.ReadFile(filepath.Join(tmpDir, "tenants.yml"))
	if err != nil {
		t.Fatalf("failed to read tenants.yml: %v", err)
	}

	sContent := string(content)
	if !strings.Contains(sContent, "Host(`mybrand.stackbyte.id`)") {
		t.Errorf("expected subdomain rule in config, got:\n%s", sContent)
	}
	if !strings.Contains(sContent, "Host(`mybrand.com`)") {
		t.Errorf("expected custom domain rule in config, got:\n%s", sContent)
	}
	if !strings.Contains(sContent, "http://tenant_alpha_container:80") {
		t.Errorf("expected container target URL in config, got:\n%s", sContent)
	}

	// 2. Remove tenant route
	err = mgr.RemoveTenantRoute("tenant-alpha")
	if err != nil {
		t.Fatalf("unexpected error removing route: %v", err)
	}

	contentAfter, _ := os.ReadFile(filepath.Join(tmpDir, "tenants.yml"))
	if strings.Contains(string(contentAfter), "tenant-alpha") {
		t.Errorf("expected tenant-alpha to be removed, but still present in config:\n%s", string(contentAfter))
	}
}
