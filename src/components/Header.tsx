const CalmisLogo = () => (
  <svg className="flex items-center gap-1 shrink-0" width="160" height="42" viewBox="0 0 448 42" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#filter0_d_logo)">
      <path d="M9.17003 15.522C3.75523 15.7059 2.29086 20.6814 2.29937 23.2355C-3.57517 27.3477 3.04007 33.2478 8.37824 31.0512C9.91073 33.3755 23.601 36.5937 31.2634 31.0512C38.9259 33.401 42.5272 23.4143 35.8609 21.984C36.4228 16.2371 32.4894 13.1466 27.9941 13.9384C22.7581 2.95556 9.91073 9.03442 9.17003 15.522Z" fill="#5B75B6"/>
      <path d="M31.2636 31.0516C38.9261 33.4014 42.5274 23.4147 35.8611 21.9844C31.2636 35.9789 13.3328 33.7823 8.37842 31.0516C9.91091 33.3759 23.6012 36.5941 31.2636 31.0516Z" fill="#5B75B6"/>
    </g>
    <text fill="black" style={{ whiteSpace: "pre" }} fontFamily="Orienta" fontSize="28" letterSpacing="0em">
      <tspan x="43.4624" y="31.15">Calmisu</tspan>
    </text>
    <defs>
      <filter id="filter0_d_logo" x="-2.75848" y="5.12433" width="44.8759" height="31.7504" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset/>
        <feGaussianBlur stdDeviation="1.37924"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
      </filter>
    </defs>
  </svg>
);

const Header = () => {
  return (
    <header className="flex w-full px-6 md:px-[120px] py-4 justify-between items-center border-b border-brand-light bg-background sticky top-0 z-50">
      <CalmisLogo />
      <nav className="hidden md:flex items-center gap-16">
        {["Features", "FAQ", "About", "Download"].map((item) => (
          <a key={item} href={`#${item.toLowerCase()}`} className="text-foreground text-center font-body text-xl font-normal leading-[150%] hover:text-brand transition-colors">
            {item}
          </a>
        ))}
      </nav>
    </header>
  );
};

export default Header;
