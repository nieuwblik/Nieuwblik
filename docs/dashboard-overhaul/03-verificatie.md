# Dashboard-overhaul, fase 4: verificatie

Gebouwd op `claude/dashboard-overhaul` in vier commits (stap 1 t/m 4 uit §9 van
het plan). Gecontroleerd op 24-10-2026 met de echte data op `localhost:4210`.

## Beslissingen uit §8 (zoals voorgesteld)

1. Alleen hoofdtaken tellen: overal (zijbalk, belletje, dashboard, takenkop, klantkaarten).
2. Project en klant apart verwijderen; bestanden en taakfoto's gaan mee uit de opslag.
3. Vinkje "gefactureerd" weghalen: geen dialoog, wel een melding met "Ongedaan maken".
4. Fasekleuren: pijplijn grijs, productie drie tinten blauw, live/onderhoud groen, stil gedempt.
5. Zoekveld op het dashboard weg; het palet (Ctrl K) is het enige zoekveld.
6. Knoppen in Cabin (alleen in het portaal; de publieke site houdt Epilogue).
7. Meer projecten per klant: buiten deze overhaul. Extra projecten zijn wel vindbaar in het palet.
8. `mailingClient.ts` verwijderd; de gegenereerde types bevatten de mailingtabellen.
9. Ideeën met nieuwe data: niet gebouwd.

Extra (uit §10): kaart "Ontbrekende gegevens" toegevoegd, alleen bestaande velden.

## Gecontroleerd

- Typecheck schoon; lint zonder fouten (dezelfde 5 bestaande waarschuwingen,
  prettier-regels buiten beschouwing zoals in de rest van de repo); productiebuild slaagt.
- Dashboard op 1440 px, 375 px (geen horizontale scroll) en in donkere modus.
- Tellingen kloppen met de lijsten: 4 open, 3 te laat, 1 van jou.
- Links: `/admin/klanten?status=actief` toont 3 klanten met lopend werk;
  `?filter=zonder-email` toont 22; `/admin/taken?filter=te-laat` toont de 3 te
  late taken; `/admin/kalender?dag=…` opent die dag met "Te laat (3)";
  `/admin/projecten/:id?tab=tijdlijn` opent de tijdlijn.
- Projectpagina: menu "Meer" toont "Project verwijderen" en "Klant verwijderen" (niet uitgevoerd).
- Palet vindt alle open taken en opent de taak zelf.
- Console schoon na een verse lading.

## Niet getest (zou data wijzigen)

Verwijderen, afvinken, facturatie instellen en mailen zijn niet uitgevoerd op de
echte data. De code is getypecheckt; probeer ze bij voorkeur eerst op een testklant.

## Wat de data nog nodig heeft

- Profielnaam instellen (dan staat er "Goedemorgen, Job").
- E-mailadressen bij de klanten (nu 22 zonder; Mailen kan pas daarna versturen).
- Hostingcontracten via Facturatie op de klantpagina (nu 0; de kaarten tonen een lege staat).
