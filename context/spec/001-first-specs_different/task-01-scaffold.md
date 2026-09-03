# Task 01 — Astro scaffold & Vite entrypoint removal

**Wave:** 0 (blocking — Wave 1 cannot start until this lands)
**Agent:** `astro-architect`
**Repo:** `c:\Users\serg9\Documents\GitHub\calmisu_landing`

> Read `content/spec/00-conventions.md` first. It has the verified repo facts and the `BaseLayout` contract you're implementing.

## Goal

Replace the Vite + React SPA toolchain with Astro, and create the shared `BaseLayout.astro` that every other task builds on. At the end of this task the project builds with `astro build` and serves a working shell — even though no page content has been ported yet.

This is the foundation task: four parallel agents start the moment it's done, and they all import `BaseLayout`.

## Files you own

**Create:** `astro.config.mjs`, `src/layouts/BaseLayout.astro`, `src/env.d.ts`
**Modify:** `package.json`, `tailwind.config.ts`, `tsconfig.json` (+ `tsconfig.app.json` / `tsconfig.node.json` as needed)
**Delete:** `index.html`, `vite.config.ts`, `src/main.tsx`, `src/vite-env.d.ts`

Do **not** touch anything else. In particular leave `src/App.tsx`, `src/pages/*.tsx`, `src/index.css`, and every component alone — later tasks own those.

## Steps

### 1. Dependencies

Add: `astro`, `@astrojs/react`, `@astrojs/tailwind`, `@astrojs/sitemap`.
Remove: `vite`, `@vitejs/plugin-react-swc`, `lovable-tagger`.

Keep `react`, `react-dom`, `tailwindcss`, `tailwindcss-animate`, `@tailwindcss/typography`, `vite-plugin-svgr`, and all Radix/form/query deps — they're still used.

Leave `react-router-dom` installed for now; task-06 removes it once the last consumer is gone.

Scripts become:
```json
"dev": "astro dev",
"build": "astro build",
"preview": "astro preview"
```
Drop `build:dev` (Vite-mode-specific, no Astro equivalent needed).

### 2. `astro.config.mjs`

```js
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  site: "https://calmisu.com",
  integrations: [react(), tailwind(), sitemap()],
  vite: {
    plugins: [svgr()],
    resolve: { alias: { "@": "/src" } },
  },
});
```

Two things this must preserve from the old `vite.config.ts`:
- the `@` → `src` alias (used by nearly every import in the codebase)
- `vite-plugin-svgr`, because `src/components/Footer.tsx` does `import CalmisuLogo from "@/assets/calmisu.svg?react"`. **Verify this specific import still resolves** — it's the only svgr usage and the easiest thing to silently break.

`site:` is required for `@astrojs/sitemap` to emit absolute URLs.

The old config also had a dev-only `servePublicHtmlPages()` plugin that hand-served `public/{en,pl,uk,delete-account,alma}` static HTML before the SPA fallback. **Do not port it.** It existed to paper over the SPA's dev/prod routing mismatch; Astro emits real routes so it's obsolete. (`public/alma/**` still works — Astro serves `public/` as static passthrough natively.)

### 3. `src/layouts/BaseLayout.astro`

Implement the contract in `00-conventions.md` — props `title`, `description`, `ogImage?`, `canonicalUrl?`, `ogType?`.

Port the `<head>` from the current `index.html` verbatim in content, but parameterised:

```html
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>{title}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonicalUrl ?? Astro.url.href} />

<meta property="og:type" content={ogType} />
<meta property="og:url" content={canonicalUrl ?? Astro.url.href} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={absoluteOgImage} />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={absoluteOgImage} />

<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

Notes:
- Resolve `ogImage` to an **absolute** URL (`new URL(ogImage, Astro.site)`) — social crawlers reject relative paths. Default `/images/calmisuog.png`.
- Import `src/index.css` in the frontmatter (`import "@/index.css";`). This replaces the import that lived in the now-deleted `src/main.tsx`.
- `<html lang="en">`, `<body>` wrapping `<slot />`.
- **Do not** port the inline `<script>` from `index.html`'s head — that's the SPA 404-redirect decoder, dead under Astro.

### 4. `tailwind.config.ts`

Only change the `content` glob so Astro/markdown files are scanned:
```ts
content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}"]
```
Everything else — the HSL CSS-var colors, `fontFamily` (Orienta/Roboto), border radii, `tailwindcss-animate` — stays exactly as-is.

### 5. TypeScript

- Create `src/env.d.ts` with `/// <reference types="astro/client" />`.
- Delete `src/vite-env.d.ts`.
- Update `tsconfig.json` to extend `astro/tsconfigs/strict` (or `/base` if strict causes noise in the existing components), keeping the `@/*` → `src/*` path mapping so editor + type-check keep working.
- The existing `tsconfig.app.json` / `tsconfig.node.json` split is a Vite convention — collapse it into a single `tsconfig.json` if that's cleaner, but don't break the path alias.

### 6. Delete the Vite entrypoint

`index.html`, `vite.config.ts`, `src/main.tsx`, `src/vite-env.d.ts`.

`src/App.tsx` and `src/pages/*.tsx` will now be unreferenced but **must stay** — task-06 deletes them after the Astro routes exist.

## Done criteria

- [ ] `npm install` succeeds.
- [ ] `npm run dev` starts Astro's dev server without errors.
- [ ] A throwaway smoke page (e.g. a temporary `src/pages/index.astro` rendering `<BaseLayout>` with a heading) builds and shows correct `<head>` tags in view-source. **Delete the throwaway before finishing** — task-02 owns the real `src/pages/index.astro`.
- [ ] `npm run build` produces `dist/` with the `public/` passthrough intact, including `dist/alma/`, `dist/CNAME`, `dist/.nojekyll`.
- [ ] Tailwind classes apply (verify a `bg-background` or `font-display` renders styled, proving the CSS-var theme + font config survived).
- [ ] `import CalmisuLogo from "@/assets/calmisu.svg?react"` resolves — test by temporarily importing `Footer.tsx` into your smoke page, then reverting.
- [ ] TypeScript: `npx tsc --noEmit` (or `astro check`) reports no *new* errors beyond pre-existing ones in the soon-to-be-deleted `src/pages/*.tsx` and `src/App.tsx`.

## Report back

- Confirm the svgr `?react` import works (this is the highest-risk item).
- Note any `tsconfig` strictness fallout that later tasks should expect.
- List the exact `package.json` diff so task-06 knows the final dependency state.
