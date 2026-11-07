import { useEffect, useRef, useState } from "react";
import { FileText, Palette, Search, Smartphone, Star } from "lucide-react";

import SEOHead from "@/components/SEOHead";
import { getLenis } from "@/components/SmoothScroll";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { REVIEWS } from "@/config/business";
import { companyInfo } from "@/config/company";
import { SITE_URL } from "@/config/site";
import { googleReviews } from "@/data/googleReviews";
import { Link, useNavigate } from "@/lib/router-compat";
import justinImage from "@/assets/justin-slok.webp";
import logo from "@/assets/logo.webp";

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  website: string;
  /** Lokveld: onzichtbaar voor mensen, spambots vullen het in. */
  kenmerk: string;
}

type Fouten = Partial<Record<keyof FormState, string>>;

const onderdelen = [
  {
    icon: Search,
    title: "Vindbaarheid",
    text: "Hoe goed je gevonden wordt in Google en AI-zoekmachines zoals ChatGPT.",
  },
  {
    icon: Smartphone,
    title: "Mobiele weergave",
    text: "Of je site goed werkt op telefoon, tablet en computer.",
  },
  {
    icon: Palette,
    title: "Design",
    text: "Of je site er verzorgd uitziet en vertrouwen geeft.",
  },
  {
    icon: FileText,
    title: "Teksten",
    text: "Of bezoekers snel snappen wat je doet en wat ze moeten doen.",
  },
];

const vragen = [
  {
    q: "Is het echt gratis?",
    a: "Ja. De analyse kost niets en je zit nergens aan vast.",
  },
  {
    q: "Wat krijg ik precies?",
    a: "Je krijgt per mail een PDF met de uitwerking van je vindbaarheid, mobiele weergave, design en teksten, met concrete verbeterpunten.",
  },
  {
    q: "Wanneer heb ik de analyse?",
    a: "Binnen 1 werkdag na je aanvraag.",
  },
  {
    q: "Moet ik daarna iets afnemen?",
    a: "Nee. Je mag de punten zelf oppakken of door iemand anders laten doen. Wil je hulp van ons, dan krijg je eerst een vaste prijs.",
  },
  {
    q: "Waarom is het gratis?",
    a: "Zo laten we zien hoe we naar websites kijken. Bevalt dat, dan praten we verder. Zo niet, dan heb je in elk geval bruikbare verbeterpunten.",
  },
];

/** Letterlijk uit googleReviews; zie de opmerking in dat bestand. */
const REVIEW_NAMEN = ["Deniz Cem Toptaş", "Nancy van Ham", "Dennis van Heuven van Staerelingen"];
const reviews = REVIEW_NAMEN.flatMap((naam) => googleReviews.filter((r) => r.naam === naam));

/** Dezelfde regel als de serverfunctie, zodat een fout hier al zichtbaar wordt. */
const TELEFOON = /^[0-9+\s\-()]{10,20}$/;
const WEBSITE = /^(https?:\/\/)?[^\s/.]+(\.[^\s/.]+)+(\/\S*)?$/i;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function controleer(data: FormState): Fouten {
  const fouten: Fouten = {};
  if (!WEBSITE.test(data.website.trim())) fouten.website = "Vul het adres van je website in, bijvoorbeeld jouwbedrijf.nl.";
  if (data.fullName.trim().length < 2) fouten.fullName = "Vul je naam in.";
  if (!EMAIL.test(data.email.trim())) fouten.email = "Vul een geldig e-mailadres in.";
  if (data.phone.trim() && !TELEFOON.test(data.phone.trim())) fouten.phone = "Vul een geldig telefoonnummer in, of laat dit veld leeg.";
  return fouten;
}

/** De herkomst uit de advertentielink, zodat je in Aanvragen ziet waar iemand vandaan komt. */
function bronUitUrl(): string {
  const params = new URLSearchParams(window.location.search);
  return ["utm_source", "utm_medium", "utm_campaign", "utm_term", "gclid"]
    .flatMap((sleutel) => {
      const waarde = params.get(sleutel);
      return waarde ? [`${sleutel}=${waarde.slice(0, 120)}`] : [];
    })
    .join(", ");
}

