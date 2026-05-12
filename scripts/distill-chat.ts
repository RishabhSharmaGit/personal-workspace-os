import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { sql } from './lib/db.ts';
import { stringifyDocument, FrontmatterSchema } from './lib/frontmatter.ts';
import { withRun } from './lib/runs.ts';
import { datePrefixedSlug, slugify, isValidSlug } from './lib/slug.ts';
import { createHash } from 'node:crypto';

type StoreArgs = {
  workspace: string;
  titleHint: string;
  chatPlatform: 'chatgpt' | 'claude' | 'codex' | 'gemini' | 'other';
  rawChat: string;
};

export async function storeChatAsSource(repoRoot: string, args: StoreArgs): Promise<string> {
  const today = new Date().toISOString().slice(0, 10);
  const base = slugify(args.titleHint).slice(0, 40);
  if (!isValidSlug(base)) throw new Error(`Cannot derive slug from: ${args.titleHint}`);
  const slug = datePrefixedSlug(today, `chat-${args.chatPlatform}-${base}`);
  const relPath = `workspaces/${args.workspace}/sources/${slug}.md`;
  const absPath = join(repoRoot, relPath);

  const hash = createHash('sha256').update(args.rawChat).digest('hex');
  const fm = FrontmatterSchema.parse({
    slug,
    title: `Chat (${args.chatPlatform}): ${args.titleHint}`,
    type: 'source',
    status: 'durable',
    tags: ['chat-export', `platform-${args.chatPlatform}`],
    links: [],
    source: null,
    confidence: 'high',
    created: today,
    updated: today,
    source_fetched_at: new Date().toISOString(),
    source_fetcher: 'chat-export',
    source_content_hash: hash,
    source_blob_path: null,
  });
  mkdirSync(join(repoRoot, `workspaces/${args.workspace}/sources`), { recursive: true });
  writeFileSync(absPath, stringifyDocument(fm, args.rawChat), 'utf8');

  const wsRows = await sql<{ id: string }[]>`select id from workspaces where slug = ${args.workspace}`;
  await sql`
    insert into captures (workspace_id, raw_input, input_type, status, triage_reasoning)
    values (${wsRows[0]!.id}, ${args.titleHint}, 'chat-export', 'filed', 'distill-chat stored raw chat')
  `;
  return relPath;
}

if (import.meta.main) {
  const flag = process.argv[2];
  const payload = process.argv[3];
  if (flag !== '--json' || !payload) {
    console.error("Usage: bun run scripts/distill-chat.ts --json '<json>'");
    process.exit(2);
  }
  const args = JSON.parse(payload) as StoreArgs;
  await withRun('distill-chat', async (ctx) => {
    const path = await storeChatAsSource(process.cwd(), args);
    ctx.recordSummary(`stored chat ${path}`);
    console.log(JSON.stringify({ path }));
  });
  await sql.end();
}
