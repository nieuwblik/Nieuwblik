import { useCallback, useEffect, useState } from "react";
import { NavLink, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  CalendarDays,
  CheckSquare,
  ChevronDown,
  ChevronsUpDown,
  Home,
  LayoutDashboard,
  LogOut,
  Inbox,
  Mail,
  Menu,
  Moon,
  PanelLeft,
  Receipt,
  Search,
  ShieldAlert,
  Sun,
  Timer,
  UserPen,
  UserPlus,
  Users,
  Wallet,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import SEOHead from "@/components/SEOHead";
import { cn } from "@/lib/utils";
import logoSrc from "@/assets/logo.webp";
import { useAdminAuth } from "@/admin/AdminAuthContext";
import CommandPalette, { useCommandPaletteShortcut } from "@/admin/components/CommandPalette";
import ProfileNameDialog from "@/admin/components/ProfileNameDialog";
import QuickCapture from "@/admin/components/QuickCapture";
import MeldingenCentrum from "@/admin/components/MeldingenCentrum";
import TimerBalk from "@/admin/components/TimerBalk";
import { useBetaalMeldingen } from "@/admin/useBetaalMeldingen";
import { useAanvragen } from "@/admin/aanvragen";
import { useAutomatischeTaken } from "@/admin/useAutomatischeTaken";
import { useWebsiteBewaking } from "@/admin/websites";
import { useLegeTakenOpruimen } from "@/admin/legeTaken";
import { useVloeiendNaar } from "@/admin/vloeiend";
import { initials } from "@/admin/format";
import { usePortalPwa } from "@/admin/pwa";
import { useTaakTellingen, useTeFactureren } from "@/admin/stats";
import { usePortalTheme, type PortalTheme } from "@/admin/theme";

const COLLAPSE_KEY = "nieuwblik:portaal:zijbalk-ingeklapt";

/** Het portaal wordt nooit geïndexeerd, ongeacht welke subpagina open staat. */
const AdminSEO = () => (
  <SEOHead
    title="Portaal — Nieuwblik"
    description="Interne werkomgeving van Nieuwblik."
    noIndex={true}
    includeOrganizationSchema={false}
  />
);

interface NavEntry {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  end: boolean;
  /** Getal achter het item; rood als het om te laat werk gaat. */
  badge?: { aantal: number; alarm?: boolean; titel: string };
}

/**
 * Een menu-item, zoals in de zijbalk van de Claude-app: donkere tekst op het
 * grijs, en het actieve item als een zacht, iets donkerder vlak. Geen schaduw
 * en geen accentkleur; de plek zelf vertelt waar je bent.
 */
const railItem = (isActive: boolean, collapsed: boolean) =>
  cn(
    "group relative flex items-center rounded-lg text-[15px] text-rail-fg transition-[background-color,transform] duration-150 ease-out active:scale-[0.98]",
    collapsed ? "h-10 w-10 justify-center" : "gap-3 px-3 py-[7px]",
    isActive ? "bg-rail-active" : "hover:bg-rail-hover",
  );

const GROEPEN_KEY = "nieuwblik:portaal:zijbalk-groepen-dicht";

/** Welke groepen zijn ingeklapt; per browser onthouden. */
function useDichteGroepen() {
  const [dicht, setDicht] = useState<string[]>(() => {
    try {
      return JSON.parse(window.localStorage.getItem(GROEPEN_KEY) ?? "[]") as string[];
    } catch {
      return [];
    }
  });
  const wissel = (label: string) =>
    setDicht((huidig) => {
      const nieuw = huidig.includes(label) ? huidig.filter((l) => l !== label) : [...huidig, label];
      try {
        window.localStorage.setItem(GROEPEN_KEY, JSON.stringify(nieuw));
      } catch {
        // Opslag geblokkeerd: dan alleen niet onthouden.
      }
      return nieuw;
    });
  return { dicht, wissel };
}

/** Op de Mac is het Cmd+K, op Windows en Linux Ctrl+K. */
const sneltoetsLabel = () =>
  typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)
    ? "⌘K"
    : "Ctrl K";

/**
 * De menu-items van de zijbalk, gedeeld door de vaste balk op desktop en het
 * uitschuifpaneel op mobiel. Ingeklapt bestaat alleen op desktop.
 *
 * In drie groepen: wat je overziet, waar je aan werkt, en de diensten die
 * doorlopen. De getallen zijn wat er op die pagina op je wacht, zodat je niet
 * hoeft te openen om te weten of het nodig is.
 */
