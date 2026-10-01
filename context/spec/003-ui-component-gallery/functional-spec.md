# Functional Specification: UI Component Gallery

- **Roadmap Item:** Not on the roadmap. Internal tooling: a Storybook-style reference page for the site's shared UI building blocks.
- **Status:** Draft (amended 2026-10-01 three times, see Change Log)
- **Author:** Serhii Kushnir

---

## 1. Overview and Rationale (The "Why")

The site is built from a shared set of interface building blocks: buttons, badges, text fields, selectable cards, download buttons, the FAQ accordion, dialogs, toast notifications, section layouts, icons and flags. Today the only way to see what one of them looks like in a given state is to find a real page that happens to use it in that state. For example, to see the email field's error look, you have to fill in the quiz, reach the plan gate and submit a bad address. Some states never appear on any page, like the outline badge or the destructive button. Nobody can see those states at all.

This makes design review slow. Visual regressions also go unnoticed: a style change for the quiz can quietly break the same block somewhere else. And when building something new, it's hard to know what already exists, so near-duplicates get made.

**Desired outcome:** one page that works like Storybook, inside the site itself. It shows every shared building block side by side in every state, with the site's real fonts, colors and spacing. A designer or developer can open it, scan it, and confirm that everything looks right.

**Success looks like:**
- Every building block in the shared library appears on the page, in every state it supports. Nothing has to be checked through a real flow.
- The page is reachable from the site navigation during local development. On the live site, only someone who knows the direct address can reach it, and it never appears in search results.

---

## 2. Functional Requirements (The "What")

### 2.1 Access and visibility

- While the site runs in local development, the site navigation has a link to the gallery page. On the live site, the page exists at a direct address but nothing links to it: no navigation, footer, sitemap or any other page. Search engines are told not to index it.
  - The page address is `/ui-kit/`.
  - **Acceptance Criteria:**
    - [ ] Given the site is running locally, when the user looks at the site navigation, then they see a link to the gallery and clicking it opens the gallery page.
    - [ ] Given the live site, when the user looks at the header, footer and every other page, then no link to the gallery appears anywhere.
    - [ ] Given the live site, when the user types the gallery's address directly into the browser, then the gallery page opens.
    - [ ] Given the live site, when the user opens the public sitemap, then the gallery address is not listed.
    - [ ] Given the live site, when a search engine reads the gallery page, then the page tells it not to index the page.

### 2.2 Page layout and navigation

- The page shows a list of all building-block groups, like Storybook's sidebar. Clicking a group name jumps to that group's section. Each section has the component's name, a one-line description of what it's for, and a labelled grid of all its states.
  - **Acceptance Criteria:**
    - [ ] When the user opens the gallery, then they see a list of every component group, and each name links to its own section on the page.
    - [ ] When the user clicks a group name in that list, then the page scrolls to that group's section.
    - [ ] When the user looks at any rendered example, then a short text label next to it names the state shown (for example "Outline · Large · Disabled").
    - [ ] Given a phone-width screen (375px wide), when the user opens the gallery, then all content fits the screen width without sideways scrolling, and the group list stays usable (collapsed into a menu or stacked above the content).
    - [ ] When the user compares a gallery example with the same building block on a real page (homepage, quiz), then the fonts, colors, corner radii and spacing match.

### 2.3 What is shown: every component in every state

All states of a component appear at the same time, side by side. Interactive blocks still respond when clicked, so their behavior can be tried by hand. Hover, keyboard-focus and pressed looks are visible when the user hovers, tabs to or presses the example. These looks are not shown as separate static examples.

Each bullet below is one group on the page, with the states that must appear.

- **Button:** the site has one button building block. The download buttons are made from it too. It keeps only the looks the site actually uses: a dark style, a red destructive style and a store style. The store style carries the Apple or Google Play icon to the right of its text. Its standard size and corners match today's download buttons (54px tall, softly rounded corners). The dark style has exactly the same colour as the store style; the store style only adds the icon. There are two sizes: standard, and a small rounded "pill" size for compact actions such as "Start" in the 7-day plan. Every other style and size (default, outline, secondary, ghost, link; small, large, icon-only, extra-large) is removed. The gallery shows every remaining style at every remaining size, a disabled example of each style, a button with an icon next to its text, and a button that works as a link.
  - **Acceptance Criteria:**
    - [ ] When the user views the Button group, then they see every remaining style crossed with every remaining size, each labelled, and no examples of removed styles or sizes.
    - [ ] When the user views the Button group, then they see a store button with the Apple icon and one with the Google Play icon, each with the icon to the right of its text.
    - [ ] When the user views the Button group, then they see one disabled example for each style, and it looks faded.
    - [ ] When the user clicks a disabled button example, then nothing happens and its look does not change.
    - [ ] When the user presses Tab to move onto any enabled button example, then a visible focus ring appears around it.
    - [ ] When the user compares a standard-size button in the gallery with the download buttons on the homepage, then they have the same height and corner rounding.

