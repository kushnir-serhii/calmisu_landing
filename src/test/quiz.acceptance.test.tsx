import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import QuizIsland from "@/components/quiz/QuizIsland";
import QuizResultIsland from "@/components/quiz/QuizResultIsland";

/**
 * Acceptance-level tests for the Calm Profile quiz (spec 002, Slice 9).
 *
 * Unlike quiz.test.ts / quizIsland.test.tsx (which each prove one slice's
 * logic), these exercise functional-spec.md §2 acceptance criteria that no
 * existing test covers end to end: the iPhone path's missing store surface,
 * the deep-link Play fallback, the dual-clock code copy, the structural
 * placement of the consent/privacy-policy text, and that a failed submit
 * never fires a success event.
 *
 * Consent-gated analytics (§2.5, "no event before cookie consent") is
 * covered separately in quizAnalyticsConsent.acceptance.test.ts, which needs
 * the *real*, unmocked src/lib/analytics.ts — vi.mock calls are hoisted to
 * the top of a whole test file, so that assertion cannot share this file
 * with the `vi.mock("@/lib/analytics", ...)` below.
 *
 * @spec: 002-calm-profile-quiz
 */

vi.mock("@/lib/analytics", () => ({ track: vi.fn() }));
vi.mock("@/lib/api", () => ({
  postLead: vi.fn().mockResolvedValue({
    ok: true,
    promoCode: "12345",
    promoExpiresAt: "2026-10-08T00:00:00.000Z",
  }),
}));

import { track } from "@/lib/analytics";
import { postLead } from "@/lib/api";

function stubLocation(search = "") {
  const location = {
    href: `https://calmisu.com/quiz/${search}`,
    search,
    assign: vi.fn(),
  };
  Object.defineProperty(window, "location", {
    value: location,
    writable: true,
    configurable: true,
  });
  return location;
}

beforeEach(() => {
  window.localStorage.clear();
  vi.clearAllMocks();
});

afterEach(() => {
  window.localStorage.clear();
  vi.useRealTimers();
});

// ─────────────────────────────────────────────────────────────────────────
// §2.5 Analytics — "Going back and then forward doesn't double-count
// answers."
// ─────────────────────────────────────────────────────────────────────────
describe("back/forward navigation and analytics counting", () => {
  // QuizIsland's advance() (see src/components/QuizIsland.tsx) guards
  // quiz_question_answered with an in-memory `trackedSteps` ref, so
  // re-choosing an option on a question you went Back to does not re-fire
  // the event for that index/question_id.
  it(
    "does not double-count quiz_question_answered when Back then re-answering the same question",
    () => {
      stubLocation();
      render(<QuizIsland source="homepage" />);
      fireEvent.click(screen.getByText("Start the quiz"));

      fireEvent.click(screen.getByText("Panic attacks")); // Q1 -> Q2, tracks index 1
      fireEvent.click(screen.getByLabelText("Previous question")); // back to Q1
      fireEvent.click(screen.getByText("Panic attacks")); // re-answer Q1 -> Q2 again

      const q1Calls = vi
        .mocked(track)
        .mock.calls.filter(
          (c) => c[0] === "quiz_question_answered" && c[1]?.index === 1
        );
      expect(q1Calls).toHaveLength(1);
    }
  );
});

// ─────────────────────────────────────────────────────────────────────────
// §2.2 — iPhone visitor: "no Play links and no promo code appear."
// ─────────────────────────────────────────────────────────────────────────
describe("iPhone path shows no Play Store surface", () => {
  // @spec: 002-calm-profile-quiz @regression
  it("renders no play.google.com link and no code after unlocking as iPhone", async () => {
    stubLocation("?p=panic");
    const { container } = render(<QuizResultIsland />);

    fireEvent.click(screen.getByRole("radio", { name: "iPhone" }));
    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "ios@example.com" },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: "Send my plan" }));

    await waitFor(() =>
      expect(screen.getByText("Your 7 days")).toBeInTheDocument()
    );

    const links = within(container).queryAllByRole("link");
    for (const link of links) {
      expect(link.getAttribute("href") ?? "").not.toContain(
        "play.google.com"
      );
    }
    expect(screen.queryByText("12345")).not.toBeInTheDocument();
    expect(screen.getByText("Calmisu is coming to iOS")).toBeInTheDocument();
    // Plan stays fully visible — this is not a further gate.
    expect(
      screen.getAllByText(/08:00|13:00|21:00|22:30/).length
    ).toBeGreaterThan(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────
// §2.2 — "A server error shows a visible error and fires no success event."
// ─────────────────────────────────────────────────────────────────────────
describe("server error fires no success event", () => {
  // @spec: 002-calm-profile-quiz @regression
  it("never tracks quiz_email_submit when postLead rejects", async () => {
    vi.mocked(postLead).mockRejectedValueOnce(new Error("Service unavailable"));
    stubLocation("?p=anxiety");
    render(<QuizResultIsland />);

    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: "Send my plan" }));

    await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument());

    expect(track).not.toHaveBeenCalledWith(
      "quiz_email_submit",
      expect.anything()
    );
    expect(track).toHaveBeenCalledWith("quiz_email_error", expect.anything());
  });
});

