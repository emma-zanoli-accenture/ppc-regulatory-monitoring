# Demo Presenter Script
## AI-Powered Regulatory Change Management
### Regulatory Change Management — Live Demo

---

> **FORMAT KEY**
> - **[DO]** — action to perform on screen
> - **[POINT]** — gesture or draw attention to something visible
> - *Italic notes* — timing or staging cues
> - Regular text — spoken words

---

## BEFORE YOU START

**[DO]** Open the app at `http://localhost:5173`. Confirm you are on the **Legal / Compliance Dashboard**.

**[DO]** Open **Demo Controls** (top-right corner of the top bar) and click **Reset Demo**. This restores all seed data and ensures a clean run regardless of any prior activity. Close Demo Controls.

*Optionally, open the **Demo Guide** (also in the top bar) to use as a private checklist — it lists all 18 steps. It is not visible to the audience unless you share your screen with it open.*

**Approximate run time:** 30–35 minutes for the full sequence. Steps 1–13 are the core narrative; Steps 14–18 can be accelerated or partially narrated if time is short.

---

---

# OPENING
*Set the stage. Approximately 90 seconds.*

**[SCREEN: Legal / Compliance Dashboard]**

"Thank you for making the time. What I want to show you today is not a concept — it's a working system, and everything you're about to see is live.

The challenge we're addressing is one I suspect your Legal and compliance teams feel acutely: regulatory change in the energy sector has accelerated significantly. REMIT II, ENTSO-E network codes, national licensing frameworks, ESG disclosure requirements — the volume keeps growing, but the teams responsible for monitoring, interpreting, and implementing these changes haven't grown with it. And the downstream consequences of missing something — regulatory sanctions, ACER inspections, reputational risk — are serious.

What this platform does is put AI at every stage of that process. Not as a search tool or a chatbot bolted onto the side, but as an active participant: detecting changes, drafting communications, advising Business Units, tracking implementation, and producing audit-ready evidence — all in a single connected workflow.

We're going to walk through a complete, end-to-end scenario based on REMIT II — the enhanced wholesale energy market transaction reporting regulation — because it's live, it's high-priority, and it touches every major part of this workflow.

Let's start here, in the Legal / Compliance view."

---

---

# PHASE 1 — LEGAL / COMPLIANCE
*Steps 1 through 6. The control-tower perspective.*

---

## STEP 1 — Dashboard, Source Scan & Catalogue Update
*The first agentic moment. Approximately 3 minutes.*

**[SCREEN: Legal / Compliance Dashboard]**

**[POINT]** to the KPI strip across the top of the dashboard.

"This is the Legal team's control-tower view. At a glance: active regulatory changes, which Business Units haven't yet acknowledged their notifications, open support requests, any overdue actions. Everything the compliance function needs to see without opening a single spreadsheet.

Today I want to draw your attention to this panel down here."

**[POINT]** to the **Source Monitoring** panel — the section showing the four monitored sources and the **Run source scan** button.

"The system continuously monitors four regulatory sources: ACER — the EU energy market regulator — ENTSO-E, the Greek national regulator RAE, and the EU Official Journal. Normally this runs on a scheduled basis. But let me trigger it manually so you can see what the agent actually does."

**[DO]** Click **Run source scan**.

*Wait for the AI thinking indicator — approximately 2 seconds. The panel shows the agent working.*

"Watch the AI working through those sources."

*The result appears — REMIT II flagged as a new regulatory instrument.*

**[POINT]** to the detected regulation card showing REMIT II.

"The agent has identified something new: REMIT II — Enhanced Wholesale Energy Market Transaction Reporting, published by ACER. High-priority change. Implementation deadline: 30 September 2026.

What I want to highlight here is that the AI didn't just find a document. It extracted the regulatory source, the risk priority, the effective date — the first triage work that typically takes a compliance analyst an hour or two of reading. Done in seconds.

Let me add it to the active monitoring catalogue."

**[DO]** Click **Update source catalogue**.

*A confirmation appears. The catalogue count updates.*

"REMIT II is now live in the system. That single action seeds everything that follows: the obligation mapping, the impact assessment, the communications, the tracking. The workflow is now active."