- **Buttons on real pages:** every button on the site uses the merged building block, so the main buttons share the download buttons' size and corners. This changes three places on purpose: the quiz's big black buttons and the waitlist popup's "Notify Me" button become 54px tall with the download buttons' corners (today they are a little taller and rounder), and the red "Delete account" button grows from 40px with small corners to the same 54px standard. Download buttons look and behave as they do today: same text, icons, layouts, Google Play link, waitlist dialog and click counting.
  - **Acceptance Criteria:**
    - [ ] When the user opens the homepage, then the "Join iOS Waitlist" and "Download for Android" buttons look and behave as before: same text, icon, size and colour, same waitlist dialog and Google Play link.
    - [ ] When the user goes through the quiz (start, answers, plan gate, results), then every main dark button has the standard 54px height, the download buttons' corner rounding and the same colour as the download buttons.
    - [ ] When the user views the 7-day plan on the quiz results, then each "Start" button is still the small rounded pill.
    - [ ] When the user opens the waitlist popup, then the "Notify Me" button has the standard 54px height and the download buttons' corner rounding.
    - [ ] When the user opens the delete-account page, then the red delete button is 54px tall with the download buttons' corner rounding.

- **Badge:** the site has one badge (small rounded "pill" label) building block, used for every pill on the site. It has a single look: one light-blue fill and dark brand-blue text. It comes in three sizes: small (blog post tags), medium (the "9 questions · about 2 minutes" pills, the quiz intro pill, "Your pattern" on quiz results) and large (the homepage "early access" pill). The badge shows whatever content is placed inside it, not only text. For example, the homepage pill puts its pulsing dot inside the badge before the words. The unused styles (blue, red destructive, outline) are removed. The gallery shows each size, plus a badge with a dot before its text.
  - **Acceptance Criteria:**
    - [ ] When the user views the Badge group, then they see three labelled badges (small, medium, large), all with the same light-blue fill and dark brand-blue text.
    - [ ] When the user views the Badge group, then they see a labelled example with a pulsing dot before its text.
    - [ ] When the user views the Badge group, then no blue, red or outline badge appears.
    - [ ] Given the user's device is set to reduce motion, when they view the dot example, then the dot does not pulse.

- **Badges on real pages:** every pill label on the site uses the merged badge, so all pills share one fill and text colour. This changes some places on purpose: blog post tags switch from mid-blue text to the dark brand-blue text, and the quiz intro pill uses the medium size, so its padding becomes slightly smaller. The pills that today use the two near-identical light-blue fills all end up with the one fill. The text stays the same everywhere.
  - **Acceptance Criteria:**
    - [ ] When the user opens the homepage, then the "early access" pill keeps its pulsing dot, size and text, with the badge fill and text colour.
    - [ ] When the user views blog post cards and a blog post page, then each tag pill is the small badge with dark brand-blue text.
    - [ ] When the user views the homepage quiz promo and the quiz teaser inside a blog post, then the "9 questions" pill is the medium badge and reads clearly on the dark background.
    - [ ] When the user opens the quiz start screen and later the results, then the intro pill and the "Your pattern" pill are the medium badge.
    - [ ] When the user compares any two pills of the same size on different pages, then they have the same fill, text colour, height and corner rounding.

- **Input:** the site has one input building block, used for every typed field (email, password, plain text). It has a single look: today's plain text-input look (40px tall, thin border, small corners), with one corner rounding everywhere. The type of field (email, password, text) is a setting of that one block, not a separate block. In the error state the field's border turns red, and the red message still appears under it. The file-picker version is removed. The separate email field, with its taller size, larger corners and bordered/borderless variants, is removed. The gallery shows the input empty with placeholder, filled, disabled, in error with its message, paired with its label, and as an email and a password field.
  - **Acceptance Criteria:**
    - [ ] When the user views the gallery's group list, then there is one "Input" group and no separate "Text input" or "Email field" group.
    - [ ] When the user views the Input group, then they see labelled examples for empty-with-placeholder, filled, disabled, error, with-label, email and password, all with the same height, border and corner rounding.
    - [ ] When the user views the Input group, then no file-picker example appears.
    - [ ] When the user clicks the label of the with-label example, then the cursor moves into its input.
    - [ ] When the user types into any enabled input example, then the typed text appears in that field.
    - [ ] When the user tries to type into the disabled example, then no text appears and the field looks faded.
    - [ ] When the user views the error example, then the field has a red border and a red error message appears under it.

