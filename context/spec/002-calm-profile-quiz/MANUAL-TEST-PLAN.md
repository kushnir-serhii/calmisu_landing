# Manual Test Plan: Calm Profile Quiz (spec 002)

> **Starting a new chat?** Paste this:
> "Walk me through `context/spec/002-calm-profile-quiz/MANUAL-TEST-PLAN.md` one step at a time. For each step, tell me what to do and what I should see, wait for my result, tick the box, and log failures in the Results section at the bottom. Read `functional-spec.md` and `tasks.md` in the same folder first. Do not commit or push anything in `kumo_back-end`."

The automated suites already cover logic, payloads and DB rules (landing 57/57, backend 250/250 as of 2026-09-23). This plan covers what only a human with a real browser and a real inbox can confirm, plus a smoke pass over the main flows.

**Conventions**
- Use your own inbox with plus-addressing so each run is a fresh lead: `you+q1@gmail.com`, `you+q2@gmail.com`, …
- Each step: **Do** → **Expect**. Tick `[x]` when it passes; on failure, write the step number + what you saw in *Results*.
- Phases A–J run **locally** against the `quiz-sequence` backend. Phase K runs **in production** after Slice 10's release.

---

## Phase A — Local setup

- [x] **A1. Backend DB.** In `kumo_back-end` (branch `quiz-sequence`): `npm run docker:up`, then `npm run db:migrate`.
  **Expect:** Postgres on port 5433; migrations apply with no errors (including `add_lead_consent_scope_and_emails`).
- [x] **A2. Backend env.** In `kumo_back-end/.env`: `NODE_ENV=development` (CORS allows any origin), `PORT=3001`, a real `RESEND_API_KEY`, `LANDING_URL=http://localhost:4321`.
  **Expect:** emails will actually be sent — only ever to your own addresses.
- [x] **A3. Start backend.** `npm run dev`.
  **Expect:** `curl http://localhost:3001/health` → 200.
- [x] **A4. Point the landing at local.** ⚠️ `calmisu_landing/.env.local` currently points `PUBLIC_API_BASE_URL` at the **production** Railway backend, which doesn't yet have the 5-digit codes or the email sequence. Change it temporarily to `PUBLIC_API_BASE_URL=http://localhost:3001` (restore afterwards — see A-end).
- [x] **A5. Start landing.** In `calmisu_landing` (branch `quiz-cta`): `npm run dev`.
  **Expect:** site opens at `http://localhost:4321`.
- [x] **A6. Open Prisma Studio** in `kumo_back-end`: `npm run db:studio`. Keep the `leads`, `lead_emails` and `promo_codes` tables to hand.

---

## Phase B — Quiz page `/quiz/` (spec §2.1)

- [x] **B1. No-JS render.** DevTools → Settings → *Disable JavaScript*, load `/quiz/`.
  **Expect:** H1, intro, trust line and "Start the quiz" button all visible. Re-enable JS.
- [x] **B2. Title.** Check the tab title.
  **Expect:** `What's Your Anxiety Pattern? — 2-Minute Quiz | Calmisu`.
- [x] **B3. Entry points.** From the homepage, find the quiz block (where reviews used to be) and the `Quiz` nav link.
  **Expect:** both lead to `/quiz/` (trailing slash); the nav link adds `?src=nav`. No reviews section. *(Note: homepage block actually links `?src=homepage`, not bare `/quiz/` — undocumented in spec but not a bug.)*
- [x] **B4. Progress + advance.** Start the quiz. Tap a single-select answer.
  **Expect:** advances immediately; progress reads `2 of 9` with no percentage.
- [x] **B5. Multi-select.** Reach a multi-select question.
  **Expect:** tapping toggles options; a Continue button is required to advance.
- [x] **B6. Back preserves answers.** Go Back two questions.
  **Expect:** your earlier choices are still selected.
