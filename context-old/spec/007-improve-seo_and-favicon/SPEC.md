# Calmisu Landing — SEO/E-E-A-T Implementation Spec

**For:** coding agent working in `calmisu_landing` (Astro 5 → GitHub Pages, https://calmisu.com)
**Source doc:** `seo-conversion-audit-2026-09.md` (see project files for full context/rationale)
**Repo assumptions below are inferred from the live site, not from reading the repo directly. Verify each file path against the actual tree before editing — if a path doesn't exist, find its real equivalent rather than creating a duplicate.**

Known-confirmed paths (from prior work in this repo):
- `src/content/blog/*.md` — blog posts, frontmatter `title` drives both H1 and card titles
- `src/data/faq.ts` — single source for FAQ page + schema
- `src/components/DownloadButtons.*` — CTA buttons with `location` param
- `navLinks.ts` — nav link config
- `astro.config.mjs` — site config, likely has `@astrojs/sitemap` integration already (sitemap-index.xml is live)
- `public/.well-known/assetlinks.json` — exists

Everything else below (layout file names, `/about/` route, `/alma/` route location) is unconfirmed — locate the real file before editing.

---

## Task 1 — Deindex `/alma/*`, keep it reachable by direct link

**Goal:** `/alma/*` pages stop appearing in Google's index, but stay live for anyone with a direct link (Play listing, app deep links, etc). No 404s, no removal from the build.

**Steps, in this order — order matters:**

1. Find the layout or page(s) serving `/alma/*` routes. Add to their `<head>`:
   ```html
   <meta name="robots" content="noindex, follow" />
   ```
   If `/alma/*` shares a layout with other indexed pages, don't add this globally — scope it to alma-only routes (conditional in the layout, or a dedicated layout just for alma).

2. In `astro.config.mjs`, find the `sitemap()` integration config and add a filter:
   ```js
   sitemap({
     filter: (page) => !page.includes('/alma/'),
   })
   ```
   If a `filter` already exists, extend it — don't overwrite.

3. **Do NOT touch `robots.txt`.** Do not add `Disallow: /alma/`. This is intentional — a crawl block would prevent Google from ever seeing the `noindex` tag, causing the opposite of the intended effect (pages stuck in the index indefinitely). Leave `robots.txt` as-is in this task.

4. Remove any links to `/alma/*` from main-brand navigation and footer (check `navLinks.ts` and the footer component). Links to `/alma/*` from external sources (Play listing, app) are out of scope — leave those.

**Acceptance criteria:**
- [ ] `/alma/*` pages still return 200 and render normally when visited directly
- [ ] `<meta name="robots" content="noindex, follow">` present in rendered HTML of `/alma/*` pages only (verify non-alma pages don't have it)
- [ ] `sitemap-index.xml` (or the child sitemap listing pages) no longer lists any `/alma/*` URL after rebuild
- [ ] `robots.txt` unchanged
- [ ] No `/alma/*` links remain in main nav or footer

**Do not do in this task:** don't add `robots.txt` disallow rules, don't delete the `/alma/` content, don't add redirects.

---

## Task 2 — Author identity (E-E-A-T)

**Goal:** every blog post has a visible, schema-backed author. Author name: **Julia K**, title/role: **Product Designer & Creator of Calmisu**.

**Steps:**

1. Add `author` field to frontmatter of all 6 files in `src/content/blog/`:
   ```yaml
   author: "[AUTHOR NAME]"
   ```
   Check the content collection schema (likely `src/content/config.ts` or `src/content.config.ts`) — add `author: z.string()` to the schema if it uses Zod validation and the field isn't already defined.

2. Add a visible byline to the blog post template/layout (wherever blog post content renders — find the component that wraps `src/content/blog/*.md` output). Byline should show: small avatar/photo, name, and link to `/about/`. Keep it minimal — one line under the H1 or at the end of the post, not both.

3. Create `/about/` page (new route, likely `src/pages/about.astro` or `src/pages/about/index.astro` depending on existing routing pattern — match whatever pattern `/blog/` or other top-level pages use). Content: who the author is, why they built Calmisu, real background (calligraphy practice, personal experience with anxiety tools) — no clinical credentials that don't exist. See audit doc for the exact caution on this.

4. Add a single `Person` node to the homepage's existing JSON-LD `@graph` (find where `Organization` + `WebSite` + `MobileApplication` + `FAQPage` are currently defined — likely inline in the homepage layout or a dedicated schema/JSON-LD component):
   ```json
   {
     "@type": "Person",
     "@id": "https://calmisu.com/#author",
     "name": "Julia K",
     "jobTitle": "Product Designer & Creator of Calmisu",
     "url": "https://calmisu.com/about/",
     "image": "https://calmisu.com/images/[author-photo].jpg",
     "sameAs": ["https://www.youtube.com/@[CHANNEL_HANDLE — resolve from https://youtu.be/27xEzkqhZE0, see Task 3]"]
   }
   ```
   Link it to the existing `Organization` node via `founder`:
   ```json
   "founder": { "@id": "https://calmisu.com/#author" }
   ```

5. Add `BlogPosting` JSON-LD to each blog post page (this schema type doesn't exist yet — blog posts currently have no structured data). Find the blog post template and inject per-post:
   ```json
   {
     "@context": "https://schema.org",
     "@type": "BlogPosting",
     "headline": "[post title]",
     "author": { "@id": "https://calmisu.com/#author" },
     "datePublished": "[from frontmatter or file]",
     "dateModified": "[from frontmatter or file]",
     "url": "https://calmisu.com/blog/[slug]/"
   }
   ```
   Check if frontmatter already has a publish date field to source `datePublished` from; add `dateModified` to frontmatter if it doesn't exist (default to same as `datePublished` if no edits have been made).

**Acceptance criteria:**
- [ ] All 6 blog posts show a visible byline (name + link to `/about/`) on the rendered page
- [ ] `/about/` page exists, builds, and is linked from the byline
- [ ] Homepage JSON-LD `@graph` includes the `Person` node, linked from `Organization.founder`
- [ ] Each blog post has valid `BlogPosting` JSON-LD (test with Google's Rich Results Test after deploy)
- [ ] No clinical/professional credentials claimed anywhere that aren't true — flag this explicitly for human review before merge, don't guess

**Do not do in this task:** don't invent biographical details — leave `[fill in]` placeholders for anything you don't have real content for, and list them clearly in your summary at the end rather than fabricating.

---

## Task 3 — YouTube channel linking

**Goal:** connect the existing YouTube channel to the site's entity graph.

**Steps:**

1. Confirm channel URL/handle: **[fill in before running agent — a video link (youtu.be/...) is not enough, `sameAs` needs the channel URL itself, e.g. youtube.com/@handle or /channel/UC...]**
2. Add the channel URL to `sameAs` in the `Person` node from Task 2 (already included in the snippet above — just needs the real handle).
3. Also add it to the `Organization` node's `sameAs` array if one exists (check current homepage JSON-LD — Instagram/Facebook/TikTok links are already in the footer per the live site; verify if `sameAs` on `Organization` already lists these socials and add YouTube alongside).
4. Manual step, not code — note in agent summary: channel description on YouTube itself should link back to calmisu.com, and GSC → Insights should be connected to the channel. This is a human action in the YouTube/GSC dashboards, not a repo change.

**Acceptance criteria:**
- [ ] YouTube URL present in `Person.sameAs`
- [ ] YouTube URL present in `Organization.sameAs` if that array exists
- [ ] Agent's final summary explicitly lists the manual GSC/YouTube dashboard steps as NOT done (out of repo scope)

---

## Task 4 — Homepage title/meta rewrite

**Goal:** move brand to the end, surface calligraphy (the only keyword cluster with real impressions).

**Steps:**

1. Find where the homepage `<title>` and `meta description` are set (frontmatter block at the top of the homepage, per the live fetch — likely `src/pages/index.astro` frontmatter or a shared SEO component).
2. Replace:
   - Current title: `Calmisu — Free Anxiety Relief App: Breathing & Grounding`
   - New title: `Anxiety Relief App: Breathing & Calligraphy | Calmisu`
   - Also update `og:title` and `twitter:title` (currently duplicated from title — keep them in sync)
3. Meta description — keep the existing one, it already covers calligraphy:
   > "Calm anxiety and panic with guided breathing, 5-sense grounding, mindful calligraphy and meditation sounds. Free Android app — no ads, no account needed."
   No change needed here unless the agent finds it now exceeds recommended length after other edits — don't touch otherwise.

**Acceptance criteria:**
- [ ] `<title>`, `og:title`, `twitter:title` all updated and consistent
- [ ] Meta description unchanged
- [ ] Rendered `<title>` is 60 characters or fewer (count it — current proposed string is 55, confirm after any tweak)

**Do this task in the same deploy as Task 6 (pillar page), not standalone** — per audit doc, this is the last homepage title change planned before October; batch it with other homepage-adjacent work.

---

## Task 5 — Favicon replacement

**Goal:** replace the current favicon with one derived from the real app icon, sized correctly for browser tabs.

**Source:** `public/icon_cloud.png` (already in the repo — the actual Calmisu app icon: cloud character on blue gradient, 316×316). Do not use any other source image for this task.

**Files provided separately** (pre-rendered from `icon_cloud.png`, ready to drop in): `favicon.ico` (multi-size 16/32/48), `favicon-32x32.png`, `favicon-96x96.png`, `apple-touch-icon.png` (180×180).

No SVG version — the source has gradients/shadows that don't convert cleanly to SVG, and raster + `.ico` fallback covers all browsers that matter. Don't generate one.

**Steps:**

1. Place the four provided files into `public/`, overwriting any existing favicon files there. Leave `icon_cloud.png` itself in place (still the source of truth / used elsewhere).
2. Find existing `<link rel="icon" ...>` tags in the base layout `<head>` and replace with:
   ```html
   <link rel="icon" href="/favicon.ico" sizes="32x32" />
   <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
   ```
3. Remove any old favicon files from `public/` that are no longer referenced (only if clearly superseded — don't delete `icon_cloud.png` or anything used elsewhere, e.g. Play Store assets).

**Acceptance criteria:**
- [ ] Old favicon `<link>` tags fully replaced, no duplicates
- [ ] New files present in `public/` and referenced paths resolve after build
- [ ] Visually confirm (screenshot or local build) favicon renders at browser tab size
- [ ] `icon_cloud.png` untouched and still in `public/`

---

## Explicitly out of scope for this agent run

Per the audit doc, do NOT implement these in this pass — they're either manual/non-repo work or intentionally deferred:
- Pillar page `/blog/calligraphy-meditation/` and new blog posts (content work, separate task)
- Related-posts block + `BreadcrumbList` schema
- Play Store listing changes (not in this repo)
- In-app review prompt deploy (different repo: `calmisu`)
- `ReviewsSection` enablement (needs a product decision on real reviews vs. trust badges first — flag as blocked, don't guess)
- Any further edits to blog post titles/H1s (already done, do not touch)
- FAQPage schema (already implemented, no changes needed — rich results are deprecated for this content type, this is expected)

---

## Final agent output should include

1. List of every file changed, with a one-line reason per file
2. Any placeholder values left unfilled (author name, YouTube handle, brand color) that need a human decision before merge
3. Confirmation that `robots.txt` was not touched
4. A note on whether the assumed file paths above matched reality, and what the actual paths were if different
