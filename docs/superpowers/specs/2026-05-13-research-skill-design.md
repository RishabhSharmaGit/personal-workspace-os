---
title: Research skill — autonomous wiki-enrichment loop
date: 2026-05-13
status: draft
authors: [rishabh, claude]
supersedes: none
related:
  - docs/superpowers/specs/2026-05-12-personal-workspace-os-bootstrap-design.md
---

# Research skill — autonomous wiki-enrichment loop

## 1. Overview

A new `research` skill for the Workspace OS that adapts Karpathy's [autoresearch](https://github.com/karpathy/autoresearch) ideology — autonomous loop, atomic increments, keep/discard — from ML training experiments to **topic/knowledge research**. The skill takes a topic, runs a bounded adaptive loop (default 5 iterations), and durably enriches the second-brain wiki with atomic notes, cited sources, and resolved `[[wikilinks]]`.

### 1.1 Why this exists

The Workspace OS bootstrap (see related design doc) gave us capture, query, triage, and weekly review — primitives for *passively* growing a wiki when the user feeds it material. What's missing is an *active* mode: pick a topic, autonomously seek and distill information until the wiki is meaningfully denser around that topic.

Karpathy's autoresearch repo can't be used directly — it's an autonomous ML training loop optimizing validation bits-per-byte, requires an NVIDIA GPU, and edits `train.py`. But the ideology ports cleanly:

| Karpathy's loop | This skill |
|---|---|
| Mutate `train.py` | Pick highest-value sub-question |
| Run 5-min training | firecrawl-search → scrape → distill |
| Measure `val_bpb` | Score: info-gain + gap-fill bonus |
| Keep / discard | Log atomic notes / log low-signal |
| Loop forever | Loop N iterations (default 5) |

### 1.2 Design constraints (locked in via brainstorming)

| Decision | Value |
|---|---|
| Philosophy | Wiki enrichment (Karpathy-wiki style — durable atomic notes are the artifact) |
| Budget | 5 iterations then synthesize (overridable via `--budget`) |
| Pick logic | Adaptive — each iteration scores candidates against current wiki state |
| Coverage metric | LLM info-gain (primary) + DB-derived gap-fill bonus (resolves unresolved `[[links]]`) |
| Storage shape | New lifecycle folder `workspaces/<ws>/research/`; one date-prefixed `.md` per session |
| Robustness | Moderate — pre-flight coverage check, single retry on low-signal source, flag contradictions in log |
| Controller | Thin TypeScript script (`scripts/research.ts`) handles deterministic state; SKILL.md drives loop |

## 2. Scope

### 2.1 In scope

- New skill at `.claude/skills/research/SKILL.md`
- New script at `scripts/research.ts` with three subcommands: `init`, `pick`, `log`
- One DB migration to add `'research'` to `items.type` CHECK constraint
- Update `scripts/lib/frontmatter.ts` Zod schema to include `'research'`
- New lifecycle folder `research/` in second-brain; documented in workspace README + CLAUDE.md
- Unit + integration tests under `scripts/research.test.ts` and `scripts/research.integration.test.ts`
- Bundled prerequisite fix: `scripts/capture.ts` should call `indexOneFile()` inline after writing (closes latent indexer-staleness bug)

### 2.2 Out of scope (deferred)

- Multi-session orchestration (running `/research X` across multiple days and threading state)
- Source-authority scoring (domain reputation, citation graph)
- Embedding-based coverage check (Phase 1 — replaces `ilike` keyword scan with pgvector cosine)
- LLM-judgment quality evaluation framework
- TUI / dashboard for live monitoring of a running session
- Auto-resolution of contradictions

## 3. Architecture

### 3.1 File layout (new)

```
.claude/skills/research/SKILL.md             # new skill manifest + instructions
scripts/research.ts                          # init|pick|log subcommands
scripts/research.test.ts                     # pure-function unit tests
scripts/research.integration.test.ts         # loop integration test (no firecrawl)
scripts/lib/research-junk-domains.txt        # initial denylist (user-editable)
tests/fixtures/research/empty-session.md     # fixture for parse tests
tests/fixtures/research/two-iter-session.md  # fixture for parse tests
db/supabase/migrations/<timestamp>_add_research_type.sql
workspaces/second-brain/research/            # new lifecycle folder (created on first run)
```

