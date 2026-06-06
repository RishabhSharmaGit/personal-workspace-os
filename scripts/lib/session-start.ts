import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { sql, isDbUnreachable } from './db.ts';

// Derive repo root from this file's location (scripts/lib/ → ../..), so the
// hook is cwd-independent (Stop/SessionStart hooks may fire from another cwd).
const repoRoot = join(import.meta.dir, '..', '..');
const statePath = join(repoRoot, 'STATE.md');

if (existsSync(statePath)) {
  const head = readFileSync(statePath, 'utf8').split('\n').slice(0, 20).join('\n');
  console.log('--- STATE.md (head) ---');
  console.log(head);
  console.log('-----------------------');
}

try {
  const rows = await sql<{ slug: string; pending: string }[]>`
    select w.slug, count(c.id)::text as pending
    from workspaces w
    left join captures c on c.workspace_id = w.id and c.status = 'pending'
    group by w.slug
    order by w.slug
  `;
  const pendingTotal = rows.reduce((a, r) => a + Number(r.pending), 0);
  if (pendingTotal > 0) {
    console.log('Pending captures:');
    for (const r of rows) {
      if (Number(r.pending) > 0) console.log(`  - ${r.slug}: ${r.pending}`);
    }
  } else {
    console.log('Inbox clean (0 pending captures).');
  }
  await sql.end();
} catch (e) {
  if (isDbUnreachable(e)) {
    console.log('(local Postgres not running — skipping pending-captures check)');
    process.exit(0);
  }
  throw e;
}
