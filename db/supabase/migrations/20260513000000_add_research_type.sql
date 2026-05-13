-- Add 'research' type for research-session landing pages.
-- Spec: docs/superpowers/specs/2026-05-13-research-skill-design.md §4.1
alter table items drop constraint items_type_check;
alter table items add constraint items_type_check
  check (type in ('note','source','decision','inbox','capture','research'));
