---
name: herocms-go-orchestrator
description: Standar pengembangan backend Golang untuk layanan HeroCMS, mencakup Docker Engine SDK orchestration, isolasi kontainer tenant, graceful shutdown, context propagation, dan error handling di services/03-provision-orchestrator, services/02-dashboard-cms, dan services/05-ai-agent-service.
---

# HeroCMS Go Microservices & Provision Orchestrator Skill (`herocms-go-orchestrator`)

Skill ini memandu AI Agent dalam menulis, memodifikasi, dan mengaudit kode backend berbasis Golang (khususnya Go 1.23+) pada ekosistem HeroCMS.

---

## 1. Lingkup Layanan Go di HeroCMS

1. **`services/03-provision-orchestrator`**:
   * Orkestrasi Docker Engine SDK lokal via Unix Socket (`/var/run/docker.sock`).
   * Manajemen siklus hidup kontainer tenant (Create, Start, Stop, Pause, Destroy, Inspect).
   * Injeksi batas kuota hardware (cgroups CPU quota, Memory limit).
   * Injeksi label dinamis Traefik v3 untuk reverse routing instan tanpa restart gateway.
2. **`services/02-dashboard-cms/cmd` & `internal/`**:
   * HTTP API server pendamping dashboard (Go Fiber / Gin / stdlib HTTP).
   * Middleware autentikasi JWT, session check, dan logging latency.
3. **`services/05-ai-agent-service`**:
   * Worker pemrosesan antrean asynchronous (Kafka/Redpanda/Redis streams).

---

## 2. Standar Penggunaan Docker Engine SDK

Saat berinteraksi dengan Docker Daemon di `03-provision-orchestrator`:

### A. Client Initialization & Context Timeout
Selalu sertakan batas waktu (`context.WithTimeout`) untuk mencegah operasi Docker menggantung tanpa batas jika daemon sibuk:

```go
ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
defer cancel()

cli, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
if err != nil {
    return fmt.Errorf("failed to init docker client: %w", err)
}
defer cli.Close()
```

### B. Isolasi Sumber Daya Tenant (Resource Quota & Security)
Setiap kontainer tenant wajib menerapkan batasan resource di `container.HostConfig`:

```go
hostConfig := &container.HostConfig{
    Resources: container.Resources{
        Memory:   256 * 1024 * 1024, // Contoh 256MB per tenant
        NanoCPUs: 500_000_000,        // 0.5 vCPU
    },
    RestartPolicy: container.RestartPolicy{
        Name: "unless-stopped",
    },
    NetworkMode: "traefik_network",
}
```

### C. Injeksi Label Dinamis Traefik v3
Gunakan penamaan router yang unik berdasarkan `tenant_id` atau `subdomain`:

```go
labels := map[string]string{
    "traefik.enable": "true",
    "traefik.docker.network": "traefik_network",
    fmt.Sprintf("traefik.http.routers.%s.rule", tenantID): fmt.Sprintf("Host(`%s.herocms.stackbyte.id`)", subdomain),
    fmt.Sprintf("traefik.http.routers.%s.entrypoints", tenantID): "web",
    fmt.Sprintf("traefik.http.services.%s.loadbalancer.server.port", tenantID): "80",
}
```

---

## 3. Idiomatic Go & Error Handling

- **Wrap Errors dengan Konteks**: Jangan return bare error. Gunakan `fmt.Errorf("action context: %w", err)`.
- **Graceful Shutdown**: Tangani sinyal OS (`os.Interrupt`, `syscall.SIGTERM`) agar proses flush koneksi database dan menyelesaikan in-flight request:
  ```go
  quit := make(chan os.Signal, 1)
  signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
  <-quit
  log.Println("Shutting down service gracefully...")
  ```
- **Concurrency & Mutex**: Jika mengelola in-memory state kontainer atau cache metrics, selalu lindungi shared state menggunakan `sync.RWMutex`.
