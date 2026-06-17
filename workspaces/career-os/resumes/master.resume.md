---
slug: master-resume
title: "Master resume (human-readable mirror)"
type: resume
status: draft
tags: [master, resume]
links: []
source: null
confidence: high
created: '2026-05-14'
updated: '2026-06-17'
resume_kind: master
---

# Master resume — human-readable mirror

The canonical resume is `master.resume.json` (JSON Resume v1 schema). This `.md` is the human mirror for quick scanning and a stable `[[master-resume]]` wikilink target.

**This is the MASTER reservoir — exhaustive. JD-specific cuts are derived from it under `resumes/variants/`.** Roles populated from repo digests + `personal/resumes/2024-09-rishabh-sharma-sde3.pdf`.

---

## Rishabh Sharma

**Founding / Staff Software Engineer — Healthcare AI & Voice**
Pune, India · Remote-from-India & US/EU relocation open · +91 9004310441 · rishabh.sharma26@gmail.com
[linkedin.com/in/rishabhz](https://www.linkedin.com/in/rishabhz) · [github.com/RishabhSharmaGit](https://github.com/RishabhSharmaGit)
**US B-1/B-2 Visa · valid to Jan 2035**

> Took a fragmented, legacy-software-bound industry — healthcare front-office across 40+ incompatible vendor systems — and made it programmable behind one API. Founding software engineer at Confido Health: scaled a patient-access + voice-AI platform from 3 pilot clinics to 90+, 1M+ patients, and >80% call automation in 18 months. Known for shipping production LLM and real-time voice systems under strict HIPAA constraints, turning multi-vendor EHR integration into a 2-4 day commodity, and catching scaling ceilings before they reach users.

---

## Selected Impact

- **3 → 90+ clinics in 18 months** — architected and scaled the EHR-agnostic patient-access platform underpinning Confido's voice-AI agents (1M+ patients, >80% call automation, 5,000+ calls/day peak).
- **10-15 days → 2-4 days per EHR integration** — pluggable adapter framework; team now ships 4-5 integrations/sprint across 40+ live healthcare systems.
- **~70% token-cost reduction** — Redis-source-of-truth prompt architecture targets ≤2,500 tokens/call vs ~8,500-10,000 baseline; <800ms P50 voice-to-voice latency.
- **~60% infra cost reduction** — re-architected an ML/computer-vision pipeline from server-side to client-side WebAssembly + WebWorkers, cutting latency from ~4-5s to <800ms.

---

## Experience

### Founding Software Engineer — Confido Health
*Oct 2024 – Present · Bangalore / New York · TypeScript · Python · Go · PostgreSQL · GCP · HIPAA*
> Series A ($10M) healthcare voice-AI — 1M+ patients, >80% call automation

- **Architected the EHR-agnostic patient-access platform from day one** — the data + action layer every voice-AI agent calls to run the full front-office: scheduling, patient identity + demographics, insurance eligibility + verification + prior-auth, payments/RCM, prescription refills, documents + clinical timeline, and EHR read/write sync with warm-transfer/HITL fallback. Scaled from **3 pilot clinics to 90+** across **40+ EHR/PMS systems** in ~18 months (1M+ patients, >80% call automation).
- **Built the pluggable EHR integration framework** (NestJS, factory + abstract-base-service contract) + isolated browser-automation service (Puppeteer) for legacy systems without API auth — cut new-EHR integration from **~10-15 days to 2-4 days**; team ships **4-5 integrations/sprint**. 14+ direct-API connectors (Athenahealth, NextGen, ModMed, Nextech, Tebra, Dentrix Ascend, …) + 20+ browser-automation connectors (eClinicalWorks, CareStack, …).
- **Own the production AI/LLM + voice layer** — multi-provider routing across OpenAI, Anthropic & Gemini (LiteLLM + semantic cache), real-time STT+LLM+TTS on Twilio telephony, <800ms P50 voice-to-voice. Leading the Pipecat vs LiveKit runtime evaluation (6 ADRs, shadow-mode rollout plan). Key design: **Redis source-of-truth + Jinja2 prompt rendering from frozen state snapshots** — holds token cost flat regardless of call length (target ≤2,500 vs ~8,500-10,000 tokens/call, ~70% reduction).
- **Re-architected compute topology at ~30 clinics** — split background EHR-sync from the real-time voice path into independently-scaling GCP Cloud Run services (keyless CI/CD via Workload Identity Federation) — eliminated **5-10s deploy downtimes**, removed sync-vs-API contention, unblocked **3× growth to 90+ clinics with zero deploy downtime**. OpenTelemetry-first observability (OTLP traces + metrics + logs with PHI-scrubbing) across all services.
- **Designed the senior-engineer interview framework** (phased-refactor format testing LLM-tool discipline); mentor engineers across the stack; own code-review, testing, and CI/CD standards across the founding team. Workflow orchestration (Temporal), real-time clinician dashboard (Next.js + SSE streaming), and multi-tenant RBAC (Clerk JWTs + Supabase RLS).

### Tech Lead / SDE3 — Nova Benefits
*Jul 2022 – Sep 2024 · Remote — Bangalore · Node.js · NestJS · TypeScript · PostgreSQL*
> Insurance / HR-tech — 250K active employees, 3K HR admins

- **Led a 5-8 engineer team** + dedicated QA; consolidated dispersed endorsement + onboarding logic into a unified **state-machine module** — **90% reduction in core-module production issues**; aligned roadmap with PM and CTO.
- Built a scalable **third-party integration framework** — any new HRMS integrable in **3-4 days** (Google Workspace, Zoho People, Darwinbox); integrated ICICI + CARE insurer APIs for automated endorsement submission + batch tracking — cut **endorsement TAT from 14 days to a few hours**.
- Integrated Razorpay for retail checkout; built self-served mental/financial health assessments, CD-account (client wallet) module, and rater-based premium-calculation + refund framework; integrated Mailmodo + WATI for email and WhatsApp CX automation.

### Full Stack Engineer — YouGov Research
*Jun 2020 – Jul 2022 · Remote — UK · Node.js · React · AWS*
> Market research — 1.2M-user engagement panel

- Owned **YouGov.Chat** end-to-end (1.2M-user panel) — feature development, ops, and reliability; built an in-house headless CMS, feature flags (Unleash), social login (AWS Cognito), Terraform infra, and bank API integration for automated reward payouts.
- Shipped a production **NLP pipeline** (AWS Comprehend) for comment moderation and opinion extraction — confidence-gated routing + human-in-the-loop quarantine queue; early production guardrails years before they became standard.

### Senior Software Developer — Cimpress Technology
*Feb 2019 – Jun 2020 · Mumbai · Promoted to Senior in ~8 months*
> Mass customization / print-on-demand — ML/computer-vision

- **Re-architected the StitchX ML/computer-vision pipeline to run client-side** via WebAssembly + an async WebWorkers thread pool — cut conversion latency from ~4-5s to **<800ms** and eliminated the dedicated high-compute server fleet (**~60% infra cost reduction**), enabling real-time interactive preview for production artists.
- Promoted to Senior in ~8 months; moved to a **US-based team** on a higher-vertical artwork design-editor product; designed a JMeter load/functional test project from scratch; maintained unit/integration/UI suites + CI/CD.

### Product Engineer — Seclore Technology
*Jun 2016 – Feb 2019 · Mumbai · Java / J2EE / Servlets / Struts*
> Enterprise data-security / IRM (first role)

- Full-stack engineer on **FileSecure** (enterprise IRM SaaS) — owned full development lifecycle; built a centralized PolicyServer config + update mechanism (eliminated config-drift across distributed deployments), a license + privileges framework, and the OU-Admin dashboard for a regulated, security-critical B2B product.

---

## Personal Projects

**Workspace OS** · *2026 · TypeScript · Bun · PostgreSQL + pgvector · open-source*
Built a local-first, LLM-mediated developer platform as an independent exploration of the modern AI stack: composable agent skills + lifecycle hooks, an autonomous research agent (info-gain/gap-fill loop), and a multi-agent workflow orchestrator (parallel fan-out, adversarial verification) over PostgreSQL + pgvector. Spans RAG + semantic search, structured outputs, confidence-gated routing, LLM-as-judge evals, and Model Context Protocol (MCP) tools.

---

## Skills

**Languages**: TypeScript · JavaScript · Python · Go · Java · SQL
**Backend & APIs**: Node.js · NestJS · Fastify · RESTful microservices · GraphQL (Apollo) · event-driven / queues · Temporal · Kafka · RabbitMQ · Cloud Tasks
**AI / ML**: LLM orchestration (OpenAI · Anthropic · Gemini) · multi-provider routing (LiteLLM) · RAG + semantic caching · real-time voice (STT/TTS/VAD; Pipecat · LiveKit · Retell · Deepgram · ElevenLabs) · LLM evals (Langfuse · Cekura) · AWS Comprehend · WebAssembly + WebWorkers
**Cloud & DevOps**: GCP (Cloud Run · GKE · Cloud Tasks · GCS · Secret Manager) · AWS (Cognito · Comprehend · Kinesis · SNS/SQS) · Docker · Kubernetes · Terraform · GitLab CI / GitHub Actions · Workload Identity Federation
**Databases**: PostgreSQL · Supabase (Postgres + RLS) · MongoDB · Redis · DynamoDB · pgvector · Prisma · pgx
**Frontend**: React · Next.js · Redux · Zustand · TanStack Query · Vue / Nuxt · Tailwind · Radix UI
**Observability**: OpenTelemetry (+ OTel Collector) · SigNoz · Sentry · Langfuse · PostHog · Grafana · Elasticsearch / Kibana
**Healthcare**: EHR/PMS integration (FHIR · HL7 · proprietary · browser-automation) · eligibility + prior-auth · RCM · HIPAA · multi-tenant patient-access

---

## Education

**B.E. Electronics and Telecommunication** — MIT Academy of Engineering, Pune · 2012-2016 · First Class with Distinction

---

## Interests

Avid hiker · culinary enthusiast · table-tennis, badminton & football · Dota 2 — team strategy & real-time decisions under pressure · travel & road trips

---

## Domains shipped to production

Healthcare / Voice-AI · Insurance / HR-tech · Market research · Mass customization · Cybersecurity / IRM · Payments
