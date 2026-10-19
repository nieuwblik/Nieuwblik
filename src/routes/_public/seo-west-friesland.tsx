import { createFileRoute } from "@tanstack/react-router";

import SeoStad from "@/pages/SeoStad";
import { seoWestFriesland as d } from "@/data/seoSteden";
import { buildHead } from "@/lib/seo";
import { companyInfo } from "@/config/company";

export const Route = createFileRoute("/_public/seo-west-friesland")({
  head: () =>
    buildHead({ title: d.title, description: d.description, keywords: d.keywords, canonical: `${companyInfo.url}/${d.slug}` }),
  component: () => <SeoStad data={d} />,
});
