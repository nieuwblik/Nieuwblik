import { createFileRoute, notFound } from "@tanstack/react-router";

import LandingRouter from "@/pages/LandingRouter";
import NotFound from "@/pages/NotFound";
import { buildHead } from "@/lib/seo";
import { companyInfo } from "@/config/company";

const PREFIX = "website-laten-maken-";

export const Route = createFileRoute("/_public/$landingPath")({
  // Onbekende paden van één segment moeten een echte HTTP 404 geven, niet 200.
  // De stads- en branchedata wordt hier pas opgehaald: statisch geïmporteerd komt
  // die in de hoofdbundel, en die laadt elke bezoeker op elke pagina.
  loader: async ({ params }) => {
    if (!params.landingPath.startsWith(PREFIX)) throw notFound();
    const slug = params.landingPath.slice(PREFIX.length);
    const [{ getCityBySlug }, { getCityLokaal }, { getLandingMeta }, { getIndustryBySlug }] = await Promise.all([
      import("@/data/cities"),
      import("@/data/cityLokaal"),
      import("@/data/landingMeta"),
      import("@/data/industries"),
    ]);
    const city = getCityBySlug(slug);
    if (city) {
      // Handgeschreven tekst per stad gaat voor op de gegenereerde data.
      const lokaal = getCityLokaal(slug);
      const meta = getLandingMeta(slug);
      return {
        title: lokaal?.title ?? meta?.title ?? city.title,
        description: lokaal?.metaDescription ?? meta?.metaDescription ?? city.metaDescription,
      };
    }
    const industry = getIndustryBySlug(slug);
    if (industry) {
      const meta = getLandingMeta(slug);
      return {
        title: meta?.title ?? industry.title,
        description: meta?.metaDescription ?? industry.metaDescription,
      };
    }
    throw notFound();
  },
  head: ({ params, loaderData }) =>
    loaderData
      ? buildHead({ ...loaderData, canonical: `${companyInfo.url}/${params.landingPath}` })
      : buildHead({
          title: "Pagina Niet Gevonden | Nieuwblik Webdesign Enkhuizen",
          description:
            "Deze pagina bestaat niet of is verplaatst. Ga terug naar de homepage van Nieuwblik webdesign bureau in Enkhuizen.",
          keywords: "404, pagina niet gevonden, Nieuwblik Enkhuizen",
          noIndex: true,
        }),
  notFoundComponent: NotFound,
  component: LandingRouter,
});
