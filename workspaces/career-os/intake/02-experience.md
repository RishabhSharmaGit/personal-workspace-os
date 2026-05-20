---
slug: intake-02-experience
title: "Intake — Experience timeline"
type: note
status: draft
tags: [intake, experience]
links: []
source: null
confidence: medium
created: '2026-05-14'
updated: '2026-05-14'
---

# 02 — Experience timeline

Roles 2–5 pre-populated from `personal/resumes/2024-09-rishabh-sharma-sde3.pdf`. Role 1 (Confido) is left for you to fill manually per your instruction. Education and Misc populated where the resume had data.

Total tenure as of 2026-05: **~10 years** (Jun 2016 → present).

---

## Role 1 — Founding Software Engineer @ Confido Health

`[FROM-PDF]` ✅

- **Period**: Oct 2024 – Present (1 year 7 months as of 2026-05)
- **Location**: Bangalore and New York (employer in both)
- **Domain**: Healthcare, Voice AI
- **Headline (from PDF)**: "Building Industry leading voice AI. Freeing up staff time to focus on patient care."

### Stack / tech (`[FILL]` — expand from your work)
- Languages: `[FILL]`
- Frameworks: `[FILL]`
- Infra/cloud: GCP (per top-skills on PDF), `[FILL the rest]`
- Voice AI specifics: `[FILL]` (e.g. ASR provider, TTS, VAD, LLM)
- Database: `[FILL]`

### Accomplishments (XYZ — `[FILL]` 3-6 bullets)
1. `[FILL — e.g. "Built X production feature serving Y customers/users, by Z"]`
2. `[FILL]`
3. `[FILL]`
4. `[FILL]`
5. `[FILL]`
6. `[FILL]`

### Trade-offs / decisions worth interview stories
- `[FILL]`

---

## Role 2 — Tech Lead / SDE3 @ Nova Benefits

`[FROM-SDE3-RESUME]` ✅

- **Period**: Jul 2022 – Sep 2024 (2 years 3 months)
- **Location**: Remote — Bangalore base
- **Title at resume time**: Tech lead - SDE3
- **Domain**: Insurance / employee benefits / HR-tech
- **Scale of product**: 250,000 active employees + 3,000 HR admins served
- **Team owned**: 5 developers (one of three engineering teams in Nova)

### Stack / tech
- Languages: JavaScript, TypeScript (from overall resume skills)
- Frameworks: React, Redux, Node.js, NestJs, GraphQL Apollo, REST APIs (from overall resume)
- Integration tools used explicitly: Retool app builder (custom onboarding), Razorpay SDK (web checkout), Mailmodo (email automation), WATI (WhatsApp)
- HRMS integrations shipped: Google Workspace, Zoho People, Darwinbox (resume mentions "etc.")
- Insurer integrations shipped: ICICI, CARE (via their API kit)
- Infra likely involved: AWS / Terraform / Docker (overall resume skills) — `[VERIFY which specifically at Nova]`
- Database: `[VERIFY — PostgreSQL most likely]`

### Accomplishments (XYZ — pulled from resume; verify metrics + claim ownership)
1. Led one of three engineering teams (5 developers), collaborating with PM, QA, and CTO on roadmap delivery
2. Owned the **endorsements module** for 250K active employees + 3K HR admins (insertion/deletion of employees to group + retail policies)
3. Consolidated dispersed endorsement + onboarding logic into a unified central module → **90% reduction in legit issues reported in core modules** ⭐ strong metric
4. Built a **highly scalable HRMS integration core framework** — any new HRMS platform integrable in **3-4 days** ⭐ strong metric (vs prior baseline `[FILL]`)
5. Integrated ICICI + CARE insurer APIs for endorsement data submission and batch tracking → **reduced endorsement TAT from 14 days to a few hours** ⭐ strong metric
6. Integrated **Razorpay SDK** for standard web checkout on retail product purchases
7. Co-owned **onboarding** of fresh client employees: built modular custom onboarding/enrollment features using Retool app builder for specific client needs
8. Built self-served mental/financial health **assessment module** for employees
9. Designed **CD Account management system** — client wallet structure for transactional needs
10. Built **Rater-based premium calculation** of policy charges + refund framework for batches of endorsed data
11. Integrated **Mailmodo** (emails) and **WATI** (WhatsApp comms) for CX
12. `[FILL — anything since the resume was last edited Sep 2024]`

