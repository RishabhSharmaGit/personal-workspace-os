import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { sql } from './lib/db.ts';
import { FrontmatterSchema, stringifyDocument } from './lib/frontmatter.ts';
import { withRun } from './lib/runs.ts';
import { isValidSlug, datePrefixedSlug } from './lib/slug.ts';
import { indexOneFile } from './indexer.ts';

type CaptureArgs = {
  workspace: string;
  slug: string;
  title: string;
  type: 'note' | 'source' | 'decision' | 'inbox' | 'capture';
  status: 'raw' | 'draft' | 'durable' | 'archived';
  tags: string[];
  links: string[];
  confidence: 'low' | 'medium' | 'high';
  body: string;
  source?: {
    url?: string;
    fetcher?: 'firecrawl-scrape' | 'firecrawl-instruct' | 'manual' | 'pdf' | 'chat-export';
    fetchedAt?: string;
    contentHash?: string;
    blobPath?: string | null;
  };
};

function folderForType(type: CaptureArgs['type']): string {
  if (type === 'note') return 'notes';
  if (type === 'source') return 'sources';
  if (type === 'decision') return 'decisions';
  return 'inbox';
}

export async function captureItem(repoRoot: string, args: CaptureArgs): Promise<string> {
  if (!isValidSlug(args.slug)) {
    throw new Error(`Invalid slug: ${args.slug}`);
  }
  const today = new Date().toISOString().slice(0, 10);
  const folder = folderForType(args.type);
  const filename =
    args.type === 'note' ? `${args.slug}.md` : `${datePrefixedSlug(today, args.slug)}.md`;
  const relPath = join('workspaces', args.workspace, folder, filename).replaceAll('\\', '/');
  const absPath = join(repoRoot, relPath);
  if (existsSync(absPath)) {
    throw new Error(`File already exists: ${relPath}`);
  }
  mkdirSync(dirname(absPath), { recursive: true });

  const fm = FrontmatterSchema.parse({
    slug: args.type === 'note' ? args.slug : datePrefixedSlug(today, args.slug),
    title: args.title,
    type: args.type,
    status: args.status,
    tags: args.tags,
    links: args.links,
    source: null,
    confidence: args.confidence,
    created: today,
    updated: today,
    ...(args.source && {
      source_url: args.source.url,
      source_fetched_at: args.source.fetchedAt,
      source_fetcher: args.source.fetcher,
      source_content_hash: args.source.contentHash,
      source_blob_path: args.source.blobPath ?? null,
    }),
  });

  const content = stringifyDocument(fm, args.body);
  writeFileSync(absPath, content, 'utf8');

  // Index the new file so links/items are queryable before the next capture.
  // PostToolUse hook only fires on Claude's Write|Edit tools, not Bash invocations.
  await indexOneFile(absPath, repoRoot);

  // Insert a captures row (status='filed' since we placed it)
  const wsRows = await sql<{ id: string }[]>`
    select id from workspaces where slug = ${args.workspace}
  `;
  await sql`
    insert into captures (workspace_id, raw_input, input_type, status, triage_reasoning)
    values (${wsRows[0]!.id}, ${args.title}, 'text', 'filed', 'direct-place via capture')
  `;
  return relPath;
}

if (import.meta.main) {
  // CLI: bun run scripts/capture.ts --json '<json args>'
  const flag = process.argv[2];
  const payload = process.argv[3];
  if (flag !== '--json' || !payload) {
    console.error("Usage: bun run scripts/capture.ts --json '<json-args>'");
    process.exit(2);
  }
  const args = JSON.parse(payload) as CaptureArgs;
  await withRun('capture', async (ctx) => {
    const path = await captureItem(process.cwd(), args);
    ctx.recordSummary(`captured ${path}`);
    console.log(JSON.stringify({ path }));
  });
  await sql.end();
}
