# Personal Workspace OS — Phase 0 Bootstrap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a working LLM-mediated personal knowledge OS at `R:\Development\Workspace\`: monorepo with local Postgres (Supabase CLI), TypeScript/Bun script layer, a fully functional Second Brain workspace, six project-local skills, three hooks, and an end-to-end smoke test passing.

**Architecture:** Markdown files (Bun + TypeScript scripts + YAML frontmatter) are the durable source of truth. Local Postgres holds a derived, queryable index, rebuildable from filesystem via `index-rebuild`. Claude Code is the LLM operator; skills orchestrate Claude + deterministic scripts. Hooks keep DB in sync with filesystem incrementally on every Markdown write.

**Tech Stack:** Bun, TypeScript (strict), Postgres 15+ (via Supabase CLI / Docker), `postgres` npm client, `gray-matter`, `zod`, Biome, Supabase MCP, Firecrawl plugin.

**Spec:** [`docs/superpowers/specs/2026-05-12-personal-workspace-os-bootstrap-design.md`](../specs/2026-05-12-personal-workspace-os-bootstrap-design.md)

---

## Prerequisites

Before starting any task, verify these are available:

- **Bun ≥ 1.1.0** — install on Windows: `powershell -c "irm bun.sh/install.ps1 | iex"`. Verify: `bun --version`.
- **Docker Desktop** running (Supabase CLI needs Docker for local Postgres). Verify: `docker ps`.
- **Supabase CLI** — install via scoop: `scoop install supabase` (or download from https://github.com/supabase/cli/releases). Verify: `supabase --version`.
- **Git** — already present (used for the spec commit).
- **Claude Code** with `supabase`, `firecrawl`, `superpowers`, `update-config` plugins available (already installed per session context).

If any prerequisite is missing, install before continuing.

---

## File structure (planned)

Every file the plan creates or modifies. Tasks below reference these paths.

```text
R:\Development\Workspace\
  .gitignore                              [Task 1]
  .env.example                            [Task 1]
  package.json                            [Task 1]
  tsconfig.json                           [Task 1]
  biome.json                              [Task 1]
  README.md                               [Task 2]
  STATE.md                                [Task 2]
  CLAUDE.md                               [Task 2]
  workspaces.json                         [Task 2]
  .claude\
    settings.json                         [Task 20]
    skills\
      capture\SKILL.md                    [Task 13]
      query\SKILL.md                      [Task 14]
      triage-inbox\SKILL.md               [Task 15]
      weekly-review\SKILL.md              [Task 16]
      distill-chat\SKILL.md               [Task 17]
      index-rebuild\SKILL.md              [Task 18]
  db\
    supabase\
      config.toml                         [Task 3 — generated]
      migrations\20260512000000_init.sql  [Task 4]
      seed.sql                            [Task 4]
    schema.md                             [Task 4]
  scripts\
    lib\
      db.ts                               [Task 5]
      slug.ts                             [Task 6]
      slug.test.ts                        [Task 6]
      wikilinks.ts                        [Task 7]
      wikilinks.test.ts                   [Task 7]
      frontmatter.ts                      [Task 8]
      frontmatter.test.ts                 [Task 8]
      confidence.ts                       [Task 9]
      confidence.test.ts                  [Task 9]
      session-start.ts                    [Task 19]
      session-end.ts                      [Task 19]
    indexer.ts                            [Task 10]
    indexer.test.ts                       [Task 10]
    capture.ts                            [Task 13]
    query.ts                              [Task 14]
    triage.ts                             [Task 15]
    weekly-review.ts                      [Task 16]
    distill-chat.ts                       [Task 17]
    index-rebuild.ts                      [Task 18]
  workspaces\
    second-brain\
      CLAUDE.md                           [Task 11]
      STATE.md                            [Task 11]
      README.md                           [Task 11]
      inbox\.gitkeep                      [Task 11]
      sources\.gitkeep                    [Task 11]
      notes\.gitkeep                      [Task 11]
      decisions\.gitkeep                  [Task 11]
      archive\.gitkeep                    [Task 11]
  _shared\
    templates\
      workspace\
        CLAUDE.md.template                [Task 12]
        STATE.md.template                 [Task 12]
        README.md.template                [Task 12]
```

External (gitignored, created on first capture):
```text
R:\Development\Workspace-blobs\second-brain\sources\
```

---

## Task 1: Repo bootstrap — Bun config, gitignore, env

**Files:**
- Create: `R:\Development\Workspace\.gitignore`
- Create: `R:\Development\Workspace\.env.example`
- Create: `R:\Development\Workspace\package.json`
- Create: `R:\Development\Workspace\tsconfig.json`
- Create: `R:\Development\Workspace\biome.json`

- [ ] **Step 1: Verify Bun is installed**

Run: `bun --version`
Expected: prints a version `≥ 1.1.0`. If missing, install via `powershell -c "irm bun.sh/install.ps1 | iex"` then re-verify.

- [ ] **Step 2: Create `.gitignore`**

Write `R:\Development\Workspace\.gitignore`:

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
bun.lockb

# Supabase local
db/supabase/.temp/
db/supabase/.branches/

# Claude Code personal overrides
.claude/settings.local.json

# Local indexer cache
scripts/.cache/
```

- [ ] **Step 3: Create `.env.example`**

Write `R:\Development\Workspace\.env.example`:

```text
# Local Supabase Postgres (populated after `supabase start`)
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres

# Used by firecrawl plugin and any direct API scripts
FIRECRAWL_API_KEY=
ANTHROPIC_API_KEY=
```

- [ ] **Step 4: Create `package.json`**

Write `R:\Development\Workspace\package.json`:

```json
{
  "name": "personal-workspace-os",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "bun test",
    "lint": "biome check .",
    "format": "biome format . --write",
    "db:start": "supabase start",
    "db:stop": "supabase stop",
    "db:reset": "supabase db reset",
    "db:migrate": "supabase migration up",
    "db:types": "supabase gen types typescript --local > scripts/lib/db-types.ts",
    "index:rebuild": "bun run scripts/index-rebuild.ts"
  },
  "dependencies": {
    "gray-matter": "^4.0.3",
    "postgres": "^3.4.4",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@biomejs/biome": "^1.9.4",
    "@types/bun": "^1.1.10",
    "typescript": "^5.5.4"
  }
}
```

- [ ] **Step 5: Create `tsconfig.json`**

Write `R:\Development\Workspace\tsconfig.json`:

```json
{
  "compilerOptions": {
    "lib": ["ESNext"],
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "types": ["bun-types"],
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "isolatedModules": true
  },
  "include": ["scripts/**/*", "*.ts"]
}
```

- [ ] **Step 6: Create `biome.json`**

Write `R:\Development\Workspace\biome.json`:

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "files": { "ignore": ["node_modules", "db/supabase/.temp", "_shared/templates"] },
  "formatter": { "indentStyle": "space", "indentWidth": 2, "lineWidth": 100 },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "style": { "noNonNullAssertion": "off" }
    }
  },
  "javascript": { "formatter": { "quoteStyle": "single", "semicolons": "always" } }
}
```

- [ ] **Step 7: Install deps**

Run: `bun install`
Expected: creates `node_modules/` and `bun.lockb` (which is gitignored). No errors.

- [ ] **Step 8: Verify formatter runs**

Run: `bun run lint`
Expected: exits 0 (nothing to lint yet, but config parses).

- [ ] **Step 9: Commit**

```powershell
git add .gitignore .env.example package.json tsconfig.json biome.json
git commit -m "[bootstrap] add Bun + TypeScript + Biome config and .gitignore"
```

---

## Task 2: Top-level docs — CLAUDE.md, README, STATE, workspaces.json

**Files:**
- Create: `R:\Development\Workspace\README.md`
- Create: `R:\Development\Workspace\STATE.md`
- Create: `R:\Development\Workspace\CLAUDE.md`
- Create: `R:\Development\Workspace\workspaces.json`

- [ ] **Step 1: Create `README.md`**

Write `R:\Development\Workspace\README.md`:

```markdown
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
```

- [ ] **Step 2: Create `STATE.md`**

Write `R:\Development\Workspace\STATE.md`:

```markdown
# Workspace OS — Current State

**Last updated:** 2026-05-12

## Active workspaces

- `second-brain` — general knowledge capture, retrieval, distillation.

## Open threads

- (none yet — bootstrap complete)

## Session log

(Sessions append one-line summaries here via the `Stop` hook.)
```

- [ ] **Step 3: Create top-level `CLAUDE.md`**

Write `R:\Development\Workspace\CLAUDE.md`:

```markdown
# Workspace OS — Operating Conventions

This file is loaded by Claude Code every session under this root.

## What this is

A local-first, LLM-mediated personal knowledge OS. Markdown files (with YAML frontmatter) are the durable source of truth. Local Postgres holds a derived, queryable index. You (Claude) are the operator; skills under `.claude/skills/` are how you do work here.

## Slug and filename rules

- Slugs are `kebab-case`, lowercase, ASCII. File name = slug + `.md`.
- Notes (durable, atomic) are concept-named, no date prefix: `notes/llm-wiki-pattern.md`.
- Inbox / sources / decisions / archive items are date-prefixed: `inbox/2026-05-12-some-url.md`.

## Wikilinks

- Syntax: `[[slug]]` or `[[slug|display text]]`.
- Resolve to a slug, not a path.
- Unresolved links are valid — the target may be created later. Indexer records them with `to_item_id = NULL`.

## Frontmatter contract

Every `.md` file in `workspaces/**/` carries:

\`\`\`yaml
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
\`\`\`

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
```

- [ ] **Step 4: Create `workspaces.json`**

Write `R:\Development\Workspace\workspaces.json`:

```json
{
  "version": 1,
  "workspaces": [
    {
      "slug": "second-brain",
      "name": "Second Brain",
      "path": "workspaces/second-brain",
      "description": "General knowledge capture, retrieval, and distillation. Articles, ideas, chat distillations, source references."
    }
  ]
}
```

- [ ] **Step 5: Commit**

```powershell
git add README.md STATE.md CLAUDE.md workspaces.json
git commit -m "[bootstrap] add top-level CLAUDE.md, README, STATE, workspaces registry"
```

---

## Task 3: Supabase local Postgres setup

**Files:**
- Create (via CLI): `R:\Development\Workspace\db\supabase\config.toml` and supporting files.

- [ ] **Step 1: Initialize Supabase project**

