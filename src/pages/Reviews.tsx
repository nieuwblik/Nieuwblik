import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ReviewsDisplay from "@/components/ReviewsDisplay";
import ReviewForm from "@/components/ReviewForm";

const Reviews = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="container mx-auto px-6">
          <p className="text-accent mb-6">KLANTBEOORDELINGEN</p>
          <h1 className="text-display mb-6">
            Wat onze klanten zeggen
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl font-light">
            Ontdek de ervaringen van bedrijven die hun online succes hebben gerealiseerd met Nieuwblik.
          </p>
        </div>
      </section>

      {/* Reviews Display */}
      <section className="pb-20">
        <div className="container mx-auto px-6">
          <ReviewsDisplay />
        </div>
      </section>

      {/* Review Form Section */}
      <section className="py-20 md:py-32 bg-secondary">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Deel jouw ervaring
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
              Heb je met ons samengewerkt? We horen graag over je ervaring!
            </p>
          </div>
          
          <ReviewForm />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Reviews;
