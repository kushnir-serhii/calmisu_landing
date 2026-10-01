# Technical Specification: UI Component Gallery

- **Functional Specification:** [functional-spec.md](./functional-spec.md) · decisions: [decisions.md](./decisions.md)
- **Status:** Draft (amended 2026-10-01: Button, Input and Badge merges; DownloadButtons, Section/Scroll-reveal groups and toasts removed, see Change Log)
- **Author(s):** Serhii Kushnir

---

## 1. High-Level Technical Approach

Add one static Astro page, `src/pages/ui-kit.astro` (served at `/ui-kit/`), that mounts a single React island, `UiKitIsland`, with `client:load`. The island renders the **real** components from `src/components/ui`, with no copies and no Storybook. The page uses `BaseLayout` with `noindex`, and the sitemap filter excludes it. The nav link is a `import.meta.env.DEV`-conditional entry in `src/data/navLinks.ts`, so the production build has no link to the page anywhere.

The gallery is data-driven:
- A registry array, `kitGroups`, lists every group: id, title, description, the ui files it covers, and its demo component.
- The island maps the registry into a sidebar and into sections.
- Each demo maps its own state matrix, such as variants × sizes, into labelled example cells.

Existing shared components change in three places, the **merges**:

- **Button merge** (§2.6):
  - `ui/button.tsx` keeps just the looks in use: `dark`, `destructive` and `store` styles, `default` (54px, `rounded-xl`) and `pill` sizes. The store style draws the Apple or Google Play icon to the right of the text.
  - The two store icons move out of `DownloadButtons.tsx` into their own files.
  - `ui/DownloadButtons.tsx` is **deleted** (§2.9). HeroCTA, CTASection and a new small blog island render `<Button variant="store">` directly, each with its own layout classes, `track()` call and `PLAY_URL` link. Visitors see no difference.
  - The five call sites in quiz, waitlist popup and delete-account move to the new variant names. That is what changes their size, corners and colour.
- **Input merge** (§2.7):
  - `ui/input.tsx` becomes the only typed field. It loses its file-picker classes and gains an `error` prop.
  - Any `aria-invalid="true"`, whether from `error` or from `FormControl`, draws a red border.
  - With `type="email"`, it defaults the email attributes that `EmailField` used to hard-code.
  - `ui/EmailField.tsx` is deleted. PlanGate and NotifyMe render `<Input type="email">` with an sr-only label.
- **Badge merge** (§2.8):
  - `ui/badge.tsx` drops `variant` and gets `size: sm | md | lg` instead.
  - It has one fill (`bg-brand-100`) and one text colour (`text-brand-dark`), renders a `<span>` with arbitrary children, and exports `badgeVariants`.
  - React callers use `<Badge>`. Astro callers put `badgeVariants()` classes on a `<span>` (same pattern as `buttonVariants` in QuizPromo). `TagPill.astro` becomes a thin wrapper.
  - The hero's pulsing dot becomes a small shared `ui/PulseDot.tsx`, used by the hero and the gallery.
- **Removals** (§2.9):
  - `ui/DownloadButtons.tsx` and its gallery group are deleted (above).
  - The "Section and heading" and "Scroll-reveal" gallery groups are deleted. `ui/Section*` and `ui/AnimatedSection*` stay in the library and on the site; the completeness test excludes them by name.
  - Toasts leave the site: `ui/sonner.tsx`, the Toasts group and the `sonner` + `next-themes` packages are removed. The delete-account failure renders inline under the submit button.

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
| Island root | `new: ui-kit/UiKitIsland.tsx` | Reads `kitGroups`. Renders `KitSidebar`, then `kitGroups.map(g => <KitSection key={g.id} group={g} />)`. No `<Toaster />` (removed with toasts, §2.9). There is no existing gallery shell to reuse. |
| Group registry | `new: ui-kit/kitGroups.ts` (data module, not a component) | Holds a `KitGroup[]` of `{ id, title, description, covers: string[], Demo }`. It is the single source for the sidebar, the sections and the completeness test. |
| Sidebar | `new: ui-kit/KitSidebar.tsx` | Renders `kitGroups.map(...)` as `<a href="#<id>">`. From `md` up it is a sticky column. Below `md` it is a `<details>` "Components" menu stacked above the content. Nothing existing renders an in-page TOC. |
| Section | `new: ui-kit/KitSection.tsx` | Renders an anchor `id`, an `<h2>` title, a one-line description and a responsive grid (`grid-cols-1` → `sm:grid-cols-2` → `lg:grid-cols-3`) around `<group.Demo />`. **Not** `reuse: ui/Section.tsx`, because that component carries landing-page gutters (`lg:px-[140px]`) that would crush a column next to the sidebar. |
| Example cell | `new: ui-kit/KitExample.tsx` | Renders a state label (e.g. "Outline · Large · Disabled") above a `min-w-0` content area that wraps its content. Every repeated example in every demo renders through this one item component. |

