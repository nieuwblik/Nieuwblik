import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Gauge, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { motion, useReducedMotion } from "framer-motion";
import { fadeUp, staggerContainer, slideInLeft, slideInRight, easings } from "@/lib/motion";

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  website: string;
}

const checks = [
  {
    icon: Gauge,
    title: "Snelheid & techniek",
    text: "Laadtijd, mobielvriendelijkheid en technische SEO-basis.",
  },
  {
    icon: Search,
    title: "Vindbaarheid",
    text: "Hoe goed scoort je site in Google en AI-zoekmachines zoals ChatGPT.",
  },
  {
    icon: TrendingUp,
    title: "Conversiekansen",
    text: "Waar bezoekers afhaken en wat dat je aan omzet kost.",
  },
];

const GratisWebsiteAnalyse = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormState>({
    fullName: "",
    email: "",
    phone: "",
    website: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          notes: `Aanvraag: Gratis website-analyse\nWebsite: ${formData.website}`,
          subject: "Aanvraag website analyse",
        },
      });

      if (error) throw error;

      toast.success("Bedankt! We sturen je analyse binnen 24 uur toe.");
      setTimeout(() => navigate("/bedankt"), 1500);
    } catch {
      toast.error("Er is iets misgegaan. Probeer het opnieuw of neem direct contact op via justin@nieuwblik.com");
    } finally {
      setIsSubmitting(false);
    }
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Gratis website-analyse - Nieuwblik",
    description: "Vraag een gratis, vrijblijvende analyse van je website aan en ontdek waar je kansen laat liggen op het gebied van snelheid, vindbaarheid en conversie.",
    provider: {
      "@type": "Organization",
      name: "Nieuwblik",
      url: "https://www.nieuwblik.com",
    },
    areaServed: "Nederland",
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Gratis Website-Analyse | Nieuwblik Enkhuizen"
        description="Vraag een gratis website-analyse aan en ontdek in 24 uur waar jouw website kansen laat liggen op snelheid, vindbaarheid en conversie."
        keywords="gratis website analyse, website check, SEO scan, website laten checken"
        canonicalUrl="https://nieuwblik.com/gratis-website-analyse"
        structuredData={structuredData}
        breadcrumbs={[
          { name: "Home", url: "https://nieuwblik.com" },
          { name: "Gratis Website-Analyse", url: "https://nieuwblik.com/gratis-website-analyse" },
        ]}
      />

      {/* Breadcrumb */}
      <section className="pt-32 pb-8 md:pb-12">
        <div className="container mx-auto px-6">
          <Breadcrumb items={[{ label: "Gratis Website-Analyse", path: "/gratis-website-analyse" }]} />
        </div>
      </section>

      {/* Hero */}
      <motion.section
        className="pb-20 md:pb-28"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="container mx-auto px-6">
          <motion.p
            className="sw-mono mb-6"
            style={{ color: "hsl(var(--sw-green))" }}
            variants={fadeUp}
          >
            GRATIS WEBSITE-ANALYSE
          </motion.p>
          <motion.h1
            className="text-display mb-6"
            variants={fadeUp}
          >
            Ontdek het groeipotentieel van jouw website
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl font-light"
            variants={fadeUp}
          >
            Laat je website gratis en vrijblijvend checken op snelheid, vindbaarheid en conversie. Binnen 24 uur ontvang je een persoonlijke analyse met concrete verbeterpunten.
          </motion.p>
        </div>
      </motion.section>

      {/* Main content */}
      <section className="pb-20 md:pb-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">

            {/* What you get */}
            <motion.div
              className="lg:col-span-1"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={slideInLeft}
            >
              <div className="lg:sticky lg:top-32 space-y-6">
                {checks.map((check, index) => (
                  <motion.div
                    key={check.title}
                    className="p-6 rounded-2xl border"
                    style={{ background: "hsl(150, 14%, 97.5%)", borderColor: "hsl(var(--sw-rule) / 0.1)" }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ delay: index * 0.1, duration: 0.4, ease: easings.easeOutExpo }}
                  >
                    <div className="w-11 h-11 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                      <check.icon className="w-5 h-5" style={{ color: "hsl(var(--sw-green))" }} />
                    </div>
                    <h3 className="font-semibold text-lg mb-1.5">{check.title}</h3>
                    <p className="text-sm text-muted-foreground font-light leading-relaxed">{check.text}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              className="lg:col-span-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={slideInRight}
            >
              <motion.div
                className="p-8 md:p-12 rounded-2xl border"
                style={{ background: "hsl(150, 14%, 97.5%)", borderColor: "hsl(var(--sw-rule) / 0.1)" }}
                whileHover={shouldReduceMotion ? {} : { boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)" }}
                transition={{ duration: 0.3, ease: easings.easeOutExpo }}
              >
                <h2 className="text-2xl font-semibold mb-2">Vraag je gratis analyse aan</h2>
                <p className="text-muted-foreground mb-8 font-light">
                  Vul je gegevens in en we sturen je binnen 24 uur een persoonlijke analyse van je website.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="fullName">Naam *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="mt-2 bg-background"
                      placeholder="Jan de Vries"
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Website *</Label>
                    <Input
                      id="website"
                      name="website"
                      type="text"
                      required
                      value={formData.website}
                      onChange={handleChange}
                      className="mt-2 bg-background"
                      placeholder="www.jouwbedrijf.nl"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="email">E-mailadres *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-2 bg-background"
                        placeholder="jan@voorbeeld.nl"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefoonnummer *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="mt-2 bg-background"
                        placeholder="+31 6 12345678"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    size="lg"
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    {isSubmitting ? "Versturen..." : "Ontvang mijn gratis analyse"}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Geen verplichtingen. We nemen binnen 24 uur contact met je op.
                  </p>
                </form>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GratisWebsiteAnalyse;
