/**
 * Optimized Animation Variants for Smooth 60fps Performance
 * 
 * Deze variants zijn geoptimaliseerd voor:
 * - GPU acceleratie met will-change hints
 * - Snelle stagger timings (0.08s)
 * - Korte durations (0.5s)
 * - Smooth cubic bezier easing
 * - Reduced motion support
 */

import { Variants } from "framer-motion";

/**
 * Optimized stagger container voor lijsten en grids
 * Gebruik: Voor parent containers met meerdere children
 */
export const optimizedStaggerContainer = (shouldReduceMotion: boolean = false): Variants => ({
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: shouldReduceMotion ? 0 : 0.08,
            delayChildren: 0.1
        }
    }
});

/**
 * Optimized stagger item voor individuele items in een lijst
 * Gebruik: Voor child elementen binnen een stagger container
 */
export const optimizedStaggerItem = (shouldReduceMotion: boolean = false): Variants => ({
    hidden: {
        opacity: 0,
        y: shouldReduceMotion ? 0 : 30
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1] // Smooth cubic bezier
        }
    }
});

/**
 * Optimized fade up animatie
 * Gebruik: Voor hero secties en grote content blocks
 */
export const optimizedFadeUp = (shouldReduceMotion: boolean = false): Variants => ({
    hidden: {
        opacity: 0,
        y: shouldReduceMotion ? 0 : 40
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1]
        }
    }
});

/**
 * Optimized scale up animatie
 * Gebruik: Voor cards en interactive elementen
 */
export const optimizedScaleUp = (shouldReduceMotion: boolean = false): Variants => ({
    hidden: {
        opacity: 0,
        scale: shouldReduceMotion ? 1 : 0.95
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1]
        }
    }
});

/**
 * Optimized slide in from left
 * Gebruik: Voor side-by-side content
 */
export const optimizedSlideInLeft = (shouldReduceMotion: boolean = false): Variants => ({
    hidden: {
        opacity: 0,
        x: shouldReduceMotion ? 0 : -40
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1]
        }
    }
});

/**
 * Optimized slide in from right
 * Gebruik: Voor side-by-side content
 */
export const optimizedSlideInRight = (shouldReduceMotion: boolean = false): Variants => ({
    hidden: {
        opacity: 0,
        x: shouldReduceMotion ? 0 : 40
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1]
        }
    }
});

/**
 * GPU acceleratie style object
 * Gebruik: Voeg toe aan style prop van animerende elementen
 */
export const gpuAcceleration = {
    willChange: 'transform, opacity' as const
};

/**
 * Optimized viewport settings voor IntersectionObserver
 * Gebruik: Voor whileInView animaties
 */
export const optimizedViewport = {
    once: true,
    margin: "-50px" // Start animatie 50px voor element in beeld komt
};

/**
 * Smooth easing curve voor natuurlijke animaties
 */
export const smoothEasing = [0.25, 0.1, 0.25, 1] as const;

/**
 * Helper functie voor instant animaties (reduced motion)
 */
export const getInstantTransition = (shouldReduceMotion: boolean) =>
    shouldReduceMotion ? { duration: 0.2 } : undefined;
