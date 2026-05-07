# Plan: 60 unieke SEO landingspagina's

## Strategie

Geen 60 losse `.tsx` files, maar **2 dynamische templates** die hun volledige content uit centrale data files halen. Zo blijft elke pagina volledig uniek qua tekst (titles, H1, H2, H3, bodyteksten, FAQ's, contactblok-koppen) terwijl de structuur en performance consistent blijft. 60 losse files zou de bundle opblazen en onderhoud onmogelijk maken; 1 template per groep met data-driven content levert hetzelfde SEO-resultaat (Google ziet 60 unieke URLs met 60 unieke teksten).

## Bestanden

### Nieuwe data files (volledige unieke content)

**`src/data/cities.ts`** — array van 30 steden, elk object bevat:
```ts
{
  slug, name,
  title,            // unieke title tag (≤60 chars)
  metaDescription,  // unieke meta (≤155 chars)
  h1,               // unieke H1
  heroSubtitle,     // 2 unieke zinnen
  section1: { h2, body, benefits: [{h3, text}, x3] },
  section2H2,       // unieke H2 vergelijkingssectie
  section3H2,       // unieke H2 reviews
  section4: { h2, intro }, // portfolio
  faq: { h2, items: [{q, a}, x4] },  // elk antwoord ≥40 woorden
  contactBlock: { h2, body },
  internalLinks: string  // unieke alinea met links naar /diensten /portfolio /contact
}
```

**`src/data/industries.ts`** — array van 30 branches, identieke shape met:
- `section1.needs: [{h3, text}, x4-6]` ipv benefits
- `internalLinks` linkt naar /diensten /portfolio /over-ons (volgens spec)

Ik schrijf alle 60 records met **volledig unieke teksten**. Geen enkele zin, H1, H2, H3, FAQ-vraag of bodytekst komt twee keer voor over alle 60 pagina's. Ik zorg dat:
- 60 unieke title tags
- 60 unieke meta descriptions  
- 60 unieke H1's
- 60 × ~6 unieke H2's = 360 unieke H2's
- 60 × ~7 unieke H3's = 420 unieke H3's
- 60 × 4 = 240 unieke FAQ-paren met antwoorden ≥40 woorden
- 60 unieke contactblok H2's + bodyteksten
- 60 unieke interne linkparagraphs

### Nieuwe templates

**`src/pages/CityLanding.tsx`**: leest `slug` uit `useParams`, zoekt city in `cities.ts`, rendert volledige pagina. Hergebruikt:
- Identieke hero-layout van `Index.tsx` (HeroImage met Justin/Job foto + "Strategie-Gedreven" badge + "Start je project" floating button + "Start nu"/"Ontdek portfolio" buttons)
- `<ProblemSolutionSection />` voor sectie 2 (kolommen blijven identiek aan homepage, alleen H2 erboven uniek)
- `<TestimonialsCarousel />` voor sectie 3
- Grid van **alle** projecten via `<ProjectCard />` voor sectie 4 + "Alle projecten bekijken" knop
- Custom Accordion-FAQ met 4 unieke items
- Nieuw `<ContactBlock />` component (zie hieronder)
- Interne linksectie onderaan
- `<SEOHead />` met unieke title/desc + canonical `https://www.nieuwblik.com/website-laten-maken-{slug}` + WebPage JSON-LD via `structuredData` prop + LocalBusiness JSON-LD via bestaande `includeLocalBusinessSchema={true}` (matcht jouw spec exact)

**`src/pages/IndustryLanding.tsx`**: idem voor branches; sectie 1 toont 4-6 needs als H3-grid ipv 3 benefits.

### Nieuw component

**`src/components/ContactBlock.tsx`** — vaste contactgegevens (06 46 25 36 07, WhatsApp wa.me/31646253607, info@nieuwblik.com, De Trompet 18H 1601 MK Enkhuizen, KVK 99229781) met groene accent, "Start je project" knop naar /contact. Props: `h2`, `body` (uniek per pagina). Hergebruikt op alle 60 pagina's.

### Routing — `src/App.tsx`

Eager import beide templates. Eén dynamische route `/website-laten-maken-:slug` → `<LandingRouter />` wrapper die:
1. Checkt of slug in `cities.ts` zit → render `<CityLanding>`
2. Anders checkt `industries.ts` → render `<IndustryLanding>`
3. Anders → `<NotFound />`

### Homepage — `src/pages/Index.tsx`

Twee nieuwe blokken vlak voor de footer:
- H2 "Website laten maken in jouw stad" met responsive grid (3-5 koloms) van 30 city-links
- H2 "Website laten maken voor jouw branche" met grid van 30 branche-links

Stijl: `bg-secondary` sectie, container, sentence case, groene hover-accent (consistent met memory rules).

### Sitemap

**`public/sitemap.xml`** + **`scripts/generate-sitemap.ts`**: 60 nieuwe `<url>` entries voor `https://www.nieuwblik.com/website-laten-maken-{slug}`, prio 0.7, changefreq weekly. Generator script leest cities.ts + industries.ts en bouwt automatisch.

### Footer

Niet 60 links proppen in de footer (visueel onmogelijk). In plaats daarvan twee korte links "Steden" en "Branches" die scrollen naar de homepage-grids (`/#steden`, `/#branches`). De homepage-grids bieden alle 60 crawlbare links voor Google.

## Wat blijft consistent (volgens jouw spec)
- Contactgegevens, portfolio-projectdata, klantreviews, ProblemSolution-kolommen, teamfoto, "Start nu"/"Ontdek portfolio" knoppen, LocalBusiness schema

## Wat is uniek per pagina
- Title, meta, H1, alle H2's, alle H3's, alle bodyteksten, herosubtitel, FAQ's, contactblok H2 + body, portfolio-intro, interne linkparagraph, WebPage JSON-LD

## Aandachtspunten
- Memory rule: geen em dashes (—) in geschreven teksten, alleen komma's of normale hyphens
- Memory rule: 100% Nederlands, sentence case
- Memory rule: instant navigation, dus geen lazy() op deze templates
- Geen Twitter/X meta tags (memory rule)
- Canonical altijd www.nieuwblik.com prefix

## Omvang
Dit wordt een grote PR: ~2 templates (~300 regels), 1 ContactBlock, ~3000 regels totaal aan unieke content in 2 data files (60 × ~50 regels content per record), homepage update, sitemap update, App.tsx update. Schrijf ik in één keer in implementatiemode.
