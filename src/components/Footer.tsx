import { useEffect, useRef, useState } from "react";

const footerLinks = [
  { label: "Features", href: "#features" },
  { label: "FAQ", href: "#faq" },
  { label: "About", href: "#about" },
  { label: "Privacy Policy", href: "#privacy" },
  { label: "Download", href: "#download" },
];

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const [translateY, setTranslateY] = useState(-80);

  useEffect(() => {
    const handleScroll = () => {
      if (!footerRef.current) return;
      const rect = footerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      // visibleAmount: 0 when footer top is at bottom of viewport, increases as you scroll
      const visibleAmount = windowHeight - rect.top;
      const footerHeight = rect.height;
      // progress: 0→1 as the footer scrolls into view
      const progress = Math.min(Math.max(visibleAmount / footerHeight, 0), 1);
      // Bamboo starts at -80px (overlapping Calmisu) and moves to 0 (natural position)
      setTranslateY(-80 + progress * 80);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer ref={footerRef} className="w-full bg-gray-50 flex flex-col items-center pt-16 overflow-hidden">
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

      {/* Giant brand name */}
      <div className="text-center font-display text-[80px] sm:text-[150px] md:text-[250px] lg:text-[335px] leading-[100%] text-gray-100 select-none mt-10">
        Calmisu
      </div>

      {/* Bamboo - overlaps Calmisu, slides down on scroll */}
      <img
        src="/images/footer-bamboo.webp"
        alt=""
        className="w-full object-contain will-change-transform -mt-[200px] sm:-mt-[250px] md:-mt-[350px]"
        style={{ transform: `translateY(${translateY}px)` }}
        loading="lazy"
      />
    </footer>
  );
};

export default Footer;
