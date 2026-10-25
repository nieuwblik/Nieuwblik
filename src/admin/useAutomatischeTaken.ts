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
import { adminKeys, useClients, useProjects } from "@/admin/queries";

/** Na zoveel dagen over de vervaldatum wordt een factuur een belactie. */
const NABEL_GRENS = 30;
/** Zoveel dagen voor de uiterste datum komt de btw-aangifte op je lijst. */
const BTW_VOORLOOP = 14;

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

/**
 * Taken die het portaal zelf aanmaakt uit wat het al weet: de btw-aangifte
 * die eraan komt, een geaccepteerde offerte die gefactureerd moet worden, een
 * offerte die al twee weken stil is en facturen die lang openstaan (per klant
 * één taak). Zo is de takenlijst je enige to-do-lijst.
 *
 * Elk signaal geeft precies één keer een taak: de sleutel wordt eerst in
 * taak_signalen vastgelegd, en pas als dat lukt komt de taak. Verwijder je
 * de taak, dan komt hij niet terug. Draait in de schil van het portaal, met
 * de financiële stand die daar toch al wordt opgehaald.
 */
export function useAutomatischeTaken(actief: boolean) {
  const { user } = useAdminAuth();
  const { data: financien } = useFinancien({ actief });
  const { data: clients } = useClients();
  const { data: projects } = useProjects();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const gedaan = useRef(new Set<string>());

  useEffect(() => {
    if (!actief || !user || !clients || !projects || !financien || !("bijgewerkt" in financien)) return;

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

    // Facturen die al lang openstaan: één taak per klant.
    if (heeftData(financien.facturen)) {
      const perKlant = new Map<string, OpenFactuur[]>();
      for (const f of financien.facturen.data) {
        if (isCredit(f) || isKleineRest(f) || f.open <= 0) continue;
        if (-(daysUntil(f.vervaldatum) ?? 0) < NABEL_GRENS) continue;
        perKlant.set(f.klant, [...(perKlant.get(f.klant) ?? []), f]);
      }
      for (const [klant, lijst] of perKlant) {
        const oudste = [...lijst].sort((a, b) => (a.vervaldatum ?? "").localeCompare(b.vervaldatum ?? ""))[0]!;
        const totaal = lijst.reduce((som, f) => som + f.open, 0);
        signalen.push({
          sleutel: `factuur-nabellen:${oudste.id}`,
          titel: `${klant} nabellen over ${lijst.length === 1 ? "openstaande factuur" : `${lijst.length} openstaande facturen`}`,
          omschrijving: `Samen ${formatBedrag(totaal)} open:\n${lijst
            .map((f) => `- ${f.nummer}: ${formatBedrag(f.open)}, ${-(daysUntil(f.vervaldatum) ?? 0)} dagen te laat`)
            .join("\n")}\n\nEen herinnering sturen kan ook via Financiën.`,
          deadline: vandaag(),
          prioriteit: -(daysUntil(oudste.vervaldatum) ?? 0) > 60 ? "hoog" : "normaal",
          klant,
        });
      }
    }

    const nieuw = signalen.filter((s) => !gedaan.current.has(s.sleutel));
    if (nieuw.length === 0) return;
    for (const s of nieuw) gedaan.current.add(s.sleutel);

    void (async () => {
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

      let gemaakt = 0;
      for (const s of nieuw.filter((s) => !al.has(s.sleutel))) {
        // Eerst het signaal claimen; lukt dat niet (een ander tabblad was
        // sneller), dan geen taak, zodat er nooit twee komen.
        const { error: claimFout } = await supabase.from("taak_signalen").insert({ sleutel: s.sleutel });
        if (claimFout) continue;
        const klant = s.klant ? zoekKlantBij({ naam: s.klant }, clients) : null;
        const project = klant ? projects.find((p) => p.client_id === klant.id) : undefined;
        const { data: taak, error: taakFout } = await supabase
          .from("tasks")
          .insert({
            title: s.titel,
            description: s.omschrijving,
            due_date: s.deadline,
            priority: s.prioriteit,
            status: "todo",
            project_id: project?.id ?? null,
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

      if (gemaakt > 0) {
        void qc.invalidateQueries({ queryKey: adminKeys.tasks });
        toast(`${gemaakt} ${gemaakt === 1 ? "taak" : "taken"} aangemaakt uit Moneybird`, {
          description: "Btw, offertes en facturen die aandacht vragen staan nu op je takenlijst.",
          action: { label: "Bekijken", onClick: () => navigate("/admin/taken") },
        });
      }
    })();
  }, [actief, user, clients, projects, financien, qc, navigate]);
}
