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
  const [offset, setOffset] = useState(40);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!footerRef.current) return;
      const rect = footerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const triggerStart = windowHeight * 0.4;
      const progress = Math.min(
        Math.max((triggerStart - rect.top) / triggerStart, 0),
        1
      );
      // Ease out cubic for gentle deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      setOffset(40 - eased * 40);
      setOpacity(eased);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer ref={footerRef} className="w-full bg-gray-50 flex flex-col items-center pt-16 gap-10 overflow-hidden">
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
      <div className="relative w-full">
        <div className="text-center font-display text-[80px] sm:text-[150px] md:text-[250px] lg:text-[335px] leading-[100%] text-gray-100 select-none">
          Calmisu
        </div>
        <img
          src="/images/footer-bamboo.webp"
          alt=""
          className="relative w-full object-contain will-change-transform"
          style={{ transform: `translateY(${offset}%)`, marginTop: "-15%" }}
          loading="lazy"
        />
      </div>
    </footer>
  );
};

export default Footer;