#### Demos

There is one file per group in `src/components/ui-kit/demos/`. Each one maps a local data array into `KitExample`.

| Group | Tag | Data array → item | Notes |
|---|---|---|---|
| Button | `reuse: src/components/ui/button.tsx` (after the merge, §2.6) | `BUTTON_VARIANTS` (dark, destructive, store) × `BUTTON_SIZES` (default, pill) → `KitExample(Button)`. Then `BUTTON_VARIANTS` → one disabled `Button` each. | Gives 6 matrix cells and 3 disabled cells. Store cells pass `store="ios"` and are labelled "Store (iOS) · …". Three more cells: "Store (Google Play) · Standard" (`store="android"`), "With icon" (`dark` with `CheckIcon` before the text) and "As child (link)" (`dark asChild` around `<a href="#button">`). 12 cells in total. Labels: Dark, Destructive, Store; Standard, Pill. Arrays stay typed from `VariantProps<typeof buttonVariants>`, so a removed variant name fails typecheck. Focus ring and disabled look come from the base class. |
| Badge | `reuse: src/components/ui/badge.tsx` (after the merge, §2.8), `reuse: ui/PulseDot.tsx` | `BADGE_SIZES` (sm, md, lg) → `KitExample(Badge)`, plus one "With dot · Large" cell (`<Badge size="lg"><PulseDot />early access</Badge>`) | `extend: ui-kit/demos/BadgeDemo.tsx` (the existing file is rewritten). Labels: Small, Medium, Large, With dot. `BADGE_SIZES` is typed from `VariantProps<typeof badgeVariants>`, so a removed size fails typecheck. `covers: ["badge", "PulseDot"]`. |
| Input (one group; replaces "Text input and label" and "Email field") | `reuse: ui/input.tsx` (after the merge, §2.7), `reuse: ui/label.tsx` | `INPUT_EXAMPLES` (placeholder, filled, disabled, error, with-label, email, password) → `KitExample`, each via its `render()` | `extend: ui-kit/demos/InputDemo.tsx`: keeps its existing render-function data pattern, drops `file`, adds three entries. **Error:** `<Input error aria-describedby=… defaultValue="not-an-email" />` plus `<p role="alert" class="text-destructive-text text-sm">`. **Email:** `type="email"` with a placeholder. **Password:** `type="password"` with `defaultValue`. All are uncontrolled (`defaultValue`), so no per-example state component is needed. Ids are unique constants. `kitGroups` entry: `id: "input"`, title "Input", `covers: ["input", "label"]`. The `email-field` group is removed. `EmailFieldDemo.tsx` and `EmailFieldExample.tsx` are deleted. |
| Form | `reuse: ui/form.tsx` | `FORM_EXAMPLES` (with-description, with-error) → `KitExample(FormExample)` | `FormLabel`/`FormMessage` need context, so each example owns a `useForm()` + `<Form>` + `<FormField>`. The error example calls `form.setError(...)` once in an effect. That effect is guarded, because Strict Mode runs effects twice. |
| Selectable card and indicators | `reuse: ui/SelectCard.tsx` (`SelectCard`, `CheckBox`, `RadioBtn`) | `SELECT_CARD_EXAMPLES` = align {left, center} × indicator {none, checkbox, radio} × initial {unselected, selected}, plus one left card with `icon` → `KitExample(SelectCardExample)`. Then `INDICATOR_EXAMPLES` (checkbox/radio × checked/unchecked) → `KitExample`. | Gives 12 matrix cards and 1 icon card, each with its own toggle state. `icon` is ignored when `align="center"`, so the icon card is left-aligned only. The icon uses an existing `/public` image. |
| ~~Download buttons~~ | removed (§2.9) | — | `DownloadButtonsDemo.tsx` and the `download-buttons` registry entry are deleted. The store look is shown only in the Button group, whose store cells have no `onClick`, so they navigate, sign up and track nothing. |
| FAQ accordion | `reuse: ui/FAQAccordion.tsx` | `SAMPLE_FAQ` (3 `{question, answer}`) → passed as `items` | Its built-in `defaultValue="item-0"` and single-collapsible mode already match the ACs. |
| Dialog | `reuse: ui/dialog.tsx` | — | `Dialog` + `DialogTrigger` ("Open dialog") + `DialogContent` with Header (Title, Description), body and a Footer with two `DialogClose` buttons. Escape, the X button and the overlay click are built in. |
| ~~Toasts~~ | removed (§2.9) | — | `ToastDemo.tsx`, the `toasts` registry entry and `ui/sonner.tsx` are deleted. |
| ~~Section and heading~~ | removed (§2.9) | — | `SectionDemo.tsx` and the `section` registry entry are deleted. `ui/Section.tsx` / `Section.astro` stay in use on the site. |
| ~~Scroll-reveal~~ | removed (§2.9) | — | `AnimatedSectionDemo.tsx` and the `scroll-reveal` registry entry are deleted. `ui/AnimatedSection.tsx` / `.astro` stay in use on the site. |
| Icons | `reuse: ui/icons.tsx` (`CheckIcon`), `reuse: ui/AppleIcon.tsx`, `reuse: ui/PlayStoreIcon.tsx` (moved out of DownloadButtons, §2.6) | `ICON_EXAMPLES` (3) → `KitExample` | `covers: ["icons", "AppleIcon", "PlayStoreIcon"]`. |
| Flags | `reuse: ui/flags/*.tsx` | `FLAG_EXAMPLES` (4 languages) × `FLAG_SIZES` (`[16, 32, 48]` px) → `KitExample(Flag)` | Gives 12 labelled cells. |

