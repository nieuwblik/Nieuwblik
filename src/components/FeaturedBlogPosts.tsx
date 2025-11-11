import { BookOpen } from "lucide-react";

const FeaturedBlogPosts = () => {
  return (
    <section className="py-20 md:py-32 bg-secondary">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <div className="mb-6 inline-block">
            <BookOpen className="w-16 h-16 text-accent mx-auto animate-pulse" />
          </div>
          <p className="text-accent mb-4 font-semibold">BINNENKORT</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Nieuwe blog artikelen komen eraan
          </h2>
          <p className="text-xl text-muted-foreground font-light leading-relaxed">
            We zijn bezig met het creëren van waardevolle content vol tips, inzichten en strategieën 
            om jouw digitale aanwezigheid naar een hoger niveau te tillen. Houd deze ruimte in de gaten!
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBlogPosts;
