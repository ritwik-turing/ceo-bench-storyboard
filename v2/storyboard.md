# CEO Bench demo storyboard

Internal production plan · updated September 30, 2026

**89 minutes, plus questions. 5 acts. 14 scenes. A full 60-minute workshop.**

Journalists work in 4 pods. Each pod creates a task, evaluates a baseline agent on it, grades the agent with its own rubric, trains the agent with its expert data, and evaluates it again.

Open index.html for the interactive storyboard. Select any scene for its proposed screen, presenter narration, facilitator action, participant action, and transition cue. Use the left and right arrow keys to move between scenes. All fonts and logo assets are bundled for offline review.

## Changes in this revision

| Feedback | Change |
| --- | --- |
| Same task for all pods, or 1 each? | Each of the 4 pods owns 1 derivative task end to end. “Seat” is now “pod.” |
| Rename the presenter role | “Facilitator” is used throughout. |
| Scene 9: baseline run instead of the leaderboard | Scene 9 runs an open-weights agent on each pod’s task (simulated button, recorded computer use, pre-run result). Leaderboard removed. |
| Scene 10: make the journalist’s role obvious | Scene 10 is now a 3-step grading routine: read criterion, find evidence, mark met, not met, or unclear. Pods score on paper, then 1 pod scores live. |
| Scene 11: simulate post-training | Scene 11 shows a dataset card and a simulated reinforcement learning run with the rubric as reward. |
| Scenes 12 and 13: trained checkpoint and re-evaluation | Scene 12 replays the pre-built checkpoint side by side with the baseline. Scene 13 re-runs the rubric and shows the score change. |
| Remove the year 2 scene | Removed. |
| Add a summary step | Scene 14 uses the supplied summary text. |
| Show computer use | Scenes 9 and 12 use recorded computer-use sessions. |
| Use Jeff’s task details | Pod tasks keep the 4 tasks in Jeff’s demo app: cash & banking, governance & equity, audit evidence, and revenue & orders. Must-pass examples in scene 7 come from his methodology notes. Real task content (prompts, files, goldens) is still to be mocked from his packets. |

## Run of show

| Scene | Time | Act | Story beat |
| --- | --- | --- | --- |
| 1 | 00:00–02:00 | The company | Meet Cirrus Sleep |
| 2 | 02:00–05:00 | The company | Explore a complete fiscal year |
| 3 | 05:00–07:00 | The breakdown | Prepare for the first external audit |
| 4 | 07:00–10:00 | The breakdown | Explore 10 independent tasks |
| 5 | 10:00–16:00 | Creating a task | Join your pod |
| 6 | 16:00–38:00 | Creating a task | Build your answer from the evidence |
| 7 | 38:00–54:00 | Creating a task | Define what a correct answer requires |
| 8 | 54:00–70:00 | Creating a task | Submit your task for review |
| 9 | 70:00–73:00 | Evaluating the agent | Run a baseline agent on your task |
| 10 | 73:00–79:00 | Evaluating the agent | Grade the agent with your rubric |
| 11 | 79:00–82:00 | Training the agent | Train the agent on expert data |
| 12 | 82:00–84:00 | Training the agent | Run the trained agent |
| 13 | 84:00–87:00 | Training the agent | Evaluate the trained agent again |
| 14 | 87:00–89:00 | Training the agent | You trained your own specialized agent |

## Operating assumptions

