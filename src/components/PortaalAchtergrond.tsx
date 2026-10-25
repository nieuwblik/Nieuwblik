import { useEffect, useRef, useState } from "react";

/**
 * De scène als lus die heen en weer loopt: de oorspronkelijke video van vijf
 * seconden, gevolgd door dezelfde beelden achterstevoren. Zo is er geen sprong
 * waar de lus opnieuw begint. Een browser kan een video niet soepel achteruit
 * afspelen, vandaar één voorbereid bestand (gemaakt met ffmpeg, zonder dubbel
 * beeld op de keerpunten). Het eerste beeld staat er als stilstaand plaatje
 * tot de video speelt.
 */
const VIDEO = "/portaal/celestia-heen-en-weer.mp4";
const POSTER = "/portaal/celestia-poster.webp";

/** Waar de lus was toen je Start verliet; terugkomen speelt vanaf daar verder. */
let bewaardMoment = 0;

/**
 * De achtergrond van het portaal op de inlogpagina en de startpagina: een
 * rustige nachtscène die het hele scherm vult. Wie in het systeem minder
 * beweging heeft ingesteld, krijgt het stilstaande beeld.
 *
 * Onderin iets donkerder, zodat tekst en kaarten rustig op de scène liggen.
 * Dezelfde naam voor de paginaovergang op beide pagina's, zodat de scène bij
 * inloggen blijft staan terwijl de rest wisselt.
 */
const PortaalAchtergrond = () => {
  const video = useRef<HTMLVideoElement>(null);
  const [speelt, setSpeelt] = useState(false);

  // De nachtblauwe paginakleur van tijdens het laden (zie AdminBridge) weer weg
  // zodra de scène verdwijnt, anders schemert hij op andere pagina's door.
  useEffect(
    () => () => {
      document.documentElement.style.backgroundColor = "";
      document.body.style.backgroundColor = "";
    },
    [],
  );

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (bewaardMoment > 0) v.currentTime = bewaardMoment;
    void v.play().catch(() => null);
    return () => {
      bewaardMoment = v.currentTime;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 -z-10 bg-[#1d2b3d] bg-cover bg-center"
      style={{ viewTransitionName: "portaal-achtergrond", backgroundImage: `url(${POSTER})` }}
      aria-hidden="true"
    >
      <video
        ref={video}
        src={VIDEO}
        poster={POSTER}
        muted
        loop
        playsInline
        preload="auto"
        onPlaying={() => setSpeelt(true)}
        className={`h-full w-full object-cover transition-opacity duration-700 ${speelt ? "opacity-100" : "opacity-0"}`}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/25" />
    </div>
  );
};

export default PortaalAchtergrond;
