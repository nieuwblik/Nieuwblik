import { Link } from "react-router-dom";
import gsap from "gsap";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import PortfolioCard from "@/components/PortfolioCard";
import taxiDrechterlandImg from "@/assets/taxidrechterland.webp";
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
  { title: "Taxi Drechterland",    category: "Taxi & Personenvervoer",  duration: "3 weken", image: taxiDrechterlandImg, slug: "taxi-drechterland",     url: "https://taxidrechterland.nl" },
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

  // "Text roll" (reused for the CTA button — cards own their own copy via
  // PortfolioCard): the two stacked copies inside .pf-mask slide up one line,
  // so the label exits upward while its duplicate enters from below.
  // Reverses on mouse-leave.
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

  /* Pulled up (negative margin) so the top row of cards overlaps the hero by
     ~40% of a card's height. z-20 beats the hero's z-10 content layer, so the
     cards paint over it. No background: the hero and page are both white, and a
     solid one would cover the hero instead of letting the cards overlap. */
  return (
    <section
      className="sw-projects-overlap relative z-20 pb-24 md:pb-32"
      style={{ overflow: "clip" }}
    >
      <div className="container mx-auto px-6">
        {/* Card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16 md:gap-y-20">
          {ITEMS.map((item, i) => (
            <motion.div
              key={item.slug}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: (i % 2) * 0.08, ease: EASE }}
            >
              <PortfolioCard
                title={item.title}
                category={item.category}
                image={item.image}
                slug={item.slug}
                meta={item.duration}
              />
            </motion.div>
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
