import { renameSync, readFileSync, writeFileSync } from 'node:fs';
import { join, basename } from 'node:path';
import { sql } from './lib/db.ts';
import { parseDocument, stringifyDocument } from './lib/frontmatter.ts';
import { withRun } from './lib/runs.ts';

export async function listPendingCaptures() {
  return await sql<
    { id: string; raw_input: string; input_type: string; created_at: Date }[]
  >`
    select id, raw_input, input_type, created_at
    from captures where status = 'pending'
    order by created_at asc
  `;
}

export async function listInboxFiles(repoRoot: string, workspaceSlug: string) {
  const rows = await sql<{ slug: string; title: string; file_path: string }[]>`
    select i.slug, i.title, i.file_path
    from items i join workspaces w on w.id = i.workspace_id
    where w.slug = ${workspaceSlug} and i.type = 'inbox'
    order by i.created_at asc
  `;
  return rows.map((r) => ({ ...r, abs: join(repoRoot, r.file_path) }));
}

type FileArgs = {
  fromPath: string;
  toFolder: 'notes' | 'sources' | 'decisions' | 'archive';
  newType: 'note' | 'source' | 'decision' | 'archived';
  newStatus: 'draft' | 'durable' | 'archived';
};

export async function fileInboxItem(repoRoot: string, args: FileArgs): Promise<string> {
  const absFrom = join(repoRoot, args.fromPath);
  const raw = readFileSync(absFrom, 'utf8');
  const { frontmatter: fm, body } = parseDocument(raw);

  // Update frontmatter
  const today = new Date().toISOString().slice(0, 10);
  const updatedFm = {
    ...fm,
    type: args.newType === 'archived' ? fm.type : args.newType,
    status: args.newStatus,
    updated: today,
  };
  const newContent = stringifyDocument(updatedFm as typeof fm, body);
  writeFileSync(absFrom, newContent, 'utf8');

  // Move file to target folder
  const filename = basename(args.fromPath);
  const dirParts = args.fromPath.split('/');
  dirParts[dirParts.length - 2] = args.toFolder; // replace 'inbox' with target
  const newRelPath = dirParts.join('/');
  const absTo = join(repoRoot, newRelPath);
  renameSync(absFrom, absTo);

  return newRelPath;
}

if (import.meta.main) {
  const cmd = process.argv[2];
  if (cmd === 'list-pending') {
    console.log(JSON.stringify(await listPendingCaptures(), null, 2));
  } else if (cmd === 'list-inbox') {
    const ws = process.argv[3] ?? 'second-brain';
    console.log(JSON.stringify(await listInboxFiles(process.cwd(), ws), null, 2));
  } else if (cmd === 'file') {
    const payload = process.argv[3];
    if (!payload) {
      console.error("Usage: bun run scripts/triage.ts file '<json>'");
      process.exit(2);
    }
    await withRun('triage-inbox', async (ctx) => {
      const newPath = await fileInboxItem(process.cwd(), JSON.parse(payload));
      ctx.recordSummary(`filed to ${newPath}`);
      console.log(JSON.stringify({ newPath }));
    });
  } else {
    console.error('Usage: triage.ts (list-pending | list-inbox <ws> | file <json>)');
    process.exit(2);
  }
  await sql.end();
}
