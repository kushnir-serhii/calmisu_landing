# Functional Specification: Calm Profile Quiz

- **Roadmap Item:** Calm Profile Quiz: quiz & free profile, email-gated 7-day plan, personal promo code, trustworthy lead capture, follow-up email sequence, contextual blog CTAs, funnel analytics.
- **Status:** In Review
- **Author:** Serhii Kushnir

> **Copy source:** every user-facing string (questions, profiles, plan template, gate, emails, blog CTAs) lives in [CONTENT.md](./CONTENT.md). Don't invent copy. Voice: warm, grounding, non-clinical, second person. No scores, no "you have", no "diagnosis/assessment/test/symptoms/condition/disorder".

---

## 1. Overview and Rationale (The "Why")

Every path on the site ended at a Play Store button. Blog readers hit a dead end, iPhone visitors were sent to a store they couldn't use, and the iOS waitlist posted through a `no-cors` form that couldn't tell success from failure. A cold download button also gives a new user no reason to open the app a second time.

The Calm Profile quiz gives the visitor something of real value first: a short, non-clinical explanation of the pattern their anxiety follows and the two techniques that suit it. It then offers a personal 7-day plan and 14 days of PRO in exchange for an email. The tools it recommends are in the same order the app's home screen uses for that reason, so the promise made on the web is visibly kept in the app.

**Success is measured by** D7 retention of quiz-sourced installs vs. cold installs (the deciding number). Funnel hypotheses to falsify in month one: `/quiz/` view → start 30%, start → complete 60%, complete → email 45%, email → redemption 15%. Analytics are consent-gated, so these numbers are floors. Promo redemptions are the one unbiased signal.

**Product decisions (settled):**
- The plan is a standalone web page delivered by email. Its state is encoded in the URL, so there is no database row per plan and it can be bookmarked forever.
- The profile is free. Only the plan and the code are behind the email. The gate is soft (client-side), and that is accepted.
- The output is a *pattern*, never an assessment.
- Quiz answers are never stored against an email. Q4/Q5 are health data (GDPR Art. 9).
- The visitor tells us their phone type; we don't guess it from the user-agent.

---

## 2. Functional Requirements (The "What")

### 2.1 Quiz page `/quiz/`

- **As a** visitor, **I want to** answer a few quick questions, **so that** I learn which pattern my anxiety follows.
  - **Acceptance Criteria:**
    - [ ] `/quiz/` is indexable, is in the sitemap, and its H1, intro, trust line (`Free · 2 minutes · No account needed`) and start button are in the static HTML with JS disabled.
    - [ ] Title `What's Your Anxiety Pattern? — 2-Minute Quiz | Calmisu`, with the description from the spec copy.
    - [ ] There are nine questions, one per screen, with a `3 of 9` progress bar (no percentage).
    - [ ] Single-select answers advance on tap. Multi-select shows Continue. Back preserves earlier answers.
    - [ ] No answer is written to `localStorage`, `sessionStorage` or a cookie.
    - [ ] Q1 decides the profile. If Q1 is "Not sure yet", the most frequent profile hinted by the chosen Q4/Q5 options wins, and a tie stays `notSure`.
    - [ ] Finishing the quiz lands on `/quiz/result/` with the plan encoded in the query string.
    - [ ] The homepage (in the old reviews slot) and the navigation link to `/quiz/` with a trailing slash. `ReviewsSection` stays disabled.

### 2.2 Result page `/quiz/result/`

- **As a** visitor, **I want to** read my profile for free, **so that** I get value before being asked for anything.
  - **Acceptance Criteria:**
    - [ ] `/quiz/result/?p=sleep` renders a complete profile with no other params. Every other param has a default.
    - [ ] Missing or garbage params render a friendly fallback linking back to `/quiz/`, never a crash or blank page.
    - [ ] The profile (name, subtitle, three "why" paragraphs, two recommended tools with one line each) is fully readable before any email is entered.
    - [ ] Recommended tools follow the app's `getHomeVariant()` order for the profile. The Q7 preference may promote a tool to second place but never displaces the first.
    - [ ] The page carries `noindex, follow`, is absent from the sitemap, and `robots.txt` is unchanged.
    - [ ] The standing disclaimer (self-help tool, not a substitute for professional care) is visible on the page.

- **As a** visitor, **I want to** unlock my 7-day plan with my email, **so that** I have a concrete routine to follow.
  - **Acceptance Criteria:**
    - [ ] The gate asks "Which phone do you use?" (iPhone / Android). The option is preselected from the user-agent, but a manual choice always wins.
    - [ ] The consent checkbox is unchecked by default, names what is stored, and blocks submit until ticked. The Privacy Policy (`/en/privacy-policy/`) is linked in the small print below the button, outside the label.
    - [ ] After a successful submit, the plan appears in place without a reload. A server error shows a visible error and fires no success event.
    - [ ] The plan has 7 rows built from the template, using the visitor's time of day and session length.
    - [ ] Returning to the same URL later skips the gate. `localStorage` holds only the unlock flag and the visitor's own code/expiry, never answers.

- **As an** Android visitor, **I want** a personal promo code, **so that** I can try PRO for free.
  - **Acceptance Criteria:**
    - [ ] The code is shown with a copy control. The copy states both clocks: activate within 7 days (shown as a date, e.g. "by September 30"), and get 14 days of PRO once redeemed.
    - [ ] The copy says plainly that the code is redeemed inside the app after creating an account.
    - [ ] One code per lead, ever. A repeat submission with an unexpired, unredeemed code returns the same code. An expired, unredeemed code is replaced. A redeemed code yields no new code.
    - [ ] Each plan row's Start button opens the app (`calmisu://`) and falls back to Google Play if the app doesn't open within about 1.5s.

