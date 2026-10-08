import Alinea from "@/components/Alinea";
import type { LokaleSectie } from "@/data/lokaleInhoud";

/** Eigen secties van een stads- of werkgebiedpagina. */
export function LokaleSecties({ secties }: { secties: LokaleSectie[] }) {
  return (
    <>
      {secties.map((sectie, i) => (
        <section
          key={sectie.h2}
          className={`py-12 md:py-16 ${i % 2 === 0 ? "bg-secondary/40" : "bg-background"}`}
        >
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">{sectie.h2}</h2>
            <div className="space-y-4">
              {sectie.alineas.map((alinea, idx) => (
                <Alinea key={idx} tekst={alinea} />
              ))}
            </div>
          </div>
        </section>
      ))}
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
