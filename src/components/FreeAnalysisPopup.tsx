import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AnimatedButton } from "@/components/ui/animated-button";
import { easings } from "@/lib/motion";

const DISMISS_KEY = "freeAnalysisPopupDismissed";
// Pages where offering the popup doesn't make sense: already converting,
// admin tooling, or the destination the popup itself links to.
const HIDDEN_ON = ["/gratis-website-analyse", "/contact", "/start-je-project", "/bedankt"];

const FreeAnalysisPopup = () => {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);

  const isHiddenHere = HIDDEN_ON.some((path) => location.pathname.startsWith(path)) || location.pathname.startsWith("/admin");

  // The popup lives outside <Routes>, so it never unmounts on navigation —
  // an already-visible popup has to be explicitly hidden when the route
  // changes to one where it doesn't belong (e.g. the page it links to).
  useEffect(() => {
    if (isHiddenHere) setVisible(false);
  }, [isHiddenHere]);

  useEffect(() => {
    if (sessionStorage.getItem(DISMISS_KEY)) return;
    if (isHiddenHere) return;

    // Reveal once the visitor has scrolled a bit past their first screen —
    // "after scrolling a few times" rather than immediately on page load.
    const threshold = window.innerHeight * 1.25;
    const handleScroll = () => {
      if (window.scrollY > threshold) {
        setVisible(true);
        window.removeEventListener("scroll", handleScroll);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname, isHiddenHere]);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem(DISMISS_KEY, "1");
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-8 left-8 z-50 w-[280px] sm:w-[320px] p-5 rounded-2xl border shadow-lg"
          style={{ background: "#fff", borderColor: "hsl(var(--sw-rule) / 0.14)" }}
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 20, transition: { duration: 0.2 } }}
          transition={{ duration: 0.5, ease: easings.easeOutExpo }}
        >
          <button
            type="button"
            onClick={dismiss}
            aria-label="Sluiten"
            className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <p className="sw-mono mb-2 pr-6" style={{ color: "hsl(var(--sw-green))" }}>
            Gratis
          </p>
          <h3 className="text-lg font-bold leading-snug mb-2 pr-6">
            Gratis website-analyse
          </h3>
          <p className="text-sm text-muted-foreground font-light leading-relaxed mb-4">
            Ontdek in 24 uur waar jouw website kansen laat liggen.
          </p>
          <AnimatedButton to="/gratis-website-analyse" size="sm" className="w-full">
            Start analyse
          </AnimatedButton>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FreeAnalysisPopup;
