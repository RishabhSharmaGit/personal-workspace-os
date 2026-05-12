---
slug: personal-workspace-os-bootstrap-design
title: Personal Workspace OS — Bootstrap & Second Brain Design
type: spec
status: draft
created: 2026-05-12
updated: 2026-05-12
tags: [architecture, workspace-os, second-brain, bootstrap, postgres, claude-code]
links: []
---

# Personal Workspace OS — Bootstrap & Second Brain Design

## 1. Overview

A local-first, LLM-mediated knowledge ecosystem rooted at `R:\Development\Workspace\`. Files (Markdown + YAML frontmatter) are the durable source of truth; a local Postgres database holds a derived, queryable index. Claude Code is the primary operator, driving capture, triage, retrieval, and review via project-local skills and hooks.

This spec covers **Phase 0** (bootstrap layer + the Second Brain workspace end-to-end) only. Career-OS, Body-OS, AI-Upskilling, Business-Ideation, Control Tower elaboration, mobile, and Supabase cloud sync are deferred to later specs.

### 1.1 Source brief

`personal-workspace-os-brief-for-claude.md` (in workspace root, by Codex, 2026-05-12). This spec deviates from the brief in the following material ways:

| Brief | This spec | Why |
|---|---|---|
| 6 workspaces scaffolded upfront | 1 workspace (Second Brain) built end-to-end first | Avoid premature standardization across 9 folders × 6 workspaces before any usage |
| `inbox/sources/notes/decisions/tasks/outputs/data/scripts/dashboards` per workspace | Lifecycle-typed folders only (`inbox/sources/notes/decisions/archive/`) per Second Brain | Drop folders that don't earn their keep in this workspace; re-introduce per workspace as needed |
| Postgres + ~25 domain tables | Postgres + 9 universal tables; domain tables added per workspace later | Defer schema speculation |
| Control Tower as workspace/agent | Thin `workspaces.json` registry + project-local skills | Avoid god-process growth |
| `_index/` JSON files | Postgres index | Single index store; rebuildable from filesystem |
| Python tooling | TypeScript via Bun | User preference; Bun's fast startup matters for the per-write indexer hook |
| Prisma for migrations | Supabase CLI + raw SQL migrations | Aligns with future hosted-Supabase path; no ORM lock-in; same toolchain local→cloud |
| Codex as primary operator | Claude Code as primary operator | Stronger ecosystem fit (skills/hooks/subagents/MCP) for the LLM-mediated pattern |

### 1.2 Operating mode (confirmed)

- **LLM-mediated everything** — user interacts via Claude Code chat; files are substrate.
- **Capture types** — URLs, social/video, chat exports, files (PDFs/screenshots/transcripts).
- **Triage** — confidence-gated hybrid: high-confidence items placed directly; low-confidence land in `inbox/` for batch review.
- **Repo** — single private monorepo on GitHub.
- **Tooling** — Bun + TypeScript for scripts.
- **Blobs** — raw binary captures gitignored, stored under `R:\Development\Workspace-blobs\` outside the repo; only extracted `.md` and metadata committed.

## 2. Scope (Phase 0)

### 2.1 In scope

1. Monorepo `git init`, `.gitignore`, top-level docs.
2. Top-level `CLAUDE.md`, `STATE.md`, `README.md`, `workspaces.json`.
3. Local Postgres via Supabase CLI (Docker-based); initial migration with 9 universal tables.
4. `db/schema.md` human-readable schema doc.
5. Bun + TypeScript script layer; indexer (`scripts/indexer.ts`) that parses MD frontmatter and upserts into Postgres.
6. Second Brain workspace skeleton with `CLAUDE.md`, `STATE.md`, `README.md`, and lifecycle folders.
7. `_shared/templates/workspace/` template directory.
8. Six project-local skills under `.claude/skills/`: `capture`, `query`, `triage-inbox`, `weekly-review`, `distill-chat`, `index-rebuild`.
9. Three hooks in `.claude/settings.json`: `SessionStart`, `PostToolUse` (on workspace `.md` writes), `Stop`.
10. Plugin/MCP wiring: enable Supabase MCP via the existing `supabase` plugin.
11. End-to-end smoke test: capture a URL → triage → query → result.

### 2.2 Out of scope (deferred)

- Other workspaces (Career-OS, Body-OS, AI-Upskilling, Business-Ideation, Archive workspace).
- Domain-specific Postgres tables (`career_applications`, `fitness_logs`, etc.).
- pgvector / embedding generation (table created empty; population deferred).
- Mobile/web app, Supabase cloud sync.
- GitHub MCP, Playwright MCP, Gmail/Calendar MCPs.
- Voice transcription pipeline.
- Subagent-driven parallel workflows.

## 3. Architecture

### 3.1 Folder layout

```text
R:\Development\Workspace\
  CLAUDE.md                         # top-level conventions
  README.md                         # human entry
  STATE.md                          # cross-workspace session log
  workspaces.json                   # workspace registry (also a Postgres table)
  package.json                      # Bun deps for scripts
  bun.lockb
  tsconfig.json
  .gitignore
  .env.example
  .env                              # gitignored
  .claude\
    settings.json                   # hooks + permissions (committed)
    settings.local.json             # personal overrides (gitignored)
    skills\
      capture\SKILL.md
      query\SKILL.md
      triage-inbox\SKILL.md
      weekly-review\SKILL.md
      distill-chat\SKILL.md
      index-rebuild\SKILL.md
  db\
    supabase\
      config.toml                   # supabase CLI local config
      migrations\
        20260512000000_init.sql
      seed.sql
    schema.md
  scripts\
    indexer.ts                      # parse MD frontmatter → upsert Postgres
    capture.ts                      # capture pipeline (URL/file/text/chat)
    triage.ts                       # inbox processor
    weekly-review.ts                # digest generator
    distill-chat.ts                 # chat-export parser
    index-rebuild.ts                # full filesystem→DB rebuild
    lib\
      db.ts                         # Bun.sql wrapper
      frontmatter.ts                # gray-matter wrapper + validation
      wikilinks.ts                  # parse/resolve [[slug]] refs
      slug.ts                       # slug generation, validation
      confidence.ts                 # triage confidence scoring
  workspaces\
    second-brain\
      CLAUDE.md
      STATE.md
      README.md
      inbox\
      sources\
      notes\
      decisions\
      archive\
  _shared\
    templates\
      workspace\
        CLAUDE.md.template
        STATE.md.template
        README.md.template
  docs\
    superpowers\
      specs\
        2026-05-12-personal-workspace-os-bootstrap-design.md
      plans\                        # writing-plans output next
  archive\                          # root-level: sunset workspaces
