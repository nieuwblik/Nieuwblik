# Case-mockups

Vaste opzet voor de portfoliocases: bovenaan de site in een toestel (monitor of
tablet), verderop de mobiele site op een iPhone in de hand. Alle beelden en
instellingen staan hier, zodat elke nieuwe case er precies zo uitziet.

| Stijl | Hero | Telefoon | Gebruikt bij |
| --- | --- | --- | --- |
| Warm | monitor (zwart-wit studio, retro aan) | `warm`: hand in de zon, wazige achtergrond | Taxi Drechterland |
| Studio | tablet (tegenlicht, grijze studio) | `studio`: lichte studio, schuin perspectief | Feigro Dakwerken |

## Nieuwe case in drie stappen

1. Beelden maken (screenshots, statusbalk en perspectief gaan automatisch):

   ```bash
   node scripts/mockups/nieuwe-case.mjs <slug> <url> --toestel tablet --telefoon studio --verberg "<css-selectors>"
   ```

   - `<slug>` is de slug uit `src/data/projects.ts`.
   - `--verberg`: zwevende knoppen of pop-ups van de klantsite die niet in beeld
     mogen (bij Taxi Drechterland: `"button.fixed.right-5.bottom-6, div.fixed.bottom-3.left-3"`).
   - `--toestel monitor` (standaard) of `tablet`: bepaalt het venster van de hero-screenshot.
   - `--telefoon warm` (standaard) of `studio`: welke telefoonfoto.
   - `--alleen hero` of `--alleen telefoon` maakt er maar één.
   - De cookiemelding wordt altijd geweigerd, nooit geaccepteerd.
   - Vlak voor de opname staan alle CSS-overgangen op 0 s, zodat een slider of
     fade nooit half in beeld komt (feigro.nl heeft een overvloeiende hero-slider).

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

## Tablet (hero, `src/components/CaseTablet.tsx`)

- **Foto's:** `src/assets/mockup/tablet-liggend.webp` (3840×2160) en
  `tablet-staand.webp` (2160×3840). Twee handen houden een tablet omhoog tegen een
  egaal lichtgrijze, van achteren belichte studio-achtergrond. Het scherm is zwart
  (tablet uit); de groene originelen staan in `basis/tablet-groen-*.webp`.
- **Scherm in perspectief:** de tablet staat schuin, dus de site komt in een vlak
  van 1000 px breed (verhouding van het scherm, met afgeronde hoeken) dat met een
  CSS `matrix3d` op de vier opgemeten schermhoeken wordt gelegd. De matrix wordt
  bij elke schermmaat opnieuw berekend; tot dan is alleen de foto te zien.
- **Masker:** `src/assets/mockup/tablet-*-masker.png` is het groene vlak uit de
  originele foto (wit, alfa = groenheid). Het scherm wordt daarmee bijgesneden, zodat
  het de echte schermrand volgt (in een gegenereerde foto niet kaarsrecht) en een duim
  op de rand altijd vóór de site blijft. Het vlak zelf is 0,8% ruimer dan de gefitte
  hoeken. Maken: `schermUit()` geeft het masker mee.
- **Opgemeten** met `schermUit()` in `telefoon.mjs` (hoeken als fractie van de foto):
  - liggend: hoeken 0,2868/0,2177 · 0,6914/0,1988 · 0,7085/0,6777 · 0,2981/0,7036,
    verhouding 1,50, hoekafronding 2,16% van de schermbreedte;
  - staand: 0,1591/0,3194 · 0,8389/0,3155 · 0,8544/0,5889 · 0,1634/0,5933,
    verhouding 1,41, afronding 1,96%.
- **Screenshot:** full-page, venster 1440×960 (verhouding 1,50), dpr 1,25, 1800 breed.
- **Licht** (gemeten in de referentiefoto): achtergrond egaal RGB ~204, handen bijna
  zwart (silhouet), bovenrand met randlicht, scherm zelflichtend en ~7-10% donkerder
  naar de hoeken, geen glans. Daarom over het scherm een vignettering van 11% naar de
  hoeken, een grijze sluier van 5% (iets minder contrast door het tegenlicht) en een
  dunne donkere rand; geen glans.
- **Aangaan:** na 400 ms komt het beeld in 900 ms op, iets te helder en dan normaal
  (zoals een tablet die wakker wordt). Daarna hetzelfde scrollgedrag als de monitor
  (`useSchermScroll` in `SchermScroll.tsx`: 0,25 schermhoogte per seconde, hover
  pauzeert, wiel scrollt in het scherm, groene blob).

## Telefoon (casesectie, `src/components/CaseTelefoon.tsx`)

