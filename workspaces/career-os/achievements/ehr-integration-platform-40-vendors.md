---
slug: ehr-integration-platform-40-vendors
title: "EHR integration platform — 40+ vendor adapters with 2-4 day onboarding"
type: achievement
status: durable
tags: [healthcare, ehr-integration, abstraction-layer, architecture, confido, voice-ai-adjacent]
links: ["[[ehr-agnostic-abstraction-layer]]", "[[appointment-manager-vm-to-cloudrun-migration]]", "[[2026-06-03-ehr-integration-landscape]]"]
source: null
confidence: high
created: '2026-06-03'
updated: '2026-06-03'
xyz:
  x: "Architected Confido's EHR integration platform spanning 40+ live healthcare practice-management / EHR systems"
  y: "Team ships 4-5 new EHR integrations per 2-week sprint vs prior ~10-15 day per-integration baseline; direct-API integrations land in 2 days end-to-end, browser-based in 3-4 days; 90+ clinics live in production"
  z: "by designing a factory + abstract-base-service contract in NestJS that cleanly separates protocol concerns (REST · SOAP/XML · Puppeteer browser-automation) from business logic — pluggable adapter pattern confines new-EHR onboarding to the adapter module without touching downstream consumers"
tech_tags: [typescript, nestjs, firebase-functions, puppeteer, soap-xml, rest, factory-pattern, abstract-base-service, retell-sdk]
role_slug: confido-founding-eng
metric: "10-15 days → 2-4 days per EHR integration; 40+ live EHRs; 90+ clinics in production"
evidence_url: ""
---

# EHR integration platform — 40+ vendor adapters

## One-line bullet (resume-ready)

Architected Confido's EHR integration platform spanning 40+ live healthcare practice-management systems by designing a factory + abstract-base-service contract that cleanly separates protocol concerns (REST · SOAP/XML · Puppeteer browser-automation) from business logic — cut new-EHR integration time from ~10-15 days to 2-4 days, enabling the team to ship 4-5 new integrations per 2-week sprint.

## Long form (STAR — interview-ready)

**Situation**: When I joined Confido (Oct 2024), each new EHR integration was a bespoke 10-15 day project. The clinic-onboarding pipeline was bottlenecked by integration capacity, and EHR-specific code was bleeding into every consumer (voice agents, FDE systems, sync workers).

**Task**: Make EHR integration a predictable line item rather than the critical path — without forking the codebase per vendor.

**Action**:
- Designed a factory pattern in `appointment-manager`: each EHR vendor registers an adapter implementing a single `AbstractEHRService` contract. Consumer code talks to the contract, never the vendor.
- Created `ehr-connector-service` (Firebase Cloud Functions) as a sister service for browser-automation-based EHRs (CareStack, eCW, etc.) — same factory + contract pattern but isolated runtime for Puppeteer sessions + scheduled cookie refresh.
- Standardized the contract around the operations the platform actually uses: `cascade-search-patient`, `find-free-slots`, `post-appointment`, `get-changes-since`, `sync-operatory-schedules`, eligibility, claims, telecall documentation, task creation.
- Documented the per-EHR onboarding playbook: API discovery → auth setup → adapter scaffold → workflow mapping → smoke tests → production cutover.
- Built a HITL review queue for failed writes so clinic FDEs can intervene without code changes.

**Result**:
- **14+ direct-API integrations** live: Kolla, Athena, NextGen, ModMed, Nextech, Tebra, Dentrix Ascend, MDSynergy, Greyfinch, Raintree, CompuLink, etc.
- **20+ browser-based integrations** live: CareStack, eCW (eClinicalWorks), AdvancedMD, Eyefinity, Optimantra, PracticeFusion, Revolution, Silkone, Spry, WebPT, etc. (~45 endpoints implemented across the connector service)
- **90+ clinics in production**, hundreds to 5,000+ voice-AI calls/day per clinic
- **New EHR integration time**: 2 days (direct API) / 3-4 days (browser-based) — down from 10-15 days
- Team ships **4-5 new integrations per 2-week sprint** alongside feature work

## Tradeoffs noted

- Kept EHR adapter code inside `appointment-manager` (not a separate repo) to avoid 2x deploy pipeline + release coordination overhead. The module boundary is designed so extraction stays a 1-week task whenever the trigger event arrives. See `[[trade-off-monorepo-ehr-adapters]]` (forward link).

## Related notes

- `[[appointment-manager-vm-to-cloudrun-migration]]` — operational migration that scaled this from 30 to 90+ clinics
- `[[ehr-agnostic-abstraction-layer]]` — the standardized API the factory backs
- `[[2026-06-03-ehr-integration-landscape]]` — domain reference (why EHR integrations are hard, eCW deep-dive)