- L1 Facilitator’s Room means the presenter’s orchestration layer in this storyboard. L3 and L2 refer to task levels, not screens.
- One laptop and a big screen: pods work on paper in parallel, then rotate through capture on the same laptop. The facilitator manages the audience view.
- Prepare 4 pod packets, each containing its prompt, 2–4 approved public source files, a blank deliverable sheet, and a blank rubric sheet. Expert reference answers and benchmark rubrics appear on screen only.
- The 60-minute workshop includes orientation, 22 minutes of task work, 16 minutes of rubric work, and 16 minutes for capture. Validate the timing in a dry run.
- Scenes 9 to 13 are simulated. Buttons replay recorded computer-use sessions, a recorded training curve, and pre-computed evaluations. No model is called live. Because pods write their rubrics on the day, the pre-run scores use Turing’s expert rubric for each task; the pod’s own rubric is applied by hand in scene 10.
- Training uses expert-built variants of each task; the pod’s own task stays held out for evaluation.
- Full professional tasks use 10–60 weighted criteria; the workshop uses 10–20. All weights total 100. A production expert reference answer must score 100% against its own rubric before shipping.

## Scene-by-scene script

### Scene 01 · Meet Cirrus Sleep

**00:00–02:00 · 2 minutes · Act 1: The company**

**Purpose:** Establish the company and the work to be evaluated.

**On screen:** Meet Cirrus Sleep

**Presenter narration**

> Cirrus Sleep is a fictional company built to evaluate artificial intelligence through professional work. Its dataset contains 1,100+ files covering a complete fiscal year. You’ll see how experts turn those records into tasks and define what a correct deliverable must do.

**Facilitator action:** Open the company introduction. Keep the company profile and record count visible. Introduce Simulated Virtual Company (SVC) once, then use “the company” in the rest of the walkthrough.

**Journalist action:** Read the company profile. Consider what evidence you would need before accepting a financial or operational conclusion.

**Evidence and disclosure:** The 1,100+ count comes from the supplied demo outline. Attach the approved corpus manifest to the production asset list. Do not state that fictional origin guarantees permanent protection from training-data contamination.

**Transition:** “Let’s open the records behind that work.”

**Cue to continue:** Advance when the audience understands that the files are the working environment.

**Asset needed:** Company profile and approved corpus manifest.

**Build status:** Profile and count require production source mapping.

### Scene 02 · Explore a complete fiscal year

**02:00–05:00 · 3 minutes · Act 1: The company**

**Purpose:** Make the company tangible through its records.

**On screen:** Explore a complete fiscal year

**Presenter narration**

> You can follow the company through ledgers, statements, contracts, and decisions. A professional task may require you to connect several records and decide what each one establishes. Every conclusion you submit must be supported by the files provided.

**Facilitator action:** Invite a journalist to choose a department. Open a public document, retain its filename and date, then open a related record. Do not expose the exercise’s answer or planted issue during this introduction.

**Journalist action:** Choose a folder and inspect 2 related records. Identify how the records might be used together.

**Evidence and disclosure:** Use only approved, already-public task records for full previews. The local prototype contains illustrative excerpts; retain its rehearsal label until the files are replaced.

**Transition:** “Now the board asks the team to prepare for an external audit.”

**Cue to continue:** Return to the company view after 2 documents, then advance.

**Asset needed:** 2 approved public documents with filenames, dates, and provenance.

**Build status:** Replace local rehearsal excerpts before a source-backed press demo.

### Scene 03 · Prepare for the first external audit

**05:00–07:00 · 2 minutes · Act 2: The breakdown**

**Purpose:** Establish the executive engagement and its professional scale.

**On screen:** Prepare for the first external audit

**Presenter narration**

> A practitioner starts with an executive engagement, written in the voice of the person responsible for the work. Here, the controller prepares the company for its first external audit, representing roughly 100 hours of professional effort. The answer has to be derivable from the files shipped with the task.

**Facilitator action:** Reveal the role, objective, deliverable, and evidence boundary in that order. Label the source prompt “Abridged” if the on-screen version is shortened. Explain that level 3 (L3) is the executive task level, distinct from the Facilitator’s Room interface.

**Journalist action:** Read the mandate and name a department whose work would be relevant.

**Evidence and disclosure:** Use the approved public engagement wording. “Roughly 100 hours” is the supplied task-design estimate, not a measured model runtime.

