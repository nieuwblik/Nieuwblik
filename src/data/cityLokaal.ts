import { PRIJZEN } from "@/config/business";

/**
 * Handgeschreven, unieke inhoud per stadspagina.
 *
 * src/data/cities.ts wordt gegenereerd (scripts/generate-landing-data.mjs) en
 * levert voor alle 30 steden dezelfde opbouw met een andere plaatsnaam. Dit
 * bestand staat daar los van en krijgt voorrang: titel, meta description, H1,
 * het lokale tekstblok en de FAQ. Een stad die hier nog niet in staat, gebruikt
 * gewoon de gegenereerde tekst.
 *
 * Regels voor de inhoud:
 * - Alleen algemeen bekende, controleerbare feiten over de plaats. Bij twijfel weglaten.
 * - Geen verzonnen klanten, cases, cijfers of bezoeken. Een koppeling met een
 *   portfolioklant hoort als `TODO: bevestigen` in de oplevering, niet in de tekst.
 * - Titel maximaal 60 tekens, meta description maximaal 155 (getest in seo-verify).
 * - In de alinea's mag [tekst](/pad) staan voor een interne link.
 */
export interface CityLokaal {
  title: string;
  metaDescription: string;
  h1: string;
  /** Vervangt de gegenereerde intro-alinea. Ongeveer 200 tot 350 woorden. */
  lokaal: { h2: string; alineas: string[] };
  /** 4 tot 6 vragen die echt over deze plaats gaan. */
  faq: { q: string; a: string }[];
}

