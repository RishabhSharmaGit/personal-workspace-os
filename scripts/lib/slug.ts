const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidSlug(s: string): boolean {
  return s.length > 0 && SLUG_RE.test(s);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[''`]/g, '')          // drop apostrophes/smart-quotes silently
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function datePrefixedSlug(isoDate: string, slug: string): string {
  return `${isoDate}-${slug}`;
}
