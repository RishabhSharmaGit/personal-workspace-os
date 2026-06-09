# Second Brain — Shared Language

The ubiquitous-language glossary for this workspace, in the style of Matt Pocock's
[`grill-with-docs`](https://github.com/mattpocock/skills) `CONTEXT.md` technique (see
[[matt-pocock-shared-language-context-md]]). Each entry pins **one** canonical term, a
1–2 sentence definition of what it *is*, and an `_Avoid_:` list of rejected synonyms.

**Rules for this file:** glossary only — no implementation detail, no specs, no scratch
notes. Pick one canonical word and reject its synonyms. Update it *inline* the moment a
term is resolved, never in a batch. Skills (`capture`, `triage-inbox`, `distill-chat`,
`query`) consult this file to keep slugs, titles, tags, and `[[wikilink]]` targets
consistent. Core terms here are candidates to promote to a future repo-root glossary
shared across workspaces.

## Core nouns

**Workspace**
A top-level knowledge domain under `workspaces/<slug>/` with its own `CLAUDE.md`,
`CONTEXT.md`, and folder skeleton. `second-brain` is one. Registered in `workspaces.json`.
_Avoid_: vault, project, folder, space.

**Item**
Any single Markdown file with frontmatter that the indexer turns into one row in the
`items` table. The atomic unit of the derived index.
_Avoid_: document, record, entry, page, file (when you mean the indexed unit).

**Note**
An `item` of `type: note` — atomic, concept-named, one idea per file, no date prefix.
The durable synthesis layer.
_Avoid_: article, doc, card, zettel.

**Source**
An `item` of `type: source` — a captured external artifact (URL, PDF, transcript) with
its provenance frontmatter. Date-prefixed.
_Avoid_: reference, citation, clip, import.

**Decision**
An `item` of `type: decision` — a recorded meta-choice about the brain itself (taxonomy,
convention). Date-prefixed. The local analogue of an ADR.
_Avoid_: ADR (use only when quoting external systems), ruling, policy.

**Inbox item**
An `item` living in `inbox/` with `status: raw` — captured but not yet triaged.
_Avoid_: draft, pending, unsorted, scratch.

**Hub note**
A `note` whose purpose is to anchor a topic by linking out to its related items; its
`links:` list is its main content. Satisfies the "anchor exists" triage gate for a topic.
_Avoid_: index note, MOC, map, landing page.

**Research session**
An `item` of `type: research` under `research/`, date-prefixed — the log of one
autonomous research run plus its synthesis and the notes it spawned.
_Avoid_: report, investigation, deep-dive (when you mean the logged session file).

## Structure & linking

**Slug**
The kebab-case, lowercase, ASCII identifier of an item. File name = slug + `.md`.
`[[wikilink]]`s resolve to a slug, never to a path.
_Avoid_: id, key, name, handle, permalink.

**Frontmatter**
The YAML block at the top of an item that the Zod schema validates and the indexer reads.
The contract is fixed in the root `CLAUDE.md`.
_Avoid_: metadata, header, yaml block (when you mean the validated contract).

**Wikilink**
A `[[slug]]` or `[[slug|display]]` reference in an item body. Resolves to a slug.
_Avoid_: backlink (that is the reverse direction), reference, internal link.

**Link**
A directed edge between two items, recorded in the `links` table from a `wikilink`.
A link whose target does not yet exist is **unresolved** (`to_item_id = NULL`), and that
is valid — the target may be created later.
_Avoid_: relation, connection, reference, edge (informally).

**Tag**
A controlled-vocabulary keyword in an item's `tags:` array; mirrored into the `tags`
table. Kebab-case.
_Avoid_: label, category, keyword, topic.

## Lifecycle & process

**Status**
The lifecycle value of an item, one of exactly four:
- **raw** — captured, not yet triaged (lives in `inbox/`).
- **draft** — placed and shaped, but not yet settled knowledge.
- **durable** — settled, trusted, atomic knowledge.
- **archived** — superseded or declined; kept for the record, excluded from active recall.
_Avoid_: new/wip/done/final, published, stable (as status values).

**Type**
The kind of an item (`note` | `source` | `decision` | `inbox` | `capture` | `research`,
plus career-os types). Distinct from `status`.
_Avoid_: kind, category, class.

**Confidence**
The reliability rating of an item's content: `low` | `medium` | `high`. Distinct from
`status`.
_Avoid_: certainty, quality, score, trust.

**Confidence gate**
The rule that an item may skip `inbox/` and land directly in `notes`/`sources`/`decisions`
only when ALL hold: unambiguous workspace, an existing anchor `[[slug]]`, unambiguous type,
and `high` confidence. Otherwise it goes to `inbox/`.
_Avoid_: triage rule, filter, auto-file check (when you mean this specific four-part gate).

**Capture**
The act of ingesting raw input (URL/file/text/chat) into an item via the `capture` skill.
_Avoid_: save, import, ingest (informally), clip.

**Distillation**
Extracting atomic notes, decisions, and snippets from a captured chat export via
`distill-chat`. The output is notes; the input is preserved as a source.
_Avoid_: summarization, extraction, processing.

**Triage**
Reviewing `inbox`/pending items and proposing placements via `triage-inbox`. Confidence-gated.
_Avoid_: sorting, filing, processing, grooming.

**Derived index**
The local Postgres mirror of the Markdown items. **Derived** — if it disagrees with the
Markdown, the Markdown wins; reconcile with `index-rebuild`.
_Avoid_: database, store, source of truth (the index is explicitly *not* the source of truth).

**Source of truth**
The Markdown files in `workspaces/**`. Always wins over the `derived index`.
_Avoid_: master, canonical store, the DB.

## Flagged ambiguities

- "**reference**" was overloaded (source item / wikilink / external citation) — resolved:
  a `[[wikilink]]` is a **wikilink**; an external captured artifact is a **source**; do not
  use "reference" as a noun for either.
- "**index**" means the **derived index** (Postgres), never a **hub note**. A topic-anchor
  note is a **hub note**.
- "**draft**" is a `status` value, not "an inbox item" — an untriaged item is **raw**.
