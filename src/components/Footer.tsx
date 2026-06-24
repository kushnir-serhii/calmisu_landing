import CalmisuLogo from "@/assets/calmisu.svg?react";
import { navLinks } from "@/data/navLinks";
import { SocialsList } from "./socialsList.tsx/SocialsList";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-50 flex flex-col items-center pt-10 sm:pt-16 gap-8 sm:gap-10 overflow-hidden relative">
      {/* Nav links */}
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between w-full sm:px-8 lg:px-[140px]">
        <nav className="flex flex-wrap items-center justify-center xs:justify-between sm:justify-between gap-x-6 gap-y-3 px-6 w-full md:max-w-[80%] lg:max-w-[70%]">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.isOuterLink ? "_blank" : undefined}
              rel={link.isOuterLink ? "noopener noreferrer" : undefined}
              className="text-foreground text-sm sm:text-base md:text-xl font-body leading-[150%] hover:opacity-70 transition-opacity"
            >
              <span className="h-11">{link.label}</span>
            </a>
          ))}
        </nav>
        {/* Socials */}
        <div className="">
          <SocialsList />
        </div>
      </div>

      {/* Calmisu logo and bamboo stacked */}
      <div className="relative w-full flex flex-col items-center">
        {/* Mobile: thin stroke */}
        <CalmisuLogo
          className="block sm:hidden w-full text-[#E8E8EA]"
          strokeWidth={0.5}
          aria-label="Calmisu"
        />
        {/* Desktop: thicker stroke */}
        <CalmisuLogo
          className="hidden sm:block w-full text-[#E8E8EA]"
          strokeWidth={2}
          aria-label="Calmisu"
        />
        <img
          src="/images/footer-bamboo.webp"
          alt="Bamboo illustration"
          className="w-full object-cover -mt-[30px] sm:-mt-[60px] md:-mt-[120px]"
          loading="lazy"
        />
      </div>
    </footer>
  );
};

export default Footer;
