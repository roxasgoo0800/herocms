import React, { useState } from 'react';
import { ShieldCheck, Zap, HardDrive, Cpu } from 'lucide-react';
import infraDiagram from '../../../../docs/assets/infra_flow_diagram.jpg';
import { MotionReveal } from './MotionReveal';

export const InfraArchitecture: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<'ingress' | 'runtime' | 'data' | 'ai'>('ingress');
  const [imageLoaded, setImageLoaded] = useState<boolean>(true);

  const layerDetails = {
    ingress: {
      title: 'Layer Ingress & Reverse Proxy (Traefik v3)',
      desc: 'Traefik v3 mendengarkan port 80 dan 443 pada host. Dilengkapi Docker Provider yang secara dinamis membaca label kontainer baru, serta modul Let\'s Encrypt yang secara otomatis menerbitkan sertifikat SSL untuk domain kustom dalam hitungan detik tanpa downtime.',
      metrics: ['Port 80/443 Auto SSL', 'Let\'s Encrypt HTTP-01', 'Rate Limiting Middleware']
    },
    runtime: {
      title: 'Layer Eksekusi Kontainer Mandiri (cgroups v2)',
      desc: 'Setiap website pelanggan berjalan di dalam kontainer Docker mandiri (Alpine Vue 3 SSR) yang dikeraskan: non-root user (UID 10001), root filesystem read-only, partisi sementara di RAM (tmpfs), dan alokasi sumber daya 0.5 CPU serta 256MB RAM.',
      metrics: ['Non-Root UID 10001', 'Read-Only RootFS', '0.5 vCPU & 256MB RAM']
    },
    data: {
      title: 'Infrastruktur Data Relasional & Cache (PostgreSQL + Redis)',
      desc: 'PostgreSQL 16 menerapkan Row-Level Security (RLS) di tingkat mesin basis data agar data antar-tenant tidak pernah bocor. Redis 7 Sorted Sets mengelola counter Top Views secara atomik untuk latensi baca di bawah 1 milidetik.',
      metrics: ['Postgres 16 RLS Policy', 'Redis Sorted Sets (< 1ms)', 'Zero-Leak Multi-Tenancy']
    },
    ai: {
      title: 'Layanan AI Agent & Event Bus (Golang + Redpanda / Kafka)',
      desc: 'Pipa telemetri Redpanda (Kafka API) mengalirkan jutaan klik pengunjung secara asinkron tanpa membebani database utama. Microservice AI Golang memproses data ini untuk analitik tren dan menghasilkan palet tema kustom berbasis teks.',
      metrics: ['Kafka Event Streaming', 'Structured JSON Prompting', 'n8n Workflow Hub']
    }
  };

  return (
    <section id="architecture" className="section">
      <div className="container">
        <MotionReveal direction="up" distance={30} style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--brand-blue)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Infrastruktur Skala Enterprise
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', margin: '8px 0 16px' }}>
            Arsitektur Teruji Tanpa Titik Kegagalan Tunggal
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto', fontSize: '1.05rem' }}>
            Diagram teknis yang mendasari platform HeroCMS, dirancang mengadopsi standar sistem global seperti Ghost Pro, Vercel, dan Fly.io.
          </p>
        </MotionReveal>

        {/* Diagram Card Container with Motion Reveal */}
        <MotionReveal
          direction="up"
          delay={0.15}
          distance={35}
          style={{
            background: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px',
            boxShadow: 'var(--shadow-md)',
            marginBottom: '32px'
          }}
        >
          <div style={{
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            border: '1px solid var(--border-subtle)',
            background: '#080b12',
            position: 'relative',
            minHeight: '280px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img
              src={infraDiagram}
              alt="Diagram Arsitektur Infrastruktur HeroCMS Multi-Tenant"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                maxHeight: '640px',
                objectFit: 'contain'
              }}
              onError={() => setImageLoaded(false)}
            />

            {!imageLoaded && (
              <div style={{ padding: '40px', textAlign: 'center', color: '#f8fafc' }}>
                <Cpu size={48} color="#38bdf8" style={{ margin: '0 auto 16px' }} />
                <h4 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '8px' }}>Arsitektur Multi-Tenant HeroCMS</h4>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '520px', margin: '0 auto' }}>
                  Traefik v3 Edge Proxy ➔ Docker Swarm / Isolated Tenant Containers (0.5 CPU / 256MB RAM) ➔ PostgreSQL 16 RLS & Redis 7 ➔ Redpanda / Kafka Telemetry
                </p>
              </div>
            )}
          </div>
        </MotionReveal>

        {/* Interactive Layer Explorer Tabs with Motion Reveal */}
        <MotionReveal
          direction="up"
          delay={0.25}
          distance={35}
          style={{
            background: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '32px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{
            display: 'flex',
            gap: '8px',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '16px',
            marginBottom: '24px',
            flexWrap: 'wrap'
          }}>
            {[
              { id: 'ingress', label: '1. Ingress & Reverse Proxy', icon: <ShieldCheck size={16} /> },
              { id: 'runtime', label: '2. Docker Runtime & cgroups', icon: <Cpu size={16} /> },
              { id: 'data', label: '3. PostgreSQL RLS & Redis', icon: <HardDrive size={16} /> },
              { id: 'ai', label: '4. Kafka & AI Service', icon: <Zap size={16} /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveLayer(tab.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: activeLayer === tab.id ? '#0f172a' : '#f8fafc',
                  color: activeLayer === tab.id ? '#ffffff' : 'var(--text-secondary)',
                  border: '1px solid',
                  borderColor: activeLayer === tab.id ? '#0f172a' : 'var(--border-subtle)',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '8px', color: 'var(--text-headline)' }}>
              {layerDetails[activeLayer].title}
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '20px' }}>
              {layerDetails[activeLayer].desc}
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {layerDetails[activeLayer].metrics.map((metric, mIdx) => (
                <span
                  key={mIdx}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    background: '#f1f5f9',
                    color: 'var(--text-headline)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--brand-blue)' }}></span>
                  {metric}
                </span>
              ))}
            </div>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
};
