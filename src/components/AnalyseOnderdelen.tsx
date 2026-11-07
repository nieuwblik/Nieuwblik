import type { ReactNode } from "react";

import Reveal from "@/components/Reveal";
import { GoogleG } from "@/components/GoogleReviewMuur";
import feigroBeeld from "@/assets/feigro-project-nieuwblik.webp";
import schermDanique from "@/assets/hero/hero-scherm-danique-kwakman.webp";
import schermKyodai from "@/assets/hero/hero-scherm-kyodai-originals.webp";
import schermPuur from "@/assets/hero/hero-scherm-puur-in-harmonie.webp";

const RAND = "hsl(var(--sw-rule) / 0.1)";
const INKT_65 = "hsl(var(--sw-ink) / 0.65)";
const GROEN = "hsl(var(--sw-green))";

/** Een zoekresultaat als grijze regels. */
const Resultaat = ({ klasse, top }: { klasse: string; top: number }) => (
  <div
    className={`absolute inset-x-0 flex h-12 flex-col justify-center gap-1.5 rounded-xl bg-white px-4 ${klasse}`}
    style={{ top, border: `1px solid ${RAND}` }}
  >
    <span className="h-2 w-2/5 rounded-full" style={{ background: "hsl(var(--sw-rule) / 0.14)" }} />
    <span className="h-2 w-4/5 rounded-full" style={{ background: "hsl(var(--sw-rule) / 0.07)" }} />
  </div>
);

/** Jouw site klimt in de zoekresultaten: de groene regel schuift naar boven. */
const BeeldVindbaarheid = () => (
  <div className="mx-auto w-full max-w-md">
    <div className="flex h-11 items-center gap-3 rounded-full bg-white px-4 shadow-[0_8px_24px_-16px_rgba(0,0,0,0.3)]">
      <GoogleG className="h-5 w-5 shrink-0" />
      <span className="truncate text-sm" style={{ color: INKT_65 }}>
        wat jouw klant zoekt
      </span>
    </div>
    <div className="relative mt-3 h-[152px]">
      <Resultaat klasse="analyse-rij-zakt" top={0} />
      <Resultaat klasse="analyse-rij-zakt" top={52} />
      <div
        className="analyse-rij-stijgt absolute inset-x-0 top-0 flex h-12 items-center justify-between rounded-xl px-4 text-sm font-semibold text-white shadow-[0_12px_28px_-14px_hsl(160_84%_16%/0.8)]"
        style={{ background: GROEN }}
      >
        jouwbedrijf.nl
        <span className="text-xs font-normal text-white/75">Gevonden</span>
      </div>
    </div>
  </div>
);

/** Echte klantsites op een telefoon, die rustig in elkaar overlopen. */
const BeeldMobiel = () => (
  <div className="absolute left-1/2 top-7 w-[176px] -translate-x-1/2 rounded-[30px] border-[6px] bg-white shadow-[0_24px_50px_-22px_rgba(0,0,0,0.45)] [border-color:hsl(var(--sw-ink))]">
    <div className="relative aspect-[720/1565] overflow-hidden rounded-[24px]">
      {[schermPuur, schermKyodai, schermDanique].map((scherm, i) => (
        <img
          key={scherm}
          src={scherm}
          alt=""
          width="720"
          height="1565"
          loading="lazy"
          className="analyse-scherm absolute inset-0 h-full w-full object-cover"
          style={{ animationDelay: `${i * 4}s` }}
        />
      ))}
    </div>
  </div>
);

/** Opgeleverd werk in een browservenster. */
const BeeldDesign = () => (
  <div className="absolute inset-x-6 top-7 overflow-hidden rounded-t-xl border border-b-0 bg-white shadow-[0_24px_50px_-22px_rgba(0,0,0,0.4)] md:inset-x-8" style={{ borderColor: RAND }}>
    <div className="flex h-7 items-center gap-1.5 border-b px-3" style={{ borderColor: RAND }}>
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-2 w-2 rounded-full" style={{ background: "hsl(var(--sw-rule) / 0.16)" }} />
      ))}
    </div>
    <img src={feigroBeeld} alt="" loading="lazy" className="block w-full" />
  </div>
);

/** Een tekst met aantekeningen, zoals in de analyse. */
const BeeldTeksten = () => (
  <div className="mx-auto w-full max-w-lg">
    <div className="rounded-xl bg-white p-5 shadow-[0_12px_32px_-20px_rgba(0,0,0,0.35)]">
      <p className="text-base font-medium leading-snug md:text-lg" style={{ color: "hsl(var(--sw-ink) / 0.4)" }}>
        <span className="analyse-streep">Wij bieden innovatieve oplossingen op maat</span>
      </p>
      <p className="mt-2 text-lg font-bold leading-snug tracking-tight sw-ink md:text-xl">
        <span className="analyse-marker">Wij maken daken in West-Friesland waterdicht</span>
      </p>
    </div>
    <p className="ml-auto mt-3 w-fit max-w-[85%] rounded-xl rounded-tr-sm px-3.5 py-2 text-sm font-medium text-white" style={{ background: GROEN }}>
      Nu snapt een bezoeker meteen wat je doet
    </p>
  </div>
);

const Kaart = ({
  beeld,
  titel,
  tekst,
  klasse,
  vertraging,
  gecentreerd = false,
}: {
  beeld: ReactNode;
  titel: string;
  tekst: string;
  klasse: string;
  vertraging: number;
  /** Het beeld midden in het vlak, in plaats van vanaf de onderrand. */
  gecentreerd?: boolean;
}) => (
  <Reveal afstand={24} delay={vertraging} className={`h-full ${klasse}`}>
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border bg-white" style={{ borderColor: RAND }}>
      <div
        className={`relative h-64 shrink-0 overflow-hidden ${gecentreerd ? "flex items-center px-6 md:px-8" : ""}`}
        style={{ background: "hsl(var(--sw-green) / 0.06)" }}
        aria-hidden="true"
      >
        {beeld}
      </div>
      <div className="p-6 md:p-7">
        <h3 className="text-xl font-bold tracking-tight sw-ink md:text-2xl">{titel}</h3>
        <p className="mt-2 text-[0.9375rem] leading-relaxed" style={{ color: INKT_65 }}>
          {tekst}
        </p>
      </div>
    </article>
  </Reveal>
);

/**
 * De vier onderdelen van de analyse, elk met een beeld van wat we bekijken:
 * een breed en een smal blok, en op de tweede rij andersom.
 */
const AnalyseOnderdelen = () => (
  <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
    <Kaart
      klasse="lg:col-span-7"
      vertraging={0}
      gecentreerd
      beeld={<BeeldVindbaarheid />}
      titel="Vindbaarheid"
      tekst="Hoe goed je gevonden wordt in Google en AI-zoekmachines zoals ChatGPT."
    />
    <Kaart
      klasse="lg:col-span-5"
      vertraging={0.08}
      beeld={<BeeldMobiel />}
      titel="Mobiele weergave"
      tekst="Of je site goed werkt op telefoon, tablet en computer."
    />
    <Kaart
      klasse="lg:col-span-5"
      vertraging={0}
      beeld={<BeeldDesign />}
      titel="Design"
      tekst="Of je site er verzorgd uitziet en vertrouwen geeft."
    />
    <Kaart
      klasse="lg:col-span-7"
      vertraging={0.08}
      gecentreerd
      beeld={<BeeldTeksten />}
      titel="Teksten"
      tekst="Of bezoekers snel snappen wat je doet en wat ze moeten doen."
    />
  </div>
);

export default AnalyseOnderdelen;
