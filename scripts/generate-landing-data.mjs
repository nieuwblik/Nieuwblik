// Generates src/data/cities.ts and src/data/industries.ts with fully unique content per page.
// Run with: node scripts/generate-landing-data.mjs
import fs from "fs";
import path from "path";

const cities = [
  { slug: "amsterdam", name: "Amsterdam", region: "de Randstad", trait: "creatieve hoofdstad", market: "een dynamische en internationale markt" },
  { slug: "rotterdam", name: "Rotterdam", region: "Zuid-Holland", trait: "havenstad met aanpakkers mentaliteit", market: "een no-nonsense ondernemersklimaat" },
  { slug: "den-haag", name: "Den Haag", region: "Zuid-Holland", trait: "bestuurlijke en zakelijke kern", market: "een formele en internationale doelgroep" },
  { slug: "utrecht", name: "Utrecht", region: "Midden-Nederland", trait: "centraal knooppunt", market: "een sterk groeiende dienstensector" },
  { slug: "eindhoven", name: "Eindhoven", region: "Brabant", trait: "tech en design hub", market: "een innovatief MKB landschap" },
  { slug: "groningen", name: "Groningen", region: "Noord-Nederland", trait: "studentenstad", market: "een levendige startersmarkt" },
  { slug: "tilburg", name: "Tilburg", region: "Brabant", trait: "industriestad in opmars", market: "een groeiend zakelijk netwerk" },
  { slug: "almere", name: "Almere", region: "Flevoland", trait: "jonge groeistad", market: "een snel uitbreidend ondernemerslandschap" },
  { slug: "breda", name: "Breda", region: "West-Brabant", trait: "Bourgondische ondernemersstad", market: "een sterke MKB sector" },
  { slug: "nijmegen", name: "Nijmegen", region: "Gelderland", trait: "oudste stad van Nederland", market: "een mix van traditie en innovatie" },
  { slug: "arnhem", name: "Arnhem", region: "Gelderland", trait: "modestad met groene insteek", market: "een veelzijdige creatieve sector" },
  { slug: "apeldoorn", name: "Apeldoorn", region: "de Veluwe", trait: "groene gemeente", market: "een degelijk familiegericht ondernemersklimaat" },
  { slug: "haarlem", name: "Haarlem", region: "Noord-Holland", trait: "monumentale stad", market: "een welvarend lokaal MKB" },
  { slug: "amersfoort", name: "Amersfoort", region: "Utrecht", trait: "snelgroeiende centrumstad", market: "een diverse zakelijke markt" },
  { slug: "zaanstad", name: "Zaanstad", region: "Noord-Holland", trait: "industriële traditie en moderniteit", market: "een bedrijvige regio met veel familiebedrijven" },
  { slug: "enschede", name: "Enschede", region: "Twente", trait: "innovatieve grensregio", market: "een sterk technisch en creatief MKB" },
  { slug: "den-bosch", name: "Den Bosch", region: "Brabant", trait: "historische hofstad", market: "een gemoedelijke maar ambitieuze ondernemerskring" },
  { slug: "zwolle", name: "Zwolle", region: "Overijssel", trait: "hanzestad", market: "een degelijk groeiend ondernemerslandschap" },
  { slug: "zoetermeer", name: "Zoetermeer", region: "Zuid-Holland", trait: "moderne forensenstad", market: "een sterke dienstverlenende sector" },
  { slug: "leiden", name: "Leiden", region: "Zuid-Holland", trait: "kennis en wetenschapsstad", market: "een hoogopgeleide doelgroep" },
  { slug: "maastricht", name: "Maastricht", region: "Limburg", trait: "Europese stad met flair", market: "een internationaal georiënteerd MKB" },
  { slug: "dordrecht", name: "Dordrecht", region: "Zuid-Holland", trait: "oudste stad van Holland", market: "een nuchter en betrokken ondernemersnetwerk" },
  { slug: "ede", name: "Ede", region: "de Veluwe", trait: "groeigemeente met dorps karakter", market: "een toegankelijke lokale markt" },
  { slug: "delft", name: "Delft", region: "Zuid-Holland", trait: "techniek en design stad", market: "een innovatief startup ecosysteem" },
  { slug: "venlo", name: "Venlo", region: "Limburg", trait: "logistiek knooppunt", market: "een grensoverschrijdende handelsmarkt" },
  { slug: "deventer", name: "Deventer", region: "Overijssel", trait: "creatieve hanzestad", market: "een mix van ambachtelijkheid en innovatie" },
  { slug: "westland", name: "Westland", region: "Zuid-Holland", trait: "tuinbouwregio van wereldformaat", market: "een hechte agrarische en zakelijke gemeenschap" },
  { slug: "alkmaar", name: "Alkmaar", region: "Noord-Holland", trait: "kaasstad met karakter", market: "een loyaal lokaal MKB" },
  { slug: "emmen", name: "Emmen", region: "Drenthe", trait: "ondernemende noorderling", market: "een nuchter ondernemersklimaat" },
  { slug: "leeuwarden", name: "Leeuwarden", region: "Friesland", trait: "Friese hoofdstad", market: "een betrokken regionale ondernemerskring" },
];

