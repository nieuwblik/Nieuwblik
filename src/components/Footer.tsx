import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "@/assets/logo.png";
import { useLanguage } from "@/contexts/LanguageContext";
import { MessageCircle, Linkedin, Instagram, Facebook } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const Footer = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success(t("footer.newsletter.button"));
      setEmail("");
    }
  };
  
  return (
    <footer className="bg-secondary py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          <div className="lg:col-span-2">
            <img src={logo} alt="Nieuwblik" className="h-8 mb-4 brightness-0" />
            <p className="text-muted-foreground text-sm mb-6">
              {t("footer.description")}
            </p>
            
            <div className="space-y-4">
              <h4 className="font-semibold">{t("footer.newsletter")}</h4>
              <p className="text-sm text-muted-foreground">
                {t("footer.newsletter.desc")}
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <Input 
                  type="email" 
                  placeholder={t("footer.newsletter.placeholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background"
                />
                <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  {t("footer.newsletter.button")}
                </Button>
              </form>
              
              <div className="pt-4">
                <h4 className="font-semibold mb-3">{t("footer.social")}</h4>
                <div className="flex gap-3">
                  <a 
                    href="https://linkedin.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="h-10 w-10 rounded-full bg-background flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="h-10 w-10 rounded-full bg-background flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a 
                    href="https://facebook.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="h-10 w-10 rounded-full bg-background flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">{t("footer.links")}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("nav.home")}
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("nav.services")}
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("nav.portfolio")}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("nav.contact")}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">{t("footer.company")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>{t("footer.kvk")}: 88304604</li>
              <li>{t("footer.btw")}: NL864572311b01</li>
              <li className="pt-2">
                <a 
                  href="https://wa.me/31646253607" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  {t("footer.whatsapp")}
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">{t("footer.ready")}</h4>
            <p className="text-sm text-muted-foreground mb-4">
              {t("footer.ready.desc")}
            </p>
            <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/contact">{t("cta.button")}</Link>
            </Button>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Nieuwblik. {t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
