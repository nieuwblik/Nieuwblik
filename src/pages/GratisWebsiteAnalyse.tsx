import { lazy, memo, Suspense, useCallback, useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { Star } from "lucide-react";

import AnalyseOnderdelen from "@/components/AnalyseOnderdelen";
import AnalyseWerkwijze from "@/components/AnalyseWerkwijze";
import Breadcrumb from "@/components/Breadcrumb";
import CaseGrid from "@/components/CaseGrid";
import Footer from "@/components/Footer";
import GoogleReviewMuur, { GoogleG } from "@/components/GoogleReviewMuur";
import SEOHead from "@/components/SEOHead";
import { getLenis } from "@/components/SmoothScroll";
import { INKT_65, Sectie } from "@/components/dienst/DienstBlokken";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { REVIEWS } from "@/config/business";
import { companyInfo } from "@/config/company";
import { SITE_URL } from "@/config/site";
import { projects } from "@/data/projects";
import { Link, useNavigate } from "@/lib/router-compat";
import { golfAnalyse } from "@/data/golfAnalyse";
import { useGolf } from "@/components/golf/useGolf";
import terugvalDesktop from "@/assets/hero/analyse-desktop.webp";
import terugvalMobiel from "@/assets/hero/analyse-mobiel.webp";

// Zoals op de homepage: pas laden als de pagina er staat.
const FAQSection = lazy(() => import("@/components/FAQSection"));

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  website: string;
  /** Lokveld: onzichtbaar voor mensen, spambots vullen het in. */
  kenmerk: string;
}

type Fouten = Partial<Record<keyof FormState, string>>;

const GROEN = "hsl(var(--sw-green))";
const RAND = "hsl(var(--sw-rule) / 0.1)";

const vragen = [
  {
    question: "Is het echt gratis?",
    answer: "Ja. De analyse kost niets en je zit nergens aan vast.",
  },
  {
    question: "Wat krijg ik precies?",
    answer:
      "Je krijgt per mail een PDF met de uitwerking van je vindbaarheid, mobiele weergave, design en teksten, met concrete verbeterpunten.",
  },
  {
    question: "Wanneer heb ik de analyse?",
    answer: "Binnen 1 werkdag na je aanvraag.",
  },
  {
    question: "Moet ik daarna iets afnemen?",
    answer:
      "Nee. Je mag de punten zelf oppakken of door iemand anders laten doen. Wil je hulp van ons, dan krijg je eerst een vaste prijs.",
  },
  {
    question: "Waarom is het gratis?",
    answer:
      "Zo laten we zien hoe we naar websites kijken. Bevalt dat, dan praten we verder. Zo niet, dan heb je in elk geval bruikbare verbeterpunten.",
  },
];

const CASES = ["feigro-dakwerken", "taxi-drechterland"];
const cases = CASES.flatMap((slug) => projects.filter((p) => p.slug === slug));

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

/** Een lopende zin als kop, in de opmaak van de inleiding op de homepage. */
const Inleiding = ({ children }: { children: string }) => (
  <div className="mb-12 md:mb-16">
    <h2 className="pf-inleiding">{children}</h2>
  </div>
);

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

/**
 * Alles onder de hero. Staat los van de pagina zodat typen in het formulier deze
 * secties niet opnieuw rendert; op een traag toestel voel je dat bij elke toets.
 */
const Onderkant = memo(({ onKnop }: { onKnop: () => void }) => (
  <>
    <AnalyseWerkwijze onKnop={onKnop} />

    <div id="onderdelen" className="scroll-mt-16">
      <Sectie>
        <Inleiding>
          We lopen je website door zoals een klant dat doet. Word je gevonden, werkt je site op de telefoon, oogt hij
          verzorgd en snappen bezoekers meteen wat je doet?
        </Inleiding>
        <AnalyseOnderdelen />
      </Sectie>
    </div>

    <Sectie papier>
      <Inleiding>
        Recent werk voor ondernemers in heel Nederland. Van dakdekker tot taxibedrijf: elke site op maat ontworpen, snel
        en goed vindbaar.
      </Inleiding>
      <CaseGrid projects={cases} zonderOmschrijving />
    </Sectie>

    <GoogleReviewMuur />

    {/* Hier komt het voorbeeldrapport zodra de PDF klaar is. */}

    <Suspense fallback={<div className="min-h-[420px]" />}>
      <FAQSection
        zonderAnimatie
        vragen={vragen}
        intro="Alles wat je wilt weten voordat je de analyse aanvraagt."
        actie={
          <AnimatedButton onClick={onKnop} size="lg">
            Ontvang mijn gratis analyse
          </AnimatedButton>
        }
      />
    </Suspense>
  </>
));

