# Technical Specification: UI Component Gallery

- **Functional Specification:** [functional-spec.md](./functional-spec.md) · decisions: [decisions.md](./decisions.md)
- **Status:** Draft (amended 2026-10-01: Button merge, see Change Log)
- **Author(s):** Serhii Kushnir

---

## 1. High-Level Technical Approach

Add one static Astro page, `src/pages/ui-kit.astro` (served at `/ui-kit/`), that mounts a single React island, `UiKitIsland`, with `client:load`. The island renders the **real** components from `src/components/ui`, with no copies and no Storybook. The page uses `BaseLayout` with `noindex`, and the sitemap filter excludes it. The nav link is a `import.meta.env.DEV`-conditional entry in `src/data/navLinks.ts`, so the production build has no link to the page anywhere.

The gallery is data-driven:
- A registry array, `kitGroups`, lists every group: id, title, description, the ui files it covers, and its demo component.
- The island maps the registry into a sidebar and into sections.
- Each demo maps its own state matrix, such as variants × sizes, into labelled example cells.

Existing shared components change in one place only, the **Button merge** (§2.6):
- `ui/button.tsx` keeps just the looks in use: `dark`, `destructive` and `store` styles, `default` (54px, `rounded-xl`) and `pill` sizes. The store style draws the Apple or Google Play icon to the right of the text.
- The two store icons move out of `DownloadButtons.tsx` into their own files.
- `DownloadButtons` becomes a thin composer of two `<Button variant="store">`. It also gets an opt-in prop that turns off analytics. Visitors see no difference.
- The five call sites in quiz, waitlist popup and delete-account move to the new variant names. That is what changes their size, corners and colour.

Nothing else in `src/components/ui` is modified.

No backend, data-model or API changes.

---

## 2. Proposed Solution & Implementation Plan (The "How")

### 2.1 Architecture Changes

| Area | Change |
|---|---|
| Routing | New static route `src/pages/ui-kit.astro` builds `dist/ui-kit/index.html`. `trailingSlash: "always"` already 301s `/ui-kit` to `/ui-kit/`. |
| Hydration | One island, `<UiKitIsland client:load />`. It is SSR-rendered so the markup is real and hydration bugs show up. Its JS ships only to `/ui-kit/`. |
| Head / SEO | `BaseLayout` with `noindex` (emits `noindex, nofollow`, matching `/delete-account/`). The canonical falls back to `Astro.url.href`, which is harmless under noindex. |
| Sitemap | `astro.config.mjs` sitemap `filter` gains `!page.startsWith("https://calmisu.com/ui-kit/")`. The "keep in sync with noindex pages" comment is updated to list `/ui-kit/`. |
| robots.txt | Unchanged. It must **not** disallow `/ui-kit/`, or crawlers would never see the noindex tag. |
| Dev-only nav link | `src/data/navLinks.ts` adds `...(import.meta.env.DEV ? [{ label: "UI Kit", href: "/ui-kit/" }] : [])`. Vite replaces `DEV` with the literal `false` in `astro build`, so the entry is dropped from both Header (.astro) and Footer (rendered statically). In dev the link shows in the header (desktop and mobile drawer) and the footer. |

### 2.2 Data Model / API

None.

### 2.3 Component Breakdown

All new files live in one domain folder, `src/components/ui-kit/`. That folder is page-specific, not part of the shared library. Each file holds one component.

#### Shell

