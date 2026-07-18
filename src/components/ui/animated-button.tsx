import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps {
  children: React.ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  size?: "sm" | "default" | "lg";
  /** solid = the site's main button (filled green). outline = border + text only,
   *  fills to the solid look on hover. white = solid button for dark surfaces. */
  variant?: "solid" | "outline" | "white";
  showArrow?: boolean;
}

const SIZE_CLASSES = {
  sm: "px-4 py-2 min-h-[36px] text-sm gap-2",
  default: "px-5 py-2.5 min-h-[40px] text-base gap-2.5",
  lg: "px-8 py-3 min-h-[44px] text-base md:text-lg gap-3",
};

const ARROW_PX = { sm: 16, default: 20, lg: 22 };

const VARIANT_CLASSES = {
  solid: "border-2 border-transparent text-white",
  outline:
    "border-2 bg-transparent text-[hsl(160,84%,16%)] border-[hsl(160,84%,16%)] hover:bg-[hsl(160,84%,16%)] hover:text-white",
  white: "border-2 border-transparent bg-white text-[hsl(160,84%,16%)]",
};

/**
 * The site's main button — a solid green pill whose label rolls up on hover
 * (the duplicate copy stacked below slides into place) while the arrow flies
 * out diagonally and a second arrow flies in from the opposite corner.
 * `variant="outline"` is the secondary/sub button: same shape and motion,
 * just a hairline border + text until hover fills it in to the solid look.
 */
const AnimatedButton = ({
  children,
  to,
  href,
  onClick,
  className,
  size = "default",
  variant = "solid",
  showArrow = true,
}: AnimatedButtonProps) => {
  const shouldReduceMotion = useReducedMotion();
  const arrowPx = ARROW_PX[size];

  const handleHover = (el: HTMLElement, enter: boolean) => {
    if (shouldReduceMotion) return;
    const roll = el.querySelector<HTMLElement>(".animated-btn-roll");
    if (roll) gsap.to(roll, { yPercent: enter ? -100 : 0, duration: 0.55, ease: "power3.inOut", overwrite: true });

    if (!showArrow) return;
    const a = el.querySelector<HTMLElement>(".animated-btn-arrow-a");
    const b = el.querySelector<HTMLElement>(".animated-btn-arrow-b");
    const dist = arrowPx * 1.2;
    const opts = { duration: 0.5, ease: "power3.inOut", overwrite: true } as const;
    if (a) gsap.to(a, { x: enter ? dist : 0, y: enter ? -dist : 0, ...opts });
    if (b) gsap.to(b, { x: enter ? 0 : -dist, y: enter ? 0 : dist, ...opts });
  };

  const buttonClass = cn(
    "animated-btn inline-flex items-center justify-center rounded-md font-epilogue font-medium transition-colors duration-300",
    SIZE_CLASSES[size],
    VARIANT_CLASSES[variant],
    className
  );

  const style = variant === "solid" ? { background: "hsl(160, 84%, 16%)" } : undefined;

  const buttonContent = (
    <>
      <span className="animated-btn-mask relative inline-block overflow-hidden">
        <span className="animated-btn-roll relative block">
          <span className="block">{children}</span>
          <span className="block absolute left-0 top-full w-full" aria-hidden="true">
            {children}
          </span>
        </span>
      </span>
      {showArrow && (
        <span className="relative inline-block overflow-hidden flex-shrink-0" style={{ width: arrowPx, height: arrowPx }}>
          <ArrowUpRight className="animated-btn-arrow-a absolute inset-0" style={{ width: arrowPx, height: arrowPx }} />
          <ArrowUpRight
            className="animated-btn-arrow-b absolute inset-0"
            style={{ width: arrowPx, height: arrowPx, transform: `translate(${-arrowPx * 1.2}px, ${arrowPx * 1.2}px)` }}
            aria-hidden="true"
          />
        </span>
      )}
    </>
  );

  const handlers = {
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => handleHover(e.currentTarget, true),
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => handleHover(e.currentTarget, false),
  };

  if (to) {
    return (
      <Link to={to} className={buttonClass} style={style} {...handlers}>
        {buttonContent}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={buttonClass} style={style} target="_blank" rel="noopener noreferrer" {...handlers}>
        {buttonContent}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={buttonClass} style={style} {...handlers}>
      {buttonContent}
    </button>
  );
};

export { AnimatedButton };
