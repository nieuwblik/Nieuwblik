// Supplemental, branche-specific content for the programmatic industry landing
// pages (/website-laten-maken-{slug}). Kept separate from industries.ts (which
// is auto-generated — see its own header) so this hand-authored content never
// gets overwritten by a regeneration of that file.
//
// `relevantCaseSlugs` only ever reference real, existing portfolio projects
// (see src/data/projects.ts) — some are an exact industry match, others are
// the closest genuine fit we have (e.g. a general professional-services or
// healthcare-adjacent case) rather than a fabricated project.
export interface IndustryExtra {
  slug: string;
  painpoints: string[];
  features: string[];
  relevantCaseSlugs: string[];
}

export const industryExtras: IndustryExtra[] = [
  {
    slug: "kapper",
    painpoints: [
      "Klanten willen 24/7 online een afspraak kunnen inplannen, niet alleen bellen tijdens werktijd.",
      "Prijslijsten en behandelingen zijn vaak nergens duidelijk terug te vinden.",
      "Social media werkt goed voor sfeerbeeld, maar mist een centrale plek om te boeken en te overtuigen.",
    ],
    features: [
      "Online afsprakenmodule gekoppeld aan de agenda",
      "Overzichtelijke prijslijst per behandeling",
      "Foto- of Instagram-galerij van eerder werk",
      "Reviews en beoordelingen zichtbaar op de homepage",
    ],
    relevantCaseSlugs: ["lashlution"],
  },
  {
    slug: "restaurant",
    painpoints: [
      "Gasten zoeken eerst online naar het menu en openingstijden voordat ze bellen of langskomen.",
      "Reserveren via telefoon kost tijd tijdens drukke diensten.",
      "Een verouderde website met een oude menukaart wekt weinig vertrouwen.",
    ],
    features: [
      "Digitale menukaart die eenvoudig zelf bij te werken is",
      "Online reserveringssysteem of duidelijke reserveringsknop",
      "Sfeervolle fotogalerij van interieur en gerechten",
      "Actuele openingstijden en bereikbaarheid in één oogopslag",
    ],
    relevantCaseSlugs: ["edventure-boats"],
  },
  {
    slug: "bouwbedrijf",
    painpoints: [
      "Potentiële klanten willen eerst eerder werk zien voordat ze een offerte aanvragen.",
      "Zonder duidelijke werkgebieden en specialismen is het lastig de juiste klus binnen te halen.",
      "Offertes aanvragen via alleen een telefoonnummer werkt drempelverhogend.",
    ],
    features: [
      "Projectenoverzicht met foto's van opgeleverd werk",
      "Helder offerteformulier met projectomschrijving",
      "Overzicht van specialismen en werkgebied",
      "Klantbeoordelingen en referentieprojecten",
    ],
    relevantCaseSlugs: ["rrs-royal", "feitsma-dakwerken"],
  },
  {
    slug: "schoonheidssalon",
    painpoints: [
      "Klanten willen behandelingen en prijzen vooraf kunnen vergelijken.",
      "Boeken via WhatsApp of telefoon is tijdrovend voor zowel salon als klant.",
      "Vertrouwen wekken vraagt om sfeervolle beelden van de salon en behaalde resultaten.",
    ],
    features: [
      "Online boekingsmodule per behandeling",
      "Behandeloverzicht met prijzen en duur",
      "Sfeervolle fotogalerij van salon en resultaten",
      "Cadeaubonnen of arrangementen direct te bestellen",
    ],
    relevantCaseSlugs: ["lashlution", "puur-in-harmonie"],
  },
  {
    slug: "fysiotherapeut",
    painpoints: [
      "Nieuwe patiënten willen weten of hun klacht en verzekering aansluiten voordat ze bellen.",
      "Een eerste afspraak inplannen verloopt vaak nog telefonisch.",
      "Specialisaties binnen de praktijk zijn online niet altijd duidelijk.",
    ],
    features: [
      "Overzicht van specialisaties en behandelmethodes",
      "Online een afspraak aanvragen of inplannen",
      "Duidelijke informatie over vergoeding en verzekering",
      "Patiëntervaringen en praktijkinformatie",
    ],
    relevantCaseSlugs: ["quantum-rehab-europe", "danique-kwakman"],
  },
  {
    slug: "accountant",
    painpoints: [
      "Ondernemers zoeken een accountant die hun sector en bedrijfsgrootte begrijpt.",
      "Diensten en tarieven zijn online vaak vaag of helemaal niet vermeld.",
      "Vertrouwen wekken is lastig zonder heldere uitleg en persoonlijke aanpak.",
    ],
    features: [
      "Helder overzicht van diensten per doelgroep (zzp, mkb, dga)",
      "Beveiligde documentenportal of duidelijke contactroute",
      "Uitleg over tarieven of pakketten",
      "Klantcases en testimonials",
    ],
    relevantCaseSlugs: ["benoted", "erica-van-dijk"],
  },
  {
    slug: "makelaar",
    painpoints: [
      "Kopers en verkopers verwachten een actueel en doorzoekbaar woningaanbod.",
      "Vertrouwen in lokale marktkennis is doorslaggevend bij de keuze voor een makelaar.",
      "Een gedateerde website met foto's van lage kwaliteit schrikt af.",
    ],
    features: [
      "Actueel, doorzoekbaar woningaanbod met filters",
      "Waardebepaling of taxatie direct aanvragen",
      "Sterke fotografie en plattegronden per woning",
      "Lokale marktkennis en reviews zichtbaar",
    ],
    relevantCaseSlugs: ["carbon6"],
  },
  {
    slug: "tandarts",
    painpoints: [
      "Patiënten met angst of twijfel zoeken online naar een geruststellende, persoonlijke uitstraling.",
      "Een afspraak inplannen buiten kantooruren is telefonisch niet mogelijk.",
      "Behandelingen en tarieven zijn vaak niet transparant.",
    ],
    features: [
      "Online afspraak aanvragen, ook buiten openingstijden",
      "Overzicht van behandelingen in begrijpelijke taal",
      "Voorstelling van het team voor een persoonlijke eerste indruk",
      "Informatie over vergoeding en tarieven",
    ],
    relevantCaseSlugs: ["puur-in-harmonie"],
  },
  {
    slug: "personal-trainer",
    painpoints: [
      "Potentiële klanten willen een trainingsstijl en resultaten zien voordat ze een intake boeken.",
      "Een strak schema bijhouden naast losse social media posts is tijdrovend.",
      "Zonder duidelijke pakketten is het lastig voor klanten om een keuze te maken.",
    ],
    features: [
      "Online intake of proefles boeken",
      "Voor- en na-resultaten of klantcases",
      "Overzicht van trainingspakketten en tarieven",
      "Trainingsvideo's of voorbeeldschema's",
    ],
    relevantCaseSlugs: ["casper-nieskens-pt"],
  },
  {
    slug: "advocaat",
    painpoints: [
      "Cliënten zoeken eerst vertrouwen en specialisatie voordat ze contact opnemen over een gevoelige zaak.",
      "Rechtsgebieden en werkwijze zijn online vaak te juridisch of onduidelijk beschreven.",
      "Een eerste contactmoment moet laagdrempelig aanvoelen.",
    ],
    features: [
      "Heldere uitleg per rechtsgebied in begrijpelijke taal",
      "Laagdrempelig contactformulier voor een eerste gesprek",
      "Voorstelling van advocaten en hun expertise",
      "Cliëntervaringen en behaalde resultaten",
    ],
    relevantCaseSlugs: ["erica-van-dijk", "benoted"],
  },
  {
    slug: "interieurontwerper",
    painpoints: [
      "Klanten willen eerst een portfolio zien voordat ze een ontwerper inschakelen.",
      "Stijl en aanpak zijn moeilijk over te brengen via alleen tekst.",
      "Een offerte aanvragen voelt vaak formeel en drempelverhogend.",
    ],
    features: [
      "Uitgebreide portfoliogalerij per project of stijl",
      "Inspiratie- of moodboardpagina's",
      "Laagdrempelig contactformulier voor een kennismaking",
      "Werkwijze in duidelijke stappen uitgelegd",
    ],
    relevantCaseSlugs: ["interieur-studio-laan"],
  },
  {
    slug: "fotograaf",
    painpoints: [
      "Een sterk portfolio is de belangrijkste reden dat klanten juist voor deze fotograaf kiezen.",
      "Pakketten en prijzen zijn online vaak niet te vinden, wat leidt tot afhakende bezoekers.",
      "Beschikbaarheid checken kost over en weer veel e-mailverkeer.",
    ],
    features: [
      "Snel ladende, uitgebreide portfoliogalerij",
      "Pakketten en prijzen overzichtelijk gepresenteerd",
      "Online beschikbaarheid checken of boeken",
      "Klantreviews en eerdere shoots per categorie",
    ],
    relevantCaseSlugs: ["edventure-boats"],
  },
  {
    slug: "schilder",
    painpoints: [
      "Klanten willen eerder werk zien voordat ze een schilder over de vloer laten komen.",
      "Prijsindicaties ontbreken vaak, waardoor bezoekers afhaken voor een offerte.",
      "Vertrouwen wekken vraagt om duidelijke garanties en werkwijze.",
    ],
    features: [
      "Projectenoverzicht met voor- en na-foto's",
      "Eenvoudig offerteformulier met foto-upload",
      "Uitleg over materialen, garantie en werkwijze",
      "Klantbeoordelingen per type klus",
    ],
    relevantCaseSlugs: ["feitsma-dakwerken", "rrs-royal"],
  },
  {
    slug: "loodgieter",
    painpoints: [
      "Bij een lekkage of storing zoeken klanten direct een bereikbare loodgieter, vaak buiten kantooruren.",
      "Vertrouwen in vakmanschap is lastig over te brengen zonder duidelijke werkgebieden en reviews.",
      "Spoedklussen vragen om een laagdrempelige, snelle contactmogelijkheid.",
    ],
    features: [
      "Duidelijk zichtbaar telefoonnummer en spoedservice",
      "Overzicht van diensten en werkgebied",
      "Klantbeoordelingen en eerdere klussen",
      "Eenvoudig offerte- of contactformulier",
    ],
    relevantCaseSlugs: ["esveld-installatie", "mhb-techniek"],
  },
  {
    slug: "elektricien",
    painpoints: [
      "Klanten willen snel weten of een elektricien beschikbaar is voor storingen of nieuwe aanleg.",
      "Certificeringen en veiligheidskeurmerken zijn online niet altijd zichtbaar, terwijl dit vertrouwen wekt.",
      "Offertes aanvragen verloopt vaak nog puur telefonisch.",
    ],
    features: [
      "Overzicht van diensten: van storingen tot laadpalen",
      "Certificeringen en keurmerken duidelijk vermeld",
      "Eenvoudig offerte- of contactformulier",
      "Werkgebied en beschikbaarheid overzichtelijk",
    ],
    relevantCaseSlugs: ["esveld-installatie", "aardingsbedrijf-west-friesland"],
  },
  {
    slug: "coach",
    painpoints: [
      "Potentiële klanten willen eerst de aanpak en persoonlijkheid van de coach ervaren voordat ze een traject starten.",
      "Het verschil tussen coachingsvormen is online vaak onduidelijk beschreven.",
      "Een eerste stap zetten voelt drempelverhogend zonder een laagdrempelige kennismaking.",
    ],
    features: [
      "Gratis kennismakingsgesprek direct inplannen",
      "Heldere uitleg van coachingstrajecten en aanpak",
      "Klantervaringen en behaalde resultaten",
      "Persoonlijk verhaal en werkwijze van de coach",
    ],
    relevantCaseSlugs: ["danique-kwakman", "erica-van-dijk"],
  },
  {
    slug: "therapeut",
    painpoints: [
      "Cliënten zoeken vaak op een kwetsbaar moment een therapeut die aansluit bij hun klacht.",
      "Vergoeding vanuit de verzekering is niet altijd duidelijk vermeld.",
      "Een eerste stap zetten moet laagdrempelig en vertrouwd aanvoelen.",
    ],
    features: [
      "Overzicht van behandelmethodes en specialisaties",
      "Informatie over vergoeding en verzekering",
      "Laagdrempelig contact- of intakeformulier",
      "Persoonlijke kennismaking met de therapeut",
    ],
    relevantCaseSlugs: ["danique-kwakman", "puur-in-harmonie"],
  },
  {
    slug: "horecabedrijf",
    painpoints: [
      "Gasten oriënteren zich online voordat ze boeken of langskomen voor een evenement of feest.",
      "Beschikbaarheid en mogelijkheden voor groepen of feesten zijn vaak niet duidelijk.",
      "Sfeerbeelden ontbreken, terwijl die vaak doorslaggevend zijn voor de keuze.",
    ],
    features: [
      "Sfeervolle fotogalerij van locatie en evenementen",
      "Overzicht van arrangementen en mogelijkheden",
      "Online aanvraag- of reserveringsformulier",
      "Actuele agenda met evenementen",
    ],
    relevantCaseSlugs: ["edventure-boats"],
  },
  {
    slug: "autogarage",
    painpoints: [
      "Klanten willen weten of een garage gespecialiseerd is in hun merk of type onderhoud.",
      "Een afspraak voor onderhoud of reparatie inplannen kost vaak een telefoontje tijdens werktijd.",
      "Prijsindicaties voor veelvoorkomend onderhoud ontbreken meestal.",
    ],
    features: [
      "Online afspraak inplannen voor onderhoud of APK",
      "Overzicht van specialisaties en merken",
      "Prijsindicaties voor veelvoorkomende diensten",
      "Klantbeoordelingen en werkplaatsinformatie",
    ],
    relevantCaseSlugs: ["mhb-techniek"],
  },
  {
    slug: "bloemist",
    painpoints: [
      "Klanten willen boeketten en arrangementen online kunnen bekijken en bestellen.",
      "Bezorging op de juiste dag en tijd moet duidelijk en betrouwbaar geregeld zijn.",
      "Een winkel zonder webshop loopt spontane, online bestellingen mis.",
    ],
    features: [
      "Webshop met boeketten en bezorgopties",
      "Seizoensgebonden collecties en arrangementen",
      "Duidelijke bezorginformatie en -gebieden",
      "Abonnementen voor terugkerende bestellingen",
    ],
    relevantCaseSlugs: ["een-bundel-geluk"],
  },
  {
    slug: "tuinman",
    painpoints: [
      "Klanten willen eerst gerealiseerde tuinen zien voordat ze een hovenier inschakelen.",
      "Onderhoud en aanleg zijn vaak twee verschillende diensten die niet duidelijk gescheiden worden.",
      "Offertes aanvragen zonder foto's van de eigen tuin werkt onnauwkeurig.",
    ],
    features: [
      "Projectengalerij met voor- en na-foto's",
      "Duidelijk onderscheid tussen aanleg en onderhoud",
      "Offerteformulier met foto-upload van de tuin",
      "Seizoensgebonden tips of inspiratie",
    ],
    relevantCaseSlugs: ["vdv-tuinen", "green-profit"],
  },
  {
    slug: "kinderopvang",
    painpoints: [
      "Ouders willen vertrouwen wekken via sfeerbeelden en heldere informatie over veiligheid en pedagogiek.",
      "Beschikbaarheid van plekken is vaak niet inzichtelijk zonder telefonisch contact.",
      "Een rondleiding of intake aanvragen voelt soms formeel.",
    ],
    features: [
      "Sfeervolle fotogalerij van de opvanglocatie",
      "Informatie over pedagogisch beleid en veiligheid",
      "Eenvoudig een rondleiding of intake aanvragen",
      "Actuele beschikbaarheid van opvangplekken",
    ],
    relevantCaseSlugs: ["een-bundel-geluk"],
  },
  {
    slug: "sportschool",
    painpoints: [
      "Nieuwe leden willen sfeer en lesrooster zien voordat ze zich inschrijven.",
      "Een proefles aanvragen verloopt vaak nog via telefoon of langskomen.",
      "Lidmaatschappen en tarieven zijn online niet altijd overzichtelijk.",
    ],
    features: [
      "Actueel lesrooster met alle groepslessen",
      "Online proefles of rondleiding aanvragen",
      "Overzicht van lidmaatschappen en tarieven",
      "Sfeerbeelden en video's van de sportschool",
    ],
    relevantCaseSlugs: ["casper-nieskens-pt", "karate-school-cor-slok"],
  },
  {
    slug: "boekhouder",
    painpoints: [
      "Zzp'ers en mkb'ers zoeken een boekhouder die past bij hun software en werkwijze.",
      "Diensten en pakketten zijn online vaak niet transparant geprijsd.",
      "Documenten uitwisselen via e-mail voelt niet veilig genoeg.",
    ],
    features: [
      "Overzicht van pakketten voor zzp en mkb",
      "Beveiligde documentenportal of duidelijke werkwijze",
      "Koppelingen met veelgebruikte boekhoudsoftware",
      "Klantcases en testimonials",
    ],
    relevantCaseSlugs: ["benoted", "erica-van-dijk"],
  },
  {
    slug: "architect",
    painpoints: [
      "Opdrachtgevers willen ontwerpvisie en eerdere projecten visueel kunnen beoordelen.",
      "Het ontwerptraject en de bijbehorende kosten zijn vaak onduidelijk vooraf.",
      "Een eerste kennismaking voelt zonder portfolio en werkwijze afstandelijk.",
    ],
    features: [
      "Uitgebreide projectengalerij per type opdracht",
      "Werkwijze en ontwerptraject in duidelijke fases",
      "Laagdrempelig contactformulier voor een kennismaking",
      "Visualisaties of 3D-impressies van projecten",
    ],
    relevantCaseSlugs: ["interieur-studio-laan", "rrs-royal"],
  },
  {
    slug: "verzekeringsadviseur",
    painpoints: [
      "Klanten willen onafhankelijk advies en heldere uitleg zonder verzekeringsjargon.",
      "Het vergelijken van polissen en dekkingen is online vaak niet mogelijk.",
      "Contact opnemen voor een second opinion voelt drempelverhogend.",
    ],
    features: [
      "Overzicht van verzekeringen en werkgebieden in heldere taal",
      "Direct een adviesgesprek of second opinion aanvragen",
      "Uitleg over onafhankelijkheid en werkwijze",
      "Klantervaringen en behaalde resultaten",
    ],
    relevantCaseSlugs: ["benoted", "erica-van-dijk"],
  },
  {
    slug: "dierenarts",
    painpoints: [
      "Huisdiereigenaren zoeken bij spoed direct een bereikbare praktijk met duidelijke openingstijden.",
      "Vertrouwen in de praktijk wordt sterk bepaald door een persoonlijke, toegankelijke uitstraling.",
      "Een afspraak inplannen buiten kantooruren is vaak niet mogelijk.",
    ],
    features: [
      "Duidelijke spoedinformatie en openingstijden",
      "Online een afspraak aanvragen of inplannen",
      "Voorstelling van het team en de praktijk",
      "Overzicht van behandelingen en diensten",
    ],
    relevantCaseSlugs: ["quantum-rehab-europe"],
  },
  {
    slug: "evenementenbureau",
    painpoints: [
      "Opdrachtgevers willen eerdere evenementen visueel en sfeervol terugzien.",
      "Mogelijkheden en pakketten zijn vaak niet concreet beschreven, waardoor offertes lang duren.",
      "Vertrouwen wekken vraagt om een professionele, ervaren uitstraling.",
    ],
    features: [
      "Sfeervolle portfoliogalerij van eerdere evenementen",
      "Overzicht van diensten en mogelijke pakketten",
      "Eenvoudig een offerte of adviesgesprek aanvragen",
      "Klantervaringen van opdrachtgevers",
    ],
    relevantCaseSlugs: ["edventure-boats"],
  },
  {
    slug: "reclamebureau",
    painpoints: [
      "Opdrachtgevers willen eerst bewezen resultaten en cases zien voordat ze een bureau inschakelen.",
      "Het aanbod aan diensten (van social media tot branding) is online vaak niet overzichtelijk.",
      "Vertrouwen wekken vraagt om een sterke, eigen merkidentiteit.",
    ],
    features: [
      "Uitgebreide cases met behaalde resultaten",
      "Helder overzicht van diensten en specialismen",
      "Sterke, onderscheidende visuele identiteit",
      "Laagdrempelig een kennismaking of adviesgesprek aanvragen",
    ],
    relevantCaseSlugs: ["benoted"],
  },
  {
    slug: "reinigingsbedrijf",
    painpoints: [
      "Klanten willen weten of een reinigingsbedrijf hun specifieke pand of situatie aankan.",
      "Terugkerende contracten en losse klussen vragen om verschillende, duidelijke informatie.",
      "Offertes aanvragen zonder situatieschets werkt onnauwkeurig.",
    ],
    features: [
      "Overzicht van diensten: van eenmalig tot contractreiniging",
      "Eenvoudig offerteformulier met situatieomschrijving",
      "Werkgebied en beschikbaarheid overzichtelijk",
      "Klantbeoordelingen en referenties",
    ],
    relevantCaseSlugs: ["esveld-installatie", "mhb-techniek"],
  },
];

