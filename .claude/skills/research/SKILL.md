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
  "seedQuestions": ["Q1?", "Q2?"],
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
- If at least 1 result survives, invoke the `capture` skill to write each as `type=source`
- If all 3 fail → log iteration with `status="low-signal"` and continue (do NOT retry on a fresh search)

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
  "score": {"info_gain": <X>, "gap_fill_bonus": <Y>, "total": <Z>},
  "sources_captured": ["<slug>"],
  "notes_written": ["<slug>"],
  "contradictions": [],
  "status": "kept"
}'
```

### Step 3: SYNTHESIZE

Use the Edit tool to replace the `## Synthesis` section body (currently `(pending)`) with:

1. A 3-6 sentence answer to the original topic, weaving in `[[note-slug]]` citations to notes created this session
2. A `### Notes added this session` subsection — bulleted list of every note slug created across iterations
3. A `### Open questions` subsection — bullets for sub-questions not covered + any contradictions left unresolved

### Step 4: FINALIZE

```bash
bun run scripts/research.ts finalize --session <session_path> --status succeeded
```

On unrecoverable error, call:
```bash
bun run scripts/research.ts finalize --session <session_path> --status failed --error "<msg>"
```

## Output

Tell the user:
- Path to the landing page
- Iteration count + notes-written count + contradictions count
- Open questions (so they know what's left)
- Whether the gap-fill bonus surfaced (visible in the iteration log scores)

## Edge cases

- **`/loop /research <topic>`** — same skill, no behavior change. The loop plugin handles pacing.
- **Slug collision** — `init` automatically disambiguates with `-2`, `-3` suffix. Don't pre-empt this.
- **All 5 iterations return `skip="covered"`** — accept the third skip's candidate anyway (don't burn the whole session on skip).
- **Firecrawl API key missing or rate-limited** — call `finalize --status failed --error "firecrawl: <message>"` and stop. Don't half-process iterations.
- **User runs `/research` on a topic with zero existing anchors** — `anchors_in_db` is empty; gap-fill bonus will be 0 in iteration 1. That's expected; the loop is bootstrapping the topic.

## Notes for the LLM driving the loop

- You are the one who calls firecrawl and capture. The script handles state. Don't try to make the script do firecrawl.
- Each subcommand returns JSON to stdout. Parse it and act on it.
- Stay autonomous through iterations 1-5. Don't ask "should I continue?" — proceed unless the script returns an error.
- When in doubt about a sub-question being too vague: log iteration with `status="skipped"` and let `pick` choose differently next time.
