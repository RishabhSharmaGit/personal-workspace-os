---
slug: intake-02-experience
title: "Intake — Experience timeline"
type: note
status: draft
tags: [intake, experience]
links: []
source: null
confidence: medium
created: '2026-05-14'
updated: '2026-05-14'
---

# 02 — Experience timeline

Roles 2–5 pre-populated from `personal/resumes/2024-09-rishabh-sharma-sde3.pdf`. Role 1 (Confido) is left for you to fill manually per your instruction. Education and Misc populated where the resume had data.

Total tenure as of 2026-05: **~10 years** (Jun 2016 → present).

---

## Role 1 — Founding Software Engineer @ Confido Health

`[FROM-PDF]` ✅

- **Period**: Oct 2024 – Present (1 year 8 months as of 2026-06)
- **Location**: Bangalore and New York (employer in both), need to constantly juggle between these 2 locations
- **Domain**: Healthcare, Voice AI
- **Headline (from PDF)**: "Building Industry leading voice AI. Freeing up staff time to focus on patient care."

### Stack / tech (populated from repo digests on 03-Jun-2026)
- Languages: **TypeScript** (primary — appointment-manager, ehr-connector-service, careOS-Real backend, sara-frontend), **Go** (sara-backend, Gin web framework), **Python** (voice-agent runtime in careOS-Real, FastAPI)
- Backend frameworks: NestJS (appointment-manager), Fastify (careOS-Real backend + admin-api), Gin (sara-backend), Firebase Cloud Functions (ehr-connector-service), Prisma ORM, pgx driver, Bun monorepo (Turbo coordination)
- Frontend: Next.js (App Router) · React · Radix UI primitives + Tailwind · TanStack Query (with localStorage persist) + Zustand · custom SSE client with reconnect logic · Clerk auth · TanStack Table · FullCalendar · react-pdf
- **Voice AI runtime**: Retell (current production, including for bigger clients) → leading evaluation between **Pipecat** and **LiveKit** for next-gen (careOS-Real). End-to-end STT+LLM+TTS pipelines built in both frameworks for comparison; final choice pending shadow-mode validation.
- **Voice AI stack components**: Deepgram (STT) · ElevenLabs (TTS) · OpenAI + Anthropic + Google Gemini (LLMs) · LiteLLM (multi-provider routing + failover) · Upstash Redis (semantic cache) · Cekura (voice eval metrics + scenario generation) · Langfuse (LLM trace + eval) · Twilio (SIP, phone-number provisioning, voice webhooks, Svix signature verification)
- **Orchestration**: Temporal Cloud (sara-backend outreach workflows — make_call · send_sms · http_request · wait · conditional nodes · backfill/retry); planned Python deterministic rules engine (careOS-Real per my-careos-plan ADRs)
- **Infra / cloud**: GCP primary — Cloud Run (runtime services), GKE planned for voice agents (rejected Cloud Run for voice — cold starts + 60-min timeout), Cloud Tasks (async sync dispatch), Secret Manager + Workload Identity Federation (keyless CI/CD), GCS (fax/document storage), Cloud Logging + OTLP exporters, Memorystore Redis (call lifecycle). Firebase Cloud Functions for ehr-connector. Vercel for sara-frontend.
- **Databases**: PostgreSQL primary (Prisma in appointment-manager · pgx in sara-backend · Supabase with RLS in careOS-Real), MongoDB (sara-backend conversation state + change streams), Upstash Redis (semantic cache + careOS-Real state as source of truth), GCP Memorystore Redis (call lifecycle).
- **Queues / streaming**: GCP Cloud Tasks (sync dispatch decoupling scheduling from execution), Kafka with Avro/Schema Registry (sara-backend CDC for Postgres + Mongo change events), RabbitMQ (AMQP), MQTT via EMQX (device signaling), MongoDB change streams (real-time event propagation to frontend), SSE (low-latency transcript streaming).
- **Browser automation**: Puppeteer + stealth plugin in ehr-connector-service for legacy EHRs without proper API auth (CareStack, eCW-style — scheduled session/cookie refresh jobs).
- **Auth + tenancy**: Clerk JWTs (multi-axis RBAC) · Supabase RLS on every table · multi-tenant org+location+agent hierarchy · custom PHI-scrubbing middleware in observability layer.
- **Observability**: OpenTelemetry (OTLP traces + metrics + logs across services with resource semantics + cardinality awareness — rare for Node backends at this stage) · Sentry (custom PHI redaction) · PostHog (feature flags + product analytics) · Langfuse (LLM eval traces) · Winston + zap structured logs.
- **CI/CD**: GitLab CI (Kaniko build cache, dev/prod templates, multi-stage pipelines, Cloud Run targets), GitHub Actions (Workload Identity Federation — no long-lived keys), semantic versioning, Helm-ready pipelines.

