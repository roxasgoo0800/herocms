package config

import (
	"os"
	"strconv"
)

// Config represents runtime configurations for the Provision Orchestrator daemon
type Config struct {
	Port                string
	DockerSocket        string
	DockerEdgeNetwork   string
	TenantRuntimeImage  string
	TenantStorageBase   string
	TemplatesRuntimeDir string
	TraefikDynamicDir   string
	InternalSecretToken string
	RedisAddr           string
	RedisPassword       string
	RedisDB             int
	KafkaBrokers        string
	RequireInternalAuth bool
}

// LoadConfig populates configuration from environment variables with production-ready defaults
func LoadConfig() *Config {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	dockerSocket := os.Getenv("DOCKER_HOST")
	if dockerSocket == "" {
		dockerSocket = "unix:///var/run/docker.sock"
	}

	edgeNet := os.Getenv("DOCKER_EDGE_NETWORK")
	if edgeNet == "" {
		edgeNet = "herocms_edge_net"
	}

	runtimeImg := os.Getenv("TENANT_RUNTIME_IMAGE")
	if runtimeImg == "" {
		runtimeImg = "roxas0800/tenant-runtime:alpine-v1"
	}

	storageBase := os.Getenv("TENANT_STORAGE_BASE")
	if storageBase == "" {
		// Default to dedicated data directory
		storageBase = "/var/lib/herocms/tenants"
	}

	templatesDir := os.Getenv("TEMPLATES_RUNTIME_DIR")
	if templatesDir == "" {
		candidates := []string{
			"./templates/vue-alpine-runtime",
			"../../templates/vue-alpine-runtime",
			"/templates/vue-alpine-runtime",
		}
		for _, c := range candidates {
			if info, err := os.Stat(c); err == nil && info.IsDir() {
				templatesDir = c
				break
			}
		}
		if templatesDir == "" {
			templatesDir = "./templates/vue-alpine-runtime"
		}
	}

	traefikDynamicDir := os.Getenv("TRAEFIK_DYNAMIC_DIR")
	if traefikDynamicDir == "" {
		candidates := []string{
			"./deploy/traefik/dynamic",
			"../../deploy/traefik/dynamic",
			"/etc/traefik/dynamic",
		}
		for _, c := range candidates {
			if info, err := os.Stat(c); err == nil && info.IsDir() {
				traefikDynamicDir = c
				break
			}
		}
		if traefikDynamicDir == "" {
			traefikDynamicDir = "./deploy/traefik/dynamic"
		}
	}

	secretToken := os.Getenv("INTERNAL_SECRET_TOKEN")
	if secretToken == "" {
		secretToken = "herocms_internal_secret_key_v1"
	}

	redisAddr := os.Getenv("REDIS_ADDR")
	if redisAddr == "" {
		redisAddr = "localhost:6379"
	}

	redisDB := 0
	if dbStr := os.Getenv("REDIS_DB"); dbStr != "" {
		if dbVal, err := strconv.Atoi(dbStr); err == nil {
			redisDB = dbVal
		}
	}

	kafkaBrokers := os.Getenv("KAFKA_BROKERS")
	if kafkaBrokers == "" {
		kafkaBrokers = "localhost:9092"
	}

	requireAuth := true
	if authEnv := os.Getenv("REQUIRE_INTERNAL_AUTH"); authEnv == "false" || authEnv == "0" {
		requireAuth = false
	}

	redisPass := os.Getenv("REDIS_PASSWORD")
	if redisPass == "" {
		redisPass = "secret_redis_password"
	}

	return &Config{
		Port:                port,
		DockerSocket:        dockerSocket,
		DockerEdgeNetwork:   edgeNet,
		TenantRuntimeImage:  runtimeImg,
		TenantStorageBase:   storageBase,
		TemplatesRuntimeDir: templatesDir,
		TraefikDynamicDir:   traefikDynamicDir,
		InternalSecretToken: secretToken,
		RedisAddr:           redisAddr,
		RedisPassword:       redisPass,
		RedisDB:             redisDB,
		KafkaBrokers:        kafkaBrokers,
		RequireInternalAuth: requireAuth,
	}
}
