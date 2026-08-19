import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AdminAuthStatus =
  /** Sessie en rol worden nog opgehaald. */
  | "loading"
  /** Niemand ingelogd. */
  | "unauthenticated"
  /** Wel ingelogd, maar geen admin-rol. */
  | "forbidden"
  | "authorized";

interface AdminAuthValue {
  status: AdminAuthStatus;
  user: User | null;
  /** Weergavenaam uit profiles, met het e-mailadres als terugval. */
  displayName: string;
  /** Leest het profiel opnieuw, na het wijzigen van je naam. */
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthValue | null>(null);

/**
 * Bewaakt de admin-sessie voor de hele portaalboom.
 *
 * De rolcheck loopt via de has_role-RPC, dezelfde SECURITY DEFINER-functie
 * waar de RLS-policies op draaien. Daardoor kan het scherm niet iets tonen dat
 * de database vervolgens weigert. Deze check is een UX-poort, geen
 * beveiligingsgrens: die ligt in de policies op de tabellen zelf.
 */
export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<AdminAuthStatus>("loading");
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState("");
  const activeRef = useRef(true);

  useEffect(() => {
    activeRef.current = true;

    const resolve = async (session: Session | null) => {
      if (!session) {
        if (!activeRef.current) return;
        setUser(null);
        setDisplayName("");
        setStatus("unauthenticated");
        return;
      }

      const { data: isAdmin, error } = await supabase.rpc("has_role", {
        _user_id: session.user.id,
        _role: "admin",
      });

      if (!activeRef.current) return;

      if (error || !isAdmin) {
        setUser(session.user);
        setDisplayName("");
        setStatus("forbidden");
        return;
      }

      setUser(session.user);
      setStatus("authorized");

      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, email")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (!activeRef.current) return;
      setDisplayName(profile?.display_name || profile?.email || session.user.email || "");
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // Binnen deze callback niet direct awaiten: een async Supabase-aanroep
      // op dezelfde client kan hier blijven hangen. Vandaar de uitstap naar
      // de volgende tick.
      setTimeout(() => {
        void resolve(session);
      }, 0);
    });

    void supabase.auth.getSession().then(({ data: { session } }) => resolve(session));

    return () => {
      activeRef.current = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  /** Na het wijzigen van je naam: opnieuw lezen zonder de sessie aan te raken. */
  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name, email")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!activeRef.current) return;
    setDisplayName(profile?.display_name || profile?.email || user.email || "");
  }, [user]);

  return (
    <AdminAuthContext.Provider value={{ status, user, displayName, signOut, refreshProfile }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = (): AdminAuthValue => {
  const value = useContext(AdminAuthContext);
  if (!value) throw new Error("useAdminAuth moet binnen AdminAuthProvider gebruikt worden");
  return value;
};
