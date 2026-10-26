package traefik

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"
	"sync"

	"gopkg.in/yaml.v3"
)

// RouterConfig defines Traefik dynamic HTTP router rule
type RouterConfig struct {
	Rule        string   `yaml:"rule"`
	EntryPoints []string `yaml:"entryPoints"`
	Service     string   `yaml:"service"`
	Middlewares []string `yaml:"middlewares,omitempty"`
}

// ServerConfig defines a single load balancer server target
type ServerConfig struct {
	URL string `yaml:"url"`
}

// LoadBalancerConfig holds backend server target list
type LoadBalancerConfig struct {
	Servers []ServerConfig `yaml:"servers"`
}

// ServiceConfig defines Traefik HTTP service
type ServiceConfig struct {
	LoadBalancer LoadBalancerConfig `yaml:"loadBalancer"`
}

// DynamicConfig represents the full structure of dynamic tenants.yml watched by Traefik
type DynamicConfig struct {
	HTTP struct {
		Routers  map[string]RouterConfig  `yaml:"routers"`
		Services map[string]ServiceConfig `yaml:"services"`
	} `yaml:"http"`
}

// Manager manages writing and synchronizing dynamic Traefik configuration files
type Manager struct {
	dirPath  string
	filePath string
	mu       sync.Mutex
}

// NewManager creates a new Traefik Dynamic File Provider manager
func NewManager(dynamicDir string) *Manager {
	if dynamicDir == "" {
		dynamicDir = "./deploy/traefik/dynamic"
	}

	filePath := filepath.Join(dynamicDir, "tenants.yml")

	m := &Manager{
		dirPath:  dynamicDir,
		filePath: filePath,
	}

	_ = m.ensureFileExists()
	return m
}

// ensureFileExists ensures the dynamic directory and initial tenants.yml file exist
func (m *Manager) ensureFileExists() error {
	m.mu.Lock()
	defer m.mu.Unlock()

	if err := os.MkdirAll(m.dirPath, 0755); err != nil {
		return fmt.Errorf("failed to create traefik dynamic directory: %w", err)
	}

	if _, err := os.Stat(m.filePath); os.IsNotExist(err) {
		cfg := DynamicConfig{}
		cfg.HTTP.Routers = make(map[string]RouterConfig)
		cfg.HTTP.Services = make(map[string]ServiceConfig)

		data, err := yaml.Marshal(cfg)
		if err != nil {
			return err
		}
		if err := os.WriteFile(m.filePath, data, 0644); err != nil {
			log.Printf("[TRAEFIK SYNC NOTICE] Unable to write initial %s: %v", m.filePath, err)
			return err
		}
		log.Printf("[TRAEFIK SYNC] Initialized dynamic Traefik route file at %s", m.filePath)
	}

	return nil
}

// loadConfig reads the current tenants.yml into memory
func (m *Manager) loadConfig() (DynamicConfig, error) {
	cfg := DynamicConfig{}
	cfg.HTTP.Routers = make(map[string]RouterConfig)
	cfg.HTTP.Services = make(map[string]ServiceConfig)

	data, err := os.ReadFile(m.filePath)
	if err != nil {
		if os.IsNotExist(err) {
			return cfg, nil
		}
		return cfg, err
	}

	if err := yaml.Unmarshal(data, &cfg); err != nil {
		return cfg, err
	}

	if cfg.HTTP.Routers == nil {
		cfg.HTTP.Routers = make(map[string]RouterConfig)
	}
	if cfg.HTTP.Services == nil {
		cfg.HTTP.Services = make(map[string]ServiceConfig)
	}

	return cfg, nil
}

// SyncTenantRoute registers or updates a tenant route in the dynamic Traefik config
func (m *Manager) SyncTenantRoute(routerName, subdomain, customDomain, containerName string) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	cfg, err := m.loadConfig()
	if err != nil {
		log.Printf("[TRAEFIK SYNC WARNING] Failed to load config, initializing fresh: %v", err)
	}

	cleanSub := strings.TrimSuffix(subdomain, ".stackbyte.id")
	cleanSub = strings.TrimSuffix(cleanSub, ".herocms.stackbyte.id")
	cleanSub = strings.TrimSuffix(cleanSub, ".cloudcms.app")

	rule := fmt.Sprintf("Host(`%s.stackbyte.id`)", cleanSub)
	if customDomain != "" {
		rule += fmt.Sprintf(" || Host(`%s`)", customDomain)
	}

	serviceName := fmt.Sprintf("%s-svc", routerName)

	cfg.HTTP.Routers[routerName] = RouterConfig{
		Rule:        rule,
		EntryPoints: []string{"web", "websecure"},
		Service:     serviceName,
		Middlewares: []string{"security-headers"},
	}

	cfg.HTTP.Services[serviceName] = ServiceConfig{
		LoadBalancer: LoadBalancerConfig{
			Servers: []ServerConfig{
				{URL: fmt.Sprintf("http://%s:80", containerName)},
			},
		},
	}

	data, err := yaml.Marshal(cfg)
	if err != nil {
		return fmt.Errorf("failed to marshal traefik dynamic config: %w", err)
	}

	if err := os.WriteFile(m.filePath, data, 0644); err != nil {
		log.Printf("[TRAEFIK SYNC ERROR] Failed to write %s: %v", m.filePath, err)
		return err
	}

	log.Printf("[TRAEFIK DYNAMIC] Synced route for '%s' -> %s (%s)", routerName, rule, containerName)
	return nil
}

// RemoveTenantRoute removes a tenant router and service from the dynamic Traefik config
func (m *Manager) RemoveTenantRoute(routerName string) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	cfg, err := m.loadConfig()
	if err != nil {
		return err
	}

	serviceName := fmt.Sprintf("%s-svc", routerName)
	delete(cfg.HTTP.Routers, routerName)
	delete(cfg.HTTP.Services, serviceName)

	data, err := yaml.Marshal(cfg)
	if err != nil {
		return err
	}

	if err := os.WriteFile(m.filePath, data, 0644); err != nil {
		return err
	}

	log.Printf("[TRAEFIK DYNAMIC] Removed route '%s' from %s", routerName, m.filePath)
	return nil
}
