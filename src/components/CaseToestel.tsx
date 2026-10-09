import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollBlob, useSchermScroll } from "@/components/SchermScroll";
import { useDarkNavSection } from "@/components/UnderlayNav";
import type { MockupScherm } from "@/components/CaseMockup";
import type { Toestel, ToestelFoto } from "@/data/toestellen";

/** Hoeveel ruimer het schermvlak is dan de gefitte hoeken; het masker snijdt het bij. */
const RUIMTE = 1.008;
/** Breedte van het scherm in CSS-pixels vóór de perspectieftransformatie. */
const SCHERM_BREEDTE = 1000;
/** Wachttijd na het openen voordat het toestel aangaat. */
const START_NA_MS = 400;
/** Duur van het aangaan (scherm licht op); daarna begint het scrollen. */
const AAN_DUUR_MS = 900;
/** Duur van de GSAP-aanzet (aan: "gsap"); daarna begint het scrollen. */
const AAN_DUUR_GSAP_MS = 1500;

/** Homografie die de vier hoeken van `bron` op die van `doel` legt, als CSS matrix3d. */
function perspectief(bron: number[][], doel: number[][]): string {
  const A: number[][] = [], b: number[] = [];
  for (let i = 0; i < 4; i++) {
    const [u, v] = bron[i]!, [x, y] = doel[i]!;
    A.push([u!, v!, 1, 0, 0, 0, -u! * x!, -v! * x!]); b.push(x!);
    A.push([0, 0, 0, u!, v!, 1, -u! * y!, -v! * y!]); b.push(y!);
  }
  for (let c = 0; c < 8; c++) {
    let m = c;
    for (let r = c + 1; r < 8; r++) if (Math.abs(A[r]![c]!) > Math.abs(A[m]![c]!)) m = r;
    [A[c], A[m]] = [A[m]!, A[c]!]; [b[c], b[m]] = [b[m]!, b[c]!];
    for (let r = 0; r < 8; r++) {
      if (r === c) continue;
      const f = A[r]![c]! / A[c]![c]!;
      for (let k = c; k < 8; k++) A[r]![k]! -= f * A[c]![k]!;
      b[r]! -= f * b[c]!;
    }
  }
  const [a, bb, cc, d, e, f, g, h] = b.map((v, i) => v / A[i]![i]!) as [number, number, number, number, number, number, number, number];
  // CSS matrix3d is kolom-voor-kolom.
  return `matrix3d(${a},${d},0,${g},${bb},${e},0,${h},0,0,1,0,${cc},${f},0,1)`;
}

/** Breedte van het scherm als deel van de foto, voor `sizes` van de screenshot. */
const schermBreedte = (o: ToestelFoto) => Math.round(Math.max(o.hoeken[1]![0] - o.hoeken[0]![0], o.hoeken[2]![0] - o.hoeken[3]![0]) * 100);

/**
 * Hero van een case met een toestel dat schuin in de foto staat (tablet in de
 * hand, monitor op een bureau): schermvullend (100vw × 100svh), met de site in
 * het scherm. Zelfde gedrag als de monitor-hero (useSchermScroll: automatisch
 * scrollen, wiel, groene blob).
 *
 * - Het scherm is een vlak op schermformaat (met afgeronde hoeken) dat met een
 *   perspectiefmatrix op de vier opgemeten hoeken wordt gelegd; die matrix wordt
 *   bij elke schermmaat opnieuw berekend. Tot dan is alleen de foto (toestel uit)
 *   te zien.
 * - Het masker (het groene vlak uit de originele foto) snijdt het scherm bij, zodat
 *   het de echte schermrand volgt en alles wat in de foto vóór het scherm zit
 *   (een duim op de rand) daar ook blijft. Het vlak is daarom iets ruimer (RUIMTE).
 * - Licht en kleur per toestel (`licht`, `filter`), afgestemd op de foto.
 * - Aangaan ("zacht"): het beeld komt zacht en iets te helder op en zakt naar normaal.
 * - Aangaan ("gsap"), als een moderne monitor die wakker wordt: het paneel licht
 *   op (zwart wordt net iets lichter) en het beeld komt van iets te groot, onscherp
 *   en overbelicht scherp op zijn plek. Geen gloed om het scherm en geen glinstering.
 */
