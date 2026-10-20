/* All presenter-facing copy lives here. Edit text freely; keep the number of steps in sync with app.js views. */
const STEPS = [
 {
  "act": "The company",
  "time": "00:00–04:00",
  "title": "Cirrus Sleep: A company that sells pillows",
  "sub": "A simulated company with a complete year of real working records. Open any department to see them.",
  "say": "Cirrus Sleep is a company that never existed. Experts built its entire first year: the books, contracts, payroll, board decks, support tickets, and months of internal Slack. Over a thousand files, all connected. Here it is department by department. Open any file and you see the real record. Everything you do today comes from these records.",
  "cue": "Read out 2 or 3 of the numbers, then open 2 departments and a day of Slack. Introduce Simulated Virtual Company (SVC) once.",
  "disclose": "Counts come from the Cirrus Sleep Y1 corpus. Previews are short excerpts of raw business records; task answers and rubrics are excluded. Do not claim the data can never leak into training sets.",
  "short": "Company"
 },
 {
  "act": "The task",
  "time": "04:00–08:00",
  "title": "Task breakdown: from a 100-hour job to your task",
  "sub": "The executive job (L3) splits into department tasks (L2), which split into small tasks (L1). You do one real L1.",
  "say": "This is the objective of the task we will work on today. The controller has to get Cirrus Sleep ready for its first external audit. It is roughly 100 hours of professional work, and every answer has to come from the company files. No one person does a 100-hour job in one go. It splits into 10 department tasks of 10 to 20 hours each, and each of those splits into small, itemized tasks of 1 to 3 hours. Today you will do one of those small tasks: a real task from the benchmark, with the same prompt our experts shipped.",
  "cue": "Reveal the L3 brief first: role, objective, output, evidence. Then break it into the 10 L2 tasks and open the highlighted one to show its L1 tasks. Hand out the packets and give the rule: use only these files.",
  "disclose": "L3 means the executive capstone level. The prompt is abridged. Confirm with Jeff which L3 sits above L2-04 (board model inputs); the audit framing may need to change. Real hierarchy: L2-04 (FY2021 board model inputs) and its six L1 tasks from the pilot set. The other nine L2 cards are from the earlier demo app. L3 about 100 hours, L2 10–20 hours, L1 1–3 hours.",
  "short": "Breakdown"
 },
 {
  "act": "Create the task",
  "time": "08:00–30:00",
  "title": "Golden answer: do the task yourself",
  "sub": "The expert’s correct answer. Today, the expert is you.",
  "say": "Complete the task yourself, using only the files in your packet. Connect every conclusion to its source. If the records disagree, say so. Your answer is the golden answer: the standard every AI attempt is measured against. You are doing exactly what our experts do.",
  "cue": "Keep the big screen quiet. Help with navigation and arithmetic, not findings. Remind pods to cite file names at the midpoint. For a quick run, open See expert’s answer, copy it, and paste it into the answer box.",
  "disclose": "Real task L1-04-01. The prompt on screen is summarized from the rubric until the exact shipped prompt is added. Source tabs are excerpts of Cirrus_Sleep_Canonical_Facts_Trusted.xlsx.",
  "short": "Golden answer"
 },
 {
  "act": "Create the task",
  "time": "30:00–48:00",
  "title": "Rubric: define what a correct answer must do",
  "sub": "A checklist of requirements worth 100 points. When it is complete, submit your task.",
  "say": "Think of a teacher’s marking scheme for an essay. Each line is something a correct answer must do, with points for how much it matters. Some lines are must-pass: miss one and the whole attempt fails, like inventing a number or trusting an unsigned document. When every line is filled in and the points total 100, submit. You have just completed a real task from the benchmark.",
  "cue": "Show one neutral example criterion. Do not reveal the expected answer. Then capture each pod’s work on the laptop and submit.",
  "disclose": "The 100-point total is a format check. Correctness still needs expert review. Structural checks only. An expert still reviews evidence before a real task ships.",
  "short": "Rubric"
 },
 {
  "act": "Evaluate the agent",
  "time": "48:00–56:00",
  "title": "Run eval: three frontier agents try your task",
  "sub": "Each model gets the same prompt and files you had. The rubric scores every check.",
  "say": "All three agents got exactly what you got. Claude Opus 5 scored 97 and Gemini 3.1 Pro 91. GPT-5.6 Sol got every number right, but it cited a spreadsheet tab that does not exist, so a must-pass check disqualified it. On a short task like this, agents mostly do well, and we expect that. Here is the scoring, check by check. Same numbers, different outcomes: the agent that invented a source loses the must-pass check and the whole attempt fails. In training, this scoring runs automatically on every attempt.",
  "cue": "Press Run and let the replay play. Then read the three results. Open GPT-5.6 Sol’s answer and point at the made-up “P&L Monthly” source. Then open the check-by-check grades and stop on GPT-5.6 Sol’s check O3.",
  "disclose": "Real recorded results from the L1 pilot runs (July 2026). Model versions, effort settings, and harnesses (Claude Opus 5 xhigh with Claude Code, GPT-5.6 Sol xhigh with Codex, Gemini 3.1 Pro high with Gemini CLI) are best assumptions; confirm with Jeff before press. The replay animates each saved answer; no model is called live.",
  "short": "Model eval"
 },
 {
  "act": "The gap",
  "time": "56:00–60:00",
  "title": "The catch: the same numbers inside a bigger job",
  "sub": "Your task on its own, then the task that combines all five small tasks, with how each model did.",
  "say": "You did this in about 40 minutes, and two of three agents passed. Now here is the bigger job it belongs to: all five small tasks combined into one board-inputs workbook. Gemini 3.1 Pro got the quarterly numbers right on its own: 8,000, 28,000, 48,000, 88,000. Inside the bigger job it invented different quarters, 40,000, 45,000, 52,000, 47,000, that still add up to $172,000, and it was voided. Every agent lost points. Short tasks are easy; long, real work is where agents break. That is the gap CEO Bench measures.",
  "cue": "Read the two score rows, press the button, then show the two Gemini tables side by side. Point at how the invented quarters still add up to $172,000. Then read the two total rows.",
  "disclose": "Real recorded results from the pilot: L1-04-06 assembles L1-04-01 to L1-04-05 into the board-inputs workbook, the closest real evidence to the L2-04 deliverable. L2-04 model runs themselves are not available. Confirm model versions before naming them to press.",
  "short": "The catch"
 },
 {
  "act": "Train the agent",
  "time": "60:00–63:00",
  "title": "Post-training: Reinforcement learning to hill-climb the eval",
  "sub": "This task is one of about 30 in the training set. A separate set of tasks is held out for evaluation.",
  "say": "Here is one task from the training set: L1-04-02, the treatment of the $12,000 Apex credit. It is similar to yours and uses the same company files, but it is a different task. Yours is held out for evaluation; training on it would just teach the model the answer. For each training task, the experts produce the source files, a golden answer, a rubric with weights and must-pass gates, graded attempts, and grader notes. The rubric is the reward, and reinforcement learning hill-climbs it across the whole training set. The curve shows the average reward across the training set climbing as training runs.",
  "cue": "Open Preview the dataset and read a few rows. Point out that this is a different task from theirs, and that theirs is held out. Then press Train on the expert dataset.",
  "disclose": "The training-task data is real (L1-04-02 pilot files). The training-set size (about 30, from the roughly 30 L1s that passed QC), the reward definition, and the training run are illustrative.",
  "short": "Training"
 },
 {
  "act": "Train the agent",
  "time": "63:00–67:00",
  "title": "After training: the bigger job, graded again",
  "sub": "The voided run from the last screen, then the same job after training, scored on the same checks.",
  "say": "On the left is the run that was voided on the last screen, exactly as it happened: invented quarters that happen to add up. After training, the same job comes back with quarters that match the records, each traced to its source, and every must-pass check met. Same checks, a much higher score. That is how Turing helps labs close the gap between short tasks and real work.",
  "cue": "Show the real voided run on the left. Press Run the trained agent. When it finishes, read the score and the checks that flipped.",
  "disclose": "The before run is real (Gemini 3.1 Pro on L1-04-06, July 2026 pilot). The after-training output and scores are illustrative; no real post-training run exists for this demo. Do not present the after column as a measured result.",
  "short": "After training"
 },
 {
  "act": "Recap",
  "time": "67:00–69:00",
  "title": "Congrats, you trained superintelligence today",
  "sub": "Create a task, evaluate, find the gap, train, and evaluate again.",
  "say": "Congrats! You trained your own superintelligence. You created a task and evaluated frontier agents on it. When they broke down on the bigger job, you provided expert data and used reinforcement learning to help them improve. You then evaluated again and found the agent had learned to do the job well. Now you can use this specialized agent reliably to complete similar tasks. You are officially an expert in the Turing network. This is how Turing helps frontier labs such as OpenAI, Anthropic, Google DeepMind, and Meta specialize their agents to deliver real economic impact. We are also taking the same data factory to help the Fortune 500 enterprises train their own custom models.",
  "cue": "Show the loop. Open questions after this screen.",
  "disclose": "Supplied summary text, edited to match the flow (agents broke down on the bigger job), with the POTUS line removed and the enterprise line added. It names 4 labs; confirm that is approved.",
  "short": "Recap"
 }
];
/* Step 3: the L3 task brief. Each row opens its detail. */
const MANDATE = [
 {label:'Your role', value:'Controller', detail:'The controller owns the company’s accounting records and is the person an auditor will question. The task is written in this role’s voice.'},
 {label:'Your objective', value:'Prepare Cirrus Sleep for its first external audit', detail:'The company has never been audited. The controller has to show that the year’s numbers are supported by records an outside firm can rely on.'},
 {label:'Your output', value:'Audit-readiness file', detail:'A working file an audit firm could pick up: reconciliations, an evidence tracker, a governance record, and a list of open blockers with owners.'},
 {label:'Your evidence', value:'The supplied company records only', detail:'Every number and conclusion must be derivable from files that ship with the task. If the records do not establish something, the answer has to say so.'}
];
const HELP = {criterion:['What a good criterion looks like', 'A criterion is 1 checkable requirement. Someone else should be able to read the answer and decide “met” or “not met” without guessing.<br><br><b>Good:</b> “Reports the bank closing balance as $118,000.”<br><b>Too vague:</b> “Understands the cash position.”<br><br>Make a criterion must-pass when missing it is a professional-integrity failure: inventing a number, missing a conflict in the records, or relying on an unsigned document.']};
/* Today's task prompt, reconstructed from the L1-04-01 rubric's prompt-sourced checks. The Step 3 button replaces it with the shipped prompt. */
const PROMPT_DEFAULT = 'Using Cirrus_Sleep_Canonical_Facts_Trusted.xlsx, build a tab named Fulfillment_Shipping_by_Q showing FY2021 fulfillment and shipping cost for Q1 to Q4 and the full year, with columns Quarter | Fulfillment | Shipping | Total. Cite the source tab and cell for every figure. In a basis note, say whether the full-year total is gross or net of the $12,000 Apex SLA credit, with evidence. Do not apply the credit here; that is handled in task L1-04-02. If the records do not separate fulfillment from shipping, flag it rather than estimate.';
if(typeof module!=='undefined') module.exports={PROMPT_DEFAULT,STEPS,MANDATE,HELP};