const industries = [
  { slug: "kapper", name: "Kapper", plural: "kappers", short: "kapsalon", challenge: "veel concurrentie in de buurt", goal: "online afspraken en zichtbaarheid" },
  { slug: "restaurant", name: "Restaurant", plural: "restaurants", short: "restaurant", challenge: "gasten verwachten een sfeervolle online beleving", goal: "reserveringen en sfeer overbrengen" },
  { slug: "bouwbedrijf", name: "Bouwbedrijf", plural: "bouwbedrijven", short: "bouwbedrijf", challenge: "vertrouwen wekken voor grote opdrachten", goal: "kwalitatieve leads en projectaanvragen" },
  { slug: "schoonheidssalon", name: "Schoonheidssalon", plural: "schoonheidssalons", short: "salon", challenge: "behandelingen visueel sterk presenteren", goal: "online boekingen en klantenbinding" },
  { slug: "fysiotherapeut", name: "Fysiotherapeut", plural: "fysiotherapiepraktijken", short: "praktijk", challenge: "vertrouwen en deskundigheid uitstralen", goal: "nieuwe patiënten via online vindbaarheid" },
  { slug: "accountant", name: "Accountant", plural: "accountantskantoren", short: "kantoor", challenge: "ingewikkelde diensten begrijpelijk uitleggen", goal: "kwalitatieve MKB klanten aantrekken" },
  { slug: "makelaar", name: "Makelaar", plural: "makelaars", short: "makelaarskantoor", challenge: "snel en visueel woningaanbod tonen", goal: "verkopers en kopers binden aan jouw merk" },
  { slug: "tandarts", name: "Tandarts", plural: "tandartspraktijken", short: "praktijk", challenge: "drempel verlagen voor nieuwe patiënten", goal: "rustig professioneel imago en aanmeldingen" },
  { slug: "personal-trainer", name: "Personal trainer", plural: "personal trainers", short: "praktijk", challenge: "jezelf onderscheiden in een drukke fitnesswereld", goal: "intakes en abonnementen via de website" },
  { slug: "advocaat", name: "Advocaat", plural: "advocatenkantoren", short: "kantoor", challenge: "expertise en betrouwbaarheid laten zien", goal: "kwalitatieve zaken en nieuwe cliënten" },
  { slug: "interieurontwerper", name: "Interieurontwerper", plural: "interieurontwerpers", short: "studio", challenge: "stijl en visie visueel overbrengen", goal: "passende projecten en opdrachtgevers" },
  { slug: "fotograaf", name: "Fotograaf", plural: "fotografen", short: "studio", challenge: "portfolio op zijn best presenteren", goal: "boekingen en goed geprijsde opdrachten" },
  { slug: "schilder", name: "Schilder", plural: "schildersbedrijven", short: "schildersbedrijf", challenge: "lokaal goed vindbaar zijn voor klussen", goal: "regelmatige stroom offerteaanvragen" },
  { slug: "loodgieter", name: "Loodgieter", plural: "loodgieters", short: "loodgietersbedrijf", challenge: "snel gevonden worden bij spoedklussen", goal: "telefoontjes en offertes via Google" },
  { slug: "elektricien", name: "Elektricien", plural: "elektriciens", short: "elektrabedrijf", challenge: "vertrouwen wekken bij particulier en zakelijk", goal: "beide doelgroepen converteren" },
  { slug: "coach", name: "Coach", plural: "coaches", short: "praktijk", challenge: "persoonlijkheid en aanpak laten doorklinken", goal: "kennismakingsgesprekken vullen" },
  { slug: "therapeut", name: "Therapeut", plural: "therapeuten", short: "praktijk", challenge: "veilige en duidelijke uitstraling creëren", goal: "passende cliënten aantrekken" },
  { slug: "horecabedrijf", name: "Horecabedrijf", plural: "horecabedrijven", short: "zaak", challenge: "sfeer en aanbod overbrengen aan nieuwe gasten", goal: "reserveringen en terugkerende bezoekers" },
  { slug: "autogarage", name: "Autogarage", plural: "autogarages", short: "garage", challenge: "vertrouwen wekken voor onderhoud en reparatie", goal: "afspraken en lokale klanten" },
  { slug: "bloemist", name: "Bloemist", plural: "bloemisten", short: "bloemenwinkel", challenge: "creaties en bezorging visueel sterk tonen", goal: "online bestellingen en lokale binding" },
  { slug: "tuinman", name: "Tuinman", plural: "hoveniers", short: "hoveniersbedrijf", challenge: "kwaliteit van het werk laten zien", goal: "structurele tuinprojecten en onderhoud" },
  { slug: "kinderopvang", name: "Kinderopvang", plural: "kinderopvanglocaties", short: "locatie", challenge: "vertrouwen wekken bij ouders", goal: "rondleidingen en aanmeldingen" },
  { slug: "sportschool", name: "Sportschool", plural: "sportscholen", short: "sportschool", challenge: "drempel verlagen voor nieuwe leden", goal: "proeflessen en abonnementen" },
  { slug: "boekhouder", name: "Boekhouder", plural: "boekhouders", short: "kantoor", challenge: "ZZP en MKB aanspreken in eigen taal", goal: "vaste klanten met maandabonnementen" },
  { slug: "architect", name: "Architect", plural: "architecten", short: "bureau", challenge: "ontwerpvisie en projecten visueel tonen", goal: "ambitieuze opdrachtgevers binden" },
  { slug: "verzekeringsadviseur", name: "Verzekeringsadviseur", plural: "verzekeringsadviseurs", short: "kantoor", challenge: "complexe materie eenvoudig uitleggen", goal: "adviesgesprekken vullen" },
  { slug: "dierenarts", name: "Dierenarts", plural: "dierenartspraktijken", short: "praktijk", challenge: "warm en deskundig overkomen op baasjes", goal: "online afspraken en nieuwe patiënten" },
  { slug: "evenementenbureau", name: "Evenementenbureau", plural: "evenementenbureaus", short: "bureau", challenge: "creativiteit en organisatie tegelijk laten zien", goal: "kwalitatieve aanvragen voor events" },
  { slug: "reclamebureau", name: "Reclamebureau", plural: "reclamebureaus", short: "bureau", challenge: "eigen werk net zo sterk presenteren als dat van klanten", goal: "passende opdrachtgevers binden" },
  { slug: "reinigingsbedrijf", name: "Reinigingsbedrijf", plural: "reinigingsbedrijven", short: "bedrijf", challenge: "betrouwbaarheid en gemak uitstralen", goal: "vaste contracten en periodieke klussen" },
];

// Word banks for variation
const titlePatterns = [
  (n) => `Website Laten Maken ${n} | Snel & Pro - Nieuwblik`,
  (n) => `Website Laten Maken ${n} | Modern MKB - Nieuwblik`,
  (n) => `Website Laten Maken ${n} | Betaalbaar - Nieuwblik`,
  (n) => `Website Laten Maken ${n} | AI Webdesign - Nieuwblik`,
  (n) => `Website Laten Maken ${n} | Snel Live - Nieuwblik`,
  (n) => `Website Laten Maken ${n} | Conversie - Nieuwblik`,
  (n) => `Website Laten Maken ${n} | Lokaal MKB - Nieuwblik`,
  (n) => `Website Laten Maken ${n} | Mobiel - Nieuwblik`,
  (n) => `Website Laten Maken ${n} | Strategisch - Nieuwblik`,
  (n) => `Website Laten Maken ${n} | Online Groei - Nieuwblik`,
];

const industryTitlePatterns = [
  (n) => `Website voor ${n} | Snel & Pro - Nieuwblik`,
  (n) => `Website voor ${n} | Modern MKB - Nieuwblik`,
  (n) => `Website voor ${n} | Betaalbaar - Nieuwblik`,
  (n) => `Website voor ${n} | AI Webdesign - Nieuwblik`,
  (n) => `Website voor ${n} | Snel Live - Nieuwblik`,
  (n) => `Website voor ${n} | Conversie - Nieuwblik`,
  (n) => `Website voor ${n} | Lokaal MKB - Nieuwblik`,
  (n) => `Website voor ${n} | Mobiel - Nieuwblik`,
  (n) => `Website voor ${n} | Strategisch - Nieuwblik`,
  (n) => `Website voor ${n} | Online Groei - Nieuwblik`,
];

