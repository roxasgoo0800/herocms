package db

import (
	"os"
	"testing"
)

func TestNewDatabase_Seeds(t *testing.T) {
	tmpDir, err := os.MkdirTemp("", "docs_db_test_*")
	if err != nil {
		t.Fatal(err)
	}
	defer os.RemoveAll(tmpDir)

	database, err := NewDatabase(tmpDir)
	if err != nil {
		t.Fatalf("Failed to init database: %v", err)
	}

	tasks := database.GetTasks("", "", "")
	if len(tasks) < 50 {
		t.Errorf("Expected at least 50 tasks, got %d", len(tasks))
	}

	blueprints := database.GetBlueprints()
	if len(blueprints) < 13 {
		t.Errorf("Expected at least 13 blueprints, got %d", len(blueprints))
	}

	sops := database.GetSOPs()
	if len(sops) < 10 {
		t.Errorf("Expected at least 10 SOPs, got %d", len(sops))
	}

	members := database.GetMembers()
	if len(members) != 6 {
		t.Errorf("Expected 6 members, got %d", len(members))
	}

	services := database.GetServices()
	if len(services) != 6 {
		t.Errorf("Expected 6 services, got %d", len(services))
	}
}
