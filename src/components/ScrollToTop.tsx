import { useEffect, useRef } from "react";
import { useLocation } from "@/lib/router-compat";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const vorige = useRef(pathname);

  useEffect(() => {
    // Alleen bij een andere pagina. Bij een refresh herstelt de router de
    // scrollpositie; hier naar boven springen zette die meteen weer ongedaan.
    if (vorige.current === pathname) return;
    vorige.current = pathname;

    // Scroll to top immediately on route change
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant"
    });

    // Fallback for browsers that don't support behavior: instant
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return null;
};

export default ScrollToTop;
