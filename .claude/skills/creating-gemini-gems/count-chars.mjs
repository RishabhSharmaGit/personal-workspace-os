#!/usr/bin/env node
// Verify a Gemini Gem's Instructions block fits the ~4000-char Gems UI limit.
//
// Usage:  node count-chars.mjs <path-to-gem.md>
//
// Extracts the fenced code block that sits under the "## The prompt" heading
// (the text you paste into the Gem's Instructions field) and reports its
// character count (code points), UTF-8 byte count, whether it is ASCII-only,
// and pass/fail against the limit.
//
// Why ASCII matters: the Gems UI counter counts characters. If the block is
// pure ASCII, code points == bytes == what the UI shows, so the number here is
// trustworthy. Smart quotes / em dashes / middots make the counts diverge and
// the UI number ambiguous — keep the Instructions block ASCII-only.

import { readFileSync } from 'node:fs';

const LIMIT = 4000;
const path = process.argv[2];
if (!path) {
  console.error('usage: node count-chars.mjs <path-to-gem.md>');
  process.exit(2);
}

const lines = readFileSync(path, 'utf8').split('\n');

let start = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].startsWith('## The prompt')) {
    for (let j = i + 1; j < lines.length; j++) {
      if (lines[j].trim() === '```') { start = j + 1; break; }
    }
    break;
  }
}
if (start === -1) {
  console.error('No fenced block found under a "## The prompt" heading.');
  process.exit(2);
}

let end = -1;
for (let j = start; j < lines.length; j++) {
  if (lines[j].trim() === '```') { end = j; break; }
}
if (end === -1) { console.error('Unterminated code fence.'); process.exit(2); }

const block = lines.slice(start, end).join('\n');
const chars = [...block].length;
const bytes = Buffer.byteLength(block, 'utf8');
const ascii = chars === bytes;
const ok = chars < LIMIT;

console.log(`chars (code points): ${chars}`);
console.log(`utf-8 bytes:         ${bytes}`);
console.log(`ASCII-only:          ${ascii}${ascii ? '' : '  <-- non-ASCII present; the Gems UI counter may differ'}`);
console.log(`headroom to ${LIMIT}:    ${LIMIT - chars}`);
console.log(
  ok && ascii ? 'PASS'
  : ok ? 'PASS (but non-ASCII — re-verify against the Gems UI live counter)'
  : 'FAIL — over the limit; trim the block (push detail into a kb-*-spec knowledge file)'
);
process.exit(ok ? 0 : 1);
