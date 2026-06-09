---
slug: matt-pocock-grilling-and-feedback-loops
title: 'Grilling + feedback-loop discipline (grill-me, tdd, diagnose)'
type: note
status: durable
tags: [matt-pocock, agent-skills, feedback-loops, context-economy, workflow]
links: ["[[matt-pocock-skills-repo]]", "[[matt-pocock-shared-language-context-md]]", "[[claude-code-skill-authoring]]", "[[adopting-pocock-karpathy-in-workspace-os]]", "[[llm-wiki-pattern]]"]
source: null
confidence: high
created: '2026-06-09'
updated: '2026-06-09'
---
Four of Matt Pocock's [[matt-pocock-skills-repo|skills]] target the recurring failure modes of agent-mediated work: misalignment, broken output, and a blown context window. They close feedback loops *before* and *during* a task rather than reacting after.

- **Grilling (`/grill-me`, `/grill-with-docs`)** — a relentless one-question-at-a-time interview that walks every branch of a plan's decision tree, resolving dependencies *before* any work starts. Two rules make it cheap: the model **proposes its own recommended answer** for each question, and if a question is answerable by exploring the codebase/index it **explores instead of asking**. This is the fix for "you think the dev knows what you want, then you see what they built." `grill-with-docs` additionally maintains the [[matt-pocock-shared-language-context-md|CONTEXT.md glossary]] inline.
- **`/tdd` — red-green-refactor** — strict vertical "tracer-bullet" slices (one test → one minimal impl → repeat), explicitly *against* horizontal slicing (all tests then all code, which tests imagined behavior). Test behavior through public interfaces so tests survive refactors.
- **`/diagnose` — a 6-phase loop**: build a fast, deterministic, agent-runnable feedback loop (the "90% of the fix") → **reproduce** the user's exact symptom → generate 3-5 **ranked falsifiable hypotheses** before testing any → **instrument** one variable at a time (tag debug logs `[DEBUG-a4f2]` for one-grep cleanup) → **fix** → write a **regression test** at the real seam.
- **`/handoff` + `/caveman` — context economy**: `handoff` compacts a session into a doc a fresh agent can resume from (reference artifacts by path, don't duplicate; redact secrets). `caveman` is a persistent ~75%-token-reduction output mode (the figure is his unverified claim) that drops filler but keeps code, errors, and technical terms exact.

**Mapping onto this OS.** The grilling micro-step folds into the **confidence gate**: when target workspace/type/anchor is ambiguous (confidence ≠ high), interrogate one question at a time — querying the Postgres index first — before filing a capture/research item to `inbox/`, instead of guessing. `diagnose`'s repro-first loop applies to the indexer/hooks, not knowledge. `tdd` is largely skip-for-now (markdown OS, though `scripts/` has Vitest). A `handoff` skill should write to a tracked `archive/handoffs/` so it flows through the indexer; `caveman`'s safety exception must never compress slugs, frontmatter, or `index-rebuild` confirmations. See [[adopting-pocock-karpathy-in-workspace-os]] for the ranked plan.

## See also
- [[matt-pocock-skills-repo]] — the full skill catalog and install path
- [[matt-pocock-shared-language-context-md]] — the CONTEXT.md glossary discipline `grill-with-docs` maintains
- [[claude-code-skill-authoring]] — house authoring standard for adapted skills
- [[adopting-pocock-karpathy-in-workspace-os]] — ranked adoption plan for this repo
- [[llm-wiki-pattern]] — the atomic-note anchor this OS is built on
