import { extractWikilinks } from './wikilinks.ts';

export type Contradiction = {
  note_slug: string;
  conflicts_with: string;
  summary: string;
};

export type IterationEntry = {
  iteration: number;
  sub_question: string;
  picked_reason: string;
  score: {
    info_gain: number;
    gap_fill_bonus: number;
    total: number;
  };
  sources_captured: string[];
  notes_written: string[];
  contradictions: Contradiction[];
  status: 'kept' | 'skipped' | 'low-signal' | 'error';
};

// Extract content under a "## <heading>" line up to the next "## " heading or EOF.
export function extractSection(md: string, heading: string): string {
  const lines = md.split(/\r?\n/);
  const target = `## ${heading}`;
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i] === target) {
      start = i + 1;
      break;
    }
  }
  if (start === -1) return '';
  let end = lines.length;
  for (let i = start; i < lines.length; i++) {
    if (lines[i]!.startsWith('## ')) {
      end = i;
      break;
    }
  }
  return lines.slice(start, end).join('\n').replace(/^\n+|\n+$/g, '');
}

// Replace the body of "## <heading>". Adds the section at the end if missing.
export function replaceSection(md: string, heading: string, newBody: string): string {
  const lines = md.split(/\r?\n/);
  const target = `## ${heading}`;
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i] === target) {
      start = i;
      break;
    }
  }
  if (start === -1) {
    // Append at end.
    const trailing = md.endsWith('\n') ? '' : '\n';
    return `${md}${trailing}\n## ${heading}\n\n${newBody}\n`;
  }
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (lines[i]!.startsWith('## ')) {
      end = i;
      break;
    }
  }
  const before = lines.slice(0, start).join('\n');
  const after = lines.slice(end).join('\n');
  return `${before}\n## ${heading}\n\n${newBody}\n${after ? '\n' + after : ''}`.replace(/\n{3,}/g, '\n\n');
}

// Pull numbered sub-questions out of a Plan section body.
export function parseSeedQuestions(planSection: string): string[] {
  const out: string[] = [];
  const re = /^\s*(\d+)\.\s+(.+?)\s*$/gm;
  for (const m of planSection.matchAll(re)) {
    out.push(m[2]!);
  }
  return out;
}

const ITER_HEADER_RE = /^### Iteration (\d+) — (.+)$/;
const BULLET_RE = /^- \*\*([^*]+):\*\*\s*(.*)$/;
const CONTRADICTION_LINE_RE = /^\s*-\s*\[\[([^\]]+)\]\] vs \[\[([^\]]+)\]\]: (.+)$/;

export function parseIterationLog(logSection: string): IterationEntry[] {
  const lines = logSection.split(/\r?\n/);
  const out: IterationEntry[] = [];
  let cur: Partial<IterationEntry> | null = null;
  let inContradictions = false;

  const finishCurrent = () => {
    if (cur && typeof cur.iteration === 'number' && cur.sub_question && cur.status) {
      out.push({
        iteration: cur.iteration,
        sub_question: cur.sub_question,
        picked_reason: cur.picked_reason ?? '',
        score: cur.score ?? { info_gain: 0, gap_fill_bonus: 0, total: 0 },
        sources_captured: cur.sources_captured ?? [],
        notes_written: cur.notes_written ?? [],
        contradictions: cur.contradictions ?? [],
        status: cur.status,
      });
    }
    cur = null;
    inContradictions = false;
  };

  for (const line of lines) {
    const headerMatch = line.match(ITER_HEADER_RE);
    if (headerMatch) {
      finishCurrent();
      cur = {
        iteration: Number(headerMatch[1]),
        sub_question: headerMatch[2]!,
        sources_captured: [],
        notes_written: [],
        contradictions: [],
      };
      continue;
    }
    if (!cur) continue;

    if (inContradictions) {
      const cMatch = line.match(CONTRADICTION_LINE_RE);
      if (cMatch) {
        cur.contradictions!.push({
          note_slug: cMatch[1]!,
          conflicts_with: cMatch[2]!,
          summary: cMatch[3]!,
        });
        continue;
      }
      if (line.match(BULLET_RE) || line.match(ITER_HEADER_RE)) {
        inContradictions = false;
      } else {
        continue;
      }
    }

    const bullet = line.match(BULLET_RE);
    if (!bullet) continue;
    const key = bullet[1]!.toLowerCase();
    const value = bullet[2] ?? '';

    if (key === 'picked because') {
      cur.picked_reason = value;
    } else if (key === 'score') {
      const m = value.match(/info_gain=([\d.]+)\s*\+\s*gap_fill=([\d.]+)\s*→\s*([\d.]+)/);
      if (m) {
        cur.score = {
          info_gain: Number(m[1]),
          gap_fill_bonus: Number(m[2]),
          total: Number(m[3]),
        };
      }
    } else if (key === 'sources') {
      cur.sources_captured = extractWikilinks(value).map((l) => l.slug);
    } else if (key === 'notes') {
      cur.notes_written = extractWikilinks(value).map((l) => l.slug);
    } else if (key === 'status') {
      const s = value.trim();
      if (s === 'kept' || s === 'skipped' || s === 'low-signal' || s === 'error') {
        cur.status = s;
      }
    } else if (key === 'contradictions') {
      inContradictions = true;
    }
  }
  finishCurrent();
  return out;
}

export function formatIterationEntry(entry: IterationEntry): string {
  const lines: string[] = [];
  lines.push(`### Iteration ${entry.iteration} — ${entry.sub_question}`);
  lines.push(`- **Picked because:** ${entry.picked_reason}`);
  lines.push(
    `- **Score:** info_gain=${entry.score.info_gain.toFixed(1)} + gap_fill=${entry.score.gap_fill_bonus.toFixed(1)} → ${entry.score.total.toFixed(1)}`,
  );
  if (entry.sources_captured.length > 0) {
    lines.push(`- **Sources:** ${entry.sources_captured.map((s) => `[[${s}]]`).join(', ')}`);
  }
  if (entry.notes_written.length > 0) {
    lines.push(`- **Notes:** ${entry.notes_written.map((n) => `[[${n}]]`).join(', ')}`);
  }
  lines.push(`- **Status:** ${entry.status}`);
  if (entry.contradictions.length > 0) {
    lines.push(`- **Contradictions:**`);
    for (const c of entry.contradictions) {
      lines.push(`  - [[${c.note_slug}]] vs [[${c.conflicts_with}]]: ${c.summary}`);
    }
  }
  return lines.join('\n');
}

export function appendIterationToLandingPage(rawMd: string, entry: IterationEntry): string {
  const existing = extractSection(rawMd, 'Iteration log');
  const newEntry = formatIterationEntry(entry);
  const newBody = existing.trim() ? `${existing.trim()}\n\n${newEntry}` : newEntry;
  return replaceSection(rawMd, 'Iteration log', newBody);
}
