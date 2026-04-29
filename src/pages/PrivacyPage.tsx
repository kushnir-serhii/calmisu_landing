import { PrivacyEn } from "@/components/privacy/Privacy.en";
import { PrivacyPl } from "@/components/privacy/Privacy.pl";
import { PrivacyUa } from "@/components/privacy/Privacy.ua";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function PrivacyPage() {

  useEffect(() => { },[])
  const { lang } = useParams();
  const content = { en: <PrivacyEn />, pl: <PrivacyPl />, uk: <PrivacyUa /> };
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
