import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Shield } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-6 py-24">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Shield className="h-10 w-10 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold">Privacyverklaring</h1>
            </div>

            <div className="prose prose-lg max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Algemeen</h2>
                <p className="text-muted-foreground">
                  Nieuwblik, gevestigd aan De Trompet 18H, 1601 MK Enkhuizen, is verantwoordelijk voor de verwerking van persoonsgegevens zoals weergegeven in deze privacyverklaring.
                </p>
                <p className="text-muted-foreground mt-4">
                  <strong>Contactgegevens:</strong><br />
                  <a href="https://www.google.com/maps/dir//De+Trompet+18H,+1601+MK+Enkhuizen/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x47c8a3932165dee3:0xecaa07e808a362fc?sa=X&ved=1t:707&ictx=111" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    De Trompet 18H, 1601 MK Enkhuizen
                  </a><br />
                  KVK: 88304604<br />
                  BTW: NL864572311b01
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Persoonsgegevens die wij verwerken</h2>
                <p className="text-muted-foreground">
                  Nieuwblik verwerkt uw persoonsgegevens doordat u gebruik maakt van onze diensten en/of omdat u deze zelf aan ons verstrekt. Hieronder vindt u een overzicht van de persoonsgegevens die wij verwerken:
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
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Waarom we gegevens nodig hebben</h2>
                <p className="text-muted-foreground">
                  Nieuwblik verwerkt uw persoonsgegevens voor de volgende doelen:
                </p>
                <ul className="list-disc pl-6 mt-4 text-muted-foreground space-y-2">
                  <li>Het afhandelen van uw contactaanvraag</li>
                  <li>U te kunnen bellen of e-mailen indien dit nodig is om onze dienstverlening uit te kunnen voeren</li>
                  <li>U te informeren over wijzigingen van onze diensten en producten</li>
                  <li>Om goederen en diensten bij u af te leveren</li>
                  <li>Nieuwblik analyseert uw gedrag op de website om daarmee de website te verbeteren en het aanbod af te stemmen op uw voorkeuren</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Hoe lang we gegevens bewaren</h2>
                <p className="text-muted-foreground">
                  Nieuwblik bewaart uw persoonsgegevens niet langer dan strikt nodig is om de doelen te realiseren waarvoor uw gegevens worden verzameld. Wij hanteren de volgende bewaartermijnen:
                </p>
                <ul className="list-disc pl-6 mt-4 text-muted-foreground space-y-2">
                  <li>Contactgegevens en correspondentie: maximaal 2 jaar na laatste contact</li>
                  <li>Factuurgegevens: 7 jaar (wettelijke bewaarplicht)</li>
                  <li>Nieuwsbriefabonnees: tot u zich uitschrijft</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Delen met derden</h2>
                <p className="text-muted-foreground">
                  Nieuwblik verstrekt uitsluitend aan derden en alleen als dit nodig is voor de uitvoering van onze overeenkomst met u of om te voldoen aan een wettelijke verplichting.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Cookies</h2>
                <p className="text-muted-foreground">
                  Nieuwblik gebruikt functionele, analytische en tracking cookies. Een cookie is een klein tekstbestand dat bij het eerste bezoek aan deze website wordt opgeslagen in de browser van uw computer, tablet of smartphone. Voor meer informatie over cookies, zie onze <a href="/cookies" className="text-primary hover:underline">cookieverklaring</a>.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Uw rechten</h2>
                <p className="text-muted-foreground">
                  U heeft het recht om uw persoonsgegevens in te zien, te corrigeren of te verwijderen. Daarnaast heeft u het recht om uw eventuele toestemming voor de gegevensverwerking in te trekken of bezwaar te maken tegen de verwerking van uw persoonsgegevens door Nieuwblik.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Beveiliging</h2>
                <p className="text-muted-foreground">
                  Nieuwblik neemt de bescherming van uw gegevens serieus en neemt passende maatregelen om misbruik, verlies, onbevoegde toegang, ongewenste openbaarmaking en ongeoorloofde wijziging tegen te gaan.
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

export default Privacy;
