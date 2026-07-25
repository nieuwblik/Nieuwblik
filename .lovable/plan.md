
# SEO-verbeterplan Nieuwblik

Doel: van 60 keywords en autoriteit 6 naar meer verkeer op commerciële termen. We werken van snelle wins naar structurele groei.

---

## Fase 1 — Duw winnende pagina's naar top 3 (week 1)

**Kappers-pagina uitbouwen** (`/website-laten-maken-kapper`, nu #10 op 320/mnd)
- Kapper-specifieke sectie toevoegen: online afspraken maken, prijskaart tonen, Instagram-integratie.
- 2-3 echte kapper cases uit portfolio linken (of placeholder tot echte cases).
- FAQ specifiek voor kappers (5 vragen: kosten, afsprakensysteem, mobiel, SEO voor kappers, doorlooptijd).
- Prijsblok "vanaf €990" prominent.

**SEO Enkhuizen fixen** ("seo enkhuizen" #6, maar ranked `/blog` i.p.v. `/seo-enkhuizen`)
- Interne links vanaf homepage-footer, `/over-ons` en alle werkgebied-pagina's naar `/seo-enkhuizen`.
- Anchor variëren: "SEO Enkhuizen", "lokale SEO Enkhuizen", "vindbaar in Enkhuizen".
- H1 en title op `/seo-enkhuizen` scherper op de exacte term.

---

## Fase 2 — Technische opschoning www vs non-www (week 1)

Google indexeert nu twee versies van dezelfde pagina's (met en zonder `www`), wat autoriteit splitst.

- Alle canonicals in `SEOHead.tsx` en `companyInfo.url` verifiëren op `https://www.nieuwblik.com`.
- Interne links controleren — geen enkele hard-coded `nieuwblik.com` zonder `www`.
- Sitemap regenereren met alleen `www`-URLs.
- OG-tags en JSON-LD `url`-velden consistent maken.

---

## Fase 3 — Backlinks opschonen en versterken (week 2)

**Opschonen**
- Disavow-bestand aanmaken voor de spam-ankers ("high quality dofollow backlinks…", "seoflox.com", "sitetosocial.com").
- Instructie voor de gebruiker om dit in Search Console te uploaden.

**Versterken — lokale outreach**
- `.agent/backlink-outreach-plan.md` bestaat al; uitbreiden met concrete templates voor: WEEFF, Noordhollands Dagblad, Ondernemersvereniging Enkhuizen, MKB Noord-Holland, Streekomroep West-Friesland.
- Doel: 1-2 links per maand vanaf AS 30+.

---

## Fase 4 — Horeca-pagina naar page 1 (week 2-3)

"Horeca website laten maken" (480/mnd) staat op #47. De pagina is qua tekst goed, mist bewijs.

- 2-3 restaurant/café cases toevoegen met foto, resultaat en quote.
- Sub-blok "webshop voor bezorgen/reserveren" (long-tail intent).
- Interne links vanaf blog en homepage-portfolio.
- Extra FAQ: menukaart online, reserveringssysteem, Google Maps koppeling.

---

## Fase 5 — Stedenpagina's consolideren (week 3-4)

Van de 60 stedenpagina's ranken er ~5 op irrelevante brand-keywords (bv. "plan b hurksestraat eindhoven"). Dunne pagina's schaden autoriteit.

- Audit: welke stedenpagina's hebben in 3 maanden 0 vertoningen? Die 15-20 samenvoegen tot regionale hubs (Noord-Holland, Randstad, Zuid-Nederland, Oost-Nederland).
- Sterke steden (Enkhuizen, Amsterdam, Almere, Groningen, Eindhoven, Den Bosch) behouden en verdiepen met lokale content, buurten en cases.
- 301-redirects van samengevoegde pagina's naar de nieuwe hub, verwerkt in de router.
- Sitemap opnieuw genereren.

---

## Fase 6 — Pillar-content voor brede keywords (maand 2-3)

Voor de geldkeywords ("website laten maken" 14K/mnd, "webdesign bureau" 2400, "webshop laten maken" 1900) is diepgaande content nodig.

- Pillar-pagina `/website-laten-maken` als hub met alles: proces, prijzen, voorbeelden, FAQ, technische keuzes, doorlooptijd. 2500+ woorden.
- Pillar-pagina `/webshop-laten-maken` (bestaat, uitbouwen naar echte pillar).
- Blog-cluster van 6-8 supporting artikelen die naar de pillars linken (bv. "wat kost een website in 2026", "wordpress vs maatwerk", "webshop platforms vergelijken").

---

## Technische details

- Bestanden fase 1: `src/data/industries.ts` (kapper-content), `src/pages/IndustryLanding.tsx` (FAQ-blok), `src/pages/SeoEnkhuizen.tsx` (H1/title), `src/components/Footer.tsx` (interne link).
- Bestanden fase 2: `src/components/SEOHead.tsx`, `src/config/company.ts`, `scripts/generate-sitemap.ts`, `public/sitemap.xml`.
- Bestanden fase 3: nieuw `public/disavow.txt` (voor Search Console upload), `.agent/backlink-outreach-plan.md` uitbreiden.
- Bestanden fase 4: `src/data/industries.ts` (horeca content + cases), `src/pages/IndustryLanding.tsx` (case-blok).
- Bestanden fase 5: `src/data/cities.ts`, `src/App.tsx` (route consolidatie + redirects via `<Navigate>`), sitemap.
- Bestanden fase 6: nieuwe pagina `src/pages/WebsiteLatenMaken.tsx`, uitbreiding `src/pages/services/Webshops.tsx`, nieuwe blog-entries in `src/data/blogPosts.ts`.

## Volgorde

Fase 1 en 2 leveren de snelste zichtbare winst en pak ik als eerste op. Fases 3-4 versterken autoriteit en verdiepen bestaande winnaars. Fases 5-6 zijn structureel werk dat in maanden groeit.

Zeg of ik direct met fase 1+2 mag starten, of dat je eerst iets in dit plan wilt bijsturen.