---

## STEP 2 — Impact Overview
*The regulatory landscape at a glance. Approximately 3 minutes.*

**[DO]** Click **Impact Overview** in the left sidebar.

**[SCREEN: Impact Overview]**

"This is the Impact Overview — the central registry of every regulatory change currently being monitored. REMIT II has appeared at the top."

**[POINT]** to the REMIT II row in the table.

"Source, effective date, implementation deadline. But look at these columns on the right: Obligation Mapping, Impacted BUs, Risk. The system isn't just filing documents — it's already begun the analytical work of understanding what this regulation means for the organisation.

Five Business Units are flagged. Risk is High. Obligation mapping is done. Communication is partially sent — you can see other Business Units are already in motion."

**[DO]** Briefly open the **Business Unit** filter dropdown and select, for example, *Energy Trading*.

"I can filter immediately by Business Unit — if I'm responsible for one specific area, I see only what's relevant to me. Source, status, risk — all filterable."

**[DO]** Clear the filter.

**[POINT]** to the **Obligation Mapping History** section at the bottom of the page.

"There's something worth pausing on down here. These are precedent cases — REMIT I, EMIR, MiFID II — regulations where obligation mapping has already been done. The AI uses these as reference points when interpreting new instruments. The analytical quality improves with every regulation that goes through the system. It's institutional memory that doesn't leave when people leave."

---

## STEP 3 — REMIT II Regulatory Change Detail
*Where Legal does the deep analytical work. Approximately 4 minutes.*

**[DO]** Click the **REMIT II** row — or click **REMIT II Detail** in the left sidebar.

**[SCREEN: LegalRegChangeDetail — REMIT II]**

**[POINT]** to the **Regulatory Overview** section.

"The full regulatory detail. Source, risk priority, publication and effective dates. And these three status fields — Communication, Implementation, Audit — are live. They update automatically as the workflow progresses. This is not a manually maintained tracker."

**[DO]** Scroll down to the **Obligation Mapping** section.

**[POINT]** to the Obligation Mapping section.

"Here is the real analytical output. The system has mapped four obligations from this regulation. Let me take you through them, because this is where most of the implementation work originates.

The first obligation: report all wholesale energy contracts and orders to ACER. The reportable universe is expanding beyond what's currently in scope — Trading desks need to map every contract type to the correct REMIT reporting category.

Second: meet the T+1 reporting timeline. Standard contracts must be reported by the next working day. If you're currently running batch submissions over several days, that process needs to change — and that's a significant pipeline re-engineering effort for Wholesale Market Operations.

Third: ensure data quality and route all submissions through a Registered Reporting Mechanism — an RRM. Reference data, counterparty identifiers, LEI validation — all of this has to be confirmed and tested before go-live.

Fourth: maintain records and an auditable trail. Not just the trades — the submission receipts, the exception logs, the evidence that you reported correctly. This is what ACER will ask for in an inspection."

**[DO]** Click **Export Excel** in the Obligation Mapping section header (top right of that card).

*A CSV file downloads immediately. A success toast appears.*

"From this obligation mapping, I can export a full implementation checklist in Excel — one row per implementation action, per Business Unit, with owners, due dates, and the evidence required for each. Seventeen rows in this case, because some obligations generate multiple actions across multiple teams. This is ready to drop straight into your programme management tool or project tracker."

**[DO]** Scroll down to the **Impact Assessment** section.

**[POINT]** to the table.

"Five Business Units impacted. Energy Trading and Wholesale Market Operations are High — they own the trade reporting pipeline. Procurement and Regulatory Affairs are Medium. Sustainability is Low, but with an earlier internal deadline — July 10th — because their data contribution feeds the main go-live."

**[DO]** Scroll down to **Documentation**. Click **Preview** on **Internal Impact Assessment.docx**.

"The supporting documentation is all here. Let me open the impact assessment."

*The SlideOver opens with the document preview.*

**[POINT]** to the content — Executive Summary, Impacted Processes, Key Risks, Recommended Actions.

"Full document preview, without leaving the platform. The executive summary, the risk tiers, the recommended action sequence. Everything a BU lead or an external auditor needs to read."

