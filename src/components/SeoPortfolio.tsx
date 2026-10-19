import { Link } from "@/lib/router-compat";
import { projects } from "@/data/projects";

const SLUGS = ["pride-mobility-europe", "quantum-rehab-europe", "esveld-installatie", "bushido-shop", "vv-madjoe", "mhb-techniek"];

/** Portfolioblik op de SEO-stadspagina's. */
const SeoPortfolio = ({ stad }: { stad: string }) => {
  const cases = SLUGS.map((s) => projects.find((p) => p.slug === s)).filter((p): p is NonNullable<typeof p> => !!p);
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground text-center">Een blik op ons werk</h2>
        <p className="text-muted-foreground text-lg leading-relaxed mb-12 max-w-2xl mx-auto text-center">
          Dit bouwden we voor ondernemers die net als jij in {stad} beter gevonden willen worden.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((p) => (
            <Link key={p.slug} to={`/portfolio/${p.slug}`} className="group block rounded-2xl overflow-hidden border border-border bg-secondary">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={p.image} alt={`Website van ${p.title}`} loading="lazy" decoding="async" className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <p className="font-semibold text-foreground">{p.title}</p>
                <p className="text-sm text-muted-foreground">{p.category}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/portfolio" className="text-accent hover:underline font-semibold">Bekijk het hele portfolio</Link>
        </div>
      </div>
    </section>
  );
};

export default SeoPortfolio;
