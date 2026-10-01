/* All presenter-facing copy lives here. Edit text freely; keep 14 entries. */
const STEPS = [
 {
  "act": "The company",
  "time": "00:00–02:00",
  "title": "Meet Cirrus Sleep",
  "sub": "Introduce the company and its data. No task yet.",
  "say": "Cirrus Sleep is a fictional company built to evaluate artificial intelligence through professional work. Its dataset contains 1,100+ files covering a complete fiscal year: the books, contracts, payroll, board decks, and months of internal Slack. Everything you work with today comes from these files.",
  "cue": "Open the company introduction. Keep the file count and the 5 data types visible. Introduce Simulated Virtual Company (SVC) once, then use “the company” in the rest of the walkthrough.",
  "disclose": "The 1,100+ count comes from the supplied demo outline. Attach the approved corpus manifest to the production asset list. Do not state that fictional origin guarantees permanent protection from training-data contamination."
 },
 {
  "act": "The company",
  "time": "02:00–05:00",
  "title": "Explore a complete fiscal year",
  "sub": "Make the company tangible through its records.",
  "say": "You can follow the company through ledgers, statements, contracts, and decisions. A professional task may require you to connect several records and decide what each one establishes. Every conclusion you submit must be supported by the files provided.",
  "cue": "Invite a journalist to choose a department. Open a public document, retain its filename and date, then open a related record. Do not expose the exercise’s answer or planted issue during this introduction.",
  "disclose": "Use only approved, already-public task records for full previews. The local prototype contains illustrative excerpts; retain its rehearsal label until the files are replaced."
 },
 {
  "act": "The breakdown",
  "time": "05:00–07:00",
  "title": "Prepare for the first external audit",
  "sub": "Establish the executive engagement and its professional scale.",
  "say": "A practitioner starts with an executive engagement, written in the voice of the person responsible for the work. Here, the controller prepares the company for its first external audit, representing roughly 100 hours of professional effort. The answer has to be derivable from the files shipped with the task.",
  "cue": "Reveal the role, objective, deliverable, and evidence boundary in that order. Label the source prompt “Abridged” if the on-screen version is shortened. Explain that level 3 (L3) is the executive task level, distinct from the Facilitator’s Room interface.",
  "disclose": "Use the approved public engagement wording. “Roughly 100 hours” is the supplied task-design estimate, not a measured model runtime."
 },
 {
  "act": "The breakdown",
  "time": "07:00–10:00",
  "title": "Explore 10 independent tasks",
  "sub": "Explain derivative tasks and assign 1 task to each of the 4 pods.",
  "say": "Each level 2 (L2) task is a complete 10–20 hour assignment with its own prompt, expert reference answer, and rubric. These derivative tasks share the company’s story, and each is graded independently. Today, each of your 4 pods owns 1 of these tasks from start to finish: you’ll create it, evaluate an agent on it, and help that agent improve.",
  "cue": "Reveal 10 equal cards using a short stagger. Use a shared family connection, with no sequence arrows between tasks. Highlight the cash & banking, governance & equity, audit evidence, and revenue & orders tasks, and add each pod’s journalist names to its card.",
  "disclose": "Pods do different tasks. A derivative task must be independently answerable and gradeable. The reduced exercise does not reproduce the duration or complexity of the full professional assignment. Task names and packets match the 4 seats in the supplied demo app."
 },
 {
  "act": "Creating a task",
  "time": "10:00–16:00",
  "title": "Join your pod",
  "sub": "Give every pod a clear assignment and working method.",
  "say": "Your packet contains 2–4 source files and a short professional assignment. Work from the evidence, record your reasoning, and make any uncertainty visible. Your pod will complete an expert reference answer, also called a golden, and then write the criteria used to grade another attempt, including an AI agent’s.",
  "cue": "Explain the deliverable format and source references. Show the empty workstation without a prefilled answer. Explain the single-laptop rotation: parallel paper work in pods, then sequential capture in the browser. Start the 60-minute workshop clock.",
  "disclose": "Give participants the prompt and approved source files only. Do not distribute expert reference answers or benchmark rubrics. Supply blank answer and rubric worksheets."
 },
 {
  "act": "Creating a task",
  "time": "16:00–38:00",
  "title": "Build your answer from the evidence",
  "sub": "Let the journalists experience the judgment required by the task.",
  "say": "Complete the deliverable yourself and connect each conclusion to its source. If the records disagree or a document is missing, state what you can establish and what still needs investigation. Avoid filling an evidence gap with an assumption presented as fact.",
  "cue": "Keep the big screen quiet, showing the time and work instructions. Support navigation and arithmetic questions without giving away findings. At the midpoint, remind pods to cite filenames or packet references.",
  "disclose": "Findings must come from each pod’s actual packet. Do not promise that every pod finds the intended issue. Preserve the pod’s answer for subsequent review."
 },
 {
  "act": "Creating a task",
  "time": "38:00–54:00",
  "title": "Define what a correct answer requires",
  "sub": "Make expert judgment explicit and evidence-based.",
  "say": "Think about how a teacher grades an essay: each criterion describes something the answer must do, with points for its importance. A full professional task has 10–60 weighted criteria totaling 100 points; this exercise uses 10–20. A must-pass miss fails the attempt, such as fabricating a number, missing the planted conflict, or relying on an unsigned document. The expert’s own reference answer must earn 100% against its rubric before a real task ships.",
  "cue": "Show 1 neutral example of a criterion, its weight, its evidence reference, and its pass condition. Do not reveal a pod-specific expected answer. Explain that criteria must assess the requested work and that must-pass gates need a professional-integrity rationale.",
  "disclose": "The 100-point structure is a format check. Correctness requires source review. Independent expert review of a production task cannot be replaced by the workshop’s brief check."
 },
 {
  "act": "Creating a task",
  "time": "54:00–70:00",
  "title": "Submit your task for review",
  "sub": "Show the handoff from authoring to review. The pod’s task is now complete.",
  "say": "Each pod now submits its deliverable and rubric into review. The app checks that the required fields are present and the points total 100; an expert still checks the evidence and the answer. Your task becomes visible on the presentation screen when you submit it. Next, we’ll find out how an AI agent does on it.",
  "cue": "Rotate pods through the laptop, allowing about 4 minutes each and starting earlier when possible. Capture the full deliverable, enter the rubric, and ask the pod to confirm the text and weights before submission. Open 1 submission on screen and demonstrate a source check.",
  "disclose": "File or photo capture is a production requirement for fast paper handoff. The current prototype accepts typed memos only. For a prototype dry run, use short typed summaries and label sample submissions as rehearsal examples."
 },
 {
  "act": "Evaluating the agent",
  "time": "70:00–73:00",
  "title": "Run a baseline agent on your task",
  "sub": "Evaluate an open-weights agent on the task each pod just created.",
  "say": "This is an open-weights AI agent, before any specialized training. We’ll give it your pod’s task: the same prompt and the same files you had. Watch it open the records, work through them, and produce a deliverable. Then we’ll see how it scored.",
  "cue": "Select a pod’s task and press “Run baseline.” Play the agent’s recorded computer-use session (about 60 seconds, sped up) showing it open files, build a worksheet, and write its memo. Then reveal the pre-run evaluation result: overall score, must-pass status, and the 2 criteria it missed. Repeat the reveal for the other 3 pods, or show all 4 results together.",
  "disclose": "Simulated run. The button replays a recorded session and a pre-computed evaluation; no model is invoked live. Record the model name, harness, task version, and run date for each recording. The pre-run score uses Turing’s expert rubric for the task, not the pod’s new rubric."
 },
 {
  "act": "Evaluating the agent",
  "time": "73:00–79:00",
  "title": "Grade the agent with your rubric",
  "sub": "Put the journalists in the grader’s seat, 1 criterion at a time.",
  "say": "You wrote the standard; now apply it. For each criterion, read what your rubric requires, find the matching part of the agent’s deliverable, and mark it met or not met. Points add up as you go. If the agent misses a must-pass criterion, the attempt fails, no matter how many points it earned elsewhere.",
  "cue": "Hand each pod its printed agent deliverable. Give pods 4 minutes to score their own rubric on paper: met, not met, or unclear for each criterion. Then project 1 pod’s scoring screen: criterion on the left, the highlighted passage of the agent’s deliverable on the right, and 3 buttons below. Walk through 3 criteria live, including 1 must-pass, while the total updates. Compare the pod’s score with the expert score from scene 9.",
  "disclose": "This is the pod’s own judgment of a recorded agent output. Unclear criteria stay unscored and are excluded from any complete-score claim. Do not preassign failure to pod-written criteria; the agent may pass some of them."
 },
 {
  "act": "Training the agent",
  "time": "79:00–82:00",
  "title": "Train the agent on expert data",
  "sub": "Show how expert data and a rubric reward teach the agent the task.",
  "say": "The agent failed because it didn’t know what an expert knows. Your golden answer and your rubric are exactly that knowledge. Here, we combine your work with expert-built variants of the same task into a training dataset, and use the rubric score as the reward in reinforcement learning. Each training step, the agent tries, gets graded, and gets better at what earns points.",
  "cue": "Show the pod’s dataset card: its golden, its rubric as the reward, and the count of expert-built task variants. Press “Start training run.” Play the pre-recorded reward curve climbing over training steps (about 45 seconds). Keep the evaluation task visibly separate from the training data.",
  "disclose": "Simulated run with pre-built data. Train on task variants and evaluate on the pod’s held-out task, so the improvement is not memorization of the answer. Label dataset size and curve values as illustrative unless they come from an actual run."
 },
 {
  "act": "Training the agent",
  "time": "82:00–84:00",
  "title": "Run the trained agent",
  "sub": "Show the trained checkpoint working through the same task.",
  "say": "This is the same agent after training. Same prompt, same files. Watch where it slows down: it checks the conflicting records, cites its sources, and flags what it can’t establish.",
  "cue": "Load the trained checkpoint and press “Run.” Play its recorded computer-use session side by side with the baseline session from scene 9. Pause at 1 moment where the trained agent does something the baseline skipped.",
  "disclose": "Simulated run using a pre-built checkpoint and recorded session; no model is invoked live. Record checkpoint identifier, harness, task version, and run date."
 },
 {
  "act": "Training the agent",
  "time": "84:00–87:00",
  "title": "Evaluate the trained agent again",
  "sub": "Rerun the rubric and show the score improvement on each pod’s task.",
  "say": "We run the same evaluation with the same rubric. Before training, the agent scored 38 out of 100 and failed a must-pass gate. After training, it scores 84 and clears every gate. That’s the effect of your expert data on this task.",
  "cue": "Press “Re-evaluate.” Reveal before and after scores side by side for the projected pod, criterion by criterion, then the totals. Show the other 3 pods’ before and after totals in a row below.",
  "disclose": "Scores shown are illustrative fixture values until real runs exist. Report points and must-pass status separately. Claim improvement on this task only, not general capability."
 },
 {
  "act": "Training the agent",
  "time": "87:00–89:00",
  "title": "Congrats, you trained superintelligence today",
  "sub": "Close on the full loop and what it means for frontier labs.",
  "say": "Congrats! You trained your own superintelligence, or SI, as our POTUS would say. You created a task and evaluated a frontier agent on it. When the agent could not complete the task, you provided expert data and used reinforcement learning to help it improve. You then evaluated the model again and found that it had learned to perform the task well. Now you can use this specialized agent reliably to complete similar tasks. You are officially an expert in the Turing network. This is how Turing helps frontier labs such as OpenAI, Anthropic, Google DeepMind, and Meta specialize their agents to deliver real economic impact.",
  "cue": "Show the 4-step loop: create, evaluate, train, re-evaluate. Show each pod’s name with its before and after score. Open general questions after the close.",
  "disclose": "Narration is the supplied summary text. Before a press audience, confirm the “POTUS” line, the “frontier agent” wording (scene 9 uses an open-weights model), the “reliably” claim against a simulated result, and approval to name the 4 labs."
 }
];
/* Step 1 tiles. files = names of rehearsal fixtures in data.js that open from the detail panel. */
const DATA_TYPES = [
 {title:'Books and ledgers', blurb:'The accounting record of the year: general ledger, bank statements, and month-end close worksheets.', examples:['General ledger','Bank statements','Close worksheets'], files:['June bank statement','June close worksheet','June revenue summary']},
 {title:'Contracts', blurb:'Agreements and correspondence with outside parties, such as vendors and the audit firm.', examples:['Vendor agreements','CPA correspondence','Audit request log'], files:['CPA email thread','Audit request log']},
 {title:'Payroll', blurb:'Who works at the company and what they were paid.', examples:['Payroll register','Organization chart'], files:['Payroll register','Organization chart']},
 {title:'Board decks', blurb:'What the board discussed and approved: minutes, resolutions, and budget approvals.', examples:['Board minutes','Resolutions','Budget approvals'], files:['Q4 board minutes','Board resolution','Budget approval']},
 {title:'Internal Slack', blurb:'Months of internal messages. They show how decisions were actually made, and sometimes disagree with the formal records.', examples:['Finance channel','Operations channel','Leadership channel'], files:['Finance channel']},
 {title:'1 fiscal year', blurb:'Every file belongs to the same 12 months, so records can be checked against each other: orders against revenue, bank against books, minutes against approvals.', examples:['Monthly closes','Quarterly board meetings','Year-end audit preparation'], files:['June order summary','June revenue summary']}
];
/* Step 3 engagement brief. Each row opens its detail. */
const MANDATE = [
 {label:'Your role', value:'Controller', detail:'The controller owns the company’s accounting records and is the person an auditor will question. The task is written in this role’s voice.'},
 {label:'Your objective', value:'Prepare Cirrus Sleep for its first external audit', detail:'The company has never been audited. The controller has to show that the year’s numbers are supported by records an outside firm can rely on.'},
 {label:'Your output', value:'Audit-readiness file', detail:'A working file an audit firm could pick up: reconciliations, an evidence tracker, a governance record, and a list of open blockers with owners.'},
 {label:'Your evidence', value:'The supplied company records only', detail:'Every number and conclusion must be derivable from files that ship with the task. If the records do not establish something, the answer has to say so.'}
];
const HELP = {criterion:['What a good criterion looks like', 'A criterion is 1 checkable requirement. Someone else should be able to read the answer and decide “met” or “not met” without guessing.<br><br><b>Good:</b> “Reports the bank closing balance as $118,000.”<br><b>Too vague:</b> “Understands the cash position.”<br><br>Make a criterion must-pass when missing it is a professional-integrity failure: inventing a number, missing a conflict in the records, or relying on an unsigned document.']};
if(typeof module!=='undefined') module.exports={STEPS,DATA_TYPES,MANDATE,HELP};
