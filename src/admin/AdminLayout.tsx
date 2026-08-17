import { useCallback, useEffect, useState } from "react";
import { Link, NavLink, Navigate, Outlet, useLocation } from "react-router-dom";
import {
  CheckSquare,
  ChevronDown,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Search,
  ShieldAlert,
  Sun,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import SEOHead from "@/components/SEOHead";
import { cn } from "@/lib/utils";
import logoSrc from "@/assets/logo.webp";
import { useAdminAuth } from "@/admin/AdminAuthContext";
import CommandPalette, { useCommandPaletteShortcut } from "@/admin/components/CommandPalette";
import QuickCapture from "@/admin/components/QuickCapture";
import { PROJECT_STATUS, PROJECT_STATUS_ORDER } from "@/admin/constants";
import { initials } from "@/admin/format";
import { useProjects, useTasks } from "@/admin/queries";
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
    collapsed ? "h-10 w-10 justify-center" : "gap-3 px-3 py-2",
    isActive ? "bg-rail-active text-rail-fg" : "text-rail-muted hover:bg-rail-hover hover:text-rail-fg",
  );

/**
 * De inhoud van de zijbalk, gedeeld door de vaste balk op desktop en het
 * uitschuifpaneel op mobiel. Ingeklapt bestaat alleen op desktop.
 */