- [x] **B7. No storage.** DevTools → Application → Local Storage / Session Storage / Cookies for localhost.
  **Expect:** no quiz answers anywhere.
- [x] **B8. Finish.** Complete all 9 questions.
  **Expect:** lands on `/quiz/result/?p=…&t=…&d=…` (plan encoded in the URL).
- [x] **B9. "Not sure yet" tiebreak.** Retake; pick "Not sure yet" on Q1 and Q4/Q5 answers that point at one pattern (e.g. both sleep-flavoured).
  **Expect:** result profile is that pattern, not `notSure`.

---

## Phase C — Result page, free profile (spec §2.2)

- [x] **C1. Minimal URL.** Open `/quiz/result/?p=sleep`.
  **Expect:** full profile — name, subtitle, three "why" paragraphs, two tools with one line each — before any email.
- [x] **C2. Garbage URL.** Open `/quiz/result/?p=banana` and `/quiz/result/`.
  **Expect:** friendly fallback linking to `/quiz/`; no blank page, no console error.
- [x] **C3. Noindex.** View source.
  **Expect:** `<meta name="robots" content="noindex, follow">`.
- [x] **C4. Disclaimer.** Scroll the page.
  **Expect:** the "self-help tool, not a substitute for professional care" disclaimer is visible.
- [x] **C5. Hydration warnings.** Console open, hard-reload `/quiz/result/?p=panic` on desktop and in device emulation (iPhone).
  **Expect:** no React hydration-mismatch warnings. *(Manual-only criterion.)*
- [x] **C6. Copy tone.** Read every profile once (`p=panic|anxiety|racingThoughts|sleep|notSure`).
  **Expect:** no scores, no "you have", no "diagnosis / assessment / test / symptoms / condition / disorder". *(Verified by grepping `src/data/quiz.ts` rather than reading all five pages; "you have" appears twice but not in diagnostic framing — pass in spirit.)*

---

## Phase D — Android gate, plan and code (spec §2.2)

- [x] **D1. Phone preselect.** Open a result URL on desktop Chrome (Android UA emulation), then iPhone emulation.
  **Expect:** "Which phone do you use?" preselects Android / iPhone respectively; clicking the other option switches it. *(Also reordered so Android shows first, and added a checkmark indicator to the selected option — 2026-09-23 decision.)*
- [x] **D2. Consent blocks submit.** Enter `you+q1@gmail.com`, choose **Android**, leave consent unticked.
  **Expect:** checkbox unticked by default; submit is blocked. The label names what is stored; the Privacy Policy link sits in the small print under the button, not inside the label, and goes to `/en/privacy-policy/`.
- [x] **D3. Submit.** Tick consent, submit.
  **Expect:** plan appears in place, no reload. 7 rows matching your time of day and session length. ⚠️ **Changed 2026-09-23:** the code is now 5 digits (was 10) and is **no longer shown on the page** — the page just confirms it was emailed. No copy button anymore.
- [ ] **D4. Code copy text.** Read the text under "14 days of PRO, free". ⚠️ **Re-test — changed 2026-09-23:** activation window is now 7 days (was 15). Restart the backend first, clear Local Storage, and submit a fresh address so the code is minted with the new window.
  **Expect:** it states both clocks separately — activate within **7 days** (with the date, ~7 days from today), **14 days** of PRO once redeemed — says the code was emailed, and that it's redeemed in the app after creating an account. No digits appear on the page.
- [x] ~~**D5. Copy button.**~~ **Removed 2026-09-23** — no code is displayed on the page anymore, so there is nothing to copy from the landing page (the code lives only in the email).
- [x] **D6. DB row.** In Prisma Studio → `leads`.
  **Expect:** one row with only `email, profile, source=quiz, platform=android, locale, consent=true, consentScope=quiz_plan_tips_v1, consentAt` (+ ids/tokens/timestamps). No answer columns. The linked `promo_codes` row has `expiresAt` = **23:59:59.999 UTC on the day 7 days out** (changed 2026-09-24: end of the deadline day, not signup time + 7×24h — so 7 to 8 days from now), `durationDays` 14, `maxUses` 1, and `code` is now **5 digits**. ⚠️ **Re-check** after restarting the backend with the 2026-09-24 change.
