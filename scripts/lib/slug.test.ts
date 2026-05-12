import { describe, expect, it } from 'bun:test';
import { isValidSlug, slugify, datePrefixedSlug } from './slug.ts';

describe('isValidSlug', () => {
  it('accepts kebab-case lowercase ASCII', () => {
    expect(isValidSlug('llm-wiki-pattern')).toBe(true);
    expect(isValidSlug('a')).toBe(true);
    expect(isValidSlug('a-b-c-1-2-3')).toBe(true);
  });

  it('rejects uppercase', () => {
    expect(isValidSlug('LLM-wiki')).toBe(false);
  });

  it('rejects spaces and underscores', () => {
    expect(isValidSlug('llm wiki')).toBe(false);
    expect(isValidSlug('llm_wiki')).toBe(false);
  });

  it('rejects leading/trailing/consecutive hyphens', () => {
    expect(isValidSlug('-foo')).toBe(false);
    expect(isValidSlug('foo-')).toBe(false);
    expect(isValidSlug('foo--bar')).toBe(false);
  });

  it('rejects empty', () => {
    expect(isValidSlug('')).toBe(false);
  });
});

describe('slugify', () => {
  it('lowercases and replaces spaces with hyphens', () => {
    expect(slugify('LLM Wiki Pattern')).toBe('llm-wiki-pattern');
  });

  it('strips punctuation', () => {
    expect(slugify("Karpathy's Zero to Hero!")).toBe('karpathys-zero-to-hero');
  });

  it('collapses runs of non-alphanumerics', () => {
    expect(slugify('foo --- bar  ___  baz')).toBe('foo-bar-baz');
  });

  it('trims leading/trailing hyphens', () => {
    expect(slugify('---foo---')).toBe('foo');
  });

  it('produces a valid slug', () => {
    expect(isValidSlug(slugify('Hello, World!'))).toBe(true);
  });
});

describe('datePrefixedSlug', () => {
  it('prepends ISO date', () => {
    expect(datePrefixedSlug('2026-05-12', 'some-url')).toBe('2026-05-12-some-url');
  });

  it('result is a valid slug', () => {
    expect(isValidSlug(datePrefixedSlug('2026-05-12', 'some-url'))).toBe(true);
  });
});
