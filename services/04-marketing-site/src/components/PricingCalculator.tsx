import React, { useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { MotionReveal, MotionStagger, MotionItem } from './MotionReveal';
import { motion } from 'framer-motion';

export const PricingCalculator: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState<boolean>(true);
  const [containers, setContainers] = useState<number>(1);
  const [aiTokens, setAiTokens] = useState<number>(50); // in thousands

  // Base calculation with 20% annual discount
  const baseMonthlyPerContainer = 49000; // IDR 49,000 / month
  const aiCostPerTenK = 5000;
  const rawCost = containers * baseMonthlyPerContainer + (aiTokens / 10) * aiCostPerTenK;
  const totalCost = isAnnual ? Math.round(rawCost * 0.8) : rawCost;

  return (
    <section id="pricing" className="section" style={{ background: '#f8fafc', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="container">
        {/* Section Header */}
        <MotionReveal direction="up" distance={30} style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--brand-blue)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Biaya Transparan & Skalabilitas Fleksibel
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', margin: '8px 0 16px' }}>
            Investasi Terjangkau untuk Infrastruktur Mandiri
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto', fontSize: '1.05rem' }}>
            Hanya bayar untuk jumlah kontainer Docker dan kuota AI yang Anda gunakan. Tanpa biaya tersembunyi.
          </p>

          {/* Billing Cycle Switcher */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: '#e2e8f0',
            padding: '4px',
            borderRadius: 'var(--radius-full)',
            marginTop: '28px',
            gap: '4px'
          }}>
            <button
              onClick={() => setIsAnnual(false)}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: !isAnnual ? '#ffffff' : 'transparent',
                color: !isAnnual ? '#0f172a' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Tagihan Bulanan
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: isAnnual ? '#ffffff' : 'transparent',
                color: isAnnual ? '#0f172a' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.15s ease'
              }}
            >
              <span>Tahunan</span>
              <span style={{
                background: '#dcfce7',
                color: '#15803d',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)'
              }}>
                Hemat 20%
              </span>
            </button>
          </div>
        </MotionReveal>

        {/* Dynamic Capacity Calculator */}
        <MotionReveal
          direction="up"
          delay={0.15}
          distance={35}
          style={{
            background: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            maxWidth: '860px',
            margin: '0 auto 56px',
            padding: '36px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', alignItems: 'center' }}>
            {/* Interactive Sliders */}
            <div>
              <div style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-headline)' }}>Jumlah Kontainer Website:</span>
                  <span style={{ color: 'var(--brand-blue)', fontWeight: 700 }}>{containers} Kontainer</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={containers}
                  onChange={(e) => setContainers(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--brand-blue)' }}
                />
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Masing-masing mendapat 0.5 CPU & 256MB RAM terisolasi</span>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-headline)' }}>Kuota AI Tokens Bulanan:</span>
                  <span style={{ color: '#059669', fontWeight: 700 }}>{aiTokens}k Token</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="200"
                  step="10"
                  value={aiTokens}
                  onChange={(e) => setAiTokens(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#059669' }}
                />
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Untuk asisten penulisan artikel dan generator tema otomatis</span>
              </div>
            </div>

            {/* Price Output Column */}
            <div style={{
              background: '#f8fafc',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              padding: '28px',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                ESTIMASI BIAYA BERLANGGANAN
              </span>
              <div style={{ fontSize: '2.6rem', fontWeight: 800, margin: '12px 0 4px', color: 'var(--text-headline)' }}>
                Rp {totalCost.toLocaleString('id-ID')}
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 400 }}> /bln</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                {isAnnual ? 'Ditagih tahunan (sudah termasuk diskon 20%).' : 'Ditagih per bulan, bisa batalkan kapan saja.'}
              </p>
              <a href="#demo" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                Mulai dengan Kapasitas Ini <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </MotionReveal>

        {/* 3 Tier Plans Comparison */}
        <MotionStagger
          staggerDelay={0.1}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}
        >
          {/* Tier 1: Developer */}
          <MotionItem distance={30}>
            <motion.div
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              style={{
                background: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '32px',
                boxShadow: 'var(--shadow-xs)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>Starter Developer</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                  Untuk mahasiswa dan software engineer yang membangun portofolio pertamanya.
                </p>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '24px', color: 'var(--text-headline)' }}>
                  Gratis
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem', color: 'var(--text-body)', marginBottom: '32px' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Check size={16} color="var(--brand-emerald)" /> 1 Kontainer Website Alpine</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Check size={16} color="var(--brand-emerald)" /> Subdomain *.herocms.app</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Check size={16} color="var(--brand-emerald)" /> 10k AI Tokens per bulan</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Check size={16} color="var(--brand-emerald)" /> Traefik Auto-SSL Aktif</li>
                </ul>
              </div>
              <a href="#demo" className="btn btn-secondary" style={{ width: '100%' }}>Daftar Gratis</a>
            </motion.div>
          </MotionItem>

          {/* Tier 2: Pro Creator */}
          <MotionItem distance={30}>
            <motion.div
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              style={{
                background: '#ffffff',
                border: '2px solid var(--brand-blue)',
                borderRadius: 'var(--radius-lg)',
                padding: '32px',
                boxShadow: 'var(--shadow-md)',
                position: 'relative',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'var(--brand-blue)',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '3px 12px',
                  borderRadius: 'var(--radius-full)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}>
                  Paling Populer
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>Pro Creator & Agency</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                  Untuk profesional yang membutuhkan domain kustom pribadi dan publishing aktif.
                </p>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '24px', color: 'var(--brand-blue)' }}>
                  Rp {isAnnual ? '63.200' : '79.000'} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 400 }}>/bln</span>
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem', color: 'var(--text-body)', marginBottom: '32px' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Check size={16} color="var(--brand-emerald)" /> Hingga 3 Kontainer Website Mandiri</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Check size={16} color="var(--brand-emerald)" /> Custom Domain Pribadi (.com / .id)</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Check size={16} color="var(--brand-emerald)" /> 100k AI Tokens + SEO Generator</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Check size={16} color="var(--brand-emerald)" /> Real-Time Top-Views Telemetry</li>
                </ul>
              </div>
              <a href="#demo" className="btn btn-primary" style={{ width: '100%', background: 'var(--brand-blue)' }}>Pilih Paket Pro</a>
            </motion.div>
          </MotionItem>

          {/* Tier 3: Enterprise */}
          <MotionItem distance={30}>
            <motion.div
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              style={{
                background: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '32px',
                boxShadow: 'var(--shadow-xs)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>Institusi & Kampus</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                  Untuk universitas, sekolah tinggi, atau jaringan publikasi multi-brand.
                </p>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '24px', color: 'var(--text-headline)' }}>
                  Kustom
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem', color: 'var(--text-body)', marginBottom: '32px' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Check size={16} color="var(--brand-emerald)" /> Dedicated Docker Swarm Cluster Node</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Check size={16} color="var(--brand-emerald)" /> Unlimited Kontainer & Subdomain</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Check size={16} color="var(--brand-emerald)" /> Integrasi n8n & Workflow Kustom</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Check size={16} color="var(--brand-emerald)" /> SLA 99.9% dengan Tim Support Khusus</li>
                </ul>
              </div>
              <a href="#demo" className="btn btn-secondary" style={{ width: '100%' }}>Konsultasi Tim</a>
            </motion.div>
          </MotionItem>
        </MotionStagger>
      </div>
    </section>
  );
};