export const getIndustryExtra = (slug: string): IndustryExtra | undefined =>
  industryExtras.find((e) => e.slug === slug);

// Loose thematic grouping, used only to pick 2-3 "related branches" for
// internal linking — not shown to visitors as a label anywhere.
const INDUSTRY_CATEGORY: Record<string, string> = {
  fysiotherapeut: "gezondheid",
  therapeut: "gezondheid",
  coach: "gezondheid",
  "personal-trainer": "gezondheid",
  tandarts: "gezondheid",
  dierenarts: "gezondheid",
  sportschool: "gezondheid",

  kapper: "beauty",
  schoonheidssalon: "beauty",

  fotograaf: "creatief",
  interieurontwerper: "creatief",
  architect: "creatief",
  reclamebureau: "creatief",
  evenementenbureau: "creatief",

  bouwbedrijf: "bouw",
  schilder: "bouw",
  loodgieter: "bouw",
  elektricien: "bouw",
  tuinman: "bouw",
  reinigingsbedrijf: "bouw",
  autogarage: "bouw",

  accountant: "zakelijk",
  boekhouder: "zakelijk",
  advocaat: "zakelijk",
  verzekeringsadviseur: "zakelijk",
  makelaar: "zakelijk",

  restaurant: "horeca",
  horecabedrijf: "horeca",
  bloemist: "horeca",
  kinderopvang: "horeca",
};

// Deterministic (array order, not random) — same slug always returns the
// same related branches.
export const getRelatedIndustrySlugs = (slug: string, count = 3): string[] => {
  const category = INDUSTRY_CATEGORY[slug];
  if (!category) return [];
  return industryExtras
    .map((e) => e.slug)
    .filter((s) => s !== slug && INDUSTRY_CATEGORY[s] === category)
    .slice(0, count);
};
