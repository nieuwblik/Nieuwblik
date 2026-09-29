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
