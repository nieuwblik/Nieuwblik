import { Star } from "lucide-react";
import { SITE_URL } from "@/config/site";
import { REVIEWS } from "@/config/business";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import Breadcrumb from "@/components/Breadcrumb";
import Reveal from "@/components/Reveal";
import { AnimatedButton } from "@/components/ui/animated-button";
import { GROEN, GroenPaneel, INKT_65, RAND, Sectie } from "@/components/dienst/DienstBlokken";
import { googleReviews } from "@/data/googleReviews";

const LADEN = "animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-backwards motion-reduce:animate-none";

const Sterren = ({ aantal, grootte = "h-4 w-4" }: { aantal: number; grootte?: string }) => (
  <div className="flex gap-0.5" aria-label={`${aantal} van 5 sterren`} role="img">
    {Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={grootte}
        style={i < aantal ? { color: GROEN, fill: GROEN } : { color: RAND }}
        aria-hidden="true"
      />
    ))}
  </div>
);

/**
 * Reviews: de Google-reviews uit src/data/googleReviews.ts, letterlijk en
 * server-side in de HTML. Een review plaatsen gaat via Google zelf, niet meer
 * via een eigen formulier.
 */
const Reviews = () => (
  <div className="min-h-screen bg-background">
    <SEOHead
      title="Reviews | Klantervaringen Webdesign Bureau - Nieuwblik Enkhuizen"
      description="Lees ervaringen van onze klanten over websites en webshops. Webdesign bureau Enkhuizen met tevreden klanten in heel West-Friesland. Bekijk onze reviews."
      keywords="reviews webdesign, klantervaringen website, webdesign bureau Enkhuizen, tevreden klanten West-Friesland"
      canonicalUrl={`${SITE_URL}/reviews`}
      breadcrumbs={[
        { name: "Home", url: SITE_URL },
        { name: "Reviews", url: `${SITE_URL}/reviews` },
      ]}
    />

    <main>
      <section className="pt-32 pb-16 md:pb-20">
        <div className="container mx-auto px-4 sm:px-6">
          <Breadcrumb items={[{ label: "Reviews", path: "/reviews" }]} />
          <div className={`mt-10 md:mt-14 ${LADEN}`}>
            <h1
              className="max-w-5xl text-4xl font-bold tracking-tight sw-ink md:text-6xl lg:text-7xl"
              style={{ lineHeight: 1.02 }}
            >
              Wat onze klanten zeggen
            </h1>
          </div>
          <div className={`${LADEN} delay-100`}>
            <p className="mt-6 max-w-2xl text-lg font-light leading-relaxed md:text-xl" style={{ color: INKT_65 }}>
              Ontdek de ervaringen van bedrijven die hun online succes hebben gerealiseerd met Nieuwblik.
            </p>
          </div>
          <div className={`mt-10 flex flex-col gap-6 sm:flex-row sm:items-center ${LADEN} delay-200`}>
            <div className="flex items-center gap-4">
              <span className="text-5xl font-bold tracking-tight sw-ink">{REVIEWS.scoreLabel}</span>
              <div>
                <Sterren aantal={REVIEWS.score} grootte="h-5 w-5" />
                <p className="mt-1 text-sm" style={{ color: INKT_65 }}>
                  op Google, op basis van {REVIEWS.aantalLabel} reviews
                </p>
              </div>
            </div>
            <div className="sm:ml-6">
              <AnimatedButton href={REVIEWS.profielUrl} variant="outline">
                Bekijk alle Google reviews
              </AnimatedButton>
            </div>
          </div>
        </div>
      </section>

      <Sectie papier>
        <div className="columns-1 gap-5 md:columns-2 lg:columns-3">
          {googleReviews.map((r, i) => (
            <Reveal key={r.naam} afstand={20} delay={(i % 3) * 0.06} className="mb-5 break-inside-avoid">
              <figure className="rounded-2xl border bg-white p-6 md:p-7" style={{ borderColor: RAND }}>
                <Sterren aantal={r.sterren} />
                <blockquote className="mt-4 text-[0.9375rem] font-light leading-relaxed" style={{ color: INKT_65 }}>
                  "{r.tekst}"
                </blockquote>
                <figcaption className="mt-5 text-sm font-semibold sw-ink">{r.naam}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Sectie>

      <GroenPaneel
        titel="Deel jouw ervaring"
        tekst="Heb je met ons samengewerkt? We horen graag over je ervaring!"
        knop={{ label: "Schrijf een review op Google", href: REVIEWS.schrijfUrl }}
      />
      <div className="pb-16 md:pb-24" />
    </main>

    <Footer />
  </div>
);

export default Reviews;
