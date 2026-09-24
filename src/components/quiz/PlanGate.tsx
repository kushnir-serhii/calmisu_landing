import type { FormEvent } from "react";
import { SectionHeading } from "@/components/ui/Section";
import { SelectCard } from "@/components/ui/SelectCard";
import { Button } from "@/components/ui/button";

interface PlanGateProps {
  platform: "ios" | "android";
  onPlatformChange: (platform: "ios" | "android") => void;
  email: string;
  onEmailChange: (email: string) => void;
  consent: boolean;
  onConsentChange: (consent: boolean) => void;
  status: "idle" | "loading" | "error";
  error: string;
  onSubmit: (e: FormEvent) => void;
}

/**
 * Section B — the gate. "Your 7-day plan is ready": platform-dependent
 * intro, platform picker, email + consent, submit. State and the actual
 * submit logic stay in QuizResultIsland; this only renders the box.
 */
export const PlanGate = ({
  platform,
  onPlatformChange,
  email,
  onEmailChange,
  consent,
  onConsentChange,
  status,
  error,
  onSubmit,
}: PlanGateProps) => {
  return (
    <div className="mt-12 sm:mt-16 p-6 sm:p-8 rounded-2xl bg-brand-100">
      <SectionHeading size="block" className="text-foreground text-center">
        Your 7-day plan is ready
      </SectionHeading>
      <p className="mt-3 text-foreground font-body text-base font-light text-center leading-[150%]">
        {platform === "ios"
          ? "Tell us where to send it. We'll also let you know the moment Calmisu lands on the App Store."
          : "Tell us where to send it. You'll also get a personal code for 14 days of Calmisu PRO — free, no card. You'll have 7 days to activate it."}
      </p>

      <form
        onSubmit={onSubmit}
        aria-busy={status === "loading"}
        className="mt-6 flex flex-col gap-4"
      >
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
                { value: "android", label: "Android" },
                { value: "ios", label: "iPhone" },
              ] as const
            ).map((option) => {
              const chosen = platform === option.value;
              return (
                <SelectCard
                  key={option.value}
                  align="center"
                  selected={chosen}
                  onClick={() => onPlatformChange(option.value)}
                  role="radio"
                  aria-checked={chosen}
                  indicator
                >
                  {option.label}
                </SelectCard>
              );
            })}
          </div>
        </div>

        <input
          type="email"
          id="quiz-email"
          name="email"
          required
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="Enter your email address"
          aria-label="Email address"
          autoComplete="email"
          inputMode="email"
          autoCapitalize="none"
          spellCheck={false}
          maxLength={254}
          aria-invalid={status === "error" || undefined}
          aria-describedby={status === "error" ? "quiz-gate-error" : undefined}
          className="w-full px-5 py-3.5 bg-white border-2 border-control-border rounded-2xl focus:outline-none focus:border-brand focus-visible:ring-2 focus-visible:ring-ring transition-colors font-body text-foreground placeholder:text-muted-foreground"
        />

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => onConsentChange(e.target.checked)}
            className="mt-1 w-5 h-5 shrink-0 rounded accent-brand cursor-pointer"
          />
          {/* This sentence is a factual claim about what the backend
              stores. If the Lead schema changes, change this with it. */}
          <span className="text-muted-foreground font-body text-sm font-normal leading-[150%]">
            Email me my plan and occasional tips about anxiety. We store
            your email, your profile name, and which phone you use —
            never your answers. Unsubscribe any time.
          </span>
        </label>

        {status === "error" && (
          <p
            id="quiz-gate-error"
            className="text-destructive-text font-body text-sm"
            role="alert"
          >
            {error}
          </p>
        )}

        <Button
          type="submit"
          variant="black"
          size="xl"
          className="w-full"
          disabled={status === "loading" || !consent}
          aria-describedby={!consent ? "quiz-gate-consent-hint" : undefined}
        >
          {status === "loading" ? "Sending…" : "Send my plan"}
        </Button>

        {!consent && (
          <p
            id="quiz-gate-consent-hint"
            className="text-center text-muted-foreground font-body text-sm"
          >
            Tick the box above to get your plan.
          </p>
        )}

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
  );
};
