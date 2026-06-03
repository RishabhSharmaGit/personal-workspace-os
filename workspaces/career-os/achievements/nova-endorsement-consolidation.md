---
slug: nova-endorsement-consolidation
title: "Nova endorsement+onboarding consolidation — 90% reduction in core-module issues"
type: achievement
status: durable
tags: [insurance, refactor, architectural-ownership, nova, consolidation]
links: ["[[nova-hrms-integration-framework]]"]
source: null
confidence: high
created: '2026-06-03'
updated: '2026-06-03'
xyz:
  x: "Consolidated dispersed endorsement + onboarding logic across Nova Benefits' platform into a unified central module"
  y: "90% reduction in legit issues reported in core modules after the stabilization period — covering a user base of 250K active employees + 3K HR admins"
  z: "by designing a single source of truth for endorsement state machines, eliminating drift between flows that had organically grown apart, and establishing a robust shared architecture across the team's three engineering pods"
tech_tags: [typescript, nestjs, refactor, state-machines, architecture, multi-module]
role_slug: nova-tech-lead-sde3
metric: "90% reduction in legit issues reported in core modules"
evidence_url: ""
---

# Nova endorsement + onboarding consolidation

## One-line bullet (resume-ready)

Consolidated dispersed endorsement + onboarding logic across Nova Benefits' platform into a unified central module — drove a **90% reduction in legit issues reported in core modules** after stabilization, while serving 250K active employees and 3K HR admins.

## Long form (STAR — interview-ready)

**Situation**: Nova's endorsement and onboarding flows had grown organically across three engineering pods. The same business operation (e.g., upserting a member to a group policy) had subtly different implementations depending on which flow triggered it. The result: a steady stream of edge-case bugs that were genuinely hard to root-cause because the truth lived in many places.

**Task**: Stop fighting symptoms. Re-architect endorsement + onboarding to a single source of truth and absorb the migration cost up front.

**Action**:
- Inventoried every place the platform was performing endorsement operations and mapped the divergence. Found ~N concrete differences (slightly different validation, slightly different idempotency handling, slightly different downstream notification).
- Designed a **unified central module** in NestJS with a clear state machine for endorsement lifecycle (request → validate → submit-to-insurer → reconcile → notify).
- **Pushed every consumer flow through this central module**, retiring the duplicated implementations.
- Required cross-team coordination — PM, QA, CTO alignment, careful release sequencing to avoid breaking active enrollments.
- Established the **architectural boundary** explicitly so future flows had a single place to plug into.

**Result**:
- **90% reduction in legit issues reported in core modules** after stabilization
- Single source of truth for endorsement state — debugging time per incident dropped significantly
- Foundation for the next 18 months of feature work — new flows plugged into the central module rather than duplicating

## Why this matters for interviews

Classic "I owned an architectural change that the team had been avoiding" story. Hard metric (90%). Cross-team coordination signal (PM + QA + CTO alignment). Pairs well with the VM→Cloud Run story at Confido as a second "I drove the architectural call when the team needed it" data point.

## What I'd tell an interviewer

"At Nova, endorsement and onboarding logic had grown organically across three pods. The same operation — say, upserting a member to a group policy — was implemented slightly differently depending on which flow triggered it. We were getting a steady stream of edge-case bugs that were genuinely hard to root-cause because the truth lived in many places. I made the call to consolidate. Designed a unified central module with a clear state machine for the endorsement lifecycle, mapped every divergence, pushed every consumer flow through the new module, and retired the duplicates. It required PM, QA, CTO alignment and careful release sequencing. After stabilization, legit issues in core modules dropped 90%, and the central module became the foundation for the next 18 months of feature work."

## Related notes

- `[[nova-hrms-integration-framework]]` — companion piece; both shipped during the same SDE3 tenure
