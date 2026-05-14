# Templates — Frontmatter examples per type

Copy-paste these when creating new files. All required frontmatter fields are shown; optional career-specific fields are commented.

## Application

```yaml
---
slug: 2026-05-20-vercel-staff-frontend
title: "Vercel — Staff Frontend Engineer"
type: application
status: draft
tags: [remote, us-company, staff-eng]
links: ["[[vercel]]", "[[vercel-staff-frontend]]", "[[master-resume]]"]
source: null
confidence: medium
created: '2026-05-20'
updated: '2026-05-20'
# career fields
application_status: applied        # wishlist|applied|screen|technical|onsite|offer|accepted|rejected|withdrawn|ghosted
applied_at: '2026-05-20'
company: vercel
target_role: vercel-staff-frontend
channel: referral                  # referral | direct | recruiter | board:wellfound | board:linkedin | ...
region: remote-from-india
salary_band: "$180k-$220k USD base + equity"
next_action_date: '2026-05-27'
---

## Timeline
- 2026-05-20 — applied via referral [[jane-doe]]

## JD highlights
(paste 3-5 line summary of the role)

## Notes
- Why I want this role:
- Concerns / red flags:
```

## Contact

```yaml
---
slug: jane-doe
title: "Jane Doe — Recruiter @ Vercel"
type: contact
status: draft
tags: [recruiter, us]
links: ["[[vercel]]"]
source: null
confidence: high
created: '2026-05-20'
updated: '2026-05-20'
# career fields
contact_role: "Senior Technical Recruiter"
contact_email: "jane@vercel.com"
contact_linkedin: "https://linkedin.com/in/janedoe"
contact_relationship: recruiter   # recruiter | hiring-manager | referrer | peer | other
company: vercel
---

## How we met
(referral / inbound / cold / event)

## History
- 2026-05-20 — first message
```

## Target role

```yaml
---
slug: vercel-staff-frontend
title: "Vercel — Staff Frontend Engineer (Remote)"
type: target-role
status: draft
tags: [staff-eng, frontend, remote]
links: ["[[vercel]]"]
source: null
confidence: high
created: '2026-05-20'
updated: '2026-05-20'
# career fields
company: vercel
jd_url: "https://vercel.com/careers/123"
region: remote-from-india
salary_band: "$180k-$220k USD"
keywords: [react, nextjs, typescript, system-design, edge-runtime, performance, dx]
---

## Why this role
(1-2 sentences why this is a good fit)

## Must-have keywords (from JD)
- React, Next.js, TypeScript, ...

## Nice-to-have keywords
- ...

## Achievements I'd lead with
- [[voice-ai-p95-latency-reduction]]
- [[scaled-multi-tenant-saas]]
```

## Achievement (XYZ atomic bullet)

```yaml
---
slug: voice-ai-p95-latency-reduction
title: "Reduced voice-AI p95 latency from 1.2s to 320ms"
type: achievement
status: durable
tags: [latency, voice-ai, performance, gcp]
links: ["[[confido-health]]"]
source: null
confidence: high
created: '2026-05-20'
updated: '2026-05-20'
# career fields
xyz:
  x: "reduced voice-AI conversational latency"
  y: "p95 from 1.2s to 320ms"
  z: "by parallelizing TTS warm-up with VAD endpointing and switching to GCP regional ASR"
tech_tags: [gcp, voice-ai, asr, tts]
role_slug: confido-health-founding-eng
metric: "p95 latency: 1.2s → 320ms (-73%)"
evidence_url: ""
---

## One-line bullet
Reduced voice-AI p95 latency from 1.2s to 320ms (-73%) by parallelizing TTS warm-up with VAD endpointing and switching to GCP regional ASR.

## Long form (for behavioral interview)
**S:** ...
**T:** ...
**A:** ...
**R:** ...
```

## Resume variant

```yaml
---
slug: vercel-staff-frontend-resume
title: "Resume — Vercel Staff Frontend"
type: resume
status: draft
tags: [variant]
links: ["[[vercel-staff-frontend]]", "[[master-resume]]"]
source: null
confidence: high
created: '2026-05-20'
updated: '2026-05-20'
# career fields
resume_kind: variant            # master | variant
target_role: vercel-staff-frontend
resume_rendered_pdf_path: "resumes/variants/vercel-staff-frontend.pdf"
---

## Achievements picked (in order)
1. [[voice-ai-p95-latency-reduction]]
2. ...

## Skills ordering tweaks
- Lead with: React, Next.js, TypeScript, System design
- Demoted: Java, .NET

## JSON
See `resumes/variants/vercel-staff-frontend.resume.json`.
```

## Cover letter

```yaml
---
slug: 2026-05-20-vercel-cover-letter
title: "Cover letter — Vercel Staff Frontend"
type: cover-letter
status: draft
tags: []
links: ["[[2026-05-20-vercel-staff-frontend]]", "[[vercel]]"]
source: null
confidence: medium
created: '2026-05-20'
updated: '2026-05-20'
company: vercel
target_role: vercel-staff-frontend
---

Dear Vercel team,
...
```

## Interview prep

```yaml
---
slug: interview-prep-vercel
title: "Interview prep — Vercel"
type: interview-prep
status: draft
tags: [system-design, behavioral]
links: ["[[vercel]]", "[[2026-05-20-vercel-staff-frontend]]"]
source: null
confidence: medium
created: '2026-05-20'
updated: '2026-05-20'
company: vercel
---

## Company facts
- Founders / leadership / engineering style:
- Product surface area:
- Open-source posture:

## Process expected
- Phone screen: ...
- Technical loop: ...

## Stories to prepare
- Leadership: [[voice-ai-p95-latency-reduction]]
- Conflict: ...
- Tradeoff: ...

## System-design topics likely
- ...

## Questions to ask them
- ...
```

## Project

```yaml
---
slug: confido-voice-agent
title: "Confido voice agent"
type: project
status: durable
tags: [voice-ai, healthcare, gcp]
links: ["[[confido-health]]"]
source: null
confidence: high
created: '2026-05-20'
updated: '2026-05-20'
tech: [gcp, voice-ai, livekit, fastapi, postgres]
role: "Founding Software Engineer (lead)"
metric: "p95 latency 320ms; production with 5+ healthcare clinics"
evidence_url: ""
live_url: ""
repo_url: ""
---

## Summary
1-2 paragraphs. Architecture diagram link if any.

## Impact
- ...

## Trade-offs / decisions
- ...
```

## Company

```yaml
---
slug: vercel
title: "Vercel"
type: company
status: durable
tags: [us, remote-friendly]
links: []
source: null
confidence: high
created: '2026-05-20'
updated: '2026-05-20'
careers_url: "https://vercel.com/careers"
hq_location: "San Francisco, CA, USA"
sponsors_visa: occasional
size: "500-1000"
---

## Engineering culture
- ...

## Stack
- ...

## Notes from interviewees
- ...
```

## Decision

```yaml
---
slug: 2026-05-20-prioritize-remote-tracks
title: "Prioritize remote-from-India tracks over relocation"
type: decision
status: durable
tags: [strategy]
links: []
source: null
confidence: high
created: '2026-05-20'
updated: '2026-05-20'
---

## Decision
...

## Context
...

## Consequences
...
```
