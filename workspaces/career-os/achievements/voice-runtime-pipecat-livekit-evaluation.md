---
slug: voice-runtime-pipecat-livekit-evaluation
title: "Leading next-gen voice runtime evaluation — Pipecat vs LiveKit, replacing Retell"
type: achievement
status: durable
tags: [voice-ai, pipecat, livekit, retell, platform-strategy, confido, architecture]
links: ["[[2026-06-03-voice-ai-platforms-comparison]]", "[[ehr-agnostic-abstraction-layer]]"]
source: null
confidence: high
created: '2026-06-03'
updated: '2026-06-03'
xyz:
  x: "Leading evaluation between Pipecat and LiveKit for Confido's next-gen voice runtime, replacing the current Retell-based production stack"
  y: "Built end-to-end STT+LLM+TTS pipelines in both frameworks for comparison; authored multi-phase platform-replacement plan with success metrics (≤2,500 tokens/call vs ~8,500-10,000 baseline; <800ms P50 voice-to-voice latency; ≤50% cost; 99.5% EHR write success)"
  z: "by running a structured technical evaluation with Deepgram STT + LiteLLM multi-provider LLM routing (OpenAI / Anthropic / Gemini) + ElevenLabs TTS + Upstash semantic cache; designing the Redis-as-source-of-truth architecture with Jinja2 prompt rendering from frozen state snapshots; and planning shadow-mode A/B validation for the final framework decision"
tech_tags: [pipecat, livekit, retell, deepgram, elevenlabs, openai, anthropic, gemini, litellm, redis, jinja2, supabase, rls, gcp, cloud-run, workload-identity-federation]
role_slug: confido-founding-eng
metric: "Target: ≤2,500 tokens/call (vs ~8,500-10,000 current), <800ms P50 voice-to-voice latency, ≤50% cost, 99.5% EHR write success"
evidence_url: ""
---

# Leading next-gen voice runtime evaluation

## One-line bullet (resume-ready)

Leading the technical evaluation between Pipecat and LiveKit to replace Confido's current Retell-based voice runtime for larger clients — built end-to-end STT+LLM+TTS pipelines in both frameworks, authored the multi-phase platform-replacement plan with target metrics (≤2,500 tokens/call vs ~8,500-10,000 baseline; <800ms P50 voice-to-voice latency).

## Long form (STAR — interview-ready)

**Situation**: Confido's current voice agents run on Retell — a managed platform that's been fast to ship but limits PHI handling, observability depth, and architectural control. As we move toward larger healthcare clients with stricter compliance + observability requirements, the platform decision needed to be made deliberately.

**Task**: Lead a technical evaluation comparing Pipecat and LiveKit as the next-gen voice runtime; produce a decision-ready recommendation with build evidence, not vendor brochures.

**Action**:
- **Built end-to-end STT+LLM+TTS pipelines in both Pipecat and LiveKit**, using a consistent provider matrix: Deepgram (STT), ElevenLabs (TTS), LiteLLM multi-provider routing across OpenAI / Anthropic / Gemini.
- Wired both pipelines into the same surrounding infrastructure: Upstash Redis (semantic cache for LLM responses + state), per-tenant Supabase RLS for data isolation, GCP Workload Identity Federation for keyless deploys, Sentry / PostHog / Langfuse for observability with custom PHI-scrubbing middleware.
- **Authored `my-careos-plan`** — multi-phase platform-replacement roadmap with:
  - 6 architecture decision records (Redis-as-state choice, GKE-over-Cloud-Run for voice — rejected Cloud Run due to cold starts + 60-min timeout, Pipecat framework eval rubric, Python deterministic orchestrator, Jinja2 dynamic prompt rendering, transcript classifier for proactive intent extraction)
  - Risk matrix (state races, classifier drift, HIPAA boundaries, EHR write safety) with mitigations
  - Success metrics: **≤2,500 tokens/call** (vs ~8,500-10,000 baseline), **<800ms P50 voice-to-voice latency**, **≤50% cost**, **99.5% EHR write success**
  - Shadow-mode validation strategy: run new runtime in parallel against Retell, compare on real traffic, cut over progressively
- **Designed the key architectural innovation**: Redis as source of truth for conversation state (tool responses update Redis, not conversation history). Jinja2 templates rebuild the system prompt every LLM turn from frozen state snapshots — **constant token usage regardless of call length**. Eliminates stale-context bugs that plague long calls.

**Result** (in-progress):
- **Built proof-of-architecture in both frameworks** — comparison data being collected.
- **Decision is documented and de-risked**: ADRs + risk matrix + shadow-mode plan mean the final cutover is a known sequence, not an improvisation.
- **Pending**: shadow-mode A/B in production. Final framework choice has not shipped at scale — honest framing matters more than fake "we already migrated."

## Honest framing for interviews

This is a **current strategic call**, not a shipped result. Lead with what's actually been done: the technical evaluation + architectural design + planning depth. Don't claim production cutover until shadow-mode validates.

## Tradeoffs noted

- **GKE over Cloud Run for voice agents**: rejected Cloud Run because of cold-start latency + 60-min request timeout that breaks long calls. Cost is higher; control is worth it for voice.
- **Python deterministic orchestrator over LLM-driven orchestration**: prefetch triggers, tool dispatch, and conversation routing live in Python rules — not in the LLM. Predictable, debuggable, cheap.
- **Skip Retell Agent Swap / MCP migration** (intermediate path): marginal benefit given the 3-4 week replatform timeline; Retell interim work capped at 30-40% of total architectural benefit.

## Related notes

- `[[2026-06-03-voice-ai-platforms-comparison]]` — Pipecat vs LiveKit vs Retell deep dive (domain reference)
- `[[ehr-agnostic-abstraction-layer]]` — the integration surface this voice runtime calls into

## What I'd tell an interviewer

"We're at a real decision point on our voice runtime. Retell is our current production for bigger clients — fastest to ship but limits us on PHI handling and observability depth. We're evaluating Pipecat and LiveKit as the next-gen replacement. I built end-to-end STT+LLM+TTS pipelines in both, using the same provider matrix and the same surrounding infrastructure, so the comparison is apples-to-apples on latency, fail modes, and observability cost. I also authored the multi-phase replacement plan — six ADRs, a risk matrix, success metrics (≤2,500 tokens per call vs ~8,500-10,000 today; <800ms P50 voice-to-voice latency), and a shadow-mode validation strategy. The architectural bet I'm most confident in is using Redis as source of truth for state with Jinja2 templates rebuilding the system prompt from frozen state every turn — that gives constant token usage regardless of call length. The decision itself isn't shipped at scale yet; we need shadow-mode data before we cut over."
