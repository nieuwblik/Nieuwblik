import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Import project images
import bushidoshopImg from "@/assets/projects/bushidoshop.nl.png";
import carbon6Img from "@/assets/projects/carbon6.nl.png";
import caspernieskensptImg from "@/assets/projects/caspernieskenspt.nl.png";
import edventureboatsImg from "@/assets/projects/edventureboats.nl.png";
import esveldinstallatieImg from "@/assets/projects/esveldinstallatie.nl.png";
import interieurstudiolaan from "@/assets/projects/interieurstudiolaan.nl.png";
import karateschoolcorslokImg from "@/assets/projects/karateschoolcorslok.nl.png";
import kyodaioriginalsImg from "@/assets/projects/kyodaioriginals.nl.png";
import lashlutionImg from "@/assets/projects/lashlution.nl.png";
import mhbtechniekImg from "@/assets/projects/mhbtechniek.nl.png";
import feitsmadakwerkenImg from "@/assets/projects/feitsmadakwerken.nl.png";
import greenProfitImg from "@/assets/projects/green-profit.nl.png";
import vdvtuinenImg from "@/assets/projects/vdvtuinen.nl.png";
import prideMobilityImg from "@/assets/projects/pride-mobility.nl.png";
import rrsroyalImg from "@/assets/projects/rrsroyal.nl.png";

const Portfolio = () => {
  const { t } = useLanguage();

  const projects = [
    {
      title: "Bushido Shop",
      category: "E-commerce",
      description: "E-commerce platform for Japanese martial arts equipment and authentic cultural items.",
      tags: ["E-commerce", "Web Design", "Branding"],
      image: bushidoshopImg,
      url: "https://bushidoshop.nl"
    },
    {
      title: "Carbon6",
      category: "Real Estate",
      description: "Modern property listing platform with advanced search and room browsing features.",
      tags: ["Web Development", "Real Estate", "UI/UX"],
      image: carbon6Img,
      url: "https://carbon6.nl"
    },
    {
      title: "Casper Nieskens PT",
      category: "Personal Training",
      description: "Professional fitness coaching platform with personalized training programs.",
      tags: ["Web Design", "Fitness", "Branding"],
      image: caspernieskensptImg,
      url: "https://caspernieskenspt.nl"
    },
    {
      title: "Edventure Boats",
      category: "Adventure & Tourism",
      description: "Water adventure booking platform for thrilling boat experiences.",
      tags: ["Web Design", "Booking System", "Tourism"],
      image: edventureboatsImg,
      url: "https://edventureboats.com"
    },
    {
      title: "Esveld Installatie",
      category: "Installation Services",
      description: "Professional HVAC and installation services website with client portal.",
      tags: ["Web Design", "Service Business", "Contact Forms"],
      image: esveldinstallatieImg,
      url: "https://esveldinstallatie.nl"
    },
    {
      title: "Interieur Studio Laan",
      category: "Interior Design",
      description: "Elegant interior design showcase with portfolio gallery and consultation booking.",
      tags: ["Web Design", "Interior Design", "Portfolio"],
      image: interieurstudiolaan,
      url: "https://interieurstudiolaan.nl"
    },
    {
      title: "Karate School Cor Slok",
      category: "Martial Arts",
      description: "Dynamic karate school website with class schedules and member portal.",
      tags: ["Web Design", "Sports", "Community"],
      image: karateschoolcorslokImg,
      url: "https://karateschoolcorslok.nl"
    },
    {
      title: "Kyodai Originals",
      category: "E-commerce",
      description: "Specialized e-commerce platform for authentic Japanese collectibles and originals.",
      tags: ["E-commerce", "Product Showcase", "Branding"],
      image: kyodaioriginalsImg,
      url: "https://kyodaioriginals.nl"
    },
    {
      title: "Lashlution",
      category: "Beauty & Wellness",
      description: "Premium lash extensions and beauty services booking platform.",
      tags: ["Web Design", "Beauty", "Booking System"],
      image: lashlutionImg,
      url: "https://lashlution.nl"
    },
    {
      title: "MHB Techniek",
      category: "Technical Services",
      description: "Smart home technology solutions with service booking and consultation features.",
      tags: ["Web Development", "Technology", "Service Business"],
      image: mhbtechniekImg,
      url: "https://mhbtechniek.nl"
    },
    {
      title: "Feitsma Dakwerken",
      category: "Roofing Services",
      description: "Premium roofing services website with project showcase and consultation booking.",
      tags: ["Web Design", "Construction", "Service Business"],
      image: feitsmadakwerkenImg,
      url: "https://feitsmadakwerken.nl"
    },
    {
      title: "Green Profit",
      category: "Sustainable Solutions",
      description: "Sustainable building and energy solutions platform with comprehensive service offerings.",
      tags: ["Web Design", "Sustainability", "Services"],
      image: greenProfitImg,
      url: "https://green-profit.nl"
    },
    {
      title: "VdV Tuinen",
      category: "Landscaping & Gardens",
      description: "Professional garden design and landscaping services with portfolio showcase.",
      tags: ["Web Design", "Landscaping", "Portfolio"],
      image: vdvtuinenImg,
      url: "https://vdvtuinen.nl"
    },
    {
      title: "Pride Mobility",
      category: "Mobility Solutions",
      description: "Quality mobility products and services for enhanced independence and lifestyle.",
      tags: ["E-commerce", "Healthcare", "Accessibility"],
      image: prideMobilityImg,
      url: "https://pride-mobility.nl"
    },
    {
      title: "RRS Royal",
      category: "Construction Partner",
      description: "Complete construction partnership website with project management features.",
      tags: ["Web Design", "Construction", "Business"],
      image: rrsroyalImg,
      url: "https://rrsroyal.nl"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="container mx-auto px-6">
          <p className="text-accent mb-6">{t("portfolio.label")}</p>
          <h1 className="text-display mb-6">
            {t("portfolio.title")}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl font-light">
            {t("portfolio.description")}
          </p>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="pb-20 md:pb-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {projects.map((project, index) => (
              <a 
                key={index}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group cursor-pointer block"
              >
                <div className="aspect-[4/3] bg-secondary rounded-lg mb-6 overflow-hidden relative">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-sm font-medium bg-background px-6 py-3 rounded-full flex items-center gap-2 shadow-lg">
                      {t("portfolio.viewWebsite")}
                      <ExternalLink className="w-4 h-4" />
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-accent font-light mb-2">{project.category}</p>
                  <h3 className="text-2xl font-semibold mb-2 group-hover:text-accent transition-colors">{project.title}</h3>
                  <p className="text-muted-foreground mb-4 font-light">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, idx) => (
                      <span 
                        key={idx}
                        className="text-xs px-3 py-1 bg-secondary rounded-full text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-secondary">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t("portfolio.cta.title")}
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto font-light">
            {t("portfolio.cta.description")}
          </p>
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link to="/contact">{t("portfolio.cta.button")}</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Portfolio;
