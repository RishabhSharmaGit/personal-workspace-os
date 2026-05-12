import { writeFileSync, mkdirSync, existsSync, appendFileSync } from 'node:fs';
import { join } from 'node:path';
import { sql } from './lib/db.ts';

function isoWeek(d: Date): string {
  // YYYY-Www
  const target = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNr = (target.getUTCDay() + 6) % 7;
  target.setUTCDate(target.getUTCDate() - dayNr + 3);
  const firstThursday = new Date(Date.UTC(target.getUTCFullYear(), 0, 4));
  const diff = (target.getTime() - firstThursday.getTime()) / 86400000;
  const week = 1 + Math.round((diff - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7);
  return `${target.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

export async function generateWeeklyReview(repoRoot: string): Promise<string> {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const items = await sql<
    { workspace_slug: string; slug: string; title: string; type: string; created_at: Date }[]
  >`
    select w.slug as workspace_slug, i.slug, i.title, i.type, i.created_at
    from items i join workspaces w on w.id = i.workspace_id
    where i.created_at >= ${since.toISOString()}
    order by i.created_at desc
  `;
  const runs = await sql<{ skill_name: string; status: string; count: string }[]>`
    select skill_name, status, count(*)::text as count
    from agent_runs where started_at >= ${since.toISOString()}
    group by skill_name, status
    order by skill_name
  `;
  const pendingByWs = await sql<{ workspace_slug: string; pending: string }[]>`
    select w.slug as workspace_slug, count(*)::text as pending
    from captures c join workspaces w on w.id = c.workspace_id
    where c.status = 'pending' group by w.slug
  `;

  const today = new Date();
  const tag = isoWeek(today);
  const lines: string[] = [];
  lines.push(`# Weekly Review ${tag}`);
  lines.push('');
  lines.push(`Generated: ${today.toISOString().slice(0, 10)}`);
  lines.push('');
  lines.push('## Captures (last 7 days)');
  if (items.length === 0) lines.push('- (none)');
  for (const it of items) {
    lines.push(`- \`${it.workspace_slug}\` [${it.type}] **${it.title}** ← \`${it.slug}\``);
  }
  lines.push('');
  lines.push('## Skill activity');
  if (runs.length === 0) lines.push('- (none)');
  for (const r of runs) lines.push(`- ${r.skill_name} (${r.status}): ${r.count}`);
  lines.push('');
  lines.push('## Pending in inbox');
  if (pendingByWs.length === 0) lines.push('- (none — inbox clean)');
  for (const p of pendingByWs) lines.push(`- \`${p.workspace_slug}\`: ${p.pending} pending`);
  lines.push('');

  const outDir = join(repoRoot, 'workspaces', 'second-brain', 'archive', 'weekly');
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, `${tag}.md`);
  writeFileSync(outPath, lines.join('\n'), 'utf8');

  // Append to top-level STATE.md
  const statePath = join(repoRoot, 'STATE.md');
  if (existsSync(statePath)) {
    appendFileSync(
      statePath,
      `\n- ${today.toISOString().slice(0, 10)}: weekly review ${tag} generated.\n`,
    );
  }

  return outPath;
}

if (import.meta.main) {
  const out = await generateWeeklyReview(process.cwd());
  console.log(JSON.stringify({ path: out }));
  await sql.end();
}
