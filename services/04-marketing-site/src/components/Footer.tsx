import React, { useState } from 'react';
import { Layers, ArrowRight, Github, Twitter, Linkedin, MessageSquare, Check, Sparkles, Send, Terminal } from 'lucide-react';
import { MotionReveal } from './MotionReveal';
import { appConfig } from '../config';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail('');
    }
  };

  return (
    <footer style={{
      background: '#ffffff',
      borderTop: '1px solid var(--border-subtle)',
      position: 'relative',
      zIndex: 2,
      overflow: 'hidden'
    }}>
      {/* 1. Pre-Footer Action Banner (High-Impact Enterprise Card) */}
      <div className="container" style={{ paddingTop: '80px', paddingBottom: '64px' }}>
        <MotionReveal direction="up" distance={30}>
          <div style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)',
            borderRadius: 'var(--radius-xl)',
            padding: 'clamp(36px, 5vw, 64px)',
            color: '#ffffff',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
          {/* Subtle Ambient Decorative Light */}
          <div style={{
            position: 'absolute',
            top: '-120px',
            right: '-120px',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(37, 99, 235, 0.35) 0%, transparent 70%)',
            filter: 'blur(50px)',
            pointerEvents: 'none'
          }} />

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1
          }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#93c5fd',
                marginBottom: '16px'
              }}>
                <Sparkles size={14} /> Solusi DevSecOps & CMS Otonom
              </div>
              <h2 style={{
                fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
                color: '#ffffff',
                marginBottom: '14px',
                lineHeight: 1.2,
                letterSpacing: '-0.025em'
              }}>
                Siap Menjadi Pahlawan bagi Portofolio & Publikasi Anda?
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '1.02rem', lineHeight: 1.6, maxWidth: '520px' }}>
                Mulai gratis hari ini. Ciptakan kontainer Docker mandiri pertama Anda dalam waktu kurang dari 4.5 detik tanpa perlu repot konfigurasi server.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', width: '100%' }}>
                <a
                  href="#demo"
                  className="btn btn-blue"
                  style={{
                    padding: '14px 28px',
                    fontSize: '0.98rem',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-md)',
                    boxShadow: '0 4px 16px rgba(37, 99, 235, 0.4)'
                  }}
                >
                  Coba Demo Hero CMS <ArrowRight size={17} />
                </a>
                <a
                  href={appConfig.studioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary"
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#ffffff',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    padding: '14px 24px',
                    fontSize: '0.98rem'
                  }}
                >
                  <Terminal size={17} /> Buka Studio CMS
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#94a3b8', fontSize: '0.8rem', marginTop: '6px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={14} color="#4ade80" /> Tanpa kartu kredit</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={14} color="#4ade80" /> Subdomain & SSL gratis</span>
              </div>
            </div>
          </div>
        </div>
      </MotionReveal>
    </div>

      {/* 2. Main Navigation Links & Newsletter Subscription */}
      <div className="container" style={{ paddingBottom: '56px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          paddingBottom: '48px',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          {/* Brand & Newsletter Column */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: '#0f172a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <Layers size={18} color="#ffffff" />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em' }}>
                Hero<span style={{ color: 'var(--brand-blue)' }}>CMS</span>
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
              Platform CMS multi-tenant generasi baru berbasis orkestrasi kontainer Docker otonom dan AI Copilot.
            </p>

            {/* Newsletter Input */}
            <div style={{ marginTop: '8px' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-headline)', marginBottom: '8px' }}>
                Dapatkan Update Rilis & Fitur Baru
              </div>
              <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="email"
                  placeholder="Masukkan email Anda..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    background: '#f8fafc',
                    fontSize: '0.85rem',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                >
                  {subscribed ? <Check size={16} color="#4ade80" /> : <Send size={15} />}
                </button>
              </form>
              {subscribed && (
                <div style={{ fontSize: '0.78rem', color: 'var(--brand-emerald)', marginTop: '6px' }}>
                  ✓ Terima kasih! Anda telah terdaftar.
                </div>
              )}
            </div>
          </div>

          {/* Column 2: 5 Programs */}
          <div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-headline)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>
              5 Program Utama
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <li><a href="#features" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.15s' }}>01. Admin Console (Laravel)</a></li>
              <li><a href={appConfig.studioUrl} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.15s' }}>02. Dashboard Studio (Vue 3)</a></li>
              <li><a href="#features" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.15s' }}>03. Orchestrator API (Golang)</a></li>
              <li><a href="#demo" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.15s' }}>04. Marketing Website (React)</a></li>
              <li><a href="#features" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.15s' }}>05. AI Agent Service (Golang)</a></li>
            </ul>
          </div>

          {/* Column 3: Solusi Vertikal */}
          <div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-headline)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>
              Solusi Vertikal
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <li><a href="#demo" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.15s' }}>Portofolio Software Engineer</a></li>
              <li><a href="#demo" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.15s' }}>Blog Editorial & Komunitas</a></li>
              <li><a href="#demo" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.15s' }}>Pusat Edukasi & Silabus</a></li>
              <li><a href="#demo" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.15s' }}>Showcase Produk Bisnis</a></li>
            </ul>
          </div>

          {/* Column 4: Sumber Daya & Arsitektur */}
          <div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-headline)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>
              Dokumentasi & DevOps
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <li><a href="#architecture" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.15s' }}>Spesifikasi Arsitektur</a></li>
              <li><a href="#architecture" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.15s' }}>Keamanan & Sandboxing</a></li>
              <li><a href="#pricing" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.15s' }}>Kalkulator Kapasitas</a></li>
              <li><a href="#faq" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.15s' }}>Tanya Jawab (FAQ)</a></li>
            </ul>
          </div>
        </div>

        {/* 3. Tech Stack Pills & Social Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          padding: '24px 0',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          {/* Tech Stack Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, marginRight: '4px' }}>
              POWERED BY:
            </span>
            {['Docker Engine', 'Golang 1.23', 'Traefik v3', 'Vue 3', 'React + TS', 'PostgreSQL RLS', 'Redis 7'].map((tech) => (
              <span
                key={tech}
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-headline)',
                  background: '#f1f5f9',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 600,
                  border: '1px solid var(--border-subtle)'
                }}
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Social Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: '#f8fafc',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-headline)',
                textDecoration: 'none',
                transition: 'all 0.15s ease'
              }}
              title="GitHub"
            >
              <Github size={18} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: '#f8fafc',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-headline)',
                textDecoration: 'none',
                transition: 'all 0.15s ease'
              }}
              title="Twitter / X"
            >
              <Twitter size={18} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: '#f8fafc',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-headline)',
                textDecoration: 'none',
                transition: 'all 0.15s ease'
              }}
              title="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="#faq"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: '#f8fafc',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-headline)',
                textDecoration: 'none',
                transition: 'all 0.15s ease'
              }}
              title="Komunitas"
            >
              <MessageSquare size={18} />
            </a>
          </div>
        </div>

        {/* 4. Bottom Legal & SLA Uptime Badge */}
        <div style={{
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '0.84rem',
          color: 'var(--text-secondary)'
        }}>
          <div>
            © 2026 <strong>HeroCMS</strong>. Platform CMS Otonom Skala Enterprise. Hak Cipta Dilindungi.
          </div>
        </div>
      </div>
    </footer>
  );
};
