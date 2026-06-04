# `resumes/variants/`

Tailored resume cuts, one per job posting. Naming: `YYYY-MM-DD-<company>-<role>.{html,md,pdf}`.

## What's in here right now

- `2026-06-04-therxassistant-tech-lead.{html,md,pdf}` — **TheRxAssistant — Tech Lead** (founding team, healthcare AI). Tailored, JD-keyword-mirrored, 2-page.
- `2026-05-14-temp-general.{html,md,pdf}` — general baseline (not JD-specific).

The master canonical is one level up: `resumes/master.resume.json` (structured reservoir) + `resumes/master.resume.md` (human master, exhaustive). **Variants are tight 2-page cuts derived from the master** — pick the 4-6 highlights + bullets matching the JD, mirror the JD's exact keywords, drop the rest.

---

## ⭐ How to apply to a new job (the JD workflow)

**Where to drop a new JD**: put the raw JD file (PDF / screenshot / text) in
`personal/references/jds/` — name it `YYYY-MM-DD-<company>-<role>.<ext>`. That folder is **gitignored** (JDs can carry identifying detail), so it never gets committed.

Then ask me ("build a resume for the <company> JD") and I will:

1. **Read + distill** the JD → create `roles/<company>-<role>.md` (committed) with a full **requirement-by-requirement match analysis**, extracted keywords, and a tailoring strategy.
2. **Create the application tracker** → `applications/YYYY-MM-DD-<company>-<role>.md` (committed) with `application_status: wishlist`, timeline, why-I-want-it, concerns, next actions.
3. **Build the tailored resume** → `resumes/variants/YYYY-MM-DD-<company>-<role>.{html,md,pdf}` — derived from the master, mirroring the JD's exact tech + domain keywords, with the strongest 4-6 achievements surfaced and weaker/older roles compressed.
4. **Generate the PDF** (gitignored — sources committed, PDF regenerates on demand).

You stay in control: I'll surface gaps (e.g. "this JD wants AWS, you're GCP-primary — here's the framing") and any open questions (salary band, remote acceptability) before you send.

### The four files per application

| File | Committed? | Purpose |
|---|---|---|
| `personal/references/jds/<date>-<co>-<role>.pdf` | no (gitignored) | raw JD source |
| `roles/<co>-<role>.md` | yes | distilled JD + keyword + match analysis |
| `applications/<date>-<co>-<role>.md` | yes | status tracker (wishlist→applied→…) |
| `resumes/variants/<date>-<co>-<role>.{html,md,pdf}` | html+md yes, pdf no | the tailored resume |

## Getting a PDF — three options

### Option A (zero install — recommended): Print from Edge / Chrome
1. Open `2026-05-14-temp-general.html` in your browser (double-click in Explorer, or `start 2026-05-14-temp-general.html` in PowerShell).
2. **Ctrl + P** (Print) → Destination: **Save as PDF** → Layout: Portrait → Paper size: A4 → Margins: Default → **More settings → Background graphics: ON** (so the accent color renders).
3. Save the PDF wherever you need it.

### Option B (CLI, headless): Edge command-line
From the repo root, in PowerShell:

```powershell
$src = "R:\Development\Workspace\workspaces\career-os\resumes\variants\2026-05-14-temp-general.html"
$out = "R:\Development\Workspace\workspaces\career-os\resumes\variants\2026-05-14-temp-general.pdf"
& "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe" --headless --disable-gpu --print-to-pdf="$out" "file:///$src"
```

### Option C (Pandoc — from the Markdown twin)
If you have Pandoc + a LaTeX engine installed:

```powershell
pandoc 2026-05-14-temp-general.md -o 2026-05-14-temp-general.pdf --pdf-engine=xelatex
```

This route is most useful when you want LaTeX-quality typography. Less consistent with the styled HTML.

## Editing flow

- **Quick edits**: open the `.md` file in any editor. Re-render via Option B or C if you want a fresh PDF.
- **Visual tweaks** (spacing, colour, layout): edit the `<style>` block at the top of the `.html` file.
- **Content-only tweaks** (bullets, summary, dates): edit either file; keep them in sync if you'll share both. Markdown is generally easier for content; HTML for fine layout control.

## Before sharing externally

1. Replace the Confido placeholder block with real bullets. The placeholder is highlighted in yellow in the HTML and flagged with ⚠️ in the Markdown.
2. Verify that every metric (90%, 14d→hours, 3-4 day HRMS, 1.2M-user panel) is still defensible — these are pulled from a Sep 2024 resume; some may have evolved.
3. If the role you're applying to has a JD, **copy this file to a new variant** with a JD-specific slug and trim/reorder bullets to match the JD keywords. Don't edit the general variant — keep it as a clean baseline.

## Future: when the `tailor-resume` skill ships (Phase 3)

The plan is to generate role-tailored variants automatically:

```
/tailor-resume <target-role-slug>
```

…which will rank achievements in `achievements/` against the target-role keywords and emit a new variant in this folder. Until then, manual copy + edit.