**Transition:** “The same company events support 10 independent professional tasks.”

**Cue to continue:** Hold the complete mandate for a readable beat before the task reveal.

**Asset needed:** Approved executive brief with source identifier.

**Build status:** Narrative defined; exact public prompt needs mapping.

### Scene 04 · Explore 10 independent tasks

**07:00–10:00 · 3 minutes · Act 2: The breakdown**

**Purpose:** Explain derivative tasks and assign 1 task to each of the 4 pods.

**On screen:** Explore 10 independent tasks

**Presenter narration**

> Each level 2 (L2) task is a complete 10–20 hour assignment with its own prompt, expert reference answer, and rubric. These derivative tasks share the company’s story, and each is graded independently. Today, each of your 4 pods owns 1 of these tasks from start to finish: you’ll create it, evaluate an agent on it, and help that agent improve.

**Facilitator action:** Reveal 10 equal cards using a short stagger. Use a shared family connection, with no sequence arrows between tasks. Highlight the cash & banking, governance & equity, audit evidence, and revenue & orders tasks, and add each pod’s journalist names to its card.

**Journalist action:** Locate your pod’s card and take its packet.

**Evidence and disclosure:** Pods do different tasks. A derivative task must be independently answerable and gradeable. The reduced exercise does not reproduce the duration or complexity of the full professional assignment. Task names and packets match the 4 seats in the supplied demo app.

**Transition:** “You’ll complete the work first, then define how someone else’s answer should be assessed.”

**Cue to continue:** Advance once every pod has its task card and packet.

**Asset needed:** 10-task map, 4 pod prompts, pod assignments, and paper packets.

**Build status:** Current prototype supports task reveal and named assignments; relabel “seat” as “pod”.

### Scene 05 · Join your pod

**10:00–16:00 · 6 minutes · Act 3: Creating a task**

**Purpose:** Give every pod a clear assignment and working method.

**On screen:** Join your pod

**Presenter narration**

> Your packet contains 2–4 source files and a short professional assignment. Work from the evidence, record your reasoning, and make any uncertainty visible. Your pod will complete an expert reference answer, also called a golden, and then write the criteria used to grade another attempt, including an AI agent’s.

**Facilitator action:** Explain the deliverable format and source references. Show the empty workstation without a prefilled answer. Explain the single-laptop rotation: parallel paper work in pods, then sequential capture in the browser. Start the 60-minute workshop clock.

**Journalist action:** Read the prompt and packet. Check that the pod label and file references match. Ask clarifying questions about the assignment, not its solution.

**Evidence and disclosure:** Give participants the prompt and approved source files only. Do not distribute expert reference answers or benchmark rubrics. Supply blank answer and rubric worksheets.

**Transition:** “Start with the deliverable. Show what the records support.”

**Cue to continue:** Begin work when all 4 pods can state the output they owe.

**Asset needed:** 4 labeled pod packets, blank worksheets, pens, and permitted calculator.

**Build status:** Workstation exists; final paper packet assembly remains.

### Scene 06 · Build your answer from the evidence

**16:00–38:00 · 22 minutes · Act 3: Creating a task**

**Purpose:** Let the journalists experience the judgment required by the task.

**On screen:** Build your answer from the evidence

**Presenter narration**

> Complete the deliverable yourself and connect each conclusion to its source. If the records disagree or a document is missing, state what you can establish and what still needs investigation. Avoid filling an evidence gap with an assumption presented as fact.

**Facilitator action:** Keep the big screen quiet, showing the time and work instructions. Support navigation and arithmetic questions without giving away findings. At the midpoint, remind pods to cite filenames or packet references.

**Journalist action:** Produce a concise memo or worksheet as a pod. Identify relevant facts, document status, conflicting evidence, and a justified next action.

**Evidence and disclosure:** Findings must come from each pod’s actual packet. Do not promise that every pod finds the intended issue. Preserve the pod’s answer for subsequent review.

