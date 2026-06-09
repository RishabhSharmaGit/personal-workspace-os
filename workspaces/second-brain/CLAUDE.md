# Second Brain — Operating Rules

## Purpose

General knowledge: articles, blog posts, repo references, ideas, chat distillations, source snapshots. The Karpathy-style LLM-wiki of personal knowledge.

## What lives here

- Captured external sources (URLs, PDFs, transcripts) — under `sources/`
- Atomic durable notes synthesized from sources or original thinking — under `notes/`
- Meta-decisions about the brain (taxonomy changes, convention shifts) — under `decisions/`

## What does NOT live here

- Time-bound operational tasks (those go to a future Career-OS or task workspace).
- Domain-specific trackers (fitness logs, job applications, etc. — separate workspaces).
- Code projects (separate workspaces or upstream repos).

## Capture sources accepted

- URLs (articles, blogs, docs, GitHub repos) via firecrawl-scrape
- Social/video (X threads, Reddit, YouTube) via firecrawl-instruct + transcript extraction
- Chat exports (ChatGPT, Claude, Codex, Gemini) via the `distill-chat` skill
- Files (PDFs, screenshots, transcripts) via Read + blob copy

## Linking conventions

- Notes are atomic (one concept per note) and densely linked via `[[slug]]`.
- Source items reference notes they spawned via `[[note-slug]]` in body.
- Unresolved `[[slug]]` references are valid — the indexer records them, target may come later.

## Shared language

- [`CONTEXT.md`](CONTEXT.md) is this workspace's canonical glossary (Pocock-style: one
  term, an `_Avoid_` synonym list, no implementation detail). Consult it before choosing a
  slug, title, tag, type, or `[[wikilink]]` target so vocabulary stays consistent.
- It is a skeleton/meta file (like `CLAUDE.md`/`README.md`) — not indexed as an item.
- Resolve and add new terms inline as they come up; never batch.

## Skills active here

- `capture`, `query`, `triage-inbox`, `weekly-review`, `distill-chat`, `index-rebuild`, `research`.

## Naming

- Notes: concept-named, no date prefix. `notes/llm-wiki-pattern.md`.
- Sources/inbox/decisions/archive: date-prefixed. `sources/2026-05-12-karpathy-zero-to-hero.md`.
- Research sessions: date-prefixed, in `research/`. `research/2026-05-13-rag-evaluation.md`.
