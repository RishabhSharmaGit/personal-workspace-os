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
