package db

import (
	_ "embed"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"sync"

	"github.com/cloudcms/herocms-docs/internal/model"
)

//go:embed seeds/tasks.json
var defaultTasksJSON []byte

//go:embed seeds/blueprints.json
var defaultBlueprintsJSON []byte

//go:embed seeds/sops.json
var defaultSOPsJSON []byte

type Database struct {
	mu            sync.RWMutex
	dataFile      string
	tasks         []model.TaskItem
	blueprints    []model.ArchitectureBlueprint
	sops          []model.EnterpriseSOP
	members       []model.TeamMember
	microservices []model.MicroserviceMeta
}

type DatabaseSnapshot struct {
	Tasks []model.TaskItem `json:"tasks"`
}

func NewDatabase(dataDir string) (*Database, error) {
	if err := os.MkdirAll(dataDir, 0755); err != nil {
		return nil, fmt.Errorf("failed to create data dir: %w", err)
	}

	dataFile := filepath.Join(dataDir, "docs_tasks.json")
	d := &Database{
		dataFile: dataFile,
	}

	d.initStaticData()

	// Load existing persisted data or seed from template
	if err := d.loadOrSeed(); err != nil {
		return nil, fmt.Errorf("failed to load database: %w", err)
	}

	return d, nil
}

func (d *Database) loadOrSeed() error {
	d.mu.Lock()
	defer d.mu.Unlock()

	// 1. Try reading existing persisted file
	if _, err := os.Stat(d.dataFile); err == nil {
		data, err := os.ReadFile(d.dataFile)
		if err == nil {
			var snapshot DatabaseSnapshot
			if err := json.Unmarshal(data, &snapshot); err == nil && len(snapshot.Tasks) > 0 {
				d.tasks = snapshot.Tasks
				return nil
			}
		}
	}

	// 2. Load from embedded seeds
	if len(defaultTasksJSON) > 0 {
		var tasks []model.TaskItem
		if err := json.Unmarshal(defaultTasksJSON, &tasks); err == nil && len(tasks) > 0 {
			d.tasks = tasks
			d.saveSnapshotLocked()
			return nil
		}
	}

	// 3. Try loading from /tmp/herocms_pm_tasks.json
	if tmpData, err := os.ReadFile("/tmp/herocms_pm_tasks.json"); err == nil {
		var tasks []model.TaskItem
		if err := json.Unmarshal(tmpData, &tasks); err == nil && len(tasks) > 0 {
			d.tasks = tasks
			d.saveSnapshotLocked()
			return nil
		}
	}

	// 4. Fallback: initialized empty tasks or default set
	d.saveSnapshotLocked()
	return nil
}

func (d *Database) saveSnapshotLocked() {
	snapshot := DatabaseSnapshot{
		Tasks: d.tasks,
	}
	data, err := json.MarshalIndent(snapshot, "", "  ")
	if err == nil {
		_ = os.WriteFile(d.dataFile, data, 0644)
	}
}

// GetTasks returns tasks with optional filter by division, service, or query
func (d *Database) GetTasks(division, serviceGroup, q string) []model.TaskItem {
	d.mu.RLock()
	defer d.mu.RUnlock()

	q = strings.ToLower(strings.TrimSpace(q))
	var result []model.TaskItem

	for _, t := range d.tasks {
		if division != "" && division != "all" && t.Division != division {
			continue
		}
		if serviceGroup != "" && serviceGroup != "all" && t.ServiceGroup != serviceGroup {
			continue
		}
		if q != "" {
			match := strings.Contains(strings.ToLower(t.Title), q) ||
				strings.Contains(strings.ToLower(t.Lead), q) ||
				strings.Contains(strings.ToLower(t.Category), q) ||
				strings.Contains(strings.ToLower(t.ID), q) ||
				strings.Contains(strings.ToLower(t.CodeFile), q)
			if !match {
				continue
			}
		}
		result = append(result, t)
	}

	return result
}

// GetTaskByID retrieves a single task by ID
func (d *Database) GetTaskByID(id string) (*model.TaskItem, bool) {
	d.mu.RLock()
	defer d.mu.RUnlock()

	for _, t := range d.tasks {
		if t.ID == id {
			taskCopy := t
			return &taskCopy, true
		}
	}
	return nil, false
}