**Transition:** “Now write down what another answer must do to meet your standard.”

**Cue to continue:** Move to rubric authoring when each pod has a draft deliverable.

**Asset needed:** Source packets and pod-authored deliverables.

**Build status:** Paper work fits the one-laptop setup; prototype also supports typed memos.

### Scene 07 · Define what a correct answer requires

**38:00–54:00 · 16 minutes · Act 3: Creating a task**

**Purpose:** Make expert judgment explicit and evidence-based.

**On screen:** Define what a correct answer requires

**Presenter narration**

> Think about how a teacher grades an essay: each criterion describes something the answer must do, with points for its importance. A full professional task has 10–60 weighted criteria totaling 100 points; this exercise uses 10–20. A must-pass miss fails the attempt, such as fabricating a number, missing the planted conflict, or relying on an unsigned document. The expert’s own reference answer must earn 100% against its rubric before a real task ships.

**Facilitator action:** Show 1 neutral example of a criterion, its weight, its evidence reference, and its pass condition. Do not reveal a pod-specific expected answer. Explain that criteria must assess the requested work and that must-pass gates need a professional-integrity rationale.

**Journalist action:** Write 10–20 testable criteria, assign positive weights totaling 100, and mark justified must-pass gates. Check the draft reference answer against every criterion and revise unsupported or ambiguous wording.

**Evidence and disclosure:** The 100-point structure is a format check. Correctness requires source review. Independent expert review of a production task cannot be replaced by the workshop’s brief check.

**Transition:** “Let’s capture your deliverable and put the grading criteria into review.”

**Cue to continue:** Capture early finishers during this period to reduce the laptop queue.

**Asset needed:** Blank 10-row rubric sheet, weight total, and a neutral criterion example.

**Build status:** Prototype enforces criterion count, written text, positive weights, and a 100-point total.

### Scene 08 · Submit your task for review

**54:00–70:00 · 16 minutes · Act 3: Creating a task**

**Purpose:** Show the handoff from authoring to review. The pod’s task is now complete.

**On screen:** Submit your task for review

**Presenter narration**

> Each pod now submits its deliverable and rubric into review. The app checks that the required fields are present and the points total 100; an expert still checks the evidence and the answer. Your task becomes visible on the presentation screen when you submit it. Next, we’ll find out how an AI agent does on it.

**Facilitator action:** Rotate pods through the laptop, allowing about 4 minutes each and starting earlier when possible. Capture the full deliverable, enter the rubric, and ask the pod to confirm the text and weights before submission. Open 1 submission on screen and demonstrate a source check.

**Journalist action:** Verify the captured deliverable and rubric, then choose “Send to review.” Explain 1 criterion to the group. Keep paper materials with the facilitator under the event handling plan.

**Evidence and disclosure:** File or photo capture is a production requirement for fast paper handoff. The current prototype accepts typed memos only. For a prototype dry run, use short typed summaries and label sample submissions as rehearsal examples.

**Transition:** “You’ve created a task. Now let’s see whether an AI agent can do it.”

**Cue to continue:** Advance after the intended submissions are visible; do not invent a receipt for a missing submission.

**Asset needed:** Captured deliverables, rubric entries, and an agreed paper-handling procedure.

**Build status:** Live same-browser inbox works. File/photo upload and cross-device transport are not built.

### Scene 09 · Run a baseline agent on your task

**70:00–73:00 · 3 minutes · Act 4: Evaluating the agent**

**Purpose:** Evaluate an open-weights agent on the task each pod just created.

**On screen:** Run a baseline agent on your task

**Presenter narration**

> This is an open-weights AI agent, before any specialized training. We’ll give it your pod’s task: the same prompt and the same files you had. Watch it open the records, work through them, and produce a deliverable. Then we’ll see how it scored.

