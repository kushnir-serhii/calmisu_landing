# Task 02 — Landing page (`/`) parity

**Wave:** 1 (parallel with tasks 03, 04, 05)
**Agent:** `react-islands` (delegate visual-parity checks to `tailwind-stylist`)
**Repo:** `c:\Users\serg9\Documents\GitHub\calmisu_landing`
**Depends on:** task-01 (`BaseLayout.astro` must exist)

> Read `content/spec/00-conventions.md` first — especially the island directive rules and the landing-page composition facts.

## Goal

Recreate the landing page as `src/pages/index.astro`, mounting the eight existing marketing components as Astro islands. Visual and behavioural parity with today's `src/pages/Index.tsx` is the bar. The win is that static sections now ship **zero JavaScript**.

## Files you own

**Create:** `src/pages/index.astro`, `src/components/AnimatedSection.tsx`
**Read-only (do NOT edit):** `Header.tsx`, `HeroSection.tsx`, `FeaturesFlow.tsx`, `FeaturesScience.tsx`, `ChatSection.tsx`, `FAQSection.tsx`, `CTASection.tsx`, `Footer.tsx`, `popups/NotifyMe.tsx`, `src/hooks/use-scroll-animation.tsx`, `src/index.css`
**Do not delete** `src/pages/Index.tsx` — task-06 does that.

The landing components need **no modification** — they have zero react-router coupling (verified: `Header.tsx` uses plain `<a>` tags). If you think one needs editing, stop and report instead.

## Steps

### 1. Extract `AnimatedSection` into its own file

It's currently defined inline at the top of `src/pages/Index.tsx` (lines 12–34). `Index.tsx` is being deleted, so move it to `src/components/AnimatedSection.tsx` **verbatim** — same props (`children`, `className = ""`, `delay = 0`), same `useScrollAnimation()` hook usage, same class strings:

```
w-full transition-all duration-700 ease-out
isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
style={{ transitionDelay: isVisible ? `${delay}ms` : '0ms' }}
```

Add `export default`. Don't "improve" the animation.

### 2. Build `src/pages/index.astro`

Use `BaseLayout` with the site's real meta (these are the current production values — don't invent new copy):

```
title:       Calmisu — Calm Your Anxiety
description: Ease anxiety with guided breathing, calming sounds, and grounding techniques. Free to download.
```

Reproduce the exact structure and order from `Index.tsx`, preserving the root wrapper class `flex flex-col items-center w-full bg-background overflow-hidden`:

| Component | Wrapper | Directive |
|---|---|---|
| `Header` | — | `client:load` |
| `HeroSection` | — | `client:load` |
| `FeaturesFlow` | `AnimatedSection delay={100}` | wrapper `client:visible` |
| `FeaturesScience` | `AnimatedSection delay={150}` | wrapper `client:visible` |
| ~~`ReviewsSection`~~ | — | **stays omitted/commented — do not re-enable** |
| `ChatSection` | `AnimatedSection delay={250}` | wrapper `client:visible` |
| `FAQSection` | `AnimatedSection delay={300}` | wrapper `client:visible` |
| `CTASection` | `AnimatedSection delay={350}` | wrapper `client:visible` |
| `Footer` | `AnimatedSection delay={400}` | wrapper `client:visible` |

### 3. Handle the island-nesting problem

This is the one genuinely tricky part. In React, `<AnimatedSection><FAQSection /></AnimatedSection>` is one tree. In Astro, an island's children passed from `.astro` become **slotted static HTML**, which breaks React components that need their own hydration inside a hydrated parent.

Pick whichever approach gives true parity, and say which you chose and why:

- **Option A (recommended):** make each section its own small `.tsx` wrapper composing `AnimatedSection` + the section (e.g. `<AnimatedFaq />`), and mount that single component with `client:visible`. One island per section, React tree intact, interactivity preserved.
- **Option B:** mount `AnimatedSection` with `client:visible` and pass the section via Astro slot — only valid for sections that are genuinely static (`FeaturesFlow`, `FeaturesScience`, `Footer`). **Not** valid for `ChatSection`, `FAQSection`, `CTASection`, which need their own JS.

Do not ship a version where the FAQ accordion, the CTA's NotifyMe modal, or the ChatSection parallax silently stop working — that's the failure mode this step exists to prevent.

### 4. Verify parity

Run `npm run dev` and check every interactive behaviour:

- [ ] Mobile hamburger opens/closes; body-scroll lock still works
- [ ] Hero "notify me" modal opens, submits, closes (network call will fail without real env vars — that's fine, confirm it *fires*)
- [ ] CTA section's separate NotifyMe modal works independently
- [ ] FAQ accordion expands/collapses
- [ ] ChatSection parallax responds to scroll
- [ ] Every `AnimatedSection` still fades/slides in on scroll, with staggered delays
- [ ] Footer logo (svgr SVG) renders
- [ ] Anchor nav (`#features`, `#faq` from `src/data/navLinks.ts`) scrolls correctly

## Done criteria

- [ ] `npm run build` succeeds; `dist/index.html` contains real rendered markup for the static sections (view-source shows headings/copy, **not** an empty `<div id="root">`).
- [ ] All 8 interactive behaviours above verified in the dev server.
- [ ] `FeaturesFlow` / `FeaturesScience` / `Footer` markup is present in the built HTML.
- [ ] No landing component file was modified.
- [ ] `ReviewsSection` is still not rendered.

## Report back

- Which nesting approach (A or B) you used, per section.
- Any component that turned out to need edits (and why) — you should not have edited it; report instead.
- Rough sense of whether JS payload dropped vs the old SPA bundle, if easy to eyeball.