### Notable interview stories
- The 90% issue-reduction story: what was the architectural decision, what failed before, how did the new structure stop it?
- The 14-day → hours TAT story: which specific batch-tracking + automated submission mechanism made the difference?
- The 3-4 day HRMS onboarding story: what's the abstraction inside the framework that made it pluggable?

---

## Role 3 — Full Stack Engineer @ YouGov

`[FROM-SDE3-RESUME]` ✅

- **Period**: Jun 2020 – Jul 2022 (2 years 1 month)
- **Location**: Remote — UK employer
- **Domain**: Market research / consumer-data / chat-based engagement
- **Scale of product**: YouGov.Chat panel size **1,200,000 users**
- **Role shape**: Individual contributor (IC) for enhancements + complex problems

### Stack / tech
- Languages: JavaScript, TypeScript
- Frameworks: React/Redux likely, Node.js (from overall resume); `[VERIFY — Vue/Nuxt at YouGov?]`
- Feature flags: **Unleash**
- Auth: **AWS Cognito** (social login)
- CMS: **StoryBlok** (headless)
- NLP: **AWS Comprehend** (opinion / foul-language filtering on user comments)
- Infrastructure: **Terraform**
- Push: notification integration
- Reward payouts: integrated a bank API

### Accomplishments (XYZ — from resume Projects section)
1. Owned end-to-end dev, maintenance, and ops for **YouGov.Chat** — chat-based engagement platform serving a **1.2M user panel**
2. Built and maintained the **in-house CMS** providing standard creation/editing/publishing flow across YouGov platforms
3. Set up **Feature Flags via Unleash** for controlled rollouts
4. Integrated **AWS Cognito** for social login
5. Integrated **StoryBlok** as a headless CMS for content management
6. Built **user comments + rating** functionality with **AWS Comprehend** filtering to detect foul language and extract opinion
7. Integrated **bank API** for distribution of user rewards (panel monetization)
8. Set up infrastructure via **Terraform**
9. Implemented **push notification** system across the platform

### Notable interview stories
- AWS Comprehend opinion-filtering story: cost vs accuracy trade-off
- Why headless CMS (StoryBlok) over a fully custom CMS
- Terraform infra story: what was the team's prior state

---

## Role 4 — Senior Software Developer / Software Developer @ Cimpress Technology

`[FROM-SDE3-RESUME]` ✅

- **Period**: Feb 2019 – Jun 2020 (1 year 5 months total)
- **Promoted to Senior**: ~Oct/Nov 2019 (resume says "within 8 months")
- **Location**: Mumbai, India
- **Domain**: Mass customization / print-on-demand; specifically embroidery software products
- **Product**: **StitchX** — automated conversion of image/artwork into machine-specific embroidery instructions

### Stack / tech
- Primary contributor + proprietor of embroidery software products (API management + dev on StitchX)
- Languages: JS/TS, C++ likely (Wasm/embroidery core typically requires it); `[VERIFY]`
- Browser performance: **WebWorkers** + **WebAssembly (Wasm)** — used to run embroidery core in client's browser via async thread-pool
- AI: mathematical / image-processing techniques for artwork → stitch-instruction conversion
- Testing: JMeter (you designed a dedicated API testing project here)
- CI/CD: pipelines maintained + upgraded over the role

### Accomplishments (XYZ — from resume)
1. Acted as **primary contributor and proprietor** of Cimpress's embroidery software product family
2. Implemented **asynchronous thread-pool-based embroidery core** running in client's browser via **WebWorkers + WebAssembly** — offloads heavy stitch-computation client-side ⭐ rare technical highlight
3. Drove requirement-gathering from production artists, feasibility tests, and delivery
4. Designed a dedicated **JMeter-based API testing project** from scratch
5. Maintained and upgraded automated test suites (unit + integration + UI) and CI/CD pipelines
6. **Promoted to Senior in ~8 months** based on project impact

