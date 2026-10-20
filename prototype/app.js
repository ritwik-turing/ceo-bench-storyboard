'use strict';
/* CEO Bench live demo prototype v3. Company data comes from the real corpus (corpus.js). Today's task, its rubric,
   and the three model results are the real L1-04-01 pilot records (l1.js). The L2 gap, training, and re-evaluation
   are illustrative (AFTER in data.js). No model is called live. */
const $ = s => document.querySelector(s);
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const KEY = 'ceo-bench-demo-v3', NOTES_KEY = 'ceo-bench-comments-v3';
const T = TASK;
const blank = () => ({step:1, model:1, prompt:null, editPrompt:false, src:'d2', file:0, revealed:false, openL2:false, gap:false, work:null, baseline:false, graded:false, trained:false, trainedRun:false});
let S = blank();
try { S = Object.assign(blank(), JSON.parse(localStorage.getItem(KEY))); } catch {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} };
let runId = 0; // cancels a running replay, grading, or training animation when the view changes

const work = () => S.work ??= {deliverable:'', rubric:Array.from({length:10}, () => ({text:'', points:'', mustPass:false})), submitted:false, example:false};
const points = rows => rows.reduce((n, r) => n + (Number(r.points) || 0), 0);
const fmt = n => n.toLocaleString('en-US');
const M = () => T.models[S.model] || T.models[0];
// Full label for a pilot run, e.g. "Claude Opus 5.5 (xhigh) with Claude Code". Missing parts read "to confirm".
const cfg = n => MODEL_CONFIG[n] || {};
const label = n => { const c = cfg(n); return `${c.model || `${n} (version to confirm)`} (${c.effort || 'effort to confirm'}) with ${c.harness || 'harness to confirm'}`; };
const labelHTML = n => { const c = cfg(n); return `${esc(c.model || n)}<span class="cfg">${esc(c.effort || 'effort to confirm')} · with ${esc(c.harness || 'harness to confirm')}${c.model ? '' : ' · version to confirm'}</span>`; };
const sim = text => `<div class="sim">${text}</div>`;
const real = text => `<div class="sim real">${text}</div>`;
const mark = ok => `<span class="mark ${ok ? 'y' : 'n'}" aria-label="${ok ? 'Met' : 'Not met'}">${ok ? '✓' : '✕'}</span>`;
const pts = (m, i) => { const r = T.rubric[i], got = m.scores[i]; return `<span class="${got === r.points ? 'good' : got === 0 ? 'bad' : ''}">${got}/${r.points}</span>`; };
const ring = (value, fail) => { const c = 2 * Math.PI * 30; return `<div class="ring ${fail ? 'fail' : ''}"><svg viewBox="0 0 76 76"><circle class="bg" cx="38" cy="38" r="30"/><circle class="fg" cx="38" cy="38" r="30" stroke-dasharray="${(value / 100 * c).toFixed(1)} ${c.toFixed(1)}"/></svg><span>${value}</span></div>`; };
const verdict = m => m.pass ? '<span class="tag good">Passes</span>' : `<span class="tag bad">Disqualified · ${m.failed.join(', ')}</span>`;
const KIND = {xlsx:'spreadsheets', docx:'documents', doc:'documents', pdf:'PDFs', pptx:'slide decks', csv:'data exports', json:'data exports', png:'images'};
const kinds = k => Object.entries(Object.entries(k).reduce((a, [x, n]) => (a[KIND[x] || 'other files'] = (a[KIND[x] || 'other files'] || 0) + n, a), {})).map(([x, n]) => `${n} ${x}`).join(' · ');
// The task prompt: the shipped prompt once pasted in, otherwise the one reconstructed from the rubric.
const prompt = () => S.prompt || PROMPT_DEFAULT;
const tableText = t => t ? t.map(r => r.join(' | ')).join('\n') : '';
// The answer box is a small rich-text editor, so tables live inside the answer. Stored HTML is cleaned to text, paragraphs, and tables.
const ALLOWED = new Set(['P', 'DIV', 'BR', 'B', 'STRONG', 'I', 'EM', 'U', 'UL', 'OL', 'LI', 'TABLE', 'THEAD', 'TBODY', 'TR', 'TH', 'TD', 'SPAN']);
function cleanHTML(html) {
 const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html'), root = doc.body.firstChild;
 (function walk(n) { [...n.children].forEach(c => { if (!ALLOWED.has(c.tagName)) { c.replaceWith(...(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT'].includes(c.tagName) ? [] : c.childNodes)); return walk(n); }
  [...c.attributes].forEach(a => { if (!['colspan', 'rowspan'].includes(a.name)) c.removeAttribute(a.name); }); walk(c); }); })(root);
 return root.innerHTML;
}
const answerText = w => String(w.deliverable || '').trim();
const TABLE_HTML = '<table><thead><tr><th>Quarter</th><th>Fulfillment</th><th>Shipping</th><th>Total</th><th>Source tab</th></tr></thead><tbody>' + ['Q1', 'Q2', 'Q3', 'Q4', 'FY2021'].map(q => `<tr><td>${q}</td><td><br></td><td><br></td><td><br></td><td><br></td></tr>`).join('') + '</tbody></table><p><br></p>';
const segsToHTML = segs => segs.map(s => s.note ? `<p>${esc(s.note)}</p>` : `<table><thead><tr>${s.header.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${s.rows.map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`).join('');
const segsToText = segs => segs.map(s => s.note ? s.note : [s.header, ...s.rows].map(r => r.join('\t')).join('\n')).join('\n\n');
function saveAnswer() { const ed = $('#answer'); if (!ed) return; const w = work(); w.answerHTML = cleanHTML(ed.innerHTML); w.deliverable = ed.innerText.trim(); w.submitted = false; save(); }
// Inserts HTML at the caret inside the answer box, or at its end if the caret is elsewhere.
function insertIntoAnswer(html) {
 const ed = $('#answer'); if (!ed) return; const sel = getSelection();
 if (!sel.rangeCount || !ed.contains(sel.anchorNode)) { ed.focus(); const r = document.createRange(); r.selectNodeContents(ed); r.collapse(false); sel.removeAllRanges(); sel.addRange(r); }
 const range = sel.getRangeAt(0); range.deleteContents(); const frag = range.createContextualFragment(html), last = frag.lastChild; range.insertNode(frag);
 if (last) { const r = document.createRange(); r.setStartAfter(last); r.collapse(true); sel.removeAllRanges(); sel.addRange(r); }
 saveAnswer();
}
function caretCell() { const n = getSelection().anchorNode, el = n && (n.nodeType === 1 ? n : n.parentElement); return el && $('#answer')?.contains(el) ? el.closest('td,th') : null; }
// Step 4: errors and the Submit button update as you type.
function updateSubmit() {
 const box = $('#submit-status'); if (!box) return; const w = work(), errors = validateSubmission({deliverable:answerText(w), rubric:w.rubric}), bad = new Set(errors.map(e => (e.match(/^Row (\d+)/) || [])[1]).filter(Boolean).map(n => n - 1));
 box.innerHTML = submitStatus(errors); $('[data-act="submit"]').disabled = errors.length > 0;
 document.querySelectorAll('.rubric tbody tr').forEach((tr, i) => tr.classList.toggle('bad-row', bad.has(i)));
}
const submitStatus = errors => errors.length ? `<ul class="errors">${errors.map(e => `<li>${e}${/golden answer/.test(e) ? ' <button class="linkish" data-go="3">Go to step 3</button>' : ''}</li>`).join('')}</ul>` : '<span class="good">Format checks pass: every criterion has points and they total 100.</span>';
const isNum = c => /^-?\$?[\d,]+(\.\d+)?$/.test(c);
// Renders a sheet as notes and real tables. hl marks rows to highlight (e.g. the line the task is about).
const segHTML = (segs, hl = /Fulfillment|SLA credit|FY Total|FY2021/i) => segs.map(s => s.note ? `<p class="seg-note">${esc(s.note)}</p>` : `<div class="tbl"><table class="data ${s.header.length <= 3 ? 'wrap' : ''}"><thead><tr>${s.header.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${s.rows.map(r => `<tr class="${hl.test(r[0]) ? 'hl' : ''}">${r.map(c => `<td class="${isNum(c) ? 'n' : ''}">${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`).join('');
const screen = (title, body) => `<div class="screen"><div class="chrome"><i></i><i></i><i></i><b>${title}</b><span class="rec">Recorded run · replay</span></div><div class="screen-body">${body}</div></div>`;

// L2-04 takes Inventory & COGS's slot (first card of the second row), so it sits directly above its L1 tasks.
const l2Order = () => { const o = [...TASKS], a = o.findIndex(t => t[3] === TODAY), b = o.findIndex(t => /Inventory/.test(t[1])); [o[a], o[b]] = [o[b], o[a]]; return o; };
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
  <div class="tier l2 ${S.openL2 ? 'linked' : 'last'}"><div class="lvl">L2<small>10–20h</small></div>${S.revealed ? `<div><div class="grid g5 reveal">${l2Order().map(([n, name, desc, pod]) => pod === TODAY
    ? `<button class="card l2-pick ${S.openL2 ? 'open' : ''}" data-act="open-l2"><span class="label">L2-04 · contains your task</span><h3>${today}</h3><p>Fulfillment, payables, and the Apex incident</p><span class="l2-count">${S.openL2 ? '6 L1 tasks shown below ▾' : 'Open to see its 6 L1 tasks ▸'}</span></button>`
    : `<button class="card l2-other" data-detail="task:${n}"><span class="label">Done by experts</span><h3>${name}</h3><p>${desc}</p></button>`).join('')}</div>${S.openL2 ? '' : '<p class="small" style="margin-top:12px">Every department task has its own small L1 tasks. Open the highlighted one, L2-04, to see the six inside it.</p>'}</div>` : `<div><button class="primary big" data-act="reveal">Break it into 10 department tasks</button></div>`}</div>
  ${S.openL2 ? `<div class="tier l1 last"><div class="lvl">L1<small>1–3h</small></div><div class="l1-panel reveal"><div class="l1-title">The 6 small tasks inside <b>L2-04 · ${today}</b></div><div class="l1-head"><span class="crumb">L3 · first external audit</span><span class="sep">›</span><span class="crumb on">L2-04 · ${today}</span><span class="sep">›</span><span class="crumb">6 L1 tasks</span></div><div class="grid g3">${T.siblings.map((t, i) => `<button class="card ${t.today ? 'today' : ''}" data-detail="l1:${i}"><span class="label">${t.id} · ${t.today ? 'Your task today' : 'Done by experts'}</span><h3>${t.name}</h3></button>`).join('')}</div></div></div>` : ''}`; },

 // 3 · Golden answer: the prompt (replaceable with the shipped one), the source tabs, and an answer box with an optional table
 3: () => { const w = work();
  const promptCard = S.editPrompt
   ? `<div class="task-card"><span class="label">Task prompt · ${T.id}</span><textarea id="prompt-edit" style="min-height:180px" aria-label="Task prompt">${esc(prompt())}</textarea><div class="row" style="margin-top:10px"><button class="primary" data-act="prompt-save">Save prompt</button><button data-act="prompt-cancel">Cancel</button>${S.prompt ? '<button data-act="prompt-reset">Use the reconstructed prompt</button>' : ''}</div></div>`
   : `<div class="task-card"><div class="row between"><span class="label" style="margin:0">Task prompt · ${T.id}</span><button data-act="prompt-edit">${S.prompt ? 'Edit prompt' : 'Replace with the original prompt'}</button></div><p style="margin-top:8px;white-space:pre-wrap">${esc(prompt())}</p><p class="small" style="margin-top:8px">${S.prompt ? 'Original prompt, pasted in.' : 'Reconstructed from the rubric. Paste the shipped prompt to replace it.'}</p></div>`;
  return `<div class="work"><div class="stack">${promptCard}
   ${T.files.map(f => `<div class="source"><h4><span class="ref">${f.ref}</span>${esc(f.name)}<span class="path">${T.source} › ${f.tab}</span></h4>${segHTML(f.segments)}</div>`).join('')}</div>
   <div class="stack"><div class="row between"><span class="label" style="margin:0">Your golden answer</span><button data-act="see-expert">See expert’s answer</button></div>
    <div class="editor-wrap"><div class="editor-tools" role="toolbar" aria-label="Answer tools"><button data-act="ins-table">+ Table</button><button data-act="ins-row">+ Row</button><button data-act="ins-col">+ Column</button><span class="small">Tables go where your cursor is.</span></div>
    <div id="answer" class="editor" contenteditable="true" role="textbox" aria-multiline="true" aria-label="Your golden answer" data-ph="Your findings, with the source tab for each. Before or after the $12,000 credit? What can’t the records split?">${w.answerHTML || esc(w.deliverable || '')}</div></div></div></div>`; },

 // 4 · Rubric and submit
 4: () => { const w = work(), total = points(w.rubric), errors = validateSubmission({deliverable:answerText(w), rubric:w.rubric}), bad = new Set(errors.map(e => (e.match(/^Row (\d+)/) || [])[1]).filter(Boolean).map(n => n - 1));
  return `<div class="table-card"><div class="scroll"><table class="rubric"><thead><tr><th>#</th><th>What a correct answer must do</th><th class="n">Points</th><th class="c">Must-pass</th><th></th></tr></thead><tbody>${w.rubric.map((r, i) => `<tr class="${bad.has(i) ? 'bad-row' : ''}"><td>${i + 1}</td><td><input type="text" data-r="${i}" data-k="text" value="${esc(r.text)}" placeholder="A checkable requirement" aria-label="Criterion ${i + 1}"></td><td class="n"><input type="number" min="1" max="100" data-r="${i}" data-k="points" value="${esc(r.points)}" aria-label="Points for criterion ${i + 1}"></td><td class="c"><input type="checkbox" data-r="${i}" data-k="mustPass" ${r.mustPass ? 'checked' : ''} aria-label="Must-pass"></td><td><button data-act="del" data-i="${i}" aria-label="Remove criterion ${i + 1}">×</button></td></tr>`).join('')}</tbody></table></div>
  <div class="submitbar"><div class="row"><button data-act="add" ${w.rubric.length >= 20 ? 'disabled' : ''}>Add a criterion</button><span class="small">3 to 20 criteria. Blank rows are ignored.</span><button data-detail="help:criterion">What makes a good criterion?</button><button data-act="expert-rubric">Use the expert’s rubric</button></div><div class="meter" id="sum">${meter(total)}</div></div>
  <div class="submitbar" style="background:#fff"><div id="submit-status">${submitStatus(errors)}</div><div class="row">${w.submitted ? '<span class="tag good">Submitted · ready to test an AI</span><button data-detail="sub:">View</button>' : ''}<button class="primary" data-act="submit" ${errors.length ? 'disabled' : ''}>${w.submitted ? 'Submit again' : 'Submit task'}</button></div></div></div>`; },

 // 5 · Model eval and rubric grading
 5: () => { if (!S.baseline) return `${real('Recorded results from the pilot runs, July 2026 · the replay animates each saved answer')}<div id="stage" class="launch"><h3>All three agents get the same prompt and files you had.</h3><p class="sub">Watch one of them work, then see how all three scored on your rubric.</p><button class="primary big" data-act="run-baseline">▶ Run the agents</button></div>`;
  const m = M();
  return `${real('Recorded results from the pilot runs, July 2026 · no model is called live')}
  <div class="models">${T.models.map((x, i) => `<button class="model ${i === S.model ? 'on' : ''} ${x.pass ? '' : 'fail'}" data-model="${i}">${ring(x.total, !x.pass)}<div><h3>${labelHTML(x.name)}</h3>${verdict(x)}<p class="small" style="margin-top:6px">${x.pass ? `${x.total} of 100 points` : `Raw ${x.total}, but a must-pass check failed`}</p></div></button>`).join('')}</div>
<div class="callout blue" style="margin-bottom:20px"><b>Two of three pass this short task.</b> ${cfg('ChatGPT').model || 'ChatGPT'} got every number right but cited a spreadsheet tab that does not exist, so must-pass check O3 disqualifies it.</div>
  <div class="work"><div class="stack"><div><span class="label">Output · ${esc(label(m.name))}</span><div class="answer">${segHTML(m.segments)}</div></div><button data-act="rerun-baseline" style="align-self:flex-start">Replay ${m.name}’s run</button></div>
  <div class="table-card"><div class="scroll"><table id="grades"><thead><tr><th>Rubric check · ${esc(label(m.name))}</th><th class="n">Score</th></tr></thead><tbody>${T.rubric.map((r, i) => `<tr class="grade-row" data-row="${i}"><td><button class="linkish" data-detail="crit:${i}">${r.id} · ${esc(r.text)}</button> ${r.mustPass ? '<span class="tag bad">Must-pass</span>' : ''}</td><td class="n g">${S.graded ? pts(m, i) : '<span class="small">…</span>'}</td></tr>`).join('')}</tbody></table></div><div class="submitbar" id="grade-total">${S.graded ? gradeTotal() : '<button class="primary" data-act="grade">Grade with the rubric</button>'}</div></div></div>`; },

 // 6 · The catch: the same judgment inside the combined task (real L1-04-06 results)
 6: () => { const c = T.catch, chip = m => m.void ? `<span class="tag bad">${esc(label(m.name))} · voided</span>` : `<span class="tag ${m.score >= 90 ? 'good' : ''}">${esc(label(m.name))} · ${m.score}</span>`;
  return `${real('Recorded results from the pilot runs, July 2026')}
  <div class="gap-head"><div class="card"><span class="label">On its own · ${T.id}</span><h3>${T.name}</h3><p>1–3 hours</p><div class="row" style="margin-top:12px">${T.models.map(m => m.pass ? `<span class="tag good">${esc(label(m.name))} · ${m.total}</span>` : `<span class="tag bad">${esc(label(m.name))} · disqualified</span>`).join('')}</div></div><div class="arrow">→</div>
  <div class="card dark"><span class="label">Inside the bigger job · ${c.id}</span><h3>${c.name}</h3><p>All five small tasks combined into one board-inputs workbook, with the same quarterly numbers inside.</p><div class="row" style="margin-top:12px">${c.models.map(chip).join('')}</div></div></div>
  ${S.gap ? `<div class="table-card reveal"><div class="scroll"><table><thead><tr><th>Check inside the combined task · ${c.checks.length} of ${c.totalChecks} shown</th><th class="n">Pts</th>${c.models.map(m => `<th class="c">${labelHTML(m.name)}</th>`).join('')}</tr></thead><tbody>${c.checks.map(k => `<tr class="${/Fulfillment/.test(k.area) ? 'same' : ''}"><td>${k.id} · ${esc(k.text)} ${k.mustPass ? '<span class="tag bad">Must-pass</span>' : ''}<div class="small">${esc(k.area)}</div></td><td class="n">${k.points}</td>${k.met.map(ok => `<td class="c">${mark(ok)}</td>`).join('')}</tr>`).join('')}<tr class="sum"><td><b>Points on these ${c.checks.length} checks</b></td><td class="n">${c.checks.reduce((n, k) => n + k.points, 0)}</td>${c.models.map((m, mi) => `<td class="c"><b>${c.checks.reduce((n, k) => n + (k.met[mi] ? k.points : 0), 0)}</b></td>`).join('')}</tr><tr class="sum total"><td><b>Total score, all ${c.totalChecks} checks</b></td><td class="n">100</td>${c.models.map(m => `<td class="c"><b>${m.score}</b>${m.void ? '<div class="bad small">voided</div>' : ''}</td>`).join('')}</tr></tbody></table></div></div>
  <div class="grid g2" style="margin-top:18px"><div class="card"><span class="label">${esc(cfg('Gemini').model)} on its own · 91/100</span>${segHTML(T.models.find(m => m.name === 'Gemini').segments.filter(x => x.rows).slice(0, 1))}</div><div class="card"><span class="label bad">${esc(cfg('Gemini').model)} inside the bigger job · voided</span>${segHTML(T.catch.insideSegments)}<p class="small">Invented quarters that still add up to $172,000.</p></div></div>
  <div class="callout" style="margin-top:18px"><b>${esc(cfg('Gemini').model)} got the quarterly numbers right on their own. Inside the bigger job, it invented different quarters that still add up to $172,000, so it was voided.</b> Every agent lost points once the job got longer.</div>` : '<button class="primary big" data-act="gap">Show what happened inside the bigger job</button>'}`; },

 // 7 · Preview the expert-curated dataset, then train on it
 7: () => { const rows = datasetParts();
  return `${sim('The dataset is real pilot data · the training run and reward values are illustrative')}
  <div class="work"><div class="stack"><div class="card"><span class="label">1 · The expert-curated dataset · one training task</span><h3>${T.train.id} · ${T.train.name}</h3><p style="margin-bottom:12px">A similar task from the same company records. Your task, ${T.id}, is held out for evaluation, so it is never trained on.</p>
   <table class="ds"><thead><tr><th>Expert input</th><th class="n">Size</th><th>Used in training as</th></tr></thead><tbody>${rows.map(r => `<tr><td><b>${r.name}</b></td><td class="n">${r.size}</td><td><span class="dim">${r.use}</span></td></tr>`).join('')}</tbody></table>
   <div class="row" style="margin-top:14px"><button class="primary" data-detail="dataset:">Preview the dataset</button><span class="small">AI labs receive the full dataset. This view shows a sample.</span></div></div>
   <div class="card"><span class="label">2 · Train on it</span><p style="margin-bottom:12px">This task is one of about ${T.l1Count} in the training set. A separate set of tasks, including yours, is held out for evaluation.</p><button class="primary big" data-act="train">${S.trained ? '↻ Train again' : '▶ Train on the expert dataset'}</button></div></div>
  <div class="stack"><div class="curve-card"><div class="row between"><span class="label" style="margin:0">Average reward across the training set</span><span class="small" id="train-status">${S.trained ? 'Training complete · checkpoint saved' : 'Not started'}</span></div><svg class="curve" viewBox="0 0 100 100" preserveAspectRatio="none" aria-label="Reward during training">${[25, 50, 75].map(y => `<line x1="0" x2="100" y1="${y}" y2="${y}"/>`).join('')}<polygon id="area" points="${S.trained ? area(curvePoints(60)) : ''}"/><polyline id="curve" points="${S.trained ? curvePoints(60) : ''}"/></svg><div class="row between small"><span>Start</span><span>Training steps →</span></div></div>
   <div class="card"><span class="label">The training signal</span><div class="signals ${S.trained ? 'on' : ''}" id="signals">${rows.map(r => `<div class="signal"><span class="pip"></span><div><b>${r.short}</b><div class="small">${r.use}</div></div></div>`).join('')}</div></div></div></div>`; },

 // 8 · After training: the voided run from step 6 (real) beside the same job after training (illustrative), on the same checks
 8: () => { if (!S.trained) return `<div class="launch"><h3>Train the model first.</h3><button data-go="7" class="primary">Go to training</button></div>`;
  const c = T.catch, gi = c.models.findIndex(m => m.name === 'Gemini'), shown = c.checks.reduce((n, k) => n + k.points, 0);
  const before = c.checks.reduce((n, k) => n + (k.met[gi] ? k.points : 0), 0), after = c.checks.reduce((n, k) => n + (AFTER.missed.includes(k.id) ? 0 : k.points), 0);
  return `${sim('Before is the real voided run from step 6 · after training is illustrative')}<div class="work"><div class="stack"><div class="card"><span class="label bad">Before training · ${esc(label('Gemini'))} · real</span>${segHTML(c.insideSegments)}<p class="small">Invented quarters; voided.</p></div>${S.trainedRun ? `<div class="card hot"><span class="label">After training · the same job · illustrative</span>${segHTML(AFTER.segments)}<p class="small">Quarters match the records, each traced to its source.</p></div><button data-act="rerun-trained" style="align-self:flex-start">Replay the trained run</button>` : '<div id="stage" class="launch"><h3>The same agent, after training, on the same bigger job.</h3><button class="primary big" data-act="run-trained">▶ Run the trained agent</button></div>'}</div>
  ${S.trainedRun ? `<div class="stack"><div class="card hot"><span class="label">Same checks as step 6</span><div class="big-stat">${after}<small>/${shown}</small></div><p style="margin-top:6px">Up from ${before} before training, and every must-pass check is now met.</p><div class="bars" style="margin-top:16px"><div class="bar"><span>Before</span><div class="track"><span class="before" style="width:${Math.round(before / shown * 100)}%"></span></div><span>${before}/${shown}</span></div><div class="bar"><span>After</span><div class="track"><span class="after" style="width:${Math.round(after / shown * 100)}%"></span></div><span>${after}/${shown}</span></div></div></div>
   <div class="table-card"><table><thead><tr><th>Check</th><th class="c">Before</th><th class="c">After</th></tr></thead><tbody>${c.checks.map(k => `<tr><td>${k.id} · ${esc(k.text)}</td><td class="c">${mark(k.met[gi])}</td><td class="c">${mark(!AFTER.missed.includes(k.id))}</td></tr>`).join('')}</tbody></table></div></div>` : '<div></div>'}</div>`; },

 // 9 · Recap
 9: () => `<p class="big">${esc(STEPS[8].say)}</p><div class="loop">${[[3, 'Create a task', 'You wrote the golden answer and rubric'], [5, 'Evaluate', 'Two of three models passed'], [6, 'Find the gap', 'Long tasks break them'], [7, 'Train', 'Learn from graded attempts'], [8, 'Evaluate again', 'The gap closes']].map(([n, l, d], i) => `<button data-go="${n}"><small>${i + 1} · ${l}</small>${d}</button>`).join('')}</div>`
};

const meter = total => `<span>${total} of 100 points</span><div class="track"><span class="${total === 100 ? 'after' : 'before'}" style="width:${Math.min(100, total)}%;animation:none"></span></div><b class="${total === 100 ? 'good' : 'bad'}">${total === 100 ? 'Ready' : `${100 - total > 0 ? 100 - total + ' to go' : total - 100 + ' over'}`}</b>`;
const datasetParts = () => { const X = T.train, gates = X.rubric.filter(r => r.mustPass).length, goldRows = X.goldenSegments.reduce((n, s) => n + (s.rows ? s.rows.length : 0), 0);
 return [
  {name:'Task prompt and source files', short:'Environment', size:'1 prompt · same company files', use:'The environment: what the model reads and works from'},
  {name:'Golden answer', short:'Golden answer', size:`${goldRows} rows`, use:'What good looks like: the reference every attempt is judged against'},
  {name:'Rubric criteria and weights', short:'Reward', size:`${X.rubric.length} checks · 100 pts`, use:'The reward: points earned on each check'},
  {name:'Must-pass gates', short:'Hard limits', size:`${gates} gates`, use:'Hard limits: missing one zeroes the reward'},
  {name:'Graded attempts', short:'Training examples', size:`${X.models.length} runs · ${X.models.length * X.rubric.length} grades`, use:'Training examples: attempts paired with their check-by-check grades'},
  {name:'Grader notes', short:'Feedback', size:`${X.rubric.filter(r => r.note).length} notes`, use:'Feedback: why each check was met or missed'}]; };
const gradeTotal = () => { const m = M(); return `<b>${esc(label(m.name))}: ${m.total}/100</b><span>${m.pass ? '<span class="good">Every must-pass check met, so the attempt passes.</span>' : `<span class="bad">Must-pass ${m.failed.join(', ')} failed, so the attempt is disqualified.</span>`}</span>`; };
const rubricTable = rows => `<table><tbody>${rows.map(r => `<tr><td>${esc(r.text)} ${r.mustPass ? '<span class="tag bad">Must-pass</span>' : ''}</td><td class="n">${r.points}</td></tr>`).join('')}</tbody></table>`;
// Detail panel content for clickable items. key is "kind:id".
function detail(key) {
 const [kind, id] = [key.slice(0, key.indexOf(':')), key.slice(key.indexOf(':') + 1)], w = work();
 if (kind === 'dataset') { const X = T.train, N = 3, more = (n, of) => `<p class="small" style="margin:6px 0 16px">Showing ${Math.min(n, of)} of ${of} rows.</p>`;
  const g = X.goldenSegments.find(x => x.rows), src = T.files[1].segments.find(x => x.rows);
  const tbl = (head, rows) => `<div class="tbl"><table class="data wrap"><thead><tr>${head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td class="${isNum(String(c)) ? 'n' : ''}">${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  return [`Training task · ${X.id} · preview`, `<p style="margin-bottom:16px">A sample of the expert-curated data for ${X.id}, ${X.name.toLowerCase()}. It uses the same company files as your task. AI labs receive the full set; it is not downloadable here.</p>
   <span class="label">Source file · ${T.files[1].tab}</span>${tbl(src.header.slice(0, 6), src.rows.slice(0, N).map(r => r.slice(0, 6)))}${more(N, src.rows.length)}
   <span class="label">Golden answer</span>${tbl(g.header.slice(0, 3), g.rows.slice(0, N).map(r => r.slice(0, 3)))}${more(N, g.rows.length)}
   <span class="label">Rubric</span>${tbl(['Check', 'Points', 'Must-pass'], X.rubric.slice(0, N).map(r => [`${r.id} · ${r.text}`, r.points, r.mustPass ? 'Yes' : 'No']))}${more(N, X.rubric.length)}
   <span class="label">Graded attempts</span>${tbl(['Agent', ...X.rubric.slice(0, N).map(r => r.id), 'Total'], X.models.map(m => [label(m.name), ...m.scores.slice(0, N), m.pass ? m.total : `${m.total} (disqualified)`]))}<p class="small" style="margin-top:6px">Showing ${N} of ${X.rubric.length} checks per attempt.</p>`]; }
 if (kind === 'expert') return [`Expert’s golden answer · ${T.id}_Golden.xlsx`, `<p class="small" style="margin-bottom:12px">Copy it, close this window, and paste it into your answer box (Cmd+V). Tables paste as tables.</p><div class="row" style="margin-bottom:14px"><button class="primary" data-act="copy-golden">Copy golden answer</button><span class="small" id="copy-status"></span></div>${segHTML(T.goldenSegments)}`];
 if (kind === 'mandate') { const m = MANDATE[+id]; return [`${m.label}: ${m.value}`, `<p>${esc(m.detail)}</p>`]; }
 if (kind === 'help') return HELP[id];
 if (kind === 'task') { const [n, name, desc] = TASKS.find(t => t[0] === id); return [`L2 task · ${name}`, `<p>${desc}</p><p style="margin-top:10px">A standalone 10–20 hour department task with its own prompt, golden answer, and rubric. Experts have already completed it.</p>`]; }
 if (kind === 'l1') { const t = T.siblings[+id]; return [`${t.id} · ${t.name}`, t.today ? `<p><b>Your task today.</b> ${esc(prompt())}</p>` : '<p>A 1–3 hour itemized task inside L2-04, with its own prompt, golden answer, rubric, and three recorded model runs. Experts have already completed it.</p>']; }
 if (kind === 'sub') return [`Submitted task · ${T.name}`, `<span class="label">Golden answer</span><div class="editor read">${w.answerHTML || esc(w.deliverable)}</div><br><span class="label">Rubric · ${w.rubric.length} criteria</span>${rubricTable(w.rubric)}`];
 if (kind === 'crit') { const r = T.rubric[+id]; return [`${r.id} · ${r.text}`, `<p>${r.points} points${r.mustPass ? ' · <span class="tag bad">Must-pass</span>' : ''}</p><p style="margin-top:10px"><b>Expected:</b> ${esc(r.expected)}</p><table style="margin-top:12px"><tbody>${T.models.map(m => `<tr><td>${esc(label(m.name))}</td><td class="n">${pts(m, +id)}</td></tr>`).join('')}</tbody></table>${r.note ? `<p class="small" style="margin-top:10px">Grader’s note: ${esc(r.note)}</p>` : ''}`]; }
 if (id === 'traces') return ['Graded attempts', '<p>Each time the agent tries the department-level task, the rubric grades its answer check by check. The prompt, the answer, and those grades form one training example. Reinforcement learning uses thousands of them, with no human grading in the loop.</p>'];
 if (id === 'golden') return ['Expert golden answers', `<p style="margin-bottom:10px">Every task carries an expert’s correct answer. This is the one for ${T.id}:</p>${segHTML(T.goldenSegments)}`];
 return ['Rubrics, used as the reward', `<p style="margin-bottom:10px">Each attempt is graded with a rubric like this one. The points earned are the reward the model learns to maximize.</p>${rubricTable(w.submitted ? w.rubric : T.rubric)}`];
}

// Illustrative score curve from the before score to the after score on the gap checks.
function curvePoints(n) {
 const c = T.catch, gi = c.models.findIndex(m => m.name === 'Gemini'), shown = c.checks.reduce((n, k) => n + k.points, 0);
 const lo = Math.round(c.checks.reduce((n, k) => n + (k.met[gi] ? k.points : 0), 0) / shown * 100), hi = Math.round(c.checks.reduce((n, k) => n + (AFTER.missed.includes(k.id) ? 0 : k.points), 0) / shown * 100);
 return Array.from({length:n}, (_, i) => { const t = i / 59, y = lo + (hi - lo) * (1 - Math.exp(-4 * t)) / (1 - Math.exp(-4)) + Math.sin(i * 1.7) * 3 * (1 - t); return `${(t * 100).toFixed(1)},${(100 - y).toFixed(1)}`; }).join(' ');
}
const area = pts => pts ? `${pts} ${pts.split(' ').pop().split(',')[0]},100 0,100` : '';
function train() {
 const id = ++runId; let n = 0; S.trained = true; S.trainedRun = false; save(); // recorded up front; the curve is only animation
 (function step() { if (id !== runId || !$('#curve')) return; n += 1; const p = curvePoints(n); $('#curve').setAttribute('points', p); $('#area').setAttribute('points', area(p)); $('#train-status').textContent = `Training step ${fmt(n * 50)} of 3,000`;
  $('#signals')?.classList.add('on'); if (n < 60) return setTimeout(step, 150); render(); })();
}
// Fills in the score column one check at a time.
function grade() {
 const id = ++runId; let i = 0; S.graded = true; save(); $('#grade-total').innerHTML = '<span class="small">Grading…</span>'; // recorded up front; the row-by-row fill is only animation
 (function step() { if (id !== runId || !$('#grades')) return;
  if (i < T.rubric.length) { const row = $(`#grades [data-row="${i}"]`); row.querySelector('.g').innerHTML = pts(M(), i); row.classList.add('flash'); i++; return setTimeout(step, 380); }
  $('#grade-total').innerHTML = gradeTotal(); })();
}
function replay(trained) {
 const id = ++runId, text = trained ? tableText([AFTER.segments[0].header, ...AFTER.segments[0].rows]) : M().answer;
 const acts = trained ? [{label:`Read the bigger job: ${T.catch.name}`}, {label:'Open 12 months of records'}, {label:'Open the source tabs', doc:T.files[0].body}, {label:'Match each month and quarter'}, {label:'Carry open items forward'}, {label:'Write the year-end schedule'}]
  : [{label:`Read the task: ${T.question}`}, ...T.files.map(f => ({label:`Open ${f.ref} · ${f.name}`, doc:f.body})), {label:'Decide: before or after the $12,000 credit?'}, {label:'Write the Fulfillment_Shipping_by_Q tab'}];
 $('#stage').outerHTML = `<div id="stage">${screen(trained ? `Trained agent · ${T.catch.id}` : `${label(M().name)} · ${T.id}`, `<div><span class="label">Input</span><ol id="log"></ol><pre class="peek" id="doc" hidden></pre></div><div><span class="label">Output · the model’s answer</span><pre id="out" class="wide"></pre></div>`)}</div>`;
 let i = 0, n = 0; S[trained ? 'trainedRun' : 'baseline'] = true; save(); // recorded up front; the replay is only animation
 (function step() { if (id !== runId || !$('#log')) return;
  if (i < acts.length) { const a = acts[i++]; $('#log').insertAdjacentHTML('beforeend', `<li>${esc(a.label)}</li>`); if (a.doc) { $('#doc').hidden = false; $('#doc').textContent = a.doc; } return setTimeout(step, 850); }
  n += 4; $('#out').textContent = text.slice(0, n); if (n < text.length) return setTimeout(step, 18);
  setTimeout(() => id === runId && render(), 900); })();
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
 else if (d.act === 'prompt-edit') S.editPrompt = true;
 else if (d.act === 'prompt-cancel') S.editPrompt = false;
 else if (d.act === 'prompt-save') { const v = $('#prompt-edit').value.trim(); S.prompt = v && v !== PROMPT_DEFAULT ? v : null; S.editPrompt = false; }
 else if (d.act === 'prompt-reset') { S.prompt = null; S.editPrompt = false; }
 else if (d.act === 'see-expert') { const [title, body] = detail('expert:'); $('#detail-title').textContent = title; $('#detail-body').innerHTML = body; $('#detail').showModal(); return; }
 else if (d.act === 'copy-golden') { const html = segsToHTML(T.goldenSegments), text = segsToText(T.goldenSegments), ok = () => { $('#copy-status').textContent = 'Copied. Close this window and paste it into your answer.'; };
  try { navigator.clipboard.write([new ClipboardItem({'text/html':new Blob([html], {type:'text/html'}), 'text/plain':new Blob([text], {type:'text/plain'})})]).then(ok, () => navigator.clipboard.writeText(text).then(ok, () => { $('#copy-status').textContent = 'Copy is blocked here. Select the table below and copy it.'; })); } catch { $('#copy-status').textContent = 'Copy is blocked here. Select the table below and copy it.'; } return; }
 else if (d.act === 'ins-table') { insertIntoAnswer(TABLE_HTML); return; }
 else if (d.act === 'ins-row') { const c = caretCell(); if (!c) return insertIntoAnswer(TABLE_HTML); const tr = c.closest('tr'), row = document.createElement('tr'); [...tr.children].forEach(() => { const td = document.createElement('td'); td.innerHTML = '<br>'; row.append(td); }); (tr.parentElement.tagName === 'THEAD' ? tr.closest('table').tBodies[0] || tr.parentElement : tr.parentElement).insertBefore(row, tr.parentElement.tagName === 'THEAD' ? null : tr.nextSibling); saveAnswer(); return; }
 else if (d.act === 'ins-col') { const c = caretCell(); if (!c) return insertIntoAnswer(TABLE_HTML); const i = [...c.parentElement.children].indexOf(c); c.closest('table').querySelectorAll('tr').forEach(tr => { const cell = document.createElement(tr.parentElement.tagName === 'THEAD' ? 'th' : 'td'); cell.innerHTML = '<br>'; tr.children[i] ? tr.children[i].after(cell) : tr.append(cell); }); saveAnswer(); return; }
 else if (d.act === 'expert-rubric') { Object.assign(w, {rubric:T.rubric.map(r => ({text:r.text, points:r.points, mustPass:r.mustPass})), submitted:false}); }
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
 if (e.target.id === 'answer') return saveAnswer();
 if (d.f) { w[d.f] = e.target.value; w.submitted = false; }
 else if (d.r) { w.rubric[+d.r][d.k] = e.target.type === 'checkbox' ? e.target.checked : e.target.value; w.submitted = false; updateSum(); updateSubmit(); }
 else return;
 save();
});
document.addEventListener('keydown', e => {
 if ($('#detail').open || e.target.matches('input,textarea,[contenteditable]') || e.metaKey || e.ctrlKey || e.altKey) return;
 if (demo.playing && e.key.startsWith('Arrow')) stopDemo();
 if (e.key === 'ArrowRight') go(S.step + 1); else if (e.key === 'ArrowLeft') go(S.step - 1);
});

// ---- Demo runthrough. It presses the same controls a person would, so it follows the same rules as a manual run.
const DEMO_SPEED = 1;
const demo = {id:0, playing:false, done:false};
const DEMO = [
 {say:'Meet the company: a year of real records, by department', run:async d => { await d.wait(2500); await d.click('[data-src="d8"]', 2600); await d.click('[data-src="s0"]', 3000); }},
 {say:'Break the 100-hour job down to the task you will do', run:async d => { await d.wait(1800); await d.click('[data-act="reveal"]', 1600); await d.click('[data-act="open-l2"]', 2800); }},
 {say:'Write the golden answer: open the expert’s answer and paste it in', run:async d => { await d.click('[data-act="see-expert"]', 2600); await d.click('[data-act="close-detail"]', 400); await d.click('#answer', 0, 500); insertIntoAnswer(segsToHTML(T.goldenSegments)); await d.wait(2400); }},
 {say:'Write the rubric, then submit the task', run:async d => { await d.click('[data-act="expert-rubric"]', 1800); await d.click('[data-act="submit"]', 2200); }},
 {say:'Three AI models try your task: two pass, one is disqualified', run:async d => { await d.click('[data-act="run-baseline"]'); await d.until(() => $('.models')); await d.wait(1600); await d.click('[data-act="grade"]'); await d.until(() => $('#grade-total') && !/Grading/.test($('#grade-total').textContent)); await d.wait(1600); await d.click('[data-model="0"]', 2600); }},
 {say:'The catch: the same numbers inside a bigger job', run:async d => { await d.wait(1500); await d.click('[data-act="gap"]', 4500); }},
 {say:'Preview the expert data, then train on all of it', run:async d => { await d.wait(1500); await d.click('[data-detail="dataset:"]', 3200); await d.click('[data-act="close-detail"]', 500); await d.click('[data-act="train"]'); await d.until(() => /complete/.test($('#train-status')?.textContent || '')); await d.wait(1500); }},
 {say:'After training: the long task, graded again', run:async d => { await d.click('[data-act="run-trained"]'); await d.until(() => $('.big-stat')); await d.wait(4000); }},
 {say:'Recap: create, evaluate, find the gap, train, evaluate again', run:async d => { await d.wait(5000); }}
];
function demoBar(i) {
 $('#demo-bar').hidden = !demo.playing;
 $('#play').textContent = demo.playing ? '■ Stop tour' : demo.done ? '↻ Replay tour' : '▶ Start Factory Tour';
 if (i === undefined) return;
 $('#demo-say').textContent = DEMO[i].say; $('#demo-count').textContent = `${i + 1} / ${DEMO.length}`; $('#demo-fill').style.width = `${(i + 1) / DEMO.length * 100}%`;
}
function stopDemo() { demo.id++; demo.playing = false; document.querySelectorAll('.demo-target').forEach(el => el.classList.remove('demo-target')); demoBar(); }
async function startDemo() {
 const id = ++demo.id; demo.playing = true; demo.done = false; $('#detail').close(); S = blank(); save(); shown = 0;
 const wait = ms => new Promise((res, rej) => setTimeout(() => id === demo.id ? res() : rej('stopped'), ms / DEMO_SPEED));
 const d = {wait,
  async click(sel, after = 0, before = 700) { const el = $(sel); if (!el) return; el.scrollIntoView({block:'center', behavior:'smooth'}); el.classList.add('demo-target'); await wait(before); el.classList.remove('demo-target'); el.click(); await wait(after); },
  async until(done) { for (let n = 0; n < 200 && !done(); n++) await wait(100 * DEMO_SPEED); }};
 try { for (let i = 0; i < DEMO.length; i++) { go(i + 1); demoBar(i); await DEMO[i].run(d); } demo.done = true; } catch (stopped) { if (stopped !== 'stopped') throw stopped; return; }
 demo.playing = false; demoBar();
}
// The narrative page links to a step with #step-N.
const linked = location.hash.match(/^#step-(\d+)$/); if (linked) S.step = Math.min(STEPS.length, Math.max(1, +linked[1]));
if (!views[S.step]) S.step = 1;
render();
if (new URLSearchParams(location.search).has('demo')) startDemo(); // share link: ?demo starts the runthrough
