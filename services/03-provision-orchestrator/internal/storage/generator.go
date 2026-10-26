package storage

import (
	"fmt"
	"html"
	"strings"
)

// TemplateSeedParams encapsulates template parameters for initial tenant site generation
type TemplateSeedParams struct {
	SiteName     string `json:"site_name"`
	Subdomain    string `json:"subdomain"`
	TemplateName string `json:"template_name"`
	Category     string `json:"category"`
	RoleHeadline string `json:"role_headline"`
	BioIntro     string `json:"bio_intro"`
	AccentColor  string `json:"accent_color"`
	CustomHTML   string `json:"custom_html,omitempty"`
}

// GenerateWebsiteHTML renders a complete, responsive, modern website based on the chosen template & parameters
func GenerateWebsiteHTML(p TemplateSeedParams) string {
	if strings.TrimSpace(p.CustomHTML) != "" {
		return p.CustomHTML
	}

	siteName := strings.TrimSpace(p.SiteName)
	if siteName == "" {
		siteName = "Situs Resmi Tenant"
	}

	subdomain := strings.TrimSpace(p.Subdomain)
	if subdomain == "" {
		subdomain = "stacbyte.id"
	}

	accentColor := strings.TrimSpace(p.AccentColor)
	if accentColor == "" || !strings.HasPrefix(accentColor, "#") {
		accentColor = "#2563eb"
	}

	roleHeadline := strings.TrimSpace(p.RoleHeadline)
	bioIntro := strings.TrimSpace(p.BioIntro)

	category := strings.ToLower(strings.TrimSpace(p.Category))
	tplID := strings.ToLower(strings.TrimSpace(p.TemplateName))

	if category == "business" || strings.Contains(tplID, "ecommerce") || strings.Contains(tplID, "toko") || strings.Contains(tplID, "retail") || strings.Contains(tplID, "business") {
		return generateBusinessHTML(siteName, subdomain, accentColor, roleHeadline, bioIntro)
	}
	if category == "blog" || strings.Contains(tplID, "editorial") || strings.Contains(tplID, "media") || strings.Contains(tplID, "berita") {
		return generateBlogHTML(siteName, subdomain, accentColor, roleHeadline, bioIntro)
	}
	if category == "education" || strings.Contains(tplID, "lms") || strings.Contains(tplID, "edukasi") || strings.Contains(tplID, "kursus") || strings.Contains(tplID, "academy") {
		return generateEducationHTML(siteName, subdomain, accentColor, roleHeadline, bioIntro)
	}

	// Default to Portfolio for technical, developer, or creative showcase
	return generatePortfolioHTML(siteName, subdomain, accentColor, roleHeadline, bioIntro)
}

