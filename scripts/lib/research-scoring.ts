import type { IterationEntry } from './research-parse.ts';

export type CandidateKind = 'seed' | 'unresolved-link';

export type Candidate = {
  kind: CandidateKind;
  sub_question: string;
  keywords: string[];
  score: {
    info_gain: number;
    gap_fill_bonus: number;
    total: number;
  };
};

const STOPWORDS = new Set([
  'a','an','and','are','as','at','be','but','by','do','does','for','from','how','i','if',
  'in','is','it','of','on','or','so','that','the','this','to','was','were','what','when',
  'where','which','who','why','will','with','you','your','about','vs','versus',
]);

export function extractKeywords(text: string): string[] {
  const cleaned = text
    .toLowerCase()
    .replace(/[?!.,:;()\[\]{}'"]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const tokens = cleaned.split(' ');
  const seen = new Set<string>();
  const out: string[] = [];
  for (const t of tokens) {
    if (!t || STOPWORDS.has(t) || t.length < 3) continue;
    if (seen.has(t)) continue;
    seen.add(t);
    out.push(t);
    if (out.length >= 6) break;
  }
  return out;
}

// Heuristic info_gain assignment: seed questions decline from 9.0 by 0.5 per slot.
function seedInfoGain(index: number): number {
  return Math.max(9.0 - index * 0.5, 5.0);
}

const UNRESOLVED_LINK_INFO_GAIN = 7.5;
const GAP_FILL_PER_LINK = 2.0;

export function buildCandidates(
  seedQuestions: string[],
  iterationLog: IterationEntry[],
  unresolvedLinkSlugs: string[],
): Candidate[] {
  const coveredQuestions = new Set(iterationLog.map((e) => e.sub_question));
  const out: Candidate[] = [];

  // Seed candidates (preserve order, drop covered)
  seedQuestions.forEach((q, idx) => {
    if (coveredQuestions.has(q)) return;
    out.push({
      kind: 'seed',
      sub_question: q,
      keywords: extractKeywords(q),
      score: {
        info_gain: seedInfoGain(idx),
        gap_fill_bonus: 0,
        total: seedInfoGain(idx),
      },
    });
  });

  // Unresolved-link candidates (sorted alphabetically for determinism)
  const sortedLinks = [...unresolvedLinkSlugs].sort();
  for (const slug of sortedLinks) {
    const subQ = `Explore unresolved link: ${slug}`;
    if (coveredQuestions.has(subQ)) continue;
    out.push({
      kind: 'unresolved-link',
      sub_question: subQ,
      keywords: extractKeywords(slug.replace(/-/g, ' ')),
      score: {
        info_gain: UNRESOLVED_LINK_INFO_GAIN,
        gap_fill_bonus: GAP_FILL_PER_LINK,
        total: UNRESOLVED_LINK_INFO_GAIN + GAP_FILL_PER_LINK,
      },
    });
  }

  return out;
}

export function pickTopCandidate(candidates: Candidate[]): Candidate | null {
  if (candidates.length === 0) return null;
  let best = candidates[0]!;
  for (const c of candidates.slice(1)) {
    if (c.score.total > best.score.total) best = c;
  }
  return best;
}
