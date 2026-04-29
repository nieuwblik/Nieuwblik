## Probleem

Bij elke klik naar een andere pagina op nieuwblik.com zie je eerst een wit vlak. De pagina lijkt traag te laden, terwijl het eigenlijk al geklikt is.

## Oorzaak

In `src/App.tsx` worden bijna alle pagina's geladen met `React.lazy()` + `Suspense fallback={null}`:

```tsx
const Portfolio = lazy(() => import("./pages/Portfolio"));
const About = lazy(() => import("./pages/About"));
// ... etc
<Suspense fallback={null}>
```

Wat er dan gebeurt bij een klik:
1. React Router wisselt direct van route.
2. De nieuwe pagina is een aparte JS chunk die nog gedownload + geparsed moet worden over het netwerk.
3. Tijdens dat downloaden (kan 100ms tot meerdere seconden duren) toont Suspense niets (`fallback={null}`), dus de oude pagina is al weg en de nieuwe is er nog niet, dat is precies dat **witte vlak**.
4. Pas als de chunk binnen is, verschijnt de nieuwe pagina, gevolgd door de scroll naar boven.

Dit is geen styling- of theme-probleem, het is puur een laad-/bundling-probleem. De eerder toegevoegde `RouteLoader` werkte het symptoom weg met een spinner, maar je wilt instant. De enige manier om instant te zijn is dat de pagina al in het hoofdbundel zit op het moment dat je klikt.

## Oplossing

Lazy loading uitzetten voor alle marketing-pagina's, zodat ze direct beschikbaar zijn na de eerste paint. Alleen de echte zware/zelden bezochte pagina's blijven lazy.

### Wijzigingen in `src/App.tsx`

**Eager imports** (worden meteen meegebundeld, navigatie is dan instant):
- `Portfolio`, `PortfolioDetail`
- `About`
- `Blog`, `BlogPost`
- `Contact`, `ThankYou`
- `Reviews`
- `Privacy`, `Cookies`, `Terms`
- `WebsiteOpMaat`, `Webshops`, `Ecommerce`
- `Werkgebied`, `WerkgebiedDetail`
- `NotFound`

**Lazy blijven** (zelden bezocht door publieke gebruikers, niet relevant voor instant gevoel):
- `AdminLogin`
- `AdminDashboard`

**Suspense** blijft bestaan rond alleen de admin routes, met `fallback={null}`. De andere routes komen buiten Suspense.

### Bundle-impact

De marketingpagina's zijn relatief licht (geen grote externe libs binnen de pagina's zelf, het meeste komt uit gedeelde componenten zoals Navigation, Footer, framer-motion die al gedeeld worden). De totale initial bundle wordt iets groter, maar:
- De eerste paint van de homepage gebruikt al `Index` + `Services` eager.
- Gedeelde dependencies (React, framer-motion, lucide-react, UI componenten) worden niet dubbel geladen, ze zaten al in de gedeelde chunk.
- Resultaat: navigatie is instant, geen wit vlak meer.

### Opruimen

- `src/components/RouteLoader.tsx` verwijderen (niet meer nodig, navigatie is direct).
- `src/assets/trail-loading.lottie` verwijderen (niet meer gebruikt).
- `@lottiefiles/dotlottie-react` uit `package.json` halen (niet meer gebruikt, scheelt bundle size).

### Verwacht resultaat

Elke klik in de navigatie wisselt direct van pagina, geen tussentijds wit scherm, geen spinner, geen fade. Net zoals nu al werkt voor `/` en `/diensten` (die zijn al eager geladen).

## Bestanden

- `src/App.tsx` - imports en Suspense herstructureren
- `src/components/RouteLoader.tsx` - verwijderen
- `src/assets/trail-loading.lottie` - verwijderen
- `package.json` - `@lottiefiles/dotlottie-react` weghalen
