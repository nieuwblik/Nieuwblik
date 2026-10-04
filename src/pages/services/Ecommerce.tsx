import { useState } from "react";
import { faqPage } from "@/lib/structured-data";
import { SITE_URL } from "@/config/site";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import Reveal from "@/components/Reveal";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Image, Package, BookOpen } from "lucide-react";
import {
  DienstHero,
  GroenPaneel,
  INKT_65,
  Inbegrepen,
  Pijlers,
  Quote,
  RAND,
  Sectie,
  SectieKop,
  Stappen,
  Vragen,
} from "@/components/dienst/DienstBlokken";

// Import e-commerce listing images
import kattenbakListingImg from "@/assets/projects/kattenbak-listing.webp";
import hamburgerPressListingImg from "@/assets/projects/hamburger-press-listing.webp";
import schoenenWolListingImg from "@/assets/projects/schoenen-wol-listing.webp";
import pastamachineListingImg from "@/assets/projects/pastamachine-listing.webp";
import compressorListingImg from "@/assets/projects/compressor-listing.webp";

const Ecommerce = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const ecommerceListings = [
    {
      title: "Kattenbak - Movendo",
      description: "Professionele Amazon product listing met complete USP's en feature highlights.",
      image: kattenbakListingImg,
    },
    {
      title: "Q-mate - Drogerballen",
      description: "Aantrekkelijke listing voor duurzame drogerballen met focus op kwaliteit.",
      image: hamburgerPressListingImg,
    },
    {
      title: "Hamburgerpers - Kitchenz",
      description: "Visueel sterke Amazon listing met duidelijke voordelen en gebruiksgemak.",
      image: schoenenWolListingImg,
    },
    {
      title: "Pastamachine - Kitchenz",
      description: "Complete product story voor premium pastamachines met gedetailleerde features.",
      image: pastamachineListingImg,
    },
    {
      title: "Compressor - Grobbie",
      description: "Technische product listing met focus op specificaties en toepassingen.",
      image: compressorListingImg,
    }
  ];

  const usps = [{
    icon: Image,
    title: "Professionele listings",
    subtitle: "Visueel verkopen",
    description: "Wij maken overtuigende product listings voor Amazon, Bol.com en andere marketplaces die je conversie verhogen."
  }, {
    icon: Package,
    title: "Productverpakkingen",
    subtitle: "Premium uitstraling",
    description: "Van concept tot print-ready ontwerp: verpakkingen die opvallen in het schap én bij de klant thuis."
  }, {
    icon: BookOpen,
    title: "Extra waarde producten",
    subtitle: "E-books & meer",
    description: "Creëer aanvullende producten zoals e-books, handleidingen en digital downloads die je marge verhogen."
  }];

  const steps = [{
    title: "Briefing & research",
    description: "We analyseren je product, doelgroep en concurrentie voor de beste aanpak."
  }, {
    title: "Concept & design",
    description: "Eerste concepten voor listings, verpakkingen of e-books ter beoordeling."
  }, {
    title: "Revisierondes",
    description: "Feedback verwerken tot je 100% tevreden bent met het eindresultaat."
  }, {
    title: "Oplevering",
    description: "Alle bestanden in de juiste formaten, klaar voor upload of productie."
  }];

  const includedStandard = ["Professionele product listings", "Marketplace-ready afbeeldingen", "Conversiegerichte productbeschrijvingen", "A+ content / Enhanced Brand Content", "Productverpakking design", "E-books en digital downloads", "Print-ready bestanden", "Revisierondes inbegrepen"];
  const optionalModules = ["3D product visualisaties", "Video productpresentaties", "Lifestyle fotografie", "Meertalige listings", "Brandbook & richtlijnen", "Maandelijkse optimalisatie"];

  const faqs = [{
    question: "Wat maken jullie precies voor e-commerce?",
    answer: "Wij maken professionele product listings (tekst + afbeeldingen), productverpakkingen en extra waarde producten zoals e-books. De webshop, verkoop en logistiek regel je zelf."
  }, {
    question: "Kunnen jullie ook mijn hele webshop bouwen?",
    answer: "Voor complete webshops verwijzen we je naar onze Webshops dienst. Hier focussen we puur op de content die je producten laat verkopen."
  }, {
    question: "Hoe lang duurt het om een listing te maken?",
    answer: "Een complete product listing is meestal binnen 1-2 weken klaar, inclusief revisierondes. Bij grotere aantallen maken we een passende planning."
  }, {
    question: "Leveren jullie print-ready bestanden?",
    answer: "Ja! Verpakkingsdesigns leveren we altijd print-ready aan, inclusief de juiste snijmarges en kleurprofielen voor jouw drukker."
  }];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "E-commerce oplossingen - Nieuwblik",
    "provider": {
      "@type": "Organization",
      "name": "Nieuwblik",
      "url": SITE_URL
    },
    "serviceType": "E-commerce Strategy & Development",
    "description": "Complete e-commerce oplossingen: multichannel verkoop, marketplace integraties, marketing automation en conversie-optimalisatie.",
    "areaServed": "Nederland"
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="E-commerce & Product Listings | Verkoop meer online - Nieuwblik"
        description="Professionele Amazon & Bol.com listings, verpakkingsdesign en e-books. Verhoog je online zichtbaarheid en conversie. E-commerce specialist West-Friesland."
        keywords="e-commerce Enkhuizen, Amazon listings, Bol.com verkopen, product fotografie, verpakkingsdesign, conversie optimalisatie West-Friesland"
        canonicalUrl={`${SITE_URL}/diensten/e-commerce`}
        structuredData={[structuredData, faqPage(faqs.map((f) => ({ q: f.question, a: f.answer })))]}
        breadcrumbs={[
          { name: "Home", url: SITE_URL },
          { name: "Diensten", url: `${SITE_URL}/diensten` },
          { name: "E-commerce", url: `${SITE_URL}/diensten/e-commerce` }
        ]}
      />


      <DienstHero
        kruimels={[
          { label: "Diensten", path: "/diensten" },
          { label: "E-commerce", path: "/diensten/e-commerce" },
        ]}
        titel="E-commerce"
        accent="die echt groeit"
        intro={<>
          Wij maken professionele product listings, verpakkingsdesigns en extra waarde producten zoals e-books.
          De verkoop, logistiek en klantenservice? Dat is voor jou, wij focussen op wat je verkoopt.
        </>}
        kader={<>
          <strong className="font-semibold sw-ink">Onze focus:</strong> Wij creëren de visuele en tekstuele content die jouw producten laat verkopen.
          De webshop, marketplace accounts, fulfillment en klantcontact regel jij zelf of via een andere partner.
        </>}
        knop={{ label: "Bespreek je groeikansen", to: "/contact" }}
      />

      <Sectie papier>
        <SectieKop titel="Waarom onze e-commerce aanpak werkt" intro="Geen losse projecten, maar een strategie voor duurzame groei" />
        <Pijlers items={usps} />
      </Sectie>

      <Sectie>
        <SectieKop titel="Onze e-commerce projecten" intro="Professionele listings die daadwerkelijk verkopen" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ecommerceListings.map((listing, index) => (
            <Reveal key={listing.title} afstand={24} delay={(index % 3) * 0.08}>
              <button
                type="button"
                onClick={() => setSelectedImage(listing.image)}
                className="group block w-full text-left"
                aria-label={`${listing.title}: bekijk groter`}
              >
                <span className="relative mb-4 block aspect-[4/3] overflow-hidden rounded-2xl border bg-white" style={{ borderColor: RAND }}>
                  <img
                    src={listing.image}
                    alt={listing.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <span className="absolute bottom-3 right-3 rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-medium opacity-0 shadow-sm transition-opacity duration-300 group-hover:opacity-100 sw-ink">
                    Bekijk groter
                  </span>
                </span>
                <span className="block text-lg font-bold tracking-tight sw-ink">{listing.title}</span>
                <span className="mt-1 block text-[0.9375rem] font-light leading-relaxed" style={{ color: INKT_65 }}>
                  {listing.description}
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </Sectie>

      {/* Afbeelding groot bekijken */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-7xl w-[95vw] h-[95vh] p-0 overflow-hidden border-0">
          {selectedImage && (
            <img src={selectedImage} alt="E-commerce listing" className="h-full w-full object-contain" />
          )}
        </DialogContent>
      </Dialog>

      <Sectie papier>
        <SectieKop titel="Onze e-commerce aanpak" intro="Gestructureerd naar meetbare resultaten" />
        <Stappen items={steps} />
      </Sectie>

      <Sectie>
        <SectieKop titel="Wat we voor je regelen" intro="Complete e-commerce oplossingen op maat" />
        <Inbegrepen
          standaardTitel="Kernonderdelen"
          standaard={includedStandard}
          extraTitel="Uitbreidingen"
          extra={optionalModules}
        />
      </Sectie>

      <GroenPaneel
        titel="Klaar om je omzet te verdubbelen?"
        tekst="Plan een vrijblijvend strategiegesprek en ontdek de groeikansen voor jouw business."
        knop={{ label: "Plan een strategiegesprek", to: "/contact" }}
      />

      <Sectie>
        <SectieKop titel="Veelgestelde vragen" intro="Antwoorden op de meest voorkomende e-commerce vragen" />
        <Vragen items={faqs} />
      </Sectie>

      <Sectie papier>
        <Quote
          tekst="Door de multichannel aanpak van Nieuwblik zijn we nu ook succesvol op Bol.com en Amazon. Onze omzet is in 6 maanden met 140% gestegen!"
          naam="Maarten, Kitchenz"
        />
      </Sectie>

      <Footer />
    </div>
  );
};

export default Ecommerce;
