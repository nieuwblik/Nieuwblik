import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useDarkNavSection } from "@/components/UnderlayNav";

// ── Brand tokens (Nieuwblik) ───────────────────────────────────
const WHITE        = "#ffffff";
const GREEN        = "hsl(160, 84%, 16%)";
const GREEN_LIGHT  = "hsl(160, 70%, 58%)";
const EASE = [0.22, 1, 0.36, 1] as const;

// ── Breakpoint hook ────────────────────────────────────────────
function useBreakpoint() {
  const get = (): "mobile" | "tablet" | "desktop" =>
    typeof window === "undefined" ? "desktop"
      : window.innerWidth < 768 ? "mobile"
      : window.innerWidth < 1024 ? "tablet"
      : "desktop";
  const [bp, setBp] = useState(get);
  useEffect(() => {
    const handler = () => setBp(get());
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return bp;
}

// ── Pricing data (Nieuwblik packages) ──────────────────────────
const PRICING = [
  {
    name: "Starter",
    description: "Voor zzp en kleine ondernemers",
    price: "990",
    period: "per website",
    cta: "Vraag offerte aan",
    highlighted: false,
    features: [
      "1 tot 5 pagina's",
      "Volledig responsive design",
      "Basis SEO en snelheidsoptimalisatie",
      "Contactformulier en Google Maps",
      "Live binnen 2 weken",
    ],
  },
  {
    name: "Professional",
    description: "Onze meest gekozen oplossing",
    price: "1990",
    period: "per website",
    cta: "Vraag offerte aan",
    highlighted: true,
    features: [
      "Tot 10 pagina's op maat",
      "Uitgebreide SEO en blogfunctie",
      "Koppelingen met externe tools",
      "30 dagen gratis nazorg",
    ],
  },
  {
    name: "Op maat",
    description: "Webshops en complexe projecten",
    price: null,
    period: "op aanvraag",
    cta: "Plan een gesprek",
    highlighted: false,
    features: [
      "Onbeperkt pagina's en functies",
      "CMS, beheer alles zelf",
      "Webshop met betaalkoppelingen",
      "Maatwerk integraties en API's",
      "Persoonlijke strategie en advies",
      "Doorlopende ondersteuning",
    ],
  },
];

// ── Section frame lines ────────────────────────────────────────
function SectionFrame() {
  const bp = useBreakpoint();
  if (bp === "mobile") return null;
  return (
    <>
      <div style={{ position: "absolute", left: 40, top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.10)", zIndex: 3, pointerEvents: "none" }} />
      <div style={{ position: "absolute", right: 40, top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.10)", zIndex: 3, pointerEvents: "none" }} />
    </>
  );
}

const PricingPackages = () => {
  const bp = useBreakpoint();
  const isMobile = bp === "mobile";
  const isTablet = bp === "tablet";
  // Dark background: tell the fixed header to invert while this is under it.
  const darkRef = useDarkNavSection<HTMLElement>();
  const PAD_X = isMobile ? 24 : isTablet ? 64 : 96;
  const reduce = useReducedMotion();

  // Card box + inner content stagger
  const cardVar = {
    hidden: { opacity: 0, y: reduce ? 0 : 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE, staggerChildren: 0.07, delayChildren: 0.12 } },
  };
  const itemVar = {
    hidden: { opacity: 0, y: reduce ? 0 : 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
  };

  return (
    <section
      ref={darkRef}
      style={{
        position: "relative",
        padding: isMobile ? "96px 0" : "140px 0",
        fontFamily: "inherit",
        background: `
          radial-gradient(ellipse 55% 60% at 50% 22%, hsl(160 84% 32% / 0.28) 0%, transparent 62%),
          radial-gradient(ellipse 70% 40% at 50% 100%, hsl(160 84% 22% / 0.22) 0%, transparent 60%),
          hsl(160 84% 9%)
        `,
        borderTop: "1px solid hsl(160 70% 58% / 0.10)",
      }}
    >
      <style>{`
        .np-btn-primary { transition: transform 0.2s cubic-bezier(0.25,0.1,0.25,1), box-shadow 0.2s ease, filter 0.2s ease; will-change: transform; }
        .np-btn-primary:hover { transform: translateY(-2px); filter: brightness(1.04); box-shadow: 0 14px 34px rgba(0,0,0,0.35) !important; }
        .np-btn-primary:active { transform: translateY(0); }
        .np-btn-ghost { transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s cubic-bezier(0.25,0.1,0.25,1); will-change: transform; }
        .np-btn-ghost:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.7); transform: translateY(-2px); }
        .np-btn-ghost:active { transform: translateY(0); }
      `}</style>

      <SectionFrame />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: `0 ${PAD_X}px`, position: "relative", zIndex: 2 }}>
        {/* Heading block */}
        <div style={{ textAlign: "center", marginBottom: isMobile ? 56 : 88 }}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
            viewport={{ once: true, margin: "-80px" }}
            style={{ marginBottom: 24 }}
          >
            <span className="sw-mono" style={{ color: GREEN_LIGHT }}>Tarieven</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: reduce ? 0 : 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            viewport={{ once: true, amount: 0.1 }}
            style={{
              fontWeight: 700,
              fontSize: "clamp(2.25rem, 4.2vw, 3.5rem)",
              color: WHITE, letterSpacing: "-0.02em",
              lineHeight: 1.1, margin: 0,
              paddingBottom: 4,
            }}
          >
            Pakketten die passen bij jouw groei
          </motion.h2>


          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            viewport={{ once: true, margin: "-100px" }}
            style={{
              fontSize: isMobile ? 15 : 18, fontWeight: 300,
              color: "rgba(255,255,255,0.6)", lineHeight: 1.7,
              margin: "26px auto 0", maxWidth: 540,
            }}
          >
            Vaste vanaf-prijzen, geen verrassingen achteraf. Kies wat past en wij doen de rest.
          </motion.p>
        </div>

        {/* Tier grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }}
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: isMobile ? 20 : 24,
            alignItems: "stretch",
          }}
        >
          {PRICING.map((tier) => {
            const oldPrice = tier.price ? Math.round(Number(tier.price) / 0.75 / 10) * 10 : null;
            return (
            <motion.div
              key={tier.name}
              variants={cardVar}
              style={{
                position: "relative",
                background: tier.highlighted
                  ? `radial-gradient(ellipse 100% 80% at 50% 0%, hsl(160 70% 45% / 0.20) 0%, transparent 60%),
                     linear-gradient(165deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.02) 100%)`
                  : "linear-gradient(165deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
                border: tier.highlighted
                  ? `1px solid ${GREEN_LIGHT}66`
                  : "1px solid rgba(255,255,255,0.09)",
                borderRadius: 16,
                padding: isMobile ? 32 : 40,
                display: "flex", flexDirection: "column",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                boxShadow: tier.highlighted ? `0 24px 60px -24px rgba(0,0,0,0.6)` : "none",
              }}
            >
              {tier.highlighted && (
                <div
                  className="sw-mono"
                  style={{
                    position: "absolute", top: -1, right: 24,
                    background: GREEN_LIGHT, color: GREEN,
                    padding: "7px 12px", borderRadius: "0 0 8px 8px",
                    fontSize: "0.62rem", letterSpacing: "0.16em",
                  }}
                >
                  Meest gekozen
                </div>
              )}

              <motion.div variants={itemVar} className="sw-mono" style={{ color: tier.highlighted ? GREEN_LIGHT : "rgba(255,255,255,0.65)", marginBottom: 12 }}>
                {tier.name}
              </motion.div>

              <motion.div variants={itemVar} style={{ fontSize: 13, fontWeight: 300, color: "rgba(255,255,255,0.5)", marginBottom: 28 }}>
                {tier.description}
              </motion.div>

              {/* Old price + discount */}
              {tier.price && (
                <motion.div variants={itemVar} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 17, fontWeight: 400, color: "rgba(255,255,255,0.4)", textDecoration: "line-through" }}>
                    €{oldPrice}
                  </span>
                  <span className="sw-mono" style={{ background: GREEN_LIGHT, color: GREEN, padding: "3px 7px", borderRadius: 6, fontSize: "0.58rem", letterSpacing: "0.12em" }}>
                    25% korting
                  </span>
                </motion.div>
              )}

              {/* Price */}
              <motion.div variants={itemVar} style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
                {tier.price ? (
                  <>
                    <span className="sw-mono" style={{ color: "rgba(255,255,255,0.5)" }}>vanaf</span>
                    <span style={{ fontSize: 22, fontWeight: 500, color: tier.highlighted ? GREEN_LIGHT : "rgba(255,255,255,0.6)" }}>€</span>
                    <span style={{ fontWeight: 700, fontSize: "clamp(2.5rem, 4vw, 3.5rem)", color: WHITE, letterSpacing: "-0.02em", lineHeight: 1 }}>
                      {tier.price}
                    </span>
                  </>
                ) : (
                  <span style={{ fontWeight: 700, fontSize: "clamp(1.75rem, 3vw, 2.5rem)", color: WHITE, letterSpacing: "-0.02em", lineHeight: 1 }}>
                    Op aanvraag
                  </span>
                )}
              </motion.div>

              <motion.div variants={itemVar} style={{ fontSize: 13, fontWeight: 300, color: "rgba(255,255,255,0.5)", marginBottom: 32 }}>
                {tier.period}
              </motion.div>

              <motion.div variants={itemVar} style={{ height: 1, background: "rgba(255,255,255,0.10)", marginBottom: 26 }} />

              <motion.ul
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
                style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14, flex: 1 }}
              >
                {tier.features.map((f) => (
                  <motion.li key={f} variants={itemVar} style={{ display: "flex", alignItems: "flex-start", gap: 12, fontSize: 14, fontWeight: 300, color: "rgba(255,255,255,0.78)", lineHeight: 1.5 }}>
                    <Check className="w-4 h-4 shrink-0" style={{ marginTop: 2, color: tier.highlighted ? GREEN_LIGHT : "rgba(255,255,255,0.55)" }} strokeWidth={2.4} />
                    {f}
                  </motion.li>
                ))}
              </motion.ul>

              <motion.div variants={itemVar} style={{ marginTop: 40 }}>
                <Link
                  to="/start-je-project"
                  className={tier.highlighted ? "np-btn-primary" : "np-btn-ghost"}
                  style={{
                    display: "block", textAlign: "center",
                    background: tier.highlighted ? WHITE : "transparent",
                    color: tier.highlighted ? GREEN : WHITE,
                    fontSize: 14, fontWeight: 600,
                    padding: "13px 24px",
                    border: tier.highlighted ? "none" : "1px solid rgba(255,255,255,0.3)",
                    borderRadius: 10, textDecoration: "none",
                  }}
                >
                  {tier.cta}
                </Link>
              </motion.div>
            </motion.div>
            );
          })}
        </motion.div>

        <p style={{ textAlign: "center", marginTop: 36, fontSize: 13, fontWeight: 300, color: "rgba(255,255,255,0.45)" }}>
          Alle prijzen exclusief btw · Hosting en domein optioneel
        </p>
      </div>
    </section>
  );
};

export default PricingPackages;
