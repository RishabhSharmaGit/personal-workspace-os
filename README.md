# Personal Workspace OS

Local-first, LLM-mediated knowledge ecosystem. Files are the source of truth; local Postgres holds a derived index. Claude Code is the primary operator.

## Layout

- `workspaces/` — purpose-driven knowledge workspaces (start: `second-brain`).
- `db/` — Supabase CLI config + raw SQL migrations.
- `scripts/` — Bun + TypeScript indexer, capture, query, and review utilities.
- `.claude/` — project-local skills and hooks for Claude Code.
- `_shared/templates/` — workspace scaffolding templates.
- `docs/superpowers/` — design specs (`specs/`) and implementation plans (`plans/`).

## Getting started

1. Copy `.env.example` to `.env` and fill in any API keys you need.
2. Run `bun install`.
3. Start local Postgres: `bun run db:start` (requires Docker).
4. Apply migrations: `bun run db:migrate`.
5. Open this folder in Claude Code; skills under `.claude/skills/` activate automatically.

See [`CLAUDE.md`](CLAUDE.md) for operating conventions.
