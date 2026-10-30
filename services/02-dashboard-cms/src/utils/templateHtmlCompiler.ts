import type { OfficialTemplateItem } from '../data/templates-data';
import type { VisualBlock, MultiPageItem } from '../types/dashboard';

export interface CompileTemplateOptions {
  siteName?: string;
  subdomain?: string;
  accentColor?: string;
  roleOrHeadline?: string;
  bioIntro?: string;
  isDarkMode?: boolean;
  blocksOverride?: VisualBlock[];
}

function escapeHtml(str?: string): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function compileTemplateToHTML(
  template: OfficialTemplateItem,
  options: CompileTemplateOptions = {}
): string {
  const siteName = escapeHtml(options.siteName || template.title.split('&')[0].trim());
  const subdomain = escapeHtml(options.subdomain || 'stackbyte.id');
  const accentColor = options.accentColor || template.accentColor || '#2563eb';
  const roleHeadline = escapeHtml(options.roleOrHeadline || template.defaultRole || template.title);
  const bioIntro = escapeHtml(options.bioIntro || template.defaultBio || template.desc);
  const fontFamily = template.fontFamily || 'Plus Jakarta Sans';
  const isDarkMode = options.isDarkMode || false;
  const blocks: VisualBlock[] = options.blocksOverride && options.blocksOverride.length > 0
    ? options.blocksOverride
    : template.blocks || [];

  let renderedBlocksHtml = '';

  for (let idx = 0; idx < blocks.length; idx++) {
    const block = blocks[idx];
    if (block.isVisible === false) continue;

    switch (block.type) {
      case 'navbar': {
        const glyph = block.styles?.brandGlyph || (template.category === 'portfolio' ? 'R' : siteName.slice(0, 1) || 'H');
        const brandTitle = escapeHtml(block.title || siteName);
        const buttonText = block.buttonText ? escapeHtml(block.buttonText) : '';
        const buttonUrl = block.buttonUrl || '#contact';
        const isSticky = block.styles?.isSticky !== false;
        const navStyle = block.styles?.navStyle || 'glass';
        const navAlign = block.styles?.navAlign || 'split';

        let navLinks = '';
        if (block.items && block.items.length > 0) {
          navLinks = block.items
            .map((item, i) => {
              const activeClass = item.active || i === 0 ? ' class="active"' : '';
              return `<a href="${escapeHtml(item.url || '#')}"${activeClass}>${escapeHtml(item.title)}</a>`;
            })
            .join('\n            ');
        } else {
          navLinks = template.category === 'business'
            ? `
            <a href="#hero">Beranda</a>
            <a href="#products">Katalog Produk</a>
            <a href="#features">Keunggulan</a>
            <a href="#contact">WhatsApp Toko</a>
          `
            : template.category === 'education'
            ? `
            <a href="#hero">Beranda</a>
            <a href="#courses">Katalog Kursus</a>
            <a href="#syllabus">Silabus Modul</a>
            <a href="#pricing">Biaya Belajar</a>
          `
            : `
            <a href="#hero">Beranda</a>
            <a href="#showcase">Karya & Proyek</a>
            <a href="#features">Teknologi</a>
            <a href="#contact">Hubungi Saya</a>
          `;
        }

        const stickyStyle = isSticky ? 'position: sticky; top: 0; z-index: 50;' : 'position: relative;';
        const bgStyle =
          navStyle === 'solid'
            ? isDarkMode
              ? 'background: #0f172a;'
              : 'background: #ffffff;'
            : navStyle === 'transparent'
            ? 'background: transparent; border-bottom: none; backdrop-filter: none;'
            : navStyle === 'bordered'
            ? isDarkMode
              ? 'background: #0f172a; border-bottom: 2px solid #334155;'
              : 'background: #ffffff; border-bottom: 2px solid #cbd5e1;'
            : '';
        const alignClass = navAlign === 'center' ? ' is-centered' : '';

        renderedBlocksHtml += `
        <!-- NAVBAR -->
        <header class="sim-block-navbar${alignClass}" style="${stickyStyle} ${bgStyle}">
          <div class="sim-brand-area">
            <span class="sim-brand-glyph" style="background-color: ${accentColor}; color: #ffffff;">
              ${glyph}
            </span>
            <span class="sim-brand-title" style="color: ${isDarkMode ? '#ffffff' : '#0f172a'};">
              ${brandTitle}
            </span>
          </div>
          <nav class="sim-nav-links-row">
            ${navLinks}
          </nav>
          <div class="sim-nav-actions">
            ${buttonText ? `<a href="${escapeHtml(buttonUrl)}" class="sim-btn-nav-cta" style="background-color: ${accentColor}; text-decoration: none;">${buttonText}</a>` : ''}
          </div>
        </header>`;
        break;
      }

      case 'hero': {
        const badge = block.badge ? escapeHtml(block.badge) : '';
        const headline = escapeHtml(block.title || roleHeadline);
        const subheadline = escapeHtml(block.subtitle || bioIntro);
        const btnPrimary = block.buttonText ? escapeHtml(block.buttonText) : 'Mulai Sekarang';
        const btnSecondary = block.secondaryButtonText ? escapeHtml(block.secondaryButtonText) : '';
        const targetUrl = block.buttonUrl || '#contact';

        // Include terminal mockup for portfolio
        let terminalHtml = '';
        if (template.category === 'portfolio' || template.id === 'tpl_portfolio_pro') {
          terminalHtml = `
          <div class="sim-terminal-strip">
            <div class="terminal-strip-top">
              <div class="terminal-strip-dots">
                <span class="d-red"></span><span class="d-yellow"></span><span class="d-green"></span>
              </div>
              <span class="terminal-strip-title">node-edge-cluster ~ zsh</span>
              <span class="terminal-strip-badge">Traefik v3 HTTP/3</span>
            </div>
            <div class="terminal-strip-content">
              <div class="t-line">
                <span class="t-prefix">rizal@stackbyte:~$</span>
                <span class="t-command">curl -s https://${subdomain}/telemetry | jq '{status, engine, latency}'</span>
              </div>
              <div class="t-response">
                <span class="t-bracket">{</span>
                <div class="t-indent">
                  <div><span class="t-key">"status"</span>: <span class="t-green">"200_ACTIVE_RUNNING"</span>,</div>
                  <div><span class="t-key">"edge_router"</span>: <span class="t-cyan">"Traefik v3.1 TLS 1.3"</span>,</div>
                  <div><span class="t-key">"isolation"</span>: <span class="t-blue">"Docker Linux cgroups v2"</span>,</div>
                  <div><span class="t-key">"avg_ttfb"</span>: <span class="t-yellow">"1.2ms"</span></div>
                </div>
                <span class="t-bracket">}</span>
              </div>
            </div>
          </div>`;
        }

        renderedBlocksHtml += `
        <!-- HERO SECTION -->
        <section class="sim-block-hero" id="hero">
          ${badge ? `
          <div class="sim-hero-badge-pill" style="background-color: ${accentColor}18; color: ${accentColor}; border-color: ${accentColor}40;">
            <span>${badge}</span>
          </div>` : ''}
          <h1 class="sim-hero-headline" style="color: ${isDarkMode ? '#ffffff' : '#0f172a'};">
            ${headline}
          </h1>
          <p class="sim-hero-subheadline" style="color: ${isDarkMode ? '#94a3b8' : '#475569'};">
            ${subheadline}
          </p>
          <div class="sim-hero-btn-group">
            <a href="${targetUrl}" class="sim-btn-primary" style="background-color: ${accentColor}; text-decoration: none;">
              <span>${btnPrimary}</span>
              <span style="font-size: 1.1em; line-height: 1;">&rarr;</span>
            </a>
            ${btnSecondary ? `
            <a href="#about" class="sim-btn-secondary ${isDarkMode ? 'btn-sec-dark' : ''}" style="text-decoration: none;">
              <span>${btnSecondary}</span>
            </a>` : ''}
          </div>
          ${terminalHtml}
        </section>`;
        break;
      }

      case 'stats': {
        const items = block.items || [];
        let itemsHtml = '';
        for (const item of items) {
          itemsHtml += `
          <div class="sim-stat-box">
            <span class="sim-stat-value" style="color: ${accentColor};">
              ${escapeHtml(item.title)}
            </span>
            <span class="sim-stat-desc" style="color: ${isDarkMode ? '#cbd5e1' : '#64748b'};">
              ${escapeHtml(item.desc)}
            </span>
          </div>`;
        }

        renderedBlocksHtml += `
        <!-- STATS SECTION -->
        <section class="sim-block-stats ${isDarkMode ? 'stats-dark' : ''}" id="stats">
          <div class="sim-stats-container">
            ${itemsHtml}
          </div>
        </section>`;
        break;
      }

      case 'features': {
        const badge = block.badge ? escapeHtml(block.badge) : '';
        const title = escapeHtml(block.title || 'Keunggulan Arsitektur');
        const subtitle = block.subtitle ? escapeHtml(block.subtitle) : '';
        const items = block.items || [];
        let featuresHtml = '';

        for (let fIdx = 0; fIdx < items.length; fIdx++) {
          const item = items[fIdx];
          const iconGlyph = fIdx % 3 === 0 ? '⚡' : fIdx % 3 === 1 ? '🛡️' : '✨';
          featuresHtml += `
          <div class="sim-feature-card-item ${isDarkMode ? 'card-dark' : ''}">
            <div class="sim-feature-icon-box" style="background-color: ${accentColor}18; color: ${accentColor};">
              <span>${iconGlyph}</span>
            </div>
            <strong style="color: ${isDarkMode ? '#f8fafc' : '#0f172a'};">${escapeHtml(item.title)}</strong>
            <p style="color: ${isDarkMode ? '#94a3b8' : '#64748b'};">${escapeHtml(item.desc)}</p>
          </div>`;
        }

        renderedBlocksHtml += `
        <!-- FEATURES SECTION -->
        <section class="sim-block-features ${isDarkMode ? 'features-dark' : ''}" id="features">
          <div class="sim-section-header-wrap">
            ${badge ? `<span class="sim-section-sub-badge" style="color: ${accentColor};">${badge}</span>` : ''}
            <h2 class="sim-section-title" style="color: ${isDarkMode ? '#ffffff' : '#0f172a'};">${title}</h2>
            ${subtitle ? `<p class="sim-section-sub" style="color: ${isDarkMode ? '#94a3b8' : '#64748b'};">${subtitle}</p>` : ''}
          </div>
          <div class="sim-features-grid">
            ${featuresHtml}
          </div>
        </section>`;
        break;
      }

      case 'showcase': {
        const title = escapeHtml(block.title || 'Showcase & Portofolio Karya');
        const subtitle = block.subtitle ? escapeHtml(block.subtitle) : '';
        const items = block.items || [];
        let showcaseHtml = '';

        for (const item of items) {
          const tag = escapeHtml(item.tag || 'Studi Kasus');
          showcaseHtml += `
          <div class="sim-showcase-card ${isDarkMode ? 'card-dark' : ''}">
            <div class="sim-showcase-preview-banner" style="background: linear-gradient(135deg, #090d16 0%, ${accentColor} 100%);">
              <div class="showcase-thumb-content">
                <span style="font-size: 1.8rem;">📁</span>
                <span>${tag}</span>
              </div>
            </div>
            <div class="sim-showcase-body">
              <span class="showcase-tag-pill" style="color: ${accentColor}; background-color: ${accentColor}15;">
                ${tag}
              </span>
              <strong style="color: ${isDarkMode ? '#ffffff' : '#0f172a'};">${escapeHtml(item.title)}</strong>
              <p style="color: ${isDarkMode ? '#94a3b8' : '#64748b'};">${escapeHtml(item.desc)}</p>
              <a href="#contact" class="sim-btn-text-link" style="color: ${accentColor}; text-decoration: none;">
                <span>Eksplorasi Proyek &rarr;</span>
              </a>
            </div>
          </div>`;
        }

        renderedBlocksHtml += `
        <!-- SHOWCASE SECTION -->
        <section class="sim-block-showcase ${isDarkMode ? 'showcase-dark' : ''}" id="showcase">
          <div class="sim-section-header-wrap">
            <h2 class="sim-section-title" style="color: ${isDarkMode ? '#ffffff' : '#0f172a'};">${title}</h2>
            ${subtitle ? `<p class="sim-section-sub" style="color: ${isDarkMode ? '#94a3b8' : '#64748b'};">${subtitle}</p>` : ''}
          </div>
          <div class="sim-showcase-grid">
            ${showcaseHtml}
          </div>
        </section>`;
        break;
      }

      case 'card': {
        const title = escapeHtml(block.title || 'Katalog Pilihan');
        const subtitle = block.subtitle ? escapeHtml(block.subtitle) : '';
        const items = block.items || [];
        let cardsHtml = '';

        for (const item of items) {
          const priceBadge = item.price ? `<span class="card-price-badge" style="background-color: ${accentColor};">${escapeHtml(item.price)}</span>` : '';
          const catBadge = !item.price && item.tag ? `<span class="card-cat-badge">${escapeHtml(item.tag)}</span>` : '';
          const actionText = item.price ? 'Pesan via WhatsApp &rarr;' : 'Baca Selengkapnya &rarr;';
          const actionLink = item.price
            ? `https://wa.me/?text=Halo,%20saya%20tertarik%20dengan%20${encodeURIComponent(item.title)}`
            : '#';

          cardsHtml += `
          <div class="sim-rich-content-card ${isDarkMode ? 'card-dark' : ''}">
            <div class="card-thumb-canvas" style="background: linear-gradient(135deg, #1e293b 0%, ${accentColor}40 100%);">
              ${priceBadge || catBadge}
            </div>
            <div class="card-inner-body">
              <strong style="color: ${isDarkMode ? '#ffffff' : '#0f172a'};">${escapeHtml(item.title)}</strong>
              <p style="color: ${isDarkMode ? '#94a3b8' : '#64748b'};">${escapeHtml(item.desc)}</p>
              <a href="${actionLink}" target="_blank" class="sim-btn-card-action" style="background-color: ${accentColor}18; color: ${accentColor}; border-color: ${accentColor}40; text-decoration: none;">
                <span>${actionText}</span>
              </a>
            </div>
          </div>`;
        }

        renderedBlocksHtml += `
        <!-- CARDS / PRODUCTS / ARTICLES SECTION -->
        <section class="sim-block-cards-section ${isDarkMode ? 'cards-dark' : ''}" id="products">
          <div class="sim-section-header-wrap">
            <h2 class="sim-section-title" style="color: ${isDarkMode ? '#ffffff' : '#0f172a'};">${title}</h2>
            ${subtitle ? `<p class="sim-section-sub" style="color: ${isDarkMode ? '#94a3b8' : '#64748b'};">${subtitle}</p>` : ''}
          </div>
          <div class="sim-cards-grid">
            ${cardsHtml}
          </div>
        </section>`;
        break;
      }

      case 'listgroup': {
        const title = escapeHtml(block.title || 'Indeks Tren & Referensi');
        const items = block.items || [];
        let listHtml = '';

        for (let lIdx = 0; lIdx < items.length; lIdx++) {
          const item = items[lIdx];
          listHtml += `
          <div class="sim-listgroup-row ${isDarkMode ? 'row-dark' : ''}">
            <div class="listgroup-rank" style="background-color: ${accentColor}18; color: ${accentColor};">
              #${lIdx + 1}
            </div>
            <div class="listgroup-text">
              <strong style="color: ${isDarkMode ? '#ffffff' : '#0f172a'};">${escapeHtml(item.title)}</strong>
              <span style="color: ${isDarkMode ? '#94a3b8' : '#64748b'};">${escapeHtml(item.desc)}</span>
            </div>
            <span class="listgroup-arrow">&rsaquo;</span>
          </div>`;
        }

        renderedBlocksHtml += `
        <!-- LISTGROUP SECTION -->
        <section class="sim-block-listgroup ${isDarkMode ? 'listgroup-dark' : ''}" id="listgroup">
          <div class="sim-section-header-wrap">
            <h2 class="sim-section-title" style="color: ${isDarkMode ? '#ffffff' : '#0f172a'};">${title}</h2>
          </div>
          <div class="sim-listgroup-stack">
            ${listHtml}
          </div>
        </section>`;
        break;
      }

      case 'accordion': {
        const title = escapeHtml(block.title || 'Silabus Modul & Pertanyaan Umum');
        const subtitle = block.subtitle ? escapeHtml(block.subtitle) : '';
        const items = block.items || [];
        let accHtml = '';

        for (let aIdx = 0; aIdx < items.length; aIdx++) {
          const item = items[aIdx];
          const isOpen = aIdx === 0;
          accHtml += `
          <div class="sim-accordion-item ${isOpen ? 'open' : ''} ${isDarkMode ? 'item-dark' : ''}" onclick="toggleAcc(this)">
            <button class="sim-accordion-header" style="color: ${isDarkMode ? '#ffffff' : '#0f172a'};">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="color: ${accentColor}; font-weight: 700;">✦</span>
                <span>${escapeHtml(item.title)}</span>
              </div>
              <span class="sim-acc-arrow ${isOpen ? 'rotated' : ''}">&darr;</span>
            </button>
            <div class="sim-accordion-body" style="display: ${isOpen ? 'block' : 'none'}; color: ${isDarkMode ? '#94a3b8' : '#64748b'};">
              <p>${escapeHtml(item.desc)}</p>
            </div>
          </div>`;
        }

        renderedBlocksHtml += `
        <!-- ACCORDION / FAQ / SYLLABUS SECTION -->
        <section class="sim-block-accordion ${isDarkMode ? 'accordion-dark' : ''}" id="syllabus">
          <div class="sim-section-header-wrap">
            <h2 class="sim-section-title" style="color: ${isDarkMode ? '#ffffff' : '#0f172a'};">${title}</h2>
            ${subtitle ? `<p class="sim-section-sub" style="color: ${isDarkMode ? '#94a3b8' : '#64748b'};">${subtitle}</p>` : ''}
          </div>
          <div class="sim-accordion-stack">
            ${accHtml}
          </div>
        </section>`;
        break;
      }

      case 'pricing': {
        const title = escapeHtml(block.title || 'Paket Layanan & Investasi');
        const subtitle = block.subtitle ? escapeHtml(block.subtitle) : '';
        const items = block.items || [];
        let tiersHtml = '';

        for (let pIdx = 0; pIdx < items.length; pIdx++) {
          const plan = items[pIdx];
          const isFeatured = pIdx === 1;
          tiersHtml += `
          <div class="sim-pricing-tier-card ${isDarkMode ? 'card-dark' : ''} ${isFeatured ? 'featured' : ''}" style="${isFeatured ? `border-color: ${accentColor};` : ''}">
            ${isFeatured ? `<span class="tier-popular-tag" style="background-color: ${accentColor};">Paling Populer</span>` : ''}
            <strong class="tier-name" style="color: ${isDarkMode ? '#ffffff' : '#0f172a'};">${escapeHtml(plan.title)}</strong>
            <div class="tier-price-row">
              <span class="tier-price" style="color: ${accentColor};" data-monthly="${escapeHtml(plan.price || 'Rp 249k')}" data-annual="Hemat ${escapeHtml(plan.price || 'Rp 199k')}">
                ${escapeHtml(plan.price || 'Rp 249k')}
              </span>
              <span class="tier-period">/ bln</span>
            </div>
            <p class="tier-desc" style="color: ${isDarkMode ? '#94a3b8' : '#64748b'};">${escapeHtml(plan.desc)}</p>
            <a href="#contact" class="sim-btn-tier-cta" style="${isFeatured ? `background-color: ${accentColor}; color: #ffffff; text-decoration: none; text-align: center;` : `border-color: ${accentColor}; color: ${accentColor}; text-decoration: none; text-align: center;`}">
              Mulai Paket Ini
            </a>
          </div>`;
        }

        renderedBlocksHtml += `
        <!-- PRICING SECTION -->
        <section class="sim-block-pricing ${isDarkMode ? 'pricing-dark' : ''}" id="pricing">
          <div class="sim-section-header-wrap">
            <h2 class="sim-section-title" style="color: ${isDarkMode ? '#ffffff' : '#0f172a'};">${title}</h2>
            ${subtitle ? `<p class="sim-section-sub" style="color: ${isDarkMode ? '#94a3b8' : '#64748b'};">${subtitle}</p>` : ''}
            <div class="sim-billing-toggle-pill">
              <button class="toggle-btn active" onclick="setBilling(false)">Bulanan</button>
              <button class="toggle-btn" onclick="setBilling(true)">
                <span>Tahunan</span>
                <span class="disc-pill" style="background-color: ${accentColor};">-20%</span>
              </button>
            </div>
          </div>
          <div class="sim-pricing-cards-grid">
            ${tiersHtml}
          </div>
        </section>`;
        break;
      }

      case 'cta': {
        const title = escapeHtml(block.title || 'Siap Memulai Transformasi Digital Anda?');
        const subtitle = escapeHtml(block.subtitle || 'Konsultasikan arsitektur web modern Anda dengan tim engineer kami.');
        const btnText = escapeHtml(block.buttonText || 'Hubungi Kami Langsung');
        const btnUrl = block.buttonUrl || (template.category === 'business' ? 'https://wa.me/?text=Halo%20Admin' : '#');

        renderedBlocksHtml += `
        <!-- CTA SECTION -->
        <section class="sim-block-cta" id="contact" style="background: linear-gradient(135deg, #090d16 0%, ${accentColor} 100%);">
          <div class="sim-cta-content">
            <h2 class="sim-cta-title">${title}</h2>
            <p class="sim-cta-sub">${subtitle}</p>
            <div class="sim-cta-action-row">
              <a href="${btnUrl}" target="_blank" class="sim-btn-cta-action" style="text-decoration: none;">
                <span>💬 ${btnText}</span>
              </a>
            </div>
          </div>
        </section>`;
        break;
      }

      case 'footer': {
        const brand = escapeHtml(block.title || siteName);
        const copyright = escapeHtml(block.content || block.subtitle || `© 2026 ${siteName}. Seluruh Hak Cipta Dilindungi.`);

        renderedBlocksHtml += `
        <!-- FOOTER -->
        <footer class="sim-block-footer ${isDarkMode ? 'footer-dark' : ''}">
          <div class="sim-footer-inner">
            <div class="footer-left">
              <div class="footer-brand" style="color: ${accentColor};">
                ${brand}
              </div>
              <p style="color: ${isDarkMode ? '#94a3b8' : '#64748b'};">
                ${copyright}
              </p>
            </div>
            <div class="footer-right">
              <span class="edge-status-pill">
                <span class="edge-dot"></span> Traefik v3 Edge Router
              </span>
            </div>
          </div>
        </footer>`;
        break;
      }
    }
  }

  return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${siteName} | ${escapeHtml(template.title)}</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700;800&family=Syne:wght@600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --tpl-accent: ${accentColor};
            --primary: ${accentColor};
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: '${fontFamily}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: ${isDarkMode ? '#090d16' : '#ffffff'};
            color: ${isDarkMode ? '#f8fafc' : '#0f172a'};
            line-height: 1.6;
            min-height: 100vh;
            overflow-x: hidden;
        }

        /* 1. Navbar */
        .sim-block-navbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 28px;
            background: rgba(255, 255, 255, 0.94);
            backdrop-filter: blur(16px);
            border-bottom: 1px solid rgba(0, 0, 0, 0.06);
            position: sticky;
            top: 0;
            z-index: 50;
        }
        ${isDarkMode ? `
        .sim-block-navbar {
            background: rgba(15, 23, 42, 0.94);
            border-bottom-color: rgba(255, 255, 255, 0.08);
        }` : ''}
        .sim-brand-area {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .sim-brand-glyph {
            width: 34px;
            height: 34px;
            border-radius: 9px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.05rem;
            font-weight: 800;
        }
        .sim-brand-title {
            font-size: 1.15rem;
            font-weight: 800;
            letter-spacing: -0.02em;
        }
        .sim-nav-links-row {
            display: flex;
            align-items: center;
            gap: 22px;
        }
        .sim-nav-links-row a {
            color: #64748b;
            text-decoration: none;
            font-size: 0.88rem;
            font-weight: 600;
            transition: color 0.15s ease;
        }
        .sim-nav-links-row a:hover { color: ${accentColor}; }
        .sim-btn-nav-cta {
            padding: 8px 18px;
            border-radius: 8px;
            color: #ffffff;
            font-size: 0.82rem;
            font-weight: 700;
            border: none;
            cursor: pointer;
            transition: opacity 0.15s ease;
        }
        .sim-btn-nav-cta:hover { opacity: 0.9; }

        /* 2. Hero */
        .sim-block-hero {
            padding: 68px 24px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
        }
        .sim-hero-badge-pill {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 0.72rem;
            font-weight: 800;
            padding: 4px 14px;
            border-radius: 9999px;
            border: 1px solid;
            margin-bottom: 18px;
            letter-spacing: 0.04em;
            text-transform: uppercase;
        }
        .sim-hero-headline {
            font-size: 2.6rem;
            font-weight: 900;
            line-height: 1.2;
            max-width: 820px;
            margin: 0 0 18px;
            letter-spacing: -0.03em;
        }
        .sim-hero-subheadline {
            font-size: 1.08rem;
            max-width: 680px;
            margin: 0 0 32px;
            line-height: 1.6;
        }
        .sim-hero-btn-group {
            display: flex;
            align-items: center;
            gap: 14px;
            flex-wrap: wrap;
            justify-content: center;
        }
        .sim-btn-primary {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 26px;
            border-radius: 10px;
            color: #ffffff;
            font-size: 0.92rem;
            font-weight: 700;
            border: none;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.18);
        }
        .sim-btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 22px rgba(0, 0, 0, 0.25);
        }
        .sim-btn-secondary {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 12px 24px;
            border-radius: 10px;
            background: #ffffff;
            border: 1px solid #cbd5e1;
            color: #334155;
            font-size: 0.92rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .sim-btn-secondary:hover { background: #f8fafc; border-color: #94a3b8; }
        .sim-btn-secondary.btn-sec-dark {
            background: rgba(30, 41, 59, 0.8);
            border-color: rgba(255, 255, 255, 0.15);
            color: #f1f5f9;
        }

        /* Terminal strip */
        .sim-terminal-strip {
            width: 100%;
            max-width: 720px;
            margin-top: 40px;
            background: #0f172a;
            border: 1px solid #1e293b;
            border-radius: 14px;
            box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.08);
            overflow: hidden;
            text-align: left;
        }
        .terminal-strip-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 18px;
            background: #090d16;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .terminal-strip-dots { display: flex; align-items: center; gap: 6px; }
        .terminal-strip-dots span { width: 10px; height: 10px; border-radius: 50%; }
        .terminal-strip-dots .d-red { background: #ef4444; }
        .terminal-strip-dots .d-yellow { background: #f59e0b; }
        .terminal-strip-dots .d-green { background: #10b981; }
        .terminal-strip-title { font-family: monospace; font-size: 0.74rem; color: #94a3b8; }
        .terminal-strip-badge { font-size: 0.65rem; font-weight: 700; color: #10b981; background: rgba(16, 185, 129, 0.15); padding: 2px 8px; border-radius: 4px; }
        .terminal-strip-content { padding: 18px 22px; font-family: monospace; font-size: 0.82rem; line-height: 1.6; }
        .t-line { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
        .t-prefix { color: #38bdf8; font-weight: 700; }
        .t-command { color: #f8fafc; }
        .t-response { color: #cbd5e1; }
        .t-indent { padding-left: 18px; }
        .t-key { color: #94a3b8; }
        .t-green { color: #34d399; font-weight: 600; }
        .t-cyan { color: #38bdf8; }
        .t-blue { color: #818cf8; }
        .t-yellow { color: #fbbf24; }

        /* 3. Stats */
        .sim-block-stats {
            padding: 28px 24px;
            background: #f8fafc;
            border-top: 1px solid rgba(0, 0, 0, 0.05);
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }
        .sim-block-stats.stats-dark {
            background: #0f172a;
            border-top-color: rgba(255, 255, 255, 0.08);
            border-bottom-color: rgba(255, 255, 255, 0.08);
        }
        .sim-stats-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            gap: 20px;
            max-width: 980px;
            margin: 0 auto;
            text-align: center;
        }
        .sim-stat-box { display: flex; flex-direction: column; gap: 4px; }
        .sim-stat-value { font-size: 1.8rem; font-weight: 900; line-height: 1.2; }
        .sim-stat-desc { font-size: 0.8rem; font-weight: 600; }

        /* 4. Features & Section Header */
        .sim-block-features { padding: 60px 24px; }
        .sim-section-header-wrap { text-align: center; max-width: 680px; margin: 0 auto 40px; }
        .sim-section-sub-badge { font-size: 0.74rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; display: block; margin-bottom: 8px; }
        .sim-section-title { font-size: 1.8rem; font-weight: 800; margin: 0 0 10px; line-height: 1.3; }
        .sim-section-sub { font-size: 0.95rem; margin: 0; line-height: 1.6; }
        .sim-features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; max-width: 1080px; margin: 0 auto; }
        .sim-feature-card-item {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 14px;
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            transition: all 0.2s ease;
        }
        .sim-feature-card-item:hover { transform: translateY(-3px); border-color: #cbd5e1; box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06); }
        .sim-feature-card-item.card-dark { background: #0f172a; border-color: rgba(255, 255, 255, 0.08); }
        .sim-feature-icon-box { width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }
        .sim-feature-card-item strong { font-size: 1.02rem; }
        .sim-feature-card-item p { font-size: 0.88rem; margin: 0; line-height: 1.5; }

        /* 5. Showcase */
        .sim-block-showcase { padding: 60px 24px; background: #f8fafc; }
        .sim-block-showcase.showcase-dark { background: #090d16; }
        .sim-showcase-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; max-width: 1080px; margin: 0 auto; }
        .sim-showcase-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 14px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
            display: flex;
            flex-direction: column;
            transition: all 0.2s ease;
        }
        .sim-showcase-card:hover { transform: translateY(-4px); box-shadow: 0 14px 30px rgba(15, 23, 42, 0.08); }
        .sim-showcase-card.card-dark { background: #0f172a; border-color: rgba(255, 255, 255, 0.08); }
        .sim-showcase-preview-banner { height: 140px; display: flex; align-items: center; justify-content: center; }
        .showcase-thumb-content { display: flex; flex-direction: column; align-items: center; gap: 6px; color: #ffffff; font-size: 0.78rem; font-weight: 700; }
        .sim-showcase-body { padding: 20px; display: flex; flex-direction: column; gap: 10px; flex: 1; }
        .showcase-tag-pill { font-size: 0.7rem; font-weight: 800; padding: 3px 10px; border-radius: 6px; width: fit-content; }
        .sim-showcase-body strong { font-size: 1.05rem; }
        .sim-showcase-body p { font-size: 0.88rem; margin: 0; line-height: 1.5; flex: 1; }
        .sim-btn-text-link { font-size: 0.85rem; font-weight: 700; margin-top: 6px; }

        /* 6. Cards (Products & Editorial) */
        .sim-block-cards-section { padding: 60px 24px; }
        .sim-cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 22px; max-width: 1080px; margin: 0 auto; }
        .sim-rich-content-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 14px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
            display: flex;
            flex-direction: column;
            transition: all 0.2s ease;
        }
        .sim-rich-content-card:hover { transform: translateY(-4px); box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08); }
        .sim-rich-content-card.card-dark { background: #0f172a; border-color: rgba(255, 255, 255, 0.08); }
        .card-thumb-canvas { height: 120px; position: relative; padding: 12px; display: flex; align-items: flex-start; justify-content: flex-end; }
        .card-price-badge { font-size: 0.8rem; font-weight: 800; color: #ffffff; padding: 4px 10px; border-radius: 6px; }
        .card-cat-badge { font-size: 0.7rem; font-weight: 800; background: rgba(15, 23, 42, 0.65); color: #ffffff; padding: 4px 10px; border-radius: 6px; }
        .card-inner-body { padding: 20px; display: flex; flex-direction: column; gap: 10px; flex: 1; }
        .card-inner-body strong { font-size: 1.02rem; }
        .card-inner-body p { font-size: 0.85rem; margin: 0; line-height: 1.5; flex: 1; }
        .sim-btn-card-action {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border: 1px solid;
            border-radius: 8px;
            padding: 9px 14px;
            font-size: 0.84rem;
            font-weight: 700;
            cursor: pointer;
            margin-top: 8px;
            transition: all 0.15s ease;
        }
        .sim-btn-card-action:hover { opacity: 0.9; transform: translateY(-1px); }

        /* 7. Listgroup */
        .sim-block-listgroup { padding: 50px 24px; background: #f8fafc; }
        .sim-block-listgroup.listgroup-dark { background: #090d16; }
        .sim-listgroup-stack { max-width: 780px; margin: 0 auto; display: flex; flex-direction: column; gap: 12px; }
        .sim-listgroup-row {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 14px 18px;
            display: flex;
            align-items: center;
            gap: 16px;
            cursor: pointer;
            transition: all 0.15s ease;
        }
        .sim-listgroup-row:hover { transform: translateX(4px); border-color: #cbd5e1; }
        .sim-listgroup-row.row-dark { background: #0f172a; border-color: rgba(255, 255, 255, 0.08); }
        .listgroup-rank { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.8rem; flex-shrink: 0; }
        .listgroup-text { display: flex; flex-direction: column; gap: 2px; flex: 1; }
        .listgroup-text strong { font-size: 0.95rem; }
        .listgroup-text span { font-size: 0.8rem; }
        .listgroup-arrow { color: #94a3b8; font-size: 1.3rem; }

        /* 8. Accordion */
        .sim-block-accordion { padding: 60px 24px; }
        .sim-accordion-stack { max-width: 780px; margin: 0 auto; display: flex; flex-direction: column; gap: 12px; }
        .sim-accordion-item {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            overflow: hidden;
            transition: all 0.2s ease;
        }
        .sim-accordion-item.item-dark { background: #0f172a; border-color: rgba(255, 255, 255, 0.08); }
        .sim-accordion-item.open { border-color: #cbd5e1; }
        .sim-accordion-header {
            width: 100%;
            padding: 16px 20px;
            background: transparent;
            border: none;
            display: flex;
            align-items: center;
            justify-content: space-between;
            text-align: left;
            font-size: 0.95rem;
            font-weight: 700;
            cursor: pointer;
        }
        .sim-acc-arrow { transition: transform 0.2s ease; color: #94a3b8; }
        .sim-acc-arrow.rotated { transform: rotate(180deg); }
        .sim-accordion-body { padding: 0 20px 16px; font-size: 0.88rem; line-height: 1.55; }

        /* 9. Pricing */
        .sim-block-pricing { padding: 60px 24px; background: #f8fafc; }
        .sim-block-pricing.pricing-dark { background: #090d16; }
        .sim-billing-toggle-pill {
            display: inline-flex;
            align-items: center;
            background: #e2e8f0;
            border-radius: 9999px;
            padding: 4px;
            margin-top: 18px;
            gap: 4px;
        }
        .sim-billing-toggle-pill button {
            background: transparent;
            border: none;
            border-radius: 9999px;
            padding: 6px 16px;
            font-size: 0.82rem;
            font-weight: 600;
            color: #64748b;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 4px;
        }
        .sim-billing-toggle-pill button.active {
            background: #ffffff;
            color: #0f172a;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
        }
        .disc-pill { font-size: 0.68rem; color: #ffffff; padding: 2px 6px; border-radius: 9999px; font-weight: 700; }
        .sim-pricing-cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px; max-width: 900px; margin: 0 auto; }
        .sim-pricing-tier-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 28px;
            display: flex;
            flex-direction: column;
            position: relative;
        }
        .sim-pricing-tier-card.card-dark { background: #0f172a; border-color: rgba(255, 255, 255, 0.08); }
        .sim-pricing-tier-card.featured { border-width: 2px; box-shadow: 0 10px 30px rgba(37, 99, 235, 0.12); }
        .tier-popular-tag { position: absolute; top: -11px; left: 50%; transform: translateX(-50%); color: #ffffff; font-size: 0.68rem; font-weight: 800; padding: 4px 12px; border-radius: 9999px; text-transform: uppercase; }
        .tier-name { font-size: 1.2rem; margin-bottom: 8px; }
        .tier-price-row { display: flex; align-items: baseline; gap: 4px; margin-bottom: 12px; }
        .tier-price { font-size: 1.8rem; font-weight: 900; }
        .tier-period { font-size: 0.82rem; color: #94a3b8; }
        .tier-desc { font-size: 0.85rem; margin: 0 0 24px; line-height: 1.5; }
        .sim-btn-tier-cta {
            width: 100%;
            padding: 11px;
            border-radius: 8px;
            font-size: 0.88rem;
            font-weight: 700;
            border: 1px solid;
            background: transparent;
            cursor: pointer;
            margin-top: auto;
            transition: all 0.18s ease;
        }

        /* 10. CTA */
        .sim-block-cta { padding: 56px 24px; text-align: center; color: #ffffff; }
        .sim-cta-content { max-width: 680px; margin: 0 auto; }
        .sim-cta-title { font-size: 1.8rem; font-weight: 800; margin: 0 0 10px; line-height: 1.3; }
        .sim-cta-sub { font-size: 0.95rem; opacity: 0.92; margin: 0 0 28px; line-height: 1.6; }
        .sim-cta-action-row { display: flex; justify-content: center; }
        .sim-btn-cta-action {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #ffffff;
            color: #0f172a;
            border: none;
            border-radius: 10px;
            padding: 12px 26px;
            font-size: 0.92rem;
            font-weight: 700;
            cursor: pointer;
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
            transition: transform 0.15s ease;
        }
        .sim-btn-cta-action:hover { transform: translateY(-2px); }

        /* 11. Footer */
        .sim-block-footer { padding: 28px 24px; border-top: 1px solid rgba(0, 0, 0, 0.06); background: #ffffff; }
        .sim-block-footer.footer-dark { background: #090d16; border-top-color: rgba(255, 255, 255, 0.08); }
        .sim-footer-inner { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px; max-width: 1080px; margin: 0 auto; }
        .footer-brand { font-weight: 800; font-size: 1.05rem; }
        .footer-left p { font-size: 0.8rem; margin: 4px 0 0; }
        .edge-status-pill { display: inline-flex; align-items: center; gap: 6px; font-size: 0.74rem; color: #64748b; font-weight: 600; font-family: monospace; }
        .edge-dot { width: 7px; height: 7px; border-radius: 50%; background: #10b981; }

        /* Floating Pod Badge */
        .pod-floating-badge {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(15, 23, 42, 0.92);
            backdrop-filter: blur(14px);
            border: 1px solid rgba(16, 185, 129, 0.45);
            border-radius: 9999px;
            padding: 8px 16px;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.78rem;
            color: #10b981;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
            z-index: 999;
            font-weight: 600;
        }
        .pod-dot { width: 8px; height: 8px; border-radius: 50%; background: #10b981; animation: pulse 2s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.85); } }
    </style>
</head>
<body>
    ${renderedBlocksHtml}

    <div class="pod-floating-badge">
        <span class="pod-dot"></span>
        <span>Pod Kontainer Aktif (${subdomain})</span>
    </div>

    <script>
        function toggleAcc(el) {
            const body = el.querySelector('.sim-accordion-body');
            const arrow = el.querySelector('.sim-acc-arrow');
            const isOpen = el.classList.contains('open');
            if (isOpen) {
                el.classList.remove('open');
                body.style.display = 'none';
                arrow.classList.remove('rotated');
            } else {
                el.classList.add('open');
                body.style.display = 'block';
                arrow.classList.add('rotated');
            }
        }

        function setBilling(isAnnual) {
            const container = document.querySelector('.sim-block-pricing');
            if (!container) return;
            const buttons = container.querySelectorAll('.toggle-btn');
            buttons[0].classList.toggle('active', !isAnnual);
            buttons[1].classList.toggle('active', isAnnual);
            const prices = container.querySelectorAll('.tier-price');
            const period = container.querySelectorAll('.tier-period');
            prices.forEach((el, idx) => {
                el.innerText = isAnnual ? el.getAttribute('data-annual') : el.getAttribute('data-monthly');
            });
            period.forEach(el => {
                el.innerText = isAnnual ? '/ thn' : '/ bln';
            });
        }
    </script>
</body>
</html>`;
}

export function compileMultiPageSiteToHTML(
  template: OfficialTemplateItem,
  options: CompileTemplateOptions & { pages?: MultiPageItem[] } = {}
): Record<string, string> {
  const pages = options.pages || (template.pages as MultiPageItem[]) || [];
  if (!pages || pages.length === 0) {
    return {
      'index.html': compileTemplateToHTML(template, options)
    };
  }

  const result: Record<string, string> = {};
  for (const page of pages) {
    const filename = page.path === '/' ? 'index.html' : `${page.path.replace(/^\//, '')}.html`;
    result[filename] = compileTemplateToHTML(template, {
      ...options,
      roleOrHeadline: page.title,
      bioIntro: page.description,
      blocksOverride: page.blocks
    });
  }
  return result;
}

