import { format } from "date-fns";
import { nl } from "date-fns/locale";
import {
  CalendarClock,
  CalendarDays,
  CircleDollarSign,
  Code2,
  ExternalLink,
  Flag,
  Globe,
  Mail,
  MapPin,
  Phone,
  Receipt,
  Rocket,
  User,
  type LucideIcon,
} from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import ActivityFeed from "@/admin/components/ActivityFeed";
import StatusBadge from "@/admin/components/StatusBadge";
import { BILLING_CYCLE, formatEuro, volgendeTermijn } from "@/admin/billing";
import { daysUntil, deadlineLabel, formatBudget, formatDate } from "@/admin/format";
import type { Client, ProjectWithClient, TeamMember } from "@/admin/queries";

interface ProjectRailProps {
  project: ProjectWithClient;
  client: Client | null;
  team: TeamMember[];
  userId: string | null;
}

/**
 * Eén feit met een icoon ervoor. Het icoonvlak geeft elke regel dezelfde
 * aanloop, waardoor de kolom als een lijst leest in plaats van als losse
 * zinnen.
 */
const Rij = ({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-center gap-3">
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
      <Icon className="h-4 w-4" />
    </span>
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="truncate text-sm font-medium">{children}</div>
    </div>
  </div>
);

const Kopje = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs uppercase tracking-wide text-muted-foreground">{children}</p>
);

/**
 * De vaste kolom naast het werk: wat er speelt en waar de klant staat.
 *
 * Deze gegevens stonden eerder als brede kaart boven de tabbladen, waardoor
 * ze wegscrollden zodra je met taken bezig was. Naast het werk blijven ze in
 * beeld, en dat is precies wanneer je ze nodig hebt.
 */
const ProjectRail = ({ project, client, team, userId }: ProjectRailProps) => {
  const late = (daysUntil(project.deadline) ?? 1) < 0 && project.status !== "live";
  const volgende = volgendeTermijn(client?.billing_start, client?.billing_cycle);

  return (
    <Tabs defaultValue="activiteit">
      {/* Dezelfde hoogte als de tabbalk van de rechterkolom, zodat de twee
          onderstrepingen op één lijn liggen. */}
      <TabsList className="h-auto w-full justify-start gap-6 rounded-none border-b border-border bg-transparent p-0">
        <TabsTrigger
          value="activiteit"
          className="rounded-none border-b-2 border-transparent px-0 pb-3 pt-0 data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          Activiteit
        </TabsTrigger>
        <TabsTrigger
          value="gegevens"
          className="rounded-none border-b-2 border-transparent px-0 pb-3 pt-0 data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          Gegevens
        </TabsTrigger>
      </TabsList>

      <TabsContent value="activiteit" className="mt-6 space-y-6">
        <div className="space-y-4">
          <Kopje>Recente activiteit</Kopje>
          <ActivityFeed projectId={project.id} team={team} userId={userId} />
        </div>

        {/* De vier dingen die je bij een klant het vaakst wilt weten. De rest
            staat onder Gegevens, één klik verderop. */}
        <div className="space-y-4 border-t border-border pt-6">
          <Kopje>Projectinfo</Kopje>
          <Rij icon={Flag} label="Fase">
            <StatusBadge kind="project" value={project.status} />
          </Rij>
          <Rij icon={CalendarClock} label="Deadline">
            <span className={cn(late && "text-rose-600 dark:text-rose-400")}>{deadlineLabel(project.deadline)}</span>
          </Rij>
          <Rij icon={CircleDollarSign} label="Budget">
            {formatBudget(project.budget_cents)}
          </Rij>
          <Rij icon={Receipt} label="Facturatie">
            {client?.billing_cycle
              ? [
                  BILLING_CYCLE[client.billing_cycle].label,
                  formatEuro(client.billing_amount_cents),
                  volgende ? `volgende ${format(volgende, "d MMM", { locale: nl })}` : null,
                ]
                  .filter(Boolean)
                  .join(" · ")
              : "Geen afspraak"}
          </Rij>
        </div>
      </TabsContent>

      <TabsContent value="gegevens" className="mt-6 space-y-6">
        <div className="space-y-4">
          <Kopje>Contact</Kopje>
          {client?.contact_name && (
            <Rij icon={User} label="Contactpersoon">
              {client.contact_name}
            </Rij>
          )}
          {client?.email && (
            <Rij icon={Mail} label="E-mail">
              <a href={`mailto:${client.email}`} className="hover:underline">
                {client.email}
              </a>
            </Rij>
          )}
          {client?.phone && (
            <Rij icon={Phone} label="Telefoon">
              <a href={`tel:${client.phone}`} className="hover:underline">
                {client.phone}
              </a>
            </Rij>
          )}
          {client?.city && (
            <Rij icon={MapPin} label="Plaats">
              {client.city}
            </Rij>
          )}
          {!client?.contact_name && !client?.email && !client?.phone && !client?.city && (
            <p className="text-sm text-muted-foreground">Geen contactgegevens ingevuld.</p>
          )}
        </div>

        <div className="space-y-4 border-t border-border pt-6">
          <Kopje>Het werk</Kopje>
          <Rij icon={Flag} label="Prioriteit">
            <StatusBadge kind="priority" value={project.priority} />
          </Rij>
          <Rij icon={CalendarDays} label="Gestart">
            {formatDate(project.start_date)}
          </Rij>
          <Rij icon={Rocket} label="Opgeleverd">
            {formatDate(project.launched_on)}
          </Rij>
          <Rij icon={Code2} label="Gebouwd op">
            {project.built_with_tanstack ? "TanStack" : "Standaardopzet"}
          </Rij>
          <Rij icon={Globe} label="Live website">
            {project.live_url ? (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:underline"
              >
                {project.live_url.replace(/^https?:\/\//, "")}
                <ExternalLink className="h-3 w-3 shrink-0" />
              </a>
            ) : (
              "—"
            )}
          </Rij>
          <Rij icon={ExternalLink} label="Portfolio">
            {project.portfolio_slug ? (
              <a
                href={`/portfolio/${project.portfolio_slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Case bekijken
              </a>
            ) : (
              "—"
            )}
          </Rij>
        </div>

        {project.description && (
          <div className="space-y-2 border-t border-border pt-6">
            <Kopje>Omschrijving</Kopje>
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">{project.description}</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default ProjectRail;