```

External (gitignored):
```text
R:\Development\Workspace-blobs\
  second-brain\
    sources\
      2026-05-12-some-pdf.pdf
      2026-05-12-screenshot.png
```

### 3.2 Storage model

| Layer | Holds | Source of truth |
|---|---|---|
| Markdown files | All knowledge content: notes, sources (extracted text), decisions, inbox captures | **Yes** |
| Postgres | Derived index: items, tags, wikilinks, sources, captures, agent runs | No (rebuildable) |
| `R:\Development\Workspace-blobs\` | Raw binary captures (PDFs, screenshots, videos, transcripts pre-extraction) | Yes for the raw bytes (no version control) |

Rule: if Postgres and Markdown disagree, Markdown wins. Run `index-rebuild` to reconcile.

### 3.3 Naming and linking conventions

**Slugs**
- Format: `kebab-case`, lowercase, ASCII.
- File name = slug + `.md`. Example: `notes/llm-wiki-pattern.md`.
- Date-prefixed for items where the date matters (inbox, sources, decisions, archive): `YYYY-MM-DD-<slug>.md`.
- Notes (durable, atomic) are NOT date-prefixed — they're concept-named.

**Wikilinks**
- Syntax: `[[slug]]` or `[[slug|display text]]`.
- Always resolve to a slug, not a path. Indexer resolves slug → item.
- Unresolved links are valid (target may be created later). Indexer records them with `to_item_id = NULL`.

**Frontmatter contract** (every file)
```yaml
---
slug: string                # unique within workspace; matches filename
title: string
type: note|source|decision|inbox|capture
status: raw|draft|durable|archived
tags: [string, ...]         # canonical kebab-case
links: ["[[slug]]", ...]    # outgoing wikilinks (optional; indexer also scans body)
source: string|null         # slug of the source this was derived from (if any)
confidence: low|medium|high
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

