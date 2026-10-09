import { LEVERTIJD, PRIJZEN, euroTeken, REVIEWS, HOSTING_ZIN } from "@/config/business";
import type { LokaleUitbreiding } from "@/data/lokaleInhoud";

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

const STARTER = euroTeken(PRIJZEN.starter);
const PROFESSIONAL = euroTeken(PRIJZEN.professional);
const WEBSHOP = euroTeken(PRIJZEN.webshopVanaf);

/** Reviewkop met het aantal en de score uit config/business.ts. */
const REVIEWKOP = `${REVIEWS.aantalLabel} ondernemers beoordelen Nieuwblik met ${REVIEWS.scoreLabel} sterren`;

export interface CityLokaal extends LokaleUitbreiding {
  title: string;
  metaDescription: string;
  h1: string;
  /** Optionele actiegerichte koppen die de gegenereerde stadskoppen vervangen. */
  headings?: {
    benefits?: string;
    reviews?: string;
    portfolio?: string;
    contact?: string;
  };
  /** Vervangt de gegenereerde intro-alinea. Ongeveer 200 tot 350 woorden. */
  lokaal: { h2: string; alineas: string[] };
  /** 4 tot 6 vragen die echt over deze plaats gaan. */
  faq: { q: string; a: string }[];
}

export const cityLokaal: Record<string, CityLokaal> = {
  leiden: {
    title: `Website laten maken Leiden vanaf €${PRIJZEN.starter} | Nieuwblik`,
    metaDescription: `Meer klanten met een snelle website op maat in Leiden. Vanaf €${PRIJZEN.starter} en binnen 2 tot 4 weken live. Vraag vrijblijvend een offerte aan.`,
    h1: `Website laten maken in Leiden vanaf €${PRIJZEN.starter}`,
    headings: {
      benefits: "Waarom Leidse ondernemers kiezen voor Nieuwblik",
      reviews: REVIEWKOP,
      portfolio: "Websites die bezoekers omzetten in klanten",
      contact: "Klaar om online te groeien in Leiden?",
    },
    lokaal: {
      h2: "Meer aanvragen uit Leiden met een snelle website op maat",
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
        a: "Ja. We werken voor ondernemers door heel Nederland en doen dat grotendeels op afstand: kennismaken via videobellen, daarna contact via telefoon, mail en WhatsApp, steeds met hetzelfde aanspreekpunt. Spreek je elkaar liever in het echt, dan komen we bij je langs.",
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
        a: "Ja. Prijzen, openingstijden en beschikbaarheid zijn precies de dingen die in het seizoen snel moeten kunnen wijzigen. Standaard verzorgen wij dat beheer voor je; wil je het liever zelf doen, dan bouwen we op aanvraag een eenvoudig beheerscherm in. Zorg daarnaast dat de aanvraagknop het opvallendste element op een telefoonscherm is, en vervang die in het laagseizoen door een wachtlijst.",
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
        a: "Twee dingen tegelijk: de eindklant overtuigen dat hij naar jouw merk moet vragen, en je afnemers bedienen. Dat betekent duidelijke productinformatie voor iedereen, een overzicht van waar je product te krijgen is, en een apart deel met documentatie voor dealers. Moet dat achter een inlog, dan is het maatwerk; we kijken bij de offerte wat het in jouw geval nodig heeft.",
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

  purmerend: {
    title: `Webdesign Purmerend: website laten maken vanaf ${STARTER}`,
    metaDescription: `Webdesign in Purmerend: een snelle website op maat vanaf ${STARTER}, ook als vervanger van je huidige site. Begin met een gratis website-analyse.`,
    h1: "Webdesign en website laten maken in Purmerend",
    eigenOpbouw: true,
    intro: `Webdesign voor ondernemers in Purmerend die een nieuwe website willen, of een site die sneller en beter moet. Vaste prijs vanaf ${STARTER}.`,
    cases: ["puur-in-harmonie", "karate-school-cor-slok", "benoted", "feigro-dakwerken"],
    headings: {
      reviews: "Ondernemers over hun nieuwe website",
      portfolio: "Een greep uit ons werk",
      contact: "Je website vernieuwen in Purmerend?",
    },
    lokaal: {
      h2: "Webdesign voor ondernemers in Purmerend",
      alineas: [
        "Veel ondernemers die bij ons aankloppen hebben al een website. Hij is traag op de telefoon, ziet er gedateerd uit of levert te weinig aanvragen op. Nieuwblik bouwt een nieuwe site die dat oplost, en houdt daarbij vast wat al goed werkt.",
        "We werken vanuit Enkhuizen en grotendeels op afstand, met contact via telefoon, mail en WhatsApp. Je hebt één vast aanspreekpunt voor je hele project.",
      ],
    },
    secties: [
      {
        h2: "Eerst kijken wat je huidige site doet",
        alineas: [
          "Voordat we iets nieuws voorstellen, bekijken we je huidige website op snelheid, vindbaarheid en conversie. Dat kan met een [gratis website-analyse](/gratis-website-analyse): binnen 24 uur krijg je een persoonlijke analyse met concrete verbeterpunten.",
          "Soms is verbeteren genoeg. Vaak is vernieuwen verstandiger, omdat de basis van de oude site niet meer meekan. Die keuze maken we samen, op basis van wat de analyse laat zien.",
        ],
      },
      {
        h2: "Maatwerk in plaats van een zware template",
        alineas: [
          "Voor de meeste bedrijfssites bouwen we maatwerk met React. Zo'n site laadt snel en heeft geen plugins die bijgewerkt moeten worden. Ons streven is een PageSpeed-score van 90 of hoger op mobiel.",
          "Hoeveel snelheid uitmaakt, beschrijven we in onze [case over BeNoted](/blog/case-study-benoted-snelheid-zichtbaarheid), een platform waarbij een razendsnelle gebruikerservaring voorop stond.",
        ],
      },
      {
        h2: "Wat een nieuwe website kost",
        alineas: [
          `Starter (${STARTER}) vervangt een kleine site: 1 tot 5 pagina's, responsive, met basis SEO, contactformulier en Google Maps. Meestal binnen ${LEVERTIJD.starter} live.`,
          `Professional (vanaf ${PROFESSIONAL}) is voor een uitgebreidere site: tot 10 pagina's, uitgebreide SEO, een blog en koppelingen met externe tools.`,
          `Een webshop of maatwerk met eigen koppelingen prijzen we op maat; webshops beginnen bij ${WEBSHOP}. Na de oplevering krijg je het gebruiksrecht op ontwerp en inhoud. Wil je naar een andere partij, dan werken we mee aan de overdracht. Alle pakketten staan op [prijzen](/prijzen).`,
        ],
      },
      {
        h2: "Sites die we vernieuwden",
        alineas: [
          "Bij [Puur in Harmonie](/portfolio/puur-in-harmonie) miste de oude site de visuele rust en de technische finesse voor mobiele apparaten. De nieuwe site is mobiel eerst gebouwd en heeft een webshop met Stripe.",
          "[Karate School Cor Slok](/portfolio/karate-school-cor-slok) wilde de lange traditie van de school moderniseren en de drempel voor nieuwe leden verlagen. Lestijden en locaties staan nu direct vindbaar en inschrijven gaat volledig digitaal.",
          "Werk je ook buiten Purmerend? Lees dan over [website laten maken in Alkmaar](/website-laten-maken-alkmaar), [website laten maken in Hoorn](/werkgebied/hoorn) of onze aanpak voor [Noord-Holland](/regio/noord-holland).",
        ],
      },
    ],
    faq: [
      {
        q: "Wat kost webdesign in Purmerend?",
        a: `Een Starter-site kost ${STARTER}, Professional begint bij ${PROFESSIONAL} en een webshop bij ${WEBSHOP}. Na een kennismaking krijg je een offerte met een vaste prijs.`,
      },
      {
        q: "Kunnen jullie mijn huidige website vernieuwen?",
        a: "Ja. We beginnen met een analyse van je huidige site op snelheid, vindbaarheid en conversie. Daarna bepalen we samen of verbeteren of vernieuwen verstandiger is.",
      },
      {
        q: "Verlies ik mijn plek in Google als ik overstap?",
        a: "Een overstap geeft altijd wat schommeling in de posities, ook als alles goed gaat. Wij zetten oude adressen met een 301-redirect door naar de nieuwe pagina's en controleren na de livegang in Search Console of alles goed is overgenomen.",
      },
      {
        q: "Mijn site draait op WordPress. Moet ik daar vanaf?",
        a: "Nee, het hoeft niet. Voor de meeste bedrijfssites adviseren we maatwerk met React: zo'n site laadt snel en heeft geen plugins die bijgewerkt moeten worden. Bouwen in WordPress kan ook, als dat beter bij je past.",
      },
      {
        q: "Wat gebeurt er met mijn site als ik later wil overstappen?",
        a: "Na de oplevering krijg je het gebruiksrecht op ontwerp en inhoud. Wil je naar een andere partij, dan werken we mee aan de overdracht.",
      },
      {
        q: "Hoe lang duurt de overstap naar een nieuwe site?",
        a: `Een Starter-site meestal binnen ${LEVERTIJD.starter}, een bedrijfswebsite binnen ${LEVERTIJD.standaard} en een grotere site of webshop binnen ${LEVERTIJD.complex}.`,
      },
    ],
    todo: [
      "Klanten uit Purmerend en omgeving: naam, branche en wat de site opleverde (alleen met toestemming).",
      "Waar spreek je af met ondernemers uit Purmerend: bij hen op locatie, in Enkhuizen of via video?",
      "Ervaring met het vernieuwen van sites in deze regio die je kunt noemen.",
      "Een review of citaat van een klant uit Purmerend, als die er is.",
    ],
  },

  "den-helder": {
    title: `Website laten maken Den Helder vanaf €${PRIJZEN.starter} | Nieuwblik`,
    metaDescription: `Website laten maken in Den Helder? Maatwerk vanaf €${PRIJZEN.starter}, binnen 2 tot 4 weken live, vaste prijs. Vraag vrijblijvend een offerte aan.`,
    h1: `Website laten maken in Den Helder vanaf €${PRIJZEN.starter}`,
    headings: {
      benefits: "Waarom ondernemers uit Den Helder kiezen voor Nieuwblik",
      reviews: REVIEWKOP,
      portfolio: "Voorbeelden van ons werk",
      contact: 'Tijd voor een nieuwe website in Den Helder?',
    },
    eigenOpbouw: true,
    intro: `Een bedrijfswebsite laten maken in Den Helder voor een vaste prijs vanaf ${STARTER}. Je weet vooraf wat je krijgt, wat je aanlevert en wanneer de site live staat.`,
    cases: ["erica-van-dijk", "interieur-studio-laan", "esveld-installatie", "een-bundel-geluk"],
    lokaal: {
      h2: "Website laten maken in Den Helder",
      alineas: [
        "Nieuwblik maakt bedrijfswebsites voor ondernemers in Den Helder: zzp'ers, adviseurs, vakmensen en winkels. Een klein team in Enkhuizen doet alles zelf, van ontwerp tot livegang, zonder accountmanager ertussen.",
        "Een goede bedrijfswebsite laat in een paar seconden zien wat je doet, voor wie en hoe iemand contact opneemt. Daar begint elk ontwerp. Pas daarna kijken we naar kleuren, foto's en extra functies.",
      ],
    },
    secties: [
      {
        h2: "Prijzen voor een bedrijfswebsite in Den Helder",
        alineas: [
          `Starter kost ${STARTER}. Daarvoor krijg je een site van 1 tot 5 pagina's, volledig responsive, met de basis van SEO, een contactformulier en Google Maps. Hij staat meestal binnen ${LEVERTIJD.starter} live. Voor veel zzp'ers en kleine bedrijven is dat genoeg.`,
          `Professional begint bij ${PROFESSIONAL}. Je krijgt tot 10 pagina's, uitgebreide SEO, een blog en koppelingen met tools die je al gebruikt. Dat past als je meerdere diensten hebt en daar ook op gevonden wilt worden.`,
          "Heb je meer nodig, zoals onbeperkt pagina's, een klantportaal of koppelingen met je eigen systemen, dan maken we een offerte op maat. Alle pakketten staan op [prijzen](/prijzen).",
        ],
      },
      {
        h2: "Wat we van je nodig hebben",
        alineas: [
          "Het begint met een gesprek over je bedrijf en wat de site moet opleveren. Binnen 24 uur krijg je een offerte met een vaste prijs en een planning.",
          "Ga je akkoord, dan vragen we je om content: teksten, foto's en je logo, als je die hebt. De teksten schrijven we met je mee. Heb je nog geen logo of huisstijl, dan kunnen we die ook maken.",
          `Daarna ontwerpen en bouwen we de site. Je ziet elke stap en geeft feedback voordat er iets live gaat. ${HOSTING_ZIN}`,
        ],
      },
      {
        h2: "Voorbeelden van bedrijfswebsites",
        alineas: [
          "Voor HR-interim manager [Erica van Dijk](/portfolio/erica-van-dijk) bouwden we een zakelijke site met haar diensten helder op een rij en haar ervaring direct zichtbaar. [Interieur Studio Laan](/portfolio/interieur-studio-laan) kreeg een portfolio waarin bezoekers door de projecten heen lopen, met een aanvraag voor een consult. En [Esveld Installatie](/portfolio/esveld-installatie) heeft een site voor installatiediensten met een klantportaal.",
        ],
      },
      {
        h2: "Ook een webshop in Den Helder",
        alineas: [
          `Wil je online verkopen, dan bouwen we een webshop op maat met betaalkoppelingen, vanaf ${WEBSHOP}. [Een Bundel Geluk](/portfolio/een-bundel-geluk) en [Bushido Shop](/portfolio/bushido-shop) zijn voorbeelden. Meer lees je bij [webshops](/diensten/webshops) en in onze [handleiding over Stripe](/blog/stripe-betalingen-webshop-handleiding). Verkoop je ook via Bol.com of Amazon, dan maken we daar [productlistings](/diensten/e-commerce) voor.`,
          "Werk je ook in de rest van de regio? Lees dan over [website laten maken in Schagen](/website-laten-maken-schagen) of onze aanpak voor [Noord-Holland](/regio/noord-holland).",
        ],
      },
    ],
    faq: [
      {
        q: "Wat kost een bedrijfswebsite in Den Helder?",
        a: `Een Starter-site kost ${STARTER}, Professional begint bij ${PROFESSIONAL}. Grotere sites en webshops prijzen we op maat; webshops beginnen bij ${WEBSHOP}. De prijs staat vooraf vast.`,
      },
      {
        q: "Wat moet ik zelf aanleveren?",
        a: "Teksten, foto's en je logo, als je die hebt. De teksten schrijven we met je mee, en een logo of huisstijl kunnen we ook voor je maken.",
      },
      {
        q: "Wanneer staat mijn bedrijfswebsite online?",
        a: `Starter meestal ${LEVERTIJD.starter}, een gewone bedrijfswebsite ${LEVERTIJD.standaard}. Hoe snel het gaat, hangt ook af van hoe snel de content klaar is.`,
      },
      {
        q: "Welke kosten komen er na de livegang nog bij?",
        a: `${HOSTING_ZIN} Er is geen apart onderhoudscontract. Daarnaast betaal je je domeinnaam, vanaf circa 10 euro per jaar.`,
      },
      {
        q: "Kan ik vanuit Den Helder ook online verkopen?",
        a: `Ja. Een webshop bouwen we op maat met betaalkoppelingen, vanaf ${WEBSHOP}.`,
      },
      {
        q: "Kan ik later naar een andere partij overstappen?",
        a: "Na de oplevering krijg je het gebruiksrecht op ontwerp en inhoud. Wil je naar een andere partij, dan werken we mee aan de overdracht.",
      },
    ],
    todo: [
      "Klanten uit Den Helder: naam, branche en wat de site opleverde (alleen met toestemming).",
      "Waar spreek je af met ondernemers uit Den Helder: bij hen op locatie, in Enkhuizen of via video?",
      "Regionale ervaring in de Kop van Noord-Holland die je kunt noemen.",
      "Een review of citaat van een klant uit Den Helder, als die er is.",
    ],
  },

  heerhugowaard: {
    title: `Website laten maken Heerhugowaard vanaf €${PRIJZEN.starter} | Nieuwblik`,
    metaDescription: `Website laten maken in Heerhugowaard? Maatwerk vanaf €${PRIJZEN.starter}, binnen 2 tot 4 weken live, vaste prijs. Vraag vrijblijvend een offerte aan.`,
    h1: `Website laten maken in Heerhugowaard vanaf €${PRIJZEN.starter}`,
    headings: {
      benefits: "Waarom ondernemers uit Heerhugowaard kiezen voor Nieuwblik",
      reviews: REVIEWKOP,
      portfolio: "Voorbeelden van ons werk",
      contact: 'Klaar om online te groeien in Heerhugowaard?',
    },
    eigenOpbouw: true,
    intro: `Website laten maken in Heerhugowaard: een site op maat die aanvragen oplevert, met een vaste prijs vooraf en meestal binnen ${LEVERTIJD.standaard} live.`,
    cases: ["feigro-dakwerken", "esveld-installatie", "aardingsbedrijf-west-friesland", "mhb-techniek"],
    lokaal: {
      h2: "Website laten maken in Heerhugowaard",
      alineas: [
        "Voor ondernemers in Heerhugowaard bouwt Nieuwblik websites met één doel: dat de juiste klant contact opneemt. We werken vanuit Enkhuizen, met korte lijnen en zonder tussenlagen.",
        "Verkoop je iets wat je klant vooraf niet kan zien, zoals een dak, een installatie, advies of onderhoud? Dan moet je website het vertrouwen geven dat anders uit een showroom komt. Met duidelijke uitleg, echte foto's van je werk en een aanvraag die in een paar stappen klaar is.",
      ],
    },
    secties: [
      {
        h2: "Websites voor bouw, techniek en dienstverlening",
        alineas: [
          "[Feigro Dakwerken](/portfolio/feigro-dakwerken) kreeg een merkwebsite met naast het gewone offertetraject een directe lekkagemelder, zodat een melding van een acuut probleem niet tussen de gewone aanvragen verdwijnt.",
          "Voor [Esveld Installatie](/portfolio/esveld-installatie) maakten we een website voor installatiediensten met een klantportaal. Bij [Aardingsbedrijf West-Friesland](/portfolio/aardingsbedrijf-west-friesland) maakt de site de risico's van slechte aarding zichtbaar, zoals brandgevaar en defecte apparatuur. Zo begrijpt een bezoeker waarom de dienst nodig is, en zwevende knoppen voor bellen, WhatsApp en een offerte maken de volgende stap klein.",
          "Werk je in een van deze vakgebieden? Kijk dan ook op onze pagina's over een website voor een [bouwbedrijf](/website-laten-maken-bouwbedrijf), een [elektricien](/website-laten-maken-elektricien), een [loodgieter](/website-laten-maken-loodgieter) of een [schilder](/website-laten-maken-schilder).",
        ],
      },
      {
        h2: "Wat een website in Heerhugowaard kost",
        alineas: [
          `Wil je vooral online laten zien wie je bent en goed bereikbaar zijn, dan volstaat Starter. Voor ${STARTER} krijg je maximaal vijf pagina's, een contactformulier, Google Maps en een site die op elke telefoon goed werkt. Reken op ongeveer ${LEVERTIJD.starter} tot de livegang.`,
          `Moet je website zelf aanvragen binnenhalen, met een pagina per dienst en artikelen die laten zien wat je weet? Kies dan Professional vanaf ${PROFESSIONAL}. Daarin zitten tot tien pagina's, uitgebreide SEO, een blog en koppelingen met je eigen software.`,
          `Een klantportaal, een koppeling met je planning of een webshop is maatwerk. Webshops beginnen bij ${WEBSHOP}, andere uitbreidingen bespreken we per project. Wat het kost, zie je altijd vooraf in de offerte. Een overzicht van alle pakketten staat op de [prijzenpagina](/prijzen).`,
        ],
      },
      {
        h2: "Van eerste gesprek tot livegang",
        alineas: [
          "Na de kennismaking krijg je binnen 24 uur een reactie met een concrete offerte. Daarin staat wat je krijgt, wat het kost en wanneer het af is.",
          "Tijdens de bouw zie je de site groeien en geef je feedback op tussentijdse versies. We schrijven de teksten met je mee, zodat je vakkennis erin terugkomt en ze aansluiten op de woorden die klanten gebruiken.",
          `${HOSTING_ZIN} Wil je zelf kunnen aanpassen, dan bouwen we op verzoek een eenvoudig beheersysteem. Wil je ook een logo of huisstijl, dan nemen we dat in hetzelfde traject mee.`,
          "Dichtbij werken we ook voor ondernemers in de rest van Noord-Holland. Lees verder over [website laten maken in Alkmaar](/website-laten-maken-alkmaar), [website laten maken in Hoorn](/werkgebied/hoorn), [website laten maken in Enkhuizen](/website-laten-maken-enkhuizen) of [website laten maken in Schagen](/website-laten-maken-schagen).",
        ],
      },
    ],
    faq: [
      {
        q: "Wat kost een website voor een bedrijf in Heerhugowaard?",
        a: `Starter kost ${STARTER}, Professional vanaf ${PROFESSIONAL} en een webshop vanaf ${WEBSHOP}. Welke past, hangt af van wat je site moet doen. Dat bespreken we in de kennismaking, daarna krijg je een vaste prijs.`,
      },
      {
        q: "Kunnen jullie een website maken die offerteaanvragen oplevert?",
        a: "Ja, daar is de opbouw op gericht: per dienst een duidelijke pagina, een kort aanvraagformulier en een knop om direct te bellen of te appen. Zo hoeft niemand te zoeken hoe je bereikbaar bent.",
      },
      {
        q: "Ik werk in de bouw of techniek. Hebben jullie daar ervaring mee?",
        a: "Ja. In ons portfolio staan onder meer Feigro Dakwerken, Esveld Installatie en Aardingsbedrijf West-Friesland. Bij al die sites draait het om vertrouwen en een makkelijke aanvraag.",
      },
      {
        q: "Hoeveel weken zitten er tussen akkoord en livegang?",
        a: `Meestal ${LEVERTIJD.standaard}. Een Starter-site kan in ${LEVERTIJD.starter}, grotere projecten duren ${LEVERTIJD.complex}.`,
      },
      {
        q: "Wie onderhoudt de website na de oplevering?",
        a: `${HOSTING_ZIN} Daarin zitten back-ups en updates. Aanpassingen en uitbreidingen doen we op aanvraag, met een aparte offerte.`,
      },
      {
        q: "Kunnen jullie ook mijn logo en huisstijl maken?",
        a: "Ja. Van een logo tot een complete huisstijl. Doe je dat samen met je website, dan klopt alles in één keer met elkaar.",
      },
    ],
    todo: [
      "Klanten uit Heerhugowaard of de rest van Dijk en Waard: naam, branche en wat de site opleverde (alleen met toestemming).",
      "Waar spreek je af met ondernemers uit Heerhugowaard: bij hen op locatie, op kantoor in Enkhuizen of via video?",
      "Regionale ervaring: branches of projecten in en rond Heerhugowaard waar je over kunt vertellen.",
      "Een review of citaat van een klant uit deze omgeving, als die er is.",
    ],
  },

  schagen: {
    title: `Website laten maken Schagen vanaf €${PRIJZEN.starter} | Nieuwblik`,
    metaDescription: `Website laten maken in Schagen? Maatwerk vanaf €${PRIJZEN.starter}, binnen 2 tot 4 weken live, vaste prijs. Vraag vrijblijvend een offerte aan.`,
    h1: `Website laten maken in Schagen vanaf €${PRIJZEN.starter}`,
    headings: {
      benefits: "Waarom ondernemers uit Schagen kiezen voor Nieuwblik",
      reviews: REVIEWKOP,
      portfolio: "Voorbeelden van ons werk",
      contact: 'Tijd voor een nieuwe website in Schagen?',
    },
    eigenOpbouw: true,
    intro: `Website laten maken in Schagen voor je praktijk, salon, studio of club. Met een duidelijke route naar een afspraak of inschrijving, en een vaste prijs vanaf ${STARTER}.`,
    cases: ["jord-de-boer-osteopathie", "puur-in-harmonie", "karate-school-cor-slok", "vv-madjoe"],
    lokaal: {
      h2: "Een website die afspraken en aanmeldingen oplevert",
      alineas: [
        "Heb je in Schagen een praktijk, salon, sportschool of vereniging, dan wil je dat een bezoeker zo snel mogelijk een stap zet: een afspraak plannen, een proefles aanvragen of lid worden. Nieuwblik bouwt websites die precies die stap makkelijk maken, vanuit ons kantoor in Enkhuizen en met één vast aanspreekpunt.",
        "Mensen die een behandelaar of club zoeken, twijfelen vaak nog. Wat kost het, word ik vergoed, past dit bij mij? Een goede site beantwoordt die vragen al voordat iemand belt. Daarom kijken we eerst welke vragen jouw klanten stellen en zetten we de antwoorden daar waar ze ze zoeken.",
      ],
    },
    secties: [
      {
        h2: "Voorbeelden: praktijk, salon en sportclub",
        alineas: [
          "Voor osteopaat [Jord de Boer](/portfolio/jord-de-boer-osteopathie) staat 'Plan afspraak' vast in de navigatie en gaat die knop rechtstreeks naar de online agenda. Bovenaan de homepage lees je meteen dat je geen verwijzing van de huisarts nodig hebt, en wie eerst iets wil vragen, stuurt via WhatsApp een bericht.",
          "[Puur in Harmonie](/portfolio/puur-in-harmonie) is een holistische salon. De site is mobiel eerst gebouwd, in de rustige sfeer van de salon zelf, en heeft een webshop met Stripe waarin klanten online bestellen.",
          "Bij [Karate School Cor Slok](/portfolio/karate-school-cor-slok) staan lesroosters en locaties direct vindbaar en loopt de inschrijving volledig digitaal. Voor volleybalvereniging [Madjoe](/portfolio/vv-madjoe) kreeg elk team een eigen pagina en staan 'Proefles aanvragen' en 'Lid worden' overal binnen bereik.",
          "Meer per vakgebied lees je op onze pagina's voor een [fysiotherapeut](/website-laten-maken-fysiotherapeut), een [schoonheidssalon](/website-laten-maken-schoonheidssalon), een [sportschool](/website-laten-maken-sportschool) of een [therapeut](/website-laten-maken-therapeut).",
        ],
      },
      {
        h2: "Wat je betaalt, nu en later",
        alineas: [
          `Eenmalig: voor een compacte site met 1 tot 5 pagina's, contactformulier en Google Maps is Starter genoeg. Die kost ${STARTER}. Wil je een online agenda of boekingssysteem koppelen dat je al gebruikt, of een blog met uitleg over je behandelingen, dan kies je Professional vanaf ${PROFESSIONAL}. Een eigen ledenportaal of inschrijfsysteem is maatwerk, daarvoor maken we een offerte.`,
          `Doorlopend: ${HOSTING_ZIN} Een apart onderhoudscontract is er niet.`,
          "Na de oplevering krijg je het gebruiksrecht op ontwerp en inhoud. Wil je naar een andere partij, dan werken we mee aan de overdracht. Alle pakketten naast elkaar zie je op [prijzen](/prijzen).",
        ],
      },
      {
        h2: "Waar we op letten bij een praktijk, salon of club",
        alineas: [
          "De belangrijkste knop staat op elke pagina op dezelfde plek, op de telefoon net zo goed als op een laptop. Tarieven, vergoedingen en lestijden staan op een eigen pagina in plaats van in een pdf. Foto's laten je eigen ruimte en je eigen mensen zien.",
          "Roosters en prijzen veranderen. Wil je die zelf bijwerken, dan bouwen we op verzoek een beheersysteem waarmee dat zonder technische kennis kan. Anders passen wij het op aanvraag voor je aan.",
          "Voor zoekopdrachten in je eigen omgeving werken website en Google Bedrijfsprofiel samen, met reviews van klanten erbij. Zo vergroot je de kans dat je verschijnt als iemand in de buurt naar jouw vak zoekt.",
          "Werk je ook voor klanten buiten Schagen? Lees dan over [website laten maken in Den Helder](/website-laten-maken-den-helder), [website laten maken in Heerhugowaard](/website-laten-maken-heerhugowaard), [website laten maken in Alkmaar](/website-laten-maken-alkmaar), [website laten maken in Enkhuizen](/website-laten-maken-enkhuizen) of onze aanpak voor [Noord-Holland](/regio/noord-holland).",
        ],
      },
    ],
    faq: [
      {
        q: "Wat kost een website voor een praktijk of salon in Schagen?",
        a: `Een Starter-site kost ${STARTER}. Met een gekoppelde online agenda of een blog kom je meestal uit op Professional, vanaf ${PROFESSIONAL}. Je krijgt vooraf een vaste prijs.`,
      },
      {
        q: "Kunnen klanten via de website een afspraak maken?",
        a: "Ja. Gebruik je al een online agenda, dan sturen we bezoekers daar met één knop naartoe. Wil je liever dat mensen eerst een vraag stellen, dan kan dat ook via een WhatsApp-knop.",
      },
      {
        q: "Wat zijn de vaste kosten na de oplevering?",
        a: `${HOSTING_ZIN} Er is geen apart onderhoudscontract.`,
      },
      {
        q: "Wat mag ik na de oplevering met mijn website?",
        a: "Na de oplevering krijg je het gebruiksrecht op ontwerp en inhoud. Wil je naar een andere partij, dan werken we mee aan de overdracht.",
      },
      {
        q: "Maken jullie ook websites voor sportclubs en verenigingen in Schagen?",
        a: "Ja. Voor clubs bouwen we bijvoorbeeld teampagina's, lesroosters en een makkelijke route naar een proefles of lidmaatschap. Bekijk de sites van volleybalvereniging Madjoe en Karate School Cor Slok als voorbeeld.",
      },
      {
        q: "Hoe lang duurt het voordat mijn website live staat?",
        a: `Een Starter-site staat meestal binnen ${LEVERTIJD.starter} live, een uitgebreidere site binnen ${LEVERTIJD.standaard}. Met een ledenportaal of webshop reken je op ${LEVERTIJD.complex}.`,
      },
    ],
    todo: [
      "Klanten uit Schagen of de Kop van Noord-Holland: naam, branche en wat de site opleverde (alleen met toestemming).",
      "Waar spreek je af met ondernemers uit Schagen: bij hen op locatie, in Enkhuizen of via video?",
      "Ervaring met praktijken, salons of clubs in deze regio die je kunt noemen.",
      "Een review of citaat van een klant uit Schagen, als die er is.",
    ],
  },

  medemblik: {
    title: `Website laten maken Medemblik vanaf €${PRIJZEN.starter} | Nieuwblik`,
    metaDescription: `Website laten maken in Medemblik? Maatwerk vanaf €${PRIJZEN.starter}, binnen 2 tot 4 weken live, vaste prijs. Vraag vrijblijvend een offerte aan.`,
    h1: `Website laten maken in Medemblik vanaf €${PRIJZEN.starter}`,
    headings: {
      benefits: "Waarom ondernemers uit Medemblik kiezen voor Nieuwblik",
      reviews: REVIEWKOP,
      portfolio: "Websites uit de regio die klanten opleveren",
      contact: 'Klaar voor een nieuwe website in Medemblik?',
    },
    eigenOpbouw: true,
    intro: `Website laten maken in Medemblik: een site die gevonden wordt door mensen in je eigen omgeving. Vaste prijs vanaf ${STARTER}, gebouwd vanuit Enkhuizen.`,
    cases: ["aardingsbedrijf-west-friesland", "taxi-drechterland", "feigro-dakwerken", "vv-madjoe"],
    lokaal: {
      h2: "Website laten maken in Medemblik",
      alineas: [
        "De meeste klanten van een ondernemer in Medemblik wonen in de buurt. Ze zoeken op hun telefoon naar een dienst met de plaatsnaam erachter, of op 'in de buurt'. Wie dan bovenaan staat, krijgt het telefoontje. Nieuwblik bouwt websites die daarop zijn ingericht, vanuit Enkhuizen en met één vast aanspreekpunt.",
        "Lokaal gevonden worden is geen trucje achteraf. Het begint bij hoe de site in elkaar zit: welke pagina's er zijn, wat erop staat en hoe snel ze laden. Dat regelen we vanaf het eerste ontwerp.",
      ],
    },
    secties: [
      {
        h2: "Hoe we bedrijven in de regio vindbaar maakten",
        alineas: [
          "[Aardingsbedrijf West-Friesland](/portfolio/aardingsbedrijf-west-friesland) wil gevonden worden door particulieren en bedrijven in heel West-Friesland, waaronder Medemblik. Elke dienst, van hulpaarding en diepte-aarding tot metingen, wordt helder uitgelegd, en Google-reviews staan prominent in beeld als bewijs voor wie het bedrijf nog niet kent.",
          "Bij [Taxi Drechterland](/portfolio/taxi-drechterland) hoorde lokale vindbaarheid bij de opdracht: in de dorpen in de omgeving en bij zoekopdrachten voor luchthavenritten. Daarom zijn er aparte pagina's voor de luchthavenritten en worden de kernen in het werkgebied afzonderlijk uitgelicht. Zo wordt de chauffeur gevonden op zoekopdrachten als 'taxi Hoogkarspel' of 'taxi naar Schiphol vanuit West-Friesland'.",
          "[Feigro Dakwerken](/portfolio/feigro-dakwerken) werkt in heel West-Friesland. Opgeleverde projecten staan op de site als bewijs, en een lekkage meld je via een eigen, snelle route naast de gewone offerteaanvraag.",
        ],
      },
      {
        h2: "Wat een vindbare website in Medemblik kost",
        alineas: [
          `In elke site zit de technische basis voor Google: snelle laadtijden, structured data, meta-tags per pagina, een sitemap en robots.txt. Met Starter (${STARTER}, 1 tot 5 pagina's) heb je die basis, plus contactformulier en Google Maps.`,
          `Wil je per dienst een eigen pagina en met artikelen laten zien wat je weet, dan kies je Professional vanaf ${PROFESSIONAL}. Daarin zitten tot 10 pagina's, uitgebreide SEO en een blog. Voor doorlopend werk aan je zoekposities bieden we losse SEO-pakketten aan.`,
          `Een webshop of maatwerk prijzen we per project. Webshops beginnen bij ${WEBSHOP}. Een overzicht van alle pakketten staat op [prijzen](/prijzen).`,
        ],
      },
      {
        h2: "Website en Google Bedrijfsprofiel samen",
        alineas: [
          "Bij zoekopdrachten met een plaatsnaam laat Google naast gewone resultaten ook bedrijven op de kaart zien. Die komen uit het Google Bedrijfsprofiel. Een profiel met dezelfde gegevens als je website, de juiste categorie en reviews van klanten maakt de kans groter dat je daar verschijnt. Hoe je dat instelt, lees je in ons artikel over [het Google Bedrijfsprofiel](/blog/google-bedrijfsprofiel-instellingen-2026).",
          "Werk je ook in de rest van de regio? Kijk dan bij [website laten maken in Hoorn](/werkgebied/hoorn), [website laten maken in Enkhuizen](/website-laten-maken-enkhuizen) of de pagina voor [heel West-Friesland](/werkgebied/west-friesland).",
        ],
      },
    ],
    faq: [
      {
        q: "Wat kost een vindbare website in Medemblik?",
        a: `Starter kost ${STARTER}, Professional begint bij ${PROFESSIONAL} en een webshop bij ${WEBSHOP}. Je krijgt vooraf een offerte met een vaste prijs.`,
      },
      {
        q: "Hoe kom ik op de kaart in Google als iemand in Medemblik zoekt?",
        a: "Via je Google Bedrijfsprofiel. Vul het volledig in, gebruik dezelfde naam, adres en openingstijden als op je website en vraag klanten om een review. Je website helpt mee door duidelijk te maken wat je doet en waar je werkt.",
      },
      {
        q: "Heb ik een aparte pagina per dienst nodig?",
        a: "Als je meerdere diensten aanbiedt, meestal wel. Iemand die op één dienst zoekt, komt dan op een pagina die precies daarover gaat. Daarvoor is Professional bedoeld, met tot 10 pagina's.",
      },
      {
        q: "Zit SEO bij de prijs inbegrepen?",
        a: "De technische basis wel: snelheid, structured data, meta-tags, sitemap en robots.txt. Uitgebreide SEO zit in Professional. Wil je daarna doorlopend werken aan je posities, dan kan dat met een los SEO-pakket.",
      },
      {
        q: "Binnen hoeveel weken staat mijn site in Medemblik live?",
        a: `Een Starter-site meestal binnen ${LEVERTIJD.starter}, een bedrijfswebsite binnen ${LEVERTIJD.standaard}, een grotere site of webshop binnen ${LEVERTIJD.complex}.`,
      },
      {
        q: "Werken jullie ook voor bedrijven elders in West-Friesland?",
        a: "Ja. We zitten zelf in Enkhuizen en bouwen sites voor ondernemers in heel West-Friesland, onder meer in Hoorn, Enkhuizen en de dorpen eromheen.",
      },
    ],
    todo: [
      "Klanten uit Medemblik of de dorpen eromheen: naam, branche en wat de site opleverde (alleen met toestemming).",
      "Waar spreek je af met ondernemers uit Medemblik: bij hen op locatie, in Enkhuizen of via video?",
      "Ervaring met lokale vindbaarheid in deze regio die je kunt noemen.",
      "Een review of citaat van een klant uit Medemblik, als die er is.",
    ],
  },
  alkmaar: {
    title: `Website laten maken Alkmaar vanaf ${STARTER} | Nieuwblik`,
    metaDescription: `Website laten maken in Alkmaar? Vaste prijs vanaf ${STARTER}, direct contact met de makers en gebouwd om gevonden te worden. Binnen 2 tot 4 weken live.`,
    h1: "Website laten maken in Alkmaar",
    eigenOpbouw: true,
    intro: `Een bedrijfswebsite of webshop voor ondernemers in Alkmaar, gebouwd door een klein team uit Noord-Holland. Vaste prijs vanaf ${STARTER}, zonder accountmanager ertussen.`,
    cases: ["benoted", "een-bundel-geluk", "kyodai-originals", "taxi-drechterland"],
    headings: {
      reviews: "Wat klanten over Nieuwblik zeggen",
      portfolio: "Voorbeelden van ons werk",
      contact: "Plannen voor een nieuwe website in Alkmaar?",
    },
    lokaal: {
      h2: "Webdesign voor ondernemers in Alkmaar",
      alineas: [
        "Wie in Alkmaar een webbureau zoekt, heeft keus genoeg. Waarom dan Nieuwblik? Omdat je bij ons rechtstreeks werkt met de mensen die je site ontwerpen en bouwen, omdat je vooraf weet wat het kost en omdat we elke site maken om gevonden te worden: in Google, en ook in AI-zoekmachines als ChatGPT.",
        "Ons kantoor staat in Enkhuizen. Het meeste werk doen we op afstand, met korte lijnen via telefoon, mail en WhatsApp. Je hebt één aanspreekpunt dat je project van begin tot eind kent.",
      ],
    },
    secties: [
      {
        h2: "Welke website past bij jouw bedrijf?",
        alineas: [
          `Starter (${STARTER}) is gemaakt voor ondernemers die een compacte, nette site willen: 1 tot 5 pagina's, een contactformulier, Google Maps, de basis van SEO en een site die snel laadt op elke telefoon. Meestal staat hij binnen ${LEVERTIJD.starter} online.`,
          `Professional (vanaf ${PROFESSIONAL}) is voor bedrijven die online klanten willen werven. Je krijgt tot 10 pagina's, uitgebreide SEO, een blog om je kennis te laten zien en koppelingen met externe tools.`,
          `Op maat is voor alles wat groter is: een webshop met betaalkoppelingen, een beheersysteem op aanvraag, onbeperkt pagina's of een koppeling met je eigen systemen. Webshops beginnen bij ${WEBSHOP}. Bekijk alle pakketten op [prijzen](/prijzen), of lees hoe we [webshops](/diensten/webshops) aanpakken.`,
        ],
      },
      {
        h2: "Wat we voor anderen bouwden",
        alineas: [
          "Voor [BeNoted](/portfolio/benoted) bouwden we een platform waarin snelheid voorop stond. Wat dat oplevert, beschrijven we in onze [case over websitesnelheid](/blog/case-study-benoted-snelheid-zichtbaarheid).",
          "[Een Bundel Geluk](/portfolio/een-bundel-geluk) uit Enkhuizen kreeg een webshop waarin klanten ook via WhatsApp een bestelling kunnen doen. En voor [Kyodai Originals](/portfolio/kyodai-originals) maakten we een digitale galerie waarin vertrouwen en de herkomst van elk stuk centraal staan.",
        ],
      },
      {
        h2: "Hoe we samenwerken",
        alineas: [
          "Het begint met een gesprek over je bedrijf, je klanten en wat de site moet opleveren. Binnen 24 uur ontvang je daarna een offerte met een vaste prijs en een planning.",
          "We ontwerpen en bouwen in stappen. Bij elke tussenversie geef je feedback, zodat er bij de oplevering geen verrassingen zijn. Teksten schrijven we samen, op basis van wat jij weet en wat klanten in Alkmaar en omgeving zoeken.",
          `${HOSTING_ZIN} Zelf aanpassen kan ook: op verzoek bouwen we een beheersysteem waarmee je teksten en foto's wijzigt.`,
        ],
      },
      {
        h2: "Vindbaar in Alkmaar en de regio",
        alineas: [
          "Een mooie site waar niemand op uitkomt, levert niets op. Daarom zit vindbaarheid vanaf de eerste schets in het werk: een snelle site, een logische opbouw met een pagina per dienst en teksten die antwoord geven op de vragen van je klanten. Zo begrijpen Google en AI-zoekmachines waar je bedrijf over gaat. Hoe dat bij ChatGPT werkt, lees je in ons artikel over [vindbaar worden in ChatGPT](/blog/vindbaar-in-chatgpt-geo-west-friesland).",
          "Werk je ook buiten Alkmaar? Lees dan over [website laten maken in Heerhugowaard](/website-laten-maken-heerhugowaard), [webdesign in Purmerend](/website-laten-maken-purmerend), [website laten maken in Hoorn](/werkgebied/hoorn), [website laten maken in Enkhuizen](/website-laten-maken-enkhuizen) of onze aanpak voor [Noord-Holland](/regio/noord-holland).",
        ],
      },
    ],
    faq: [
      {
        q: "Wat kost een website laten maken in Alkmaar?",
        a: `Starter kost ${STARTER}, Professional begint bij ${PROFESSIONAL} en een webshop bij ${WEBSHOP}. Je krijgt vooraf een offerte met een vaste prijs.`,
      },
      {
        q: "Maken jullie ook webshops voor ondernemers in Alkmaar?",
        a: `Ja. Een webshop bouwen we op maat, met betaalkoppelingen. Wil je zelf producten beheren, dan bouwen we op aanvraag een beheeromgeving. Webshops beginnen bij ${WEBSHOP}, afhankelijk van het aantal producten en koppelingen.`,
      },
      {
        q: "Hoe lang duurt het om een website te laten maken?",
        a: `Een Starter-site staat meestal binnen ${LEVERTIJD.starter} live, een bedrijfswebsite binnen ${LEVERTIJD.standaard} en een grote site of webshop binnen ${LEVERTIJD.complex}.`,
      },
      {
        q: "Zit jullie kantoor in Alkmaar?",
        a: "Nee, we zitten in Enkhuizen. Voor klanten in Alkmaar werken we grotendeels op afstand, met contact via telefoon, mail en WhatsApp. Je hebt steeds hetzelfde aanspreekpunt.",
      },
      {
        q: "Word ik met een nieuwe website ook gevonden in ChatGPT?",
        a: "Daar houden we rekening mee. AI-zoekmachines halen hun antwoorden uit sites die snel, duidelijk en goed opgebouwd zijn. Dezelfde basis die je hoger in Google zet, maakt je ook beter zichtbaar in ChatGPT.",
      },
      {
        q: "Kunnen jullie mijn huidige website verbeteren in plaats van opnieuw bouwen?",
        a: "Soms wel. Met een [gratis website-analyse](/gratis-website-analyse) zie je wat er goed gaat en wat beter kan. Daarna bepalen we samen of verbeteren of vernieuwen verstandiger is.",
      },
    ],
    todo: [
      "Klanten uit Alkmaar: naam, branche en wat de site opleverde (alleen met toestemming van de klant).",
      "Waar spreek je af met ondernemers uit Alkmaar: bij hen op locatie, in Enkhuizen of via video?",
      "Regionale ervaring in Alkmaar en omgeving die je kunt noemen.",
      "Een review of citaat van een klant uit Alkmaar, als die er is.",
    ],
  },

  enkhuizen: {
    title: `Website laten maken Enkhuizen vanaf ${STARTER} | Nieuwblik`,
    metaDescription: `Website laten maken in Enkhuizen bij een webbureau uit Enkhuizen. Vaste prijs vanaf ${STARTER}, één aanspreekpunt en gebouwd om gevonden te worden.`,
    h1: "Website laten maken in Enkhuizen",
    eigenOpbouw: true,
    intro: `Een website laten maken in Enkhuizen, bij het webbureau dat hier zelf zit. Vaste prijs vanaf ${STARTER}, één aanspreekpunt en een site die in Enkhuizen en omgeving gevonden wordt.`,
    cases: ["vv-madjoe", "feigro-dakwerken", "kyodai-originals", "een-bundel-geluk"],
    headings: {
      reviews: REVIEWKOP,
      portfolio: "Websites voor klanten uit Enkhuizen",
      contact: "Een website laten maken in Enkhuizen? Plan een kennismaking",
    },
    lokaal: {
      h2: "Website laten maken in Enkhuizen, onze thuisplaats",
      alineas: [
        "Enkhuizen is onze thuisplaats. Nieuwblik, dat zijn wij: Justin en Job, twee ontwerpers en developers uit Enkhuizen. Justin Slok heeft het bureau opgericht. Bij ons spreek je degene die ook daadwerkelijk aan je website bouwt, zonder accountmanager of tussenlaag.",
        "We werken voornamelijk online, via videocall, telefoon, mail en WhatsApp. Spreek je elkaar liever in het echt, dan komen we bij je langs.",
        "Een website voor een bedrijf in Enkhuizen begint bij de vraag wie je wilt bereiken: klanten uit de stad zelf, uit de dorpen eromheen of uit de rest van het land. Dat bepaalt welke pagina's er komen, welke woorden erin staan en welke knop een bezoeker als eerste ziet.",
      ],
    },
    secties: [
      {
        h2: "Wat we bouwden voor clubs en bedrijven uit Enkhuizen",
        alineas: [
          "Voor volleybalvereniging [Madjoe](/portfolio/vv-madjoe) uit Enkhuizen, sinds 1950 een van de grootste volleybalclubs van West-Friesland, maakten we een clubwebsite die het hele clubleven draagt. Elk team heeft een eigen pagina met klasse, trainer, trainingstijden en selectie. Nieuwe leden beginnen met een proefles en melden zich daarna online aan in vijf stappen, en voor evenementen schrijf je je in en betaal je direct met iDEAL. De site is ingericht op zoekopdrachten als 'volleybal Enkhuizen' en 'volleybalclub West-Friesland'.",
          "Achter de schermen ziet het bestuur van Madjoe in een afgeschermde beheeromgeving alle aanmeldingen, proeflessen, afmeldingen en inschrijvingen bij elkaar, met betaalstatus en een export naar Excel. Sponsors hebben een eigen route met de mogelijkheden als bord-, kleding- of evenementsponsor.",
          "We zijn zelf ook betrokken bij de club. Samen met Enza Zaden, Kreeft Autoservice en Toolstra Bouwbedrijf staan we als shirtsponsor op het shirt van Heren 1, dat in de Topdivisie speelt. Daarover schreven we [een blog](/blog/nieuwblik-sponsort-vv-madjoe-heren-1).",
          "[Feigro Dakwerken](/portfolio/feigro-dakwerken) uit Enkhuizen ontstond uit de samenvoeging van twee dakdekkersbedrijven uit West-Friesland. De nieuwe website zet het bedrijf neer als één team voor platte en hellende daken, laat opgeleverde projecten zien en scheidt de offerteaanvraag voor een nieuw dak van een snelle route om een lekkage te melden.",
          "Voor [Kyodai Originals](/portfolio/kyodai-originals), een klant uit Enkhuizen met een besloten showroom in Amsterdam, bouwden we een online galerie voor authentieke Japanse zwaarden en wapenrustingen, waarin certificering, de geschiedenis van elk stuk en persoonlijk contact het vertrouwen van verzamelaars moeten winnen. De NBTHK-, NBSK- en NTHK-certificeringen en de levenslange authenticiteitsgarantie staan prominent op de productpagina's.",
          "[Een Bundel Geluk](/portfolio/een-bundel-geluk) uit Enkhuizen maakt handgemengde theeblends en natuurlijke verzorgingsproducten. De webshop vertelt het verhaal van de oprichtster en houdt het contact persoonlijk: vragen en bestellingen lopen via WhatsApp.",
        ],
      },
      {
        h2: "Wat een website in Enkhuizen kost",
        alineas: [
          `Starter kost ${STARTER}: een site van 1 tot 5 pagina's die op elk scherm goed werkt, met de basis van SEO, een contactformulier en Google Maps. Reken op ${LEVERTIJD.starter} tot de livegang.`,
          `Professional begint bij ${PROFESSIONAL} en is bedoeld voor bedrijven die met meerdere diensten gevonden willen worden: tot 10 pagina's, uitgebreide SEO, een blog en koppelingen met externe tools. De doorlooptijd is ${LEVERTIJD.standaard}.`,
          `Op maat is er voor webshops met betaalkoppelingen, eigen koppelingen met je systemen en sites zonder paginagrens. Webshops beginnen bij ${WEBSHOP}, grotere projecten duren ${LEVERTIJD.complex}. Een beheersysteem om zelf teksten aan te passen bouwen we op aanvraag.`,
          `Na de oplevering: ${HOSTING_ZIN} Een apart onderhoudscontract is er niet. Na de oplevering krijg je het gebruiksrecht op ontwerp en inhoud. Wil je naar een andere partij, dan werken we mee aan de overdracht. Alle pakketten naast elkaar staan op [prijzen](/prijzen).`,
        ],
      },
      {
        h2: "Je huidige website vernieuwen",
        alineas: [
          "Heb je al een site die traag laadt, niet prettig werkt op de telefoon of weinig aanvragen oplevert? Dan kijken we eerst wat hij nu doet. Met een [gratis website-analyse](/gratis-website-analyse) krijg je binnen 24 uur een persoonlijke analyse van snelheid, vindbaarheid en conversie, met concrete verbeterpunten.",
          "Daarna kiezen we samen: verbeteren wat er staat, of opnieuw bouwen. Bij een nieuwe site zetten we de adressen van je oude pagina's met een 301-redirect door, zodat bezoekers en Google op de juiste plek uitkomen.",
        ],
      },
      {
        h2: "Gevonden worden in Enkhuizen",
        alineas: [
          "Wie in Enkhuizen een bedrijf zoekt, ziet in Google vaak eerst een kaart met bedrijven uit de buurt. Die komen uit het Google Bedrijfsprofiel. Een volledig profiel met dezelfde naam, hetzelfde adres en dezelfde openingstijden als op je website, de juiste categorie en reviews van klanten vergroot de kans dat je daar verschijnt. Hoe je dat instelt, lees je in [ons artikel over het Google Bedrijfsprofiel](/blog/google-bedrijfsprofiel-instellingen-2026).",
          "Ook AI-assistenten zoals ChatGPT noemen bedrijven als iemand vraagt naar een aanbieder in de buurt. Hoe je daarin zichtbaar wordt, beschrijven we in [vindbaar worden in ChatGPT](/blog/vindbaar-in-chatgpt-geo-west-friesland).",
          "Wil je daarna gericht hoger komen op zoektermen in Enkhuizen en West-Friesland, dan is dat een apart traject. Daarover lees je op [SEO in Enkhuizen](/seo-enkhuizen). Werk je ook buiten de stad, bekijk dan [website laten maken in Medemblik](/website-laten-maken-medemblik), [website laten maken in Hoorn](/werkgebied/hoorn) of de pagina voor [heel West-Friesland](/werkgebied/west-friesland).",
        ],
      },
    ],
    faq: [
      {
        q: "Wat kost een website van een webbureau uit Enkhuizen?",
        a: `Starter kost ${STARTER}, Professional begint bij ${PROFESSIONAL} en een webshop bij ${WEBSHOP}. Na een kennismaking krijg je binnen 24 uur een offerte met een vaste prijs.`,
      },
      {
        q: "Met welke levertijd moet ik rekenen?",
        a: `Een Starter-site staat meestal binnen ${LEVERTIJD.starter} live, een bedrijfswebsite binnen ${LEVERTIJD.standaard} en een webshop of groter project binnen ${LEVERTIJD.complex}. Het tempo hangt ook af van hoe snel teksten en foto's klaar zijn.`,
      },
      {
        q: "Kunnen we elkaar spreken in Enkhuizen?",
        a: "We werken voornamelijk online: kennismaken gaat via een videocall, daarna houd je contact via telefoon, mail en WhatsApp. Spreek je elkaar liever in het echt, dan komen we bij je langs.",
      },
      {
        q: "Mijn website is verouderd. Waar beginnen we?",
        a: "Met een gratis website-analyse van snelheid, vindbaarheid en conversie. Binnen 24 uur heb je die, en daarna bepalen we samen of verbeteren of opnieuw bouwen verstandiger is.",
      },
      {
        q: "Kan ik mijn winkel uitbreiden met een webshop?",
        a: `Ja. We bouwen webshops op maat met betaalkoppelingen, vanaf ${WEBSHOP}. Je krijgt een gebruiksvriendelijk dashboard waarin je zelf producten, prijzen en voorraad beheert.`,
      },
      {
        q: "Wat heeft mijn Google Bedrijfsprofiel met mijn website te maken?",
        a: "Veel. Google toont bij lokale zoekopdrachten bedrijven uit het Bedrijfsprofiel en kijkt daarbij of de gegevens kloppen met je website. Dezelfde naam, hetzelfde adres en hetzelfde telefoonnummer op beide plekken helpen, net als reviews van klanten.",
      },
      {
        q: "Werken jullie alleen voor bedrijven in Enkhuizen?",
        a: "Nee. Enkhuizen is onze thuisplaats, maar we werken grotendeels op afstand, voor ondernemers door heel Nederland. Voor osteopaat Jord de Boer in Almere Poort bouwden we bijvoorbeeld een website waarop patiënten online een afspraak plannen.",
      },
      {
        q: "Wie regelt de hosting en het onderhoud?",
        a: `${HOSTING_ZIN} Een apart onderhoudscontract is er niet. Aanpassingen en uitbreidingen doen we op aanvraag, met een aparte offerte.`,
      },
    ],
  },
};

export const getCityLokaal = (slug: string): CityLokaal | undefined => cityLokaal[slug];