const CaseToestel = ({ toestel, scherm, alt }: { toestel: Toestel; scherm: MockupScherm; alt: string }) => {
  const kaderRef = useRef<HTMLDivElement>(null);
  const schermRef = useRef<HTMLDivElement>(null);
  const beeldRef = useRef<HTMLDivElement>(null);
  const siteRef = useRef<HTMLImageElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);
  const blobBinnenRef = useRef<HTMLDivElement>(null);
  const { liggend, staand } = toestel;
  const metGsap = toestel.aan === "gsap";
  // Bij een donkere foto wordt de vaste header erboven licht.
  const donkerRef = useDarkNavSection<HTMLElement>();

  // Scherm op de juiste plek leggen, per oriëntatie en schermmaat.
  useEffect(() => {
    const kader = kaderRef.current, vlak = schermRef.current;
    if (!kader || !vlak) return;
    const mqStaand = window.matchMedia("(orientation: portrait)");
    const plaats = () => {
      const o = mqStaand.matches ? staand : liggend;
      const w = SCHERM_BREEDTE, h = SCHERM_BREEDTE / o.verhouding;
      const bw = kader.offsetWidth, bh = kader.offsetHeight;
      vlak.style.width = `${w}px`;
      vlak.style.height = `${h}px`;
      vlak.style.borderRadius = `${o.radius * w}px`;
      const hoeken = o.hoeken.map(([x, y]) => [x * bw, y * bh] as [number, number]);
      const mx = hoeken.reduce((t, p) => t + p[0], 0) / 4, my = hoeken.reduce((t, p) => t + p[1], 0) / 4;
      const ruim = hoeken.map(([x, y]) => [mx + (x - mx) * RUIMTE, my + (y - my) * RUIMTE]);
      vlak.style.transform = perspectief([[0, 0], [w, 0], [w, h], [0, h]], ruim);
      vlak.dataset["klaar"] = "ja";
    };
    plaats();
    const waarnemer = new ResizeObserver(plaats);
    waarnemer.observe(kader);
    mqStaand.addEventListener("change", plaats);
    return () => {
      waarnemer.disconnect();
      mqStaand.removeEventListener("change", plaats);
    };
  }, [liggend, staand]);

  useSchermScroll({
    vlakRef: schermRef,
    siteRef,
    blobRef,
    blobBinnenRef,
    startNaMs: START_NA_MS,
    aanDuurMs: metGsap ? AAN_DUUR_GSAP_MS : AAN_DUUR_MS,
    opAan: () => {
      const beeld = beeldRef.current;
      if (!beeld) return;
      if (!metGsap) {
        beeld.dataset["aan"] = "ja";
        return;
      }
      const filter = toestel.filter ?? "contrast(1)";
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(beeld, { opacity: 1, filter });
        gsap.set(schermRef.current, { backgroundColor: "#0f1012" });
        return;
      }
      gsap
        .timeline()
        // Paneel licht op: de achtergrondverlichting gaat aan.
        .fromTo(schermRef.current, { backgroundColor: "#000000" }, { backgroundColor: "#0f1012", duration: 0.35, ease: "power1.out" }, 0)
        // Beeld komt van iets te groot, onscherp en overbelicht scherp op zijn plek.
        .fromTo(
          beeld,
          { opacity: 0, scale: 1.04, filter: `blur(12px) brightness(1.6) ${filter}` },
          { opacity: 1, scale: 1, filter: `blur(0px) brightness(1) ${filter}`, duration: 1.25, ease: "power3.out" },
          0.2,
        );
    },
  });

  return (
    <section ref={toestel.donker ? donkerRef : undefined} aria-label={alt} className="relative h-[100svh] w-full overflow-hidden" style={{ "--ar": liggend.ar, "--zoom": toestel.zoom ?? 1, "--toestel-filter": toestel.filter ?? "contrast(1)", background: toestel.achtergrond } as React.CSSProperties}>
      <style>{`
        @media (orientation: portrait) { [data-case-toestel] { --ar: ${staand.ar}; --zoom: 1; } }
        [data-toestel-masker] {
          -webkit-mask-image: url("${liggend.masker}"); mask-image: url("${liggend.masker}");
          -webkit-mask-size: 100% 100%; mask-size: 100% 100%; -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
        }
        @media (orientation: portrait) {
          [data-toestel-masker] { -webkit-mask-image: url("${staand.masker}"); mask-image: url("${staand.masker}"); }
        }
        /* Tot de matrix staat, is alleen de foto (toestel uit) te zien. */
        [data-toestel-scherm] { visibility: hidden; }
        [data-toestel-scherm][data-klaar="ja"] { visibility: visible; }
        /* Kleurcorrectie van het toestel; de aan-animatie neemt hem mee. */
        [data-toestel-beeld] { opacity: 0; filter: var(--toestel-filter); }
        [data-toestel-beeld] { transform-origin: 50% 50%; }
        [data-toestel-beeld][data-aan="ja"] { animation: toestel-aan ${AAN_DUUR_MS}ms cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        @keyframes toestel-aan {
          0%   { opacity: 0; filter: brightness(1.35) var(--toestel-filter); }
          55%  { opacity: 1; filter: brightness(1.12) var(--toestel-filter); }
          100% { opacity: 1; filter: brightness(1) var(--toestel-filter); }
        }
        [data-toestel-licht] { box-shadow: inset 0 0 0 1px rgba(0,0,0,0.35); }
        @media (prefers-reduced-motion: reduce) { [data-toestel-beeld][data-aan="ja"] { animation: none; opacity: 1; } }
      `}</style>
      <div
        ref={kaderRef}
        data-case-toestel=""
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          // Cover, op liggende schermen eventueel ingezoomd (zoom per toestel) rond het midden.
          width: "calc(max(100vw, calc(100svh * var(--ar))) * var(--zoom))",
          height: "calc(max(100svh, calc(100vw / var(--ar))) * var(--zoom))",
        }}
      >
        <picture>
          <source media="(orientation: portrait)" srcSet={toestel.srcSetStaand} sizes="100vw" />
          <img
            src={toestel.src}
            srcSet={toestel.srcSet}
            sizes={`max(100vw, ${Math.round(liggend.ar * 100)}svh)`}
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            className="absolute inset-0 h-full w-full select-none"
            draggable={false}
          />
        </picture>

        {/* Masker in fotocoördinaten: het scherm alleen waar in de foto echt scherm was. */}
        <div data-toestel-masker="" className="pointer-events-none absolute inset-0">
          {/* data-lenis-prevent: het muiswiel hoort hier bij het scherm, niet bij de smooth scroll van de pagina. */}
          <div
            ref={schermRef}
            data-toestel-scherm=""
            data-lenis-prevent=""
            className="pointer-events-auto absolute left-0 top-0 origin-top-left overflow-hidden bg-black [@media(hover:hover)_and_(pointer:fine)]:cursor-none"
          >
            <div ref={beeldRef} data-toestel-beeld="" data-aan="nee" className="absolute inset-0 overflow-hidden">
              <img
                ref={siteRef}
                src={scherm.src}
                srcSet={scherm.srcSet}
                sizes={`(orientation: portrait) ${schermBreedte(staand)}vw, ${schermBreedte(liggend)}vw`}
                width={scherm.breedte}
                height={scherm.hoogte}
                alt={alt}
                draggable={false}
                className="block h-auto w-full select-none will-change-transform"
              />
            </div>
            <div data-toestel-licht="" aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ background: toestel.licht }} />
          </div>
        </div>
      </div>

      <ScrollBlob blobRef={blobRef} binnenRef={blobBinnenRef} />
    </section>
  );
};

export default CaseToestel;
