import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDarkNavSection } from "@/components/TabNav";
import { perspectief } from "@/lib/perspectief";
import type { Toestel } from "@/data/toestellen";

/** Breedte van het scherm in CSS-pixels vóór de perspectieftransformatie. */
const SCHERM_BREEDTE = 1000;
/** Hoeveel ruimer het schermvlak is dan de gefitte hoeken; het masker snijdt het bij. */
const RUIMTE = 1.008;

export interface VoorNaBeelden {
  voor: string;
  voorSet: string;
  na: string;
  naSet: string;
  /** Labels op het scherm, bijvoorbeeld het jaar van de oude site. */
  voorLabel: string;
  naLabel: string;
}

/**
 * Voor en na: schermvullend (100vw × 100svh) een toestel met in het scherm de nieuwe
 * site, met de oude site eroverheen. Een schuif in het midden bepaalt hoeveel je van
 * de oude site ziet; slepen, klikken of de pijltjestoetsen verplaatsen hem.
 *
 * - Het scherm ligt met een perspectiefmatrix op de vier opgemeten hoeken (zoals in
 *   CaseToestel) en het masker volgt de echte schermrand.
 * - De schuif is een echte range-input over het scherm: toegankelijk met toetsenbord
 *   en schermlezer, en slepen werkt ook door de transformatie heen.
 * - Liggend vult de foto de sectie (cover). Staand staat de foto over de volle breedte
 *   zonder bij te snijden, met erboven en eronder de randkleuren van de foto; zo valt
 *   het scherm op smalle telefoons nooit buiten beeld.
 * - Eén keer, als de sectie in beeld komt, zwaait de schuif kort heen en weer als
 *   hint dat je hem kunt verplaatsen (niet bij minder beweging of na aanraken).
 */
