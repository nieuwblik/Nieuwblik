import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
  type RefObject,
  type SVGProps,
} from "react";
import { flushSync } from "react-dom";
import {
  BookOpen,
  Calculator,
  ChevronDown,
  FileText,
  Gauge,
  House,
  Layers,
  MapPin,
  Monitor,
  PencilRuler,
  Plus,
  Search,
  Send,
  ShoppingBag,
  Star,
  Tag,
  TrendingUp,
  Users,
  X,
  ArrowRight,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "@/lib/router-compat";
import { getLenis } from "@/components/SmoothScroll";
import { AnimatedButton } from "@/components/ui/animated-button";
import { companyInfo } from "@/config/company";
import { SITE_URL } from "@/config/site";
import logoSrc from "@/assets/logo.webp";
import golfBeeld from "@/assets/hero/golf-desktop.webp";
import feigroDuim from "@/assets/feigro-project-nieuwblik.webp?w=480&format=webp";
import vvmadjoeDuim from "@/assets/vvmadjoe-portfolio.webp?w=96&format=webp";
import bundelDuim from "@/assets/bundelgeluk-portfolio-nieuw.webp?w=96&format=webp";
import taxiDuim from "@/assets/taxidrechterland.webp?w=96&format=webp";
import prideDuim from "@/assets/pridemobility-portfolio-nieuw.webp?w=96&format=webp";
import puurDuim from "@/assets/puurinharmonie.webp?w=96&format=webp";

/**
 * Tabblad-navigatie. Links het logo, daarnaast vaste tabbladen (Home, Portfolio,
 * Diensten met uitklapmenu, Prijzen). Elke andere pagina die je opent komt er als
 * eigen tabblad bij: sluitbaar, versleepbaar en onthouden tussen bezoeken. Het
 * plusje opent een overzicht van alle pagina's per categorie; op mobiel doet de
 * knop met de vier vakjes rechtsboven dat.
 *
 * Bovenaan is de balk doorzichtig (de golf in de hero loopt eronder door); na een
 * paar pixels scrollen schuift er glas in. Boven een donkere sectie (zie
 * useDarkNavSection) wordt alles licht.
 */

type Icoon = ComponentType<SVGProps<SVGSVGElement> & { strokeWidth?: number }>;

/** Vier vakjes, zelf getekend: het mobiele menu laat precies deze rects tot een kruisje draaien. */
function Raster(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

interface Pagina {
  pad: string;
  titel: string;
  Icoon: Icoon;
  /** Naam voor de icoonanimatie in de CSS. */
  ic?: string;
  beeld?: string | undefined;
}

const VAST: (Pagina & { menu?: boolean })[] = [
  { pad: "/", titel: "Home", Icoon: House, ic: "home", beeld: golfBeeld },
  {
    pad: "/portfolio",
    titel: "Portfolio",
    Icoon: Raster,
    ic: "portfolio",
    beeld: feigroDuim,
  },
  {
    pad: "/diensten",
    titel: "Diensten",
    Icoon: Layers,
    ic: "diensten",
    menu: true,
  },
  { pad: "/prijzen", titel: "Prijzen", Icoon: Tag, ic: "prijzen" },
];
const VAST_PADEN = new Set(VAST.map((p) => p.pad));

const DIENSTEN: Pagina[] = [
  {
    pad: "/diensten/website-op-maat",
    titel: "Website op maat",
    Icoon: PencilRuler,
  },
  { pad: "/diensten/webshops", titel: "Webshops", Icoon: ShoppingBag },
  { pad: "/diensten/e-commerce", titel: "E-commerce", Icoon: TrendingUp },
  { pad: "/seo-enkhuizen", titel: "SEO", Icoon: Search },
];

const CASES: Pagina[] = [
  {
    pad: "/portfolio/feigro-dakwerken",
    titel: "Feigro Dakwerken",
    Icoon: Raster,
    beeld: feigroDuim,
  },
  {
    pad: "/portfolio/vv-madjoe",
    titel: "VV Madjoe",
    Icoon: Raster,
    beeld: vvmadjoeDuim,
  },
  {
    pad: "/portfolio/een-bundel-geluk",
    titel: "Een Bundel Geluk",
    Icoon: Raster,
    beeld: bundelDuim,
  },
  {
    pad: "/portfolio/taxi-drechterland",
    titel: "Taxi Drechterland",
    Icoon: Raster,
    beeld: taxiDuim,
  },
  {
    pad: "/portfolio/pride-mobility-europe",
    titel: "Pride Mobility Europe",
    Icoon: Raster,
    beeld: prideDuim,
  },
  {
    pad: "/portfolio/puur-in-harmonie",
    titel: "Puur in Harmonie",
    Icoon: Raster,
    beeld: puurDuim,
  },
];

const OVERIG: Pagina[] = [
  { pad: "/website-laten-maken", titel: "Website laten maken", Icoon: Monitor },
  { pad: "/over-ons", titel: "Over ons", Icoon: Users },
  { pad: "/reviews", titel: "Reviews", Icoon: Star },
  { pad: "/blog", titel: "Blog", Icoon: BookOpen },
  {
    pad: "/wat-kost-een-website",
    titel: "Wat kost een website",
    Icoon: Calculator,
  },
  { pad: "/contact", titel: "Start je project", Icoon: Send },
  {
    pad: "/gratis-website-analyse",
    titel: "Gratis website-analyse",
    Icoon: Gauge,
  },
  { pad: "/werkgebied", titel: "Werkgebied", Icoon: MapPin },
  { pad: "/privacy", titel: "Privacybeleid", Icoon: FileText },
  {
    pad: "/algemene-voorwaarden",
    titel: "Algemene voorwaarden",
    Icoon: FileText,
  },
  { pad: "/cookies", titel: "Cookies", Icoon: FileText },
];

const BEKEND = new Map<string, Pagina>(
  [...VAST, ...DIENSTEN, ...CASES, ...OVERIG].map((p) => [p.pad, p]),
);
const p = (pad: string) => BEKEND.get(pad)!;

/** Overzicht onder het plusje: zes categorieën in twee rijen van drie. */
const CATEGORIEEN: [string, Pagina[]][] = [
  ["Algemeen", [p("/"), p("/portfolio"), p("/prijzen")]],
  ["Diensten", [...DIENSTEN, p("/website-laten-maken")]],
  ["Portfolio", CASES],
  ["Over Nieuwblik", [p("/over-ons"), p("/reviews"), p("/werkgebied")]],
  ["Kennis", [p("/blog"), p("/wat-kost-een-website")]],
  ["Contact", [p("/contact"), p("/gratis-website-analyse")]],
];

const KLEIN: { label: string; href: string }[] = [
  { label: "LinkedIn ↗", href: companyInfo.social.linkedin },
  { label: "Privacybeleid", href: "/privacy" },
  { label: "Algemene voorwaarden", href: "/algemene-voorwaarden" },
  { label: "Cookies", href: "/cookies" },
];

/** Icoon voor een pagina die niet in de lijsten staat (blogartikel, case, plaats). */
function icoonVoor(pad: string): Icoon {
  const bekend = BEKEND.get(pad);
  if (bekend) return bekend.Icoon;
  if (pad.startsWith("/portfolio/")) return Raster;
  if (pad.startsWith("/diensten/")) return Layers;
  if (pad.startsWith("/blog/")) return BookOpen;
  if (pad.startsWith("/werkgebied/") || pad.startsWith("/regio/"))
    return MapPin;
  return FileText;
}

// ── Opgeslagen tabbladen ───────────────────────────────────────────────────
interface Extra {
  pad: string;
  titel: string;
  /** Niet opgeslagen: beeld-URL's veranderen per deploy en worden bij het tekenen opgezocht. */
  beeld?: string | undefined;
}
const OPSLAG = "nb-tabbladen";
const MAX_EXTRA = 6;
/** Minimale breedte van een extra tabblad (gelijk aan min-width in de CSS). */
const TAB_MIN = 128;

function leesOpslag(): Extra[] {
  try {
    const v = JSON.parse(localStorage.getItem(OPSLAG) ?? "[]");
    return Array.isArray(v)
      ? v
          .filter(
            (x) =>
              x &&
              typeof x.pad === "string" &&
              typeof x.titel === "string" &&
              !VAST_PADEN.has(x.pad),
          )
          .map((x) => ({ pad: x.pad, titel: x.titel }))
      : [];
  } catch {
    return [];
  }
}

/** Titel uit de <title>: het deel voor de eerste " | " of " - Nieuwblik". */
function titelUitDocument(): string {
  return (
    document.title
      .split(" | ")[0]!
      .replace(/\s+[-–]\s+Nieuwblik.*$/, "")
      .trim() || "Pagina"
  );
}

// ── Donkere secties ───────────────────────────────────────────────────────
/**
 * Een sectie met een donkere achtergrond meldt zich hiermee aan, zodat de balk
 * licht wordt zolang die sectie eronder zit:
 *   const ref = useDarkNavSection<HTMLElement>();
 *   <section ref={ref}> …donkere inhoud… </section>
 */
type RegisterDarkSection = (el: Element) => () => void;
const DarkSectionContext = createContext<RegisterDarkSection | null>(null);

export function useDarkNavSection<
  T extends Element = HTMLElement,
>(): RefObject<T | null> {
  const register = useContext(DarkSectionContext);
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !register) return;
    return register(el);
  }, [register]);
  return ref;
}

