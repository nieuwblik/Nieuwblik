## Plan: blog over Nieuwblik sponsoring Kevin Mos, Hengelo Roadrace 2026

Nieuwe blogpost in de bestaande BeNoted minimalistische schrijfstijl, volledig in Nederlands, met emotionele toon (vriendschap boven geld), pricing/diensten verwijzingen weg, focus op verhaal + lokale SEO + outbound links naar Nelon Racing en Hengelo Roadrace YouTube.

### 1. Afbeeldingen toevoegen aan project

Kopieer 6 uploads naar `src/assets/blog/`:

```text
user-uploads://nieuwblik_sponsor_kevin_mos_mobu_nelon_racing.webp   -> kevin-mos-nieuwblik-bike-rear.webp
user-uploads://nieuwblik_sponsor_kevin_mos_mobu_nelon_racing2.webp  -> kevin-mos-nieuwblik-bike-front.webp  (cover)
user-uploads://nieuwblik_sponsor_kevin_mos_mobu_nelon_racing3.webp  -> kevin-mos-nieuwblik-portrait.webp
user-uploads://image-51.png                                          -> kevin-mos-cornering.webp
user-uploads://image-52.png                                          -> kevin-mos-rain-race.webp
user-uploads://image-53.png                                          -> kevin-mos-team-nelon-racing.webp
```

PNG's worden via `nix imagemagick` geconverteerd naar WebP (volgens project image bundling regel: strict WebP).

### 2. Blogpost toevoegen in `src/data/blogPosts.ts`

Nieuwe entry bovenaan de array zodat hij eerst zichtbaar is:

- **slug**: `kevin-mos-nieuwblik-hengelo-roadrace-2026`
- **image**: `kevin-mos-nieuwblik-bike-front.webp` (cover)
- **seoTitle**: "Nieuwblik sponsort Kevin Mos, Hengelo Roadrace 2026" (<60 chars)
- **seoKeywords**: "Kevin Mos, Hengelo Roadrace, Nelon Racing, Mobu Tuning, Nieuwblik sponsoring, motorracen, straatrace Hengelo, MKB sponsoring"
- **excerpt**: emotioneel, 1 zin: vriendschap, sponsoring, racewinst boven geld
- **date**: vandaag (2026-05-07)
- **readingTime**: 4

### 3. Inhoud structuur (BeNoted minimalistisch, korte alineas)

```text
H1 (auto via title)
Lead alinea — telefoontje van Kevin: "ik kom net wat tekort voor Hengelo"
H2 Een telefoontje, drie weken voor de race
H2 Waarom geld geen rol speelde
  blockquote: "Een goede vriend supporten weegt zwaarder dan het bedrag op de factuur."
H2 Een onvergetelijk weekend in de pit
  - polsbandje, pitlane toegang, alles meegemaakt
  IMG: team foto
H2 De machine van Kevin (#86)
  IMG: bike front + rear
  - Nelon Racing als hoofdpartner uitlichten
H2 Samen met sterke partners
  outbound links: Nelon Racing, Mobu Tuning, etc.
H2 Justin en Kevin, vrienden voor het leven
  - 2-3x per week zien, altijd klaarstaan
  IMG: cornering + rain race
H2 Kijk de races terug
  - YouTube embed Hengelo Roadrace via LazyYouTube (videoId r5CkgPQHukU)
H2 Wat dit betekent voor Nieuwblik
  - lokaal MKB, vriendschap, support, geen websiteverkoop pitch
Slot — korte poëtische lijn
```

### 4. Outbound links

- Nelon Racing — `https://www.nelon.nl` (verifieer via context, anders fallback met `rel="noopener"`)
- Mobu Tuning, Willemse, MWAY — naam noemen, link indien bekend, anders alleen tekst
- Hengelo Roadrace YouTube video: `https://www.youtube.com/watch?v=r5CkgPQHukU` via `LazyYouTube` component (videoId `r5CkgPQHukU`)

### 5. Sitemap

Voeg `/blog/kevin-mos-nieuwblik-hengelo-roadrace-2026` toe aan `public/sitemap.xml` met `lastmod` van vandaag, priority 0.7.

### 6. Schrijfregels (per memory)

- 100% Nederlands, sentence case
- Geen em dashes, alleen komma's of korte streepjes
- Korte alineas (max 3 regels)
- Emotionele tone-of-voice, action-driven
- Geen pricing/diensten pitch, dit is pure storytelling/sponsoring content
- Geen Twitter, geen verboden elementen

### Bestanden

```text
NIEUW
- src/assets/blog/kevin-mos-nieuwblik-bike-front.webp
- src/assets/blog/kevin-mos-nieuwblik-bike-rear.webp
- src/assets/blog/kevin-mos-nieuwblik-portrait.webp
- src/assets/blog/kevin-mos-cornering.webp
- src/assets/blog/kevin-mos-rain-race.webp
- src/assets/blog/kevin-mos-team-nelon-racing.webp

GEWIJZIGD
- src/data/blogPosts.ts   (nieuwe post bovenaan, 6 image imports)
- public/sitemap.xml      (nieuwe URL)
```

Na akkoord bouw ik dit in 1 doorloop.