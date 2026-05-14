# Start Here — Career OS Quickstart

5-minute first-time read. Goal: get this workspace from "scaffolded" to "useful" with about 60–90 minutes of your input.

## 1. Read these (5 min)

- [`README.md`](README.md) — what's here, why
- [`CLAUDE.md`](CLAUDE.md) — operating rules
- [`STATE.md`](STATE.md) — current state (empty initially)

## 2. Fill these intake files, in order (60–90 min)

Each file has self-explanatory sections. Pre-seeded fields from your `Profile.pdf` are marked `[FROM-PDF]` — verify and extend, don't trust silently.

1. [`intake/01-profile.md`](intake/01-profile.md) — basics, contact, work-auth status *(5 min — verify PDF data)*
2. [`intake/02-experience.md`](intake/02-experience.md) — your roles *(15 min — expand bullets, pre-seeded from PDF)*
3. [`intake/03-skills-matrix.md`](intake/03-skills-matrix.md) — skills × proficiency × years *(10 min)*
4. [`intake/04-achievement-prompts.md`](intake/04-achievement-prompts.md) — 15 prompts to seed your XYZ bank *(30 min — this is the high-leverage one)*
5. [`intake/05-target-roles.md`](intake/05-target-roles.md) — what you're actually targeting *(10 min)*
6. [`intake/06-portfolio-projects.md`](intake/06-portfolio-projects.md) — projects worth showcasing *(15 min)*
7. [`intake/07-relocation-preferences.md`](intake/07-relocation-preferences.md) — region priorities, sponsor must-haves *(5 min)*

## 3. After intake — first concrete moves

Once intake is filled:

- Pick **3-5 tier-1 platforms** from [`research/2026-05-14-job-platforms-catalog.md`](research/2026-05-14-job-platforms-catalog.md) and register on them. The most relevant for your primary track: **Uplers, Turing, Arc.dev, Toptal, Wellfound, Cutshort**.
- Convert your top **10 XYZ bullets** from `intake/04-achievement-prompts.md` into atomic notes under `achievements/`. Use the structure shown in [`TEMPLATES.md`](TEMPLATES.md).
- Generate `resumes/master.resume.json` from your filled-in `intake/02-experience.md` + the achievement bank. (Manual for now; a `tailor-resume` skill will automate per-role variants in Phase 3.)
- For each company you want to target, create `companies/{slug}.md` + the matching `roles/{slug}.md`.

## 4. Daily / weekly cadence

- **Daily** (5 min): scan `applications/` for entries where `next_action_date <= today`. Follow up; update status; log the event.
- **Weekly** (20 min): write a decision log entry in `decisions/YYYY-MM-WW-week-review.md`. What you learned, what stalled, what's next. Triage `inbox/`.
- **Monthly** (60 min): retune target-roles list and platform tier rankings based on what actually worked.

## 5. What's already seeded for you

- PDF profile facts → `intake/01-profile.md` and `intake/02-experience.md` (look for `[FROM-PDF]` markers)
- Your 50-platform list (Google Doc) → `research/2026-05-14-job-platforms-catalog.md`, tier-ranked for your primary track
- The 4 URLs you sent → 4 visa/relocation research notes under `research/`
- Your IG saved collections (`claude`, `Interview Prep`, `resume building`, `Resume builder`) → 3 inbox files for triage

## 6. What's deliberately NOT here

- No automated job scraping
- No email / LinkedIn / job-board integrations
- No auto-applying
- No invented facts, dates, metrics, or achievements
