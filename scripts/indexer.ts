import { readFileSync, existsSync, statSync } from 'node:fs';
import { relative, sep } from 'node:path';
import { createHash } from 'node:crypto';
import { sql } from './lib/db.ts';
import { parseDocument } from './lib/frontmatter.ts';
import { extractWikilinks } from './lib/wikilinks.ts';

function hashContent(s: string): string {
  return createHash('sha256').update(s).digest('hex');
}

function workspaceSlugFromPath(absPath: string, repoRoot: string): string | null {
  const rel = relative(repoRoot, absPath).split(sep);
  if (rel[0] !== 'workspaces' || !rel[1]) return null;
  return rel[1];
}

export async function indexOneFile(absPath: string, repoRoot: string): Promise<void> {
  if (!existsSync(absPath)) {
    // File deleted — remove from index
    const relPath = relative(repoRoot, absPath).replaceAll(sep, '/');
    await sql`delete from items where file_path = ${relPath}`;
    return;
  }
  if (!absPath.endsWith('.md')) return;
  if (!statSync(absPath).isFile()) return;

  const wsSlug = workspaceSlugFromPath(absPath, repoRoot);
  if (!wsSlug) return; // not under workspaces/

  const wsRows = await sql<{ id: string }[]>`
    select id from workspaces where slug = ${wsSlug}
  `;
  if (wsRows.length === 0) {
    throw new Error(`Workspace not registered: ${wsSlug}`);
  }
  const workspaceId = wsRows[0]!.id;

  const raw = readFileSync(absPath, 'utf8');
  const { frontmatter: fm, body } = parseDocument(raw);
  const relPath = relative(repoRoot, absPath).replaceAll(sep, '/');
  const contentHash = hashContent(raw);

  // 1. Upsert item
  const itemRows = await sql<{ id: string }[]>`
    insert into items (workspace_id, slug, file_path, type, status, title, frontmatter, content_hash, confidence, updated_at)
    values (
      ${workspaceId}, ${fm.slug}, ${relPath}, ${fm.type}, ${fm.status},
      ${fm.title}, ${sql.json(fm)}, ${contentHash}, ${fm.confidence ?? null}, now()
    )
    on conflict (workspace_id, slug) do update set
      file_path = excluded.file_path,
      type = excluded.type,
      status = excluded.status,
      title = excluded.title,
      frontmatter = excluded.frontmatter,
      content_hash = excluded.content_hash,
      confidence = excluded.confidence,
      updated_at = now()
    returning id
  `;
  const itemId = itemRows[0]!.id;

  // 2. Replace tags
  await sql`delete from item_tags where item_id = ${itemId}`;
  for (const tagSlug of fm.tags) {
    const tagRows = await sql<{ id: string }[]>`
      insert into tags (workspace_id, slug, name)
      values (${workspaceId}, ${tagSlug}, ${tagSlug})
      on conflict (workspace_id, slug) do update set name = excluded.name
      returning id
    `;
    await sql`
      insert into item_tags (item_id, tag_id) values (${itemId}, ${tagRows[0]!.id})
      on conflict do nothing
    `;
  }

  // 3. Replace links (body + frontmatter.links field)
  await sql`delete from links where from_item_id = ${itemId}`;
  const fromBody = extractWikilinks(body);
  const fromMeta = (fm.links ?? []).flatMap((l) => extractWikilinks(l));
  const allLinks = [...fromBody, ...fromMeta];
  const seenSlugs = new Set<string>();
  for (const { slug: toSlug } of allLinks) {
    if (seenSlugs.has(toSlug)) continue;
    seenSlugs.add(toSlug);
    const targetRows = await sql<{ id: string }[]>`
      select id from items where workspace_id = ${workspaceId} and slug = ${toSlug} limit 1
    `;
    const toItemId = targetRows[0]?.id ?? null;
    await sql`
      insert into links (from_item_id, to_slug, to_item_id)
      values (${itemId}, ${toSlug}, ${toItemId})
    `;
  }

  // 4. Resolve any pending links that point to this slug
  await sql`
    update links set to_item_id = ${itemId}
    where to_slug = ${fm.slug} and to_item_id is null
      and from_item_id in (select id from items where workspace_id = ${workspaceId})
  `;
}

// CLI entry point: bun run scripts/indexer.ts <file>
if (import.meta.main) {
  const arg = process.argv[2];
  if (!arg) {
    console.error('Usage: bun run scripts/indexer.ts <file>');
    process.exit(2);
  }
  const repoRoot = process.cwd();
  await indexOneFile(arg, repoRoot);
  await sql.end();
}
