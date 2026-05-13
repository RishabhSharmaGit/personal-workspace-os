# Research Skill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a new `research` skill for the Workspace OS that adapts Karpathy's autoresearch ideology to topic research — an adaptive 5-iteration loop that durably enriches the second-brain wiki with atomic notes, cited sources, and resolved `[[wikilinks]]`.

**Architecture:** Thin TypeScript controller (`scripts/research.ts`) with four subcommands (`init`, `pick`, `log`, `finalize`) handles deterministic state. SKILL.md instructions drive the high-level loop: pick → search → capture → log. Markdown landing page at `workspaces/<ws>/research/YYYY-MM-DD-<slug>.md` is the source of truth; Postgres `items`+`links`+`agent_runs` are derived/indexed.

**Tech Stack:** Bun 1.x runtime, TypeScript, `postgres` (postgres.js), `gray-matter`, `zod`, `biome`, `bun:test`. Local Supabase Postgres at `127.0.0.1:54322`.

**Spec reference:** `docs/superpowers/specs/2026-05-13-research-skill-design.md`

---

## File Structure

**New files:**

| Path | Responsibility |
|---|---|
| `db/supabase/migrations/20260513000000_add_research_type.sql` | Add `'research'` to items.type CHECK |
| `scripts/lib/research-parse.ts` | Pure Markdown parsing/formatting of landing pages |
| `scripts/lib/research-parse.test.ts` | Unit tests for parse |
| `scripts/lib/research-scoring.ts` | Pure scoring functions (build candidates, compute score) |
| `scripts/lib/research-scoring.test.ts` | Unit tests for scoring |
| `scripts/lib/research-storage.ts` | DB-touching helpers used by `pick` |
| `scripts/lib/research-storage.test.ts` | Integration tests for storage helpers |
| `scripts/lib/research-junk-domains.txt` | User-editable denylist (one domain per line) |
| `scripts/research.ts` | CLI entry + four runner functions (`runInit`/`runPick`/`runLog`/`runFinalize`) |
| `scripts/research.integration.test.ts` | Full-loop integration test (no firecrawl/LLM) |
| `tests/fixtures/research/empty-session.md` | Fixture: landing page with empty log |
| `tests/fixtures/research/two-iter-session.md` | Fixture: landing page with 2 completed iterations |
| `.claude/skills/research/SKILL.md` | Skill manifest + loop instructions |
| `workspaces/second-brain/research/.gitkeep` | Create the new lifecycle folder |

**Modified files:**

| Path | Change |
|---|---|
| `scripts/lib/frontmatter.ts` | Add `'research'` to type enum; add optional `agent_run_id` + `budget` fields |
| `scripts/lib/runs.ts` | Export `startRun`, `updateRunSummary`, `finalizeRun` |
| `scripts/lib/runs.test.ts` | Add tests for the three new exports |
| `scripts/capture.ts` | Call `indexOneFile()` after writing |
| `scripts/capture.test.ts` (new if absent — verify before this task starts) | Test: capture inserts items row without a separate indexer call |
| `workspaces/second-brain/README.md` | Document new `research/` folder |
| `workspaces/second-brain/CLAUDE.md` | Mention the research skill |

**Total:** 14 new files, 7 modified files. 14 tasks.

---

## Task 1: DB migration + Zod schema for `'research'` type

**Files:**
- Create: `db/supabase/migrations/20260513000000_add_research_type.sql`
- Modify: `scripts/lib/frontmatter.ts:10` (type enum) and add optional `agent_run_id` / `budget` fields
- Test: `scripts/lib/frontmatter.test.ts` (create if absent)

- [ ] **Step 1: Write the migration**

Create `db/supabase/migrations/20260513000000_add_research_type.sql`:

```sql
-- Add 'research' type for research-session landing pages.
-- Spec: docs/superpowers/specs/2026-05-13-research-skill-design.md §4.1
alter table items drop constraint items_type_check;
alter table items add constraint items_type_check
  check (type in ('note','source','decision','inbox','capture','research'));
```

- [ ] **Step 2: Apply the migration**

Run: `bun run db:migrate`
Expected output: includes line `Applying migration 20260513000000_add_research_type.sql...` and exits 0.

Verify with:
```bash
bun -e "import {sql} from './scripts/lib/db.ts'; const r = await sql\`select conname, pg_get_constraintdef(oid) from pg_constraint where conname = 'items_type_check'\`; console.log(r); await sql.end();"
```
Expected: the constraint definition includes `'research'`.

- [ ] **Step 3: Update Zod schema**

Edit `scripts/lib/frontmatter.ts`. Replace line 10 and the schema block:

```ts
export const FrontmatterSchema = z.object({
  slug: slugSchema,
  title: z.string().min(1),
  type: z.enum(['note', 'source', 'decision', 'inbox', 'capture', 'research']),
  status: z.enum(['raw', 'draft', 'durable', 'archived']),
  tags: z.array(z.string()).default([]),
  links: z.array(z.string()).default([]),
  source: z.string().nullable().default(null),
  confidence: z.enum(['low', 'medium', 'high']).optional(),
  created: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  // source-only optional fields
  source_url: z.string().url().optional(),
  source_fetched_at: z.string().optional(),
  source_fetcher: z
    .enum(['firecrawl-scrape', 'firecrawl-instruct', 'manual', 'pdf', 'chat-export'])
    .optional(),
  source_content_hash: z.string().optional(),
  source_blob_path: z.string().nullable().optional(),
  // research-only optional fields
  agent_run_id: z.string().uuid().optional(),
  budget: z.number().int().positive().optional(),
});
```

- [ ] **Step 4: Write failing test for research-type frontmatter**

Create `scripts/lib/frontmatter.test.ts` (or append if it exists):

```ts
import { describe, expect, it } from 'bun:test';
import { FrontmatterSchema, parseDocument, stringifyDocument } from './frontmatter.ts';

describe('FrontmatterSchema', () => {
  it('accepts type=research with agent_run_id and budget', () => {
    const data = {
      slug: '2026-05-13-rag-evaluation',
      title: 'RAG Evaluation (research session)',
      type: 'research',
      status: 'draft',
      tags: ['research-session', 'rag'],
      links: [],
      source: null,
      confidence: 'medium',
      created: '2026-05-13',
      updated: '2026-05-13',
      agent_run_id: '11111111-1111-1111-1111-111111111111',
      budget: 5,
    };
    const fm = FrontmatterSchema.parse(data);
    expect(fm.type).toBe('research');
    expect(fm.budget).toBe(5);
    expect(fm.agent_run_id).toBe('11111111-1111-1111-1111-111111111111');
  });

  it('round-trips a research landing page through parseDocument/stringifyDocument', () => {
    const data = {
      slug: '2026-05-13-test',
      title: 'Test',
      type: 'research' as const,
      status: 'draft' as const,
      tags: [],
      links: [],
      source: null,
      confidence: 'medium' as const,
      created: '2026-05-13',
      updated: '2026-05-13',
      agent_run_id: '11111111-1111-1111-1111-111111111111',
      budget: 5,
    };
    const fm = FrontmatterSchema.parse(data);
    const doc = stringifyDocument(fm, '# Test\n\n## Plan\n');
    const reparsed = parseDocument(doc);
    expect(reparsed.frontmatter.type).toBe('research');
    expect(reparsed.frontmatter.agent_run_id).toBe(data.agent_run_id);
    expect(reparsed.frontmatter.budget).toBe(5);
  });
});
```

- [ ] **Step 5: Run tests**

Run: `bun test scripts/lib/frontmatter.test.ts`
Expected: 2 passes.

Run: `bun test` (full suite)
Expected: all existing tests still pass — verify no regression from the type-enum change.

- [ ] **Step 6: Commit**

```bash
git add db/supabase/migrations/20260513000000_add_research_type.sql scripts/lib/frontmatter.ts scripts/lib/frontmatter.test.ts
git commit -m "$(cat <<'EOF'
[db] add 'research' type to items.type + zod schema

Adds optional agent_run_id and budget fields used by research-session
landing pages. Prereq for the research skill.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Export new helpers from `runs.ts`

**Files:**
- Modify: `scripts/lib/runs.ts`
- Modify: `scripts/lib/runs.test.ts`

- [ ] **Step 1: Write failing tests**

Append to `scripts/lib/runs.test.ts` after the existing `describe('withRun', ...)` block:

```ts
import { startRun, updateRunSummary, finalizeRun } from './runs.ts';

describe('multi-call run lifecycle', () => {
  it('startRun → updateRunSummary → finalizeRun(succeeded) round-trip', async () => {
    const runId = await startRun('test-multi-call');
    await updateRunSummary(runId, 'partial: 2 iters');
    await finalizeRun(runId, 'succeeded', 'final: 5 iters, 5 notes', null);

    const rows = await sql<{ status: string; summary: string | null; error: string | null; ended_at: Date | null }[]>`
      select status, summary, error, ended_at from agent_runs where id = ${runId}
    `;
    expect(rows[0]!.status).toBe('succeeded');
    expect(rows[0]!.summary).toBe('final: 5 iters, 5 notes');
    expect(rows[0]!.error).toBeNull();
    expect(rows[0]!.ended_at).not.toBeNull();
  });

  it('finalizeRun(failed) writes the error message', async () => {
    const runId = await startRun('test-multi-call-fail');
    await finalizeRun(runId, 'failed', 'iter 2 errored', 'firecrawl-timeout');

    const rows = await sql<{ status: string; error: string | null }[]>`
      select status, error from agent_runs where id = ${runId}
    `;
    expect(rows[0]!.status).toBe('failed');
    expect(rows[0]!.error).toBe('firecrawl-timeout');
  });
});
```

Also extend the existing `beforeEach`/`afterAll` cleanup to cover the new skill names:

```ts
beforeEach(async () => {
  await sql`delete from agent_runs where skill_name like 'test-%'`;
});
```
(Already matches — no change needed.)

- [ ] **Step 2: Run tests to verify they fail**

Run: `bun test scripts/lib/runs.test.ts`
Expected: import error or "startRun is not a function" — the new exports don't exist yet.

- [ ] **Step 3: Implement the new exports**

Edit `scripts/lib/runs.ts`. Replace the entire file content with:

```ts
import { sql } from './db.ts';

export type RunContext = {
  runId: string;
  recordSummary: (summary: string) => void;
  recordItemId: (itemId: string) => void;
};

export async function startRun(skillName: string): Promise<string> {
  const rows = await sql<{ id: string }[]>`
    insert into agent_runs (skill_name, status)
    values (${skillName}, 'started')
    returning id
  `;
  return rows[0]!.id;
}

export async function updateRunSummary(runId: string, summary: string): Promise<void> {
  await sql`
    update agent_runs
    set summary = ${summary}
    where id = ${runId}
  `;
}

export async function finalizeRun(
  runId: string,
  status: 'succeeded' | 'failed',
  summary: string | null,
  error: string | null,
  itemId: string | null = null,
): Promise<void> {
  await sql`
    update agent_runs
    set status = ${status}, ended_at = now(),
        summary = ${summary}, error = ${error}, item_id = ${itemId}
    where id = ${runId}
  `;
}

