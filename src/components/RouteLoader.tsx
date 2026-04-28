import { useEffect, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import lottieSrc from "@/assets/trail-loading.lottie?url";

/**
 * Vertraagde loader: verschijnt pas na 300ms zodat snelle pagina overgangen
 * instant blijven voelen. Alleen zichtbaar bij trage of eerste load.
 */
const RouteLoader = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), 300);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in"
      role="status"
      aria-live="polite"
      aria-label="Pagina wordt geladen"
    >
      <div className="w-32 h-32 md:w-40 md:h-40">
        <DotLottieReact src={lottieSrc} autoplay loop />
      </div>
    </div>
  );
};

export default RouteLoader;
