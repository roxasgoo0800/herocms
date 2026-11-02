import type { OfficialTemplateItem } from '../data/templates-data';
import type { VisualBlock, MultiPageItem } from '../types/dashboard';

export interface CompileTemplateOptions {
  siteName?: string;
  subdomain?: string;
  accentColor?: string;
  fontFamily?: string;
  roleOrHeadline?: string;
  bioIntro?: string;
  isDarkMode?: boolean;
  blocksOverride?: VisualBlock[];
  activeRoutePath?: string;
  sitemapPages?: Array<{ id: string; title: string; path: string }>;
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

export function renderIconSvg(iconName?: string, size = 20, color = 'currentColor'): string {
  const norm = (iconName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const s = size;
  const c = color;
  const stroke = `width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`;

  switch (norm) {
    case 'server':
      return `<svg ${stroke}><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>`;
    case 'cloud':
      return `<svg ${stroke}><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>`;
    case 'database':
      return `<svg ${stroke}><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>`;
    case 'cpu':
      return `<svg ${stroke}><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>`;
    case 'harddrive':
      return `<svg ${stroke}><line x1="22" x2="2" y1="12" y2="12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" x2="6.01" y1="16" y2="16"/><line x1="10" x2="10.01" y1="16" y2="16"/></svg>`;
    case 'terminal':
      return `<svg ${stroke}><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>`;
    case 'code2':
    case 'code':
      return `<svg ${stroke}><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>`;
    case 'box':
      return `<svg ${stroke}><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`;
    case 'shieldcheck':
      return `<svg ${stroke}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>`;
    case 'shield':
      return `<svg ${stroke}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>`;
    case 'lock':
      return `<svg ${stroke}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;
    case 'key':
      return `<svg ${stroke}><path d="m21 2-2 2m-1.5 1.5L13 10m-3.5 3.5a5 5 0 1 1-7-7 5 5 0 0 1 7 7Z"/><circle cx="7.5" cy="7.5" r=".5" fill="${c}"/></svg>`;
    case 'globe':
      return `<svg ${stroke}><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`;
    case 'trendingup':
      return `<svg ${stroke}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`;
    case 'zap':
      return `<svg ${stroke}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
    case 'activity':
      return `<svg ${stroke}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`;
    case 'rocket':
      return `<svg ${stroke}><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg>`;
    case 'check':
      return `<svg ${stroke}><polyline points="20 6 9 17 4 12"/></svg>`;
    case 'sparkles':
      return `<svg ${stroke}><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>`;
    case 'layers':
      return `<svg ${stroke}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`;
    case 'award':
      return `<svg ${stroke}><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`;
    case 'star':
      return `<svg ${stroke}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
    case 'sliders':
      return `<svg ${stroke}><line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/><line x1="1" x2="7" y1="14" y2="14"/><line x1="9" x2="15" y1="8" y2="8"/><line x1="17" x2="23" y1="16" y2="16"/></svg>`;
    case 'mail':
      return `<svg ${stroke}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`;
    case 'workflow':
      return `<svg ${stroke}><rect width="8" height="8" x="3" y="3" rx="2"/><path d="M7 11v4a2 2 0 0 0 2 2h4"/><rect width="8" height="8" x="13" y="13" rx="2"/></svg>`;
    case 'phone':
      return `<svg ${stroke}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`;
    case 'mappin':
    case 'map-pin':
      return `<svg ${stroke}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
    case 'clock':
      return `<svg ${stroke}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
    case 'calendar':
      return `<svg ${stroke}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`;
    case 'user':
      return `<svg ${stroke}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
    case 'users':
      return `<svg ${stroke}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
    case 'filetext':
    case 'file-text':
      return `<svg ${stroke}><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>`;
    case 'layout':
      return `<svg ${stroke}><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>`;
    case 'tag':
      return `<svg ${stroke}><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><circle cx="7" cy="7" r=".5" fill="${c}"/></svg>`;
    case 'headphones':
      return `<svg ${stroke}><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg>`;
    case 'heart':
      return `<svg ${stroke}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`;
    case 'compass':
      return `<svg ${stroke}><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`;
    case 'messagesquare':
    case 'message-square':
      return `<svg ${stroke}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
    case 'checkcircle':
    case 'check-circle':
      return `<svg ${stroke}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
    default:
      return `<svg ${stroke}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
  }
}


export function getBtnInlineStyle(
  styles?: VisualBlock['styles'],
  isSecondary = false,
  defaultAccent = '#2563eb'
): string {
  if (isSecondary) {
    const bg = styles?.secondaryButtonColor || 'transparent';
    const text = styles?.secondaryButtonTextColor || (bg === 'transparent' ? '#0f172a' : '#ffffff');
    const rad = styles?.secondaryButtonRadius !== undefined ? `${styles.secondaryButtonRadius}px` : '8px';
    const btnStyle = styles?.secondaryButtonStyle || 'outline';
    let extra = '';
    if (btnStyle === 'outline') {
      extra = `border: 2px solid ${defaultAccent};`;
    } else if (btnStyle === 'glow') {
      extra = `box-shadow: 0 0 16px ${defaultAccent}55; border: none;`;
    } else if (btnStyle === 'pill') {
      extra = 'border-radius: 9999px;';
    }
    return `background-color: ${bg}; color: ${text}; border-radius: ${rad}; ${extra} text-decoration: none; display: inline-flex; align-items: center; justify-content: center; gap: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; padding: 10px 22px; font-size: 0.95rem;`;
  } else {
    const bg = styles?.buttonColor || styles?.accentColor || defaultAccent;
    const text = styles?.buttonTextColor || '#ffffff';
    const rad = styles?.buttonRadius !== undefined ? `${styles.buttonRadius}px` : '8px';
    const btnStyle = styles?.buttonStyle || 'solid';
    let extra = '';
    if (btnStyle === 'outline') {
      extra = `border: 2px solid ${bg}; background-color: transparent !important; color: ${bg} !important;`;
    } else if (btnStyle === 'glow') {
      extra = `box-shadow: 0 0 20px ${bg}66; border: none;`;
    } else if (btnStyle === 'pill') {
      extra = 'border-radius: 9999px;';
    }
    return `background-color: ${bg}; color: ${text}; border-radius: ${rad}; ${extra} text-decoration: none; display: inline-flex; align-items: center; justify-content: center; gap: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; padding: 10px 22px; font-size: 0.95rem;`;
  }
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
  const fontFamily = options.fontFamily || template.fontFamily || 'Plus Jakarta Sans';
  const isDarkMode = options.isDarkMode || false;
  const blocks: VisualBlock[] = options.blocksOverride && options.blocksOverride.length > 0
    ? options.blocksOverride
    : template.blocks || [];

  let renderedBlocksHtml = '';

  for (let idx = 0; idx < blocks.length; idx++) {
    const block = blocks[idx];
    if (block.isVisible === false) continue;

    switch (block.type as string) {
      case 'navbar': {
        const glyph = block.styles?.brandGlyph || (template.category === 'portfolio' ? 'R' : siteName.slice(0, 1) || 'H');
        const brandTitle = escapeHtml(block.title || siteName);
        const buttonText = block.buttonText ? escapeHtml(block.buttonText) : '';
        const buttonUrl = block.buttonUrl || '#contact';
        const isSticky = block.styles?.isSticky !== false;
        const navStyle = block.styles?.navStyle || 'glass';
        const navAlign = block.styles?.navAlign || 'split';

        let navLinks = '';
        const navItemsToRender = (options.sitemapPages && options.sitemapPages.length > 0)
          ? options.sitemapPages.map(sp => ({
              title: sp.title,
              url: sp.path,
              active: sp.path === (options.activeRoutePath || '/')
            }))
          : (block.items && block.items.length > 0)
          ? block.items.map((item, i) => ({
              title: item.title,
              url: item.url || '#',
              active: options.activeRoutePath ? item.url === options.activeRoutePath : (item.active || (i === 0 && !options.activeRoutePath))
            }))
          : null;

        if (navItemsToRender && navItemsToRender.length > 0) {
          navLinks = navItemsToRender
            .map(item => {
              const activeClass = item.active ? ' class="active"' : '';
              return `<a href="${escapeHtml(item.url)}"${activeClass}>${escapeHtml(item.title)}</a>`;
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
          block.styles?.bgColor
            ? `background: ${block.styles.bgColor} !important;`
            : navStyle === 'solid'
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
        const navFont = block.styles?.fontFamily ? `font-family: '${block.styles.fontFamily}', sans-serif !important;` : '';
        const navTextColor = block.styles?.textColor || (isDarkMode ? '#ffffff' : '#0f172a');

        const glyphBg = block.styles?.buttonColor || block.styles?.accentColor || accentColor;
        const navBtnStyle = getBtnInlineStyle(block.styles, false, glyphBg);

        renderedBlocksHtml += `
        <!-- NAVBAR -->
        <header class="sim-block-navbar${alignClass}" style="${stickyStyle} ${bgStyle} ${navFont}">
          <div class="sim-brand-area">
            <span class="sim-brand-glyph" style="background-color: ${glyphBg}; color: #ffffff;">
              ${glyph}
            </span>
            <span class="sim-brand-title" style="color: ${navTextColor}; ${navFont}">
              ${brandTitle}
            </span>
          </div>
          <nav class="sim-nav-links-row">
            ${navLinks}
          </nav>
          <div class="sim-nav-actions">
            ${buttonText ? `<a href="${escapeHtml(buttonUrl)}" class="sim-btn-nav-cta" style="${navBtnStyle}">${buttonText}</a>` : ''}
          </div>
        </header>`;
        break;
      }

      case 'hero': {
        const heroAccent = block.styles?.accentColor || accentColor;
        const badge = block.badge ? escapeHtml(block.badge) : '';
        const headline = escapeHtml(block.title || roleHeadline);
        const btnPrimary = block.buttonText ? escapeHtml(block.buttonText) : 'Mulai Sekarang';
        const btnSecondary = block.secondaryButtonText ? escapeHtml(block.secondaryButtonText) : '';
        const targetUrl = block.buttonUrl || '#contact';
        const heroPrimaryStyle = getBtnInlineStyle(block.styles, false, heroAccent);
        const heroSecondaryStyle = getBtnInlineStyle(block.styles, true, heroAccent);

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

        const heroBg = block.styles?.bgColor ? `background: ${block.styles.bgColor} !important;` : '';
        const heroTextColor = block.styles?.textColor || (isDarkMode ? '#ffffff' : '#0f172a');
        const heroSubColor = block.styles?.textColor ? `${block.styles.textColor}cc` : (isDarkMode ? '#94a3b8' : '#475569');
        const heroFont = block.styles?.fontFamily ? `font-family: '${block.styles.fontFamily}', sans-serif !important;` : '';
        const heroPadding = block.styles?.paddingY !== undefined ? `padding: ${block.styles.paddingY}px 24px !important;` : '';
        const heroAlign = block.styles?.align ? `text-align: ${block.styles.align} !important;` : '';
        const fullSub = escapeHtml(block.subtitle || block.content || bioIntro);

        renderedBlocksHtml += `
        <!-- HERO SECTION -->
        <section class="sim-block-hero" id="hero" style="${heroBg} ${heroFont} ${heroPadding} ${heroAlign}">
          ${badge ? `
          <div class="sim-hero-badge-pill" style="background-color: ${heroAccent}18; color: ${heroAccent}; border-color: ${heroAccent}40;">
            <span>${badge}</span>
          </div>` : ''}
          <h1 class="sim-hero-headline" style="color: ${heroTextColor}; ${heroFont}">
            ${headline}
          </h1>
          <p class="sim-hero-subheadline" style="color: ${heroSubColor}; ${heroFont}">
            ${fullSub}
          </p>
          <div class="sim-hero-btn-group">
            <a href="${targetUrl}" class="sim-btn-primary" style="${heroPrimaryStyle}">
              <span>${btnPrimary}</span>
              <span style="font-size: 1.1em; line-height: 1;">&rarr;</span>
            </a>
            ${btnSecondary ? `
            <a href="#about" class="sim-btn-secondary ${isDarkMode ? 'btn-sec-dark' : ''}" style="${heroSecondaryStyle}">
              <span>${btnSecondary}</span>
            </a>` : ''}
          </div>
          ${terminalHtml}
        </section>`;
        break;
      }

      case 'stats': {
        const statBg = block.styles?.bgColor ? `background: ${block.styles.bgColor} !important;` : '';
        const statText = block.styles?.textColor ? `color: ${block.styles.textColor} !important;` : '';
        const statFont = block.styles?.fontFamily ? `font-family: '${block.styles.fontFamily}', sans-serif !important;` : '';
        const statPadding = block.styles?.paddingY !== undefined ? `padding: ${block.styles.paddingY}px 24px !important;` : '';
        const statAccent = block.styles?.accentColor || accentColor;

        const items = block.items || [];
        let itemsHtml = '';
        for (const item of items) {
          itemsHtml += `
          <div class="sim-stat-box">
            <span class="sim-stat-value" style="color: ${statAccent};">
              ${escapeHtml(item.title)}
            </span>
            <span class="sim-stat-desc" style="color: ${isDarkMode ? '#cbd5e1' : '#64748b'};">
              ${escapeHtml(item.desc)}
            </span>
          </div>`;
        }

        renderedBlocksHtml += `
        <!-- STATS SECTION -->
        <section class="sim-block-stats ${isDarkMode ? 'stats-dark' : ''}" id="stats" style="${statBg} ${statText} ${statFont} ${statPadding}">
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
        const featAccent = block.styles?.accentColor || accentColor;
        let featuresHtml = '';

        for (let fIdx = 0; fIdx < items.length; fIdx++) {
          const item = items[fIdx];
          const itemColor = item.buttonColor || featAccent;
          const iconMedia = item.image
            ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;" />`
            : renderIconSvg(item.icon, 22, itemColor);
          featuresHtml += `
          <div class="sim-feature-card-item ${isDarkMode ? 'card-dark' : ''}">
            <div class="sim-feature-icon-box" style="background-color: ${itemColor}18; color: ${itemColor};">
              ${iconMedia}
            </div>
            <strong style="color: ${isDarkMode ? '#f8fafc' : '#0f172a'};">${escapeHtml(item.title)}</strong>
            <p style="color: ${isDarkMode ? '#94a3b8' : '#64748b'};">${escapeHtml(item.desc)}</p>
          </div>`;
        }

        const featBg = block.styles?.bgColor ? `background: ${block.styles.bgColor} !important;` : '';
        const featText = block.styles?.textColor ? `color: ${block.styles.textColor} !important;` : '';
        const featFont = block.styles?.fontFamily ? `font-family: '${block.styles.fontFamily}', sans-serif !important;` : '';
        const featPadding = block.styles?.paddingY !== undefined ? `padding: ${block.styles.paddingY}px 24px !important;` : '';
        const featTitleColor = block.styles?.textColor || (isDarkMode ? '#ffffff' : '#0f172a');
        const featSubColor = block.styles?.textColor ? `${block.styles.textColor}cc` : (isDarkMode ? '#94a3b8' : '#64748b');

        renderedBlocksHtml += `
        <!-- FEATURES SECTION -->
        <section class="sim-block-features ${isDarkMode ? 'features-dark' : ''}" id="features" style="${featBg} ${featText} ${featFont} ${featPadding}">
          <div class="sim-section-header-wrap">
            ${badge ? `<span class="sim-section-sub-badge" style="color: ${featAccent};">${badge}</span>` : ''}
            <h2 class="sim-section-title" style="color: ${featTitleColor}; ${featFont}">${title}</h2>
            ${subtitle ? `<p class="sim-section-sub" style="color: ${featSubColor}; ${featFont}">${subtitle}</p>` : ''}
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
        const cardAccent = block.styles?.accentColor || accentColor;
        let cardsHtml = '';

        for (const item of items) {
          const itemAccent = item.buttonColor || cardAccent;
          const priceBadge = item.price ? `<span class="card-price-badge" style="background-color: ${itemAccent};">${escapeHtml(item.price)}</span>` : '';
          const catBadge = !item.price && item.tag ? `<span class="card-cat-badge">${escapeHtml(item.tag)}</span>` : '';
          const actionText = (item as any).buttonText || item.label ? escapeHtml((item as any).buttonText || item.label) : (item.price ? 'Pesan via WhatsApp &rarr;' : 'Baca Selengkapnya &rarr;');
          const actionLink = item.url || (item.price
            ? `https://wa.me/?text=Halo,%20saya%20tertarik%20dengan%20${encodeURIComponent(item.title)}`
            : '#');
          const cardImg = item.image;
          const thumbMedia = cardImg
            ? `<img src="${escapeHtml(cardImg)}" alt="${escapeHtml(item.title)}" style="width: 100%; height: 100%; object-fit: cover;" />`
            : (item.icon ? `<div style="display:flex;align-items:center;justify-content:center;height:100%;">${renderIconSvg(item.icon, 36, itemAccent)}</div>` : '');

          cardsHtml += `
          <div class="sim-rich-content-card ${isDarkMode ? 'card-dark' : ''}">
            <div class="card-thumb-canvas" style="background: linear-gradient(135deg, #1e293b 0%, ${itemAccent}40 100%); overflow: hidden; position: relative;">
              ${thumbMedia}
              ${priceBadge || catBadge}
            </div>
            <div class="card-inner-body">
              <strong style="color: ${isDarkMode ? '#ffffff' : '#0f172a'};">${escapeHtml(item.title)}</strong>
              <p style="color: ${isDarkMode ? '#94a3b8' : '#64748b'};">${escapeHtml(item.desc)}</p>
              <a href="${actionLink}" target="_blank" class="sim-btn-card-action" style="background-color: ${itemAccent}18; color: ${itemAccent}; border-color: ${itemAccent}40; text-decoration: none;">
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

      
      case 'carousel': {
        const title = escapeHtml(block.title || 'Galeri & Slider Interaktif');
        const items = block.items || [];
        let slidesHtml = '';
        for (let sIdx = 0; sIdx < items.length; sIdx++) {
          const item = items[sIdx];
          const itemImg = item.image || '';
          slidesHtml += `
          <div class="sim-carousel-slide ${sIdx === 0 ? 'active' : ''}" style="background: linear-gradient(135deg, #0f172a 0%, ${accentColor}33 100%); position: relative; border-radius: 12px; overflow: hidden; height: 260px; margin-bottom: 12px;">
            ${itemImg ? `<img src="${escapeHtml(itemImg)}" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.9;" />` : `<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:2rem;color:#ffffff;">${renderIconSvg(item.icon || 'star', 36, accentColor)}</div>`}
            <div class="sim-carousel-caption" style="position: absolute; bottom: 12px; left: 12px; right: 12px; background: rgba(15,23,42,0.85); backdrop-filter: blur(8px); padding: 10px 14px; border-radius: 8px;">
              <strong style="color: #ffffff; display: block; font-size: 0.95rem;">${escapeHtml(item.title)}</strong>
              <p style="color: #cbd5e1; margin: 4px 0 0 0; font-size: 0.82rem;">${escapeHtml(item.desc || '')}</p>
            </div>
          </div>`;
        }
        renderedBlocksHtml += `
        <section class="sim-block-carousel ${isDarkMode ? 'carousel-dark' : ''}" id="carousel" style="padding: 40px 24px; max-width: 900px; margin: 0 auto;">
          <div class="sim-section-header-wrap" style="text-align: center; margin-bottom: 24px;">
            <h2 class="sim-section-title" style="color: ${isDarkMode ? '#ffffff' : '#0f172a'};">${title}</h2>
          </div>
          <div class="sim-carousel-viewport">
            ${slidesHtml}
          </div>
        </section>`;
        break;
      }

      case 'progressbar': {
        const title = escapeHtml(block.title || 'Keahlian & Metrik Performa');
        const items = block.items || [];
        let barsHtml = '';
        for (const item of items) {
          const pct = Math.min(100, Math.max(0, item.percentage ?? 85));
          barsHtml += `
          <div class="sim-progress-item" style="margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <strong style="color: ${isDarkMode ? '#ffffff' : '#0f172a'}; font-size: 0.9rem;">${escapeHtml(item.title)}</strong>
              <span style="color: ${accentColor}; font-weight: 700; font-size: 0.9rem;">${pct}%</span>
            </div>
            <div style="background: ${isDarkMode ? '#334155' : '#e2e8f0'}; height: 8px; border-radius: 9999px; overflow: hidden;">
              <div style="background: ${accentColor}; height: 100%; width: ${pct}%; border-radius: 9999px; transition: width 0.5s ease;"></div>
            </div>
          </div>`;
        }
        renderedBlocksHtml += `
        <section class="sim-block-progressbar ${isDarkMode ? 'progressbar-dark' : ''}" id="progressbar" style="padding: 40px 24px; max-width: 720px; margin: 0 auto;">
          <div class="sim-section-header-wrap" style="text-align: center; margin-bottom: 24px;">
            <h2 class="sim-section-title" style="color: ${isDarkMode ? '#ffffff' : '#0f172a'};">${title}</h2>
          </div>
          <div>
            ${barsHtml}
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

      case 'contact': {
        const title = escapeHtml(block.title || 'Hubungi Kami');
        const subtitle = escapeHtml(block.subtitle || block.content || 'Kami siap membantu kebutuhan implementasi sistem & konsultasi infrastruktur digital Anda.');
        const badge = block.badge ? escapeHtml(block.badge) : 'KONTAK LANGSUNG';
        const btnText = escapeHtml(block.buttonText || 'Kirim Pesan');
        const cAccent = block.styles?.accentColor || accentColor;
        const cBg = block.styles?.bgColor ? `background: ${block.styles.bgColor} !important;` : (isDarkMode ? 'background: #090d16;' : 'background: #f8fafc;');
        const cText = block.styles?.textColor ? `color: ${block.styles.textColor} !important;` : '';
        const cFont = block.styles?.fontFamily ? `font-family: '${block.styles.fontFamily}', sans-serif !important;` : '';
        const cPadding = block.styles?.paddingY !== undefined ? `padding: ${block.styles.paddingY}px 24px !important;` : 'padding: 60px 24px;';
        const cTitleColor = block.styles?.textColor || (isDarkMode ? '#ffffff' : '#0f172a');
        const cSubColor = block.styles?.textColor ? `${block.styles.textColor}cc` : (isDarkMode ? '#94a3b8' : '#64748b');

        renderedBlocksHtml += `
        <!-- CONTACT SECTION -->
        <section class="sim-block-contact" id="contact" style="${cBg} ${cText} ${cFont} ${cPadding}">
          <div class="sim-section-header-wrap">
            ${badge ? `<span class="sim-section-sub-badge" style="color: ${cAccent};">${badge}</span>` : ''}
            <h2 class="sim-section-title" style="color: ${cTitleColor}; ${cFont}">${title}</h2>
            ${subtitle ? `<p class="sim-section-sub" style="color: ${cSubColor}; ${cFont}">${subtitle}</p>` : ''}
          </div>
          <div class="sim-contact-layout">
            <div class="sim-contact-info-card" style="border-color: ${cAccent}33; background: ${isDarkMode ? '#0f172a' : '#ffffff'};">
              <div class="sim-contact-info-header">
                <span class="sim-contact-pill" style="background: ${cAccent}15; color: ${cAccent};">Respons Cepat</span>
                <strong style="color: ${isDarkMode ? '#ffffff' : '#0f172a'}; font-size: 1.1rem; display: block; margin-top: 8px;">Koneksi Langsung Edge</strong>
                <p style="color: ${isDarkMode ? '#94a3b8' : '#64748b'}; font-size: 0.88rem; margin: 4px 0 0;">Infrastruktur kami siap 24/7 untuk melayani komunikasi dan kebutuhan sistem Anda.</p>
              </div>
              <div class="sim-contact-meta-list">
                <div class="sim-meta-item">
                  <span class="sim-meta-icon" style="color: ${cAccent};">${renderIconSvg('mail', 18, cAccent)}</span>
                  <div>
                    <span class="meta-label" style="color: #94a3b8; font-size: 0.75rem; display: block;">Email Resmi</span>
                    <strong style="color: ${isDarkMode ? '#ffffff' : '#0f172a'}; font-size: 0.9rem;">support@${subdomain}</strong>
                  </div>
                </div>
                <div class="sim-meta-item">
                  <span class="sim-meta-icon" style="color: ${cAccent};">${renderIconSvg('phone', 18, cAccent)}</span>
                  <div>
                    <span class="meta-label" style="color: #94a3b8; font-size: 0.75rem; display: block;">Saluran Siaga</span>
                    <strong style="color: ${isDarkMode ? '#ffffff' : '#0f172a'}; font-size: 0.9rem;">+62 (021) 8087-STACK</strong>
                  </div>
                </div>
                <div class="sim-meta-item">
                  <span class="sim-meta-icon" style="color: ${cAccent};">${renderIconSvg('shieldcheck', 18, cAccent)}</span>
                  <div>
                    <span class="meta-label" style="color: #94a3b8; font-size: 0.75rem; display: block;">Keamanan Ingress</span>
                    <strong style="color: ${isDarkMode ? '#ffffff' : '#0f172a'}; font-size: 0.9rem;">Traefik TLS 1.3 Terisolasi</strong>
                  </div>
                </div>
              </div>
            </div>
            <div class="sim-contact-form-card" style="background: ${isDarkMode ? '#0f172a' : '#ffffff'}; border-color: ${isDarkMode ? 'rgba(255,255,255,0.08)' : '#e2e8f0'};">
              <form onsubmit="event.preventDefault();" class="sim-form-grid">
                <div class="sim-form-field">
                  <label style="color: ${isDarkMode ? '#cbd5e1' : '#334155'}; font-size: 0.8rem; font-weight: 700;">Nama Lengkap</label>
                  <input type="text" placeholder="Nama Anda atau Perusahaan" class="sim-form-input" style="background: ${isDarkMode ? '#1e293b' : '#ffffff'}; color: ${isDarkMode ? '#ffffff' : '#0f172a'};" />
                </div>
                <div class="sim-form-field">
                  <label style="color: ${isDarkMode ? '#cbd5e1' : '#334155'}; font-size: 0.8rem; font-weight: 700;">Alamat Email</label>
                  <input type="email" placeholder="nama@perusahaan.com" class="sim-form-input" style="background: ${isDarkMode ? '#1e293b' : '#ffffff'}; color: ${isDarkMode ? '#ffffff' : '#0f172a'};" />
                </div>
                <div class="sim-form-field">
                  <label style="color: ${isDarkMode ? '#cbd5e1' : '#334155'}; font-size: 0.8rem; font-weight: 700;">Pesan atau Kebutuhan Solusi</label>
                  <textarea rows="3" placeholder="Ceritakan kebutuhan atau pertanyaan Anda..." class="sim-form-input" style="background: ${isDarkMode ? '#1e293b' : '#ffffff'}; color: ${isDarkMode ? '#ffffff' : '#0f172a'}; resize: vertical;"></textarea>
                </div>
                <button type="submit" class="sim-btn-contact-submit" style="background-color: ${cAccent}; color: #ffffff;">
                  ${btnText} &rarr;
                </button>
              </form>
            </div>
          </div>
        </section>`;
        break;
      }

      case 'testimonials': {
        const title = escapeHtml(block.title || 'Apa Kata Klien Kami');
        const subtitle = escapeHtml(block.subtitle || 'Kepercayaan dari berbagai pelaku industri dan profesional.');
        const badge = block.badge ? escapeHtml(block.badge) : 'TESTIMONIAL';
        const tAccent = block.styles?.accentColor || accentColor;
        const tBg = block.styles?.bgColor ? `background: ${block.styles.bgColor} !important;` : (isDarkMode ? 'background: #090d16;' : 'background: #ffffff;');
        const tText = block.styles?.textColor ? `color: ${block.styles.textColor} !important;` : '';
        const tFont = block.styles?.fontFamily ? `font-family: '${block.styles.fontFamily}', sans-serif !important;` : '';
        const tPadding = block.styles?.paddingY !== undefined ? `padding: ${block.styles.paddingY}px 24px !important;` : 'padding: 60px 24px;';
        const items = block.items || [];
        let itemsHtml = '';

        for (const item of items) {
          const author = escapeHtml(item.author || item.title || 'Pengguna Terverifikasi');
          const role = escapeHtml(item.role || item.tag || 'Client Partner');
          const quote = escapeHtml(item.desc || (item as any).content || 'Layanan yang sangat memuaskan dengan performa tinggi.');
          itemsHtml += `
          <div class="sim-testimonial-card ${isDarkMode ? 'card-dark' : ''}" style="border-top: 3px solid ${tAccent};">
            <div class="sim-stars-row" style="color: #f59e0b;">
              ★ ★ ★ ★ ★
            </div>
            <p class="sim-testi-quote" style="color: ${isDarkMode ? '#cbd5e1' : '#475569'};">"${quote}"</p>
            <div class="sim-testi-author-row">
              <div class="sim-author-avatar" style="background: ${tAccent}22; color: ${tAccent};">
                ${author.slice(0, 1).toUpperCase()}
              </div>
              <div>
                <strong style="color: ${isDarkMode ? '#ffffff' : '#0f172a'}; font-size: 0.95rem; display: block;">${author}</strong>
                <span style="color: #94a3b8; font-size: 0.8rem;">${role}</span>
              </div>
            </div>
          </div>`;
        }

        renderedBlocksHtml += `
        <!-- TESTIMONIALS SECTION -->
        <section class="sim-block-testimonials" id="testimonials" style="${tBg} ${tText} ${tFont} ${tPadding}">
          <div class="sim-section-header-wrap">
            ${badge ? `<span class="sim-section-sub-badge" style="color: ${tAccent};">${badge}</span>` : ''}
            <h2 class="sim-section-title" style="color: ${block.styles?.textColor || (isDarkMode ? '#ffffff' : '#0f172a')}; ${tFont}">${title}</h2>
            ${subtitle ? `<p class="sim-section-sub" style="color: ${isDarkMode ? '#94a3b8' : '#64748b'};">${subtitle}</p>` : ''}
          </div>
          <div class="sim-testimonials-grid">
            ${itemsHtml}
          </div>
        </section>`;
        break;
      }

      case 'bento':
      case 'services': {
        const title = escapeHtml(block.title || 'Layanan & Kapabilitas');
        const subtitle = escapeHtml(block.subtitle || 'Modul terintegrasi untuk akselerasi solusi digital.');
        const badge = block.badge ? escapeHtml(block.badge) : 'KAPABILITAS';
        const sAccent = block.styles?.accentColor || accentColor;
        const sBg = block.styles?.bgColor ? `background: ${block.styles.bgColor} !important;` : (isDarkMode ? 'background: #090d16;' : 'background: #f8fafc;');
        const sText = block.styles?.textColor ? `color: ${block.styles.textColor} !important;` : '';
        const sFont = block.styles?.fontFamily ? `font-family: '${block.styles.fontFamily}', sans-serif !important;` : '';
        const sPadding = block.styles?.paddingY !== undefined ? `padding: ${block.styles.paddingY}px 24px !important;` : 'padding: 60px 24px;';
        const items = block.items || [];
        let itemsHtml = '';

        for (const item of items) {
          const itemColor = item.buttonColor || sAccent;
          itemsHtml += `
          <div class="sim-feature-card-item ${isDarkMode ? 'card-dark' : ''}">
            <div class="sim-feature-icon-box" style="background-color: ${itemColor}18; color: ${itemColor};">
              ${renderIconSvg(item.icon, 22, itemColor)}
            </div>
            <strong style="color: ${isDarkMode ? '#f8fafc' : '#0f172a'};">${escapeHtml(item.title)}</strong>
            <p style="color: ${isDarkMode ? '#94a3b8' : '#64748b'};">${escapeHtml(item.desc || '')}</p>
          </div>`;
        }

        renderedBlocksHtml += `
        <!-- BENTO / SERVICES SECTION -->
        <section class="sim-block-features ${isDarkMode ? 'features-dark' : ''}" id="${block.type}" style="${sBg} ${sText} ${sFont} ${sPadding}">
          <div class="sim-section-header-wrap">
            ${badge ? `<span class="sim-section-sub-badge" style="color: ${sAccent};">${badge}</span>` : ''}
            <h2 class="sim-section-title" style="color: ${block.styles?.textColor || (isDarkMode ? '#ffffff' : '#0f172a')}; ${sFont}">${title}</h2>
            ${subtitle ? `<p class="sim-section-sub" style="color: ${isDarkMode ? '#94a3b8' : '#64748b'};">${subtitle}</p>` : ''}
          </div>
          <div class="sim-features-grid">
            ${itemsHtml}
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
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700;800&family=Syne:wght@600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --tpl-accent: ${accentColor};
            --primary: ${accentColor};
        }
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: inherit; }
        button, input, select, textarea, a { font-family: inherit; }
        html, body { font-family: '${fontFamily}', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        body {
            font-family: '${fontFamily}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: ${isDarkMode ? '#090d16' : '#ffffff'};
            color: ${isDarkMode ? '#f8fafc' : '#0f172a'};
            line-height: 1.6;
            min-height: 100vh;
            overflow-x: hidden;
        }

        /* Contact Section */
        .sim-block-contact { padding: 60px 24px; }
        .sim-contact-layout { display: grid; grid-template-columns: 1fr 1.3fr; gap: 32px; max-width: 980px; margin: 0 auto; }
        @media (max-width: 768px) { .sim-contact-layout { grid-template-columns: 1fr; } }
        .sim-contact-info-card { border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 28px; display: flex; flex-direction: column; gap: 20px; box-sizing: border-box; }
        .sim-contact-pill { font-size: 0.72rem; font-weight: 800; text-transform: uppercase; padding: 4px 10px; border-radius: 9999px; align-self: flex-start; }
        .sim-contact-meta-list { display: flex; flex-direction: column; gap: 16px; }
        .sim-meta-item { display: flex; align-items: center; gap: 12px; }
        .sim-meta-icon { width: 36px; height: 36px; border-radius: 8px; background: rgba(0,0,0,0.04); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .sim-contact-form-card { border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 28px; box-shadow: 0 4px 16px rgba(15, 23, 42, 0.05); box-sizing: border-box; }
        .sim-form-grid { display: flex; flex-direction: column; gap: 14px; }
        .sim-form-field { display: flex; flex-direction: column; gap: 6px; }
        .sim-form-input { padding: 10px 14px; border-radius: 8px; border: 1.5px solid #cbd5e1; font-size: 0.88rem; outline: none; transition: border-color 0.15s ease; box-sizing: border-box; width: 100%; }
        .sim-btn-contact-submit { padding: 12px 20px; border-radius: 8px; border: none; font-weight: 700; font-size: 0.95rem; cursor: pointer; transition: all 0.15s ease; }
        .sim-btn-contact-submit:hover { opacity: 0.92; transform: translateY(-1px); }

        /* Testimonials Section */
        .sim-block-testimonials { padding: 60px 24px; }
        .sim-testimonials-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; max-width: 1040px; margin: 0 auto; }
        .sim-testimonial-card { background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 24px; display: flex; flex-direction: column; gap: 14px; box-shadow: 0 4px 14px rgba(15, 23, 42, 0.04); box-sizing: border-box; }
        .sim-testimonial-card.card-dark { background: #0f172a; border-color: rgba(255, 255, 255, 0.08); }
        .sim-stars-row { font-size: 1rem; letter-spacing: 2px; }
        .sim-testi-quote { font-size: 0.92rem; line-height: 1.6; font-style: italic; margin: 0; flex: 1; }
        .sim-testi-author-row { display: flex; align-items: center; gap: 12px; margin-top: 8px; }
        .sim-author-avatar { width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.95rem; flex-shrink: 0; }

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
        .sim-nav-links-row a.active {
            color: ${accentColor};
            font-weight: 700;
        }
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
    </style>
</head>
<body>
    ${renderedBlocksHtml}

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

