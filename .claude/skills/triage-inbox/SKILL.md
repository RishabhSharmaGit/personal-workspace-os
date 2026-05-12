---
name: triage-inbox
description: Use when user says "triage inbox", "process inbox", "what's in my inbox", or runs scheduled triage. Reviews pending captures + inbox/ files; proposes placements with reasoning; user confirms each (or auto-files high-confidence items).
---

# Triage Inbox skill

## When to invoke

Trigger phrases: "triage inbox", "process inbox", "what's in my inbox", "clean up inbox", scheduled triage runs.

## Pipeline

1. **Fetch pending items:**
   - `bun run scripts/triage.ts list-pending` — DB-side pending captures
   - `bun run scripts/triage.ts list-inbox second-brain` — inbox/ files

2. **For each item, propose a placement:**
   - Read the file (or capture raw_input) for context.
   - Decide: target folder (`notes`/`sources`/`decisions`/`archive`), new type, new status, any new tags or wikilinks to add.
   - Explain reasoning in 1–2 sentences.

3. **Interactive mode (default):** present each proposal with options: `[Accept]`, `[Edit and accept]`, `[Skip]`, `[Archive]`, `[Reject]`. Default to one item at a time. If user says "auto" or "yolo", switch to auto mode.

4. **Auto mode:** apply only proposals where you have high confidence (clear topic, anchor links exist, type obvious). Leave others for the user.

5. **Execute** accepted proposals via `bun run scripts/triage.ts file '<json>'`. The script updates frontmatter, moves the file, and the `PostToolUse` hook re-indexes it.

6. **Update captures row** if it was a DB-side pending capture: `update captures set status = 'filed', item_id = (select id from items where file_path = '<new path>'), triaged_at = now() where id = '<capture id>';` (via Supabase MCP `execute_sql`).

## Output

Per item: file path → new file path + reasoning. Summary at end: N filed, N archived, N skipped, N remaining.

## Edge cases

- If the inbox is empty, say so and offer to schedule the next run via the `loop` plugin.
- If the user objects to a proposal, ask for the correct placement and remember it for similar future items in this session.