const cityMetaPatterns = [
  (n) => `Website laten maken in ${n}? Nieuwblik bouwt snelle, conversiegerichte sites voor MKB. Persoonlijk contact en moderne aanpak. Vraag offerte aan.`,
  (n) => `Op zoek naar webdesign in ${n}? Nieuwblik levert betaalbare websites die scoren in Google en bezoekers omzetten in klanten. Plan een kennismaking.`,
  (n) => `Een professionele website laten bouwen in ${n}? Wij combineren strakke designs met AI gedreven ontwikkeling voor snel resultaat. Bekijk hoe.`,
  (n) => `Website nodig voor jouw bedrijf in ${n}? Nieuwblik werkt voor MKB door heel Nederland met snelle oplevering en duidelijke prijzen. Start vandaag.`,
  (n) => `Webdesign bureau voor ondernemers in ${n}. Strategisch ontwerp, sterke teksten en goede vindbaarheid in één pakket. Ontdek wat wij doen.`,
  (n) => `Wil je een nieuwe website in ${n} die echt werkt? Nieuwblik bouwt sites die opvallen, klanten aantrekken en jouw merk groter maken. Bel ons.`,
  (n) => `Moderne websites laten ontwikkelen in ${n}. Persoonlijke aanpak, scherpe prijzen en focus op meetbaar resultaat. Vraag een gratis offerte aan.`,
  (n) => `Website laten ontwerpen in ${n}? Nieuwblik koppelt creatief design aan slimme technologie zodat jouw bedrijf online opvalt. Plan je gesprek nu.`,
  (n) => `Krachtige websites voor MKB ondernemers in ${n}. Snel live, mobielvriendelijk en gebouwd voor groei. Ontdek de aanpak van Nieuwblik vandaag.`,
  (n) => `Een website die past bij jouw bedrijf in ${n}? Nieuwblik bouwt op maat, met strategie en oog voor detail. Vraag direct een offerte aan.`,
];

const industryMetaPatterns = [
  (b) => `Website laten maken voor een ${b.toLowerCase()}? Nieuwblik bouwt sites die nieuwe klanten aantrekken en jouw vakmanschap laten zien. Vraag offerte aan.`,
  (b) => `Een ${b.toLowerCase()} verdient een sterke website. Nieuwblik combineert design en strategie voor meer aanvragen en omzet. Plan een kennismaking.`,
  (b) => `Op zoek naar webdesign voor jouw ${b.toLowerCase()}? Wij maken websites die opvallen in Google en bezoekers omzetten in klanten. Start vandaag.`,
  (b) => `Professionele website voor een ${b.toLowerCase()} laten bouwen? Nieuwblik helpt MKB groeien met conversiegerichte sites. Vraag direct meer info aan.`,
  (b) => `Meer klanten voor jouw ${b.toLowerCase()} via een sterke website. Nieuwblik bouwt snel, slim en betaalbaar. Bekijk wat wij voor jou kunnen doen.`,
  (b) => `Een nieuwe website voor jouw ${b.toLowerCase()}? Strategisch ontwerp, sterke teksten en goede vindbaarheid. Plan een vrijblijvend gesprek met ons.`,
  (b) => `${b} en je website is verouderd? Nieuwblik bouwt moderne sites die werken op alle apparaten en klanten overtuigen. Vraag een offerte aan.`,
  (b) => `Jouw ${b.toLowerCase()} online laten groeien? Nieuwblik bouwt websites die jouw aanbod helder presenteren en bezoekers activeren. Bel of mail ons.`,
  (b) => `Webdesign op maat voor een ${b.toLowerCase()}. Nieuwblik koppelt creativiteit aan slimme technologie voor zichtbaar resultaat. Ontdek de aanpak.`,
  (b) => `Website laten ontwerpen voor jouw ${b.toLowerCase()}? Nieuwblik werkt persoonlijk, snel en transparant. Klaar voor groei? Plan een kennismaking.`,
];

const cityH1Patterns = [
  (n) => `Website laten maken in ${n} die klanten oplevert`,
  (n) => `Professionele website laten maken in ${n}`,
  (n) => `Website laten maken in ${n} voor jouw bedrijf`,
  (n) => `Jouw bedrijfswebsite laten maken in ${n}`,
  (n) => `Modern webdesign voor ondernemers in ${n}`,
  (n) => `Website bouwen in ${n}, snel en betaalbaar`,
  (n) => `Sterke websites laten ontwerpen in ${n}`,
  (n) => `Online opvallen als ondernemer in ${n}`,
  (n) => `Een nieuwe website laten maken in ${n}`,
  (n) => `Website op maat voor MKB in ${n}`,
];

const industryH1Patterns = [
  (b) => `Een professionele website laten maken als ${b.toLowerCase()}`,
  (b) => `Website laten maken voor jouw ${b.toLowerCase()} of bedrijf`,
  (b) => `Meer klanten via een sterke website voor jouw ${b.toLowerCase()}`,
  (b) => `Website laten maken die nieuwe klanten aantrekt voor jouw ${b.toLowerCase()}`,
  (b) => `Modern webdesign voor de ${b.toLowerCase()} branche`,
  (b) => `Laat jouw ${b.toLowerCase()} groeien met een nieuwe website`,
  (b) => `Een website die past bij jouw werk als ${b.toLowerCase()}`,
  (b) => `Website ontwerpen voor de moderne ${b.toLowerCase()}`,
  (b) => `Bouw een sterk online merk als ${b.toLowerCase()}`,
  (b) => `Online groeien als ${b.toLowerCase()}, begin hier`,
];

const benefitOptions = [
  { h3: "Snel live", text: "Wij leveren binnen enkele weken op zonder in te leveren op kwaliteit. Strakke planning en korte lijnen houden het tempo hoog." },
  { h3: "Persoonlijk contact", text: "Je krijgt een vast aanspreekpunt dat jouw bedrijf echt leert kennen. Geen accountmanagers of callcenters, gewoon directe lijnen." },
  { h3: "Betaalbaar maatwerk", text: "Vanaf 1500 euro krijg je een complete site op maat, zonder verborgen kosten. Heldere offertes voordat we starten." },
  { h3: "AI gedreven aanpak", text: "We zetten slimme tools in om sneller te bouwen en beter te schrijven. Jij profiteert van de tijdwinst en de kwaliteit." },
  { h3: "Conversiegericht ontwerp", text: "Elke knop, kop en sectie heeft een doel en is gericht op actie. Je website wordt een verkoper die altijd aan staat." },
  { h3: "Mobile first design", text: "Het overgrote deel van bezoekers komt via de smartphone binnen. Wij ontwerpen daarom altijd eerst voor mobiel." },
  { h3: "SEO klaar opgeleverd", text: "Snelle laadtijd, technische SEO en doordachte teksten zitten standaard inbegrepen. Klaar om gevonden te worden in Google." },
  { h3: "Strategisch meedenken", text: "We bouwen niet zomaar wat je vraagt, maar adviseren waar het beter kan. Jouw doel staat altijd centraal." },
  { h3: "Lokale voelhorens", text: "We werken al jaren met MKB in heel Nederland en weten wat lokale ondernemers nodig hebben. Geen onnodige toeters en bellen." },
  { h3: "Resultaatgericht", text: "We meten en optimaliseren na de lancering, want een website is nooit klaar. Samen maken we hem steeds sterker." },
];

