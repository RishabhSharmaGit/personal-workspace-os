---
slug: confido-engineer-interview-framework
title: "Designed Confido's senior-engineer interview framework — 6 problems, 75-min phased-refactor format"
type: achievement
status: durable
tags: [hiring, interview-design, pedagogy, llm-discipline, confido, leadership]
links: []
source: null
confidence: high
created: '2026-06-03'
updated: '2026-06-03'
xyz:
  x: "Designed and solo-authored Confido's senior-engineer technical interview framework"
  y: "6 problems × 75-min phased-refactor format; received multiple internal appraisals + positive candidate feedback for problem authenticity; replaced standard DSA / textbook-system-design questions"
  z: "by designing problems that mirror real Confido voice-AI / backend patterns (command + state machines, event sourcing + idempotency, token-bucket + priority queues, strategy + DLQ, async workflows + concurrency, stream processing + dedup) and writing a guardrail framework that forces candidates to drive design + verify AI output rather than context-dump"
tech_tags: [interview-design, pedagogy, llm-tooling, typescript, system-design]
role_slug: confido-founding-eng
metric: "6 problems · 75-min phased format · multiple internal appraisals · positive candidate feedback"
evidence_url: ""
---

# Confido senior-engineer interview framework

## One-line bullet (resume-ready)

Designed and solo-authored Confido's senior-engineer technical interview framework — 6 problems × 75-min phased-refactor format that tests structured LLM-tool discipline (prompt clarity, output verification, refactor resilience) rather than syntax memory; received multiple internal appraisals and positive candidate feedback for problem authenticity.

## Long form (STAR — interview-ready)

**Situation**: Hiring senior engineers in the LLM-coding-tool era. Standard DSA + textbook system-design questions test the wrong things: they reward memorization, give no signal on how a candidate works *with* AI tools, and produce uninspired interview experiences for senior candidates who've solved those problems for a decade.

**Task**: Design an interview that tests how senior engineers actually work in 2026 — driving design, using AI as a syntax helper, verifying AI output, refactoring resiliently — while testing on problems that mirror Confido's real production patterns and keeping candidates engaged.

**Action**:
- Authored **6 problems** spanning the patterns Confido's production stack actually depends on:
  - **Command pattern + state machines** (RPA Engine) — mirrors our voice-agent state management
  - **Event sourcing + idempotency** (Voice Agent Reconciler) — mirrors our call-state reconciliation
  - **Token bucket + priority queues** (Rate Limiter) — mirrors our EHR-API rate-limit handling
  - **Strategy pattern + DLQ** (Webhook Router) — mirrors our integration webhook fan-out
  - **Async workflows + concurrency** (EHR Sync) — mirrors our appointment-manager sync layer
  - **Stream processing + dedup** (Vitals Pipeline) — mirrors our real-time event handling
- **75-min phased-refactor format**: candidate sees the problem in phase 1, must produce a working Phase 1 design that survives the phase-2 requirement reveal without rewriting. Tests refactor resilience.
- **Wrote `ai-rules.md`**: a guardrail document that restricts AI use to syntax/boilerplate — not design-pattern selection, not architecture, not core logic. Forces the candidate to *drive* design via small focused prompts and verify AI output rather than context-dump and accept.
- **Evaluation rubric**: explicitly teaches interviewers to reject context-dumping, demand small focused micro-prompts, watch for verification behaviors, and assess whether the Phase 1 design survives the Phase 2 refactor.

**Result**:
- **Multiple internal appraisals** for the framework.
- **Positive candidate feedback** for problem authenticity — good candidates report enjoying the format (rare for technical interviews).
- Replaced boring DSA / standard-system-design rounds with problems that signal actual senior engineering judgment in the LLM era.

## Why this matters as a resume signal

Most senior-engineer resumes don't show *pedagogical* or *hiring-process* thinking. This shows:
- Independent thought about how senior engineering work has changed in the LLM era
- Willingness to author + ship a hiring artifact end-to-end
- Ability to translate production patterns into reusable evaluation harnesses
- Leadership-adjacent skill (calibrating what "good" looks like for the team)

## What I'd tell an interviewer

"I designed our senior-engineer interview framework end-to-end — six problems, 75-minute phased-refactor format. The premise: standard DSA tests memorization, standard system design rewards rote answers, and neither one tells you anything about how a candidate works with AI tools, which is now half the senior engineering skillset. So I built problems that mirror Confido's actual production patterns — command + state machines for our voice agents, token-bucket rate limiters for our EHR APIs, event sourcing + idempotency for our call reconciliation — and wrapped them in a guardrail document that restricts AI to syntax help only. The candidate has to drive the design, use AI in small focused prompts, and verify output. The phased refactor structure tests whether their Phase 1 design survives a Phase 2 requirement reveal without rewriting. It got multiple internal appraisals and good candidates have told me they actually enjoyed it — which almost never happens with technical interviews."
