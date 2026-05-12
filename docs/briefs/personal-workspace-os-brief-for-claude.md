# Personal Workspace OS: Brief For Claude Review

Date: 2026-05-12

Root workspace directory:

```text
R:\Development\Workspace
```

Codex/WSL path:

```text
/mnt/r/Development/Workspace
```

## Purpose Of This Document

This document summarizes the user's desired local-first personal workspace system, the caveats discussed so far, and the tentative solution chosen with Codex. It is intended to be ingested by Claude for a second-opinion architecture review, especially around Claude Code, Claude skills, plugins, MCPs, subagents, hooks, and long-running agent workflows.

## Core Problem Statement

The user wants a durable, local, platform-independent state layer for ongoing personal projects and knowledge work.

The key pain point is that useful project context is currently scattered across multiple AI/chat platforms such as ChatGPT, Codex, Claude, Gemini, and future tools. The user does not want any one chat platform's conversation history to become the source of truth.

Desired model:

```text
Local workspace files + local database = source of truth
AI chat tools = interchangeable workbenches/operators
Agents/MCP/plugins = controlled interfaces into the source of truth
```

The user wants to keep iterating on long-lived, purpose-driven workspaces, with the option to later build a mobile/web app, connect MCP tools, run automations, and use different AI agents depending on the task.

## User Goals

The user wants multiple broad workspaces under:

```text
R:\Development\Workspace
```

Initial workspace categories:

1. Career/job application workspace
   - Resume/CV builder.
   - Job finder.
   - Application tracker.
   - Job hunting automation.
   - Alerts, daily digest, recruiter/company tracking.
   - Interview prep and role targeting.

2. Personal fitness/body workspace
   - Fitness tracker.
   - Dietary planning.
   - Calories/macros/progress tracker.
   - Exercise and diet suggestion system.
   - Possible future integration with wearable/health/exported data.

3. AI/upskilling workspace
   - AI-related topic exploration.
   - Software engineering and architecture upskilling.
   - Course tracking and de-duplication.
   - Next-role preparation.
   - Portfolio/project ideas.
   - Learning roadmaps and role-readiness gap analysis.

4. Second brain workspace
   - Dumping links, reels, articles, topics, ideas, notes, and references.
   - Connecting topics over time.
   - Generating insights and answering questions from personal context.
   - Evolving into a local knowledge graph/wiki/RAG system.

5. Business ideas workspace
   - Exploratory business ideas.
   - Validation workflows.
   - Market/trends research.
   - Experiments and decision logs.

6. Future additional vaults/workspaces
   - The structure should support adding more broad-topic workspaces later without redesigning everything.

## Desired Higher-Level Agent Pattern

The user asked whether there should be a main triage agent on top of all workspaces.

Tentative decision:

Yes, create a lightweight "Control Tower" or "Triage Agent" concept early, but keep it simple.

Its purpose:

- Route captures and requests to the correct workspace.
- Maintain cross-workspace indexes.
- Run weekly/monthly reviews.
- Detect duplicates, stale items, and unresolved tasks.
- Provide high-level answers when the user does not specify a workspace.
- Hand off specific work to the relevant workspace/agent.

It should not become one giant monolithic knowledge base. The individual workspaces remain the owners of their domain-specific context.

## Tentative Folder Layout

Recommended top-level layout:

```text
R:\Development\Workspace\
  00-Control-Tower\
  10-Career-OS\
  20-Body-OS\
  30-AI-Upskilling-Lab\
  40-Second-Brain\
  50-Business-Ideation\
  90-Archive\
  _shared\
```

Recommended repeated skeleton inside each workspace:

```text
<Workspace>\
  START_HERE.md
  STATE.md
  AGENTS.md
  CLAUDE.md
  README.md
  inbox\
  sources\
  notes\
  decisions\
  tasks\
  outputs\
  data\
  scripts\
  dashboards\
```

Important file roles:

- `START_HERE.md`: human overview and operating instructions.
- `STATE.md`: compact state that can be pasted into any AI tool to resume context.
- `AGENTS.md`: Codex-style agent/workspace guidance.
- `CLAUDE.md`: Claude Code-style project guidance.
- `README.md`: stable purpose, boundaries, and structure.
- `inbox/`: unprocessed captures.
- `sources/`: raw imported links, transcripts, documents, exports.
- `notes/`: cleaned durable notes.
- `decisions/`: decision logs.
- `tasks/`: actionable task lists.
- `outputs/`: generated artifacts.
- `data/`: local structured data exports, CSVs, schemas, etc.
- `scripts/`: automation scripts.
- `dashboards/`: local app views, reports, or generated summaries.

## Local Database Decision

Earlier options considered:

- SQLite
- Supabase
- Local Postgres

Decision for now:

Use local Postgres, not Supabase yet.

Reasoning:

