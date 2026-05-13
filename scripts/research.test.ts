import { afterAll, beforeEach, describe, expect, it } from 'bun:test';
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { sql } from './lib/db.ts';
import { parseDocument } from './lib/frontmatter.ts';
import { runInit, runLog, runPick, runFinalize } from './research.ts';
import type { IterationEntry } from './lib/research-parse.ts';

let tmpRoot: string;

function setupTmpWorkspace(): string {
  const root = mkdtempSync(join(tmpdir(), 'wsos-research-test-'));
  mkdirSync(join(root, 'workspaces', 'second-brain', 'notes'), { recursive: true });
  mkdirSync(join(root, 'workspaces', 'second-brain', 'sources'), { recursive: true });
  mkdirSync(join(root, 'workspaces', 'second-brain', 'research'), { recursive: true });
  return root;
}

beforeEach(async () => {
  tmpRoot = setupTmpWorkspace();
  await sql`delete from items where slug like '2099-%-research-test-%'`;
  await sql`delete from agent_runs where skill_name = 'research' and started_at > now() - interval '1 hour'`;
});

afterAll(async () => {
  rmSync(tmpRoot, { recursive: true, force: true });
  await sql`delete from items where slug like '2099-%-research-test-%'`;
});

describe('runInit', () => {
  it('writes a landing page with frontmatter, plan, empty log, and empty synthesis', async () => {
    const result = await runInit(tmpRoot, {
      topic: 'research-test-bloom',
      workspace: 'second-brain',
      seedQuestions: ['Q1?', 'Q2?', 'Q3?'],
      budget: 5,
      dateOverride: '2099-01-01',
    });

    expect(result.session_path).toMatch(/research\/2099-01-01-research-test-bloom\.md$/);
    expect(result.slug).toBe('2099-01-01-research-test-bloom');
    expect(result.seed_questions).toEqual(['Q1?', 'Q2?', 'Q3?']);
    expect(result.budget).toBe(5);
    expect(result.agent_run_id).toMatch(/^[0-9a-f-]{36}$/);

    const abs = join(tmpRoot, result.session_path);
    expect(existsSync(abs)).toBe(true);
    const { frontmatter, body } = parseDocument(readFileSync(abs, 'utf8'));
    expect(frontmatter.type).toBe('research');
    expect(frontmatter.status).toBe('draft');
    expect(frontmatter.agent_run_id).toBe(result.agent_run_id);
    expect(frontmatter.budget).toBe(5);
    expect(body).toContain('## Plan');
    expect(body).toContain('1. Q1?');
    expect(body).toContain('## Iteration log');
    expect(body).toContain('## Synthesis');
  });

  it('creates an agent_runs row with status=started', async () => {
    const result = await runInit(tmpRoot, {
      topic: 'research-test-runs',
      workspace: 'second-brain',
      seedQuestions: ['A?'],
      budget: 5,
      dateOverride: '2099-01-02',
    });
    const rows = await sql<{ status: string }[]>`
      select status from agent_runs where id = ${result.agent_run_id}
    `;
    expect(rows[0]!.status).toBe('started');
  });

  it('indexes the landing page (items row exists, type=research)', async () => {
    const result = await runInit(tmpRoot, {
      topic: 'research-test-index',
      workspace: 'second-brain',
      seedQuestions: ['A?'],
      budget: 5,
      dateOverride: '2099-01-03',
    });
    const rows = await sql<{ type: string }[]>`
      select type from items where slug = ${result.slug}
    `;
    expect(rows.length).toBe(1);
    expect(rows[0]!.type).toBe('research');
  });

  it('rejects empty seedQuestions', async () => {
    let err: unknown;
    try {
      await runInit(tmpRoot, {
        topic: 'research-test-empty',
        workspace: 'second-brain',
        seedQuestions: [],
        budget: 5,
        dateOverride: '2099-01-04',
      });
    } catch (e) {
      err = e;
    }
    expect(err).toBeInstanceOf(Error);
    expect((err as Error).message).toContain('seed-questions');
  });

  it('disambiguates slug collision with -2 suffix', async () => {
    const opts = {
      topic: 'research-test-dup',
      workspace: 'second-brain',
      seedQuestions: ['A?'],
      budget: 5,
      dateOverride: '2099-01-05',
    };
    const first = await runInit(tmpRoot, opts);
    const second = await runInit(tmpRoot, opts);
    expect(first.slug).toBe('2099-01-05-research-test-dup');
    expect(second.slug).toBe('2099-01-05-research-test-dup-2');
  });
});

