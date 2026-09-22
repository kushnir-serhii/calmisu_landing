# 008 — Progress

## Done — front end (2026-09-21)

| Task | Status |
|---|---|
| 1 — `POST /leads` (backend) | Done (2026-09-22) — see below |
| 2 — Quiz data module | Done |
| 3 — `/quiz/` page | Done |
| 4 — `/quiz/result/` | Done |
| 5 — Capture client + promo code | Done — per-lead codes, nothing to create by hand |
| 6 — Email sequence | Done (2026-09-22) — **copy needs Julia's sign-off before it ships**, see below |
| 7 — Blog CTAs | Done (2026-09-22) — see below |
| 8 — iOS branch | Done — superseded 2026-09-22 by an explicit platform choice, not UA detection |
| 9 — Analytics | Done |

### Files added

- `src/data/quiz.ts` — 9 questions, 5 profiles, plan day templates
- `src/lib/quiz.ts` — `resolveProfile`, `encodePlan` / `decodePlan`, `recommendedTools`, `buildPlan`
- `src/components/QuizIsland.tsx` — the quiz (`client:idle`)
- `src/components/QuizResultIsland.tsx` — profile / gate / plan (`client:load`)
- `src/components/QuizPromo.astro` — homepage entry point, static markup
- `src/pages/quiz.astro`, `src/pages/quiz/result.astro`
- `src/test/quiz.test.ts` (20), `src/test/quizIsland.test.tsx` (14)
- `public/images/quiz/*.webp` — the app's own onboarding icons, copied over

### Files touched

- `src/index.css` + `tailwind.config.ts` — added `--brand-blue-300` / `brand.300`, mirroring the app's `blue.300` selected-card border
- `astro.config.mjs` — sitemap now also excludes `/quiz/result`
- `src/data/navLinks.ts` — added Quiz
- `src/pages/index.astro` — `QuizPromo` in the old ReviewsSection slot, delay 200
- `src/lib/api.ts` — `postLead()` added (stubbed, see below)
- `.env.example` — `PUBLIC_QUIZ_PROMO_CODE`, `PUBLIC_LEADS_STUB`

### Verified

- `npm run build` — 29 pages, clean
- `npm run test` — 35/35
- `npm run lint` — 14 problems, **identical to the pre-change baseline**; all new files lint clean
- `/quiz/` is in `sitemap-0.xml`; `/quiz/result/` is not, and carries `noindex, follow`
- `/quiz/`'s H1 and intro are in the static HTML with JS disabled
- Storage assertions are in the test suite, not just by inspection

---

## Done — Task 1, lead capture (2026-09-22)

Mobile review of `/quiz/` passed, so the front end is signed off.

### `kumo_back-end` (branch `quiz-codes`, commit `f5927eb`)

- `prisma/schema.prisma` — `Lead` model + `prisma/migrations/20260922120000_add_leads/`
- `src/features/leads/leads.schemas.ts`, `leads.routes.ts`
- `src/services/email.service.ts` — `sendQuizPlanEmail()` (Day 0)
- `src/config/env.ts` — `LANDING_URL`, `QUIZ_PROMO_CODE`; both also in `.env.example`
- `src/app.ts` — routes registered at `/leads`
- `test/leads/leads.test.ts` (14), plus `leads` added to `truncateAll` and the email mock
- `CLAUDE.md` — table + endpoints documented

### Two calls made beyond the literal spec

**a. The client sends a `plan` object, the backend does not store it.** The Day-0 email has to link to the visitor's actual plan, and the spec's copy quotes their time and duration. So `POST /leads` accepts the six short result-page params (`t`, `d`, `c`, `m`, `f` — `p` is `profile`), each validated as an enum, and rebuilds the URL from `LANDING_URL`. They are used to render the email and then dropped. Persisted fields are still exactly `email`, `profile`, `source`, `locale`, `consent` — a test asserts the full column list.

Enums rather than a `planUrl` string on purpose: a caller must not be able to point an email we send at their own host.

