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

## Skills active here

- `capture`, `query`, `triage-inbox`, `weekly-review`, `distill-chat`, `index-rebuild`.

## Naming

- Notes: concept-named, no date prefix. `notes/llm-wiki-pattern.md`.
- Sources/inbox/decisions/archive: date-prefixed. `sources/2026-05-12-karpathy-zero-to-hero.md`.
