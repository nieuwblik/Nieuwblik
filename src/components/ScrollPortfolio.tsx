import type { CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import PortfolioCard from "@/components/PortfolioCard";
import { AnimatedButton } from "@/components/ui/animated-button";
import taxiDrechterlandImg from "@/assets/taxidrechterland.webp";
import prideMobilityImg from "@/assets/pride-mobility.webp";
import puurInHarmonieImg from "@/assets/puurinharmonie.webp";
import vvMadjoeImg from "@/assets/vvmadjoe-portfolio.webp";
import daniqueKwakmanImg from "@/assets/daniquekwakman.webp";
import esveldInstallatieImg from "@/assets/esveldinstallatie.webp";
import feigroImg from "@/assets/feigro-project-nieuwblik.webp";
import kyodaiOriginalsImg from "@/assets/kyodai-originals.webp";

// Dezelfde beelden als varianten per schermbreedte.
import taxiDrechterlandImgSet from "@/assets/taxidrechterland.webp?w=480;800;1200&format=webp&as=srcset";
import prideMobilityImgSet from "@/assets/pride-mobility.webp?w=480;800;1200&format=webp&as=srcset";
import puurInHarmonieImgSet from "@/assets/puurinharmonie.webp?w=480;800;1200&format=webp&as=srcset";
import vvMadjoeImgSet from "@/assets/vvmadjoe-portfolio.webp?w=480;800;1200&format=webp&as=srcset";
import daniqueKwakmanImgSet from "@/assets/daniquekwakman.webp?w=480;800;1200&format=webp&as=srcset";
import esveldInstallatieImgSet from "@/assets/esveldinstallatie.webp?w=480;800;1200&format=webp&as=srcset";
import feigroImgSet from "@/assets/feigro-project-nieuwblik.webp?w=480;800;1200&format=webp&as=srcset";
import kyodaiOriginalsImgSet from "@/assets/kyodai-originals.webp?w=480;800;1200&format=webp&as=srcset";

// ── Brand tokens ───────────────────────────────────────────────
const R2 = "https://pub-db1d62b400114ea6902679b432e6b4c7.r2.dev/nieuwblik-portfolio";

// ── Portfolio data (real Nieuwblik projects) ───────────────────
// `meta` mirrors the two lead tags from that project's entry in
// src/data/projects.ts — keyword-relevant text instead of the doorlooptijd
// that used to sit here (dropped: it read oddly above the title and had no
// SEO value).
const ITEMS = [
  { title: "Taxi Drechterland",    category: "Taxi & Personenvervoer",  meta: "Maatwerk · Lokale SEO", image: taxiDrechterlandImg, imageSet: taxiDrechterlandImgSet, slug: "taxi-drechterland",     url: "https://taxidrechterland.nl" },
  { title: "Feigro Dakwerken",      category: "Dakdekkersdiensten",      meta: "Vakmanschap · Lokale SEO", image: feigroImg, imageSet: feigroImgSet,            slug: "feigro-dakwerken",      url: "https://feigro.nl" },
  { title: "Puur in Harmonie",      category: "Holistische Salon",       meta: "Web Design · Wellness", image: puurInHarmonieImg, imageSet: puurInHarmonieImgSet,   slug: "puur-in-harmonie",      url: "https://www.puurinharmonie.nl" },
  { title: "VV Madjoe",             category: "Sportvereniging",         meta: "Maatwerk · Lokale SEO", image: vvMadjoeImg, imageSet: vvMadjoeImgSet,          slug: "vv-madjoe",             url: "https://vvmadjoe.nl" },
  { title: "Danique Kwakman",       category: "Orthomoleculaire Therapie", meta: "Web Design · Gezondheid", image: daniqueKwakmanImg, imageSet: daniqueKwakmanImgSet, slug: "danique-kwakman",       url: "https://daniquekwakman.nl" },
  { title: "Esveld Installatie",    category: "Installatiediensten",     meta: "Web Design · Dienstverlening", image: esveldInstallatieImg, imageSet: esveldInstallatieImgSet, slug: "esveld-installatie",   url: "https://esveldinstallatie.nl" },
  { title: "Pride Mobility Europe", category: "Mobiliteit & Healthcare", meta: "WordPress · Maatwerk", image: prideMobilityImg, imageSet: prideMobilityImgSet,    slug: "pride-mobility-europe", url: "https://www.pridemobility.eu" },
  { title: "Kyodai Originals",      category: "Japanse Kunst & Antiek",  meta: "E-commerce · Luxe Branding", image: kyodaiOriginalsImg, imageSet: kyodaiOriginalsImgSet,   slug: "kyodai-originals",      url: "https://www.kyodaioriginals.nl" },
];

const EASE = [0.25, 0.1, 0.25, 1] as const;

const ScrollPortfolio = () => {
  const shouldReduceMotion = useReducedMotion();

  /* Staat onder de hero (niet meer eroverheen getrokken), zodat de golf-hero
     vrij in beeld staat. */
  return (
    <section
      className="relative z-20 pt-20 md:pt-28 pb-24 md:pb-32"
      style={{ overflow: "clip" }}
    >
      <div className="container mx-auto px-6">
        {/* Card grid. De bovenste twee komen mee met de hero binnen: dezelfde
            CSS-entree als de hero (sw-hero-anim/sw-cta, vanaf de eerste paint,
            alleen transform), net na de balk. De rest verschijnt bij het scrollen. */}
        <div className="sw-hero-anim grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16 md:gap-y-20">
          {ITEMS.map((item, i) => {
            const kaart = (
              <PortfolioCard
                title={item.title}
                category={item.category}
                image={item.image}
                imageSet={item.imageSet}
                slug={item.slug}
                meta={item.meta}
                priority={i < 2}
              />
            );
            if (i < 2) {
              return (
                <div
                  key={item.slug}
                  className="sw-cta"
                  style={{ "--sw-delay": `${700 + i * 80}ms`, "--sw-rise": "28px" } as CSSProperties}
                >
                  {kaart}
                </div>
              );
            }
            return (
              <motion.div
                key={item.slug}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: (i % 2) * 0.08, ease: EASE }}
              >
                {kaart}
              </motion.div>
            );
          })}
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
