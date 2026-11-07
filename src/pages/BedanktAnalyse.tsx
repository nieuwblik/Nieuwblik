import { useEffect } from "react";

import SEOHead from "@/components/SEOHead";
import { AnimatedButton } from "@/components/ui/animated-button";
import { companyInfo } from "@/config/company";
import { meetAanvraag } from "@/lib/consent";
import justinImage from "@/assets/justin-slok.webp";

/**
 * Eigen bedankpagina voor de analyse: de conversie in Google Ads hoort bij dit
 * adres. Alleen na een echte aanvraag telt hij mee, dus niet bij herladen of
 * als iemand hier rechtstreeks komt.
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
    <div className="flex min-h-screen items-center bg-background">
      <SEOHead
        title="Bedankt voor je aanvraag | Nieuwblik"
        description="We hebben je aanvraag voor de gratis website-analyse ontvangen."
        noIndex={true}
        includeOrganizationSchema={false}
      />
      <main className="container mx-auto max-w-2xl px-6 py-16 text-center">
        <img
          src={justinImage}
          alt="Justin Slok"
          width="112"
          height="112"
          className="mx-auto mb-6 h-28 w-28 rounded-full object-cover"
        />
        <h1 className="text-[2.1rem] font-extrabold leading-[1.05] tracking-tight md:text-[3.15rem]">
          Bedankt voor je aanvraag
        </h1>
        <p className="mt-4 text-lg font-light text-muted-foreground">
          We hebben je aanvraag ontvangen. Binnen 1 werkdag krijg je je analyse per mail.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <AnimatedButton to="/portfolio" size="lg">
            Bekijk ons werk
          </AnimatedButton>
          <a
            href={companyInfo.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground underline underline-offset-4"
          >
            Vraag? Stuur ons een appje
          </a>
        </div>
      </main>
    </div>
  );
};

export default BedanktAnalyse;
