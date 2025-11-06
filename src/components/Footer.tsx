import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-secondary py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <img src={logo} alt="Nieuwblik" className="h-8 mb-4" />
            <p className="text-muted-foreground text-sm">
              Premium web design and digital solutions for ambitious businesses.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-foreground transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="text-muted-foreground hover:text-foreground transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Ready to Start?</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Let's discuss your project and bring your vision to life.
            </p>
            <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/contact">Request a Quote</Link>
            </Button>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Nieuwblik. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