func generateBusinessHTML(name, sub, accent, headline, bio string) string {
	if headline == "" {
		headline = "Belanja Produk Pilihan & Berkualitas dengan Harga Terbaik"
	}
	if bio == "" {
		bio = "Koleksi lengkap barang berkualitas, jaminan produk original 100%, pengiriman cepat, dan kemudahan transaksi langsung via WhatsApp resmi kami."
	}

	escapedName := html.EscapeString(name)
	escapedHeadline := html.EscapeString(headline)
	escapedBio := html.EscapeString(bio)
	escapedSub := html.EscapeString(sub)

	return fmt.Sprintf(`<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>%s | Toko Online Resmi</title>
    <style>
        :root {
            --primary: %s;
            --primary-dark: color-mix(in srgb, var(--primary) 80%%, black);
            --primary-soft: color-mix(in srgb, var(--primary) 12%%, white);
            --bg: #090d16;
            --surface: #0f172a;
            --surface-hover: #1e293b;
            --border: rgba(255, 255, 255, 0.08);
            --text-main: #f8fafc;
            --text-muted: #94a3b8;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: var(--bg);
            color: var(--text-main);
            line-height: 1.6;
            min-height: 100vh;
        }
        .container { max-width: 1180px; margin: 0 auto; padding: 0 24px; }
        
        /* Navbar */
        nav {
            background: rgba(15, 23, 42, 0.85);
            backdrop-filter: blur(16px);
            border-bottom: 1px solid var(--border);
            position: sticky;
            top: 0;
            z-index: 50;
        }
        .nav-inner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 70px;
        }
        .brand {
            display: flex;
            align-items: center;
            gap: 12px;
            text-decoration: none;
            color: #fff;
            font-weight: 700;
            font-size: 1.25rem;
        }
        .brand-icon {
            width: 36px;
            height: 36px;
            border-radius: 10px;
            background: var(--primary);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.1rem;
            color: #fff;
        }
        .nav-links {
            display: flex;
            align-items: center;
            gap: 24px;
            list-style: none;
        }
        .nav-links a {
            color: var(--text-muted);
            text-decoration: none;
            font-size: 0.95rem;
            font-weight: 500;
            transition: color 0.2s;
        }
        .nav-links a:hover { color: #fff; }
        .btn-wa-header {
            background: #25d366;
            color: #0b1e11;
            padding: 8px 18px;
            border-radius: 999px;
            text-decoration: none;
            font-weight: 700;
            font-size: 0.88rem;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-wa-header:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 14px rgba(37, 211, 102, 0.4);
        }

        /* Hero */
        .hero {
            padding: 80px 0 60px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        .hero::before {
            content: '';
            position: absolute;
            top: -100px;
            left: 50%%;
            transform: translateX(-50%%);
            width: 600px;
            height: 400px;
            background: radial-gradient(circle, var(--primary) 0%%, transparent 70%%);
            opacity: 0.18;
            pointer-events: none;
            border-radius: 50%%;
        }
        .hero-pill {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: var(--primary-soft);
            color: var(--primary);
            border: 1px solid var(--primary);
            padding: 6px 16px;
            border-radius: 999px;
            font-size: 0.82rem;
            font-weight: 600;
            margin-bottom: 24px;
        }
        .hero h1 {
            font-size: 2.75rem;
            line-height: 1.2;
            letter-spacing: -0.03em;
            margin-bottom: 20px;
            max-width: 820px;
            margin-left: auto;
            margin-right: auto;
        }
        .hero p {
            color: var(--text-muted);
            font-size: 1.15rem;
            max-width: 680px;
            margin: 0 auto 32px;
        }
        .hero-actions {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 16px;
            flex-wrap: wrap;
        }
        .btn-primary {
            background: var(--primary);
            color: #fff;
            padding: 14px 28px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: all 0.2s;
        }
        .btn-primary:hover {
            opacity: 0.92;
            transform: translateY(-2px);
            box-shadow: 0 10px 25px -5px var(--primary);
        }
        .btn-outline {
            background: transparent;
            color: #fff;
            border: 1px solid var(--border);
            padding: 14px 28px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.2s;
        }
        .btn-outline:hover { background: var(--surface-hover); border-color: rgba(255,255,255,0.2); }

        /* Trust Stats Bar */
        .stats-bar {
            margin: 40px auto 60px;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 24px 32px;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 24px;
            text-align: center;
        }
        .stat-item h3 { font-size: 1.8rem; color: #fff; margin-bottom: 4px; }
        .stat-item p { font-size: 0.85rem; color: var(--text-muted); font-weight: 500; }

        /* Product Showcase */
        .section-header {
            text-align: center;
            margin-bottom: 40px;
        }
        .section-header h2 { font-size: 2rem; margin-bottom: 12px; }
        .section-header p { color: var(--text-muted); max-width: 540px; margin: 0 auto; }
        
        .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
            gap: 24px;
            margin-bottom: 60px;
        }
        .product-card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 14px;
            padding: 20px;
            display: flex;
            flex-direction: column;
            transition: transform 0.2s, border-color 0.2s;
            position: relative;
        }
        .product-card:hover {
            transform: translateY(-4px);
            border-color: rgba(255,255,255,0.2);
        }
        .badge-discount {
            position: absolute;
            top: 14px;
            left: 14px;
            background: #ef4444;
            color: #fff;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 0.75rem;
            font-weight: 700;
        }
        .product-img-placeholder {
            width: 100%%;
            height: 180px;
            background: rgba(255,255,255,0.03);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3rem;
            margin-bottom: 16px;
        }
        .product-card h3 { font-size: 1.05rem; margin-bottom: 8px; color: #fff; font-weight: 600; line-height: 1.4; }
        .product-card p { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 16px; flex: 1; }
        .product-price-row {
            display: flex;
            align-items: baseline;
            gap: 8px;
            margin-bottom: 16px;
        }
        .price-now { font-size: 1.25rem; font-weight: 700; color: #10b981; }
        .price-old { font-size: 0.85rem; color: #64748b; text-decoration: line-through; }
        .btn-order-wa {
            background: rgba(37, 211, 102, 0.12);
            color: #25d366;
            border: 1px solid rgba(37, 211, 102, 0.3);
            border-radius: 8px;
            padding: 10px;
            text-align: center;
            text-decoration: none;
            font-size: 0.88rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: all 0.2s;
        }
        .btn-order-wa:hover {
            background: #25d366;
            color: #0b1e11;
        }

        /* Features / Trust */
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 20px;
            margin-bottom: 70px;
        }
        .feature-box {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 24px;
        }
        .feature-icon {
            font-size: 1.8rem;
            margin-bottom: 12px;
        }
        .feature-box h4 { font-size: 1rem; margin-bottom: 6px; }
        .feature-box p { font-size: 0.85rem; color: var(--text-muted); }

        /* Floating Pod Badge */
        .pod-badge {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(15, 23, 42, 0.9);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(16, 185, 129, 0.4);
            border-radius: 999px;
            padding: 8px 16px;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.78rem;
            color: #10b981;
            box-shadow: 0 10px 25px rgba(0,0,0,0.5);
            z-index: 100;
        }
        .pod-dot { width: 8px; height: 8px; border-radius: 50%%; background: #10b981; animation: pulse 2s infinite; }
        @keyframes pulse { 0%%, 100%% { opacity: 1; transform: scale(1); } 50%% { opacity: 0.4; transform: scale(0.85); } }

        /* Footer */
        footer {
            border-top: 1px solid var(--border);
            padding: 36px 0;
            text-align: center;
            color: #64748b;
            font-size: 0.85rem;
        }
        footer a { color: var(--text-muted); text-decoration: none; }
        footer a:hover { color: #fff; }
    </style>
</head>
<body>
    <nav>
        <div class="container nav-inner">
            <a href="#" class="brand">
                <span class="brand-icon">🛍</span>
                <span>%s</span>
            </a>
            <ul class="nav-links">
                <li><a href="#katalog">Katalog Produk</a></li>
                <li><a href="#keunggulan">Keunggulan</a></li>
                <li><a href="#kontak">Kontak</a></li>
            </ul>
            <a href="https://wa.me/?text=Halo%%20%s" target="_blank" class="btn-wa-header">
                <span>💬 WhatsApp Official</span>
            </a>
        </div>
    </nav>

    <header class="hero">
        <div class="container">
            <div class="hero-pill">✨ Official Store & Jaminan 100%% Produk Asli</div>
            <h1>%s</h1>
            <p>%s</p>
            <div class="hero-actions">
                <a href="#katalog" class="btn-primary">Lihat Koleksi Produk</a>
                <a href="https://wa.me/?text=Halo%%20admin%%20%s" target="_blank" class="btn-outline">Konsultasi Produk</a>
            </div>

            <div class="stats-bar">
                <div class="stat-item">
                    <h3>50.000+</h3>
                    <p>Pesanan Sukses Dikirim</p>
                </div>
                <div class="stat-item">
                    <h3>100%%</h3>
                    <p>Produk Bergaransi Resmi</p>
                </div>
                <div class="stat-item">
                    <h3>4.98 / 5.0</h3>
                    <p>Rating Kepuasan Pembeli</p>
                </div>
                <div class="stat-item">
                    <h3>< 5 Menit</h3>
                    <p>Respon CS WhatsApp</p>
                </div>
            </div>
        </div>
    </header>

    <main class="container" id="katalog">
        <div class="section-header">
            <h2>Etalase Produk Unggulan</h2>
            <p>Pilih produk favorit Anda, klik beli, dan pesanan akan otomatis terhubung ke WhatsApp penjual resmi.</p>
        </div>

        <div class="products-grid">
            <div class="product-card">
                <span class="badge-discount">-21%%</span>
                <div class="product-img-placeholder">🎧</div>
                <h3>Wireless Noise-Cancelling Headphones Pro</h3>
                <p>Kualitas audio Hi-Res dengan daya tahan baterai 40 jam dan driver bass dinamis.</p>
                <div class="product-price-row">
                    <span class="price-now">Rp 1.499.000</span>
                    <span class="price-old">Rp 1.899.000</span>
                </div>
                <a href="https://wa.me/?text=Halo%%2C%%20saya%%20ingin%%20order%%20Headphones%%20Pro" target="_blank" class="btn-order-wa">
                    <span>Beli via WhatsApp →</span>
                </a>
            </div>

            <div class="product-card">
                <span class="badge-discount">-25%%</span>
                <div class="product-img-placeholder">🎒</div>
                <h3>Smart Ergonomic Backpack Anti Air & USB</h3>
                <p>Bahan cordura tahan cuaca, kompartemen laptop 16 inci, dan busa punggung empuk.</p>
                <div class="product-price-row">
                    <span class="price-now">Rp 489.000</span>
                    <span class="price-old">Rp 650.000</span>
                </div>
                <a href="https://wa.me/?text=Halo%%2C%%20saya%%20ingin%%20order%%20Smart%%20Backpack" target="_blank" class="btn-order-wa">
                    <span>Beli via WhatsApp →</span>
                </a>
            </div>

            <div class="product-card">
                <span class="badge-discount">-22%%</span>
                <div class="product-img-placeholder">⌚</div>
                <h3>Jam Tangan Pintar AMOLED Sport Edition IP68</h3>
                <p>Sensor detak jantung akurat, pelacak tidur, GPS terintegrasi, dan Always-On Display.</p>
                <div class="product-price-row">
                    <span class="price-now">Rp 899.000</span>
                    <span class="price-old">Rp 1.150.000</span>
                </div>
                <a href="https://wa.me/?text=Halo%%2C%%20saya%%20ingin%%20order%%20Smartwatch%%20AMOLED" target="_blank" class="btn-order-wa">
                    <span>Beli via WhatsApp →</span>
                </a>
            </div>

            <div class="product-card">
                <div class="product-img-placeholder">⌨️</div>
                <h3>Mechanical Wireless Gaming Keyboard RGB</h3>
                <p>Hot-swappable switches, konektivitas tri-mode (Bluetooth / 2.4G / Type-C).</p>
                <div class="product-price-row">
                    <span class="price-now">Rp 749.000</span>
                </div>
                <a href="https://wa.me/?text=Halo%%2C%%20saya%%20ingin%%20order%%20Mechanical%%20Keyboard" target="_blank" class="btn-order-wa">
                    <span>Beli via WhatsApp →</span>
                </a>
            </div>
        </div>

        <section id="keunggulan">
            <div class="section-header">
                <h2>Kenapa Belanja di Toko Kami?</h2>
                <p>Layanan purna jual terbaik untuk menjamin kenyamanan dan keamanan setiap transaksi Anda.</p>
            </div>
            <div class="features-grid">
                <div class="feature-box">
                    <div class="feature-icon">🚚</div>
                    <h4>Gratis Ongkir Seluruh Indonesia</h4>
                    <p>Bebas biaya kirim untuk setiap transaksi dengan kurir ekspres rekanan terpercaya.</p>
                </div>
                <div class="feature-box">
                    <div class="feature-icon">🛡️</div>
                    <h4>Garansi Resmi 1 Tahun</h4>
                    <p>Jaminan ganti unit baru jika terdapat kendala fungsional dalam 7 hari pertama.</p>
                </div>
                <div class="feature-box">
                    <div class="feature-icon">💳</div>
                    <h4>Bayar Mudah (QRIS & COD)</h4>
                    <p>Dukungan pembayaran via transfer bank, e-wallet QRIS, dan bayar di tempat (COD).</p>
                </div>
            </div>
        </section>
    </main>

    <div class="pod-badge">
        <span class="pod-dot"></span>
        <span>Pod Kontainer Aktif (%s)</span>
    </div>

    <footer>
        <div class="container">
            <p>&copy; %d %s. Didukung oleh HeroCMS Container Engine & Traefik Edge Router.</p>
        </div>
    </footer>
</body>
</html>`,
		escapedName,
		accent,
		escapedName,
		escapedName,
		escapedHeadline,
		escapedBio,
		escapedName,
		escapedSub,
		2026,
		escapedName,
	)
}

