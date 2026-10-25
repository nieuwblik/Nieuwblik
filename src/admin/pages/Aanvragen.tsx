import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Building2, Inbox, Mail, Phone, Trash2, UserPlus, UserRound } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/admin/AdminAuthContext";
import {
  AANVRAAG_STATUS,
  AANVRAAG_STATUS_ORDER,
  isOpenAanvraag,
  useAanvragen,
  useDeleteAanvraag,
  useUpdateAanvraag,
} from "@/admin/aanvragen";
import ClientProjectDialog from "@/admin/components/ClientProjectDialog";
import EmptyState from "@/admin/components/EmptyState";
import { formatDateTime, timeAgo } from "@/admin/format";
import { Panel, PanelBody, PanelHeader } from "@/admin/ui/Panel";
import SegmentedControl from "@/admin/ui/SegmentedControl";
import StatusPill from "@/admin/ui/StatusPill";
import { useConfirm } from "@/admin/useConfirm";
import { isMigratieNodig, type Aanvraag } from "@/admin/werkstroomDb";

type Filter = "open" | "gewonnen" | "verloren" | "alles";

const FILTERS: { waarde: Filter; label: string }[] = [
  { waarde: "open", label: "Open" },
  { waarde: "gewonnen", label: "Gewonnen" },
  { waarde: "verloren", label: "Verloren" },
  { waarde: "alles", label: "Alles" },
];

/**
 * Aanvragen: elk bericht via het contactformulier van de site, van "nieuw"
 * tot gewonnen of verloren. Links de lijst, rechts wat iemand vroeg, hoe je
 * hem bereikt, je eigen notitie en met één klik een klant ervan maken.
 */
