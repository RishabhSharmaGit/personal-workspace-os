---
slug: master-resume
title: "Master resume (human-readable mirror)"
type: resume
status: draft
tags: [master, resume]
links: []
source: null
confidence: medium
created: '2026-05-14'
updated: '2026-05-14'
resume_kind: master
---

# Master resume — human-readable mirror

The canonical resume is `master.resume.json` (JSON Resume v1 schema). This `.md` is the human mirror for quick scanning and a stable `[[master-resume]]` wikilink target.

**This is the MASTER reservoir — exhaustive. JD-specific cuts are derived from it under `resumes/variants/`.** Roles populated from repo digests + `personal/resumes/2024-09-rishabh-sharma-sde3.pdf`.

---

## Rishabh Sharma

**Founding / Staff Software Engineer — Healthcare AI & Voice**
Pune / Bangalore, India · Open to remote-from-India & US/EU relocation · +91 9004310441 · rishabh.sharma26@gmail.com
[linkedin.com/in/rishabhz](https://www.linkedin.com/in/rishabhz) · [github.com/RishabhSharmaGit](https://github.com/RishabhSharmaGit)

> Founding software engineer with ~10 years building production systems end-to-end. Architected the EHR-agnostic patient-access platform underpinning a fast-scaling Series A healthcare voice-AI business — scaling it from first pilots to 90+ clinics and 40+ EHR systems (1M+ patients, >80% call automation). Known for shipping production LLM and real-time voice systems in HIPAA-regulated settings, and for turning multi-vendor integration into a 2-4 day commodity instead of a multi-week project. Open to remote-from-India and US/EU relocation.

## Selected Impact

- Architected and scaled a healthcare **patient-access platform from 3 → 90+ clinics** integrating **40+ EHR / practice-management systems** behind one standardized RESTful API — the backbone for AI agents serving 1M+ patients.
- Shipped **production generative-AI / voice systems** (LLM orchestration across OpenAI/Anthropic/Gemini; real-time STT+LLM+TTS) with a design that holds **token cost constant regardless of call length**.
- Turned multi-vendor healthcare integration into a **2-4 day commodity (from ~10-15 days)** via a pluggable adapter architecture — 4-5 new integrations per 2-week sprint.
- Re-architected a compute-heavy **ML/computer-vision pipeline to run client-side (WebAssembly)** — cut latency ~4-5s → <800ms and infra cost ~60%.

---

## Experience

### Founding Software Engineer — Confido Health
*Oct 2024 – Present · Bangalore / New York*
> Series A ($10M, Blume Ventures) healthcare voice-AI · 1M+ patients enabled, >80% call automation · founding engineer · TypeScript/Node.js · Python · Go · PostgreSQL · GCP · HIPAA

- **Architected the EHR-agnostic patient-access / clinical-workflow platform from day one** — the data + action layer every voice-AI agent and forward-deployed engineer (FDE) calls to run the full front-office workload against a clinic's systems: scheduling, patient identity + demographics, **insurance eligibility + verification + prior-auth**, **payments / balance collection (RCM)**, **medication & prescription refills**, patient documents + clinical timeline + notes retrieval, and EHR read/write sync with warm-transfer / human-in-the-loop fallback. Spans **40+ live EHR / practice-management systems**; scaled from **3 pilot clinics to 90+ live clinics** in ~18 months.
- **Built the pluggable EHR integration framework** (NestJS, RESTful microservices) + an isolated browser-automation service (Puppeteer) for legacy EHRs without API auth — cut new-EHR integration from **~10-15 days to 2-4 days**; team ships 4-5 integrations per 2-week sprint. 14+ direct-API + 20+ browser-automation connectors (eClinicalWorks, Athenahealth, NextGen, ModMed, Nextech, Tebra, Dentrix Ascend, Kolla, CareStack, …).
- **Designed the EHR-agnostic abstraction** so agents + FDE systems call one standardized API (cascade-search-patient, find-free-slots, post-appointment, get-changes-since, eligibility, refill) regardless of vendor — with self-serve clinic onboarding via the CareOS dashboard.
- **Built production generative-AI / voice pipelines** — LLM orchestration across OpenAI, Anthropic, Gemini (multi-provider routing + semantic caching), real-time STT+LLM+TTS on Twilio telephony; **leading the Pipecat-vs-LiveKit runtime evaluation** to replace Retell for larger clients. Key design: **Redis source-of-truth + Jinja2 prompts rendered from frozen state each turn** — constant token usage regardless of call length. Plan targets ≤2,500 tokens/call (vs ~8,500-10,000), <800ms P50 voice-to-voice latency.
- **Owned reliability + cost engineering at 3x scale** — advanced PostgreSQL schema/indexing, hash-based change-detection to cut EHR API cost under rate limits, idempotent writes + backoff + partial-sync recovery + HITL review queue. Removed a scaling ceiling at ~30 clinics by **re-architecting the compute topology** — split background EHR-sync from the real-time voice request path into independently-scaling **GCP Cloud Run** services (eliminated 5-10s deploy downtimes + contention; keyless CI/CD via Workload Identity Federation). Now 90+ clinics, zero deploy downtime.
- Workflow orchestration with **Temporal** (outbound campaigns, retries, backfill); real-time clinician dashboard with **Server-Sent Events** streaming live transcripts + multi-tenant RBAC.
- **Additional**: designed the senior-engineer technical interview framework (LLM-tool-discipline format; multiple internal appraisals); contributed across the Go/Temporal voice-agent backend and the Next.js clinician dashboard.

### Tech Lead / SDE3 — Nova Benefits Pvt. Ltd.
*Jul 2022 – Sep 2024 · Remote — Bangalore*

Led one of three engineering teams (5-8 developers + a dedicated QA); collaborated with PM/CTO on roadmap. Owned the endorsement + onboarding modules of Nova's platform (250K active employees + 3K HR admins).

- Consolidated dispersed endorsement + onboarding logic into a unified central module — **90% reduction in legit issues reported in core modules**
- Built a scalable HRMS integration framework — any new HRMS platform integrable in **3-4 days** (Google Workspace, Zoho People, Darwinbox, etc.)
- Integrated ICICI + CARE insurer APIs for automated endorsement data submission and batch tracking — **reduced endorsement TAT from 14 days to a few hours**
- Led one of three engineering teams; managed 5-8 developers + a dedicated QA; collaborated with PM and CTO on requirements + roadmap alignment
- Owned endorsements module for 250,000 active employees + 3,000 HR admins (insertion/deletion of employees to group + retail policies)
- Integrated Razorpay SDK for standard web checkout on retail product purchases
- Built additional platform modules: self-served mental/financial health assessment, CD Account management (client wallet), rater-based premium calculation + refund framework
- Integrated Mailmodo for email automation and WATI for WhatsApp communications across CX surfaces

### Full Stack Engineer — YouGov Research Pvt. Ltd.
*Jun 2020 – Jul 2022 · Remote — UK*

Owned end-to-end development, maintenance, and operations for YouGov.Chat — a chat-based user engagement platform with a 1,200,000-user panel — and the in-house CMS that powers content across YouGov platforms.

- Built and maintained YouGov.Chat — chat-based engagement platform with a **1.2M-user panel** — owning enhancements + complex problem-solving as IC
- Built and maintained the in-house CMS providing a standard way of creating, editing, and publishing content across YouGov platforms
- Set up Feature Flags via Unleash, enabling controlled rollouts of new platform features
- Integrated AWS Cognito for social login across the panel
- Integrated StoryBlok as a headless CMS for content management
- Built user comments + rating with **AWS Comprehend** for opinion analysis + foul-language filtering
- Integrated a bank API for automated reward distribution to panel users
- Set up the platform's infrastructure via Terraform and implemented push notifications

### Senior Software Developer / Software Developer — Cimpress Technology Pvt. Ltd.
*Feb 2019 – Jun 2020 · Mumbai, India · Promoted to Senior within 8 months*

Primary contributor on StitchX — an **ML / computer-vision** pipeline converting customer artwork into machine-specific embroidery instructions (image vectorization, stitch-path planning, color segmentation).

- **Re-architected the compute-heavy ML image-processing core to run client-side in the browser via WebAssembly + an async WebWorkers thread pool** — cut conversion latency from ~4-5s server round-trip to **<800ms** and eliminated the dedicated high-compute server fleet (**~60% infra cost reduction**), enabling real-time interactive preview for production artists
- Owned the StitchX image-processing / computer-vision pipeline end-to-end — requirement-gathering with production artists, feasibility analysis, delivery
- **Promoted to Senior in ~8 months** on project impact; subsequently moved to a **US-based team building a higher-vertical artwork design-editor product**
- Designed a dedicated JMeter-based API load/functional testing project from scratch; maintained unit/integration/UI suites + CI/CD pipelines

### Product Engineer — Seclore Technology Pvt. Ltd.
*Jun 2016 – Feb 2019 · Mumbai, India · First full-time role*

Full-stack engineer at a data-centric cyber-security organisation. Built back-end and front-end across Seclore's flagship Information Rights Management (IRM) product, **FileSecure**, owning entire development lifecycle.

- Built back-end (server) + front-end for Seclore's flagship product FileSecure, owning the full development lifecycle from requirements analysis to QA release
- Co-authored and maintained the **OU Admin dashboard** — monitored protected files, active users, and crucial data per Organizational Unit
- Designed a **centralized initialization + update mechanism for PolicyServer configuration** — eliminated config-drift across distributed client deployments
- Built **installer + patch upload/validate/ready-to-fetch mechanism** for product rollouts across all client deployments
- Designed a **License + privileges framework** for end-user access control
- Authored multiple responsive product pages + their backends

---

## Education

**Bachelor of Engineering — Electronics and Telecommunication Engineering**
MIT Academy of Engineering, Pune · 2012 – 2016 · **First Class with Distinction (66%)**

<!-- Schooling (kept for reference; not shown on rendered resumes per convention for senior roles):
CBSE-AISSCE (Class 12) — Air Force School, Viman Nagar, Pune · 2010-2012 · 71.80%
CBSE-AISSE (Class 10) — Air Force School, 9BRD, Pune · 2008-2010 · 89.30% -->

---

## Skills

**Languages**: TypeScript · JavaScript · Python · Go · Java · SQL · (working: C · C++ · C#)
**Backend & APIs**: Node.js · NestJS · Fastify · RESTful APIs · microservices · GraphQL (Apollo, Relay) · event-driven / queues · J2EE/Servlets/Struts (legacy)
**AI / ML**: LLM orchestration (OpenAI · Anthropic · Gemini) · multi-provider routing (LiteLLM) · RAG & semantic caching · real-time voice (STT/TTS/VAD; Pipecat · LiveKit · Retell · Deepgram · ElevenLabs) · LLM evals (Langfuse · Cekura) · AWS Comprehend (NLP) · image-processing / computer-vision
**Cloud & DevOps**: Google Cloud Platform · AWS (Cognito · Comprehend · Kinesis · SNS · SQS) · Docker · Kubernetes / GKE · Terraform · GitLab CI / GitHub Actions · Cloud Run · Workload Identity Federation
**Databases**: PostgreSQL (query optimization · indexing · schema design) · Supabase (Postgres + RLS) · MongoDB (change streams) · Redis · MySQL · DynamoDB · Oracle · vector / pgvector · Prisma · pgx
**Orchestration & Real-time**: Temporal · Cloud Tasks · Kafka (CDC, Avro) · RabbitMQ · WebSockets · Server-Sent Events
**Healthcare**: EHR / PMS integration (FHIR · HL7 · proprietary · browser-automation) · eligibility & prior-auth · RCM / payments · HIPAA · multi-EHR abstraction · patient-access automation
**Frontend**: React · Next.js · Redux · Zustand · TanStack Query · Vue / Nuxt · Tailwind · Radix UI
**Observability**: OpenTelemetry · Sentry · Prometheus · Loki · Grafana · Elasticsearch / Kibana
**Testing & perf**: Jest · Vitest · Selenium · JMeter · WebAssembly + WebWorkers (browser performance)

---

## Domains shipped to production

Healthcare / Voice AI · Insurance / HR-tech · Market research · Mass customization · Cybersecurity / IRM · Payments

---

## Interests

Travel + road trips · Hiking (Maharashtra treks) · Cooking · Table-Tennis / Basketball / Badminton / Football · Dance · Event organisation

---

## Variants live under

`resumes/variants/{date}-{company}-{role}.{html,md,pdf}` — one tailored cut per JD. See `resumes/variants/README.md` for the JD-tailoring workflow and where to drop new JDs.

Existing variants:
- `2026-06-04-therxassistant-tech-lead.{html,md,pdf}` — TheRxAssistant Tech Lead (founding team, healthcare AI)
- `2026-05-14-temp-general.{html,md,pdf}` — general baseline