func generatePortfolioHTML(name, sub, accent, headline, bio string) string {
	if headline == "" {
		headline = "Senior Full-Stack & Cloud Infrastructure Engineer"
	}
	if bio == "" {
		bio = "Mendesain arsitektur sistem berskala tinggi, kontainerisasi mandiri berbasis cgroups v2, dan orkestrasi microservices dengan reliabilitas tinggi."
	}

	escapedName := html.EscapeString(name)
	escapedHeadline := html.EscapeString(headline)
	escapedBio := html.EscapeString(bio)
	escapedSub := html.EscapeString(sub)

	avatarInitial := "P"
	if len(escapedName) > 0 {
		avatarInitial = strings.ToUpper(string([]rune(escapedName)[0]))
	}

	return fmt.Sprintf(`<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>%s | Portofolio & Engineer Showcase</title>
    <style>
        :root {
            --primary: %s;
            --primary-soft: color-mix(in srgb, var(--primary) 14%%, transparent);
            --bg: #090d16;
            --surface: #0f172a;
            --surface-hover: #1e293b;
            --border: rgba(255, 255, 255, 0.08);
            --text-main: #f8fafc;
            --text-muted: #94a3b8;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: var(--bg);
            color: var(--text-main);
            line-height: 1.6;
            min-height: 100vh;
        }
        .container { max-width: 1040px; margin: 0 auto; padding: 0 24px; }
        
        /* Navbar */
        nav {
            border-bottom: 1px solid var(--border);
            padding: 20px 0;
        }
        .nav-inner {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .brand {
            display: flex;
            align-items: center;
            gap: 12px;
            color: #fff;
            text-decoration: none;
            font-weight: 700;
            font-size: 1.15rem;
        }
        .avatar-circle {
            width: 38px;
            height: 38px;
            border-radius: 50%%;
            background: linear-gradient(135deg, var(--primary), #38bdf8);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            color: #fff;
        }
        .status-pill {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(16, 185, 129, 0.12);
            color: #10b981;
            border: 1px solid rgba(16, 185, 129, 0.3);
            padding: 6px 14px;
            border-radius: 999px;
            font-size: 0.8rem;
            font-weight: 600;
        }
        .pulse-dot { width: 7px; height: 7px; border-radius: 50%%; background: #10b981; }

        /* Hero */
        .hero {
            padding: 70px 0 50px;
        }
        .hero-pre {
            color: var(--primary);
            font-weight: 600;
            font-size: 0.95rem;
            margin-bottom: 12px;
            letter-spacing: 0.05em;
            text-transform: uppercase;
        }
        .hero h1 {
            font-size: 3rem;
            line-height: 1.2;
            letter-spacing: -0.03em;
            margin-bottom: 20px;
            max-width: 860px;
        }
        .hero p {
            color: var(--text-muted);
            font-size: 1.18rem;
            max-width: 700px;
            margin-bottom: 32px;
        }
        .hero-cta {
            display: flex;
            gap: 16px;
            flex-wrap: wrap;
            margin-bottom: 48px;
        }
        .btn-main {
            background: var(--primary);
            color: #fff;
            padding: 12px 26px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            font-size: 0.95rem;
            transition: all 0.2s;
        }
        .btn-main:hover { opacity: 0.92; transform: translateY(-2px); }
        .btn-ghost {
            background: var(--surface);
            color: #fff;
            border: 1px solid var(--border);
            padding: 12px 26px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            font-size: 0.95rem;
        }
        .btn-ghost:hover { background: var(--surface-hover); }

        /* Tech Stack Chips */
        .tech-stack-row {
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
            margin-bottom: 60px;
        }
        .tech-tag {
            background: var(--surface);
            border: 1px solid var(--border);
            padding: 6px 14px;
            border-radius: 8px;
            font-size: 0.82rem;
            color: var(--text-muted);
            font-family: monospace;
        }

        /* Projects */
        .projects-header {
            margin-bottom: 32px;
        }
        .projects-header h2 { font-size: 1.8rem; margin-bottom: 8px; }
        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 24px;
            margin-bottom: 60px;
        }
        .project-card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 14px;
            padding: 24px;
            transition: transform 0.2s, border-color 0.2s;
        }
        .project-card:hover {
            transform: translateY(-4px);
            border-color: rgba(255,255,255,0.2);
        }
        .proj-badge {
            display: inline-block;
            background: var(--primary-soft);
            color: var(--primary);
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 0.75rem;
            font-weight: 600;
            margin-bottom: 16px;
        }
        .project-card h3 { font-size: 1.2rem; margin-bottom: 10px; color: #fff; }
        .project-card p { font-size: 0.9rem; color: var(--text-muted); margin-bottom: 20px; }
        .proj-stats {
            display: flex;
            gap: 16px;
            border-top: 1px solid var(--border);
            padding-top: 16px;
            font-size: 0.8rem;
            color: #64748b;
        }
        .proj-stats span strong { color: #fff; }

        /* Floating Pod Badge */
        .pod-badge {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(15, 23, 42, 0.9);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(16, 185, 129, 0.4);
            border-radius: 999px;
            padding: 8px 16px;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.78rem;
            color: #10b981;
            box-shadow: 0 10px 25px rgba(0,0,0,0.5);
            z-index: 100;
        }

        /* Footer */
        footer {
            border-top: 1px solid var(--border);
            padding: 32px 0;
            text-align: center;
            color: #64748b;
            font-size: 0.85rem;
        }
    </style>
</head>
<body>
    <nav>
        <div class="container nav-inner">
            <a href="#" class="brand">
                <div class="avatar-circle">%s</div>
                <span>%s</span>
            </a>
            <div class="status-pill">
                <span class="pulse-dot"></span>
                <span>Tersedia untuk Kolaborasi</span>
            </div>
        </div>
    </nav>

    <main class="container">
        <section class="hero">
            <div class="hero-pre">Portofolio Teknis & Insinyur Sistem</div>
            <h1>%s</h1>
            <p>%s</p>
            <div class="hero-cta">
                <a href="#proyek" class="btn-main">Jelajahi Proyek Pilihan</a>
                <a href="mailto:kontak@%s" class="btn-ghost">Hubungi via Email</a>
            </div>

            <div class="tech-stack-row">
                <span class="tech-tag">Golang</span>
                <span class="tech-tag">Vue 3 / Vite</span>
                <span class="tech-tag">Docker Engine SDK</span>
                <span class="tech-tag">cgroups v2</span>
                <span class="tech-tag">Traefik Ingress</span>
                <span class="tech-tag">PostgreSQL RLS</span>
                <span class="tech-tag">Redis Sentinel</span>
                <span class="tech-tag">Kafka Messaging</span>
            </div>
        </section>

        <section id="proyek">
            <div class="projects-header">
                <h2>Proyek & Eksplorasi Arsitektur</h2>
                <p style="color: var(--text-muted); font-size: 0.95rem;">Rangkuman sistem produksi terdistribusi yang telah dibangun dan dioptimalkan.</p>
            </div>

            <div class="projects-grid">
                <div class="project-card">
                    <span class="proj-badge">Container Orchestrator</span>
                    <h3>High-Throughput Docker Sandbox Daemon</h3>
                    <p>Engine otomatisasi kontainer multi-tenant dengan isolasi CPU/RAM cgroups v2 dan dynamic router binding.</p>
                    <div class="proj-stats">
                        <span><strong>Latensi:</strong> 1.2ms</span>
                        <span><strong>Throughput:</strong> +42%%</span>
                    </div>
                </div>

                <div class="project-card">
                    <span class="proj-badge">Edge Network</span>
                    <h3>Traefik v3 Edge Mesh Ingress</h3>
                    <p>Rute reverse-proxy cerdas dengan dynamic Let's Encrypt TLS ALPN termination dan proteksi DDoS rate-limiting.</p>
                    <div class="proj-stats">
                        <span><strong>Protokol:</strong> HTTP/3</span>
                        <span><strong>SLA:</strong> 99.99%%</span>
                    </div>
                </div>

                <div class="project-card">
                    <span class="proj-badge">Data Layer</span>
                    <h3>PostgreSQL Multi-Tenant Row Level Security</h3>
                    <p>Arsitektur basis data relasional dengan isolasi tenant level kernel dan Redis distributed locking.</p>
                    <div class="proj-stats">
                        <span><strong>Isolasi:</strong> Kernel RLS</span>
                        <span><strong>Query TTFB:</strong> 0.4ms</span>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <div class="pod-badge">
        <span class="pulse-dot"></span>
        <span>Pod Kontainer Aktif (%s)</span>
    </div>

    <footer>
        <div class="container">
            <p>&copy; %d %s. Berjalan di atas HeroCMS Sandbox Engine.</p>
        </div>
    </footer>
</body>
</html>`,
		escapedName,
		accent,
		avatarInitial,
		escapedName,
		escapedHeadline,
		escapedBio,
		escapedSub,
		escapedSub,
		2026,
		escapedName,
	)
}

