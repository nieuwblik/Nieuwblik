# Dashboard-overhaul, fase 2: plan

Voorstel, nog niets gebouwd. Referentie: `docs/design-reference/horizonhub-*.webp`
(structuur en stijl, geen kopie). Nieuwblik-branding blijft: Cabin voor tekst,
Epilogue voor koppen en cijfers, bosgroen als accent.

Uitgangspunten uit het verzoek: niets verdwijnt, bestaande data en queries,
geen dummydata, geen schemawijziging zonder akkoord, geen nieuwe dependencies
(grafiekjes worden gewone div/SVG, `cmdk` en `date-fns` zijn er al), werk op
`claude/dashboard-overhaul`, commit per stap.

## 1. Design tokens

Nieuw in `src/styles.css`, onder `.portaal` zodat de publieke site niet verandert.

**Kleuren** (licht / donker, HSL-tokens zoals de rest van de site):

| Token | Gebruik | Licht | Donker |
|---|---|---|---|
| `--p-bg` | paginaachtergrond | warm grijs 150 10% 97% | 160 12% 6% |
| `--p-card` | kaarten | wit | 160 10% 9% |
| `--p-border` | dunne randen | 160 8% 90% | 160 8% 16% |
| `--p-muted` | subtitels, meta | 160 6% 42% | 160 6% 62% |
| `--p-accent` | actief, actie, focus (één accent) | bosgroen 160 84% 16% | 160 60% 45% |
| `--p-accent-soft` | actieve navigatie, geselecteerd segment | accent / 8% | accent / 16% |

**Statuskleuren met vaste betekenis** (overal hetzelfde, altijd met tekstlabel,
nooit alleen kleur):

| Token | Betekenis |
|---|---|
| `--s-danger` (rood) | te laat, urgent, mislukt |
| `--s-warning` (oranje) | hoog, wacht, achterstallig, te factureren |
| `--s-info` (blauw) | bezig, in uitvoering |
| `--s-success` (groen) | klaar, live, gefactureerd, verstuurd |
| `--s-neutral` (grijs) | todo, normaal, laag, gepauzeerd |

Prioriteit: urgent = danger, hoog = warning, normaal en laag = neutral (laag
lichter). Taakstatus: todo neutral, bezig info, wacht warning, klaar success.

**Projectfases** (categorisch, in de volgorde van het werk; één palet, ook in
grafieken): lead en offerte = grijs/blauwgrijs (pijplijn), in_ontwerp en in_bouw
en review = drie tinten van één kleur (in productie), live en onderhoud =
groen, gepauzeerd en geannuleerd = gedempt. *Beslissing nodig, zie §8.*

**Typografie** (geen 9/10/13 px meer):

| Rol | Maat | Font |
|---|---|---|
| Paginatitel | 24 / semibold | Epilogue |
| Kaarttitel | 15 / semibold | Cabin |
| Kaartsubtitel, meta | 13 / regular, muted | Cabin |
| Tekst | 14 | Cabin |
| Klein (pills, assen) | 12 | Cabin |
| KPI-cijfer | 32 (mobiel 28) / medium, tabular-nums; eenheid 14 muted | Epilogue |

**Spacing:** 4-puntsraster. Pagina: 24 tussen secties (mobiel 16). Grid-gap 16
(mobiel 12). Kaart: header 16×20, body 20, footer 12×20.

**Radius:** kaart 14px, binnenelementen (knoppen, velden, iconvak) 8px, pills rond.

**Randen en schaduw:** 1px `--p-border`; kaarten geen of `shadow-xs`; alleen
overlays (popover, palet, dialoog) `shadow-md`.

## 2. Componentenset

Nieuw in `src/admin/ui/`, op basis van de bestaande shadcn-onderdelen:

- **Card** met `CardHeader` (icoon in afgerond vierkant + titel + subtitel + slot
  rechtsboven), `CardBody`, `CardFooter` ("Bekijk details →" als link).
- **StatCard**: groot cijfer + eenheid + vergelijking met vorige periode
  (alleen als die data bestaat) + link.
- **StatusPill**: één component voor taakstatus, prioriteit, projectfase,
  klantstatus, facturatie en mailstatus; vervangt StatusBadge, de ClientCard-
  pills en de losse kleurkaarten. Eén kleurbron: `src/admin/constants.ts`.
