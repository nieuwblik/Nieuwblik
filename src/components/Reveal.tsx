import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";

import { useReducedMotion } from "@/lib/reduced-motion";

type Richting = "op" | "links" | "rechts";

interface RevealProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Waar het element vandaan komt. Standaard van onderen. */
  from?: Richting;
  /** Vertraging in seconden, voor een reeks die na elkaar binnenkomt. */
  delay?: number;
  /** Hoeveel het beweegt. */
  afstand?: number;
  as?: ElementType;
  /** Extra ref van de aanroeper; Reveal heeft er zelf ook een nodig. */
  innerRef?: (node: HTMLElement | null) => void;
}

const VERSCHUIVING: Record<Richting, (n: number) => string> = {
  op: (n) => `translate3d(0, ${n}px, 0)`,
  links: (n) => `translate3d(-${n}px, 0, 0)`,
  rechts: (n) => `translate3d(${n}px, 0, 0)`,
};

/**
 * Verschijnt zodra hij in beeld komt: opdoemen en op zijn plek schuiven, één
 * keer.
 *
 * Dit patroon stond overal met framer-motion (`initial` plus `whileInView`),
 * en dat was verreweg het meest voorkomende gebruik. Een bibliotheek van 400
 * KB voor een overgang die de browser zelf kan doen, en juist in het kritieke
 * pad van de homepage. Beweegt alleen transform en opacity, dus de compositor
 * doet het werk en niet de hoofddraad.
 */
const Reveal = ({
  children,
  className,
  style,
  from = "op",
  delay = 0,
  afstand = 24,
  as: Tag = "div",
  innerRef,
}: RevealProps) => {
  const ref = useRef<HTMLElement | null>(null);
  const [zichtbaar, setZichtbaar] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Zonder IntersectionObserver (of met reduced motion) meteen tonen: beter
    // zichtbaar zonder animatie dan onzichtbaar.
    if (typeof IntersectionObserver === "undefined") {
      setZichtbaar(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setZichtbaar(true);
        observer.disconnect();
      },
      { rootMargin: "0px 0px -80px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const beweegt = !reduced && !zichtbaar;

  return (
    <Tag
      ref={(node: HTMLElement | null) => {
        ref.current = node;
        innerRef?.(node);
      }}
      className={className}
      style={{
        opacity: beweegt ? 0 : 1,
        transform: beweegt ? VERSCHUIVING[from](afstand) : "none",
        transition: reduced
          ? undefined
          : `opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.55s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
        willChange: beweegt ? "opacity, transform" : undefined,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
