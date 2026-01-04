import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OptimizedImage } from "@/components/OptimizedImage";
import logo from "@/assets/logo.png";
import { Linkedin } from "lucide-react";
import { toast } from "sonner";
import { useState, useRef } from "react";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { easings } from "@/lib/motion";
const Footer = () => {
  const [email, setEmail] = useState("");
  const shouldReduceMotion = useReducedMotion();
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, {
    once: true,
    margin: "-50px"
  });
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Bedankt voor je aanmelding!");
      setEmail("");
    }
  };
  const socialLinks = [{
    href: "https://www.linkedin.com/in/justin-slok-b8a3011b2/",
    label: "LinkedIn",
    icon: <Linkedin className="h-5 w-5" />,
    bgColor: undefined
  }, {
    href: "https://x.com/justin_slok",
    label: "X (Twitter)",
    icon: <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>,
    bgColor: undefined
  }, {
    href: "https://wa.me/31646253607",
    label: "WhatsApp",
    icon: <svg className="h-5 w-5" fill="white" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>,
    bgColor: '#25D366'
  }];
  const navigationLinks = [{
    to: "/",
    label: "Home"
  }, {
    to: "/diensten",
    label: "Diensten"
  }, {
    to: "/portfolio",
    label: "Portfolio"
  }, {
    to: "/over-ons",
    label: "Over Ons"
  }, {
    to: "/contact",
    label: "Contact"
  }, {
    to: "/blog",
    label: "Blog"
  }];
  const legalLinks = [{
    to: "/privacy",
    label: "Privacy"
  }, {
    to: "/cookies",
    label: "Cookies"
  }, {
    to: "/algemene-voorwaarden",
    label: "Algemene Voorwaarden"
  }];
  return <footer ref={footerRef} className="bg-secondary py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          <motion.div className="lg:col-span-2" initial={{
          opacity: 0,
          y: 50
        }} animate={isInView ? {
          opacity: 1,
          y: 0
        } : {
          opacity: 0,
          y: 50
        }} transition={{
          duration: 0.6,
          ease: easings.easeOutExpo
        }}>
            <OptimizedImage src={logo} alt="Nieuwblik logo" className="h-8 mb-4 brightness-0" type="logo" width={150} height={32} />
            <p className="text-muted-foreground text-sm mb-6">
              Wij zijn Nieuwblik, jouw partner in digitale groei. Met passie en expertise creëren we websites en designs die niet alleen prachtig zijn, maar ook echt resultaat opleveren.
            </p>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Blijf op de hoogte</h4>
              <p className="text-sm text-muted-foreground">
                Ontvang tips, trends en inspiratie direct in je inbox
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <Input type="email" placeholder="jouw@email.nl" value={email} onChange={e => setEmail(e.target.value)} required className="bg-background" />
                <motion.div whileHover={shouldReduceMotion ? {} : {
                scale: 1.03
              }} whileTap={shouldReduceMotion ? {} : {
                scale: 0.98
              }}>
                  <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">
                    Aanmelden
                  </Button>
                </motion.div>
              </form>
              
              <div className="pt-4">
                <h4 className="font-semibold mb-3">Volg ons</h4>
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => <motion.a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors ${social.bgColor ? "hover:opacity-80" : "bg-background hover:bg-accent hover:text-accent-foreground"}`} style={social.bgColor ? {
                  backgroundColor: social.bgColor
                } : {}} aria-label={social.label} initial={{
                  opacity: 0,
                  scale: 0.8
                }} animate={isInView ? {
                  opacity: 1,
                  scale: 1
                } : {
                  opacity: 0,
                  scale: 0.8
                }} transition={{
                  delay: 0.3 + index * 0.1,
                  duration: 0.4
                }} whileHover={shouldReduceMotion ? {} : {
                  scale: 1.1,
                  y: -2
                }} whileTap={shouldReduceMotion ? {} : {
                  scale: 0.95
                }}>
                      {social.icon}
                    </motion.a>)}
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div initial={{
          opacity: 0,
          y: 40
        }} animate={isInView ? {
          opacity: 1,
          y: 0
        } : {
          opacity: 0,
          y: 40
        }} transition={{
          delay: 0.1,
          duration: 0.6,
          ease: easings.easeOutExpo
        }}>
            <h4 className="font-semibold mb-4">Navigatie</h4>
            <ul className="space-y-2 text-sm">
              {navigationLinks.map((link, index) => <motion.li key={link.to} initial={{
              opacity: 0,
              x: -15
            }} animate={isInView ? {
              opacity: 1,
              x: 0
            } : {
              opacity: 0,
              x: -15
            }} transition={{
              delay: 0.2 + index * 0.05,
              duration: 0.4,
              ease: easings.easeOutExpo
            }}>
                  <Link to={link.to} className="text-muted-foreground hover:text-foreground transition-colors inline-block">
                    <motion.span whileHover={shouldReduceMotion ? {} : {
                  x: 4
                }} transition={{
                  duration: 0.2
                }} className="inline-block">
                      {link.label}
                    </motion.span>
                  </Link>
                </motion.li>)}
            </ul>
          </motion.div>
          
          <motion.div initial={{
          opacity: 0,
          y: 40
        }} animate={isInView ? {
          opacity: 1,
          y: 0
        } : {
          opacity: 0,
          y: 40
        }} transition={{
          delay: 0.2,
          duration: 0.6,
          ease: easings.easeOutExpo
        }}>
            <h4 className="font-semibold mb-4">Juridisch</h4>
            <ul className="space-y-2 text-sm">
              {legalLinks.map((link, index) => <motion.li key={link.to} initial={{
              opacity: 0,
              x: -15
            }} animate={isInView ? {
              opacity: 1,
              x: 0
            } : {
              opacity: 0,
              x: -15
            }} transition={{
              delay: 0.3 + index * 0.05,
              duration: 0.4,
              ease: easings.easeOutExpo
            }}>
                  <Link to={link.to} className="text-muted-foreground hover:text-foreground transition-colors inline-block">
                    <motion.span whileHover={shouldReduceMotion ? {} : {
                  x: 4
                }} transition={{
                  duration: 0.2
                }} className="inline-block">
                      {link.label}
                    </motion.span>
                  </Link>
                </motion.li>)}
            </ul>
          </motion.div>
          
          <motion.div initial={{
          opacity: 0,
          y: 40
        }} animate={isInView ? {
          opacity: 1,
          y: 0
        } : {
          opacity: 0,
          y: 40
        }} transition={{
          delay: 0.3,
          duration: 0.6,
          ease: easings.easeOutExpo
        }}>
            <h4 className="font-semibold mb-4">Bedrijf</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="https://www.google.com/maps/dir//De+Trompet+18H,+1601+MK+Enkhuizen/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x47c8a3932165dee3:0xecaa07e808a362fc?sa=X&ved=1t:707&ictx=111" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                  De Trompet 18H<br />1601 MK Enkhuizen
                </a>
              </li>
              <li>KVK: 99229781</li>
              <li>BTW: NL005377205B80</li>
            </ul>
          </motion.div>
          
          <motion.div initial={{
          opacity: 0,
          y: 40
        }} animate={isInView ? {
          opacity: 1,
          y: 0
        } : {
          opacity: 0,
          y: 40
        }} transition={{
          delay: 0.4,
          duration: 0.6,
          ease: easings.easeOutExpo
        }}>
            <h4 className="font-semibold mb-4">Klaar voor de volgende stap?</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Laten we samen jouw digitale succes realiseren
            </p>
            <motion.div whileHover={shouldReduceMotion ? {} : {
            scale: 1.03,
            y: -2
          }} whileTap={shouldReduceMotion ? {} : {
            scale: 0.98
          }} transition={{
            duration: 0.2,
            ease: easings.easeOutQuart
          }}>
              <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link to="/contact">Neem contact op</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
        
        <motion.div className="border-t border-border pt-8 text-center text-sm text-muted-foreground" initial={{
        opacity: 0,
        y: 20
      }} animate={isInView ? {
        opacity: 1,
        y: 0
      } : {
        opacity: 0,
        y: 20
      }} transition={{
        delay: 0.5,
        duration: 0.5,
        ease: easings.easeOutExpo
      }}>
          <p>© {new Date().getFullYear()} Nieuwblik. Alle rechten voorbehouden.</p>
        </motion.div>
      </div>
    </footer>;
};
export default Footer;