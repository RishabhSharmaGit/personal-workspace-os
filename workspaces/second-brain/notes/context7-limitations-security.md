---
slug: context7-limitations-security
title: Context7 — Limitations, Known Issues, and Security (ContextCrush)
type: note
status: draft
tags: [mcp, context7, security, vulnerability, prompt-injection, limitations]
links: ["[[context7-mcp-overview]]", "[[mcp-ecosystem]]"]
source: null
confidence: high
created: '2026-05-14'
updated: '2026-05-14'
---

# Context7 — Limitations, Known Issues, and Security (ContextCrush)

Context7 has real-world limitations around rate limits, token consumption, and a significant security vulnerability (ContextCrush) discovered in early 2026 and patched by Upstash.

## Rate Limits

- Free tier reduced from ~6,000 → **1,000 requests/month** in January 2026
- API key (from `context7.com/dashboard`) enables higher rate limits
- Heavy users of multiple libraries will exhaust the free tier quickly

## Accuracy Limitations

- One benchmark (Deepcon vs. Context7) scored Context7 at **65% accuracy** in contextual scenarios across 20 real-world agent tasks
- Docs retrieval is based on keyword matching + ranking, not semantic search — can miss context-dependent edge cases

## Token Consumption

- Context7 injects raw doc snippets into the prompt (not compressed RAG chunks)
- High-token libraries with broad topics can consume a significant portion of the context window
- Mitigated by configuring `tokens` limit in `get-library-docs` calls

## ContextCrush Vulnerability (Feb 2026, Patched)

**Discovered by**: Noma Security / Noma Labs
**Disclosed**: Feb 18–19, 2026
**Patched**: Feb 23, 2026

**Root cause**: Context7's "Custom Rules" / "AI Instructions" feature let library owners set arbitrary text that was **served verbatim** alongside documentation to every user who queried that library — with no sanitization or labeling. Because AI agents treat Context7 responses as trusted context, malicious instructions were acted upon with the agent's tool access.

**Attack scenario**: A poisoned library entry could instruct the AI assistant to:
1. Search for `.env` files
2. Exfiltrate secrets to an attacker-controlled repo
3. Delete local files under a "Cleanup" rationale

**Scope**: Context7 has ~50,000 GitHub stars and 8M+ npm downloads; Cursor, Claude Code, and Windsurf users were all potentially exposed.

**Fix**: Upstash deployed rule sanitization and guardrails on Feb 23, 2026.

**Systemic issue**: The MCP specification acknowledges tool descriptions should be treated as untrusted but provides no standardized enforcement mechanism. This is a class-level risk for the entire [[mcp-ecosystem]], not just Context7.

## Other Limitations

- No offline / self-hosted mode for the managed service (Docfork is an alternative with self-hosting)
- Update lag for niche libraries: rolling 10–15 day re-crawl cycle means very new releases may lag
- Library quality varies — community-submitted libraries may have incomplete or lower-quality indexed docs

See also: [[context7-mcp-overview]], [[mcp-ecosystem]]
