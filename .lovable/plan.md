# Meer SEO-stadspagina's + portfolio op elke SEO-pagina

## Advies: welke steden en regio's (Semrush, markt Nederland)

| Pagina | Zoekterm | Volume/mnd | Moeilijkheid | Advies |
|---|---|---|---|---|
| /seo-haarlem | seo haarlem | ~1.000 | 13 (laag) | Bouwen, grootste kans |
| /seo-zaandam | seo zaandam + seo zaanstad | ~480 + ~320 | 13 / 9 | Bouwen, één pagina voor Zaanstreek |
| /seo-heerhugowaard | seo heerhugowaard | ~390 | 16 | Bouwen, dicht bij huis |
| /seo-schagen | seo schagen | ~260 | 11 | Bouwen |
| /seo-noord-holland | seo noord-holland | ~170 | 14 | Bouwen als regiopagina die alle steden verbindt |
| /seo-west-friesland | (geen volume gemeten) | onbekend | - | Bouwen als regiohub, sterk voor merk en interne links |
| Den Helder, Medemblik | 40 en 10 | klein | laag | Nu overslaan, kan later |
| Amsterdam | ~1.300 | 37 (gemiddeld) | Overslaan, te veel concurrentie voor nu |

Daarnaast: "seo bureau alkmaar" (~720) en "seo bureau hoorn" (~390) versterken door die term in titel en H1 van de bestaande pagina's te verwerken, geen nieuwe pagina's (voorkomt dat ze elkaar beconcurreren).

## Wat er gebouwd wordt
1. Zes nieuwe SEO-pagina's (tabel hierboven) met dezelfde opbouw als SEO Hoorn en Alkmaar: eigen titel en beschrijving, lokale intro, prijzen (eenmalig vanaf €750, maandpakket vanaf €350), 5 vragen en antwoorden, links naar buurpagina's en de stadspagina voor websites.
2. Portfolioblok "Een blik op ons werk" op elke SEO-stadspagina (alle negen: Enkhuizen, Hoorn, Alkmaar, Purmerend en de zes nieuwe): Pride Mobility, Quantum Rehab, Esveld Installatie, Bushido Shop, VV Madjoe en MHB Techniek, met foto en link naar de case.
3. Footer: kolom SEO uitbreiden met de nieuwe pagina's (regio's bovenaan, dan steden).
4. Sitemap en llms.txt bijwerken.

Lokale details (wijken, bedrijventerreinen) schrijf ik zelf; die moet je nakijken.

## Technical details
- Nieuwe entries in `src/data/seoSteden.ts`, routes in `src/routes/_public/seo-*.tsx` via `SeoStad`.
- Nieuw component `SeoPortfolio` dat de zes cases uit `projects.ts` op slug pakt (`pride-mobility-europe`, `quantum-rehab-europe`, `esveld-installatie`, `bushido-shop`, `vv-madjoe`, `mhb-techniek`), lazy-loaded WebP; ingebouwd in `SeoStad.tsx` en de aparte `SeoEnkhuizen.tsx`.
- Titels en H1 Hoorn/Alkmaar aanvullen met "SEO bureau".
- Sitemap opnieuw genereren, controle in de preview.
