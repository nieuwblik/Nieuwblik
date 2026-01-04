import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Menu, X, ChevronDown, Globe, ShoppingCart, TrendingUp } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import logo from "@/assets/logo.png";
import ReviewBar from "./ReviewBar";
import {
  mobileMenuVariants,
  mobileMenuItemVariants,
  easings,
  staggerContainerFast
} from "@/lib/motion";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [desktopServicesOpen, setDesktopServicesOpen] = useState(false);
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();
  const dienstenLinkRef = useRef<HTMLAnchorElement>(null);
  const navRef = useRef<HTMLElement>(null);

  // Measure and set header height as CSS variable
  useEffect(() => {
    const updateHeaderHeight = () => {
      if (navRef.current) {
        const height = navRef.current.offsetHeight;
        document.documentElement.style.setProperty('--header-height', `${height}px`);
      }
    };

    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setServicesOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Over Ons", path: "/over-ons" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  const serviceItems = [
    {
      name: "Website op maat",
      path: "/diensten/website-op-maat",
      icon: Globe,
      description: "Luxe websites & digitale architectuur"
    },
    {
      name: "Webshops",
      path: "/diensten/webshops",
      icon: ShoppingCart,
      description: "E-commerce die verkoopt"
    },
    {
      name: "E-commerce",
      path: "/diensten/e-commerce",
      icon: TrendingUp,
      description: "Groei & marketplace oplossingen"
    },
  ];

  // Animation variants for nav links
  const navLinkHover = {
    rest: {
      color: "hsl(var(--muted-foreground))",
      y: 0
    },
    hover: {
      color: "hsl(var(--foreground))",
      y: -1,
      transition: {
        duration: 0.2,
        ease: easings.easeOutQuart
      }
    }
  };

  // Premium dropdown animation variants
  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -8,
      scale: 0.96,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.25,
        ease: easings.easeOutExpo,
      },
    },
    exit: {
      opacity: 0,
      y: -4,
      scale: 0.98,
      transition: {
        duration: 0.15,
        ease: easings.easeInOutQuart,
      },
    },
  };

  // Dropdown item animation
  const dropdownItemVariants = {
    hidden: { opacity: 0, x: -12 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.25,
        ease: easings.easeOutExpo,
      },
    }),
  };

  return (
    <>
      <ReviewBar isScrolled={isScrolled} />
      <motion.nav
        ref={navRef}
        className={`fixed left-0 right-0 z-50 border-b bg-background/95 backdrop-blur-sm border-border`}
        initial={false}
        animate={{
          top: isScrolled ? 0 : 40,
        }}
        transition={{
          duration: shouldReduceMotion ? 0.1 : 0.3,
          ease: easings.easeOutExpo
        }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <motion.img
                src={logo}
                alt="Nieuwblik"
                width="120"
                height="30"
                fetchPriority="high"
                className="w-[120px] h-auto brightness-0"
                whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                transition={{ duration: 0.2, ease: easings.easeOutQuart }}
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.slice(0, 1).map((item) => (
                <motion.div
                  key={item.path}
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                >
                  <Link
                    to={item.path}
                    className={`text-sm font-medium transition-colors ${location.pathname === item.path
                      ? "text-foreground"
                      : "text-muted-foreground"
                      }`}
                  >
                    <motion.span
                      variants={location.pathname === item.path ? {} : navLinkHover}
                    >
                      {item.name}
                    </motion.span>
                  </Link>
                </motion.div>
              ))}

              {/* Premium Services Dropdown */}
              <div
                className="relative group"
                onMouseEnter={() => setDesktopServicesOpen(true)}
                onMouseLeave={() => setDesktopServicesOpen(false)}
              >
                <Link
                  ref={dienstenLinkRef}
                  to="/diensten"
                  className={`text-sm font-medium transition-colors flex items-center gap-1 ${location.pathname.startsWith("/diensten")
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground/80"
                    }`}
                >
                  Diensten
                  <motion.span
                    animate={{ rotate: desktopServicesOpen ? 180 : 0 }}
                    transition={{ duration: 0.2, ease: easings.easeOutQuart }}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.span>
                </Link>

                <AnimatePresence>
                  {desktopServicesOpen && (
                    <motion.div
                      className="absolute top-full pt-4 z-50 left-0 right-0 md:left-1/2 md:-translate-x-1/2"
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      {/* Dropdown Arrow - positioned exactly under Diensten link center */}


                      {/* Premium Dropdown Panel */}
                      <motion.div
                        className="relative bg-card border border-border rounded-xl shadow-2xl overflow-hidden min-w-[340px]"
                        style={{
                          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)"
                        }}
                      >
                        {/* Dropdown Header */}
                        <div className="px-5 py-4 border-b border-border bg-secondary/30">
                          <p className="text-xs font-semibold text-accent uppercase tracking-wider">Onze Diensten</p>
                        </div>

                        {/* Service Items */}
                        <div className="p-2">
                          {serviceItems.map((item, index) => (
                            <motion.div
                              key={item.path}
                              custom={index}
                              variants={dropdownItemVariants}
                              initial="hidden"
                              animate="visible"
                            >
                              <Link
                                to={item.path}
                                className={`flex items-start gap-4 px-4 py-3 rounded-lg transition-all duration-200 group/item ${location.pathname === item.path
                                  ? "bg-accent/10 text-accent"
                                  : "hover:bg-secondary text-foreground"
                                  }`}
                                onClick={() => setDesktopServicesOpen(false)}
                              >
                                {/* Icon Container */}
                                <motion.div
                                  className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-200 ${location.pathname === item.path
                                    ? "bg-accent/20 text-accent"
                                    : "bg-secondary group-hover/item:bg-accent/10 group-hover/item:text-accent"
                                    }`}
                                  whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                                  transition={{ duration: 0.15 }}
                                >
                                  <item.icon className="w-5 h-5" />
                                </motion.div>

                                {/* Text Content */}
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm font-semibold transition-colors duration-200 ${location.pathname === item.path
                                    ? "text-accent"
                                    : "text-foreground group-hover/item:text-accent"
                                    }`}>
                                    {item.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                    {item.description}
                                  </p>
                                </div>
                              </Link>
                            </motion.div>
                          ))}
                        </div>

                        {/* Dropdown Footer CTA */}
                        <div className="px-4 py-3 border-t border-border bg-secondary/20">
                          <Link
                            to="/diensten"
                            onClick={() => setDesktopServicesOpen(false)}
                            className="flex items-center justify-between text-sm text-muted-foreground hover:text-accent transition-colors duration-200 group/cta"
                          >
                            <span>Bekijk alle diensten</span>
                            <motion.span
                              className="text-accent"
                              whileHover={shouldReduceMotion ? {} : { x: 4 }}
                              transition={{ duration: 0.15 }}
                            >
                              →
                            </motion.span>
                          </Link>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {navItems.slice(1).map((item) => (
                <motion.div
                  key={item.path}
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                >
                  <Link
                    to={item.path}
                    className={`text-sm font-medium ${location.pathname === item.path
                      ? "text-foreground"
                      : "text-muted-foreground"
                      }`}
                  >
                    <motion.span
                      variants={location.pathname === item.path ? {} : navLinkHover}
                    >
                      {item.name}
                    </motion.span>
                  </Link>
                </motion.div>
              ))}

              <AnimatedButton to="/contact" size="default">
                Start je Project
              </AnimatedButton>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 transition-colors"
              aria-label="Toggle menu"
              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg overflow-hidden"
                variants={mobileMenuVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                <motion.div
                  className="flex flex-col py-4"
                  variants={staggerContainerFast}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div variants={mobileMenuItemVariants}>
                    <Link
                      to="/"
                      onClick={() => setIsOpen(false)}
                      className={`px-6 py-3 text-base font-medium transition-colors border-l-4 block ${location.pathname === "/"
                        ? "text-foreground border-accent bg-accent/5"
                        : "text-muted-foreground border-transparent hover:text-foreground hover:bg-secondary"
                        }`}
                    >
                      Home
                    </Link>
                  </motion.div>

                  {/* Mobile Services Submenu */}
                  <motion.div variants={mobileMenuItemVariants}>
                    <button
                      onClick={() => setServicesOpen(!servicesOpen)}
                      className={`w-full px-6 py-3 text-base font-medium transition-colors border-l-4 flex items-center justify-between ${location.pathname.startsWith("/diensten")
                        ? "text-foreground border-accent bg-accent/5"
                        : "text-muted-foreground border-transparent hover:text-foreground hover:bg-secondary"
                        }`}
                    >
                      Diensten
                      <motion.span
                        animate={{ rotate: servicesOpen ? 180 : 0 }}
                        transition={{ duration: 0.2, ease: easings.easeOutQuart }}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </motion.span>
                    </button>
                  </motion.div>

                  <AnimatePresence>
                    {servicesOpen && (
                      <motion.div
                        className="bg-secondary/50 overflow-hidden"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: easings.easeOutExpo }}
                      >
                        {serviceItems.map((item, index) => (
                          <motion.div
                            key={item.path}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{
                              opacity: 1,
                              x: 0,
                              transition: { delay: index * 0.05, duration: 0.2 }
                            }}
                            exit={{ opacity: 0, x: -10 }}
                          >
                            <Link
                              to={item.path}
                              onClick={() => setIsOpen(false)}
                              className={`flex items-center gap-3 px-8 py-3 text-sm font-medium transition-colors ${location.pathname === item.path
                                ? "text-accent bg-accent/10"
                                : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                                }`}
                            >
                              <item.icon className="w-4 h-4" />
                              <div>
                                <span className="block">{item.name}</span>
                                <span className="text-xs text-muted-foreground">{item.description}</span>
                              </div>
                            </Link>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {navItems.slice(1).map((item, index) => (
                    <motion.div
                      key={item.path}
                      variants={mobileMenuItemVariants}
                      custom={index + 2}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`px-6 py-3 text-base font-medium transition-colors border-l-4 block ${location.pathname === item.path
                          ? "text-foreground border-accent bg-accent/5"
                          : "text-muted-foreground border-transparent hover:text-foreground hover:bg-secondary"
                          }`}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}

                  <motion.div
                    className="px-6 py-3"
                    variants={mobileMenuItemVariants}
                  >
                    <AnimatedButton to="/contact" className="w-full" onClick={() => setIsOpen(false)}>
                      Start je Project
                    </AnimatedButton>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>
    </>
  );
};

export default Navigation;