const cityFaqA1Templates = [
  (n) => `Wij werken vanuit Enkhuizen voor MKB ondernemers in heel Nederland, dus ook in ${n}. De meeste klanten spreken we via videocall of telefoon, wat zorgt voor snelle communicatie en duidelijke afspraken. Indien gewenst plannen we een fysieke afspraak in.`,
  (n) => `Onze klanten in ${n} ervaren onze samenwerking als heel persoonlijk, ook al zit ons kantoor in Enkhuizen. We zijn snel bereikbaar via telefoon, mail en WhatsApp en plannen geregeld videocalls om de voortgang door te nemen.`,
  (n) => `We bedienen ondernemers in ${n} met dezelfde aandacht als die om de hoek zitten. Door slim gebruik te maken van online communicatietools verloopt het proces vlot, zonder dat je iets aan persoonlijk contact inlevert.`,
  (n) => `Onze locatie in Enkhuizen is geen drempel voor ${n}. Vrijwel alle contactmomenten regelen we digitaal, met duidelijke updates en directe lijnen. Zo werken we al jaren succesvol samen met ondernemers in heel Nederland.`,
];

const cityFaqA2Templates = [
  (n) => `Een eenvoudige bedrijfswebsite voor een ondernemer in ${n} begint vanaf 1500 euro. De uiteindelijke prijs hangt af van het aantal pagina's, functionaliteiten en de gewenste doorlooptijd. Tijdens een gratis kennismaking maken we een passende offerte op maat.`,
  (n) => `De kosten van een website in ${n} starten bij 1500 euro voor een complete bedrijfssite. Werk je met een webshop of speciale functies, dan loopt dit op. Wij geven altijd vooraf een transparante prijs zonder verrassingen achteraf.`,
  (n) => `Voor ondernemers in ${n} hanteren wij een startprijs van 1500 euro voor een professionele website. Op basis van jouw wensen schalen we mee en bespreken we precies wat je krijgt. Geen verborgen kosten, alleen heldere afspraken.`,
  (n) => `Een website laten bouwen in ${n} kost vanaf 1500 euro voor een degelijke MKB site. Tijdens onze kennismaking inventariseren we wat je echt nodig hebt en stellen we een offerte op die past bij jouw budget en doelen.`,
];

const cityFaqA3Templates = [
  (n) => `De doorlooptijd van een project in ${n} ligt meestal tussen de 2 en 6 weken. Dit hangt af van de complexiteit en hoe snel jij content aanlevert. Door slimme tools in te zetten gaat het traject bij ons vaak sneller dan elders.`,
  (n) => `Vanaf akkoord op de offerte zetten wij een nieuwe website voor ondernemers in ${n} in 2 tot 6 weken live. We werken in korte sprints met regelmatige opleveringen, zodat je goed betrokken blijft en niets je verrast.`,
  (n) => `Wij streven naar een live website in 2 tot 6 weken voor klanten in ${n}. Hoe sneller de teksten en beelden binnen zijn, hoe vlotter het loopt. Onze AI gedreven workflow zorgt voor extra tempo zonder kwaliteitsverlies.`,
  (n) => `Voor de meeste projecten in ${n} houden wij 2 tot 6 weken aan van start tot live. We plannen vooraf alles netjes door en houden je wekelijks op de hoogte. Spoedklussen zijn in overleg vrijwel altijd mogelijk.`,
];

const cityFaqA4Templates = [
  (n) => `Ons proces voor klanten in ${n} bestaat uit kennismaken, strategie en design, ontwikkeling, en live gaan met nazorg. We werken in korte fases met duidelijke goedkeurmomenten zodat je nooit voor verrassingen komt te staan.`,
  (n) => `Een project start altijd met een vrijblijvende kennismaking, gevolgd door een offerte en strategiegesprek. Daarna ontwerpen, bouwen en lanceren we de site samen met jou. Voor ondernemers in ${n} werkt deze aanpak heel prettig.`,
  (n) => `Wij hanteren vier fases: oriëntatie, ontwerp, ontwikkeling en lancering. Tijdens elke fase blijft de communicatie persoonlijk en helder. Klanten in ${n} weten zo precies waar we staan en wat de volgende stap is.`,
  (n) => `Het proces begint met een gesprek over jouw doelen, gevolgd door een ontwerp, bouw en lancering. Na livegang blijven we beschikbaar voor onderhoud en optimalisatie. Zo bouwen we ook in ${n} aan duurzame samenwerkingen.`,
];

const industryFaqA1Templates = [
  (b) => `Voor een ${b.toLowerCase()} bouwen wij standaard functies in zoals een duidelijk dienstenoverzicht, een sterk contactblok en eventueel een afspraak of reserveringsmodule. Welke onderdelen het meeste opleveren bespreken we tijdens de kennismaking op basis van jouw doelen.`,
  (b) => `De essentiële functies voor een ${b.toLowerCase()} website zijn snelheid, mobielvriendelijkheid en heldere call to actions. Daarnaast voegen we vaak een online afsprakenmodule, portfolio of klantbeoordelingen toe om vertrouwen te wekken bij nieuwe bezoekers.`,
  (b) => `Bij een ${b.toLowerCase()} draait het online vooral om vindbaarheid en gemak. Wij zorgen voor goede SEO, een eenvoudige navigatie en functies die direct bijdragen aan meer aanvragen, zoals een offerteformulier, online agenda of WhatsApp knop.`,
  (b) => `Voor de ${b.toLowerCase()} branche kijken wij eerst naar wat klanten verwachten als ze online zoeken. Op basis daarvan kiezen we functionaliteiten zoals reviews, prijslijsten of een boekingsmodule die de drempel verlagen om contact op te nemen.`,
];

