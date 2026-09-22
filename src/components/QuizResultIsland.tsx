import { useEffect, useMemo, useRef, useState } from "react";
import { FREQUENCY_LINES, TOOL_LABELS, profiles, type Tool } from "@/data/quiz";
import { buildPlan, decodePlan, recommendedTools } from "@/lib/quiz";
import { postLead } from "@/lib/api";
import { track } from "@/lib/analytics";
import { Badge } from "./ui/badge";

const PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.calmisu.app";
const UNLOCK_KEY = "calmisu_quiz_unlocked";
// Per-lead code + its activation deadline, persisted alongside the unlock
// flag so a returning visitor sees their own code, not a shared placeholder.
// Storing the code is fine — it is not health data. Storing quiz answers is;
// nothing here may start doing that.
const CODE_KEY = "calmisu_quiz_promo_code";
const CODE_EXPIRY_KEY = "calmisu_quiz_promo_expires";

/**
 * Result page: the profile is free, the plan is traded for an email.
 *
 * Everything the page renders comes from the query string — there is no server
 * and no stored plan — so a hand-edited or truncated URL has to degrade
 * gracefully rather than error. `decodePlan` handles that and returns null only
 * when there is genuinely nothing to show.
 *
 * The gate is soft by design: the unlock flag lives in localStorage so the link
 * in the email reopens the plan without asking again. Anyone determined can set
 * that flag themselves; hardening it would need SSR this site doesn't have.
 * Only the flag is stored — never the answers.
 */

/** iOS can't install the app yet, so the whole CTA layer changes for it. */
function useIsIOS() {
  const [isIOS, setIsIOS] = useState(false);
  useEffect(() => {
    const ua = navigator.userAgent;
    setIsIOS(
      /iPad|iPhone|iPod/.test(ua) ||
        // iPadOS 13+ reports as a Mac; the touch point count gives it away.
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1),
    );
  }, []);
  return isIOS;
}

/**
 * Opens the app, falling back to the Play listing when nothing handles the
 * scheme. The app's linking config currently maps only auth routes — there are
 * no per-activity deep links yet — so this opens the app at its default screen.
 * Once the app adds activity routes, extend the scheme URL here.
 */
function openApp(tool: Tool, day: number, profile: string) {
  track("quiz_app_click", { profile, tool, day });

  const timer = window.setTimeout(() => {
    window.location.href = PLAY_URL;
  }, 1500);

  // If the app takes over, the page is backgrounded before the timer fires.
  const cancel = () => {
    if (document.visibilityState === "hidden") window.clearTimeout(timer);
  };
  document.addEventListener("visibilitychange", cancel, { once: true });

  window.location.href = "calmisu://";
}

