# Technical Specification: Calm Profile Quiz

- **Functional Specification:** [functional-spec.md](./functional-spec.md)
- **Status:** In Review
- **Author(s):** Serhii Kushnir

---

## 1. High-Level Technical Approach

This spans two repos:

- **`calmisu_landing` (this repo):** static Astro pages, two React islands (the quiz and the result), a single-source data module, pure logic that encodes the plan into the URL, a capture client in the existing `src/lib/api.ts`, a static blog CTA, and consent-gated analytics events.
- **`kumo_back-end` (Fastify + Prisma):** a `Lead` model, an unauthenticated rate-limited `POST /leads` endpoint that mints per-lead promo codes, an unsubscribe endpoint, the Day 0 email on capture, and a daily cron for the Day 2/5/6/9 sequence.

Plan state never touches the database. It lives in the URL the user holds.

**Deploy order:** backend first, then landing. The landing's copy promises a 7-day activation window, which the backend must already be minting.

---

## 2. Proposed Solution & Implementation Plan (The "How")

### Landing — data & logic

- `src/data/quiz.ts`: types `Profile` (`panic | anxiety | racingThoughts | sleep | notSure`, mirroring the app's `onboardingReason`) and `Tool` (`breath | kanji | meditation | grounding`); `questions` (9), `profiles` (5, each with `tools` in the app's `getHomeVariant()` order), and the plan day templates. All copy comes verbatim from `CONTENT.md`.
- `src/lib/quiz.ts`: `resolveProfile(answers)`, `encodePlan(state)` / `decodePlan(params)` (total: returns `null` on any malformed input and never throws), `recommendedTools`, `buildPlan`.
- **URL contract:** `/quiz/result/?p=<profile>&t=<morning|day|evening|night>&d=<2|5|10>&c=<alone|people>&m=<voice|visual|hands>&f=<frequency>`. Only `p` is required.

### Landing — pages & components

- `src/pages/quiz.astro`: `BaseLayout`, with the hero rendered on the server, and `QuizIsland` (`client:idle`).
- `src/components/QuizIsland.tsx`: answers kept in React state only. On completion it runs `window.location.href = "/quiz/result/?" + encodePlan(state)`.
- `src/pages/quiz/result.astro`: `noindexFollow`, with `QuizResultIsland` (`client:load`, because the content depends on the URL).
- `src/components/QuizResultIsland.tsx`: section A (profile), B (gate: platform radio, email, unchecked consent), C (plan + code). `localStorage` keys: `calmisu_quiz_unlocked`, `calmisu_quiz_promo_code`, `calmisu_quiz_promo_expires`. Deep links use `calmisu://` with a ~1.5s Play fallback.
- `src/components/QuizPromo.astro`: homepage entry point (static), placed between `FeaturesScience` and `AnimatedChatSection` in `src/pages/index.astro`.
- `src/components/QuizCTA.astro`: static blog CTA with `variant` + `src` props. The tag→variant map and its placement are in `src/pages/blog/[...slug].astro`.
- `src/data/navLinks.ts`: `Quiz` → `/quiz/?src=nav`.
- `astro.config.mjs`: the sitemap `filter` excludes `/quiz/result`.
- Design tokens: `font-display`, `bg-brand-100`, `rounded-2xl`, the `CTASection` padding scale, and a new `brand.300` token (`--brand-blue-300`) for selected option cards.

### Landing — capture client

- `src/lib/api.ts` `postLead({ email, profile?, source, platform, locale, consent, plan? })` does a real `res.ok` check and throws the server's message. It returns `{ ok, promoCode, promoExpiresAt }`.
- `src/components/popups/NotifyMe.tsx` sends `postLead` with `source: 'ios_waitlist'` and no profile. `PUBLIC_GOOGLE_APPS_SCRIPT_URL` is removed.

### Backend — data model (`kumo_back-end/prisma/schema.prisma`)

- `Lead` (`leads`): `id`, `email` (unique), `profile?`, `source` (`quiz | ios_waitlist`), `platform?` (`android | ios`), `locale`, `consent`, `consentScope?` (`quiz_plan_tips_v1 | ios_waitlist_notify_v1`, derived on the server and never supplied by the client; mint `_v2` if the copy changes, never redefine `_v1`), `consentAt?`, `unsubToken`, `unsubscribedAt?`, `promoCodeId?` → `PromoCode` (`onDelete: SetNull`), `createdAt`.
- `LeadEmail` (`lead_emails`): the sequence ledger, `@@unique([leadId, day])`.
- Migrations: `add_leads`, `add_lead_promo_code`, `add_lead_platform`, `add_lead_consent_scope_and_emails`.

### Backend — API contracts

