import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { companyInfo } from "@/config/company";
import { briefingSchema } from "@/lib/briefing";

/** Zet links, vet en tekst om naar React, zonder ruwe HTML. */
function inline(tekst: string): ReactNode[] {
  const delen = tekst.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|\/[a-z0-9-]+(?:\/[a-z0-9-]+)*)/g);
  return delen.map((d, i) => {
    const vet = d.match(/^\*\*([^*]+)\*\*$/);
    if (vet) return <strong key={i}>{vet[1]}</strong>;
    const link = d.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    const pad = link ? link[2] : /^\/[a-z0-9-]/.test(d) ? d : null;
    if (pad && pad.startsWith("/")) {
      return (
        <a key={i} href={pad} className="text-accent underline underline-offset-2">
          {link ? link[1] : d}
        </a>
      );
    }
    return d;
  });
}

function Briefing({ tekst }: { tekst: string }) {
  const regels = tekst.split("\n");
  const blokken: ReactNode[] = [];
  let lijst: string[] = [];
  const sluitLijst = () => {
    if (lijst.length) {
      blokken.push(
        <ul key={`l${blokken.length}`} className="list-disc pl-5 space-y-1 text-muted-foreground">
          {lijst.map((l, i) => <li key={i}>{inline(l)}</li>)}
        </ul>,
      );
      lijst = [];
    }
  };
  regels.forEach((r) => {
    const t = r.trim();
    if (/^[-*] /.test(t)) return void lijst.push(t.slice(2));
    sluitLijst();
    if (!t) return;
    if (t.startsWith("#")) {
      blokken.push(<h2 key={blokken.length} className="text-xl font-bold text-foreground pt-4">{t.replace(/^#+\s*/, "")}</h2>);
    } else {
      blokken.push(<p key={blokken.length} className="text-muted-foreground leading-relaxed">{inline(t)}</p>);
    }
  });
  sluitLijst();
  return <div className="space-y-3">{blokken}</div>;
}

const leeg = { bedrijf: "", plaats: "", doelen: "", huidigeSite: "", functies: "", budget: "", start: "" };

const Projectbriefing = () => {
  const [form, setForm] = useState(leeg);
  const [briefing, setBriefing] = useState("");
  const [fout, setFout] = useState("");
  const [bezig, setBezig] = useState(false);
  const [contact, setContact] = useState({ naam: "", email: "", telefoon: "" });
  const [verstuurd, setVerstuurd] = useState<"" | "bezig" | "ok" | "fout">("");

  const zet = (k: keyof typeof leeg) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  async function maak(e: React.FormEvent) {
    e.preventDefault();
    setFout("");
    const check = briefingSchema.safeParse(form);
    if (!check.success) return setFout(check.error.issues[0]?.message ?? "Controleer je invoer.");
    setBezig(true);
    setBriefing("");
    setVerstuurd("");
    try {
      const res = await fetch("/api/briefing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(check.data),
      });
      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => ({}));
        setFout(j.error ?? "Er ging iets mis. Probeer het later opnieuw.");
        return;
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let tekst = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        tekst += dec.decode(value, { stream: true });
        const [deel, melding] = tekst.split("[[FOUT]]");
        setBriefing(deel ?? "");
        if (melding) setFout(melding);
      }
    } catch {
      setFout("Er ging iets mis. Controleer je verbinding en probeer het opnieuw.");
    } finally {
      setBezig(false);
    }
  }

  async function verstuur(e: React.FormEvent) {
    e.preventDefault();
    setVerstuurd("bezig");
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: {
          fullName: contact.naam,
          email: contact.email,
          phone: contact.telefoon,
          companyName: form.bedrijf.slice(0, 100),
          subject: "Nieuwe AI-projectbriefing",
          notes: briefing.slice(0, 1000),
        },
      });
      setVerstuurd(error ? "fout" : "ok");
    } catch {
      setVerstuurd("fout");
    }
  }

  const whatsapp = `${companyInfo.whatsapp}?text=${encodeURIComponent(`Hoi Nieuwblik, ik heb een projectbriefing gemaakt:\n\n${briefing.slice(0, 1500)}`)}`;

  return (
    <div className="min-h-screen bg-background">
      <section className="pt-32 pb-8">
        <div className="container mx-auto px-6">
          <Breadcrumb items={[{ label: "Projectbriefing", path: "/projectbriefing" }]} />
        </div>
      </section>

      <section className="pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <h1 className="text-display mb-6">Maak in 1 minuut je projectbriefing</h1>
          <p className="text-xl text-muted-foreground font-light leading-relaxed mb-10">
            Vertel wat je bedrijf doet en wat je website moet opleveren. Je krijgt direct een heldere briefing met passende diensten,
            een prijsindicatie en de volgende stap. Gratis en zonder verplichtingen.
          </p>

          <form onSubmit={maak} className="space-y-5 rounded-2xl border border-border p-6 md:p-8">
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="bedrijf">Je bedrijf en branche *</Label>
                <Input id="bedrijf" value={form.bedrijf} onChange={zet("bedrijf")} maxLength={200} placeholder="Bijv. kapsalon met 3 stoelen" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plaats">Plaats</Label>
                <Input id="plaats" value={form.plaats} onChange={zet("plaats")} maxLength={80} placeholder="Bijv. Hoorn" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="doelen">Wat moet de website voor je doen? *</Label>
              <Textarea id="doelen" value={form.doelen} onChange={zet("doelen")} maxLength={1500} rows={4} placeholder="Bijv. meer afspraken via de site, beter gevonden worden in de regio" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="functies">Gewenste functies</Label>
              <Textarea id="functies" value={form.functies} onChange={zet("functies")} maxLength={800} rows={3} placeholder="Bijv. online boeken, webshop, portfolio, meertalig" />
            </div>
            <div className="grid sm:grid-cols-3 gap-5">
              <div className="space-y-2">
                <Label htmlFor="huidigeSite">Huidige website</Label>
                <Input id="huidigeSite" value={form.huidigeSite} onChange={zet("huidigeSite")} maxLength={200} placeholder="Optioneel" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Budgetindicatie</Label>
                <Input id="budget" value={form.budget} onChange={zet("budget")} maxLength={60} placeholder="Bijv. €1.000 - €2.000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="start">Gewenste start</Label>
                <Input id="start" value={form.start} onChange={zet("start")} maxLength={60} placeholder="Bijv. binnen een maand" />
              </div>
            </div>
            <Button type="submit" size="lg" disabled={bezig} className="w-full sm:w-auto">
              {bezig ? "Briefing wordt gemaakt..." : "Maak mijn briefing"}
            </Button>
            {fout && <p role="alert" className="text-destructive text-sm">{fout}</p>}
          </form>

          {(briefing || bezig) && (
            <div className="mt-10 rounded-2xl border border-border bg-secondary/40 p-6 md:p-8" aria-live="polite">
              {briefing ? <Briefing tekst={briefing} /> : <p className="text-muted-foreground">Je briefing wordt opgesteld...</p>}
            </div>
          )}

          {briefing && !bezig && (
            <div className="mt-8 rounded-2xl border border-border p-6 md:p-8 space-y-5">
              <h2 className="text-2xl font-bold">Stuur je briefing naar Nieuwblik</h2>
              {verstuurd === "ok" ? (
                <p className="text-foreground">Bedankt! We hebben je briefing ontvangen en reageren binnen 24 uur.</p>
              ) : (
                <form onSubmit={verstuur} className="space-y-4">
                  <div className="grid sm:grid-cols-3 gap-4">
                    <Input required minLength={2} maxLength={100} placeholder="Naam" aria-label="Naam" value={contact.naam} onChange={(e) => setContact({ ...contact, naam: e.target.value })} />
                    <Input required type="email" maxLength={255} placeholder="E-mailadres" aria-label="E-mailadres" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
                    <Input required pattern="[0-9+\s\-()]{10,20}" placeholder="Telefoonnummer" aria-label="Telefoonnummer" value={contact.telefoon} onChange={(e) => setContact({ ...contact, telefoon: e.target.value })} />
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button type="submit" disabled={verstuurd === "bezig"}>
                      {verstuurd === "bezig" ? "Versturen..." : "Stuur briefing naar Nieuwblik"}
                    </Button>
                    <Button asChild variant="outline">
                      <a href={whatsapp} target="_blank" rel="noopener noreferrer">Bespreek via WhatsApp</a>
                    </Button>
                  </div>
                  {verstuurd === "fout" && <p role="alert" className="text-destructive text-sm">Versturen lukte niet. Controleer je gegevens of stuur een WhatsApp-bericht.</p>}
                </form>
              )}
            </div>
          )}

          <p className="mt-10 text-sm text-muted-foreground">
            Liever eerst de prijzen zien? Bekijk <Link to="/wat-kost-een-website" className="underline">wat een website kost</Link>.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Projectbriefing;