| Item | Tag | Responsibility |
|---|---|---|
| Page | `new: src/pages/ui-kit.astro` | Contains `BaseLayout noindex`, `Header`, `<UiKitIsland client:load />`, `Footer`. Adds no analytics. |
| Island root | `new: ui-kit/UiKitIsland.tsx` | Reads `kitGroups`. Renders `KitSidebar`, then `kitGroups.map(g => <KitSection key={g.id} group={g} />)`. Mounts `<Toaster />` once. There is no existing gallery shell to reuse. |
| Group registry | `new: ui-kit/kitGroups.ts` (data module, not a component) | Holds a `KitGroup[]` of `{ id, title, description, covers: string[], Demo }`. It is the single source for the sidebar, the sections and the completeness test. |
| Sidebar | `new: ui-kit/KitSidebar.tsx` | Renders `kitGroups.map(...)` as `<a href="#<id>">`. From `md` up it is a sticky column. Below `md` it is a `<details>` "Components" menu stacked above the content. Nothing existing renders an in-page TOC. |
| Section | `new: ui-kit/KitSection.tsx` | Renders an anchor `id`, an `<h2>` title, a one-line description and a responsive grid (`grid-cols-1` → `sm:grid-cols-2` → `lg:grid-cols-3`) around `<group.Demo />`. **Not** `reuse: ui/Section.tsx`, because that component carries landing-page gutters (`lg:px-[140px]`) that would crush a column next to the sidebar. |
| Example cell | `new: ui-kit/KitExample.tsx` | Renders a state label (e.g. "Outline · Large · Disabled") above a `min-w-0` content area that wraps its content. Every repeated example in every demo renders through this one item component. |

#### Demos

There is one file per group in `src/components/ui-kit/demos/`. Each one maps a local data array into `KitExample`.

| Group | Tag | Data array → item | Notes |
|---|---|---|---|
| Button | `reuse: src/components/ui/button.tsx` (after the merge, §2.6) | `BUTTON_VARIANTS` (dark, destructive, store) × `BUTTON_SIZES` (default, pill) → `KitExample(Button)`. Then `BUTTON_VARIANTS` → one disabled `Button` each. | Gives 6 matrix cells and 3 disabled cells. Store cells pass `store="ios"` and are labelled "Store (iOS) · …". Three more cells: "Store (Google Play) · Standard" (`store="android"`), "With icon" (`dark` with `CheckIcon` before the text) and "As child (link)" (`dark asChild` around `<a href="#button">`). 12 cells in total. Labels: Dark, Destructive, Store; Standard, Pill. Arrays stay typed from `VariantProps<typeof buttonVariants>`, so a removed variant name fails typecheck. Focus ring and disabled look come from the base class. |
| Badge | `reuse: src/components/ui/badge.tsx` | `BADGE_VARIANTS` (4) → `KitExample(Badge)` | Labels use the prop name, even though `default`/`secondary` look swapped. The gallery shows the components as they are. |
| Text input and label | `reuse: ui/input.tsx`, `reuse: ui/label.tsx` | `INPUT_EXAMPLES` (placeholder, filled, disabled, with-label, file) → `KitExample(Input)` | The with-label example pairs `Label htmlFor` with a unique `id`. File uses `type="file"`. |
| Email field | `reuse: ui/EmailField.tsx` | `EMAIL_EXAMPLES` (empty, filled, error, bordered-on-white, borderless-on-tinted) → `KitExample(EmailFieldExample)` | Each example has its own local `useState` and unique `id`/`errorId`. The error example passes `error` and renders the same `<p role="alert" class="text-destructive-text text-sm">` that PlanGate and NotifyMe use. The tinted example sits on `bg-brand-100`. **Confirmed:** the "error look" is aria-invalid plus the red message, exactly as shipped. No red border is added. |
| Form | `reuse: ui/form.tsx` | `FORM_EXAMPLES` (with-description, with-error) → `KitExample(FormExample)` | `FormLabel`/`FormMessage` need context, so each example owns a `useForm()` + `<Form>` + `<FormField>`. The error example calls `form.setError(...)` once in an effect. That effect is guarded, because Strict Mode runs effects twice. |
| Selectable card and indicators | `reuse: ui/SelectCard.tsx` (`SelectCard`, `CheckBox`, `RadioBtn`) | `SELECT_CARD_EXAMPLES` = align {left, center} × indicator {none, checkbox, radio} × initial {unselected, selected}, plus one left card with `icon` → `KitExample(SelectCardExample)`. Then `INDICATOR_EXAMPLES` (checkbox/radio × checked/unchecked) → `KitExample`. | Gives 12 matrix cards and 1 icon card, each with its own toggle state. `icon` is ignored when `align="center"`, so the icon card is left-aligned only. The icon uses an existing `/public` image. |
| Download buttons | `extend: src/components/ui/DownloadButtons.tsx` (rebuilt on `Button`, §2.6) | `DOWNLOAD_EXAMPLES` (row, col, ios-only, android-only) → `KitExample(DownloadButtons)` | **Extension:** add `trackClicks?: boolean` (default `true`). When it is `false`, neither button calls `track()`. The gallery passes `trackClicks={false}`, `onIosClick={() => {}}` and `location="ui_kit"`. Android stays a real `target="_blank"` link to Google Play. The demo overrides `widthClass` with `w-full max-w-[260px]` so it fits at 375px. |
| FAQ accordion | `reuse: ui/FAQAccordion.tsx` | `SAMPLE_FAQ` (3 `{question, answer}`) → passed as `items` | Its built-in `defaultValue="item-0"` and single-collapsible mode already match the ACs. |
| Dialog | `reuse: ui/dialog.tsx` | — | `Dialog` + `DialogTrigger` ("Open dialog") + `DialogContent` with Header (Title, Description), body and a Footer with two `DialogClose` buttons. Escape, the X button and the overlay click are built in. |
| Toasts | `reuse: ui/sonner.tsx` (`Toaster`, `toast`) | `TOAST_EXAMPLES` (plain, with description, success, error, with action) → `KitExample(Button onClick=fire)` | `toast()` is called only from click handlers. The action toast's button closes it. next-themes falls back to its light default without a provider, so no provider is added. |
| Section and heading | `reuse: ui/Section.tsx` (`Section`, `SectionHeading`) | `HEADING_EXAMPLES` (section, block) → `KitExample(SectionHeading)`. Then `SECTION_EXAMPLES` (default padding, `paddingY="py-6"`) → `KitExample(Section)`. | Each sample section gets a tinted `bg-brand-100` plus an outline so its padding is visible. The section cells span the full grid width (`col-span-full`). |
| Scroll-reveal | `reuse: ui/AnimatedSection.tsx` | — | The example sits inside a fixed-height `overflow-y-auto` box, which becomes the `view()` scroll timeline. The box has a tall spacer above the example and trailing space below it. "Replay" sets `scrollTop = 0`, then scrolls the example into view. It uses `behavior: "auto"` under reduced motion and `"smooth"` otherwise. A `CSS.supports("animation-timeline: view()")` check runs in an effect (not in render, to stay hydration-safe). When it fails, a short note says the browser has no scroll-driven animations. |
| Icons | `reuse: ui/icons.tsx` (`CheckIcon`), `reuse: ui/AppleIcon.tsx`, `reuse: ui/PlayStoreIcon.tsx` (moved out of DownloadButtons, §2.6) | `ICON_EXAMPLES` (3) → `KitExample` | `covers: ["icons", "AppleIcon", "PlayStoreIcon"]`. |
| Flags | `reuse: ui/flags/*.tsx` | `FLAG_EXAMPLES` (4 languages) × `FLAG_SIZES` (`[16, 32, 48]` px) → `KitExample(Flag)` | Gives 12 labelled cells. |

