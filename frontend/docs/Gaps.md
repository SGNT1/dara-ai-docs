# Dara by SAGENT — Feature Gap Spec & Implementation Tracker

> **Last Updated:** 2026-02-18
> **Platform:** React 18 + TypeScript + Vite + Tailwind CSS
> **AI Engine:** Pyro AI (document classification, extraction, stamp/signature detection)

---

## Table of Contents

1. [Current State Summary](#1-current-state-summary)
2. [Exception Work Queue](#2-exception-work-queue)
3. [Loan Boarding / Dara Movement](#3-loan-boarding--dara-movement)
4. [Document Completeness Dashboard](#4-document-completeness-dashboard)
5. [Audit Trail & Activity History](#5-audit-trail--activity-history)
6. [Portfolio Analytics / Dara Data](#6-portfolio-analytics--dara-data)
7. [Global Search](#7-global-search)
8. [Bulk Actions & Export](#8-bulk-actions--export)
9. [QC Sampling & Review](#9-qc-sampling--review)
10. [Notifications & Alerts System](#10-notifications--alerts-system)
11. [User Roles & Permissions](#11-user-roles--permissions)
12. [Default Management / Dara Default](#12-default-management--dara-default)
13. [Borrower Portal / Dara Consumer](#13-borrower-portal--dara-consumer)
14. [AI Assistant / Dara AI Chat](#14-ai-assistant--dara-ai-chat)
15. [Servicing Transfer (MSR Sale/Purchase)](#15-servicing-transfer-msr-salepurchase)
16. [Post-Closing / Trailing Document Management](#16-post-closing--trailing-document-management)
17. [Escrow Analysis & Disbursement](#17-escrow-analysis--disbursement)
18. [Investor Reporting](#18-investor-reporting)
19. [UX Fixes to Existing Pages](#19-ux-fixes-to-existing-pages)

---

## 1. Current State Summary

### Services Implemented

| Service | Status | Screens | Key Capabilities |
|---------|--------|---------|-----------------|
| **AI Docs** | Complete | 6 screens | Batch upload, Pyro AI classification/extraction, document viewer, processing reports, file index templates with stacking order |
| **Advanced Recon** | Complete | 7 screens | Corporate advance reconciliation, invoice-to-ledger matching (V1 3-panel + V2 AI-assisted), upload wizard with CSV mapping, access controls, configurations |
| **Doc Audit** | Complete | 7 screens | Loan tape vs. document comparison, SOT version management, field-level accept/flag/override, upload wizard with existing batch association |
| **Unified Layout** | Complete | 1 component | Shared sidebar, service selector pills, per-service tab bars |

### Architecture

- **Routing:** ViewState string union in App.tsx (no router library)
- **State:** useState hooks in App.tsx, prop drilling to children
- **Layout:** UnifiedLayout.tsx wraps all three services
- **Mock Data:** constants.ts with static arrays
- **Styling:** Tailwind CSS via CDN, lucide-react icons

---

## 2. Exception Work Queue

**Priority:** 1 — Highest Impact
**Rationale:** Operationalizes existing Doc Audit + Recon data into a production-ready workflow. Mortgage servicers work from exception queues, not dashboards.

### Requirements

- [ ] **Cross-Service Exception Dashboard** — aggregates unresolved items from both Recon (unmatched invoices) and Doc Audit (mismatches, missing docs, low confidence) into one prioritized worklist
- [ ] **Exception Card/Row** — each item shows: loan number, borrower, exception type, source service (Recon/Doc Audit), severity (Critical/High/Medium/Low), age (days open), assigned analyst
- [ ] **Filtering & Sorting** — filter by service, exception type, severity, assigned user, age; sort by priority score or age
- [ ] **Assignment & Routing** — assign exceptions to specific analysts, reassign, bulk-assign
- [ ] **SLA Indicators** — color-coded aging badges (green < 24h, yellow 24-72h, red > 72h), SLA breach warnings
- [ ] **Inline Resolution** — click exception to navigate to the relevant Recon or Doc Audit detail screen with the exception pre-selected
- [ ] **Resolution Actions** — mark as resolved, escalate to manager, add comment, defer with reason
- [ ] **Summary Stats Bar** — total open, critical count, approaching SLA, resolved today

### Screens

| Screen | Description |
|--------|-------------|
| `ExceptionQueue.tsx` | Main worklist table with filters, assignment, SLA badges |
| `ExceptionDetail.tsx` | (Optional) Focused view for a single exception with full context and resolution form |

### Types

```typescript
type ExceptionSource = 'recon' | 'docAudit';
type ExceptionSeverity = 'Critical' | 'High' | 'Medium' | 'Low';
type ExceptionStatus = 'Open' | 'In Progress' | 'Escalated' | 'Deferred' | 'Resolved';

interface Exception {
  id: string;
  loanNumber: string;
  borrowerName: string;
  source: ExceptionSource;
  type: string; // 'Unmatched Invoice', 'Field Mismatch', 'Missing Document', 'Low Confidence'
  description: string;
  severity: ExceptionSeverity;
  status: ExceptionStatus;
  assignedTo: string | null;
  createdDate: string;
  slaDeadline: string;
  resolvedDate: string | null;
  comments: ExceptionComment[];
}
```

### Integration

- Add "Exceptions" as a 4th service pill in UnifiedLayout, or add as a tab within each service
- Wire into existing Recon unmatched data and Doc Audit mismatch/missing data

---

## 3. Loan Boarding / Dara Movement

**Priority:** 2
**Rationale:** Core Sagent product ([Dara Movement](https://sagent.com/products/dara/)). Natural extension of AI Docs classification — documents come in during servicing transfers and need to be classified, validated, and boarded.

### Requirements

- [ ] **Boarding Dashboard** — pipeline table showing incoming loan transfers with statuses: Pending, Data Validation, Document Review, Boarded, Exceptions
- [ ] **Transfer Manifest View** — side-by-side comparison of transferor data file vs. boarded data with field-level validation results (match/mismatch/missing)
- [ ] **Collateral File Checklist** — per-loan document completeness tracker showing required documents (Promissory Note, Deed of Trust, Assignments, Title Policy, Riders, Allonges) as present/missing/deficient
- [ ] **Trailing Document Queue** — list of post-transfer documents not yet received, with aging, expected date, and cure status
- [ ] **Boarding Upload Wizard** — 3-step wizard: Upload transferor data tape + Upload collateral images + Review & Board
- [ ] **Validation Rules Engine** — configurable field validation rules (required fields, data type checks, cross-field logic, range checks)
- [ ] **Exception Summary** — per-transfer exception counts by category (data exceptions, document exceptions, custodian exceptions)

### Screens

| Screen | Description |
|--------|-------------|
| `BoardingDashboard.tsx` | Transfer pipeline table + summary donut charts |
| `BoardingTransferDetail.tsx` | Loan list for a transfer with validation status per loan |
| `BoardingLoanDetail.tsx` | Field-by-field data validation + collateral checklist |
| `BoardingUploadWizard.tsx` | 3-step upload flow |
| `TrailingDocQueue.tsx` | Aging queue for missing post-transfer documents |

### Types

```typescript
type TransferStatus = 'Pending' | 'Data Validation' | 'Document Review' | 'Boarded' | 'Exceptions';
type DocumentPresence = 'Present' | 'Missing' | 'Deficient' | 'Trailing';

interface BoardingTransfer {
  id: string;
  transferorName: string;
  transferDate: string;
  totalLoans: number;
  dataValidated: number;
  docsReviewed: number;
  boarded: number;
  exceptions: number;
  status: TransferStatus;
}

interface CollateralItem {
  documentType: string;
  required: boolean;
  presence: DocumentPresence;
  receivedDate: string | null;
  expectedDate: string | null;
  deficiencyNotes: string | null;
}

interface BoardingLoan {
  id: string;
  transferId: string;
  loanNumber: string;
  borrowerName: string;
  dataFieldsValidated: number;
  dataFieldsFailed: number;
  collateralComplete: boolean;
  collateralItems: CollateralItem[];
  status: 'Pass' | 'Data Exceptions' | 'Doc Exceptions' | 'Both';
}
```

### Integration

- Add as a 4th service in UnifiedLayout: "Loan Boarding" (or "Movement")
- Reuse AI Docs Pyro classification for incoming collateral images
- Reuse Doc Audit field comparison patterns for data validation

---

## 4. Document Completeness Dashboard

**Priority:** 3
**Rationale:** Connects existing File Index Templates (stacking order) to per-loan validation. Currently templates exist but nothing evaluates loans against them.

### Requirements

- [ ] **Completeness Dashboard** — aggregate view: X% of loans have complete collateral files, Y loans missing documents, Z loans with deficiencies
- [ ] **Per-Loan Completeness View** — checklist of expected documents (from selected File Index Template) vs. actual classified documents, showing present/missing/extra
- [ ] **Template Selection** — choose which File Index Template to evaluate against
- [ ] **Missing Document Report** — filterable list of all loans with missing required documents, grouped by document type
- [ ] **Cure Workflow** — request missing document (generate request), track request status, mark as received when uploaded
- [ ] **Batch Completeness Score** — percentage bar per batch showing collateral health
- [ ] **Export** — CSV/PDF export of completeness report

### Screens

| Screen | Description |
|--------|-------------|
| `DocCompletenessDashboard.tsx` | Aggregate stats + template selector + batch-level scores |
| `DocCompletenessLoanView.tsx` | Per-loan checklist with cure actions |
| `MissingDocReport.tsx` | Cross-loan missing document report |

### Types

```typescript
type CompletenessStatus = 'Complete' | 'Incomplete' | 'Deficient';
type CureStatus = 'Not Requested' | 'Requested' | 'Received' | 'Waived';

interface LoanCompleteness {
  loanId: string;
  loanNumber: string;
  borrowerName: string;
  templateId: string;
  totalRequired: number;
  present: number;
  missing: number;
  deficient: number;
  status: CompletenessStatus;
  items: CompletenessItem[];
}

interface CompletenessItem {
  documentType: string;
  required: boolean;
  signatureRequired: boolean;
  stampRequired: boolean;
  recordedRequired: boolean;
  present: boolean;
  deficiency: string | null;
  cureStatus: CureStatus;
  requestedDate: string | null;
}
```

### Integration

- Add as a tab or sub-view within AI Docs service
- Consumes File Index Templates for expected document lists
- Consumes Pyro AI classified documents for actual document inventory

---

## 5. Audit Trail & Activity History

**Priority:** 4
**Rationale:** CFPB compliance requirement. Examiners expect full audit trails. Currently only AI Docs has a basic Activity tab; Recon and Doc Audit have none.

### Requirements

- [ ] **Per-Loan Audit Trail** — timestamped log of all actions on a loan: viewed, field accepted/flagged/overridden, match confirmed, document uploaded, SOT designated, assignment changed
- [ ] **Per-Document Version History** — who uploaded each version, who designated SOT, when
- [ ] **User Attribution** — every action tied to a user name/role
- [ ] **Global Activity Feed** — filterable activity stream across all services (AI Docs Activity tab pattern extended platform-wide)
- [ ] **Export-Ready Compliance Log** — CSV export of audit trail for a loan or date range (CFPB examination readiness)
- [ ] **Action Persistence** — Doc Audit accept/flag/override and Recon match confirmations must persist across sessions (currently lost on page navigation)

### Screens

| Screen | Description |
|--------|-------------|
| `AuditTrailPanel.tsx` | Reusable component embedded in loan detail screens |
| `GlobalActivityFeed.tsx` | Platform-wide activity log (extends existing ActivityTab) |

### Types

```typescript
interface AuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string; // 'Viewed', 'Accepted Field', 'Flagged Field', 'Confirmed Match', etc.
  entityType: 'loan' | 'document' | 'batch' | 'exception' | 'transfer';
  entityId: string;
  details: string;
  previousValue?: string;
  newValue?: string;
}
```

### Integration

- Add AuditTrailPanel to: DocAuditLoanDetail, ReconLoanInvoiceV2, BoardingLoanDetail
- Extend existing ActivityTab in AI Docs to include all services
- Store actions in mock data (future: real persistence layer)

---

## 6. Portfolio Analytics / Dara Data

**Priority:** 5
**Rationale:** Executive-level dashboard tying all three services together. Sagent's [Dara Data](https://sagent.com/products/dara/) provides comprehensive real-time analytics.

### Requirements

- [ ] **Executive Dashboard** — single-page overview with KPIs across all services
- [ ] **AI Docs Metrics** — processing throughput (docs/day), Pyro accuracy trend, classification distribution by document type, failure rate
- [ ] **Recon Metrics** — match rate trend over time, average time to reconcile, unmatched invoice aging, top exception categories
- [ ] **Doc Audit Metrics** — field match rate trend, common mismatch fields, SOT confirmation rate, exception resolution rate
- [ ] **Compliance Scorecard** — document completeness %, audit trail coverage %, SLA compliance %, exception aging distribution
- [ ] **Trend Charts** — line/bar charts showing weekly/monthly trends (volume, accuracy, match rates)
- [ ] **Drill-Down** — click any metric to navigate to the relevant service dashboard
- [ ] **Date Range Selector** — filter all metrics by custom date range
- [ ] **Export** — PDF report generation for executive summaries

### Screens

| Screen | Description |
|--------|-------------|
| `AnalyticsDashboard.tsx` | KPI cards + trend charts + compliance scorecard |
| `AnalyticsDetail.tsx` | (Optional) Drill-down view for specific metric category |

### Types

```typescript
interface PortfolioMetrics {
  aiDocs: {
    totalBatches: number;
    totalDocumentsProcessed: number;
    avgPyroAccuracy: number;
    failureRate: number;
    throughputPerDay: number;
    classificationBreakdown: { docType: string; count: number }[];
  };
  recon: {
    totalBatches: number;
    overallMatchRate: number;
    avgReconciliationDays: number;
    openUnmatched: number;
    topExceptionTypes: { type: string; count: number }[];
  };
  docAudit: {
    totalAudits: number;
    overallFieldMatchRate: number;
    sotConfirmationRate: number;
    openExceptions: number;
    commonMismatchFields: { field: string; count: number }[];
  };
  compliance: {
    docCompletenessRate: number;
    auditTrailCoverage: number;
    slaComplianceRate: number;
    exceptionAgingDistribution: { bucket: string; count: number }[];
  };
}
```

### Integration

- Add as a new service pill "Analytics" in UnifiedLayout, or as a dashboard accessible from a header icon
- Aggregates data from all three existing services

---

## 7. Global Search

**Priority:** 6
**Rationale:** The sidebar already has a non-functional "Search" icon. Activating it provides cross-service discoverability.

### Requirements

- [ ] **Search Bar** — click sidebar Search icon to open search overlay or panel
- [ ] **Cross-Service Results** — search returns results from AI Docs (batches, documents), Recon (batches, loans, invoices), Doc Audit (audits, loans), Boarding (transfers, loans)
- [ ] **Result Categories** — grouped by entity type with counts (e.g., "3 Loans, 2 Batches, 1 Document")
- [ ] **Advanced Filters** — date range, service, status, document type, confidence range
- [ ] **Quick Navigation** — click result to navigate directly to the relevant detail screen
- [ ] **Recent Searches** — persist last 10 searches for quick access
- [ ] **Saved Searches / Filter Presets** — save commonly used filter combinations

### Screens

| Screen | Description |
|--------|-------------|
| `GlobalSearch.tsx` | Search overlay with input, filters, categorized results |

### Types

```typescript
type SearchResultType = 'batch' | 'loan' | 'document' | 'invoice' | 'audit' | 'transfer' | 'exception';

interface SearchResult {
  id: string;
  type: SearchResultType;
  service: ActiveService | 'boarding';
  title: string;
  subtitle: string;
  status: string;
  matchedField: string;
  navigateTo: ViewState;
}
```

---

## 8. Bulk Actions & Export

**Priority:** 7
**Rationale:** Table-stakes UX for production workflows. Current app only supports one-at-a-time actions.

### Requirements

- [ ] **Multi-Select in Tables** — checkbox column in all data tables (loans, invoices, exceptions, fields)
- [ ] **Bulk Accept** — select multiple passing fields in Doc Audit and accept all at once
- [ ] **Bulk Confirm Match** — select multiple matched invoices in Recon and confirm all
- [ ] **Bulk Assign** — select multiple exceptions and assign to an analyst
- [ ] **Bulk Status Change** — mark multiple items as resolved/deferred/escalated
- [ ] **Select All / Select Page** — header checkbox for page-level selection
- [ ] **Action Bar** — floating bar appears when items selected, showing available bulk actions and selection count
- [ ] **CSV Export** — export any table view to CSV with current filters applied
- [ ] **PDF Report** — generate formatted PDF reports for: batch processing report, reconciliation summary, audit results, completeness report
- [ ] **Export History** — track generated exports with download links

### Components

| Component | Description |
|-----------|-------------|
| `BulkActionBar.tsx` | Reusable floating action bar for multi-select tables |
| `ExportButton.tsx` | Reusable export dropdown (CSV, PDF options) |

---

## 9. QC Sampling & Review

**Priority:** 8
**Rationale:** Regulatory requirement for mortgage servicers. Natural extension of Doc Audit for compliance teams.

### Requirements

- [ ] **QC Dashboard** — overview of QC review cycles: active reviews, completed, defect rates
- [ ] **Sample Selection** — configure sampling criteria: random %, targeted (by risk score, loan amount, exception count), stratified (by investor, state, loan type)
- [ ] **QC Checklist Workstation** — per-loan review form with compliance checklist items, pass/fail per item, comments, evidence attachment
- [ ] **Defect Tracking** — categorized defects: severity (Critical/Major/Minor), root cause category (Data Entry, Classification, Missing Doc, Process), corrective action
- [ ] **QC Reporting** — defect rate trends, common defect categories, defect-by-reviewer analysis
- [ ] **Re-Review Workflow** — flagged defects can be sent back to original analyst for correction

### Screens

| Screen | Description |
|--------|-------------|
| `QCDashboard.tsx` | Review cycle overview + defect rate charts |
| `QCSampleConfig.tsx` | Sampling criteria configuration |
| `QCReviewWorkstation.tsx` | Per-loan checklist review form |
| `QCDefectReport.tsx` | Defect tracking and analysis |

### Types

```typescript
type QCResult = 'Pass' | 'Fail - Critical' | 'Fail - Major' | 'Fail - Minor';
type DefectCategory = 'Data Entry' | 'Classification Error' | 'Missing Document'
  | 'Process Violation' | 'Extraction Error' | 'SOT Designation' | 'Other';

interface QCReview {
  id: string;
  cycleId: string;
  loanId: string;
  loanNumber: string;
  reviewerId: string;
  reviewDate: string;
  result: QCResult;
  checklistItems: QCChecklistItem[];
  defects: QCDefect[];
}

interface QCChecklistItem {
  id: string;
  category: string;
  description: string;
  result: 'Pass' | 'Fail' | 'N/A';
  comments: string | null;
}

interface QCDefect {
  id: string;
  severity: 'Critical' | 'Major' | 'Minor';
  category: DefectCategory;
  description: string;
  rootCause: string;
  correctiveAction: string;
  status: 'Open' | 'Corrected' | 'Waived';
}
```

---

## 10. Notifications & Alerts System

**Priority:** 9
**Rationale:** Both Recon and Doc Audit Settings have notification checkboxes but nothing consumes them.

### Requirements

- [ ] **Notification Bell** — icon in UnifiedLayout header bar with unread count badge
- [ ] **Notification Dropdown** — click bell to see recent notifications with mark-as-read
- [ ] **Notification Types:**
  - Batch processing complete
  - Exception SLA approaching / breached
  - Reconciliation batch ready for review
  - Doc Audit exceptions above threshold
  - Boarding transfer data received
  - Assignment notification (exception assigned to you)
  - QC review cycle started
- [ ] **Notification Preferences** — per-user settings (already partially in Recon Configs and Doc Audit Settings — connect to real behavior)
- [ ] **Notification History** — full list with filters by type, date, read/unread

### Components

| Component | Description |
|-----------|-------------|
| `NotificationBell.tsx` | Header icon with dropdown |
| `NotificationCenter.tsx` | Full notification history page |

### Types

```typescript
type NotificationType = 'batch_complete' | 'sla_warning' | 'sla_breach'
  | 'recon_ready' | 'audit_exception' | 'transfer_received'
  | 'assignment' | 'qc_started';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl: ViewState;
  entityId: string;
}
```

---

## 11. User Roles & Permissions

**Priority:** 10
**Rationale:** Recon has an Access Controls tab but no actual enforcement. Compliance requires role-based access.

### Requirements

- [ ] **Role Definitions** — Analyst, Senior Analyst, Manager, Auditor, Admin with different permissions per service
- [ ] **Login Enhancement** — role selection or role-based routing on login
- [ ] **Permission Enforcement** — hide/disable actions based on role (e.g., only Manager can override fields, only Admin can change configurations)
- [ ] **Approval Workflows** — junior analyst flags exception, manager approves resolution
- [ ] **User Management** — extend Recon AccessControls pattern to all services
- [ ] **Session Info** — show logged-in user name and role in UnifiedLayout header

### Affected Files

- `Login.tsx` — add role selection
- `UnifiedLayout.tsx` — add user info to header
- All action buttons — conditional rendering based on role

---

## 12. Default Management / Dara Default

**Priority:** 11
**Rationale:** Sagent's [Dara Default](https://sagent.com/products/dara/) is a major product component but not represented.

### Requirements

- [ ] **Collections Queue** — prioritized borrower contact list by delinquency tier (30/60/90/120+ days)
- [ ] **Contact Attempt Log** — track outbound calls, emails, letters with outcomes
- [ ] **Loss Mitigation Workstation** — hardship application intake, required document tracking, workout option comparison (forbearance, modification, repayment plan, short sale, deed-in-lieu)
- [ ] **Loss Mit Document Tracker** — checklist of required hardship docs (hardship letter, pay stubs, tax returns, bank statements) with received/missing status
- [ ] **Foreclosure Timeline** — milestone tracker with key dates (referral, first legal, judgment, sale), attorney assignment, state-specific timeline rules
- [ ] **Bankruptcy Monitor** — active bankruptcy cases with filing type (Ch 7/13), court dates, motion deadlines, proof of claim status

### Screens

| Screen | Description |
|--------|-------------|
| `CollectionsQueue.tsx` | Prioritized contact list with delinquency tiers |
| `LossMitWorkstation.tsx` | Application intake + document tracking + workout comparison |
| `ForeclosureTimeline.tsx` | Milestone tracker with attorney integration |
| `BankruptcyMonitor.tsx` | Active cases with court date tracking |

---

## 13. Borrower Portal / Dara Consumer

**Priority:** 12
**Rationale:** Sagent's [Dara Consumer](https://sagent.com/products/dara/) is a mobile-first homeowner experience.

### Requirements

- [ ] **Borrower Dashboard** — next payment due, current balance, escrow balance, recent payments, loan details
- [ ] **Payment History** — searchable/filterable list of all payments with breakdown (principal, interest, escrow)
- [ ] **Document Center** — borrower-accessible documents (statements, escrow analysis, tax forms, payoff quotes)
- [ ] **Hardship Self-Service** — guided intake form for hardship requests with document upload
- [ ] **Secure Messaging** — borrower-to-servicer thread with read receipts and response SLA
- [ ] **Mobile-First Design** — responsive layout optimized for phone/tablet

### Screens

| Screen | Description |
|--------|-------------|
| `BorrowerDashboard.tsx` | Loan snapshot + upcoming payment + recent activity |
| `BorrowerPaymentHistory.tsx` | Payment list with breakdowns |
| `BorrowerDocumentCenter.tsx` | Downloadable documents |
| `BorrowerHardshipWizard.tsx` | Guided hardship intake |
| `BorrowerMessaging.tsx` | Secure message thread |

---

## 14. AI Assistant / Dara AI Chat

**Priority:** 13
**Rationale:** Sagent advertises generative AI chat. Differentiator for the platform.

### Requirements

- [ ] **Chat Panel** — slide-over or sidebar panel accessible from any screen
- [ ] **Contextual Awareness** — AI knows which loan/batch/audit you're viewing and can answer questions about it
- [ ] **Natural Language Queries** — "Show me all loans with address mismatches", "What's the SOT for loan 2048119301?", "Summarize exceptions for Carrington Q1 audit"
- [ ] **Action Suggestions** — AI suggests next steps ("3 fields are flagged — would you like to review them?")
- [ ] **Conversation History** — persist chat threads per user

### Components

| Component | Description |
|-----------|-------------|
| `AiChatPanel.tsx` | Slide-over chat interface |
| `AiChatMessage.tsx` | Individual message bubble (user/assistant) |

---

## 15. Servicing Transfer (MSR Sale/Purchase)

**Priority:** 14
**Rationale:** When mortgage servicing rights (MSRs) are bought or sold, specific workflows apply.

### Requirements

- [ ] **Due Diligence Bid Tape** — upload bid tape, validate against portfolio data, generate variance report
- [ ] **Goodbye/Hello Letter Tracking** — RESPA-required borrower notifications with mailing status and 15-day timeline compliance
- [ ] **Data Reconciliation** — transferor-to-transferee field-by-field validation (separate from Doc Audit — this is data-file-to-data-file)
- [ ] **Transfer Checklist** — regulatory checklist: data transferred, documents transferred, notices sent, insurance continued, escrow balanced
- [ ] **Cutover Dashboard** — transfer effective date countdown, pre/post-cutover task lists

### Screens

| Screen | Description |
|--------|-------------|
| `TransferDueDiligence.tsx` | Bid tape upload + variance analysis |
| `TransferNoticeTracking.tsx` | Goodbye/hello letter status tracking |
| `TransferDataRecon.tsx` | Transferor vs. transferee data validation |
| `TransferChecklist.tsx` | Regulatory compliance checklist |

---

## 16. Post-Closing / Trailing Document Management

**Priority:** 15
**Rationale:** Post-closing documents (recorded deeds, final title policies) trickle in over weeks/months and must be tracked.

### Requirements

- [ ] **Trailing Docs Dashboard** — aggregate view of all outstanding trailing documents across the portfolio
- [ ] **Per-Loan Trailing Docs** — list of expected trailing documents with status: Pending, Received, Overdue
- [ ] **Aging Report** — trailing documents past expected receipt date, grouped by type and age bucket
- [ ] **Custodian Exception Tracking** — document custodian (bank vault) reported exceptions with cure status
- [ ] **Investor Delivery Tracking** — collateral packages delivered to investors (Fannie/Freddie/Ginnie) with delivery confirmation status
- [ ] **Automated Reminders** — configurable reminders for approaching/overdue trailing documents

### Screens

| Screen | Description |
|--------|-------------|
| `TrailingDocsDashboard.tsx` | Aggregate outstanding docs + aging chart |
| `CustodianExceptions.tsx` | Custodian-reported exceptions with cure workflow |
| `InvestorDelivery.tsx` | Delivery status tracking per investor |

---

## 17. Escrow Analysis & Disbursement

**Priority:** 16
**Rationale:** Core servicing function completely absent from the platform.

### Requirements

- [ ] **Escrow Analysis Dashboard** — annual analysis results: loans with shortage, surplus, or deficiency
- [ ] **Per-Loan Escrow Detail** — projected vs. actual escrow balance, line items (tax, insurance, PMI, HOA), shortage/surplus calculation
- [ ] **Disbursement Tracking** — scheduled tax and insurance payments with due dates, amounts, payee, payment status (Scheduled/Paid/Overdue)
- [ ] **Escrow Statement Preview** — borrower-facing statement showing analysis results and new payment amount
- [ ] **Bulk Analysis Run** — trigger annual escrow analysis for portfolio or subset

### Screens

| Screen | Description |
|--------|-------------|
| `EscrowDashboard.tsx` | Analysis results overview + disbursement calendar |
| `EscrowLoanDetail.tsx` | Per-loan escrow breakdown + projected balance chart |
| `DisbursementTracker.tsx` | Payment schedule with status tracking |

---

## 18. Investor Reporting

**Priority:** 17
**Rationale:** Servicers must report to investors monthly. Not represented in current app.

### Requirements

- [ ] **Investor Remittance Dashboard** — scheduled vs. actual remittance amounts by investor
- [ ] **Pool-Level Reporting** — aggregate statistics by investor, pool, or security ID
- [ ] **Reporting Calendar** — deadlines for each investor with countdown and submission status
- [ ] **Variance Report** — loans with reporting discrepancies between servicer records and investor expectations
- [ ] **Report Generation** — auto-generate investor-formatted reports (Fannie Mae LLD, Freddie Mac, Ginnie Mae)

### Screens

| Screen | Description |
|--------|-------------|
| `InvestorDashboard.tsx` | Remittance overview + calendar + variance alerts |
| `InvestorPoolDetail.tsx` | Pool-level statistics and loan list |
| `InvestorReportGen.tsx` | Report generation with format selection |

---

## 19. UX Fixes to Existing Pages

**Priority:** Ongoing
**Rationale:** Gaps in current implementation that don't require new features, just polish.

### Layout & Navigation

- [ ] **Activate Sidebar Icons** — Search, Compliance, Core, etc. are currently decorative. At minimum, Search should open Global Search
- [ ] **Breadcrumb Trail** — consistent breadcrumbs across all detail screens for easy back-navigation
- [ ] **Keyboard Navigation** — ensure all interactive elements are keyboard accessible (tab order, enter/space activation)
- [ ] **Responsive Design** — test and fix layouts at common breakpoints (1280px, 1440px, 1920px)

### Data Persistence

- [ ] **State Preservation on Service Switch** — switching services currently resets to default view; consider preserving last-visited view per service
- [ ] **Action Persistence** — Doc Audit accept/flag/override and Recon match confirmations should persist (currently lost on navigation)

### Tables

- [ ] **Column Sorting** — all table columns should be sortable (click header to toggle asc/desc)
- [ ] **Column Resizing** — drag column borders to resize
- [ ] **Empty States** — meaningful empty state messages when no data matches filters
- [ ] **Loading States** — skeleton loaders for data-fetching states (future: when connected to real APIs)

### Forms

- [ ] **Validation Feedback** — real-time validation on all form inputs (Upload Wizards, Settings, Configurations)
- [ ] **Unsaved Changes Warning** — prompt before navigating away from forms with unsaved changes
- [ ] **Undo/Redo** — for field-level actions in Doc Audit and Recon (currently one-way)

---

## Implementation Notes

### Adding a New Service to UnifiedLayout

1. Add service key to `ActiveService` type in `types.ts`
2. Add service config to `SERVICE_CONFIG` array in `UnifiedLayout.tsx`
3. Add tab type (if applicable) and tab state in `App.tsx`
4. Add tab bar rendering block in `UnifiedLayout.tsx`
5. Add service routing block in `App.tsx`
6. Add default view to `handleServiceChange` in `App.tsx`

### File Naming Convention

- Dashboard screens: `{Service}Dashboard.tsx`
- Detail screens: `{Service}{Entity}Detail.tsx`
- List screens: `{Service}{Entity}List.tsx`
- Upload flows: `{Service}UploadWizard.tsx`
- Settings/Config: `{Service}Settings.tsx` or `{Service}Configurations.tsx`

### Color Palette by Service

| Service | Primary | Hover | Usage |
|---------|---------|-------|-------|
| AI Docs | `#0077c8` | `#0066b0` | Service pill, active tab underline |
| Advanced Recon | `#334155` | `#1e293b` | Service pill |
| Doc Audit | `#4f46e5` | `#4338ca` | Service pill, active tab underline |
| Loan Boarding | TBD | TBD | New service |
| Analytics | TBD | TBD | New service |
| Exceptions | TBD | TBD | New service or cross-service |

---

## References

- [Dara by Sagent Product Page](https://sagent.com/products/dara/)
- [Dara AI Docs](https://sagent.com/products/dara-ai-docs/)
- [Dara Movement / LoanBoard](https://sagent.com/products/loanserv-loanboard/)
- [Sagent 40% Cost Reduction](https://sagent.com/2024/02/21/introducing-dara-by-sagent-the-future-of-mortgage-servicing-platform-that-can-lower-costs-40/)
- [CFPB Servicing Transfer Guidance](https://files.consumerfinance.gov/f/documents/cfpb_policy-guidance_mortgage-servicing-transfers_2020-04.pdf)
- [CFPB Examination Manual](https://files.consumerfinance.gov/f/documents/cfpb_supervision-and-examination-manual.pdf)
- [ICE Mortgage Loan Boarding](https://mortgagetech.ice.com/products/loan-boarding)
- [First American Collateral File Perfection](https://www.firstam.com/mortgagesolutions/solutions/cleanfile-solutions/collateral-file-perfection.html)
- [Indecomm Trailing Docs Tracking](https://indecomm.com/article/find-your-keys-tackling-trailing-docs-tracking-post-close)
- [Vaultedge Loan Boarding Automation](https://vaultedge.com/solutions/mortgage/loan-boarding)
- [MetaSource Collateral File Review](https://mortgage.metasource.com/solutions/collateral-file-review-and-tracking/)
- [Pyro AI Capabilities](https://pyroai.com/capabilities)
