/**
 * Single source for the Calm Profile quiz — questions, options and profile
 * copy. Mirrors the role `faq.ts` plays for the FAQ section.
 *
 * Copy comes from context/spec/008-calm-profile-quiz/CONTENT.md. Edit it there
 * first: the spec is what keeps the voice consistent and the claims safe.
 *
 * Two hard constraints, both load-bearing:
 *
 * 1. `Profile` is the app's own `OnboardingReason` union
 *    (calmisu/src/consts/onboardingReason.ts). Same five values, same spelling.
 * 2. Each profile's `tools` order matches the app's `getHomeVariant()`
 *    (calmisu/src/data/home/homeVariants.ts). The result page recommends the
 *    first two, so a user who installs sees the same tools in the same order on
 *    their home screen. If the app's variants change, change these with them.
 */

export type Profile =
  | "panic"
  | "anxiety"
  | "racingThoughts"
  | "sleep"
  | "notSure";

export type Tool = "breath" | "kanji" | "meditation" | "grounding";

export const PROFILES = [
  "panic",
  "anxiety",
  "racingThoughts",
  "sleep",
  "notSure",
] as const;

/** Time of day the plan schedules its session. Keys are the `t` URL param. */
export const TIMINGS = {
  morning: "08:00",
  day: "13:00",
  evening: "21:00",
  night: "22:30",
} as const;
export type Timing = keyof typeof TIMINGS;

/** Minutes per session. Keys are the `d` URL param. */
export const DURATIONS = ["2", "5", "10"] as const;
export type Duration = (typeof DURATIONS)[number];

export type Context = "alone" | "people";
export type Modality = "voice" | "visual" | "hands";

export interface QuizOption {
  id: string;
  label: string;
  /** Q1 only: picking this option sets the profile outright. */
  profile?: Profile;
  /** Q4/Q5 only: a weak hint, used solely to break a `notSure` tie. */
  hint?: Profile;
  /** Q1 only: the app's own onboarding icon for this reason. */
  icon?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  subtitle?: string;
  multi: boolean;
  options: QuizOption[];
}

export interface ProfileContent {
  name: string;
  subtitle: string;
  /** Three short paragraphs. Explanation, never assessment. */
  why: string[];
  /** App order — see the note at the top of this file. */
  tools: Tool[];
  /** One line per tool, keyed by tool. Shown beside the two recommended. */
  toolNotes: Partial<Record<Tool, string>>;
  planIntro: string;
}

export const TOOL_LABELS: Record<Tool, string> = {
  breath: "Breathing",
  kanji: "Kanji calligraphy",
  meditation: "Meditation sounds",
  grounding: "Grounding",
};

