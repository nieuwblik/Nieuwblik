import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "@/lib/router-compat";
import maat from "@/data/heroTelefoon.json";
import handSet from "@/assets/hero/hero-hand.webp?w=420;700;1050;1400&format=webp&as=srcset";
import daniqueSet from "@/assets/hero/hero-scherm-danique-kwakman.webp?w=360;540;720&format=webp&as=srcset";
import kyodaiSet from "@/assets/hero/hero-scherm-kyodai-originals.webp?w=360;540;720&format=webp&as=srcset";
import puurSet from "@/assets/hero/hero-scherm-puur-in-harmonie.webp?w=360;540;720&format=webp&as=srcset";

/**
 * Hand met telefoon in de homepage-hero. De foto (Higgsfield, zie
 * scripts/mockups/hero-telefoon.mjs) heeft een doorzichtig scherm; daarachter
 * schuiven de mobiele sites van drie cases als één strook voorbij, alsof iemand met
 * de duim naar de volgende site scrolt. De statusbalk blijft staan en wisselt
 * halverwege de veeg van kleur mee; de strook begint eronder en toont de screenshots
 * zonder hun eigen statusbalk.
 *
 * - Alleen vanaf 1024px breed; daaronder is er naast de tekst geen ruimte. Een
 *   <picture> laadt de beelden ook pas vanaf die breedte.
 * - Na de laatste site volgt een kopie van de eerste; daarna springt de strook
 *   ongemerkt terug naar het begin.
 * - Klikken opent de case die in beeld is. Scrollen stopt buiten beeld, bij een
 *   verborgen tabblad en bij reduced motion.
 */
const SITES = [
  { slug: "danique-kwakman", naam: "Danique Kwakman", srcSet: daniqueSet },
  { slug: "kyodai-originals", naam: "Kyodai Originals", srcSet: kyodaiSet },
  { slug: "puur-in-harmonie", naam: "Puur in Harmonie", srcSet: puurSet },
];
/** 1×1 transparant: wat de img-elementen onder 1024px laden. */
const LEEG =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
const VANAF = "(min-width: 1024px)";
/** Tijd per site in ms (inclusief de veeg). */
const DUUR = 4200;
/** Duur van de veeg in ms; gelijk aan de transitie in styles.css. */
const VEEG = 1100;

const { scherm, statusbalk } = maat;
/** Het schermvlak ligt een fractie ruimer dan het gat, zodat er geen naad ontstaat. */
const RUIM = 0.4;
const schermStijl: CSSProperties = {
  left: `${scherm.links - RUIM}%`,
  top: `${scherm.boven - RUIM}%`,
  width: `${scherm.breedte + 2 * RUIM}%`,
  height: `${scherm.hoogte + 2 * RUIM}%`,
  // Afronding als percentage van de breedte; verticaal omgerekend naar de hoogte.
  borderRadius: `${scherm.radius}% / ${(scherm.radius * scherm.breedte * maat.breedte) / (scherm.hoogte * maat.hoogte)}%`,
};

export default function HeroTelefoon() {
  // Positie in de strook: 0..SITES.length (de laatste is de kopie van de eerste).
  const [positie, setPositie] = useState(0);
  const [springen, setSpringen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const huidig = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    let zichtbaar = true;
    const io = new IntersectionObserver(
      ([e]) => (zichtbaar = !!e?.isIntersecting),
    );
    io.observe(el);
    let terug = 0;
    const t = window.setInterval(() => {
      if (!zichtbaar || document.hidden) return;
      huidig.current += 1;
      setSpringen(false);
      setPositie(huidig.current);
      // Op de kopie van de eerste aangekomen: na de veeg ongemerkt terug naar 0.
      if (huidig.current === SITES.length)
        terug = window.setTimeout(() => {
          huidig.current = 0;
          setSpringen(true);
          setPositie(0);
        }, VEEG + 50);
    }, DUUR);
    return () => {
      window.clearInterval(t);
      window.clearTimeout(terug);
      io.disconnect();
    };
  }, []);

  const actief = positie % SITES.length;
  const site = SITES[actief]!;
  const strook = [...SITES, SITES[0]!];

  return (
    <div
      ref={ref}
      className="golf-hero__telefoon sw-cta"
      style={{ "--sw-delay": "0.5s", "--sw-rise": "56px" } as CSSProperties}
    >
      <Link
        to={`/portfolio/${site.slug}`}
        className="golf-hero__telefoon-link"
        aria-label={`Bekijk de case ${site.naam}`}
      >
        <div
          className="golf-hero__scherm"
          style={schermStijl}
          aria-hidden="true"
        >
          <div
            className={`golf-hero__strook${springen ? " springt" : ""}`}
            style={{
              top: `${statusbalk}%`,
              transform: `translateY(${-positie * 100}%)`,
            }}
          >
            {strook.map((s, i) => (
              <picture key={`${s.slug}-${i}`}>
                <source media={VANAF} srcSet={s.srcSet} sizes="300px" />
                <img
                  src={LEEG}
                  alt=""
                  width={720}
                  height={1565}
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                  draggable={false}
                />
              </picture>
            ))}
          </div>
          {/* Statusbalk blijft staan; per site een eigen kleur, gewisseld halverwege de veeg. */}
          <div
            className="golf-hero__statusbalk"
            style={{ height: `${statusbalk}%` }}
          >
            {SITES.map((s, i) => (
              <picture key={s.slug}>
                <source media={VANAF} srcSet={s.srcSet} sizes="300px" />
                <img
                  src={LEEG}
                  alt=""
                  width={720}
                  height={1565}
                  decoding="async"
                  draggable={false}
                  className={i === actief ? "actief" : undefined}
                />
              </picture>
            ))}
          </div>
        </div>
        <picture>
          <source
            media={VANAF}
            srcSet={handSet}
            sizes="(min-width: 1640px) 410px, 25vw"
          />
          <img
            className="golf-hero__hand"
            src={LEEG}
            width={maat.breedte}
            height={maat.hoogte}
            alt=""
            decoding="async"
            draggable={false}
          />
        </picture>
      </Link>
    </div>
  );
}
