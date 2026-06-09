import { readFileSync, existsSync, statSync } from 'node:fs';
import { relative, resolve, isAbsolute, sep } from 'node:path';
import { createHash } from 'node:crypto';
import { sql, isDbUnreachable } from './lib/db.ts';
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

// Workspace skeleton files live at workspaces/<ws>/ and are not items.
// CONTEXT.md is the per-workspace shared-language glossary (Pocock-style) — meta, not a note.
const SKELETON_FILES = new Set(['CLAUDE.md', 'README.md', 'STATE.md', 'CONTEXT.md']);

export function isIndexableMd(absPath: string, repoRoot: string): boolean {
  const rel = relative(repoRoot, absPath).split(sep);
  if (rel[0] !== 'workspaces' || rel.length < 3) return false;
  // Skeleton files at workspace root (depth 3 = ['workspaces', '<ws>', '<file>']).
  if (rel.length === 3 && SKELETON_FILES.has(rel[2]!)) return false;
  // Weekly digest files under archive/weekly/.
  if (rel.includes('archive') && rel.includes('weekly')) return false;
  return true;
}

export async function indexOneFile(absPath: string, repoRoot: string): Promise<void> {
  // Cheap filters first — exit before any DB activity for unrelated paths.
  if (!absPath.endsWith('.md')) return;
  const wsSlug = workspaceSlugFromPath(absPath, repoRoot);
  if (!wsSlug) return; // not under workspaces/
  if (!isIndexableMd(absPath, repoRoot)) return; // skeleton/digest files

  if (!existsSync(absPath)) {
    // File deleted — remove from index
    const relPath = relative(repoRoot, absPath).replaceAll(sep, '/');
    await sql`delete from items where file_path = ${relPath}`;
    return;
  }
  if (!statSync(absPath).isFile()) return;

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

  // 1b. Upsert sources row for type='source' items, otherwise clear any stale row
  //     (handles type-change from 'source' to 'note', etc.)
  if (fm.type === 'source') {
    await sql`
      insert into sources (item_id, url, fetch_date, fetch_status, fetcher, content_hash, blob_path)
      values (
        ${itemId},
        ${fm.source_url ?? null},
        ${fm.source_fetched_at ?? null},
        'ok',
        ${fm.source_fetcher ?? null},
        ${fm.source_content_hash ?? null},
        ${fm.source_blob_path ?? null}
      )
      on conflict (item_id) do update set
        url = excluded.url,
        fetch_date = excluded.fetch_date,
        fetcher = excluded.fetcher,
        content_hash = excluded.content_hash,
        blob_path = excluded.blob_path
    `;
  } else {
    await sql`delete from sources where item_id = ${itemId}`;
  }

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

type HookEvent = {
  tool_name?: string;
  tool_input?: { file_path?: string };
  tool_response?: { filePath?: string };
};

async function readHookEventFromStdin(): Promise<HookEvent | null> {
  if (process.stdin.isTTY) return null;
  const text = await Bun.stdin.text();
  if (!text.trim()) return null;
  try {
    return JSON.parse(text) as HookEvent;
  } catch {
    return null;
  }
}

// CLI entry point:
//   Hook mode: <hook-event-json> | bun run scripts/indexer.ts
//   Manual:    bun run scripts/indexer.ts <file-or-relative-path>
if (import.meta.main) {
  const repoRoot = process.cwd();
  const arg = process.argv[2];
  let target: string | undefined = arg;
  if (!target) {
    const event = await readHookEventFromStdin();
    target = event?.tool_input?.file_path ?? event?.tool_response?.filePath;
  }
  if (!target) {
    console.error('Usage: bun run scripts/indexer.ts <file>');
    console.error('   or: <hook-event-json> | bun run scripts/indexer.ts');
    process.exit(2);
  }
  const absPath = isAbsolute(target) ? target : resolve(repoRoot, target);
  try {
    await indexOneFile(absPath, repoRoot);
    await sql.end();
  } catch (e) {
    if (isDbUnreachable(e)) {
      process.exit(0);
    }
    throw e;
  }
}