### 3.2 File layout (modified)

```
scripts/lib/frontmatter.ts                   # add 'research' to type enum + agent_run_id field
scripts/lib/runs.ts                          # export startRun, updateRunSummary, finalizeRun
scripts/capture.ts                           # bug fix: call indexOneFile after write
workspaces/second-brain/README.md            # document research/ folder
workspaces/second-brain/CLAUDE.md            # mention the research skill
.claude/skills/weekly-review/SKILL.md        # (optional) reference research sessions explicitly
```

### 3.3 Component contracts

**SKILL.md — drives high-level loop:**

```
1. INIT
   bun run scripts/research.ts init --topic "<topic>" --workspace <ws> --seed-questions <json>
   → { session_path, slug, seed_questions[], anchors_in_db[] }

2. LOOP (1..budget)
   a. PICK
      bun run scripts/research.ts pick --session <path>
      → { sub_question, scores, picked_reason }
        OR { skip: "covered"|"exhausted", reason }
   b. RESEARCH (LLM does this)
      - firecrawl-search <sub_question> (top 3)
      - For each high-signal result: capture skill → sources/
      - LLM distills 1-2 atomic notes → capture skill → notes/
   c. LOG
      bun run scripts/research.ts log --session <path> --json '<iteration-obj>'

3. SYNTHESIZE (LLM)
   - Edit landing page's ## Synthesis section
   - 3-6 sentence answer + [[note-slug]] list + open questions
   bun run scripts/research.ts finalize --session <path> --status succeeded
   → flips agent_runs to status='succeeded' + writes final summary,
     bumps landing page status from 'draft' to 'durable'
```

**`scripts/research.ts` — subcommand contracts:**

`init`:
- Input: `--topic`, `--workspace`, `--seed-questions <json-array>`, optional `--budget` (default 5)
- Behavior: derive slug, date-prefix, write landing page skeleton (frontmatter includes `agent_run_id` field + 3 sections), query DB for anchor candidates, run indexer on the new file, start an `agent_runs` row (`skill_name='research'`, `status='started'`) via `startRun()`
- Output: JSON `{ session_path, slug, seed_questions, anchors_in_db, agent_run_id, budget }`

`pick`:
- Input: `--session <path>`
- Behavior:
  1. Parse landing page → extract `## Plan` seed questions, `## Iteration log` history, `## Synthesis` (if non-empty)
  2. Build candidate list = (open seed questions) ∪ (unresolved `[[link]]` targets surfaced from session-created notes)
  3. For each candidate, score `total = info_gain + gap_fill_bonus`
     - `info_gain`: parser-emitted placeholder 0-10 (SKILL.md may override using LLM judgment if `--llm-rerank`)
     - `gap_fill_bonus`: deterministic — `count(links where to_slug in candidate_keywords and to_item_id is null)`
  4. Coverage check on top candidate via `isAlreadyCovered(workspace_id, keywords)`
     - If covered → return `{ skip: "covered", candidate, reason }`
  5. If candidate list empty → return `{ skip: "exhausted" }`
- Output: JSON `{ sub_question, scores, picked_reason, candidate_anchors }` or `{ skip, ... }`

`log`:
- Input: `--session <path> --json <iteration-obj>`
- Behavior: append a structured Markdown entry under `## Iteration log` (format below), bump frontmatter `updated:` field, run indexer on the landing page, call `updateRunSummary(agent_run_id, running-tally)`
- Output: JSON `{ ok: true, iteration_number }`

`finalize`:
- Input: `--session <path> --status succeeded|failed [--error <msg>]`
- Behavior: read `agent_run_id` from landing page frontmatter, call `finalizeRun(...)` with final summary aggregated from iteration log + synthesis section. Bump landing page `status` from `draft` to `durable` (only on success).
- Output: JSON `{ ok: true, summary }`

### 3.4 Landing page format

