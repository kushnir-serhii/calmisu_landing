# Product Definition: Calmisu Landing (calmisu.com)

- **Version:** 1.0
- **Status:** Approved

---

## 1. The Big Picture (The "Why")

### 1.1. Project Vision & Purpose

To be the front door of the Calmisu app: the place where people who are struggling with anxiety, panic, racing thoughts or poor sleep find honest, practical help, understand which calming technique fits them, and install the app with a reason to keep using it.

The site has three jobs: **acquire** (search visibility through real, useful articles), **convert** (move a visitor from reading to installing, via a clear value proposition and the Calm Profile quiz), and **fulfil obligations** (legal pages and account deletion that the app stores require).

### 1.2. Target Audience

Adults who experience everyday anxiety, stress, panic attacks, racing thoughts or anxious sleeplessness and are looking for self-help tools. They are not looking for a diagnosis or therapy, but for something they can do in the next two to ten minutes. Most arrive from search or from the Google Play listing. The app ships in English, Polish and Ukrainian; the marketing site is English-first, and the legal pages come in all three languages.

### 1.3. User Personas

- **Persona 1: "Marta, the 2 a.m. worrier"**
  - **Role:** 29, office worker in Warsaw, reads in English.
  - **Goal:** Wants her mind to slow down at bedtime without a 30-minute meditation she will skip.
  - **Frustration:** Meditation apps feel like homework, and most "anxiety" content reads either clinical or cute.

- **Persona 2: "Alex, the out-of-nowhere panic"**
  - **Role:** 35, has had a few panic attacks and is searching "how to stop a panic attack".
  - **Goal:** Wants to understand what is happening in the body and have one technique ready for the next time.
  - **Frustration:** Scary search results, and being sent to a Play Store link when they own an iPhone.

### 1.4. Success Metrics

- **The deciding metric:** D7 retention of quiz-sourced installs is materially higher than for cold installs. If it isn't, the quiz is cut back to a single CTA.
- Funnel hypotheses to falsify in the first month (a baseline is set in week one): `/quiz/` view → start 30%, start → complete 60%, complete → email 45%, email → promo redemption 15%.
- Organic search: blog posts and the homepage gain impressions and clicks in Search Console, and the calligraphy/breathing clusters grow.
- Trust: every article has a visible, real author, and no page makes a clinical claim.
- Note: analytics are gated on cookie consent, so every funnel number is a floor. Promo-code redemptions are the one unbiased signal.

---

## 2. The Product Experience (The "What")

### 2.1. Core Features

- **Homepage:** value proposition, features (breathing, grounding, mindful calligraphy, meditation sounds, AI chat), the science behind them, a quiz entry point, FAQ, latest posts, and download CTAs (Google Play, plus an iOS "notify me" waitlist).
- **Blog:** long-form, non-clinical articles on anxiety, breathing, grounding, meditation and calligraphy, each with an author byline and a contextual quiz CTA.
- **About page:** who is behind Calmisu (Julia K, Product Designer & Creator), for credibility and E-E-A-T.
- **Calm Profile quiz:** nine questions that give a free "pattern" profile (never a score or diagnosis), then an email-gated 7-day plan with a personal 14-day PRO promo code, followed by a short educational email sequence.
- **Legal & account:** Privacy Policy and Terms of Service in EN/PL/UK, a web account-deletion flow, and cookie consent.
- **Alma microsite:** legal and account-deletion pages for a separate app, served under `/alma/`. They can be reached by direct link but are deindexed.

### 2.2. User Journey

A visitor searches "how to stop a panic attack" and lands on a blog post. After reading, they see a quiz CTA that matches the post's topic and take the two-minute Calm Profile quiz. They get their profile ("The Body Alarm") for free, then enter their email, choose their phone type and tick consent to unlock a 7-day plan and a personal promo code. Android users tap a plan row that opens (or installs) the app, create an account and redeem the code. iPhone users still get the plan by email and are told when the iOS app arrives. Over the next two weeks, four short emails link back to relevant articles and to the plan.

---

## 3. Project Boundaries

### 3.1. What's In-Scope for this Version

- A static marketing site on GitHub Pages at `calmisu.com`: homepage, blog, about, quiz and quiz result, legal pages, delete-account and 404.
- Technical SEO: per-page meta, canonical URLs, sitemap, JSON-LD (Organization, WebSite, MobileApplication, FAQPage, Person, BlogPosting), hreflang on legal pages, and noindex on utility pages.
- Lead capture and the quiz email sequence, through the Calmisu backend (`kumo_back-end`).
- Consent-gated analytics for the funnel.

### 3.2. What's Out-of-Scope (Non-Goals)

- Writing the quiz plan into the app (habits, a pre-filled onboarding reason, Play install referrer).
- Web checkout or subscriptions on the web; monetisation is Play-only.
- Scores, severity or anything that reads as a diagnosis or clinical assessment.
- Storing quiz symptom answers (Q4/Q5) anywhere. They are health data under GDPR Art. 9.
- A localised (PL/UK) marketing site or quiz, for now. This is a candidate for a later phase once the EN funnel has real numbers.
- Server-side rendering; the site stays fully static.
