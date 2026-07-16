# Plan: /taxi-website-laten-maken case-pagina + footer

Een op zichzelf staande, SEO-sterke case-pagina die uitlegt hoe de Taxi Drechterland site is gebouwd, waarom hij snel is, hoe de luchthaven-SEO werkt en hoe hij lokaal scoort rond West-Friesland. Plus een 'Taxi' link in de footer onder 'per branche'.

## Wat er komt

### 1. Nieuwe pagina `src/pages/TaxiWebsite.tsx`

Route: `/taxi-website-laten-maken` (past bij bestaand `website-laten-maken-{slug}` patroon, maar als expliciete route zodat het geen city/industry lookup nodig heeft).

Opbouw (donker groen visueel dna, hergebruikt uit bestaande pagina's, licht mode, geen em dashes, Nederlandse sentence case, geen loader-transitions):

1. **SEOHead** — title `Taxi website laten maken | Case Drechterland - Nieuwblik` (<60), meta description emotioneel + met keyword (<155), canonical + og:url naar `https://www.nieuwblik.com/taxi-website-laten-maken`, JSON-LD `Article` (headline, image = taxidrechterland.webp CDN, author Nieuwblik, datePublished juli 2026).
2. **Hero** — H1 `Taxi website laten maken die ritten oplevert`, ondertitel over West-Friesland + Schiphol, groene CTA `Vraag een voorstel aan` naar `/contact`, secundair naar live site.
3. **Case intro + featured image** — bestaande `taxidrechterland.webp` full-width, korte pitch (2 alinea's).
4. **"Zo is de site gebouwd"** — 4 tegels:
   - Maatwerk zonder CMS-overhead (React + Vite, statisch snel geladen)
   - WhatsApp-boekingsformulier (aanvraag als kant-en-klaar bericht)
   - Mobile-first UI (plus/min knoppen, sticky bel/app balk)
   - Regio-ritme uitgelegd in plaats van agenda-integratie
5. **"Waarom hij snel is"** — technisch blok, in Jip-en-Janneke: statische build, WebP-afbeeldingen, lazy loading, geen zware trackers, edge-caching, PageSpeed 90+.
6. **"Airport SEO integratie"** — sectie die uitlegt hoe aparte landingspagina's zijn gemaakt voor Schiphol, Eindhoven, Rotterdam, Groningen en Maastricht Aachen Airport, met interne linkstructuur, schema en op-zoekintentie geschreven copy ('taxi naar Schiphol vanuit West-Friesland').
7. **"Lokale keywords rond West-Friesland"** — grid met de kernen (Hoogkarspel, Venhuizen, Westwoud, Oosterblokker, Hoorn, Enkhuizen, Bovenkarspel, Grootebroek, Andijk, Wervershoof, Medemblik) en de logica achter de per-dorp positionering. Uitleg over Google Business Profile koppeling.
8. **Resultaat / conclusie** — korte alinea.
9. **CTA band** (donker groen, `useDarkNavSection`) — `Ook een taxi website die werkt?` → `/contact`.
10. **Footer**.

Alleen bestaande foto gebruikt (`@/assets/taxidrechterland.webp`), zoals bevestigd.

### 2. Route in `src/App.tsx`

Eager import `TaxiWebsite` (consistent met andere public pages) + `<Route path="/taxi-website-laten-maken" element={<TaxiWebsite />} />` boven de `:landingPath` catch-all zodat de LandingRouter er niet overheen valt.

### 3. Footer link — `src/components/Footer.tsx`

In de bestaande "Website laten maken per branche" grid (die momenteel uit `industries.ts` genereert): een extra hardcoded item 'Taxi' toevoegen dat naar `/taxi-website-laten-maken` linkt. Klein render-blokje na de `industries.map(...)` zodat we `industries.ts` (auto-generated) niet raken.

### 4. `public/sitemap.xml`

Nieuwe `<url>` entry voor `https://www.nieuwblik.com/taxi-website-laten-maken`, priority 0.8, lastmod vandaag.

## Bestanden

- **Nieuw:** `src/pages/TaxiWebsite.tsx`
- **Wijzig:** `src/App.tsx` (import + route)
- **Wijzig:** `src/components/Footer.tsx` (Taxi item in branches grid)
- **Wijzig:** `public/sitemap.xml` (nieuwe URL)

## Buiten scope

- Geen extra taxi-foto's toevoegen (jouw keuze: alleen bestaande foto).
- `industries.ts` niet uitbreiden (auto-generated bestand); Taxi wordt een aparte case-pagina, geen programmatic branche.
- Geen wijzigingen aan `/portfolio/taxi-drechterland` detail-pagina.
