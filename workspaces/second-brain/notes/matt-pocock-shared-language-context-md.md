---
slug: matt-pocock-shared-language-context-md
title: 'Shared-language CONTEXT.md + ADRs (Pocock technique)'
type: note
status: durable
tags: [claude-code, context-engineering, ddd, knowledge-management, matt-pocock]
links: ["[[matt-pocock-skills-repo]]", "[[matt-pocock-grilling-and-feedback-loops]]", "[[claude-code-skill-authoring]]", "[[adopting-pocock-karpathy-in-workspace-os]]", "[[llm-wiki-pattern]]", "[[matt-pocock-ecosystem]]"]
source: null
confidence: high
created: '2026-06-09'
updated: '2026-06-09'
---
Matt Pocock applies Domain-Driven Design's **ubiquitous language** to agent work: a single `CONTEXT.md` glossary at the repo root defines the project's canonical terms so the agent and humans speak one language. He calls it "maybe the single coolest technique in this repo." The fix it targets is verbosity — an agent dropped into an unfamiliar codebase "uses 20 words where 1 will do" and guesses at jargon; a shared term collapses that to one canonical word.

## What the glossary is (and isn't)

- **Opinionated** — pick one canonical term, list rejected synonyms under an `_Avoid_:` block.
- **Tight** — 1-2 sentence definitions of what a term *is*, never what it does.
- **Glossary only** — "totally devoid of implementation details"; not a spec, not a scratchpad. General programming concepts are excluded.
- **Updated inline** — the moment a term is resolved, never batched; the file is created lazily on the first resolved term.

## How it gets built, and ADRs

The `/grill-with-docs` skill (see [[matt-pocock-grilling-and-feedback-loops]]) builds CONTEXT.md during a one-question-at-a-time interview: it challenges user terms that conflict with the glossary, sharpens fuzzy/overloaded words to one canonical term, and writes the result inline. Hard decisions that don't belong in a glossary become **Architecture Decision Records** — sequential `docs/adr/NNNN-slug.md`, often a single 1-3 sentence paragraph — offered *sparingly*, only when a decision is (1) hard to reverse, (2) surprising without context, and (3) the result of a real trade-off. Future reviews read the ADR instead of re-litigating.

## The materialization-cascade example

Pocock's BEFORE/AFTER: the phrase "a lesson inside a section is made real (given a spot in the file system)" collapses to the AFTER term **"the materialization cascade."** Payoff: variables, functions, and files get named consistently, the codebase becomes easier for the agent to navigate, and the agent spends **fewer thinking tokens** — naming and token-efficiency improve together.

## Mapping to this Workspace OS

This OS has a controlled-vocabulary problem that a glossary directly fixes: frontmatter `type`/`status` enums, kebab-case slugs, tags, and `[[wikilink]]` targets all drift toward synonyms. **Adopt directly** (the repo has none today): add a per-workspace `workspaces/<slug>/CONTEXT.md` defining load-bearing terms — note/source/decision/inbox/capture; raw/draft/durable/archived; item/link/tag; workspace; hub-note; derived index; wikilink. It becomes the authority for *which slug a concept resolves to*, feeds the Postgres `tags` controlled vocabulary, and is referenced from `capture`/`triage-inbox`/`distill-chat` so titles and frontmatter stay consistent. (Open question: per-workspace files vs a shared core glossary at repo root with per-workspace extensions.)

## See also

- [[matt-pocock-skills-repo]] — the source repo and its skill set
- [[matt-pocock-grilling-and-feedback-loops]] — `/grill-with-docs`, the builder
- [[claude-code-skill-authoring]] — house authoring standard the glossary feeds
- [[adopting-pocock-karpathy-in-workspace-os]] — ranked adoption plan (CONTEXT.md = #1)
- [[llm-wiki-pattern]] — the atomic + linked substrate a glossary keeps coherent
- [[matt-pocock-ecosystem]] — Pocock's wider work
