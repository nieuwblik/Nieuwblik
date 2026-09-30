# Plan: regiopagina’s actiegerichter en beter vindbaar maken

## Doel
De geografische landingspagina’s duidelijker laten aansluiten op lokale zoekopdrachten en de klik naar Nieuwblik aantrekkelijker maken met concrete voordelen, een vanafprijs en een heldere vervolgstap. Leiden en Hoorn krijgen daarbij een specifieke, handgeschreven optimalisatie.

## Uitvoering

1. **Leiden gericht aanscherpen**
   - De titel en meta description herschrijven rond “website laten maken Leiden”, vanaf €990, oplevering binnen 2 tot 4 weken en persoonlijk contact.
   - De H1 en belangrijkste H2-koppen actiegerichter maken, zonder lokale inhoud of feiten over Leiden te verwijderen.
   - De zichtbare introductie laten aansluiten op dezelfde belofte als het zoekresultaat.

2. **Hoorn gericht aanscherpen**
   - Voor `/werkgebied/hoorn` unieke SEO-velden en paginakoppen toevoegen in plaats van de huidige algemene regiomal.
   - De titel en meta description richten op “website laten maken Hoorn”, lokaal contact vanuit Enkhuizen, vanaf €990 en snelle oplevering.
   - De H1 en belangrijkste H2-koppen concreet maken rond vindbaarheid, conversie, prijs en lokale nabijheid.

3. **Overige geografische pagina’s verbeteren**
   - De vier brede regiopagina’s en de overige werkgebiedpagina’s dezelfde actiegerichte basis geven: zoekterm + plaats/regio, vanafprijs, oplevertermijn en concrete CTA.
   - Bestaande unieke lokale teksten behouden; alleen algemene titels, descriptions en hoofd-/tussenkoppen aanpassen.
   - Alle titels en descriptions binnen de bestaande SEO-lengtegrenzen houden en onderling uniek laten blijven.

4. **AI-crawlers en llms.txt in robots.txt**
   - De robots-generator aanpassen, omdat die `public/robots.txt` bij elke bouw opnieuw schrijft.
   - Expliciete `Allow: /`-blokken toevoegen voor GPTBot, ClaudeBot en PerplexityBot, met behoud van de blokkade voor `/admin`.
   - Een expliciete verwijzing naar `https://nieuwblik.com/llms.txt` opnemen naast de sitemapverwijzing.
   - Het gegenereerde `public/robots.txt` vernieuwen zodat de wijziging direct in de bron staat en niet later wordt overschreven.

5. **Controle**
   - Leiden en Hoorn server-side controleren op titel, description, H1, H2, canonical en HTTP-status.
   - Controleren dat de overige aangepaste regiopagina’s unieke metadata hebben en de prijs uit de centrale prijsbron gebruiken.
   - `/robots.txt` controleren op alle crawlerregels, `/admin`, sitemap en llms.txt, en `/llms.txt` op bereikbaarheid.
   - De actuele foutmeldingen en de uiteindelijke paginaweergave op desktop en mobiel nalopen.

## Technische details
- Prijzen en levertijden blijven uit de centrale bedrijfsconfiguratie komen, zodat toekomstige wijzigingen overal gelijk doorwerken.
- De bestaande routegebonden metadata blijft leidend voor server-rendering en Open Graph.
- Er worden geen Twitter/X-tags toegevoegd of gewijzigd.
- Alle nieuwe teksten blijven Nederlands, gebruiken sentence case en bevatten geen em dash.
