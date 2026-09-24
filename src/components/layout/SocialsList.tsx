const socials = [
  {
    name: "Instagram",
    link: "https://www.instagram.com/calmisu.app/",
    icon: "/icons/socials/instagram.svg",
  },
  {
    name: "Facebook",
    link: "https://www.facebook.com/calmisu",
    icon: "/icons/socials/facebook.svg",
  },
  {
    name: "TikTok",
    link: "https://www.tiktok.com/@calmisu.app",
    icon: "/icons/socials/tiktok.svg",
  },
];

export const SocialsList = () => {
  return (
    <ul className="flex items-center gap-6 md:w-auto justify-center">
      {socials.map(({ name, link, icon }) => (
        <li key={name} className="flex items-center justify-center size-11">
          <a
            href={link}
            aria-label={name}
            target={"_blank"}
            rel={"noopener noreferrer"}
            className="text-slate-500 hover:text-black hover:-translate-y-0.5 transition-all duration-200"
          >
            <img src={icon} alt={name} width={24} height={24} />
          </a>
        </li>
      ))}
    </ul>
  );
};