const RailNav = ({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) => {
  const naar = useVloeiendNaar();
  const taken = useTaakTellingen();
  const facturen = useTeFactureren();
  const { data: aanvragen = [] } = useAanvragen();
  const { dicht, wissel } = useDichteGroepen();

  const groepen: { label: string; items: NavEntry[] }[] = [
    {
      label: "Overzicht",
      items: [
        { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, end: false },
        {
          to: "/admin/kalender",
          label: "Kalender",
          icon: CalendarDays,
          end: false,
          badge: { aantal: taken.vandaag.length, titel: "deadlines vandaag" },
        },
      ],
    },
    {
      label: "Werk",
      items: [
        {
          to: "/admin/aanvragen",
          label: "Aanvragen",
          icon: Inbox,
          end: false,
          badge: { aantal: aanvragen.filter((a) => a.status === "nieuw").length, titel: "nieuw" },
        },
        { to: "/admin/klanten", label: "Klanten", icon: Users, end: false },
        {
          to: "/admin/taken",
          label: "Taken",
          icon: CheckSquare,
          end: false,
          badge:
            taken.teLaat.length > 0
              ? { aantal: taken.teLaat.length, alarm: true, titel: "te laat" }
              : { aantal: taken.open.length, titel: "open" },
        },
        { to: "/admin/uren", label: "Uren", icon: Timer, end: false },
      ],
    },
    {
      label: "Diensten",
      items: [
        {
          to: "/admin/hosting",
          label: "Hosting",
          icon: Receipt,
          end: false,
          badge: { aantal: facturen.open.length, titel: "te factureren" },
        },
        { to: "/admin/mailen", label: "Mailen", icon: Mail, end: false },
        { to: "/admin/financien", label: "Financiën", icon: Wallet, end: false },
      ],
    },
  ];

  return (
    <nav className={cn("flex flex-col gap-5", collapsed ? "items-center px-2" : "px-3")}>
      {/* Bovenaan, los van de groepen: de startpagina, waar je binnenkomt.
          Nieuwe taak en zoeken staan in de bovenbalk (en onder N en het palet). */}
      <div className={cn("flex flex-col gap-0.5", collapsed && "items-center")}>
        <NavLink
          to="/admin"
          end
          // Terug naar Start met dezelfde vloeiende overgang als de heenweg.
          onClick={(e) => {
            onNavigate?.();
            if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            e.preventDefault();
            naar("/admin");
          }}
          title={collapsed ? "Start" : undefined}
          className={({ isActive }) => railItem(isActive, collapsed)}
        >
          <Home className="h-[19px] w-[19px] shrink-0" strokeWidth={1.75} />
          {!collapsed && "Start"}
        </NavLink>
      </div>

      {groepen.map((groep) => {
        const open = collapsed || !dicht.includes(groep.label);
        return (
          <div key={groep.label} className={cn("flex flex-col gap-0.5", collapsed && "items-center")}>
            {/* Ingeklapt is er geen ruimte voor het woord; een streepje houdt
                de groepen dan toch uit elkaar. Uitgeklapt is het kopje zelf de
                knop om de groep dicht te doen, zoals in de Claude-app. */}
            {collapsed ? (
              <span className="mb-2 h-px w-6 bg-rail-border" aria-hidden="true" />
            ) : (
              <button
                type="button"
                onClick={() => wissel(groep.label)}
                aria-expanded={open}
                className="mb-1 flex w-fit items-center gap-1 rounded-md px-3 text-[13px] text-rail-muted transition-colors duration-150 hover:text-rail-fg"
              >
                {groep.label}
                <ChevronDown
                  className={cn("h-3.5 w-3.5 transition-transform duration-200", !open && "-rotate-90")}
                  strokeWidth={2}
                />
              </button>
            )}
            {open && groep.items.map(({ to, label, icon: Icon, end, badge }) => {
            const telt = badge !== undefined && badge.aantal > 0;
            const uitleg = telt ? `${badge.aantal} ${badge.titel}` : undefined;
            return (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={onNavigate}
                title={collapsed ? (uitleg ? `${label}: ${uitleg}` : label) : undefined}
                className={({ isActive }) => railItem(isActive, collapsed)}
              >
                <Icon className="h-[19px] w-[19px] shrink-0" strokeWidth={1.75} />
                {!collapsed && label}
                {telt &&
                  (collapsed ? (
                    <span
                      className={cn(
                        "absolute right-1.5 top-1.5 h-2 w-2 rounded-full ring-2 ring-rail",
                        badge.alarm ? "bg-danger" : "bg-rail-muted/60",
                      )}
                      aria-hidden="true"
                    />
                  ) : (
                    <span
                      title={uitleg}
                      className={cn(
                        "ml-auto flex h-5 min-w-5 items-center justify-center rounded-md border px-1 text-[11px] font-medium tabular-nums",
                        badge.alarm
                          ? "border-danger/30 bg-danger/10 text-danger-ink"
                          : "border-rail-border bg-rail text-rail-muted",
                      )}
                    >
                      {badge.aantal > 99 ? "99+" : badge.aantal}
                      <span className="sr-only"> {badge.titel}</span>
                    </span>
                  ))}
              </NavLink>
            );
          })}
          </div>
        );
      })}
    </nav>
  );
};

/** Het logo, licht of donker naar het thema. */
const Logo = ({ className }: { className?: string }) => (
  <img src={logoSrc} alt="Nieuwblik" className={cn("h-6 w-auto brightness-0 dark:invert", className)} />
);

/**
 * Je account onderin de zijbalk: naam, en daarachter naam wijzigen, het
 * thema en uitloggen. Op een telefoon staat hetzelfde menu in de bovenbalk.
 */
const AccountMenu = ({
  variant,
  displayName,
  theme,
  onToggleTheme,
  onNaam,
  onSignOut,
}: {
  variant: "balk" | "rij" | "icoon";
  displayName: string;
  theme: PortalTheme;
  onToggleTheme: () => void;
  onNaam: () => void;
  onSignOut: () => void;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      {variant === "rij" ? (
        <button
          type="button"
          className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors duration-150 hover:bg-rail-hover data-[state=open]:bg-rail-hover"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rail-panel text-[12px] font-medium text-rail-fg">
            {initials(displayName)}
          </span>
          <span className="min-w-0 flex-1 truncate text-[15px] text-rail-fg">
            {displayName}
            <span className="text-[13px] text-rail-muted"> · Nieuwblik</span>
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-rail-muted" />
        </button>
      ) : (
        <button
          type="button"
          aria-label="Account"
          className={cn(
            "flex items-center justify-center rounded-lg transition-colors duration-150 hover:bg-rail-hover",
            variant === "icoon" ? "h-10 w-10" : "h-9 w-9",
          )}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rail-panel text-xs font-medium text-rail-fg">
            {initials(displayName)}
          </span>
        </button>
      )}
    </DropdownMenuTrigger>
    <DropdownMenuContent align={variant === "balk" ? "end" : "start"} side={variant === "balk" ? "bottom" : "top"} className="w-64">
      <DropdownMenuLabel className="truncate font-normal text-muted-foreground">{displayName}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem onSelect={onNaam}>
        <UserPen className="h-4 w-4" />
        Naam wijzigen
      </DropdownMenuItem>
      <DropdownMenuItem onSelect={onToggleTheme}>
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        {theme === "dark" ? "Lichte modus" : "Donkere modus"}
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onSelect={onSignOut}>
        <LogOut className="h-4 w-4" />
        Uitloggen
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

/**
 * Het geraamte van het portaal terwijl de sessie wordt gecontroleerd, in
 * plaats van een regel tekst: dan verspringt er niets als de inhoud
 * binnenkomt, en het staat al in het gekozen thema.
 */
const LaadGeraamte = () => (
  <div className="flex min-h-screen bg-rail" aria-busy="true">
    <AdminSEO />
    <span className="sr-only">Portaal laden</span>
    <div className="hidden w-60 shrink-0 lg:block" />
    <div className="min-w-0 flex-1 lg:py-2 lg:pr-2">
      <div className="min-h-screen space-y-6 bg-background p-4 sm:p-6 lg:min-h-[calc(100vh-1rem)] lg:rounded-[20px] lg:border lg:border-rail-border lg:p-8">
        <Skeleton className="h-10 w-full max-w-md rounded-xl" />
        <Skeleton className="h-8 w-56" />
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
          <Skeleton className="h-80 rounded-[16px]" />
          <Skeleton className="h-80 rounded-[16px]" />
        </div>
      </div>
    </div>
  </div>
);

const AdminLayout = () => {
  const { status, displayName, signOut } = useAdminAuth();
  useBetaalMeldingen(status === "authorized");
  useAutomatischeTaken(status === "authorized");
  useWebsiteBewaking(status === "authorized");
  useLegeTakenOpruimen(status === "authorized");
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [captureOpen, setCaptureOpen] = useState(false);
  const [naamOpen, setNaamOpen] = useState(false);

  /*
   * "N" opent het invoerscherm, zoals in veel werkomgevingen. Bewust zonder
   * modifier: dit is de handeling die je de hele dag doet.
   *
   * Alleen wanneer je nergens in staat te typen, anders zou de letter n in
   * een tekstveld het scherm openen in plaats van een n te tikken.
   */
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "n" || event.metaKey || event.ctrlKey || event.altKey) return;

      const el = document.activeElement;
      const typend =
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        (el instanceof HTMLElement && el.isContentEditable);
      if (typend) return;

      event.preventDefault();
      setCaptureOpen(true);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Andere schermen (de begroeting op Start) openen de naamdialoog en het
  // zoekpalet via een gebeurtenis, zodat er één dialoog van elk blijft.
  useEffect(() => {
    const naam = () => setNaamOpen(true);
    const zoek = () => setPaletteOpen(true);
    window.addEventListener("portaal:naam-instellen", naam);
    window.addEventListener("portaal:zoeken", zoek);
    return () => {
      window.removeEventListener("portaal:naam-instellen", naam);
      window.removeEventListener("portaal:zoeken", zoek);
    };
  }, []);

  const { theme, toggle: toggleTheme } = usePortalTheme();
  usePortalPwa();

  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(COLLAPSE_KEY) === "1";
    } catch {
      return false;
    }
  });

  const toggleCollapsed = useCallback(() => {
    setCollapsed((current) => {
      const next = !current;
      try {
        localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      } catch {
        // Voorkeur geldt dan alleen deze sessie.
      }
      return next;
    });
  }, []);

  useCommandPaletteShortcut(setPaletteOpen);

  // Bij een routewissel gaat het mobiele paneel dicht; anders blijft het over
  // de nieuwe pagina heen staan.
  useEffect(() => setMobileOpen(false), [location.pathname]);

  if (status === "loading") return <LaadGeraamte />;

  if (status === "unauthenticated") {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname + location.search }} />;
  }

  if (status === "forbidden") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-rail p-6">
        <AdminSEO />
        <div className="max-w-sm space-y-4 text-center">
          <ShieldAlert className="mx-auto h-10 w-10 text-muted-foreground" />
          <div>
            <h1 className="text-lg">Geen toegang</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Dit account is ingelogd, maar heeft geen adminrechten voor het portaal.
            </p>
          </div>
          <Button variant="outline" onClick={() => void signOut()}>
            <LogOut className="h-4 w-4" />
            Uitloggen
          </Button>
        </div>
      </div>
    );
  }

  /** Eén icoonknop in de bovenbalk. */
  const balkKnop = (icon: typeof Bell, label: string, onClick: () => void, stip = false) => {
    const Icon = icon;
    return (
      <button
        type="button"
        onClick={onClick}
        title={label}
        aria-label={label}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-[background-color,color,transform] duration-150 ease-out hover:bg-muted hover:text-foreground active:scale-90"
      >
        <Icon className="h-[18px] w-[18px]" />
        {stip && <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-danger ring-2 ring-background" />}
      </button>
    );
  };

  const account = (variant: "balk" | "rij" | "icoon") => (
    <AccountMenu
      variant={variant}
      displayName={displayName}
      theme={theme}
      onToggleTheme={toggleTheme}
      onNaam={() => setNaamOpen(true)}
      onSignOut={() => void signOut()}
    />
  );

  // Start: de pagina over het hele scherm, zonder zijbalk en bovenbalk. De
  // dialogen blijven, zodat zoeken (Ctrl K), N en de naam ook hier werken.
  if (location.pathname.replace(/\/$/, "") === "/admin") {
    return (
      <>
        <AdminSEO />
        <Outlet />
        <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
        <QuickCapture open={captureOpen} onOpenChange={setCaptureOpen} />
        <ProfileNameDialog open={naamOpen} onOpenChange={setNaamOpen} />
      </>
    );
  }

  return (
    <div className="flex min-h-screen bg-rail">
      <AdminSEO />

      {/* Zijbalk op het grijze vlak, zonder eigen rand: de pagina ernaast is
          het witte vlak dat erop ligt. Bovenin het logo met de inklapknop,
          onderin je account. Breedte wisselt zonder overgang: layout-
          eigenschappen animeren geeft schokkerige herberekening. */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col py-4 lg:flex",
          collapsed ? "w-[76px] items-center" : "w-60",
        )}
      >
        <div className={cn("mb-6 flex h-10 items-center", collapsed ? "justify-center" : "justify-between pl-5 pr-3")}>
          {!collapsed && <Logo />}
          <button
            type="button"
            onClick={toggleCollapsed}
            title={collapsed ? "Zijbalk uitklappen" : "Zijbalk inklappen"}
            aria-label={collapsed ? "Zijbalk uitklappen" : "Zijbalk inklappen"}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-rail-muted transition-colors duration-150 hover:bg-rail-hover hover:text-rail-fg"
          >
            <PanelLeft className="h-[18px] w-[18px]" />
          </button>
        </div>

        <div className="w-full flex-1 overflow-y-auto">
          <RailNav collapsed={collapsed} />
        </div>

        <div className={cn("mt-4 w-full", collapsed ? "flex justify-center px-2" : "px-3")}>
          {account(collapsed ? "icoon" : "rij")}
        </div>
      </aside>

      {/* De pagina als één wit vlak op het grijs, met de bovenbalk erin. Op
          een telefoon vult het vlak het scherm. */}
      <div className="min-w-0 flex-1 lg:py-2 lg:pr-2">
        <div className="min-h-screen bg-background lg:min-h-[calc(100vh-1rem)] lg:rounded-[20px] lg:border lg:border-rail-border">
          <header className="sticky top-0 z-40 flex h-16 items-center gap-2 bg-background/90 px-4 backdrop-blur-md sm:px-6 lg:rounded-t-[20px] lg:px-8">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  aria-label="Menu openen"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground lg:hidden"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="flex w-72 flex-col border-rail-border bg-rail p-0">
                <SheetTitle className="sr-only">Nieuwblik Portaal</SheetTitle>
                <SheetDescription className="sr-only">Navigatie door het portaal</SheetDescription>
                <div className="flex-1 overflow-y-auto py-5">
                  <div className="mb-6 px-5">
                    <Logo />
                  </div>
                  <RailNav collapsed={false} onNavigate={() => setMobileOpen(false)} />
                </div>
                <div className="px-3 pb-4">{account("rij")}</div>
              </SheetContent>
            </Sheet>

            {/* Zoeken is een veld en geen knop: je typt erin, en dat wil je
                zien voordat je klikt. Het is het enige zoekveld voor het hele
                portaal: klanten, taken en pagina's zitten allemaal in het palet. */}
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="flex h-10 min-w-0 flex-1 items-center gap-3 rounded-xl border border-border bg-muted/60 px-3 text-sm text-muted-foreground transition-[background-color,border-color] duration-150 ease-out hover:border-foreground/15 hover:bg-muted sm:max-w-md"
            >
              <Search className="h-4 w-4 shrink-0" />
              <span className="truncate">Zoek een klant, taak of pagina</span>
              <kbd className="ml-auto hidden shrink-0 rounded-md border border-border bg-background px-1.5 py-0.5 font-sans text-xs leading-none sm:block">
                {sneltoetsLabel()}
              </kbd>
            </button>

            {/* De timer, zoals de werkbalk in een urenapp: waaraan, hoe lang,
                start of stop. */}
            <TimerBalk />

            <div className="ml-auto flex shrink-0 items-center gap-1">
              {/* Een taak vastleggen blijft ook op de telefoon bereikbaar: daar
                  is geen N-toets, en dit is waar het portaal voor bedoeld is. */}
              {balkKnop(Zap, "Nieuwe taak (N)", () => setCaptureOpen(true))}
              <span className="hidden sm:contents">
                {balkKnop(UserPlus, "Nieuwe klant", () => navigate("/admin/klanten", { state: { nieuw: true } }))}
              </span>

              {/* Het meldingencentrum: alles wat nu aandacht vraagt. */}
              <MeldingenCentrum />

              <span className="hidden sm:contents">
                {balkKnop(
                  theme === "dark" ? Sun : Moon,
                  theme === "dark" ? "Naar lichte modus" : "Naar donkere modus",
                  toggleTheme,
                )}
              </span>

              {/* Op desktop staat je account onderin de zijbalk. */}
              <span className="lg:hidden">{account("balk")}</span>
            </div>
          </header>

          {/* Een korte overgang bij elke paginawissel: zonder verspringt de
              inhoud in één frame en voelt een klik als een harde knip. De key
              op het pad laat hem alleen bij een nieuwe pagina afspelen, niet
              bij een filter in de URL. */}
          <main key={location.pathname} className="p-verschijn px-4 pb-8 pt-2 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
      <QuickCapture open={captureOpen} onOpenChange={setCaptureOpen} />
      <ProfileNameDialog open={naamOpen} onOpenChange={setNaamOpen} />
    </div>
  );
};

export default AdminLayout;