**b. Unsubscribe shipped now, not in Task 6.** A marketing email without a working opt-out is not shippable, so the model carries `unsubToken` + `unsubscribedAt` and there is a `GET /leads/unsubscribe?token=`. It answers identically for an unknown token so it can't be used to enumerate addresses. Task 6 inherits this rather than adding it.

### Superseded: per-lead promo codes, not one shared code (2026-09-22)

The product decision "one shared code with `maxUses` high" is **withdrawn**. Each lead now gets its own code, minted at capture.

- `durationDays: 14` — PRO granted **once redeemed**. Unchanged.
- `expiresAt: now + 7 days` — the window to **activate**. These are two different clocks and the copy in both the email and Section C now says so explicitly. Do not re-collapse them.
- `maxUses: 1`, `note: "quiz"`, so the codes list in the admin app alongside hand-made ones.
- **Codes are digits only** — `createPromoCodeSchema` and `redeemCodeSchema` both enforce `/^\d+$/`, 4–20 chars. Generated as 10 random digits with a retry on `P2002`. A non-numeric code would create fine and then fail redemption.
- `Lead.promoCodeId` → `PromoCode`, `onDelete: SetNull`. Migration `20260922130000_add_lead_promo_code`.
- `POST /leads` returns `{ ok, promoCode, promoExpiresAt }`. The result page renders the code immediately and mirrors it into `localStorage` (`calmisu_quiz_promo_code` / `_expires`) so a returning visitor still sees their own. `QUIZ_PROMO_CODE` and `PUBLIC_QUIZ_PROMO_CODE` are both gone.

**One code per lead, ever — this is load-bearing.** `PromoCodeRedemption` is unique per `(promoCodeId, userId)`, so a *second* code is redeemable by the same account all over again. Minting one for a lead who already redeemed would make the quiz an unlimited PRO tap: submit → redeem → resubmit → repeat. The rule in `isCodeSpent()`:

| Lead's existing code | Behaviour |
|---|---|
| none | mint |
| unexpired, unredeemed | return the same one — never a second |
| expired, unredeemed | mint (they never got the value) |
| **redeemed** | **no code — returns `null`** |

### Also closed

- **`postLead` is no longer stubbed.** The short-circuit and `PUBLIC_LEADS_STUB` are gone from `src/lib/api.ts` and `.env.example`.
- `QuizResultIsland` now passes `plan` through; `quizIsland.test.tsx` asserts the exact payload shape.

### Verified

- `npx prisma validate`, `npx tsc --noEmit` — clean
- `npm run db:test:setup` — the new migration applies to a real Postgres
- Backend `test/leads` — 14/14
- Landing `npm run test` — 36/36; `npm run build` — 29 pages, clean

### The backend suite was red — now resolved (2026-09-22)

The earlier note here said "13 pre-existing failures in `rc-webhook.test.ts`." That undercounted. It was **17 failures across 3 files**, and all 17 were **test-side defects — no production bug**.

Proven by running the suite at `f5927eb` and again at its parent `3c00c47`: identical 17 both times, so the lead-capture work caused none of them.

| Failures | File | Cause |
|---|---|---|
| 13 | `test/subscription/rc-webhook.test.ts` | `.env.test` had `REVENUECAT_SANDBOX=false` while the fixtures send `environment: 'SANDBOX'`. The guard added in `3188ad2` therefore made every event log-only. These tests were not merely red — they were **vacuous**, rejecting each event before exercising any logic. |
| 3 | `test/habits/habitReminders.job.test.ts` | Mock resolved `recipients: 0`; `sendReminder()` deliberately skips the `lastFiredAt` write when nothing was delivered. Stale fixture. |
| 1 | `test/media/meditations.route.test.ts` | `GET /media/meditations` was made public on purpose in `02fc311` (per-track `access`, fail-locked); the test still asserted the old 401. |

Fixed in `kumo_back-end`, test files only, no `src/` changes. **Suite is now 224/224.**

Two notes on *how*, because a naive fix would have rotted:

- `rc-webhook.test.ts` no longer reads ambient env. It mocks `src/config/env` and forces the flag on, mirroring the pattern already in `meditations.route.test.ts`. `.env.test` is **gitignored**, so editing it would have fixed the suite on one machine only. Verified by restoring `.env.test` to `false` and re-running: still green.
- The media test now asserts a `premium` track is still labelled `premium` for an unauthenticated caller. That is the property worth protecting once the route is public — the old 401 assertion was standing in for it.

