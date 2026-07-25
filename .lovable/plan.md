## Doel

Op elk van de 4 regionale hubs (`/regio/noord-holland`, `/regio/randstad`, `/regio/oost-nederland`, `/regio/zuid-nederland`) twee nieuwe secties toevoegen aan `src/pages/RegionalHub.tsx`:

1. **Portfolio-grid** met 3 uitgelichte websites (klikbaar naar `/portfolio/[slug]`)
2. **Over ons** blok met de bestaande teamfoto van Justin & Job (`src/assets/justin-job-compressed.webp`)

Beide secties zijn generiek, dus één keer bouwen = automatisch op alle 4 pagina's.

## Sectie 1: Portfolio uitgelicht

**Plaats:** direct onder "Steden in {regio}", boven de FAQ.

**Inhoud:**
- H2: `Websites die we bouwden in {hub.name}` (of algemener: "Recent werk van Nieuwblik")
- 3 projectkaarten uit `src/data/projects.ts` — we gebruiken de eerste 3 sterke cases: **Taxi Drechterland**, **Een Bundel Geluk**, **Aardingsbedrijf West-Friesland** (allemaal echte West-Friese/NL projecten die passen bij elke regio zonder te liegen over locatie)
- Kaart-look: bestaand `ProjectCard` component hergebruiken, maar compacter — image + titel + categorie + "Bekijk case" link naar `/portfolio/{slug}`
- Onderaan CTA-link: "Bekijk hele portfolio" → `/portfolio`

**Waarom deze 3, niet regio-specifiek?** Onze portfolio is niet groot genoeg om per regio unieke cases te tonen zonder herhaling. De landelijke insteek ("bekijk recent werk") is eerlijker en levert intern een sterkere link naar `/portfolio/*` op elke hub.

## Sectie 2: Over ons met teamfoto

**Plaats:** onder de FAQ, boven het `ContactBlock` (dus als warmere afsluiter voor de contact-CTA).

**Layout:** 2-koloms op desktop (foto links, tekst rechts), gestapeld op mobiel.

**Foto:** `src/assets/justin-job-compressed.webp`, afgeronde hoeken (`rounded-2xl`), `loading="lazy"`, `width/height` gezet.

**Tekst:**
- H2: `Justin & Job achter Nieuwblik`
- 2 korte alinea's: 
  1. Wie we zijn (duo uit Enkhuizen, korte lijnen, geen bureau-façade)
  2. Waarom we ook in {hub.name} werken (persoonlijk contact ook op afstand, altijd één van ons aan tafel)
- CTA-knop: "Meer over ons" → `/over-ons`

De H2 en tweede alinea gebruiken `{hub.name}` interpolatie zodat elke pagina toch iets uniek leest voor Google (geen duplicate content).

## Bestandswijzigingen

**`src/pages/RegionalHub.tsx`** (enige file die aangepast wordt):
- Import: `ProjectCard`, `projects` uit `@/data/projects`, `justinJobImg` uit `@/assets/justin-job-compressed.webp`
- Constante `FEATURED_SLUGS = ["taxi-drechterland", "een-bundel-geluk", "aardingsbedrijf-west-friesland"]` bovenaan
- Twee nieuwe `<section>` blokken tussen "Steden" en `<LandingFaq>` (portfolio), en tussen `<LandingFaq>` en `<ContactBlock>` (over ons)
- Kleur en spacing volgen bestaande hub-secties (`py-16`, `bg-muted/30` alternerend, `max-w-5xl`)

Geen wijzigingen aan data files, componenten, of routes. Geen nieuwe assets nodig.

## SEO / performance

- Portfolio-kaarten linken naar bestaande `/portfolio/{slug}` (interne linkjuice omhoog)
- Teamfoto: `loading="lazy"`, `decoding="async"`, expliciete `width/height` om CLS te voorkomen
- Geen impact op JSON-LD (blijft `WebPage` + `Service` + `FAQPage`)

## Verificatie

Na de wijziging: `curl` `/regio/noord-holland` en `/regio/zuid-nederland`, check dat beide secties renderen en de 3 project-images geladen worden.
