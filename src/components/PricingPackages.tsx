import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const packages = [
  {
    name: "Starter",
    price: "990",
    tagline: "Voor zzp en kleine ondernemers",
    features: [
      "1 tot 5 pagina's",
      "Volledig responsive design",
      "Basis SEO en snelheidsoptimalisatie",
      "Contactformulier en Google Maps",
      "Live binnen 2 weken",
    ],
    cta: "Vraag offerte aan",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "1990",
    tagline: "Onze meest gekozen oplossing",
    features: [
      "Tot 10 pagina's op maat",
      "CMS, beheer alles zelf",
      "Uitgebreide SEO en blogfunctie",
      "Koppelingen met externe tools",
      "30 dagen gratis nazorg",
    ],
    cta: "Vraag offerte aan",
    highlighted: true,
  },
  {
    name: "Op maat",
    price: null,
    tagline: "Webshops en complexe projecten",
    features: [
      "Onbeperkt pagina's en functies",
      "Webshop met betaalkoppelingen",
      "Maatwerk integraties en API's",
      "Persoonlijke strategie en advies",
      "Doorlopende ondersteuning",
    ],
    cta: "Plan een gesprek",
    highlighted: false,
  },
];

const PricingPackages = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <p className="text-accent text-sm font-medium tracking-[0.2em] uppercase mb-4">
            Heldere prijzen
          </p>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
            Pakketten die passen bij jouw groei
          </h2>
          <p className="text-lg text-muted-foreground font-light">
            Vaste vanaf-prijzen, geen verrassingen achteraf. Kies wat past en wij doen de rest.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className={cn(
                "relative rounded-2xl p-8 flex flex-col bg-white border transition-all duration-300 hover:-translate-y-1",
                pkg.highlighted
                  ? "border-accent shadow-2xl ring-2 ring-accent/30"
                  : "border-border/60 shadow-sm hover:shadow-lg"
              )}
            >
              {pkg.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs font-semibold px-4 py-1 rounded-full uppercase tracking-wider">
                  Meest gekozen
                </div>
              )}

              <h3 className="text-xl font-bold text-foreground mb-2">{pkg.name}</h3>
              <p className="text-sm text-muted-foreground mb-6">{pkg.tagline}</p>

              <div className="mb-6">
                {pkg.price ? (
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm text-muted-foreground">vanaf</span>
                    <span className="text-4xl font-extrabold text-foreground">€{pkg.price}</span>
                  </div>
                ) : (
                  <div className="text-2xl font-bold text-foreground">Op aanvraag</div>
                )}
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-foreground">
                    <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/start-je-project"
                className={cn(
                  "w-full text-center rounded-full px-6 py-3 font-semibold transition-colors",
                  pkg.highlighted
                    ? "bg-accent text-accent-foreground hover:bg-accent/90"
                    : "bg-secondary text-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {pkg.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-10">
          Alle prijzen zijn exclusief btw. Hosting en domeinregistratie zijn optioneel.
        </p>
      </div>
    </section>
  );
};

export default PricingPackages;
