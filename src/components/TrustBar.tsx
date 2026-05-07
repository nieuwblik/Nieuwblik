import { Star } from "lucide-react";

const TrustBar = () => {
  return (
    <section className="bg-secondary border-y border-border/50 py-6">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-accent text-accent" />
              ))}
            </div>
            <p className="text-sm md:text-base font-medium text-foreground">
              5,0 op Google,{" "}
              <span className="text-muted-foreground font-normal">
                op basis van 15+ reviews
              </span>
            </p>
          </div>

          <div className="hidden md:block h-6 w-px bg-border" />

          <p className="text-sm text-muted-foreground">
            Vertrouwd door MKB ondernemers door heel Nederland
          </p>
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
