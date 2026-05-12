-- Seed: Second Brain workspace
insert into workspaces (slug, name, path, description)
values (
  'second-brain',
  'Second Brain',
  'workspaces/second-brain',
  'General knowledge capture, retrieval, and distillation.'
)
on conflict (slug) do nothing;
