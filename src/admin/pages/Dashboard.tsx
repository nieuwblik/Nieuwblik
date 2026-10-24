import { useMemo } from "react";
import { format, startOfWeek, subWeeks } from "date-fns";
import { nl } from "date-fns/locale";
import { CheckCheck, FolderKanban, ListTodo, Receipt } from "lucide-react";

import { useAdminAuth } from "@/admin/AdminAuthContext";
import { formatEuro } from "@/admin/billing";
import { ACTIVE_PROJECT_STATUSES, hoofdtaken } from "@/admin/constants";
import AandachtKaart from "@/admin/dashboard/AandachtKaart";
import ActiviteitKaart from "@/admin/dashboard/ActiviteitKaart";
import DezeWeekKaart from "@/admin/dashboard/DezeWeekKaart";
import FaseKaart from "@/admin/dashboard/FaseKaart";
import HostingKaart from "@/admin/dashboard/HostingKaart";
import MailenKaart from "@/admin/dashboard/MailenKaart";
import MijnTakenKaart from "@/admin/dashboard/MijnTakenKaart";
import OntbrekendKaart from "@/admin/dashboard/OntbrekendKaart";
import TakenStatusKaart from "@/admin/dashboard/TakenStatusKaart";
import { useCombinedRows } from "@/admin/rows";
import { useTasks } from "@/admin/queries";
import { useTaakTellingen, useTeFactureren } from "@/admin/stats";
import StatCard from "@/admin/ui/StatCard";

const groet = () => {
  const uur = new Date().getHours();
  if (uur < 12) return "Goedemorgen";
  if (uur < 18) return "Goedemiddag";
  return "Goedenavond";
};

const meervoud = (aantal: number, een: string, meer: string) => `${aantal} ${aantal === 1 ? een : meer}`;

/**
 * Het beginscherm: eerst wat er speelt in één zin en vier cijfers, dan wat
 * aandacht vraagt en wat er deze week moet, dan je eigen taken, en daaronder
 * de stand van klanten, hosting en mailen.
 *
 * Elk cijfer en elke regel is een link naar de lijst erachter. Er staat hier
 * niets wat je niet kunt openen.
 */
const Dashboard = () => {
  const { profielNaam } = useAdminAuth();
  const { rows, isLoading: rijenLaden } = useCombinedRows();
  const { data: tasks = [] } = useTasks();
  const taken = useTaakTellingen();
  const facturen = useTeFactureren();

  const afgerond = useMemo(() => {
    const dezeWeek = startOfWeek(new Date(), { weekStartsOn: 1 }).toISOString();
    const vorigeWeek = subWeeks(startOfWeek(new Date(), { weekStartsOn: 1 }), 1).toISOString();
    const klaar = hoofdtaken(tasks).filter((t) => t.status === "klaar" && t.completed_at);
    return {
      dezeWeek: klaar.filter((t) => t.completed_at! >= dezeWeek).length,
      vorigeWeek: klaar.filter((t) => t.completed_at! >= vorigeWeek && t.completed_at! < dezeWeek).length,
    };
  }, [tasks]);

  const lopend = rows.filter((row) => row.status && ACTIVE_PROJECT_STATUSES.includes(row.status));
  const inProductie = lopend.filter((row) => ["in_ontwerp", "in_bouw", "review"].includes(row.status!)).length;

  // Eén zin over wat er vandaag speelt, alleen met wat er echt is.
  const samenvatting = [
    taken.teLaat.length > 0 && `${meervoud(taken.teLaat.length, "taak", "taken")} te laat`,
    taken.vandaag.length > 0 && `${meervoud(taken.vandaag.length, "deadline", "deadlines")} vandaag`,
    facturen.achterstallig.length > 0 && `${meervoud(facturen.achterstallig.length, "factuur", "facturen")} achterstallig`,
  ].filter(Boolean);

  const verschil = afgerond.dezeWeek - afgerond.vorigeWeek;
  const voornaam = profielNaam.split(/\s+/)[0];

  return (
    <div className="mx-auto max-w-[1400px] space-y-4 lg:space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div className="min-w-0">
          <h1 className="text-2xl tracking-tight sm:text-[28px]">
            {groet()}
            {voornaam ? `, ${voornaam}` : ""}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground first-letter:uppercase">
            {format(new Date(), "EEEE d MMMM", { locale: nl })}
            {" · "}
            {samenvatting.length > 0 ? samenvatting.join(", ") : "niets te laat"}
          </p>
        </div>

        {/* Zonder profielnaam stond hier het begin van je e-mailadres. Een
            kleine vraag om je naam is vriendelijker en lost het echt op. */}
        {!profielNaam && (
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("portaal:naam-instellen"))}
            className="text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
          >
            Stel je naam in
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 lg:gap-4 xl:grid-cols-4">
        <StatCard
          icon={ListTodo}
          label="Open taken"
          waarde={taken.open.length}
          context={taken.teLaat.length > 0 ? `${taken.teLaat.length} te laat` : "Niets te laat"}
          contextToon={taken.teLaat.length > 0 ? "danger" : undefined}
          to={taken.teLaat.length > 0 ? "/admin/taken?filter=te-laat" : "/admin/taken?status=open"}
          laden={taken.isLoading}
        />
        <StatCard
          icon={CheckCheck}
          label="Afgerond deze week"
          waarde={afgerond.dezeWeek}
          context={
            verschil === 0
              ? "Gelijk aan vorige week"
              : `${verschil > 0 ? "+" : ""}${verschil} t.o.v. vorige week`
          }
          contextToon={verschil > 0 ? "success" : undefined}
          to="/admin/taken?status=klaar"
          laden={taken.isLoading}
        />
        <StatCard
          icon={FolderKanban}
          label="Lopende projecten"
          waarde={lopend.length}
          context={inProductie > 0 ? `${inProductie} in productie` : "Geen in productie"}
          to="/admin/klanten?status=actief"
          laden={rijenLaden}
        />
        <StatCard
          icon={Receipt}
          label="Te factureren"
          waarde={facturen.contracten === 0 ? "–" : (formatEuro(facturen.bedragCenten) ?? "€ 0")}
          context={
            facturen.contracten === 0
              ? "Nog geen hostingcontracten"
              : `${meervoud(facturen.open.length, "factuur", "facturen")}${
                  facturen.achterstallig.length > 0 ? `, ${facturen.achterstallig.length} achterstallig` : ""
                }`
          }
          contextToon={facturen.achterstallig.length > 0 ? "warning" : undefined}
          to="/admin/hosting"
          laden={facturen.isLoading}
        />
      </div>

      {/* Twaalf kolommen op een breed scherm, zes op een tablet, één op een
          telefoon. De volgorde in de code is ook de volgorde op mobiel: wat
          vandaag aandacht vraagt eerst, de stand van zaken daarna. */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-6 lg:gap-4 xl:grid-cols-12">
        <AandachtKaart />
        <DezeWeekKaart />
        <MijnTakenKaart />
        <MailenKaart />
        <TakenStatusKaart />
        <FaseKaart />
        <HostingKaart />
        <ActiviteitKaart />
        <OntbrekendKaart />
      </div>
    </div>
  );
};

export default Dashboard;
