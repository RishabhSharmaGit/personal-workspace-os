export type ConfidenceLevel = 'low' | 'medium' | 'high';

export type ConfidenceInputs = {
  workspaceResolved: boolean;
  anchorLinksExist: boolean;
  typeUnambiguous: boolean;
  llmSelfReport: ConfidenceLevel;
};

const RANK: Record<ConfidenceLevel, number> = { low: 0, medium: 1, high: 2 };
const FROM_RANK: ConfidenceLevel[] = ['low', 'medium', 'high'];

export function scoreConfidence(inputs: ConfidenceInputs): ConfidenceLevel {
  const passes =
    Number(inputs.workspaceResolved) +
    Number(inputs.anchorLinksExist) +
    Number(inputs.typeUnambiguous);

  // 3/3 → high candidate, 2/3 → medium, ≤1 → low
  let ruleLevel: ConfidenceLevel;
  if (passes === 3) ruleLevel = 'high';
  else if (passes === 2) ruleLevel = 'medium';
  else ruleLevel = 'low';

  // Cap by LLM self-report ceiling
  const cappedRank = Math.min(RANK[ruleLevel], RANK[inputs.llmSelfReport]);
  return FROM_RANK[cappedRank]!;
}
