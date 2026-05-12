import { describe, expect, it } from 'bun:test';
import { extractWikilinks } from './wikilinks.ts';

describe('extractWikilinks', () => {
  it('extracts a single link', () => {
    expect(extractWikilinks('see [[zero-to-hero]] for details')).toEqual([
      { slug: 'zero-to-hero', display: null },
    ]);
  });

  it('extracts a link with display text', () => {
    expect(extractWikilinks('see [[zero-to-hero|Karpathy\'s course]]')).toEqual([
      { slug: 'zero-to-hero', display: "Karpathy's course" },
    ]);
  });

  it('extracts multiple links', () => {
    expect(extractWikilinks('[[a]] and [[b|B label]] and [[c]]')).toEqual([
      { slug: 'a', display: null },
      { slug: 'b', display: 'B label' },
      { slug: 'c', display: null },
    ]);
  });

  it('returns empty array when no links', () => {
    expect(extractWikilinks('plain text with no links')).toEqual([]);
  });

  it('ignores malformed links', () => {
    expect(extractWikilinks('[[ ]] [[]] [[Capital]]')).toEqual([]);
  });

  it('deduplicates same-slug occurrences', () => {
    expect(extractWikilinks('[[foo]] and [[foo|Foo]] and [[foo]]')).toEqual([
      { slug: 'foo', display: null },
      { slug: 'foo', display: 'Foo' },
    ]);
  });
});
