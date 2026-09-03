# Migration Progress

Resume point for a fresh session. Read this, then `README.md`, then `00-conventions.md`.

## Status

| Wave | Task | Status |
|---|---|---|
| 0 | task-01 scaffold | ✅ **done**, committed `c6609bb` |
| 1 | task-02 landing | ✅ **done**, uncommitted |
| 1 | task-03 legal pages | ✅ **done**, uncommitted |
| 1 | task-04 delete-account + 404 | ✅ **done**, uncommitted |
| 1 | task-05 articles + sitemap | ✅ **done**, uncommitted |
| 2 | task-06 integration | ✅ **done**, uncommitted |

Branch: `migrate-to-the-astro` (base commit `452c654`).
**Waves 1 and 2 are in the working tree, unstaged and uncommitted**, by design — agents were told not to commit.

**The migration is now code-complete.** What remains is the user-facing post-deploy checklist
at the bottom of this file, plus the explicitly-deferred follow-ups.

## Wave 1 verification (run against the combined tree, not per-agent)

- `npx astro build` → **12 pages**, no errors.
- `npx tsc --noEmit` → clean.
- All page `<title>`s unique and correct, including the Cyrillic `uk` pages.
- No `[object Object]` in output (the `CTASection` `ImageMetadata` bug is fixed — `infinityBg.src`).
- `sitemap-0.xml` lists 11 URLs; `robots.txt` points at `sitemap-index.xml`.

Routes now emitting: `/`, `/404`, `/articles/`, 2 articles, `/delete-account/`,
and `{en,pl,uk} × {privacy-policy, terms-of-service}`.

## Wave 2 (`task-06-integration.md`) — COMPLETE

All of task-06 steps 1–7 ran, plus the four extra items below that were discovered during
Wave 1. Step 8 is a user-facing checklist and was deliberately **not** performed — it's
reproduced at the bottom of this file.

### Wave 2 verification (run against the full tree)

- `npm run build` (with both `PUBLIC_*` env vars set) → **12 pages**, no errors.
  The `Unsupported file type` warnings are gone now that `src/pages/*.tsx` are deleted.
- `npx tsc --noEmit` → clean (exit 0).
  `npx astro check` was **skipped**: it wants to install `@astrojs/check` + `typescript` as new
  deps, and the task allows `tsc --noEmit` as the alternative. Adding a dep wasn't in scope.
- `npm test` → **1 test file, 1 test, passing.** Fixed by dropping the React plugin from
  `vitest.config.ts` (rather than installing `@vitejs/plugin-react`) — the plugin only ever
  provided Fast Refresh, which tests don't use, and Vite's esbuild already transforms `.tsx`.
- `npm run preview` click-through: all 12 routes return 200, `/this-does-not-exist/` returns a
  real **404** serving the Astro 404 page (title `Page Not Found — Calmisu`), with no
  redirect-to-`/` flash. Grep confirms zero `history.replaceState` / SPA-redirect leftovers in
  `dist/`. `/alma/en/privacy-policy/` returns 200.
- `dist/CNAME` contains `calmisu.com`. `diff -r public/alma dist/alma` → **identical**.
- All 12 `<title>`s unique, including the Cyrillic `uk` pages. No `id="root"` in any page.
- Zero `VITE_` strings in `src/` and zero in built `dist/` output.
- `sitemap-0.xml` is now **10 URLs** (was 11) — `/delete-account/` correctly filtered out.

### 1. Repoint the `Lang` import — ✅ done

`src/data/deletAccount.ts:1` now imports `Lang` from `@/components/DeleteAccountIsland`,
repointed in the same change that deleted `DeleteAccountPage.tsx`. Build is green.

### 2. `BaseLayout.astro` head slot — ✅ done, all three consumers wired

`BaseLayout.astro` gained a named `head` slot (last child of `<head>`) plus two new props,
`lang?: string` and `noindex?: boolean`. A named slot was chosen over an `extraMeta[]` prop
because two of the three consumers need `<link>` elements, not just `<meta>`.

| Wanted | Mechanism | Verified in `dist/` |
|---|---|---|
| `article:published_time` / `article:modified_time` | `<Fragment slot="head">` | ✅ `published_time` present; `modified_time` correctly absent — **neither article sets `updatedDate`** |
| `hreflang` alternates on the 6 legal pages | `<Fragment slot="head">` | ✅ 3 alternates + `x-default` → `/en/...` on each of the 6 |
| `noindex` on `/delete-account/` | `noindex` prop | ✅ present there and **only** there |

Bonus fix in the same change: `<html lang>` was hard-coded `"en"` on every page, so the `pl`
and `uk` legal pages were declaring the wrong language — which would have contradicted the new
hreflang tags. They now emit `lang="pl"` / `lang="uk"`.

Sitemap `filter` added in `astro.config.mjs`; `/delete-account/` is out of `sitemap-0.xml`.
**These two must stay in sync** — a page that's `noindex` shouldn't be in the sitemap.

### 3. Register the typography plugin — ✅ done

`@tailwindcss/typography` is now in `tailwind.config.ts`'s `plugins` array. The hand-rolled
`.article-prose` block in `src/pages/articles/[...slug].astro` was **left in place** (explicitly
optional/out of scope). It layers on top of `prose` harmlessly, but see the follow-up note below.

### 4. Spec inaccuracy — ✅ corrected

