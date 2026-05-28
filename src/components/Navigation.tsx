import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronDown, ChevronRight, Globe, ShoppingCart, TrendingUp, Menu, X } from 'lucide-react'
import logo from '@/assets/logo.webp'
import ReviewBar from './ReviewBar'
import { AnimatedButton } from '@/components/ui/animated-button'

// ── Design tokens ────────────────────────────────────────────
const TEXT        = 'hsl(0, 0%, 5%)'
const TEXT_MUTED  = 'hsl(0, 0%, 44%)'
const BORDER      = 'rgba(0,0,0,0.07)'
const BORDER_EDGE = 'rgba(0,0,0,0.13)'
const ACCENT      = 'hsl(160, 84%, 16%)'
const ACCENT_DARK = 'hsl(160, 84%, 12%)'
const RADIUS      = 6

// ── Nieuwblik logo ───────────────────────────────────────────

function NieuwblikLogo({ className }: { className?: string }) {
  return (
    <img
      src={logo}
      alt="Nieuwblik"
      width={120}
      height={30}
      fetchPriority="high"
      className={`h-auto brightness-0 ${className ?? ''}`}
    />
  )
}

// ── Nav link with animated accent underline ──────────────────

function NavLink({
  children, hasDropdown = false, isOpen = false, isActive = false, isHovered = false,
}: {
  children: React.ReactNode
  hasDropdown?: boolean
  isOpen?: boolean
  isActive?: boolean
  isHovered?: boolean
}) {
  const lit = isHovered || isOpen || isActive
  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', padding: '0 2px', cursor: 'pointer' }}>
      <span className="text-[13px] xl:text-[14px]" style={{
        display: 'flex', alignItems: 'center', gap: 3,
        color: isActive ? TEXT : TEXT_MUTED,
        fontWeight: isActive ? 500 : 400,
        lineHeight: 1, userSelect: 'none', transition: 'color 150ms',
      }}>
        {children}
        {hasDropdown && (
          <ChevronDown size={13} strokeWidth={2} style={{
            opacity: 0.4,
            transition: 'transform 200ms',
            transform: isOpen ? 'rotate(180deg)' : 'none',
          }} />
        )}
      </span>
      <span style={{
        position: 'absolute', bottom: -1, left: '5%', right: '5%',
        height: lit ? 3 : 0,
        background: ACCENT,
        borderRadius: '2px 2px 0 0',
        transition: 'height 340ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        display: 'block',
      }} />
    </div>
  )
}

// ── Slide-up text hover ──────────────────────────────────────

function SlideText({ children }: { children: React.ReactNode }) {
  return (
    <span className="slide-text">
      <span className="slide-orig">{children}</span>
      <span className="slide-clone" aria-hidden>{children}</span>
    </span>
  )
}

// ── Services data ────────────────────────────────────────────

const serviceItems = [
  { name: 'Website op maat', path: '/diensten/website-op-maat', icon: Globe,         description: 'Luxe websites & digitale architectuur' },
  { name: 'Webshops',        path: '/diensten/webshops',        icon: ShoppingCart,  description: 'E-commerce die verkoopt'               },
  { name: 'E-commerce',      path: '/diensten/e-commerce',      icon: TrendingUp,    description: 'Groei & marketplace oplossingen'        },
]

const listContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
}
const listItem = {
  hidden: { opacity: 0, x: -10 },
  show:   { opacity: 1, x: 0   },
}

// ── Diensten mega dropdown ───────────────────────────────────

