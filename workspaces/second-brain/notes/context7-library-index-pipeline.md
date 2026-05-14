---
slug: context7-library-index-pipeline
title: Context7 — Library Index and Documentation Freshness Pipeline
type: note
status: draft
tags: [mcp, context7, documentation, indexing, llm-txt, pipeline]
links: ["[[context7-mcp-overview]]", "[[llm-wiki-pattern]]"]
source: null
confidence: medium
created: '2026-05-14'
updated: '2026-05-14'
---

# Context7 — Library Index and Documentation Freshness Pipeline

Context7 indexes 33,000+ libraries (commonly cited as 9,000+ in earlier marketing) and keeps them current via automated crawling and version-detection.

## Scale

- 33,000+ libraries parsed and enriched
- Multiple embedding models for vectorization
- 5-metric ranking system for snippet relevance
- Results cached for instant retrieval

## Freshness Mechanism

Context7 uses a multi-method approach:

1. **Rolling crawl schedule**: All libraries re-checked every 10–15 days automatically
2. **Change detection before reprocessing**: Compares Git commit hashes (for repo-hosted docs) and package version numbers from registries (npm, PyPI, Maven) — avoids redundant re-indexing
3. **Manual trigger**: Users can force-refresh a specific library via the Context7 interface when a new major version drops

## Documentation Processing Pipeline (5 Stages)

1. Parse raw library docs (supports `.md`, `.mdx`, `.txt`, `.rst`, `.ipynb`)
2. Enrich with LLM-generated metadata
3. Vectorize with multiple embedding models
4. Apply 5-metric ranking to produce relevance-scored snippets
5. Cache for low-latency retrieval at inference time

## llms.txt Support

Context7 can ingest `llms.txt` files — a proposed standard where library maintainers publish an LLM-optimized summary of their docs (analogous to `robots.txt` for crawlers). Context7 auto-generates an `llms.txt` for indexed libraries, accessible at `context7.com/docs/llms.txt`.

## Adding a Library

Three paths:
- **Web form**: `context7.com/add-library`
- **Pull request**: Submit a JSON descriptor to the `upstash/context7` GitHub repo; merged PRs are auto-indexed
- **context7.json**: Library maintainers can add a `context7.json` to their repo root to control how Context7 parses and presents their project (similar to robots.txt directives)

See also: [[context7-mcp-overview]], [[llm-wiki-pattern]]
