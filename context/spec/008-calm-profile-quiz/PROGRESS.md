# 008 — Progress

## Done — front end (2026-09-21)

| Task | Status |
|---|---|
| 1 — `POST /leads` (backend) | Done (2026-09-22) — see below |
| 2 — Quiz data module | Done |
| 3 — `/quiz/` page | Done |
| 4 — `/quiz/result/` | Done |
| 5 — Capture client + promo code | Done — per-lead codes, nothing to create by hand |
| 6 — Email sequence | Not started — **unblocked**, Day 0 + unsubscribe already ship |
| 7 — Blog CTAs | Not started |
| 8 — iOS branch | Done (built into Task 4 rather than deferred) |
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

## Open for the next session

**1. ~~Create the shared promo code.~~** Done differently — codes are now minted per lead, see above. No manual row to create, no code value in any env var.

**2. `/leads` needs deploying.** The endpoint only exists locally. Checked 2026-09-22 — **less to do than this item used to claim**, and the 17 red tests never gated it (see above):

- **`LANDING_URL` needs nothing set on Railway.** It is `z.string().default('https://calmisu.com')` in `src/config/env.ts:44`, and that default matches production exactly (`astro.config.mjs` `site` + `public/CNAME`). It will not crash on boot and will not be wrong. `QUIZ_PROMO_CODE` was removed again, so there is **no new env var at all**.
- **`prisma migrate deploy` runs on boot** via the `start` script and applies both `leads` migrations.
- **`PUBLIC_API_BASE_URL` is already wired** in `.github/workflows/deploy.yml` from the existing `VITE_API_BASE_URL` secret, and the shipped `/delete-account` page already depends on it — if it were unset, account deletion would already be broken in production. Worth a glance, not a blocker.

Sharp edge to know: `API_BASE_URL = import.meta.env.PUBLIC_API_BASE_URL ?? ""` (`src/lib/api.ts:3`) degrades **silently** to a relative `/leads` if that secret ever goes missing. The stub used to mask this; now it just 404s on a static host. A build-time assert would be the honest fix.

**3. Per-activity deep links are not possible today — app change required.**
Confirmed in `calmisu/App.tsx`: `linking.config.screens` maps only `password-reset`, `password-set` and `email-verified`. There is no activity route, so `calmisu://activity/breath` would resolve to nothing.

The plan's Start buttons therefore open `calmisu://` (the app's default screen) with a 1.5s fallback to Play. To make a row open the *specific* activity, the app has to add those routes to its linking config first. Until then the button is honest but blunt — it opens the app, not the exercise.

**4. Not yet done:** blog CTAs (Task 7) and the email sequence (Task 6). Task 6 is now unblocked — Day 0 already sends, and unsubscribe exists, so what remains is days 2/5/9/14 and the `src/jobs` scheduler. Day 14 must still be suppressed when the lead has redeemed the code.

**5. ~~`NotifyMe.tsx` is on `no-cors`.~~** Done (2026-09-22). It posts to `postLead` with `source: 'ios_waitlist'`; `grep -r "no-cors" src/` returns nothing, and `waitlist_submit` / `waitlist_error` now reflect real outcomes rather than attempts.

Consequences worth knowing:
- **`PUBLIC_GOOGLE_APPS_SCRIPT_URL` is dead.** Removed from `.env.example` and `.github/workflows/deploy.yml`. The `VITE_GOOGLE_APPS_SCRIPT_URL` repo secret can be deleted, and the Apps Script itself retired once the existing sheet is exported.
- The waitlist had no consent checkbox and still doesn't. The modal does exactly one thing, so submitting it is the opt-in — but a line under the button now states what is stored and why, because `consent: true` is a factual claim the backend records. If that modal ever grows a second purpose, it needs a real checkbox.
- `LeadPayload.profile` is now optional; the waitlist sends no profile.

**6. Privacy policy is now linked from both capture forms** (2026-09-22) — Art. 13 wants purpose and rights reachable at the point of collection.

The correct href is **`/en/privacy-policy/`**, not `/privacy-policy/`. The page is language-prefixed (`src/pages/[lang]/privacy-policy.astro` → `/en/`, `/pl/`, `/uk/`), and there is a *separate* `/alma/<lang>/` set for a different product — don't link those by mistake. I linked the wrong path first and the build caught it.

In the quiz gate the link sits in the small print **below** the button, deliberately outside the `<label>`: a link inside it would toggle the consent checkbox as well as follow the href.

**Pre-existing nit, not fixed:** `src/components/CookieConsent.tsx:29` links `/en/privacy-policy` with no trailing slash, against `trailingSlash: "always"` — it redirects rather than 404s, so it works, but it's inconsistent.

### Still open on consent (decide during Task 6)

Both sources write `consent: true` into one column with no record of *what* was agreed to:
- `ios_waitlist` → one App Store notification. No checkbox; the single-purpose modal plus its stated-purpose line is the opt-in. GDPR Recital 32 wants a clear affirmative action, not specifically a checkbox — this is defensible, but it is *narrow* consent.
- `quiz` → "plan + occasional tips about anxiety", via an explicit unticked checkbox, because it bundles a second purpose.

**So the Task 6 sequence must never send to `source: 'ios_waitlist'` leads.** Make that a filter with a test, not a comment. Consider also storing a consent-version string on `Lead` so Art. 7(1) "demonstrate consent" is actually satisfiable — today you can prove *that* they consented, not *to what*.
