'use strict';
/* CEO Bench live demo prototype. Agent runs, training, and scores are simulated from authored fixtures in data.js. No model is called. */
const $ = s => document.querySelector(s);
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const KEY = 'ceo-bench-demo-v2';
const PODS = Object.keys(SEATS);
const blank = () => ({step:1, pod:'A', dept:0, file:null, revealed:false, names:{}, work:{}, baseline:{}, marks:{}, trained:false, trainedRun:{}, reeval:false});
let S = blank();
try { S = Object.assign(blank(), JSON.parse(localStorage.getItem(KEY))); } catch {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} };
let runId = 0; // cancels a running replay or training animation when the view changes

const work = pod => S.work[pod] ??= {deliverable:'', rubric:Array.from({length:10}, () => ({text:'', points:'', mustPass:false})), submitted:false, example:false};
const podName = pod => S.names[pod]?.trim() ? `Pod ${pod} · ${esc(S.names[pod])}` : `Pod ${pod}`;
const points = rows => rows.reduce((n, r) => n + (Number(r.points) || 0), 0);
// The rubric a pod grades with: its own once submitted, otherwise the expert fixture.
const gradingRubric = pod => work(pod).submitted ? {rows:work(pod).rubric, own:!work(pod).example} : {rows:SEATS[pod].rubric, own:false};
const podTabs = () => `<div class="pods" role="tablist">${PODS.map(p => `<button data-pod="${p}" class="${S.pod===p?'on':''}" aria-pressed="${S.pod===p}">${podName(p)} · ${SEATS[p].name}</button>`).join('')}</div>`;
const simTag = text => `<div class="sim">Simulated · ${text} No model is called.</div>`;
const scoreLine = sc => `${sc.percent}/100 ${sc.gated ? '<span class="tag bad">Fails a must-pass</span>' : '<span class="tag good">All must-pass gates cleared</span>'}`;
const packet = pod => SEATS[pod].files.map(f => `<span class="label">${f.ref} · ${esc(f.name)} · rehearsal fixture</span><pre>${esc(f.body)}</pre>`).join('<br>');

