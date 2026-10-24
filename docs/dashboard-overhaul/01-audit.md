# Dashboard-overhaul, fase 1: audit

Stand van `main` op 24-10-2026 (commit 39dd849). Alleen gelezen, niets gewijzigd.
Gebaseerd op de code; het portaal zit achter een login en is niet in de browser
doorgeklikt. Paden zijn relatief aan de repo.

## 1. Routes

Opbouw: TanStack-routes `src/routes/admin/index.tsx` en `$.tsx` (ssr: false)
→ `src/components/AdminBridge.tsx` → react-router. `/admin/login` is een eigen
route, `/admin/*` laadt `src/admin/AdminApp.tsx` binnen `AdminLayout`.

| Route | Doel | Data | Status |
|---|---|---|---|
| `/admin/login` | Inloggen + rolcheck | supabase auth, rpc `has_role` | Werkt. Altijd licht thema, geen "wachtwoord vergeten". |
| `/admin` | Dashboard: begroeting, klant zoeken, vraagt aandacht, open taken, planning, overige klanten | `useCombinedRows`, `useTasks`, `useTeam`, `useAdminAuth` | Half af: tellingen kloppen niet met de lijsten, lege kop "Overige klanten", lege staat zonder knop, dubbel zoekveld. |
| `/admin/klanten` | Klantenraster met zoeken en fasefilter | `useCombinedRows` | Deels kapot: filter "Lopend werk" (`?status=actief`) valt terug op "alle" (`Clients.tsx:43`). |
| `/admin/klanten/:id` | Stuurt door naar het eerste project, anders lege staat | `useClient`, `useProjects` | Half af: dialoog heet "Klant bewerken" bij "Project toevoegen"; "eerste project" is het laatst bijgewerkte. |
| `/admin/projecten/:id` | Klant/project met taken, bestanden, tijdlijn | `useProject`, `useClient`, `useTasks`, `useProjectFiles`, `useProjectUpdates` | Werkt, met risico: "Verwijderen" wist de hele klant incl. alle projecten; bestanden blijven als wees in de opslag. |
| `/admin/kalender` | Maandrooster met taken, dagpaneel | `useTasks` | Randgeval kapot: notitieveld houdt de tekst van de vorige taak vast en kan die in een andere taak opslaan (`CalendarPage.tsx:201-212`). |
| `/admin/hosting` | Factuurmomenten, achterstallig, contracten | `useClients`, `useInvoicedPeriods`, `billing.ts` | Half af: klantnaam linkt naar de lijst i.p.v. de klant (`Hosting.tsx:144`), contractenlijst linkt nergens heen, datum als UTC gelezen (`:285`). |
| `/admin/mailen` | Mailing, testmail, voorbeeld, historie | `mailingClient`, edge function `send-mailing` | Werkt. Laadfout toont "Nog niets verstuurd"; ontvangers per mailing niet in te zien. (Afzender-regex hersteld in 90fb18e.) |
| `/admin/taken` | Alle taken met zoeken en filters | `useTasks`, `useTeam` | Werkt; mogelijk dubbele lege taak via ⌘K → "Nieuwe taak" (`Tasks.tsx:34-38`). |
| `/admin/taken/:id` | Taak met autosave, stappen, foto's | `useTasks`, `useUpdateTask`, `useTaskFiles` | Werkt. |
| `/admin/projecten`, `/admin/dashboard`, `/admin/*` | Oude adressen en vangnet | – | Werkt (redirects). |

## 2. Kapotte en halve onderdelen

Geen dode links en geen knoppen zonder handler gevonden. Wel:

- Filter "Lopend werk" werkt niet (`Clients.tsx:43-44`).
- Kalender: notitie lekt naar een andere taak (`CalendarPage.tsx:201-212`).
- Mogelijk dubbele lege taak via palet (`Tasks.tsx:34-38`, `useCreateTask.ts`).
- Belletje "N taken te laat" opent de takenlijst zonder filter (`AdminLayout.tsx:390-395`).
- Hosting: klantnaam → klantenlijst (`Hosting.tsx:144`).
- Palet: taak openen gaat naar het project i.p.v. de taak (`CommandPalette.tsx:85`); maar 5 taken doorzoekbaar (`:38`); "Ga naar" mist Kalender, Hosting, Mailen (`:111-124`); toont altijd ⌘K, ook op Windows.
- Dialoogtitel "Klant bewerken" bij "Project toevoegen"; project zonder klant bewerken maakt een nieuwe klant aan (`ClientProjectDialog.tsx:82,152-155,180`).
- Budgetveld accepteert geen komma (`ClientProjectDialog.tsx:122-126`).
- Dashboard: kop "Overige klanten" blijft leeg staan; lege staat "Voeg een klant toe" zonder knop (`Dashboard.tsx:184-197`).
- **Tellingen:** subtaken (stappen) tellen mee in zijbalk, dashboardkop, takenkop en klantkaarten, maar niet in de lijsten en niet op de projectpagina. Daardoor kloppen de getallen niet met wat je ziet.
- Begroeting "jobwijte96": de naam valt terug op het e-mailadres als `profiles.display_name` leeg is (`AdminAuthContext.tsx:69-76`).
- Taaklijst: omschrijving is `line-clamp-2` maar zonder regeleinden; prioriteit alleen zichtbaar als die niet "normaal" is (`TaskList.tsx:166-187`). Verwijderen vraagt wél bevestiging, maar meldt niet dat de stappen meegaan.
- Ongebruikt: `useRecentUpdates`, `useUpdateProject`, `timeAgo`, `PROJECT_STATUS[*].dot`, `StatusBadge kind="client"`, `ui/badge`, `ui/skeleton`, enkele imports. `src/lib/mailingClient.ts` is overbodig nu `types.ts` de mailingtabellen bevat.

