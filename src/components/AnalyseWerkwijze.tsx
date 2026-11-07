import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Reveal from "@/components/Reveal";
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

  // ScrollTrigger hangt aan dezelfde klok als Lenis (zie SmoothScroll), dus de foto
  // beweegt in hetzelfde frame als de pagina. Een eigen scroll-luisteraar liep daar
  // een frame achteraan, en dat voelde hakkelig.
  useEffect(() => {
    const kader = kaderRef.current, foto = fotoRef.current;
    if (!kader || !foto || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        foto,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: "none",
          scrollTrigger: { trigger: kader, start: "top bottom", end: "bottom top", scrub: 0.4 },
        },
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="sw-paper relative z-10 pb-14 md:pb-20">
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
            className="absolute inset-x-0 -top-[8%] h-[116%] w-full object-cover object-center will-change-transform"
          />
        </div>

        <div className="px-4 pt-12 sm:px-6 lg:px-16 lg:pt-0 xl:px-20">
          <Reveal afstand={32}>
            <h2 className="pf-inleiding">
              Je vult je website in en wij doen de rest. Binnen 1 werkdag heb je een PDF in je mail, en daarna beslis jij
              wat je ermee doet.
            </h2>
          </Reveal>
          <Reveal afstand={32} delay={0.08} className="mt-8">
            <AnimatedButton onClick={onKnop} size="lg">
              Ontvang mijn gratis analyse
            </AnimatedButton>
          </Reveal>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6">
        <ol className="mt-12 grid grid-cols-1 border-t sm:grid-cols-2 lg:mt-20 lg:grid-cols-4" style={{ borderColor: RAND }}>
          {stappen.map(({ titel, tekst }, i) => (
            <Reveal
              as="li"
              key={titel}
              afstand={28}
              delay={i * 0.07}
              className={`border-b py-6 sm:border-b-0 sm:pr-6 sm:pt-7 lg:pr-8 ${i > 0 ? "lg:border-l lg:pl-8" : ""}`}
              style={{ borderColor: RAND }}
            >
              <h3 className="text-xl font-bold tracking-tight sw-ink md:text-2xl" style={{ lineHeight: 1.12 }}>
                {titel}
              </h3>
              <p className="mt-2 text-[0.9375rem] font-light leading-relaxed" style={{ color: "hsl(var(--sw-ink) / 0.65)" }}>
                {tekst}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default AnalyseWerkwijze;
