---
slug: matt-pocock-ecosystem
title: 'Matt Pocock ecosystem — Total TypeScript, AI Hero, packages'
type: note
status: durable
tags: [matt-pocock, typescript, ai-engineering, tooling, education]
links: ["[[matt-pocock-skills-repo]]", "[[claude-code-ecosystem-landscape]]", "[[llm-efficiency-knowledge-tools]]", "[[ai-agent-tools-landscape]]"]
source: null
confidence: medium
created: '2026-06-09'
updated: '2026-06-09'
---
Matt Pocock (@mattpocockuk; ex-Vercel DevRel, ex-XState core team) runs two education brands and authors a small cluster of TypeScript tooling. His [[matt-pocock-skills-repo|Claude Code skills repo]] is the directly adoptable artifact; this note maps the surrounding ecosystem and flags which pieces touch *this* repo's TS `scripts/` layer versus which are reference-only.

## Education brands

- **Total TypeScript** (https://totaltypescript.com) — exercise-driven, self-paced TS workshops, "the industry standard course for learning TS." Hosts free written guides incl. "How To Create An NPM Package" (TS + Prettier + Vitest + GitHub Actions + Changesets baseline).
- **AI Hero** (https://aihero.dev) — his AI-engineering brand: free tutorials (LLM Fundamentals, MCP Tutorial, AI SDK crash course) plus the "Developers Becoming AI Heroes" / "Skills" **newsletter** (cited ~60k in the skills repo, "over 70,000" on aihero.dev — his own figures, inconsistent). Thesis: "bad code is the most expensive it's ever been"; agents accelerate software entropy unless you invest in design + feedback loops + shared language.
- **YouTube** (@mattpocockuk) — TypeScript and AI-engineering tutorials. Explicitly anti-vibe-coding: "We don't do vibe coding — this is a channel for real engineers solving real problems." Recent content centers on Claude Code skills.

## Packages he authors

- **`@total-typescript/ts-reset`** (v0.6.1, zero-dep) — a "CSS reset for TypeScript." Makes `JSON.parse` and `fetch().json()` return `unknown` instead of `any`, narrows `.filter(Boolean)`, widens `array.includes`. **Relevant to repo `scripts/`**: forces explicit Zod validation when parsing YAML frontmatter, Supabase rows, and firecrawl responses. App-code only — it mutates global scope, so never apply it to a published lib.
- **`@total-typescript/shoehorn`** (v0.1.2, zero-dep) — test helper: `fromPartial()` / `fromAny()` / `fromExact()` pass partial data into tests without `as` casts. **Relevant to repo Vitest tests** for building minimal fake `item` rows (slug/title/frontmatter).
- **`ts-error-translator`** (VSCode extension `mattpocock.ts-error-translator`, ~2.5k stars; Neovim port exists) — translates cryptic TS compiler errors into plain English inline. **Editor-only QoL**, no repo change.

Both npm packages were last published ~2 years ago (stable, not abandoned) — confirm TS-version compatibility before adopting.

## See also

- [[matt-pocock-skills-repo]] — the Claude Code skills plugin (the directly adoptable artifact)
- [[claude-code-ecosystem-landscape]] — where his skills plugin sits among other Claude Code tooling
- [[llm-efficiency-knowledge-tools]] — token/context tooling his AI-engineering work overlaps
- [[ai-agent-tools-landscape]] — broader agent-tooling context
