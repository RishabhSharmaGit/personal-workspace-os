---
slug: adopting-pocock-karpathy-in-workspace-os
title: 'Adopting Pocock & Karpathy in the Workspace OS (evaluation & plan)'
type: note
status: draft
tags: [adoption-plan, claude-code, skills, karpathy, second-brain-meta]
links: ["[[matt-pocock-skills-repo]]", "[[matt-pocock-shared-language-context-md]]", "[[matt-pocock-grilling-and-feedback-loops]]", "[[matt-pocock-ecosystem]]", "[[claude-code-skill-authoring]]", "[[karpathy-teaching-repos-and-courses]]", "[[karpathy-software-3-and-coinages]]", "[[llm-wiki-pattern]]", "[[claude-code-ecosystem-landscape]]", "[[context7-mcp-overview]]"]
source: null
confidence: high
created: '2026-06-09'
updated: '2026-06-09'
---
This is the centerpiece plan for what to pull from Matt Pocock's `mattpocock/skills` plugin and Andrej Karpathy's body of work into *this* repo — a local-first Claude Code knowledge OS with 7 skills (`capture`, `query`, `research`, `triage-inbox`, `weekly-review`, `distill-chat`, `index-rebuild`), a TypeScript/Bun `scripts/` layer with Vitest tests, hooks in `.claude/settings.json`, and Markdown-as-source-of-truth backed by a derived Postgres index. The format match is exact: Pocock's repo is itself a `.claude/skills/<name>/SKILL.md` plugin (see [[matt-pocock-skills-repo]]), so the question is *which* artifacts to adopt, not whether the mechanism works. Karpathy contributes philosophy and ingestion targets rather than installable tooling (see [[karpathy-software-3-and-coinages]], [[karpathy-teaching-repos-and-courses]]).

**The single biggest lever: there is no `CONTEXT.md` in this repo yet.** Pocock's ubiquitous-language glossary (see [[matt-pocock-shared-language-context-md]]) maps directly onto a knowledge OS that already has a controlled-vocabulary problem — frontmatter `type`/`status` enums, kebab-case slugs, tag drift, and `[[wikilink]]` resolution.

## Adoption matrix

