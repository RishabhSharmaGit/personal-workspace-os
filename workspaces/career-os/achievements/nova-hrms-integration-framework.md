---
slug: nova-hrms-integration-framework
title: "Nova HRMS integration framework — 10-15d → 3-4d per partner via pluggable abstraction"
type: achievement
status: durable
tags: [hrms, insurance, abstraction-layer, factory-pattern, nova, integration]
links: ["[[ehr-integration-platform-40-vendors]]"]
source: null
confidence: high
created: '2026-06-03'
updated: '2026-06-03'
xyz:
  x: "Built a scalable HRMS integration core framework at Nova Benefits"
  y: "Any new HRMS platform integrable in 3-4 days vs prior ~10-15 day per-partner baseline (e.g. Google Workspace, Zoho People, Darwinbox)"
  z: "by designing a contract-based abstraction over HRMS APIs that separated protocol concerns from business logic — new partner onboarding became adapter-only work, with the rest of the platform untouched"
tech_tags: [typescript, nestjs, factory-pattern, abstract-base-service, hrms, integration]
role_slug: nova-tech-lead-sde3
metric: "10-15 days → 3-4 days per new HRMS integration"
evidence_url: ""
---

# Nova HRMS integration framework

## One-line bullet (resume-ready)

Built Nova Benefits' HRMS integration core framework — a contract-based abstraction over partner APIs that cut new-HRMS-platform onboarding from ~10-15 days to 3-4 days. Shipped integrations with Google Workspace, Zoho People, Darwinbox, and others on the same plug-in pattern.

## Long form (STAR — interview-ready)

**Situation**: Nova's product owns endorsement (employee upsertion/deletion to insurance policies) and onboarding flows for 250K+ active employees and 3K+ HR admins. Every employee enrollment depends on pulling fresh employee data from the client's HRMS — Google Workspace, Zoho People, Darwinbox, and several others. Each new HRMS partner was a 10-15 day bespoke project, and clinic-side teams couldn't predict integration timelines for sales conversations.

**Task**: Stop treating each HRMS as a fresh integration. Make new-partner onboarding a predictable line item.

**Action**:
- Designed a **contract-based abstraction** over the HRMS layer: every partner adapter implements a single interface listing the operations Nova's platform actually needs (`list-employees`, `get-employee`, `subscribe-changes`, etc.).
- Consumer code (endorsement workers, onboarding flows, reconciliation jobs) calls the contract; the factory dispatches to the right adapter.
- **Per-adapter complexity is confined**: auth, rate-limiting, retry, schema-mapping all stay inside the adapter. Downstream consumers never branch on HRMS vendor.
- Documented an onboarding playbook for new partners: API discovery → auth setup → adapter scaffold → operation mapping → smoke tests → production cutover.

**Result**:
- **New HRMS integration time: ~10-15 days → 3-4 days**
- Integrations shipped on this framework: **Google Workspace, Zoho People, Darwinbox, etc.**
- Sales team got predictable integration timelines for sales conversations
- Same framework pattern later inspired the EHR factory at Confido — see `[[ehr-integration-platform-40-vendors]]`

## Why this matters for interviews

This is the **first time** I shipped this kind of multi-vendor abstraction. The same pattern shows up later at Confido for EHRs. For staff-eng interviews, having solved this problem class **twice across different verticals** signals pattern-thinking, not just one-off success.

## What I'd tell an interviewer

"At Nova, every new HRMS integration was a 10-15 day bespoke project — Google Workspace, Zoho People, Darwinbox, all of them. The clinic-side teams couldn't predict integration timelines, which hurt sales. I designed a contract-based abstraction: each adapter implements a single interface — list-employees, get-employee, subscribe-changes — and downstream consumers call the contract, not the partner. Per-partner auth, rate-limiting, retry, schema-mapping all stay inside the adapter. New HRMS integration time dropped to 3-4 days, and the same framework pattern later became the template for how we handle 40+ EHRs at Confido."

## Related notes

- `[[ehr-integration-platform-40-vendors]]` — same pattern at Confido for EHR integrations (parallel story; cross-link explicitly)
