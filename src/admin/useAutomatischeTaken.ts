import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { addDays, format, parseISO } from "date-fns";
import { nl } from "date-fns/locale";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/admin/AdminAuthContext";
import { daysUntil } from "@/admin/format";
import {
  formatBedrag,
  heeftData,
  isCredit,
  isKleineRest,
  OFFERTE_WACHTTIJD,
  offerteWachtDagen,
  useFinancien,
  zoekKlantBij,
  type OpenFactuur,
} from "@/admin/financien";
import { adminKeys, useClients, useProjects, useTasks, type Client, type TaskWithProject } from "@/admin/queries";

/** Na zoveel dagen over de vervaldatum wordt een factuur een belactie. */
const NABEL_GRENS = 30;
/** Zoveel dagen voor de uiterste datum komt de btw-aangifte op je lijst. */
const BTW_VOORLOOP = 14;
/** Sleutels van het nabellen: één per klant, naar de oudste factuur. */
const NABEL = "factuur-nabellen:";

interface Signaal {
  sleutel: string;
  titel: string;
  omschrijving: string;
  deadline: string;
  prioriteit: "normaal" | "hoog";
  klant: string | null;
}

const vandaag = () => format(new Date(), "yyyy-MM-dd");
const datum = (d: string) => format(parseISO(d), "d MMMM", { locale: nl });
const dagenTeLaat = (f: OpenFactuur) => -(daysUntil(f.vervaldatum) ?? 0);

/**
 * Een omschrijving die het portaal zelf schreef, en dus bijgewerkt mag
 * worden. Begint die anders, dan heeft iemand hem aangepast en blijft hij
 * staan.
 */
const isGegenereerd = (omschrijving: string | null) => !omschrijving || omschrijving.startsWith("Samen ");

/**
 * Taken die het portaal zelf aanmaakt uit wat het al weet: de btw-aangifte
 * die eraan komt, een geaccepteerde offerte die gefactureerd moet worden, een
 * offerte die al twee weken stil is en facturen die lang openstaan. Zo is de
 * takenlijst je enige to-do-lijst.
 *
 * Elk signaal geeft precies één keer een taak: de sleutel wordt eerst in
 * taak_signalen vastgelegd, en pas als dat lukt komt de taak. Verwijder je
 * de taak, dan komt hij niet terug. Draait in de schil van het portaal, met
 * de financiële stand die daar toch al wordt opgehaald.
 *
 * Taken over één klant krijgen die klant mee, ook als er geen project is.
 *
 * Nabellen over facturen is één taak voor alle klanten samen, in plaats van
 * een taak per klant: anders staat je dag vol met zes regels die je in één
 * belronde afwerkt. Zolang die taak open staat, houdt het portaal de lijst
 * erin bij (betaald valt eraf, nieuw komt erbij). Is hij afgevinkt, dan komt
 * er pas een nieuwe als er een klant bij komt die nog niet aan de beurt was.
 */