const industryFaqA2Templates = [
  (b) => `Een professionele website voor een ${b.toLowerCase()} begint bij ons vanaf 1500 euro. Wat je daarvoor krijgt is een complete site met sterk design, goede teksten en SEO. Wil je extra functies, dan stellen we vooraf een transparante offerte op.`,
  (b) => `Voor een ${b.toLowerCase()} hanteren wij een startbudget van 1500 euro. Hiermee krijg je een complete bedrijfswebsite die je echt verder helpt. Komt er een uitgebreid afsprakensysteem of webshop bij kijken, dan rekenen we dat duidelijk vooraf door.`,
  (b) => `De prijs van een website voor een ${b.toLowerCase()} hangt af van de gewenste functies. Vanaf 1500 euro lever je al een sterke MKB site op. Tijdens een vrijblijvend gesprek maken we samen helder wat passend is voor jouw situatie.`,
  (b) => `Een gemiddelde ${b.toLowerCase()} betaalt bij ons tussen de 1500 en 4000 euro voor een complete website. We werken altijd met een vaste prijs vooraf, zodat je precies weet wat je krijgt en er geen verrassingen achteraf zijn.`,
];

const industryFaqA3Templates = [
  (b) => `De meeste projecten voor een ${b.toLowerCase()} ronden wij af binnen 2 tot 6 weken. We werken in korte fases met duidelijke deadlines en regelmatige updates. Hoe sneller jij content aanlevert, hoe sneller jouw nieuwe website live staat.`,
  (b) => `Een nieuwe website voor een ${b.toLowerCase()} kunnen wij in gemiddeld 3 weken live zetten. Bij grotere projecten met veel functionaliteiten loopt dit op tot 6 weken. Wij plannen vooraf alles realistisch in en houden ons aan de afspraken.`,
  (b) => `Voor de ${b.toLowerCase()} branche rekenen wij standaard op een doorlooptijd van 2 tot 6 weken. Onze AI gedreven workflow zorgt dat we sneller bouwen dan een gemiddeld bureau, zonder concessies te doen aan kwaliteit of detail.`,
  (b) => `Een typische ${b.toLowerCase()} website is binnen 4 weken live als alle content en feedback op tijd komen. We werken met een duidelijke planning en wekelijkse check ins, zodat het project soepel loopt en jij niet voor verrassingen komt te staan.`,
];

const industryFaqA4Templates = [
  (b) => `Vindbaarheid voor een ${b.toLowerCase()} bouwen wij in vanaf het eerste ontwerp. Snelle laadtijd, technische SEO, sterke teksten en lokale optimalisatie zorgen dat jouw site goed scoort in Google en de juiste klanten vanzelf bij je terechtkomen.`,
  (b) => `Wij maken jouw ${b.toLowerCase()} website klaar voor SEO door zoekwoordenonderzoek, sterke metateksten en snelle techniek. Daarnaast adviseren we over Google reviews en lokale vermeldingen, want die maken in de ${b.toLowerCase()} branche vaak het verschil.`,
  (b) => `Voor een ${b.toLowerCase()} is lokale vindbaarheid cruciaal. We optimaliseren je site voor de zoekwoorden waar jouw klanten op zoeken, zorgen voor een snelle mobiele ervaring en koppelen alles aan jouw Google bedrijfsprofiel voor maximaal effect.`,
  (b) => `SEO voor een ${b.toLowerCase()} draait om relevantie en snelheid. Wij richten je site zo in dat Google snapt waar je voor staat, koppelen Google Search Console en geven je tips om actief reviews te verzamelen voor extra zichtbaarheid in de zoekresultaten.`,
];

const cityIntros = [
  (c) => `Voor ondernemers in ${c.name} draait alles om opvallen tussen het brede ${c.market}. Een sterke website is daarbij geen luxe, maar pure noodzaak. Nieuwblik bouwt voor MKB door heel Nederland aan websites die conversiegericht en visueel sterk zijn. Door persoonlijk contact te combineren met een AI gedreven aanpak leveren we snel, betaalbaar en met aandacht voor detail. Of je nu net begint of jouw bestaande website een nieuwe boost wilt geven, wij denken vanaf de eerste minuut met je mee.`,
  (c) => `${c.name} is een ${c.trait} waar ondernemen energie en visie vraagt. Met de juiste online uitstraling vergroot je jouw bereik direct. Nieuwblik werkt vanuit Enkhuizen voor klanten in heel Nederland en levert websites die in lijn zijn met jouw doelen. Wij koppelen creatief design aan slimme techniek, zodat je sneller live bent zonder kwaliteitsverlies. Persoonlijk contact, transparante prijzen en een focus op meetbaar resultaat zijn vanzelfsprekend.`,
  (c) => `Een goede website is voor MKB in ${c.name} de basis voor groei. Bezoekers maken in seconden een oordeel, dus elke detail telt. Nieuwblik helpt je daar bij met websites die professioneel ogen, snel laden en bezoekers omzetten in klanten. Onze AI gedreven manier van werken maakt het traject korter en scherper geprijsd. Wij bedienen ondernemers door heel Nederland en geloven in heldere communicatie van briefing tot live.`,
];

const industryIntros = [
  (i) => `Voor een ${i.name.toLowerCase()} is de website vaak het eerste contactmoment met een nieuwe klant. ${i.challenge.charAt(0).toUpperCase() + i.challenge.slice(1)} maakt het extra belangrijk om direct vertrouwen te wekken. Nieuwblik bouwt websites die jouw vakmanschap zichtbaar maken en bezoekers actief begeleiden naar ${i.goal}. Met een persoonlijke aanpak, scherpe prijzen en AI gedreven ontwikkeling leveren wij snel een site die er staat als een huis. Of je nu net start of doorgroeit, wij denken mee.`,
  (i) => `In de wereld van een ${i.name.toLowerCase()} is online zichtbaarheid bepalend voor succes. ${i.plural.charAt(0).toUpperCase() + i.plural.slice(1)} die opvallen, krijgen meer aanvragen. Nieuwblik bouwt sites die er strak uitzien, snel laden en gericht zijn op ${i.goal}. Wij combineren creatieve briefings met een AI gedreven workflow om sneller en scherper geprijsd op te leveren. Persoonlijk contact en duidelijke afspraken zijn altijd onderdeel van de samenwerking.`,
  (i) => `Een ${i.name.toLowerCase()} verdient een website die past bij het werk en het gevoel dat je wilt overbrengen. Veel ${i.plural} hebben moeite met ${i.challenge}, en dat is precies waar wij invliegen. Nieuwblik koppelt sterke teksten aan strak design en zorgt voor ${i.goal}. We werken vanuit Enkhuizen voor MKB door heel Nederland, met persoonlijk contact en betaalbare tarieven die transparant zijn vanaf het eerste gesprek.`,
];