**[DO]** Close the SlideOver (click the X).

---

## STEPS 4–6 — Generate Communication Report, Preview, Select BUs, Send
*The second agentic moment. Approximately 5 minutes.*

**[DO]** Click the **Generate Communication Report** button — either the primary button at the top right of the page header, or the one in the footer card.

**[SCREEN: CommunicationFlow wizard — Step 1: Generating]**

"This is the step that typically costs the most time in a Legal team. Drafting a communication that is accurate, obligation-linked, BU-specific, and audit-ready. Lawyers write it. It gets reviewed. It gets revised. It goes out — eventually. Let's see how long it takes here."

*The generation animation runs — captions rotate: "Reading obligation mapping…" / "Drafting executive summary…" / "Generating FAQ…" / "Identifying required evidence…" — approximately 2–3 seconds total.*

*Step 2 appears — the full report preview.*

**[SCREEN: CommunicationFlow — Step 2: Report Preview]**

"The report is ready. Let me walk you through what was generated."

**[POINT]** to **Executive Summary**.

"Executive summary — written directly from the obligation mapping and impact assessment. The regulation, the source, the deadline, the number of obligations, the impacted BUs. Accurate and specific."

**[POINT]** to **What is changing** and **Why it matters**.

"What is changing. Why it matters. And then—"

**[POINT]** to **What you need to do — Required Actions**.

"The required actions. Four of them, derived from the four obligations: trade capture and transaction reporting, reporting operations and scheduling, data quality assurance and RRM connectivity, recordkeeping and audit readiness. Each action corresponds to a specific obligation. This isn't generic compliance advice — it's obligation-linked guidance."

**[DO]** Scroll to **Key Dates**, **Risks if not implemented**, **Evidence required for audit**, and **FAQ**.

"Key dates. Risks if the organisation doesn't act. Evidence required for audit — exactly the four items that will need to be uploaded by each Business Unit. And a FAQ section. These are the questions Business Units always ask: are intragroup contracts in scope? What's the reporting channel? What constitutes audit evidence? The AI has anticipated all of them."

**[POINT]** to the **editable** badge on any text section.

"Every section is fully editable. If I want to adjust the language, add a legal note, or emphasise something specific for this audience — I do it here. The AI produces the draft; Legal reviews and approves. The human stays in control of what goes out."

**[DO]** Click **Approve & Send**.

**[SCREEN: CommunicationFlow — Step 3: Select Business Units]**

"Now I select the recipients. All five Business Units are pre-selected based on the impact assessment. I can deselect, or choose to phase the rollout — but for this demonstration, I'm sending to all five."

**[POINT]** to the table showing all five BUs with their impact levels, owners, and due dates.

**[DO]** Click **Send Notification**.

**[SCREEN: CommunicationFlow — Step 4: Sending → Step 5: Sent]**

*The sending animation runs briefly, then the success screen appears.*

**[POINT]** to the success card and the stats grid.

"Done. Five Business Units notified. Tickets created and activated. Audit trail entry written. Communication status updated to Sent. That entire sequence — five separate notifications, five tickets, full tracking activated — in one action, with complete traceability from the first moment.

Notice the stats: five BUs notified, four obligations communicated, implementation deadline September 30th 2026."

**[DO]** Click **Go to Monitoring** (the button with the Activity icon).

---

---

# PHASE 2 — BUSINESS UNIT
*Steps 7 through 11. The operational perspective. Approximately 8 minutes.*

---

## STEP 7 — Switch Role & BU Dashboard

**[DO]** Click the **Role Switcher** in the top bar. Switch from **Legal / Compliance** to **Business Unit**.

**[SCREEN: BU Dashboard]**

"Let me change perspective entirely. We're now looking at this through the eyes of Procurement — one of the five impacted Business Units. This is what their dashboard looks like the moment the notification arrives."

**[POINT]** to the KPI strip.

"New notification. One action required. The notification is flagged as unread — the unread indicator, the 'New' tag. It's immediately clear something needs attention."

**[DO]** Click on the **REMIT II** notification in the Legal Notifications list.

