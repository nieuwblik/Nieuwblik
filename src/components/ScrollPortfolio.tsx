import { Link } from "react-router-dom";
import gsap from "gsap";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import quantumRehabImg from "@/assets/quantum-rehab.webp";
import prideMobilityImg from "@/assets/pride-mobility.webp";
import puurInHarmonieImg from "@/assets/puurinharmonie.webp";
import benotedImg from "@/assets/benoted.webp";
import daniqueKwakmanImg from "@/assets/daniquekwakman.webp";
import esveldInstallatieImg from "@/assets/esveldinstallatie.webp";
import ericaVanDijkImg from "@/assets/ericavandijk.webp";
import kyodaiOriginalsImg from "@/assets/kyodai-originals.webp";

// ── Brand tokens ───────────────────────────────────────────────
const ACCENT = "hsl(160, 84%, 16%)";
const R2 = "https://pub-db1d62b400114ea6902679b432e6b4c7.r2.dev/nieuwblik-portfolio";

// ── Portfolio data (real Nieuwblik projects) ───────────────────
// `duration` values are placeholders — adjust to the real doorlooptijd.
const ITEMS = [
  { title: "Quantum Rehab Europe", category: "Revalidatietechnologie",  duration: "6 weken", image: quantumRehabImg,     slug: "quantum-rehab-europe",  url: "https://quantumrehab.eu" },
  { title: "Pride Mobility Europe", category: "Mobiliteit & Healthcare", duration: "5 weken", image: prideMobilityImg,    slug: "pride-mobility-europe", url: "https://www.pridemobility.eu" },
  { title: "Puur in Harmonie",      category: "Holistische Salon",       duration: "4 weken", image: puurInHarmonieImg,   slug: "puur-in-harmonie",      url: "https://www.puurinharmonie.nl" },
  { title: "BeNoted",               category: "Financiële Marketing",    duration: "4 weken", image: benotedImg,          slug: "benoted",               url: "https://benoted.nl" },
  { title: "Danique Kwakman",       category: "Orthomoleculaire Therapie", duration: "4 weken", image: daniqueKwakmanImg, slug: "danique-kwakman",       url: "https://daniquekwakman.nl" },
  { title: "Esveld Installatie",    category: "Installatiediensten",     duration: "4 weken", image: esveldInstallatieImg, slug: "esveld-installatie",   url: "https://esveldinstallatie.nl" },
  { title: "Erica van Dijk",        category: "HR Interim & Advies",     duration: "3 weken", image: ericaVanDijkImg,      slug: "erica-van-dijk",        url: "https://ericavandijk.nl" },
  { title: "Kyodai Originals",      category: "Japanse Kunst & Antiek",  duration: "5 weken", image: kyodaiOriginalsImg,   slug: "kyodai-originals",      url: "https://www.kyodaioriginals.nl" },
];

const EASE = [0.25, 0.1, 0.25, 1] as const;

