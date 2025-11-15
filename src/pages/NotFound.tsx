import { Link } from "react-router-dom";
import { Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

import Footer from "@/components/Footer";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="flex-1 flex items-center justify-center bg-background px-6 py-24">
        <div className="max-w-2xl w-full text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-9xl font-bold text-primary">404</h1>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Pagina niet gevonden
            </h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Oeps! De pagina die je zoekt bestaat niet of is verplaatst. Geen zorgen, we helpen je graag op weg.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/">
                <Home className="mr-2 h-5 w-5" />
                Terug naar Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Neem Contact Op
              </Link>
            </Button>
          </div>

          <div className="pt-8 border-t border-border">
            <h3 className="text-lg font-semibold mb-4">Bekijk onze populaire pagina's:</h3>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button asChild variant="secondary">
                <Link to="/services">Diensten</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link to="/portfolio">Portfolio</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link to="/about">Over Ons</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link to="/blog">Blog</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
