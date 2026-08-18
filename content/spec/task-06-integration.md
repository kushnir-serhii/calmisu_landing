# Task 06 — Cleanup, env rename, deploy workflow, final verification

**Wave:** 2 (blocking — run only after tasks 02, 03, 04, 05 have all landed)
**Agent:** `astro-architect`
**Repo:** `c:\Users\serg9\Documents\GitHub\calmisu_landing`

> Read `content/spec/00-conventions.md` first, then skim the four Wave 1 task files so you know what each agent reported.

## Goal

Close out the migration: delete the now-dead SPA, finish the env-var rename, update the GitHub Actions workflow, wire the articles nav link, and verify the whole build end to end.

You're the only agent running now, so you can touch files across the tree — but check the Wave 1 reports first for anything flagged as unresolved.

## Files you own

**Modify:** `src/components/popups/NotifyMe.tsx`, `.github/workflows/deploy.yml`, `src/data/navLinks.ts`, `src/components/Header.tsx`, `src/components/Footer.tsx`, `package.json`
**Delete:** `src/App.tsx`, `src/App.css`*, `src/pages/Index.tsx`, `src/pages/NotFound.tsx`, `src/pages/PrivacyPage.tsx`, `src/pages/TermsPage.tsx`, `src/pages/DeleteAccountPage.tsx`, `src/components/NavLink.tsx`

\* verify `App.css` is genuinely unreferenced before deleting.

## Steps

### 1. Finish the env rename

`src/components/popups/NotifyMe.tsx:4`:
```ts
const GOOGLE_APPS_SCRIPT_URL = import.meta.env.PUBLIC_GOOGLE_APPS_SCRIPT_URL as string;
```

`src/lib/api.ts` was already renamed by task-04 — **verify** it reads `PUBLIC_API_BASE_URL` and don't redo it.

Then grep the whole tree for any remaining `VITE_` reference:
```bash
grep -rn "VITE_" src/ .github/ astro.config.mjs
```
Everything in `src/` must be `PUBLIC_`. (`.github/` legitimately still references `secrets.VITE_*` — see below.)

If a `.env` / `.env.local` / `.env.example` exists, rename its keys too.

### 2. Delete the dead SPA

All five `src/pages/*.tsx`, `src/App.tsx`, and `src/components/NavLink.tsx` (confirmed dead code — zero usages anywhere, never ported).

Then confirm react-router is fully unreferenced:
```bash
grep -rn "react-router" src/
```
Expect **zero** hits. Remove `react-router-dom` from `package.json`.

If anything still imports it, something in Wave 1 was missed — investigate before removing the dep.

### 3. Articles nav link

Task-05 deliberately left this to you (task-02 was mounting `Header`/`Footer` in parallel). Using the slugs from task-05's report:

- Add an entry to `src/data/navLinks.ts` pointing at `/articles`. The existing shape is:
  ```ts
  { label: "Privacy Policy", isOuterLink: true, href: "/en/privacy-policy" }
  ```
  Anchor links use `href: "#features"`; real routes set `isOuterLink: true`. Follow that convention.
- Check how `Header.tsx` consumes `navLinks` and whether `Footer.tsx` needs a matching link.
- Only add this if task-05 actually shipped articles.

### 4. `.github/workflows/deploy.yml`

Update the build step's env block — the **secret names in the repo stay as they are**, only the env keys exposed to the build change:

```yaml
- name: Build
  run: npm run build
  env:
    PUBLIC_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
    PUBLIC_GOOGLE_APPS_SCRIPT_URL: ${{ secrets.VITE_GOOGLE_APPS_SCRIPT_URL }}
```

Unchanged: `npm ci`, `upload-pages-artifact` with `path: ./dist` (Astro's default `outDir` is also `dist`), `deploy-pages@v4`, the `pages`/`id-token` permissions, the `concurrency` group.

**Bump `node-version` from 20 to 22.** GitHub deprecated Node 20 on Actions runners (the deploy log warns about it), and Astro supports 22. Also update `engines.node` in `package.json` to `>=20` → keep or raise to `>=22` consistently.

### 5. Final `package.json` pass

- Scripts: `dev`/`build`/`preview` → `astro *` (task-01 did this; verify).
- Deps removed: `vite`, `@vitejs/plugin-react-swc`, `lovable-tagger` (task-01), `react-router-dom` (now).
- Deps kept: `astro`, `@astrojs/*`, `react`, `react-dom`, `vite-plugin-svgr`, Radix, `react-hook-form`, `zod`, `@hookform/resolvers`, `@tanstack/react-query`, `sonner`, `lucide-react`, Tailwind + plugins.
- **Do not** prune the unused shadcn primitives or heavy deps (`recharts`, `embla-carousel-react`, `cmdk`, `vaul`, `input-otp`, `next-themes`, `react-day-picker`) — explicitly a separate follow-up PR.

### 6. Full verification

```bash
rm -rf dist
PUBLIC_API_BASE_URL=https://example.invalid \
PUBLIC_GOOGLE_APPS_SCRIPT_URL=https://example.invalid \
npm run build
```

Confirm `dist/` contains:

```
index.html
en/privacy-policy/index.html      pl/privacy-policy/index.html      uk/privacy-policy/index.html
en/terms-of-service/index.html    pl/terms-of-service/index.html    uk/terms-of-service/index.html
delete-account/index.html
articles/index.html               articles/<slug>/index.html   (×2)
404.html
sitemap-index.xml                 sitemap-0.xml
CNAME                             .nojekyll
robots.txt                        favicon.svg
google99f9a9a64d9ba491.html
images/                           icons/
alma/                             (passthrough, untouched)
```

Then verify the migration actually achieved its purpose:

- [ ] **The SEO fix landed.** `grep -c 'Privacy' dist/en/privacy-policy/index.html` returns real content, and no built page contains an empty `<div id="root">`.
- [ ] **Meta is per-page.** `grep -h '<title>' dist/index.html dist/en/privacy-policy/index.html dist/articles/*/index.html` — every title differs.
- [ ] **CNAME survived** — `dist/CNAME` contains `calmisu.com`, or the custom domain breaks on deploy.
- [ ] **Alma untouched** — `dist/alma/` matches `public/alma/`.
- [ ] `npx astro check` (or `tsc --noEmit`) is clean.
- [ ] `npm run preview`, then click through every route including a deliberately bad URL (confirm the real 404 renders, with no redirect-to-`/` flash — proving the hack is gone).

### 7. Post-deploy checklist (hand to the user, don't do it yourself)

- Verify `https://calmisu.com/sitemap-index.xml` loads.
- Submit the sitemap in Google Search Console.
- Re-scrape the site in Facebook Sharing Debugger + Twitter Card Validator (social platforms cache aggressively).
- Spot-check `view-source:https://calmisu.com/en/privacy-policy` shows real HTML.
- Watch Search Console for crawl errors on the previously-SPA-routed URLs over the next couple of weeks.

## Done criteria

- [ ] Zero `react-router` references in `src/`; dep removed.
- [ ] Zero `VITE_` references in `src/`.
- [ ] All 7 dead files deleted; build still green.
- [ ] Workflow uses `PUBLIC_*` env keys and Node 22.
- [ ] Full `dist/` manifest above verified.
- [ ] Every route clicked through in `npm run preview`.

## Report back

- The final `dist/` file listing.
- Anything a Wave 1 agent flagged that's still unresolved.
- Confirmation that `dist/CNAME` and `dist/alma/` are intact.
- The post-deploy checklist, surfaced to the user as the actual next step.