- **As an** iPhone visitor, **I want** the plan without being sent to a store I can't use, **so that** the quiz is still worth my time.
  - **Acceptance Criteria:**
    - [ ] With iPhone selected, no Play links and no promo code appear. An "App Store notice" promise replaces them.
    - [ ] The plan stays fully visible and is still emailed (without a code).
    - [ ] There are no hydration-mismatch warnings.

### 2.3 Lead capture & email

- **As the** business, **I want** submissions to succeed or fail truthfully, **so that** the list is reliable and lawfully held.
  - **Acceptance Criteria:**
    - [ ] Only `email`, `profile`, `source`, `platform`, `locale`, `consent`, `consentScope` and `consentAt` persist, and no column can hold Q4/Q5 answers.
    - [ ] A valid submission returns success. A bad email or missing consent is rejected. Too many requests from one IP are throttled. The same email twice is fine and creates one lead.
    - [ ] A request from `https://calmisu.com` works with real CORS headers, and `grep -r "no-cors" src/` returns nothing.
    - [ ] The iOS waitlist ("Notify me") uses the same capture path, tagged as the waitlist, and reports real failures.
    - [ ] The Day 0 email arrives with the visitor's own plan URL (and their code, if Android).
    - [ ] The Privacy Policy (EN/PL/UK) lists every stored field.

- **As a** lead, **I want** a few useful follow-ups and an easy way out, **so that** I have reasons to come back without being spammed.
  - **Acceptance Criteria:**
    - [ ] Day 2, 5, 6 and 9 emails send on schedule, the content emails (Day 2, 5, 9) each linking to an existing article with a trailing slash.
    - [ ] Only leads who consented under the quiz's plan-and-tips wording receive the sequence. Waitlist sign-ups and pre-sequence leads receive none.
    - [ ] Every email has a working unsubscribe that stops all later sends.
    - [ ] Day 6 ("Your code expires tomorrow") is skipped when the lead has no code, already redeemed it, or the code isn't actually expiring within the next 48h.
    - [ ] No lead receives the same day's email twice.

### 2.4 Blog CTAs

- **As a** reader, **I want** a next step that fits the article I just read, **so that** the blog isn't a dead end.
  - **Acceptance Criteria:**
    - [ ] Every post shows a quiz CTA between the body and the download block, with the variant picked by the first matching tag (panic / anxiety / sleep / racingThoughts), otherwise `default`.
    - [ ] At least 4 distinct variants appear across the posts.
    - [ ] The CTA links to `/quiz/?src=blog_<slug>` and adds no hydration script to blog pages.

### 2.5 Analytics

- **As the** business, **I want to** see where the funnel leaks, **so that** I can decide whether the quiz is worth keeping.
  - **Acceptance Criteria:**
    - [ ] `quiz_start` (`src`), `quiz_question_answered` (`index`, `question_id`), `quiz_complete`, `quiz_email_submit`, `quiz_email_error`, `quiz_plan_view` (`returning`) and `quiz_app_click` (`tool`, `day`) each fire once per occurrence.
    - [ ] No event fires before cookie consent.
    - [ ] Going back and then forward doesn't double-count answers.

---

## 3. Scope and Boundaries

### In-Scope

- The `/quiz/` and `/quiz/result/` pages, the quiz data and logic, and the homepage/nav entry points.
- Lead capture, per-lead promo codes, the Day 0 email and the Day 2/5/6/9 sequence with unsubscribe (backend, `kumo_back-end`).
- Migrating the iOS waitlist to the same capture path.
- Blog quiz CTAs, funnel analytics, and privacy-policy field updates.

### Out-of-Scope

- Writing the plan into the app (habits, pre-filled onboarding reason, install referrer).
- Opening the specific exercise from a plan row. The app has no per-activity deep-link routes yet (roadmap Phase 3).
- Web checkout.
- PL/UK localisation of the quiz (roadmap Phase 3).
- Hardening the soft gate (would need SSR).

---

## Change Log

- [2026-09-22] — Pre-AWOS PROGRESS — The single shared promo code was replaced by **per-lead codes** minted at capture (one per lead, ever, to prevent repeat PRO grants).
- [2026-09-22] — Pre-AWOS PROGRESS — User-agent iOS detection was replaced by an **explicit phone choice** on the gate. `source` ("which form") and `platform` ("which phone") became independent, and iOS quiz leads now get the plan email without a code.
- [2026-09-22] — Pre-AWOS PROGRESS — The **activation window changed from 7 to 15 days** so the Day 14 "expires tomorrow" email is true. PRO duration stays at 14 days, and the two clocks are always stated separately.
- [2026-09-22] — Pre-AWOS PROGRESS — Added **`consentScope` / `consentAt`**. The sequence filters on recorded consent rather than `source`, so leads without a recorded scope get no sequence emails.
- [2026-09-23] — AWOS migration — Rewritten from `context-old/spec/008-calm-profile-quiz/SPEC.md` + `PROGRESS.md`. The criteria describe the behaviour as shipped and are unchecked until `/awos:verify` re-confirms them.
- [2026-09-23] — Product decision — The **activation window changed from 15 back to 7 days**, and the "expires tomorrow" email moved **from Day 14 to Day 6** so it stays true. Reason: most redemptions happen in the first 24–48h; 7 days is still a real deadline and covers a weekend. PRO duration stays at 14 days, starting at redemption. Nothing had shipped with 15-day codes. Follow-ups considered but not in scope: a Day 3 reminder, a one-time "missed it? get a new code" email, a one-tap apply deep link, and an in-trial reminder around day 10–12 of PRO.
