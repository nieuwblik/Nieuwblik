import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import justinImage from "@/assets/justin-slok.png";

const ThankYou = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <img 
              src={justinImage} 
              alt="Justin Slok" 
              className="w-48 h-48 mx-auto rounded-full object-cover mb-8 shadow-lg"
            />
            
            <h1 className="text-display mb-6">
              Bedankt! We gaan er zo snel mogelijk naar kijken!
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 font-light max-w-2xl mx-auto">
              We hebben je project briefing ontvangen en nemen binnen 48 uur contact met je op.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/portfolio">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Bekijk Portfolio
                </Button>
              </Link>
              
              <Link to="/">
                <Button size="lg" variant="outline">
                  Terug naar Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ThankYou;
