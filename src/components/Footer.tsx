import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { OptimizedImage } from '@/components/OptimizedImage'
import logo from '@/assets/logo.webp'
import { companyInfo } from '@/config/company'
import { cities } from '@/data/cities'
import { industries } from '@/data/industries'

// ── Design tokens ──────────────────────────────────────────────

const FONT_BODY = "'Cabin', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"

const WHITE        = '#ffffff'
const STEEL        = 'rgba(255,255,255,0.50)'
const BG           = 'hsl(160 84% 12%)'
const ACCENT_LIGHT = 'hsl(160 60% 65%)'
const ACCENT_GRAD  = 'linear-gradient(135deg, hsl(160 84% 25%) 0%, hsl(160 84% 50%) 50%, hsl(160 84% 35%) 100%)'

const EASE_OUT = [0.16, 1, 0.3, 1] as const

// ── Breakpoint ─────────────────────────────────────────────────

function useBp() {
  const [bp, setBp] = useState({ isMobile: false, isTablet: false })
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      setBp({ isMobile: w < 768, isTablet: w >= 768 && w < 1024 })
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return bp
}

// ── Nav columns ────────────────────────────────────────────────

const FOOTER_COLS = [
  {
    label: 'Navigatie',
    links: [
      { label: 'Home',      to: '/' },
      { label: 'Diensten',  to: '/diensten' },
      { label: 'Portfolio', to: '/portfolio' },
      { label: 'Over Ons',  to: '/over-ons' },
      { label: 'Contact',   to: '/contact' },
      { label: 'Blog',      to: '/blog' },
    ],
  },
  {
    label: 'Diensten',
    links: [
      { label: 'Website op maat', to: '/diensten/website-op-maat' },
      { label: 'Webshops',        to: '/diensten/webshops' },
      { label: 'E-commerce',      to: '/diensten/e-commerce' },
      { label: 'Alle diensten →', to: '/diensten' },
    ],
  },
]

// ── Numbered link ──────────────────────────────────────────────

function NumLink({ label, to }: { label: string; to: string; index?: number }) {
  const [hov, setHov] = useState(false)
  return (
    <motion.div onHoverStart={() => setHov(true)} onHoverEnd={() => setHov(false)}>
      <Link
        to={to}
        style={{
          display: 'block', textDecoration: 'none',
          padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <motion.span
          animate={{ color: hov ? WHITE : STEEL, x: hov ? 2 : 0 }}
          transition={{ duration: 0.18 }}
          style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 300, display: 'inline-block' }}
        >
          {label}
        </motion.span>
      </Link>
    </motion.div>
  )
}

// ── Nav block ──────────────────────────────────────────────────

function FooterNavBlock({ col }: { col: typeof FOOTER_COLS[number] }) {
  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        <span style={{
          fontFamily: FONT_BODY, fontSize: 9, fontWeight: 700,
          letterSpacing: '0.28em', textTransform: 'uppercase' as const, color: ACCENT_LIGHT,
        }}>
          {col.label}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {col.links.map((link, i) => (
          <NumLink key={link.to + link.label} label={link.label} to={link.to} index={i} />
        ))}
      </div>
    </div>
  )
}

// ── Footer ─────────────────────────────────────────────────────

