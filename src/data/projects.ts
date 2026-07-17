import benotedImg from "@/assets/projects/benoted.nl.jpg";
import bushidoshopImg from "@/assets/projects/bushidoshop.nl.webp";
import carbon6Img from "@/assets/projects/carbon6.nl.webp";
import ericavandijkImg from "@/assets/projects/ericavandijk.nl.webp";
import daniquekwakmanImg from "@/assets/projects/daniquekwakman.nl.webp";
import caspernieskensptImg from "@/assets/projects/caspernieskenspt.nl.webp";
import edventureboatsImg from "@/assets/projects/edventureboats.nl.webp";
import esveldinstallatieImg from "@/assets/projects/esveldinstallatie.nl.webp";
import interieurstudiolaan from "@/assets/projects/interieurstudiolaan.nl.webp";
import karateschoolcorslokImg from "@/assets/projects/karateschoolcorslok.nl.webp";
import kyodaioriginalsImg from "@/assets/kyodai-originals.webp";
import lashlutionImg from "@/assets/projects/lashlution.nl.webp";
import mhbtechniekImg from "@/assets/projects/mhbtechniek.nl.webp";
import feitsmadakwerkenImg from "@/assets/projects/feitsmadakwerken.nl.webp";
import greenProfitImg from "@/assets/projects/green-profit.nl.webp";
import vdvtuinenImg from "@/assets/projects/vdvtuinen.nl.webp";
import rrsroyalImg from "@/assets/projects/rrsroyal.nl.webp";
import puurCaseImg from "@/assets/projects/puurinharmonie-case.webp";
import puurCase1Img from "@/assets/projects/puurinharmonie-case-1.webp";
import puurCase2Img from "@/assets/projects/puurinharmonie-case-2.webp";
import pridemobilityImg from "@/assets/projects/pridemobility.eu.webp";
import quantumrehabImg from "@/assets/projects/quantumrehab.eu.webp";
import aardingsbedrijfImg from "@/assets/projects/aardingsbedrijfwestfriesland.nl.png";
import eenbundelgelukImg from "@/assets/projects/eenbundelgeluk.webp";
import taxidrechterlandImg from "@/assets/taxidrechterland.webp";

export interface ProjectDetail {
  year: string;
  goal: string;
  idea: string;
  details: string;
}

export interface ProjectCredits {
  intro: string;
  name: string;
  company: string;
  url: string;
}

export interface Project {
  slug: string;
  title: string;
  category: string;
  filterCategory: string;
  description: string;
  tags: string[];
  image: string;
  url: string;
  detail?: ProjectDetail;
  gallery?: string[];
  credits?: ProjectCredits;
}