const Aanvragen = () => {
  const { user } = useAdminAuth();
  const { data: aanvragen = [], isLoading, isError, error } = useAanvragen();
  const update = useUpdateAanvraag();
  const verwijder = useDeleteAanvraag();
  const { vraagBevestiging, dialoog } = useConfirm();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState<Filter>("open");
  const [klantVan, setKlantVan] = useState<Aanvraag | null>(null);
  const [notitie, setNotitie] = useState("");

  const zichtbaar = useMemo(
    () =>
      aanvragen.filter((a) =>
        filter === "alles" ? true : filter === "open" ? isOpenAanvraag(a) : a.status === filter,
      ),
    [aanvragen, filter],
  );
  const gekozenId = searchParams.get("id");
  const gekozen = aanvragen.find((a) => a.id === gekozenId) ?? zichtbaar[0] ?? null;

  useEffect(() => setNotitie(gekozen?.notitie ?? ""), [gekozen?.id, gekozen?.notitie]);

  const kies = (id: string) => setSearchParams({ id }, { replace: true });
  const nieuw = aanvragen.filter((a) => a.status === "nieuw").length;
  const open = aanvragen.filter(isOpenAanvraag).length;

  const zetStatus = async (a: Aanvraag, status: Aanvraag["status"]) => {
    try {
      await update.mutateAsync({ id: a.id, values: { status } });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Bijwerken mislukt");
    }
  };

  const bewaarNotitie = async () => {
    if (!gekozen || notitie === (gekozen.notitie ?? "")) return;
    try {
      await update.mutateAsync({ id: gekozen.id, values: { notitie: notitie.trim() || null } });
      toast.success("Notitie bewaard");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Bewaren mislukt");
    }
  };

  const wis = async (a: Aanvraag) => {
    const ja = await vraagBevestiging({
      titel: "Deze aanvraag verwijderen?",
      beschrijving: `De aanvraag van ${a.naam}. Dit kun je niet terugdraaien; zet hem anders op Verloren.`,
    });
    if (!ja) return;
    try {
      await verwijder.mutateAsync(a.id);
      setSearchParams({}, { replace: true });
      toast.success("Aanvraag verwijderd");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Verwijderen mislukt");
    }
  };

  /** Na het aanmaken van de klant de aanvraag eraan koppelen. */
  const koppel = async (projectId: string) => {
    if (!klantVan) return;
    const { data } = await supabase.from("projects").select("client_id").eq("id", projectId).maybeSingle();
    if (data?.client_id) {
      await update.mutateAsync({ id: klantVan.id, values: { client_id: data.client_id } }).catch(() => undefined);
    }
    toast.success(`${klantVan.bedrijf || klantVan.naam} staat bij de klanten`);
  };

  const kop = (
    <div>
      <h1 className="text-2xl tracking-tight">Aanvragen</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Via het contactformulier van de site
        {aanvragen.length > 0 && ` · ${open} open${nieuw > 0 ? `, waarvan ${nieuw} nieuw` : ""}`}
      </p>
    </div>
  );

  if (isError) {
    return (
      <div className="mx-auto max-w-[1100px] space-y-5">
        {kop}
        <EmptyState
          icon={Inbox}
          title={isMigratieNodig(error) ? "Aanvragen zijn nog niet geactiveerd" : "De aanvragen konden niet geladen worden"}
          description={
            isMigratieNodig(error)
              ? "Voer in Lovable de migratie portaal_werkstroom uit. Daarna komt elk bericht via het contactformulier hier binnen."
              : error instanceof Error
                ? error.message
                : undefined
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1100px] space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        {kop}
        <SegmentedControl label="Welke aanvragen" opties={FILTERS} waarde={filter} onChange={setFilter} />
      </div>

      {isLoading ? (
        <div className="grid gap-4 lg:grid-cols-[360px_minmax(0,1fr)]">
          <Skeleton className="h-80 rounded-[16px]" />
          <Skeleton className="h-80 rounded-[16px]" />
        </div>
      ) : aanvragen.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="Nog geen aanvragen"
          description="Elk bericht via het contactformulier van de site komt hier binnen, met naam, contactgegevens en vraag."
        />
      ) : (
        <div className="grid items-start gap-4 lg:grid-cols-[360px_minmax(0,1fr)]">
          <Panel>
            <PanelHeader icon={Inbox} titel={FILTERS.find((f) => f.waarde === filter)!.label} subtitel={`${zichtbaar.length} aanvragen`} />
            <PanelBody className="px-2 pb-2 pt-2">
              {zichtbaar.length === 0 ? (
                <p className="px-2 py-3 text-sm text-muted-foreground">Niets in deze lijst.</p>
              ) : (
                <ul>
                  {zichtbaar.map((a) => (
                    <li key={a.id}>
                      <button
                        type="button"
                        onClick={() => kies(a.id)}
                        className={cn(
                          "p-rij flex w-full items-start gap-3 rounded-lg px-2 py-2.5 text-left text-sm",
                          gekozen?.id === a.id && "bg-muted",
                        )}
                      >
                        <span
                          className={cn(
                            "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                            a.status === "nieuw" ? "bg-info" : "bg-transparent",
                          )}
                          aria-hidden="true"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-baseline justify-between gap-2">
                            <span className={cn("truncate", a.status === "nieuw" ? "font-semibold" : "font-medium")}>
                              {a.bedrijf || a.naam}
                            </span>
                            <span className="shrink-0 text-[12px] text-muted-foreground">{timeAgo(a.created_at)}</span>
                          </span>
                          <span className="block truncate text-[13px] text-muted-foreground">
                            {a.onderwerp || a.bericht || a.email}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </PanelBody>
          </Panel>

          {gekozen && (
            <Panel key={gekozen.id}>
              <PanelHeader
                icon={UserRound}
                titel={gekozen.bedrijf || gekozen.naam}
                subtitel={`${gekozen.bedrijf ? `${gekozen.naam} · ` : ""}${formatDateTime(gekozen.created_at)}`}
                actie={<StatusPill toon={AANVRAAG_STATUS[gekozen.status].toon}>{AANVRAAG_STATUS[gekozen.status].label}</StatusPill>}
              />
              <PanelBody className="space-y-6">
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  <a href={`mailto:${gekozen.email}`} className="inline-flex items-center gap-2 underline-offset-4 hover:underline">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {gekozen.email}
                  </a>
                  {gekozen.telefoon && (
                    <a href={`tel:${gekozen.telefoon}`} className="inline-flex items-center gap-2 underline-offset-4 hover:underline">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {gekozen.telefoon}
                    </a>
                  )}
                  {gekozen.bedrijf && (
                    <span className="inline-flex items-center gap-2 text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      {gekozen.bedrijf}
                    </span>
                  )}
                </div>

                <div>
                  {gekozen.onderwerp && <p className="p-kaarttitel mb-1.5">{gekozen.onderwerp}</p>}
                  <p className={cn("whitespace-pre-wrap text-sm leading-relaxed", !gekozen.bericht && "text-muted-foreground")}>
                    {gekozen.bericht || "Geen bericht meegestuurd."}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-[13px] text-muted-foreground">Stand</p>
                  <div className="flex flex-wrap gap-1.5">
                    {AANVRAAG_STATUS_ORDER.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => void zetStatus(gekozen, s)}
                        aria-pressed={gekozen.status === s}
                        className={cn(
                          "rounded-lg border px-3 py-1.5 text-[13px] transition-colors",
                          gekozen.status === s
                            ? "border-foreground/25 bg-muted font-medium"
                            : "border-border text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                        )}
                      >
                        {AANVRAAG_STATUS[s].label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="aanvraag-notitie" className="mb-2 block text-[13px] text-muted-foreground">
                    Notitie
                  </label>
                  <Textarea
                    id="aanvraag-notitie"
                    value={notitie}
                    onChange={(e) => setNotitie(e.target.value)}
                    onBlur={() => void bewaarNotitie()}
                    placeholder="Wat is er besproken, wat is de volgende stap?"
                    rows={3}
                    maxLength={4000}
                    className="min-h-[5.5rem] resize-y [field-sizing:content]"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
                  {gekozen.client_id ? (
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/admin/klanten/${gekozen.client_id}`}>
                        <UserRound className="h-4 w-4" />
                        Naar de klant
                      </Link>
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => setKlantVan(gekozen)}>
                      <UserPlus className="h-4 w-4" />
                      Maak klant
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => void wis(gekozen)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Verwijderen
                  </Button>
                </div>
              </PanelBody>
            </Panel>
          )}
        </div>
      )}

      <ClientProjectDialog
        open={klantVan !== null}
        onOpenChange={(o) => !o && setKlantVan(null)}
        userId={user?.id ?? null}
        voorinvullen={
          klantVan
            ? {
                name: klantVan.bedrijf || klantVan.naam,
                contact_name: klantVan.bedrijf ? klantVan.naam : "",
                email: klantVan.email,
                phone: klantVan.telefoon ?? "",
                notes: [klantVan.onderwerp, klantVan.bericht].filter(Boolean).join("\n\n"),
              }
            : undefined
        }
        onCreated={(projectId) => void koppel(projectId)}
      />
      {dialoog}
    </div>
  );
};

export default Aanvragen;
