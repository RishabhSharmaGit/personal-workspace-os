import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { sql } from './db.ts';

const repoRoot = process.cwd();
const statePath = join(repoRoot, 'STATE.md');

if (existsSync(statePath)) {
  const head = readFileSync(statePath, 'utf8').split('\n').slice(0, 20).join('\n');
  console.log('--- STATE.md (head) ---');
  console.log(head);
  console.log('-----------------------');
}

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
