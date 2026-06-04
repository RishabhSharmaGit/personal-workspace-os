#!/usr/bin/env bun
// Quick PDF page counter (no external deps): counts /Type /Page objects.
import { readFileSync } from 'node:fs';
const f = process.argv[2];
if (!f) { console.error('usage: bun run pagecount.ts <file.pdf>'); process.exit(2); }
const buf = readFileSync(f).toString('latin1');
const pages = (buf.match(/\/Type\s*\/Page[^s]/g) ?? []).length;
console.log(`${f.split(/[\\/]/).pop()}: ${pages} page(s)`);
