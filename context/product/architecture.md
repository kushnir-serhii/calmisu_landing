# System Architecture Overview: Calmisu Landing (calmisu.com)

---

## 1. Application & Technology Stack

- **Site Framework:** Astro 5.18.2, fully static output (no SSR adapter). `trailingSlash: "always"` means every internal link must end in `/`.
- **Interactive UI:** React 18 islands via `@astrojs/react@4`, hydrated only where interactivity is real (`client:load` above the fold or for URL-dependent content, `client:idle` / `client:visible` elsewhere). There is no global provider tree; each island owns its own providers.
- **Styling:** Tailwind CSS 3.4 via `@astrojs/tailwind@6`, with an HSL CSS-variable theme in `src/index.css` + `tailwind.config.ts`, `@tailwindcss/typography` for article prose, and `tailwindcss-animate`. No dark palette.
- **Component Primitives:** shadcn/ui on Radix (`src/components/ui/`). Many of these primitives are unused, and pruning them is on the roadmap.
- **Forms & Validation:** `react-hook-form` + Zod.
- **Language:** TypeScript (`astro/tsconfigs/base`, path alias `@/*` → `src/*`). SVGs are imported as components via `vite-plugin-svgr` (`?react`).
- **Version constraint:** `@astrojs/tailwind@6` pins Astro to ≤5. Moving to Astro 6+ means migrating to Tailwind v4, which would invalidate the current theme.

---

## 2. Content & Data

- **Articles:** Astro Content Collection `blog` (`src/content/blog/*.md`, schema in `src/content/config.ts`). Frontmatter: `title`, `description`, `pubDate`, `updatedDate?`, `image?`, `tags[]`, `draft`, `authorName`, `authorBio`. Served at `/blog/<slug>/`, with old `/articles/*` URLs redirected.
- **Single-source data modules:** `src/data/faq.ts` (FAQ section + FAQPage JSON-LD), `src/data/quiz.ts` (quiz questions, profiles, plan templates), `src/data/navLinks.ts` (header + footer navigation). New structured copy follows this one-module pattern.
- **Pure logic:** `src/lib/quiz.ts` (`resolveProfile`, `encodePlan` / `decodePlan`, plan building). Plan state lives in the URL, so no database row is created per plan.
- **Client storage:** `localStorage` holds only the quiz unlock flag and the visitor's own promo code/expiry, never quiz answers.
- **Lead store (backend):** PostgreSQL via Prisma in `kumo_back-end`. Tables: `leads` (email, profile, source, platform, locale, consent, consentScope, consentAt, unsubscribe token, promo code link) and `lead_emails` (a sequence ledger, unique per lead + day).

---

## 3. Infrastructure & Deployment

- **Hosting:** GitHub Pages, custom domain `calmisu.com` (`CNAME` / `public/CNAME`).
- **CI/CD:** `.github/workflows/deploy.yml` builds on push to `main` with Node 22 and injects `PUBLIC_*` env vars from repo secrets (`PUBLIC_API_BASE_URL` comes from the `VITE_API_BASE_URL` secret) plus the Firebase web config.
- **Backend hosting:** `kumo_back-end` (Fastify + Prisma) on Railway. It auto-deploys on merge, and `prisma migrate deploy` runs on boot.
- **Deploy order rule:** when a change spans both repos, deploy the backend first and the landing second.
- **Static passthrough:** `public/` (images, icons, favicons, `.well-known/assetlinks.json` for Android App Links, Search Console verification file).

---

## 4. External Services & APIs

- **Calmisu backend (`PUBLIC_API_BASE_URL`):** `POST /auth/delete-account-web` (account deletion), `POST /leads` (unauthenticated, IP rate-limited; quiz + iOS waitlist capture, returns a per-lead promo code), `GET /leads/unsubscribe?token=`. All calls go through `src/lib/api.ts` with real status codes and no `no-cors`.
- **Email:** the backend's existing email transport sends the Day 0 plan email on capture, and a daily cron (`0 9 * * *`, `src/jobs/quizSequence.ts`) sends the Day 2/5/9/14 emails, filtered on `consentScope`.
- **Promo codes:** the backend `PromoCode` model. There is one code per lead ever, digits only, 14 days of PRO once redeemed, and a 15-day window to activate. Redemption happens in the app and requires an account.
- **App hand-off:** Google Play (`https://play.google.com/store/apps/details?id=com.calmisu.app`) and the app's deep-link scheme `calmisu://`. Per-activity routes don't exist in the app yet.
- **Social / entity graph:** YouTube `@Calmisu`, plus the Instagram/Facebook/TikTok links in the footer, all referenced in JSON-LD `sameAs`.

---

## 5. Observability, SEO & Quality

- **Analytics:** Firebase Analytics (GA4) via `src/lib/firebase.ts` + `src/lib/analytics.ts` `track(name, params)`. It does nothing until the cookie banner (`CookieConsent.tsx`) is accepted, so every number it reports undercounts. Event names are snake_case (`quiz_start`, `waitlist_submit`, …).
- **SEO:** `BaseLayout.astro` owns `<head>` (title, description, canonical, OG/Twitter, favicons, `lang`, `noindex` / `noindexFollow`, a named `head` slot). `@astrojs/sitemap` has a `filter` that must stay in sync with every noindex page (`/delete-account/`, `/alma/*`, `/quiz/result/`). `robots.txt` never disallows a noindex page, because a crawl block would stop Google from ever seeing the noindex tag.
- **Testing:** Vitest + Testing Library + jsdom (`src/test/`). Unit tests cover the quiz logic, and island tests cover the quiz UI, storage and the lead payload.
- **Checks:** `npm run build`, `npm run test`, `npm run lint`, `npx tsc --noEmit`. `@astrojs/check` is not installed.
