import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import SEOHead from "@/components/SEOHead";
import ProjectCard from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import SocialContentSection from "@/components/SocialContentSection";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { fadeUp, staggerContainer, staggerItem, scaleUp, easings } from "@/lib/motion";

import { projects } from "@/data/projects";

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
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

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
        title="Portfolio | Website & Webshop Projecten Enkhuizen - Nieuwblik"
        description="Bekijk onze portfolio: websites en webshops uit West-Friesland. Van MKB tot e-commerce, ontdek wat ons webdesign bureau in Enkhuizen voor jou kan betekenen."
        keywords="webdesign portfolio Enkhuizen, website voorbeelden West-Friesland, webshop projecten, e-commerce cases, website laten maken"
        canonicalUrl="https://nieuwblik.com/portfolio"
        structuredData={structuredData}
        breadcrumbs={[
          { name: "Home", url: "https://nieuwblik.com" },
          { name: "Portfolio", url: "https://nieuwblik.com/portfolio" }
        ]}
      />
      <Navigation />

      {/* Breadcrumb */}
      <section className="pt-32 pb-0">
        <div className="container mx-auto px-6">
          <Breadcrumb items={[{ label: "Portfolio", path: "/portfolio" }]} />
        </div>
      </section>

      {/* Hero Section */}
      <motion.section
        className="pb-20 md:pb-28"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="container mx-auto px-6">
          <motion.p
            className="text-accent mb-6"
            variants={fadeUp}
          >
            ONS PORTFOLIO
          </motion.p>
          <motion.h1
            className="text-display mb-6"
            variants={fadeUp}
          >
            Bewezen successen die spreken
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl font-light"
            variants={fadeUp}
          >
            Elk project vertelt een uniek verhaal van groei, creativiteit en resultaat. Ontdek hoe wij bedrijven helpen hun digitale doelen te bereiken.
          </motion.p>
        </div>
      </motion.section>

      {/* Filter Section */}
      <motion.section
        className="pb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5, ease: easings.easeOutExpo }}
      >
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {filters.map((filter, index) => (
              <motion.button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-colors ${activeFilter === filter.id
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                  }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: shouldReduceMotion ? 0 : index * 0.05,
                  duration: 0.3,
                  ease: easings.easeOutExpo
                }}
                whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -2 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              >
                {filter.label}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Portfolio Grid */}
      <AnimatePresence mode="wait">
        {showProjects && (
          <motion.section
            className="pb-20 md:pb-32"
            key="projects"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
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
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredProjects.map((project, index) => (
                    <motion.div
                      key={project.title}
                      variants={staggerItem}
                    >
                      <ProjectCard
                        title={project.title}
                        category={project.category}
                        description={project.description}
                        image={project.image}
                        url={project.url}
                        tags={project.tags}
                        slug={project.slug}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* E-commerce Listings Section */}
      <AnimatePresence mode="wait">
        {showEcommerce && (
          <motion.section
            className="pb-20 md:pb-32"
            key="ecommerce"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-6">
              <motion.div
                className="mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, ease: easings.easeOutExpo }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">E-commerce listings</h2>
                <p className="text-muted-foreground text-lg font-light">
                  Professionele productpresentaties die verkopen stimuleren
                </p>
              </motion.div>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                {ecommerceListings.map((listing, index) => (
                  <motion.div
                    key={listing.title}
                    className="group cursor-pointer block"
                    onClick={() => setSelectedImage(listing.image)}
                    variants={staggerItem}
                  >
                    <motion.div
                      className="aspect-[4/3] bg-secondary rounded-lg mb-6 overflow-hidden relative"
                      whileHover={shouldReduceMotion ? {} : {
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                      }}
                      transition={{ duration: 0.3, ease: easings.easeOutExpo }}
                    >
                      <motion.img
                        src={listing.image}
                        alt={listing.title}
                        loading="lazy"
                        decoding="async"
                        width="800"
                        height="600"
                        className="w-full h-full object-cover object-top"
                        whileHover={shouldReduceMotion ? {} : { scale: 1.08 }}
                        transition={{ duration: 0.5, ease: easings.easeOutExpo }}
                      />
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-accent/20 to-background/80 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.span
                          className="text-sm font-medium bg-background px-6 py-3 rounded-full shadow-lg"
                          initial={{ y: 10, opacity: 0 }}
                          whileHover={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.2, delay: 0.1 }}
                        >
                          Klik om te vergroten
                        </motion.span>
                      </motion.div>
                    </motion.div>
                    <div>
                      <p className="text-sm text-accent font-light mb-2">{listing.category}</p>
                      <h3 className="text-2xl font-semibold mb-2 group-hover:text-accent transition-colors">{listing.title}</h3>
                      <p className="text-muted-foreground mb-4 font-light">{listing.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {listing.tags.map((tag, idx) => (
                          <motion.span
                            key={idx}
                            className="text-xs px-3 py-1 bg-secondary rounded-full text-muted-foreground"
                            whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                          >
                            {tag}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Social Content Section / Videos */}
      {showVideos && <SocialContentSection />}

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-7xl w-[95vw] h-[95vh] p-0 overflow-hidden border-0">
          <AnimatePresence>
            {selectedImage && (
              <motion.img
                src={selectedImage}
                alt="E-commerce listing"
                className="w-full h-full object-contain"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: easings.easeOutExpo }}
              />
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      {/* CTA Section */}
      <motion.section
        className="py-20 md:py-32 bg-gradient-to-br from-primary to-accent bg-[length:200%_200%] animate-gradient-shift"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6 text-primary-foreground"
            variants={fadeUp}
          >
            Klaar om jouw succesverhaal te schrijven?
          </motion.h2>
          <motion.p
            className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto font-light"
            variants={fadeUp}
          >
            Laten we samen werken aan een project waar jij net zo trots op bent als wij.
          </motion.p>
          <motion.div
            variants={fadeUp}
            whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            transition={{ duration: 0.2, ease: easings.easeOutQuart }}
          >
            <Button asChild size="lg" variant="secondary">
              <Link to="/contact">Start je project</Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
};

export default Portfolio;
