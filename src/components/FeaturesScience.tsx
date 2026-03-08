import { Lightbulb, Wind } from "lucide-react";

const KanjiIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 17.5C5.83333 16 9.6 12 10 8.00003H4.5M12 7.5V3M12 7.5C12.0112 7.58237 12.022 7.66659 12.0322 7.75254M12 7.5C12.0084 7.58397 12.0192 7.66816 12.0322 7.75254M12.0322 7.75254C12.3784 10.6581 12.1672 15.5361 12.0558 17.5678C12.027 18.0929 11.5924 18.5 11.0665 18.5H8.5M12.0322 7.75254C12.2152 8.93665 12.847 10.1578 13.6899 11.3264M20 17.5C18.7452 16.4734 15.648 14.0415 13.6899 11.3264M13.6899 11.3264C14.6266 11.051 17 9.7 19 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const sciencePoints = [
  { icon: <Lightbulb size={24} />, bold: "Your body cannot sustain maximum fear.", rest: " Understanding this reduces the fear of fear itself." },
  { icon: <Wind size={24} />, bold: "Slow, deep breathing directly activates the vagus nerve, ", rest: "triggering a physiological calm response." },
  { icon: <KanjiIcon />, bold: "Purposeful physical activity — like calligraphy — ", rest: "interrupts rumination and restores present-moment awareness." },
];

const FeaturesScience = () => {
  return (
    <section className="w-full px-6 md:px-[140px] pb-[120px]">
      <div className="flex flex-col lg:flex-row items-center gap-10 w-full">
        {/* Left: phone mockup */}
        <div className="flex w-full lg:w-1/2 justify-center items-end rounded-3xl overflow-hidden shrink-0">
          <img src="/images/phone-breathe.webp" alt="Breathing exercise" className="w-full object-contain" loading="lazy" />
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
          <div className="flex flex-col items-start gap-6 w-full">
            {sciencePoints.map((p, i) => (
              <div key={i} className="flex items-center gap-4 w-full">
                <div className="flex w-10 h-10 justify-center items-center rounded-lg bg-muted shrink-0">
                  {p.icon}
                </div>
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
