# Tasks: UI Component Gallery

- **Functional Specification:** [functional-spec.md](./functional-spec.md)
- **Technical Specification:** [technical-considerations.md](./technical-considerations.md)
- **Decisions:** [decisions.md](./decisions.md)

> Conventions: one component per file (`.claude/skills/component-structure/SKILL.md`). Each Verify task is a smoke check only (typecheck, `npm run lint`, `npm test`, one quick browser check) and writes no tests. All new tests live in the final slice. Verify tasks stop every server they start (by recorded PID) and delete screenshots/recordings before finishing.

---

- [x] **Slice 1: Gallery page opens in dev with sidebar and the Button group**

  > Smallest end-to-end gallery: `/ui-kit/` renders, the sidebar jumps to sections, the Button matrix shows, and the dev nav link works.
  - [x] Create the group registry: `new: src/components/ui-kit/kitGroups.ts` — export the `KitGroup` type `{ id, title, description, covers: string[], Demo }` and a `kitGroups: KitGroup[]` array containing only the Button group for now (`covers: ["button"]`). **[Agent: react-islands]** **[Model: haiku]**
  - [x] Create the example cell: `new: src/components/ui-kit/KitExample.tsx` — state label above a `min-w-0`, wrapping content area; takes `label` and `children`. **[Agent: react-islands]** **[Model: haiku]**
  - [x] Create the section: `new: src/components/ui-kit/KitSection.tsx` — anchor `id`, `<h2>` title, one-line description, responsive grid (`grid-cols-1` → `sm:grid-cols-2` → `lg:grid-cols-3`) around `<group.Demo />`. Do not reuse `ui/Section.tsx`. **[Agent: react-islands]** **[Model: sonnet]**
  - [x] Create the sidebar: `new: src/components/ui-kit/KitSidebar.tsx` — `kitGroups.map(...)` into `<a href="#id">`; sticky column from `md` up, `<details>` "Components" menu stacked above content below `md`. **[Agent: react-islands]** **[Model: sonnet]**
  - [x] Create the island root: `new: src/components/ui-kit/UiKitIsland.tsx` — renders `KitSidebar` and `kitGroups.map(g => <KitSection key={g.id} group={g} />)`. **[Agent: react-islands]** **[Model: haiku]**
  - [x] Create the Button demo: `new: src/components/ui-kit/demos/ButtonDemo.tsx` (`reuse: src/components/ui/button.tsx`) — `BUTTON_VARIANTS` (7) × `BUTTON_SIZES` (6) → `KitExample(Button)` (42 cells, `icon` size gets an icon child), `BUTTON_VARIANTS` → 7 disabled cells, one button with `CheckIcon` beside its text, one `asChild` button wrapping `<a href="#button">`. Type arrays from `VariantProps<typeof buttonVariants>`; button cells use `flex-wrap`. Register it in `kitGroups.ts`. **[Agent: react-islands]** **[Model: sonnet]**
  - [x] Create the page: `new: src/pages/ui-kit.astro` — `BaseLayout noindex`, `Header`, `<UiKitIsland client:load />`, `Footer`; no analytics. **[Agent: astro-architect]** **[Model: haiku]**
  - [x] Add the dev-only nav entry: `extend: src/data/navLinks.ts` — `...(import.meta.env.DEV ? [{ label: "UI Kit", href: "/ui-kit/" }] : [])` so Header (desktop + mobile drawer) and Footer show it in dev only. **[Agent: astro-architect]** **[Model: haiku]**
  - [x] Verify: run typecheck, `npm run lint` and `npm test` (all pass), start `npm run dev` (record PID), open `/ui-kit/`, confirm the sidebar lists Button, clicking it scrolls to the section, 42 + 7 labelled buttons render, and the "UI Kit" link shows in header and footer. Stop the dev server by PID and delete any screenshots. **[Agent: general-purpose]** **[Model: sonnet]**

