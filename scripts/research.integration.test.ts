import { afterAll, beforeEach, describe, expect, it } from 'bun:test';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { sql } from './lib/db.ts';
import { runInit, runPick, runLog, runFinalize } from './research.ts';
import { captureItem } from './capture.ts';
import { parseDocument } from './lib/frontmatter.ts';
import { extractSection, parseIterationLog } from './lib/research-parse.ts';

let tmpRoot: string;

beforeEach(async () => {
  tmpRoot = mkdtempSync(join(tmpdir(), 'wsos-research-int-'));
  mkdirSync(join(tmpRoot, 'workspaces', 'second-brain', 'notes'), { recursive: true });
  mkdirSync(join(tmpRoot, 'workspaces', 'second-brain', 'sources'), { recursive: true });
  mkdirSync(join(tmpRoot, 'workspaces', 'second-brain', 'research'), { recursive: true });
  await sql`delete from items where slug like '2099-99-%'`;
  await sql`delete from items where slug like 'integ-note-%'`;
  await sql`delete from agent_runs where skill_name = 'research' and started_at > now() - interval '2 hours'`;
});

afterAll(async () => {
  rmSync(tmpRoot, { recursive: true, force: true });
  await sql`delete from items where slug like '2099-99-%' or slug like 'integ-note-%'`;
});

describe('research full-loop integration (no firecrawl)', () => {
  it('init → 5x(pick→capture→log) → finalize produces expected DB + file state', async () => {
    const init = await runInit(tmpRoot, {
      topic: 'integ test topic',
      workspace: 'second-brain',
      seedQuestions: ['Q1?', 'Q2?', 'Q3?', 'Q4?', 'Q5?'],
      budget: 5,
      dateOverride: '2099-99-01',
    });

    for (let i = 1; i <= 5; i++) {
      const pick = await runPick(tmpRoot, { sessionPath: init.session_path });
      if ('skip' in pick) {
        // accept skip as a valid early exit; record it and move on
        await runLog(tmpRoot, {
          sessionPath: init.session_path,
          entry: {
            iteration: i,
            sub_question: 'skip-' + i,
            picked_reason: pick.reason,
            score: { info_gain: 0, gap_fill_bonus: 0, total: 0 },
            sources_captured: [],
            notes_written: [],
            contradictions: [],
            status: 'skipped',
          },
        });
        continue;
      }

      // Simulate "research did its thing": write one note via captureItem
      const noteSlug = `integ-note-${i}`;
      await captureItem(tmpRoot, {
        workspace: 'second-brain',
        slug: noteSlug,
        title: `Integ Note ${i}`,
        type: 'note',
        status: 'durable',
        tags: ['integ'],
        links: ['[[integ-dangling-target]]'],
        confidence: 'high',
        body: `Body for iter ${i} on ${pick.sub_question}`,
      });

      await runLog(tmpRoot, {
        sessionPath: init.session_path,
        entry: {
          iteration: i,
          sub_question: pick.sub_question,
          picked_reason: pick.picked_reason,
          score: pick.scores,
          sources_captured: [],
          notes_written: [noteSlug],
          contradictions: [],
          status: 'kept',
        },
      });
    }

    // Synthesize section (LLM-driven in production — write a stub)
    const md = readFileSync(join(tmpRoot, init.session_path), 'utf8');
    const synthBody = `Found 5 notes.\n\n### Notes added this session\n- [[integ-note-1]]\n- [[integ-note-2]]\n\n### Open questions\n- still-unknown-q`;
    writeFileSync(
      join(tmpRoot, init.session_path),
      md.replace('(pending)', synthBody),
      'utf8',
    );

    const final = await runFinalize(tmpRoot, {
      sessionPath: init.session_path,
      status: 'succeeded',
    });

    // Assert: landing page has 5 entries, status=durable, agent_runs=succeeded
    const finalMd = readFileSync(join(tmpRoot, init.session_path), 'utf8');
    const { frontmatter } = parseDocument(finalMd);
    expect(frontmatter.status).toBe('durable');

    const entries = parseIterationLog(extractSection(finalMd, 'Iteration log'));
    expect(entries.length).toBe(5);

    const runs = await sql<{ status: string; summary: string | null }[]>`
      select status, summary from agent_runs where id = ${init.agent_run_id}
    `;
    expect(runs[0]!.status).toBe('succeeded');
    expect(runs[0]!.summary).toBe(final.summary);

    // Assert: by iteration 2 or later, gap_fill_bonus on at least one pick should be > 0
    // (because integ-note-1 introduced an unresolved [[integ-dangling-target]] link)
    const gapFillSeen = entries.some((e) => e.score.gap_fill_bonus > 0);
    expect(gapFillSeen).toBe(true);

    // Cleanup notes
    await sql`delete from items where slug like 'integ-note-%'`;
  });
});