export function useAutomatischeTaken(actief: boolean) {
  const { user } = useAdminAuth();
  const { data: financien } = useFinancien({ actief });
  const { data: clients } = useClients();
  const { data: projects } = useProjects();
  const { data: tasks } = useTasks();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const gedaan = useRef(new Set<string>());
  const nabelGezien = useRef<string | null>(null);

  useEffect(() => {
    if (!actief || !user || !clients || !projects || !tasks || !financien || !("bijgewerkt" in financien)) return;

    /** Project en klant voor een taak over deze klant. */
    const koppeling = (klant: Client | null) => {
      const project = klant ? projects.find((p) => p.client_id === klant.id) : undefined;
      return {
        project_id: project?.id ?? null,
        client_id: klant?.id ?? null,
      };
    };

    const signalen: Signaal[] = [];

    // Btw-aangifte die binnen twee weken binnen moet zijn.
    if (financien.btw && heeftData(financien.btw)) {
      for (const q of financien.btw.data) {
        const dagen = daysUntil(q.deadline);
        if (q.lopend || q.afdragen <= 0 || dagen === null || dagen < 0 || dagen > BTW_VOORLOOP) continue;
        signalen.push({
          sleutel: `btw:${q.label}`,
          titel: `Btw-aangifte ${q.label} doen`,
          omschrijving: `Af te dragen volgens Moneybird: ${formatBedrag(q.afdragen)}. Aangeven en betalen uiterlijk ${datum(q.deadline)}. Verwerk eerst de bonnen die nog in Moneybird wachten; zie Financiën, tabblad Btw.`,
          deadline: q.deadline,
          prioriteit: "hoog",
          klant: null,
        });
      }
    }

    // Offertes: geaccepteerd en nog te factureren, of al lang stil.
    if (financien.offertes && heeftData(financien.offertes)) {
      for (const o of financien.offertes.data) {
        if (o.status === "accepted") {
          signalen.push({
            sleutel: `offerte-factureren:${o.id}`,
            titel: `Offerte ${o.nummer ?? ""} van ${o.klant} factureren`.replace(/\s+/g, " "),
            omschrijving: `Geaccepteerd${o.geaccepteerd ? ` op ${datum(o.geaccepteerd.slice(0, 10))}` : ""}, ${formatBedrag(o.bedrag)} excl. btw.\n${o.url}`,
            deadline: format(addDays(new Date(), 3), "yyyy-MM-dd"),
            prioriteit: "hoog",
            klant: o.klant,
          });
        } else if (offerteWachtDagen(o) >= OFFERTE_WACHTTIJD) {
          signalen.push({
            sleutel: `offerte-nabellen:${o.id}`,
            titel: `Nabellen over offerte ${o.nummer ?? ""} (${o.klant})`.replace(/\s+/g, " "),
            omschrijving: `Al ${offerteWachtDagen(o)} dagen geen reactie, ${formatBedrag(o.bedrag)} excl. btw.\n${o.url}`,
            deadline: vandaag(),
            prioriteit: "normaal",
            klant: o.klant,
          });
        }
      }
    }

    const nieuw = signalen.filter((s) => !gedaan.current.has(s.sleutel));
    for (const s of nieuw) gedaan.current.add(s.sleutel);

    // Facturen die al lang openstaan, per klant verzameld voor de belronde.
    const perKlant = new Map<string, OpenFactuur[]>();
    if (heeftData(financien.facturen)) {
      for (const f of financien.facturen.data) {
        if (isCredit(f) || isKleineRest(f) || f.open <= 0) continue;
        if (dagenTeLaat(f) < NABEL_GRENS) continue;
        perKlant.set(f.klant, [...(perKlant.get(f.klant) ?? []), f]);
      }
    }
    const belronde = perKlant.size > 0 ? stelBelrondeOp(perKlant) : null;
    // Alleen opnieuw kijken als de lijst veranderd is; anders draait dit bij
    // elke wijziging in de takenlijst.
    const nabelNodig = belronde !== null && nabelGezien.current !== belronde.omschrijving;
    if (belronde) nabelGezien.current = belronde.omschrijving;

    if (nieuw.length === 0 && !nabelNodig) return;

    void (async () => {
      let gemaakt = 0;

      if (nieuw.length > 0) {
        // Welke signalen hebben al een taak gekregen?
        const { data: bekend, error } = await supabase
          .from("taak_signalen")
          .select("sleutel")
          .in(
            "sleutel",
            nieuw.map((s) => s.sleutel),
          );
        if (error) return; // Tabel bestaat nog niet: de migratie is nog niet uitgevoerd.
        const al = new Set((bekend ?? []).map((r) => r.sleutel));

        for (const s of nieuw.filter((s) => !al.has(s.sleutel))) {
          // Eerst het signaal claimen; lukt dat niet (een ander tabblad was
          // sneller), dan geen taak, zodat er nooit twee komen.
          const { error: claimFout } = await supabase.from("taak_signalen").insert({ sleutel: s.sleutel });
          if (claimFout) continue;
          const klant = s.klant ? zoekKlantBij({ naam: s.klant }, clients) : null;
          const { data: taak, error: taakFout } = await supabase
            .from("tasks")
            .insert({
              title: s.titel,
              description: s.omschrijving,
              due_date: s.deadline,
              priority: s.prioriteit,
              status: "todo",
              ...koppeling(klant),
              created_by: user.id,
              assigned_to: user.id,
            })
            .select("id")
            .single();
          if (taakFout || !taak) {
            // Geen taak gelukt: het signaal weer vrijgeven voor een volgende poging.
            await supabase.from("taak_signalen").delete().eq("sleutel", s.sleutel);
            continue;
          }
          await supabase.from("taak_signalen").update({ task_id: taak.id }).eq("sleutel", s.sleutel);
          gemaakt += 1;
        }
      }

      if (belronde && nabelNodig) {
        const klant = perKlant.size === 1 ? zoekKlantBij({ naam: [...perKlant.keys()][0]! }, clients) : null;
        const resultaat = await werkBelrondeBij(belronde, tasks, {
          ...koppeling(klant),
          userId: user.id,
        });
        if (resultaat === "nieuw") gemaakt += 1;
        if (resultaat === "fout") nabelGezien.current = null;
        if (resultaat !== "niets") void qc.invalidateQueries({ queryKey: adminKeys.tasks });
      }

      if (gemaakt > 0) {
        void qc.invalidateQueries({ queryKey: adminKeys.tasks });
        toast(`${gemaakt} ${gemaakt === 1 ? "taak" : "taken"} aangemaakt uit Moneybird`, {
          description: "Btw, offertes en facturen die aandacht vragen staan nu op je takenlijst.",
          action: { label: "Bekijken", onClick: () => navigate("/admin/taken") },
        });
      }
    })();
  }, [actief, user, clients, projects, tasks, financien, qc, navigate]);
}

