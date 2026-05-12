import { isValidSlug } from './slug.ts';

export type Wikilink = {
  slug: string;
  display: string | null;
};

const LINK_RE = /\[\[([^\]\|]+?)(?:\|([^\]]+))?\]\]/g;

export function extractWikilinks(markdown: string): Wikilink[] {
  const seen = new Set<string>();
  const out: Wikilink[] = [];
  for (const m of markdown.matchAll(LINK_RE)) {
    const slug = m[1]?.trim();
    const display = m[2]?.trim() ?? null;
    if (!slug || !isValidSlug(slug)) continue;
    const key = `${slug}|${display ?? ''}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ slug, display });
  }
  return out;
}
