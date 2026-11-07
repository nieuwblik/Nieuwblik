import Reveal from "@/components/Reveal";
import puurDesktop from "@/assets/analyse/puur-desktop.webp";
import puurMobiel from "@/assets/hero/hero-scherm-puur-in-harmonie.webp";

const RAND = "hsl(var(--sw-rule) / 0.12)";
const INKT_65 = "hsl(var(--sw-ink) / 0.65)";
const GROEN = "hsl(var(--sw-green))";

interface Onderdeel {
  titel: string;
  tekst: string;
  /** Kant van het beeld waar het label staat. */
  kant: "links" | "rechts";
  /** Hoogte van het label en de lijn, in procenten van het beeld. */
  hoogte: number;
  /** Tot hoever de lijn het beeld in loopt, gemeten vanaf de eigen kant. */
  diepte: number;
}

const onderdelen: Onderdeel[] = [
  { titel: "Vindbaarheid", tekst: "Hoe goed je gevonden wordt in Google en AI-zoekmachines zoals ChatGPT.", kant: "links", hoogte: 12, diepte: 42 },
  { titel: "Teksten", tekst: "Of bezoekers snel snappen wat je doet en wat ze moeten doen.", kant: "links", hoogte: 58, diepte: 26 },
  { titel: "Design", tekst: "Of je site er verzorgd uitziet en vertrouwen geeft.", kant: "rechts", hoogte: 30, diepte: 9 },
  { titel: "Mobiele weergave", tekst: "Of je site goed werkt op telefoon, tablet en computer.", kant: "rechts", hoogte: 68, diepte: 6 },
];

/** Een echte site in een browservenster, met de telefoonweergave ervoor. */
const Beeld = () => (
  <div className="relative">
    <div className="overflow-hidden rounded-xl border bg-white" style={{ borderColor: RAND }}>
      <div className="flex h-7 items-center gap-1.5 border-b px-3" style={{ borderColor: RAND }}>
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-2 w-2 rounded-full" style={{ background: "hsl(var(--sw-rule) / 0.16)" }} />
        ))}
      </div>
      <img
        src={puurDesktop}
        alt="De homepage van Puur in Harmonie op een computer"
        width="1200"
        height="750"
        loading="lazy"
        className="block w-full"
      />
    </div>
    <div
      className="absolute -bottom-8 right-[6%] w-[19%] overflow-hidden rounded-[18px] border-[4px] bg-white shadow-[0_18px_40px_-18px_rgba(0,0,0,0.35)]"
      style={{ borderColor: "hsl(var(--sw-ink))" }}
    >
      <img
        src={puurMobiel}
        alt="Dezelfde site op een telefoon"
        width="720"
        height="1565"
        loading="lazy"
        className="block w-full"
      />
    </div>
  </div>
);

const Label = ({ titel, tekst }: Pick<Onderdeel, "titel" | "tekst">) => (
  <>
    <h3 className="text-xl font-bold tracking-tight sw-ink md:text-2xl">{titel}</h3>
    <p className="mt-1 text-[0.9375rem] font-light leading-relaxed" style={{ color: INKT_65 }}>
      {tekst}
    </p>
  </>
);

/**
 * De vier onderdelen als aantekeningen bij één echte website: dunne lijnen lopen
 * vanaf de labels het beeld in, zoals in een rapport. Op kleinere schermen staat
 * het beeld boven en de onderdelen eronder.
 */
const AnalyseOnderdelen = () => (
  <Reveal afstand={24}>
    <div className="relative hidden lg:block lg:px-[21%]">
      <Beeld />
      {onderdelen.map(({ titel, tekst, kant, hoogte, diepte }) => {
        const links = kant === "links";
        return (
          <div
            key={titel}
            className="absolute inset-x-0"
            style={{ top: `${hoogte}%` }}
          >
            <div className={`absolute top-0 w-[19%] ${links ? "left-0" : "right-0"}`}>
              <span className="block h-px w-full" style={{ background: GROEN }} />
              <div className="pt-3">
                <Label titel={titel} tekst={tekst} />
              </div>
            </div>
            {/* De lijn loopt door tot in het beeld en eindigt in een stip. */}
            <span
              className="absolute top-0 h-px"
              style={{
                background: GROEN,
                [links ? "left" : "right"]: "19%",
                width: `calc(2% + ${(diepte * 58) / 100}%)`,
              }}
            >
              <span
                className="absolute -top-[3px] h-[7px] w-[7px] rounded-full"
                style={{ background: GROEN, [links ? "right" : "left"]: "-3px" }}
              />
            </span>
          </div>
        );
      })}
    </div>

    <div className="lg:hidden">
      <div className="pb-8">
        <Beeld />
      </div>
      <ul className="mt-6 border-t" style={{ borderColor: RAND }}>
        {onderdelen.map(({ titel, tekst }) => (
          <li key={titel} className="border-b py-5" style={{ borderColor: RAND }}>
            <Label titel={titel} tekst={tekst} />
          </li>
        ))}
      </ul>
    </div>
  </Reveal>
);

export default AnalyseOnderdelen;