### Accomplishments (XYZ — top 7; pick 4-5 for any given resume variant)

1. **Architected the patient-access / clinical-workflow platform from day one** ("appointment-manager") — the EHR-agnostic data + action layer that every Confido voice-AI agent and forward-deployed engineer (FDE) calls to execute the full front-office workload against a clinic's systems: appointment booking/rescheduling/cancellation, patient identity + demographics, **insurance eligibility + verification (posting to third-party payers) + prior-auth**, **payments / balance collection (RCM)**, **medication & prescription refills**, patient documents + clinical timeline, notes retrieval, and EHR read/write sync — with warm-transfer / human-in-the-loop fallback. Spans **40+ live EHR / practice-management systems**; drove growth from **3 pilot clinics at launch to 90+ live clinics in ~18 months** (Confido enabled 1M+ patients, >80% call automation; Series A $10M). Built the pluggable EHR factory: **14+ direct-API integrations** (Kolla, Athenahealth, NextGen, ModMed, Nextech, Tebra, Dentrix Ascend, MDSynergy, Greyfinch, Raintree, CompuLink, eClinicalWorks, …) + **20+ browser-automation integrations** via ehr-connector-service (CareStack and other legacy systems without API auth). Stack: NestJS · Prisma · PostgreSQL · GCP Cloud Tasks · OpenTelemetry-first observability.

2. **Cut new-EHR integration time from ~10-15 days → 2-4 days per integration** by designing a factory + abstract-base-service contract that cleanly separates protocol concerns (REST · SOAP/XML · Puppeteer browser-automation) from business logic. Result: team now ships **4-5 new EHR integrations per 2-week sprint** alongside feature work. Direct-API integrations land in 2 days end-to-end; browser-based in 3-4 days depending on supported workflow scope. See `[[ehr-integration-platform-40-vendors]]`.

3. **Built Confido's "EHR-agnostic" abstraction layer** — voice-AI agents and FDE systems consume a single standardized API (`cascade-search-patient`, `find-free-slots`, `post-appointment`, `get-changes-since`, `sync-operatory-schedules`, etc.) without knowing the underlying EHR vendor. Backed by the self-serve CareOS dashboard (sara-frontend + sara-backend) that makes new-clinic onboarding self-service for operatory schedules, holidays, blocked-slot scheduling, event/appointment types, sync-filter rules, free-slot calculation logic, patient detail changes, appointment-change requests, and patient queries. See `[[ehr-agnostic-abstraction-layer]]`.

4. **Owned reliability + cost engineering for the platform at 3x scale** — for READS: built a change-detection layer using EHR delta endpoints where available, **hash-based diffing where not** — drastically cut API-call cost under EHR rate limits and made near-real-time sync feasible (direct APIs near-real-time; rate-limited browser-based on a 15-30 min cadence). For WRITES: real-time push with exponential backoff, idempotency keys, partial-sync recovery (restart from last-successful checkpoint), dashboard + Slack + email failure alerts, and a **HITL review queue** so clinic FDEs can resolve failed auto-posts without code changes. To remove a scaling ceiling at ~30 clinics, re-architected the platform's compute topology — **split background EHR-sync workloads from the real-time voice-AI request path into independently-scaling services on GCP Cloud Run** (eliminated 5-10s deploy downtimes + sync-vs-API resource contention; keyless CI/CD via Workload Identity Federation). Platform has since scaled to **90+ clinics** with zero deploy downtime. See `[[appointment-manager-vm-to-cloudrun-migration]]`.

