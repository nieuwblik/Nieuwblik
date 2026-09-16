import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FaqItem {
  q: string;
  a: string;
}

interface LandingFaqProps {
  h2: string;
  items: FaqItem[];
}

/**
 * FAQ-sectie. De FAQPage-structured data zit in de @graph van de pagina (via
 * SEOHead), niet hier: anders stond hij dubbel.
 */
const LandingFaq = ({ h2, items }: LandingFaqProps) => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center text-foreground">{h2}</h2>
          <Accordion type="single" collapsible className="w-full">
            {items.map((it, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`}>
                <AccordionTrigger data-faq-vraag="" className="text-left text-base md:text-lg font-semibold">
                  {it.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {it.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default LandingFaq;