**Not covered by a demo:** `AnimatedSection.astro` and `Section.astro`. They are build-time Astro twins of the React components shown above and render the same classes. The completeness test lists them as covered by the React group.

### 2.4 Keeping the gallery complete (§2.4)

`kitGroups[].covers` lists ui file basenames, e.g. `"button"` or `"flags/UkFlagIcon"`. The consolidated test globs `src/components/ui/**/*.{tsx,astro}` and fails when any file is missing from the union of `covers`. Adding a new ui file without a gallery entry therefore turns the test suite red. Adding a new *variant* to an existing file isn't caught automatically. The Button and Badge arrays are typed from `VariantProps`, so a removed or renamed variant fails typecheck, but a newly added one is not detected.

### 2.5 Files

| Path | Status |
|---|---|
| `src/pages/ui-kit.astro` | new |
| `src/components/ui-kit/UiKitIsland.tsx`, `KitSidebar.tsx`, `KitSection.tsx`, `KitExample.tsx` | new |
| `src/components/ui-kit/kitGroups.ts` | new (data) |
| `src/components/ui-kit/demos/{Button,Badge,Input,EmailField,Form,SelectCard,DownloadButtons,Faq,Dialog,Toast,Section,AnimatedSection,Icons,Flags}Demo.tsx` | new (14) |
| `src/components/ui-kit/demos/{EmailFieldExample,FormExample,SelectCardExample}.tsx` | new: stateful single-example components rendered by `.map()` |
| `src/components/ui/button.tsx` | modified: variants `dark`/`destructive`/`store`, sizes `default`/`pill`, `store` prop, `Slottable` (§2.6) |
| `src/components/ui/AppleIcon.tsx`, `src/components/ui/PlayStoreIcon.tsx` | new: moved verbatim out of `DownloadButtons.tsx` |
| `src/components/ui/DownloadButtons.tsx` | modified: thin composer over `Button variant="store"`, `trackClicks` prop, icons removed |
| `src/components/quiz/QuizIsland.tsx`, `PlanGate.tsx`, `QuizResultIsland.tsx`, `src/components/popups/NotifyMe.tsx`, `src/components/account/DeleteAccountIsland.tsx` | modified: variant/size names only (§2.6 call-site table) |
| `src/components/landing/QuizPromo.astro` | modified: "Start now" link uses `buttonVariants({ variant: "dark" })` classes |
| `src/data/navLinks.ts` | modified: DEV-only entry |
| `astro.config.mjs` | modified: sitemap filter and its comment |
| `context/components-index.md` | regenerated (`node .awos-tune/scripts/component-index.mjs`) |

