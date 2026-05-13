import { sql } from './db.ts';

// Find existing items whose title mentions any of the given keywords (OR match).
// Returns slugs; used by init to seed anchor candidates for the landing page.
export async function findAnchorCandidates(
  workspaceId: string,
  keywords: string[],
): Promise<string[]> {
  if (keywords.length === 0) return [];
  const orFrags = keywords.map((k) => sql`title ilike ${'%' + k + '%'}`);
  const orClause = orFrags.reduce((a, b) => sql`${a} or ${b}`);
  const rows = await sql<{ slug: string }[]>`
    select distinct slug from items
    where workspace_id = ${workspaceId}
      and (${orClause})
    order by slug
    limit 20
  `;
  return rows.map((r) => r.slug);
}

// Returns true when >= 3 high-confidence items contain ALL keywords in title (AND match).
export async function isAlreadyCovered(
  workspaceId: string,
  keywords: string[],
): Promise<boolean> {
  if (keywords.length === 0) return false;
  const conditions = keywords.map((k) => sql`title ilike ${'%' + k + '%'}`);
  const andClause = conditions.reduce((a, b) => sql`${a} and ${b}`);
  const rows = await sql<{ c: number }[]>`
    select count(*)::int as c from items
    where workspace_id = ${workspaceId}
      and confidence = 'high'
      and (${andClause})
  `;
  return (rows[0]?.c ?? 0) >= 3;
}

// Given a list of from-slugs (notes created during this session), return distinct
// unresolved to_slug values they reference.
export async function getUnresolvedLinkSlugs(
  workspaceId: string,
  fromSlugs: string[],
): Promise<string[]> {
  if (fromSlugs.length === 0) return [];
  const rows = await sql<{ to_slug: string }[]>`
    select distinct l.to_slug
    from links l
    join items i on i.id = l.from_item_id
    where i.workspace_id = ${workspaceId}
      and i.slug in ${sql(fromSlugs)}
      and l.to_item_id is null
    order by l.to_slug
  `;
  return rows.map((r) => r.to_slug);
}
