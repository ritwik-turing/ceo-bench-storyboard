/* All packet contents below are authored rehearsal fixtures, not Cirrus source documents. */
'use strict';
const BENCH = {
  source: 'https://bench.turing.com/ceo-bench/about/',
  updated: '17 Sep 2026', checked: '23 Sep 2026',
  models: [['Claude Opus 5','claude-code',20.3],['GPT-5.6 Sol','codex',16.8],['GPT-5.6 Terra','codex',14.3],['Claude Sonnet 5','claude-code',13.3],['Gemini 3.1 Pro','gemini-cli',12],['Gemini 3.7 Flash','gemini-cli',9.4]]
};
const CHAPTERS = [
  {name:'The company',title:'A company you can step inside.',short:'Enter the world',time:'05 MIN',cue:'Introduce SVC and the fictional company. Open a department, then a file. Explain that the final demo will use public corpus documents; these local previews are rehearsal fixtures.',takeaway:'An entire company is the working environment.'},
  {name:'The breakdown',title:'One engagement. Ten independent tasks.',short:'Reveal the work',time:'05 MIN',cue:'Read the audit mandate, then reveal the ten derivative tasks. Each has its own prompt, golden and rubric. They share company events, not a dependency. Assign the four journalist seats.',takeaway:'A professional task must stand on its own.'},
  {name:'Creating a task',title:'Now the expert is you.',short:'Take a seat',time:'60 MIN',cue:'Open a workstation. Ask each journalist to complete the deliverable before writing the rubric. Explain criteria, weights and must-pass requirements with the essay analogy. Review submissions as they arrive.',takeaway:'The answer key is professional work, too.'},
  {name:'The benchmark',title:'Good answers have to survive the details.',short:'Follow the evidence',time:'08 MIN',cue:'Reveal the published all-core pass rates and distinguish them from weighted reward. The evidence lab is a manually graded, scripted rehearsal, not a live model run. Show the attempt, the criterion and the reason together.',takeaway:'Partial credit and a usable deliverable are different measures.'},
  {name:'Training',title:'Every finding becomes a learning signal.',short:'Close the loop',time:'04 MIN',cue:'Walk through the lab and enterprise paths. Keep evaluation tasks held out from training. Passing this simulation is one gate, not proof of readiness for every real deployment. End with the proposed Year 2 scenario.',takeaway:'The same task structure supports learning and measurement.'}
];
const TASKS = [
 ['01','Evidence backbone','A complete request-and-evidence tracker.','C'],
 ['02','Cash & banking','Reconciliations, exceptions and source references.','A'],
 ['03','Revenue & orders','A defensible tie-out across business systems.','D'],
 ['04','Governance & equity','A verified record of approvals and authority.','B'],
 ['05','Payroll & people','Payroll reconciled to the company’s records.'],
 ['06','Inventory & COGS','Supported balances, costs and reserves.'],
 ['07','AP & accruals','Cutoff checks and unrecorded liabilities.'],
 ['08','Year-end close','Adjustments tied to the trial balance.'],
 ['09','Contracts & commitments','Executed agreements and disclosure requirements.'],
 ['10','Statements & disclosures','Source-backed financial statements and notes.']
];
const DEPARTMENTS = [
 ['Accounting','Ledgers, bank statements, close workbooks','A', ['June bank statement','June close worksheet']],
 ['Finance','Budgets, forecasts, financial models','D',['June order summary','June revenue summary']],
 ['Board & governance','Minutes, resolutions, approval records','B',['Q4 board minutes','Board resolution','Budget approval']],
 ['Contracts','Vendor agreements and CPA correspondence','C',['CPA email thread','Audit request log']],
 ['People & payroll','People records and payroll runs',null,['Payroll register','Organization chart']],
 ['Operations','Orders, inventory and fulfillment',null,['Order exports','Inventory count']],
 ['Marketing','Campaign reports and channel performance',null,['Channel report','Campaign calendar']],
 ['Customer support','Tickets, refunds and warranty claims',null,['Support tickets','Refund log']]
];
function criterion(text,points,mustPass,evidence,pass,reason){return {text,points,mustPass,evidence,pass,reason};}
const SEATS = {
 A: {name:'Cash & banking',role:'Staff accountant',theme:'Find the difference.',color:'blue',question:'Do the June books agree with the bank?',brief:'Reconcile June cash. Report both closing balances, quantify the difference, identify what remains unsupported and recommend a next action. Cite the supplied packet.',
 files:[
  {name:'June bank statement',kind:'STATEMENT',ref:'A1',body:'REHEARSAL BANK · June 30, 2021\n\nOpening balance                 $100,000\nDeposits                         $40,000\nWithdrawals                      $22,000\nClosing balance                 $118,000\n\nThis excerpt contains aggregate activity only.\nNo transaction detail is supplied.'},
  {name:'June close worksheet',kind:'WORKSHEET',ref:'A2',body:'CIRRUS REHEARSAL · June cash close\n\nOpening balance                 $100,000\nRecorded receipts                $40,000\nRecorded payments                $15,000\nBook closing balance            $125,000\n\nPrepared by: Accounting\nReconciling-items schedule: not attached\nStatus: preliminary'}],
 golden:'The June bank closing balance is $118,000 (A1); the preliminary book balance is $125,000 (A2). Books exceed bank by $7,000. Opening balances and receipts agree. Aggregate bank withdrawals exceed recorded payments by $7,000, but the packet contains no transaction detail or reconciling schedule. This is an unresolved difference, not evidence of a specific fee, fraud or timing item. Use the statement as evidence of the bank balance, and reconcile the ledger before finalizing book cash. Accounting should obtain transaction detail and supporting documents; the controller should review the reconciliation before any supported adjustment is posted.',
 attempt:'June cash reconciles to $125,000 per the closing worksheet. The bank statement shows $118,000. The $7,000 difference is an outstanding deposit that will clear next month. The worksheet is the final accounting record, so no further action is required.',
 rubric:[
  criterion('Identifies an unresolved bank/book conflict',20,true,'A1 and A2 show different closing balances.',false,'The attempt calls the cash reconciled.'),
  criterion('Reports the bank closing balance as $118,000',10,false,'A1 · closing balance',true,'The bank figure is stated correctly.'),
  criterion('Reports the book closing balance as $125,000',10,false,'A2 · book closing balance',true,'The book figure is stated correctly.'),
  criterion('Calculates the $7,000 difference',10,false,'$125,000 − $118,000 = $7,000.',true,'The difference is calculated correctly.'),
  criterion('States that book cash exceeds bank cash',5,false,'Compare A1 and A2 closing balances.',true,'The direction follows the balances cited.'),
  criterion('Recognizes the worksheet is preliminary',5,false,'A2 · status: preliminary',false,'The attempt calls the worksheet final.'),
  criterion('Does not invent a reconciling transaction',15,true,'Neither document identifies an outstanding deposit.',false,'The outstanding deposit is unsupported.'),
  criterion('Requests missing transaction-level evidence',10,false,'A1 has aggregates; A2 lacks a schedule.',false,'No further evidence is requested.'),
  criterion('Assigns a concrete follow-up to accounting',10,false,'Someone must obtain and reconcile the detail.',false,'The attempt says no action is required.'),
  criterion('Cites the sources used for both balances',5,false,'Identifies the statement and closing worksheet.',true,'Both sources are named.')]
 },
 B: {name:'Governance & equity',role:'Governance lead',theme:'Check the authority.',color:'purple',question:'What did the board actually approve?',brief:'Assess the status of each document and whether it supports formal approval. Build a short evidence table and a blocker list with an owner and next action. Stay within the supplied packet.',
 files:[
  {name:'Q4 board minutes',kind:'MINUTES',ref:'B1',body:'REHEARSAL · Board meeting · December 15, 2021\n\nDRAFT · FOR DISCUSSION\nThe board discussed the annual budget.\nA vote will be recorded in the final minutes.\n\nSecretary signature: __________________'},
  {name:'Board resolution',kind:'RESOLUTION',ref:'B2',body:'REHEARSAL · Resolution · December 18, 2021\n\nRESOLVED: approve the proposed annual budget.\n\nDirector signatures:\n__________________\n__________________\n\nExecution status: unsigned'},
  {name:'Budget approval',kind:'APPROVAL',ref:'B3',body:'REHEARSAL · Annual budget cover · December 20, 2021\n\nNOT APPROVED\nProposed operating budget: version 3\nApproval reference: pending\nOwner: Finance'}],
 golden:'B1 is dated December 15 and marked draft, with no signed final minutes or recorded vote. B2 is dated December 18 and unsigned. B3 is dated December 20 and explicitly not approved. This packet does not establish formal budget approval. Log missing approval evidence as a blocker; ask the corporate secretary to obtain final signed minutes or an executed resolution and have Finance link the approved budget version. Do not infer that no approval occurred anywhere outside the packet.',
 attempt:'The December 18 resolution approves the budget, supported by the Q4 meeting minutes and the version 3 budget. The governance binder is complete and the auditor may rely on it.',
 rubric:[
  criterion('Identifies B1 as draft minutes',10,true,'B1 · DRAFT',false,'The draft status is missed.'),
  criterion('Identifies B2 as unsigned',15,true,'B2 · execution status',false,'An unsigned resolution is treated as approval.'),
  criterion('Identifies B3 as not approved',15,true,'B3 · NOT APPROVED',false,'The approval stamp is missed.'),
  criterion('Records the December 15 date for B1',5,false,'B1 · heading',false,'No date is given for the minutes.'),
  criterion('Records the December 18 date for B2',5,false,'B2 · heading',true,'The resolution date is correct.'),
  criterion('Records the December 20 date for B3',5,false,'B3 · heading',false,'The budget date is omitted.'),
  criterion('Concludes the packet lacks proof of approval',15,true,'No supplied document proves execution.',false,'The conclusion reverses the evidence.'),
  criterion('Logs missing approval evidence as a blocker',10,false,'Final signed or executed evidence is missing.',false,'The binder is called complete.'),
  criterion('Names an owner and action to obtain evidence',10,false,'Corporate secretary; obtain executed records.',false,'No follow-up is assigned.'),
  criterion('Limits conclusions to the supplied records',10,false,'Absence from the packet is not universal absence.',false,'The reliance conclusion is unsupported.')]
 },
 C: {name:'Audit evidence',role:'Audit readiness lead',theme:'Prove it exists.',color:'green',question:'Can the engagement be evidenced?',brief:'Review the CPA correspondence and request log. Identify what exists, what is missing, the impact on audit readiness, and who should resolve it. Do not confuse a proposal with an executed engagement.',
 files:[
  {name:'CPA email thread',kind:'CORRESPONDENCE',ref:'C1',body:'REHEARSAL · December 10, 2021\nFrom: CPA firm\nTo: Finance\n\nWe would be happy to discuss an FY2021 audit.\nWe will send a proposed scope and engagement\nletter after our planning call.\n\nAttachments: none'},
  {name:'Audit request log',kind:'TRACKER',ref:'C2',body:'REHEARSAL · December 20, 2021\n\nRequest: signed CPA engagement letter\nOwner: Controller\nStatus: awaiting document\n\nRequest: written audit scope\nOwner: Controller\nStatus: awaiting document'}],
 golden:'C1 is a December 10 email proposing a discussion, with no attachment; it promises a future scope and engagement letter. C2, dated December 20, lists both records as awaiting document. No signed engagement letter or written scope is present in this packet. Log a readiness blocker: the team cannot establish agreed scope and engagement terms from these records. The controller should obtain the executed letter and written scope from the CPA firm and attach them to the request log. This conclusion is limited to the supplied records.',
 attempt:'The December 10 CPA email confirms the FY2021 audit engagement. Finance has the correspondence on file, so the engagement evidence request can be closed.',
 rubric:[
  criterion('Identifies the December 10 correspondence',10,false,'C1 · date',true,'The email date is correctly cited.'),
  criterion('Identifies the December 20 request log',5,false,'C2 · date',false,'The log is not discussed.'),
  criterion('Recognizes the email proposes a future scope',10,false,'C1 · will send after planning call',false,'A proposed discussion becomes a confirmed engagement.'),
  criterion('Notes that the email has no attachment',5,false,'C1 · attachments: none',false,'The missing attachment is not mentioned.'),
  criterion('Finds no signed letter in the packet',20,true,'C1 and C2 contain no executed letter.',false,'Correspondence is treated as executed evidence.'),
  criterion('Finds no written scope in the packet',10,true,'C2 · scope awaiting document',false,'The scope gap is missed.'),
  criterion('Records a readiness blocker',15,true,'Engagement terms are not evidenced.',false,'The request is incorrectly closed.'),
  criterion('Explains the missing-evidence impact',10,false,'Cannot establish agreed terms and scope.',false,'No impact is explained.'),
  criterion('Assigns the controller a follow-up action',10,false,'C2 identifies the controller as owner.',false,'No follow-up is requested.'),
  criterion('Avoids conclusions beyond the packet',5,false,'Report what the supplied evidence supports.',false,'Confirmation is asserted without evidence.')]
 },
 D: {name:'Revenue & orders',role:'Revenue analyst',theme:'Follow the arithmetic.',color:'orange',question:'Do orders and recorded revenue agree?',brief:'Calculate June net order activity, compare it with the revenue summary and explain what evidence is still needed before deciding whether an adjustment is appropriate.',
 files:[
  {name:'June order summary',kind:'ORDER EXPORT',ref:'D1',body:'REHEARSAL · June 2021 orders\n\nGross order value                $80,000\nRefunds                           $5,000\nNet order activity               $75,000\n\nTax and shipping: excluded\nRecognition timing: not supplied'},
  {name:'June revenue summary',kind:'LEDGER SUMMARY',ref:'D2',body:'REHEARSAL · June 2021 revenue\n\nRecorded revenue                 $72,000\nBasis: accrual\nStatus: preliminary\n\nOrder-level bridge: not attached\nCutoff and deferral detail: not attached'}],
 golden:'D1 gives $80,000 gross less $5,000 refunds, or $75,000 net order activity. D2 records $72,000 revenue on an accrual basis, leaving a $3,000 excess of net orders over recorded revenue. This difference does not establish an accounting error: recognition timing is not supplied. Obtain an order-level bridge with cutoff and deferral support. The preliminary ledger is the accounting starting point, not automatically proven correct. Finance should reconcile the bridge before proposing any supported adjustment.',
 attempt:'June revenue should be $75,000: $80,000 in orders less $5,000 in refunds. The ledger records $72,000 and is therefore understated by $3,000. Post an immediate $3,000 revenue adjustment to make the systems agree.',
 rubric:[
  criterion('Reports gross orders of $80,000',5,false,'D1 · gross order value',true,'Gross orders are correct.'),
  criterion('Reports refunds of $5,000',5,false,'D1 · refunds',true,'Refunds are correct.'),
  criterion('Calculates net orders of $75,000',10,false,'$80,000 − $5,000',true,'Net order arithmetic is correct.'),
  criterion('Reports recorded revenue of $72,000',10,false,'D2 · recorded revenue',true,'The ledger balance is correct.'),
  criterion('Calculates a $3,000 gap',10,false,'$75,000 − $72,000',true,'The gap is correct.'),
  criterion('Distinguishes orders from recognized revenue',15,true,'D1 lacks timing; D2 is accrual.',false,'Net orders are treated as recognized revenue.'),
  criterion('Requests cutoff and deferral support',10,false,'D2 · missing support',false,'No supporting detail is requested.'),
  criterion('Does not recommend an unsupported adjustment',20,true,'No bridge proves an accounting error.',false,'The immediate adjustment is unsupported.'),
  criterion('Recognizes the ledger is preliminary',5,false,'D2 · status',false,'The status is not addressed.'),
  criterion('Assigns reconciliation to Finance',10,false,'Obtain and review an order-level bridge.',false,'The reconciliation action is missing.')]
 }
};
function validateSubmission(sub) {
 const errors=[];
 if(!sub.name?.trim()) errors.push('Add your name.');
 if(!sub.deliverable?.trim()) errors.push('Write your deliverable.');
 const rows=sub.rubric||[];
 if(rows.length<10||rows.length>20)errors.push('Write 10–20 criteria.');
 if(rows.some(r=>!r.text?.trim()))errors.push('Complete every criterion.');
 if(rows.some(r=>!Number.isFinite(Number(r.points))||Number(r.points)<=0||Number(r.points)>100))errors.push('Each weight must be greater than 0 and at most 100.');
 if(Math.abs(rows.reduce((s,r)=>s+Number(r.points),0)-100)>.001)errors.push('Weights must total 100.');
 return errors;
}
function scoreRubric(rows,marks){
 const total=rows.reduce((s,r)=>s+Number(r.points),0);
 const earned=rows.reduce((s,r,i)=>s+(marks[i]==='pass'?Number(r.points):0),0);
 const complete=rows.length>0&&rows.every((_,i)=>['pass','fail'].includes(marks[i]));
 const gated=rows.some((r,i)=>r.mustPass&&marks[i]==='fail');
 return {total,earned,complete,gated,percent:total?Math.round(earned/total*100):0};
}
/* Browse-only rehearsal fixtures for the company intro. They are not part of any pod packet. */
const EXTRA_FILES = [
 {name:'Payroll register',kind:'PAYROLL',body:'REHEARSAL · Payroll run · June 30, 2021\n\nEmployees paid                        42\nGross pay                       $310,000\nEmployer taxes                   $24,000\nNet pay                         $232,000\n\nPrepared by: People operations\nApproved by: Controller'},
 {name:'Organization chart',kind:'PEOPLE',body:'REHEARSAL · Organization · June 2021\n\nChief executive officer\n  Finance: controller, 3 accountants\n  Operations: 12\n  Marketing: 6\n  Customer support: 9\n  Product: 10\n\nHeadcount: 42'},
 {name:'Order exports',kind:'ORDER EXPORT',body:'REHEARSAL · Orders by week · June 2021\n\nWeek 1                           $18,000\nWeek 2                           $21,000\nWeek 3                           $19,000\nWeek 4                           $22,000\nGross order value                $80,000'},
 {name:'Inventory count',kind:'COUNT SHEET',body:'REHEARSAL · Warehouse count · June 30, 2021\n\nMattresses                           640\nPillows                            1,850\nBed frames                           210\n\nCounted by: Operations\nRecount status: not performed'},
 {name:'Channel report',kind:'MARKETING',body:'REHEARSAL · Channel performance · June 2021\n\nPaid search                      $14,000 spend\nSocial                            $9,000 spend\nPodcast                           $6,000 spend\n\nOrders attributed: see order exports'},
 {name:'Campaign calendar',kind:'MARKETING',body:'REHEARSAL · Campaigns · 2021\n\nMarch     Spring refresh sale\nJune      Summer sleep event\nSeptember Back to school\nNovember  Holiday sale'},
 {name:'Support tickets',kind:'SUPPORT',body:'REHEARSAL · Tickets · June 2021\n\nOpened                               410\nResolved                             388\nTop reasons: delivery timing, returns, warranty'},
 {name:'Refund log',kind:'SUPPORT',body:'REHEARSAL · Refunds · June 2021\n\nRefunds issued                        31\nTotal refunded                    $5,000\n\nApproval: support lead'},
 {name:'Finance channel',kind:'INTERNAL SLACK',body:'REHEARSAL · #finance · July 2, 2021\n\nAccountant: June close worksheet is up. Still preliminary.\nController: Does cash tie to the bank?\nAccountant: Not yet. I have not built the reconciling schedule.\nController: Do not mark it final until it ties.'}
];
/* Authored rehearsal fixtures for the trained checkpoint. fails = rubric rows the trained attempt still misses. */
const TRAINED = {
 A:{fails:[5,8],attempt:'Bank closing balance is $118,000 (A1, June bank statement). Book closing balance is $125,000 (A2, June close worksheet). Books exceed bank by $7,000, and this difference is unresolved. Opening balances and receipts agree; withdrawals differ by $7,000. Neither document identifies the transaction behind the difference, so I have not attributed it to a fee, a timing item, or an error. Transaction-level bank detail and the reconciling-items schedule are needed before any adjustment.'},
 B:{fails:[3,5,8],attempt:'B1 is marked draft and records no vote. B2, dated December 18, is unsigned. B3 is stamped not approved. Within this packet, formal approval of the budget is not established. Blocker: the final signed minutes or an executed resolution are missing. I cannot conclude from these records whether approval happened elsewhere.'},
 C:{fails:[1,3,7],attempt:'C1, the December 10 email, proposes a discussion and promises a scope and engagement letter later. It does not confirm an engagement. C2 lists the signed engagement letter and the written scope as awaiting document. No signed letter or written scope is in this packet. Readiness blocker: keep the request open. The controller should obtain both documents from the CPA firm. This conclusion is limited to the supplied records.'},
 D:{fails:[6,8],attempt:'Gross orders are $80,000 and refunds are $5,000, so net order activity is $75,000 (D1). Recorded revenue is $72,000 on an accrual basis (D2). The gap is $3,000. Orders are not the same as recognized revenue, and D1 supplies no recognition timing, so the gap does not prove an error. I do not recommend an adjustment on this evidence. Finance should first reconcile orders to revenue with an order-level bridge.'}
};
function expertScore(pod,trained){
 const rows=SEATS[pod].rubric;
 return scoreRubric(rows,rows.map((r,i)=>(trained?!TRAINED[pod].fails.includes(i):r.pass)?'pass':'fail'));
}
if(typeof module!=='undefined') module.exports={SEATS,TASKS,DEPARTMENTS,EXTRA_FILES,TRAINED,validateSubmission,scoreRubric,expertScore};
