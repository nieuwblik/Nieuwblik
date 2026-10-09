import { useEffect, useState } from "react";
import { ArrowUp, ChevronUp, Gauge, Search, TrendingUp } from "lucide-react";
import { useLocation } from "@/lib/router-compat";
import { companyInfo } from "@/config/company";
import { AnimatedButton } from "@/components/ui/animated-button";
import { getLenis } from "@/components/SmoothScroll";

const GROEN = "hsl(var(--sw-green))";
const INKT_65 = "hsl(var(--sw-ink) / 0.65)";
const RAND = "hsl(var(--sw-rule) / 0.12)";

// Pagina's waar het analysedeel niets toevoegt: al aan het converteren, of de
// pagina waar het zelf naartoe linkt. Daar blijven naar boven en WhatsApp over.
const HIDDEN_ON = ["/gratis-website-analyse", "/contact", "/bedankt", "/admin"];

// Dezelfde drie onderdelen als op /gratis-website-analyse.
const CHECKS = [
  { icon: Gauge, title: "Snelheid & techniek", text: "Laadtijd, mobielvriendelijkheid en technische SEO-basis." },
  { icon: Search, title: "Vindbaarheid", text: "Hoe goed scoort je site in Google en AI-zoekmachines zoals ChatGPT." },
  { icon: TrendingUp, title: "Conversiekansen", text: "Waar bezoekers afhaken en wat dat je aan omzet kost." },
];

const WhatsAppIcoon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="h-6 w-6" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

/**
 * Eén zwevende balk rechtsonder: de gratis website-analyse, terug naar boven
 * en WhatsApp, naadloos naast elkaar. De pijl bij de analyse klapt de uitleg
 * omhoog open, in hetzelfde blok. Vervangt de losse WhatsApp-knop en de oude
 * analyse-pop-up.
 *
 * De balk staat er altijd en heeft altijd dezelfde breedte; terug naar boven
 * is bovenaan de pagina alleen gedimd. Alles is fixed, dus geen verschuiving
 * van de pagina.
 */
const ZwevendeKnoppen = () => {
  const { pathname } = useLocation();
  const [bovenaan, setBovenaan] = useState(true);
  const [open, setOpen] = useState(false);

  const metAnalyse = !HIDDEN_ON.some((pad) => pathname.startsWith(pad));

  useEffect(() => {
    const opScroll = () => setBovenaan(window.scrollY < 200);
    opScroll();
    window.addEventListener("scroll", opScroll, { passive: true });
    return () => window.removeEventListener("scroll", opScroll);
  }, []);

  // Op een nieuwe pagina dicht beginnen.
  useEffect(() => setOpen(false), [pathname]);

  const naarBoven = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { immediate: reduced });
    else window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 overflow-hidden rounded-2xl border bg-white shadow-[0_18px_45px_-18px_rgba(0,0,0,0.4)] md:bottom-6 md:right-6 ${metAnalyse ? "w-[calc(100vw-2rem)] max-w-[360px]" : ""}`}
      style={{ borderColor: RAND }}
    >
      {metAnalyse && (
        <div
          id="analyse-meer"
          className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
          inert={!open}
        >
          <div className="overflow-hidden">
            <div className="border-b px-4 pb-4 pt-4" style={{ borderColor: RAND }}>
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
      )}

      <div className="flex h-14 items-stretch">
        {metAnalyse && (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="analyse-meer"
            className="flex min-w-0 flex-1 items-center gap-3 pl-3 pr-2 text-left transition-colors hover:bg-[hsl(var(--sw-green)/0.04)]"
          >
            <span
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
              style={{ background: "hsl(var(--sw-green) / 0.08)" }}
            >
              <Gauge className="h-4 w-4" style={{ color: GROEN }} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold leading-tight sw-ink">Gratis website-analyse</span>
              <span className="block truncate text-xs" style={{ color: INKT_65 }}>
                Binnen 24 uur, vrijblijvend
              </span>
            </span>
            <ChevronUp
              className={`h-4 w-4 shrink-0 transition-transform duration-300 motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
              style={{ color: GROEN }}
              aria-hidden="true"
            />
            <span className="sr-only">{open ? "Minder tonen" : "Meer over de gratis website-analyse"}</span>
          </button>
        )}

        <button
          type="button"
          onClick={naarBoven}
          aria-label="Terug naar boven"
          disabled={bovenaan}
          className={`flex w-14 shrink-0 items-center justify-center transition-colors hover:bg-[hsl(var(--sw-green)/0.04)] disabled:cursor-default disabled:hover:bg-transparent ${metAnalyse ? "border-l" : ""}`}
          style={{ borderColor: RAND }}
        >
          <ArrowUp
            className={`h-5 w-5 transition-opacity duration-300 ${bovenaan ? "opacity-30" : "opacity-100"}`}
            style={{ color: GROEN }}
            aria-hidden="true"
          />
        </button>

        <a
          href={companyInfo.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat via WhatsApp"
          className="flex w-14 shrink-0 items-center justify-center bg-[#25D366] transition-colors hover:bg-[#20bd5a]"
        >
          <WhatsAppIcoon />
        </a>
      </div>
    </div>
  );
};

export default ZwevendeKnoppen;
