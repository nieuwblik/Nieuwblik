import { SITE_URL } from "@/config/site";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import SEOHead from "@/components/SEOHead";
import PortfolioCard from "@/components/PortfolioCard";
import { useState, useEffect, lazy, Suspense } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { fadeUp, staggerContainer, staggerItem, scaleUp, easings } from "@/lib/motion";

// Lazy load SocialContentSection voor betere performance
const SocialContentSection = lazy(() => import("@/components/SocialContentSection"));

import { projects } from "@/data/projects";

// Merkkleuren voor de filterschakelaar.
const SW_GREEN = "hsl(160, 84%, 16%)";
const SW_RULE_16 = "hsla(160, 12%, 8%, 0.16)";

// Import e-commerce listing images
import kattenbakListingImg from "@/assets/projects/kattenbak-listing.webp";
import hamburgerPressListingImg from "@/assets/projects/hamburger-press-listing.webp";
import schoenenWolListingImg from "@/assets/projects/schoenen-wol-listing.webp";
import pastamachineListingImg from "@/assets/projects/pastamachine-listing.webp";
import compressorListingImg from "@/assets/projects/compressor-listing.webp";

const Portfolio = () => {
  // Dark CTA band: invert the fixed header while it's under it.
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();
  // Removed artificial loading state for instant rendering

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
  ];

  const filteredProjects = activeFilter === "all"
    ? projects
    : projects.filter(project => project.filterCategory === activeFilter);

  const showVideos = activeFilter === "all";
  const showEcommerce = activeFilter === "all" || activeFilter === "e-commerce";
  const showProjects = activeFilter !== "e-commerce";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Portfolio - Nieuwblik",
    "description": "Bekijk onze portfolio met succesvolle webdesign projecten, e-commerce oplossingen en branding cases.",
    "url": `${SITE_URL}/portfolio`,
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
        canonicalUrl={`${SITE_URL}/portfolio`}
        structuredData={structuredData}
        breadcrumbs={[
          { name: "Home", url: SITE_URL },
          { name: "Portfolio", url: `${SITE_URL}/portfolio` }
        ]}
      />

      {/* Breadcrumb */}
      <section className="pt-32 pb-8 md:pb-12">
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
          {/* Rustige schakelaar: één witte houder, de actieve keuze in het
              donkergroen. Geen schaduw of optillen; kleur via CSS-transities,
              zodat er na het hoveren geen kleur blijft hangen. */}
          <div className="flex justify-center">
            <div
              role="group"
              aria-label="Filter projecten"
              className="inline-flex flex-wrap justify-center gap-1 rounded-full border bg-white p-1"
              style={{ borderColor: SW_RULE_16 }}
            >
              {filters.map((filter) => {
                const active = activeFilter === filter.id;
                return (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => setActiveFilter(filter.id)}
                    aria-pressed={active}
                    className={`font-epilogue rounded-full px-5 py-2 text-sm font-medium transition-colors duration-200 ${
                      active ? "text-white" : "text-[hsla(160,14%,7%,0.6)] hover:bg-[hsl(150,14%,97.5%)] hover:text-[hsl(160,14%,7%)]"
                    }`}
                    style={active ? { background: SW_GREEN } : undefined}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Portfolio Grid */}
      <AnimatePresence mode="popLayout">
        {showProjects && (
          <motion.section
            className="pb-20 md:pb-32"
            key="projects"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="container mx-auto px-6">
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16 md:gap-y-20"
                layout
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: shouldReduceMotion ? 0 : 0.05,  // Faster stagger for switching
                      delayChildren: 0
                    }
                  }
                }}
              >
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.slug}  // Use slug for better key stability
                    layout
                    variants={{
                      hidden: { opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 },
                      visible: {
                        opacity: 1,
                        scale: 1,
                        transition: {
                          duration: 0.3,  // Faster for switching
                          ease: [0.25, 0.1, 0.25, 1]
                        }
                      }
                    }}
                    exit={{
                      opacity: 0,
                      scale: shouldReduceMotion ? 1 : 0.95,
                      transition: { duration: 0.2 }
                    }}
                    style={{ willChange: 'transform, opacity' }}
                  >
                    <PortfolioCard
                      title={project.title}
                      category={project.category}
                      description={project.description}
                      image={project.image}
                      {...(project.imageSet ? { imageSet: project.imageSet } : {})}
                      slug={project.slug}
                      meta={project.tags.slice(0, 2).join(" · ")}
                      priority={index < 2}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* E-commerce Listings Section */}
      <AnimatePresence mode="popLayout">
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
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: shouldReduceMotion ? 0 : 0.08,
                      delayChildren: 0.1
                    }
                  }
                }}
              >
                {ecommerceListings.map((listing, index) => (
                  <motion.div
                    key={listing.title}
                    className="group cursor-pointer block"
                    onClick={() => setSelectedImage(listing.image)}
                    variants={{
                      hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: 0.5,
                          ease: [0.25, 0.1, 0.25, 1]
                        }
                      }
                    }}
                    style={{ willChange: 'transform, opacity' }}
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
      {showVideos && (
        <Suspense fallback={
          <section className="py-20 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <Skeleton className="h-12 w-96 mx-auto mb-4" />
                <Skeleton className="h-6 w-full max-w-3xl mx-auto" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="aspect-[9/16] rounded-2xl" />
                ))}
              </div>
            </div>
          </section>
        }>
          <SocialContentSection />
        </Suspense>
      )}

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-7xl w-[95vw] h-[95vh] p-0 overflow-hidden border-0">
          <AnimatePresence>
            {selectedImage && (
              <motion.img
                src={selectedImage}
                alt="E-commerce listing"
                className="w-full h-full object-contain"
                loading="lazy"
                decoding="async"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: easings.easeOutExpo }}
              />
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Portfolio;
