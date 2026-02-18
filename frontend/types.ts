export type ActiveService = 'aiDocs' | 'advancedRecon' | 'docAudit';

export type ViewState = 'login' | 'batchList' | 'batchDetails' | 'processingReport' | 'documentViewer'
  | 'fileIndexTemplates' | 'fileIndexTemplateEditor'
  | 'reconDashboard' | 'reconBatchDetail' | 'reconLoanInvoice' | 'reconLoanInvoiceV2' | 'reconUploadWizard'
  | 'docAuditDashboard' | 'docAuditLoanList' | 'docAuditLoanDetail' | 'docAuditUploadWizard';

export interface Batch {
  id: string;
  name: string;
  status: 'In progress' | 'Complete';
  totalFiles?: number;
  totalDocuments?: number;
  uploadDate: string;
}

export interface BatchFile {
  id: string;
  name: string;
  totalDocuments: number;
  classified: number;
  unknown: number;
  duplicates: number;
  failures: number;
  status: 'Classified' | 'Unknown' | 'Failed';
}

export interface DocumentItem {
  id: string;
  name: string;
  status: 'Classified' | 'Unknown';
  version: string;
  extractedFields: number;
  pages: number;
}

// Advanced Recon Types
export interface ReconBatch {
  id: string;
  transferName: string;
  transferDate: string;
  batchId: string;
  status: 'In Progress' | 'Complete' | 'Pending';
  loans: number;
  documents: number;
  matched: number;
  unmatched: number;
  uploadDateTime: string;
}

export interface ReconLoan {
  id: string;
  loanNumber: string;
  unmatchedPct: number;
  matchedPct: number;
  invoicesCount: number;
  ledgerEntries: number;
}

export interface Invoice {
  id: string;
  invoiceDate: string;
  payeeName: string;
  amount: number;
  description: string;
  status: 'Matched' | 'Unmatched' | 'Partial';
}

export interface LedgerEntry {
  id: string;
  date: string;
  payee: string;
  expDescrip: string;
  amount: number;
  percentage: number;
  action: string;
}

// ── V2 Recon Types ──

export interface PyroFieldExtraction {
  fieldName: string;
  extractedValue: string;
  confidence: number;
}

export interface InvoiceV2 {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  payeeName: string;
  amount: number;
  description: string;
  status: 'Matched' | 'Unmatched' | 'Partial';
  loanNumber: string;
  extractions: PyroFieldExtraction[];
  linkedLedgerEntryIds: string[];
}

export interface LedgerEntryV2 {
  id: string;
  date: string;
  payee: string;
  expDescrip: string;
  amount: number;
  percentage: number;
  action: 'Approved' | 'Pending' | 'Review';
  confidenceByInvoice: Record<string, number>;
}

// ── File Index Template Types ──

export interface FileIndexDocRule {
  id: string;
  documentTypeName: string;
  required: boolean;
  signatureRequired: boolean;
  stampRequired: boolean;
  recordedRequired: boolean;
}

export interface FileIndexTemplate {
  id: string;
  name: string;
  description: string;
  documentRules: FileIndexDocRule[];
  lastModified: string;
  createdDate: string;
  status: 'Active' | 'Draft';
}

// ── CSV Mapping Types ──

export type CsvTargetField = 'Date' | 'Payee' | 'Expense Description' | 'Amount' | 'Loan Number' | 'Invoice ID' | '-- Unmapped --';

export interface CsvColumnMapping {
  csvHeader: string;
  mappedField: CsvTargetField;
  confidence: number;
}

export interface CsvMappingTemplate {
  id: string;
  name: string;
  description: string;
  mappings: CsvColumnMapping[];
  lastModified: string;
}

// ── Doc Audit Types ──

export type DocAuditTab = 'Dashboard' | 'SOT Management' | 'Settings';

export interface DocAudit {
  id: string;
  name: string;
  uploadDate: string;
  totalLoans: number;
  sotConfirmed: number;
  matchRate: number;
  exceptions: number;
  status: 'Uploaded' | 'SOT Review' | 'Auditing' | 'In Review' | 'Complete';
}

export interface DocAuditLoan {
  id: string;
  auditId: string;
  loanNumber: string;
  borrowerName: string;
  fieldsCompared: number;
  matched: number;
  mismatched: number;
  missing: number;
  lowConfidence: number;
  status: 'Pass' | 'Needs Review' | 'Missing Docs';
}

export interface DocumentVersion {
  id: string;
  loanId: string;
  documentType: string;
  version: number;
  uploadDate: string;
  documentDate: string;
  source: string;
  pyroConfidence: number;
  isSot: boolean;
  extractions: PyroFieldExtraction[];
}

export interface LoanTapeField {
  id: string;
  loanId: string;
  fieldName: string;
  loanTapeValue: string;
  documentValue: string | null;
  sourceDocType: string;
  sourceDocVersion: number;
  confidence: number;
  status: 'Match' | 'Mismatch' | 'Missing' | 'Low Confidence';
  action: 'Pending' | 'Accepted' | 'Flagged' | 'Overridden';
}

export type LoanTapeTargetField = 'Loan Number' | 'Borrower Name' | 'Property Address'
  | 'Original Balance' | 'Current UPB' | 'Interest Rate' | 'Maturity Date'
  | 'Origination Date' | 'Loan Type' | 'Occupancy' | '-- Unmapped --';

export interface FieldSourceRule {
  loanTapeField: LoanTapeTargetField;
  sourceDocType: string;
  sourceExtractionField: string;
  fallbackDocType?: string;
}

export interface LoanTapeCsvColumnMapping {
  csvHeader: string;
  mappedField: LoanTapeTargetField;
  confidence: number;
}

export interface LoanTapeMappingTemplate {
  id: string;
  name: string;
  description: string;
  mappings: LoanTapeCsvColumnMapping[];
  lastModified: string;
}

export interface ExistingDocBatch {
  id: string;
  name: string;
  uploadDate: string;
  totalFiles: number;
  totalDocuments: number;
  loanCount: number;
  status: 'Complete' | 'In progress';
}
