---
slug: ruflo-agent-orchestration
title: Ruflo Agent Orchestration Mechanics
type: note
status: durable
tags:
  - ruflo
  - multi-agent
  - swarm
  - claude
links:
  - '[[ruflo-overview]]'
source: null
confidence: high
created: '2026-05-13'
updated: '2026-05-13'
---
Ruflo orchestrates Claude agents via configurable swarm topologies. Four main topologies: (1) Hierarchical (queen-worker) — queen agents plan/decompose, workers execute; ideal for structured engineering tasks. (2) Mesh — peer-to-peer communication, every agent talks to every agent; ideal for creative/brainstorming tasks. (3) Ring — sequential pipeline passing context along a chain. (4) Star — hub-spoke pattern, single coordinator fans out. Consensus uses Raft and Byzantine agreement for fault tolerance. Simple tasks go to a single agent; complex tasks are auto-decomposed and parallelized. Agents share memory via the HNSW vector store, allowing context to flow between sessions and between agents without re-prompting.
