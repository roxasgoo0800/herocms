import type { SecurityStandard } from '../types/docs';

export const securityStandards: SecurityStandard[] = [
  {
    id: 'SEC-SANDBOX',
    pillarNumber: 0,
    title: 'Pengerasan (Hardening) & Sandboxing Kontainer Docker (cgroups v2)',
    category: 'sandboxing',
    badge: 'Docker Sandboxing',
    summary: 'Setiap kontainer website tenant yang dibuat oleh Go Orchestrator wajib dikunci dengan hak akses non-root (UID 10001), filesystem hanya-baca (ReadonlyRootfs), pencabutan seluruh Linux capabilities (CapDrop ALL), partisi RAM sementara (tmpfs), serta batasan ketat sumber daya Linux cgroups v2.',
    threatVector: 'Container Escape (Pelarian Kontainer) dan Denial of Service (DoS) yang berupaya membobol host kernel atau memonopoli 100% CPU/RAM server.',
    enforcement: 'Dikonfigurasi langsung pada struct container.HostConfig dan container.Config saat memanggil Moby Docker Engine SDK resmi di Go Orchestrator.',
    codeFile: 'services/03-provision-orchestrator/internal/deployer/docker.go',
    codeSnippet: `// Penegakan profil sandboxing ketat pada Go Orchestrator
config := &container.Config{
    Image: "cloudcms-tenant-runtime:alpine-v1",
    User:  "10001:10001", // User non-root: cmsrunner
    Env: []string{
        "NODE_ENV=production",
        fmt.Sprintf("TENANT_ID=%s", tenantID),
        fmt.Sprintf("SITE_ID=%s", siteID),
    },
}

hostConfig := &container.HostConfig{
    Resources: container.Resources{
        Memory:     256 * 1024 * 1024, // Maksimal 256 MB RAM
        MemorySwap: 256 * 1024 * 1024, // Swap dinonaktifkan
        NanoCPUs:   500000000,         // Maksimal 0.5 vCPU Core
        PidsLimit:  func(i int64) *int64 { return &i }(50), // Anti fork-bomb
    },
    ReadonlyRootfs: true, // Filesystem disk hanya-baca
    SecurityOpt: []string{
        "no-new-privileges:true",
    },
    CapDrop: []string{"ALL"},              // Cabut seluruh izin root Linux
    CapAdd:  []string{"NET_BIND_SERVICE"}, // Hanya izinkan port web 80/443
    Tmpfs: map[string]string{
        "/tmp": "size=16m,noexec,nosuid,nodev", // Tulis file hanya di RAM
        "/run": "size=4m,noexec,nosuid,nodev",
    },
    RestartPolicy: container.RestartPolicy{
        Name: "on-failure",
        MaximumRetryCount: 3,
    },
}`,
    verificationSteps: [
      'Jalankan perintah inspeksi Docker: docker inspect <container_id> --format "{{.HostConfig.ReadonlyRootfs}}"',
      'Verifikasi bahwa output menghasilkan nilai true.',
      'Periksa batasan memori: docker inspect <container_id> --format "{{.HostConfig.Memory}}"',
      'Pastikan nilai memori tepat 268435456 bytes (256 MB).',
      'Masuk ke kontainer dan coba buat file di /: touch /test.txt (wajib menghasilkan: Read-only file system).'
    ],
    checklist: [
      'User non-root UID 10001 (cmsrunner)',
      'ReadonlyRootfs bernilai true',
      'CapDrop bernilai ["ALL"]',
      'Tmpfs /tmp dengan flag noexec, nosuid, nodev',
      'Memory limit 256 MB dan swap dimatikan',
      'NanoCPUs 500000000 (0.5 vCPU)',
      'PidsLimit 50 untuk mencegah fork-bomb'
    ]
  },
  {
    id: 'SEC-01',
    pillarNumber: 1,
    title: 'Pilar 01: API Key Aman (Secure Token Handling)',
    category: 'owasp',
    badge: 'Kredensial & Autentikasi',
    summary: 'API Key tenant dan Developer Token disimpan terenkripsi atau ter-hash (SHA-256) di database, menggunakan prefix unik terstandarisasi (contoh: hc_live_...), dan hanya ditampilkan satu kali saat digenerate (one-time view).',
    threatVector: 'Pencurian kunci API melalui inspeksi database langsung atau kebocoran respon API.',
    enforcement: 'Hashing SHA-256 pada database token, prefixing hc_live_, enkripsi KMS saat at-rest.',
    codeFile: 'services/02-dashboard-cms/internal/handler/auth.go',
    codeSnippet: `// Validasi prefix dan hashing sebelum disimpan ke database
func HashApiKey(rawKey string) string {
    if !strings.HasPrefix(rawKey, "hc_live_") {
        panic("invalid key prefix")
    }
    hash := sha256.Sum256([]byte(rawKey))
    return hex.EncodeToString(hash[:])
}`,
    verificationSteps: [
      'Generate API key baru di menu Webhooks & Developer API.',
      'Periksa tabel api_keys di database: pastikan token tersimpan dalam format hash SHA-256.',
      'Refresh halaman: pastikan kunci rahasia asli tidak lagi ditampilkan secara penuh.'
    ],
    checklist: [
      'Gunakan prefix hc_live_ atau hc_test_',
      'Simpan hanya hash SHA-256 di PostgreSQL',
      'Tampilkan token asli hanya sekali (One-Time Display)'
    ]
  },
  {
    id: 'SEC-02',
    pillarNumber: 2,
    title: 'Pilar 02: .env Jangan Public (Hidden Files Blocking)',
    category: 'edge',
    badge: 'Konfigurasi Server',
    summary: 'File konfigurasi lingkungan (.env) dilarang berada di direktori publik web. Di Traefik Edge Router dan Nginx, seluruh permintaan HTTP ke file atau direktori berawalan titik (/\\.) otomatis diblokir dengan HTTP 403 Forbidden.',
    threatVector: 'Paparan kredensial database dan JWT secret key karena kesalahan routing static file server.',
    enforcement: 'Middleware regex Traefik PathPrefix(`/{dummy:(?:.*/)?\\..*}`) dan aturan Nginx Alpine location ~ /\\..*',
    codeFile: 'traefik/traefik.yml',
    codeSnippet: `http:
  middlewares:
    block-dotfiles:
      plugin:
        blockhidden:
          pattern: "/\\\\..*$"
# Pada Nginx Alpine:
location ~ /\\. {
    deny all;
    return 403;
}`,
    verificationSteps: [
      'Kirim permintaan cURL ke: curl -i http://localhost:8085/.env',
      'Pastikan server merespon dengan status HTTP 403 Forbidden atau HTTP 404 Not Found, bukan 200 OK.'
    ],
    checklist: [
      'Daftarkan .env di seluruh file .gitignore',
      'Aktifkan middleware pemblokir dotfiles di Traefik & Nginx',
      'Audit folder build public/dist agar bebas dari file .env'
    ]
  },
  {
    id: 'SEC-03',
    pillarNumber: 3,
    title: 'Pilar 03: No Hardcode Secret (Zero Hardcoded Secrets)',
    category: 'owasp',
    badge: 'Kebersihan Kode',
    summary: 'Dilarang keras menaruh password database, JWT secret key, API key eksternal, atau token otentikasi di dalam kode sumber (.go, .vue, .ts, .php, atau .yml). Seluruh kredensial wajib dibaca dari Environment Variables.',
    threatVector: 'Kebocoran kredensial infrastruktur ke repositori Git publik atau vendor pihak ketiga.',
    enforcement: 'Pustaka os.Getenv() di Golang, env() di Laravel, dan import.meta.env di Vue 3 Vite.',
    codeFile: 'services/03-provision-orchestrator/cmd/server/main.go',
    codeSnippet: `// Seluruh konfigurasi sensitif dibaca dari os.Getenv
jwtSecret := os.Getenv("JWT_SECRET")
if jwtSecret == "" {
    log.Fatal("FATAL: JWT_SECRET environment variable is missing!")
}`,
    verificationSteps: [
      'Jalankan git grep -i "password=" pada seluruh folder repositori.',
      'Pastikan tidak ditemukan password plaintext yang tertanam di kode sumber.'
    ],
    checklist: [
      'Gunakan os.Getenv atau library viper/godotenv',
      'Cek file konfigurasi docker-compose.yml menggunakan variabel \${ENV_VAR}',
      'Sertakan file .env.example dengan nilai kosong/placeholder'
    ]
  },
  {
    id: 'SEC-04',
    pillarNumber: 4,
    title: 'Pilar 04: Cek Secret di Git (Git Secrets Scanning)',
    category: 'audit',
    badge: 'Audit Repositori',
    summary: 'Pemindaian otomatis riwayat commit Git menggunakan git-secrets atau Gitleaks sebelum push ke remote repository untuk memastikan tidak ada token atau file privat yang tidak sengaja ter-commit.',
    threatVector: 'Kredensial tersimpan abadi di riwayat commit Git (.git/objects) meskipun file telah dihapus.',
    enforcement: 'Pre-commit hook Git dan pipeline CI GitHub Actions dengan gitleaks protect --staged.',
    codeFile: '.git/hooks/pre-commit',
    codeSnippet: `#!/usr/bin/env bash
# Pre-commit hook pemindaian secret
if which gitleaks > /dev/null; then
    gitleaks protect --staged -v
    if [ $? -ne 0 ]; then
        echo "Gitleaks mendeteksi potensi kebocoran secret! Commit dibatalkan."
        exit 1
    fi
fi`,
    verificationSteps: [
      'Jalankan pemindaian lokal: gitleaks detect --source . -v',
      'Pastikan laporan pemindaian menyatakan: 0 leaks found.'
    ],
    checklist: [
      'Instal gitleaks atau git-secrets di mesin developer',
      'Pasang hook pre-commit otomatis',
      'Jalankan pemindaian terjadwal di CI/CD pipeline'
    ]
  },
  {
    id: 'SEC-05',
    pillarNumber: 5,
    title: 'Pilar 05: Debug Mode OFF (Production Readiness)',
    category: 'owasp',
    badge: 'Konfigurasi Runtime',
    summary: 'Di lingkungan staging dan produksi, seluruh service wajib mematikan mode debug (GIN_MODE=release, APP_DEBUG=false, NODE_ENV=production). Verbose logging dan hot reload dinonaktifkan.',
    threatVector: 'Kebocoran arsitektur internal server, trace memory, dan endpoint debug yang dapat disalahgunakan.',
    enforcement: 'Penyetelan environment variable pada Docker container build dan runtime orchestrator.',
    codeFile: 'docker-compose.yml',
    codeSnippet: `environment:
  - GIN_MODE=release
  - APP_DEBUG=false
  - NODE_ENV=production
  - LOG_LEVEL=info`,
    verificationSteps: [
      'Periksa log container Go: pastikan tertulis [GIN-debug] [WARNING] Running in "release" mode.',
      'Akses rute yang tidak ada (404): pastikan tidak muncul tampilan debug Laravel Whoops atau Gin debug stack.'
    ],
    checklist: [
      'GIN_MODE=release pada Golang',
      'APP_DEBUG=false pada Laravel Admin Console',
      'NODE_ENV=production pada Vue 3 & React bundle'
    ]
  },
  {
    id: 'SEC-06',
    pillarNumber: 6,
    title: 'Pilar 06: Error Jangan Bocor (Safe Error Responses)',
    category: 'owasp',
    badge: 'Respon API Aman',
    summary: 'Stack trace internal, raw database queries, nama tabel, dan path file server dilarang keras dikirimkan ke respon browser atau klien API publik. Seluruh kesalahan wajib dikonversi menjadi pesan generik dengan Request ID.',
    threatVector: 'Information Disclosure (CWE-209) yang memberikan peta struktur database dan celah kode kepada peretas.',
    enforcement: 'Custom error recovery middleware di Gin dan Exception Handler di Laravel Filament.',
    codeFile: 'services/07-docs/internal/handler/router.go',
    codeSnippet: `// Middleware penanganan kesalahan aman dengan korelasi Request ID
func SafeErrorHandler() gin.HandlerFunc {
    return func(c *gin.Context) {
        c.Next()
        if len(c.Errors) > 0 {
            reqID := c.GetString("RequestID")
            // Log detail teknis hanya ke console internal
            log.Printf("[ERR-%s] %v", reqID, c.Errors.Last())
            // Kirim pesan generik aman ke user
            c.JSON(http.StatusInternalServerError, gin.H{
                "status": "error",
                "message": "Terjadi kesalahan internal pada server",
                "request_id": reqID,
            })
        }
    }
}`,
    verificationSteps: [
      'Kirim payload rusak ke endpoint API.',
      'Pastikan respon JSON hanya berisi: {"status":"error","message":"...","request_id":"..."}.',
      'Pastikan tidak ada jejak string SELECT, FROM, atau baris file .go di respon JSON.'
    ],
    checklist: [
      'Sembunyikan stack trace di seluruh respon HTTP',
      'Sertakan Request ID untuk korelasi investigasi log',
      'Log error asli hanya ke stdout/stderr internal'
    ]
  },
  {
    id: 'SEC-07',
    pillarNumber: 7,
    title: 'Pilar 07: Validasi Input (Strict Schema Validation)',
    category: 'owasp',
    badge: 'Validasi Data',
    summary: 'Seluruh payload HTTP (request body JSON, query params, path URL) wajib divalidasi skemanya sebelum diproses oleh logika bisnis: tipe data, format UUID, panjang string maksimal, dan batas numerik.',
    threatVector: 'Eksekusi data tidak valid, buffer overflow, atau serangan manipulasi parameter.',
    enforcement: 'Pustaka gin.ShouldBindJSON dengan struct tags binding:"required,uuid4,max=100".',
    codeFile: 'services/03-provision-orchestrator/internal/handler/deploy.go',
    codeSnippet: `type DeployRequest struct {
    TenantID    string \`json:"tenant_id" binding:"required,uuid4"\`
    SiteID      string \`json:"site_id" binding:"required,alphanum,max=64"\`
    VersionHash string \`json:"version_hash" binding:"required,hexadecimal,len=8"\`
}`,
    verificationSteps: [
      'Kirim request JSON dengan TenantID bukan UUID: curl -X POST -d \'{"tenant_id":"bukan-uuid"}\' /api/v1/deploy',
      'Pastikan server merespon dengan status HTTP 400 Bad Request.'
    ],
    checklist: [
      'Validasi format UUID pada ID tenant dan user',
      'Batasi panjang string maksimal pada judul dan nama',
      'Tolak request jika ada field wajib yang hilang'
    ]
  },
  {
    id: 'SEC-08',
    pillarNumber: 8,
    title: 'Pilar 08: Sanitasi Input (Data Cleansing)',
    category: 'owasp',
    badge: 'Sanitasi Data',
    summary: 'Melakukan pemangkasan spasi berlebih (trim), normalisasi encoding Unicode, serta pembersihan karakter kendali tak terlihat pada seluruh teks yang diinput oleh pengguna.',
    threatVector: 'Bypass validasi menggunakan spasi tersembunyi, zero-width characters, atau homoglyphs.',
    enforcement: 'Fungsi strings.TrimSpace() dan pustaka text/transform di Golang sebelum simpan ke DB.',
    codeFile: 'services/02-dashboard-cms/src/stores/contentStore.ts',
    codeSnippet: `export function sanitizeInputString(val: string): string {
    return val.replace(/[\\u200B-\\u200D\\uFEFF]/g, '').trim();
}`,
    verificationSteps: [
      'Kirim input dengan spasi awal dan akhir serta karakter tersembunyi.',
      'Periksa data yang tersimpan di database: pastikan telah terpangkas bersih.'
    ],
    checklist: [
      'Trim seluruh input teks string',
      'Hapus karakter tak terlihat (Zero-Width Characters)',
      'Normalisasi huruf kecil pada email dan subdomain slug'
    ]
  },
  {
    id: 'SEC-09',
    pillarNumber: 9,
    title: 'Pilar 09: Anti SQL Injection (pgx Parameter Binding)',
    category: 'database',
    badge: 'Keamanan Database',
    summary: '100% kueri database ke PostgreSQL wajib menggunakan parameter binding terstruktur ($1, $2, ...) melalui pustaka Go pgx atau Eloquent ORM di Laravel. Dilarang keras melakukan perangkaian string manual (raw string concatenation).',
    threatVector: 'SQL Injection (SQLi - CWE-89) yang dapat membocorkan atau menghancurkan seluruh basis data.',
    enforcement: 'Pustaka github.com/jackc/pgx/v5 dengan kueri db.Query(ctx, "SELECT ... WHERE id = $1", id).',
    codeFile: 'services/07-docs/internal/handler/task_handler.go',
    codeSnippet: `// BENAR: Menggunakan parameter binding $1 dan $2
query := "UPDATE tasks SET checklist = $1 WHERE id = $2"
_, err := db.Exec(ctx, query, checklistJson, taskID)

// DILARANG KERAS (SQLi Celah Berbahaya):
// query := fmt.Sprintf("UPDATE tasks SET checklist = '%s' WHERE id = '%s'", json, taskID)`,
    verificationSteps: [
      'Kirim input dengan kutip tunggal dan manipulasi SQL: \' OR 1=1 --',
      'Pastikan input diperlakukan sebagai literal string murni dan tidak mengeksekusi perintah SQL.'
    ],
    checklist: [
      'Gunakan selalu placeholder $1, $2 pada pgx',
      'Gunakan Eloquent ORM / Query Builder berparameter di Laravel',
      'Larang fmt.Sprintf() atau string concat dalam kueri SQL'
    ]
  },
  {
    id: 'SEC-10',
    pillarNumber: 10,
    title: 'Pilar 10: Anti XSS (ProseMirror AST, DOMPurify & Strict CSP)',
    category: 'owasp',
    badge: 'Proteksi Browser',
    summary: 'Editor konten visual menyimpan dokumen dalam format Abstract Syntax Tree (JSON ProseMirror), bukan string raw HTML mentah. Saat dirender, seluruh teks disanitasi menggunakan DOMPurify dengan whitelist tag ketat, serta dilindungi header Content Security Policy (CSP) dari Traefik.',
    threatVector: 'Stored Cross-Site Scripting (XSS - CWE-79) yang mengeksekusi JavaScript jahat di browser pengunjung.',
    enforcement: 'JSON AST di Vue 3 Tiptap, pembersihan DOMPurify.sanitize(), dan Traefik CSP header injection.',
    codeFile: 'services/02-dashboard-cms/src/components/editor/TiptapEditor.vue',
    codeSnippet: `// Sanitasi konten menggunakan DOMPurify sebelum render pratinjau
import DOMPurify from 'dompurify';

export function getSafeHtml(dirtyHtml: string): string {
    return DOMPurify.sanitize(dirtyHtml, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'code', 'pre', 'img', 'blockquote'],
        ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'target', 'rel']
    });
}`,
    verificationSteps: [
      'Ketik tag skrip berbahaya di editor: <script>alert(1)</script><img src=x onerror=alert(2)>',
      'Periksa tampilan yang dirender: pastikan tag <script> dan event handler onerror terhapus bersih.'
    ],
    checklist: [
      'Simpan konten dalam format JSON AST terstruktur',
      'Sanitasi dengan DOMPurify sebelum injeksi ke v-html',
      'Terapkan header CSP ketat di Traefik'
    ]
  },
  {
    id: 'SEC-11',
    pillarNumber: 11,
    title: 'Pilar 11: Server-Side Authentication (Never Trust Client)',
    category: 'owasp',
    badge: 'Autentikasi Server',
    summary: 'Seluruh verifikasi otentikasi, pengecekan kedaluwarsa token, dan kepemilikan tenant wajib dieksekusi di backend server. Jangan pernah mempercayai klaim otentikasi murni dari state frontend klien atau localStorage.',
    threatVector: 'Bypass autentikasi dengan memanipulasi local storage atau state Pinia/Vuex.',
    enforcement: 'Verifikasi kriptografis JWT signature menggunakan secret key server pada setiap request API.',
    codeFile: 'services/02-dashboard-cms/internal/middleware/auth.go',
    codeSnippet: `// Server backend memvalidasi tanda tangan kriptografis JWT
token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
    if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
        return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
    }
    return jwtSecretBytes, nil
})
if err != nil || !token.Valid {
    c.AbortWithStatusJSON(401, gin.H{"error": "Unauthorized"})
    return
}`,
    verificationSteps: [
      'Ubah payload token JWT secara manual di browser (misal ubah user_id).',
      'Kirim permintaan ke backend: pastikan server mengembalikan HTTP 401 Unauthorized karena signature invalid.'
    ],
    checklist: [
      'Validasi signature JWT di backend Go/Laravel',
      'Tolak request jika token expired (cek exp claim)',
      'Jangan biarkan frontend membuat keputusan hak akses final'
    ]
  },
  {
    id: 'SEC-12',
    pillarNumber: 12,
    title: 'Pilar 12: Cek Akses User & Anti IDOR (Tenant Scoping)',
    category: 'database',
    badge: 'Segregasi Akses',
    summary: 'Setiap endpoint yang mengakses atau mengubah data wajib memvalidasi bahwa resource yang diminta benar-benar milik tenant yang sedang login untuk mencegah Insecure Direct Object Reference (IDOR).',
    threatVector: 'IDOR (CWE-639): Tenant A mengganti URL ID menjadi ID milik Tenant B untuk mencuri atau mengubah data.',
    enforcement: 'Klausa WHERE tenant_id = current_tenant_id dan penegakan PostgreSQL Row-Level Security (RLS).',
    codeFile: 'services/02-dashboard-cms/internal/handler/site.go',
    codeSnippet: `// Verifikasi kepemilikan tenant secara eksplisit
query := "SELECT id, name FROM sites WHERE id = $1 AND tenant_id = $2"
row := db.QueryRow(ctx, query, requestSiteID, loggedInTenantID)
if err == pgx.ErrNoRows {
    c.AbortWithStatusJSON(404, gin.H{"error": "Situs tidak ditemukan"})
    return
}`,
    verificationSteps: [
      'Login sebagai Tenant A, lalu coba hapus situs milik Tenant B: DELETE /api/v1/sites/<id_tenant_b>',
      'Pastikan server menolak dengan respon 404 Not Found atau 403 Forbidden.'
    ],
    checklist: [
      'Sertakan selalu tenant_id dalam kueri update/delete',
      'Gunakan UUID v4 acak, jangan auto-incrementing integer',
      'Aktifkan Row-Level Security (RLS) di tabel PostgreSQL'
    ]
  },
  {
    id: 'SEC-13',
    pillarNumber: 13,
    title: 'Pilar 13: Role Admin Aman (Strict RBAC & Two-Factor Auth)',
    category: 'owasp',
    badge: 'Hak Istimewa Admin',
    summary: 'Penerapan Role-Based Access Control (RBAC) ketat yang memisahkan hak akses SuperAdmin, Support, dan Finance. Fitur impersonasi dilengkapi watermark visual mencolok dan pencatatan audit log.',
    threatVector: 'Eskalasi hak akses staf dan penyalahgunaan wewenang administratif internal.',
    enforcement: 'Filament Shield policies di Laravel dan middleware role verification di Golang.',
    codeFile: 'services/01-admin-console/app/Policies/TenantPolicy.php',
    codeSnippet: `public function delete(User $user, Tenant $tenant): bool
{
    // Hanya SuperAdmin yang diizinkan menghapus tenant
    return $user->hasRole('super_admin');
}`,
    verificationSteps: [
      'Login sebagai staf ber-role "support".',
      'Pastikan tombol hapus permanen tenant tidak muncul dan endpoint API delete diblokir.'
    ],
    checklist: [
      'Terapkan Principle of Least Privilege',
      'Wajibkan 2FA (TOTP) untuk seluruh akun admin internal',
      'Catat setiap tindakan impersonasi ke audit log'
    ]
  },
  {
    id: 'SEC-14',
    pillarNumber: 14,
    title: 'Pilar 14: DB Jangan Public (Isolated Internal Network)',
    category: 'edge',
    badge: 'Isolasi Jaringan',
    summary: 'Port database PostgreSQL (5432) dan Redis (6379) hanya berjalan di dalam jaringan internal Docker (app-network). Dilarang keras membuka port database langsung ke internet (0.0.0.0:5432).',
    threatVector: 'Brute-force password database dan serangan eksploitasi port terbuka dari internet publik.',
    enforcement: 'Hanya gunakan expose: di docker-compose.yml untuk service database, BUKAN ports:.',
    codeFile: 'docker-compose.yml',
    codeSnippet: `services:
  postgres:
    image: postgres:16-alpine
    networks:
      - cloudcms_internal_net
    expose:
      - "5432"  # Hanya dapat diakses kontainer di internal net
    # DILARANG: ports: ["5432:5432"]`,
    verificationSteps: [
      'Dari mesin host publik, coba hubungi: nmap -p 5432 <ip_publik_server>',
      'Pastikan port 5432 berstatus: closed atau filtered.'
    ],
    checklist: [
      'Gunakan expose: bukan ports: untuk PostgreSQL & Redis',
      'Pasang firewall UFW yang memblokir akses ke port 5432 & 6379',
      'Akses administrasi remote hanya melalui SSH Tunnel atau VPN internal'
    ]
  },
  {
    id: 'SEC-15',
    pillarNumber: 15,
    title: 'Pilar 15: DB Permission Ketat & PostgreSQL RLS',
    category: 'database',
    badge: 'Row-Level Security',
    summary: 'User database aplikasi (cloudcms_app) hanya diberikan izin tabel minimum (Least Privilege). Seluruh tabel multi-tenant dilindungi Row-Level Security (RLS) dengan session parameter app.current_tenant_id.',
    threatVector: 'Kebocoran data lintas tenant jika programmer lupa menyertakan filter WHERE tenant_id.',
    enforcement: 'ALTER TABLE sites ENABLE ROW LEVEL SECURITY; dan CREATE POLICY tenant_isolation.',
    codeFile: 'migrations/001_init_rls.sql',
    codeSnippet: `ALTER TABLE sites ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_sites_isolation ON sites
    FOR ALL
    TO cloudcms_app
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);`,
    verificationSteps: [
      'Buka koneksi psql sebagai cloudcms_app.',
      'Jalankan: SELECT * FROM sites;',
      'Pastikan hasil kueri kosong jika app.current_tenant_id belum di-set.'
    ],
    checklist: [
      'Aktifkan RLS di semua tabel data tenant',
      'Set app.current_tenant_id pada setiap transaksi database',
      'Jangan gunakan user postgres superuser untuk koneksi aplikasi web'
    ]
  },
  {
    id: 'SEC-16',
    pillarNumber: 16,
    title: 'Pilar 16: Hash Password (Argon2id & bcrypt Cost 12)',
    category: 'owasp',
    badge: 'Hashing Kriptografis',
    summary: 'Seluruh password pengguna disimpan menggunakan fungsi hash memori-keras berkekuatan tinggi (Argon2id atau bcrypt dengan cost factor minimal 12) dengan salt unik acak otomatis. Dilarang menggunakan MD5 atau SHA-1.',
    threatVector: 'Pencurian kredensial melalui rainbow table atau serangan GPU hash cracking jika basis data bocor.',
    enforcement: 'Pustaka golang.org/x/crypto/bcrypt dengan bcrypt.GenerateFromPassword(pass, 12).',
    codeFile: 'services/02-dashboard-cms/internal/handler/auth.go',
    codeSnippet: `hashedPassword, err := bcrypt.GenerateFromPassword([]byte(rawPassword), 12)
if err != nil {
    return err
}`,
    verificationSteps: [
      'Periksa tabel users di database: pastikan password berawalan $2a$12$ atau $argon2id$.',
      'Pastikan panjang hash minimal 60 karakter acak.'
    ],
    checklist: [
      'Gunakan bcrypt cost 12 atau Argon2id',
      'Salt unik di-generate otomatis oleh pustaka',
      'Dilarang menggunakan MD5, SHA-256, atau plain text'
    ]
  },
  {
    id: 'SEC-17',
    pillarNumber: 17,
    title: 'Pilar 17: Session Aman (Redis Stateful + HttpOnly Cookie)',
    category: 'owasp',
    badge: 'Manajemen Sesi',
    summary: 'Sesi browser disimpan secara stateful di Redis 7 dengan cookie HttpOnly; SameSite=Lax; Secure. Logout seketika menghapus record di Redis. Mutasi data dilindungi Double Submit CSRF token.',
    threatVector: 'Session Hijacking, XSS token theft via localStorage, dan Cross-Site Request Forgery (CSRF).',
    enforcement: 'Cookie herocms_session dengan flag HttpOnly dan middleware validasi header X-CSRF-Token.',
    codeFile: 'services/02-dashboard-cms/internal/middleware/session.go',
    codeSnippet: `// Penerbitan cookie sesi aman
http.SetCookie(w, &http.Cookie{
    Name:     "herocms_session",
    Value:    sessionID,
    Path:     "/",
    MaxAge:   2592000, // 30 Hari
    HttpOnly: true,    // Tidak bisa dibaca JS (Anti-XSS)
    Secure:   true,    // Hanya lewat HTTPS
    SameSite: http.SameSiteLaxMode,
})`,
    verificationSteps: [
      'Buka DevTools Browser -> Application -> Cookies.',
      'Pastikan cookie herocms_session memiliki centang pada kolom HttpOnly dan Secure.',
      'Coba baca di konsol: document.cookie (pastikan herocms_session tidak muncul).'
    ],
    checklist: [
      'Atribut HttpOnly; Secure; SameSite=Lax aktif',
      'Session ID acak 32-byte disimpan di Redis dengan TTL',
      'Validasi header X-CSRF-Token pada POST/PUT/DELETE'
    ]
  },
  {
    id: 'SEC-18',
    pillarNumber: 18,
    title: 'Pilar 18: Reset Password Aman (Single-Use CSPRNG Token)',
    category: 'owasp',
    badge: 'Pemulihan Akun',
    summary: 'Token pemulihan kata sandi dibuat dari generator bilangan acak berkekuatan kriptografis (CSPRNG), disimpan dalam format hash di database, hanya berlaku satu kali pakai, dan kedaluwarsa otomatis dalam 15 menit.',
    threatVector: 'Brute-force token reset password atau penggunaan ulang token pemulihan lama.',
    enforcement: 'crypto/rand di Golang untuk membuat token acak 32-byte dengan TTL 15 menit.',
    codeFile: 'services/02-dashboard-cms/internal/handler/auth.go',
    codeSnippet: `tokenBytes := make([]byte, 32)
rand.Read(tokenBytes)
resetToken := hex.EncodeToString(tokenBytes)
// Simpan hash token di Redis dengan TTL 15 Menit
redisClient.Set(ctx, "pwd_reset:"+hash(resetToken), userID, 15*time.Minute)`,
    verificationSteps: [
      'Minta tautan reset password.',
      'Gunakan tautan untuk mereset password sekali.',
      'Coba buka kembali tautan yang sama: pastikan tautan ditolak dengan pesan "Token sudah kadaluarsa".'
    ],
    checklist: [
      'Token dibuat menggunakan CSPRNG (crypto/rand)',
      'Kadaluwarsa ketat 15 menit',
      'Hapus token seketika setelah digunakan (Single-Use)'
    ]
  },
  {
    id: 'SEC-19',
    pillarNumber: 19,
    title: 'Pilar 19: Batasi Upload File (Max 25MB & Hard Quota 2GB)',
    category: 'assets',
    badge: 'Proteksi Penyimpanan',
    summary: 'Membatasi ukuran berkas maksimal yang dapat diunggah (maksimal 25 MB per berkas) dan penegakan kuota total akun maksimal 2 GB per tenant untuk mencegah kehabisan kapasitas disk server.',
    threatVector: 'Denial of Service (Disk Flooding) dan beban memori berlebih akibat upload file berukuran gigabyte.',
    enforcement: 'Pembatasan c.Request.Body = http.MaxBytesReader(w, r.Body, 25*1024*1024) di handler Go.',
    codeFile: 'services/02-dashboard-cms/internal/handler/media.go',
    codeSnippet: `// Batasi payload maksimal 25 MB di level stream
c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, 25*1024*1024)

// Cek hard quota total akun tenant (2 GB)
if currentTenantUsageBytes + newFileSize > 2*1024*1024*1024 {
    c.AbortWithStatusJSON(413, gin.H{"error": "Kuota penyimpanan 2 GB terlampaui"})
    return
}`,
    verificationSteps: [
      'Coba unggah file berukuran 30 MB.',
      'Pastikan server langsung menolak dengan status HTTP 413 Payload Too Large.'
    ],
    checklist: [
      'MaxBytesReader 25 MB pada request upload',
      'Hard quota total 2 GB per akun tenant',
      'Tampilkan indikator pemakaian penyimpanan di UI Studio'
    ]
  },
  {
    id: 'SEC-20',
    pillarNumber: 20,
    title: 'Pilar 20: Scan Upload File (Magic Bytes Sniffing & Anti-Traversal)',
    category: 'assets',
    badge: 'Anti-Malware & Path Traversal',
    summary: 'Backend Go membaca 512 byte awal berkas menggunakan http.DetectContentType untuk mendeteksi penyamaran ekstensi (magic bytes). Nama file disanitasi dari karakter traversal (../) dan disimpan ke Dedicated S3 Bucket terisolasi.',
    threatVector: 'Remote Code Execution (RCE) via file executable/shell script yang menyamar sebagai file gambar (.jpg).',
    enforcement: 'Pemeriksaan http.DetectContentType(buffer[:512]) dan filepath.Base() sanitasi nama file.',
    codeFile: 'services/02-dashboard-cms/internal/handler/media.go',
    codeSnippet: `// Baca 512 byte awal untuk verifikasi Magic Bytes sejati
buffer := make([]byte, 512)
file.Read(buffer)
file.Seek(0, io.SeekStart)

detectedMime := http.DetectContentType(buffer)
allowedMimes := map[string]bool{
    "image/jpeg": true, "image/png": true, "image/webp": true, "image/gif": true,
    "application/pdf": true,
}
if !allowedMimes[detectedMime] {
    c.AbortWithStatusJSON(400, gin.H{"error": "Tipe file tidak diizinkan"})
    return
}`,
    verificationSteps: [
      'Buat file teks script bash dan ubah namanya menjadi avatar.jpg.',
      'Coba unggah: pastikan server mendeteksi MIME type text/plain dan menolak file tersebut.'
    ],
    checklist: [
      'Verifikasi 512 byte Magic Bytes awal',
      'Whitelist ekstensi dan MIME type ketat',
      'Hilangkan karakter ../ dari nama berkas',
      'Simpan berkas ke Dedicated MinIO S3 bucket'
    ]
  }
];
