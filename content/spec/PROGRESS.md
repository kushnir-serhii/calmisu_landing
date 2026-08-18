# Migration Progress

Resume point for a fresh session. Read this, then `README.md`, then `00-conventions.md`.

## Status

| Wave | Task | Status |
|---|---|---|
| 0 | task-01 scaffold | ✅ **done**, committed `c6609bb` |
| 1 | task-02 landing | ⬜ not started |
| 1 | task-03 legal pages | ⬜ not started |
| 1 | task-04 delete-account + 404 | ⬜ not started |
| 1 | task-05 articles + sitemap | ⬜ not started |
| 2 | task-06 integration | ⬜ not started |

Working tree clean at `c6609bb`. Branch: `alma-terms-privacy_delete-account`.

## Current state of the repo

Astro 5.18.2 is scaffolded and building. `src/layouts/BaseLayout.astro` and `astro.config.mjs` exist. The Vite entrypoint (`index.html`, `vite.config.ts`, `src/main.tsx`) is deleted.

**The site currently builds 0 pages.** That's expected — task-02 restores `/`. The old `src/App.tsx` and `src/pages/*.tsx` still exist but are unreferenced; task-06 deletes them.

Wave 0's findings (version pins, tsconfig choices, the `CTASection` `ImageMetadata` bug, the broken `vitest.config.ts`) are all recorded in `00-conventions.md` under "Wave 0 outcome" and assigned to the tasks that own them.

## Next step: run Wave 1

Four tasks, disjoint file ownership, safe to run in parallel:

| Task file | Agent |
|---|---|
| `task-02-landing.md` | `react-islands` |
| `task-03-legal-pages.md` | `react-islands` |
| `task-04-delete-account-404.md` | `react-islands` |
| `task-05-articles-seo.md` | `content-seo` |

### Build contention — important

The four agents share one working tree. Their *edits* don't collide (ownership is disjoint), but their *verification* steps do: one `dist/`, one dev-server port, one `.astro/` type cache.

Give each agent a unique port and an isolated build dir:

```
task-02:  astro dev --port 4322    astro build --outDir dist-verify-02
task-03:  astro dev --port 4323    astro build --outDir dist-verify-03
task-04:  astro dev --port 4324    astro build --outDir dist-verify-04
task-05:  astro dev --port 4325    astro build --outDir dist-verify-05
```

Tell them to clean up their `dist-verify-*` dir when done and to leave the shared `dist/` alone. (`--outDir` is a supported `astro build` flag — verified.)

Also: **no agent commits.** Leave everything in the working tree for review after the wave.

## Then

Wave 2 (`task-06-integration.md`, agent `astro-architect`) — run alone, after all four Wave 1 tasks land and their reports are reviewed.

## Note on agent names

`.claude/agents/` is read at session start. The four agents were created mid-session, so in the session that ran Wave 0 they weren't registered and Wave 0 ran as `general-purpose` with the role definition inlined.

**In a fresh session they should resolve by name** — try `react-islands` / `content-seo` / `astro-architect` directly. If they still aren't found, fall back to `general-purpose` and tell the agent to read its definition from `.claude/agents/<name>.md` first.

Models are set in each definition's frontmatter: `astro-architect` = opus (irreversible calls), the other three = sonnet.
