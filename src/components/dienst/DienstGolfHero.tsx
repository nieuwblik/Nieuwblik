import { useRef, type CSSProperties } from "react";
import { Star } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import { AnimatedButton } from "@/components/ui/animated-button";
import { GoogleG } from "@/components/GoogleReviewMuur";
import { useGolf } from "@/components/golf/useGolf";
import { golfDienst } from "@/data/golfDienst";
import { REVIEWS } from "@/config/business";
import terugvalDesktop from "@/assets/hero/dienst-desktop.webp";
import terugvalMobiel from "@/assets/hero/dienst-mobiel.webp";

const GROEN = "hsl(var(--sw-green))";

/**
 * Hero van de dienstpagina's in de stijl van de homepage: tekst links, de zijden golf
 * rechts (eigen instellingen in src/data/golfDienst.ts, afstellen met toets p in de
 * ontwikkelomgeving), de reviewscore onder de knoppen.
 */
const DienstGolfHero = ({
  kruimels,
  titel,
  intro,
  knop,
  tweedeKnop,
}: {
  kruimels: { label: string; path: string }[];
  titel: string;
  intro: string;
  knop: { label: string; to: string };
  tweedeKnop: { label: string; to: string };
}) => {
  const heroRef = useRef<HTMLElement>(null);
  const vlakRef = useRef<HTMLDivElement>(null);
  useGolf(heroRef, vlakRef, golfDienst, "dienst");

  return (
    <section
      ref={heroRef}
      className={`golf-hero${golfDienst.opstelling.spiegel ? " golf-hero--gespiegeld" : ""} sw-ink sw-hero-anim relative isolate flex flex-col overflow-hidden bg-background lg:min-h-[86svh]`}
    >
      <picture className="golf-hero__terugval" aria-hidden="true">
        <source media="(max-width: 759px), (max-aspect-ratio: 9/10)" srcSet={terugvalMobiel} />
        <img src={terugvalDesktop} alt="" decoding="async" fetchPriority="low" />
      </picture>
      <div ref={vlakRef} className="golf-hero__vlak" />

      <div className="golf-hero__inhoud container mx-auto flex flex-1 flex-col justify-center px-4 pb-48 pt-[calc(var(--header-height)_+_2rem)] sm:px-6 md:pb-40 lg:pb-32">
        <div className="relative z-[3] mb-8 hidden md:block">
          <Breadcrumb items={kruimels} />
        </div>
        <h1
          className="golf-hero__titel golf-hero__titel--strak max-w-[12em]"
          style={{ fontSize: "clamp(2.3rem, 4.4vw, 4.6rem)" }}
        >
          <span className="sw-mask">
            {/* Lange koppen lopen over meerdere regels; het masker blijft voor de inloopanimatie. */}
            <span className="sw-line-inner !whitespace-normal">{titel}</span>
          </span>
        </h1>
        <p
          className="sw-lead relative z-[3] mt-5 max-w-[36rem] text-base leading-relaxed md:mt-6 md:text-lg"
          style={{ color: "hsl(var(--sw-ink) / 0.7)", "--sw-delay": "0.1s" } as CSSProperties}
        >
          {intro}
        </p>
        <div
          className="sw-cta relative z-[3] mt-7 flex flex-col gap-3 sm:flex-row"
          style={{ "--sw-delay": "0.3s" } as CSSProperties}
        >
          <AnimatedButton to={knop.to} className="h-12 w-full sm:w-auto">
            {knop.label}
          </AnimatedButton>
          <AnimatedButton to={tweedeKnop.to} variant="outline" className="h-12 w-full bg-white/70 sm:w-auto">
            {tweedeKnop.label}
          </AnimatedButton>
        </div>
        <a
          href={REVIEWS.profielUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="sw-cta group relative z-[3] mt-6 flex w-fit items-center gap-2.5"
          style={{ "--sw-delay": "0.45s" } as CSSProperties}
        >
          <GoogleG className="h-[18px] w-[18px] shrink-0" />
          <span className="flex items-center gap-1" aria-hidden="true">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4" style={{ fill: GROEN, color: GROEN }} />
            ))}
          </span>
          <span
            className="text-sm transition-colors group-hover:text-[hsl(var(--sw-green))]"
            style={{ color: "hsl(var(--sw-ink) / 0.8)" }}
          >
            {REVIEWS.scoreLabel} op Google,{" "}
            <span style={{ color: "hsl(var(--sw-ink) / 0.62)" }}>
              <span className="max-sm:hidden">op basis van </span>
              {REVIEWS.aantalLabel}reviews
            </span>
          </span>
        </a>
      </div>
    </section>
  );
};

export default DienstGolfHero;
