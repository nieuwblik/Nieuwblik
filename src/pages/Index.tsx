import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ToolsSlider from "@/components/ToolsSlider";
import { DesignCarousel } from "@/components/DesignCarousel";
import FeaturedBlogPosts from "@/components/FeaturedBlogPosts";
import FAQSection from "@/components/FAQSection";
import ProjectCard from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Link } from "react-router-dom";
import { ArrowRight, Globe, Palette, ShoppingBag, Pen, Linkedin } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion, useReducedMotion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import justinImage from "@/assets/justin-slok.png";
import heroTeamImage from "@/assets/justin-job-min.png";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import SocialContentSection from "@/components/SocialContentSection";
import { easings } from "@/lib/motion";
import { MagicCard } from "@/components/ui/magic-card";
import { useTheme } from "next-themes";
import { MagicServicesCards } from "@/components/MagicServicesCards";

// Import AI logos
import claudeLogo from "@/assets/ai/claude-logo.png";
import copilotLogo from "@/assets/ai/copilot-logo.png";
import grokLogo from "@/assets/ai/grok-logo.png";
import perplexityLogo from "@/assets/ai/perplexity-logo.png";

// Import Nieuwblik logo
import nieuwblikLogo from "@/assets/logo.png";

// Import featured project images
import bushidoshopImg from "@/assets/projects/bushidoshop.nl.png";
import karateschoolcorslokImg from "@/assets/projects/karateschoolcorslok.nl.png";
import esveldinstallatieImg from "@/assets/projects/esveldinstallatie.nl.png";
import feitsmadakwerkenImg from "@/assets/projects/feitsmadakwerken.nl.png";

// Animation component for scroll-triggered reveals
const AnimatedSection = ({
  children,
  className = "",
  delay = 0
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 80 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: shouldReduceMotion ? 0 : 80 }}
      transition={{
        duration: shouldReduceMotion ? 0.2 : 0.8,
        delay: shouldReduceMotion ? 0 : delay,
        ease: easings.easeOutExpo
      }}
    >
      {children}
    </motion.div>
  );
};

// Animated text component
const AnimatedText = ({
  children,
  className = "",
  delay = 0,
  as: Component = "div"
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "p" | "h1" | "h2" | "h3" | "span";
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });
  const shouldReduceMotion = useReducedMotion();

  const MotionComponent = motion[Component];

  return (
    <MotionComponent
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: shouldReduceMotion ? 0 : 50 }}
      transition={{
        duration: shouldReduceMotion ? 0.2 : 0.7,
        delay: shouldReduceMotion ? 0 : delay,
        ease: easings.easeOutExpo
      }}
    >
      {children}
    </MotionComponent>
  );
};

// Hero Photo Card with scroll zoom effect
const HeroPhotoCard = ({
  heroTeamImage,
  shouldReduceMotion
}: {
  heroTeamImage: string;
  shouldReduceMotion: boolean | null;
}) => {
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  // Subtle zoom effect: scale from 1 to 1.08 as you scroll
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 1.08]);

  return (
    <div className="relative order-1 lg:order-2 flex justify-center" ref={cardRef}>
      {/* Card Container - 25% bigger on desktop */}
      <motion.div
        className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[380px] lg:max-w-[550px] xl:max-w-[625px]"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.1, ease: easings.easeOutExpo }}
      >
        {/* Green Gradient Card Background */}
        <div
          className="relative rounded-2xl sm:rounded-3xl lg:rounded-[2rem] overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, hsl(160 84% 20%) 0%, hsl(160 84% 16%) 50%, hsl(160 70% 12%) 100%)'
          }}
        >
          {/* Subtle gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/5" />

          {/* Photo - Animates from bottom with scroll zoom and hover effect */}
          <motion.div
            className="relative pt-8 sm:pt-10 md:pt-12 lg:pt-16 px-4 sm:px-6 md:px-8 lg:px-10 overflow-hidden"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: easings.easeOutExpo }}
          >
            <motion.img
              src={heroTeamImage}
              alt="Justin & Job - Nieuwblik Team"
              className="w-full h-auto relative z-10 cursor-pointer"
              style={{ scale: shouldReduceMotion ? 1 : imageScale }}

              loading="eager"
              fetchPriority="high"
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