const views = {
 1: () => `<div class="grid g2" style="align-items:center"><div><button class="card" data-detail="stat:" title="See the departments behind the files"><div class="stat">1,100+</div></button><p class="sub">Files in the company dataset, covering 1 complete fiscal year</p></div><div class="grid g2">${DATA_TYPES.map((x, i) => `<button class="card" data-detail="type:${i}" title="${esc(x.blurb)}"><h3>${x.title}</h3><p>${x.examples.join(' · ')}</p></button>`).join('')}</div></div><p class="sub" style="margin-top:16px">Select a data type to see what it contains.</p>`,

 2: () => { const d = DEPARTMENTS[S.dept]; const file = allFiles().find(f => f.name === S.file);
  return `<div class="grid g2"><div class="tree">${DEPARTMENTS.map((x, i) => `<button data-dept="${i}" class="${i===S.dept?'on':''}">${i===S.dept?'▾':'▸'} ${x[0]}<br><small>${x[1]}</small></button>${i===S.dept ? `<div class="files">${x[3].map(f => `<button data-file="${esc(f)}">${esc(f)}</button>`).join('')}</div>` : ''}`).join('')}</div>
  <div>${file ? `<span class="label">${file.ref} · ${esc(file.name)} · rehearsal fixture</span><pre>${esc(file.body)}</pre>` : `<div class="card"><h3>${d[0]}</h3><p>${S.file ? `“${esc(S.file)}” is not included in this prototype.` : 'Choose a file to open it.'}</p></div>`}</div></div>`; },

 3: () => `<span class="label">Executive engagement · abridged · level 3</span><div class="grid g2" style="max-width:900px">${MANDATE.map((m, i) => `<button class="card" data-detail="mandate:${i}" title="${esc(m.detail)}"><span class="label">${m.label}</span><h3>${m.value}</h3></button>`).join('')}</div><p class="sub" style="margin-top:16px">Roughly 100 hours of professional work (task-design estimate).</p>`,

 4: () => S.revealed
  ? `<div class="grid g5">${TASKS.map(([n, name, desc, pod]) => `<div class="card ${pod?'hot':''}"><span class="label">${n}${pod?` · Pod ${pod}`:''}</span><h3>${name}</h3><p>${desc}</p><button data-detail="task:${n}" style="margin-top:10px">View task</button>${pod ? `<input type="text" data-name="${pod}" placeholder="Pod ${pod} names" value="${esc(S.names[pod]||'')}" style="margin-top:10px">` : ''}</div>`).join('')}</div><p class="sub" style="margin-top:16px">Each task has its own prompt, reference answer, and rubric. 4 pods, 1 task each.</p>`
  : `<button class="primary" data-act="reveal">Break the engagement into 10 tasks</button>`,

 5: () => `<div class="grid g4">${PODS.map(p => `<div class="card"><span class="label">${podName(p)}</span><h3>${SEATS[p].name}</h3><p><b>${SEATS[p].question}</b></p><p style="margin-top:8px">${SEATS[p].brief}</p><button data-detail="pod:${p}" style="margin-top:10px">Open the packet (${SEATS[p].files.length} files)</button></div>`).join('')}</div>`,

 6: () => { const w = work(S.pod);
  return `${podTabs()}<div class="grid g2"><div><span class="label">Assignment</span><p style="margin-bottom:14px">${SEATS[S.pod].brief}</p>${packet(S.pod)}</div><div><span class="label">Your deliverable (your reference answer)</span><textarea data-f="deliverable" placeholder="Finding → source reference. Uncertainty → next action.">${esc(w.deliverable)}</textarea><div class="row" style="margin-top:10px"><button data-act="example">Load a rehearsal example</button><small class="sub">Fills this pod with the authored example answer and rubric.</small></div></div></div>`; },

 7: () => { const w = work(S.pod);
  return `${podTabs()}<table class="rubric"><thead><tr><th>#</th><th>What a correct answer must do</th><th class="n">Points</th><th>Must-pass</th><th></th></tr></thead><tbody>${w.rubric.map((r, i) => `<tr><td>${i+1}</td><td><input type="text" data-r="${i}" data-k="text" value="${esc(r.text)}" placeholder="A checkable requirement"></td><td class="n"><input type="number" min="1" max="100" data-r="${i}" data-k="points" value="${esc(r.points)}"></td><td><input type="checkbox" data-r="${i}" data-k="mustPass" ${r.mustPass?'checked':''} aria-label="Must-pass"></td><td><button data-act="del" data-i="${i}" aria-label="Remove criterion ${i+1}">×</button></td></tr>`).join('')}</tbody></table>
  <div class="row between" style="margin-top:12px"><button data-act="add" ${w.rubric.length>=20?'disabled':''}>Add a criterion</button><button data-detail="help:criterion">See what a good criterion looks like</button><span id="sum"></span></div>`; },

 8: () => { const w = work(S.pod); const errors = validateSubmission({name:S.names[S.pod] || `Pod ${S.pod}`, deliverable:w.deliverable, rubric:w.rubric});
  return `${podTabs()}<div class="grid g2"><div class="card"><h3>${SEATS[S.pod].name}</h3><p>Deliverable: ${w.deliverable.trim() ? w.deliverable.trim().split(/\s+/).length + ' words' : 'empty'} · Rubric: ${w.rubric.length} criteria, ${points(w.rubric)} points${w.example ? ' · rehearsal example' : ''}</p>${errors.length ? `<ul class="errors">${errors.map(e => `<li>${e}</li>`).join('')}</ul>` : '<p class="good" style="margin-top:10px">Structure checks pass. An expert still reviews the evidence.</p>'}<button class="primary" data-act="submit" ${errors.length?'disabled':''} style="margin-top:12px">${w.submitted?'Resubmit':'Send to review'}</button></div>
  <div class="card"><span class="label">Review inbox</span>${PODS.map(p => `<div class="row between" style="padding:8px 0;border-bottom:1px solid var(--line)"><button data-detail="sub:${p}" title="Open this pod’s submission">${podName(p)} · ${SEATS[p].name}</button>${work(p).submitted ? '<span class="tag good">Received</span>' : '<span class="tag">In progress</span>'}</div>`).join('')}</div></div>`; },

 9: () => { const done = S.baseline[S.pod], sc = expertScore(S.pod, false), seat = SEATS[S.pod];
  return `${simTag('Recorded replay and a pre-computed evaluation.')}${podTabs()}${done
   ? `<div class="grid g2"><div><span class="label">Baseline agent deliverable</span><pre>${esc(seat.attempt)}</pre></div><div class="card"><span class="label">Pre-run evaluation · expert rubric</span><div class="stat">${sc.percent}<small>/100</small></div><p style="margin:8px 0">${sc.gated?'<span class="tag bad">Fails a must-pass</span>':''}</p><p><b>Biggest misses</b></p><ul style="font-size:12px;padding-left:18px">${seat.rubric.map((r, i) => !r.pass && r.mustPass ? `<li><button data-detail="crit:${i}" style="margin-bottom:6px;text-align:left">${esc(r.text)}</button></li>` : '').filter(Boolean).slice(0,2).join('')}</ul><button data-detail="score:" style="margin-top:6px">See every criterion</button><button data-act="rerun-baseline" style="margin-top:10px">Replay</button></div></div>`
   : `<div id="stage"><p class="sub">Open-weights agent, before any specialized training. Same prompt and files as ${podName(S.pod)}.</p><button class="primary" data-act="run-baseline">▶ Run baseline</button></div>`}`; },

 10: () => { const {rows, own} = gradingRubric(S.pod), marks = S.marks[S.pod] ??= [];
  const earned = rows.reduce((n, r, i) => n + (marks[i]==='pass' ? Number(r.points) : 0), 0), open = rows.filter((_, i) => !['pass','fail'].includes(marks[i])).length, gated = rows.some((r, i) => r.mustPass && marks[i]==='fail');
  return `${podTabs()}<p class="sub">${own ? 'Grading with this pod’s own rubric.' : 'This pod has not submitted its own rubric, so the expert rubric is shown.'} Read the criterion, find the evidence in the agent’s deliverable, and mark it.</p>
  <div class="grid g2"><div><span class="label">Baseline agent deliverable</span><pre>${esc(SEATS[S.pod].attempt)}</pre><br>${packet(S.pod)}</div><div><table><thead><tr><th>Criterion</th><th class="n">Pts</th><th>Your judgment</th></tr></thead><tbody>${rows.map((r, i) => `<tr><td>${esc(r.text)} ${r.mustPass?'<span class="tag bad">Must-pass</span>':''}${!own && marks[i] ? `<br><small class="sub">Expert note: ${esc(r.reason)}</small>` : ''}</td><td class="n">${esc(r.points)}</td><td><div class="mark">${[['pass','Met'],['fail','Not met'],['unclear','Unclear']].map(([v, l]) => `<button data-mark="${i}" data-v="${v}" class="${marks[i]===v?'on':''}" aria-pressed="${marks[i]===v}">${l}</button>`).join('')}</div></td></tr>`).join('')}</tbody></table>
  <div class="total"><b>Your score: ${earned}/100</b>${gated ? ' · <span class="bad">must-pass failed, attempt fails</span>' : ''}${open ? ` · ${open} not scored yet` : ' · review complete'}<br><small>Expert rubric score from step 9: ${expertScore(S.pod, false).percent}/100</small></div></div></div>`; },

 11: () => `${simTag('Pre-built dataset and a recorded training curve; values are illustrative.')}<div class="grid g2"><div class="card"><span class="label">Training dataset</span><h3>Expert data for 4 tasks</h3><div class="row">${[['golden','Reference answers'],['rubric','Rubrics, used as the reward'],['variants','Expert-built task variants']].map(([k, l]) => `<button data-detail="train:${k}">${l}</button>`).join('')}</div><p style="margin-top:10px"><b>Held out:</b> the 4 pod tasks themselves. They are used only for evaluation.</p><button class="primary" data-act="train" style="margin-top:14px">${S.trained?'Replay training run':'▶ Start training run'}</button></div><div><span class="label">Average rubric reward during training</span><svg class="curve" viewBox="0 0 100 100" preserveAspectRatio="none" aria-label="Reward curve"><polyline id="curve" points="${S.trained ? curvePoints(60) : ''}"/></svg><div class="row between"><small class="sub">Training steps →</small><small id="train-status">${S.trained ? 'Training complete. Checkpoint saved.' : 'Not started'}</small></div></div></div>`,

 12: () => { if (!S.trained) return needTraining(); const done = S.trainedRun[S.pod];
  return `${simTag('Pre-built checkpoint and a recorded replay.')}${podTabs()}<div class="grid g2"><div><span class="label">Baseline agent</span><pre>${esc(SEATS[S.pod].attempt)}</pre></div><div>${done ? `<span class="label">Trained checkpoint</span><pre>${esc(TRAINED[S.pod].attempt)}</pre><div class="row" style="margin-top:10px"><button data-act="rerun-trained">Replay</button><button data-detail="diff:">See what it did differently</button></div>` : `<div id="stage"><p class="sub">Same agent after training. Same prompt, same files.</p><button class="primary" data-act="run-trained">▶ Run trained agent</button></div>`}</div></div>`; },

 13: () => { if (!S.trained) return needTraining(); const rows = SEATS[S.pod].rubric, a = expertScore(S.pod, false), b = expertScore(S.pod, true); 
  return `${simTag('Pre-computed evaluations of authored fixtures; scores are illustrative.')}${S.reeval
   ? `${podTabs()}<div class="grid g2"><div><table><thead><tr><th>Criterion · expert rubric</th><th class="n">Pts</th><th>Before</th><th>After</th></tr></thead><tbody>${rows.map((r, i) => `<tr><td><button data-detail="crit:${i}" style="text-align:left" title="See the evidence">${esc(r.text)}</button> ${r.mustPass?'<span class="tag bad">Must-pass</span>':''}</td><td class="n">${r.points}</td><td>${tick(r.pass)}</td><td>${tick(!TRAINED[S.pod].fails.includes(i))}</td></tr>`).join('')}</tbody></table></div>
     <div><div class="card hot"><span class="label">${podName(S.pod)} · ${SEATS[S.pod].name}</span><div class="stat">+${b.percent - a.percent}<small> points</small></div><p style="margin-top:8px">Before: ${scoreLine(a)}<br>After: ${scoreLine(b)}</p></div><div class="bars" style="margin-top:20px">${podBars()}</div></div></div>`
   : `<button class="primary" data-act="reeval">Re-evaluate with the same rubric</button>`}`; },

 14: () => `<p class="big">${esc(STEPS[13].say)}</p><div class="loop">${[[6,'Create a task'],[9,'Evaluate'],[11,'Train'],[13,'Re-evaluate']].map(([n, l]) => `<button data-go="${n}" title="Go to step ${n}">${l}</button>`).join('<i>→</i>')}</div>${S.trained ? `<div class="bars" style="max-width:760px">${podBars()}</div><small class="sub">Simulated scores from authored fixtures.</small>` : ''}`
};

