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
};

export const getCityLokaal = (slug: string): CityLokaal | undefined => cityLokaal[slug];
