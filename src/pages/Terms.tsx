
import Footer from "@/components/Footer";
import { FileText } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-6 py-24">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <FileText className="h-10 w-10 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold">Algemene Voorwaarden</h1>
            </div>

            <div className="prose prose-lg max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Algemeen</h2>
                <p className="text-muted-foreground">
                  Deze algemene voorwaarden zijn van toepassing op alle aanbiedingen, offertes en overeenkomsten van Nieuwblik, gevestigd aan De Trompet 18H, 1601 MK Enkhuizen, ingeschreven bij de Kamer van Koophandel onder nummer 88304604.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Definities</h2>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li><strong>Nieuwblik:</strong> de gebruiker van deze algemene voorwaarden</li>
                  <li><strong>Opdrachtgever:</strong> de natuurlijke of rechtspersoon die met Nieuwblik een overeenkomst aangaat</li>
                  <li><strong>Diensten:</strong> alle door Nieuwblik aangeboden diensten, waaronder webdesign, webdevelopment, SEO-optimalisatie en aanverwante diensten</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Aanbiedingen en offertes</h2>
                <p className="text-muted-foreground">
                  Alle aanbiedingen en offertes van Nieuwblik zijn vrijblijvend, tenzij uitdrukkelijk anders vermeld. Offertes zijn 30 dagen geldig, tenzij anders aangegeven. Nieuwblik kan niet aan een aanbieding of offerte worden gehouden indien de opdrachtgever redelijkerwijs kan begrijpen dat de aanbieding of offerte een kennelijke vergissing of verschrijving bevat.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Totstandkoming overeenkomst</h2>
                <p className="text-muted-foreground">
                  Een overeenkomst komt tot stand op het moment dat de opdrachtgever een offerte of aanbieding van Nieuwblik heeft geaccepteerd. Acceptatie dient schriftelijk of per e-mail te worden bevestigd. Nieuwblik behoudt zich het recht voor om opdrachten te weigeren zonder opgaaf van redenen.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Uitvoering van de opdracht</h2>
                <p className="text-muted-foreground">
                  Nieuwblik zal de opdracht naar beste inzicht en vermogen en overeenkomstig de eisen van goed vakmanschap uitvoeren. Nieuwblik heeft het recht om bepaalde werkzaamheden te laten verrichten door derden. De toepasselijkheid van artikel 7:404 BW en artikel 7:407 lid 2 BW wordt uitdrukkelijk uitgesloten.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Verplichtingen opdrachtgever</h2>
                <p className="text-muted-foreground">
                  De opdrachtgever draagt er zorg voor dat alle gegevens, waarvan Nieuwblik aangeeft dat deze noodzakelijk zijn of waarvan de opdrachtgever redelijkerwijs behoort te begrijpen dat deze noodzakelijk zijn voor het uitvoeren van de overeenkomst, tijdig aan Nieuwblik worden verstrekt.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Tarieven en betaling</h2>
                <p className="text-muted-foreground">
                  Alle prijzen zijn exclusief BTW, tenzij anders vermeld. Betaling dient te geschieden binnen 14 dagen na factuurdatum, tenzij anders overeengekomen. Bij niet tijdige betaling is de opdrachtgever van rechtswege in verzuim en is Nieuwblik gerechtigd wettelijke rente in rekening te brengen.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Intellectueel eigendom</h2>
                <p className="text-muted-foreground">
                  Alle rechten van intellectuele eigendom op de door Nieuwblik ontwikkelde of ter beschikking gestelde materialen berusten uitsluitend bij Nieuwblik of haar licentiegevers. De opdrachtgever verkrijgt alleen de gebruiksrechten die uitdrukkelijk zijn toegekend.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">9. Aansprakelijkheid</h2>
                <p className="text-muted-foreground">
                  Nieuwblik is uitsluitend aansprakelijk voor directe schade. De aansprakelijkheid is beperkt tot het factuurbedrag, althans tot dat gedeelte van de opdracht waarop de aansprakelijkheid betrekking heeft. Nieuwblik is niet aansprakelijk voor indirecte schade, waaronder gevolgschade, gederfde winst, gemiste besparingen en schade door bedrijfsstagnatie.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">10. Geschillen</h2>
                <p className="text-muted-foreground">
                  Op alle overeenkomsten tussen Nieuwblik en de opdrachtgever is Nederlands recht van toepassing. Geschillen zullen uitsluitend worden voorgelegd aan de bevoegde rechter in het arrondissement waar Nieuwblik is gevestigd.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Contact</h2>
                <p className="text-muted-foreground">
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

export default Terms;
