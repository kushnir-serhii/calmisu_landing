/**
 * Pure quiz logic: scoring, URL round-tripping, plan building.
 *
 * Deliberately free of React and of the DOM so it can be unit-tested directly
 * (src/test/quiz.test.ts). The result page's entire state arrives in the query
 * string — there is no server and no per-plan database row — so `decodePlan`
 * is the trust boundary and must be total: every malformed, missing or
 * out-of-range input returns null rather than throwing.
 */

import {
  DURATIONS,
  PLAN_DAYS,
  PROFILES,
  TIMINGS,
  TOOL_LABELS,
  profiles,
  questions,
  type Context,
  type Duration,
  type Modality,
  type Profile,
  type Timing,
  type Tool,
} from "@/data/quiz";

/** Answers as collected by the island: question id → option id(s). */
export type Answers = Record<string, string | string[]>;

export interface PlanState {
  profile: Profile;
  timing: Timing;
  duration: Duration;
  context: Context;
  modality: Modality;
  /** Q3 — drives the framing line only. */
  frequency: string;
}

/**
 * Defaults for every param except `p`. A truncated or hand-edited link still
 * renders a coherent plan instead of an error.
 */
const DEFAULTS = {
  timing: "evening" as Timing,
  duration: "5" as Duration,
  context: "alone" as Context,
  modality: "visual" as Modality,
  frequency: "weekly",
};

const TIMING_KEYS = Object.keys(TIMINGS) as Timing[];
const CONTEXTS: Context[] = ["alone", "people"];
const MODALITIES: Modality[] = ["voice", "visual", "hands"];
const FREQUENCIES = ["daily", "weekly", "monthly", "rare"];

function asArray(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
}

/**
 * Q1 decides the profile outright — it is the same question the app asks at
 * onboarding, so the answer is taken at face value.
 *
 * `notSure` is the one exception: rather than stranding those users on the
 * vaguest result, the weak `hint` tags on their Q4/Q5 picks get a vote. A tie,
 * or no hints at all, stays `notSure` — which is a real profile with its own
 * copy, not a failure state.
 */
export function resolveProfile(answers: Answers): Profile {
  const reason = answers.reason;
  const picked = typeof reason === "string" ? reason : undefined;

  if (picked && picked !== "notSure" && isProfile(picked)) return picked;
  if (!picked) return "notSure";

  const counts = new Map<Profile, number>();
  for (const questionId of ["body", "mind"]) {
    const question = questions.find((q) => q.id === questionId);
    if (!question) continue;
    for (const optionId of asArray(answers[questionId])) {
      const hint = question.options.find((o) => o.id === optionId)?.hint;
      if (hint) counts.set(hint, (counts.get(hint) ?? 0) + 1);
    }
  }

  let best: Profile | null = null;
  let bestCount = 0;
  let tied = false;
  for (const [profile, count] of counts) {
    if (count > bestCount) {
      best = profile;
      bestCount = count;
      tied = false;
    } else if (count === bestCount) {
      tied = true;
    }
  }

  return best && !tied ? best : "notSure";
}

function isProfile(value: string): value is Profile {
  return (PROFILES as readonly string[]).includes(value);
}

function pick<T extends string>(
  value: string | null,
  allowed: readonly T[],
  fallback: T
): T {
  return value && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : fallback;
}

/** Builds the result-page query string. Keys are short on purpose. */
export function encodePlan(answers: Answers): string {
  const profile = resolveProfile(answers);
  const get = (id: string) =>
    typeof answers[id] === "string" ? (answers[id] as string) : null;

  return new URLSearchParams({
    p: profile,
    t: pick(get("timing"), TIMING_KEYS, DEFAULTS.timing),
    d: pick(get("time"), DURATIONS, DEFAULTS.duration),
    c: pick(get("context"), CONTEXTS, DEFAULTS.context),
    m: pick(get("modality"), MODALITIES, DEFAULTS.modality),
    f: pick(get("frequency"), FREQUENCIES, DEFAULTS.frequency),
  }).toString();
}

/**
 * Total inverse of `encodePlan`. Returns null only when `p` is absent or not a
 * known profile — that is the one case where there is nothing to render and
 * the page should show its fallback instead.
 */
export function decodePlan(params: URLSearchParams): PlanState | null {
  const p = params.get("p");
  if (!p || !isProfile(p)) return null;

  return {
    profile: p,
    timing: pick(params.get("t"), TIMING_KEYS, DEFAULTS.timing),
    duration: pick(params.get("d"), DURATIONS, DEFAULTS.duration),
    context: pick(params.get("c"), CONTEXTS, DEFAULTS.context),
    modality: pick(params.get("m"), MODALITIES, DEFAULTS.modality),
    frequency: pick(params.get("f"), FREQUENCIES, DEFAULTS.frequency),
  };
}

/** Which tool a modality answer points at, for the promotion rule below. */
const MODALITY_TOOL: Record<Modality, Tool> = {
  voice: "meditation",
  visual: "breath",
  hands: "kanji",
};

/**
 * The two tools the result recommends.
 *
 * Slot one is always the app's own first tile for this profile — that is the
 * screen the user will actually land on, so promising anything else would make
 * the app contradict the quiz. Slot two is negotiable, so a strong preference
 * from Q7 is promoted into it when it isn't already in the top two.
 */
export function recommendedTools(state: PlanState): [Tool, Tool] {
  const order = profiles[state.profile].tools;
  const preferred = MODALITY_TOOL[state.modality];
  const second =
    preferred !== order[0] && order.includes(preferred) ? preferred : order[1];
  return [order[0], second];
}

export interface PlanDay {
  day: number;
  time: string;
  /** Tool ids for this day — two only on day 7. */
  tools: Tool[];
  label: string;
  note: string;
}

export function buildPlan(state: PlanState): PlanDay[] {
  const [a, b] = recommendedTools(state);
  const time = TIMINGS[state.timing];

  return PLAN_DAYS.map((entry, index) => {
    const tools: Tool[] =
      entry.tool === "AB" ? [a, b] : entry.tool === "A" ? [a] : [b];
    const label = tools.map((tool) => TOOL_LABELS[tool]).join(" + ");
    return {
      day: index + 1,
      time,
      tools,
      label: `${label}, ${state.duration} min`,
      note: entry.note,
    };
  });
}
