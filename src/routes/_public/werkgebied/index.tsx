import { createFileRoute } from "@tanstack/react-router";

import Werkgebied from "@/pages/Werkgebied";
import { buildHead } from "@/lib/seo";
import { companyInfo } from "@/config/company";

export const Route = createFileRoute("/_public/werkgebied/")({
  head: () =>
    buildHead({
      title: "Ons Werkgebied | Webdesign door heel Nederland - Nieuwblik",
      description:
        "Nieuwblik is actief in heel Nederland. Van Enkhuizen tot Amsterdam, van kleine dorpen tot grote steden. Bekijk waar wij jouw website kunnen realiseren.",
      keywords:
        "webdesign Nederland, website laten maken, werkgebied, lokale webdesigner, West-Friesland",
      canonical: `${companyInfo.url}/werkgebied`,
    }),
  component: Werkgebied,
});
