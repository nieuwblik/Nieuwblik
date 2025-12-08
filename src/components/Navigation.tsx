import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import logo from "@/assets/logo.png";
import ReviewBar from "./ReviewBar";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [desktopServicesOpen, setDesktopServicesOpen] = useState(false);
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
    { name: "Portfolio", path: "/portfolio" },
    { name: "Over Ons", path: "/over-ons" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  const serviceItems = [
    { name: "Alle Diensten", path: "/diensten" },
    { name: "Website op Maat", path: "/diensten/website-op-maat" },
  ];

  return (
    <>
      <ReviewBar isScrolled={isScrolled} />
      <nav className={`fixed ${isScrolled ? 'top-0' : 'top-[40px]'} left-0 right-0 z-50 transition-all duration-300 border-b bg-background/95 backdrop-blur-sm border-border`}>
        <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src={logo} 
              alt="Nieuwblik" 
              width="120"
              height="30"
              fetchPriority="high"
              className="w-[120px] h-auto transition-all duration-300 brightness-0"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.slice(0, 1).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground/80"
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Services Dropdown - CSS-based for better performance */}
            <div 
              className="relative"
              onMouseEnter={() => setDesktopServicesOpen(true)}
              onMouseLeave={() => setDesktopServicesOpen(false)}
            >
              <button 
                className={`text-sm font-medium transition-colors flex items-center gap-1 ${
                  location.pathname.startsWith("/diensten")
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground/80"
                }`}
                onClick={() => setDesktopServicesOpen(!desktopServicesOpen)}
              >
                Diensten
                <ChevronDown className={`w-4 h-4 transition-transform ${desktopServicesOpen ? "rotate-180" : ""}`} />
              </button>
              
              {desktopServicesOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-background border border-border rounded-md shadow-lg py-1 z-50">
                  {serviceItems.map((item) => (
                    <Link 
                      key={item.path}
                      to={item.path}
                      className={`block px-4 py-2 text-sm transition-colors hover:bg-secondary ${
                        location.pathname === item.path ? "text-accent" : "text-muted-foreground"
                      }`}
                      onClick={() => setDesktopServicesOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {navItems.slice(1).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === item.path
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
            className="md:hidden p-2 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg">
            <div className="flex flex-col py-4">
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className={`px-6 py-3 text-base font-medium transition-colors border-l-4 ${
                  location.pathname === "/"
                    ? "text-foreground border-accent bg-accent/5"
                    : "text-muted-foreground border-transparent hover:text-foreground hover:bg-secondary"
                }`}
              >
                Home
              </Link>
              
              {/* Mobile Services Submenu */}
              <button
                onClick={() => setServicesOpen(!servicesOpen)}
                className={`px-6 py-3 text-base font-medium transition-colors border-l-4 flex items-center justify-between ${
                  location.pathname.startsWith("/diensten")
                    ? "text-foreground border-accent bg-accent/5"
                    : "text-muted-foreground border-transparent hover:text-foreground hover:bg-secondary"
                }`}
              >
                Diensten
                <ChevronDown className={`w-4 h-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
              </button>
              
              {servicesOpen && (
                <div className="bg-secondary/50">
                  {serviceItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`px-10 py-2 text-sm font-medium transition-colors block ${
                        location.pathname === item.path
                          ? "text-accent"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}

              {navItems.slice(1).map((item) => (
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
