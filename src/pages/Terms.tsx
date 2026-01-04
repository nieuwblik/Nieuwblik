import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { FileText } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { fadeUp, staggerContainer, staggerItem, easings } from "@/lib/motion";

const Terms = () => {
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
        <p className="text-muted-foreground">
          Deze algemene voorwaarden zijn van toepassing op alle aanbiedingen, offertes en overeenkomsten van Nieuwblik, gevestigd aan De Trompet 18H, 1601 MK Enkhuizen, ingeschreven bij de Kamer van Koophandel onder nummer 99229781.
        </p>
      )
    },
    {
      title: "2. Definities",
      content: (
        <ul className="list-disc pl-6 text-muted-foreground space-y-2">
          <li><strong>Nieuwblik:</strong> de gebruiker van deze algemene voorwaarden</li>
          <li><strong>Opdrachtgever:</strong> de natuurlijke of rechtspersoon die met Nieuwblik een overeenkomst aangaat</li>
          <li><strong>Diensten:</strong> alle door Nieuwblik aangeboden diensten, waaronder webdesign, webdevelopment, SEO-optimalisatie en aanverwante diensten</li>
        </ul>
      )
    },
    {
      title: "3. Aanbiedingen en offertes",
      content: (
        <p className="text-muted-foreground">
          Alle aanbiedingen en offertes van Nieuwblik zijn vrijblijvend, tenzij uitdrukkelijk anders vermeld. Offertes zijn 30 dagen geldig, tenzij anders aangegeven. Nieuwblik kan niet aan een aanbieding of offerte worden gehouden indien de opdrachtgever redelijkerwijs kan begrijpen dat de aanbieding of offerte een kennelijke vergissing of verschrijving bevat.
        </p>
      )
    },
    {
      title: "4. Totstandkoming overeenkomst",
      content: (
        <p className="text-muted-foreground">
          Een overeenkomst komt tot stand op het moment dat de opdrachtgever een offerte of aanbieding van Nieuwblik heeft geaccepteerd. Acceptatie dient schriftelijk of per e-mail te worden bevestigd. Nieuwblik behoudt zich het recht voor om opdrachten te weigeren zonder opgaaf van redenen.
        </p>
      )
    },
    {
      title: "5. Uitvoering van de opdracht",
      content: (
        <p className="text-muted-foreground">
          Nieuwblik zal de opdracht naar beste inzicht en vermogen en overeenkomstig de eisen van goed vakmanschap uitvoeren. Nieuwblik heeft het recht om bepaalde werkzaamheden te laten verrichten door derden. De toepasselijkheid van artikel 7:404 BW en artikel 7:407 lid 2 BW wordt uitdrukkelijk uitgesloten.
        </p>
      )
    },
    {
      title: "6. Verplichtingen opdrachtgever",
      content: (
        <p className="text-muted-foreground">
          De opdrachtgever draagt er zorg voor dat alle gegevens, waarvan Nieuwblik aangeeft dat deze noodzakelijk zijn of waarvan de opdrachtgever redelijkerwijs behoort te begrijpen dat deze noodzakelijk zijn voor het uitvoeren van de overeenkomst, tijdig aan Nieuwblik worden verstrekt.
        </p>
      )
    },
    {
      title: "7. Tarieven en betaling",
      content: (
        <p className="text-muted-foreground">
          Alle prijzen zijn exclusief BTW, tenzij anders vermeld. Betaling dient te geschieden binnen 14 dagen na factuurdatum, tenzij anders overeengekomen. Bij niet tijdige betaling is de opdrachtgever van rechtswege in verzuim en is Nieuwblik gerechtigd wettelijke rente in rekening te brengen.
        </p>
      )
    },
    {
      title: "8. Intellectueel eigendom",
      content: (
        <p className="text-muted-foreground">
          Alle rechten van intellectuele eigendom op de door Nieuwblik ontwikkelde of ter beschikking gestelde materialen berusten uitsluitend bij Nieuwblik of haar licentiegevers. De opdrachtgever verkrijgt alleen de gebruiksrechten die uitdrukkelijk zijn toegekend.
        </p>
      )
    },
    {
      title: "9. Aansprakelijkheid",
      content: (
        <p className="text-muted-foreground">
          Nieuwblik is uitsluitend aansprakelijk voor directe schade. De aansprakelijkheid is beperkt tot het factuurbedrag, althans tot dat gedeelte van de opdracht waarop de aansprakelijkheid betrekking heeft. Nieuwblik is niet aansprakelijk voor indirecte schade, waaronder gevolgschade, gederfde winst, gemiste besparingen en schade door bedrijfsstagnatie.
        </p>
      )
    },
    {
      title: "10. Geschillen",
      content: (
        <p className="text-muted-foreground">
          Op alle overeenkomsten tussen Nieuwblik en de opdrachtgever is Nederlands recht van toepassing. Geschillen zullen uitsluitend worden voorgelegd aan de bevoegde rechter in het arrondissement waar Nieuwblik is gevestigd.
        </p>
      )
    },
    {
      title: "Contact",
      content: (
        <p className="text-muted-foreground">
          <strong>Nieuwblik</strong><br />
          <a href="https://www.google.com/maps/dir//De+Trompet+18H,+1601+MK+Enkhuizen/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x47c8a3932165dee3:0xecaa07e808a362fc?sa=X&ved=1t:707&ictx=111" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            De Trompet 18H, 1601 MK Enkhuizen
          </a><br />
          KVK: 99229781<br />
          BTW: NL005377205B80
        </p>
      )
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead 
        title="Algemene Voorwaarden | Nieuwblik Webdesign Enkhuizen"
        description="Lees de algemene voorwaarden van Nieuwblik webdesign bureau in Enkhuizen. Duidelijke afspraken voor website en webshop projecten."
        keywords="algemene voorwaarden, webdesign voorwaarden, Nieuwblik Enkhuizen, website afspraken"
        canonicalUrl="https://nieuwblik.com/algemene-voorwaarden"
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
                <FileText className="h-10 w-10 text-primary" />
              </motion.div>
              <motion.h1 
                className="text-4xl md:text-5xl font-bold"
                variants={getVariants(fadeUp)}
              >
                Algemene Voorwaarden
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

export default Terms;
