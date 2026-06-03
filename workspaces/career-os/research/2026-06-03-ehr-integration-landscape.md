---
slug: 2026-06-03-ehr-integration-landscape
title: "EHR integration landscape — why it's hard, why eCW is famously hard (interview readup)"
type: note
status: durable
tags: [research, healthcare, ehr-integration, ecw, eclinicalworks, interview-prep, confido]
links: ["[[ehr-integration-platform-40-vendors]]", "[[ehr-agnostic-abstraction-layer]]"]
source: null
confidence: high
created: '2026-06-03'
updated: '2026-06-03'
---

# EHR integration landscape — why it's hard, why eCW is famously hard

Domain-knowledge readup for the EHR-integration bullets on your resume. Healthcare integrations are a rare skillset — most engineers haven't done this. Speaking credibly about *why* it's hard signals depth.

## The EHR market shape (2026)

| Vendor | Market position | Integration style |
|---|---|---|
| **Epic** | ~30-35% market share (largest, hospital-dominant) | FHIR R4 + proprietary APIs; BAA + Epic-on-FHIR program required |
| **Cerner / Oracle Health** | ~25% (acquired by Oracle 2022) | FHIR R4; HL7 v2; proprietary REST |
| **athenahealth** | Major ambulatory player | REST APIs, generally cleaner than peers |
| **eClinicalWorks (eCW)** | Major ambulatory player | **SOAP + proprietary; famously hard — see below** |
| **NextGen** | Mid-market ambulatory | REST + HL7 v2 hybrid |
| **ModMed (Modernizing Medicine)** | Specialty (derm, ortho, ophth) | REST APIs + Aqua payments |
| **Nextech** | Specialty (derm, plastic surgery) | REST APIs |
| **Tebra** (Kareo+PatientPop merger) | Small-practice market | REST APIs |
| **AdvancedMD** | Small/mid practices | REST + browser-based fallback |
| **CareStack** | Dental | Often browser-automation territory |
| **Dentrix Ascend** | Dental (Henry Schein) | REST APIs |
| **Kolla** | Modern abstraction over many EHRs | Clean REST — the easy ones |
| **PracticeFusion** | Ambulatory (Allscripts → Veradigm) | Historical FHIR support; limited |
| **eyefinity** | Optometry | Often legacy auth + browser fallback |
| **Optimantra** | Specialty | Variable |
| **WebPT** | Physical therapy | REST APIs |
| **Greyfinch** | Orthodontics | Modern REST |
| **MDSynergy** | Specialty | REST |
| **Raintree** | PT/OT | REST + legacy SOAP |
| **CompuLink** | Specialty | REST + legacy |

There are ~50+ EHR systems in the US ambulatory market alone. Many specialty practices use vertical-specific EHRs you've never heard of.

## Why EHR integrations are hard (the universal problems)

### 1. Auth diversity
- Some EHRs use OAuth 2.0 (modern). Others use API keys. Others require session cookies that expire every N minutes (must refresh via browser automation). Athena's flow alone has 3 distinct auth paths depending on which API you're calling.
- **BAA (Business Associate Agreement)** required before you can touch real PHI. Vendor onboarding for production access often takes weeks to months.

