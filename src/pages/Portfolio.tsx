
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import SocialContentSection from "@/components/SocialContentSection";

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

// Import e-commerce listing images
import kattenbakListingImg from "@/assets/projects/kattenbak-listing.png";
import hamburgerPressListingImg from "@/assets/projects/hamburger-press-listing.png";
import schoenenWolListingImg from "@/assets/projects/schoenen-wol-listing.png";
import pastamachineListingImg from "@/assets/projects/pastamachine-listing.png";
import compressorListingImg from "@/assets/projects/compressor-listing.png";

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const projects = [
    {
      title: "Bushido Shop",
      category: "E-commerce",
      filterCategory: "websites",
      description: "E-commerce platform voor Japanse vechtsportartikelen en authentieke culturele items.",
      tags: ["E-commerce", "Web Design", "Branding"],
      image: bushidoshopImg,
      url: "https://bushidoshop.nl"
    },
    {
      title: "Carbon6",
      category: "Vastgoed",
      filterCategory: "websites",
      description: "Modern vastgoed platform met geavanceerde zoekfunctie en kamer browse features.",
      tags: ["Web Development", "Vastgoed", "UI/UX"],
      image: carbon6Img,
      url: "https://carbon6.nl"
    },
    {
      title: "Casper Nieskens PT",
      category: "Personal Training",
      filterCategory: "websites",
      description: "Professioneel fitness coaching platform met gepersonaliseerde trainingsprogramma's.",
      tags: ["Web Design", "Fitness", "Branding"],
      image: caspernieskensptImg,
      url: "https://caspernieskenspt.com"
    },
    {
      title: "Edventure Boats",
      category: "Avontuur & Toerisme",
      filterCategory: "websites",
      description: "Water avontuur boekingsplatform voor spannende boot ervaringen.",
      tags: ["Web Design", "Boekingssysteem", "Toerisme"],
      image: edventureboatsImg,
      url: "https://edventureboats.com"
    },
    {
      title: "Esveld Installatie",
      category: "Installatiediensten",
      filterCategory: "websites",
      description: "Professionele HVAC en installatiediensten website met klant portal.",
      tags: ["Web Design", "Dienstverlening", "Contact Formulieren"],
      image: esveldinstallatieImg,
      url: "https://esveldinstallatie.nl"
    },
    {
      title: "Interieur Studio Laan",
      category: "Interieur Design",
      filterCategory: "websites",
      description: "Elegante interieur design showcase met portfolio galerij en consultatieaanvraag.",
      tags: ["Web Design", "Interieur Design", "Portfolio"],
      image: interieurstudiolaan,
      url: "https://interieurstudiolaan.nl"
    },
    {
      title: "Karate School Cor Slok",
      category: "Vechtsport",
      filterCategory: "websites",
      description: "Dynamische karateschool website met lesroosters en leden portal.",
      tags: ["Web Design", "Sport", "Community"],
      image: karateschoolcorslokImg,
      url: "https://karateschoolcorslok.nl"
    },
    {
      title: "Kyodai Originals",
      category: "E-commerce",
      filterCategory: "websites",
      description: "Gespecialiseerd e-commerce platform voor authentieke Japanse verzamelobjecten.",
      tags: ["E-commerce", "Product Showcase", "Branding"],
      image: kyodaioriginalsImg,
      url: "https://kyodaioriginals.nl"
    },
    {
      title: "Lashlution",
      category: "Beauty & Wellness",
      filterCategory: "websites",
      description: "Premium lash extensions en beauty services boekingsplatform.",
      tags: ["Web Design", "Beauty", "Boekingssysteem"],
      image: lashlutionImg,
      url: "https://lashlution.nl"
    },
    {
      title: "MHB Techniek",
      category: "Technische Diensten",
      filterCategory: "websites",
      description: "Smart home technologie oplossingen met service boeking en consultatie features.",
      tags: ["Web Development", "Technologie", "Dienstverlening"],
      image: mhbtechniekImg,
      url: "https://mhbtechniek.nl"
    },
    {
      title: "Feitsma Dakwerken",
      category: "Dakdekkersdiensten",
      filterCategory: "websites",
      description: "Premium dakdekkersdiensten website met project showcase en consultatieaanvraag.",
      tags: ["Web Design", "Bouw", "Dienstverlening"],
      image: feitsmadakwerkenImg,
      url: "https://feitsmadakwerken.nl"
    },
    {
      title: "Green Profit",
      category: "Duurzame Oplossingen",
      filterCategory: "websites",
      description: "Duurzaam bouwen en energie oplossingen platform met uitgebreid dienstenaanbod.",
      tags: ["Web Design", "Duurzaamheid", "Diensten"],
      image: greenProfitImg,
      url: "https://green-profit.nl"
    },
    {
      title: "VdV Tuinen",
      category: "Tuinaanleg & Tuinen",
      filterCategory: "websites",
      description: "Professioneel tuinontwerp en tuinaanlegdiensten met portfolio showcase.",
      tags: ["Web Design", "Tuinaanleg", "Portfolio"],
      image: vdvtuinenImg,
      url: "https://vdvtuinen.nl"
    },
    {
      title: "Pride Mobility",
      category: "Mobiliteitsoplossingen",
      filterCategory: "websites",
      description: "Kwaliteit mobiliteitsproducten en diensten voor verbeterde onafhankelijkheid en levensstijl.",
      tags: ["E-commerce", "Gezondheidszorg", "Toegankelijkheid"],
      image: prideMobilityImg,
      url: "https://pride-mobility.nl"
    },
    {
      title: "RRS Royal",
      category: "Bouwpartner",
      filterCategory: "websites",
      description: "Complete bouwpartnership website met projectmanagement features.",
      tags: ["Web Design", "Bouw", "Zakelijk"],
      image: rrsroyalImg,
      url: "https://rrsroyal.nl"
    }
  ];

  const ecommerceListings = [
    {
      title: "Kattenbak - Movendo",
      category: "E-commerce Listing",
      description: "Professionele Amazon product listings voor slimme kattenbakken met complete product features en USP's.",
      tags: ["E-commerce", "Product Listing", "Amazon Marketing"],
      image: kattenbakListingImg,
    },
    {
      title: "Q-mate - Drogerballen",
      category: "E-commerce Listing",
      description: "Aantrekkelijke product listings voor duurzame drogerballen met focus op energiebesparing en kwaliteit.",
      tags: ["E-commerce", "Product Listing", "Duurzaam"],
      image: hamburgerPressListingImg,
    },
    {
      title: "Hamburgerpers - Kitchenz",
      category: "E-commerce Listing",
      description: "Visueel sterke Amazon listings voor premium hamburgerpers met duidelijke voordelen en gebruiksgemak.",
      tags: ["E-commerce", "Product Listing", "Keukenartikelen"],
      image: schoenenWolListingImg,
    },
    {
      title: "Pastamachine - Kitchenz",
      category: "E-commerce Listing",
      description: "Complete product story voor premium pastamachines met gedetailleerde USP's en visuele features.",
      tags: ["E-commerce", "Product Listing", "Premium Keuken"],
      image: pastamachineListingImg,
    },
    {
      title: "Compressor - Grobbie",
      category: "E-commerce Listing",
      description: "Technische product listings voor draagbare compressoren met focus op specificaties en gebruikstoepassingen.",
      tags: ["E-commerce", "Product Listing", "Technologie"],
      image: compressorListingImg,
    }
  ];

  const filters = [
    { id: "all", label: "Alles" },
    { id: "websites", label: "Websites" },
    { id: "e-commerce", label: "E-commerce" },
    { id: "brands", label: "Branding" },
    { id: "custom-designs", label: "Custom Design" },
    { id: "videos", label: "Video's" },
  ];

  const filteredProjects = activeFilter === "all" 
    ? projects 
    : projects.filter(project => project.filterCategory === activeFilter);

  const showVideos = activeFilter === "all" || activeFilter === "videos";
  const showEcommerce = activeFilter === "all" || activeFilter === "e-commerce";
  const showProjects = activeFilter !== "videos" && activeFilter !== "e-commerce";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Portfolio - Nieuwblik",
    "description": "Bekijk onze portfolio met succesvolle webdesign projecten, e-commerce oplossingen en branding cases.",
    "url": "https://www.nieuwblik.com/portfolio",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": projects.slice(0, 6).map((project, index) => ({
        "@type": "CreativeWork",
        "position": index + 1,
        "name": project.title,
        "description": project.description,
        "url": project.url
      }))
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Portfolio | Succesvolle Webdesign Projecten - Nieuwblik"
        description="Bekijk onze portfolio met prachtige websites, sterke merkidentiteiten en krachtige e-commerce oplossingen. Van startups tot gevestigde bedrijven - zie wat we kunnen!"
        keywords="webdesign portfolio, website voorbeelden, branding cases, e-commerce projecten, design portfolio"
        canonicalUrl="https://www.nieuwblik.com/portfolio"
        structuredData={structuredData}
      />
      

      {/* Breadcrumb */}
      <section className="pt-32 pb-0">
        <div className="container mx-auto px-6">
          <Breadcrumb items={[{ label: "Portfolio", path: "/portfolio" }]} />
        </div>
      </section>
      
      {/* Hero Section */}
      <section className="pb-20 md:pb-28">
        <div className="container mx-auto px-6">
          <p className="text-accent mb-6">ONS PORTFOLIO</p>
          <h1 className="text-display mb-6">
            Bewezen successen die spreken
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl font-light">
            Elk project vertelt een uniek verhaal van groei, creativiteit en resultaat. Ontdek hoe wij bedrijven helpen hun digitale doelen te bereiken.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="pb-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilter === filter.id
                    ? "bg-primary text-primary-foreground shadow-lg scale-105"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:scale-105"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      {showProjects && (
        <section className="pb-20 md:pb-32">
          <div className="container mx-auto px-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-[4/3] rounded-lg" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-20 w-full" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                {filteredProjects.map((project, index) => (
                <a 
                  key={index}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group cursor-pointer block"
                >
                  <div className="aspect-[16/10] bg-secondary rounded-lg mb-6 overflow-hidden relative">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                    width="800"
                    height="500"
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-sm font-medium bg-background px-6 py-3 rounded-full flex items-center gap-2 shadow-lg">
                        Bekijk website
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
            )}
          </div>
        </section>
      )}

      {/* E-commerce Listings Section */}
      {showEcommerce && (
        <section className="pb-20 md:pb-32">
          <div className="container mx-auto px-6">
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">E-commerce Listings</h2>
              <p className="text-muted-foreground text-lg font-light">
                Professionele productpresentaties die verkopen stimuleren
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {ecommerceListings.map((listing, index) => (
                <div 
                  key={index}
                  className="group cursor-pointer block"
                  onClick={() => setSelectedImage(listing.image)}
                >
                  <div className="aspect-[4/3] bg-secondary rounded-lg mb-6 overflow-hidden relative">
                    <img 
                      src={listing.image} 
                      alt={listing.title}
                      loading="lazy"
                      decoding="async"
                      width="800"
                      height="600"
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-sm font-medium bg-background px-6 py-3 rounded-full shadow-lg">
                        Klik om te vergroten
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-accent font-light mb-2">{listing.category}</p>
                    <h3 className="text-2xl font-semibold mb-2 group-hover:text-accent transition-colors">{listing.title}</h3>
                    <p className="text-muted-foreground mb-4 font-light">{listing.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {listing.tags.map((tag, idx) => (
                        <span 
                          key={idx}
                          className="text-xs px-3 py-1 bg-secondary rounded-full text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Social Content Section / Videos */}
      {showVideos && <SocialContentSection />}

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-7xl w-[95vw] h-[95vh] p-0 overflow-hidden">
          {selectedImage && (
            <img 
              src={selectedImage} 
              alt="E-commerce listing"
              className="w-full h-full object-contain"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary to-accent bg-[length:200%_200%] animate-gradient-shift">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary-foreground">
            Klaar om jouw succesverhaal te schrijven?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto font-light">
            Laten we samen werken aan een project waar jij net zo trots op bent als wij.
          </p>
          <Button asChild size="lg" variant="secondary" className="animate-glow-pulse">
            <Link to="/contact">Start je project</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Portfolio;
