package storage

import (
	"fmt"
	"io/fs"
	"log"
	"os"
	"path/filepath"
	"regexp"
	"sync"
	"time"
)

// TenantStorageInfo contains metadata about a provisioned tenant directory
type TenantStorageInfo struct {
	TenantID      string    `json:"tenant_id"`
	BasePath      string    `json:"base_path"`
	DataPath      string    `json:"data_path"`
	UploadsPath   string    `json:"uploads_path"`
	PublicPath    string    `json:"public_path"`
	SizeBytes     int64     `json:"size_bytes"`
	SizeFormatted string    `json:"size_formatted"`
	ProvisionedAt time.Time `json:"provisioned_at"`
}

// Manager handles filesystem isolation and storage quota for tenant containers
type Manager struct {
	baseDir string
	mu      sync.RWMutex
}

// NewManager creates a new storage sandbox manager
func NewManager(baseDir string) (*Manager, error) {
	if baseDir == "" {
		baseDir = "/var/lib/herocms/tenants"
	}

	// In development or local testing without root, allow fallback to local path
	if err := os.MkdirAll(baseDir, 0755); err != nil {
		localFallback := filepath.Join(os.TempDir(), "herocms_tenants")
		log.Printf("[STORAGE NOTICE] Unable to create %s (%v). Falling back to %s", baseDir, err, localFallback)
		if errFallback := os.MkdirAll(localFallback, 0755); errFallback != nil {
			return nil, fmt.Errorf("failed to initialize storage base dir: %w", errFallback)
		}
		baseDir = localFallback
	}

	return &Manager{
		baseDir: baseDir,
	}, nil
}

// SanitizeTenantID validates tenant identifier to prevent directory traversal
func SanitizeTenantID(tenantID string) (string, error) {
	match, _ := regexp.MatchString(`^[a-zA-Z0-9_-]{1,64}$`, tenantID)
	if !match {
		return "", fmt.Errorf("invalid tenant_id format: %q", tenantID)
	}
	return tenantID, nil
}

// ProvisionTenantStorage creates an isolated directory tree for a tenant
func (m *Manager) ProvisionTenantStorage(tenantID string) (*TenantStorageInfo, error) {
	cleanID, err := SanitizeTenantID(tenantID)
	if err != nil {
		return nil, err
	}

	m.mu.Lock()
	defer m.mu.Unlock()

	tenantDir := filepath.Join(m.baseDir, cleanID)
	dataPath := filepath.Join(tenantDir, "data")
	uploadsPath := filepath.Join(tenantDir, "uploads")
	publicPath := filepath.Join(tenantDir, "public")

	subdirs := []string{dataPath, uploadsPath, publicPath}
	for _, dir := range subdirs {
		if err := os.MkdirAll(dir, 0775); err != nil {
			return nil, fmt.Errorf("failed to create tenant subdir %s: %w", dir, err)
		}
	}

	// Create an initial placeholder README if data is newly created
	initFlag := filepath.Join(tenantDir, ".tenant_meta.json")
	if _, err := os.Stat(initFlag); os.IsNotExist(err) {
		metaContent := fmt.Sprintf(`{"tenant_id":"%s","created_at":"%s","owner_uid":10001}`, cleanID, time.Now().UTC().Format(time.RFC3339))
		_ = os.WriteFile(initFlag, []byte(metaContent), 0644)
	}

	size, _ := m.calculateDirSize(tenantDir)

	return &TenantStorageInfo{
		TenantID:      cleanID,
		BasePath:      tenantDir,
		DataPath:      dataPath,
		UploadsPath:   uploadsPath,
		PublicPath:    publicPath,
		SizeBytes:     size,
		SizeFormatted: formatBytes(size),
		ProvisionedAt: time.Now().UTC(),
	}, nil
}

// InspectTenantStorage inspects the storage directories and calculates current size
func (m *Manager) InspectTenantStorage(tenantID string) (*TenantStorageInfo, error) {
	cleanID, err := SanitizeTenantID(tenantID)
	if err != nil {
		return nil, err
	}

	m.mu.RLock()
	defer m.mu.RUnlock()

	tenantDir := filepath.Join(m.baseDir, cleanID)
	if _, err := os.Stat(tenantDir); os.IsNotExist(err) {
		return nil, fmt.Errorf("tenant storage not found for %s", cleanID)
	}

	dataPath := filepath.Join(tenantDir, "data")
	uploadsPath := filepath.Join(tenantDir, "uploads")
	publicPath := filepath.Join(tenantDir, "public")
	size, _ := m.calculateDirSize(tenantDir)

	return &TenantStorageInfo{
		TenantID:      cleanID,
		BasePath:      tenantDir,
		DataPath:      dataPath,
		UploadsPath:   uploadsPath,
		PublicPath:    publicPath,
		SizeBytes:     size,
		SizeFormatted: formatBytes(size),
		ProvisionedAt: time.Now().UTC(),
	}, nil
}

// PurgeTenantStorage permanently deletes all directories and files for a tenant
func (m *Manager) PurgeTenantStorage(tenantID string) error {
	cleanID, err := SanitizeTenantID(tenantID)
	if err != nil {
		return err
	}

	m.mu.Lock()
	defer m.mu.Unlock()

	tenantDir := filepath.Join(m.baseDir, cleanID)
	if _, err := os.Stat(tenantDir); os.IsNotExist(err) {
		return nil // already purged
	}

	if err := os.RemoveAll(tenantDir); err != nil {
		return fmt.Errorf("failed to purge tenant storage %s: %w", tenantDir, err)
	}

	log.Printf("[STORAGE PURGED] Tenant storage destroyed: %s", cleanID)
	return nil
}

// GetBaseDir returns current storage root
func (m *Manager) GetBaseDir() string {
	return m.baseDir
}

func (m *Manager) calculateDirSize(dirPath string) (int64, error) {
	var totalSize int64
	err := filepath.WalkDir(dirPath, func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return nil
		}
		if !d.IsDir() {
			info, err := d.Info()
			if err == nil {
				totalSize += info.Size()
			}
		}
		return nil
	})
	return totalSize, err
}

func formatBytes(bytes int64) string {
	const unit = 1024
	if bytes < unit {
		return fmt.Sprintf("%d B", bytes)
	}
	div, exp := int64(unit), 0
	for n := bytes / unit; n >= unit; n /= unit {
		div *= unit
		exp++
	}
	return fmt.Sprintf("%.1f %cB", float64(bytes)/float64(div), "KMGTPE"[exp])
}
