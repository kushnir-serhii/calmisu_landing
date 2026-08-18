import { UkFlagIcon } from "@/components/ui/flags/UkFlagIcon";
import { EsFlagIcon } from "@/components/ui/flags/EsFlagIcon";
import { UaFlagIcon } from "@/components/ui/flags/UaFlagIcon";

export type AlmaLang = "en" | "es" | "uk";

const flags: Record<AlmaLang, React.FC<{ size?: number }>> = {
  en: UkFlagIcon,
  es: EsFlagIcon,
  uk: UaFlagIcon,
};

const langs: AlmaLang[] = ["en", "es", "uk"];

export const AlmaLanguageSwitcher = ({
  lang,
  currentPath,
}: {
  lang: AlmaLang;
  currentPath: string;
}) => {
  const path = currentPath.replace(/^\/alma\/(en|es|uk)/, "");

  return (
    <div className="flex gap-3">
      {langs.map((l) => {
        const Flag = flags[l];
        const className = `flex items-center gap-1 ${l === lang ? "font-bold" : "opacity-40 hover:opacity-100"}`;
        return (
          <a key={l} href={`/alma/${l}${path}`} className={className}>
            <Flag size={20} />
            {l.toUpperCase()}
          </a>
        );
      })}
    </div>
  );
};

export default AlmaLanguageSwitcher;
