import { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { SupabaseClient } from "@supabase/supabase-js";

import { useAdminAuth } from "@/admin/AdminAuthContext";
import { supabase } from "@/integrations/supabase/client";

/**
 * De openbare VAPID-sleutel (dezelfde staat in de functie website-controle);
 * de geheime staat als VAPID_PRIVATE_KEY in de secrets van de backend.
 */
export const VAPID_PUBLIC_KEY =
  "BEITG1hUJxxt5V-f7eWnaUuDSX0ncPBs9_9x9HmMj0mF_g5XyxF9ElNLb9q62cBANitj4XkkPyr_4doQvZpRugE";

/** Een apparaat waarop pushmeldingen aanstaan. */
export interface PushApparaat {
  id: string;
  endpoint: string;
  apparaat: string | null;
  created_at: string;
}

/**
 * De tabel push_abonnementen komt uit de migratie websites_elk_uur_en_push.
 * Tot die is uitgevoerd en de types opnieuw zijn gemaakt, staat hij niet in de
 * gegenereerde types; daarom hier zonder types, zodat die bestanden
 * onaangeroerd blijven. Na de migratie kan dit gewoon supabase.from worden.
 */
const abonnementen = () => (supabase as unknown as SupabaseClient).from("push_abonnementen");

const pushKey = ["admin", "push"] as const;

/** "iPhone · Safari", "Mac · Chrome": genoeg om je apparaten uit elkaar te houden. */
function apparaatNaam(): string {
  const ua = navigator.userAgent;
  const toestel = /iPhone/.test(ua)
    ? "iPhone"
    : /iPad/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)
      ? "iPad"
      : /Android/.test(ua)
        ? "Android"
        : /Mac/.test(ua)
          ? "Mac"
          : /Windows/.test(ua)
            ? "Windows"
            : "Computer";
  const browser = /Edg\//.test(ua)
    ? "Edge"
    : /Firefox\//.test(ua)
      ? "Firefox"
      : /Chrome\//.test(ua)
        ? "Chrome"
        : /Safari\//.test(ua)
          ? "Safari"
          : "Browser";
  const app = window.matchMedia("(display-mode: standalone)").matches ? " (app)" : "";
  return `${toestel} · ${browser}${app}`;
}

function sleutelBytes(sleutel: string): Uint8Array {
  const t = sleutel.replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from(atob(t + "===".slice((t.length + 3) % 4)), (c) => c.charCodeAt(0));
}

/** Op een iPhone of iPad werkt push alleen in de app op het beginscherm, niet in Safari zelf. */
export function isIosZonderApp(): boolean {
  const ios = /iPhone|iPad/.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
  const alsApp =
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true;
  return ios && !alsApp;
}

export type PushStand = "laden" | "niet-ondersteund" | "ios-beginscherm" | "geweigerd" | "uit" | "aan";

/**
 * Pushmeldingen op dit apparaat: de stand, en aan- of uitzetten. Aanzetten
 * vraagt toestemming, registreert de service worker (op de site doet die dat
 * al, hier ook voor de zekerheid) en bewaart het abonnement van de browser.
 */
export function usePushOpDitApparaat() {
  const { user } = useAdminAuth();
  const qc = useQueryClient();
  const [stand, setStand] = useState<PushStand>("laden");
  const [bezig, setBezig] = useState(false);
  // Het adres van dit apparaat, om het in de lijst als "dit apparaat" te herkennen.
  const [endpoint, setEndpoint] = useState<string | null>(null);

  const bepaal = useCallback(async () => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
      setStand(isIosZonderApp() ? "ios-beginscherm" : "niet-ondersteund");
      return;
    }
    if (Notification.permission === "denied") {
      setStand("geweigerd");
      return;
    }
    const registratie = await navigator.serviceWorker.getRegistration("/");
    const abonnement = await registratie?.pushManager.getSubscription();
    setEndpoint(abonnement?.endpoint ?? null);
    setStand(abonnement ? "aan" : "uit");
  }, []);

  useEffect(() => {
    void bepaal();
  }, [bepaal]);

  const zetAan = async () => {
    if (!user) return;
    setBezig(true);
    try {
      const toestemming = await Notification.requestPermission();
      if (toestemming !== "granted") {
        setStand(toestemming === "denied" ? "geweigerd" : "uit");
        return;
      }
      await navigator.serviceWorker.register("/sw.js");
      const registratie = await navigator.serviceWorker.ready;
      const abonnement =
        (await registratie.pushManager.getSubscription()) ??
        (await registratie.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: sleutelBytes(VAPID_PUBLIC_KEY) as unknown as BufferSource,
        }));
      const json = abonnement.toJSON();
      const p256dh = json.keys?.["p256dh"];
      const auth = json.keys?.["auth"];
      if (!json.endpoint || !p256dh || !auth) throw new Error("De browser gaf geen bruikbaar abonnement.");
      const { error } = await abonnementen().upsert(
        { user_id: user.id, endpoint: json.endpoint, p256dh, auth, apparaat: apparaatNaam() },
        { onConflict: "endpoint" },
      );
      if (error) {
        throw new Error(
          /push_abonnementen|schema cache|does not exist/i.test(error.message)
            ? "Pushmeldingen werken pas als de migratie websites_elk_uur_en_push is uitgevoerd."
            : error.message,
        );
      }
      setEndpoint(json.endpoint);
      setStand("aan");
      void qc.invalidateQueries({ queryKey: pushKey });
    } finally {
      setBezig(false);
    }
  };

  const zetUit = async () => {
    setBezig(true);
    try {
      const registratie = await navigator.serviceWorker.getRegistration("/");
      const abonnement = await registratie?.pushManager.getSubscription();
      if (abonnement) {
        await abonnementen().delete().eq("endpoint", abonnement.endpoint);
        await abonnement.unsubscribe();
      }
      setEndpoint(null);
      setStand("uit");
      void qc.invalidateQueries({ queryKey: pushKey });
    } finally {
      setBezig(false);
    }
  };

  return { stand, bezig, endpoint, zetAan, zetUit };
}

/** Je eigen apparaten waarop pushmeldingen aanstaan. */
export function usePushApparaten() {
  return useQuery({
    queryKey: pushKey,
    retry: false,
    queryFn: async (): Promise<PushApparaat[]> => {
      const { data, error } = await abonnementen()
        .select("id, endpoint, apparaat, created_at")
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return (data ?? []) as PushApparaat[];
    },
  });
}

/** Een apparaat van de lijst halen: daar komen dan geen meldingen meer. */
export function useVerwijderPushApparaat() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await abonnementen().delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: pushKey }),
  });
}

/** Een testmelding naar al je eigen apparaten. */
export function useTestPush() {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("website-controle", { body: { test: true } });
      if (error) {
        const bericht = await (error as { context?: Response }).context?.json?.().catch(() => null);
        throw new Error(bericht?.error ?? error.message);
      }
      return data as { ok: true; verstuurd: number };
    },
  });
}
