// Run with: node verify.cjs
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const { STEPS, DATA_TYPES } = require('./content.js');
const { SEATS, EXTRA_FILES, DEPARTMENTS, TRAINED, expertScore, validateSubmission } = require('./data.js');
assert.equal(STEPS.length, 14);
for (const s of STEPS) for (const k of ['act','time','title','sub','say','cue','disclose']) assert(s[k], `${s.title}: missing ${k}`);
for (const pod of Object.keys(SEATS)) {
  const rows = SEATS[pod].rubric, before = expertScore(pod, false), after = expertScore(pod, true);
  assert.equal(rows.reduce((n, r) => n + r.points, 0), 100, `${pod}: rubric must total 100`);
  assert(before.gated && !after.gated, `${pod}: baseline fails a gate, trained clears all`);
  assert(after.percent > before.percent && after.percent < 100, `${pod}: trained improves without a perfect score`);
  assert(TRAINED[pod].fails.every(i => !rows[i].mustPass), `${pod}: trained misses are not must-pass rows`);
  assert.deepEqual(validateSubmission({name:'x', deliverable:SEATS[pod].golden, rubric:rows}), [], `${pod}: example submits cleanly`);
  console.log(`Pod ${pod}: ${before.percent} -> ${after.percent}`);
}
const fileNames = [...Object.values(SEATS).flatMap(s => s.files), ...EXTRA_FILES].map(f => f.name);
for (const d of DEPARTMENTS) for (const f of d[3]) assert(fileNames.includes(f), `${d[0]}: no fixture for ${f}`);
for (const t of DATA_TYPES) for (const f of t.files) assert(fileNames.includes(f), `${t.title}: unknown file ${f}`);
assert(validateSubmission({name:'x', deliverable:'y', rubric:SEATS.A.rubric.map((r, i) => ({...r, points:i ? r.points : r.points - 1}))}).length, '99 points is rejected');
for (const f of ['index.html','app.js','content.js','data.js','styles.css']) {
  const t = fs.readFileSync(path.join(__dirname, f), 'utf8');
  assert(!t.includes('—'), `${f}: em dash`); if (f !== 'data.js') assert(!/director/i.test(t), `${f}: use Facilitator`); // data.js has a board resolution with director signatures
}
const app = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');
assert.equal((app.slice(app.indexOf('const DEMO = ['), app.indexOf('function demoBar')).match(/\{say:/g) || []).length, STEPS.length, 'demo runthrough covers every step');
console.log('PASS: 14 steps, rubric totals, simulated score contracts, submission checks, and copy rules.');
