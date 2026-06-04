#!/usr/bin/env bun
/**
 * Local resume ↔ JD match / ATS scorer.
 *
 * Why this exists: commercial ATS scorers (Jobscan, Resume Worded, Enhancv)
 * sit behind auth walls and can't be looped against programmatically. This
 * computes the same signals locally and JD-specifically, so a resume can be
 * iterated against a target posting in a tight loop.
 *
 * Usage:
 *   bun run score.ts --resume variants/2026-06-04-therxassistant-tech-lead.md \
 *                    --jd ../roles/therxassistant-tech-lead.keywords.json
 *
 * The JD keywords file shape:
 *   { "required": [ "Node.js" | ["Node.js","NodeJS","Node"] , ... ],
 *     "bonus":    [ ... ],
 *     "domain":   [ ... ] }
 * Each entry is either a string or an array of aliases (any alias counts as a hit).
 */
import { readFileSync } from 'node:fs';

type Term = string | string[];
type JD = { required: Term[]; bonus: Term[]; domain?: Term[] };

function arg(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

function stripToText(raw: string): string {
  return raw
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    // Only real HTML tags (must start with a letter or /), so "<800ms" and
    // markdown blockquote "> " survive intact.
    .replace(/<\/?[a-z][^>]*>/gi, ' ')
    .replace(/&[a-z]+;/gi, ' ') // html entities
    .replace(/^[\s]*[*\-#>|]+/gm, ' ') // leading md markers per line
    .replace(/[*_`]/g, ' ') // inline md emphasis
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

function hit(text: string, term: Term): boolean {
  const aliases = Array.isArray(term) ? term : [term];
  return aliases.some((a) => {
    const needle = a.toLowerCase().trim();
    // word-ish boundary match; tolerant of punctuation around the term
    const esc = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(^|[^a-z0-9])${esc}([^a-z0-9]|$)`, 'i').test(text);
  });
}

function label(term: Term): string {
  return Array.isArray(term) ? term[0] : term;
}

const resumePath = arg('--resume');
const jdPath = arg('--jd');
if (!resumePath || !jdPath) {
  console.error('usage: bun run score.ts --resume <file> --jd <keywords.json>');
  process.exit(2);
}

const text = stripToText(readFileSync(resumePath, 'utf8'));
const jd: JD = JSON.parse(readFileSync(jdPath, 'utf8'));
const words = text.split(' ').filter(Boolean);

// ---- keyword coverage ----
const reqHits = jd.required.filter((t) => hit(text, t));
const reqMiss = jd.required.filter((t) => !hit(text, t));
const bonHits = jd.bonus.filter((t) => hit(text, t));
const bonMiss = jd.bonus.filter((t) => !hit(text, t));
const domHits = (jd.domain ?? []).filter((t) => hit(text, t));
const domMiss = (jd.domain ?? []).filter((t) => !hit(text, t));

const reqPct = jd.required.length ? reqHits.length / jd.required.length : 1;
const bonPct = jd.bonus.length ? bonHits.length / jd.bonus.length : 1;
const domPct = (jd.domain?.length ?? 0) ? domHits.length / jd.domain!.length : 1;

// ---- ATS / quality heuristics ----
const hasEmail = /@/.test(text);
const hasPhone = /\+?\d[\d ()-]{7,}/.test(text);
const sections: Term[] = [
  'summary',
  ['experience', 'work history', 'work experience', 'employment', 'work'],
  ['skills', 'technical skills'],
  'education',
];
const sectionHits = sections.filter((s) => hit(text, s));
const quantBullets = (readFileSync(resumePath, 'utf8').match(/^[\s>*-].*?(\d|%)/gm) ?? []).length;
const numberMentions = (text.match(/\d+(\.\d+)?%?/g) ?? []).length;
const wordCount = words.length;
const lengthOk = wordCount >= 380 && wordCount <= 1100; // ~1.5-2.5 pages

// ---- scoring (weighted /100) ----
const score =
  Math.round(
    reqPct * 45 + // required keywords (most important)
      bonPct * 20 + // bonus keywords
      domPct * 10 + // domain terms
      (sectionHits.length / sections.length) * 10 + // standard sections
      (hasEmail && hasPhone ? 5 : 0) + // contact
      (lengthOk ? 5 : 0) + // length sanity
      Math.min(numberMentions / 25, 1) * 5, // quantification density
  );

const bar = (p: number) => '█'.repeat(Math.round(p * 20)).padEnd(20, '░');

console.log(`\n  RESUME SCORE  ${score}/100   (${resumePath.split(/[\\/]/).pop()})`);
console.log('  ' + '─'.repeat(52));
console.log(`  Required keywords  ${bar(reqPct)} ${reqHits.length}/${jd.required.length}`);
console.log(`  Bonus keywords     ${bar(bonPct)} ${bonHits.length}/${jd.bonus.length}`);
if (jd.domain?.length)
  console.log(`  Domain terms       ${bar(domPct)} ${domHits.length}/${jd.domain.length}`);
console.log(
  `  Sections           ${bar(sectionHits.length / sections.length)} ${sectionHits.map(label).join(', ')}`,
);
console.log(`  Contact            ${hasEmail && hasPhone ? '✓ email + phone' : '✗ missing'}`);
console.log(`  Length             ${wordCount} words ${lengthOk ? '✓' : '⚠ (target 380-1100)'}`);
console.log(`  Quantified mentions ${numberMentions} numbers, ${quantBullets} metric bullets`);

if (reqMiss.length) console.log(`\n  ✗ MISSING required: ${reqMiss.map(label).join(' · ')}`);
if (bonMiss.length) console.log(`  ~ Missing bonus:    ${bonMiss.map(label).join(' · ')}`);
if (domMiss.length) console.log(`  ~ Missing domain:   ${domMiss.map(label).join(' · ')}`);
console.log('');