Optional source-specific fields (on `type: source`):
```yaml
source_url: string
source_fetched_at: ISO-8601
source_fetcher: firecrawl-scrape|firecrawl-instruct|manual|pdf|chat-export
source_content_hash: string
source_blob_path: string|null  # path under R:\Development\Workspace-blobs\
```

### 3.4 Confidence-gated triage rules

A captured item is placed **directly** in `notes/` or `decisions/` (skipping `inbox/`) when ALL of:
- Workspace can be determined unambiguously from content + context.
- At least one wikilink target exists in DB (anchor note).
- Type is unambiguous (a URL-derived summary → `source`; an extracted insight → `note`).
- LLM self-reported confidence is `high`.

Otherwise, item lands in `inbox/` with `status: raw` and `confidence: low|medium`, awaiting `triage-inbox`.

## 4. Database

### 4.1 Why Postgres (and not SQLite/files-only)

- User chose to standardize on Postgres now to avoid re-platforming later.
- Same schema runs against future hosted Supabase by changing only the connection string.
- pgvector extension available when embeddings are added (Phase 1+).
- Concurrent multi-script access (hook indexer + interactive queries + cron) is easier than SQLite.

### 4.2 Migration strategy: Supabase CLI

- Local Postgres ships via `supabase start` (Docker).
- Migrations are raw SQL under `db/supabase/migrations/<timestamp>_<name>.sql`.
- Apply via `supabase migration up` locally; identical command against hosted later.
- No ORM. Bun scripts use `Bun.sql` directly.
- Schema doc lives in `db/schema.md` and is updated whenever a migration is written.

### 4.3 Initial schema (`20260512000000_init.sql`)

```sql
-- Extensions
create extension if not exists "uuid-ossp";

-- Workspaces
create table workspaces (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  path text not null,
  description text,
  created_at timestamptz not null default now()
);

-- Items: every Markdown file in any workspace
create table items (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  slug text not null,
  file_path text unique not null,            -- relative to workspace root
  type text not null check (type in ('note','source','decision','inbox','capture')),
  status text not null check (status in ('raw','draft','durable','archived')),
  title text not null,
  frontmatter jsonb not null default '{}'::jsonb,
  content_hash text not null,
  confidence text check (confidence in ('low','medium','high')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, slug)
);
create index items_workspace_type_idx on items(workspace_id, type);
create index items_status_idx on items(status);
create index items_frontmatter_gin on items using gin (frontmatter);

-- Tags (workspace-scoped; cross-workspace tag table deferred to Phase 1+)
create table tags (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  slug text not null,
  name text not null,
  created_at timestamptz not null default now(),
  unique (workspace_id, slug)
);

create table item_tags (
  item_id uuid references items(id) on delete cascade,
  tag_id  uuid references tags(id)  on delete cascade,
  primary key (item_id, tag_id)
);

-- Wikilinks
create table links (
  id uuid primary key default uuid_generate_v4(),
  from_item_id uuid not null references items(id) on delete cascade,
  to_slug text not null,
  to_item_id uuid references items(id) on delete set null,  -- null = unresolved
  created_at timestamptz not null default now()
);
create index links_from_idx on links(from_item_id);
create index links_to_idx on links(to_item_id);

-- Backlinks as a view
create view backlinks as
  select to_item_id as item_id, from_item_id, created_at
  from links
  where to_item_id is not null;

-- Sources (URL/PDF/etc. provenance for items where type='source')
create table sources (
  id uuid primary key default uuid_generate_v4(),
  item_id uuid not null unique references items(id) on delete cascade,
  url text,
  fetch_date timestamptz,
  fetch_status text check (fetch_status in ('ok','partial','failed')),
  fetcher text check (fetcher in ('firecrawl-scrape','firecrawl-instruct','manual','pdf','chat-export')),
  content_hash text,
  blob_path text
);

-- Captures: inbox queue (DB-side mirror of inbox/ files for fast triage queries)
create table captures (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references workspaces(id) on delete set null,
  raw_input text not null,
  input_type text not null check (input_type in ('url','text','file','chat-export')),
  status text not null default 'pending' check (status in ('pending','triaged','filed','rejected')),
  item_id uuid references items(id) on delete set null,
  triage_reasoning text,
  created_at timestamptz not null default now(),
  triaged_at timestamptz
);
create index captures_status_idx on captures(status);

-- Agent runs (skill invocations)
create table agent_runs (
  id uuid primary key default uuid_generate_v4(),
  skill_name text not null,
  workspace_id uuid references workspaces(id) on delete set null,
  item_id uuid references items(id) on delete set null,
  status text not null check (status in ('started','succeeded','failed')),
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  summary text,
  error text
);
create index agent_runs_started_idx on agent_runs(started_at desc);

-- Embedding chunks (Phase 1+ population; table exists from Phase 0 for migration stability)
create extension if not exists vector;
create table embedding_chunks (
  id uuid primary key default uuid_generate_v4(),
  item_id uuid not null references items(id) on delete cascade,
  chunk_idx int not null,
  chunk_text text not null,
  embedding vector(1536),
  created_at timestamptz not null default now(),
  unique (item_id, chunk_idx)
);
```

