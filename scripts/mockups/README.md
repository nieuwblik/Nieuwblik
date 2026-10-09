# Case-mockups

Vaste opzet voor de portfoliocases: bovenaan de site in een monitor, verderop
de mobiele site op een iPhone in de hand. Alle beelden en instellingen staan
hier, zodat elke nieuwe case er precies hetzelfde uitziet.

## Nieuwe case in drie stappen

1. Beelden maken (screenshots, statusbalk en perspectief gaan automatisch):

   ```bash
   node scripts/mockups/nieuwe-case.mjs <slug> <url> --verberg "<css-selectors>"
   ```

   - `<slug>` is de slug uit `src/data/projects.ts`.
   - `--verberg`: zwevende knoppen of pop-ups van de klantsite die niet in beeld
     mogen (bij Taxi Drechterland: `"button.fixed.right-5.bottom-6, div.fixed.bottom-3.left-3"`).
   - `--alleen monitor` of `--alleen telefoon` maakt er maar één.
   - De cookiemelding wordt altijd geweigerd, nooit geaccepteerd.

2. De regels die het script print toevoegen aan `src/data/caseMockups.ts`
   (`caseMockups` voor de monitor, `caseTelefoons` voor de telefoon).
   `PortfolioDetail.tsx` pakt ze dan vanzelf op.

3. `npm run sitemap:check`, typecheck, build en `npm run seo:verify`.
   Kijk de beelden na: staat er niets vreemds in beeld (chatwidget, banner)?

Benodigd: Chrome op `C:/Program Files/Google/Chrome/Application/chrome.exe`
(of `CHROME_PAD`) en `puppeteer-core` uit de npx-cache (of `PUPPETEER_CORE_PAD`).
`puppeteer-core` is bewust geen projectafhankelijkheid.

## Monitor (hero, `src/components/CaseMockup.tsx`)

- **Foto's:** `src/assets/mockup/monitor-liggend.webp` (3840×2160, desktop) en
  `monitor-staand.webp` (1932×4391, mobiel). Zwart-wit studiomonitor uit Higgsfield
  met een zwart scherm. De site staat er niet in gebakken, maar ligt in code in de
  gemeten schermrechthoek.
- **Schermrechthoek** (in pixels van de foto):
  - liggend: links 1083, boven 494, 1675×919;
  - staand: links 129, boven 1517, 1675×918.
- **Screenshot:** full-page, venster 1440×790 (verhouding van het monitorscherm),
  dpr 1,5, daarna 1800 breed, WebP q82. Maximaal 16383 px hoog (WebP-limiet);
  langer wordt afgekapt.
- **Gedrag:**
  - Hero is 100svh en vult het scherm (cover op basis van de fotoverhouding).
  - Na 400 ms gaat de monitor aan met een retro-animatie van 1500 ms.
  - Daarna scrolt de site met een constante snelheid van 0,25 schermhoogte per seconde.
  - Hover pauzeert het scrollen en toont een groene "Scroll"-blob als cursor.
  - Het muiswiel scrollt in het scherm, en bovenaan en onderaan door naar de pagina.
  - Een groene gloed van het scherm valt op de vloer, niet over de voet.
  - Bij reduced motion staat de monitor meteen aan en scrolt er niets.

## Telefoon (casesectie, `src/components/CaseTelefoon.tsx`)

- **Basisfoto:** `basis/telefoon-groen-9x16.webp` (2160×3840). Een hand met een
  iPhone 18 Pro, warm zonlicht en een wazige achtergrond, met een egaal groen
  (#00FF00) scherm. Staand 9:16, zodat de foto op halve breedte 110vh kan vullen
  zonder in te zoomen.
- **Mobiele screenshot:** 402×820 pt @3x (iPhone-viewport zonder statusbalk), met
  een statusbalk van 54 pt erboven (9:41, bereik, wifi, batterij, in de kleur van
  de bovenrand van de site). Samen 1206×2622.
- **In de foto zetten** (`telefoon.mjs`):
  - Groene pixels opsporen.
  - De rechte stukken van de vier schermranden fitten; de hoeken zijn hun snijpunten.
  - De screenshot met een homografie (perspectief) in het scherm leggen, met 4×
    supersampling.
  - Afgeronde hoeken en het Dynamic Island blijven staan, omdat alleen groen vervangen wordt.
  - Lichte warme glans op het glas, groene zweem van de randen halen.
  - WebP q84.
- **Weergave:**
  - Desktop: links op halve breedte, 110vh hoog en sticky, maar nooit hoger dan de foto zelf.
  - Mobiel: 4:5.
  - De foto is altijd precies kolombreed in zijn eigen verhouding.
  - De telefoon staat in het midden van het kader (`midden: 0.44` = verticaal
    midden van de telefoon in de basisfoto).
- **Animatie (GSAP ScrollTrigger, scrub):**
  - Zoom van 100% naar 118% vanuit het midden van de telefoon, en 6% naar rechts.
  - Loopt van "kolom komt onderin beeld" tot "kolom eindigt onderin beeld", dus
    tot het einde van het vastplakken.
  - Bij reduced motion staat de foto stil.
- **Tekst eromheen** (`PortfolioDetail.tsx`):
  - Na de intro de kop "Over …" met de eerste twee alinea's van `detail.details`.
  - Daarnaast de rest van de alinea's, "Het doel", "Het idee" en "Opgeleverd in …".

## Opnieuw genereren in Higgsfield

Alleen nodig voor een andere telefoonfoto. Model `gpt_image_2_5`, 4k, quality high,
9:16. Gebruik als referentie de vorige foto (job `aa43ebb3-cb3b-4a25-87bf-0dddd05c9401`;
de huidige 9:16 is job `45bfce20-30db-4621-bc6c-ecc1c34d96f7`). Prompt:

> Recreate the reference photo as a tall vertical 9:16 photograph with exactly the
> same look: a hand holding the same iPhone 18 Pro (titanium frame, thin even black
> bezels, Dynamic Island) upright and slightly angled toward the camera, same warm
> golden late-afternoon sunlight, same soft creamy heavily blurred bokeh background
> in warm beige and brown tones, shallow depth of field, premium Apple-style
> advertising photography. Composition: the phone sits in the vertical middle of the
> frame and fills about 45% of the image width, with plenty of softly blurred
> background above the phone and the hand and forearm continuing down to the bottom
> edge of the frame. The phone screen is completely filled edge to edge with flat
> uniform pure chroma green #00FF00, no reflections, no glare, no text, no icons, no
> UI, only the black Dynamic Island visible on the green. The full phone is visible
> and no fingers cover the screen.

Let op:

- `outpaint_image` maakt een heel nieuwe scène in plaats van de foto te verlengen.
  Gebruik dat dus niet om een foto hoger te maken.
- Pas na een nieuwe foto `TELEFOON_MIDDEN` in `nieuwe-case.mjs` aan (het verticale
  midden van de telefoon, 0-1).
