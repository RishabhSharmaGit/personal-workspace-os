# Database Schema

Local Postgres (Supabase CLI). Connect via `DATABASE_URL` from `.env`. Schema is rebuildable from filesystem via `bun run index:rebuild`.

## Tables (Phase 0)

| Table | Purpose |
|---|---|
| `workspaces` | Workspace registry (one row per workspace dir) |
| `items` | Every Markdown file in any workspace, with frontmatter mirror |
| `tags` | Workspace-scoped tags (free-form, lowercase kebab) |
| `item_tags` | Many-to-many |
| `links` | Outgoing wikilinks; `to_item_id` NULL = unresolved |
| `sources` | Provenance for `type='source'` items (URL, fetcher, blob path) |
| `captures` | Inbox queue (DB mirror of inbox/ files for fast triage queries) |
| `agent_runs` | Skill invocation log |
| `embedding_chunks` | Chunk + pgvector embedding (Phase 1+ population) |

## Views

- `backlinks` — reverse index over resolved `links`.

## Source of truth

Markdown files in `workspaces/**/` are authoritative. Postgres is a derived index. If they disagree, run `bun run index:rebuild`.

## Migrations

Located under `db/supabase/migrations/`. Apply via `bun run db:migrate`. Reset via `bun run db:reset` (DROPS DATA, re-applies migrations + seed).
