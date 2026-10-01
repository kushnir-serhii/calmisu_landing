import { useEffect, useRef, useState } from "react";
import { questions } from "@/data/quiz";
import { encodePlan, type Answers } from "@/lib/quiz";
import { track } from "@/lib/analytics";
import { SelectCard } from "@/components/ui/SelectCard";
import { Button } from "@/components/ui/button";

/**
 * The Calm Profile quiz.
 *
 * Card styling deliberately mirrors the mobile app's onboarding reason screen
 * (CardWrapper + the blue.100/blue.300 selected state), so a visitor who
 * installs meets the same screen twice. Q1 even reuses the app's own icons,
 * copied into public/images/quiz/.
 *
 * Answers live in this component's state and nowhere else — no localStorage,
 * no sessionStorage, no cookie. Q4 and Q5 are health data under GDPR Art. 9;
 * keeping them in memory, and sending only the derived profile to the server,
 * is the whole mitigation. See context/spec/008-calm-profile-quiz/SPEC.md.
 *
 * The island owns two phases: a server-rendered intro (see quiz.astro) stays
 * in the DOM for SEO/first paint, and this component renders only a Start CTA
 * over it until the visitor commits — the questions themselves only render
 * once `phase` flips to "quiz".
 *
 * The progress rail itself is NOT rendered here — it lives in Header.astro
 * (see its `progress` prop). It has to scroll-lock with the header, and the
 * header is the only sticky element on the page, so a rail owned by this
 * island would separate from it the moment the page scrolls. Instead this
 * component just writes the `--quiz-progress` CSS var and updates the
 * header's rail element directly via `document.querySelector`.
 */

interface Props {
  /** Where the visitor entered from — passed through to `quiz_start`. Only a
   *  fallback: quiz.astro is statically built, so `Astro.url.searchParams`
   *  is always empty at build time and this prop is always "direct". The
   *  real value is read from `window.location.search` on mount (see the
   *  effect below) and kept in `sourceRef`. */
  source?: string;
}

