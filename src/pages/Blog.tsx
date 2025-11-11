import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import SEOHead from "@/components/SEOHead";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { BookOpen, Sparkles } from "lucide-react";

const Blog = () => {
  const heroAnimation = useScrollAnimation(0.1);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Nieuwblik Blog",
    "description": "Binnenkort nieuwe artikelen over webdesign, SEO, conversie optimalisatie en digitale marketing.",
    "url": "https://www.nieuwblik.com/blog"
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Blog | Binnenkort Nieuwe Artikelen - Nieuwblik"
        description="Binnenkort vind je hier waardevolle inzichten over webdesign, SEO, conversie optimalisatie en digitale marketing. Blijf op de hoogte!"
        keywords="webdesign blog, SEO tips, conversie optimalisatie, digitale marketing, webdesign tips"
        canonicalUrl="https://www.nieuwblik.com/blog"
        structuredData={structuredData}
      />
      <Navigation />
      
      {/* Breadcrumb */}
      <section className="pt-32 pb-0">
        <div className="container mx-auto px-6">
          <Breadcrumb items={[{ label: "Blog", path: "/blog" }]} />
        </div>
      </section>
      
      {/* Coming Soon Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6">
          <div
            ref={heroAnimation.ref}
            className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${
              heroAnimation.isVisible 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="mb-8 inline-block relative">
              <BookOpen className="w-20 h-20 md:w-24 md:h-24 text-accent mx-auto animate-pulse" />
              <Sparkles className="w-8 h-8 text-accent/60 absolute -top-2 -right-2 animate-pulse" style={{ animationDelay: '500ms' }} />
            </div>
            
            <p className="text-accent mb-6 font-semibold text-sm tracking-wider">BINNENKORT</p>
            
            <h1 className="text-display mb-6">
              Nieuwe blog artikelen komen eraan
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed mb-8">
              We zijn bezig met het creëren van waardevolle content vol tips, inzichten en strategieën 
              om jouw digitale aanwezigheid naar een hoger niveau te tillen.
            </p>

            <div className="bg-secondary/50 border border-border rounded-2xl p-8 md:p-12 backdrop-blur-sm">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Waar kun je op rekenen?
              </h2>
              <ul className="text-left max-w-2xl mx-auto space-y-4 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">✓</span>
                  <span className="font-light">Praktische webdesign tips die direct toepasbaar zijn</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">✓</span>
                  <span className="font-light">SEO strategieën om hoger te ranken in Google</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">✓</span>
                  <span className="font-light">Conversie optimalisatie technieken die werken</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">✓</span>
                  <span className="font-light">Digitale marketing trends en inzichten</span>
                </li>
              </ul>
            </div>

            <p className="text-muted-foreground mt-12 font-light">
              Houd deze ruimte in de gaten voor nieuwe artikelen!
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
