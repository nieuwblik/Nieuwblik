import { useMemo } from "react";

import type { Toon } from "@/admin/constants";
import { useAanvragen } from "@/admin/aanvragen";
import { daysUntil } from "@/admin/format";
import {
  heeftData,
  isTeLaatFactuur,
  OFFERTE_WACHTTIJD,
  offerteWachtDagen,
  useFinancien,
} from "@/admin/financien";
import { useTaakTellingen, useTeFactureren } from "@/admin/stats";
import { useBedragenVerborgen } from "@/admin/useBedragenVerborgen";
import { useProjects } from "@/admin/queries";
import { useWebsiteControles, websiteProblemen } from "@/admin/websites";

export interface PortaalMelding {
  sleutel: string;
  toon: Toon;
  tekst: string;
  uitleg?: string | undefined;
  to: string;
}

/**
 * Alles wat nu aandacht vraagt, op één plek, voor het meldingencentrum achter
 * de bel. Het is een stand en geen logboek: een melding verdwijnt vanzelf
 * zodra de oorzaak is opgelost. Volgorde: wat het meest dringt bovenaan.
 */
export function useMeldingen(): PortaalMelding[] {
  const taken = useTaakTellingen();
  const hosting = useTeFactureren();
  const { data: aanvragen = [] } = useAanvragen();
  const { data: financien } = useFinancien();
  const { bedrag } = useBedragenVerborgen();
  const { data: controles } = useWebsiteControles();
  const { data: projects = [] } = useProjects();

  return useMemo(() => {
    const lijst: PortaalMelding[] = [];

    // Websites eerst: een site die plat ligt gaat voor alles.
    for (const c of controles?.values() ?? []) {
      const project = projects.find((p) => p.id === c.project_id);
      if (!project) continue;
      const naam = project.client?.name ?? project.name;
      for (const probleem of websiteProblemen(c)) {
        lijst.push({
          sleutel: `website-${probleem.soort}-${c.project_id}`,
          toon: probleem.soort === "offline" ? "danger" : "warning",
          tekst:
            probleem.soort === "offline"
              ? `Website van ${naam} is niet bereikbaar`
              : probleem.soort === "ssl"
                ? `SSL-certificaat van ${naam} verloopt`
                : `Domeinnaam van ${naam} verloopt`,
          uitleg:
            probleem.soort === "offline"
              ? (c.fout ?? c.url)
              : probleem.dagen !== null && probleem.dagen < 0
                ? "Al verlopen"
                : `Over ${probleem.dagen} ${probleem.dagen === 1 ? "dag" : "dagen"}`,
          to: `/admin/projecten/${c.project_id}`,
        });
      }
    }

    if (taken.teLaat.length > 0) {
      const n = taken.teLaat.length;
      lijst.push({
        sleutel: "taken-te-laat",
        toon: "danger",
        tekst: `${n} ${n === 1 ? "taak" : "taken"} te laat`,
        uitleg: taken.teLaat
          .slice(0, 2)
          .map((t) => t.title)
          .join(", "),
        to: "/admin/taken?filter=te-laat",
      });
    }

    const nieuw = aanvragen.filter((a) => a.status === "nieuw");
    if (nieuw.length > 0) {
      lijst.push({
        sleutel: "aanvragen",
        toon: "info",
        tekst: `${nieuw.length} ${nieuw.length === 1 ? "nieuwe aanvraag" : "nieuwe aanvragen"}`,
        uitleg: nieuw
          .slice(0, 2)
          .map((a) => a.bedrijf || a.naam)
          .join(", "),
        to: "/admin/aanvragen",
      });
    }

    if (financien && "bijgewerkt" in financien) {
      if (financien.btw && heeftData(financien.btw)) {
        for (const q of financien.btw.data) {
          const dagen = daysUntil(q.deadline);
          if (q.lopend || q.afdragen <= 0 || dagen === null || dagen < 0 || dagen > 14) continue;
          lijst.push({
            sleutel: `btw-${q.label}`,
            toon: dagen <= 7 ? "danger" : "warning",
            tekst: `Btw ${q.label}: ${bedrag(q.afdragen, 0)} aangeven`,
            uitleg: dagen === 0 ? "Vandaag de laatste dag" : `Nog ${dagen} ${dagen === 1 ? "dag" : "dagen"}`,
            to: "/admin/financien?tab=btw",
          });
        }
      }

      if (heeftData(financien.facturen)) {
        const laat = financien.facturen.data.filter(isTeLaatFactuur);
        if (laat.length > 0) {
          lijst.push({
            sleutel: "facturen-te-laat",
            toon: "warning",
            tekst: `${laat.length} ${laat.length === 1 ? "factuur" : "facturen"} te laat betaald`,
            uitleg: `Samen ${bedrag(
              laat.reduce((som, f) => som + f.open, 0),
              0,
            )} open`,
            to: "/admin/financien",
          });
        }
      }

      if (financien.offertes && heeftData(financien.offertes)) {
        const geaccepteerd = financien.offertes.data.filter((o) => o.status === "accepted");
        if (geaccepteerd.length > 0) {
          lijst.push({
            sleutel: "offertes-factureren",
            toon: "warning",
            tekst: `${geaccepteerd.length} geaccepteerde ${geaccepteerd.length === 1 ? "offerte" : "offertes"} nog factureren`,
            uitleg: geaccepteerd.map((o) => o.klant).join(", "),
            to: "/admin/financien",
          });
        }
        const stil = financien.offertes.data.filter((o) => offerteWachtDagen(o) >= OFFERTE_WACHTTIJD);
        if (stil.length > 0) {
          lijst.push({
            sleutel: "offertes-stil",
            toon: "neutral",
            tekst: `${stil.length} ${stil.length === 1 ? "offerte wacht" : "offertes wachten"} op antwoord`,
            uitleg: `${OFFERTE_WACHTTIJD} dagen of langer geen reactie`,
            to: "/admin/financien",
          });
        }
      }

      if (financien.betalingen && heeftData(financien.betalingen)) {
        const grens = Date.now() - 3 * 86400000;
        for (const b of financien.betalingen.data.filter((b) => b.betaaldOp && new Date(b.betaaldOp).getTime() >= grens)) {
          lijst.push({
            sleutel: `betaald-${b.id}`,
            toon: "success",
            tekst: `${b.klant} heeft ${bedrag(b.bedrag)} betaald`,
            uitleg: b.nummer ? `Factuur ${b.nummer}` : undefined,
            to: "/admin/financien",
          });
        }
      }
    }

    if (hosting.achterstallig.length > 0) {
      const n = hosting.achterstallig.length;
      lijst.push({
        sleutel: "hosting",
        toon: "warning",
        tekst: `${n} ${n === 1 ? "hostingtermijn" : "hostingtermijnen"} nog factureren`,
        to: "/admin/hosting",
      });
    }

    return lijst;
  }, [taken, hosting, aanvragen, financien, bedrag, controles, projects]);
}