From `R:\Development\Workspace\`:

```powershell
mkdir db -Force | Out-Null
cd db
supabase init
cd ..
```

Expected: creates `db/supabase/config.toml`, `db/supabase/seed.sql`, `db/supabase/migrations/` directory. Prints "Finished supabase init."

- [ ] **Step 2: Adjust `config.toml` project_id**

Open `R:\Development\Workspace\db\supabase\config.toml` and ensure the first non-comment line reads:

```toml
project_id = "workspace-os"
```

(Default may already be acceptable; only change if the default conflicts.)

- [ ] **Step 3: Start the local stack**

Run: `bun run db:start`
Expected: pulls Docker images on first run, then prints connection details including `DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres`. Takes 30s–3min depending on first-pull.

- [ ] **Step 4: Verify Postgres is up**

Run: `supabase status`
Expected: shows `API URL`, `DB URL`, `Studio URL`, all listening.

- [ ] **Step 5: Copy `.env.example` to `.env`**

```powershell
Copy-Item .env.example .env
```

Then verify `.env` contains the correct `DATABASE_URL` (the URL printed by `supabase status` should match).

- [ ] **Step 6: Commit**

```powershell
git add db/supabase/config.toml db/supabase/seed.sql
git commit -m "[db] initialize Supabase CLI local stack"
```

(`.env` is gitignored and not committed.)

---

## Task 4: Initial migration — universal schema

**Files:**
- Create: `R:\Development\Workspace\db\supabase\migrations\20260512000000_init.sql`
- Modify: `R:\Development\Workspace\db\supabase\seed.sql`
- Create: `R:\Development\Workspace\db\schema.md`

- [ ] **Step 1: Write the migration**

Write `R:\Development\Workspace\db\supabase\migrations\20260512000000_init.sql`:

```sql
-- Phase 0 initial schema for Workspace OS
-- Spec: docs/superpowers/specs/2026-05-12-personal-workspace-os-bootstrap-design.md

create extension if not exists "uuid-ossp";
create extension if not exists vector;

-- ---------- workspaces ----------
create table workspaces (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  path text not null,
  description text,
  created_at timestamptz not null default now()
);

-- ---------- items ----------
create table items (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  slug text not null,
  file_path text unique not null,
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

-- ---------- tags ----------
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

-- ---------- wikilinks ----------
create table links (
  id uuid primary key default uuid_generate_v4(),
  from_item_id uuid not null references items(id) on delete cascade,
  to_slug text not null,
  to_item_id uuid references items(id) on delete set null,
  created_at timestamptz not null default now()
);
create index links_from_idx on links(from_item_id);
create index links_to_idx on links(to_item_id);

create view backlinks as
  select to_item_id as item_id, from_item_id, created_at
  from links
  where to_item_id is not null;

-- ---------- sources ----------
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

-- ---------- captures (inbox queue) ----------
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

-- ---------- agent_runs ----------
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

-- ---------- embedding_chunks (population deferred to Phase 1+) ----------
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

- [ ] **Step 2: Write seed**

Write `R:\Development\Workspace\db\supabase\seed.sql` (replace any existing content):

```sql
-- Seed: Second Brain workspace
insert into workspaces (slug, name, path, description)
values (
  'second-brain',
  'Second Brain',
  'workspaces/second-brain',
  'General knowledge capture, retrieval, and distillation.'
)
on conflict (slug) do nothing;
```

- [ ] **Step 3: Apply migration + seed**

```powershell
bun run db:reset
```

Expected: drops and recreates the local DB, runs the migration, runs seed, prints "Finished supabase db reset."

- [ ] **Step 4: Verify schema**

Run via the Supabase MCP server `list_tables` tool, or via psql:

```powershell
docker exec -i supabase_db_workspace-os psql -U postgres -d postgres -c "\dt"
```

Expected: lists `workspaces`, `items`, `tags`, `item_tags`, `links`, `sources`, `captures`, `agent_runs`, `embedding_chunks`. The `backlinks` view shows under `\dv`.

If the container name differs, find it via `docker ps --format "{{.Names}}"` (will be like `supabase_db_<project_id>`).

- [ ] **Step 5: Verify seed**

```powershell
docker exec -i supabase_db_workspace-os psql -U postgres -d postgres -c "select slug, name from workspaces;"
```

Expected: one row, `second-brain | Second Brain`.

- [ ] **Step 6: Write `db/schema.md`**

Write `R:\Development\Workspace\db\schema.md`:

```markdown
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
```

- [ ] **Step 7: Commit**

```powershell
git add db/supabase/migrations/20260512000000_init.sql db/supabase/seed.sql db/schema.md
git commit -m "[db] add initial migration with 9 tables + pgvector + seed"
```

---

## Task 5: `scripts/lib/db.ts` — Postgres client wrapper

**Files:**
- Create: `R:\Development\Workspace\scripts\lib\db.ts`

- [ ] **Step 1: Create directory**

```powershell
mkdir scripts/lib -Force | Out-Null
```

- [ ] **Step 2: Write `scripts/lib/db.ts`**

```typescript
import postgres from 'postgres';

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error('DATABASE_URL not set. Copy .env.example to .env and run `bun run db:start`.');
}

export const sql = postgres(url, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
  prepare: false,
});

export async function closeDb(): Promise<void> {
  await sql.end();
}

export type Workspace = {
  id: string;
  slug: string;
  name: string;
  path: string;
  description: string | null;
  created_at: Date;
};
```

- [ ] **Step 3: Smoke-test the connection**

Create a one-shot script file `scripts/lib/db.smoke.ts`:

```typescript
import { sql, closeDb } from './db.ts';

const rows = await sql<{ slug: string }[]>`select slug from workspaces order by slug`;
console.log('Workspaces:', rows.map((r) => r.slug));
await closeDb();
```

Run: `bun run scripts/lib/db.smoke.ts`
Expected: prints `Workspaces: [ "second-brain" ]`.

Delete the smoke script after verifying:

```powershell
Remove-Item scripts/lib/db.smoke.ts
```

- [ ] **Step 4: Commit**

```powershell
git add scripts/lib/db.ts
git commit -m "[scripts] add lib/db.ts Postgres wrapper"
```

---

## Task 6: `scripts/lib/slug.ts` — slug generation & validation (TDD)

**Files:**
- Create: `R:\Development\Workspace\scripts\lib\slug.test.ts`
- Create: `R:\Development\Workspace\scripts\lib\slug.ts`

- [ ] **Step 1: Write failing tests**

Write `R:\Development\Workspace\scripts\lib\slug.test.ts`:

```typescript
import { describe, expect, it } from 'bun:test';
import { isValidSlug, slugify, datePrefixedSlug } from './slug.ts';

describe('isValidSlug', () => {
  it('accepts kebab-case lowercase ASCII', () => {
    expect(isValidSlug('llm-wiki-pattern')).toBe(true);
    expect(isValidSlug('a')).toBe(true);
    expect(isValidSlug('a-b-c-1-2-3')).toBe(true);
  });

  it('rejects uppercase', () => {
    expect(isValidSlug('LLM-wiki')).toBe(false);
  });

  it('rejects spaces and underscores', () => {
    expect(isValidSlug('llm wiki')).toBe(false);
    expect(isValidSlug('llm_wiki')).toBe(false);
  });

  it('rejects leading/trailing/consecutive hyphens', () => {
    expect(isValidSlug('-foo')).toBe(false);
    expect(isValidSlug('foo-')).toBe(false);
    expect(isValidSlug('foo--bar')).toBe(false);
  });

  it('rejects empty', () => {
    expect(isValidSlug('')).toBe(false);
  });
});

describe('slugify', () => {
  it('lowercases and replaces spaces with hyphens', () => {
    expect(slugify('LLM Wiki Pattern')).toBe('llm-wiki-pattern');
  });

  it('strips punctuation', () => {
    expect(slugify("Karpathy's Zero to Hero!")).toBe('karpathys-zero-to-hero');
  });

  it('collapses runs of non-alphanumerics', () => {
    expect(slugify('foo --- bar  ___  baz')).toBe('foo-bar-baz');
  });

  it('trims leading/trailing hyphens', () => {
    expect(slugify('---foo---')).toBe('foo');
  });

  it('produces a valid slug', () => {
    expect(isValidSlug(slugify('Hello, World!'))).toBe(true);
  });
});

describe('datePrefixedSlug', () => {
  it('prepends ISO date', () => {
    expect(datePrefixedSlug('2026-05-12', 'some-url')).toBe('2026-05-12-some-url');
  });

  it('result is a valid slug', () => {
    expect(isValidSlug(datePrefixedSlug('2026-05-12', 'some-url'))).toBe(true);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `bun test scripts/lib/slug.test.ts`
Expected: FAIL — `Cannot find module './slug.ts'`.

- [ ] **Step 3: Implement `scripts/lib/slug.ts`**

```typescript
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidSlug(s: string): boolean {
  return s.length > 0 && SLUG_RE.test(s);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function datePrefixedSlug(isoDate: string, slug: string): string {
  return `${isoDate}-${slug}`;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `bun test scripts/lib/slug.test.ts`
Expected: all 12 assertions PASS.

- [ ] **Step 5: Commit**

```powershell
git add scripts/lib/slug.ts scripts/lib/slug.test.ts
git commit -m "[scripts] add lib/slug.ts with TDD tests for slug validation/generation"
```

---

## Task 7: `scripts/lib/wikilinks.ts` — parse `[[slug|display]]` (TDD)

**Files:**
- Create: `R:\Development\Workspace\scripts\lib\wikilinks.test.ts`
- Create: `R:\Development\Workspace\scripts\lib\wikilinks.ts`

- [ ] **Step 1: Write failing tests**

Write `R:\Development\Workspace\scripts\lib\wikilinks.test.ts`:

```typescript
import { describe, expect, it } from 'bun:test';
import { extractWikilinks } from './wikilinks.ts';

describe('extractWikilinks', () => {
  it('extracts a single link', () => {
    expect(extractWikilinks('see [[zero-to-hero]] for details')).toEqual([
      { slug: 'zero-to-hero', display: null },
    ]);
  });

  it('extracts a link with display text', () => {
    expect(extractWikilinks('see [[zero-to-hero|Karpathy\'s course]]')).toEqual([
      { slug: 'zero-to-hero', display: "Karpathy's course" },
    ]);
  });

  it('extracts multiple links', () => {
    expect(extractWikilinks('[[a]] and [[b|B label]] and [[c]]')).toEqual([
      { slug: 'a', display: null },
      { slug: 'b', display: 'B label' },
      { slug: 'c', display: null },
    ]);
  });

  it('returns empty array when no links', () => {
    expect(extractWikilinks('plain text with no links')).toEqual([]);
  });

  it('ignores malformed links', () => {
    expect(extractWikilinks('[[ ]] [[]] [[Capital]]')).toEqual([]);
  });

  it('deduplicates same-slug occurrences', () => {
    expect(extractWikilinks('[[foo]] and [[foo|Foo]] and [[foo]]')).toEqual([
      { slug: 'foo', display: null },
      { slug: 'foo', display: 'Foo' },
    ]);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `bun test scripts/lib/wikilinks.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `scripts/lib/wikilinks.ts`**

```typescript
import { isValidSlug } from './slug.ts';

export type Wikilink = {
  slug: string;
  display: string | null;
};

const LINK_RE = /\[\[([^\]\|]+?)(?:\|([^\]]+))?\]\]/g;

export function extractWikilinks(markdown: string): Wikilink[] {
  const seen = new Set<string>();
  const out: Wikilink[] = [];
  for (const m of markdown.matchAll(LINK_RE)) {
    const slug = m[1]?.trim();
    const display = m[2]?.trim() ?? null;
    if (!slug || !isValidSlug(slug)) continue;
    const key = `${slug}|${display ?? ''}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ slug, display });
  }
  return out;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `bun test scripts/lib/wikilinks.test.ts`