interface Belronde {
  /** Eén sleutel per klant, naar diens oudste te late factuur. */
  sleutels: string[];
  titel: string;
  omschrijving: string;
  prioriteit: "normaal" | "hoog";
}

function stelBelrondeOp(perKlant: Map<string, OpenFactuur[]>): Belronde {
  const klanten = [...perKlant.entries()].sort(([a], [b]) => a.localeCompare(b, "nl"));
  const alle = klanten.flatMap(([, lijst]) => lijst);
  const totaal = alle.reduce((som, f) => som + f.open, 0);
  const oudsteVan = (lijst: OpenFactuur[]) =>
    [...lijst].sort((a, b) => (a.vervaldatum ?? "").localeCompare(b.vervaldatum ?? ""))[0]!;

  const [eersteKlant, eersteLijst] = klanten[0]!;
  const titel =
    klanten.length === 1
      ? `${eersteKlant} nabellen over ${eersteLijst.length === 1 ? "openstaande factuur" : `${eersteLijst.length} openstaande facturen`}`
      : `${klanten.length} klanten nabellen over openstaande facturen`;

  const regels = klanten.flatMap(([klant, lijst]) =>
    [...lijst]
      .sort((a, b) => dagenTeLaat(b) - dagenTeLaat(a))
      .map((f) => `- ${klant}, ${f.nummer}: ${formatBedrag(f.open)}, ${dagenTeLaat(f)} dagen te laat`),
  );

  return {
    sleutels: klanten.map(([, lijst]) => `${NABEL}${oudsteVan(lijst).id}`),
    titel,
    omschrijving: `Samen ${formatBedrag(totaal)} open bij ${klanten.length === 1 ? "één klant" : `${klanten.length} klanten`}, langer dan ${NABEL_GRENS} dagen over de vervaldatum.\n\n${regels.join("\n")}\n\nEen herinnering sturen kan ook via Financiën.`,
    prioriteit: alle.some((f) => dagenTeLaat(f) > 60) ? "hoog" : "normaal",
  };
}

