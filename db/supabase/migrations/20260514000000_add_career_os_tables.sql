-- Career OS schema additions.
-- Extends items.type enum and adds 7 relational tables for career data.
-- All career_* tables are workspace-scoped and mirror item rows for markdown files.

-- ---- items.type enum extension ----
alter table items drop constraint items_type_check;
alter table items add constraint items_type_check
  check (type in (
    'note','source','decision','inbox','capture','research',
    'application','contact','target-role','achievement','resume',
    'cover-letter','interview-prep','project','company'
  ));

-- ---- career_companies ----
create table career_companies (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  item_id uuid unique references items(id) on delete cascade,
  name text not null,
  careers_url text,
  hq_location text,
  sponsors_visa boolean,
  size text,
  notes text,
  created_at timestamptz not null default now()
);
create index career_companies_workspace_idx on career_companies(workspace_id);

-- ---- career_contacts ----
create table career_contacts (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  item_id uuid unique references items(id) on delete cascade,
  name text not null,
  contact_role text,
  company_id uuid references career_companies(id) on delete set null,
  email text,
  linkedin text,
  relationship text check (relationship in ('recruiter','hiring-manager','referrer','peer','other')),
  created_at timestamptz not null default now()
);
create index career_contacts_workspace_idx on career_contacts(workspace_id);
create index career_contacts_company_idx on career_contacts(company_id);

-- ---- career_target_roles ----
create table career_target_roles (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  item_id uuid unique references items(id) on delete cascade,
  title text not null,
  company_id uuid references career_companies(id) on delete set null,
  jd_url text,
  region text,
  salary_band text,
  keywords text[] not null default '{}',
  created_at timestamptz not null default now()
);
create index career_target_roles_workspace_idx on career_target_roles(workspace_id);

-- ---- career_resumes ----
create table career_resumes (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  item_id uuid unique references items(id) on delete cascade,
  name text not null,
  kind text not null check (kind in ('master','variant')),
  target_role_id uuid references career_target_roles(id) on delete set null,
  json_path text,
  rendered_pdf_path text,
  created_at timestamptz not null default now()
);
create index career_resumes_workspace_idx on career_resumes(workspace_id);

-- ---- career_applications ----
create table career_applications (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  item_id uuid unique references items(id) on delete cascade,
  target_role_id uuid references career_target_roles(id) on delete set null,
  company_id uuid references career_companies(id) on delete set null,
  resume_version_id uuid references career_resumes(id) on delete set null,
  status text not null check (status in (
    'wishlist','applied','screen','technical','onsite','offer','accepted','rejected','withdrawn','ghosted'
  )),
  applied_at date,
  channel text,
  region text,
  salary_band text,
  next_action_date date,
  created_at timestamptz not null default now()
);
create index career_applications_workspace_idx on career_applications(workspace_id);
create index career_applications_status_idx on career_applications(status);
create index career_applications_next_action_idx on career_applications(next_action_date);

-- ---- career_application_events ----
create table career_application_events (
  id uuid primary key default uuid_generate_v4(),
  application_id uuid not null references career_applications(id) on delete cascade,
  event_type text not null,
  at timestamptz not null default now(),
  from_status text,
  to_status text,
  summary text,
  created_at timestamptz not null default now()
);
create index career_application_events_app_idx on career_application_events(application_id, at desc);

-- ---- career_achievements ----
create table career_achievements (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  item_id uuid unique references items(id) on delete cascade,
  bullet_text text not null,
  xyz_x text,
  xyz_y text,
  xyz_z text,
  tech_tags text[] not null default '{}',
  role_slug text,
  metric text,
  evidence_url text,
  created_at timestamptz not null default now()
);
create index career_achievements_workspace_idx on career_achievements(workspace_id);
create index career_achievements_role_idx on career_achievements(role_slug);
