import { cn } from "@/lib/utils";
import { initials } from "@/admin/format";
import { portfolioBeeld } from "@/admin/portfolio";

const MATEN = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
} as const;

interface AvatarProps {
  naam: string;
  /** Portfolio-slug van het project; zonder beeld wordt het een monogram. */
  slug?: string | null;
  maat?: keyof typeof MATEN;
  /** Rond voor mensen, afgerond vierkant voor klanten. */
  vorm?: "rond" | "vierkant";
  className?: string;
}

/**
 * Klant of persoon als klein beeld: het portfoliobeeld als dat er is, anders
 * de initialen. Eén component in plaats van zes losse varianten, en het
 * monogram is bewust neutraal: een eigen kleur per klant zou botsen met de
 * statuskleuren, die in het portaal een vaste betekenis hebben.
 */
const Avatar = ({ naam, slug, maat = "sm", vorm = "vierkant", className }: AvatarProps) => {
  const beeld = portfolioBeeld(slug);
  const rond = vorm === "rond" ? "rounded-full" : "rounded-lg";

  if (beeld) {
    return (
      <img
        src={beeld}
        alt=""
        loading="lazy"
        className={cn("shrink-0 object-cover object-top", MATEN[maat], rond, className)}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center bg-muted font-semibold text-foreground/70",
        MATEN[maat],
        rond,
        className,
      )}
    >
      {initials(naam)}
    </span>
  );
};

export default Avatar;
