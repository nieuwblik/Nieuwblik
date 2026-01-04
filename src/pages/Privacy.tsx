import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Shield } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { fadeUp, staggerContainer, staggerItem, easings } from "@/lib/motion";
import { companyInfo } from "@/config/company";

const Privacy = () => {
  const shouldReduceMotion = useReducedMotion();

  const getVariants = (variants: any) => {
    if (shouldReduceMotion) {
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.2 } }
      };
    }
    return variants;
  };

  const sections = [
    {
      title: "1. Algemeen",
      content: (
        <>
          <p className="text-muted-foreground">
            {companyInfo.name}, gevestigd aan {companyInfo.address.full}, is verantwoordelijk voor de verwerking van persoonsgegevens zoals weergegeven in deze privacyverklaring.
          </p>
          <p className="text-muted-foreground mt-4">
            <strong>Contactgegevens:</strong><br />
            <a href={companyInfo.address.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              {companyInfo.address.full}
            </a><br />
            KVK: {companyInfo.kvk}<br />
            BTW: {companyInfo.btw}
          </p>
        </>
      )
    },
    {
      title: "2. Persoonsgegevens die wij verwerken",
      content: (
        <>
          <p className="text-muted-foreground">
            {companyInfo.name} verwerkt uw persoonsgegevens doordat u gebruik maakt van onze diensten en/of omdat u deze zelf aan ons verstrekt. Hieronder vindt u een overzicht van de persoonsgegevens die wij verwerken:
          </p>
          <ul className="list-disc pl-6 mt-4 text-muted-foreground space-y-2">
            <li>Voor- en achternaam</li>
            <li>E-mailadres</li>
            <li>Telefoonnummer</li>
            <li>Bedrijfsnaam</li>
            <li>IP-adres</li>
            <li>Gegevens over uw activiteiten op onze website</li>
            <li>Internetbrowser en apparaat type</li>
          </ul>
        </>
      )
    },
    {
      title: "3. Waarom we gegevens nodig hebben",
      content: (
        <>
          <p className="text-muted-foreground">
            {companyInfo.name} verwerkt uw persoonsgegevens voor de volgende doelen:
          </p>
          <ul className="list-disc pl-6 mt-4 text-muted-foreground space-y-2">
            <li>Het afhandelen van uw contactaanvraag</li>
            <li>U te kunnen bellen of e-mailen indien dit nodig is om onze dienstverlening uit te kunnen voeren</li>
            <li>U te informeren over wijzigingen van onze diensten en producten</li>
            <li>Om goederen en diensten bij u af te leveren</li>
            <li>{companyInfo.name} analyseert uw gedrag op de website om daarmee de website te verbeteren en het aanbod af te stemmen op uw voorkeuren</li>
          </ul>
        </>
      )
    },
    {
      title: "4. Hoe lang we gegevens bewaren",
      content: (
        <>
          <p className="text-muted-foreground">
            {companyInfo.name} bewaart uw persoonsgegevens niet langer dan strikt nodig is om de doelen te realiseren waarvoor uw gegevens worden verzameld. Wij hanteren de volgende bewaartermijnen:
          </p>
          <ul className="list-disc pl-6 mt-4 text-muted-foreground space-y-2">
            <li>Contactgegevens en correspondentie: maximaal 2 jaar na laatste contact</li>
            <li>Factuurgegevens: 7 jaar (wettelijke bewaarplicht)</li>
            <li>Nieuwsbriefabonnees: tot u zich uitschrijft</li>
          </ul>
        </>
      )
    },
    {
      title: "5. Delen met derden",
      content: (
        <p className="text-muted-foreground">
          {companyInfo.name} verstrekt uitsluitend aan derden en alleen als dit nodig is voor de uitvoering van onze overeenkomst met u of om te voldoen aan een wettelijke verplichting.
        </p>
      )
    },
    {
      title: "6. Cookies",
      content: (
        <p className="text-muted-foreground">
          {companyInfo.name} gebruikt functionele, analytische en tracking cookies. Een cookie is een klein tekstbestand dat bij het eerste bezoek aan deze website wordt opgeslagen in de browser van uw computer, tablet of smartphone. Voor meer informatie over cookies, zie onze <a href="/cookies" className="text-primary hover:underline">cookieverklaring</a>.
        </p>
      )
    },
    {
      title: "7. Uw rechten",
      content: (
        <p className="text-muted-foreground">
          U heeft het recht om uw persoonsgegevens in te zien, te corrigeren of te verwijderen. Daarnaast heeft u het recht om uw eventuele toestemming voor de gegevensverwerking in te trekken of bezwaar te maken tegen de verwerking van uw persoonsgegevens door {companyInfo.name}.
        </p>
      )
    },
    {
      title: "8. Beveiliging",
      content: (
        <p className="text-muted-foreground">
          {companyInfo.name} neemt de bescherming van uw gegevens serieus en neemt passende maatregelen om misbruik, verlies, onbevoegde toegang, ongewenste openbaarmaking en ongeoorloofde wijziging tegen te gaan.
        </p>
      )
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead 
        title="Privacyverklaring | Nieuwblik Webdesign Enkhuizen"
        description="Lees onze privacyverklaring. Hoe Nieuwblik uit Enkhuizen omgaat met persoonsgegevens conform de AVG. Uw privacy is belangrijk voor ons."
        keywords="privacyverklaring, AVG, persoonsgegevens, privacy Nieuwblik, webdesign Enkhuizen"
        includeOrganizationSchema={false}
      />
      <Navigation />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-6 py-24">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="flex items-center gap-3 mb-8"
              initial="hidden"
              animate="visible"
              variants={getVariants(fadeUp)}
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, ease: easings.easeOutExpo }}
              >
                <Shield className="h-10 w-10 text-primary" />
              </motion.div>
              <motion.h1 
                className="text-4xl md:text-5xl font-bold"
                variants={getVariants(fadeUp)}
              >
                Privacyverklaring
              </motion.h1>
            </motion.div>

            <motion.div 
              className="prose prose-lg max-w-none space-y-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={getVariants(staggerContainer)}
            >
              {sections.map((section, index) => (
                <motion.section 
                  key={index}
                  variants={getVariants(staggerItem)}
                  whileHover={shouldReduceMotion ? {} : { x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
                  {section.content}
                </motion.section>
              ))}
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
