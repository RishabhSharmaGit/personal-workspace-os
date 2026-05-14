---
slug: cognee-knowledge-graph-memory
title: Cognee — knowledge graph memory for AI agents
type: note
status: draft
tags: [cognee, knowledge-graph, ai-memory, rag, agents, vector-database]
links: ["[[llm-efficiency-knowledge-tools]]", "[[cognee-ecl-pipeline]]", "[[cognee-vs-vector-databases]]"]
source: null
confidence: medium
created: '2026-05-14'
updated: '2026-05-14'
---

# Cognee — knowledge graph memory for AI agents

Cognee (github.com/topoteretes/cognee) is an open-source AI memory layer that represents knowledge as a graph rather than isolated vector embeddings. It gives AI agents a shared, evolving memory of data, decisions, and workflows so they can recall, connect, and act with context.

## Core idea

Traditional RAG retrieves documents as independent chunks. Cognee maps information into a connected network of entities, relationships, and topics — enabling agents to reason about *how* information is related, not just find similar text.

## Three storage layers (unified)

Cognee unifies three complementary stores:

| Layer | Purpose | Default | Alternatives |
|---|---|---|---|
| Graph store | entities, relationships, structural traversal | Kuzu | Neo4j, FalkorDB, Amazon Neptune, Memgraph |
| Vector store | embeddings, semantic similarity | LanceDB | Qdrant, pgvector, Redis, Pinecone, ChromaDB |
| Relational store | documents, chunks, provenance | SQLite | PostgreSQL |

## ECL pipeline (Extract → Cognify → Load)

The core ingestion pipeline runs six stages:
1. Classify documents
2. Check permissions
3. Extract chunks
4. LLM extracts entities and relationships (triplets: subject → relation → object)
5. Generate summaries
6. Embed into vector store + commit edges to graph store

## Memory types

- **Session memory** — short-term working memory; loads relevant embeddings + graph fragments into runtime context for fast reasoning
- **Permanent memory** — long-term knowledge artifacts: user data, interaction traces, external docs, derived relationships

## Self-improving memory (Memify)

The Memify Pipeline runs post-ingestion enrichment: pruning stale nodes, strengthening frequent connections, reweighting edges by usage signals, adding derived facts. Memory is not static — it evolves based on feedback and interaction traces.

## Traction (as of 2026)

- Pipeline volume grew from ~2,000 to 1M+ runs in one year (500x)
- Running live in 70+ companies
- Notable users: Bayer (scientific research), University of Wyoming (policy evidence graphs), dltHub

## Wikilinks

- [[llm-efficiency-knowledge-tools]] — landscape note with brief Cognee entry
- [[cognee-ecl-pipeline]] — deep dive on the ECL pipeline
- [[cognee-vs-vector-databases]] — comparison with Pinecone, Chroma, etc.
