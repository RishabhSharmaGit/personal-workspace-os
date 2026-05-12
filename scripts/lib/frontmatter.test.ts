import { describe, expect, it } from 'bun:test';
import { parseDocument, FrontmatterSchema } from './frontmatter.ts';

const validDoc = `---
slug: llm-wiki-pattern
title: LLM Wiki Pattern
type: note
status: durable
tags: [llm, knowledge]
links: ["[[evergreen-notes]]"]
source: null
confidence: high
created: 2026-05-12
updated: 2026-05-12
---

Body text with [[evergreen-notes]] inline.
`;

describe('parseDocument', () => {
  it('parses valid frontmatter + body', () => {
    const doc = parseDocument(validDoc);
    expect(doc.frontmatter.slug).toBe('llm-wiki-pattern');
    expect(doc.frontmatter.type).toBe('note');
    expect(doc.frontmatter.tags).toEqual(['llm', 'knowledge']);
    expect(doc.body.trim()).toContain('[[evergreen-notes]]');
  });

  it('throws on missing required fields', () => {
    const bad = `---
title: missing slug
type: note
---
body`;
    expect(() => parseDocument(bad)).toThrow();
  });

  it('throws on invalid type enum', () => {
    const bad = `---
slug: foo
title: Foo
type: notarealtype
status: durable
tags: []
links: []
source: null
confidence: high
created: 2026-05-12
updated: 2026-05-12
---
body`;
    expect(() => parseDocument(bad)).toThrow();
  });

  it('throws on invalid slug', () => {
    const bad = `---
slug: NotKebabCase
title: Foo
type: note
status: durable
tags: []
links: []
source: null
confidence: high
created: 2026-05-12
updated: 2026-05-12
---
body`;
    expect(() => parseDocument(bad)).toThrow();
  });

  it('accepts source-type optional fields', () => {
    const sourceDoc = `---
slug: 2026-05-12-karpathy-zero
title: Karpathy Zero to Hero
type: source
status: durable
tags: []
links: []
source: null
confidence: high
created: 2026-05-12
updated: 2026-05-12
source_url: https://karpathy.ai/zero-to-hero.html
source_fetched_at: 2026-05-12T10:00:00Z
source_fetcher: firecrawl-scrape
source_content_hash: abc123
source_blob_path: null
---
extracted text`;
    const doc = parseDocument(sourceDoc);
    expect(doc.frontmatter.source_url).toBe('https://karpathy.ai/zero-to-hero.html');
    expect(doc.frontmatter.source_fetcher).toBe('firecrawl-scrape');
  });
});

describe('FrontmatterSchema', () => {
  it('exports a zod schema', () => {
    const result = FrontmatterSchema.safeParse({
      slug: 'foo',
      title: 'Foo',
      type: 'note',
      status: 'durable',
      tags: [],
      links: [],
      source: null,
      confidence: 'high',
      created: '2026-05-12',
      updated: '2026-05-12',
    });
    expect(result.success).toBe(true);
  });
});