export default function QuizIsland({ source = "direct" }: Props) {
  const [phase, setPhase] = useState<"intro" | "quiz">("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const headingRef = useRef<HTMLHeadingElement>(null);
  // Steps whose quiz_question_answered has already fired. In-memory only —
  // never persisted, alongside answers themselves (see the class doc above).
  // Without this, Back then re-answering the same question double-counts it.
  const trackedSteps = useRef<Set<number>>(new Set());
  // A double tap on the last single-select option must not fire quiz_complete
  // twice; reset by the pageshow effect below when bfcache restores this page.
  const completingRef = useRef(false);
  // Mirrors `step` for the popstate handler, which closes over a stale value
  // otherwise (it's registered once per "quiz" phase, not per step).
  const stepRef = useRef(step);
  stepRef.current = step;
  // quiz_start must fire only on the first start of this page view —
  // returning to the intro and pressing Start again must not double-count it.
  const startedRef = useRef(false);
  // The real `src`, resolved client-side (see the Props doc above). Starts
  // as the (always "direct") prop and is corrected in the mount effect
  // before anything tracks quiz_start.
  const sourceRef = useRef(source);

  const question = questions[step];
  const total = questions.length;
  const selected = answers[question.id];
  const multiSelection = Array.isArray(selected) ? selected : [];

  useEffect(() => {
    // Each question replaces the last in place, so without this a screen reader
    // announces nothing and keyboard focus is left on a button that no longer
    // exists. Skipped on the first question so starting the quiz doesn't yank
    // focus away right as the back-row above it settles in.
    if (phase === "quiz" && step > 0) headingRef.current?.focus();
  }, [phase, step]);

  useEffect(() => {
    // The rail lives in the header (see the class doc comment above), so it
    // is driven from here via a CSS var plus a direct DOM update rather than
    // as JSX this component owns.
    if (phase !== "quiz") return;
    document.documentElement.style.setProperty(
      "--quiz-progress",
      `${((step + 1) / total) * 100}%`,
    );
    const el = document.querySelector("[data-quiz-progress]");
    if (!el) return; // Tests render the island without the header present.
    el.setAttribute("aria-valuenow", String(step + 1));
    el.setAttribute("aria-valuemax", String(total));
    el.setAttribute("aria-label", `Question ${step + 1} of ${total}`);
  }, [phase, step, total]);

  useEffect(() => {
    // Resolves the real `src` and pre-fills Q1 from a blog teaser tile
    // (see src/components/blog/QuizTeaser.astro), which deep-links to
    // `/quiz/?src=...&reason=<optionId>`. Runs once on mount, before the
    // intro would otherwise flash: quiz.astro's own inline script already
    // set `data-quiz-started` synchronously in this case, so this effect
    // only has to make the React state agree with what's on screen.
    const params = new URLSearchParams(window.location.search);
    const urlSource = params.get("src");
    if (urlSource) sourceRef.current = urlSource;

    const reason = params.get("reason");
    const validReasonIds = questions[0].options.map((option) => option.id);
    if (reason && validReasonIds.includes(reason)) {
      setAnswers({ [questions[0].id]: reason });
      if (!startedRef.current) {
        startedRef.current = true;
        track("quiz_start", { src: sourceRef.current });
      }
      trackedSteps.current.add(0);
      track("quiz_question_answered", {
        index: 1,
        question_id: questions[0].id,
      });
      setPhase("quiz");
      setStep(1);
      document.documentElement.dataset.quizStarted = "true";

      // Strip `reason` so reloading (or Back landing back here) doesn't
      // re-apply it and re-fire these events; `src` stays for attribution.
      params.delete("reason");
      const query = params.toString();
      window.history.replaceState(
        window.history.state,
        "",
        `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`,
      );
    }
    // `/quiz/?start=1` skips the intro and lands on Q1 with nothing pre-filled
    // — the shareable "straight into the quiz" link (homepage banner CTA).
    else if (params.get("start") === "1") {
      if (!startedRef.current) {
        startedRef.current = true;
        track("quiz_start", { src: sourceRef.current });
      }
      setPhase("quiz");
      document.documentElement.dataset.quizStarted = "true";

      // Strip `start` so a reload or Back doesn't re-fire quiz_start.
      params.delete("start");
      const query = params.toString();
      window.history.replaceState(
        window.history.state,
        "",
        `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`,
      );
    }
    // Mount-only: this is a one-time read of the entry URL.
  }, []);

  useEffect(() => {
    // bfcache can restore this exact page on a Back navigation from the
    // result page, with `completingRef` still set from the tap that left it —
    // without resetting it here, the last question would be stuck un-tappable.
    const onPageShow = (e: Event) => {
      if ((e as PageTransitionEvent).persisted) completingRef.current = false;
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  useEffect(() => {
    // One "guard" history entry, re-pushed after each pop: the system back
    // gesture / browser Back then steps back a question instead of dropping
    // the visitor out of the quiz mid-way. On question 1 it returns to the
    // intro instead (answers stay in memory), and one more Back leaves as
    // normal, since there is no further guard entry to consume.
    if (phase !== "quiz") return;

    const pushGuard = () => {
      try {
        window.history.pushState({ calmisuQuiz: true }, "");
      } catch {
        // Sandboxed or stubbed history — the gesture just leaves as normal.
      }
    };
    pushGuard();

    const onPopState = () => {
      if (stepRef.current > 0) {
        setStep((s) => Math.max(0, s - 1));
        pushGuard();
      } else {
        setPhase("intro");
        delete document.documentElement.dataset.quizStarted;
        window.scrollTo({ top: 0 });
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [phase]);

  /** Leaves the intro and fires the start event on actual start, not on mount. */
  const start = () => {
    if (!startedRef.current) {
      startedRef.current = true;
      track("quiz_start", { src: sourceRef.current });
    }
    setPhase("quiz");
    document.documentElement.dataset.quizStarted = "true";
    window.scrollTo({ top: 0 });
  };

  /** Commits the last answer, then leaves for the result page. */
  const complete = (finalAnswers: Answers) => {
    if (completingRef.current) return;
    completingRef.current = true;
    const query = encodePlan(finalAnswers);
    track("quiz_complete", {
      profile: new URLSearchParams(query).get("p") ?? "unknown",
    });
    window.location.href = `/quiz/result/?${query}`;
  };

  const advance = (finalAnswers: Answers) => {
    if (!trackedSteps.current.has(step)) {
      trackedSteps.current.add(step);
      track("quiz_question_answered", {
        index: step + 1,
        question_id: question.id,
      });
    }
    if (step < total - 1) setStep(step + 1);
    else complete(finalAnswers);
  };

  const choose = (optionId: string) => {
    if (question.multi) {
      setAnswers((prev) => {
        const current = Array.isArray(prev[question.id])
          ? (prev[question.id] as string[])
          : [];
        return {
          ...prev,
          [question.id]: current.includes(optionId)
            ? current.filter((id) => id !== optionId)
            : [...current, optionId],
        };
      });
      return;
    }

    // Single-select advances on tap. `next` is passed through rather than read
    // back from state, which wouldn't have updated yet on the final question.
    const next = { ...answers, [question.id]: optionId };
    setAnswers(next);
    advance(next);
  };

  const isChosen = (optionId: string) =>
    question.multi ? multiSelection.includes(optionId) : selected === optionId;

  if (phase === "intro") {
    return (
      <div className="w-full max-w-[640px] mx-auto flex flex-col items-center">
        <Button variant="dark" onClick={start}>
          Start the quiz
        </Button>
        <p className="mt-6 text-center text-muted-foreground font-body text-sm font-light">
          Free · No account needed · Not a diagnosis
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[640px] mx-auto min-h-[calc(100svh-var(--header-h,64px))] flex flex-col justify-start pt-5 sm:pt-8 pb-6">
      {/* Back + counter, directly above the question */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="shrink-0 -ml-2 px-2 min-h-11 flex items-center text-muted-foreground hover:text-foreground disabled:opacity-0 disabled:pointer-events-none transition-colors font-body text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
        >
          <span aria-hidden="true">←</span> Back
        </button>
        <span className="shrink-0 text-muted-foreground font-body text-sm tabular-nums">
          {step + 1} of {total}
        </span>
      </div>

      {/* Fixed-height so the options below start at the same y on every
          question, whether or not this one has a subtitle. */}
      <div className="flex flex-col justify-center min-h-[92px] sm:min-h-[104px]">
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="text-foreground font-display text-2xl sm:text-3xl font-normal leading-[110%] text-center outline-none"
        >
          {question.question}
        </h2>
        <p className="mt-2 text-muted-foreground text-center font-body text-sm sm:text-base font-light">
          {question.subtitle ?? " "}
        </p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-1.5 mt-5 sm:mt-6">
        {question.options.map((option) => {
          const chosen = isChosen(option.id);
          return (
            <SelectCard
              key={option.id}
              selected={chosen}
              onClick={() => choose(option.id)}
              icon={option.icon}
              indicator={question.multi}
              aria-pressed={chosen}
            >
              {option.label}
            </SelectCard>
          );
        })}
      </div>

      {/* Multi-select needs an explicit commit; single-select advances on tap.
          These sit directly after the options rather than pinned to the
          bottom, so they land at a predictable place regardless of how many
          options the question above has. */}
      {question.multi && (
        <Button
          variant="dark"
          className="mt-4 w-full"
          onClick={() => advance(answers)}
        >
          {multiSelection.length === 0 ? "Skip this one" : "Continue"}
        </Button>
      )}

      <p className="mt-4 text-center text-muted-foreground font-body text-xs font-light">
        Your answers stay on this device. We never store them.
      </p>
    </div>
  );
}
