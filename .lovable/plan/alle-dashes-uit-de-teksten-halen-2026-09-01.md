# Alle dashes uit de teksten halen

Doel: geen enkel lang streepje (— em dash) of half streepje (– en dash) meer in tekst die een bezoeker ziet. Vervangen door een komma, of door een gewoon koppelteken waar dat natuurlijker leest.

## Wat er nu staat

In totaal 146 streepjes in de codebase. Die vallen uiteen in drie groepen:

1. Zichtbare teksten op de publieke site (circa 10 plekken), o.a.:
   - Homepage intro: "goed vindbaar zijn — van eerste schets tot livegang."
   - Footer: "Geen templates — elk project op maat gebouwd."
   - Over ons: vier passages, o.a. "Wij zijn Justin en Job — twee gedreven ontwerpers..."
   - Diensten e-commerce: "Dat is voor jou – wij focussen op wat je verkoopt."
   - Portfolio-case Taxi Drechterland in de projectdata (drie streepjes in lange teksten)
   - Branchepagina: een losse "–" die als decoratief teken naast een lijstitem staat
2. Alt-teksten en aria-labels (bijv. "Justin & Job — Nieuwblik team", "Nieuwblik — home", "{titel} — website ontworpen door Nieuwblik"). Niet zichtbaar op het scherm, maar wel leesbaar voor Google en schermlezers.
3. Streepjes in code-commentaar, CSS-commentaar en robots.txt-commentaar (het grootste deel, circa 120 stuks). Die ziet een bezoeker nooit.

## Aanpak

- Groep 1 en 2 worden allemaal aangepakt. Per geval de beste keuze: meestal een komma, soms een punt als de zin dan beter loopt, en een gewoon koppelteken bij samenstellingen en labels (bijvoorbeeld "Justin & Job, Nieuwblik team").
- De decoratieve "–" op de branchepagina wordt een gewoon koppelteken, zodat de opmaak gelijk blijft.
- Groep 3 (commentaar) blijft ongemoeid: dat is geen tekst voor bezoekers en aanpassen levert alleen ruis in de bestanden op.
- Het interne portaal (/admin) gebruikt "—" als weergave voor "leeg veld" in tabellen en datumkolommen. Dat is functionele opmaak in een intern scherm, geen marketingtekst, en blijft staan. Zeg het als je wil dat dit ook verdwijnt.
- Woordbetekenis en SEO blijven gelijk: geen zinnen inkorten, geen keywords weghalen, titels en meta-teksten alleen aanpassen als daar een streepje in staat.

## Technisch

Aangeraakte bestanden (verwacht): `src/pages/Index.tsx`, `src/pages/About.tsx`, `src/pages/services/Ecommerce.tsx`, `src/pages/IndustryLanding.tsx`, `src/components/Footer.tsx`, `src/components/PortfolioCard.tsx`, `src/components/UnderlayNav.tsx`, `src/data/projects.ts`.

Na de wijzigingen: controle dat er geen em/en dash meer voorkomt in JSX-tekst, string-literals voor copy, alt-teksten en aria-labels, plus een buildcheck.
