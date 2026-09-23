import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import QuizIsland from "@/components/QuizIsland";
import QuizResultIsland from "@/components/QuizResultIsland";
import { questions, profiles } from "@/data/quiz";

vi.mock("@/lib/analytics", () => ({ track: vi.fn() }));
vi.mock("@/lib/api", () => ({
  postLead: vi.fn().mockResolvedValue({
    ok: true,
    promoCode: "12345",
    promoExpiresAt: "2026-09-29T00:00:00.000Z",
  }),
}));

import { postLead } from "@/lib/api";

/**
 * Smoke coverage for the two islands. jsdom can't tell us the page looks
 * right, but it can prove the flow advances, the gate holds, and — the part
 * that actually matters legally — that nothing writes the answers to storage.
 */

/** Replaces window.location so assignments are observable, not navigations. */
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
});

/** Renders the island and clicks past the intro CTA into the questions. */
function renderQuiz(props?: { source?: string }) {
  const utils = render(<QuizIsland {...props} />);
  fireEvent.click(screen.getByText("Start the quiz"));
  return utils;
}

describe("QuizIsland", () => {
  it("shows the intro CTA before the quiz starts, and fires quiz_start on click", async () => {
    stubLocation();
    const { track } = await import("@/lib/analytics");
    render(<QuizIsland source="homepage" />);

    expect(screen.getByText("Start the quiz")).toBeInTheDocument();
    expect(screen.queryByText("What brings you here?")).not.toBeInTheDocument();
    expect(track).not.toHaveBeenCalled();

    fireEvent.click(screen.getByText("Start the quiz"));

    expect(track).toHaveBeenCalledWith("quiz_start", { src: "homepage" });
    expect(screen.getByText("What brings you here?")).toBeInTheDocument();
  });

  it("renders the first question with the app's reason options", () => {
    stubLocation();
    renderQuiz();
    expect(screen.getByText("What brings you here?")).toBeInTheDocument();
    for (const option of questions[0].options) {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    }
  });

  it("advances on a single-select tap and shows progress", () => {
    stubLocation();
    renderQuiz();
    expect(screen.getByText(`1 of ${questions.length}`)).toBeInTheDocument();

    fireEvent.click(screen.getByText("Panic attacks"));

    expect(screen.getByText(questions[1].question)).toBeInTheDocument();
    expect(screen.getByText(`2 of ${questions.length}`)).toBeInTheDocument();
  });

  it("keeps the earlier answer when going Back", () => {
    stubLocation();
    renderQuiz();
    fireEvent.click(screen.getByText("Panic attacks"));
    fireEvent.click(screen.getByLabelText("Previous question"));

    expect(screen.getByText("What brings you here?")).toBeInTheDocument();
    // The previously chosen card is still the selected one.
    const chosen = screen.getByText("Panic attacks").closest("button");
    expect(chosen?.className).toContain("border-brand");
  });

  it("requires an explicit Continue on multi-select questions", () => {
    stubLocation();
    renderQuiz();
    fireEvent.click(screen.getByText("Panic attacks")); // Q1
    fireEvent.click(screen.getByText("In the middle of the night")); // Q2
    fireEvent.click(screen.getByText("Most days")); // Q3 → Q4 is multi

    expect(screen.getByText("What does your body do?")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Heart races or pounds"));
    // Still on Q4 — multi-select must not auto-advance.
    expect(screen.getByText("What does your body do?")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Continue"));
    expect(screen.getByText(questions[4].question)).toBeInTheDocument();
  });

  it("navigates to the result with an encoded plan once finished", () => {
    const location = stubLocation();
    renderQuiz();

    fireEvent.click(screen.getByText("Panic attacks"));
    fireEvent.click(screen.getByText("In the middle of the night"));
    fireEvent.click(screen.getByText("Most days"));
    fireEvent.click(screen.getByText("Skip this one")); // Q4
    fireEvent.click(screen.getByText("Skip this one")); // Q5
    fireEvent.click(screen.getByText("Around other people, usually"));
    fireEvent.click(screen.getByText("Doing something with my hands"));
    fireEvent.click(screen.getByText("Skip this one")); // Q8
    fireEvent.click(screen.getByText("About 2 minutes")); // Q9 → done

    expect(location.href).toContain("/quiz/result/?");
    const params = new URLSearchParams(location.href.split("?")[1]);
    expect(params.get("p")).toBe("panic");
    expect(params.get("t")).toBe("night");
    expect(params.get("d")).toBe("2");
    expect(params.get("m")).toBe("hands");
  });

  it("never writes answers to browser storage", () => {
    stubLocation();
    renderQuiz();
    fireEvent.click(screen.getByText("Panic attacks"));
    fireEvent.click(screen.getByText("In the middle of the night"));

    expect(window.localStorage.length).toBe(0);
    expect(window.sessionStorage.length).toBe(0);
  });
});

describe("QuizResultIsland", () => {
  it("shows the fallback when the URL carries no usable profile", () => {
    stubLocation("");
    render(<QuizResultIsland />);
    expect(screen.getByText("We could not find that plan")).toBeInTheDocument();
    expect(screen.getByText("Take the quiz")).toBeInTheDocument();
  });

  it("renders the full profile ungated, and hides the plan", () => {
    stubLocation("?p=sleep&t=night&d=10&f=daily");
    render(<QuizResultIsland />);

    const content = profiles.sleep;
    expect(screen.getByText(content.name)).toBeInTheDocument();
    expect(screen.getByText(content.subtitle)).toBeInTheDocument();
    for (const paragraph of content.why) {
      expect(screen.getByText(paragraph)).toBeInTheDocument();
    }
    // Gated: the plan is not in the document yet.
    expect(screen.queryByText("Your 7 days")).not.toBeInTheDocument();
    expect(screen.getByText("Your 7-day plan is ready")).toBeInTheDocument();
  });

  it("blocks submit until consent is ticked", () => {
    stubLocation("?p=panic");
    render(<QuizResultIsland />);

    const submit = screen.getByRole("button", { name: "Send my plan" });
    expect(submit).toBeDisabled();

    fireEvent.click(screen.getByRole("checkbox"));
    expect(submit).toBeEnabled();
  });

  it("sends only the derived profile, never the answers", async () => {
    stubLocation("?p=racingThoughts&t=day&d=5");
    render(<QuizResultIsland />);

    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: "Send my plan" }));

    await waitFor(() => expect(postLead).toHaveBeenCalledTimes(1));
    const payload = vi.mocked(postLead).mock.calls[0][0];
    expect(payload).toEqual({
      email: "test@example.com",
      profile: "racingThoughts",
      source: "quiz",
      platform: "android",
      locale: "en",
      consent: true,
      // Q1–Q3 and Q6–Q9 only, so the Day-0 email can link to this exact plan.
      plan: { t: "day", d: "5", c: "alone", m: "visual", f: "weekly" },
    });
    expect(Object.keys(payload)).toHaveLength(7);
    expect(Object.keys(payload.plan!)).toEqual(["t", "d", "c", "m", "f"]);
  });

  it("defaults the platform choice to the UA sniff (non-iOS → android)", async () => {
    stubLocation("?p=panic");
    render(<QuizResultIsland />);

    // No explicit UA override is set here, so jsdom's default UA is not iOS
    // and the default radio choice should be Android.
    const androidRadio = screen.getByRole("radio", { name: "Android" });
    const iosRadio = screen.getByRole("radio", { name: "iPhone" });
    expect(androidRadio).toHaveAttribute("aria-checked", "true");
    expect(iosRadio).toHaveAttribute("aria-checked", "false");
  });

  it("selecting iPhone sends platform: 'ios' with source: 'quiz' (not 'ios_waitlist')", async () => {
    stubLocation("?p=panic");
    render(<QuizResultIsland />);

    fireEvent.click(screen.getByRole("radio", { name: "iPhone" }));
    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "ios@example.com" },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: "Send my plan" }));

    await waitFor(() => expect(postLead).toHaveBeenCalledTimes(1));
    const payload = vi.mocked(postLead).mock.calls[0][0];
    expect(payload.source).toBe("quiz");
    expect(payload.platform).toBe("ios");
  });

  it("reveals the seven days and the promo code after submitting", async () => {
    stubLocation("?p=panic&t=morning&d=5&f=weekly");
    render(<QuizResultIsland />);

    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: "Send my plan" }));

    await waitFor(() =>
      expect(screen.getByText("Your 7 days")).toBeInTheDocument()
    );
    expect(screen.getAllByText(/08:00/)).toHaveLength(7);
    expect(screen.getByText("14 days of PRO, free")).toBeInTheDocument();
    // The code itself is never shown on the page — only in the email.
    expect(screen.queryByText("12345")).not.toBeInTheDocument();
    expect(screen.getByText(/sent your code to your email/i)).toBeInTheDocument();
  });

  it("stores the unlock flag and the per-lead code — never the answers — and skips the gate on return", async () => {
    stubLocation("?p=panic");
    const first = render(<QuizResultIsland />);

    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: "Send my plan" }));
    await waitFor(() =>
      expect(screen.getByText("Your 7 days")).toBeInTheDocument()
    );

    expect(Object.keys(window.localStorage).sort()).toEqual([
      "calmisu_quiz_promo_code",
      "calmisu_quiz_promo_expires",
      "calmisu_quiz_unlocked",
    ]);
    expect(window.localStorage.getItem("calmisu_quiz_promo_code")).toBe(
      "12345"
    );
    first.unmount();

    render(<QuizResultIsland />);
    expect(screen.getByText("Your 7 days")).toBeInTheDocument();
    expect(
      screen.queryByText("Your 7-day plan is ready")
    ).not.toBeInTheDocument();
    // Returning visitor still isn't shown the code — only that it exists.
    expect(screen.getByText(/sent your code to your email/i)).toBeInTheDocument();
  });

  it("degrades to pointing at email when the unlock flag exists but no code was stored (pre-change visitor)", async () => {
    stubLocation("?p=panic");
    try {
      window.localStorage.setItem("calmisu_quiz_unlocked", "true");
    } catch {
      /* empty */
    }

    render(<QuizResultIsland />);
    expect(screen.getByText("Your 7 days")).toBeInTheDocument();
    expect(
      screen.getByText(/Check your email for your code/i)
    ).toBeInTheDocument();
  });

  it("surfaces a server error instead of unlocking", async () => {
    vi.mocked(postLead).mockRejectedValueOnce(new Error("Service unavailable"));
    stubLocation("?p=anxiety");
    render(<QuizResultIsland />);

    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: "Send my plan" }));

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent("Service unavailable")
    );
    expect(screen.queryByText("Your 7 days")).not.toBeInTheDocument();
    expect(window.localStorage.length).toBe(0);
  });

  it("always shows the not-a-substitute disclaimer", () => {
    stubLocation("?p=panic");
    render(<QuizResultIsland />);
    expect(screen.getByText(/not a substitute for professional/i)).toBeInTheDocument();
  });
});
