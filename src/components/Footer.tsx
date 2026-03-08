const footerLinks = [
  { label: "Features", href: "#features" },
  { label: "FAQ", href: "#faq" },
  { label: "About", href: "#about" },
  { label: "Privacy Policy", href: "#privacy" },
  { label: "Download", href: "#download" },
];

const Footer = () => {
  return (
    <footer className="w-full bg-gray-50 flex flex-col items-center pt-16 overflow-hidden">
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

      <div className="text-center font-display text-[80px] sm:text-[150px] md:text-[250px] lg:text-[335px] leading-[100%] text-gray-100 select-none mt-10">
        Calmisu
      </div>

      <img
        src="/images/footer-bamboo.webp"
        alt="Bamboo illustration"
        className="w-full object-contain -mt-[150px] sm:-mt-[200px] md:-mt-[250px]"
        loading="lazy"
      />
    </footer>
  );
};

export default Footer;
