---
slug: intake-06-portfolio-projects
title: "Intake — Portfolio & projects"
type: note
status: draft
tags: [intake, portfolio]
links: []
source: null
confidence: medium
created: '2026-05-14'
updated: '2026-05-14'
---

# 06 — Portfolio & projects

Work projects pre-populated from `personal/resumes/2024-09-rishabh-sharma-sde3.pdf` Projects section. **Verify metrics + claim ownership** before promoting any to a public `projects/{slug}.md`.

## Three-tier portfolio model (industry standard for senior SWEs in 2026)

1. **GitHub profile README** — pinned 3–5 repos, brief bio, contact. Recruiters glance at contribution graph.
2. **Personal site** — case studies with metrics, architecture diagrams, talks/posts. Custom `.dev` or `.com` domain.
3. **3–5 deep projects with live demos** — what you'd send to a hiring manager.

## Current state — inventory

### Public GitHub
- URL: https://github.com/RishabhSharmaGit ✅ (from `intake/01-profile.md`)
- Profile README exists? `[VERIFY]`
- Pinned repos: `[FILL — which 3-5 to pin?]`
- Recent commit cadence: `[FILL]`
- Any repo with >50 stars: `[FILL]`

### Personal site
- Exists? `[FILL — yes/no]`
- URL: `[FILL]`
- Last updated: `[FILL]`

### Other public artifacts
- Blog posts: `[FILL]`
- Talks / conferences: `[FILL]`
- Podcast appearances: `[FILL]`
- OSS contributions to known projects: `[FILL]`
- Stack Overflow / community: `[FILL]`

---

## Project list — to seed `projects/` folder

### Work projects worth highlighting

#### 1. Central endorsement + employee-onboarding mechanism (Nova, 2022–2024) ⭐⭐
- **Role**: tech lead, architectural owner
- **Tech**: Node.js / React stack (verify), Retool app builder for custom client onboarding
- **Impact**: Consolidated dispersed logic into a unified module → **90% reduction of legit issues reported in core modules**
- **Why interesting**: classic "consolidation refactor" story with a hard metric; great for system-design interviews
- **Public version possible?** No — Nova proprietary. Write as a *sanitized* case study (you can name Nova; describe arch generically)
- **Promotion target**: `projects/nova-central-endorsement.md`

#### 2. Nova HRMS / Insurer / Payment integrations framework ⭐⭐
- **Role**: builder + framework designer
- **Tech**: Node.js, REST API integration patterns; **HRMS partners**: Google Workspace, Zoho People, Darwinbox; **insurers**: ICICI, CARE; **payments**: Razorpay SDK
- **Impact**:
  - Any new HRMS integrable in **3-4 days** (vs. baseline `[FILL]`)
  - Insurer integration → endorsement TAT cut from **14 days → a few hours**
- **Why interesting**: pluggable integration framework — strong "abstraction at the right level" story
- **Promotion target**: `projects/nova-integrations-framework.md`

#### 3. Additional Nova platform modules
- Self-served mental/financial health **assessment module**
- **CD Account management** (wallet structure for client transactions)
- **Rater-based premium calculation + refund framework**
- **Mailmodo** email automation framework
- **WATI** WhatsApp comms integration
- Various CX-ops internal tools
- **Promotion target**: maybe one composite note `projects/nova-platform-modules.md` since none individually large

#### 4. YouGov.Chat development + maintenance (2020–2022) ⭐
- **Role**: individual contributor
- **Scale**: 1,200,000-user panel
- **Tech**: Unleash (feature flags), AWS Cognito (social login), StoryBlok (headless CMS), AWS Comprehend (NLP), Terraform (infra), bank API integration, push notifications
- **Why interesting**: the AWS Comprehend foul-language/opinion filtering is a clean concrete AI use case; Cognito + StoryBlok integration story shows pragmatism
- **Promotion target**: `projects/yougov-chat.md`

