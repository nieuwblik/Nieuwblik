import { useEffect, useState } from "react";
import { ArrowUp, Gauge, Plus, Search, TrendingUp } from "lucide-react";
import { useLocation } from "@/lib/router-compat";
import { companyInfo } from "@/config/company";
import { AnimatedButton } from "@/components/ui/animated-button";
import { getLenis } from "@/components/SmoothScroll";

const GROEN = "hsl(var(--sw-green))";
const INKT_65 = "hsl(var(--sw-ink) / 0.65)";
const RAND = "hsl(var(--sw-rule) / 0.12)";
// Hover en toetsenbordfocus, gelijk voor elk wit vak in de balk.
const KNOP =
  "transition-colors hover:bg-[hsl(var(--sw-green)/0.05)] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[hsl(var(--sw-green))]";

// Zachte curve voor het openklappen: snel op gang, lang uitlopend.
const VLOEIEND = "cubic-bezier(0.22, 1, 0.36, 1)";

/**
 * De inhoud van het uitklapdeel komt na elkaar binnen (opdoemen en een klein
 * stukje omhoog) terwijl het blok groeit. Dichtklappen gaat in één keer en
 * sneller, zodat het niet traag aanvoelt.
 */
const verschijn = (open: boolean) =>
  `transition-[opacity,transform] motion-reduce:transition-none ${open ? "opacity-100 translate-y-0 duration-500" : "opacity-0 translate-y-2 duration-150"}`;
const vertraging = (open: boolean, i: number) => ({
  transitionTimingFunction: VLOEIEND,
  transitionDelay: open ? `${120 + i * 60}ms` : "0ms",
});

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
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="h-[22px] w-[22px]" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

/**
 * Eén zwevende balk rechtsonder: de gratis website-analyse, terug naar boven
 * en WhatsApp, naadloos naast elkaar. Het plusje bij de analyse klapt de
 * uitleg omhoog open, in hetzelfde blok. Vervangt de losse WhatsApp-knop en de oude
 * analyse-pop-up.
 *
 * De balk staat er altijd. Terug naar boven schuift pas in beeld na wat
 * scrollen. Alles is fixed, dus geen verschuiving van de pagina.
 */
const ZwevendeKnoppen = () => {
  const { pathname } = useLocation();
  const [bovenaan, setBovenaan] = useState(true);
  const [open, setOpen] = useState(false);

  const metAnalyse = !HIDDEN_ON.some((pad) => pathname.startsWith(pad));

  useEffect(() => {
    const opScroll = () => setBovenaan(window.scrollY < 300);
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
      className={`fixed bottom-4 right-4 z-50 overflow-hidden rounded-2xl border bg-white transition-shadow duration-500 md:bottom-6 md:right-6 ${open ? "shadow-[0_24px_60px_-18px_rgba(0,0,0,0.38)]" : "shadow-[0_12px_32px_-14px_rgba(0,0,0,0.3)]"} ${metAnalyse ? "w-[calc(100vw-2rem)] max-w-[360px]" : ""}`}
      style={{ borderColor: RAND, transitionTimingFunction: VLOEIEND }}
    >
      {metAnalyse && (
        <div
          id="analyse-meer"
          className={`grid transition-[grid-template-rows] motion-reduce:transition-none ${open ? "grid-rows-[1fr] duration-500" : "grid-rows-[0fr] duration-300"}`}
          style={{ transitionTimingFunction: VLOEIEND }}
          inert={!open}
        >
          <div className="overflow-hidden">
            <div className="border-b px-4 pb-4 pt-4" style={{ borderColor: RAND }}>
              <p className={`text-sm font-light leading-relaxed ${verschijn(open)}`} style={vertraging(open, 0)}>
                Ontdek in 24 uur waar jouw website kansen laat liggen.
              </p>
              <ul className="mt-4 space-y-3">
                {CHECKS.map(({ icon: Icon, title, text }, i) => (
                  <li key={title} className={`flex items-start gap-3 ${verschijn(open)}`} style={vertraging(open, i + 1)}>
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
              <div className={`mt-4 ${verschijn(open)}`} style={vertraging(open, CHECKS.length + 1)}>
                <AnimatedButton to="/gratis-website-analyse" size="sm" className="w-full">
                  Start analyse
                </AnimatedButton>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex h-[52px] items-stretch">
        {metAnalyse && (
          <>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="analyse-meer"
              className={`group flex min-w-0 flex-1 cursor-pointer items-center gap-3 pl-4 pr-3 text-left ${KNOP}`}
            >
              <Gauge className="h-[18px] w-[18px] shrink-0" style={{ color: GROEN }} aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[0.875rem] font-semibold leading-tight sw-ink">Gratis website-analyse</span>
                <span className="block truncate text-[0.75rem] leading-snug" style={{ color: INKT_65 }}>
                  Binnen 24 uur, vrijblijvend
                </span>
              </span>
              {/* Plus die bij openen een kruisje wordt: duidelijk iets anders dan de pijl naar boven. */}
              <Plus
                className={`h-[18px] w-[18px] shrink-0 transition-transform duration-500 motion-reduce:transition-none ${open ? "rotate-45" : ""}`}
                style={{ color: GROEN, transitionTimingFunction: VLOEIEND }}
                aria-hidden="true"
              />
              <span className="sr-only">{open ? "Minder tonen" : "Meer over de gratis website-analyse"}</span>
            </button>
          </>
        )}

        {/* Terug naar boven schuift pas in beeld na wat scrollen. Met analysedeel
            blijft de balk even breed (dat deel krimpt mee); zonder groeit hij. */}
        <div
          className={`relative flex shrink-0 overflow-hidden transition-[width,opacity] duration-500 motion-reduce:transition-none ${bovenaan ? "w-0 opacity-0" : "w-[52px] opacity-100"}`}
          style={{ transitionTimingFunction: VLOEIEND }}
          aria-hidden={bovenaan}
        >
          {metAnalyse && (
            <span aria-hidden="true" className="absolute bottom-3 left-0 top-3 w-px" style={{ background: RAND }} />
          )}
          <button
            type="button"
            onClick={naarBoven}
            aria-label="Terug naar boven"
            tabIndex={bovenaan ? -1 : 0}
            className={`flex w-[52px] shrink-0 cursor-pointer items-center justify-center ${KNOP}`}
          >
            <ArrowUp className="h-[18px] w-[18px]" style={{ color: GROEN }} aria-hidden="true" />
          </button>
        </div>

        <a
          href={companyInfo.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat via WhatsApp"
          className="flex w-[52px] shrink-0 cursor-pointer items-center justify-center bg-[hsl(var(--sw-green))] transition-colors hover:bg-[hsl(160_84%_11%)] focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white"
        >
          <WhatsAppIcoon />
        </a>
      </div>
    </div>
  );
};

export default ZwevendeKnoppen;