export const questions: QuizQuestion[] = [
  {
    id: "reason",
    question: "What brings you here?",
    subtitle: "This helps us shape the result around you.",
    multi: false,
    options: [
      {
        id: "panic",
        label: "Panic attacks",
        profile: "panic",
        icon: "/images/quiz/panic.webp",
      },
      {
        id: "anxiety",
        label: "Anxiety and stress",
        profile: "anxiety",
        icon: "/images/quiz/anxiety.webp",
      },
      {
        id: "racingThoughts",
        label: "Racing thoughts",
        profile: "racingThoughts",
        icon: "/images/quiz/thoughts.webp",
      },
      {
        id: "sleep",
        label: "Trouble sleeping",
        profile: "sleep",
        icon: "/images/quiz/sleeping.webp",
      },
      {
        id: "notSure",
        label: "Not sure yet",
        profile: "notSure",
        icon: "/images/quiz/notsure.webp",
      },
    ],
  },
  {
    id: "timing",
    question: "When does it usually hit hardest?",
    multi: false,
    options: [
      { id: "morning", label: "First thing in the morning" },
      { id: "day", label: "Somewhere in the middle of the day" },
      { id: "evening", label: "In the evening, as things go quiet" },
      { id: "night", label: "In the middle of the night" },
    ],
  },
  {
    id: "frequency",
    question: "How often does it come up?",
    multi: false,
    options: [
      { id: "daily", label: "Most days" },
      { id: "weekly", label: "A few times a week" },
      { id: "monthly", label: "A few times a month" },
      { id: "rare", label: "Rarely, but hard when it does" },
    ],
  },
  {
    id: "body",
    question: "What does your body do?",
    subtitle: "Pick as many as fit.",
    multi: true,
    options: [
      { id: "heart", label: "Heart races or pounds", hint: "panic" },
      {
        id: "chest",
        label: "Chest tightens, hard to breathe",
        hint: "panic",
      },
      { id: "stomach", label: "Stomach knots up", hint: "anxiety" },
      { id: "tense", label: "Shoulders and jaw stay tense", hint: "anxiety" },
      { id: "tired", label: "Wired but exhausted", hint: "sleep" },
      {
        id: "nothing",
        label: "Nothing physical, really",
        hint: "racingThoughts",
      },
    ],
  },
  {
    id: "mind",
    question: "And what does your mind do?",
    subtitle: "Pick as many as fit.",
    multi: true,
    options: [
      {
        id: "loops",
        label: "Replays the same thing over and over",
        hint: "racingThoughts",
      },
      { id: "worst", label: "Jumps to the worst outcome", hint: "anxiety" },
      { id: "critic", label: "Turns on me", hint: "anxiety" },
      { id: "blank", label: "Goes blank or freezes", hint: "panic" },
      {
        id: "wont_stop",
        label: "Will not slow down at bedtime",
        hint: "sleep",
      },
    ],
  },
  {
    id: "context",
    question: "When it hits, where are you usually?",
    multi: false,
    options: [
      { id: "alone", label: "Alone, or somewhere I can close a door" },
      { id: "people", label: "Around other people, usually" },
    ],
  },
  {
    id: "modality",
    question: "What settles you fastest?",
    multi: false,
    options: [
      { id: "voice", label: "A calm voice or sound" },
      { id: "visual", label: "Something to follow with my eyes" },
      { id: "hands", label: "Doing something with my hands" },
    ],
  },
  {
    id: "tried",
    question: "What have you already tried?",
    subtitle: "No wrong answers. This just tells us where to start.",
    multi: true,
    options: [
      { id: "therapy", label: "Therapy or counselling" },
      { id: "apps", label: "Meditation apps" },
      { id: "breathing", label: "Breathing exercises" },
      { id: "reading", label: "Reading about it" },
      { id: "nothing", label: "Nothing yet" },
    ],
  },
  {
    id: "time",
    question: "How much time can you realistically give yourself?",
    subtitle: "Be honest. A plan you skip is worth nothing.",
    multi: false,
    options: [
      { id: "2", label: "About 2 minutes" },
      { id: "5", label: "About 5 minutes" },
      { id: "10", label: "Around 10 minutes" },
    ],
  },
];

