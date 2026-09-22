import { useEffect, useRef, useState } from "react";
import { questions } from "@/data/quiz";
import { encodePlan, type Answers } from "@/lib/quiz";
import { track } from "@/lib/analytics";

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
  /** Where the visitor entered from — passed through to `quiz_start`. */
  source?: string;
}

export default function QuizIsland({ source = "direct" }: Props) {
  const [phase, setPhase] = useState<"intro" | "quiz">("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const headingRef = useRef<HTMLHeadingElement>(null);

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
      `${((step + 1) / total) * 100}%`
    );
    const el = document.querySelector("[data-quiz-progress]");
    if (!el) return; // Tests render the island without the header present.
    el.setAttribute("aria-valuenow", String(step + 1));
    el.setAttribute("aria-valuemax", String(total));
    el.setAttribute("aria-label", `Question ${step + 1} of ${total}`);
  }, [phase, step, total]);

  /** Leaves the intro and fires the start event on actual start, not on mount. */
  const start = () => {
    track("quiz_start", { src: source });
    setPhase("quiz");
    document.documentElement.dataset.quizStarted = "true";
    window.scrollTo({ top: 0 });
  };

  /** Commits the last answer, then leaves for the result page. */
  const complete = (finalAnswers: Answers) => {
    const query = encodePlan(finalAnswers);
    track("quiz_complete", {
      profile: new URLSearchParams(query).get("p") ?? "unknown",
    });
    window.location.href = `/quiz/result/?${query}`;
  };

  const advance = (finalAnswers: Answers) => {
    track("quiz_question_answered", {
      index: step + 1,
      question_id: question.id,
    });
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
    question.multi
      ? multiSelection.includes(optionId)
      : selected === optionId;

  if (phase === "intro") {
    return (
      <div className="w-full max-w-[640px] mx-auto flex flex-col items-center">
        <button
          type="button"
          onClick={start}
          className="bg-brand text-white font-body text-lg px-10 py-4 rounded-2xl hover:bg-brand-dark transition-colors"
        >
          Start the quiz
        </button>
        <p className="mt-6 text-center text-muted-foreground font-body text-sm font-light">
          Your answers stay on this device. We never store them.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[640px] mx-auto h-[calc(100svh-var(--header-h,64px))] flex flex-col justify-start pt-5 sm:pt-8 pb-6">
      {/* Back + counter, directly above the question */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="shrink-0 text-muted-foreground hover:text-foreground disabled:opacity-0 disabled:pointer-events-none transition-colors font-body text-sm"
          aria-label="Previous question"
        >
          ← Back
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
            <button
              key={option.id}
              type="button"
              onClick={() => choose(option.id)}
              aria-pressed={question.multi ? chosen : undefined}
              className={[
                "flex items-center gap-3 w-full px-4 py-3 rounded-xl border-2 text-left",
                "transition-all duration-150 active:scale-[0.99]",
                chosen
                  ? "bg-white border-brand"
                  : "bg-white border-gray-100 hover:border-brand-200",
              ].join(" ")}
            >
              {option.icon && (
                <img
                  src={option.icon}
                  alt=""
                  width={36}
                  height={36}
                  className="w-9 h-9 shrink-0"
                  loading="eager"
                />
              )}
              <span className="font-body text-base sm:text-[17px] text-foreground">
                {option.label}
              </span>
              {question.multi && (
                <span
                  aria-hidden="true"
                  className={[
                    "ml-auto shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center",
                    chosen
                      ? "bg-brand border-brand text-white"
                      : "border-gray-100",
                  ].join(" ")}
                >
                  {chosen && (
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        d="M5 13l4 4L19 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Multi-select needs an explicit commit; single-select advances on tap.
          These sit directly after the options rather than pinned to the
          bottom, so they land at a predictable place regardless of how many
          options the question above has. */}
      {question.multi && (
        <button
          type="button"
          onClick={() => advance(answers)}
          className="mt-4 w-full bg-brand text-white font-body text-lg py-3.5 rounded-2xl hover:bg-brand-dark transition-colors"
        >
          {multiSelection.length === 0 ? "Skip this one" : "Continue"}
        </button>
      )}

      <p className="mt-4 text-center text-muted-foreground font-body text-xs font-light">
        Your answers stay on this device. We never store them.
      </p>
    </div>
  );
}
