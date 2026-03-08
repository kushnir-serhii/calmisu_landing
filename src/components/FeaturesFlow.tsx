const features = [
  { num: "1", title: "Guided breathing", desc: "exercises activate your parasympathetic nervous system, signaling safety to your body." },
  { num: "2", title: "5-sense grounding", desc: "brings you back to the present moment, anchoring you in physical reality." },
  { num: "3", title: "Mindful kanji writing", desc: "channels focus and movement into meditative intention, quieting mental chatter." },
  { num: "4", title: "Calming meditation music", desc: "seals the practice, letting your system integrate and restore." },
];

const FeaturesFlow = () => {
  return (
    <section id="features" className="w-full px-6 md:px-[140px] py-[120px]">
      <div className="flex flex-col lg:flex-row items-center gap-10 w-full">
        {/* Left: activity grid */}
        <div className="flex w-full max-w-[590px] aspect-square justify-center items-center rounded-3xl bg-brand-light overflow-hidden">
          <div className="grid grid-cols-2 gap-2">
            {[
              { src: "/images/activity-ground.webp", alt: "Grounding" },
              { src: "/images/activity-kanji.webp", alt: "Kanji" },
              { src: "/images/activity-breathe.webp", alt: "Breathing" },
              { src: "/images/activity-sound.webp", alt: "Sound" },
            ].map((card, i) => (
              <div key={i} className="flex w-[160px] h-[160px] p-4 flex-col justify-center items-center rounded-2xl border border-brand-light bg-background overflow-hidden">
                <img src={card.src} alt={card.alt} className="w-[120px] h-[120px] object-contain" loading="lazy" />
              </div>
            ))}
          </div>
        </div>

        {/* Right: text */}
        <div className="flex flex-col items-start gap-12 flex-1">
          <div className="flex flex-col items-start gap-6 max-w-[577px]">
            <h2 className="text-foreground font-display text-4xl md:text-5xl lg:text-[60px] font-normal leading-[100%]">
              A flow that actually works
            </h2>
            <p className="text-foreground font-body text-lg font-light leading-[150%]">
              Each step in the Calming Flow is designed to build on the last, progressively regulating your nervous system.
            </p>
          </div>
          <div className="flex flex-col items-start gap-6 w-full">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-4 w-full">
                <div className="flex w-10 h-10 justify-center items-center rounded-lg bg-muted shrink-0">
                  <span className="text-foreground font-body text-xl font-normal leading-[140%]">{f.num}</span>
                </div>
                <p className="flex-1 text-foreground font-body text-lg font-light leading-[140%]">
                  <span className="font-medium">{f.title}</span> {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesFlow;
