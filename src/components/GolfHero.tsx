import { useRef, type CSSProperties } from "react";
import {
  PencilRuler,
  Search,
  ShoppingBag,
  Star,
  TrendingUp,
} from "lucide-react";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Link } from "@/lib/router-compat";
import { REVIEWS } from "@/config/business";
import { golfHero } from "@/data/golfHero";
import terugvalDesktop from "@/assets/hero/golf-desktop.webp";
import terugvalMobiel from "@/assets/hero/golf-mobiel.webp";
import HeroTelefoon from "@/components/golf/HeroTelefoon";
import { useGolf } from "@/components/golf/useGolf";

/**
 * Homepage-hero met de zijden golf (WebGL, src/components/golf/golfMotor.ts).
 *
 * - De golf staat links (gespiegeld), de tekst rechts; op mobiel staat de tekst
 *   bovenaan en loopt de golf eronder door.
 * - Tot het eerste WebGL-beeld (en zonder WebGL) staat er een stilstaand
 *   terugvalbeeld per breekpunt; dat vloeit weg zodra de golf er is.
 * - De kop staat twee keer op elkaar: onder de golf in inkt (met "Enkhuizen" wit,
 *   aria-hidden), boven de golf de echte h1 in groen met multiply. Op wit lees je
 *   zo inkt met een groen "Enkhuizen", waar de golf erachter loopt kleurt de kop
 *   diepgroen mee.
 */
// Diensten in de balk onderin de hero (bestaande pagina's, zie ook de footer).
const DIENSTEN = [
  {
    label: "Website op maat",
    to: "/diensten/website-op-maat",
    Icoon: PencilRuler,
  },
  { label: "Webshops", to: "/diensten/webshops", Icoon: ShoppingBag },
  { label: "E-commerce", to: "/diensten/e-commerce", Icoon: TrendingUp },
  { label: "SEO", to: "/seo-enkhuizen", Icoon: Search },
];

const GolfHero = () => {
  const heroRef = useRef<HTMLElement>(null);
  const vlakRef = useRef<HTMLDivElement>(null);

  useGolf(heroRef, vlakRef, golfHero, "home");

  return (
    <section
      ref={heroRef}
      className={`golf-hero${golfHero.opstelling.spiegel ? " golf-hero--gespiegeld" : ""} sw-ink sw-hero-anim relative isolate flex min-h-[82svh] flex-col overflow-hidden bg-background`}
    >
      <picture className="golf-hero__terugval" aria-hidden="true">
        <source
          media="(max-width: 759px), (max-aspect-ratio: 9/10)"
          srcSet={terugvalMobiel}
        />
        <img
          src={terugvalDesktop}
          alt=""
          decoding="async"
          fetchPriority="low"
        />
      </picture>
      <div ref={vlakRef} className="golf-hero__vlak" />
      {/* Hand met telefoon tussen golf en tekst; de arm loopt onder de balk door. */}
      <HeroTelefoon />

      <div className="golf-hero__inhoud relative flex flex-1 flex-col justify-center pt-[calc(var(--header-height)_+_1.5rem)] md:pt-[var(--header-height)] pb-12 md:pb-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="golf-hero__blok">
            <h1 className="golf-hero__titel">
              <span className="sw-mask">
                <span className="sw-line-inner">Webdesignbureau</span>
              </span>{" "}
              <span className="sw-mask">
                <span className="sw-line-inner">in Enkhuizen</span>
              </span>
            </h1>

            <div className="golf-hero__rest">
              <p
                className="sw-lead mt-5 max-w-[34rem] text-base md:text-lg leading-relaxed"
                style={
                  {
                    color: "hsl(var(--sw-ink) / 0.7)",
                    "--sw-delay": "0.4s",
                  } as CSSProperties
                }
              >
                Nieuwblik ontwerpt en bouwt websites en webshops die opvallen,
                razendsnel laden en goed vindbaar zijn, van eerste schets tot
                livegang. Vanuit Enkhuizen voor ondernemers door heel Nederland.
                Zelf ondernemer in de stad? Lees meer over{" "}
                <Link
                  to="/website-laten-maken-enkhuizen"
                  className="transition-colors hover:text-[hsl(var(--sw-green))]"
                >
                  website laten maken in Enkhuizen
                </Link>
                .
              </p>

              <div
                className="sw-cta mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
                style={{ "--sw-delay": "0.55s" } as CSSProperties}
              >
                <AnimatedButton to="/contact" className="h-12 w-full sm:w-auto">
                  Start je project
                </AnimatedButton>
                <AnimatedButton
                  to="/portfolio"
                  variant="outline"
                  className="h-12 w-full sm:w-auto"
                >
                  Ontdek portfolio
                </AnimatedButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Balk onderin, zoals de logobalk bij Stripe: de golf loopt er (zacht
          vervaagd) achter door en stopt strak aan de onderrand. Reviews links,
          diensten rechts als echte links. */}
      <div
        className="golf-hero__balk sw-cta"
        style={{ "--sw-delay": "0.8s" } as CSSProperties}
      >
        <div className="container mx-auto flex flex-col gap-3 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between md:gap-8 md:py-0">
          <Link
            to="/reviews"
            className="group flex shrink-0 items-center gap-2.5"
          >
            <span className="flex items-center gap-1" aria-hidden="true">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4"
                  style={{
                    fill: "hsl(var(--sw-green))",
                    color: "hsl(var(--sw-green))",
                  }}
                />
              ))}
            </span>
            <span
              className="text-sm transition-colors group-hover:text-[hsl(var(--sw-green))]"
              style={{ color: "hsl(var(--sw-ink) / 0.8)" }}
            >
              {REVIEWS.scoreLabel} op Google,{" "}
              <span style={{ color: "hsl(var(--sw-ink) / 0.62)" }}>
                op basis van {REVIEWS.aantalLabel} reviews
              </span>
            </span>
          </Link>
          <nav aria-label="Diensten" className="golf-hero__diensten">
            <ul>
              {DIENSTEN.map((d) => (
                <li key={d.to}>
                  <Link to={d.to}>
                    <d.Icoon
                      className="golf-hero__icoon"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                    {d.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
};

export default GolfHero;
