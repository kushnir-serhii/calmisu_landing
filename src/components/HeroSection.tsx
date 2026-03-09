import { useEffect, useRef } from "react";

const AppleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.7099 19.5C17.8799 20.74 16.9999 21.95 15.6599 21.97C14.3199 22 13.8899 21.18 12.3699 21.18C10.8399 21.18 10.3699 21.95 9.09985 22C7.78985 22.05 6.79985 20.68 5.95985 19.47C4.24985 17 2.93985 12.45 4.69985 9.39C5.56985 7.87 7.12985 6.91 8.81985 6.88C10.0999 6.86 11.3199 7.75 12.1099 7.75C12.8899 7.75 14.3699 6.68 15.9199 6.84C16.5699 6.87 18.3899 7.1 19.5599 8.82C19.4699 8.88 17.3899 10.1 17.4099 12.63C17.4399 15.65 20.0599 16.66 20.0899 16.67C20.0599 16.74 19.6699 18.11 18.7099 19.5ZM12.9999 3.5C13.7299 2.67 14.9399 2.04 15.9399 2C16.0699 3.17 15.5999 4.35 14.8999 5.19C14.2099 6.04 13.0699 6.7 11.9499 6.61C11.7999 5.46 12.3599 4.26 12.9999 3.5Z" fill="currentColor"/>
  </svg>
);

const PlayStoreIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.9657 10.7041L5.23599 1.70037C5.00625 1.56712 4.74523 1.4973 4.47965 1.49805C4.21406 1.49881 3.95344 1.57011 3.72446 1.70467C3.49834 1.83337 3.31048 2.01984 3.1801 2.245C3.04972 2.47015 2.9815 2.72591 2.98243 2.98609V21.013C2.9815 21.2732 3.04972 21.5289 3.1801 21.7541C3.31048 21.9792 3.49834 22.1657 3.72446 22.2944C3.95344 22.429 4.21406 22.5003 4.47965 22.501C4.74524 22.5018 5.00626 22.432 5.236 22.2987L20.9657 13.295C21.1978 13.1676 21.3915 12.9801 21.5264 12.7522C21.6613 12.5243 21.7324 12.2644 21.7324 11.9995C21.7324 11.7347 21.6613 11.4748 21.5264 11.2469C21.3915 11.019 21.1978 10.8315 20.9657 10.7041ZM13.4999 13.0602L15.2677 14.828L6.99985 19.5602L13.4999 13.0602ZM6.9988 4.43774L15.2678 9.17102L13.4999 10.9389L6.9988 4.43774ZM16.6168 14.0558L14.5605 11.9995L16.6169 9.94322L20.2094 11.9995L16.6168 14.0558Z" fill="currentColor"/>
  </svg>
);

const DownloadButtons = ({ className = "" }: { className?: string }) => (
  <div className={`flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto ${className}`}>
    <button className="flex w-full sm:w-[260px] h-[54px] px-6 justify-center items-center gap-2 rounded-xl bg-foreground text-background font-body text-base sm:text-lg font-normal leading-[150%] hover:opacity-90 transition-opacity touch-manipulation">
      Download for IOS
      <AppleIcon />
    </button>
    <button className="flex w-full sm:w-[261px] h-[54px] px-6 justify-center items-center gap-2 rounded-xl bg-foreground text-background font-body text-base sm:text-lg font-normal leading-[150%] hover:opacity-90 transition-opacity touch-manipulation">
      Download for Android
      <PlayStoreIcon />
    </button>
  </div>
);

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const phoneRef = useRef<HTMLImageElement>(null);
  const cloudRef = useRef<HTMLImageElement>(null);

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
    <section ref={sectionRef} className="flex flex-col items-center pt-6 sm:pt-8 md:pt-16 px-5 sm:px-8 md:px-[140px] gap-8 md:gap-10 overflow-hidden">
      {/* Content */}
      <div className="flex flex-col items-center gap-4 md:gap-5 w-full max-w-[1160px]">
        <div className="flex flex-col items-center gap-2 w-full">
          {/* Pill */}
          <div className="flex py-2 sm:py-3 px-3 sm:px-4 justify-center items-center gap-1 rounded-full bg-brand-100">
            <div className="flex p-1 items-center rounded-full bg-brand-200 animate-[pulse_3s_ease-in-out_infinite]">
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><circle cx="4" cy="4" r="4" fill="hsl(var(--brand-blue))"/></svg>
            </div>
            <span className="text-brand font-body text-base sm:text-lg font-normal leading-[150%]">mental wellness app</span>
          </div>
          {/* Heading */}
          <h1 className="text-foreground text-center font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[80px] font-normal leading-[90%]">
            Calm the storm.<br />Find your center.
          </h1>
        </div>
        <p className="max-w-[737px] text-foreground text-center font-body text-base sm:text-lg font-light leading-[150%] px-2">
          Calmisu guides you through anxiety with a structured calming flow — breathing, grounding, calligraphy, and meditation — each step deepening the last.
        </p>
      </div>

      <DownloadButtons />

      {/* Hero images */}
      <div className="relative w-screen aspect-[1440/855] mt-0">
        <img src="/images/hero-sky.webp" alt="" className="absolute w-[100.5%] left-[-0.3%] bottom-0 object-cover" loading="lazy" />
        <img
          ref={phoneRef}
          src="/images/hero-app.webp"
          alt="Calmisu app preview"
          className="absolute w-full left-0 bottom-[5%] object-contain will-change-transform transition-transform duration-100 ease-out"
          loading="lazy"
        />
        <img
          ref={cloudRef}
          src="/images/hero-cloud.webp"
          alt=""
          className="absolute w-full left-0 bottom-[15%] object-contain will-change-transform transition-transform duration-100 ease-out z-10"
          loading="lazy"
        />
      </div>
    </section>
  );
};

export { DownloadButtons };
export default HeroSection;
