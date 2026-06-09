---
slug: claude-code-skill-authoring
title: 'Claude Code skill authoring — SKILL.md standard & progressive disclosure'
type: note
status: durable
tags: [claude-code, agent-skills, skill-authoring, matt-pocock, second-brain-meta]
links: ["[[matt-pocock-skills-repo]]", "[[claude-code-ecosystem-landscape]]", "[[matt-pocock-shared-language-context-md]]", "[[matt-pocock-grilling-and-feedback-loops]]", "[[adopting-pocock-karpathy-in-workspace-os]]", "[[llm-wiki-pattern]]", "[[karpathy-software-3-and-coinages]]"]
source: null
confidence: high
created: '2026-06-09'
updated: '2026-06-09'
---
An Agent Skill is a folder holding a `SKILL.md` whose YAML frontmatter requires only **`name`** and **`description`**, plus optional bundled scripts/references/assets. The format was created by Anthropic, released as an open standard (docs at `agentskills.io`), and is now read by 70+ agents — the same `SKILL.md` installs unchanged into Claude Code, Codex, Cursor, and others. This repo already authors exactly this shape under `.claude/skills/<name>/SKILL.md` (capture, query, research, triage-inbox, weekly-review, distill-chat, index-rebuild).

## The description contract — the only thing the model sees when choosing

Matt Pocock's `/write-a-skill` codifies the description as a trigger: **third person**, **sentence 1 = what it does**, **sentence 2 = "Use when [specific triggers/keywords/file types]"**, **max 1024 chars**. This is the entire surface the agent reasons over at selection time, so vague descriptions cause mis-selection. This repo's skill descriptions already follow it ("Use when user says 'save this'…").

## Progressive disclosure — three load stages

**Discovery** loads only name+description at startup; **activation** reads the full `SKILL.md` on match; **execution** loads bundled files on demand. The authoring rules that follow from this: keep **`SKILL.md` under ~100 lines**, **split overflow into `REFERENCE.md`/`EXAMPLES.md`** (references one level deep only), and **add `scripts/` for deterministic/repeated operations** (saves tokens, improves reliability). For this repo, that means heavy DB/frontmatter detail belongs in a sibling reference file, and the `bun run` scripts under `scripts/` are the deterministic-op layer.

## Bucket organisation + manifest discipline (publishing only)

Pocock groups promoted skills into `engineering/`, `productivity/`, `misc/` buckets, and enforces that every promoted skill appears in both the top-level `README.md` and `.claude-plugin/plugin.json` (a `name` + explicit `skills` path array). That manifest + README discipline is needed only to **publish** via `npx skills add mattpocock/skills` to a marketplace — the Claude Code Skill tool loads `.claude/skills/` directly, so it is reference-only here unless distribution becomes a goal.

## Scaffolding new skills

`/write-a-skill` runs gather-requirements → draft (`SKILL.md` + optional refs + scripts) → review against a checklist (triggers present, <100 lines, no time-sensitive info, consistent terminology, refs one level deep). **Resolved (09-Jun-2026):** this repo keeps `superpowers:writing-skills` as its single canonical authoring guide; Pocock's `write-a-skill` was evaluated and **not installed** to avoid two competing standards in the Skill menu. The checklist above is still a useful reference for what a good `SKILL.md` looks like.

## See also

- [[matt-pocock-skills-repo]] — the source repo and full skill catalogue
- [[matt-pocock-shared-language-context-md]] — `CONTEXT.md` glossary that keeps skill naming consistent
- [[matt-pocock-grilling-and-feedback-loops]] — `/grill-me` discipline foldable into capture/triage
- [[adopting-pocock-karpathy-in-workspace-os]] — the ranked adoption plan for this repo
- [[claude-code-ecosystem-landscape]] — where skills sit in the wider ecosystem
- [[llm-wiki-pattern]] — how this repo's skills serve the LLM-wiki
- [[karpathy-software-3-and-coinages]] — SKILL.md as a natural-language "Software 3.0" program