---

## STEP 8 — BU Regulatory Change Detail
*The four questions. Approximately 3 minutes.*

**[SCREEN: BU Regulatory Change Detail]**

"This is a completely different experience from the Legal view. There's no regulatory jargon, no obligation IDs, no compliance framework terminology. The page is structured around four questions that any Business Unit owner can understand and act on."

**[POINT]** to **Question 1: What is changing**.

"What is changing. Plain language. What this regulation means."

**[POINT]** to **Question 2: Why it matters**.

"Why it matters — specifically for Procurement. The system has surfaced the BU-specific impact reason: certain procurement supply contracts now fall within the REMIT II reportable scope and must be classified accordingly. And the key risks are called out directly — not generic regulatory risk, but the specific operational consequence of inaction."

**[POINT]** to **Question 3: What you need to do**.

"What you need to do. Four required actions, derived from the obligation mapping. Owner: Dimitris Antoniou. Deadline: 30 September 2026. A direct button to open the compliance ticket. No interpretation required. The Legal team has done that work — this is the output delivered to the person who has to act."

**[POINT]** to the **Key Dates** card and the **Documents** card on the lower half of the page.

"Key dates on the left. And on the right — the communication report, issued by Legal, available for download."

---

## STEP 9 — View & Download the Report

**[DO]** Click **View** on the **REMIT II — Communication Report** document card.

*The report modal opens.*

**[POINT]** to the report content — the sections match what Legal generated.

"The full report is here — the same document Legal approved, now delivered directly to Procurement's view. Every section: executive summary, what's changing, required actions, FAQ."

**[DO]** Click **Download** in the modal footer.

*The modal closes. The document card updates to show it has been downloaded.*

"Downloading the report updates the status in real time on Legal's side. They can see that Procurement has reviewed the documentation — without chasing by email."

**[DO]** Close the modal if it hasn't closed automatically.

---

## STEP 10 — AI Advisory Assistant
*The third agentic moment. Approximately 4 minutes.*

**[POINT]** to the **Support** panel on the right side of the detail page — two cards: AI Advisory Assistant and Request Legal Support.

"Now — this is where the Business Unit gets something genuinely powerful."

**[DO]** Click **AI Advisory Assistant**.

*The chatbot SlideOver opens.*

**[POINT]** to the opening message from the Advisory Assistant.

"An AI assistant that answers questions about this specific regulation, for this specific Business Unit, from the communication report and obligation mapping. Not a general-purpose AI generating plausible text. Answers grounded in your own regulatory documentation."

**[DO]** Click the suggested question: **"What actions are required for my Business Unit?"**

*The thinking indicator appears — approximately 1 second — then the answer streams in.*

*Wait for the full answer to appear.*

"Watch the answer come in. It's pulling directly from the required actions in the report: the contract classifications, the trade capture updates, the timeline realignment. And at the bottom — the source citation. It tells you exactly which section of the report this comes from."

**[DO]** Click the suggested question: **"What evidence do I need to upload?"**

*Wait for the answer.*

"Four specific evidence items — the RRM connectivity test report, the T+1 reporting pipeline runbook, reconciliation and exception logs, and the recordkeeping and retention policy. This is exactly what will be needed at audit. The BU doesn't need to call Legal to ask — the AI knows, because it's working from the same documentation Legal produced."

**[DO]** Click the suggested question: **"What's the implementation deadline?"**

*Wait for the answer.*

"The deadline, the effective date, and a clear statement that all controls need to be in place before then. Specific. Actionable. Sourced."

*Optional: if the audience is interested, type a custom question like 'Can you summarise the key requirements?' to demonstrate the free-text input.*

"The BU can also type their own question. The assistant answers from the same document, regardless of how the question is phrased."

---

## STEP 11 — Request Legal Support

**[DO]** Close the chatbot SlideOver (click the X).

"Even with an AI assistant available, some questions need a human. Let me show you how that escalation path works — and how it stays completely within the system."

**[DO]** Click **Request Legal Support** in the support panel.

*The support request modal opens.*

"The BU raises a support request directly from this screen. They don't need to know who to email, what format to use, or where to find the ticket reference."

