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
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    if (!footerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsFooterVisible(true);
        }
      },
      {
        threshold: 0.25,
      }
    );

    observer.observe(footerRef.current);

    return () => {
      observer.disconnect();
    };
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
        className="w-full object-contain will-change-transform -mt-[200px] sm:-mt-[250px] md:-mt-[350px] transition-transform duration-700 ease-out motion-reduce:transition-none"
        style={{ transform: `translateY(${isFooterVisible ? 20 : -40}px)` }}
        loading="lazy"
      />
    </footer>
  );
};

export default Footer;
