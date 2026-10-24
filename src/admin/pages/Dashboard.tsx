import { format } from "date-fns";
import { nl } from "date-fns/locale";

import { useAdminAuth } from "@/admin/AdminAuthContext";
import AandachtKaart from "@/admin/dashboard/AandachtKaart";
import ActiviteitKaart from "@/admin/dashboard/ActiviteitKaart";
import AfgerondKaart from "@/admin/dashboard/AfgerondKaart";
import DezeWeekKaart from "@/admin/dashboard/DezeWeekKaart";
import FaseKaart from "@/admin/dashboard/FaseKaart";
import HostingKaart from "@/admin/dashboard/HostingKaart";
import MailenKaart from "@/admin/dashboard/MailenKaart";
import Meldingen from "@/admin/dashboard/Meldingen";
import MijnTakenKaart from "@/admin/dashboard/MijnTakenKaart";
import ProjectvoortgangKaart from "@/admin/dashboard/ProjectvoortgangKaart";
import TaakoverzichtKaart from "@/admin/dashboard/TaakoverzichtKaart";
import WerkactiviteitKaart from "@/admin/dashboard/WerkactiviteitKaart";
import { useClients, useMailings } from "@/admin/queries";
import { useTaakTellingen, useTeFactureren } from "@/admin/stats";

const groet = () => {
  const uur = new Date().getHours();
  if (uur < 12) return "Goedemorgen";
  if (uur < 18) return "Goedemiddag";
  return "Goedenavond";
};

const meervoud = (aantal: number, een: string, meer: string) => `${aantal} ${aantal === 1 ? een : meer}`;

/**
 * Het beginscherm, in twee kolommen: links breed wat er gedaan is en wat er
 * moet, rechts smal de stand van projecten en taken.
 *
 * Op een telefoon vallen de kolommen weg en bepaalt de volgorde (order-*)
 * wat bovenaan staat: eerst wat vandaag aandacht vraagt, dan de rest. De
 * kolommen zijn daarvoor tot xl "contents", zodat alle kaarten in één lijst
 * staan.
 *
 * Elk cijfer en elke regel is een link naar de lijst erachter. Hosting en
 * Mailen krijgen pas een kaart als er iets in staat; tot dan staan ze als
 * smalle melding onder de begroeting.
 */
const Dashboard = () => {
  const { profielNaam } = useAdminAuth();
  const taken = useTaakTellingen();
  const facturen = useTeFactureren();
  const { data: clients = [] } = useClients();
  const { data: mailings = [] } = useMailings(1);

  const samenvatting = [
    taken.teLaat.length > 0 && `${meervoud(taken.teLaat.length, "taak", "taken")} te laat`,
    taken.vandaag.length > 0 && `${meervoud(taken.vandaag.length, "deadline", "deadlines")} vandaag`,
    `${meervoud(taken.open.length, "open taak", "open taken")}`,
  ].filter(Boolean);

  const voornaam = profielNaam.split(/\s+/)[0];
  const toonHosting = facturen.contracten > 0;
  const toonMailen = mailings.length > 0 || clients.some((c) => c.email?.includes("@"));

  return (
    <div className="mx-auto max-w-[1400px] space-y-5">
      <div className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <div className="min-w-0">
            <h1 className="text-[26px] leading-tight tracking-tight sm:text-[30px]">
              {groet()}
              {voornaam ? `, ${voornaam}` : ""}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground first-letter:uppercase">
              {format(new Date(), "EEEE d MMMM", { locale: nl })} · {samenvatting.join(", ")}
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
        <Meldingen />
      </div>

      <div className="flex flex-col gap-4 xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(320px,390px)] xl:items-start">
        <div className="contents xl:flex xl:flex-col xl:gap-4">
          <AfgerondKaart className="order-5 xl:order-none" />
          <AandachtKaart className="order-1 xl:order-none" />
          <MijnTakenKaart className="order-3 xl:order-none" />
          <ActiviteitKaart className="order-10 xl:order-none" />
        </div>
        <div className="contents xl:flex xl:flex-col xl:gap-4">
          <ProjectvoortgangKaart className="order-6 xl:order-none" />
          <TaakoverzichtKaart className="order-4 xl:order-none" />
          <DezeWeekKaart className="order-2 xl:order-none" />
          <WerkactiviteitKaart className="order-7 xl:order-none" />
          <FaseKaart className="order-8 xl:order-none" />
          {toonHosting && <HostingKaart className="order-9 xl:order-none" />}
          {toonMailen && <MailenKaart className="order-9 xl:order-none" />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