**[DO]** Click **Use example** next to the **Subject** field.

*The form auto-fills with the example request.*

**[POINT]** to the populated fields.

"Subject: scope of intragroup supply contracts under REMIT II reporting. Description: a question about whether intragroup energy supply contracts between the trading desk and internal subsidiaries fall within the REMIT II reporting scope. Section reference — 'What you need to do'. Priority: High.

And here—"

**[POINT]** to the **Attach AI chatbot transcript** checkbox.

"The BU can attach the chatbot conversation to the support request. So Legal can see exactly what the AI said before escalating — no duplicated effort, no context lost."

**[DO]** Click **Submit request**.

*The modal closes. Status updates.*

"Request submitted. It's now visible in Legal's Support Requests queue, linked to this ticket, with the priority and section reference intact."

---

---

# PHASE 3 — BACK TO LEGAL
*Steps 12 and 13. Closing the loop. Approximately 5 minutes.*

---

## STEP 12 — Answer the Support Request

**[DO]** Click the **Role Switcher** — switch back to **Legal / Compliance**.

**[DO]** Click **Support Requests** in the left sidebar.

**[SCREEN: SupportRequests]**

"The support request has arrived. We can see it immediately — Business Unit, question, priority, the section it relates to."

**[DO]** Click on the Procurement support request to open the SlideOver.

*The SlideOver opens showing the full request details.*

**[POINT]** to the question and the chatbot transcript section.

"The question, the priority, and the chatbot transcript attached by the BU — so Legal can see the full context before responding. There's no email chain to scroll back through."

**[POINT]** to the response section at the bottom.

"Legal responds directly here."

**[DO]** Click **Use example** next to **Your response**.

*The response textarea fills with the scripted answer.*

**[POINT]** to the pre-filled response text.

"The response addresses the intragroup scope question directly: under REMIT II, intragroup transactions are not exempt — both counterparties being in the same group does not create an exemption. Procurement needs to ensure those contracts are captured in the trade reporting system before the September deadline. It's precise, it's actionable, and it's appropriate to log as a formal legal position."

**[DO]** Click **Send response**.

*The SlideOver updates. The BU's ticket status advances from 'Clarification Requested' to 'In Progress'.*

"Sent. The ticket advances automatically — from 'Clarification Requested' to 'In Progress'. The response is logged in the audit trail with a timestamp and the author. Full traceability. No emails lost in inboxes, no knowledge that lives only in one person's sent folder."

---

## STEP 13 — Monitoring & Time Simulation

**[DO]** Click **Monitoring** in the left sidebar.

**[SCREEN: Monitoring — Communication & Follow-up Monitoring]**

"This is the monitoring view. Let me take a moment here because this screen tells the full story of where the implementation stands across all five Business Units."

**[POINT]** to the progress strip at the top.

"Five notified. Four have viewed. Three have downloaded. One has already completed — Wholesale Market Operations came in early and is already marked Ready for Audit.

And here's the per-BU breakdown."

**[POINT]** to the status table.

"Energy Trading has a clarification request open. Wholesale Market Operations: complete, ready for audit, dash in the Days to Due column — obligation closed. Procurement is now In Progress after we answered their question. Regulatory Affairs has viewed but not yet actioned. Sustainability is In Progress.

This is the view that answers the question every Legal lead asks on a Monday morning: where are we? Who's behind? Who do I need to call?"

**[DO]** Open **Demo Controls** (top-right of the top bar). Click **T-30**.

*Close or minimise Demo Controls. The current date advances. The Days to Due column updates.*

"I've just simulated thirty days passing. The implementation deadline is September 30th — we're now thirty days out.

Watch the Days to Due column."

**[POINT]** to the Days to Due column.

"The countdown is live. Any BU within fourteen days of the deadline highlights in amber — automatic visual escalation. At T+1, one day past the deadline, incomplete tickets are escalated automatically and flagged in the audit trail.

In a production deployment, this is also when the system fires reminders to BU owners and their line managers — through email, Teams, or whatever notification channel is configured. The system doesn't wait for Legal to chase manually."

---

---

