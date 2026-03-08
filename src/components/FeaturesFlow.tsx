import { Wind, Leaf, Flower2 } from "lucide-react";

const KanjiIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 17.5C5.83333 16 9.6 12 10 8.00003H4.5M12 7.5V3M12 7.5C12.0112 7.58237 12.022 7.66659 12.0322 7.75254M12 7.5C12.0084 7.58397 12.0192 7.66816 12.0322 7.75254M12.0322 7.75254C12.3784 10.6581 12.1672 15.5361 12.0558 17.5678C12.027 18.0929 11.5924 18.5 11.0665 18.5H8.5M12.0322 7.75254C12.2152 8.93665 12.847 10.1578 13.6899 11.3264M20 17.5C18.7452 16.4734 15.648 14.0415 13.6899 11.3264M13.6899 11.3264C14.6266 11.051 17 9.7 19 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const features = [
  { icon: <Wind size={24} />, title: "Guided breathing", desc: "exercises activate your parasympathetic nervous system, signaling safety to your body." },
  { icon: <Leaf size={24} />, title: "5-sense grounding", desc: "brings you back to the present moment, anchoring you in physical reality." },
  { icon: <KanjiIcon />, title: "Mindful kanji writing", desc: "channels focus and movement into meditative intention, quieting mental chatter." },
  { icon: <Flower2 size={24} />, title: "Calming meditation music", desc: "seals the practice, letting your system integrate and restore." },
];

const FeaturesFlow = () => {
  return (
    <section id="features" className="w-full px-6 md:px-[140px] py-[120px]">
      <div className="flex flex-col lg:flex-row items-center gap-10 w-full">
        {/* Left: text */}
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
                  {f.icon}
                </div>
                <p className="flex-1 text-foreground font-body text-lg font-light leading-[140%]">
                  <span className="font-medium">{f.title}</span> {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: phone mockup */}
        <div className="flex w-full max-w-[590px] justify-center items-center rounded-3xl bg-muted overflow-hidden p-16 pt-16 pb-0 relative">
          <div className="relative w-[313px] h-[680px]">
            <img src="/images/phone-screen.webp" alt="Breathing exercise" className="absolute inset-0 w-[316px] h-[684px] -left-[2px] -top-[3px] rounded-[34px] object-cover" loading="lazy" />
            <img src="/images/iphone-bezel.webp" alt="" className="absolute -left-[19px] -top-[18px] w-[350px] h-[715px]" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesFlow;
