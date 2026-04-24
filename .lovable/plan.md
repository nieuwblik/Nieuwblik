## Plan: Snelheid verhogen zonder risico

Focus op verbeteringen die enkel performance raken en niets aan UI/gedrag/inhoud veranderen. Geen refactors, geen library-wisselingen, geen wijzigingen aan routing of state.

### 1. Zware afbeeldingen vervangen door WebP (grootste winst)
De zwaarste assets nu:
- `src/assets/tools/gemini-logo.png` - 299KB
- `src/assets/blog/nieuwblik-x-benoted-phone.webp` - 289KB (al webp, maar te groot)
- `src/assets/justin-slok.png` - 181KB
- `src/assets/blog/nieuwblik-sponsor-madjoe.webp` - 144KB
- `src/assets/blog/lovable-logo.png` - 126KB, `cursor-logo.png` - 105KB, `claude-logo.png`/`bolt-logo.png`/`replit-logo.png`
- `src/assets/tools/figma-logo.png` - 77KB

Aanpak:
- Genereer naast elke zware PNG een geoptimaliseerde `.webp` (quality 80, max breedte 800px voor logos / 1200px voor hero/portfolio).
- Comprimeer ook de te grote bestaande `.webp` blog-images opnieuw (target <120KB).
- Update imports in `src/data/blogPosts.ts`, `src/components/ToolsSlider.tsx`, hero/Index componenten naar de nieuwe `.webp` paden.
- Originele PNG's blijven in de repo als fallback (geen breaking change).

Verwachte besparing: ~1-1.5MB initial load.

### 2. Google Fonts opschonen
Huidig: `Outfit:wght@300;400;600;700;900` + `Dancing+Script:wght@400;500` (7 weights = 7 woff2 files).

Aanpak: terugbrengen naar daadwerkelijk gebruikte weights:
- `Outfit:wght@400;600;700` (3 weights)
- `Dancing+Script:wght@400` (1 weight)

Verificatie: grep door codebase op `font-light` (300) en `font-black` (900) voor we deze weghalen. Alleen verwijderen wat nergens gebruikt wordt.

Verwachte besparing: ~80-120KB font payload + minder render-blocking.

### 3. Niet-kritieke homepage-secties splitsen
`src/pages/Index.tsx` rendert alles synchroon. Below-the-fold componenten lazy laden via `React.lazy()` + `Suspense` met `null` fallback:
- `TestimonialsCarousel`
- `FAQSection`
- `FeaturedBlogPosts`
- `SocialContentSection`
- `ToolsSlider`

Hero, Navigation en eerste content blijven eager (geen visuele verandering above-the-fold).

Verwachte besparing: ~30-40% kleinere initial JS chunk voor `/`.

### 4. Index.html micro-tweaks
- `<link rel="preload" as="image">` voor het hero-beeld + logo (al deels aanwezig, controleren).
- Google Fonts `<link>` aanvullen met `media="print" onload="this.media='all'"` truc zodat de stylesheet niet render-blocking is.
- `<link rel="preconnect">` naar `storage.googleapis.com` (voor og:image / external assets).

### 5. Verificatie
- Build draaien (`npm run build`) en bundle-grootte vergelijken.
- Visueel checken: homepage, een blog, portfolio, een service-pagina, een werkgebied-pagina. Geen layout/inhoud-verschillen toegestaan.
- Lighthouse / `browser--performance_profile` voor/na meting.

### Wat we NIET doen (risico vermijden)
- Geen wijzigingen aan `vite.config.ts` chunking-strategie (al goed afgesteld).
- Geen wijzigingen aan service worker, Supabase client of routing.
- Geen content-/tekstwijzigingen.
- Geen vervanging van animatielibraries of UI-componenten.
- Originele afbeeldingen blijven bestaan als fallback.

### Technische details (per bestand)
- **Nieuwe assets**: `src/assets/**/*.webp` (geoptimaliseerde versies van zware PNG's).
- **Edits**: `src/data/blogPosts.ts` (image imports), `src/components/ToolsSlider.tsx` (logo imports), `src/pages/Index.tsx` (lazy imports), `index.html` (font link + preconnect).
- **Geen edits** aan: `vite.config.ts`, `App.tsx` routing, `client.ts`, `types.ts`, `sw.js`.
