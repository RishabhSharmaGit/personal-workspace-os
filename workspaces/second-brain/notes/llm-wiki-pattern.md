---
slug: llm-wiki-pattern
title: LLM Wiki Pattern
type: note
status: durable
tags:
  - llm-wiki
  - knowledge-management
  - karpathy
  - second-brain-meta
links:
  - '[[evergreen-notes]]'
  - '[[atomic-notes]]'
  - '[[zettelkasten]]'
  - '[[wikilink-graph]]'
source: null
confidence: high
created: '2026-05-13'
updated: '2026-05-13'
---
The Karpathy-style LLM-wiki treats a personal knowledge base as a living substrate for LLM-mediated reasoning, not just a passive archive. The wiki is small enough that relevant chunks fit into context, atomic enough that retrieval is precise, and densely linked enough that synthesis can hop across concepts. The LLM is the primary reader and writer — it captures, summarizes, links, queries, and distills on the human's behalf.

## Why atomic + densely linked

Long documents force the LLM to scan irrelevant prose to find the load-bearing claim. Atomic notes — one concept per file, see [[atomic-notes]] and [[evergreen-notes]] — let retrieval surface exactly the right unit. Dense `[[wikilinks]]` form a graph (see [[wikilink-graph]]) the LLM can traverse during synthesis, much like the [[zettelkasten]] tradition but with the LLM doing the linking work humans usually neglect.

## Unresolved links are a feature

A `[[future-concept]]` reference before the note exists is a gap the system can show you — a signal of where your knowledge wants to expand. The indexer here records dangling links rather than rejecting them, so the graph view doubles as a to-write list.

## How this repo embodies it

Markdown files in `workspaces/second-brain/` are authoritative; Postgres is a derived index for fast lookup. The `capture` skill ingests URLs/files/chats, summarizes, and applies confidence-gated triage. The `query` skill answers questions by reading top-ranked notes and citing them with `[[slug]]`. The `weekly-review` skill surfaces what's flowing through. The LLM handles the wiki maintenance the human would otherwise neglect — which is the whole point.
