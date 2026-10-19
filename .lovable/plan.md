# HadoSEO uit BeNoted-case + AI-projectbriefing

## 1. HadoSEO uit de BeNoted-case
- Blog "case-study-benoted-snelheid-zichtbaarheid": de sectie "Maximale zichtbaarheid en snelheid via HadoSEO" herschrijven naar "Maximale zichtbaarheid en snelheid" zonder naam en zonder links naar hadoseo.com (NL en EN-tekst). Titel, samenvatting en zoekwoorden nalopen op HadoSEO.
- Laatste wijzigingsdatum van dit blog bijwerken naar vandaag, sitemap en llms.txt opnieuw genereren.
- Andere vermeldingen (dienstpagina Website op maat, tools-slider, Puur in Harmonie-labels) blijven staan, tenzij je zegt dat die ook weg moeten.

## 2. Nieuwe pagina: /projectbriefing
Bezoeker beschrijft in een kort formulier:
- Soort bedrijf en branche, plaats
- Wat de website moet doen (doelen), huidige website (optioneel)
- Gewenste functies, budgetindicatie, gewenste startdatum

Na "Maak mijn briefing" verschijnt live (woord voor woord) een heldere briefing:
- Samenvatting van het project
- Doelen en doelgroep
- Passende diensten van Nieuwblik met korte uitleg en link (website op maat, webshop, SEO-stadspagina's, hosting €30/mnd)
- Prijsindicatie op basis van vaste prijzen (vanaf €990), levertijd
- Volgende stap

Onder de briefing: knoppen "Stuur briefing naar Nieuwblik" (gaat via het bestaande contactformulier-mailsysteem, met naam en e-mail) en "Bespreek via WhatsApp".

Links naar de pagina: footer (Diensten), kostenpagina en contactpagina. Eigen titel/beschrijving, opgenomen in sitemap en llms.txt. Alle tekst Nederlands, geen em dashes.

## Technical details
- Lovable AI inschakelen; server route `src/routes/api/briefing.ts` streamt met AI SDK Responses (`openai/gpt-6-astra`, reasoning low, store false), systeemprompt met vaste dienstenlijst en prijzen uit `business.ts`/`dienstpaginas.ts` zodat het model geen diensten of prijzen verzint.
- Invoer valideren met zod (maximale lengtes), eenvoudige rate limit per IP (bijv. 5 per uur) in een kleine tabel, 402/429/403-meldingen netjes in het Nederlands tonen.
- Versturen hergebruikt de bestaande `send-contact-email` functie met de briefing als bericht.
- Testen: echte aanvraag in de preview, controleren dat alleen bestaande diensten genoemd worden.