export const projects: Project[] = [
  {
    slug: "taxi-drechterland",
    title: "Taxi Drechterland",
    category: "Taxi & Personenvervoer",
    filterCategory: "websites",
    description: "Een snelle taxiwebsite voor Hoogkarspel en omstreken, met een boekingsformulier dat de ritwens van de klant direct omzet in een kant-en-klaar WhatsApp-bericht voor de chauffeur.",
    tags: ["Maatwerk", "WhatsApp Boekingsformulier", "Lokale SEO", "Conversiegericht"],
    image: taxidrechterlandImg,
    url: "https://taxidrechterland.nl",
    detail: {
      year: "2026",
      goal: "Taxi Drechterland is geen centrale met een callcenter, maar één vaste chauffeur uit Hoogkarspel die zijn eigen ritten rijdt. Precies dat is de kracht van het bedrijf, en precies dat maakte een klassiek boekingssysteem ongeschikt. Een agenda-integratie met realtime beschikbaarheid zou beloftes doen die één chauffeur onderweg niet kan waarmaken, en een account- of app-verplichting zou de drempel juist verhogen voor de doelgroep: mensen uit de regio die snel een rit naar het station, het ziekenhuis of Schiphol nodig hebben. De opdracht was daarom om de aanvraag zo kort mogelijk te maken zonder de chauffeur zijn regie af te nemen, en om lokaal goed vindbaar te zijn: zowel in de dorpen in de omgeving als bij zoekopdrachten voor de luchthavenritten.",
      idea: "In plaats van een boekingssysteem te bouwen dat de chauffeur moet bijhouden, hebben we het aanvraagproces laten eindigen waar hij toch al de hele dag zit: WhatsApp. Het boekingsformulier op de site vraagt alleen wat de chauffeur echt nodig heeft om te kunnen inschatten en bevestigen — type rit, ophaal- en bestemmingsadres, moment (nu of op afspraak), aantal personen en aantal koffers. Bij het versturen zet het formulier die antwoorden om in een compleet, netjes opgemaakt bericht en opent het WhatsApp met dat bericht al ingevuld klaar. De klant hoeft alleen nog op verzenden te drukken.\n\nDat lost twee dingen tegelijk op. De klant hoeft geen account aan te maken, geen app te installeren en niets zelf te formuleren — de drempel is één tik. En de chauffeur ontvangt geen los 'kunt u mij ophalen?' meer, maar direct een gestructureerde aanvraag met alle gegevens erin, waar hij vanuit zijn eigen telefoon persoonlijk op kan antwoorden met een prijsindicatie. Het gesprek staat meteen in de app die hij toch al gebruikt, inclusief de hele geschiedenis met die klant.",
      details: "Voor Taxi Drechterland uit Hoogkarspel heeft Nieuwblik in juli 2026 een complete taxiwebsite ontworpen en gebouwd. Het uitgangspunt: de site moet net zo direct en persoonlijk aanvoelen als de chauffeur zelf, en op een telefoon langs de weg net zo snel zijn als thuis op de bank.\n\nHet hart van de website is het WhatsApp-boekingsformulier. Via een vast boekingsmenu geeft de bezoeker in een paar tikken zijn rit door: het type rit, waarvandaan en waarheen, of het per direct is of op afspraak, en met hoeveel personen en koffers. Personen en koffers worden met eenvoudige plus- en minknoppen ingesteld in plaats van via een dropdown, zodat het ook met één duim op een klein scherm werkt. Zodra de aanvraag compleet is, wordt alles omgezet naar een kant-en-klaar WhatsApp-bericht en opent de app met het bericht al ingevuld. Geen account, geen wachtrij, geen formulier dat in een mailbox verdwijnt: de aanvraag landt rechtstreeks bij de chauffeur, die persoonlijk bevestigt.\n\nDaarnaast is de hele site opgebouwd rond het dagritme van het bedrijf. Overdag rijdt de chauffeur in de regio — Hoogkarspel, Venhuizen, Westwoud, Oosterblokker, Hoorn en Enkhuizen — en vanaf de middag verplaatst het werkgebied zich richting Amsterdam en Schiphol. Dat ritme is expliciet uitgelegd in plaats van verstopt achter een beschikbaarheidskalender, zodat een bezoeker in één oogopslag ziet of hij op het juiste moment belt. Bellen en appen staan overal binnen bereik, met een zwevende widget en een vaste balk die meeschuift.\n\nVoor de vindbaarheid zijn aparte pagina's gemaakt voor de luchthavenritten naar Schiphol, Eindhoven, Rotterdam, Groningen en Maastricht Aachen Airport, en zijn de kernen in het werkgebied afzonderlijk uitgelicht. Zo wordt Taxi Drechterland gevonden op precies de zoekopdrachten waar de klant op dat moment mee bezig is, of dat nu 'taxi Hoogkarspel' is of 'taxi naar Schiphol vanuit West-Friesland'.\n\nHet resultaat is een website die de kortste route neemt tussen een bezoeker met een vraag en een chauffeur met een antwoord. Geen systeem dat onderhouden moet worden, geen techniek die belooft wat één chauffeur niet kan waarmaken — maar een snelle, heldere site die elke aanvraag als een compleet bericht op de telefoon van de chauffeur legt."
    }
  },
  {
    slug: "een-bundel-geluk",
    title: "Een Bundel Geluk",
    category: "E-commerce, Gezondheid & Persoonlijke Branding",
    filterCategory: "e-commerce",
    description: "Een sfeervolle webshop en merkwebsite voor handgemaakte natuurlijke huidverzorging en kruidenthee uit Enkhuizen.",
    tags: ["Webshop", "Persoonlijke Branding", "WhatsApp Integratie", "Natuurlijk Design"],
    image: eenbundelgelukImg,
    url: "https://www.eenbundelgeluk.nl",
    detail: {
      year: "2026",
      goal: "Het hoofddoel van de website is het genereren van online verkopen voor pure, handgemengde theeblends en natuurlijke verzorgingsproducten, zoals huisgemaakte tallowcrème en zepen. De site dient als een warme digitale etalage die de bezoeker meeneemt in de wereld van natuurlijke ingrediënten, vrij van synthetische toevoegingen. Daarnaast is het platform specifiek ingericht om de interactie met de klant direct en laagdrempelig te houden door communicatie uitsluitend via WhatsApp te laten verlopen. Dit stelt bezoekers in staat om heel eenvoudig persoonlijke vragen te stellen, bestellingen door te geven of een op maat gemaakte bundel aan te vragen.",
      idea: "Het digitale concept is volledig opgebouwd rondom puurheid, ambacht en een persoonlijke connectie. Er is gekozen voor een rustig en warm webdesign dat de natuurlijke oorsprong van de producten en de seizoensgebonden filosofie weerspiegelt. Door de persoonlijke reis van de oprichtster een centrale plek te geven in de navigatie en de teksten, ontstaat er direct een gevoel van vertrouwen en authenticiteit bij de bezoeker. Om dit kleinschalige karakter te versterken en conversies te stimuleren, is er een prominente zwevende integratie voor WhatsApp toegevoegd als de primaire communicatielijn. Dit idee benadrukt de warme service van Een Bundel Geluk en sluit naadloos aan bij de belofte om elk product met liefde en aandacht te behandelen.",
      details: "Voor de klant Een Bundel Geluk uit Enkhuizen is in mei 2026 een sfeervolle, persoonlijke webshop en merkwebsite ontwikkeld. De nadruk ligt op de online presentatie en verkoop van handgemaakte natuurlijke huidverzorging en kruidenthee, verweven met het authentieke verhaal van de oprichtster.\n\nDe website fungeert als een warme digitale etalage waarin het ambacht, de puurheid en de seizoensgebonden filosofie van het merk centraal staan. Bezoekers worden meegenomen in de wereld van natuurlijke ingrediënten, vrij van synthetische toevoegingen.\n\nDoor de prominente WhatsApp-integratie blijft de communicatie laagdrempelig en persoonlijk, perfect passend bij het kleinschalige en liefdevolle karakter van Een Bundel Geluk."
    }
  },
  {
    slug: "aardingsbedrijf-west-friesland",
    title: "Aardingsbedrijf West-Friesland",
    category: "Zakelijke website, Leadgeneratie, Techniek & Installatie",
    filterCategory: "websites",
    description: "Een conversiegerichte website voor specialistische aardingsdiensten met sterke lokale zichtbaarheid in West-Friesland.",
    tags: ["Web Design", "Leadgeneratie", "Lokale SEO", "Techniek"],
    image: aardingsbedrijfImg,
    url: "https://www.aardingsbedrijfwestfriesland.nl",
    detail: {
      year: "2026",
      goal: "Het hoofddoel van de website is gerichte leadgeneratie binnen de regio West-Friesland (waaronder Hoorn, Enkhuizen en Medemblik). De site dient als een modern en betrouwbaar kanaal dat particulieren en bedrijven informeert over de cruciale veiligheid van aarding en de verplichte NEN-1010 norm. Tegelijkertijd moet het platform de drempel voor interactie zo laag mogelijk maken, zodat bezoekers moeiteloos en snel een offerte kunnen aanvragen of een afspraak kunnen inplannen voor een inspectie.",
      idea: "Het digitale concept is gebouwd rondom autoriteit, veiligheid en directe actie. Er is gekozen voor een strak, professioneel webdesign dat complexe en technische materie toegankelijk maakt voor de consument. Door het visueel uitlichten van de risico's van slechte aarding (zoals brandgevaar en defecte apparatuur) wordt de noodzaak van de dienstverlening direct duidelijk. Om conversies te stimuleren, zijn er opvallende en zwevende contactmogelijkheden geïntegreerd, waaronder directe knoppen voor bellen, WhatsApp en het aanvragen van offertes. De prominente weergave van klantbeoordelingen (Google Reviews) vormt de laatste schakel in het ontwerp om sociaal bewijs en vertrouwen te leveren.",
      details: "Voor de klant Aardingsbedrijf West-Friesland is een compleet nieuwe, conversiegerichte online omgeving ontwikkeld door Nieuwblik. De nadruk ligt op het helder presenteren van specialistische diensten, zoals hulpaarding, diepte-aarding en het uitvoeren van metingen, gekoppeld aan een sterke lokale zichtbaarheid in de regio.\n\nDe website fungeert als een betrouwbaar digitaal kanaal voor zowel particulieren als bedrijven in heel West-Friesland. Door technische informatie over aarding en de NEN-1010 norm helder te presenteren, wordt vertrouwen opgebouwd en de drempel verlaagd om contact op te nemen.\n\nMet zwevende contactknoppen, directe offerte-aanvragen en geïntegreerde Google Reviews is de site volledig ingericht op leadgeneratie en conversie."
    }
  },
  {
    slug: "quantum-rehab-europe",
    title: "Quantum Rehab Europe",
    category: "Revalidatietechnologie",
    filterCategory: "websites",
    description: "Een innovatief digitaal platform voor wereldwijd marktleider in geavanceerde elektrische rolstoelen, met maatwerk dealerportaal en interactieve productconfiguraties.",
    tags: ["WordPress", "Elementor", "Custom Dashboard", "Maatwerk"],
    image: quantumrehabImg,
    url: "https://quantumrehab.eu",
    detail: {
      year: "2025",
      goal: "Quantum Rehab biedt hoogwaardige technologische oplossingen zoals de Edge 3, 4Front 2 en de revolutionaire iLevel-technologie. De grootste uitdaging was om deze complexe revalidatieproducten overzichtelijk en aantrekkelijk te presenteren, zowel als inspirerend uithangbord voor eindgebruikers als efficiënt hulpmiddel voor dealers en zorgprofessionals.",
      idea: "Een ijzersterke basis in WordPress, volledig opgebouwd met Elementor. Deze combinatie maakte een strak en modern design mogelijk dat perfect aansluit bij de hightech uitstraling van Quantum Rehab. Razendsnel, mobiel geoptimaliseerd en flexibel beheerbaar voor het interne team.",
      details: "Nieuwblik heeft met trots de gloednieuwe website voor Quantum Rehab ontworpen en gelanceerd. Quantum Rehab is wereldwijd marktleider in geavanceerde, op maat gemaakte elektrische rolstoelen en revalidatietechnologieën. Voor dit vooruitstrevende merk hebben wij een online platform gecreëerd dat hun focus op innovatie, prestaties en onafhankelijkheid feilloos vertaalt naar een intuïtieve digitale ervaring.\n\nVoor het internationale netwerk van distributeurs en dealers hebben we een op maat gemaakt dashboard ontwikkeld, afgeschermd met een veilige login. Binnen deze afgeschermde omgeving kunnen partners snel schakelen, specifieke handleidingen inzien en direct navigeren naar essentiële zakelijke tools. Dit maatwerk portaal stroomlijnt de communicatie en zorgt ervoor dat dealers altijd de juiste technische gegevens en ondersteuning veilig binnen handbereik hebben.\n\nDe elektrische rolstoelen van Quantum Rehab draaien om maatwerk en persoonlijke behoeften. Daarom hebben we interactieve productweergaven geïntegreerd waarbij bezoekers de verschillende modellen en geavanceerde besturingssystemen, zoals de Q-Logic 3, in detail kunnen ontdekken. Bezoekers kunnen spelen met diverse kleuropties en configuraties, wat zorgt voor een sterk visueel beeld en een verhoogde betrokkenheid bij het digitaal verkennen van hun ideale mobiliteitsoplossing.\n\nGezien de technische aard van de producten is uitgebreide documentatie cruciaal. We hebben een overzichtelijk en gebruiksvriendelijk systeem gebouwd voor alle brochures, productspecificaties en handleidingen. Gebruikers kunnen eenvoudig de nieuwste materialen vinden en downloaden, terwijl de websitebeheerders via de achterkant moeiteloos nieuwe bestanden kunnen toevoegen en beheren.\n\nMet de nieuwe website voor Quantum Rehab heeft Nieuwblik een robuust en toekomstbestendig platform neergezet. Het combineert een prachtig, modern design met diepgaande technische functionaliteiten. De naadloze integratie van het maatwerk dashboard, de uitgebreide productweergaven en het gebruiksgemak van WordPress en Elementor maken deze website tot een krachtig instrument voor zowel Quantum Rehab als hun wereldwijde netwerk."
    },
    credits: {
      intro: "Mede mogelijk gemaakt door",
      name: "Roy Kooiman",
      company: "verbeterjewebsite.nl",
      url: "https://www.verbeterjewebsite.nl"
    }
  },
  {
    slug: "pride-mobility-europe",
    title: "Pride Mobility Europe",
    category: "Mobiliteit & Healthcare",
    filterCategory: "websites",
    description: "Een compleet nieuwe digitale ervaring voor het toonaangevende mobiliteitsmerk, met maatwerk dashboard, beveiligde login en interactieve productweergaven.",
    tags: ["WordPress", "Elementor", "Custom Dashboard", "Maatwerk"],
    image: pridemobilityImg,
    url: "https://www.pridemobility.eu",
    detail: {
      year: "2025",
      goal: "Pride Mobility zocht een schaalbare oplossing die eenvoudig te beheren was, maar tegelijkertijd geavanceerde functionaliteiten kon herbergen: een afgeschermde omgeving voor gebruikers, gedetailleerde productweergaven en een efficiënte manier om productinformatie te delen met hun internationale netwerk.",
      idea: "WordPress als robuust fundament, gecombineerd met de flexibiliteit van Elementor om de ontwerpvrijheid te maximaliseren zonder in te leveren op laadsnelheid of mobiele responsiviteit. Het beheerteam kan zelf eenvoudig aanpassingen doorvoeren, terwijl lay-out en vormgeving intact blijven.",
      details: "Nieuwblik is ongelooflijk trots op de lancering van de gloednieuwe website voor Pride Mobility Europe. Als toonaangevend merk in de mobiliteitsbranche had Pride Mobility een online platform nodig dat hun innovatieve producten perfect weerspiegelt en maximale gebruiksvriendelijkheid biedt voor zowel de eindgebruiker als hun dealernetwerk.\n\nEen van de kernonderdelen van dit project was de ontwikkeling van een speciaal op maat gemaakt dashboard, gekoppeld aan een strak geconfigureerde login-omgeving. Via dit portaal kunnen ingelogde gebruikers efficiënt navigeren door een afgeschermde omgeving, ingericht voor specifieke klant- of dealerbehoeften. Het stroomlijnt de achterkant van de website en zorgt ervoor dat gevoelige of exclusieve informatie veilig en overzichtelijk wordt gepresenteerd.\n\nOmdat de mobiliteitsscooters en rolstoelen van Pride Mobility sterk leunen op persoonlijk design en comfort, hebben we een interactieve module geïntegreerd waarmee bezoekers de producten in verschillende kleuropties kunnen bekijken. Dit geeft de bezoeker direct een realistisch beeld van het gewenste product in de gewenste stijl, wat de betrokkenheid op de website enorm verhoogt.\n\nDaarnaast hebben we een geavanceerd systeem voor brochures en productspecificaties ontwikkeld. Bezoekers kunnen nu moeiteloos de nieuwste digitale brochures inzien en downloaden. Het systeem is zo ingericht dat beheerders zeer eenvoudig nieuwe documentatie kunnen toevoegen, zodat de informatie altijd accuraat en up-to-date blijft.\n\nMet de lancering heeft Nieuwblik een platform opgeleverd dat technologische innovatie naadloos combineert met een subliem, gebruiksvriendelijk design. De combinatie van Elementor, het robuuste maatwerk dashboard, de handige login-functies en de interactieve productfunctionaliteiten zorgt voor een online ervaring die perfect aansluit bij de hoge standaarden van Pride Mobility."
    },
    credits: {
      intro: "Mede mogelijk gemaakt door",
      name: "Roy Kooiman",
      company: "verbeterjewebsite.nl",
      url: "https://www.verbeterjewebsite.nl"
    }
  },
  {
    slug: "puur-in-harmonie",
    title: "Puur in Harmonie",
    category: "Holistische Salon",
    filterCategory: "websites",
    description: "Digitale rust en balans voor een holistische salon. Een minimalistische ervaring die even ontspannend is als de behandeling zelf.",
    tags: ["Web Design", "Wellness", "E-commerce", "Stripe"],
    image: puurCaseImg,
    url: "https://www.puurinharmonie.nl",
    gallery: [puurCase1Img],
    detail: {
      year: "2026",
      goal: "De eigenaresse, Heleen, zocht een online vertaling van haar fysieke salon. Het doel was een platform dat bezoekers direct in de juiste sfeer brengt en professionaliteit uitstraalt.",
      idea: "Een 'Mobile First' aanpak met een minimalistisch designpalet van zandtinten, zacht groen en veel witruimte. We gebruikten elegante serif-lettertypes voor een luxe uitstraling.",
      details: "Voor Puur in Harmonie creëerden we een digitale ervaring die rust en balans ademt. De oude situatie miste de visuele rust en technische finesse voor mobiele apparaten.\n\nWe realiseerden een razendsnelle frontend die naadloos schaalt van smartphone tot desktop. Met een naadloze Stripe-integratie voor de webshop kunnen klanten nu eenvoudig online bestellen. Het resultaat is een stijging in online boekingen en een website die perfect aansluit bij Heleen's visie: professioneel, warm en toegankelijk."
    }
  },
  {
    slug: "benoted",
    title: "BeNoted",
    category: "Social Media Agency (Financiële Sector)",
    filterCategory: "websites",
    description: "High-performance platform voor financiële marketing met AI-native development, enterprise-grade beveiliging en internationale schaalbaarheid.",
    tags: ["Web Development", "AI-Native", "Fintech", "Marketing"],
    image: benotedImg,
    url: "https://benoted.nl",
    detail: {
      year: "2025 - 2026",
      goal: "De architectuur van de website is ontworpen om drie strategische doelen te ondersteunen: High-Intent Leadgeneratie voor verkeer uit campagnes met meer dan 100 miljoen weergaven en 12.000 leads. Internationalisering & Recruitment voor de expansie naar Bangalore (India) door middel van geautomatiseerde recruitment-funnels. Autoriteit door 'Social Proof' via een razendsnelle gebruikerservaring die de technische competentie van het bureau onderstreept.",
      idea: "De visuele identiteit volgt een 'Trust meets Modernity' filosofie, essentieel voor de financiële doelgroep. Een strategische combinatie van Inter (voor leesbaarheid en data) en Plus Jakarta Sans (voor een moderne, geometrische uitstraling). Een 'Clean Corporate' esthetiek met veel witruimte die rust en controle uitstraalt, terwijl de mobile-first opzet inspeelt op het snelle consumptiegedrag van social media gebruikers.",
      details: "Dit project is een schoolvoorbeeld van AI-Native Development, gebouwd voor snelheid en schaalbaarheid. Met Lovable's AI-gestuurde development is een Single Page Application (SPA) gerealiseerd die een app-achtige ervaring biedt zonder laadtijden bij navigatie.\n\nVoor maximale veiligheid is gekozen voor Supabase met Row Level Security (RLS) om klantdata hermetisch te beveiligen. Edge Functions zorgen voor server-side tracking, essentieel om conversies nauwkeurig te meten in een privacy-first wereld (AVG).\n\nDe financiële sector kampt met een dilemma: de noodzaak voor betrouwbaarheid botst vaak met de snelheid van moderne media. BeNoted dicht dit gat als specialistisch bureau. De uitdaging voor dit project was het creëren van een digitaal platform dat institutionele veiligheid (zoals vereist door banken) naadloos combineert met creatieve innovatie.\n\nMet benoted.nl heeft BeNoted een platform dat klaar is voor de toekomst. De combinatie van AI-ontwikkelkracht en enterprise-grade beveiliging maakt het mogelijk om wereldwijd op te schalen zonder in te leveren op de strenge eisen van de financiële markt."
    }
  },
  {
    slug: "danique-kwakman",
    title: "Danique Kwakman",
    category: "Orthomoleculaire Therapie",
    filterCategory: "websites",
    description: "Holistische gezondheidswebsite gericht op hormoonbalans, darmgezondheid en energie optimalisatie.",
    tags: ["Web Design", "Gezondheid", "Therapie"],
    image: daniquekwakmanImg,
    url: "https://daniquekwakman.nl",
    detail: {
      year: "2023",
      goal: "Het doel was om een digitale vertaling te maken van Danique haar holistische benadering. De website moest niet alleen informatief zijn, maar ook een gevoel van rust, balans en professionaliteit uitstralen naar potentiële cliënten.",
      idea: "We hebben gekozen voor een 'luxury minimalism' benadering. Door gebruik te maken van veel witruimte, zachte natuurlijke tinten en hoogwaardige typografie, weerspiegelt de site de rust die een cliënt ervaart tijdens een sessie. De navigatie is intuïtief gehouden om de drempel voor het maken van een afspraak zo laag mogelijk te maken.",
      details: "Voor Danique Kwakman hebben we een complete digitale transformatie gerealiseerd. Van een initieel concept tot een volledig geoptimaliseerd platform. De uitdaging lag in het combineren van de wetenschappelijke kant van orthomoleculaire therapie met de persoonlijke, warme aanpak van Danique. \n\nHet resultaat is een website die als een online visitekaartje fungeert, maar ook direct converteert door slimme plaatsing van call-to-actions en een heldere dienstenstructuur. We hebben de focus gelegd op snelle laadtijden en een vlekkeloze ervaring op mobiele apparaten, aangezien de meeste cliënten via social media op de site terechtkomen."
    }
  },
  {
    slug: "erica-van-dijk",
    title: "Erica van Dijk",
    category: "HR Interim & Advies",
    filterCategory: "websites",
    description: "Professionele website voor HR interim manager en adviseur met focus op expertise en vertrouwen.",
    tags: ["Web Design", "HR", "Zakelijke Diensten"],
    image: ericavandijkImg,
    url: "https://ericavandijk.nl",
    detail: {
      year: "2024",
      goal: "Het neerzetten van een krachtig online platform dat de jarenlange expertise van Erica in HR interim management onderstreept en tegelijkertijd herkenbaar en benaderbaar blijft.",
      idea: "De focus lag op persoonlijke branding. Door gebruik te maken van professionele fotografie en een strakke, zakelijke kleurstelling met subtiele accenten, straalt de website direct autoriteit en betrouwbaarheid uit.",
      details: "Erica van Dijk zocht een website die haar professionaliteit in de HR-sector kon dragen. We hebben een maatwerk oplossing geboden waarbij haar diensten helder worden gepresenteerd en haar ervaring direct zichtbaar is. \n\nHet platform is volledig geoptimaliseerd voor zoekmachines (SEO) en biedt een naadloze ervaring voor bedrijven die op zoek zijn naar tijdelijke HR ondersteuning op hoog niveau."
    }
  },
  {
    slug: "bushido-shop",
    title: "Bushido Shop",
    category: "E-commerce",
    filterCategory: "websites",
    description: "E-commerce platform voor Japanse vechtsportartikelen en authentieke culturele items.",
    tags: ["E-commerce", "Web Design", "Branding"],
    image: bushidoshopImg,
    url: "https://bushidoshop.nl",
    detail: {
      year: "2023",
      goal: "Het creëren van een moderne webshop die de Japanse vechtkunstcultuur eer aandoet en tegelijkertijd een vlekkeloze e-commerce ervaring biedt voor een breed publiek.",
      idea: "Een minimalistisch design geïnspireerd op Japanse esthetiek, gecombineerd met krachtige e-commerce functionaliteiten. Focus op productpresentatie en een razendsnel afrekenproces.",
      details: "Voor Bushido Shop hebben we de volledige online identiteit herzien. De uitdaging was om een grote hoeveelheid producten overzichtelijk te presenteren zonder dat de sfeer van de vechtsport verloren ging. \n\nMet een op maat gemaakt filtersysteem en een geoptimaliseerd checkout-traject hebben we de conversie significant weten te verhogen."
    }
  },
  {
    slug: "carbon6",
    title: "Carbon6",
    category: "Vastgoed",
    filterCategory: "websites",
    description: "Modern vastgoed platform met geavanceerde zoekfunctie en kamer browse features.",
    tags: ["Web Development", "Vastgoed", "UI/UX"],
    image: carbon6Img,
    url: "https://carbon6.nl",
    detail: {
      year: "2024",
      goal: "De vastgoedmarkt in Enschede en ver daarbuiten ontsluiten middels een platform dat zowel voor huurders als beheerders extreem efficiënt werkt.",
      idea: "Een 'user-first' interface waarbij het zoeken en vinden van woonruimte centraal staat. Door gebruik te maken van slimme kaarten en filters wordt het aanbod direct relevant gepresenteerd.",
      details: "Het project voor Carbon6 vroeg om een technische hoogstandje. We hebben een platform gebouwd dat enorme hoeveelheden data razendsnel verwerkt. \n\nDe visuele stijl is modern en strak gehouden, passend bij de doelgroep van ambitieuze studenten en starters. Het resultaat is een platform dat rust uitstraalt in een vaak chaotische markt."
    }
  },
  {
    slug: "casper-nieskens-pt",
    title: "Casper Nieskens PT",
    category: "Personal Training",
    filterCategory: "websites",
    description: "Professioneel fitness coaching platform met gepersonaliseerde trainingsprogramma's.",
    tags: ["Web Design", "Fitness", "Branding"],
    image: caspernieskensptImg,
    url: "https://caspernieskenspt.com",
    detail: {
      year: "2024",
      goal: "Casper positioneren als de expert op het gebied van personal training en coaching door zijn passie en resultaten visueel tastbaar te maken voor een nieuwe doelgroep.",
      idea: "Een dynamisch design dat energie en beweging uitstraalt. Door het gebruik van video-content en krachtige actie-shots krijgt de bezoeker direct een gevoel bij de trainingen van Casper.",
      details: "Voor Casper Nieskens hebben we een website ontwikkeld die meer is dan een digitaal portfolio. Het is een conversie-machine. \n\nBezoekers worden via een helder pad geleid van kennismaking naar het boeken van hun eerste sessie. De integratie met zijn coaching tools zorgt voor een naadloze workflow voor zowel Casper als zijn cliënten."
    }
  },
  {
    slug: "edventure-boats",
    title: "Edventure Boats",
    category: "Avontuur & Toerisme",
    filterCategory: "websites",
    description: "Water avontuur boekingsplatform voor spannende boot ervaringen.",
    tags: ["Web Design", "Boekingssysteem", "Toerisme"],
    image: edventureboatsImg,
    url: "https://edventureboats.com",
    detail: {
      year: "2023",
      goal: "Het vakantiegevoel direct oproepen op het scherm en het boekingsproces voor een bootavontuur net zo soepel maken als de tocht zelf.",
      idea: "Gebruik van panoramische beelden en een levendig kleurenpalet. Het boekingssysteem is volledig geïntegreerd en geoptimaliseerd voor mobiel gebruik, zodat mensen letterlijk aan de kade kunnen boeken.",
      details: "Edventure Boats zocht een partner die de opwinding van een dag op het water kon vertalen naar het web. We hebben een website gecreëerd die draait om beleving. \n\nSinds de lancering is het aantal directe online boekingen aanzienlijk gestegen, wat de efficiëntie voor de organisatie enorm heeft verbeterd."
    }
  },
  {
    slug: "esveld-installatie",
    title: "Esveld Installatie",
    category: "Installatiediensten",
    filterCategory: "websites",
    description: "Professionele HVAC en installatiediensten website met klant portal.",
    tags: ["Web Design", "Dienstverlening", "Contact Formulieren"],
    image: esveldinstallatieImg,
    url: "https://esveldinstallatie.nl",
    detail: {
      year: "2024",
      goal: "Een traditioneel bedrijf transformeren naar een digitaal modern platform waarbij serviceaanvragen en projecten centraal staan.",
      idea: "Focus op heldere communicatie en betrouwbaarheid. Door de projecten visueel te ondersteunen met voor-en-na situaties, wordt de kwaliteit van het werk direct duidelijk.",
      details: "Esveld Installatie had behoefte aan een heldere online structuur voor hun diverse diensten. We hebben een modulaire website gebouwd die meegroeit met hun aanbod. \n\nHet contact- en offerteproces is volledig gestroomlijnd, waardoor de interne doorlooptijd van lead naar klus is verkort."
    }
  },
  {
    slug: "interieur-studio-laan",
    title: "Interieur Studio Laan",
    category: "Interieur Design",
    filterCategory: "websites",
    description: "Elegante interieur design showcase met portfolio galerij en consultatieaanvraag.",
    tags: ["Web Design", "Interieur Design", "Portfolio"],
    image: interieurstudiolaan,
    url: "https://interieurstudiolaan.nl",
    detail: {
      year: "2023",
      goal: "Een esthetisch hoogstandje creëren dat de verfijnde smaak van Interieur Studio Laan direct weerspiegelt naar potentiële klanten.",
      idea: "De website als canvas. Veel 'negative space' en een focus op high-end interieurfotografie. De typografie is subtiel maar spreekt boekdelen over de kwaliteit van de studio.",
      details: "Interieurprojecten draaien om gevoel en detail. Dat moest de website ook uitstralen. We hebben gekozen voor een rustige maar krachtige interactie-laag. \n\nHet portfolio is op een unieke manier vormgegeven zodat bezoekers echt door de projecten heen 'wandelen'. Een platform dat net zo doordacht is als de interieurs zelf."
    }
  },
  {
    slug: "karate-school-cor-slok",
    title: "Karate School Cor Slok",
    category: "Vechtsport",
    filterCategory: "websites",
    description: "Dynamische karateschool website met lesroosters en leden portal.",
    tags: ["Web Design", "Sport", "Community"],
    image: karateschoolcorslokImg,
    url: "https://karateschoolcorslok.nl",
    detail: {
      year: "2024",
      goal: "De lange traditie van de karateschool moderniseren en de drempel voor nieuwe leden verlagen door een heldere en uitnodigende presentatie.",
      idea: "Balans tussen actie en informatie. De website toont de dynamiek van de dojo terwijl alle praktische informatie over lestijden en locaties direct vindbaar is.",
      details: "Karateschool Cor Slok had een website nodig die zowel de jeugd als volwassenen aanspreekt. We hebben een community-gevoel gecreëerd door het inzetten van sprekende beelden van eigen leden. \n\nHet inschrijfproces is nu volledig digitaal, wat de administratieve last voor de school heeft gehalveerd."
    }
  },
  {
    slug: "kyodai-originals",
    title: "Kyodai Originals",
    category: "Galerie voor Japanse Zwaarden & Antiek",
    filterCategory: "websites",
    description: "Een digitale galerie voor museumwaardige Japanse zwaarden en wapenrustingen, gebouwd rondom authenticiteit, vertrouwen en verhalen over herkomst.",
    tags: ["E-commerce", "Galerie", "Authenticatie", "Luxe Branding"],
    image: kyodaioriginalsImg,
    url: "https://www.kyodaioriginals.nl",
    detail: {
      year: "2023",
      goal: "Kyodai Originals, een Amsterdamse galerie van eigenaar Cor Slok, verhandelt museumwaardige katana's, wakizashi's, tanto's en andere authentieke Japanse zwaarden en wapenrustingen, met stukken tot boven de 48.000 euro. Het hoofddoel van de website is het overbrengen van vertrouwen bij een kritisch publiek van verzamelaars: elk stuk moet overtuigend gepresenteerd worden inclusief de onafhankelijke NBTHK-certificering en levenslange authenticiteitsgarantie die Kyodai biedt. Daarnaast moest de site ruimte bieden voor de verhalen achter de stukken, zodat bezoekers niet alleen een object kopen, maar ook de geschiedenis en het vakmanschap erachter leren kennen.",
      idea: "Het digitale concept is opgezet als een 'gallery-style' showroom in plaats van een traditionele webshop: rustige witruimte, grootformaat productfotografie en subtiele Japanse typografische accenten die de herkomst van de stukken onderstrepen. Elk zwaard wordt behandeld als een op zichzelf staand kunstwerk, met heldere informatie over smid, periode en certificering. Een apart 'Geschiedenis & Tradities' blog voegt diepgang toe voor de meer onderzoekende verzamelaar, terwijl de nadruk op persoonlijk contact (telefoon en WhatsApp) en een besloten showroom in Amsterdam de kleinschalige, vertrouwde aanpak van Cor Slok weerspiegelt.",
      details: "Voor Kyodai Originals hebben we een online galerie gebouwd die recht doet aan de twee decennia ervaring van eigenaar Cor Slok in het selecteren van authentieke Japanse zwaarden en wapenrustingen, rechtstreeks ingekocht via Japanse veilingen, handelaren en privécollecties.\n\nOmdat de doelgroep bestaat uit serieuze verzamelaars en investeerders die aanzienlijke bedragen investeren, stond het opbouwen van vertrouwen centraal in het ontwerp. De NBTHK-, NBSK- en NTHK-certificeringen en de levenslange authenticiteitsgarantie zijn prominent verwerkt in zowel de productpagina's als de 'Why Kyodai' sectie, samen met de museale verpakking, volledige verzekering en wereldwijde verzending die bij elke aankoop horen.\n\nHet resultaat is een website die evenveel weg heeft van een digitale galerie als van een webshop: een plek waar liefhebbers rustig door het actuele aanbod kunnen bladeren, zich kunnen verdiepen in de geschiedenis van individuele stukken, en via een persoonlijke lijn contact kunnen opnemen voor een bezichtiging of aankoop op basis van vertrouwen in plaats van een anoniem afrekenproces."
    }
  },
  {
    slug: "lashlution",
    title: "Lashlution",
    category: "Beauty & Wellness",
    filterCategory: "websites",
    description: "Premium lash extensions en beauty services boekingsplatform.",
    tags: ["Web Design", "Beauty", "Boekingssysteem"],
    image: lashlutionImg,
    url: "https://lashlution.nl",
    detail: {
      year: "2024",
      goal: "Lashlution positioneren als dé autoriteit op het gebied van wimperbehandelingen door een website die perfectie en luxe uitstraalt.",
      idea: "Een zacht maar modern kleurenpalet gecombineerd met vlijmscherpe detailfoto's. Het online boekingsportaal staat centraal voor optimaal gebruiksgemak.",
      details: "In de beauty-industrie is beeld alles. Voor Lashlution hebben we een visueel georiënteerde site gebouwd waarbij de kwaliteit van de behandelingen voor zich spreekt. \n\nHet resultaat is een bijna volledig geautomatiseerde agenda door een feilloze integratie van het boekingssysteem."
    }
  },
  {
    slug: "mhb-techniek",
    title: "MHB Techniek",
    category: "Technische Diensten",
    filterCategory: "websites",
    description: "Smart home technologie oplossingen met service boeking en consultatie features.",
    tags: ["Web Development", "Technologie", "Dienstverlening"],
    image: mhbtechniekImg,
    url: "https://mhbtechniek.nl",
    detail: {
      year: "2024",
      goal: "Complexe technische oplossingen eenvoudig en begeerlijk maken voor de consument door een focus op voordelen en automatisering.",
      idea: "Een 'tech-forward' design dat aansluit bij de diensten die MHB Techniek levert. Veel interactieve elementen die de werking van hun smart-home oplossingen uitleggen.",
      details: "MHB Techniek zocht een partner die hun innovatieve karakter kon vertalen naar het web. We hebben een platform gebouwd dat fungeert als kenniscentrum en verkoopkanaal in één. \n\nSinds de lancering is de conversie op consultatie-aanvragen verdubbeld."
    }
  },
  {
    slug: "feitsma-dakwerken",
    title: "Feitsma Dakwerken",
    category: "Dakdekkersdiensten",
    filterCategory: "websites",
    description: "Premium dakdekkersdiensten website met project showcase en consultatieaanvraag.",
    tags: ["Web Design", "Bouw", "Dienstverlening"],
    image: feitsmadakwerkenImg,
    url: "https://feitsmadakwerken.nl",
    detail: {
      year: "2024",
      goal: "Het vertrouwen van de klant winnen in een concurrerende markt door vakmanschap en transparantie centraal te stellen.",
      idea: "Een eerlijke, robuuste presentatie met een sterke nadruk op gerealiseerde projecten en reviews. De offertetool is zo simpel mogelijk gehouden.",
      details: "Voor Feitsma Dakwerken stond lokale vindbaarheid op één. De website is technisch zo ingericht dat ze optimaal scoren in hun werkgebied. \n\nHet resultaat is een constante stroom van aanvragen via de website, waardoor ze minder afhankelijk zijn van externe lead-platforms."
    }
  },
  {
    slug: "green-profit",
    title: "Green Profit",
    category: "Duurzame Oplossingen",
    filterCategory: "websites",
    description: "Duurzaam bouwen en energie oplossingen platform met uitgebreid dienstenaanbod.",
    tags: ["Web Design", "Duurzaamheid", "Diensten"],
    image: greenProfitImg,
    url: "https://green-profit.nl",
    detail: {
      year: "2023",
      goal: "Complexe duurzaamheidsvraagstukken begrijpelijk maken en mensen motiveren om te investeren in een groene toekomst.",
      idea: "Een verfrissend, 'groen' design dat positiviteit uitstraalt. Door gebruik te maken van iconen en heldere menu-structuren worden bezoekers snel naar de juiste informatie geleid.",
      details: "Green Profit is een bedrijf met een missie. Dat moest de website ademen. We hebben een platform gecreëerd dat zowel informeert als inspireert. \n\nDoor integratie van een kennisbank is de website een autoriteit geworden op het gebied van duurzaam bouwen."
    }
  },
  {
    slug: "vdv-tuinen",
    title: "VdV Tuinen",
    category: "Tuinaanleg & Tuinen",
    filterCategory: "websites",
    description: "Professioneel tuinontwerp en tuinaanlegdiensten met portfolio showcase.",
    tags: ["Web Design", "Tuinaanleg", "Portfolio"],
    image: vdvtuinenImg,
    url: "https://vdvtuinen.nl",
    detail: {
      year: "2024",
      goal: "De buitenruimte als verlengstuk van het interieur presenteren en mensen inspireren tot een complete tuinmetamorfose.",
      idea: "Gebruik van grote visuals en een kleurenpalet dat aansluit bij de natuur. De projecten worden op een manier gepresenteerd dat de bezoeker zichzelf al in die tuin ziet zitten.",
      details: "Voor VdV Tuinen lag de nadruk op het portfolio. We hebben een systeem gebouwd waarbij projecten eenvoudig door henzelf geüpdatet kunnen worden met nieuwe seizoensfoto's. \n\nDit zorgt voor een website die altijd relevant en actueel blijft."
    }
  },
  {
    slug: "rrs-royal",
    title: "RRS Royal",
    category: "Bouwpartner",
    filterCategory: "websites",
    description: "Complete bouwpartnership website met projectmanagement features.",
    tags: ["Web Design", "Bouw", "Zakelijk"],
    image: rrsroyalImg,
    url: "https://rrsroyal.nl",
    detail: {
      year: "2024",
      goal: "Een complex bouwproces overzichtelijk en transparant presenteren naar opdrachtgevers en partners.",
      idea: "Strak, krachtig en no-nonsense. Precies zoals de werkwijze van RRS Royal. De navigatie is gericht op snelle toegang tot deelprojecten en contactpersonen.",
      details: "RRS Royal werkt aan grote projecten. De website moest op datzelfde niveau communiceren. We hebben een platform gebouwd dat de omvang van hun werkzaamheden eer aandoet. \n\nDoor een afgeschermd partner-gedeelte zorgt de website ook voor een betere samenwerking achter de schermen."
    }
  }
];