const allFiles = () => [...PODS.flatMap(p => SEATS[p].files), ...EXTRA_FILES];
const tick = ok => ok ? '<span class="good">✓ Met</span>' : '<span class="bad">✕ Not met</span>';
const fileButtons = names => names.length ? `<div class="row" style="margin-top:12px">${names.map(n => `<button data-detail="file:${esc(n)}">${esc(n)}</button>`).join('')}</div>` : '<p class="sub" style="margin-top:12px">No sample file for this type in the prototype.</p>';
const rubricTable = rows => `<table><tbody>${rows.map(r => `<tr><td>${esc(r.text)} ${r.mustPass?'<span class="tag bad">Must-pass</span>':''}</td><td class="n">${r.points}</td></tr>`).join('')}</tbody></table>`;
// Detail panel content for clickable mocks. key is "kind:id".
function detail(key) {
 const [kind, id] = [key.slice(0, key.indexOf(':')), key.slice(key.indexOf(':') + 1)];
 if (kind === 'type') { const t = DATA_TYPES[+id]; return [t.title, `<p>${esc(t.blurb)}</p><p style="margin-top:10px"><b>Includes:</b> ${t.examples.join(', ')}</p>${fileButtons(t.files)}`]; }
 if (kind === 'file') { const f = allFiles().find(f => f.name === id); return [`${f.ref ? f.ref + ' · ' : ''}${f.name}`, `<span class="label">${f.kind} · rehearsal fixture</span><pre>${esc(f.body)}</pre>`]; }
 if (kind === 'pod') { const s = SEATS[id]; return [`Pod ${id} · ${s.name}`, `<p><b>${s.question}</b></p><p style="margin:8px 0 14px">${s.brief}</p>${packet(id)}`]; }
 if (kind === 'task') { const [n, name, desc, pod] = TASKS.find(t => t[0] === id); return [`Task ${n} · ${name}`, `<p>${desc}</p><p style="margin-top:10px">A standalone 10–20 hour professional task with its own prompt, reference answer, and rubric.</p>${pod ? `<p style="margin-top:10px"><b>Pod ${pod} exercise:</b> ${SEATS[pod].brief}</p>${fileButtons(SEATS[pod].files.map(f => f.name))}` : '<p class="sub" style="margin-top:10px">Not assigned to a pod today.</p>'}`]; }
 if (kind === 'stat') return ['1,100+ files across 8 departments', DEPARTMENTS.map(([name, desc, , files]) => `<p style="margin-top:12px"><b>${name}</b> · ${desc}</p>${fileButtons(files)}`).join('')];
 if (kind === 'mandate') { const m = MANDATE[+id]; return [`${m.label}: ${m.value}`, `<p>${esc(m.detail)}</p>`]; }
 if (kind === 'help') return HELP[id];
 if (kind === 'sub') { const w = work(id); return [`Pod ${id} · ${SEATS[id].name}`, w.submitted ? `<span class="label">Deliverable${w.example ? ' · rehearsal example' : ''}</span><pre>${esc(w.deliverable)}</pre><br><span class="label">Rubric · ${w.rubric.length} criteria</span>${rubricTable(w.rubric)}` : '<p>This pod has not submitted yet.</p>']; }
 if (kind === 'crit') { const r = SEATS[S.pod].rubric[+id], after = !TRAINED[S.pod].fails.includes(+id); return [r.text, `<p>${r.points} points${r.mustPass ? ' · <span class="tag bad">Must-pass</span>' : ''}</p><p style="margin-top:10px"><b>Evidence in the packet:</b> ${esc(r.evidence)}</p><p style="margin-top:10px"><b>Baseline agent:</b> ${tick(r.pass)}. ${esc(r.reason)}</p>${S.trained ? `<p style="margin-top:10px"><b>Trained agent:</b> ${tick(after)}</p>` : ''}`]; }
 if (kind === 'score') return [`Baseline evaluation · Pod ${S.pod}`, `<table><tbody>${SEATS[S.pod].rubric.map((r, i) => `<tr><td><button data-detail="crit:${i}" style="text-align:left">${esc(r.text)}</button> ${r.mustPass?'<span class="tag bad">Must-pass</span>':''}</td><td class="n">${r.points}</td><td>${tick(r.pass)}</td></tr>`).join('')}</tbody></table>`];
 if (kind === 'diff') { const rows = SEATS[S.pod].rubric; return [`What the trained agent did differently · Pod ${S.pod}`, `<p style="margin-bottom:10px">Criteria the baseline missed and the trained agent now meets:</p><ul style="padding-left:18px">${rows.map((r, i) => !r.pass && !TRAINED[S.pod].fails.includes(i) ? `<li>${esc(r.text)}${r.mustPass ? ' <span class="tag bad">Must-pass</span>' : ''}</li>` : '').join('')}</ul><p style="margin:12px 0 6px">Still missed:</p><ul style="padding-left:18px">${TRAINED[S.pod].fails.map(i => `<li>${esc(rows[i].text)}</li>`).join('')}</ul>`]; }
 const s = SEATS[S.pod], w = work(S.pod);
 if (id === 'golden') return [`Reference answer · Pod ${S.pod}`, `<span class="label">${w.submitted && !w.example ? 'Submitted by this pod' : 'Expert example · rehearsal fixture'}</span><pre>${esc(w.submitted ? w.deliverable : s.golden)}</pre>`];
 if (id === 'rubric') return [`Rubric as reward · Pod ${S.pod}`, `<p style="margin-bottom:10px">Each training attempt is graded with this rubric. The points earned are the reward.</p>${rubricTable(gradingRubric(S.pod).rows)}`];
 return ['Expert-built task variants', '<p>Experts write new versions of the same task from other parts of the company’s year: a different month, different documents, a different planted conflict. The agent trains on these, never on the pod’s own task.</p><p class="sub" style="margin-top:10px">Illustrative. No variant set is included in this prototype.</p>'];
}
const needTraining = () => `<div class="card"><p>Run the training step first.</p><button data-go="11" style="margin-top:10px">Go to step 11</button></div>`;
const podBars = () => PODS.map(p => { const a = expertScore(p, false).percent, b = expertScore(p, true).percent; return `<div class="bar"><button data-podgo="${p}" title="Open this pod’s before and after">${podName(p)}</button><div class="track"><span class="after" style="width:${b}%"></span><span class="before" style="width:${a}%"></span></div><span>${a} → ${b}</span></div>`; }).join('');

