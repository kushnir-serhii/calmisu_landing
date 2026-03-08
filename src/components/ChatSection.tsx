import { useEffect, useRef, useState } from "react";

const ChatSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const progress = 1 - (rect.top + rect.height) / (windowHeight + rect.height);
      setScrollProgress(Math.max(0, Math.min(1, progress)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const phoneY = (scrollProgress - 0.5) * -40;
  const cloudY = (scrollProgress - 0.5) * 30;
  const cloudX = (scrollProgress - 0.5) * -15;

  return (
    <section
      ref={sectionRef}
      className="w-full px-6 md:px-[140px] py-[120px] overflow-hidden"
    >
      <div className="relative flex justify-center items-center min-h-[400px] md:min-h-[650px]">
        {/* Phone - upper left area */}
        <img
          src="/images/chat-illustration.webp"
          alt="Calmisu AI chat"
          className="w-[80%] max-w-[996px] relative -mr-[10%] will-change-transform"
          style={{ transform: `translateY(${phoneY}px)` }}
          loading="lazy"
        />
        {/* Cloud - in front, bottom-right overlapping the phone */}
        <img
          src="/images/cloud-small.webp"
          alt=""
          className="absolute z-10 w-[55%] max-w-[791px] bottom-[0%] right-[5%] will-change-transform"
          style={{ transform: `translate(${cloudX}px, ${cloudY}px)` }}
          loading="lazy"
        />
      </div>
    </section>
  );
};

export default ChatSection;