**Not covered by a demo, on purpose:** `Section.tsx`, `Section.astro`, `AnimatedSection.tsx` and `AnimatedSection.astro`. They are page-layout helpers that the functional spec (§2.4) leaves out of the gallery. `kitGroups.ts` exports `KIT_EXCLUDED = ["Section", "Section.astro", "AnimatedSection", "AnimatedSection.astro"]` next to the registry, so the exclusion lives beside the data it qualifies and the test reads it from there.

**Final group order (9):** Button, Badge, Input, Form, Selectable card and indicators, FAQ accordion, Dialog, Icons, Flags. The earlier Download buttons, Toasts, Section and Scroll-reveal groups are gone.

### 2.4 Keeping the gallery complete (§2.4)

`kitGroups[].covers` lists ui file basenames, e.g. `"button"` or `"flags/UkFlagIcon"`. The consolidated test globs `src/components/ui/**/*.{tsx,astro}` and fails when any file is missing from the union of `covers` **and** `KIT_EXCLUDED`. It also fails when a `covers` or `KIT_EXCLUDED` name has no matching file (catches stale entries such as `"DownloadButtons"` or `"sonner"` after their deletion). Adding a new ui file without a gallery entry therefore turns the test suite red. Adding a new *variant* to an existing file isn't caught automatically. The Button and Badge arrays are typed from `VariantProps`, so a removed or renamed variant fails typecheck, but a newly added one is not detected.

### 2.5 Files

| Path | Status |
|---|---|
| `src/pages/ui-kit.astro` | new |
| `src/components/ui-kit/UiKitIsland.tsx`, `KitSidebar.tsx`, `KitSection.tsx`, `KitExample.tsx` | new |
| `src/components/ui-kit/kitGroups.ts` | new (data); also exports `KIT_EXCLUDED` |
| `src/components/ui-kit/demos/{Button,Badge,Input,Form,SelectCard,Faq,Dialog,Icons,Flags}Demo.tsx` | new (9) |
| `src/components/ui-kit/demos/{DownloadButtons,Toast,Section,AnimatedSection}Demo.tsx` | deleted (§2.9) |
| `src/components/ui-kit/demos/{FormExample,SelectCardExample}.tsx` | new: stateful single-example components rendered by `.map()` |
| `src/components/ui-kit/demos/EmailFieldDemo.tsx`, `EmailFieldExample.tsx` | deleted (Input merge) |
| `src/components/ui/input.tsx` | modified: no `file:*`, `error` prop, red border on `aria-invalid`, email defaults (§2.7) |
| `src/components/ui/EmailField.tsx` | deleted |
| `src/components/quiz/PlanGate.tsx`, `src/components/popups/NotifyMe.tsx` | modified: `EmailField` → sr-only `<label>` + `<Input type="email">` |
| `src/components/ui/badge.tsx` | modified: `size` replaces `variant`, `<span>`, `badgeVariants` exported (§2.8) |
| `src/components/ui/PulseDot.tsx` | new: the hero's pulsing dot, shared with the gallery |
| `src/components/landing/HeroSection.astro`, `QuizPromo.astro`, `src/components/blog/QuizTeaser.astro`, `TagPill.astro`, `src/pages/quiz.astro` | modified: `badgeVariants()` classes (§2.8 call-site table) |
| `src/components/quiz/QuizResultIsland.tsx` | modified: also `<Badge size="md">` for "Your pattern" |
| `src/components/ui/button.tsx` | modified: variants `dark`/`destructive`/`store`, sizes `default`/`pill`, `store` prop, `Slottable` (§2.6) |
| `src/components/ui/AppleIcon.tsx`, `src/components/ui/PlayStoreIcon.tsx` | new: moved verbatim out of `DownloadButtons.tsx` |
| `src/components/ui/DownloadButtons.tsx` | deleted (§2.9) |
| `src/components/landing/HeroCTA.tsx`, `src/components/landing/CTASection.tsx` | modified: render two `<Button variant="store">` directly with their own layout, `track()` and `PLAY_URL` (§2.9) |
| `src/components/blog/AppPromoAndroidLink.tsx` | new: React island, the Android store link + `track()` for the blog promo card (§2.9) |
| `src/components/blog/AppPromoCard.astro` | modified: mounts `<AppPromoAndroidLink client:load location={location} />` in place of `DownloadButtons` |
| `src/components/ui/sonner.tsx` | deleted (§2.9) |
| `src/components/account/DeleteAccountIsland.tsx` | modified: no `toast`/`Sonner`; inline failure message under the submit button (§2.9) |
| `src/components/ui/icons.tsx` | modified: doc comment only (drop "success toasts") |
| `package.json`, `package-lock.json` | modified: uninstall `sonner` and `next-themes` |
| `src/components/quiz/QuizIsland.tsx`, `PlanGate.tsx`, `QuizResultIsland.tsx`, `src/components/popups/NotifyMe.tsx`, `src/components/account/DeleteAccountIsland.tsx` | modified: variant/size names (§2.6 call-site table) |
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

