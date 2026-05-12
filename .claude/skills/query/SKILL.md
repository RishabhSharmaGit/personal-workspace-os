---
name: query
description: Use when user asks "what do I know about X", "find", "search", "have I seen", "summarize what I have on". Queries Postgres index, reads top candidate Markdown files, synthesizes an answer with [[slug]] citations.
---

# Query skill

## When to invoke

Trigger phrases: "what do I know about", "find", "search", "have I seen", "summarize what I have on", "look up".

## Pipeline

1. **Parse the query** for likely tags, slugs, and free-text terms.

2. **Run the indexer query** via `bun run scripts/query.ts --json '<args>'` or via Supabase MCP `execute_sql`. Pass a combination of `tags`, `text`, and `type` filters. Start broad (limit 10).

3. **If zero results**, broaden: drop the type filter, then drop tags, then try just text. If still nothing, report "no matches" and offer to capture related content.

4. **Read top 3–5 candidate files** with the Read tool to get full content.

5. **Synthesize** a 4–8 sentence answer that:
   - Directly answers what the user asked
   - Cites supporting items as `[[slug]]` inline
   - Notes any gaps ("I don't have anything on X")
   - Surfaces 1–2 backlinks if relevant — run `select i.slug, i.title from backlinks bl join items i on i.id = bl.from_item_id where bl.item_id in (select id from items where slug in (...))` via MCP

## Output

A synthesized answer block, then a "Sources" list of `[[slug]]` → file paths.

## Edge cases

- For "summarize" queries spanning many items, group by tag or type. Don't dump every item — synthesize.
- Distinguish between "I have these notes on X" and "I have these *sources about* X". Sources have URLs in frontmatter.
