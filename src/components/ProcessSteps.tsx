const steps = [
  {
    n: "01",
    title: "Kennismaking",
    description: "Een vrijblijvend gesprek over jouw doelen, doelgroep en wensen.",
    duration: "30 minuten",
  },
  {
    n: "02",
    title: "Ontwerp",
    description: "Wij ontwerpen een interactieve preview die jouw merk perfect uitstraalt.",
    duration: "Binnen 1 week",
  },
  {
    n: "03",
    title: "Bouw",
    description: "Development, content invullen en uitgebreid testen op alle apparaten.",
    duration: "1 tot 3 weken",
  },
  {
    n: "04",
    title: "Lancering",
    description: "We zetten jouw site live, geven training en bieden 30 dagen gratis nazorg.",
    duration: "Live in 4 weken",
  },
];

const ProcessSteps = () => {
  return (
    <section className="py-20 md:py-28 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <p className="text-accent text-sm font-medium tracking-[0.2em] uppercase mb-4">
            Onze aanpak
          </p>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
            Van idee naar livegang in 4 stappen
          </h2>
          <p className="text-lg text-muted-foreground font-light">
            Een helder proces waarin jij precies weet wat er gebeurt en wanneer.
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="hidden md:block absolute top-8 left-[12%] right-[12%] h-px bg-border" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6 relative">
            {steps.map((s) => (
              <div key={s.n} className="text-center md:px-2">
                <div className="relative z-10 mx-auto w-16 h-16 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-lg shadow-lg mb-5">
                  {s.n}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  {s.description}
                </p>
                <p className="text-xs text-accent font-semibold uppercase tracking-wider">
                  {s.duration}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;