// ─────────────────────────────────────────────────────────────────────────
// §2.2 — "The copy states both clocks: activate within 7 days, and get
// 14 days of PRO once redeemed."
// ─────────────────────────────────────────────────────────────────────────
describe("promo code copy states both clocks", () => {
  // @spec: 002-calm-profile-quiz @regression
  it("mentions both the 7-day activation window and the 14-day PRO duration", async () => {
    stubLocation("?p=panic");
    render(<QuizResultIsland />);

    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: "Send my plan" }));

    await waitFor(() =>
      expect(screen.getByText("14 days of PRO, free")).toBeInTheDocument()
    );

    expect(screen.getByText(/Activate it within 7/)).toBeInTheDocument();
    expect(screen.getAllByText(/14 days of PRO/i).length).toBeGreaterThan(0);
    // The code itself is never shown on the page — only sent by email.
    expect(
      screen.getByText(/sent your code to your email.*create an account.*enter it under\s*Profile/i)
    ).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────────────────────────────────
// §2.2 — "The consent checkbox ... names what is stored ... The Privacy
// Policy is linked in the small print below the button, outside the label."
// ─────────────────────────────────────────────────────────────────────────
describe("consent copy and privacy-policy link placement", () => {
  // @spec: 002-calm-profile-quiz @regression
  it("names email/profile/platform in the consent label and links the policy outside it", () => {
    stubLocation("?p=panic");
    render(<QuizResultIsland />);

    const checkbox = screen.getByRole("checkbox");
    const label = checkbox.closest("label");
    expect(label).not.toBeNull();
    expect(label!.textContent).toMatch(/email/i);
    expect(label!.textContent).toMatch(/profile/i);
    expect(label!.textContent).toMatch(/phone/i);
    // The label names what is stored but must not itself carry the link —
    // an anchor inside a <label> would also toggle the checkbox on click.
    expect(label!.querySelector("a")).toBeNull();

    const policyLink = screen.getByRole("link", { name: /privacy policy/i });
    expect(policyLink).toHaveAttribute("href", "/en/privacy-policy/");
    expect(policyLink.closest("label")).toBeNull();
  });

  // @spec: 002-calm-profile-quiz @regression
  it("leaves the consent checkbox unchecked by default", () => {
    stubLocation("?p=panic");
    render(<QuizResultIsland />);
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });
});

// ─────────────────────────────────────────────────────────────────────────
// §2.2 — Android: "Each plan row's Start button opens the app (calmisu://)
// and falls back to Google Play if the app doesn't open within about 1.5s."
// ─────────────────────────────────────────────────────────────────────────
describe("deep link falls back to the Play listing", () => {
  // @spec: 002-calm-profile-quiz @regression
  it("opens the calmisu:// scheme immediately, then Play after ~1.5s if the app never took over", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const location = stubLocation("?p=panic");
    render(<QuizResultIsland />);

    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: "Send my plan" }));

    await vi.waitFor(() =>
      expect(screen.getByText("Your 7 days")).toBeInTheDocument()
    );

    fireEvent.click(screen.getAllByRole("button", { name: "Start" })[0]);
    expect(location.href).toBe("calmisu://");

    // Simulate the app never taking over: no visibilitychange fires.
    vi.advanceTimersByTime(1500);
    expect(location.href).toContain("play.google.com");
  });
});
