---
slug: karpathy-teaching-repos-and-courses
title: 'Karpathy teaching ladder — repos & courses'
type: note
status: durable
tags: [karpathy, llm-fundamentals, teaching, from-scratch, curriculum]
links: ["[[llm-wiki-pattern]]", "[[karpathy-software-3-and-coinages]]", "[[adopting-pocock-karpathy-in-workspace-os]]", "[[ai-agent-tools-landscape]]"]
source: null
confidence: high
created: '2026-06-09'
updated: '2026-06-09'
---
Andrej Karpathy maintains a deliberately progressive set of from-scratch, single-purpose teaching repos, each building on the last. Together they are the mechanistic substrate for understanding the LLM that mediates this OS — and a model for minimal, hackable, densely-linked artifacts.

**The repo ladder (each ~minimal, MIT-licensed, maximally forkable):**

- **micrograd** — ~100-LOC scalar reverse-mode autograd + ~50-LOC nn lib. Teaches the single most fundamental ML mechanism: how gradients flow. `github.com/karpathy/micrograd`
- **makemore** — one-file autoregressive char-level LM that steps through bigram → MLP (Bengio 2003) → RNN → LSTM → GRU → Transformer (Vaswani 2017). Shows the historical model progression in code. `github.com/karpathy/makemore`
- **minGPT** — clean ~300-LOC PyTorch GPT (model/bpe/trainer); semi-archived Jan 2023, superseded by nanoGPT. `github.com/karpathy/minGPT`
- **nanoGPT** — the "teeth over education" rewrite; `train.py` reproduces GPT-2 124M. His most-starred teaching repo, now itself deprecated for nanochat. `github.com/karpathy/nanoGPT`
- **build-nanogpt** — the commit-by-commit companion to the "Let's reproduce GPT-2" lecture; walk the git history to walk the concept progression. `github.com/karpathy/build-nanogpt`
- **nanochat** — released 13-Oct-2025, ~8000 lines: the FULL ChatGPT pipeline (tokenizer → pretrain → SFT → RL → eval → inference → chat UI) in one hackable codebase. Key idea: a single `--depth` dial auto-derives every other hyperparameter; PRs must disclose substantial unowned LLM contributions. `github.com/karpathy/nanochat`
- **llm.c** — GPT-2/3 pretraining in raw C/CUDA, no PyTorch. Education AND real speed. `github.com/karpathy/llm.c`

**Courses & teaching orgs:**

- **Neural Networks: Zero to Hero** — YouTube lectures + Jupyter notebooks covering micrograd, makemore, build-GPT, and the GPT tokenizer (minBPE). The canonical from-scratch path. `github.com/karpathy/nn-zero-to-hero`
- **LLM101n** ("Let's build a Storyteller") — 17-chapter Eureka Labs flagship; announced but unreleased (repo archived, "course does not yet exist").
- **Eureka Labs** — his "AI-native school" (announced Jul-2024); ships courses via GitHub, no newsletter.
- **CS231n** — Stanford's first deep-learning course, which he designed and taught (2011–2015); still running.
- **Long-form explainers** — "How I use LLMs" (~34min, most operationally relevant), "Deep Dive into LLMs like ChatGPT" (3h31m), "[1hr] Intro to LLMs" (the LLM-OS framing).

**Why it matters for an LLM-OS operator:** the curriculum is conceptual grounding (capture as `type: source` + a hub note), not tooling to wire into skills. The transferable patterns are structural: the **single complexity dial** (one knob auto-deriving the rest), **minimal-hackable-file design** as the authoring bar for every `SKILL.md`, and the **AI-disclosure norm** as a provenance convention.

## See also
- [[karpathy-software-3-and-coinages]] — Software 2.0/3.0, context engineering, LLM OS
- [[llm-wiki-pattern]] — the densely-wikilinked atomic-note model this curriculum exemplifies
- [[adopting-pocock-karpathy-in-workspace-os]] — concrete adoption plan (single-dial, minimal-file rubric, AI-provenance)
- [[ai-agent-tools-landscape]]
