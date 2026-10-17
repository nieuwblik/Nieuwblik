import { useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Reveal from "@/components/Reveal";
import { useReducedMotion } from "@/lib/reduced-motion";
import zoeklicht from "@/assets/vindbaar/foto-zoeklicht.webp";
import zoeklichtSet from "@/assets/vindbaar/foto-zoeklicht.webp?w=400;700;1000&format=webp&as=srcset";
import website from "@/assets/vindbaar/foto-website.webp";
import websiteSet from "@/assets/vindbaar/foto-website.webp?w=400;700;1000&format=webp&as=srcset";
import boog from "@/assets/vindbaar/foto-boog.webp";
import boogSet from "@/assets/vindbaar/foto-boog.webp?w=400;700;1000&format=webp&as=srcset";
import straal from "@/assets/vindbaar/foto-straal.webp";
import straalSet from "@/assets/vindbaar/foto-straal.webp?w=400;700;1000&format=webp&as=srcset";
import pil from "@/assets/vindbaar/justin-job-pil.webp";
import pilSet from "@/assets/vindbaar/justin-job-pil.webp?w=400;820&format=webp&as=srcset";

if (typeof window !== "undefined") gsap.registerPlugin(useGSAP, ScrollTrigger);

/*
 * Vindbaarheid: één groot moment in plaats van een blok uitleg.
 *
 * De kop "Overal vindbaar, / van Google tot AI." staat sticky midden in beeld.
 * Achter de kop zweven vier beelden buiten het raster, elk op een eigen
 * snelheid (parallax); twee draaien en groeien ook een beetje mee. Op de boog
 * liggen tegels met de logo's van ChatGPT, Claude en Gemini, die na elkaar
 * oppoppen zodra de boog helemaal in beeld is.
 *
 * Zodra de kop in beeld komt, propt een foto van Justin en Job zich tussen
 * "Overal" en "vindbaar": eerst als rondje, dan duwt hij zich in de breedte en
 * veert even na. Na het moment volgt één alinea met de uitleg (gewoon in de
 * HTML, voor Google).
 *
 * Met prefers-reduced-motion: alles staat meteen op zijn plek, niets beweegt.
 */

// Beelden: plek en breedte op desktop (x, y, b) en mobiel (mx, my, mb), snelheid
// van de parallax en eventueel draaien/groeien tijdens het scrollen.
type Foto = {
  src: string;
  srcSet: string;
  breed: number;
  hoog: number;
  snelheid: number;
  draai?: [number, number];
  schaal?: [number, number];
  stijl: Record<string, string>;
};

const FOTOS: Foto[] = [
  {
    src: zoeklicht, srcSet: zoeklichtSet, breed: 1000, hoog: 1339, snelheid: 1.25,
    draai: [-7, 5], schaal: [0.9, 1.06],
    stijl: { "--x": "6%", "--y": "18%", "--b": "clamp(150px, 17vw, 300px)", "--mx": "-7%", "--my": "13%", "--mb": "33vw" },
  },
  {
    src: website, srcSet: websiteSet, breed: 1000, hoog: 1250, snelheid: 1,
    stijl: { "--x": "74%", "--y": "6%", "--b": "clamp(130px, 14vw, 250px)", "--mx": "75%", "--my": "26%", "--mb": "30vw" },
  },
  {
    src: boog, srcSet: boogSet, breed: 1000, hoog: 1339, snelheid: 0.75,
    stijl: { "--x": "28%", "--y": "70%", "--b": "clamp(150px, 16vw, 290px)", "--mx": "8%", "--my": "63%", "--mb": "31vw" },
  },
  {
    src: straal, srcSet: straalSet, breed: 1000, hoog: 1506, snelheid: 0.55,
    draai: [8, -6], schaal: [0.88, 1.08],
    stijl: { "--x": "83%", "--y": "60%", "--b": "clamp(100px, 10vw, 180px)", "--mx": "79%", "--my": "69%", "--mb": "24vw" },
  },
];
const FOTO_SIZES = "(max-width: 760px) 33vw, 300px";
// De boog krijgt de logotegels.
const BOOG = 2;

// Logo's uit Simple Icons (CC0), in de huisstijlkleuren van elk merk. Positie en
// grootte in procenten van de boog; diepte = hoe sterk de tegel met de scroll meeschuift.
const TEGELS = [
  {
    naam: "ChatGPT", vulling: "hsl(156 48% 12%)", diepte: 1,
    stijl: { "--tx": "-11%", "--ty": "10%", "--tb": "27%", "--tk": "rgb(237 230 216)" },
    pad: "M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z",
  },
  {
    naam: "Claude", vulling: "#D97757", diepte: 0.45,
    stijl: { "--tx": "45%", "--ty": "29%", "--tb": "20%", "--tk": "hsl(156 48% 14%)" },
    pad: "m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z",
  },
  {
    naam: "Gemini", vulling: "url(#vb-gemini)", diepte: 0.75,
    stijl: { "--tx": "87%", "--ty": "74%", "--tb": "22%", "--tk": "hsl(92 48% 80%)" },
    pad: "M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81",
  },
];

// Eindmaat van de foto in de kop (verhouding 2,3:1, de marge rechts is de spatie).
const PIL = { width: "1.84em", marginRight: "0.24em" };

const VindbaarSectie = () => {
  const reduced = useReducedMotion();
  const sectieRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const sectie = sectieRef.current;
      if (!sectie) return;
      const vb = sectie.querySelector<HTMLElement>(".vb");
      const kop = sectie.querySelector<HTMLElement>(".vb-kop");
      const pilEl = sectie.querySelector<HTMLElement>(".vb-pil");
      const tegels = gsap.utils.toArray<HTMLElement>(".vb-tegel .vb-vlak", sectie);
      if (!vb || !kop) return;

      if (reduced) {
        if (pilEl) gsap.set(pilEl, PIL);
        return;
      }

      // Op telefoons en tablets loopt het scrollen buiten JavaScript om, waardoor
      // beelden die direct aan de scroll hangen een frame achterlopen en haperen.
      // Daar volgen ze de scroll met een korte demping (vloeiend in plaats van
      // schokkerig) en vallen het draaien/groeien en het meeschuiven van de
      // logotegels weg: minder werk per frame.
      const touch = window.matchMedia("(pointer: coarse), (max-width: 760px)").matches;
      const bereik = { trigger: vb, start: "top bottom", end: "bottom top" };
      // Beelden: vanaf net voordat de kop vaststaat (bovenkant sectie op 60% van
      // het venster) tot de sectie uit beeld is.
      const vast = { trigger: vb, start: "top 60%", end: "bottom top" };

      // Beelden komen binnen rond het moment dat de kop vaststaat: daarvoor staan ze
      // net onder het (afgesneden) podium. Daarna zweven ze op eigen snelheid omhoog
      // door het beeld en achter de kop langs; sneller = dichterbij.
      gsap.utils.toArray<HTMLElement>(".vb-foto", sectie).forEach((f, i) => {
        const foto = FOTOS[i];
        if (!foto) return;
        const v = foto.snelheid;
        gsap.fromTo(
          f,
          { y: () => innerHeight * 1.05 },
          { y: () => -innerHeight * (0.35 + 0.6 * v), ease: "none", scrollTrigger: { ...vast, scrub: touch ? 0.4 : true, invalidateOnRefresh: true } },
        );
        if (foto.draai && !touch) {
          const [s0, s1] = foto.schaal ?? [1, 1];
          gsap.fromTo(
            f,
            { rotation: foto.draai[0], scale: s0 },
            { rotation: foto.draai[1], scale: s1, ease: "none", scrollTrigger: { ...vast, scrub: 0.8 } },
          );
        }
      });

      // De tegels schuiven iets sneller of trager mee dan de boog (diepte). De
      // buitenlaag beweegt, de binnenlaag (.vb-vlak) poppt op: een refresh van
      // ScrollTrigger zet de transform van de buitenlaag terug.
      if (!touch) gsap.utils.toArray<HTMLElement>(".vb-tegel", sectie).forEach((t, i) => {
        const d = TEGELS[i]?.diepte ?? 1;
        gsap.fromTo(
          t,
          { y: () => innerHeight * 0.06 * d },
          { y: () => -innerHeight * 0.06 * d, ease: "none", scrollTrigger: { ...bereik, scrub: 0.6, invalidateOnRefresh: true } },
        );
      });

      // Logotegels poppen na elkaar op zodra de boog helemaal in beeld is. De boog
      // zweeft binnen het vaste podium, dus we kijken naar zijn echte plek.
      const boogEl = tegels[0]?.closest<HTMLElement>(".vb-foto");
      let wacht: ScrollTrigger | null = null;
      if (boogEl) {
        gsap.set(tegels, { scale: 0, rotation: (i: number) => (i % 2 ? 14 : -14) });
        const pop = gsap.timeline({ paused: true, delay: 0.1 });
        tegels.forEach((t, i) =>
          pop.to(t, { scale: 1, rotation: 0, duration: 0.55, ease: "back.out(2.2)" }, i * 0.22),
        );
        let klaar = false;
        const check = () => {
          if (klaar) return;
          if (boogEl.getBoundingClientRect().bottom < innerHeight - 24) {
            klaar = true;
            pop.play();
            wacht?.kill();
          }
        };
        wacht = ScrollTrigger.create({ ...bereik, onUpdate: check, onEnter: check });
        check();
      }

      // Zodra de kop vaststaat, propt de foto zich tussen "Overal" en "vindbaar":
      // eerst als rondje (de woorden wijken al), dan duwt hij zich in de breedte
      // en veert even na.
      if (pilEl) {
        const tl = gsap.timeline({ paused: true });
        tl.fromTo(
          pilEl,
          { width: 0, marginRight: 0, scale: 0.3 },
          { width: "0.8em", marginRight: "0.12em", scale: 1, duration: 0.18, ease: "power2.out" },
          0.15,
        )
          .to(pilEl, { ...PIL, duration: 0.7, ease: "elastic.out(1, 0.75)" }, 0.27)
          .fromTo(pilEl.querySelector("img"), { scale: 1.5 }, { scale: 1, duration: 0.8, ease: "power3.out" }, 0.15);
        ScrollTrigger.create({ trigger: vb, start: "top top", once: true, onEnter: () => tl.play() });
      }

      // De secties erboven laden lazy: als de pagina daarna langer wordt, moeten
      // de scrollposities opnieuw worden gemeten.
      let wachtRefresh = 0;
      const ro = new ResizeObserver(() => {
        window.clearTimeout(wachtRefresh);
        wachtRefresh = window.setTimeout(() => ScrollTrigger.refresh(), 200);
      });
      ro.observe(document.body);
      return () => {
        ro.disconnect();
        window.clearTimeout(wachtRefresh);
      };
    },
    { scope: sectieRef, dependencies: [reduced] },
  );

  return (
    <section ref={sectieRef} className="vb-sectie sw-paper" aria-labelledby="vb-kop">
      <div className="vb">
        <div className="vb-buhne">
          <div className="vb-fotos" aria-hidden="true">
            {FOTOS.map((f, i) => (
              <figure key={f.src} className="vb-foto" style={f.stijl as CSSProperties}>
                <img
                  src={f.src}
                  srcSet={f.srcSet}
                  sizes={FOTO_SIZES}
                  width={f.breed}
                  height={f.hoog}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
                {i === BOOG && (
                  <>
                    <svg width="0" height="0" className="absolute">
                      <defs>
                        <linearGradient id="vb-gemini" x1="0" y1="1" x2="1" y2="0">
                          <stop offset="0" stopColor="#1f6feb" />
                          <stop offset=".55" stopColor="#6b6be6" />
                          <stop offset="1" stopColor="#b16ad8" />
                        </linearGradient>
                      </defs>
                    </svg>
                    {TEGELS.map((t) => (
                      <span key={t.naam} className="vb-tegel" style={t.stijl as CSSProperties}>
                        <span className="vb-vlak">
                          <svg viewBox="0 0 24 24">
                            <path fill={t.vulling} d={t.pad} />
                          </svg>
                        </span>
                      </span>
                    ))}
                  </>
                )}
              </figure>
            ))}
          </div>

          <div className="vb-podium container mx-auto px-4 sm:px-6">
            <h2 className="vb-kop" id="vb-kop">
              <span className="vb-regel">
                Overal{" "}
                <span className="vb-pil" aria-hidden="true">
                  <img
                    src={pil}
                    srcSet={pilSet}
                    sizes="(max-width: 760px) 70px, 200px"
                    width={820}
                    height={356}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                </span>
                vindbaar,
              </span>{" "}
              <span className="vb-regel">van Google tot AI.</span>
            </h2>
          </div>
        </div>
      </div>

      {/* Na het moment van de kop: de uitleg, gewoon in de HTML (SEO). */}
      <div className="vb-tekst container mx-auto px-4 sm:px-6">
        <Reveal afstand={30}>
          <p>
            Klanten zoeken niet meer alleen via Google. Ze vragen ChatGPT, Claude of
            Gemini om advies. Van klassieke SEO tot GEO voor AI-zoekmachines: we
            bouwen je website zo dat elk platform hem begrijpt, indexeert en
            aanbeveelt.
          </p>
        </Reveal>
      </div>
    </section>
  );
};

export default VindbaarSectie;
