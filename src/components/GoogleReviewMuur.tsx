import { Star } from "lucide-react";

import { AnimatedButton } from "@/components/ui/animated-button";
import { REVIEWS } from "@/config/business";
import { googleReviews, type GoogleReview } from "@/data/googleReviews";

const RAND = "hsl(var(--sw-rule) / 0.1)";
const INKT_65 = "hsl(var(--sw-ink) / 0.65)";

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
  <li className="rounded-2xl border bg-white p-5" style={{ borderColor: RAND }}>
    <div className="flex items-center gap-3">
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold"
        style={{ background: "hsl(var(--sw-green) / 0.08)", color: "hsl(var(--sw-green))" }}
        aria-hidden="true"
      >
        {review.naam.charAt(0)}
      </span>
      <span className="min-w-0 flex-1 truncate text-sm font-bold sw-ink">{review.naam}</span>
      <GoogleG className="h-4 w-4 shrink-0" />
    </div>
    <div className="mt-3">
      <Sterren />
    </div>
    <p className="mt-2 text-sm font-light leading-relaxed" style={{ color: INKT_65 }}>
      {review.tekst}
    </p>
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
 * met de score ernaast. Aanwijzen zet de beweging stil, zodat je kunt lezen.
 */
const GoogleReviewMuur = () => (
  <section className="sw-paper overflow-hidden py-16 md:py-24">
    <div className="container mx-auto grid grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:items-center lg:gap-14">
      <div>
        <h2 className="text-3xl font-bold tracking-tight sw-ink md:text-5xl" style={{ lineHeight: 1.04 }}>
          Wat onze klanten zeggen
        </h2>
        <div className="mt-6 flex items-center gap-4">
          <GoogleG className="h-10 w-10 shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tight sw-ink">{REVIEWS.scoreLabel}</span>
              <Sterren className="h-[18px] w-[18px]" />
            </div>
            <p className="text-sm" style={{ color: INKT_65 }}>
              Op basis van {REVIEWS.aantalLabel}reviews
            </p>
          </div>
        </div>
        <div className="mt-7">
          <AnimatedButton href={REVIEWS.profielUrl} variant="outline">
            Bekijk op Google
          </AnimatedButton>
        </div>
      </div>

      <div className="review-muur hidden h-[640px] grid-cols-3 items-start gap-4 lg:grid">
        <LopendeKolom reviews={KOLOMMEN[0]!} duur={62} />
        <LopendeKolom reviews={KOLOMMEN[1]!} duur={74} omgekeerd />
        <LopendeKolom reviews={KOLOMMEN[2]!} duur={56} />
      </div>
      {/* Op de telefoon alle vijftien in één kolom. */}
      <div className="review-muur h-[560px] lg:hidden">
        <LopendeKolom reviews={KOLOMMEN.flat()} duur={150} />
      </div>
    </div>
  </section>
);

export default GoogleReviewMuur;