```markdown
---
slug: 2026-05-13-rag-evaluation
title: RAG Evaluation (research session)
type: research
status: draft         # → 'durable' after finalize step
tags: [research-session, rag, evaluation, llm]
links: ["[[anchor-1]]", "[[anchor-2]]"]   # populated by init from anchors_in_db
source: null
confidence: medium
created: 2026-05-13
updated: 2026-05-13
agent_run_id: <uuid>  # research-type only; threads session state across init/log/finalize
budget: 5             # research-type only; iteration cap for this session
---

# RAG Evaluation — research session

**Topic:** retrieval-augmented generation evaluation
**Budget:** 5 iterations

## Plan

Seed sub-questions:
1. <Q1>
2. <Q2>
...

Anchors in DB: [[anchor-1]], [[anchor-2]]

## Iteration log

### Iteration 1 — <sub_question>
- **Picked because:** <reasoning>
- **Score:** info_gain=X.X + gap_fill=Y → Z.Z
- **Sources:** [[source-slug-a]], [[source-slug-b]]
- **Notes:** [[note-slug-a]], [[note-slug-b]]
- **Status:** kept | skipped | low-signal | error
- **Contradictions:** (omit when empty)
  - [[note-slug-a]] vs [[source-slug-b]]: <one-sentence summary>

### Iteration 2 — ...

## Synthesis

(empty until final step; SKILL.md fills with answer + new-note list + open questions)
```

## 4. Database

### 4.1 Migration

```sql
-- db/supabase/migrations/<timestamp>_add_research_type.sql
alter table items drop constraint items_type_check;
alter table items add constraint items_type_check
  check (type in ('note','source','decision','inbox','capture','research'));
```

### 4.2 No new tables

Iteration state lives in the landing page (Markdown is source of truth, per project contract). `pick` re-parses fresh each iteration. Avoids any risk of DB/file divergence.

### 4.3 New SQL helper inside `pick`

```ts
async function isAlreadyCovered(
  workspaceId: string,
  keywords: string[]
): Promise<boolean> {
  // Conjunctive ILIKE on body + title for high-confidence items
  // Returns true if >= 3 hits — threshold tunable
}
```

Phase 1 will replace this with pgvector semantic similarity.

### 4.4 Indexer hook timing

**Problem:** the existing `PostToolUse` hook fires on Claude's `Write|Edit` tools but NOT on Bash-invoked `writeFileSync()`. So `capture.ts` and `research.ts` (both Bash-invoked) leave the index stale.

**Fix (this spec):** every `research.ts` subcommand that writes calls `indexOneFile()` inline immediately after the write. `pick` reads from the up-to-date `links` table on its next invocation.

**Bundled prerequisite fix:** apply the same pattern to `capture.ts`. Already a latent bug — surfaced during the `llm-wiki-pattern` capture session of 2026-05-13. Without this fix, the gap-fill bonus would always be zero in fresh-wiki scenarios because session-created notes wouldn't be indexed before the next `pick`.

## 5. Error handling

### 5.1 The four failure modes

| Mode | Defense | Behavior |
|---|---|---|
| Bad sub-question (already covered) | Pre-flight `isAlreadyCovered` check in `pick` | Returns `skip="covered"`; SKILL.md logs skip and re-picks. Cap: 2 consecutive skips → accept candidate anyway |
| Low-quality source | Body-length + paragraph-count heuristic + denylist file | Discard result; try next of top 3. If all 3 fail → log iter with `status="low-signal"`, no retry on fresh search |
| Repeat coverage | Same as bad sub-question + `skip="exhausted"` when all candidates covered | Loop exits early; synthesis runs with what's been gathered |
| Contradictions | LLM detects during distillation; both sources captured | New notes get `status: draft, confidence: medium`; contradiction logged; surfaced in `## Synthesis → Open questions` — no auto-resolve |

### 5.2 Operational errors

| Error | Handling |
|---|---|
| `firecrawl-search` API failure | Hard surface in SKILL.md; log iter as `status="error"`; abort loop early |
| `research.ts` subcommand crash | SKILL.md halts; partial landing page is salvageable manually |
| Indexer failure inside `init`/`log` | Warn on stderr; continue (stale index for one iter is tolerable) |
| Slug collision on landing page | Append `-2`, `-3` disambiguator (matches `capture.ts` convention) |
| Zero seed questions | Hard fail at `init` — plan section must have content for `pick` |
| Malformed iteration log section | Self-heal — recreate section empty; warn |

