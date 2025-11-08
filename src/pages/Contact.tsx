import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle } from "lucide-react";
import ProjectBriefingForm from "@/components/ProjectBriefingForm";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="container mx-auto px-6">
          <p className="text-accent mb-6">START UW PROJECT</p>
          <h1 className="text-display mb-6">
            Project briefing
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl font-light">
            Vul het formulier in zodat we jouw project perfect kunnen voorbereiden. Of neem direct contact op.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20 md:pb-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
            
            {/* Direct Contact Box */}
            <div className="lg:col-span-1">
              <div className="bg-accent text-accent-foreground p-8 rounded-lg sticky top-32">
                <h2 className="text-2xl font-semibold mb-4">Liever direct contact?</h2>
                <p className="mb-6 opacity-90">
                  Geen zin in een formulier? Bel of app ons direct voor een persoonlijk gesprek.
                </p>
                
                <div className="space-y-4">
                  <a
                    href="tel:+31646253607"
                    className="w-full"
                  >
                    <Button 
                      className="w-full bg-background text-foreground hover:bg-background/90"
                      size="lg"
                    >
                      <Phone className="mr-2 h-5 w-5" />
                      Bel: +31 6 46 25 36 07
                    </Button>
                  </a>
                  
                  <a
                    href="https://wa.me/31646253607"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button 
                      className="w-full bg-background text-foreground hover:bg-background/90"
                      size="lg"
                    >
                      <MessageCircle className="mr-2 h-5 w-5" />
                      WhatsApp
                    </Button>
                  </a>
                </div>

                <div className="mt-8 pt-8 border-t border-background/20">
                  <p className="text-sm opacity-75">
                    Beschikbaar ma-vr van 9:00 - 18:00 uur
                  </p>
                </div>
              </div>
            </div>
            
            {/* Project Briefing Form */}
            <div className="lg:col-span-2">
              <div className="bg-secondary p-8 md:p-12 rounded-lg">
                <h2 className="text-2xl font-semibold mb-2">Project briefing formulier</h2>
                <p className="text-muted-foreground mb-8 font-light">
                  Help ons jouw project te begrijpen door de onderstaande vragen te beantwoorden.
                </p>
                
                <ProjectBriefingForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
