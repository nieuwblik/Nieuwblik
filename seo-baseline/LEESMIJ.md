# SEO-nulmeting

`voor-migratie.json` legt vast hoe de site er voor een crawler uitzag vóór de
overstap naar server-rendering: per URL de titel, beschrijving, canonical,
robots, og-tags, h1's, het aantal koppen en links, de gebruikte
structured-datatypes en hoeveel tekst er zonder javascript in de HTML staat.

Vastgelegd op 28 augustus 2026, 75 URL's uit sitemap.xml, opgehaald met een
Googlebot-useragent (dus via de voorrendering van HadoSEO).

## Opnieuw meten na de migratie

    node seo-baseline/leg-vast.mjs

Schrijft naar `seo-baseline/voor-migratie.json`. Hernoem dat naar
`na-migratie.json` en vergelijk de twee: elke URL hoort dezelfde titel,
beschrijving, canonical en h1 te houden, en minstens evenveel tekst en links
in de HTML te hebben.

Let vooral op:
- URL's die niet meer op 200 staan
- een canonical die naar iets anders wijst
- `tekens` of `aantalLinks` die naar nul zakken (dan rendert de pagina niet
  meer serverside)
- structured-datatypes die verdwijnen
