import { useEffect, useRef, type ReactNode } from "react";
import { Link } from "@/lib/router-compat";
import Reveal from "@/components/Reveal";
import { AnimatedButton } from "@/components/ui/animated-button";
import { useDarkNavSection } from "@/components/UnderlayNav";
import { useReducedMotion } from "@/lib/reduced-motion";
import logo from "@/assets/logo.webp";
import studio960 from "@/assets/footer/footer-studio-960.webp";
import studio1600 from "@/assets/footer/footer-studio-1600.webp";
import studio2560 from "@/assets/footer/footer-studio-2560.webp";
import { companyInfo } from "@/config/company";
import { LEVERTIJD, PRIJZEN, REVIEWS, euroTeken } from "@/config/business";

/*
 * Footer in twee delen, naar het voorbeeld van Interieurstudio Laan:
 *  - bovenaan een afsluitende call-to-action op een schermbrede sfeerfoto
 *    (avondstudio aan de haven, Higgsfield) die via een verloop overloopt in
 *    het groen van de footer;
 *  - daaronder het logo met omschrijving en rustige linkkolommen, de
 *    werkgebied- en branchelinks (voor de interne links naar de
 *    landingspagina's) en de juridische regel.
 * Op de homepage staat de foto-CTA uit (cta={false}): daar sluit de
 * WhatsApp-sectie de pagina al af.
 */

const GROEN = "hsl(160 84% 12%)";
const GROEN_LICHT = "hsl(160 70% 58%)";
const TELEFOON = `tel:${companyInfo.phone.replace(/\s/g, "")}`;

const NAVIGATIE = [
  { label: "Diensten", to: "/diensten" },
  { label: "Prijzen", to: "/prijzen" },
  { label: "Portfolio", to: "/portfolio" },
  { label: "Over ons", to: "/over-ons" },
  { label: "Reviews", to: "/reviews" },
  { label: "Blog", to: "/blog" },
  { label: "Contact", to: "/contact" },
  { label: "Gratis website-analyse", to: "/gratis-website-analyse" },
];

const DIENSTEN = [
  { label: "Website laten maken", to: "/website-laten-maken" },
  { label: "Website op maat", to: "/diensten/website-op-maat" },
  { label: "Webdesign bureau", to: "/webdesign-bureau" },
  { label: "Webshops", to: "/diensten/webshops" },
  { label: "E-commerce", to: "/diensten/e-commerce" },
  { label: "Website laten maken Enkhuizen", to: "/" },
  { label: "SEO Enkhuizen", to: "/seo-enkhuizen" },
];

const VOLG = [
  { label: "LinkedIn", href: companyInfo.social.linkedin },
  { label: "WhatsApp", href: companyInfo.whatsapp },
  { label: "Google-reviews", href: REVIEWS.profielUrl },
];

// Werkgebied en branches compact: de regiopagina's linken samen naar alle
// stadspagina's, /website-laten-maken#branches naar alle branchepagina's.
// Zo blijft elke landingspagina via een passende overzichtspagina vindbaar,
// zonder een blok van zestig links onder elke pagina.
const REGIO = [
  { label: "Noord-Holland", to: "/regio/noord-holland" },
  { label: "Randstad", to: "/regio/randstad" },
  { label: "Oost-Nederland", to: "/regio/oost-nederland" },
  { label: "Zuid-Nederland", to: "/regio/zuid-nederland" },
  { label: "Noord-Nederland", to: "/regio/noord-nederland" },
  { label: "Alle plaatsen →", to: "/werkgebied" },
];

const BRANCHES = [
  { label: "Kapper", to: "/website-laten-maken-kapper" },
  { label: "Restaurant", to: "/website-laten-maken-restaurant" },
  { label: "Bouwbedrijf", to: "/website-laten-maken-bouwbedrijf" },
  { label: "Fysiotherapeut", to: "/website-laten-maken-fysiotherapeut" },
  { label: "Advocaat", to: "/website-laten-maken-advocaat" },
  { label: "Alle branches →", to: "/website-laten-maken#branches" },
];

const JURIDISCH = [
  { label: "Privacy", to: "/privacy" },
  { label: "Cookies", to: "/cookies" },
  { label: "Algemene voorwaarden", to: "/algemene-voorwaarden" },
];

const LINK = "transition-colors duration-200 hover:text-white";

function Kolom({
  titel,
  className,
  children,
}: {
  titel: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <h2 className="mb-5 text-sm font-normal text-white/60">{titel}</h2>
      <ul className="space-y-3 text-[0.9375rem] text-white/85">{children}</ul>
    </div>
  );
}

/** Linkrij voor de werkgebied- en branchepagina's: klein en rustig. */
function LinkRij({ titel, children }: { titel: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-6">
      <h2 className="shrink-0 text-sm font-normal text-white/60 sm:w-28">
        {titel}
      </h2>
      <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-[0.8125rem] text-white/55">
        {children}
      </ul>
    </div>
  );
}

/**
 * Foto die iets trager meeschuift dan de pagina. Eén scroll-listener die
 * alleen een transform zet, en alleen zolang de sectie in beeld is.
 */
function useParallax() {
  const sectieRef = useRef<HTMLElement | null>(null);
  const fotoRef = useRef<HTMLImageElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const sectie = sectieRef.current;
    const foto = fotoRef.current;
    if (!sectie || !foto || reduced) return;

    let frame = 0;
    let inBeeld = false;
    const zet = () => {
      frame = 0;
      const r = sectie.getBoundingClientRect();
      const vh = window.innerHeight;
      // -1 als de sectie net onderin binnenkomt, 1 als hij bovenin verdwijnt.
      const p = Math.max(
        -1,
        Math.min(1, (vh / 2 - (r.top + r.height / 2)) / ((vh + r.height) / 2)),
      );
      foto.style.transform = `translate3d(0, ${(p * 8).toFixed(2)}%, 0)`;
    };
    const onScroll = () => {
      if (inBeeld && !frame) frame = requestAnimationFrame(zet);
    };
    const io = new IntersectionObserver(([e]) => {
      inBeeld = !!e?.isIntersecting;
      if (inBeeld) onScroll();
    });
    io.observe(sectie);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced]);

  return { sectieRef, fotoRef };
}

