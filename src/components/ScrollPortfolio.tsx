import { motion, useReducedMotion } from "framer-motion";
import PortfolioCard from "@/components/PortfolioCard";
import { AnimatedButton } from "@/components/ui/animated-button";
import taxiDrechterlandImg from "@/assets/taxidrechterland.webp";
import prideMobilityImg from "@/assets/pride-mobility.webp";
import puurInHarmonieImg from "@/assets/puurinharmonie.webp";
import benotedImg from "@/assets/benoted.webp";
import daniqueKwakmanImg from "@/assets/daniquekwakman.webp";
import esveldInstallatieImg from "@/assets/esveldinstallatie.webp";
import ericaVanDijkImg from "@/assets/ericavandijk.webp";
import kyodaiOriginalsImg from "@/assets/kyodai-originals.webp";

// ── Brand tokens ───────────────────────────────────────────────
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
                priority={i < 2}
              />
            </motion.div>
          ))}
        </div>

        {/* CTA to full portfolio */}
        <div className="mt-20 md:mt-28">
          <AnimatedButton to="/portfolio" size="lg">
            Alle projecten bekijken
          </AnimatedButton>
        </div>
      </div>
    </section>
  );
};

export default ScrollPortfolio;