const cx = (...c: (string | false | null | undefined)[]) =>
  c.filter(Boolean).join(" ");

function Duim({
  pagina,
  className,
}: {
  pagina: Pagina | Extra;
  className?: string;
}) {
  // Alleen cases tonen hun beeld; andere pagina's hun icoon.
  if (pagina.beeld && pagina.pad.startsWith("/portfolio/")) {
    return (
      <img
        className={className ?? "tn-duim"}
        src={pagina.beeld}
        alt=""
        draggable={false}
      />
    );
  }
  const I = "Icoon" in pagina ? pagina.Icoon : icoonVoor(pagina.pad);
  return <I className="tn-ic" strokeWidth={1.75} aria-hidden="true" />;
}

export default function TabNav({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const kopRef = useRef<HTMLElement>(null);
  const tabsRef = useRef<HTMLElement>(null);
  const allesRef = useRef<HTMLDivElement>(null);

  const [extra, setExtra] = useState<Extra[]>([]);
  const [geladen, setGeladen] = useState(false);
  const [gescrold, setGescrold] = useState(false);
  const [donker, setDonker] = useState(false);
  const [allesOpen, setAllesOpen] = useState(false);
  const [mobielOpen, setMobielOpen] = useState(false);
  const [dienstenOpen, setDienstenOpen] = useState(false);
  const [voorbeeld, setVoorbeeld] = useState<{
    pagina: Pagina | Extra;
    left: number;
    top: number;
  } | null>(null);
  const [speel, setSpeel] = useState<string | null>(null);
  const [sleept, setSleept] = useState<string | null>(null);
  const dienstTimer = useRef(0);
  const vbTimer = useRef(0);
  const vorigPad = useRef<string | null>(null);

  // Opgeslagen tabbladen pas na de eerste tekening: de server kent ze niet.
  useEffect(() => {
    setExtra(leesOpslag());
    setGeladen(true);
  }, []);
  useEffect(() => {
    if (!geladen) return;
    try {
      localStorage.setItem(OPSLAG, JSON.stringify(extra));
    } catch {
      /* geen opslag */
    }
  }, [extra, geladen]);

  const verbergVoorbeeld = useCallback(() => {
    window.clearTimeout(vbTimer.current);
    setVoorbeeld(null);
  }, []);

  // Navigatie: alles dicht, icoon laten bewegen en een nieuwe pagina als tabblad toevoegen.
  useEffect(() => {
    setAllesOpen(false);
    setMobielOpen(false);
    setDienstenOpen(false);
    verbergVoorbeeld();
    if (vorigPad.current !== null && vorigPad.current !== pathname)
      setSpeel(pathname);
    // Bij de eerste weergave staat de <head> al goed (server-side gerenderd).
    const eerste = vorigPad.current === null;
    vorigPad.current = pathname;
    if (VAST_PADEN.has(pathname)) return;

    // De <title> en robots-meta van de nieuwe pagina staan er pas als de route
    // gerenderd is. Wacht tot de <head> verandert (of uiterlijk 8 s), en houd het
    // tabblad daarna bij zolang je op deze pagina bent.
    const beginTitel = document.title;
    const bekend = BEKEND.get(pathname);
    const zet = () => {
      // Een 404 of bedankpagina (noindex) wordt geen tabblad.
      if (document.querySelector('meta[name="robots"][content*="noindex"]')) {
        setExtra((v) => v.filter((x) => x.pad !== pathname));
        return;
      }
      const titel = bekend?.titel ?? titelUitDocument();
      setExtra((v) => {
        const i = v.findIndex((x) => x.pad === pathname);
        if (i >= 0) {
          if (v[i]!.titel === titel) return v;
          const kopie = v.slice();
          kopie[i] = { pad: pathname, titel };
          return kopie;
        }
        const nieuw = [...v, { pad: pathname, titel }];
        // Te veel tabbladen: het oudste (niet het actieve) valt weg.
        while (nieuw.length > MAX_EXTRA)
          nieuw.splice(
            nieuw.findIndex((x) => x.pad !== pathname),
            1,
          );
        return nieuw;
      });
    };
    const klaar = () => document.title !== beginTitel;
    if (bekend || eerste || klaar()) zet();
    const mo = new MutationObserver(() => {
      if (klaar()) zet();
    });
    mo.observe(document.head, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
    });
    const t = window.setTimeout(zet, 8000);
    return () => {
      mo.disconnect();
      window.clearTimeout(t);
    };
  }, [pathname, verbergVoorbeeld]);

  // Beelden van cases komen uit de projectdata; die laadt de casepagina toch al.
  const [caseBeelden, setCaseBeelden] = useState<Record<string, string>>({});
  const heeftCase = extra.some(
    (x) => x.pad.startsWith("/portfolio/") && !BEKEND.has(x.pad),
  );
  useEffect(() => {
    if (!heeftCase) return;
    let weg = false;
    import("@/data/projects").then((m) => {
      if (!weg)
        setCaseBeelden(
          Object.fromEntries(
            m.projects.map((pr) => [`/portfolio/${pr.slug}`, pr.image]),
          ),
        );
    });
    return () => {
      weg = true;
    };
  }, [heeftCase]);
  const tabbladen: Extra[] = extra.map((x) => ({
    ...x,
    beeld: BEKEND.get(x.pad)?.beeld ?? caseBeelden[x.pad],
  }));

  // Zoveel extra tabbladen als er in de balk passen (minimaal TAB_MIN breed); de
  // rest blijft bewaard en komt terug als er ruimte is. Het actieve blijft zichtbaar.
  const [past, setPast] = useState(MAX_EXTRA);
  useEffect(() => {
    const nav = tabsRef.current;
    if (!nav) return;
    const meet = () => {
      const stijl = getComputedStyle(nav);
      const gap = parseFloat(stijl.columnGap) || 0;
      let vast = 0;
      let n = 0;
      for (const el of nav.children) {
        if (el.classList.contains("extra")) continue;
        vast += (el as HTMLElement).offsetWidth;
        n++;
      }
      // Ook de scheidingslijn rekenen, ook als die er nog niet staat.
      if (!nav.querySelector(".tn-scheiding")) {
        vast += 21;
        n++;
      }
      const vrij = nav.clientWidth - vast - n * gap;
      setPast(
        Math.max(1, Math.min(MAX_EXTRA, Math.floor(vrij / (TAB_MIN + gap)))),
      );
    };
    meet();
    const ro = new ResizeObserver(meet);
    ro.observe(nav);
    return () => ro.disconnect();
  }, []);
  const zichtbaar = (() => {
    if (tabbladen.length <= past) return tabbladen;
    const laatste = tabbladen.slice(-past);
    const actief = tabbladen.find((x) => x.pad === pathname);
    if (!actief || laatste.includes(actief)) return laatste;
    return tabbladen.filter(
      (x) => x === actief || laatste.slice(1).includes(x),
    );
  })();

  const sluit = useCallback(
    (pad: string) => {
      setExtra((v) => {
        const i = v.findIndex((x) => x.pad === pad);
        if (i < 0) return v;
        const rest = v.filter((x) => x.pad !== pad);
        if (pad === pathname) {
          // Naar het tabblad ernaast, of terug naar Portfolio, Diensten of Home.
          const volgende =
            rest[i]?.pad ??
            rest[i - 1]?.pad ??
            (pad.startsWith("/portfolio/")
              ? "/portfolio"
              : pad.startsWith("/diensten/")
                ? "/diensten"
                : "/");
          window.setTimeout(() => navigate(volgende), 0);
        }
        return rest;
      });
    },
    [pathname, navigate],
  );

  // Glas in de balk zodra de pagina eronder schuift.
  useEffect(() => {
    const zet = () => setGescrold(window.scrollY > 8);
    zet();
    window.addEventListener("scroll", zet, { passive: true });
    return () => window.removeEventListener("scroll", zet);
  }, []);

  // Menu of overzicht open: de pagina eronder scrolt niet mee. Lenis stuurt het
  // scrollen op desktop, dus overflow alleen is niet genoeg.
  const vergrendeld = allesOpen || mobielOpen;
  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle("tn-vast", vergrendeld);
    if (vergrendeld) getLenis()?.stop();
    else getLenis()?.start();
    return () => {
      html.classList.remove("tn-vast");
      getLenis()?.start();
    };
  }, [vergrendeld]);

  // Escape sluit alles; klikken buiten het overzicht of het uitklapmenu ook.
  useEffect(() => {
    const opToets = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setDienstenOpen(false);
      setMobielOpen(false);
      setAllesOpen((open) => {
        if (open)
          kopRef.current?.querySelector<HTMLElement>(".tn-plus")?.focus();
        return false;
      });
    };
    const opDruk = (e: PointerEvent) => {
      const doel = e.target as Element;
      if (!doel.closest?.(".tn-alles, .tn-plus")) setAllesOpen(false);
      if (!doel.closest?.(".tn-met-menu")) setDienstenOpen(false);
    };
    window.addEventListener("keydown", opToets);
    window.addEventListener("pointerdown", opDruk);
    return () => {
      window.removeEventListener("keydown", opToets);
      window.removeEventListener("pointerdown", opDruk);
    };
  }, []);

  useEffect(() => {
    if (!allesOpen) return;
    const t = window.setTimeout(
      () =>
        allesRef.current?.querySelector("a")?.focus({ preventScroll: true }),
      60,
    );
    return () => window.clearTimeout(t);
  }, [allesOpen]);

  // ── Donkere secties ─────────────────────────────────────────────────────
  // Een sensorband van 1px over het midden van de balk. Secties melden zich aan
  // via een ref; IntersectionObserver doet het werk, er draait niets per frame.
  const darkSectionsRef = useRef<Set<Element>>(new Set());
  const activeDarkRef = useRef<Set<Element>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const bouw = () => {
      observerRef.current?.disconnect();
      const kop = kopRef.current;
      if (!kop) return;
      const sensorY = kop.offsetHeight / 2;
      const onder = Math.max(0, window.innerHeight - sensorY - 1);
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) activeDarkRef.current.add(e.target);
            else activeDarkRef.current.delete(e.target);
          }
          setDonker(activeDarkRef.current.size > 0);
        },
        { rootMargin: `-${sensorY}px 0px -${onder}px 0px`, threshold: 0 },
      );
      darkSectionsRef.current.forEach((el) => io.observe(el));
      observerRef.current = io;
    };
    bouw();
    let t: number | undefined;
    const opResize = () => {
      window.clearTimeout(t);
      t = window.setTimeout(() => {
        activeDarkRef.current.clear();
        bouw();
      }, 150);
    };
    window.addEventListener("resize", opResize);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", opResize);
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, []);

  const registerDarkSection = useCallback<RegisterDarkSection>((el) => {
    darkSectionsRef.current.add(el);
    observerRef.current?.observe(el);
    return () => {
      darkSectionsRef.current.delete(el);
      activeDarkRef.current.delete(el);
      observerRef.current?.unobserve(el);
      setDonker(activeDarkRef.current.size > 0);
    };
  }, []);

  // ── Uitklapmenu Diensten ────────────────────────────────────────────────
  const openDiensten = (focus = false) => {
    window.clearTimeout(dienstTimer.current);
    verbergVoorbeeld();
    setDienstenOpen(true);
    if (focus)
      window.setTimeout(
        () =>
          kopRef.current?.querySelector<HTMLElement>(".tn-dropdown a")?.focus(),
        0,
      );
  };
  const dienstenToetsen = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const items = [...e.currentTarget.querySelectorAll<HTMLElement>("a")];
    const i = items.indexOf(document.activeElement as HTMLElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      items[(i + 1) % items.length]?.focus();
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      items[(i - 1 + items.length) % items.length]?.focus();
    }
    if (e.key === "Escape") {
      setDienstenOpen(false);
      kopRef.current?.querySelector<HTMLElement>(".tn-chevron")?.focus();
    }
  };

  // ── Voorbeeld bij hover ─────────────────────────────────────────────────
  const toonVoorbeeld = (
    e: React.PointerEvent<HTMLElement>,
    pagina: Pagina | Extra,
  ) => {
    if (e.pointerType !== "mouse" || pagina.pad === pathname || sleept) return;
    const el = e.currentTarget;
    window.clearTimeout(vbTimer.current);
    vbTimer.current = window.setTimeout(() => {
      const r = el.getBoundingClientRect();
      setVoorbeeld({
        pagina,
        left: Math.min(window.innerWidth - 256, Math.max(8, r.left)),
        top: r.bottom + 8,
      });
    }, 450);
  };

  // ── Tabbladen verslepen ─────────────────────────────────────────────────
  const sleepRef = useRef<string | null>(null);
  const startSlepen = (e: React.PointerEvent<HTMLDivElement>, pad: string) => {
    if (e.button !== 0 || (e.target as Element).closest(".tn-sluit")) return;
    const t = e.currentTarget;
    let startX = e.clientX;
    let bezig = false;
    const beweeg = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      if (!bezig && Math.abs(dx) < 6) return;
      if (!bezig) {
        bezig = true;
        sleepRef.current = pad;
        setSleept(pad);
        verbergVoorbeeld();
      }
      t.style.transform = `translateX(${dx}px)`;
      // Wisselen met de buur zodra je over zijn midden gaat; het startpunt schuift
      // mee zodat het tabblad onder de muis blijft.
      const alle = [
        ...(tabsRef.current?.querySelectorAll<HTMLElement>(".tn-tab.extra") ??
          []),
      ];
      const i = alle.indexOf(t);
      const buur = dx > 0 ? alle[i + 1] : alle[i - 1];
      if (!buur) return;
      const r = t.getBoundingClientRect();
      const br = buur.getBoundingClientRect();
      const mid = r.left + r.width / 2;
      const bmid = br.left + br.width / 2;
      if ((dx > 0 && mid > bmid) || (dx < 0 && mid < bmid)) {
        const voor = r.left - dx;
        t.style.transform = "";
        flushSync(() =>
          setExtra((v) => {
            const kopie = v.slice();
            const j = kopie.findIndex((x) => x.pad === pad);
            const k = kopie.findIndex((x) => x.pad === buur.dataset["pad"]);
            [kopie[j], kopie[k]] = [kopie[k]!, kopie[j]!];
            return kopie;
          }),
        );
        startX += t.getBoundingClientRect().left - voor;
        t.style.transform = `translateX(${ev.clientX - startX}px)`;
      }
    };
    const los = () => {
      window.removeEventListener("pointermove", beweeg);
      window.removeEventListener("pointerup", los);
      if (bezig) {
        t.style.transform = "";
        setSleept(null);
        window.setTimeout(() => (sleepRef.current = null), 0);
      }
    };
    window.addEventListener("pointermove", beweeg);
    window.addEventListener("pointerup", los);
  };
  // Na slepen niet ook nog navigeren.
  const negeerNaSlepen = (e: React.MouseEvent) => {
    if (sleepRef.current) e.preventDefault();
  };

  const categorie = (naam: string, paginas: Pagina[]) => (
    <section key={naam} className="tn-categorie">
      <h2>{naam}</h2>
      {paginas.map((pg, i) => (
        <Link
          key={pg.pad}
          to={pg.pad}
          style={{ "--i": i } as React.CSSProperties}
          aria-current={pg.pad === pathname ? "page" : undefined}
        >
          <Duim pagina={pg} className="tn-duim-groot" />
          {pg.titel}
        </Link>
      ))}
    </section>
  );
  const kleineLinks = (
    <nav className="tn-klein" aria-label="Overige links">
      {KLEIN.map((l) =>
        /^https?:\/\//.test(l.href) ? (
          <a
            key={l.href}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {l.label}
          </a>
        ) : (
          <Link key={l.href} to={l.href}>
            {l.label}
          </Link>
        ),
      )}
    </nav>
  );

  const licht = donker && !mobielOpen;

  return (
    <>
      <header
        ref={kopRef}
        className={cx(
          "tn-kop",
          gescrold && "gescrold",
          mobielOpen && "menu-open",
        )}
        data-donker={licht ? "" : undefined}
      >
        <Link
          to="/"
          className="tn-logo"
          aria-label="Nieuwblik, naar de homepage"
        >
          <img
            src={logoSrc}
            alt="Nieuwblik"
            width={400}
            height={113}
            draggable={false}
          />
        </Link>

        <nav ref={tabsRef} className="tn-tabs" aria-label="Hoofdnavigatie">
          {VAST.map((v) => {
            const actief = v.pad === pathname;
            const kern = (
              <Link
                to={v.pad}
                className="tn-link"
                draggable={false}
                aria-current={actief ? "page" : undefined}
              >
                <v.Icoon
                  className={cx("tn-ic", speel === v.pad && "speel")}
                  data-ic={v.ic}
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <span className="tn-label">{v.titel}</span>
              </Link>
            );
            if (!v.menu) {
              return (
                <div
                  key={v.pad}
                  className={cx("tn-tab", actief && "actief")}
                  onPointerEnter={(e) => toonVoorbeeld(e, v)}
                  onPointerLeave={verbergVoorbeeld}
                >
                  {kern}
                </div>
              );
            }
            return (
              <div
                key={v.pad}
                className={cx(
                  "tn-tab tn-met-menu",
                  actief && "actief",
                  dienstenOpen && "dd-open",
                )}
                onPointerEnter={(e) => {
                  if (e.pointerType !== "mouse") return;
                  window.clearTimeout(dienstTimer.current);
                  dienstTimer.current = window.setTimeout(
                    () => openDiensten(),
                    140,
                  );
                }}
                onPointerLeave={() => {
                  window.clearTimeout(dienstTimer.current);
                  dienstTimer.current = window.setTimeout(
                    () => setDienstenOpen(false),
                    200,
                  );
                }}
              >
                {kern}
                <button
                  type="button"
                  className="tn-chevron"
                  aria-label="Diensten uitklappen"
                  aria-haspopup="menu"
                  aria-expanded={dienstenOpen}
                  onClick={() =>
                    dienstenOpen ? setDienstenOpen(false) : openDiensten()
                  }
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      openDiensten(true);
                    }
                  }}
                >
                  <ChevronDown aria-hidden="true" strokeWidth={1.75} />
                </button>
                <div
                  className={cx("tn-dropdown", dienstenOpen && "open")}
                  role="menu"
                  aria-label="Diensten"
                  onKeyDown={dienstenToetsen}
                >
                  <div className="tn-dropdown-paneel">
                    {DIENSTEN.map((d) => (
                      <Link
                        key={d.pad}
                        to={d.pad}
                        role="menuitem"
                        tabIndex={dienstenOpen ? 0 : -1}
                      >
                        <d.Icoon
                          className="tn-ic"
                          strokeWidth={1.75}
                          aria-hidden="true"
                        />
                        {d.titel}
                      </Link>
                    ))}
                    <Link
                      to="/diensten"
                      role="menuitem"
                      className="tn-alle"
                      tabIndex={dienstenOpen ? 0 : -1}
                    >
                      Alle diensten{" "}
                      <ArrowRight
                        className="tn-ic"
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {extra.length > 0 && (
            <span className="tn-scheiding" aria-hidden="true" />
          )}

          {zichtbaar.map((x) => {
            const actief = x.pad === pathname;
            return (
              <div
                key={x.pad}
                data-pad={x.pad}
                className={cx(
                  "tn-tab extra",
                  actief && "actief",
                  sleept === x.pad && "sleept",
                )}
                onPointerDown={(e) => startSlepen(e, x.pad)}
                onPointerEnter={(e) => toonVoorbeeld(e, x)}
                onPointerLeave={verbergVoorbeeld}
                onAuxClick={(e) => {
                  // Middelste muisknop sluit een tabblad, zoals in een browser.
                  if (e.button === 1) {
                    e.preventDefault();
                    sluit(x.pad);
                  }
                }}
              >
                <Link
                  to={x.pad}
                  className="tn-link"
                  draggable={false}
                  aria-current={actief ? "page" : undefined}
                  onClick={negeerNaSlepen}
                >
                  {x.beeld ? (
                    <img
                      className={cx("tn-duim", speel === x.pad && "speel")}
                      src={x.beeld}
                      alt=""
                      draggable={false}
                    />
                  ) : (
                    (() => {
                      const I = icoonVoor(x.pad);
                      return (
                        <I
                          className={cx("tn-ic", speel === x.pad && "speel")}
                          strokeWidth={1.75}
                          aria-hidden="true"
                        />
                      );
                    })()
                  )}
                  <span className="tn-label">{x.titel}</span>
                </Link>
                <button
                  type="button"
                  className="tn-sluit"
                  aria-label={`Sluit ${x.titel}`}
                  onClick={() => sluit(x.pad)}
                >
                  <X aria-hidden="true" strokeWidth={1.75} />
                </button>
              </div>
            );
          })}

          <button
            type="button"
            className="tn-plus"
            aria-label="Alle pagina's"
            aria-controls="tn-alle-paginas"
            aria-expanded={allesOpen}
            onClick={() => {
              setDienstenOpen(false);
              verbergVoorbeeld();
              setAllesOpen((o) => !o);
            }}
          >
            <Plus aria-hidden="true" strokeWidth={1.75} />
          </button>
        </nav>

        <AnimatedButton
          to="/contact"
          className="tn-cta"
          variant={licht ? "white" : "solid"}
        >
          Start je project
        </AnimatedButton>

        <button
          type="button"
          className="tn-mob-menu"
          aria-label={mobielOpen ? "Sluit menu" : "Menu"}
          aria-expanded={mobielOpen}
          aria-controls="tn-overzicht"
          onClick={() => setMobielOpen((o) => !o)}
        >
          <Raster className="tn-ic" aria-hidden="true" />
        </button>
      </header>

      {/* Overzicht van alle pagina's onder het plusje (desktop). */}
      <div
        ref={allesRef}
        id="tn-alle-paginas"
        className={cx("tn-alles", allesOpen && "open")}
        role="dialog"
        aria-label="Alle pagina's"
        aria-hidden={!allesOpen}
        inert={!allesOpen}
      >
        <div className="tn-alles-raster">
          {CATEGORIEEN.map(([naam, paginas]) => categorie(naam, paginas))}
        </div>
        {kleineLinks}
      </div>

      {/* Mobiel menu: bovenin de zelf geopende pagina's, daaronder alles per categorie. */}
      <div
        id="tn-overzicht"
        className={cx("tn-overzicht", mobielOpen && "open")}
        role="dialog"
        aria-label="Alle pagina's"
        aria-hidden={!mobielOpen}
        inert={!mobielOpen}
      >
        <div className="tn-lijst">
          {tabbladen.map((x) => (
            <div
              key={x.pad}
              className={cx("tn-ov-kaart", x.pad === pathname && "actief")}
            >
              <Link to={x.pad} className="tn-ov-link">
                {x.beeld ? (
                  <div
                    className="tn-beeld"
                    style={{ backgroundImage: `url('${x.beeld}')` }}
                  />
                ) : (
                  <div className="tn-beeld">
                    <Duim pagina={x} />
                  </div>
                )}
                <b>{x.titel}</b>
              </Link>
              <button
                type="button"
                className="tn-sluit"
                aria-label={`Sluit ${x.titel}`}
                onClick={() => sluit(x.pad)}
              >
                <X aria-hidden="true" strokeWidth={1.75} />
              </button>
            </div>
          ))}
          <div className="tn-alle-paginas">
            {/* Zonder de losse cases: die maken de lijst lang en Portfolio staat al onder Algemeen. */}
            {CATEGORIEEN.filter(([naam]) => naam !== "Portfolio").map(
              ([naam, paginas]) => categorie(naam, paginas),
            )}
            {kleineLinks}
          </div>
        </div>
      </div>

      {/* Voorbeeldkaartje bij hover over een tabblad. */}
      <div
        className={cx("tn-voorbeeld", voorbeeld && "open")}
        aria-hidden="true"
        style={
          voorbeeld ? { left: voorbeeld.left, top: voorbeeld.top } : undefined
        }
      >
        {voorbeeld && (
          <>
            <div
              className="tn-beeld"
              style={
                voorbeeld.pagina.beeld
                  ? { backgroundImage: `url('${voorbeeld.pagina.beeld}')` }
                  : undefined
              }
            />
            <b>{voorbeeld.pagina.titel}</b>
            <span>
              {new URL(SITE_URL).host}
              {voorbeeld.pagina.pad === "/" ? "" : voorbeeld.pagina.pad}
            </span>
          </>
        )}
      </div>

      <main className="relative" style={{ overflow: "clip" }}>
        <DarkSectionContext.Provider value={registerDarkSection}>
          {children}
        </DarkSectionContext.Provider>
      </main>
    </>
  );
}
