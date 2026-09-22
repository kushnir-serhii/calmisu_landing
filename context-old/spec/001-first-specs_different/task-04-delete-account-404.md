# Task 04 — Delete-account island, providers, and the real 404

**Wave:** 1 (parallel with tasks 02, 03, 05)
**Agent:** `react-islands`
**Repo:** `c:\Users\serg9\Documents\GitHub\calmisu_landing`
**Depends on:** task-01 (`BaseLayout.astro` must exist)

> Read `content/spec/00-conventions.md` first — especially the `api.ts` circular-import trap and the LanguageSwitcher contract.

## Goal

Three things:
1. Port the delete-account form to a single self-contained island, with its providers scoped locally instead of app-global.
2. Create a real `404.astro`, which lets the GitHub Pages SPA-redirect hack die.
3. Fix the `src/lib/api.ts` type import that currently points at a page being deleted.

## Files you own

**Create:** `src/components/DeleteAccountIsland.tsx`, `src/pages/delete-account.astro`, `src/pages/404.astro`
**Modify:** `src/lib/api.ts`
**Delete:** `public/delete-account/`, `public/404.html`
**Read-only:** `src/data/deletAccount.ts` (note the typo'd filename — it's real), `src/components/ui/*`, `Header.tsx`, `Footer.tsx`
**Do not delete** `src/pages/DeleteAccountPage.tsx` or `src/App.tsx` — task-06 does that.

`src/components/ui/LanguageSwitcher.tsx` is owned by **task-03**, running in parallel. Do not edit it. You use its **button mode** (`onLangChange`), which task-03 is contractually leaving unchanged.

## Steps

### 1. `src/components/DeleteAccountIsland.tsx`

Port the body of `src/pages/DeleteAccountPage.tsx` essentially as-is. It's a react-hook-form + zod form with a TanStack Query mutation, an i18n dict from `@/data/deletAccount`, a password show/hide toggle, and a success state.

Two structural changes:

**a) Move the schema and types here.** `DeleteAccountPage.tsx` currently exports:
```ts
export type Lang = "en" | "pl" | "uk";
export type FormValues = z.infer<typeof schema>;
const schema = z.object({ email: ..., password: ... });
```
These must live in this file now, since the page is being deleted. Export `FormValues` (and `Lang`) from here.

**b) Scope the providers locally.** `src/App.tsx` wrapped the whole SPA in `QueryClientProvider` + `Toaster` + `Sonner` + `TooltipProvider`. Astro has no root app component, so this island owns what it needs:

```tsx
const queryClient = new QueryClient();   // module scope, created once

export default function DeleteAccountIsland() {
  return (
    <QueryClientProvider client={queryClient}>
      <DeleteAccountForm />
      <Sonner />
    </QueryClientProvider>
  );
}
```

- `Sonner` is required — the mutation's `onError` calls `toast.error(...)` from `sonner`.
- `Toaster` (the shadcn one from `@/components/ui/toaster`) appears unused by this form; include it only if something actually calls `useToast`. Check before adding.
- **Do not** add `TooltipProvider` — verified unused across the whole codebase.

Keep the language switching exactly as-is: local `useState<Lang>("en")` driving `<LanguageSwitcher lang={lang} onLangChange={...} />`. This page's switcher is deliberately **not** URL-based, unlike privacy/terms — one route, client-side language toggle. Don't "fix" this into `[lang]` routes.

### 2. Fix `src/lib/api.ts`

Currently line 1:
```ts
import { FormValues } from "@/pages/DeleteAccountPage";   // ← page is being deleted
```
Repoint to `@/components/DeleteAccountIsland`.

While you're in this file, do the env rename (you own it; task-06 does the other one):
```ts
export const API_BASE_URL = import.meta.env.PUBLIC_API_BASE_URL ?? "";
```
Leave the `fetch` to `${API_BASE_URL}/auth/delete-account-web` and the error handling untouched.

### 3. `src/pages/delete-account.astro`

`BaseLayout` + the island with `client:load` (the whole page is a form — it's useless unhydrated).

Meta: give it a real title/description, e.g. `Delete Your Calmisu Account`. Consider `<meta name="robots" content="noindex">` — it's a utility page, not a marketing page; use your judgement and note the choice in your report.

Keep the outer layout from the old page: `flex flex-col px-2 lg:px-36`, switcher in a `ml-auto mt-10` row.

### 4. `src/pages/404.astro`

A real 404 page — `Header` + a short "page not found" message + a link home + `Footer`. Reuse the existing components (read-only; `Header` needs `client:load` for its mobile menu, `Footer` needs no directive).

Look at `src/pages/NotFound.tsx` for the current copy, but it's a bare placeholder — improving it is fine.

Astro builds `src/pages/404.astro` → `dist/404.html`, which **GitHub Pages serves natively** on any unmatched path.

### 5. Delete the SPA-fallback hack

- `public/404.html` — the redirect trick that encodes the path into a `?/` query string.
- `public/delete-account/` — hand-written static HTML shadowing the SPA route; your `delete-account.astro` now emits a real file at that same URL.

The matching decoder `<script>` in `index.html`'s `<head>` is already gone — task-01 deleted `index.html`.

**Before deleting `public/delete-account/index.html`:** skim it and confirm it holds no content missing from the React version. If it does, **stop and report** rather than dropping it.

**Never touch `public/alma/`.**

## Done criteria

- [ ] `npm run build` emits `dist/delete-account/index.html` and `dist/404.html`.
- [ ] The form renders, validates (bad email → zod error, short password → error), and fires the POST on submit. With a fake `PUBLIC_API_BASE_URL` the request fails — confirm the **error toast appears**, which proves the scoped `Sonner` + `QueryClientProvider` wiring works.
- [ ] Language buttons switch the form copy through all three languages.
- [ ] Password show/hide toggle works.
- [ ] `src/lib/api.ts` no longer imports from `@/pages/*` and uses `PUBLIC_API_BASE_URL`.
- [ ] `npx tsc --noEmit` shows no new errors from the moved `FormValues` / `Lang` types.
- [ ] `public/404.html` and `public/delete-account/` are gone; `public/alma/` untouched.

## Report back

- Whether `Toaster` (shadcn) turned out to be needed alongside `Sonner`.
- Your `noindex` decision for `/delete-account`.
- Whether the deleted static HTML had content the React version lacks.
