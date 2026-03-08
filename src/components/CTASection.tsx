import { DownloadButtons } from "./HeroSection";

const CTASection = () => {
  return (
    <section id="download" className="w-full px-6 md:px-[140px] py-[120px]">
      <div className="flex flex-col lg:flex-row items-center w-full min-h-[589px] rounded-[30px] bg-brand-100 overflow-hidden">
        {/* Left: phone image - 50% */}
        <div className="hidden lg:flex w-1/2 h-[589px] rounded-[30px] overflow-hidden relative">
          <img
            src="/images/cta-app.webp"
            alt="Calmisu app"
            className="absolute w-[550px] h-auto object-contain"
            style={{ transform: "rotate(11deg)", left: "0px", top: "-40px" }}
            loading="lazy"
          />
        </div>

        {/* Right: CTA content - 50% */}
        <div className="flex flex-col items-center justify-center gap-10 w-full lg:w-1/2 py-20 px-6">
          <h2 className="text-foreground text-center font-display text-4xl md:text-5xl lg:text-[60px] font-normal leading-[100%]">
            Real calm. Join freely.
          </h2>
          <DownloadButtons className="!flex-col" />
        </div>
      </div>
    </section>
  );
};

export default CTASection;
