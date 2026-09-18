# Program 5: Layanan AI Agent & Analitik Data (Golang)

Layanan kecerdasan buatan untuk sintesis tema kustom berbasis prompt teks dan kalkulasi data ranking Top Views menggunakan Redis Sorted Sets (`ZSET`).

## 🚀 Cara Menjalankan Lokal

```bash
cd services/05-ai-agent-service
go run cmd/worker/main.go
```

Endpoint tersedia di: `http://localhost:8082`
- `POST /api/v1/ai/template/generate`: Generator token tema JSON dari prompt teks.
- `POST /api/v1/telemetry/hit`: Penerima event kunjungan pengunjung.
- `GET /api/v1/analytics/top-views`: Pengambilan data ranking Top Views instan (< 1ms).
