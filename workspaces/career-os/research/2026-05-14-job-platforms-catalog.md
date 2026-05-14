---
slug: 2026-05-14-job-platforms-catalog
title: "Job platforms catalog — 51 platforms tier-ranked"
type: note
status: durable
tags: [research, job-platforms, catalog, india, remote]
links: ["[[2026-05-14-remote-from-india-playbook]]"]
source: null
confidence: high
created: '2026-05-14'
updated: '2026-05-14'
---

# Job platforms catalog — 51 platforms tier-ranked

Catalog of 50 platforms from the user-supplied Google Doc ("50 platforms and agencies") plus **Slashdev.io** discovered in the user's Instagram `Interview Prep` collection.

**Tier ranking is calibrated to the user's primary track: remote-from-India for global companies, salary + lifestyle focus.** Re-rank for relocation-only tracks by demoting tier-1 remote networks and promoting executive/local agencies.

## Tier summary (quick scan)

### Tier 1 — register first (highest ROI for your profile)

| Platform | Bucket | Why tier-1 |
|---|---|---|
| **Uplers** | remote-talent | India-EXCLUSIVE talent network; built for placing top Indian engineers into remote roles at global companies — your exact use case |
| **Turing** | remote-talent | Indian-founded, India-friendly, bi-weekly USD payouts; mix of long-term SWE + AI training gigs |
| **Arc.dev** | remote-talent | Top 2% vetted; both freelance hourly + remote full-time; explicitly India-friendly |
| **Toptal** | remote-talent | Elite top-3% network; hard 5-stage screening but premium rates; 140+ countries |
| **Wellfound** (AngelList Talent) | tech-startup | Global startup marketplace; transparent salary/equity upfront; strong remote-US coverage |
| **Cutshort** | tech-startup | AI-matched; strong in India SaaS/product startups *(user-listed priority)* |
| **Instahyre** | tech-startup | Curated invite-style; companies reach out to matched candidates *(user-listed priority)* |
| **iimjobs** | tech-startup | Premium senior/management roles; best for eng-manager+ tracks *(user-listed priority)* |
| **Korn Ferry** | executive-search | Tier-1 global retained search; VP+/Director leadership *(user-listed priority for senior tracks)* |
| **Michael Page** | executive-search | Indian arm; covers mid-senior IC + director/exec roles; remote listings *(user-listed priority)* |
| **WalkWater Talent** | india-recruitment | Indian leadership search; retained model for senior/exec tech roles *(user-listed priority)* |

### Tier 2 — high-value defaults

Weekday, Hirist.tech, Andela, Gun.io, Slashdev.io, Global Hunt India, Robert Half, ABC Consultants, Xpheno, Longhouse Consulting, Saaki Argus

### Tier 3 — situational only

Foundit (mass-market India), Lemon.io (limited India), 2COMS, Quess Corp, Antal India, Spectrum Talent, Sapwood, Randstad, Allegis/Experis, the true C-suite firms (Heidrick, Spencer Stuart, Stanton Chase, Egon Zehnder, Transearch)

### Tier 4-5 — skip / dead / wrong category

