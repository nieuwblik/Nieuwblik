import Alinea from "@/components/Alinea";
import { BeeldBlok, BlokKop, BlokTekst, TekstBlok, fotoVoor } from "@/components/dienst/BeeldBlok";
import type { LokaleSectie } from "@/data/lokaleInhoud";

/**
 * Eigen secties van een stads- of werkgebiedpagina, in de stijl van de
 * installateurspagina: om en om een blok met casefoto (afwisselend links en rechts)
 * en een tekstblok met de kop ernaast. `seed` en `cases` bepalen welke foto's.
 */
export function LokaleSecties({
  secties,
  seed = "",
  cases = [],
}: {
  secties: LokaleSectie[];
  seed?: string;
  cases?: string[] | undefined;
}) {
  return (
    <>
      {secties.map((sectie, i) => {
        const alineas = sectie.alineas.map((alinea, idx) => <Alinea key={idx} tekst={alinea} />);
        const foto = i % 2 === 0 ? fotoVoor(i / 2, seed, cases) : null;
        if (!foto) {
          return (
            <TekstBlok key={sectie.h2} kop={sectie.h2}>
              {alineas}
            </TekstBlok>
          );
        }
        return (
          <BeeldBlok key={sectie.h2} foto={foto.foto} alt={foto.alt} slug={foto.slug} naam={foto.naam} links={(i / 2) % 2 === 1}>
            <BlokKop>{sectie.h2}</BlokKop>
            <BlokTekst>{alineas}</BlokTekst>
          </BeeldBlok>
        );
      })}
    </>
  );
}

/**
 * Plaatshouders voor wat de eigenaar nog moet aanleveren. Alleen in
 * development zichtbaar: in de productiebuild rendert dit niets.
 */
export function TodoBlok({ items }: { items?: string[] | undefined }) {
  if (!import.meta.env.DEV || !items?.length) return null;
  return (
    <div className="container mx-auto px-4 sm:px-6 max-w-3xl my-8">
      <div className="rounded-xl border-2 border-dashed border-amber-500 bg-amber-50 p-5 text-sm text-amber-900">
        <p className="font-bold mb-2">TODO (alleen zichtbaar in development)</p>
        <ul className="list-disc pl-5 space-y-1">
          {items.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
