import { TermsEn } from "@/components/terms/Terms.en";
import { TermsPl } from "@/components/terms/Terms.pl";
import { TermsUa } from "@/components/terms/Terms.ua";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { useParams } from "react-router-dom";

export default function TermsPage() {
  const { lang } = useParams();
  const content = { en: <TermsEn />, pl: <TermsPl />, uk: <TermsUa /> };
  const current = content[lang as keyof typeof content] ? lang! : "en";
  return (
    <div className="flex flex-col px-36">
      <div className="ml-auto">
        <LanguageSwitcher lang={current} />
      </div>
      <div>{content[current as keyof typeof content]}</div>
    </div>
  );
}
