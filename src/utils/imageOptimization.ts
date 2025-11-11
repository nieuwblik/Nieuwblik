/**
 * Image optimization utilities for better performance
 */

/**
 * Generate srcset for responsive images
 * @param imagePath - Base image path
 * @param sizes - Array of sizes to generate
 */
export const generateSrcSet = (imagePath: string, sizes: number[] = [400, 800, 1200]): string => {
  // For now, return the base image
  // In production, you would generate multiple sizes server-side or use a CDN
  return sizes.map(size => `${imagePath} ${size}w`).join(', ');
};

/**
 * Get optimal image sizes attribute for responsive images
 */
export const getImageSizes = (type: 'hero' | 'card' | 'thumbnail' | 'logo'): string => {
  switch (type) {
    case 'hero':
      return '(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px';
    case 'card':
      return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px';
    case 'thumbnail':
      return '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px';
    case 'logo':
      return '(max-width: 640px) 120px, 150px';
    default:
      return '100vw';
  }
};

/**
 * Lazy load images with intersection observer
 */
export const lazyLoadImage = (img: HTMLImageElement) => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const lazyImage = entry.target as HTMLImageElement;
          if (lazyImage.dataset.src) {
            lazyImage.src = lazyImage.dataset.src;
            lazyImage.classList.add('loaded');
            observer.unobserve(lazyImage);
          }
        }
      });
    },
    {
      rootMargin: '50px', // Start loading 50px before image enters viewport
    }
  );

  observer.observe(img);
};
