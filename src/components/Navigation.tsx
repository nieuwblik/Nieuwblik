import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe, Check } from "lucide-react";
import logo from "@/assets/logo.png";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: t("nav.home"), path: "/" },
    { name: t("nav.services"), path: "/services" },
    { name: t("nav.portfolio"), path: "/portfolio" },
    { name: t("nav.about"), path: "/about" },
    { name: t("nav.blog"), path: "/blog" },
    { name: t("nav.contact"), path: "/contact" },
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
              <Link to="/contact">{t("nav.cta")}</Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`flex items-center gap-2 text-sm font-medium transition-all duration-200 hover:scale-105 ${
                    isScrolled
                      ? "text-primary-foreground/70 hover:text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground/80"
                  }`}
                >
                  <Globe size={16} className="transition-transform duration-200 group-hover:rotate-12" />
                  {language.toUpperCase()}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32 bg-background border-border">
                <DropdownMenuItem 
                  onClick={() => setLanguage("en")}
                  className="cursor-pointer hover:bg-accent/50 transition-colors"
                >
                  <span className="flex items-center justify-between w-full">
                    English
                    {language === "en" && <Check size={16} className="text-primary" />}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setLanguage("nl")}
                  className="cursor-pointer hover:bg-accent/50 transition-colors"
                >
                  <span className="flex items-center justify-between w-full">
                    Nederlands
                    {language === "nl" && <Check size={16} className="text-primary" />}
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
              
              <div className="px-6 py-3 mt-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="flex items-center justify-between w-full px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground bg-secondary rounded-lg transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Globe size={18} />
                        {language === "en" ? "English" : "Nederlands"}
                      </span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-full min-w-[200px] bg-background border-border z-50">
                    <DropdownMenuItem 
                      onClick={() => {
                        setLanguage("en");
                        setIsOpen(false);
                      }}
                      className="cursor-pointer hover:bg-accent/50 transition-colors"
                    >
                      <span className="flex items-center justify-between w-full">
                        English
                        {language === "en" && <Check size={16} className="text-accent" />}
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => {
                        setLanguage("nl");
                        setIsOpen(false);
                      }}
                      className="cursor-pointer hover:bg-accent/50 transition-colors"
                    >
                      <span className="flex items-center justify-between w-full">
                        Nederlands
                        {language === "nl" && <Check size={16} className="text-accent" />}
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="px-6 py-3">
                <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link to="/contact" onClick={() => setIsOpen(false)}>
                    {t("nav.cta")}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
