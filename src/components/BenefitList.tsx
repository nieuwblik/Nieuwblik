import { BeeldBlok, BlokKop, BlokTekst, fotoVoor } from "@/components/dienst/BeeldBlok";

interface BenefitItem {
  h3: string;
  text: string;
}

interface BenefitListProps {
  h2: string;
  /** Optionele zin onder de kop. */
  intro?: string;
  items: BenefitItem[];
  /** Niet meer gebruikt: de secties zijn wit, zoals op de installateurspagina. */
  className?: string;
  /** Extra blok onder de lijst. */
  children?: React.ReactNode;
  /** Welke casefoto (volgorde per pagina) en aan welke kant. */
  beeld?: number;
  links?: boolean;
}

/**
 * "Waarom Nieuwblik"-sectie van de stads-, branche- en regiopagina's, in de stijl van
 * de installateurspagina: een casefoto tot de rand van het scherm en ernaast de
 * statementkop met de punten als regels met haarlijnen ertussen. De foto verschilt per
 * pagina (gekozen op de kop), zodat niet elke pagina met dezelfde case begint.
 */
const BenefitList = ({ h2, intro, items, children, beeld = 0, links = true }: BenefitListProps) => {
  const foto = fotoVoor(beeld, h2);
  const inhoud = (
    <>
      <BlokKop>{h2}</BlokKop>
      {intro && (
        <BlokTekst>
          <p>{intro}</p>
        </BlokTekst>
      )}
      <ul className="mt-8 border-t border-border">
        {items.map((item) => (
          <li key={item.h3} className="border-b border-border py-6 md:py-7">
            <h3 className="text-xl font-semibold leading-snug text-foreground md:text-2xl">{item.h3}</h3>
            <p className="mt-2 max-w-[62ch] leading-relaxed text-muted-foreground">{item.text}</p>
          </li>
        ))}
      </ul>
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
};

export default BenefitList;
