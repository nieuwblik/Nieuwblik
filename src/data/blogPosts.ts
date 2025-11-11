export interface BlogPost {
  slug: string;
  title: {
    nl: string;
    en: string;
  };
  excerpt: {
    nl: string;
    en: string;
  };
  content: {
    nl: string;
    en: string;
  };
  date: string;
  readingTime: number;
  image?: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "waarom-snelle-websites-meer-verkopen",
    image: "/src/assets/blog/snelle-websites.jpg",
    title: {
      nl: "Snelle websites verkopen 2x meer - waarom laadtijd cruciaal is",
      en: "Fast websites sell 2x more - why loading time is crucial"
    },
    excerpt: {
      nl: "Ontdek waarom elke seconde telt en hoe website snelheid direct invloed heeft op je omzet en klanttevredenheid.",
      en: "Discover why every second counts and how website speed directly impacts your revenue and customer satisfaction."
    },
    content: {
      nl: `*Leestijd: 5 minuten*

Je website laadt te langzaam. En dat kost je duizenden euro's per maand. 

Elke seconde dat een bezoeker wacht, is een seconde dichter bij het sluiten van de tab. **53% van mobiele bezoekers vertrekt na 3 seconden.** De vraag is niet of je bezoekers verliest, maar hoeveel omzet je misloopt.

Bij Nieuwblik bouwen we websites die niet alleen mooi zijn, maar ook **razendsnel** laden. Want wat heb je aan prachtig design als niemand blijft wachten?

## Inhoudsopgave

1. [De harde cijfers: snelheid = geld](#de-harde-cijfers)
2. [Waarom snelheid zo cruciaal is](#waarom-snelheid-cruciaal-is)
3. [De Nieuwblik aanpak voor snelle websites](#de-nieuwblik-aanpak)
4. [Resultaat: meer verkoop, hogere conversie](#resultaat)

---

## De harde cijfers: snelheid = geld {#de-harde-cijfers}

**Google's bevindingen spreekt boekdelen:**
- 53% van mobiele bezoekers verlaat een website als deze langer dan 3 seconden laadt
- Elke seconde vertraging leidt tot **7% minder conversies**
- Voor een e-commerce site met €100.000 omzet per dag betekent 1 seconde vertraging **€2,5 miljoen verlies per jaar**

**Amazon's data is nog explicieter:**

Amazon ontdekte dat elke 100ms vertraging hun verkoop met **1% verminderde**. Voor een bedrijf van hun omvang gaat dit om miljarden.

**Walmart's experiment toonde direct resultaat:**

Door hun laadtijd met 1 seconde te verbeteren, zag Walmart:
- **2% hogere conversie**
- **1% hogere omzet** per bezoeker

> **Key Takeaway:** Snelheid is geen technisch detail. Het is een directe omzetfactor. Elke seconde telt letterlijk mee in je winst.

---

## Waarom snelheid zo cruciaal is {#waarom-snelheid-cruciaal-is}

### 1. Eerste indruk beslist

Je hebt **50 milliseconden** om een eerste indruk te maken. Letterlijk een oogwenk. 

Als je site langzaam laadt, is dat spel al verloren voordat de bezoeker je content zelfs maar ziet.

### 2. Gebruikerservaring = vertrouwen

Snelle websites voelen intuïtief **betrouwbaarder** en **professioneler**. 

Langzame sites communiceren onbewust: *"Dit bedrijf heeft zijn zaken niet op orde."*

### 3. SEO voordeel = gratis verkeer

**Google gebruikt laadtijd als ranking factor.** 

Snellere sites krijgen voorrang in zoekresultaten. Dit betekent meer organisch verkeer zonder extra advertentie-uitgaven.

### 4. Mobiele gebruikers zijn veeleisend

Met meer dan **60% van het webverkeer via mobiel**, is snelheid belangrijker dan ooit. 

Mobiele verbindingen zijn vaak langzamer, dus elke kilobyte telt.

> **Key Takeaway:** Snelheid bepaalt of bezoekers je vertrouwen, of ze blijven, en of ze converteren. Het is de fundering van je online succes.

---

## De Nieuwblik aanpak voor snelle websites {#de-nieuwblik-aanpak}

Wij bouwen websites die **razendsnel** laden door:

**1. Image optimization met WebP formaat**
- Kleinere bestandsgroottes zonder kwaliteitsverlies
- Lazy loading: afbeeldingen laden alleen wanneer nodig

**2. Code splitting voor optimale performance**
- Alleen de code laden die nodig is voor de huidige pagina
- Geen onnodige scripts die je website vertragen

**3. CDN implementatie voor snelle content delivery**
- Content geleverd vanaf de dichtstbijzijnde server
- Wereldwijd snelle laadtijden

**4. Performance monitoring bij elke deployment**
- Continue monitoring van laadtijden
- Proactieve optimalisatie bij performance dips

> **Key Takeaway:** Snelheid is geen eenmalige optimalisatie. Het is een continue focus die bij elke stap van de ontwikkeling meegenomen wordt.

---

## Resultaat: meer verkoop, hogere conversie {#resultaat}

**Wat betekent een snelle website voor jouw bedrijf?**

- **Hogere conversie:** Meer bezoekers die actie ondernemen
- **Betere SEO:** Hogere rankings in Google
- **Meer omzet:** Directe impact op je bottom line
- **Professionelere uitstraling:** Vertrouwen vanaf de eerste seconde

### Klaar voor een snelle website die écht verkoopt?

Ontdek wat een **razendsnel website** voor jouw bedrijf kan betekenen. 

**[Start je Project →](/start-je-project)**`,
      en: "Your website is loading too slowly. And it's costing you thousands of euros per month..."
    },
    date: "2025-01-20",
    readingTime: 5
  },
  {
    slug: "van-bezoeker-naar-klant-conversie-optimalisatie",
    image: "/src/assets/blog/conversie-optimalisatie.jpg",
    title: {
      nl: "Van 2% naar 10% conversie - zo zet je bezoekers om in klanten",
      en: "From 2% to 10% conversion - how to turn visitors into customers"
    },
    excerpt: {
      nl: "Leer de essentiële principes van conversie-optimalisatie en hoe je meer bezoekers omzet in betalende klanten.",
      en: "Learn the essential principles of conversion optimization and how to turn more visitors into paying customers."
    },
    content: {
      nl: `*Leestijd: 6 minuten*

Je website krijgt verkeer, maar conversies blijven achter. **97% van je bezoekers vertrekt zonder actie.** Herkenbaar?

Je bent niet alleen. De meeste websites converteren slechts 2-3% van hun bezoekers. Dat betekent dat bijna al je potentiële klanten verdwijnt zonder iets te doen.

Bij Nieuwblik optimaliseren we websites met **bewezen strategieën** die conversie meetbaar verhogen. Geen giswerk, maar data-gedreven design beslissingen die resultaat opleveren.

## Inhoudsopgave

1. [Wat is conversie-optimalisatie?](#wat-is-cro)
2. [De anatomie van een high-converting website](#anatomie-high-converting)
3. [De 4 conversie killers die je moet vermijden](#conversie-killers)
4. [De Nieuwblik conversie strategie](#nieuwblik-strategie)

---

## Wat is conversie-optimalisatie? {#wat-is-cro}

**Conversie-optimalisatie (CRO)** is het systematisch verbeteren van je website om meer bezoekers een gewenste actie te laten uitvoeren:

- Aankoop doen
- Formulier invullen
- Offerte aanvragen
- Nieuwsbrief inschrijven
- Contact opnemen

**Het doel:** Haal meer waarde uit je bestaande verkeer zonder meer budget aan advertenties te spenderen.

> **Key Takeaway:** CRO betekent meer omzet uit hetzelfde verkeer. Elke procent conversie-verbetering is direct zichtbaar in je resultaat.

---

## De anatomie van een high-converting website {#anatomie-high-converting}

### 1. Crystal clear value proposition

Binnen **5 seconden** moet een bezoeker begrijpen:
- Wat je doet
- Voor wie je het doet
- Waarom zij jou moeten kiezen

**Slecht voorbeeld:**
*"Wij zijn een innovatief bedrijf dat cutting-edge oplossingen biedt."*

**Goed voorbeeld:**
*"Custom websites die 2x meer klanten genereren. Gespecialiseerd in luxury brands."*

### 2. Frictionless user experience

Elk obstakel kost je conversie:

- **Lange formulieren:** Beperk tot maximaal 3-5 velden
- **Verplichte account aanmaken:** Niet nodig voor eerste contact
- **Verwarrende navigatie:** Duidelijk pad naar conversie
- **Slow loading:** Elke seconde kost 7% conversie

### 3. Strategische call-to-actions (CTAs)

**Kenmerken van effectieve CTAs:**

1. **Action-oriented taal:** "Start nu gratis" ipv "Meer informatie"
2. **Contrast:** Opvallen met kleuren die afwijken van je basis palette
3. **Witruimte:** Genoeg ademruimte rondom de knop
4. **Boven de fold:** Primaire CTA direct zichtbaar zonder scrollen

### 4. Social proof die overtuigt

Mensen vertrouwen andere mensen meer dan merken. Implementeer:

- **Testimonials met foto en naam:** 300% effectiever dan anoniem
- **Cijfers en statistieken:** "500+ tevreden klanten" werkt beter dan "veel klanten"
- **Case studies:** Concrete resultaten
- **Logos van bekende klanten:** Vertrouwen door associatie

> **Key Takeaway:** High-converting websites maken het bezoekers makkelijk om actie te ondernemen en geven vertrouwen door social proof.

---

## De 4 conversie killers die je moet vermijden {#conversie-killers}

### 1. Onduidelijke value proposition

Als bezoekers niet begrijpen wat je doet, converteren ze niet. Simpel.

**Oplossing:** Test je homepage met de 5-seconden test. Kunnen mensen binnen 5 seconden uitleggen wat je doet?

### 2. Te veel keuzes (Choice Overload)

**Hick's Law:** Hoe meer opties, hoe moeilijker de beslissing.

Te veel CTAs, te veel producten, te veel navigatie opties = paralysis.

**Oplossing:** Focus op één primaire actie per pagina.

### 3. Gebrek aan vertrouwen

Zonder social proof, testimonials of garanties converteren mensen niet.

**Oplossing:** Voeg toe:
- Klantenreviews
- Garanties (bijv. "Niet tevreden, geld terug")
- Certificaten en awards

### 4. Technische friction

Lange laadtijden, broken links, formulier errors = conversie killer.

**Oplossing:** Test regelmatig je website op verschillende devices en verbindingen.

> **Key Takeaway:** Vermijd deze 4 killers en je conversie zal meetbaar stijgen. Elk obstakel dat je wegneemt, is winst.

---

## De Nieuwblik conversie strategie {#nieuwblik-strategie}

Wij optimaliseren websites met een **data-gedreven aanpak:**

**1. Data analyse: Waar haken bezoekers af?**
- Heatmaps en scroll tracking
- Formulier analytics
- Exit intent tracking

**2. A/B testing: We testen alles**
- Headlines en CTAs
- Button kleuren en plaatsing
- Formulier lengte en volgorde

**3. Continuous optimization: Het stopt nooit**
- Maandelijkse performance reviews
- Continue testing en iteratie
- Proactieve optimalisatie

**Resultaten die onze klanten zien:**
- **30-50% hogere conversie** binnen 3 maanden
- **Lagere cost per acquisition** door betere conversie
- **Hogere customer lifetime value** door betere eerste indruk

### Klaar om meer bezoekers om te zetten in klanten?

Ontdek hoe we jouw conversie **meetbaar kunnen verhogen** met data-gedreven optimalisatie.

**[Start een project →](/start-je-project)**`,
      en: "Your website gets traffic, but conversions lag behind. 97% of your visitors leave without taking action. Sound familiar?"
    },
    date: "2025-01-15",
    readingTime: 6
  },
  {
    slug: "seo-fundamentals-gevonden-worden",
    image: "/src/assets/blog/seo-fundamentals.jpg",
    title: {
      nl: "SEO in 2025 - hoe je gevonden wordt door je ideale klant",
      en: "SEO in 2025 - how to be found by your ideal customer"
    },
    excerpt: {
      nl: "Praktische SEO strategieën die je website hoger laten ranken in Google en meer organisch verkeer genereren.",
      en: "Practical SEO strategies that make your website rank higher in Google and generate more organic traffic."
    },
    content: {
      nl: `*Leestijd: 7 minuten*

Je website is live, maar niemand vindt hem. Je verschijnt op **pagina 3 van Google** (spoiler: daar klikt niemand). Organisch verkeer blijft uit.

Herkenbaar?

**75% van gebruikers klikt nooit verder dan pagina 1.** Als je daar niet staat, besta je niet. SEO is geen luxe, het is een zakelijke noodzaak.

Bij Nieuwblik bouwen we websites die niet alleen mooi zijn, maar ook **geoptimaliseerd voor zoekmachines vanaf dag één.**

## Inhoudsopgave

1. [Waarom SEO cruciaal is voor jouw bedrijf](#waarom-seo-cruciaal-is)
2. [De 3 pilaren van moderne SEO](#de-3-pilaren)
3. [Technische SEO: de fundering](#technische-seo)
4. [On-page SEO: content is king](#on-page-seo)
5. [De Nieuwblik SEO aanpak](#nieuwblik-seo-aanpak)

---

## Waarom SEO cruciaal is voor jouw bedrijf {#waarom-seo-cruciaal-is}

### De harde cijfers

- **75%** van gebruikers klikt nooit verder dan pagina 1
- De **top 3 resultaten** krijgen 75% van alle clicks
- Positie nummer 1 krijgt gemiddeld **28%** van alle clicks
- Organisch verkeer converteert **14% beter** dan betaalde advertenties

### ROI van SEO vs. Adverteren

**Google Ads:**
- Kost geld per click (€2-10+ per klik)
- Stopt zodra je stopt met betalen
- Kortetermijn resultaten

**SEO:**
- Kost tijd en expertise (investering vooraf)
- Blijft doorwerken na initiële inspanning
- Langetermijn compound growth

> **Key Takeaway:** SEO is de beste langetermijn investering voor duurzame groei. Betaalde advertenties stoppen zodra je budget op is. SEO blijft doorwerken.

---

## De 3 pilaren van moderne SEO {#de-3-pilaren}

### Pilaar 1: Technische SEO
De fundering. Als Google je niet kan lezen, kun je niet ranken.

### Pilaar 2: On-page SEO
Content die relevant, diepgaand en goed gestructureerd is.

### Pilaar 3: Off-page SEO
Autoriteit opbouwen via backlinks en mentions.

**Deze 3 pilaren werken samen.** Eén pilaar verwaarlozen betekent nooit ranken.

---

## Technische SEO: de fundering {#technische-seo}

Je website moet **crawlbaar en indexeerbaar** zijn. Als Google je niet kan lezen, kun je niet ranken.

**Essentiële technische elementen:**

1. **Site speed:** Target onder 2 seconden laadtijd
2. **Mobile-first:** Google indexeert primair de mobiele versie
3. **SSL certificaat (HTTPS):** Veiligheid is ranking factor
4. **Clean URL structuur:** Beschrijvend en leesbaar
5. **XML Sitemap:** Geeft Google overzicht van je paginas
6. **Robots.txt:** Geef Google instructies wat te indexeren

**Veelgemaakte fouten:**
- Broken links en 404 errors
- Duplicate content door verkeerde canonical tags
- Slow loading door ongeoptimaliseerde afbeeldingen
- Geen mobile optimization

> **Key Takeaway:** Technische SEO is de fundering. Zonder sterke fundering stort alles in, hoe mooi de rest ook is.

---

## On-page SEO: content is king {#on-page-seo}

Google wil de **beste antwoorden** tonen op zoekvragen. Jouw content moet relevant, diepgaand en goed gestructureerd zijn.

### Title tags: je belangrijkste SEO element

**Best practices:**
- **Lengte:** 50-60 karakters
- **Keywords:** Belangrijkste keyword vooraan
- **Uniek:** Elke pagina een eigen title
- **Compelling:** Moet klikbaar zijn

**Slecht voorbeeld:**
*"Home | Bedrijfsnaam"*

**Goed voorbeeld:**
*"Webdesign Bureau Amsterdam | Custom Websites in 1 Week"*

### Meta descriptions: de verkooptekst

- **Lengte:** 150-160 karakters
- **Action-oriented:** Zet aan tot klikken
- **Keywords:** Natuurlijk verwerkt
- **Unique:** Per pagina uniek

### Content kwaliteit bepaalt ranking

**Wat Google waardeert:**
- **Diepgang:** Oppervlakkige content rankt niet
- **Origineel:** Geen duplicate content
- **Actueel:** Update oude content regelmatig
- **Gebruikersfocus:** Schrijf voor mensen, niet voor robots
- **Structuur:** Gebruik H2, H3 koppen logisch

**Content checklist:**
1. Beantwoordt het de zoekvraag volledig?
2. Is het beter dan de top 3 resultaten?
3. Is het scanbaar met koppen en lijsten?
4. Bevat het voorbeelden en praktische tips?
5. Is het up-to-date en relevant?

> **Key Takeaway:** Content kwaliteit slaat alles. Google wil de beste antwoorden tonen. Als jouw content beter is dan de concurrent, ga je ranken.

---

## De Nieuwblik SEO aanpak {#nieuwblik-seo-aanpak}

Bij elk project implementeren we **vanaf dag één:**

**1. Technical SEO audit en fixes**
- Site speed optimization
- Mobile-first design
- Clean URL structuur
- XML Sitemap en robots.txt

**2. Keyword research en strategy**
- Targeting van relevante zoekwoorden
- Long-tail keyword opportunities
- Competitor analysis

**3. Optimized title tags en meta descriptions**
- Uniek per pagina
- Keyword-rich en compelling
- Optimale lengte

**4. Schema markup implementation**
- Rich snippets voor betere zichtbaarheid
- Structured data voor Google

**5. Google Search Console setup**
- Monitoring van indexatie
- Performance tracking
- Error detection

**6. Maandelijkse ranking monitoring**
- Track je posities
- Identificeer opportunities
- Continue optimalisatie

### Resultaten die onze klanten zien:

- **150-300%** meer organisch verkeer binnen 6 maanden
- **Top 3 rankings** voor belangrijkste zoekwoorden
- **Lagere cost per acquisition** door meer organisch verkeer
- **Duurzame groei** die blijft doorwerken

### Klaar om gevonden te worden?

Ontdek hoe we jouw **organische zichtbaarheid transformeren** met proven SEO strategieën.

**[Start een project →](/start-je-project)**`,
      en: "Your website is live, but nobody finds it. You appear on page 3 of Google (spoiler: nobody clicks there). Organic traffic remains absent."
    },
    date: "2025-01-10",
    readingTime: 7
  }
];
