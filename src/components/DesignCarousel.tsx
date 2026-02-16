import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { AnimatedButton } from "@/components/ui/animated-button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useMotionValue, useSpring, useTransform } from "framer-motion";

import kattenbakListingImg from "@/assets/projects/kattenbak-listing.png";
import hamburgerPressListingImg from "@/assets/projects/hamburger-press-listing.png";
import pastamachineListingImg from "@/assets/projects/pastamachine-listing.png";
import compressorListingImg from "@/assets/projects/compressor-listing.png";
import babycameraVerpakkingImg from "@/assets/projects/babycamera-verpakking.jpg";
import qmateGrondspotsImg from "@/assets/projects/qmate-grondspots-verpakking.jpg";

type ShowcaseItem = {
    id: number;
    title: string;
    category: "Verpakking" | "Design";
    image: string;
    description: string;
    tags: string[];
    client?: string;
};

const items: ShowcaseItem[] = [
    {
        id: 1,
        title: "Compressor Listing",
        category: "Design",
        image: compressorListingImg,
        description: "Professionele e-commerce productfotografie en listing design dat direct de aandacht trekt op grote marktplaatsen. Geoptimaliseerd voor maximale conversie.",
        tags: ["E-commerce", "Shopify", "WooCommerce", "Amazon"],
    },
    {
        id: 2,
        title: "Pastamachine Listing",
        category: "Design",
        image: pastamachineListingImg,
        description: "Elegante productpresentatie voor een klassieke pastamachine. Heldere visuals die de Italiaanse keukenervaring overbrengen en kopers overtuigen.",
        tags: ["E-commerce", "Shopify", "WooCommerce", "Amazon"],
        client: "KitchenZ",
    },
    {
        id: 3,
        title: "Kattenbak Listing",
        category: "Design",
        image: kattenbakListingImg,
        description: "Moderne productlisting voor een innovatieve kattenbak. Strakke visuals die hygiëne en gebruiksgemak benadrukken voor de veeleisende kattenliefhebber.",
        tags: ["E-commerce", "Shopify", "WooCommerce", "Amazon"],
        client: "Movendo",
    },
    {
        id: 4,
        title: "Hamburgerpers Listing",
        category: "Design",
        image: hamburgerPressListingImg,
        description: "Smakelijke productpresentatie voor BBQ-liefhebbers. Krachtige visuals die de kwaliteit en het plezier van outdoor koken perfect vastleggen.",
        tags: ["E-commerce", "Shopify", "WooCommerce", "Amazon"],
        client: "KitchenZ",
    },
    {
        id: 5,
        title: "Babycamera Verpakking",
        category: "Verpakking",
        image: babycameraVerpakkingImg,
        description: "Professioneel packaging design voor een slimme babycamera. Vertrouwenwekkend ontwerp dat veiligheid en technologie combineert voor jonge ouders.",
        tags: ["E-commerce", "Shopify", "WooCommerce", "Amazon"],
        client: "Famson",
    },
    {
        id: 6,
        title: "Grondspots Verpakking",
        category: "Verpakking",
        image: qmateGrondspotsImg,
        description: "Sfeervolle packaging voor solar grondspots. Premium uitstraling die de kwaliteit en duurzaamheid van het product direct communiceert.",
        tags: ["E-commerce", "Shopify", "WooCommerce", "Amazon"],
        client: "Q-Mate",
    },
];

