# Career OS

Local-first, LLM-mediated career-management workspace for a software developer.

## What it does

- Builds and continuously improves resume/CV variants.
- Tracks job applications, companies, recruiters, referrals, interviews, and outcomes.
- Generates targeted resumes and cover letters per role.
- Maintains an achievement bank (atomic XYZ bullets) and project portfolio.
- Tracks role-readiness gaps and interview prep.
- Catalogues visa/relocation research per region.

## Primary track

**Remote-from-India for global companies.** Salary and work/lifestyle quality are the top filters; relocation to US/EU/UK/IE/Japan is opportunistic, not the main target. This bias shapes the platform tier rankings in `research/2026-05-14-job-platforms-catalog.md`.

## Lifecycle folders

- `intake/` — questionnaires you fill in once to seed the workspace
- `achievements/` — atomic XYZ accomplishment bullets, one per file
- `roles/` — saved target-role definitions (JD + keywords + region)
- `applications/` — one file per application, kanban-status driven
- `contacts/` — recruiter/HM/referrer CRM
- `companies/` — per-company profiles (size, sponsors_visa, careers_url)
- `resumes/` — `master.resume.json` (canonical) + per-role variants
- `cover-letters/` — one per application
- `interview-prep/` — per-company prep + `common.md` (system design, behavioral, DSA)
- `projects/` — portfolio entries
- `decisions/` — career decision log
- `research/` — visa-research notes + job-platforms catalog
- `inbox/` — raw captures (job posts, recruiter DMs, IG-saved-reels)
- `private/` — **gitignored** — sensitive structured data (current comp, ESOPs, vesting, comp targets per region, personal contact supplements). See `private/_CONVENTIONS.md` after you set up the folder locally.

Source artifacts (raw resume PDFs, LinkedIn exports, IG dumps) live outside this workspace under the repo-root `personal/` folder (also gitignored). See `personal/README.md` for the layout and naming convention.

## Where to start

Read [`START_HERE.md`](START_HERE.md). Then fill `intake/` files in order (01 → 07).

## Operating rules

See [`CLAUDE.md`](CLAUDE.md) for the operating contract this workspace expects from Claude. Codex equivalent: [`AGENTS.md`](AGENTS.md). Type-by-type frontmatter examples: [`TEMPLATES.md`](TEMPLATES.md).

## Current state

See [`STATE.md`](STATE.md) for a snapshot of active applications, pending follow-ups, and the next thing to do.