export default function QuizResultIsland() {
  const isIOS = useIsIOS();
  const [unlocked, setUnlocked] = useState(false);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [promoExpiresAt, setPromoExpiresAt] = useState<string | null>(null);
  const planRef = useRef<HTMLDivElement>(null);

  // The visitor's stated phone, not a UA guess — `isIOS` is only the default
  // this starts from. Track whether they've made an explicit choice so the
  // UA sniff resolving later never clobbers it.
  const [platform, setPlatform] = useState<"ios" | "android">(
    isIOS ? "ios" : "android",
  );
  const platformTouchedRef = useRef(false);
  useEffect(() => {
    if (platformTouchedRef.current) return;
    setPlatform(isIOS ? "ios" : "android");
  }, [isIOS]);
  const choosePlatform = (next: "ios" | "android") => {
    platformTouchedRef.current = true;
    setPlatform(next);
  };

  const state = useMemo(() => {
    if (typeof window === "undefined") return null;
    return decodePlan(new URLSearchParams(window.location.search));
  }, []);

  useEffect(() => {
    if (!state) return;
    let returning = false;
    try {
      returning = window.localStorage.getItem(UNLOCK_KEY) === "true";
      if (returning) {
        // A visitor who unlocked before per-lead codes shipped has the flag
        // but no stored code — Section C degrades to pointing them at their
        // email rather than showing nothing or a stale/fake code.
        setPromoCode(window.localStorage.getItem(CODE_KEY));
        setPromoExpiresAt(window.localStorage.getItem(CODE_EXPIRY_KEY));
      }
    } catch {
      // Private mode or blocked storage — the gate simply shows again.
    }
    setUnlocked(returning);
    track("quiz_plan_view", { profile: state.profile, returning });
  }, [state]);

  if (!state) {
    return (
      <div className="w-full max-w-[640px] mx-auto text-center py-12">
        <h1 className="text-foreground font-display text-3xl sm:text-4xl font-normal leading-[110%]">
          We could not find that plan
        </h1>
        
        <p className="mt-4 text-muted-foreground font-body text-base font-light">
          The link may be incomplete. The quiz takes about two minutes — your
          profile will be right back.
        </p>
        <a
          href="/quiz/"
          className="inline-block mt-8 bg-brand text-white font-body text-lg px-8 py-4 rounded-2xl hover:bg-brand-dark transition-colors no-underline"
        >
          Take the quiz
        </a>
      </div>
    );
  }

  const content = profiles[state.profile];
  const [toolA, toolB] = recommendedTools(state);
  const plan = buildPlan(state);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) return;
    setStatus("loading");
    setError("");

    try {
      const result = await postLead({
        email,
        profile: state.profile,
        source: "quiz",
        platform,
        locale: "en",
        consent,
        plan: {
          t: state.timing,
          d: state.duration,
          c: state.context,
          m: state.modality,
          f: state.frequency,
        },
      });
      track("quiz_email_submit", { profile: state.profile });
      setPromoCode(result.promoCode);
      setPromoExpiresAt(result.promoExpiresAt);
      try {
        window.localStorage.setItem(UNLOCK_KEY, "true");
        if (result.promoCode) window.localStorage.setItem(CODE_KEY, result.promoCode);
        if (result.promoExpiresAt) {
          window.localStorage.setItem(CODE_EXPIRY_KEY, result.promoExpiresAt);
        }
      } catch {
        // Not being able to remember the unlock/code is harmless — the plan
        // still renders for this visit.
      }
      setUnlocked(true);
      setStatus("idle");
      // Nicety only, and it runs detached in a rAF where a throw would be
      // uncaught — so never let a missing implementation break the unlock.
      window.requestAnimationFrame(() => {
        try {
          planRef.current?.scrollIntoView?.({
            behavior: "smooth",
            block: "start",
          });
        } catch {
          /* empty */
        }
      });
    } catch (err) {
      track("quiz_email_error", { profile: state.profile });
      setStatus("error");
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <div className="w-full max-w-[680px] mx-auto">
      {/* ── Section A — the profile. Never gated. ───────────────────── */}
      <div className="text-center">
        <Badge
          className="text-brand-dark font-body text-sm sm:text-base uppercase tracking-wide"
        >
          Your pattern
        </Badge>
        <h1 className="mt-3 text-foreground font-display text-4xl sm:text-5xl md:text-6xl font-normal leading-[95%]">
          {content.name}
        </h1>
        <p className="mt-4 text-foreground font-body text-lg sm:text-xl font-light leading-[150%]">
          {content.subtitle}
        </p>
      </div>

      <div className="mt-10 sm:mt-12 flex flex-col gap-5">
        <h2 className="text-foreground font-display text-2xl sm:text-3xl font-normal">
          Why this happens
        </h2>
        {content.why.map((paragraph, i) => (
          <p
            key={i}
            className="text-foreground font-body text-base sm:text-lg font-light leading-[160%]"
          >
            {paragraph}
          </p>
        ))}
      </div>

      <div className="mt-10 sm:mt-12">
        <h2 className="text-foreground font-display text-2xl sm:text-3xl font-normal">
          Your two tools
        </h2>
        <div className="mt-5 flex flex-col gap-3">
          {[toolA, toolB].map((tool, i) => (
            <div
              key={tool}
              className="flex gap-4 p-5 rounded-xl border-2 border-gray-100 bg-white"
            >
              <span className="shrink-0 w-8 h-8 rounded-full bg-brand-100 text-brand-dark font-body font-medium flex items-center justify-center">
                {i + 1}
              </span>
              <div>
                <p className="font-body text-lg text-foreground">
                  {TOOL_LABELS[tool]}
                </p>
                <p className="mt-1 text-muted-foreground font-body text-base font-light leading-[150%]">
                  {content.toolNotes[tool]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section B — the gate ────────────────────────────────────── */}
      {!unlocked && (
        <div className="mt-12 sm:mt-16 p-6 sm:p-8 rounded-2xl bg-brand-100">
          <h2 className="text-foreground font-display text-2xl sm:text-3xl font-normal text-center">
            Your 7-day plan is ready
          </h2>
          <p className="mt-3 text-foreground font-body text-base font-light text-center leading-[150%]">
            {platform === "ios"
              ? "Tell us where to send it. We'll also let you know the moment Calmisu lands on the App Store."
              : "Tell us where to send it. You'll also get a personal code for 14 days of Calmisu PRO — free, no card. You'll have 15 days to activate it."}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div>
              <span
                id="quiz-platform-label"
                className="block mb-2 text-foreground font-body text-sm font-medium"
              >
                Which phone do you use?
              </span>
              <div
                role="radiogroup"
                aria-labelledby="quiz-platform-label"
                className="grid grid-cols-2 gap-4"
              >
                {(
                  [
                    { value: "ios", label: "iPhone" },
                    { value: "android", label: "Android" },
                  ] as const
                ).map((option) => {
                  const chosen = platform === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="radio"
                      aria-checked={chosen}
                      onClick={() => choosePlatform(option.value)}
                      className={[
                        "flex items-center justify-center gap-3 w-full px-4 py-3 rounded-xl border-2 text-center",
                        "transition-all duration-150 active:scale-[0.99]",
                        chosen
                          ? "bg-white border-brand"
                          : "bg-white border-gray-100 hover:border-brand-200",
                      ].join(" ")}
                    >
                      <span className="font-body text-base sm:text-[17px] text-foreground">
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              aria-label="Email address"
              className="w-full px-5 py-3.5 bg-white border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-brand-300 transition-colors font-body text-foreground placeholder:text-muted-foreground"
            />

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 w-5 h-5 shrink-0 rounded accent-brand cursor-pointer"
              />
              {/* This sentence is a factual claim about what the backend
                  stores. If the Lead schema changes, change this with it. */}
              <span className="text-muted-foreground font-body text-sm font-light leading-[150%]">
                Email me my plan and occasional tips about anxiety. We store
                your email, your profile name, and which phone you use —
                never your answers. Unsubscribe any time.
              </span>
            </label>

            {status === "error" && (
              <p className="text-destructive font-body text-sm" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading" || !consent}
              className="w-full bg-brand text-white font-body text-lg py-4 rounded-2xl hover:bg-brand-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "loading" ? "Sending..." : "Send my plan"}
            </button>

            {/* Outside the <label> on purpose — a link inside it would toggle
                the checkbox on click as well as follow the href. */}
            <p className="text-center text-muted-foreground font-body text-sm font-light">
              No spam. No card. Unsubscribe in one click. See our{" "}
              <a
                href="/en/privacy-policy/"
                className="underline hover:text-foreground transition-colors"
              >
                privacy policy
              </a>
              .
            </p>
          </form>
        </div>
      )}

      {/* ── Section C — the plan ────────────────────────────────────── */}
      {unlocked && (
        <div ref={planRef} className="mt-12 sm:mt-16 scroll-mt-24">
          <h2 className="text-foreground font-display text-2xl sm:text-3xl font-normal">
            Your 7 days
          </h2>
          <p className="mt-3 text-muted-foreground font-body text-base font-light leading-[150%]">
            {FREQUENCY_LINES[state.frequency]}
          </p>
          <p className="mt-2 text-foreground font-body text-base font-light leading-[150%]">
            {content.planIntro}
          </p>

          <ul className="mt-6 flex flex-col gap-2 list-none p-0 m-0">
            {plan.map((day) => (
              <li
                key={day.day}
                className="flex items-center gap-4 p-4 sm:p-5 rounded-xl border-2 border-gray-100 bg-white"
              >
                <span className="shrink-0 w-10 h-10 rounded-full bg-brand-100 text-brand-dark font-body text-sm flex flex-col items-center justify-center leading-none">
                  <span className="text-[10px] opacity-70">Day</span>
                  <span className="font-medium">{day.day}</span>
                </span>

                <div className="min-w-0 flex-1">
                  <p className="font-body text-base sm:text-lg text-foreground">
                    {day.label}
                  </p>
                  <p className="text-muted-foreground font-body text-sm font-light">
                    {day.time} · {day.note}
                  </p>
                </div>

                {platform !== "ios" && (
                  <button
                    type="button"
                    onClick={() =>
                      openApp(day.tools[0], day.day, state.profile)
                    }
                    className="shrink-0 px-4 py-2 rounded-full bg-brand text-white font-body text-sm hover:bg-brand-dark transition-colors"
                  >
                    Start
                  </button>
                )}
              </li>
            ))}
          </ul>

          {platform === "ios" ? (
            <div className="mt-8 p-6 rounded-2xl bg-brand-100 text-center">
              <h3 className="text-foreground font-display text-xl sm:text-2xl font-normal">
                Calmisu is coming to iOS
              </h3>
              <p className="mt-2 text-foreground font-body text-base font-light leading-[150%]">
                You're on the list — we'll email you the moment it's on the App
                Store. Your plan works on its own until then.
              </p>
            </div>
          ) : (
            <div className="mt-8 p-6 rounded-2xl bg-brand-100 text-center">
              <h3 className="text-foreground font-display text-xl sm:text-2xl font-normal">
                14 days of PRO, free
              </h3>
              {promoCode ? (
                <>
                  <p className="mt-4 font-body text-2xl tracking-[0.2em] text-brand-dark font-medium">
                    {promoCode}
                  </p>
                  <p className="mt-4 text-foreground font-body text-base font-light leading-[150%]">
                    Open Calmisu, create an account, and enter this code in
                    Profile. Activate it within 15 days
                    {promoExpiresAt
                      ? ` — by ${new Date(promoExpiresAt).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "long", day: "numeric" },
                        )}`
                      : ""}
                    . Once activated, you get 14 days of PRO from that moment.
                  </p>
                </>
              ) : (
                <p className="mt-4 text-foreground font-body text-base font-light leading-[150%]">
                  Check your email for your code — we sent it to you with the
                  rest of your plan.
                </p>
              )}
              <a
                href={PLAY_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  track("quiz_app_click", {
                    profile: state.profile,
                    tool: "store",
                    day: 0,
                  })
                }
                className="inline-block mt-5 bg-brand text-white font-body text-lg px-8 py-4 rounded-2xl hover:bg-brand-dark transition-colors no-underline"
              >
                Get Calmisu
              </a>
            </div>
          )}
        </div>
      )}

      <p className="mt-12 text-muted-foreground font-body text-sm font-light leading-[150%] text-center">
        Calmisu is a self-help tool, not a substitute for professional mental
        health care. If things feel unmanageable, please talk to a doctor or a
        therapist.
      </p>
    </div>
  );
}