**Store buttons on real pages.** `DownloadButtons` is gone (§2.9 has the per-page markup). Each page renders the two store buttons as:
- iOS: `<Button variant="store" store="ios" className=… onClick={() => { track("cta_click", { platform: "ios", location }); open(); }}>Join iOS Waitlist</Button>`.
- Android: `<Button asChild variant="store" store="android" className=…><a href={PLAY_URL} target="_blank" rel="noopener noreferrer" onClick={() => track("cta_click", { platform: "android", location })}>Download for Android</a></Button>`.
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

### 2.7 Input merge

**Target `Input` contract (`ui/input.tsx`):**

| Part | Behaviour |
|---|---|
| Classes | Today's string, minus every `file:*` class: `flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base md:text-sm`, placeholder colour, focus-visible ring, disabled faded and `not-allowed`. Plus `aria-[invalid=true]:border-destructive`. |
| `error?: boolean` | Sets `aria-invalid="true"`. When it is not set, any caller-supplied `aria-invalid` passes through. Under `FormControl`, Radix Slot puts `aria-invalid={!!error}` on the input. The CSS keys on the attribute, so delete-account fields get the red border automatically, with no change in `DeleteAccountIsland.tsx`. `aria-invalid="false"` never matches. |
| Email defaults | When `type="email"`: `autoComplete="email"`, `inputMode="email"`, `autoCapitalize="none"`, `spellCheck={false}`, `maxLength={254}`. Defaults are applied before `{...props}`, so callers can override them. `required` is **not** defaulted: the delete-account form has no `noValidate`, so a native `required` would show the browser bubble in place of the zod message. PlanGate and NotifyMe pass `required` themselves. |
| Ref / API | Still `forwardRef<HTMLInputElement, ComponentProps<"input"> & { error?: boolean }>`, so `{...field}` from react-hook-form keeps working. |

**Call sites:**

| File | Today | After | Visible change |
|---|---|---|---|
| `quiz/PlanGate.tsx` | `<EmailField id="quiz-email" … error errorId="quiz-gate-error" />` (borderless, `px-5 py-3.5 rounded-xl`, on `bg-brand-100`) | `<label htmlFor="quiz-email" className="sr-only">Email address</label>` + `<Input type="email" id="quiz-email" name="email" required value onChange={e => onEmailChange(e.target.value)} placeholder="Enter your email address" error={status==="error"} aria-describedby={status==="error" ? "quiz-gate-error" : undefined} />` | 40px, thin `border-input`, `rounded-md`, white field on the tinted card. Red border on error. |
| `popups/NotifyMe.tsx` | `<EmailField … bordered />` | Same pattern, `id="notify-me-email"`, error id `notify-me-email-error` | 40px `rounded-md`, `border-input` replaces `border-control-border`. Red border on error. |
| `account/DeleteAccountIsland.tsx` | `<Input type="email" …>` and `<Input type="password" …>` under `FormControl` | unchanged | Red border when `FormMessage` shows |

The redundant `aria-label` that `EmailField` added on top of its `<label>` is dropped, since the label already names the field. Error `<p>` elements stay where they are in both files.

### 2.8 Badge merge

**Target `badgeVariants` (cva) contract (`ui/badge.tsx`):**

