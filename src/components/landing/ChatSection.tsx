import { useEffect, useRef } from "react";

const ChatSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const phoneRef = useRef<HTMLImageElement>(null);
  const cloudRef = useRef<HTMLImageElement>(null);

  // Parallax writes transforms straight to the DOM: no React re-render per scroll event.
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const apply = () => {
      frame = 0;
      const section = sectionRef.current;
      if (!section || !phoneRef.current || !cloudRef.current) return;
      // Reduced motion: hold the layers at their resting (mid-scroll) position.
      let progress = 0.5;
      if (!query.matches) {
        const rect = section.getBoundingClientRect();
        progress = 1 - (rect.top + rect.height) / (window.innerHeight + rect.height);
        progress = Math.max(0, Math.min(1, progress));
      }
      const offset = progress - 0.5;
      phoneRef.current.style.transform = `translateY(${offset * -30}px)`;
      cloudRef.current.style.transform = `translate(${offset * -10}px, ${offset * 20}px)`;
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    query.addEventListener("change", schedule);
    apply();
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      query.removeEventListener("change", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full px-6 sm:px-8 md:px-[140px] py-16 sm:py-20 md:py-[120px] overflow-hidden"
    >
      <div className="relative flex justify-center items-center min-h-[280px] sm:min-h-[400px] md:min-h-[650px]">
        {/* Phone - upper left area */}
        <img
          ref={phoneRef}
          src="/images/chat-illustration.webp"
          alt="A Calmisu chat conversation: the AI companion asks how you're feeling, and you can reply by typing or by voice"
          width={1149}
          height={1134}
          className="w-[90%] sm:w-[80%] max-w-[996px] relative -mr-[5%] sm:-mr-[10%] will-change-transform"
          loading="lazy"
        />
        {/* Cloud - in front, bottom-right overlapping the phone */}
        <img
          ref={cloudRef}
          src="/images/cloud-small.webp"
          alt=""
          width={1187}
          height={747}
          className="absolute z-10 w-[80%] sm:w-[75%] max-w-[791px] bottom-[0%] right-[0%] sm:right-[5%] will-change-transform"
          loading="lazy"
        />
      </div>
    </section>
  );
};

export default ChatSection;
