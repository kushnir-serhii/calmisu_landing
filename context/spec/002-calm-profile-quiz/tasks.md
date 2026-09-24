# Tasks: Calm Profile Quiz

> Migrated from the pre-AWOS spec 008 (tasks 1–9). Implementation slices 1–8 are complete. What remains: acceptance-level regression tests (Slice 9) and the release (Slice 10).
>
> Release state as of 2026-09-23:
> - **Backend:** `kumo_back-end` `quiz-sequence` (commit `d32cc93`, the Day 2/5/9/14 cron + 15-day window; since 2026-09-23, uncommitted: 7-day window + Day 6 reminder) exists **locally only**. It isn't pushed and has no PR. `main` has lead capture (PR #70) and platform tracking (PR #71).
> - **Landing:** `quiz-cta` (7-day copy, privacy field list, blog CTAs) is pushed but **not merged** to `main`.

- [x] **Slice 1: Quiz data and pure logic**
  - [x] Create `src/data/quiz.ts` with 9 questions, 5 profiles and plan templates, taken verbatim from `CONTENT.md`, with `tools` in the app's `getHomeVariant()` order. **[Agent: general-purpose]**
  - [x] Create `src/lib/quiz.ts`: `resolveProfile`, total `encodePlan` / `decodePlan`, `recommendedTools`, `buildPlan`. **[Agent: general-purpose]**
  - [x] Verify: `src/test/quiz.test.ts` covers profile resolution, the `notSure` tiebreak, `decodePlan` on garbage/missing/out-of-range input, and the round-trip. `npm run test` is green. **[Agent: general-purpose]**

- [x] **Slice 2: `/quiz/` page and entry points**
  - [x] Create `src/pages/quiz.astro` (server-rendered hero) and `src/components/QuizIsland.tsx` (`client:idle`, answers in memory only). **[Agent: react-islands]**
  - [x] Add the `QuizPromo.astro` homepage block in the old reviews slot, and `Quiz` to `navLinks.ts`. Add the `brand.300` token. **[Agent: tailwind-stylist]**
  - [x] Verify: the H1 and intro are in the HTML with JS disabled, Back preserves answers, no storage writes happen, and `/quiz/` is in the sitemap. **[Agent: react-islands]**

- [x] **Slice 3: `/quiz/result/` free profile**
  - [x] Create `src/pages/quiz/result.astro` (`noindexFollow`) and exclude `/quiz/result` from the sitemap filter. **[Agent: content-seo]**
  - [x] Build `QuizResultIsland.tsx` section A (profile) plus the fallback for bad params, hydrated `client:load`. **[Agent: react-islands]**
  - [x] Verify: `?p=sleep` renders a full profile, no or garbage params render the fallback, noindex is present, and it's absent from the sitemap. **[Agent: react-islands]**

- [x] **Slice 4: Backend lead capture with per-lead codes (`kumo_back-end`)**
  - [x] Add the `Lead` model + migrations, `leads.schemas.ts` / `leads.routes.ts` (`POST /leads`, rate-limited, upsert, consent required), per-lead code minting with the one-code-per-lead rule, `GET /leads/unsubscribe`, and the Day 0 `sendQuizPlanEmail`. **[Agent: general-purpose]**
  - [x] Verify: `test/leads/leads.test.ts` is green, including the persisted-column-list assertion. The migration applies to a real Postgres. **[Agent: general-purpose]**

- [x] **Slice 5: Email gate, plan and code on the result page**
  - [x] Add `postLead()` to `src/lib/api.ts` (real `res.ok`, no `no-cors`). Build sections B (gate with unchecked consent + privacy link) and C (7-day plan, code with copy control, both clocks stated), and the `calmisu://` deep links with a Play fallback. **[Agent: react-islands]**
  - [x] Verify: `quizIsland.test.tsx` asserts the payload shape and that only the unlock flag and code are stored. A backend error surfaces in the UI. **[Agent: react-islands]**

- [x] **Slice 6: Explicit phone choice and iOS path**
  - [x] Add the iPhone/Android radio (UA only preselects, manual choice wins) and make `source` and `platform` independent. Backend: no code for iOS quiz leads, Day 0 email with an App Store notice (PR #71). Add `platform` to the privacy policy in EN/PL/UK. **[Agent: react-islands]**
  - [x] Migrate `NotifyMe.tsx` to `postLead` (`source: 'ios_waitlist'`) and remove the Apps Script env var. **[Agent: react-islands]**
  - [x] Verify: with iPhone chosen there are no Play links and no code. `grep -r "no-cors" src/` is empty. The backend suite is green. **[Agent: general-purpose]**

- [x] **Slice 7: Follow-up email sequence (`kumo_back-end`)**
  - [x] Add `consentScope` / `consentAt` and the `LeadEmail` ledger, `runQuizSequence()` on a `0 9 * * *` cron, Day 2/5/9/14 senders, and the 15-day activation window *(changed 2026-09-23 to 7 days + Day 6 reminder — see functional-spec Change Log)*. Update the landing's 15-day copy and add `consentScope` to the privacy policy. **[Agent: general-purpose]**
  - [x] Verify: `test/leads/leadSequence.test.ts` covers every eligibility rule. The backend suite is 246/246 and the landing build is clean. **[Agent: general-purpose]**

- [x] **Slice 8: Blog CTAs and funnel analytics**
  - [x] Create `QuizCTA.astro` (static) and the tag→variant map in `src/pages/blog/[...slug].astro`, linking `/quiz/?src=blog_<slug>`. **[Agent: content-seo]**
  - [x] Wire `quiz_*` events through `track()`, consent-gated and without double-counting on Back. **[Agent: react-islands]**
  - [x] Verify: all 7 posts have a CTA (5 variants, `default` on the unmapped post), and the blog `<script>` set is unchanged. **[Agent: content-seo]**

- [x] **Slice 9: Feature Testing & Regression**

  > Verifies the whole feature end-to-end against functional-spec.md, run after all implementation slices are complete.
  - [x] Read functional-spec.md acceptance criteria in full. Generate acceptance-level tests that verify the entire feature as a whole — not individual slices. Cover applicable layers (unit for pure logic, integration for service interactions, e2e for user flows) based on the project's testing stack. Write tests with RED validation (must fail before implementation is confirmed done). Annotate each test with `@spec: 002-calm-profile-quiz` and `@regression` if suitable for long-term regression. **[Agent: general-purpose]**
  - [x] Run all generated tests. All must pass. Fix any failures before proceeding. **[Agent: general-purpose]**

- [ ] **Slice 10: Release**

  > Human prerequisite, not agent work: Julia rewrites the Day 2/5/6/9 email bodies in `kumo_back-end/src/services/email.service.ts` in her own voice. The current text is an agent-written draft. Don't send it to a real list.
  - [ ] Push `kumo_back-end` `quiz-sequence`, open the PR, and confirm the suite is green before merge. No new env vars are needed. **[Agent: general-purpose]**
  - [ ] After the backend has deployed (it mints 7-day codes), merge the landing `quiz-cta` branch to `main`. Deploy the backend first, never the landing first. **[Agent: astro-architect]**
  - [ ] Verify in production: a quiz submission from `calmisu.com` returns a code expiring in 7 days, the plan email arrives, and a blog post shows its quiz CTA. **[Agent: general-purpose]**