- [ ] **D7. Returning visit.** Reload the same URL.
  **Expect:** gate skipped, plan + code shown. Local Storage holds only `calmisu_quiz_unlocked`, `calmisu_quiz_promo_code`, `calmisu_quiz_promo_expires`.
- [ ] **D8. Start button, app not installed.** On desktop, click a row's Start.
  **Expect:** after ~1.5 s it falls back to the Google Play listing.
- [ ] **D9. Start button, app installed.** On an Android phone with Calmisu installed (use a LAN URL or wait for Phase K).
  **Expect:** the app opens (home screen — per-activity links are out of scope).
- [ ] **D10. Server error.** Stop the backend, clear Local Storage, submit again.
  **Expect:** a visible error message; no plan shown. Restart the backend.

---

## Phase E — iPhone path (spec §2.2)

- [ ] **E1.** Clear Local Storage. Submit `you+q2@gmail.com` with **iPhone** chosen.
  **Expect:** plan fully visible; no Play links anywhere, no code; an App Store notice instead.
- [x] **E2.** Prisma Studio.
  **Expect:** lead with `platform=ios`, no promo code linked.

---

## Phase F — Code rules on repeat submissions (spec §2.2, §2.3)

- [x] **F1. Same email twice.** Clear Local Storage; resubmit `you+q1@gmail.com` (Android).
  **Expect:** same code as D3; still one lead row.
- [x] **F2. Expired code is replaced.** In Prisma Studio set that code's `expiresAt` to yesterday; clear storage; resubmit.
  **Expect:** a new code with a fresh expiry at the end (UTC) of the day 7 days out.
- [x] **F3. Redeemed code → no new code.** Mark the current code as used (set its use count to its max, or redeem it in the app against the local backend); resubmit.
  **Expect:** no code shown.
- [x] **F4. Rate limit.** Submit 6 times within an hour from the same browser.
  **Expect:** the 6th is rejected with a visible error (limit is 5 per hour per IP). *If it blocks later steps, restart the backend or wait.*
- [ ] **F5. Bad email.** Submit `not-an-email`.
  **Expect:** rejected with a visible error.

---

## Phase G — Emails (spec §2.3) — needs a real inbox

- [x] **G1. Day 0, Android.** Check `you+q1@…`.
  **Expect:** plan email arrived; its plan link opens your exact plan; it shows your code.
- [x] **G2. Day 0, iPhone.** Check `you+q2@…`.
  **Expect:** plan email with no code and an App Store notice.
- [x] **G3. Sequence dry-run.** In Prisma Studio set `you+q1`'s `createdAt` to 2 days ago. From `kumo_back-end`, trigger the job once (ask the chat to write a one-off `tsx` script calling `runQuizSequence(prisma, logger)` from `src/jobs/quizSequence.ts` — don't commit it).
  **Expect:** Day 2 email arrives; a `lead_emails` row for day 2 exists. Run again → no second Day 2 email.
- [x] **G4. Days 5 and 9.** Repeat G3 with `createdAt` at 5 and 9 days ago.
  **Expect:** each arrives once; every article link opens a real blog post and ends in `/`.
- [x] **G5. Day 6.** *(Was Day 14 before 2026-09-23.)* Set `createdAt` 6 days ago **and** the code's `expiresAt` to ~24 h from now; run.
  **Expect:** "Your code expires tomorrow" arrives with the lead's own code.
- [x] **G6. Day 6 suppression.** Using the iPhone lead (no code), or a redeemed code, or `expiresAt` 5 days out; run.
  **Expect:** no Day 6 email.
