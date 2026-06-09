# Career OS — Operating Rules

## Purpose

Job hunt and career-development workspace. Owner is a senior software engineer based in India. **Primary track**: remote-from-India roles for global companies; **secondary**: relocation to US / EU / UK / IE / Japan when salary + lifestyle warrant.

## What lives here

- One markdown file per: application, contact, achievement, target-role, resume variant, cover letter, project, company, interview-prep note, decision.
- Visa research per region under `research/`.
- A canonical resume in `resumes/master.resume.json` (JSON Resume schema).
- Raw captured items (job posts pasted, recruiter DMs, saved-reel URLs) under `inbox/` for later triage.

## What does NOT live here

- General-knowledge notes / articles / chat distillations → those belong in `second-brain`.
- Code projects → separate workspaces or upstream repos.
- Time-bound habit/health logs → separate workspace.

## Hard rules (do not violate)

1. **Do not invent personal facts.** Companies, dates, metrics, achievements, skills, education, salary numbers — only use facts the user has explicitly provided or that come from their `Profile.pdf`, LinkedIn, intake answers, or earlier session output. If unsure, leave a `TODO: VERIFY` marker and ask.
2. **Do not apply to jobs, send messages, or contact recruiters.** This workspace is for tracking and preparation; outreach is human-only.
3. **Do not connect external services (email, LinkedIn, job boards) without explicit user request.** No MCP setup, OAuth, or scraping outside the user's session.
4. **Do not export, push, publish, or share** anything from this workspace (resume PDFs, cover letters, contact lists) without explicit user approval per artifact.
5. **Markdown is the source of truth.** Postgres (`career_*` tables) is a derived index, populated by the workspace indexer. If they disagree, run `bun run index:rebuild`.

## Personal-data conventions

Two folders hold sensitive material — neither ever reaches the repo:

- **`workspaces/career-os/private/`** — gitignored at the repo level (rule: `workspaces/*/private/`). Holds sensitive *structured* data: current salary, ESOP grants, vesting schedules, comp targets per region, personal contact supplements, family/relocation specifics. See `private/_CONVENTIONS.md`. Committed markdown files (e.g. `intake/01-profile.md`, `intake/05-target-roles.md`) reference these via `→ private/<file>.md (gitignored)` instead of inlining values.
- **`personal/`** at the repo root — holds raw source artifacts (resume PDFs, LinkedIn exports, IG dumps, chat exports). Content is gitignored; structure is committed via `personal/README.md` + `.gitkeep` files. See `personal/README.md` for layout + naming.

**Hard rule for Claude**: never quote, paste, render, summarize, or otherwise expose values that live under `private/` or `personal/` in any committed file. If the user explicitly asks for a private value to land in a public file (e.g. salary in a written negotiation script), confirm twice before doing so.

## Git & privacy policy — application materials are LOCAL ONLY

**This repo is public** (reachable from the GitHub profile linked on the résumé). The *specific job applications* — which companies/roles are being targeted, tailored resume variants, cover letters, and per-application trackers — are therefore **gitignored and never committed**. Local-only folders:

- `applications/` · `roles/` · `cover-letters/` · `resumes/variants/`

(`.gitkeep` files preserve the structure; `resumes/variants/README.md` keeps the workflow doc tracked. The git rule lives in the repo-root `.gitignore`.)

**What IS committed**: the master résumé (`resumes/master.*`), abstracted/derived knowledge (`achievements/`, `research/`, `decisions/`, `intake/`, `interview-prep/common.md`), tooling, and docs. If a job application yields durable, *abstracted* knowledge (skills to master, a decision, a company-agnostic keyword set), distill it into `decisions/`, `research/`, `notes/`, or `intake/`.

**Hard rule for tracked files**: never name a specific target company/role/recruiter in any *committed* file (e.g. `STATE.md`, `master.resume.md`). Keep targeting detail inside the local-only folders. STATE.md may carry aggregate counts only.

## Naming conventions

- **Achievements**: concept-named, no date prefix. `achievements/voice-ai-p95-latency-reduction.md`. Slug = filename minus `.md`.
- **Applications**: date + company + role. `applications/2026-05-14-vercel-staff-eng.md`.
- **Cover letters**: date + company. `cover-letters/2026-05-14-vercel.md`.
- **Contacts**: person slug. `contacts/jane-doe.md`.
- **Companies**: company slug. `companies/vercel.md`.
- **Target roles**: company + role-summary slug. `roles/vercel-staff-frontend.md`.
- **Resume variants**: target slug. `resumes/variants/vercel-staff-frontend.resume.json`.
- **Interview prep**: per-company `interview-prep/vercel/notes.md`; generic in `interview-prep/common.md`.
- **Decisions**: date-prefixed. `decisions/2026-05-20-prioritize-remote-tracks.md`.
- **Research / Inbox**: date-prefixed.
- **Date format in body text**: see root `CLAUDE.md` § "Date conventions". Body-text dates the user reads/writes (application timeline entries, decision logs, comp dates, recruiter touchpoints) use **`DD-MMM-YYYY`** (e.g. `23-Oct-2024`). Frontmatter fields (`created:`, `updated:`, `applied_at:`, `next_action_date:`) and file-name prefixes stay ISO `YYYY-MM-DD` — the Zod schema enforces this.

## Application status lifecycle

`wishlist → applied → screen → technical → onsite → offer → accepted | rejected | withdrawn | ghosted`.

This lives in frontmatter as `application_status:`. Status changes append a row to `career_application_events` via the indexer (Phase 2 — not yet wired).

## Active skills

Inherited from workspace OS: `capture`, `query`, `triage-inbox`, `weekly-review`, `distill-chat`, `research`, `index-rebuild`.

Career-specific skills (Phase 3, not yet built):
- `tailor-resume` — given a target-role slug, rank achievements by JD-keyword match, emit a variant resume.
- `log-application` — create application file from a pasted JD; pre-fill company + target-role rows.
- `daily-digest` — list applications by `next_action_date` ascending.
- `interview-prep-scout` — gather company info into `interview-prep/{company}/`.

## Linking conventions

- Applications link to their target-role, company, resume variant, and contacts via `[[wikilinks]]`.
- Achievements link to the role/project they came from via `[[role-slug]]`.
- Interview prep links to the application and target-role.
- Decisions link to whatever they're deciding about.
