import { motion, useReducedMotion } from "framer-motion";
import PortfolioCard from "@/components/PortfolioCard";
import { AnimatedButton } from "@/components/ui/animated-button";
import taxiDrechterlandImg from "@/assets/taxidrechterland.webp";
import prideMobilityImg from "@/assets/pride-mobility.webp";
import puurInHarmonieImg from "@/assets/puurinharmonie.webp";
import benotedImg from "@/assets/benoted.webp";
import daniqueKwakmanImg from "@/assets/daniquekwakman.webp";
import esveldInstallatieImg from "@/assets/esveldinstallatie.webp";
import feigroImg from "@/assets/feigro-project-nieuwblik.webp";
import kyodaiOriginalsImg from "@/assets/kyodai-originals.webp";

// ── Brand tokens ───────────────────────────────────────────────
const R2 = "https://pub-db1d62b400114ea6902679b432e6b4c7.r2.dev/nieuwblik-portfolio";

// ── Portfolio data (real Nieuwblik projects) ───────────────────
// `meta` mirrors the two lead tags from that project's entry in
// src/data/projects.ts — keyword-relevant text instead of the doorlooptijd
// that used to sit here (dropped: it read oddly above the title and had no
// SEO value).
const ITEMS = [
  { title: "Taxi Drechterland",    category: "Taxi & Personenvervoer",  meta: "Maatwerk · Lokale SEO", image: taxiDrechterlandImg, slug: "taxi-drechterland",     url: "https://taxidrechterland.nl" },
  { title: "Feigro Dakwerken",      category: "Dakdekkersdiensten",      meta: "Vakmanschap · Lokale SEO", image: feigroImg,            slug: "feigro-dakwerken",      url: "https://feigro.nl" },
  { title: "Puur in Harmonie",      category: "Holistische Salon",       meta: "Web Design · Wellness", image: puurInHarmonieImg,   slug: "puur-in-harmonie",      url: "https://www.puurinharmonie.nl" },
  { title: "BeNoted",               category: "Financiële Marketing",    meta: "Web Development · Fintech", image: benotedImg,          slug: "benoted",               url: "https://benoted.nl" },
  { title: "Danique Kwakman",       category: "Orthomoleculaire Therapie", meta: "Web Design · Gezondheid", image: daniqueKwakmanImg, slug: "danique-kwakman",       url: "https://daniquekwakman.nl" },
  { title: "Esveld Installatie",    category: "Installatiediensten",     meta: "Web Design · Dienstverlening", image: esveldInstallatieImg, slug: "esveld-installatie",   url: "https://esveldinstallatie.nl" },
  { title: "Pride Mobility Europe", category: "Mobiliteit & Healthcare", meta: "WordPress · Maatwerk", image: prideMobilityImg,    slug: "pride-mobility-europe", url: "https://www.pridemobility.eu" },
  { title: "Kyodai Originals",      category: "Japanse Kunst & Antiek",  meta: "E-commerce · Luxe Branding", image: kyodaiOriginalsImg,   slug: "kyodai-originals",      url: "https://www.kyodaioriginals.nl" },
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
                meta={item.meta}
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