| Part | Classes / behaviour | Source |
|---|---|---|
| Base | `inline-flex items-center justify-center gap-1 rounded-full bg-brand-100 text-brand-dark font-body font-normal`. No border, hover or focus ring (badges are not interactive). | HeroSection / TagPill fill, dark brand text (4.9:1 on brand-100, see `index.css`) |
| `size: sm` | `px-3 py-1 text-xs` | TagPill |
| `size: md` | `px-3 py-1 text-sm sm:text-base` | QuizPromo/QuizTeaser padding; quiz intro / "Your pattern" text size |
| `size: lg` | `px-3 sm:px-4 py-2 sm:py-3 text-base sm:text-lg leading-[150%]` | HeroSection |
| Removed | `variant` (`default`, `secondary`, `destructive`, `outline`) | — |
| Defaults | `size: "md"` | — |

- `Badge` renders `<span className={cn(badgeVariants({ size }), className)} {...props}>{children}</span>`. `BadgeProps` extends `HTMLAttributes<HTMLSpanElement>` plus `VariantProps`.
- `badgeVariants` is exported.
- **Astro callers use `badgeVariants()`, not `<Badge>`.** A React component without a `client:` directive gets its Astro children wrapped in an inline `<astro-static-slot>` element (`@astrojs/react` static HTML). That would put the hero's dot and text inside one inline box and break `gap-1`. Class strings avoid the wrapper and ship no JS. `quiz.astro` switches for the same reason.
- **`new: ui/PulseDot.tsx`**: the hero's `p-1 rounded-full bg-brand-200 motion-safe:animate-[pulse_3s_ease-in-out_infinite]` wrapper around the 8px brand-blue circle svg, `aria-hidden`. It has no children, so it renders cleanly from Astro without a `client:` directive. It replaces markup that would otherwise be duplicated in the hero and the gallery. `motion-safe:` handles reduced motion.

**Call sites:**

| File | Today | After | Visible change |
|---|---|---|---|
| `landing/HeroSection.astro` | hand-written `div` pill + inline dot + text `span` | `<span class={badgeVariants({ size: "lg" })}><PulseDot />early access</span>` | none intended |
| `blog/TagPill.astro` | `text-brand … bg-brand-100` span | `<span class={cn(badgeVariants({ size: "sm" }), className)}><slot /></span>`. Its 3 callers are unchanged. | text `brand` → `brand-dark` |
| `landing/QuizPromo.astro` | `px-3 py-1 rounded-full bg-brand-light text-brand-dark text-sm` | `badgeVariants({ size: "md" })` | fill `brand-light` → `brand-100`; text `sm:text-base` on ≥640px |
| `blog/QuizTeaser.astro` | same as QuizPromo, plus `self-start` | `cn(badgeVariants({ size: "md" }), "self-start")` | same |
| `pages/quiz.astro` (intro) | React `<Badge className="py-2 px-4 …">` | `<span class={badgeVariants({ size: "md" })}>` | padding `py-2 px-4` → `py-1 px-3`; fill `secondary` → `brand-100` |
| `quiz/QuizResultIsland.tsx` ("Your pattern") | `<Badge className="text-brand-dark … uppercase tracking-wide">` | `<Badge size="md" className="uppercase tracking-wide">` | fill `secondary` → `brand-100`, `py-0.5` → `py-1`, the 1px transparent border is gone |

### 2.9 Removals: DownloadButtons, two gallery groups, toasts

**DownloadButtons removed.** `Button` is the only button component. Each of the three former call sites places the store buttons itself and keeps today's DOM, classes and behaviour:

| File | Container (was `DownloadButtons` layout) | Buttons | Behaviour kept |
|---|---|---|---|
| `landing/HeroCTA.tsx` (React island) | `<div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto px-6 sm:px-0">` | iOS + Android, each `className="w-full sm:w-[260px]"` | `location: "hero"`; iOS opens `NotifyMe` |
| `landing/CTASection.tsx` (React island) | `<div className="flex flex-col items-center gap-3 w-full">` | iOS + Android, each `className="w-full"` | `location: "footer_cta"`; iOS opens `NotifyMe` |
| `blog/AppPromoCard.astro` → `new: blog/AppPromoAndroidLink.tsx` | the island renders `<div className="flex flex-col items-center gap-3 w-full shrink-0">` | Android only, `className="w-full sm:w-auto"` | `location` prop, passed through unchanged (`about_cta`, `blog_cta`) |

- **Why a new island for the blog card:** `AppPromoCard.astro` is static Astro, and the Android link needs an `onClick` for `track()`. Today `DownloadButtons client:load` provides that. Rendering `<Button asChild>` straight from Astro would not work: Astro wraps static children in `<astro-static-slot>`, and Radix `Slot` would merge onto that wrapper instead of the `<a>` (same issue as §2.8). `AppPromoAndroidLink` is a one-purpose island in the `blog/` domain folder with one prop, `location`. It hydrates `client:load` as `DownloadButtons` did, so the about page and blog posts ship the same JS as today minus the composer.
- The Android `<a>` markup appears in three files. That is accepted: the user asked for exactly one button component, and a shared store-buttons wrapper would bring `DownloadButtons` back under a new name. The shared part (look, icon, focus ring, size) already lives in `Button variant="store"`.
- `PLAY_URL` keeps coming from `@/constants/links`. `trackClicks` disappears with the component.

