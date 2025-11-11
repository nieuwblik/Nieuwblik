# Performance Optimalisatie Instructies

## ✅ Automatisch Geregeld door de Code

### 1. **Build-time Image Optimization**
De Vite Image Optimizer plugin is geconfigureerd om automatisch:
- PNG/JPG/JPEG naar WebP te converteren (75% quality)
- Afbeeldingen te comprimeren (70% quality voor PNG/JPG)
- SVG's te optimaliseren
- Dit gebeurt ALLEEN bij `npm run build`, niet tijdens development

### 2. **Cache Headers**
- Netlify cache headers: geconfigureerd in `netlify.toml` + `public/_headers`
- Alle static assets: 1 jaar cache
- HTML/SW: geen cache (altijd vers)
- Cache headers werken **alleen in productie** (na Netlify deploy)

### 3. **Lazy Loading & Performance**
- Alle images hebben lazy loading
- Service Worker voor offline caching
- Code splitting en chunk optimization
- Critical resources preloading

## 🔧 Wat JIJ Moet Doen voor Optimale Performance

### 1. **Deploy naar Netlify/Production**
De cache headers werken NIET in development (localhost). Je moet:
```bash
npm run build
```
En vervolgens deployen naar Netlify om de cache headers actief te krijgen.

**Test na deploy:**
- Open Chrome DevTools → Network tab
- Kijk naar Response Headers bij images
- Je zou moeten zien: `Cache-Control: public, max-age=31536000, immutable`

### 2. **Afbeeldingen Handmatig Optimaliseren (Optioneel maar Aanbevolen)**

Je huidige grote afbeeldingen:
- **justin-slok.png** (181 KiB) → moet ~40-60 KiB zijn
- **bushidoshop.nl.png** (112 KiB) → moet ~30-50 KiB zijn  
- **Logo** (45 KiB) → moet ~5-10 KiB zijn
- **Portfolio images** (100+ KiB elk) → moeten ~40-60 KiB zijn

**Optie A: Online Tools (Makkelijkst)**
1. Ga naar [TinyPNG](https://tinypng.com/) of [Squoosh](https://squoosh.app/)
2. Upload je PNG afbeeldingen
3. Download de gecomprimeerde WebP versies
4. Vervang de originele bestanden in `src/assets/`

**Optie B: ImageMagick (Command Line)**
```bash
# Installeer ImageMagick
brew install imagemagick  # macOS
sudo apt-get install imagemagick  # Linux

# Converteer naar WebP met optimale kwaliteit
magick justin-slok.png -quality 75 -resize 800x justin-slok.webp
magick logo.png -quality 80 -resize 200x logo.webp
```

**Optie C: Bulk Optimization Script**
```bash
# Installeer sharp-cli
npm install -g sharp-cli

# Converteer alle PNG's in src/assets naar WebP
cd src/assets
sharp -i "*.png" -o ./ -f webp -q 75
```

### 3. **YouTube Videos Optimaliseren**
YouTube thumbnail images zijn groot (161 KiB elk). Dit is al geoptimaliseerd via `LazyYouTube` component die:
- Thumbnails pas laadt bij scroll
- Video iframe pas laadt bij klik
- Bespaart ~2.5MB per pagina

### 4. **Afbeelding Aanbevelingen per File**

**Logo (hoogste prioriteit!):**
- Huidige grootte: 44 KiB
- Display size: 160x40px (in header), 150x38px (in footer)
- Aanbevolen: 
  - Exporteer als SVG indien mogelijk (vectorgrafisch, veel kleiner)
  - Of: resize naar 200x50px en exporteer als WebP (quality 85)
  - Doel: <10 KiB

**Justin Slok Portrait:**
- Huidige grootte: 181 KiB
- Display sizes: 800x600 (hero), 600x800 (about), 64x64 (blog author)
- Aanbevolen:
  - Maak 3 versies: 400w, 800w, 1200w
  - Exporteer als WebP (quality 75)
  - Doel: 800w versie ~50 KiB

**Portfolio Images:**
- Huidige grootte: 100-112 KiB elk
- Display size: 800x600px cards
- Aanbevolen:
  - Resize naar 1200x900px (voor retina)
  - Exporteer als WebP (quality 70)
  - Doel: ~40-50 KiB per image

### 5. **Font Loading (al geoptimaliseerd)**
✅ Fonts worden nu met `display=optional` geladen
✅ Preconnect naar Google Fonts
✅ Alleen essentiële weights geladen (300, 400, 600, 700)

### 6. **Check Performance na Deploy**
Na deployen naar productie:

1. **Test met PageSpeed Insights:**
   - [https://pagespeed.web.dev/](https://pagespeed.web.dev/)
   - Test zowel mobile als desktop
   - Doel: 85+ score

2. **Test Cache Headers:**
   ```bash
   # Check cache headers
   curl -I https://nieuwblik.com/assets/logo.png
   # Moet tonen: Cache-Control: public, max-age=31536000, immutable
   ```

3. **Test Image Formats:**
   - Open DevTools → Network
   - Filter op "Img"
   - Check of WebP wordt geserveerd (not PNG)

## 📊 Verwachte Resultaten na Alle Optimalisaties

**Voor (huidige situatie):**
- Total page size: ~1.5 MB
- Largest images: 180 KiB (justin), 112 KiB (bushido)
- Cache headers: None
- Image format: PNG
- Mobile score: 30-40

**Na (met alle optimalisaties):**
- Total page size: ~400-600 KiB (-60%)
- Largest images: ~50 KiB (WebP, optimized)
- Cache headers: 1 year (immutable)
- Image format: WebP met PNG fallback
- Mobile score: **85-92** 🎯

## 🚀 Quick Wins Checklist

- [ ] Deploy naar Netlify/productie
- [ ] Check cache headers in productie
- [ ] Optimaliseer logo (SVG of resize + WebP)
- [ ] Optimaliseer justin-slok.png (resize + WebP)
- [ ] Optimaliseer top 5 portfolio images
- [ ] Test PageSpeed score
- [ ] Voeg WebP fallback toe voor oude browsers (al geïmplementeerd)

## ❓ Vragen?

Als je ergens tegenaan loopt of hulp nodig hebt bij:
- Image optimization tools
- Netlify deployment
- Cache headers testen
- Performance monitoring

Laat het me weten! 🚀
