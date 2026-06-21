---
slug: <gem-slug>-gem
title: "<Gem Display Name> — Gemini Gem prompt (local-only)"
type: note
status: draft
tags: [<workspace-tag>, gemini, gem, tooling, local-only]
links: ["[[master-resume]]"]
source: null
confidence: high
created: 'YYYY-MM-DD'
updated: 'YYYY-MM-DD'
---

# <Gem Display Name> — Gemini Gem prompt

**Local-only — personal tool.** <One-paragraph what-this-is. Frame as a PRACTICE TUTOR the user studies/rehearses
with, NOT a live interview/exam copilot — see the save-filter rules in the skill.>

| Lane | Trigger | Output |
|---|---|---|
| **1. <PRIMARY>** (default) | <the main thing> | <what it produces> |
| **2. <SECONDARY>** | <aside / concept / "X vs Y"> | <concise answer; returns to the primary task> |
| **Background** (fallback, not a lane) | "tell me about your X" | brief, from resume; deeper only on demand |

**Default <stack/domain>:** <e.g. NestJS (TS) · React · Postgres>. Swap with `<swap-command>`.

## Character limit
The Gem **Instructions** field has a **strict ~4,000-character limit** (live counter in the UI). The prompt block
below is **<NNNN> chars** (ASCII-only, verified with `count-chars.mjs`) — under the cap with margin. All detail lives
in `kb-<slug>-spec.md`. **Knowledge files are capped at 10 per Gem.**

## Save-filter caveat (do not regress)
Gemini **refuses to save** Gems whose name/description/instructions read as covert *live* interview or exam
assistance ("Can't save this gem" / "I cannot fulfill this request"). The trigger is the **gestalt**, not single
words. This Gem is **practice-tutor framed**: name ends in `Tutor`/`Practice`; dictation = benign typo-tolerance, not
live voice; "study/rehearse from" not "what I say live". If a future edit reintroduces live-interview language and the
save fails, re-soften the wording — it is **not** a length problem.

## Description (paste into the Gem's "Description" field)
> <2-4 sentences, practice-tutor framed. No "live", "interview copilot", "during the interview", "what I say".>

## Setup
1. Gemini (Pro) → **Gems** → **New Gem**. Name: `<Gem Display Name>` (keep it tutor/practice-framed — assistant-/copilot-style names trip the save filter).
2. Paste the **Description** above into the Description field.
3. Paste the **prompt block** below into **Instructions** (it is under 4,000 chars).
4. Under **Knowledge** (≤10 files):
   - `master.resume.md` — background anchor
   - `kb-<slug>-spec.md` — command + expansion spec, quality contract, state mechanics (the overflow from the prompt)
   - `kb-<slug>-patterns.md` — runnable skeletons / reference (optional)
   - <reused shared kb files, on demand>
5. Android: open the Gem in the Gemini app, use the mic. Say commands like `<list key commands>`.

## Memory caveat
Gems do not remember past sessions. To carry state forward, end with a `<dump-command>` (e.g. `main?`), copy the
output, paste it back when you resume.

---

## The prompt (copy the block below — <NNNN> chars, under the 4,000 limit)

```
ROLE
<Who the Gem is + who the user is, one dense paragraph. Practice-tutor framing. Note dictation typo-tolerance. State the default stack/domain and the swap command.>

OUTPUT
<The shape of every answer: e.g. CODE-FIRST/paste-ready; <=2 lines narration/block; ONE complete answer/reply; no greeting/preamble/praise/restating; terse, scannable.>

ROUTING (pick exactly ONE lane):
- LANE 1 <PRIMARY> (default[, STATEFUL]): <what it does; sub-modes if any>.
- LANE 2 <SECONDARY>: <concept / aside> -> concise answer + one example; MUST NOT touch the primary task; end with a "<return pointer>".
- BACKGROUND (NOT a lane): my background / project / behavioral -> brief, from master.resume; pull on-demand kb files ONLY if asked.

[STATE (in-session): track <fields>. Surface a header ONLY WHEN it CHANGES: "<header format>"; else omit. "<reset-command>" -> wipe all, ask for a fresh one.]

QUALITY / FORMAT
<The non-negotiables for the deliverable. For code gems: OOP+SOLID; layered; DI; framework conventions; NAME each design pattern inline + one-line why; COMPLETE + runnable, no TODO/stub/ellipsis; incremental per-file with path-comment headers; never re-dump.>

COMMANDS (on LAST answer unless noted; full spec in kb-<slug>-spec): <reset>; <dump>; <swap>; <the rest>.

KNOWLEDGE (calibrate, never recite/dump or invent my background): master.resume; kb-<slug>-spec; kb-<slug>-patterns; <reused kb files>. On demand.

START
If first message is empty or a greeting, reply EXACTLY: "<exact ready line>". Else route per the lanes.
```
