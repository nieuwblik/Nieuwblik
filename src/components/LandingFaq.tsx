import FAQSection from "@/components/FAQSection";
import { AnimatedButton } from "@/components/ui/animated-button";

interface FaqItem {
  q: string;
  a: string;
}

interface LandingFaqProps {
  h2: string;
  items: FaqItem[];
}

/**
 * FAQ van de stads-, branche- en regiopagina's, in dezelfde vorm als op de homepage
 * (FAQSection). De vragen en de kop blijven per pagina eigen. De FAQPage-structured
 * data zit in de @graph van de pagina (via SEOHead), niet hier: anders stond hij dubbel.
 */
const LandingFaq = ({ h2, items }: LandingFaqProps) => (
  <FAQSection
    zonderAnimatie
    kop={h2}
    vragen={items.map((it) => ({ question: it.q, answer: it.a }))}
    actie={
      <AnimatedButton to="/gratis-website-analyse" size="lg">
        Gratis website-analyse
      </AnimatedButton>
    }
  />
);

export default LandingFaq;
