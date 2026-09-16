# SEO-fixes nieuwblik.com (audit 16 september 2026)

Zeven defects uit de audit, plus wat de verificatie daarna nog vond. Per defect: wat er gevonden is, wat er veranderd is, in welke bestanden, en wat je zelf nog moet doen buiten de repo.

Pass 1 (lokale productiebuild) is groen: 2857 checks, 0 fouten. Pass 2 (live) kan pas na deploy en HadoSEO-import. Onderaan staat hoe je die draait.

## Eerst doen, buiten de repo

1. **Publiceren in Lovable**, zodat de origin de nieuwe code draait.
2. **HadoSEO: `redirects.csv` importeren** (Routing Rules). 36 regels, kolommen `source_path,target_url,rule_type`.
3. **HadoSEO: sitemap opnieuw synchroniseren en de cache legen.** HadoSEO kent pagina's alleen via de sitemap, en prerenderde pagina's blijven de oude versie tonen tot je de cache legt. Een query-parameter als cache-buster werkt niet; de cache is op pad gesleuteld.
4. **Bug melden bij HadoSEO:** een 404 van de origin wordt gecachet en als 200 geserveerd. Voorbeeld: `/webdesign` geeft op `luxe-briefing-hub.lovable.app` een 404, maar via nieuwblik.com een 200. Dat is geen instelling, dat moet HadoSEO oplossen. Tot dan krijgt een onbekend pad zonder redirectregel live nog steeds een 200.
5. **Redirectketen inkorten (HadoSEO of DNS):** `http://www.nieuwblik.com` gaat nu via 308 naar `https://www.nieuwblik.com` en dan via 301 naar `https://nieuwblik.com`. Laat http://www direct in één 301 naar `https://nieuwblik.com` gaan. Hier is in de code niets voor veranderd.
6. **Pass 2 draaien** (zie onderaan). Pas als `/webdesign` daar een 301 geeft, voor browser én Googlebot, is defect 3 echt weg.
7. **Google Search Console** (property voor `https://nieuwblik.com`, of een domeinproperty):
   - Nieuwe sitemap indienen: `https://nieuwblik.com/sitemap.xml`. Verwijder een eventueel ingediende `https://www.nieuwblik.com/sitemap.xml`.
   - URL-inspectie en "Indexering aanvragen" voor `/website-laten-maken`, `/webdesign-bureau`, `/seo-enkhuizen` en een paar stad- en branchepagina's.
   - Onder Pagina's de meldingen "Soft 404" en "Alternatieve pagina met correcte canonieke tag" volgen; na de HadoSEO-import "Validatie starten".
   - Verbeteringen, Broodkruimels: na herindexering controleren op fouten. FAQ-rich results toont Google sinds 2023 alleen nog voor overheids- en zorgsites; de FAQPage-markup is er vooral voor AI-crawlers en begrip van de pagina.
8. **Reviewaantal aanleveren.** In `src/config/business.ts` staat `REVIEWS.aantalLabel` op "19+" met een TODO; dat was de tekst op de homepage en is niet gecontroleerd.

## Vooraf: wat er anders bleek dan in de audit

- **De soft 404's (defect 3 en 7) komen van HadoSEO, niet van de app.** Op de origin gaven `/webdesign`, `/project-esveld` en `/website-laten-maken-fysiotherapie` al een echte 404. HadoSEO cachet die als 200.
- **JSON-LD werd niet client-side geïnjecteerd (defect 6).** Het waren drie overlappende server-side bronnen. Het doel bleef hetzelfde.
- **Defect 4.3 (afwijkende layout op Amsterdam) vervalt.** Niet reproduceerbaar: alle stadspagina's hebben dezelfde header en footer, als browser en als Googlebot.
- **`sideEffects: false` stond wél in package.json.** Verwijderd in een eigen commit.
- **30 branchepagina's, niet 31.** `/taxi-website-laten-maken` heeft een eigen URL-structuur en staat nu ook in de sitemap.

