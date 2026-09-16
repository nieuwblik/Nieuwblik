import { SITE_URL } from "@/config/site";
import { createFileRoute } from "@tanstack/react-router";

import GratisWebsiteAnalyse from "@/pages/GratisWebsiteAnalyse";
import { buildHead } from "@/lib/seo";

export const Route = createFileRoute("/_public/gratis-website-analyse")({
  head: () =>
    buildHead({
      title: "Gratis Website-Analyse | Nieuwblik Enkhuizen",
      description:
        "Vraag een gratis website-analyse aan en ontdek in 24 uur waar jouw website kansen laat liggen op snelheid, vindbaarheid en conversie.",
      keywords: "gratis website analyse, website check, SEO scan, website laten checken",
      canonical: `${SITE_URL}/gratis-website-analyse`,
    }),
  component: GratisWebsiteAnalyse,
});