- [x] **Slice 2: Production build hides the gallery**

  > The page exists on the live site by direct URL only: noindex, no sitemap entry, no links.
  - [x] Exclude the page from the sitemap: `extend: astro.config.mjs` — add `!page.startsWith("https://calmisu.com/ui-kit/")` to the sitemap `filter` and update the "keep in sync with noindex pages" comment to list `/ui-kit/`. Leave `public/robots.txt` untouched (must not disallow `/ui-kit/`). **[Agent: content-seo]** **[Model: haiku]**
  - [x] Verify: run `npm run build`; confirm `dist/ui-kit/index.html` exists with `content="noindex, nofollow"`, `ui-kit` is absent from `dist/sitemap-0.xml` and `dist/sitemap-index.xml`, and `grep -rl "ui-kit" dist --include=*.html` lists only the gallery page itself. Run `npm test`. Delete nothing in `dist` beyond what the build created; stop any server started by PID. **[Agent: general-purpose]** **[Model: sonnet]**

- [x] **Slice 3: Text and form groups (Badge, Text input and label, Email field, Form)**

  > Inputs and their states are visible and typeable.
  - [x] Create `new: src/components/ui-kit/demos/BadgeDemo.tsx` (`reuse: src/components/ui/badge.tsx`) — `BADGE_VARIANTS` (4) → `KitExample(Badge)`, labelled by prop name. Register in `kitGroups.ts` (`covers: ["badge"]`). **[Agent: react-islands]** **[Model: haiku]**
  - [x] Create `new: src/components/ui-kit/demos/InputDemo.tsx` (`reuse: src/components/ui/input.tsx`, `reuse: src/components/ui/label.tsx`) — `INPUT_EXAMPLES` (placeholder, filled, disabled, with-label using `Label htmlFor` + unique `id`, file `type="file"`) → `KitExample`. Register (`covers: ["input", "label"]`). **[Agent: react-islands]** **[Model: sonnet]**
  - [x] Create the stateful single example `new: src/components/ui-kit/demos/EmailFieldExample.tsx` (`reuse: src/components/ui/EmailField.tsx`) — local `useState`, unique `id`/`errorId`, error variant renders `<p role="alert" class="text-destructive-text text-sm">` (no red border, as shipped), tinted variant sits on `bg-brand-100`. **[Agent: react-islands]** **[Model: sonnet]**
  - [x] Create `new: src/components/ui-kit/demos/EmailFieldDemo.tsx` — `EMAIL_EXAMPLES` (empty, filled, error, bordered-on-white, borderless-on-tinted) → `KitExample(EmailFieldExample)`. Register (`covers: ["EmailField"]`). **[Agent: react-islands]** **[Model: haiku]**
  - [x] Create the stateful single example `new: src/components/ui-kit/demos/FormExample.tsx` (`reuse: src/components/ui/form.tsx`) — own `useForm()` + `<Form>` + `<FormField>`; the error variant calls `form.setError(...)` once in a guarded effect (Strict-Mode safe). **[Agent: react-islands]** **[Model: sonnet]**
  - [x] Create `new: src/components/ui-kit/demos/FormDemo.tsx` — `FORM_EXAMPLES` (with-description, with-error) → `KitExample(FormExample)`. Register (`covers: ["form"]`). **[Agent: react-islands]** **[Model: haiku]**
  - [x] Verify: typecheck, `npm run lint`, `npm test`; open `/ui-kit/` in dev, confirm the four groups render, type into an email example, click the with-label label and see the input focus, and see the red message under the error examples. Stop the server by PID; delete screenshots. **[Agent: general-purpose]** **[Model: sonnet]**

