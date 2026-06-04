---
slug: therxassistant-tech-lead
title: "TheRxAssistant — Tech Lead (Founding Team)"
type: target-role
status: draft
tags: [target-role, healthcare-ai, founding, tech-lead, remote]
links: ["[[2026-06-04-therxassistant-tech-lead]]", "[[master-resume]]"]
source: null
confidence: high
created: '2026-06-04'
updated: '2026-06-04'
company: therxassistant
jd_url: "personal/references/jds/2026-06-04-therxassistant-tech-lead.pdf"
region: remote-or-us
salary_band: "[FILL — not stated in JD]"
keywords: [nodejs, typescript, python, postgresql, generative-ai, llm, aws, docker, kubernetes, microservices, rest-api, healthcare, hipaa, vector-db, pgvector, temporal, airflow, twilio, voice, sms, chat, websockets, sse, rag, startup, seed-series-a, founding-team]
---

# TheRxAssistant — Tech Lead (Founding Team)

**Raw JD**: `personal/references/jds/2026-06-04-therxassistant-tech-lead.pdf` (gitignored)
**Tailored resume**: [[2026-06-04-therxassistant-tech-lead]] → `resumes/variants/2026-06-04-therxassistant-tech-lead.{html,md,pdf}`

## Company snapshot

TheRxAssistant — building the first AI agents that help consumers navigate **medication discovery and access** (learn about meds → pick up prescriptions). Reaches millions of users through customers/partners. Led by **Sage Khanuja** (repeat healthcare founder, previously founded Spira → sold to Galileo). Team pedigree: Epocrates ($300M acq), One Medical ($4B acq), GoodRx ($19B IPO), Spira. Flat org, early-stage, founding-team hire.

## The role

Founding-team **Tech Lead** building the AI platform from the ground up. Deep full-stack + practical AI implementation. Architect scalable systems, implement LLM solutions, integrate with healthcare systems, own features end-to-end.

## Match analysis — this is a bullseye

| JD requirement | My evidence | Match |
|---|---|---|
| Backend: Node.js/TypeScript (or Python) in production | appointment-manager (NestJS/TS), careOS-Real (Fastify/TS + Python), ehr-connector (TS) | ✅✅✅ strong |
| Advanced PostgreSQL (query opt, indexing, schema) | Prisma + Postgres across appointment-manager, Supabase RLS in careOS-Real, pgx in sara-backend | ✅✅ strong |
| Generative AI / modern LLMs in production (not experimentation) | Voice agents on OpenAI/Anthropic/Gemini via LiteLLM; Pipecat/LiveKit STT+LLM+TTS pipelines; Redis-state + Jinja2 prompt arch | ✅✅✅ strong |
| Cloud on AWS (reliability + security) | **GAP** — currently GCP-primary at Confido. AWS from YouGov (Cognito, Comprehend, Kinesis/SNS/SQS) + Nova era. Mitigate: surface AWS history; cloud-agnostic framing | ⚠️ partial |
| RESTful APIs + microservices integrating with healthcare systems | THE core story — EHR-agnostic API over 40+ EHR/PMS systems; microservice split | ✅✅✅ elite |
| Own features end-to-end (schema → API → prod) | Founding engineer; owns named systems end-to-end | ✅✅✅ strong |
| Docker / containerization / DevOps | Multi-stage Docker, GitLab CI/GitHub Actions, Cloud Run, WIF keyless CI/CD | ✅✅ strong |
| Performance mindset / scalable systems | 3→90+ clinics; latency budgets; hash-diff cost engineering; Wasm browser-core at Cimpress | ✅✅ strong |
| **Bonus** vector DBs (Pinecone/Weaviate/pgvector) | Semantic cache (Upstash); embeddings in voice stack — surface pgvector familiarity | ✅ partial |
| **Bonus** Kubernetes | GKE planned in careOS-Real ADRs (not deep production yet) | ⚠️ light |
| **Bonus** Temporal / Airflow | **Temporal Cloud** in sara-backend (outreach workflows) | ✅✅ strong |
| **Bonus** Healthcare / regulated industry | Confido (voice AI, HIPAA, 40+ EHR), Nova (insurance), Seclore (cybersec/IRM) | ✅✅✅ elite |
| **Bonus** voice/SMS/chat APIs (Twilio) | Twilio SIP + voice webhooks in production at Confido | ✅✅✅ strong |
| **Bonus** real-time (WebSockets/SSE) | SSE streaming transcripts (sara-frontend), MongoDB change streams | ✅✅ strong |
| **Bonus** Seed–Series A startup | Confido (Series A founding eng), Nova (early), Spira-parallel | ✅✅✅ strong |
| Medication / prescription navigation domain | appointment-manager handles **medication & prescription refills** workflow directly | ✅✅✅ on-the-nose |

**Verdict**: ~13 of 15 requirements are strong/elite matches. The Rx/medication-access domain overlap is exact. Two soft spots: **AWS** (I'm GCP-primary now; have real AWS history) and **Kubernetes** (GKE planned, not deep). Both are addressable in framing — neither is a dealbreaker for a founding-team role that values range + judgment.

## Tailoring strategy for the resume

1. **Lead the summary with**: founding healthcare voice-AI eng + production LLM + healthcare-systems integration + medication/Rx workflows. Mirror "medication discovery and access" language.
2. **Selected Impact band** (top): the 40+ EHR platform, the LLM/voice runtime work, the 0→1 scale (3→90+ clinics), the integration-velocity metric.
3. **Surface AWS explicitly** in skills (from YouGov/Nova) so the ATS keyword matches — frame cloud as "GCP + AWS". Don't hide that current is GCP, but lead skills with both.
4. **Echo exact JD keywords**: Node.js/TypeScript, PostgreSQL, generative AI/LLMs, RESTful APIs, microservices, Docker, Temporal, Twilio, SSE/WebSockets, HIPAA, vector DB/pgvector, healthcare.
5. **Drop**: Nova/YouGov/Cimpress/Seclore compress to 1-2 lines each (older, less relevant) — but keep YouGov's AWS + Comprehend (AWS + production ML signal) and Cimpress's Wasm (performance signal).
6. **Bonus alignment**: explicitly name Temporal, Twilio, SSE, pgvector, healthcare/HIPAA — they're literally in the JD bonus list and I have all of them.

## Open questions before applying

- [ ] Salary band — not stated in JD. Research / ask recruiter. Likely US startup band; for remote-from-India, anchor against `private/comp-targets.md`.
- [ ] Remote-from-India acceptable? JD doesn't say location. Worth confirming — team is US (healthcare). Could be remote or relocation.
- [ ] AWS depth — will they care that I'm GCP-primary now? Prepare the "cloud-agnostic, deep on GCP, real AWS history, ramp fast" framing.

## Application

See [[2026-06-04-therxassistant-tech-lead]] (applications/) for status tracking.
