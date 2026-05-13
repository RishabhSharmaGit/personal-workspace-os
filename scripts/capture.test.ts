import { afterAll, beforeEach, describe, expect, it } from 'bun:test';
import { mkdtempSync, rmSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { sql } from './lib/db.ts';
import { captureItem } from './capture.ts';

let tmpRoot: string;
const TEST_SLUG = 'test-capture-indexes';

beforeEach(async () => {
  tmpRoot = mkdtempSync(join(tmpdir(), 'wsos-capture-test-'));
  // Mirror the workspaces folder layout the indexer expects.
  mkdirSync(join(tmpRoot, 'workspaces', 'second-brain', 'notes'), { recursive: true });
  await sql`delete from items where slug = ${TEST_SLUG}`;
  await sql`delete from captures where raw_input = 'Test Capture Indexes'`;
});

afterAll(async () => {
  await sql`delete from items where slug = ${TEST_SLUG}`;
  await sql`delete from captures where raw_input = 'Test Capture Indexes'`;
});

describe('captureItem', () => {
  it('writes the file AND indexes it (items row exists without separate indexer call)', async () => {
    const path = await captureItem(tmpRoot, {
      workspace: 'second-brain',
      slug: TEST_SLUG,
      title: 'Test Capture Indexes',
      type: 'note',
      status: 'durable',
      tags: ['test'],
      links: [],
      confidence: 'high',
      body: 'Test body for capture-indexer round-trip.',
    });

    expect(existsSync(join(tmpRoot, path))).toBe(true);

    const items = await sql<{ slug: string; type: string }[]>`
      select slug, type from items where slug = ${TEST_SLUG}
    `;
    expect(items.length).toBe(1);
    expect(items[0]!.type).toBe('note');

    rmSync(tmpRoot, { recursive: true, force: true });
  });
});
