
import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Package, PenTool, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { AnimatedButton } from "@/components/ui/animated-button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useMotionValue, useSpring, useTransform } from "framer-motion";

import kattenbakListingImg from "@/assets/projects/kattenbak-listing.png";
import hamburgerPressListingImg from "@/assets/projects/hamburger-press-listing.png";
import schoenenWolListingImg from "@/assets/projects/schoenen-wol-listing.png";
import pastamachineListingImg from "@/assets/projects/pastamachine-listing.png";
import compressorListingImg from "@/assets/projects/compressor-listing.png";

type ShowcaseItem = {
    id: number;
    title: string;
    category: "Verpakking" | "Design";
    image: string;
    description: string;
    tags: string[];
};

const items: ShowcaseItem[] = [
    {
        id: 1,
        title: "Kattenbak Verpakking",
        category: "Verpakking",
        image: kattenbakListingImg,
        description: "Een revolutionair ontwerp voor de moderne kattenliefhebber. Focus op hygiëne en gebruiksgemak, verpakt in een strak, milieuvriendelijk design dat perfect past in elk modern interieur.",
        tags: ["Packaging", "Eco-friendly", "Branding"],
    },
    {
        id: 2,
        title: "Kitchenz Drogerballen",
        category: "Design",
        image: hamburgerPressListingImg,
        description: "Duurzame wasoplossingen verdienen een verpakking die zachtheid en kwaliteit uitstraalt. Een minimalistisch design dat de natuurlijkheid van het product benadrukt.",
        tags: ["Product Design", "Sustainability", "Retail"],
    },
    {
        id: 3,
        title: "Hamburgerpers Doos",
        category: "Verpakking",
        image: schoenenWolListingImg,
        description: "Stoer, robuust en smakelijk. Deze verpakking schreeuwt BBQ-seizoen en nodigt direct uit tot kopen. Gemaakt voor de echte grillmaster die houdt van kwaliteit.",
        tags: ["Food Packaging", "Bold Design", "Print"],
    },
    {
        id: 4,
        title: "Pastamachine Branding",
        category: "Design",
        image: pastamachineListingImg,
        description: "De kunst van Italiaans koken gevangen in een visuele identiteit. Elegantie en traditie ontmoeten modern design in deze complete rebranding voor een klassiek keukeninstrument.",
        tags: ["Branding", "Identity", "Culinary"],
    },
    {
        id: 5,
        title: "Compressor Handleiding",
        category: "Verpakking",
        image: compressorListingImg,
        description: "Technische complexiteit vertaald naar heldere instructies. Een gebruiksvriendelijk design dat de gebruiker stap voor stap begeleidt zonder verwarring.",
        tags: ["Instruction Design", "Technical", "Layout"],
    },
];

