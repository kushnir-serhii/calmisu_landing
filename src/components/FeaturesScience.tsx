import { Lightbulb } from "lucide-react";

const sciencePoints = [
  { bold: "Your body cannot sustain maximum fear.", rest: " Understanding this reduces the fear of fear itself." },
  { bold: "Slow, deep breathing directly activates the vagus nerve, ", rest: "triggering a physiological calm response." },
  { bold: "Purposeful physical activity — like calligraphy — ", rest: "interrupts rumination and restores present-moment awareness." },
];

const FeaturesScience = () => {
  return (
    <section className="w-full px-6 md:px-[140px] pb-[120px]">
      <div className="flex flex-col-reverse lg:flex-row items-center gap-10 w-full">
        {/* Left: activity grid */}
        <div className="flex w-full max-w-[590px] p-[130px_131px] justify-center items-center rounded-3xl bg-brand-light overflow-hidden">
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
              Built on what actually helps
            </h2>
            <p className="text-foreground font-body text-lg font-light leading-[150%]">
              Every feature in Calmisu is grounded in established neuroscience and evidence-based self-regulation techniques.
            </p>
          </div>
          <div className="flex flex-col items-start gap-4 w-full">
            <div className="flex w-10 h-10 justify-center items-center rounded-lg bg-muted">
              <Lightbulb size={24} />
            </div>
            {sciencePoints.map((p, i) => (
              <div key={i} className="flex items-center gap-4 w-full">
                <p className="flex-1 text-foreground font-body text-lg font-light leading-[140%]">
                  <span className="font-medium">{p.bold}</span>{p.rest}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesScience;
