import { companyInfo, localBusinessJsonLd, organizationJsonLd, websiteJsonLd } from "@/config/company";
import { SITE_URL } from "@/config/site";

/**
 * Eén JSON-LD-blok per pagina, als één @graph.
 *
 * Voorheen kwam structured data uit drie bronnen die elkaar overlapten: de root
 * zette Organization, WebSite en ProfessionalService, SEOHead zette Organization
 * en WebSite nogmaals, en pagina's plus LandingFaq voegden hun eigen blokken toe.
 * Op /website-laten-maken stond de FAQPage daardoor twee keer.
 *
 * Nu bouwt alleen SEOHead de graph, server-side gerenderd. De site-entiteiten
 * staan er één keer in met een vast @id; pagina's verwijzen daarnaar in plaats
 * van Nieuwblik opnieuw te beschrijven.
 */

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const BUSINESS_ID = `${SITE_URL}/#localbusiness`;

type Node = Record<string, unknown>;

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/** Deze typen horen bij de site zelf en komen alleen uit siteEntities(). */
const SITE_TYPES = new Set(["Organization", "WebSite", "ProfessionalService", "LocalBusiness"]);

const withoutContext = ({ "@context": _context, ...rest }: Node): Node => rest;

function siteEntities(): Node[] {
  return [
    withoutContext(organizationJsonLd),
    withoutContext(websiteJsonLd),
    // Bewust geen aggregateRating: Google toont geen reviewsterren voor reviews
    // die een bedrijf over zichzelf op de eigen site zet, en een afwijkend cijfer
    // kan een handmatige maatregel opleveren.
    { ...withoutContext(localBusinessJsonLd), parentOrganization: { "@id": ORGANIZATION_ID } },
  ];
}

const typesOf = (node: Node): string[] => {
  const t = node["@type"];
  return Array.isArray(t) ? t.map(String) : t ? [String(t)] : [];
};

/**
 * Vervangt geneste beschrijvingen van Nieuwblik zelf door een @id-verwijzing
 * en haalt @context weg uit geneste nodes.
 */
function normalize(value: unknown, nested: boolean): unknown {
  if (Array.isArray(value)) return value.map((v) => normalize(v, true));
  if (!value || typeof value !== "object") return value;
  const node = value as Node;
  const types = typesOf(node);
  if (nested && node["name"] === companyInfo.name && types.some((t) => SITE_TYPES.has(t))) {
    return { "@id": types.includes("Organization") ? ORGANIZATION_ID : BUSINESS_ID };
  }
  const out: Node = {};
  for (const [key, v] of Object.entries(node)) {
    if (key === "@context") continue;
    out[key] = normalize(v, true);
  }
  return out;
}

/** Pagina-data mag een losse node, een lijst of een eigen @graph zijn. */
function flatten(data: unknown): Node[] {
  if (!data) return [];
  if (Array.isArray(data)) return data.flatMap(flatten);
  const node = data as Node;
  if (Array.isArray(node["@graph"])) return (node["@graph"] as unknown[]).flatMap(flatten);
  return [node];
}

function breadcrumbList(items: BreadcrumbItem[]): Node {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildGraph({ breadcrumbs, pageData }: { breadcrumbs: BreadcrumbItem[]; pageData?: unknown }): Node {
  const graph: Node[] = [...siteEntities(), breadcrumbList(breadcrumbs)];
  const seen = new Set(graph.flatMap(typesOf));

  for (const raw of flatten(pageData)) {
    const types = typesOf(raw);
    // Site-entiteiten en BreadcrumbList komen al uit de basis.
    if (types.some((t) => SITE_TYPES.has(t) || t === "BreadcrumbList")) continue;
    // Elk type precies één keer per pagina.
    if (types.some((t) => seen.has(t))) continue;
    types.forEach((t) => seen.add(t));
    graph.push(normalize(raw, false) as Node);
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

/** FAQPage-node uit vraag/antwoord-paren. */
export function faqPage(items: { q: string; a: string }[]): Node {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}