// UpdateChecklist updates a checklist item and persists to disk
func (d *Database) UpdateChecklist(taskID string, itemIndex int, isDone bool) (*model.TaskItem, error) {
	d.mu.Lock()
	defer d.mu.Unlock()

	for i := range d.tasks {
		if d.tasks[i].ID == taskID {
			if itemIndex < 0 || itemIndex >= len(d.tasks[i].Checklist) {
				return nil, fmt.Errorf("checklist index %d out of range (max %d)", itemIndex, len(d.tasks[i].Checklist)-1)
			}
			d.tasks[i].Checklist[itemIndex].Done = isDone
			d.saveSnapshotLocked()

			updatedTask := d.tasks[i]
			return &updatedTask, nil
		}
	}

	return nil, fmt.Errorf("task with id %s not found", taskID)
}

// GetTelemetry calculates stats
func (d *Database) GetTelemetry() model.TelemetryStats {
	d.mu.RLock()
	defer d.mu.RUnlock()

	ongoing := 0
	for _, t := range d.tasks {
		if t.Status == "ONGOING" {
			ongoing++
		}
	}

	return model.TelemetryStats{
		TotalTasks:      len(d.tasks),
		OngoingTasks:    ongoing,
		TotalServices:   len(d.microservices),
		TotalMembers:    len(d.members),
		TotalBlueprints: len(d.blueprints),
		TotalSOPs:       len(d.sops),
	}
}

func (d *Database) GetBlueprints() []model.ArchitectureBlueprint {
	d.mu.RLock()
	defer d.mu.RUnlock()
	return d.blueprints
}

func (d *Database) GetSOPs() []model.EnterpriseSOP {
	d.mu.RLock()
	defer d.mu.RUnlock()
	return d.sops
}

func (d *Database) GetMembers() []model.TeamMember {
	d.mu.RLock()
	defer d.mu.RUnlock()
	return d.members
}

func (d *Database) GetServices() []model.MicroserviceMeta {
	d.mu.RLock()
	defer d.mu.RUnlock()
	return d.microservices
}

