import matter from 'gray-matter';
import { z } from 'zod';
import { isValidSlug } from './slug.ts';

const slugSchema = z.string().refine(isValidSlug, { message: 'invalid slug' });

export const FrontmatterSchema = z.object({
  slug: slugSchema,
  title: z.string().min(1),
  type: z.enum([
    'note',
    'source',
    'decision',
    'inbox',
    'capture',
    'research',
    // career-os types
    'application',
    'contact',
    'target-role',
    'achievement',
    'resume',
    'cover-letter',
    'interview-prep',
    'project',
    'company',
  ]),
  status: z.enum(['raw', 'draft', 'durable', 'archived']),
  tags: z.array(z.string()).default([]),
  links: z.array(z.string()).default([]),
  source: z.string().nullable().default(null),
  confidence: z.enum(['low', 'medium', 'high']).optional(),
  created: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  // source-only optional fields
  source_url: z.string().url().optional(),
  source_fetched_at: z.string().optional(),
  source_fetcher: z
    .enum(['firecrawl-scrape', 'firecrawl-instruct', 'manual', 'pdf', 'chat-export'])
    .optional(),
  source_content_hash: z.string().optional(),
  source_blob_path: z.string().nullable().optional(),
  // research-only optional fields
  agent_run_id: z.string().uuid().optional(),
  budget: z.number().int().positive().optional(),
  // career-os optional fields (kanban + relational metadata; mirror Postgres career_* tables)
  application_status: z
    .enum([
      'wishlist',
      'applied',
      'screen',
      'technical',
      'onsite',
      'offer',
      'accepted',
      'rejected',
      'withdrawn',
      'ghosted',
    ])
    .optional(),
  applied_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  next_action_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  company: z.string().optional(),
  target_role: z.string().optional(),
  channel: z.string().optional(),
  region: z.string().optional(),
  salary_band: z.string().optional(),
  contact_role: z.string().optional(),
  contact_email: z.string().optional(),
  contact_linkedin: z.string().optional(),
  contact_relationship: z
    .enum(['recruiter', 'hiring-manager', 'referrer', 'peer', 'other'])
    .optional(),
  tech_tags: z.array(z.string()).optional(),
  role_slug: z.string().optional(),
  metric: z.string().optional(),
  evidence_url: z.string().optional(),
  xyz: z
    .object({
      x: z.string(),
      y: z.string(),
      z: z.string(),
    })
    .optional(),
  resume_kind: z.enum(['master', 'variant']).optional(),
  resume_rendered_pdf_path: z.string().optional(),
  jd_url: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  tech: z.array(z.string()).optional(),
  live_url: z.string().optional(),
  repo_url: z.string().optional(),
  careers_url: z.string().optional(),
  hq_location: z.string().optional(),
  sponsors_visa: z.union([z.boolean(), z.string()]).optional(),
  size: z.string().optional(),
});

export type Frontmatter = z.infer<typeof FrontmatterSchema>;

export type ParsedDocument = {
  frontmatter: Frontmatter;
  body: string;
};

function coerceDates(data: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value instanceof Date) {
      // For date-only fields (created, updated) use YYYY-MM-DD; for datetime fields keep full ISO
      const iso = value.toISOString();
      result[key] = iso.includes('T00:00:00.000Z') ? iso.slice(0, 10) : iso;
    } else {
      result[key] = value;
    }
  }
  return result;
}

export function parseDocument(raw: string): ParsedDocument {
  const parsed = matter(raw);
  const data = coerceDates(parsed.data as Record<string, unknown>);
  const fm = FrontmatterSchema.parse(data);
  return { frontmatter: fm, body: parsed.content };
}

export function stringifyDocument(fm: Frontmatter, body: string): string {
  return matter.stringify(body, fm as Record<string, unknown>);
}
