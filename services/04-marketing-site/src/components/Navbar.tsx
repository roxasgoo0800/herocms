import React, { useState, useEffect } from 'react';
import { Layers, ArrowRight, Terminal, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: scrolled ? '#ffffff' : 'rgba(255, 255, 255, 0.96)',
      borderBottom: '1px solid',
      borderColor: scrolled ? 'var(--border-subtle)' : 'rgba(226, 232, 240, 0.6)',
      boxShadow: scrolled ? '0 4px 20px -2px rgba(15, 23, 42, 0.05)' : 'none',
      transition: 'all 0.2s ease',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px'
      }}>
        {/* Brand Logo */}
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: '#0f172a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Layers size={20} color="#ffffff" />
          </div>
          <span style={{
            fontSize: '1.2rem',
            fontWeight: 800,
            color: '#0f172a',
            letterSpacing: '-0.03em'
          }}>
            Hero<span style={{ color: 'var(--brand-blue)' }}>CMS</span>
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav style={{
          display: 'none',
          gap: '32px',
          fontSize: '0.92rem',
          fontWeight: 500,
          color: 'var(--text-secondary)'
        }} className="desktop-nav">
          <a href="#demo" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.15s' }}>
            Live Demo
          </a>
          <a href="#features" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.15s' }}>
            Solusi & Program
          </a>
          <a href="#architecture" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.15s' }}>
            Arsitektur
          </a>
          <a href="#pricing" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.15s' }}>
            Paket & Biaya
          </a>
          <a href="#faq" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.15s' }}>
            FAQ
          </a>
        </nav>

        {/* Action CTAs */}
        <div style={{ display: 'none', alignItems: 'center', gap: '12px' }} className="desktop-nav">
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary"
            style={{ fontSize: '0.88rem', padding: '8px 16px' }}
          >
            <Terminal size={15} /> Masuk Studio
          </a>
          <a
            href="#demo"
            className="btn btn-primary"
            style={{ fontSize: '0.88rem', padding: '8px 18px' }}
          >
            Mulai Gratis <ArrowRight size={15} />
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'block',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            color: '#0f172a'
          }}
          className="mobile-toggle"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          background: '#ffffff',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <a href="#demo" onClick={() => setMobileMenuOpen(false)} style={{ color: '#0f172a', textDecoration: 'none', fontWeight: 600 }}>Live Demo</a>
          <a href="#features" onClick={() => setMobileMenuOpen(false)} style={{ color: '#0f172a', textDecoration: 'none', fontWeight: 600 }}>Solusi & Program</a>
          <a href="#architecture" onClick={() => setMobileMenuOpen(false)} style={{ color: '#0f172a', textDecoration: 'none', fontWeight: 600 }}>Arsitektur</a>
          <a href="#pricing" onClick={() => setMobileMenuOpen(false)} style={{ color: '#0f172a', textDecoration: 'none', fontWeight: 600 }}>Paket & Biaya</a>
          <a href="#faq" onClick={() => setMobileMenuOpen(false)} style={{ color: '#0f172a', textDecoration: 'none', fontWeight: 600 }}>FAQ</a>
          <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '8px' }}>
            <a href="http://localhost:5173" className="btn btn-secondary" style={{ flex: 1, textAlign: 'center' }}>Masuk Studio</a>
            <a href="#demo" className="btn btn-primary" style={{ flex: 1, textAlign: 'center' }}>Mulai Gratis</a>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
};