func (d *Database) initStaticData() {
	d.members = []model.TeamMember{
		{
			ID: "Rizal", Name: "Rizal", Role: "DevOps, Security & Rancang Bangun Awal",
			PIC: "Rizal (Pelaksana Aktif)", Icon: "🛡️⚙️", Handover: "Rizal (PIC Ingress & Security)",
			Focus: "Traefik SSL Ingress, cgroups Linux 256MB, pentest suite, serta merintis tampilan awal & handler awal.",
			Responsibilities: "Menjaga keamanan gerbang server, hardening cgroups v2, dan automated pentest runner.",
		},
		{
			ID: "Andalusia", Name: "Andalusia", Role: "Full Stack Lead (Jago Backend & Frontend)",
			PIC: "Rizal (Fondasi Siap)", Icon: "⚙️", Handover: "Andalusia (Target Handover Backend)",
			Focus: "Mesin Docker SDK (03), API BFF (02), dan kasir pembayaran Midtrans (01).",
			Responsibilities: "Menguasai backend Go Gin, Laravel Filament Admin, dan integrasi OpenAPI.",
		},
		{
			ID: "Irgi", Name: "Irgi", Role: "Frontend Web Specialist (Studio & Marketing)",
			PIC: "Rizal (UI Selesai Dicentang)", Icon: "🎨", Handover: "Irgi (Target Handover Frontend)",
			Focus: "Dashboard Studio Vue 3 (02) dan Website Marketing React 19 (04).",
			Responsibilities: "Keindahan visual, interaksi drag-and-drop blok 60fps, dan responsive mobile.",
		},
		{
			ID: "Risqi", Name: "Risqi", Role: "Database Management Specialist",
			PIC: "Rizal (Skema Mock Siap)", Icon: "🗄️", Handover: "Risqi (Target Handover Database)",
			Focus: "PostgreSQL 16 RLS, Redis 7 ZSET (<1ms), MinIO S3, dan automated backup cron.",
			Responsibilities: "Isolasi data multi-tenant kernel RLS, tuning indeks, dan disaster recovery.",
		},
		{
			ID: "Tyno", Name: "Tyno", Role: "Mobile Apps Specialist (Jago Frontend Mobile)",
			PIC: "Rizal (Kontrak API Siap)", Icon: "📱", Handover: "Tyno (Target Handover Mobile)",
			Focus: "HeroCMS Companion App (Flutter / React Native) untuk Android & iOS.",
			Responsibilities: "Live telemetry monitoring di saku, push notif FCM leads/invoice, dan reboot FaceID.",
		},
		{
			ID: "Paijo", Name: "Paijo (AI Agent)", Role: "Lead Project Manager & QA/QC Specialist",
			PIC: "Paijo (Karyawan PM & QA/QC)", Icon: "🤖🔍", Handover: "Paijo (PM & QA/QC Specialist)",
			Focus: "Sprint backlog orchestration, Definition of Done (DoD) gate, E2E Playwright, dan Pentest audit.",
			Responsibilities: "Mendistribusikan task tanpa henti, memvalidasi kualitas rilis, dan menjaga roadmap.",
		},
	}

	d.microservices = []model.MicroserviceMeta{
		{
			ID: "01-admin-console", Name: "Service 01: Admin Console & Billing",
			Path: "services/01-admin-console", Stack: "Laravel 11 • Filament v3 • PHP 8.3 • Midtrans",
			PIC: "Andalusia, Risqi & Paijo (QA)", Icon: "🏛️",
			Lead: "Panel kontrol internal superadmin untuk mengelola tenant, verifikasi langganan, faktur, webhook Midtrans, dan verifikasi kontrak API.",
		},
		{
			ID: "02-dashboard-cms", Name: "Service 02: Dashboard Studio & Go BFF",
			Path: "services/02-dashboard-cms", Stack: "Vue 3 • Vite • Pinia • Gin Golang (Port 8085) • Redis",
			PIC: "Irgi, Rizal, Andalusia & Paijo (QA)", Icon: "🎨",
			Lead: "Pusat antarmuka utama pengguna (12 Modul Studio), backend Go BFF (port 8085), visual editor blok, artikel, media, custom domain, dan analitik.",
		},
		{
			ID: "03-provision-orchestrator", Name: "Service 03: Container Provision Orchestrator & Infra",
			Path: "services/03-provision-orchestrator", Stack: "Golang • Docker Engine SDK • Linux cgroups v2 • Traefik v3",
			PIC: "Andalusia, Rizal & Paijo (QC)", Icon: "⚙️",
			Lead: "Mesin otonom pembuat dan pengatur siklus hidup kontainer Docker mandiri tenant dengan cgroups sandboxing (RAM 256MB/CPU 0.5), Traefik ingress SSL, dan automated backup cron.",
		},
		{
			ID: "04-marketing-site", Name: "Service 04: Marketing Site & Public Landing",
			Path: "services/04-marketing-site", Stack: "React 19 • TypeScript • Tailwind CSS • Vite",
			PIC: "Irgi & Paijo (QA)", Icon: "🚀",
			Lead: "Website pemasaran publik utama HeroCMS untuk landing page berkonversi tinggi, showcase playground interaktif, kalkulator harga, dan pendaftaran tenant baru.",
		},
		{
			ID: "05-ai-agent-service", Name: "Service 05: AI Agent Service & Workflows",
			Path: "services/05-ai-agent-service", Stack: "Golang / Python • Gemini API • Claude LLM • n8n",
			PIC: "Andalusia", Icon: "🤖",
			Lead: "Microservice kecerdasan buatan untuk copilot penulisan konten otomatis di visual editor, generator template tema website dari teks prompt, dan alur kerja n8n auto-poster.",
		},
		{
			ID: "06-mobile-companion", Name: "Service 06: Mobile Companion Platform",
			Path: "mobile-companion/", Stack: "Flutter / React Native • Firebase Cloud Messaging",
			PIC: "Tyno", Icon: "📱",
			Lead: "Aplikasi mobile smartphone Android & iOS pendamping pemilik website untuk memantau pengunjung live, menerima notifikasi pesan baru & invoice, dan reboot darurat lewat FaceID.",
		},
	}

	if len(defaultBlueprintsJSON) > 0 {
		_ = json.Unmarshal(defaultBlueprintsJSON, &d.blueprints)
	}

	if len(defaultSOPsJSON) > 0 {
		_ = json.Unmarshal(defaultSOPsJSON, &d.sops)
	}
}
