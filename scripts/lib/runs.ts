import { sql } from './db.ts';

export type RunContext = {
  runId: string;
  recordSummary: (summary: string) => void;
  recordItemId: (itemId: string) => void;
};

export async function startRun(skillName: string): Promise<string> {
  const rows = await sql<{ id: string }[]>`
    insert into agent_runs (skill_name, status)
    values (${skillName}, 'started')
    returning id
  `;
  return rows[0]!.id;
}

export async function updateRunSummary(runId: string, summary: string): Promise<void> {
  await sql`
    update agent_runs
    set summary = ${summary}
    where id = ${runId}
  `;
}

export async function finalizeRun(
  runId: string,
  status: 'succeeded' | 'failed',
  summary: string | null,
  error: string | null,
  itemId: string | null = null,
): Promise<void> {
  await sql`
    update agent_runs
    set status = ${status}, ended_at = now(),
        summary = ${summary}, error = ${error}, item_id = ${itemId}
    where id = ${runId}
  `;
}

export async function withRun<T>(
  skillName: string,
  fn: (ctx: RunContext) => Promise<T>,
): Promise<T> {
  const runId = await startRun(skillName);
  let summary: string | null = null;
  let itemId: string | null = null;
  const ctx: RunContext = {
    runId,
    recordSummary: (s) => {
      summary = s;
    },
    recordItemId: (id) => {
      itemId = id;
    },
  };
  try {
    const result = await fn(ctx);
    await finalizeRun(runId, 'succeeded', summary, null, itemId);
    return result;
  } catch (e) {
    const err = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
    await finalizeRun(runId, 'failed', summary, err, itemId);
    throw e;
  }
}
