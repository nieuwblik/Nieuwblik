import { useEffect } from "react";

import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { AnimatedButton } from "@/components/ui/animated-button";
import { meetAanvraag } from "@/lib/consent";
import justinImage from "@/assets/justin-slok.webp";

/**
 * Eigen bedankpagina voor de analyse, in de opmaak van /bedankt: de conversie
 * in Google Ads hoort bij dit adres. Alleen na een echte aanvraag telt hij mee,
 * dus niet bij herladen of als iemand hier rechtstreeks komt.
 */
const BedanktAnalyse = () => {
  useEffect(() => {
    try {
      if (window.sessionStorage.getItem("analyseVerstuurd") !== "1") return;
      window.sessionStorage.removeItem("analyseVerstuurd");
    } catch {
      return;
    }
    meetAanvraag("website-analyse");
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Bedankt voor je aanvraag | Nieuwblik"
        description="We hebben je aanvraag voor de gratis website-analyse ontvangen."
        noIndex={true}
        includeOrganizationSchema={false}
      />
      <section className="pb-20 pt-32 md:pb-32 md:pt-40">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-4xl text-center">
            <img
              src={justinImage}
              alt="Justin Slok"
              width="192"
              height="192"
              loading="eager"
              className="mx-auto mb-8 h-48 w-48 rounded-full object-cover shadow-lg"
            />
            <h1 className="text-display mb-6">Bedankt voor je aanvraag</h1>
            <p className="mx-auto mb-12 max-w-2xl text-xl font-light text-muted-foreground md:text-2xl">
              We hebben je aanvraag ontvangen. Binnen 1 werkdag krijg je je analyse per mail.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <AnimatedButton to="/portfolio" size="lg">
                Bekijk Portfolio
              </AnimatedButton>
              <AnimatedButton to="/" size="lg" variant="outline">
                Terug naar Home
              </AnimatedButton>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BedanktAnalyse;
