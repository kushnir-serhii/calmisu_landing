# Calm Profile Quiz — Content

**All copy for the quiz lives here.** `SPEC.md` describes the build; this file is the source of every user-facing string. Copy it verbatim into `src/data/quiz.ts`. Do not paraphrase, and do not write new copy in the components.

**Voice:** warm, grounding, non-clinical. Second person. Short sentences. Never alarming, never clinical, never cute. No exclamation marks. No emoji.

**Hard rules:**
- No scores, no percentages, no severity language, no "you have".
- Never "diagnosis", "assessment", "test", "symptoms", "condition", "disorder".
- Say "pattern", "what your body does", "what tends to help".

---

## 1. Quiz questions

Nine questions. Q1 is the only one that determines the profile outright; Q4 and Q5 carry `profile` tags used **only** as a tiebreak when Q1 is `notSure`.

### Q1 — `reason` (single) → determines profile

> **What brings you here?**
> This helps us shape the result around you.

| id | Label | → profile |
|---|---|---|
| `panic` | Panic attacks | `panic` |
| `anxiety` | Anxiety and stress | `anxiety` |
| `racingThoughts` | Racing thoughts | `racingThoughts` |
| `sleep` | Trouble sleeping | `sleep` |
| `notSure` | Not sure yet | `notSure` |

*Labels are taken from the app's own onboarding (`onboarding.json` → `reason.options`). Keep them identical — a returning user should see the same words twice.*

### Q2 — `timing` (single) → sets the plan's time of day

> **When does it usually hit hardest?**

| id | Label | Plan time |
|---|---|---|
| `morning` | First thing in the morning | 08:00 |
| `day` | Somewhere in the middle of the day | 13:00 |
| `evening` | In the evening, as things go quiet | 21:00 |
| `night` | In the middle of the night | 22:30 |

### Q3 — `frequency` (single) → sets the plan's weekday spread

> **How often does it come up?**

| id | Label | Plan days |
|---|---|---|
| `daily` | Most days | 7 of 7 |
| `weekly` | A few times a week | 7 of 7 |
| `monthly` | A few times a month | 7 of 7 |
| `rare` | Rarely, but hard when it does | 7 of 7 |

*The plan is always 7 days. This answer changes the framing line above the plan, not its length — see §4.*

### Q4 — `body` (multi) → result copy + `notSure` tiebreak

> **What does your body do?**
> Pick as many as fit.

| id | Label | Tiebreak hint |
|---|---|---|
| `heart` | Heart races or pounds | `panic` |
| `chest` | Chest tightens, hard to breathe | `panic` |
| `stomach` | Stomach knots up | `anxiety` |
| `tense` | Shoulders and jaw stay tense | `anxiety` |
| `tired` | Wired but exhausted | `sleep` |
| `nothing` | Nothing physical, really | `racingThoughts` |

### Q5 — `mind` (multi) → result copy + `notSure` tiebreak

> **And what does your mind do?**
> Pick as many as fit.

| id | Label | Tiebreak hint |
|---|---|---|
| `loops` | Replays the same thing over and over | `racingThoughts` |
| `worst` | Jumps to the worst outcome | `anxiety` |
| `critic` | Turns on me | `anxiety` |
| `blank` | Goes blank or freezes | `panic` |
| `wont_stop` | Will not slow down at bedtime | `sleep` |

### Q6 — `context` (single) → tool suitability line

> **When it hits, where are you usually?**

| id | Label |
|---|---|
| `alone` | Alone, or somewhere I can close a door |
| `people` | Around other people, usually |

### Q7 — `modality` (single) → which of the two tools leads

> **What settles you fastest?**

| id | Label | Leans to |
|---|---|---|
| `voice` | A calm voice or sound | `meditation` |
| `visual` | Something to follow with my eyes | `breath` |
| `hands` | Doing something with my hands | `kanji` |

### Q8 — `tried` (multi) → framing only, no routing

> **What have you already tried?**
> No wrong answers. This just tells us where to start.

| id | Label |
|---|---|
| `therapy` | Therapy or counselling |
| `apps` | Meditation apps |
| `breathing` | Breathing exercises |
| `reading` | Reading about it |
| `nothing` | Nothing yet |

### Q9 — `time` (single) → sets the plan's session length

> **How much time can you realistically give yourself?**
> Be honest. A plan you skip is worth nothing.

| id | Label | Plan duration |
|---|---|---|
| `2` | About 2 minutes | 2 min |
| `5` | About 5 minutes | 5 min |
| `10` | Around 10 minutes | 10 min |

---

## 2. The five profiles

**`tools` must match the app's `getHomeVariant()` order exactly.** The first two are what the result page shows. This is not cosmetic — it is what makes the web promise true when the app opens.

