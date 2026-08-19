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
  Menu,
  Moon,
  Receipt,
  Search,
  ShieldAlert,
  Sun,
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
import SEOHead from "@/components/SEOHead";
import { cn } from "@/lib/utils";
import logoSrc from "@/assets/logo.webp";
import { useAdminAuth } from "@/admin/AdminAuthContext";
import CommandPalette, { useCommandPaletteShortcut } from "@/admin/components/CommandPalette";
import QuickCapture from "@/admin/components/QuickCapture";
import { daysUntil, initials } from "@/admin/format";
import { useTasks } from "@/admin/queries";
import { usePortalPwa } from "@/admin/pwa";
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
  count?: number;
}

const railItem = (isActive: boolean, collapsed: boolean) =>
  cn(
    "group flex items-center rounded-lg text-sm transition-colors duration-150",
    collapsed ? "h-10 w-10 justify-center" : "gap-3 px-3 py-2.5",
    isActive ? "bg-rail-active text-rail-fg" : "text-rail-muted hover:bg-rail-hover hover:text-rail-fg",
  );

/**
 * De inhoud van de zijbalk, gedeeld door de vaste balk op desktop en het
 * uitschuifpaneel op mobiel. Ingeklapt bestaat alleen op desktop.
 *
 * Zoeken en een taak vastleggen stonden hier als knop, maar horen bij de
 * bovenbalk: dat zijn handelingen, geen plekken. Wat overblijft is waar je
 * heen kunt.
 */
const RailContent = ({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
}) => {
  const { data: tasks = [] } = useTasks();

  const openTasks = tasks.filter((t) => t.status !== "klaar").length;

  // Klanten en projecten zijn één ingang: met één project per klant toonden
  // twee lijsten hetzelfde onder een andere naam. Filteren op fase gebeurt op
  // de klantenpagina zelf; in de zijbalk was dat een rij die naar dezelfde
  // lijst wees zolang alles live staat.
  const nav: NavEntry[] = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/admin/klanten", label: "Klanten", icon: Users, end: false },
    { to: "/admin/taken", label: "Taken", icon: CheckSquare, end: false, count: openTasks },
    { to: "/admin/kalender", label: "Kalender", icon: CalendarDays, end: false },
    { to: "/admin/hosting", label: "Hosting", icon: Receipt, end: false },
  ];

  return (
    <>
      {/* Ingeklapt zijn de rijen 40 breed in een balk van 76: zonder centreren
          houden ze links 8 en rechts 28 over, en dan staat de hele kolom
          scheef. */}
      <nav className={cn("flex flex-col gap-1", collapsed ? "items-center px-2" : "px-3")}>
        {nav.map(({ to, label, icon: Icon, end, count }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            title={collapsed ? label : undefined}
            className={({ isActive }) => railItem(isActive, collapsed)}
          >
            <Icon className="h-[18px] w-[18px] shrink-0" />
            {!collapsed && (
              <>
                {label}
                {count !== undefined && count > 0 && (
                  <span className="ml-auto text-xs tabular-nums text-rail-muted">{count > 99 ? "99+" : count}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </>
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
      collapsed ? "h-10 w-10 justify-center" : "w-full gap-3 px-3 py-2.5",
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

const AdminLayout = () => {
  const { status, displayName, signOut } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [captureOpen, setCaptureOpen] = useState(false);
  const { data: tasks = [] } = useTasks();

  const teLaat = tasks.filter((t) => t.status !== "klaar" && (daysUntil(t.due_date) ?? 1) < 0).length;

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

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <AdminSEO />
        <p className="text-sm text-muted-foreground">Portaal laden…</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname + location.search }} />;
  }

  if (status === "forbidden") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
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
        {stip && <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500 ring-2 ring-rail" />}
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
    <div className="min-h-screen bg-background">
      <AdminSEO />

      {/* De balk loopt over de volle breedte, met het logo erin. Daardoor
          blijft het merk staan wanneer je de zijbalk inklapt, en hoeft het
          niet mee te krimpen tot iets onleesbaars. Donker als de zijbalk:
          samen vormen ze één vlak, en het logo is licht. */}
      <header className="sticky top-0 z-40 flex h-16 items-center gap-3 bg-rail px-4 lg:px-5">
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
          <SheetContent side="left" className="w-72 border-rail-border bg-rail px-0 py-5">
            <SheetTitle className="sr-only">Nieuwblik Portaal</SheetTitle>
            <SheetDescription className="sr-only">Navigatie door het portaal</SheetDescription>
            {/* Op een telefoon staat het logo niet in de balk - daar is de
                ruimte te krap - dus staat het hier. */}
            <div className="mb-6 px-4">
              <img src={logoSrc} alt="Nieuwblik" className="h-7 w-auto opacity-90" />
            </div>
            {/* Geen inklapknop in het uitschuifpaneel: dat sluit je door
                ernaast te tikken, inklappen bestaat daar niet. */}
            <RailContent collapsed={false} onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Op grote schermen is dit blok precies zo breed dat de zoekbalk op
            de contentkolom begint: 20 padding + 224 + 12 tussenruimte = 256. */}
        <div className="hidden shrink-0 sm:block lg:w-56">
          <img src={logoSrc} alt="Nieuwblik" className="h-7 w-auto opacity-90" />
        </div>

        {/* Zoeken is een veld en geen knop: je typt erin, en dat wil je
            zien voordat je klikt. Het opent hetzelfde palet als ⌘K. */}
        <button
          type="button"
          onClick={() => setPaletteOpen(true)}
          className="flex h-10 min-w-0 flex-1 items-center gap-3 rounded-lg bg-rail-panel px-3 text-sm text-rail-muted transition-colors duration-150 hover:bg-rail-hover sm:max-w-md"
        >
          <Search className="h-4 w-4 shrink-0" />
          <span className="truncate">Zoek of typ een opdracht</span>
          <kbd className="ml-auto hidden shrink-0 rounded border border-rail-border px-1.5 py-0.5 font-sans text-[10px] leading-none sm:block">
            ⌘K
          </kbd>
        </button>

        <div className="ml-auto flex items-center gap-1">
          {/* Een taak vastleggen blijft ook op de telefoon bereikbaar: daar
              is geen N-toets, en dit is waar het portaal voor bedoeld is. */}
          {balkKnop(Zap, "Nieuwe taak (N)", () => setCaptureOpen(true))}
          <span className="hidden sm:contents">
            {balkKnop(UserPlus, "Nieuwe klant", () => navigate("/admin/klanten", { state: { nieuw: true } }))}
          </span>

          {/* Geen meldingencentrum, wel het enige wat er echt om roept:
              werk dat over de datum is. */}
          {balkKnop(
            Bell,
            teLaat > 0 ? `${teLaat} ${teLaat === 1 ? "taak" : "taken"} te laat` : "Niets te laat",
            () => navigate("/admin/taken"),
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
            "hidden shrink-0 flex-col bg-rail py-5 lg:sticky lg:top-16 lg:flex lg:h-[calc(100vh-4rem)]",
            collapsed ? "w-[76px]" : "w-64",
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
    </div>
  );
};

export default AdminLayout;
