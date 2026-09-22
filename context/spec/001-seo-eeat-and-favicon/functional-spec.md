# Functional Specification: SEO, E-E-A-T & Favicon

- **Roadmap Item:** SEO & Trust (E-E-A-T): deindex Alma pages, author identity, YouTube entity linking, homepage title rewrite, real app-icon favicon.
- **Status:** Completed
- **Author:** Serhii Kushnir

---

## 1. Overview and Rationale (The "Why")

An SEO/conversion audit (September 2026) found three problems. Pages for an unrelated app (Alma) were competing in the index with the Calmisu brand. Articles had no visible or structured author, which weakens E-E-A-T for a mental-health topic. The homepage title led with the brand and not with the keywords that earn impressions (calligraphy, breathing). The favicon also didn't match the real app icon.

**Success looks like:** `/alma/*` drops out of the index but stays reachable, every article shows a real author backed by structured data, the homepage title surfaces the calligraphy/breathing cluster, and the browser tab shows the app's own icon.

---

## 2. Functional Requirements (The "What")

- **Deindex `/alma/*`, keep it reachable.** Alma's legal and deletion pages must stay live for direct links (Play listing, app deep links) but leave Google's index.
  - **Acceptance Criteria:**
    - [x] `/alma/*` pages still return 200 and render normally when visited directly.
    - [x] `<meta name="robots" content="noindex, follow">` is present on `/alma/*` pages only, and non-Alma pages don't carry it.
    - [x] The sitemap no longer lists any `/alma/*` URL.
    - [x] `robots.txt` is unchanged (no `Disallow: /alma/`, because a crawl block would hide the noindex tag).
    - [x] No `/alma/*` links remain in the main navigation or footer.

- **Author identity (E-E-A-T).** Every article has a visible, schema-backed author: **Julia K, Product Designer & Creator of Calmisu**.
  - **Acceptance Criteria:**
    - [x] Every blog post shows a byline (name, linked to `/about/`).
    - [x] An `/about/` page exists, builds, and is linked from the byline. It describes real background only and claims no clinical credentials.
    - [x] The homepage JSON-LD graph includes a `Person` node, linked from `Organization.founder`.
    - [x] Each blog post carries `BlogPosting` structured data (headline, author, published/modified dates, URL).

- **YouTube channel linking.** The YouTube channel is part of the site's entity graph.
  - **Acceptance Criteria:**
    - [x] `https://www.youtube.com/@Calmisu` is present in `Person.sameAs` and `Organization.sameAs`.
    - [x] The manual steps outside the repo (a channel-description backlink to calmisu.com, and connecting Search Console to the channel) are listed as the owner's to do.

- **Homepage title rewrite.** Put keywords before the brand.
  - **Acceptance Criteria:**
    - [x] `<title>`, `og:title` and `twitter:title` all read `Anxiety Relief App: Breathing & Calligraphy | Calmisu` and match each other.
    - [x] The meta description is unchanged.
    - [x] The title is 60 characters or fewer.

- **Favicon replacement.** The tab icon is derived from the real app icon (`public/icon_cloud.png`).
  - **Acceptance Criteria:**
    - [x] `favicon.ico` (16/32/48), `favicon-32x32.png`, `favicon-96x96.png` and `apple-touch-icon.png` (180×180) are in `public/` and resolve after build.
    - [x] The old favicon `<link>` tags are fully replaced, with no duplicates.
    - [x] `icon_cloud.png` is untouched.

---

## 3. Scope and Boundaries

### In-Scope

- Noindex + sitemap exclusion for `/alma/*`.
- Author frontmatter, byline, `/about/` page, `Person` and `BlogPosting` JSON-LD.
- YouTube in `sameAs`.
- Homepage title/OG/Twitter title.
- Favicon files and head links.

### Out-of-Scope

- A pillar page `/blog/calligraphy-meditation/` and new articles (on the roadmap, Phase 3).
- A related-posts block and `BreadcrumbList` schema (on the roadmap, Phase 3).
- Play Store listing changes and the in-app review prompt (other repos).
- Enabling `ReviewsSection`, which is blocked on a product decision about real reviews vs. trust badges.
- Further edits to blog titles/H1s, and FAQPage schema (already done).
- An SVG favicon (the source's gradients don't convert cleanly).

---

## Change Log

- [2026-09-23] — AWOS migration — Rewritten from the pre-AWOS `context-old/spec/007-improve-seo_and-favicon/SPEC.md`. No behaviour change. Blog frontmatter uses `authorName` / `authorBio` rather than a literal `author` field, which works the same way.
