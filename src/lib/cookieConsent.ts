export const CONSENT_KEY = "calmisu_cookie_consent";
export type ConsentValue = "granted" | "denied";

export function getStoredConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(CONSENT_KEY);
  return value === "granted" || value === "denied" ? value : null;
}

export function storeConsent(value: ConsentValue) {
  window.localStorage.setItem(CONSENT_KEY, value);
}
