# Calmisu Landing — Calm Profile Quiz Implementation Spec

**For:** coding agent working in `calmisu_landing` (Astro 5 → GitHub Pages, https://calmisu.com)
**Companion doc:** `CONTENT.md` in this folder — all quiz questions, profile copy and plan templates. Do not invent copy; take it from there.
**Related repo:** `kumo_back-end` (Fastify + Prisma) — Task 1 only.

**Repo facts below were confirmed by reading the code in this repo. Trust them; don't re-derive.**

---

## Verified repo facts

- Static build, no SSR adapter. `astro.config.mjs` sets `site: "https://calmisu.com"` and **`trailingSlash: "always"`** — every internal link must end in `/`.
- `@astrojs/sitemap` is configured with a `filter`. Extending it is required for any noindex page (see Task 4).
- React islands are used via `@astrojs/react`, hydrated explicitly (`client:visible`, `client:idle`). `AnimatedSection` wraps most homepage sections.
- `src/lib/analytics.ts` exposes `track(name, params)` — a no-op until the user accepts the cookie banner. **All funnel numbers are a floor, not a total.**
- `src/lib/api.ts` already calls the backend from the static site: `POST ${PUBLIC_API_BASE_URL}/auth/delete-account-web`. CORS and the fetch pattern are proven — reuse this file.
- `src/components/popups/NotifyMe.tsx` posts to `PUBLIC_GOOGLE_APPS_SCRIPT_URL` with `mode: "no-cors"`. Its own comment notes this resolves even on a 5xx, so `waitlist_submit` counts *attempts*. Task 1 replaces this transport.
- `src/content/blog/` — 7 posts, Zod-validated collection. Frontmatter has `tags: string[]`.
- `src/data/faq.ts` is the single source for the FAQ section + `FAQPage` JSON-LD. Follow that one-source pattern for quiz data.
- `public/.well-known/assetlinks.json` exists (Android App Links verified).
- Play URL, used across the site: `https://play.google.com/store/apps/details?id=com.calmisu.app`

### Facts from the app repo (`calmisu`) — do not change, mirror them

`src/consts/onboardingReason.ts` defines the segmentation the app already uses:

```
'panic' | 'anxiety' | 'racingThoughts' | 'sleep' | 'notSure'
```

`src/data/home/homeVariants.ts` already reorders the home screen per reason. The quiz's recommended tool order **must match `getHomeVariant()` exactly**, so the promise made on the web is visibly kept in the app. The mapping is reproduced in `CONTENT.md`.

---

## Product decisions (already made — do not relitigate)

| Decision | Rationale |
|---|---|
| The plan is a **standalone web page**, delivered by email. It does not write into the app. | Keeps scope closed. No install-referrer plumbing, no habit injection, no account coupling. |
| Plan state is **encoded in the URL**, rendered client-side. No database row per plan. | Works on static hosting. Plan is bookmarkable and re-openable from the email forever. |
| The **profile is free**; only the **7-day plan + promo code** are email-gated. | A hard gate on the whole result reads as bait-and-switch for a mental-health product and suppresses completion. |
| The email gate is **soft** (client-side). A determined visitor can edit the URL and skip it. | Acceptable. Hardening it would require SSR the site doesn't have. |
| The promo code is **one shared code** with `maxUses` set high and an `expiresAt`. | `PromoCode` already supports this. No new backend endpoint, no per-lead code generation. |
| No scores, no percentages, no "you have X". Output is a **pattern**, never an assessment. | Clinical-claims risk, and the mental-health ad-policy restrictions flagged in the app repo's `MARKETING.md`. |
| Quiz answers are **never stored against an email**. Only `email` + `profile` + consent are persisted. | Q4/Q5 are health data under GDPR Art. 9. See Risks. |

---

## Task 1 — Reliable lead capture (`kumo_back-end`)

**Goal:** email submissions succeed or fail truthfully, and the list lives in your own database instead of a spreadsheet reached through a `no-cors` hole.

**Steps:**

1. Add a `Lead` model to `prisma/schema.prisma`:

   ```prisma
   model Lead {
     id        String   @id @default(uuid())
     email     String   @unique
     profile   String?  // 'panic' | 'anxiety' | 'racingThoughts' | 'sleep' | 'notSure'
     source    String   @default("quiz") // 'quiz' | 'ios_waitlist'
     locale    String   @default("en")
     consent   Boolean  @default(false)
     createdAt DateTime @default(now())

     @@map("leads")
   }
   ```

   **Do not add columns for the symptom answers (Q4/Q5).** That is deliberate — see Risks.

2. Add `POST /leads` — **unauthenticated**, rate-limited by IP. Follow the `rateLimit` config pattern already used in `src/features/promo/promo.routes.ts`. Suggested: `max: 5, timeWindow: '1 hour'`.
   - Body: `{ email, profile?, source?, locale?, consent }`, validated with Zod in a `leads.schemas.ts` (mirror `promo.schemas.ts`).
   - Reject when `consent !== true`.
   - Upsert on `email` so a repeat submission is a 200, not a unique-constraint 500.
   - Return `{ ok: true }` with real status codes. **No `no-cors`.**
   - Ensure the landing origin is allowed by the existing CORS config — confirm whether the config that lets `/auth/delete-account-web` through is global or per-route.

3. Send the plan email on successful capture, reusing the transport that already sends verification emails. Template content is in `CONTENT.md`. The email must contain the plan URL and the promo code.

**Acceptance criteria:**
- [ ] `POST /leads` returns 200 + `{ ok: true }` for a valid body, 400 for a bad email or `consent: false`, 429 past the limit
- [ ] Submitting the same email twice returns 200 both times, with one row in `leads`
- [ ] The `leads` table has no column capable of holding Q4/Q5 answers
- [ ] A request from `https://calmisu.com` succeeds in a browser with CORS headers present (not an opaque response)
- [ ] The plan email arrives with a working plan URL and the promo code

**Do not do in this task:** don't touch `/promo/redeem`, don't create per-lead promo codes, don't add auth to `/leads`.

---

## Task 2 — Quiz data module

**Goal:** all quiz structure and copy live in one typed module, the way `src/data/faq.ts` is the single source for the FAQ.

**Steps:**

1. Create `src/data/quiz.ts` exporting:

   ```ts
   export type Profile = 'panic' | 'anxiety' | 'racingThoughts' | 'sleep' | 'notSure';
   export type Tool = 'breath' | 'kanji' | 'meditation' | 'grounding';

   export interface QuizOption { id: string; label: string; profile?: Profile; }
   export interface QuizQuestion {
     id: string;
     question: string;
     subtitle?: string;
     multi: boolean;
     options: QuizOption[];
   }
   export interface ProfileContent {
     name: string;          // "The Quiet Hour"
     subtitle: string;
     why: string[];         // 3 short paragraphs
     tools: Tool[];         // MUST match getHomeVariant() order — see CONTENT.md
     planIntro: string;
   }

   export const questions: QuizQuestion[];
   export const profiles: Record<Profile, ProfileContent>;
   ```

2. Fill it from `CONTENT.md`. Nine questions, five profiles. Copy verbatim.

3. Add `src/lib/quiz.ts` with the pure scoring and encoding logic, unit-testable with the Vitest setup already in the repo:
   - `resolveProfile(answers): Profile` — Q1 decides it outright. If Q1 is `notSure`, fall back to the most frequent profile hinted by the `profile` tags on the chosen Q4/Q5 options; if still ambiguous, return `notSure`.
   - `encodePlan(state): string` / `decodePlan(params): PlanState | null` — see Task 4 for the parameter shape. `decodePlan` must be **total**: any malformed or missing param returns `null`, never throws.

4. Add `src/test/quiz.test.ts` covering: each Q1 answer resolves to its own profile; `notSure` plus panic-leaning symptoms resolves to `panic`; `decodePlan` returns `null` for garbage, for missing params and for out-of-range values; `encodePlan → decodePlan` round-trips.

**Acceptance criteria:**
- [ ] `src/data/quiz.ts` holds 9 questions and 5 profiles, matching `CONTENT.md` word for word
- [ ] Each profile's `tools` array matches the app's `getHomeVariant()` order for that reason
- [ ] `npm run test` passes, including the new `quiz.test.ts`
- [ ] `decodePlan` never throws on any input

**Do not do in this task:** don't build UI, don't call the network.

---

## Task 3 — `/quiz/` page

**Goal:** an indexable landing page that opens the quiz, and the quiz flow itself.

**Steps:**

1. Create `src/pages/quiz.astro` using `BaseLayout` (follow `about.astro` for the pattern).
   - `title`: `"What's Your Anxiety Pattern? — 2-Minute Quiz | Calmisu"`
   - `description`: `"Answer 9 quick questions and find out which pattern your anxiety follows — and the two techniques that work fastest for it. Free, no account."`
   - Above the fold, server-rendered (**not** inside the island, so it is in the HTML for crawlers): H1, one paragraph, the trust line `Free · 2 minutes · No account needed`, and the start button.

2. Create `src/components/QuizIsland.tsx`, hydrated `client:idle`.
   - One question per screen. A progress indicator (`3 of 9`) — a bar, no percentage.
   - Single-select advances automatically on tap; multi-select shows a Continue button.
   - A Back control that preserves answers.
   - All state in React. **No `localStorage` for answers** — they are health data; keeping them in memory only is intentional.
   - On the last answer, compute the profile and navigate: `window.location.href = "/quiz/result/?" + encodePlan(state)`.

3. Match the existing design language: `font-display` headings, `bg-brand-100` surfaces, `rounded-2xl`, and the section padding scale used in `CTASection.tsx` (`px-6 sm:px-8 md:px-16 lg:px-[140px]`).

4. Add a `/quiz/` entry point to the homepage. Place it between `FeaturesScience` and `AnimatedChatSection` in `src/pages/index.astro`, wrapped in `AnimatedSection` with a delay of `200` — the slot `ReviewsSection` used to hold. **Do not re-enable `ReviewsSection`.**

5. Add `Quiz` to `src/data/navLinks.ts`.

**Acceptance criteria:**
- [ ] `/quiz/` renders its H1 and intro copy in the static HTML with JS disabled
- [ ] All 9 questions are reachable; Back preserves prior answers
- [ ] Completing the quiz lands on `/quiz/result/` with populated query params
- [ ] No answer data is written to `localStorage`, `sessionStorage` or a cookie (verify in devtools)
- [ ] `/quiz/` appears in `sitemap-index.xml` after build
- [ ] Homepage and nav both link to `/quiz/` with a trailing slash

**Do not do in this task:** don't build the result page, don't capture email.

---

## Task 4 — `/quiz/result/` — profile (free) and plan (gated)

**Goal:** one page that gives the insight away, then asks for the email in exchange for the plan and the code.

**URL contract** — short, and total:

```
/quiz/result/?p=<profile>&t=<morning|day|evening|night>&d=<2|5|10>&c=<alone|people>&m=<voice|visual|hands>
```

`p` is the only required param. Every other param has a documented default, so a truncated link still renders something sane.

**Steps:**

1. Create `src/pages/quiz/result.astro`.
   - **`<meta name="robots" content="noindex, follow">`** — infinite param combinations, zero search value.
   - Extend the `filter` in `astro.config.mjs` to exclude `/quiz/result`. That file's existing comment requires noindex pages to be kept in sync there — follow it.
   - **Do not** add a `robots.txt` disallow. A crawl block would stop Google ever seeing the `noindex`, achieving the opposite of the intent.

2. Create `src/components/QuizResultIsland.tsx`, hydrated `client:load` (content depends on the URL, so it must not wait for idle).
   - `decodePlan(new URLSearchParams(location.search))`. On `null`, render a friendly fallback with a link back to `/quiz/`. Never a blank page or a crash.
   - **Section A — the profile. Always visible, no gate:** profile name, subtitle, the three `why` paragraphs, and the two recommended tools with one line each on why they suit this pattern.
   - **Section B — the gate:** heading, email field, an **unchecked** consent checkbox naming what is stored, and the submit button. Copy in `CONTENT.md`.
   - On submit → `postLead()` (Task 5). On success, reveal Section C in place and write a `calmisu_quiz_unlocked` flag to `localStorage` — **the flag only, never the answers** — so returning from the email link skips the gate.
   - **Section C — the plan:** 7 rows built from `CONTENT.md`'s template, using `t` for the time and `d` for the duration. Each row is a button deep-linking into the app, plus the promo code with a copy control and its expiry date.

3. Deep links: `calmisu://activity/<tool>`. **Verify the real scheme paths against the app's navigators before hardcoding.** `app.json` confirms `"scheme": "calmisu"`, but the per-activity route paths are *not* confirmed. If a route can't be confirmed, fall back to the bare `calmisu://` scheme. Every row needs an install fallback: if the app doesn't open within ~1.5s, send the user to the Play URL.

**Acceptance criteria:**
- [ ] `/quiz/result/?p=sleep` renders a complete profile with no other params present
- [ ] `/quiz/result/` with no params, and with garbage params, renders the fallback — never a crash or a blank screen
- [ ] The profile section is fully readable before any email is entered
- [ ] The consent checkbox is unchecked by default and submit is blocked until it is ticked
- [ ] After a successful submit the plan appears without a page reload
- [ ] Returning to the same URL later skips the gate; `localStorage` contains only the unlock flag
- [ ] Rendered HTML contains `noindex, follow`, and `/quiz/result` is absent from the sitemap
- [ ] `robots.txt` unchanged
- [ ] A plan row opens the app when installed, and Play when not

**Do not do in this task:** don't hard-gate the profile, don't persist answers anywhere.

---

## Task 5 — Capture client + promo code

**Goal:** the submit path is honest about success and failure, and the reward is real.

**Steps:**

1. Add to `src/lib/api.ts` (do not create a second api module):

   ```ts
   export async function postLead(body: {
     email: string; profile: string; source: string; locale: string; consent: boolean;
   }): Promise<void>
   ```

   Same shape as the existing `deleteAccount` — real `res.ok` check, throw the server's message. **No `mode: "no-cors"`.**

2. Create the shared promo code in the backend (admin path in `src/features/admin`, or direct SQL): `durationDays: 14`, `maxUses` high enough for the campaign, `expiresAt` set, `note: "quiz"`.
   The code value belongs in `PUBLIC_QUIZ_PROMO_CODE`; add it to `.env.example`. **Do not commit a real code value.**

3. On the plan, state plainly that the code is redeemed **inside the app, after creating an account** — `/promo/redeem` requires auth (`fastify.addHook('onRequest', fastify.authenticate)`). Do not imply it works anonymously.

4. Migrate `NotifyMe.tsx` to `postLead` with `source: 'ios_waitlist'`. Delete the `no-cors` call and the stale comment about reconciling against the sheet. Keep the existing `waitlist_submit` / `waitlist_error` events — they become truthful for the first time.

**Acceptance criteria:**
- [ ] A backend 500 surfaces a visible error in the UI and fires no success event
- [ ] `grep -r "no-cors" src/` returns nothing
- [ ] The promo code redeems in the app and grants 14 days
- [ ] `.env.example` documents `PUBLIC_QUIZ_PROMO_CODE`; no real code is committed
- [ ] `NotifyMe` still works end to end and now reports real failures

**Do not do in this task:** don't build per-lead unique codes.

---

## Task 6 — Email sequence

**Goal:** the visitors who install nothing on day one still have five reasons to come back.

Five emails, each built from a post that already exists in `src/content/blog/`:

| Day | Subject | Links to |
|---|---|---|
| 0 | Your Calm Profile + your 14-day code | plan URL |
| 2 | Why breathing out longer calms you fast | `extended-exhale-breathing-science` |
| 5 | You aren't bad at meditation | `why-letting-go-is-hard-for-exhausted-minds` |
| 9 | Same time, every day | `meditation-routine-consistency` |
| 14 | Your code expires tomorrow | plan URL + Play |

Every email needs a working unsubscribe link. Send from the backend's existing transport; a scheduled job fits the `src/jobs` directory already in that repo.

**Acceptance criteria:**
- [ ] All five send on schedule to a test address
- [ ] Unsubscribe works and stops all subsequent sends
- [ ] Every blog link resolves with a trailing slash and returns 200
- [ ] Day 14 is suppressed if the lead has already redeemed the code

---

## Task 7 — Contextual quiz CTAs in blog posts

**Goal:** the blog stops being a dead end. No generic newsletter box.

**Steps:**

1. Create `src/components/QuizCTA.astro`, taking a `variant` prop. Map from the post's existing `tags` frontmatter:

   | Tag | Variant | Angle |
   |---|---|---|
   | `panic attacks` | `panic` | "Find out which pattern yours follows" |
   | `breathing`, `nervous system` | `anxiety` | "Which technique fits your pattern?" |
   | `grounding` | `anxiety` | "Find your fastest way back" |
   | `meditation`, `habits` | `sleep` | "Build the routine that fits your day" |
   | `calligraphy`, `focus` | `racingThoughts` | "For minds that won't stop looping" |
   | anything else | `default` | generic |

   Copy in `CONTENT.md`. First matching tag wins; fall back to `default`.

2. Render it in `src/pages/blog/[...slug].astro` after the post body, before the byline/footer. It is static markup — **no island, no hydration cost.**

3. Link to `/quiz/?src=blog_<slug>` and read `src` in Task 9's `quiz_start` event.

**Acceptance criteria:**
- [ ] All 7 posts show a CTA, and at least 4 distinct variants appear across them
- [ ] A post with an unmapped tag renders the `default` variant
- [ ] No new JS ships on blog pages — verify the built HTML has no added hydration script

---

## Task 8 — iOS branch

**Goal:** stop sending iPhone visitors to a Play Store link they can't use. Today every site path ends at Play except one buried popup.

**Steps:**

1. Add `isIOS()` to `src/lib/` — UA-based, client-side only, must return `false` during SSR.
2. On `/quiz/result/`, when iOS: the plan's app buttons become a single "Calmisu is coming to iOS" block that opens the existing `NotifyMe` flow. Keep the profile and the 7-day plan fully visible — **the plan is readable without the app, that is the point.**
3. Use `source: 'ios_waitlist'` and skip the promo code (it can't be redeemed yet). Do not show a code the visitor cannot use.

**Acceptance criteria:**
- [ ] With an iOS UA, no Play links appear on the result page
- [ ] With an Android or desktop UA, behaviour is unchanged
- [ ] The iOS path still captures a lead, tagged `ios_waitlist`
- [ ] No hydration mismatch warning in the console

---

## Task 9 — Analytics

**Goal:** know where the funnel leaks.

Use the existing `track()` from `src/lib/analytics.ts`. Follow the established snake_case naming (`meditation_preview_play`, `waitlist_submit`).

| Event | Params |
|---|---|
| `quiz_start` | `src` (`homepage`, `nav`, `blog_<slug>`) |
| `quiz_question_answered` | `index`, `question_id` |
| `quiz_complete` | `profile` |
| `quiz_email_submit` | `profile` |
| `quiz_email_error` | `profile` |
| `quiz_plan_view` | `profile`, `returning` |
| `quiz_app_click` | `profile`, `tool`, `day` |

Reconcile against promo redemptions in the backend for the one number that isn't consent-gated.

**Acceptance criteria:**
- [ ] Every event above fires once per occurrence — verify in Firebase DebugView
- [ ] No event fires before cookie consent is granted
- [ ] `quiz_question_answered` fires with the right `index` on Back-then-forward, without double counting

---

## Targets

These are **hypotheses to falsify in the first month**, not benchmarks. Set the real baseline from week one.

| Metric | Starting hypothesis |
|---|---|
| `/quiz/` view → `quiz_start` | 30% |
| `quiz_start` → `quiz_complete` | 60% |
| `quiz_complete` → `quiz_email_submit` | 45% |
| `quiz_email_submit` → promo redemption | 15% |

The number that decides whether this was worth building is none of the above. It is **D7 retention of quiz-sourced installs vs. cold installs.** If that gap isn't material, the quiz is an expensive email form and should be cut back to a single CTA.

---

## Risks

**GDPR Article 9.** Q4 (body symptoms) and Q5 (thought patterns) are health data. The mitigation is architectural, not a policy note: those answers exist only in React state and in the URL the user holds. They are never sent to `/leads`, and there is no column that could hold them. Only `email`, `profile`, `source`, `locale` and `consent` persist. Keep it that way — a later "let's just log the full answers for analytics" is the failure mode to guard against.

**Framing.** No scores, no severity, no "you have". If the result page ever reads as a diagnosis, it inherits both clinical-claims liability and the mental-health ad-policy restrictions the app repo's `MARKETING.md` already flags. Every profile ends pointing at self-regulation tools, and the standing disclaimer — Calmisu is a self-help tool, not a substitute for professional care — must appear on the result page.

**Consent-gated analytics.** `track()` no-ops until the cookie banner is accepted, so every funnel number here undercounts. Promo redemptions are the only unbiased signal in the stack.

**Soft gate.** The plan URL is guessable by anyone who edits a query string. Accepted; hardening needs SSR this site doesn't have.

---

## Out of scope

Deliberately excluded. Revisit only after the D7 retention number is in.

- Writing the plan into the app (habits, pre-filled `onboardingReason`, Play install referrer)
- Per-lead unique promo codes
- Web checkout — monetization is Play-only today
- **PL/UA localization of the quiz.** Worth flagging: the app ships EN/PL/UK and the GTM targets Poland and Ukraine first, but this marketing site is English-only (`src/pages/[lang]/` covers only privacy and terms). A localized quiz is the cheapest test of that Tier-1 market — but it is a separate spec, after the EN funnel has real numbers.
