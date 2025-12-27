"use client";

import { useTheme } from "next-themes";
import { MagicCard } from "@/components/ui/magic-card";
import { Globe, Palette, ShoppingBag, Pen } from "lucide-react";
import { useReducedMotion, motion } from "framer-motion";
import { easings } from "@/lib/motion";
import { useRef } from "react";
import { useInView } from "framer-motion";

// Helper component for staggered reveals
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

export const MagicServicesCards = () => {
    const shouldReduceMotion = useReducedMotion();

    const services = [
        {
            icon: Globe,
            title: "Websites die verkopen",
            description: "Jouw website is meer dan een digitale visitekaartje. Het is de drijvende kracht achter je groei. Wij bouwen websites die niet alleen prachtig zijn, maar ook klanten aantrekken en conversies verhogen."
        },
        {
            icon: Palette,
            title: "Merkidentiteit die raakt",
            description: "Een sterk merk begint met een verhaal dat emotie oproept. Wij creëren merkidentiteiten die jouw unieke waarden uitdragen en een blijvende indruk achterlaten bij je doelgroep."
        },
        {
            icon: ShoppingBag,
            title: "Webshops die groeien",
            description: "Van het eerste bezoek tot de checkout - wij bouwen e-commerce oplossingen die je klanten verleiden en je omzet laten stijgen. Elke klik is een stap naar meer succes."
        },
        {
            icon: Pen,
            title: "Design dat onderscheidt",
            description: "Of het nu gaat om een stunning landingspagina, eye-catching social media content, of een complete visuele identiteit - wij zorgen dat je opvalt in een overvolle markt."
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
                <AnimatedSection key={index} delay={index * 0.15}>
                    <motion.div
                        className="h-full rounded-lg"
                        whileHover={shouldReduceMotion ? {} : {
                            y: -8,
                            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                        }}
                        transition={{ duration: 0.3, ease: easings.easeOutExpo }}
                    >
                        <MagicCard
                            className="group flex flex-col items-start justify-start w-full h-full p-6 md:p-8 text-left shadow-none hover:shadow-none"
                            maskClassName="bg-secondary"
                        >
                            {/* Icon Container - Matching 'Over Ons' page style */}
                            <div
                                className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 mb-4 transition-transform duration-300 group-hover:scale-110"
                            >
                                <service.icon className="w-6 h-6 text-accent" />
                            </div>

                            {/* Title - Matching 'Over Ons' page style */}
                            <h3 className="font-semibold text-lg mb-3">
                                {service.title}
                            </h3>

                            {/* Description - Matching 'Over Ons' page style */}
                            <p className="text-muted-foreground font-light leading-relaxed">
                                {service.description}
                            </p>
                        </MagicCard>
                    </motion.div>
                </AnimatedSection>
            ))}
        </div>
    );
};
