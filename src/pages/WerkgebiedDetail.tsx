import { motion, useReducedMotion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import {
  MapPin,
  ArrowRight,
  CheckCircle2,
  Phone,
  Mail,
  Clock,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRegionBySlug } from "@/data/regions";
import { easings } from "@/lib/motion";
import SEOHead from "@/components/SEOHead";
import { companyInfo } from "@/config/company";

const WerkgebiedDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const shouldReduceMotion = useReducedMotion();
  const region = slug ? getRegionBySlug(slug) : undefined;

  // Debug logging
  console.log('Slug:', slug);
  console.log('Region found:', region);

  // Als de regio niet bestaat, toon 404
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

  // Dynamische intro tekst
  const getIntroText = () => {
    if (isLocal) {
      return `Als webdesign bureau gevestigd in Enkhuizen, zijn we vlakbij ${region.name}. Dat betekent snelle service, persoonlijk contact en begrip van de lokale markt. Of je nu een horeca zaak, winkel, dienstverlener of ander bedrijf hebt in ${region.name}, wij helpen je met een professionele website die klanten trekt.`;
    }
    return `Hoewel we gevestigd zijn in Enkhuizen, werken we graag voor bedrijven in ${region.name}. Door slimme online samenwerking kunnen we ook voor jou een topwebsite bouwen. Dezelfde kwaliteit, dezelfde persoonlijke service, maar dan landelijk.`;
  };

  // Services specifiek voor deze regio
  const getRegionalServices = () => {
    const baseServices = [
      {
        icon: <Building2 className="w-6 h-6" />,
        title: `Websites voor ${region.name}`,
        description: `Professionele websites die perfect aansluiten bij bedrijven in ${region.name}. Van eenvoudige visitekaartjes tot uitgebreide corporate sites.`,
      },
      {
        icon: <ShoppingBag className="w-6 h-6" />,
        title: "Webshop ontwikkeling",
        description: `E-commerce oplossingen waarmee je 24/7 online kunt verkopen aan klanten in ${region.name} en daarbuiten.`,
      },
      {
        icon: <TrendingUp className="w-6 h-6" />,
        title: "Lokale SEO",
        description: `Beter vindbaar in Google voor "${region.name}" en omliggende plaatsen. Meer lokale bezoekers, meer klanten.`,
      },
      {
        icon: <Zap className="w-6 h-6" />,
        title: "Supersnel & mobiel",
        description: `Razendsnel ladende websites die perfect werken op mobiel. Optimaal voor ondernemers in ${region.name}.`,
      },
    ];

    return baseServices;
  };

  // Benefits specifiek voor deze regio
  const benefits = [
    `Binnen 1 week live met je nieuwe website in ${region.name}`,
    isLocal
      ? `Persoonlijk contact - we zitten vlakbij in Enkhuizen`
      : `Persoonlijke service, ook op afstand`,
    `Transparante prijzen zonder verborgen kosten`,
    `Mobiel-geoptimaliseerd voor klanten in ${region.name}`,
    `Gratis SEO-scan van je huidige website`,
    `Lokale vindbaarheid in Google voor "${region.name}"`,
    `Continue ondersteuning na oplevering`,
    `Websites die converteren en omzet genereren`,
  ];

  // Waarom Nieuwblik voor deze regio
  const getWhyChooseText = () => {
    if (isLocal) {
      return {
        title: `Waarom Nieuwblik voor je bedrijf in ${region.name}?`,
        intro: `We zijn lokaal gevestigd in Enkhuizen en kennen de regio ${region.name} goed. Dat maakt het verschil:`,
        points: [
          {
            icon: <MapPin className="w-5 h-5" />,
            title: "Lokaal en dichtbij",
            text: `Snel even sparren? We zitten vlakbij ${region.name} en kunnen bij je langskomen voor een vrijblijvend gesprek.`,
          },
          {
            icon: <Users className="w-5 h-5" />,
            title: "Persoonlijke aandacht",
            text: `Je bent geen nummer bij ons. We nemen de tijd om jouw bedrijf en doelen in ${region.name} echt te begrijpen.`,
          },
          {
            icon: <Target className="w-5 h-5" />,
            title: "Lokale kennis",
            text: `We begrijpen de markt in ${region.name} en West-Friesland. Dat zie je terug in websites die écht aansluiten bij jouw doelgroep.`,
          },
        ],
      };
    }

    return {
      title: `Waarom Nieuwblik voor je bedrijf in ${region.name}?`,
      intro: `Ook vanuit ${region.name} kun je rekenen op onze expertise. Online afstand is geen probleem:`,
      points: [
        {
          icon: <Zap className="w-5 h-5" />,
          title: "Snelle communicatie",
          text: `Via videobellen, e-mail en telefoon blijven we nauw in contact. Alsof we om de hoek zitten.`,
        },
        {
          icon: <Users className="w-5 h-5" />,
          title: "Persoonlijke aanpak",
          text: `Landelijke service betekent niet onpersoonlijk. We nemen de tijd voor jouw project in ${region.name}.`,
        },
        {
          icon: <Target className="w-5 h-5" />,
          title: "Scherpe prijzen",
          text: `Door onze locatie in Enkhuizen kunnen we scherpe prijzen bieden, ook voor bedrijven in ${region.name}.`,
        },
      ],
    };
  };

  const whyChoose = getWhyChooseText();

  // Proces stappen
  const processSteps = [
    {
      number: "01",
      title: "Gratis kennismaking",
      description: `We bespreken jouw wensen en doelen voor je bedrijf in ${region.name}. Geen verplichtingen.`,
    },
    {
      number: "02",
      title: "Offerte op maat",
      description: `Je ontvangt een heldere offerte met duidelijke prijzen en planning.`,
    },
    {
      number: "03",
      title: "Design & ontwikkeling",
      description: `We bouwen je website met regelmatige updates en feedback momenten.`,
    },
    {
      number: "04",
      title: "Live & support",
      description: `Je website gaat live en we blijven beschikbaar voor vragen en updates.`,
    },
  ];

  return (
    <>
      <SEOHead
        title={`Webdesign ${region.name} | Website Laten Maken ${region.name} - Nieuwblik`}
        description={`Professioneel webdesign bureau voor ${region.name}. Website, webshop of SEO nodig? ${isLocal ? "Lokaal gevestigd in de regio" : "Ook landelijk actief"}. Binnen 1 week online. Neem contact op!`}
        keywords={
          region.keywords?.join(", ") ||
          `webdesign ${region.name}, website laten maken ${region.name}, webshop ${region.name}, SEO ${region.name}`
        }
      />

      <Navigation />

      <main className="min-h-screen bg-background pt-32 pb-12 sm:pb-20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 pb-8 sm:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easings.easeOutExpo }}
            className="max-w-6xl mx-auto"
          >
            {/* Breadcrumb */}
            <Breadcrumb
              items={[
                {
                  label: "Werkgebied",
                  path: "/werkgebied"
                },
                {
                  label: region.name,
                  path: `/werkgebied/${region.slug}`
                }
              ]}
            />

            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-start">
              <div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, ease: easings.softBounce }}
                  className="inline-flex items-center gap-2 bg-accent/10 text-accent px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6 text-xs sm:text-sm font-medium"
                >
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                  {region.name}, {region.province}
                  {region.localInfo?.population && (
                    <span className="hidden sm:inline">• {region.localInfo.population} inwoners</span>
                  )}
                </motion.div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-foreground leading-tight">
                  Website laten maken in
                  <span className="text-accent block mt-1 sm:mt-2">{region.name}</span>
                </h1>

                <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
                  {getIntroText()}
                </p>

                {/* Kenmerken van de regio */}
                {region.localInfo?.specialties && (
                  <div className="mb-6 sm:mb-8">
                    <div className="flex flex-wrap gap-2">
                      {region.localInfo.specialties.map((specialty, idx) => (
                        <span
                          key={idx}
                          className="text-xs sm:text-sm bg-secondary px-3 py-1.5 rounded-full text-foreground"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <motion.div
                    whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                    className="flex-1 sm:flex-initial"
                  >
                    <Button
                      asChild
                      size="lg"
                      className="bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto"
                    >
                      <Link to="/contact">
                        Gratis kennismaken
                        <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                      </Link>
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                    className="flex-1 sm:flex-initial"
                  >
                    <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                      <a href={`tel:${companyInfo.phone.replace(/\s/g, "")}`}>
                        <Phone className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                        {companyInfo.phone}
                      </a>
                    </Button>
                  </motion.div>
                </div>
              </div>

              {/* Contact Info Card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: easings.easeOutExpo }}
                className="lg:sticky lg:top-24"
              >
                <Card className="bg-secondary/50 border-accent/20">
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">Direct contact</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm text-muted-foreground mb-1">Bel ons</p>
                          <a
                            href={`tel:${companyInfo.phone.replace(/\s/g, "")}`}
                            className="text-sm sm:text-base font-semibold text-foreground hover:text-accent transition-colors break-all"
                          >
                            {companyInfo.phone}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm text-muted-foreground mb-1">E-mail</p>
                          <a
                            href={`mailto:${companyInfo.email}`}
                            className="text-sm sm:text-base font-semibold text-foreground hover:text-accent transition-colors break-all"
                          >
                            {companyInfo.email}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm text-muted-foreground mb-1">Bereikbaar</p>
                          <p className="text-sm sm:text-base font-semibold text-foreground">
                            Ma-Vr 09:00 - 17:00
                          </p>
                        </div>
                      </div>

                      {isLocal && region.nearbyPlaces && region.nearbyPlaces.length > 0 && (
                        <div className="pt-4 border-t border-border">
                          <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                            Ook actief in de buurt:
                          </p>
                          <p className="text-xs sm:text-sm text-foreground">
                            {region.nearbyPlaces.join(" • ")}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Voor welke bedrijven in de regio */}
        {region.localInfo?.businessTypes && region.localInfo.businessTypes.length > 0 && (
          <section className="bg-secondary/30 py-12 sm:py-16">
            <div className="container mx-auto px-4 sm:px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto text-center"
              >
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">
                  Voor bedrijven in {region.name}
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">
                  We werken graag voor diverse sectoren in {region.name}:
                </p>
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                  {region.localInfo.businessTypes.map((type, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-background px-4 sm:px-6 py-2 sm:py-3 rounded-lg border border-border hover:border-accent/50 transition-colors"
                    >
                      <span className="text-sm sm:text-base font-medium text-foreground">
                        {type}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Services Section */}
        <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-2xl mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-foreground">
                Wat kunnen we voor je doen?
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Complete webdesign oplossingen voor ondernemers in {region.name}.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              {getRegionalServices().map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-accent/50 group">
                    <CardContent className="p-5 sm:p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0 text-accent group-hover:scale-110 transition-transform">
                          {service.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-base sm:text-lg mb-2 text-foreground">
                            {service.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Waarom Nieuwblik */}
        <section className="bg-secondary/30 py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-foreground">
                {whyChoose.title}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-8 sm:mb-10">
                {whyChoose.intro}
              </p>

              <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
                {whyChoose.points.map((point, idx) => (
                  <motion.div
                    key={point.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="h-full bg-background">
                      <CardContent className="p-5 sm:p-6">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-3 sm:mb-4 text-accent">
                          {point.icon}
                        </div>
                        <h3 className="font-bold text-base sm:text-lg mb-2 text-foreground">
                          {point.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          {point.text}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Benefits lijst */}
              <div className="bg-background p-6 sm:p-8 rounded-2xl border border-border">
                <h3 className="font-bold text-lg sm:text-xl mb-4 sm:mb-6 text-foreground">
                  Dit krijg je bij Nieuwblik:
                </h3>
                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                  {benefits.map((benefit, idx) => (
                    <motion.div
                      key={benefit}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0 mt-0.5" />
                      <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                        {benefit}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Proces Section */}
        <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-foreground">
                Zo werken we
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Van eerste gesprek tot live website in 4 eenvoudige stappen
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              {processSteps.map((step, idx) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all hover:border-accent/50">
                    <CardContent className="p-5 sm:p-6">
                      <div className="flex items-start gap-4">
                        <div className="text-4xl sm:text-5xl font-bold text-accent/20">
                          {step.number}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-base sm:text-lg mb-2 text-foreground">
                            {step.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: easings.easeOutExpo }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-foreground leading-tight">
              Klaar voor een nieuwe website voor je bedrijf in {region.name}?
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
              Neem vrijblijvend contact op en ontdek wat een professionele website voor jouw
              bedrijf in {region.name} kan betekenen. Gratis adviesgesprek, geen verplichtingen.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <motion.div
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                className="flex-1 sm:flex-initial"
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto text-base"
                >
                  <Link to="/contact">
                    Start je project
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                className="flex-1 sm:flex-initial"
              >
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto text-base"
                >
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
