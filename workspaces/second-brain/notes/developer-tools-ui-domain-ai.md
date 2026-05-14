---
slug: developer-tools-ui-domain-ai
title: Developer Infrastructure, UI Libraries & Domain AI Tools (2026-05)
type: note
status: draft
tags: [developer-tools, infrastructure, ui-components, domain-ai, landscape]
links: ["[[ai-agent-tools-landscape]]"]
source: null
confidence: medium
created: '2026-05-14'
updated: '2026-05-14'
---

## Developer infrastructure (SaaS building blocks)

- **[Neon](https://neon.tech)** — Serverless Postgres with instant branching; designed for modern apps that need per-environment database clones without provisioning overhead.
- **[Stripe](https://stripe.com)** — De-facto payments infrastructure for SaaS; handles billing, subscriptions, invoicing, and fraud tooling via API.
- **[Resend](https://resend.com)** — Developer-first transactional email API; clean SDK, domain verification, and React Email integration. Positioned as the modern alternative to SendGrid/Mailgun.
- **[Cloudflare R2](https://developers.cloudflare.com/r2/)** — S3-compatible object storage with zero egress fees; sits at Cloudflare's edge making it cost-effective for high-read workloads.
- **[Vercel](https://vercel.com)** — Serverless deployment platform and edge network for frontend/fullstack; native Git integration, preview deployments, and Edge Functions.
- **[n8n](https://n8n.io)** — Open-source, self-hostable workflow automation (nodes-and-edges model). An alternative to Zapier/Make with code-escape hatches and local LLM nodes.
- **[Axon](https://github.com/harshkedia177/axon)** — Graph-powered code intelligence engine that indexes a codebase into a structural knowledge graph (dependencies, call chains, execution flows) and exposes it via MCP tools to AI agents like Claude Code. Supports live re-indexing via `--watch` and an interactive web dashboard with force-directed graph visualization.

## UI component libraries

- **[21st.dev](https://21st.dev)** — React component registry and agent infrastructure platform (YC W2026). Ships production-ready UI blocks (chat interfaces, prompt boxes, streaming components) built on shadcn/ui + Tailwind + Radix. Also provides a TypeScript Agents SDK with built-in memory, observability, and one-command deployment.
- **[Aceternity UI](https://ui.aceternity.com)** — Animated React/Next.js component library built with Tailwind CSS and Framer Motion. ~200 copy-paste components (spotlight, parallax, 3D cards, vortex, sparkles). Free base set; Pro tier adds 70+ premium packs and templates. Popular for marketing sites and SaaS landing pages.

## Domain-specific AI tools

- **[Shannon](https://shannon-ai.com)** (by Keygraph) — Autonomous AI pentester for web applications and APIs. Performs white-box analysis: reads source code, identifies attack vectors, and executes real exploits (SQLi, auth bypass, data exfiltration) to prove vulnerabilities before production. Open-source Lite (AGPL-3.0) and commercial Pro (adds SAST/SCA/secrets scanning + CI/CD). Powered by Claude 3.5 Sonnet; scored 96.15% on the XBOW benchmark. Run only on sandboxed/staging environments with explicit written authorization.
- **[LingBot-Map](https://github.com/Robbyant/lingbot-map)** (by Ant Group / Robbyant) — Streaming 3D reconstruction foundation model that builds scene geometry in real-time from a single RGB camera. Key innovation: Geometric Context Attention (GCA) reduces memory growth ~80× versus standard causal attention, enabling stable inference at ~20 FPS over sequences >10,000 frames. Targets robotics, autonomous vehicles, and AR. Not a consumer house-mapping app; it is a research-grade spatial AI model.
- **[ScrapeGraph AI](https://scrapegraphai.com)** — LLM-powered web scraping framework (Python). Replaces brittle XPath/CSS selectors with prompt-based, schema-driven extraction; outputs structured JSON matching a user-defined schema. Supports GPT-4, Groq, Mistral. 20k+ GitHub stars. Ideal for product catalogs, real-estate listings, and any inconsistently-structured HTML.
- **Gemma 4 browser extensions** — Several open-source Chrome extensions run Google's Gemma 4 model entirely on-device via WebGPU (no API key, no data leaving the machine). Notable projects: [gemma-gem](https://github.com/kessler/gemma-gem) (page reading, button clicking, form filling) and [gemma4-browser-extension](https://github.com/nico-martin/gemma4-browser-extension) (on-device assistant via Transformers.js + ONNX, available on Chrome Web Store).
- **[MiroFish](https://mirofish.work)** — Multi-agent swarm intelligence prediction engine. Ingests real-world data (news, policy drafts, financial signals), spawns thousands of agents with independent personalities and long-term memory, lets them interact in a simulated world, and produces a structured forecast report. Topped GitHub trending in March 2026. More accurately a general-purpose outcome simulator than a product-feature predictor; belongs more in [[ai-agent-tools-landscape]].
