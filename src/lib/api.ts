import type { FormValues } from "@/components/account/DeleteAccountIsland";

export const API_BASE_URL = import.meta.env.PUBLIC_API_BASE_URL ?? "";

const REQUEST_TIMEOUT_MS = 15_000;

const OFFLINE_MESSAGE =
  "You seem to be offline. Check your connection and try again.";
const NETWORK_MESSAGE =
  "We couldn't reach Calmisu. Check your connection and try again.";
const TIMEOUT_MESSAGE =
  "This is taking longer than it should. Please try again in a moment.";

function errorMessageFor(status: number, data: Record<string, unknown>): string {
  if (status === 429) {
    return "Too many attempts in a row. Please wait a little while and try again.";
  }
  if (status >= 400 && status < 500 && typeof data.message === "string" && data.message) {
    return data.message;
  }
  return "Something went wrong on our side. Please try again in a moment.";
}

/**
 * Raw browser errors ("Failed to fetch", "Load failed") are meaningless to an
 * anxious visitor, so every failure here maps to a sentence naming the
 * problem and the recovery, instead of surfacing whatever fetch/JSON threw.
 */
async function postJson(path: string, body: unknown): Promise<Record<string, unknown>> {
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    throw new Error(OFFLINE_MESSAGE);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch {
    throw new Error(controller.signal.aborted ? TIMEOUT_MESSAGE : NETWORK_MESSAGE);
  } finally {
    clearTimeout(timer);
  }

  // A proxy's HTML 502 must not throw a SyntaxError at the user.
  const parsed = await res.json().catch(() => ({}));
  const data =
    parsed !== null && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {};

  if (!res.ok) {
    throw new Error(errorMessageFor(res.status, data));
  }

  return data;
}

export async function deleteAccount(values: FormValues): Promise<void> {
  await postJson("/auth/delete-account-web", values);
}

export interface LeadPayload {
  email: string;
  /**
   * The derived profile only — never the raw quiz answers. Absent for the iOS
   * waitlist, which has no quiz behind it.
   */
  profile?: string;
  source: "quiz" | "ios_waitlist";
  /**
   * Which phone the visitor says they use, stated by them — never inferred
   * from the user agent. Absent for the iOS waitlist modal, which has no
   * quiz behind it.
   */
  platform?: "ios" | "android";
  locale: string;
  consent: boolean;
  /**
   * The result-page params, so the Day-0 email can link to this exact plan.
   * Q1–Q3 and Q6–Q9 only; the backend validates each as an enum and stores
   * none of them.
   */
  plan?: { t: string; d: string; c: string; m: string; f: string };
}

export interface LeadResponse {
  ok: true;
  /**
   * A fresh, per-lead one-time code (source: "quiz" only — the iOS waitlist
   * always gets null, since there is nothing to redeem it in yet).
   */
  promoCode: string | null;
  /**
   * The *activation* deadline — the code must be redeemed by this date. This
   * is a different number from how many days of PRO the code grants once
   * redeemed (currently always 14); do not conflate the two in copy.
   */
  promoExpiresAt: string | null;
}

/**
 * Quiz / waitlist email capture.
 *
 * Only `profile` and the plan params are sent, never the Q4/Q5 answers — those
 * are health data and stay on the device. The backend has no column that could
 * hold them. Keep it that way.
 */
export async function postLead(payload: LeadPayload): Promise<LeadResponse> {
  const data = await postJson("/leads", payload);

  // A malformed success body degrades to the "check your email" path rather
  // than rendering undefined.
  return {
    ok: true,
    promoCode: typeof data.promoCode === "string" && data.promoCode ? data.promoCode : null,
    promoExpiresAt: typeof data.promoExpiresAt === "string" ? data.promoExpiresAt : null,
  };
}
