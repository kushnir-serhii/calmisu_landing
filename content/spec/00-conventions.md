# Shared Conventions & Repo Facts

**Every agent working on this migration reads this file first.**

Repo root: `c:\Users\serg9\Documents\GitHub\calmisu_landing`
Target: static Astro site on GitHub Pages, custom domain `calmisu.com`.

---

## Verified repo facts

These were confirmed by reading the code. Trust them; don't re-derive.

### Current routes (`src/App.tsx`, react-router-dom v6.30.1)

| Path | Page component |
|---|---|
| `/` | `src/pages/Index.tsx` |
| `/:lang/privacy-policy` | `src/pages/PrivacyPage.tsx` |
| `/:lang/terms-of-service` | `src/pages/TermsPage.tsx` |
| `/delete-account` | `src/pages/DeleteAccountPage.tsx` |
| `*` | `src/pages/NotFound.tsx` |

Languages are **`en` / `pl` / `uk`** in URLs. Note the mismatch: the Ukrainian *component* files are named `.ua.tsx` but the *URL segment* is `uk`. Preserve `uk` in URLs — those paths may already be indexed.

### react-router-dom is used in only 6 files

`src/App.tsx`, `src/components/NavLink.tsx`, `src/components/ui/LanguageSwitcher.tsx`, `src/pages/NotFound.tsx`, `src/pages/PrivacyPage.tsx`, `src/pages/TermsPage.tsx`.

**The 8 landing-page components have zero react-router coupling** — `Header.tsx` uses plain `<a>` tags. This makes the landing port low-risk.

**`src/components/NavLink.tsx` is dead code** — grep confirms zero usages anywhere. Delete it in task-06, don't port it.

### Landing page composition (`src/pages/Index.tsx`)

`AnimatedSection` is defined **inline inside `Index.tsx`** (not its own file). It wraps sections in an IntersectionObserver fade/slide-up using `useScrollAnimation` from `src/hooks/use-scroll-animation.tsx`.

Order, with delays: `Header` → `HeroSection` → `FeaturesFlow`(100) → `FeaturesScience`(150) → ~~`ReviewsSection`(200)~~ → `ChatSection`(250) → `FAQSection`(300) → `CTASection`(350) → `Footer`(400).

**`ReviewsSection` is currently commented out.** Keep it commented out / omitted — do not silently re-enable it.

Root wrapper class: `flex flex-col items-center w-full bg-background overflow-hidden`.

### Interactivity inventory

| Component | Interactive? | Notes |
|---|---|---|
| `Header.tsx` | yes | mobile hamburger, `useState` + body-scroll-lock `useEffect` |
| `HeroSection.tsx` | yes | owns a `NotifyMe` modal instance |
| `CTASection.tsx` | yes | owns a second `NotifyMe` modal instance **and** a `QRCodeGen` (see below) |
| `ChatSection.tsx` | yes | `window` scroll listener → parallax transforms |
| `FAQSection.tsx` | yes | plain `useState` expand/collapse + CSS transitions — no Radix (still needs JS to expand) |
| `FeaturesFlow` / `FeaturesScience` | no | pure markup |
| `Footer.tsx` | no | links + socials; imports `@/assets/calmisu.svg?react` (svgr) |
| `popups/NotifyMe.tsx` | yes | modal, `createPortal`, `fetch` POST to Google Apps Script |
| `ui/QRCodeGen.tsx` | yes | **browser-only** — see SSR hazard below |
| `privacy/*`, `terms/*` | no | pure static content components |

### SSR hazard: `QRCodeGen` / `qr-code-styling`

`src/components/ui/QRCodeGen.tsx` (added recently, commit `e16b46c`) is rendered inside `CTASection.tsx` — a desktop-only (`hidden md:flex`) 44px QR pointing at the Play Store listing.

It imports `qr-code-styling` and, in a `useEffect`, does `new QRCodeStyling(...)` then imperatively `container.innerHTML = ""` + `.append(container)` against a `useRef` div. **`qr-code-styling` is a browser-only library that touches `document` at module scope.**

Under Vite's SPA build this never mattered — nothing rendered server-side. Under Astro, every island is server-rendered at build time first, so a bare top-level `import QRCodeStyling from "qr-code-styling"` inside a component Astro prerenders can crash the build with `document is not defined`.