**Facilitator action:** Select a pod’s task and press “Run baseline.” Play the agent’s recorded computer-use session (about 60 seconds, sped up) showing it open files, build a worksheet, and write its memo. Then reveal the pre-run evaluation result: overall score, must-pass status, and the 2 criteria it missed. Repeat the reveal for the other 3 pods, or show all 4 results together.

**Journalist action:** Watch your pod’s run. Note 1 place where the agent’s approach differs from the way your pod worked.

**Evidence and disclosure:** Simulated run. The button replays a recorded session and a pre-computed evaluation; no model is invoked live. Record the model name, harness, task version, and run date for each recording. The pre-run score uses Turing’s expert rubric for the task, not the pod’s new rubric.

**Transition:** “That’s the expert grade. Now you grade it with your own rubric.”

**Cue to continue:** Advance once every pod has seen its agent’s result.

**Asset needed:** 4 recorded computer-use sessions, 4 agent deliverables, and 4 pre-computed evaluation results with provenance.

**Build status:** New scene. Recordings, agent outputs, and results not yet produced.

### Scene 10 · Grade the agent with your rubric

**73:00–79:00 · 6 minutes · Act 4: Evaluating the agent**

**Purpose:** Put the journalists in the grader’s seat, 1 criterion at a time.

**On screen:** Grade the agent with your rubric

**Presenter narration**

> You wrote the standard; now apply it. For each criterion, read what your rubric requires, find the matching part of the agent’s deliverable, and mark it met or not met. Points add up as you go. If the agent misses a must-pass criterion, the attempt fails, no matter how many points it earned elsewhere.

**Facilitator action:** Hand each pod its printed agent deliverable. Give pods 4 minutes to score their own rubric on paper: met, not met, or unclear for each criterion. Then project 1 pod’s scoring screen: criterion on the left, the highlighted passage of the agent’s deliverable on the right, and 3 buttons below. Walk through 3 criteria live, including 1 must-pass, while the total updates. Compare the pod’s score with the expert score from scene 9.

**Journalist action:** For each criterion: read it, find the evidence in the agent’s deliverable, and mark met, not met, or unclear. Total the points and check every must-pass gate. Tell the room the agent’s score and the most important thing it missed.

**Evidence and disclosure:** This is the pod’s own judgment of a recorded agent output. Unclear criteria stay unscored and are excluded from any complete-score claim. Do not preassign failure to pod-written criteria; the agent may pass some of them.

**Transition:** “The agent missed what you caught. Let’s teach it.”

**Cue to continue:** Advance when each pod has a total and a must-pass verdict.

**Asset needed:** 4 printed agent deliverables, blank scoring sheets, and a projected scoring screen with evidence highlighting.

**Build status:** Prototype has manual pass/fail and fixture annotations. The side-by-side scoring screen, “unclear” state, and live tally remain.

### Scene 11 · Train the agent on expert data

**79:00–82:00 · 3 minutes · Act 5: Training the agent**

**Purpose:** Show how expert data and a rubric reward teach the agent the task.

**On screen:** Train the agent on expert data

**Presenter narration**

> The agent failed because it didn’t know what an expert knows. Your golden answer and your rubric are exactly that knowledge. Here, we combine your work with expert-built variants of the same task into a training dataset, and use the rubric score as the reward in reinforcement learning. Each training step, the agent tries, gets graded, and gets better at what earns points.

**Facilitator action:** Show the pod’s dataset card: its golden, its rubric as the reward, and the count of expert-built task variants. Press “Start training run.” Play the pre-recorded reward curve climbing over training steps (about 45 seconds). Keep the evaluation task visibly separate from the training data.

**Journalist action:** Name 1 criterion from your rubric that you expect the trained agent to handle better, and why.

**Evidence and disclosure:** Simulated run with pre-built data. Train on task variants and evaluate on the pod’s held-out task, so the improvement is not memorization of the answer. Label dataset size and curve values as illustrative unless they come from an actual run.

