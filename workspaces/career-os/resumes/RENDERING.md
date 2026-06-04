# Resume rendering + scoring

PDFs are produced from a **compact, single-column, ATS-safe HTML template** (hand-rolled, dense —
minimal whitespace) rendered to PDF via headless Edge/Chrome. The page targets are **master ≤ 3 pages,
tailored cut ≤ 2 pages** — the JSON Resume `jsonresume-theme-even` route was tried but renders far too
sparse (master ballooned to ~9 pages), so it's deprecated in favour of the compact template.

## Files per resume

| File | Tracked? | Role |
|---|---|---|
| `*.html` | ✅ | **render source** — compact ATS-safe template |
| `*.md` | ✅ | human-readable mirror + input to the scorer |
| `*.pdf` | ❌ gitignored | final PDF (regenerate on demand) |
| `*.rendered.html` | ❌ gitignored | (legacy JSON-Resume output; unused) |

- Master: `master.html` (+ `master.resume.json` = structured-data archive in JSON Resume schema, kept
  for reference / the optional theme route; **not** the render source).
- Tailored cuts: `variants/<date>-<company>-<role>.{html,md}`.

## Render to PDF (1 step, Windows headless Edge — no extra install)

```powershell
$edge = "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"
& $edge --headless --disable-gpu --no-pdf-header-footer `
  --print-to-pdf="R:\Development\Workspace\workspaces\career-os\resumes\master.pdf" `
  "file:///R:/Development/Workspace/workspaces/career-os/resumes/master.html"
```
(macOS/Linux: open the `.html` in Chrome → Print → Save as PDF, or `chrome --headless --print-to-pdf`.)
Preview anytime by opening the `.html` in a browser. Check page count: `bun run pagecount.ts <file.pdf>`.

## Editing the look

Each `.html` carries its own compact `<style>` block (font ~9.5pt, tight margins/leading, one-line
skills rows). To make a resume denser or looser, tune that block — keep it single-column (no sidebars,
tables, or images) for ATS. The `2026-06-04-therxassistant-tech-lead.html` is the current reference for
the compact style.

## Score a resume against a JD

`score.ts` is a local ATS / JD-match analyzer (commercial scorers like Jobscan are auth-walled and
can't be looped against). It computes keyword coverage, ATS-parseability, length, and quantification.

```bash
bun run resume:score -- --resume variants/2026-06-04-therxassistant-tech-lead.md \
                        --jd ../roles/therxassistant-tech-lead.keywords.json
```

The JD keyword file (`roles/<slug>.keywords.json`) is curated per posting:
`{ "required": [...], "bonus": [...], "domain": [...] }` — each entry a string or alias array.

**Loop**: score → read the "MISSING" lines → add the missing keywords *in real context* (never stuff)
→ re-score. The RX variant iterated from 68 (untailored baseline) to 100.

## Changing the look

`jsonresume-theme-even` is single-column and ATS-safe. To try another theme:
`bun add -d jsonresume-theme-<name>` then `--theme jsonresume-theme-<name>`. Keep it single-column
(no sidebars) for ATS. Good alternatives: `jsonresume-theme-even` (current), `jsonresume-theme-kard`,
`jsonresume-theme-standard`.
