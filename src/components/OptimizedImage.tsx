import { useState, useEffect, useRef } from 'react';
import { getImageSizes } from '@/utils/imageOptimization';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  type?: 'hero' | 'card' | 'thumbnail' | 'logo';
  priority?: boolean; // If true, skip lazy loading
  width?: number;
  height?: number;
}

/**
 * Optimized image component with lazy loading and responsive sizes
 */
export const OptimizedImage = ({
  src,
  alt,
  className = '',
  type = 'card',
  priority = false,
  width,
  height,
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority || !imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px',
      }
    );

    observer.observe(imgRef.current);

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [priority]);

  return (
    <img
      ref={imgRef}
      src={isInView ? src : undefined}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      onLoad={() => setIsLoaded(true)}
      width={width}
      height={height}
      sizes={getImageSizes(type)}
    />
  );
};