# PHASE 4 — BUSINESS UNIT COMPLETION
*Steps 14 through 16. Recording the work. Approximately 5 minutes.*

---

## STEPS 14–16 — Compliance Measures, Evidence & Submit

**[DO]** Click the **Role Switcher** — switch back to **Business Unit**.

**[DO]** Click **My Ticket** in the left sidebar.

**[SCREEN: BuTicket — Compliance Ticket for Procurement / REMIT II]**

"Back to the BU. The compliance ticket. This is where the operational work gets documented — not just that something was done, but what exactly was done, by whom, linked to which specific obligation, with evidence attached."

**[POINT]** to the **Compliance Measures** section.

"First, the BU documents the controls they've implemented."

**[DO]** In the **Add a compliance measure** form, click **Use example**.

*The form populates with the example measure.*

**[POINT]** to the populated fields.

"Control description. The affected process. The specific control introduced — in this case, a contract classification and scope assessment procedure. The implementation date. The owner. And critically—"

**[POINT]** to the **Linked obligation** field.

"The obligation this control satisfies. Every measure is traceable to a specific regulatory requirement. When the audit report is generated, Legal can see exactly which obligation each control addresses."

**[DO]** Click **Add measure**.

*The measure appears in the list above.*

**[DO]** Scroll down to **Upload Evidence**.

"Now the evidence."

**[DO]** In the Upload Evidence form, open the **Choose a file** dropdown and select, for example, **REMIT II RRM Connectivity Test Report.pdf**. In the **Link to obligation** dropdown, select any obligation (e.g. *obl-3*).

**[DO]** Click **Upload evidence**.

*The file appears in the evidence list.*

"Each piece of evidence is linked directly to the obligation it satisfies. The compliance officer isn't just declaring 'we did it' — they're proving it, with a traceable link between each file and the specific regulatory requirement it addresses."

**[DO]** Scroll down to the **Sign-off** section.

"The sign-off. Three completion criteria — all need to be checked before the ticket can be submitted."

**[DO]** Check all three checkboxes: **Controls implemented and operating**, **Supporting evidence collected**, **Reviewed with the process owner**.

**[DO]** Check the **Owner confirmation** checkbox: *"I confirm, as Business Owner, that these measures are accurate and complete."*

**[POINT]** to the right-hand panel, which now shows **"All requirements met — ready to submit."** in green.

"All requirements met. The system validates the completion criteria before allowing submission — it's a structured sign-off process, not a free-form declaration."

**[DO]** Click **Submit & Close**.

*The success screen appears — green checkmark, "Compliance action submitted successfully."*

"Done. Legal is notified automatically. The ticket is closed and ready for audit review. The BU's work is recorded, evidenced, and linked to the obligation — permanently, in the audit trail."

---

---

# PHASE 5 — LEGAL: AUDIT & REPORTING
*Steps 17 and 18. The final word. Approximately 5 minutes.*

---

## STEP 17 — Monitoring Shows Ready for Audit

**[DO]** Click the **Role Switcher** — switch back to **Legal / Compliance**.

**[DO]** Click **Monitoring** in the left sidebar.

**[SCREEN: Monitoring]**

"Back to Legal. Look at the monitoring board now."

**[POINT]** to Procurement's row in the status table.

"Procurement has moved to Ready for Audit. The Days to Due column shows a dash — this obligation is closed, no countdown needed. Legal can see in real time that Procurement has submitted."

**[POINT]** to the progress KPI strip at the top.

"The KPI strip reflects it immediately. Completed count is up. The programme is progressing."

---

## STEP 18 — Audit & Regulatory Reporting

**[DO]** Click **Audit & Reporting** in the left sidebar.

**[SCREEN: Audit — Audit & Regulatory Reporting]**

"The final destination. This is where Legal demonstrates that the organisation met its obligations."

**[POINT]** to the **per-BU audit table** at the top.

"Communication sent. Viewed. Evidence uploaded. Completion date. Audit status for each Business Unit. The full completion record in one table — exactly what an external auditor or a regulator would want to see."

**[DO]** Scroll down to the **End-to-End Timeline** section (on the left of the two-column grid).

