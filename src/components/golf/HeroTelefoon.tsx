import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "@/lib/router-compat";
import daniqueSet from "@/assets/hero/hero-telefoon-danique-kwakman.webp?w=420;700;1050;1400&format=webp&as=srcset";
import kyodaiSet from "@/assets/hero/hero-telefoon-kyodai-originals.webp?w=420;700;1050;1400&format=webp&as=srcset";
import puurSet from "@/assets/hero/hero-telefoon-puur-in-harmonie.webp?w=420;700;1050;1400&format=webp&as=srcset";

/**
 * Hand met telefoon in de homepage-hero: een uitgesneden foto (Higgsfield, zie
 * scripts/mockups/hero-telefoon.mjs) met per case de mobiele site in het scherm.
 *
 * - Alleen vanaf 1024px breed; daaronder is er naast de tekst geen ruimte. Een
 *   <picture> laadt de foto ook pas vanaf die breedte (display: none alleen zou
 *   hem op mobiel toch downloaden).
 * - Komt met de hero omhoog binnen (sw-cta) en zweeft daarna heel licht.
 * - Elke paar seconden vloeit de volgende site over de vorige heen. De vorige
 *   blijft vol staan tot de nieuwe er helemaal is, anders wordt de hand halverwege
 *   de overgang doorschijnend (beide beelden hebben een alfakanaal).
 * - Klikken opent de case. Wisselen stopt buiten beeld, bij een verborgen tabblad
 *   en bij reduced motion.
 */
const SITES = [
  { slug: "danique-kwakman", naam: "Danique Kwakman", srcSet: daniqueSet },
  { slug: "kyodai-originals", naam: "Kyodai Originals", srcSet: kyodaiSet },
  { slug: "puur-in-harmonie", naam: "Puur in Harmonie", srcSet: puurSet },
];
/** 1×1 transparant: wat het img-element onder 1024px laadt. */
const LEEG =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
/** Tijd per site in ms. */
const DUUR = 4200;

export default function HeroTelefoon() {
  const [actief, setActief] = useState(0);
  const [vorige, setVorige] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const index = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    let zichtbaar = true;
    const io = new IntersectionObserver(
      ([e]) => (zichtbaar = !!e?.isIntersecting),
    );
    io.observe(el);
    const t = window.setInterval(() => {
      if (!zichtbaar || document.hidden) return;
      const a = index.current;
      index.current = (a + 1) % SITES.length;
      setVorige(a);
      setActief(index.current);
    }, DUUR);
    return () => {
      window.clearInterval(t);
      io.disconnect();
    };
  }, []);

  const site = SITES[actief]!;

  return (
    <div
      ref={ref}
      className="golf-hero__telefoon sw-cta"
      style={{ "--sw-delay": "0.35s", "--sw-rise": "90px" } as CSSProperties}
    >
      <Link
        to={`/portfolio/${site.slug}`}
        className="golf-hero__telefoon-link"
        aria-label={`Bekijk de case ${site.naam}`}
      >
        {SITES.map((s, i) => (
          <picture key={s.slug}>
            <source
              media="(min-width: 1024px)"
              srcSet={s.srcSet}
              sizes="(min-width: 1536px) 360px, 24vw"
            />
            <img
              src={LEEG}
              width={1400}
              height={3358}
              alt={
                i === actief
                  ? `De mobiele website van ${s.naam} op een telefoon in een hand`
                  : ""
              }
              aria-hidden={i === actief ? undefined : true}
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "auto" : "low"}
              decoding="async"
              draggable={false}
              className={
                i === actief ? "actief" : i === vorige ? "vorige" : undefined
              }
              onTransitionEnd={i === actief ? () => setVorige(null) : undefined}
            />
          </picture>
        ))}
      </Link>
    </div>
  );
}
