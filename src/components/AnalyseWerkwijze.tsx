import { useEffect, useRef } from "react";

import { AnimatedButton } from "@/components/ui/animated-button";
import samenLaptop from "@/assets/analyse/samen-laptop.webp";
import samenLaptopSet from "@/assets/analyse/samen-laptop.webp?w=480;800;1200&format=webp&as=srcset";

const RAND = "hsl(var(--sw-rule) / 0.14)";

const stappen = [
  { titel: "Je vraagt de analyse aan", tekst: "Je website, naam en e-mailadres zijn genoeg." },
  { titel: "Wij bekijken je site", tekst: "Vindbaarheid, mobiele weergave, design en teksten." },
  { titel: "Je krijgt de PDF per mail", tekst: "Binnen 1 werkdag, met concrete verbeterpunten." },
  { titel: "Jij beslist wat je ermee doet", tekst: "Zelf oppakken of samen met ons. Je zit nergens aan vast." },
];

/**
 * Hoe de analyse verloopt: links een grote foto tot de rand van het scherm, die
 * boven de sectie uitsteekt en rustig meeschuift, rechts de zin, en daaronder
 * de vier stappen naast elkaar, zodat alles tegelijk te lezen is.
 */
const AnalyseWerkwijze = ({ onKnop }: { onKnop: () => void }) => {
  const kaderRef = useRef<HTMLDivElement>(null);
  const fotoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const kader = kaderRef.current, foto = fotoRef.current;
    if (!kader || !foto || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const werkBij = () => {
      frame = 0;
      const { top, height } = kader.getBoundingClientRect();
      const vh = window.innerHeight;
      const midden = Math.max(-1, Math.min(1, (top + height / 2 - vh / 2) / (vh / 2 + height / 2)));
      foto.style.transform = `translate3d(0, ${(-midden * 7).toFixed(2)}%, 0)`;
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
    <section className="sw-paper relative z-10 pb-14 md:pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,52vw)_minmax(0,1fr)] lg:items-center">
        <div
          ref={kaderRef}
          className="relative aspect-[4/5] overflow-hidden lg:-mt-24 lg:aspect-[5/4] lg:rounded-r-3xl"
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

      <div className="container mx-auto px-4 sm:px-6">
        <ol className="mt-12 grid grid-cols-1 border-t sm:grid-cols-2 lg:mt-20 lg:grid-cols-4" style={{ borderColor: RAND }}>
          {stappen.map(({ titel, tekst }, i) => (
            <li
              key={titel}
              className={`border-b py-6 sm:border-b-0 sm:pr-6 sm:pt-7 lg:pr-8 ${i > 0 ? "lg:border-l lg:pl-8" : ""}`}
              style={{ borderColor: RAND }}
            >
              <h3 className="text-xl font-bold tracking-tight sw-ink md:text-2xl" style={{ lineHeight: 1.12 }}>
                {titel}
              </h3>
              <p className="mt-2 text-[0.9375rem] font-light leading-relaxed" style={{ color: "hsl(var(--sw-ink) / 0.65)" }}>
                {tekst}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default AnalyseWerkwijze;