**Transition:** “Training is done. Let’s give the trained agent the same task.”

**Cue to continue:** Advance when the curve completes.

**Asset needed:** Dataset card per pod, recorded reward curve, and a stated training/evaluation split.

**Build status:** New scene. Dataset card and reward-curve animation not yet built.

### Scene 12 · Run the trained agent

**82:00–84:00 · 2 minutes · Act 5: Training the agent**

**Purpose:** Show the trained checkpoint working through the same task.

**On screen:** Run the trained agent

**Presenter narration**

> This is the same agent after training. Same prompt, same files. Watch where it slows down: it checks the conflicting records, cites its sources, and flags what it can’t establish.

**Facilitator action:** Load the trained checkpoint and press “Run.” Play its recorded computer-use session side by side with the baseline session from scene 9. Pause at 1 moment where the trained agent does something the baseline skipped.

**Journalist action:** Spot the step the trained agent took that the baseline agent missed.

**Evidence and disclosure:** Simulated run using a pre-built checkpoint and recorded session; no model is invoked live. Record checkpoint identifier, harness, task version, and run date.

**Transition:** “Now grade it again.”

**Cue to continue:** Advance after the side-by-side pause.

**Asset needed:** 4 recorded trained-checkpoint sessions and their deliverables.

**Build status:** New scene. Checkpoint recordings not yet produced.

### Scene 13 · Evaluate the trained agent again

**84:00–87:00 · 3 minutes · Act 5: Training the agent**

**Purpose:** Rerun the rubric and show the score improvement on each pod’s task.

**On screen:** Evaluate the trained agent again

**Presenter narration**

> We run the same evaluation with the same rubric. Before training, the agent scored 38 out of 100 and failed a must-pass gate. After training, it scores 84 and clears every gate. That’s the effect of your expert data on this task.

**Facilitator action:** Press “Re-evaluate.” Reveal before and after scores side by side for the projected pod, criterion by criterion, then the totals. Show the other 3 pods’ before and after totals in a row below.

**Journalist action:** Check 1 criterion the agent now meets and confirm it against the deliverable.

**Evidence and disclosure:** Scores shown are illustrative fixture values until real runs exist. Report points and must-pass status separately. Claim improvement on this task only, not general capability.

**Transition:** “Let’s recap what you just did.”

**Cue to continue:** Advance after all 4 pods’ before and after totals are visible.

**Asset needed:** Before and after per-criterion results for 4 pods.

**Build status:** New scene. Results screen not yet built; values are placeholders.

### Scene 14 · You trained your own specialized agent

**87:00–89:00 · 2 minutes · Act 5: Training the agent**

**Purpose:** Close on the full loop and what it means for frontier labs.

**On screen:** You trained your own specialized agent

**Presenter narration**

> Congrats! You trained your own superintelligence, or SI, as our POTUS would say. You created a task and evaluated a frontier agent on it. When the agent could not complete the task, you provided expert data and used reinforcement learning to help it improve. You then evaluated the model again and found that it had learned to perform the task well. Now you can use this specialized agent reliably to complete similar tasks. You are officially an expert in the Turing network. This is how Turing helps frontier labs such as OpenAI, Anthropic, Google DeepMind, and Meta specialize their agents to deliver real economic impact.

**Facilitator action:** Show the 4-step loop: create, evaluate, train, re-evaluate. Show each pod’s name with its before and after score. Open general questions after the close.

**Journalist action:** Name 1 task from your own work you would want an agent specialized for.

**Evidence and disclosure:** Narration is the supplied summary text. Before a press audience, confirm the “POTUS” line, the “frontier agent” wording (scene 9 uses an open-weights model), the “reliably” claim against a simulated result, and approval to name the 4 labs.

**Transition:** “What would you want to test next?”

**Cue to continue:** End the formal 89-minute sequence; questions follow outside this timing.

**Asset needed:** Loop graphic and the session’s pod names and scores.

