import { PRIJZEN, LEVERTIJD, euroTeken } from "@/config/business";
import { faqPage } from "@/lib/structured-data";
import { SITE_URL } from "@/config/site";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import Reveal from "@/components/Reveal";
import ProjectCard from "@/components/ProjectCard";
import { AnimatedButton } from "@/components/ui/animated-button";
import { ShoppingCart, CreditCard, BarChart3 } from "lucide-react";
import {
  DienstHero,
  GroenPaneel,
  Inbegrepen,
  Pijlers,
  Quote,
  Sectie,
  SectieKop,
  Stappen,
  Vragen,
} from "@/components/dienst/DienstBlokken";

// Project images for webshop cases
import puurinharmonieImg from "@/assets/puurinharmonie.webp";
import kyodaiImg from "@/assets/projects/kyodaioriginals.nl.webp";
import bushidoImg from "@/assets/bushidoshop-portfolio-nieuw.webp";

const cases = [
  {
    title: "Puur in Harmonie",
    category: "Salon & E-commerce",
    description: "Webshop met Stripe integratie voor een holistische salon. Klanten bestellen eenvoudig producten online.",
    image: puurinharmonieImg,
    url: "https://puurinharmonie.nl",
    tags: ["WooCommerce", "Stripe", "E-commerce"]
  },
  {
    title: "Kyodai Originals",
    category: "Fashion & Streetwear",
    description: "Stijlvolle webshop voor een streetwear merk met complete productcatalogus en veilige betalingen.",
    image: kyodaiImg,
    url: "https://kyodaioriginals.nl",
    tags: ["E-commerce", "Fashion", "Webshop"]
  },
  {
    title: "Bushido Shop",
    category: "Martial Arts & Sport",
    description: "Complete e-commerce oplossing voor martial arts producten met uitgebreid voorraadbeheer en verzendopties.",
    image: bushidoImg,
    url: "https://bushidoshop.nl",
    tags: ["E-commerce", "Sport", "Webshop"]
  }
];