export const DesignCarousel = () => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" }, [
        Autoplay({ delay: 2600, stopOnInteraction: false }),
    ]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedProject, setSelectedProject] = useState<ShowcaseItem | null>(null);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    // Mouse movement logic for desktop hover effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;
        mouseX.set(x);
        mouseY.set(y);
    }, [mouseX, mouseY]);

    const springConfig = { damping: 20, stiffness: 100 }; // Softer, luxury feel
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    // Initial scale 1.3 allows movement to see the edges of the image.
    // Maps mouse position -0.5 to 0.5 to translation percentages.
    const x = useTransform(springX, [-0.5, 0.5], ["15%", "-15%"]);
    const y = useTransform(springY, [-0.5, 0.5], ["15%", "-15%"]);

    // Stop autoplay when popup is open
    useEffect(() => {
        const autoplay = emblaApi?.plugins()?.autoplay;
        if (!autoplay) return;

        if (selectedProject) {
            autoplay.stop();
        } else {
            // Force play with a slight delay to ensure state is settled
            setTimeout(() => {
                autoplay.play();
            }, 100);
        }
    }, [selectedProject, emblaApi]);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on("select", onSelect);
        emblaApi.on("reInit", onSelect);
    }, [emblaApi, onSelect]);

    return (
        <section className="py-20 bg-background overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-accent text-sm font-medium tracking-widest uppercase mb-4 block"
                    >
                        Custom Design
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold mb-6 text-foreground"
                    >
                        Jouw merk verdient een verpakking die blijft hangen
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-muted-foreground font-light leading-relaxed"
                    >
                        Elk pixel, elke vorm, elke kleur vertelt iets over jou. Wij vertalen jouw visie naar visuele taal die opvalt, onthouden wordt en mensen in beweging zet.
                    </motion.p>
                </div>

                <div className="relative max-w-6xl mx-auto">
                    {/* Carousel Viewport */}
                    <div className="overflow-visible cursor-grab active:cursor-grabbing" ref={emblaRef}>
                        <div className="flex -ml-4 touch-pan-y perspective-1000">
                            {items.map((item, index) => {
                                const isSelected = index === selectedIndex;
                                return (
                                    <div
                                        key={item.id}
                                        className="flex-[0_0_85%] sm:flex-[0_0_60%] md:flex-[0_0_45%] lg:flex-[0_0_40%] min-w-0 pl-8 relative py-8"
                                    >
                                        <div
                                            onClick={() => setSelectedProject(item)}
                                            className="cursor-pointer group/card"
                                        >
                                            <motion.div
                                                initial={false}
                                                animate={{
                                                    scale: isSelected ? 1 : 0.9,
                                                    opacity: isSelected ? 1 : 0.4,
                                                    filter: isSelected ? "blur(0px) grayscale(0%)" : "blur(2px) grayscale(100%)",
                                                    y: isSelected ? 0 : 20,
                                                }}
                                                whileHover={isSelected ? { y: -10 } : {}}
                                                transition={{
                                                    duration: 0.6,
                                                    ease: [0.32, 0.72, 0, 1], // Custom apple-like ease
                                                }}
                                                className={`relative aspect-[4/3] rounded-xl md:rounded-3xl overflow-hidden shadow-2xl bg-secondary transition-shadow hover:shadow-primary/20`}
                                            >
                                                <motion.img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover"
                                                    animate={{
                                                        scale: isSelected ? 1.05 : 1,
                                                    }}
                                                    transition={{
                                                        duration: 0.8,
                                                    }}
                                                />
                                                {/* Gradient Overlay - Always visible on selected, otherwise on hover */}
                                                <div
                                                    className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-500 flex flex-col justify-end p-6 md:p-8 ${isSelected ? "opacity-100" : "opacity-0"}`}
                                                >
                                                    <h3 className="text-white text-lg md:text-3xl font-bold leading-tight decoration-clone">
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-white/80 text-sm mt-2 font-medium opacity-0 group-hover/card:opacity-100 transition-opacity translate-y-2 group-hover/card:translate-y-0 duration-300">
                                                        Bekijk project <ArrowRight className="inline w-4 h-4 ml-1" />
                                                    </p>
                                                </div>
                                            </motion.div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-4 mt-10">
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full w-12 h-12 border-2 hover:bg-accent hover:text-white hover:border-accent transition-all"
                            onClick={scrollPrev}
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="sr-only">Vorige</span>
                        </Button>

                        <div className="flex gap-2">
                            {items.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => emblaApi?.scrollTo(index)}
                                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === selectedIndex ? "bg-accent w-8" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                                        }`}
                                    aria-label={`Ga naar slide ${index + 1}`}
                                />
                            ))}
                        </div>

                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full w-12 h-12 border-2 hover:bg-accent hover:text-white hover:border-accent transition-all"
                            onClick={scrollNext}
                        >
                            <ArrowRight className="w-5 h-5" />
                            <span className="sr-only">Volgende</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Project Details Popup - Responsive Implementation */}
            {isDesktop ? (
                /* DESKTOP: Luxury Dialog with Hover Pan Effect */
                <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
                    <AnimatePresence mode="wait">
                        {selectedProject && (
                            <DialogContent 
                                className="max-w-6xl p-0 overflow-hidden bg-card border-none shadow-2xl rounded-3xl"
                                asChild
                                forceMount
                            >
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                    transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                                >
                                    <div className="grid grid-cols-[60%_40%] h-[600px]">
                                        {/* Left Side: Interactive Image */}
                                        <div
                                            className="relative overflow-hidden bg-secondary cursor-move group h-full"
                                            onMouseMove={handleMouseMove}
                                            onMouseLeave={() => {
                                                mouseX.set(0);
                                                mouseY.set(0);
                                            }}
                                        >
                                            <motion.img
                                                src={selectedProject.image}
                                                alt={selectedProject.title}
                                                className="w-full h-full object-cover"
                                                style={{
                                                    scale: 1.3,
                                                    x,
                                                    y
                                                }}
                                            />
                                            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/10" />
                                            <div className="absolute bottom-6 right-6 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                                Beweeg om te verkennen
                                            </div>
                                        </div>

                                        {/* Right Side: Details */}
                                        <div className="p-10 flex flex-col justify-between overflow-y-auto">
                                            <div>
                                                <DialogHeader>
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <Badge variant="secondary" className="px-3 py-1 text-xs uppercase tracking-wider">
                                                            {selectedProject.category}
                                                        </Badge>
                                                    </div>
                                                    <DialogTitle className="text-4xl font-bold mb-4 leading-tight">
                                                        {selectedProject.title}
                                                    </DialogTitle>
                                                    <div className="w-12 h-1 bg-accent mb-6 rounded-full" />
                                                    <DialogDescription className="text-lg text-muted-foreground leading-relaxed mb-8">
                                                        {selectedProject.description}
                                                    </DialogDescription>
                                                </DialogHeader>

                                                {/* Tags */}
                                                <div className="space-y-3 mb-8">
                                                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Expertises</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedProject.tags.map((tag) => (
                                                            <Badge key={tag} variant="outline" className="text-sm py-1 px-3 border-accent/20 text-foreground">
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* CTA */}
                                            <div className="mt-auto pt-6 border-t border-border/50">
                                                <AnimatedButton to="/contact" className="w-auto">
                                                    Start je Project
                                                </AnimatedButton>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </DialogContent>
                        )}
                    </AnimatePresence>
                </Dialog>
            ) : (
                /* MOBILE/TABLET: Bottom Drawer optimized for screen fit */
                <Drawer open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
                    <AnimatePresence mode="wait">
                        {selectedProject && (
                            <DrawerContent className="max-h-[92vh]" asChild forceMount>
                                <motion.div
                                    initial={{ opacity: 0, y: 100 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 100 }}
                                    transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                                >
                                    <div className="mx-auto w-full max-w-lg h-full flex flex-col relative">
                                        {/* Close Button Absolute */}
                                        <DrawerClose className="absolute top-4 right-4 z-50 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-sm transition-colors">
                                            <X className="w-5 h-5" />
                                            <span className="sr-only">Sluiten</span>
                                        </DrawerClose>

                                        {/* Image Header - Taller for better visibility */}
                                        <div className="relative w-full aspect-video bg-secondary shrink-0 overflow-hidden rounded-t-[10px]">
                                            <img
                                                src={selectedProject.image}
                                                alt={selectedProject.title}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                            <div className="absolute bottom-4 left-5 right-5">
                                                <Badge variant="secondary" className="bg-white/20 text-white backdrop-blur-md mb-2 border-transparent">
                                                    {selectedProject.category}
                                                </Badge>
                                                <DrawerTitle className="text-xl font-bold text-white leading-tight">
                                                    {selectedProject.title}
                                                </DrawerTitle>
                                            </div>
                                        </div>

                                        {/* Scrollable Content */}
                                        <div className="p-5 overflow-y-auto flex-1">
                                            <DrawerDescription className="text-base text-muted-foreground leading-relaxed mb-6">
                                                {selectedProject.description}
                                            </DrawerDescription>

                                            <div className="space-y-3">
                                                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Expertises</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedProject.tags.map((tag) => (
                                                        <Badge key={tag} variant="outline" className="text-xs py-1.5 px-3 border-accent/20 text-foreground">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Sticky Footer */}
                                        <div className="p-4 border-t border-border/50 bg-background/95 backdrop-blur shrink-0 grid grid-cols-[1fr,auto] gap-3">
                                            <AnimatedButton to="/contact" className="w-full justify-center">
                                                Start je Project
                                            </AnimatedButton>
                                            <DrawerClose asChild>
                                                <Button variant="outline" size="icon" className="w-10 h-10 rounded-full shrink-0">
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </DrawerClose>
                                        </div>
                                    </div>
                                </motion.div>
                            </DrawerContent>
                        )}
                    </AnimatePresence>
                </Drawer>
            )}
        </section>
    );
};
