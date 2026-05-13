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

  it('inserts a sources row when type=source with all provenance fields', async () => {
    const sourcesDir = join(tmpRoot, 'workspaces', 'second-brain', 'sources');
    mkdirSync(sourcesDir, { recursive: true });
    const sourceFile = join(sourcesDir, 'test-source-with-url.md');
    const sourceContent = `---
slug: test-source-with-url
title: Test Source With URL
type: source
status: durable
tags: []
links: []
source: null
confidence: high
created: 2026-05-12
updated: 2026-05-12
source_url: https://example.com/article
source_fetched_at: 2026-05-12T10:00:00Z
source_fetcher: firecrawl-scrape
source_content_hash: abc123def456
source_blob_path: null
---

Article body.
`;
    writeFileSync(sourceFile, sourceContent, 'utf8');
    await indexOneFile(sourceFile, tmpRoot);

    const rows = await sql<
      {
        url: string | null;
        fetch_status: string | null;
        fetcher: string | null;
        content_hash: string | null;
        blob_path: string | null;
      }[]
    >`
      select s.url, s.fetch_status, s.fetcher, s.content_hash, s.blob_path
      from sources s join items i on i.id = s.item_id
      where i.slug = 'test-source-with-url'
    `;
    expect(rows.length).toBe(1);
    expect(rows[0]!.url).toBe('https://example.com/article');
    expect(rows[0]!.fetch_status).toBe('ok');
    expect(rows[0]!.fetcher).toBe('firecrawl-scrape');
    expect(rows[0]!.content_hash).toBe('abc123def456');
    expect(rows[0]!.blob_path).toBeNull();
  });

  it('silently skips workspace skeleton files (CLAUDE/README/STATE.md at workspace root)', async () => {
    const wsRoot = join(tmpRoot, 'workspaces', 'second-brain');
    mkdirSync(wsRoot, { recursive: true });
    for (const name of ['CLAUDE.md', 'README.md', 'STATE.md']) {
      const p = join(wsRoot, name);
      writeFileSync(p, '# Not an item — no frontmatter\n', 'utf8');
      // Should not throw, should not insert anything.
      await indexOneFile(p, tmpRoot);
    }
    const rows = await sql<{ count: string }[]>`
      select count(*) from items i join workspaces w on w.id = i.workspace_id
      where w.slug = 'second-brain' and i.file_path like 'workspaces/second-brain/%.md'
        and i.file_path not like 'workspaces/second-brain/%/%'
    `;
    expect(Number(rows[0]!.count)).toBe(0);
  });

  it('silently skips archive/weekly/*.md (weekly digest files)', async () => {
    const weeklyDir = join(tmpRoot, 'workspaces', 'second-brain', 'archive', 'weekly');
    mkdirSync(weeklyDir, { recursive: true });
    const weeklyFile = join(weeklyDir, '2026-W20.md');
    writeFileSync(weeklyFile, '# Weekly Review 2026-W20\n', 'utf8');
    await indexOneFile(weeklyFile, tmpRoot);
    const rows = await sql<{ count: string }[]>`
      select count(*) from items where file_path = 'workspaces/second-brain/archive/weekly/2026-W20.md'
    `;
    expect(Number(rows[0]!.count)).toBe(0);
  });

  it('upserts (not duplicates) the sources row on re-index', async () => {
    const sourcesDir = join(tmpRoot, 'workspaces', 'second-brain', 'sources');
    mkdirSync(sourcesDir, { recursive: true });
    const sourceFile = join(sourcesDir, 'test-source-with-url.md');
    const sourceContent = `---
slug: test-source-with-url
title: Test Source With URL
type: source
status: durable
tags: []
links: []
source: null
confidence: high
created: 2026-05-12
updated: 2026-05-12
source_url: https://example.com/article
source_fetched_at: 2026-05-12T10:00:00Z
source_fetcher: firecrawl-scrape
source_content_hash: abc123def456
source_blob_path: null
---

Article body.
`;
    writeFileSync(sourceFile, sourceContent, 'utf8');
    await indexOneFile(sourceFile, tmpRoot);
    await indexOneFile(sourceFile, tmpRoot);

    const rows = await sql<{ count: string }[]>`
      select count(*)::text from sources s
      join items i on i.id = s.item_id
      where i.slug = 'test-source-with-url'
    `;
    expect(Number(rows[0]!.count)).toBe(1);
  });
});