// Illustrative reward curve from the average baseline score to the average trained score.
function curvePoints(n) {
 const avg = t => PODS.reduce((s, p) => s + expertScore(p, t).percent, 0) / PODS.length, lo = avg(false), hi = avg(true);
 return Array.from({length:n}, (_, i) => { const t = i / 59, y = lo + (hi - lo) * (1 - Math.exp(-4 * t)) / (1 - Math.exp(-4)) + Math.sin(i * 1.7) * 1.5 * (1 - t); return `${(t * 100).toFixed(1)},${(100 - y).toFixed(1)}`; }).join(' ');
}
function train() {
 const id = ++runId; let n = 0; S.trained = false;
 (function tick() { if (id !== runId || !$('#curve')) return; n += 1; $('#curve').setAttribute('points', curvePoints(n)); $('#train-status').textContent = `Training step ${n * 50} of 3,000`;
  if (n < 60) return setTimeout(tick, 150); S.trained = true; S.reeval = false; save(); render(); })();
}
function replay(pod, trained) {
 const id = ++runId, seat = SEATS[pod], text = trained ? TRAINED[pod].attempt : seat.attempt;
 const acts = [{label:`Read the task: ${seat.question}`}, ...seat.files.map(f => ({label:`Open ${f.ref} · ${f.name}`, doc:f.body})), ...(trained ? [{label:'Compare the records line by line'}, {label:'Check each document’s status'}, {label:'List what the packet does not establish'}] : [{label:'Skim the totals'}]), {label:'Write the deliverable'}];
 $('#stage').innerHTML = `<div class="screen"><span class="rec">● Recorded computer use · ${trained ? 'trained checkpoint' : 'baseline agent'} · simulated replay</span><div><ol id="log"></ol><pre class="doc" id="doc" hidden></pre></div><pre id="out"></pre></div>`;
 let i = 0, n = 0;
 (function step() { if (id !== runId || !$('#log')) return;
  if (i < acts.length) { const a = acts[i++]; $('#log').insertAdjacentHTML('beforeend', `<li>${esc(a.label)}</li>`); if (a.doc) { $('#doc').hidden = false; $('#doc').textContent = a.doc; } return setTimeout(step, 900); }
  n += 3; $('#out').textContent = text.slice(0, n); if (n < text.length) return setTimeout(step, 20);
  (trained ? S.trainedRun : S.baseline)[pod] = true; save(); setTimeout(() => id === runId && render(), 900); })();
}
function updateSum() { const el = $('#sum'); if (!el) return; const w = work(S.pod), t = points(w.rubric); el.innerHTML = `${w.rubric.length} criteria · <b class="${t===100?'good':'bad'}">${t} of 100 points</b>`; }

