---
name: index-rebuild
description: Use when user says "rebuild index", "reindex", "the index is stale", or after a database reset. Wipes derived Postgres tables (items, tags, item_tags, links, sources) and rebuilds them from the filesystem source of truth.
---

# Index Rebuild skill

## When to invoke

Trigger phrases: "rebuild index", "reindex", "index is stale", "DB looks wrong". Also after `bun run db:reset` (which wipes all data).

## Pipeline

1. **Confirm with the user** — this wipes derived data. Files are NOT touched, but anything in DB that *isn't* derived (agent_runs, captures) is preserved; everything else (items, tags, item_tags, links, sources) is regenerated.

2. Run `bun run scripts/index-rebuild.ts`.

3. Report the processed count + any errors logged.

4. Run a quick sanity check via Supabase MCP: `select type, count(*) from items group by type` — verify counts roughly match expectations.

## Edge cases

- If individual files fail to parse (invalid frontmatter), they are skipped with a warning to stderr and the rebuild continues. Fix the offending file's frontmatter and retry.
- If `agent_runs` references items that get re-created with new UUIDs, the foreign key is preserved but the run row's `item_id` will become orphaned (the column is `on delete set null`).