Seed (`seed.sql`) inserts the Second Brain workspace row.

## 5. CLAUDE.md hierarchy

### 5.1 Top-level (`R:\Development\Workspace\CLAUDE.md`)

Contents:
1. **What this is** — one-paragraph statement of the OS.
2. **Operating mode** — LLM-mediated, confidence-gated capture, monorepo.
3. **Conventions** — slug format, wikilink syntax, frontmatter contract (full schema inline).
4. **Workspace map** — table of workspaces, slugs, paths, one-line purposes. Auto-syncable from `workspaces.json`.
5. **Skill index** — table of project-local skills with trigger phrases and when to invoke.
6. **Triage rules** — confidence-gated placement rules.
7. **Database** — pointers to `db/schema.md` and how to query (via Supabase MCP).
8. **Hooks** — what's wired and what they do.
9. **Files vs DB rule** — Markdown wins; run `index-rebuild` on disagreement.
10. **Secrets policy** — `.env` only, never inline; `settings.local.json` for personal overrides.
11. **Pointers** — `STATE.md` for current state, `workspaces.json` for registry.

### 5.2 Workspace-level (`workspaces\second-brain\CLAUDE.md`)

Contents:
1. **Purpose** — second brain for general knowledge, articles, ideas, chat distillations.
2. **What lives here** — knowledge; durable references.
3. **What does NOT** — time-bound operational tasks (go to Career-OS later), domain-specific trackers.
4. **Capture sources accepted** — URLs, social/video, chat exports, files.
5. **Lifecycle folders** — `inbox/sources/notes/decisions/archive/` with one-line each.
6. **Linking conventions** — atomic notes, link liberally, unresolved `[[slugs]]` are valid.
7. **Skills used** — capture, query, triage-inbox, weekly-review, distill-chat.

### 5.3 Subdirectory CLAUDE.md

Not created in Phase 0. YAGNI.

## 6. Skills

All six live under `.claude/skills/<name>/SKILL.md` and are invoked via the `Skill` tool from Claude Code conversations.

### 6.1 `capture`

- **Trigger phrases:** "save this", "capture", "add this", "remember this", URL paste, file path paste.
- **Inputs:** raw input + workspace hint (optional).
- **Pipeline:**
  1. Detect input type: url / text / file / chat-export.
  2. URLs → `firecrawl-scrape` (or `firecrawl-instruct` for auth/JS-heavy). Files → Read tool; large PDFs → blob copy + extracted text. Chat exports → invoke `distill-chat`.
  3. Compute content hash.
  4. LLM summarize → propose title, slug, tags, links, workspace, type, confidence.
  5. Apply triage rules (§3.4).
  6. Write `.md` file with frontmatter to the right folder.
  7. Append `INSERT INTO captures` row; on direct-place, also insert `items` row (via indexer) and update capture `status = 'filed'`.
