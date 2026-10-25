import { useEffect, useRef, useState } from "react";

const VIDEO = "https://pub-a11da7385cd64dfea9519cdfc41268e9.r2.dev/heroglide-library-backgrounds/Celestia_animated_background.mp4";

/**
 * De achtergrond van het portaal op de inlogpagina en de startpagina: een
 * rustige nachtscène die het hele scherm vult. Tot de video geladen is staat
 * er dezelfde nachtblauwe kleur, zodat er niets flitst; daarna komt hij zacht
 * op. Wie in het systeem minder beweging heeft ingesteld, krijgt een
 * stilstaand beeld.
 *
 * Onderin iets donkerder, zodat tekst en kaarten rustig op de scène liggen.
 * Dezelfde naam voor de paginaovergang op beide pagina's, zodat de scène bij
 * inloggen blijft staan terwijl de rest wisselt.
 */
const PortaalAchtergrond = () => {
  const video = useRef<HTMLVideoElement>(null);
  const [geladen, setGeladen] = useState(false);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.pause();
      return;
    }
    void v.play().catch(() => null);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 bg-[#1d2b3d]" style={{ viewTransitionName: "portaal-achtergrond" }} aria-hidden="true">
      <video
        ref={video}
        src={VIDEO}
        muted
        loop
        playsInline
        preload="auto"
        onLoadedData={() => setGeladen(true)}
        className={`h-full w-full object-cover transition-opacity duration-1000 ${geladen ? "opacity-100" : "opacity-0"}`}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/45" />
    </div>
  );
};

export default PortaalAchtergrond;