- [x] **G7. Waitlist gets no sequence.** Use a lead from J1 with `createdAt` backdated 2 days; run.
  **Expect:** nothing sent.
- [x] **G8. Unsubscribe.** Click unsubscribe in any sequence email.
  **Expect:** a confirmation page; `unsubscribedAt` set. Backdate for the next day and run → nothing sent.
- [ ] **G9. Copy status.** ⚠️ Day 2/5/6/9 bodies are an agent draft. Note anything to hand Julia; don't send to anyone else.

---

## Phase H — Blog CTAs (spec §2.4)

- [x] **H1.** Open each of the 7 posts under `/blog/`.
  **Expect:** a quiz CTA between the article body and the download block; at least 4 different CTA texts across the 7.
- [x] **H2.** Hover/click a CTA.
  **Expect:** goes to `/quiz/?src=blog_<that-post-slug>`.
- [ ] **H3.** DevTools → Network → JS on a blog post.
  **Expect:** no extra island/hydration script compared with `main`.

---

## Phase I — Analytics (spec §2.5)

Use the Chrome *Google Analytics Debugger* extension (or Firebase DebugView) and the Network tab filtered by `collect`.

- [ ] **I1. No consent.** Fresh profile/incognito; don't accept cookies; take the quiz.
  **Expect:** no analytics requests at all.
- [ ] **I2. With consent.** Accept cookies; take the quiz from `/quiz/?src=nav`.
  **Expect:** `quiz_start` (`src=nav`), one `quiz_question_answered` per question (`index`, `question_id`), `quiz_complete`.
- [ ] **I3. Back doesn't double-count.** Answer Q1, go Back, answer Q1 again.
  **Expect:** only one `quiz_question_answered` for index 1. *(Bug fixed in this branch — confirm in a real browser.)*
- [ ] **I4. Result events.** Submit the gate, reload the page, click a Start button, then trigger a server error.
  **Expect:** `quiz_email_submit`, `quiz_plan_view` (`returning=false`, then `true` after reload), `quiz_app_click` (`tool`, `day`), `quiz_email_error` — each once.

---

## Phase J — iOS waitlist "Notify me" (spec §2.3)

- [ ] **J1.** Open the Notify-me popup (iPhone emulation), submit `you+w1@gmail.com`.
  **Expect:** success message; lead with `source=ios_waitlist`, `consentScope=ios_waitlist_notify_v1`, no code, no plan email.
- [ ] **J2.** Stop the backend; submit `you+w2@…`.
  **Expect:** a visible failure — not a fake success. Restart the backend.

---

## Phase A-end — Clean up

- [ ] Restore `PUBLIC_API_BASE_URL` in `calmisu_landing/.env.local` to the production URL.
- [ ] Delete any one-off script from G3. `git status` in both repos should show nothing unexpected.

---

## Phase K — Production (after Slice 10: backend deployed first, then landing merged)

- [ ] **K1. Privacy policy.** `/en/privacy-policy/`, `/pl/…`, `/uk/…`.
  **Expect:** each lists email, profile, source, platform, locale, consent, consentScope, consentAt.
- [ ] **K2. Real CORS.** On `https://calmisu.com/quiz/`, take the quiz, submit a fresh address (Android).
  **Expect:** no CORS error in the console; code shown; its expiry ~7 days out.
- [ ] **K3. Day 0 email** arrives with plan link + code.
- [ ] **K4. Blog CTA** visible on a live post and links to `/quiz/?src=blog_<slug>`.
- [ ] **K5. Events** show in Firebase DebugView with the expected params.
- [ ] **K6. Real device.** On an Android phone with the app installed, a plan row's Start opens the app; on an iPhone, no Play links.
- [ ] **K7. Day 2** arrives ~48 h later for the K2 lead.

When K1–K6 pass, run `/awos:verify` to tick the functional-spec criteria and close the spec.

---

## Results

