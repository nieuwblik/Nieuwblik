# Conversie boost plan voor Nieuwblik (herzien)

Vijf concrete toevoegingen plus opschoning van de hero. Alles in lijn met bestaande design tokens, light mode, 100% Nederlands.

## 1. Trustbar direct onder de hero

Nieuw component `TrustBar.tsx` op `bg-secondary`, dunne strook:
- 5 sterren in accent groen
- Tekst: "5,0 op Google, op basis van 15+ reviews"
- Scheidingslijn
- Rij met 4 tot 6 grijswaarden klantlogo's uit bestaande projecten
- Mobiel: sterren + tekst boven, logo's in 3 kolommen grid eronder

Plek: tussen hero en zoekmachines sectie in `Index.tsx`.

## 2. Pakketten / vanaf-prijzen sectie

Nieuw component `PricingPackages.tsx` met 3 kaarten:
- **Starter**, vanaf 990 euro, voor zzp en kleine ondernemers, 1 tot 5 paginas, responsive, basis SEO, contactformulier
- **Professional**, vanaf 1990 euro, gemarkeerd als "Meest gekozen" met accentrand, tot 10 paginas, CMS, uitgebreide SEO, blogfunctie, koppelingen
- **Op maat**, prijs op aanvraag, webshops en complexe sites, alle functies inbegrepen

Elke kaart: titel, vanaf-prijs, korte zin, 4 tot 5 bullets met checkmarks in accent kleur, CTA "Vraag offerte aan" naar `/start-je-project`.

Plek: tussen testimonials en featured projects.

## 3. Onze aanpak in 4 stappen

Nieuw component `ProcessSteps.tsx`. Horizontale tijdlijn op desktop, verticaal op mobiel:
1. **Kennismaking**, gratis intakegesprek, 30 min
2. **Ontwerp**, concept en interactieve preview binnen 1 week
3. **Bouw**, development, content en testen
4. **Lancering**, live zetten, training, 30 dagen nazorg

Plek: vlak boven de testimonials.

## 4. FAQ sectie hergebruiken op homepage

`FAQSection` component wordt al gemount op de homepage. Ik werk het eerste antwoord bij zodat de prijzen kloppen:
- "Wat kost een website?" antwoord verwijst naar **vanaf 990 euro** voor Starter en **vanaf 1990 euro** voor Professional, plus maatwerk op aanvraag.

Daarnaast werk ik **alle prijsverwijzingen in de 60 landingspagina data** (`src/data/cities.ts` en `src/data/industries.ts`) bij van 1500 euro naar 990 euro, zodat het overal consistent is.

## 5. Sticky mobiele CTA-bar

Nieuw component `MobileStickyCTA.tsx`, vast onderaan op mobiel:
- 3 knoppen naast elkaar: "Bel" (tel:), "WhatsApp" (groen), "Offerte" (accent)
- 56px hoog, `safe-area-inset-bottom` voor iPhone
- Verschijnt na 200px scrollen met fade-in
- Verbergt bestaande WhatsAppButton op mobiel zodat ze niet overlappen
- Globaal gemount in `App.tsx` zodat hij overal werkt

## Bonus opschoning hero (direct meenemen)

In `src/pages/Index.tsx` hero:
- LinkedIn en WhatsApp icons rij verwijderen
- Zwevende "Start je project" knop op de teamfoto verwijderen (Start nu knop blijft)
- Subkop aanscherpen naar concrete belofte met doorlooptijd: "Een nieuwe website binnen 4 weken, vanaf 990 euro. Geen verrassingen."

## Bestanden

```text
NIEUW
- src/components/TrustBar.tsx
- src/components/PricingPackages.tsx
- src/components/ProcessSteps.tsx
- src/components/MobileStickyCTA.tsx

GEWIJZIGD
- src/pages/Index.tsx       (hero opschonen, 3 nieuwe secties inhaken)
- src/components/FAQSection.tsx (eerste antwoord prijs bijwerken)
- src/data/cities.ts        (prijzen 1500 naar 990)
- src/data/industries.ts    (prijzen 1500 naar 990)
- src/App.tsx               (MobileStickyCTA globaal mounten)
```

## Technische noten

- Alle tokens via `bg-background`, `bg-secondary`, `text-accent`, `text-foreground`
- Lazy load `PricingPackages` en `ProcessSteps` via `React.lazy` voor PageSpeed
- `MobileStickyCTA` blijft eager (kritisch voor conversie)
- `TrustBar` blijft eager omdat hij above-the-fold staat
- Geen em dashes, sentence case, 100% Nederlands
- WhatsAppButton component op mobiel verbergen waar sticky bar staat

Na akkoord bouw ik dit in 1 doorloop.