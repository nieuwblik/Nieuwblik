## Doel

Op de twee case-pagina's van Quantum Rehab Europe en Pride Mobility Europe een aparte, elegante 'Met dank aan' sectie tonen die Roy Kooiman en verbeterjewebsite.nl erkent als samenwerkingspartner.

## Aanpak

### 1. Datamodel uitbreiden (`src/data/projects.ts`)

Optioneel veld `credits` toevoegen aan het `Project` interface, zodat alleen projecten met een samenwerking deze sectie tonen:

```ts
credits?: {
  intro: string;     // bv. "Mede mogelijk gemaakt door"
  name: string;      // "Roy Kooiman"
  company: string;   // "verbeterjewebsite.nl"
  url: string;       // "https://www.verbeterjewebsite.nl"
}
```

Dit veld vullen voor de twee projecten met dezelfde tekst:
- intro: "Mede mogelijk gemaakt door"
- name: "Roy Kooiman"
- company: "verbeterjewebsite.nl"
- url: "https://www.verbeterjewebsite.nl"

### 2. Nieuwe sectie in `src/pages/PortfolioDetail.tsx`

Tussen de 'Case' sectie en de 'CTA' sectie een conditionele sectie renderen wanneer `project.credits` bestaat. Stijl in lijn met bestaande secties (witruimte, accent kleur, sentence case, geen em dashes):

- Kleine kop in accent kleur, uppercase tracking: "Met dank aan"
- Grote regel: "Mede mogelijk gemaakt door Roy Kooiman"
- Subregel met klikbare link naar verbeterjewebsite.nl (target=_blank, rel=noopener noreferrer, met ExternalLink icon)
- Korte uitleg: "Een waardevolle samenwerkingspartner die heeft bijgedragen aan de realisatie van dit project."
- Container met `border-t border-border/50`, ruime padding, gecentreerd of links uitgelijnd passend bij de overige secties
- Subtiele framer-motion fadeUp animatie consistent met andere secties

### 3. Geen wijzigingen elders

- Homepage portfolio sectie: geen wijziging (credits enkel zichtbaar op detailpagina).
- Geen invloed op SEO meta, geen invloed op Index/Portfolio listing.
- Voldoet aan Core regels: 100% Nederlands, sentence case, geen em dashes, geen donker thema.

## Resultaat

Bezoekers zien op beide case-pagina's een nette, professionele credit-sectie die de samenwerking met Roy Kooiman / verbeterjewebsite.nl erkent, zonder de bestaande layout of performance te verstoren.
