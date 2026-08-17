import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SEOHead from "@/components/SEOHead";

interface LocationState {
  from?: string;
}

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /** Terug naar de pagina die om een login vroeg, anders het dashboard. */
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

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

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
        toast.error("Dit account heeft geen toegang tot het portaal");
        return;
      }

      toast.success("Welkom terug");
      navigate(target, { replace: true });
    } catch {
      // Bewust één algemene melding: geen signaal of het e-mailadres bestaat.
      toast.error("Inloggen mislukt. Controleer je gegevens.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
      <SEOHead
        title="Inloggen — Nieuwblik Portaal"
        description="Interne inlogpagina voor Nieuwblik."
        noIndex={true}
        includeOrganizationSchema={false}
      />
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Nieuwblik Portaal</CardTitle>
          <CardDescription>Log in met je Nieuwblik-account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mailadres</Label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="jij@nieuwblik.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Wachtwoord</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Inloggen…" : "Inloggen"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
