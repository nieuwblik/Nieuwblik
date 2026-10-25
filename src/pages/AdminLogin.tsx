import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import logoSrc from "@/assets/logo.webp";
import PortaalAchtergrond from "@/components/PortaalAchtergrond";
import SEOHead from "@/components/SEOHead";
import { vloeiendNavigeren } from "@/admin/vloeiend";

interface LocationState {
  from?: string;
}

/** Een veld in het glazen blok: geen eigen rand, de scheiding doet het blok. */
const VELD =
  "h-12 w-full bg-transparent px-4 text-[15px] text-white placeholder:text-white/45 outline-none transition-colors focus:bg-white/[0.06] autofill:shadow-[inset_0_0_0_1000px_rgba(30,40,56,0.95)] autofill:[-webkit-text-fill-color:#fff]";

/** Wanneer een onderdeel opkomt, voor de animaties p-start-op(-glas) in styles.css. */
const op = (ms: number) => ({ "--vertraging": `${ms}ms` }) as CSSProperties;

/**
 * Inloggen op het portaal, op dezelfde nachtscène als de startpagina. Eén
 * glazen venster in het midden: het logo, twee velden in één blok en een
 * knop. Een fout staat als korte regel onder het blok, met een korte
 * schudbeweging, in plaats van een melding die wegspringt. Na het inloggen
 * gaat de pagina vloeiend over in Start (of de pagina die om een login vroeg).
 *
 * Bij binnenkomst komt het venster op zoals Start: eerst het glas, daarna kort
 * na elkaar het logo, de tekst, de velden en de knop.
 */
const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fout, setFout] = useState<string | null>(null);
  const [schud, setSchud] = useState(0);

  // Het opkomen begint pas als het lettertype er is (hooguit 0,45 seconde na
  // het openen); anders wisselen de letters midden in de beweging. Een gewone
  // timer, geen animatieframe: die pauzeert in een tabblad op de achtergrond.
  const [klaar, setKlaar] = useState(false);
  const geopend = useRef(performance.now());
  useEffect(() => {
    let weg = false;
    const begin = () => {
      if (!weg) window.setTimeout(() => setKlaar(true), 16);
    };
    const uiterlijk = window.setTimeout(begin, Math.max(0, 450 - (performance.now() - geopend.current)));
    void document.fonts.ready.then(begin);
    return () => {
      weg = true;
      window.clearTimeout(uiterlijk);
    };
  }, []);

  // Hetzelfde lettertype als het portaal (Geist), zonder het thema over te nemen:
  // de inlogpagina is altijd de nachtscène.
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.add("portaal");
    return () => root.classList.remove("portaal");
  }, []);

  /** Terug naar de pagina die om een login vroeg, anders Start. */
  const target = (location.state as LocationState | null)?.from ?? "/admin";

  // Al ingelogd als admin? Dan hoeft dit scherm niet getoond te worden.
  useEffect(() => {
    let active = true;

    void (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session || !active) return;

      const { data: isAdmin } = await supabase.rpc("has_role", {
        _user_id: session.user.id,
        _role: "admin",
      });
      if (active && isAdmin) navigate(target, { replace: true });
    })();

    return () => {
      active = false;
    };
  }, [navigate, target]);

  const mislukt = (bericht: string) => {
    setFout(bericht);
    setSchud((n) => n + 1);
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setFout(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // De rolcheck draait op has_role, dezelfde functie waar de RLS-policies
      // op steunen. Zonder adminrol meteen weer uitloggen, zodat er geen
      // half-ingelogde sessie blijft hangen.
      const { data: isAdmin } = await supabase.rpc("has_role", {
        _user_id: data.user.id,
        _role: "admin",
      });

      if (!isAdmin) {
        await supabase.auth.signOut();
        mislukt("Dit account heeft geen toegang tot het portaal.");
        return;
      }

      vloeiendNavigeren(() => navigate(target, { replace: true }), target);
    } catch {
      // Bewust één algemene melding: geen signaal of het e-mailadres bestaat.
      mislukt("Inloggen mislukt. Controleer je gegevens.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative isolate flex min-h-[100svh] items-center justify-center px-5 py-10 text-white"
      data-start={klaar ? "klaar" : "laden"}
    >
      <SEOHead
        title="Inloggen — Nieuwblik Portaal"
        description="Interne inlogpagina voor Nieuwblik."
        noIndex={true}
        includeOrganizationSchema={false}
      />
      <PortaalAchtergrond />

      <main className="w-full max-w-[380px]">
        <div style={op(0)} className="p-start-op-glas rounded-[28px] border border-white/15 bg-[rgba(18,24,36,0.21)] px-7 pb-7 pt-9 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.16)] backdrop-blur-2xl backdrop-saturate-150 sm:px-8">
          <img src={logoSrc} alt="Nieuwblik" style={op(140)} className="p-start-op mx-auto h-7 w-auto brightness-0 invert" />
          <h1 style={op(220)} className="p-start-op mt-7 text-center text-[22px] font-medium tracking-tight">
            Welkom terug
          </h1>
          <p style={op(270)} className="p-start-op mt-1 text-center text-[14px] text-white/60">
            Log in op het portaal
          </p>

          <form onSubmit={handleLogin} style={op(340)} className="p-start-op mt-7" noValidate>
            <div
              key={schud}
              className={cn(
                "overflow-hidden rounded-2xl border border-white/15 bg-white/[0.04] transition-colors focus-within:border-white/30",
                schud > 0 && "p-schud",
              )}
            >
              <label htmlFor="email" className="sr-only">
                E-mailadres
              </label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="E-mailadres"
                className={VELD}
              />
              <div className="h-px bg-white/10" />
              <label htmlFor="password" className="sr-only">
                Wachtwoord
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Wachtwoord"
                className={VELD}
              />
            </div>

            <p role="alert" className={cn("mt-3 min-h-[1.25rem] text-center text-[13px] text-[#ff9b91] transition-opacity", fout ? "opacity-100" : "opacity-0")}>
              {fout}
            </p>

            {/* Dezelfde knop als Dashboard op Start: een gewone portaalknop, maar wit. */}
            <Button
              type="submit"
              disabled={isLoading || !email || !password}
              className="mt-2 h-11 w-full bg-white/95 text-[15px] text-neutral-900 hover:bg-white disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "Inloggen"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AdminLogin;
