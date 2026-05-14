---
slug: 2026-05-14-remote-from-india-playbook
title: "Remote-from-India playbook — primary track"
type: note
status: durable
tags: [research, remote, primary-track, india, tax, payment]
links: ["[[2026-05-14-job-platforms-catalog]]", "[[2026-05-14-us-h1b-data-and-process]]", "[[2026-05-14-eu-mobility-india]]", "[[2026-05-14-ireland-relocation]]"]
source: null
confidence: medium
created: '2026-05-14'
updated: '2026-05-14'
region: remote-from-india
---

# Remote-from-India playbook — PRIMARY track

Per intake answer: **remote-from-India for any country, optimized for salary + work quality + lifestyle.** This note synthesizes platforms, employment structures, payment infrastructure, and tax patterns.

## Why this is the primary track

- Confido already works (NY-based employer, you're in Pune, voice AI domain).
- Indian cost-of-living + USD/EUR salary = best TC-after-tax of any track in your matrix.
- No visa lottery, no relocation disruption, no citizenship trade-off.
- Family, social network, parents, lifestyle remain.
- Optionality preserved (you can still relocate later when terms warrant).

## Three employment shapes — pick the right one per role

### Shape A: Direct W2-equivalent at a global company with India entity

- **Examples**: most large companies with Indian GCCs (Google, Microsoft, Stripe, Atlassian, GitLab, Cloudflare, etc.)
- **You become**: an India-employed full-time employee. Local Indian payroll, INR salary.
- **Pros**: stable; ESOPs work normally; PF/health benefits; visa-track-able if later you want to relocate within the company
- **Cons**: India payroll often means **India-comparable TC**, not US-comparable. Same role at GCC might pay ₹60-90L; same role hired from US HQ might pay $200-300k.

### Shape B: Independent contractor (1099-equivalent / Indian sole proprietor)

- **Examples**: Toptal, Arc.dev, Gun.io contracts; or direct contracts with foreign companies
- **You become**: a service provider invoicing in USD/EUR
- **Pros**: full salary in foreign currency (typically 1.5-3x what GCC pays); flexible
- **Cons**:
  - You handle your own tax (file ITR-4 as Presumptive Taxation under Sec 44ADA — service providers can declare 50% as profit, the rest as expenses, on revenue up to ₹75L FY2025+)
  - No PF, no health benefits, no employer ESOPs
  - GST registration mandatory above ₹20L turnover
  - LUT (Letter of Undertaking) needed to zero-rate export of services
  - Need to track FEMA / RBI compliance for foreign remittances

### Shape C: Employer-of-Record (EoR) — Deel / Remote.com / Multiplier / Velocity Global

- **Examples**: most early-stage US/EU startups hiring you "as full-time" but using an EoR to handle Indian compliance
- **You become**: an employee of the EoR (Deel India, Remote.com Services India, etc.), placed at the client company
- **Pros**: full-time benefits (PF, gratuity, health insurance, paid leave); often higher salary than Shape A because pay is benchmarked to client's HQ, not GCC market; client handles employer-side compliance
- **Cons**:
  - EoR takes 8-15% fee (passed on to client, but reduces effective offer)
  - Some EoRs offer worse benefits than direct employment (verify per platform)
  - Termination clauses can be weaker than direct employment
  - ESOPs — varies; sometimes simulated via cash bonuses (no real equity)

### Shape comparison (for senior SWE 2026)

| Field | A: GCC | B: Contractor | C: EoR |
|---|---|---|---|
| Typical TC range | ₹60-150L | $100-250k+ USD | $130-220k USD |
| Currency | INR | USD/EUR | USD/EUR (paid as INR equivalent) |
| Tax effective rate | 20-30% (incl ESOP) | ~20% under 44ADA (presumptive) | 25-35% (TDS as salary) |
| PF + gratuity | Yes | No | Usually yes |
| Health insurance | Yes | DIY | Usually yes |
| ESOPs (real) | Yes | No | Rarely real |
| Predictability | High | Medium | High |
| Setup complexity | Low | High | Low |

## Tier-1 platforms for remote-from-India (cross-ref [[2026-05-14-job-platforms-catalog]])

| Platform | Shape | Best for |
|---|---|---|
| **Uplers** | C (EoR-style) | India-EXCLUSIVE — built for you |
| **Turing** | B or C | Indian-founded; bi-weekly USD; mix of contract + EoR full-time |
| **Arc.dev** | B or C | Both freelance hourly + remote full-time |
| **Toptal** | B | Premium freelance; hardest screening |
| **Andela** | C | Monthly salary engagements; ~4h timezone overlap expected |
| **Gun.io** | B | Top-1% freelance; hourly contracts |
| **Slashdev.io** | B | Smaller but quality remote network |
| **Wellfound** | A or C | Apply directly to startups; many sponsor EoR contracts |
| **Cutshort / Instahyre** | A | Indian product startups; some surface global remote |

## Payment infrastructure

For Shape B (contractor) or Shape C (EoR):

| Tool | Use | Cost |
|---|---|---|
| **Wise** | best USD→INR conversion; multi-currency account | 0.4-0.8% conversion fee |
| **Deel** | EoR + contractor invoicing; payouts in 100+ countries | 0% to you (client pays) |
| **Mercury** | US business banking (only if you set up US LLC) | varies |
| **HSBC InvestDirect / SBM India** | foreign-currency receiving account | varies |
| **Razorpay X / Cashfree** | for Indian sole-proprietors invoicing foreign clients | 1-2% |

**Contractor stack (Shape B):**
1. Register as sole proprietor (or set up Pvt Ltd if revenues >₹75L)
2. Apply for GST registration (mandatory >₹20L turnover from exports)
3. File LUT annually (zero-rate exports under GST)
4. Open USD-receiving bank account (HSBC, SBM, Niyo Global, or use Wise)
5. File ITR-4 (presumptive) under Sec 44ADA — 50% of revenue treated as profit
6. Mandatory: file Form 15CA + 15CB for FEMA compliance on inward foreign remittances above thresholds
7. Annual: get a CA to file forms; ~₹15-30k annual CA fee

## Tax planning for Shape B

- Section 44ADA (Presumptive Taxation for Professionals) — for service providers with gross receipts ≤ ₹75L (FY2025+)
- Declare 50% of gross as deemed profit; effective tax rate on $200k revenue is ~16-18%
- Above ₹75L: regular income tax with full expense accounting (rate jumps to 30-35%)
- Setting up a Pvt Ltd at higher revenue can save tax via 22% corporate rate (but adds compliance + DDT considerations)

**Verify all tax structures with a chartered accountant** — rules change yearly; this is a 2026 snapshot.

## Timezone strategies

Common patterns:

| Strategy | Hours of overlap | Trade-off |
|---|---|---|
| US PT, partial overlap | 9 PM - 1 AM IST | Late evenings ruined; mornings + afternoon free |
| US ET, partial overlap | 7 PM - 11 PM IST | Manageable; dinner-time meetings |
| EU CET, normal hours | 12:30 PM - 9:30 PM IST | Comfortable; aligns with afternoon IST |
| APAC (Singapore/Sydney) | 7 AM - 4 PM IST | Best lifestyle; rare for senior tech remote roles |
| Async-first (no overlap required) | 0 hours | Best but rare; only ~10% of remote roles |

**For senior SWE**, async-friendly companies typically: Cloudflare, GitLab, Automattic, 37signals, Linear, Sourcegraph, Mercury, some Stripe teams. Worth tagging in `companies/{slug}.md` with a `timezone_policy` note.

## Likely friction points

- **Conf travel**: most US/EU companies will fly you out 2-4x/year for offsites. Visa stamping (B-1 / business) repeatedly is doable but adds ~2-week lead time each.
- **Compensation comparison**: don't anchor to GCC offers when negotiating with HQ-hired remote. The offer should be 80-100% of US/EU on-shore comp (minus relocation premium), not Indian GCC band.
- **ESOPs**: Shape B / C usually means no real equity. Push for "phantom equity" or cash-bonus-tied-to-ESOP-value if equity matters.
- **Performance reviews**: remote employees often get worse review cycles than colocated peers (proximity bias). Choose async-first companies to mitigate.
- **Career growth**: promotion paths from remote can be slower at orgs that aren't truly remote-first. Filter heavily for this.

## What to do in next 30 days

1. Pick **5 tier-1 platforms** from [[2026-05-14-job-platforms-catalog]]: Uplers, Turing, Arc.dev, Wellfound, one of {Toptal, Gun.io}.
2. Set up profile on each with `master.resume.json` + 5-8 strongest XYZ achievements.
3. Set up financial stack for Shape B (open Wise account; consult a CA on 44ADA + LUT) — don't activate until needed.
4. Apply to 5-10 jobs/week via Wellfound + direct (skip mass-staffing platforms for now).
5. Track everything in `applications/` as you go.
