---
name: distill-chat
description: Use when user pastes a chat export (ChatGPT/Claude/Codex/Gemini conversation) or says "distill this chat". Stores the full conversation as a source-type item, then extracts decisions, code snippets, durable insights, and routes each via the capture skill.
---

# Distill-Chat skill

## When to invoke

Trigger phrases: "distill this chat", "extract from this conversation", "save this conversation". Or auto-invoke from the `capture` skill when chat-export markers are detected ("User:" / "Assistant:" / "ChatGPT" / "Claude" headers, multi-turn structure).

## Pipeline

1. **Detect platform** from formatting markers:
   - ChatGPT JSON export → JSON parse
   - Claude markdown export → "## Human:" / "## Assistant:" headers
   - Codex log format → "[user]" / "[assistant]" prefixes
   - Otherwise → "other"

2. **Pick a title hint** — first user message, truncated to ~50 chars.

3. **Store the raw chat** as a source-type item via `bun run scripts/distill-chat.ts --json '{"workspace":"second-brain","titleHint":"...","chatPlatform":"...","rawChat":"..."}'`. This creates `workspaces/second-brain/sources/<date>-chat-<platform>-<slug>.md`.

4. **Read the full chat** with the Read tool and segment by turn.

5. **Extract durable artifacts:**
   - **Decisions** — explicit decisions made ("we'll use Postgres", "switching to Bun"). Each → invoke `capture` with `type: decision`, `source: <chat slug>`.
   - **Code snippets worth keeping** — non-trivial code blocks. Each → invoke `capture` with `type: note`, body includes the code in a fenced block, `source: <chat slug>`.
   - **Durable insights** — abstract learnings ("X works because Y"). Each → invoke `capture` with `type: note`, `source: <chat slug>`.
   - **Action items** — these go to inbox/ for later triage into a tasks workspace.

6. **Report**: chat saved as `[[<chat slug>]]`; N decisions, N notes, M action items captured.

## Edge cases

- If the chat is very long (> 50 turns), summarize the chat first, store the summary alongside the raw, and only extract the top 5 decisions / notes by importance.
- If you can't reliably segment turns, store the raw chat as-is and report "couldn't auto-segment — please point me to specific portions to distill."