5. **Leading the next-gen voice-AI runtime evaluation** (careOS-Real, Apr-2026 → present) — running production evaluation between **Pipecat** and **LiveKit** to replace Retell for larger clients. **Built end-to-end STT+LLM+TTS pipelines in both frameworks** (Deepgram STT · OpenAI/Anthropic/Gemini via LiteLLM multi-provider routing · ElevenLabs TTS · Upstash semantic cache · per-tenant Supabase RLS · PHI-scrubbing in Sentry/PostHog/Langfuse · GCP Workload Identity Federation for keyless deploys · Vercel + Cloud Run hosting · per-tenant agent fleet promotion via pointer-flip for zero-downtime rollback). Authored the **multi-phase platform-replacement plan** (my-careos-plan: 6 ADRs, risk matrix, success metrics — target ≤2,500 tokens/call vs ~8,500-10,000 baseline, <800ms P50 voice-to-voice latency, ≤50% cost, 99.5% EHR write success — and shadow-mode validation strategy). Architectural innovation: **Redis as source of truth + Jinja2 prompt rendering from frozen state snapshots** — constant token usage regardless of call length. See `[[voice-runtime-pipecat-livekit-evaluation]]` and `[[2026-06-03-voice-ai-platforms-comparison]]`.

### Additional contributions (resume "Additional" line — not headline bullets)

- **Designed Confido's senior-engineer technical interview framework** (interview-generator, solo-authored) — 6 problems × 75-min phased-refactor format testing structured LLM-tool discipline rather than syntax memory; multiple internal appraisals + positive candidate feedback. See `[[confido-engineer-interview-framework]]`.
- Contributed across the voice-agent backend (sara-backend: Go/Gin, Temporal outreach workflows, Retell provisioning + call-analyzed webhook routing, MongoDB change streams, Kafka CDC) and the clinician-facing CareOS dashboard (sara-frontend: Next.js/React, SSE streaming transcripts, Clerk multi-tenant RBAC).

### Trade-offs / decisions worth interview stories

**1. Module boundary vs. separate repo for the EHR adapter layer** (architectural judgment) ⭐⭐⭐⭐

Instinct at 5+ EHR integrations was to split the adapter layer into its own repo for "clean abstraction." I deliberately kept it inside appointment-manager as a clearly-bounded NestJS module instead. Reasoning: a separate repo doubles the deploy pipeline, doubles release coordination, and adds a 2-stage rollout for every adapter change (which is high-frequency feature work). The module is designed so extraction stays a 1-week task whenever the trigger event arrives — a non-appointment consumer of the EHR layer, team scale beyond what cross-cutting reviews can handle, or deploy contention. **18 months in, 40+ EHRs later, the bet has held**; we ship 2-3x faster than the polyrepo split would have allowed.

**2. VM → Cloud Run migration with sync/API service split at ~30 clinics** (operational maturity) ⭐⭐⭐⭐

At ~30 clinics, VM-based deployment was hitting user-visible 5-10s deploy windows and a noisy-neighbor cliff where heavy EHR-sync batches starved real-time voice-AI API requests. I drove the migration to GCP Cloud Run with an explicit split: sync-worker (background EHR pulls) and API service (CareOS + voice-AI-facing). Required rebuilding the deploy pipeline (GitLab CI → Cloud Run, Workload Identity Federation for keyless CI/CD, request-scoped telemetry propagation). Outcome: **zero-downtime deploys, independent horizontal scale per tier**. We had ~3 months of headroom left on VMs at our growth rate — the replatform was decisive, not reactive.

**3. Pipecat vs. LiveKit evaluation for the next-gen voice runtime** (current strategic call) ⭐⭐⭐

We're at a decision point. Retell (current production for bigger clients) is fastest to ship but limits PHI handling and observability; Pipecat gives tighter pipeline control + better eval hooks; LiveKit has stronger WebRTC + room semantics out of the box. I built end-to-end STT+LLM+TTS pipelines in both Pipecat and LiveKit to compare latency-budget allocation, fail-mode handling, observability integration, and pluggability cost. **Final framework choice requires shadow-mode A/B in production — not yet shipped at scale.** Honest framing matters more than fake "we already migrated" claim.

