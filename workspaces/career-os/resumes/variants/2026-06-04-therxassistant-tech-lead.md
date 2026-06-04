---
slug: 2026-06-04-therxassistant-tech-lead-resume
title: "Resume — TheRxAssistant Tech Lead"
type: resume
status: draft
tags: [variant, therxassistant, healthcare-ai, founding, tech-lead]
links: ["[[master-resume]]", "[[therxassistant-tech-lead]]", "[[2026-06-04-therxassistant-tech-lead]]"]
source: null
confidence: high
created: '2026-06-04'
updated: '2026-06-04'
resume_kind: variant
target_role: therxassistant-tech-lead
---

# Rishabh Sharma

**Founding Engineer / Tech Lead — Healthcare AI & Voice**

Pune / Bangalore, India · Open to remote & US relocation · +91 9004310441 · rishabh.sharma26@gmail.com
[linkedin.com/in/rishabhz](https://www.linkedin.com/in/rishabhz) · [github.com/RishabhSharmaGit](https://github.com/RishabhSharmaGit)

---

## Summary

Founding software engineer with ~10 years building production systems end-to-end. Currently took a Series A healthcare voice-AI product from 0→1 — architecting the **EHR-agnostic platform** that powers AI agents handling appointments, insurance, payments, and **medication & prescription access** across 90+ clinics. Deep **Node.js/TypeScript + PostgreSQL** backend expertise paired with real-world **generative-AI / LLM** implementation in HIPAA-regulated healthcare. I thrive in early-stage ambiguity and own features from schema to API to production.

## Selected Impact

- Architected and scaled a healthcare **patient-access platform from 3 → 90+ clinics** integrating **40+ EHR / practice-management systems** behind one standardized RESTful API — the backbone for AI agents serving 1M+ patients.
- Shipped **production generative-AI / voice systems** (LLM orchestration across OpenAI/Anthropic/Gemini, real-time STT+LLM+TTS pipelines) with a design that holds **token cost constant regardless of call length**.
- Turned multi-vendor healthcare integration into a **2-4 day commodity (from ~10-15 days)** via a pluggable adapter architecture — 4-5 new integrations per 2-week sprint.
- Re-architected a compute-heavy **ML/computer-vision pipeline to run client-side (WebAssembly)** — cut latency ~4-5s → <800ms and infra cost ~60%.

## Experience

### Founding Software Engineer, Confido Health
*Oct 2024 — Present · Bangalore / New York*
> Series A ($10M) healthcare voice-AI · 1M+ patients enabled, >80% call automation · founding engineer · stack: TypeScript/Node.js, Python, Go, PostgreSQL, GCP, HIPAA

- Architected the **EHR-agnostic patient-access platform** from day one — the data + action layer every voice-AI agent calls to run the full front-office workload: scheduling, patient identity, **insurance eligibility/verification + prior-auth**, **payments / balance collection**, **medication & prescription refills**, documents + clinical timeline + notes, and EHR read/write sync with human-in-the-loop fallback.
- Built a pluggable **EHR integration framework (NestJS, RESTful microservices)** spanning **40+ EHR/PMS systems** (eClinicalWorks, Athenahealth, NextGen, ModMed, Dentrix, Kolla, …) — 14+ direct-API + 20+ browser-automation connectors; cut new-EHR integration from ~10-15 days to **2-4 days**.
- Built **production generative-AI / voice pipelines** — LLM orchestration across OpenAI, Anthropic, and Gemini (multi-provider routing + semantic caching), real-time **STT+LLM+TTS** on Twilio telephony; leading the Pipecat-vs-LiveKit runtime evaluation. Designed a **Redis state + dynamic-prompt architecture** that keeps token usage constant regardless of conversation length.
- Owned **reliability + performance at 3x scale** — advanced PostgreSQL schema + indexing, hash-based change detection to cut EHR API cost under rate limits, idempotent writes with backoff + partial-sync recovery. Re-architected the compute topology (background sync vs. real-time request path) into independently-scaling **containerized services on GCP Cloud Run** with keyless CI/CD; eliminated deploy downtime through 3→90+ clinic growth.
- Workflow orchestration with **Temporal** (outbound campaigns, retries, backfill); real-time clinician dashboard with **Server-Sent Events** streaming live call transcripts and multi-tenant RBAC.
- **Additionally**: designed the team's senior-engineer technical interview framework (LLM-tool-discipline format; multiple internal appraisals).

### Tech Lead — SDE3, Nova Benefits
*Jul 2022 — Sep 2024 · Remote · Bangalore*
> Insurance / HR-tech platform · 250K active employees + 3K HR admins · led 5-8 engineers + dedicated QA

- Built a scalable **third-party integration framework** (HRMS + insurer + payment APIs) — new partner integrable in 3-4 days; integrated ICICI/CARE insurer APIs to cut endorsement TAT from **14 days to a few hours**.
- Consolidated dispersed endorsement + onboarding logic into a unified module — **90% reduction** in core-module production issues; led a team of 5-8 engineers + QA with PM/CTO on roadmap.

### Full Stack Engineer, YouGov
*Jun 2020 — Jul 2022 · Remote · UK*
> Chat-based engagement platform · 1.2M-user panel · AWS

- Owned YouGov.Chat (1.2M-user panel) end-to-end; shipped production **NLP on AWS (Comprehend)** for opinion analysis + content moderation, social login via **AWS Cognito**, and Terraform-managed **AWS** infrastructure with feature flags, push, and reward-payout integrations.

**Senior Software Developer, Cimpress Technology** *(Feb 2019 — Jun 2020 · Mumbai)* — Re-architected StitchX's compute-heavy **ML / computer-vision** image-processing core to run client-side via **WebAssembly + WebWorkers**: latency ~4-5s → <800ms, ~60% infra cost reduction. Promoted to Senior in 8 months, then to a US-based artwork design-editor team.

**Product Engineer, Seclore Technology** *(Jun 2016 — Feb 2019 · Mumbai)* — Full-stack engineer on a flagship data-security (Information Rights Management) product; built distributed config + license/privilege frameworks and the admin dashboard across the full development lifecycle.

## Skills

- **Languages**: TypeScript · JavaScript · Python · Go · Java · SQL
- **Backend & APIs**: Node.js · NestJS · Fastify · RESTful APIs · microservices · GraphQL · event-driven / queues
- **AI / ML**: LLM orchestration (OpenAI, Anthropic, Gemini) · RAG & semantic caching · real-time voice (STT/TTS/VAD) · LLM evals · AWS Comprehend (NLP) · image-processing / CV
- **Databases**: PostgreSQL (query opt · indexing · schema design) · Redis · MongoDB · MySQL · DynamoDB · vector / pgvector
- **Cloud & DevOps**: GCP · AWS (Cognito, Comprehend, SQS/SNS, Kinesis) · Docker · Kubernetes/GKE · Terraform · GitLab CI / GitHub Actions · Cloud Run
- **Orchestration & Real-time**: Temporal · Cloud Tasks · Kafka · RabbitMQ · WebSockets · Server-Sent Events
- **Healthcare**: EHR/PMS integration (FHIR · HL7 · proprietary) · eligibility & prior-auth · RCM · HIPAA · multi-EHR abstraction
- **Observability**: OpenTelemetry · Sentry · Grafana / Prometheus / Loki · Langfuse

## Education

**B.E. Electronics & Telecommunication Engineering** · *MIT Academy of Engineering, Pune* · First Class with Distinction · 2012–2016

## Interests

Avid hiker (Maharashtra treks) · culinary enthusiast · table-tennis, badminton & football · travel & road trips.

---

*Tailored for TheRxAssistant — Tech Lead (Founding Team). Generated 04-Jun-2026 from master.resume.json. Before sending: confirm remote-from-India acceptability + salary band; prepare AWS-from-GCP framing.*
