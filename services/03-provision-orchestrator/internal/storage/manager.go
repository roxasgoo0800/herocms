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

	// Seed public/index.html with default tenant runtime template if not yet existing
	publicIndex := filepath.Join(publicPath, "index.html")
	if _, err := os.Stat(publicIndex); os.IsNotExist(err) {
		defaultHTML := GenerateWebsiteHTML(TemplateSeedParams{
			SiteName:     "Situs Tenant CloudCMS",
			Subdomain:    cleanID,
			TemplateName: "business",
			Category:     "business",
		})
		_ = os.WriteFile(publicIndex, []byte(defaultHTML), 0644)
		_ = os.WriteFile(filepath.Join(publicPath, "index.html.live"), []byte(defaultHTML), 0644)
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

// SetMaintenanceHTML writes or restores the maintenance page in tenant's public storage
func (m *Manager) SetMaintenanceHTML(tenantID, subdomain, message, eta string, enabled bool) error {
	cleanID, err := SanitizeTenantID(tenantID)
	if err != nil {
		return err
	}

	m.mu.Lock()
	defer m.mu.Unlock()

	publicPath := filepath.Join(m.baseDir, cleanID, "public")
	_ = os.MkdirAll(publicPath, 0775)
	indexPath := filepath.Join(publicPath, "index.html")
	backupPath := filepath.Join(publicPath, "index.html.live")

	if enabled {
		// Backup current live page if exists and backup doesn't exist
		if _, err := os.Stat(indexPath); err == nil {
			if _, err := os.Stat(backupPath); os.IsNotExist(err) {
				data, _ := os.ReadFile(indexPath)
				_ = os.WriteFile(backupPath, data, 0644)
			}
		}

		if message == "" {
			message = "Kami sedang melakukan pemeliharaan berkala untuk peningkatan performa. Kami akan segera kembali."
		}
		if eta == "" {
			eta = "30 menit"
		}
		if subdomain == "" {
			subdomain = "stackbyte.id"
		}

		html := fmt.Sprintf(`<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, nofollow">
    <meta http-equiv="refresh" content="60">
    <title>Mode Pemeliharaan (Maintenance) | %s</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: radial-gradient(circle at center, #1e1b4b 0%%, #09090b 100%%);
            color: #f8fafc;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            padding: 24px;
            box-sizing: border-box;
        }
        .card {
            background: rgba(15, 23, 42, 0.9);
            border: 1px solid rgba(245, 158, 11, 0.4);
            border-radius: 20px;
            padding: 44px 36px;
            text-align: center;
            max-width: 480px;
            width: 100%%;
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.8), 0 0 30px rgba(245, 158, 11, 0.2);
        }
        .icon-circle {
            width: 60px;
            height: 60px;
            background: rgba(245, 158, 11, 0.15);
            border: 1px solid rgba(245, 158, 11, 0.35);
            border-radius: 50%%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
            font-size: 26px;
        }
        .badge-status {
            display: inline-block;
            background: rgba(245, 158, 11, 0.15);
            color: #fbbf24;
            border: 1px solid rgba(245, 158, 11, 0.3);
            padding: 4px 14px;
            border-radius: 999px;
            font-size: 0.76rem;
            font-weight: 700;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            margin-bottom: 16px;
        }
        h1 {
            color: #ffffff;
            margin: 0 0 10px 0;
            font-size: 1.65rem;
            letter-spacing: -0.02em;
        }
        p.sub {
            color: #94a3b8;
            font-size: 0.95rem;
            line-height: 1.6;
            margin: 0 0 24px 0;
        }
        .eta-card {
            background: rgba(30, 41, 59, 0.7);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 12px;
            padding: 12px 18px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 24px;
        }
        .eta-text { font-size: 0.8rem; color: #64748b; font-weight: 600; text-transform: uppercase; }
        .eta-time { font-size: 0.95rem; color: #f59e0b; font-weight: 700; }
        .footer { font-size: 0.75rem; color: #475569; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 16px; }
    </style>
</head>
<body>
    <div class="card">
        <div class="icon-circle">🔧</div>
        <div><span class="badge-status">● Mode Pemeliharaan Aktif (HTTP 503)</span></div>
        <h1>Situs Sedang Dalam Pemeliharaan</h1>
        <p class="sub">%s</p>
        <div class="eta-card">
            <span class="eta-text">Estimasi Kembali Aktif</span>
            <span class="eta-time">⏱ %s</span>
        </div>
        <div class="footer">
            Didukung oleh HeroCMS Container Sandboxing Engine
        </div>
    </div>
</body>
</html>`, subdomain, message, eta)

		return os.WriteFile(indexPath, []byte(html), 0644)
	}

	// Restore original live page
	if _, err := os.Stat(backupPath); err == nil {
		data, _ := os.ReadFile(backupPath)
		_ = os.Remove(backupPath)
		return os.WriteFile(indexPath, data, 0644)
	}

	// Default template fallback if no backup exists
	defaultHTML := GenerateWebsiteHTML(TemplateSeedParams{
		SiteName:     "Situs Tenant CloudCMS",
		Subdomain:    subdomain,
		TemplateName: "business",
		Category:     "business",
	})
	return os.WriteFile(indexPath, []byte(defaultHTML), 0644)
}

// SeedTenantWebsite generates and writes the initial HTML for a tenant website based on chosen template
func (m *Manager) SeedTenantWebsite(tenantID string, p TemplateSeedParams) error {
	cleanID, err := SanitizeTenantID(tenantID)
	if err != nil {
		return err
	}

	m.mu.Lock()
	defer m.mu.Unlock()

	publicPath := filepath.Join(m.baseDir, cleanID, "public")
	if err := os.MkdirAll(publicPath, 0775); err != nil {
		return fmt.Errorf("failed to ensure public dir: %w", err)
	}

	htmlContent := GenerateWebsiteHTML(p)
	indexPath := filepath.Join(publicPath, "index.html")
	backupPath := filepath.Join(publicPath, "index.html.live")

	if err := os.WriteFile(indexPath, []byte(htmlContent), 0644); err != nil {
		return fmt.Errorf("failed to write tenant index.html: %w", err)
	}
	_ = os.WriteFile(backupPath, []byte(htmlContent), 0644)

	log.Printf("[STORAGE SEEDED] Website template '%s' (category: %s, site: %s) seeded for tenant %s", p.TemplateName, p.Category, p.SiteName, cleanID)
	return nil
}

// SetSiteHTML updates index.html directly for a tenant
func (m *Manager) SetSiteHTML(tenantID, htmlContent string) error {
	cleanID, err := SanitizeTenantID(tenantID)
	if err != nil {
		return err
	}

	m.mu.Lock()
	defer m.mu.Unlock()

	publicPath := filepath.Join(m.baseDir, cleanID, "public")
	_ = os.MkdirAll(publicPath, 0775)
	indexPath := filepath.Join(publicPath, "index.html")
	backupPath := filepath.Join(publicPath, "index.html.live")

	if err := os.WriteFile(indexPath, []byte(htmlContent), 0644); err != nil {
		return fmt.Errorf("failed to write site HTML: %w", err)
	}
	_ = os.WriteFile(backupPath, []byte(htmlContent), 0644)
	return nil
}