### 2.6 Button merge

**Target `buttonVariants` (cva) contract:**

| Part | Classes / behaviour | Source |
|---|---|---|
| Base | Kept as today: `inline-flex items-center justify-center gap-2 whitespace-nowrap`, focus ring, `disabled:pointer-events-none disabled:opacity-50`, svg `pointer-events-none shrink-0`. Typography moves here: `font-body font-normal touch-manipulation`. `rounded-md`, `text-sm font-medium` and the default svg `size-4` move out of the base. | today's base + DownloadButtons |
| `variant: dark` | `bg-foreground text-background` + `cta-btn` (lift and shine hover, already reduced-motion-safe in `index.css`). Replaces `black`. | DownloadButtons look |
| `variant: destructive` | `bg-destructive text-destructive-foreground hover:bg-destructive/90` | unchanged |
| `variant: store` | Same classes as `dark`, plus `[&_svg]:size-6`. Exists so the gallery and the code name the store look. | DownloadButtons look |
| `size: default` | `h-[54px] px-6 rounded-xl text-base sm:text-lg leading-[150%]`, svg `size-4` (except under `store`) | DownloadButtons look; replaces `xl` and the old default |
| `size: pill` | `h-auto rounded-full px-4 py-2 text-sm` | unchanged |
| Removed | variants `default`, `outline`, `secondary`, `ghost`, `link`, `black`; sizes `sm`, `lg`, `icon`, `xl` | — |
| Defaults | `variant: "dark"`, `size: "default"` | — |

**`ButtonProps` additions:**
- `store?: "ios" | "android"`. When set, it renders `AppleIcon` (in a `mb-1` wrapper, as today) or `PlayStoreIcon` **after** the children.
- With `asChild`, the children are wrapped in Radix `Slottable` so the icon still lands *inside* the child `<a>`. See the Radix Slot docs on `Slottable`.
- `buttonVariants` stays exported (the gallery types its arrays from it).

**`DownloadButtons` after the merge.** The props are the same as today, plus `trackClicks`. Layout container classes are unchanged.
- iOS renders `<Button variant="store" store="ios" className={widthClass} onClick={track + onIosClick}>Join iOS Waitlist</Button>`.
- Android renders `<Button asChild variant="store" store="android" className={widthClass}><a href={PLAY_URL} target="_blank" rel="noopener noreferrer" onClick={track}>Download for Android</a></Button>`.
- The duplicated class string goes away (component-structure rule 3).
- Visible output must stay pixel-equal to today: height, `rounded-xl`, colours, `text-base sm:text-lg`, 24px icons, shine hover. The only additions are the shared focus ring and disabled styles.

**Call sites:**

