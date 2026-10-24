package storage

import (
	"os"
	"path/filepath"
	"testing"
)

func TestStorageManager_SanitizeTenantID(t *testing.T) {
	validIDs := []string{"tenant_123", "site-alpha", "t001", "abc_DEF-99"}
	for _, id := range validIDs {
		clean, err := SanitizeTenantID(id)
		if err != nil {
			t.Errorf("expected %q to be valid, got error: %v", id, err)
		}
		if clean != id {
			t.Errorf("expected clean ID %q, got %q", id, clean)
		}
	}

	invalidIDs := []string{
		"../../etc/passwd",
		"tenant/traversal",
		"tenant;rm -rf /",
		"tenant name with spaces",
		"tenant@special#char",
		"",
	}
	for _, id := range invalidIDs {
		_, err := SanitizeTenantID(id)
		if err == nil {
			t.Errorf("[SECURITY VULNERABILITY] expected %q to be rejected, but got nil error", id)
		}
	}
}

func TestStorageManager_ProvisionAndPurge(t *testing.T) {
	tempBase := filepath.Join(os.TempDir(), "herocms_test_storage")
	defer os.RemoveAll(tempBase)

	sm, err := NewManager(tempBase)
	if err != nil {
		t.Fatalf("failed to create storage manager: %v", err)
	}

	tenantID := "test_tenant_alpha"

	// 1. Provision Storage
	info, err := sm.ProvisionTenantStorage(tenantID)
	if err != nil {
		t.Fatalf("failed to provision tenant storage: %v", err)
	}

	if info.TenantID != tenantID {
		t.Errorf("expected tenant_id %q, got %q", tenantID, info.TenantID)
	}

	// Verify directories exist
	subdirs := []string{info.DataPath, info.UploadsPath, info.PublicPath}
	for _, d := range subdirs {
		if _, err := os.Stat(d); os.IsNotExist(err) {
			t.Errorf("expected directory %s to exist", d)
		}
	}

	// 2. Inspect Storage
	inspectInfo, err := sm.InspectTenantStorage(tenantID)
	if err != nil {
		t.Fatalf("failed to inspect tenant storage: %v", err)
	}
	if inspectInfo.BasePath != info.BasePath {
		t.Errorf("expected BasePath %s, got %s", info.BasePath, inspectInfo.BasePath)
	}

	// 3. Purge Storage
	if err := sm.PurgeTenantStorage(tenantID); err != nil {
		t.Fatalf("failed to purge tenant storage: %v", err)
	}

	// Verify directory deleted
	if _, err := os.Stat(info.BasePath); !os.IsNotExist(err) {
		t.Errorf("expected %s to be purged, but it still exists", info.BasePath)
	}
}
