---
slug: context7-mcp-overview
title: Context7 — MCP Server for Up-to-Date Library Documentation
type: note
status: draft
tags: [mcp, context7, upstash, llm, documentation, hallucination]
links: ["[[claude-code-ecosystem-landscape]]", "[[mcp-ecosystem]]"]
source: null
confidence: high
created: '2026-05-14'
updated: '2026-05-14'
---

# Context7 — MCP Server for Up-to-Date Library Documentation

Context7 is an open-source MCP server by Upstash that injects current, version-accurate library documentation directly into an LLM's context window at inference time, eliminating hallucinated APIs and stale code examples.

## The Problem It Solves

LLMs are trained on static snapshots. For fast-moving libraries (Next.js, React Query, Zod, Tailwind, etc.) the training corpus lags behind official releases. This causes:
- Hallucinated method signatures (API that no longer exists or was renamed)
- Wrong parameter names / option shapes
- Deprecated patterns presented as current

Context7 solves this by bypassing the model's static knowledge entirely and fetching fresh docs at query time.

## How It Works

1. User types a query referencing a library (e.g. "how do I use zod .refine()?")
2. The MCP client (Claude Code, Cursor, Windsurf) invokes Context7's `resolve-library-id` tool to convert the library name into a Context7 ID
3. The client then calls `get-library-docs` with that ID (and optional topic + token-limit params)
4. Context7 fetches up-to-date, version-specific docs from its index
5. The retrieved snippet is injected into the prompt context before the LLM generates a response

## Two Core MCP Tools

| Tool | Purpose |
|---|---|
| `resolve-library-id` | Maps a human library name → Context7 library ID |
| `get-library-docs` | Fetches documentation; accepts `libraryId`, optional `topic`, `tokens` (max context budget) |

## Infrastructure

Built on Upstash's edge infrastructure for low-latency worldwide retrieval. API keys are optional but enable higher rate limits and private repository access via `context7.com/dashboard`.

## Key Properties

- Indexes 9,000+ libraries
- Open-source (GitHub: `upstash/context7`)
- npm package: `@upstash/context7-mcp`
- Remote MCP endpoint: `https://mcp.context7.com/mcp`
- Auth header: `CONTEXT7_API_KEY` (optional)

See also: [[claude-code-ecosystem-landscape]], [[mcp-ecosystem]]
