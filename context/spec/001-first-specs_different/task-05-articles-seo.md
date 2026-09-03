# Task 05 — Content Collections, articles, and sitemap

**Wave:** 1 (parallel with tasks 02, 03, 04)
**Agent:** `content-seo` (pair with `tailwind-stylist` for the `prose` typography)
**Repo:** `c:\Users\serg9\Documents\GitHub\calmisu_landing`
**Depends on:** task-01 (`BaseLayout.astro` + `@astrojs/sitemap` configured)

> Read `content/spec/00-conventions.md` first — especially the `BaseLayout` prop contract.

## Goal

**This is the reason the migration is happening.** Stand up the article system: a typed Content Collection, a listing page, an article template with per-article SEO metadata, and a sitemap.

Everything else in this migration is porting what already exists. This task adds the capability the SPA never had.

## Files you own

**Create:** `src/content/config.ts`, `src/content/articles/*.md`, `src/pages/articles/index.astro`, `src/pages/articles/[...slug].astro`
**Modify:** `public/robots.txt`
**Do NOT touch:** `Header.tsx`, `Footer.tsx`, `src/data/navLinks.ts` — the "Articles" nav link is added in **task-06** to avoid colliding with task-02, which is mounting those same components right now.

## Steps

### 1. `src/content/config.ts`

```ts
import { defineCollection, z } from "astro:content";

const articles = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    image: z.string().optional(),        // root-relative, e.g. /images/foo.png
    imageAlt: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles };
```

`description` is deliberately **required** — it becomes the meta description and the OG description. An article without one is an SEO dead weight, so let the schema fail the build.

### 2. Seed articles

Write **two** real, publishable `.md` files in `src/content/articles/` — not lorem ipsum. Calmisu is an anxiety-relief app (guided breathing, calming sounds, grounding techniques), so pick genuinely on-topic, search-relevant subjects, e.g.:

- `box-breathing-for-anxiety.md`
- `grounding-techniques-for-panic-attacks.md`

Each needs complete frontmatter matching the schema. Keep the tone consistent with the existing site copy (calm, plain, non-clinical).

**Health-content caution:** this is wellness content, not medical advice. Don't write anything that reads as diagnosis or treatment claims. A brief "not a substitute for professional care" line is appropriate.

Mark one `draft: true` to prove draft filtering works, or add a third throwaway draft for that purpose.

### 3. `src/pages/articles/index.astro`

- `getCollection("articles", ({ data }) => !data.draft)`
- Sort by `pubDate` descending
- Card per article: title, description, formatted date, tags; whole card links to the article
- `BaseLayout` with its own title/description, e.g. `Articles — Calmisu` / a description about anxiety-relief guidance
- Handle the empty state gracefully (won't trigger with seeds, but don't crash)

### 4. `src/pages/articles/[...slug].astro`

```ts
export async function getStaticPaths() {
  const entries = await getCollection("articles", ({ data }) => !data.draft);
  return entries.map((entry) => ({ params: { slug: entry.slug }, props: { entry } }));
}
```

Then `const { Content } = await entry.render();`

**Per-article SEO — the actual payoff.** Pass to `BaseLayout`:
- `title` = article title (consider a `— Calmisu` suffix; be consistent with the listing page)
- `description` = article description
- `ogImage` = `entry.data.image` if set, else the site default
- `ogType="article"`
- `canonicalUrl` = the article's own URL

Plus article-specific tags in the page: `<meta property="article:published_time" content={pubDate.toISOString()} />` and `article:modified_time` when `updatedDate` exists.

Strongly recommended: **`BlogPosting` JSON-LD** structured data (`headline`, `description`, `datePublished`, `dateModified`, `image`, `author`/`publisher` = Calmisu). This is what earns rich results in Google. Add it as a `<script type="application/ld+json">`.

Render a visible `<time datetime={...}>` for the publish date, and the tags.

### 5. Typography (`tailwind-stylist`)

`@tailwindcss/typography` is already a devDependency but **completely unused today** — this is where it finally earns its place.

- Confirm the plugin is registered in `tailwind.config.ts` (task-01 owns that file — if it's missing, **report it**, don't edit).
- Wrap `<Content />` in a `prose` container.
- Tune `prose` to the site's design tokens: the theme uses HSL CSS vars (`--foreground`, `--muted-foreground`, `--brand-blue`) and `font-display` (Orienta) / `font-body` (Roboto). Article headings should read as the same brand as the landing page, not as default Tailwind prose.
- Constrain measure (`max-w-prose` or `prose-lg` with a wrapper) — long-form body text at full landing-page width is unreadable.
- Verify `prose` doesn't fight the global styles in `src/index.css`.

### 6. `public/robots.txt`

Append the sitemap reference (keep the existing user-agent allow rules):
```
Sitemap: https://calmisu.com/sitemap-index.xml
```
`@astrojs/sitemap` (configured in task-01) emits `sitemap-index.xml` + `sitemap-0.xml` at build. The site currently has **no sitemap at all**, so this is a real gain.

## Done criteria

- [ ] `npm run build` succeeds and emits `dist/articles/index.html`, one directory per non-draft article, `dist/sitemap-index.xml`, and `dist/sitemap-0.xml`.
- [ ] Draft articles are absent from both the listing and the built output.
- [ ] Each article's view-source shows its **own unique** `<title>`, meta description, and `og:image` — verify two different articles differ. (This is the core SEO deliverable; check it explicitly.)
- [ ] JSON-LD validates (paste into Google's Rich Results Test, or at minimum confirm it's syntactically valid JSON).
- [ ] `sitemap-0.xml` lists the article URLs.
- [ ] Article body renders with brand typography, readable measure, working links/lists/headings.
- [ ] Deliberately break an article's frontmatter (remove `description`) and confirm the **build fails** with a schema error — then restore it. Proves the schema is enforced.
- [ ] `Header.tsx` / `Footer.tsx` / `navLinks.ts` untouched.

## Report back

- The two article slugs you created, so task-06 can wire up nav links.
- Whether `@tailwindcss/typography` was correctly registered in `tailwind.config.ts`.
- Any `prose`-vs-`index.css` conflicts you had to work around.
- Suggested nav label + placement for task-06 ("Articles" vs "Blog").
