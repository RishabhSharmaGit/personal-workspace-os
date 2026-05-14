---
slug: ruflo-use-cases-limitations
title: Ruflo Use Cases and Limitations
type: note
status: durable
tags:
  - ruflo
  - use-cases
  - limitations
  - enterprise
links:
  - '[[ruflo-overview]]'
  - '[[ruflo-architecture]]'
source: null
confidence: high
created: '2026-05-13'
updated: '2026-05-13'
---
PRIMARY USE CASES: Large codebase refactors (10+ files, parallel subtasks), automated code review pipelines (specialized reviewer + test + security agents), enterprise knowledge management with RAG + vector memory, CI/CD workflow automation, conversational AI with persistent cross-session context. ENTERPRISE DIFFERENTIATOR: Ruflo eliminates Claude Code context window ceiling via real-time memory archiving, optimizing, and restoring conversation context automatically — agents can work on codebases larger than any single context window. LIMITATIONS (self-audit May 2026): Execution-layer gaps — agent_spawn (no subprocess), hive-mind (single-process only), workflow_execute (no runtime), WASM agent (echo only). Most advertised features (memory, embeddings, tasks, swarm registry, claims, workflow scheduling) do work. Anti-bot blocking: browser agent for web scraping frequently fails on sites with bot detection — knowledge retrieval is unreliable for fresh external data. Claude-only: works with Claude and Codex, not other LLMs. Complexity overhead: 7-layer architecture may be overkill for simple automation tasks where a single agent would suffice.
