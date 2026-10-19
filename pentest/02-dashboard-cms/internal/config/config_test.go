package config

import (
	"os"
	"testing"
)

func TestLoadConfig_Defaults(t *testing.T) {
	// Clear env vars that might interfere
	os.Unsetenv("APP_ENV")
	os.Unsetenv("ENV")
	os.Unsetenv("ALLOW_DEV_AUTH_BYPASS")

	cfg := LoadConfig()

	if cfg.Port == "" {
		t.Errorf("expected default port to be non-empty")
	}

	if cfg.Environment != "development" {
		t.Errorf("expected default environment to be 'development', got %q", cfg.Environment)
	}

	if !cfg.AllowDevAuthBypass {
		t.Errorf("expected AllowDevAuthBypass to be true in development mode")
	}

	if len(cfg.JWTSecret) == 0 {
		t.Errorf("expected JWTSecret to be populated")
	}
}

func TestLoadConfig_ProductionDisablesBypass(t *testing.T) {
	os.Setenv("APP_ENV", "production")
	defer os.Unsetenv("APP_ENV")

	cfg := LoadConfig()

	if cfg.Environment != "production" {
		t.Errorf("expected environment 'production', got %q", cfg.Environment)
	}

	// Security Pilar 11: Dev bypass MUST be disabled in production
	if cfg.AllowDevAuthBypass {
		t.Errorf("CRITICAL SECURITY: AllowDevAuthBypass must be FALSE in production!")
	}
}