- [ ] **Slice 4: Selectable cards, indicators, Icons and Flags**

  > Cards toggle on click; icons and all flag sizes are visible.
  - [ ] Create the stateful single example `new: src/components/ui-kit/demos/SelectCardExample.tsx` (`reuse: src/components/ui/SelectCard.tsx` — `SelectCard`, `CheckBox`, `RadioBtn`) — local selected state toggled on click, initial state from props. **[Agent: react-islands]** **[Model: sonnet]**
  - [ ] Create `new: src/components/ui-kit/demos/SelectCardDemo.tsx` — `SELECT_CARD_EXAMPLES` = align {left, center} × indicator {none, checkbox, radio} × initial {unselected, selected} (12), plus one left-aligned card with `icon` (existing `/public` image) → `KitExample(SelectCardExample)`; then `INDICATOR_EXAMPLES` (checkbox/radio × checked/unchecked) → `KitExample`. Register (`covers: ["SelectCard"]`). **[Agent: react-islands]** **[Model: sonnet]**
  - [ ] Create `new: src/components/ui-kit/demos/IconsDemo.tsx` (`reuse: src/components/ui/icons.tsx` `CheckIcon`; `reuse: src/components/ui/DownloadButtons.tsx` `AppleIcon`, `PlayStoreIcon`) — `ICON_EXAMPLES` (3) → `KitExample`. Register (`covers: ["icons"]`). **[Agent: react-islands]** **[Model: haiku]**
  - [ ] Create `new: src/components/ui-kit/demos/FlagsDemo.tsx` (`reuse: src/components/ui/flags/*.tsx`) — `FLAG_EXAMPLES` (4 languages) × `FLAG_SIZES` (`[16, 32, 48]`) → 12 labelled `KitExample` cells. Register (`covers: ["flags/EsFlagIcon", "flags/PlFlagIcon", "flags/UaFlagIcon", "flags/UkFlagIcon"]`). **[Agent: react-islands]** **[Model: haiku]**
  - [ ] Verify: typecheck, `npm run lint`, `npm test`; in dev click a card to select and unselect it, and confirm 4 indicators, 3 icons and 12 flag cells render. Stop the server by PID; delete screenshots. **[Agent: general-purpose]** **[Model: sonnet]**

- [ ] **Slice 5: Download buttons without analytics**

  > Gallery Download buttons never fire analytics or open the waitlist; production behaviour is unchanged.
  - [ ] Add the opt-in prop: `extend: src/components/ui/DownloadButtons.tsx` — `trackClicks?: boolean` (default `true`); when `false` neither button calls `track()`. Existing call sites (`HeroCTA`, `CTASection`) stay untouched. **[Agent: react-islands]** **[Model: sonnet]**
  - [ ] Create `new: src/components/ui-kit/demos/DownloadButtonsDemo.tsx` (`reuse: src/components/ui/DownloadButtons.tsx`) — `DOWNLOAD_EXAMPLES` (row, col, ios-only, android-only) → `KitExample(DownloadButtons)` with `trackClicks={false}`, `onIosClick={() => {}}`, `location="ui_kit"`, `widthClass="w-full max-w-[260px]"`. Register (`covers: ["DownloadButtons"]`). **[Agent: react-islands]** **[Model: sonnet]**
  - [ ] Verify: typecheck, `npm run lint`, `npm test`; in dev confirm 4 examples, iOS click does nothing visible, Android opens Google Play in a new tab, and the homepage Download buttons still render. Stop the server by PID; delete screenshots. **[Agent: general-purpose]** **[Model: sonnet]**

- [ ] **Slice 6: FAQ accordion, Dialog and Toasts**

  > Interactive overlays work from the gallery.
  - [ ] Create `new: src/components/ui-kit/demos/FaqDemo.tsx` (`reuse: src/components/ui/FAQAccordion.tsx`) — `SAMPLE_FAQ` (3 `{question, answer}`) passed as `items`. Register (`covers: ["FAQAccordion"]`). **[Agent: react-islands]** **[Model: haiku]**
  - [ ] Create `new: src/components/ui-kit/demos/DialogDemo.tsx` (`reuse: src/components/ui/dialog.tsx`) — `Dialog` + `DialogTrigger` ("Open dialog") + `DialogContent` with Header (Title, Description), body text and Footer with two `DialogClose` buttons. Register (`covers: ["dialog"]`). **[Agent: react-islands]** **[Model: haiku]**
  - [ ] Create `new: src/components/ui-kit/demos/ToastDemo.tsx` (`reuse: src/components/ui/sonner.tsx`) — `TOAST_EXAMPLES` (plain, with description, success, error, with action that closes the toast) → `KitExample(Button onClick=fire)`; `toast()` only in click handlers. Mount `<Toaster />` once in `extend: src/components/ui-kit/UiKitIsland.tsx`. Register (`covers: ["sonner"]`). **[Agent: react-islands]** **[Model: sonnet]**
  - [ ] Verify: typecheck, `npm run lint`, `npm test`; in dev check first FAQ item open and switching, "Open dialog" opens and Escape closes it, each toast button shows its toast, action button closes its toast. Stop the server by PID; delete screenshots. **[Agent: general-purpose]** **[Model: sonnet]**

