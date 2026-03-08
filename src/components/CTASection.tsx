import { DownloadButtons } from "./HeroSection";

const CTASection = () => {
  return (
    <section id="download" className="w-full px-6 md:px-[140px] py-[120px]">
      <div className="flex items-center w-full min-h-[589px] rounded-3xl bg-brand-100 overflow-hidden relative">
        {/* Left: tilted app image */}
        <div className="hidden lg:block absolute left-0 top-0 w-1/2 h-full overflow-hidden rounded-3xl">
          <img src="/images/cta-app.webp" alt="Calmisu app" className="absolute left-[-25%] top-[-35%] w-[110%] rotate-[11deg] object-contain" loading="lazy" />
        </div>

        {/* Right: CTA content */}
        <div className="flex flex-col items-center gap-10 flex-1 py-20 px-6 lg:ml-[50%]">
          <h2 className="text-foreground text-center font-display text-4xl md:text-5xl lg:text-[60px] font-normal leading-[100%]">
            Real calm. Join freely.
          </h2>
          <DownloadButtons className="flex-col" />
        </div>
      </div>
    </section>
  );
};

export default CTASection;