- **Basisfoto's** (2160×3840, staand 9:16 zodat de foto op halve breedte 110vh kan
  vullen zonder in te zoomen), met een egaal groen (#00FF00) scherm:
  - `basis/telefoon-groen-9x16.webp` (warm): hand met iPhone 18 Pro in warm zonlicht,
    wazige achtergrond. `midden` 0,44, `telefoonHoogte` 0,44.
  - `basis/telefoon-studio-9x16.webp` (studio): hand met een lichte iPhone 18 Pro,
    schuin in perspectief, lichte studio. `midden` 0,47, `telefoonHoogte` 0,52.
- **Mobiele screenshot:** 402×820 pt @3x (iPhone-viewport zonder statusbalk), met
  een statusbalk van 54 pt erboven (9:41, bereik, wifi, batterij, in de kleur van
  de bovenrand van de site). Samen 1206×2622.
- **In de foto zetten** (`telefoon.mjs`):
  - Groene pixels opsporen.
  - De rechte stukken van de vier schermranden fitten; de hoeken zijn hun snijpunten.
  - De screenshot met een homografie (perspectief) in het scherm leggen, met 4×
    supersampling.
  - Afgeronde hoeken en het Dynamic Island blijven staan, omdat alleen groen vervangen wordt.
  - Glans op het glas per foto (`GLANS` in `telefoon.mjs`): warm en diagonaal
    buiten in de zon, neutraal en zachter in de studio. Groene zweem van de randen halen.
  - WebP q84.
- **Weergave:**
  - Desktop: links op halve breedte, 110vh hoog en sticky, maar nooit hoger dan de foto zelf.
  - Mobiel: 4:5.
  - De foto is altijd precies kolombreed in zijn eigen verhouding.
  - De telefoon staat in het midden van het kader (`midden: 0.44` = verticaal
    midden van de telefoon in de basisfoto).
- **Animatie (GSAP ScrollTrigger, scrub):**
  - Zoom van 100% naar 118% vanuit het midden van de telefoon, en 6% naar rechts.
    Past de telefoon bij 118% niet meer in het kader (ultrabreed, laag venster), dan
    zoomt hij minder; de verschuiving schaalt mee.
  - Per foto aan te passen in `caseMockups.ts`:
    - `effect`: eindstand voor desktop en mobiel apart. De studiofoto (Feigro) gebruikt
      108% en 3% op desktop, 104% en 1,5% op mobiel, omdat de telefoon daar al groot in beeld staat.
    - `schaal`: breedte van de foto als deel van de kolom op desktop. De studiofoto
      gebruikt 0,8.
    - `achtergrond`: kleur van de egale achtergrond (studio: `rgb(242, 241, 241)`).
      Die vult de rest van de kolom; de foto loopt er aan de zijkanten en bovenkant zacht
      in over, de onderkant (arm) loopt altijd door tot de rand.
  - Loopt van "kolom komt onderin beeld" tot "kolom eindigt onderin beeld", dus
    tot het einde van het vastplakken.
  - Bij reduced motion staat de foto stil.
- **Tekst eromheen** (`PortfolioDetail.tsx`):
  - Na de intro de kop "Over …" met de eerste twee alinea's van `detail.details`.
  - Daarnaast de rest van de alinea's, "Het doel", "Het idee" en "Opgeleverd in …".

## Opnieuw genereren in Higgsfield

Alleen nodig voor een andere foto. Model `gpt_image_2_5`, 4k, quality high.

- Studio-stijl (Feigro): tablet liggend job `9959d2ae-ea81-432f-8f28-96b3deafc393`
  (16:9), tablet staand `63f2ceed-50aa-4fb6-87fa-5dae82037a6c` (9:16), telefoon
  `53e6041f-30b3-4737-94ca-9d429861af82` (9:16). Kern van de tabletprompt: twee handen
  houden een iPad Pro liggend omhoog, bijna recht van voren, egaal lichtgrijze studio
  van achteren belicht, handen als bijna zwart silhouet, randlicht op de bovenrand,
  scherm egaal #00FF00, vingers alleen op de rand.
- Warme stijl (Taxi), telefoon 9:16: referentie job `aa43ebb3-cb3b-4a25-87bf-0dddd05c9401`,
  huidige foto job `45bfce20-30db-4621-bc6c-ecc1c34d96f7`. Prompt:

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
- Na een nieuwe telefoonfoto `midden` en `telefoonHoogte` in `TELEFOONS` in
  `nieuwe-case.mjs` aanpassen. Na een nieuwe tabletfoto de hoeken, verhouding en
  afronding opmeten met `schermUit()` en in `CaseTablet.tsx` zetten.