function render() {
 runId++; const s = STEPS[S.step - 1];
 $('#steps').innerHTML = STEPS.map((x, i) => `<button data-go="${i+1}" class="${i+1===S.step?'current':i+1<S.step?'done':''}" aria-label="Step ${i+1}: ${esc(x.title)}" ${i+1===S.step?'aria-current="step"':''}>${i+1}</button>`).join('');
 $('#main').innerHTML = `<span class="eyebrow">${s.act} · Step ${S.step} of ${STEPS.length} · ${s.time}</span><h1>${esc(s.title)}</h1><p class="sub">${esc(s.sub)}</p>${views[S.step]()}`;
 $('#prev').disabled = S.step === 1; $('#next').disabled = S.step === STEPS.length; $('#where').textContent = `${s.act} · ${s.title}`;
 updateSum();
}
function go(n) { S.step = Math.min(STEPS.length, Math.max(1, n)); save(); render(); scrollTo(0, 0); }

document.addEventListener('click', e => {
 const t = e.target.closest('button'); if (!t) return; const d = t.dataset, w = work(S.pod);
 if (t.id === 'play') return demo.playing ? stopDemo() : startDemo();
 if (e.isTrusted && demo.playing) stopDemo(); // a real click takes over from the runthrough
 if (t.id === 'prev') return go(S.step - 1);
 if (t.id === 'next') return go(S.step + 1);
 if (t.id === 'reset') { if (confirm('Clear all pod names, submissions, and results on this browser?')) { S = blank(); save(); render(); } return; }
 if (d.act === 'close-detail') return $('#detail').close();
 if (d.detail) { const [title, body] = detail(d.detail); $('#detail-title').textContent = title; $('#detail-body').innerHTML = body; if (!$('#detail').open) $('#detail').showModal(); return; }
 if (d.go) { $('#detail').close(); return go(+d.go); }
 if (d.podgo) { S.pod = d.podgo; S.reeval = true; return go(13); }
 if (d.pod) S.pod = d.pod;
 else if (d.dept) { S.dept = +d.dept; S.file = null; }
 else if (d.file) S.file = d.file;
 else if (d.mark) { const m = S.marks[S.pod] ??= []; m[+d.mark] = m[+d.mark] === d.v ? null : d.v; }
 else if (d.act === 'reveal') S.revealed = true;
 else if (d.act === 'add') w.rubric.push({text:'', points:'', mustPass:false});
 else if (d.act === 'del') w.rubric.splice(+d.i, 1);
 else if (d.act === 'example') { if (w.deliverable.trim() && !confirm('Replace this pod’s work with the rehearsal example?')) return; Object.assign(w, {deliverable:SEATS[S.pod].golden, rubric:SEATS[S.pod].rubric.map(r => ({text:r.text, points:r.points, mustPass:r.mustPass})), example:true, submitted:false}); S.marks[S.pod] = []; }
 else if (d.act === 'submit') { w.submitted = true; S.marks[S.pod] = []; }
 else if (d.act === 'reeval') S.reeval = true;
 else if (d.act === 'train') { save(); render(); return train(); }
 else if (d.act === 'run-baseline') return replay(S.pod, false);
 else if (d.act === 'run-trained') return replay(S.pod, true);
 else if (d.act === 'rerun-baseline') { S.baseline[S.pod] = false; render(); return replay(S.pod, false); }
 else if (d.act === 'rerun-trained') { S.trainedRun[S.pod] = false; render(); return replay(S.pod, true); }
 else return;
 save(); render();
});
// Typing saves without re-rendering, so focus and cursor position are kept.
document.addEventListener('input', e => {
 const d = e.target.dataset, w = work(S.pod);
 if (d.name) S.names[d.name] = e.target.value;
 else if (d.f) { w[d.f] = e.target.value; w.example = false; w.submitted = false; }
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
 {say:'Meet the company and open one kind of data', run:async d => { await d.wait(1500); await d.click('[data-detail="type:0"]', 2600); await d.click('[data-act="close-detail"]', 400); }},
 {say:'Open a real record from the company files', run:async d => { await d.click('[data-file="June bank statement"]', 2800); }},
 {say:'The executive engagement: prepare for the first audit', run:async d => { await d.wait(2600); }},
 {say:'Break it into 10 tasks and assign 4 pods', run:async d => { await d.click('[data-act="reveal"]', 1500); for (const [p, n] of [['A','Ana and Ben'],['B','Chloe and Dev'],['C','Emre and Fay'],['D','Gus and Hana']]) await d.type(`[data-name="${p}"]`, n); await d.wait(1800); }},
 {say:'Each pod gets its task and packet', run:async d => { await d.click('[data-detail="pod:A"]', 2600); await d.click('[data-act="close-detail"]', 400); }},
 {say:'Pod A writes its reference answer from the evidence', run:async d => { await d.click('[data-act="example"]', 3200); }},
 {say:'Pod A writes its rubric: 10 checks, 100 points', run:async d => { await d.wait(3200); }},
 {say:'Pod A submits its task for review', run:async d => { await d.click('[data-act="submit"]', 2200); }},
 {say:'A baseline agent attempts Pod A’s task', run:async d => { await d.click('[data-act="run-baseline"]'); await d.until(() => S.baseline.A); await d.wait(3200); }},
 {say:'Pod A grades the agent, 1 check at a time', run:async d => { for (const [i, r] of SEATS.A.rubric.entries()) await d.click(`[data-mark="${i}"][data-v="${r.pass ? 'pass' : 'fail'}"]`, 350, 350); await d.wait(2600); }},
 {say:'Train the agent on expert data', run:async d => { await d.click('[data-act="train"]'); await d.until(() => S.trained); await d.wait(1500); }},
 {say:'The trained agent attempts the same task', run:async d => { await d.click('[data-act="run-trained"]'); await d.until(() => S.trainedRun.A); await d.wait(1500); await d.click('[data-detail="diff:"]', 3200); await d.click('[data-act="close-detail"]', 400); }},
 {say:'Evaluate again with the same rubric', run:async d => { await d.click('[data-act="reeval"]', 4500); }},
 {say:'Recap: create, evaluate, train, re-evaluate', run:async d => { await d.wait(5000); }}
];
function demoBar(i) {
 $('#demo-bar').hidden = !demo.playing;
 $('#play').textContent = demo.playing ? '■ Stop demo' : demo.done ? '↻ Replay demo' : '▶ Play demo';
 if (i === undefined) return;
 $('#demo-say').textContent = DEMO[i].say; $('#demo-count').textContent = `${i + 1} / ${DEMO.length}`; $('#demo-fill').style.width = `${(i + 1) / DEMO.length * 100}%`;
}
function stopDemo() { demo.id++; demo.playing = false; document.querySelectorAll('.demo-target').forEach(el => el.classList.remove('demo-target')); demoBar(); }
async function startDemo() {
 if ((Object.keys(S.work).length || S.revealed || S.trained) && !confirm('The demo starts from a clean session. Clear the current work on this browser?')) return;
 const id = ++demo.id; demo.playing = true; demo.done = false; $('#detail').close(); S = blank(); save();
 const wait = ms => new Promise((res, rej) => setTimeout(() => id === demo.id ? res() : rej('stopped'), ms / DEMO_SPEED));
 const d = {wait,
  async click(sel, after = 0, before = 700) { const el = $(sel); if (!el) return; el.scrollIntoView({block:'center', behavior:'smooth'}); el.classList.add('demo-target'); await wait(before); el.classList.remove('demo-target'); el.click(); await wait(after); },
  async type(sel, text) { const el = $(sel); if (!el) return; el.classList.add('demo-target'); for (let n = 1; n <= text.length; n++) { el.value = text.slice(0, n); await wait(35); } el.dispatchEvent(new Event('input', {bubbles:true})); el.classList.remove('demo-target'); },
  async until(done) { for (let n = 0; n < 600 && !done(); n++) await wait(100 * DEMO_SPEED); }};
 try { for (let i = 0; i < DEMO.length; i++) { go(i + 1); demoBar(i); await DEMO[i].run(d); } demo.done = true; } catch (stopped) { if (stopped !== 'stopped') throw stopped; return; }
 demo.playing = false; demoBar();
}
// The narrative page links to a step with #step-N.
const linked = location.hash.match(/^#step-(\d+)$/); if (linked) S.step = Math.min(STEPS.length, Math.max(1, +linked[1]));
render();
if (new URLSearchParams(location.search).has('demo')) startDemo(); // share link: ?demo starts the runthrough
