---
slug: 2026-06-03-voice-ai-platforms-comparison
title: "Voice AI platforms — Pipecat vs LiveKit vs Retell deep dive (interview readup)"
type: note
status: durable
tags: [research, voice-ai, pipecat, livekit, retell, interview-prep, confido]
links: ["[[voice-runtime-pipecat-livekit-evaluation]]"]
source: null
confidence: high
created: '2026-06-03'
updated: '2026-06-03'
---

# Voice AI platforms — Pipecat vs LiveKit vs Retell

Domain-knowledge readup so you can speak confidently about voice-AI platform choices in interviews. Focused on what an experienced engineer needs to credibly defend the Pipecat/LiveKit evaluation work.

## The stack — what a voice agent is, end to end

```
caller dials in ─► telephony (Twilio SIP / WebRTC / SIP trunk)
                     │
                     ▼
              voice runtime / orchestrator
                ─ STT (transcribe speech → text)
                ─ VAD (detect speech vs silence)
                ─ turn-taking / barge-in (when does agent start/stop)
                ─ LLM (generate response text)
                ─ tool use (call DB, EHR, schedulers — sync or async)
                ─ TTS (text → speech audio)
                ─ stream audio back to caller
                     │
                     ▼
                  state store
                ─ conversation history (or NOT — see Confido's frozen-state approach)
                ─ tool-call results
                ─ session metadata
```

**Latency budget for human-like turn-taking**: industry target is ~800ms total voice-to-voice (caller stops talking → agent starts talking). Breakdown:
- ~200ms STT (first token to streaming partial)
- ~400ms LLM (first token)
- ~150ms TTS (first audio byte)
- ~50ms VAD/turn-detect + network overhead

Anything over 1s feels robotic. Anything over 1.5s feels broken.

## The 3 platforms

### Retell (managed, Confido's current production)

- **Model**: SaaS / managed — you give Retell prompt + tool-spec + voice config; they run the call.
- **Strengths**: Fastest to ship, no infra. Built-in call_analyzed webhook for post-call analysis (transcript, outcome, reason enums, sentiment). Decent observability for the price.
- **Weaknesses**: Limited PHI handling control. Limited observability depth (no native traces into the LLM call chain). Vendor lock-in. Less control over barge-in / interruption / turn-taking quirks. You can't easily inject custom routing logic mid-call.
- **Verdict in 2026**: Excellent for "I want a voice agent in 2 weeks." Worse for compliance-heavy, low-latency, deeply-instrumented use cases.

### Pipecat 1.0 (open-source Python pipeline framework)

