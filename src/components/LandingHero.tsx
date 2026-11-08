import type { CSSProperties, ReactNode } from "react";
import { Star } from "lucide-react";
import { AnimatedButton } from "@/components/ui/animated-button";
import { GoogleG } from "@/components/GoogleReviewMuur";
import { REVIEWS } from "@/config/business";
import heroTeamImage from "@/assets/justin-job-compressed.webp";

interface LandingHeroProps {
  h1: string;
  subtitle: string;
  /** Kruimelpad boven de kop (werkgebiedpagina's). */
  kruimels?: ReactNode;
  /** Eigen knoppen in plaats van "Start nu" en "Ontdek portfolio". */
  knoppen?: ReactNode;
}

const GROEN = "hsl(var(--sw-green))";

/**
 * Hero van de stads-, branche- en regiopagina's in de stijl van de installateurspagina:
 * links de kop in het groene verloop, de intro, twee knoppen en de reviewscore, rechts
 * Justin en Job. Zonder de golf; die is voor de homepage en de dienstpagina's.
 */
const LandingHero = ({ h1, subtitle, kruimels, knoppen }: LandingHeroProps) => (
  <section className="sw-ink sw-hero-anim relative overflow-hidden bg-background">
    <div className="container mx-auto grid grid-cols-1 items-end gap-6 px-4 pt-[calc(var(--header-height)_+_2.5rem)] sm:px-6 lg:grid-cols-12 lg:gap-10 lg:pt-[calc(var(--header-height)_+_3.5rem)]">
      <div className="relative z-[3] pb-4 lg:col-span-7 lg:pb-24">
        {kruimels && <div className="-mt-4 mb-4">{kruimels}</div>}
        <h1 className="golf-hero__titel golf-hero__titel--strak max-w-[12em]" style={{ fontSize: "clamp(2.3rem, 4.4vw, 4.6rem)" }}>
          <span className="sw-mask">
            {/* Lange koppen lopen over meerdere regels; het masker blijft voor de inloopanimatie. */}
            <span className="sw-line-inner !whitespace-normal">{h1}</span>
          </span>
        </h1>
        <p
          className="sw-lead mt-5 max-w-[36rem] text-base leading-relaxed md:mt-6 md:text-lg"
          style={{ color: "hsl(var(--sw-ink) / 0.7)", "--sw-delay": "0.1s" } as CSSProperties}
        >
          {subtitle}
        </p>
        <div className="sw-cta mt-7 flex flex-col gap-3 sm:flex-row" style={{ "--sw-delay": "0.3s" } as CSSProperties}>
          {knoppen ?? (
            <>
              <AnimatedButton to="/contact" className="h-12 w-full sm:w-auto">
                Start nu
              </AnimatedButton>
              <AnimatedButton to="/portfolio" variant="outline" className="h-12 w-full sm:w-auto">
                Ontdek portfolio
              </AnimatedButton>
            </>
          )}
        </div>
        <a
          href={REVIEWS.profielUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="sw-cta group mt-6 flex w-fit items-center gap-2.5"
          style={{ "--sw-delay": "0.45s" } as CSSProperties}
        >
          <GoogleG className="h-[18px] w-[18px] shrink-0" />
          <span className="flex items-center gap-1" aria-hidden="true">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4" style={{ fill: GROEN, color: GROEN }} />
            ))}
          </span>
          <span className="text-sm transition-colors group-hover:text-[hsl(var(--sw-green))]" style={{ color: "hsl(var(--sw-ink) / 0.8)" }}>
            {REVIEWS.scoreLabel} op Google,{" "}
            <span style={{ color: "hsl(var(--sw-ink) / 0.62)" }}>
              <span className="max-sm:hidden">op basis van </span>
              {REVIEWS.aantalLabel}reviews
            </span>
          </span>
        </a>
      </div>

      <div className="sw-cta relative lg:col-span-5" style={{ "--sw-delay": "0.2s" } as CSSProperties}>
        <img
          src={heroTeamImage}
          alt="Justin & Job van Nieuwblik"
          className="mx-auto block h-auto w-full max-w-[460px] lg:ml-auto lg:mr-0 lg:max-w-none"
          fetchPriority="high"
        />
      </div>
    </div>
  </section>
);

export default LandingHero;