**Section and Scroll-reveal groups removed.** Delete `ui-kit/demos/SectionDemo.tsx`, `ui-kit/demos/AnimatedSectionDemo.tsx` and their `section` / `scroll-reveal` registry entries. Add `KIT_EXCLUDED` to `kitGroups.ts` (§2.3, §2.4). No change to `ui/Section*`, `ui/AnimatedSection*` or the pages that use them. The jsdom `CSS.supports` stub in the acceptance test existed only for `AnimatedSectionDemo` and is removed.

**Toasts removed.**

| Part | Change |
|---|---|
| `ui/sonner.tsx` | deleted |
| `ui-kit/demos/ToastDemo.tsx`, `toasts` registry entry | deleted |
| `ui-kit/UiKitIsland.tsx` | drops the `Toaster` import and mount |
| `account/DeleteAccountIsland.tsx` | drops `import { toast } from "sonner"`, the `Toaster as Sonner` import, the `<Sonner />` mount and the `onError` handler. Under the submit `Button`, inside the `<form>`, renders `{mutation.isError && <p role="alert" className="text-sm font-medium text-destructive-text font-body">{mutation.error.message}</p>}` (the `FormMessage` look). `mutation.mutate()` resets the error state when a new request starts, so the message clears on resubmit without extra state. |
| `ui/icons.tsx` | the `CheckIcon` doc comment stops mentioning "success toasts" |
| `package.json` | `npm uninstall sonner next-themes`. `next-themes` is imported only by `ui/sonner.tsx`. |

The message text is the API error's `message`, exactly what the toast showed. It is not translated, as today.

---

## 3. Impact and Risk Analysis

### System Dependencies

- `DownloadButtons` was used by `HeroCTA`, `CTASection` and `AppPromoCard.astro` (about page and every blog post). All three now render `Button variant="store"` themselves, so every page with download buttons is touched.
- `DeleteAccountIsland` loses sonner. Its bundle shrinks, and the failure path changes from a toast to inline text.
- `Button` is used by quiz (3 files), NotifyMe and DeleteAccountIsland. Each of them changes look on purpose (§2.6).
- `navLinks.ts` feeds Header and Footer on every page. Dev builds gain one link; production output is unchanged.
- Shared vendor chunks for React and Radix may get split differently once a new island imports them. sonner and next-themes leave the bundle entirely.

### Risks & Mitigations