describe('runLog', () => {
  it('appends an iteration entry, bumps updated, updates agent_runs.summary, re-indexes', async () => {
    const init = await runInit(tmpRoot, {
      topic: 'research-test-log',
      workspace: 'second-brain',
      seedQuestions: ['Q1?', 'Q2?'],
      budget: 5,
      dateOverride: '2099-02-01',
    });

    const entry: IterationEntry = {
      iteration: 1,
      sub_question: 'Q1?',
      picked_reason: 'highest info_gain',
      score: { info_gain: 9, gap_fill_bonus: 0, total: 9 },
      sources_captured: ['2099-02-01-fake-source'],
      notes_written: ['fake-note'],
      contradictions: [],
      status: 'kept',
    };

    const result = await runLog(tmpRoot, {
      sessionPath: init.session_path,
      entry,
    });
    expect(result.ok).toBe(true);
    expect(result.iteration_number).toBe(1);

    const md = readFileSync(join(tmpRoot, init.session_path), 'utf8');
    expect(md).toContain('### Iteration 1 — Q1?');
    expect(md).toContain('- **Status:** kept');

    const runs = await sql<{ summary: string | null }[]>`
      select summary from agent_runs where id = ${init.agent_run_id}
    `;
    expect(runs[0]!.summary).toContain('1 iter');
  });

  it('appends a second iteration preserving the first', async () => {
    const init = await runInit(tmpRoot, {
      topic: 'research-test-log2',
      workspace: 'second-brain',
      seedQuestions: ['Q1?', 'Q2?'],
      budget: 5,
      dateOverride: '2099-02-02',
    });
    await runLog(tmpRoot, {
      sessionPath: init.session_path,
      entry: {
        iteration: 1,
        sub_question: 'Q1?',
        picked_reason: 'r',
        score: { info_gain: 9, gap_fill_bonus: 0, total: 9 },
        sources_captured: [],
        notes_written: [],
        contradictions: [],
        status: 'kept',
      },
    });
    await runLog(tmpRoot, {
      sessionPath: init.session_path,
      entry: {
        iteration: 2,
        sub_question: 'Q2?',
        picked_reason: 'r',
        score: { info_gain: 8.5, gap_fill_bonus: 0, total: 8.5 },
        sources_captured: [],
        notes_written: [],
        contradictions: [],
        status: 'low-signal',
      },
    });
    const md = readFileSync(join(tmpRoot, init.session_path), 'utf8');
    expect(md).toContain('### Iteration 1 — Q1?');
    expect(md).toContain('### Iteration 2 — Q2?');

    const runs = await sql<{ summary: string | null }[]>`
      select summary from agent_runs where id = ${init.agent_run_id}
    `;
    expect(runs[0]!.summary).toContain('2 iter');
  });
});