**4. 80/20 on per-clinic workflow asks** (product judgment) ⭐⭐⭐

FDE/product team brings clinic-specific or EHR-specific workflow requests constantly — "this hospital wants the patient lookup to also pull X custom field from their EHR." I gate these against an 80/20 rule: if a workflow generalizes to 5+ clinics, build it; otherwise push back to a configuration-based workaround or the HITL queue. Result: integration code stays predictable; we haven't forked per customer; new clinics onboard fast.

**5. Sized every architecture choice to "next 6 months" of growth, not imagined 5-year load** (anti-premature-optimization) ⭐⭐⭐⭐

Could have introduced Kafka + Redis streams + event sourcing early in appointment-manager. Chose Cloud Tasks + PostgreSQL change-detection + REST instead. **Result**: shipped faster, never ripped out an over-engineered system. When we do need Kafka (careOS-Real has it for CDC), it'll be a planned migration not a panic.

**6. Partial self-serve + extensible-schema design** (product + infra judgment) ⭐⭐⭐

Pure self-serve is a years-long investment. Made the call to self-serve only the high-frequency clinic configurations (operatory schedules, blocked slots, event/appointment types, sync filters, free-slot calculation overrides) and leave the long-tail config admin-driven. To keep this safe long-term, invested in a database schema designed for forward extension — adding a new sync filter type or operatory attribute is a schema migration, not a data revamp. **Code is easier to change than data.**

### Notable mention (for behavioral interviews)

- **Solo design + authorship of the interview-generator** — multiple internal appraisals + positive candidate feedback. Demonstrates pedagogical judgment + thinking about how senior engineers should work with AI tools in production. See bullet 7 above.
- **Solo authorship of the my-careos-plan** — comprehensive multi-phase platform-replacement roadmap with 6 ADRs, risk matrix, success metrics, shadow-mode validation strategy. Demonstrates staff-eng-level forward-looking ownership.

---

## Role 2 — Tech Lead / SDE3 @ Nova Benefits

`[FROM-SDE3-RESUME]` ✅

- **Period**: Jul 2022 – Sep 2024 (2 years 3 months)
- **Location**: Remote — Bangalore base
- **Title at resume time**: Tech lead - SDE3
- **Domain**: Insurance / employee benefits / HR-tech
- **Scale of product**: 250,000 active employees + 3,000 HR admins served
- **Team owned**: 5-8 developers (one of three engineering teams in Nova) + a dedicated QA; collaborated with a PM

### Stack / tech
- Languages: JavaScript, TypeScript (from overall resume skills)
- Frameworks: React, Redux, Node.js, NestJs, GraphQL Apollo, REST APIs (from overall resume)
- Integration tools used explicitly: Retool app builder (custom onboarding), Razorpay SDK (web checkout), Mailmodo (email automation), WATI (WhatsApp)
- HRMS integrations shipped: Google Workspace, Zoho People, Darwinbox (resume mentions "etc.")
- Insurer integrations shipped: ICICI, CARE, GoDigit, etc (via their API kit)
- Infra likely involved: AWS and Docker
- Database: `[VERIFY — PostgreSQL most likely]`

### Accomplishments (XYZ — pulled from resume; verify metrics + claim ownership)
1. Led one of three engineering teams (5 developers), collaborating with PM, QA, and CTO on roadmap delivery
2. Owned the **endorsements module** for 250K active employees + 3K HR admins (insertion/deletion of employees to group + retail policies)
3. Consolidated dispersed endorsement + onboarding logic into a unified central module → **90% reduction in legit issues reported in core modules** ⭐ strong metric
4. Built a **highly scalable HRMS integration core framework** — any new HRMS platform integrable in **3-4 days** ⭐ strong metric (vs prior baseline `[FILL]`)
5. Integrated ICICI + CARE insurer APIs for endorsement data submission and batch tracking → **reduced endorsement TAT from 14 days to a few hours** ⭐ strong metric
6. Integrated **Razorpay SDK** for standard web checkout on retail product purchases
7. Co-owned **onboarding** of fresh client employees: built modular custom onboarding/enrollment features using Retool app builder for specific client needs
8. Built self-served mental/financial health **assessment module** for employees
9. Designed **CD Account management system** — client wallet structure for transactional needs
10. Built **Rater-based premium calculation** of policy charges + refund framework for batches of endorsed data
11. Integrated **Mailmodo** (emails) and **WATI** (WhatsApp comms) for CX
12. `[FILL — anything since the resume was last edited Sep 2024]`

