import { useCallback, useEffect, useState } from "react";
import { NavLink, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  CalendarDays,
  CheckSquare,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Moon,
  Receipt,
  Search,
  ShieldAlert,
  Sun,
  UserPen,
  UserPlus,
  Users,
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
import { initials } from "@/admin/format";
import { usePortalPwa } from "@/admin/pwa";
import { useTaakTellingen, useTeFactureren } from "@/admin/stats";
import { usePortalTheme } from "@/admin/theme";

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

const railItem = (isActive: boolean, collapsed: boolean) =>
  cn(
    "group relative flex items-center rounded-lg text-sm transition-colors duration-150",
    collapsed ? "h-10 w-10 justify-center" : "gap-3 px-3 py-2",
    isActive ? "bg-rail-active font-medium text-rail-fg" : "text-rail-muted hover:bg-rail-hover hover:text-rail-fg",
  );

/** Op de Mac is het Cmd+K, op Windows en Linux Ctrl+K. */
const sneltoetsLabel = () =>
  typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)
    ? "⌘K"
    : "Ctrl K";

/**
 * De inhoud van de zijbalk, gedeeld door de vaste balk op desktop en het
 * uitschuifpaneel op mobiel. Ingeklapt bestaat alleen op desktop.
 *
 * In drie groepen: wat je overziet, waar je aan werkt, en de diensten die
 * doorlopen. De getallen zijn wat er op die pagina op je wacht, zodat je niet
 * hoeft te openen om te weten of het nodig is.
 */
