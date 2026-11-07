import { useEffect, useRef, useState } from "react";

import { AnimatedButton } from "@/components/ui/animated-button";
import samenLaptop from "@/assets/analyse/samen-laptop.webp";
import samenLaptopSet from "@/assets/analyse/samen-laptop.webp?w=480;800;1200&format=webp&as=srcset";

const RAND = "hsl(var(--sw-rule) / 0.14)";
const GROEN = "hsl(var(--sw-green))";

const stappen = [
  { titel: "Je vraagt de analyse aan", tekst: "Je website, naam en e-mailadres zijn genoeg." },
  { titel: "Wij bekijken je site", tekst: "Vindbaarheid, mobiele weergave, design en teksten." },
  { titel: "Je krijgt de PDF per mail", tekst: "Binnen 1 werkdag, met concrete verbeterpunten." },
  { titel: "Jij beslist wat je ermee doet", tekst: "Zelf oppakken of samen met ons. Je zit nergens aan vast." },
];

/**
 * Hoe de analyse verloopt. Op desktop blijft de grote foto staan en schuift
 * mee met de parallax, terwijl de stappen een voor een oplichten en een groene
 * lijn meeloopt. Wie minder beweging wil en op kleinere schermen staat alles
 * gewoon onder elkaar.
 */
const AnalyseWerkwijze = ({ onKnop }: { onKnop: () => void }) => {
  const fotoRef = useRef<HTMLImageElement>(null);
  const kaderRef = useRef<HTMLDivElement>(null);
  const lijstRef = useRef<HTMLOListElement>(null);
  const [actief, setActief] = useState(0);
  const [voortgang, setVoortgang] = useState(0);
  const [beweegt, setBeweegt] = useState(false);

  useEffect(() => {
    const kader = kaderRef.current, foto = fotoRef.current, lijst = lijstRef.current;
    if (!kader || !foto || !lijst) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setBeweegt(true);

    let frame = 0;
    const werkBij = () => {
      frame = 0;
      const vh = window.innerHeight;

      // Parallax: alleen een transform, zolang de sectie in beeld is.
      const sectie = lijst.closest("section")!.getBoundingClientRect();
      const midden = Math.max(-1, Math.min(1, (sectie.top + sectie.height / 2 - vh / 2) / (vh / 2 + sectie.height / 2)));
      foto.style.transform = `translate3d(0, ${(-midden * 7).toFixed(2)}%, 0)`;

      // De stap die het midden van het scherm passeert, is de actieve.
      const { top, height } = lijst.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, (vh * 0.55 - top) / height));
      setVoortgang(p);
      setActief(Math.min(stappen.length - 1, Math.floor(p * stappen.length)));
    };
    const vraag = () => {
      if (!frame) frame = requestAnimationFrame(werkBij);
    };
    werkBij();
    window.addEventListener("scroll", vraag, { passive: true });
    window.addEventListener("resize", vraag);
    return () => {
      window.removeEventListener("scroll", vraag);
      window.removeEventListener("resize", vraag);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="sw-paper relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,52vw)_minmax(0,1fr)]">
        <div className="lg:relative">
          <div
            ref={kaderRef}
            className="relative aspect-[4/5] overflow-hidden lg:sticky lg:top-[calc(var(--header-height)_+_1rem)] lg:-mt-24 lg:aspect-auto lg:h-[calc(100svh_-_var(--header-height)_-_2rem)] lg:rounded-r-3xl"
          >
            <img
              ref={fotoRef}
              src={samenLaptop}
              srcSet={samenLaptopSet}
              sizes="(min-width: 1024px) 52vw, 100vw"
              width="1400"
              height="2087"
              alt="Twee mensen bekijken samen een website op een laptop"
              loading="lazy"
              className="absolute inset-x-0 -top-[8%] h-[116%] w-full object-cover object-center will-change-transform"
            />
          </div>
        </div>

        <div className="px-4 py-14 sm:px-6 lg:px-16 lg:pb-24 lg:pt-24 xl:px-20">
          <h2 className="pf-inleiding">
            Je vult je website in en wij doen de rest. Binnen 1 werkdag heb je een PDF in je mail, en daarna beslis jij
            wat je ermee doet.
          </h2>

          <ol ref={lijstRef} className="relative mt-12 border-l lg:mt-24" style={{ borderColor: RAND }}>
            {/* De lijn loopt mee met het scrollen. */}
            {beweegt && (
              <span
                aria-hidden="true"
                className="absolute -left-px top-0 hidden h-full w-px origin-top lg:block"
                style={{ background: GROEN, transform: `scaleY(${voortgang})` }}
              />
            )}
            {stappen.map(({ titel, tekst }, i) => (
              <li
                key={titel}
                className={`flex flex-col justify-center py-5 pl-6 transition-opacity duration-300 lg:min-h-[34svh] lg:pl-10 ${
                  beweegt && i !== actief ? "lg:opacity-25" : ""
                }`}
              >
                <h3 className="text-2xl font-bold tracking-tight sw-ink md:text-3xl lg:text-4xl" style={{ lineHeight: 1.08 }}>
                  {titel}
                </h3>
                <p className="mt-2 text-base font-light leading-relaxed md:text-lg" style={{ color: "hsl(var(--sw-ink) / 0.65)" }}>
                  {tekst}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-10 lg:mt-14">
            <AnimatedButton onClick={onKnop} size="lg">
              Ontvang mijn gratis analyse
            </AnimatedButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnalyseWerkwijze;