- **Outputs:** file path, item slug, capture id.
- **DB effects:** `captures` insert; on direct-place, `items + item_tags + links + sources` via indexer.
- **`agent_runs` row:** always.

### 6.2 `query`

- **Trigger phrases:** "what do I know about X", "find", "search", "have I seen", "summarize what I have on".
- **Pipeline:**
  1. Parse query for tags, slugs, free-text.
  2. Query Postgres for candidates: tag match, link match, FTS over `items.title + frontmatter`.
  3. Phase 1+: vector search via `embedding_chunks`.
  4. Read top-K markdown files (default K=5).
  5. Synthesize answer with `[[slug]]` citations.
- **Output:** answer text + cited slugs.

### 6.3 `triage-inbox`

- **Trigger phrases:** "triage inbox", "process inbox", "what's in my inbox".
- **Pipeline:**
  1. Fetch `captures where status = 'pending'` and any orphan `inbox/*.md` files.
  2. For each, propose target workspace/type/folder + reasoning.
  3. Interactive mode (default): present each with [Accept/Edit/Skip/Reject].
  4. Auto mode (flag): execute high-confidence proposals; defer the rest.
  5. On accept: move file, update frontmatter, update DB.

### 6.4 `weekly-review`

- **Trigger phrases:** "weekly review", scheduled via `loop` plugin.
- **Pipeline:**
  1. Query items + agent_runs from last 7 days.
  2. Group by workspace and type.
  3. Generate `archive/weekly/YYYY-WW.md` digest with sections: captures, decisions, open inbox count, suggested links to surface.
  4. Append summary line to top-level `STATE.md`.

### 6.5 `distill-chat`

- **Trigger phrases:** "distill this chat", "extract from this conversation", paste of chat export.
- **Pipeline:**
  1. Detect chat format (ChatGPT JSON, Claude markdown export, Codex format, raw text).
  2. Segment by turn.
  3. Extract: decisions, code snippets, durable insights, action items, references to existing slugs.
  4. For each extraction, route through `capture` (preserving source attribution).
  5. Store the full chat as a `source`-type item in `sources/`.

### 6.6 `index-rebuild`

- **Trigger phrases:** "rebuild index", "reindex", "the index is stale".
- **Pipeline:**
  1. `BEGIN`.
  2. `DELETE FROM items, tags, item_tags, links, sources` (preserving `agent_runs`, `captures`).
  3. Walk `workspaces/**/*.md`. For each: parse frontmatter, validate, upsert.
  4. Second pass: resolve `links.to_slug` → `to_item_id` where target now exists.
  5. `COMMIT`.
- **Recovery tool only;** not invoked in normal use.

## 7. Hooks

Wired via `update-config` skill. Lives in `.claude/settings.json`.

| Hook | Matcher | Command |
|---|---|---|
| `SessionStart` | always | `bun run scripts/lib/session-start.ts` — prints `STATE.md` head + count of `captures where status='pending'` per workspace |
| `PostToolUse` | `Write` or `Edit` on file matching `workspaces/**/*.md` | `bun run scripts/indexer.ts <file>` — incremental upsert |
| `Stop` | always | `bun run scripts/lib/session-end.ts` — if any `agent_runs` in this session, append one line to `STATE.md` |

Settings fragment (will be wired by `update-config`):
```jsonc
{
  "hooks": {
    "SessionStart": [
      { "hooks": [{ "type": "command", "command": "bun run scripts/lib/session-start.ts" }] }
    ],
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "bun run scripts/indexer.ts \"$CLAUDE_TOOL_FILE_PATH\""
          }
        ]
      }
    ],
    "Stop": [
      { "hooks": [{ "type": "command", "command": "bun run scripts/lib/session-end.ts" }] }
    ]
  }
}
```

(Exact matcher syntax and env var names confirmed during implementation via `update-config` skill.)

## 8. Plugins and MCPs

