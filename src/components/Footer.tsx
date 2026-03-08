import { useEffect, useRef, useState } from "react";

const footerLinks = [
  { label: "Features", href: "#features" },
  { label: "FAQ", href: "#faq" },
  { label: "About", href: "#about" },
  { label: "Privacy Policy", href: "#privacy" },
  { label: "Download", href: "#download" },
];

const Footer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(100);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      // Start when container enters viewport, end when mostly visible
      const progress = Math.min(
        Math.max((windowHeight - rect.top) / (windowHeight * 0.6), 0),
        1
      );
      // Start fully below (translate 100%) → rise to final position
      setOffset(100 - progress * 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer className="w-full bg-gray-50 flex flex-col items-center pt-16 gap-20 overflow-hidden">
      {/* Nav links */}
      <nav className="flex flex-wrap justify-between px-6 w-full max-w-[1121px]">
        {footerLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-foreground text-base md:text-xl font-body leading-[150%] hover:opacity-70 transition-opacity"
          >
            {link.label}
          </a>
        ))}
      </nav>

      {/* Giant brand name + bamboo */}
      <div ref={containerRef} className="relative w-full h-[300px] sm:h-[400px] md:h-[489px]">
        <div className="text-center font-display text-[80px] sm:text-[150px] md:text-[250px] lg:text-[335px] leading-[150%] text-gray-100 select-none">
          Calmisu
        </div>
        <img
          src="/images/footer-bamboo.webp"
          alt=""
          className="absolute bottom-0 left-0 w-full h-[353px] object-cover will-change-transform transition-none"
          style={{ transform: `translateY(${offset}%)` }}
          loading="lazy"
        />
      </div>
    </footer>
  );
};

export default Footer;
