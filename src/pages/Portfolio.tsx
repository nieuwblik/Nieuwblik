import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Portfolio = () => {
  const projects = [
    {
      title: "Luxury Fashion Boutique",
      category: "E-commerce & Branding",
      description: "Complete brand identity and e-commerce platform for a high-end fashion retailer.",
      tags: ["Web Design", "Branding", "E-commerce"]
    },
    {
      title: "Tech Startup Platform",
      category: "Web Application",
      description: "Sophisticated web application with custom dashboard and analytics.",
      tags: ["Web Development", "UI/UX", "Custom Design"]
    },
    {
      title: "Restaurant Chain Rebrand",
      category: "Brand Identity",
      description: "Full rebranding including logo, menu design, and marketing materials.",
      tags: ["Branding", "Print Design", "Marketing"]
    },
    {
      title: "Professional Services Firm",
      category: "Corporate Website",
      description: "Premium corporate website with client portal and case study showcase.",
      tags: ["Web Design", "Development", "Content Strategy"]
    },
    {
      title: "Fitness Equipment Brand",
      category: "E-commerce & Graphics",
      description: "Product listing optimization and branded marketing assets.",
      tags: ["E-commerce", "Product Design", "Graphics"]
    },
    {
      title: "Creative Agency Portfolio",
      category: "Portfolio Website",
      description: "Minimalist portfolio showcasing work with smooth animations and transitions.",
      tags: ["Web Design", "Animation", "Portfolio"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="container mx-auto px-6">
          <p className="text-accent-light text-accent mb-6">OUR WORK</p>
          <h1 className="text-display mb-6">
            Selected Projects
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl font-light">
            A showcase of our recent work, demonstrating our commitment to excellence in design and functionality.
          </p>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="pb-20 md:pb-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {projects.map((project, index) => (
              <div 
                key={index}
                className="group cursor-pointer"
              >
                <div className="aspect-[4/3] bg-secondary rounded-lg mb-6 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-sm font-medium bg-background px-4 py-2 rounded-full">
                      View Case Study
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-accent font-light mb-2">{project.category}</p>
                  <h3 className="text-2xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-muted-foreground mb-4 font-light">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, idx) => (
                      <span 
                        key={idx}
                        className="text-xs px-3 py-1 bg-secondary rounded-full text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-secondary">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Let's Create Something Remarkable
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto font-light">
            Your project could be our next success story.
          </p>
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link to="/contact">Start Your Project</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Portfolio;
