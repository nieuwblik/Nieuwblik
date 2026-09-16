# SEO-fixes nieuwblik.com (audit 16 september 2026)

Zeven defects uit de audit, plus wat de verificatie daarna nog vond. Per defect: wat er gevonden is, wat er veranderd is, in welke bestanden, en wat je zelf nog moet doen buiten de repo.

Pass 1 (lokale productiebuild) is groen: 10191 checks, 0 fouten. Pass 2 (live) kan pas na deploy en HadoSEO-import. Onderaan staat hoe je die draait.

## Eerst doen, buiten de repo

Er staat één **blocker** open: HadoSEO geeft op `https://www.nieuwblik.com` een 200 in plaats van een 301 zodra een client een `sec-fetch-mode` anders dan `navigate` meestuurt (zie [www-host](#blocker-www-host-geeft-per-client-een-200)). Meld dat bij HadoSEO vóór je de sitemap indient.

Doe de stappen in deze volgorde. Elke stap leunt op de vorige.

1. **Deployen (publiceren in Lovable).** De origin moet eerst de nieuwe code draaien: de 301's in `src/server.ts`, de non-www canonicals, de nieuwe sitemap. Importeer je redirects in HadoSEO terwijl de origin nog de oude code serveert, dan cachet HadoSEO bij het ophalen nog oude pagina's met www-canonicals.
2. **`redirects.csv` importeren in HadoSEO** (Routing Rules, 36 regels, kolommen `source_path,target_url,rule_type`). HadoSEO beantwoordt verzoeken zelf uit zijn cache; zonder deze regels komt een oud pad nooit bij de origin-301 aan.
3. **HadoSEO-cache legen** (en de sitemap opnieuw synchroniseren, zodat HadoSEO de nieuwe pagina's kent). De cache is op pad gesleuteld en blijft anders de oude 200-antwoorden serveren, ook voor Googlebot, dat een eigen cache krijgt. Een query-parameter als cache-buster werkt niet.
4. **Pass 2 draaien:** `npm run seo:verify-live`. Pas als die groen is, geven de oude URL's live een echte 301, voor browsers én Googlebot. Zolang hij rood is, klopt de live site nog niet met de repo.
5. **Pas dan de sitemap indienen in Search Console:** `https://nieuwblik.com/sitemap.xml` (property voor `https://nieuwblik.com` of een domeinproperty). Dien je eerder in, dan crawlt Google de nieuwe sitemap tegen een site die nog oude antwoorden geeft: soft 404's en www-canonicals worden dan opnieuw vastgelegd, en je moet later opnieuw laten valideren. Verwijder een eventueel ingediende `https://www.nieuwblik.com/sitemap.xml`. Daarna: URL-inspectie en "Indexering aanvragen" voor `/website-laten-maken`, `/webdesign-bureau`, `/seo-enkhuizen` en een paar stad- en branchepagina's, en onder Pagina's "Soft 404" en "Alternatieve pagina met correcte canonieke tag" laten valideren. Broodkruimels na herindexering controleren. FAQ-rich results toont Google sinds 2023 alleen nog voor overheids- en zorgsites; de FAQPage-markup is vooral voor AI-crawlers en begrip van de pagina.

Los van die volgorde:

- **Bug melden bij HadoSEO (1):** een 404 van de origin wordt gecachet en als 200 geserveerd (`/webdesign` gaf op `luxe-briefing-hub.lovable.app` een 404, via nieuwblik.com een 200). Tot dat opgelost is, krijgt een onbekend pad zonder redirectregel live nog steeds een 200.
- **Bug melden bij HadoSEO (2), blocker:** de www-redirect hangt af van `sec-fetch-mode` (zie onder).
- **Redirectketen inkorten (HadoSEO of DNS):** `http://www.nieuwblik.com` gaat via 308 naar `https://www.nieuwblik.com` en dan via 301 naar `https://nieuwblik.com`. Maak daar één 301 van. In de code is hier niets voor veranderd.
- **Prijswijzigingen beoordelen** vóór de deploy (zie [Prijswijzigingen ter beoordeling](#prijswijzigingen-ter-beoordeling)). Ze zitten al in de commits; wil je een regel niet, dan draai ik die terug.
- **Reviewaantal aanleveren.** `REVIEWS.aantalLabel` in `src/config/business.ts` staat op "19+" met een TODO.

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

**Zelf doen.** HadoSEO opnieuw laten synchroniseren (stap 3) en pas na een groene pass 2 de sitemap indienen in Search Console (stap 5).

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

**Zelf doen.** HadoSEO-import en cachepurge (stappen 2 en 3) en de 404-bug melden. De 200-status verdwijnt live pas na de import en de purge.

## Defect 4: canonicals op www, site draait op non-www

**Gevonden.** `https://www.nieuwblik.com` geeft een 301 naar `https://nieuwblik.com` (HadoSEO, gemeten 16-09-2026). In de repo stond `www` in `companyInfo.url`, robots.txt, de sitemap en 83 losse strings in 31 bestanden.

**Gewijzigd.**
- Nieuwe constante `SITE_URL = "https://nieuwblik.com"` in `src/config/site.ts`, zonder imports zodat ook de scripts hem lezen. `companyInfo.url` leest daaruit.
- Alle 83 hardcoded www-URL's gebruiken nu `SITE_URL`: canonicals, `og:url`, `twitter:url`, JSON-LD `url` en `image`, broodkruimels. De sitemap en de Sitemap-regel in robots.txt komen uit de generator.
- De canonical van de homepage heeft nu een slash, gelijk aan de geserveerde URL en de sitemap.
- Defect 4.3 vervalt (zie boven).

**Bestanden.** `src/config/site.ts` (nieuw), `src/config/company.ts`, `src/routes/__root.tsx`, 29 route- en paginabestanden, `public/robots.txt`, `public/sitemap.xml`.

**Zelf doen.** Redirectketen http://www inkorten, en de www-blocker melden bij HadoSEO. Search Console op de non-www property (stap 5).

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

**Zelf doen.** De 404-bug melden bij HadoSEO (zie Eerst doen).

## Blocker: www-host geeft per client een 200

**Gemeten 16-09-2026** met `scripts/www-host-check.mjs`: `https://www.nieuwblik.com` en drie subpagina's, met drie user agents (browser, Googlebot, geen UA), elk één keer met minimale headers en één keer met de headers die Node's `fetch()` meestuurt.

| Pad | User agent | Headers | Status | Location | Canonical in body |
|---|---|---|---|---|---|
| `/` | browser | minimaal | 301 | https://nieuwblik.com/ | - |
| `/` | browser | fetch-headers | 200 | - | https://www.nieuwblik.com |
| `/` | googlebot | minimaal | 301 | https://nieuwblik.com/ | - |
| `/` | googlebot | fetch-headers | 200 | - | https://www.nieuwblik.com |
| `/` | geen | minimaal | 301 | https://nieuwblik.com/ | - |
| `/` | geen | fetch-headers | 200 | - | https://www.nieuwblik.com |
| `/website-laten-maken` | browser | minimaal | 301 | https://nieuwblik.com/website-laten-maken | - |
| `/website-laten-maken` | browser | fetch-headers | 200 | - | https://www.nieuwblik.com/website-laten-maken |
| `/website-laten-maken` | googlebot | minimaal | 301 | https://nieuwblik.com/website-laten-maken | - |
| `/website-laten-maken` | googlebot | fetch-headers | 200 | - | https://www.nieuwblik.com/website-laten-maken |
| `/website-laten-maken` | geen | minimaal | 301 | https://nieuwblik.com/website-laten-maken | - |
| `/website-laten-maken` | geen | fetch-headers | 200 | - | https://www.nieuwblik.com/website-laten-maken |
| `/portfolio` | browser | minimaal | 301 | https://nieuwblik.com/portfolio | - |
| `/portfolio` | browser | fetch-headers | 200 | - | https://www.nieuwblik.com/portfolio |
| `/portfolio` | googlebot | minimaal | 301 | https://nieuwblik.com/portfolio | - |
| `/portfolio` | googlebot | fetch-headers | 200 | - | https://www.nieuwblik.com/portfolio |
| `/portfolio` | geen | minimaal | 301 | https://nieuwblik.com/portfolio | - |
| `/portfolio` | geen | fetch-headers | 200 | - | https://www.nieuwblik.com/portfolio |
| `/blog/vindbaar-in-chatgpt-geo-west-friesland` | browser | minimaal | 301 | https://nieuwblik.com/blog/vindbaar-in-chatgpt-geo-west-friesland | - |
| `/blog/vindbaar-in-chatgpt-geo-west-friesland` | browser | fetch-headers | 200 | - | https://www.nieuwblik.com/blog/vindbaar-in-chatgpt-geo-west-friesland |
| `/blog/vindbaar-in-chatgpt-geo-west-friesland` | googlebot | minimaal | 301 | https://nieuwblik.com/blog/vindbaar-in-chatgpt-geo-west-friesland | - |
| `/blog/vindbaar-in-chatgpt-geo-west-friesland` | googlebot | fetch-headers | 200 | - | https://www.nieuwblik.com/blog/vindbaar-in-chatgpt-geo-west-friesland |
| `/blog/vindbaar-in-chatgpt-geo-west-friesland` | geen | minimaal | 301 | https://nieuwblik.com/blog/vindbaar-in-chatgpt-geo-west-friesland | - |
| `/blog/vindbaar-in-chatgpt-geo-west-friesland` | geen | fetch-headers | 200 | - | https://www.nieuwblik.com/blog/vindbaar-in-chatgpt-geo-west-friesland |

**Welke header het verschil maakt** (Googlebot- of browser-UA op `https://www.nieuwblik.com/`, één header per verzoek):

| Extra header | Status |
|---|---|
| `accept: */*` | 301 |
| `accept-language: *` | 301 |
| `accept-encoding: gzip, deflate` | 301 |
| `sec-fetch-mode: navigate` | 301 |
| `sec-fetch-dest: document` (zonder mode) | 301 |
| volledige Chrome-navigatie (alle `sec-fetch`-headers, mode `navigate`) | 301 |
| `sec-fetch-mode: cors` | **200** |
| `sec-fetch-mode: no-cors` | **200** |
| `sec-fetch-mode: same-origin` | **200** |

**Conclusie.** De user agent maakt niet uit; de header `sec-fetch-mode` wel. Zonder `sec-fetch`-headers (zoals Googlebot, Bingbot, curl) en bij een gewone paginanavigatie in een browser geeft www een correcte 301. Stuurt een client `sec-fetch-mode: cors`, `no-cors` of `same-origin`, dan serveert HadoSEO de volledige pagina op www met status 200, en (met de huidige, oude deploy) een www-canonical. Dat zijn de modi van scripts en headless browsers, zoals sommige AI-crawlers en preview-tools. Voor die clients staat de site dubbel op twee hosts.

**Wat dit betekent.**
- Dit is een HadoSEO-probleem, niet iets in de repo. De repo zet alle canonicals op non-www; na de deploy wijst ook zo'n www-200-pagina met zijn canonical naar `https://nieuwblik.com`. Dat beperkt de schade, maar lost het niet op: een 200 op een tweede host is geen redirect.
- **Blocker:** melden bij HadoSEO vóór je de sitemap indient. Vraag dat de www-redirect onvoorwaardelijk geldt, voor elke request op de www-host, ongeacht `sec-fetch-*`-headers.
- Bij herhaald meten gaf HadoSEO af en toe een 429 (rate limiting) op Googlebot-verzoeken. Dat is een aparte observatie; de tabel hierboven is een run zonder 429.

**Opnieuw meten na de fix:** `node scripts/www-host-check.mjs`. Klaar als de laatste regel "www gaf in geen enkele combinatie een 200" is.

## Interne links naar redirects en weespagina's

**Interne links naar een redirect.** Bij het verwijderen van `/start-je-project` (commit `fc06de8`) zijn alle interne verwijzingen al rechtstreeks naar `/contact` gezet: de hero-knop op de homepage, de knop in de pakketten, drie knoppen op over-ons, twee op de dienstenpagina, de knop in de blog-zijbalk en twee links in een blogtekst, plus `llms.txt`. In de header, de footer en het stad- en branchesjabloon stond ook vóór die commit geen link naar `/start-je-project` (nagekeken in `fc06de8^`); de "Start je project"-knoppen in de hero en het contactblok van die sjablonen wezen al naar `/contact`. Er is intern geen enkele link meer naar `/start-je-project` of naar een van de elf `/werkgebied/{stad}`-paden. De 301's blijven alleen voor externe links en de index.

Nieuw in de verificatie, zodat dit niet terug kan komen:
- **Crawl:** elke interne link wordt vergeleken met `redirects.csv`; wijst er één naar een redirectbron, dan faalt de check, met de bronpagina erbij.
- **Broncode:** alle bestanden in `src` worden doorzocht op letterlijke paden uit `redirects.csv`. Dat vangt ook links die alleen in de browser renderen (zoals de popup), die de crawl niet ziet. Ook `public/llms.txt` wordt gecontroleerd.
- Negatieve test gedaan: een tijdelijk bestand met `href="/start-je-project"` liet de verificatie falen ("geen link naar een redirect in de broncode"); daarna verwijderd.

**Weespagina's.** `/reviews` werd nergens gelinkt. `/gratis-website-analyse` alleen vanuit één blogartikel en vanuit de popup, die alleen in de browser rendert: voor een crawler vrijwel een wees. Beide zijn nu gelinkt in de footerkolom Navigatie (Reviews onder Over Ons, Gratis website-analyse onder Contact); geen van beide is te dun om te linken. De hoofdnavigatie is niet aangepast. Nieuwe check: elke sitemap-URL moet via een interne link bereikbaar zijn, anders faalt de verificatie. De crawl vindt nu alle 132 sitemap-URL's.

**Sitemap tegen redirects.** Expliciet nagerekend op de sitemap uit de productiebuild: 132 sitemap-URL's, 36 redirectbronnen, overlap **0**. Elke redirectbestemming staat zelf in de sitemap. De verificatie controleert dit bij elke run, en de sitemapgenerator weigert te schrijven als er toch overlap is.

## Prijswijzigingen ter beoordeling

Bij defect 6 heb ik prijzen gelijkgetrokken. Op de stad- en branchepagina's was dat een commerciële wijziging (vanaf 1500 naar 990), waar je geen mandaat voor had gegeven. Niets is teruggedraaid. Bevestig of verwerp per regel.

Gereconstrueerd uit git: de data vóór commit `bcbb7c9` tegenover nu. Op de 30 stadspagina's is de FAQ inmiddels op jouw verzoek helemaal verwijderd; die regels staan er voor de volledigheid bij met "(FAQ van stadspagina's verwijderd)".

**Buiten de tabel, ook gewijzigd:**
- Schema (Offer-prijs in JSON-LD) op alle 30 branchepagina's: 1500 naar 990. Niet zichtbaar, wel wat Google leest.
- `/website-laten-maken`, derde pakket: "Premium, €2990+" naar "Op maat, op aanvraag", gelijk aan de homepage.
- Niet gewijzigd: de taxiwebsite (vanaf 1500), webshops (vanaf €2.990), de regio-pagina's en de overige verkooppagina's (die zeiden al 990).

| Pagina | Plek | Oud | Nieuw |
|---|---|---|---|
| `/website-laten-maken-accountant` | FAQ-antwoord | Voor een accountant hanteren wij een startbudget van 1500 euro. | Voor een accountant hanteren wij een startbudget van 990 euro. |
| `/website-laten-maken-advocaat` | FAQ-antwoord | Voor een advocaat hanteren wij een startbudget van 1500 euro. | Voor een advocaat hanteren wij een startbudget van 990 euro. |
| `/website-laten-maken-architect` | FAQ-antwoord | Een professionele website voor een architect begint bij ons vanaf 1500 euro. | Een professionele website voor een architect begint bij ons vanaf 990 euro. |
| `/website-laten-maken-autogarage` | FAQ-antwoord | Vanaf 1500 euro lever je al een sterke MKB site op. | Vanaf 990 euro lever je al een sterke MKB site op. |
| `/website-laten-maken-bloemist` | FAQ-antwoord | Een gemiddelde bloemist betaalt bij ons tussen de 1500 en 4000 euro voor een complete website. | Een gemiddelde bloemist betaalt bij ons tussen de 990 en 4000 euro voor een complete website. |
| `/website-laten-maken-boekhouder` | FAQ-antwoord | Een gemiddelde boekhouder betaalt bij ons tussen de 1500 en 4000 euro voor een complete website. | Een gemiddelde boekhouder betaalt bij ons tussen de 990 en 4000 euro voor een complete website. |
| `/website-laten-maken-bouwbedrijf` | FAQ-antwoord | Vanaf 1500 euro lever je al een sterke MKB site op. | Vanaf 990 euro lever je al een sterke MKB site op. |
| `/website-laten-maken-coach` | FAQ-antwoord | Een gemiddelde coach betaalt bij ons tussen de 1500 en 4000 euro voor een complete website. | Een gemiddelde coach betaalt bij ons tussen de 990 en 4000 euro voor een complete website. |
| `/website-laten-maken-dierenarts` | FAQ-antwoord | Vanaf 1500 euro lever je al een sterke MKB site op. | Vanaf 990 euro lever je al een sterke MKB site op. |
| `/website-laten-maken-elektricien` | FAQ-antwoord | Vanaf 1500 euro lever je al een sterke MKB site op. | Vanaf 990 euro lever je al een sterke MKB site op. |
| `/website-laten-maken-evenementenbureau` | FAQ-antwoord | Een gemiddelde evenementenbureau betaalt bij ons tussen de 1500 en 4000 euro voor een complete website. | Een gemiddelde evenementenbureau betaalt bij ons tussen de 990 en 4000 euro voor een complete website. |
| `/website-laten-maken-fotograaf` | FAQ-antwoord | Een gemiddelde fotograaf betaalt bij ons tussen de 1500 en 4000 euro voor een complete website. | Een gemiddelde fotograaf betaalt bij ons tussen de 990 en 4000 euro voor een complete website. |
| `/website-laten-maken-fysiotherapeut` | FAQ-antwoord | Een professionele website voor een fysiotherapeut begint bij ons vanaf 1500 euro. | Een professionele website voor een fysiotherapeut begint bij ons vanaf 990 euro. |
| `/website-laten-maken-horecabedrijf` | FAQ-antwoord | Voor een horecabedrijf hanteren wij een startbudget van 1500 euro. | Voor een horecabedrijf hanteren wij een startbudget van 990 euro. |
| `/website-laten-maken-interieurontwerper` | FAQ-antwoord | Vanaf 1500 euro lever je al een sterke MKB site op. | Vanaf 990 euro lever je al een sterke MKB site op. |
| `/website-laten-maken-kapper` | FAQ-antwoord | Een professionele website voor een kapper begint bij ons vanaf 1500 euro. | Een professionele website voor een kapper begint bij ons vanaf 990 euro. |
| `/website-laten-maken-kinderopvang` | FAQ-antwoord | Voor een kinderopvang hanteren wij een startbudget van 1500 euro. | Voor een kinderopvang hanteren wij een startbudget van 990 euro. |
| `/website-laten-maken-loodgieter` | FAQ-antwoord | Voor een loodgieter hanteren wij een startbudget van 1500 euro. | Voor een loodgieter hanteren wij een startbudget van 990 euro. |
| `/website-laten-maken-makelaar` | FAQ-antwoord | Vanaf 1500 euro lever je al een sterke MKB site op. | Vanaf 990 euro lever je al een sterke MKB site op. |
| `/website-laten-maken-personal-trainer` | FAQ-antwoord | Een professionele website voor een personal trainer begint bij ons vanaf 1500 euro. | Een professionele website voor een personal trainer begint bij ons vanaf 990 euro. |
| `/website-laten-maken-reclamebureau` | FAQ-antwoord | Een professionele website voor een reclamebureau begint bij ons vanaf 1500 euro. | Een professionele website voor een reclamebureau begint bij ons vanaf 990 euro. |
| `/website-laten-maken-reinigingsbedrijf` | FAQ-antwoord | Voor een reinigingsbedrijf hanteren wij een startbudget van 1500 euro. | Voor een reinigingsbedrijf hanteren wij een startbudget van 990 euro. |
| `/website-laten-maken-restaurant` | FAQ-antwoord | Voor een restaurant hanteren wij een startbudget van 1500 euro. | Voor een restaurant hanteren wij een startbudget van 990 euro. |
| `/website-laten-maken-schilder` | FAQ-antwoord | Een professionele website voor een schilder begint bij ons vanaf 1500 euro. | Een professionele website voor een schilder begint bij ons vanaf 990 euro. |
| `/website-laten-maken-schoonheidssalon` | FAQ-antwoord | Een gemiddelde schoonheidssalon betaalt bij ons tussen de 1500 en 4000 euro voor een complete website. | Een gemiddelde schoonheidssalon betaalt bij ons tussen de 990 en 4000 euro voor een complete website. |
| `/website-laten-maken-sportschool` | FAQ-antwoord | Vanaf 1500 euro lever je al een sterke MKB site op. | Vanaf 990 euro lever je al een sterke MKB site op. |
| `/website-laten-maken-tandarts` | FAQ-antwoord | Een gemiddelde tandarts betaalt bij ons tussen de 1500 en 4000 euro voor een complete website. | Een gemiddelde tandarts betaalt bij ons tussen de 990 en 4000 euro voor een complete website. |
| `/website-laten-maken-therapeut` | FAQ-antwoord | Een professionele website voor een therapeut begint bij ons vanaf 1500 euro. | Een professionele website voor een therapeut begint bij ons vanaf 990 euro. |
| `/website-laten-maken-tuinman` | FAQ-antwoord | Een professionele website voor een tuinman begint bij ons vanaf 1500 euro. | Een professionele website voor een tuinman begint bij ons vanaf 990 euro. |
| `/website-laten-maken-verzekeringsadviseur` | FAQ-antwoord | Voor een verzekeringsadviseur hanteren wij een startbudget van 1500 euro. | Voor een verzekeringsadviseur hanteren wij een startbudget van 990 euro. |
| `/website-laten-maken-alkmaar` | FAQ-antwoord | Een website laten bouwen in Alkmaar kost vanaf 1500 euro voor een degelijke MKB site. | (FAQ van stadspagina's verwijderd) |
| `/website-laten-maken-alkmaar` | Voordeel 'Betaalbaar maatwerk' | Vanaf 1500 euro krijg je een complete site op maat, zonder verborgen kosten. | Vanaf 990 euro krijg je een complete site op maat, zonder verborgen kosten. |
| `/website-laten-maken-almere` | FAQ-antwoord | Een website laten bouwen in Almere kost vanaf 1500 euro voor een degelijke MKB site. | (FAQ van stadspagina's verwijderd) |
| `/website-laten-maken-almere` | Voordeel 'Betaalbaar maatwerk' | Vanaf 1500 euro krijg je een complete site op maat, zonder verborgen kosten. | Vanaf 990 euro krijg je een complete site op maat, zonder verborgen kosten. |
| `/website-laten-maken-amersfoort` | FAQ-antwoord | De kosten van een website in Amersfoort starten bij 1500 euro voor een complete bedrijfssite. | (FAQ van stadspagina's verwijderd) |
| `/website-laten-maken-amsterdam` | FAQ-antwoord | Een eenvoudige bedrijfswebsite voor een ondernemer in Amsterdam begint vanaf 1500 euro. | (FAQ van stadspagina's verwijderd) |
| `/website-laten-maken-apeldoorn` | FAQ-antwoord | Een website laten bouwen in Apeldoorn kost vanaf 1500 euro voor een degelijke MKB site. | (FAQ van stadspagina's verwijderd) |
| `/website-laten-maken-apeldoorn` | Voordeel 'Betaalbaar maatwerk' | Vanaf 1500 euro krijg je een complete site op maat, zonder verborgen kosten. | Vanaf 990 euro krijg je een complete site op maat, zonder verborgen kosten. |
| `/website-laten-maken-arnhem` | FAQ-antwoord | Voor ondernemers in Arnhem hanteren wij een startprijs van 1500 euro voor een professionele website. | (FAQ van stadspagina's verwijderd) |
| `/website-laten-maken-arnhem` | Voordeel 'Betaalbaar maatwerk' | Vanaf 1500 euro krijg je een complete site op maat, zonder verborgen kosten. | Vanaf 990 euro krijg je een complete site op maat, zonder verborgen kosten. |
| `/website-laten-maken-breda` | FAQ-antwoord | Een eenvoudige bedrijfswebsite voor een ondernemer in Breda begint vanaf 1500 euro. | (FAQ van stadspagina's verwijderd) |
| `/website-laten-maken-delft` | FAQ-antwoord | Een website laten bouwen in Delft kost vanaf 1500 euro voor een degelijke MKB site. | (FAQ van stadspagina's verwijderd) |
| `/website-laten-maken-den-bosch` | FAQ-antwoord | Een eenvoudige bedrijfswebsite voor een ondernemer in Den Bosch begint vanaf 1500 euro. | (FAQ van stadspagina's verwijderd) |
| `/website-laten-maken-den-haag` | FAQ-antwoord | Voor ondernemers in Den Haag hanteren wij een startprijs van 1500 euro voor een professionele website. | (FAQ van stadspagina's verwijderd) |
| `/website-laten-maken-deventer` | FAQ-antwoord | De kosten van een website in Deventer starten bij 1500 euro voor een complete bedrijfssite. | (FAQ van stadspagina's verwijderd) |
| `/website-laten-maken-dordrecht` | FAQ-antwoord | De kosten van een website in Dordrecht starten bij 1500 euro voor een complete bedrijfssite. | (FAQ van stadspagina's verwijderd) |
| `/website-laten-maken-dordrecht` | Voordeel 'Betaalbaar maatwerk' | Vanaf 1500 euro krijg je een complete site op maat, zonder verborgen kosten. | Vanaf 990 euro krijg je een complete site op maat, zonder verborgen kosten. |
| `/website-laten-maken-ede` | FAQ-antwoord | Voor ondernemers in Ede hanteren wij een startprijs van 1500 euro voor een professionele website. | (FAQ van stadspagina's verwijderd) |
| `/website-laten-maken-ede` | Voordeel 'Betaalbaar maatwerk' | Vanaf 1500 euro krijg je een complete site op maat, zonder verborgen kosten. | Vanaf 990 euro krijg je een complete site op maat, zonder verborgen kosten. |
| `/website-laten-maken-eindhoven` | FAQ-antwoord | Een eenvoudige bedrijfswebsite voor een ondernemer in Eindhoven begint vanaf 1500 euro. | (FAQ van stadspagina's verwijderd) |
| `/website-laten-maken-eindhoven` | Voordeel 'Betaalbaar maatwerk' | Vanaf 1500 euro krijg je een complete site op maat, zonder verborgen kosten. | Vanaf 990 euro krijg je een complete site op maat, zonder verborgen kosten. |
| `/website-laten-maken-emmen` | FAQ-antwoord | Een eenvoudige bedrijfswebsite voor een ondernemer in Emmen begint vanaf 1500 euro. | (FAQ van stadspagina's verwijderd) |
| `/website-laten-maken-enschede` | FAQ-antwoord | Een website laten bouwen in Enschede kost vanaf 1500 euro voor een degelijke MKB site. | (FAQ van stadspagina's verwijderd) |
| `/website-laten-maken-groningen` | FAQ-antwoord | De kosten van een website in Groningen starten bij 1500 euro voor een complete bedrijfssite. | (FAQ van stadspagina's verwijderd) |
| `/website-laten-maken-haarlem` | FAQ-antwoord | Een eenvoudige bedrijfswebsite voor een ondernemer in Haarlem begint vanaf 1500 euro. | (FAQ van stadspagina's verwijderd) |
| `/website-laten-maken-leeuwarden` | FAQ-antwoord | De kosten van een website in Leeuwarden starten bij 1500 euro voor een complete bedrijfssite. | (FAQ van stadspagina's verwijderd) |
| `/website-laten-maken-leeuwarden` | Voordeel 'Betaalbaar maatwerk' | Vanaf 1500 euro krijg je een complete site op maat, zonder verborgen kosten. | Vanaf 990 euro krijg je een complete site op maat, zonder verborgen kosten. |
| `/website-laten-maken-leiden` | FAQ-antwoord | Een website laten bouwen in Leiden kost vanaf 1500 euro voor een degelijke MKB site. | (FAQ van stadspagina's verwijderd) |
| `/website-laten-maken-leiden` | Voordeel 'Betaalbaar maatwerk' | Vanaf 1500 euro krijg je een complete site op maat, zonder verborgen kosten. | Vanaf 990 euro krijg je een complete site op maat, zonder verborgen kosten. |
| `/website-laten-maken-maastricht` | FAQ-antwoord | Een eenvoudige bedrijfswebsite voor een ondernemer in Maastricht begint vanaf 1500 euro. | (FAQ van stadspagina's verwijderd) |
| `/website-laten-maken-nijmegen` | FAQ-antwoord | De kosten van een website in Nijmegen starten bij 1500 euro voor een complete bedrijfssite. | (FAQ van stadspagina's verwijderd) |
| `/website-laten-maken-nijmegen` | Voordeel 'Betaalbaar maatwerk' | Vanaf 1500 euro krijg je een complete site op maat, zonder verborgen kosten. | Vanaf 990 euro krijg je een complete site op maat, zonder verborgen kosten. |
| `/website-laten-maken-rotterdam` | FAQ-antwoord | De kosten van een website in Rotterdam starten bij 1500 euro voor een complete bedrijfssite. | (FAQ van stadspagina's verwijderd) |
| `/website-laten-maken-rotterdam` | Voordeel 'Betaalbaar maatwerk' | Vanaf 1500 euro krijg je een complete site op maat, zonder verborgen kosten. | Vanaf 990 euro krijg je een complete site op maat, zonder verborgen kosten. |
| `/website-laten-maken-tilburg` | FAQ-antwoord | Voor ondernemers in Tilburg hanteren wij een startprijs van 1500 euro voor een professionele website. | (FAQ van stadspagina's verwijderd) |
| `/website-laten-maken-tilburg` | Voordeel 'Betaalbaar maatwerk' | Vanaf 1500 euro krijg je een complete site op maat, zonder verborgen kosten. | Vanaf 990 euro krijg je een complete site op maat, zonder verborgen kosten. |
| `/website-laten-maken-utrecht` | FAQ-antwoord | Een website laten bouwen in Utrecht kost vanaf 1500 euro voor een degelijke MKB site. | (FAQ van stadspagina's verwijderd) |
| `/website-laten-maken-venlo` | FAQ-antwoord | Een eenvoudige bedrijfswebsite voor een ondernemer in Venlo begint vanaf 1500 euro. | (FAQ van stadspagina's verwijderd) |
| `/website-laten-maken-westland` | FAQ-antwoord | Voor ondernemers in Westland hanteren wij een startprijs van 1500 euro voor een professionele website. | (FAQ van stadspagina's verwijderd) |
| `/website-laten-maken-zaanstad` | FAQ-antwoord | Voor ondernemers in Zaanstad hanteren wij een startprijs van 1500 euro voor een professionele website. | (FAQ van stadspagina's verwijderd) |
| `/website-laten-maken-zoetermeer` | FAQ-antwoord | Voor ondernemers in Zoetermeer hanteren wij een startprijs van 1500 euro voor een professionele website. | (FAQ van stadspagina's verwijderd) |
| `/website-laten-maken-zoetermeer` | Voordeel 'Betaalbaar maatwerk' | Vanaf 1500 euro krijg je een complete site op maat, zonder verborgen kosten. | Vanaf 990 euro krijg je een complete site op maat, zonder verborgen kosten. |
| `/website-laten-maken-zwolle` | FAQ-antwoord | De kosten van een website in Zwolle starten bij 1500 euro voor een complete bedrijfssite. | (FAQ van stadspagina's verwijderd) |
| `/website-laten-maken-zwolle` | Voordeel 'Betaalbaar maatwerk' | Vanaf 1500 euro krijg je een complete site op maat, zonder verborgen kosten. | Vanaf 990 euro krijg je een complete site op maat, zonder verborgen kosten. |

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
- sitemap tegen gecrawlde routes, en geen sitemap-URL in `redirects.csv`;
- geen interne link naar een pad in `redirects.csv` (crawl én broncode) en geen weespagina's in de sitemap.

Uitkomst op 16-09-2026, na de aanvullingen (interne links naar redirects, weespagina's, footerlinks):

```
Basis: http://localhost:4310   Host: https://nieuwblik.com
Sitemap: 132 URL's · Redirects: 36 · Onbekende paden: 8 · Gecrawld: 132 (132 indexeerbaar)
Checks: 10191, fouten: 0

✓ Alles groen.
```

De crawl vindt alle 132 sitemap-URL's, en er zijn geen interne links naar redirects.

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
| `b3434eb` | SEO-verificatie (pass 1 en 2) en SEO-FIXES.md |
| `7f0d594` | Stadspagina's: plaatsnaam minder vaak herhaald |
| `892eabf` | Stadspagina's: FAQ verwijderd |
| `beac762` | Footer: links naar /reviews en /gratis-website-analyse |
