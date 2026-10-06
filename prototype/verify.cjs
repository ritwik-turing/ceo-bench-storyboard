// Run with: node verify.cjs
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const read = f => fs.readFileSync(path.join(__dirname, f), 'utf8');
const { STEPS, MANDATE } = require('./content.js');
const { CORPUS } = require('./corpus.js');
const { L2GAP, validateSubmission } = require('./data.js');
const { TASK } = require('./l1.js');
const app = read('app.js');
assert.equal(STEPS.length, 9);
for (const s of STEPS) for (const k of ['act','time','title','short','sub','say','cue','disclose']) assert(s[k], `${s.title}: missing ${k}`);
assert.equal((app.match(/^ \d+: \(\) =>/gm) || []).length, STEPS.length, 'one view per step');
assert.equal((app.slice(app.indexOf('const DEMO = ['), app.indexOf('function demoBar')).match(/\{say:/g) || []).length, STEPS.length, 'runthrough covers every step');
// Real corpus: counts present, every department has a preview, and no answer-like files are previewed.
assert(CORPUS.totalFiles > 1000 && CORPUS.departments.length >= 8);
for (const d of CORPUS.departments) { assert(d.samples.length, `${d.name}: no preview`); for (const s of d.samples) assert(!/rubric|golden|grading/i.test(s.path), `${s.path}: answer-like file`); }
for (const s of CORPUS.systems) assert(s.count > 0 && s.sample.length > 40, `${s.name}: empty`);
// Today's real L1: rubric totals 100, three recorded runs, scores add up, and must-pass failures disqualify.
const T = TASK;
assert.equal(T.rubric.reduce((n, r) => n + r.points, 0), 100);
assert.equal(T.models.length, 3);
for (const m of T.models) { assert.equal(m.scores.reduce((n, x) => n + x, 0), m.total, `${m.name}: total`); assert.equal(m.pass, !T.rubric.some((r, i) => r.mustPass && m.scores[i] === 0), `${m.name}: gate`); }
assert(T.models.filter(m => m.pass).length >= 2, 'most models pass the L1');
assert.equal(T.siblings.filter(s => s.today).length, 1, 'exactly one L1 is today’s task');
assert.deepEqual(validateSubmission({name:'x', deliverable:T.golden, rubric:T.rubric}), []);
assert(validateSubmission({name:'x', deliverable:'y', rubric:T.rubric.map((r, i) => ({...r, points:i ? r.points : r.points - 1}))}).length, '99 points is rejected');
// The L2 gap and training remain placeholders.
assert(L2GAP.models.every((_, m) => L2GAP.checks.some(c => !c.models[m])), 'every model lost points in the L2');
assert(L2GAP.checks.filter(c => c.trained).length > L2GAP.checks.filter(c => c.models[0]).length, 'training improves the gap checks');
for (const f of ['index.html','app.js','content.js']) { const t = read(f); assert(!t.includes('—'), `${f}: em dash`); assert(!/director/i.test(t), `${f}: use Facilitator`); assert(!/confirm\(/.test(t), `${f}: confirm() is blocked in some viewers`); }
console.log(`PASS: 9 steps and runthrough, real corpus (${CORPUS.totalFiles} files), real L1 ${T.id}: ${T.models.map(m => m.name + ' ' + (m.pass ? m.total : 'DQ')).join(', ')}, submission checks, copy rules.`);
