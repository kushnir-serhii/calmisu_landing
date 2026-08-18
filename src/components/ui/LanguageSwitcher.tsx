import { UkFlagIcon } from "./flags/UkFlagIcon";
import { PlFlagIcon } from "./flags/PlFlagIcon";
import { UaFlagIcon } from "./flags/UaFlagIcon";

const flags: Record<string, React.FC<{ size?: number }>> = {
  en: UkFlagIcon,
  pl: PlFlagIcon,
  uk: UaFlagIcon,
};

export const LanguageSwitcher = ({
  lang,
  currentPath,
  onLangChange,
}: {
  lang: string;
  currentPath?: string;
  onLangChange?: (lang: string) => void;
}) => {
  const path = (currentPath ?? "").replace(/^\/(en|pl|uk)/, "");

  const langs = ["en", "pl", "uk"];
  return (
    <div className="flex gap-3">
      {langs.map((l) => {
        const Flag = flags[l];
        const className = `flex items-center gap-1 ${l === lang ? "font-bold" : "opacity-40 hover:opacity-100"}`;
        return onLangChange ? (
          <button key={l} onClick={() => onLangChange(l)} className={className}>
            <Flag size={20} />
            {l.toUpperCase()}
          </button>
        ) : (
          <a key={l} href={`/${l}${path}`} className={className}>
            <Flag size={20} />
            {l.toUpperCase()}
          </a>
        );
      })}
    </div>
  );
};

export default LanguageSwitcher;
