# Case-mockups

Vaste opzet voor de portfoliocases: bovenaan de site in een toestel (monitor of
tablet), verderop de mobiele site op een iPhone in de hand. Alle beelden en
instellingen staan hier, zodat elke nieuwe case er precies zo uitziet.

| Stijl | Hero | Telefoon | Gebruikt bij |
| --- | --- | --- | --- |
| Warm | monitor (zwart-wit studio, retro aan) | `warm`: hand in de zon, wazige achtergrond | Taxi Drechterland |
| Studio | tablet (tegenlicht, grijze studio) | `studio`: lichte studio, schuin perspectief | Feigro Dakwerken |
| Natuur | bureau (monitor voor raam met groen, warm zonlicht) | `bank`: plat op een groen bankje in de zon | Een Bundel Geluk |
| Avond | werkplek (monitor, warme lamp erachter, GSAP-aanzet) | `schoot`: in twee handen op schoot, groene kleding (magenta sleutel) | VV Madjoe |

## Nieuwe case in drie stappen

1. Beelden maken (screenshots, statusbalk en perspectief gaan automatisch):

   ```bash
   node scripts/mockups/nieuwe-case.mjs <slug> <url> --toestel tablet --telefoon studio --verberg "<css-selectors>"
   ```

   - `<slug>` is de slug uit `src/data/projects.ts`.
   - `--verberg`: zwevende knoppen of pop-ups van de klantsite die niet in beeld
     mogen (bij Taxi Drechterland: `"button.fixed.right-5.bottom-6, div.fixed.bottom-3.left-3"`).
   - `--toestel monitor` (standaard), `tablet`, `bureau` of `werkplek`: bepaalt het venster van de hero-screenshot.
   - `--telefoon warm` (standaard), `studio`, `bank` of `schoot`: welke telefoonfoto.
   - `--alleen hero` of `--alleen telefoon` maakt er maar één.
   - `--spiegel-desktop`: maakt ook `<slug>-telefoon-desktop.webp`, met de lege
     basisfoto gespiegeld en daarna de site erin (dus gewoon leesbaar). Op desktop kijkt
     het scherm dan naar de tekst rechts; mobiel houdt het origineel (`srcSetDesktop`
     in `caseTelefoons`). Gebruikt bij Feigro.
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

## Toestellen in perspectief (hero, `src/components/CaseToestel.tsx`)

Tablet en bureau gebruiken dezelfde component; per toestel staan de foto's, de
opmeting, het masker, het licht en de kleur in `src/data/toestellen.ts`. Een nieuw
toestel: foto's met groen scherm genereren, `schermUit()` draaien (geeft de zwarte
foto, het masker, de hoeken, de verhouding en de afronding), een entry in
`toestellen.ts` en een venster in `HEROS` in `nieuwe-case.mjs` (zelfde verhouding
als het scherm). `donker: true` maakt de vaste header boven de foto licht.

### Werkplek (VV Madjoe)

- **Foto's:** `src/assets/mockup/werkplek-liggend.webp` en `werkplek-staand.webp`: avondlijke
  werkplek, monitor recht van voren op een houten bureau, warme lamp erachter, planten
  en een plank erboven, donkere voorgrond. Groene originelen in `basis/werkplek-groen-*.webp`.
- **Opgemeten:** liggend 0,3260/0,2986 · 0,6740/0,2986 · 0,6740/0,6139 · 0,3260/0,6139,
  verhouding 1,96; staand 0,1675/0,3468 · 0,8324/0,3472 · 0,8324/0,5729 · 0,1677/0,5729,
  verhouding 1,66. Screenshot: venster 1440×734.
- **Licht** (gemeten): muur rond de monitor RGB ~240,165,57, verder weg 49,34,4, bureau
  129,65,11, voorgrond 17,8,2. Het scherm is de koelste lichtbron in de kamer: geen
  warme toon erover, alleen 8% vignettering. Header boven de foto wit.
- **Aanzet met GSAP** (`aan: "gsap"` in `toestellen.ts`), 1,5 s:
  1. het paneel licht op (zwart wordt #0f1012);
  2. het beeld komt van 104%, blur 12px en brightness 1,6 scherp naar 100% (power3.out).

  Bewust geen gloed om het scherm en geen glinstering over het glas (afgekeurd: de
  gloed liet een waas om het scherm achter).
  Bij reduced motion staat alles meteen in de eindstand.

### Bureau (Een Bundel Geluk)

- **Foto's:** `src/assets/mockup/bureau-liggend.webp` en `bureau-staand.webp`: een
  monitor op een houten bureau voor een raam met groen, warm laag zonlicht, donkere
  kamer, zonder spullen op het bureau. Groene originelen in `basis/bureau-groen-*.webp`.
- **Opgemeten:** liggend hoeken 0,2756/0,1884 · 0,7106/0,1629 · 0,7101/0,6322 ·
  0,2762/0,6005, verhouding 1,75; staand 0,1106/0,2867 · 0,8995/0,2706 · 0,8997/0,5750
  · 0,1071/0,5555, verhouding 1,55. Hoeken vrijwel recht.
- **Screenshot:** venster 1440×820 (verhouding 1,75), dpr 1,25, 1800 breed.
- **Licht** (gemeten): raam RGB 16-34, bureau in de zon 191,136,107, in de schaduw
  103,75,65; het scherm valt buiten het zonlicht en geeft zelf licht. Daarom 9%
  vignettering, 3% warme toon, contrast 0,97, geen glans. Header boven de foto wit.

### Tablet (Feigro)

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
  - `basis/telefoon-schoot-9x16.webp` (schoot): twee handen houden een iPhone in een
    saliegroen hoesje op schoot, groene kleding. Het scherm is magenta (#FF00FF), omdat
    een groen scherm in al dat groen zou wegvallen (`sleutel: "magenta"`). `midden`
    0,455, `telefoonHoogte` 0,387, glans `studio`.
  - `basis/telefoon-bank-9x16.webp` (bank): iPhone plat en diagonaal op een groen
    metalen bankje in hard zonlicht. `midden` 0,5, `telefoonHoogte` 0,615. Glans `zon`:
    het scherm in de zon iets gedempt en warmer (gemeten in de referentie: beige
    ~171,157,144), met een zonneglans.
- **Mobiele screenshot:** 402×820 pt @3x (iPhone-viewport zonder statusbalk), met
  een statusbalk van 54 pt erboven (9:41, bereik, wifi, batterij, in de kleur van
  de bovenrand van de site; tekst donker op een lichte balk en wit op een donkere,
  zoals iOS). Samen 1206×2622.
- **In de foto zetten** (`telefoon.mjs`):
  - Pixels in de sleutelkleur opsporen (groen of magenta, zie `SLEUTELS`); alleen het
    grootste aaneengesloten vlak telt, en er wordt alleen binnen het schermvlak
    vervangen. Groene stof of blaadjes elders in de foto blijven dus altijd onaangeroerd.
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
  afronding opmeten met `schermUit()` en in `src/data/toestellen.ts` zetten.
