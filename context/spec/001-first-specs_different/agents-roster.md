# Agent Roster

Four specialist agents, defined in [`.claude/agents/`](../../.claude/agents/). They're real Claude Code subagents — invocable by name via the Agent tool, and committed to the repo so they persist across sessions.

| Agent | Owns | Tasks |
|---|---|---|
| [`astro-architect`](../../.claude/agents/astro-architect.md) | Project config, build pipeline, routing structure, deploy, cross-cutting cleanup | **01**, **06** |
| [`react-islands`](../../.claude/agents/react-islands.md) | Porting React components to Astro islands, hydration directives, provider scoping, router removal | **02**, **03**, **04** |
| [`content-seo`](../../.claude/agents/content-seo.md) | Content collections, article authoring, meta/OG tags, JSON-LD, sitemap | **05** |
| [`tailwind-stylist`](../../.claude/agents/tailwind-stylist.md) | Design-token consistency, `prose` typography, visual-parity review | supports **05** (prose), reviews **02** |

## Why this split

**`astro-architect` bookends the migration.** Tasks 01 and 06 are the two blocking waves — foundation and cleanup. Both are whole-tree, config-heavy, and build-verification-driven. Same skill set, and giving them to one agent means the agent that set up the config is the one that verifies the final output against it.

**`react-islands` gets all three porting tasks** because they share one hard-won judgement: *when does a component actually need `client:*`, and what breaks when you nest islands wrong*. Tasks 02/03/04 are parallel-safe (disjoint files) but benefit from identical instincts. The nesting trap in particular — passing a React component as a child from `.astro` into a hydrated island silently kills its interactivity — is the single most likely way this migration ships something subtly broken, so it's baked into that agent's definition.

**`content-seo` is separate** because task-05 is the only task that *adds capability* rather than porting existing behavior. It also needs judgement the others don't: frontmatter schema design, structured data, and writing publishable health-adjacent copy responsibly.

**`tailwind-stylist` is a supporting specialist, not a task owner.** Styling in this migration is mostly "carry it over unchanged" — the real styling work is exactly two things: tuning `@tailwindcss/typography` for articles (task-05, where the plugin finally gets used after sitting unused as a devDependency), and verifying visual parity after the landing port (task-02). Making it own a whole task would be padding.

## Running them

Wave 1's four tasks are the parallel opportunity. Launch them together, each with its task file as the prompt:

```
Agent(subagent_type="react-islands", prompt=<contents of task-02-landing.md>)
Agent(subagent_type="react-islands", prompt=<contents of task-03-legal-pages.md>)
Agent(subagent_type="react-islands", prompt=<contents of task-04-delete-account-404.md>)
Agent(subagent_type="content-seo",   prompt=<contents of task-05-articles-seo.md>)
```

Tasks 01 and 06 run alone — 01 blocks everything, 06 needs everything.

Each task file is self-contained, but every agent is told to read [`00-conventions.md`](./00-conventions.md) first for the shared repo facts and the two cross-task contracts (`BaseLayout` props, `LanguageSwitcher` signature).

## Guardrails baked into every agent

- **Stay in your lane** — edit only files your task owns; report rather than reach across
- **Verify, don't assume** — a green build isn't proof; exercise the actual behavior
- **Parity before improvement** — port verbatim, don't refactor mid-migration
- **Preserve URLs** — existing paths may be indexed
- **Never touch `public/alma/`** — unrelated microsite for a different app