| Profile | `tools` (app order) | Shown on result |
|---|---|---|
| `panic` | breath, meditation, kanji, grounding | Breathing + Meditation |
| `anxiety` | breath, meditation, kanji, grounding | Breathing + Meditation |
| `racingThoughts` | kanji, breath, meditation, grounding | Calligraphy + Breathing |
| `sleep` | meditation, breath, kanji, grounding | Meditation + Breathing |
| `notSure` | breath, kanji, meditation, grounding | Breathing + Calligraphy |

If Q7 `modality` points at a tool that is third or fourth in the list, promote it into second place. Never displace the first — that one is the app's own default for this pattern.

---

### `panic` — **The Body Alarm**

> Your body sounds the alarm before your mind knows why.

**Why this happens**

1. What you are describing usually starts in the body, not the thought. A surge of adrenaline arrives first — racing heart, tight chest, air that will not go all the way in — and your mind scrambles to explain it. That backwards order is why it feels like it comes from nowhere.

2. The sensations are real, and they are not dangerous. Adrenaline is doing exactly what it evolved to do, just with no lion in the room. It also has a short shelf life. A surge peaks and then falls, whether or not you do anything about it.

3. Which means the goal is not to stop it. It is to stay with it without adding a second layer of fear on top. That is a skill, and it is trainable.

**Your two tools**

- **Breathing** — a long, slow exhale is the fastest lever you have on a racing heart. Not because it distracts you, but because a longer out-breath than in-breath nudges your nervous system toward its calming branch.
- **Meditation sounds** — something steady to hold onto while the surge does its thing and passes.

**Plan intro**
> The next seven days are about practising *before* the surge, not during it. Calm is easier to find when your body already knows the route.

---

### `anxiety` — **The Background Hum**

> Never loud enough to stop your day. Never quite off, either.

**Why this happens**

1. This is the pattern with no clear beginning. There is no single moment to point at — just a low, constant readiness that sits under everything, tightening your stomach and your shoulders and following you from one task to the next.

2. Because it never spikes, it also never resolves. A panic surge at least ends. A hum just continues, which is why it wears people down so quietly and why it so often gets dismissed — by other people, and by you.

3. Steady things respond to steady things. Not one heroic intervention, but a small, repeated signal to your body that it is allowed to stand down.

**Your two tools**

- **Breathing** — a few slow minutes, at the same time each day, is more useful here than an emergency technique you only reach for at the worst moment.
- **Meditation sounds** — a deliberate pause in a day that otherwise has none.

**Plan intro**
> This plan is built around repetition, not intensity. The point is to give your body the same signal seven days running.

---

### `racingThoughts` — **The Loop**

> The same thought, at speed, going nowhere.

**Why this happens**

1. A looping mind is not a broken one. It is a mind trying to solve something by thinking harder — which works well for problems that have solutions and very badly for the ones that do not.

2. Telling yourself to stop rarely works, because the instruction is itself another thought. This is why "just let it go" tends to make it louder.

3. What does tend to work is giving your attention somewhere physical to be. Not an escape from the thought, but a task precise enough that your focus has to go somewhere specific to do it.

**Your two tools**

- **Kanji calligraphy** — a stroke has an order, a direction and an end. It asks for exactly the kind of narrow attention a loop cannot run alongside.
- **Breathing** — a slower rhythm underneath, so your body is not feeding the spin.

**Plan intro**
> Each of these seven days gives your attention a specific place to go. Not away from the thought — somewhere else entirely.

---

### `sleep` — **The Quiet Hour**

> Your mind waits until the day goes quiet, then starts talking.

**Why this happens**

1. All day there is enough noise to keep the thinking at bay. Then the lights go off, the last distraction ends, and everything you have not processed arrives at once. Nothing has gone wrong. The volume of everything else just dropped.

2. Then the second problem stacks on top: you start watching the clock, doing the arithmetic on how much sleep is left. Now you are anxious about being anxious, and that reliably keeps you awake.

3. What helps is having somewhere for your attention to rest that is not your own thoughts, and beginning it *before* the lights go off rather than after the spiral is already running.

**Your two tools**

- **Meditation sounds** — something outside your own head to follow as you wind down.
- **Breathing** — a long exhale works lying down, in the dark, with your eyes closed, which is exactly where you need it.

**Plan intro**
> This plan starts before bed, not in bed. That gap is most of why it works.

---

### `notSure` — **The Overload**

> Too much, all at once, and no clean name for it.

**Why this happens**

1. Not being able to name it is very common, and it is not a sign that you are paying insufficient attention. Stress, anxiety, exhaustion and low mood overlap heavily and share a lot of the same sensations. Most people cannot separate them from the inside.

2. The useful news is that you do not have to. The techniques that help are largely the same ones regardless of what you would call it, because they work on the nervous system rather than on the label.

