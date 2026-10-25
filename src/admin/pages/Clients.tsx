import { useEffect, useMemo, useState } from "react";
import { addMonths, startOfMonth } from "date-fns";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { DownloadCloud, Plus, Search, UserPlus, Users, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import ClientProjectDialog from "@/admin/components/ClientProjectDialog";
import ClientGrid from "@/admin/components/ClientGrid";
import ClientTable from "@/admin/components/ClientTable";
import EmptyState from "@/admin/components/EmptyState";
import KlantgegevensAanvullen from "@/admin/components/KlantgegevensAanvullen";
import KlantUitMoneybird from "@/admin/components/KlantUitMoneybird";
import { useAdminAuth } from "@/admin/AdminAuthContext";
import { ACTIVE_PROJECT_STATUSES, PROJECT_STATUS, PROJECT_STATUS_ORDER, TOON, type ProjectStatus } from "@/admin/constants";
import { useCombinedRows, type ClientRow } from "@/admin/rows";
import { duurMinuten, useUrenInPeriode } from "@/admin/uren";
import SegmentedControl from "@/admin/ui/SegmentedControl";
import { cn } from "@/lib/utils";

type Filter = ProjectStatus | "alle" | "actief";
type Weergave = "lijst" | "raster";

const WEERGAVE_KEY = "nieuwblik:portaal:klanten-weergave";

/** Bewaarde voorkeur voor lijst of raster; standaard de lijst. */
function leesWeergave(): Weergave {
  try {
    return localStorage.getItem(WEERGAVE_KEY) === "raster" ? "raster" : "lijst";
  } catch {
    return "lijst";
  }
}

/** Fases waarin een project gebouwd wordt; daar hoort een opleverdatum bij. */
const IN_PRODUCTIE: ProjectStatus[] = ["in_ontwerp", "in_bouw", "review"];

/**
 * Filters op ontbrekende gegevens, vanaf de dashboardkaarten "Mailen" en
 * "Ontbrekende gegevens". Losse projecten zonder klant hebben geen
 * contactgegevens om aan te vullen en vallen erbuiten.
 */
const ONTBREKEND: Record<string, { label: string; test: (row: ClientRow) => boolean }> = {
  "zonder-email": { label: "Zonder e-mailadres", test: (r) => Boolean(r.client.id) && !r.client.email?.includes("@") },
  "zonder-telefoon": { label: "Zonder telefoonnummer", test: (r) => Boolean(r.client.id) && !r.client.phone?.trim() },
  "zonder-contact": { label: "Zonder contactpersoon", test: (r) => Boolean(r.client.id) && !r.client.contact_name?.trim() },
  "zonder-deadline": {
    label: "In productie zonder deadline",
    test: (r) =>
      [r.project, ...r.otherProjects].some((p) => p && IN_PRODUCTIE.includes(p.status) && !p.deadline),
  },
};

/**
 * De gecombineerde lijst: klant en werk in één regel. Vervangt de losse
 * klanten- en projectenlijst, die met één project per klant hetzelfde
 * toonden onder twee namen.
 */
const Clients = () => {
  const { user } = useAdminAuth();
  const navigate = useNavigate();
  const { rows, isLoading } = useCombinedRows();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uitMoneybird, setUitMoneybird] = useState(false);
  // Lijst of raster; per browser onthouden.
  const [weergave, setWeergave] = useState<Weergave>(leesWeergave);
  const zetWeergave = (nieuw: Weergave) => {
    setWeergave(nieuw);
    try {
      localStorage.setItem(WEERGAVE_KEY, nieuw);
    } catch {
      // Geldt dan alleen deze sessie.
    }
  };

  // Uren van deze maand per klant, voor de kolom in de lijst.
  const [maand] = useState(() => {
    const van = startOfMonth(new Date());
    return { van, tot: addMonths(van, 1) };
  });
  const { data: urenRegels, isError: urenFout } = useUrenInPeriode(maand.van, maand.tot);
  const urenPerKlant = useMemo(() => {
    if (urenFout || !urenRegels) return undefined;
    const klantVanProject = new Map<string, string>();
    for (const row of rows) {
      if (!row.client.id) continue;
      for (const p of [row.project, ...row.otherProjects]) if (p) klantVanProject.set(p.id, row.client.id);
    }
    const map = new Map<string, number>();
    for (const r of urenRegels) {
      const klant = r.project_id ? klantVanProject.get(r.project_id) : undefined;
      if (klant) map.set(klant, (map.get(klant) ?? 0) + duurMinuten(r));
    }
    return map;
  }, [urenRegels, urenFout, rows]);
  const location = useLocation();

  // Het palet en de bovenbalk sturen hierheen met { nieuw: true } om meteen
  // het formulier te openen. De state wordt daarna gewist, anders springt de
  // dialoog bij een refresh opnieuw open.
  useEffect(() => {
    if (!(location.state as { nieuw?: boolean } | null)?.nieuw) return;
    setDialogOpen(true);
    navigate(location.pathname + location.search, { replace: true, state: null });
  }, [location.state, location.pathname, location.search, navigate]);

  // De filters leven in de URL, zodat het dashboard hierheen linkt en een
  // gefilterde weergave deelbaar is. "actief" (lopend werk) hoort bij de
  // bekende waarden; dat ontbrak, waardoor die link op "alle" terugviel.
  const statusParam = searchParams.get("status");
  const known =
    statusParam === "alle" || statusParam === "actief" || PROJECT_STATUS_ORDER.includes(statusParam as ProjectStatus);
  const filter: Filter = statusParam && known ? (statusParam as Filter) : "alle";
  const toonVerborgen = searchParams.get("verborgen") === "1";
  const ontbrekendParam = searchParams.get("filter");
  const ontbrekend = ontbrekendParam && ONTBREKEND[ontbrekendParam] ? ontbrekendParam : null;

  const setFilter = (next: Filter) => {
    const volgende = new URLSearchParams(searchParams);
    if (next === "alle") volgende.delete("status");
    else volgende.set("status", next);
    setSearchParams(volgende, { replace: true });
  };

  const wisOntbrekend = () => {
    const volgende = new URLSearchParams(searchParams);
    volgende.delete("filter");
    setSearchParams(volgende, { replace: true });
  };

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return rows.filter((row) => {
      // Verborgen klanten (zelf verborgen of alles geannuleerd) alleen op
      // verzoek, bij het filter Geannuleerd, of als je ernaar zoekt.
      if (row.verborgen && !toonVerborgen && filter !== "geannuleerd" && !term) return false;
      if (filter === "actief" && !(row.status && ACTIVE_PROJECT_STATUSES.includes(row.status))) return false;
      if (filter !== "alle" && filter !== "actief" && row.status !== filter) return false;
      if (ontbrekend && !ONTBREKEND[ontbrekend]!.test(row)) return false;
      if (!term) return true;
      return [row.client.name, row.client.contact_name, row.client.email, row.client.city, row.project?.name].some(
        (value) => (value ?? "").toLowerCase().includes(term),
      );
    });
  }, [rows, filter, ontbrekend, search, toonVerborgen]);

  const verborgenAantal = rows.filter((r) => r.verborgen).length;
  const wisselVerborgen = () => {
    const volgende = new URLSearchParams(searchParams);
    if (toonVerborgen) volgende.delete("verborgen");
    else volgende.set("verborgen", "1");
    setSearchParams(volgende, { replace: true });
  };

  const gefilterd = filter !== "alle" || ontbrekend !== null || search.trim() !== "";
  // Verborgen klanten tellen alleen mee als ze getoond worden.
  const totaal = toonVerborgen ? rows.length : rows.length - verborgenAantal;

  return (
    <div className="mx-auto max-w-[1400px] space-y-4 lg:space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl tracking-tight">Klanten</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {gefilterd ? `${visible.length} van ${totaal}` : totaal} {totaal === 1 ? "klant" : "klanten"}
            {" · "}open werk bovenaan
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setSearchParams((p) => ({ ...Object.fromEntries(p), aanvullen: "1" }))}>
            <DownloadCloud className="h-4 w-4" />
            Aanvullen uit Moneybird
          </Button>
          <Button variant="outline" onClick={() => setUitMoneybird(true)}>
            <UserPlus className="h-4 w-4" />
            Toevoegen uit Moneybird
          </Button>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Nieuwe klant
          </Button>
        </div>
      </div>

      <KlantUitMoneybird open={uitMoneybird} onOpenChange={setUitMoneybird} />

      <KlantgegevensAanvullen
        open={searchParams.get("aanvullen") === "1"}
        onOpenChange={(o) => {
          if (o) return;
          const volgende = new URLSearchParams(searchParams);
          volgende.delete("aanvullen");
          setSearchParams(volgende, { replace: true });
        }}
      />

      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="bg-card pl-9"
            placeholder="Zoek op naam, contactpersoon, e-mail of plaats"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <SegmentedControl
          label="Weergave"
          waarde={weergave}
          onChange={zetWeergave}
          opties={[
            { waarde: "lijst", label: "Lijst" },
            { waarde: "raster", label: "Raster" },
          ]}
        />
        <Select value={filter} onValueChange={(v) => setFilter(v as Filter)}>
          <SelectTrigger className="w-[200px] bg-card">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alle">Alle fases</SelectItem>
            <SelectItem value="actief">Lopend werk</SelectItem>
            {PROJECT_STATUS_ORDER.map((s) => (
              <SelectItem key={s} value={s}>
                {PROJECT_STATUS[s].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {ontbrekend && (
        <div>
          <button
            type="button"
            onClick={wisOntbrekend}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[13px] font-medium transition-colors hover:opacity-80",
              TOON.warning.pil,
            )}
          >
            {ONTBREKEND[ontbrekend]!.label}
            <X className="h-3.5 w-3.5" />
            <span className="sr-only">Filter weghalen</span>
          </button>
        </div>
      )}

      {isLoading ? (
        weergave === "lijst" ? (
          <Skeleton className="h-96 rounded-[16px]" />
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:gap-4 xl:grid-cols-4">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <Skeleton key={i} className="aspect-[4/3] rounded-[14px]" />
            ))}
          </div>
        )
      ) : visible.length === 0 ? (
        <EmptyState
          icon={Users}
          title={rows.length === 0 ? "Nog geen klanten" : "Niets gevonden"}
          description={rows.length === 0 ? "Voeg je eerste klant toe." : "Pas het filter of de zoekterm aan."}
          action={
            rows.length === 0 ? (
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4" />
                Nieuwe klant
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setSearchParams({}, { replace: true });
                }}
              >
                Filters wissen
              </Button>
            )
          }
        />
      ) : weergave === "lijst" ? (
        <ClientTable rows={visible} urenPerKlant={urenPerKlant} />
      ) : (
        <ClientGrid rows={visible} />
      )}

      {verborgenAantal > 0 && filter !== "geannuleerd" && !search.trim() && (
        <button
          type="button"
          onClick={wisselVerborgen}
          className="text-[13px] text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          {toonVerborgen
            ? "Verborgen klanten weer verbergen"
            : `${verborgenAantal} verborgen ${verborgenAantal === 1 ? "klant" : "klanten"} tonen`}
        </button>
      )}

      <ClientProjectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        userId={user?.id ?? null}
        onCreated={(projectId) => navigate(`/admin/projecten/${projectId}`)}
      />
    </div>
  );
};

export default Clients;