- **Badge** (aantallen in de zijbalk), **SegmentedControl** (7d / 1m / …),
  **List/ListRow** (avatar, titel, meta, rechts een waarde, hele rij klikbaar),
  **DataTable** (Taken, Hosting-contracten), **EmptyState** (met actieknop),
  **Skeleton** (per kaart), **ConfirmDialog** (bestaande `useConfirm`, met
  rode bevestigknop voor wissen), **Avatar** (portfoliobeeld of monogram;
  vervangt zes losse varianten), **MonthNav** en één **MonthGrid** (kalender
  en hosting delen hem).

## 3. Navigatie en app-shell

Zijbalk in groepen met sectielabels, inklapbaar (bestaat al):

| Groep | Items | Badge |
|---|---|---|
| Overzicht | Dashboard, Kalender | Kalender: aantal deadlines vandaag |
| Werk | Klanten, Taken | Taken: aantal te laat (rood) of open |
| Diensten | Hosting, Mailen | Hosting: aantal te factureren |

Bovenbalk: één zoekveld dat het ⌘K-palet opent (Ctrl+K op Windows), "Nieuwe
taak", "Nieuwe klant", thema, belletje, account. Het palet krijgt:
klanten (ook op e-mail), **alle** open taken (opent de taak, niet het project),
projecten, "Ga naar" voor alle zes pagina's, acties. Het losse veld "Zoek een
klant" op het dashboard verdwijnt (functie zit in het palet).

## 4. Dashboard-layout

Bento-grid, 12 kolommen op desktop, 6 op tablet, 1 op mobiel. Alles met echte data.

| Rij | Kaart (breedte) | Inhoud | Data | Link |
|---|---|---|---|---|
| 1 | Begroeting (12) | "Goedemorgen, Job" + datum + één zin wat er speelt ("3 taken te laat, 2 facturen klaar") | `display_name`, tellingen hieronder | – |
| 2 | StatCard × 4 (3+3+3+3) | **Open taken** (te laat in rood) · **Afgerond deze week** vs vorige week · **Lopende projecten** (actieve fases) · **Te factureren deze maand** (€ en aantal) | `tasks`, `completed_at`, `projects.status`, `billing.ts` + `invoiced_periods` | Taken (filter open/te laat) · Taken (klaar) · Klanten (Lopend werk) · Hosting |
| 3 | Vraagt aandacht (7) | Compacte lijst, max 6: avatar/beeld, klantnaam, fase-pill, open taken, te laat of deadline, zwaarste prioriteit. Sortering: te laat → urgent → deadline | `useCombinedRows` | rij → klant/project; footer → Klanten |
| 3 | Deze week (5) | Weekstrip ma–zo met taken én projectdeadlines; vandaag gemarkeerd | `tasks.due_date`, `projects.deadline` | item → taak/project; footer → Kalender |
| 4 | Taken per status (4) | Gestapelde balk todo/bezig/wacht + aantallen, segmented 7d/1m voor "afgerond" | `tasks` | segment → Taken gefilterd |
| 4 | Klanten per fase (4) | Horizontale balken per projectfase | `projects.status` | balk → Klanten gefilterd op fase |
| 4 | Hosting (4) | Te factureren (€, aantal), achterstallig, MRR (schatting, zo gelabeld) | `billing.ts`, `invoiced_periods` | Hosting |
| 5 | Mijn taken (7) | Mijn open taken, max 8: titel (1 regel), project, prioriteit-pill altijd, deadline; afvinken, wissen met bevestiging | `tasks.assigned_to = ik` | rij → taak; footer → Taken |
| 5 | Mailen (5) | Laatste mailing: onderwerp, datum, verstuurd/mislukt; afgemelde klanten | `mailings`, `clients.mail_afgemeld_op` | Mailen |
| 6 | Recente activiteit (12) | Laatste updates, mijlpalen, bestanden over alle projecten | `useRecentUpdates` (bestaat, ongebruikt) | item → project |

"Overige klanten" van het huidige dashboard verhuist naar de klantenpagina
(daar staan ze al); het dashboard toont alleen wat aandacht vraagt.

Mobiel: begroeting → 2×2 StatCards → Vraagt aandacht → Deze week → Mijn taken →
rest. Kaarten worden niet afgekapt, lijsten tonen minder items met "Bekijk alle".

## 5. Overige pagina's in dezelfde stijl

