import type { FC } from "react";
import { UkFlagIcon } from "@/components/ui/flags/UkFlagIcon";
import { PlFlagIcon } from "@/components/ui/flags/PlFlagIcon";
import { UaFlagIcon } from "@/components/ui/flags/UaFlagIcon";
import { EsFlagIcon } from "@/components/ui/flags/EsFlagIcon";

export type CalmisuLang = "en" | "pl" | "uk";
export type AlmaLang = "en" | "es" | "uk";

const flags: Record<string, FC<{ size?: number }>> = {
  en: UkFlagIcon,
  pl: PlFlagIcon,
  uk: UaFlagIcon,
  es: EsFlagIcon,
};

export const LanguageSwitcher = ({
  lang,
  langs,
  basePath = "",
  currentPath,
  onLangChange,
}: {
  lang: string;
  langs: readonly string[];
  /** "" for Calmisu (root pages), "/alma" for the Alma docs. */
  basePath?: string;
  currentPath?: string;
  /** When provided, renders <button>s instead of links (used by the in-page form switcher). */
  onLangChange?: (lang: string) => void;
}) => {
  const stripPattern = new RegExp(`^${basePath}/(${langs.join("|")})`);
  const path = (currentPath ?? "").replace(stripPattern, "");

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
          <a key={l} href={`${basePath}/${l}${path}`} className={className}>
            <Flag size={20} />
            {l.toUpperCase()}
          </a>
        );
      })}
    </div>
  );
};

export default LanguageSwitcher;
