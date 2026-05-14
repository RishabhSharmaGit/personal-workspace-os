---
slug: 2026-05-14-us-h1b-data-and-process
title: "US H-1B visa — data, process, alternatives (for Indian SWE)"
type: note
status: durable
tags: [research, visa, us, h1b, relocation]
links: ["[[2026-05-14-remote-from-india-playbook]]"]
source: null
confidence: medium
created: '2026-05-14'
updated: '2026-05-14'
region: us
---

# US H-1B — data, process, alternatives (Indian SWE)

Reference notes for evaluating US opportunities. Distilled from `h1bagent.pages.dev` + general knowledge as of 2026-05. **Verify thresholds directly with USCIS / your immigration attorney before any decision** — visa rules change yearly.

## TL;DR for a 10-yr Indian SWE

- **H-1B is lottery-gated.** ~30% selection rate in recent years. Multiple-employer registrations were banned in FY2025 reform. Plan around **not getting selected.**
- **The bigger problem is EB-2/EB-3 wait time.** Indian-born applicants face the longest green-card backlog of any country (often 50+ years for EB-2/EB-3). H-1B → GC is a multi-decade commitment.
- **Better paths for senior IC**: O-1A (extraordinary ability), L-1B (intra-company transfer if your employer has a US entity), or E-3 (Australia-only — N/A for you).
- **Confido is NY-based.** If Confido has US infrastructure for visa sponsorship, an L-1 transfer or H-1B sponsorship route exists. Worth exploring directly with leadership.
- **Salary comparison**: H-1B prevailing wage for Senior SWE in major US cities is $130-180k base; staff+ levels at top employers reach $250-400k+ TC. Compare against remote-from-India TC after taxes.

## Process at a glance

```
1. Employer files Labor Condition Application (LCA) with DOL
       ↓
2. Employer files H-1B petition (Form I-129) with USCIS
       ↓  (FY2026 onwards: filed only AFTER lottery selection)
3. USCIS runs electronic registration (lottery) — typically March
       ↓ (selected ~30% of registrations)
4. Selected employer files full petition by April-June
       ↓
5. Approval (or RFE / denial)
       ↓
6. Visa stamping at US consulate (Mumbai/Delhi/Chennai/Hyderabad/Kolkata)
       ↓
7. Travel to US, start work Oct 1
       ↓
8. (Optional) Spouse H-4 visa; H-4 EAD if applicable
       ↓
9. Multi-year: employer files I-140 (immigrant petition) → priority date
       ↓
10. EB-2 / EB-3 backlog: 50+ years for India-born as of 2026
```

## Key thresholds (2026 reference — VERIFY annually)

| Field | Value | Notes |
|---|---|---|
| H-1B annual cap (regular) | 65,000 | |
| H-1B cap (US Master's) | +20,000 | extra lottery round for US-degree holders |
| Cap-exempt employers | universities, gov research orgs, some hospitals | unlimited H-1Bs |
| Registration fee | $215 | per registration (was $10 before FY2025) |
| Petition filing fees | $4,400+ | varies by employer size |
| Prevailing wage levels (DOL) | I/II/III/IV | senior SWE typically III or IV |
| H-1B max duration | 6 years (3+3) | extendable beyond if I-140 approved |
| Premium processing | 15-day, +$2,805 | optional |
| L-1A duration | 7 years | for executives/managers |
| L-1B duration | 5 years | for specialized knowledge |
| O-1A criteria | 3+ of 8 evidentiary categories | "sustained acclaim"; high bar but no lottery |

## Indian backlog reality

| Category | Petitions filed (Indian-born) | Estimated wait (2026 est.) |
|---|---|---|
| EB-1 (extraordinary) | low | 1-3 years |
| EB-2 (advanced degree) | high | 50+ years |
| EB-3 (skilled labor) | high | 60+ years |
| EB-5 (investor, $800k-$1.05M) | medium | 5-8 years |

Source: USCIS visa bulletin trends; verify current with DOS Visa Bulletin monthly.

## Useful tools and data sources

- **h1bagent.pages.dev** — free analytics on H-1B data 2001-2027; LCA records, employer top filers, salary trends, EB wait projections. Best free tool for due diligence on specific employers.
- **USCIS H-1B Employer Data Hub** — `https://www.uscis.gov/h-1b-employer-data-hub` — official approvals/denials per employer per year.
- **DOL H-1B LCA disclosure data** — `https://www.dol.gov/agencies/eta/foreign-labor/performance` — salary data per role per location.
- **DOS Visa Bulletin** — `https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html` — monthly priority date updates for EB categories.
- **myvisajobs.com / h1bgrader.com** — third-party scrapers of LCA data; useful for "how does Vercel sponsor?" lookups.

## Alternatives worth considering before defaulting to H-1B

| Visa | Fit for you | Effort | Notes |
|---|---|---|---|
| **O-1A** (extraordinary ability) | Maybe — you need to build evidence (papers, talks, awards, press, judging) over 1-2 years | High | No lottery, no cap, renewable indefinitely. Your voice-AI founding-eng role is a credible base. |
| **L-1A / L-1B** | Yes — IF Confido qualifies as L-1 sponsor (multinational employer with US entity, you've worked there 1+ year continuously outside US) | Medium | No lottery. L-1B is "specialized knowledge"; L-1A is "executive/manager". Path to EB-1C (faster GC for managers). |
| **EB-2 NIW** (National Interest Waiver) | Maybe — if you can argue your AI/healthcare work has national interest | Medium-High | Self-petition; no employer needed. Still has the EB backlog problem for Indian-born. |
| **TN** (NAFTA) | No — Canada/Mexico only | — | |
| **E-3** | No — Australian citizens only | — | |
| **H-1B1** | No — Chile/Singapore citizens only | — | |
| **B-1 in lieu of H-1B** | Niche — short-term US visits for specific knowledge transfer | Low | 6-month limit; not a long-term path |

## Decision factors to write into `intake/07-relocation-preferences.md`

- Am I willing to do the H-1B lottery (i.e. spend a year+ with uncertain US move)?
- Does Confido have a US entity that could do L-1 (if I stay 1+ year, this becomes available)?
- Am I willing to invest 1-2 years in O-1A evidence-building (papers, conferences, awards)?
- What's my floor TC in USD for relocation to make sense vs. staying remote?
- Will I commit to a 5-50 year green card timeline as an Indian-born applicant?

## Honest assessment for your primary track

Remote-from-India keeps **all** of these doors open without committing. You can build O-1A evidence while working remote (talks, papers, OSS), maintain L-1 eligibility at Confido, and apply opportunistically if H-1B lottery selection happens. **Remote-first → optionality.**