- **Inputs on real pages:** every typed field on the site uses the merged input, so all fields share one look. This changes two places on purpose: the email field in the quiz plan gate and the email field in the waitlist popup become 40px tall with the small corners and thin border of the delete-account fields (today they are taller with larger corners, and the quiz one has no visible border). When the address is invalid, both fields also show the red border along with today's red message. The delete-account email and password fields keep their current look, plus the red border when their own error message shows.
  - **Acceptance Criteria:**
    - [ ] When the user reaches the quiz plan gate, then the email field is 40px tall with a thin border and the same small corners as the delete-account fields.
    - [ ] When the user opens the waitlist popup, then the email field is 40px tall with a thin border and the same small corners as the delete-account fields.
    - [ ] Given the user entered an invalid email in the quiz plan gate or the waitlist popup, when they submit, then the field's border turns red and the red error message appears under it, as before.
    - [ ] Given the delete-account page, when the user submits with an empty or invalid email or password, then that field's border turns red and its error message appears under it.
    - [ ] When the user types in any of these fields, then typing, autofill and the email keyboard on phones work as before.

- **Form item, label, description and message:** a field with a helper description, and the same field showing an error message.
  - **Acceptance Criteria:**
    - [ ] When the user views the Form group, then they see one field with a label and helper text, and one field with a label and a red error message under it.

- **Selectable card, checkbox and radio indicators:** the cards unselected and selected; left-aligned and centered; with no indicator, a checkbox indicator and a radio indicator; with and without a leading icon. The checkbox and radio indicators also appear on their own, checked and unchecked.
  - **Acceptance Criteria:**
    - [ ] When the user views the Selectable card group, then they see each indicator type (none, checkbox, radio) in both selected and unselected states, for both left and centered alignment, each labelled.
    - [ ] When the user views the Selectable card group, then they see at least one card with a leading icon.
    - [ ] When the user clicks an unselected example card, then it switches to its selected look, and clicking it again switches it back.
    - [ ] When the user views the indicators sub-section, then they see a checkbox and a radio, each in checked and unchecked state.

- **Download buttons:** both buttons in a row, both stacked in a column, iOS waitlist only, and Android only.
  - **Acceptance Criteria:**
    - [ ] When the user views the Download buttons group, then they see four labelled examples: row, column, iOS only, Android only.
    - [ ] When the user clicks the "Join iOS Waitlist" example, then nothing leaves the page and no waitlist sign-up happens.
    - [ ] When the user clicks the "Download for Android" example, then the Google Play page opens in a new tab and no click is counted in the site's analytics.

- **FAQ accordion:** a short list with the first item open and the rest closed.
  - **Acceptance Criteria:**
    - [ ] When the user views the FAQ accordion group, then the first question is open and the others are closed.
    - [ ] When the user clicks a closed question, then it opens with its answer, the arrow turns, and the previously open question closes.
    - [ ] When the user clicks the open question, then it closes and all questions are closed.

- **Dialog:** a button that opens a sample dialog with title, description, body and footer actions.
  - **Acceptance Criteria:**
    - [ ] When the user clicks "Open dialog" in the Dialog group, then a dialog appears over a dimmed page, with a title, description, body text and footer buttons.
    - [ ] Given the dialog is open, when the user presses Escape, clicks the close button or clicks the dimmed area, then the dialog closes.

- **Toast notifications:** buttons that each trigger one kind of toast: plain message, message with description, success, error, and one with an action button.
  - **Acceptance Criteria:**
    - [ ] When the user clicks each toast trigger button, then the matching toast appears on screen with the correct text and look.
    - [ ] When the user clicks the action button inside the action toast, then the toast closes.

- **Section and section heading:** the standard section with its default spacing, a section with custom vertical spacing, and the heading in its large and small sizes.
  - **Acceptance Criteria:**
    - [ ] When the user views the Section group, then they see the large section heading and the small block heading, each labelled.
    - [ ] When the user views the Section group, then they see a sample section with its default spacing and one with reduced spacing, with the section's edges shown by a tinted background or outline so the spacing is visible.

