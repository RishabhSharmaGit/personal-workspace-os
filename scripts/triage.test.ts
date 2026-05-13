import { beforeAll, afterAll, beforeEach, describe, expect, it } from 'bun:test';
import { mkdtempSync, rmSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { sql } from './lib/db.ts';
import { indexOneFile } from './indexer.ts';
import { fileInboxItem } from './triage.ts';

let tmpRoot: string;
let workspaceId: string;

const inboxNote = `---
slug: 2026-05-13-triage-fixture
title: Triage Fixture
type: inbox
status: raw
tags: [test]
links: []
source: null
confidence: low
created: 2026-05-13
updated: 2026-05-13
---

Body that should be triaged into notes/.
`;

beforeAll(async () => {
  tmpRoot = mkdtempSync(join(tmpdir(), 'wsos-triage-test-'));
  const rows = await sql<{ id: string }[]>`select id from workspaces where slug = 'second-brain'`;
  workspaceId = rows[0]!.id;
});

afterAll(async () => {
  rmSync(tmpRoot, { recursive: true, force: true });
});

beforeEach(async () => {
  await sql`
    delete from items
    where workspace_id = ${workspaceId} and slug = '2026-05-13-triage-fixture'
  `;
});

describe('fileInboxItem', () => {
  it('moves file from inbox/ to notes/ and reconciles DB to the new path/type/status', async () => {
    const inboxDir = join(tmpRoot, 'workspaces', 'second-brain', 'inbox');
    const notesDir = join(tmpRoot, 'workspaces', 'second-brain', 'notes');
    mkdirSync(inboxDir, { recursive: true });
    mkdirSync(notesDir, { recursive: true });
    const inboxFile = join(inboxDir, '2026-05-13-triage-fixture.md');
    writeFileSync(inboxFile, inboxNote, 'utf8');
    await indexOneFile(inboxFile, tmpRoot);

    // Pre-condition: DB has the inbox row.
    const pre = await sql<{ type: string; status: string; file_path: string }[]>`
      select type, status, file_path from items where slug = '2026-05-13-triage-fixture'
    `;
    expect(pre[0]!.type).toBe('inbox');
    expect(pre[0]!.status).toBe('raw');
    expect(pre[0]!.file_path).toBe('workspaces/second-brain/inbox/2026-05-13-triage-fixture.md');

    // Act.
    const newPath = await fileInboxItem(tmpRoot, {
      fromPath: 'workspaces/second-brain/inbox/2026-05-13-triage-fixture.md',
      toFolder: 'notes',
      newType: 'note',
      newStatus: 'draft',
    });

    expect(newPath).toBe('workspaces/second-brain/notes/2026-05-13-triage-fixture.md');
    expect(existsSync(join(tmpRoot, newPath))).toBe(true);
    expect(existsSync(inboxFile)).toBe(false);

    // Post-condition: single row, new path/type/status.
    const post = await sql<{ type: string; status: string; file_path: string }[]>`
      select type, status, file_path from items where slug = '2026-05-13-triage-fixture'
    `;
    expect(post.length).toBe(1);
    expect(post[0]!.type).toBe('note');
    expect(post[0]!.status).toBe('draft');
    expect(post[0]!.file_path).toBe('workspaces/second-brain/notes/2026-05-13-triage-fixture.md');
  });
});
