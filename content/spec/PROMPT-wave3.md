# Prompt 2 — Land the migration (run in a NEW chat, after Wave 2)

Paste this as the first message of a fresh chat, once Wave 2 has landed and you've read its report.

---

The Astro migration is code-complete (Waves 0–2). Land it.

Read `content/spec/PROGRESS.md` for state, then work through the following. Do this yourself —
no subagents needed unless something turns out to be large.

## 1. Independent verification (don't trust the Wave 2 report)

```bash
rm -rf dist
PUBLIC_API_BASE_URL=https://example.invalid \
PUBLIC_GOOGLE_APPS_SCRIPT_URL=https://example.invalid \
npm run build
npx tsc --noEmit
npm test
```

Then confirm, against the built output:

- 12+ routes emitted; every `<title>` differs; no empty `<div id="root">` anywhere.
- `dist/CNAME` contains `calmisu.com` — **if this is missing the custom domain breaks on deploy.**
- `dist/alma/` byte-matches `public/alma/`.
- `dist/sitemap-0.xml` lists the indexable URLs and **excludes** `/delete-account/`.
- Zero `react-router` and zero `VITE_` references anywhere in `src/`.

Run `npm run preview` and click through every route plus a deliberately bad URL — the real 404
must render with no redirect-to-`/` flash. That flash is the exact hack this migration exists to
remove, so verify it visually rather than assuming.

## 2. Review the full diff

`git diff` + `git status` across Waves 1–2 combined. This is a large diff touching deletions,
env renames, and the deploy workflow — read it properly before committing.

## 3. Commit and open a PR

Group into logical commits (scaffold-adjacent fixes / pages / cleanup+deploy), not one giant
blob. Then push `migrate-to-the-astro` and open a PR against `main` describing:
the SEO rationale, the route inventory, the env-key rename (`VITE_*` → `PUBLIC_*`, repo secret
names unchanged), and the Node 20 → 22 bump.

**Ask me before pushing or opening the PR.**

## 4. Deploy verification (after merge — surface, don't guess)

- `https://calmisu.com/sitemap-index.xml` loads.
- `view-source:https://calmisu.com/en/privacy-policy` shows real server-rendered HTML.
- Submit the sitemap in Google Search Console.
- Re-scrape in Facebook Sharing Debugger + Twitter Card Validator (they cache aggressively).
- Watch Search Console for crawl errors on previously-SPA-routed URLs over the next 2 weeks.

## 5. Open follow-ups to raise with me

- **Delete-account content decision (unresolved).** The deleted static
  `public/delete-account/index.html` had an in-app deletion step list, a
  `hello@calmisu.com` contact path, and a refund-policy footnote — none of which exist in the
  ported React form. Restoring them needs new copy + 3 translations, so it was deliberately not
  invented. May be legally load-bearing. Ask me to decide.
- **Dependency pruning PR** — unused shadcn primitives and `recharts`, `embla-carousel-react`,
  `cmdk`, `vaul`, `input-otp`, `next-themes`, `react-day-picker`.
- **More articles** — the collection now supports them; only 2 exist plus 1 draft.