Zelfde Card, pills, avatars en tokens op Klanten, Klant/Project, Taken,
Taakdetail, Kalender, Hosting en Mailen. Functioneel gelijk; alleen opmaak en
de reparaties uit §7.

## 6. Linkmatrix

Regel: een klantnaam, project, taak of cijfer is overal klikbaar.

| Element | Gaat naar |
|---|---|
| Klantnaam / klantavatar | `/admin/klanten/:id` (→ project) |
| Projectnaam | `/admin/projecten/:id` |
| Taaktitel (overal, ook palet en kalender) | `/admin/taken/:id` |
| StatCard Open taken | `/admin/taken?status=open` |
| StatCard Te laat / belletje | `/admin/taken?filter=te-laat` (nieuw filter, zelfde data) |
| StatCard Afgerond | `/admin/taken?status=klaar` |
| StatCard Lopende projecten | `/admin/klanten?status=actief` (filter repareren) |
| StatCard / kaart Hosting | `/admin/hosting` (maand van vandaag) |
| Fasebalk | `/admin/klanten?status=<fase>` |
| Takenbalk-segment | `/admin/taken?status=<status>` |
| Mailen-kaart | `/admin/mailen` |
| Hosting-regel klantnaam | `/admin/klanten/:id` (nu de lijst) |
| Activiteit-item | project, tab Tijdlijn |
| Footer "Bekijk details →" | bijbehorende pagina |

Filters komen in de URL, zodat elke link een deelbare, gefilterde weergave is.

## 7. Reparaties die meegaan

Filter "Lopend werk" · notitie-lek in de kalender · dubbele lege taak via palet ·
belletje opent te-laat-filter · Hosting-links · palet (alle taken, taak openen,
alle pagina's, Ctrl/⌘) · dialoogtitel en "project zonder klant bewerken" ·
budget met komma · lege kop "Overige klanten" · lege staten met knop ·
één telregel voor taken (zie §8) · voornaam in begroeting (eerste woord van de
profielnaam; zonder profielnaam een vriendelijke vraag om je naam in te stellen
i.p.v. het e-mailadres) · omschrijving 1 regel in lijsten, volledig op de
taakpagina · prioriteit altijd zichtbaar · datum-UTC in Hosting · laden met
skeletons i.p.v. "Laden…" · laadfout in Mailen als foutmelding met "Opnieuw".

## 8. Beslissingen voor jou

1. **Subtaken tellen:** ik stel voor dat overal alleen hoofdtaken tellen (stappen
   zie je als "2/5 stappen" bij de taak). Akkoord?
2. **Verwijderen op de projectpagina** wist nu de hele klant met alle projecten.
   Voorstel: twee acties, "Project verwijderen" en "Klant verwijderen", met
   duidelijke tekst. En bij wissen ook de bestanden uit de opslag halen (kan
   zonder schemawijziging). Akkoord?
3. **"Gefactureerd" uitvinken** gaat nu zonder bevestiging. Voorstel: geen
   dialoog, wel een melding met "Ongedaan maken". Akkoord?
4. **Projectfasekleuren** zoals in §1 (pijplijn grijs/blauw, productie één kleur
   in drie tinten, live groen)?
5. **Zoekveld op het dashboard** verdwijnt ten gunste van het palet (dat alles
   vindt wat dat veld vond, plus meer). Akkoord?
6. **Knoppen** nu in Epilogue, de rest in Cabin. Knoppen ook Cabin?
7. **Meer projecten per klant**: de data kan het, de UI toont er één. Buiten
   deze overhaul houden, of de klantpagina een projectenlijst geven?
8. **`mailingClient.ts` opruimen** nu de types de mailingtabellen bevatten (Lovable
   heeft de migratie uitgevoerd en de types vernieuwd)?
9. **Ideeën die nieuwe data vragen** (niet bouwen zonder akkoord): uren per
   project, factuurbedragen/omzetgeschiedenis met betaalstatus, einddatum van
   hostingcontracten, opens/clicks van mailings.

## 9. Bouwvolgorde (fase 3)

1. Tokens en componenten (`src/admin/ui`), StatusPill + één kleurbron.
2. App-shell: zijbalk in groepen met badges, bovenbalk, palet.
3. Dashboard.
4. Overige pagina's + reparaties.

Na elke stap: typecheck, lint en build, commit. Browsercontrole van het portaal
kan alleen als jij in het browservenster inlogt (ik log niet zelf in).
