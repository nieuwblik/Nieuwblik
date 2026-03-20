

## Alle blogs naar BeNoted-structuur

### Het referentiemodel (BeNoted)
De BeNoted blog heeft een clean structuur: intro-paragraaf gevolgd door `##` secties die direct in elkaar overvloeien. Geen titel-heading, geen leestijd-regel, geen inhoudsopgave-blok, geen horizontale lijnen (`---`).

### Wat er per blog moet veranderen

Alle 11 overige blogs (NL + EN content) krijgen dezelfde opschoning:

1. **Verwijder `# Titel`** bovenaan de content (bij Bolt, Lovable)
2. **Verwijder `**Leestijd:**` regels** (bij Madjoe, Replit, Claude)
3. **Verwijder inhoudsopgave-blok** (`## Inhoudsopgave` of `**Inhoudsopgave**` + genummerde lijst) (bij alle blogs behalve BeNoted en Brand Storytelling)
4. **Verwijder alle `---` horizontale lijnen** (bij Stripe, Brand Storytelling, Figma+HadoSEO, VibeCode, Bolt, Lovable, Replit, Cursor, Supabase, Claude)

### Betrokken blogs (11 stuks)
- `nieuwblik-sponsort-vv-madjoe-heren-1` (leestijd + inhoudsopgave)
- `stripe-betalingen-webshop-handleiding` (inhoudsopgave + `---`)
- `brand-storytelling-van-pixel-tot-voordeur` (`---`)
- `figma-hadoseo-lovable-perfecte-website` (inhoudsopgave + `---`)
- `vibecode-hadoseo-toekomst-websites` (inhoudsopgave + `---`)
- `bolt-new-ai-website-builder` (`#` titel + inhoudsopgave + `---`)
- `lovable-websites-bouwen` (`#` titel + inhoudsopgave + `---`)
- `replit-online-code-editor-ai` (leestijd + inhoudsopgave + `---`)
- `cursor-ai-code-editor` (inhoudsopgave + `---`)
- `supabase` (inhoudsopgave + `---`)
- `claude-ai-anthropic-complete-gids` (leestijd + inhoudsopgave + `---`)

### Technisch
- Alleen `src/data/blogPosts.ts` wordt aangepast
- Zowel NL als EN content wordt opgeschoond
- `##` headers blijven staan (nodig voor de sidebar-inhoudsopgave)
- Alle overige content (paragrafen, lijsten, tabellen, blockquotes, afbeeldingen) blijft ongewijzigd

