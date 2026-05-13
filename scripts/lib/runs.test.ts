import { afterAll, beforeEach, describe, expect, it } from 'bun:test';
import { sql } from './db.ts';
import { withRun, startRun, updateRunSummary, finalizeRun } from './runs.ts';

// Note: do NOT call closeDb() in afterAll — `sql` is a module singleton shared
// with indexer.test.ts. Closing it here would kill the pool the other suite needs.

beforeEach(async () => {
  await sql`delete from agent_runs where skill_name like 'test-%'`;
});

afterAll(async () => {
  await sql`delete from agent_runs where skill_name like 'test-%'`;
});

describe('withRun', () => {
  it('inserts a started row, then finalizes as succeeded with summary', async () => {
    const result = await withRun('test-success', async (ctx) => {
      ctx.recordSummary('did the thing');
      return 42;
    });
    expect(result).toBe(42);

    const rows = await sql<{ status: string; summary: string | null; error: string | null }[]>`
      select status, summary, error from agent_runs where skill_name = 'test-success'
    `;
    expect(rows.length).toBe(1);
    expect(rows[0]!.status).toBe('succeeded');
    expect(rows[0]!.summary).toBe('did the thing');
    expect(rows[0]!.error).toBeNull();
  });

  it('finalizes as failed with the error message when the closure throws', async () => {
    let thrown: unknown;
    try {
      await withRun('test-failure', async () => {
        throw new Error('boom');
      });
    } catch (e) {
      thrown = e;
    }
    expect(thrown).toBeInstanceOf(Error);
    expect((thrown as Error).message).toBe('boom');

    const rows = await sql<{ status: string; error: string | null; ended_at: Date | null }[]>`
      select status, error, ended_at from agent_runs where skill_name = 'test-failure'
    `;
    expect(rows.length).toBe(1);
    expect(rows[0]!.status).toBe('failed');
    expect(rows[0]!.error).toContain('boom');
    expect(rows[0]!.ended_at).not.toBeNull();
  });

  it('records the item_id when recordItemId is called', async () => {
    // Use the seeded second-brain workspace's id stand-in: any uuid that exists in items.
    // Insert a dummy item just for this test, link the run, then clean up.
    const wsRows = await sql<{ id: string }[]>`select id from workspaces where slug = 'second-brain'`;
    const workspaceId = wsRows[0]!.id;
    const itemRows = await sql<{ id: string }[]>`
      insert into items (workspace_id, slug, file_path, type, status, title, content_hash)
      values (${workspaceId}, 'test-runs-link-item', 'workspaces/second-brain/notes/test-runs-link-item.md',
              'note', 'draft', 'Test Runs Link', 'deadbeef')
      returning id
    `;
    const itemId = itemRows[0]!.id;

    await withRun('test-link', async (ctx) => {
      ctx.recordItemId(itemId);
    });

    const linkRows = await sql<{ item_id: string | null }[]>`
      select item_id from agent_runs where skill_name = 'test-link'
    `;
    expect(linkRows[0]!.item_id).toBe(itemId);

    await sql`delete from items where slug = 'test-runs-link-item'`;
  });

  it('inserts the row with status=started before the closure runs', async () => {
    let observedStatus: string | null = null;
    await withRun('test-started-status', async (ctx) => {
      const rows = await sql<{ status: string }[]>`
        select status from agent_runs where id = ${ctx.runId}
      `;
      observedStatus = rows[0]?.status ?? null;
    });
    expect(observedStatus).toBe('started');
  });
});

describe('multi-call run lifecycle', () => {
  it('startRun → updateRunSummary → finalizeRun(succeeded) round-trip', async () => {
    const runId = await startRun('test-multi-call');
    await updateRunSummary(runId, 'partial: 2 iters');
    await finalizeRun(runId, 'succeeded', 'final: 5 iters, 5 notes', null);

    const rows = await sql<{ status: string; summary: string | null; error: string | null; ended_at: Date | null }[]>`
      select status, summary, error, ended_at from agent_runs where id = ${runId}
    `;
    expect(rows[0]!.status).toBe('succeeded');
    expect(rows[0]!.summary).toBe('final: 5 iters, 5 notes');
    expect(rows[0]!.error).toBeNull();
    expect(rows[0]!.ended_at).not.toBeNull();
  });

  it('finalizeRun(failed) writes the error message', async () => {
    const runId = await startRun('test-multi-call-fail');
    await finalizeRun(runId, 'failed', 'iter 2 errored', 'firecrawl-timeout');

    const rows = await sql<{ status: string; error: string | null }[]>`
      select status, error from agent_runs where id = ${runId}
    `;
    expect(rows[0]!.status).toBe('failed');
    expect(rows[0]!.error).toBe('firecrawl-timeout');
  });
});