func generateBlogHTML(name, sub, accent, headline, bio string) string {
	if headline == "" {
		headline = "Menjelajah Arsitektur Kontainer Modern & Edge Ingress Berbasis cgroups v2"
	}
	if bio == "" {
		bio = "Publikasi engineering, wawasan rekayasa perangkat lunak, dan catatan mendalam mengenai distributed systems, optimasi performa web, dan keamanan multi-tenant."
	}

	escapedName := html.EscapeString(name)
	escapedHeadline := html.EscapeString(headline)
	escapedBio := html.EscapeString(bio)
	escapedSub := html.EscapeString(sub)

	return fmt.Sprintf(`<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>%s | Editorial Media & Publikasi</title>
    <style>
        :root {
            --primary: %s;
            --primary-soft: color-mix(in srgb, var(--primary) 14%%, transparent);
            --bg: #090d16;
            --surface: #0f172a;
            --border: rgba(255, 255, 255, 0.08);
            --text-main: #f8fafc;
            --text-muted: #94a3b8;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: var(--bg);
            color: var(--text-main);
            line-height: 1.6;
            min-height: 100vh;
        }
        .container { max-width: 1080px; margin: 0 auto; padding: 0 24px; }
        
        /* Masthead */
        header.masthead {
            border-bottom: 1px solid var(--border);
            padding: 24px 0;
            background: rgba(15, 23, 42, 0.8);
            backdrop-filter: blur(12px);
        }
        .masthead-inner {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .brand-title {
            font-size: 1.4rem;
            font-weight: 800;
            color: #fff;
            text-decoration: none;
            letter-spacing: -0.02em;
        }
        .category-nav {
            display: flex;
            gap: 20px;
            list-style: none;
        }
        .category-nav a {
            color: var(--text-muted);
            text-decoration: none;
            font-size: 0.9rem;
            font-weight: 500;
        }
        .category-nav a:hover { color: #fff; }

        /* Featured Article Hero */
        .featured-banner {
            margin: 40px auto;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 40px;
        }
        .featured-pill {
            display: inline-block;
            background: var(--primary-soft);
            color: var(--primary);
            padding: 4px 12px;
            border-radius: 999px;
            font-size: 0.8rem;
            font-weight: 700;
            text-transform: uppercase;
            margin-bottom: 16px;
        }
        .featured-banner h1 {
            font-size: 2.2rem;
            line-height: 1.3;
            letter-spacing: -0.02em;
            margin-bottom: 16px;
            color: #fff;
        }
        .featured-banner p {
            font-size: 1.05rem;
            color: var(--text-muted);
            margin-bottom: 24px;
            max-width: 800px;
        }
        .article-meta {
            display: flex;
            align-items: center;
            gap: 16px;
            font-size: 0.85rem;
            color: #64748b;
        }

        /* Articles Grid */
        .articles-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 24px;
            margin-bottom: 60px;
        }
        .article-card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 24px;
            display: flex;
            flex-direction: column;
            transition: transform 0.2s;
        }
        .article-card:hover { transform: translateY(-4px); }
        .article-tag { font-size: 0.75rem; color: var(--primary); font-weight: 700; margin-bottom: 10px; }
        .article-card h3 { font-size: 1.15rem; color: #fff; margin-bottom: 10px; line-height: 1.4; }
        .article-card p { font-size: 0.88rem; color: var(--text-muted); margin-bottom: 20px; flex: 1; }
        .article-footer {
            border-top: 1px solid var(--border);
            padding-top: 14px;
            display: flex;
            justify-content: space-between;
            font-size: 0.8rem;
            color: #64748b;
        }

        /* Newsletter Box */
        .newsletter-card {
            background: linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(15, 23, 42, 0.9));
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 40px;
            text-align: center;
            margin-bottom: 60px;
        }
        .newsletter-card h2 { font-size: 1.6rem; margin-bottom: 10px; }
        .newsletter-card p { color: var(--text-muted); font-size: 0.95rem; margin-bottom: 24px; }
        .newsletter-form {
            display: flex;
            justify-content: center;
            gap: 12px;
            max-width: 480px;
            margin: 0 auto;
        }
        .input-email {
            background: #090d16;
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 12px 16px;
            color: #fff;
            flex: 1;
        }
        .btn-subscribe {
            background: var(--primary);
            color: #fff;
            border: none;
            border-radius: 8px;
            padding: 12px 20px;
            font-weight: 600;
            cursor: pointer;
        }

        .pod-badge {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(15, 23, 42, 0.9);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(16, 185, 129, 0.4);
            border-radius: 999px;
            padding: 8px 16px;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.78rem;
            color: #10b981;
            z-index: 100;
        }
        .pulse-dot { width: 7px; height: 7px; border-radius: 50%%; background: #10b981; }

        footer {
            border-top: 1px solid var(--border);
            padding: 32px 0;
            text-align: center;
            color: #64748b;
            font-size: 0.85rem;
        }
    </style>
</head>
<body>
    <header class="masthead">
        <div class="container masthead-inner">
            <a href="#" class="brand-title">📰 %s</a>
            <ul class="category-nav">
                <li><a href="#">Arsitektur Sistem</a></li>
                <li><a href="#">DevOps</a></li>
                <li><a href="#">Cloud Security</a></li>
                <li><a href="#">Kinerja Web</a></li>
            </ul>
        </div>
    </header>

    <main class="container">
        <article class="featured-banner">
            <span class="featured-pill">Artikel Utama</span>
            <h1>%s</h1>
            <p>%s</p>
            <div class="article-meta">
                <span>Ditulis oleh Redaksi %s</span>
                <span>•</span>
                <span>⏱ 5 menit membaca</span>
                <span>•</span>
                <span>24 Oktober 2026</span>
            </div>
        </article>

        <section class="articles-grid">
            <div class="article-card">
                <span class="article-tag">ISOLASI MULTI-TENANT</span>
                <h3>Mekanisme Sandboxing Linux cgroups v2 pada Kontainer Otomatis</h3>
                <p>Bagaimana pembatasan kuota CPU dan batas memori 256MB melindungi server dari beban berlebih.</p>
                <div class="article-footer">
                    <span>DevOps & Infra</span>
                    <span>4 min baca</span>
                </div>
            </div>

            <div class="article-card">
                <span class="article-tag">EDGE ROUTING</span>
                <h3>Traefik v3 HTTP/3 & Otomasi Sertifikat SSL Wildcard</h3>
                <p>Strategi penanganan puluhan ribu subdomain dinamis dengan zero-downtime reconfiguration.</p>
                <div class="article-footer">
                    <span>Networking</span>
                    <span>6 min baca</span>
                </div>
            </div>

            <div class="article-card">
                <span class="article-tag">DATA INTEGRITY</span>
                <h3>Zero-Trust Data Boundary dengan PostgreSQL Row-Level Security</h3>
                <p>Pemisahan data multi-tenant di tingkat query engine dengan verifikasi context tenant_id.</p>
                <div class="article-footer">
                    <span>Database</span>
                    <span>5 min baca</span>
                </div>
            </div>
        </section>

        <div class="newsletter-card">
            <h2>Dapatkan Wawasan Engineering Setiap Minggu</h2>
            <p>Bergabunglah dengan ribuan pengembang yang menerima artikel teknis dan arsitektur sistem langsung ke inbox.</p>
            <form class="newsletter-form" onsubmit="event.preventDefault(); alert('Terima kasih telah berlangganan!');">
                <input type="email" placeholder="nama@perusahaan.com" class="input-email" required />
                <button type="submit" class="btn-subscribe">Langganan Gratis</button>
            </form>
        </div>
    </main>

    <div class="pod-badge">
        <span class="pulse-dot"></span>
        <span>Pod Kontainer Aktif (%s)</span>
    </div>

    <footer>
        <div class="container">
            <p>&copy; %d %s. Didukung oleh HeroCMS Container Engine & Traefik Edge Router.</p>
        </div>
    </footer>
</body>
</html>`,
		escapedName,
		accent,
		escapedName,
		escapedHeadline,
		escapedBio,
		escapedName,
		escapedSub,
		2026,
		escapedName,
	)
}

