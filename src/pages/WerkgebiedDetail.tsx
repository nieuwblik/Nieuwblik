import { kiesCases } from "@/lib/cases";
import BenefitList from "@/components/BenefitList";
import { LEVERTIJD, PRIJZEN } from "@/config/business";
import { Link, useParams } from "@/lib/router-compat";
import { MapPin, Phone } from "lucide-react";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { AnimatedButton } from "@/components/ui/animated-button";
import { getWerkgebiedRegionBySlug, regions } from "@/data/regions";
import { cityLinks } from "@/data/cityLinks";
import SEOHead from "@/components/SEOHead";
import { companyInfo } from "@/config/company";
import CaseGrid from "@/components/CaseGrid";
import Alinea from "@/components/Alinea";
import LandingFaq from "@/components/LandingFaq";
import { dienstInPlaats, faqPage } from "@/lib/structured-data";
import { LokaleSecties, TodoBlok } from "@/components/LokaleSecties";
import { getWerkgebiedLokaal } from "@/data/werkgebiedLokaal";
import LandingHero from "@/components/LandingHero";
import { BlokVinkjes, TekstBlok } from "@/components/dienst/BeeldBlok";

// Deze vier eerst, aangevuld tot zes met de nieuwste cases. Voor West-Friese
// plaatsen eerst de klanten uit de regio zelf.
const STANDAARD_CASES = ["puur-in-harmonie", "benoted", "danique-kwakman", "erica-van-dijk"];
const REGIO_CASES = ["vv-madjoe", "een-bundel-geluk", "taxi-drechterland", "aardingsbedrijf-west-friesland"];

const WEST_FRIESLAND_KERNEN = [
  'enkhuizen', 'hoorn', 'medemblik', 'bovenkarspel', 'hoogkarspel',
  'andijk', 'venhuizen', 'hem', 'hauwert', 'zwaagdijk',
];


const WerkgebiedDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const region = slug ? getWerkgebiedRegionBySlug(slug) : undefined;

  if (!region) {
    return (
      <>
        <main className="min-h-screen bg-background pt-24 pb-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Regio niet gevonden</h1>
            <p className="text-muted-foreground mb-8">
              De regio "{slug}" bestaat niet in ons werkgebied.
            </p>
            <AnimatedButton to="/werkgebied">
              Bekijk alle regio's
            </AnimatedButton>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const isLocal = region.type === "local";
  const lokaal = getWerkgebiedLokaal(region.slug);
  const westFries = region.slug === "west-friesland" || WEST_FRIESLAND_KERNEN.includes(region.slug);
  const featuredProjects = kiesCases(lokaal?.cases ?? (westFries ? REGIO_CASES : STANDAARD_CASES));
  const eigenOpbouw = Boolean(lokaal?.eigenOpbouw);
  const paginaUrl = `${companyInfo.url}/werkgebied/${region.slug}`;
  const isHoorn = region.slug === "hoorn";

  // Omliggende plaatsen met een eigen pagina: eerst het werkgebied, anders de
  // landelijke stadspagina (zoals Alkmaar). Plaatsen zonder pagina vallen weg.
  const buren = (region.nearbyPlaces ?? []).flatMap((naam) => {
    const s = naam.toLowerCase().replace(/\s+/g, "-");
    const werkgebied = getWerkgebiedRegionBySlug(s);
    if (werkgebied) return [{ naam: werkgebied.name, to: `/werkgebied/${s}` }];
    if (cityLinks.some((c) => c.slug === s))
      return [{ naam, to: `/website-laten-maken-${s}` }];
    return [];
  });
  const pageTitle = `Website laten maken ${region.name} vanaf €${PRIJZEN.starter} | Nieuwblik`;
  const pageDescription = isHoorn
    ? `Website laten maken in Hoorn? Vanaf €${PRIJZEN.starter}, binnen ${LEVERTIJD.standaard} live en persoonlijk contact vanuit Enkhuizen. Vraag vrijblijvend een offerte aan.`
    : `Website laten maken in ${region.name} vanaf €${PRIJZEN.starter}. Persoonlijk, vindbaar en binnen ${LEVERTIJD.standaard} live. Vraag vrijblijvend een offerte aan.`;

  const getIntroText = () => {
    if (isHoorn) {
      return `Trek meer klanten uit Hoorn en West-Friesland met een snelle, vindbare website op maat. Je werkt rechtstreeks met de makers, krijgt vooraf een heldere prijs en kunt binnen ${LEVERTIJD.standaard} live.`;
    }
    if (isLocal) {
      return `Laat jouw bedrijf in ${region.name} groeien met een snelle, vindbare website vanaf €${PRIJZEN.starter}. Je krijgt persoonlijk contact, een heldere prijs en kunt binnen ${LEVERTIJD.standaard} live.`;
    }
    return `Laat jouw bedrijf in ${region.name} groeien met een snelle, vindbare website vanaf €${PRIJZEN.starter}. Je werkt rechtstreeks met de makers en kunt binnen ${LEVERTIJD.standaard} live.`;
  };

  const services = [
    {
      title: `Websites`,
      description: `Professionele websites die perfect aansluiten bij bedrijven in ${region.name}.`,
    },
    {
      title: "Webshops",
      description: `E-commerce oplossingen waarmee je 24/7 online kunt verkopen.`,
    },
    {
      title: "Lokale SEO",
      description: `Beter vindbaar in Google voor "${region.name}" en omgeving.`,
    },
    {
      title: "Supersnel & mobiel",
      description: `Razendsnel ladende websites die perfect werken op elk apparaat.`,
    },
  ];

  const whyPoints = [
    {
      title: isLocal ? "Lokaal en dichtbij" : "Snelle communicatie",
      text: isLocal
        ? `We zitten vlakbij ${region.name} en werken met korte lijnen.`
        : `Via videobellen, e-mail en telefoon blijven we nauw in contact.`,
    },
    {
      title: "Persoonlijke aandacht",
      text: `Je bent geen nummer. We nemen de tijd om jouw bedrijf echt te begrijpen.`,
    },
    {
      title: isLocal ? "Lokale kennis" : "Scherpe prijzen",
      text: isLocal
        ? // Op de West-Friesland-pagina zelf stond hier "in West-Friesland en
          // West-Friesland".
          region.name === "West-Friesland"
          ? "We begrijpen de markt in West-Friesland als geen ander."
          : `We begrijpen de markt in ${region.name} en West-Friesland.`
        : `Door onze locatie in Enkhuizen bieden we scherpe prijzen.`,
    },
  ];

  const processSteps = [
    { number: "01", title: "Kennismaking", description: "We bespreken jouw wensen en doelen. Geen verplichtingen." },
    { number: "02", title: "Offerte op maat", description: "Heldere offerte met duidelijke prijzen en planning." },
    { number: "03", title: "Design & bouw", description: "We bouwen je website met regelmatige updates." },
    { number: "04", title: "Live & support", description: "Je website gaat live en we blijven beschikbaar." },
  ];

  return (
    <>
      <SEOHead
        {...(lokaal
          ? { structuredData: [faqPage(lokaal.faq), dienstInPlaats({ plaats: region.name, url: paginaUrl })] }
          : {})}
        title={pageTitle}
        description={pageDescription}
        keywords={
          region.keywords?.join(", ") ||
          `webdesign ${region.name}, website laten maken ${region.name}, webshop ${region.name}`
        }
        canonicalUrl={`${companyInfo.url}/werkgebied/${region.slug}`}
        breadcrumbs={[
          { name: "Home", url: companyInfo.url },
          { name: "Werkgebied", url: `${companyInfo.url}/werkgebied` },
          { name: region.name, url: `${companyInfo.url}/werkgebied/${region.slug}` },
        ]}
      />


      <main className="min-h-screen bg-background">
        <LandingHero
          h1={`Website laten maken in ${region.name} vanaf €${PRIJZEN.starter}`}
          subtitle={lokaal?.intro ?? getIntroText()}
          kruimels={
            <Breadcrumb
              items={[
                { label: "Werkgebied", path: "/werkgebied" },
                { label: region.name, path: `/werkgebied/${region.slug}` },
              ]}
            />
          }
          knoppen={
            <>
              <AnimatedButton to="/contact" className="h-12 w-full sm:w-auto">
                Gratis kennismaken
              </AnimatedButton>
              <AnimatedButton
                href={`tel:${companyInfo.phone.replace(/\s/g, "")}`}
                variant="outline"
                showArrow={false}
                className="h-12 w-full sm:w-auto"
              >
                <Phone className="mr-2 inline h-4 w-4" />
                {companyInfo.phone}
              </AnimatedButton>
            </>
          }
        />

        {/* West-Friesland hub: de dorpen zonder eigen pagina (hun oude
            /werkgebied-pagina's 301'en hierheen) en de plaatsen met een eigen pagina. */}
        {region.slug === "west-friesland" && (
          <TekstBlok kop="Websites in elke West-Friese kern">
            <Alinea tekst="Ons werkgebied omvat ook de dorpen: Bovenkarspel, Hoogkarspel, Andijk, Venhuizen, Hem, Hauwert en Zwaagdijk. Voor ondernemers daar gelden dezelfde prijzen, dezelfde werkwijze en dezelfde levertijd als op deze pagina. We werken voornamelijk online. Spreken we elkaar liever in het echt? Dan komen we bij je langs." />
            <Alinea tekst="Voor de grotere plaatsen in en rond West-Friesland is er een uitgebreide pagina met prijzen, werkwijze en voorbeelden: [website laten maken in Hoorn](/werkgebied/hoorn), [website laten maken in Medemblik](/website-laten-maken-medemblik), [website laten maken in Heerhugowaard](/website-laten-maken-heerhugowaard) en [website laten maken in Alkmaar](/website-laten-maken-alkmaar). Ons eigen kantoor staat in Enkhuizen: lees over [website laten maken in Enkhuizen](/website-laten-maken-enkhuizen)." />
          </TekstBlok>
        )}

        {/* Lokaal blok: handgeschreven per plaats (src/data/werkgebiedLokaal.ts) */}
        {lokaal && (
          <TekstBlok kop={lokaal.lokaal.h2}>
            {lokaal.lokaal.alineas.map((alinea, idx) => (
              <Alinea key={idx} tekst={alinea} />
            ))}
          </TekstBlok>
        )}

        {lokaal?.secties && <LokaleSecties secties={lokaal.secties} seed={region.slug} cases={lokaal.cases} />}
        <TodoBlok items={lokaal?.todo} />

        {!eigenOpbouw && (
          <>
            {/* Diensten */}
            <BenefitList
              h2={`Meer klanten met een website die werkt in ${region.name}`}
              intro={`Complete webdesign oplossingen voor ondernemers in ${region.name}.`}
              items={services.map((service) => ({ h3: service.title, text: service.description }))}
              beeld={0}
              links={false}
            />

            {/* Waarom Nieuwblik */}
            <BenefitList
              h2={`Waarom ondernemers in ${region.name} voor Nieuwblik kiezen`}
              intro={
                isLocal
                  ? `We zijn lokaal gevestigd en kennen de regio ${region.name} goed.`
                  : `Ook vanuit ${region.name} kun je rekenen op onze expertise.`
              }
              items={whyPoints.map((point) => ({ h3: point.title, text: point.text }))}
              beeld={1}
            >
              <BlokVinkjes
                items={[
                  `Binnen ${LEVERTIJD.standaard} live met je nieuwe website`,
                  isLocal ? `Persoonlijk contact - we zitten vlakbij` : `Persoonlijke service, ook op afstand`,
                  `Transparante prijzen zonder verborgen kosten`,
                  `Mobiel-geoptimaliseerd voor al je klanten`,
                  `Gratis SEO-scan van je huidige website`,
                  `Continue ondersteuning na oplevering`,
                ]}
              />
            </BenefitList>
          </>
        )}

        {/* Portfolio */}
        <section className="bg-background py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mb-12 max-w-4xl md:mb-16">
              <h2 className="pf-inleiding">Bekijk websites die bezoekers omzetten in klanten</h2>
              <p className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-muted-foreground">
                Een selectie van recente projecten waar we trots op zijn.
              </p>
            </div>
            <CaseGrid projects={featuredProjects} />
            <div className="mt-12">
              <AnimatedButton to="/portfolio" size="lg" variant="outline">
                Bekijk alle projecten
              </AnimatedButton>
            </div>
          </div>
        </section>

        {!eigenOpbouw && (
          <TekstBlok kop={`Binnen ${LEVERTIJD.standaard} live in vier heldere stappen`}>
            <p>Van eerste gesprek tot live website in 4 stappen</p>
            <ol className="!mt-8 border-t border-border">
              {processSteps.map((step) => (
                <li key={step.number} className="border-b border-border py-6">
                  <h3 className="text-xl font-semibold leading-snug text-foreground md:text-2xl">{step.title}</h3>
                  <p className="mt-2 text-base font-normal leading-relaxed text-muted-foreground">{step.description}</p>
                </li>
              ))}
            </ol>
          </TekstBlok>
        )}

        {lokaal && (
          <LandingFaq h2={`Veelgestelde vragen over een website in ${region.name}`} items={lokaal.faq} />
        )}

        {/* In de buurt: de omliggende plaatsen als link, als er een pagina voor
            is (werkgebied of landelijke stadspagina). Zonder dit blok waren
            sommige werkgebiedpagina's alleen via /werkgebied te vinden. */}
        {buren.length > 0 && (
          <section className="bg-background py-16 md:py-20">
            <div className="container mx-auto px-4 sm:px-6">
              <h2 className="mb-6 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">In de buurt</h2>
              <div className="flex flex-wrap gap-3">
                {buren.map((b) => (
                  <Link
                    key={b.to}
                    to={b.to}
                    className="group inline-flex items-center gap-2 rounded-xl border border-border px-4 py-3 transition-colors hover:border-accent/40 hover:bg-accent/5"
                  >
                    <MapPin className="h-4 w-4 text-accent opacity-70 group-hover:opacity-100" />
                    <span className="text-sm font-semibold text-foreground">{b.naam}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
};

export default WerkgebiedDetail;
