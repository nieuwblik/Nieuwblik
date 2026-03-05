import { motion, useReducedMotion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import {
  MapPin,
  ArrowRight,
  CheckCircle2,
  Phone,
  Users,
  TrendingUp,
  Target,
  Zap,
  Building2,
  ShoppingBag,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { getRegionBySlug } from "@/data/regions";
import { easings } from "@/lib/motion";
import SEOHead from "@/components/SEOHead";
import { companyInfo } from "@/config/company";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";
import heroTeamImage from "@/assets/justin-job-compressed.webp";

const featuredSlugs = ["puur-in-harmonie", "benoted", "danique-kwakman", "erica-van-dijk"];
const featuredProjects = featuredSlugs
  .map((s) => projects.find((p) => p.slug === s))
  .filter(Boolean) as typeof projects;

const WerkgebiedDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const shouldReduceMotion = useReducedMotion();
  const region = slug ? getRegionBySlug(slug) : undefined;

  if (!region) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-background pt-24 pb-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Regio niet gevonden</h1>
            <p className="text-muted-foreground mb-8">
              De regio "{slug}" bestaat niet in ons werkgebied.
            </p>
            <Button asChild>
              <Link to="/werkgebied">Bekijk alle regio's</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const isLocal = region.type === "local";

  const getIntroText = () => {
    if (isLocal) {
      return `Als webdesign bureau gevestigd in Enkhuizen, zijn we vlakbij ${region.name}. Dat betekent snelle service, persoonlijk contact en begrip van de lokale markt.`;
    }
    return `Hoewel we gevestigd zijn in Enkhuizen, werken we graag voor bedrijven in ${region.name}. Door slimme online samenwerking kunnen we ook voor jou een topwebsite bouwen.`;
  };

  const services = [
    {
      icon: <Building2 className="w-5 h-5" />,
      title: `Websites`,
      description: `Professionele websites die perfect aansluiten bij bedrijven in ${region.name}.`,
    },
    {
      icon: <ShoppingBag className="w-5 h-5" />,
      title: "Webshops",
      description: `E-commerce oplossingen waarmee je 24/7 online kunt verkopen.`,
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: "Lokale SEO",
      description: `Beter vindbaar in Google voor "${region.name}" en omgeving.`,
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Supersnel & mobiel",
      description: `Razendsnel ladende websites die perfect werken op elk apparaat.`,
    },
  ];

  const whyPoints = [
    {
      icon: <MapPin className="w-5 h-5" />,
      title: isLocal ? "Lokaal en dichtbij" : "Snelle communicatie",
      text: isLocal
        ? `We zitten vlakbij ${region.name} en kunnen bij je langskomen.`
        : `Via videobellen, e-mail en telefoon blijven we nauw in contact.`,
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Persoonlijke aandacht",
      text: `Je bent geen nummer. We nemen de tijd om jouw bedrijf echt te begrijpen.`,
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: isLocal ? "Lokale kennis" : "Scherpe prijzen",
      text: isLocal
        ? `We begrijpen de markt in ${region.name} en West-Friesland.`
        : `Door onze locatie in Enkhuizen bieden we scherpe prijzen.`,
    },
  ];

  const processSteps = [
    { number: "01", title: "Kennismaking", description: "We bespreken jouw wensen en doelen. Geen verplichtingen." },
    { number: "02", title: "Offerte op maat", description: "Heldere offerte met duidelijke prijzen en planning." },
    { number: "03", title: "Design & bouw", description: "We bouwen je website met regelmatige updates." },
    { number: "04", title: "Live & support", description: "Je website gaat live en we blijven beschikbaar." },
  ];

  return (
    <>
      <SEOHead
        title={`Webdesign ${region.name} | Website Laten Maken ${region.name} - Nieuwblik`}
        description={`Professioneel webdesign bureau voor ${region.name}. Website, webshop of SEO nodig? ${isLocal ? "Lokaal gevestigd in de regio" : "Ook landelijk actief"}. Neem contact op!`}
        keywords={
          region.keywords?.join(", ") ||
          `webdesign ${region.name}, website laten maken ${region.name}, webshop ${region.name}`
        }
      />

      <Navigation />

      <main className="min-h-screen bg-background pt-32 pb-12 sm:pb-20">
        {/* Hero */}
        <section className="container mx-auto px-4 sm:px-6 pb-12 sm:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easings.easeOutExpo }}
            className="max-w-3xl mx-auto text-center"
          >
            <Breadcrumb
              items={[
                { label: "Werkgebied", path: "/werkgebied" },
                { label: region.name, path: `/werkgebied/${region.slug}` },
              ]}
            />

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, ease: easings.softBounce }}
              className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-6 text-sm font-medium"
            >
              <MapPin className="w-4 h-4" />
              {region.name}, {region.province}
            </motion.div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground leading-tight">
              Website laten maken in{" "}
              <span className="text-accent">{region.name}</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
              {getIntroText()}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.div
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              >
                <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link to="/contact">
                    Gratis kennismaken
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              >
                <Button asChild variant="outline" size="lg">
                  <a href={`tel:${companyInfo.phone.replace(/\s/g, "")}`}>
                    <Phone className="mr-2 w-5 h-5" />
                    {companyInfo.phone}
                  </a>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Team foto */}
        <section className="container mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="aspect-[16/9] rounded-2xl overflow-hidden">
              <img
                src={heroTeamImage}
                alt="Justin en Job van Nieuwblik"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </motion.div>
        </section>

        {/* Services */}
        <section className="container mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Wat kunnen we voor je doen?
            </h2>
            <p className="text-muted-foreground mb-10 sm:mb-12 max-w-xl mx-auto">
              Complete webdesign oplossingen voor ondernemers in {region.name}.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-secondary/50 rounded-2xl p-6 sm:p-8 text-left"
                >
                  <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center mb-4 text-accent">
                    {service.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-foreground">{service.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Waarom Nieuwblik */}
        <section className="bg-secondary/30 py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Waarom Nieuwblik?
              </h2>
              <p className="text-muted-foreground mb-10 sm:mb-12 max-w-xl mx-auto">
                {isLocal
                  ? `We zijn lokaal gevestigd en kennen de regio ${region.name} goed.`
                  : `Ook vanuit ${region.name} kun je rekenen op onze expertise.`}
              </p>

              <div className="grid sm:grid-cols-3 gap-6">
                {whyPoints.map((point, idx) => (
                  <motion.div
                    key={point.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="text-center"
                  >
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 text-accent">
                      {point.icon}
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-foreground">{point.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{point.text}</p>
                  </motion.div>
                ))}
              </div>

              {/* Benefits */}
              <div className="mt-12 grid sm:grid-cols-2 gap-3 text-left max-w-2xl mx-auto">
                {[
                  `Binnen 1 week live met je nieuwe website`,
                  isLocal ? `Persoonlijk contact - we zitten vlakbij` : `Persoonlijke service, ook op afstand`,
                  `Transparante prijzen zonder verborgen kosten`,
                  `Mobiel-geoptimaliseerd voor al je klanten`,
                  `Gratis SEO-scan van je huidige website`,
                  `Continue ondersteuning na oplevering`,
                ].map((benefit, idx) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                    <p className="text-sm text-foreground">{benefit}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Portfolio */}
        <section className="container mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto"
          >
            <div className="text-center mb-10 sm:mb-14">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Bekijk ons portfolio
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Een selectie van recente projecten waar we trots op zijn.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-8 sm:gap-10">
              {featuredProjects.map((project) => (
                <ProjectCard
                  key={project.slug}
                  title={project.title}
                  category={project.category}
                  description={project.description}
                  image={project.image}
                  url={project.url}
                  tags={project.tags}
                  slug={project.slug}
                />
              ))}
            </div>

            <div className="text-center mt-10">
              <motion.div
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              >
                <Button asChild variant="outline" size="lg">
                  <Link to="/portfolio">
                    Bekijk alle projecten
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Proces */}
        <section className="bg-secondary/30 py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Zo werken we
              </h2>
              <p className="text-muted-foreground mb-10 sm:mb-12">
                Van eerste gesprek tot live website in 4 stappen
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                {processSteps.map((step, idx) => (
                  <motion.div
                    key={step.number}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-background rounded-2xl p-6 text-left"
                  >
                    <span className="text-4xl font-bold text-accent/20">{step.number}</span>
                    <h3 className="font-bold text-lg mt-2 mb-1 text-foreground">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: easings.easeOutExpo }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-foreground leading-tight">
              Klaar voor een nieuwe website in {region.name}?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
              Neem vrijblijvend contact op en ontdek wat een professionele website voor jouw bedrijf kan betekenen.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.div
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              >
                <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base">
                  <Link to="/contact">
                    Start je project
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              >
                <Button asChild variant="outline" size="lg" className="text-base">
                  <Link to="/portfolio">Bekijk voorbeelden</Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default WerkgebiedDetail;