function DienstenDropdown({ onNavigate }: { onNavigate: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0  }}
      exit={{    opacity: 0, y: -4 }}
      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'absolute', top: '100%', left: 0, right: 0,
        backgroundColor: 'hsl(0 0% 100%)',
        borderTop:    `1px solid ${BORDER_EDGE}`,
        borderBottom: `1px solid ${BORDER_EDGE}`,
        boxShadow: '0 14px 44px rgba(0,0,0,0.09)',
        clipPath: 'inset(0 -60px -60px -60px)',
        zIndex: 60,
      }}
    >
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '0 44px',
        display: 'grid', gridTemplateColumns: '1fr 300px',
        minHeight: '28vh', gap: 48,
      }}>

        {/* Left — service list */}
        <div style={{ padding: '36px 0' }}>
          <motion.div variants={listContainer} initial="hidden" animate="show">
            {serviceItems.map(({ name, path, icon: Icon, description }) => (
              <motion.div key={path} variants={listItem} transition={{ duration: 0.22, ease: 'easeOut' }}>
                <Link
                  to={path}
                  onClick={onNavigate}
                  className="slide-group"
                  style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 0', borderBottom: `1px solid ${BORDER}`, textDecoration: 'none' }}
                >
                  <div className="nav-icon-bg" style={{
                    width: 40, height: 40, borderRadius: 8, flexShrink: 0,
                    backgroundColor: 'hsl(160 84% 16% / 0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={18} color={ACCENT} className="nav-icon-svg" />
                  </div>
                  <div className="nav-text-block">
                    <div style={{ fontSize: 16, fontWeight: 500, color: TEXT, lineHeight: 1.2 }}>
                      <SlideText>{name}</SlideText>
                    </div>
                    <div style={{ fontSize: 13, color: TEXT_MUTED, marginTop: 3 }}>{description}</div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: serviceItems.length * 0.05 + 0.05, duration: 0.22, ease: 'easeOut' }}
            style={{ marginTop: 12 }}
          >
            <Link to="/diensten" onClick={onNavigate} className="slide-group" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 0', fontSize: 14, fontWeight: 400, textDecoration: 'none', color: TEXT_MUTED }}>
              <SlideText>Bekijk alle diensten</SlideText>
              <span style={{ opacity: 0.45, color: TEXT, fontSize: 13 }}>→</span>
            </Link>
          </motion.div>
        </div>

        {/* Right — CTA card */}
        <div style={{ padding: '36px 0' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.94, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1,    filter: 'blur(0px)'  }}
            transition={{ delay: 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              height: '100%', borderRadius: 12, backgroundColor: ACCENT_DARK,
              padding: 28, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            }}
          >
            <div>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                style={{ fontSize: 20, fontWeight: 400, color: 'white', lineHeight: 1.35, margin: '0 0 10px' }}
              >
                Klaar voor een website die resultaten levert?
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.65, margin: 0 }}
              >
                Van strategie tot live in weken. Vraag vrijblijvend een gesprek aan.
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 16, marginTop: 20 }}
            >
              <Link to="/start-je-project" onClick={onNavigate} className="slide-group" style={{ textDecoration: 'none' }}>
                <motion.span
                  whileHover={{ x: 4 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 500, color: 'white' }}
                >
                  <SlideText>Start je project</SlideText>
                  <span style={{ opacity: 0.6, fontSize: 13 }}>→</span>
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

// ── Nav links config ─────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Home',     path: '/'         },
  { label: 'Diensten', path: '/diensten', dropdown: true },
  { label: 'Portfolio',path: '/portfolio' },
  { label: 'Over Ons', path: '/over-ons' },
  { label: 'Blog',     path: '/blog'      },
  { label: 'Contact',  path: '/contact'   },
]

// ── Component ────────────────────────────────────────────────