- `POST /leads` is unauthenticated, rate-limited `max: 5 / 1 hour` per IP (following the `promo.routes.ts` pattern), and validated with Zod in `leads.schemas.ts`. It upserts on `email`, rejects `consent !== true`, accepts the short plan params as enums (so a caller can't point our email at their own host), and returns `{ ok, promoCode, promoExpiresAt }`.
  - The promo code: 10 random digits (the redeem schema is `/^\d+$/`), `maxUses: 1`, `note: "quiz"`, `durationDays: 14`, `expiresAt: now + 7 days`, retried on `P2002`.
  - Code decision (`isCodeSpent` / `isCodeReusable`): none → mint; unexpired and unredeemed → reuse; expired and unredeemed → mint; redeemed → `null`.
  - Branching: `quiz` + android/null → code + Day 0 email; `quiz` + ios → no code, Day 0 email with an App Store notice (`awaitingAppStore`); `ios_waitlist` → neither.
- `GET /leads/unsubscribe?token=` gives an identical response for unknown tokens, so it can't be used to discover which emails are on the list.

### Backend — email & jobs

- `src/services/email.service.ts`: `sendQuizPlanEmail` (Day 0) and `sendQuizDay2/5/6/9Email`, on the existing transport.
- `src/jobs/quizSequence.ts` `runQuizSequence()`, cron `0 9 * * *` (in `src/app.ts`).
  - A lead is eligible when `consentScope === 'quiz_plan_tips_v1'`, `consent`, not unsubscribed, has no ledger row for the day, and is within the age window `N ≤ ageDays < N + 2`. The query is bounded by `OLDEST_ELIGIBLE_AGE_DAYS`.
  - Day 6 ("expires tomorrow") also requires that the lead has a code, the code is unredeemed, and `expiresAt` falls within the next 48h. It reads the lead's actual code, never the constant.
  - The ledger row is written **before** the send, and the unique constraint acts as the concurrency lock. On a send failure the row is deleted and the error rethrown.

---

## 3. Impact and Risk Analysis

- **System Dependencies:** the app's `onboardingReason` and `getHomeVariant()` (the tool order must match), the `PromoCode` / `/promo/redeem` model (auth required), the backend email transport and CORS config, `BaseLayout`, the sitemap filter, and the consent banner that gates `track()`.
- **Potential Risks & Mitigations:**
  - *GDPR Art. 9 (Q4/Q5 are health data)* → mitigated by the architecture: answers stay in React state and the URL only, no column can hold them, and a test asserts the persisted column list. Guard against any later "log the full answers for analytics".
  - *Consent proof (Art. 7(1))* → `consentScope` records which wording each lead agreed to. The Privacy Policy field list and the consent sentence in `QuizResultIsland.tsx` are factual claims and must change whenever a stored field changes.
  - *Unlimited PRO through repeat codes* → one code per lead, ever.
  - *Clinical framing* → no scores or diagnosis language, and the disclaimer stays on the result page.
  - *Silent API misconfiguration* → `API_BASE_URL` falls back to `""` if the secret is missing, which turns requests into relative 404s. A build-time assert is on the roadmap.
  - *Draft email copy* → the Day 2/5/6/9 bodies are agent-written. Julia must rewrite them before a real list receives them. The first new lead gets Day 2 about 48h after the backend deploys.
  - *Blunt deep links* → the app has no per-activity routes, so rows open the app's home screen.
  - *Soft gate* → the plan URL can be edited. Accepted.
  - *Astro parse quirk* → a leading-pipe multiline union type in `.astro` frontmatter fails to parse. Use single-line unions.

---

## 4. Testing Strategy

- **Landing unit tests (Vitest):** `src/test/quiz.test.ts` covers profile resolution, including the `notSure` tiebreak, `decodePlan` totality, and the encode/decode round-trip.
- **Landing island tests (Testing Library + jsdom):** `src/test/quizIsland.test.tsx` covers navigation and Back, storage assertions (no answers stored), and the exact `postLead` payload shape.
- **Backend (`kumo_back-end`):** `test/leads/leads.test.ts` (validation, upsert, rate limit, code rules, platform branching, persisted column list, ignored client `consentScope`) and `test/leads/leadSequence.test.ts` (every eligibility rule, Day 6 suppression, ledger locking). The backend suite is 246/246 green, so any failure is a regression.
- **Build checks:** in `dist/`, `/quiz/` is in the sitemap, `/quiz/result/` has noindex and is absent from the sitemap, and the blog pages' `<script>` set is unchanged by the CTA.
- **Manual/E2E:** a real browser run of the capture from `calmisu.com` (CORS), Firebase DebugView for events, and a test-address run of the sequence.
