import { FormValues } from "@/components/DeleteAccountIsland";

export const API_BASE_URL = import.meta.env.PUBLIC_API_BASE_URL ?? "";
export async function deleteAccount(values: FormValues): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/auth/delete-account-web`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message ?? "Something went wrong. Please try again.");
  }
}

export interface LeadPayload {
  email: string;
  /** The derived profile only — never the raw quiz answers. */
  profile: string;
  source: "quiz" | "ios_waitlist";
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
  const res = await fetch(`${API_BASE_URL}/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message ?? "Something went wrong. Please try again.");
  }

  return data as LeadResponse;
}