export async function withRun<T>(
  skillName: string,
  fn: (ctx: RunContext) => Promise<T>,
): Promise<T> {
  const runId = await startRun(skillName);
  let summary: string | null = null;
  let itemId: string | null = null;
  const ctx: RunContext = {
    runId,
    recordSummary: (s) => {
      summary = s;
    },
    recordItemId: (id) => {
      itemId = id;
    },
  };
  try {
    const result = await fn(ctx);
    await finalizeRun(runId, 'succeeded', summary, null, itemId);
    return result;
  } catch (e) {
    const err = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
    await finalizeRun(runId, 'failed', summary, err, itemId);
    throw e;
  }
}
```

- [ ] **Step 4: Run tests**

Run: `bun test scripts/lib/runs.test.ts`
Expected: all tests pass (including the existing `withRun` ones — `withRun` now calls `startRun` and `finalizeRun` under the hood).

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/runs.ts scripts/lib/runs.test.ts
git commit -m "$(cat <<'EOF'
[scripts] export startRun/updateRunSummary/finalizeRun from runs.ts

Promotes the previously-private helpers so research.ts can span a single
agent_runs row across multiple subcommand invocations (init/log/finalize).
withRun still works unchanged.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: `capture.ts` indexer-staleness fix

**Files:**
- Modify: `scripts/capture.ts:70`
- Create: `scripts/capture.test.ts` (verify absence first)

- [ ] **Step 1: Verify no existing capture test**

Run: `ls scripts/capture.test.ts 2>/dev/null && echo "exists" || echo "absent"`
Expected: `absent`. If it says `exists`, read it first and append rather than overwrite.

- [ ] **Step 2: Write failing test**

Create `scripts/capture.test.ts`:

```ts
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
```

- [ ] **Step 3: Run test to confirm failure**

Run: `bun test scripts/capture.test.ts`
Expected: `items.length` is 0 — capture writes the file + a `captures` row but does NOT index the item. Test fails with assertion error.

- [ ] **Step 4: Add the indexer call to capture.ts**

Edit `scripts/capture.ts`. Add to imports at top (after the existing imports on line 1-6):

```ts
import { indexOneFile } from './indexer.ts';
```

Then in the body of `captureItem`, immediately after `writeFileSync(absPath, content, 'utf8');` (line 70), insert:

```ts
  writeFileSync(absPath, content, 'utf8');

  // Index the new file so links/items are queryable before the next capture.
  // PostToolUse hook only fires on Claude's Write|Edit tools, not Bash invocations.
  await indexOneFile(absPath, repoRoot);
```

- [ ] **Step 5: Run test to verify it passes**

Run: `bun test scripts/capture.test.ts`
Expected: PASS.

Run: `bun test` (full suite — verify no regression in indexer.test.ts that might collide on the test slug).
Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add scripts/capture.ts scripts/capture.test.ts
git commit -m "$(cat <<'EOF'
[capture] index inline after write — fixes latent stale-DB bug

PostToolUse hook only fires on Claude's Write|Edit tools, so Bash-invoked
captures left the items/links tables stale until something else touched the
file. The research skill's gap-fill bonus depends on session-created notes
being indexed before the next pick — this fix unblocks that.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Pure parsing library (`research-parse.ts`)

**Files:**
- Create: `scripts/lib/research-parse.ts`
- Create: `scripts/lib/research-parse.test.ts`
- Create: `tests/fixtures/research/empty-session.md`
- Create: `tests/fixtures/research/two-iter-session.md`

- [ ] **Step 1: Create fixture files**

Create `tests/fixtures/research/empty-session.md`:

```markdown
---
slug: 2026-05-13-bloom-filter
title: Bloom Filter (research session)
type: research
status: draft
tags:
  - research-session
  - data-structures
links: []
source: null
confidence: medium
created: '2026-05-13'
updated: '2026-05-13'
agent_run_id: 11111111-1111-1111-1111-111111111111
budget: 5
---

# Bloom Filter — research session

**Topic:** what is a Bloom filter
**Budget:** 5 iterations

## Plan

Seed sub-questions:
1. What is a Bloom filter and what problem does it solve?
2. What is the false-positive rate formula?
3. How does a counting Bloom filter differ from a standard one?
4. Where are Bloom filters used in practice?
5. What are alternatives to Bloom filters (Cuckoo, quotient, xor)?

Anchors in DB: (none)

## Iteration log

## Synthesis

(pending)
```

Create `tests/fixtures/research/two-iter-session.md`:

```markdown
---
slug: 2026-05-13-bloom-filter
title: Bloom Filter (research session)
type: research
status: draft
tags:
  - research-session
  - data-structures
links: []
source: null
confidence: medium
created: '2026-05-13'
updated: '2026-05-13'
agent_run_id: 11111111-1111-1111-1111-111111111111
budget: 5
---

# Bloom Filter — research session

**Topic:** what is a Bloom filter
**Budget:** 5 iterations

## Plan

Seed sub-questions:
1. What is a Bloom filter and what problem does it solve?
2. What is the false-positive rate formula?
3. How does a counting Bloom filter differ from a standard one?
4. Where are Bloom filters used in practice?
5. What are alternatives to Bloom filters (Cuckoo, quotient, xor)?

Anchors in DB: (none)

## Iteration log

### Iteration 1 — What is a Bloom filter and what problem does it solve?
- **Picked because:** Highest info_gain among seed questions; foundational
- **Score:** info_gain=9.0 + gap_fill=0 → 9.0
- **Sources:** [[2026-05-13-bloom-filter-wikipedia]]
- **Notes:** [[bloom-filter-basics]], [[probabilistic-data-structures]]
- **Status:** kept

### Iteration 2 — What is the false-positive rate formula?
- **Picked because:** Natural follow-on; quantifies the trade-off
- **Score:** info_gain=8.0 + gap_fill=1 → 9.0
- **Sources:** [[2026-05-13-bloom-filter-math]]
- **Notes:** [[bloom-filter-fpr]]
- **Status:** kept

## Synthesis

(pending)
```

- [ ] **Step 2: Write the parse tests (failing)**

Create `scripts/lib/research-parse.test.ts`:

```ts
import { describe, expect, it } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  extractSection,
  replaceSection,
  parseSeedQuestions,
  parseIterationLog,
  formatIterationEntry,
  appendIterationToLandingPage,
  type IterationEntry,
} from './research-parse.ts';

const FIXTURE = join(process.cwd(), 'tests', 'fixtures', 'research');
const emptyMd = readFileSync(join(FIXTURE, 'empty-session.md'), 'utf8');
const twoIterMd = readFileSync(join(FIXTURE, 'two-iter-session.md'), 'utf8');

describe('extractSection', () => {
  it('returns the body of a named section', () => {
    const plan = extractSection(emptyMd, 'Plan');
    expect(plan).toContain('Seed sub-questions:');
    expect(plan).toContain('1. What is a Bloom filter');
    expect(plan).not.toContain('## Iteration log');
  });

  it('returns empty string for missing section', () => {
    expect(extractSection(emptyMd, 'Nonexistent')).toBe('');
  });

  it('returns empty string for sections with no body', () => {
    expect(extractSection(emptyMd, 'Iteration log').trim()).toBe('');
  });
});

describe('replaceSection', () => {
  it('replaces section body, leaving other sections intact', () => {
    const updated = replaceSection(emptyMd, 'Synthesis', 'New synthesis content.');
    expect(updated).toContain('## Synthesis\n\nNew synthesis content.');
    expect(updated).toContain('## Plan');
    expect(updated).toContain('## Iteration log');
  });

  it('adds the section at end if missing', () => {
    const md = '# Title\n\n## A\n\nbody\n';
    const updated = replaceSection(md, 'B', 'b-body');
    expect(updated).toContain('## A\n\nbody');
    expect(updated).toContain('## B\n\nb-body');
  });
});

describe('parseSeedQuestions', () => {
  it('extracts numbered seed sub-questions', () => {
    const plan = extractSection(emptyMd, 'Plan');
    const qs = parseSeedQuestions(plan);
    expect(qs.length).toBe(5);
    expect(qs[0]).toBe('What is a Bloom filter and what problem does it solve?');
    expect(qs[4]).toBe('What are alternatives to Bloom filters (Cuckoo, quotient, xor)?');
  });

  it('returns empty array when no numbered list present', () => {
    expect(parseSeedQuestions('no list here')).toEqual([]);
  });
});

describe('parseIterationLog', () => {
  it('returns empty array on empty log', () => {
    const log = extractSection(emptyMd, 'Iteration log');
    expect(parseIterationLog(log)).toEqual([]);
  });

  it('parses two completed iterations', () => {
    const log = extractSection(twoIterMd, 'Iteration log');
    const entries = parseIterationLog(log);
    expect(entries.length).toBe(2);
    expect(entries[0]!.iteration).toBe(1);
    expect(entries[0]!.sub_question).toBe('What is a Bloom filter and what problem does it solve?');
    expect(entries[0]!.status).toBe('kept');
    expect(entries[0]!.notes_written).toEqual(['bloom-filter-basics', 'probabilistic-data-structures']);
    expect(entries[0]!.sources_captured).toEqual(['2026-05-13-bloom-filter-wikipedia']);
    expect(entries[1]!.iteration).toBe(2);
    expect(entries[1]!.score.gap_fill_bonus).toBe(1);
  });

  it('self-heals on malformed entries (skips bad entry, parses good ones)', () => {
    const badLog = `### Iteration 1 — Good
- **Status:** kept

### oops not an iteration

### Iteration 2 — Also good
- **Status:** kept
`;
    const entries = parseIterationLog(badLog);
    expect(entries.length).toBe(2);
    expect(entries.map((e) => e.iteration)).toEqual([1, 2]);
  });
});

describe('formatIterationEntry', () => {
  it('formats a kept entry with notes and sources', () => {
    const entry: IterationEntry = {
      iteration: 3,
      sub_question: 'Where are Bloom filters used?',
      picked_reason: 'Applied angle gap',
      score: { info_gain: 7.0, gap_fill_bonus: 0, total: 7.0 },
      sources_captured: ['2026-05-13-redis-bloom'],
      notes_written: ['bloom-filter-applications'],
      contradictions: [],
      status: 'kept',
    };
    const md = formatIterationEntry(entry);
    expect(md).toContain('### Iteration 3 — Where are Bloom filters used?');
    expect(md).toContain('- **Picked because:** Applied angle gap');
    expect(md).toContain('- **Score:** info_gain=7.0 + gap_fill=0 → 7.0');
    expect(md).toContain('- **Sources:** [[2026-05-13-redis-bloom]]');
    expect(md).toContain('- **Notes:** [[bloom-filter-applications]]');
    expect(md).toContain('- **Status:** kept');
    expect(md).not.toContain('Contradictions');
  });

  it('omits Sources/Notes lines when empty', () => {
    const entry: IterationEntry = {
      iteration: 4,
      sub_question: 'Paywalled question',
      picked_reason: 'next in queue',
      score: { info_gain: 6.0, gap_fill_bonus: 0, total: 6.0 },
      sources_captured: [],
      notes_written: [],
      contradictions: [],
      status: 'low-signal',
    };
    const md = formatIterationEntry(entry);
    expect(md).toContain('- **Status:** low-signal');
    expect(md).not.toContain('- **Sources:**');
    expect(md).not.toContain('- **Notes:**');
  });

  it('includes contradictions when present', () => {
    const entry: IterationEntry = {
      iteration: 5,
      sub_question: 'Q',
      picked_reason: 'r',
      score: { info_gain: 5, gap_fill_bonus: 0, total: 5 },
      sources_captured: [],
      notes_written: ['note-a'],
      contradictions: [{ note_slug: 'note-a', conflicts_with: 'source-b', summary: 'They disagree' }],
      status: 'kept',
    };
    const md = formatIterationEntry(entry);
    expect(md).toContain('- **Contradictions:**');
    expect(md).toContain('[[note-a]] vs [[source-b]]: They disagree');
  });
});