const Webshops = () => {
  const usps = [
  {
    icon: ShoppingCart,
    title: "Gebruiksvriendelijk",
    subtitle: "Makkelijk bestellen",
    description: "Intuïtieve checkout flow die bezoekers moeiteloos door het aankoopproces leidt met minimale klikken."
  },
  {
    icon: CreditCard,
    title: "Veilige betalingen",
    subtitle: "iDEAL, Klarna & meer",
    description: "Alle populaire betaalmethoden geïntegreerd met bankniveau beveiliging voor zorgeloos winkelen."
  },
  {
    icon: BarChart3,
    title: "Groei & inzichten",
    subtitle: "Data-gedreven verkoop",
    description: "Realtime dashboards tonen conversies, bestsellers en klantgedrag voor slimme beslissingen."
  }];


  const steps = [
  {
    title: "Strategie & producten",
    description: "We analyseren jouw markt, doelgroep en producten om de perfecte webshop strategie te bepalen."
  },
  {
    title: "Design & branding",
    description: "Een luxe, conversiegerichte webshop die jouw merk versterkt en vertrouwen wekt bij klanten."
  },
  {
    title: "Technische setup",
    description: "Complete configuratie van betalingen, verzending, voorraad en automatiseringen."
  },
  {
    title: "Lancering & groei",
    description: "Live gaan met SEO-optimalisatie en continue ondersteuning voor maximale verkoop."
  }];


  const includedStandard = [
  "Volledig responsive webshop design",
  "Productcatalogus met varianten",
  "Veilige checkout met iDEAL & Klarna",
  "Voorraadbeheer systeem",
  "Automatische orderbevestigingen",
  "SEO-geoptimaliseerde productpagina's",
  "Google Analytics e-commerce tracking",
  "SSL-certificaat & beveiliging"];


  const optionalModules = [
  "Koppeling met boekhoudpakket",
  "Dropshipping integratie",
  "Loyalty programma",
  "Abandoned cart e-mails",
  "Product reviews systeem",
  "Meertalige webshop"];


  const faqs = [
  {
    question: "Hoe lang duurt het om een webshop te bouwen?",
    answer: `Een standaard webshop is binnen ${LEVERTIJD.standaard} live. Complexere shops met veel producten of custom functionaliteit kunnen ${LEVERTIJD.complex} duren.`
  },
  {
    question: "Welke betaalmethoden worden ondersteund?",
    answer: "Alle populaire methoden: iDEAL, creditcard, Bancontact, Klarna, PayPal en meer. We configureren alles voor jou."
  },
  {
    question: "Kan ik zelf producten toevoegen en beheren?",
    answer: "Absoluut! Je krijgt een gebruiksvriendelijk dashboard waar je zelfstandig producten, prijzen en voorraad kunt beheren."
  },
  {
    question: "Wat kost een professionele webshop?",
    answer: `Webshops starten vanaf ${euroTeken(PRIJZEN.webshopVanaf)}. De exacte prijs hangt af van het aantal producten, functionaliteiten en integraties die je nodig hebt.`
  }];


  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Professionele webshops - Nieuwblik",
    "provider": {
      "@type": "Organization",
      "name": "Nieuwblik",
      "url": SITE_URL
    },
    "serviceType": "Webshop Development",
    "description": "Professionele webshops die verkopen. Veilige betalingen, voorraadbeheer en conversiegerichte designs.",
    "areaServed": "Nederland",
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "priceCurrency": "EUR",
      "price": String(PRIJZEN.webshopVanaf)
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Webshop Laten Maken Enkhuizen | E-commerce West-Friesland"
        description={`Webshop laten maken in Enkhuizen? Professionele webshops met iDEAL, Klarna en voorraadbeheer. Webshop bureau West-Friesland. Vanaf ${euroTeken(PRIJZEN.webshopVanaf)}.`}
        keywords="webshop laten maken Enkhuizen, e-commerce West-Friesland, online winkel, webshop bouwen, WooCommerce, Shopify, webshop Enkhuizen"
        canonicalUrl={`${SITE_URL}/diensten/webshops`}
        structuredData={[structuredData, faqPage(faqs.map((f) => ({ q: f.question, a: f.answer })))]}
        breadcrumbs={[
        { name: "Home", url: SITE_URL },
        { name: "Diensten", url: `${SITE_URL}/diensten` },
        { name: "Webshops", url: `${SITE_URL}/diensten/webshops` }]
        } />
      


      <DienstHero
        kruimels={[
          { label: "Diensten", path: "/diensten" },
          { label: "Webshops", path: "/diensten/webshops" },
        ]}
        titel="Webshops"
        accent="die verkopen terwijl jij slaapt"
        intro={<>
          Van eerste bezoeker tot terugkerende klant. Wij bouwen webshops die converteren
          met veilige betalingen, slim voorraadbeheer en een koopervaring die klanten niet vergeten.
        </>}
        knop={{ label: "Start jouw webshop", to: "/contact" }}
      />

      <Sectie papier>
        <SectieKop titel="Waarom kiezen voor onze webshops?" intro="Alles wat je nodig hebt om succesvol online te verkopen" />
        <Pijlers items={usps} />
      </Sectie>

      <Sectie>
        <SectieKop titel="Zo bouwen wij jouw webshop" intro="Van idee tot verkopende webshop in vier stappen" />
        <Stappen items={steps} />
      </Sectie>

      <Sectie papier>
        <SectieKop titel="Wat zit er in jouw webshop?" intro="Complete webshop oplossing zonder verborgen kosten" />
        <Inbegrepen
          standaardTitel="Standaard inbegrepen"
          standaard={includedStandard}
          extraTitel="Optionele uitbreidingen"
          extra={optionalModules}
        />
      </Sectie>

      <GroenPaneel
        titel="Klaar om online te verkopen?"
        tekst={<>Laten we bespreken hoe jouw webshop eruit moet zien. Webshops vanaf {euroTeken(PRIJZEN.webshopVanaf)}.</>}
        knop={{ label: "Vraag een offerte aan", to: "/contact" }}
      />

      <Sectie>
        <SectieKop titel="Recente webshop projecten" intro="Bekijk enkele van onze succesvolle e-commerce projecten" />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {cases.map((project, index) => (
            <Reveal key={project.title} afstand={24} delay={index * 0.08}>
              <ProjectCard
                title={project.title}
                category={project.category}
                description={project.description}
                image={project.image}
                url={project.url}
                tags={project.tags}
              />
            </Reveal>
          ))}
        </div>
        <div className="mt-12">
          <AnimatedButton to="/portfolio" size="lg" variant="outline">
            Bekijk alle projecten
          </AnimatedButton>
        </div>
      </Sectie>

      <Sectie papier>
        <SectieKop titel="Veelgestelde vragen" intro="Alles wat je wilt weten over onze webshops" />
        <Vragen items={faqs} />
      </Sectie>

      <Sectie>
        <Quote
          tekst="Onze webshop draait nu volledig automatisch. Orders komen binnen, betalingen worden verwerkt en klanten krijgen automatisch hun verzendinfo. Echt ontzorgd!"
          naam="Tevreden webshop klant"
        />
      </Sectie>

      <Footer />
    </div>
  );
};

export default Webshops;
