

## Plan: Fix markdown rendering in blog posts

### Probleem
De `formatContent` functie in `BlogPost.tsx` verwerkt `**bold**` markdown alleen in paragraphs en lijsten, maar niet in:
1. **Tabelcellen** (regel 249) — toont raw `**tekst**` met sterren
2. **Blockquotes** (regel 211) — toont raw `*"tekst"*` met sterren
3. **Inhoudsopgave** — markdown links `[text](#anchor)` worden niet geparsed

### Oplossing

**`src/pages/BlogPost.tsx`** — 3 fixes:

1. **Maak een gedeelde `formatInlineMarkdown` helper** die zowel `**bold**`, `*italic*` als `[links](#anchor)` verwerkt. Deze functie wordt hergebruikt in tabelcellen, blockquotes en paragraphs.

2. **Tabelcellen** (regel 248-250): Vervang `{cell}` door `{formatInlineMarkdown(cell)}` zodat bold tekst correct wordt gerenderd.

3. **Blockquotes** (regel 210-211): Vervang `{section.replace('> ', '')}` door `{formatInlineMarkdown(section.replace('> ', ''))}` — dit fixt zowel italic als bold in quotes.

4. **Inhoudsopgave sectie**: De "## Inhoudsopgave" sectie met genummerde markdown links (`1. [Wat is Stripe?](#wat-is-stripe)`) wordt nu geparsed als een numbered list maar de links daarin worden niet omgezet. De `formatInlineMarkdown` helper lost dit ook op.

### De `formatInlineMarkdown` functie
```text
Input:  "**iDEAL kosten**"
Output: <strong>iDEAL kosten</strong>

Input:  "*\"Stripe is de betaalinfrastructuur\"* — Forbes"
Output: <em>"Stripe is de betaalinfrastructuur"</em> — Forbes

Input:  "[Wat is Stripe?](#wat-is-stripe)"
Output: <a href="#wat-is-stripe">Wat is Stripe?</a>
```

### Bestanden
- `src/pages/BlogPost.tsx` — Voeg `formatInlineMarkdown` helper toe en gebruik deze in tabelcellen, blockquotes, en list items.