3. So start broad. After a week of paying attention, the pattern usually names itself — and then you can be more specific.

**Your two tools**

- **Breathing** — the most general-purpose thing there is. It helps across nearly every version of this.
- **Kanji calligraphy** — for the days when it is more mental than physical.

**Plan intro**
> Seven days, two techniques, no commitment. By the end you will know more about your own pattern than any quiz could tell you.

---

## 3. The gate (Section B)

> ### Your 7-day plan is ready
>
> Tell us where to send it. You will also get a code for 14 days of Calmisu PRO — free, no card.

- Field placeholder: `Enter your email address`
- Consent checkbox, **unchecked by default**:
  > Email me my plan and occasional tips about anxiety. We store your email and your profile name — never your answers. Unsubscribe any time.
- Button: `Send my plan` · loading state `Sending...`
- Under the button, small:
  > No spam. No card. Unsubscribe in one click.
- Error state: `Something went wrong. Please try again.`

**The consent line is a factual claim about the system.** If Task 1's schema ever changes, this copy changes with it.

---

## 4. The plan (Section C)

Heading:
> ### Your 7 days

Framing line, by Q3 `frequency`:

| `frequency` | Line |
|---|---|
| `daily` | Most days are hard right now. These seven are small on purpose. |
| `weekly` | A few times a week is enough to be worth getting ahead of. |
| `monthly` | Practising between the hard days is what makes the hard days easier. |
| `rare` | Rare but heavy. These seven days build the route before you need it. |

Then seven rows. `{time}` from Q2, `{duration}` from Q9, `{A}` and `{B}` are the profile's two tools:

| Day | Activity | Note |
|---|---|---|
| 1 | {A}, {duration} at {time} | Start here. Nothing to get right. |
| 2 | {A}, {duration} at {time} | Same time as yesterday. That is the whole trick. |
| 3 | {B}, {duration} at {time} | Something different today. |
| 4 | {A}, {duration} at {time} | Back to the one that fits you best. |
| 5 | {B}, {duration} at {time} | Notice which of the two you reach for more easily. |
| 6 | {A}, {duration} at {time} | Six days in. This is where it starts to stick. |
| 7 | {A} + {B}, {duration} at {time} | Both, back to back. This is the Calming Flow. |

Each row is a button labelled `Start` that deep-links into the app, with a Play fallback.

Below the rows:

> ### 14 days of PRO, free
>
> `{PUBLIC_QUIZ_PROMO_CODE}`
>
> Open Calmisu, create an account, and enter this code in Profile. Valid until {expiry}.

Closing disclaimer, on the page, not hidden in a footer:

> Calmisu is a self-help tool, not a substitute for professional mental health care. If things feel unmanageable, please talk to a doctor or a therapist.

---

## 5. Fallback (bad or missing URL params)

> ### We could not find that plan
>
> The link may be incomplete. The quiz takes about two minutes — your profile will be right back.
>
> `[ Take the quiz ]`

---

## 6. Email sequence

All five plain-text-first, short, signed `Julia`. Byline is already established sitewide as *Julia K, Product Designer & Creator of Calmisu*.

**Day 0 — `Your Calm Profile: {profile name}`**
> You came out as {profile name} — {subtitle}.
>
> Your 7-day plan is here: {plan URL}
>
> It is two techniques, {duration} a day, at {time}. That is all.
>
> Your code for 14 days of PRO is {code}. Enter it in the app under Profile once you have an account.
>
> Julia

**Day 2 — `Why breathing out longer calms you fast`**
Short lead-in, link to `/blog/extended-exhale-breathing-science/`, one line back to the plan.

**Day 5 — `You aren't bad at meditation`**
Link to `/blog/why-letting-go-is-hard-for-exhausted-minds/`.

**Day 9 — `Same time, every day`**
Link to `/blog/meditation-routine-consistency/`.

**Day 14 — `Your code expires tomorrow`**
One short paragraph, the code, the Play link. **Suppress if already redeemed.**

Every email carries a working unsubscribe link.

---

## 7. Blog CTA variants

Rendered after the post body. Heading is constant, the line under it varies.

> ### Two minutes, nine questions

| variant | Line | Button |
|---|---|---|
| `panic` | Panic follows a pattern. Find out which one yours follows, and the two techniques that work fastest on it. | `Find my pattern` |
| `anxiety` | There are four techniques here. Find out which two fit the way your anxiety actually shows up. | `Find my two` |
| `racingThoughts` | For minds that will not stop looping — find the technique that gives your attention somewhere else to be. | `Find my pattern` |
| `sleep` | Find out what your evenings are actually doing, and build the routine that fits your day. | `Build my routine` |
| `default` | Find out which pattern your anxiety follows, and the two techniques that work fastest for it. | `Take the quiz` |

Under the button, small: `Free · No account needed`
