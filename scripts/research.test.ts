import { afterAll, beforeEach, describe, expect, it } from 'bun:test';
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { sql } from './lib/db.ts';
import { parseDocument } from './lib/frontmatter.ts';
import { runInit } from './research.ts';

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
