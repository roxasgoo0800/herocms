# Template: Vue Alpine Runtime (Tenant Base Image)

Image dasar kontainer Docker yang digunakan oleh Go Provisioning Orchestrator untuk setiap website pelanggan yang diterbitkan.

## Fitur Keamanan:
- Menjalankan Nginx 1.27 Alpine super-ringan (< 25MB).
- Pengguna non-root (`UID 10001: cmsrunner`).
- Endpoint `/healthz` internal untuk pengecekan kesiapan Traefik.
- Konfigurasi gzip dan header keamanan CSP default.

## Cara Build Image:
```bash
docker build -t cloudcms-tenant-runtime:alpine-v1 .
```
