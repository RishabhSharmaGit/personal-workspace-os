---
slug: claude-code-ecosystem-landscape
title: Claude Code Ecosystem — Plugins, Skills & Tooling (2026-05)
type: note
status: draft
tags: [claude-code, plugins, skills, mcp, landscape]
links: []
source: null
confidence: medium
created: '2026-05-14'
updated: '2026-05-14'
---

The Claude Code ecosystem has grown rapidly in 2026 into a rich landscape of community skills, official plugins, MCP servers, and companion utilities spanning discovery, memory, design, and productivity.

## Plugins & Skills

**SkillsMP** — A community-run marketplace aggregating 1.2 M+ agent skills from GitHub, searchable by use-case and quality-filtered (minimum 2 stars). Uses the open SKILL.md standard compatible with Claude Code, OpenAI Codex CLI, and other agents. Install skills to `~/.claude/skills/` (global) or `.claude/skills/` (project). URL: https://skillsmp.com

**Get Shit Done (GSD)** — A spec-driven meta-prompting and context-engineering system for Claude Code by TÂCHES. Drives a Questions → Research → Requirements → Roadmap approval loop before touching code, with 100+ commands and agents for autonomous plan/execute/audit cycles. Trusted by engineers at Amazon, Google, Shopify, and Webflow. URL: https://github.com/gsd-build/get-shit-done

**Superpowers (obra/superpowers)** — An agentic skills framework and software development methodology by Jesse Vincent. Ships 60 agents, 228 skills, and 75 legacy command shims covering TDD, security scanning, code review, systematic debugging, brainstorming, and skill authoring. Available via the official Claude plugin marketplace or `obra/superpowers-marketplace`. URL: https://github.com/obra/superpowers

**Awesome Claude Code (hesreallyhim/awesome-claude-code)** — The de-facto curated list of skills, hooks, slash-commands, agent orchestrators, applications, and plugins for Claude Code. Selectively reviewed rather than auto-aggregated. Several forks exist (ComposioHQ, ccplugins, jqueryscript). URL: https://github.com/hesreallyhim/awesome-claude-code

**UI/UX Pro Max** — A Claude Code skill providing design intelligence across 10 technology stacks, with 50+ UI styles, 161 color palettes, 57 font pairings, 99 UX guidelines, and 25 chart types. Activates automatically when you request UI/UX work and validates against common anti-patterns. URL: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill

**Obsidian Skills (kepano/obsidian-skills)** — Agent skills for Obsidian maintained by Obsidian's creator Steph Ango. Teaches Claude Code to read/write Markdown, Bases, and JSON Canvas, manage daily notes, run full-text search, and use the Obsidian CLI. Drop the files into your vault to install. URL: https://github.com/kepano/obsidian-skills

**Claude Mem (claude-mem)** — Persistent cross-session memory for Claude Code and other agents (Codex, Gemini, Copilot, OpenCode). Captures tool-usage observations during a session, compresses them with the Claude Agent SDK, and injects relevant context via 4 MCP tools into future sessions. URL: https://github.com/thedotmack/claude-mem

**Frontend Design (anthropics/claude-code)** — An official Anthropic plugin that teaches Claude to produce distinctive, production-grade frontend interfaces, deliberately avoiding generic "AI slop" aesthetics. Guides bold typographic choices, high-impact animations, and context-aware visual details across a range of extreme aesthetic directions. Over 277,000 installs. URL: https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design

**Context7** — An MCP server by Upstash that injects version-specific, up-to-date library documentation directly into the LLM context window, covering 9,000+ libraries. Add `use context7` to any prompt to pull live docs instead of relying on stale training data. Works with Claude Code, Cursor, Windsurf, and any MCP-compatible client. URL: https://github.com/upstash/context7

**Claude Code Hooks (built-in)** — A first-party event system in Claude Code, not a plugin. Hooks are shell commands wired to lifecycle events in `.claude/settings.json`: `SessionStart` (runs when a session opens), `PostToolUse` (fires after each tool call — useful for incremental indexing on file writes), and `Stop` (runs when Claude finishes responding — useful for state logging). Hooks execute in the OS shell and cannot be substituted by Claude's memory.

**Code Simplifier (code-simplifier)** — An official Anthropic plugin open-sourced from the Claude Code team's own internal workflow. An autonomous agent that refines recently modified code for clarity, naming, reduced nesting, and maintainability without changing behavior. Install via `claude plugin install code-simplifier` or `/plugin install code-simplifier` from within a session. URL: https://github.com/anthropics/claude-plugins-official/tree/main/plugins/code-simplifier

## Productivity Tools

**CodexBar** — A free, open-source macOS 14+ menu bar app by Peter Steinberger that tracks usage limits, session windows, credit balances, and reset countdowns across 29 AI coding providers (Claude, Codex, Cursor, Gemini, Copilot, and more). Dual-bar visualization: top bar = 5-hour session window, bottom hairline = weekly limit. Privacy-first with on-device parsing; browser cookies are opt-in. Install via `brew install --cask steipete/tap/codexbar` or from GitHub Releases. URL: https://github.com/steipete/codexbar / https://codexbar.app

## See also

- [[mcp-ecosystem]] — broader MCP server landscape
- [[llm-wiki-pattern]] — Karpathy-style wiki-enrichment pattern underlying this OS
- [[claude-code-hooks]] — deeper notes on the hooks system if created