### 2. Rate limits
- Most EHRs rate-limit aggressively (10 req/min to 100 req/min typical). Some don't publish rate limits — you discover them when you get throttled.
- Cost per API call is real on some platforms. Sync strategies must minimize calls (delta endpoints, hash-based change detection — exactly what Confido's appointment-manager does).

### 3. Schema diversity
- Even within FHIR (the "standard"), real-world implementations vary wildly. Athena's Patient resource isn't exactly Cerner's Patient resource isn't exactly Epic's Patient resource.
- Non-FHIR EHRs invent their own data models. Your "EHR-agnostic" abstraction has to map every one of them to your canonical shape.

### 4. Protocol diversity
- **REST** (modern, easy) — Athena, NextGen, ModMed, Tebra
- **FHIR R4 / Bulk FHIR** — Epic, Cerner, increasingly common
- **SOAP / XML** — eCW (still), some Cerner legacy endpoints, some hospital-grade systems
- **HL7 v2** (pipe-delimited messages over MLLP) — legacy hospital integrations
- **Browser automation** (Puppeteer) — for systems with no public API or restricted API access (CareStack, eCW partial, AdvancedMD certain workflows)

### 5. Write safety
- **Idempotency** is the killer requirement. If your post-appointment fails halfway, you can't post again blindly — you might double-book the patient. Every write needs an idempotency key, and your retry logic has to be safe even if the EHR returns "success" after a network timeout.
- **Eventual consistency** — some EHRs lag in returning the change you just wrote. Your sync layer has to handle "I wrote X, but reading shows X-1" gracefully.

### 6. Compliance
- HIPAA (US), GDPR (EU patients), state-level rules (CA, TX). Every PHI byte needs encryption at rest, encryption in transit, audit trail, retention policy, BAA-covered transmission.
- Logs can't contain PHI. Observability stacks need redaction at the source. Sentry + PostHog need custom scrubbing layers.

### 7. Operational unpredictability
- EHRs have downtime — sometimes scheduled (weekend maintenance), sometimes not. Your integration needs to gracefully fail and queue retries.
- Schema drift — a vendor pushes a "minor" API change and your adapter breaks at 3 AM. Need contract tests + monitoring.

## Why eCW (eClinicalWorks) is famously hard

This is your bullet's defensibility. When asked "what's the hardest EHR you've integrated with?" — eCW is a credible, well-known answer.

**Specific reasons:**

1. **SOAP/XML transport** in a REST world — fast-xml-parser + custom envelope handling. Most modern engineers don't know SOAP anymore.
2. **Aggressive rate limits** with little documentation — discovery happens through 429s. Hard to estimate sync windows.
3. **Sandbox access is gatekept** — getting a real test environment requires partnership status, NDA, and proof-of-product. Weeks to months for first sandbox.
4. **Auth model**: session-based with short expiry; you need a session-refresh layer. Multi-step OAuth-like flow but not actually OAuth.
5. **Schema quirks** — fields that are documented as required but actually optional, and vice versa. Date formats inconsistent across endpoints. Patient identifiers used differently per endpoint.
6. **Limited writeback APIs** — many workflows that exist in the UI don't have API equivalents. Browser automation is sometimes the only way.
7. **Documentation gaps** — official docs are often outdated; community knowledge lives in vendor-partner Slack channels and reverse-engineered Postman collections.
8. **Slow ticketing** — when something breaks, vendor support response time is days, not hours.

**What you actually built to handle it:**
- Adapter implementing both REST-where-available and Puppeteer-where-not patterns
- Session-refresh worker keeping browser-automation cookies valid
- Schema-quirk handling in the adapter (e.g., normalizing inconsistent date formats)
- Rate-limit-aware queueing (token-bucket per endpoint)
- HITL fallback for writes the adapter can't do safely

**How to talk about it in an interview:**

> "eCW is famously hard for a few reasons. The transport is SOAP/XML, which means you're parsing envelopes in a world where everyone else uses REST. Authentication is session-based with short expiry, so you need a session-refresh layer running in the background. Rate limits aren't well-documented — you discover them through 429s and have to back off accordingly. Some critical workflows don't have API equivalents at all, so you complement the API integration with browser automation for those gaps. We've built our adapter to mix REST where available, Puppeteer where not, with a token-bucket rate limiter per endpoint and a HITL queue for the few writes that aren't safe to automate."

## Multi-tenant EHR adapter patterns

The pattern Confido uses (and that you'd defend in an architecture interview):

1. **Factory + Abstract Base Service**
   - One `EHRFactory` keyed by vendor identifier
   - One `AbstractEHRService` contract listing every operation the platform needs
   - Per-vendor adapter implements only the operations that vendor supports; returns typed `UNSUPPORTED` for the rest
2. **Configuration over code for per-clinic variation** — sync filters, operatory schedules, holidays, event-type mapping live as data, not as adapter code
3. **EHR-agnostic facade for consumers** — voice agents and FDE systems call the facade, never the adapter directly
4. **Per-vendor session/auth state** isolated — one vendor's auth refresh failure can't affect another's

## Common workflow operations the platform supports (Confido's API surface)

- `cascade-search-patient` (cascade: phone → DOB → name → email)
- `find-free-slots` (date range, operatory filter, event type filter, duration)
- `post-appointment` (idempotent, with partial-failure recovery)
- `update-appointment` (status change, time change, operatory change)
- `get-changes-since` (CDC-style for sync workers)
- `sync-operatory-schedules` (operatory + provider availability + holidays + blocked slots)
- `eligibility-check` (insurance/payer verification — varies per EHR)
- `medication-list`, `lab-results`, `referrals`
- `telecall-documentation` (post-call note injection)
- `task-create` (create EHR task from voice-agent outcome)
- `patient-demographics-update`

## Compliance talking points

- **HIPAA + BAA**: every vendor in the chain (EHRs, voice AI providers, observability) needs a signed BAA. PHI never crosses a non-BAA boundary.
- **PHI in logs**: scrubbed at source. Sentry has custom redaction. PostHog feature-flag events strip identifiers. Langfuse traces redact patient names.
- **Retention windows**: codified in DB migrations — call transcripts retained N days, then deleted; audit events kept longer for compliance.
- **Audit trail**: every PHI access logged with actor + tenant + timestamp.
- **Encryption**: at rest (Supabase Postgres + GCP Secret Manager for KEK), in transit (TLS everywhere, signed webhooks via Svix), in observability (PHI-scrubbing middleware before any export).

## Interview talking-track skeletons

> **Q: How would you design integration with multiple EHR systems?**
>
> A: Factory + abstract base service. Single contract listing every operation the platform needs (cascade-search-patient, find-free-slots, post-appointment, get-changes-since, sync-operatory-schedules, eligibility, etc.). Per-vendor adapter implements only what that EHR supports — returns typed `UNSUPPORTED` for the rest, so consumers can fall back gracefully. Consumer code (voice agents, FDE systems, sync workers) calls the abstract contract, never the vendor. Keeps the EHR count from leaking into business logic.

> **Q: How do you keep EHR sync reliable at scale?**
>
> A: Idempotency for writes — every post has an idempotency key, retry-safe even if the EHR returns success after a network timeout. Exponential backoff with jitter. Partial-sync recovery so if a 5,000-record sync fails halfway, you restart from the last successful checkpoint, not from scratch. Delta endpoints where the EHR provides them; hash-based change detection where they don't — drastically cuts API costs given vendor rate limits. Alerting on stuck syncs (dashboard + Slack + email). HITL review queue for writes the adapter can't do safely.

> **Q: How do you handle the long tail of EHR vendors?**
>
> A: The 80/20 rule. If a workflow generalizes to 5+ clinics, build it into the abstraction. If it's specific to one clinic or one EHR, push back to configuration-based workaround or HITL queue. New EHR vendor integration goes from ~10-15 days to 2-4 days because the adapter contract is stable — only protocol concerns differ. We're at 40+ EHRs in production with the same small team that started.

## Further reading

- HL7 FHIR R4 specification: https://hl7.org/fhir/R4/
- Epic's documentation portal (public): https://fhir.epic.com
- Bulk FHIR (FHIR Bulk Data Access) — the standard for large-scale sync
- HIPAA Security Rule + HITECH Act — Wikipedia overviews are decent starting points
