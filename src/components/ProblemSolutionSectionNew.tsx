import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { Check } from "lucide-react";
import { easings } from "@/lib/motion";

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
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: shouldReduceMotion ? 0 : 60 }}
            transition={{
                duration: shouldReduceMotion ? 0.2 : 0.7,
                delay: shouldReduceMotion ? 0 : delay,
                ease: easings.easeOutExpo
            }}
        >
            {children}
        </motion.div>
    );
};

const problems = [
    "Mijn website ziet er verouderd of amateuristisch uit.",
    "Het kost maanden voordat mijn nieuwe site live staat.",
    "Ik weet niet hoe ik meer leads en klanten via mijn website binnenkrijg.",
    "Mijn huisstijl en branding voelen niet consistent of professioneel aan.",
    "Ik moet zelf eindeloos aanpassingen doen of freelancers constant najagen.",
    "Mijn website scoort slecht in Google en is traag op mobiel."
];

const solutions = [
    "Moderne, unieke en premium vormgeving die écht bij jouw merk past.",
    "Snelle realisatie — van strategie tot live in weken, niet maanden.",
    "Conversiegerichte websites die bezoekers omzetten in leads en klanten.",
    "Sterke, samenhangende branding & huisstijl die direct herkenbaar en krachtig overkomt.",
    "Alles uit handen — jij geeft input, wij regelen ontwerp, ontwikkeling en oplevering.",
    "SEO-geoptimaliseerd, razendsnel en perfect op elk apparaat (mobile-first)."
];

export const ProblemSolutionSection = () => {
    const shouldReduceMotion = useReducedMotion();

    return (
        <section className="py-20 md:py-32 bg-secondary overflow-hidden">
            <div className="container mx-auto px-6">
                {/* Badge */}
                <AnimatedSection className="text-center mb-6">
                    <p className="text-accent text-sm font-medium tracking-[0.2em] uppercase">
                        ONZE OPLOSSING
                    </p>
                </AnimatedSection>

                {/* Main Title */}
                <AnimatedSection delay={0.1} className="text-center mb-4">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold leading-[1.15] tracking-tight max-w-4xl mx-auto">
                        Waarom de meeste ondernemers een zwakke online présence hebben
                    </h2>
                </AnimatedSection>

                {/* Subtitle */}
                <AnimatedSection delay={0.15} className="text-center mb-12 md:mb-16">
                    <p className="text-lg md:text-xl text-muted-foreground font-light max-w-3xl mx-auto leading-relaxed">
                        Een snelle vergelijking van de problemen die je niet zou moeten hebben… en hoe Nieuwblik ervoor zorgt dat je ze voorkomt.
                    </p>
                </AnimatedSection>

                {/* Two Columns */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
                    {/* Left Column - Problems */}
                    <AnimatedSection delay={0.2}>
                        <div className="pt-6 md:pt-8 lg:pt-10 space-y-0">
                            {/* Column Header */}
                            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-6 md:mb-8">
                                Probleem bij Ondernemers
                            </h3>

                            {/* Problem List */}
                            <ul className="space-y-4 md:space-y-5">
                                {problems.map((problem, index) => (
                                    <motion.li
                                        key={index}
                                        className="flex items-start gap-3 md:gap-4"
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            duration: shouldReduceMotion ? 0.1 : 0.5,
                                            delay: shouldReduceMotion ? 0 : 0.3 + index * 0.08,
                                            ease: easings.easeOutExpo
                                        }}
                                    >
                                        <span
                                            className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 flex items-center justify-center mt-0.5 text-base md:text-lg font-bold"
                                            style={{ color: '#E63946' }}
                                        >
                                            ×
                                        </span>
                                        <span className="text-base md:text-lg text-foreground/90 font-normal leading-relaxed">
                                            {problem}
                                        </span>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                    </AnimatedSection>

                    {/* Right Column - Solutions */}
                    <AnimatedSection delay={0.25}>
                        <div
                            className="relative rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10 overflow-hidden"
                            style={{
                                background: 'linear-gradient(135deg, hsl(160 84% 14%) 0%, hsl(160 84% 10%) 50%, hsl(160 70% 8%) 100%)'
                            }}
                        >
                            {/* Decorative sparkles/dots */}
                            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                {/* Sparkle dots */}
                                <div className="absolute top-8 right-12 w-1 h-1 bg-white/30 rounded-full animate-pulse" />
                                <div className="absolute top-16 right-24 w-1.5 h-1.5 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                                <div className="absolute bottom-20 left-8 w-1 h-1 bg-white/25 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                                <div className="absolute bottom-32 right-8 w-0.5 h-0.5 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
                                <div className="absolute top-1/3 left-4 w-1 h-1 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '0.7s' }} />
                                <div className="absolute bottom-12 left-20 w-1 h-1 bg-white/15 rounded-full animate-pulse" style={{ animationDelay: '1.2s' }} />
                                <div className="absolute top-24 left-16 w-0.5 h-0.5 bg-white/25 rounded-full animate-pulse" style={{ animationDelay: '0.9s' }} />
                            </div>

                            {/* Subtle gradient overlay for depth */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-black/10" />

                            <div className="relative z-10 space-y-0">
                                {/* Column Header */}
                                <h3 className="text-xl md:text-2xl font-bold text-accent mb-6 md:mb-8" style={{ color: 'hsl(160 84% 45%)' }}>
                                    Nieuwblik Oplossing
                                </h3>

                                {/* Solution List */}
                                <ul className="space-y-4 md:space-y-5">
                                    {solutions.map((solution, index) => (
                                        <motion.li
                                            key={index}
                                            className="flex items-start gap-3 md:gap-4"
                                            initial={{ opacity: 0, x: 20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{
                                                duration: shouldReduceMotion ? 0.1 : 0.5,
                                                delay: shouldReduceMotion ? 0 : 0.35 + index * 0.08,
                                                ease: easings.easeOutExpo
                                            }}
                                        >
                                            <span
                                                className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full mt-0.5"
                                                style={{
                                                    backgroundColor: 'hsl(160 84% 45%)',
                                                    color: 'white'
                                                }}
                                            >
                                                <Check className="w-3 h-3 md:w-3.5 md:h-3.5" strokeWidth={3} />
                                            </span>
                                            <span className="text-base md:text-lg text-white/90 font-normal leading-relaxed">
                                                {solution}
                                            </span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </AnimatedSection>
                </div>
            </div>
        </section>
    );
};

export default ProblemSolutionSection;
