import { createFileRoute } from "@tanstack/react-router";

import Dienstpagina from "@/pages/Dienstpagina";
import { wordpress as d } from "@/data/dienstpaginas";
import { buildHead } from "@/lib/seo";
import { companyInfo } from "@/config/company";

export const Route = createFileRoute("/_public/overstappen-van-wordpress")({
  head: () =>
    buildHead({ title: d.title, description: d.description, keywords: d.keywords, canonical: `${companyInfo.url}/${d.slug}` }),
  component: () => <Dienstpagina data={d} />,
});