- **Scroll-reveal wrapper:** a sample block that fades in when scrolled into view.
  - **Acceptance Criteria:**
    - [ ] When the user scrolls the scroll-reveal example into view, then it animates in.
    - [ ] Given the user's device is set to reduce motion, when they scroll the example into view, then it appears without animation.
    - [ ] When the user clicks "Replay" next to the scroll-reveal example, then the animation plays again.

- **Icons and flags:** the check icon, the Apple and Google Play icons, and the 4 language flags (English, Spanish, Polish, Ukrainian), each at small, medium and large size.
  - **Acceptance Criteria:**
    - [ ] When the user views the Icons group, then they see the check, Apple and Google Play icons, each labelled.
    - [ ] When the user views the Flags group, then they see all 4 flags, each at three sizes and labelled with the language.

### 2.4 Keeping the gallery complete

- When a new building block is added to the shared library, or an existing one gets a new style or state, it must be added to the gallery as part of the same change.
  - **Acceptance Criteria:**
    - [ ] When the user compares the gallery's group list with the shared component library, then every building block in the library appears in the gallery.

---

## 3. Scope and Boundaries

### In-Scope

- One gallery page inside the site, laid out like Storybook, showing every shared building block in every supported state.
- Linked from the navigation only during local development. On the live site it can be reached by direct address, is never linked, and is excluded from search engines and the sitemap.
- Live interaction with the examples (clicking, typing, opening, closing). Gallery examples never trigger real effects (sign-ups, analytics events, emails).
- Layout that works on phone and desktop screens.

### Out-of-Scope

- Installing the separate Storybook tool, or any standalone viewer.
- Live controls or playgrounds for changing a component's text, style or size on the page.
- Automated visual-difference testing or screenshot comparison.
- Page-specific components outside the shared library (landing sections, quiz screens, legal page parts, popups, layout header/footer).
- Changing how any existing building block looks or behaves, **except** the Button, Input and Badge merges described in 2.3 (one button block, one input block and one badge block; unused styles, sizes and versions removed). Every other block is shown as it is.
- Password protection or sign-in for the gallery.
- All roadmap items, including **Dependency Pruning** (removing unused building blocks), **Stronger Build Checks**, **Ship the Sequence**, **Quiz Retention Verdict**, **Open the Exact Exercise**, **Calligraphy Meditation Pillar Page**, **Related Posts & Breadcrumbs**, **Polish & Ukrainian Quiz**, **Social Proof Decision** and **Complete Delete-Account Guidance**. These get their own specs.

---

## Change Log

- **2026-10-01: Button merge** (source: `/awos:implement` run paused at Slice 3; the gallery needed the store icons, which only existed inside the download buttons).
  - The Button group no longer shows 7 styles × 6 sizes (42 examples). There is now one button block with only the styles in use (dark, destructive, store with Apple/Google Play icon; sizes standard and pill). Its size and corners follow the download buttons. Unused styles and sizes are removed.
  - New requirement "Buttons on real pages": quiz, waitlist popup and delete-account buttons take on the standard size and corners. Download buttons stay unchanged for visitors.
  - Out-of-Scope now allows this one change to existing blocks.
  - Why: one consistent button look across the site, and the store icons can be reused in the gallery and elsewhere.
- **2026-10-01: Input merge** (source: user request "reduce the number of inputs, use one with props").
  - The "Text input and label" and "Email field" groups become one "Input" group. The site has one input block. The field type (email, password, text) is a setting on that block, not a separate block.
  - Its single look is the plain text-input look (40px, thin border, small corners), with one corner rounding. The email field's larger size and corners and its bordered/borderless variants are removed. The file-picker version is removed.
  - The error state now adds a red border on the field, in addition to the red message.
  - New requirement "Inputs on real pages": the quiz plan-gate and waitlist-popup email fields take on the standard look. Delete-account fields gain the red error border.
  - Out-of-Scope now allows this change as well.
  - Why: fewer near-duplicate blocks and one consistent field look across the site.
- **2026-10-01: Badge merge** (source: user request "badge should include all pill styles on the site; merge close styles into one component").
  - The Badge group no longer shows 4 unused styles. It now shows one badge with one light-blue fill and dark brand-blue text, in three sizes (small, medium, large), plus an example with a dot before the text. Blue, red and outline styles are removed.
  - The badge shows whatever content is placed inside it. The homepage "early access" pill's pulsing dot goes inside the badge.
  - New requirement "Badges on real pages": hero pill, blog tags, quiz promo and teaser pills, quiz intro and "Your pattern" all use the badge. Blog tags get the darker text. The quiz intro pill becomes medium size.
  - Why: six hand-made pills with near-identical colours become one reusable block.