const ScrollPortfolio = () => {
  const shouldReduceMotion = useReducedMotion();

  // "Text roll" (reused for project titles and the CTA button): the two
  // stacked copies inside .pf-mask slide up one line, so the label exits
  // upward while its duplicate enters from below. Reverses on mouse-leave.
  const roll = (container: HTMLElement, y: number) => {
    if (shouldReduceMotion) return;
    const el = container.querySelector<HTMLElement>(".pf-roll");
    if (el) gsap.to(el, { yPercent: y, duration: 0.55, ease: "power3.inOut", overwrite: true });
  };

  // CTA button hover: text rolls up, and the arrow flies out to the top-right
  // while a duplicate enters from the bottom-left (diagonal masked slide).
  // px-based x/y so GSAP reads the duplicate's inline start position cleanly.
  const hoverBtn = (el: HTMLElement, enter: boolean) => {
    roll(el, enter ? -100 : 0);
    if (shouldReduceMotion) return;
    const a = el.querySelector<HTMLElement>(".pf-arrow-a");
    const b = el.querySelector<HTMLElement>(".pf-arrow-b");
    const opts = { duration: 0.5, ease: "power3.inOut", overwrite: true } as const;
    if (a) gsap.to(a, { x: enter ? 26 : 0, y: enter ? -26 : 0, ...opts });
    if (b) gsap.to(b, { x: enter ? 0 : -26, y: enter ? 0 : 26, ...opts });
  };

  return (
    <section className="bg-background py-24 md:py-32" style={{ overflow: "clip" }}>
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-16 md:mb-24">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            PROJECTEN
          </h2>
          <p className="md:text-right text-base md:text-lg text-muted-foreground font-light max-w-xs md:pt-4">
            Cases die je meenemen door onze aanpak en de impact die we maken.
          </p>
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16 md:gap-y-20">
          {ITEMS.map((item, i) => (
            <motion.article
              key={item.slug}
              className="pf-card group"
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: (i % 2) * 0.08, ease: EASE }}
              onMouseEnter={(e) => roll(e.currentTarget, -100)}
              onMouseLeave={(e) => roll(e.currentTarget, 0)}
            >
              <Link
                to={`/portfolio/${item.slug}`}
                aria-label={`Bekijk de case: ${item.title}`}
                className="block"
              >
                {/* Image */}
                <div
                  className="relative overflow-hidden rounded-2xl aspect-[16/10]"
                  style={{ background: "hsl(var(--sw-ink) / 0.03)" }}
                >
                  <img
                    src={item.image}
                    alt={`${item.title} — website ontworpen door Nieuwblik`}
                    loading="lazy"
                    className="w-full h-full object-cover object-top transition-[filter,transform] duration-500 ease-out will-change-transform group-hover:grayscale group-hover:blur-[6px] group-hover:scale-[1.04]"
                  />

                  {/* Category pill — hides on hover */}
                  <span
                    className="absolute bottom-4 right-4 px-3.5 py-1.5 rounded-full text-[11px] font-medium tracking-wider uppercase text-white transition-opacity duration-300 group-hover:opacity-0"
                    style={{ background: "rgba(28,33,31,0.72)", backdropFilter: "blur(4px)" }}
                  >
                    {item.category}
                  </span>

                  {/* VIEW overlay — fades + scales in on hover */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span
                      className="flex items-center justify-center rounded-full bg-white text-black text-sm font-semibold tracking-[0.15em] uppercase opacity-0 scale-75 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-100"
                      style={{ width: 120, height: 120 }}
                    >
                      View
                    </span>
                  </div>
                </div>

                {/* Meta + rolling title */}
                <div className="mt-6">
                  <p className="text-sm text-muted-foreground mb-3">{item.duration}</p>

                  <div className="pf-mask relative overflow-hidden">
                    <div className="pf-roll relative">
                      <span className="block text-2xl md:text-[1.75rem] font-bold uppercase tracking-tight leading-[1.1]" style={{ paddingBottom: "0.06em" }}>
                        {item.title}
                      </span>
                      <span
                        className="block absolute left-0 top-full w-full text-2xl md:text-[1.75rem] font-bold uppercase tracking-tight leading-[1.1]"
                        style={{ paddingBottom: "0.06em" }}
                        aria-hidden="true"
                      >
                        {item.title}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 h-px w-full" style={{ background: "hsl(var(--sw-rule) / 0.18)" }} />
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* CTA to full portfolio */}
        <div className="mt-20 md:mt-28">
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-md text-base md:text-lg font-medium text-white"
            style={{ background: ACCENT }}
            onMouseEnter={(e) => hoverBtn(e.currentTarget, true)}
            onMouseLeave={(e) => hoverBtn(e.currentTarget, false)}
          >
            <span className="pf-mask relative inline-block overflow-hidden">
              <span className="pf-roll relative block">
                <span className="block">Alle projecten bekijken</span>
                <span className="block absolute left-0 top-full w-full" aria-hidden="true">
                  Alle projecten bekijken
                </span>
              </span>
            </span>
            <span className="relative inline-block overflow-hidden" style={{ width: 22, height: 22 }}>
              <ArrowUpRight className="pf-arrow-a absolute inset-0 w-[22px] h-[22px]" />
              <ArrowUpRight
                className="pf-arrow-b absolute inset-0 w-[22px] h-[22px]"
                style={{ transform: "translate(-26px, 26px)" }}
                aria-hidden="true"
              />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ScrollPortfolio;