"The audit trail. Every event in the lifecycle of this regulatory change — with timestamps, actors, and narrative descriptions. Source detected. Catalogue updated. Communication sent. Notification viewed. Report downloaded. Support request raised. Response sent. Evidence uploaded. Submitted.

This is system-generated and immutable. It doesn't require anyone to write it up after the fact. The trail is created in real time, as the workflow runs."

**[DO]** Scroll to the **Evidence Repository** (right column).

**[POINT]** to the evidence table.

"Every file uploaded, linked to the obligation it satisfies, with the Business Unit, the person who uploaded it, and the date. End-to-end provenance for every piece of compliance evidence."

**[DO]** Scroll down to the **Regulatory Action Plan Report** section. Click **Generate Report**.

*The generation animation runs: "Compiling audit trail…" / "Aggregating evidence…" / "Assessing obligation coverage…" / "Finalising compliance status…" — approximately 2–3 seconds.*

*The report appears.*

"The Regulatory Action Plan Report. The system is compiling everything we've seen today into one consolidated document."

**[POINT]** to the different sections of the report — obligations, BU statuses, evidence collected, communications, audit trail.

"Four obligations documented. Five Business Unit statuses. Evidence collected — linked to each obligation. Communications sent. The full audit trail reproduced as a structured report. And at the bottom—"

**[POINT]** to the **Final compliance status** block at the bottom of the report.

"The final compliance status. This is the statement that goes to the Board. This is what you hand to an ACER inspector. This is the document that answers the question: did we comply?"

**[DO]** Click **Export**.

*A toast notification confirms the download.*

"One click. This is what you bring to a regulatory inspection, to your external auditors, or to your Board's compliance committee — generated automatically from the live workflow, with no manual assembly required."

---

---

# OPTIONAL EXTENSION — AI TOOLS
*If time permits, approximately 3–5 minutes. Works well as a closing flourish.*

**[DO]** Click **AI Tools** in the left sidebar.

**[SCREEN: AI Tools]**

"Before I hand back, I want to show you one more capability that sits alongside the core workflow — the AI toolset available directly to the Legal team."

**[POINT]** to the tab strip — Summarise, Translate, Ask a Question, Compare Versions, Jurisdiction.

"Five tools. Let me show you the two that tend to generate the most discussion."

---

### Compare Versions

**[DO]** Click the **Compare Versions** tab.

**[POINT]** to the context strip showing REMIT I → REMIT II.

"This compares REMIT I to REMIT II — maps every obligation change between the two versions. Let me run it."

**[DO]** Click **Run comparison**.

*The thinking indicator runs for 2 seconds. Items reveal one by one.*

"Watch the AI reveal each finding as it works through the comparison."

**[POINT]** to items as they appear.

"New obligations — the hard T+1 deadline, intragroup transactions explicitly in scope, the lifecycle event reporting requirement. Modified provisions — LEI is now mandatory where previously national identifiers were accepted. Eliminated provisions — volume-based thresholds are gone, national reporting schemes are gone.

For a Legal team that lived through REMIT I implementation, this instantly surfaces what has changed and what the new exposure is."

---

### Jurisdiction Comparison

**[DO]** Click the **Jurisdiction** tab.

"And this — I think — is particularly relevant for any organisation operating across multiple European energy markets."

**[POINT]** to the two jurisdiction dropdowns.

"I can compare how any two National Regulatory Authorities are implementing REMIT II. The regulation is EU-wide, but the NRAs have taken different approaches. Let me compare Greece and Germany."

**[DO]** Ensure **Jurisdiction A** is set to **🇬🇷 Greece (RAE)** and **Jurisdiction B** is set to **🇩🇪 Germany (BNetzA)**. Click **Compare**.

*The thinking indicator runs — approximately 2 seconds. Cards reveal sequentially.*

"Let me point out a few of these."

**[POINT]** to the **Enforcement approach at go-live** card.

"Germany: zero tolerance from day one. A formal enforcement procedure opens after the first missed submission. Greece: a 60-day supervisory tolerance window for technical issues. That's a material difference in how much operational runway you have if something goes wrong at go-live."

