---
slug: ruflo-architecture
title: Ruflo Core Architecture
type: note
status: durable
tags:
  - ruflo
  - architecture
  - sona
  - hnsw
  - mcp
links:
  - '[[ruflo-overview]]'
  - '[[ruflo-agent-orchestration]]'
source: null
confidence: high
created: '2026-05-13'
updated: '2026-05-13'
---
Ruflo implements a 7-layer architecture: (1) User Interface layer — Claude Code + web UI; (2) Orchestration — SONA neural router; (3) Agent Execution — worker pool with 16+ role types; (4) Intelligence — 9 RL algorithms; (5) Memory — AgentDB + HNSW vector index; (6) Security — enterprise auth, federated comms; (7) Plugins — 21 native plugins + 314 MCP tools. SONA (Self-Optimizing Neural Adapter): routes requests between workers in <0.05ms, records outcomes, learns from each run to reduce latency and improve routing over time. AgentDB + HNSW: stores plans, trajectories, and outcomes as vectors. HNSW provides 150x-12500x faster search vs brute force. Future task planning retrieves past solutions semantically — the planner improves with every task. MCP integration: any MCP endpoint (HTTP, SSE, or stdio) joins native tool set in parallel-execution flow.
