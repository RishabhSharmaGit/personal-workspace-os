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
    process.exit(2);
  }
}