const Voet = memo(Footer);

/**
 * Zet de klasse form-in-beeld op <html> zolang het formulier in beeld is. Op de
 * telefoon wijkt de zwevende knop dan, anders dekt hij de privacylink af (zie
 * styles.css). Alleen een klasse en geen state: de pagina hoeft niet opnieuw te renderen.
 */
const useFormInBeeld = (formRef: RefObject<HTMLFormElement | null>) => {
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const html = document.documentElement;
    const waarnemer = new IntersectionObserver(([item]) =>
      html.classList.toggle("form-in-beeld", Boolean(item?.isIntersecting)),
    );
    waarnemer.observe(form);
    return () => {
      waarnemer.disconnect();
      html.classList.remove("form-in-beeld");
    };
  }, [formRef]);
};

const GratisWebsiteAnalyse = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLElement>(null);
  const vlakRef = useRef<HTMLDivElement>(null);
  useGolf(heroRef, vlakRef, golfAnalyse, "analyse");
  const formRef = useRef<HTMLFormElement>(null);
  useFormInBeeld(formRef);
  // Een ref en geen state: een dubbele tik valt binnen dezelfde render.
  const verstuurt = useRef(false);
  const [bezig, setBezig] = useState(false);
  const [fouten, setFouten] = useState<Fouten>({});
  const [verzendFout, setVerzendFout] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormState>({
    fullName: "",
    email: "",
    phone: "",
    website: "",
    kenmerk: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFouten((prev) => ({ ...prev, [name]: undefined }));
  };

  const naarFormulier = useCallback(() => {
    const form = formRef.current;
    if (!form) return;
    // Via Lenis: die houdt de scrollpositie vast en negeert een gewone scrollIntoView.
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(form, { offset: -96 });
    else form.scrollIntoView({ behavior: "smooth", block: "center" });
    form.querySelector<HTMLInputElement>("#website")?.focus({ preventScroll: true });
  }, []);

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

  const url = `${SITE_URL}/gratis-website-analyse`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: "Gratis website-analyse",
        description:
          "Gratis analyse van je website op vindbaarheid, mobiele weergave, design en teksten. Binnen 1 werkdag per mail als PDF.",
        provider: { "@type": "Organization", name: companyInfo.name, url: companyInfo.url },
        areaServed: { "@type": "Country", name: "Nederland" },
      },
      {
        "@type": "FAQPage",
        mainEntity: vragen.map((v) => ({
          "@type": "Question",
          name: v.question,
          acceptedAnswer: { "@type": "Answer", text: v.answer },
        })),
      },
    ],
  };

  const invoerKlasse = "mt-1.5 bg-white";

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Gratis website-analyse binnen 1 werkdag | Nieuwblik"
        description="Laat je website gratis nakijken. Binnen 1 werkdag krijg je een PDF met verbeterpunten voor vindbaarheid, mobiel, design en teksten. Vrijblijvend."
        keywords="gratis website analyse, website check, SEO scan, website laten checken"
        canonicalUrl={url}
        structuredData={structuredData}
        breadcrumbs={[
          { name: "Home", url: SITE_URL },
          { name: "Gratis website-analyse", url },
        ]}
      />

      <main>
        {/* De hero van de homepage, met het formulier op de plek van de hand met
            telefoon: de zijden golf loopt achter de kaart door. Afstellen kan met
            toets p, de instellingen staan los van de homepage (src/data/golfAnalyse.ts). */}
        <section
          ref={heroRef}
          className={`golf-hero${golfAnalyse.opstelling.spiegel ? " golf-hero--gespiegeld" : ""} sw-ink sw-hero-anim relative isolate flex flex-col overflow-hidden bg-background lg:min-h-[86svh]`}
        >
          <picture className="golf-hero__terugval" aria-hidden="true">
            <source media="(max-width: 759px), (max-aspect-ratio: 9/10)" srcSet={terugvalMobiel} />
            <img src={terugvalDesktop} alt="" decoding="async" fetchPriority="low" />
          </picture>
          <div ref={vlakRef} className="golf-hero__vlak" />

          <div className="golf-hero__inhoud container mx-auto grid flex-1 grid-cols-1 items-center gap-10 px-4 pb-28 pt-[calc(var(--header-height)_+_2rem)] sm:px-6 md:pb-28 lg:pb-32 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:gap-16 lg:pt-[calc(var(--header-height)_+_2rem)]">
            <div>
              <div className="relative z-[3] mb-8 hidden md:block">
                <Breadcrumb items={[{ label: "Gratis website-analyse", path: "/gratis-website-analyse" }]} />
              </div>
              <h1 className="golf-hero__titel golf-hero__titel--strak">
                <span className="sw-mask">
                  <span className="sw-line-inner">Laat je website</span>
                </span>{" "}
                <span className="sw-mask">
                  <span className="sw-line-inner">gratis nakijken</span>
                </span>
              </h1>
              <p
                className="sw-lead relative z-[3] mt-5 max-w-[34rem] text-base leading-relaxed md:mt-5 md:text-lg"
                style={{ color: "hsl(var(--sw-ink) / 0.7)", "--sw-delay": "0.1s" } as CSSProperties}
              >
                Binnen 1 werkdag krijg je per mail een PDF met wat er beter kan aan je vindbaarheid, mobiele weergave,
                design en teksten.
              </p>
              <a
                href={REVIEWS.profielUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="sw-cta group relative z-[3] mt-5 flex w-fit items-center gap-2.5 md:mt-6"
                style={{ "--sw-delay": "0.55s" } as CSSProperties}
              >
                <GoogleG className="h-[18px] w-[18px] shrink-0" />
                <span className="flex items-center gap-1" aria-hidden="true">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4" style={{ fill: GROEN, color: GROEN }} />
                  ))}
                </span>
                <span
                  className="text-sm transition-colors group-hover:text-[hsl(var(--sw-green))]"
                  style={{ color: "hsl(var(--sw-ink) / 0.8)" }}
                >
                  {REVIEWS.scoreLabel} op Google,{" "}
                  <span style={{ color: "hsl(var(--sw-ink) / 0.62)" }}>
                    <span className="max-sm:hidden">op basis van </span>
                    {REVIEWS.aantalLabel}reviews
                  </span>
                </span>
              </a>
            </div>

            <form
              ref={formRef}
              onSubmit={(e) => void handleSubmit(e)}
              noValidate
              className="sw-cta relative z-[3] space-y-4 rounded-2xl border bg-white p-6 shadow-[0_24px_60px_-18px_rgba(0,0,0,0.28)] md:p-7"
              style={{ borderColor: RAND, "--sw-delay": "0.3s" } as CSSProperties}
            >
              <h2 className="text-lg font-bold tracking-tight sw-ink md:text-2xl">Vraag je gratis analyse aan</h2>
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

              <AnimatedButton
                type="submit"
                disabled={bezig}
                className="h-11 w-full whitespace-nowrap px-4 md:h-12 md:text-lg"
              >
                {bezig ? "Versturen..." : "Ontvang mijn gratis analyse"}
              </AnimatedButton>
              <p className="text-center text-xs" style={{ color: INKT_65 }}>
                Gratis en zonder verplichtingen. Lees onze{" "}
                <Link to="/privacy" className="underline underline-offset-2">
                  privacyverklaring
                </Link>
                .
              </p>
            </form>
          </div>
        </section>

        <Onderkant onKnop={naarFormulier} />
      </main>

      <Voet />
    </div>
  );
};

export default GratisWebsiteAnalyse;