### Notable interview stories
- The 90% issue-reduction story: what was the architectural decision, what failed before, how did the new structure stop it?
- The 14-day → hours TAT story: which specific batch-tracking + automated submission mechanism made the difference?
- The 3-4 day HRMS onboarding story: what's the abstraction inside the framework that made it pluggable?

---

## Role 3 — Full Stack Engineer @ YouGov

`[FROM-SDE3-RESUME]` ✅

- **Period**: Jun 2020 – Jul 2022 (2 years 1 month)
- **Location**: Remote — UK employer
- **Domain**: Market research / consumer-data / chat-based engagement
- **Scale of product**: YouGov.Chat panel size **1,200,000 users**
- **Role shape**: Individual contributor (IC) for enhancements + complex problems

### Stack / tech
- Languages: JavaScript, TypeScript
- Frameworks: React/Redux likely, Node.js (from overall resume); `[VERIFY — Vue/Nuxt at YouGov?]`
- Feature flags: **Unleash**
- Auth: **AWS Cognito** (social login)
- CMS: **StoryBlok** (headless)
- NLP: **AWS Comprehend** (opinion / foul-language filtering on user comments)
- Infrastructure: **Terraform**
- Push: notification integration
- Reward payouts: integrated a bank API

### Accomplishments (XYZ — from resume Projects section)
1. Owned end-to-end dev, maintenance, and ops for **YouGov.Chat** — chat-based engagement platform serving a **1.2M user panel**
2. Built and maintained the **in-house CMS** providing standard creation/editing/publishing flow across YouGov platforms
3. Set up **Feature Flags via Unleash** for controlled rollouts
4. Integrated **AWS Cognito** for social login
5. Integrated **StoryBlok** as a headless CMS for content management
6. Built **user comments + rating** functionality with **AWS Comprehend** filtering to detect foul language and extract opinion
7. Integrated **bank API** for distribution of user rewards (panel monetization)
8. Set up infrastructure via **Terraform**
9. Implemented **push notification** system across the platform

### Notable interview stories
- AWS Comprehend opinion-filtering story: cost vs accuracy trade-off
- Why headless CMS (StoryBlok) over a fully custom CMS
- Terraform infra story: what was the team's prior state

---

## Role 4 — Senior Software Developer / Software Developer @ Cimpress Technology

`[FROM-SDE3-RESUME]` ✅

- **Period**: Feb 2019 – Jun 2020 (1 year 5 months total)
- **Promoted to Senior**: ~Oct/Nov 2019 (resume says "within 8 months")
- **Location**: Mumbai, India
- **Domain**: Mass customization / print-on-demand; specifically embroidery software products
- **Product**: **StitchX** — automated conversion of image/artwork into machine-specific embroidery instructions

### Stack / tech
- Primary contributor + proprietor of embroidery software products (API management + dev on StitchX)
- Languages: JS/TS, C++ likely (Wasm/embroidery core typically requires it); `[VERIFY]`
- Browser performance: **WebWorkers** + **WebAssembly (Wasm)** — used to run embroidery core in client's browser via async thread-pool
- AI: mathematical / image-processing techniques for artwork → stitch-instruction conversion
- Testing: JMeter (you designed a dedicated API testing project here)
- CI/CD: pipelines maintained + upgraded over the role

### Accomplishments (XYZ — from resume)
1. Acted as **primary contributor and proprietor** of Cimpress's embroidery software product family
2. Implemented **asynchronous thread-pool-based embroidery core** running in client's browser via **WebWorkers + WebAssembly** — offloads heavy stitch-computation client-side ⭐ rare technical highlight
3. Drove requirement-gathering from production artists, feasibility tests, and delivery
4. Designed a dedicated **JMeter-based API testing project** from scratch
5. Maintained and upgraded automated test suites (unit + integration + UI) and CI/CD pipelines
6. **Promoted to Senior in ~8 months** based on project impact

