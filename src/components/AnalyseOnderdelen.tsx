import type { ReactNode } from "react";

import Reveal from "@/components/Reveal";
import { GoogleG } from "@/components/GoogleReviewMuur";
import puurDesktop from "@/assets/analyse/puur-desktop.webp";
import puurMobiel from "@/assets/hero/hero-scherm-puur-in-harmonie.webp";

const RAND = "hsl(var(--sw-rule) / 0.1)";
const INKT_65 = "hsl(var(--sw-ink) / 0.65)";
const GROEN = "hsl(var(--sw-green))";

/** Het zoekresultaat van de site, zoals iemand het in Google ziet. */
const BeeldVindbaarheid = () => (
  <div className="w-full max-w-md self-center">
    <div className="flex h-10 items-center gap-3 rounded-full border px-4" style={{ borderColor: RAND }}>
      <GoogleG className="h-[18px] w-[18px] shrink-0" />
      <span className="truncate text-sm" style={{ color: INKT_65 }}>
        schoonheidssalon midwoud
      </span>
    </div>
    <div className="mt-5 px-1">
      <p className="text-xs" style={{ color: INKT_65 }}>
        puurinharmonie.nl
      </p>
      <p className="mt-1 text-base font-semibold leading-snug" style={{ color: GROEN }}>
        Holistische Schoonheidssalon Midwoud · Gezicht, Massage & Reiki
      </p>
      <span className="mt-3 block h-2 w-full rounded-full" style={{ background: "hsl(var(--sw-rule) / 0.08)" }} />
      <span className="mt-2 block h-2 w-3/4 rounded-full" style={{ background: "hsl(var(--sw-rule) / 0.08)" }} />
    </div>
  </div>
);

/** De telefoonweergave van de site, afgesneden door de onderrand. */
const BeeldMobiel = () => (
  <div
    className="mx-auto h-[260px] w-[176px] self-start overflow-hidden rounded-t-[26px] border-[5px] border-b-0"
    style={{ borderColor: "hsl(var(--sw-ink))" }}
  >
    <img src={puurMobiel} alt="" width="720" height="1565" loading="lazy" className="block w-full" />
  </div>
);

/** De desktopweergave in een browservenster, afgesneden door de onderrand. */
const BeeldDesign = () => (
  <div className="h-fit w-full max-w-md self-start overflow-hidden rounded-t-xl border border-b-0" style={{ borderColor: RAND }}>
    <div className="flex h-6 items-center gap-1.5 border-b px-3" style={{ borderColor: RAND }}>
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-1.5 w-1.5 rounded-full" style={{ background: "hsl(var(--sw-rule) / 0.16)" }} />
      ))}
    </div>
    <img src={puurDesktop} alt="" width="1200" height="750" loading="lazy" className="block w-full" />
  </div>
);

/** De kop van de site met een vraag erbij, zoals we teksten nalopen. */
const BeeldTeksten = () => (
  <div className="w-full max-w-md self-center">
    <p className="text-3xl font-medium leading-tight tracking-tight sw-ink md:text-[2.5rem]">
      <span style={{ background: "linear-gradient(transparent 64%, hsl(var(--sw-green) / 0.16) 64%)" }}>
        Rust uit bij
      </span>
      <br />
      PUUR in Harmonie
    </p>
    <p className="mt-4 text-sm" style={{ color: INKT_65 }}>
      Snapt een bezoeker dit in drie seconden?
    </p>
  </div>
);

const onderdelen: { titel: string; tekst: string; beeld: ReactNode }[] = [
  {
    titel: "Vindbaarheid",
    tekst: "Hoe goed je gevonden wordt in Google en AI-zoekmachines zoals ChatGPT.",
    beeld: <BeeldVindbaarheid />,
  },
  {
    titel: "Mobiele weergave",
    tekst: "Of je site goed werkt op telefoon, tablet en computer.",
    beeld: <BeeldMobiel />,
  },
  {
    titel: "Design",
    tekst: "Of je site er verzorgd uitziet en vertrouwen geeft.",
    beeld: <BeeldDesign />,
  },
  {
    titel: "Teksten",
    tekst: "Of bezoekers snel snappen wat je doet en wat ze moeten doen.",
    beeld: <BeeldTeksten />,
  },
];

/**
 * De vier onderdelen van de analyse, als vier gelijke kaarten. Alle beelden
 * laten dezelfde site zien (Puur in Harmonie), zodat het één verhaal is: zo
 * loopt de analyse door een website heen.
 */
const AnalyseOnderdelen = () => (
  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
    {onderdelen.map(({ titel, tekst, beeld }, i) => (
      <Reveal key={titel} afstand={24} delay={(i % 2) * 0.08} className="h-full">
        <article className="flex h-full flex-col overflow-hidden rounded-2xl border bg-white" style={{ borderColor: RAND }}>
          <div className="flex h-[280px] shrink-0 justify-center overflow-hidden px-6 pt-8 md:px-8" aria-hidden="true">
            {beeld}
          </div>
          <div className="border-t p-6 md:p-7" style={{ borderColor: RAND }}>
            <h3 className="text-xl font-bold tracking-tight sw-ink md:text-2xl">{titel}</h3>
            <p className="mt-2 text-[0.9375rem] leading-relaxed" style={{ color: INKT_65 }}>
              {tekst}
            </p>
          </div>
        </article>
      </Reveal>
    ))}
  </div>
);

export default AnalyseOnderdelen;