**[POINT]** to the **Dual national reporting obligation** card.

"Germany requires a parallel notification to the BNetzA national portal for transactions on German venues — in addition to ACER ARIS. That doesn't exist under Greek jurisdiction. If you have a trading subsidiary in Germany, you need a separate submission process."

**[POINT]** to the **Financial penalty ceiling** card.

"Penalty ceiling: BNetzA up to €5 million per infringement. RAE: €500,000. Same regulation, ten times the exposure on the German side.

This kind of intelligence normally requires retaining local legal counsel in each jurisdiction. Here it's available instantly, from within the platform, for any pair of NRAs across the five major energy markets."

---

---

# CLOSING
*Approximately 2 minutes.*

**[DO]** Navigate back to the **Legal / Compliance Dashboard** as a final anchor point.

"Let me quickly recap what we've walked through — because it's easy to lose the thread of a workflow that long.

We started with an AI agent that detected a regulatory change from a monitored public source, extracted its metadata, and added it to the catalogue. Automated. Seconds.

The system mapped four obligations and assessed the impact across five Business Units. That analytical work — which normally takes a senior legal resource the better part of a day — was done ahead of time.

We generated a BU-specific communication report in seconds. Legal reviewed and approved it. It went to five Business Units in one action, with tickets and tracking activated automatically.

Each Business Unit received a clear, plain-language view of what the regulation means for them specifically. They had access to an AI advisory assistant that answered from the actual report content — not generic AI responses, but answers grounded in your own documentation.

A support request was raised and answered — entirely within the platform — with the full exchange logged in the audit trail.

The system issued reminders automatically as the deadline approached. The Business Unit documented their controls, uploaded evidence linked to specific obligations, and submitted — with a structured sign-off process.

And we generated a consolidated audit report — every obligation, every BU, every piece of evidence, the complete audit trail — in one click.

The process you've just seen typically takes weeks of coordination: emails, spreadsheets, chaser calls, manually assembled audit packs. What this platform does is turn that into a coherent, AI-augmented workflow with complete traceability at every step.

I'd like to understand how your current process compares — where the friction is highest, where things get lost, where the audit preparation currently sits. That's usually the most useful starting point for a conversation about implementation. Over to you."

---

---

# PRESENTER NOTES & CONTINGENCIES

## If a question derails the flow
Stay on the current screen. Answer the question, then say: *"Let me keep that thread open — I want to show you something in the next few steps that will speak directly to that point."* Return to the script at the next natural step.

## If the demo needs to be shortened to 15–20 minutes
Cover Steps 1, 3, 4–6, 10, 12, 18. Skip Steps 2, 7–9, 11, 13–17 but narrate them verbally: *"The BU receives the notification, views the report, interacts with the AI assistant, raises a support request — all within the same system. Let me jump ahead to show you what Legal sees at the end of that process."*

## If asked about data security / where data lives
"In this demo everything runs locally — no data leaves this machine. The production architecture is fully configurable: on-premise, private cloud, or a managed environment depending on your data sovereignty requirements."

## If asked about integration with existing systems
"The platform is designed to integrate with your existing regulatory monitoring subscriptions, your ITSM tool for ticket management, and your document management system. We'd map those integrations as part of the implementation scoping — nothing in the workflow requires replacing existing systems."

## If asked whether the AI responses are 'hallucinated'
"In the advisory tools — the BU chatbot and the Legal AI Tools — the AI answers exclusively from the documents and obligation mapping in the system. It cannot generate an answer that has no basis in the source material. The citation tag on every AI response shows you exactly which section it came from. That traceability is a design constraint, not an optional feature."

## If asked about the reset / demo nature
"What you're seeing is a scripted demonstration running on anonymised data. The architecture, the workflow, the AI moments are all production-representative — we would seed your live regulatory data and your actual Business Unit structure during implementation."

## Key numbers to have ready
- **5** Business Units impacted by REMIT II
- **4** obligations mapped
- **30 September 2026** implementation deadline
- **17** rows in the obligation mapping export (demonstrating one obligation → multiple actions)
- **18** steps in the end-to-end workflow

---

*End of script.*
