import { motion, useReducedMotion } from "framer-motion";
import { easings, fadeUp } from "@/lib/motion";

// Import tool logos
import wordpressLogo from "@/assets/tools/wordpress.svg";
import woocommerceLogo from "@/assets/tools/woocommerce.svg";
import canvaLogo from "@/assets/tools/canva.svg";
import lovableLogo from "@/assets/tools/lovable.svg";
import boltLogo from "@/assets/tools/bolt.svg";
import hadoseoLogo from "@/assets/tools/hadoseo.svg";
import shopifyLogo from "@/assets/tools/shopify.svg";
import replitLogo from "@/assets/tools/replit.svg";
import framerLogo from "@/assets/tools/framer.svg";
import webflowLogo from "@/assets/tools/webflow.svg";
import figmaLogo from "@/assets/tools/figma.svg";

const ToolsSlider = () => {
  const shouldReduceMotion = useReducedMotion();

  const tools = [
    { name: "WordPress", logo: wordpressLogo, alt: "WordPress CMS platform - professionele website ontwikkeling en contentbeheer" },
    { name: "WooCommerce", logo: woocommerceLogo, alt: "WooCommerce e-commerce oplossing - online winkel en webshop ontwikkeling" },
    { name: "Canva", logo: canvaLogo, alt: "Canva design tool - grafisch ontwerp en visuele content creatie" },
    { name: "Lovable", logo: lovableLogo, alt: "Lovable development platform - snelle website en app ontwikkeling" },
    { name: "Bolt", logo: boltLogo, alt: "Bolt development tool - moderne web applicatie ontwikkeling" },
    { name: "HadoSEO", logo: hadoseoLogo, alt: "HadoSEO tool - zoekmachine optimalisatie en SEO analyse" },
    { name: "Shopify", logo: shopifyLogo, alt: "Shopify e-commerce platform - professionele webshop en online verkoop" },
    { name: "Replit", logo: replitLogo, alt: "Replit development environment - collaborative coding en web development" },
    { name: "Framer", logo: framerLogo, alt: "Framer design tool - interactieve website prototypes en design" },
    { name: "Webflow", logo: webflowLogo, alt: "Webflow website builder - visueel webdesign zonder code" },
    { name: "Figma", logo: figmaLogo, alt: "Figma design software - UI/UX design en collaborative prototyping" }
  ];

  // Duplicate tools for seamless infinite scroll
  const duplicatedTools = [...tools, ...tools];

  return (
    <motion.section 
      className="py-12 md:py-16 bg-secondary overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeUp}
    >
      <motion.div 
        className="container mx-auto px-6 mb-8"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.4, ease: easings.easeOutExpo }}
      >
        <p className="text-center text-muted-foreground text-sm md:text-base font-light">
          Tools en Technologieën die Wij Gebruiken
        </p>
      </motion.div>
      
      <div className="relative">
        {/* Gradient overlays for fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-secondary to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-secondary to-transparent z-10" />
        
        {/* Scrolling container */}
        <motion.div 
          className="flex"
          animate={shouldReduceMotion ? {} : { 
            x: [0, -1920] 
          }}
          transition={shouldReduceMotion ? {} : {
            x: {
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            },
          }}
          whileHover={shouldReduceMotion ? {} : { animationPlayState: "paused" }}
        >
          {duplicatedTools.map((tool, index) => (
            <motion.div 
              key={`${tool.name}-${index}`} 
              className="flex-shrink-0 mx-8 md:mx-12 flex items-center justify-center"
              style={{ width: "120px", height: "60px" }}
              whileHover={shouldReduceMotion ? {} : { 
                scale: 1.1, 
                opacity: 1,
              }}
              transition={{ duration: 0.2, ease: easings.easeOutQuart }}
            >
              <img 
                src={tool.logo} 
                alt={tool.alt} 
                loading="lazy"
                decoding="async"
                width="120"
                height="60"
                className="max-w-full max-h-full object-contain opacity-60 hover:opacity-100 transition-opacity duration-300"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ToolsSlider;
