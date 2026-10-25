import { useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { daysUntil } from "@/admin/format";
import { useProjects } from "@/admin/queries";
import type { WebsiteControle } from "@/admin/werkstroom";

export const websitesKey = ["admin", "websites"] as const;

/** Zoveel dagen voor het verlopen van het SSL-certificaat komt er een melding. */
export const SSL_WAARSCHUWING = 14;
/** Zoveel dagen voor het verlopen van de domeinnaam komt er een melding. */
export const DOMEIN_WAARSCHUWING = 30;

/** De laatste controle per project. */
export function useWebsiteControles() {
  return useQuery({
    queryKey: websitesKey,
    retry: false,
    staleTime: 10 * 60 * 1000,
    queryFn: async (): Promise<Map<string, WebsiteControle>> => {
      const { data, error } = await supabase
        .from("website_controles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1000);
      if (error) throw new Error(error.message);
      const rijen: WebsiteControle[] = data;
      const laatste = new Map<string, WebsiteControle>();
      for (const r of rijen) if (!laatste.has(r.project_id)) laatste.set(r.project_id, r);
      return laatste;
    },
  });
}

/** Nu controleren: één project, of alle projecten met een live-URL. */
export function useControleerWebsites() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (projectId?: string) => {
      const { data, error } = await supabase.functions.invoke("website-controle", { body: projectId ? { projectId } : {} });
      if (error) {
        const status = (error as { context?: Response }).context?.status;
        if (status === 404 || error.name === "FunctionsFetchError") {
          throw new Error("De websitebewaking staat nog niet live. Rol de functie website-controle uit in Lovable.");
        }
        const bericht = await (error as { context?: Response }).context?.json?.().catch(() => null);
        throw new Error(bericht?.error ?? error.message);
      }
      return data as { ok: true; gecontroleerd: number };
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: websitesKey }),
  });
}

export interface WebsiteProbleem {
  projectId: string;
  soort: "offline" | "ssl" | "domein";
  dagen: number | null;
}

/** Wat er mis is of binnenkort misgaat, per project. */
export function websiteProblemen(controle: WebsiteControle): WebsiteProbleem[] {
  const lijst: WebsiteProbleem[] = [];
  if (!controle.online) lijst.push({ projectId: controle.project_id, soort: "offline", dagen: null });
  const ssl = controle.ssl_geldig_tot ? daysUntil(controle.ssl_geldig_tot.slice(0, 10)) : null;
  if (ssl !== null && ssl <= SSL_WAARSCHUWING) lijst.push({ projectId: controle.project_id, soort: "ssl", dagen: ssl });
  const domein = controle.domein_geldig_tot ? daysUntil(controle.domein_geldig_tot.slice(0, 10)) : null;
  if (domein !== null && domein <= DOMEIN_WAARSCHUWING) lijst.push({ projectId: controle.project_id, soort: "domein", dagen: domein });
  return lijst;
}

/**
 * Eén keer per dag vanzelf controleren: als de laatste controle ouder is dan
 * twintig uur, draait er bij het openen van het portaal een nieuwe, stil op
 * de achtergrond. Staat de functie nog niet live, dan gebeurt er niets.
 */
export function useWebsiteBewaking(actief: boolean) {
  const { data: controles, isSuccess } = useWebsiteControles();
  const { data: projects } = useProjects();
  const controleer = useControleerWebsites();
  const gestart = useRef(false);

  useEffect(() => {
    if (!actief || gestart.current || !isSuccess || !controles || !projects) return;
    const metSite = projects.filter((p) => p.live_url?.trim());
    if (metSite.length === 0) return;
    const recentst = Math.max(0, ...[...controles.values()].map((c) => new Date(c.created_at).getTime()));
    if (Date.now() - recentst < 20 * 60 * 60 * 1000) return;
    gestart.current = true;
    controleer.mutate(undefined);
  }, [actief, isSuccess, controles, projects, controleer]);
}
