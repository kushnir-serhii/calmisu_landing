import { logEvent } from "firebase/analytics";
import { getAnalyticsInstance } from "./firebase";

type Params = Record<string, string | number | boolean>;

/**
 * Fire-and-forget conversion event.
 *
 * No-ops when analytics is not initialised — i.e. before the user accepts the
 * cookie banner, or in unsupported browsers. That means declined-consent
 * visitors are invisible in these numbers; treat the counts as a floor, not a
 * total.
 */
export function track(name: string, params: Params = {}): void {
  const analytics = getAnalyticsInstance();
  if (!analytics) return;
  try {
    logEvent(analytics, name, params);
  } catch {
    // A metric must never break the page.
  }
}
