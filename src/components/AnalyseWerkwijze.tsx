import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { AnimatedButton } from "@/components/ui/animated-button";
import { REVIEWS } from "@/config/business";
import samenLaptop from "@/assets/analyse/samen-laptop.webp";
import samenLaptopSet from "@/assets/analyse/samen-laptop.webp?w=480;800;1200&format=webp&as=srcset";

const RAND = "hsl(var(--sw-rule) / 0.14)";

const cijfers = [
  { waarde: "€0", regels: ["kost de analyse,", "zonder verplichtingen"] },
  { waarde: "1 werkdag", regels: ["en de PDF", "staat in je mail"] },
  { waarde: "4 onderdelen", regels: ["vindbaarheid, mobiel,", "design en teksten"] },
  { waarde: REVIEWS.scoreLabel, regels: ["op Google, op basis", `van ${REVIEWS.aantalLabel}reviews`] },
];

const ACCENTLIJN = "linear-gradient(90deg, transparent, hsl(var(--sw-green)), transparent)";

/**
 * Hoe de analyse verloopt: links een grote foto tot de rand van het scherm, die
 * boven de sectie uitsteekt en rustig meeschuift, rechts de zin, en daaronder
 * vier kerncijfers. Op desktop licht er steeds één op en schuift een groen
 * stukje lijn mee; aanwijzen houdt dat cijfer vast.
 */
const AnalyseWerkwijze = ({ onKnop }: { onKnop: () => void }) => {
  const kaderRef = useRef<HTMLDivElement>(null);
  const fotoRef = useRef<HTMLImageElement>(null);
  const [actief, setActief] = useState(0);
  const [vast, setVast] = useState(false);
  const [wisselt, setWisselt] = useState(false);

  // ScrollTrigger hangt aan dezelfde klok als Lenis (zie SmoothScroll), dus de foto
  // beweegt in hetzelfde frame als de pagina. Een eigen scroll-luisteraar liep daar
  // een frame achteraan, en dat voelde hakkelig.
  //
  // De beweging begint op 0 bij scrollpositie 0: dat is ook de stand uit de
  // server-HTML, dus er verspringt niets bij het laden. Scrub zonder naloop,
  // anders schuift de foto na een refresh zichtbaar naar zijn plek.
  useEffect(() => {
    const kader = kaderRef.current, foto = fotoRef.current;
    if (!kader || !foto || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        foto,
        { yPercent: 0 },
        {
          yPercent: 11,
          ease: "none",
          scrollTrigger: { trigger: kader, start: 0, end: "bottom top", scrub: true },
        },
      );
    });
    return () => ctx.revert();
  }, []);

  // Om de beurt oplichten, alleen op desktop en niet bij "minder beweging".
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(min-width: 1024px)").matches) return;
    setWisselt(true);
    if (vast) return;
    const id = window.setInterval(() => setActief((i) => (i + 1) % cijfers.length), 2800);
    return () => window.clearInterval(id);
  }, [vast]);

  return (
    <section className="sw-paper relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,52vw)_minmax(0,1fr)] lg:items-center">
        <div
          ref={kaderRef}
          className="relative aspect-[4/5] overflow-hidden lg:-mt-24 lg:aspect-square lg:rounded-r-3xl"
        >
          <img
            ref={fotoRef}
            src={samenLaptop}
            srcSet={samenLaptopSet}
            sizes="(min-width: 1024px) 52vw, 100vw"
            width="1400"
            height="2087"
            alt="Twee mensen bekijken samen een website op een laptop"
            decoding="async"
            fetchPriority="low"
            className="absolute inset-x-0 -top-[14%] h-[116%] w-full object-cover object-center will-change-transform"
          />
        </div>

        <div className="px-4 pt-12 sm:px-6 lg:px-16 lg:pt-0 xl:px-20">
          <h2 className="pf-inleiding">
            Je vult je website in en wij doen de rest. Binnen 1 werkdag heb je een PDF in je mail, en daarna beslis jij
            wat je ermee doet.
          </h2>
          <div className="mt-8">
            <AnimatedButton onClick={onKnop} size="lg">
              Ontvang mijn gratis analyse
            </AnimatedButton>
          </div>
        </div>
      </div>

      <div className="mt-14 lg:mt-20">
        <div className="relative border-y" style={{ borderColor: RAND }}>
          {/* Het stukje groene lijn schuift mee met het actieve cijfer. */}
          {wisselt &&
            ["-top-px", "-bottom-px"].map((plek) => (
              <span
                key={plek}
                aria-hidden="true"
                className={`absolute left-0 h-px w-1/4 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${plek}`}
                style={{ background: ACCENTLIJN, transform: `translateX(${actief * 100}%)` }}
              />
            ))}
          <div className="grid cursor-default grid-cols-2 lg:grid-cols-4" onMouseLeave={() => setVast(false)}>
            {cijfers.map(({ waarde, regels }, i) => (
              <div key={waarde} className="flex flex-col items-center px-3 py-10 text-center lg:py-14">
                <div
                  onMouseEnter={() => {
                    setVast(true);
                    setActief(i);
                  }}
                  className="transition-opacity duration-500"
                  style={{ opacity: wisselt && i !== actief ? 0.45 : 1 }}
                >
                  <p
                    className="text-[2rem] font-normal leading-none sw-ink md:text-5xl"
                    style={{ letterSpacing: "-0.03em" }}
                  >
                    {waarde}
                  </p>
                  <div className="mt-3 text-sm leading-snug md:text-base" style={{ color: "hsl(var(--sw-ink) / 0.75)" }}>
                    {regels.map((regel) => (
                      <span key={regel} className="block">
                        {regel}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnalyseWerkwijze;
