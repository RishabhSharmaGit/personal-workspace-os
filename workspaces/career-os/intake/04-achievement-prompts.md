---
slug: intake-04-achievement-prompts
title: "Intake — Achievement bank prompts"
type: note
status: draft
tags: [intake, achievements, xyz]
links: []
source: null
confidence: medium
created: '2026-05-14'
updated: '2026-05-14'
---

# 04 — Achievement bank prompts

This is the **single highest-leverage file** in the workspace. Spend 30+ minutes here.

The goal: produce ~15–30 atomic XYZ bullets. Each bullet later becomes its own file in `achievements/` (atomic notes — see [`TEMPLATES.md`](../TEMPLATES.md#achievement-xyz-atomic-bullet) for shape). Tailored resumes are compiled by picking + ranking from this bank against a target-role's keywords.

## The XYZ formula (Google / Laszlo Bock)

> "Accomplished **[X]** as measured by **[Y]** by doing **[Z]**."

- **X** = the outcome / accomplishment (verb-led, concrete)
- **Y** = the measurable proof (numbers, scope, %)
- **Z** = how you did it (the technical / strategic move)

Example (good):
> Reduced voice-AI conversational p95 latency from 1.2s → 320ms (-73%) by parallelizing TTS warm-up with VAD endpointing and switching ASR to a GCP regional endpoint.

Example (bad — missing Y):
> Improved latency by optimizing the audio pipeline.

## 15 prompts

For each prompt, write at least one XYZ bullet if applicable. Skip ones that don't apply to you. Aim for 1-2 lines each; the full STAR write-up goes later in the achievement file body.

### Performance / scale
1. **Latency** — A time when you measurably reduced p50/p95/p99 latency or throughput for a service. By how much, on what scope (RPS/QPS/users), and by what mechanism?
   - `[FILL]`
2. **Throughput / volume** — Largest data volume, request volume, or user count you've designed for. What was the bottleneck before, what did you change, what did it become?
   - `[FILL]`
3. **Cost** — A time you cut infra spend, vendor bill, or per-request cost. By how much; how?
   - `[FILL]`

### Reliability / quality
4. **Reliability** — An incident, outage, or quality issue you owned end-to-end. Detection → mitigation → postmortem → systemic fix. Impact numbers?
   - `[FILL]`
5. **Test/CI/release improvement** — Where you reduced bug-escape rate, sped up CI, or made releases safer. Concrete before/after metric.
   - `[FILL]`

### Architecture / leadership
6. **Architectural change you led** — One you initiated, designed, sold to stakeholders, and shipped. Why was it necessary, what was the alternative, what did it enable?
   - `[FILL — Nova endorsement module redesign? Confido voice agent core arch?]`
7. **Integration shipped** — Connecting two systems that didn't talk before. Which, why, scope (records moved, partners enabled). Nova had HRMS + insurer + payments integrations explicitly.
   - `[FILL]`
8. **0-to-1 product/feature** — Something you shipped from blank repo to production. Time-to-launch, customers/users at launch, what shipped.
   - `[FILL — Confido voice AI is likely your strongest 0-to-1]`
9. **Cross-team / cross-org influence** — Where you changed how multiple teams did something. The decision, the audience, the result.
   - `[FILL]`

### People / process
10. **Mentoring / hiring impact** — Engineers you helped grow, hires you closed, processes you changed in your team.
    - `[FILL]`
11. **Reduced ambiguity** — A situation where the goal was unclear and you cut through it (wrote the spec, ran the meeting, made the call). What was at stake?
    - `[FILL]`

### AI / modern stack
12. **AI/LLM in production** — Any system you shipped that uses LLMs / RAG / agents in a non-trivial way. Especially relevant given your Confido voice-AI focus.
    - `[FILL]`
13. **AI-tooling leverage** — Concrete examples where Claude Code / Cursor / Copilot let you ship something faster than peers, or scaled your work. Senior resumes in 2026 are expected to have at least one of these.
    - `[FILL]`

### Product / customer outcomes
14. **Customer outcome you can name** — Where engineering choice → measurable user/business outcome (conversion, retention, NPS, revenue, partner wins).
    - `[FILL]`
15. **Sunset / kill / cut** — Something you removed/deprecated to make the system better. Often more impressive than building.
    - `[FILL]`

## Bonus prompts (only if you have a clean answer)

- Any **public artifact** (talks, blog posts, OSS PRs, conference appearances)?
- Any time you **prevented** a bad decision from being made? (impact = "didn't happen", harder to quote)
- A time you **proactively learned** a tech and brought it in?

## Next step

When you've drafted ~15+ bullets above:

1. For your **top 5–8 strongest** ones — promote each to its own file under `achievements/{slug}.md`, using the achievement template in [`TEMPLATES.md`](../TEMPLATES.md).
2. Tag each with `tech_tags`, `role_slug`, `metric`, and an `evidence_url` if you can.
3. These become the corpus that `tailor-resume` ranks against per JD (Phase 3 skill, not yet built).
