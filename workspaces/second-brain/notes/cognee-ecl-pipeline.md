---
slug: cognee-ecl-pipeline
title: Cognee ECL pipeline — setup and core API
type: note
status: draft
tags: [cognee, python-sdk, api, ecl-pipeline, knowledge-graph, quickstart]
links: ["[[cognee-knowledge-graph-memory]]", "[[cognee-vs-vector-databases]]"]
source: null
confidence: medium
created: '2026-05-14'
updated: '2026-05-14'
---

# Cognee ECL pipeline — setup and core API

Cognee markets itself as "AI memory in 6 lines of code". The minimal working example below shows why: the public Python API is just three async functions — `add`, `cognify`, `search`.

## Minimal quickstart

```python
import cognee
import asyncio

async def main():
    await cognee.add("Natural language text, file path, or URL")
    await cognee.cognify()           # builds the knowledge graph
    results = await cognee.search("your query here")
    print(results)

asyncio.run(main())
```

Install: `pip install cognee`  
Requirements: Python 3.10–3.13, an LLM provider key (default: OpenAI gpt-4o-mini).

## The three core operations

### `cognee.add(data)` — Extract phase
- Ingests data into a named dataset
- Accepts: file paths (str), URLs, BinaryIO objects, raw text, S3 paths, or a list of any of those
- Stores raw content + metadata in the relational store (SQLite by default)
- 38+ source connectors supported (S3, GitHub, Notion, Slack, etc.)

### `cognee.cognify()` — Cognify phase (the "intelligence" step)
- Runs the six-stage pipeline: classify → permissions check → chunk → LLM entity/relation extraction → summarize → embed + commit to graph
- LLM call extracts triplets: (subject, relation, object) → graph edges
- Embeddings stored in vector store (LanceDB default)
- Graph edges committed to graph store (Kuzu default)

### `cognee.search(query, search_type)` — Load/retrieval phase
- Default: natural language query over the unified graph+vector index
- `search_type` options:
  - `CHUNKS_LEXICAL` — traditional BM25-style lexical search
  - `GRAPH_COMPLETION` — graph-traversal-augmented answer completion
  - `NATURAL_LANGUAGE` — semantic + graph hybrid
  - `CYPHER` — direct graph query language
  - `CODING_RULES` — code-focused retrieval

## Higher-level aliases (v2+ API)

Newer API uses `remember()` / `recall()` / `forget()`:
- `await cognee.remember(text)` — equivalent to add + cognify
- `await cognee.recall(query)` — equivalent to search
- `await cognee.forget()` — deletes datasets

## Four interface modes

Cognee exposes the same pipeline through four interfaces:
1. **Python SDK** — `cognee` package (pip install cognee)
2. **CLI** — `cognee-cli`
3. **REST API** — FastAPI server on port 8000
4. **MCP server** — Model Context Protocol for IDE/agent integration

## Configuration

LLM and storage backends configured via environment variables or `cognee.config`:
- `LLM_API_KEY` — OpenAI key (or configured alternative provider)
- Graph store: swap Kuzu for Neo4j, FalkorDB, Memgraph, Amazon Neptune
- Vector store: swap LanceDB for Pinecone, Qdrant, ChromaDB, pgvector, Redis
- Relational store: swap SQLite for PostgreSQL

## Wikilinks

- [[cognee-knowledge-graph-memory]] — architecture overview
- [[cognee-vs-vector-databases]] — how it compares to pure vector approaches
