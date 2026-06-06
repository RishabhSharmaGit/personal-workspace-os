import { existsSync, appendFileSync } from 'node:fs';
import { join } from 'node:path';
import { sql, isDbUnreachable } from './db.ts';

// Derive repo root from this file's location (scripts/lib/ → ../..), so the
// hook is cwd-independent (Stop hooks may fire from another cwd).
const repoRoot = join(import.meta.dir, '..', '..');
const statePath = join(repoRoot, 'STATE.md');

try {
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
} catch (e) {
  if (isDbUnreachable(e)) {
    process.exit(0);
  }
  throw e;
}
