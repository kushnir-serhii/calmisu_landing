# Tasks: SEO, E-E-A-T & Favicon

<!-- skip-tests: true -->

> Migrated from the pre-AWOS spec 007. All work shipped to `main` (branches `seo-redirects-fix`, `new-favicons-color`) and was verified against the tree on 2026-09-22.

- [x] **Slice 1: Deindex `/alma/*` while keeping it reachable**
  - [x] Add a `noindexFollow` prop to `BaseLayout.astro` and set it on the three `src/pages/alma/[lang]/*.astro` pages. **[Agent: content-seo]**
  - [x] Extend the `sitemap` `filter` in `astro.config.mjs` to exclude `/alma/`, keeping the sync comment current. **[Agent: astro-architect]**
  - [x] Confirm there are no `/alma/*` links in `navLinks.ts` or the footer, and that `robots.txt` is untouched. **[Agent: content-seo]**
  - [x] Verify: build, check that `noindex, follow` is on Alma pages only, `/alma/*` is absent from `sitemap-0.xml`, and Alma pages still return 200. **[Agent: astro-architect]**

- [x] **Slice 2: Visible, schema-backed author**
  - [x] Add `authorName` / `authorBio` to the blog content schema and set `Julia K` on every post. **[Agent: content-seo]**
  - [x] Render the byline linking to `/about/` in `src/pages/blog/[...slug].astro`. **[Agent: content-seo]**
  - [x] Create `src/pages/about.astro` with real background only (no clinical credentials). **[Agent: content-seo]**
  - [x] Add the `Person` node and `Organization.founder` link to the homepage JSON-LD, and `BlogPosting` JSON-LD to the blog template. **[Agent: content-seo]**
  - [x] Verify: build, confirm the byline and JSON-LD in the built HTML, and that `/about/` resolves. **[Agent: content-seo]**

- [x] **Slice 3: YouTube in the entity graph**
  - [x] Add `https://www.youtube.com/@Calmisu` to `Person.sameAs` and `Organization.sameAs` in `src/pages/index.astro`. **[Agent: content-seo]**
  - [x] Verify: the URL is present in both nodes of the built homepage. The manual YouTube/Search Console steps are handed to the owner. **[Agent: content-seo]**

- [x] **Slice 4: Keyword-first homepage title**
  - [x] Set the homepage title to `Anxiety Relief App: Breathing & Calligraphy | Calmisu`, with OG/Twitter titles kept in sync and the description unchanged. **[Agent: content-seo]**
  - [x] Verify: the built `<title>` is ≤ 60 characters and matches `og:title` / `twitter:title`. **[Agent: content-seo]**

- [x] **Slice 5: App-icon favicon**
  - [x] Place `favicon.ico`, `favicon-32x32.png`, `favicon-96x96.png` and `apple-touch-icon.png` in `public/`, and replace the old icon `<link>`s in `BaseLayout.astro`. **[Agent: astro-architect]**
  - [x] Verify: the paths resolve in `dist/`, there are no duplicate icon links, and `icon_cloud.png` is untouched. **[Agent: astro-architect]**