const Navigation = () => {
  const [open,             setOpen]             = useState<string | null>(null)
  const [hoveredLink,      setHoveredLink]      = useState<string | null>(null)
  const [mobileOpen,       setMobileOpen]       = useState(false)
  const [mobileServices,   setMobileServices]   = useState(false)
  const [isScrolled,       setIsScrolled]       = useState(false)
  const location       = useLocation()
  const shouldReduceMotion = useReducedMotion()
  const navRef         = useRef<HTMLElement>(null)
  const timer          = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Measure and expose header height as CSS var
  useEffect(() => {
    const update = () => {
      if (navRef.current) {
        document.documentElement.style.setProperty('--header-height', `${navRef.current.offsetHeight}px`)
      }
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close on route change
  useEffect(() => {
    setMobileOpen(false)
    setMobileServices(false)
    setOpen(null)
  }, [location.pathname])

  // Close dropdown on outside click
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!document.querySelector('[data-nieuwblik-nav]')?.contains(e.target as Node)) setOpen(null)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  function show(label: string) {
    if (timer.current) clearTimeout(timer.current)
    setOpen(label === 'Diensten' ? label : null)
  }
  function hide() {
    timer.current = setTimeout(() => setOpen(null), 150)
  }

  function isActive(path: string) {
    return path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)
  }

  return (
    <>
      <ReviewBar isScrolled={isScrolled} />

      <style>{`
        .slide-text  { display: inline-flex; flex-direction: column; overflow: hidden; height: 1.2em; vertical-align: bottom; }
        .slide-orig,
        .slide-clone { display: block; transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1); line-height: 1.2; }
        .slide-clone { color: inherit; }
        .slide-text:hover .slide-orig,
        .slide-text:hover .slide-clone,
        .slide-group:hover .slide-orig,
        .slide-group:hover .slide-clone { transform: translateY(-100%); }

        .nav-icon-svg { transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1); transform-origin: center; }
        .slide-group:hover .nav-icon-svg { transform: rotate(12deg) scale(1.2); }

        .nav-icon-bg { transition: background-color 0.22s ease; }
        .slide-group:hover .nav-icon-bg { background-color: hsl(160 84% 16% / 0.16) !important; }

        .nav-text-block { transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
        .slide-group:hover .nav-text-block { transform: translateX(3px); }
      `}</style>

      <motion.nav
        ref={navRef}
        data-nieuwblik-nav=""
        onMouseLeave={hide}
        style={{
          backgroundColor: 'hsl(0 0% 100%)',
          position: 'fixed', left: 0, right: 0, zIndex: 50,
          borderBottom: `1px solid ${BORDER_EDGE}`,
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
        animate={{ top: isScrolled ? 0 : 40 }}
        transition={{ duration: shouldReduceMotion ? 0.1 : 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        <div
          className="flex items-stretch relative w-full mx-auto h-[60px] md:h-[68px] xl:h-[72px] px-5 md:px-8 xl:px-[44px]"
          style={{ maxWidth: 1280 }}
        >

          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0 mr-6 xl:mr-10" style={{ textDecoration: 'none' }}>
            <motion.div
              whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <NieuwblikLogo className="w-[96px] md:w-[110px] xl:w-[120px]" />
            </motion.div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-stretch gap-4 xl:gap-6">
            {NAV_LINKS.map(({ label, path, dropdown }) => (
              <div
                key={label}
                style={{ display: 'flex' }}
                onMouseEnter={() => { show(label); setHoveredLink(label) }}
                onMouseLeave={() => setHoveredLink(null)}
              >
                {dropdown ? (
                  <NavLink
                    hasDropdown
                    isOpen={open === label}
                    isActive={isActive(path)}
                    isHovered={hoveredLink === label}
                  >
                    {label}
                  </NavLink>
                ) : (
                  <Link to={path} style={{ textDecoration: 'none', display: 'flex' }}>
                    <NavLink isActive={isActive(path)} isHovered={hoveredLink === label}>
                      {label}
                    </NavLink>
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div style={{ flex: 1 }} />

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            <AnimatedButton to="/start-je-project" size="default">
              Start je project
            </AnimatedButton>
          </div>

          {/* Mobile toggle */}
          <div className="flex md:hidden items-center gap-2">
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.button
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0,   opacity: 1 }}
                  exit={{    rotate:  90, opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  whileTap={{ scale: 0.88 }}
                  onClick={() => setMobileOpen(false)}
                  aria-label="Menu sluiten"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: TEXT, padding: 6, display: 'flex' }}
                >
                  <X size={22} strokeWidth={1.75} />
                </motion.button>
              ) : (
                <motion.button
                  key="open"
                  initial={{ rotate:  90, opacity: 0 }}
                  animate={{ rotate: 0,   opacity: 1 }}
                  exit={{    rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  whileTap={{ scale: 0.88 }}
                  onClick={() => { setMobileOpen(true); setMobileServices(false) }}
                  aria-label="Menu openen"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: TEXT, padding: 6, display: 'flex' }}
                >
                  <Menu size={22} strokeWidth={1.75} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Desktop dropdown */}
        <AnimatePresence>
          {open === 'Diensten' && (
            <DienstenDropdown key="diensten" onNavigate={() => setOpen(null)} />
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0   }}
            exit={{    opacity: 0, y: -16 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-0 right-0 bottom-0 md:hidden"
            style={{
              top: isScrolled
                ? 'var(--header-height)'
                : 'calc(var(--header-height) + var(--review-bar-height))',
              backgroundColor: 'hsl(0 0% 100%)',
              borderTop: `1px solid ${BORDER_EDGE}`,
              zIndex: 49,
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
            }}
          >
            {NAV_LINKS.map(({ label, path, dropdown }, i) => {
              const expanded = dropdown && mobileServices
              return (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
                  transition={{ delay: 0.04 + i * 0.055, duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                  style={{ borderBottom: `1px solid ${BORDER_EDGE}` }}
                >
                  {dropdown ? (
                    <>
                      <button
                        onClick={() => setMobileServices(v => !v)}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          width: '100%', padding: '18px 24px',
                          background: 'none', border: 'none', cursor: 'pointer',
                          fontSize: 28, fontWeight: 400, color: TEXT, lineHeight: 1,
                          textAlign: 'left',
                        }}
                      >
                        {label}
                        <motion.span
                          animate={{ rotate: expanded ? 90 : 0 }}
                          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                          style={{ display: 'flex', color: TEXT_MUTED, flexShrink: 0 }}
                        >
                          <ChevronRight size={20} strokeWidth={1.5} />
                        </motion.span>
                      </button>
                      <AnimatePresence>
                        {expanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{    height: 0, opacity: 0 }}
                            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                            style={{ overflow: 'hidden' }}
                          >
                            {serviceItems.map(({ name, path: sPath, icon: Icon }, j) => (
                              <motion.div
                                key={sPath}
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: j * 0.045, duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                              >
                                <Link
                                  to={sPath}
                                  style={{
                                    display: 'flex', alignItems: 'center', gap: 12,
                                    padding: '14px 24px 14px 44px',
                                    borderTop: `1px solid ${BORDER}`,
                                    textDecoration: 'none', color: TEXT_MUTED, fontSize: 16,
                                  }}
                                >
                                  <Icon size={16} />
                                  {name}
                                </Link>
                              </motion.div>
                            ))}
                            <Link
                              to="/diensten"
                              style={{
                                display: 'flex', alignItems: 'center', gap: 6,
                                padding: '14px 24px 14px 44px',
                                borderTop: `1px solid ${BORDER}`,
                                textDecoration: 'none', color: ACCENT, fontSize: 14, fontWeight: 500,
                              }}
                            >
                              Bekijk alle diensten →
                            </Link>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      to={path}
                      style={{
                        display: 'block', padding: '18px 24px',
                        fontSize: 28, fontWeight: 400, lineHeight: 1,
                        textDecoration: 'none',
                        color: isActive(path) ? ACCENT : TEXT,
                      }}
                    >
                      {label}
                    </Link>
                  )}
                </motion.div>
              )
            })}

            {/* Mobile CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: NAV_LINKS.length * 0.055 + 0.04, duration: 0.3 }}
              style={{ padding: 24, marginTop: 'auto' }}
            >
              <AnimatedButton
                to="/start-je-project"
                className="w-full"
                onClick={() => setMobileOpen(false)}
              >
                Start je project
              </AnimatedButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navigation
