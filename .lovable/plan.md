

## Plan: Stripe Blog Schrijven

### Wat
Een nieuwe blogpost toevoegen over Stripe als betaaloplossing, met Puur in Harmonie als case study. De geüploade Stripe-afbeelding wordt gekopieerd naar `src/assets/blog/`.

### Bestanden

**1. Kopieer afbeelding**
`user-uploads://image-37.png` → `src/assets/blog/stripe-logo.png`

**2. `src/data/blogPosts.ts`**
- Import `stripeLogoImg` bovenaan
- Voeg nieuwe blogpost toe aan de array met:
  - **slug**: `stripe-betalingen-webshop-handleiding`
  - **seoTitle**: `Stripe Betalingen | De Beste Betaaltool voor Webshops`
  - **seoKeywords**: `stripe, stripe betalen, stripe kosten, online betalen, betaalplatform, webshop betalingen, stripe nederland`
  - **Inhoud (NL)**: Uitgebreide blog (~10 min leestijd) met:
    - Wat is Stripe & waarom het zo populair is
    - Stripe Dashboard: overzicht, meldingen, real-time verkoopmeldingen
    - Stripe prijzen/kosten (1.5% + €0.25 EU-kaarten, 0% extra voor iDEAL)
    - Stripe vs Mollie vergelijking (SEO-waarde)
    - Case study: Puur in Harmonie - hoe de Stripe-integratie is gebouwd
    - Waarom Nieuwblik fan is van Stripe
    - CTA naar contact
  - **Inhoud (EN)**: Korte excerpt
  - **image**: stripeLogoImg
  - **date**: 2026-03-05

