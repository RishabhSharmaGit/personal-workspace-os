---
slug: matt-pocock-skills-repo
title: 'Matt Pocock — "Skills For Real Engineers" repo'
type: note
status: durable
tags: [claude-code, agent-skills, knowledge-os, tooling, engineering-practice]
links: ["[[claude-code-ecosystem-landscape]]", "[[claude-code-skill-authoring]]", "[[matt-pocock-shared-language-context-md]]", "[[matt-pocock-grilling-and-feedback-loops]]", "[[matt-pocock-ecosystem]]", "[[adopting-pocock-karpathy-in-workspace-os]]", "[[llm-wiki-pattern]]"]
source: null
confidence: high
created: '2026-06-09'
updated: '2026-06-09'
---
`github.com/mattpocock/skills` ("Skills For Real Engineers") is a genuine Claude Code skills plugin: ~15 promoted Agent Skills, each a `SKILL.md` (+ optional bundled files), under three bucket folders, plus a `.claude-plugin/plugin.json` manifest and a root `CONTEXT.md` glossary. Tagline: "my agent skills that I use every day to do real engineering — not vibe coding." The format is a **1:1 fit** for this OS, which already uses `.claude/skills/<name>/SKILL.md`.

## The thesis: four failure modes, one fix each

AI accelerates classic engineering failures, so re-apply fundamentals (DDD ubiquitous language, Ousterhout deep modules, Beck/XP, TDD) rather than handing process to a framework:

- **Misalignment** ("the agent didn't do what I want") → **grilling**: `grill-me` / `grill-with-docs` interview you one question at a time, each with a recommended answer, exploring the codebase instead of asking when answerable. See [[matt-pocock-grilling-and-feedback-loops]].
- **Verbosity** ("20 words where 1 will do") → **shared language**: a `CONTEXT.md` ubiquitous-language glossary (opinionated canonical term + `_Avoid_` synonyms, no implementation detail). His "single coolest technique." See [[matt-pocock-shared-language-context-md]].
- **Broken code** → **feedback loops**: static types, TDD (`tdd`, vertical red-green-refactor), and a `diagnose` loop (build a fast deterministic repro first).
- **Ball-of-mud** (agents accelerate entropy) → **daily design care**: `improve-codebase-architecture` (deep-vs-shallow modules, deletion test), `zoom-out`, `to-prd`.

## Skill catalog by bucket

- **engineering/**: `grill-with-docs`, `tdd`, `diagnose`, `improve-codebase-architecture`, `zoom-out`, `to-prd`, `to-issues`, `triage`, `prototype`, `setup-matt-pocock-skills`.
- **productivity/**: `caveman` (output compression, claimed ~75% token cut), `grill-me`, `handoff` (context compaction), `teach`, `write-a-skill`.
- **misc/**: `git-guardrails-claude-code` (PreToolUse hook), `migrate-to-shoehorn`, `scaffold-exercises`, `setup-pre-commit`.

## Stance and distribution

Skills are explicitly **small, composable, model-agnostic, and NOT a process-owning framework** — positioned against GSD, BMAD, and Spec-Kit, which "take away your control and make bugs in the process hard to resolve." Each does one thing and they chain.

Distribution rides the open Agent Skills standard via the Vercel-Labs `npx skills` CLI (registry at `skills.sh`): `npx skills@latest add mattpocock/skills`, then run `/setup-matt-pocock-skills` to scaffold per-repo config. The `.claude-plugin/plugin.json` lists explicit skill paths so the repo doubles as a marketplace plugin. For private use here, the Skill tool already loads `.claude/skills/` directly, so the manifest is unnecessary.

## See also

- [[adopting-pocock-karpathy-in-workspace-os]] — what this OS actually adopts vs skips
- [[matt-pocock-ecosystem]] — Pocock's channels, TS packages (`ts-reset`, `shoehorn`)
- [[claude-code-skill-authoring]] — his `write-a-skill` description contract
- [[claude-code-ecosystem-landscape]]
- [[llm-wiki-pattern]]
