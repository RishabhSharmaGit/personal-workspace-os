---
slug: context7-installation-config
title: Context7 MCP — Installation and Configuration Across AI Editors
type: note
status: draft
tags: [mcp, context7, cursor, windsurf, claude-code, configuration, setup]
links: ["[[context7-mcp-overview]]", "[[claude-code-ecosystem-landscape]]"]
source: null
confidence: high
created: '2026-05-14'
updated: '2026-05-14'
---

# Context7 MCP — Installation and Configuration Across AI Editors

Context7 can be installed into any MCP-compatible AI coding assistant in under 5 minutes. Configuration is JSON-based, identical across editors.

## Automated Installer (Fastest)

The npm package ships an `init` sub-command:

```sh
npx @upstash/context7-mcp@latest init --cursor     # Cursor
npx @upstash/context7-mcp@latest init --claude     # Claude Desktop
npx @upstash/context7-mcp@latest init --windsurf   # Windsurf
```

## Manual JSON Configuration

All editors share the same `mcpServers` JSON structure:

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

With an API key (recommended for higher rate limits):

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"],
      "env": {
        "CONTEXT7_API_KEY": "<your-key>"
      }
    }
  }
}
```

## Editor-Specific Config File Locations

| Editor | Config File Path |
|---|---|
| **Cursor** | `~/.cursor/mcp.json` (macOS/Linux), `%USERPROFILE%\.cursor\mcp.json` (Windows) |
| **Claude Desktop** | `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS), `%APPDATA%\Claude\claude_desktop_config.json` (Windows) |
| **Claude Code (CLI)** | `claude mcp add context7 -- npx -y @upstash/context7-mcp@latest` |
| **Windsurf** | Similar JSON config, see Windsurf MCP docs |

## Remote (HTTP) Mode

Instead of running Context7 as a local subprocess via `npx`, you can connect to the hosted endpoint directly. Some clients support HTTP MCP servers:

```
URL: https://mcp.context7.com/mcp
Auth: CONTEXT7_API_KEY header
```

## Prerequisites

- Node.js 18+
- (Optional) API key from `context7.com/dashboard` for higher rate limits

## Usage Trigger

Type `use context7` (or the client's configured invocation phrase) in the chat to trigger documentation retrieval. The MCP client will call `resolve-library-id` then `get-library-docs` automatically.

See also: [[context7-mcp-overview]]
