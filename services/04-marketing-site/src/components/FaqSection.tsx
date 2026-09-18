import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { MotionReveal } from './MotionReveal';
import { motion, AnimatePresence } from 'framer-motion';

interface FaqItem {
  q: string;
  a: string;
}

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      q: 'Apa perbedaan mendasar HeroCMS dengan WordPress atau Strapi biasa?',
      a: 'Pada CMS tradisional, ribuan situs sering kali berbagi satu proses server monolitik, sehingga jika ada satu plugin rentan atau situs memakan banyak memori, seluruh server dapat terganggu. Pada HeroCMS, setiap website pelanggan di-deploy ke dalam kontainer Docker terisolasi mandiri dengan batas 0.5 CPU dan 256MB RAM (cgroups v2). Hal ini memberikan isolasi keamanan level sistem operasi, waktu muat sangat cepat (< 80ms TTFB), dan kemudahan migrasi.'
    },
    {
      q: 'Bagaimana cara kerja domain kustom dan sertifikat SSL otomatis?',
      a: 'Ketika Anda menambahkan domain pribadi (misalnya: www.portofolioanda.com), Anda hanya perlu mengarahkan CNAME ke server kami. Traefik v3 Edge Proxy secara otomatis mendeteksi permintaan domain baru, memvalidasi kepemilikan via Let\'s Encrypt ACME HTTP-01 challenge, dan menerbitkan sertifikat SSL resmi tanpa perlu me-restart server atau konfigurasi manual.'
    },
    {
      q: 'Apakah pembaruan artikel akan menyebabkan website mengalami downtime?',
      a: 'Tidak sama sekali. Kami menerapkan strategi Zero-Downtime Blue/Green Deployment. Ketika Anda mengklik "Terbitkan", Go Orchestrator akan menyalakan kontainer baru (Green), memeriksa kesiapan kesehatannya via endpoint /healthz, mengalihkan rute Traefik ke kontainer baru, lalu mematikan kontainer lama secara bertahap (drain).'
    },
    {
      q: 'Bagaimana cara kerja fitur AI Copilot dan Top-Views real-time?',
      a: 'Layanan AI kami dibangun dengan Golang dan terhubung ke engine LLM untuk membantu menyusun draf konten, mengoptimalkan SEO meta tag, dan menghasilkan palet warna tema dalam format JSON. Sedangkan metrik Top-Views dikumpulkan secara asinkron melalui event stream Redpanda/Kafka dan dihitung atomik menggunakan Redis Sorted Sets (ZSET), sehingga Anda mendapatkan data artikel terpopuler secara instan (< 1 milidetik).'
    },
    {
      q: 'Apakah data website dan aset media saya aman dari pengguna lain?',
      a: 'Sangat aman. Database PostgreSQL kami menerapkan Row-Level Security (RLS) di mana setiap query diisolasi ketat berdasarkan ID tenant. Selain itu, kontainer Docker tenant berjalan dengan user non-root (UID 10001) dan root filesystem read-only, serta terisolasi dalam jaringan bridge terpisah yang diblokir dari akses ke database utama atau Docker socket host.'
    }
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="section">
      <div className="container" style={{ maxWidth: '840px' }}>
        <MotionReveal direction="up" distance={30} style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--brand-blue)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Pertanyaan Umum
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.6rem)', margin: '8px 0 16px' }}>
            Kerap Ditanyakan Seputar Arsitektur
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
            Pelajari lebih dalam bagaimana platform kami bekerja di balik layar untuk mengamankan dan mempercepat website Anda.
          </p>
        </MotionReveal>

        <MotionReveal direction="up" delay={0.15} distance={30}>
          <div style={{ background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '16px 32px', boxShadow: 'var(--shadow-xs)' }}>
            {faqs.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  style={{
                    borderBottom: idx === faqs.length - 1 ? 'none' : '1px solid var(--border-subtle)',
                    padding: '20px 0'
                  }}
                >
                  <button
                    onClick={() => toggleAccordion(idx)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      color: 'var(--text-headline)',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    <span style={{ paddingRight: '16px' }}>{item.q}</span>
                    <ChevronDown
                      size={20}
                      color="var(--text-secondary)"
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                        flexShrink: 0
                      }}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ paddingTop: '12px', fontSize: '0.94rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </MotionReveal>
      </div>
    </section>
  );
};