| Artifact | Source | Recommendation | Effort | How |
|---|---|---|---|---|
| `CONTEXT.md` glossary (per workspace) | Pocock | **Adopt** | low | `workspaces/<slug>/CONTEXT.md`: opinionated canonical term + `_Avoid_:` synonym list + 1–2 sentence "what it IS", no implementation detail. Define this OS's terms (note/source/decision/inbox/capture; raw/draft/durable/archived; item/link/tag; hub-note; derived index; wikilink). Feeds the Postgres `tags` vocabulary. None exists today. |
| LLM OS framing | Karpathy | **Adopt** | low | Capture `notes/llm-os-pattern.md`: Claude Code = kernel, `workspaces/**/*.md` = filesystem, Postgres = embeddings/index peripheral, Skills+MCP = peripherals, context window = RAM. Nearly a literal description of this repo. Wikilink from [[llm-wiki-pattern]]. |
| Context engineering | Karpathy | **Adopt** | low | "Filling the context window with just the right information for the next step" — the exact rationale for the derived index + top-K retrieval. State it in `query`/`research` SKILL.md. |
| AI-provenance convention | Pocock + Karpathy | **Adopt** | low | `generated_by:` frontmatter field or `confidence: low` banner on auto-filed items. Backed independently by Pocock's AI-disclaimer and Karpathy's nanochat PR-disclosure norm. |
| `write-a-skill` + minimal-file rubric | Pocock + Karpathy | **Skip** (resolved) | low | One house authoring standard: 3rd-person description, sentence 1 = what / sentence 2 = "Use when [triggers]", <1024 chars, SKILL.md <100 lines, progressive disclosure. **Resolved 09-Jun-2026: kept `superpowers:writing-skills`; `write-a-skill` not installed** (see [[claude-code-skill-authoring]]). Keep the rubric as a reference. |
| Grilling micro-step | Pocock | **Adapt** | med | One-question-at-a-time, model proposes its answer, queries the index instead of asking when answerable. Fold into `capture`/`triage-inbox` when confidence ≠ high. Reconcile with `superpowers:brainstorming` (see [[matt-pocock-grilling-and-feedback-loops]]). |
| Declined/out-of-scope record | Pocock | **Adapt** | low–med | Store dismissed items as `status: archived` + `declined_reason`, queried before re-proposing so `triage-inbox` stops re-surfacing them. Borrow the idea, not the full bug/enhancement state machine. |
| `@total-typescript/ts-reset` | Pocock | **Adopt** | low | `npm i -D`; makes `JSON.parse`/`fetch().json()` return `unknown`, forcing Zod validation on frontmatter/Supabase/firecrawl parsing. **Scripts only — it mutates global scope, never a published lib** (see [[matt-pocock-ecosystem]]). |
| `ts-error-translator` extension | Pocock | **Adopt** | low | Editor-only QoL for `scripts/`. No repo change. |
| `shoehorn` in Vitest | Pocock | **Adapt** | low | `fromPartial()` for minimal fake `item` rows in tests, only where partial fixtures are needed. |
| Karpathy YouTube + Bear-blog ingestion | Karpathy | **Adapt** | med | Wire YouTube RSS (`channel_id=UCXUPKJO5MZQN11PqgIvyuvQ`) + `karpathy.bearblog.dev/feed/` via `loop`/Cron + `firecrawl_monitor`, diffing last-seen IDs in Postgres. Materialize `notes/karpathy.md` hub note (anchor satisfying triage rule #2). |
| `handoff` → tracked archive | Pocock | **Adapt** | med | Add the skill but **override save location**: write to `archive/handoffs/YYYY-MM-DD-<focus>.md` with standard frontmatter so it flows through the PostToolUse indexer, not OS temp. Complements the Stop hook. |
| `caveman` compression mode | Pocock | **Adapt** | low–med | Add the skill but **extend the Auto-Clarity Exception** to never compress slugs, frontmatter keys/values, `[FILL — DD-MMM-YYYY]` cues, or `index-rebuild` confirmations. (~75% figure is the author's unverified claim.) |
| PreToolUse guardrail hook | Pocock | **Adapt** | med | Guard `index-rebuild` (wipes derived tables) and `supabase db reset` behind confirmation. **Shipped script is bash+jq — rewrite as PowerShell/Node** (this is a win32 env). |
| Single complexity dial (`--depth`) | Karpathy | **Adapt** | low | Expose ONE `effort`/`depth` knob per skill that auto-derives fan-out/source-count/synthesis length. The `research` 5-iteration loop already implies this. |
| Karpathy curriculum + explainers | Karpathy | **Reference** | low | Capture micrograd→nanochat + "How I use LLMs" as `type: source` + a `karpathy-llm-curriculum` hub. Conceptual grounding, not tooling (see [[karpathy-teaching-repos-and-courses]]). |
| Software 2.0/3.0 + vibe-coding notes | Karpathy | **Reference** | low | Atomic notes in the 1.0/2.0/3.0 chain. **Record explicitly** that this OS's auditable-state discipline is the deliberate *opposite* of vibe coding (accept-all, don't read diffs) so the term isn't misapplied. |
| `.claude-plugin/plugin.json` + bucket folders | Pocock | **Reference** | low | Only needed to *publish* skills to a marketplace. The Skill tool loads `.claude/skills/` directly; unnecessary for private use. |
| `teach` skill | Pocock | **Reference** | med | Do NOT install — hijacks cwd, emits HTML, conflicts with Markdown-as-truth. Mine ideas: ADR-like numbered learning-records, "never trust parametric knowledge → RESOURCES.md", `*-FORMAT.md` note templating. |
| `setup-matt-pocock-skills` | Pocock | **Reference** | low | Tracker/label machinery is irrelevant; borrow only the *pattern* — a run-once `disable-model-invocation: true` slash command that scaffolds per-repo config — if a `setup-workspace` skill is ever built. |
| `to-prd`/`to-issues`/`triage` GitHub plumbing | Pocock | **Skip** | low | The repo's tracker is its markdown `inbox/notes/decisions`, not GitHub Issues. Keep only HITL/AFK slicing + "no stale paths in artifacts" as note-writing principles. |
| `tdd`/`diagnose`/`improve-codebase-architecture`/`prototype` | Pocock | **Skip** | low | App-code-engineering skills; add noise to the Skill menu. Revisit `tdd` only if `scripts/` grows into serious app dev (it already has Vitest). |
| `setup-pre-commit` (Husky/lint-staged) | Pocock | **Skip** | low | Durable content is Markdown+YAML, not a JS app. PostToolUse indexer + frontmatter Zod validation already provide the guarantees. |
| `migrate-to-shoehorn` / `scaffold-exercises` | Pocock | **Skip** | low | TS-package/course-specific. |
| X/Twitter automated ingestion | Karpathy | **Skip** | low | No RSS, login-gated. Capture on-demand when a link is pasted. |
| llm.c `dev/cuda` kernels as tooling | Karpathy | **Skip** | low | No reuse mechanism in markdown+Postgres. Keep as study notes only. |

## Ranked by value/effort

1. **`CONTEXT.md` per workspace** (adopt, low, highest leverage) — start with `second-brain` + `career-os`.
2. **LLM OS + context-engineering framing** (adopt, low) — two notes + references from CLAUDE.md/`query`/`research`.
3. **AI-provenance convention** (adopt, low) — double-sourced.
4. **One house authoring standard** — RESOLVED (09-Jun-2026): kept `superpowers:writing-skills`; `write-a-skill` not installed.
5. **Grilling micro-step in confidence gate** (adapt, med).
6. **Declined-reason record** (adapt, low–med).
7. **`ts-reset` in `scripts/` + `ts-error-translator`** (adopt, low).
8. **Karpathy ingestion + `karpathy.md` hub** (adapt, med).
9. **`handoff` → `archive/handoffs/`** (adapt, med).
10. **`caveman` with extended safety exception** (adapt, low–med).
11. **PreToolUse guardrail (bash→PowerShell/Node)** (adapt, med).
12. **`shoehorn` in tests** (adapt, low).

## Open questions to resolve first

- **Authoring-guide collision** — ✅ RESOLVED (09-Jun-2026): kept `superpowers:writing-skills` as the single canonical authoring guide; Pocock's `write-a-skill` evaluated and **not installed**.
- **Grilling overlap** — does `superpowers:brainstorming` already cover pre-work alignment, and how do the two avoid double-prompting?
- **`ts-reset` boundary** — confirm `scripts/` is never extracted into a published lib (global-scope mutation), and verify `ts-reset` v0.6.1 / `shoehorn` v0.1.2 against the current tsconfig target.
- **Windows hook runtime** — every borrowed hook must be rewritten in PowerShell/Node; Pocock's are bash+jq.
- **CONTEXT.md scope** — per-workspace vs a shared core at repo root; `career-os` already has `private/_CONVENTIONS.md` that may overlap.
- **Provenance mechanism** — `generated_by:` frontmatter (needs Zod schema + Postgres migration) vs a lighter body-banner (no schema change).

## Next steps

1. Write `workspaces/second-brain/CONTEXT.md` (glossary of the load-bearing terms above), reference it from CLAUDE.md and the `capture`/`triage-inbox`/`distill-chat` skills.
2. Capture `notes/llm-os-pattern.md`, `notes/context-engineering.md`, and `notes/karpathy.md` (hub); wikilink from [[llm-wiki-pattern]].
3. Decide the single authoring standard, then audit existing SKILL.md descriptions against it.
4. Add `@total-typescript/ts-reset` to `scripts/` and install the `ts-error-translator` extension.
5. Prototype the PreToolUse guardrail for `index-rebuild` as a PowerShell/Node hook in `.claude/settings.json`.

## See also

- [[matt-pocock-skills-repo]] — the source plugin, install mechanism, and skill inventory
- [[matt-pocock-shared-language-context-md]] — the CONTEXT.md glossary technique in detail
- [[matt-pocock-grilling-and-feedback-loops]] — grilling, TDD, feedback-loop discipline
- [[matt-pocock-ecosystem]] — TS packages (ts-reset, shoehorn, ts-error-translator) and channels
- [[claude-code-skill-authoring]] — the write-a-skill contract vs superpowers:writing-skills
- [[karpathy-software-3-and-coinages]] — LLM OS, context engineering, Software 2.0/3.0, vibe coding
- [[karpathy-teaching-repos-and-courses]] — curriculum and explainers as study sources
- [[llm-wiki-pattern]] — the Karpathy-style wiki pattern this OS already embodies
- [[claude-code-ecosystem-landscape]] — broader plugin/skill landscape this fits into
- [[context7-mcp-overview]] — adjacent MCP-based context-injection approach
