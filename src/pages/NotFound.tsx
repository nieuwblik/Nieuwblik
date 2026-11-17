import type { CSSProperties } from "react";
import { Link } from "@/lib/router-compat";
import { Button } from "@/components/ui/button";
import { AnimatedButton } from "@/components/ui/animated-button";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

/** Vertraging voor de inloop bij het laden (sw-hero-anim in styles.css). */
const na = (s: number) => ({ "--sw-delay": `${s}s` }) as CSSProperties;

/**
 * De 404-pagina. De inloop bij het laden is CSS, net als in de hero's, zonder
 * framer-motion: deze pagina zit via de routes in de eerste lading van elke
 * pagina, dus wat hij importeert laadt elke bezoeker mee.
 */
const NotFound = () => {
  const popularPages = [
    { name: "Diensten", path: "/diensten" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Over Ons", path: "/over-ons" },
    { name: "Blog", path: "/blog" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Pagina Niet Gevonden | Nieuwblik Webdesign Enkhuizen"
        description="Deze pagina bestaat niet of is verplaatst. Ga terug naar de homepage van Nieuwblik webdesign bureau in Enkhuizen."
        keywords="404, pagina niet gevonden, Nieuwblik Enkhuizen"
        noIndex={true}
        includeOrganizationSchema={false}
      />
      <main className="sw-hero-anim flex-1 flex items-center justify-center bg-background px-6 py-24">
        <div className="max-w-2xl w-full text-center space-y-8">
          <div className="space-y-4">
            <h1 className="sw-cta text-9xl font-bold text-primary" style={na(0)}>
              404
            </h1>
            <h2 className="sw-lead text-3xl md:text-4xl font-bold text-foreground" style={na(0.1)}>
              Pagina niet gevonden
            </h2>
            <p className="sw-lead text-lg text-muted-foreground max-w-md mx-auto" style={na(0.2)}>
              Oeps! De pagina die je zoekt bestaat niet of is verplaatst. Geen zorgen, we helpen je graag op weg.
            </p>
          </div>

          <div className="sw-cta flex flex-col sm:flex-row gap-4 justify-center items-center" style={na(0.3)}>
            <AnimatedButton to="/" size="lg">
              Terug naar Home
            </AnimatedButton>
            <AnimatedButton to="/contact" size="lg" variant="outline">
              Neem Contact Op
            </AnimatedButton>
          </div>

          <div className="sw-cta pt-8 border-t border-border" style={na(0.4)}>
            <h3 className="text-lg font-semibold mb-4">
              Bekijk onze populaire pagina's:
            </h3>
            <div className="flex flex-wrap gap-3 justify-center">
              {popularPages.map((page) => (
                <Button
                  key={page.path}
                  asChild
                  variant="secondary"
                  className="transition-transform duration-200 hover:-translate-y-0.5 hover:scale-105 active:scale-[0.98] motion-reduce:transform-none"
                >
                  <Link to={page.path}>{page.name}</Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
