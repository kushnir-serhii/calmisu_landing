import { useEffect, useMemo, useRef, useState } from "react";
import { FREQUENCY_LINES, TOOL_LABELS, profiles, type Tool } from "@/data/quiz";
import { buildPlan, decodePlan, recommendedTools } from "@/lib/quiz";
import { postLead } from "@/lib/api";
import { track } from "@/lib/analytics";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/Section";
import { Button } from "@/components/ui/button";
import { NumberedCard, InfoPanel } from "./ResultParts";
import { PlanGate } from "./PlanGate";
import { PLAY_URL } from "@/constants/links";

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

// Guards the fallback timer/listeners across calls — a second tap must not
// stack two redirects on top of each other.
let pendingFallback: number | null = null;
let pendingCleanup: (() => void) | null = null;

/**
 * Opens the app, falling back to the Play listing when nothing handles the
 * scheme. The app's linking config currently maps only auth routes — there are
 * no per-activity deep links yet — so this opens the app at its default screen.
 * Once the app adds activity routes, extend the scheme URL here.
 *
 * If the app takes over, the page is backgrounded (visibilitychange → hidden)
 * or torn down (pagehide) before the timer fires; either cancels the
 * fallback. Neither listener uses `once` — the first visibilitychange can be
 * a "visible" event (e.g. a permission prompt), which would otherwise disarm
 * the cancel before the app ever opens.
 */
function openApp(tool: Tool, day: number, profile: string) {
  track("quiz_app_click", { profile, tool, day });

  // A previous tap's timer/listeners may still be pending; clear them first
  // so this call doesn't end up racing a stale redirect.
  pendingCleanup?.();

  const onVisibilityChange = () => {
    if (document.visibilityState === "hidden") cleanup();
  };
  // Cancels the fallback too — the whole point of the listeners.
  const cleanup = () => {
    if (pendingFallback !== null) window.clearTimeout(pendingFallback);
    pendingFallback = null;
    document.removeEventListener("visibilitychange", onVisibilityChange);
    window.removeEventListener("pagehide", cleanup);
    pendingCleanup = null;
  };

  pendingFallback = window.setTimeout(() => {
    cleanup();
    window.location.href = PLAY_URL;
  }, 1500);
  pendingCleanup = cleanup;

  document.addEventListener("visibilitychange", onVisibilityChange);
  window.addEventListener("pagehide", cleanup);

  window.location.href = "calmisu://";
}

/** Null for a missing or unparseable date — storage can hold anything. */
function parseDeadline(iso: string | null): Date | null {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDeadline(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
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
  // Guards against a double tap on "Send my plan" firing two submits.
  const submittingRef = useRef(false);

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
        <Button asChild variant="black" size="xl" className="mt-8">
          <a href="/quiz/">Take the quiz</a>
        </Button>
      </div>
    );
  }

  const content = profiles[state.profile];
  const [toolA, toolB] = recommendedTools(state);
  const plan = buildPlan(state);
  const deadline = parseDeadline(promoExpiresAt);
  const codeExpired = deadline !== null && deadline.getTime() < Date.now();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent || submittingRef.current) return;
    submittingRef.current = true;
    setStatus("loading");
    setError("");

    try {
      const result = await postLead({
        email: email.trim(),
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
    } finally {
      submittingRef.current = false;
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
        <SectionHeading size="block">Why this happens</SectionHeading>
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
        <SectionHeading size="block">Your two tools</SectionHeading>
        <div className="mt-5 flex flex-col gap-3">
          {[toolA, toolB].map((tool, i) => (
            <NumberedCard
              key={tool}
              badge={<span className="font-medium">{i + 1}</span>}
              title={TOOL_LABELS[tool]}
            >
              {content.toolNotes[tool]}
            </NumberedCard>
          ))}
        </div>
      </div>

      {/* ── Section B — the gate ────────────────────────────────────── */}
      {!unlocked && (
        <PlanGate
          platform={platform}
          onPlatformChange={choosePlatform}
          email={email}
          onEmailChange={(value) => {
            setEmail(value);
            if (status === "error") setStatus("idle");
          }}
          consent={consent}
          onConsentChange={setConsent}
          status={status}
          error={error}
          onSubmit={handleSubmit}
        />
      )}

      {/* ── Section C — the plan ────────────────────────────────────── */}
      {unlocked && (
        <div ref={planRef} className="mt-12 sm:mt-16 scroll-mt-24">
          <SectionHeading size="block">Your 7 days</SectionHeading>
          <p className="mt-3 text-muted-foreground font-body text-base font-light leading-[150%]">
            {FREQUENCY_LINES[state.frequency]}
          </p>
          <p className="mt-2 text-foreground font-body text-base font-light leading-[150%]">
            {content.planIntro}
          </p>

          <ul className="mt-6 flex flex-col gap-2 list-none p-0 m-0">
            {plan.map((day) => (
              <li key={day.day}>
                <NumberedCard
                  className="items-center gap-4 p-4 sm:p-5"
                  badgeClassName="w-10 h-10 flex-col leading-none text-sm"
                  badge={
                    <>
                      <span className="text-xs opacity-70">Day</span>
                      <span className="font-medium">{day.day}</span>
                    </>
                  }
                  title={day.label}
                  titleClassName="text-base sm:text-lg"
                  action={
                    platform !== "ios" && (
                      <Button
                        variant="black"
                        size="pill"
                        className="shrink-0"
                        onClick={() =>
                          openApp(day.tools[0], day.day, state.profile)
                        }
                      >
                        Start
                      </Button>
                    )
                  }
                >
                  {day.time} · {day.note}
                </NumberedCard>
              </li>
            ))}
          </ul>

          {platform === "ios" ? (
            <InfoPanel title="Calmisu is coming to iOS">
              <p className="mt-2 text-foreground font-body text-base font-light leading-[150%]">
                You're on the list — we'll email you the moment it's on the App
                Store. Your plan works on its own until then. Can't find our email?
                Check your spam folder.
              </p>
            </InfoPanel>
          ) : (
            <InfoPanel
              title={codeExpired ? "Keep going in the app" : "14 days of PRO, free"}
            >
              {codeExpired ? (
                <p className="mt-4 text-foreground font-body text-base font-light leading-[150%]">
                  Your code's activation window closed on{" "}
                  {formatDeadline(deadline as Date)}. The plan above is still
                  yours to follow in the app.
                </p>
              ) : promoCode ? (
                <p className="mt-4 text-foreground font-body text-base font-light leading-[150%]">
                  We sent your code to your email — if you don't see it, check your
                  spam folder. Open Calmisu, create an
                  account, and enter it under Profile. Activate it within 7
                  days
                  {deadline ? ` — by ${formatDeadline(deadline)}` : ""}
                  . Once activated, you get 14 days of PRO from that moment.
                </p>
              ) : (
                <p className="mt-4 text-foreground font-body text-base font-light leading-[150%]">
                  Check your email for your code — we sent it to you with the
                  rest of your plan. If it's not in your inbox, check your spam
                  folder.
                </p>
              )}
              <Button asChild variant="black" size="xl" className="mt-5">
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
                >
                  Get Calmisu
                </a>
              </Button>
            </InfoPanel>
          )}
        </div>
      )}

      <p className="mt-12 text-muted-foreground font-body text-sm font-normal leading-[150%] text-center">
        Calmisu is a self-help tool, not a substitute for professional mental
        health care. If things feel unmanageable, please talk to a doctor or a
        therapist.
      </p>
    </div>
  );
}
