---
slug: mcp-ecosystem
title: MCP (Model Context Protocol) Ecosystem Overview
type: note
status: draft
tags: [mcp, anthropic, protocol, ai-tools, ecosystem, cursor, claude-code]
links: ["[[claude-code-ecosystem-landscape]]", "[[context7-mcp-overview]]"]
source: null
confidence: high
created: '2026-05-14'
updated: '2026-05-14'
---

# MCP (Model Context Protocol) Ecosystem Overview

The Model Context Protocol (MCP) is an open standard enabling AI assistants to communicate with external data sources and tools via a uniform client-server interface. Announced by Anthropic in late 2024, it became the de-facto integration protocol for AI coding assistants by end-2025.

## Scale (as of end-2025)

- 10,000+ active MCP servers in production
- ~2,000 entries in the central index (407% growth from initial batch)
- 97 million+ monthly SDK downloads across all languages
- Adopted by: Claude, Cursor, Windsurf, VS Code Copilot, ChatGPT, and more

## What MCP Provides

MCP servers expose three primitives to clients:
- **Tools**: Callable functions (e.g., `get-library-docs`, `execute_sql`)
- **Resources**: Readable data items (e.g., files, DB rows)
- **Prompts**: Reusable prompt templates

Clients (AI assistants) discover these via the MCP handshake and invoke them dynamically during inference.

## Governance

In December 2025, Anthropic donated MCP to the **Agentic AI Foundation (AAIF)**, a directed fund under the Linux Foundation, co-founded by Anthropic, Block, and OpenAI. This formalized multi-vendor governance.

## Transport and Scalability Issues (2026 Roadmap)

Stateful MCP sessions conflict with horizontally-scaled load balancers. The 2026 roadmap addresses this via a revised transport/session model and a `.well-known` metadata standard for server discoverability without live connections.

## Security Concerns

Because MCP tool descriptions and metadata are served from third-party servers to AI agents, prompt injection via malicious tool descriptions is a class of attack the spec acknowledges but doesn't fully solve. The [[context7-mcp-overview]] ContextCrush vulnerability is one concrete instance of this pattern.

## Notable Server Categories

| Category | Examples |
|---|---|
| Documentation | Context7, Docfork |
| File system | Official MCP filesystem server |
| Source control | GitHub MCP, Git MCP |
| Database | Supabase MCP, various SQL adapters |
| Web | Firecrawl MCP, Fetch server |
| Memory/Knowledge | Memory server (graph-based), RAG servers |

See also: [[claude-code-ecosystem-landscape]], [[context7-mcp-overview]]
