import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Cookie } from "lucide-react";

const Cookies = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-6 py-24">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Cookie className="h-10 w-10 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold">Cookieverklaring</h1>
            </div>

            <div className="prose prose-lg max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Wat zijn cookies?</h2>
                <p className="text-muted-foreground">
                  Cookies zijn kleine tekstbestanden die door een website op uw computer, tablet of smartphone worden geplaatst wanneer u de website bezoekt. In deze cookies wordt informatie opgeslagen die bij een volgend bezoek weer naar de betreffende website teruggestuurd wordt.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Waarvoor gebruiken wij cookies?</h2>
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
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Soorten cookies die wij gebruiken</h2>
                
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
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Cookies in- of uitschakelen</h2>
                <p className="text-muted-foreground">
                  U kunt ervoor kiezen om cookies uit te schakelen. Dit doet u via uw browser. Let op: het uitschakelen van cookies kan gevolgen hebben voor de werking van onze website. Sommige functionaliteiten werken mogelijk niet meer optimaal.
                </p>
                <p className="text-muted-foreground mt-4">
                  Meer informatie over het in- en uitschakelen en het verwijderen van cookies kunt u vinden in de instructies en/of met behulp van de Help-functie van uw browser.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Nieuw cookiebeleid</h2>
                <p className="text-muted-foreground">
                  Wij kunnen dit cookiebeleid van tijd tot tijd aanpassen. Deze wijzigingen worden op deze pagina gepubliceerd. Het is raadzaam om regelmatig deze pagina te raadplegen, zodat u op de hoogte bent van eventuele wijzigingen.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Contact</h2>
                <p className="text-muted-foreground">
                  Heeft u vragen over ons cookiebeleid? Neem dan contact met ons op via de <a href="/contact" className="text-primary hover:underline">contactpagina</a>.
                </p>
                <p className="text-muted-foreground mt-4">
                  <strong>Nieuwblik</strong><br />
                  <a href="https://www.google.com/maps/dir//De+Trompet+18H,+1601+MK+Enkhuizen/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x47c8a3932165dee3:0xecaa07e808a362fc?sa=X&ved=1t:707&ictx=111" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    De Trompet 18H, 1601 MK Enkhuizen
                  </a><br />
                  KVK: 88304604<br />
                  BTW: NL864572311b01
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cookies;