## Defect 1: sitemap mist pagina's

**Gevonden.** De sitemap was een handmatig bestand met 76 URL's. Alle 60 stad- en branchepagina's, de 4 regiopagina's en `/website-laten-maken`, `/webdesign-bureau` en `/seo-enkhuizen` ontbraken. Het oude generatorscript draaide niet in de build en maakte een kapotte URL (`/werkgebied/, slug);`).

**Gewijzigd.**
- `scripts/generate-sitemap.ts` is herschreven. Statische routes komen uit de routebestanden in `src/routes/_public`, dus een nieuwe pagina komt vanzelf in de sitemap. Elke dynamische route heeft een bron met de echte slugs (steden, branches, blogs, cases, regio's, lokale werkgebieden). Komt er een dynamische route bij zonder bron, dan faalt de generator in plaats van die pagina's stil over te slaan.
- Uitgesloten: de catch-all (404), `/bedankt` (noindex), `/admin`, statische routes met `noIndex`. De generator faalt als een URL dubbel staat of ook in de redirecttabel voorkomt.
- `lastmod` per pagina uit de laatste inhoudelijke commit: `git log` op route en paginacomponent, `git blame` op het eigen data-blok. Puur technische commits (hostnaam, schema-opbouw, markup) tellen niet mee, anders staat na elke refactor alles op vandaag. Zonder git blijft de bestaande lastmod staan. Resultaat: 132 URL's met 14 verschillende datums.
- Schrijft ook `public/robots.txt`, met de Sitemap-regel uit `SITE_URL`.
- Draait bij elke build via een Vite-plugin, en los met `npm run generate-sitemap`.

**Bestanden.** `scripts/generate-sitemap.ts`, `vite.config.ts`, `public/sitemap.xml`, `public/robots.txt`.

**Zelf doen.** Sitemap indienen in Search Console en HadoSEO opnieuw laten synchroniseren (actiepunten 3 en 7).

## Defect 2: kannibalisatie tussen twee pagina's per stad

**Gevonden.** Zoals gemeld: voor 11 steden bestonden zowel `/website-laten-maken-{stad}` als `/werkgebied/{stad}`.

**Gewijzigd.**
- `/werkgebied/$slug` accepteert alleen nog lokale plaatsen: de West-Friese plaatsen plus Heerhugowaard en Schagen, die geen tegenhanger hebben.
- De 11 steden geven een 301 naar `/website-laten-maken-{stad}`. Dat gebeurt server-side in `src/server.ts`, voordat de router draait, via één redirecttabel.
- Het werkgebied-overzicht linkt de grote steden nu naar hun landelijke pagina. De stedendata blijft staan, want dat overzicht toont ze nog.
- Link-audit: geen andere interne links naar de opgeheven routes.

**Bestanden.** `src/config/redirects.ts` (nieuw), `src/server.ts`, `src/data/regions.ts`, `src/routes/_public/werkgebied/$slug.tsx`, `src/pages/WerkgebiedDetail.tsx`, `src/pages/Werkgebied.tsx`.

**Zelf doen.** `redirects.csv` importeren in HadoSEO en de cache legen.

## Defect 3: oude URL's zonder 301

**Gevonden.** De git-historie begint pas bij Lovable (november 2025); de Webflow-routes staan niet in de repo. Ze komen uit het Wayback Machine-archief. Naast `/webdesign` en `/project-*` stonden daar meer oude URL's zonder tegenhanger. Onderwerpen van verwijderde blogs en cases komen uit de git-historie.

**Gewijzigd.** 25 regels in dezelfde redirecttabel, altijd naar de dichtstbijzijnde inhoudelijke opvolger en alleen naar een overzichtspagina als er echt niets anders is. `redirects.csv` wordt uit die tabel gegenereerd (`npm run generate-redirects`), zodat app en HadoSEO dezelfde regels hebben.

Door de verificatie kwam er nog één bij: `/start-je-project` renderde exact de contactpagina, met canonical naar `/contact`. Die route is verwijderd en geeft nu een 301 naar `/contact`. Negen interne links wijzen direct naar `/contact`; de knopteksten "Start je project" zijn niet veranderd.

Alle 36 regels, met de keuze per regel om na te lopen:

| Oud | Nieuw | Waarom |
|---|---|---|
| `/werkgebied/amsterdam` | `/website-laten-maken-amsterdam` | Kannibalisatie (defect 2) |
| `/werkgebied/rotterdam` | `/website-laten-maken-rotterdam` | Kannibalisatie (defect 2) |
| `/werkgebied/den-haag` | `/website-laten-maken-den-haag` | Kannibalisatie (defect 2) |
| `/werkgebied/utrecht` | `/website-laten-maken-utrecht` | Kannibalisatie (defect 2) |
| `/werkgebied/eindhoven` | `/website-laten-maken-eindhoven` | Kannibalisatie (defect 2) |
| `/werkgebied/groningen` | `/website-laten-maken-groningen` | Kannibalisatie (defect 2) |
| `/werkgebied/tilburg` | `/website-laten-maken-tilburg` | Kannibalisatie (defect 2) |
| `/werkgebied/almere` | `/website-laten-maken-almere` | Kannibalisatie (defect 2) |
| `/werkgebied/breda` | `/website-laten-maken-breda` | Kannibalisatie (defect 2) |
| `/werkgebied/nijmegen` | `/website-laten-maken-nijmegen` | Kannibalisatie (defect 2) |
| `/werkgebied/alkmaar` | `/website-laten-maken-alkmaar` | Kannibalisatie (defect 2) |
| `/webdesign` | `/diensten` | Oude dienstenpagina, opvolger is het dienstenoverzicht |
| `/seo` | `/seo-enkhuizen` | Oude SEO-dienstpagina |
| `/prijzen` | `/website-laten-maken` | Prijzen en pakketten staan op de verkooppagina |
| `/ecommerce` | `/diensten/e-commerce` | Zelfde dienst, nieuw pad |
| `/diensten/ecommerce` | `/diensten/e-commerce` | Zelfde dienst, pad zonder streepje |
| `/listings` | `/diensten/e-commerce` | Product listings vallen onder de e-commercedienst |
| `/social-media` | `/diensten` | Socialblok staat op het dienstenoverzicht |
| `/grafische-vormgeving` | `/diensten` | Brandingblok staat op het dienstenoverzicht |
| `/cookiebeleid` | `/cookies` | Zelfde pagina, nieuw pad |
| `/privacybeleid` | `/privacy` | Zelfde pagina, nieuw pad |
| `/start-je-project` | `/contact` | Zelfde pagina als /contact; de canonical wees er al naartoe |
| `/project-esveld` | `/portfolio/esveld-installatie` | Zelfde case |
| `/project-kyodai` | `/portfolio/kyodai-originals` | Zelfde case |
| `/project-rrs` | `/portfolio/rrs-royal` | Zelfde case |
| `/project-lashlution` | `/portfolio/puur-in-harmonie` | Lashlution (Beauty & Wellness) bestaat niet meer; Puur in Harmonie is de case in dezelfde branche |
| `/portfolio/lashlution` | `/portfolio/puur-in-harmonie` | Idem |
| `/portfolio/vdv-tuinen` | `/portfolio/green-profit` | VdV Tuinen (tuinaanleg) bestaat niet meer; Green Profit is de dichtstbijzijnde case |
| `/blog/seo-fundamentals-gevonden-worden` | `/blog/vindbaar-in-chatgpt-geo-west-friesland` | "SEO fundamentals: hoe je gevonden wordt"; GEO bouwt voort op dezelfde SEO-basis |
| `/blog/lovable-websites-bouwen` | `/blog/figma-hadoseo-lovable-perfecte-website` | "Hoe je in uren professionele websites bouwt met Lovable" |
| `/blog/lovable-websites-bouwen-met-ai` | `/blog/figma-hadoseo-lovable-perfecte-website` | Variant van dezelfde slug (niet in git, wel in het archief) |
| `/blog/bolt-new-ai-website-builder` | `/blog/replit-online-code-editor-ai` | "Bolt.new: bouw websites en apps met AI in je browser"; Replit is ook browsergebaseerd, Cursor is een desktopeditor |
| `/blog/waarom-snelle-websites-meer-verkopen` | `/blog/case-study-benoted-snelheid-zichtbaarheid` | "Waarom snelle websites meer verkopen"; de BeNoted-case gaat over snelheid en resultaat |
| `/blog/van-bezoeker-naar-klant-conversie-optimalisatie` | `/gratis-website-analyse` | "Van bezoeker naar klant: conversie-optimalisatie"; er is geen blog over conversie meer, de website-analyse behandelt conversie en snelheid het uitgebreidst |
| `/blog/wordpress-vs-maatwerk-website` | `/diensten/website-op-maat` | Verwijderd op 14-09-2026; keuze voor maatwerk |
| `/blog/wat-kost-website-laten-maken-2026` | `/website-laten-maken` | Verwijderd op 14-09-2026; prijzen staan op de verkooppagina |

Geen enkele regel gaat naar `/blog` of `/portfolio` als overzichtspagina.

**Bestanden.** `src/config/redirects.ts`, `scripts/generate-redirects-csv.ts` (nieuw), `redirects.csv` (nieuw), `src/routes/_public/blog/$slug.tsx`, `src/routes/_public/start-je-project.tsx` (verwijderd), `src/components/PricingPackages.tsx`, `src/pages/About.tsx`, `src/pages/BlogPost.tsx`, `src/pages/Index.tsx`, `src/pages/Services.tsx`, `src/data/blogPosts.ts`, `src/components/FreeAnalysisPopup.tsx`, `public/llms.txt` (linkte ook nog naar de redirect `/diensten/ecommerce`).

**Zelf doen.** HadoSEO-import en cachepurge; bug melden (actiepunten 2 tot en met 4). De 200-status verdwijnt live pas daarna.

## Defect 4: canonicals op www, site draait op non-www

**Gevonden.** `https://www.nieuwblik.com` geeft een 301 naar `https://nieuwblik.com` (HadoSEO, gemeten 16-09-2026). In de repo stond `www` in `companyInfo.url`, robots.txt, de sitemap en 83 losse strings in 31 bestanden.

**Gewijzigd.**
- Nieuwe constante `SITE_URL = "https://nieuwblik.com"` in `src/config/site.ts`, zonder imports zodat ook de scripts hem lezen. `companyInfo.url` leest daaruit.
- Alle 83 hardcoded www-URL's gebruiken nu `SITE_URL`: canonicals, `og:url`, `twitter:url`, JSON-LD `url` en `image`, broodkruimels. De sitemap en de Sitemap-regel in robots.txt komen uit de generator.
- De canonical van de homepage heeft nu een slash, gelijk aan de geserveerde URL en de sitemap.
- Defect 4.3 vervalt (zie boven).

**Bestanden.** `src/config/site.ts` (nieuw), `src/config/company.ts`, `src/routes/__root.tsx`, 29 route- en paginabestanden, `public/robots.txt`, `public/sitemap.xml`.

**Zelf doen.** Redirectketen http://www inkorten (actiepunt 5). Search Console op de non-www property (actiepunt 7).

## Defect 5: FAQ-antwoorden niet in de statische HTML

**Gevonden.** Er zijn twee FAQ-implementaties. De Radix-accordion (`LandingFaq`, op de verkoop-, stad-, branche- en regiopagina's) rendert de inhoud alleen als een item open is, ook met `forceMount`. `FAQSection` (homepage en over-ons) mountte antwoorden via `AnimatePresence`, dus alleen het eerste, dat standaard open staat.

**Gewijzigd.**
- `ui/accordion.tsx` is vervangen door een eigen implementatie met dezelfde API; `LandingFaq` is niet veranderd. Het paneel blijft gemount en is dicht `hidden`. De animatie loopt via `grid-template-rows` met `overflow: clip`.
- Toegankelijkheid volgens het WAI-ARIA accordion-patroon: knop in een `h3` met `aria-expanded` en `aria-controls`, paneel als `region` met `aria-labelledby`, bediening met pijltjestoetsen, Home en End.
- `FAQSection` gebruikt dezelfde hook (`src/lib/collapse.ts`) met de bestaande timing (400ms easeOutExpo), en kreeg een echte knop in plaats van alleen een klikbare div.
- Gecontroleerd zonder JavaScript: op alle pagina's met een FAQ staat elke antwoordtekst in de HTML-bron. In de browser gecontroleerd op `/website-laten-maken` en `/over-ons`: klikken, pijltjestoetsen, `aria-expanded` en `hidden` wisselen correct. De opmaak is visueel nagekeken op `/over-ons` (FAQSection) en in de productiebuild op `/website-laten-maken-amsterdam` (accordion), open en dicht, en is gelijk gebleven.

**Bestanden.** `src/components/ui/accordion.tsx`, `src/lib/collapse.ts` (nieuw), `src/components/FAQSection.tsx`.

**Zelf doen.** Niets.

## Defect 6: dubbele schema-entiteiten, en tegenstrijdige cijfers

**Gevonden.**
- Drie overlappende server-side bronnen: `__root.tsx` (Organization, WebSite, ProfessionalService), `SEOHead` (Organization en WebSite nogmaals, plus losse blokken), en de pagina's zelf plus `LandingFaq`. Op `/website-laten-maken` stonden 8 blokken en een dubbele FAQPage.
- Reviewscore 5,0 op de homepage, 4.9 op over-ons.
- Prijzen: overal "vanaf 990", behalve de 60 stad- en branchepagina's ("vanaf 1500", één variant "1500 tot 4000"). Derde pakket "Op maat, op aanvraag" op de homepage tegenover "Premium 2990+" op `/website-laten-maken`.
- Doorlooptijd: "binnen 1 week", "1-2", "2-3", "2-6", "gemiddeld 3", "binnen 4" en "4 tot 8 weken" door elkaar.
- De knoppen naar Google-reviews wezen naar een zoekopdracht.

**Gewijzigd.**
- Eén JSON-LD-blok per pagina, server-side, als één `@graph` (`src/lib/structured-data.ts`). Organization, WebSite en ProfessionalService staan er één keer in met een vast `@id`; BreadcrumbList staat op elke pagina (automatisch als een pagina er geen meegeeft); daarna de pagina-eigen entiteiten (FAQPage, Service, WebPage, BlogPosting enzovoort). Geneste beschrijvingen van Nieuwblik worden `@id`-verwijzingen. Noindex-pagina's krijgen geen structured data.
- Geen `aggregateRating` (reviews over jezelf op je eigen site leveren geen sterren op en kunnen bij een afwijkend cijfer een handmatige maatregel opleveren).
- FAQPage toegevoegd waar een FAQ zichtbaar was maar het schema ontbrak: `/over-ons`, de stadspagina's, `/diensten/webshops` en `/diensten/e-commerce`. De algemene FAQ staat in `src/data/algemeneFaq.ts`, één bron voor zichtbare tekst en schema.
- `SEOHead` zette client-side `og:image` op 1200×630 en overschreef daarmee de juiste afmetingen uit de server-head. Verwijderd.
- Nieuwe constante `src/config/business.ts`, waar de teksten uit lezen:

| | Waarde |
|---|---|
| Reviewscore | 5,0 (aantal: TODO, voorlopig "19+") |
| Reviewknop | Google Bedrijfsprofiel `https://www.google.com/maps?cid=17053451632150536956` (CID uit de place-ID in `companyInfo`) |
| Starter | €990 |
| Professional | €1990 |
| Op maat | op aanvraag (was "Premium 2990+" op `/website-laten-maken`) |
| Uitgebreide sites en webshops | €1990 tot €4000 |
| Webshop | vanaf €2.990 |
| Taxiwebsite | vanaf €1500 (eigen product met boekingsformulier en luchthavenpagina's) |
| Doorlooptijd Starter | 2 weken |
| Doorlooptijd standaard website | 2 tot 4 weken |
| Doorlooptijd complex | 4 tot 6 weken |

- De landingsgenerator leest dezelfde constante (`npm run generate-landing-data`). `cities.ts` en `industries.ts` zijn opnieuw gegenereerd; alleen de 134 prijs- en doorloopregels veranderden.

**Bewust niet aangepast.**
- Een klantquote op `/diensten/website-op-maat`: "Nieuwblik heeft onze website binnen een week live gezet." Dat is een citaat. Klopt het niet meer met wat je nu belooft, haal het dan zelf weg of vervang het.
- "Binnen 1-2 weken" voor product listings (`/diensten/e-commerce`): een ander product.
- "4 tot 8 weken" voor de eerste SEO-resultaten en "binnen twee weken" als starttermijn: andere maten.

**Bestanden.** `src/lib/structured-data.ts` (nieuw), `src/config/business.ts` (nieuw), `src/data/algemeneFaq.ts` (nieuw), `src/components/SEOHead.tsx`, `src/routes/__root.tsx`, `src/components/LandingFaq.tsx`, `src/components/FAQSection.tsx`, `src/components/PricingPackages.tsx`, `src/components/ReviewsDisplay.tsx`, `src/components/TestimonialsCarousel.tsx`, `src/pages/` (Index, About, CityLanding, IndustryLanding, RegionalHub, TaxiWebsite, WebdesignBureau, WebsiteLatenMaken, WerkgebiedDetail, services/Webshops, services/Ecommerce, services/WebsiteOpMaat), routes voor `/website-laten-maken`, `/webdesign-bureau`, `/diensten/webshops` en `/diensten/website-op-maat`, `scripts/generate-landing-data.mjs`, `src/data/cities.ts`, `src/data/industries.ts`.

**Zelf doen.** Het echte reviewaantal aanleveren. Na herindexering in Search Console het rapport voor broodkruimels controleren.

## Defect 7: kapotte interne link en soft 404

**Gevonden.**
- `/website-laten-maken` linkte naar `/website-laten-maken-fysiotherapie`; de pagina heet `-fysiotherapeut`.
- De catch-all gaf op de origin al een echte 404. De 200 komt van HadoSEO.
- De 404-pagina had wel een canonical naar zichzelf: `SEOHead` viel ook bij `noIndex` terug op het huidige pad. Bij client-side navigatie bleven bovendien canonical, `og:url` en hreflang van de vorige pagina staan.

**Gewijzigd.**
- Link gerepareerd.
- Link-audit: een crawl van alle bereikbare pagina's plus een statische controle van letterlijke paden in `src`. Verder geen links naar niet-bestaande routes. Wel twee onbereikbare `<Navigate to="/404">` in `CityLanding` en `IndustryLanding`; die renderen nu direct de 404-pagina. De verificatie crawlt dit bij elke run opnieuw.
- `SEOHead` verwijdert op noindex-pagina's canonical, `og:url`, `twitter:url` en hreflang.

**Bestanden.** `src/pages/WebsiteLatenMaken.tsx`, `src/components/SEOHead.tsx`, `src/pages/CityLanding.tsx`, `src/pages/IndustryLanding.tsx`.

**Zelf doen.** Bug melden bij HadoSEO (actiepunt 4).

## Verificatie

### Pass 1: lokale productiebuild

De site bouwt standaard als Cloudflare-worker. Voor een lokale test bouw je dezelfde app als Node-server:

```bash
NITRO_PRESET=node-server npm run build
```

```bash
cd .output && PORT=4310 node server/index.mjs
```

```bash
npm run seo:verify
```

`scripts/seo-verify.mjs` controleert:
- statuscodes: 200 voor sitemap-URL's, 301 met de juiste Location voor elke regel in `redirects.csv`, 404 voor onbekende paden;
- precies één canonical op de gekozen host, gelijk aan de eigen URL;
- precies één `h1`;
- titel en description aanwezig en uniek;
- één JSON-LD-blok met elk `@type` één keer;
- FAQ: aantal `acceptedAnswer` gelijk aan het aantal zichtbare vragen, en elke antwoordtekst in de HTML;
- sitemap tegen gecrawlde routes, en geen sitemap-URL in `redirects.csv`.

Uitkomst op 16-09-2026:

```
Basis: http://localhost:4310   Host: https://nieuwblik.com
Sitemap: 132 URL's · Redirects: 36 · Onbekende paden: 8 · Gecrawld: 131 (131 indexeerbaar)
Checks: 2857, fouten: 0

✓ Alles groen.
```

De crawl vindt 131 pagina's en de sitemap heeft er 132. Het verschil is `/reviews`: die staat terecht in de sitemap, maar geen enkele pagina linkt ernaartoe. Dat is geen fout voor de verificatie, maar een interne link (bijvoorbeeld vanuit de footer of bij de reviews op de homepage) helpt die pagina gevonden te worden.

### Pass 2: live, na deploy en HadoSEO

```bash
npm run seo:verify-live
```

`scripts/seo-verify-live.mjs` vraagt elke regel uit `redirects.csv` op bij `https://nieuwblik.com`, één keer met een browser-user-agent en één keer met de Googlebot-user-agent. HadoSEO serveert crawlers een eigen cache, dus beide moeten een 301 met exact de `target_url` geven. Verder controleert het dat een onbekend pad live een echte 404 geeft en dat www in één stap naar non-www gaat.

Het script vraagt op met `node:https` en gewone crawler-headers, niet met `fetch()`: HadoSEO sloeg de www-redirect over bij de extra headers die `fetch()` meestuurt.

Uitkomst op 16-09-2026, vóór de deploy: 71 van de 76 checks rood. Dat is verwacht, want de redirects bestaan live nog niet. Wel al groen: www naar non-www en de 404 voor een onbekend pad, beide voor browser en Googlebot.

Die run laat ook het cacheprobleem zien. `/blog/wordpress-vs-maatwerk-website` (al eerder gedeployed) geeft een browser een 301, maar Googlebot nog een 200 uit de HadoSEO-cache. `/blog/wat-kost-website-laten-maken-2026` geeft voor beide nog een 200. Zonder cachepurge blijven crawlers dus de oude versie zien.

## Commits

| Commit | Onderwerp |
|---|---|
| `f8fbb49` | sideEffects: false verwijderd uit package.json |
| `2a3fba4` | Defect 4: alle URL's naar non-www uit één constante |
| `37b8987` | Defect 2: /werkgebied/{stad} opgeheven, 301 naar /website-laten-maken-{stad} |
| `6a0e642` | Defect 3: 301's voor alle oude routes van voor de migratie |
| `2a2da27` | Defect 7: kapotte link naar fysiotherapie, en geen canonical op de 404-pagina |
| `f6fa50e` | Defect 5: FAQ-antwoorden altijd in de HTML |
| `ef33858` | Defect 6: één JSON-LD @graph per pagina |
| `bcbb7c9` | Defect 6: reviewscore, prijzen en doorlooptijd uit één constante |
| `50b56e8` | Defect 1: sitemap uit de routedefinities, gegenereerd bij elke build |
| `fc06de8` | Defect 1 en 3: /start-je-project was een kopie van /contact |