export const DesignCarousel = () => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center", skipSnaps: false }, [
        Autoplay({ delay: 4000, stopOnInteraction: false, rootNode: (emblaRoot) => emblaRoot.parentElement }),
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

    const springConfig = { damping: 20, stiffness: 100 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    const x = useTransform(springX, [-0.5, 0.5], ["10%", "-10%"]);
    const y = useTransform(springY, [-0.5, 0.5], ["10%", "-10%"]);

    // Stop autoplay when popup is open
    useEffect(() => {
        const autoplay = emblaApi?.plugins()?.autoplay;
        if (!autoplay) return;

        if (selectedProject) {
            autoplay.stop();
        } else {
            // Check if not interacting
            autoplay.play();
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
        <section className="py-24 bg-background overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-20 max-w-3xl mx-auto">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-accent text-sm font-medium tracking-[0.2em] uppercase mb-4 block"
                    >
                        Custom Design
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold mb-6 text-foreground tracking-tight"
                    >
                        Jouw merk verdient een ontwerp die blijft hangen
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-muted-foreground font-light leading-relaxed max-w-3xl mx-auto"
                    >
                        Wij vertalen jouw visie naar visuele taal die opvalt, onthouden wordt en mensen in beweging zet.
                    </motion.p>
                </div>

                <div className="relative w-full">
                    {/* Carousel Viewport */}
                    <div className="overflow-visible cursor-grab active:cursor-grabbing pb-12" ref={emblaRef}>
                        <div className="flex touch-pan-y perspective-1000 items-center">
                            {items.map((item, index) => {
                                const isSelected = index === selectedIndex;
                                return (
                                    <div
                                        key={item.id}
                                        className="flex-[0_0_75%] md:flex-[0_0_30%] min-w-0 px-4 md:px-6 relative transition-[flex-basis] duration-500"
                                        style={{ zIndex: isSelected ? 20 : 1 }}
                                    >
                                        <div
                                            onClick={() => isSelected && setSelectedProject(item)}
                                            className={`relative transition-all duration-500 ${isSelected ? "cursor-pointer" : "cursor-grab"}`}
                                        >
                                            <motion.div
                                                initial={false}
                                                animate={{
                                                    scale: isSelected ? 1.25 : 0.9,
                                                    opacity: isSelected ? 1 : 0.5,
                                                    filter: isSelected ? "blur(0px) grayscale(0%)" : "blur(1px) grayscale(100%)",
                                                    y: isSelected ? 0 : 20,
                                                }}
                                                whileHover={isSelected ? { scale: 1.28 } : {}}
                                                transition={{
                                                    duration: 0.8,
                                                    ease: [0.25, 0.1, 0.25, 1],
                                                }}
                                                className="flex flex-col relative group"
                                            >
                                                <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-2xl bg-secondary">
                                                    <motion.img
                                                        src={item.image}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover"
                                                        loading="lazy"
                                                        width="800"
                                                        height="600"
                                                        animate={{
                                                            scale: isSelected ? 1.05 : 1,
                                                        }}
                                                        transition={{ duration: 1.2 }}
                                                    />

                                                    {/* Gradient Overlay */}
                                                    <div
                                                        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 ${isSelected ? "opacity-100" : "opacity-0"}`}
                                                    />

                                                    {/* Content Overlay - Bottom Left */}
                                                    <div
                                                        className={`absolute inset-0 flex items-end p-4 md:p-8 transition-opacity duration-500 ${isSelected ? "opacity-100" : "opacity-0"}`}
                                                    >
                                                        <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3 sm:gap-6 w-full transform translate-y-0 sm:translate-y-[-15%] sm:ml-4">
                                                            {/* Title */}
                                                            <h3 className="text-white text-lg sm:text-xl md:text-2xl font-bold tracking-tight shrink-0 group-hover:text-white/90 transition-colors duration-300 max-w-full sm:max-w-[60%] text-center sm:text-left px-2 sm:px-0">
                                                                {item.title}
                                                            </h3>

                                                            {/* Button - Hidden on mobile, hidden by default on desktop, reveals on hover */}
                                                            <div className="hidden sm:block opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-400 ease-out origin-center sm:origin-left">
                                                                <span className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-black text-sm font-medium shadow-lg transform transition-all duration-200 hover:scale-105 hover:-translate-y-0.5">
                                                                    Bekijk
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-6 mt-4">
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full w-14 h-14 border hover:bg-foreground hover:text-background transition-colors bg-background/50 backdrop-blur-sm"
                            onClick={scrollPrev}
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>

                        <div className="flex gap-3">
                            {items.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => emblaApi?.scrollTo(index)}
                                    className={`h-1.5 rounded-full transition-all duration-500 ${index === selectedIndex ? "bg-foreground w-12" : "bg-muted-foreground/30 hover:bg-muted-foreground/50 w-2"
                                        }`}
                                    aria-label={`Ga naar slide ${index + 1}`}
                                />
                            ))}
                        </div>

                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full w-14 h-14 border hover:bg-foreground hover:text-background transition-colors bg-background/50 backdrop-blur-sm"
                            onClick={scrollNext}
                        >
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Premium Project Details Popup */}
            {isDesktop ? (
                <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
                    <DialogContent className="max-w-[85vw] w-[85vw] h-[85vh] p-0 gap-0 overflow-hidden bg-white dark:bg-zinc-900 border-none shadow-2xl rounded-[24px]">
                        {selectedProject && (
                            <motion.div
                                className="w-full h-full flex"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.4 }}
                            >
                                {/* Left: Immersive Image Area - No Parallax/Hover Movement */}
                                <div className="w-[65%] h-full relative overflow-hidden bg-secondary">
                                    <motion.img
                                        src={selectedProject.image}
                                        alt={selectedProject.title}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                        width="1200"
                                        height="900"
                                        initial={{ scale: 1.1 }}
                                        animate={{ scale: 1 }}
                                        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
                                    />
                                </div>

                                {/* Right: Content Panel */}
                                <div className="w-[35%] h-full p-8 lg:p-12 flex flex-col justify-center bg-background text-foreground relative">
                                    <div className="space-y-6">
                                        <div>
                                            <div className="flex items-center gap-3 mb-4">
                                                <Badge variant="outline" className="px-3 py-1 text-[10px] uppercase tracking-[0.15em] border-border text-muted-foreground">
                                                    {selectedProject.category}
                                                </Badge>
                                                {selectedProject.client && (
                                                    <span className="text-sm text-accent font-medium">
                                                        {selectedProject.client}
                                                    </span>
                                                )}
                                            </div>
                                            <h2 className="text-3xl lg:text-4xl font-bold leading-tight mb-4 tracking-tight text-foreground">
                                                {selectedProject.title}
                                            </h2>
                                            <p className="text-base text-muted-foreground leading-relaxed">
                                                {selectedProject.description}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {selectedProject.tags.map((tag) => (
                                                <Badge key={tag} variant="secondary" className="px-3 py-1.5 text-xs font-medium">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>

                                        <div className="pt-6 mt-auto">
                                            <AnimatedButton to="/contact" className="w-full justify-center">
                                                Start je Project
                                            </AnimatedButton>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </DialogContent>
                </Dialog>
            ) : (
                <Drawer open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
                    <DrawerContent className="max-h-[90vh] bg-background">
                        <div className="mx-auto w-full max-w-lg h-full flex flex-col relative">
                            {selectedProject && (
                                <>
                                    {/* Image with padding around it */}
                                    <div className="p-4 flex-shrink-0 relative">
                                        <div className="relative w-full aspect-[4/3] bg-secondary overflow-hidden rounded-[16px]">
                                            <img
                                                src={selectedProject.image}
                                                alt={selectedProject.title}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                                width="600"
                                                height="450"
                                            />
                                            <button
                                                onClick={() => setSelectedProject(null)}
                                                className="absolute top-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-colors shadow-sm"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="px-6 pb-6 overflow-y-auto flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Badge variant="outline" className="px-2 py-0.5 text-[10px] uppercase tracking-[0.15em]">{selectedProject.category}</Badge>
                                            {selectedProject.client && (
                                                <span className="text-sm text-accent font-medium">
                                                    {selectedProject.client}
                                                </span>
                                            )}
                                        </div>
                                        <DrawerTitle className="text-2xl font-bold mb-3">{selectedProject.title}</DrawerTitle>
                                        <DrawerDescription className="text-sm text-muted-foreground mb-6 leading-relaxed">
                                            {selectedProject.description}
                                        </DrawerDescription>
                                        <div className="flex flex-wrap gap-2 mb-8">
                                            {selectedProject.tags.map(tag => (
                                                <Badge key={tag} variant="secondary" className="text-xs font-medium">{tag}</Badge>
                                            ))}
                                        </div>
                                        <AnimatedButton to="/contact" className="w-full justify-center">
                                            Start je Project
                                        </AnimatedButton>
                                    </div>
                                </>
                            )}
                        </div>
                    </DrawerContent>
                </Drawer>
            )}
        </section>
    );
};
