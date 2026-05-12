import { sql } from './lib/db.ts';

type FindArgs = {
  workspace?: string;
  tags?: string[];
  type?: 'note' | 'source' | 'decision' | 'inbox' | 'capture';
  text?: string;
  limit?: number;
};

export async function findItems(args: FindArgs) {
  const limit = args.limit ?? 10;
  const wsClause = args.workspace
    ? sql`and w.slug = ${args.workspace}`
    : sql``;
  const typeClause = args.type ? sql`and i.type = ${args.type}` : sql``;
  const textClause = args.text
    ? sql`and (i.title ilike ${'%' + args.text + '%'} or (i.frontmatter ->> 'tags') ilike ${'%' + args.text + '%'})`
    : sql``;
  const tagsClause = args.tags && args.tags.length > 0
    ? sql`and i.id in (
        select it.item_id from item_tags it
        join tags t on t.id = it.tag_id
        where t.slug = any(${args.tags})
      )`
    : sql``;

  const rows = await sql<
    {
      slug: string;
      title: string;
      type: string;
      file_path: string;
      workspace_slug: string;
      confidence: string | null;
    }[]
  >`
    select i.slug, i.title, i.type, i.file_path, w.slug as workspace_slug, i.confidence
    from items i
    join workspaces w on w.id = i.workspace_id
    where 1=1 ${wsClause} ${typeClause} ${textClause} ${tagsClause}
    order by i.updated_at desc
    limit ${limit}
  `;
  return rows;
}

if (import.meta.main) {
  const flag = process.argv[2];
  const payload = process.argv[3];
  if (flag !== '--json' || !payload) {
    console.error("Usage: bun run scripts/query.ts --json '<json-args>'");
    process.exit(2);
  }
  const args = JSON.parse(payload) as FindArgs;
  const rows = await findItems(args);
  console.log(JSON.stringify(rows, null, 2));
  await sql.end();
}
