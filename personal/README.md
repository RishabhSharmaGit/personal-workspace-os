# `personal/` — source artifacts (gitignored content)

Local-only folder for personal source artifacts ingested into the Workspace OS — resumes, profile exports, social-media dumps, chat exports, miscellaneous references. **Content here is gitignored**; only this `README.md` and the per-subfolder `.gitkeep` placeholders are tracked, so the structure is visible on a fresh clone but the data never leaves your machine.

## Layout

```
personal/
  README.md                      # this file (committed)
  resumes/                       # raw resume PDFs / DOCX over time
    .gitkeep                     # committed structure marker
    YYYY-MM-<short-name>.pdf     # gitignored
  profile-exports/               # LinkedIn PDF exports, Indeed snapshots, etc.
    YYYY-MM-<source>-<slug>.pdf
  ig-dumps/                      # raw Meta data exports
    <export-folder-name-as-zipped>/
  chat-exports/                  # ChatGPT / Claude / Codex / Gemini conversations
    YYYY-MM-DD-<source>-<topic>.{md,json,html}
  references/                    # anything else: certs, contracts, agreements, screenshots
    YYYY-MM-DD-<slug>.{pdf,md,png,...}
```

## Naming convention

`YYYY-MM(-DD)-<lowercase-kebab-slug>.<ext>`

Always date-prefix. Date is the *artifact's effective date* (e.g. resume version date, export date), not when you moved the file in. Examples:

- `personal/resumes/2024-09-rishabh-sharma-sde3.pdf` — resume current as of Sep 2024 (right before joining Confido)
- `personal/profile-exports/2026-05-linkedin-rishabhz-profile.pdf` — LinkedIn export from May 2026
- `personal/ig-dumps/instagram-rishabhzd-2026-05-14-SF2IEDFE/` — Meta's own export naming (keep as-is)
- `personal/chat-exports/2026-05-20-chatgpt-job-search-brainstorm.md`

## How to add a new artifact

1. Drop the file into the matching subfolder under `personal/`.
2. Use the date-prefix naming above. Rename Meta/LinkedIn exports if their default names aren't descriptive.
3. **Do not commit** — `.gitignore` blocks all content; you'll get an automatic "ignored" status from git, which is correct.
4. If the artifact will be referenced from a workspace markdown file (e.g. an intake form citing the source resume PDF), use a relative link from the workspace file, e.g. `../../../personal/resumes/2024-09-rishabh-sharma-sde3.pdf`.

## What does NOT go here

- Files that should be committed (notes, decisions, code) — those go in `workspaces/<workspace-name>/`.
- Sensitive *structured* data like current salary, ESOP grants, vesting schedules, family financial details — those belong in `workspaces/<workspace-name>/private/` (a different gitignore rule). See `workspaces/career-os/CLAUDE.md` for the `private/` convention.
- Secrets like API keys, passwords, OAuth tokens — those go in `.env` (already gitignored).

## What's here right now (2026-05-14)

- `resumes/2024-09-rishabh-sharma-sde3.pdf` — full structured CV with bullets + projects + skills (the file content has been extracted into `workspaces/career-os/intake/02-experience.md`, `03-skills-matrix.md`, `06-portfolio-projects.md`, and `resumes/master.resume.json`)
- `profile-exports/2026-05-linkedin-rishabhz-profile.pdf` — LinkedIn public-profile PDF (was the original `Profile.pdf` at repo root)
- `ig-dumps/instagram-rishabhzd-2026-05-14-SF2IEDFE/` — Meta data export; saved-collection HTML was parsed into 3 inbox files under `workspaces/career-os/inbox/`
