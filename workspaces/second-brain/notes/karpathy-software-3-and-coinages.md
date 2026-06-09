---
slug: karpathy-software-3-and-coinages
title: 'Karpathy ideas — Software 2.0/3.0, vibe coding, context engineering, LLM OS'
type: note
status: durable
tags: [karpathy, llm-fundamentals, context-engineering, llm-os, second-brain-meta]
links: ["[[llm-wiki-pattern]]", "[[adopting-pocock-karpathy-in-workspace-os]]", "[[karpathy-teaching-repos-and-courses]]"]
source: null
confidence: high
created: '2026-06-09'
updated: '2026-06-09'
---
Five Andrej Karpathy coinages trace an arc from "neural nets are a new software stack" to "natural language is the programming interface" to "the LLM is an OS kernel." They are the conceptual layer beneath this Workspace OS.

- **Software 2.0** (Medium, 11-Nov-2017): neural-net weights are a new kind of code. The "source code" is the dataset + architecture; training *compiles* the dataset into the weight-binary. https://karpathy.medium.com/software-2-0-a64152b37c35
- **Software 3.0** (keynote, YC AI Startup School, 17-Jun-2025): prompts in plain language program the LLM directly — *"the hottest new programming language is English."* He frames 1.0 (hand-written code), 2.0 (learned weights), and 3.0 (prompts) as coexisting paradigms. This is the backing for "skills are how you do work here": each `SKILL.md` is a natural-language program.
- **Vibe coding** (X, 02-Feb-2025): *"fully give in to the vibes... I 'Accept All' always, I don't read the diffs anymore."* He scoped it explicitly to *throwaway weekend projects*, not production. **This OS is the deliberate opposite** — Markdown as durable source of truth, `index-rebuild`, "Markdown wins" — so the term should not be misapplied to an auditable-state system. https://x.com/karpathy/status/1886192184808149383
- **Context engineering** (X, 25-Jun-2025, a "+1" endorsement, not a coinage): *"the delicate art and science of filling the context window with just the right information for the next step."* Too little/wrong-form degrades quality; too much raises cost *and* degrades quality. This is the exact rationale for the derived Postgres index + top-K retrieval in `query`/`research` — fill context, don't dump whole files. https://x.com/karpathy/status/1937902205765607626

## LLM OS — why this repo is a small instance

Karpathy's **LLM OS** framing (X, 28-Sep-2023; labeled diagram 10-Nov-2023) is the most load-bearing idea here: the LLM is the *kernel process of a new operating system*, with the context window as RAM, an embeddings DB as filesystem, and tools as peripherals. This Workspace OS is almost a literal implementation — Claude Code = kernel, `workspaces/**/*.md` = filesystem, Postgres = embeddings/index peripheral, Skills + MCP = peripherals. https://x.com/karpathy/status/1707437820045062561

## See also

- [[llm-wiki-pattern]] — the atomic densely-linked substrate these ideas justify
- [[karpathy-teaching-repos-and-courses]] — the from-scratch curriculum behind the philosophy
- [[adopting-pocock-karpathy-in-workspace-os]] — concrete adoption plan (LLM-OS note, context-engineering principle, provenance convention)
