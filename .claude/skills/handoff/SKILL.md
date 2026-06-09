---
name: handoff
description: Compact the current conversation into a handoff document for another agent to pick up. Use when the user says "handoff", "hand off", "write a handoff", or wants to continue this work in a fresh session.
argument-hint: "What will the next session be used for?"
---

Write a handoff document summarising the current conversation so a fresh agent can continue the work.

**Save location (Workspace OS adaptation):** write to `docs/handoffs/YYYY-MM-DD-<focus>.md` in this repo (use today's system date, ISO). This path is tracked in git but lives **outside** `workspaces/`, so it is not parsed as a knowledge item and needs no frontmatter. Do **not** save to the OS temp directory, and do not put handoffs inside `workspaces/**`.

Include a "suggested skills" section in the document, which suggests skills the next agent should invoke.

Do not duplicate content already captured in other artifacts (notes, research sessions, decisions, ADRs, commits, diffs). Reference them by `[[slug]]` or path instead.

Redact any sensitive information — API keys, passwords, the contents of `.env` or `.claude/settings.local.json`, or personal data from the `career-os` workspace's `private/` folder.

If the user passed arguments, treat them as a description of what the next session will focus on and tailor the doc accordingly.

---
_Source: [`mattpocock/skills`](https://github.com/mattpocock/skills) `productivity/handoff`, adapted for the Workspace OS (in-repo tracked save location). See [[matt-pocock-grilling-and-feedback-loops]]._
