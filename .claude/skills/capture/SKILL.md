---
name: capture
description: Use when user says "save this", "capture", "add this", "remember this", or pastes a URL/file path/chat export. Routes through firecrawl/extraction, summarizes, applies confidence-gated triage, writes Markdown + frontmatter, and inserts DB row.
---

# Capture skill

## When to invoke

Trigger phrases: "save this", "capture", "add this", "remember this", "store this", a pasted URL on its own line, a pasted file path, or a pasted chat conversation.

## Inputs you need from the user (ask if missing)

1. The raw input: URL, file path, text blob, or chat export.
2. Workspace hint (optional). If unspecified and only one workspace exists, default to it (`second-brain`).
3. Any extra context (why they're saving it, what to call it).

## Pipeline

1. **Detect input type:**
   - URL (matches `^https?://`) → use firecrawl
   - File path under `R:\` → use Read tool; PDFs → extract text; images → describe + OCR if available
   - Chat export (multi-turn marker like "User:" / "Assistant:" / "ChatGPT" / "Claude" headers) → invoke the `distill-chat` skill instead
   - Otherwise treat as freeform text

2. **For URLs:** call the appropriate firecrawl tool — `firecrawl-scrape` for normal pages; `firecrawl-instruct` for auth/JS-heavy sites (X threads, Reddit, YouTube). Extract title, body markdown.

3. **For files:** Read the file. For large PDFs, copy the binary to `R:\Development\Workspace-blobs\second-brain\sources\<date>-<slug>.<ext>` and keep only extracted text in the workspace markdown.

4. **Summarize** the extracted content in 3–8 sentences. First consult `workspaces/<ws>/CONTEXT.md` (the shared-language glossary) if present, and use its canonical terms when choosing the slug/title/tags. Pick:
   - `slug` (kebab-case, derived from title)
   - `title`
   - `type` — usually `source` for URLs/files, `note` for distilled insights, `decision` for explicit decisions, `inbox` for low-confidence
   - `tags` (3–6, kebab-case)
   - `links` — any `[[existing-slug]]` references. Query the DB via Supabase MCP `execute_sql`: `select slug from items where workspace_id = (select id from workspaces where slug = 'second-brain')` to find anchor candidates.

5. **Score confidence** (the rules):
   - `high` only if: workspace unambiguous, at least one anchor `[[slug]]` exists in DB, type unambiguous
   - Otherwise `medium` (most cases) or `low` (ambiguous in multiple dimensions)

6. **Apply triage:**
   - `high` → place directly in `sources/` or `notes/` or `decisions/`
   - `medium` or `low` → place in `inbox/` with `status: raw`

7. **Write the file** via `bun run scripts/capture.ts --json '<args>'`. Pass: workspace, slug, title, type, status, tags, links, confidence, body. For URLs include `source.url`, `source.fetcher='firecrawl-scrape'` (or `firecrawl-instruct`), `source.fetchedAt` (ISO timestamp).

8. **Report** to user: path written, confidence, and any wikilinks created.

## Output

Tell the user:
- The file path written
- Confidence level + reasoning
- Anchor wikilinks found (or "none — landed in inbox for triage")

## Edge cases

- If the URL fetch fails partially, set `source.fetcher='firecrawl-scrape'` and `fetch_status='partial'`. Capture whatever was extracted; mark `status='raw'` and place in `inbox/`.
- If the slug collides with an existing file, append a short disambiguator (e.g. `-v2`) and warn the user.
- Never overwrite existing files.
