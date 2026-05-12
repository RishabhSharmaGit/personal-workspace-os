import { existsSync, appendFileSync } from 'node:fs';
import { join } from 'node:path';
import { sql } from './db.ts';

const repoRoot = process.cwd();
const statePath = join(repoRoot, 'STATE.md');

// Only append if there were any captures in the last hour.
// (Phase 0 scripts populate `captures` directly; `agent_runs` is wired in Phase 1.)
const recent = await sql<{ count: string }[]>`
  select count(*)::text from captures
  where created_at >= now() - interval '1 hour'
`;
const count = Number(recent[0]!.count);
if (count > 0 && existsSync(statePath)) {
  const today = new Date().toISOString().slice(0, 10);
  const byType = await sql<{ input_type: string; n: string }[]>`
    select input_type, count(*)::text as n from captures
    where created_at >= now() - interval '1 hour'
    group by input_type order by input_type
  `;
  const summary = byType.map((s) => `${s.input_type}×${s.n}`).join(', ');
  appendFileSync(statePath, `\n- ${today}: captures — ${summary}\n`);
}
await sql.end();
