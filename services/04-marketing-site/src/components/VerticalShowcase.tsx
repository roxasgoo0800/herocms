import React from 'react';
import { Briefcase, BookOpen, GraduationCap, ShoppingBag, Check } from 'lucide-react';
import { MotionReveal, MotionStagger, MotionItem } from './MotionReveal';
import { motion } from 'framer-motion';

export const VerticalShowcase: React.FC = () => {
  const verticals = [
    {
      title: 'Portofolio Profesional',
      target: 'Software Engineers, Desainer, Konsultan',
      desc: 'Showcase studi kasus proyek interaktif, tautan riwayat kontribusi GitHub, resume digital, dan form kontak terhubung langsung ke Telegram/Slack.',
      features: ['Studi kasus interaktif', 'Integrasi GitHub & CV', 'Form kontak langsung ke Telegram'],
      icon: <Briefcase size={24} color="#0f172a" />,
      badge: 'Paling Populer'
    },
    {
      title: 'Blog Publikasi & Editorial',
      target: 'Penulis Mandiri, Publikasi Media, Komunitas',
      desc: 'Block-based editor (Tiptap), estimasi reading time, feed RSS, hierarki kategori/tag, dan generator banner sosial media OpenGraph otomatis.',
      features: ['Editor visual berbasis blok', 'Estimasi waktu baca', 'Feed RSS & Meta OpenGraph'],
      icon: <BookOpen size={24} color="#2563eb" />,
      badge: 'SEO Optimal'
    },
    {
      title: 'Pusat Edukasi & Dokumentasi',
      target: 'Dosen, Universitas, Platform Kursus',
      desc: 'Hierarki kurikulum/silabus bertingkat, publikasi modul materi ajar, profil pengajar, pencarian cepat, dan penyajian dokumentasi teknis.',
      features: ['Hierarki silabus bertingkat', 'Modul materi ajar', 'Pencarian instan berindeks'],
      icon: <GraduationCap size={24} color="#059669" />,
      badge: 'Akademik'
    },
    {
      title: 'Showcase Produk & Bisnis Mikro',
      target: 'Usaha Kreatif, Freelancer, Agensi',
      desc: 'Katalog produk digital dan portofolio layanan dengan tombol pemesanan instan yang langsung mengarah ke WhatsApp atau payment link.',
      features: ['Katalog produk ringkas', 'Tombol checkout WhatsApp', 'Integrasi payment link'],
      icon: <ShoppingBag size={24} color="#d97706" />,
      badge: 'Konversi Tinggi'
    }
  ];

  return (
    <section className="section" style={{ background: '#f8fafc', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="container">
        <MotionReveal direction="up" distance={30} style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--brand-blue)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Solusi Siap Pakai
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', margin: '8px 0 16px' }}>
            Dirancang untuk Berbagai Kebutuhan Industri
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto', fontSize: '1.05rem' }}>
            Template cerdas dan alur kerja yang secara spesifik dirancang sesuai dengan karakteristik konten Anda.
          </p>
        </MotionReveal>

        <MotionStagger
          staggerDelay={0.1}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px'
          }}
        >
          {verticals.map((vert, idx) => (
            <MotionItem key={idx} distance={30}>
              <motion.div
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '28px',
                  boxShadow: 'var(--shadow-xs)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: 'var(--radius-md)',
                      background: '#f8fafc',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {vert.icon}
                    </div>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#0f172a',
                      background: '#f1f5f9',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)'
                    }}>
                      {vert.badge}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', marginBottom: '4px', color: 'var(--text-headline)' }}>
                    {vert.title}
                  </h3>
                  <div style={{ fontSize: '0.82rem', color: 'var(--brand-blue)', fontWeight: 600, marginBottom: '14px' }}>
                    {vert.target}
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
                    {vert.desc}
                  </p>

                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-body)', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                    {vert.features.map((feat, fIdx) => (
                      <li key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Check size={14} color="var(--brand-emerald)" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </MotionItem>
          ))}
        </MotionStagger>
      </div>
    </section>
  );
};
