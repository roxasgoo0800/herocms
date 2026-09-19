package config

import (
	"bufio"
	"crypto/rand"
	"log"
	"os"
	"strings"
)

type Config struct {
	Port            string
	JWTSecret       []byte
	DBHost          string
	DBPort          string
	DBUser          string
	DBPass          string
	DBName          string
	RedisHost       string
	RedisPort       string
	RedisPass       string
	OrchestratorURL string
	DistDir         string
}

func loadEnvFile() {
	candidates := []string{".env", "../../.env", "../.env", "services/02-dashboard-cms/.env"}
	for _, f := range candidates {
		file, err := os.Open(f)
		if err == nil {
			defer file.Close()
			scanner := bufio.NewScanner(file)
			for scanner.Scan() {
				line := strings.TrimSpace(scanner.Text())
				if line == "" || strings.HasPrefix(line, "#") {
					continue
				}
				parts := strings.SplitN(line, "=", 2)
				if len(parts) == 2 {
					key := strings.TrimSpace(parts[0])
					val := strings.TrimSpace(parts[1])
					val = strings.Trim(val, `"'`)
					if _, exists := os.LookupEnv(key); !exists {
						os.Setenv(key, val)
					}
				}
			}
			log.Printf("[CONFIG] Loaded environment variables from %s", f)
			return
		}
	}
}

func LoadConfig() *Config {
	loadEnvFile()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8085"
	}

	dbHost := os.Getenv("DB_HOST")
	if dbHost == "" {
		dbHost = "127.0.0.1"
	}
	dbPort := os.Getenv("DB_PORT")
	if dbPort == "" {
		dbPort = "5432"
	}
	dbUser := os.Getenv("DB_USERNAME")
	if dbUser == "" {
		dbUser = "cloudcms_user"
	}
	dbPass := os.Getenv("DB_PASSWORD")
	if dbPass == "" {
		dbPass = "secret_postgres_password"
	}
	dbName := os.Getenv("DB_DATABASE")
	if dbName == "" {
		dbName = "cloudcms_db"
	}

	redisHost := os.Getenv("REDIS_HOST")
	if redisHost == "" {
		redisHost = "127.0.0.1"
	}
	redisPort := os.Getenv("REDIS_PORT")
	if redisPort == "" {
		redisPort = "6379"
	}
	redisPass := os.Getenv("REDIS_PASSWORD")
	if redisPass == "" {
		redisPass = "secret_redis_password"
	}

	orchURL := os.Getenv("ORCHESTRATOR_URL")
	if orchURL == "" {
		orchURL = "http://127.0.0.1:8080"
	}

	distDir := os.Getenv("DIST_DIR")
	if distDir == "" {
		distDir = "./dist"
	}

	jwtSecretStr := os.Getenv("JWT_SECRET")
	var jwtSecret []byte
	if jwtSecretStr != "" {
		jwtSecret = []byte(jwtSecretStr)
	} else {
		jwtSecret = make([]byte, 32)
		if _, err := rand.Read(jwtSecret); err != nil {
			log.Fatalf("Failed to generate secure random JWT secret: %v", err)
		}
		log.Println("[CONFIG NOTICE] JWT_SECRET not found in env. Generated ephemeral crypto/rand secret.")
	}

	return &Config{
		Port:            port,
		JWTSecret:       jwtSecret,
		DBHost:          dbHost,
		DBPort:          dbPort,
		DBUser:          dbUser,
		DBPass:          dbPass,
		DBName:          dbName,
		RedisHost:       redisHost,
		RedisPort:       redisPort,
		RedisPass:       redisPass,
		OrchestratorURL: orchURL,
		DistDir:         distDir,
	}
}