`00-conventions.md` no longer claims `FAQSection.tsx` uses Radix Accordion. The `BaseLayout`
contract section in that file was also updated to document the new `head` slot / `lang` /
`noindex` additions, since it had gone stale.

### Other task-06 work (steps 1–7)

- **Env rename finished.** `NotifyMe.tsx` now reads `PUBLIC_GOOGLE_APPS_SCRIPT_URL`.
  `.env.example` and `.env.local` keys renamed `VITE_*` → `PUBLIC_*`. **No values were invented:**
  `.env.local` never had a Google Apps Script value and still doesn't.
- **Dead SPA deleted** (8 files): `src/App.tsx`, `src/App.css`, all 5 `src/pages/*.tsx`,
  `src/components/NavLink.tsx`. Verified unreferenced by grep first — `App.css` and `NavLink.tsx`
  had zero references anywhere; the 5 pages were referenced only by `App.tsx`, deleted alongside.
- **`react-router-dom` removed** from `package.json` *and* `package-lock.json` (`npm uninstall`).
  Zero `react-router` references remain in `src/`.
- **Articles nav link** added to `src/data/navLinks.ts`. `Header.tsx` and `Footer.tsx` both map
  over `navLinks` directly, so **neither needed editing** — the link appears in both.
- **`deploy.yml`**: env keys → `PUBLIC_*` (repo secret names `secrets.VITE_*` unchanged, as
  specified), `node-version` 20 → 22. `engines.node` → `>=22` to match.

## New follow-ups discovered in Wave 2

1. **The Articles nav link opens in a new tab.** `navLinks`' `isOuterLink: true` flag sets
   `target="_blank" rel="noopener noreferrer"`, and the task spec said real routes use that flag.
   So `/articles/` now opens in a new tab — same as Privacy/Terms already did. That's the existing
   convention, but for a first-party content page it's arguably wrong UX. **Product decision:**
   the flag conflates "is a route, not an anchor" with "open in new tab"; splitting it into two
   flags would be the clean fix. Not done — it would change existing Privacy/Terms behaviour.
2. **`href` trailing-slash inconsistency in `navLinks.ts`.** The new entry uses `/articles/`
   (matching the other article links and avoiding a 301), while the pre-existing entries use
   `/en/privacy-policy` with no trailing slash. Harmless — GitHub Pages redirects — but it's one
   extra hop on those two links. Left as-is to avoid touching working URLs.
3. **`.article-prose` and `prose` now both apply.** Registering `@tailwindcss/typography` means
   `<div class="article-prose prose">` gets both rule sets. Verified visually harmless
   (`.article-prose` wins on specificity for the properties it sets), but collapsing the two into
   one is worth doing when someone next touches article styling.
4. **`astro check` is not installed.** Only `tsc --noEmit` is available for type checking. If CI
   should type-check `.astro` files properly, add `@astrojs/check` — deliberately not added here.
5. **Dependency pruning still pending** — `recharts`, `embla-carousel-react`, `cmdk`, `vaul`,
   `input-otp`, `next-themes`, `react-day-picker` and the unused shadcn primitives are all still
   installed. Explicitly a separate follow-up PR; untouched by Wave 2.

## Open question for the user (content decision, not a code task)

The deleted static `public/delete-account/index.html` contained copy with **no equivalent** in
the ported React form:

- an "Option 1 — delete in the app" step list
- an "Option 2 — email hello@calmisu.com" contact path
- a refund-policy footnote ("Active subscriptions are not automatically refunded…")

The React form only gestures at this via `t.inAppNote`. Restoring it means writing new copy and
three translations, which is outside "port verbatim" — so it was deliberately left out rather
than invented. Decide whether the new page should regain this content.

**Still open after Wave 2.** Task-06 did not resolve it — writing that copy plus three
translations remains out of scope for an implementation agent. Note the page is now `noindex`
and sitemap-excluded, so this is a UX/support gap, not an SEO one.

## Post-deploy checklist (task-06 step 8 — for the user, after merging to `main`)

Not performed by any agent. Run these once the deploy workflow has published to `main`:

1. Verify `https://calmisu.com/sitemap-index.xml` loads and points at `sitemap-0.xml` (10 URLs).
2. Submit the sitemap in **Google Search Console**.
3. Re-scrape in the **Facebook Sharing Debugger** and **Twitter/X Card Validator** — both cache
   OG data aggressively and will otherwise keep serving the old SPA-era preview.
4. Spot-check `view-source:https://calmisu.com/en/privacy-policy` shows real HTML, not an
   empty `<div id="root">`. This is the whole point of the migration.
5. Watch Search Console for crawl errors on the previously SPA-routed URLs over the next two
   weeks. All URLs were preserved, so there should be none — but confirm rather than assume.
6. Confirm the custom domain still resolves (i.e. `dist/CNAME` survived the deploy) — if
   `calmisu.com` 404s right after deploy, that's the first thing to check.

## Notes

- Agent names resolved correctly this session (`react-islands`, `content-seo`); the Wave 0
  fallback note no longer applies.
- **Parallel-agent hazard, if a future wave runs concurrently again:** agents sharing one working
  tree also share `node_modules/.vite`. Two `astro dev` instances clobbered it and produced bogus
  `useState of null` / `jsxDEV is not a function` errors. `astro dev --force` clears it.
  Unique `--port` and `--outDir` per agent were otherwise sufficient.
