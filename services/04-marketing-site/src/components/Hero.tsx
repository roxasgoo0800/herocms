import React from 'react';
import { ArrowRight, ShieldCheck, Zap, Server, Lock } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';

export const Hero: React.FC = () => {
  const fullText = "Infrastruktur CMS Otonom untuk Portofolio, Blog & Institusi Modern";
  const prefixLength = "Infrastruktur CMS Otonom untuk ".length;
  const [displayedText, setDisplayedText] = React.useState('');
  const [showCursor, setShowCursor] = React.useState(true);
  const [cursorVisible, setCursorVisible] = React.useState(true);
  const [isContentRevealed, setIsContentRevealed] = React.useState(false);

  React.useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);

        // Immediately trigger bottom content reveal without waiting
        setIsContentRevealed(true);

        // In parallel, cursor performs exactly 2 elegant dim/blink cycles to signal typing completion
        // Dim 1:
        setTimeout(() => setCursorVisible(false), 160);
        setTimeout(() => setCursorVisible(true), 360);
        // Dim 2:
        setTimeout(() => setCursorVisible(false), 560);
        setTimeout(() => setCursorVisible(true), 760);
        // Permanently retire cursor after 2nd dim
        setTimeout(() => setShowCursor(false), 960);
      }
    }, 26); // Natural sweet spot (~1.75s total completion, comfortable to read)

    return () => clearInterval(timer);
  }, []);

  // Subtitle animation: triggers smoothly right after typing finishes
  const subtitleVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 90,
        damping: 20,
        mass: 0.8,
        delay: 0.08
      }
    }
  };

  // Action buttons animation: follows right after subtitle
  const buttonsVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 90,
        damping: 20,
        mass: 0.8,
        delay: 0.2
      }
    }
  };

  // Butter-smooth physics springs for staggered badges
  const badgeContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.09,
        delayChildren: 0.32
      }
    }
  };

  const badgeItemVariants: Variants = {
    hidden: { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 85,
        damping: 18,
        mass: 0.8
      }
    }
  };

  const badges = [
    {
      icon: <Server size={20} />,
      iconColor: '#0f172a',
      title: 'Isolasi Kontainer Penuh',
      desc: 'cgroups v2: 0.5 CPU & 256MB RAM'
    },
    {
      icon: <Zap size={20} />,
      iconColor: 'var(--brand-blue)',
      title: 'Deploy Seketika',
      desc: 'Rata-rata < 4.5 detik ke status live'
    },
    {
      icon: <Lock size={20} />,
      iconColor: 'var(--brand-emerald)',
      title: 'Traefik Auto-SSL',
      desc: "Let's Encrypt otomatis tanpa restart"
    },
    {
      icon: <ShieldCheck size={20} />,
      iconColor: '#6366f1',
      title: 'Keamanan Enterprise',
      desc: 'Non-root UID 10001, RootFS Read-Only'
    }
  ];

  return (
    <section className="section" style={{ background: 'transparent', paddingTop: '80px', paddingBottom: '72px', textAlign: 'center' }}>
      <div className="container">
        {/* Hero Title with Ghost Text to completely eliminate layout shift */}
        <h1 style={{
          position: 'relative',
          fontSize: 'clamp(2.4rem, 5vw, 4rem)',
          maxWidth: '960px',
          margin: '0 auto 24px',
          color: 'var(--text-headline)',
          lineHeight: 1.18,
          letterSpacing: '-0.03em'
        }}>
          {/* 1. Ghost Invisible Text: establishes exact final multi-line height from millisecond 0 */}
          <span style={{ visibility: 'hidden', userSelect: 'none', pointerEvents: 'none', display: 'block' }} aria-hidden="true">
            {fullText}
          </span>

          {/* 2. Active Typing Overlay: smoothly fills in the reserved space without moving anything below */}
          <span style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'block',
            textAlign: 'center'
          }}>
            {displayedText.length <= prefixLength ? (
              <span>{displayedText}</span>
            ) : (
              <>
                <span>{displayedText.slice(0, prefixLength)}</span>
                <span style={{ color: 'var(--brand-blue)' }}>{displayedText.slice(prefixLength)}</span>
              </>
            )}
            {/* Zero-width cursor container: ensures the word "Modern" never shifts even 1px during dimming or removal */}
            <span
              style={{
                display: 'inline-block',
                width: 0,
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                userSelect: 'none',
                verticalAlign: 'baseline'
              }}
              aria-hidden="true"
            >
              <span
                style={{
                  display: 'inline-block',
                  marginLeft: '3px',
                  color: 'var(--brand-blue)',
                  fontWeight: 400,
                  opacity: showCursor && cursorVisible ? 1 : 0,
                  transition: 'opacity 0.14s ease'
                }}
              >
                |
              </span>
            </span>
          </span>
        </h1>

        {/* Hero Subtitle: Only appears after 2 dim cycles complete */}
        <motion.p
          variants={subtitleVariants}
          initial="hidden"
          animate={isContentRevealed ? "visible" : "hidden"}
          style={{
            fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)',
            color: 'var(--text-secondary)',
            maxWidth: '780px',
            margin: '0 auto 40px',
            lineHeight: 1.6
          }}
        >
          Platform penerbitan web generasi baru yang menggabungkan kemudahan studio visual dengan keamanan kontainer Docker mandiri. Setiap website memiliki alokasi memori terisolasi, perutean Traefik v3, dan SSL Let's Encrypt otomatis.
        </motion.p>

        {/* Action Buttons: Only appears after 2 dim cycles complete */}
        <motion.div
          variants={buttonsVariants}
          initial="hidden"
          animate={isContentRevealed ? "visible" : "hidden"}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}
        >
          <motion.a
            href="#demo"
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn btn-primary"
            style={{ padding: '13px 28px', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            Coba Live Interactive Demo <ArrowRight size={17} />
          </motion.a>
          <motion.a
            href="#architecture"
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn btn-secondary"
            style={{ padding: '13px 24px', fontSize: '1rem' }}
          >
            Lihat Spesifikasi Arsitektur
          </motion.a>
        </motion.div>

        {/* High-Trust Value Proposition Badges: Seamlessly reveals after 2 dim cycles complete */}
        <motion.div
          variants={badgeContainerVariants}
          initial="hidden"
          animate={isContentRevealed ? "visible" : "hidden"}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            maxWidth: '980px',
            margin: '64px auto 0',
            textAlign: 'left'
          }}
        >
          {badges.map((badge, idx) => (
            <motion.div
              key={idx}
              variants={badgeItemVariants}
              whileHover={{
                y: -4,
                boxShadow: '0 10px 28px -6px rgba(15, 23, 42, 0.1), 0 0 0 1px rgba(37, 99, 235, 0.15)',
                transition: { duration: 0.2, ease: 'easeOut' }
              }}
              style={{
                background: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: 'var(--shadow-xs)',
                cursor: 'default'
              }}
            >
              <div style={{
                background: '#f1f5f9',
                padding: '8px',
                borderRadius: '8px',
                color: badge.iconColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {badge.icon}
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-headline)', lineHeight: 1.3 }}>
                  {badge.title}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {badge.desc}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
