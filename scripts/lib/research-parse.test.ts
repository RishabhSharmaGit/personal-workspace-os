import { describe, expect, it } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  extractSection,
  replaceSection,
  parseSeedQuestions,
  parseIterationLog,
  formatIterationEntry,
  appendIterationToLandingPage,
  type IterationEntry,
} from './research-parse.ts';

const FIXTURE = join(process.cwd(), 'tests', 'fixtures', 'research');
const emptyMd = readFileSync(join(FIXTURE, 'empty-session.md'), 'utf8');
const twoIterMd = readFileSync(join(FIXTURE, 'two-iter-session.md'), 'utf8');

describe('extractSection', () => {
  it('returns the body of a named section', () => {
    const plan = extractSection(emptyMd, 'Plan');
    expect(plan).toContain('Seed sub-questions:');
    expect(plan).toContain('1. What is a Bloom filter');
    expect(plan).not.toContain('## Iteration log');
  });

  it('returns empty string for missing section', () => {
    expect(extractSection(emptyMd, 'Nonexistent')).toBe('');
  });

  it('returns empty string for sections with no body', () => {
    expect(extractSection(emptyMd, 'Iteration log').trim()).toBe('');
  });
});

describe('replaceSection', () => {
  it('replaces section body, leaving other sections intact', () => {
    const updated = replaceSection(emptyMd, 'Synthesis', 'New synthesis content.');
    expect(updated).toContain('## Synthesis\n\nNew synthesis content.');
    expect(updated).toContain('## Plan');
    expect(updated).toContain('## Iteration log');
  });

  it('adds the section at end if missing', () => {
    const md = '# Title\n\n## A\n\nbody\n';
    const updated = replaceSection(md, 'B', 'b-body');
    expect(updated).toContain('## A\n\nbody');
    expect(updated).toContain('## B\n\nb-body');
  });
});

describe('parseSeedQuestions', () => {
  it('extracts numbered seed sub-questions', () => {
    const plan = extractSection(emptyMd, 'Plan');
    const qs = parseSeedQuestions(plan);
    expect(qs.length).toBe(5);
    expect(qs[0]).toBe('What is a Bloom filter and what problem does it solve?');
    expect(qs[4]).toBe('What are alternatives to Bloom filters (Cuckoo, quotient, xor)?');
  });

  it('returns empty array when no numbered list present', () => {
    expect(parseSeedQuestions('no list here')).toEqual([]);
  });
});

describe('parseIterationLog', () => {
  it('returns empty array on empty log', () => {
    const log = extractSection(emptyMd, 'Iteration log');
    expect(parseIterationLog(log)).toEqual([]);
  });

  it('parses two completed iterations', () => {
    const log = extractSection(twoIterMd, 'Iteration log');
    const entries = parseIterationLog(log);
    expect(entries.length).toBe(2);
    expect(entries[0]!.iteration).toBe(1);
    expect(entries[0]!.sub_question).toBe('What is a Bloom filter and what problem does it solve?');
    expect(entries[0]!.status).toBe('kept');
    expect(entries[0]!.notes_written).toEqual(['bloom-filter-basics', 'probabilistic-data-structures']);
    expect(entries[0]!.sources_captured).toEqual(['2026-05-13-bloom-filter-wikipedia']);
    expect(entries[1]!.iteration).toBe(2);
    expect(entries[1]!.score.gap_fill_bonus).toBe(1);
  });

  it('self-heals on malformed entries (skips bad entry, parses good ones)', () => {
    const badLog = `### Iteration 1 — Good
- **Status:** kept

### oops not an iteration

### Iteration 2 — Also good
- **Status:** kept
`;
    const entries = parseIterationLog(badLog);
    expect(entries.length).toBe(2);
    expect(entries.map((e) => e.iteration)).toEqual([1, 2]);
  });
});

describe('formatIterationEntry', () => {
  it('formats a kept entry with notes and sources', () => {
    const entry: IterationEntry = {
      iteration: 3,
      sub_question: 'Where are Bloom filters used?',
      picked_reason: 'Applied angle gap',
      score: { info_gain: 7.0, gap_fill_bonus: 0, total: 7.0 },
      sources_captured: ['2026-05-13-redis-bloom'],
      notes_written: ['bloom-filter-applications'],
      contradictions: [],
      status: 'kept',
    };
    const md = formatIterationEntry(entry);
    expect(md).toContain('### Iteration 3 — Where are Bloom filters used?');
    expect(md).toContain('- **Picked because:** Applied angle gap');
    expect(md).toContain('- **Score:** info_gain=7.0 + gap_fill=0.0 → 7.0');
    expect(md).toContain('- **Sources:** [[2026-05-13-redis-bloom]]');
    expect(md).toContain('- **Notes:** [[bloom-filter-applications]]');
    expect(md).toContain('- **Status:** kept');
    expect(md).not.toContain('Contradictions');
  });

  it('omits Sources/Notes lines when empty', () => {
    const entry: IterationEntry = {
      iteration: 4,
      sub_question: 'Paywalled question',
      picked_reason: 'next in queue',
      score: { info_gain: 6.0, gap_fill_bonus: 0, total: 6.0 },
      sources_captured: [],
      notes_written: [],
      contradictions: [],
      status: 'low-signal',
    };
    const md = formatIterationEntry(entry);
    expect(md).toContain('- **Status:** low-signal');
    expect(md).not.toContain('- **Sources:**');
    expect(md).not.toContain('- **Notes:**');
  });

  it('includes contradictions when present', () => {
    const entry: IterationEntry = {
      iteration: 5,
      sub_question: 'Q',
      picked_reason: 'r',
      score: { info_gain: 5, gap_fill_bonus: 0, total: 5 },
      sources_captured: [],
      notes_written: ['note-a'],
      contradictions: [{ note_slug: 'note-a', conflicts_with: 'source-b', summary: 'They disagree' }],
      status: 'kept',
    };
    const md = formatIterationEntry(entry);
    expect(md).toContain('- **Contradictions:**');
    expect(md).toContain('[[note-a]] vs [[source-b]]: They disagree');
  });
});

describe('appendIterationToLandingPage', () => {
  it('round-trips: append → parse → identical entry', () => {
    const entry: IterationEntry = {
      iteration: 1,
      sub_question: 'First Q?',
      picked_reason: 'because',
      score: { info_gain: 8.5, gap_fill_bonus: 2, total: 10.5 },
      sources_captured: ['s-a', 's-b'],
      notes_written: ['n-a'],
      contradictions: [],
      status: 'kept',
    };
    const updated = appendIterationToLandingPage(emptyMd, entry);
    const reparsed = parseIterationLog(extractSection(updated, 'Iteration log'));
    expect(reparsed.length).toBe(1);
    expect(reparsed[0]!.iteration).toBe(1);
    expect(reparsed[0]!.sub_question).toBe('First Q?');
    expect(reparsed[0]!.score.total).toBeCloseTo(10.5, 1);
    expect(reparsed[0]!.notes_written).toEqual(['n-a']);
  });

  it('appends a second iteration after an existing one', () => {
    const entry: IterationEntry = {
      iteration: 3,
      sub_question: 'Third Q',
      picked_reason: 'r',
      score: { info_gain: 6, gap_fill_bonus: 0, total: 6 },
      sources_captured: [],
      notes_written: [],
      contradictions: [],
      status: 'low-signal',
    };
    const updated = appendIterationToLandingPage(twoIterMd, entry);
    const entries = parseIterationLog(extractSection(updated, 'Iteration log'));
    expect(entries.length).toBe(3);
    expect(entries.map((e) => e.iteration)).toEqual([1, 2, 3]);
  });
});