const industryNeedsBank = {
  default: [
    { h3: "Helder dienstenoverzicht", text: "Bezoekers willen binnen 5 seconden snappen wat je doet. Met een duidelijk overzicht van diensten of producten verlaag je de drempel om door te klikken." },
    { h3: "Sterk contactblok", text: "Een goed bereikbaar contactblok met telefoon, mail en WhatsApp zorgt dat geen enkele lead verloren gaat. Wij plaatsen deze altijd op de juiste plek." },
    { h3: "Lokale vindbaarheid", text: "Met sterke SEO teksten en een gekoppeld Google bedrijfsprofiel kom je hoger in de regionale zoekresultaten. Dat levert direct nieuwe klanten op." },
    { h3: "Mobiele snelheid", text: "Het meeste verkeer komt vanaf de telefoon, dus elke seconde laadtijd telt. Wij bouwen sites die binnen een paar seconden volledig zichtbaar zijn." },
    { h3: "Klantbeoordelingen", text: "Sociaal bewijs is goud waard online. Door reviews prominent te tonen wek je direct vertrouwen bij nieuwe bezoekers." },
    { h3: "Conversiegerichte CTA's", text: "Elke pagina krijgt heldere knoppen die bezoekers begeleiden naar de gewenste actie. Geen ruis, alleen focus op resultaat." },
  ],
  kapper: [
    { h3: "Online afsprakensysteem", text: "Klanten plannen het liefst 24/7 zelf hun knipbeurt. Wij koppelen een online agenda zodat je telefoon minder vaak gaat." },
    { h3: "Galerij met kapsels", text: "Foto's van jouw werk overtuigen sneller dan tekst. We tonen jouw stijl in een sfeervolle galerij die meegroeit met jouw portfolio." },
    { h3: "Duidelijk prijsoverzicht", text: "Klanten waarderen vooraf weten wat een behandeling kost. Een transparante prijslijst voorkomt drempels en aarzeling." },
    { h3: "Openingstijden en locatie", text: "Snel zichtbaar wanneer je open bent en waar je zit. Inclusief kaart, parkeerinfo en bereikbaarheid per OV." },
    { h3: "Reviews van vaste klanten", text: "Goede beoordelingen overtuigen nieuwe gasten direct. We integreren Google reviews automatisch op de site." },
  ],
  restaurant: [
    { h3: "Menukaart met sfeerfoto's", text: "Een goede menukaart maakt direct hongerig. Wij combineren leesbare menu items met smaakvolle foto's voor maximaal effect." },
    { h3: "Online reserveringssysteem", text: "Gasten boeken liever zelf een tafel dan dat ze bellen. Wij integreren een betrouwbaar reserveringssysteem zonder gedoe." },
    { h3: "Openingstijden en routebeschrijving", text: "Snel duidelijk wanneer je open bent en hoe gasten je vinden. Inclusief kaart en parkeertips voor wie van buiten komt." },
    { h3: "Sfeerbeelden van het interieur", text: "Foto's van de zaak laten zien wat gasten kunnen verwachten. We zorgen voor een mix die de juiste verwachting wekt." },
    { h3: "Reviews en recensies", text: "Goede beoordelingen helpen twijfelaars over de streep. Wij koppelen externe reviewbronnen direct aan jouw site." },
    { h3: "Bestelmodule of afhalen", text: "Bied je takeaway? Een eenvoudige bestelflow zorgt voor extra omzet zonder hoge commissies aan platforms." },
  ],
};

// FNV style hash for stable selection
const hash = (s) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
};

const pick = (arr, key, offset = 0) => arr[(hash(key) + offset) % arr.length];

// Pick 3 unique benefits per city using shuffled offset
const pickBenefits = (key, count) => {
  const used = new Set();
  const result = [];
  let off = 0;
  while (result.length < count && off < benefitOptions.length * 3) {
    const idx = (hash(key) + off * 7) % benefitOptions.length;
    if (!used.has(idx)) {
      used.add(idx);
      result.push(benefitOptions[idx]);
    }
    off++;
  }
  return result;
};

