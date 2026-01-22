import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { AnimatedButton } from "@/components/ui/animated-button";
import { projects } from "@/data/projects";
import { motion, useReducedMotion } from "framer-motion";
import { fadeUp, staggerContainer, easings } from "@/lib/motion";
import { ExternalLink, ArrowLeft, Calendar, Target, Lightbulb, Info } from "lucide-react";

const PortfolioDetail = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const shouldReduceMotion = useReducedMotion();

    const project = projects.find((p) => p.slug === slug);

    useEffect(() => {
        if (!project) {
            // Redirect if project not found, or show 404
            // For now, let's just go back to portfolio
            const timeout = setTimeout(() => {
                if (!project) navigate("/portfolio");
            }, 3000);
            return () => clearTimeout(timeout);
        }
    }, [project, navigate]);

    if (!project) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center font-light">
                    <p>Project niet gevonden...</p>
                    <p className="text-sm text-muted-foreground mt-2">Je wordt teruggestuurd naar de portfolio.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <SEOHead
                title={`${project.title} | Portfolio - Nieuwblik`}
                description={project.description}
                canonicalUrl={`https://nieuwblik.com/portfolio/${project.slug}`}
            />
            <Navigation />

            {/* Breadcrumb */}
            <section className="pt-32 pb-0">
                <div className="container mx-auto px-6">
                    <Breadcrumb
                        items={[
                            { label: "Portfolio", path: "/portfolio" },
                            { label: project.title, path: `/portfolio/${project.slug}` }
                        ]}
                    />
                </div>
            </section>

            {/* Hero Section */}
            <motion.section
                className="pb-20 md:pb-28 pt-8"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
            >
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl">
                        <motion.p
                            className="text-accent mb-6 font-medium"
                            variants={fadeUp}
                        >
                            PROJECT CASE
                        </motion.p>
                        <motion.h1
                            className="text-display mb-6"
                            variants={fadeUp}
                        >
                            {project.title}
                        </motion.h1>
                        <motion.p
                            className="text-xl md:text-2xl text-muted-foreground mb-10 font-light leading-relaxed"
                            variants={fadeUp}
                        >
                            {project.description}
                        </motion.p>

                        <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
                            <AnimatedButton to="/contact" size="lg">
                                Dit wil ik ook
                            </AnimatedButton>
                            <Button asChild variant="outline" size="lg" className="rounded-full font-medium">
                                <a href={project.url} target="_blank" rel="noopener noreferrer">
                                    Bekijk live website <ExternalLink className="ml-2 w-4 h-4" />
                                </a>
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Case Section */}
            <section className="pb-32 border-t border-border/50 pt-20">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
                        {/* Sticky Left Column: Image */}
                        <div className="w-full md:w-1/2 lg:w-3/5">
                            <div className="sticky top-32">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, ease: easings.easeOutExpo }}
                                    className="rounded-2xl overflow-hidden bg-secondary"
                                >
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full h-auto object-cover"
                                    />
                                </motion.div>
                            </div>
                        </div>

                        {/* Scrolling Right Column: Details */}
                        <div className="w-full md:w-1/2 lg:w-2/5 space-y-16">
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 text-accent">
                                    <Info className="w-5 h-5" />
                                    <h2 className="text-sm font-bold tracking-wider uppercase">De Case</h2>
                                </div>
                                <h3 className="text-3xl font-bold font-display leading-tight">
                                    Over {project.title}
                                </h3>
                                <p className="text-lg text-muted-foreground font-light leading-relaxed whitespace-pre-wrap">
                                    {project.detail?.details || "Gegevens volgen nog..."}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-12">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                                        <Calendar className="w-5 h-5 text-accent" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold mb-2 uppercase text-sm tracking-wide">Jaar</h4>
                                        <p className="text-muted-foreground font-light">{project.detail?.year || "2024"}</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                                        <Target className="w-5 h-5 text-accent" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold mb-2 uppercase text-sm tracking-wide">Het Doel</h4>
                                        <p className="text-muted-foreground font-light leading-relaxed">
                                            {project.detail?.goal || "Gegevens volgen nog..."}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                                        <Lightbulb className="w-5 h-5 text-accent" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold mb-2 uppercase text-sm tracking-wide">Het Idee</h4>
                                        <p className="text-muted-foreground font-light leading-relaxed">
                                            {project.detail?.idea || "Gegevens volgen nog..."}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Specific details could go here */}
                        </div>
                    </div>
                </div>
            </section>

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
                        Wil jij ook zo'n resultaat?
                    </motion.h2>
                    <motion.p
                        className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto font-light"
                        variants={fadeUp}
                    >
                        Laten we samen kijken hoe we jouw online aanwezigheid naar een hoger niveau kunnen tillen.
                    </motion.p>
                    <motion.div
                        variants={fadeUp}
                        whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                        whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                        transition={{ duration: 0.2, ease: easings.easeOutQuart }}
                    >
                        <AnimatedButton to="/contact" size="lg">
                            Dit wil ik ook
                        </AnimatedButton>
                    </motion.div>
                </div>
            </motion.section>

            <Footer />
        </div>
    );
};

export default PortfolioDetail;
