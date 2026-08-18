# Task 03 — Legal pages (privacy / terms) + LanguageSwitcher

**Wave:** 1 (parallel with tasks 02, 04, 05)
**Agent:** `react-islands`
**Repo:** `c:\Users\serg9\Documents\GitHub\calmisu_landing`
**Depends on:** task-01 (`BaseLayout.astro` must exist)

> Read `content/spec/00-conventions.md` first — especially the **LanguageSwitcher contract**, which task-04 also codes against.

## Goal

Turn `/:lang/privacy-policy` and `/:lang/terms-of-service` into real prerendered pages (6 HTML files, one per lang × doc), and delete the hand-written static duplicates that currently shadow them.

This is the clearest SEO win in the migration: today these pages are client-rendered SPA routes whose HTML is an empty root div, *or* — at those exact URLs on GitHub Pages — stale hand-written HTML files nothing links to. Afterwards there's one real, indexable, per-language page each.

## Files you own

**Create:** `src/pages/[lang]/privacy-policy.astro`, `src/pages/[lang]/terms-of-service.astro`
**Modify:** `src/components/ui/LanguageSwitcher.tsx`
**Delete:** `public/en/privacy-policy/`, `public/pl/privacy-policy/`, `public/uk/privacy-policy/`
**Read-only:** `src/components/privacy/Privacy.{en,pl,ua}.tsx`, `src/components/terms/Terms.{en,pl,ua}.tsx`, `src/components/ui/flags/*`
**Do not delete** `src/pages/PrivacyPage.tsx` / `TermsPage.tsx` — task-06 does that.

## Steps

### 1. Refactor `LanguageSwitcher.tsx` off react-router

Current implementation uses `useLocation()` and `<Link to=...>`. Replace per the frozen contract:

```tsx
export const LanguageSwitcher = ({
  lang,
  currentPath,
  onLangChange,
}: {
  lang: string;
  currentPath?: string;
  onLangChange?: (lang: string) => void;
}) => { ... }
```

- **Link mode** (no `onLangChange`): `const path = (currentPath ?? "").replace(/^\/(en|pl|uk)/, "")`, render `<a href={`/${l}${path}`}>`. Islands can't read `Astro.url`, so the page passes `currentPath={Astro.url.pathname}`.
- **Button mode** (`onLangChange` given): behaviour unchanged — task-04's delete-account page relies on this and passes no `currentPath`.

Keep the flag icons, the `langs = ["en","pl","uk"]` list, and the existing class strings (`flex gap-3`, and the active/inactive `font-bold` / `opacity-40 hover:opacity-100`) **verbatim**. Remove the react-router import entirely.

### 2. `src/pages/[lang]/privacy-policy.astro`

```astro
export function getStaticPaths() {
  return [{ params: { lang: "en" } }, { params: { lang: "pl" } }, { params: { lang: "uk" } }];
}
```

Mirror what `src/pages/PrivacyPage.tsx` does today:

```tsx
const content = { en: <PrivacyEn />, pl: <PrivacyPl />, uk: <PrivacyUa /> };
```

Note the naming mismatch — URL segment `uk` maps to the component file `Privacy.ua.tsx` (`PrivacyUa`). **Keep `uk` in the URL**; those paths may be indexed.

Layout to reproduce from `PrivacyPage.tsx`:
```html
<div class="flex flex-col px-2 lg:px-36">
  <div class="ml-auto mt-10"><LanguageSwitcher ... /></div>
  <div><!-- content component --></div>
</div>
```

Hydration:
- `LanguageSwitcher` → `client:load`, with `lang={lang}` and `currentPath={Astro.url.pathname}`
- The content component (`PrivacyEn` etc.) → **no directive at all**. It's pure static content; rendering it without hydration is exactly the point — full HTML, zero JS.

Per-page meta via `BaseLayout`, localised per language, e.g.:
- en: `Privacy Policy — Calmisu` / a one-line English description
- pl / uk: equivalent in that language

Set `canonicalUrl` to the page's own URL so the three language variants don't compete. (Optional but nice: `<link rel="alternate" hreflang>` between the three — mention it in your report if you add it.)

Drop the `useEffect(() => {}, [])` no-op from the old page.

### 3. `src/pages/[lang]/terms-of-service.astro`

Identical pattern against `Terms.{en,pl,ua}.tsx` / `TermsEn`, `TermsPl`, `TermsUa`. Check the actual export names before wiring.

### 4. Delete the shadow HTML

Remove `public/en/privacy-policy/`, `public/pl/privacy-policy/`, `public/uk/privacy-policy/` (each an `index.html` of hand-written, self-contained HTML with its own inline CSS — not Tailwind, not React).

These currently *win* over the SPA on GitHub Pages because real files beat the 404 fallback. Your Astro pages now emit real files at those identical URLs, so the duplicates are pure liability.

**Before deleting:** skim each one and confirm it contains no content that's missing from the React `Privacy.*.tsx` components. If the static HTML has clauses the React version lacks, **stop and report** — don't silently drop legal text.

**Never touch `public/alma/`** — different app, stays untouched.

## Done criteria

- [ ] `npm run build` emits all 6 files: `dist/{en,pl,uk}/privacy-policy/index.html` and `dist/{en,pl,uk}/terms-of-service/index.html`.
- [ ] View-source on each shows the **full policy text** in the initial HTML (this is the whole point — no empty root div).
- [ ] The language switcher navigates correctly: from `/pl/privacy-policy`, clicking UK lands on `/uk/privacy-policy` (path preserved, lang swapped).
- [ ] `LanguageSwitcher.tsx` has no react-router import and its button mode still compiles for task-04's use.
- [ ] Each page has its own `<title>`, description, and canonical URL.
- [ ] `public/en|pl|uk/privacy-policy/` are gone; `public/alma/` is untouched.

## Report back

- Confirm whether the deleted static HTML contained any legal text absent from the React components.
- The exact export names you found in the terms components.
- Whether you added `hreflang` alternates.