const Veld = ({
  id,
  label,
  fout,
  children,
}: {
  id: string;
  label: string;
  fout?: string | undefined;
  children: React.ReactNode;
}) => (
  <div>
    <Label htmlFor={id}>{label}</Label>
    {children}
    {fout && (
      <p id={`${id}-fout`} className="mt-1.5 text-sm text-destructive">
        {fout}
      </p>
    )}
  </div>
);

const Sterren = () => (
  <span className="flex gap-0.5" aria-hidden="true">
    {Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className="h-4 w-4 fill-current" style={{ color: "hsl(var(--sw-green))" }} />
    ))}
  </span>
);

const GratisWebsiteAnalyse = () => {
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  // Een ref en geen state: een dubbele tik valt binnen dezelfde render.
  const verstuurt = useRef(false);
  const [bezig, setBezig] = useState(false);
  const [fouten, setFouten] = useState<Fouten>({});
  const [verzendFout, setVerzendFout] = useState<string | null>(null);
  const [formInBeeld, setFormInBeeld] = useState(true);
  const [formData, setFormData] = useState<FormState>({
    fullName: "",
    email: "",
    phone: "",
    website: "",
    kenmerk: "",
  });

  // De vaste knop op de telefoon alleen als het formulier uit beeld is.
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const waarnemer = new IntersectionObserver(([item]) => setFormInBeeld(Boolean(item?.isIntersecting)));
    waarnemer.observe(form);
    return () => waarnemer.disconnect();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFouten((prev) => ({ ...prev, [name]: undefined }));
  };

  const naarFormulier = () => {
    const form = formRef.current;
    if (!form) return;
    // Via Lenis: die houdt de scrollpositie vast en negeert een gewone scrollIntoView.
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(form, { offset: -24 });
    else form.scrollIntoView({ behavior: "smooth", block: "start" });
    form.querySelector<HTMLInputElement>("#website")?.focus({ preventScroll: true });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (verstuurt.current) return;

    const gevonden = controleer(formData);
    setFouten(gevonden);
    setVerzendFout(null);
    const eerste = Object.keys(gevonden)[0];
    if (eerste) {
      formRef.current?.querySelector<HTMLInputElement>(`#${eerste}`)?.focus();
      return;
    }

    verstuurt.current = true;
    setBezig(true);
    try {
      // Supabase pas in de browser laden: de client is een CommonJS-bundel en
      // mag niet in de servergraaf terechtkomen (SSR-fout "exports is not defined").
      const { supabase } = await import("@/integrations/supabase/client");
      const bron = bronUitUrl();
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone.trim() || undefined,
          notes: [
            "Aanvraag: Gratis website-analyse",
            `Website: ${formData.website.trim()}`,
            bron && `Bron: ${bron}`,
          ]
            .filter(Boolean)
            .join("\n"),
          subject: "Aanvraag website analyse",
          kenmerk: formData.kenmerk,
        },
      });

      if (error) throw error;

      // Alleen de bedankpagina na een echte aanvraag telt als conversie.
      try {
        window.sessionStorage.setItem("analyseVerstuurd", "1");
      } catch {
        // Opslag geblokkeerd: de aanvraag zelf is binnen, alleen de meting vervalt.
      }
      navigate("/bedankt-analyse");
    } catch (fout) {
      const status = (fout as { context?: { status?: number } })?.context?.status;
      setVerzendFout(
        status === 429
          ? "Je hebt het formulier te vaak verstuurd. Stuur ons gerust even een appje."
          : "Versturen lukte niet. Probeer het opnieuw of stuur ons een appje.",
      );
      verstuurt.current = false;
      setBezig(false);
    }
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Gratis website-analyse - Nieuwblik",
    description:
      "Gratis analyse van je website op vindbaarheid, mobiele weergave, design en teksten. Binnen 1 werkdag per mail als PDF.",
    provider: {
      "@type": "Organization",
      name: "Nieuwblik",
      url: SITE_URL,
    },
    areaServed: "Nederland",
  };

  const invoerKlasse = "mt-1.5 bg-background";

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Gratis website-analyse binnen 1 werkdag | Nieuwblik"
        description="Laat je website gratis nakijken. Binnen 1 werkdag krijg je een PDF met verbeterpunten voor vindbaarheid, mobiel, design en teksten. Vrijblijvend."
        keywords="gratis website analyse, website check, SEO scan, website laten checken"
        canonicalUrl={`${SITE_URL}/gratis-website-analyse`}
        structuredData={structuredData}
        breadcrumbs={[
          { name: "Home", url: SITE_URL },
          { name: "Gratis website-analyse", url: `${SITE_URL}/gratis-website-analyse` },
        ]}
      />

      <header className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link to="/" aria-label="Nieuwblik, naar de homepage">
          <img src={logo} alt="Nieuwblik" width="120" height="24" className="h-6 w-auto brightness-0" />
        </Link>
        <a
          href={companyInfo.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium underline underline-offset-4"
          style={{ color: "hsl(var(--sw-green))" }}
        >
          App ons
        </a>
      </header>

      <main>
        <section className="pb-14 pt-4 md:pb-20 md:pt-12">
          <div className="container mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)] lg:gap-16">
            <div>
              <h1 className="text-[2.1rem] font-extrabold leading-[1.05] tracking-tight md:text-[3.15rem] lg:text-[3.6rem]">
                Laat je website gratis nakijken
              </h1>
              <p className="mt-3 text-base font-light leading-snug text-muted-foreground md:mt-6 md:text-xl">
                Binnen 1 werkdag krijg je per mail een PDF met wat er beter kan aan je vindbaarheid, mobiele weergave,
                design en teksten.
              </p>
              <ul className="mt-10 hidden space-y-5 lg:block">
                {onderdelen.map(({ icon: Icon, title, text }) => (
                  <li key={title} className="flex gap-4">
                    <Icon className="mt-0.5 h-5 w-5 shrink-0" style={{ color: "hsl(var(--sw-green))" }} aria-hidden="true" />
                    <span>
                      <span className="block font-semibold">{title}</span>
                      <span className="block text-sm font-light text-muted-foreground">{text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <form
              ref={formRef}
              onSubmit={(e) => void handleSubmit(e)}
              noValidate
              className="space-y-3.5 rounded-2xl border p-5 md:p-8"
              style={{ background: "hsl(var(--sw-paper))", borderColor: "hsl(var(--sw-rule) / 0.1)" }}
            >
              <Veld id="website" label="Je website" fout={fouten.website}>
                <Input
                  id="website"
                  name="website"
                  type="text"
                  inputMode="url"
                  autoComplete="url"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  value={formData.website}
                  onChange={handleChange}
                  aria-invalid={Boolean(fouten.website)}
                  aria-describedby={fouten.website ? "website-fout" : undefined}
                  className={invoerKlasse}
                  placeholder="jouwbedrijf.nl"
                />
              </Veld>
              <Veld id="fullName" label="Naam" fout={fouten.fullName}>
                <Input
                  id="fullName"
                  name="fullName"
                  autoComplete="name"
                  value={formData.fullName}
                  onChange={handleChange}
                  aria-invalid={Boolean(fouten.fullName)}
                  aria-describedby={fouten.fullName ? "fullName-fout" : undefined}
                  className={invoerKlasse}
                />
              </Veld>
              <Veld id="email" label="E-mailadres" fout={fouten.email}>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  value={formData.email}
                  onChange={handleChange}
                  aria-invalid={Boolean(fouten.email)}
                  aria-describedby={fouten.email ? "email-fout" : undefined}
                  className={invoerKlasse}
                />
              </Veld>
              <Veld id="phone" label="Telefoonnummer (optioneel)" fout={fouten.phone}>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  aria-invalid={Boolean(fouten.phone)}
                  aria-describedby={fouten.phone ? "phone-fout" : undefined}
                  className={invoerKlasse}
                />
              </Veld>

              {/* Lokveld tegen spam: buiten beeld en niet bereikbaar met Tab. */}
              <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
                <label htmlFor="kenmerk">Laat dit veld leeg</label>
                <input
                  id="kenmerk"
                  name="kenmerk"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.kenmerk}
                  onChange={handleChange}
                />
              </div>

              {verzendFout && (
                <p role="alert" className="text-sm text-destructive">
                  {verzendFout}{" "}
                  <a href={companyInfo.whatsapp} target="_blank" rel="noopener noreferrer" className="underline">
                    Naar WhatsApp
                  </a>
                </p>
              )}

              <Button
                type="submit"
                disabled={bezig}
                size="lg"
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {bezig ? "Versturen..." : "Ontvang mijn gratis analyse"}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Gratis en zonder verplichtingen. Lees onze{" "}
                <Link to="/privacy" className="underline underline-offset-2">
                  privacyverklaring
                </Link>
                .
              </p>
              <a
                href={REVIEWS.profielUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
              >
                <Sterren />
                <span>
                  {REVIEWS.scoreLabel} op Google, {REVIEWS.aantalLabel}reviews
                </span>
              </a>
            </form>
          </div>
        </section>

        {/* Op desktop staan de onderdelen al naast het formulier. */}
        <section className="pb-14 lg:hidden">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-semibold">Dit bekijken we</h2>
            <ul className="mt-6 space-y-5">
              {onderdelen.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-4">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0" style={{ color: "hsl(var(--sw-green))" }} aria-hidden="true" />
                  <span>
                    <span className="block font-semibold">{title}</span>
                    <span className="block text-sm font-light text-muted-foreground">{text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Hier komt het voorbeeldrapport zodra de PDF klaar is. */}

        <section className="py-14 md:py-20" style={{ background: "hsl(var(--sw-paper))" }}>
          <div className="container mx-auto max-w-6xl px-6">
            <div className="flex items-center gap-4">
              <img
                src={justinImage}
                alt="Justin Slok"
                width="64"
                height="64"
                loading="lazy"
                className="h-16 w-16 shrink-0 rounded-full object-cover"
              />
              <div>
                <h2 className="text-2xl font-semibold">Justin Slok, Nieuwblik</h2>
                <p className="text-sm font-light text-muted-foreground">
                  Je aanvraag komt bij Justin in Enkhuizen. Hij is ook je aanspreekpunt bij vragen.
                </p>
              </div>
            </div>
            <ul className="mt-8 grid gap-4 md:grid-cols-3">
              {reviews.map((review) => (
                <li
                  key={review.naam}
                  className="rounded-2xl border bg-background p-5"
                  style={{ borderColor: "hsl(var(--sw-rule) / 0.1)" }}
                >
                  <Sterren />
                  <p className="mt-3 text-sm font-light leading-relaxed">{review.tekst}</p>
                  <p className="mt-3 text-sm font-semibold">{review.naam}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-14 md:py-20">
          <div className="container mx-auto max-w-3xl px-6">
            <h2 className="text-2xl font-semibold">Veelgestelde vragen</h2>
            <div className="mt-6 divide-y border-y" style={{ borderColor: "hsl(var(--sw-rule) / 0.1)" }}>
              {vragen.map(({ q, a }) => (
                <details key={q} className="group py-4">
                  <summary className="cursor-pointer list-none font-medium [&::-webkit-details-marker]:hidden">
                    {q}
                  </summary>
                  <p className="mt-2 text-sm font-light leading-relaxed text-muted-foreground">{a}</p>
                </details>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Button
                type="button"
                size="lg"
                onClick={naarFormulier}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Ontvang mijn gratis analyse
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t pb-24 pt-6 lg:pb-6" style={{ borderColor: "hsl(var(--sw-rule) / 0.1)" }}>
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 text-xs text-muted-foreground">
          <span>
            {companyInfo.name}, Enkhuizen. KvK {companyInfo.kvk}
          </span>
          <span className="flex gap-4">
            <Link to="/privacy" className="underline underline-offset-2">
              Privacy
            </Link>
            <Link to="/algemene-voorwaarden" className="underline underline-offset-2">
              Voorwaarden
            </Link>
            <Link to="/cookies" className="underline underline-offset-2">
              Cookies
            </Link>
          </span>
        </div>
      </footer>

      {/* Op de telefoon blijft de knop bereikbaar; rechts staan de zwevende knoppen. */}
      {!formInBeeld && (
        <div className="fixed bottom-4 left-4 right-[136px] z-50 md:bottom-6 lg:hidden">
          <Button
            type="button"
            size="lg"
            onClick={naarFormulier}
            className="h-[52px] w-full bg-accent px-3 text-accent-foreground hover:bg-accent/90"
          >
            Gratis analyse
          </Button>
        </div>
      )}
    </div>
  );
};

export default GratisWebsiteAnalyse;
