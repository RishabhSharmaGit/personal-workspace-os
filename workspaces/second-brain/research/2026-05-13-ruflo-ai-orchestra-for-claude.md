---
slug: 2026-05-13-ruflo-ai-orchestra-for-claude
title: Ruflo AI orchestra for Claude (research session)
type: research
status: durable
tags:
  - research-session
  - ruflo
  - orchestra
  - claude
links: []
source: null
confidence: medium
created: '2026-05-13'
updated: '2026-05-13'
agent_run_id: 122a528a-3693-4af8-b959-5a1af6efd947
budget: 5
---
# Ruflo AI orchestra for Claude (research session)

**Topic:** Ruflo AI orchestra for Claude
**Budget:** 5 iterations

## Plan

Seed sub-questions:
1. What is Ruflo and what problem does it solve for Claude users?
2. How does Ruflo orchestrate multiple Claude agents or instances?
3. What are Ruflos core architectural components and design principles?
4. How does Ruflo compare to other Claude and LLM orchestration tools?
5. What are the practical use cases and current limitations of Ruflo?

Anchors in DB: (none)

## Iteration log

### Iteration 1 — What is Ruflo and what problem does it solve for Claude users?
- **Picked because:** Highest info_gain (9.0) among remaining seed questions
- **Score:** info_gain=9.0 + gap_fill=0.0 → 9.0
- **Notes:** [[ruflo-overview]]
- **Status:** kept

### Iteration 2 — How does Ruflo orchestrate multiple Claude agents or instances?
- **Picked because:** Highest info_gain (8.5) among remaining seed questions
- **Score:** info_gain=8.5 + gap_fill=0.0 → 8.5
- **Notes:** [[ruflo-agent-orchestration]]
- **Status:** kept

### Iteration 3 — What are Ruflos core architectural components and design principles?
- **Picked because:** Highest info_gain (8.0) among remaining seed questions
- **Score:** info_gain=8.0 + gap_fill=0.0 → 8.0
- **Notes:** [[ruflo-architecture]]
- **Status:** kept

### Iteration 4 — How does Ruflo compare to other Claude and LLM orchestration tools?
- **Picked because:** Highest info_gain (7.5) among remaining seed questions
- **Score:** info_gain=7.5 + gap_fill=0.0 → 7.5
- **Notes:** [[ruflo-vs-alternatives]]
- **Status:** kept

### Iteration 5 — Explore unresolved link: llm-wiki-pattern
- **Picked because:** Resolves dangling link surfaced in iter 4
- **Score:** info_gain=7.0 + gap_fill=1.0 → 8.0
- **Status:** skipped

## Synthesis

Ruflo (github.com/ruvnet/ruflo) is the leading open-source multi-agent orchestration platform for Claude, formerly named `claude-flow` before a Jan 2026 trademark rename. It extends Claude Code from a single-agent assistant into a coordinated swarm: the foundational problem it solves is the single-agent bottleneck — see [[ruflo-overview]]. Under the hood, Ruflo uses four swarm topologies (hierarchical queen-worker, mesh, ring, star) and a consensus layer (Raft + Byzantine agreement) to coordinate specialised agents in parallel, all documented in [[ruflo-agent-orchestration]]. Its 7-layer architecture centres on SONA (neural router, <0.05ms latency) and AgentDB + HNSW vector memory (150-12500× faster than brute force) that makes the planner smarter with every task — see [[ruflo-architecture]]. Against alternatives like LangGraph, CrewAI, and AutoGen, Ruflo wins on Claude-native integration and cross-session memory but loses on LLM portability (Claude/Codex only) — full comparison in [[ruflo-vs-alternatives]]. Real-world strengths are large codebase refactors and automated pipelines; real-world weaknesses include several execution-layer gaps (agent_spawn, hive-mind, workflow_execute) identified in its own May 2026 self-audit — captured in [[ruflo-use-cases-limitations]].

### Notes added this session
- [[ruflo-overview]]
- [[ruflo-agent-orchestration]]
- [[ruflo-architecture]]
- [[ruflo-vs-alternatives]]
- [[ruflo-use-cases-limitations]]

### Open questions
- What are the exact MCP tools available and how do you configure custom ones?
- How does Ruflo's agent federation work across machines (networking model, auth)?
- Gap-fill: relationship between Ruflo's LLM-wiki concept and the [[llm-wiki-pattern]] note (both use dense wikilinks + LLM as primary reader/writer)
