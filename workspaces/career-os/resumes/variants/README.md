# `resumes/variants/`

Tailored resume cuts, one per job posting. Naming: `YYYY-MM-DD-<company>-<role>.{html,md,pdf}`.

## What's in here right now

- `2026-06-04-therxassistant-tech-lead.{html,md,pdf}` — **TheRxAssistant — Tech Lead** (founding team, healthcare AI). Tailored, JD-keyword-mirrored, 2-page.

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
| `roles/<co>-<role>.keywords.json` | yes | curated JD keywords for `score.ts` |
| `applications/<date>-<co>-<role>.md` | yes | status tracker (wishlist→applied→…) |
| `resumes/variants/<date>-<co>-<role>.html` | yes | **render source** (compact ATS template) |
| `resumes/variants/<date>-<co>-<role>.md` | yes | human mirror + scorer input |
| `resumes/variants/<date>-<co>-<role>.pdf` | no (gitignored) | generated |

**Rendering + scoring**: see [`../RENDERING.md`](../RENDERING.md). PDFs come from the compact `.html`
template via headless Edge (dense, single-column, ATS-safe; tailored cut ≤ 2 pages). Each variant is
scored against its JD with `score.ts` and iterated until keyword coverage is strong (the RX cut went
68 → 100). Check length with `pagecount.ts`.

## Getting a PDF

One command (Windows headless Edge) — full details + macOS/Linux in [`../RENDERING.md`](../RENDERING.md):

```powershell
& "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe" --headless --disable-gpu --no-pdf-header-footer `
  --print-to-pdf="R:\Development\Workspace\workspaces\career-os\resumes\variants\<slug>.pdf" `
  "file:///R:/Development/Workspace/workspaces/career-os/resumes/variants/<slug>.html"
```

Preview anytime by opening the `.html` in a browser. Check length with `bun run pagecount.ts <file>.pdf`.

## Editing flow

- **Content** (bullets, summary): edit the `.html` (render source) and keep the `.md` mirror in sync.
- **Visual tweaks** (spacing, fonts, margins): edit the `<style>` block at the top of the `.html`.
- **Score against the JD** after edits: `bun run score.ts --resume <slug>.html --jd ../roles/<slug>.keywords.json`.

## Before sharing externally

1. Verify every metric is still defensible (some are reconstructed estimates — see the achievement notes).
2. Confirm any JD-specific open questions (remote/relocation, salary) are settled.
3. Re-score and re-check page count after any edit.