**Build status:** New scene. Copy supplied by stakeholder; claims review pending.

## Brand application

This artifact follows the internal Turing visual system. It is a storyboard and production specification; it does not restyle the existing demo app.

| Element | Application |
| --- | --- |
| Logo | Approved full black Turing SVG, unmodified, at least 120px wide on screen, with clear surrounding space. |
| Typography | Locally bundled Poppins regular and semibold throughout the internal storyboard. |
| Color | Black, white, and gray foundations. Dark blue #003F9B for small text and actions; #317EFF for selected emphasis; #EEFBFF for supporting panels. |
| Case and punctuation | Sentence case, numerals, Oxford commas, expanded technical terms, and no em dashes. |
| Voice | Direct, credible, and specific. Evidence precedes judgment. Avoid promises about contamination, guaranteed model failure, or unmeasured training gains. |
| Motion | Short, presenter-controlled reveals. Keep the full evidence and labels readable after each reveal. No decorative motion during task work. |
| Disclosure | Simulated runs, illustrative scores, and authored rehearsal content are labeled separately. |

**Typography decision:** The July documents restrict APK Galeria to external marketing headings and prohibit mixing it with Poppins without specifying an external body font. Poppins throughout is the unambiguous internal-document choice. External marketing typography still needs that pairing resolved. The linked external-design file was inaccessible through the connected Drive account.

**Source precedence:** The content playbook is dated July 30, 2026, and the logo guide is updated July 2026. The broad guide’s filename says 2026, while its cover says 2025. Where writing rules conflict, this storyboard follows the later playbook; this is an editorial interpretation.

## Production readiness

The storyboard describes the intended event experience. These implementation and asset gaps remain:

1. Replace rehearsal file excerpts with approved public source packets for the 4 pod tasks, and connect every shown expected value to shipped evidence.
2. Add file/photo capture for the paper workflow, or constrain a prototype rehearsal to short typed memos.
3. Record 4 baseline computer-use sessions with an open-weights model, with model, harness, task version, and run date. Pre-compute each evaluation against the expert rubric.
4. Build the scene 10 scoring screen: criterion, highlighted agent evidence, met / not met / unclear, live total, and must-pass status. Print agent deliverables and scoring sheets for each pod.
5. Build the scene 11 dataset card and recorded reward curve. Confirm the training/evaluation split.
6. Record 4 trained-checkpoint sessions and pre-compute their evaluations. Replace the 38 → 84 placeholder values with real results or keep the “illustrative” label on screen.
7. Review the scene 14 summary copy for a press audience: the “POTUS” line, “frontier agent” versus the open-weights baseline, the “reliably” claim, and naming 4 labs.
8. Apply the storyboard’s brand treatment to the main prototype and use the pod and facilitator labels in the app.
9. Dry-run the full 89 minutes on the presentation laptop.

## Source references

- Supplied 5-stage presentation outline and practitioner task-authoring methodology (Jeffrey Weichsel, September 24, 2026).
- Stakeholder feedback on the L1 storyboard (Chander Matrubhutam, September 2026).
- Brand Guidelines 2026.pdf, especially pages 16–26.
- Logo Guidelines Q4 2025 - Present 2026.pdf, pages 2–5.
- Turing Content Playbook Working Doc.pdf, pages 3–5.
- [Official Turing logo asset folder](https://drive.google.com/drive/folders/1g9tYrlhJ94TAKwCFHZgoyvcImisVeXRL). Bundled asset: Turing_Logo_Full_Black.svg.
- [CEO Bench methodology and results](https://bench.turing.com/ceo-bench/about/). Leaderboard scene removed in this revision; keep the dated snapshot as presenter backup only.
- Poppins font files from [Google Fonts](https://github.com/google/fonts/tree/main/ofl/poppins), with the supplied Open Font License bundled in assets/Poppins-OFL.txt.
