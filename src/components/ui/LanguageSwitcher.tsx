import { useLocation } from "react-router-dom";
import { UkFlagIcon } from "./flags/UkFlagIcon";
import { PlFlagIcon } from "./flags/PlFlagIcon";
import { UaFlagIcon } from "./flags/UaFlagIcon";

const flags: Record<string, React.FC<{ size?: number }>> = {
  en: UkFlagIcon,
  pl: PlFlagIcon,
  uk: UaFlagIcon,
};

export const LanguageSwitcher = ({ lang }: { lang: string }) => {
  const location = useLocation();

  const path = location.pathname.replace(/^\/(en|pl|uk)/, "");

  const langs = ["en", "pl", "uk"];
  return (
    <div className="flex gap-3">
      {langs.map((l) => {
        const Flag = flags[l];
        return (
          <a
            key={l}
            href={`#/${l}${path}`}
            className={`flex items-center gap-1 ${l === lang ? "font-bold" : "opacity-40 hover:opacity-100"}`}
          >
            <Flag size={20} />
            {l.toUpperCase()}
          </a>
        );
      })}
    </div>
  );
};

export default LanguageSwitcher;