**There is no test-running CI in `kumo_back-end`.** The only workflow is Neon PR branching. Nothing has ever gated on these tests, which is how 17 stayed red. Now that the suite passes from a clean clone, wiring it up is cheap and is the highest-value next backend chore.

---

## Done — explicit platform choice (2026-09-22)

### Why this exists

The result page used to guess the phone OS from the user-agent and, if it looked like iOS, submit `source: 'ios_waitlist'` instead of `'quiz'` — suppressing both the code and the email. Two things were wrong with that:

1. **A user-agent cannot know what phone you own.** Someone on a Windows laptop with an iPhone in their pocket was served the Android path and issued a code they could never redeem. Desktop is a large share of quiz traffic, so this was likely a *bigger* miss than iOS itself. No detection can fix this in principle — only asking can.
2. **It jammed two facts into one column.** `source` meant both "which form" and "which phone", which is exactly why quiz-takers and notify-me-modal users had become indistinguishable for consent purposes.

### What changed

**The visitor now chooses.** A two-option radio group ("Which phone do you use?" — iPhone / Android) sits above the email input on the gate, styled as an exact copy of the quiz's own option cards (`border-2`, `rounded-xl`, `bg-white border-brand` selected). The UA sniff is kept, demoted to the **preselect** — so mobile keeps its zero friction and desktop gets corrected. A ref guards against the async UA resolution clobbering a manual choice.

Design note: pills above **one** submit button, not two submit buttons. The gate has a single full-width `bg-brand` primary action; two brand-filled submits would compete at the exact point where hesitation costs conversions. The offer line rewrites on selection, so the promise is visible before committing.

**`source` and `platform` are now independent.** The quiz always sends `source: 'quiz'`; `'ios_waitlist'` now comes **only** from the NotifyMe modal. `platform` is `'android' | 'ios' | null`.

**The two decisions in `POST /leads` were split:**

| | Promo code | Day 0 plan email |
|---|---|---|
| `source: 'quiz'`, platform android/null | yes | yes, with code |
| `source: 'quiz'`, platform ios | **no** | **yes**, no code + App Store notice |
| `source: 'ios_waitlist'` | no | no |

iOS visitors earned the plan by finishing the quiz and the copy promises it, so they get it — just not a code they cannot redeem. The null-promo email path already existed (the "already redeemed" branch), so it was reused rather than reinvented; `awaitingAppStore` distinguishes the two null cases, because "already redeemed" must **not** start promising an App Store notice.

`isCodeReusable` / `isCodeSpent` and the one-code-per-lead rule were left untouched.

### Privacy policy

The policy enumerates stored fields after the word **"only"**, which `platform` made false. Added in all three languages (en/pl/ua), and the stale "(the quiz or the iOS waitlist)" parenthetical was corrected to the app waitlist signup, since the quiz no longer produces that value. **If you add another stored field, this list and the consent-checkbox sentence in `QuizResultIsland.tsx` are both factual claims — update them with it.**

### Shipped

- Backend: PR #71 (`lead-platform`), merged to main, auto-deployed. Migration `20260922150000_add_lead_platform` applied in production 16:06:25Z, no rollback. Suite **227/227**.
- Landing: commit `603edba` on `quize-page`. **39/39**, build clean, no new lint.
- `platform` is nullable — additive, no backfill (prod `leads` had 0 rows).

---

---

## Done — Task 6, the email sequence (2026-09-22)

Days 2/5/9/14 now send from a daily cron. Day 0 and unsubscribe already shipped in Task 1, so this
inherited both rather than rebuilding them.

### `kumo_back-end` (branch `quiz-sequence`, commit `d32cc93`) — **not pushed, no PR opened**

- `prisma/schema.prisma` — `Lead.consentScope` / `Lead.consentAt`, new `LeadEmail` model, migration
  `20260922170000_add_lead_consent_scope_and_emails`. Both columns nullable, additive, no backfill.
