---
name: weekly-review
description: Use when user says "weekly review", "weekly digest", or when running scheduled review via the `loop` plugin. Generates a Markdown digest in archive/weekly/YYYY-Www.md and appends a line to STATE.md.
---

# Weekly Review skill

## When to invoke

Trigger phrases: "weekly review", "weekly digest", scheduled review via the `loop` plugin (e.g. `/loop 1w /weekly-review`).

## Pipeline

1. Run `bun run scripts/weekly-review.ts`. This generates `workspaces/second-brain/archive/weekly/YYYY-Www.md` and appends a one-line note to the root `STATE.md`.

2. Read the generated file with the Read tool.

3. **Editorialize:** add a "Highlights" section at the top, written by you (Claude), pointing out 1–3 standout captures, notable patterns, or open threads worth attention. Write the file back via the Edit tool.

4. Surface to the user: a brief summary of the week + the file path.

## Output

- Path to the generated review file.
- 3–5 sentence summary of the week's activity.
- 1–2 suggestions for action (e.g. "you have 7 pending captures in inbox — want to triage?").
