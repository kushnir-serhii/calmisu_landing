import CalmisuLogo from "@/assets/calmisu.svg";

const footerLinks = [
  { label: "Features", href: "#features" },
  { label: "FAQ", href: "#faq" },
  { label: "About", href: "#about" },
  { label: "Privacy Policy", href: "#privacy" },
  { label: "Download", href: "#download" },
];

const Footer = () => {
  return (
    <footer className="w-full bg-gray-50 flex flex-col items-center pt-16 gap-10 overflow-hidden relative">
      {/* Nav links */}
      <nav className="flex flex-wrap justify-between px-6 md:px-[140px] w-full max-w-[1440px]">
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

      {/* Calmisu logo and bamboo stacked */}
      <div className="relative w-full flex flex-col items-center">
        {/* Calmisu SVG */}
        <img
          src={CalmisuLogo}
          alt="Calmisu"
          className="w-full text-gray-100"
        />
        
        {/* Bamboo illustration overlapping */}
        <img
          src="/images/footer-bamboo.webp"
          alt="Bamboo illustration"
          className="w-full object-cover -mt-[60px] md:-mt-[120px]"
          loading="lazy"
        />
      </div>
    </footer>
  );
};

export default Footer;