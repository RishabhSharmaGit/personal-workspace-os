---
name: interview-prep
description: "Use when preparing for a recruiter, behavioral, cultural, or hiring-manager interview round at a specific company — building the spoken 'tell me about yourself' intro, why-this-company, why-switching, project talking points, questions to ask, and about-me. Triggers: 'prep my interview for <company>', 'make my intro for <company>', 'behavioral / cultural round prep', 'why <company> answer', 'tell me about yourself for <company>'."
---

# Interview Prep (conversational / behavioral round)

## Overview
Generates a per-company **conversational interview prep** doc the user reads and rehearses before a recruiter, behavioral, cultural, or hiring-manager round. Output → `workspaces/career-os/interview-prep/<company-slug>/notes.md` (**LOCAL-ONLY** — gitignored via `interview-prep/*/`; it names a target company, so it must never be committed).

**Core principle:** every line traces to the user's own files — never invent facts. Tailor to the *specific role and its level*, and make the intro a distinctive, *spoken* answer — not a résumé read-back.

## When to use
- "Prep my interview for `<company>`" / "behavioral / cultural round for `<company>`"
- "Make my intro / 'tell me about yourself' for `<company>`"
- "Why `<company>`?" answer, project talking points, questions to ask, about-me

## Step 1 — Gather inputs (read these; don't guess facts)
- `roles/<company>-*.md` — target-role analysis + JD + match/honesty notes
- `resumes/variants/*<company>*.md` — the tailored résumé = what to emphasize, and what NOT to repeat verbatim
- `resumes/master.resume.md`, `intake/02-experience.md`, `achievements/*.md` — the real facts + metrics
- any `research/` or company notes
- **Ask the user** (if unclear): the **role level** (IC / lead / leadership), the **round type**, the **recruiter/process**, and **what the role actually is day-to-day** (e.g. "software dev using AI as a tool" vs "AI-building"). These change the whole framing.

## Step 2 — Write the file
Use [`template.md`](template.md) as the skeleton. Sections: context + TL;DR · **intro (TMAY)** · why-this-company · why-switching · projects · questions to ask · about-me / personal · landmines / honesty · sources. If the company also has a **coding/technical** round, keep that in a separate `coding-round.md` (don't mix it into the behavioral doc).

## The intro ("Tell me about yourself") — the part that matters most
Framework: **Hook → Proof → Connect.**

- **Hook = a distinctive ICE-BREAKER, never a cliché.** Open warm/witty (e.g. *"I'll spare you the résumé read-back…"*) + the basics (years · full-stack · product companies). Self-directed humor only — **never demeaning** to other people/industries. Kill LinkedIn-generic lines ("I build scalable products that ship and don't fall over"). **Offer the user 2–4 distinct hook options** to pick from.
- **Proof = ONE vivid results story**, executive-summary style, with 1–2 hard numbers *landed* (bold them). No history lesson, no list of ten responsibilities.
- **Connect = specific to THIS company** — its stage, product, or problem. This is the line that earns the next question. Connect via **role / stage / ownership**, not a repeated domain list.
- **Match the role level:** IC → builder/architect/ships energy ("I build… I owned… hands-on"); leadership → scope/ownership/foresight, and frame any **title-gap** as *"the title catching up to the work."*
- **Match what the role actually is** (don't headline AI if it's AI-assisted dev; don't headline frontend for a backend role).
- **Speakable:** short sentences, clear sentence-ends, **one sentence per line**, mark **[pause]** beats so the user knows where to breathe.
- **Length:** ~65–80s (~150–190 words). Offer a **~45s express cut** too.
- **Don't restate the résumé summary verbatim** — echo the themes in fresh words.

## Honesty rules (hard — mirrors career-os `CLAUDE.md`)
- Only facts from the user's files. Never invent metrics, employers, dates, or tech.
- A genuine **ramp** (a tech they're light on) → frame as growth; never fake a bullet.
- In-progress work → "designing / evaluating," never "shipped." Reconstructed/estimated metrics → "order-of-magnitude."
- **Tense/status:** keep the verbal tense consistent with the résumé's dates — present (*"in my current role / we're"*) vs past (*"most recently I was…"*). **Flag this to the user** so a reference check finds no mismatch.
- Never name the target company in a committed file; this doc is local-only.

## Iterate, don't dump
Present the **hook options** + draft sections, then refine with the user (hook flavor, length, tone) before finalizing. End with a **delivery note** (where to pause, which numbers to land) and offer the ~45s cut.

## Common mistakes
Generic/clichéd hook · leading with the wrong strength for the role · repeating the résumé · inventing or inflating metrics · domain-boxing the candidate ("the domain changes, the job doesn't" fixes this) · ignoring IC-vs-leadership framing · forgetting the status/tense consistency · mixing the DSA/coding round into the behavioral doc.
