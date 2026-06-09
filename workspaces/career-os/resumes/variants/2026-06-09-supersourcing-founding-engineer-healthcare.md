---
slug: 2026-06-09-supersourcing-founding-engineer-healthcare-resume
title: "Resume — Founding Engineer (Full Stack), Healthcare (via Supersourcing)"
type: resume
status: draft
tags: [variant, founding-engineer, full-stack, healthcare, typescript, supabase, hipaa, ic]
links: ["[[master-resume]]", "[[supersourcing-founding-engineer-healthcare]]", "[[2026-06-09-supersourcing-founding-engineer-healthcare]]"]
source: null
confidence: high
created: '2026-06-09'
updated: '2026-06-09'
resume_kind: variant
target_role: supersourcing-founding-engineer-healthcare
---

# Rishabh Sharma

**Founding Engineer — Full-Stack · Healthcare · HIPAA**

Pune / Bangalore, India · Remote (US-overlap friendly) · +91 9004310441 · rishabh.sharma26@gmail.com · [linkedin.com/in/rishabhz](https://www.linkedin.com/in/rishabhz) · [github.com/RishabhSharmaGit](https://github.com/RishabhSharmaGit)

> Readable mirror of the rendered resume (`2026-06-09-supersourcing-founding-engineer-healthcare.html` → `.pdf`). IC / full-stack forward, **extensive 3-page cut** for the Founding Engineer (Full Stack, Healthcare) role via Supersourcing — broadened deliberately because the end company/product is unnamed.

## Summary

**Founding software engineer at a US-market healthcare startup**, building HIPAA-regulated products end-to-end — from architecture and schema through API to shipped UI. Deep hands-on **TypeScript / Node.js** with **PostgreSQL / Supabase** and **React / Next.js**, with a strong track record of **EHR/EMR integrations**, real-time systems, and production generative-AI in healthcare. I make the architecture, product, and technical decisions, take full end-to-end ownership, and thrive in fast-paced, early-stage teams that ship concept → production. ~10 years spanning healthcare, fintech-adjacent (insurance/payments), enterprise data-security, and high-scale consumer platforms.

## Selected Highlights

- **Founding engineer** — architected & scaled an **EHR-agnostic patient-access platform from 3 → 90+ clinics (1M+ patients, >80% call automation)** behind one standardized API, owning the core architecture and product decisions from day one.
- Ship **full-stack, concept → production** on **TypeScript/Node.js + PostgreSQL/Supabase + Next.js** — owning features from schema to API to UI, independently and end-to-end.
- Built **40+ EHR/EMR integrations** and the clinical workflows on top — scheduling, **insurance eligibility/prior-auth**, **payments (RCM)**, and **medication/Rx refills** — all HIPAA-regulated.
- Shipped **production generative-AI / real-time voice** systems (multi-provider LLM orchestration; STT+LLM+TTS on Twilio) with a design holding **token cost constant regardless of call length**.
- Earlier: ~3 years on an enterprise **data-security** product — **privacy- and security-by-design** is second nature.

## Experience

### Founding Software Engineer, Confido Health
*Oct 2024 — Present · Remote · Bangalore / New York*
> Series A ($10M, Blume Ventures) US-market healthcare voice-AI · founding engineer — owns architecture & product decisions · 1M+ patients, >80% call automation · TypeScript/Node.js · Supabase/PostgreSQL · Next.js · Go · Python · GCP · HIPAA

- Founding engineer — **architected the EHR-agnostic patient-access platform** from day one and made the core **architecture, product & technical decisions** as it scaled **3 → 90+ clinics (1M+ patients, >80% call automation)**: the data + action layer every voice-AI agent calls to run the full front-office workload — scheduling, patient identity + demographics, **insurance eligibility/verification + prior-auth**, **payments / balance collection (RCM)**, **medication & prescription refills**, documents + clinical timeline + notes, and EHR read/write sync with warm-transfer / human-in-the-loop fallback.
- Build **full-stack, concept → production** on **TypeScript / Node.js (NestJS)** with **PostgreSQL / Supabase** (Postgres, **Row-Level Security** for multi-tenant isolation, Auth, Edge Functions, Realtime) and a **Next.js** clinician dashboard — owning features end-to-end from schema to API to UI, with real-time transcript streaming over **Server-Sent Events** and multi-tenant RBAC.
- Built a pluggable **EHR/EMR integration framework** + an isolated browser-automation service (Puppeteer) for legacy systems without API auth — cut new-EHR integration from **~10-15 days to 2-4 days** (team ships 4-5 per 2-week sprint); 14+ direct-API + 20+ browser connectors (eClinicalWorks, Athenahealth, NextGen, ModMed, Nextech, Tebra, Dentrix Ascend, CareStack, …).
- Shipped production **generative-AI / real-time voice pipelines** — LLM orchestration across **OpenAI / Anthropic / Gemini** (multi-provider routing + semantic caching) and real-time **STT+LLM+TTS** on **Twilio** telephony; designed a **Redis source-of-truth + dynamic-prompt** architecture rendered from frozen state each turn, holding token usage constant regardless of call length; led the Pipecat-vs-LiveKit runtime evaluation.
- Owned **reliability + cost engineering at 3× scale** — advanced PostgreSQL schema/indexing, hash-based change-detection to cut EHR API cost under rate limits, idempotent writes + backoff + partial-sync recovery + a human-in-the-loop review queue. Removed a scaling ceiling by **re-architecting the compute topology** (background EHR-sync vs. real-time voice path) into independently-scaling **GCP Cloud Run** services with keyless CI/CD (Workload Identity Federation) — eliminated 5-10s deploy downtimes; now 90+ clinics, zero deploy downtime.
- Workflow orchestration with **Temporal** (outbound campaigns, retries, backfill); instrumented the platform with **OpenTelemetry / SigNoz**; designed the team's senior-engineer technical interview framework.

### Tech Lead — SDE3, Nova Benefits
*Jul 2022 — Sep 2024 · Remote · Bangalore*
> Insurance / HR-tech / payments platform · 250K active employees + 3K HR admins · full-stack (TypeScript/Node) · led 5-8 engineers + a dedicated QA

- Owned the **endorsement + onboarding modules end-to-end** for 250K employees + 3K admins; consolidated dispersed logic into a unified central module — **90% reduction** in production issues in core modules.
- Built a scalable **third-party integration framework** — any new **HRMS** integrable in 3-4 days (Google Workspace, Zoho People, Darwinbox); integrated **ICICI + CARE insurer APIs** for automated endorsement submission + batch tracking — cut endorsement TAT from **14 days to a few hours**.
- Integrated **Razorpay** for retail checkout; built self-served mental/financial health assessments, a CD-account (client wallet) module, and a rater-based premium-calculation + refund framework.
- Integrated **Mailmodo** (email automation) and **WATI** (WhatsApp) across CX surfaces; led a team of 5-8 engineers + a dedicated QA and aligned roadmap with Product and the CTO.

### Full Stack Engineer, YouGov
*Jun 2020 — Jul 2022 · Remote · UK*
> YouGov.Chat — chat-based engagement platform · 1.2M-user panel · AWS

- Owned a **1.2M-user** web application end-to-end as IC — enhancements, complex problem-solving, and operations on a high-scale platform.
- Built user comments + rating with **AWS Comprehend** (opinion analysis + foul-language filtering) and social login via **AWS Cognito**; integrated a bank API for automated reward payouts.
- Built and maintained an in-house **headless CMS** for cross-platform content; integrated StoryBlok and feature flags via **Unleash**; set up infrastructure with **Terraform** and implemented push notifications.

### Senior Software Developer, Cimpress Technology
*Feb 2019 — Jun 2020 · Mumbai · promoted to Senior in ~8 months*

- Primary contributor on **StitchX**, an **ML / computer-vision** pipeline converting customer artwork into machine-specific embroidery instructions — **re-architected the compute-heavy core to run client-side via WebAssembly + a WebWorkers thread pool**, cutting conversion latency from ~4-5s server round-trip to **<800ms** and eliminating the high-compute server fleet (**~60% infra cost reduction**), enabling real-time interactive preview.
- Owned the CV pipeline end-to-end (requirements with production artists → feasibility → delivery); promoted to Senior in ~8 months, then moved to a **US-based team** building a higher-vertical artwork design-editor; built a JMeter load/functional test project from scratch and maintained unit/integration/UI suites + CI/CD.

### Product Engineer, Seclore Technology
*Jun 2016 — Feb 2019 · Mumbai*

- Full-stack engineer (**Java / J2EE / Servlets / Struts**) on the flagship **enterprise data-security (Information Rights Management) SaaS**, FileSecure — owned the full development lifecycle from requirements to QA release for a regulated, security-critical B2B product.
- Designed a **centralized initialization + update mechanism for distributed PolicyServer configuration** (eliminated config-drift across client deployments); built the installer + patch upload/validate/fetch mechanism, a **license + privileges framework** for access control, and the OU-Admin dashboard.

## Skills

- **Languages**: TypeScript · JavaScript · Python · Go · Java · SQL
- **Full-stack**: Node.js · NestJS · Fastify · Next.js · React (Redux · Zustand · TanStack Query) · scalable web applications & RESTful APIs · GraphQL · Server-Sent Events / WebSockets · event-driven · microservices
- **Data & Supabase**: **Supabase — Postgres · Row-Level Security (RLS) · Auth · Edge Functions · Realtime · Storage** · PostgreSQL (query optimization · indexing · schema design) · Prisma · pgvector · Redis · MongoDB (change streams) · MySQL
- **Healthcare**: EHR/EMR integration (FHIR · HL7 · proprietary · browser-automation) · eligibility & prior-auth · RCM / payments · **HIPAA** & healthcare data privacy · clinical workflows · multi-EHR abstraction · patient-access automation
- **AI / ML**: LLM orchestration (OpenAI · Anthropic · Gemini) · multi-provider routing (LiteLLM) · RAG & semantic caching · real-time voice (STT/TTS/VAD; Pipecat · LiveKit · Deepgram · ElevenLabs) · LLM evals (Langfuse) · AWS Comprehend (NLP) · computer-vision
- **Cloud & DevOps**: GCP (Cloud Run · GKE · Cloud Tasks · Secret Manager · Artifact Registry) · AWS (Cognito · Comprehend · SQS/SNS · Kinesis) · Docker · Kubernetes · Terraform · GitHub Actions / GitLab CI · Workload Identity Federation
- **Real-time & observability**: Temporal · Cloud Tasks · Kafka · RabbitMQ · WebSockets · Server-Sent Events · Twilio (voice/SMS) · OpenTelemetry · SigNoz · Sentry · PostHog · Grafana / Prometheus
- **Testing & quality**: Jest · Vitest · Supertest · Selenium · JMeter · Husky · Biome / ESLint / Prettier · dependency-cruiser / madge · WebAssembly + WebWorkers

## Education

**B.E. Electronics & Telecommunication Engineering** · *MIT Academy of Engineering, Pune* · First Class with Distinction · 2012–2016

## Other

- **Domains shipped to production**: Healthcare / Voice-AI · Insurance / HR-tech · Market research · Mass customization · Cybersecurity / data-security (IRM) · Payments.
- **Interests**: Passionate about building impactful healthcare products · avid hiker · culinary enthusiast · table-tennis, badminton & football · Dota 2 tactician (a decade of 5-stack drafting, shot-calling & clutch comebacks — teamwork under pressure, gamified) · travel.

---

*Tailored for Founding Engineer (Full Stack), Healthcare — via Supersourcing (Remote, US-overlap). IC / full-stack forward, extensive 3-page cut (company unnamed → broadened). Supabase featured deeply (RLS · Auth · Edge Functions · Realtime). Generated 09-Jun-2026 from master.resume. Before sending: confirm end-company isn't a competitor; immediate-joiner stated in email.*
