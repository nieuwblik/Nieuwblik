import { Link } from "@/lib/router-compat";

/** Alinea met [tekst](/pad) als interne link (cityLokaal, werkgebiedLokaal); [tekst](/) is de homepage. */
const Alinea = ({ tekst }: { tekst: string }) => (
  <p className="text-muted-foreground leading-relaxed">
    {tekst.split(/\[([^\]]+)\]\((\/[^)]*)\)/).map((deel, i, delen) => {
      // De split levert om en om: tekst, linktekst, pad, tekst, ...
      if (i % 3 === 1) {
        return (
          <Link
            key={i}
            to={delen[i + 1]!}
            className="text-accent hover:underline font-semibold"
          >
            {deel}
          </Link>
        );
      }
      return i % 3 === 2 ? null : <span key={i}>{deel}</span>;
    })}
  </p>
);

export default Alinea;
