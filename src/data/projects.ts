import benotedImg from "@/assets/projects/benoted.nl.jpg";
import bushidoshopImg from "@/assets/projects/bushidoshop.nl.png";
import carbon6Img from "@/assets/projects/carbon6.nl.png";
import ericavandijkImg from "@/assets/projects/ericavandijk.nl.png";
import daniquekwakmanImg from "@/assets/projects/daniquekwakman.nl.png";
import caspernieskensptImg from "@/assets/projects/caspernieskenspt.nl.png";
import edventureboatsImg from "@/assets/projects/edventureboats.nl.png";
import esveldinstallatieImg from "@/assets/projects/esveldinstallatie.nl.png";
import interieurstudiolaan from "@/assets/projects/interieurstudiolaan.nl.png";
import karateschoolcorslokImg from "@/assets/projects/karateschoolcorslok.nl.png";
import kyodaioriginalsImg from "@/assets/projects/kyodaioriginals.nl.png";
import lashlutionImg from "@/assets/projects/lashlution.nl.png";
import mhbtechniekImg from "@/assets/projects/mhbtechniek.nl.png";
import feitsmadakwerkenImg from "@/assets/projects/feitsmadakwerken.nl.png";
import greenProfitImg from "@/assets/projects/green-profit.nl.png";
import vdvtuinenImg from "@/assets/projects/vdvtuinen.nl.png";
import rrsroyalImg from "@/assets/projects/rrsroyal.nl.png";

export interface ProjectDetail {
  year: string;
  goal: string;
  idea: string;
  details: string;
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
}

export const projects: Project[] = [
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
    category: "E-commerce",
    filterCategory: "websites",
    description: "Gespecialiseerd e-commerce platform voor authentieke Japanse verzamelobjecten.",
    tags: ["E-commerce", "Product Showcase", "Branding"],
    image: kyodaioriginalsImg,
    url: "https://kyodaioriginals.nl",
    detail: {
      year: "2023",
      goal: "Een niche markt voorzien van een premium webshop die de exclusiviteit van de producten benadrukt en vertrouwen wekt bij verzamelaars wereldwijd.",
      idea: "Een 'gallery-style' webshop waarbij elk item als een kunstwerk wordt gepresenteerd. Focus op storytelling rondom de herkomst van de objecten.",
      details: "Kyodai Originals vereiste een platform dat wereldwijde verzending en diverse valuta naadloos kon afhandelen. \n\nWe hebben een robuust maar elegant systeem gebouwd dat de unieke inventory beheert en tegelijkertijd een luxe ervaring biedt aan de kritische verzamelaar."
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
