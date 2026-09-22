# Product Roadmap: Calmisu Landing (calmisu.com)

_This roadmap outlines our strategic direction based on customer needs and business goals. It focuses on the "what" and "why," not the technical "how."_

---

### Phase 1

_The foundation: a crawlable, trustworthy marketing site that meets app-store obligations._

- [x] **Core Marketing Site**
  - [x] **Homepage:** Present the app's value (breathing, grounding, calligraphy, meditation sounds, AI chat), the science behind it, FAQ and download CTAs, as real static HTML with per-page meta.
  - [x] **Legal Pages:** Privacy Policy and Terms of Service in English, Polish and Ukrainian at stable, already-indexed URLs, with hreflang alternates.
  - [x] **Web Account Deletion:** Let users request account deletion from the web, as the app stores require. The page is kept out of search.
  - [x] **Real 404 Page:** Unknown URLs return a genuine 404 instead of redirecting to the homepage.
  - [x] **iOS Waitlist:** Let iPhone visitors leave their email to hear when the iOS app ships.

- [x] **Blog**
  - [x] **Article System:** Publish long-form articles on anxiety, breathing, grounding, meditation and calligraphy, with per-article metadata and a sitemap.
  - [x] **Legacy URL Redirects:** Redirect old `/articles/*` URLs to their closest `/blog/` equivalents so indexed links keep working.

- [x] **SEO & Trust (E-E-A-T)** — spec `001-seo-eeat-and-favicon`
  - [x] **Deindex Alma Pages:** Keep the separate Alma app's pages reachable by direct link but out of Google's index.
  - [x] **Author Identity:** Give every article a visible, real author with an About page and structured data.
  - [x] **YouTube Entity Linking:** Connect the YouTube channel to the site's entity graph.
  - [x] **Homepage Title Rewrite:** Lead the title with the keywords that actually earn impressions (anxiety relief, breathing, calligraphy).
  - [x] **Real App-Icon Favicon:** Replace the favicon with one derived from the app icon, sized for tabs and home screens.

---

### Phase 2

_Turn readers into engaged installs, and learn whether a personalised funnel beats a plain download button._

- [x] **Calm Profile Quiz** — spec `002-calm-profile-quiz`
  - [x] **Quiz & Free Profile:** A two-minute, nine-question quiz that shows which anxiety pattern a visitor's experience follows. This is never a score or diagnosis.
  - [x] **Email-Gated 7-Day Plan:** In exchange for an email and explicit consent, unlock a personal 7-day plan built around their time of day and available minutes.
  - [x] **Personal Promo Code:** Give Android visitors a one-time code for 14 days of PRO. iPhone visitors get the plan and an App Store notice instead of a code they can't use.
  - [x] **Trustworthy Lead Capture:** Submissions succeed or fail truthfully, and leads live in our own database. The iOS waitlist moves to the same path.
  - [x] **Follow-Up Email Sequence:** Four short emails over two weeks that link back to relevant articles and the plan, with a working unsubscribe.
  - [x] **Contextual Blog CTAs:** Every article ends with a quiz invitation matched to its topic.
  - [x] **Funnel Analytics:** Know where the funnel leaks, from quiz start to app click.
  - [ ] **Ship the Sequence:** Rewrite the Day 2/5/9/14 emails in Julia's voice, then release the backend and landing in the right order.

---

### Phase 3

_Planned for future consideration. Priority and scope will be refined once the quiz's D7 retention result is in._

- [ ] **Measure & Decide**
  - [ ] **Quiz Retention Verdict:** Compare D7 retention of quiz-sourced installs with cold installs, and either invest further or cut the quiz back to a single CTA.

- [ ] **Deeper App Hand-Off**
  - [ ] **Open the Exact Exercise:** Plan buttons open the specific breathing, calligraphy or meditation activity rather than the app's home screen. This needs new deep-link routes in the app first.

- [ ] **Content Growth**
  - [ ] **Calligraphy Meditation Pillar Page:** A cornerstone guide for the calligraphy cluster, the site's strongest organic keyword group.
  - [ ] **Related Posts & Breadcrumbs:** Keep readers moving between articles and give search engines a clear site hierarchy.

- [ ] **Localisation**
  - [ ] **Polish & Ukrainian Quiz:** Test the Tier-1 markets (Poland, Ukraine) with a localised quiz once the English funnel has real numbers.

- [ ] **Trust & Support**
  - [ ] **Social Proof Decision:** Decide between real reviews and trust badges before bringing back a reviews section.
  - [ ] **Complete Delete-Account Guidance:** Restore the "delete in the app" steps, the email contact option and the refund note on the web deletion page, in all three languages.

- [ ] **Site Health**
  - [ ] **Dependency Pruning:** Remove unused UI primitives and libraries to keep the site fast and the codebase small.
  - [ ] **Stronger Build Checks:** Type-check `.astro` files in CI, and fail the build if the backend URL is missing instead of silently breaking forms.
