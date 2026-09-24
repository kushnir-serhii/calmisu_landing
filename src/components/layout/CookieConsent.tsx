import { useEffect, useState } from "react";
import { initAnalytics } from "@/lib/firebase";
import { getStoredConsent, storeConsent } from "@/lib/cookieConsent";

export const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = getStoredConsent();
    if (stored === "granted") {
      initAnalytics();
    } else if (stored === null) {
      setVisible(true);
    }
  }, []);

  const handleChoice = (value: "granted" | "denied") => {
    storeConsent(value);
    if (value === "granted") initAnalytics();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex flex-wrap items-center justify-center gap-3 bg-foreground text-background px-4 py-2.5 text-xs sm:text-sm">
      <p className="leading-snug">
        We use analytics cookies.{" "}
        <a href="/en/privacy-policy" className="underline underline-offset-2">
          Privacy Policy
        </a>
      </p>
      <div className="flex shrink-0 gap-2">
        <button
          onClick={() => handleChoice("denied")}
          className="rounded-lg border border-background/30 px-3 py-1 font-medium hover:bg-background/10 transition"
        >
          Decline
        </button>
        <button
          onClick={() => handleChoice("granted")}
          className="rounded-lg bg-background text-foreground px-3 py-1 font-medium hover:opacity-90 transition"
        >
          Accept
        </button>
      </div>
    </div>
  );
};
