import { Play } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const SocialContentSection = () => {
  const sectionAnimation = useScrollAnimation();
  const videosAnimation = useScrollAnimation();
  
  const videos = [
    { id: "Xdi3lZXIAQ0", title: "Social Content 1" },
    { id: "JlfYFuFOl1A", title: "Social Content 2" },
    { id: "padxRrPjKsA", title: "Social Content 3" },
    { id: "Hb4caf_NB1k", title: "Social Content 4" },
    { id: "0FSEJxlDNpk", title: "Social Content 5" },
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto">
        <div 
          ref={sectionAnimation.ref}
          className={`text-center mb-16 transition-all duration-1000 ${
            sectionAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Play size={20} />
            <span className="font-semibold">Social Content</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Visuele content die converteert
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Wij nemen professionele social media content op voor jouw advertisements, 
            website en funnel. Zo maak je visueel direct duidelijk aan je klanten wie je bent, 
            wat je doet en waarom je de betere keuze bent dan de concurrent.
          </p>
        </div>

        <div 
          ref={videosAnimation.ref}
          className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 transition-all duration-1000 delay-200 ${
            videosAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {videos.map((video, index) => (
            <div
              key={video.id}
              className="group relative aspect-[9/16] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${video.id}`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Bekijk onze content en zie hoe wij jouw merk tot leven brengen
          </p>
        </div>
      </div>
    </section>
  );
};

export default SocialContentSection;
