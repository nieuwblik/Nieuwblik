import { useEffect, useState } from "react";
import { ArrowUp, ChevronUp, Gauge, Search, TrendingUp, X } from "lucide-react";
import { useLocation } from "@/lib/router-compat";
import { companyInfo } from "@/config/company";
import { AnimatedButton } from "@/components/ui/animated-button";
import { getLenis } from "@/components/SmoothScroll";

const GROEN = "hsl(var(--sw-green))";
const INKT_65 = "hsl(var(--sw-ink) / 0.65)";
const RAND = "hsl(var(--sw-rule) / 0.12)";

// Zelfde sleutel als de oude pop-up: wie hem toen sloot, ziet het blok nu ook niet.
const DISMISS_KEY = "freeAnalysisPopupDismissed";
// Pagina's waar het analyseblok niets toevoegt: al aan het converteren, of de
// pagina waar het blok zelf naartoe linkt.
const HIDDEN_ON = ["/gratis-website-analyse", "/contact", "/bedankt", "/admin"];

// Dezelfde drie onderdelen als op /gratis-website-analyse.
const CHECKS = [
  { icon: Gauge, title: "Snelheid & techniek", text: "Laadtijd, mobielvriendelijkheid en technische SEO-basis." },
  { icon: Search, title: "Vindbaarheid", text: "Hoe goed scoort je site in Google en AI-zoekmachines zoals ChatGPT." },
  { icon: TrendingUp, title: "Conversiekansen", text: "Waar bezoekers afhaken en wat dat je aan omzet kost." },
];

const WhatsAppIcoon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="h-7 w-7" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

/**
 * Zwevende knoppen rechtsonder: terug naar boven, WhatsApp en een compact blok
 * voor de gratis website-analyse dat met de pijl openklapt. Vervangt de losse
 * WhatsApp-knop en de pop-up linksonder.
 *
 * WhatsApp staat er altijd (ook in de server-HTML). De knop naar boven komt na
 * één schermhoogte scrollen, het analyseblok na anderhalf scherm, net als de
 * oude pop-up. Alles is fixed gepositioneerd, dus verschijnen geeft geen
 * verschuiving van de pagina.
 */
const ZwevendeKnoppen = () => {
  const { pathname } = useLocation();
  const [naarBovenZichtbaar, setNaarBovenZichtbaar] = useState(false);
  const [drempelBereikt, setDrempelBereikt] = useState(false);
  const [gesloten, setGesloten] = useState(false);
  const [open, setOpen] = useState(false);

  const verborgenHier = HIDDEN_ON.some((pad) => pathname.startsWith(pad));

  useEffect(() => {
    try {
      if (sessionStorage.getItem(DISMISS_KEY)) setGesloten(true);
    } catch {
      // Geen sessionStorage (privévenster): het blok gewoon tonen.
    }
    const opScroll = () => {
      const y = window.scrollY;
      const h = window.innerHeight;
      setNaarBovenZichtbaar(y > h);
      if (y > h * 1.25) setDrempelBereikt(true);
    };
    opScroll();
    window.addEventListener("scroll", opScroll, { passive: true });
    return () => window.removeEventListener("scroll", opScroll);
  }, []);

  // Op een nieuwe pagina dicht beginnen.
  useEffect(() => setOpen(false), [pathname]);

  const sluit = () => {
    setGesloten(true);
    setOpen(false);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // Zie boven.
    }
  };

  const naarBoven = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { immediate: reduced });
    else window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  const toonAnalyse = drempelBereikt && !gesloten && !verborgenHier;

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 md:bottom-8 md:right-8">
      {toonAnalyse && (
        <div
          className="pointer-events-auto w-[calc(100vw-2.5rem)] max-w-[330px] overflow-hidden rounded-2xl border bg-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.35)] animate-in fade-in slide-in-from-bottom-4 duration-500 motion-reduce:animate-none"
          style={{ borderColor: RAND }}
        >
          <div className="flex items-center gap-2 p-3 pl-4">
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="analyse-meer"
              className="flex min-w-0 flex-1 items-center gap-3 text-left"
            >
              <span
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                style={{ background: "hsl(var(--sw-green) / 0.08)" }}
              >
                <Gauge className="h-4 w-4" style={{ color: GROEN }} aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[0.9375rem] font-bold leading-tight sw-ink">Gratis website-analyse</span>
                <span className="mt-0.5 block text-xs" style={{ color: INKT_65 }}>
                  Binnen 24 uur, vrijblijvend
                </span>
              </span>
              <span
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors hover:bg-[hsl(var(--sw-green)/0.06)]"
                style={{ borderColor: RAND }}
              >
                <ChevronUp
                  className={`h-4 w-4 transition-transform duration-300 motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
                  style={{ color: GROEN }}
                  aria-hidden="true"
                />
                <span className="sr-only">{open ? "Minder tonen" : "Meer over de gratis website-analyse"}</span>
              </span>
            </button>
            <button
              type="button"
              onClick={sluit}
              aria-label="Sluiten"
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div
            id="analyse-meer"
            className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            inert={!open}
          >
            <div className="overflow-hidden">
              <div className="border-t px-4 pb-4 pt-4" style={{ borderColor: RAND }}>
                <p className="text-sm font-light leading-relaxed" style={{ color: INKT_65 }}>
                  Ontdek in 24 uur waar jouw website kansen laat liggen.
                </p>
                <ul className="mt-4 space-y-3">
                  {CHECKS.map(({ icon: Icon, title, text }) => (
                    <li key={title} className="flex items-start gap-3">
                      <Icon className="mt-0.5 h-4 w-4 shrink-0" style={{ color: GROEN }} aria-hidden="true" />
                      <span>
                        <span className="block text-sm font-semibold sw-ink">{title}</span>
                        <span className="block text-xs leading-relaxed" style={{ color: INKT_65 }}>
                          {text}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
                <AnimatedButton to="/gratis-website-analyse" size="sm" className="mt-4 w-full">
                  Start analyse
                </AnimatedButton>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="pointer-events-auto flex items-center gap-3">
        <button
          type="button"
          onClick={naarBoven}
          aria-label="Terug naar boven"
          tabIndex={naarBovenZichtbaar ? 0 : -1}
          aria-hidden={!naarBovenZichtbaar}
          className={`flex h-12 w-12 items-center justify-center rounded-full border bg-white shadow-lg transition-all duration-300 hover:shadow-xl motion-reduce:transition-none ${naarBovenZichtbaar ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"}`}
          style={{ borderColor: RAND }}
        >
          <ArrowUp className="h-5 w-5" style={{ color: GROEN }} aria-hidden="true" />
        </button>
        <a
          href={companyInfo.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat via WhatsApp"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-all duration-300 hover:scale-110 hover:bg-[#20bd5a] hover:shadow-xl motion-reduce:transition-none"
        >
          <WhatsAppIcoon />
        </a>
      </div>
    </div>
  );
};

export default ZwevendeKnoppen;
