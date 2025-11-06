import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Globe, Palette, ShoppingBag, Pen } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Globe,
      title: "Website Design & Development",
      description: "Custom-built, responsive websites that combine stunning design with powerful functionality. From corporate sites to complex web applications, we craft digital experiences that convert visitors into customers.",
      features: [
        "Responsive & Mobile-First Design",
        "SEO Optimization",
        "Performance & Speed Optimization",
        "CMS Integration",
        "E-commerce Solutions"
      ]
    },
    {
      icon: Palette,
      title: "Brand Identity & Kits",
      description: "Comprehensive brand identity systems that establish your unique visual language. We create cohesive brand kits that ensure consistency across all touchpoints.",
      features: [
        "Logo Design & Variations",
        "Color Palette Development",
        "Typography System",
        "Brand Guidelines",
        "Marketing Collateral"
      ]
    },
    {
      icon: ShoppingBag,
      title: "E-commerce Solutions",
      description: "Full-service e-commerce design including product listings, banners, and complete shop designs that drive sales and enhance user experience.",
      features: [
        "Product Listing Design",
        "Custom Banners & Graphics",
        "Shop Page Layouts",
        "Conversion Optimization",
        "Mobile Shopping Experience"
      ]
    },
    {
      icon: Pen,
      title: "Custom Design Services",
      description: "From e-books to vehicle wrapping, we deliver high-quality custom designs tailored to your specific needs and brand identity.",
      features: [
        "E-book Design & Layout",
        "Vehicle Wrapping Graphics",
        "Print Materials",
        "Social Media Graphics",
        "Custom Illustrations"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="container mx-auto px-6">
          <p className="text-accent-light text-accent mb-6">OUR SERVICES</p>
          <h1 className="text-display mb-6">
            Comprehensive Digital Solutions
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl font-light">
            We specialize in creating premium digital experiences that elevate your brand and drive measurable results.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="pb-20 md:pb-32">
        <div className="container mx-auto px-6">
          <div className="space-y-24">
            {services.map((service, index) => (
              <div 
                key={index}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-6">
                    <service.icon className="w-8 h-8" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">{service.title}</h2>
                  <p className="text-muted-foreground text-lg mb-8 font-light">
                    {service.description}
                  </p>
                  <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <Link to="/contact">Get Started</Link>
                  </Button>
                </div>
                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <div className="bg-secondary p-8 rounded-lg">
                    <h3 className="font-semibold mb-4">What's Included:</h3>
                    <ul className="space-y-3">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
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
            Ready to Elevate Your Brand?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto font-light">
            Let's discuss how our services can help you achieve your business goals.
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

export default Services;
