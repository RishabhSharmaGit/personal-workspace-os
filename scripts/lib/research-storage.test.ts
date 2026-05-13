import { afterAll, beforeEach, describe, expect, it } from 'bun:test';
import { sql } from './db.ts';
import {
  findAnchorCandidates,
  isAlreadyCovered,
  getUnresolvedLinkSlugs,
} from './research-storage.ts';

let workspaceId: string;

beforeEach(async () => {
  const rows = await sql<{ id: string }[]>`select id from workspaces where slug = 'second-brain'`;
  workspaceId = rows[0]!.id;
  await sql`delete from items where slug like 'rstorage-test-%'`;
});

afterAll(async () => {
  await sql`delete from items where slug like 'rstorage-test-%'`;
});

async function seedItem(opts: {
  slug: string;
  title: string;
  confidence?: 'low' | 'medium' | 'high';
  links?: string[];
}): Promise<string> {
  const { slug, title, confidence = 'high', links = [] } = opts;
  const rows = await sql<{ id: string }[]>`
    insert into items (workspace_id, slug, file_path, type, status, title, content_hash, confidence)
    values (
      ${workspaceId}, ${slug}, ${'workspaces/second-brain/notes/' + slug + '.md'},
      'note', 'durable', ${title}, ${'h-' + slug}, ${confidence}
    )
    returning id
  `;
  const itemId = rows[0]!.id;
  for (const toSlug of links) {
    await sql`
      insert into links (from_item_id, to_slug, to_item_id) values (${itemId}, ${toSlug}, null)
    `;
  }
  return itemId;
}

describe('findAnchorCandidates', () => {
  it('returns matching item slugs by keyword in title', async () => {
    await seedItem({ slug: 'rstorage-test-bloom-filter', title: 'Bloom Filter Basics' });
    const anchors = await findAnchorCandidates(workspaceId, ['bloom', 'filter']);
    expect(anchors).toContain('rstorage-test-bloom-filter');
  });

  it('returns empty list when no items match', async () => {
    const anchors = await findAnchorCandidates(workspaceId, ['nonexistent-xyz123']);
    expect(anchors).toEqual([]);
  });
});

describe('isAlreadyCovered', () => {
  it('returns false when fewer than threshold high-confidence hits exist', async () => {
    await seedItem({ slug: 'rstorage-test-1', title: 'Bloom Filter' });
    expect(await isAlreadyCovered(workspaceId, ['bloom', 'filter'])).toBe(false);
  });

  it('returns true with 3+ high-confidence hits on all keywords', async () => {
    await seedItem({ slug: 'rstorage-test-2', title: 'Bloom Filter Basics' });
    await seedItem({ slug: 'rstorage-test-3', title: 'Bloom Filter FPR Math' });
    await seedItem({ slug: 'rstorage-test-4', title: 'Bloom Filter in Redis' });
    expect(await isAlreadyCovered(workspaceId, ['bloom', 'filter'])).toBe(true);
  });

  it('does not count low-confidence items toward coverage', async () => {
    await seedItem({ slug: 'rstorage-test-5', title: 'Bloom Filter A', confidence: 'low' });
    await seedItem({ slug: 'rstorage-test-6', title: 'Bloom Filter B', confidence: 'low' });
    await seedItem({ slug: 'rstorage-test-7', title: 'Bloom Filter C', confidence: 'low' });
    expect(await isAlreadyCovered(workspaceId, ['bloom', 'filter'])).toBe(false);
  });
});

describe('getUnresolvedLinkSlugs', () => {
  it('returns distinct unresolved to_slug values for given from-slugs', async () => {
    await seedItem({
      slug: 'rstorage-test-note-a',
      title: 'A',
      links: ['unresolved-x', 'unresolved-y', 'unresolved-x'],
    });
    await seedItem({
      slug: 'rstorage-test-note-b',
      title: 'B',
      links: ['unresolved-z'],
    });
    const unresolved = await getUnresolvedLinkSlugs(workspaceId, [
      'rstorage-test-note-a',
      'rstorage-test-note-b',
    ]);
    expect(unresolved.sort()).toEqual(['unresolved-x', 'unresolved-y', 'unresolved-z']);
  });

  it('returns empty list when from-slugs are empty', async () => {
    expect(await getUnresolvedLinkSlugs(workspaceId, [])).toEqual([]);
  });

  it('excludes resolved links (to_item_id is not null)', async () => {
    const resolvedTarget = await seedItem({ slug: 'rstorage-test-target', title: 'T' });
    const fromId = await seedItem({ slug: 'rstorage-test-note-c', title: 'C' });
    await sql`
      insert into links (from_item_id, to_slug, to_item_id)
      values (${fromId}, 'rstorage-test-target', ${resolvedTarget})
    `;
    await sql`
      insert into links (from_item_id, to_slug, to_item_id)
      values (${fromId}, 'still-unresolved', null)
    `;
    const unresolved = await getUnresolvedLinkSlugs(workspaceId, ['rstorage-test-note-c']);
    expect(unresolved).toEqual(['still-unresolved']);
  });
});