### 5.3 Logging

Each session emits **one** `agent_runs` row spanning multiple subcommand invocations:

- `init` inserts the row with `skill_name='research'`, `status='started'`; returns its `id` (the session's `agent_run_id`) as part of its JSON output
- `init` also writes `agent_run_id` into the landing page's frontmatter (so `log` can read it without the SKILL.md having to thread it through every invocation)
- `log` reads `agent_run_id` from the landing page and updates `agent_runs.summary` to a running tally (`"N iters so far"`)
- The synthesize step (or `init --finalize`) flips `status='succeeded'`, writes the final summary `"N iters, M notes, K contradictions, J open Qs"`, and sets `ended_at`
- On unrecoverable error (firecrawl down, script crash), SKILL.md calls `bun run scripts/research.ts finalize --session <path> --status failed --error "<msg>"`

**New helpers to add to `scripts/lib/runs.ts`** (since the existing `withRun` only wraps a single invocation):

```ts
export async function startRun(skillName: string): Promise<string>           // returns runId
export async function updateRunSummary(runId: string, summary: string): Promise<void>
export async function finalizeRun(runId: string, status: 'succeeded'|'failed',
                                  summary: string|null, error: string|null): Promise<void>
```

`finalizeRun` is already private inside `runs.ts` — promote to export. `startRun` is the existing `insertStartedRun` — promote and rename. `updateRunSummary` is new.

`weekly-review` already aggregates `agent_runs` — research sessions show up there automatically.

## 6. Skill integration

### 6.1 With existing skills

- **`capture`** — research.ts does NOT replicate capture's logic. SKILL.md invokes the capture skill (or its underlying `scripts/capture.ts`) for every source and atomic note write. This guarantees identical frontmatter, triage rules, and DB writes.
- **`query`** — used inside the coverage check in `pick`. Initially via direct SQL (`isAlreadyCovered`); Phase 1 may swap to invoking the `query` skill for semantic check.
- **`triage-inbox`** — contradiction-flagged notes that get filed to `inbox/` (medium confidence) will surface in normal triage workflow.
- **`weekly-review`** — automatically picks up research sessions via `agent_runs`. May get a small explicit section ("Research sessions this week") in a follow-up.

### 6.2 With the `loop` plugin

`/loop /research <topic>` runs the same skill with the plugin handling pacing. Useful for "walk away and let it think" mode. The loop plugin's interval is independent of the per-session iteration budget — one `/loop` interval = one full research session.

### 6.3 With Karpathy's `autoresearch`

Not integrated. Karpathy's repo is for ML training experiments and requires a GPU. This skill is the **ideology port**, not a wrapper. If the user wants to run actual ML autoresearch (`driveline...` or `karpathy/autoresearch` proper), that's a separate install in a separate repo.

## 7. Testing

### 7.1 Unit tests (`scripts/research.test.ts`)

- `buildCandidates(landingPage, dbState) → Candidate[]` with five distinct scenarios (empty log, covered Q1, unresolved-link bonus, tie-break, exhausted)
- `parseIterationLog(landingPage) → IterationEntry[]` round-trip with `appendIterationLog`
- Malformed/missing section self-heal

### 7.2 Integration tests (`scripts/research.integration.test.ts`)

- Reset DB, seed one anchor note, run `init` → `pick` → `log` → `pick` round-trip 5x with stubbed file writes
- Assert: landing page has 5 entries; items table has N new rows; links table has expected resolved/unresolved counts; agent_runs has one `succeeded` row

Firecrawl/LLM are NOT in this test loop. The SKILL.md gets a manual smoke test (§7.3).

### 7.3 Smoke test

Run `/research "what is a Bloom filter"` end-to-end. Pass criteria:
- Landing page at `workspaces/second-brain/research/<today>-bloom-filter.md`
- 3-5 atomic notes under `notes/`, 3-8 sources under `sources/`
- `## Synthesis` populated with `[[wikilinks]]`
- `agent_runs` row, kind=`research`, status=`succeeded`
- Final index state consistent with file state (no stale rows)

### 7.4 What's NOT tested in v1

- LLM judgment quality (info_gain scoring, sub-question phrasing)
- Firecrawl rate-limit / network-failure paths (no mock layer)
- Multi-session de-duplication beyond a single manual run

## 8. Phased rollout

### 8.1 Phase 0 (this spec)

Ship the skill end-to-end with the constraints above. Smoke-test on 2-3 real topics. Adjust `MIN_BODY_CHARS`, denylist, and coverage threshold based on what shows up.

### 8.2 Phase 1 (later)

- Swap `isAlreadyCovered` from `ilike` to pgvector semantic similarity (depends on Phase 1 embeddings work in the bootstrap spec)
- Add source-quality scoring (lightweight: domain authority via a small static table)
- `/research` resumable across sessions (read `agent_runs` for in-progress sessions)

### 8.3 Phase 2+

- Multi-agent research (parallel sub-question workers writing to disjoint slug spaces)
- LLM-judgment eval framework (golden topics with expected notes/links)
- Contradiction auto-resolution proposals (with human accept/reject)

## 9. Success criteria (Phase 0)

Definition of done:

1. `/research <topic>` runs end-to-end without manual indexer invocation.
2. After a 5-iteration session, the second-brain has 3-8 new atomic notes + sources, and the landing page synthesis links to all of them.
3. The gap-fill bonus is non-zero by iteration 3 on a fresh topic (i.e. the loop is self-healing its own graph — observable in iteration log scores).
4. Re-running `/research` on the same topic the next day skips ≥ 2 of the seed questions (coverage check working).
5. A deliberately broken iteration (e.g. paywalled top result) logs `low-signal` without crashing the loop.
6. Unit + integration tests pass; `bun run test` exits 0.

## 10. Open questions / deferred

- **Tag conventions for research-session notes:** should atomic notes created during a session carry a `tags: [research:rag-evaluation]` marker so they can be grouped later? Defer — solvable in Phase 1 via a query.
- **Budget overrides:** should `/research X --budget 10` be supported in v1? Easy to add; defer to first user request.
- **Cost/rate limits:** firecrawl + LLM token cost per session is not bounded by anything explicit. For v1, the 5-iteration cap is the implicit budget. Add explicit token budgeting in Phase 1 if cost becomes a concern.

## 11. Risks and mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Pick keeps picking thin or off-topic sub-questions | Medium | Coverage check + LLM-rerank fallback inside `pick`; smoke-test catches obvious cases |
| Bundled `capture.ts` indexer fix breaks existing capture flow | Low | Keep the change minimal — single `await indexOneFile()` call after write; existing capture tests cover the round-trip |
| Landing-page format drift between SKILL.md (writer of synthesis) and `research.ts` (writer of log) | Medium | Strict section markers (`## Iteration log`, `## Synthesis`); `research.ts` self-heals if markers missing |
| Contradictions flood `inbox/` and clutter triage | Low (v1 doesn't auto-file to inbox) | Contradictions are flagged in landing page only; user decides whether to file |
| User runs `/research` on a topic the wiki has zero anchors for, gap-fill bonus is permanently 0 | Medium | Acceptable for first session on a topic; second session benefits from session-1's notes; document expected behavior |

## 12. Implementation order

1. **Migration first** — add `'research'` to `items.type` check; update Zod schema. Run `db:migrate`; run existing tests to verify nothing broke.
2. **`capture.ts` indexer fix** — small, well-scoped, gives an immediately better baseline. Verify smoke-test-note round-trip via Edit and via capture both produce identical DB state.
3. **`scripts/research.ts`** — `init` → `log` → `pick`, in that order (each is independently testable).
4. **Unit + integration tests** — written alongside each subcommand, not after.
5. **SKILL.md** — last, because the contracts above must be locked first.
6. **Docs** — update second-brain `README.md` and `CLAUDE.md`.
7. **Smoke test** — `/research "what is a Bloom filter"`.
