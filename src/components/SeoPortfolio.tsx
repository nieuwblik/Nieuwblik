import CaseGrid from "@/components/CaseGrid";
import { AnimatedButton } from "@/components/ui/animated-button";
import { kiesCases } from "@/lib/cases";

const SLUGS = ["pride-mobility-europe", "quantum-rehab-europe", "esveld-installatie", "bushido-shop", "vv-madjoe", "mhb-techniek"];
const cases = kiesCases(SLUGS);

/** Portfolioblik op de SEO-stadspagina's, in het raster van de portfoliopagina. */
const SeoPortfolio = ({ stad }: { stad: string }) => (
  <section className="bg-background py-16 md:py-24">
    <div className="container mx-auto px-4 sm:px-6">
      <div className="mb-12 max-w-4xl md:mb-16">
        <h2 className="sectie-kop">Een blik op ons werk</h2>
        <p className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-muted-foreground">
          Dit bouwden we voor ondernemers die net als jij in {stad} beter gevonden willen worden.
        </p>
      </div>
      <CaseGrid projects={cases} />
      <div className="mt-12">
        <AnimatedButton to="/portfolio" size="lg" variant="outline">
          Bekijk het hele portfolio
        </AnimatedButton>
      </div>
    </div>
  </section>
);

export default SeoPortfolio;
