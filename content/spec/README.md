# Astro Migration — Execution Spec

Migration of the Calmisu marketing site from **Vite + React SPA (react-router-dom)** to **Astro**, staying on GitHub Pages at `calmisu.com`.

## Why

1. **SEO / indexing** — today every route serves the same `index.html` with one static `<title>`/OG block. Non-`/` routes only work via a `404.html` redirect hack (GH Pages can't do server-side rewrites). Astro emits real static HTML per route with per-page meta.
2. **Articles** — the actual goal. Astro Content Collections give a first-class markdown article system with per-article metadata, which the SPA never had.

## How to run this spec

Each `task-NN-*.md` file is a **self-contained agent prompt**. Paste it (or hand it to the named agent) as the full task.

Agents are defined in [`.claude/agents/`](../../.claude/agents/) — see [`agents-roster.md`](./agents-roster.md).

### Wave map

Tasks within a wave touch **disjoint file sets** and are safe to run in parallel. Waves are strictly sequential.

```
WAVE 0  (blocking — must fully land before Wave 1)
  └── task-01-scaffold.md ................ astro-architect

WAVE 1  (4 agents in parallel)
  ├── task-02-landing.md ................. react-islands
  ├── task-03-legal-pages.md ............. react-islands
  ├── task-04-delete-account-404.md ...... react-islands
  └── task-05-articles-seo.md ............ content-seo (+ tailwind-stylist for prose)

WAVE 2  (blocking — after all of Wave 1)
  └── task-06-integration.md ............. astro-architect
```

### Why the waves are shaped this way

- **Wave 0 is blocking** because every Wave 1 task imports `src/layouts/BaseLayout.astro` and needs `astro.config.mjs` to exist to build anything.
- **Wave 1 is additive only.** No Wave 1 task deletes a `src/` file that another might still import. All `src/pages/*.tsx` + `src/App.tsx` deletions are deferred to Wave 2 so the tree never breaks mid-wave.
- **Wave 2 is blocking** because it does the destructive cleanup, the env-var rename, and the final build verification — it needs every route to already exist.

### File ownership (conflict avoidance)

Exactly one task owns each file. Do not edit a file you don't own.

| File / dir | Owner |
|---|---|
| `package.json`, `astro.config.mjs`, `tsconfig*.json`, `tailwind.config.ts` | task-01 (scripts/deps also touched in task-06) |
| `src/layouts/BaseLayout.astro`, `src/env.d.ts` | task-01 |
| `src/pages/index.astro`, `src/components/AnimatedSection.tsx` | task-02 |
| `src/pages/[lang]/*.astro`, `src/components/ui/LanguageSwitcher.tsx` | task-03 |
| `src/pages/delete-account.astro`, `src/pages/404.astro`, `src/components/DeleteAccountIsland.tsx`, `src/lib/api.ts` | task-04 |
| `src/content/**`, `src/pages/articles/**`, `public/robots.txt` | task-05 |
| `src/components/popups/NotifyMe.tsx`, `.github/workflows/deploy.yml`, `src/data/navLinks.ts`, all `src/pages/*.tsx` + `src/App.tsx` deletions | task-06 |

**Read-only for everyone in Wave 1:** the 8 landing components (`Header`, `HeroSection`, `FeaturesFlow`, `FeaturesScience`, `ChatSection`, `FAQSection`, `CTASection`, `Footer`), `src/components/privacy/*`, `src/components/terms/*`, `src/index.css`, `src/components/ui/*` (except `LanguageSwitcher.tsx`).

### Cross-task contract

`LanguageSwitcher` is edited by task-03 but consumed by task-04. Its new signature is frozen in [`00-conventions.md`](./00-conventions.md#languageswitcher-contract) — both tasks code against it.

## Files

| File | Purpose |
|---|---|
| [`PROGRESS.md`](./PROGRESS.md) | **Where the migration currently stands.** Start here when resuming. |
| [`00-conventions.md`](./00-conventions.md) | Shared repo facts, invariants, and contracts. **Every agent reads this first.** |
| [`agents-roster.md`](./agents-roster.md) | Which agent does what, and why |
| `task-01`…`task-06` | The executable task prompts |

## Out of scope (deliberately)

- Pruning the 51 `src/components/ui/` shadcn primitives and unused deps (`recharts`, `embla-carousel-react`, `cmdk`, `vaul`, `input-otp`, `next-themes`, `react-day-picker`). Separate follow-up PR after the migration is stable.
- `vitest.config.ts` / `src/test/example.test.ts` — only a placeholder test exists; decide separately.
- `bun.lock` vs npm — CI uses `npm ci`; leave as-is.
- `public/alma/**` — an unrelated static microsite for a different app. **Never touch.**