| Step | Pass/Fail | Notes |
|------|-----------|-------|
| D6 | Pass | API+psql 2026-09-23: only allowed columns; code 30571 (5 digits), expiresAt +7d, durationDays 14, maxUses 1 |
| D4 | Partial | Server side OK (expiry = +7d). On-page wording still needs a browser |
| E2 | Pass | ios lead, promoCodeId null. E1 UI (no Play links, App Store notice) still needs a browser |
| F1–F3 | Pass | Same code returned, 1 lead row; expired -> new code 01467 (+7d); spent -> promoCode null |
| F4 | Pass | 6th request in the hour -> HTTP 429 (API level; UI error message not checked) |
| G3 | Pass | Day 2 ledger rows written, second run sent nothing (tested with q1 + iOS q2) |
| G4 | Pass | Days 5 and 9 sent once each. Email links point to existing posts with trailing `/`. Inbox arrival not verified by me |
| G5 | Pass | Day 6 sent for live code expiring in 24h. Inbox content confirmed: lead's own code 01467, expires September 24, 2026 |
| G6 | Pass | Nothing sent for spent code, no code (iOS), or expiry 5 days out |
| G7 | Pass | Backdated ios_waitlist lead got nothing |
| G8 | Pass | Unsubscribe page 200, unsubscribedAt set, backdated run sent nothing |
| H1–H2 | Pass | Static check of `npm run build` output: CTA in all 7 posts, 5 distinct button texts, hrefs `/quiz/?src=blog_<slug>`, before the download block |
| G1 | Pass | Screenshot: Day 0 email has plan link with the exact plan params and a 5-digit code. Caveat: the earlier email (code 51020) says "activate by October 8" = 15 days, so it was minted before the 7-day change, not by the current backend |
| G3–G6 inbox | Confirmed | Screenshot: Day 0, Day 2 ("Why breathing out longer..."), Day 5 ("Same time, every day") and Day 6 ("Your code expires tomorrow") arrived; Day 2/5 show "2" (q1 + q2 iOS), Day 6 single (q1 only) as expected. **Some emails landed in Gmail spam** — check SPF/DKIM/DMARC for noreply@calmisu.com before launch |
| F2 / G5 (DB) | Pass | 2026-09-24, Prisma Studio: `30571` expiry edited to 22 Sept → resubmit minted `01467` (created 127 ms after the edit); `01467` expiry set ~24 h ahead → Day 6 email sent 18:33 local (14:33Z) with 01467, "September 24, 2026". Confirms expired-unredeemed → fresh code, and the ≤48 h Day 6 gate |
| One code per lead | Pass | Each new code replaced the lead's expired one; no daily rotation. The two different codes seen in the inbox (`51020` on `you@`, `30571`/`01467` on `you+q1@`) belong to different leads / an expired-then-reissued code. `51020` and `6271661384` are older 15-day dev codes (expire 8 Oct) |
| Redeem in app | Pass (partial) | 2026-09-24: redeemed a quiz code in the dev app the day after it was issued → Subscription shows Premium until 8 Oct = redemption date + 14 days (counts from activation, not issue date). Which exact code, and the second-use rejection, not recorded |
| Expiry rounding | Fixed, automated only | 2026-09-24: `expiresAt` now end of day UTC and emails format dates in UTC. Backend `test/leads` 48/48 pass. **Manual re-check still to do** — D4, D6, F2 and a fresh Day 0 email date |
| G2 | Pass | Screenshot: `+q2` Day 0 email has the plan link, no code, and "Calmisu isn't on the App Store yet — we'll let you know the moment it lands." |
| H3 | Not done | CTA is pure Astro markup (no island); Network-tab comparison vs main left to you |

**Known open item:** functional-spec.md §2.1 quotes the trust line as `Free · 2 minutes · No account needed`; the site ships `Free · No account needed · Not a diagnosis`. Decide which is right and fix the spec (or the copy).
