import { SITE_URL } from "@/config/site";
import { LEVERTIJD, PRIJZEN, euroTeken } from "@/config/business";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import PricingPackages from "@/components/PricingPackages";
import { DienstHero } from "@/components/dienst/DienstBlokken";

export const PRIJZEN_TITEL = `Prijzen website laten maken | Vanaf ${euroTeken(PRIJZEN.starter)} - Nieuwblik`;
export const PRIJZEN_OMSCHRIJVING = `Prijzen van Nieuwblik: Starter ${euroTeken(PRIJZEN.starter)}, Professional vanaf ${euroTeken(PRIJZEN.professional)} of maatwerk op aanvraag. Vaste prijs vooraf, levertijd vanaf ${LEVERTIJD.starter}.`;

/**
 * Prijzenpagina: de pakketten die eerst op de homepage stonden, met een eigen
 * kop in de stijl van de dienstpagina's.
 */
const Prijzen = () => (
  <div className="min-h-screen bg-background">
    <SEOHead
      title={PRIJZEN_TITEL}
      description={PRIJZEN_OMSCHRIJVING}
      canonicalUrl={`${SITE_URL}/prijzen`}
      breadcrumbs={[
        { name: "Home", url: SITE_URL },
        { name: "Prijzen", url: `${SITE_URL}/prijzen` },
      ]}
    />

    <DienstHero
      kruimels={[{ label: "Prijzen", path: "/prijzen" }]}
      titel="Heldere prijzen,"
      accent="zonder verrassingen"
      intro={
        <>
          Je weet vooraf waar je aan toe bent. Een complete website vanaf {euroTeken(PRIJZEN.starter)}, binnen{" "}
          {LEVERTIJD.standaard} online.
        </>
      }
      knop={{ label: "Vraag een offerte aan", to: "/contact" }}
    />

    <PricingPackages />

    {/* /prijzen is de pakketpagina; de verwijzing naar de gids over wat een
        website kost staat onder de pakketten (PricingPackages). */}

    <Footer />
  </div>
);

export default Prijzen;
