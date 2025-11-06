import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.png";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
      isScrolled 
        ? "bg-primary border-primary" 
        : "bg-background/95 backdrop-blur-sm border-border"
    }`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src={logo} 
              alt="Nieuwblik" 
              className={`h-8 md:h-10 transition-all duration-300 ${
                isScrolled ? "brightness-0 invert" : ""
              }`}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors ${
                  isScrolled
                    ? location.pathname === item.path
                      ? "text-primary-foreground"
                      : "text-primary-foreground/70 hover:text-primary-foreground"
                    : location.pathname === item.path
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground/80"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/contact">Start Your Project</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 transition-colors ${
              isScrolled ? "text-primary-foreground" : ""
            }`}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pt-4 pb-2 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block py-2 text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/contact" onClick={() => setIsOpen(false)}>
                Start Your Project
              </Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
