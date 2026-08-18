# Prompt 1 — Run Wave 2 (task-06)

Paste this as the first message of a fresh chat in the `calmisu_landing` repo.

---

Run **Wave 2** of the Astro migration.

Read `content/spec/PROGRESS.md` first — it has the current state, the Wave 1 verification
results, and a list of items discovered during Wave 1 that are **not** in the task file yet.
Then read `content/spec/00-conventions.md` and `content/spec/task-06-integration.md`.

Delegate the work to the **`astro-architect`** agent. Run it **alone** — no parallel agents;
Wave 2 does destructive cleanup across the whole tree.

## State you're starting from

- Branch `migrate-to-the-astro`, base commit `452c654`.
- **Wave 1 is in the working tree, uncommitted.** That's intentional. Do not stash or reset it.
- The build is currently green: 12 pages, `tsc --noEmit` clean.

## Scope

Everything in `task-06-integration.md` (steps 1–7), **plus** these four items found during
Wave 1. They are required, not optional:

1. **Build-breaking if missed.** `src/data/deletAccount.ts:1` still does
   `import { Lang } from "@/pages/DeleteAccountPage"`. Task-06 deletes that file. Repoint the
   import to `@/components/DeleteAccountIsland` **in the same change as the deletion**.
2. **`BaseLayout.astro` has no head slot.** Add a named `head` slot or an
   `extraMeta?: {property,content}[]` prop, then wire up the three things Wave 1 had to defer:
   - `article:published_time` / `article:modified_time` on articles (task-05)
   - `hreflang` alternates across the 6 localized legal pages (task-03)
   - `<meta name="robots" content="noindex">` on `/delete-account/` (task-04)
   Also add a **sitemap `filter`** excluding `/delete-account/` — it's currently in
   `sitemap-0.xml`, which contradicts the `noindex`.
3. **Register `@tailwindcss/typography`** in `tailwind.config.ts` `plugins` (it's a
   devDependency but was never registered). Articles currently use a hand-written
   `.article-prose` block; replacing it with the `prose` scale afterwards is optional — say
   which you did.
4. **Correct `00-conventions.md`**: it calls `FAQSection.tsx` a "Radix Accordion". It's a plain
   `useState` expand/collapse, no Radix import.

## Rules

- **Do not commit or stage anything.** Leave it in the working tree for review.
- Do not prune the unused shadcn primitives or heavy deps (`recharts`, `embla-carousel-react`,
  `cmdk`, `vaul`, `input-otp`, `next-themes`, `react-day-picker`) — deliberately a separate PR.
- Do not invent copy or translations. If content seems missing, report it instead.
- `npm test` must actually pass, not just build.
- Do step 8 (post-deploy checklist) as a **hand-off to the user** — don't perform it.

## Report back

The full `dist/` listing, confirmation `dist/CNAME` and `dist/alma/` are intact, anything from
Wave 1 still unresolved, and the post-deploy checklist surfaced as the next step.
Then update `content/spec/PROGRESS.md` to reflect Wave 2's outcome.
