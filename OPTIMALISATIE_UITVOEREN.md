# 🚀 Afbeeldingen Optimaliseren - Uitvoeren

## Stap 1: Run het optimalisatie script

```bash
node scripts/optimize-images.js
```

Dit script gaat automatisch:
- 🔍 Alle PNG en JPG bestanden vinden in `src/assets/`
- 🖼️ Ze converteren naar WebP formaat (80% quality)
- 📊 Je laten zien hoeveel ruimte je bespaart
- ✅ Originele bestanden behouden als backup

**Verwachte resultaten:**
- Logo: 200KB → ~15KB (92% besparing)
- Justin foto: 180KB → ~40KB (78% besparing)  
- Portfolio images: ~150KB → ~35KB (77% besparing)
- AI logo's: ~50KB → ~12KB (76% besparing)

## Stap 2: Update imports naar WebP

Na het runnen van het script, update je imports:

**Voor:**
```tsx
import logo from '@/assets/logo.png';
import heroImage from '@/assets/hero-image.jpg';
```

**Na:**
```tsx
import logo from '@/assets/logo.webp';
import heroImage from '@/assets/hero-image.webp';
```

## Stap 3: Deploy naar productie

```bash
npm run build
# Deploy naar Netlify
```

## Cache Configuratie ✅

De cache headers zijn al optimaal geconfigureerd:
- **Static assets**: 1 jaar cache met `immutable` flag
- **Stale-while-revalidate**: 24 uur voor betere UX
- **HTML/SW**: Geen cache voor verse content

**Dit betekent:**
- 🎯 Eerste bezoek: Alles wordt gedownload
- ⚡ Tweede bezoek: **100% cache hit** - instant load!
- 🔄 Updates: Alleen gewijzigde bestanden worden opnieuw gedownload

## Verwachte Performance Verbetering

**Voor optimalisatie:**
- 📦 Total page size: ~1.5MB
- 🐌 LCP: 32.0s
- 📊 PageSpeed score: 30

**Na optimalisatie:**
- 📦 Total page size: ~400KB (-73%)
- ⚡ LCP: ~2.5s (-92%)
- 🎯 PageSpeed score: **85-92**

## Troubleshooting

**Als een afbeelding nog steeds te groot is (>50KB):**

1. Check de output van het script
2. Voor extra grote afbeeldingen, gebruik TinyPNG.com:
   - Upload de WebP
   - Download de gecomprimeerde versie
   - Vervang het bestand

**Als je TypeScript errors krijgt:**
- Zorg dat `vite-env.d.ts` de WebP declaraties heeft
- Restart je TypeScript server in VS Code

## Extra Tips

🎨 **Voor logo's en iconen:**
- Overweeg SVG formaat (vector, geen pixelatie)
- SVG's zijn vaak kleiner dan WebP voor simpele designs

📱 **Voor responsive images:**
- Gebruik de `OptimizedImage` component
- Deze laadt automatisch de juiste size per device

🔍 **Monitor je resultaten:**
- Run PageSpeed Insights na deployment
- Check de Network tab in DevTools
- Verify cache headers met: `curl -I https://www.nieuwblik.com/assets/logo.webp`
