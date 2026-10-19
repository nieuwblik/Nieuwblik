import { createFileRoute } from "@tanstack/react-router";

import SeoStad from "@/pages/SeoStad";
import { seoNoordHolland as d } from "@/data/seoSteden";
import { buildHead } from "@/lib/seo";
import { companyInfo } from "@/config/company";

export const Route = createFileRoute("/_public/seo-noord-holland")({
  head: () =>
    buildHead({ title: d.title, description: d.description, keywords: d.keywords, canonical: `${companyInfo.url}/${d.slug}` }),
  component: () => <SeoStad data={d} />,
});
