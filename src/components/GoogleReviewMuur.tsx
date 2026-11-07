import { Star } from "lucide-react";

import { useDarkNavSection } from "@/components/TabNav";
import { AnimatedButton } from "@/components/ui/animated-button";
import { REVIEWS } from "@/config/business";
import { googleReviews, type GoogleReview } from "@/data/googleReviews";

const RAND = "hsl(var(--sw-rule) / 0.08)";

/** De G van Google in de vier merkkleuren. */
export const GoogleG = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 48 48" className={className} role="img" aria-label="Google">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
);

const Sterren = ({ className = "h-3.5 w-3.5" }: { className?: string }) => (
  <span className="flex gap-0.5" aria-label="5 sterren">
    {[...Array(5)].map((_, i) => (
      <Star key={i} className={className} style={{ fill: "#FBBC05", color: "#FBBC05" }} aria-hidden="true" />
    ))}
  </span>
);

const ReviewKaart = ({ review }: { review: GoogleReview }) => (
  <li
    className="rounded-2xl border bg-white p-5 shadow-[0_10px_30px_-22px_rgba(0,0,0,0.25)]"
    style={{ borderColor: RAND }}
  >
    <div className="flex items-center justify-between">
      <Sterren />
      <GoogleG className="h-4 w-4 shrink-0" />
    </div>
    <p className="mt-3 text-[0.9375rem] leading-relaxed" style={{ color: "hsl(var(--sw-ink) / 0.78)" }}>
      {review.tekst}
    </p>
    <p className="mt-3 text-sm font-semibold sw-ink">{review.naam}</p>
  </li>
);

/**
 * Een lopende kolom: de lijst staat er twee keer onder elkaar en schuift een
 * halve hoogte op, zodat het rondje naadloos sluit. De tweede lijst is alleen
 * beeld. Zonder beweging (reduced motion) vervalt hij en scrolt de kolom zelf.
 */
const LopendeKolom = ({
  reviews,
  duur,
  omgekeerd = false,
}: {
  reviews: GoogleReview[];
  duur: number;
  omgekeerd?: boolean;
}) => (
  <div
    className={`review-kolom${omgekeerd ? " review-kolom--omgekeerd" : ""}`}
    style={{ animationDuration: `${duur}s` }}
  >
    <ul className="space-y-4 pb-4">
      {reviews.map((r) => (
        <ReviewKaart key={r.naam} review={r} />
      ))}
    </ul>
    <ul className="review-kolom__kopie space-y-4 pb-4" aria-hidden="true">
      {reviews.map((r) => (
        <ReviewKaart key={r.naam} review={r} />
      ))}
    </ul>
  </div>
);

/** Per kolom ongeveer evenveel tekst, zodat ze even lang duren. */
const KOLOMMEN = [
  ["Ebru Yoldas", "Deniz Cem Toptaş", "Nancy van Ham", "Huub Rood", "Thom Smit"],
  ["Trijntje Laan", "Jan Groen", "Dennis van Heuven van Staerelingen", "Maarten Gesink", "Niels van Muijden"],
  ["Jesse Huisman", "Danique Kwakman", "Thijs Peerdeman", "Niels van Esveld", "Stefan Harlaar"],
].map((namen) => namen.flatMap((naam) => googleReviews.filter((r) => r.naam === naam)));

/**
 * Vijftien letterlijke Google-reviews in kolommen die rustig voorbijschuiven,
 * met de score ernaast, op de donkergroene band van de homepage en precies één
 * scherm hoog. De muur loopt tot de randen van de sectie, zodat de kaarten er als
 * het ware doorheen schuiven. Aanwijzen zet de beweging stil.
 */
const GoogleReviewMuur = () => {
  // Donkere band: de vaste header keert om zolang hij eronder staat.
  const donkereBand = useDarkNavSection<HTMLElement>();

  return (
    <section
      ref={donkereBand}
      className="relative h-[100svh] min-h-[640px] overflow-hidden"
      style={{ background: "hsl(160 84% 12%)" }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, hsl(160 84% 60%) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-[120px]"
        style={{ background: "radial-gradient(circle, hsl(160 84% 45%) 0%, transparent 70%)" }}
      />

      <div className="container relative z-10 mx-auto flex h-full flex-col gap-8 px-4 sm:px-6 lg:grid lg:grid-cols-[minmax(0,390px)_minmax(0,1fr)] lg:items-center lg:gap-12">
        <div className="shrink-0 pt-[calc(var(--header-height)_+_1.5rem)] lg:pt-0">
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-[2.75rem]" style={{ lineHeight: 1.06 }}>
            Wat onze klanten zeggen
          </h2>
          <div className="mt-5 flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white">
              <GoogleG className="h-6 w-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-white">{REVIEWS.scoreLabel}</span>
                <Sterren className="h-4 w-4" />
              </div>
              <p className="text-sm text-white/70">Op basis van {REVIEWS.aantalLabel}reviews</p>
            </div>
          </div>
          <div className="mt-6">
            <AnimatedButton href={REVIEWS.profielUrl} variant="outlineWhite">
              Bekijk op Google
            </AnimatedButton>
          </div>
        </div>

        <div className="review-muur hidden h-full grid-cols-3 items-start gap-4 lg:grid">
          <LopendeKolom reviews={KOLOMMEN[0]!} duur={62} />
          <LopendeKolom reviews={KOLOMMEN[1]!} duur={74} omgekeerd />
          <LopendeKolom reviews={KOLOMMEN[2]!} duur={56} />
        </div>
        {/* Op de telefoon alle vijftien in één kolom. */}
        <div className="review-muur min-h-0 flex-1 lg:hidden">
          <LopendeKolom reviews={KOLOMMEN.flat()} duur={150} />
        </div>
      </div>
    </section>
  );
};

export default GoogleReviewMuur;