describe('runPick', () => {
  it('picks the top-scoring seed question on first iteration of a fresh session', async () => {
    const init = await runInit(tmpRoot, {
      topic: 'research-test-pick',
      workspace: 'second-brain',
      seedQuestions: ['Cheap question?', 'Foundational question?', 'Niche question?'],
      budget: 5,
      dateOverride: '2099-03-01',
    });
    const pick = await runPick(tmpRoot, { sessionPath: init.session_path });
    expect('skip' in pick).toBe(false);
    if ('sub_question' in pick) {
      // First seed question has highest info_gain (descending heuristic)
      expect(pick.sub_question).toBe('Cheap question?');
      expect(pick.scores.gap_fill_bonus).toBe(0);
    }
  });

  it('returns skip="exhausted" when all seed questions are covered and no unresolved links', async () => {
    const init = await runInit(tmpRoot, {
      topic: 'research-test-exhaust',
      workspace: 'second-brain',
      seedQuestions: ['Q1?', 'Q2?'],
      budget: 5,
      dateOverride: '2099-03-02',
    });
    await runLog(tmpRoot, {
      sessionPath: init.session_path,
      entry: {
        iteration: 1, sub_question: 'Q1?', picked_reason: 'r',
        score: { info_gain: 9, gap_fill_bonus: 0, total: 9 },
        sources_captured: [], notes_written: [], contradictions: [], status: 'kept',
      },
    });
    await runLog(tmpRoot, {
      sessionPath: init.session_path,
      entry: {
        iteration: 2, sub_question: 'Q2?', picked_reason: 'r',
        score: { info_gain: 8.5, gap_fill_bonus: 0, total: 8.5 },
        sources_captured: [], notes_written: [], contradictions: [], status: 'kept',
      },
    });
    const pick = await runPick(tmpRoot, { sessionPath: init.session_path });
    expect('skip' in pick).toBe(true);
    if ('skip' in pick) {
      expect(pick.skip).toBe('exhausted');
    }
  });

  it('surfaces an unresolved-link candidate when a session-created note has dangling links', async () => {
    const init = await runInit(tmpRoot, {
      topic: 'research-test-gap',
      workspace: 'second-brain',
      seedQuestions: ['Already-covered Q?'],
      budget: 5,
      dateOverride: '2099-03-03',
    });
    // Seed a session-created note with an unresolved link (directly in DB)
    const wsRows = await sql<{ id: string }[]>`select id from workspaces where slug = 'second-brain'`;
    const workspaceId = wsRows[0]!.id;
    const noteRow = await sql<{ id: string }[]>`
      insert into items (workspace_id, slug, file_path, type, status, title, content_hash, confidence)
      values (${workspaceId}, '2099-03-03-research-test-gap-note',
              'workspaces/second-brain/notes/2099-03-03-research-test-gap-note.md',
              'note', 'durable', 'Note', 'hgap', 'high')
      returning id
    `;
    await sql`
      insert into links (from_item_id, to_slug, to_item_id)
      values (${noteRow[0]!.id}, '2099-test-dangling-target', null)
    `;
    // Mark the seed question as covered
    await runLog(tmpRoot, {
      sessionPath: init.session_path,
      entry: {
        iteration: 1, sub_question: 'Already-covered Q?', picked_reason: 'r',
        score: { info_gain: 9, gap_fill_bonus: 0, total: 9 },
        sources_captured: [], notes_written: ['2099-03-03-research-test-gap-note'],
        contradictions: [], status: 'kept',
      },
    });

    const pick = await runPick(tmpRoot, { sessionPath: init.session_path });
    expect('sub_question' in pick).toBe(true);
    if ('sub_question' in pick) {
      expect(pick.sub_question).toContain('2099-test-dangling-target');
      expect(pick.scores.gap_fill_bonus).toBeGreaterThan(0);
    }

    // cleanup
    await sql`delete from items where slug = '2099-03-03-research-test-gap-note'`;
  });
});

describe('runFinalize', () => {
  it('flips agent_runs to succeeded, writes summary, bumps landing page to durable', async () => {
    const init = await runInit(tmpRoot, {
      topic: 'research-test-final',
      workspace: 'second-brain',
      seedQuestions: ['Q?'],
      budget: 5,
      dateOverride: '2099-04-01',
    });
    await runLog(tmpRoot, {
      sessionPath: init.session_path,
      entry: {
        iteration: 1, sub_question: 'Q?', picked_reason: 'r',
        score: { info_gain: 9, gap_fill_bonus: 0, total: 9 },
        sources_captured: ['s1'], notes_written: ['n1', 'n2'],
        contradictions: [], status: 'kept',
      },
    });

    const result = await runFinalize(tmpRoot, {
      sessionPath: init.session_path,
      status: 'succeeded',
    });
    expect(result.ok).toBe(true);
    expect(result.summary).toContain('1 iter');
    expect(result.summary).toContain('2 notes');

    const md = readFileSync(join(tmpRoot, init.session_path), 'utf8');
    const { frontmatter } = parseDocument(md);
    expect(frontmatter.status).toBe('durable');

    const runs = await sql<{ status: string; summary: string | null }[]>`
      select status, summary from agent_runs where id = ${init.agent_run_id}
    `;
    expect(runs[0]!.status).toBe('succeeded');
    expect(runs[0]!.summary).toBe(result.summary);
  });

  it('finalize(failed) flips agent_runs to failed and keeps landing page status=draft', async () => {
    const init = await runInit(tmpRoot, {
      topic: 'research-test-final-fail',
      workspace: 'second-brain',
      seedQuestions: ['Q?'],
      budget: 5,
      dateOverride: '2099-04-02',
    });
    const result = await runFinalize(tmpRoot, {
      sessionPath: init.session_path,
      status: 'failed',
      error: 'firecrawl-timeout',
    });
    expect(result.ok).toBe(true);

    const md = readFileSync(join(tmpRoot, init.session_path), 'utf8');
    const { frontmatter } = parseDocument(md);
    expect(frontmatter.status).toBe('draft');

    const runs = await sql<{ status: string; error: string | null }[]>`
      select status, error from agent_runs where id = ${init.agent_run_id}
    `;
    expect(runs[0]!.status).toBe('failed');
    expect(runs[0]!.error).toBe('firecrawl-timeout');
  });
});