- [ ] **Slice 7: Section and Scroll-reveal groups**

  > Layout helpers and the scroll animation (with Replay) are visible and testable.
  - [ ] Create `new: src/components/ui-kit/demos/SectionDemo.tsx` (`reuse: src/components/ui/Section.tsx` — `Section`, `SectionHeading`) — `HEADING_EXAMPLES` (section, block) → `KitExample(SectionHeading)`; `SECTION_EXAMPLES` (default padding, `paddingY="py-6"`) → `KitExample(Section)` on `bg-brand-100` with an outline, `col-span-full`. Register (`covers: ["Section", "Section.astro"]` as the file basenames the completeness glob expects). **[Agent: react-islands]** **[Model: sonnet]**
  - [ ] Create `new: src/components/ui-kit/demos/AnimatedSectionDemo.tsx` (`reuse: src/components/ui/AnimatedSection.tsx`) — fixed-height `overflow-y-auto` box as the `view()` timeline with a tall spacer above and space below; "Replay" resets `scrollTop = 0` then scrolls the example into view (`behavior: "auto"` under reduced motion, else `"smooth"`); `CSS.supports("animation-timeline: view()")` checked in an effect with a fallback note. Register (`covers: ["AnimatedSection", "AnimatedSection.astro"]`). **[Agent: react-islands]** **[Model: opus]**
  - [ ] Verify: typecheck, `npm run lint`, `npm test`; in dev (Chromium) scroll the reveal box and see the animation, click Replay and see it replay, and see both section samples with visible padding. Stop the server by PID; delete screenshots. **[Agent: general-purpose]** **[Model: sonnet]**

- [ ] **Slice 8: Completeness wiring, phone layout and docs**

  > Everything registered, the page fits 375px, and the component index is current.
  - [ ] Audit `src/components/ui-kit/kitGroups.ts`: confirm the union of `covers` includes every file under `src/components/ui/**/*.{tsx,astro}`, fix gaps, and keep the order matching the spec's group list. **[Agent: react-islands]** **[Model: haiku]**
  - [ ] Review the gallery at 375px and desktop: fix any `whitespace-nowrap` or fixed-width overflow so `document.documentElement.scrollWidth <= innerWidth`, keep the sidebar usable (collapsed menu below `md`), and confirm fonts/colors/radii match the homepage and quiz. **[Agent: tailwind-stylist]** **[Model: sonnet]**
  - [ ] Regenerate the component map: `node .awos-tune/scripts/component-index.mjs` → `context/components-index.md`. **[Agent: react-islands]** **[Model: haiku]**
  - [ ] Verify: typecheck, `npm run lint`, `npm test`, `npm run build`; compare `dist/_astro/` chunk sizes used by `/` and `/quiz/` against `main` (no growth expected); open `/ui-kit/` at 375px and confirm no horizontal scroll. Stop servers by PID; delete screenshots. **[Agent: general-purpose]** **[Model: sonnet]**

- [ ] **Slice 9: Feature Testing & Regression**

  > Verifies the whole feature end-to-end against functional-spec.md, run after all implementation slices are complete.
  - [ ] Read functional-spec.md acceptance criteria in full. Generate acceptance-level tests that verify the entire feature as a whole — not individual slices. Cover applicable layers (unit for pure logic, integration for service interactions, e2e for user flows) based on the project's testing stack. Write tests with RED validation (must fail before implementation is confirmed done). Annotate each test with `@spec: 003-ui-component-gallery` and `@regression` if suitable for long-term regression. Target two files: `src/test/uiKit.acceptance.test.tsx` (jsdom, mocks `@/lib/analytics` `track`; groups and nav, Button counts and disabled click, inputs, SelectCard toggle, Download buttons never call `track`, FAQ, Dialog, Toasts, Icons and flags, completeness against `src/components/ui/**`) and `src/test/uiKit.build.acceptance.test.ts` (reads `dist/`, skipped when absent, same pattern as `quiz.build.acceptance.test.ts`; noindex tag, sitemaps omit `ui-kit`, no other HTML links to it, `robots.txt` does not disallow it). **[Agent: general-purpose]** **[Model: sonnet]**
  - [ ] Run all generated tests. All must pass. Fix any failures before proceeding. **[Agent: general-purpose]** **[Model: sonnet]**
