# Technical Specification: SEO, E-E-A-T & Favicon

- **Functional Specification:** [functional-spec.md](./functional-spec.md)
- **Status:** Completed
- **Author(s):** Serhii Kushnir

---

## 1. High-Level Technical Approach

These are all static-build changes to the Astro site: `<head>` metadata through `BaseLayout.astro`, the sitemap `filter` in `astro.config.mjs`, content-collection frontmatter, inline JSON-LD on the homepage and blog template, and favicon files in `public/`. There is no backend and no new dependency.

---

## 2. Proposed Solution & Implementation Plan (The "How")

- **Alma deindexing**
  - `BaseLayout.astro` exposes a `noindexFollow` prop that emits `noindex, follow`. It is set on the three `src/pages/alma/[lang]/*.astro` pages only.
  - The `sitemap({ filter })` in `astro.config.mjs` excludes `/alma/`. The comment there lists every noindex page that must stay in sync with the filter.
  - `public/robots.txt` is not touched.
  - `src/data/navLinks.ts` and the footer have no Alma links.

- **Author identity**
  - Content schema (`src/content/config.ts`): `authorName` (default `"Calmisu Team"`) and `authorBio`. All posts set `authorName: "Julia K"`.
  - Byline plus `BlogPosting` JSON-LD in `src/pages/blog/[...slug].astro`, with `author` → `{ "@id": "https://calmisu.com/#author" }` and `datePublished` / `dateModified` from `pubDate` / `updatedDate`.
  - `src/pages/about.astro` is a new top-level page using `BaseLayout`.
  - `Person` node (`@id: https://calmisu.com/#author`) in the homepage `@graph` in `src/pages/index.astro`, alongside `Organization`, `WebSite`, `MobileApplication` and `FAQPage`. `Organization.founder` references it.

- **YouTube linking:** `https://www.youtube.com/@Calmisu` is added to both `sameAs` arrays in `src/pages/index.astro`.

- **Homepage title:** the `title` prop on `BaseLayout` in `src/pages/index.astro`. OG and Twitter titles derive from the same prop.

- **Favicon:** four pre-rendered files in `public/`, with `<link rel="icon" href="/favicon.ico" sizes="32x32">` and `<link rel="apple-touch-icon" href="/apple-touch-icon.png">` in `BaseLayout.astro`.

---

## 3. Impact and Risk Analysis

- **System Dependencies:** `BaseLayout.astro` is shared by every page, so head changes affect all routes. The sitemap filter is the single list of excluded URLs.
- **Potential Risks & Mitigations:**
  - *Adding `Disallow: /alma/` to robots.txt would lock the pages in the index* → explicitly forbidden, and `robots.txt` is left unchanged.
  - *Noindex pages drifting out of sync with the sitemap* → a comment in `astro.config.mjs` lists every noindex page.
  - *Fabricated credentials on `/about/`* → real background only, flagged for human review.

---

## 4. Testing Strategy

- Build, then inspect `dist/`: meta robots on Alma pages only, sitemap contents, title length, JSON-LD presence, and that the favicon paths resolve.
- After deploy: run Google's Rich Results Test on a blog post and the homepage, and do a visual tab check of the favicon.
