import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { easings } from "@/lib/motion";

const faqs = [
  {
    question: "Wat kost het om een website te laten maken?",
    answer: "De kosten voor een website zijn afhankelijk van verschillende factoren zoals functionaliteit, design complexiteit en het aantal pagina's. Een eenvoudige website begint vanaf €1.500, terwijl een uitgebreide webshop of maatwerk platform vanaf €5.000 kan starten. Tijdens een vrijblijvende call bespreken we jouw wensen en maken we een passende offerte."
  },
  {
    question: "Hoe lang duurt het voordat mijn website live staat?",
    answer: "Voor de meeste projecten geldt een doorlooptijd van 2-6 weken, afhankelijk van de omvang en complexiteit. Eenvoudige websites kunnen binnen 1-2 weken gerealiseerd worden. We werken graag met vaste deadlines en houden je tijdens het proces op de hoogte van de voortgang."
  },
  {
    question: "Kan ik zelf aanpassingen doen aan mijn website?",
    answer: "Ja! We bouwen websites met gebruiksvriendelijke content management systemen (CMS) waarmee je eenvoudig zelf teksten, afbeeldingen en andere content kunt aanpassen. We geven uitleg en instructies hoe je dit doet. Voor complexere wijzigingen staan we natuurlijk altijd klaar om te helpen."
  },
  {
    question: "Bieden jullie ook onderhoud en support na oplevering?",
    answer: "Absoluut! We bieden verschillende onderhoudspakketten aan, van basis support tot volledig beheer inclusief updates, backups en security monitoring. Ook kun je altijd bij ons terecht voor eenmalige aanpassingen of uitbreidingen van je website."
  },
  {
    question: "Wordt mijn website ook goed gevonden in Google?",
    answer: "Ja, alle websites die wij bouwen zijn standaard SEO-geoptimaliseerd. Dit betekent snelle laadtijden, mobiel responsive design, schone code en juiste meta tags. Voor bedrijven die hoog willen scoren in Google bieden we ook uitgebreide SEO diensten aan zoals keyword research, content optimalisatie en linkbuilding."
  },
  {
    question: "Wat is er nodig om te starten met mijn project?",
    answer: "Om te starten hebben we allereerst een goed gesprek nodig om jouw wensen en doelen te begrijpen. Daarna maken we een offerte en projectplan. Bij akkoord vragen we om content (teksten, afbeeldingen, logo's) en eventueel een aanbetaling. Vervolgens kunnen we direct aan de slag!"
  },
  {
    question: "Leveren jullie ook logo's en huisstijl?",
    answer: "Ja, we bieden complete branding diensten aan. Van logo ontwerp tot complete merkidentiteit inclusief kleurenpalet, typografie, visitekaartjes en andere marketing materialen. Een sterke visuele identiteit is de basis voor online en offline succes."
  },
  {
    question: "Zijn de websites ook geschikt voor mobiele telefoons?",
    answer: "Absoluut! Alle websites die wij maken zijn volledig responsive. Dit betekent dat ze perfect werken en er prachtig uitzien op alle apparaten: desktop, tablet én smartphone. Meer dan 60% van het internetverkeer komt tegenwoordig van mobiele apparaten, dus dit is essentieel."
  }
];

const FAQCard = ({ item, isOpen, onClick, index }: { item: typeof faqs[0], isOpen: boolean, onClick: () => void, index: number }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: easings.easeOutExpo }}
      className="mb-4 last:mb-0"
    >
      <motion.div
        onClick={onClick}
        className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 border ${isOpen
          ? "border-transparent shadow-2xl"
          : "bg-white border-border/50 hover:border-accent/30 hover:shadow-lg"
          }`}
        style={{
          background: isOpen
            ? 'linear-gradient(135deg, hsl(160 84% 14%) 0%, hsl(160 84% 10%) 50%, hsl(160 70% 8%) 100%)'
            : 'rgb(255, 255, 255)'
        }}
        layout
      >
        {/* Dark Background Texture/Sparkles for Open State */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 pointer-events-none"
            >
              {/* Radial gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-black/20 opacity-100" />

              {/* Sparkles */}
              <div className="absolute top-8 right-12 w-1 h-1 bg-white/30 rounded-full animate-pulse" />
              <div className="absolute top-16 right-24 w-1.5 h-1.5 bg-white/20 rounded-full animate-pulse delay-75" />
              <div className="absolute bottom-12 left-8 w-1 h-1 bg-white/20 rounded-full animate-pulse delay-150" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative z-10 p-6 md:p-8">
          <div className="flex justify-between items-start gap-4">
            <motion.h3
              className={`text-lg md:text-xl font-bold leading-tight transition-colors duration-300 ${isOpen ? "text-white" : "text-foreground"
                }`}
            >
              {item.question}
            </motion.h3>

            {/* Toggle Icon */}
            <motion.div
              className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-full border transition-colors duration-300 ${isOpen
                ? "bg-white/10 border-white/20 text-white"
                : "bg-secondary border-transparent text-foreground group-hover:bg-accent group-hover:text-white"
                }`}
              animate={{ rotate: isOpen ? 180 : 0 }}
            >
              {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </motion.div>
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                transition={{ duration: 0.4, ease: easings.easeOutExpo }}
                className="overflow-hidden"
              >
                <p className="text-white/80 font-light leading-relaxed pr-8">
                  {item.answer}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Default open first one
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" });

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-24 bg-secondary/50 relative overflow-hidden"
    >
      {/* Container restricted to max-w-6xl for compactness */}
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">

          {/* Left Column - Sticky Header */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.7, ease: easings.easeOutExpo }}
              className="text-center lg:text-left"
            >
              {/* Updated Badge Style - Matches rest of site */}
              <div className="mb-6">
                <p className="text-accent text-sm font-medium tracking-[0.2em] uppercase">
                  VEELGESTELDE VRAGEN
                </p>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight text-foreground mb-6 leading-[1.1]">
                Nog vragen? <br />
                <span className="text-accent">Wij hebben antwoorden.</span>
              </h2>

              <p className="text-lg text-muted-foreground font-light leading-relaxed mb-8 max-w-md mx-auto lg:mx-0">
                Duidelijke, eerlijke antwoorden zodat je precies weet waar je aan toe bent. Geen verrassingen, alleen resultaat.
              </p>
            </motion.div>
          </div>

          {/* Right Column - FAQ Cards */}
          <div className="lg:col-span-7">
            {faqs.map((faq, index) => (
              <FAQCard
                key={index}
                index={index}
                item={faq}
                isOpen={openIndex === index}
                onClick={() => handleToggle(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