- `src/consts/leads.ts` (new) — `CONSENT_SCOPE_QUIZ` / `CONSENT_SCOPE_IOS_WAITLIST`
- `src/jobs/quizSequence.ts` (new) — `runQuizSequence()`, wired in `src/app.ts` at `0 9 * * *`
- `src/services/email.service.ts` — `sendQuizDay2Email` / `Day5` / `Day9` / `Day14`
- `test/leads/leadSequence.test.ts` (new, 15), `test/leads/leads.test.ts` extended

### `consentScope` — what Art. 7(1) actually needed

The open question from the last session is closed. `consent: true` could prove *that* someone
consented; it could not prove *to what*.

`consentScope` records the copy they agreed under: `quiz_plan_tips_v1` (the quiz gate's explicit
unticked checkbox) or `ios_waitlist_notify_v1` (the NotifyMe modal — narrow consent to one App Store
ping, no checkbox). `consentAt` stamps every submission, not just the first, because re-submitting is
itself a fresh opt-in — that is already why the update branch clears `unsubscribedAt`.

Three things about it are load-bearing:

- **Server-derived, never client-supplied.** Neither field is in `createLeadSchema`, and a test asserts
  a client-sent `consentScope` is ignored. A caller must not be able to assert what copy they were shown.
- **The `_v1` suffix is not decoration.** If the consent copy changes materially, mint `_v2`. Never
  redefine `_v1` — old rows have to keep meaning what they meant when they were written.
- **The sequence filters on `consentScope`, not on `source`.** That is the whole point. The rule the
  last session said to "make a test, not a comment" now reads the recorded consent directly.

Consequence, and it is intended: leads captured before this migration have `consentScope: null` and
get **no sequence emails at all**. We cannot demonstrate what they agreed to, so we do not send.

### The activation window moved 7 → 15 days

Day 14's subject is `Your code expires tomorrow`. That copy was written when the plan was one shared
code; per-lead codes expire 7 days after capture, so on day 14 the code had been dead for a week.

`QUIZ_PROMO_ACTIVATION_WINDOW_DAYS` is now **15**, making the email true. `QUIZ_PROMO_DURATION_DAYS`
(14 days of PRO once redeemed) is **unchanged** — still two different clocks, still stated separately
in both the email and Section C. Do not shrink the window back toward 7 without moving or dropping
that email; the constant's comment says so.

**This does not reach codes already minted.** Existing leads keep their 7-day `expiresAt`, so Day 14
is suppressed for them as expired. The first cohort silently skips the last email. Correct, but know it.

### How the job decides

Eligibility, every line of it covered by a test:

- `consentScope === 'quiz_plan_tips_v1'`, `consent === true`, `unsubscribedAt === null`
- no `LeadEmail` row for `(leadId, day)`
- age window `N <= ageDays < N + 2` — the 2-day catch-up survives a missed cron run, and the upper
  bound is what stops the first-ever run blasting a backlog of old leads with the whole sequence
- the query is bounded by `createdAt >= now - OLDEST_ELIGIBLE_AGE_DAYS`, derived from
  `SEQUENCE_DAYS` + `CATCH_UP_WINDOW_DAYS`, so a daily job doesn't scan every lead ever captured

Day 14 carries three more, because it is the only email whose copy leans on the code: skip when there
is no `promoCodeId` (iOS leads never get one), when the code is redeemed, and when `expiresAt` is
null, past, or more than 48h out. **It reads the lead's actual code, never the constant** — that is
what keeps "expires tomorrow" honest for a lead whose window predates the widening.

**The ledger row is written before the send, not after.** `@@unique([leadId, day])` is the
concurrency lock: a second overlapping run's `create` fails and that run skips the lead, instead of
both racing to send. If the send then throws, the row is deleted and the error rethrown, so the lead
stays eligible within its catch-up window rather than being silently skipped forever with nothing
delivered.

### Landing (commit `637c074` on `quize-page`)

- `QuizResultIsland.tsx` — both "7 days to activate" strings → 15. `"Your 7 days"` is the plan
  heading, a third unrelated number, untouched.
