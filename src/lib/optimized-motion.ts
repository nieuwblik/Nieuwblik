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


/**
 * GPU acceleratie style object
 * Gebruik: Voeg toe aan style prop van animerende elementen
 */
export const gpuAcceleration = {
    willChange: 'transform, opacity' as const
};