const RailContent = ({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
}) => {
  const taken = useTaakTellingen();
  const facturen = useTeFactureren();

  const groepen: { label: string; items: NavEntry[] }[] = [
    {
      label: "Overzicht",
      items: [
        { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
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
      ],
    },
  ];

  return (
    <nav className={cn("flex flex-col gap-5", collapsed ? "items-center px-2" : "px-3")}>
      {groepen.map((groep, index) => (
        <div key={groep.label} className={cn("flex flex-col gap-0.5", collapsed && "items-center")}>
          {/* Ingeklapt is er geen ruimte voor het woord; een streepje houdt
              de groepen dan toch uit elkaar. */}
          {collapsed ? (
            index > 0 && <span className="mb-2 h-px w-6 bg-rail-border" aria-hidden="true" />
          ) : (
            <span className="mb-1 px-3 text-xs text-rail-muted">{groep.label}</span>
          )}
          {groep.items.map(({ to, label, icon: Icon, end, badge }) => {
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
                <Icon className="h-[18px] w-[18px] shrink-0" />
                {!collapsed && label}
                {telt &&
                  (collapsed ? (
                    <span
                      className={cn(
                        "absolute right-1.5 top-1.5 h-2 w-2 rounded-full ring-2 ring-rail",
                        badge.alarm ? "bg-danger" : "bg-rail-muted",
                      )}
                      aria-hidden="true"
                    />
                  ) : (
                    <span
                      title={uitleg}
                      className={cn(
                        "ml-auto min-w-5 rounded-full px-1.5 text-center text-xs font-medium leading-5 tabular-nums",
                        badge.alarm ? "bg-danger/15 text-danger-ink" : "bg-rail-panel text-rail-muted",
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
      ))}
    </nav>
  );
};

/**
 * Onderin de zijbalk, achter een streep: het in- en uitklappen zelf. Het zat
 * eerst als rond knopje op de rand, maar dat is een bedieningselement dat over
 * de inhoud heen zweeft; onderin staat het waar de rest van de balk staat.
 */
const RailFooter = ({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) => (
  <button
    type="button"
    onClick={onToggle}
    title={collapsed ? "Zijbalk uitklappen" : "Zijbalk inklappen"}
    aria-label={collapsed ? "Zijbalk uitklappen" : "Zijbalk inklappen"}
    className={cn(
      "flex items-center rounded-lg text-sm text-rail-muted transition-colors duration-150 hover:bg-rail-hover hover:text-rail-fg",
      collapsed ? "h-10 w-10 justify-center" : "w-full gap-3 px-3 py-2",
    )}
  >
    {collapsed ? (
      <ChevronRight className="h-[18px] w-[18px] shrink-0" />
    ) : (
      <ChevronLeft className="h-[18px] w-[18px] shrink-0" />
    )}
    {!collapsed && "Inklappen"}
  </button>
);

/**
 * Het geraamte van het portaal terwijl de sessie wordt gecontroleerd, in
 * plaats van een regel tekst: dan verspringt er niets als de inhoud
 * binnenkomt, en het staat al in het gekozen thema.
 */
const LaadGeraamte = () => (
  <div className="min-h-screen bg-canvas" aria-busy="true">
    <AdminSEO />
    <span className="sr-only">Portaal laden</span>
    <div className="h-16 border-b border-rail-border bg-rail" />
    <div className="flex">
      <div className="hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-rail-border bg-rail lg:block" />
      <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
        <Skeleton className="h-8 w-56" />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[116px] rounded-[14px]" />
          ))}
        </div>
        <Skeleton className="h-72 rounded-[14px]" />
      </div>
    </div>
  </div>
);

const AdminLayout = () => {
  const { status, displayName, signOut } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [captureOpen, setCaptureOpen] = useState(false);
  const [naamOpen, setNaamOpen] = useState(false);
  const teLaat = useTaakTellingen().teLaat.length;

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

  // Andere schermen (de begroeting op het dashboard) openen de naamdialoog
  // via een gebeurtenis, zodat er één dialoog blijft.
  useEffect(() => {
    const open = () => setNaamOpen(true);
    window.addEventListener("portaal:naam-instellen", open);
    return () => window.removeEventListener("portaal:naam-instellen", open);
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
      <div className="flex min-h-screen items-center justify-center bg-canvas p-6">
        <AdminSEO />
        <div className="max-w-sm space-y-4 text-center">
          <ShieldAlert className="mx-auto h-10 w-10 text-muted-foreground" />
          <div>
            <h1 className="text-lg font-semibold">Geen toegang</h1>
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
  const balkKnop = (
    icon: typeof Bell,
    label: string,
    onClick: () => void,
    stip = false,
  ) => {
    const Icon = icon;
    return (
      <button
        type="button"
        onClick={onClick}
        title={label}
        aria-label={label}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-rail-muted transition-colors duration-150 hover:bg-rail-hover hover:text-rail-fg"
      >
        <Icon className="h-[18px] w-[18px]" />
        {stip && <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-danger ring-2 ring-rail" />}
      </button>
    );
  };

  const accountMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-lg p-1 transition-colors duration-150 hover:bg-rail-hover"
          aria-label="Account"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rail-accent/20 text-xs font-semibold text-rail-accent">
            {initials(displayName)}
          </span>
          <ChevronDown className="h-4 w-4 text-rail-muted" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate font-normal text-muted-foreground">{displayName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => setNaamOpen(true)}>
          <UserPen className="h-4 w-4" />
          Naam wijzigen
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {/* Vanaf sm staat dit als eigen knop in de balk; twee knoppen voor
            hetzelfde naast elkaar is verwarrend. */}
        <DropdownMenuItem className="sm:hidden" onSelect={toggleTheme}>
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {theme === "dark" ? "Lichte modus" : "Donkere modus"}
        </DropdownMenuItem>
        <DropdownMenuSeparator className="sm:hidden" />
        <DropdownMenuItem onSelect={() => void signOut()}>
          <LogOut className="h-4 w-4" />
          Uitloggen
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="min-h-screen bg-canvas">
      <AdminSEO />

      {/* De balk loopt over de volle breedte, met het logo erin. Daardoor
          blijft het merk staan wanneer je de zijbalk inklapt, en hoeft het
          niet mee te krimpen tot iets onleesbaars. */}
      <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-rail-border bg-rail px-4 lg:px-5">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label="Menu openen"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-rail-muted transition-colors duration-150 hover:bg-rail-hover hover:text-rail-fg lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          {/* Zonder kruisje rechtsboven: het paneel sluit met dezelfde knop
              onderin als waarmee je de zijbalk op een groot scherm inklapt.
              Eén plek, op elk formaat. */}
          <SheetContent hideClose side="left" className="flex w-72 flex-col border-rail-border bg-rail p-0">
            <SheetTitle className="sr-only">Nieuwblik Portaal</SheetTitle>
            <SheetDescription className="sr-only">Navigatie door het portaal</SheetDescription>

            <div className="flex-1 overflow-y-auto py-5">
              {/* Op een telefoon staat het logo niet in de balk - daar is de
                  ruimte te krap - dus staat het hier. */}
              <div className="mb-6 px-4">
                <img src={logoSrc} alt="Nieuwblik" className="h-7 w-auto opacity-90 brightness-0 dark:invert" />
              </div>
              <RailContent collapsed={false} onNavigate={() => setMobileOpen(false)} />
            </div>

            <div className="border-t border-rail-border px-3 py-4">
              <RailFooter collapsed={false} onToggle={() => setMobileOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>

        <div className="hidden shrink-0 sm:block">
          <img src={logoSrc} alt="Nieuwblik" className="h-7 w-auto opacity-90 brightness-0 dark:invert" />
        </div>

        {/* Zoeken is een veld en geen knop: je typt erin, en dat wil je
            zien voordat je klikt. Het is het enige zoekveld voor het hele
            portaal: klanten, taken en pagina's zitten allemaal in het palet. */}
        <button
          type="button"
          onClick={() => setPaletteOpen(true)}
          className="ml-auto flex h-10 min-w-0 flex-1 items-center gap-3 rounded-lg bg-rail-panel px-3 text-sm text-rail-muted transition-colors duration-150 hover:bg-rail-hover sm:max-w-md"
        >
          <Search className="h-4 w-4 shrink-0" />
          <span className="truncate">Zoek een klant, taak of pagina</span>
          <kbd className="ml-auto hidden shrink-0 rounded border border-rail-border px-1.5 py-0.5 font-sans text-xs leading-none sm:block">
            {sneltoetsLabel()}
          </kbd>
        </button>

        <div className="flex shrink-0 items-center gap-1">
          {/* Een taak vastleggen blijft ook op de telefoon bereikbaar: daar
              is geen N-toets, en dit is waar het portaal voor bedoeld is. */}
          {balkKnop(Zap, "Nieuwe taak (N)", () => setCaptureOpen(true))}
          <span className="hidden sm:contents">
            {balkKnop(UserPlus, "Nieuwe klant", () => navigate("/admin/klanten", { state: { nieuw: true } }))}
          </span>

          {/* Geen meldingencentrum, wel het enige wat er echt om roept:
              werk dat over de datum is. Het opent precies die taken. */}
          {balkKnop(
            Bell,
            teLaat > 0 ? `${teLaat} ${teLaat === 1 ? "taak" : "taken"} te laat` : "Niets te laat",
            () => navigate(teLaat > 0 ? "/admin/taken?filter=te-laat" : "/admin/taken"),
            teLaat > 0,
          )}

          {/* Op een telefoon zou een vijfde knop het zoekveld platdrukken;
              daar staat het omschakelen in het accountmenu. */}
          <span className="hidden sm:contents">
            {balkKnop(
              theme === "dark" ? Sun : Moon,
              theme === "dark" ? "Naar lichte modus" : "Naar donkere modus",
              toggleTheme,
            )}
          </span>

          <span className="mx-1 hidden h-6 w-px bg-rail-border sm:block" />
          {accountMenu}
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Onder de balk, tegen de schermrand, zonder tussenruimte of
            afronding. Breedte wisselt zonder overgang: layout-eigenschappen
            animeren geeft schokkerige herberekening. */}
        <aside
          className={cn(
            "hidden shrink-0 flex-col border-r border-rail-border bg-rail py-5 lg:sticky lg:top-16 lg:flex lg:h-[calc(100vh-4rem)]",
            collapsed ? "w-[76px]" : "w-60",
          )}
        >
          <div className="flex-1 overflow-y-auto">
            <RailContent collapsed={collapsed} />
          </div>

          <div
            className={cn(
              "mt-4 border-t border-rail-border pt-4",
              collapsed ? "flex justify-center px-2" : "px-3",
            )}
          >
            <RailFooter collapsed={collapsed} onToggle={toggleCollapsed} />
          </div>
        </aside>

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
      <QuickCapture open={captureOpen} onOpenChange={setCaptureOpen} />
      <ProfileNameDialog open={naamOpen} onOpenChange={setNaamOpen} />
    </div>
  );
};

export default AdminLayout;