## 3. Zoeken

| Functie | Doorzoekt |
|---|---|
| ⌘K-palet (bovenbalk, elke pagina) | recent bekeken, klanten (naam, contact, plaats, projectnaam), eerste 5 open taken, acties, 3 pagina's |
| "Zoek een klant" (alleen dashboard) | dezelfde klantvelden, top 8 |
| Klantenpagina | ook e-mail, plus fasefilter |
| Takenpagina | titel, omschrijving, project, plus eigenaar- en statusfilter |

Het dashboardveld doet hetzelfde als de klantengroep in het palet. Op het dashboard staan dus twee zoekvelden.

## 4. Destructieve acties

Bevestiging via `useConfirm` bij: klant/project, taak, stap, projectbestand, taakfoto, tijdlijnbericht, mailing. **Zonder** bevestiging: vinkje "gefactureerd" weghalen (Hosting), facturatie wissen (BillingButton), datum wissen. Bestanden in de opslag blijven achter bij het verwijderen van een klant, project of taak (alleen databaserijen cascaderen).

## 5. Data per onderdeel

Enums: `project_status` (lead, offerte, in_ontwerp, in_bouw, review, live, onderhoud, gepauzeerd, geannuleerd), `task_status` (todo, bezig, wacht, klaar), `priority_level` (laag, normaal, hoog, urgent), `client_status` (prospect, actief, inactief), `update_kind` (update, notitie, mijlpaal), `billing_cycle` (maandelijks, jaarlijks).

| Onderdeel | Belangrijkste velden | Relaties | Niet getoond |
|---|---|---|---|
| Klanten (`clients`) | naam, contact, e-mail, telefoon, website, plaats, status, notities, facturatie (cyclus, start, bedrag, notitie), afmeldtoken/-datum | 1 klant → n projecten (UI toont er 1) | website, notities, `billing_note`, klantstatus, afgemeld per klant |
| Projecten (`projects`) | naam, omschrijving, fase, prioriteit, start, deadline, live sinds, live-url, portfolio-slug, budget, TanStack | → klant (cascade), → taken, updates, bestanden | 2e+ project per klant, projectdeadlines in een kalender |
| Taken (`tasks`) | titel, omschrijving, status, prioriteit, `due_date`, toegewezen, `completed_at`, stap van (`parent_task_id`) | → project (optioneel), → foto's | – |
| Updates (`project_updates`) | soort, tekst, auteur, datum; fasewissel wordt automatisch een mijlpaal | → project | recente activiteit over alle projecten (hook bestaat) |
| Bestanden, taakfoto's | naam, grootte, type | → project / taak | bestandstype-icoon |
| Planning | alleen taken met `due_date` en niet klaar | – | projectdeadlines, factuurmomenten |
| Hosting | `billing_*` op klant + `invoiced_periods` (klant, periode, gefactureerd op/door, notitie); momenten berekend in `billing.ts` | → klant | notitie bij facturatie, bedraggeschiedenis |
| Mailen | `mailings` (onderwerp, tekst, groepen, aantallen, door wie), `mailing_ontvangers` (per adres status/fout) | → klant | ontvangers per mailing, wie verstuurde |
| Team | `profiles` (naam, e-mail), `user_roles`, rpc `admin_team` | – | – |

### Wat widgets kunnen tonen zonder schemawijziging
- Taken: open per status en prioriteit, te laat, deze week, zonder deadline, wacht op klant, per persoon, afgerond deze week vs vorige week (`completed_at`), instroom per week (`created_at`).
- Projecten: klanten per fase, projectdeadlines deze week en verlopen, live gegaan dit jaar, pijplijnwaarde per fase (`budget_cents`), projecten zonder activiteit sinds X dagen, recente activiteit.
- Klanten: aantal per status, nieuw per maand, zonder e-mail, afgemeld.
- Hosting: MRR/ARR (schatting op huidig bedrag), te factureren deze maand (aantal en €), achterstallig, gefactureerd deze maand.
- Mailen: laatste mailing met verstuurd/mislukt, afgemelde klanten.

### Alleen met nieuwe data (niet bouwen zonder akkoord)
Urenregistratie; echte omzetgeschiedenis (bedrag per factuur); betaald/onbetaald; doorlooptijd per fase (geen statushistorie); opens/clicks van mails; einddatum hostingcontract.

## 6. Styling

- Statuskleuren staan op 10 plekken, en botsen: prioriteit "normaal" is slate, sky en amber; mijlpaal is emerald én amber; sky betekent zowel "maandelijks" als "normaal". Er zijn geen tokens voor succes/waarschuwing/info, dus alles is rauwe rose/emerald/amber/sky (~45 keer), "te laat" 7× los gedefinieerd.
- Radius door elkaar: kaarten `rounded-lg`, `rounded-md` en `rounded-xl`; kale `rounded` 7×.
- Lettergroottes: 16 arbitraire waarden (9, 10, 11, 13 px); sectiekoppen in 5 varianten; knoppen in Epilogue, de rest Cabin.
- Spacing: paginawrapper `space-y-6` of `-8`, gaps 4/5/6/8, rechterkolom 320/340 px of 17rem.
- Dubbele componenten: twee maandroosters, drie maandnavigaties, twee "snel taak toevoegen", badges in drie varianten (`ui/badge` ongebruikt), zes losse monogram-avatars, twee dropzones, twee eigen overlays i.p.v. Popover, 9× dezelfde te-laat-check. Laden overal als tekst "Laden…" (`ui/skeleton` ongebruikt).
- Dark mode: werkt via `.dark` op `<html>` en de `--rail*`-tokens; mailvoorbeeld bewust wit, loginpagina altijd licht, PWA-themakleur vast donkergroen.
