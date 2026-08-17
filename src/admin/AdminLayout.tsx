import { useState } from "react";
import { NavLink, Navigate, Outlet, useLocation } from "react-router-dom";
import {
  CheckSquare,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  ShieldAlert,
  Star,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import SEOHead from "@/components/SEOHead";
import { cn } from "@/lib/utils";
import { useAdminAuth } from "@/admin/AdminAuthContext";
import CommandPalette, { useCommandPaletteShortcut } from "@/admin/components/CommandPalette";
import { initials } from "@/admin/format";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/projecten", label: "Projecten", icon: FolderKanban, end: false },
  { to: "/admin/klanten", label: "Klanten", icon: Users, end: false },
  { to: "/admin/taken", label: "Taken", icon: CheckSquare, end: false },
  { to: "/admin/reviews", label: "Reviews", icon: Star, end: false },
];

/** Het portaal wordt nooit geïndexeerd, ongeacht welke subpagina open staat. */
const AdminSEO = () => (
  <SEOHead
    title="Portaal — Nieuwblik"
    description="Interne werkomgeving van Nieuwblik."
    noIndex={true}
    includeOrganizationSchema={false}
  />
);

const NavItems = ({ onNavigate }: { onNavigate?: () => void }) => (
  <nav className="flex flex-col gap-1">
    {NAV.map(({ to, label, icon: Icon, end }) => (
      <NavLink
        key={to}
        to={to}
        end={end}
        onClick={onNavigate}
        className={({ isActive }) =>
          cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
            isActive
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )
        }
      >
        <Icon className="h-4 w-4 shrink-0" />
        {label}
      </NavLink>
    ))}
  </nav>
);

const AdminLayout = () => {
  const { status, displayName, signOut } = useAdminAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useCommandPaletteShortcut(setPaletteOpen);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <AdminSEO />
        <p className="text-sm text-muted-foreground">Portaal laden…</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    // Het huidige pad meegeven, zodat je na inloggen terugkomt waar je was.
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
    <div className="min-h-screen bg-muted/30">
      <AdminSEO />

      <div className="flex min-h-screen">
        <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-background lg:flex">
          <div className="flex h-16 items-center border-b border-border px-5">
            <span className="text-sm font-semibold tracking-tight">Nieuwblik Portaal</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="mb-3 flex w-full items-center gap-2 rounded-md border border-input px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Search className="h-4 w-4 shrink-0" />
              Zoeken
              <kbd className="ml-auto rounded border bg-muted px-1.5 py-0.5 font-sans text-[10px]">⌘K</kbd>
            </button>
            <NavItems />
          </div>
          <div className="border-t border-border p-3">
            <div className="flex items-center gap-3 rounded-md px-2 py-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {initials(displayName)}
              </div>
              <span className="min-w-0 flex-1 truncate text-sm" title={displayName}>
                {displayName}
              </span>
            </div>
            <Button variant="ghost" size="sm" className="mt-1 w-full justify-start" onClick={() => void signOut()}>
              <LogOut className="h-4 w-4" />
              Uitloggen
            </Button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-16 items-center gap-3 border-b border-border bg-background px-4 lg:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Menu openen">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-4">
                {/* Radix eist een titel in elke dialoogschil, anders kondigt een
                    schermlezer alleen "dialog" aan. */}
                <SheetTitle className="mb-1 text-sm font-semibold">Nieuwblik Portaal</SheetTitle>
                <SheetDescription className="sr-only">Navigatie door het portaal</SheetDescription>
                <div className="mt-4">
                  <NavItems onNavigate={() => setMobileOpen(false)} />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-4 w-full justify-start"
                  onClick={() => void signOut()}
                >
                  <LogOut className="h-4 w-4" />
                  Uitloggen
                </Button>
              </SheetContent>
            </Sheet>
            <span className="text-sm font-semibold">Nieuwblik Portaal</span>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto"
              aria-label="Zoeken"
              onClick={() => setPaletteOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
          </header>

          <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
};

export default AdminLayout;