- The user is already familiar with Postgres.
- Local Postgres keeps the schema and mental model close to future Supabase migration.
- Postgres is better for multi-client/multi-agent access than SQLite.
- Postgres has a good path toward vector search through `pgvector`.
- It is better for structured trackers, jobs, logs, tasks, source metadata, embeddings, and automation state.

SQLite caveat:

- SQLite is attractive for simple offline/mobile/local apps because it is one file and requires no server.
- It may still be useful inside an Android app later for offline-first local cache.
- But as the central personal workspace backend, Postgres is preferred because the user expects scripts, agents, dashboards, and possibly multiple tools to connect concurrently.

Supabase decision:

- Do not move core data to Supabase yet.
- Keep Supabase as a future sync/cloud/app backend.
- Design local Postgres schema in a way that can later be migrated to Supabase.
- Avoid using Supabase as the only source of truth until the local workspace conventions are stable.

Recommended local data pattern:

```text
Markdown/Git = durable knowledge, state, prompts, summaries, versions
Local Postgres = structured operational data and indexes
Future Supabase = cloud sync/app backend when needed
MCP/agents = controlled operators over files and database
```

## Suggested Postgres Usage

Postgres should store structured and queryable data such as:

- Workspace registry.
- Captured items.
- Sources and links.
- Tags.
- Tasks.
- Decisions.
- Application/job logs.
- Fitness logs.
- Course catalog.
- Business validation experiments.
- Cross-workspace indexes.
- Embedding chunks later.
- Sync events.
- Agent run logs.

Markdown files should store:

- Human-readable state.
- Narrative reasoning.
- Resume drafts.
- Learning notes.
- Decision explanations.
- Prompts.
- Weekly/monthly reviews.
- Project summaries.

Avoid storing large raw blobs in Postgres at first. Store large PDFs, videos, images, exports, and raw captures as files, then put metadata and summaries in Postgres.

## Suggested Initial Database Tables

Possible starting tables:

```text
workspaces
items
sources
notes
tasks
decisions
tags
item_tags
agent_runs
sync_events

career_applications
career_companies
career_contacts
career_resume_versions

fitness_logs
fitness_measurements
fitness_meals
fitness_workouts

learning_courses
learning_resources
learning_topics

business_ideas
business_experiments
business_market_signals

embedding_chunks
```

This is only a candidate schema. It should be reviewed before implementation.

## Agent And Automation Vision

Desired eventual agent capabilities:

- Triage uncategorized inbox items.
- Summarize imported links and classify them.
- Extract durable notes from chat sessions.
- Update `STATE.md` files.
- Maintain task lists.
- Detect duplicates.
- Generate weekly review reports.
- Generate career/job daily digests.
- Track course progress and recommend next learning steps.
- Query second brain content.
- Run business validation research workflows.
- Maintain local database indexes.
- Generate app/mobile views.

Recommended phased approach:

```text
Phase 1: Folder and Markdown conventions.
Phase 2: Local Postgres schema and migration setup.
Phase 3: Simple scripts for capture, triage, and querying.
Phase 4: Codex/Claude skills for repeatable workflows.
Phase 5: MCP connectors for files, database, email, calendar, browser, Google Drive, etc.
Phase 6: Mobile/web app.
Phase 7: Supabase sync or migration if needed.
```

## Codex Decision So Far

Tentative Codex-centered recommendation:

Use the Codex app as the main local workspace operator for now.

Reasons:

- It can directly create/edit files under `R:\Development\Workspace`.
- It can run shell commands, scaffold repos, create scripts, and manage local project structure.
- It can spawn sub-agents for parallel work.
- It supports skills and plugins.
- It can eventually run recurring automations.
- It is suitable for building the local app, database tooling, workspace scaffolding, and code-heavy workflows.

Claude should still be used as a second-opinion and possibly as a specialist for:

- Claude Code workflows.
- `CLAUDE.md` memory conventions.
- Hooks.
- Subagents.
- Skills.
- MCP-heavy workflows.
- Prompt/process design.
- Deep review of architecture.

The user specifically wants Claude to critique whether Claude Code has a stronger ecosystem for this personal workspace OS, especially around skills/plugins/MCP/subagents/hooks.

## Custom Skills Proposed For Codex

Potential custom Codex skills:

```text
workspace-triage
career-os-maintainer
fitness-os-reviewer
second-brain-ingestor
ai-upskilling-curator
business-idea-validator
postgres-workspace-dba
weekly-review-operator
chat-session-distiller
source-ingestion-normalizer
```

Purpose of skills:

- Encode repeatable processes.
- Keep workflows consistent.
- Reduce the need to re-explain personal conventions.
- Let agents update files and database in the same expected format.

Potential plugins/MCPs later:

- Filesystem MCP.
- Postgres MCP.
- Browser/search MCP.
- Gmail MCP.
- Calendar MCP.
- Google Drive MCP.
- GitHub MCP.
- Fitness/health export connectors.
- Supabase MCP later.
- Read-it-later/bookmark connector.

## Important Caveats

1. Do not make any AI chat platform the source of truth.
   - Durable state must live in local files and database.

