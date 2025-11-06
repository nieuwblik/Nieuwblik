import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart, Users, Sparkles, Rocket } from "lucide-react";
import justinImg from "@/assets/justin-slok.png";
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const About = () => {
  const { t } = useLanguage();
  const heroAnimation = useScrollAnimation(0.1);
  const valuesAnimation = useScrollAnimation(0.1);
  const ctaAnimation = useScrollAnimation(0.1);

  const values = [
    {
      icon: Heart,
      title: t("about.values.passion.title"),
      description: t("about.values.passion.description")
    },
    {
      icon: Users,
      title: t("about.values.collaboration.title"),
      description: t("about.values.collaboration.description")
    },
    {
      icon: Sparkles,
      title: t("about.values.creativity.title"),
      description: t("about.values.creativity.description")
    },
    {
      icon: Rocket,
      title: t("about.values.growth.title"),
      description: t("about.values.growth.description")
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section with Image */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div
              ref={heroAnimation.ref}
              className={`transition-all duration-1000 ${
                heroAnimation.isVisible 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-10"
              }`}
            >
              <p className="text-accent-light text-accent mb-6">{t("about.label")}</p>
              <h1 className="text-display mb-6">
                {t("about.hero.title")}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-6 font-light">
                {t("about.hero.subtitle")}
              </p>
              <p className="text-lg text-muted-foreground mb-8 font-light leading-relaxed">
                {t("about.hero.description")}
              </p>
              <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link to="/contact">{t("about.hero.cta")}</Link>
              </Button>
            </div>
            <div
              className={`transition-all duration-1000 delay-200 ${
                heroAnimation.isVisible 
                  ? "opacity-100 translate-x-0" 
                  : "opacity-0 translate-x-10"
              }`}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 rounded-lg transform rotate-3"></div>
                <img 
                  src={justinImg} 
                  alt="Justin Slok" 
                  className="relative rounded-lg shadow-2xl w-full object-cover transform -rotate-2 hover:rotate-0 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 md:py-32 bg-secondary">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              {t("about.story.title")}
            </h2>
            <div className="space-y-6 text-lg text-muted-foreground font-light leading-relaxed">
              <p>{t("about.story.paragraph1")}</p>
              <p>{t("about.story.paragraph2")}</p>
              <p>{t("about.story.paragraph3")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-accent-light text-accent mb-4">{t("about.values.label")}</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t("about.values.title")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
              {t("about.values.description")}
            </p>
          </div>
          
          <div
            ref={valuesAnimation.ref}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {values.map((value, index) => (
              <div
                key={index}
                className={`bg-secondary p-8 rounded-lg transition-all duration-700 hover:shadow-lg hover:transform hover:-translate-y-2 ${
                  valuesAnimation.isVisible 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 mb-4">
                  <value.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-3">{value.title}</h3>
                <p className="text-muted-foreground font-light">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        ref={ctaAnimation.ref}
        className={`py-20 md:py-32 bg-gradient-to-br from-primary to-accent transition-all duration-1000 ${
          ctaAnimation.isVisible 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary-foreground">
            {t("about.cta.title")}
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto font-light">
            {t("about.cta.description")}
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link to="/contact">{t("about.cta.button")}</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
