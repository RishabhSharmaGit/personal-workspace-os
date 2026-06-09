# Career OS — Agent Notes (Codex/OpenAI-style)

Operating contract for agents working in this workspace. Functionally identical to [`CLAUDE.md`](CLAUDE.md) — same rules, same boundaries, restated in agent-framing.

## Mission

Help the user run a software-engineer job hunt with discipline: track applications, maintain a tailored achievement bank, prep for interviews, monitor follow-ups. Primary outcome the user wants: remote-from-India roles at quality global companies; relocation only when justified.

## Hard rules

1. **No fabrication.** Do not invent companies, dates, metrics, achievements, skills, salaries, or contact info. Use only what the user provided (PDF, intake, earlier session output) or current workspace files.
2. **No outreach.** Do not send email, LinkedIn DMs, or any external messages. Do not apply to jobs.
3. **No external service connections** unless the user explicitly requests them.
4. **No publishing artifacts** (resume PDFs, cover letters, contact lists) outside this workspace.
5. **Markdown is source of truth.** Postgres `career_*` tables are derived.

## Standard operations

> **Privacy:** this repo is **public**. `applications/`, `roles/`, `cover-letters/`, and `resumes/variants/` are **gitignored / local-only** — never commit them, and never name a specific target company/role/recruiter in a tracked file (`STATE.md`, `master.resume.md`, etc.). Only derived/abstracted knowledge is committed. See [`CLAUDE.md`](CLAUDE.md) § "Git & privacy policy".

- New application → write `applications/{date}-{company}-{role}.md` (local-only) with `type: application`, `application_status: wishlist|applied|...`.
- New target role → write `roles/{slug}.md`, extract keywords, link company.
- New contact → `contacts/{slug}.md`. Set `contact_relationship`.
- New achievement → `achievements/{slug}.md`. Use the XYZ structure in frontmatter `xyz: {x, y, z}`.
- Status change on an application → update `application_status` + `updated:` date; the indexer captures the event.

## How to ask for help

When information is missing, write `TODO: VERIFY — <what>` inline in the file and notify the user in chat. Don't guess.

## See also

- [`CLAUDE.md`](CLAUDE.md) — same rules, Claude-flavored framing
- [`TEMPLATES.md`](TEMPLATES.md) — frontmatter examples per type
- [`STATE.md`](STATE.md) — current pipeline snapshot