Expected: all 6 tests PASS.

- [ ] **Step 5: Commit**

```powershell
git add scripts/lib/wikilinks.ts scripts/lib/wikilinks.test.ts
git commit -m "[scripts] add lib/wikilinks.ts with TDD tests for [[slug]] extraction"
```

---

## Task 8: `scripts/lib/frontmatter.ts` — parse + validate frontmatter (TDD)

**Files:**
- Create: `R:\Development\Workspace\scripts\lib\frontmatter.test.ts`
- Create: `R:\Development\Workspace\scripts\lib\frontmatter.ts`

- [ ] **Step 1: Write failing tests**

Write `R:\Development\Workspace\scripts\lib\frontmatter.test.ts`:

```typescript
import { describe, expect, it } from 'bun:test';
import { parseDocument, FrontmatterSchema } from './frontmatter.ts';

const validDoc = `---
slug: llm-wiki-pattern
title: LLM Wiki Pattern
type: note
status: durable
tags: [llm, knowledge]
links: ["[[evergreen-notes]]"]
source: null
confidence: high
created: 2026-05-12
updated: 2026-05-12
---

Body text with [[evergreen-notes]] inline.
`;

describe('parseDocument', () => {
  it('parses valid frontmatter + body', () => {
    const doc = parseDocument(validDoc);
    expect(doc.frontmatter.slug).toBe('llm-wiki-pattern');
    expect(doc.frontmatter.type).toBe('note');
    expect(doc.frontmatter.tags).toEqual(['llm', 'knowledge']);
    expect(doc.body.trim()).toContain('[[evergreen-notes]]');
  });

  it('throws on missing required fields', () => {
    const bad = `---
title: missing slug
type: note
---
body`;
    expect(() => parseDocument(bad)).toThrow();
  });

  it('throws on invalid type enum', () => {
    const bad = `---
slug: foo
title: Foo
type: notarealtype
status: durable
tags: []
links: []
source: null
confidence: high
created: 2026-05-12
updated: 2026-05-12
---
body`;
    expect(() => parseDocument(bad)).toThrow();
  });

  it('throws on invalid slug', () => {
    const bad = `---
slug: NotKebabCase
title: Foo
type: note
status: durable
tags: []
links: []
source: null
confidence: high
created: 2026-05-12
updated: 2026-05-12
---
body`;
    expect(() => parseDocument(bad)).toThrow();
  });

  it('accepts source-type optional fields', () => {
    const sourceDoc = `---
slug: 2026-05-12-karpathy-zero
title: Karpathy Zero to Hero
type: source
status: durable
tags: []
links: []
source: null
confidence: high
created: 2026-05-12
updated: 2026-05-12
source_url: https://karpathy.ai/zero-to-hero.html
source_fetched_at: 2026-05-12T10:00:00Z
source_fetcher: firecrawl-scrape
source_content_hash: abc123
source_blob_path: null
---
extracted text`;
    const doc = parseDocument(sourceDoc);
    expect(doc.frontmatter.source_url).toBe('https://karpathy.ai/zero-to-hero.html');
    expect(doc.frontmatter.source_fetcher).toBe('firecrawl-scrape');
  });
});

describe('FrontmatterSchema', () => {
  it('exports a zod schema', () => {
    const result = FrontmatterSchema.safeParse({
      slug: 'foo',
      title: 'Foo',
      type: 'note',
      status: 'durable',
      tags: [],
      links: [],
      source: null,
      confidence: 'high',
      created: '2026-05-12',
      updated: '2026-05-12',
    });
    expect(result.success).toBe(true);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `bun test scripts/lib/frontmatter.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `scripts/lib/frontmatter.ts`**

```typescript
import matter from 'gray-matter';
import { z } from 'zod';
import { isValidSlug } from './slug.ts';

const slugSchema = z.string().refine(isValidSlug, { message: 'invalid slug' });

export const FrontmatterSchema = z.object({
  slug: slugSchema,
  title: z.string().min(1),
  type: z.enum(['note', 'source', 'decision', 'inbox', 'capture']),
  status: z.enum(['raw', 'draft', 'durable', 'archived']),
  tags: z.array(z.string()).default([]),
  links: z.array(z.string()).default([]),
  source: z.string().nullable().default(null),
  confidence: z.enum(['low', 'medium', 'high']).optional(),
  created: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  // source-only optional fields
  source_url: z.string().url().optional(),
  source_fetched_at: z.string().optional(),
  source_fetcher: z
    .enum(['firecrawl-scrape', 'firecrawl-instruct', 'manual', 'pdf', 'chat-export'])
    .optional(),
  source_content_hash: z.string().optional(),
  source_blob_path: z.string().nullable().optional(),
});

export type Frontmatter = z.infer<typeof FrontmatterSchema>;

export type ParsedDocument = {
  frontmatter: Frontmatter;
  body: string;
};

export function parseDocument(raw: string): ParsedDocument {
  const parsed = matter(raw);
  const fm = FrontmatterSchema.parse(parsed.data);
  return { frontmatter: fm, body: parsed.content };
}

export function stringifyDocument(fm: Frontmatter, body: string): string {
  return matter.stringify(body, fm as Record<string, unknown>);
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `bun test scripts/lib/frontmatter.test.ts`
Expected: all 6 tests PASS.

- [ ] **Step 5: Commit**

```powershell
git add scripts/lib/frontmatter.ts scripts/lib/frontmatter.test.ts
git commit -m "[scripts] add lib/frontmatter.ts with zod schema + TDD tests"
```

---

## Task 9: `scripts/lib/confidence.ts` — deterministic triage scoring (TDD)

**Files:**
- Create: `R:\Development\Workspace\scripts\lib\confidence.test.ts`
- Create: `R:\Development\Workspace\scripts\lib\confidence.ts`

- [ ] **Step 1: Write failing tests**

Write `R:\Development\Workspace\scripts\lib\confidence.test.ts`:

```typescript
import { describe, expect, it } from 'bun:test';
import { scoreConfidence } from './confidence.ts';