If that happens, the fix is a dynamic import inside the `useEffect` (which only ever runs client-side):

```tsx
useEffect(() => {
  let cancelled = false;
  import("qr-code-styling").then(({ default: QRCodeStyling }) => {
    if (cancelled) return;
    // ...existing setup
  });
  return () => { cancelled = true; };
}, [data, size]);
```

Task-02 owns this decision. Don't pre-emptively rewrite it — build first, and only apply the workaround if the build actually fails.

### Env vars (only 2, both client-side)

| Current | Becomes | Used in |
|---|---|---|
| `VITE_GOOGLE_APPS_SCRIPT_URL` | `PUBLIC_GOOGLE_APPS_SCRIPT_URL` | `src/components/popups/NotifyMe.tsx:4` |
| `VITE_API_BASE_URL` | `PUBLIC_API_BASE_URL` | `src/lib/api.ts:3` |

Astro only exposes client-side vars prefixed `PUBLIC_`. Both are injected at build time by `.github/workflows/deploy.yml` from repo secrets.

### Known trap: `src/lib/api.ts` imports from a page being deleted

```ts
import { FormValues } from "@/pages/DeleteAccountPage";
```

`src/pages/DeleteAccountPage.tsx` is being deleted. The zod `schema` and the `FormValues` / `Lang` types must move into `src/components/DeleteAccountIsland.tsx` (task-04), and `api.ts` must import from there instead. **task-04 owns both files.**

### `TooltipProvider` is unused

Grep confirms `TooltipProvider` appears only in `src/App.tsx`. Nothing renders a `Tooltip`. Do **not** recreate it anywhere.

### Static assets & passthrough

- `public/images/` (~15 webp/png), `public/icons/`, `public/favicon.svg`, `public/placeholder.svg` — unchanged, Astro serves `public/` identically to Vite.
- `public/.nojekyll`, `public/google99f9a9a64d9ba491.html` (Search Console verification), `CNAME` + `public/CNAME` (`calmisu.com`) — unchanged.
- `src/assets/` — `calmisu.svg` (imported via svgr `?react`), `infinity.webp`, `river_meditation.mp3`.
- **`public/alma/**` — a completely separate static legal-docs microsite for a different app ("Alma"). Copy through untouched. Never create Astro routes for it, never link to it.**

### Files being deleted (all deletions happen in task-06 unless noted)

| File | Why | Deleted by |
|---|---|---|
| `index.html` | Astro has no root HTML entrypoint | task-01 |
| `vite.config.ts` | replaced by `astro.config.mjs` | task-01 |
| `src/main.tsx` | no SPA mount point | task-01 |
| `src/vite-env.d.ts` | replaced by `src/env.d.ts` | task-01 |
| `public/en/privacy-policy/`, `public/pl/privacy-policy/`, `public/uk/privacy-policy/` | superseded by real Astro routes at identical URLs | task-03 |
| `public/delete-account/`, `public/404.html` | superseded by `delete-account.astro` / `404.astro` | task-04 |
| `src/App.tsx`, `src/pages/*.tsx` (all 5), `src/components/NavLink.tsx` | superseded by file-based routing | task-06 |

**Background on the duplicates:** `public/en|pl|uk/privacy-policy/index.html` and `public/delete-account/index.html` are hand-written static HTML that *silently shadow* the SPA routes on GitHub Pages (real files beat the 404 fallback), even though nothing links to them — `LanguageSwitcher` always targets the SPA route. Astro's generated pages become the single real implementation at those same URLs.

**Background on the 404 hack:** `public/404.html` encodes the path into a `?/`-prefixed query string and redirects to `/`; an inline `<script>` in `index.html`'s `<head>` decodes it back via `history.replaceState`. Both exist purely to fake client routing on GH Pages. Astro's `src/pages/404.astro` builds to a real `dist/404.html` that GH Pages serves natively — the hack becomes dead weight.

---

## Wave 0 outcome (task-01, completed)

The scaffold landed. Facts every Wave 1 agent needs:

**Versions pinned.** Astro **5.18.2** (not 7) + `@astrojs/react@4` + `@astrojs/tailwind@6` + `@astrojs/sitemap@3`. `@astrojs/tailwind@6` peers on `astro ^3||^4||^5`, so Astro 7 won't install alongside it. Moving to Astro 7 later means dropping `@astrojs/tailwind` and migrating to Tailwind v4 — which would invalidate the current `tailwind.config.ts` HSL theme. Out of scope.

**tsconfig.** Extends `astro/tsconfigs/base` (not `/strict`). `verbatimModuleSyntax` is explicitly **off** — leaving it on flagged 8 pre-existing files for value-position type imports. `noImplicitAny`, `strictNullChecks`, `noUnusedLocals/Parameters` remain off, matching the old config. `tsconfig.app.json` + `tsconfig.node.json` were collapsed into one `tsconfig.json`; `@/*` → `./src/*` intact.

**svgr works.** `import CalmisuLogo from "@/assets/calmisu.svg?react"` in `Footer.tsx` verified end to end — the SVG inlines into built HTML with zero hydration JS. `src/env.d.ts` carries the `vite-plugin-svgr/client` reference.

**Asset imports changed shape — this bites `CTASection.tsx`.** Under Astro, image imports return `ImageMetadata`, not a string:
```json
{ "src": "/_astro/infinity.iZjE-XyR.webp", "width": 690, "height": 690, "format": "webp" }
```
`CTASection.tsx:46` does `<img src={infinityBg}>` → renders `[object Object]`. **Task-02 owns the fix** (`infinityBg.src`). The `.mp3` import still returns a plain string and is fine.

**Known-broken, assigned to task-06:** `npm test` fails (`vitest.config.ts` imports the now-removed `@vitejs/plugin-react-swc`), and `.github/workflows/deploy.yml` still injects `VITE_*` env keys.

**Expected build noise, harmless:** `[@astrojs/sitemap] No pages found!` until task-02 adds `src/pages/index.astro`, and `Unsupported file type` warnings for the 5 `src/pages/*.tsx` files until task-06 deletes them.

**Dev-server caveat:** the old dev-only `servePublicHtmlPages()` plugin was not ported (per spec). In `astro dev` only, `/alma/en/privacy-policy/` 404s while `/alma/en/privacy-policy/index.html` works. Production is unaffected — GH Pages serves directory indexes and `dist/alma/` is byte-identical to `public/alma/`.

---

## Contracts

### `BaseLayout.astro` contract

Created by task-01. Every page uses it. Props:

```ts
interface Props {
  title: string;            // full <title>, no site-name suffix appended automatically
  description: string;
  ogImage?: string;         // absolute or root-relative; defaults to "/images/calmisuog.png"
  canonicalUrl?: string;    // defaults to Astro.url.href
  ogType?: "website" | "article";  // defaults to "website"

  // --- added in task-06 (Wave 2) ---
  lang?: string;    // <html lang>; defaults to "en". Localized legal pages pass "pl" / "uk".
  noindex?: boolean; // emits <meta name="robots" content="noindex, nofollow">. Used by /delete-account/.
}
```

It renders `<html lang>`, the full `<head>` (charset, viewport, title, description, OG, Twitter card, favicon, canonical), imports `src/index.css` globally, and exposes `<slot />`.

**Head injection (added in task-06).** `BaseLayout` also exposes a named `head` slot as the last
child of `<head>`. Pages inject extra `<meta>` / `<link>` tags through it:

```astro
<BaseLayout title={...} description={...}>
  <Fragment slot="head">
    <meta property="article:published_time" content={pubDate.toISOString()} />
  </Fragment>
  ...body...
</BaseLayout>
```

Current consumers: `articles/[...slug].astro` (OG article timestamps) and both
`[lang]/*.astro` legal pages (hreflang alternates + `x-default`). `/delete-account/` uses the
`noindex` prop instead, and is also excluded from the sitemap via the `filter` in
`astro.config.mjs` — **keep those two in sync.**

Current production meta values to use as the site-wide defaults:

- title: `Calmisu — Calm Your Anxiety`
- description: `Ease anxiety with guided breathing, calming sounds, and grounding techniques. Free to download.`
- og:image: `https://calmisu.com/images/calmisuog.png` (1200×630)
- twitter:card: `summary_large_image`
- favicon: `/favicon.svg`