| File | Today | After | Visible change |
|---|---|---|---|
| `quiz/QuizIsland.tsx` (start, multi-select continue) | `variant="black" size="xl"` | `variant="dark"` | `rounded-2xl`/py-4 → 54px `rounded-xl`; black → `foreground` navy; shine hover |
| `quiz/PlanGate.tsx` (Send my plan) | `black xl` | `dark` | same |
| `quiz/QuizResultIsland.tsx` (2× asChild links) | `black xl` | `dark` | same |
| `quiz/QuizResultIsland.tsx` (7-day "Start") | `black pill` | `dark pill` | colour → navy only |
| `popups/NotifyMe.tsx` (Notify Me) | `black xl` | `dark` | 54px `rounded-xl`, navy |
| `account/DeleteAccountIsland.tsx` | `destructive` (default size, h-10 `rounded-md`) | `destructive` | 40px → 54px, `rounded-xl`, body font at `text-base sm:text-lg` |
| `landing/QuizPromo.astro` ("Start now" link) | hand-written `bg-black rounded-2xl px-8 py-4 text-lg cta-btn` | `class={cn(buttonVariants({ variant: "dark" }), "mt-4 min-w-[200px] no-underline focus-visible:ring-white focus-visible:ring-offset-brand-dark")}` | 54px `rounded-xl`, navy. The white focus ring is kept for the dark section. |
| `ui-kit/demos/ButtonDemo.tsx` | 7 × 6 matrix | 3 × 2 matrix (§2.3) | gallery only |

`QuizPromo.astro` is static Astro, so it calls the `buttonVariants()` class function in its frontmatter instead of mounting a React `Button`. This runs at build time and ships no JS. It is a fourth visible change, beyond the three the functional spec lists, confirmed in decisions.md.

---

## 3. Impact and Risk Analysis

### System Dependencies

- `DownloadButtons` is used by `HeroCTA` and `CTASection`. Its props don't change and the new prop defaults to tracking, so those call sites stay as they are. Its markup is now produced by `Button`, which reaches every page that shows download buttons.
- `Button` is used by quiz (3 files), NotifyMe and DeleteAccountIsland. Each of them changes look on purpose (§2.6).
- `navLinks.ts` feeds Header and Footer on every page. Dev builds gain one link; production output is unchanged.
- Shared vendor chunks for React, Radix and sonner may get split differently once a new island imports them.

### Risks & Mitigations

