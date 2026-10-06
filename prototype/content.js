/* All presenter-facing copy lives here. Edit text freely; keep the number of steps in sync with app.js views. */
const STEPS = [
 {
  "act": "The company",
  "time": "00:00–04:00",
  "title": "Cirrus Sleep: a company built to test AI",
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
  "cue": "Keep the big screen quiet. Help with navigation and arithmetic, not findings. Remind pods to cite file names at the midpoint.",
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
  "title": "Model eval: three AI models try your task",
  "sub": "Each model gets the same prompt and files you had. The rubric scores every check.",
  "say": "Three of today’s leading AI models got exactly what you got. Claude scored 97 and Gemini 91. ChatGPT got every number right, but it cited a spreadsheet tab that does not exist, so a must-pass check disqualified it. On a short task like this, models mostly do well, and we expect that. Same numbers, different outcomes: the model that invented a source loses the must-pass check and the whole attempt fails. In training, this scoring runs automatically on every attempt.",
  "cue": "Press Run and let the replay play. Then read the three results. Open ChatGPT’s answer and point at the made-up “P&L Monthly” source. Then open the check-by-check grades and stop on ChatGPT’s check O3.",
  "disclose": "Real recorded results from the L1 pilot runs. Confirm model versions and run dates with Jeff before naming them to press. The replay animates the saved answer; no model is called live. Recorded grades from the pilot rubric analysis.",
  "short": "Model eval"
 },
 {
  "act": "The gap",
  "time": "56:00–60:00",
  "title": "The catch: the same numbers inside a bigger job",
  "sub": "Your task on its own, then the task that combines all five small tasks, with how each model did.",
  "say": "You did this in about 40 minutes, and two of three models passed. Now here is the bigger job it belongs to: all five small tasks combined into one board-inputs workbook, with the same quarterly numbers inside. Gemini got those numbers right on their own. Inside the combined task, it got the very same numbers wrong and could not trace its sources, so it was voided. Every model lost points. Short tasks are easy; long, real work is where models break. That is the gap CEO Bench measures.",
  "cue": "Read the two score rows: on its own, then inside the bigger job. Press the button, then point at the highlighted fulfillment rows in Gemini’s column.",
  "disclose": "Real recorded results from the pilot: L1-04-06 assembles L1-04-01 to L1-04-05 into the board-inputs workbook, the closest real evidence to the L2-04 deliverable. L2-04 model runs themselves are not available. Confirm model versions before naming them to press.",
  "short": "The catch"
 },
 {
  "act": "Train the agent",
  "time": "60:00–63:00",
  "title": "Reinforcement learning: train on the expert data",
  "sub": "Preview the expert-curated dataset, then train. Every expert input is part of the training signal.",
  "say": "Before training starts, here is everything the experts produced, packaged the way an AI lab receives it: the task and its source files, the golden answer, the rubric with its weights and must-pass gates, every graded attempt, and the grader notes. AI labs receive the full set; here you can preview a few rows. Each of these is a dimension of training. The files are the environment, the golden answer shows what good looks like, the rubric is the reward, the must-pass checks are hard limits, and the graded attempts are the examples the model learns from.",
  "cue": "Open Preview the dataset and read a few rows. Then read the “Used in training as” column and press Train on the expert dataset.",
  "disclose": "The dataset contents are real L1-04-01 pilot data. Journalists see a preview only; nothing is downloadable. The reward definition and the training run are illustrative.",
  "short": "Training"
 },
 {
  "act": "Train the agent",
  "time": "63:00–67:00",
  "title": "After training: the long task, graded again",
  "sub": "The same agent on the department task, before and after training, scored on the same checks.",
  "say": "This is the same agent after training, on the department task. It now keeps the cost net of the credit, cites only tabs that exist, and holds the lost sales as a memo. We grade it on the same checks, and the judgment it lost before now holds up. That is how Turing helps labs close the gap between short tasks and real work.",
  "cue": "Press Run trained agent. When it finishes, read the checks that flipped and the new score.",
  "disclose": "Pre-built checkpoint and recorded replay. No model is called live. Placeholder checks and illustrative results until real runs exist. Claim improvement on these checks only.",
  "short": "After training"
 },
 {
  "act": "Recap",
  "time": "67:00–69:00",
  "title": "Congrats, you trained superintelligence today",
  "sub": "Create a task, evaluate, find the gap, train, and evaluate again.",
  "say": "Congrats! You trained your own superintelligence, or SI, as our POTUS would say. You created a task and evaluated a frontier agent on it. When the agent could not complete the task, you provided expert data and used reinforcement learning to help it improve. You then evaluated the model again and found that it had learned to perform the task well. Now you can use this specialized agent reliably to complete similar tasks. You are officially an expert in the Turing network. This is how Turing helps frontier labs such as OpenAI, Anthropic, Google DeepMind, and Meta specialize their agents to deliver real economic impact.",
  "cue": "Show the loop. Open questions after this screen.",
  "disclose": "Supplied summary text. Under Jeff’s flow the agent passed the small task and lost points in the long one, so \"when the agent could not complete the task\" needs Chander’s rewrite. Also confirm the POTUS line, \"frontier agent\", the \"reliably\" claim, and naming the 4 labs.",
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
if(typeof module!=='undefined') module.exports={STEPS,MANDATE,HELP};
