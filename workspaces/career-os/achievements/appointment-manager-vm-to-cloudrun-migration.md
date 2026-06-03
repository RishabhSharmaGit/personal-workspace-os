---
slug: appointment-manager-vm-to-cloudrun-migration
title: "VM → Cloud Run migration with sync/API service split — scaled 30 → 90+ clinics"
type: achievement
status: durable
tags: [healthcare, gcp, cloud-run, devops, operational-maturity, confido, architecture]
links: ["[[ehr-integration-platform-40-vendors]]", "[[trade-off-vm-to-cloudrun]]"]
source: null
confidence: high
created: '2026-06-03'
updated: '2026-06-03'
xyz:
  x: "Drove appointment-manager migration from VM-based deployment to GCP Cloud Run with explicit sync-worker / API service split"
  y: "Eliminated user-visible 5-10s deploy windows; removed sync-vs-API noisy-neighbor contention; platform now serves 90+ live clinics with hundreds to 5,000+ voice-AI calls/day per clinic — vs prior ~30-clinic VM ceiling"
  z: "by recognizing scale signals at ~30 clinics (deploy downtime + sync-vs-API contention starving real-time requests), designing the service split for independent horizontal scaling, rebuilding the GitLab CI → Cloud Run pipeline with Workload Identity Federation for keyless CI/CD, and propagating request-scoped telemetry context across services"
tech_tags: [gcp, cloud-run, nestjs, gitlab-ci, workload-identity-federation, opentelemetry, kaniko, pm2, helm]
role_slug: confido-founding-eng
metric: "Scaled from ~30 to 90+ clinics; eliminated 5-10s deploy windows; zero-downtime deploys via Cloud Run revisions"
evidence_url: ""
---

# VM → Cloud Run migration with sync/API service split

## One-line bullet (resume-ready)

Drove appointment-manager migration from VM-based deployment to GCP Cloud Run with explicit sync-worker / API service split — eliminated user-visible 5-10s deploy windows and noisy-neighbor contention between EHR-sync batches and real-time voice-AI API requests, scaling the platform from ~30 to 90+ live clinics.

## Long form (STAR — interview-ready)

**Situation**: At ~30 clinics, appointment-manager was running on a GCP VM with PM2 as process manager. Two failure modes were becoming user-visible: (a) every deploy produced a 5-10s downtime window where calls could fail; (b) heavy EHR-sync batches (Cloud Tasks workers fanning out) were starving real-time voice-AI API requests of CPU and database connections during peak hours.

**Task**: Re-platform before the next 3x clinic growth made these problems user-blocking — without rewriting business logic.

**Action**:
- Designed an explicit service split: **sync-worker** (background EHR pulls dispatched via Cloud Tasks) and **API service** (CareOS + voice-AI-facing endpoints). Same NestJS codebase, two entrypoints.
- Built the GCP Cloud Run deployment surface:
  - GitLab CI → Cloud Run with Kaniko-cached container builds
  - **Workload Identity Federation** for keyless CI/CD (no long-lived service-account keys)
  - Multi-stage Dockerfile (Node 20 Alpine, non-root user, OpenSSL for Prisma)
  - Helm-ready deploy templates
- Propagated request-scoped telemetry context (OpenTelemetry trace IDs) across the split so distributed traces stayed coherent.
- Migrated cold (no traffic cutover stress) — Cloud Run revisions handle blue-green automatically.

**Result**:
- **Zero-downtime deploys** — Cloud Run revisions replace VMs' deploy-then-restart cycle.
- **Independent horizontal scale** per tier — sync-worker scales for batch load, API service scales for voice-AI call volume; neither can starve the other.
- Platform scaled from ~30 clinics to **90+ live clinics in ~12 months post-migration** without contention.
- Foundation for the **OpenTelemetry-first observability stack** (OTLP traces + metrics + logs) that now spans all Confido services.

## Tradeoffs noted

- **Cost**: Cloud Run cold-start latency for less-frequent endpoints is a small tax vs always-on VM. Acceptable because sync-worker is always-warm under steady load and the API service has min-instances configured.
- **Operational**: Lost shell access for ad-hoc debugging. Forced better observability discipline — net positive.

## Related notes

- `[[ehr-integration-platform-40-vendors]]` — the integration platform this migration was scaling
- `[[trade-off-vm-to-cloudrun]]` — full architectural-decision story for behavioral interviews

## What I'd tell an interviewer

"At ~30 clinics, our VM-based deploys were producing visible 5-10s downtimes and we had a real noisy-neighbor problem where heavy EHR-sync batches were starving the real-time voice-AI request path. We had maybe 3 months of headroom left at our growth rate. I led the migration to GCP Cloud Run with an explicit split: a sync-worker service handling background EHR pulls, and an API service handling everything voice-AI- and CareOS-facing. Same NestJS codebase, two entrypoints. Required rebuilding the deploy pipeline — GitLab CI to Cloud Run with Workload Identity Federation for keyless auth, multi-stage Docker, propagating OTel context across the split. The migration was decisive rather than reactive — we cleared the headroom and the platform's tripled clinic count since with zero deploy downtime."