| Risk | Mitigation |
|---|---|
| The gallery leaks into production navigation or sitemap. | `import.meta.env.DEV` is statically replaced. The build test asserts that no dist HTML other than the page links to it, and that both sitemaps omit it. |
| Analytics fire from gallery clicks once a visitor has accepted cookies. | `trackClicks={false}` on every gallery `DownloadButtons`. No other kit component calls `track()`. A jsdom test asserts the mocked `track` is never called. |
| Horizontal scroll at 375px. Likely sources: `whitespace-nowrap` xl/pill buttons, `DownloadButtons` fixed width, wide dialog. | Grid is `grid-cols-1` on phones, cells are `min-w-0`, and button cells use `flex-wrap`. The `widthClass` override covers DownloadButtons. Check manually that `document.documentElement.scrollWidth <= innerWidth` at 375px. |
| Hydration mismatches. | No `Date`, random or `window` reads in render. Feature detection lives in effects. Every `id`/`errorId` is unique. Demos are imported inside the island, never passed as props from `.astro`. |
| Scroll-reveal ACs can't be shown in browsers without `animation-timeline: view()`, e.g. current Firefox. | Content stays visible, and an inline note explains why. ACs are verified in Chromium. |
| Bundle impact on other pages. | The island is page-scoped. Compare `_astro/` chunk sizes for `/` and `/quiz/` before and after the build. |
| Download buttons drift from today's look after the rebuild (16px icons from a leftover svg rule, `rounded-md` leaking from the base, lost shine). | The `store` variant sets `[&_svg]:size-6`, and radius lives only in sizes. A test asserts that the iOS and Android elements carry `h-[54px]`, `rounded-xl`, `bg-foreground` and `cta-btn` and contain an svg. Manual side-by-side check against `main`. |
| A missed `variant="black"`/`size="xl"` call site. | Removing the keys from cva makes every leftover use a TypeScript error. Typecheck gates each slice. |
| The `cta-btn` lift and shine now also apply inside the quiz and the NotifyMe dialog. | `.cta-btn` sets `overflow: hidden`, which is harmless for text-only buttons, and is already reduced-motion-safe. Confirm in the manual quiz walk-through. |
| `asChild` + `store` breaks, because Slot needs exactly one child. | `Slottable` wraps the children (Radix's documented pattern). Covered by the Android-link test. |
| The gallery drifts from the library. | The completeness test (§2.4). CLAUDE.md / component-structure rule: a ui change adds its gallery entry in the same PR. |

---

## 4. Testing Strategy

There are two consolidated test files, one per feature area. Each covers several acceptance criteria. No per-task tests.

1. **`src/test/uiKit.acceptance.test.tsx`** (jsdom, mocks `@/lib/analytics` `track`):
   - **Groups and nav:** the sidebar lists every `kitGroups` title, each `href="#id"` matches a section id, and every group's section renders.
   - **Button:** 12 labelled cells (6 matrix, 3 disabled, Google Play store, with-icon, as-child). No label names a removed style or size. Both store cells have an svg *after* the text. Clicking a disabled button calls no handler.
   - **Buttons on real pages:** default `DownloadButtons` renders "Join iOS Waitlist" (`<button>`) and "Download for Android" (`<a target="_blank" href=PLAY_URL>`) with `h-[54px] rounded-xl bg-foreground cta-btn`. Clicking calls `track("cta_click", { platform, location })`, and with `trackClicks={false}` it never does. A plain `<Button>` and `<Button variant="destructive">` carry `h-[54px] rounded-xl`; `size="pill"` carries `rounded-full`.
   - **Inputs:** clicking the with-label `Label` focuses its input, and the disabled input is `disabled`. Typing into an email example updates its value. The error example has `aria-invalid` and a visible message.
   - **SelectCard:** clicking toggles the selected state on and off. All 12 matrix examples, the icon card and the 4 indicator examples are present.
   - **Download buttons:** iOS click renders no dialog. Android is an `<a target="_blank">` to Google Play. `track` is never called.
   - **FAQ:** the first item is open; opening another closes it; clicking the open one closes all.
   - **Dialog:** "Open dialog" shows the title, description and footer; Escape closes it.
   - **Toasts:** each trigger renders its toast text; the action button dismisses its toast.
   - **Icons and flags:** 3 icons and 12 flag cells are labelled.
   - **Completeness:** every file under `src/components/ui/**` appears in the union of `kitGroups[].covers`.
2. **`src/test/uiKit.build.acceptance.test.ts`** (reads `dist/`, skipped when it is absent, same pattern as `quiz.build.acceptance.test.ts`):
   - `dist/ui-kit/index.html` exists and contains `content="noindex, nofollow"`.
   - Neither `sitemap-0.xml` nor `sitemap-index.xml` contains `ui-kit`.
   - No other `dist/**/*.html` contains `href="/ui-kit/"`, `href="/ui-kit"` or `https://calmisu.com/ui-kit`.
   - `robots.txt` does not disallow `/ui-kit`.

**Manual only (see MANUAL checks in tasks):**
- Visual parity with the homepage and quiz.
- Homepage download buttons look and hover exactly as on `main`. The homepage quiz promo "Start now" link is 54px, `rounded-xl` and shows the white focus ring on Tab.
- Quiz walk-through (start, multi-select continue, plan gate, results, 7-day "Start"), the NotifyMe popup and the delete-account page show the new 54px buttons.
- Focus ring on Tab.
- Scroll-reveal animation and Replay, including the reduced-motion OS setting.
- The 375px no-overflow check.
- The dev nav link visible under `npm run dev`.

---

## Change Log

- **2026-10-01: Button merge** (follows the functional-spec amendment of the same date).
  - Added §2.6: target `buttonVariants` contract, `store` prop, `DownloadButtons` as a thin composer, icons in their own files, call-site table.
  - Homepage `QuizPromo.astro` "Start now" link joins the merge through `buttonVariants()` classes.
  - Button demo shrinks from 42 + 7 cells to 12. The Icons demo imports the new icon files.
  - New risks: download-button parity, missed call sites, `cta-btn` spreading, `asChild` + icon.
  - Tests gained a "Buttons on real pages" block.
