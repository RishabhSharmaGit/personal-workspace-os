# Workspace OS — Operating Conventions

This file is loaded by Claude Code every session under this root.

## What this is

A local-first, LLM-mediated personal knowledge OS. Markdown files (with YAML frontmatter) are the durable source of truth. Local Postgres holds a derived, queryable index. You (Claude) are the operator; skills under `.claude/skills/` are how you do work here.

## Slug and filename rules

- Slugs are `kebab-case`, lowercase, ASCII. File name = slug + `.md`.
- Notes (durable, atomic) are concept-named, no date prefix: `notes/llm-wiki-pattern.md`.
- Inbox / sources / decisions / archive items are date-prefixed: `inbox/2026-05-12-some-url.md`.

## Date conventions

Two contexts, two formats:

- **System dates** — frontmatter `created:` / `updated:`, file-name prefixes (`inbox/2026-05-12-…`, `research/2026-05-14-…`), slug prefixes, DB columns — always ISO `YYYY-MM-DD`. Sortable, validated by the frontmatter Zod schema, queryable in Postgres.
- **Human-entered body-text dates** — application timeline entries, decision dates, comp grant dates, recruiter touch logs, "last updated" footers users edit by hand — prefer **`DD-MMM-YYYY`** (e.g. `23-Oct-2024`); fall back to **`DD-MM-YYYY`** (e.g. `23-10-2024`) only when typing the month abbreviation is awkward.

When asking the user for a date in a `[FILL]` placeholder or interactive prompt, write the format in the cue (e.g. `[FILL — DD-MMM-YYYY]`). Never force users into ISO for body fields they read often.

## Wikilinks

- Syntax: `[[slug]]` or `[[slug|display text]]`.
- Resolve to a slug, not a path.
- Unresolved links are valid — the target may be created later. Indexer records them with `to_item_id = NULL`.

## Frontmatter contract

Every `.md` file in `workspaces/**/` carries:

```yaml
---
slug: string
title: string
type: note|source|decision|inbox|capture
status: raw|draft|durable|archived
tags: [string, ...]
links: ["[[slug]]", ...]
source: string|null
confidence: low|medium|high
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

`type: source` items add: `source_url`, `source_fetched_at`, `source_fetcher`, `source_content_hash`, `source_blob_path`.

## Workspace map

See [`workspaces.json`](workspaces.json) for the canonical registry. Current active workspaces:

| Slug | Path | Purpose |
|---|---|---|
| `second-brain` | `workspaces/second-brain/` | General knowledge, articles, ideas, chat distillations |

## Skills

Project-local skills live under `.claude/skills/<name>/SKILL.md`. Invoke via the `Skill` tool.

| Skill | When to invoke |
|---|---|
| `capture` | User says "save this", "capture", "add this", pastes a URL/file/chat export |
| `query` | "what do I know about X", "find", "search", "have I seen" |
| `triage-inbox` | "triage inbox", "process inbox", or scheduled |
| `weekly-review` | "weekly review", or scheduled via `loop` plugin |
| `distill-chat` | "distill this chat", paste of a chat export |
| `index-rebuild` | "rebuild index", "reindex" — recovery only |

## Triage rules (confidence-gated)

Place an item directly in `notes/`, `sources/`, or `decisions/` (skipping `inbox/`) when ALL hold:
1. Target workspace is unambiguous from content + user context.
2. At least one wikilink target already exists in DB (anchor note).
3. Type is unambiguous.
4. LLM confidence is `high`.

Otherwise → `inbox/` with `status: raw` and `confidence: low|medium`. The `triage-inbox` skill processes these later.

## Database

Local Postgres via Supabase CLI. Schema doc: [`db/schema.md`](db/schema.md). Migrations: [`db/supabase/migrations/`](db/supabase/migrations/). Query via the Supabase MCP server (preferred) or `bun run` scripts under `scripts/`.

## Hooks

`.claude/settings.json` wires:

- `SessionStart` — prints state head + pending capture counts.
- `PostToolUse` (Write/Edit on `workspaces/**/*.md`) — incremental indexer upsert.
- `Stop` — appends a session-end line to `STATE.md` if any items were captured.

## Files vs DB

If Postgres and Markdown disagree, **Markdown wins.** Run `index-rebuild` to reconcile.

## Secrets

Secrets live in `.env` (gitignored). Personal overrides go in `.claude/settings.local.json` (gitignored). Never inline secrets in markdown or committed config.

## Pointers

- Current cross-workspace state: [`STATE.md`](STATE.md)
- Workspace registry: [`workspaces.json`](workspaces.json)
- Database schema: [`db/schema.md`](db/schema.md)
- Design spec: [`docs/superpowers/specs/2026-05-12-personal-workspace-os-bootstrap-design.md`](docs/superpowers/specs/2026-05-12-personal-workspace-os-bootstrap-design.md)
