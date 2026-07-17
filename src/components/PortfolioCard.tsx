import { Link } from "react-router-dom";
import gsap from "gsap";
import { useReducedMotion } from "framer-motion";

export interface PortfolioCardProps {
  title: string;
  category: string;
  image: string;
  slug: string;
  /** Small line above the title — homepage uses this for project duration. */
  meta?: string;
  /** Paragraph below the hairline rule — the portfolio page's case summary. */
  description?: string;
}

/**
 * The portfolio card visual — identical on the homepage (ScrollPortfolio) and
 * the /portfolio page. No entrance/exit animation of its own: each caller
 * wraps it in whatever motion its context needs (homepage: scroll-reveal;
 * /portfolio: filter-switch stagger + exit), so this only owns the hover
 * "roll" (title slides up, duplicate enters from below) and the static markup.
 */
export default function PortfolioCard({ title, category, image, slug, meta, description }: PortfolioCardProps) {
  const shouldReduceMotion = useReducedMotion();

  const roll = (container: HTMLElement, y: number) => {
    if (shouldReduceMotion) return;
    const el = container.querySelector<HTMLElement>(".pf-roll");
    if (el) gsap.to(el, { yPercent: y, duration: 0.55, ease: "power3.inOut", overwrite: true });
  };

  return (
    <article
      className="pf-card group"
      onMouseEnter={(e) => roll(e.currentTarget, -100)}
      onMouseLeave={(e) => roll(e.currentTarget, 0)}
    >
      <Link to={`/portfolio/${slug}`} aria-label={`Bekijk de case: ${title}`} className="block">
        {/* Image */}
        <div
          className="relative overflow-hidden rounded-2xl aspect-[16/10]"
          style={{ background: "hsl(var(--sw-ink) / 0.03)" }}
        >
          <img
            src={image}
            alt={`${title} — website ontworpen door Nieuwblik`}
            loading="lazy"
            className="w-full h-full object-cover object-top transition-[filter,transform] duration-500 ease-out will-change-transform group-hover:grayscale group-hover:blur-[6px] group-hover:scale-[1.04]"
          />

          {/* Category pill — hides on hover */}
          <span
            className="absolute bottom-4 right-4 px-3.5 py-1.5 rounded-full text-[11px] font-medium tracking-wider uppercase text-white transition-opacity duration-300 group-hover:opacity-0"
            style={{ background: "rgba(28,33,31,0.72)", backdropFilter: "blur(4px)" }}
          >
            {category}
          </span>

          {/* BEKIJK overlay — fades + scales in on hover */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span
              className="flex items-center justify-center rounded-full bg-white text-black text-sm font-semibold tracking-[0.15em] uppercase opacity-0 scale-75 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-100"
              style={{ width: 120, height: 120 }}
            >
              Bekijk
            </span>
          </div>
        </div>

        {/* Meta + rolling title */}
        <div className="mt-6">
          {meta && <p className="text-sm text-muted-foreground mb-3">{meta}</p>}

          <div className="pf-mask relative overflow-hidden">
            <div className="pf-roll relative">
              <span className="block text-2xl md:text-[1.75rem] font-bold uppercase tracking-tight leading-[1.1]" style={{ paddingBottom: "0.06em" }}>
                {title}
              </span>
              <span
                className="block absolute left-0 top-full w-full text-2xl md:text-[1.75rem] font-bold uppercase tracking-tight leading-[1.1]"
                style={{ paddingBottom: "0.06em" }}
                aria-hidden="true"
              >
                {title}
              </span>
            </div>
          </div>

          <div className="mt-5 h-px w-full" style={{ background: "hsl(var(--sw-rule) / 0.18)" }} />

          {description && (
            <p className="mt-4 text-sm md:text-base text-muted-foreground font-light leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}
