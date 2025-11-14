// Import tool logos
import lovableLogo from "@/assets/tools/lovable.svg";
import canvaLogo from "@/assets/tools/canva.svg";
import shopifyLogo from "@/assets/tools/shopify.svg";
import elementorLogo from "@/assets/tools/elementor.svg";
import wordpressLogo from "@/assets/tools/wordpress.svg";
import framerLogo from "@/assets/tools/framer.svg";
import webflowLogo from "@/assets/tools/webflow.svg";
import figmaLogo from "@/assets/tools/figma.svg";
import githubLogo from "@/assets/tools/github.svg";
import supabaseLogo from "@/assets/tools/supabase.svg";

const ToolsSlider = () => {
  const tools = [
    { name: "Lovable", logo: lovableLogo },
    { name: "Canva", logo: canvaLogo },
    { name: "Shopify", logo: shopifyLogo },
    { name: "Elementor", logo: elementorLogo },
    { name: "WordPress", logo: wordpressLogo },
    { name: "Framer", logo: framerLogo },
    { name: "Webflow", logo: webflowLogo },
    { name: "Figma", logo: figmaLogo },
    { name: "GitHub", logo: githubLogo },
    { name: "Supabase", logo: supabaseLogo }
  ];

  // Duplicate tools for seamless infinite scroll
  const duplicatedTools = [...tools, ...tools];

  return (
    <section className="py-12 md:py-16 bg-secondary overflow-hidden">
      <div className="container mx-auto px-6 mb-8">
        <p className="text-center text-muted-foreground text-sm md:text-base font-light">
          Tools en Technologieën die Wij Gebruiken
        </p>
      </div>
      
      <div className="relative">
        {/* Gradient overlays for fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-secondary to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-secondary to-transparent z-10" />
        
        {/* Scrolling container */}
        <div className="flex animate-infinite-scroll hover:pause-animation">
          {duplicatedTools.map((tool, index) => (
            <div 
              key={`${tool.name}-${index}`} 
              className="flex-shrink-0 mx-8 md:mx-12 flex items-center justify-center"
              style={{ width: "120px", height: "60px" }}
            >
              <img 
                src={tool.logo} 
                alt={`${tool.name} logo`} 
                loading="lazy"
                decoding="async"
                width="120"
                height="60"
                className="max-w-full max-h-full object-contain opacity-60 hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToolsSlider;
