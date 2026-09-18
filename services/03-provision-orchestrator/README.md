# Program 3: Provisioning & Deployment Orchestrator API (Golang)

Microservice Golang berkecepatan tinggi yang bertindak sebagai "pabrik kontainer", berkomunikasi langsung dengan Docker Engine API via socket `/var/run/docker.sock`.

## 🚀 Cara Menjalankan Lokal

```bash
cd services/03-provision-orchestrator
go run cmd/api/main.go
```

Endpoint tersedia di: `http://localhost:8080`
- `GET /healthz`: Health check status orchestrator.
- `POST /api/v1/deploy`: Memicu pembuatan kontainer tenant baru.
- `GET /api/v1/containers`: Melihat daftar kontainer tenant yang aktif.