function FooterComponent() {
  const { isMobile, isTablet } = useBp()

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 1.0, ease: EASE_OUT }}
      style={{ background: BG, position: 'relative', overflow: 'hidden' }}
    >
      {/* Animated green glow blobs */}
      <motion.div
        animate={{ opacity: [0.3, 0.65, 0.3], x: [0, 24, 0], y: [0, 18, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: '-35%', left: '-12%', width: '75%', height: '90%',
          background: 'radial-gradient(ellipse at center, hsl(160 84% 40% / 0.14) 0%, transparent 60%)',
          pointerEvents: 'none', zIndex: 0,
        }}
      />
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5], x: [0, -32, 0], y: [0, -24, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        style={{
          position: 'absolute', bottom: '-25%', right: '-18%', width: '70%', height: '70%',
          background: 'radial-gradient(ellipse at center, hsl(160 84% 55% / 0.10) 0%, hsl(160 84% 30% / 0.06) 40%, transparent 68%)',
          pointerEvents: 'none', zIndex: 0,
        }}
      />
      <motion.div
        animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.25, 0.95, 1] }}
        transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        style={{
          position: 'absolute', top: '25%', right: '10%', width: '40%', height: '50%',
          background: 'radial-gradient(ellipse at center, hsl(160 84% 60% / 0.07) 0%, transparent 58%)',
          pointerEvents: 'none', zIndex: 0,
        }}
      />

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Green gradient rule */}
        <div style={{
          height: 1,
          background: 'linear-gradient(90deg, transparent 0%, hsl(160 84% 35%) 25%, hsl(160 84% 55%) 50%, hsl(160 84% 35%) 75%, transparent 100%)',
          opacity: 0.6,
        }} />

        {/* Eyebrow */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: isMobile ? '18px 24px' : '20px 48px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexWrap: 'wrap' as const, gap: 12,
        }}>
          <span style={{ fontFamily: FONT_BODY, fontSize: 10, letterSpacing: '0.28em', color: 'rgba(255,255,255,0.35)' }}>
            {"NIEUWBLIK · WEBDESIGN BUREAU "}
          </span>
          <span style={{ fontFamily: FONT_BODY, fontSize: 10, letterSpacing: '0.2em', color: ACCENT_LIGHT }}>
            {companyInfo.address.city.toUpperCase()} · NEDERLAND
          </span>
        </div>

        {/* Main body */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile || isTablet ? '1fr' : '5fr 7fr',
          padding: isMobile ? '56px 24px' : '80px 48px',
          gap: isMobile ? 56 : 96,
        }}>

          {/* Left — editorial */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h2 style={{
              fontFamily: "'Epilogue', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontWeight: 700,
              fontSize: 'clamp(34px, 4.2vw, 56px)',
              color: WHITE, lineHeight: 0.9, letterSpacing: '-0.01em',
              margin: '0 0 28px', textTransform: 'uppercase' as const,
            }}>
              WEBSITES <br />DIE GROEIEN.
            </h2>
            <p style={{
              fontFamily: FONT_BODY, fontSize: 14, fontWeight: 300, color: STEEL,
              lineHeight: 1.75, margin: '0 0 36px', maxWidth: 300,
            }}>
              Webdesign bureau dat strategie en design combineert tot meetbaar resultaat. Geen templates — elk project op maat gebouwd.
            </p>

            {/* Brand facts */}
            <div style={{ paddingTop: 20, marginBottom: 32, position: 'relative' }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                background: ACCENT_GRAD, opacity: 0.35,
              }} />
              {([
                ['OPGERICHT', companyInfo.foundingDate],
                ['LOCATIE',   companyInfo.address.city.toUpperCase()],
                ['KVK',       companyInfo.kvk],
              ] as [string, string][]).map(([key, val]) => (
                <div key={key} style={{
                  display: 'flex', gap: 16, alignItems: 'baseline',
                  padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.04)',
                }}>
                  <span style={{
                    fontFamily: FONT_BODY, fontSize: 9,
                    color: 'rgba(255,255,255,0.28)', letterSpacing: '0.2em', minWidth: 80,
                  }}>
                    {key}
                  </span>
                  <span style={{ fontFamily: FONT_BODY, fontSize: 10, color: ACCENT_LIGHT, letterSpacing: '0.1em' }}>
                    {val}
                  </span>
                </div>
              ))}
            </div>

          </div>

          {/* Right — nav 2×2 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: isMobile ? '40px 24px' : '48px 40px',
            alignContent: 'start',
          }}>
            {FOOTER_COLS.map(col => <FooterNavBlock key={col.label} col={col} />)}
          </div>
        </div>

        {/* SEO mega section — steden & branches */}
        <div style={{
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: isMobile ? '40px 24px' : '48px 48px',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
          gap: isMobile ? 40 : 64,
        }}>
          <div>
            <div style={{ marginBottom: 16 }}>
              <span style={{
                fontFamily: FONT_BODY, fontSize: 9, fontWeight: 700,
                letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: ACCENT_LIGHT,
              }}>
                Website laten maken per stad
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px 16px' }}>
              {cities.map(c => (
                <Link
                  key={c.slug}
                  to={`/website-laten-maken-${c.slug}`}
                  style={{
                    fontFamily: FONT_BODY, fontSize: 12, fontWeight: 300,
                    color: STEEL, textDecoration: 'none', padding: '4px 0', display: 'block',
                  }}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <div style={{ marginBottom: 16 }}>
              <span style={{
                fontFamily: FONT_BODY, fontSize: 9, fontWeight: 700,
                letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: ACCENT_LIGHT,
              }}>
                Website laten maken per branche
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px 16px' }}>
              {industries.map(b => (
                <Link
                  key={b.slug}
                  to={`/website-laten-maken-${b.slug}`}
                  style={{
                    fontFamily: FONT_BODY, fontSize: 12, fontWeight: 300,
                    color: STEEL, textDecoration: 'none', padding: '4px 0', display: 'block',
                  }}
                >
                  {b.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Legal bar */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center',
          justifyContent: 'space-between',
          padding: isMobile ? '24px 24px 40px' : '24px 48px',
          gap: isMobile ? 12 : 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <OptimizedImage
              src={logo}
              alt="Nieuwblik"
              className="brightness-0 invert opacity-30"
              type="logo"
              width={72}
              height={18}
            />
            <span style={{ fontFamily: FONT_BODY, fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em' }}>
              © {new Date().getFullYear()} {companyInfo.name}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {[
              { label: 'Privacy',              to: '/privacy' },
              { label: 'Cookies',              to: '/cookies' },
              { label: 'Algemene Voorwaarden', to: '/algemene-voorwaarden' },
            ].map((item, i) => (
              <React.Fragment key={item.to}>
                {i > 0 && <span style={{ color: 'rgba(255,255,255,0.1)', fontFamily: FONT_BODY, fontSize: 9 }}>·</span>}
                <Link
                  to={item.to}
                  style={{
                    fontFamily: FONT_BODY, fontSize: 10, letterSpacing: '0.1em',
                    color: 'rgba(255,255,255,0.28)', textDecoration: 'none',
                  }}
                >
                  {item.label}
                </Link>
              </React.Fragment>
            ))}
          </div>
        </div>

      </div>
    </motion.footer>
  )
}

// ── Default export ─────────────────────────────────────────────

const Footer = () => <FooterComponent />
export default Footer