- **Model**: Open-source Python framework (by Daily.co). You wire a pipeline of frames — STT frames in, LLM frames in middle, TTS frames out. You own the runtime, the deploy, the observability.
- **Strengths**: Pluggable everything — swap Deepgram for Whisper, OpenAI for Anthropic, ElevenLabs for Cartesia. Native streaming. Strong eval hooks. Cleaner Python control flow for deterministic orchestration. Active project (Daily.co's first-class effort).
- **Weaknesses**: You own the deployment. WebRTC story works but isn't as turnkey as LiveKit's. Smaller community than LiveKit. Less batteries-included for room/conferencing semantics (you don't need those for healthcare phone calls anyway).
- **Verdict**: Best when you want pipeline control, custom observability, and the option to swap providers freely. Aligns with Confido's careOS-Real architecture decisions (Redis-as-state, Python deterministic orchestrator).

### LiveKit (open-source / managed; WebRTC-first)

- **Model**: Open-source WebRTC platform with a voice-agent SDK on top. Strong room/conferencing semantics. Managed Cloud option available.
- **Strengths**: Turnkey WebRTC + room semantics. Production-proven at scale. Good telephony bridge (SIP gateway). Strong client SDKs (web + iOS + Android). Voice-agent SDK is more "batteries-included" than Pipecat.
- **Weaknesses**: More opinionated about the runtime shape. Pipeline customization is doable but you push against the framework's defaults. The room-first model is overkill for 1:1 phone calls.
- **Verdict**: Best when you want production-grade WebRTC + multi-party voice + a managed control plane. Less customization than Pipecat but more out-of-the-box.

## Pipecat vs LiveKit — the actual evaluation lens

Things to compare in shadow-mode A/B:

| Dimension | What to measure |
|---|---|
| Voice-to-voice P50 latency | end-to-end, after caller stop talking → agent first audio byte |
| Voice-to-voice P95 latency | tail matters more than median for caller perception |
| Barge-in correctness | does interrupting the agent feel natural? |
| Turn-taking robustness | false starts, awkward silence, talking-over rates |
| Fail-mode handling | what happens when STT drops? LLM times out? TTS lags? |
| Observability cost | how easy to wire OTel / Sentry / Langfuse into the runtime? |
| Provider-swap cost | swapping Deepgram → Whisper: hours or days? |
| Tool-call latency | how long from LLM-decides-to-call-EHR → caller hears response? |
| Deployment ops cost | container shape, GPU vs CPU, autoscaling story |
| Compliance hooks | PHI redaction, audit trail, retention windows |
| State management | do you own it? framework owns it? |

## STT, TTS, LLM provider choices (independent of runtime framework)

### STT (speech-to-text)
- **Deepgram** — current production. Streaming, low-latency, healthcare-tuned models. Solid choice.
- **Whisper (OpenAI)** — high accuracy, slower; great for non-real-time. Self-hosted Whisper for cost / privacy.
- **AssemblyAI** — good accuracy, mid-tier latency, healthcare verticalization.
- **Google STT (Cloud Speech)** — mature, healthcare model available, varies by region.

Pick based on latency floor + healthcare-vocabulary accuracy + cost per minute.

### TTS (text-to-speech)
- **ElevenLabs** — current production. High quality voices, streaming, fast first-byte. Cost is real.
- **Cartesia** — newer, very fast (sub-100ms first byte). Watch for adoption.
- **Deepgram Aura** — strong if already on Deepgram (single vendor billing).
- **Azure / Google TTS** — mature, cheaper, voice quality slightly behind ElevenLabs but improving.

### LLMs
- Multi-provider via **LiteLLM** is the right call — gives failover, cost routing, semantic caching (Upstash Redis layer).
- **OpenAI** (GPT-4o family, GPT-5 family) — strong tool-call support, healthcare-safe with BAA.
- **Anthropic** (Claude Sonnet / Opus / Haiku) — best context handling, BAA available; Haiku is the right pick for fast classification subtasks (the transcript classifier in Confido's planning ADRs).
- **Google Gemini** — strong on long context, multimodal, cheaper for some workloads.

## Confido's specific architectural innovations (per `my-careos-plan` ADRs)

These are the talking points where you have the strongest credible authority:

1. **Redis as source of truth for state** — tool responses update Redis state, not conversation history. Means the LLM prompt can be rebuilt from current state every turn, ignoring history bloat.
2. **Jinja2 templates rebuild the system prompt from frozen state snapshots every turn** — constant token usage regardless of call length. Eliminates stale-context bugs. Predictable cost.
3. **Python deterministic orchestrator over LLM-driven routing** — prefetch triggers, tool dispatch, conversation routing live in Python rules. Cheaper, debuggable, deterministic.
4. **Transcript classifier (Claude Haiku) running in parallel with the main LLM** — proactive intent/entity extraction so the main LLM gets pre-extracted context rather than re-deriving every turn.
5. **GKE over Cloud Run for voice agents** — rejected Cloud Run due to cold starts + 60-min request timeout. Cost is higher; voice control is worth it.

## Eval frameworks worth name-dropping

- **Langfuse** — LLM trace + eval (you use this for sara-backend + careOS-Real).
- **Cekura** — voice-specific eval metrics (sentiment, escalation, outcome) + scenario generation.
- **Custom shadow-mode harness** — replay production calls against new runtime, diff outcomes.

## Interview talking-track skeleton

> **Q: How would you design a production voice AI system for healthcare?**
>
> A: The three layers — telephony (Twilio SIP), runtime (STT + LLM + TTS pipeline), and state. The hard parts are latency budget allocation (sub-800ms voice-to-voice target), barge-in / turn-taking, PHI handling end-to-end, and observability that doesn't blow your cost budget. I'd start by deciding *runtime framework*: Pipecat for control + pluggability, LiveKit for turnkey WebRTC, Retell as a managed fallback. For Confido specifically we're evaluating Pipecat vs LiveKit — built end-to-end pipelines in both. The architectural bet I'd defend is Redis-as-state-of-truth with Jinja2-rendered prompts from frozen state every turn — gives you constant token usage regardless of call length, eliminates stale-context bugs, and makes cost predictable.

> **Q: How do you keep latency under 800ms?**
>
> A: Budget allocation. STT streaming partials so the LLM can start before the caller's done. Pipeline LLM calls (small fast classifier for intent, then bigger LLM for response). Cache predictable tool calls (semantic cache via Upstash Redis or similar) — if the same patient asked the same eligibility question 5 minutes ago, skip the round-trip. TTS first-byte streaming. And kill Cloud Run cold starts — GKE with min-instances or always-warm pools for the voice path.

> **Q: How do you handle barge-in?**
>
> A: VAD detects caller speech; runtime cuts the TTS stream. Pipecat handles this natively; Retell's barge-in is mostly opaque. Edge cases: false barge-ins from background noise (need confidence threshold), and barge-during-tool-call (state has to roll back cleanly).

> **Q: PHI handling?**
>
> A: Three layers — at rest (Supabase RLS, encrypted columns where needed), in transit (TLS everywhere, signed webhook verification), and in observability (custom redaction in Sentry / PostHog / Langfuse before any event leaves the runtime). Audit-events table records every PHI access. BAA with every vendor (OpenAI, Anthropic, Deepgram, ElevenLabs all have BAAs).

## Further reading (when you have time)

- Pipecat docs: https://docs.pipecat.ai
- LiveKit Agents: https://docs.livekit.io/agents/
- Daily.co's voice-AI blog (Pipecat origin) — they post good technical content
- The Deepgram blog on latency budgets
- HIPAA + voice-AI compliance whitepapers (Vanta + Drata both have decent overviews)