### 8.1 Plugins already installed (in active use)

- `superpowers` — brainstorming, writing-plans, executing-plans, TDD, debugging, verification, requesting/receiving code review, subagent-driven-dev, parallel-agents, worktrees.
- `supabase` — Postgres migrations + Supabase MCP server.
- `firecrawl` — web ingestion: scrape, instruct, search, map, crawl, download.
- `ralph-loop`, `loop` — scheduled jobs.
- `update-config` — to wire hooks in `.claude/settings.json`.
- `claude-api` — future API-based scripts.
- `init`, `review`, `security-review`, `simplify`, `fewer-permission-prompts`.

### 8.2 MCPs to enable in Phase 0

- **Supabase MCP** — enabled when `supabase init` runs (comes with the supabase plugin). Provides SQL query access to Claude Code without writing Bun scripts for ad-hoc queries.

### 8.3 MCPs deferred (add when need surfaces)

- **GitHub MCP** — when monorepo gets pushed.
- **Playwright MCP** — for sites firecrawl-instruct can't handle.
- **Gmail / Calendar MCPs** — when Career-OS workspace is built.

### 8.4 NOT adding

- **Memory/knowledge-graph MCP** — Postgres `links` table + the `backlinks` view *is* the graph. Avoids two parallel memory systems.

## 9. Tooling

- **Runtime:** Bun (installed if not present; Node + `tsx` is the fallback runtime if Bun is unavailable, no code changes required as long as Bun-specific APIs are avoided).
- **Language:** TypeScript, strict mode.
- **Packages:**
  - `gray-matter` — frontmatter parse/stringify
  - `postgres` (or `Bun.sql` directly) — Postgres client
  - `commander` or `cac` — script CLIs
  - `zod` — frontmatter schema validation
- **No build step.** Scripts run directly via `bun run`.
- **Lint/format:** Biome (single tool covers both, fast).

## 10. Repo hygiene

### 10.1 `.gitignore`

```text
# secrets
.env
.env.*
!.env.example

# OS
.DS_Store
Thumbs.db
desktop.ini

# Bun / Node
node_modules/
*.log

# Supabase local
db/supabase/.temp/
db/supabase/.branches/

# Claude Code personal overrides
.claude/settings.local.json

# Raw blobs are stored OUTSIDE the repo
# (R:\Development\Workspace-blobs\) — nothing to ignore inside repo

# Local indexer cache (if any)
scripts/.cache/
```

### 10.2 Blob handling

