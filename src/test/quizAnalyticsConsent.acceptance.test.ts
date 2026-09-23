import { describe, it, expect, vi, afterEach } from "vitest";

/**
 * §2.5 Analytics — "No event fires before cookie consent."
 *
 * Exercises the real, unmocked src/lib/analytics.ts + src/lib/firebase.ts
 * pair (no vi.mock("@/lib/analytics") in this file — that must stay isolated
 * from quiz.acceptance.test.tsx, since vi.mock is hoisted per file). track()
 * is a no-op until initAnalytics() has been called, which the app only does
 * after the cookie banner is accepted — so this is the actual gate, not a
 * behavioural assumption about it.
 *
 * @spec: 002-calm-profile-quiz
 */

afterEach(() => {
  vi.doUnmock("firebase/analytics");
  vi.doUnmock("firebase/app");
  vi.resetModules();
});

describe("track() consent gating", () => {
  // @spec: 002-calm-profile-quiz @regression
  it("does not log any event while analytics has not been initialised (pre-consent)", async () => {
    vi.resetModules();
    const logEvent = vi.fn();
    vi.doMock("firebase/analytics", () => ({ logEvent }));

    const { track } = await import("@/lib/analytics");
    track("quiz_start", { src: "homepage" });
    // track() is fire-and-forget (dynamic import + .then); let the
    // microtask queue drain before asserting the no-op.
    await new Promise((r) => setTimeout(r, 0));

    expect(logEvent).not.toHaveBeenCalled();
  });

  // @spec: 002-calm-profile-quiz @regression
  it("logs the event once analytics has been initialised (post-consent)", async () => {
    vi.resetModules();
    const logEvent = vi.fn();
    vi.doMock("firebase/analytics", () => ({
      logEvent,
      isSupported: vi.fn().mockResolvedValue(true),
      getAnalytics: vi.fn().mockReturnValue({ app: "fake" }),
    }));
    vi.doMock("firebase/app", () => ({
      initializeApp: vi.fn().mockReturnValue({}),
    }));

    const { track } = await import("@/lib/analytics");
    const { initAnalytics } = await import("@/lib/firebase");

    await initAnalytics(); // simulates the cookie-banner "accept" action
    track("quiz_start", { src: "homepage" });
    await new Promise((r) => setTimeout(r, 0));

    expect(logEvent).toHaveBeenCalledWith(
      expect.anything(),
      "quiz_start",
      { src: "homepage" }
    );
  });
});
