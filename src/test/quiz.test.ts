import { describe, it, expect } from "vitest";
import {
  buildPlan,
  decodePlan,
  encodePlan,
  recommendedTools,
  resolveProfile,
  type Answers,
} from "@/lib/quiz";
import { PROFILES, profiles, questions } from "@/data/quiz";

const full: Answers = {
  reason: "panic",
  timing: "night",
  frequency: "daily",
  body: ["heart", "chest"],
  mind: ["blank"],
  context: "alone",
  modality: "visual",
  tried: ["nothing"],
  time: "5",
};

describe("resolveProfile", () => {
  it("takes Q1 at face value for every explicit reason", () => {
    for (const profile of PROFILES) {
      expect(resolveProfile({ reason: profile })).toBe(profile);
    }
  });

  it("breaks a notSure tie using the strongest Q4/Q5 hint", () => {
    const answers: Answers = {
      reason: "notSure",
      body: ["heart", "chest"], // two panic hints
      mind: ["worst"], // one anxiety hint
    };
    expect(resolveProfile(answers)).toBe("panic");
  });

  it("stays notSure when the hints tie", () => {
    const answers: Answers = {
      reason: "notSure",
      body: ["heart"], // panic
      mind: ["worst"], // anxiety
    };
    expect(resolveProfile(answers)).toBe("notSure");
  });

  it("stays notSure when there are no hints at all", () => {
    expect(resolveProfile({ reason: "notSure" })).toBe("notSure");
  });

  it("falls back to notSure when Q1 was never answered", () => {
    expect(resolveProfile({})).toBe("notSure");
    expect(resolveProfile({ body: ["heart"] })).toBe("notSure");
  });
});

describe("decodePlan", () => {
  it("round-trips everything encodePlan writes", () => {
    const decoded = decodePlan(new URLSearchParams(encodePlan(full)));
    expect(decoded).toEqual({
      profile: "panic",
      timing: "night",
      duration: "5",
      context: "alone",
      modality: "visual",
      frequency: "daily",
    });
  });

  it("returns null when p is missing, empty or unknown", () => {
    expect(decodePlan(new URLSearchParams(""))).toBeNull();
    expect(decodePlan(new URLSearchParams("p="))).toBeNull();
    expect(decodePlan(new URLSearchParams("p=nope"))).toBeNull();
    expect(decodePlan(new URLSearchParams("t=night&d=5"))).toBeNull();
  });

  it("fills defaults when only p is present", () => {
    expect(decodePlan(new URLSearchParams("p=sleep"))).toEqual({
      profile: "sleep",
      timing: "evening",
      duration: "5",
      context: "alone",
      modality: "visual",
      frequency: "weekly",
    });
  });

  it("falls back per-param on out-of-range values instead of failing", () => {
    const decoded = decodePlan(
      new URLSearchParams("p=anxiety&t=lunchtime&d=999&c=&m=telepathy&f=x")
    );
    expect(decoded).toEqual({
      profile: "anxiety",
      timing: "evening",
      duration: "5",
      context: "alone",
      modality: "visual",
      frequency: "weekly",
    });
  });

  it("never throws on hostile input", () => {
    const hostile = [
      "p=panic&d=<script>",
      "p=panic&t=" + "x".repeat(5000),
      "p=%00",
      "p[]=panic",
      "p=panic&p=sleep",
    ];
    for (const query of hostile) {
      expect(() => decodePlan(new URLSearchParams(query))).not.toThrow();
    }
  });
});

describe("recommendedTools", () => {
  const base = decodePlan(new URLSearchParams("p=panic"))!;

  it("always leads with the app's first tile for that profile", () => {
    for (const profile of PROFILES) {
      const state = decodePlan(new URLSearchParams(`p=${profile}&m=hands`))!;
      expect(recommendedTools(state)[0]).toBe(profiles[profile].tools[0]);
    }
  });

  it("promotes the Q7 preference into the second slot", () => {
    // panic order is breath, meditation, kanji, grounding — "hands" pulls
    // kanji up from third.
    expect(recommendedTools({ ...base, modality: "hands" })).toEqual([
      "breath",
      "kanji",
    ]);
  });

  it("keeps the app's own second tool when the preference is already first", () => {
    // "visual" maps to breath, which is panic's first tool — nothing to promote.
    expect(recommendedTools({ ...base, modality: "visual" })).toEqual([
      "breath",
      "meditation",
    ]);
  });

  it("never returns the same tool twice", () => {
    for (const profile of PROFILES) {
      for (const modality of ["voice", "visual", "hands"] as const) {
        const state = decodePlan(
          new URLSearchParams(`p=${profile}&m=${modality}`)
        )!;
        const [a, b] = recommendedTools(state);
        expect(a).not.toBe(b);
      }
    }
  });
});

describe("buildPlan", () => {
  const state = decodePlan(new URLSearchParams("p=sleep&t=night&d=10"))!;

  it("returns seven days at the timing's clock time", () => {
    const plan = buildPlan(state);
    expect(plan).toHaveLength(7);
    expect(plan.map((d) => d.day)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(new Set(plan.map((d) => d.time))).toEqual(new Set(["22:30"]));
  });

  it("uses only the two recommended tools, and pairs them on day 7", () => {
    const plan = buildPlan(state);
    const allowed = new Set(recommendedTools(state));
    for (const day of plan) {
      for (const tool of day.tools) expect(allowed.has(tool)).toBe(true);
    }
    expect(plan[6].tools).toHaveLength(2);
  });

  it("carries the chosen duration into every label", () => {
    for (const day of buildPlan(state)) {
      expect(day.label).toContain("10 min");
    }
  });
});

describe("content integrity", () => {
  it("has nine questions with unique ids and unique options", () => {
    expect(questions).toHaveLength(9);
    const ids = questions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const question of questions) {
      const optionIds = question.options.map((o) => o.id);
      expect(new Set(optionIds).size).toBe(optionIds.length);
      expect(question.options.length).toBeGreaterThan(1);
    }
  });

  it("gives every profile three paragraphs and notes for its top two tools", () => {
    for (const profile of PROFILES) {
      const content = profiles[profile];
      expect(content.why).toHaveLength(3);
      expect(content.tools).toHaveLength(4);
      expect(new Set(content.tools).size).toBe(4);
      const [a, b] = content.tools;
      expect(content.toolNotes[a]).toBeTruthy();
      expect(content.toolNotes[b]).toBeTruthy();
    }
  });

  it("maps every Q1 option to a distinct profile", () => {
    const q1 = questions[0];
    const mapped = q1.options.map((o) => o.profile);
    expect(new Set(mapped).size).toBe(PROFILES.length);
    for (const option of q1.options) expect(option.icon).toBeTruthy();
  });
});
