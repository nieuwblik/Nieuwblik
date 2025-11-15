import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.png";
import ReviewBar from "./ReviewBar";

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
    { name: "Diensten", path: "/diensten" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Over Ons", path: "/over-ons" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <>
      <ReviewBar isScrolled={isScrolled} />
      <nav className={`fixed ${isScrolled ? 'top-0' : 'top-[40px]'} left-0 right-0 z-50 transition-all duration-300 border-b ${
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
              width="160"
              height="40"
              fetchPriority="high"
              className={`h-8 md:h-10 transition-all duration-300 ${
                isScrolled ? "brightness-0 invert" : "brightness-0"
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
              <Link to="/contact">Start je Project</Link>
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
          <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg">
            <div className="flex flex-col py-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-6 py-3 text-base font-medium transition-colors border-l-4 ${
                    location.pathname === item.path
                      ? "text-foreground border-accent bg-accent/5"
                      : "text-muted-foreground border-transparent hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="px-6 py-3">
                <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link to="/contact" onClick={() => setIsOpen(false)}>
                    Start je Project
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
    </>
  );
};

export default Navigation;
