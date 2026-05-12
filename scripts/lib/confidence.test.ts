import { describe, expect, it } from 'bun:test';
import { scoreConfidence } from './confidence.ts';

describe('scoreConfidence', () => {
  it('returns high when workspace + anchor + unambiguous type', () => {
    expect(
      scoreConfidence({
        workspaceResolved: true,
        anchorLinksExist: true,
        typeUnambiguous: true,
        llmSelfReport: 'high',
      }),
    ).toBe('high');
  });

  it('returns medium when one criterion fails', () => {
    expect(
      scoreConfidence({
        workspaceResolved: true,
        anchorLinksExist: false,
        typeUnambiguous: true,
        llmSelfReport: 'high',
      }),
    ).toBe('medium');
  });

  it('returns low when two or more criteria fail', () => {
    expect(
      scoreConfidence({
        workspaceResolved: false,
        anchorLinksExist: false,
        typeUnambiguous: true,
        llmSelfReport: 'high',
      }),
    ).toBe('low');
  });

  it('caps at LLM self-report ceiling', () => {
    expect(
      scoreConfidence({
        workspaceResolved: true,
        anchorLinksExist: true,
        typeUnambiguous: true,
        llmSelfReport: 'low',
      }),
    ).toBe('low');
  });

  it('caps medium when LLM says medium even if all criteria met', () => {
    expect(
      scoreConfidence({
        workspaceResolved: true,
        anchorLinksExist: true,
        typeUnambiguous: true,
        llmSelfReport: 'medium',
      }),
    ).toBe('medium');
  });
});
