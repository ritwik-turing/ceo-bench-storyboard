'use strict';
/* CEO Bench live demo prototype v3. Company data comes from the real corpus (corpus.js). Today's task, its rubric,
   and the three model results are the real L1-04-01 pilot records (l1.js). The L2 gap, training, and re-evaluation
   are placeholders (L2GAP in data.js). No model is called live. */
const $ = s => document.querySelector(s);
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const KEY = 'ceo-bench-demo-v3', NOTES_KEY = 'ceo-bench-comments-v3';
const T = TASK;
const blank = () => ({step:1, model:1, src:'d2', file:0, revealed:false, openL2:false, gap:false, work:null, baseline:false, graded:false, trained:false, trainedRun:false});
let S = blank();
try { S = Object.assign(blank(), JSON.parse(localStorage.getItem(KEY))); } catch {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} };
let runId = 0; // cancels a running replay, grading, or training animation when the view changes

const work = () => S.work ??= {deliverable:'', rubric:Array.from({length:10}, () => ({text:'', points:'', mustPass:false})), submitted:false, example:false};
const points = rows => rows.reduce((n, r) => n + (Number(r.points) || 0), 0);
const fmt = n => n.toLocaleString('en-US');
const M = () => T.models[S.model] || T.models[0];
const sim = text => `<div class="sim">${text}</div>`;
const real = text => `<div class="sim real">${text}</div>`;
const mark = ok => `<span class="mark ${ok ? 'y' : 'n'}" aria-label="${ok ? 'Met' : 'Not met'}">${ok ? '✓' : '✕'}</span>`;
const pts = (m, i) => { const r = T.rubric[i], got = m.scores[i]; return `<span class="${got === r.points ? 'good' : got === 0 ? 'bad' : ''}">${got}/${r.points}</span>`; };
const ring = (value, fail) => { const c = 2 * Math.PI * 30; return `<div class="ring ${fail ? 'fail' : ''}"><svg viewBox="0 0 76 76"><circle class="bg" cx="38" cy="38" r="30"/><circle class="fg" cx="38" cy="38" r="30" stroke-dasharray="${(value / 100 * c).toFixed(1)} ${c.toFixed(1)}"/></svg><span>${value}</span></div>`; };
const verdict = m => m.pass ? '<span class="tag good">Passes</span>' : `<span class="tag bad">Disqualified · ${m.failed.join(', ')}</span>`;
const KIND = {xlsx:'spreadsheets', docx:'documents', doc:'documents', pdf:'PDFs', pptx:'slide decks', csv:'data exports', json:'data exports', png:'images'};
const kinds = k => Object.entries(Object.entries(k).reduce((a, [x, n]) => (a[KIND[x] || 'other files'] = (a[KIND[x] || 'other files'] || 0) + n, a), {})).map(([x, n]) => `${n} ${x}`).join(' · ');
const gapScore = met => { const total = L2GAP.checks.reduce((n, c) => n + c.points, 0), earned = L2GAP.checks.reduce((n, c) => n + (met(c) ? c.points : 0), 0); return {total, earned, pct:Math.round(earned / total * 100)}; };
const isNum = c => /^-?\$?[\d,]+(\.\d+)?$/.test(c);
// Renders a sheet as notes and real tables. hl marks rows to highlight (e.g. the line the task is about).
const segHTML = (segs, hl = /Fulfillment|SLA credit|FY Total|FY2021/i) => segs.map(s => s.note ? `<p class="seg-note">${esc(s.note)}</p>` : `<div class="tbl"><table class="data ${s.header.length <= 3 ? 'wrap' : ''}"><thead><tr>${s.header.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${s.rows.map(r => `<tr class="${hl.test(r[0]) ? 'hl' : ''}">${r.map(c => `<td class="${isNum(c) ? 'n' : ''}">${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`).join('');
const screen = (title, body) => `<div class="screen"><div class="chrome"><i></i><i></i><i></i><b>${title}</b><span class="rec">Recorded run · replay</span></div><div class="screen-body">${body}</div></div>`;

const views = {
 // 1 · Company and its data
 1: () => { const sys = Object.fromEntries(CORPUS.systems.map(s => [s.name, s.count]));
  const tiles = [[CORPUS.totalFiles, 'files, 1 fiscal year'], [CORPUS.people, 'employees'], [sys['Slack'], 'Slack messages'], [sys['Support tickets'], 'support tickets'], [sys['Online orders'], 'online orders'], [sys['Bank and ledger'], 'ledger lines']];
  const sources = [...CORPUS.departments.map((d, i) => ({key:'d' + i, name:d.name, meta:`${d.files}`, d})), ...CORPUS.systems.map((s, i) => ({key:'s' + i, name:s.name, meta:fmt(s.count), s}))];
  const cur = sources.find(x => x.key === S.src) || sources[0];
  let pane;
  if (cur.d) { const f = cur.d.samples[S.file] || cur.d.samples[0], data = /\.xlsx$/.test(f?.name || '');
   pane = `<p class="small">${cur.d.files} files · ${kinds(cur.d.kinds)}</p><div class="chips">${cur.d.samples.map((x, i) => `<button data-file="${i}" class="${x === f ? 'on' : ''}">${esc(x.name)}</button>`).join('')}</div>${f ? `<span class="path">${esc(f.path)}</span><div class="doc ${data ? 'data' : ''}">${esc(f.text)}</div>` : ''}`; }
  else pane = `<p class="small">${esc(cur.s.detail)}</p><span class="path">${esc(cur.s.sampleTitle)} · as stored</span><div class="doc data">${esc(cur.s.sample)}</div>`;
  return `<div class="strip">${tiles.map(([n, l], i) => `<div class="tile ${i ? '' : 'lead'}"><div class="num" data-count="${n}">${fmt(n)}</div><div class="cap">${l}</div></div>`).join('')}</div>
  <div class="browser"><div class="side"><span class="label">${CORPUS.departments.length} departments</span>${sources.map(x => `${x.key === 's0' ? '<span class="label">Systems</span>' : ''}<button data-src="${x.key}" class="${x === cur ? 'on' : ''}">${esc(x.name)}<small>${x.meta}</small></button>`).join('')}</div>
  <div class="pane"><h3>${esc(cur.name)}</h3>${pane}</div></div>`; },

 // 2 · L3 brief and the L3 → L2 → L1 breakdown
 2: () => { const today = 'Board model inputs: operations cost and AP';
  return `<div class="tier l3"><div class="lvl">L3<small>~100h</small></div><div class="card dark"><span class="label">The executive job · abridged</span><h3 style="font-size:22px">${L3.name}</h3><div class="brief">${MANDATE.map((m, i) => `<button data-detail="mandate:${i}" title="${esc(m.detail)}"><span class="k">${m.label.replace('Your ', '')}</span><span class="v">${m.value}</span></button>`).join('')}</div></div></div>
  <div class="tier l2 ${S.openL2 ? '' : 'last'}"><div class="lvl">L2<small>10–20h</small></div>${S.revealed ? `<div><div class="grid g5 reveal">${[...TASKS].sort((a, b) => (b[3] === TODAY) - (a[3] === TODAY)).map(([n, name, desc, pod]) => pod === TODAY
    ? `<button class="card l2-pick ${S.openL2 ? 'open' : ''}" data-act="open-l2"><span class="label">L2-04 · contains your task</span><h3>${today}</h3><p>Fulfillment, payables, and the Apex incident</p><span class="l2-count">${S.openL2 ? '6 L1 tasks shown below ▾' : 'Open to see its 6 L1 tasks ▸'}</span></button>`
    : `<button class="card l2-other" data-detail="task:${n}"><span class="label">Done by experts</span><h3>${name}</h3><p>${desc}</p></button>`).join('')}</div>${S.openL2 ? '' : '<p class="small" style="margin-top:12px">Every department task has its own small L1 tasks. Open the highlighted one, L2-04, to see the six inside it.</p>'}</div>` : `<div><button class="primary big" data-act="reveal">Break it into 10 department tasks</button></div>`}</div>
  ${S.openL2 ? `<div class="tier l1 last"><div class="lvl">L1<small>1–3h</small></div><div class="l1-panel reveal"><div class="l1-title">The 6 small tasks inside <b>L2-04 · ${today}</b></div><div class="l1-head"><span class="crumb">L3 · first external audit</span><span class="sep">›</span><span class="crumb on">L2-04 · ${today}</span><span class="sep">›</span><span class="crumb">6 L1 tasks</span></div><div class="grid g3">${T.siblings.map((t, i) => `<button class="card ${t.today ? 'today' : ''}" data-detail="l1:${i}"><span class="label">${t.id} · ${t.today ? 'Your task today' : 'Done by experts'}</span><h3>${t.name}</h3></button>`).join('')}</div></div></div>` : ''}`; },

 // 3 · Golden answer
 3: () => { const w = work();
  return `<div class="work"><div class="stack"><div class="task-card"><span class="label">Your task · ${T.id}</span><p><b>${T.question}</b></p><p style="margin-top:6px">${T.brief}</p><p class="small" style="margin-top:8px">${T.briefNote}</p></div>
   ${T.files.map(f => `<div class="source"><h4><span class="ref">${f.ref}</span>${esc(f.name)}<span class="path">${T.source} › ${f.tab}</span></h4>${segHTML(f.segments)}</div>`).join('')}</div>
   <div class="stack">${w.example ? `<div class="expert"><div class="row between"><span class="label" style="margin:0">Expert’s golden answer · ${T.id}_Golden.xlsx</span><button data-act="own">Write my own instead</button></div>${segHTML(T.goldenSegments)}</div>` : `<div><span class="label">Your golden answer</span><textarea data-f="deliverable" placeholder="Quarter totals, with the source tab for each. Before or after the $12,000 credit? What can’t the records split?" aria-label="Your golden answer">${esc(w.deliverable)}</textarea></div><div class="row"><button data-act="example">Fill in the expert’s answer</button><span class="small">Loads the real golden answer and rubric, for a quick run-through.</span></div>`}</div></div>`; },

 // 4 · Rubric and submit
 4: () => { const w = work(), total = points(w.rubric), errors = validateSubmission({name:'Pod', deliverable:w.deliverable, rubric:w.rubric});
  return `<div class="table-card"><div class="scroll"><table class="rubric"><thead><tr><th>#</th><th>What a correct answer must do</th><th class="n">Points</th><th class="c">Must-pass</th><th></th></tr></thead><tbody>${w.rubric.map((r, i) => `<tr><td>${i + 1}</td><td><input type="text" data-r="${i}" data-k="text" value="${esc(r.text)}" placeholder="A checkable requirement" aria-label="Criterion ${i + 1}"></td><td class="n"><input type="number" min="1" max="100" data-r="${i}" data-k="points" value="${esc(r.points)}" aria-label="Points for criterion ${i + 1}"></td><td class="c"><input type="checkbox" data-r="${i}" data-k="mustPass" ${r.mustPass ? 'checked' : ''} aria-label="Must-pass"></td><td><button data-act="del" data-i="${i}" aria-label="Remove criterion ${i + 1}">×</button></td></tr>`).join('')}</tbody></table></div>
  <div class="submitbar"><div class="row"><button data-act="add" ${w.rubric.length >= 20 ? 'disabled' : ''}>Add a criterion</button><button data-detail="help:criterion">What makes a good criterion?</button></div><div class="meter" id="sum">${meter(total)}</div></div>
  <div class="submitbar" style="background:#fff">${errors.length ? `<ul class="errors">${errors.map(e => `<li>${e}</li>`).join('')}</ul>` : '<span class="good">Format checks pass: every line is filled in and the points total 100.</span>'}<div class="row">${w.submitted ? '<span class="tag good">Submitted · ready to test an AI</span><button data-detail="sub:">View</button>' : ''}<button class="primary" data-act="submit" ${errors.length ? 'disabled' : ''}>${w.submitted ? 'Submit again' : 'Submit task'}</button></div></div></div>`; },

 // 5 · Model eval and rubric grading
 5: () => { if (!S.baseline) return `${real('Recorded results from the pilot runs, July 2026 · the replay animates each saved answer')}<div id="stage" class="launch"><h3>Three AI models get the same prompt and files you had.</h3><p class="sub">Watch one of them work, then see how all three scored on your rubric.</p><button class="primary big" data-act="run-baseline">▶ Run the models</button></div>`;
  const m = M();
  return `${real('Recorded results from the pilot runs, July 2026 · no model is called live')}
  <div class="models">${T.models.map((x, i) => `<button class="model ${i === S.model ? 'on' : ''} ${x.pass ? '' : 'fail'}" data-model="${i}">${ring(x.total, !x.pass)}<div><h3>${x.name}</h3>${verdict(x)}<p class="small" style="margin-top:6px">${x.pass ? `${x.total} of 100 points` : `Raw ${x.total}, but a must-pass check failed`}</p></div></button>`).join('')}</div>
  <div class="callout blue" style="margin-bottom:20px"><b>Two of three pass this short task.</b> ChatGPT got every number right but cited a spreadsheet tab that does not exist, so must-pass check O3 disqualifies it.</div>
  <div class="work"><div class="stack"><div><span class="label">Output · ${m.name}’s answer</span><div class="answer">${segHTML(m.segments)}</div></div><button data-act="rerun-baseline" style="align-self:flex-start">Replay ${m.name}’s run</button></div>
  <div class="table-card"><div class="scroll"><table id="grades"><thead><tr><th>Rubric check · ${m.name}</th><th class="n">Score</th></tr></thead><tbody>${T.rubric.map((r, i) => `<tr class="grade-row" data-row="${i}"><td><button class="linkish" data-detail="crit:${i}">${r.id} · ${esc(r.text)}</button> ${r.mustPass ? '<span class="tag bad">Must-pass</span>' : ''}</td><td class="n g">${S.graded ? pts(m, i) : '<span class="small">…</span>'}</td></tr>`).join('')}</tbody></table></div><div class="submitbar" id="grade-total">${S.graded ? gradeTotal() : '<button class="primary" data-act="grade">Grade with the rubric</button>'}</div></div></div>`; },

 // 6 · The catch: the same judgment inside the combined task (real L1-04-06 results)
 6: () => { const c = T.catch, chip = m => m.void ? `<span class="tag bad">${m.name} · voided</span>` : `<span class="tag ${m.score >= 90 ? 'good' : ''}">${m.name} · ${m.score}</span>`;
  return `${real('Recorded results from the pilot runs, July 2026')}
  <div class="gap-head"><div class="card"><span class="label">On its own · ${T.id}</span><h3>${T.name}</h3><p>1–3 hours</p><div class="row" style="margin-top:12px">${T.models.map(m => m.pass ? `<span class="tag good">${m.name} · ${m.total}</span>` : `<span class="tag bad">${m.name} · disqualified</span>`).join('')}</div></div><div class="arrow">→</div>
  <div class="card dark"><span class="label">Inside the bigger job · ${c.id}</span><h3>${c.name}</h3><p>All five small tasks combined into one board-inputs workbook, with the same quarterly numbers inside.</p><div class="row" style="margin-top:12px">${c.models.map(chip).join('')}</div></div></div>
  ${S.gap ? `<div class="table-card reveal"><div class="scroll"><table><thead><tr><th>Check inside the combined task</th><th class="n">Pts</th>${c.models.map(m => `<th class="c">${m.name}</th>`).join('')}</tr></thead><tbody>${c.checks.map(k => `<tr class="${/Fulfillment/.test(k.area) ? 'same' : ''}"><td>${k.id} · ${esc(k.text)} ${k.mustPass ? '<span class="tag bad">Must-pass</span>' : ''}<div class="small">${esc(k.area)}</div></td><td class="n">${k.points}</td>${k.met.map(ok => `<td class="c">${mark(ok)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>
  <div class="callout" style="margin-top:18px"><b>Gemini got the quarterly numbers right on their own (91/100). Inside the combined task, it got those same numbers wrong and could not trace its sources, so it was voided.</b> Every model lost points once the job got longer.</div>` : '<button class="primary big" data-act="gap">Show what happened inside the bigger job</button>'}`; },

 // 7 · Preview the expert-curated dataset, then train on it
 7: () => { const rows = datasetParts();
  return `${sim('The dataset is real pilot data · the training run and reward values are illustrative')}
  <div class="work"><div class="stack"><div class="card"><span class="label">1 · The expert-curated dataset</span><h3>Everything the experts produced for this task</h3><p style="margin-bottom:12px">Packaged the way an AI lab receives it. Preview a few rows of each part.</p>
   <table class="ds"><thead><tr><th>Expert input</th><th class="n">Size</th><th>Used in training as</th></tr></thead><tbody>${rows.map(r => `<tr><td><b>${r.name}</b></td><td class="n">${r.size}</td><td><span class="dim">${r.use}</span></td></tr>`).join('')}</tbody></table>
   <div class="row" style="margin-top:14px"><button class="primary" data-detail="dataset:">Preview the dataset</button><span class="small">AI labs receive the full dataset. This view shows a sample.</span></div></div>
   <div class="card"><span class="label">2 · Train on it</span><p style="margin-bottom:12px">Every input above is a dimension of the training signal. Nothing the experts wrote is left out.</p><button class="primary big" data-act="train">${S.trained ? '↻ Train again' : '▶ Train on the expert dataset'}</button></div></div>
  <div class="stack"><div class="curve-card"><div class="row between"><span class="label" style="margin:0">Reward on the long task</span><span class="small" id="train-status">${S.trained ? 'Training complete · checkpoint saved' : 'Not started'}</span></div><svg class="curve" viewBox="0 0 100 100" preserveAspectRatio="none" aria-label="Reward during training">${[25, 50, 75].map(y => `<line x1="0" x2="100" y1="${y}" y2="${y}"/>`).join('')}<polygon id="area" points="${S.trained ? area(curvePoints(60)) : ''}"/><polyline id="curve" points="${S.trained ? curvePoints(60) : ''}"/></svg><div class="row between small"><span>Start</span><span>Training steps →</span></div></div>
   <div class="card"><span class="label">The training signal</span><div class="signals ${S.trained ? 'on' : ''}" id="signals">${rows.map(r => `<div class="signal"><span class="pip"></span><div><b>${r.short}</b><div class="small">${r.use}</div></div></div>`).join('')}</div></div></div></div>`; },

 // 8 · After training: trained run and re-evaluation
 8: () => { if (!S.trained) return `<div class="launch"><h3>Train the model first.</h3><button data-go="7" class="primary">Go to training</button></div>`;
  const a = gapScore(c => c.models[0]), b = gapScore(c => c.trained);
  return `${sim('Pre-built checkpoint, recorded replay, illustrative scores')}<div class="work"><div class="stack"><div><span class="label">The agent on the long task · before training</span><pre>${esc(L2GAP.before)}</pre></div>${S.trainedRun ? `<div><span class="label">The agent on the long task · after training</span><pre>${esc(L2GAP.after)}</pre></div><button data-act="rerun-trained" style="align-self:flex-start">Replay the trained run</button>` : '<div id="stage" class="launch"><h3>Same agent, after training, on the long task.</h3><button class="primary big" data-act="run-trained">▶ Run the trained agent</button></div>'}</div>
  ${S.trainedRun ? `<div class="stack"><div class="card hot"><span class="label">Gap checks · illustrative</span><div class="big-stat">${b.earned}<small>/${b.total}</small></div><p style="margin-top:6px">Up from ${a.earned} before training.</p><div class="bars" style="margin-top:16px"><div class="bar"><span>Before</span><div class="track"><span class="before" style="width:${a.pct}%"></span></div><span>${a.earned}/${a.total}</span></div><div class="bar"><span>After</span><div class="track"><span class="after" style="width:${b.pct}%"></span></div><span>${b.earned}/${b.total}</span></div></div></div>
   <div class="table-card"><table><thead><tr><th>Check</th><th class="c">Before</th><th class="c">After</th></tr></thead><tbody>${L2GAP.checks.map(c => `<tr><td>${esc(c.text)}</td><td class="c">${mark(c.models[0])}</td><td class="c">${mark(c.trained)}</td></tr>`).join('')}</tbody></table></div></div>` : '<div></div>'}</div>`; },

 // 9 · Recap
 9: () => `<p class="big">${esc(STEPS[8].say)}</p><div class="loop">${[[3, 'Create a task', 'You wrote the golden answer and rubric'], [5, 'Evaluate', 'Two of three models passed'], [6, 'Find the gap', 'Long tasks break them'], [7, 'Train', 'Learn from graded attempts'], [8, 'Evaluate again', 'The gap closes']].map(([n, l, d], i) => `<button data-go="${n}"><small>${i + 1} · ${l}</small>${d}</button>`).join('')}</div>`
};

const meter = total => `<span>${total} of 100 points</span><div class="track"><span class="${total === 100 ? 'after' : 'before'}" style="width:${Math.min(100, total)}%;animation:none"></span></div><b class="${total === 100 ? 'good' : 'bad'}">${total === 100 ? 'Ready' : `${100 - total > 0 ? 100 - total + ' to go' : total - 100 + ' over'}`}</b>`;
const datasetParts = () => { const w = work(), gates = T.rubric.filter(r => r.mustPass).length, goldRows = T.goldenSegments.reduce((n, s) => n + (s.rows ? s.rows.length : 0), 0);
 return [
  {name:'Task prompt and source files', short:'Environment', size:`1 prompt · ${T.files.length} tabs`, use:'The environment: what the model reads and works from'},
  {name:'Golden answer', short:'Golden answer', size:`${goldRows} rows`, use:'What good looks like: the reference every attempt is judged against'},
  {name:'Rubric criteria and weights', short:'Reward', size:`${T.rubric.length} checks · 100 pts`, use:'The reward: points earned on each check'},
  {name:'Must-pass gates', short:'Hard limits', size:`${gates} gates`, use:'Hard limits: missing one zeroes the reward'},
  {name:'Graded attempts', short:'Training examples', size:`${T.models.length} runs · ${T.models.length * T.rubric.length} grades`, use:'Training examples: attempts paired with their check-by-check grades'},
  {name:'Grader notes', short:'Feedback', size:`${T.rubric.filter(r => r.note).length} notes`, use:'Feedback: why each check was met or missed'},
  ...(w.submitted && !w.example ? [{name:'Your pod’s golden answer and rubric', short:'Your expertise', size:`${w.rubric.length} checks`, use:'More expert data, added to the set'}] : [])]; };
const gradeTotal = () => { const m = M(); return `<b>${m.name}: ${m.total}/100</b><span>${m.pass ? '<span class="good">Every must-pass check met, so the attempt passes.</span>' : `<span class="bad">Must-pass ${m.failed.join(', ')} failed, so the attempt is disqualified.</span>`}</span>`; };
const rubricTable = rows => `<table><tbody>${rows.map(r => `<tr><td>${esc(r.text)} ${r.mustPass ? '<span class="tag bad">Must-pass</span>' : ''}</td><td class="n">${r.points}</td></tr>`).join('')}</tbody></table>`;
// Detail panel content for clickable items. key is "kind:id".
function detail(key) {
 const [kind, id] = [key.slice(0, key.indexOf(':')), key.slice(key.indexOf(':') + 1)], w = work();
 if (kind === 'dataset') { const N = 3, more = (n, of) => `<p class="small" style="margin:6px 0 16px">Showing ${Math.min(n, of)} of ${of} rows.</p>`;
  const g = T.goldenSegments.find(x => x.rows), src = T.files[1].segments.find(x => x.rows);
  const tbl = (head, rows) => `<div class="tbl"><table class="data wrap"><thead><tr>${head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td class="${isNum(String(c)) ? 'n' : ''}">${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  return ['Expert dataset · preview', `<p style="margin-bottom:16px">A sample of the expert-curated data for ${T.id}. AI labs receive the full set; it is not downloadable here.</p>
   <span class="label">Task prompt</span><p class="small" style="margin-bottom:16px">${esc(T.brief)}</p>
   <span class="label">Source file · ${T.files[1].tab}</span>${tbl(src.header.slice(0, 6), src.rows.slice(0, N).map(r => r.slice(0, 6)))}${more(N, src.rows.length)}
   <span class="label">Golden answer</span>${tbl(g.header.slice(0, 4), g.rows.slice(0, N).map(r => r.slice(0, 4)))}${more(N, g.rows.length)}
   <span class="label">Rubric</span>${tbl(['Check', 'Points', 'Must-pass'], T.rubric.slice(0, N).map(r => [`${r.id} · ${r.text}`, r.points, r.mustPass ? 'Yes' : 'No']))}${more(N, T.rubric.length)}
   <span class="label">Graded attempts</span>${tbl(['Model', ...T.rubric.slice(0, N).map(r => r.id), 'Total'], T.models.map(m => [m.name, ...m.scores.slice(0, N), m.pass ? m.total : `${m.total} (disqualified)`]))}<p class="small" style="margin-top:6px">Showing ${N} of ${T.rubric.length} checks per attempt.</p>`]; }
 if (kind === 'mandate') { const m = MANDATE[+id]; return [`${m.label}: ${m.value}`, `<p>${esc(m.detail)}</p>`]; }
 if (kind === 'help') return HELP[id];
 if (kind === 'task') { const [n, name, desc] = TASKS.find(t => t[0] === id); return [`L2 task · ${name}`, `<p>${desc}</p><p style="margin-top:10px">A standalone 10–20 hour department task with its own prompt, golden answer, and rubric. Experts have already completed it.</p>`]; }
 if (kind === 'l1') { const t = T.siblings[+id]; return [`${t.id} · ${t.name}`, t.today ? `<p><b>Your task today.</b> ${T.brief}</p>` : '<p>A 1–3 hour itemized task inside L2-04, with its own prompt, golden answer, rubric, and three recorded model runs. Experts have already completed it.</p>']; }
 if (kind === 'sub') return [`Submitted task · ${T.name}`, `<span class="label">Golden answer${w.example ? ' · expert’s answer' : ''}</span>${w.example ? segHTML(T.goldenSegments) : `<pre>${esc(w.deliverable)}</pre>`}<br><span class="label">Rubric · ${w.rubric.length} criteria</span>${rubricTable(w.rubric)}`];
 if (kind === 'crit') { const r = T.rubric[+id]; return [`${r.id} · ${r.text}`, `<p>${r.points} points${r.mustPass ? ' · <span class="tag bad">Must-pass</span>' : ''}</p><p style="margin-top:10px"><b>Expected:</b> ${esc(r.expected)}</p><table style="margin-top:12px"><tbody>${T.models.map(m => `<tr><td>${m.name}</td><td class="n">${pts(m, +id)}</td></tr>`).join('')}</tbody></table>${r.note ? `<p class="small" style="margin-top:10px">Grader’s note: ${esc(r.note)}</p>` : ''}`]; }
 if (id === 'traces') return ['Graded attempts', '<p>Each time the agent tries the department-level task, the rubric grades its answer check by check. The prompt, the answer, and those grades form one training example. Reinforcement learning uses thousands of them, with no human grading in the loop.</p>'];
 if (id === 'golden') return ['Expert golden answers', `<p style="margin-bottom:10px">Every task carries an expert’s correct answer. This is the one for ${T.id}:</p>${segHTML(T.goldenSegments)}`];
 return ['Rubrics, used as the reward', `<p style="margin-bottom:10px">Each attempt is graded with a rubric like this one. The points earned are the reward the model learns to maximize.</p>${rubricTable(w.submitted ? w.rubric : T.rubric)}`];
}

// Illustrative score curve from the before score to the after score on the gap checks.
function curvePoints(n) {
 const lo = gapScore(c => c.models[0]).pct, hi = gapScore(c => c.trained).pct;
 return Array.from({length:n}, (_, i) => { const t = i / 59, y = lo + (hi - lo) * (1 - Math.exp(-4 * t)) / (1 - Math.exp(-4)) + Math.sin(i * 1.7) * 3 * (1 - t); return `${(t * 100).toFixed(1)},${(100 - y).toFixed(1)}`; }).join(' ');
}
const area = pts => pts ? `${pts} ${pts.split(' ').pop().split(',')[0]},100 0,100` : '';
function train() {
 const id = ++runId; let n = 0; S.trained = false;
 (function step() { if (id !== runId || !$('#curve')) return; n += 1; const p = curvePoints(n); $('#curve').setAttribute('points', p); $('#area').setAttribute('points', area(p)); $('#train-status').textContent = `Training step ${fmt(n * 50)} of 3,000`;
  $('#signals')?.classList.add('on'); if (n < 60) return setTimeout(step, 150); S.trained = true; S.trainedRun = false; save(); render(); })();
}
// Fills in the score column one check at a time.
function grade() {
 const id = ++runId; let i = 0; $('#grade-total').innerHTML = '<span class="small">Grading…</span>';
 (function step() { if (id !== runId || !$('#grades')) return;
  if (i < T.rubric.length) { const row = $(`#grades [data-row="${i}"]`); row.querySelector('.g').innerHTML = pts(M(), i); row.classList.add('flash'); i++; return setTimeout(step, 380); }
  S.graded = true; save(); $('#grade-total').innerHTML = gradeTotal(); })();
}
function replay(trained) {
 const id = ++runId, text = trained ? L2GAP.after : M().answer;
 const acts = trained ? [{label:`Read the department task: ${L2GAP.name}, full year`}, {label:'Open 12 months of records'}, {label:'Open the source tabs', doc:T.files[0].body}, {label:'Match each month and quarter'}, {label:'Carry open items forward'}, {label:'Write the year-end schedule'}]
  : [{label:`Read the task: ${T.question}`}, ...T.files.map(f => ({label:`Open ${f.ref} · ${f.name}`, doc:f.body})), {label:'Decide: before or after the $12,000 credit?'}, {label:'Write the Fulfillment_Shipping_by_Q tab'}];
 $('#stage').outerHTML = `<div id="stage">${screen(trained ? 'Trained agent · L2-04' : `${M().name} · ${T.id}`, `<div><span class="label">Input</span><ol id="log"></ol><pre class="peek" id="doc" hidden></pre></div><div><span class="label">Output · the model’s answer</span><pre id="out" class="wide"></pre></div>`)}</div>`;
 let i = 0, n = 0;
 (function step() { if (id !== runId || !$('#log')) return;
  if (i < acts.length) { const a = acts[i++]; $('#log').insertAdjacentHTML('beforeend', `<li>${esc(a.label)}</li>`); if (a.doc) { $('#doc').hidden = false; $('#doc').textContent = a.doc; } return setTimeout(step, 850); }
  n += 4; $('#out').textContent = text.slice(0, n); if (n < text.length) return setTimeout(step, 18);
  S[trained ? 'trainedRun' : 'baseline'] = true; save(); setTimeout(() => id === runId && render(), 900); })();
}
function updateSum() { const el = $('#sum'); if (el) el.innerHTML = meter(points(work().rubric)); }
// Counts the numbers on step 1 up from zero.
function countUp() {
 if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
 document.querySelectorAll('[data-count]').forEach(el => { const to = +el.dataset.count, t0 = performance.now();
  (function f(t) { const k = Math.min(1, (t - t0) / 1100), e = 1 - Math.pow(1 - k, 3); el.textContent = fmt(Math.round(to * e)); if (k < 1) requestAnimationFrame(f); })(t0); });
}

// ---- Comments. Saved in this browser; "Copy all comments" puts them on the clipboard to paste into Slack.
let notes = {};
try { notes = JSON.parse(localStorage.getItem(NOTES_KEY)) || {}; } catch {}
const saveNotes = () => { try { localStorage.setItem(NOTES_KEY, JSON.stringify(notes)); } catch {} };
const noteCount = () => Object.values(notes).filter(v => v?.trim()).length;
const notesText = () => STEPS.map((s, i) => notes[i + 1]?.trim() ? `Step ${i + 1} · ${s.title}\n${notes[i + 1].trim()}` : '').filter(Boolean).join('\n\n');
function renderNotes() {
 $('#notes-btn').textContent = noteCount() ? `Comments (${noteCount()})` : 'Comment';
 if ($('#notes-panel').hidden) return;
 $('#note-step').textContent = `Step ${S.step} · ${STEPS[S.step - 1].title}`;
 $('#note-text').value = notes[S.step] || '';
}

let shown = 0;
function render() {
 runId++; const s = STEPS[S.step - 1], next = STEPS[S.step];
 $('#steps').innerHTML = STEPS.map((x, i) => `<button data-go="${i + 1}" class="${i + 1 === S.step ? 'current' : i + 1 < S.step ? 'done' : ''}${notes[i + 1]?.trim() ? ' noted' : ''}" aria-label="Step ${i + 1}: ${esc(x.title)}" ${i + 1 === S.step ? 'aria-current="step"' : ''}><span class="dot">${i + 1 < S.step ? '✓' : i + 1}</span><span class="lbl">${esc(x.short)}</span></button>`).join('');
 $('#main').innerHTML = `<div class="lede"><span class="eyebrow">Step ${S.step} of ${STEPS.length} · ${s.act}</span><h1>${esc(s.title)}</h1><p class="sub">${esc(s.sub)}</p></div>${views[S.step]()}`;
 if (shown !== S.step) { $('#main').classList.remove('enter'); void $('#main').offsetWidth; $('#main').classList.add('enter'); if (S.step === 1) countUp(); shown = S.step; }
 $('#prev').disabled = S.step === 1; $('#next').disabled = !next; $('#next').textContent = next ? `Next: ${next.short} →` : 'Done';
 $('#where').textContent = `${s.act} · ${s.time}`;
 renderNotes();
}
function go(n) { S.step = Math.min(STEPS.length, Math.max(1, n)); save(); render(); scrollTo({top:0}); }

document.addEventListener('click', e => {
 const t = e.target.closest('button'); if (!t) return; const d = t.dataset, w = work();
 if (t.id === 'play') return demo.playing ? stopDemo() : startDemo();
 if (e.isTrusted && demo.playing && !t.closest('#notes-panel')) stopDemo(); // a real click takes over from the runthrough
 if (t.id === 'prev') return go(S.step - 1);
 if (t.id === 'next') return go(S.step + 1);
 if (t.id === 'reset') { $('#confirm').hidden = false; return; }
 if (t.id === 'reset-no') { $('#confirm').hidden = true; return; }
 if (t.id === 'reset-yes') { S = blank(); save(); $('#confirm').hidden = true; shown = 0; return render(); }
 if (t.id === 'notes-btn') { $('#notes-panel').hidden = !$('#notes-panel').hidden; return renderNotes(); }
 if (t.id === 'notes-close') { $('#notes-panel').hidden = true; return; }
 if (t.id === 'notes-copy') { const text = notesText() || 'No comments yet.'; const fallback = () => { $('#notes-all').hidden = false; $('#notes-all').value = text; $('#notes-all').select(); $('#notes-status').textContent = 'Select all and copy the text above.'; };
  try { navigator.clipboard.writeText(text).then(() => { $('#notes-status').textContent = 'Copied. Paste it into Slack.'; }, fallback); } catch { fallback(); } return; }
 if (d.act === 'close-detail') return $('#detail').close();
 if (d.detail) { const [title, body] = detail(d.detail); $('#detail-title').textContent = title; $('#detail-body').innerHTML = body; if (!$('#detail').open) $('#detail').showModal(); return; }
 if (d.go) { $('#detail').close(); return go(+d.go); }
 if (d.src) { S.src = d.src; S.file = 0; }
 else if (d.file) S.file = +d.file;
 else if (d.model) S.model = +d.model;
 else if (d.act === 'reveal') S.revealed = true;
 else if (d.act === 'open-l2') S.openL2 = true;
 else if (d.act === 'add') w.rubric.push({text:'', points:'', mustPass:false});
 else if (d.act === 'del') w.rubric.splice(+d.i, 1);
 else if (d.act === 'own') Object.assign(w, {deliverable:'', example:false, submitted:false});
 else if (d.act === 'example') Object.assign(w, {deliverable:T.golden, rubric:T.rubric.map(r => ({text:r.text, points:r.points, mustPass:r.mustPass})), example:true, submitted:false});
 else if (d.act === 'submit') w.submitted = true;
 else if (d.act === 'grade') return grade();
 else if (d.act === 'gap') S.gap = true;
 else if (d.act === 'train') { save(); render(); return train(); }
 else if (d.act === 'run-baseline') return replay(false);
 else if (d.act === 'run-trained') return replay(true);
 else if (d.act === 'rerun-baseline') { S.baseline = false; render(); return replay(false); }
 else if (d.act === 'rerun-trained') { S.trainedRun = false; render(); return replay(true); }
 else return;
 save(); render();
});
// Typing saves without re-rendering, so focus and cursor position are kept.
document.addEventListener('input', e => {
 const d = e.target.dataset, w = work();
 if (e.target.id === 'note-text') { notes[S.step] = e.target.value; saveNotes(); $('#notes-status').textContent = 'Saved in this browser.'; $('#notes-btn').textContent = noteCount() ? `Comments (${noteCount()})` : 'Comment'; $(`#steps [data-go="${S.step}"]`)?.classList.toggle('noted', !!e.target.value.trim()); return; }
 if (d.f) { w[d.f] = e.target.value; w.example = false; w.submitted = false; }
 else if (d.r) { w.rubric[+d.r][d.k] = e.target.type === 'checkbox' ? e.target.checked : e.target.value; w.example = false; w.submitted = false; updateSum(); }
 else return;
 save();
});
document.addEventListener('keydown', e => {
 if ($('#detail').open || e.target.matches('input,textarea') || e.metaKey || e.ctrlKey || e.altKey) return;
 if (demo.playing && e.key.startsWith('Arrow')) stopDemo();
 if (e.key === 'ArrowRight') go(S.step + 1); else if (e.key === 'ArrowLeft') go(S.step - 1);
});

// ---- Demo runthrough. It presses the same controls a person would, so it follows the same rules as a manual run.
const DEMO_SPEED = 1;
const demo = {id:0, playing:false, done:false};
const DEMO = [
 {say:'Meet the company: a year of real records, by department', run:async d => { await d.wait(2500); await d.click('[data-src="d8"]', 2600); await d.click('[data-src="s0"]', 3000); }},
 {say:'Break the 100-hour job down to the task you will do', run:async d => { await d.wait(1800); await d.click('[data-act="reveal"]', 1600); await d.click('[data-act="open-l2"]', 2800); }},
 {say:'Write the golden answer from the source tabs', run:async d => { await d.click('[data-act="example"]', 3200); }},
 {say:'Write the rubric, then submit the task', run:async d => { await d.wait(2200); await d.click('[data-act="submit"]', 2200); }},
 {say:'Three AI models try your task: two pass, one is disqualified', run:async d => { await d.click('[data-act="run-baseline"]'); await d.until(() => S.baseline); await d.wait(1600); await d.click('[data-act="grade"]'); await d.until(() => S.graded); await d.wait(1600); await d.click('[data-model="0"]', 2600); }},
 {say:'The catch: the same numbers inside a bigger job', run:async d => { await d.wait(1500); await d.click('[data-act="gap"]', 4500); }},
 {say:'Preview the expert data, then train on all of it', run:async d => { await d.wait(1500); await d.click('[data-detail="dataset:"]', 3200); await d.click('[data-act="close-detail"]', 500); await d.click('[data-act="train"]'); await d.until(() => S.trained); await d.wait(1500); }},
 {say:'After training: the long task, graded again', run:async d => { await d.click('[data-act="run-trained"]'); await d.until(() => S.trainedRun); await d.wait(4000); }},
 {say:'Recap: create, evaluate, find the gap, train, evaluate again', run:async d => { await d.wait(5000); }}
];
function demoBar(i) {
 $('#demo-bar').hidden = !demo.playing;
 $('#play').textContent = demo.playing ? '■ Stop demo' : demo.done ? '↻ Replay demo' : '▶ Play demo';
 if (i === undefined) return;
 $('#demo-say').textContent = DEMO[i].say; $('#demo-count').textContent = `${i + 1} / ${DEMO.length}`; $('#demo-fill').style.width = `${(i + 1) / DEMO.length * 100}%`;
}
function stopDemo() { demo.id++; demo.playing = false; document.querySelectorAll('.demo-target').forEach(el => el.classList.remove('demo-target')); demoBar(); }
async function startDemo() {
 const id = ++demo.id; demo.playing = true; demo.done = false; $('#detail').close(); S = blank(); save(); shown = 0;
 const wait = ms => new Promise((res, rej) => setTimeout(() => id === demo.id ? res() : rej('stopped'), ms / DEMO_SPEED));
 const d = {wait,
  async click(sel, after = 0, before = 700) { const el = $(sel); if (!el) return; el.scrollIntoView({block:'center', behavior:'smooth'}); el.classList.add('demo-target'); await wait(before); el.classList.remove('demo-target'); el.click(); await wait(after); },
  async until(done) { for (let n = 0; n < 600 && !done(); n++) await wait(100 * DEMO_SPEED); }};
 try { for (let i = 0; i < DEMO.length; i++) { go(i + 1); demoBar(i); await DEMO[i].run(d); } demo.done = true; } catch (stopped) { if (stopped !== 'stopped') throw stopped; return; }
 demo.playing = false; demoBar();
}
// The narrative page links to a step with #step-N.
const linked = location.hash.match(/^#step-(\d+)$/); if (linked) S.step = Math.min(STEPS.length, Math.max(1, +linked[1]));
if (!views[S.step]) S.step = 1;
render();
if (new URLSearchParams(location.search).has('demo')) startDemo(); // share link: ?demo starts the runthrough