- `Privacy.en/pl/ua.tsx` — one new stored-field bullet for `consentScope`, same position in all three.
  `consentAt` needed none: "The fact that you gave consent, and when" already claimed it, and was
  arguably untrue until now.

### Verified

- `npx tsc --noEmit` clean; `npm run db:test:setup` applies the migration to real Postgres
- Backend `npm test` — **246/246** (baseline was 227), run and confirmed directly, not taken on report
- Landing — 39/39, `npm run build` clean at 29 pages, no new lint

### Before this ships

**The day 2/5/9/14 body copy is agent-written, not Julia's.** `CONTENT.md` §6 scripts Day 0 in full
but gives the other four only a subject line and a one-line brief ("short lead-in, link to X, one line
back to the plan"). The structure matches the spec; the words are a **draft**. The spec says "Do not
invent copy" — so read `email.service.ts` and rewrite in Julia's voice before sending to a real list.

Also still to do: push `quiz-sequence`, open the PR, and deploy. Nothing new is needed in Railway env
— no new variables.

**Deploy the backend before the landing, not the other way round.** The landing's `quize-page`
carries the "activate within 15 days" copy; `main` still mints 7-day codes until `quiz-sequence` is
merged. Landing ships on push to `main` via GitHub Pages, backend auto-deploys on merge — so pushing
the landing first would have the site promise 15 days while every code issued is still good for 7.
The reverse order is harmless: 15-day codes under copy that says 7 merely understates.

Second-order, worth knowing rather than acting on: merging the backend starts the cron. No existing
production lead can receive anything (`consentScope: null` excludes all of them), but the first *new*
quiz lead gets the draft Day 2 copy about 48h later. That is the window to land Julia's rewrite in,
not a margin to rely on.

## Open for the next session

**1. ~~Create the shared promo code.~~** Done differently — codes are now minted per lead, see above. No manual row to create, no code value in any env var.

**2. ~~`/leads` needs deploying.~~ DONE (2026-09-22)** — backend is live in production; see the platform section below. Original analysis kept for reference: checked 2026-09-22 — **less to do than this item used to claim**, and the 17 red tests never gated it (see above):

- **`LANDING_URL` needs nothing set on Railway.** It is `z.string().default('https://calmisu.com')` in `src/config/env.ts:44`, and that default matches production exactly (`astro.config.mjs` `site` + `public/CNAME`). It will not crash on boot and will not be wrong. `QUIZ_PROMO_CODE` was removed again, so there is **no new env var at all**.
- **`prisma migrate deploy` runs on boot** via the `start` script and applies both `leads` migrations.
- **`PUBLIC_API_BASE_URL` is already wired** in `.github/workflows/deploy.yml` from the existing `VITE_API_BASE_URL` secret, and the shipped `/delete-account` page already depends on it — if it were unset, account deletion would already be broken in production. Worth a glance, not a blocker.

Sharp edge to know: `API_BASE_URL = import.meta.env.PUBLIC_API_BASE_URL ?? ""` (`src/lib/api.ts:3`) degrades **silently** to a relative `/leads` if that secret ever goes missing. The stub used to mask this; now it just 404s on a static host. A build-time assert would be the honest fix.

**3. Per-activity deep links are not possible today — app change required.**
Confirmed in `calmisu/App.tsx`: `linking.config.screens` maps only `password-reset`, `password-set` and `email-verified`. There is no activity route, so `calmisu://activity/breath` would resolve to nothing.

The plan's Start buttons therefore open `calmisu://` (the app's default screen) with a 1.5s fallback to Play. To make a row open the *specific* activity, the app has to add those routes to its linking config first. Until then the button is honest but blunt — it opens the app, not the exercise.

**4. ~~Not yet done: blog CTAs (Task 7) and the email sequence (Task 6).~~** Task 6 is **done**
(2026-09-22) — see its section above. Every constraint this item used to list is now enforced in
`src/jobs/quizSequence.ts` and covered by a test in `test/leads/leadSequence.test.ts`, including the
`consentScope` column this item called "still worth doing".

**Task 7 (blog CTAs) is the only implementation task left**, and it is unblocked — it touches nothing
Task 6 changed.