### `LanguageSwitcher` contract

**Owned by task-03. Consumed by task-03 and task-04.** Current file uses `useLocation`/`Link` from react-router; both must go. Frozen new signature:

```tsx
export const LanguageSwitcher = ({
  lang,           // currently active lang: "en" | "pl" | "uk"
  currentPath,    // NEW — required in link mode; pass Astro.url.pathname from the .astro page
  onLangChange,   // unchanged — when provided, renders <button>s instead of links
}: {
  lang: string;
  currentPath?: string;
  onLangChange?: (lang: string) => void;
}) => { ... }
```

- **Link mode** (no `onLangChange`, used by privacy/terms): renders plain `<a href={`/${l}${path}`}>` where `path = currentPath.replace(/^\/(en|pl|uk)/, "")`. Islands cannot read `Astro.url`, hence the prop.
- **Button mode** (`onLangChange` provided, used by delete-account): unchanged behaviour, no `currentPath` needed.

Keep the existing flag icons (`./flags/UkFlagIcon`, `PlFlagIcon`, `UaFlagIcon`) and the existing class strings verbatim.

---

## Island directive rules

Astro ships zero JS by default. Add a `client:*` directive **only** where interactivity is real.

| Directive | Use for |
|---|---|
| *(none)* | static content — renders to HTML, ships no JS |
| `client:load` | above-the-fold interactivity (`Header`, `HeroSection`) |
| `client:visible` | below-the-fold interactivity (`ChatSection`, `FAQSection`, `CTASection`, `AnimatedSection`) |

A React component rendered **without** a directive still server-renders its markup — this is how `Privacy.en.tsx` etc. become static HTML with no hydration cost.

**No global provider tree.** Astro has no root `App` component. Each island is an independent React tree. Providers (`QueryClientProvider`, `Toaster`, `Sonner`) get scoped inside the one island that needs them (task-04), never hoisted.

---

## Styling

- Tailwind v3.4.17 via `@astrojs/tailwind`, reusing the existing `tailwind.config.ts` (HSL CSS-var theme, `fontFamily` Orienta/Roboto, `tailwindcss-animate`).
- `src/index.css` carries over **unchanged** — Google Fonts `@import`, `@tailwind` directives, `:root` CSS vars. It moves from being imported by `src/main.tsx` to being imported by `BaseLayout.astro`.
- No CSS-in-JS, no CSS modules. Inline `style={{ transform }}` in `ChatSection` is plain JS, leave it.
- `@tailwindcss/typography` is already a devDependency but currently **unused** — task-05 finally uses it for article `prose` styles.
- `darkMode: ["class"]` is configured but no dark palette exists. Don't add one.

## Verification baseline

Any agent that runs a build must set both env vars or the build may emit empty strings:

```bash
PUBLIC_API_BASE_URL=https://example.invalid PUBLIC_GOOGLE_APPS_SCRIPT_URL=https://example.invalid npm run build
```

Expected final `dist/` (after task-06):

```
dist/index.html
dist/en/privacy-policy/index.html
dist/pl/privacy-policy/index.html
dist/uk/privacy-policy/index.html
dist/en/terms-of-service/index.html
dist/pl/terms-of-service/index.html
dist/uk/terms-of-service/index.html
dist/delete-account/index.html
dist/articles/index.html
dist/404.html
dist/sitemap-index.xml
dist/CNAME
dist/alma/...            (passthrough, untouched)
```

## Ground rules

1. **Stay in your lane.** Edit only files your task owns (see the ownership table in `README.md`). If you believe you need to edit someone else's file, stop and report it instead.
2. **Wave 1 is additive.** Don't delete `src/App.tsx` or any `src/pages/*.tsx` — task-06 does that.
3. **Preserve URLs.** `/en/privacy-policy`, `/uk/terms-of-service`, `/delete-account` etc. must resolve to the same paths afterwards. They may be indexed.
4. **Don't touch `public/alma/`.**
5. **Don't re-enable `ReviewsSection`.**
6. **Report, don't guess.** If a component doesn't behave as this doc describes, say so in your final report rather than inventing a workaround.
