

## Plan: Werkgebied pagina's verbeteren

### 1. Footer: Werkgebied links verwijderen
**`src/components/Footer.tsx`** -- Verwijder het hele "Websites voor" blok (regels 76-123), inclusief de imports van `getLocalRegions` en `getMajorRegions`.

### 2. WerkgebiedDetail pagina redesign
**`src/pages/WerkgebiedDetail.tsx`** -- Volledig herontwerp met focus op:

- **Gecentreerde layout**: Alle secties `text-center` met `max-w-4xl mx-auto`
- **Minimalistischer design**: Minder Cards, meer witruimte, subtielere animaties
- **Team foto toevoegen**: Import `heroTeamImage` van `@/assets/justin-job-compressed.webp` en toon deze prominent (net als op de homepage)
- **Portfolio sectie toevoegen**: Een "Bekijk ons portfolio" sectie met de 4 projecten die ook op de homepage staan (Puur in Harmonie, BeNoted, Danique Kwakman, Erica van Dijk) als `ProjectCard` componenten in een 2x2 grid
- **Speelser en tijdloos**: Grotere typografie, meer ruimte tussen secties, subtiele kleuraccenten, minder visuele ruis (minder borders/cards)
- **Verwijder**: De sticky contact card in de hero (te druk), het "Voor bedrijven in..." sectie (te generiek)
- **Behoud**: Services grid, Waarom Nieuwblik, Proces stappen, CTA -- maar allemaal gecentreerd

Structuur nieuwe pagina:
```text
1. Hero (gecentreerd) - badge, h1, intro, CTA buttons
2. Team foto (gecentreerd, breed)
3. Services (gecentreerd, 2x2 grid)
4. Waarom Nieuwblik (gecentreerd, 3 kolommen)
5. Portfolio sectie - "Bekijk ons portfolio" met 4 ProjectCards
6. Proces stappen (gecentreerd)
7. CTA
```

### 3. Imports nodig
- `heroTeamImage` van `@/assets/justin-job-compressed.webp`
- `ProjectCard` component
- `projects` data uit `@/data/projects`