### Notable interview stories
- WebAssembly story: why client-side compute, what was the latency/cost trade-off?
- Promotion story: what specifically did you ship that moved the needle?

---

## Role 5 — Product Engineer @ Seclore Technology

`[FROM-SDE3-RESUME]` ✅

- **Period**: Jun 2016 – Feb 2019 (2 years 9 months) — **first full-time role**
- **Location**: Mumbai, India
- **Domain**: Data-centric cyber-security; Information Rights Management (IRM)
- **Product**: **FileSecure** — Seclore's flagship IRM platform

### Stack / tech
- Languages: Java (from overall resume), JavaScript
- Frameworks: **J2EE, Servlets, Struts** (enterprise Java stack on the server side)
- UI: **JQuery, JQueryUI, Knockout, chart.js** (from overall resume — most of these were used here)
- Full lifecycle exposure: requirements analysis → development → QA release

### Accomplishments (XYZ — from resume Projects section)
1. Built back-end (server) + front-end across Seclore's flagship product **FileSecure**, owning the entire development lifecycle
2. Co-authored and maintained the **OU Admin dashboard** — monitoring protected files, active users, and crucial data per Organizational Unit
3. Authored multiple **responsive product pages + their backends**
4. Designed a **centralized initialization + update mechanism for PolicyServer configuration** — eliminated config-drift across distributed deployments
5. Built **installer + patch upload/validate/ready-to-fetch mechanism** for product rollouts across all client deployments
6. Designed a **License & privileges framework** for end-user access control
7. Gained hands-on experience across many JavaScript frameworks + JQuery plug-ins

### First-job context
- Notable for: rare cybersecurity / IRM domain exposure (most resumes don't have this)
- Potential referrers from this period: `[FILL — names if you stay in touch]`

---

## Education

| Field | Value | Source |
|---|---|---|
| Bachelor's institution | MIT Academy of Engineering, Alandi, Pune | `[FROM-PDF]` ✅ |
| Bachelor's degree | B.E. Electronics and Telecommunication | `[FROM-PDF]` ✅ |
| Bachelor's period | Jun 2012 – May 2016 | `[FROM-PDF]` ✅ |
| Bachelor's grade | **First Class with Distinction (66%)** | `[FROM-SDE3-RESUME]` ✅ |
| 12th board | CBSE-AISSCE | `[FROM-SDE3-RESUME]` ✅ |
| 12th school | Air Force School, Viman Nagar, Pune | `[FROM-SDE3-RESUME]` ✅ |
| 12th period | Aug 2010 – Mar 2012 | `[FROM-SDE3-RESUME]` ✅ |
| 12th grade | **71.80%** | `[FROM-SDE3-RESUME]` ✅ |
| 10th board | CBSE-AISSE | `[FROM-SDE3-RESUME]` ✅ |
| 10th school | Air Force School, 9BRD, Pune | `[FROM-SDE3-RESUME]` ✅ |
| 10th period | Apr 2008 – Mar 2010 | `[FROM-SDE3-RESUME]` ✅ |
| 10th grade | **89.30%** | `[FROM-SDE3-RESUME]` ✅ |
| Honors / awards | `[FILL]` | — |

---

## Interests / personal (from SDE3 resume)

These are useful for the "tell me about yourself" / cultural-fit portion of behavioral interviews. Pulled verbatim from the resume; verify they're still current and add anything new.

- Travel: love exploring new places, road trips, exotic destinations
- Food: obsessed with local cuisines; culinary enthusiast
- Hiking: avid hiker — completed many treks in Maharashtra
- Sports: Table-Tennis, Basketball, Badminton, Football
- Dancing: participated in many events across school + college
- Event Organisation

---

## Misc

- Side projects / consulting outside main employment? `[FILL]`
- Conferences / talks / publications? `[FILL]`
- Open-source maintainership? `[FILL]`
- Patents? `[FILL]`