const cityRecord = (c, i) => {
  const title = titlePatterns[i % titlePatterns.length](c.name);
  const meta = cityMetaPatterns[i % cityMetaPatterns.length](c.name);
  const h1 = cityH1Patterns[i % cityH1Patterns.length](c.name);
  const heroSubtitle = `Ondernemen in ${c.name} betekent werken in ${c.market}. Nieuwblik bouwt voor jou een website die opvalt, vertrouwen wekt en klanten oplevert.`;
  const intro = cityIntros[i % cityIntros.length](c);

  // Section 1
  const s1H2Variants = [
    `Waarom ${c.name}se ondernemers kiezen voor een sterke website`,
    `Zo valt jouw bedrijf in ${c.name} online op`,
    `Online groeien als ondernemer in ${c.name} begint hier`,
    `Een website die werkt voor MKB in ${c.name}`,
    `De kracht van een professionele site voor ${c.name}`,
    `Wat een goede website betekent voor jouw bedrijf in ${c.name}`,
    `Slim online aanwezig zijn als ondernemer in ${c.name}`,
    `Webdesign dat past bij ondernemen in ${c.name}`,
    `Bouw aan jouw merk in ${c.name} met een sterke site`,
    `Een website die meer doet voor jouw zaak in ${c.name}`,
  ];
  const s1H2 = s1H2Variants[i % s1H2Variants.length];
  const benefits = pickBenefits(c.slug + "b", 3);

  const s2H2Variants = [
    `Wat je tegenkomt zonder Nieuwblik als ondernemer in ${c.name}`,
    `Herken jij deze problemen als ondernemer in ${c.name}?`,
    `Zo verschilt werken met Nieuwblik van andere bureaus in ${c.name}`,
    `Veelvoorkomende valkuilen voor MKB in ${c.name}`,
    `Waar het vaak misgaat bij websites in ${c.name}`,
    `Het verschil dat Nieuwblik maakt voor ondernemers in ${c.name}`,
    `Geen tijd verspillen aan trage bureaus in ${c.name}`,
    `Wat ondernemers in ${c.name} tegenhoudt online`,
    `Eindelijk een bureau dat snapt wat MKB in ${c.name} nodig heeft`,
    `Stop met websitezorgen, ${c.name} edition`,
  ];
  const s3H2Variants = [
    `Wat ondernemers zeggen over samenwerken met Nieuwblik`,
    `Ervaringen van klanten die voor Nieuwblik kozen`,
    `Tevreden klanten vertellen over hun nieuwe website`,
    `Stemmen van MKB ondernemers die ons inschakelden`,
    `Reacties van klanten na de oplevering`,
    `Verhalen van ondernemers die met ons werkten`,
    `Wat onze klanten zeggen na livegang`,
    `Klantverhalen die laten zien wat wij doen`,
    `Reviews van ondernemers die kozen voor Nieuwblik`,
    `Eerlijke ervaringen met Nieuwblik`,
  ];
  const s4H2Variants = [
    `Bekijk onze recente projecten`,
    `Websites die wij bouwden voor ondernemers als jij`,
    `Werk waar we trots op zijn`,
    `Een greep uit onze laatste opleveringen`,
    `Projecten die laten zien wat we maken`,
    `Het werk van Nieuwblik in beeld`,
    `Inspiratie uit ons portfolio`,
    `Recent opgeleverde websites`,
    `Een blik op onze klantprojecten`,
    `Cases die voor zich spreken`,
  ];
  const s4Intros = [
    `Een selectie van projecten die laten zien hoe wij ondernemers ook in ${c.name} verder helpen.`,
    `Bekijk hoe we voor andere MKB klanten resultaat boekten en wat dat voor jouw bedrijf in ${c.name} kan betekenen.`,
    `Deze cases tonen onze aanpak in beeld, met dezelfde kwaliteit die wij ondernemers in ${c.name} bieden.`,
  ];
  const faqH2Variants = [
    `Veelgestelde vragen over website laten maken in ${c.name}`,
    `Wat ondernemers in ${c.name} ons het vaakst vragen`,
    `Jouw vragen over webdesign in ${c.name} beantwoord`,
    `Antwoorden op de meest gestelde vragen uit ${c.name}`,
    `FAQ voor ondernemers die starten in ${c.name}`,
  ];
  const contactH2Variants = [
    `Klaar voor een website die werkt voor jouw bedrijf in ${c.name}?`,
    `Benieuwd wat Nieuwblik kan betekenen voor jouw zaak in ${c.name}?`,
    `Tijd voor een nieuwe website voor jouw onderneming in ${c.name}?`,
    `Laten we samen jouw online verhaal in ${c.name} sterker maken`,
    `Plan jouw kennismaking en groei online in ${c.name}`,
  ];

  return {
    slug: c.slug,
    name: c.name,
    title,
    metaDescription: meta,
    h1,
    heroSubtitle,
    intro,
    section1: {
      h2: s1H2,
      body: intro,
      benefits,
    },
    section2H2: s2H2Variants[i % s2H2Variants.length],
    section3H2: s3H2Variants[i % s3H2Variants.length],
    section4: {
      h2: s4H2Variants[i % s4H2Variants.length],
      intro: s4Intros[i % s4Intros.length],
    },
    faq: {
      h2: faqH2Variants[i % faqH2Variants.length],
      items: [
        { q: `Komen jullie ook naar ${c.name} toe of werken jullie volledig op afstand?`, a: cityFaqA1Templates[i % cityFaqA1Templates.length](c.name) },
        { q: `Wat kost een website laten maken voor een ondernemer in ${c.name}?`, a: cityFaqA2Templates[i % cityFaqA2Templates.length](c.name) },
        { q: `Hoe snel staat mijn website live als ik in ${c.name} zit?`, a: cityFaqA3Templates[i % cityFaqA3Templates.length](c.name) },
        { q: `Hoe ziet het proces eruit van eerste gesprek tot live in ${c.name}?`, a: cityFaqA4Templates[i % cityFaqA4Templates.length](c.name) },
      ],
    },
    contactBlock: {
      h2: contactH2Variants[i % contactH2Variants.length],
      body: `Wij denken graag met je mee over jouw plannen in ${c.name}. Of je nu een eerste site nodig hebt of jouw bestaande website wilt vernieuwen, neem contact op en ontdek hoe Nieuwblik bijdraagt aan jouw online groei.`,
    },
    internalLinks: `Nieuwblik werkt voor ondernemers in heel Nederland, ook in ${c.name}. Bekijk onze diensten, scroll door ons portfolio voor inspiratie of neem direct contact op via onze contactpagina.`,
  };
};

