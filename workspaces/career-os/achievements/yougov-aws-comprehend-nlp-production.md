---
slug: yougov-aws-comprehend-nlp-production
title: "YouGov.Chat — AWS Comprehend NLP for opinion + foul-language filtering at 1.2M-user panel scale"
type: achievement
status: durable
tags: [nlp, aws-comprehend, production-ml, yougov, content-moderation, user-comments]
links: []
source: null
confidence: high
created: '2026-06-03'
updated: '2026-06-03'
xyz:
  x: "Built user-comment + rating moderation on YouGov.Chat using AWS Comprehend NLP for both foul-language detection and opinion/sentiment extraction"
  y: "Shipped on YouGov.Chat — a chat-based engagement platform with a 1,200,000-user panel — for real-time filtering of user-generated content; opinion-extraction features fed downstream analytics surfaced to YouGov's research teams"
  z: "by designing the moderation pipeline as a streaming pass over user-submitted comments, calling AWS Comprehend for sentiment + key-phrase + entity extraction in parallel, and applying a tunable confidence threshold to gate display vs. quarantine vs. block — with the model decisions tracked for auditability"
tech_tags: [aws-comprehend, nlp, javascript, typescript, production-ml, content-moderation, aws]
role_slug: yougov-fullstack
metric: "Production NLP at 1.2M-user-panel scale; opinion + foul-language filtering on user comments + ratings"
evidence_url: ""
---

# YouGov.Chat — AWS Comprehend NLP for user-content moderation

## One-line bullet (resume-ready)

Built production user-comment + rating moderation on YouGov.Chat using **AWS Comprehend** for both foul-language detection and opinion extraction at **1.2M-user panel scale** — automated content gating that previously needed manual review, while feeding sentiment + key-phrase data back to YouGov's research teams.

## Long form (STAR — interview-ready)

**Situation**: YouGov.Chat is YouGov's chat-based engagement platform — 1.2M users participate in research panels by answering questions and providing free-text opinions on topics. User-generated comments and ratings carry two problems: (a) some contain foul language or abuse that has to be filtered before downstream display, and (b) the free-text opinions are research-valuable signal — sentiment + key phrases need to be surfaced to YouGov's research teams.

**Task**: Build a production NLP pipeline that handles both jobs from the same content stream.

**Action**:
- Designed a **streaming moderation pipeline** that ran user comments through AWS Comprehend in parallel — sentiment analysis, key-phrase extraction, entity recognition, and language detection in one set of calls.
- Built a **tunable confidence-threshold gate** that bucketed each comment into display / quarantine / block. Quarantine surfaced to human reviewers; block was logged with the model decision for auditability.
- **Surfaced opinion signal back to YouGov's research teams** — sentiment scores and extracted key phrases became part of the research dataset, not just content-moderation byproduct.
- Handled scale via batched Comprehend calls and graceful degradation (if Comprehend was slow, comments fell back to a delayed-review queue rather than blocking the user-facing chat flow).

**Result**:
- **Production NLP at 1.2M-user-panel scale** — real-time filtering on user comments + ratings
- **Two-for-one outcome**: same Comprehend calls served content moderation *and* enriched research data
- Reduced manual review load for the content-moderation team while maintaining display safety

## Why this matters for interviews

For AI/ML-adjacent roles, this is a credible production-NLP story from before the LLM era. Demonstrates: (a) integrating a production ML service into a user-facing flow at meaningful scale, (b) designing the pipeline so the same ML calls serve multiple business purposes, (c) confidence-threshold gating with auditability — the kind of detail interviewers probe for.

For general SWE roles, it's a "I've shipped production ML at scale" data point that pairs well with the voice-AI work at Confido.

## What I'd tell an interviewer

"At YouGov, I built user-comment + rating moderation on YouGov.Chat — our chat-based engagement platform with a 1.2-million-user panel. The interesting bit was that the same content stream had two jobs: filtering foul language before display, and extracting opinion signal — sentiment, key phrases, entities — that fed back to YouGov's research teams as actual research data. I designed a streaming pipeline that ran each comment through AWS Comprehend in parallel for all those tasks, and built a tunable confidence-threshold gate that bucketed comments into display, quarantine, or block. Quarantine surfaced to human reviewers; block was logged with the model decision for auditability. The same Comprehend calls served content moderation and enriched the research dataset — two-for-one. Real-time on a 1.2M-panel scale."

## Related notes

(none — this is the YouGov-era NLP work; standalone)