#### 5. YouGov in-house CMS
- **Role**: builder + maintainer
- **Tech**: `[FILL — exact stack]`
- **Impact**: standardized content creation/editing/publishing flow across YouGov platforms
- **Promotion target**: candidate for a short note or fold into project 4

#### 6. Cimpress StitchX — embroidery designing tool (2019–2020) ⭐⭐
- **Role**: primary contributor + proprietor
- **Tech**: **WebWorkers + WebAssembly** to run embroidery core in client's browser via async thread-pool
- **Impact**: client-side compute model — reduced server cost / latency `[FILL specifics]`
- **Why interesting**: rare technical story — Wasm in browser for a non-trivial workload; great for technical-depth interviews
- **Promotion target**: `projects/cimpress-stitchx.md`

#### 7. JMeter API testing project (Cimpress era + continued at Nova)
- **Role**: solely designed and developed
- **Tech**: JMeter for API load + functional testing
- **Why interesting**: shows ownership of testing tooling — a "infra/dx" signal
- **Promotion target**: candidate; smaller scope, maybe combine with overall CI/CD work

#### 8. Seclore FileSecure — IRM platform (2016–2019)
- **Role**: product engineer; full-stack across the flagship product
- **Tech**: J2EE / Servlets / Struts (backend); JQuery / JQueryUI / Knockout (frontend); chart.js
- **Sub-projects**:
  - OU Admin dashboard (co-author/maintainer): monitoring of protected files, active users, OU data
  - **PolicyServer centralized config init + update mechanism** — eliminates config-drift across distributed deployments
  - **Installer + patch upload/validate/ready-to-fetch** for client deployments
  - **License & privileges framework** for end-user access control
- **Why interesting**: rare cybersecurity / IRM domain experience; few resumes have this
- **Promotion target**: `projects/seclore-filesecure.md`

#### 9. Confido voice AI (2024–present)
- **Role**: founding engineer
- **Tech**: GCP, voice AI stack `[FILL specifics]`
- **Impact**: `[FILL]`
- **Why interesting**: this is THE differentiated current project — production voice AI in healthcare; rare and valuable for AI-engineer roles
- **NDA**: `[VERIFY before listing publicly]`
- **Promotion target**: `projects/confido-voice-agent.md`

### Personal / side projects

- **Personal Workspace OS** (this repo) — local-first, LLM-mediated knowledge OS with Markdown source-of-truth + Postgres index. Includes custom skills (capture, research, distill-chat, query, triage-inbox, weekly-review, index-rebuild) and a Karpathy-style LLM-wiki of atomic notes. **Worth promoting** if you make any portion public.
  - **Tech**: TypeScript, Bun, Postgres (Supabase local), Zod, pgvector, gray-matter, Claude Code skills/hooks
  - **Promotion target**: `projects/personal-workspace-os.md` — strong "self-directed engineering" signal
- `[FILL — any other side projects]`

### Aspirational / planned

- `[FILL]`

---

## Project promotion checklist

Before promoting a project to `projects/{slug}.md`:

- [ ] 1-sentence summary you could put on a resume
- [ ] At least 1 quantified metric
- [ ] One specific trade-off you navigated, written down
- [ ] An evidence link (repo / demo / case study / screenshot / blog post)
- [ ] Tech stack tags filled in frontmatter

Without those, it's not a portfolio piece — it's just a bullet.

## Top 5 ranking (recommended for first portfolio pass)

In order of "send this to a hiring manager who has 5 minutes":

1. **Confido voice AI** (after NDA check) — most current, most differentiated
2. **Nova central endorsement + HRMS framework** — clearest measurable architecture story (90% issue reduction + 14d→hours TAT + 3-4 day HRMS onboarding)
3. **Cimpress StitchX (Wasm in browser)** — rare technical depth story
4. **Personal Workspace OS** — self-directed engineering, modern stack, AI-leveraged
5. **YouGov.Chat (AWS Comprehend + integrations)** — pragmatic ML-in-prod
