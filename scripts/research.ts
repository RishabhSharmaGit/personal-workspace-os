import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { sql } from './lib/db.ts';
import { indexOneFile } from './indexer.ts';
import { FrontmatterSchema, stringifyDocument, parseDocument } from './lib/frontmatter.ts';
import { startRun, updateRunSummary, finalizeRun } from './lib/runs.ts';
import { isValidSlug, slugify } from './lib/slug.ts';
import { findAnchorCandidates, getUnresolvedLinkSlugs, isAlreadyCovered } from './lib/research-storage.ts';
import {
  extractKeywords,
  buildCandidates,
  pickTopCandidate,
  type Candidate,
} from './lib/research-scoring.ts';
import {
  appendIterationToLandingPage,
  parseIterationLog,
  extractSection,
  parseSeedQuestions,
  type IterationEntry,
} from './lib/research-parse.ts';

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

function workspaceSlugFromSessionPath(rel: string): string {
  const parts = rel.split(/[/\\]/);
  if (parts[0] !== 'workspaces' || !parts[1]) {
    throw new Error(`Unexpected session path: ${rel}`);
  }
  return parts[1];
}

function pickReason(c: Candidate, iterIdx: number): string {
  if (c.kind === 'unresolved-link') {
    return `Resolves dangling [[link]] surfaced in earlier iteration (iter ${iterIdx})`;
  }
  return `Highest info_gain (${c.score.info_gain.toFixed(1)}) among remaining seed questions`;
}

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
  const wsSlug = workspaceSlugFromSessionPath(opts.sessionPath);
  const wsRows = await sql<{ id: string }[]>`
    select id from workspaces where slug = ${wsSlug}
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
  const reFm = /(updated:\s*['"]?)(\d{4}-\d{2}-\d{2})(['"]?)/;
  const withDate = updated.replace(reFm, (_, p1, _date, p3) => `${p1}${today}${p3}`);

  writeFileSync(absPath, withDate, 'utf8');
  await indexOneFile(absPath, repoRoot);

  // Update agent_runs.summary
  if (frontmatter.agent_run_id) {
    const log = parseIterationLog(extractSection(withDate, 'Iteration log'));
    await updateRunSummary(
      frontmatter.agent_run_id,
      `${log.length} iter${log.length === 1 ? '' : 's'} so far`,
    );
  }

  return { ok: true, iteration_number: opts.entry.iteration };
}

export type FinalizeOptions = {
  sessionPath: string;
  status: 'succeeded' | 'failed';
  error?: string;
};

export type FinalizeResult = {
  ok: true;
  summary: string;
};

function countOpenQuestions(raw: string): number {
  const synth = extractSection(raw, 'Synthesis');
  const idx = synth.indexOf('Open questions');
  if (idx === -1) return 0;
  const tail = synth.slice(idx);
  return (tail.match(/^- /gm) ?? []).length;
}

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
  );

  // On success only, bump landing-page status to durable
  if (opts.status === 'succeeded') {
    const updated = raw.replace(
      /^(status:\s*)draft(\s*$)/m,
      '$1durable$2',
    );
    writeFileSync(absPath, updated, 'utf8');
    await indexOneFile(absPath, repoRoot);
  }

  return { ok: true, summary };
}

// CLI entry point
if (import.meta.main) {
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

  const sub = process.argv[2];
  if (sub === 'init') {
    const opts = JSON.parse(process.argv[3] ?? '{}') as InitOptions;
    const result = await runInit(process.cwd(), opts);
    console.log(JSON.stringify(result));
  } else if (sub === 'log') {
    const args = parseFlagArgs(process.argv.slice(3));
    const result = await runLog(process.cwd(), {
      sessionPath: args.session!,
      entry: JSON.parse(args.json!),
    });
    console.log(JSON.stringify(result));
  } else if (sub === 'pick') {
    const args = parseFlagArgs(process.argv.slice(3));
    const result = await runPick(process.cwd(), { sessionPath: args.session! });
    console.log(JSON.stringify(result));
  } else if (sub === 'finalize') {
    const args = parseFlagArgs(process.argv.slice(3));
    const result = await runFinalize(process.cwd(), {
      sessionPath: args.session!,
      status: args.status as 'succeeded' | 'failed',
      error: args.error,
    });
    console.log(JSON.stringify(result));
  } else {
    console.error(`Usage: bun run scripts/research.ts <init|log|pick|finalize> ...`);
    process.exit(2);
  }
  await sql.end();
}