describe('scoreConfidence', () => {
  it('returns high when workspace + anchor + unambiguous type', () => {
    expect(
      scoreConfidence({
        workspaceResolved: true,
        anchorLinksExist: true,
        typeUnambiguous: true,
        llmSelfReport: 'high',
      }),
    ).toBe('high');
  });

  it('returns medium when one criterion fails', () => {
    expect(
      scoreConfidence({
        workspaceResolved: true,
        anchorLinksExist: false,
        typeUnambiguous: true,
        llmSelfReport: 'high',
      }),
    ).toBe('medium');
  });

  it('returns low when two or more criteria fail', () => {
    expect(
      scoreConfidence({
        workspaceResolved: false,
        anchorLinksExist: false,
        typeUnambiguous: true,
        llmSelfReport: 'high',
      }),
    ).toBe('low');
  });

  it('caps at LLM self-report ceiling', () => {
    expect(
      scoreConfidence({
        workspaceResolved: true,
        anchorLinksExist: true,
        typeUnambiguous: true,
        llmSelfReport: 'low',
      }),
    ).toBe('low');
  });

  it('caps medium when LLM says medium even if all criteria met', () => {
    expect(
      scoreConfidence({
        workspaceResolved: true,
        anchorLinksExist: true,
        typeUnambiguous: true,
        llmSelfReport: 'medium',
      }),
    ).toBe('medium');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `bun test scripts/lib/confidence.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `scripts/lib/confidence.ts`**

```typescript
export type ConfidenceLevel = 'low' | 'medium' | 'high';

export type ConfidenceInputs = {
  workspaceResolved: boolean;
  anchorLinksExist: boolean;
  typeUnambiguous: boolean;
  llmSelfReport: ConfidenceLevel;
};

const RANK: Record<ConfidenceLevel, number> = { low: 0, medium: 1, high: 2 };
const FROM_RANK: ConfidenceLevel[] = ['low', 'medium', 'high'];

export function scoreConfidence(inputs: ConfidenceInputs): ConfidenceLevel {
  const passes =
    Number(inputs.workspaceResolved) +
    Number(inputs.anchorLinksExist) +
    Number(inputs.typeUnambiguous);

  // 3/3 → high candidate, 2/3 → medium, ≤1 → low
  let ruleLevel: ConfidenceLevel;
  if (passes === 3) ruleLevel = 'high';
  else if (passes === 2) ruleLevel = 'medium';
  else ruleLevel = 'low';

  // Cap by LLM self-report ceiling
  const cappedRank = Math.min(RANK[ruleLevel], RANK[inputs.llmSelfReport]);
  return FROM_RANK[cappedRank]!;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `bun test scripts/lib/confidence.test.ts`
Expected: all 5 tests PASS.

- [ ] **Step 5: Commit**

```powershell
git add scripts/lib/confidence.ts scripts/lib/confidence.test.ts
git commit -m "[scripts] add lib/confidence.ts with TDD tests for triage scoring"
```

---

## Task 10: `scripts/indexer.ts` — parse MD, upsert to Postgres (TDD)

**Files:**
- Create: `R:\Development\Workspace\scripts\indexer.test.ts`
- Create: `R:\Development\Workspace\scripts\indexer.ts`

The indexer is invoked two ways:
1. By the `PostToolUse` hook with one file path → incremental upsert.
2. By `index-rebuild` over many files → batch upsert.

This task implements (1). Task 18 wires up (2).

- [ ] **Step 1: Write failing test**

Write `R:\Development\Workspace\scripts\indexer.test.ts`:

```typescript
import { beforeAll, afterAll, beforeEach, describe, expect, it } from 'bun:test';
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { sql, closeDb } from './lib/db.ts';
import { indexOneFile } from './indexer.ts';

let tmpRoot: string;
let workspaceId: string;

const sampleNote = `---
slug: llm-wiki-pattern
title: LLM Wiki Pattern
type: note
status: durable
tags: [llm, knowledge]
links: []
source: null
confidence: high
created: 2026-05-12
updated: 2026-05-12
---

Body with [[evergreen-notes]] reference.
`;

beforeAll(async () => {
  tmpRoot = mkdtempSync(join(tmpdir(), 'wsos-test-'));
  // Use the existing seeded workspace
  const rows = await sql<{ id: string }[]>`select id from workspaces where slug = 'second-brain'`;
  workspaceId = rows[0]!.id;
});

afterAll(async () => {
  rmSync(tmpRoot, { recursive: true, force: true });
  await closeDb();
});

beforeEach(async () => {
  // Clean items used by this test (cascades to tags/links/sources via FK).
  await sql`
    delete from items
    where workspace_id = ${workspaceId}
      and (slug like 'test-%' or slug = 'llm-wiki-pattern' or slug = 'evergreen-notes')
  `;
});

describe('indexOneFile', () => {
  it('upserts an item row with tags and links', async () => {
    const notesDir = join(tmpRoot, 'workspaces', 'second-brain', 'notes');
    mkdirSync(notesDir, { recursive: true });
    const filePath = join(notesDir, 'llm-wiki-pattern.md');
    writeFileSync(filePath, sampleNote, 'utf8');

    await indexOneFile(filePath, tmpRoot);

    const items = await sql<{ slug: string; title: string; type: string }[]>`
      select slug, title, type from items where slug = 'llm-wiki-pattern'
    `;
    expect(items.length).toBe(1);
    expect(items[0]!.type).toBe('note');

    const tags = await sql<{ slug: string }[]>`
      select t.slug from tags t join item_tags it on it.tag_id = t.id
      join items i on i.id = it.item_id where i.slug = 'llm-wiki-pattern' order by t.slug
    `;
    expect(tags.map((t) => t.slug)).toEqual(['knowledge', 'llm']);

    const links = await sql<{ to_slug: string; to_item_id: string | null }[]>`
      select to_slug, to_item_id from links l join items i on i.id = l.from_item_id
      where i.slug = 'llm-wiki-pattern'
    `;
    expect(links.length).toBe(1);
    expect(links[0]!.to_slug).toBe('evergreen-notes');
    expect(links[0]!.to_item_id).toBeNull();
  });

  it('is idempotent on re-index (UPDATE not duplicate INSERT)', async () => {
    const notesDir = join(tmpRoot, 'workspaces', 'second-brain', 'notes');
    mkdirSync(notesDir, { recursive: true });
    const filePath = join(notesDir, 'llm-wiki-pattern.md');
    writeFileSync(filePath, sampleNote, 'utf8');

    await indexOneFile(filePath, tmpRoot);
    await indexOneFile(filePath, tmpRoot);

    const items = await sql<{ count: string }[]>`
      select count(*) from items where slug = 'llm-wiki-pattern'
    `;
    expect(Number(items[0]!.count)).toBe(1);
  });

  it('resolves to_item_id on second pass when target now exists', async () => {
    const notesDir = join(tmpRoot, 'workspaces', 'second-brain', 'notes');
    mkdirSync(notesDir, { recursive: true });

    const referrer = join(notesDir, 'llm-wiki-pattern.md');
    writeFileSync(referrer, sampleNote, 'utf8');
    await indexOneFile(referrer, tmpRoot);

    const targetContent = sampleNote
      .replace('slug: llm-wiki-pattern', 'slug: evergreen-notes')
      .replace('title: LLM Wiki Pattern', 'title: Evergreen Notes');
    const target = join(notesDir, 'evergreen-notes.md');
    writeFileSync(target, targetContent, 'utf8');
    await indexOneFile(target, tmpRoot);

    const links = await sql<{ to_item_id: string | null }[]>`
      select to_item_id from links l join items i on i.id = l.from_item_id
      where i.slug = 'llm-wiki-pattern' and l.to_slug = 'evergreen-notes'
    `;
    expect(links[0]!.to_item_id).not.toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test scripts/indexer.test.ts`
Expected: FAIL — `Cannot find module './indexer.ts'`.

- [ ] **Step 3: Implement `scripts/indexer.ts`**

```typescript
import { readFileSync, existsSync, statSync } from 'node:fs';
import { relative, sep } from 'node:path';
import { createHash } from 'node:crypto';
import { sql } from './lib/db.ts';
import { parseDocument } from './lib/frontmatter.ts';
import { extractWikilinks } from './lib/wikilinks.ts';

function hashContent(s: string): string {
  return createHash('sha256').update(s).digest('hex');
}

function workspaceSlugFromPath(absPath: string, repoRoot: string): string | null {
  const rel = relative(repoRoot, absPath).split(sep);
  if (rel[0] !== 'workspaces' || !rel[1]) return null;
  return rel[1];
}

export async function indexOneFile(absPath: string, repoRoot: string): Promise<void> {
  if (!existsSync(absPath)) {
    // File deleted — remove from index
    const relPath = relative(repoRoot, absPath).replaceAll(sep, '/');
    await sql`delete from items where file_path = ${relPath}`;
    return;
  }
  if (!absPath.endsWith('.md')) return;
  if (!statSync(absPath).isFile()) return;

  const wsSlug = workspaceSlugFromPath(absPath, repoRoot);
  if (!wsSlug) return; // not under workspaces/

  const wsRows = await sql<{ id: string }[]>`
    select id from workspaces where slug = ${wsSlug}
  `;
  if (wsRows.length === 0) {
    throw new Error(`Workspace not registered: ${wsSlug}`);
  }
  const workspaceId = wsRows[0]!.id;

  const raw = readFileSync(absPath, 'utf8');
  const { frontmatter: fm, body } = parseDocument(raw);
  const relPath = relative(repoRoot, absPath).replaceAll(sep, '/');
  const contentHash = hashContent(raw);

  // 1. Upsert item
  const itemRows = await sql<{ id: string }[]>`
    insert into items (workspace_id, slug, file_path, type, status, title, frontmatter, content_hash, confidence, updated_at)
    values (
      ${workspaceId}, ${fm.slug}, ${relPath}, ${fm.type}, ${fm.status},
      ${fm.title}, ${sql.json(fm)}, ${contentHash}, ${fm.confidence ?? null}, now()
    )
    on conflict (workspace_id, slug) do update set
      file_path = excluded.file_path,
      type = excluded.type,
      status = excluded.status,
      title = excluded.title,
      frontmatter = excluded.frontmatter,
      content_hash = excluded.content_hash,
      confidence = excluded.confidence,
      updated_at = now()
    returning id
  `;
  const itemId = itemRows[0]!.id;

  // 2. Replace tags
  await sql`delete from item_tags where item_id = ${itemId}`;
  for (const tagSlug of fm.tags) {
    const tagRows = await sql<{ id: string }[]>`
      insert into tags (workspace_id, slug, name)
      values (${workspaceId}, ${tagSlug}, ${tagSlug})
      on conflict (workspace_id, slug) do update set name = excluded.name
      returning id
    `;
    await sql`
      insert into item_tags (item_id, tag_id) values (${itemId}, ${tagRows[0]!.id})
      on conflict do nothing
    `;
  }

  // 3. Replace links (body + frontmatter.links field)
  await sql`delete from links where from_item_id = ${itemId}`;
  const fromBody = extractWikilinks(body);
  const fromMeta = (fm.links ?? []).flatMap((l) => extractWikilinks(l));
  const allLinks = [...fromBody, ...fromMeta];
  const seenSlugs = new Set<string>();
  for (const { slug: toSlug } of allLinks) {
    if (seenSlugs.has(toSlug)) continue;
    seenSlugs.add(toSlug);
    const targetRows = await sql<{ id: string }[]>`
      select id from items where workspace_id = ${workspaceId} and slug = ${toSlug} limit 1
    `;
    const toItemId = targetRows[0]?.id ?? null;
    await sql`
      insert into links (from_item_id, to_slug, to_item_id)
      values (${itemId}, ${toSlug}, ${toItemId})
    `;
  }

  // 4. Resolve any pending links that point to this slug
  await sql`
    update links set to_item_id = ${itemId}
    where to_slug = ${fm.slug} and to_item_id is null
      and from_item_id in (select id from items where workspace_id = ${workspaceId})
  `;
}

// CLI entry point: bun run scripts/indexer.ts <file>
if (import.meta.main) {
  const arg = process.argv[2];
  if (!arg) {
    console.error('Usage: bun run scripts/indexer.ts <file>');
    process.exit(2);
  }
  const repoRoot = process.cwd();
  await indexOneFile(arg, repoRoot);
  await sql.end();
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `bun test scripts/indexer.test.ts`
Expected: all 3 tests PASS.

- [ ] **Step 5: Commit**

```powershell
git add scripts/indexer.ts scripts/indexer.test.ts
git commit -m "[scripts] add indexer.ts with TDD tests for incremental upsert + link resolution"
```

---

## Task 11: Second Brain workspace skeleton

**Files:**
- Create: `R:\Development\Workspace\workspaces\second-brain\CLAUDE.md`
- Create: `R:\Development\Workspace\workspaces\second-brain\STATE.md`
- Create: `R:\Development\Workspace\workspaces\second-brain\README.md`
- Create: `R:\Development\Workspace\workspaces\second-brain\{inbox,sources,notes,decisions,archive}\.gitkeep`

- [ ] **Step 1: Create directory structure**

```powershell
mkdir workspaces/second-brain/inbox -Force | Out-Null
mkdir workspaces/second-brain/sources -Force | Out-Null
mkdir workspaces/second-brain/notes -Force | Out-Null
mkdir workspaces/second-brain/decisions -Force | Out-Null
mkdir workspaces/second-brain/archive -Force | Out-Null
```

- [ ] **Step 2: Create `.gitkeep` files**

```powershell
New-Item workspaces/second-brain/inbox/.gitkeep -ItemType File -Force | Out-Null
New-Item workspaces/second-brain/sources/.gitkeep -ItemType File -Force | Out-Null
New-Item workspaces/second-brain/notes/.gitkeep -ItemType File -Force | Out-Null
New-Item workspaces/second-brain/decisions/.gitkeep -ItemType File -Force | Out-Null
New-Item workspaces/second-brain/archive/.gitkeep -ItemType File -Force | Out-Null
```

- [ ] **Step 3: Write workspace `README.md`**

Write `R:\Development\Workspace\workspaces\second-brain\README.md`:

```markdown
# Second Brain

General-purpose knowledge workspace: articles, ideas, references, chat distillations.

## Lifecycle folders

- `inbox/` — raw, untriaged captures (low/medium confidence)
- `sources/` — external content cached locally (firecrawl scrapes, PDF extracts, chat exports)
- `notes/` — durable atomic notes (concept-named, no date prefix)
- `decisions/` — meta-decisions about how the brain itself is organized
- `archive/` — demoted but preserved
```

- [ ] **Step 4: Write workspace `STATE.md`**

Write `R:\Development\Workspace\workspaces\second-brain\STATE.md`:

```markdown
# Second Brain — State

**Last updated:** 2026-05-12

## Open threads

- (none yet)

## Recent activity

- 2026-05-12: workspace initialized.
```

- [ ] **Step 5: Write workspace `CLAUDE.md`**

Write `R:\Development\Workspace\workspaces\second-brain\CLAUDE.md`:

```markdown
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
```

- [ ] **Step 6: Verify seed insert still in place**

The Second Brain workspace row should already exist from Task 3 seed. Verify:

```powershell
docker exec -i supabase_db_workspace-os psql -U postgres -d postgres -c "select slug, path from workspaces;"
```

Expected: `second-brain | workspaces/second-brain`.

- [ ] **Step 7: Commit**

```powershell
git add workspaces/second-brain/
git commit -m "[second-brain] add workspace skeleton with CLAUDE.md, STATE.md, README"
```

---

## Task 12: Workspace template under `_shared/templates/workspace/`

**Files:**
- Create: `R:\Development\Workspace\_shared\templates\workspace\CLAUDE.md.template`
- Create: `R:\Development\Workspace\_shared\templates\workspace\STATE.md.template`
- Create: `R:\Development\Workspace\_shared\templates\workspace\README.md.template`
- Create: `R:\Development\Workspace\_shared\templates\workspace\README.md` (template docs)

- [ ] **Step 1: Create directories**

```powershell
mkdir _shared/templates/workspace -Force | Out-Null
```

- [ ] **Step 2: Write `CLAUDE.md.template`**

```markdown
# {{WORKSPACE_NAME}} — Operating Rules

## Purpose

{{ONE_LINE_PURPOSE}}

## What lives here

- TODO list the kinds of items this workspace holds

## What does NOT live here

- TODO list adjacent concerns that belong in other workspaces

## Capture sources accepted

- TODO list capture pipelines this workspace expects

## Linking conventions

- TODO describe atomic vs chunky notes, linking discipline

## Skills active here

- TODO list `.claude/skills/<name>` skills used by this workspace

## Naming

- TODO note conventions (which folders use date prefix, etc.)
```

- [ ] **Step 3: Write `STATE.md.template`**

```markdown
# {{WORKSPACE_NAME}} — State

**Last updated:** {{TODAY_ISO}}

## Open threads

- (none yet)

## Recent activity

- {{TODAY_ISO}}: workspace initialized.
```

- [ ] **Step 4: Write `README.md.template`**

```markdown
# {{WORKSPACE_NAME}}

{{ONE_LINE_PURPOSE}}

## Lifecycle folders

- TODO list folders used (`inbox/`, `notes/`, etc.)
```

- [ ] **Step 5: Write template usage docs**

Write `R:\Development\Workspace\_shared\templates\workspace\README.md`:

```markdown
# Workspace template

How to scaffold a new workspace from this template:

1. Decide a slug (`kebab-case`).
2. Copy this directory to `workspaces/<slug>/`, renaming `*.template` files (drop the `.template` suffix).
3. Replace placeholders: `{{WORKSPACE_NAME}}`, `{{ONE_LINE_PURPOSE}}`, `{{TODAY_ISO}}`.
4. Decide which lifecycle folders to create. Phase 0 Second Brain uses `inbox/ sources/ notes/ decisions/ archive/`. Workspaces with operational work add `tasks/`; trackers add `data/`; codegen workspaces add `outputs/` and `scripts/`.
5. Add an entry to `workspaces.json` at the root.
6. Insert a row into the `workspaces` table:
   `insert into workspaces (slug, name, path, description) values ('<slug>', '<name>', 'workspaces/<slug>', '<desc>');`
7. Add the workspace to the top-level `CLAUDE.md` workspace map.
```

- [ ] **Step 6: Commit**

```powershell
git add _shared/templates/workspace/
git commit -m "[bootstrap] add workspace scaffolding template under _shared/templates/"
```

---

## Task 13: `capture` skill + `scripts/capture.ts`

**Files:**
- Create: `R:\Development\Workspace\scripts\capture.ts`
- Create: `R:\Development\Workspace\.claude\skills\capture\SKILL.md`

The `capture.ts` script is a deterministic file-and-DB writer. The `SKILL.md` is the prompt that tells Claude *when* and *how* to invoke it.

- [ ] **Step 1: Write `scripts/capture.ts`**

```typescript
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { sql } from './lib/db.ts';
import { FrontmatterSchema, stringifyDocument } from './lib/frontmatter.ts';
import { isValidSlug, datePrefixedSlug } from './lib/slug.ts';

type CaptureArgs = {
  workspace: string;
  slug: string;
  title: string;
  type: 'note' | 'source' | 'decision' | 'inbox' | 'capture';
  status: 'raw' | 'draft' | 'durable' | 'archived';
  tags: string[];
  links: string[];
  confidence: 'low' | 'medium' | 'high';
  body: string;
  source?: {
    url?: string;
    fetcher?: 'firecrawl-scrape' | 'firecrawl-instruct' | 'manual' | 'pdf' | 'chat-export';
    fetchedAt?: string;
    contentHash?: string;
    blobPath?: string | null;
  };
};

function folderForType(type: CaptureArgs['type']): string {
  if (type === 'note') return 'notes';
  if (type === 'source') return 'sources';
  if (type === 'decision') return 'decisions';
  return 'inbox';
}

export async function captureItem(repoRoot: string, args: CaptureArgs): Promise<string> {
  if (!isValidSlug(args.slug)) {
    throw new Error(`Invalid slug: ${args.slug}`);
  }
  const today = new Date().toISOString().slice(0, 10);
  const folder = folderForType(args.type);
  const filename =
    args.type === 'note' ? `${args.slug}.md` : `${datePrefixedSlug(today, args.slug)}.md`;
  const relPath = join('workspaces', args.workspace, folder, filename).replaceAll('\\', '/');
  const absPath = join(repoRoot, relPath);
  if (existsSync(absPath)) {
    throw new Error(`File already exists: ${relPath}`);
  }
  mkdirSync(dirname(absPath), { recursive: true });

  const fm = FrontmatterSchema.parse({
    slug: args.type === 'note' ? args.slug : datePrefixedSlug(today, args.slug),
    title: args.title,
    type: args.type,
    status: args.status,
    tags: args.tags,
    links: args.links,
    source: null,
    confidence: args.confidence,
    created: today,
    updated: today,
    ...(args.source && {
      source_url: args.source.url,
      source_fetched_at: args.source.fetchedAt,
      source_fetcher: args.source.fetcher,
      source_content_hash: args.source.contentHash,
      source_blob_path: args.source.blobPath ?? null,
    }),
  });

  const content = stringifyDocument(fm, args.body);
  writeFileSync(absPath, content, 'utf8');

  // Insert a captures row (status='filed' since we placed it)
  const wsRows = await sql<{ id: string }[]>`
    select id from workspaces where slug = ${args.workspace}
  `;
  await sql`
    insert into captures (workspace_id, raw_input, input_type, status, triage_reasoning)
    values (${wsRows[0]!.id}, ${args.title}, 'text', 'filed', 'direct-place via capture')
  `;
  return relPath;
}

if (import.meta.main) {
  // CLI: bun run scripts/capture.ts --json '<json args>'
  const flag = process.argv[2];
  const payload = process.argv[3];
  if (flag !== '--json' || !payload) {
    console.error("Usage: bun run scripts/capture.ts --json '<json-args>'");
    process.exit(2);
  }
  const args = JSON.parse(payload) as CaptureArgs;
  const path = await captureItem(process.cwd(), args);
  console.log(JSON.stringify({ path }));
  await sql.end();
}
```

- [ ] **Step 2: Smoke-test capture script**

Run from `R:\Development\Workspace\`:

```powershell
bun run scripts/capture.ts --json '{"workspace":"second-brain","slug":"test-capture-smoke","title":"Smoke test","type":"note","status":"draft","tags":["test"],"links":[],"confidence":"high","body":"Body of smoke test."}'
```

Expected: prints `{"path":"workspaces/second-brain/notes/test-capture-smoke.md"}`. File exists.

- [ ] **Step 3: Clean up smoke artifact**

```powershell
Remove-Item workspaces/second-brain/notes/test-capture-smoke.md
docker exec -i supabase_db_workspace-os psql -U postgres -d postgres -c "delete from captures where raw_input = 'Smoke test';"
```

- [ ] **Step 4: Create skill directory**

```powershell
mkdir .claude/skills/capture -Force | Out-Null
```

- [ ] **Step 5: Write `SKILL.md`**

Write `R:\Development\Workspace\.claude\skills\capture\SKILL.md`:

```markdown
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

4. **Summarize** the extracted content in 3–8 sentences. Pick:
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
```

- [ ] **Step 6: Commit**

```powershell
git add scripts/capture.ts .claude/skills/capture/
git commit -m "[skills] add capture skill + scripts/capture.ts"
```

---

## Task 14: `query` skill + `scripts/query.ts`

**Files:**
- Create: `R:\Development\Workspace\scripts\query.ts`
- Create: `R:\Development\Workspace\.claude\skills\query\SKILL.md`

- [ ] **Step 1: Write `scripts/query.ts`**

```typescript
import { sql } from './lib/db.ts';

type FindArgs = {
  workspace?: string;
  tags?: string[];
  type?: 'note' | 'source' | 'decision' | 'inbox' | 'capture';
  text?: string;
  limit?: number;
};

export async function findItems(args: FindArgs) {
  const limit = args.limit ?? 10;
  const wsClause = args.workspace
    ? sql`and w.slug = ${args.workspace}`
    : sql``;
  const typeClause = args.type ? sql`and i.type = ${args.type}` : sql``;
  const textClause = args.text
    ? sql`and (i.title ilike ${'%' + args.text + '%'} or (i.frontmatter ->> 'tags') ilike ${'%' + args.text + '%'})`
    : sql``;
  const tagsClause = args.tags && args.tags.length > 0
    ? sql`and i.id in (
        select it.item_id from item_tags it
        join tags t on t.id = it.tag_id
        where t.slug = any(${args.tags})
      )`
    : sql``;

  const rows = await sql<
    {
      slug: string;
      title: string;
      type: string;
      file_path: string;
      workspace_slug: string;
      confidence: string | null;
    }[]
  >`
    select i.slug, i.title, i.type, i.file_path, w.slug as workspace_slug, i.confidence
    from items i
    join workspaces w on w.id = i.workspace_id
    where 1=1 ${wsClause} ${typeClause} ${textClause} ${tagsClause}
    order by i.updated_at desc
    limit ${limit}
  `;
  return rows;
}

if (import.meta.main) {
  const flag = process.argv[2];
  const payload = process.argv[3];
  if (flag !== '--json' || !payload) {
    console.error("Usage: bun run scripts/query.ts --json '<json-args>'");
    process.exit(2);
  }
  const args = JSON.parse(payload) as FindArgs;
  const rows = await findItems(args);
  console.log(JSON.stringify(rows, null, 2));
  await sql.end();
}
```

- [ ] **Step 2: Smoke-test query**

```powershell
bun run scripts/query.ts --json '{"workspace":"second-brain","limit":5}'
```

Expected: prints `[]` (or any existing items as JSON).

- [ ] **Step 3: Create skill directory and write `SKILL.md`**

```powershell
mkdir .claude/skills/query -Force | Out-Null
```

Write `R:\Development\Workspace\.claude\skills\query\SKILL.md`:

```markdown
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
```

- [ ] **Step 4: Commit**

```powershell
git add scripts/query.ts .claude/skills/query/
git commit -m "[skills] add query skill + scripts/query.ts"
```

---

## Task 15: `triage-inbox` skill + `scripts/triage.ts`

**Files:**
- Create: `R:\Development\Workspace\scripts\triage.ts`
- Create: `R:\Development\Workspace\.claude\skills\triage-inbox\SKILL.md`

- [ ] **Step 1: Write `scripts/triage.ts`**

```typescript
import { renameSync, readFileSync, writeFileSync } from 'node:fs';
import { join, basename } from 'node:path';
import { sql } from './lib/db.ts';
import { parseDocument, stringifyDocument } from './lib/frontmatter.ts';

export async function listPendingCaptures() {
  return await sql<
    { id: string; raw_input: string; input_type: string; created_at: Date }[]
  >`
    select id, raw_input, input_type, created_at
    from captures where status = 'pending'
    order by created_at asc
  `;
}

export async function listInboxFiles(repoRoot: string, workspaceSlug: string) {
  const rows = await sql<{ slug: string; title: string; file_path: string }[]>`
    select i.slug, i.title, i.file_path
    from items i join workspaces w on w.id = i.workspace_id
    where w.slug = ${workspaceSlug} and i.type = 'inbox'
    order by i.created_at asc
  `;
  return rows.map((r) => ({ ...r, abs: join(repoRoot, r.file_path) }));
}

type FileArgs = {
  fromPath: string;
  toFolder: 'notes' | 'sources' | 'decisions' | 'archive';
  newType: 'note' | 'source' | 'decision' | 'archived';
  newStatus: 'draft' | 'durable' | 'archived';
};

export async function fileInboxItem(repoRoot: string, args: FileArgs): Promise<string> {
  const absFrom = join(repoRoot, args.fromPath);
  const raw = readFileSync(absFrom, 'utf8');
  const { frontmatter: fm, body } = parseDocument(raw);

  // Update frontmatter
  const today = new Date().toISOString().slice(0, 10);
  const updatedFm = {
    ...fm,
    type: args.newType === 'archived' ? fm.type : args.newType,
    status: args.newStatus,
    updated: today,
  };
  const newContent = stringifyDocument(updatedFm as typeof fm, body);
  writeFileSync(absFrom, newContent, 'utf8');

  // Move file to target folder
  const filename = basename(args.fromPath);
  const dirParts = args.fromPath.split('/');
  dirParts[dirParts.length - 2] = args.toFolder; // replace 'inbox' with target
  const newRelPath = dirParts.join('/');
  const absTo = join(repoRoot, newRelPath);
  renameSync(absFrom, absTo);

  return newRelPath;
}

if (import.meta.main) {
  const cmd = process.argv[2];
  if (cmd === 'list-pending') {
    console.log(JSON.stringify(await listPendingCaptures(), null, 2));
  } else if (cmd === 'list-inbox') {
    const ws = process.argv[3] ?? 'second-brain';
    console.log(JSON.stringify(await listInboxFiles(process.cwd(), ws), null, 2));
  } else if (cmd === 'file') {
    const payload = process.argv[3];
    if (!payload) {
      console.error("Usage: bun run scripts/triage.ts file '<json>'");
      process.exit(2);
    }
    const newPath = await fileInboxItem(process.cwd(), JSON.parse(payload));
    console.log(JSON.stringify({ newPath }));
  } else {
    console.error('Usage: triage.ts (list-pending | list-inbox <ws> | file <json>)');
    process.exit(2);
  }
  await sql.end();
}
```

- [ ] **Step 2: Smoke-test triage**

```powershell
bun run scripts/triage.ts list-pending
bun run scripts/triage.ts list-inbox second-brain
```

Expected: both print `[]` (empty arrays, no errors).

- [ ] **Step 3: Create skill directory and write `SKILL.md`**

```powershell
mkdir .claude/skills/triage-inbox -Force | Out-Null
```

Write `R:\Development\Workspace\.claude\skills\triage-inbox\SKILL.md`:

```markdown
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
```

- [ ] **Step 4: Commit**

```powershell
git add scripts/triage.ts .claude/skills/triage-inbox/
git commit -m "[skills] add triage-inbox skill + scripts/triage.ts"
```

---

## Task 16: `weekly-review` skill + `scripts/weekly-review.ts`

**Files:**
- Create: `R:\Development\Workspace\scripts\weekly-review.ts`
- Create: `R:\Development\Workspace\.claude\skills\weekly-review\SKILL.md`

- [ ] **Step 1: Write `scripts/weekly-review.ts`**

```typescript
import { writeFileSync, mkdirSync, existsSync, readFileSync, appendFileSync } from 'node:fs';
import { join } from 'node:path';
import { sql } from './lib/db.ts';

function isoWeek(d: Date): string {
  // YYYY-Www
  const target = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNr = (target.getUTCDay() + 6) % 7;
  target.setUTCDate(target.getUTCDate() - dayNr + 3);
  const firstThursday = new Date(Date.UTC(target.getUTCFullYear(), 0, 4));
  const diff = (target.getTime() - firstThursday.getTime()) / 86400000;
  const week = 1 + Math.round((diff - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7);
  return `${target.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

export async function generateWeeklyReview(repoRoot: string): Promise<string> {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const items = await sql<
    { workspace_slug: string; slug: string; title: string; type: string; created_at: Date }[]
  >`
    select w.slug as workspace_slug, i.slug, i.title, i.type, i.created_at
    from items i join workspaces w on w.id = i.workspace_id
    where i.created_at >= ${since.toISOString()}
    order by i.created_at desc
  `;
  const runs = await sql<{ skill_name: string; status: string; count: string }[]>`
    select skill_name, status, count(*)::text as count
    from agent_runs where started_at >= ${since.toISOString()}
    group by skill_name, status
    order by skill_name
  `;
  const pendingByWs = await sql<{ workspace_slug: string; pending: string }[]>`
    select w.slug as workspace_slug, count(*)::text as pending
    from captures c join workspaces w on w.id = c.workspace_id
    where c.status = 'pending' group by w.slug
  `;

  const today = new Date();
  const tag = isoWeek(today);
  const lines: string[] = [];
  lines.push(`# Weekly Review ${tag}`);
  lines.push('');
  lines.push(`Generated: ${today.toISOString().slice(0, 10)}`);
  lines.push('');
  lines.push('## Captures (last 7 days)');
  if (items.length === 0) lines.push('- (none)');
  for (const it of items) {
    lines.push(`- \`${it.workspace_slug}\` [${it.type}] **${it.title}** ← \`${it.slug}\``);
  }
  lines.push('');
  lines.push('## Skill activity');
  if (runs.length === 0) lines.push('- (none)');
  for (const r of runs) lines.push(`- ${r.skill_name} (${r.status}): ${r.count}`);
  lines.push('');
  lines.push('## Pending in inbox');
  if (pendingByWs.length === 0) lines.push('- (none — inbox clean)');
  for (const p of pendingByWs) lines.push(`- \`${p.workspace_slug}\`: ${p.pending} pending`);
  lines.push('');

  const outDir = join(repoRoot, 'workspaces', 'second-brain', 'archive', 'weekly');
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, `${tag}.md`);
  writeFileSync(outPath, lines.join('\n'), 'utf8');

  // Append to top-level STATE.md
  const statePath = join(repoRoot, 'STATE.md');
  if (existsSync(statePath)) {
    appendFileSync(
      statePath,
      `\n- ${today.toISOString().slice(0, 10)}: weekly review ${tag} generated.\n`,
    );
  }

  return outPath;
}

if (import.meta.main) {
  const out = await generateWeeklyReview(process.cwd());
  console.log(JSON.stringify({ path: out }));
  await sql.end();
}
```

- [ ] **Step 2: Smoke-test weekly review**

```powershell
bun run scripts/weekly-review.ts
```

Expected: prints `{"path":"workspaces/second-brain/archive/weekly/<YYYY-Www>.md"}`. File exists with the digest.

- [ ] **Step 3: Inspect generated file**

```powershell
Get-Content workspaces/second-brain/archive/weekly/*.md -Tail 30
```

Expected: a Markdown report with Captures / Skill activity / Pending sections.

- [ ] **Step 4: Create skill directory and write `SKILL.md`**

```powershell
mkdir .claude/skills/weekly-review -Force | Out-Null
```

Write `R:\Development\Workspace\.claude\skills\weekly-review\SKILL.md`:

```markdown
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
```

- [ ] **Step 5: Commit**

```powershell
git add scripts/weekly-review.ts .claude/skills/weekly-review/
git commit -m "[skills] add weekly-review skill + scripts/weekly-review.ts"
```

---

## Task 17: `distill-chat` skill + `scripts/distill-chat.ts`

**Files:**
- Create: `R:\Development\Workspace\scripts\distill-chat.ts`
- Create: `R:\Development\Workspace\.claude\skills\distill-chat\SKILL.md`

The distill-chat *script* is a thin helper to store the raw chat as a source-type item. The actual distillation reasoning happens in the *skill* prompt (Claude does the LLM work).

- [ ] **Step 1: Write `scripts/distill-chat.ts`**

```typescript
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { sql } from './lib/db.ts';
import { stringifyDocument, FrontmatterSchema } from './lib/frontmatter.ts';
import { datePrefixedSlug, slugify, isValidSlug } from './lib/slug.ts';
import { createHash } from 'node:crypto';

type StoreArgs = {
  workspace: string;
  titleHint: string;
  chatPlatform: 'chatgpt' | 'claude' | 'codex' | 'gemini' | 'other';
  rawChat: string;
};

export async function storeChatAsSource(repoRoot: string, args: StoreArgs): Promise<string> {
  const today = new Date().toISOString().slice(0, 10);
  const base = slugify(args.titleHint).slice(0, 40);
  if (!isValidSlug(base)) throw new Error(`Cannot derive slug from: ${args.titleHint}`);
  const slug = datePrefixedSlug(today, `chat-${args.chatPlatform}-${base}`);
  const relPath = `workspaces/${args.workspace}/sources/${slug}.md`;
  const absPath = join(repoRoot, relPath);

  const hash = createHash('sha256').update(args.rawChat).digest('hex');
  const fm = FrontmatterSchema.parse({
    slug,
    title: `Chat (${args.chatPlatform}): ${args.titleHint}`,
    type: 'source',
    status: 'durable',
    tags: ['chat-export', `platform-${args.chatPlatform}`],
    links: [],
    source: null,
    confidence: 'high',
    created: today,
    updated: today,
    source_url: undefined,
    source_fetched_at: new Date().toISOString(),
    source_fetcher: 'chat-export',
    source_content_hash: hash,
    source_blob_path: null,
  });
  mkdirSync(join(repoRoot, `workspaces/${args.workspace}/sources`), { recursive: true });
  writeFileSync(absPath, stringifyDocument(fm, args.rawChat), 'utf8');

  const wsRows = await sql<{ id: string }[]>`select id from workspaces where slug = ${args.workspace}`;
  await sql`
    insert into captures (workspace_id, raw_input, input_type, status, triage_reasoning)
    values (${wsRows[0]!.id}, ${args.titleHint}, 'chat-export', 'filed', 'distill-chat stored raw chat')
  `;
  return relPath;
}

if (import.meta.main) {
  const flag = process.argv[2];
  const payload = process.argv[3];
  if (flag !== '--json' || !payload) {
    console.error("Usage: bun run scripts/distill-chat.ts --json '<json>'");
    process.exit(2);
  }
  const args = JSON.parse(payload) as StoreArgs;
  const path = await storeChatAsSource(process.cwd(), args);
  console.log(JSON.stringify({ path }));
  await sql.end();
}
```

- [ ] **Step 2: Smoke-test**

```powershell
bun run scripts/distill-chat.ts --json '{"workspace":"second-brain","titleHint":"test chat","chatPlatform":"claude","rawChat":"User: hi\nAssistant: hello"}'
```

Expected: prints `{"path":"workspaces/second-brain/sources/2026-MM-DD-chat-claude-test-chat.md"}`. File exists.

- [ ] **Step 3: Clean up smoke artifact**

```powershell
Remove-Item workspaces/second-brain/sources/2026-*-chat-claude-test-chat.md
docker exec -i supabase_db_workspace-os psql -U postgres -d postgres -c "delete from captures where raw_input = 'test chat';"
```

- [ ] **Step 4: Create skill directory and write `SKILL.md`**

```powershell
mkdir .claude/skills/distill-chat -Force | Out-Null
```

Write `R:\Development\Workspace\.claude\skills\distill-chat\SKILL.md`:

```markdown
---
name: distill-chat
description: Use when user pastes a chat export (ChatGPT/Claude/Codex/Gemini conversation) or says "distill this chat". Stores the full conversation as a source-type item, then extracts decisions, code snippets, durable insights, and routes each via the capture skill.
---

# Distill-Chat skill

## When to invoke

Trigger phrases: "distill this chat", "extract from this conversation", "save this conversation". Or auto-invoke from the `capture` skill when chat-export markers are detected ("User:" / "Assistant:" / "ChatGPT" / "Claude" headers, multi-turn structure).

## Pipeline

1. **Detect platform** from formatting markers:
   - ChatGPT JSON export → JSON parse
   - Claude markdown export → "## Human:" / "## Assistant:" headers
   - Codex log format → "[user]" / "[assistant]" prefixes
   - Otherwise → "other"

2. **Pick a title hint** — first user message, truncated to ~50 chars.

3. **Store the raw chat** as a source-type item via `bun run scripts/distill-chat.ts --json '{"workspace":"second-brain","titleHint":"...","chatPlatform":"...","rawChat":"..."}'`. This creates `workspaces/second-brain/sources/<date>-chat-<platform>-<slug>.md`.

4. **Read the full chat** with the Read tool and segment by turn.

5. **Extract durable artifacts:**
   - **Decisions** — explicit decisions made ("we'll use Postgres", "switching to Bun"). Each → invoke `capture` with `type: decision`, `source: <chat slug>`.
   - **Code snippets worth keeping** — non-trivial code blocks. Each → invoke `capture` with `type: note`, body includes the code in a fenced block, `source: <chat slug>`.
   - **Durable insights** — abstract learnings ("X works because Y"). Each → invoke `capture` with `type: note`, `source: <chat slug>`.
   - **Action items** — these go to inbox/ for later triage into a tasks workspace.

6. **Report**: chat saved as `[[<chat slug>]]`; N decisions, N notes, M action items captured.

## Edge cases

- If the chat is very long (> 50 turns), summarize the chat first, store the summary alongside the raw, and only extract the top 5 decisions / notes by importance.
- If you can't reliably segment turns, store the raw chat as-is and report "couldn't auto-segment — please point me to specific portions to distill."
```

- [ ] **Step 5: Commit**

```powershell
git add scripts/distill-chat.ts .claude/skills/distill-chat/
git commit -m "[skills] add distill-chat skill + scripts/distill-chat.ts"
```

---

## Task 18: `index-rebuild` skill + `scripts/index-rebuild.ts`

**Files:**
- Create: `R:\Development\Workspace\scripts\index-rebuild.ts`
- Create: `R:\Development\Workspace\.claude\skills\index-rebuild\SKILL.md`

- [ ] **Step 1: Write `scripts/index-rebuild.ts`**

```typescript
import { readdirSync, statSync } from 'node:fs';
import { join, sep } from 'node:path';
import { sql } from './lib/db.ts';
import { indexOneFile } from './indexer.ts';

function walkMarkdown(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      walkMarkdown(full, out);
    } else if (entry.endsWith('.md')) {
      out.push(full);
    }
  }
  return out;
}

export async function rebuildIndex(repoRoot: string): Promise<{ processed: number }> {
  const wsDir = join(repoRoot, 'workspaces');
  await sql.begin(async (tx) => {
    await tx`delete from item_tags`;
    await tx`delete from links`;
    await tx`delete from sources`;
    await tx`delete from items`;
    await tx`delete from tags`;
  });
  const files = walkMarkdown(wsDir);
  let count = 0;
  for (const f of files) {
    await indexOneFile(f, repoRoot);
    count++;
  }
  return { processed: count };
}

if (import.meta.main) {
  const result = await rebuildIndex(process.cwd());
  console.log(JSON.stringify(result));
  await sql.end();
}
```

- [ ] **Step 2: Smoke-test (no files yet beyond template-less Second Brain → 0 processed is expected)**

```powershell
bun run scripts/index-rebuild.ts
```

Expected: prints `{"processed":0}` or matches the count of `.md` files under `workspaces/`.

- [ ] **Step 3: Create skill directory and write `SKILL.md`**

```powershell
mkdir .claude/skills/index-rebuild -Force | Out-Null
```

Write `R:\Development\Workspace\.claude\skills\index-rebuild\SKILL.md`:

```markdown
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

- If individual files fail to parse (invalid frontmatter), the rebuild aborts mid-way. Fix the offending file's frontmatter and retry. The transaction in the script is for the wipe step only; failures during walk are surfaced as errors.
- If `agent_runs` references items that get re-created with new UUIDs, the foreign key is preserved but the run row's `item_id` will become orphaned (the column is `on delete set null`).
```

- [ ] **Step 4: Commit**

```powershell
git add scripts/index-rebuild.ts .claude/skills/index-rebuild/
git commit -m "[skills] add index-rebuild skill + scripts/index-rebuild.ts"
```

---

## Task 19: Session hooks — `session-start.ts` + `session-end.ts`

**Files:**
- Create: `R:\Development\Workspace\scripts\lib\session-start.ts`
- Create: `R:\Development\Workspace\scripts\lib\session-end.ts`

- [ ] **Step 1: Write `scripts/lib/session-start.ts`**

```typescript
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { sql } from './db.ts';

const repoRoot = process.cwd();
const statePath = join(repoRoot, 'STATE.md');

if (existsSync(statePath)) {
  const head = readFileSync(statePath, 'utf8').split('\n').slice(0, 20).join('\n');
  console.log('--- STATE.md (head) ---');
  console.log(head);
  console.log('-----------------------');
}

const rows = await sql<{ slug: string; pending: string }[]>`
  select w.slug, count(c.id)::text as pending
  from workspaces w
  left join captures c on c.workspace_id = w.id and c.status = 'pending'
  group by w.slug
  order by w.slug
`;
const pendingTotal = rows.reduce((a, r) => a + Number(r.pending), 0);
if (pendingTotal > 0) {
  console.log('Pending captures:');
  for (const r of rows) {
    if (Number(r.pending) > 0) console.log(`  - ${r.slug}: ${r.pending}`);
  }
} else {
  console.log('Inbox clean (0 pending captures).');
}
await sql.end();
```

- [ ] **Step 2: Write `scripts/lib/session-end.ts`**

```typescript
import { existsSync, appendFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { sql } from './db.ts';

const repoRoot = process.cwd();
const statePath = join(repoRoot, 'STATE.md');

// Only append if there were any captures in the last hour.
// (Phase 0 scripts populate `captures` directly; `agent_runs` is wired in Phase 1.)
const recent = await sql<{ count: string }[]>`
  select count(*)::text from captures
  where created_at >= now() - interval '1 hour'
`;
const count = Number(recent[0]!.count);
if (count > 0 && existsSync(statePath)) {
  const today = new Date().toISOString().slice(0, 10);
  const byType = await sql<{ input_type: string; n: string }[]>`
    select input_type, count(*)::text as n from captures
    where created_at >= now() - interval '1 hour'
    group by input_type order by input_type
  `;
  const summary = byType.map((s) => `${s.input_type}×${s.n}`).join(', ');
  appendFileSync(statePath, `\n- ${today}: captures — ${summary}\n`);
}
await sql.end();
```

- [ ] **Step 3: Smoke-test both**

```powershell
bun run scripts/lib/session-start.ts
bun run scripts/lib/session-end.ts
```

Expected: `session-start.ts` prints STATE.md head + "Inbox clean (0 pending)". `session-end.ts` exits without output (no recent runs). Neither errors.

- [ ] **Step 4: Commit**

```powershell
git add scripts/lib/session-start.ts scripts/lib/session-end.ts
git commit -m "[scripts] add session-start and session-end hook scripts"
```

---

## Task 20: Wire hooks in `.claude/settings.json`

**Files:**
- Create: `R:\Development\Workspace\.claude\settings.json`

- [ ] **Step 1: Create `.claude/` directory if not present**

```powershell
mkdir .claude -Force | Out-Null
```

- [ ] **Step 2: Write `.claude/settings.json`**

Write `R:\Development\Workspace\.claude\settings.json`:

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bun run scripts/lib/session-start.ts"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "bun run scripts/indexer.ts \"$CLAUDE_FILE_PATHS\""
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bun run scripts/lib/session-end.ts"
          }
        ]
      }
    ]
  }
}
```

- [ ] **Step 3: Test SessionStart hook**

In a fresh Claude Code session under `R:\Development\Workspace\`, the hook should run automatically. Manually verify by running the same command:

```powershell
bun run scripts/lib/session-start.ts
```

Expected: STATE.md head printed, "Inbox clean" message.

- [ ] **Step 4: Test PostToolUse hook**

Create a test note manually:

```powershell
@"
---
slug: hook-test-note
title: Hook Test Note
type: note
status: draft
tags: [test]
links: []
source: null
confidence: high
created: $(Get-Date -Format yyyy-MM-dd)
updated: $(Get-Date -Format yyyy-MM-dd)
---

This is a hook test.
"@ | Out-File -FilePath workspaces/second-brain/notes/hook-test-note.md -Encoding utf8
```

Then run the indexer manually (simulating the hook):

```powershell
bun run scripts/indexer.ts workspaces/second-brain/notes/hook-test-note.md
```

Verify DB:

```powershell
docker exec -i supabase_db_workspace-os psql -U postgres -d postgres -c "select slug, title from items where slug = 'hook-test-note';"
```

Expected: one row, `hook-test-note | Hook Test Note`.

- [ ] **Step 5: Clean up test note**

```powershell
Remove-Item workspaces/second-brain/notes/hook-test-note.md
bun run scripts/indexer.ts workspaces/second-brain/notes/hook-test-note.md
```

(The second invocation, on the now-deleted file, triggers the delete branch of the indexer.)

Verify deletion:

```powershell
docker exec -i supabase_db_workspace-os psql -U postgres -d postgres -c "select count(*) from items where slug = 'hook-test-note';"
```

Expected: `0`.

- [ ] **Step 6: Commit**

```powershell
git add .claude/settings.json
git commit -m "[hooks] wire SessionStart, PostToolUse, and Stop hooks in .claude/settings.json"
```

---

## Task 21: End-to-end smoke test

This is the final validation that every piece works together. No new code; just exercising the skills.

- [ ] **Step 1: Open a fresh Claude Code session at `R:\Development\Workspace\`**

Expected: SessionStart hook fires; you see STATE.md head + "Inbox clean".

- [ ] **Step 2: Smoke-test capture**

In Claude Code, paste this prompt:

> Save this URL: https://karpathy.ai/zero-to-hero.html

Expected behavior:
- Claude invokes the `capture` skill.
- Firecrawl scrapes the URL.
- A summary + frontmatter is generated.
- `bun run scripts/capture.ts --json '...'` is called.
- File appears under `workspaces/second-brain/sources/2026-MM-DD-<slug>.md` (or `inbox/` if low confidence).
- Postgres `items` and `captures` rows exist.
- Claude reports: file path, confidence, anchor links (likely none on first capture).

Verify manually:

```powershell
Get-ChildItem workspaces/second-brain/sources, workspaces/second-brain/inbox -Filter *.md
docker exec -i supabase_db_workspace-os psql -U postgres -d postgres -c "select slug, type, status from items order by created_at desc limit 5;"
```

- [ ] **Step 3: Smoke-test query**

In Claude Code:

> What do I know about Karpathy's Zero to Hero?

Expected:
- Claude invokes the `query` skill.
- `bun run scripts/query.ts --json '{"text":"Karpathy"}'` runs.
- Claude reads the matching file.
- Synthesized answer cites `[[<slug>]]`.

- [ ] **Step 4: Smoke-test triage (if anything is in inbox)**

If Step 2 placed in `inbox/`:

> Triage my inbox.

Expected:
- Claude invokes the `triage-inbox` skill.
- Lists inbox items.
- Proposes placement.
- On accept, file moves to `sources/` (or appropriate folder), frontmatter updates, DB re-indexes via hook.

- [ ] **Step 5: Smoke-test weekly review**

> Run a weekly review.

Expected:
- Claude invokes the `weekly-review` skill.
- `bun run scripts/weekly-review.ts` runs.
- File created at `workspaces/second-brain/archive/weekly/<YYYY-Www>.md`.
- Claude reads it, adds a Highlights section.
- STATE.md gets a new line.

- [ ] **Step 6: Smoke-test index rebuild**

Manually corrupt the index (delete one row directly in DB):

```powershell
docker exec -i supabase_db_workspace-os psql -U postgres -d postgres -c "delete from items where slug like '%karpathy%' or slug like '%zero%';"
```

Then:

> Rebuild the index.

Expected:
- Claude invokes the `index-rebuild` skill.
- `bun run scripts/index-rebuild.ts` runs.
- Item rows return.

Final verify:

```powershell
docker exec -i supabase_db_workspace-os psql -U postgres -d postgres -c "select type, count(*) from items group by type;"
```

- [ ] **Step 7: Commit the smoke-test artifacts**

If the smoke test created files (captured source, weekly review), commit them:

```powershell
git add workspaces/second-brain/
git status
# review what's about to be committed
git commit -m "[second-brain] add Phase 0 smoke-test captures"
```

- [ ] **Step 8: Tag Phase 0 complete**

```powershell
git tag -a phase-0-complete -m "Phase 0 bootstrap + Second Brain end-to-end smoke test passing"
```

Phase 0 is complete. Confirm against §12 of the spec — all six smoke-test criteria should pass.

---

## Self-review checklist

After completing all tasks above, verify:

1. **Spec coverage:** Every section of [`docs/superpowers/specs/2026-05-12-personal-workspace-os-bootstrap-design.md`](../specs/2026-05-12-personal-workspace-os-bootstrap-design.md) maps to a task above:
   - §2.1 in scope items 1–11 → Tasks 1–21
   - §3 architecture → Tasks 1–4, 11
   - §4 database → Tasks 3–4
   - §5 CLAUDE.md hierarchy → Tasks 2, 11
   - §6 skills → Tasks 13–18
   - §7 hooks → Tasks 19–20
   - §8 plugins/MCPs → Task 3 (Supabase MCP enabled via `supabase start`)
   - §9 tooling → Task 1
   - §10 repo hygiene → Task 1 (`.gitignore`)
   - §11.1 phased rollout order matches task ordering
   - §12 success criteria → Task 21 covers all six smoke tests

2. **Type/signature consistency:** Functions exported by lib (`isValidSlug`, `slugify`, `datePrefixedSlug`, `extractWikilinks`, `parseDocument`, `stringifyDocument`, `FrontmatterSchema`, `scoreConfidence`, `indexOneFile`) are used with the same names downstream.

3. **No placeholders:** No "TBD", "TODO" left in plan steps that the engineer is expected to execute. (TODOs are present in the *workspace template* files, which is intentional — those are placeholders for the *user* to fill when creating a new workspace.)

4. **Commands are exact:** Every `bun run`, `docker exec`, `git commit` includes the full command. PowerShell-flavored where Windows-specific.

## Known Phase 0 gaps (intentional, deferred to Phase 1)

- **`agent_runs` is not populated by Phase 0 scripts.** The table exists per the spec; the Stop hook uses `captures` (which scripts do populate) instead. Phase 1 will add `recordRun`/`finishRun` helpers and wire each script to log into `agent_runs`. Until then, the `weekly-review.ts` "Skill activity" section will always show `(none)` — this is honest, not broken.
- **`embedding_chunks` table exists but is unpopulated.** Per spec §11.2, embeddings come in Phase 1+ when content volume justifies them (≥ 50 items).
- **`PostToolUse` hook env var name** (`$CLAUDE_FILE_PATHS` in Task 20) may differ across Claude Code versions. If the indexer doesn't fire on writes during the Task 21 smoke test, use the `update-config` skill to introspect and correct the variable name.

---

## Execution handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-12-personal-workspace-os-bootstrap.md`. Two execution options:

**1. Subagent-Driven (recommended)** — fresh subagent per task, two-stage review between tasks, fast iteration, protects main context.

**2. Inline Execution** — execute tasks in this session using `superpowers:executing-plans`, batch execution with checkpoints for your review.

Which approach?
