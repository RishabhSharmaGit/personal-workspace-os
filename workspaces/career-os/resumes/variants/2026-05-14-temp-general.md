---
slug: 2026-05-14-temp-general-resume
title: "Temp resume draft (general)"
type: resume
status: draft
tags: [variant, temp, general]
links: ["[[master-resume]]"]
source: null
confidence: medium
created: '2026-05-14'
updated: '2026-05-14'
resume_kind: variant
---

# Rishabh Sharma

**Founding Software Engineer — Voice AI & Healthcare**

Pune / Bangalore, India · +91 9004310441 · rishabh.sharma26@gmail.com
[linkedin.com/in/rishabhz](https://www.linkedin.com/in/rishabhz) · [github.com/RishabhSharmaGit](https://github.com/RishabhSharmaGit)

---

## Summary

Software developer with ~10 years building production systems across voice AI, healthcare, insurance, cybersecurity, and consumer-data platforms. Blend logic with creativity — architecting scalable backends, designing intuitive UI/UX, and shipping seamless end-user experiences. Currently founding engineer at Confido Health, building industry-leading voice AI to free up clinical staff time.

---

## Experience

### Founding Software Engineer, Confido Health
*Oct 2024 — Present · Bangalore / New York*

Building industry-leading voice AI for clinical staff workflows. Healthcare; primary cloud: GCP. Series A ($10M, 50+ team, 90+ clinics live).

- **Architected appointment-manager from day one** — Confido's central appointment-sync service. Scaled from **3 pilot clinics at launch to 90+ live clinics** across **40+ EHR systems**; platform serves hundreds of thousands of voice-AI calls/day at peak.
- **Built the pluggable EHR factory pattern** (NestJS) + an isolated browser-automation sister service (Firebase Functions + Puppeteer) — cut new-EHR integration time from **~10-15 days to 2-4 days**; team now ships 4-5 EHR integrations per 2-week sprint.
- **Drove VM → GCP Cloud Run migration** with explicit sync-worker / API service split at ~30 clinics — eliminated 5-10s deploy windows, removed sync-vs-API noisy-neighbor contention; foundation for 3x subsequent clinic growth. GitLab CI + Workload Identity Federation for keyless CI/CD.
- **Leading next-gen voice runtime evaluation** (Pipecat 1.0 vs LiveKit, replacing Retell). Built end-to-end STT+LLM+TTS pipelines in both (Deepgram · LiteLLM-routed OpenAI/Anthropic/Gemini · ElevenLabs · Upstash semantic cache); authored platform-replacement plan with target metrics (≤2,500 tokens/call vs ~8,500-10,000 baseline; <800ms P50 voice-to-voice latency).
- **Designed Confido's senior-engineer interview framework** (solo authored) — 6 problems × 75-min phased-refactor format testing structured LLM-tool discipline rather than syntax memory. Multiple internal appraisals.

### Tech Lead — SDE3, Nova Benefits Pvt. Ltd.
*Jul 2022 — Sep 2024 · Remote · Bangalore*

Led 1 of 3 engineering teams (5 developers); owned endorsement & onboarding modules of Nova's platform — 250,000 active employees + 3,000 HR admins. Collaborated with PM, QA, and CTO on roadmap delivery.

- Consolidated dispersed endorsement + onboarding logic into a unified central module — **90% reduction** in legit issues reported in core modules after stabilization.
- Built a scalable HRMS integration framework — any new HRMS platform integrable in **3–4 days** (Google Workspace, Zoho People, Darwinbox, etc.).
- Integrated ICICI + CARE insurer APIs for automated endorsement data submission and batch tracking — **reduced endorsement TAT from 14 days to a few hours**.
- Integrated Razorpay SDK for retail checkout; built additional platform modules: self-served mental/financial health assessment, CD Account (wallet) management, rater-based premium calculation + refund framework, Mailmodo email automation, WATI WhatsApp comms.

### Full Stack Engineer, YouGov Research Pvt. Ltd.
*Jun 2020 — Jul 2022 · Remote · UK*

Owned end-to-end dev, maintenance, and operations for YouGov.Chat — a chat-based engagement platform with a **1.2 million-user panel** — plus YouGov's in-house CMS.

- Built & maintained YouGov.Chat (1.2M panel) and the in-house CMS standardizing creation/edit/publish flow across YouGov platforms.
- Production **AWS Comprehend** integration for user-comment opinion analysis + foul-language filtering at scale.
- Implemented Feature Flags (Unleash), social login (AWS Cognito), headless CMS (StoryBlok), bank API for reward distribution, push notifications, and Terraform-managed infrastructure.

### Senior Software Developer / Software Developer, Cimpress Technology Pvt. Ltd.
*Feb 2019 — Jun 2020 · Mumbai*

Primary contributor and proprietor of Cimpress's embroidery software products (StitchX — automated image/artwork → machine-specific stitch instructions). Promoted to Senior in 8 months.

- Implemented **asynchronous thread-pool-based embroidery core running in client's browser via WebWorkers + WebAssembly** — offloaded heavy stitch computation client-side.
- Designed a JMeter-based API testing project from scratch; maintained automated test suites (unit/integration/UI) and CI/CD pipelines.

### Product Engineer, Seclore Technology Pvt. Ltd.
*Jun 2016 — Feb 2019 · Mumbai*

Full-stack engineer at a data-centric cyber-security organisation. Built back-end & front-end across Seclore's flagship Information Rights Management product, **FileSecure**, owning the entire development lifecycle from requirements analysis to QA release.

- Co-authored and maintained the **OU Admin dashboard** monitoring protected files, active users, and crucial data per Organizational Unit.
- Designed the **PolicyServer centralized configuration init/update mechanism** (eliminated config-drift across distributed deployments) and the **installer + patch upload/validate/ready-to-fetch system** for client rollouts; built the License + privileges framework for end-user access control.

---

## Skills

- **Languages**: JavaScript · TypeScript · Java · HTML5 · CSS3  (working: C · C++ · C# · Go)
- **Frontend**: React · Redux · Vue / VueX · Nuxt.js · JQuery family · chart.js · Bootstrap
- **Backend**: Node.js · NestJs · GraphQL (Apollo, Relay) · REST APIs · J2EE / Servlets / Struts
- **AI / ML**: Voice AI (ASR/TTS/VAD) · LLM application development · AWS Comprehend (NLP)
- **Cloud**: Google Cloud Platform · AWS (Cognito, Comprehend, Kinesis, SNS, SQS) · Cloudflare · Heroku · Tomcat
- **Infrastructure**: Docker · Terraform · Kafka · RabbitMQ · Prometheus · Loki · Grafana · Elasticsearch / Kibana
- **Databases**: PostgreSQL · MySQL · MS-SQL · Oracle · DynamoDB · Redis
- **Testing & perf**: Jest · Selenium · JMeter · WebWorkers + WebAssembly (browser performance)
- **Tooling**: Git · Unleash (feature flags) · Postman · Fiddler · Retool · Claude Code (custom skills + hooks)

---

## Education

**B.E. Electronics & Telecommunication Engineering** · *MIT Academy of Engineering, Alandi* · **First Class with Distinction (66%)** · 2012–2016

---

*Draft generated 2026-05-14 from `master.resume.json` + `intake/02-experience.md`. Confido bullets are user-fill placeholders.*
