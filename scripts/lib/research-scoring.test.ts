import { describe, expect, it } from 'bun:test';
import {
  buildCandidates,
  pickTopCandidate,
  extractKeywords,
  type Candidate,
} from './research-scoring.ts';
import type { IterationEntry } from './research-parse.ts';

const seedQuestions = [
  'What is a Bloom filter?',
  'False-positive rate formula?',
  'Counting Bloom filter?',
  'Applications in practice?',
  'Alternatives (Cuckoo, xor)?',
];

describe('buildCandidates', () => {
  it('returns all seed questions when iteration log is empty and no unresolved links', () => {
    const cands = buildCandidates(seedQuestions, [], []);
    expect(cands.length).toBe(5);
    expect(cands[0]!.kind).toBe('seed');
    expect(cands.map((c) => c.sub_question)).toEqual(seedQuestions);
  });

  it('drops seed questions already covered in iteration log', () => {
    const log: IterationEntry[] = [
      {
        iteration: 1,
        sub_question: seedQuestions[0]!,
        picked_reason: 'r',
        score: { info_gain: 9, gap_fill_bonus: 0, total: 9 },
        sources_captured: [],
        notes_written: ['bloom-filter-basics'],
        contradictions: [],
        status: 'kept',
      },
    ];
    const cands = buildCandidates(seedQuestions, log, []);
    expect(cands.length).toBe(4);
    expect(cands.map((c) => c.sub_question)).not.toContain(seedQuestions[0]);
  });

  it('adds unresolved-link candidates with gap_fill_bonus', () => {
    const cands = buildCandidates(seedQuestions, [], ['position-bias', 'mmr-rerank']);
    const linkCands = cands.filter((c) => c.kind === 'unresolved-link');
    expect(linkCands.length).toBe(2);
    expect(linkCands.map((c) => c.sub_question).sort()).toEqual([
      'Explore unresolved link: mmr-rerank',
      'Explore unresolved link: position-bias',
    ]);
    expect(linkCands[0]!.score.gap_fill_bonus).toBeGreaterThan(0);
  });

  it('assigns higher info_gain to earlier seed questions (descending heuristic)', () => {
    const cands = buildCandidates(seedQuestions, [], []);
    for (let i = 0; i < cands.length - 1; i++) {
      expect(cands[i]!.score.info_gain).toBeGreaterThanOrEqual(cands[i + 1]!.score.info_gain);
    }
  });
});

describe('pickTopCandidate', () => {
  it('returns the highest-scoring candidate', () => {
    const cands: Candidate[] = [
      { kind: 'seed', sub_question: 'A', score: { info_gain: 8, gap_fill_bonus: 0, total: 8 }, keywords: ['a'] },
      { kind: 'seed', sub_question: 'B', score: { info_gain: 7, gap_fill_bonus: 1, total: 8 }, keywords: ['b'] },
      { kind: 'seed', sub_question: 'C', score: { info_gain: 9, gap_fill_bonus: 0, total: 9 }, keywords: ['c'] },
    ];
    expect(pickTopCandidate(cands)!.sub_question).toBe('C');
  });

  it('returns null on empty list', () => {
    expect(pickTopCandidate([])).toBeNull();
  });
});

describe('extractKeywords', () => {
  it('lowercases, strips punctuation, drops stopwords, dedupes', () => {
    const kw = extractKeywords('What is the false-positive rate of a Bloom filter?');
    expect(kw).toContain('bloom');
    expect(kw).toContain('filter');
    expect(kw).toContain('false-positive');
    expect(kw).not.toContain('what');
    expect(kw).not.toContain('is');
    expect(kw).not.toContain('the');
  });

  it('returns at most 6 keywords', () => {
    const kw = extractKeywords(
      'consistent hashing distributed systems load balancing routing strategy implementations',
    );
    expect(kw.length).toBeLessThanOrEqual(6);
  });
});
