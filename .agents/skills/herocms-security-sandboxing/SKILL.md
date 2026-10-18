---
name: herocms-security-sandboxing
description: Standar audit keamanan aplikasi web, backend Go/Laravel, sandboxing kontainer tenant, mitigasi OWASP Top 10, dan 20 pilar checklist keamanan di HeroCMS. Gunakan saat mengedit autentikasi, upload file, query SQL, konfigurasi Docker/Traefik, atau endpoint API.
---

# HeroCMS Security & Sandboxing Audit Skill (`herocms-security-sandboxing`)

Skill ini memandu AI Agent dalam menerapkan standar keamanan kelas enterprise, pengerasan (*hardening*) sandboxing kontainer Docker, mitigasi celah OWASP Top 10, dan penegakan **20 Pilar Praktis Keamanan Web & Backend** di seluruh repositori HeroCMS sesuai [`docs/SECURITY_AND_SANDBOXING.md`](file:///home/rizal/Documents/Project/herocms/docs/SECURITY_AND_SANDBOXING.md).

---

## 1. Matriks 20 Pilar Praktis Keamanan Web & Backend

Setiap kali AI Agent menulis atau memodifikasi kode, AI **WAJIB** mengecek checklist berikut:

1. **API Key Aman**:
   * Prefix standar: `hc_live_...` atau `hc_test_...`.
   * Simpan hanya hash SHA-256 dari key di database; raw key hanya ditampilkan sekali kepada pengguna.
2. **.env Jangan Public**:
   * Pastikan `.env`, `.env.local`, dan `.env.*` ada di `.gitignore`.
   * Blokir akses berkas tersembunyi `/\.` di reverse proxy (Traefik/Nginx).
3. **No Hardcode Secret**:
   * Dilarang keras menaruh credentials/secret di kode sumber (Go, TS, Vue, PHP, Compose). Selalu gunakan `os.Getenv()` atau file environment.
4. **Cek Secret di Git**:
   * Jangan pernah meng-commit private key, token JWT secret, atau password database.
5. **Debug Mode OFF**:
   * Production mode wajib: `GIN_MODE=release`, `APP_DEBUG=false`, `NODE_ENV=production`.
6. **Error Jangan Bocor**:
   * Tangkap internal errors dan kirimkan respon generik ke klien dengan `request_id` unik. Dilarang menampilkan stack trace atau SQL error mentah ke antarmuka pengguna.
7. **Validasi Input**:
   * Validasi tipe data, format (UUID, Email, URL), batas karakter, dan boundary number pada semua payload HTTP sebelum diproses.
8. **Sanitasi Input**:
   * Trim whitespace, escape special characters, dan gunakan DOMPurify untuk konten HTML.
9. **Anti SQL Injection**:
   * 100% kueri database wajib menggunakan *parameterized queries* (`pgx` di Go / ORM). DILARANG melakukan string concatenation (`fmt.Sprintf("SELECT * WHERE id = '%s'", id)`).
10. **Anti XSS**:
    * Konten rich-text disimpan dalam format JSON AST (ProseMirror), bukan string HTML mentah. Sanitasi dengan DOMPurify dan aktifkan header CSP.
11. **Server-Side Auth**:
    * Otorisasi dan validasi token JWT mutlak diproses di server. Jangan pernah mengandalkan verifikasi murni di browser client.
12. **Cek Akses User (Anti-IDOR)**:
    * Setiap pengambilan data spesifik (`GET /articles/:id`) wajib memvalidasi kepemilikan tenant (`tenant_id == current_tenant_id`).
13. **Role Admin Aman (RBAC)**:
    * Pisahkan hak akses role secara eksplisit (SuperAdmin vs Tenant Owner vs Tenant Editor).
14. **DB Jangan Public**:
    * Port 5432 (Postgres) dan 6379 (Redis) hanya boleh berjalan di jaringan internal Docker (`app-network`). Dilarang expose ke `0.0.0.0`.
15. **DB Permission Ketat**:
    * Terapkan prinsip *least privilege* pada user database aplikasi dan enforce PostgreSQL Row-Level Security (RLS).
16. **Hash Password**:
    * Gunakan fungsi hash adaptif modern: Argon2id atau bcrypt (*cost factor* minimal 12) dengan salt unik otomatis. Dilarang menggunakan MD5 atau SHA-1.
17. **Session Aman**:
    * Cookie sesi wajib berstatus `HttpOnly; Secure; SameSite=Lax` (`herocms_session`). Simpan metadata sesi di Redis dengan TTL.
18. **Reset Password Aman**:
    * Token reset wajib acak kriptografis (CSPRNG), *single-use*, dan kadaluarsa maksimal 15 menit.
19. **Batasi Upload File**:
    * Batas ukuran berkas maksimal (25 MB), batas kuota total akun (2 GB per tenant), serta whitelist ekstensi dan MIME type yang diizinkan.
20. **Scan Upload File**:
    * Cek **Magic Bytes** (512 byte awal via `http.DetectContentType`) untuk mendeteksi biner berbahaya yang menyamar. Bersihkan nama file dari karakter path-traversal (`../`).

---

## 2. Parameter Sandboxing Kontainer Tenant (Go Orchestrator)

Ketika memodifikasi modul orkestrator (`services/03-provision-orchestrator`), parameter Docker Engine SDK berikut **wajib dipertahankan**:

```go
hostConfig := &container.HostConfig{
    Resources: container.Resources{
        Memory:     256 * 1024 * 1024, // Maksimal 256 MB RAM
        MemorySwap: 256 * 1024 * 1024, // Tanpa swap
        NanoCPUs:   500_000_000,        // 0.5 vCPU
        PidsLimit:  func(i int64) *int64 { return &i }(50), // Anti fork-bomb
    },
    ReadonlyRootfs: true, // Filesystem sistem hanya-baca
    SecurityOpt: []string{
        "no-new-privileges:true",
    },
    CapDrop: []string{"ALL"},
    CapAdd:  []string{"NET_BIND_SERVICE"},
    Tmpfs: map[string]string{
        "/tmp": "size=16m,noexec,nosuid,nodev", // Eksekusi biner di /tmp diblokir
        "/run": "size=4m,noexec,nosuid,nodev",
    },
}
```

---

## 3. Checklist Sebelum Commit / Finalisasi Kode

Sebelum melaporkan pekerjaan selesai kepada pengguna:
1. Pastikan tidak ada credential, password, atau private key yang tertinggal di kode sumber.
2. Pastikan file `.env` tidak terunggah ke Git.
3. Pastikan seluruh endpoint baru menerapkan validasi input dan pengecekan otorisasi tenant (`tenant_id`).
