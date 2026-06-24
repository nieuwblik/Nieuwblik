# Fase 1 + 2 uitvoeren: vindbaarheid Nieuwblik

## Fase 1 — Quick wins op bestaande posities

### 1.2 Interne links naar kapper + restaurant
Doel: autoriteit van homepage en blog doorgeven naar de twee landingen die het dichtst bij top-3 staan.

- **Homepage (`src/pages/Index.tsx`)** — in de bestaande "branches / voor wie" sectie (of onderaan vlak voor de footer-CTA) een korte tekstblok of chip-rij toevoegen met links naar:
  - `/website-laten-maken-kapper`
  - `/website-laten-maken-restaurant`
  - `/website-laten-maken-fysiotherapeut` en 2 andere top-branches (voor natuurlijke link-context)
- **Blog index (`src/pages/Blog.tsx`)** — onder de eerste fold een "Populair per branche" strook met dezelfde links.
- **Footer (`src/components/Footer.tsx`)** — nieuwe kolom "Branches" met 5–6 interne links naar industrie-landingen. Sitewide link juice naar elke industrie-pagina.
- **Industrie-landing (`src/pages/IndustryLanding.tsx`)** — in de bestaande "interne links" strook ook een link naar `/werkgebied/west-friesland` en `/seo-enkhuizen` toevoegen (cross-cluster linking).

### 1.3 Aparte `/seo-enkhuizen` pagina
Doel: rankt nu pos 6 met een blog. Met een dedicated dienstpagina richting top-3.

- Nieuwe route `/seo-enkhuizen` in `src/App.tsx`.
- Nieuw component `src/pages/SeoEnkhuizen.tsx` met:
  - H1: "SEO Enkhuizen — beter vindbaar in Google voor lokale ondernemers"
  - SEOHead met keyword-rijke title (<60), meta (<155), canonical, `Service` + `FAQPage` + `LocalBusiness` JSON-LD
  - Secties: probleem/oplossing, lokale aanpak (Google Business, lokale citations, content), prijzen vanaf, 5 FAQ-items, contact-CTA
  - Interne links naar `/werkgebied/enkhuizen`, `/diensten`, kapper- en restaurant-landingen
- Sitemap-entry toevoegen aan `public/sitemap.xml` (priority 0.9, changefreq monthly).

## Fase 2 — West-Friesland hub + lokale autoriteit

### 2.1 `/werkgebied/west-friesland` hub
Doel: clusterpagina die alle West-Friese stadjes bundelt en autoriteit naar `/werkgebied/:slug` doorzet.

- Nieuwe slug `west-friesland` toevoegen aan `src/data/regions.ts` (type: `local`, met `nearbyPlaces` = alle West-Friese kernen die al in regions staan: Enkhuizen, Hoorn, Hoogkarspel, Bovenkarspel, Venhuizen, Hem, Hauwert, Zwaagdijk, Andijk, Medemblik, Stede Broec, Drechterland).
- `src/pages/WerkgebiedDetail.tsx` blijft renderen, maar speciaal voor `west-friesland`: extra hub-sectie met grid van link-cards naar elke kern. Conditie: als slug === 'west-friesland' → renderHubGrid().
- Werkgebied-overzicht (`src/pages/Werkgebied.tsx`) — West-Friesland prominent bovenaan als regiokaart-CTA.
- Sitemap-entry toevoegen.

### 2.2 LocalBusiness schema uitbreiden
Doel: rich snippets, Google Business sync, lokale relevantie versterken.

- `src/config/company.ts` — `localBusinessJsonLd` uitbreiden met:
  - `openingHoursSpecification` (ma–vr 09:00–17:30)
  - `priceRange` ("€€")
  - `geo` (latitude/longitude van Enkhuizen-vestiging)
  - `areaServed` als lijst van Place-objecten (West-Friesland + grote NL-steden uit regions.ts)
  - `sameAs` (LinkedIn, Instagram, Facebook van Nieuwblik)
  - `hasOfferCatalog` met 3 OfferCatalog-items (Website op maat, Webshops, SEO)
- Effect is sitewide want SEOHead injecteert dit op elke pagina die `includeLocalBusinessSchema` aan heeft.

### 2.3 Backlink-strategie (geen code, wel doc + admin-checklist)
Doel: Authority Score 6 → 15+. Geen externe API om dit te automatiseren, dus dit wordt een actiedocument.

- Nieuw bestand `.agent/backlink-outreach-plan.md` met:
  - 5 prioritaire targets (WEEFF, NHD/Noordhollands Dagblad, Ondernemersfonds Enkhuizen, WBG West-Friese Bedrijven Groep, Citymarketing Enkhuizen)
  - Per target: contact, hoek (gastblog / case study / sponsoring / interview), template-mail
  - Tracking-tabel (status / datum verstuurd / response)
- Optioneel: een korte sectie "Onze partners & vermeldingen" op `/over-ons` voorbereiden zodat ontvangen links wederzijds tonen.

## Volgorde van uitvoering
1. Footer + Index + Blog interne links (1.2)
2. `/seo-enkhuizen` pagina + route + sitemap (1.3)
3. `west-friesland` region + WerkgebiedDetail hub + sitemap (2.1)
4. LocalBusiness schema uitbreiden in `src/config/company.ts` (2.2)
5. Industrie-landing interne links updaten (cross-cluster, 1.2 vervolg)
6. Backlink-outreach plan toevoegen (2.3)

## Technisch overzicht
- **Bestanden gewijzigd:** `src/pages/Index.tsx`, `src/pages/Blog.tsx`, `src/components/Footer.tsx`, `src/pages/IndustryLanding.tsx`, `src/pages/WerkgebiedDetail.tsx`, `src/pages/Werkgebied.tsx`, `src/App.tsx`, `src/data/regions.ts`, `src/config/company.ts`, `public/sitemap.xml`
- **Bestanden nieuw:** `src/pages/SeoEnkhuizen.tsx`, `.agent/backlink-outreach-plan.md`
- **Schema's:** alle nieuwe pagina's krijgen `WebPage` + `Service` + `FAQPage` JSON-LD via SEOHead; sitewide LocalBusiness uitgebreid
- **Geen breaking changes** — alle wijzigingen zijn additief, bestaande routes blijven werken

## Wat ik nodig heb (kan ook na approval)
- **Adresgegevens** voor LocalBusiness geo (lat/lng Enkhuizen-vestiging) — gebruik anders gemeente-centroid 52.7028 / 5.2914
- **Social URLs** (LinkedIn/Instagram/Facebook van Nieuwblik) — als niet aanwezig in `company.ts` skip ik `sameAs`
- Als deze ontbreken ga ik door met sensible defaults en markeer ik ze in de PR-omschrijving zodat je ze later kunt invullen.
