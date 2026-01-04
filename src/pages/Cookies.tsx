import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Cookie } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { fadeUp, staggerContainer, staggerItem, easings } from "@/lib/motion";

const Cookies = () => {
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
      title: "1. Wat zijn cookies?",
      content: (
        <p className="text-muted-foreground">
          Cookies zijn kleine tekstbestanden die door een website op uw computer, tablet of smartphone worden geplaatst wanneer u de website bezoekt. In deze cookies wordt informatie opgeslagen die bij een volgend bezoek weer naar de betreffende website teruggestuurd wordt.
        </p>
      )
    },
    {
      title: "2. Waarvoor gebruiken wij cookies?",
      content: (
        <>
          <p className="text-muted-foreground">
            Nieuwblik gebruikt cookies om:
          </p>
          <ul className="list-disc pl-6 mt-4 text-muted-foreground space-y-2">
            <li>De website goed te laten werken</li>
            <li>Uw voorkeuren te onthouden</li>
            <li>Inzicht te krijgen in hoe bezoekers onze website gebruiken</li>
            <li>De website te verbeteren en te optimaliseren</li>
            <li>De website veilig te houden</li>
          </ul>
        </>
      )
    },
    {
      title: "3. Soorten cookies die wij gebruiken",
      content: (
        <div className="space-y-6 mt-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">Functionele cookies</h3>
            <p className="text-muted-foreground">
              Deze cookies zijn noodzakelijk voor het goed functioneren van de website. Ze onthouden bijvoorbeeld uw taalkeuze en cookievoorkeuren.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Analytische cookies</h3>
            <p className="text-muted-foreground">
              Wij gebruiken Google Analytics om bij te houden hoe bezoekers onze website gebruiken. De informatie die hiermee verzameld wordt, wordt gebruikt om rapporten op te stellen over het gebruik van de website. Google kan deze informatie aan derden verschaffen indien Google hiertoe wettelijk wordt verplicht, of voor zover derden de informatie namens Google verwerken.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "4. Cookies in- of uitschakelen",
      content: (
        <>
          <p className="text-muted-foreground">
            U kunt ervoor kiezen om cookies uit te schakelen. Dit doet u via uw browser. Let op: het uitschakelen van cookies kan gevolgen hebben voor de werking van onze website. Sommige functionaliteiten werken mogelijk niet meer optimaal.
          </p>
          <p className="text-muted-foreground mt-4">
            Meer informatie over het in- en uitschakelen en het verwijderen van cookies kunt u vinden in de instructies en/of met behulp van de Help-functie van uw browser.
          </p>
        </>
      )
    },
    {
      title: "5. Nieuw cookiebeleid",
      content: (
        <p className="text-muted-foreground">
          Wij kunnen dit cookiebeleid van tijd tot tijd aanpassen. Deze wijzigingen worden op deze pagina gepubliceerd. Het is raadzaam om regelmatig deze pagina te raadplegen, zodat u op de hoogte bent van eventuele wijzigingen.
        </p>
      )
    },
    {
      title: "6. Contact",
      content: (
        <>
          <p className="text-muted-foreground">
            Heeft u vragen over ons cookiebeleid? Neem dan contact met ons op via de <a href="/contact" className="text-primary hover:underline">contactpagina</a>.
          </p>
          <p className="text-muted-foreground mt-4">
            <strong>Nieuwblik</strong><br />
            <a href="https://www.google.com/maps/dir//De+Trompet+18H,+1601+MK+Enkhuizen/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x47c8a3932165dee3:0xecaa07e808a362fc?sa=X&ved=1t:707&ictx=111" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              De Trompet 18H, 1601 MK Enkhuizen
            </a><br />
            KVK: 99229781<br />
            BTW: NL005377205B80
          </p>
        </>
      )
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead 
        title="Cookieverklaring | Nieuwblik Webdesign Enkhuizen"
        description="Informatie over het cookiegebruik op de website van Nieuwblik. Welke cookies we gebruiken en waarvoor. Webdesign bureau Enkhuizen."
        keywords="cookieverklaring, cookies, privacy, Nieuwblik Enkhuizen, website cookies"
        canonicalUrl="https://nieuwblik.com/cookies"
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
                <Cookie className="h-10 w-10 text-primary" />
              </motion.div>
              <motion.h1 
                className="text-4xl md:text-5xl font-bold"
                variants={getVariants(fadeUp)}
              >
                Cookieverklaring
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

export default Cookies;
