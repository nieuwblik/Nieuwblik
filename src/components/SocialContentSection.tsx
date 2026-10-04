import Reveal from "@/components/Reveal";
import { LazyYouTube } from "@/utils/lazyYouTube";

/*
 * Social content (diensten- en portfoliopagina), in de stijl van de homepage:
 * kop links in --sw-ink, lichte lopende tekst, video's die met Reveal
 * binnenkomen.
 */
const SocialContentSection = () => {
  const videos = [
    { id: "Xdi3lZXIAQ0", title: "Social Content 1" },
    { id: "JlfYFuFOl1A", title: "Social Content 2" },
    { id: "padxRrPjKsA", title: "Social Content 3" },
    { id: "Hb4caf_NB1k", title: "Social Content 4" },
    { id: "0FSEJxlDNpk", title: "Social Content 5" },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-10 md:mb-14">
          <Reveal afstand={20}>
            <h2
              className="max-w-4xl text-4xl font-bold tracking-tight sw-ink md:text-5xl lg:text-6xl"
              style={{ lineHeight: 1.02 }}
            >
              Visuele content die converteert
            </h2>
          </Reveal>
          <Reveal afstand={20} delay={0.08}>
            <p
              className="mt-6 max-w-2xl text-lg font-light leading-relaxed md:text-xl"
              style={{ color: "hsl(var(--sw-ink) / 0.65)" }}
            >
              Wij nemen professionele social media content op voor jouw advertisements,
              website en funnel. Zo maak je visueel direct duidelijk aan je klanten wie je bent,
              wat je doet en waarom je de betere keuze bent dan de concurrent.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-5">
          {videos.map((video, index) => (
            <Reveal
              key={video.id}
              afstand={24}
              delay={index * 0.06}
              className="relative aspect-[9/16] overflow-hidden rounded-2xl shadow-md transition-shadow duration-300 hover:shadow-xl"
            >
              <LazyYouTube
                videoId={video.id}
                title={video.title}
                className="absolute inset-0 h-full w-full"
              />
            </Reveal>
          ))}
        </div>

        <p className="mt-8 text-sm" style={{ color: "hsl(var(--sw-ink) / 0.55)" }}>
          Bekijk onze content en zie hoe wij jouw merk tot leven brengen
        </p>
      </div>
    </section>
  );
};

export default SocialContentSection;