func generateEducationHTML(name, sub, accent, headline, bio string) string {
	if headline == "" {
		headline = "Platform Edukasi & Kursus Rekayasa Perangkat Lunak Modern"
	}
	if bio == "" {
		bio = "Tingkatkan keahlian rekayasa software dan cloud computing melalui kurikulum berbasis proyek nyata dari praktisi industri terkemuka."
	}

	escapedName := html.EscapeString(name)
	escapedHeadline := html.EscapeString(headline)
	escapedBio := html.EscapeString(bio)
	escapedSub := html.EscapeString(sub)

	return fmt.Sprintf(`<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>%s | Pusat Edukasi & Kursus Online</title>
    <style>
        :root {
            --primary: %s;
            --primary-soft: color-mix(in srgb, var(--primary) 14%%, transparent);
            --bg: #090d16;
            --surface: #0f172a;
            --border: rgba(255, 255, 255, 0.08);
            --text-main: #f8fafc;
            --text-muted: #94a3b8;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: var(--bg);
            color: var(--text-main);
            line-height: 1.6;
            min-height: 100vh;
        }
        .container { max-width: 1100px; margin: 0 auto; padding: 0 24px; }
        
        /* Navbar */
        nav {
            border-bottom: 1px solid var(--border);
            padding: 18px 0;
            background: rgba(15, 23, 42, 0.85);
            backdrop-filter: blur(12px);
            position: sticky;
            top: 0;
            z-index: 50;
        }
        .nav-inner {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .brand {
            display: flex;
            align-items: center;
            gap: 10px;
            color: #fff;
            text-decoration: none;
            font-weight: 700;
            font-size: 1.2rem;
        }
        .brand-badge {
            background: var(--primary);
            color: #fff;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 0.8rem;
        }
        .nav-links {
            display: flex;
            gap: 24px;
            list-style: none;
        }
        .nav-links a {
            color: var(--text-muted);
            text-decoration: none;
            font-size: 0.92rem;
            font-weight: 500;
        }
        .nav-links a:hover { color: #fff; }
        .btn-register-top {
            background: var(--primary);
            color: #fff;
            padding: 8px 18px;
            border-radius: 8px;
            text-decoration: none;
            font-size: 0.88rem;
            font-weight: 600;
        }

        /* Hero */
        .hero {
            padding: 70px 0 50px;
            text-align: center;
        }
        .badge-academy {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: var(--primary-soft);
            color: var(--primary);
            border: 1px solid var(--primary);
            padding: 6px 16px;
            border-radius: 999px;
            font-size: 0.82rem;
            font-weight: 600;
            margin-bottom: 24px;
        }
        .hero h1 {
            font-size: 2.8rem;
            line-height: 1.25;
            letter-spacing: -0.02em;
            margin-bottom: 20px;
            max-width: 820px;
            margin-left: auto;
            margin-right: auto;
        }
        .hero p {
            color: var(--text-muted);
            font-size: 1.15rem;
            max-width: 680px;
            margin: 0 auto 32px;
        }
        .hero-buttons {
            display: flex;
            justify-content: center;
            gap: 16px;
            margin-bottom: 50px;
        }
        .btn-cta-primary {
            background: var(--primary);
            color: #fff;
            padding: 14px 28px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 600;
        }
        .btn-cta-secondary {
            background: var(--surface);
            color: #fff;
            border: 1px solid var(--border);
            padding: 14px 28px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 600;
        }

        /* Value Metrics */
        .value-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 60px;
        }
        .value-card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 20px;
            text-align: center;
        }
        .value-card h3 { font-size: 1.8rem; color: #fff; margin-bottom: 4px; }
        .value-card p { font-size: 0.85rem; color: var(--text-muted); }

        /* Courses Grid */
        .courses-header {
            text-align: center;
            margin-bottom: 36px;
        }
        .courses-header h2 { font-size: 2rem; margin-bottom: 8px; }
        .courses-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 24px;
            margin-bottom: 70px;
        }
        .course-card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 14px;
            padding: 24px;
            display: flex;
            flex-direction: column;
            transition: transform 0.2s;
        }
        .course-card:hover { transform: translateY(-4px); }
        .course-level {
            display: inline-block;
            background: var(--primary-soft);
            color: var(--primary);
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 0.75rem;
            font-weight: 700;
            margin-bottom: 14px;
        }
        .course-card h3 { font-size: 1.2rem; color: #fff; margin-bottom: 10px; line-height: 1.4; }
        .course-card p { font-size: 0.88rem; color: var(--text-muted); margin-bottom: 20px; flex: 1; }
        .course-meta {
            display: flex;
            justify-content: space-between;
            border-top: 1px solid var(--border);
            padding-top: 14px;
            font-size: 0.82rem;
            color: #64748b;
            margin-bottom: 16px;
        }
        .btn-enroll {
            background: var(--primary);
            color: #fff;
            padding: 10px;
            text-align: center;
            text-decoration: none;
            border-radius: 8px;
            font-size: 0.9rem;
            font-weight: 600;
        }

        .pod-badge {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(15, 23, 42, 0.9);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(16, 185, 129, 0.4);
            border-radius: 999px;
            padding: 8px 16px;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.78rem;
            color: #10b981;
            z-index: 100;
        }
        .pulse-dot { width: 7px; height: 7px; border-radius: 50%%; background: #10b981; }

        footer {
            border-top: 1px solid var(--border);
            padding: 32px 0;
            text-align: center;
            color: #64748b;
            font-size: 0.85rem;
        }
    </style>
</head>
<body>
    <nav>
        <div class="container nav-inner">
            <a href="#" class="brand">
                <span class="brand-badge">ACADEMY</span>
                <span>%s</span>
            </a>
            <ul class="nav-links">
                <li><a href="#kursus">Katalog Kursus</a></li>
                <li><a href="#kurikulum">Silabus</a></li>
                <li><a href="#sertifikasi">Sertifikasi</a></li>
            </ul>
            <a href="#kursus" class="btn-register-top">Daftar Belajar</a>
        </div>
    </nav>

    <main class="container">
        <section class="hero">
            <div class="badge-academy">🎓 Standar Kurikulum Industri Cloud & Engineering</div>
            <h1>%s</h1>
            <p>%s</p>
            <div class="hero-buttons">
                <a href="#kursus" class="btn-cta-primary">Mulai Belajar Sekarang</a>
                <a href="#kursus" class="btn-cta-secondary">Lihat Kurikulum Lengkap</a>
            </div>

            <div class="value-grid">
                <div class="value-card">
                    <h3>12+</h3>
                    <p>Modul Berbasis Proyek</p>
                </div>
                <div class="value-card">
                    <h3>40+ Jam</h3>
                    <p>Materi Video Praktik</p>
                </div>
                <div class="value-card">
                    <h3>3.500+</h3>
                    <p>Alumni Terverifikasi</p>
                </div>
                <div class="value-card">
                    <h3>100%%</h3>
                    <p>Sertifikat Kompetensi Resmi</p>
                </div>
            </div>
        </section>

        <section id="kursus">
            <div class="courses-header">
                <h2>Kursus Rekayasa Perangkat Lunak Populer</h2>
                <p style="color: var(--text-muted); font-size: 0.95rem;">Dipandu oleh instruktur berpengalaman dengan standar arsitektur kelas enterprise.</p>
            </div>

            <div class="courses-grid">
                <div class="course-card">
                    <span class="course-level">TINGKAT: MENENGAH</span>
                    <h3>Cloud Native Microservices dengan Go & Docker Engine</h3>
                    <p>Pelajari cara mendesain backend berkinerja tinggi, sandboxing kontainer Linux, dan komunikasi event via Kafka.</p>
                    <div class="course-meta">
                        <span>⏱ 16 Jam</span>
                        <span>⭐ 4.95 (1.250 siswa)</span>
                    </div>
                    <a href="#" class="btn-enroll">Pelajari Silabus →</a>
                </div>

                <div class="course-card">
                    <span class="course-level">TINGKAT: PEMULA</span>
                    <h3>Arsitektur Frontend Reaktif dengan Vue 3 & Vite</h3>
                    <p>Kuasai Composition API, Pinia State Management, Code-Splitting, dan integrasi API RESTful modern.</p>
                    <div class="course-meta">
                        <span>⏱ 20 Jam</span>
                        <span>⭐ 4.98 (2.800 siswa)</span>
                    </div>
                    <a href="#" class="btn-enroll">Pelajari Silabus →</a>
                </div>

                <div class="course-card">
                    <span class="course-level">TINGKAT: LANJUTAN</span>
                    <h3>Zero-Trust Edge Security & Traefik Ingress Mesh</h3>
                    <p>Implementasi keamanan perimeter TLS ALPN 1.3, mitigasi OWASP Top 10, dan otentikasi JWT distributed Redis.</p>
                    <div class="course-meta">
                        <span>⏱ 14 Jam</span>
                        <span>⭐ 5.0 (890 siswa)</span>
                    </div>
                    <a href="#" class="btn-enroll">Pelajari Silabus →</a>
                </div>
            </div>
        </section>
    </main>

    <div class="pod-badge">
        <span class="pulse-dot"></span>
        <span>Pod Kontainer Aktif (%s)</span>
    </div>

    <footer>
        <div class="container">
            <p>&copy; %d %s. Didukung oleh HeroCMS Container Engine & Traefik Edge Router.</p>
        </div>
    </footer>
</body>
</html>`,
		escapedName,
		accent,
		escapedName,
		escapedHeadline,
		escapedBio,
		escapedSub,
		2026,
		escapedName,
	)
}
