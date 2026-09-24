# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Adults living with everyday anxiety, stress, panic attacks, racing thoughts or anxious sleeplessness who want self-help, not a diagnosis or therapy. They want something they can do in the next two to ten minutes. Most arrive from search (often mid-worry, sometimes late at night) or from the Google Play listing.

- "The 2 a.m. worrier": wants her mind to slow down at bedtime without a 30-minute meditation she will skip. Meditation apps feel like homework; most anxiety content reads either clinical or cute.
- "The out-of-nowhere panic": searching "how to stop a panic attack", wants to understand what the body is doing and have one technique ready for next time. Put off by scary search results and by Play Store links when they own an iPhone.

The marketing site is English-first; many readers are non-native English speakers.

## Product Purpose

calmisu.com is the front door of the Calmisu app. It has three jobs:

1. **Acquire:** earn search visibility through real, useful, non-clinical articles.
2. **Convert:** move a visitor from reading to installing, through a clear value proposition and the Calm Profile quiz.
3. **Fulfil obligations:** legal pages, cookie consent and web account deletion that the app stores require.

Success is decided by D7 retention of quiz-sourced installs versus cold installs. If the quiz does not win, it is cut back to a single CTA. Organic growth (especially the calligraphy and breathing clusters) and trust (a real author on every article, no clinical claims) are the other measures.

## Positioning

Short, do-it-now techniques (two to ten minutes) instead of long meditation sessions, with **mindful calligraphy** as the signature exercise no neighbouring app offers. Breathing, grounding, meditation sounds and the AI chat companion support that core. The Calm Profile quiz matches a visitor's anxiety pattern to the techniques that fit it.

## Operating Context

- Visitors read on phones, often in a stressed or sleepless state; a blog article is the most common entry point.
- Journey: article → topic-matched quiz CTA → nine-question Calm Profile quiz → free pattern profile (e.g. "The Body Alarm") → email + phone type + consent → 7-day plan and a personal 14-day PRO promo code → four follow-up emails over two weeks linking back to articles and the plan.
- Android users open or install the app from Google Play and redeem the code. iPhone users get the plan by email and join a "notify me" waitlist; there is no iOS app yet.
- Transactional and sequence emails are rendered by the backend (`kumo_back-end/src/services/email.service.ts`) and load images from this site (`/email/*`, `/icons/email/*`).

## Capabilities and Constraints

- Static Astro site on GitHub Pages at `calmisu.com`; no server-side rendering. Lead capture and emails go through the Calmisu backend.
- Pages: homepage, blog, about, quiz and quiz result, Privacy Policy and Terms (EN/PL/UK with hreflang), delete-account, 404. The `/alma/` pages belong to a separate app and are deindexed.
- The quiz gives a "pattern" profile, never a score, severity or diagnosis. Symptom answers (Q4/Q5) are never stored anywhere (GDPR Art. 9 health data).
- Monetisation is Google Play only; no web checkout or subscriptions.
- Analytics load only after cookie consent, so funnel numbers are floors; promo-code redemptions are the unbiased signal.
- Undecided: a localised (PL/UK) marketing site and quiz, pending real EN funnel numbers.

## Brand Commitments

- Name: Calmisu. Author and creator: Julia K, Product Designer & Creator of Calmisu; articles carry her byline and photo (`/images/blog/blog_avatar_julia.webp`).
- Voice: warm, honest and non-clinical. A calm friend who knows the science: plain words, no hype, no diagnosis, no cute mascot talk.
- Social presence: Instagram, Facebook, TikTok, YouTube (@Calmisu).

## Evidence on Hand

- Seven long-form blog articles in `src/content/blog/`, each with a real author.
- The About page and author identity (Julia K) with Person structured data.
- **No real testimonials or reviews exist.** The quotes in `src/components/landing/ReviewsSection.tsx` are placeholders; never display them or invent new ones.
- **No public app rating exists.** Do not show star ratings, download counts or aggregateRating until Google Play shows real numbers.

## Product Principles

1. **Something you can do now.** Every surface points toward a technique that fits in two to ten minutes, not a programme to commit to.
2. **Honest over reassuring.** No clinical claims, no scores, no fabricated proof. Trust is the product's main asset with anxious visitors.
3. **Calm is the experience, not just the topic.** Nothing on the site should raise the heart rate: no urgency tricks, alarming framing or pressure to buy.
4. **Earn the install.** Useful content and a free profile come first; the email gate and app CTA follow only once value has been given.
5. **Tell each platform the truth.** Android visitors get a working path; iPhone visitors are never sent to a store they can't use.

## Accessibility & Inclusion

Readers are often anxious, tired or reading late at night on a phone, and many read English as a second language. Keep language plain and reading effortless, respect reduced-motion preferences, and meet WCAG 2.1 AA.
