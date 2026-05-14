import postgres from 'postgres';

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error('DATABASE_URL not set. Copy .env.example to .env and run `bun run db:start`.');
}

export const sql = postgres(url, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
  prepare: false,
});

export async function closeDb(): Promise<void> {
  await sql.end();
}

export function isDbUnreachable(e: unknown): boolean {
  return !!e && typeof e === 'object' && (e as { code?: string }).code === 'ECONNREFUSED';
}

export type Workspace = {
  id: string;
  slug: string;
  name: string;
  path: string;
  description: string | null;
  created_at: Date;
};
