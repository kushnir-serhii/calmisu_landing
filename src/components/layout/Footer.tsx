import CalmisuLogo from "@/assets/calmisu.svg?react";
import { navLinks } from "@/data/navLinks";
import { SocialsList } from "./SocialsList";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-50 flex flex-col items-center pt-10 sm:pt-16 gap-8 sm:gap-10 border-t border-secondary overflow-hidden relative">
      {/* Nav links */}
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between w-full sm:px-8 lg:px-[140px]">
        <nav className="flex flex-wrap items-center justify-center xs:justify-between sm:justify-between gap-x-6 gap-y-3 px-6 w-full md:max-w-[80%] lg:max-w-[70%]">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.isExternal ? "_blank" : undefined}
              rel={link.isExternal ? "noopener noreferrer" : undefined}
              className="text-foreground text-sm sm:text-base md:text-xl font-body leading-[150%] hover:text-brand transition-colors inline-flex items-center min-h-11"
            >
              {link.label}
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
          aria-hidden="true"
        />
        {/* Desktop: thicker stroke */}
        <CalmisuLogo
          className="hidden sm:block w-full text-[#E8E8EA]"
          strokeWidth={2}
          aria-hidden="true"
        />
        <img
          src="/images/footer-bamboo.webp"
          alt=""
          width={1920}
          height={435}
          className="w-full object-cover -mt-[30px] sm:-mt-[60px] md:-mt-[120px]"
          loading="lazy"
        />
      </div>
    </footer>
  );
};

export default Footer;
