import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { caseLaptops, caseTelefoons, type TelefoonFoto } from "@/data/caseMockups";
import { projects } from "@/data/projects";

const INKT_65 = "hsl(var(--sw-ink) / 0.65)";

/** Volgorde van de casefoto's als een pagina zelf niets kiest. */
const STANDAARD = ["laptop:esveld-installatie", "feigro-dakwerken", "taxi-drechterland", "vv-madjoe", "een-bundel-geluk", "esveld-installatie"];

/** Een casefoto: een slug voor de telefoonmockup of "laptop:<slug>" voor de laptopfoto. */
export function kiesFoto(keuze: string): { foto: TelefoonFoto; alt: string } | null {
  const laptop = keuze.startsWith("laptop:");
  const slug = laptop ? keuze.slice("laptop:".length) : keuze;
  const foto = laptop ? caseLaptops[slug] : caseTelefoons[slug];
  if (!foto) return null;
  const naam = projects.find((p) => p.slug === slug)?.title ?? "een klant";
  return { foto, alt: laptop ? `Website van ${naam} op een laptop` : `Mobiele website van ${naam} op een iPhone` };
}

/**
 * De n-de casefoto voor een pagina. `seed` verschuift de volgorde (bijvoorbeeld per
 * stad of branche), zodat niet elke pagina met dezelfde foto begint.
 */
export function fotoVoor(n: number, seed = "", eigenKeuze: string[] = []) {
  // Alleen cases waar een mockup van is; de rest vult aan met de standaardvolgorde.
  const eigen = eigenKeuze.filter((s) => kiesFoto(s));
  const basis = [...eigen, ...STANDAARD.filter((s) => !eigen.includes(s))];
  let verschuiving = 0;
  for (const teken of seed) verschuiving = (verschuiving * 31 + teken.charCodeAt(0)) >>> 0;
  const start = eigen.length ? 0 : verschuiving % basis.length;
  return kiesFoto(basis[(start + n) % basis.length]!);
}

/**
 * Tekstblok in de stijl van de homepage: een casefoto die tot de rand van het scherm
 * doorloopt (om en om links en rechts) met de tekst ernaast. Witte achtergrond, geen
 * overloop over de sectieranden.
 */
export function BeeldBlok({
  foto,
  alt,
  links,
  children,
}: {
  foto: TelefoonFoto;
  alt: string;
  links: boolean;
  children: ReactNode;
}) {
  return (
    <section className="relative bg-background">
      <div
        className={`grid grid-cols-1 lg:items-center ${links ? "lg:grid-cols-[minmax(0,44vw)_minmax(0,1fr)]" : "lg:grid-cols-[minmax(0,1fr)_minmax(0,44vw)]"}`}
      >
        <div className={`relative aspect-[4/5] overflow-hidden ${links ? "lg:rounded-r-3xl" : "lg:order-2 lg:rounded-l-3xl"}`}>
          <img
            src={foto.src}
            srcSet={foto.srcSet}
            sizes="(min-width: 1024px) 44vw, 100vw"
            width={foto.breedte}
            height={foto.hoogte}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: `50% ${Math.round(foto.midden * 100)}%` }}
          />
        </div>
        <div className={`px-4 py-14 sm:px-6 lg:px-16 lg:py-28 xl:px-24 ${links ? "" : "lg:order-1"}`}>
          <div className="max-w-[640px]">{children}</div>
        </div>
      </div>
    </section>
  );
}

/**
 * Tekstblok zonder foto: de statementkop links en de tekst rechts ernaast, wit. Zo
 * wisselen de blokken met en zonder foto elkaar af en wordt een lange pagina geen
 * rij gelijke beelden.
 */
export function TekstBlok({ kop, children }: { kop: ReactNode; children: ReactNode }) {
  return (
    <section className="bg-background py-20 md:py-28">
      <div className="container mx-auto grid grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16">
        <h2 className="sectie-kop lg:col-span-5">{kop}</h2>
        <div className="lg:col-span-7 lg:pt-3">
          <div className="max-w-[640px] space-y-5 text-lg font-light leading-relaxed" style={{ color: INKT_65 }}>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Statementkop zoals op de homepage ("Recent werk voor ondernemers…"). */
export const BlokKop = ({ children }: { children: ReactNode }) => <h2 className="sectie-kop">{children}</h2>;

export const BlokTekst = ({ children }: { children: ReactNode }) => (
  <div className="mt-6 space-y-5 text-lg font-light leading-relaxed" style={{ color: INKT_65 }}>
    {children}
  </div>
);

/** Punten als regels met haarlijnen ertussen: een kopje en een zin. */
export const BlokLijst = ({ items }: { items: { h3: string; sub?: string | undefined; text: ReactNode }[] }) => (
  <ul className="mt-8 border-t border-border">
    {items.map((item) => (
      <li key={item.h3} className="border-b border-border py-6 md:py-7">
        <h3 className="text-xl font-semibold leading-snug text-foreground md:text-2xl">{item.h3}</h3>
        {item.sub && (
          <p className="mt-1 text-sm font-semibold" style={{ color: "hsl(var(--sw-green))" }}>
            {item.sub}
          </p>
        )}
        <p className="mt-2 max-w-[62ch] text-base font-normal leading-relaxed text-muted-foreground">{item.text}</p>
      </li>
    ))}
  </ul>
);

export const BlokVinkjes = ({ items }: { items: ReactNode[] }) => (
  <ul className="mt-8 space-y-3.5">
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-3">
        <Check className="mt-1 h-4 w-4 shrink-0" style={{ color: "hsl(var(--sw-green))" }} strokeWidth={2.6} aria-hidden="true" />
        <span className="text-[0.9375rem] leading-relaxed md:text-base" style={{ color: INKT_65 }}>
          {item}
        </span>
      </li>
    ))}
  </ul>
);

/**
 * Een sectie met kop en tekst naast een casefoto (BeeldBlok). Zonder foto valt hij
 * terug op een gewone witte sectie, zodat er nooit een leeg vlak staat.
 */
export function BeeldSectie({
  keuze,
  links = true,
  kop,
  children,
}: {
  /** Slug van de telefoonmockup of "laptop:<slug>". */
  keuze: string;
  links?: boolean;
  kop: ReactNode;
  children: ReactNode;
}) {
  const foto = kiesFoto(keuze);
  const inhoud = (
    <>
      <BlokKop>{kop}</BlokKop>
      {children}
    </>
  );
  if (!foto) {
    return (
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6">{inhoud}</div>
      </section>
    );
  }
  return (
    <BeeldBlok foto={foto.foto} alt={foto.alt} links={links}>
      {inhoud}
    </BeeldBlok>
  );
}
