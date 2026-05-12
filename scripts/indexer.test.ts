import { beforeAll, afterAll, beforeEach, describe, expect, it } from 'bun:test';
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { sql } from './lib/db.ts';
import { indexOneFile } from './indexer.ts';

let tmpRoot: string;
let workspaceId: string;

const sampleNote = `---
slug: llm-wiki-pattern
title: LLM Wiki Pattern
type: note
status: durable
tags: [llm, knowledge]
links: []
source: null
confidence: high
created: 2026-05-12
updated: 2026-05-12
---

Body with [[evergreen-notes]] reference.
`;

beforeAll(async () => {
  tmpRoot = mkdtempSync(join(tmpdir(), 'wsos-test-'));
  // Use the existing seeded workspace
  const rows = await sql<{ id: string }[]>`select id from workspaces where slug = 'second-brain'`;
  workspaceId = rows[0]!.id;
});

afterAll(async () => {
  rmSync(tmpRoot, { recursive: true, force: true });
  // Do not call closeDb(): `sql` is a module singleton shared with runs.test.ts.
  // Process exit handles pool cleanup.
});

beforeEach(async () => {
  // Clean items used by this test (cascades to tags/links/sources via FK).
  await sql`
    delete from items
    where workspace_id = ${workspaceId}
      and (slug like 'test-%' or slug = 'llm-wiki-pattern' or slug = 'evergreen-notes')
  `;
});

describe('indexOneFile', () => {
  it('upserts an item row with tags and links', async () => {
    const notesDir = join(tmpRoot, 'workspaces', 'second-brain', 'notes');
    mkdirSync(notesDir, { recursive: true });
    const filePath = join(notesDir, 'llm-wiki-pattern.md');
    writeFileSync(filePath, sampleNote, 'utf8');

    await indexOneFile(filePath, tmpRoot);

    const items = await sql<{ slug: string; title: string; type: string }[]>`
      select slug, title, type from items where slug = 'llm-wiki-pattern'
    `;
    expect(items.length).toBe(1);
    expect(items[0]!.type).toBe('note');

    const tags = await sql<{ slug: string }[]>`
      select t.slug from tags t join item_tags it on it.tag_id = t.id
      join items i on i.id = it.item_id where i.slug = 'llm-wiki-pattern' order by t.slug
    `;
    expect(tags.map((t) => t.slug)).toEqual(['knowledge', 'llm']);

    const links = await sql<{ to_slug: string; to_item_id: string | null }[]>`
      select to_slug, to_item_id from links l join items i on i.id = l.from_item_id
      where i.slug = 'llm-wiki-pattern'
    `;
    expect(links.length).toBe(1);
    expect(links[0]!.to_slug).toBe('evergreen-notes');
    expect(links[0]!.to_item_id).toBeNull();
  });

  it('is idempotent on re-index (UPDATE not duplicate INSERT)', async () => {
    const notesDir = join(tmpRoot, 'workspaces', 'second-brain', 'notes');
    mkdirSync(notesDir, { recursive: true });
    const filePath = join(notesDir, 'llm-wiki-pattern.md');
    writeFileSync(filePath, sampleNote, 'utf8');

    await indexOneFile(filePath, tmpRoot);
    await indexOneFile(filePath, tmpRoot);

    const items = await sql<{ count: string }[]>`
      select count(*) from items where slug = 'llm-wiki-pattern'
    `;
    expect(Number(items[0]!.count)).toBe(1);
  });

  it('resolves to_item_id on second pass when target now exists', async () => {
    const notesDir = join(tmpRoot, 'workspaces', 'second-brain', 'notes');
    mkdirSync(notesDir, { recursive: true });

    const referrer = join(notesDir, 'llm-wiki-pattern.md');
    writeFileSync(referrer, sampleNote, 'utf8');
    await indexOneFile(referrer, tmpRoot);

    const targetContent = sampleNote
      .replace('slug: llm-wiki-pattern', 'slug: evergreen-notes')
      .replace('title: LLM Wiki Pattern', 'title: Evergreen Notes');
    const target = join(notesDir, 'evergreen-notes.md');
    writeFileSync(target, targetContent, 'utf8');
    await indexOneFile(target, tmpRoot);

    const links = await sql<{ to_item_id: string | null }[]>`
      select to_item_id from links l join items i on i.id = l.from_item_id
      where i.slug = 'llm-wiki-pattern' and l.to_slug = 'evergreen-notes'
    `;
    expect(links[0]!.to_item_id).not.toBeNull();
  });
});
