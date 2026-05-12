import { readdirSync, statSync } from 'node:fs';
import { join, sep } from 'node:path';
import { sql } from './lib/db.ts';
import { indexOneFile } from './indexer.ts';

function walkMarkdown(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      walkMarkdown(full, out);
    } else if (entry.endsWith('.md')) {
      out.push(full);
    }
  }
  return out;
}

export async function rebuildIndex(repoRoot: string): Promise<{ processed: number }> {
  const wsDir = join(repoRoot, 'workspaces');
  await sql.begin(async (tx) => {
    await tx`delete from item_tags`;
    await tx`delete from links`;
    await tx`delete from sources`;
    await tx`delete from items`;
    await tx`delete from tags`;
  });
  const files = walkMarkdown(wsDir);
  let count = 0;
  for (const f of files) {
    try {
      await indexOneFile(f, repoRoot);
      count++;
    } catch (err) {
      console.error(`[index-rebuild] skipping ${f}:`, err instanceof Error ? err.message : err);
    }
  }
  return { processed: count };
}

if (import.meta.main) {
  const result = await rebuildIndex(process.cwd());
  console.log(JSON.stringify(result));
  await sql.end();
}