### Notable interview stories
- WebAssembly story: why client-side compute, what was the latency/cost trade-off?
- Promotion story: what specifically did you ship that moved the needle?

---

## Role 5 — Product Engineer @ Seclore Technology

`[FROM-SDE3-RESUME]` ✅

- **Period**: Jun 2016 – Feb 2019 (2 years 9 months) — **first full-time role**
- **Location**: Mumbai, India
- **Domain**: Data-centric cyber-security; Information Rights Management (IRM)
- **Product**: **FileSecure** — Seclore's flagship IRM platform

### Stack / tech
- Languages: Java (from overall resume), JavaScript
- Frameworks: **J2EE, Servlets, Struts** (enterprise Java stack on the server side)
- UI: **JQuery, JQueryUI, Knockout, chart.js** (from overall resume — most of these were used here)
- Full lifecycle exposure: requirements analysis → development → QA release

### Accomplishments (XYZ — from resume Projects section)
1. Built back-end (server) + front-end across Seclore's flagship product **FileSecure**, owning the entire development lifecycle
2. Co-authored and maintained the **OU Admin dashboard** — monitoring protected files, active users, and crucial data per Organizational Unit
3. Authored multiple **responsive product pages + their backends**
4. Designed a **centralized initialization + update mechanism for PolicyServer configuration** — eliminated config-drift across distributed deployments
5. Built **installer + patch upload/validate/ready-to-fetch mechanism** for product rollouts across all client deployments
6. Designed a **License & privileges framework** for end-user access control
7. Gained hands-on experience across many JavaScript frameworks + JQuery plug-ins

### First-job context
- Notable for: rare cybersecurity / IRM domain exposure (most resumes don't have this)
- Potential referrers from this period: `[FILL — names if you stay in touch]`

---

## Education

| Field | Value | Source |
|---|---|---|
| Bachelor's institution | MIT Academy of Engineering, Alandi, Pune | `[FROM-PDF]` ✅ |
| Bachelor's degree | B.E. Electronics and Telecommunication | `[FROM-PDF]` ✅ |
| Bachelor's period | Jun 2012 – May 2016 | `[FROM-PDF]` ✅ |
| Bachelor's grade | **First Class with Distinction (66%)** | `[FROM-SDE3-RESUME]` ✅ |
| 12th board | CBSE-AISSCE | `[FROM-SDE3-RESUME]` ✅ |
| 12th school | Air Force School, Viman Nagar, Pune | `[FROM-SDE3-RESUME]` ✅ |
| 12th period | Aug 2010 – Mar 2012 | `[FROM-SDE3-RESUME]` ✅ |
| 12th grade | **71.80%** | `[FROM-SDE3-RESUME]` ✅ |
| 10th board | CBSE-AISSE | `[FROM-SDE3-RESUME]` ✅ |
| 10th school | Air Force School, 9BRD, Pune | `[FROM-SDE3-RESUME]` ✅ |
| 10th period | Apr 2008 – Mar 2010 | `[FROM-SDE3-RESUME]` ✅ |
| 10th grade | **89.30%** | `[FROM-SDE3-RESUME]` ✅ |
| Honors / awards | `[FILL]` | — |

---

## Interests / personal (from SDE3 resume)

These are useful for the "tell me about yourself" / cultural-fit portion of behavioral interviews. Pulled verbatim from the resume; verify they're still current and add anything new.

- Travel: love exploring new places, road trips, exotic destinations
- Food: obsessed with local cuisines; culinary enthusiast
- Hiking: avid hiker — completed many treks in Maharashtra
- Sports: Table-Tennis, Basketball, Badminton, Football
- Dancing: participated in many events across school + college
- Event Organisation

---

## Misc

- Side projects / consulting outside main employment? `[FILL]`
- Conferences / talks / publications? `[FILL]`
- Open-source maintainership? `[FILL]`
- Patents? `[FILL]`