const industryRecord = (b, i) => {
  const title = titlePatterns[(i + 3) % titlePatterns.length](`voor een ${b.name}`);
  const meta = industryMetaPatterns[i % industryMetaPatterns.length](b.name);
  const h1 = industryH1Patterns[i % industryH1Patterns.length](b.name);
  const heroSubtitle = `Een ${b.name.toLowerCase()} heeft te maken met ${b.challenge}. Met een sterke website van Nieuwblik laat je vakmanschap zien en zet je bezoekers om in klanten.`;
  const intro = industryIntros[i % industryIntros.length](b);

  const needsKey = industryNeedsBank[b.slug] ? b.slug : "default";
  const needs = industryNeedsBank[needsKey];

  const s1H2Variants = [
    `Wat maakt een goede website voor een ${b.name.toLowerCase()}?`,
    `Dit verwachten klanten van een ${b.name.toLowerCase()} website`,
    `Hoe een sterke website meer oplevert voor jouw ${b.name.toLowerCase()}`,
    `Essentiële onderdelen van een ${b.name.toLowerCase()} site`,
    `Wat een professionele website jouw ${b.name.toLowerCase()} brengt`,
    `Hoe een ${b.name.toLowerCase()} online het verschil maakt`,
    `De juiste basis voor een ${b.name.toLowerCase()} website`,
    `Wat een succesvolle ${b.name.toLowerCase()} site bevat`,
    `Bouwstenen van een sterke ${b.name.toLowerCase()} website`,
    `Wat jouw ${b.name.toLowerCase()} website beslist nodig heeft`,
  ];
  const s2H2Variants = [
    `Waarom veel ${b.plural} online onzichtbaar blijven`,
    `Het verschil tussen een matige en sterke ${b.name.toLowerCase()} website`,
    `Zo loopt een ${b.name.toLowerCase()} zonder goede site klanten mis`,
    `Veelvoorkomende valkuilen voor een ${b.name.toLowerCase()} online`,
    `Wat de meeste ${b.plural} verkeerd doen op hun website`,
    `Het verschil dat Nieuwblik maakt voor een ${b.name.toLowerCase()}`,
    `Stop met onzichtbaar zijn als ${b.name.toLowerCase()}`,
    `Waar ${b.plural} vaak vastlopen online`,
    `Eindelijk een bureau dat een ${b.name.toLowerCase()} begrijpt`,
    `Wat jouw ${b.name.toLowerCase()} mist op de huidige website`,
  ];
  const s3H2Variants = [
    `Wat onze klanten zeggen over hun nieuwe website`,
    `${b.plural.charAt(0).toUpperCase() + b.plural.slice(1)} en andere ondernemers gingen je voor`,
    `Resultaten die spreken voor zich`,
    `Ervaringen van ondernemers die voor Nieuwblik kozen`,
    `Reacties van klanten na livegang`,
    `Verhalen uit het werkveld`,
    `Wat klanten zeggen na de oplevering`,
    `Klantfeedback in eigen woorden`,
    `Stemmen uit ons klantenbestand`,
    `Eerlijke reviews van Nieuwblik klanten`,
  ];
  const s4H2Variants = [
    `Websites die wij bouwden voor ondernemers in jouw sector`,
    `Onze recente projecten spreken voor zich`,
    `Van ontwerp tot live, bekijk ons werk`,
    `Een blik op recent opgeleverde sites`,
    `Wat we voor andere ondernemers maakten`,
    `Cases die laten zien wat we doen`,
    `Inspiratie uit ons recente portfolio`,
    `Een greep uit onze klantprojecten`,
    `Werk waar we trots op zijn`,
    `Recent gelanceerde websites uit ons portfolio`,
  ];
  const s4Intros = [
    `Een selectie van projecten die onze aanpak laten zien, ook relevant voor een ${b.name.toLowerCase()}.`,
    `Bekijk hoe we andere ondernemers verder hielpen en wat dat betekent voor jouw ${b.name.toLowerCase()}.`,
    `Deze cases geven een goed beeld van wat wij voor een ${b.name.toLowerCase()} kunnen betekenen.`,
  ];
  const faqH2Variants = [
    `Veelgestelde vragen over een website voor een ${b.name.toLowerCase()}`,
    `Wat ${b.plural} ons het vaakst vragen`,
    `Alles wat je wilt weten over jouw ${b.name.toLowerCase()} website`,
    `Antwoorden voor de moderne ${b.name.toLowerCase()}`,
    `FAQ voor de ${b.name.toLowerCase()} branche`,
  ];
  const contactH2Variants = [
    `Benieuwd wat Nieuwblik kan betekenen voor jouw ${b.name.toLowerCase()}?`,
    `Tijd voor een nieuwe website voor jouw ${b.short}?`,
    `Klaar om jouw ${b.name.toLowerCase()} online te laten groeien?`,
    `Laten we samen werken aan jouw ${b.name.toLowerCase()} website`,
    `Plan een gesprek over jouw ${b.short} en ontdek de mogelijkheden`,
  ];

  return {
    slug: b.slug,
    name: b.name,
    title,
    metaDescription: meta,
    h1,
    heroSubtitle,
    intro,
    section1: {
      h2: s1H2Variants[i % s1H2Variants.length],
      body: intro,
      needs,
    },
    section2H2: s2H2Variants[i % s2H2Variants.length],
    section3H2: s3H2Variants[i % s3H2Variants.length],
    section4: {
      h2: s4H2Variants[i % s4H2Variants.length],
      intro: s4Intros[i % s4Intros.length],
    },
    faq: {
      h2: faqH2Variants[i % faqH2Variants.length],
      items: [
        { q: `Welke functies zijn essentieel op een website voor een ${b.name.toLowerCase()}?`, a: industryFaqA1Templates[i % industryFaqA1Templates.length](b.name) },
        { q: `Wat kost een website voor een ${b.name.toLowerCase()} bij Nieuwblik?`, a: industryFaqA2Templates[i % industryFaqA2Templates.length](b.name) },
        { q: `Hoe lang duurt een websiteproject voor een ${b.name.toLowerCase()}?`, a: industryFaqA3Templates[i % industryFaqA3Templates.length](b.name) },
        { q: `Hoe helpt de site nieuwe klanten aantrekken voor mijn ${b.name.toLowerCase()}?`, a: industryFaqA4Templates[i % industryFaqA4Templates.length](b.name) },
      ],
    },
    contactBlock: {
      h2: contactH2Variants[i % contactH2Variants.length],
      body: `Wij bouwen graag mee aan jouw online verhaal als ${b.name.toLowerCase()}. Neem vrijblijvend contact op om te bespreken wat een sterke website voor jouw bedrijf kan betekenen.`,
    },
    internalLinks: `Nieuwblik bouwt websites voor ondernemers door heel Nederland, ook voor een ${b.name.toLowerCase()}. Bekijk onze diensten, ontdek meer cases in ons portfolio of leer ons kennen via de over ons pagina.`,
  };
};

// Build records
const cityRecords = cities.map(cityRecord);
const industryRecords = industries.map(industryRecord);

// Verify uniqueness of critical fields
const checkUnique = (label, getter, records) => {
  const seen = new Map();
  records.forEach((r) => {
    const v = getter(r);
    if (seen.has(v)) console.warn(`DUP ${label}: "${v}" in ${r.slug} and ${seen.get(v)}`);
    else seen.set(v, r.slug);
  });
};

const all = [...cityRecords, ...industryRecords];
checkUnique("title", (r) => r.title, all);
checkUnique("meta", (r) => r.metaDescription, all);
checkUnique("h1", (r) => r.h1, all);
checkUnique("intro", (r) => r.intro, all);

// Output as TS files
const cityTs = `// Auto-generated by scripts/generate-landing-data.mjs. Do not edit by hand.
export interface CityBenefit { h3: string; text: string; }
export interface CityFaqItem { q: string; a: string; }
export interface CityRecord {
  slug: string;
  name: string;
  title: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  intro: string;
  section1: { h2: string; body: string; benefits: CityBenefit[]; };
  section2H2: string;
  section3H2: string;
  section4: { h2: string; intro: string; };
  faq: { h2: string; items: CityFaqItem[]; };
  contactBlock: { h2: string; body: string; };
  internalLinks: string;
}

export const cities: CityRecord[] = ${JSON.stringify(cityRecords, null, 2)};

export const getCityBySlug = (slug: string) => cities.find((c) => c.slug === slug);
`;

const indTs = `// Auto-generated by scripts/generate-landing-data.mjs. Do not edit by hand.
export interface IndustryNeed { h3: string; text: string; }
export interface IndustryFaqItem { q: string; a: string; }
export interface IndustryRecord {
  slug: string;
  name: string;
  title: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  intro: string;
  section1: { h2: string; body: string; needs: IndustryNeed[]; };
  section2H2: string;
  section3H2: string;
  section4: { h2: string; intro: string; };
  faq: { h2: string; items: IndustryFaqItem[]; };
  contactBlock: { h2: string; body: string; };
  internalLinks: string;
}

export const industries: IndustryRecord[] = ${JSON.stringify(industryRecords, null, 2)};

export const getIndustryBySlug = (slug: string) => industries.find((c) => c.slug === slug);
`;

const outDir = path.resolve("src/data");
fs.writeFileSync(path.join(outDir, "cities.ts"), cityTs);
fs.writeFileSync(path.join(outDir, "industries.ts"), indTs);
console.log(`Generated ${cityRecords.length} cities and ${industryRecords.length} industries.`);
