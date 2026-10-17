#!/usr/bin/env node
// Toetst index.html aan SPEC.md (§3 tokens, §4 bedrijfsgegevens, §5 secties, §8 acceptatiecriteria).
// Geen dependencies: `node scripts/check-spec.mjs`
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const spec = readFileSync(join(root, 'SPEC.md'), 'utf8');
const html = readFileSync(join(root, 'index.html'), 'utf8');

const block = (name) => {
  const m = spec.match(new RegExp('```json ' + name + '\\n([\\s\\S]*?)```'));
  if (!m) throw new Error(`SPEC.md mist het blok \`\`\`json ${name}`);
  return JSON.parse(m[1]);
};
const tokens = block('tokens');
const facts = block('facts');
const sections = block('sections');

const results = [];
const check = (id, ok, detail = '') => results.push({ id, ok: !!ok, detail });
const norm = (s) => s.replace(/\s+/g, '').toLowerCase();
const strip = (s) => s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

const css = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('\n');
const body = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '');
const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));

// AC-01
const missing = sections.filter((s) => !ids.has(s));
check('AC-01 secties aanwezig', !missing.length, missing.join(', '));

// AC-02
const h1 = (body.match(/<h1[\s>]/g) || []).length;
check('AC-02 precies één h1', h1 === 1, `${h1} gevonden`);

// AC-03
const title = strip((html.match(/<title>([\s\S]*?)<\/title>/) || [, ''])[1]);
const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [, ''])[1];
check('AC-03 title ≤ 65', title.length <= 65, `${title.length}: ${title}`);
check('AC-03 description 120–160', desc.length >= 120 && desc.length <= 160, `${desc.length}`);
check('AC-03 canonical', /<link rel="canonical"/.test(html));

// AC-04
const imgs = [...body.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
const badImg = imgs.filter((t) => !/\salt="[^"]*"/.test(t) || !/\swidth="\d+"/.test(t) || !/\sheight="\d+"/.test(t));
const missingFile = imgs
  .map((t) => (t.match(/\ssrc="([^"]+)"/) || [, ''])[1])
  .filter((src) => src && !/^(https?:|data:)/.test(src) && !existsSync(join(root, src)));
check('AC-04 img alt/width/height', !badImg.length, badImg.slice(0, 3).join(' | '));
check('AC-04 afbeeldingen bestaan', !missingFile.length, missingFile.join(', '));

// AC-05
const emoji = body.match(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B50}\u{2705}]/gu) || [];
check('AC-05 geen emoji', !emoji.length, emoji.join(' '));

// AC-06
const fields = [...body.matchAll(/<(input|select|textarea)\b([^>]*)>/g)]
  .filter((m) => !/type="(hidden|submit)"/.test(m[2]) && !/name="_gotcha"/.test(m[2]))
  .map((m) => (m[2].match(/\sid="([^"]+)"/) || [, null])[1]);
const unlabeled = fields.filter((id) => !id || !new RegExp(`<label[^>]*for="${id}"`).test(body));
check('AC-06 labels bij velden', !unlabeled.length, unlabeled.join(', '));

// AC-07
let ldOk = true;
let faqLd = [];
for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
  try {
    const j = JSON.parse(m[1]);
    if (j['@type'] === 'FAQPage') faqLd = j.mainEntity.map((q) => q.name);
  } catch { ldOk = false; }
}
const summaries = [...body.matchAll(/<summary[^>]*>([\s\S]*?)<\/summary>/g)].map((m) => strip(m[1]));
check('AC-07 JSON-LD geldig', ldOk);
check('AC-07 FAQ JSON-LD = zichtbare FAQ', JSON.stringify(faqLd) === JSON.stringify(summaries),
  `ld=${faqLd.length} zichtbaar=${summaries.length}`);

// AC-08
const rootBlock = (css.match(/:root\s*\{([\s\S]*?)\}/) || [, ''])[1];
const cssTokens = Object.fromEntries([...rootBlock.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
const tokenDiff = Object.entries(tokens).filter(([k, v]) => norm(cssTokens[k] || '') !== norm(v)).map(([k]) => k);
check('AC-08 tokens = spec', !tokenDiff.length, tokenDiff.join(', '));
const cssOutsideRoot = css.replace(/:root\s*\{[\s\S]*?\}/, '');
const stray = cssOutsideRoot.match(/#[0-9a-fA-F]{3,8}\b/g) || [];
check('AC-08 geen losse hex in CSS', !stray.length, [...new Set(stray)].join(' '));

// AC-09
const absent = Object.entries(facts).filter(([, v]) => !html.includes(v.replace(/&/g, '&amp;')) && !html.includes(v)).map(([k]) => k);
check('AC-09 bedrijfsgegevens aanwezig', !absent.length, absent.join(', '));
const phones = new Set([...body.matchAll(/tel:\+?\d+/g)].map((m) => m[0]));
const mails = new Set([...body.matchAll(/[\w.+-]+@[\w-]+\.[\w.]+/g)].map((m) => m[0]));
check('AC-09 één telefoonnummer', phones.size === 1 && phones.has(facts.phone_href), [...phones].join(' '));
check('AC-09 één e-mailadres', mails.size === 1 && mails.has(facts.email), [...mails].join(' '));

// AC-10
const dead = [...body.matchAll(/href="#([^"]*)"/g)].map((m) => m[1]).filter((h) => h && !ids.has(h));
check('AC-10 interne ankers kloppen', !dead.length, [...new Set(dead)].join(', '));

// AC-11
check('AC-11 prefers-reduced-motion', /prefers-reduced-motion/.test(css));

// AC-12
check('AC-12 geen :invalid bij laden', !/(^|[^-]):invalid/.test(css.replace(/:user-invalid/g, '')));

// Rapport
let fail = 0;
for (const r of results) {
  if (!r.ok) fail++;
  console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.id}${r.ok || !r.detail ? '' : '  → ' + r.detail}`);
}
console.log(`\n${results.length - fail}/${results.length} geslaagd`);
process.exit(fail ? 1 : 0);
