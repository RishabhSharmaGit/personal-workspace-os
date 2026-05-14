---
slug: ruflo-overview
title: What is Ruflo
type: note
status: durable
tags:
  - ruflo
  - multi-agent
  - claude
  - orchestration
links: []
source: null
confidence: high
created: '2026-05-13'
updated: '2026-05-13'
---
Ruflo (github.com/ruvnet/ruflo) is an open-source multi-agent orchestration platform for Claude. Formerly called claude-flow before a January 2026 rename. It solves the single-agent bottleneck: for complex projects spanning 10+ files with parallel subtasks, a single Claude Code session becomes a bottleneck. Ruflo deploys specialized agent swarms that divide work, communicate via HNSW vector memory, and coordinate through a neural routing engine called SONA. Key stats: 84.8% SWE-bench solve rate, 75% API cost reduction, 314 MCP tools, 16 agent roles. Native Claude Code and Codex integration via MCP protocol.