Two things Task 6 left on the table, neither of them code:

- **The day 2/5/9/14 copy needs Julia.** It is a draft written to CONTENT.md §6's structure, not her
  words. Do not send it to a real list first.
- **`quiz-sequence` is committed but unpushed.** Push, PR, deploy. No new env vars.

**5. ~~`NotifyMe.tsx` is on `no-cors`.~~** Done (2026-09-22). It posts to `postLead` with `source: 'ios_waitlist'`; `grep -r "no-cors" src/` returns nothing, and `waitlist_submit` / `waitlist_error` now reflect real outcomes rather than attempts.

Consequences worth knowing:
- **`PUBLIC_GOOGLE_APPS_SCRIPT_URL` is dead.** Removed from `.env.example` and `.github/workflows/deploy.yml`. The `VITE_GOOGLE_APPS_SCRIPT_URL` repo secret can be deleted, and the Apps Script itself retired once the existing sheet is exported.
- The waitlist had no consent checkbox and still doesn't. The modal does exactly one thing, so submitting it is the opt-in — but a line under the button now states what is stored and why, because `consent: true` is a factual claim the backend records. If that modal ever grows a second purpose, it needs a real checkbox.
- `LeadPayload.profile` is now optional; the waitlist sends no profile.

**6. Privacy policy is now linked from both capture forms** (2026-09-22) — Art. 13 wants purpose and rights reachable at the point of collection.

The correct href is **`/en/privacy-policy/`**, not `/privacy-policy/`. The page is language-prefixed (`src/pages/[lang]/privacy-policy.astro` → `/en/`, `/pl/`, `/uk/`), and there is a *separate* `/alma/<lang>/` set for a different product — don't link those by mistake. I linked the wrong path first and the build caught it.

In the quiz gate the link sits in the small print **below** the button, deliberately outside the `<label>`: a link inside it would toggle the consent checkbox as well as follow the href.

**Pre-existing nit, not fixed:** `src/components/CookieConsent.tsx:29` links `/en/privacy-policy` with no trailing slash, against `trailingSlash: "always"` — it redirects rather than 404s, so it works, but it's inconsistent.

### ~~Still open on consent~~ — closed by Task 6 (2026-09-22)

`consentScope` now records what each source agreed to, and the sequence filters on it. The reasoning
that used to sit here — narrow single-purpose consent for `ios_waitlist`, bundled "plan + tips"
consent for `quiz` — is unchanged and is now written into `src/consts/leads.ts`, next to the constants
it justifies, where the code that depends on it can be read alongside it.

---

## Done — Task 7, blog CTAs (2026-09-22)

### Files added

- `src/components/QuizCTA.astro` — static markup, `variant` + `src` props. Copy is CONTENT.md §7
  verbatim, no invented lines.

### Files touched

- `src/pages/blog/[...slug].astro` — tag→variant map (SPEC.md Task 7 table) as a plain object; first
  matching tag in the post's own tag order wins, unmapped falls back to `default`. `<QuizCTA>` renders
  between the article body and the existing download-buttons block, before the byline/footer. Links to
  `/quiz/?src=blog_<slug>` — `quiz_start` already forwards whatever `src` it's given, so no changes
  needed there.

### Verified

- All 7 posts checked against the built HTML: 5 distinct variants appear (`panic`, `anxiety` ×2,
  `racingThoughts`, `sleep` ×2, `default`), and the one post with no mapped tag
  (`ai-companion-anxiety-guardrails`, tags `behind calmisu`/`mental health`/`ai`) renders `default`
  as expected.
- Diffed a built blog page's `<script>` tags before and against after — identical, so the CTA adds no
  hydration script.
- `npm run build` — 29 pages, clean. `npm run test` — 39/39. `npm run lint` — 12 problems, all
  pre-existing in unrelated `src/components/ui/*` files.

Note while building this: `export type X = | "a" | "b"` (leading-pipe multiline union) inside an
`.astro` frontmatter block fails Astro's esbuild parse with `Unexpected "|"`. Single-line union worked.
Not investigated further since the single-line form is fine here, but worth knowing before reaching
for a multiline union in another `.astro` file.
