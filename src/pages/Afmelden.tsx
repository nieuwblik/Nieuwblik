import { useState } from "react";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "@/lib/router-compat";
import { supabase } from "@/integrations/supabase/client";

type Stand = "klaar" | "bezig" | "afgemeld" | "onbekend" | "fout";

/**
 * Afmelden voor mailingen (link onderaan elke mail uit het dashboard).
 * Afmelden gebeurt pas na een klik op de knop, niet bij het openen van de
 * pagina: virusscanners en mailprogramma's openen links soms automatisch.
 */
const Afmelden = () => {
  const [params] = useSearchParams();
  const token = params.get("t") ?? "";
  const geldig = /^[0-9a-f-]{36}$/i.test(token);
  const [stand, setStand] = useState<Stand>(geldig ? "klaar" : "onbekend");

  const afmelden = async () => {
    setStand("bezig");
    const { data, error } = await supabase.rpc("mail_afmelden", { _token: token });
    if (error) setStand("fout");
    else setStand(data ? "afgemeld" : "onbekend");
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="container mx-auto max-w-xl px-4 sm:px-6">
          <h1 className="text-3xl font-bold tracking-tight sw-ink md:text-4xl">
            {stand === "afgemeld" ? "Je bent afgemeld" : "Afmelden voor mails van Nieuwblik"}
          </h1>

          {stand === "afgemeld" && (
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Je ontvangt geen nieuwsmails meer van ons. Berichten over je eigen website of hosting
              sturen we je gewoon nog als dat nodig is.
            </p>
          )}

          {(stand === "klaar" || stand === "bezig") && (
            <>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                Wil je geen mails meer ontvangen over nieuwe functies en ander nieuws van Nieuwblik?
                Klik dan op de knop hieronder.
              </p>
              <Button className="mt-8 h-12 px-6" onClick={afmelden} disabled={stand === "bezig"}>
                {stand === "bezig" ? "Bezig…" : "Afmelden"}
              </Button>
            </>
          )}

          {stand === "onbekend" && (
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Deze afmeldlink werkt niet (meer). Mail ons op{" "}
              <a className="underline" href="mailto:contact@nieuwblik.com?subject=Afmelden">
                contact@nieuwblik.com
              </a>{" "}
              en we halen je van de lijst.
            </p>
          )}

          {stand === "fout" && (
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Er ging iets mis. Probeer het later opnieuw of mail ons op{" "}
              <a className="underline" href="mailto:contact@nieuwblik.com?subject=Afmelden">
                contact@nieuwblik.com
              </a>
              .
            </p>
          )}
        </div>
      </section>
      <Footer cta={false} />
    </div>
  );
};

export default Afmelden;
