/**
 * Paginatitel van een blogartikel, voor de route-head (SSR) en SEOHead.
 * "| Nieuwblik" alleen als de titel dan nog in Google past (±65 tekens) en de
 * naam er niet al in staat. Nooit afkappen met "…": dat oogt in de
 * zoekresultaten slechter dan een titel die Google zelf inkort.
 */
export function blogTitel(post: {
  seoTitle?: string;
  title: { nl: string };
}): string {
  const basis = post.seoTitle || post.title.nl;
  const metMerk = `${basis} | Nieuwblik`;
  return /nieuwblik/i.test(basis) || metMerk.length > 65 ? basis : metMerk;
}