| Risk | Mitigation |
|---|---|
| The gallery leaks into production navigation or sitemap. | `import.meta.env.DEV` is statically replaced. The build test asserts that no dist HTML other than the page links to it, and that both sitemaps omit it. |
| Analytics fire from gallery clicks once a visitor has accepted cookies. | No gallery demo imports `track` or a page-level CTA component. Store cells in the Button group have no `onClick`. A jsdom test clicks every gallery store cell and asserts the mocked `track` is never called. |
| Horizontal scroll at 375px. Likely sources: `whitespace-nowrap` buttons, wide dialog. | Grid is `grid-cols-1` on phones, cells are `min-w-0`, and button cells use `flex-wrap`. Check manually that `document.documentElement.scrollWidth <= innerWidth` at 375px. |
| Hydration mismatches. | No `Date`, random or `window` reads in render. Feature detection lives in effects. Every `id`/`errorId` is unique. Demos are imported inside the island, never passed as props from `.astro`. |
| Bundle impact on other pages. | The island is page-scoped. Compare `_astro/` chunk sizes for `/` and `/quiz/` before and after the build. |
| Download buttons drift from today's look after the rebuild (16px icons from a leftover svg rule, `rounded-md` leaking from the base, lost shine). | The `store` variant sets `[&_svg]:size-6`, and radius lives only in sizes. A test asserts that the iOS and Android elements carry `h-[54px]`, `rounded-xl`, `bg-foreground` and `cta-btn` and contain an svg. Manual side-by-side check against `main`. |
| A missed `variant="black"`/`size="xl"` call site. | Removing the keys from cva makes every leftover use a TypeScript error. Typecheck gates each slice. |
| The `cta-btn` lift and shine now also apply inside the quiz and the NotifyMe dialog. | `.cta-btn` sets `overflow: hidden`, which is harmless for text-only buttons, and is already reduced-motion-safe. Confirm in the manual quiz walk-through. |
| `asChild` + `store` breaks, because Slot needs exactly one child. | `Slottable` wraps the children (Radix's documented pattern). Covered by the Android-link test. |
| Delete-account starts showing the browser's "fill in this field" bubble in place of its zod message. | `Input` never defaults `required`. Only PlanGate and NotifyMe pass it, as `EmailField` did. |
| The red border is missing under `FormControl`, or shows when there is no error. | The border keys on `aria-invalid="true"` only. `FormControl` writes `"false"` when there is no error. The test covers both. |
| Email autofill or the phone email keyboard regresses in quiz and NotifyMe. | `type="email"` defaults restore every attribute `EmailField` set. The test asserts `autocomplete`, `inputmode`, `autocapitalize`, `spellcheck` and `maxlength`. |
| The quiz plan-gate field on `bg-brand-100` is low-contrast with the light `border-input`. | It is now a white field on a tinted card, so the field edge is visible. Same as delete-account, accepted by the spec. Check by hand. |
| A missed `variant=` on `<Badge>`, or a leftover `EmailField`, `DownloadButtons` or `sonner` import. | Removing the cva key, deleting the files and uninstalling the packages turn each into a TypeScript or build error. |
| Hero, closing CTA or blog promo buttons drift after inlining (lost `sm:w-[260px]`, `px-6 sm:px-0`, `shrink-0`, row vs stacked). | The §2.9 table copies each container and width class verbatim from today's `DownloadButtons` output. Compare against `main` at 375px and desktop on `/`, a blog post and `/about/`. |
| Click counting regresses on one of the three pages (wrong `location`, missing `onClick`). | Tests render `HeroCTA`, `CTASection` and `AppPromoAndroidLink` and assert `track("cta_click", { platform, location })` per button. |
| The delete-account failure becomes invisible, or sticks after a retry. | Inline `role="alert"` keyed on `mutation.isError`. A test rejects `deleteAccount`, asserts the message under the button and no toast, then resubmits and asserts it clears while pending. |
| Hero pill layout shifts (dot spacing, height). | `PulseDot` is the hero's markup verbatim. `lg` copies the hero's padding and text classes. Compare by hand against `main`. |
| The "9 questions" pill grows on desktop (`text-sm` → `sm:text-base`) and wraps in narrow QuizTeaser columns. | It wraps the same way it does today. Check by hand at 375px and in a blog post. |
| The gallery drifts from the library. | The completeness test (§2.4), including `KIT_EXCLUDED` and the stale-name check. CLAUDE.md / component-structure rule: a ui change adds its gallery entry in the same PR. |

---

## 4. Testing Strategy

There are two consolidated test files, one per feature area. Each covers several acceptance criteria. No per-task tests.

1. **`src/test/uiKit.acceptance.test.tsx`** (jsdom, mocks `@/lib/analytics` `track`):
   - **Groups and nav:** the sidebar lists every `kitGroups` title (9), each `href="#id"` matches a section id, and every group's section renders. No group is titled "Download buttons", "Toasts", "Section and heading" or "Scroll-reveal".
   - **Button:** 12 labelled cells (6 matrix, 3 disabled, Google Play store, with-icon, as-child). No label names a removed style or size. Both store cells have an svg *after* the text. Clicking a disabled button calls no handler.
   - **Buttons on real pages:** `HeroCTA` and `CTASection` each render "Join iOS Waitlist" (`<button>`) and "Download for Android" (`<a target="_blank" href=PLAY_URL>`) with `h-[54px] rounded-xl bg-foreground cta-btn` and an svg after the text. Clicking calls `track("cta_click", { platform, location })` with `hero` / `footer_cta`, and the iOS click opens the NotifyMe dialog. `AppPromoAndroidLink location="blog_cta"` renders only the Android link and tracks with that location. A plain `<Button>` and `<Button variant="destructive">` carry `h-[54px] rounded-xl`; `size="pill"` carries `rounded-full`. Clicking each gallery store cell never calls `track` and opens no dialog.
   - **Badge:** 4 labelled cells (Small, Medium, Large, With dot). All carry `bg-brand-100 text-brand-dark rounded-full`. None carries `bg-primary`, `bg-destructive` or a border class. The dot cell contains the `PulseDot` element with `motion-safe:` animation.
   - **Badges on real pages:** `<Badge size="md">` renders a `<span>`. `badgeVariants({ size })` returns the sm, md and lg padding and text classes from §2.8.
   - **Inputs:** the group list has one "Input" entry and no "Email field". There are 7 labelled cells and no `type="file"`. All inputs share `h-10 rounded-md border`. Clicking the with-label `Label` focuses its input. The disabled input is `disabled` and ignores typing. Typing into an enabled example updates its value. The error example has `aria-invalid="true"`, the `border-destructive` class path and a visible message.
   - **Inputs on real pages:** `<Input type="email">` carries the email defaults (`autocomplete`, `inputmode`, `autocapitalize`, `spellcheck`, `maxlength=254`) and no `required`. `<Input error>` gets `aria-invalid="true"`. A `FormControl`-wrapped `Input` in a form with a set error gets `aria-invalid="true"`, and without one gets `"false"`. PlanGate with `status="error"` renders the email input with `aria-invalid="true"` and `aria-describedby="quiz-gate-error"`.
   - **SelectCard:** clicking toggles the selected state on and off. All 12 matrix examples, the icon card and the 4 indicator examples are present.
   - **FAQ:** the first item is open; opening another closes it; clicking the open one closes all.
   - **Dialog:** "Open dialog" shows the title, description and footer; Escape closes it.
   - **Delete-account failure:** with `@/lib/api` `deleteAccount` mocked to reject `new Error("Wrong password")`, a valid submit shows a `role="alert"` "Wrong password" after the submit button and no `[data-sonner-toaster]` element. A second submit (held pending) removes the message.
   - **Icons and flags:** 3 icons and 12 flag cells are labelled.
   - **Completeness:** every file under `src/components/ui/**` appears in the union of `kitGroups[].covers` and `KIT_EXCLUDED`, and every name in either list matches a file.
2. **`src/test/uiKit.build.acceptance.test.ts`** (reads `dist/`, skipped when it is absent, same pattern as `quiz.build.acceptance.test.ts`):
   - `dist/ui-kit/index.html` exists and contains `content="noindex, nofollow"`.
   - Neither `sitemap-0.xml` nor `sitemap-index.xml` contains `ui-kit`.
   - No other `dist/**/*.html` contains `href="/ui-kit/"`, `href="/ui-kit"` or `https://calmisu.com/ui-kit`.
   - `robots.txt` does not disallow `/ui-kit`.

**Manual only (see MANUAL checks in tasks):**
- Visual parity with the homepage and quiz.
- Homepage download buttons look and hover exactly as on `main`. The homepage quiz promo "Start now" link is 54px, `rounded-xl` and shows the white focus ring on Tab.
- Quiz walk-through (start, multi-select continue, plan gate, results, 7-day "Start"), the NotifyMe popup and the delete-account page show the new 54px buttons.
- Plan-gate and NotifyMe email fields are 40px with thin borders, turn red on an invalid submit, and still autofill and bring up the email keyboard on a phone. The delete-account fields turn red on an empty submit.
- Hero "early access" pill matches `main`. Blog tags, the quiz promo and teaser pills, the quiz intro and "Your pattern" share one fill and text colour.
- Focus ring on Tab.
- Download buttons on `/` (hero and closing CTA), a blog post and `/about/` match `main` (layout, widths, icons, hover). The waitlist dialog opens from both iOS buttons.
- Delete-account with a wrong password shows the red message under the button and no toast.
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
- **2026-10-01: Input merge** (follows the functional-spec amendment of the same date).
  - Added §2.7: `Input` contract (no `file:*`, `error` prop, red border keyed on `aria-invalid="true"`, email defaults without `required`) and a call-site table. `EmailField.tsx` is deleted.
  - Gallery: one "Input" group (`InputDemo` extended with error, email and password). `EmailFieldDemo` and `EmailFieldExample` are deleted, and the `email-field` registry entry is removed.
  - New risks: native `required` on delete-account, the `FormControl` border, autofill and email-keyboard regressions.
- **2026-10-01: Badge merge** (follows the functional-spec amendment of the same date).
  - Added §2.8: `badgeVariants` with `size` only (sm/md/lg), one `brand-100` fill and `brand-dark` text, `<span>` with children, and `badgeVariants` exported. Astro callers use the class function, to avoid the `<astro-static-slot>` wrapper.
  - New shared `ui/PulseDot.tsx` for the hero dot, reused by the gallery. `TagPill.astro` becomes a thin wrapper.
  - Badge demo: 3 sizes plus a "With dot" cell.
- **2026-10-01: DownloadButtons removed; Section, Scroll-reveal and Toasts groups removed; toasts removed from the site** (follows the three functional-spec amendments of the same date).
  - Added §2.9. `ui/DownloadButtons.tsx` is deleted. HeroCTA and CTASection render `Button variant="store"` directly, and `AppPromoCard.astro` mounts a new `blog/AppPromoAndroidLink.tsx` island. `trackClicks` is gone. §2.6 now describes the per-page store markup instead of the composer.
  - Gallery: the Download buttons, Toasts, Section and Scroll-reveal groups and their demos are deleted, leaving 9 groups. `kitGroups.ts` exports `KIT_EXCLUDED` for the Section/AnimatedSection files, and the completeness test also rejects stale names.
  - `ui/sonner.tsx` and the `sonner` / `next-themes` packages are removed. The delete-account failure is an inline `role="alert"` message under the submit button.
  - Risks and tests updated: per-page store-button parity and click tracking, the inline failure message. The scroll-reveal risk and the Download buttons/Toasts tests are dropped.
