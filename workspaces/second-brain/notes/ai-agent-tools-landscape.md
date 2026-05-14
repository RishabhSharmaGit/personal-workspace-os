---
slug: ai-agent-tools-landscape
title: AI Agent Tools & Orchestration Landscape (2026-05)
type: note
status: draft
tags: [ai-tools, agents, orchestration, landscape]
links: ["[[ruflo-overview]]", "[[ruflo-vs-alternatives]]"]
source: null
confidence: medium
created: '2026-05-14'
updated: '2026-05-14'
---

A snapshot of notable AI agent tools and orchestration products as of May 2026, spanning autonomous research loops, code agents, browser automation, voice AI, and specialized agent collections.

### autoresearch

**URL:** https://github.com/karpathy/autoresearch

Andrej Karpathy's open-source autonomous ML research loop: an AI agent is given a small LLM training setup, runs 5-minute training cycles, measures whether a change improved results, keeps or discards it, and repeats overnight — effectively running ~100 experiments unattended. The framework uses three files with strict ownership rules (`prepare.py` is immutable, `train.py` is the agent's sandbox, `program.md` is the human's goal spec). Accrued 66,000+ GitHub stars by early 2026.

### Ruflo

See [[ruflo-overview]] for full coverage.

### MiroFish

**URL:** https://github.com/666ghj/MiroFish

An open-source multi-agent swarm intelligence engine for predictive simulation. Rather than extrapolating numbers, MiroFish builds a miniature digital replica of a social system and runs it forward at accelerated speed — users pose "what-if" questions (a product launch, a pricing change, a policy rollout) and receive a structured report with stakeholder reactions, key metrics, risk warnings, and a confidence score. Backed by the OASIS simulation engine (from the CAMEL-AI team), which can scale to one million agents and supports 23 social interaction types. Released December 2025; raised $4M within 24 hours of launch.

### AI co-founder (aicofounder.com)

**URL:** https://aicofounder.com

A product-building assistant (formerly Buildpad, rebranded to aicofounder.com) that acts as an AI co-founder for early-stage founders. It runs community research to surface genuine pain points, generates product ideas grounded in real user struggles, creates step-by-step plans, and replans dynamically as the product evolves. Used by 30,000+ founders as of 2026.

### Jules

**URL:** https://jules.google

Google Labs' asynchronous, autonomous coding agent powered by Gemini. Unlike pair-programming copilots, Jules receives a complete task, works independently in an isolated virtual machine, and returns a finished pull request ready for review. It integrates natively with GitHub (with potential GitLab support), can fix CI failures automatically after a PR is created, and exposes a Jules API for embedding its capabilities into other tools (Slack, Linear, etc.).

### open-agent

**URL:** https://github.com/AFK-surf/open-agent

An open-source alternative to Claude Agent SDK, ChatGPT Agents, and Manus. Designed to be highly customizable, it integrates OpenAI, Claude, Gemini, and other open-source models so they can work together in a single agentic workflow.

### Voicebox (Meta)

**URL:** https://voicebox.metademolab.com

Meta AI's non-autoregressive flow-matching model for generative speech. Voicebox supports monolingual and cross-lingual zero-shot TTS, style conversion, transient noise removal, and content editing, trained on 60K hours of English audio (plus a multilingual version covering six languages). Due to misuse risks, the model and weights are not publicly released; Meta built a classifier to detect Voicebox-generated audio. Its successor, Audiobox, extended the approach to sound effects and soundscapes (demo deprecated as of early 2026).

### Agency Agents

**URL:** https://github.com/msitarzewski/agency-agents

An open-source collection of meticulously crafted AI agent personas, originally launched with 51 specialized agents and grown to 144+ across 12 professional divisions (Engineering, Design, Paid Media, Sales, Marketing, Product, Project Management, Testing, Support, Spatial Computing, Game Development, Academic). Each agent has a distinct personality, proven workflows, technical deliverables with code examples, and measurable success metrics. Compatible with Claude Code, Cursor, GitHub Copilot, Gemini CLI, and others.

### claude-coach

**URL:** https://github.com/netresearch/claude-coach-plugin

A self-improving learning system plugin for Claude Code that watches for friction signals in transcripts, detects outdated tool patterns, and proposes rule and skill updates. Follows the Agent Skills specification and adds automation features including signal detection, skill update suggestions, and LLM-assisted generation. (Note: there is also a separate `claude-coach` project by Felix Rieseberg — https://github.com/felixrieseberg/claude-coach — that uses Claude to generate personalised endurance-training plans for marathons, triathlons, and Ironman events.)

### Vercel agent-browser

**URL:** https://github.com/vercel-labs/agent-browser

A browser automation CLI purpose-built for AI agents, released by Vercel Labs. It supports headless Chromium, real Chrome with profile persistence, and cloud-hosted remote browsers, covering 15+ command categories (navigation, DOM inspection, interaction, data extraction, cookie management, JS execution). Architecture: Rust CLI + Node.js Playwright daemon, producing 82% less context than Playwright MCP and up to 93% less irrelevant DOM noise. Compatible with Claude Code, Codex, Cursor, Gemini CLI, Copilot, Goose, OpenCode, and Windsurf.

### LLM Arena (Chatbot Arena / lmarena-ai)

**URL:** https://arena.ai / https://huggingface.co/spaces/lmarena-ai/arena-leaderboard

A crowdsourced, randomized battle platform for LLMs that computes Elo ratings from human preference votes (6M+ votes across 357 models as of May 2026). Users chat with two anonymous models side-by-side and vote for the better response; results are aggregated into a leaderboard widely regarded as the most reliable real-world quality signal for LLMs. Run by the lmarena-ai team (originally LMSYS at UC Berkeley); also available at arena.ai.

## See also

- [[ruflo-overview]]
- [[ruflo-vs-alternatives]]
