---
slug: interview-prep-common
title: "Interview prep — common reference"
type: interview-prep
status: draft
tags: [interview-prep, reference, system-design, behavioral, dsa]
links: []
source: null
confidence: medium
created: '2026-05-14'
updated: '2026-05-14'
---

# Interview prep — common reference

Cross-company reference for systems / behavioral / DSA prep. Per-company specifics live in `interview-prep/{company}/notes.md`.

## Senior IC interview surfaces (most common loops in 2026)

| Surface | Typical time | Format | Common bar |
|---|---|---|---|
| Recruiter / Phone screen | 30 min | conversational + 1-2 light technical | resume + culture + comp expectation |
| Technical screen | 45-60 min | coding (DSA-lite or take-home) | typically LC-medium or refactor task |
| System design | 60-90 min | whiteboard / Excalidraw / Miro | scope → API → data model → scaling → trade-offs |
| Code architecture / review | 60 min | walk through your code or theirs | reasoning, style, debugging instincts |
| Behavioral / values | 45 min | STAR-format past stories | leadership, conflict, decision-making |
| Bar-raiser / hiring-manager | 30-45 min | open conversation | calibration on level + trajectory |
| Cross-functional (PM / Design) | 30 min | how you collaborate | empathy + communication |

## System design — pattern library

The default frame I use during the interview (45-60 min budget):

1. **Clarify scope** (5 min) — functional + non-functional reqs; cap traffic / data / latency / cost
2. **Sketch high-level API** (5 min) — endpoints, payload shapes, auth
3. **Data model** (5 min) — tables / collections + indexes; relationships
4. **Component diagram** (10 min) — services, queues, caches, databases
5. **Scaling pass** (10 min) — bottlenecks, sharding, read/write paths, CDN, caching levels
6. **Reliability + observability** (5 min) — failure modes, retries, idempotency, alerts
7. **Trade-offs explicit** (5 min) — what you'd do differently at 10x scale; ROI of each component
8. **Q&A** (5-10 min)

**Don't:** monologue. Pause at each step, re-confirm with interviewer.

### Common system-design topics to drill

- Rate limiter
- URL shortener
- Pub/sub system (Kafka-like)
- Newsfeed / timeline (push vs pull)
- Distributed cache (Redis-like)
- Chat (1:1 + group)
- Search-as-you-type (autocomplete)
- Notification system
- Document collaboration (Google-Docs-like, CRDT vs OT)
- Real-time bidding (low-latency)
- Voice AI agent pipeline (relevant to your current work — own this topic)
- LLM inference platform (relevant — own this topic)

`[FILL — your top 5 to drill first]`

## Behavioral — STAR story bank

These are the 8 questions you should have a strong answer for. Each maps to one or more achievements in `achievements/`.

| Question pattern | Story to use | Achievement file to seed it |
|---|---|---|
| Toughest technical problem you solved | `[FILL]` | `[FILL]` |
| Time you disagreed with a senior person | `[FILL]` | `[FILL]` |
| Tradeoff between perfect and shipped | `[FILL]` | `[FILL]` |
| Failed project / something you'd do differently | `[FILL]` | `[FILL]` |
| Time you led without authority | `[FILL]` | `[FILL]` |
| Time you mentored / hired / leveled up someone | `[FILL]` | `[FILL]` |
| Conflict with a peer / product partner | `[FILL]` | `[FILL]` |
| Most impactful decision in last 12 months | `[FILL]` | `[FILL]` |

Use STAR: **S**ituation → **T**ask → **A**ction → **R**esult. 90s spoken length per story.

## DSA — minimum drill set

For senior IC, DSA usually = 1 LC-medium or a refactor. Don't over-invest, but maintain:

- Arrays / strings (two-pointer, sliding window)
- Hashmap patterns
- Trees / graphs (BFS, DFS, topo, Dijkstra)
- Dynamic programming (1D + 2D)
- Heap / priority queue
- Binary search (incl. on answer)
- LRU / LFU cache impl

**1 LC-medium / day for ~2 weeks** is usually enough at senior level. Don't grind LC-hard; it's table-stakes-checking, not differentiator.

## Take-homes — anti-pattern checklist

If asked for a take-home of >4 hours, push back or skip. For shorter ones:

- [ ] Use the language they prefer (signaling matters)
- [ ] Include a README with: how to run, decisions made, trade-offs, what you'd do with more time
- [ ] Write tests proportional to the codebase
- [ ] Don't over-engineer abstractions for the demo size
- [ ] Submit on time, even if incomplete — sandbag is worse than late

## Compensation negotiation prep

- Know your floor and walkaway (see `intake/05-target-roles.md`)
- Always defer comp until after they make an offer ("I'd like to learn more about the role first")
- Get the full TC: base + bonus + equity (vesting schedule, refresh policy) + relocation + signing
- Levels.fyi for benchmarks; for India, ask in Slack/Discord communities you trust
- Multiple offers is leverage — try to compress timelines so they land in the same week

## Common mistakes to avoid

- Skipping clarifying questions in system design (signals "I jump to solutions")
- Reciting STAR mechanically — interviewers can tell. Tell stories that include genuine emotion / stakes
- Asking "do you have any concerns?" at end of every interview (over-coached)
- Not asking your own questions — every loop should end with you having 2-3 thoughtful ones

## Per-company prep template

When you create `interview-prep/{company}/notes.md`, copy structure from [`TEMPLATES.md`](../TEMPLATES.md#interview-prep).
