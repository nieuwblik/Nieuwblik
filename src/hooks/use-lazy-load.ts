import { useEffect, useRef, useState } from 'react';

/**
 * Hook voor geavanceerde lazy loading met Intersection Observer
 * Laadt afbeeldingen alleen wanneer ze bijna in beeld komen
 */
export const useLazyLoad = (options = {}) => {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        // Als de afbeelding al geladen is, hoeven we niets te doen
        if (hasLoaded) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasLoaded) {
                        setIsIntersecting(true);
                        setHasLoaded(true);
                    }
                });
            },
            {
                // Laad afbeeldingen 200px voordat ze in beeld komen
                rootMargin: '200px',
                threshold: 0.01,
                ...options,
            }
        );

        observer.observe(element);

        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, [hasLoaded, options]);

    return { ref, isIntersecting, hasLoaded };
};

/**
 * Hook voor het preloaden van kritieke afbeeldingen
 */
export const useImagePreload = (src: string, priority: 'high' | 'low' = 'low') => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const img = new Image();

        // Stel fetchpriority in voor moderne browsers
        if ('fetchPriority' in img) {
            (img as any).fetchPriority = priority;
        }

        img.onload = () => setIsLoaded(true);
        img.onerror = () => setIsLoaded(false);
        img.src = src;

        return () => {
            img.onload = null;
            img.onerror = null;
        };
    }, [src, priority]);

    return isLoaded;
};
