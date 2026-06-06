import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import postgres from 'postgres';

// Bun auto-loads .env from the *cwd*, but hooks (SessionStart/Stop/PostToolUse)
// can fire from another cwd. Fall back to the repo-root .env (resolved from this
// file's location) so DATABASE_URL is found regardless of where the process started.
let url = process.env.DATABASE_URL;
if (!url) {
  const envPath = join(import.meta.dir, '..', '..', '.env');
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*DATABASE_URL\s*=\s*(.*)\s*$/);
      if (m) {
        url = m[1].trim().replace(/^["']|["']$/g, '');
        break;
      }
    }
  }
}
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
