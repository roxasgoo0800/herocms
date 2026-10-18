---
name: herocms-traefik-infra
description: Panduan arsitektur infrastruktur Docker Compose, Traefik v3 Edge Ingress, multi-network topology, dan dynamic label routing untuk ekosistem HeroCMS. Gunakan saat mengelola docker-compose.yml, labels Traefik, dan konfigurasi reverse proxy.
---

# HeroCMS Traefik & Docker Infrastructure Skill (`herocms-traefik-infra`)

Skill ini memandu AI Agent dalam mengonfigurasi, mengaudit, dan memelihara infrastruktur kontainer Docker serta perutean tepi (*edge routing*) menggunakan **Traefik v3** (tanpa ketergantungan pada Nginx monolitik pusat).

---

## 1. Topologi Jaringan (Docker Networks)

Infrastruktur HeroCMS membagi lalu lintas kontainer ke dalam 3 jaringan terpisah:

1. **`app-network` (Internal Bridge)**:
   * Menghubungkan PostgreSQL, Redis, dan microservices internal backend.
   * Tidak terekspos langsung ke internet publik.
2. **`traefik_network` (External Ingress)**:
   * Jaringan publik Traefik v3.
   * Hanya container yang memiliki endpoint web (Marketing Site, Studio Dashboard, Kontainer Tenant) yang bergabung ke jaringan ini.
3. **`redis-net` / `redis-net-local` (External Shared Cache)**:
   * Jaringan untuk akses caching lintas-layanan.

### Menyiapkan Jaringan Sebelum Deployment:
```bash
docker network create traefik_network 2>/dev/null || true
docker network create redis-net-local 2>/dev/null || true
```

---

## 2. Standar Label Traefik v3 pada Docker Compose

Saat menambahkan atau memodifikasi service berorientasi web di `docker-compose.yml`:

```yaml
labels:
  - "traefik.enable=true"
  - "traefik.docker.network=traefik_network"
  
  # HTTP Router
  - "traefik.http.routers.herocms-studio.rule=Host(`studio.herocms.stackbyte.id`)"
  - "traefik.http.routers.herocms-studio.entrypoints=web"
  
  # Service Target Port
  - "traefik.http.services.herocms-studio.loadbalancer.server.port=3000"
  
  # Optional: Security Headers / StripPrefix Middleware
  - "traefik.http.routers.herocms-studio.middlewares=studio-headers"
  - "traefik.http.middlewares.studio-headers.headers.customresponseheaders.X-Frame-Options=SAMEORIGIN"
  - "traefik.http.middlewares.studio-headers.headers.customresponseheaders.X-Content-Type-Options=nosniff"
```

---

## 3. Healthcheck & Zero-Downtime Deployment

Setiap service persisten (Postgres, Redis, API) **wajib** menyertakan block `healthcheck` valid:

- **PostgreSQL**:
  ```yaml
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U ${DB_USERNAME:-cloudcms_user} -d ${DB_DATABASE:-cloudcms_db}"]
    interval: 5s
    timeout: 4s
    retries: 5
  ```
- **Redis**:
  ```yaml
  healthcheck:
    test: ["CMD", "redis-cli", "-a", "${REDIS_PASSWORD}", "ping"]
    interval: 5s
    timeout: 3s
    retries: 3
  ```

---

## 4. Checklist Verifikasi AI Agent

Sebelum menyelesaikan perubahan pada file Docker:
1. Pastikan tidak ada hardcoded credential plaintext di file compose yang di-commit (gunakan fallback `${VAR:-default}`).
2. Pastikan port host (`ports: "5432:5432"`) hanya dibuka jika benar-benar diperlukan untuk debugging lokal.
3. Jalankan `docker compose config` untuk memvalidasi sintaks YAML sebelum restart service.
