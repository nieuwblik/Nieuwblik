import { useMemo, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { differenceInCalendarDays, format, parseISO, subDays } from "date-fns";
import { nl } from "date-fns/locale";
import { History } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { PROJECT_STATUS } from "@/admin/constants";
import { heeftData, useFinancien } from "@/admin/financien";
import { leesbareUpdate, momentLabel } from "@/admin/format";
import { useRecentUpdates, useTeam } from "@/admin/queries";
import { Panel, PanelBody, PanelFooter, PanelHeader } from "@/admin/ui/Panel";
import StatusPill from "@/admin/ui/StatusPill";
import { useBedragenVerborgen } from "@/admin/useBedragenVerborgen";

const MAX = 6;
/** Moneybird-gebeurtenissen van zoveel dagen terug. */
const MONEYBIRD_DAGEN = 30;

interface Regel {
  sleutel: string;
  /** Om te sorteren; een datum zonder tijd telt als het midden van die dag. */
  moment: Date;
  pil: ReactNode;
  tekst: string;
  onder: string;
  /** Binnen het portaal, of naar Moneybird in een nieuw tabblad. */
  to?: string;
  href?: string;
}

/** Een datum zonder tijd (Moneybird) als "Vandaag", "Gisteren" of "20 okt". */
function dagLabel(waarde: string) {
  const dag = parseISO(waarde.slice(0, 10));
  const verschil = differenceInCalendarDays(dag, new Date());
  if (verschil === 0) return "Vandaag";
  if (verschil === -1) return "Gisteren";
  return format(dag, "d MMM", { locale: nl });
}

const momentVan = (waarde: string) => (waarde.length === 10 ? parseISO(`${waarde}T12:00:00`) : parseISO(waarde));

/**
 * Wat er de laatste tijd is gebeurd, over alle projecten en uit Moneybird:
 * updates, mijlpalen en notities, en daartussen de betalingen die binnen
 * kwamen en de offertes die zijn verstuurd of geaccepteerd. Een fasewissel
 * schrijft zelf een mijlpaal weg, dus die komt hier langs zonder dat iemand
 * iets hoeft te typen.
 *
 * Opeenvolgende regels met dezelfde tekst (zoals de import uit het
 * portfolio, die voor elk project dezelfde mijlpaal schreef) worden één
 * regel met de projecten erachter, anders is de kaart één lange herhaling.
 */
const ActiviteitKaart = ({ className }: { className?: string }) => {
  const { data: updates = [], isLoading } = useRecentUpdates(20);
  const { data: team = [] } = useTeam();
  const { data: financien } = useFinancien();
  const { bedrag } = useBedragenVerborgen();

  const regels = useMemo<Regel[]>(() => {
    const auteur = (id: string | null) => (id ? (team.find((m) => m.user_id === id)?.name ?? null) : null);

    // Alleen de letters tellen voor "dezelfde tekst": de import schreef
    // "Opgeleverd in 2025" en "in 2026" door elkaar, met en zonder punt.
    const kern = (tekst: string) => tekst.replace(/[^a-z]/gi, "").toLowerCase();
    const groepen: { eerste: (typeof updates)[number]; projecten: string[] }[] = [];
    for (const update of updates) {
      const vorige = groepen[groepen.length - 1];
      if (vorige && vorige.eerste.kind === update.kind && kern(vorige.eerste.body) === kern(update.body)) {
        if (update.project?.name) vorige.projecten.push(update.project.name);
        continue;
      }
      groepen.push({ eerste: update, projecten: update.project?.name ? [update.project.name] : [] });
    }

    const lijst: Regel[] = groepen.map(({ eerste, projecten }) => {
      const meer = projecten.length > 1;
      // Gebundeld: de eerste zin, met het aantal projecten erachter.
      const tekst = meer
        ? `${leesbareUpdate(eerste.body, PROJECT_STATUS).split(/\.\s/)[0]?.replace(/\.$/, "")} · ${projecten.length} projecten`
        : leesbareUpdate(eerste.body, PROJECT_STATUS);
      const onder = meer
        ? `${projecten.slice(0, 3).join(", ")}${projecten.length > 3 ? ` en ${projecten.length - 3} meer` : ""}`
        : [eerste.project?.name, auteur(eerste.author_id)].filter(Boolean).join(" · ");
      return {
        sleutel: `update-${eerste.id}`,
        moment: parseISO(eerste.created_at),
        pil: <StatusPill kind="update" value={eerste.kind} className="mt-px w-[4.75rem] justify-center" />,
        tekst,
        onder: [onder, momentLabel(eerste.created_at)].filter(Boolean).join(" · "),
        to: eerste.project && !meer ? `/admin/projecten/${eerste.project.id}?tab=tijdlijn` : "/admin/klanten",
      };
    });

    // Uit Moneybird: betalingen en offertes van de laatste weken.
    const stand = financien && "bijgewerkt" in financien ? financien : null;
    const grens = subDays(new Date(), MONEYBIRD_DAGEN);
    const pil = (toon: "success" | "neutral", label: string) => (
      <StatusPill toon={toon} className="mt-px w-[4.75rem] justify-center">
        {label}
      </StatusPill>
    );
    if (stand?.betalingen && heeftData(stand.betalingen)) {
      for (const b of stand.betalingen.data) {
        if (!b.betaaldOp || momentVan(b.betaaldOp) < grens) continue;
        lijst.push({
          sleutel: `betaling-${b.id}`,
          moment: momentVan(b.betaaldOp),
          pil: pil("success", "Betaald"),
          tekst: `${bedrag(b.bedrag)} van ${b.klant}`,
          onder: [b.nummer, dagLabel(b.betaaldOp)].filter(Boolean).join(" · "),
          href: b.url,
        });
      }
    }
    if (stand?.offertes && heeftData(stand.offertes)) {
      for (const o of stand.offertes.data) {
        const accepted = o.status === "accepted" && o.geaccepteerd;
        const wanneer = accepted ? o.geaccepteerd : o.verstuurd;
        if (!wanneer || momentVan(wanneer) < grens) continue;
        lijst.push({
          sleutel: `offerte-${o.id}`,
          moment: momentVan(wanneer),
          pil: pil(accepted ? "success" : "neutral", accepted ? "Akkoord" : "Offerte"),
          tekst: `${accepted ? "Offerte geaccepteerd door" : "Offerte verstuurd aan"} ${o.klant}`,
          onder: [o.nummer, `${bedrag(o.bedrag)} excl. btw`, dagLabel(wanneer)].filter(Boolean).join(" · "),
          href: o.url,
        });
      }
    }

    return lijst.sort((a, b) => b.moment.getTime() - a.moment.getTime()).slice(0, MAX);
  }, [updates, team, financien, bedrag]);

  return (
    <Panel className={className} footer={<PanelFooter to="/admin/klanten">Bekijk alle projecten</PanelFooter>}>
      <PanelHeader icon={History} titel="Recente activiteit" subtitel="Projecten, betalingen en offertes" />
      <PanelBody className="px-2 pb-2 pt-2">
        {isLoading ? (
          <div className="space-y-2 px-2 py-2">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-10" />
            ))}
          </div>
        ) : regels.length === 0 ? (
          <p className="px-2 py-3 text-sm text-muted-foreground">Nog geen activiteit.</p>
        ) : (
          <ul className="p-vervaag">
            {regels.map((r) => {
              const inhoud = (
                <>
                  {r.pil}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm">{r.tekst}</span>
                    <span className="mt-0.5 block truncate text-[13px] text-muted-foreground">{r.onder}</span>
                  </span>
                </>
              );
              const klasse = "flex items-start gap-3 rounded-lg px-2 py-2 p-rij";
              return (
                <li key={r.sleutel}>
                  {r.href ? (
                    <a href={r.href} target="_blank" rel="noopener noreferrer" className={klasse}>
                      {inhoud}
                    </a>
                  ) : (
                    <Link to={r.to ?? "/admin/klanten"} className={klasse}>
                      {inhoud}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </PanelBody>
    </Panel>
  );
};

export default ActiviteitKaart;