const RailContent = ({
  collapsed,
  onNavigate,
  onSearch,
  onCapture,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
  onSearch: () => void;
  onCapture: () => void;
}) => {
  const { data: tasks = [] } = useTasks();
  const { data: projects = [] } = useProjects();
  const [statusOpen, setStatusOpen] = useState(true);
  const location = useLocation();

  // NavLink kijkt alleen naar het pad, dus de statusfilters zouden allemaal
  // tegelijk actief lijken. Vandaar dat die rijen hun eigen actieve staat
  // bepalen op basis van de querystring.
  const onClientsPage = location.pathname === "/admin/klanten";
  const activeStatus = onClientsPage ? new URLSearchParams(location.search).get("status") : null;

  const openTasks = tasks.filter((t) => t.status !== "klaar").length;

  // Alleen fases tonen waar daadwerkelijk projecten in zitten. Een rij lege
  // filters is ruis, en de lijst groeit vanzelf mee als er werk bij komt.
  const statusCounts = PROJECT_STATUS_ORDER.map((status) => ({
    status,
    count: projects.filter((p) => p.status === status).length,
  })).filter((row) => row.count > 0);

  // Klanten en projecten zijn één ingang: met één project per klant toonden
  // twee lijsten hetzelfde onder een andere naam.
  const nav: NavEntry[] = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/admin/taken", label: "Taken", icon: CheckSquare, end: false, count: openTasks },
  ];

  return (
    <>
      <div className={cn("flex items-center", collapsed ? "justify-center px-2" : "gap-3 px-4")}>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rail-panel text-sm font-semibold text-rail-fg">
          N
        </span>
        {!collapsed && <img src={logoSrc} alt="Nieuwblik" className="h-4 w-auto opacity-90" />}
      </div>

      {/* De handeling die het vaakst voorkomt staat bovenaan en altijd op
          dezelfde plek: iets vastleggen wat een klant wil. */}
      <div className={cn("mt-6", collapsed ? "px-2" : "px-3")}>
        <button
          type="button"
          onClick={onCapture}
          title="Nieuwe taak (N)"
          className={cn(
            "flex w-full items-center rounded-lg bg-rail-accent/15 text-sm font-medium text-rail-accent transition-colors duration-150 hover:bg-rail-accent/25",
            collapsed ? "h-10 justify-center" : "gap-2 px-3 py-2",
          )}
        >
          <Plus className="h-4 w-4 shrink-0" />
          {!collapsed && (
            <>
              Nieuwe taak
              <kbd className="ml-auto rounded border border-rail-accent/30 px-1.5 py-0.5 font-sans text-[10px] leading-none">
                N
              </kbd>
            </>
          )}
        </button>
      </div>

      <div className={cn("mt-2", collapsed ? "px-2" : "px-3")}>
        <button
          type="button"
          onClick={onSearch}
          title="Zoeken (Cmd+K)"
          className={cn(
            "flex w-full items-center rounded-lg border border-rail-border text-sm text-rail-muted transition-colors duration-150 hover:bg-rail-hover hover:text-rail-fg",
            collapsed ? "h-10 justify-center" : "gap-2 px-3 py-2",
          )}
        >
          <Search className="h-4 w-4 shrink-0" />
          {!collapsed && (
            <>
              Zoeken
              <kbd className="ml-auto rounded border border-rail-border px-1.5 py-0.5 font-sans text-[10px] leading-none">
                ⌘K
              </kbd>
            </>
          )}
        </button>
      </div>

      <nav className={cn("mt-4 flex flex-col gap-1", collapsed ? "px-2" : "px-3")}>
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
                  <span className="ml-auto text-xs tabular-nums text-rail-muted">
                    {count > 99 ? "99+" : count}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className={cn("mt-5 border-t border-rail-border pt-5", collapsed ? "px-2" : "px-3")}>
        {collapsed ? (
          <NavLink
            to="/admin/klanten"
            onClick={onNavigate}
            title="Klanten"
            className={({ isActive }) => railItem(isActive, true)}
          >
            <Users className="h-[18px] w-[18px]" />
          </NavLink>
        ) : (
          <>
            <div className="flex items-center">
              <Link
                to="/admin/klanten"
                onClick={onNavigate}
                className={cn(
                  "flex flex-1 items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-150",
                  onClientsPage && !activeStatus
                    ? "bg-rail-active text-rail-fg"
                    : "text-rail-muted hover:bg-rail-hover hover:text-rail-fg",
                )}
              >
                <Users className="h-[18px] w-[18px] shrink-0" />
                Klanten
              </Link>
              {statusCounts.length > 0 && (
                <button
                  type="button"
                  onClick={() => setStatusOpen((open) => !open)}
                  aria-expanded={statusOpen}
                  aria-label={statusOpen ? "Fases inklappen" : "Fases uitklappen"}
                  className="ml-1 rounded-md p-1.5 text-rail-muted transition-colors duration-150 hover:bg-rail-hover hover:text-rail-fg"
                >
                  <ChevronDown
                    className={cn("h-4 w-4 transition-transform duration-150", statusOpen && "rotate-180")}
                  />
                </button>
              )}
            </div>

            {statusOpen && statusCounts.length > 0 && (
              <ul className="mt-1 space-y-0.5">
                {statusCounts.map(({ status, count }) => (
                  <li key={status}>
                    <Link
                      to={`/admin/klanten?status=${status}`}
                      onClick={onNavigate}
                      className={cn(
                        "flex items-center gap-3 rounded-lg py-1.5 pl-6 pr-3 text-sm transition-colors duration-150",
                        activeStatus === status
                          ? "bg-rail-active text-rail-fg"
                          : "text-rail-muted hover:bg-rail-hover hover:text-rail-fg",
                      )}
                    >
                      <span className={cn("h-2 w-2 shrink-0 rounded-full", PROJECT_STATUS[status].dot)} />
                      {PROJECT_STATUS[status].label}
                      <span className="ml-auto text-xs tabular-nums">{count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </>
  );
};

const AdminLayout = () => {
  const { status, displayName, signOut } = useAdminAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [captureOpen, setCaptureOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-muted/40">
      <AdminSEO />

      <div className="flex min-h-screen lg:gap-4 lg:p-4">
        {/* De zijbalk is een zwevend paneel op het werkvlak, niet een kolom
            die tegen de schermrand plakt. Breedte wisselt zonder overgang:
            layout-eigenschappen animeren geeft schokkerige herberekening. */}
        <aside
          className={cn(
            "hidden shrink-0 flex-col rounded-2xl bg-rail py-5 lg:sticky lg:top-4 lg:flex lg:h-[calc(100vh-2rem)]",
            collapsed ? "w-[76px]" : "w-64",
          )}
        >
          <div className="flex-1 overflow-y-auto">
            <RailContent
              collapsed={collapsed}
              onSearch={() => setPaletteOpen(true)}
              onCapture={() => setCaptureOpen(true)}
            />
          </div>

          <div className={cn("mt-4 border-t border-rail-border pt-4", collapsed ? "px-2" : "px-3")}>
            <div
              className={cn(
                "flex items-center rounded-lg py-2",
                collapsed ? "justify-center" : "gap-3 px-3",
              )}
              title={collapsed ? displayName : undefined}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rail-accent/20 text-xs font-semibold text-rail-accent">
                {initials(displayName)}
              </span>
              {!collapsed && (
                <span className="min-w-0 flex-1 truncate text-sm text-rail-fg" title={displayName}>
                  {displayName}
                </span>
              )}
            </div>

            <div className={cn("mt-1 flex items-center gap-1", collapsed && "flex-col")}>
              <button
                type="button"
                onClick={toggleTheme}
                title={theme === "dark" ? "Naar lichte modus" : "Naar donkere modus"}
                aria-label={theme === "dark" ? "Naar lichte modus" : "Naar donkere modus"}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-rail-muted transition-colors duration-150 hover:bg-rail-hover hover:text-rail-fg"
              >
                {theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
              </button>

              <button
                type="button"
                onClick={toggleCollapsed}
                title={collapsed ? "Zijbalk uitklappen" : "Zijbalk inklappen"}
                aria-label={collapsed ? "Zijbalk uitklappen" : "Zijbalk inklappen"}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-rail-muted transition-colors duration-150 hover:bg-rail-hover hover:text-rail-fg"
              >
                {collapsed ? (
                  <PanelLeftOpen className="h-[18px] w-[18px]" />
                ) : (
                  <PanelLeftClose className="h-[18px] w-[18px]" />
                )}
              </button>

              <button
                type="button"
                onClick={() => void signOut()}
                title="Uitloggen"
                aria-label="Uitloggen"
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg text-rail-muted transition-colors duration-150 hover:bg-rail-hover hover:text-rail-fg",
                  !collapsed && "ml-auto",
                )}
              >
                <LogOut className="h-[18px] w-[18px]" />
              </button>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-16 items-center gap-2 border-b border-border bg-background px-4 lg:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Menu openen">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 border-rail-border bg-rail px-0 py-5">
                <SheetTitle className="sr-only">Nieuwblik Portaal</SheetTitle>
                <SheetDescription className="sr-only">Navigatie door het portaal</SheetDescription>
                <RailContent
                  collapsed={false}
                  onNavigate={() => setMobileOpen(false)}
                  onSearch={() => {
                    setMobileOpen(false);
                    setPaletteOpen(true);
                  }}
                  onCapture={() => {
                    setMobileOpen(false);
                    setCaptureOpen(true);
                  }}
                />
              </SheetContent>
            </Sheet>

            <span className="text-sm font-semibold">Nieuwblik Portaal</span>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Naar lichte modus" : "Naar donkere modus"}
              className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <Button variant="ghost" size="icon" aria-label="Zoeken" onClick={() => setPaletteOpen(true)}>
              <Search className="h-5 w-5" />
            </Button>
          </header>

          <main className="min-w-0 flex-1 rounded-none bg-background p-4 sm:p-6 lg:rounded-2xl lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
      <QuickCapture open={captureOpen} onOpenChange={setCaptureOpen} />
    </div>
  );
};

export default AdminLayout;
