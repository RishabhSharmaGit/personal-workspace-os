# `resumes/variants/`

Tailored / draft resume files. Naming: `YYYY-MM-DD-<purpose>.{html,md,resume.json,pdf}`.

## What's in here right now

- `2026-05-14-temp-general.html` — visually-styled HTML resume, print-ready. Open in any browser.
- `2026-05-14-temp-general.md` — same content as Markdown for text-editor edits.
- `2026-05-14-temp-general.pdf` — generated from the HTML (if PDF generation succeeded; if not, render it yourself, see below).

The master canonical is one level up: `resumes/master.resume.json` (structured) + `resumes/master.resume.md` (mirror). Variants are derived from the master.

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
