---
slug: ehr-agnostic-abstraction-layer
title: "EHR-agnostic abstraction layer over 40+ vendor systems — self-serve clinic onboarding"
type: achievement
status: durable
tags: [healthcare, abstraction-layer, ehr-integration, self-serve, multi-tenant, confido]
links: ["[[ehr-integration-platform-40-vendors]]", "[[2026-06-03-ehr-integration-landscape]]"]
source: null
confidence: high
created: '2026-06-03'
updated: '2026-06-03'
xyz:
  x: "Built Confido's EHR-agnostic abstraction layer — voice-AI agents and FDE systems consume a single standardized API across 40+ EHR vendors"
  y: "New clinic onboarding for supported EHRs is self-serve via the CareOS dashboard (no engineering touch); cascade-search-patient, find-free-slots, post-appointment, get-changes-since work identically regardless of underlying vendor — voice agents never branch on EHR vendor"
  z: "by designing a contract-based facade in appointment-manager that maps every clinic-facing operation to vendor-specific adapter calls, building the sara-frontend self-serve UI for high-frequency per-clinic configuration (operatory schedules, blocked slots, event types, sync filters, free-slot calc logic), and keeping the database schema designed for forward extension"
tech_tags: [nestjs, abstract-base-service, multi-tenant, facade-pattern, next-js, react, supabase, rls, clerk]
role_slug: confido-founding-eng
metric: "40+ EHR vendors abstracted under one API; per-clinic configuration self-serve; voice-AI agents never branch on EHR vendor"
evidence_url: ""
---

# EHR-agnostic abstraction layer

## One-line bullet (resume-ready)

Built Confido's EHR-agnostic abstraction layer over 40+ live EHR vendors — voice-AI agents and FDE systems consume a single standardized API (`cascade-search-patient`, `find-free-slots`, `post-appointment`, `get-changes-since`, `sync-operatory-schedules`) without knowing the underlying vendor, with new-clinic onboarding self-serve via the CareOS dashboard.

## Long form (STAR — interview-ready)

**Situation**: With 40+ EHR vendors in production, every consumer (voice-AI agents, FDE systems, sync workers, internal tools) faced a combinatorial nightmare: should the patient lookup branch on Athena vs eCW vs NextGen? Should appointment posting know that Dentrix needs a different idempotency strategy than Kolla? Without a strong abstraction, the platform would fork per customer.

**Task**: Standardize the surface area consumers see, push vendor-specific concerns into the adapter layer, and make new-clinic onboarding self-serve for the high-frequency configurations.

**Action**:
- **Contract-based facade** in `appointment-manager`: every clinic-facing operation has a single, vendor-agnostic signature. Internally it dispatches to the right adapter via the EHR factory (see `[[ehr-integration-platform-40-vendors]]`).
- **Standardized operation set**: `cascade-search-patient` (search across name → DOB → phone → email cascade), `find-free-slots` (date range, operatory filter, event type filter), `post-appointment` (idempotent, partial-failure-recovery aware), `get-changes-since` (CDC-style for sync workers), `sync-operatory-schedules`, eligibility, claims, medications, labs, referrals, telecall documentation.
- **Per-vendor adapter implements only what's relevant**: returns a typed `UNSUPPORTED` signal for operations the EHR can't serve, so consumers know at request time rather than failing silently.
- **Self-serve onboarding UI** (sara-frontend + careOS-Real dashboard): clinic admins configure operatory schedules, holidays, blocked-slot scheduling, event-type mapping, appointment-type config, sync-filter rules (which operatories to sync, which to skip), free-slot calculation overrides, patient detail-update permissions, appointment change-request flows, patient-query templates — without an engineer touching the integration code.
- **Multi-tenant by design**: Clerk JWTs gate user access, Supabase RLS policies gate row access per org+location, agent fleets are scoped per tenant with pointer-flip promotion for zero-downtime rollbacks.

**Result**:
- Voice-AI agents and FDE systems never branch on EHR vendor — consumer code stayed clean as the EHR count grew 5x.
- New-clinic onboarding for supported EHRs is **self-serve** (no engineering touch) for the long tail of configuration.
- Engineering touch is now reserved for genuinely new EHR vendors (adapter add) or new operation types (contract extension) — not per-clinic customization.

## Tradeoffs noted

- Some clinic-specific or EHR-specific asks don't fit the abstraction. Handled via **80/20 product judgment**: if a workflow generalizes to 5+ clinics, build it into the abstraction; otherwise push back to configuration-based workaround or the HITL queue. See `[[trade-off-eighty-twenty-clinic-workflows]]`.
- Pure self-serve is a years-long investment. Made the call to self-serve only the high-frequency configurations and leave the long tail admin-driven. See `[[trade-off-partial-self-serve]]`.

## Related notes

- `[[ehr-integration-platform-40-vendors]]` — the adapter framework beneath this layer
- `[[2026-06-03-ehr-integration-landscape]]` — domain reference for the EHR diversity this abstracts over

## What I'd tell an interviewer

"With 40+ EHR vendors in production, the worst thing we could have done is let vendor-specific concerns leak into consumer code. So I designed a facade contract — `cascade-search-patient`, `find-free-slots`, `post-appointment`, `get-changes-since`, and so on. Voice agents and FDE systems never branch on EHR vendor; they call the contract, and the factory dispatches to the right adapter. To make the long tail tractable, I built a self-serve onboarding UI in our CareOS dashboard that covers the high-frequency clinic configurations — operatory schedules, blocked slots, event types, sync filters, free-slot calc overrides — backed by a schema designed for forward extension. Engineering touch is reserved for net-new EHR vendors or net-new operation types. Everything else clinics configure themselves."