export const profiles: Record<Profile, ProfileContent> = {
  panic: {
    name: "The Body Alarm",
    subtitle: "Your body sounds the alarm before your mind knows why.",
    why: [
      "What you are describing usually starts in the body, not the thought. A surge of adrenaline arrives first — racing heart, tight chest, air that will not go all the way in — and your mind scrambles to explain it. That backwards order is why it feels like it comes from nowhere.",
      "The sensations are real, and they are not dangerous. Adrenaline is doing exactly what it evolved to do, just with no lion in the room. It also has a short shelf life. A surge peaks and then falls, whether or not you do anything about it.",
      "Which means the goal is not to stop it. It is to stay with it without adding a second layer of fear on top. That is a skill, and it is trainable.",
    ],
    tools: ["breath", "meditation", "kanji", "grounding"],
    toolNotes: {
      breath:
        "A long, slow exhale is the fastest lever you have on a racing heart — not because it distracts you, but because a longer out-breath than in-breath nudges your nervous system toward its calming branch.",
      meditation:
        "Something steady to hold onto while the surge does its thing and passes.",
    },
    planIntro:
      "The next seven days are about practising before the surge, not during it. Calm is easier to find when your body already knows the route.",
  },

  anxiety: {
    name: "The Background Hum",
    subtitle: "Never loud enough to stop your day. Never quite off, either.",
    why: [
      "This is the pattern with no clear beginning. There is no single moment to point at — just a low, constant readiness that sits under everything, tightening your stomach and your shoulders and following you from one task to the next.",
      "Because it never spikes, it also never resolves. A panic surge at least ends. A hum just continues, which is why it wears people down so quietly and why it so often gets dismissed — by other people, and by you.",
      "Steady things respond to steady things. Not one heroic intervention, but a small, repeated signal to your body that it is allowed to stand down.",
    ],
    tools: ["breath", "meditation", "kanji", "grounding"],
    toolNotes: {
      breath:
        "A few slow minutes, at the same time each day, is more useful here than an emergency technique you only reach for at the worst moment.",
      meditation: "A deliberate pause in a day that otherwise has none.",
    },
    planIntro:
      "This plan is built around repetition, not intensity. The point is to give your body the same signal seven days running.",
  },

  racingThoughts: {
    name: "The Loop",
    subtitle: "The same thought, at speed, going nowhere.",
    why: [
      "A looping mind is not a broken one. It is a mind trying to solve something by thinking harder — which works well for problems that have solutions and very badly for the ones that do not.",
      "Telling yourself to stop rarely works, because the instruction is itself another thought. This is why “just let it go” tends to make it louder.",
      "What does tend to work is giving your attention somewhere physical to be. Not an escape from the thought, but a task precise enough that your focus has to go somewhere specific to do it.",
    ],
    tools: ["kanji", "breath", "meditation", "grounding"],
    toolNotes: {
      kanji:
        "A stroke has an order, a direction and an end. It asks for exactly the kind of narrow attention a loop cannot run alongside.",
      breath: "A slower rhythm underneath, so your body is not feeding the spin.",
    },
    planIntro:
      "Each of these seven days gives your attention a specific place to go. Not away from the thought — somewhere else entirely.",
  },

  sleep: {
    name: "The Quiet Hour",
    subtitle: "Your mind waits until the day goes quiet, then starts talking.",
    why: [
      "All day there is enough noise to keep the thinking at bay. Then the lights go off, the last distraction ends, and everything you have not processed arrives at once. Nothing has gone wrong. The volume of everything else just dropped.",
      "Then the second problem stacks on top: you start watching the clock, doing the arithmetic on how much sleep is left. Now you are anxious about being anxious, and that reliably keeps you awake.",
      "What helps is having somewhere for your attention to rest that is not your own thoughts, and beginning it before the lights go off rather than after the spiral is already running.",
    ],
    tools: ["meditation", "breath", "kanji", "grounding"],
    toolNotes: {
      meditation:
        "Something outside your own head to follow as you wind down.",
      breath:
        "A long exhale works lying down, in the dark, with your eyes closed, which is exactly where you need it.",
    },
    planIntro:
      "This plan starts before bed, not in bed. That gap is most of why it works.",
  },

  notSure: {
    name: "The Overload",
    subtitle: "Too much, all at once, and no clean name for it.",
    why: [
      "Not being able to name it is very common, and it is not a sign that you are paying insufficient attention. Stress, anxiety, exhaustion and low mood overlap heavily and share a lot of the same sensations. Most people cannot separate them from the inside.",
      "The useful news is that you do not have to. The techniques that help are largely the same ones regardless of what you would call it, because they work on the nervous system rather than on the label.",
      "So start broad. After a week of paying attention, the pattern usually names itself — and then you can be more specific.",
    ],
    tools: ["breath", "kanji", "meditation", "grounding"],
    toolNotes: {
      breath:
        "The most general-purpose thing there is. It helps across nearly every version of this.",
      kanji: "For the days when it is more mental than physical.",
    },
    planIntro:
      "Seven days, two techniques, no commitment. By the end you will know more about your own pattern than any quiz could tell you.",
  },
};

/** Framing line above the seven rows, chosen by the Q3 answer. */
export const FREQUENCY_LINES: Record<string, string> = {
  daily: "Most days are hard right now. These seven are small on purpose.",
  weekly: "A few times a week is enough to be worth getting ahead of.",
  monthly:
    "Practising between the hard days is what makes the hard days easier.",
  rare: "Rare but heavy. These seven days build the route before you need it.",
};

/**
 * Day-by-day notes. `A` is the profile's first tool, `B` its second — the plan
 * builder substitutes the real names.
 */
export const PLAN_DAYS: { tool: "A" | "B" | "AB"; note: string }[] = [
  { tool: "A", note: "Start here. Nothing to get right." },
  { tool: "A", note: "Same time as yesterday. That is the whole trick." },
  { tool: "B", note: "Something different today." },
  { tool: "A", note: "Back to the one that fits you best." },
  { tool: "B", note: "Notice which of the two you reach for more easily." },
  { tool: "A", note: "Six days in. This is where it starts to stick." },
  { tool: "AB", note: "Both, back to back. This is the Calming Flow." },
];