function FooterCta() {
  const { sectieRef, fotoRef } = useParallax();
  return (
    <section
      ref={sectieRef}
      aria-labelledby="footer-cta-kop"
      className="relative isolate overflow-hidden"
    >
      <img
        ref={fotoRef}
        src={studio1600}
        srcSet={`${studio960} 960w, ${studio1600} 1600w, ${studio2560} 2560w`}
        sizes="100vw"
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-x-0 -top-[10%] -z-10 h-[120%] w-full object-cover will-change-transform"
        style={{ objectPosition: "50% 50%" }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background: `linear-gradient(180deg, hsl(160 60% 4% / 0.55) 0%, hsl(160 60% 4% / 0.45) 55%, ${GROEN} 100%)`,
        }}
      />
      <div className="container mx-auto px-6 py-[clamp(7rem,4rem+12vw,15rem)] text-center">
        <Reveal>
          <h2
            id="footer-cta-kop"
            className="mx-auto max-w-3xl font-bold tracking-tight text-white"
            style={{
              fontSize: "clamp(2.4rem, 1.2rem + 4.6vw, 5rem)",
              lineHeight: 1.02,
            }}
          >
            Klaar om <span style={{ color: GROEN_LICHT }}>gevonden</span> te
            worden?
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-white/80 md:text-lg">
            Een website op maat die klanten oplevert. Vanaf{" "}
            {euroTeken(PRIJZEN.starter)}, binnen {LEVERTIJD.standaard} online,
            met persoonlijk contact vanuit {companyInfo.address.city}.
          </p>
        </Reveal>
        <Reveal
          delay={0.16}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <AnimatedButton to="/contact" size="lg" variant="white">
            Start je project
          </AnimatedButton>
          <AnimatedButton href={TELEFOON} size="lg" variant="outlineWhite">
            Bel {companyInfo.phone}
          </AnimatedButton>
        </Reveal>
      </div>
    </section>
  );
}

const Footer = ({ cta = true }: { cta?: boolean }) => {
  // Donkere achtergrond: de vaste header schakelt naar licht zolang dit eronder zit.
  const darkRef = useDarkNavSection<HTMLElement>();
  const jaar = new Date().getFullYear();
  const { address } = companyInfo;

  return (
    <footer
      ref={darkRef}
      className="relative overflow-hidden text-white"
      style={{ background: GROEN }}
    >
      {cta && <FooterCta />}

      <div className="container mx-auto px-6 md:px-12">
        <div
          className={`grid grid-cols-2 gap-x-6 gap-y-12 py-16 md:py-20 lg:grid-cols-12 lg:gap-8 ${cta ? "" : "border-t border-white/10"}`}
        >
          <div className="col-span-2 lg:col-span-4">
            <Link
              to="/"
              aria-label="Nieuwblik, naar de homepage"
              className="inline-block"
            >
              <img
                src={logo}
                alt="Nieuwblik"
                width={400}
                height={113}
                loading="lazy"
                className="h-auto w-44 brightness-0 invert"
              />
            </Link>
            <p className="mt-7 max-w-sm text-[0.9375rem] leading-relaxed text-white/65">
              Webdesign bureau dat strategie en design combineert tot meetbaar
              resultaat. Geen templates, elk project op maat gebouwd.
            </p>
          </div>

          <nav aria-label="Footer" className="contents">
            <Kolom titel="Navigatie" className="lg:col-span-2">
              {NAVIGATIE.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className={LINK}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </Kolom>
            <Kolom titel="Diensten" className="lg:col-span-2">
              {DIENSTEN.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className={LINK}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </Kolom>
          </nav>

          <Kolom titel="Contact" className="lg:col-span-2">
            <li>
              <a href={TELEFOON} className={LINK}>
                {companyInfo.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${companyInfo.email}`}
                className={`${LINK} [overflow-wrap:anywhere]`}
              >
                {companyInfo.email}
              </a>
            </li>
            <li>
              <a
                href={address.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${LINK} leading-relaxed`}
              >
                {address.street}
                <br />
                {address.postalCode} {address.city}
              </a>
            </li>
          </Kolom>

          <Kolom titel="Volg" className="lg:col-span-2">
            {VOLG.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${s.label} (opent in nieuw venster)`}
                  className={LINK}
                >
                  {s.label}
                </a>
              </li>
            ))}
          </Kolom>
        </div>

        {/* Werkgebied en branches: twee korte regels. */}
        <div className="space-y-4 border-t border-white/10 py-8">
          <LinkRij titel="Werkgebied">
            {REGIO.map((r) => (
              <li key={r.to}>
                <Link to={r.to} className={LINK}>
                  {r.label}
                </Link>
              </li>
            ))}
          </LinkRij>
          <LinkRij titel="Branches">
            {BRANCHES.map((b) => (
              <li key={b.to}>
                <Link to={b.to} className={LINK}>
                  {b.label}
                </Link>
              </li>
            ))}
          </LinkRij>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/10 py-5 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
          <p>
            © {jaar} {companyInfo.name} · KvK {companyInfo.kvk}
          </p>
          <ul className="flex flex-wrap items-center gap-x-6">
            {JURIDISCH.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className={`${LINK} inline-flex min-h-11 items-center`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
