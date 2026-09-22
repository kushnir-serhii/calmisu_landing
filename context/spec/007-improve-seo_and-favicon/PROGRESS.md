# 007 — Progress

**Status: ✅ Done, merged to `main`.**

Verified against the current tree (2026-09-22) — implemented on the `seo-redirects-fix` /
`new-favicons-color` branches, both merged.

| Task | Status |
|---|---|
| 1 — Deindex `/alma/*`, keep reachable | ✅ Done — `noindexFollow` prop on all 3 alma pages, `astro.config.mjs` sitemap filter excludes `/alma/` |
| 2 — Author identity (E-E-A-T) | ✅ Done — blog frontmatter uses `authorName`/`authorBio` (not literal `author:`, functionally equivalent); `/about.astro` exists; `Person` node + `founder` link in homepage JSON-LD (`src/pages/index.astro`); `BlogPosting` schema in `src/pages/blog/[...slug].astro` |
| 3 — YouTube channel linking | ✅ Done — `https://www.youtube.com/@Calmisu` wired into `sameAs` in `src/pages/index.astro`. Manual GSC/YouTube-dashboard steps from the spec are outside repo scope — not tracked here. |
| 4 — Homepage title/meta rewrite | ✅ Done — `title="Anxiety Relief App: Breathing & Calligraphy | Calmisu"` in `src/pages/index.astro` |
| 5 — Favicon replacement | ✅ Done — `favicon.ico`, `favicon-32x32.png`, `favicon-96x96.png`, `apple-touch-icon.png` present in `public/` |

## Not verified in this pass (out of repo / needs manual confirmation)

- `robots.txt` unchanged — not re-checked, spec says don't touch it and nothing in the diff history suggests it was.
- No clinical credentials claim — worth a human glance at `/about.astro` copy, per the spec's explicit caution, but not re-audited here.
- Manual YouTube/GSC dashboard steps (channel description backlink, Search Console ↔ channel link) — non-repo, still the user's to do if not already done.
