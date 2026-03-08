const footerLinks = [
  { label: "Features", href: "#features" },
  { label: "FAQ", href: "#faq" },
  { label: "About", href: "#about" },
  { label: "Privacy Policy", href: "#privacy" },
  { label: "Download", href: "#download" },
];

const Footer = () => {
  return (
    <footer className="w-full bg-muted flex flex-col items-center pt-16 overflow-hidden">
      {/* Nav links */}
      <nav className="flex flex-wrap justify-center gap-8 md:gap-16 px-6 w-full max-w-[1121px]">
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
      <div className="relative w-full mt-12 md:mt-20">
        <div className="text-center font-display text-[80px] sm:text-[150px] md:text-[250px] lg:text-[335px] leading-[1.2] text-border select-none">
          Calmisu
        </div>
        <img
          src="/images/footer-bamboo.webp"
          alt=""
          className="w-full object-cover relative -mt-[15%] md:-mt-[10%]"
          loading="lazy"
        />
      </div>
    </footer>
  );
};

export default Footer;