export const cityLokaal: Record<string, CityLokaal> = {
  leiden: {
    title: `Website laten maken Leiden | Vanaf €${PRIJZEN.starter}, op maat | Nieuwblik`,
    metaDescription: `Website op maat voor ondernemers in Leiden. Vanaf €${PRIJZEN.starter}, geen verborgen kosten en binnen enkele weken live. Vraag vrijblijvend een offerte aan.`,
    h1: "Website laten maken in Leiden",
    lokaal: {
      h2: "Ondernemen in Leiden: kennis, zorg en een drukke binnenstad",
      alineas: [
        "Leiden is een universiteitsstad. De Universiteit Leiden is de oudste van Nederland, en samen met het LUMC en het Leiden Bio Science Park zorgt dat voor een stad vol kennisintensieve bedrijven: onderzoek, life sciences, zorg en alle dienstverleners die daaromheen werken. Wie in die hoek onderneemt, heeft een website nodig die inhoud begrijpelijk maakt zonder oppervlakkig te worden. Een bezoeker die jouw dienst nog niet kent, moet binnen een paar zinnen snappen wat je doet en voor wie.",
        "Daarnaast heeft Leiden een historische binnenstad met grachten, hofjes en musea als Naturalis en het Rijksmuseum van Oudheden. Dat trekt bezoekers, en dat merken winkels, horeca en praktijken aan huis. Voor die ondernemers telt iets anders: snel vindbaar zijn op je telefoon, meteen zien waar je zit en wanneer je open bent, en in één tik kunnen bellen of een afspraak maken. Wij bouwen zulke sites mobiel eerst, omdat het merendeel van dat verkeer van een telefoon komt.",
        "Veel Leidse bedrijven werken bovendien met internationale collega's, studenten of klanten. Een site in twee talen is dan waardevol. Bij ons is meertaligheid een optionele uitbreiding en geen onderdeel van het startpakket: kies je ervoor, dan zetten we Nederlands en Engels netjes naast elkaar, met de juiste taalmarkering voor Google.",
        "Werk je vanuit Leiden ook in de omliggende steden, dan sluiten onze pagina's voor [Den Haag](/website-laten-maken-den-haag), [Delft](/website-laten-maken-delft) en [Zoetermeer](/website-laten-maken-zoetermeer) daarop aan. Wij zitten zelf in Enkhuizen en werken voor ondernemers door heel Nederland grotendeels op afstand.",
      ],
    },
    faq: [
      {
        q: "Werken jullie voor bedrijven in Leiden terwijl jullie in Enkhuizen zitten?",
        a: "Ja. We werken voor ondernemers door heel Nederland en doen dat grotendeels op afstand: kennismaken via videobellen, daarna contact via telefoon, mail en WhatsApp, steeds met hetzelfde aanspreekpunt. Wil je elkaar liever een keer fysiek spreken, dan kan dat in overleg.",
      },
      {
        q: "Kunnen jullie een website in het Nederlands én Engels maken voor internationale klanten of studenten?",
        a: "Ja. Voor bedrijven rond de universiteit, het LUMC en het Bio Science Park zetten we beide talen naast elkaar, met correcte hreflang-markering zodat Google per taal de juiste pagina toont en de versies niet met elkaar concurreren. Meertaligheid is een optionele uitbreiding en zit niet in het startpakket; we nemen het apart mee in je offerte.",
      },
      {
        q: "Wij zijn een zorgpraktijk in Leiden. Maken jullie daar ook websites voor?",
        a: "Ja. Denk aan fysiotherapie-, tandarts- en therapiepraktijken: een rustige opzet, duidelijke informatie over behandelingen en tarieven, en een eenvoudige manier om contact op te nemen of een afspraak aan te vragen. Per branche hebben we een aparte pagina met voorbeelden.",
      },
      {
        q: "Onze dienst is technisch ingewikkeld. Kunnen jullie die begrijpelijk uitleggen op de site?",
        a: "Daar begint het werk bij ons mee. We bepalen eerst voor wie de site bedoeld is en wat die bezoeker moet begrijpen, en bouwen de teksten van daaruit op: eerst de kern in gewone taal, daarna de diepte voor wie verder leest. Zo houd je een site die werkt voor een inkoper én voor een vakgenoot.",
      },
      {
        q: "Wij hebben een winkel of horecazaak in de Leidse binnenstad. Waar moeten we op letten?",
        a: "Vooral op mobiel. Bezoekers in de binnenstad zoeken op hun telefoon en willen meteen zien waar je zit, wanneer je open bent en hoe ze je bereiken. Dat zetten we bovenaan, met bellen en routebeschrijving op één tik. Daarnaast adviseren we over je Google Bedrijfsprofiel, want daar komen je openingstijden en route vandaan.",
      },
    ],
  },

  zoetermeer: {
    title: `Website laten maken Zoetermeer | Vanaf €${PRIJZEN.starter} | Nieuwblik`,
    metaDescription: `Ondernemer in Zoetermeer? Wij bouwen websites op maat vanaf €${PRIJZEN.starter}, zonder verborgen kosten en binnen enkele weken live. Vraag een offerte aan.`,
    h1: "Website laten maken in Zoetermeer",
    lokaal: {
      h2: "Ondernemen in Zoetermeer: een geplande stad met de Randstad om de hoek",
      alineas: [
        "Zoetermeer is in een paar decennia gegroeid van dorp tot een van de grotere steden van Zuid-Holland. De stad is grotendeels gepland en in fases gebouwd, met wijken die elk hun eigen winkelcentrum hebben en één groot centrum: het Stadshart. Dat levert veel consumentgerichte bedrijvigheid op — praktijken, salons, horeca, dienstverleners die bij mensen thuis komen. Voor die ondernemers begint een website bij één vraag: kan iemand die jou nog niet kent binnen een paar tellen zien wat je doet en hoe hij een afspraak maakt?",
        "Tegelijk ligt de rest van de Randstad om de hoek. Via de A12 en RandstadRail zijn Den Haag en Rotterdam zo bereikt, en veel Zoetermeerse bedrijven werken in een gebied dat een stuk groter is dan de gemeentegrens. Je concurreert dan niet alleen met de buurman, maar ook met aanbieders uit die grote steden. Een site die concreet is over wat je doet, voor wie en tegen welke prijs, wint het van een site die vooral mooi is.",
        "Zit je op een van de bedrijventerreinen aan de rand van de stad, dan komen klanten er zelden zomaar langs. Dan is je website je etalage: daar beoordeelt iemand of hij met je in zee gaat, nog voordat hij belt. Werk je juist vanuit een wijk of het Stadshart, dan draait het om vindbaarheid op de telefoon, actuele openingstijden en een route die klopt.",
        "Werk je vanuit Zoetermeer ook in de omliggende steden, dan sluiten onze pagina's voor [Den Haag](/website-laten-maken-den-haag), [Rotterdam](/website-laten-maken-rotterdam) en [Delft](/website-laten-maken-delft) daarop aan. Wij zitten zelf in Enkhuizen en werken voor ondernemers door heel Nederland grotendeels op afstand.",
      ],
    },
    faq: [
      {
        q: "Zoetermeer bestaat uit losse wijken met eigen winkelcentra. Moeten we daar iets mee op de site?",
        a: "Niet met aparte pagina's per wijk, want daar zoekt vrijwel niemand op. Wel loont het om op je contact- en routepagina concreet te zijn: bij welk winkelcentrum of welke halte je zit, waar bezoekers kunnen parkeren en hoe ze binnenkomen. Dat scheelt telefoontjes en zoekende klanten.",
      },
      {
        q: "Wij zitten op een bedrijventerrein waar geen klant zomaar langsloopt. Wat betekent dat voor onze website?",
        a: "Dan doet je site het werk dat een etalage anders doet. Zet bovenaan wat je maakt of levert en voor wie, laat echt werk zien in plaats van algemene beloftes, en maak offerte aanvragen makkelijk. Foto's van het pand en een duidelijke routebeschrijving helpen de bezoekers die wél langskomen.",
      },
      {
        q: "Onze klanten kiezen vaak een aanbieder uit Den Haag of Rotterdam. Hoe houden we ze in Zoetermeer?",
        a: "Door zichtbaar te maken wat je dichtbij te bieden hebt: sneller ter plaatse, korte lijnen, een bekend gezicht. Noem je werkgebied expliciet, zet je telefoonnummer op elke pagina en zorg dat je Google Bedrijfsprofiel klopt. Dat profiel bepaalt voor een groot deel of je opduikt als iemand in de buurt zoekt.",
      },
      {
        q: "Er zitten hier veel dienstverleners die ongeveer hetzelfde doen als wij. Hoe vallen we op?",
        a: "Niet met een mooiere homepage, maar door concreter te zijn dan de rest: welk probleem je oplost, voor wie, wat het ongeveer kost en wat de eerste stap is. Een prijsindicatie en twee uitgewerkte voorbeelden doen meer dan een pagina over kwaliteit en passie.",
      },
    ],
  },

  leeuwarden: {
    title: `Website laten maken Leeuwarden | Vanaf €${PRIJZEN.starter} | Nieuwblik`,
    metaDescription: `Website op maat voor ondernemers in Leeuwarden en heel Friesland. Vanaf €${PRIJZEN.starter}, geen verborgen kosten en binnen enkele weken live.`,
    h1: "Website laten maken in Leeuwarden",
    lokaal: {
      h2: "Ondernemen in Leeuwarden: hoofdstad van Friesland, werkgebied de hele provincie",
      alineas: [
        "Leeuwarden is de hoofdstad van Friesland en voor veel Friese ondernemers het punt waar klanten, leveranciers en instellingen samenkomen. Wie hier een bedrijf heeft, werkt zelden alleen binnen de stadsgrens: het werkgebied loopt vaak door tot Sneek, Drachten of Dokkum. Dat vraagt iets van je website. Die moet laten zien waar je werkt, niet alleen waar je kantoor of loods staat.",
        "In Friesland heb je bovendien met twee talen te maken. Het Fries is een officieel erkende taal en hoort voor veel bedrijven bij hun identiteit. Dat betekent niet dat je hele site vertaald moet worden: het zoekverkeer gaat grotendeels in het Nederlands. Fries werkt vaak het best waar het iets toevoegt, zoals in je verhaal over het bedrijf of in een campagne.",
        "De Friese economie leunt op een paar herkenbare pijlers: de agrarische sector met alles wat daaraan levert, watersport en toerisme rond de Friese meren, en zorg, onderwijs en overheid in de stad zelf. Leeuwarden was in 2018 culturele hoofdstad van Europa, en de toeristische bedrijvigheid die daarbij hoort is gebleven. Voor toeristische ondernemers telt het seizoen: je site moet in het vroege voorjaar al staan, met actuele prijzen en een aanvraagknop die werkt op een telefoon.",
        "Werk je vanuit Leeuwarden ook elders in het noorden, dan sluiten onze pagina's voor [Groningen](/website-laten-maken-groningen) en [Emmen](/website-laten-maken-emmen) daarop aan. Wij zitten in Enkhuizen, aan de andere kant van het IJsselmeer, en werken grotendeels op afstand.",
      ],
    },
    faq: [
      {
        q: "Moeten we onze website ook in het Fries aanbieden?",
        a: "Meestal niet volledig. Vrijwel al het zoekverkeer gaat in het Nederlands, dus een complete Friese vertaling kost meer dan hij oplevert. Zet het in waar het bij je merk past, bijvoorbeeld in een slogan of je bedrijfsverhaal. Wil je toch twee volledige talen, dan zetten we die netjes op met correcte taalmarkering; dat is een optionele uitbreiding.",
      },
      {
        q: "Ons werkgebied is heel Friesland en niet alleen Leeuwarden. Hoe leggen we dat vast op de site?",
        a: "Door je werkgebied expliciet te benoemen op je contactpagina en in je Google Bedrijfsprofiel, en door de plaatsen waar je echt komt te noemen op de pagina's waar dat past. Wat niet werkt is voor elk dorp een bijna identieke pagina maken: daar rekent Google je op af.",
      },
      {
        q: "Ons bedrijf draait op het seizoen, zoals verhuur en recreatie aan het water. Kan de site daarin meebewegen?",
        a: "Ja. We zorgen dat je zelf prijzen, openingstijden en beschikbaarheid kunt aanpassen zonder ons, en dat de aanvraagknop het opvallendste element op een telefoonscherm is. In het laagseizoen vervang je die door een wachtlijst of een formulier voor volgend jaar.",
      },
      {
        q: "Wij leveren aan agrarische bedrijven. Wat verwacht zo'n klant van een website?",
        a: "Vooral duidelijkheid en bereikbaarheid: wat je levert, van welke merken, wat de levertijd is en wie hij belt als er iets stilstaat. Specificaties, voorraadinformatie en een telefoonnummer op elke pagina wegen zwaarder dan sfeervolle teksten.",
      },
    ],
  },

  zwolle: {
    title: `Website laten maken Zwolle | Op maat vanaf €${PRIJZEN.starter} | Nieuwblik`,
    metaDescription: `Website op maat voor ondernemers in Zwolle en Oost-Nederland. Vanaf €${PRIJZEN.starter}, geen verborgen kosten en binnen enkele weken live.`,
    h1: "Website laten maken in Zwolle",
    lokaal: {
      h2: "Ondernemen in Zwolle: knooppunt van Oost-Nederland",
      alineas: [
        "Zwolle ligt op een knooppunt. Wegen en spoorlijnen uit alle richtingen komen hier samen, en daardoor is de stad voor veel bedrijven een logisch vertrekpunt om Overijssel, Drenthe, Flevoland en de Veluwe te bedienen. Dat zie je terug in het soort bedrijvigheid: groothandel, bouw, installatie, transport en de zakelijke dienstverlening die daaromheen zit. Voor die bedrijven is een website minder een visitekaartje en meer een filter: hij moet de juiste klant binnenhalen en de rest tijd besparen.",
        "Daarnaast heeft Zwolle een paar grote werkgevers die de stad kleuren, zoals het Isala-ziekenhuis en hogeschool Windesheim. Wie daaraan levert of daar personeel vandaan haalt, krijgt te maken met tegenpartijen die je site serieus bekijken voordat ze je uitnodigen. Een verzorgde, actuele site met echte referenties doet daar meer dan een advertentie.",
        "Tegelijk is er de oude Hanzestad: een compacte binnenstad binnen de grachten, met winkels, horeca en praktijken die het van bezoekers uit de hele regio moeten hebben. Voor hen telt vooral de telefoon — openingstijden, route en één tik om te bellen of te reserveren.",
        "Werk je vanuit Zwolle ook verderop in Oost-Nederland, dan sluiten onze pagina's voor [Deventer](/website-laten-maken-deventer), [Apeldoorn](/website-laten-maken-apeldoorn) en [Enschede](/website-laten-maken-enschede) daarop aan. Wij zitten zelf in Enkhuizen en werken voor ondernemers door heel Nederland grotendeels op afstand.",
      ],
    },
    faq: [
      {
        q: "Wij leveren aan grote organisaties zoals ziekenhuizen en scholen. Hoe moet onze site er dan uitzien?",
        a: "Zakelijk en controleerbaar. Zet je referenties, certificeringen en een duidelijk overzicht van wat je levert op een plek die in twee klikken te vinden is, met een contactpersoon erbij. Inkopers bekijken je site voordat ze je uitnodigen; ze zoeken bewijs, geen sfeer.",
      },
      {
        q: "We krijgen onze vacatures in de bouw en techniek niet gevuld. Kan onze website daarbij helpen?",
        a: "Ja, en dat wordt vaak onderschat. Een eigen werken-bij-pagina met foto's van het echte team, wat je betaalt en hoe een werkdag eruitziet, doet meer dan een advertentie op een vacaturebank. Zorg dat solliciteren via de telefoon kan, met een kort formulier of een WhatsApp-knop.",
      },
      {
        q: "Wij bedienen vanuit Zwolle een groot gebied. Moeten we per plaats een aparte pagina maken?",
        a: "Alleen als je er echt iets anders te vertellen hebt. Tien bijna identieke pagina's met een andere plaatsnaam doen je meer kwaad dan goed. Benoem in plaats daarvan je werkgebied op één duidelijke pagina en zet het ook zo in je Google Bedrijfsprofiel.",
      },
      {
        q: "Onze zaak zit in de binnenstad binnen de grachten. Waar moeten we op letten?",
        a: "Op de praktische dingen die bezoekers uit de regio nodig hebben: actuele openingstijden, waar ze het dichtstbij parkeren en hoe ze de zaak vinden. Dat willen ze onderweg op hun telefoon zien. Houd die gegevens ook bij in je Google Bedrijfsprofiel, want die worden het vaakst gelezen.",
      },
    ],
  },

  eindhoven: {
    title: `Website laten maken Eindhoven | Vanaf €${PRIJZEN.starter} | Nieuwblik`,
    metaDescription: `Website op maat voor ondernemers in Eindhoven en Brainport. Vanaf €${PRIJZEN.starter}, geen verborgen kosten en binnen enkele weken live.`,
    h1: "Website laten maken in Eindhoven",
    lokaal: {
      h2: "Ondernemen in Eindhoven: techniek, design en een internationale klantenkring",
      alineas: [
        "Eindhoven draait om techniek. De stad groeide met Philips en is uitgegroeid tot het hart van Brainport, met de High Tech Campus, de TU Eindhoven en een dichte laag toeleveranciers eromheen: metaalbewerking, besturingstechniek, software, engineering. Wie in die keten zit, verkoopt zelden aan een consument. Je website wordt gelezen door een engineer of een inkoper die wil weten wat je precies kunt, binnen welke toleranties en met welke doorlooptijd.",
        "Daarnaast heeft Eindhoven een sterke ontwerptraditie; de Dutch Design Week trekt er jaarlijks veel bezoekers naartoe. Dat merk je aan de verwachtingen: een slordige of verouderde site valt hier sneller op dan elders. Tegelijk helpt mooi alleen niet. De sites die het goed doen, leggen in gewone taal uit wat een bedrijf maakt en laten dat daarna zien met echt werk.",
        "Een derde ding is de internationale klantenkring. In en om Eindhoven werken veel mensen die geen Nederlands spreken, en de klanten van toeleveranciers zitten lang niet altijd in Nederland. Een Engelse versie van je site is dan geen franje. Bij ons is dat een optionele uitbreiding op je pakket; we zetten beide talen netjes naast elkaar met correcte taalmarkering voor Google.",
        "Werk je vanuit Eindhoven ook in de rest van Brabant, dan sluiten onze pagina's voor [Tilburg](/website-laten-maken-tilburg) en [Den Bosch](/website-laten-maken-den-bosch) daarop aan. Wij zitten zelf in Enkhuizen en werken voor ondernemers door heel Nederland grotendeels op afstand.",
      ],
    },
    faq: [
      {
        q: "Onze klanten zijn engineers en inkopers. Hoe ziet een site eruit die voor hen werkt?",
        a: "Zakelijk en specifiek. Zet je capaciteiten, machines, materialen en toleranties op een plek die snel te vinden is, met downloadbare specificaties waar dat kan. Een inkoper wil binnen een minuut kunnen bepalen of je op zijn lijstje past; sfeerteksten kosten hem tijd.",
      },
      {
        q: "Wij zijn toeleverancier en mogen niet alles van onze opdrachtgevers laten zien. Hoe tonen we dan referenties?",
        a: "Door het vraagstuk en jouw oplossing te beschrijven zonder namen en zonder herkenbare beelden: het soort onderdeel, het probleem, wat jij hebt gedaan en wat het opleverde. Dat overtuigt een vakgenoot vaak beter dan een logo dat hij toch niet kan natrekken. Wat wél mag, leggen we vooraf samen vast.",
      },
      {
        q: "Moet onze site Engelstalig zijn voor de internationale bedrijven in de regio?",
        a: "Als je klanten of je personeel deels buiten Nederland zitten, loont een Engelse versie bijna altijd. We houden Nederlands als basis en zetten Engels daarnaast, met hreflang-markering zodat Google per taal de juiste pagina toont. Het is een optionele uitbreiding en zit niet in het startpakket.",
      },
      {
        q: "Wat wij maken is technisch ingewikkeld. Hoe leggen we dat uit zonder het plat te slaan?",
        a: "Door te beginnen bij de toepassing en niet bij de techniek: welk probleem lost jouw product op, bij wie, en waarom is dat lastig. Daaronder komt de diepte voor wie doorleest. Zo werkt dezelfde pagina voor een inkoper die snel wil beslissen en voor een engineer die alles wil weten.",
      },
    ],
  },

  tilburg: {
    title: `Website laten maken Tilburg | Vanaf €${PRIJZEN.starter} | Nieuwblik`,
    metaDescription: `Website op maat voor ondernemers in Tilburg. Vanaf €${PRIJZEN.starter}, geen verborgen kosten en binnen enkele weken live. Vraag vrijblijvend een offerte aan.`,
    h1: "Website laten maken in Tilburg",
    lokaal: {
      h2: "Ondernemen in Tilburg: van textielstad naar maak- en logistiekstad",
      alineas: [
        "Tilburg was ooit een textielstad, en die geschiedenis is nog zichtbaar in de oude fabrieksgebouwen en in het TextielMuseum. De stad is daarna opnieuw uitgevonden: de voormalige spoorwerkplaatsen in de Spoorzone kregen een nieuwe bestemming, en om de stad heen zit een dichte laag maakbedrijven, distributie en transport. Voor die bedrijven is de website vooral een middel om serieus genomen te worden door klanten die je nog niet kennen.",
        "Daarnaast is Tilburg een studentenstad met een eigen universiteit, en dat is te merken aan de horeca, de winkels en de verhuurmarkt. Voor consumentgerichte ondernemers betekent dat een publiek dat vrijwel alles op de telefoon doet en dat snel afhaakt bij een site die traag laadt of waar de openingstijden niet kloppen.",
        "Wat beide groepen delen: er zit veel aanbod in de regio en de klant kijkt verder dan het eerste zoekresultaat. Een site die concreet is over wat je doet, voor wie en wat het ongeveer kost, wint het van een site waaraan je vooral ziet dat er over kleuren is nagedacht. Wij bouwen mobiel eerst en houden de site snel, want traagheid is het eerste waar een bezoeker op afknapt.",
        "Werk je vanuit Tilburg ook in de rest van Brabant, dan sluiten onze pagina's voor [Breda](/website-laten-maken-breda), [Eindhoven](/website-laten-maken-eindhoven) en [Den Bosch](/website-laten-maken-den-bosch) daarop aan. Wij zitten zelf in Enkhuizen en werken voor ondernemers door heel Nederland grotendeels op afstand.",
      ],
    },
    faq: [
      {
        q: "Wij zijn een maakbedrijf met een lange geschiedenis in Tilburg. Hoe gebruiken we dat op de site?",
        a: "Als bewijs, niet als nostalgie. Een korte tijdlijn of een paar foto's van vroeger en nu laten zien dat je blijft bestaan en je vak kent. Zet dat naast actueel werk, anders lijkt je bedrijf een museum in plaats van een leverancier.",
      },
      {
        q: "Wij verhuren kamers en appartementen aan studenten. Wat moet er op zo'n site staan?",
        a: "Actuele beschikbaarheid, heldere prijzen inclusief wat er wel en niet bij zit, foto's van de echte ruimte en een aanvraagformulier dat op een telefoon in dertig seconden is ingevuld. Studenten vergelijken snel en haken af bij verouderde informatie.",
      },
      {
        q: "Wij zitten in transport en distributie. Welke informatie willen klanten online zien?",
        a: "Wat je vervoert of opslaat, in welk gebied, met welke capaciteit en certificeringen, en wie ze bellen bij spoed. Zet een telefoonnummer op elke pagina en houd een offerteaanvraag kort; deze klanten bellen liever dan dat ze een formulier van twintig velden invullen.",
      },
      {
        q: "Ons vak zit vol aanbieders in de regio. Hoe zorgen we dat klanten ons kiezen?",
        a: "Door te laten zien wat een ander weglaat: echte prijzen of prijsindicaties, uitgewerkte voorbeelden van opdrachten, en duidelijk benoemen voor wie je níét werkt. Dat filtert aanvragen weg waar je toch niets mee kunt, en maakt je geloofwaardig bij de aanvragen die je wél wilt.",
      },
    ],
  },

  groningen: {
    title: `Website laten maken Groningen | Vanaf €${PRIJZEN.starter} | Nieuwblik`,
    metaDescription: `Website op maat voor ondernemers in Groningen. Vanaf €${PRIJZEN.starter}, zonder verborgen kosten en binnen enkele weken live. Vraag een offerte aan.`,
    h1: "Website laten maken in Groningen",
    lokaal: {
      h2: "Ondernemen in Groningen: een jonge stad met een groot achterland",
      alineas: [
        "Groningen is de grote stad van het noorden. De Rijksuniversiteit en de Hanzehogeschool brengen er tienduizenden studenten naartoe, en dat maakt de stad merkbaar jong. Verkoop je aan consumenten, dan heb je te maken met een publiek dat vrijwel alles op de telefoon regelt, aanbieders in een paar tellen vergelijkt en zwaar leunt op wat anderen over je schrijven. Een trage site of een verouderde openingstijd kost je die klant meteen.",
        "Tegelijk is Groningen het punt waar mensen uit een groot gebied naartoe komen: voor specialistische zorg in het UMCG, voor onderwijs, voor winkels die je in de dorpen niet vindt. Bedrijven in de stad bedienen daardoor vaak een veel grotere markt dan de stad zelf, en dat mag je website laten zien.",
        "Een derde laag is techniek en energie. De provincie is lang door de energiesector gekleurd en de overgang naar duurzame energie is er nu een groot thema. Bedrijven in installatie, isolatie en bouw merken dat aan het aantal aanvragen — en aan het aantal aanvragen dat niet past. Een site kan dat filteren, door vooraf duidelijk te maken wat je wel en niet doet.",
        "Werk je vanuit Groningen ook elders in het noorden, dan sluiten onze pagina's voor [Leeuwarden](/website-laten-maken-leeuwarden) en [Emmen](/website-laten-maken-emmen) daarop aan. Wij zitten zelf in Enkhuizen en werken voor ondernemers door heel Nederland grotendeels op afstand.",
      ],
    },
    faq: [
      {
        q: "Ons publiek is jong en kiest op basis van reviews. Hoe verwerk je dat in een website?",
        a: "Door echte reviews op de site te zetten, met naam en context, en door te verwijzen naar je Google Bedrijfsprofiel waar mensen zelf verder kijken. Sterren in de zoekresultaten afdwingen met je eigen reviews werkt niet meer; wat wel werkt is snel laden, eerlijke prijzen tonen en het aantal stappen tot contact zo klein mogelijk houden.",
      },
      {
        q: "We beginnen klein. Kunnen we later uitbreiden zonder opnieuw te beginnen?",
        a: "Ja, daar richten we het vanaf het begin op in. Je start met de pagina's die je nu nodig hebt en breidt later uit met extra diensten, een blog of een webshop. De opbouw en de techniek blijven hetzelfde, dus je betaalt niet twee keer voor het fundament.",
      },
      {
        q: "Wij werken in installatie en verduurzaming en krijgen veel aanvragen die niet passen. Kan de site daarop filteren?",
        a: "Ja, en dat scheelt vaak meer tijd dan een extra offerte oplevert. Benoem expliciet wat je wel en niet doet, in welk gebied je werkt en vanaf welke omvang een project interessant is. Een aanvraagformulier met drie sturende vragen houdt de rest er grotendeels uit.",
      },
      {
        q: "Een deel van onze klanten zit in de Randstad. Werkt het tegen ons dat we in het noorden zitten?",
        a: "Alleen als je site het onduidelijk laat. Zet er dan expliciet bij dat je landelijk levert of werkt, hoe dat praktisch gaat en met welke levertijd. Wij ondervinden hetzelfde vanuit Enkhuizen: klanten vinden afstand vooral vervelend als ze niet weten hoe het contact verloopt.",
      },
    ],
  },

  venlo: {
    title: `Website laten maken Venlo | Op maat vanaf €${PRIJZEN.starter} | Nieuwblik`,
    metaDescription: `Website op maat voor ondernemers in Venlo en de grensregio. Vanaf €${PRIJZEN.starter}, geen verborgen kosten en binnen enkele weken live.`,
    h1: "Website laten maken in Venlo",
    lokaal: {
      h2: "Ondernemen in Venlo: een stad aan de Maas, met Duitsland naast de deur",
      alineas: [
        "Venlo ligt aan de Maas, direct tegen de Duitse grens. Voor veel bedrijven hier houdt de markt niet op bij die grens: Duitse klanten en leveranciers zijn vaak dichterbij dan de Randstad. Dat maakt een aantal keuzes op je website anders dan in de rest van het land — van de taal tot de manier waarop je je telefoonnummer en adres noteert.",
        "De regio is daarnaast een knooppunt voor logistiek, tuinbouw en versproducten; Greenport Venlo is daar de bekendste naam van, en in 2012 was de Floriade er te gast. In die ketens gaat het snel en telefonisch: prijzen wisselen, volumes wisselen en beslissingen vallen in een kort gesprek. Een website hoeft daar niet tegenin te gaan, maar moet wel bewijzen dat je een serieuze partij bent voordat iemand belt.",
        "Voor ondernemers die aan consumenten verkopen speelt hetzelfde grensvoordeel: bezoekers uit Noordrijn-Westfalen komen met andere verwachtingen over openingstijden, betalen en bezorgen. Een Duitse versie van je site kan dan veel opleveren. Bij ons is dat een optionele uitbreiding op je pakket, met correcte taalmarkering zodat Google per land de juiste versie laat zien.",
        "Werk je vanuit Venlo ook verder in Limburg of Brabant, dan sluiten onze pagina's voor [Maastricht](/website-laten-maken-maastricht) en [Eindhoven](/website-laten-maken-eindhoven) daarop aan. Wij zitten zelf in Enkhuizen en werken voor ondernemers door heel Nederland grotendeels op afstand.",
      ],
    },
    faq: [
      {
        q: "Een deel van onze klanten is Duits. Moet onze site Duitstalig zijn, en worden we dan ook in Duitsland gevonden?",
        a: "Een Duitse versie helpt, maar vertaal niet zomaar je Nederlandse teksten: Duitse klanten zoeken op andere woorden. We zetten de talen naast elkaar met hreflang-markering, zodat Google per land de juiste pagina toont. Reken wel op een langere aanloop voordat je in Duitsland meedoet, en vul ook je Google Bedrijfsprofiel in het Duits in.",
      },
      {
        q: "We hebben een webshop en willen ook aan Duitse klanten leveren. Waar moeten we op letten?",
        a: "Vooral op betalen en bezorgen. Duitse klanten verwachten andere betaalmethodes dan iDEAL, en willen verzendkosten, levertijd en retourvoorwaarden vooraf zien. Laat je juridische teksten voor de Duitse markt door een specialist controleren; dat is geen onderdeel van het bouwen van de site.",
      },
      {
        q: "Onze prijzen wisselen per dag. Zetten we die dan wel op de site?",
        a: "Geen dagprijzen, wel richting. Een bandbreedte, een rekenvoorbeeld of een minimumafname geeft bezoekers genoeg houvast om te bellen, en houdt de aanvragen weg die toch niet passen. De actuele prijs houd je waar hij hoort: in het gesprek of in je offerte.",
      },
      {
        q: "Onze klanten bestellen telefonisch bij een vaste contactpersoon. Wat voegt een website dan nog toe?",
        a: "Die website wordt gelezen vóór het eerste telefoontje, door de klant die je nog niet hebt. Laat zien wat je levert, in welk gebied, met welke capaciteit, en zet de namen en nummers van je contactpersonen erbij. Voor bestaande klanten is het handig om documenten, specificaties of openingstijden op één vaste plek te hebben.",
      },
    ],
  },

  amsterdam: {
    title: `Website laten maken Amsterdam | Vanaf €${PRIJZEN.starter} | Nieuwblik`,
    metaDescription: `Website op maat voor ondernemers in Amsterdam. Vanaf €${PRIJZEN.starter}, zonder bureautarieven en binnen enkele weken live. Vraag een offerte aan.`,
    h1: "Website laten maken in Amsterdam",
    lokaal: {
      h2: "Ondernemen in Amsterdam: het drukste speelveld van Nederland",
      alineas: [
        "Amsterdam is de drukste markt van het land. In vrijwel elke branche zitten hier tientallen aanbieders, en de bezoeker die jouw site opent heeft er meestal al een paar bekeken. Opvallen doe je daarom niet met een mooiere homepage, maar door sneller duidelijk te zijn: wat je doet, voor wie, wat het ongeveer kost en wat de eerste stap is. Wie dat op de eerste helft van het scherm zet, wint van wie dat achter een contactformulier verstopt.",
        "Een groot deel van de stad leeft van bezoekers. Horeca, winkels, rondleidingen en dienstverleners in het centrum krijgen publiek dat van buiten de stad of uit het buitenland komt en dat onderweg op zijn telefoon zoekt. Route, openingstijden, reserveren en prijs moeten dan binnen twee tikken te vinden zijn, en een Engelstalige versie van je belangrijkste pagina's kan het verschil maken. Dat laatste is bij ons een optionele uitbreiding.",
        "Daarnaast lopen de tarieven voor een website hier flink uiteen. Wij bouwen vanuit Enkhuizen, met lage overhead en één vast aanspreekpunt, en dat scheelt in de prijs zonder dat je inlevert op wat er wordt opgeleverd. Wat je krijgt staat op onze pagina over [website laten maken](/website-laten-maken) en in de pakketten die daarbij horen.",
        "Werk je vanuit Amsterdam ook in de regio daaromheen, dan sluiten onze pagina's voor [Haarlem](/website-laten-maken-haarlem), [Zaanstad](/website-laten-maken-zaanstad) en [Almere](/website-laten-maken-almere) daarop aan. Wij werken voor ondernemers door heel Nederland grotendeels op afstand.",
      ],
    },
    faq: [
      {
        q: "Waarom zouden we een bureau buiten Amsterdam kiezen?",
        a: "Om wat je ervoor betaalt en met wie je te maken hebt. Wij werken vanuit Enkhuizen met lage overhead, en je hebt van begin tot eind hetzelfde aanspreekpunt in plaats van een accountmanager en een wisselende uitvoerder. Kennismaken gaat via videobellen, en een afspraak in de stad kan in overleg.",
      },
      {
        q: "Onze gasten komen voor een groot deel van buiten de stad of uit het buitenland. Wat betekent dat voor de site?",
        a: "Dat alles wat onderweg nodig is bovenaan hoort: adres, route vanaf het openbaar vervoer, openingstijden, reserveren of bestellen. Zet daar echte foto's bij in plaats van stockbeelden. Een Engelse versie van je belangrijkste pagina's is een optionele uitbreiding die voor bezoekende klanten vaak snel loont.",
      },
      {
        q: "Wij hebben meerdere vestigingen in de stad. Krijgt elke vestiging een eigen pagina?",
        a: "Ja, maar alleen als elke pagina echt eigen informatie heeft: adres, openingstijden, team, parkeren en route. Drie pagina's met dezelfde tekst en een ander adres helpen je niet. Maak daarnaast per vestiging een eigen Google Bedrijfsprofiel, want dat is wat mensen in de buurt te zien krijgen.",
      },
      {
        q: "Onze site is ons portfolio: we leven van beeld. Waar moeten we dan op letten?",
        a: "Op de balans tussen kwaliteit en snelheid. We leveren beelden in moderne formaten en op de juiste afmetingen aan, zodat werk scherp blijft zonder dat de pagina traag wordt. Verder: een duidelijke volgorde, korte bijschriften met context, alt-teksten voor toegankelijkheid en een contactmogelijkheid die overal binnen bereik is.",
      },
    ],
  },

  rotterdam: {
    title: `Website laten maken Rotterdam | Vanaf €${PRIJZEN.starter} | Nieuwblik`,
    metaDescription: `Website op maat voor ondernemers in Rotterdam. Vanaf €${PRIJZEN.starter}, geen verborgen kosten en binnen enkele weken live. Vraag vrijblijvend een offerte aan.`,
    h1: "Website laten maken in Rotterdam",
    lokaal: {
      h2: "Ondernemen in Rotterdam: haven, techniek en een stad die zichzelf opnieuw bouwde",
      alineas: [
        "Rotterdam heeft de grootste haven van Europa, en dat werkt door in vrijwel de hele stad. Logistiek, maakindustrie, offshore, installatietechniek en de zakelijke dienstverlening daaromheen vormen samen een markt waarin bedrijven vooral aan andere bedrijven verkopen. Je website wordt daar gelezen door iemand die een leverancier zoekt en snel wil vaststellen of je aan de eisen voldoet.",
        "Die eisen zijn in deze hoek concreter dan elders. Certificeringen, verzekeringen, capaciteit, veiligheid en bereikbaarheid buiten kantooruren zijn vaak doorslaggevender dan de vormgeving. Dat betekent niet dat je site er slordig uit mag zien, maar wel dat het bewijs vindbaar moet zijn in plaats van weggestopt in een pdf op de contactpagina.",
        "De binnenstad is na het bombardement van 1940 opnieuw opgebouwd, en dat zie je nog steeds: veel moderne architectuur en een stad die snel verandert. Voor ondernemers die aan bewoners verkopen betekent het vooral een gevarieerd publiek met uiteenlopende verwachtingen. Schrijf dan in gewone taal, zonder vakjargon, en laat zien voor wie je werkt.",
        "Werk je vanuit Rotterdam ook in de rest van Zuid-Holland, dan sluiten onze pagina's voor [Den Haag](/website-laten-maken-den-haag), [Dordrecht](/website-laten-maken-dordrecht) en [Delft](/website-laten-maken-delft) daarop aan. Wij zitten zelf in Enkhuizen en werken voor ondernemers door heel Nederland grotendeels op afstand.",
      ],
    },
    faq: [
      {
        q: "Voor opdrachten in de haven moeten we certificeringen kunnen aantonen. Waar zetten we die op de site?",
        a: "Op een eigen pagina die vanuit het menu te bereiken is, met per certificaat het nummer, de geldigheid en een downloadbaar bewijs. Noem ze daarnaast kort op de pagina van de dienst waar ze bij horen. Een inkoper die ze niet binnen twee klikken vindt, gaat verder naar de volgende leverancier.",
      },
      {
        q: "Wij hebben een storingsdienst buiten kantooruren. Hoe maken we dat duidelijk?",
        a: "Zet het storingsnummer vast in beeld, niet alleen op de contactpagina, en wees expliciet over de tijden en over wat er onder spoed valt. Een apart blok met 'storing buiten kantooruren' met een directe belknop voorkomt dat mensen je algemene nummer proberen en niets horen.",
      },
      {
        q: "Wij werken voor havenbedrijven én voor particulieren. Moeten dat twee websites worden?",
        a: "Meestal niet. Eén site met twee duidelijke ingangen werkt beter en is goedkoper te onderhouden: je splitst de navigatie meteen in zakelijk en particulier en houdt de teksten, voorbeelden en prijsinformatie per ingang gescheiden. Twee losse sites betekent twee keer onderhoud en twee keer opbouwen in Google.",
      },
      {
        q: "Onze klanten vergelijken ons met grote internationale leveranciers. Hoe blijven we geloofwaardig?",
        a: "Door concreet te zijn over wat je zelf doet en wat je uitbesteedt, hoe snel je kunt schakelen en wie de klant spreekt. Uitgewerkte opdrachten met cijfers erbij overtuigen sterker dan een pagina over jarenlange ervaring. Wees ook duidelijk over wat je niet doet; dat wekt meer vertrouwen dan alles beloven.",
      },
    ],
  },

  dordrecht: {
    title: `Website laten maken Dordrecht | Vanaf €${PRIJZEN.starter} | Nieuwblik`,
    metaDescription: `Website op maat voor ondernemers in Dordrecht. Vanaf €${PRIJZEN.starter}, geen verborgen kosten en binnen enkele weken live. Vraag een vrijblijvende offerte aan.`,
    h1: "Website laten maken in Dordrecht",
    lokaal: {
      h2: "Ondernemen in Dordrecht: oudste stad van Holland, omringd door water",
      alineas: [
        "Dordrecht is de oudste stad van Holland en ligt op een eiland, op het punt waar drie rivieren samenkomen. Dat water heeft de stad gemaakt: handel, scheepvaart en een maritieme maakindustrie die in de hele Drechtsteden doorloopt. Wie daarin werkt, levert vaak onderdelen of diensten die uiteindelijk ergens anders ter wereld terechtkomen, en dat stelt andere eisen aan een website dan een zaak die het van de buurt moet hebben.",
        "Tegelijk heeft Dordrecht een van de best bewaarde historische binnensteden van het land, met honderden monumenten, winkels en horeca in oude panden. Voor die ondernemers draait het om bezoekers die vooraf op hun telefoon kijken: waar zit je, ben je open, kun je er terecht met een kinderwagen of een rollator. Juist in oude panden zijn dat geen bijzaken.",
        "En dan is er de schaal van de stad zelf. Dordrecht is groot genoeg voor een eigen markt en klein genoeg dat veel ondernemers elkaar kennen. Veel bedrijven hier leven van mond-tot-mondreclame. Een website vervangt dat niet, maar vangt wel de mensen op die je naam hebben gehoord en daarna gaan zoeken — en dat zijn er meer dan je denkt.",
        "Werk je vanuit Dordrecht ook in de omliggende regio, dan sluiten onze pagina's voor [Rotterdam](/website-laten-maken-rotterdam) en [Breda](/website-laten-maken-breda) daarop aan. Wij zitten zelf in Enkhuizen en werken voor ondernemers door heel Nederland grotendeels op afstand.",
      ],
    },
    faq: [
      {
        q: "Onze onderdelen zitten in schepen die overal ter wereld varen. Hoe regelen we service en onderdelen via de site?",
        a: "Met een duidelijke serviceroute: een pagina per type product met typenummers, documentatie om te downloaden en een formulier waarin de klant het serienummer kwijt kan. Zet daarbij wie hij belt en binnen welke tijd je reageert. Dat scheelt veel heen-en-weer mailen over welk onderdeel het precies is.",
      },
      {
        q: "Wij verkopen via werven en dealers, niet rechtstreeks. Wat moet er dan op onze site?",
        a: "Twee dingen tegelijk: de eindklant overtuigen dat hij naar jouw merk moet vragen, en je afnemers bedienen. Dat betekent duidelijke productinformatie voor iedereen, een overzicht van waar je product te krijgen is, en een afgeschermd of apart deel met documentatie en prijzen voor dealers.",
      },
      {
        q: "Wij zitten in een monumentaal pand in de binnenstad. Waar letten we op voor onze bezoekers?",
        a: "Op de praktische vragen die mensen vooraf stellen: waar parkeer je, hoe kom je binnen, is er een drempel of trap, is er een toilet dat bereikbaar is. Zet dat gewoon op je contactpagina met een foto van de ingang. Bezoekers met een kinderwagen of een beperking zoeken daar actief naar en kiezen de zaak die het vermeldt.",
      },
      {
        q: "We leven vooral van mond-tot-mondreclame. Wat voegt een website daar nog aan toe?",
        a: "Die website is precies wat er ná de aanbeveling gebeurt. Iemand hoort je naam, zoekt ernaar en beslist in een paar seconden of het klopt wat hij hoorde. Een actuele site met echt werk, echte foto's en een telefoonnummer maakt van die aanbeveling een klant; geen site of een verouderde site laat twijfel achter.",
      },
    ],
  },
};

export const getCityLokaal = (slug: string): CityLokaal | undefined => cityLokaal[slug];