- **Dead or absorbed**: Hired.com (now LHH), Ikya (merged into Quess 2015), AngelList Talent (rebranded as Wellfound)
- **Wrong category**: HackerEarth Recruit (recruiter-side, not job board), PeopleStrong (HR-SaaS, not a recruiter)
- **Wrong geography for you**: Revelo (LatAm-only, won't hire from India)
- **Wrong seniority**: Apna (entry/blue-collar)
- **Mass staffing — generic + low fit for senior remote**: TeamLease, Genius (HRTech), Innovsource, PersolKelly, Manpower, Adecco, Kelly Services, Gi Group

## Full catalog — YAML

Use this block as the data source for any future `career-platforms` table population (Phase 2+).

```yaml
- name: Uplers
  url: https://www.uplers.com
  bucket: remote-tech-talent
  type: india-talent-platform
  candidate_signup_url: https://platform.uplers.com/talent/joinus
  best_for: [senior-swe, india-based-ic]
  remote_friendly: high
  india_focus: india-only
  visa_sponsorship: not-applicable
  cost_to_candidate: free
  vetting_required: yes
  vetting_difficulty: medium
  payout_model: salary
  geo_restrictions: india-only
  user_priority_tier: 1
  summary: "India-exclusive talent network placing top Indian engineers into remote roles at global companies. Built for the exact use case."

- name: Turing
  url: https://www.turing.com
  bucket: remote-tech-talent
  type: remote-talent-network
  candidate_signup_url: https://www.turing.com/jobs
  best_for: [senior-swe, india-based-ic, ai-training]
  remote_friendly: high
  india_focus: global
  visa_sponsorship: not-applicable
  cost_to_candidate: free
  vetting_required: yes
  vetting_difficulty: medium
  payout_model: mixed
  geo_restrictions: global
  user_priority_tier: 1
  summary: "Indian-founded remote talent platform. Mix of long-term SWE contracts and AI training/eval gigs. Bi-weekly payouts."

- name: Arc.dev
  url: https://www.arc.dev
  bucket: remote-tech-talent
  type: remote-talent-network
  candidate_signup_url: https://arc.dev/signup?userType=developer
  best_for: [senior-swe, freelance-contract, remote-fulltime]
  remote_friendly: high
  india_focus: global
  visa_sponsorship: not-applicable
  cost_to_candidate: free
  vetting_required: yes
  vetting_difficulty: medium
  payout_model: mixed
  geo_restrictions: global
  user_priority_tier: 1
  summary: "Top 2% vetted remote developer network. Both freelance hourly and salaried full-time roles. India-friendly."

- name: Toptal
  url: https://www.toptal.com
  bucket: remote-tech-talent
  type: remote-talent-network
  candidate_signup_url: https://www.toptal.com/talent/apply
  best_for: [senior-swe, freelance-contract]
  remote_friendly: high
  india_focus: global
  visa_sponsorship: not-applicable
  cost_to_candidate: free
  vetting_required: yes
  vetting_difficulty: hard
  payout_model: mixed
  geo_restrictions: global
  user_priority_tier: 1
  summary: "Elite top-3% freelance network. Famously hard 5-stage screening; premium hourly rates across 140+ countries."

- name: Wellfound
  url: https://www.wellfound.com
  bucket: tech-startup
  type: job-board
  candidate_signup_url: https://wellfound.com/jobs/signup
  best_for: [mid-swe, senior-swe, contractor]
  remote_friendly: high
  india_focus: global
  visa_sponsorship: occasional
  cost_to_candidate: free
  user_priority_tier: 1
  summary: "Global startup-focused marketplace (formerly AngelList Talent). Transparent salary/equity upfront; strong remote and US startup coverage."

- name: Cutshort
  url: https://www.cutshort.io
  bucket: tech-startup
  type: job-board
  candidate_signup_url: https://cutshort.io/signup
  best_for: [mid-swe, senior-swe]
  remote_friendly: mixed
  india_focus: primary
  visa_sponsorship: rarely
  cost_to_candidate: free
  user_priority_tier: 1
  summary: "AI-matched tech job platform; companies pre-screen profiles then push roles. Strong in India SaaS/product startups."

- name: Instahyre
  url: https://www.instahyre.com
  bucket: tech-startup
  type: job-board
  candidate_signup_url: https://www.instahyre.com/candidates/register/
  best_for: [mid-swe, senior-swe]
  remote_friendly: mixed
  india_focus: primary
  visa_sponsorship: rarely
  cost_to_candidate: free
  user_priority_tier: 1
  summary: "Curated, invite-style tech job platform; companies reach out to matched candidates. Claims 5x response rate vs generic boards."

- name: iimjobs
  url: https://www.iimjobs.com
  bucket: tech-startup
  type: job-board
  candidate_signup_url: https://www.iimjobs.com/register
  best_for: [senior-swe, executive, engineering-manager]
  remote_friendly: mixed
  india_focus: primary
  visa_sponsorship: rarely
  cost_to_candidate: free
  user_priority_tier: 1
  summary: "Premium portal for senior/management roles (MBA-skewed). Best for engineering-manager+ tracks."

- name: Korn Ferry
  url: https://www.kornferry.com
  bucket: executive-search
  type: executive-search
  candidate_signup_url: https://www.kfadvance.com
  best_for: [senior-swe, executive]
  remote_friendly: mixed
  india_focus: global
  visa_sponsorship: occasional
  cost_to_candidate: free
  engagement_model: retained
  level_focus: vp-and-above
  user_priority_tier: 1
  summary: "Tier-1 global executive search and org consulting. Retained engagements for VP+ leadership; senior IC tech placements rare but possible."

- name: Michael Page
  url: https://www.michaelpage.co.in
  bucket: executive-search
  type: executive-search
  candidate_signup_url: https://www.michaelpage.co.in/en/job-seeker/submit-your-cv
  best_for: [senior-swe, director]
  remote_friendly: yes
  india_focus: india
  visa_sponsorship: occasional
  cost_to_candidate: free
  engagement_model: contingency
  level_focus: mixed
  user_priority_tier: 1
  summary: "Large recruitment firm with India tech desk; covers mid-to-senior IC, director and exec roles. Hybrid/remote listings available."

- name: WalkWater Talent Advisors
  url: https://www.walkwatertalent.com
  bucket: india-recruitment-agency
  type: executive-search
  candidate_signup_url: null
  best_for: [senior-swe, executive, leadership]
  remote_friendly: mixed
  india_focus: primary
  visa_sponsorship: rarely
  cost_to_candidate: free
  level_focus: senior-and-above
  specialization: cross-sector
  user_priority_tier: 1
  summary: "Indian leadership search firm; CEO/Board and senior leadership across tech, BFSI, pharma. Retained model; no public candidate signup."

- name: Slashdev.io
  url: https://slashdev.io
  bucket: remote-tech-talent
  type: remote-talent-network
  candidate_signup_url: https://slashdev.io/apply
  best_for: [senior-swe, freelance-contract]
  remote_friendly: high
  india_focus: global
  visa_sponsorship: not-applicable
  cost_to_candidate: free
  vetting_required: yes
  vetting_difficulty: medium
  payout_model: hourly
  geo_restrictions: global
  user_priority_tier: 2
  summary: "Vetted remote engineering talent network. Discovered via user's IG Interview-Prep saved reel. Worth a 30-min look."

- name: Weekday
  url: https://www.weekday.works
  bucket: tech-startup
  type: job-board
  candidate_signup_url: https://weekday.works/candidates
  best_for: [mid-swe, senior-swe]
  remote_friendly: high
  india_focus: primary
  visa_sponsorship: occasional
  cost_to_candidate: free
  user_priority_tier: 2
  summary: "India-based AI-driven recruiting with referral network; surfaces remote backend/frontend roles."

- name: Hirist.tech
  url: https://www.hirist.tech
  bucket: tech-startup
  type: job-board
  candidate_signup_url: https://www.hirist.tech/register
  best_for: [mid-swe, senior-swe]
  remote_friendly: mixed
  india_focus: primary
  visa_sponsorship: rarely
  cost_to_candidate: free
  user_priority_tier: 2
  summary: "India IT-specialized portal; large recruiter base across BLR/DEL/MUM. City-focused listings; limited remote surfacing."

- name: Andela
  url: https://www.andela.com
  bucket: remote-tech-talent
  type: remote-talent-network
  candidate_signup_url: https://talent.andela.com/signup
  best_for: [senior-swe, ai-engineer]
  remote_friendly: high
  india_focus: global
  visa_sponsorship: not-applicable
  cost_to_candidate: free
  vetting_required: yes
  vetting_difficulty: medium
  payout_model: salary
  geo_restrictions: global
  user_priority_tier: 2
  summary: "Originally Africa-focused, now global incl. India. Monthly salary engagements; AI-engineer pivot. ~4h timezone overlap expected."

- name: Gun.io
  url: https://www.gun.io
  bucket: remote-tech-talent
  type: remote-talent-network
  candidate_signup_url: https://app.gun.io/sign-up/?accountType=DEVELOPER
  best_for: [senior-swe, freelance-contract]
  remote_friendly: high
  india_focus: global
  visa_sponsorship: not-applicable
  cost_to_candidate: free
  vetting_required: yes
  vetting_difficulty: hard
  payout_model: hourly
  geo_restrictions: global
  user_priority_tier: 2
  summary: "Top-1% elite engineering freelance marketplace, 100+ country payroll. Hourly contracts; technical-bar-heavy screening."

- name: Global Hunt India
  url: https://www.globalhunt.in
  bucket: executive-search
  type: executive-search
  candidate_signup_url: https://www.globalhunt.in/post-resume.php
  best_for: [senior-swe, director]
  remote_friendly: mixed
  india_focus: india
  visa_sponsorship: occasional
  cost_to_candidate: free
  engagement_model: mixed
  level_focus: mixed
  user_priority_tier: 2
  summary: "India-based search firm with VP/Director tech listings. Covers IT staffing, RPO and executive search."

- name: Robert Half
  url: https://www.roberthalf.in
  bucket: executive-search
  type: recruitment-agency
  candidate_signup_url: https://www.roberthalf.com/us/en/find-jobs
  best_for: [senior-swe, mid]
  remote_friendly: yes
  india_focus: india
  visa_sponsorship: occasional
  cost_to_candidate: free
  engagement_model: contingency
  level_focus: ic-senior
  user_priority_tier: 2
  summary: "Global high-volume tech staffing firm; permanent and contract senior software engineer placements."

- name: ABC Consultants
  url: https://www.abcconsultants.in
  bucket: india-recruitment-agency
  type: recruitment-agency
  candidate_signup_url: https://www.abcconsultants.in/submit-cv/
  best_for: [senior-swe, staff-eng]
  remote_friendly: unknown
  india_focus: primary
  visa_sponsorship: rarely
  cost_to_candidate: free
  level_focus: ic-senior
  specialization: cross-sector
  user_priority_tier: 2
  summary: "50-year executive search firm; 24 practice areas including Technology. Senior/leadership tech roles, mostly India-based."

- name: Xpheno
  url: https://www.xpheno.com
  bucket: india-recruitment-agency
  type: recruitment-agency
  candidate_signup_url: https://www.xpheno.com/JobBoard/Jobs/Careerpage/registerProfile
  best_for: [mid-swe, senior-swe, staff-eng]
  remote_friendly: mixed
  india_focus: primary
  visa_sponsorship: rarely
  cost_to_candidate: free
  level_focus: mixed
  specialization: itstaffing
  user_priority_tier: 2
  summary: "Specialist IT/engineering staffing firm with executive search arm. Most tech-aligned of the Indian agencies."

- name: Longhouse Consulting
  url: https://www.longhouseconsulting.com
  bucket: india-recruitment-agency
  type: executive-search
  candidate_signup_url: unknown
  best_for: [senior-swe, executive]
  remote_friendly: mixed
  india_focus: primary
  visa_sponsorship: rarely
  cost_to_candidate: free
  level_focus: senior-and-above
  specialization: tech-focused
  user_priority_tier: 2
  summary: "Tech-focused Indian executive search boutique; senior leadership and niche tech roles."

- name: Saaki Argus and Averil Consulting
  url: https://www.saaconsulting.co.in
  bucket: india-recruitment-agency
  type: executive-search
  candidate_signup_url: unknown
  best_for: [senior-swe, executive, leadership]
  remote_friendly: mixed
  india_focus: primary
  visa_sponsorship: rarely
  cost_to_candidate: free
  level_focus: senior-and-above
  specialization: cross-sector
  user_priority_tier: 2
  summary: "Chennai-based executive search firm; CEO and senior management placements across sectors. Retained model."

- name: Foundit
  url: https://www.foundit.in
  bucket: tech-startup
  type: mass-staffing
  candidate_signup_url: https://www.foundit.in/seeker/registration
  best_for: [mid-swe, entry]
  remote_friendly: mixed
  india_focus: primary
  visa_sponsorship: rarely
  cost_to_candidate: freemium
  user_priority_tier: 3
  summary: "Mass-market Indian job board (formerly Monster); IT services and staffing heavy. Less curated for senior product roles."

- name: Lemon.io
  url: https://lemon.io
  bucket: remote-tech-talent
  type: remote-talent-network
  candidate_signup_url: https://lemon.io/for-developers/
  best_for: [senior-swe, freelance-contract]
  remote_friendly: high
  india_focus: limited
  visa_sponsorship: not-applicable
  cost_to_candidate: free
  vetting_required: yes
  vetting_difficulty: hard
  payout_model: hourly
  geo_restrictions: europe-latam-us-canada
  user_priority_tier: 3
  summary: "Vetted (~1.2% pass) freelance network. Focus is Europe/LatAm/Americas — India is not in its stated talent regions."

- name: Heidrick and Struggles
  url: https://www.heidrick.com
  bucket: executive-search
  type: executive-search
  candidate_signup_url: https://leaders.heidrick.com/register
  best_for: [executive]
  remote_friendly: mixed
  india_focus: global
  visa_sponsorship: occasional
  cost_to_candidate: free
  engagement_model: retained
  level_focus: vp-and-above
  user_priority_tier: 3
  summary: "Top retained executive search firm. C-suite, board, CTO/CIO focus. Unlikely match for senior IC engineers."

- name: Spencer Stuart
  url: https://www.spencerstuart.com
  bucket: executive-search
  type: executive-search
  candidate_signup_url: https://candidateregistration.spencerstuart.com
  best_for: [executive]
  remote_friendly: mixed
  india_focus: global
  visa_sponsorship: occasional
  cost_to_candidate: free
  engagement_model: retained
  level_focus: vp-and-above
  user_priority_tier: 3
  summary: "Premium retained search firm for board, CEO and C-suite roles. Not aimed at senior IC software engineers."

- name: Stanton Chase
  url: https://www.stantonchase.com
  bucket: executive-search
  type: executive-search
  candidate_signup_url: null
  best_for: [executive]
  remote_friendly: mixed
  india_focus: global
  visa_sponsorship: occasional
  cost_to_candidate: free
  engagement_model: retained
  level_focus: vp-and-above
  user_priority_tier: 3
  summary: "Global retained executive search across 45 countries. CEO and board-level focus; minimal fit for senior IC."

- name: Egon Zehnder
  url: https://www.egonzehnder.com
  bucket: executive-search
  type: executive-search
  candidate_signup_url: null
  best_for: [executive]
  remote_friendly: mixed
  india_focus: global
  visa_sponsorship: occasional
  cost_to_candidate: free
  engagement_model: retained
  level_focus: vp-and-above
  user_priority_tier: 3
  summary: "Top-tier retained search for boards, CEOs, CTOs. Candidates are headhunted; no standard IC application path."

- name: Transearch India
  url: https://www.transearch.com
  bucket: executive-search
  type: executive-search
  candidate_signup_url: https://transearch.com/contact/submit-resume
  best_for: [executive, director]
  remote_friendly: mixed
  india_focus: global
  visa_sponsorship: occasional
  cost_to_candidate: free
  engagement_model: retained
  level_focus: vp-and-above
  user_priority_tier: 3
  summary: "AESC-member global retained executive search firm. Leadership and board focus."

- name: 2COMS Consulting
  url: https://www.2coms.com
  bucket: executive-search
  type: recruitment-agency
  candidate_signup_url: https://www.2coms.com/job-seekers
  best_for: [mid, senior-swe]
  remote_friendly: mixed
  india_focus: india
  visa_sponsorship: occasional
  cost_to_candidate: free
  engagement_model: contingency
  level_focus: mixed
  user_priority_tier: 3
  summary: "Indian mass-staffing and IT contracting firm. Mostly mid-level and high-volume hiring."

- name: Quess Corp
  url: https://www.quesscorp.com
  bucket: india-recruitment-agency
  type: recruitment-agency
  candidate_signup_url: https://www.quesscorp.com/careers/
  best_for: [mid-swe, senior-swe]
  remote_friendly: mixed
  india_focus: primary
  visa_sponsorship: rarely
  cost_to_candidate: free
  level_focus: mixed
  specialization: itstaffing
  user_priority_tier: 3
  summary: "India's largest staffing co; 480K+ associates, strong IT staffing arm (Hamara Jobs). Volume-driven."

- name: Antal International India
  url: https://www.antal.com/recruitment/antal-india
  bucket: india-recruitment-agency
  type: recruitment-agency
  candidate_signup_url: https://www.antal.com/login
  best_for: [senior-swe, staff-eng]
  remote_friendly: unknown
  india_focus: primary
  visa_sponsorship: rarely
  cost_to_candidate: free
  level_focus: ic-senior
  specialization: cross-sector
  user_priority_tier: 3
  summary: "Global recruitment network with India arm in Mumbai; mid-senior permanent placements. Finance-leaning."

- name: Spectrum Talent Management
  url: https://www.stmpl.co.in
  bucket: india-recruitment-agency
  type: recruitment-agency
  candidate_signup_url: https://www.stmpl.co.in/careers/
  best_for: [mid-swe, senior-swe]
  remote_friendly: unknown
  india_focus: primary
  visa_sponsorship: rarely
  cost_to_candidate: free
  level_focus: mixed
  specialization: cross-sector
  user_priority_tier: 3
  summary: "17-yr manpower firm with India/UK/USA offices; offers IT staff augmentation and CXO hire."

- name: Sapwood Ventures
  url: https://www.sapwoodventures.com
  bucket: india-recruitment-agency
  type: recruitment-agency
  candidate_signup_url: unknown
  best_for: [mid, senior-swe]
  remote_friendly: mixed
  india_focus: primary
  visa_sponsorship: rarely
  cost_to_candidate: free
  level_focus: mid
  specialization: tech-focused
  user_priority_tier: 3
  summary: "Bangalore-based tech recruitment boutique; mid-to-senior IT roles for product startups and GCCs."

- name: Randstad
  url: https://www.randstad.in
  bucket: global-staffing-giant
  type: mass-staffing
  candidate_signup_url: https://www.randstad.in/job-seeker/
  best_for: [entry, mid, contract]
  remote_friendly: mixed
  india_focus: global
  visa_sponsorship: rarely
  cost_to_candidate: free
  level_focus: mixed
  specialization: cross-sector
  user_priority_tier: 3
  summary: "Dutch staffing giant with strong India presence; Randstad Digital handles tech. Mid-range IT roles."

- name: Allegis Group (Experis India)
  url: https://www.allegisgroup.com
  bucket: global-staffing-giant
  type: mass-staffing
  candidate_signup_url: https://www.experis.in/jobs
  best_for: [mid, senior-swe, contract]
  remote_friendly: mixed
  india_focus: global
  visa_sponsorship: rarely
  cost_to_candidate: free
  level_focus: mid
  specialization: itstaffing
  user_priority_tier: 3
  summary: "Allegis parents Aerotek/TEKsystems. Experis (Manpower brand) is the India IT-staffing counterpart; contract-heavy."

- name: HackerEarth Recruit
  url: https://www.hackerearth.com/recruit
  bucket: tech-startup
  type: recruitment-agency
  candidate_signup_url: https://www.hackerearth.com/users/signup/
  best_for: [mid-swe]
  remote_friendly: unknown
  india_focus: global
  visa_sponsorship: unknown
  cost_to_candidate: free
  user_priority_tier: 4
  summary: "Recruiter-side hiring/assessment platform; candidates participate via hackathons and FaceCode interviews, not a direct job board."

- name: Apna
  url: https://www.apna.co
  bucket: tech-startup
  type: mass-staffing
  candidate_signup_url: https://apna.co/login
  best_for: [entry]
  remote_friendly: mixed
  india_focus: primary
  visa_sponsorship: no
  cost_to_candidate: free
  user_priority_tier: 4
  summary: "India broad-market job app skewing blue-collar and entry white-collar. Mostly irrelevant for ~10yr SWE."

- name: Hired.com
  url: https://www.hired.com
  bucket: remote-tech-talent
  type: job-marketplace
  candidate_signup_url: unknown
  best_for: [senior-swe]
  remote_friendly: high
  india_focus: us-centric
  visa_sponsorship: unknown
  cost_to_candidate: free
  vetting_required: yes
  vetting_difficulty: medium
  payout_model: salary
  geo_restrictions: us-uk-canada-mostly
  user_priority_tier: 4
  status: defunct
  summary: "DEFUNCT as standalone platform; domain now redirects to LHH/Lee Hecht Harrison staffing. Skip."

- name: Revelo
  url: https://www.revelo.com
  bucket: remote-tech-talent
  type: remote-talent-network
  candidate_signup_url: unknown
  best_for: [senior-swe]
  remote_friendly: high
  india_focus: latam-only
  visa_sponsorship: not-applicable
  cost_to_candidate: free
  vetting_required: yes
  vetting_difficulty: hard
  payout_model: salary
  geo_restrictions: latam-only
  user_priority_tier: 4
  summary: "LatAm-exclusive nearshore network. Does NOT hire from India — skip."

- name: TeamLease Services
  url: https://www.teamlease.com
  bucket: india-recruitment-agency
  type: recruitment-agency
  candidate_signup_url: https://www.teamlease.com
  best_for: [entry-roles, mid-swe]
  remote_friendly: mixed
  india_focus: primary
  visa_sponsorship: rarely
  cost_to_candidate: free
  level_focus: entry
  specialization: bpo-heavy
  user_priority_tier: 4
  summary: "India's largest staffing firm — entry-level, blue-collar, BPO. Not suited for senior tech IC."

- name: Genius HRTech (Genius Consultants)
  url: https://www.geniushrtech.com
  bucket: india-recruitment-agency
  type: recruitment-agency
  candidate_signup_url: https://www.geniushrtech.com/Careers/GeniusJobsQRForm.aspx
  best_for: [mid-swe]
  remote_friendly: unknown
  india_focus: primary
  visa_sponsorship: rarely
  cost_to_candidate: free
  level_focus: mixed
  specialization: cross-sector
  user_priority_tier: 4
  summary: "Permanent/flexi staffing, payroll, BGV, compliance, IT staffing/MSP. Weak signal for senior tech IC."

- name: Innovsource Services
  url: https://www.innovsource.com
  bucket: india-recruitment-agency
  type: mass-staffing
  candidate_signup_url: unknown
  best_for: [entry, mid, bpo]
  remote_friendly: rarely
  india_focus: primary
  visa_sponsorship: rarely
  cost_to_candidate: free
  level_focus: entry
  specialization: bpo-heavy
  user_priority_tier: 4
  summary: "Large Indian flexi-staffing firm; high-volume blue/grey-collar and BPO contract roles."

- name: PersolKelly India
  url: https://www.persolkelly.co.in
  bucket: india-recruitment-agency
  type: mass-staffing
  candidate_signup_url: https://jobs.persolindia.com/
  best_for: [entry, mid]
  remote_friendly: mixed
  india_focus: primary
  visa_sponsorship: rarely
  cost_to_candidate: free
  level_focus: mixed
  specialization: cross-sector
  user_priority_tier: 4
  summary: "APAC staffing JV (now Persol India); contract and permanent placements. High-volume."

- name: ManpowerGroup
  url: https://www.manpowergroup.com
  bucket: global-staffing-giant
  type: mass-staffing
  candidate_signup_url: https://www.manpower.com/wps/portal/manpowerUSA/jobseeker
  best_for: [entry, mid, contract]
  remote_friendly: mixed
  india_focus: global
  visa_sponsorship: rarely
  cost_to_candidate: free
  level_focus: mixed
  specialization: cross-sector
  user_priority_tier: 4
  summary: "Global mass-staffing giant; high-volume contract/temp. Parent of Experis (IT). Limited fit for senior remote IC."

- name: Adecco
  url: https://www.adecco.com
  bucket: global-staffing-giant
  type: mass-staffing
  candidate_signup_url: https://www.adecco.com/job-seekers
  best_for: [entry, mid, contract]
  remote_friendly: mixed
  india_focus: global
  visa_sponsorship: rarely
  cost_to_candidate: free
  level_focus: mixed
  specialization: cross-sector
  user_priority_tier: 4
  summary: "Swiss-based global staffing leader; bulk contract/temp hiring. Senior-IC remote-from-India is not their sweet spot."

- name: Kelly Services India
  url: https://www.kellyservices.in
  bucket: global-staffing-giant
  type: mass-staffing
  candidate_signup_url: https://www.kellyservices.in/in/careers/find-a-job/
  best_for: [entry, mid, contract]
  remote_friendly: mixed
  india_focus: global
  visa_sponsorship: rarely
  cost_to_candidate: free
  level_focus: mixed
  specialization: cross-sector
  user_priority_tier: 4
  summary: "US-origin staffing firm; contract/permanent placements in India."

- name: Ikya Human Capital
  url: https://www.quesscorp.com
  bucket: india-recruitment-agency
  type: recruitment-agency
  status: defunct
  best_for: [mid-swe, senior-swe]
  remote_friendly: mixed
  india_focus: primary
  visa_sponsorship: rarely
  cost_to_candidate: free
  level_focus: mixed
  specialization: itstaffing
  user_priority_tier: 4
  summary: "DEFUNCT — Ikya rebranded to Quess Corp in 2015 after Thomas Cook acquisition. Use Quess entry instead."

- name: PeopleStrong
  url: https://www.peoplestrong.com
  bucket: india-recruitment-agency
  type: hr-tech-saas
  candidate_signup_url: none
  best_for: []
  remote_friendly: unknown
  india_focus: primary
  visa_sponsorship: no
  cost_to_candidate: free
  level_focus: mixed
  specialization: hr-saas
  user_priority_tier: 5
  summary: "WRONG CATEGORY — HR-tech SaaS, not a recruitment agency. Sells HCM/payroll/ATS to enterprises; doesn't place candidates."

- name: Gi Group
  url: https://www.gigroup.in
  bucket: global-staffing-giant
  type: mass-staffing
  candidate_signup_url: https://www.gigroup.in/job-seekers/
  best_for: [entry, mid, contract]
  remote_friendly: rarely
  india_focus: global
  visa_sponsorship: rarely
  cost_to_candidate: free
  level_focus: entry
  specialization: bpo-heavy
  user_priority_tier: 5
  summary: "Italian-origin global staffing; strong in blue-collar, BPO, light-industrial. Weakest fit for senior remote tech."
```

## How to use this catalog

**Phase A — registration (week 1):**
Pick the 11 tier-1 platforms above. Register on all of them. Time investment: ~30-60 min per platform for full profile setup.

**Phase B — surface tier-2 (week 2-4):**
Register on Slashdev.io + Andela + Gun.io for the additional remote-talent surfaces.
Submit CV to ABC Consultants, Xpheno, WalkWater for senior placement leads.

**Phase C — let it run (week 4+):**
Tier-1 platforms generate inbound. Track every recruiter touch in `contacts/`. Track every role they surface as `applications/` entries in `wishlist` status until you decide to apply.

## Re-rank notes

If you change priority to **relocation-first**, demote: Uplers (India-only), Turing (some roles US-onsite only). Promote: Korn Ferry, Michael Page (visa sponsorship), Wellfound (relocation-friendly startups), Toptal (still useful for transitional contract income).

If you change to **executive-track-only**, promote: Korn Ferry, WalkWater, Michael Page, Heidrick, Spencer Stuart. Demote: tech-startup boards.