const CaseVoorNa = ({ toestel, beelden, alt }: { toestel: Toestel; beelden: VoorNaBeelden; alt: string }) => {
  const sectieRef = useRef<HTMLElement | null>(null);
  const kaderRef = useRef<HTMLDivElement>(null);
  const schermRef = useRef<HTMLDivElement>(null);
  const aangeraakt = useRef(false);
  const [positie, setPositie] = useState(50);
  const { liggend, staand } = toestel;
  const donkerRef = useDarkNavSection<HTMLElement>();

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

  // Hint: één keer kort heen en weer zodra de sectie in beeld is.
  useEffect(() => {
    const sectie = sectieRef.current ?? donkerRef.current;
    if (!sectie || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const waarnemer = new IntersectionObserver(
      ([item]) => {
        if (!item?.isIntersecting || aangeraakt.current) return;
        waarnemer.disconnect();
        const punten = [50, 32, 68, 50];
        const duur = 2200, start = performance.now();
        const stap = (nu: number) => {
          if (aangeraakt.current) return;
          const t = Math.min(1, (nu - start) / duur);
          const deel = t * (punten.length - 1), i = Math.min(punten.length - 2, Math.floor(deel));
          const f = deel - i, zacht = f < 0.5 ? 2 * f * f : 1 - (-2 * f + 2) ** 2 / 2;
          setPositie(punten[i]! + (punten[i + 1]! - punten[i]!) * zacht);
          if (t < 1) frame = requestAnimationFrame(stap);
        };
        frame = requestAnimationFrame(stap);
      },
      { threshold: 0.6 },
    );
    waarnemer.observe(sectie);
    return () => {
      waarnemer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [donkerRef]);

  const rand = toestel.staandRand ?? { boven: toestel.achtergrond, onder: toestel.achtergrond };

  return (
    <section
      ref={toestel.donker ? donkerRef : sectieRef}
      aria-label={alt}
      className="relative h-[100svh] w-full overflow-hidden"
      style={{ "--ar": liggend.ar, background: toestel.achtergrond } as React.CSSProperties}
    >
      <style>{`
        @media (orientation: portrait) {
          [data-voorna-sectie] { background: linear-gradient(${rand.boven} 0%, ${rand.boven} 30%, ${rand.onder} 70%, ${rand.onder} 100%) !important; }
          [data-voorna-kader] { --ar: ${staand.ar}; width: 100vw !important; height: calc(100vw / var(--ar)) !important; }
          /* Boven- en onderrand van de foto lopen over in de randkleuren, zonder naad. */
          [data-voorna-foto] { -webkit-mask-image: linear-gradient(transparent 0, #000 7%, #000 93%, transparent 100%); mask-image: linear-gradient(transparent 0, #000 7%, #000 93%, transparent 100%); }
        }
        [data-voorna-masker] {
          -webkit-mask-image: url("${liggend.masker}"); mask-image: url("${liggend.masker}");
          -webkit-mask-size: 100% 100%; mask-size: 100% 100%; -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
        }
        @media (orientation: portrait) {
          [data-voorna-masker] { -webkit-mask-image: url("${staand.masker}"); mask-image: url("${staand.masker}"); }
        }
        [data-voorna-scherm] { visibility: hidden; }
        [data-voorna-scherm][data-klaar="ja"] { visibility: visible; }
        [data-voorna-schuif] { -webkit-appearance: none; appearance: none; background: transparent; }
        [data-voorna-schuif]::-webkit-slider-thumb { -webkit-appearance: none; width: 2px; height: 100vh; cursor: ew-resize; }
        [data-voorna-schuif]::-moz-range-thumb { width: 2px; height: 100vh; border: 0; background: transparent; cursor: ew-resize; }
        [data-voorna-schuif]:focus-visible + [data-voorna-greep] [data-voorna-knop] { outline: 4px solid rgba(255,255,255,0.9); outline-offset: 4px; }
      `}</style>
      <div data-voorna-sectie="" className="absolute inset-0" style={{ background: toestel.achtergrond }} />
      <div
        ref={kaderRef}
        data-voorna-kader=""
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ width: "max(100vw, calc(100svh * var(--ar)))", height: "max(100svh, calc(100vw / var(--ar)))" }}
      >
        <picture>
          <source media="(orientation: portrait)" srcSet={toestel.srcSetStaand} sizes="100vw" />
          <img
            src={toestel.src}
            srcSet={toestel.srcSet}
            sizes={`max(100vw, ${Math.round(liggend.ar * 100)}svh)`}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            data-voorna-foto=""
            className="absolute inset-0 h-full w-full select-none"
            draggable={false}
          />
        </picture>

        <div data-voorna-masker="" className="pointer-events-none absolute inset-0">
          <div
            ref={schermRef}
            data-voorna-scherm=""
            className="pointer-events-auto absolute left-0 top-0 origin-top-left overflow-hidden bg-black"
          >
            <img
              src={beelden.na}
              srcSet={beelden.naSet}
              sizes="70vw"
              alt="De nieuwe website"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full select-none object-cover object-top"
              draggable={false}
            />
            <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - positie}% 0 0)` }}>
              <img
                src={beelden.voor}
                srcSet={beelden.voorSet}
                sizes="70vw"
                alt="De oude website"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full select-none object-cover object-top"
                draggable={false}
              />
            </div>

            <span className="pointer-events-none absolute bottom-5 left-5 rounded-full bg-black/60 px-4 py-1.5 text-lg font-medium text-white backdrop-blur-sm">
              {beelden.voorLabel}
            </span>
            <span className="pointer-events-none absolute bottom-5 right-5 rounded-full bg-black/60 px-4 py-1.5 text-lg font-medium text-white backdrop-blur-sm">
              {beelden.naLabel}
            </span>

            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={positie}
              onChange={(e) => {
                aangeraakt.current = true;
                setPositie(Number(e.target.value));
              }}
              onPointerDown={() => {
                aangeraakt.current = true;
              }}
              aria-label="Schuif tussen de oude en de nieuwe website"
              data-voorna-schuif=""
              className="absolute inset-0 z-10 h-full w-full cursor-ew-resize"
            />
            <div data-voorna-greep="" className="pointer-events-none absolute inset-y-0 z-0" style={{ left: `${positie}%` }}>
              <span className="absolute inset-y-0 left-0 w-[3px] -translate-x-1/2 bg-white shadow-[0_0_18px_rgba(0,0,0,0.45)]" />
              <span
                data-voorna-knop=""
                className="absolute left-0 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[hsl(var(--sw-ink))] shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
              >
                <ChevronLeft className="h-6 w-6" strokeWidth={2.25} aria-hidden="true" />
                <ChevronRight className="-ml-1 h-6 w-6" strokeWidth={2.25} aria-hidden="true" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseVoorNa;
