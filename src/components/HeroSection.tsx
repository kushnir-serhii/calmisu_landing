import { useEffect, useRef, useState } from "react";
import { NotifyMe } from "./popups/NotifyMe";
import { DownloadButtons } from "./ui/DownloadButtons";

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const phoneRef = useRef<HTMLImageElement>(null);
  const cloudRef = useRef<HTMLImageElement>(null);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollProgress = -rect.top;

      if (phoneRef.current) {
        phoneRef.current.style.transform = `translateY(${scrollProgress * -0.08}px)`;
      }
      if (cloudRef.current) {
        cloudRef.current.style.transform = `translateY(${Math.max(0, scrollProgress * 0.25)}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="flex flex-col items-center pt-6 sm:pt-8 md:pt-16 px-6 sm:px-8 md:px-[140px] gap-8 md:gap-10 overflow-hidden"
    >
      {/* Content */}
      <div className="flex flex-col items-center gap-4 md:gap-5 w-full max-w-[1160px]">
        <div className="flex flex-col items-center gap-2 w-full">
          {/* Pill */}
          <div className="flex py-2 sm:py-3 px-3 sm:px-4 justify-center items-center gap-1 rounded-full bg-brand-100">
            <div className="flex p-1 items-center rounded-full bg-brand-200 animate-[pulse_3s_ease-in-out_infinite]">
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <circle cx="4" cy="4" r="4" fill="hsl(var(--brand-blue))" />
              </svg>
            </div>
            <span className="text-brand font-body text-base sm:text-lg font-normal leading-[150%]">
              early access
            </span>
          </div>
          {/* Heading */}
          <h1 className="text-foreground text-center font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[80px] font-normal leading-[90%] my-[4px]">
            Calm the storm.
            <br />
            Find your center.
          </h1>
        </div>
        <p className="max-w-[737px] text-foreground text-center font-body text-base sm:text-lg font-light leading-[150%] px-[24px]">
          Calmisu guides you through anxiety with a structured calming flow —
          breathing, grounding, calligraphy, and meditation — each step
          deepening the last.
        </p>
      </div>

      <div className="flex flex-col items-center gap-3">
        <DownloadButtons
          location="hero"
          onIosClick={() => setIsNotifyOpen(true)}
          className="px-6 sm:px-0"
        />
        <p className="text-muted-foreground text-center font-body text-sm font-light leading-[140%]">
          Free · No ads · No account needed
        </p>
      </div>
      <NotifyMe isOpen={isNotifyOpen} onClose={() => setIsNotifyOpen(false)} />
      {/* Hero images */}
      {/* The container already reserves space via aspect-[1440/855], so
          width/height here are the true intrinsic sizes, not layout hints. */}
      <div className="relative w-screen aspect-[1440/855] mt-0">
        <img
          src="/images/hero-sky.webp"
          alt=""
          width={1440}
          height={736}
          className="absolute w-[100.5%] left-[-0.3%] bottom-0 object-cover"
          loading="lazy"
        />
        <img
          ref={phoneRef}
          src="/images/hero-app.webp"
          alt="Calmisu anxiety app showing the guided breathing screen"
          width={1440}
          height={858}
          className="absolute w-full left-0 bottom-[5%] object-contain will-change-transform transition-transform duration-100 ease-out"
          loading="eager"
          // React 18 does not map the camelCase prop; the lowercase HTML
          // attribute is what the preload scanner actually reads.
          {...{ fetchpriority: "high" }}
        />

        <img
          ref={cloudRef}
          src="/images/cloud-small.webp"
          alt=""
          className="absolute w-2/3 bottom-0 lg:bottom-[10%] object-contain will-change-transform left-0 right-0 mx-auto transition-transform duration-100 ease-out z-10"
          loading="lazy"
        />
      </div>
    </section>
  );
};

export default HeroSection;