describe('appendIterationToLandingPage', () => {
  it('round-trips: append → parse → identical entry', () => {
    const entry: IterationEntry = {
      iteration: 1,
      sub_question: 'First Q?',
      picked_reason: 'because',
      score: { info_gain: 8.5, gap_fill_bonus: 2, total: 10.5 },
      sources_captured: ['s-a', 's-b'],
      notes_written: ['n-a'],
      contradictions: [],
      status: 'kept',
    };
    const updated = appendIterationToLandingPage(emptyMd, entry);
    const reparsed = parseIterationLog(extractSection(updated, 'Iteration log'));
    expect(reparsed.length).toBe(1);
    expect(reparsed[0]!.iteration).toBe(1);
    expect(reparsed[0]!.sub_question).toBe('First Q?');
    expect(reparsed[0]!.score.total).toBeCloseTo(10.5, 1);
    expect(reparsed[0]!.notes_written).toEqual(['n-a']);
  });

  it('appends a second iteration after an existing one', () => {
    const entry: IterationEntry = {
      iteration: 3,
      sub_question: 'Third Q',
      picked_reason: 'r',
      score: { info_gain: 6, gap_fill_bonus: 0, total: 6 },
      sources_captured: [],
      notes_written: [],
      contradictions: [],
      status: 'low-signal',
    };
    const updated = appendIterationToLandingPage(twoIterMd, entry);
    const entries = parseIterationLog(extractSection(updated, 'Iteration log'));
    expect(entries.length).toBe(3);
    expect(entries.map((e) => e.iteration)).toEqual([1, 2, 3]);
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `bun test scripts/lib/research-parse.test.ts`
Expected: module-not-found error — `research-parse.ts` doesn't exist yet.

- [ ] **Step 4: Implement the parsing library**

Create `scripts/lib/research-parse.ts`:

```ts
import { extractWikilinks } from './wikilinks.ts';

export type Contradiction = {
  note_slug: string;
  conflicts_with: string;
  summary: string;
};

export type IterationEntry = {
  iteration: number;
  sub_question: string;
  picked_reason: string;
  score: {
    info_gain: number;
    gap_fill_bonus: number;
    total: number;
  };
  sources_captured: string[];
  notes_written: string[];
  contradictions: Contradiction[];
  status: 'kept' | 'skipped' | 'low-signal' | 'error';
};

// Extract content under a "## <heading>" line up to the next "## " heading or EOF.
export function extractSection(md: string, heading: string): string {
  const lines = md.split(/\r?\n/);
  const target = `## ${heading}`;
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i] === target) {
      start = i + 1;
      break;
    }
  }
  if (start === -1) return '';
  let end = lines.length;
  for (let i = start; i < lines.length; i++) {
    if (lines[i]!.startsWith('## ')) {
      end = i;
      break;
    }
  }
  return lines.slice(start, end).join('\n').replace(/^\n+|\n+$/g, '');
}

// Replace the body of "## <heading>". Adds the section at the end if missing.
export function replaceSection(md: string, heading: string, newBody: string): string {
  const lines = md.split(/\r?\n/);
  const target = `## ${heading}`;
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i] === target) {
      start = i;
      break;
    }
  }
  if (start === -1) {
    // Append at end.
    const trailing = md.endsWith('\n') ? '' : '\n';
    return `${md}${trailing}\n## ${heading}\n\n${newBody}\n`;
  }
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (lines[i]!.startsWith('## ')) {
      end = i;
      break;
    }
  }
  const before = lines.slice(0, start).join('\n');
  const after = lines.slice(end).join('\n');
  return `${before}\n## ${heading}\n\n${newBody}\n${after ? '\n' + after : ''}`.replace(/\n{3,}/g, '\n\n');
}

// Pull numbered sub-questions out of a Plan section body.
export function parseSeedQuestions(planSection: string): string[] {
  const out: string[] = [];
  const re = /^\s*(\d+)\.\s+(.+?)\s*$/gm;
  for (const m of planSection.matchAll(re)) {
    out.push(m[2]!);
  }
  return out;
}

const ITER_HEADER_RE = /^### Iteration (\d+) — (.+)$/;
const BULLET_RE = /^- \*\*([^*]+):\*\*\s*(.*)$/;
const CONTRADICTION_LINE_RE = /^\s*-\s*\[\[([^\]]+)\]\] vs \[\[([^\]]+)\]\]: (.+)$/;

export function parseIterationLog(logSection: string): IterationEntry[] {
  const lines = logSection.split(/\r?\n/);
  const out: IterationEntry[] = [];
  let cur: Partial<IterationEntry> | null = null;
  let inContradictions = false;

  const finishCurrent = () => {
    if (cur && typeof cur.iteration === 'number' && cur.sub_question && cur.status) {
      out.push({
        iteration: cur.iteration,
        sub_question: cur.sub_question,
        picked_reason: cur.picked_reason ?? '',
        score: cur.score ?? { info_gain: 0, gap_fill_bonus: 0, total: 0 },
        sources_captured: cur.sources_captured ?? [],
        notes_written: cur.notes_written ?? [],
        contradictions: cur.contradictions ?? [],
        status: cur.status,
      });
    }
    cur = null;
    inContradictions = false;
  };

  for (const line of lines) {
    const headerMatch = line.match(ITER_HEADER_RE);
    if (headerMatch) {
      finishCurrent();
      cur = {
        iteration: Number(headerMatch[1]),
        sub_question: headerMatch[2]!,
        sources_captured: [],
        notes_written: [],
        contradictions: [],
      };
      continue;
    }
    if (!cur) continue;

    if (inContradictions) {
      const cMatch = line.match(CONTRADICTION_LINE_RE);
      if (cMatch) {
        cur.contradictions!.push({
          note_slug: cMatch[1]!,
          conflicts_with: cMatch[2]!,
          summary: cMatch[3]!,
        });
        continue;
      }
      if (line.match(BULLET_RE) || line.match(ITER_HEADER_RE)) {
        inContradictions = false;
      } else {
        continue;
      }
    }

    const bullet = line.match(BULLET_RE);
    if (!bullet) continue;
    const key = bullet[1]!.toLowerCase();
    const value = bullet[2] ?? '';

    if (key === 'picked because') {
      cur.picked_reason = value;
    } else if (key === 'score') {
      const m = value.match(/info_gain=([\d.]+)\s*\+\s*gap_fill=([\d.]+)\s*→\s*([\d.]+)/);
      if (m) {
        cur.score = {
          info_gain: Number(m[1]),
          gap_fill_bonus: Number(m[2]),
          total: Number(m[3]),
        };
      }
    } else if (key === 'sources') {
      cur.sources_captured = extractWikilinks(value).map((l) => l.slug);
    } else if (key === 'notes') {
      cur.notes_written = extractWikilinks(value).map((l) => l.slug);
    } else if (key === 'status') {
      const s = value.trim();
      if (s === 'kept' || s === 'skipped' || s === 'low-signal' || s === 'error') {
        cur.status = s;
      }
    } else if (key === 'contradictions') {
      inContradictions = true;
    }
  }
  finishCurrent();
  return out;
}

export function formatIterationEntry(entry: IterationEntry): string {
  const lines: string[] = [];
  lines.push(`### Iteration ${entry.iteration} — ${entry.sub_question}`);
  lines.push(`- **Picked because:** ${entry.picked_reason}`);
  lines.push(
    `- **Score:** info_gain=${entry.score.info_gain.toFixed(1)} + gap_fill=${entry.score.gap_fill_bonus} → ${entry.score.total.toFixed(1)}`,
  );
  if (entry.sources_captured.length > 0) {
    lines.push(`- **Sources:** ${entry.sources_captured.map((s) => `[[${s}]]`).join(', ')}`);
  }
  if (entry.notes_written.length > 0) {
    lines.push(`- **Notes:** ${entry.notes_written.map((n) => `[[${n}]]`).join(', ')}`);
  }
  lines.push(`- **Status:** ${entry.status}`);
  if (entry.contradictions.length > 0) {
    lines.push(`- **Contradictions:**`);
    for (const c of entry.contradictions) {
      lines.push(`  - [[${c.note_slug}]] vs [[${c.conflicts_with}]]: ${c.summary}`);
    }
  }
  return lines.join('\n');
}

