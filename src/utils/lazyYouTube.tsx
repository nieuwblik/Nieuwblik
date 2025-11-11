import { useState } from 'react';
import { Play } from 'lucide-react';

interface LazyYouTubeProps {
  videoId: string;
  title: string;
  className?: string;
}

/**
 * Lazy-loading YouTube embed component
 * Only loads iframe when user clicks play button
 * Saves bandwidth and improves performance
 */
export const LazyYouTube = ({ videoId, title, className = '' }: LazyYouTubeProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleClick = () => {
    setIsLoaded(true);
  };

  if (isLoaded) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className={className}
      />
    );
  }

  // Show thumbnail with play button before load
  return (
    <div 
      onClick={handleClick}
      className={`${className} cursor-pointer relative group`}
      style={{
        backgroundImage: `url(https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
        <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
          <Play className="w-8 h-8 text-white ml-1" fill="white" />
        </div>
      </div>
    </div>
  );
};