- Raw binaries (PDFs, screenshots, videos, audio) live under `R:\Development\Workspace-blobs\<workspace-slug>\sources\`.
- The corresponding `.md` source file under `workspaces/<ws>/sources/` carries `source_blob_path` in frontmatter.
- Indexer copies the blob path into `sources.blob_path`.
- Loss of blobs directory is recoverable from original URLs (for firecrawl-derived) but not for user-uploaded files — user should back up `R:\Development\Workspace-blobs\` separately.

### 10.3 Commit hygiene

- Convention: prefix commits with workspace tag, e.g. `[second-brain] add karpathy llm wiki source`.
- Bootstrap/cross-cutting commits use `[bootstrap]`, `[db]`, `[skills]`, `[hooks]`.
- Spec/plan commits use `[docs]`.

### 10.4 Open-sourcing a workspace later

- One command: `git subtree split --prefix=workspaces/<slug> -b <slug>-public` extracts a clean history into a new branch, which can be pushed to a separate public repo.

## 11. Phased rollout

### 11.1 Phase 0 (this spec)

Order of implementation (the writing-plans skill will produce the detailed plan):

1. `git init` + `.gitignore` + root files (`README.md`, `STATE.md`, top-level `CLAUDE.md`, `workspaces.json`).
2. Bun install (if missing) + `package.json`, `tsconfig.json`, deps.
3. `supabase init` + `supabase start`.
4. Initial migration; apply locally. Update `db/schema.md`.
5. `scripts/lib/db.ts`, `scripts/lib/frontmatter.ts`, `scripts/lib/wikilinks.ts`, `scripts/lib/slug.ts`.
6. `scripts/indexer.ts` (the workhorse).
7. Second Brain skeleton + workspace `CLAUDE.md` + seed insert.
8. Six skills under `.claude/skills/`.
9. Hooks wired via `update-config`.
10. Smoke test: capture a URL, query for it, run weekly-review.

### 11.2 Phase 1 (after 2–4 weeks of real usage)

- Refine skills based on actual triage misses.
- Add `pgvector` embedding generation when content count > 50.
- Templatize Second Brain conventions into `_shared/templates/workspace/`.
- Add GitHub MCP; push the monorepo.

### 11.3 Phase 2

- Build Career-OS as the second workspace; introduces `tasks/` lifecycle folder + first domain tables (`career_applications`, `career_companies`).
- Add Gmail/Calendar MCPs.

### 11.4 Phase 3+

- Body-OS, AI-Upskilling, Business-Ideation.
- Mobile/web app via Supabase cloud sync (flip Postgres connection string).
- Voice transcription pipeline.
- Subagent-driven parallel review workflows.

## 12. Success criteria for Phase 0

End-to-end smoke test must pass:

1. **Capture** a URL: `"save this https://karpathy.ai/zero-to-hero.html"` → file appears under `workspaces/second-brain/sources/2026-MM-DD-zero-to-hero.md` OR `inbox/` if low confidence. Postgres `captures` and `items` rows exist.
2. **Query** the content: `"what do I know about Karpathy's Zero to Hero"` → returns a synthesized answer citing `[[zero-to-hero]]`.
3. **Triage**: place a low-confidence item; run `"triage my inbox"`; the item gets relocated and DB updated.
4. **Weekly review**: `"run weekly review"` produces `archive/weekly/2026-W19.md` and appends a line to `STATE.md`.
5. **Index rebuild**: delete `items` table contents; run `index-rebuild`; row counts match the markdown corpus.
6. **Hooks**: edit a note manually; verify Postgres reflects the change within seconds.

## 13. Open questions / deferred decisions

1. **Slug collisions across workspaces** — currently slugs are unique per workspace. Cross-workspace links use `[[workspace:slug]]` or just `[[slug]]` with a workspace hint. Decide at implementation time; default to `[[slug]]` with first-match resolution + warning.
2. **Manual edits to frontmatter** — should the indexer be strict (reject invalid frontmatter) or lenient (warn + skip)? Default: strict for `type` and `slug`; lenient elsewhere.
3. **Whether `decisions/` should be top-level or per-workspace** — currently per-workspace. Reconsider after Career-OS exists (some decisions are cross-workspace).
4. **Embedding model** — defer to Phase 1. Likely OpenAI `text-embedding-3-small` (1536d, fits the schema) or a local model via Ollama.
5. **Daily digest vs weekly only** — start weekly; add daily if it becomes useful.
6. **Whether the brief itself gets committed** — recommend committing `personal-workspace-os-brief-for-claude.md` to `docs/superpowers/specs/inputs/` for provenance.

## 14. Risks and mitigations

| Risk | Mitigation |
|---|---|
| LLM places items wrong; user doesn't notice for weeks | Weekly review surfaces a "recently placed by skill" section; confidence-gating biases low-conf items to inbox |
| Postgres / Markdown drift | `index-rebuild` is the reset button; hook keeps drift small |
| Bun unavailable on a future machine | Node + `tsx` fallback documented; avoid Bun-specific APIs |
| Blob loss (raw PDFs/images outside git) | Document backup expectation; for firecrawl-derived blobs, original URL allows re-fetch |
| Privacy bleed if repo ever made public | Repo private from day 1; `git subtree split` for per-workspace extraction |
| Schema speculation creep (re-adding 25 brief tables) | Strict rule: domain tables added only when a workspace using them is being built |
| Hook performance | Bun startup ~50ms; incremental indexer touches one file; should stay < 200ms per write |
| Secrets accidentally committed | `.env` in `.gitignore`; pre-commit hook later (Phase 1) to scan |

## 15. Next step

After user review of this spec, invoke the `writing-plans` skill to produce a detailed implementation plan for Phase 0.