export function appendIterationToLandingPage(rawMd: string, entry: IterationEntry): string {
  const existing = extractSection(rawMd, 'Iteration log');
  const newEntry = formatIterationEntry(entry);
  const newBody = existing.trim() ? `${existing.trim()}\n\n${newEntry}` : newEntry;
  return replaceSection(rawMd, 'Iteration log', newBody);
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `bun test scripts/lib/research-parse.test.ts`
Expected: all 13 tests pass.

- [ ] **Step 6: Commit**

```bash
git add scripts/lib/research-parse.ts scripts/lib/research-parse.test.ts tests/fixtures/research/
git commit -m "$(cat <<'EOF'
[research] pure parse/format library + fixtures

Pure functions for Markdown landing-page handling: extractSection,
replaceSection, parseSeedQuestions, parseIterationLog, formatIterationEntry,
appendIterationToLandingPage. Two fixture files (empty + two-iter sessions)
shared between unit + integration tests.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Scoring library (`research-scoring.ts`)

**Files:**
- Create: `scripts/lib/research-scoring.ts`
- Create: `scripts/lib/research-scoring.test.ts`

- [ ] **Step 1: Write failing tests**

Create `scripts/lib/research-scoring.test.ts`:

```ts
import { describe, expect, it } from 'bun:test';
import {
  buildCandidates,
  pickTopCandidate,
  extractKeywords,
  type Candidate,
} from './research-scoring.ts';
import type { IterationEntry } from './research-parse.ts';

const seedQuestions = [
  'What is a Bloom filter?',
  'False-positive rate formula?',
  'Counting Bloom filter?',
  'Applications in practice?',
  'Alternatives (Cuckoo, xor)?',
];

describe('buildCandidates', () => {
  it('returns all seed questions when iteration log is empty and no unresolved links', () => {
    const cands = buildCandidates(seedQuestions, [], []);
    expect(cands.length).toBe(5);
    expect(cands[0]!.kind).toBe('seed');
    expect(cands.map((c) => c.sub_question)).toEqual(seedQuestions);
  });

  it('drops seed questions already covered in iteration log', () => {
    const log: IterationEntry[] = [
      {
        iteration: 1,
        sub_question: seedQuestions[0]!,
        picked_reason: 'r',
        score: { info_gain: 9, gap_fill_bonus: 0, total: 9 },
        sources_captured: [],
        notes_written: ['bloom-filter-basics'],
        contradictions: [],
        status: 'kept',
      },
    ];
    const cands = buildCandidates(seedQuestions, log, []);
    expect(cands.length).toBe(4);
    expect(cands.map((c) => c.sub_question)).not.toContain(seedQuestions[0]);
  });

  it('adds unresolved-link candidates with gap_fill_bonus', () => {
    const cands = buildCandidates(seedQuestions, [], ['position-bias', 'mmr-rerank']);
    const linkCands = cands.filter((c) => c.kind === 'unresolved-link');
    expect(linkCands.length).toBe(2);
    expect(linkCands.map((c) => c.sub_question).sort()).toEqual([
      'Explore unresolved link: mmr-rerank',
      'Explore unresolved link: position-bias',
    ]);
    expect(linkCands[0]!.score.gap_fill_bonus).toBeGreaterThan(0);
  });

  it('assigns higher info_gain to earlier seed questions (descending heuristic)', () => {
    const cands = buildCandidates(seedQuestions, [], []);
    for (let i = 0; i < cands.length - 1; i++) {
      expect(cands[i]!.score.info_gain).toBeGreaterThanOrEqual(cands[i + 1]!.score.info_gain);
    }
  });
});

describe('pickTopCandidate', () => {
  it('returns the highest-scoring candidate, breaking ties by seed order', () => {
    const cands: Candidate[] = [
      { kind: 'seed', sub_question: 'A', score: { info_gain: 8, gap_fill_bonus: 0, total: 8 }, keywords: ['a'] },
      { kind: 'seed', sub_question: 'B', score: { info_gain: 7, gap_fill_bonus: 1, total: 8 }, keywords: ['b'] },
      { kind: 'seed', sub_question: 'C', score: { info_gain: 9, gap_fill_bonus: 0, total: 9 }, keywords: ['c'] },
    ];
    expect(pickTopCandidate(cands)!.sub_question).toBe('C');
  });

  it('returns null on empty list', () => {
    expect(pickTopCandidate([])).toBeNull();
  });
});

describe('extractKeywords', () => {
  it('lowercases, strips punctuation, drops stopwords, dedupes', () => {
    const kw = extractKeywords('What is the false-positive rate of a Bloom filter?');
    expect(kw).toContain('bloom');
    expect(kw).toContain('filter');
    expect(kw).toContain('false-positive');
    expect(kw).not.toContain('what');
    expect(kw).not.toContain('is');
    expect(kw).not.toContain('the');
  });

  it('returns at most 6 keywords', () => {
    const kw = extractKeywords(
      'consistent hashing distributed systems load balancing routing strategy implementations',
    );
    expect(kw.length).toBeLessThanOrEqual(6);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `bun test scripts/lib/research-scoring.test.ts`
Expected: module-not-found error.

- [ ] **Step 3: Implement scoring**

Create `scripts/lib/research-scoring.ts`:

```ts
import type { IterationEntry } from './research-parse.ts';

export type CandidateKind = 'seed' | 'unresolved-link';

export type Candidate = {
  kind: CandidateKind;
  sub_question: string;
  keywords: string[];
  score: {
    info_gain: number;
    gap_fill_bonus: number;
    total: number;
  };
};

const STOPWORDS = new Set([
  'a','an','and','are','as','at','be','but','by','do','does','for','from','how','i','if',
  'in','is','it','of','on','or','so','that','the','this','to','was','were','what','when',
  'where','which','who','why','will','with','you','your','about','vs','versus',
]);

export function extractKeywords(text: string): string[] {
  const cleaned = text
    .toLowerCase()
    .replace(/[?!.,:;()\[\]{}'"]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const tokens = cleaned.split(' ');
  const seen = new Set<string>();
  const out: string[] = [];
  for (const t of tokens) {
    if (!t || STOPWORDS.has(t) || t.length < 3) continue;
    if (seen.has(t)) continue;
    seen.add(t);
    out.push(t);
    if (out.length >= 6) break;
  }
  return out;
}

// Heuristic info_gain assignment: seed questions decline from 9.0 by 0.5 per slot.
// Unresolved-link candidates get a fixed mid value (6.0), letting the gap_fill bonus tip them.
function seedInfoGain(index: number): number {
  return Math.max(9.0 - index * 0.5, 5.0);
}

const UNRESOLVED_LINK_INFO_GAIN = 6.0;
const GAP_FILL_PER_LINK = 1.0;

export function buildCandidates(
  seedQuestions: string[],
  iterationLog: IterationEntry[],
  unresolvedLinkSlugs: string[],
): Candidate[] {
  const coveredQuestions = new Set(iterationLog.map((e) => e.sub_question));
  const out: Candidate[] = [];

  // Seed candidates (preserve order, drop covered)
  seedQuestions.forEach((q, idx) => {
    if (coveredQuestions.has(q)) return;
    out.push({
      kind: 'seed',
      sub_question: q,
      keywords: extractKeywords(q),
      score: {
        info_gain: seedInfoGain(idx),
        gap_fill_bonus: 0,
        total: seedInfoGain(idx),
      },
    });
  });

  // Unresolved-link candidates (sorted alphabetically for determinism)
  const sortedLinks = [...unresolvedLinkSlugs].sort();
  for (const slug of sortedLinks) {
    const subQ = `Explore unresolved link: ${slug}`;
    if (coveredQuestions.has(subQ)) continue;
    out.push({
      kind: 'unresolved-link',
      sub_question: subQ,
      keywords: extractKeywords(slug.replace(/-/g, ' ')),
      score: {
        info_gain: UNRESOLVED_LINK_INFO_GAIN,
        gap_fill_bonus: GAP_FILL_PER_LINK,
        total: UNRESOLVED_LINK_INFO_GAIN + GAP_FILL_PER_LINK,
      },
    });
  }

  return out;
}

export function pickTopCandidate(candidates: Candidate[]): Candidate | null {
  if (candidates.length === 0) return null;
  // Stable sort: candidates are already in deterministic build order (seed-by-index, then link alpha).
  // We pick the max-by-total preserving first-seen on tie.
  let best = candidates[0]!;
  for (const c of candidates.slice(1)) {
    if (c.score.total > best.score.total) best = c;
  }
  return best;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `bun test scripts/lib/research-scoring.test.ts`
Expected: all 8 tests pass.

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/research-scoring.ts scripts/lib/research-scoring.test.ts
git commit -m "$(cat <<'EOF'
[research] candidate scoring library

Pure functions: extractKeywords, buildCandidates, pickTopCandidate. Seed
questions get descending info_gain (9.0 step -0.5); unresolved-link
candidates get a fixed info_gain plus a gap_fill bonus per link. Tie-break
is deterministic (seed order, then alphabetical for links).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: DB-touching storage library (`research-storage.ts`)

**Files:**
- Create: `scripts/lib/research-storage.ts`
- Create: `scripts/lib/research-storage.test.ts`

- [ ] **Step 1: Write failing tests**

Create `scripts/lib/research-storage.test.ts`:

```ts
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
  body?: string;
  confidence?: 'low' | 'medium' | 'high';
  links?: string[];
}): Promise<string> {
  const { slug, title, body = '', confidence = 'high', links = [] } = opts;
  const rows = await sql<{ id: string }[]>`
    insert into items (workspace_id, slug, file_path, type, status, title, content_hash, confidence, frontmatter)
    values (
      ${workspaceId}, ${slug}, ${'workspaces/second-brain/notes/' + slug + '.md'},
      'note', 'durable', ${title}, ${'h-' + slug}, ${confidence},
      ${sql.json({ slug, title })}
    )
    returning id
  `;
  const itemId = rows[0]!.id;
  // simulate body via frontmatter mirror — production indexer reads body too.
  // For coverage check we use frontmatter `title` since body isn't stored as a column.
  // Use the LIKE on title+frontmatter for the test.
  for (const toSlug of links) {
    await sql`
      insert into links (from_item_id, to_slug, to_item_id) values (${itemId}, ${toSlug}, null)
    `;
  }
  // Store body inside frontmatter for ILIKE lookup parity (workaround since items table has no body col)
  if (body) {
    await sql`update items set frontmatter = ${sql.json({ slug, title, body })} where id = ${itemId}`;
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
    // Manually create one resolved + one unresolved link from this note
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `bun test scripts/lib/research-storage.test.ts`
Expected: module-not-found error.

- [ ] **Step 3: Implement storage**

Create `scripts/lib/research-storage.ts`:

```ts
import { sql } from './db.ts';

// Find existing items whose title or frontmatter mentions any of the given keywords.
// Returns slugs; used by init to seed anchor candidates for the landing page.
export async function findAnchorCandidates(
  workspaceId: string,
  keywords: string[],
): Promise<string[]> {
  if (keywords.length === 0) return [];
  const rows = await sql<{ slug: string }[]>`
    select distinct slug from items
    where workspace_id = ${workspaceId}
      and (
        ${sql.unsafe(
          keywords.map((_, i) => `title ilike $${i + 2}`).join(' or '),
        )}
      )
    order by slug
    limit 20
  `.values(...keywords.map((k) => `%${k}%`)) as unknown as { slug: string }[];
  // postgres.js doesn't expose .values() this way directly; fall back to a tagged-template approach.
  return rows.map((r) => r.slug);
}

// Returns true when >= 3 high-confidence items contain ALL keywords in title or frontmatter.
export async function isAlreadyCovered(
  workspaceId: string,
  keywords: string[],
): Promise<boolean> {
  if (keywords.length === 0) return false;
  const conditions = keywords.map((k) => sql`(title ilike ${'%' + k + '%'} or frontmatter::text ilike ${'%' + k + '%'})`);
  const rows = await sql<{ c: number }[]>`
    select count(*)::int as c from items
    where workspace_id = ${workspaceId}
      and confidence = 'high'
      and ${conditions.reduce((a, b) => sql`${a} and ${b}`)}
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
```

**⚠️ Note on `findAnchorCandidates`:** the postgres.js library doesn't combine `sql.unsafe` with `.values()` cleanly. If the implementation above doesn't compile or run, replace it with this simpler conjunctive form:

```ts
export async function findAnchorCandidates(
  workspaceId: string,
  keywords: string[],
): Promise<string[]> {
  if (keywords.length === 0) return [];
  // OR across keywords using postgres.js fragment composition
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
```

Use whichever form passes the tests. The second form is preferred — drop the first.

- [ ] **Step 4: Run tests**

Run: `bun test scripts/lib/research-storage.test.ts`
Expected: all 8 tests pass.

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/research-storage.ts scripts/lib/research-storage.test.ts
git commit -m "$(cat <<'EOF'
[research] DB storage helpers for pick subcommand

findAnchorCandidates (seed anchors for landing page), isAlreadyCovered
(>= 3 high-confidence keyword hits = covered), getUnresolvedLinkSlugs
(drives gap_fill bonus from session-created notes).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: `research.ts init` subcommand

**Files:**
- Create: `scripts/research.ts`
- Create: `scripts/research.test.ts`
- Create: `scripts/lib/research-junk-domains.txt`
- Create: `workspaces/second-brain/research/.gitkeep`

- [ ] **Step 1: Create the junk-domains seed file**

Create `scripts/lib/research-junk-domains.txt`:

```
# One domain per line. Lines starting with # are ignored.
# Add domains here to skip results from low-quality sources during research.
quora.com
```

- [ ] **Step 2: Create the research lifecycle folder**

Create `workspaces/second-brain/research/.gitkeep` (empty file).

- [ ] **Step 3: Write failing test for `runInit`**

Create `scripts/research.test.ts`:

```ts
import { afterAll, beforeEach, describe, expect, it } from 'bun:test';
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { sql } from './lib/db.ts';
import { parseDocument } from './lib/frontmatter.ts';
import { runInit } from './research.ts';

let tmpRoot: string;

function setupTmpWorkspace(): string {
  const root = mkdtempSync(join(tmpdir(), 'wsos-research-test-'));
  mkdirSync(join(root, 'workspaces', 'second-brain', 'notes'), { recursive: true });
  mkdirSync(join(root, 'workspaces', 'second-brain', 'sources'), { recursive: true });
  mkdirSync(join(root, 'workspaces', 'second-brain', 'research'), { recursive: true });
  return root;
}

beforeEach(async () => {
  tmpRoot = setupTmpWorkspace();
  await sql`delete from items where slug like '2099-%-research-test-%'`;
  await sql`delete from agent_runs where skill_name = 'research' and summary like 'research-test-%'`;
});

afterAll(async () => {
  rmSync(tmpRoot, { recursive: true, force: true });
  await sql`delete from items where slug like '2099-%-research-test-%'`;
  await sql`delete from agent_runs where skill_name = 'research' and summary like 'research-test-%'`;
});

describe('runInit', () => {
  it('writes a landing page with frontmatter, plan, empty log, and empty synthesis', async () => {
    const result = await runInit(tmpRoot, {
      topic: 'research-test-bloom',
      workspace: 'second-brain',
      seedQuestions: ['Q1?', 'Q2?', 'Q3?'],
      budget: 5,
      dateOverride: '2099-01-01',
    });

    expect(result.session_path).toMatch(/research\/2099-01-01-research-test-bloom\.md$/);
    expect(result.slug).toBe('2099-01-01-research-test-bloom');
    expect(result.seed_questions).toEqual(['Q1?', 'Q2?', 'Q3?']);
    expect(result.budget).toBe(5);
    expect(result.agent_run_id).toMatch(/^[0-9a-f-]{36}$/);

    const abs = join(tmpRoot, result.session_path);
    expect(existsSync(abs)).toBe(true);
    const { frontmatter, body } = parseDocument(readFileSync(abs, 'utf8'));
    expect(frontmatter.type).toBe('research');
    expect(frontmatter.status).toBe('draft');
    expect(frontmatter.agent_run_id).toBe(result.agent_run_id);
    expect(frontmatter.budget).toBe(5);
    expect(body).toContain('## Plan');
    expect(body).toContain('1. Q1?');
    expect(body).toContain('## Iteration log');
    expect(body).toContain('## Synthesis');
  });

  it('creates an agent_runs row with status=started', async () => {
    const result = await runInit(tmpRoot, {
      topic: 'research-test-runs',
      workspace: 'second-brain',
      seedQuestions: ['A?'],
      budget: 5,
      dateOverride: '2099-01-02',
    });
    const rows = await sql<{ status: string }[]>`
      select status from agent_runs where id = ${result.agent_run_id}
    `;
    expect(rows[0]!.status).toBe('started');
  });

  it('indexes the landing page (items row exists, type=research)', async () => {
    const result = await runInit(tmpRoot, {
      topic: 'research-test-index',
      workspace: 'second-brain',
      seedQuestions: ['A?'],
      budget: 5,
      dateOverride: '2099-01-03',
    });
    const rows = await sql<{ type: string }[]>`
      select type from items where slug = ${result.slug}
    `;
    expect(rows.length).toBe(1);
    expect(rows[0]!.type).toBe('research');
  });

  it('rejects empty seedQuestions', async () => {
    let err: unknown;
    try {
      await runInit(tmpRoot, {
        topic: 'research-test-empty',
        workspace: 'second-brain',
        seedQuestions: [],
        budget: 5,
        dateOverride: '2099-01-04',
      });
    } catch (e) {
      err = e;
    }
    expect(err).toBeInstanceOf(Error);
    expect((err as Error).message).toContain('seed-questions');
  });

  it('disambiguates slug collision with -2 suffix', async () => {
    const opts = {
      topic: 'research-test-dup',
      workspace: 'second-brain',
      seedQuestions: ['A?'],
      budget: 5,
      dateOverride: '2099-01-05',
    };
    const first = await runInit(tmpRoot, opts);
    const second = await runInit(tmpRoot, opts);
    expect(first.slug).toBe('2099-01-05-research-test-dup');
    expect(second.slug).toBe('2099-01-05-research-test-dup-2');
  });
});
```

- [ ] **Step 4: Run tests to verify they fail**

Run: `bun test scripts/research.test.ts`
Expected: module-not-found error (research.ts doesn't exist yet).

- [ ] **Step 5: Implement `research.ts` with `runInit`**

Create `scripts/research.ts`:

```ts
import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { sql } from './lib/db.ts';
import { indexOneFile } from './indexer.ts';
import { FrontmatterSchema, stringifyDocument } from './lib/frontmatter.ts';
import { startRun } from './lib/runs.ts';
import { isValidSlug, slugify } from './lib/slug.ts';
import { findAnchorCandidates } from './lib/research-storage.ts';
import { extractKeywords } from './lib/research-scoring.ts';

export type InitOptions = {
  topic: string;
  workspace: string;
  seedQuestions: string[];
  budget?: number;
  dateOverride?: string; // YYYY-MM-DD, for tests
};

export type InitResult = {
  session_path: string;
  slug: string;
  seed_questions: string[];
  anchors_in_db: string[];
  agent_run_id: string;
  budget: number;
};

const MAX_SLUG_LEN = 40;

function dateSlug(topic: string, today: string, suffix: number): string {
  let base = slugify(topic);
  if (base.length > MAX_SLUG_LEN) {
    base = base.slice(0, MAX_SLUG_LEN).replace(/-+$/, '');
  }
  if (!isValidSlug(base)) {
    throw new Error(`Could not derive a valid slug from topic: "${topic}"`);
  }
  const tail = suffix > 1 ? `-${suffix}` : '';
  return `${today}-${base}${tail}`;
}

function buildLandingPage(opts: {
  slug: string;
  title: string;
  topic: string;
  seedQuestions: string[];
  anchors: string[];
  budget: number;
  agentRunId: string;
  today: string;
}): string {
  const tags = ['research-session', ...extractKeywords(opts.topic).slice(0, 4)];
  const fm = FrontmatterSchema.parse({
    slug: opts.slug,
    title: opts.title,
    type: 'research',
    status: 'draft',
    tags,
    links: opts.anchors.map((a) => `[[${a}]]`),
    source: null,
    confidence: 'medium',
    created: opts.today,
    updated: opts.today,
    agent_run_id: opts.agentRunId,
    budget: opts.budget,
  });
  const seedLines = opts.seedQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n');
  const anchorsLine = opts.anchors.length > 0
    ? opts.anchors.map((a) => `[[${a}]]`).join(', ')
    : '(none)';
  const body = `# ${opts.title}

**Topic:** ${opts.topic}
**Budget:** ${opts.budget} iterations

## Plan

Seed sub-questions:
${seedLines}

Anchors in DB: ${anchorsLine}

## Iteration log

## Synthesis

(pending)
`;
  return stringifyDocument(fm, body);
}

export async function runInit(repoRoot: string, opts: InitOptions): Promise<InitResult> {
  if (opts.seedQuestions.length === 0) {
    throw new Error('runInit: at least one seed-questions item is required');
  }
  const budget = opts.budget ?? 5;
  const today = opts.dateOverride ?? new Date().toISOString().slice(0, 10);

  // Slug collision check
  let suffix = 1;
  let slug = dateSlug(opts.topic, today, suffix);
  let relPath = join('workspaces', opts.workspace, 'research', `${slug}.md`).replaceAll('\\', '/');
  while (existsSync(join(repoRoot, relPath))) {
    suffix++;
    slug = dateSlug(opts.topic, today, suffix);
    relPath = join('workspaces', opts.workspace, 'research', `${slug}.md`).replaceAll('\\', '/');
  }
  const absPath = join(repoRoot, relPath);

  // Find anchor candidates by topic keywords
  const wsRows = await sql<{ id: string }[]>`
    select id from workspaces where slug = ${opts.workspace}
  `;
  if (wsRows.length === 0) {
    throw new Error(`Workspace not registered: ${opts.workspace}`);
  }
  const workspaceId = wsRows[0]!.id;
  const keywords = extractKeywords(opts.topic);
  const anchors = await findAnchorCandidates(workspaceId, keywords);

  // Start the agent_runs row
  const agentRunId = await startRun('research');

  // Compose + write
  const title = `${capitalize(opts.topic)} (research session)`;
  const content = buildLandingPage({
    slug,
    title,
    topic: opts.topic,
    seedQuestions: opts.seedQuestions,
    anchors,
    budget,
    agentRunId,
    today,
  });
  mkdirSync(dirname(absPath), { recursive: true });
  writeFileSync(absPath, content, 'utf8');

  // Index the new file
  await indexOneFile(absPath, repoRoot);

  return {
    session_path: relPath,
    slug,
    seed_questions: opts.seedQuestions,
    anchors_in_db: anchors,
    agent_run_id: agentRunId,
    budget,
  };
}

function capitalize(s: string): string {
  return s.length === 0 ? s : s[0]!.toUpperCase() + s.slice(1);
}

// CLI entry point (subcommand dispatch — fleshed out in later tasks)
if (import.meta.main) {
  const sub = process.argv[2];
  if (sub === 'init') {
    const opts = JSON.parse(process.argv[3] ?? '{}') as InitOptions;
    const result = await runInit(process.cwd(), opts);
    console.log(JSON.stringify(result));
    await sql.end();
  } else {
    console.error(`Usage: bun run scripts/research.ts <init|pick|log|finalize> --json '<args>'`);
    console.error(`Subcommands pick/log/finalize land in later tasks.`);
    process.exit(2);
  }
}
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `bun test scripts/research.test.ts`
Expected: 5 tests pass.

Run: `bun test` (full suite)
Expected: all tests pass — no regressions.

- [ ] **Step 7: Commit**

```bash
git add scripts/research.ts scripts/research.test.ts scripts/lib/research-junk-domains.txt workspaces/second-brain/research/.gitkeep
git commit -m "$(cat <<'EOF'
[research] runInit subcommand + landing-page writer

Derives slug, handles collision, queries anchor candidates from DB, writes
the landing-page skeleton (frontmatter + Plan + empty Iteration log +
empty Synthesis), starts the agent_runs row, indexes the new file inline.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: `research.ts log` subcommand

**Files:**
- Modify: `scripts/research.ts` (add `runLog` + wire to CLI)
- Modify: `scripts/research.test.ts` (add `runLog` tests)

- [ ] **Step 1: Write failing tests for `runLog`**

Append to `scripts/research.test.ts`:

```ts
import { runLog } from './research.ts';
import type { IterationEntry } from './lib/research-parse.ts';

describe('runLog', () => {
  it('appends an iteration entry, bumps updated, updates agent_runs.summary, re-indexes', async () => {
    const init = await runInit(tmpRoot, {
      topic: 'research-test-log',
      workspace: 'second-brain',
      seedQuestions: ['Q1?', 'Q2?'],
      budget: 5,
      dateOverride: '2099-02-01',
    });

    const entry: IterationEntry = {
      iteration: 1,
      sub_question: 'Q1?',
      picked_reason: 'highest info_gain',
      score: { info_gain: 9, gap_fill_bonus: 0, total: 9 },
      sources_captured: ['2099-02-01-fake-source'],
      notes_written: ['fake-note'],
      contradictions: [],
      status: 'kept',
    };

    const result = await runLog(tmpRoot, {
      sessionPath: init.session_path,
      entry,
    });
    expect(result.ok).toBe(true);
    expect(result.iteration_number).toBe(1);

    const md = readFileSync(join(tmpRoot, init.session_path), 'utf8');
    expect(md).toContain('### Iteration 1 — Q1?');
    expect(md).toContain('- **Status:** kept');

    const runs = await sql<{ summary: string | null }[]>`
      select summary from agent_runs where id = ${init.agent_run_id}
    `;
    expect(runs[0]!.summary).toContain('1 iter');
  });

  it('appends a second entry preserving the first', async () => {
    const init = await runInit(tmpRoot, {
      topic: 'research-test-log2',
      workspace: 'second-brain',
      seedQuestions: ['Q1?', 'Q2?'],
      budget: 5,
      dateOverride: '2099-02-02',
    });
    await runLog(tmpRoot, {
      sessionPath: init.session_path,
      entry: {
        iteration: 1,
        sub_question: 'Q1?',
        picked_reason: 'r',
        score: { info_gain: 9, gap_fill_bonus: 0, total: 9 },
        sources_captured: [],
        notes_written: [],
        contradictions: [],
        status: 'kept',
      },
    });
    await runLog(tmpRoot, {
      sessionPath: init.session_path,
      entry: {
        iteration: 2,
        sub_question: 'Q2?',
        picked_reason: 'r',
        score: { info_gain: 8.5, gap_fill_bonus: 0, total: 8.5 },
        sources_captured: [],
        notes_written: [],
        contradictions: [],
        status: 'low-signal',
      },
    });
    const md = readFileSync(join(tmpRoot, init.session_path), 'utf8');
    expect(md).toContain('### Iteration 1 — Q1?');
    expect(md).toContain('### Iteration 2 — Q2?');

    const runs = await sql<{ summary: string | null }[]>`
      select summary from agent_runs where id = ${init.agent_run_id}
    `;
    expect(runs[0]!.summary).toContain('2 iter');
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `bun test scripts/research.test.ts`
Expected: `runLog is not exported` or similar.

- [ ] **Step 3: Implement `runLog`**

Edit `scripts/research.ts`. Add imports near the top:

```ts
import { readFileSync } from 'node:fs';
import { parseDocument } from './lib/frontmatter.ts';
import { appendIterationToLandingPage, parseIterationLog, extractSection, type IterationEntry } from './lib/research-parse.ts';
import { updateRunSummary } from './lib/runs.ts';
```

Append before the `import.meta.main` block:

```ts
export type LogOptions = {
  sessionPath: string;   // relative to repoRoot
  entry: IterationEntry;
};

export type LogResult = {
  ok: true;
  iteration_number: number;
};

export async function runLog(repoRoot: string, opts: LogOptions): Promise<LogResult> {
  const absPath = join(repoRoot, opts.sessionPath);
  const raw = readFileSync(absPath, 'utf8');
  const { frontmatter } = parseDocument(raw);
  if (frontmatter.type !== 'research') {
    throw new Error(`runLog: session file is not type=research (${frontmatter.type})`);
  }

  const updated = appendIterationToLandingPage(raw, opts.entry);
  // Bump frontmatter `updated:` to today
  const today = new Date().toISOString().slice(0, 10);
  const reFm = /(^---\nslug:[\s\S]*?\nupdated:\s*['"]?)(\d{4}-\d{2}-\d{2})(['"]?)/;
  const withDate = updated.replace(reFm, (_, p1, _date, p3) => `${p1}${today}${p3}`);

  writeFileSync(absPath, withDate, 'utf8');
  await indexOneFile(absPath, repoRoot);

  // Update agent_runs.summary
  if (frontmatter.agent_run_id) {
    const log = parseIterationLog(extractSection(withDate, 'Iteration log'));
    await updateRunSummary(frontmatter.agent_run_id, `${log.length} iter${log.length === 1 ? '' : 's'} so far`);
  }

  return { ok: true, iteration_number: opts.entry.iteration };
}
```

Update the CLI dispatch at the bottom of `research.ts`. Replace the `if (import.meta.main) { ... }` block with:

```ts
if (import.meta.main) {
  const sub = process.argv[2];
  if (sub === 'init') {
    const opts = JSON.parse(process.argv[3] ?? '{}') as InitOptions;
    const result = await runInit(process.cwd(), opts);
    console.log(JSON.stringify(result));
  } else if (sub === 'log') {
    // args: --session <path> --json <iteration-obj>
    const args = parseFlagArgs(process.argv.slice(3));
    const result = await runLog(process.cwd(), {
      sessionPath: args.session!,
      entry: JSON.parse(args.json!),
    });
    console.log(JSON.stringify(result));
  } else {
    console.error(`Usage: bun run scripts/research.ts <init|log|pick|finalize> ...`);
    process.exit(2);
  }
  await sql.end();
}

function parseFlagArgs(argv: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i];
    const val = argv[i + 1];
    if (!key || !key.startsWith('--')) continue;
    out[key.slice(2)] = val ?? '';
  }
  return out;
}
```

- [ ] **Step 4: Run tests**

Run: `bun test scripts/research.test.ts`
Expected: all tests (including the new `runLog` ones) pass.

- [ ] **Step 5: Commit**

```bash
git add scripts/research.ts scripts/research.test.ts
git commit -m "$(cat <<'EOF'
[research] runLog subcommand

Appends an iteration entry to the landing page, bumps the frontmatter
updated date, re-indexes, updates agent_runs.summary with a running tally.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: `research.ts pick` subcommand

**Files:**
- Modify: `scripts/research.ts` (add `runPick`)
- Modify: `scripts/research.test.ts` (add `runPick` tests)

- [ ] **Step 1: Write failing tests for `runPick`**

Append to `scripts/research.test.ts`:

```ts
import { runPick } from './research.ts';

describe('runPick', () => {
  it('picks the top-scoring seed question on first iteration of a fresh session', async () => {
    const init = await runInit(tmpRoot, {
      topic: 'research-test-pick',
      workspace: 'second-brain',
      seedQuestions: ['Cheap question?', 'Foundational question?', 'Niche question?'],
      budget: 5,
      dateOverride: '2099-03-01',
    });
    const pick = await runPick(tmpRoot, { sessionPath: init.session_path });
    expect('skip' in pick).toBe(false);
    if ('sub_question' in pick) {
      // First seed question has highest info_gain (descending heuristic)
      expect(pick.sub_question).toBe('Cheap question?');
      expect(pick.scores.gap_fill_bonus).toBe(0);
    }
  });

  it('returns skip="exhausted" when all seed questions are covered and no unresolved links', async () => {
    const init = await runInit(tmpRoot, {
      topic: 'research-test-exhaust',
      workspace: 'second-brain',
      seedQuestions: ['Q1?', 'Q2?'],
      budget: 5,
      dateOverride: '2099-03-02',
    });
    await runLog(tmpRoot, {
      sessionPath: init.session_path,
      entry: {
        iteration: 1, sub_question: 'Q1?', picked_reason: 'r',
        score: { info_gain: 9, gap_fill_bonus: 0, total: 9 },
        sources_captured: [], notes_written: [], contradictions: [], status: 'kept',
      },
    });
    await runLog(tmpRoot, {
      sessionPath: init.session_path,
      entry: {
        iteration: 2, sub_question: 'Q2?', picked_reason: 'r',
        score: { info_gain: 8.5, gap_fill_bonus: 0, total: 8.5 },
        sources_captured: [], notes_written: [], contradictions: [], status: 'kept',
      },
    });
    const pick = await runPick(tmpRoot, { sessionPath: init.session_path });
    expect('skip' in pick).toBe(true);
    if ('skip' in pick) {
      expect(pick.skip).toBe('exhausted');
    }
  });

  it('surfaces an unresolved-link candidate when a session-created note has dangling links', async () => {
    const init = await runInit(tmpRoot, {
      topic: 'research-test-gap',
      workspace: 'second-brain',
      seedQuestions: ['Already-covered Q?'],
      budget: 5,
      dateOverride: '2099-03-03',
    });
    // Seed a session-created note with an unresolved link
    const wsRows = await sql<{ id: string }[]>`select id from workspaces where slug = 'second-brain'`;
    const workspaceId = wsRows[0]!.id;
    const noteRow = await sql<{ id: string }[]>`
      insert into items (workspace_id, slug, file_path, type, status, title, content_hash, confidence)
      values (${workspaceId}, '2099-03-03-research-test-gap-note',
              'workspaces/second-brain/notes/2099-03-03-research-test-gap-note.md',
              'note', 'durable', 'Note', 'hgap', 'high')
      returning id
    `;
    await sql`
      insert into links (from_item_id, to_slug, to_item_id)
      values (${noteRow[0]!.id}, '2099-test-dangling-target', null)
    `;
    // Mark the seed question as covered, then log it (so pick has only the unresolved-link candidate)
    await runLog(tmpRoot, {
      sessionPath: init.session_path,
      entry: {
        iteration: 1, sub_question: 'Already-covered Q?', picked_reason: 'r',
        score: { info_gain: 9, gap_fill_bonus: 0, total: 9 },
        sources_captured: [], notes_written: ['2099-03-03-research-test-gap-note'],
        contradictions: [], status: 'kept',
      },
    });

    const pick = await runPick(tmpRoot, { sessionPath: init.session_path });
    expect('sub_question' in pick).toBe(true);
    if ('sub_question' in pick) {
      expect(pick.sub_question).toContain('2099-test-dangling-target');
      expect(pick.scores.gap_fill_bonus).toBeGreaterThan(0);
    }

    // cleanup
    await sql`delete from items where slug = '2099-03-03-research-test-gap-note'`;
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `bun test scripts/research.test.ts`
Expected: `runPick is not exported`.

- [ ] **Step 3: Implement `runPick`**

Edit `scripts/research.ts`. Add imports:

```ts
import { buildCandidates, pickTopCandidate, type Candidate } from './lib/research-scoring.ts';
import { getUnresolvedLinkSlugs, isAlreadyCovered } from './lib/research-storage.ts';
import { parseSeedQuestions } from './lib/research-parse.ts';
```

Append before the CLI dispatch:

```ts
export type PickOptions = {
  sessionPath: string;
};

export type PickSuccess = {
  sub_question: string;
  scores: { info_gain: number; gap_fill_bonus: number; total: number };
  picked_reason: string;
  candidate_anchors: string[];
};

export type PickSkip = {
  skip: 'covered' | 'exhausted';
  reason: string;
  candidate?: { sub_question: string };
};

export type PickResult = PickSuccess | PickSkip;

export async function runPick(repoRoot: string, opts: PickOptions): Promise<PickResult> {
  const absPath = join(repoRoot, opts.sessionPath);
  const raw = readFileSync(absPath, 'utf8');
  const { frontmatter } = parseDocument(raw);
  if (frontmatter.type !== 'research') {
    throw new Error(`runPick: session file is not type=research (${frontmatter.type})`);
  }

  const planSection = extractSection(raw, 'Plan');
  const seedQuestions = parseSeedQuestions(planSection);
  const logEntries = parseIterationLog(extractSection(raw, 'Iteration log'));

  // Collect slugs of all notes written across all iterations so far (gap-fill source)
  const sessionNoteSlugs = logEntries.flatMap((e) => e.notes_written);
  const wsRows = await sql<{ id: string }[]>`
    select id from workspaces where slug = ${workspaceSlugFromSessionPath(opts.sessionPath)}
  `;
  if (wsRows.length === 0) {
    throw new Error(`runPick: workspace not found for session ${opts.sessionPath}`);
  }
  const workspaceId = wsRows[0]!.id;
  const unresolvedSlugs = await getUnresolvedLinkSlugs(workspaceId, sessionNoteSlugs);

  const candidates: Candidate[] = buildCandidates(seedQuestions, logEntries, unresolvedSlugs);
  if (candidates.length === 0) {
    return { skip: 'exhausted', reason: 'no remaining seed questions and no unresolved links' };
  }

  const top = pickTopCandidate(candidates)!;
  // Coverage check on the chosen candidate
  if (await isAlreadyCovered(workspaceId, top.keywords)) {
    return {
      skip: 'covered',
      reason: `>=3 high-confidence items already match ${JSON.stringify(top.keywords)}`,
      candidate: { sub_question: top.sub_question },
    };
  }

  return {
    sub_question: top.sub_question,
    scores: top.score,
    picked_reason: pickReason(top, logEntries.length),
    candidate_anchors: [],
  };
}

function pickReason(c: Candidate, iterIdx: number): string {
  if (c.kind === 'unresolved-link') {
    return `Resolves dangling [[link]] surfaced in earlier iteration (iter ${iterIdx})`;
  }
  return `Highest info_gain (${c.score.info_gain.toFixed(1)}) among remaining seed questions`;
}

function workspaceSlugFromSessionPath(rel: string): string {
  // rel like "workspaces/<ws>/research/<file>.md"
  const parts = rel.split(/[/\\]/);
  if (parts[0] !== 'workspaces' || !parts[1]) {
    throw new Error(`Unexpected session path: ${rel}`);
  }
  return parts[1];
}
```

Update the CLI dispatch to add the `pick` case:

```ts
  } else if (sub === 'pick') {
    const args = parseFlagArgs(process.argv.slice(3));
    const result = await runPick(process.cwd(), { sessionPath: args.session! });
    console.log(JSON.stringify(result));
```
(Insert before the `else` that prints usage.)

- [ ] **Step 4: Run tests**

Run: `bun test scripts/research.test.ts`
Expected: all tests pass (3 new `runPick` tests on top of init/log tests).

- [ ] **Step 5: Commit**

```bash
git add scripts/research.ts scripts/research.test.ts
git commit -m "$(cat <<'EOF'
[research] runPick subcommand

Parses the landing page, queries unresolved links surfaced by session-created
notes, builds candidates (seed + unresolved-link), runs the coverage check,
returns top candidate or skip='covered'|'exhausted'.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 10: `research.ts finalize` subcommand

**Files:**
- Modify: `scripts/research.ts` (add `runFinalize`)
- Modify: `scripts/research.test.ts` (add `runFinalize` tests)

- [ ] **Step 1: Write failing tests**

Append to `scripts/research.test.ts`:

```ts
import { runFinalize } from './research.ts';

describe('runFinalize', () => {
  it('flips agent_runs to succeeded, writes summary, bumps landing page to durable', async () => {
    const init = await runInit(tmpRoot, {
      topic: 'research-test-final',
      workspace: 'second-brain',
      seedQuestions: ['Q?'],
      budget: 5,
      dateOverride: '2099-04-01',
    });
    await runLog(tmpRoot, {
      sessionPath: init.session_path,
      entry: {
        iteration: 1, sub_question: 'Q?', picked_reason: 'r',
        score: { info_gain: 9, gap_fill_bonus: 0, total: 9 },
        sources_captured: ['s1'], notes_written: ['n1', 'n2'],
        contradictions: [], status: 'kept',
      },
    });

    const result = await runFinalize(tmpRoot, {
      sessionPath: init.session_path,
      status: 'succeeded',
    });
    expect(result.ok).toBe(true);
    expect(result.summary).toContain('1 iter');
    expect(result.summary).toContain('2 notes');

    const md = readFileSync(join(tmpRoot, init.session_path), 'utf8');
    const { frontmatter } = parseDocument(md);
    expect(frontmatter.status).toBe('durable');

    const runs = await sql<{ status: string; summary: string | null }[]>`
      select status, summary from agent_runs where id = ${init.agent_run_id}
    `;
    expect(runs[0]!.status).toBe('succeeded');
    expect(runs[0]!.summary).toBe(result.summary);
  });

  it('finalize(failed) flips agent_runs to failed and keeps landing page status=draft', async () => {
    const init = await runInit(tmpRoot, {
      topic: 'research-test-final-fail',
      workspace: 'second-brain',
      seedQuestions: ['Q?'],
      budget: 5,
      dateOverride: '2099-04-02',
    });
    const result = await runFinalize(tmpRoot, {
      sessionPath: init.session_path,
      status: 'failed',
      error: 'firecrawl-timeout',
    });
    expect(result.ok).toBe(true);

    const md = readFileSync(join(tmpRoot, init.session_path), 'utf8');
    const { frontmatter } = parseDocument(md);
    expect(frontmatter.status).toBe('draft');

    const runs = await sql<{ status: string; error: string | null }[]>`
      select status, error from agent_runs where id = ${init.agent_run_id}
    `;
    expect(runs[0]!.status).toBe('failed');
    expect(runs[0]!.error).toBe('firecrawl-timeout');
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `bun test scripts/research.test.ts`
Expected: `runFinalize is not exported`.

- [ ] **Step 3: Implement `runFinalize`**

Edit `scripts/research.ts`. Add import:

```ts
import { finalizeRun } from './lib/runs.ts';
```

Append before the CLI dispatch:

```ts
export type FinalizeOptions = {
  sessionPath: string;
  status: 'succeeded' | 'failed';
  error?: string;
};

export type FinalizeResult = {
  ok: true;
  summary: string;
};

export async function runFinalize(
  repoRoot: string,
  opts: FinalizeOptions,
): Promise<FinalizeResult> {
  const absPath = join(repoRoot, opts.sessionPath);
  const raw = readFileSync(absPath, 'utf8');
  const { frontmatter } = parseDocument(raw);
  if (frontmatter.type !== 'research') {
    throw new Error(`runFinalize: session file is not type=research (${frontmatter.type})`);
  }
  if (!frontmatter.agent_run_id) {
    throw new Error('runFinalize: session frontmatter is missing agent_run_id');
  }

  const logEntries = parseIterationLog(extractSection(raw, 'Iteration log'));
  const totalIters = logEntries.length;
  const totalNotes = new Set(logEntries.flatMap((e) => e.notes_written)).size;
  const totalContradictions = logEntries.reduce((s, e) => s + e.contradictions.length, 0);
  const openQs = countOpenQuestions(raw);
  const summary = `${totalIters} iter${totalIters === 1 ? '' : 's'}, ${totalNotes} note${totalNotes === 1 ? '' : 's'}, ${totalContradictions} contradiction${totalContradictions === 1 ? '' : 's'}, ${openQs} open Q${openQs === 1 ? '' : 's'}`;

  await finalizeRun(
    frontmatter.agent_run_id,
    opts.status,
    summary,
    opts.error ?? null,
    null,
  );

  // On success only, bump landing-page status to durable
  if (opts.status === 'succeeded') {
    const updated = raw.replace(
      /(^---\nslug:[\s\S]*?\nstatus:\s*['"]?)(draft)(['"]?)/,
      (_, p1, _s, p3) => `${p1}durable${p3}`,
    );
    writeFileSync(absPath, updated, 'utf8');
    await indexOneFile(absPath, repoRoot);
  }

  return { ok: true, summary };
}

function countOpenQuestions(raw: string): number {
  const synth = extractSection(raw, 'Synthesis');
  const idx = synth.indexOf('Open questions');
  if (idx === -1) return 0;
  const tail = synth.slice(idx);
  return (tail.match(/^- /gm) ?? []).length;
}
```

Update CLI dispatch — add `finalize` case before the `else` usage line:

```ts
  } else if (sub === 'finalize') {
    const args = parseFlagArgs(process.argv.slice(3));
    const result = await runFinalize(process.cwd(), {
      sessionPath: args.session!,
      status: args.status as 'succeeded' | 'failed',
      error: args.error,
    });
    console.log(JSON.stringify(result));
```

- [ ] **Step 4: Run tests**

Run: `bun test scripts/research.test.ts`
Expected: all tests pass.

Run: `bun test` (full suite) to confirm no regressions.

- [ ] **Step 5: Commit**

```bash
git add scripts/research.ts scripts/research.test.ts
git commit -m "$(cat <<'EOF'
[research] runFinalize subcommand

Aggregates iteration log into a summary, calls finalizeRun on agent_runs,
bumps landing-page status from draft to durable on success.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 11: Full-loop integration test

**Files:**
- Create: `scripts/research.integration.test.ts`

- [ ] **Step 1: Write the integration test**

Create `scripts/research.integration.test.ts`:

```ts
import { afterAll, beforeEach, describe, expect, it } from 'bun:test';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { sql } from './lib/db.ts';
import { runInit, runPick, runLog, runFinalize } from './research.ts';
import { captureItem } from './capture.ts';
import { parseDocument } from './lib/frontmatter.ts';
import { extractSection, parseIterationLog } from './lib/research-parse.ts';

let tmpRoot: string;

beforeEach(async () => {
  tmpRoot = mkdtempSync(join(tmpdir(), 'wsos-research-int-'));
  mkdirSync(join(tmpRoot, 'workspaces', 'second-brain', 'notes'), { recursive: true });
  mkdirSync(join(tmpRoot, 'workspaces', 'second-brain', 'sources'), { recursive: true });
  mkdirSync(join(tmpRoot, 'workspaces', 'second-brain', 'research'), { recursive: true });
  await sql`delete from items where slug like '2099-99-%'`;
  await sql`delete from items where slug like 'integ-note-%'`;
  await sql`delete from agent_runs where skill_name = 'research'
            and (summary is null or summary like '%2099-99%')`;
});

afterAll(async () => {
  rmSync(tmpRoot, { recursive: true, force: true });
  await sql`delete from items where slug like '2099-99-%' or slug like 'integ-note-%'`;
});

describe('research full-loop integration (no firecrawl)', () => {
  it('init → 5x(pick→capture→log) → finalize produces expected DB + file state', async () => {
    const init = await runInit(tmpRoot, {
      topic: 'integ test topic',
      workspace: 'second-brain',
      seedQuestions: ['Q1?', 'Q2?', 'Q3?', 'Q4?', 'Q5?'],
      budget: 5,
      dateOverride: '2099-99-01',
    });

    for (let i = 1; i <= 5; i++) {
      const pick = await runPick(tmpRoot, { sessionPath: init.session_path });
      if ('skip' in pick) {
        // accept skip as a valid early exit; record it and move on
        await runLog(tmpRoot, {
          sessionPath: init.session_path,
          entry: {
            iteration: i,
            sub_question: 'skip-' + i,
            picked_reason: pick.reason,
            score: { info_gain: 0, gap_fill_bonus: 0, total: 0 },
            sources_captured: [],
            notes_written: [],
            contradictions: [],
            status: 'skipped',
          },
        });
        continue;
      }

      // Simulate "research did its thing": write one note + one source via captureItem
      const noteSlug = `integ-note-${i}`;
      await captureItem(tmpRoot, {
        workspace: 'second-brain',
        slug: noteSlug,
        title: `Integ Note ${i}`,
        type: 'note',
        status: 'durable',
        tags: ['integ'],
        links: ['[[integ-dangling-target]]'],
        confidence: 'high',
        body: `Body for iter ${i} on ${pick.sub_question}`,
      });

      await runLog(tmpRoot, {
        sessionPath: init.session_path,
        entry: {
          iteration: i,
          sub_question: pick.sub_question,
          picked_reason: pick.picked_reason,
          score: pick.scores,
          sources_captured: [],
          notes_written: [noteSlug],
          contradictions: [],
          status: 'kept',
        },
      });
    }

    // Synthesize section (LLM-driven in production — here we just write a stub)
    const md = readFileSync(join(tmpRoot, init.session_path), 'utf8');
    const synthBody = `Found 5 notes.\n\n### Notes added this session\n- [[integ-note-1]]\n- [[integ-note-2]]\n\n### Open questions\n- still-unknown-q`;
    writeFileSync(
      join(tmpRoot, init.session_path),
      md.replace(/## Synthesis\n\n\(pending\)/, `## Synthesis\n\n${synthBody}`),
      'utf8',
    );

    const final = await runFinalize(tmpRoot, {
      sessionPath: init.session_path,
      status: 'succeeded',
    });

    // Assert: landing page has 5 entries, status=durable, agent_runs=succeeded
    const finalMd = readFileSync(join(tmpRoot, init.session_path), 'utf8');
    const { frontmatter } = parseDocument(finalMd);
    expect(frontmatter.status).toBe('durable');

    const entries = parseIterationLog(extractSection(finalMd, 'Iteration log'));
    expect(entries.length).toBe(5);

    const runs = await sql<{ status: string; summary: string | null }[]>`
      select status, summary from agent_runs where id = ${init.agent_run_id}
    `;
    expect(runs[0]!.status).toBe('succeeded');
    expect(runs[0]!.summary).toBe(final.summary);

    // Assert: by iteration 3 or later, gap_fill_bonus on at least one pick should be > 0
    // (because integ-note-1 introduced an unresolved [[integ-dangling-target]] link)
    const gapFillSeen = entries.some((e) => e.score.gap_fill_bonus > 0);
    expect(gapFillSeen).toBe(true);

    // Cleanup notes
    await sql`delete from items where slug like 'integ-note-%'`;
  });
});
```

- [ ] **Step 2: Run the integration test**

Run: `bun test scripts/research.integration.test.ts`
Expected: PASS — 5 iterations logged, gap_fill_bonus appears in at least one entry, final state correct.

- [ ] **Step 3: Run full test suite**

Run: `bun test`
Expected: every test file passes. Take note of any flake — re-run once if a single test fails in isolation (DB-state races between concurrent suites should not happen given the unique `2099-` and `integ-` prefixes, but verify).

- [ ] **Step 4: Commit**

```bash
git add scripts/research.integration.test.ts
git commit -m "$(cat <<'EOF'
[research] full-loop integration test

Exercises init → 5x(pick→capture→log) → finalize end-to-end without
firecrawl. Verifies: 5 iteration entries, gap_fill_bonus surfaces by
iter 3 from session-created unresolved [[link]], final agent_runs row
is succeeded, landing page status=durable.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 12: SKILL.md

**Files:**
- Create: `.claude/skills/research/SKILL.md`

- [ ] **Step 1: Write the SKILL manifest**

Create `.claude/skills/research/SKILL.md`:

```markdown
---
name: research
description: Use when user says "research <topic>", "deep-research <topic>", "/research <topic>", or otherwise wants to autonomously enrich the wiki on a topic. Adaptive 5-iteration loop that picks sub-questions by info-gain + gap-fill score, captures sources via firecrawl, distills atomic notes, ends with a hub-note synthesis.
---

# Research skill

## When to invoke

Trigger phrases: "research <topic>", "deep research", "deep-research", "/research <topic>", "investigate <topic> and add notes", or when invoked via `/loop /research <topic>`.

If the user only said "find me X" or "what do I know about X" — that's the `query` skill, not this one. Research is for *writing new notes*, not just answering.

## Inputs you need from the user (ask if missing)

1. **Topic** — the thing to research, in 3-10 words.
2. **Workspace hint** (optional). Default: `second-brain` if only one workspace exists.
3. **Budget override** (optional). Default: 5 iterations.

## Pipeline

### Step 0: Generate seed sub-questions

Before calling `init`, propose 3-5 sub-questions that decompose the topic. Examples for "Bloom filter":
1. What is a Bloom filter and what problem does it solve?
2. What is the false-positive rate formula?
3. How does a counting Bloom filter differ from a standard one?
4. Where are Bloom filters used in practice?
5. What are alternatives (Cuckoo, quotient, xor)?

Aim for: one foundational, one mechanistic, one applied, one comparative. Keep questions atomic (one concept each).

### Step 1: INIT

```bash
bun run scripts/research.ts init --json '{
  "topic": "<topic>",
  "workspace": "second-brain",
  "seedQuestions": ["Q1?", "Q2?", ...],
  "budget": 5
}'
```

Read back the JSON output: `{ session_path, slug, seed_questions, anchors_in_db, agent_run_id, budget }`.

### Step 2: LOOP (1..budget)

For each iteration `i`:

**a. PICK**

```bash
bun run scripts/research.ts pick --session <session_path>
```

Output is either:
- `{ sub_question, scores, picked_reason, candidate_anchors }` — proceed
- `{ skip: "covered", candidate, reason }` — log a skipped iteration and re-pick (cap: 2 consecutive skips, then accept anyway)
- `{ skip: "exhausted", reason }` — break the loop early; go to step 3

**b. RESEARCH** (the LLM part — only when pick returned a sub_question)

Run firecrawl-search for the sub_question:
```
firecrawl-search "<sub_question>"  (limit: 3)
```

For each of the top 3 results:
- Check the URL's domain against `scripts/lib/research-junk-domains.txt` — if it matches, skip
- Run `firecrawl-scrape` on the URL
- If extracted body < 800 chars or has < 3 paragraphs of >= 100 chars → discard this result
- If at least 1 result survives, invoke the `capture` skill to write each as `type=source`. If all 3 fail → log iteration with `status="low-signal"` and continue (do NOT spend a retry on a fresh search)

If at least one source was captured, distill 1-2 atomic notes from them. For each note, invoke the `capture` skill with:
- `type=note`
- `confidence=high` if the note has clear support from a captured source AND links to an existing anchor; `medium` otherwise
- `links` include `[[<source-slug>]]` and any anchor slugs from `anchors_in_db`

If you detect a contradiction between two sources during distillation: capture both sources, write notes with `status=draft, confidence=medium`, and record the contradiction in the iteration entry below.

**c. LOG**

```bash
bun run scripts/research.ts log --session <session_path> --json '{
  "iteration": <i>,
  "sub_question": "<sub_question>",
  "picked_reason": "<from pick>",
  "score": {"info_gain": X.X, "gap_fill_bonus": Y, "total": Z.Z},
  "sources_captured": ["<slug>", ...],
  "notes_written": ["<slug>", ...],
  "contradictions": [{"note_slug": "<slug>", "conflicts_with": "<slug>", "summary": "<one-sentence>"}],
  "status": "kept" | "skipped" | "low-signal" | "error"
}'
```

### Step 3: SYNTHESIZE

Open the landing page at `<session_path>`. Use the Edit tool to replace the `## Synthesis` section body (currently `(pending)`) with:

1. A 3-6 sentence answer to the original topic, weaving in `[[note-slug]]` citations to notes created this session
2. A `### Notes added this session` subsection — bulleted list of every note slug created across iterations
3. A `### Open questions` subsection — bullets for sub-questions that weren't covered + any contradictions left unresolved

### Step 4: FINALIZE

```bash
bun run scripts/research.ts finalize --session <session_path> --status succeeded
```

Flips `agent_runs` to `succeeded`, writes the final summary, bumps landing-page `status` from `draft` to `durable`.

On unrecoverable error (firecrawl down, fatal script crash), call:

```bash
bun run scripts/research.ts finalize --session <session_path> --status failed --error "<msg>"
```

## Output

Tell the user:
- Path to the landing page
- Iteration count + notes-written count + contradictions count
- Open questions (so they know what's left)
- One sentence on whether the gap-fill bonus surfaced (i.e. the loop self-healed its own graph)

## Edge cases

- **`/loop /research <topic>`** — same skill, no behavior change. The loop plugin handles pacing.
- **Slug collision** — `init` automatically disambiguates with `-2`, `-3` suffix. Don't pre-empt this.
- **All 5 iterations return `skip="covered"`** — accept the third skip's candidate anyway (don't burn the whole session on skip).
- **Firecrawl API key missing or rate-limited** — call `finalize --status failed --error "firecrawl: <message>"` and stop. Don't half-process iterations.
- **User runs `/research` on a topic with zero existing anchors** — `anchors_in_db` is empty; gap-fill bonus will be 0 in iteration 1. That's expected; the loop is bootstrapping the topic.

## Notes for the LLM driving the loop

- You are the one who calls firecrawl and capture. The script handles state. Don't try to make the script do firecrawl.
- Each subcommand returns JSON to stdout. Parse it and act on it. Don't re-read the landing page yourself to figure out state — that's what `pick` is for.
- Stay autonomous through iterations 1-5. Don't ask "should I continue?" — proceed unless the script returns an error.
- When in doubt about a sub-question being too vague: skip the iteration with `status="skipped"` and let `pick` choose differently next time.
```

- [ ] **Step 2: Verify the skill registers**

There's nothing to test here directly — skills are loaded by Claude Code at session start. The file must exist with valid YAML frontmatter for the skill list to include it. We'll exercise it via the smoke test in Task 14.

Sanity-check the YAML parses:

```bash
bun -e "import matter from 'gray-matter'; const r = matter(await Bun.file('.claude/skills/research/SKILL.md').text()); console.log(r.data); if (!r.data.name || !r.data.description) process.exit(1);"
```

Expected output: `{ name: 'research', description: 'Use when user says...' }`. Exit 0.

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/research/SKILL.md
git commit -m "$(cat <<'EOF'
[research] SKILL.md — adaptive wiki-enrichment loop

Drives the high-level loop: generate seed questions, init → loop(pick →
firecrawl+capture → log) → synthesize → finalize. Subcommand contracts
match scripts/research.ts.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 13: Documentation updates

**Files:**
- Modify: `workspaces/second-brain/README.md`
- Modify: `workspaces/second-brain/CLAUDE.md`

- [ ] **Step 1: Update second-brain README**

Edit `workspaces/second-brain/README.md`. Replace the "Lifecycle folders" section with:

```markdown
## Lifecycle folders

- `inbox/` — raw, untriaged captures (low/medium confidence)
- `sources/` — external content cached locally (firecrawl scrapes, PDF extracts, chat exports)
- `notes/` — durable atomic notes (concept-named, no date prefix)
- `decisions/` — meta-decisions about how the brain itself is organized
- `research/` — per-session research landing pages (date-prefixed, `type=research`)
- `archive/` — demoted but preserved
```

- [ ] **Step 2: Update second-brain CLAUDE.md**

Edit `workspaces/second-brain/CLAUDE.md`. Find the "Skills active here" section and replace it with:

```markdown
## Skills active here

- `capture`, `query`, `triage-inbox`, `weekly-review`, `distill-chat`, `index-rebuild`, `research`.
```

Also update the "Naming" section — add a third bullet:

```markdown
## Naming

- Notes: concept-named, no date prefix. `notes/llm-wiki-pattern.md`.
- Sources/inbox/decisions/archive: date-prefixed. `sources/2026-05-12-karpathy-zero-to-hero.md`.
- Research sessions: date-prefixed, in `research/`. `research/2026-05-13-rag-evaluation.md`.
```

- [ ] **Step 3: Commit**

```bash
git add workspaces/second-brain/README.md workspaces/second-brain/CLAUDE.md
git commit -m "$(cat <<'EOF'
[docs] document research/ folder and research skill in second-brain

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 14: Smoke test on a real topic

**Files:** none (manual verification)

- [ ] **Step 1: Run the smoke test**

Trigger the skill from a Claude Code prompt:

```
/research what is a Bloom filter
```

Expected flow (~5-10 minutes wall clock):
- Skill generates 3-5 seed questions
- 5 iterations run; each fires firecrawl-search → firecrawl-scrape → capture
- Landing page created at `workspaces/second-brain/research/<YYYY-MM-DD>-bloom-filter.md`
- 3-8 atomic notes appear under `workspaces/second-brain/notes/`
- 3-8 source items appear under `workspaces/second-brain/sources/`
- `## Synthesis` section is populated with `[[note-slug]]` citations
- A line gets appended to `STATE.md` by the Stop hook

- [ ] **Step 2: Verify the success criteria from spec §9**

Run these checks at the database level:

```bash
# Landing page indexed
bun -e "import {sql} from './scripts/lib/db.ts'; const r = await sql\`select slug, type, status from items where type = 'research' order by created_at desc limit 1\`; console.log(r); await sql.end();"
```
Expected: one row, `type=research`, `status=durable`.

```bash
# agent_runs row succeeded
bun -e "import {sql} from './scripts/lib/db.ts'; const r = await sql\`select status, summary from agent_runs where skill_name = 'research' order by started_at desc limit 1\`; console.log(r); await sql.end();"
```
Expected: `status=succeeded`, summary like `"5 iters, 5 notes, 0 contradictions, 1 open Q"`.

```bash
# Notes were written and indexed
bun -e "import {sql} from './scripts/lib/db.ts'; const r = await sql\`select count(*) from items where created_at > now() - interval '15 minutes' and type in ('note','source')\`; console.log(r); await sql.end();"
```
Expected: count >= 6.

```bash
# Gap-fill bonus surfaced (verify by reading the landing page)
grep -E '^- \*\*Score:\*\* info_gain=.* gap_fill=([1-9]|10)' workspaces/second-brain/research/*bloom-filter*.md
```
Expected: at least one match (gap_fill_bonus > 0 in at least one iteration).

- [ ] **Step 3: Run the failure-mode smoke test (optional)**

To exercise the low-signal path, run `/research <obscure topic likely to hit paywalls>` once (e.g., "internal Goldman Sachs prop trading metrics 2024"). Expected: at least one iteration logs `status="low-signal"` without crashing the loop. Iteration count may be < 5 due to early `skip="exhausted"` — that's acceptable.

- [ ] **Step 4: No commit needed**

The smoke test produces workspace content (notes/sources/research files) which are user-knowledge artifacts, not implementation. Commit them separately if the user wants to keep them, otherwise leave them — the smoke test is verified by the DB state and the existence of the landing page.

- [ ] **Step 5: Update STATE.md with completion line**

If the task chain ends with a successful smoke test, append to `STATE.md`:

```markdown
- <YYYY-MM-DD>: research skill shipped — smoke test: bloom-filter (N iters, M notes)
```

Commit:

```bash
git add STATE.md
git commit -m "$(cat <<'EOF'
[bootstrap] record research skill ship + smoke test result

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Self-review

**Spec coverage check:**

| Spec § | Requirement | Covered by |
|---|---|---|
| 2.1 | New SKILL.md | Task 12 |
| 2.1 | scripts/research.ts with init/pick/log subcommands | Tasks 7-10 (init/log/pick/finalize) |
| 2.1 | Migration for items.type 'research' | Task 1 |
| 2.1 | Zod schema update | Task 1 |
| 2.1 | New research/ folder + docs | Task 7 (folder), Task 13 (docs) |
| 2.1 | Unit + integration tests | Tasks 4-11 (each new module gets tests; Task 11 = integration) |
| 2.1 | Bundled capture.ts fix | Task 3 |
| 3.3 | finalize subcommand | Task 10 |
| 3.4 | Landing-page format | Task 7 buildLandingPage + Task 4 fixtures |
| 4.1 | Migration SQL | Task 1 |
| 4.3 | isAlreadyCovered helper | Task 6 |
| 4.4 | indexOneFile inline after every write | Tasks 3, 7, 8, 10 (each call site) |
| 5.1 | Coverage check → skip="covered" | Task 9 (runPick) |
| 5.1 | Exhausted → skip="exhausted" | Task 9 (runPick) |
| 5.1 | Low-signal handling | SKILL.md (Task 12) |
| 5.1 | Contradictions logged not auto-filed | SKILL.md (Task 12) + parse format (Task 4) |
| 5.3 | One agent_runs row across subcommands via agent_run_id in frontmatter | Tasks 7, 8, 10 |
| 5.3 | startRun/updateRunSummary/finalizeRun exports | Task 2 |
| 7.1 | Unit tests | Tasks 4-6 |
| 7.2 | Integration test | Task 11 |
| 7.3 | Smoke test | Task 14 |

**Placeholder check:** all code blocks contain real implementations; no TBD/TODO; all function signatures used in later tasks are defined in earlier tasks. The optional `--llm-rerank` flag mentioned in spec §3.3 (`pick` subcommand) is intentionally not implemented in v1 — the design notes it as "may override" not "must implement." Leaving as deferred matches spec scope.

**Type consistency:** `IterationEntry`, `Candidate`, `InitResult`, `PickResult`, `LogResult`, `FinalizeResult` are all defined once and imported by name. The `parseFlagArgs` helper is defined once in `research.ts` (Task 8) and used by all subcommands. `extractKeywords` is defined in Task 5 (`research-scoring.ts`) and used by Task 7 (`init`'s landing-page tagging) and Task 9 (`pick`'s coverage check).

**One known caveat:** Task 6 has two candidate implementations of `findAnchorCandidates` — the simpler postgres.js fragment-composition form is the preferred one. The plan flags this explicitly.

---

**Plan complete and saved to `docs/superpowers/plans/2026-05-13-research-skill.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
