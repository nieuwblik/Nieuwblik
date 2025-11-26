import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
const FAQSection = () => {
  const faqs = [{
    question: "Wat kost het om een website te laten maken?",
    answer: "De kosten voor een website zijn afhankelijk van verschillende factoren zoals functionaliteit, design complexiteit en het aantal pagina's. Een eenvoudige website begint vanaf €1.500, terwijl een uitgebreide webshop of maatwerk platform vanaf €5.000 kan starten. Tijdens een vrijblijvende call bespreken we jouw wensen en maken we een passende offerte."
  }, {
    question: "Hoe lang duurt het voordat mijn website live staat?",
    answer: "Voor de meeste projecten geldt een doorlooptijd van 2-6 weken, afhankelijk van de omvang en complexiteit. Eenvoudige websites kunnen binnen 1-2 weken gerealiseerd worden. We werken graag met vaste deadlines en houden je tijdens het proces op de hoogte van de voortgang."
  }, {
    question: "Kan ik zelf aanpassingen doen aan mijn website?",
    answer: "Ja! We bouwen websites met gebruiksvriendelijke content management systemen (CMS) waarmee je eenvoudig zelf teksten, afbeeldingen en andere content kunt aanpassen. We geven uitleg en instructies hoe je dit doet. Voor complexere wijzigingen staan we natuurlijk altijd klaar om te helpen."
  }, {
    question: "Bieden jullie ook onderhoud en support na oplevering?",
    answer: "Absoluut! We bieden verschillende onderhoudspakketten aan, van basis support tot volledig beheer inclusief updates, backups en security monitoring. Ook kun je altijd bij ons terecht voor eenmalige aanpassingen of uitbreidingen van je website."
  }, {
    question: "Wordt mijn website ook goed gevonden in Google?",
    answer: "Ja, alle websites die wij bouwen zijn standaard SEO-geoptimaliseerd. Dit betekent snelle laadtijden, mobiel responsive design, schone code en juiste meta tags. Voor bedrijven die hoog willen scoren in Google bieden we ook uitgebreide SEO diensten aan zoals keyword research, content optimalisatie en linkbuilding."
  }, {
    question: "Wat is er nodig om te starten met mijn project?",
    answer: "Om te starten hebben we allereerst een goed gesprek nodig om jouw wensen en doelen te begrijpen. Daarna maken we een offerte en projectplan. Bij akkoord vragen we om content (teksten, afbeeldingen, logo's) en eventueel een aanbetaling. Vervolgens kunnen we direct aan de slag!"
  }, {
    question: "Leveren jullie ook logo's en huisstijl?",
    answer: "Ja, we bieden complete branding diensten aan. Van logo ontwerp tot complete merkidentiteit inclusief kleurenpalet, typografie, visitekaartjes en andere marketing materialen. Een sterke visuele identiteit is de basis voor online en offline succes."
  }, {
    question: "Zijn de websites ook geschikt voor mobiele telefoons?",
    answer: "Absoluut! Alle websites die wij maken zijn volledig responsive. Dit betekent dat ze perfect werken en er prachtig uitzien op alle apparaten: desktop, tablet én smartphone. Meer dan 60% van het internetverkeer komt tegenwoordig van mobiele apparaten, dus dit is essentieel."
  }];
  return <section className="py-20 md:py-32 bg-secondary">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-accent mb-4">VEELGESTELDE VRAGEN</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Alles wat je moet weten</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light">
            Vind snel antwoord op de meest gestelde vragen over onze diensten, proces en werkwijze.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-semibold hover:text-accent">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground font-light leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>)}
          </Accordion>
        </div>

        {/* Schema.org FAQ structured data for SEO */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        })
      }} />
      </div>
    </section>;
};
export default FAQSection;