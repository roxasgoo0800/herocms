# HeroCMS Headless Provision Orchestrator Daemon (Service 03)

Master Control Plane otonom berbasis **Golang murni (headless)** berkecepatan tinggi tanpa dashboard UI. Bertanggung jawab penuh sebagai pengendali lifecycle Docker, manajemen volume penyimpanan persisten, injeksi label Traefik v3, sinkronisasi state via Redis distributed mutex, dan penyiaran event via Kafka.

---

## 🔒 Arsitektur Jaringan (Strict Local-Only)

Microservice ini dirancang untuk beroperasi di dalam jaringan internal (`herocms_internal_net`):
- **Zero Public Exposure**: Tidak di-expose ke port luar internet dan tidak memiliki router rule Traefik publik.
- **Direct CMS Hit**: Dapat di-hit langsung secara lokal oleh Service 02 (Dashboard CMS) atau microservice backend lainnya via HTTP internal.
- **Internal Security Guard**: Dilindungi header keamanan `X-HeroCMS-Internal-Secret: <SECRET_KEY>` untuk mencegah akses tidak sah dari lingkungan kontainer lain.

---

## ⚙️ Variabel Lingkungan (Environment Variables)

| Variabel | Default | Keterangan |
| :--- | :--- | :--- |
| `PORT` | `8080` | Port listen internal daemon |
| `DOCKER_HOST` | `unix:///var/run/docker.sock` | Unix domain socket Docker daemon |
| `DOCKER_EDGE_NETWORK` | `herocms_edge_net` | Jaringan Traefik untuk menghubungkan kontainer tenant |
| `TENANT_RUNTIME_IMAGE` | `cloudcms-tenant-runtime:alpine-v1` | Base image container runtime tenant |
| `TENANT_STORAGE_BASE` | `/var/lib/herocms/tenants` | Root direktori alokasi volume storage tenant |
| `INTERNAL_SECRET_TOKEN`| `herocms_internal_secret_key_v1` | Token rahasia internal antar-service |
| `REQUIRE_INTERNAL_AUTH`| `true` | Menyalakan/mematikan verifikasi header secret |
| `REDIS_ADDR` | `localhost:6379` | Alamat kluster Redis untuk mutex lock & state cache |
| `KAFKA_BROKERS` | `localhost:9092` | Broker Kafka untuk event lifecycle streaming |

---

## 📡 Daftar REST API Internal

Semua rute `/api/v1/*` mewajibkan header `X-HeroCMS-Internal-Secret: <TOKEN>` (kecuali liveness probe `/healthz` dan `/readyz`).

| Method | Endpoint | Keterangan |
| :--- | :--- | :--- |
| `GET` | `/healthz` | Liveness probe status daemon |
| `GET` | `/readyz` | Readiness probe (status Docker socket, Redis, Storage) |
| `POST` | `/api/v1/containers/provision` | Membuat kontainer tenant baru + alokasi storage + label Traefik |
| `POST` | `/api/v1/deploy` | Alias backward-compatible untuk endpoint provision |
| `GET` | `/api/v1/containers` | Daftar seluruh kontainer tenant yang dikelola |
| `GET` | `/api/v1/containers/:id` | Detail metadata kontainer dan status cgroups |
| `POST` | `/api/v1/containers/:id/start` | Menyalakan kontainer |
| `POST` | `/api/v1/containers/:id/stop` | Mematikan kontainer secara aman (timeout 10s) |
| `POST` | `/api/v1/containers/:id/restart` | Emergency reboot dengan drainage |
| `DELETE` | `/api/v1/containers/:id` | Menghapus kontainer (Opsi: `?purge_storage=true`) |
| `GET` | `/api/v1/containers/:id/stats` | Snapshot metrik real-time CPU, RAM, dan Network I/O |
| `GET` | `/api/v1/containers/:id/logs` | Mengambil log kontainer (query `?tail=100`) |
| `POST` | `/api/v1/storage/provision` | Inisialisasi folder storage persisten per-tenant |
| `GET` | `/api/v1/storage/:tenant_id` | Mengetahui kalkulasi ukuran disk storage tenant |
| `DELETE` | `/api/v1/storage/:tenant_id` | Menghapus total storage direktori tenant |
| `GET` | `/api/v1/events` | Audit trail riwayat event Kafka terkini |
| `GET` | `/api/v1/state/:tenant_id` | Snapshot status kontainer dari cache Redis |

---

## 🛡️ Standar Sandboxing Linux cgroups v2

Setiap kontainer tenant yang di-spawn menerapkan konfigurasi isolasi tingkat tinggi:
- **Memory Hard Limit**: `256 MB` (`MemorySwap == Memory`, swap dimatikan)
- **CPU Quota**: `0.5 vCPU` (`NanoCPUs: 500_000_000`)
- **PIDs Limit**: `50` (pencegahan serangan *fork bomb*)
- **Non-root User**: UID/GID `10001:10001` (`cmsrunner`)
- **Readonly Rootfs**: `true` dengan `/tmp` dan `/run` bertipe `tmpfs` berbendera `noexec,nosuid,nodev`
- **Capabilities**: Drop `ALL`, Add `NET_BIND_SERVICE`
- **Privilege Escalation**: `no-new-privileges:true`

---

## 🧪 Pengujian Unit & Pentest Pre-Commit

Jalankan seluruh suite verifikasi kualitas sebelum commit:

```bash
# 1. Unit tests
go test -v ./internal/...

# 2. Pentest security suite
go test -v ./pentest/...

# 3. Build binary
go build -buildvcs=false -o /dev/null ./cmd/api
```
