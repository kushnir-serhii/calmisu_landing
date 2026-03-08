import { useEffect, useRef, useState } from "react";

const ChatSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      // Progress from 0 (section entering viewport) to 1 (section leaving)
      const progress = 1 - (rect.top + rect.height) / (windowHeight + rect.height);
      setScrollProgress(Math.max(0, Math.min(1, progress)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Parallax offsets: phone moves up slightly, cloud moves down/left
  const phoneY = (scrollProgress - 0.5) * -40;
  const cloudY = (scrollProgress - 0.5) * 30;
  const cloudX = (scrollProgress - 0.5) * -15;

  return (
    <section
      ref={sectionRef}
      className="w-full px-6 md:px-[140px] py-[120px] overflow-hidden"
    >
      <div className="relative flex justify-center items-center min-h-[400px] md:min-h-[600px]">
        {/* Phone - positioned right of center per Figma */}
        <img
          src="/images/chat-illustration.webp"
          alt="Calmisu AI chat"
          className="w-[60%] max-w-[766px] relative z-10 will-change-transform"
          style={{ transform: `translateY(${phoneY}px)` }}
          loading="lazy"
        />
        {/* Cloud - positioned left and below per Figma */}
        <img
          src="/images/cloud-small.webp"
          alt=""
          className="absolute left-0 bottom-0 w-[55%] max-w-[791px] -translate-x-[15%] translate-y-[5%] will-change-transform"
          style={{ transform: `translate(calc(-15% + ${cloudX}px), calc(5% + ${cloudY}px))` }}
          loading="lazy"
        />
      </div>
    </section>
  );
};

export default ChatSection;