/**
 * Zet de belronde op de takenlijst: de open nabeltaak bijwerken, of een
 * nieuwe maken als er een klant bij is gekomen. Oude losse nabeltaken (van
 * voor de bundeling) gaan op in de ene taak, mits er niets aan hangt.
 */
async function werkBelrondeBij(
  belronde: Belronde,
  tasks: TaskWithProject[],
  {
    userId,
    ...koppeling
  }: { project_id: string | null; client_id: string | null; userId: string },
): Promise<"nieuw" | "bijgewerkt" | "niets" | "fout"> {
  const { data: gekoppeld, error } = await supabase
    .from("taak_signalen")
    .select("sleutel, task_id")
    .like("sleutel", `${NABEL}%`);
  if (error) return "fout";

  const metTaak = new Set(gekoppeld.flatMap((r) => (r.task_id ? [r.task_id] : [])));
  const open = tasks
    .filter((t) => metTaak.has(t.id) && t.status !== "klaar" && !t.parent_task_id)
    .sort((a, b) => a.created_at.localeCompare(b.created_at));
  const bekend = new Set(gekoppeld.map((r) => r.sleutel));
  const nieuweSleutels = belronde.sleutels.filter((k) => !bekend.has(k));

  const [bundel, ...losse] = open;

  if (!bundel) {
    // Vorige ronde afgerond: alleen een nieuwe als er een klant bij is.
    if (nieuweSleutels.length === 0) return "niets";
    const geclaimd: string[] = [];
    for (const sleutel of nieuweSleutels) {
      const { error: claimFout } = await supabase.from("taak_signalen").insert({ sleutel });
      if (!claimFout) geclaimd.push(sleutel);
    }
    if (geclaimd.length === 0) return "niets";
    const { data: taak, error: taakFout } = await supabase
      .from("tasks")
      .insert({
        title: belronde.titel,
        description: belronde.omschrijving,
        due_date: vandaag(),
        priority: belronde.prioriteit,
        status: "todo",
        ...koppeling,
        created_by: userId,
        assigned_to: userId,
      })
      .select("id")
      .single();
    if (taakFout || !taak) {
      await supabase.from("taak_signalen").delete().in("sleutel", geclaimd);
      return "fout";
    }
    await supabase.from("taak_signalen").update({ task_id: taak.id }).in("sleutel", geclaimd);
    return "nieuw";
  }

  // Losse nabeltaken van voor de bundeling samenvoegen, alleen als ze nog
  // onaangeroerd zijn: geen stappen, bestanden of uren eraan.
  for (const los of losse) {
    if (los.status !== "todo" || !isGegenereerd(los.description)) continue;
    if (tasks.some((t) => t.parent_task_id === los.id)) continue;
    const [{ count: bestanden }, { count: uren }] = await Promise.all([
      supabase.from("task_files").select("id", { count: "exact", head: true }).eq("task_id", los.id),
      supabase.from("time_entries").select("id", { count: "exact", head: true }).eq("task_id", los.id),
    ]);
    if ((bestanden ?? 0) > 0 || (uren ?? 0) > 0) continue;
    await supabase.from("taak_signalen").update({ task_id: bundel.id }).eq("task_id", los.id);
    await supabase.from("tasks").delete().eq("id", los.id);
  }

  if (nieuweSleutels.length > 0) {
    await supabase.from("taak_signalen").insert(nieuweSleutels.map((sleutel) => ({ sleutel, task_id: bundel.id })));
  }

  if (!isGegenereerd(bundel.description)) return losse.length > 0 ? "bijgewerkt" : "niets";
  if (bundel.title === belronde.titel && bundel.description === belronde.omschrijving && losse.length === 0) return "niets";

  await supabase
    .from("tasks")
    .update({
      title: belronde.titel,
      description: belronde.omschrijving,
      priority: belronde.prioriteit,
      ...koppeling,
    })
    .eq("id", bundel.id);
  return "bijgewerkt";
}
