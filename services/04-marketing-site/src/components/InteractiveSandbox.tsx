import React, { useState } from 'react';
import {
  Play,
  CheckCircle2,
  Cpu,
  RefreshCw,
  Lock,
  User,
  Briefcase,
  BookOpen,
  GraduationCap,
  FileText,
  Sparkles
} from 'lucide-react';
import { MotionReveal } from './MotionReveal';
import { motion } from 'framer-motion';

export const InteractiveSandbox: React.FC = () => {
  const [category, setCategory] = useState<'portfolio' | 'blog' | 'education'>('portfolio');
  const [name, setName] = useState<string>('Rizal Pratama');
  const [role, setRole] = useState<string>('Senior Cloud & Distributed Systems Engineer');
  const [featuredTitle, setFeaturedTitle] = useState<string>('High-Performance Container Orchestration with Go & Docker');
  const [isSimulatingDeploy, setIsSimulatingDeploy] = useState<boolean>(false);
  const [deploySuccess, setDeploySuccess] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'logs'>('preview');

  const handleSimulateDeploy = () => {
    setIsSimulatingDeploy(true);
    setDeploySuccess(false);
    setTimeout(() => {
      setIsSimulatingDeploy(false);
      setDeploySuccess(true);
    }, 1500);
  };

  const currentSlug = name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'demo';

  return (
    <section id="demo" className="section" style={{ background: '#f8fafc', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="container">
        {/* Section Header with Motion Reveal */}
        <MotionReveal direction="up" distance={30} style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--brand-blue)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Live Interactive Simulator
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', margin: '8px 0 16px' }}>
            Uji Coba Pengalaman Penerbitan Otonom
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto', fontSize: '1.05rem' }}>
            Ubah data dan kategori situs di sebelah kiri, lalu saksikan simulasi orkestrasi kontainer Docker dan perutean Traefik beraksi secara instan.
          </p>
        </MotionReveal>

        {/* 2-Column Interface: Control Studio vs Simulated Runtime (Equal Height Alignment) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '32px',
          alignItems: 'stretch' // Crucial: forces both cards to match height precisely
        }}>
          {/* Left: Studio Control Card */}
          <MotionReveal
            direction="up"
            delay={0.15}
            distance={35}
            style={{
              background: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xl)',
              padding: '32px',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%'
            }}
          >
            <div>
              {/* Card Header with Status Dot */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ background: '#eff6ff', color: 'var(--brand-blue)', padding: '7px', borderRadius: '8px', border: '1px solid #dbeafe' }}>
                    <Cpu size={19} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', color: 'var(--text-headline)', margin: 0 }}>Konfigurasi Situs & Kontainer</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      <span className="pulse-dot" style={{ width: '6px', height: '6px' }}></span>
                      <span>cgroups v2 engine connected</span>
                    </div>
                  </div>
                </div>
                <span style={{
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: 'var(--brand-blue)',
                  background: '#eff6ff',
                  border: '1px solid #dbeafe',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)'
                }}>
                  Mode Studio
                </span>
              </div>

              {/* Category Segmented Control with Icons */}
              <div style={{ marginBottom: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-headline)' }}>
                    Kategori Vertikal Website
                  </label>
                  <span className="modern-badge-pill" style={{ background: '#f1f5f9', color: 'var(--text-secondary)' }}>
                    3 Template
                  </span>
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  background: '#f1f5f9',
                  padding: '4px',
                  borderRadius: 'var(--radius-md)',
                  gap: '4px'
                }}>
                  {[
                    { id: 'portfolio', label: 'Portofolio', icon: <Briefcase size={14} /> },
                    { id: 'blog', label: 'Blog Media', icon: <BookOpen size={14} /> },
                    { id: 'education', label: 'Edukasi', icon: <GraduationCap size={14} /> }
                  ].map((cat) => {
                    const isSelected = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setCategory(cat.id as any);
                          if (cat.id === 'portfolio') {
                            setRole('Senior Cloud & Distributed Systems Engineer');
                            setFeaturedTitle('High-Performance Container Orchestration with Go & Docker');
                          } else if (cat.id === 'blog') {
                            setRole('Arsitek Perangkat Lunak & Penulis Teknologi');
                            setFeaturedTitle('Membangun Multi-Tenancy Aman Menggunakan PostgreSQL RLS');
                          } else {
                            setRole('Dosen & Peneliti Sistem Terdistribusi');
                            setFeaturedTitle('Silabus Algoritma Terdistribusi & Cloud Native 2026');
                          }
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          padding: '9px 10px',
                          borderRadius: 'var(--radius-sm)',
                          background: isSelected ? '#ffffff' : 'transparent',
                          color: isSelected ? 'var(--brand-blue)' : 'var(--text-secondary)',
                          boxShadow: isSelected ? '0 1px 3px rgba(0, 0, 0, 0.08)' : 'none',
                          border: isSelected ? '1px solid #e2e8f0' : '1px solid transparent',
                          cursor: 'pointer',
                          fontSize: '0.84rem',
                          fontWeight: isSelected ? 700 : 500,
                          transition: 'all 0.18s ease'
                        }}
                      >
                        {cat.icon}
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Modern Input 1: Name */}
              <div style={{ marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-headline)' }}>
                    Nama Pemilik / Judul Institusi
                  </label>
                  <span className="modern-badge-pill" style={{ background: '#ecfdf5', color: '#059669' }}>
                    Sync Otomatis
                  </span>
                </div>
                <div className="modern-input-group">
                  <span className="modern-input-icon">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Rizal Pratama"
                    className="modern-input-field"
                  />
                </div>
              </div>

              {/* Modern Input 2: Role / Tagline */}
              <div style={{ marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-headline)' }}>
                    Deskripsi Jabatan / Tagline Utama
                  </label>
                  <span className="modern-badge-pill" style={{ background: '#eff6ff', color: 'var(--brand-blue)' }}>
                    Hero Subtitle
                  </span>
                </div>
                <div className="modern-input-group">
                  <span className="modern-input-icon">
                    <Sparkles size={16} />
                  </span>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Deskripsi profesi atau tagline institusi..."
                    className="modern-input-field"
                  />
                </div>
              </div>

              {/* Modern Input 3: Featured Title */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-headline)' }}>
                    {category === 'portfolio' ? 'Judul Karya Portofolio Unggulan' : category === 'blog' ? 'Judul Artikel Utama' : 'Modul Kurikulum Utama'}
                  </label>
                  <span className="modern-badge-pill" style={{ background: '#f8fafc', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }}>
                    Konten Unggulan
                  </span>
                </div>
                <div className="modern-input-group">
                  <span className="modern-input-icon">
                    <FileText size={16} />
                  </span>
                  <input
                    type="text"
                    value={featuredTitle}
                    onChange={(e) => setFeaturedTitle(e.target.value)}
                    placeholder="Judul artikel atau proyek..."
                    className="modern-input-field"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions Area (Pushed to bottom to align with right card) */}
            <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleSimulateDeploy}
                disabled={isSimulatingDeploy}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '13px',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(15, 23, 42, 0.15)'
                }}
              >
                {isSimulatingDeploy ? (
                  <>
                    <RefreshCw size={17} style={{ animation: 'spin 1s linear infinite' }} /> Mem-provisioning Kontainer Docker...
                  </>
                ) : (
                  <>
                    <Play size={16} fill="#ffffff" /> Simulasikan Terbitkan ke Docker Engine
                  </>
                )}
              </motion.button>

              {/* Provisioning Feedback Alert */}
              {deploySuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    marginTop: '16px',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    color: '#166534',
                    fontSize: '0.84rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={17} color="var(--brand-emerald)" />
                    <div>
                      <strong>Kontainer Aktif!</strong> ID: <code>tenant_{currentSlug}_a1</code>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.75rem', background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                    HTTPS Live
                  </span>
                </motion.div>
              )}
            </div>
          </MotionReveal>

          {/* Right: Realistic Browser Mockup & Live Logs (Equal Height) */}
          <MotionReveal
            direction="up"
            delay={0.25}
            distance={35}
            className="browser-window"
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}
          >
            {/* Browser Window Header with macOS-style colored dots */}
            <div className="browser-titlebar" style={{ background: '#f8fafc', borderBottom: '1px solid var(--border-subtle)' }}>
              <div className="window-dots" style={{ gap: '7px' }}>
                <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#ff5f56', border: '1px solid #e0443e', display: 'inline-block' }}></span>
                <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#ffbd2e', border: '1px solid #dea123', display: 'inline-block' }}></span>
                <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#27c93f', border: '1px solid #1aab29', display: 'inline-block' }}></span>
              </div>

              {/* URL Pill Bar */}
              <div className="browser-url-pill" style={{ background: '#ffffff', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)' }}>
                <Lock size={12} color="var(--brand-emerald)" />
                <span style={{ fontWeight: 500 }}>https://{currentSlug}.herocms.app</span>
              </div>

              {/* View Switcher Tabs */}
              <div style={{ display: 'flex', gap: '4px', background: '#e2e8f0', padding: '3px', borderRadius: '6px' }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  style={{
                    padding: '4px 10px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    borderRadius: '4px',
                    border: 'none',
                    background: activeTab === 'preview' ? '#0f172a' : 'transparent',
                    color: activeTab === 'preview' ? '#ffffff' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Pratinjau
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('logs')}
                  style={{
                    padding: '4px 10px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    borderRadius: '4px',
                    border: 'none',
                    background: activeTab === 'logs' ? '#0f172a' : 'transparent',
                    color: activeTab === 'logs' ? '#ffffff' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Log Docker
                </button>
              </div>
            </div>

            {/* View 1: Clean Rendered Website (Fills equal height smoothly) */}
            {activeTab === 'preview' && (
              <div style={{
                padding: '36px 32px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: '#ffffff'
              }}>
                <div>
                  {/* Simulated Web Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '18px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '28px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--brand-blue)' }}></span>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-headline)', letterSpacing: '-0.02em' }}>
                        {name}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '18px', fontSize: '0.84rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                      <span>Tentang</span>
                      <span>Karya</span>
                      <span style={{ color: 'var(--brand-blue)', fontWeight: 600 }}>Kontak</span>
                    </div>
                  </div>

                  {/* Simulated Web Hero */}
                  <div style={{ marginBottom: '28px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      background: '#eff6ff',
                      color: 'var(--brand-blue)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      marginBottom: '10px'
                    }}>
                      {category === 'portfolio' ? 'Engineering Showcase' : category === 'blog' ? 'Editorial Publications' : 'Akademi Kurikulum'}
                    </span>
                    <h3 style={{ fontSize: '1.65rem', color: 'var(--text-headline)', marginBottom: '8px', lineHeight: 1.25 }}>
                      Halo, saya {name}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '520px', lineHeight: 1.5 }}>
                      {role}
                    </p>
                  </div>

                  {/* Simulated Content Card */}
                  <div style={{
                    background: '#f8fafc',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '18px 20px',
                    boxShadow: 'var(--shadow-xs)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--brand-blue)', textTransform: 'uppercase' }}>
                        {category === 'portfolio' ? 'STUDI KASUS UNGGULAN' : category === 'blog' ? 'ARTIKEL TERBARU' : 'MODUL PEMBELAJARAN'}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Maret 2026</span>
                    </div>
                    <h4 style={{ fontSize: '1.02rem', color: 'var(--text-headline)', marginBottom: '6px' }}>
                      {featuredTitle}
                    </h4>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      Dijalankan di atas image kontainer Alpine Vue 3 mandiri dengan latensi edge TTFB di bawah 80 milidetik.
                    </p>
                  </div>
                </div>

                {/* Status Bar (Pushed to the very bottom) */}
                <div style={{
                  marginTop: 'auto',
                  paddingTop: '20px',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.76rem',
                  color: 'var(--text-muted)'
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="pulse-dot"></span> Kontainer Docker: 0.5 CPU / 256MB RAM
                  </span>
                  <span>Edge Proxy: Traefik v3 (TLS A+)</span>
                </div>
              </div>
            )}

            {/* View 2: Real-Time Docker Container Logs */}
            {activeTab === 'logs' && (
              <div style={{
                padding: '24px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: '#0f172a',
                color: '#94a3b8',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                lineHeight: 1.7
              }}>
                <div>
                  <div style={{ color: '#38bdf8', marginBottom: '8px' }}>
                    [INFO] Go Orchestrator v1.0.0 initializing container provisioning...
                  </div>
                  <div>&gt; Validating tenant credentials: tenant_{currentSlug} [OK]</div>
                  <div>&gt; Enforcing Linux cgroups limits: Memory=256MB, CPU=0.5 [OK]</div>
                  <div>&gt; Security profile: User=10001:10001, ReadonlyRootfs=true [OK]</div>
                  <div>&gt; Spawning container from image: herocms-tenant-runtime:alpine-v1</div>
                  <div style={{ color: '#4ade80' }}>&gt; Container ID: c_{currentSlug}_99fa started successfully</div>
                  <div>&gt; Injecting Traefik dynamic labels:</div>
                  <div style={{ color: '#fbbf24', paddingLeft: '12px' }}>
                    traefik.http.routers.tenant-{currentSlug}.rule=Host(`{currentSlug}.herocms.app`)
                  </div>
                  <div style={{ color: '#fbbf24', paddingLeft: '12px' }}>
                    traefik.http.routers.tenant-{currentSlug}.tls.certresolver=letsencrypt
                  </div>
                  <div style={{ color: '#4ade80', marginTop: '8px' }}>
                    [SUCCESS] Site is live and accessible at https://{currentSlug}.herocms.app (TTFB: 78ms)
                  </div>
                </div>

                <div style={{
                  paddingTop: '16px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.72rem',
                  color: '#64748b'
                }}>
                  <span>STREAMING REAL-TIME SOCKET</span>
                  <span style={{ color: '#4ade80' }}>● DOCKER DAEMON CONNECTED</span>
                </div>
              </div>
            )}
          </MotionReveal>
        </div>
      </div>
    </section>
  );
};
