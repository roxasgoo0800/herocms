import React from 'react';
import { Terminal, Layout, Server, Globe, Sparkles, Shield, ArrowUpRight } from 'lucide-react';
import { MotionReveal, MotionStagger, MotionItem } from './MotionReveal';
import { motion } from 'framer-motion';

export const FeaturesGrid: React.FC = () => {
  const programs = [
    {
      num: '01',
      title: 'Admin Console (SuperAdmin)',
      stack: 'Laravel 11 + FilamentPHP (PHP 8.3)',
      desc: 'Panel kontrol platform internal untuk tata kelola seluruh tenant, pengawasan utilisasi node server, alokasi kuota resource, dan rekonsiliasi billing langganan.',
      icon: <Terminal size={22} color="#0f172a" />,
      tag: 'Operasional Platform'
    },
    {
      num: '02',
      title: 'Dashboard CMS (Tenant Studio)',
      stack: 'Vue 3 + Vite + Pinia',
      desc: 'Studio visual bagi pengguna untuk menulis artikel, merancang studi kasus portofolio dengan block editor (Tiptap), upload media S3, dan menggunakan AI Copilot.',
      icon: <Layout size={22} color="#2563eb" />,
      tag: 'Studio Pelanggan'
    },
    {
      num: '03',
      title: 'Provisioning Orchestrator API',
      stack: 'Golang 1.23+ & Docker Engine SDK',
      desc: 'Mesin komputasi otonom yang berkomunikasi langsung dengan Docker daemon untuk mem-provisioning kontainer baru, menginjeksi routing Traefik, dan zero-downtime rolling update.',
      icon: <Server size={22} color="#0f172a" />,
      tag: 'Jantung DevOps'
    },
    {
      num: '04',
      title: 'Website Promosi & Pemasaran',
      stack: 'React 19 + TypeScript + Vite',
      desc: 'Halaman publik dengan performa tinggi (100/100 Core Web Vitals), dilengkapi Interactive Live Sandbox untuk mencoba sistem langsung sebelum registrasi.',
      icon: <Globe size={22} color="#2563eb" />,
      tag: 'Frontend Publik'
    },
    {
      num: '05',
      title: 'AI Agent & Data Intelligence',
      stack: 'Golang + n8n + LLM Engine',
      desc: 'Layanan AI untuk membuat token tema dari teks, mengolah metrik Top Views secara instan lewat Redis Sorted Sets, dan otomatisasi alur kerja pihak ketiga via n8n.',
      icon: <Sparkles size={22} color="#059669" />,
      tag: 'Kecerdasan Buatan'
    },
    {
      num: 'Infra',
      title: 'Traefik v3 Edge & Auto SSL',
      stack: 'Traefik v3 + Let\'s Encrypt + cgroups',
      desc: 'Reverse proxy cerdas yang mendeteksi kontainer baru via Docker socket provider, membatasi 0.5 CPU & 256MB RAM per tenant, dan menerbitkan HTTPS otomatis.',
      icon: <Shield size={22} color="#d97706" />,
      tag: 'Keamanan Edge'
    }
  ];

  return (
    <section id="features" className="section">
      <div className="container">
        <MotionReveal direction="up" distance={30} style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--brand-blue)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Spesifikasi Arsitektur
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', margin: '8px 0 16px' }}>
            5 Program Inti dalam Satu Ekosistem Terpadu
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto', fontSize: '1.05rem' }}>
            Arsitektur microservices terdistribusi yang dirancang untuk keandalan tinggi, pemeliharaan mudah, dan skalabilitas horizontal.
          </p>
        </MotionReveal>

        <MotionStagger
          staggerDelay={0.09}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '24px'
          }}
        >
          {programs.map((item) => (
            <MotionItem key={item.num} distance={30}>
              <motion.div
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="card-clean"
                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}
              >
                <div>
                  {/* Header of card */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: 'var(--radius-md)',
                      background: '#f8fafc',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {item.icon}
                    </div>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--text-secondary)',
                      background: '#f1f5f9',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)'
                    }}>
                      {item.tag}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', marginBottom: '6px', color: 'var(--text-headline)' }}>
                    {item.title}
                  </h3>
                  <div style={{
                    fontSize: '0.82rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--brand-blue)',
                    fontWeight: 600,
                    marginBottom: '14px'
                  }}>
                    {item.stack}
                  </div>
                  <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {item.desc}
                  </p>
                </div>

                <div style={{
                  marginTop: '24px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.82rem',
                  color: 'var(--text-headline)',
                  fontWeight: 600
                }}>
                  <span>Program #{item.num}</span>
                  <ArrowUpRight size={16} color="var(--brand-blue)" />
                </div>
              </motion.div>
            </MotionItem>
          ))}
        </MotionStagger>
      </div>
    </section>
  );
};
