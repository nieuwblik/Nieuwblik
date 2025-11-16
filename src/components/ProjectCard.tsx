import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ProjectCardProps {
  title: string;
  category: string;
  description: string;
  image: string;
  url: string;
  tags?: string[];
}

const ProjectCard = ({ title, category, description, image, url, tags }: ProjectCardProps) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <div className="group cursor-pointer block relative">
        <div className="aspect-[4/3] bg-secondary rounded-lg mb-6 overflow-hidden relative">
          <img 
            src={image} 
            alt={title}
            loading="lazy"
            decoding="async"
            width="800"
            height="600"
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out" />
          
          {/* Buttons */}
          <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium bg-background px-6 py-3 rounded-full flex items-center gap-2 shadow-lg border border-border/20 hover:bg-background/90 transition-all duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              Bekijk website
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowDetails(true);
              }}
              className="text-sm font-medium bg-background px-6 py-3 rounded-full flex items-center gap-2 shadow-lg border border-border/20 hover:bg-background/90 transition-all duration-200"
            >
              Details
            </button>
          </div>
        </div>
        
        <div>
          <p className="text-sm text-accent font-light mb-2">{category}</p>
          <h3 className="text-2xl font-semibold mb-2 group-hover:text-accent transition-colors">{title}</h3>
          <p className="text-muted-foreground mb-4 font-light">{description}</p>
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, idx) => (
                <span 
                  key={idx}
                  className="text-xs px-3 py-1 bg-secondary rounded-full text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl w-[95vw] animate-scale-in">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-3xl font-bold mb-2">{title}</h2>
              <p className="text-accent font-light">{category}</p>
            </div>
            
            {/* Image */}
            <div className="aspect-[16/10] bg-secondary rounded-lg overflow-hidden">
              <img 
                src={image} 
                alt={title}
                className="w-full h-full object-cover object-top"
              />
            </div>
            
            {/* Description */}
            <div>
              <h3 className="text-xl font-semibold mb-3">Over dit project</h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                {description}
              </p>
            </div>
            
            {/* Tags */}
            {tags && tags.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-3">Diensten</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, idx) => (
                    <span 
                      key={idx}
                      className="text-sm px-4 py-2 bg-secondary rounded-full text-muted-foreground font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* CTA Button */}
            <div className="pt-4 border-t border-border">
              <Button asChild className="w-full" size="lg">
                <Link to="/contact">Offerte aanvragen</Link>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectCard;
