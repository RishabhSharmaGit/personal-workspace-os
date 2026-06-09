---
slug: 2026-06-09-pocock-karpathy-skills-and-knowledge
title: 'Matt Pocock & Andrej Karpathy: skills, packages, and knowledge-sharing (research session)'
type: research
status: durable
tags:
  - research-session
  - matt-pocock
  - karpathy
  - agent-skills
  - claude-code
links: ["[[adopting-pocock-karpathy-in-workspace-os]]"]
source: null
confidence: high
created: '2026-06-09'
updated: '2026-06-09'
---
# Matt Pocock & Andrej Karpathy: skills, packages, and knowledge-sharing (research session)

**Goal:** Evaluate what to adopt from Matt Pocock's and Andrej Karpathy's shared work — packages, agent skills, and context-engineering techniques — into this local-first Claude Code Workspace OS, and ingest the findings as durable notes.

**Method:** Background `Workflow` orchestration — 9 parallel research agents (deep-reading the `mattpocock/skills` repo SKILL.md files + web/GitHub research on both ecosystems) → 1 synthesis agent (adoption evaluation mapped to the real repo state) → 8 adversarial fact-check agents → 8 note-drafting agents. 26 agents total.

## Research areas (Phase 1)

1. Pocock — `engineering/` skills (grill-with-docs, tdd, diagnose, improve-codebase-architecture, zoom-out, to-prd, to-issues, triage, prototype, setup-matt-pocock-skills)
2. Pocock — `productivity/`+`misc/` skills (caveman, grill-me, handoff, teach, write-a-skill, git-guardrails, setup-pre-commit)
3. Pocock — distribution + standard (`npx skills` / skills.sh, `.claude-plugin/plugin.json`, SKILL.md frontmatter, `/setup-matt-pocock-skills`)
4. Pocock — packages + teaching (Total TypeScript, AI Hero, ts-reset, shoehorn, ts-error-translator, newsletter, YouTube)
5. Pocock — AI-engineering philosophy (4 failure modes, shared-language/DDD, ADRs, "real engineering not vibe coding", anti-process-framework)
6. Karpathy — teaching repos (micrograd, makemore, minGPT, nanoGPT, build-nanogpt, nanochat, llm.c)
7. Karpathy — courses + orgs (Zero to Hero, LLM101n, Eureka Labs, CS231n, explainer videos)
8. Karpathy — essays + coinages (Software 2.0/3.0, vibe coding, context engineering, LLM OS)
9. Karpathy — knowledge-sharing channels (Bear blog + RSS, YouTube + RSS, X, GitHub)

## Verification (Phase 3) — 8 load-bearing claims

- CONFIRMED — Pocock skills install via `npx skills add mattpocock/skills` (skills.sh), use SKILL.md + `.claude-plugin/plugin.json` as a multi-agent Claude Code plugin.
- CONFIRMED — `/grill-me` + `/grill-with-docs` are his most-recommended skills; `/grill-with-docs` maintains CONTEXT.md + ADRs in `docs/adr/`.
- CORRECTED — Pocock created Total TypeScript + AI Hero and authors ts-reset/shoehorn (true), BUT the newsletter is now "over 70,000" devs on aihero.dev, not ~60k (the ~60k figure is the older number cited in the skills repo README). Captured both, flagged as his own inconsistent figures.
- CONFIRMED — Karpathy coined "vibe coding" ~02-Feb-2025.
- CONFIRMED — "Software 3.0" presented at YC AI Startup School, 17-Jun-2025 ("the hottest new programming language is English").
- CONFIRMED — `nanochat` released ~13-Oct-2025 (~8000 lines, full ChatGPT pipeline, "$100 ChatGPT").
- CONFIRMED — Karpathy endorsed "context engineering" over "prompt engineering" (X, 25-Jun-2025; a +1 endorsement, not his coinage).
- CONFIRMED — teaching ladder micrograd -> makemore -> nanoGPT/build-nanogpt via "Neural Networks: Zero to Hero"; founded Eureka Labs (Jul-2024).

## Synthesis

The format match is exact — `mattpocock/skills` is itself a `.claude/skills/<name>/SKILL.md` plugin — so adoption is about *which* artifacts, not whether the mechanism works. The single highest-leverage adoption is a per-workspace **`CONTEXT.md` glossary** (none exists in this repo today), which directly fixes the OS's controlled-vocabulary drift (frontmatter enums, slugs, tags, wikilink targets). Karpathy contributes philosophy + ingestion targets rather than tooling: the **LLM OS** framing is nearly a literal description of this repo (Claude Code = kernel, Markdown = filesystem, Postgres = index peripheral, Skills/MCP = peripherals), and **context engineering** is the stated rationale for the derived index + top-K retrieval. Several Pocock engineering skills (tdd, diagnose, to-prd/to-issues, triage, setup-pre-commit) are skip/reference-only here because the repo's "tracker" is its Markdown inbox, not GitHub Issues. Full ranked plan + adopt/adapt/skip matrix: [[adopting-pocock-karpathy-in-workspace-os]].

## Notes written

- [[matt-pocock-skills-repo]] — the "Skills For Real Engineers" plugin: 4 failure modes, skill catalog, distribution
- [[matt-pocock-shared-language-context-md]] — the CONTEXT.md ubiquitous-language glossary + ADR technique
- [[matt-pocock-grilling-and-feedback-loops]] — grill-me/grill-with-docs, tdd, diagnose, handoff, caveman
- [[matt-pocock-ecosystem]] — Total TypeScript, AI Hero, ts-reset, shoehorn, ts-error-translator
- [[claude-code-skill-authoring]] — SKILL.md standard, progressive disclosure, write-a-skill vs superpowers:writing-skills
- [[karpathy-teaching-repos-and-courses]] — micrograd -> nanochat ladder, Zero to Hero, Eureka Labs
- [[karpathy-software-3-and-coinages]] — Software 2.0/3.0, vibe coding, context engineering, LLM OS
- [[adopting-pocock-karpathy-in-workspace-os]] — the evaluation + ranked adoption plan (centerpiece)
