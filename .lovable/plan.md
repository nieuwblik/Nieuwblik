

## Em dash (—) verwijderen door de hele site

### Overzicht
141 voorkomens van "—" in 7 bestanden. Elk wordt vervangen door een passend alternatief (meestal een komma, punt, of dubbele punt) zodat de tekst natuurlijker leest.

### Betrokken bestanden

**1. `src/data/blogPosts.ts`** (grootste deel, ~130 voorkomens)
- Alle em dashes in NL + EN blogcontent vervangen
- Context-afhankelijke vervanging: "—" wordt per zin bekeken en vervangen door het meest natuurlijke leesteken (komma, punt, dubbele punt, of gewoon een spatie met streepje "-")
- Voorbeelden:
  - `"Topdivisie — het hoogste"` → `"Topdivisie, het hoogste"`
  - `"Enza Zaden — Wereldwijd actief"` → `"Enza Zaden - Wereldwijd actief"`
  - `"geen kostenpost — het is"` → `"geen kostenpost, het is"`

**2. `src/components/ProblemSolutionSection.tsx`** (2 voorkomens)
- `"Snelle realisatie — van strategie"` → komma of streepje
- `"Alles uit handen — jij geeft"` → komma of streepje

**3. `src/components/ProblemSolutionSectionNew.tsx`** (2 voorkomens)
- Zelfde als hierboven

**4. `src/pages/services/WebsiteOpMaat.tsx`** (1 voorkomen)
- `"— Niels van Esveld"` → `"- Niels van Esveld"`

**5. `src/pages/services/Webshops.tsx`** (1 voorkomen)
- `"— Tevreden webshop klant"` → `"- Tevreden webshop klant"`

**6. `src/pages/services/Ecommerce.tsx`** (1 voorkomen)
- `"— Maarten, Kitchenz"` → `"- Maarten, Kitchenz"`

**7. `src/components/ResponsiveShowcase.tsx`** (1 voorkomen)
- `aria-label="Responsive design showcase — Puur in Harmonie"` → streepje

### Aanpak
- Verwerking via script vanwege het grote aantal voorkomens in blogPosts.ts
- Elke vervanging wordt context-bewust gedaan (niet blindelings zoeken-en-vervangen)
- Testimonial-attributies (`— Naam`) worden `- Naam`
- Tussenzinnen (`iets — iets`) worden `, ` of ` - ` afhankelijk van context