const Index = () => {
  const shouldReduceMotion = useReducedMotion();
  const { theme } = useTheme();



  const featuredProjects = [
    {
      title: "Bushido Shop",
      category: "E-commerce",
      description: "E-commerce platform voor Japanse vechtsportartikelen en authentieke culturele items.",
      tags: ["E-commerce", "Web Design", "Branding"],
      image: bushidoshopImg,
      url: "https://bushidoshop.nl"
    },
    {
      title: "Karateschool Cor Slok",
      category: "Vechtsport & Training",
      description: "Professionele karateschool website met lesrooster, inschrijvingen en informatie over trainingen.",
      tags: ["Web Design", "Sport", "Community"],
      image: karateschoolcorslokImg,
      url: "https://karateschoolcorslok.nl"
    },
    {
      title: "Esveld Installatie",
      category: "Installatiebedrijf",
      description: "Professionele installatie website met projectportfolio en direct contact voor offertes.",
      tags: ["Web Design", "Dienstverlening", "Contact Formulieren"],
      image: esveldinstallatieImg,
      url: "https://esveldinstallatie.nl"
    },
    {
      title: "Feitsma Dakwerken",
      category: "Dakdekkers & Aannemers",
      description: "Professioneel dakdekkersbedrijf platform met showcases van dakwerkzaamheden en aannemingsprojecten.",
      tags: ["Web Design", "Bouw", "Dienstverlening"],
      image: feitsmadakwerkenImg,
      url: "https://feitsmadakwerken.nl"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section - Visual Poetry Layout */}
      <section className="relative min-h-screen overflow-hidden bg-background pt-36 pb-12 sm:pt-40 sm:pb-16 md:pt-44 md:pb-20 lg:pt-40 lg:pb-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 xl:gap-16 items-center">

            {/* Left Side - Content */}
            <div className="relative z-10 order-2 lg:order-1 text-center lg:text-left">
              {/* Label */}
              <motion.p
                className="text-accent mb-3 md:mb-4 tracking-[0.2em] text-sm font-medium"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: easings.easeOutExpo }}
              >
                DIGITALE GROEI BEGINT HIER
              </motion.p>

              {/* Large Typography Title - Readable */}
              <div className="mb-4 md:mb-6">
                <motion.h1
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-black leading-[1.1] tracking-tight"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1, ease: easings.easeOutExpo }}
                >
                  <span className="block">Van visie naar</span>
                  <motion.span
                    className="block text-accent"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.2, ease: easings.easeOutExpo }}
                  >
                    viraal succes
                  </motion.span>
                </motion.h1>
              </div>

              {/* Description */}
              <motion.p
                className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 font-light leading-relaxed max-w-lg mx-auto lg:mx-0"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: easings.easeOutExpo }}
              >
                Jouw merk verdient meer dan standaardoplossingen. Wij creëren websites en designs die emotie wekken, conversies stimuleren en je bedrijf naar nieuwe hoogtes tillen.
              </motion.p>

              {/* Social Icons Row - with proper icons */}
              <motion.div
                className="flex gap-2 sm:gap-3 mb-6 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4, ease: easings.easeOutExpo }}
              >
                {/* X (Twitter) */}
                <motion.a
                  href="https://x.com/justin_slok"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-foreground/20 flex items-center justify-center hover:border-accent hover:bg-accent hover:text-accent-foreground transition-all duration-300"
                  aria-label="X (Twitter)"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.4, ease: easings.softBounce }}
                  whileHover={shouldReduceMotion ? {} : { scale: 1.1, y: -3 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </motion.a>

                {/* LinkedIn */}
                <motion.a
                  href="https://www.linkedin.com/in/justin-slok-b8a3011b2/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-foreground/20 flex items-center justify-center hover:border-accent hover:bg-accent hover:text-accent-foreground transition-all duration-300"
                  aria-label="LinkedIn"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.58, duration: 0.4, ease: easings.softBounce }}
                  whileHover={shouldReduceMotion ? {} : { scale: 1.1, y: -3 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                >
                  <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.a>

                {/* WhatsApp */}
                <motion.a
                  href="https://wa.me/31646253607"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:opacity-80"
                  style={{ backgroundColor: '#25D366' }}
                  aria-label="WhatsApp"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.66, duration: 0.4, ease: easings.softBounce }}
                  whileHover={shouldReduceMotion ? {} : { scale: 1.1, y: -3 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="white" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </motion.a>
              </motion.div>

              {/* Stats Row */}
              <motion.div
                className="flex gap-6 sm:gap-8 md:gap-10 mb-6 md:mb-8 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5, ease: easings.easeOutExpo }}
              >
                <div>
                  <motion.p
                    className="text-2xl sm:text-3xl md:text-4xl font-black italic"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.5, ease: easings.softBounce }}
                  >
                    <span className="text-accent">+</span>50
                  </motion.p>
                  <p className="text-xs text-muted-foreground font-light leading-tight mt-1 max-w-[120px]">
                    Websites die resultaat opleveren
                  </p>
                </div>
                <div>
                  <motion.p
                    className="text-2xl sm:text-3xl md:text-4xl font-black italic"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7, duration: 0.5, ease: easings.softBounce }}
                  >
                    <span className="text-accent">+</span>100%
                  </motion.p>
                  <p className="text-xs text-muted-foreground font-light leading-tight mt-1 max-w-[120px]">
                    Tevreden klanten die terugkomen
                  </p>
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start items-center lg:items-start"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6, ease: easings.easeOutExpo }}
              >
                <AnimatedButton to="/start-je-project" size="lg">
                  Start je transformatie
                </AnimatedButton>
                <motion.div
                  whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                  transition={{ duration: 0.2, ease: easings.easeOutQuart }}
                >
                  <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                    <Link to="/portfolio">Ontdek portfolio</Link>
                  </Button>
                </motion.div>
              </motion.div>
            </div>

            {/* Right Side - Card with Photo */}
            <HeroPhotoCard heroTeamImage={heroTeamImage} shouldReduceMotion={shouldReduceMotion} />
          </div>
        </div>

        {/* Background Decorative Elements */}
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-accent/5 rounded-full blur-3xl pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-48 h-48 bg-accent/5 rounded-full blur-3xl pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
        />
      </section>

      {/* Services Overview */}
      <section className="py-20 md:py-32 bg-secondary">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <AnimatedText as="p" className="text-accent mb-4">WAT WIJ DOEN</AnimatedText>
            <AnimatedText as="h2" className="text-4xl md:text-5xl font-bold mb-6" delay={0.1}>
              Jouw succes, onze passie
            </AnimatedText>
            <AnimatedText as="p" className="text-xl text-muted-foreground max-w-3xl mx-auto font-light" delay={0.2}>
              Elk project krijgt onze volledige toewijding. Van strategie tot uitvoering - wij zorgen dat jouw digitale aanwezigheid niet alleen gezien wordt, maar ook gewaardeerd.
            </AnimatedText>
          </div>

          <MagicServicesCards />

          <AnimatedSection delay={0.4} className="text-center mt-12">
            <motion.div
              whileHover={shouldReduceMotion ? {} : { scale: 1.03, y: -2 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              transition={{ duration: 0.2, ease: easings.easeOutQuart }}
            >
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link to="/diensten">Kies hier jouw service</Link>
              </Button>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <AnimatedText as="p" className="text-accent mb-4">ERVARING SPREEKT</AnimatedText>
            <AnimatedText as="h2" className="text-4xl md:text-5xl font-bold mb-6" delay={0.1}>
              Projecten waar we trots op zijn
            </AnimatedText>
            <AnimatedText as="p" className="text-xl text-muted-foreground max-w-3xl mx-auto font-light" delay={0.2}>
              Van startups tot gevestigde namen, wij helpen bedrijven hun digitale dromen waar te maken met designs die indruk maken en resultaten leveren.
            </AnimatedText>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12">
            {featuredProjects.map((project, index) => (
              <AnimatedSection key={index} delay={index * 0.15}>
                <ProjectCard
                  title={project.title}
                  category={project.category}
                  description={project.description}
                  image={project.image}
                  url={project.url}
                  tags={project.tags}
                />
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.4} className="text-center">
            <motion.div
              whileHover={shouldReduceMotion ? {} : { scale: 1.03, y: -2 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              transition={{ duration: 0.2, ease: easings.easeOutQuart }}
            >
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link to="/portfolio">Alle projecten bekijken</Link>
              </Button>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* Design Carousel Section */}
      <DesignCarousel />

      {/* Social Content Section */}
      <SocialContentSection />

      {/* SEO Search Engines Section - Integration Animation */}
      <section className="py-16 md:py-24 lg:py-32 bg-secondary overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 md:mb-12">
            <AnimatedText as="h2" className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6">
              Jouw website vindbaar in alle zoekmachines
            </AnimatedText>
            <AnimatedText as="p" className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto font-light leading-relaxed" delay={0.1}>
              Of je klanten nu zoeken via Google, vragen stellen aan ChatGPT, of advies vragen aan Claude - jouw website wordt gevonden.
            </AnimatedText>
          </div>

          {/* Integration Animation */}
          <AnimatedSection delay={0.2} className="relative mx-auto max-w-5xl">
            {/* Search Engine Icons Row - Responsive Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4 md:gap-6 lg:gap-8 justify-items-center max-w-2xl sm:max-w-none mx-auto">
              {/* Google */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.span
                      className="inline-flex h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 items-center justify-center rounded-xl bg-white ring-1 ring-border shadow-md"
                      whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
                    >
                      <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                    </motion.span>
                  </TooltipTrigger>
                  <TooltipContent><p>Google</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* OpenAI */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.span
                      className="inline-flex h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 items-center justify-center rounded-xl bg-white ring-1 ring-border shadow-md"
                      whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
                    >
                      <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8">
                        <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" fill="#10A37F" />
                      </svg>
                    </motion.span>
                  </TooltipTrigger>
                  <TooltipContent><p>OpenAI</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Perplexity */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.span
                      className="inline-flex h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 items-center justify-center rounded-xl bg-white ring-1 ring-border shadow-md overflow-hidden"
                      whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
                    >
                      <img src={perplexityLogo} alt="Perplexity AI" className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 object-contain" />
                    </motion.span>
                  </TooltipTrigger>
                  <TooltipContent><p>Perplexity AI</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Claude */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.span
                      className="inline-flex h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 items-center justify-center rounded-xl bg-white ring-1 ring-border shadow-md overflow-hidden"
                      whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
                    >
                      <img src={claudeLogo} alt="Claude AI" className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 object-contain" />
                    </motion.span>
                  </TooltipTrigger>
                  <TooltipContent><p>Claude AI</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Grok */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.span
                      className="inline-flex h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 items-center justify-center rounded-xl bg-white ring-1 ring-border shadow-md overflow-hidden"
                      whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
                    >
                      <img src={grokLogo} alt="Grok (X AI)" className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 object-contain" />
                    </motion.span>
                  </TooltipTrigger>
                  <TooltipContent><p>Grok (X AI)</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Copilot */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.span
                      className="inline-flex h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 items-center justify-center rounded-xl bg-white ring-1 ring-border shadow-md overflow-hidden"
                      whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
                    >
                      <img src={copilotLogo} alt="Microsoft Copilot" className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 object-contain" />
                    </motion.span>
                  </TooltipTrigger>
                  <TooltipContent><p>Microsoft Copilot</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* SVG Connection Lines - Hidden on mobile, visible on sm+ */}
            <div className="hidden sm:block relative mt-4 md:mt-6 h-40 md:h-56 lg:h-64">
              {/* 6 dots centered under each logo using percentages */}
              <svg viewBox="0 0 600 280" className="absolute inset-0 w-full h-full" fill="none" preserveAspectRatio="xMidYMid meet">
                {/* Glow filter */}
                <defs>
                  <filter id="glow-green" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Connection points centered under each logo (6 columns = 100 each, center at 50, 150, 250, 350, 450, 550) */}
                <circle cx="50" cy="15" r="4" fill="hsl(160 84% 39%)" filter="url(#glow-green)">
                  <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="150" cy="15" r="4" fill="hsl(160 84% 39%)" filter="url(#glow-green)">
                  <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="0.2s" repeatCount="indefinite" />
                </circle>
                <circle cx="250" cy="15" r="4" fill="hsl(160 84% 39%)" filter="url(#glow-green)">
                  <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="0.4s" repeatCount="indefinite" />
                </circle>
                <circle cx="350" cy="15" r="4" fill="hsl(160 84% 39%)" filter="url(#glow-green)">
                  <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="0.6s" repeatCount="indefinite" />
                </circle>
                <circle cx="450" cy="15" r="4" fill="hsl(160 84% 39%)" filter="url(#glow-green)">
                  <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="0.8s" repeatCount="indefinite" />
                </circle>
                <circle cx="550" cy="15" r="4" fill="hsl(160 84% 39%)" filter="url(#glow-green)">
                  <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="1s" repeatCount="indefinite" />
                </circle>

                {/* Curved lines from center (300) to each logo */}
                <path d="M300 240 C 300 160, 175 80, 50 15" stroke="hsl(160 84% 39%)" strokeWidth="2" strokeLinecap="round" fill="none" style={{ strokeDasharray: 500, strokeDashoffset: 500 }}>
                  <animate attributeName="stroke-dashoffset" values="500;0;500" dur="3s" begin="0s" repeatCount="indefinite" calcMode="spline" keySplines="0.42 0 0.58 1; 0.42 0 0.58 1" />
                </path>
                <path d="M300 240 C 300 170, 225 100, 150 15" stroke="hsl(160 84% 39%)" strokeWidth="2" strokeLinecap="round" fill="none" style={{ strokeDasharray: 420, strokeDashoffset: 420 }}>
                  <animate attributeName="stroke-dashoffset" values="420;0;420" dur="3s" begin="0.2s" repeatCount="indefinite" calcMode="spline" keySplines="0.42 0 0.58 1; 0.42 0 0.58 1" />
                </path>
                <path d="M300 240 C 300 140, 275 80, 250 15" stroke="hsl(160 84% 39%)" strokeWidth="2" strokeLinecap="round" fill="none" style={{ strokeDasharray: 350, strokeDashoffset: 350 }}>
                  <animate attributeName="stroke-dashoffset" values="350;0;350" dur="3s" begin="0.4s" repeatCount="indefinite" calcMode="spline" keySplines="0.42 0 0.58 1; 0.42 0 0.58 1" />
                </path>
                <path d="M300 240 C 300 140, 325 80, 350 15" stroke="hsl(160 84% 39%)" strokeWidth="2" strokeLinecap="round" fill="none" style={{ strokeDasharray: 350, strokeDashoffset: 350 }}>
                  <animate attributeName="stroke-dashoffset" values="350;0;350" dur="3s" begin="0.6s" repeatCount="indefinite" calcMode="spline" keySplines="0.42 0 0.58 1; 0.42 0 0.58 1" />
                </path>
                <path d="M300 240 C 300 170, 375 100, 450 15" stroke="hsl(160 84% 39%)" strokeWidth="2" strokeLinecap="round" fill="none" style={{ strokeDasharray: 420, strokeDashoffset: 420 }}>
                  <animate attributeName="stroke-dashoffset" values="420;0;420" dur="3s" begin="0.8s" repeatCount="indefinite" calcMode="spline" keySplines="0.42 0 0.58 1; 0.42 0 0.58 1" />
                </path>
                <path d="M300 240 C 300 160, 425 80, 550 15" stroke="hsl(160 84% 39%)" strokeWidth="2" strokeLinecap="round" fill="none" style={{ strokeDasharray: 500, strokeDashoffset: 500 }}>
                  <animate attributeName="stroke-dashoffset" values="500;0;500" dur="3s" begin="1s" repeatCount="indefinite" calcMode="spline" keySplines="0.42 0 0.58 1; 0.42 0 0.58 1" />
                </path>
              </svg>

              {/* Center Logo (Nieuwblik) */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                <motion.span
                  className="inline-flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-xl bg-accent ring-2 ring-accent/40 overflow-hidden"
                  style={{ boxShadow: '0 0 20px rgba(5, 102, 57, 0.5), 0 0 40px rgba(5, 102, 57, 0.25)' }}
                  animate={shouldReduceMotion ? {} : { scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <img src={nieuwblikLogo} alt="Nieuwblik" className="w-10 h-10 md:w-12 md:h-12 object-contain brightness-0 invert" />
                </motion.span>
              </div>
            </div>

            {/* Mobile: Simple center logo without lines */}
            <div className="sm:hidden flex justify-center mt-6">
              <motion.span
                className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-accent ring-2 ring-accent/40 overflow-hidden"
                style={{ boxShadow: '0 0 20px rgba(5, 102, 57, 0.5), 0 0 40px rgba(5, 102, 57, 0.25)' }}
                animate={shouldReduceMotion ? {} : { scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <img src={nieuwblikLogo} alt="Nieuwblik" className="w-10 h-10 object-contain brightness-0 invert" />
              </motion.span>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.4} className="text-center mt-8 md:mt-12">
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto font-light italic mb-6 md:mb-8 px-4">
              "Zichtbaarheid is geen toeval, het is strategie. Wij zorgen dat jouw website de juiste vindbaarheid krijgt - vandaag, morgen, en in de toekomst."
            </p>

            <AnimatedButton to="/contact" size="lg">
              Boost mijn vindbaarheid
            </AnimatedButton>
          </AnimatedSection>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-32 bg-secondary">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <AnimatedText as="p" className="text-accent mb-4">KLANTEN AAN HET WOORD</AnimatedText>
            <AnimatedText as="h2" className="text-4xl md:text-5xl font-bold mb-6" delay={0.1}>
              Jouw succes is ons visitekaartje
            </AnimatedText>
            <AnimatedText as="p" className="text-xl text-muted-foreground max-w-3xl mx-auto font-light" delay={0.2}>
              Niets zegt meer dan de ervaring van tevreden klanten die hun online doelen hebben bereikt en hun verwachtingen overtroffen zagen.
            </AnimatedText>
          </div>

          <AnimatedSection delay={0.2}>
            <TestimonialsCarousel />
          </AnimatedSection>
        </div>
      </section>

      {/* Featured Blog Posts */}
      <FeaturedBlogPosts />

      {/* FAQ Section */}
      <FAQSection />

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary to-accent bg-[length:200%_200%] animate-gradient-shift">
        <div className="container mx-auto px-6 text-center">
          <AnimatedText as="h2" className="text-4xl md:text-6xl font-bold mb-6 text-primary-foreground">
            Klaar om je concurrentie voorbij te streven?
          </AnimatedText>
          <AnimatedText as="p" className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto font-light text-primary-foreground/90" delay={0.1}>
            Laat je verhaal horen. Samen bouwen we een digitale aanwezigheid die niet alleen opvalt, maar ook converteert. De eerste stap? Een vrijblijvend gesprek.
          </AnimatedText>
          <AnimatedSection delay={0.2}>
            <motion.div
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              transition={{ duration: 0.2, ease: easings.easeOutQuart }}
            >
              <Button asChild size="lg" variant="secondary">
                <Link to="/start-je-project">
                  Start vandaag je groeiverhaal
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
