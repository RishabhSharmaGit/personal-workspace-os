---
slug: 2026-05-14-context7-mcp-server-for-up-to-date-libra
title: 'Context7: MCP server for up-to-date library documentation (research session)'
type: research
status: durable
tags:
  - research-session
  - context7
  - mcp
  - server
  - up-to-date
links: []
source: null
confidence: medium
created: '2026-05-14'
updated: '2026-05-14'
agent_run_id: 1e9c5f4d-eefd-4a78-b3b0-2479800fa01b
budget: 5
---
# Context7: MCP server for up-to-date library documentation (research session)

**Topic:** Context7: MCP server for up-to-date library documentation
**Budget:** 5 iterations

## Plan

Seed sub-questions:
1. What is Context7 and how does it solve outdated API docs in LLM completions?
2. How is Context7 installed and configured in Claude Code, Cursor, and Windsurf?
3. What libraries does Context7 index and how does it keep documentation current?
4. How does Context7 compare to other MCP documentation servers?
5. What are the limitations and known issues with Context7?

Anchors in DB: (none)

## Iteration log

### Iteration 1 — What is Context7 and how does it solve outdated API docs in LLM completions?
- **Picked because:** Highest info_gain (9.0) among remaining seed questions
- **Score:** info_gain=9.0 + gap_fill=0.0 → 9.0
- **Sources:** [[https://upstash.com/blog/context7-mcp]], [[https://github.com/upstash/context7]], [[https://deepwiki.com/upstash/context7-mcp/2-system-architecture]]
- **Notes:** [[context7-mcp-overview]]
- **Status:** kept

### Iteration 2 — How is Context7 installed and configured in Claude Code, Cursor, and Windsurf?
- **Picked because:** Highest info_gain (8.5) among remaining seed questions
- **Score:** info_gain=8.5 + gap_fill=0.0 → 8.5
- **Sources:** [[https://context7mcp.com/install/]], [[https://claudelog.com/claude-code-mcps/context7-mcp/]], [[https://github.com/upstash/context7]]
- **Notes:** [[context7-installation-config]]
- **Status:** kept

### Iteration 3 — What libraries does Context7 index and how does it keep documentation current?
- **Picked because:** Highest info_gain (8.0) among remaining seed questions
- **Score:** info_gain=8.0 + gap_fill=0.0 → 8.0
- **Sources:** [[https://github.com/upstash/context7]], [[https://context7.com/add-library]], [[https://upstash.com/blog/context7-llmtxt-cursor]]
- **Notes:** [[context7-library-index-pipeline]]
- **Status:** kept

### Iteration 4 — Explore unresolved link: llm-wiki-pattern
- **Picked because:** Resolves dangling [[link]] surfaced in earlier iteration (iter 3)
- **Score:** info_gain=7.0 + gap_fill=1.0 → 8.0
- **Sources:** [[https://mcp.directory/blog/top-context7-mcp-alternatives]], [[https://neuledge.com/blog/2026-02-06/top-7-mcp-alternatives-for-context7-in-2026/]]
- **Notes:** [[context7-vs-alternatives]]
- **Status:** kept

### Iteration 5 — Explore unresolved link: mcp-ecosystem
- **Picked because:** Resolves dangling [[link]] surfaced in earlier iteration (iter 4)
- **Score:** info_gain=7.0 + gap_fill=1.0 → 8.0
- **Sources:** [[https://noma.security/blog/contextcrush-context7-the-mcp-server-vulnerability/]], [[https://blog.modelcontextprotocol.io/posts/2025-11-25-first-mcp-anniversary/]], [[https://github.com/modelcontextprotocol/servers]]
- **Notes:** [[mcp-ecosystem]], [[context7-limitations-security]]
- **Status:** kept

## Synthesis

Context7 (by Upstash) is the leading MCP server for injecting up-to-date, version-accurate library documentation into AI coding assistants at inference time, directly addressing the core failure mode of LLM hallucination on fast-moving APIs. It exposes two MCP tools — `resolve-library-id` and `get-library-docs` — that any MCP-compatible client (Claude Code, Cursor, Windsurf) invokes automatically when querying a library. The index covers 33,000+ libraries, refreshed on a rolling 10–15 day schedule with Git-hash and package-version change detection; library owners can submit projects via PR, web form, or a `context7.json` config file, and the platform supports `llms.txt` as an optimized ingestion format. Installation takes under 5 minutes via `npx @upstash/context7-mcp@latest init --<editor>` or a one-line JSON MCP config block identical across all editors. The primary risks and limitations are: (1) the ContextCrush vulnerability (Feb 2026, patched) where unsanitized "Custom Rules" from library owners were injected verbatim into agent context — a class-level MCP security risk, not just a Context7 issue; (2) the free tier cap of 1,000 requests/month as of Jan 2026; (3) accuracy benchmarked at ~65% vs alternatives like Deepcon (90%); and (4) no self-hosted option unlike Docfork. In the broader [[mcp-ecosystem]], Context7 was among the first movers and remains the most widely adopted documentation MCP server, but faces growing competition from Docfork (project-scoped isolation, MIT), Deepcon (higher accuracy), and Nia (YC-backed, agent-performance focus). The approach — prompt-stuffing fresh docs rather than RAG — trades context-window tokens for retrieval determinism, which is the right trade-off for code generation tasks where incorrect APIs are worse than long prompts.

### Notes written

- [[context7-mcp-overview]] — Core concept, MCP tools, and how it solves hallucination
- [[context7-installation-config]] — Editor-by-editor install guide with JSON configs
- [[context7-library-index-pipeline]] — Index scale, freshness mechanism, llms.txt, library submission
- [[context7-vs-alternatives]] — Comparison table: Docfork, Deepcon, Nia, Rtfmbro
- [[context7-limitations-security]] — ContextCrush vuln, rate limits, accuracy, token use
- [[mcp-ecosystem]] — MCP protocol overview, governance, scale, security risk class