2. Do not overbuild agents before the schema and folder conventions stabilize.
   - Start with boring files and simple scripts.

3. Do not put secrets in Markdown.
   - Use environment files, secret managers, or local ignored config.

4. Be careful with MCP permissions.
   - Give each workspace only the tools it needs.
   - Fitness workspace should not need email access.
   - Career workspace may later need email/calendar/job-board access.

5. Treat health and fitness recommendations carefully.
   - Track and suggest, but avoid blindly automating medical or diet decisions.

6. Separate raw capture from curated knowledge.
   - `inbox/` and `sources/` can be messy.
   - `notes/`, `STATE.md`, and decision logs should remain curated.

7. Keep large files out of Postgres.
   - Store file paths, metadata, summaries, and embeddings instead.

8. Keep future portability in mind.
   - Markdown + Git + Postgres gives portability across Codex, Claude, Gemini, local apps, and future tools.

9. Avoid one giant RAG dump early.
   - Use curated Markdown/wiki structure first.
   - Add vector search after enough content exists to justify it.

10. Keep workspace boundaries clear.
   - The Control Tower routes and indexes.
   - It should not absorb all project-specific context.

## Open Questions For Claude

Please review and suggest improvements to this plan.

Specific questions:

1. Would you recommend Claude Code as the primary operator instead of Codex for this local-first personal workspace OS?

2. What Claude Code ecosystem features would be especially useful here?
   - `CLAUDE.md`
   - Skills
   - Subagents
   - Hooks
   - MCP integrations
   - Plugins
   - Long-running workflows
   - Memory conventions

3. What would you change in the folder structure?

4. What would you change in the local Postgres design?

5. Should each workspace be its own Git repo, or should `R:\Development\Workspace` be one monorepo?

6. Should each workspace have its own Postgres schema, or should the whole system share one schema with `workspace_id` columns?

7. How would you design the main triage agent?

8. What should be built first?

9. Which parts should stay simple Markdown files rather than database tables?

10. Which parts should be MCP tools versus local scripts versus agent skills?

11. How would you structure mobile/Android access later?

12. How should Claude and Codex coexist without corrupting each other's assumptions or duplicating state?

13. What would be the ideal `CLAUDE.md` template for each workspace?

14. What custom Claude skills/subagents would you create for:
    - Career/job applications
    - Fitness/diet tracking
    - AI upskilling
    - Second brain ingestion
    - Business idea validation
    - Control Tower triage

15. What are the risks of using Postgres locally versus SQLite for this use case?

16. Given that the user currently has an Anthropic API key but not a paid Claude.ai membership, what is the best Claude usage pattern for:
    - broad architecture thinking
    - comfortable chat UX
    - implementation inside the local workspace
    - Claude Code skills/subagents/hooks/MCP usage
    - cost control

17. Should the user primarily use:
    - Claude Code CLI
    - official Claude Code VS Code extension
    - another Claude chat VS Code extension
    - direct Anthropic API scripts
    - some combination of the above

18. What limitations should the user expect from not having access to the Claude desktop/web app through a paid Claude.ai membership?

## Desired Output From Claude

Claude should ideally return:

1. A critique of this architecture.
2. A recommended revised architecture if needed.
3. A Claude Code-specific implementation plan.
4. Recommended Claude skills/subagents/hooks/MCPs.
5. A suggested `CLAUDE.md` template.
6. A suggested initial Postgres schema.
7. A phased implementation roadmap.
8. Any warnings about complexity, privacy, security, or maintenance.

## Current Claude Access Constraint

The user currently has Claude configured with an Anthropic API key only.

Available or considered surfaces:

- Claude Code CLI.
- Official Claude Code VS Code extension.
- Claude chat VS Code extension.
- Direct Anthropic API usage.

Unavailable or not preferred right now:

- Claude desktop/web app requiring paid Claude.ai membership.

Tentative recommendation before Claude review:

- Use the official Claude Code VS Code extension for best local UX when it works with the user's API-key setup.
- Use Claude Code CLI inside the VS Code integrated terminal for maximum feature coverage and implementation control.
- Use third-party Claude chat extensions only for low-risk brainstorming or quick chat, not for trusted filesystem/database operations.
- Use direct API scripts later for custom automation, batch processing, or controlled agent workflows.
- Keep Codex as the primary workspace operator unless Claude Code proves substantially better for this system.

## Current Intended Next Step With Codex

After Claude review, Codex can proceed to scaffold:

```text
R:\Development\Workspace\
  00-Control-Tower\
  10-Career-OS\
  20-Body-OS\
  30-AI-Upskilling-Lab\
  40-Second-Brain\
  50-Business-Ideation\
  90-Archive\
  _shared\
```

And add:

- Initial Markdown templates.
- `AGENTS.md` files.
- `CLAUDE.md` placeholders.
- Local Postgres Docker/setup files.
- Initial SQL migrations.
- Basic scripts for capture/triage/query.

This should wait until Claude's feedback is considered.
