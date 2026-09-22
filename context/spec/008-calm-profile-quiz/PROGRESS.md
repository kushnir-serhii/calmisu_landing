# 008 — Progress

## Done — front end (2026-09-21)

| Task | Status |
|---|---|
| 1 — `POST /leads` (backend) | Done (2026-09-22) — see below |
| 2 — Quiz data module | Done |
| 3 — `/quiz/` page | Done |
| 4 — `/quiz/result/` | Done |
| 5 — Capture client + promo code | **Partial** — client done, stubbed; promo code not created |
| 6 — Email sequence | Not started (needs Task 1) |
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

### `kumo_back-end` (branch `habits-db`, uncommitted)

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

**Pre-existing, not from this work:** `test/subscription/rc-webhook.test.ts` fails 13 tests. Confirmed identical at HEAD with these changes stashed. Unrelated to leads.

---

## Open for the next session

**1. ~~Create the shared promo code.~~** Done differently — codes are now minted per lead, see above. No manual row to create, no code value in any env var.

**2. `/leads` needs deploying.** The endpoint only exists locally. Set `LANDING_URL` on Railway (that is the only new var — `QUIZ_PROMO_CODE` was removed again); `prisma migrate deploy` runs on boot and applies both `leads` migrations. Then confirm `PUBLIC_API_BASE_URL` is set for the landing build — with it empty the fetch now hits a relative `/leads` and fails, where it used to stub.

**3. Per-activity deep links are not possible today — app change required.**
Confirmed in `calmisu/App.tsx`: `linking.config.screens` maps only `password-reset`, `password-set` and `email-verified`. There is no activity route, so `calmisu://activity/breath` would resolve to nothing.

The plan's Start buttons therefore open `calmisu://` (the app's default screen) with a 1.5s fallback to Play. To make a row open the *specific* activity, the app has to add those routes to its linking config first. Until then the button is honest but blunt — it opens the app, not the exercise.

**4. Not yet done:** blog CTAs (Task 7) and the email sequence (Task 6). Task 6 is now unblocked — Day 0 already sends, and unsubscribe exists, so what remains is days 2/5/9/14 and the `src/jobs` scheduler. Day 14 must still be suppressed when the lead has redeemed the code.

**5. `NotifyMe.tsx` is still on `no-cors`** (Task 5 step 4). `postLead` is real now, so migrating it to `source: 'ios_waitlist'` is a small change — and it makes `waitlist_submit` truthful for the first time.
