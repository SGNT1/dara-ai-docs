import { Batch, BatchFile, DocumentItem, ReconBatch, ReconLoan, Invoice, LedgerEntry, InvoiceV2, LedgerEntryV2, FileIndexTemplate, CsvMappingTemplate, CsvColumnMapping, CsvTargetField, DocAudit, DocAuditLoan, DocumentVersion, LoanTapeField, FieldSourceRule, LoanTapeTargetField, LoanTapeCsvColumnMapping, LoanTapeMappingTemplate, ExistingDocBatch } from './types';

export const MOCK_BATCHES: Batch[] = [
  { id: '1', name: 'Carrington Transfer 2025', status: 'In progress', totalFiles: 645, totalDocuments: 1250, uploadDate: '06/05/2025' },
  { id: '2', name: 'Loan Transfer Package', status: 'In progress', totalFiles: 0, totalDocuments: 0, uploadDate: 'MM/DD/YYYY' },
  { id: '3', name: 'Wellington Final Loan Package', status: 'Complete', totalFiles: 200, totalDocuments: 245, uploadDate: 'MM/DD/YYYY' },
  { id: '4', name: 'Bourguignon Transfer Package 2024', status: 'Complete', totalFiles: 645, totalDocuments: 512, uploadDate: 'MM/DD/YYYY' },
  { id: '5', name: 'Carrington Transfer 2025', status: 'Complete', totalFiles: 389, totalDocuments: 378, uploadDate: 'MM/DD/YYYY' },
  { id: '6', name: 'Loan Transfer Package', status: 'Complete', totalFiles: 522, totalDocuments: 634, uploadDate: 'MM/DD/YYYY' },
  { id: '7', name: 'Wellington Final Loan Package', status: 'Complete', totalFiles: 634, totalDocuments: 459, uploadDate: 'MM/DD/YYYY' },
  { id: '8', name: 'Wellington 2023 Loan Package', status: 'Complete', totalFiles: 299, totalDocuments: 312, uploadDate: 'MM/DD/YYYY' },
  { id: '9', name: 'Loan Transfer Package', status: 'Complete', totalFiles: 471, totalDocuments: 689, uploadDate: 'MM/DD/YYYY' },
  { id: '10', name: 'Carrington Transfer 2025', status: 'Complete', totalFiles: 615, totalDocuments: 157, uploadDate: 'MM/DD/YYYY' },
];

export const MOCK_BATCH_FILES: BatchFile[] = [
  { id: 'f1', name: 'Loan File 1', totalDocuments: 123, classified: 123, unknown: 0, duplicates: 0, failures: 0, status: 'Classified' },
  { id: 'f2', name: 'Loan File 2', totalDocuments: 234, classified: 234, unknown: 0, duplicates: 0, failures: 0, status: 'Classified' },
  { id: 'f3', name: 'Loan File 3', totalDocuments: 345, classified: 345, unknown: 0, duplicates: 0, failures: 0, status: 'Classified' },
  { id: 'f4', name: 'Loan File 4', totalDocuments: 56, classified: 56, unknown: 0, duplicates: 0, failures: 0, status: 'Classified' },
  { id: 'f5', name: 'Loan File 5', totalDocuments: 78, classified: 78, unknown: 0, duplicates: 0, failures: 0, status: 'Classified' },
  { id: 'f6', name: 'Loan File 6', totalDocuments: 89, classified: 89, unknown: 0, duplicates: 0, failures: 0, status: 'Classified' },
  { id: 'f7', name: 'Loan File 7', totalDocuments: 90, classified: 90, unknown: 0, duplicates: 0, failures: 0, status: 'Classified' },
  { id: 'f8', name: 'Loan File 8', totalDocuments: 101, classified: 101, unknown: 0, duplicates: 0, failures: 0, status: 'Classified' },
  { id: 'f9', name: 'Loan File 9', totalDocuments: 212, classified: 212, unknown: 0, duplicates: 0, failures: 0, status: 'Classified' },
  { id: 'f10', name: 'Loan File 10', totalDocuments: 323, classified: 323, unknown: 0, duplicates: 0, failures: 0, status: 'Classified' },
  { id: 'f11', name: 'Loan File 11', totalDocuments: 234, classified: 234, unknown: 0, duplicates: 0, failures: 0, status: 'Classified' },
  { id: 'f12', name: 'Loan File 12', totalDocuments: 145, classified: 145, unknown: 0, duplicates: 0, failures: 0, status: 'Classified' },
  { id: 'f13', name: 'Loan File 13', totalDocuments: 256, classified: 256, unknown: 0, duplicates: 0, failures: 0, status: 'Classified' },
  { id: 'f14', name: 'Loan File 14', totalDocuments: 367, classified: 367, unknown: 0, duplicates: 0, failures: 0, status: 'Classified' },
  { id: 'f15', name: 'Loan File 15', totalDocuments: 278, classified: 278, unknown: 0, duplicates: 0, failures: 0, status: 'Classified' },
  { id: 'f16', name: 'Loan File 16', totalDocuments: 189, classified: 189, unknown: 0, duplicates: 0, failures: 0, status: 'Classified' },
];

export const MOCK_DOCUMENTS: DocumentItem[] = [
  { id: 'd1', name: 'Document 1', status: 'Classified', version: 'V1', extractedFields: 8, pages: 1 },
  { id: 'd2', name: 'Document 2', status: 'Classified', version: 'V1', extractedFields: 9, pages: 2 },
  { id: 'd3', name: 'Document 3', status: 'Classified', version: 'V1', extractedFields: 10, pages: 3 },
  { id: 'd4', name: 'Document 4', status: 'Classified', version: 'V1', extractedFields: 11, pages: 4 },
  { id: 'd5', name: 'Document 5', status: 'Classified', version: 'V1', extractedFields: 7, pages: 5 },
  { id: 'd6', name: 'Document 6', status: 'Classified', version: 'V1', extractedFields: 12, pages: 6 },
  { id: 'd7', name: 'Document 7', status: 'Classified', version: 'V1', extractedFields: 10, pages: 7 },
  { id: 'd8', name: 'Document 8', status: 'Unknown', version: 'V1', extractedFields: 9, pages: 8 },
  { id: 'd9', name: 'Document 9', status: 'Classified', version: 'V1', extractedFields: 11, pages: 9 },
  { id: 'd10', name: 'Document 10', status: 'Classified', version: 'V1', extractedFields: 8, pages: 10 },
  { id: 'd11', name: 'Document 11', status: 'Unknown', version: 'V1', extractedFields: 12, pages: 11 },
  { id: 'd12', name: 'Document 12', status: 'Classified', version: 'V1', extractedFields: 7, pages: 12 },
  { id: 'd13', name: 'Document 13', status: 'Unknown', version: 'V1', extractedFields: 10, pages: 13 },
  { id: 'd14', name: 'Document 14', status: 'Classified', version: 'V1', extractedFields: 11, pages: 14 },
  { id: 'd15', name: 'Document 15', status: 'Classified', version: 'V1', extractedFields: 9, pages: 15 },
  { id: 'd16', name: 'Document 16', status: 'Classified', version: 'V1', extractedFields: 8, pages: 1 },
  { id: 'd17', name: 'Document 16', status: 'Classified', version: 'V1', extractedFields: 12, pages: 2 },
];

// ── Advanced Recon Mock Data ──

export const MOCK_RECON_BATCHES: ReconBatch[] = [
  { id: 'rb1', transferName: 'Servicer ABC T2', transferDate: '01/02/2025', batchId: 'AA5B2A15-025D', status: 'Complete', loans: 251, documents: 3839, matched: 243, unmatched: 8, uploadDateTime: '01/02/2025 10:30 AM' },
  { id: 'rb2', transferName: 'Servicer DEF T1', transferDate: '01/15/2025', batchId: 'BB6C3B16-036E', status: 'In Progress', loans: 189, documents: 2754, matched: 170, unmatched: 19, uploadDateTime: '01/15/2025 02:15 PM' },
  { id: 'rb3', transferName: 'Servicer GHI Q4', transferDate: '12/20/2024', batchId: 'CC7D4C17-047F', status: 'Complete', loans: 312, documents: 4521, matched: 308, unmatched: 4, uploadDateTime: '12/20/2024 09:00 AM' },
  { id: 'rb4', transferName: 'Servicer JKL T3', transferDate: '02/01/2025', batchId: 'DD8E5D18-058G', status: 'Pending', loans: 0, documents: 0, matched: 0, unmatched: 0, uploadDateTime: '02/01/2025 11:45 AM' },
  { id: 'rb5', transferName: 'Servicer MNO T1', transferDate: '11/30/2024', batchId: 'EE9F6E19-069H', status: 'Complete', loans: 445, documents: 6723, matched: 440, unmatched: 5, uploadDateTime: '11/30/2024 03:30 PM' },
  { id: 'rb6', transferName: 'Servicer PQR Q3', transferDate: '10/15/2024', batchId: 'FF0G7F20-070I', status: 'Complete', loans: 178, documents: 2890, matched: 175, unmatched: 3, uploadDateTime: '10/15/2024 08:20 AM' },
  { id: 'rb7', transferName: 'Servicer STU T2', transferDate: '09/28/2024', batchId: 'GG1H8G21-081J', status: 'Complete', loans: 523, documents: 7845, matched: 510, unmatched: 13, uploadDateTime: '09/28/2024 01:00 PM' },
];

export const MOCK_RECON_LOANS: ReconLoan[] = [
  { id: 'rl1', loanNumber: '1039457892', unmatchedPct: 25, matchedPct: 75, invoicesCount: 12, ledgerEntries: 8 },
  { id: 'rl2', loanNumber: '1039457893', unmatchedPct: 0, matchedPct: 100, invoicesCount: 8, ledgerEntries: 6 },
  { id: 'rl3', loanNumber: '1039457894', unmatchedPct: 50, matchedPct: 50, invoicesCount: 15, ledgerEntries: 10 },
  { id: 'rl4', loanNumber: '1039457895', unmatchedPct: 0, matchedPct: 100, invoicesCount: 6, ledgerEntries: 4 },
  { id: 'rl5', loanNumber: '1039457896', unmatchedPct: 10, matchedPct: 90, invoicesCount: 20, ledgerEntries: 14 },
  { id: 'rl6', loanNumber: '1039457897', unmatchedPct: 0, matchedPct: 100, invoicesCount: 9, ledgerEntries: 7 },
  { id: 'rl7', loanNumber: '1039457898', unmatchedPct: 33, matchedPct: 67, invoicesCount: 11, ledgerEntries: 9 },
  { id: 'rl8', loanNumber: '1039457899', unmatchedPct: 0, matchedPct: 100, invoicesCount: 7, ledgerEntries: 5 },
  { id: 'rl9', loanNumber: '1039457900', unmatchedPct: 15, matchedPct: 85, invoicesCount: 18, ledgerEntries: 12 },
  { id: 'rl10', loanNumber: '1039457901', unmatchedPct: 0, matchedPct: 100, invoicesCount: 5, ledgerEntries: 3 },
];

export const MOCK_INVOICES: Invoice[] = [
  { id: 'inv1', invoiceDate: '01/15/2025', payeeName: 'ABC Property Services', amount: 1250.00, description: 'Property Inspection Fee', status: 'Matched' },
  { id: 'inv2', invoiceDate: '01/18/2025', payeeName: 'National Title Co.', amount: 875.50, description: 'Title Search Fee', status: 'Matched' },
  { id: 'inv3', invoiceDate: '01/20/2025', payeeName: 'Metro Appraisal Group', amount: 450.00, description: 'Appraisal Fee', status: 'Unmatched' },
  { id: 'inv4', invoiceDate: '01/22/2025', payeeName: 'Legal Associates LLC', amount: 2100.00, description: 'Attorney Fees', status: 'Matched' },
  { id: 'inv5', invoiceDate: '01/25/2025', payeeName: 'First Insurance Corp', amount: 680.75, description: 'Hazard Insurance', status: 'Partial' },
  { id: 'inv6', invoiceDate: '01/28/2025', payeeName: 'County Tax Office', amount: 3200.00, description: 'Property Tax Payment', status: 'Matched' },
  { id: 'inv7', invoiceDate: '02/01/2025', payeeName: 'ABC Property Services', amount: 950.00, description: 'Maintenance Fee', status: 'Unmatched' },
  { id: 'inv8', invoiceDate: '02/03/2025', payeeName: 'National Title Co.', amount: 1100.00, description: 'Recording Fee', status: 'Matched' },
];

export const MOCK_LEDGER_ENTRIES: LedgerEntry[] = [
  { id: 'le1', date: '01/15/2025', payee: 'ABC Property Services', expDescrip: 'Property Inspection Fee', amount: 1250.00, percentage: 100, action: 'Approved' },
  { id: 'le2', date: '01/18/2025', payee: 'National Title Co.', expDescrip: 'Title Search Fee', amount: 875.50, percentage: 100, action: 'Approved' },
  { id: 'le3', date: '01/20/2025', payee: 'Metro Appraisal Group', expDescrip: 'Appraisal Fee', amount: 450.00, percentage: 0, action: 'Pending' },
  { id: 'le4', date: '01/22/2025', payee: 'Legal Associates LLC', expDescrip: 'Attorney Fees', amount: 2100.00, percentage: 100, action: 'Approved' },
  { id: 'le5', date: '01/25/2025', payee: 'First Insurance Corp', expDescrip: 'Hazard Insurance', amount: 680.75, percentage: 50, action: 'Review' },
  { id: 'le6', date: '01/28/2025', payee: 'County Tax Office', expDescrip: 'Property Tax Payment', amount: 3200.00, percentage: 100, action: 'Approved' },
  { id: 'le7', date: '02/01/2025', payee: 'ABC Property Services', expDescrip: 'Maintenance Fee', amount: 950.00, percentage: 0, action: 'Pending' },
  { id: 'le8', date: '02/03/2025', payee: 'National Title Co.', expDescrip: 'Recording Fee', amount: 1100.00, percentage: 100, action: 'Approved' },
];

// ── V2 Recon Mock Data ──

export const MOCK_INVOICES_V2: InvoiceV2[] = [
  {
    id: 'inv1', invoiceNumber: 'INV-2025-0042', invoiceDate: '01/15/2025', payeeName: 'ABC Property Services',
    amount: 1250.00, description: 'Property Inspection Fee', status: 'Matched', loanNumber: '1039457892',
    extractions: [
      { fieldName: 'Date', extractedValue: '01/15/2025', confidence: 97 },
      { fieldName: 'Payee', extractedValue: 'ABC Property Services', confidence: 95 },
      { fieldName: 'Amount', extractedValue: '$1,250.00', confidence: 99 },
      { fieldName: 'Description', extractedValue: 'Property Inspection Fee', confidence: 92 },
      { fieldName: 'Invoice #', extractedValue: 'INV-2025-0042', confidence: 98 },
      { fieldName: 'Loan #', extractedValue: '1039457892', confidence: 88 },
    ],
    linkedLedgerEntryIds: ['le1'],
  },
  {
    id: 'inv2', invoiceNumber: 'INV-2025-0043', invoiceDate: '01/18/2025', payeeName: 'National Title Co.',
    amount: 875.50, description: 'Title Search Fee', status: 'Matched', loanNumber: '1039457892',
    extractions: [
      { fieldName: 'Date', extractedValue: '01/18/2025', confidence: 96 },
      { fieldName: 'Payee', extractedValue: 'National Title Co.', confidence: 94 },
      { fieldName: 'Amount', extractedValue: '$875.50', confidence: 99 },
      { fieldName: 'Description', extractedValue: 'Title Search Fee', confidence: 90 },
      { fieldName: 'Invoice #', extractedValue: 'INV-2025-0043', confidence: 97 },
      { fieldName: 'Loan #', extractedValue: '1039457892', confidence: 85 },
    ],
    linkedLedgerEntryIds: ['le2'],
  },
  {
    id: 'inv3', invoiceNumber: 'INV-2025-0044', invoiceDate: '01/20/2025', payeeName: 'Metro Appraisal Group',
    amount: 450.00, description: 'Appraisal Fee', status: 'Unmatched', loanNumber: '1039457892',
    extractions: [
      { fieldName: 'Date', extractedValue: '01/20/2025', confidence: 94 },
      { fieldName: 'Payee', extractedValue: 'Metro Appraisal Grp', confidence: 78 },
      { fieldName: 'Amount', extractedValue: '$450.00', confidence: 98 },
      { fieldName: 'Description', extractedValue: 'Appraisal Fee', confidence: 91 },
      { fieldName: 'Invoice #', extractedValue: 'INV-2025-0044', confidence: 96 },
      { fieldName: 'Loan #', extractedValue: '1039457892', confidence: 82 },
    ],
    linkedLedgerEntryIds: [],
  },
  {
    id: 'inv4', invoiceNumber: 'INV-2025-0045', invoiceDate: '01/22/2025', payeeName: 'Legal Associates LLC',
    amount: 2100.00, description: 'Attorney Fees', status: 'Matched', loanNumber: '1039457892',
    extractions: [
      { fieldName: 'Date', extractedValue: '01/22/2025', confidence: 97 },
      { fieldName: 'Payee', extractedValue: 'Legal Associates LLC', confidence: 96 },
      { fieldName: 'Amount', extractedValue: '$2,100.00', confidence: 99 },
      { fieldName: 'Description', extractedValue: 'Attorney Fees', confidence: 93 },
      { fieldName: 'Invoice #', extractedValue: 'INV-2025-0045', confidence: 98 },
      { fieldName: 'Loan #', extractedValue: '1039457892', confidence: 90 },
    ],
    linkedLedgerEntryIds: ['le4'],
  },
  {
    id: 'inv5', invoiceNumber: 'INV-2025-0046', invoiceDate: '01/25/2025', payeeName: 'First Insurance Corp',
    amount: 680.75, description: 'Hazard Insurance', status: 'Partial', loanNumber: '1039457892',
    extractions: [
      { fieldName: 'Date', extractedValue: '01/25/2025', confidence: 95 },
      { fieldName: 'Payee', extractedValue: 'First Insurance Corp', confidence: 89 },
      { fieldName: 'Amount', extractedValue: '$680.75', confidence: 97 },
      { fieldName: 'Description', extractedValue: 'Hazard Insurance Premium', confidence: 72 },
      { fieldName: 'Invoice #', extractedValue: 'INV-2025-0046', confidence: 94 },
      { fieldName: 'Loan #', extractedValue: '1039457892', confidence: 80 },
    ],
    linkedLedgerEntryIds: ['le5'],
  },
  {
    id: 'inv6', invoiceNumber: 'INV-2025-0047', invoiceDate: '01/28/2025', payeeName: 'County Tax Office',
    amount: 3200.00, description: 'Property Tax Payment', status: 'Matched', loanNumber: '1039457892',
    extractions: [
      { fieldName: 'Date', extractedValue: '01/28/2025', confidence: 98 },
      { fieldName: 'Payee', extractedValue: 'County Tax Office', confidence: 97 },
      { fieldName: 'Amount', extractedValue: '$3,200.00', confidence: 99 },
      { fieldName: 'Description', extractedValue: 'Property Tax Payment', confidence: 96 },
      { fieldName: 'Invoice #', extractedValue: 'INV-2025-0047', confidence: 97 },
      { fieldName: 'Loan #', extractedValue: '1039457892', confidence: 92 },
    ],
    linkedLedgerEntryIds: ['le6'],
  },
  {
    id: 'inv7', invoiceNumber: 'INV-2025-0048', invoiceDate: '02/01/2025', payeeName: 'ABC Property Services',
    amount: 950.00, description: 'Maintenance Fee', status: 'Unmatched', loanNumber: '1039457892',
    extractions: [
      { fieldName: 'Date', extractedValue: '02/01/2025', confidence: 93 },
      { fieldName: 'Payee', extractedValue: 'ABC Property Svcs', confidence: 71 },
      { fieldName: 'Amount', extractedValue: '$950.00', confidence: 98 },
      { fieldName: 'Description', extractedValue: 'Maintenance Fee', confidence: 88 },
      { fieldName: 'Invoice #', extractedValue: 'INV-2025-0048', confidence: 95 },
      { fieldName: 'Loan #', extractedValue: '1039457892', confidence: 79 },
    ],
    linkedLedgerEntryIds: [],
  },
  {
    id: 'inv8', invoiceNumber: 'INV-2025-0049', invoiceDate: '02/03/2025', payeeName: 'National Title Co.',
    amount: 1100.00, description: 'Recording Fee', status: 'Matched', loanNumber: '1039457892',
    extractions: [
      { fieldName: 'Date', extractedValue: '02/03/2025', confidence: 96 },
      { fieldName: 'Payee', extractedValue: 'National Title Co.', confidence: 95 },
      { fieldName: 'Amount', extractedValue: '$1,100.00', confidence: 99 },
      { fieldName: 'Description', extractedValue: 'Recording Fee', confidence: 94 },
      { fieldName: 'Invoice #', extractedValue: 'INV-2025-0049', confidence: 97 },
      { fieldName: 'Loan #', extractedValue: '1039457892', confidence: 91 },
    ],
    linkedLedgerEntryIds: ['le8'],
  },
];

export const MOCK_LEDGER_ENTRIES_V2: LedgerEntryV2[] = [
  {
    id: 'le1', date: '01/15/2025', payee: 'ABC Property Services', expDescrip: 'Property Inspection Fee',
    amount: 1250.00, percentage: 100, action: 'Approved',
    confidenceByInvoice: { inv1: 96, inv3: 12, inv7: 35 },
  },
  {
    id: 'le2', date: '01/18/2025', payee: 'National Title Co.', expDescrip: 'Title Search Fee',
    amount: 875.50, percentage: 100, action: 'Approved',
    confidenceByInvoice: { inv2: 95, inv8: 40, inv3: 8 },
  },
  {
    id: 'le3', date: '01/20/2025', payee: 'Metro Appraisal Group', expDescrip: 'Appraisal Fee',
    amount: 450.00, percentage: 0, action: 'Pending',
    confidenceByInvoice: { inv3: 92, inv7: 15, inv5: 10 },
  },
  {
    id: 'le4', date: '01/22/2025', payee: 'Legal Associates LLC', expDescrip: 'Attorney Fees',
    amount: 2100.00, percentage: 100, action: 'Approved',
    confidenceByInvoice: { inv4: 97, inv3: 5 },
  },
  {
    id: 'le5', date: '01/25/2025', payee: 'First Insurance Corp', expDescrip: 'Hazard Insurance',
    amount: 680.75, percentage: 50, action: 'Review',
    confidenceByInvoice: { inv5: 84, inv3: 10 },
  },
  {
    id: 'le6', date: '01/28/2025', payee: 'County Tax Office', expDescrip: 'Property Tax Payment',
    amount: 3200.00, percentage: 100, action: 'Approved',
    confidenceByInvoice: { inv6: 98, inv3: 3 },
  },
  {
    id: 'le7a', date: '02/01/2025', payee: 'ABC Property Services', expDescrip: 'Maintenance - Labor',
    amount: 550.00, percentage: 0, action: 'Pending',
    confidenceByInvoice: { inv7: 88, inv1: 30, inv3: 5 },
  },
  {
    id: 'le7b', date: '02/01/2025', payee: 'ABC Property Services', expDescrip: 'Maintenance - Materials',
    amount: 400.00, percentage: 0, action: 'Pending',
    confidenceByInvoice: { inv7: 82, inv1: 25, inv3: 5 },
  },
  {
    id: 'le8', date: '02/03/2025', payee: 'National Title Co.', expDescrip: 'Recording Fee',
    amount: 1100.00, percentage: 100, action: 'Approved',
    confidenceByInvoice: { inv8: 94, inv2: 38 },
  },
  {
    id: 'le9', date: '02/05/2025', payee: 'Misc Services Inc', expDescrip: 'Administrative Fee',
    amount: 125.00, percentage: 0, action: 'Pending',
    confidenceByInvoice: { inv3: 15, inv5: 12, inv7: 18 },
  },
];

// ── Supported Document Types (static list) ──

export const SUPPORTED_DOCUMENT_TYPES: string[] = [
  'Deed of Trust',
  'Promissory Note',
  'Assignment of Mortgage',
  'Title Insurance Policy',
  'Closing Disclosure',
  'Hazard Insurance Declaration',
  'Loan Modification Agreement',
  'Notice of Default',
  'Property Inspection Report',
  'BPO / Appraisal',
  'Mortgage Note',
  'Power of Attorney',
  'Subordination Agreement',
  'Escrow Analysis Statement',
  'Tax Certificate',
  'Flood Certificate',
  'HUD-1 Settlement Statement',
  'Good Faith Estimate',
  'Truth in Lending Disclosure',
  'Right to Cancel Notice',
  'Satisfaction of Mortgage',
  'Payoff Statement',
  'Loan Estimate',
  'Borrower Authorization',
];

// ── File Index Template Mock Data ──

export const MOCK_FILE_INDEX_TEMPLATES: FileIndexTemplate[] = [
  {
    id: 'fit1',
    name: 'Loan Onboarding QC',
    description: 'Quality control checklist for new loan onboarding packages',
    documentRules: [
      { id: 'dr1', documentTypeName: 'Deed of Trust', required: true, signatureRequired: true, stampRequired: true, recordedRequired: true },
      { id: 'dr2', documentTypeName: 'Promissory Note', required: true, signatureRequired: true, stampRequired: false, recordedRequired: false },
      { id: 'dr3', documentTypeName: 'Assignment of Mortgage', required: true, signatureRequired: true, stampRequired: true, recordedRequired: true },
      { id: 'dr4', documentTypeName: 'Title Insurance Policy', required: true, signatureRequired: false, stampRequired: false, recordedRequired: false },
      { id: 'dr5', documentTypeName: 'Closing Disclosure', required: true, signatureRequired: true, stampRequired: false, recordedRequired: false },
      { id: 'dr6', documentTypeName: 'Hazard Insurance Declaration', required: false, signatureRequired: false, stampRequired: false, recordedRequired: false },
    ],
    lastModified: '01/28/2025',
    createdDate: '11/15/2024',
    status: 'Active',
  },
  {
    id: 'fit2',
    name: 'Loan Transfer Package',
    description: 'Required documents for servicing transfer between servicers',
    documentRules: [
      { id: 'dr7', documentTypeName: 'Deed of Trust', required: true, signatureRequired: true, stampRequired: true, recordedRequired: true },
      { id: 'dr8', documentTypeName: 'Assignment of Mortgage', required: true, signatureRequired: true, stampRequired: true, recordedRequired: true },
      { id: 'dr9', documentTypeName: 'Promissory Note', required: true, signatureRequired: true, stampRequired: false, recordedRequired: false },
      { id: 'dr10', documentTypeName: 'Loan Modification Agreement', required: false, signatureRequired: true, stampRequired: false, recordedRequired: true },
    ],
    lastModified: '01/10/2025',
    createdDate: '12/01/2024',
    status: 'Active',
  },
  {
    id: 'fit3',
    name: 'Default Servicing Review',
    description: 'Document checklist for loans entering default servicing',
    documentRules: [
      { id: 'dr11', documentTypeName: 'Notice of Default', required: true, signatureRequired: true, stampRequired: false, recordedRequired: true },
      { id: 'dr12', documentTypeName: 'Property Inspection Report', required: true, signatureRequired: false, stampRequired: false, recordedRequired: false },
      { id: 'dr13', documentTypeName: 'BPO / Appraisal', required: true, signatureRequired: false, stampRequired: false, recordedRequired: false },
    ],
    lastModified: '02/05/2025',
    createdDate: '01/20/2025',
    status: 'Draft',
  },
];

// ── CSV Mapping Mock Data ──

export const CSV_TARGET_FIELDS: CsvTargetField[] = [
  'Date', 'Payee', 'Expense Description', 'Amount', 'Loan Number', 'Invoice ID', '-- Unmapped --',
];

export const MOCK_PARSED_CSV_HEADERS: string[] = [
  'Trans Date', 'Vendor Name', 'Description', 'Invoice Amt', 'Loan #', 'Inv ID', 'Status', 'Category', 'GL Code',
];

export const MOCK_CSV_ROWS: Record<string, string>[] = [
  { 'Trans Date': '01/15/2025', 'Vendor Name': 'ABC Property Services', 'Description': 'Property Inspection Fee', 'Invoice Amt': '1,250.00', 'Loan #': '1039457892', 'Inv ID': 'INV-2025-0042', 'Status': 'Paid', 'Category': 'Inspection', 'GL Code': '5210-01' },
  { 'Trans Date': '01/18/2025', 'Vendor Name': 'National Title Co.', 'Description': 'Title Search Fee', 'Invoice Amt': '875.50', 'Loan #': '1039457893', 'Inv ID': 'INV-2025-0043', 'Status': 'Paid', 'Category': 'Title', 'GL Code': '5220-03' },
  { 'Trans Date': '01/20/2025', 'Vendor Name': 'Metro Appraisal Group', 'Description': 'Appraisal Fee', 'Invoice Amt': '450.00', 'Loan #': '1039457894', 'Inv ID': 'INV-2025-0044', 'Status': 'Pending', 'Category': 'Appraisal', 'GL Code': '5230-02' },
  { 'Trans Date': '01/22/2025', 'Vendor Name': 'Legal Associates LLC', 'Description': 'Attorney Fees', 'Invoice Amt': '2,100.00', 'Loan #': '1039457895', 'Inv ID': 'INV-2025-0045', 'Status': 'Paid', 'Category': 'Legal', 'GL Code': '5240-01' },
  { 'Trans Date': '01/25/2025', 'Vendor Name': 'First Insurance Corp', 'Description': 'Hazard Insurance', 'Invoice Amt': '680.75', 'Loan #': '1039457896', 'Inv ID': 'INV-2025-0046', 'Status': 'Review', 'Category': 'Insurance', 'GL Code': '5250-04' },
  { 'Trans Date': '01/28/2025', 'Vendor Name': 'County Tax Office', 'Description': 'Property Tax Payment', 'Invoice Amt': '3,200.00', 'Loan #': '1039457897', 'Inv ID': 'INV-2025-0047', 'Status': 'Paid', 'Category': 'Tax', 'GL Code': '5260-01' },
  { 'Trans Date': '02/01/2025', 'Vendor Name': 'ABC Property Services', 'Description': 'Maintenance Fee', 'Invoice Amt': '950.00', 'Loan #': '1039457898', 'Inv ID': 'INV-2025-0048', 'Status': 'Pending', 'Category': 'Maintenance', 'GL Code': '5210-02' },
  { 'Trans Date': '02/03/2025', 'Vendor Name': 'National Title Co.', 'Description': 'Recording Fee', 'Invoice Amt': '1,100.00', 'Loan #': '1039457899', 'Inv ID': 'INV-2025-0049', 'Status': 'Paid', 'Category': 'Title', 'GL Code': '5220-01' },
];

export const MOCK_AUTO_MAPPINGS: CsvColumnMapping[] = [
  { csvHeader: 'Trans Date', mappedField: 'Date', confidence: 95 },
  { csvHeader: 'Vendor Name', mappedField: 'Payee', confidence: 91 },
  { csvHeader: 'Description', mappedField: 'Expense Description', confidence: 93 },
  { csvHeader: 'Invoice Amt', mappedField: 'Amount', confidence: 97 },
  { csvHeader: 'Loan #', mappedField: 'Loan Number', confidence: 94 },
  { csvHeader: 'Inv ID', mappedField: 'Invoice ID', confidence: 92 },
  { csvHeader: 'Status', mappedField: '-- Unmapped --', confidence: 0 },
  { csvHeader: 'Category', mappedField: '-- Unmapped --', confidence: 0 },
  { csvHeader: 'GL Code', mappedField: '-- Unmapped --', confidence: 0 },
];

export const MOCK_CSV_MAPPING_TEMPLATES: CsvMappingTemplate[] = [
  {
    id: 'cmt1',
    name: 'Carrington Standard Export',
    description: 'Default column mapping for Carrington servicer advance exports',
    mappings: [
      { csvHeader: 'Trans Date', mappedField: 'Date', confidence: 100 },
      { csvHeader: 'Vendor Name', mappedField: 'Payee', confidence: 100 },
      { csvHeader: 'Description', mappedField: 'Expense Description', confidence: 100 },
      { csvHeader: 'Invoice Amt', mappedField: 'Amount', confidence: 100 },
      { csvHeader: 'Loan #', mappedField: 'Loan Number', confidence: 100 },
      { csvHeader: 'Inv ID', mappedField: 'Invoice ID', confidence: 100 },
    ],
    lastModified: '01/20/2025',
  },
  {
    id: 'cmt2',
    name: 'Wellington Ledger Format',
    description: 'Column mapping for Wellington quarterly ledger CSV files',
    mappings: [
      { csvHeader: 'Trans Date', mappedField: 'Date', confidence: 100 },
      { csvHeader: 'Vendor Name', mappedField: 'Payee', confidence: 100 },
      { csvHeader: 'Description', mappedField: 'Expense Description', confidence: 100 },
      { csvHeader: 'Invoice Amt', mappedField: 'Amount', confidence: 100 },
      { csvHeader: 'Loan #', mappedField: 'Loan Number', confidence: 100 },
      { csvHeader: 'Inv ID', mappedField: 'Invoice ID', confidence: 100 },
    ],
    lastModified: '12/15/2024',
  },
];

// ── Doc Audit Mock Data ──

export const MOCK_DOC_AUDITS: DocAudit[] = [
  { id: 'da1', name: 'Carrington Q1 2025', uploadDate: '01/10/2025', totalLoans: 6, sotConfirmed: 5, matchRate: 82, exceptions: 4, status: 'In Review' },
  { id: 'da2', name: 'Wellington Transfer 2024', uploadDate: '12/01/2024', totalLoans: 48, sotConfirmed: 48, matchRate: 96, exceptions: 8, status: 'Complete' },
  { id: 'da3', name: 'Bourguignon Q4 2024', uploadDate: '01/20/2025', totalLoans: 32, sotConfirmed: 18, matchRate: 0, exceptions: 0, status: 'SOT Review' },
  { id: 'da4', name: 'Pacific West Onboarding', uploadDate: '02/05/2025', totalLoans: 15, sotConfirmed: 0, matchRate: 0, exceptions: 0, status: 'Uploaded' },
];

export const MOCK_DOC_AUDIT_LOANS: DocAuditLoan[] = [
  { id: 'dal1', auditId: 'da1', loanNumber: '2048119301', borrowerName: 'James Rodriguez', fieldsCompared: 10, matched: 8, mismatched: 1, missing: 0, lowConfidence: 1, status: 'Needs Review' },
  { id: 'dal2', auditId: 'da1', loanNumber: '2048119302', borrowerName: 'Sarah Williams', fieldsCompared: 10, matched: 10, mismatched: 0, missing: 0, lowConfidence: 0, status: 'Pass' },
  { id: 'dal3', auditId: 'da1', loanNumber: '2048119303', borrowerName: 'Chen Wei', fieldsCompared: 10, matched: 7, mismatched: 2, missing: 1, lowConfidence: 0, status: 'Needs Review' },
  { id: 'dal4', auditId: 'da1', loanNumber: '2048119304', borrowerName: 'Michael Johnson', fieldsCompared: 10, matched: 10, mismatched: 0, missing: 0, lowConfidence: 0, status: 'Pass' },
  { id: 'dal5', auditId: 'da1', loanNumber: '2048119305', borrowerName: 'Emily Davis', fieldsCompared: 10, matched: 0, mismatched: 0, missing: 10, lowConfidence: 0, status: 'Missing Docs' },
  { id: 'dal6', auditId: 'da1', loanNumber: '2048119306', borrowerName: 'Robert Anderson', fieldsCompared: 10, matched: 9, mismatched: 0, missing: 0, lowConfidence: 1, status: 'Needs Review' },
];

export const MOCK_DOCUMENT_VERSIONS: DocumentVersion[] = [
  // Promissory Note — 3 versions, v3 is SOT
  {
    id: 'dv1', loanId: 'dal1', documentType: 'Promissory Note', version: 1,
    uploadDate: '06/15/2022', documentDate: '06/01/2022', source: 'Original Lender',
    pyroConfidence: 91, isSot: false,
    extractions: [
      { fieldName: 'Borrower Name', extractedValue: 'James Rodriguez', confidence: 91 },
      { fieldName: 'Original Balance', extractedValue: '$425,000.00', confidence: 95 },
      { fieldName: 'Interest Rate', extractedValue: '3.75%', confidence: 97 },
      { fieldName: 'Maturity Date', extractedValue: '07/01/2052', confidence: 93 },
      { fieldName: 'Origination Date', extractedValue: '06/01/2022', confidence: 96 },
    ],
  },
  {
    id: 'dv2', loanId: 'dal1', documentType: 'Promissory Note', version: 2,
    uploadDate: '03/10/2023', documentDate: '03/01/2023', source: 'Loan Modification',
    pyroConfidence: 94, isSot: false,
    extractions: [
      { fieldName: 'Borrower Name', extractedValue: 'James Rodriguez', confidence: 93 },
      { fieldName: 'Original Balance', extractedValue: '$425,000.00', confidence: 96 },
      { fieldName: 'Interest Rate', extractedValue: '4.25%', confidence: 98 },
      { fieldName: 'Maturity Date', extractedValue: '07/01/2052', confidence: 94 },
      { fieldName: 'Origination Date', extractedValue: '06/01/2022', confidence: 97 },
    ],
  },
  {
    id: 'dv3', loanId: 'dal1', documentType: 'Promissory Note', version: 3,
    uploadDate: '11/20/2024', documentDate: '11/01/2024', source: 'Loan Modification',
    pyroConfidence: 97, isSot: true,
    extractions: [
      { fieldName: 'Borrower Name', extractedValue: 'James & Maria Rodriguez', confidence: 97 },
      { fieldName: 'Original Balance', extractedValue: '$425,000.00', confidence: 99 },
      { fieldName: 'Interest Rate', extractedValue: '5.125%', confidence: 98 },
      { fieldName: 'Maturity Date', extractedValue: '07/01/2052', confidence: 96 },
      { fieldName: 'Origination Date', extractedValue: '06/01/2022', confidence: 99 },
    ],
  },
  // Deed of Trust — 2 versions, v2 is SOT
  {
    id: 'dv4', loanId: 'dal1', documentType: 'Deed of Trust', version: 1,
    uploadDate: '06/15/2022', documentDate: '06/01/2022', source: 'Originator',
    pyroConfidence: 89, isSot: false,
    extractions: [
      { fieldName: 'Property Address', extractedValue: '1423 Elm Dr, Austin, TX 78701', confidence: 88 },
      { fieldName: 'Borrower Name', extractedValue: 'James Rodriguez', confidence: 90 },
      { fieldName: 'Loan Type', extractedValue: 'Conventional', confidence: 94 },
      { fieldName: 'Occupancy', extractedValue: 'Primary Residence', confidence: 92 },
    ],
  },
  {
    id: 'dv5', loanId: 'dal1', documentType: 'Deed of Trust', version: 2,
    uploadDate: '09/05/2023', documentDate: '08/20/2023', source: 'County Records',
    pyroConfidence: 96, isSot: true,
    extractions: [
      { fieldName: 'Property Address', extractedValue: '1423 Elm Drive, Austin, TX 78701', confidence: 97 },
      { fieldName: 'Borrower Name', extractedValue: 'James & Maria Rodriguez', confidence: 95 },
      { fieldName: 'Loan Type', extractedValue: 'Conventional', confidence: 98 },
      { fieldName: 'Occupancy', extractedValue: 'Primary Residence', confidence: 96 },
    ],
  },
  // Assignment of Mortgage — 1 version, is SOT
  {
    id: 'dv6', loanId: 'dal1', documentType: 'Assignment of Mortgage', version: 1,
    uploadDate: '01/05/2025', documentDate: '12/15/2024', source: 'Servicer Transfer',
    pyroConfidence: 93, isSot: true,
    extractions: [
      { fieldName: 'Current UPB', extractedValue: '$398,412.55', confidence: 85 },
      { fieldName: 'Borrower Name', extractedValue: 'James & Maria Rodriguez', confidence: 94 },
      { fieldName: 'Property Address', extractedValue: '1423 Elm Drive, Austin, TX 78701', confidence: 92 },
    ],
  },
];

export const MOCK_LOAN_TAPE_FIELDS: LoanTapeField[] = [
  { id: 'ltf1', loanId: 'dal1', fieldName: 'Loan Number', loanTapeValue: '2048119301', documentValue: '2048119301', sourceDocType: 'Promissory Note', sourceDocVersion: 3, confidence: 99, status: 'Match', action: 'Accepted' },
  { id: 'ltf2', loanId: 'dal1', fieldName: 'Borrower Name', loanTapeValue: 'James & Maria Rodriguez', documentValue: 'James & Maria Rodriguez', sourceDocType: 'Promissory Note', sourceDocVersion: 3, confidence: 97, status: 'Match', action: 'Accepted' },
  { id: 'ltf3', loanId: 'dal1', fieldName: 'Property Address', loanTapeValue: '1423 Elm Dr, Austin, TX 78701', documentValue: '1423 Elm Drive, Austin, TX 78701', sourceDocType: 'Deed of Trust', sourceDocVersion: 2, confidence: 88, status: 'Mismatch', action: 'Pending' },
  { id: 'ltf4', loanId: 'dal1', fieldName: 'Original Balance', loanTapeValue: '$425,000.00', documentValue: '$425,000.00', sourceDocType: 'Promissory Note', sourceDocVersion: 3, confidence: 99, status: 'Match', action: 'Accepted' },
  { id: 'ltf5', loanId: 'dal1', fieldName: 'Current UPB', loanTapeValue: '$401,233.18', documentValue: '$398,412.55', sourceDocType: 'Assignment of Mortgage', sourceDocVersion: 1, confidence: 72, status: 'Low Confidence', action: 'Pending' },
  { id: 'ltf6', loanId: 'dal1', fieldName: 'Interest Rate', loanTapeValue: '5.125%', documentValue: '5.125%', sourceDocType: 'Promissory Note', sourceDocVersion: 3, confidence: 98, status: 'Match', action: 'Accepted' },
  { id: 'ltf7', loanId: 'dal1', fieldName: 'Maturity Date', loanTapeValue: '07/01/2052', documentValue: '07/01/2052', sourceDocType: 'Promissory Note', sourceDocVersion: 3, confidence: 96, status: 'Match', action: 'Accepted' },
  { id: 'ltf8', loanId: 'dal1', fieldName: 'Origination Date', loanTapeValue: '06/01/2022', documentValue: '06/01/2022', sourceDocType: 'Promissory Note', sourceDocVersion: 3, confidence: 99, status: 'Match', action: 'Accepted' },
  { id: 'ltf9', loanId: 'dal1', fieldName: 'Loan Type', loanTapeValue: 'Conventional', documentValue: 'Conventional', sourceDocType: 'Deed of Trust', sourceDocVersion: 2, confidence: 98, status: 'Match', action: 'Accepted' },
  { id: 'ltf10', loanId: 'dal1', fieldName: 'Occupancy', loanTapeValue: 'Primary Residence', documentValue: 'Primary Residence', sourceDocType: 'Deed of Trust', sourceDocVersion: 2, confidence: 96, status: 'Match', action: 'Accepted' },
];

export const MOCK_FIELD_SOURCE_RULES: FieldSourceRule[] = [
  { loanTapeField: 'Loan Number', sourceDocType: 'Promissory Note', sourceExtractionField: 'Loan Number' },
  { loanTapeField: 'Borrower Name', sourceDocType: 'Promissory Note', sourceExtractionField: 'Borrower Name', fallbackDocType: 'Deed of Trust' },
  { loanTapeField: 'Property Address', sourceDocType: 'Deed of Trust', sourceExtractionField: 'Property Address' },
  { loanTapeField: 'Original Balance', sourceDocType: 'Promissory Note', sourceExtractionField: 'Original Balance' },
  { loanTapeField: 'Current UPB', sourceDocType: 'Assignment of Mortgage', sourceExtractionField: 'Current UPB', fallbackDocType: 'Promissory Note' },
  { loanTapeField: 'Interest Rate', sourceDocType: 'Promissory Note', sourceExtractionField: 'Interest Rate' },
  { loanTapeField: 'Maturity Date', sourceDocType: 'Promissory Note', sourceExtractionField: 'Maturity Date' },
  { loanTapeField: 'Origination Date', sourceDocType: 'Promissory Note', sourceExtractionField: 'Origination Date' },
  { loanTapeField: 'Loan Type', sourceDocType: 'Deed of Trust', sourceExtractionField: 'Loan Type' },
  { loanTapeField: 'Occupancy', sourceDocType: 'Deed of Trust', sourceExtractionField: 'Occupancy' },
];

// ── Doc Audit Upload Wizard Mock Data ──

export const DOC_AUDIT_TARGET_FIELDS: LoanTapeTargetField[] = [
  'Loan Number', 'Borrower Name', 'Property Address', 'Original Balance',
  'Current UPB', 'Interest Rate', 'Maturity Date', 'Origination Date',
  'Loan Type', 'Occupancy', '-- Unmapped --',
];

export const MOCK_DOC_AUDIT_CSV_HEADERS: string[] = [
  'Loan #', 'Borrower', 'Address', 'Orig Balance', 'Current Balance', 'Rate', 'Maturity', 'Orig Date', 'Type', 'Occupancy Status', 'Servicer', 'Pool ID',
];

export const MOCK_DOC_AUDIT_CSV_ROWS: Record<string, string>[] = [
  { 'Loan #': '2048119301', 'Borrower': 'James & Maria Rodriguez', 'Address': '1423 Elm Dr, Austin, TX 78701', 'Orig Balance': '425,000.00', 'Current Balance': '401,233.18', 'Rate': '5.125%', 'Maturity': '07/01/2052', 'Orig Date': '06/01/2022', 'Type': 'Conventional', 'Occupancy Status': 'Primary Residence', 'Servicer': 'Carrington', 'Pool ID': 'CRT-2025-Q1' },
  { 'Loan #': '2048119302', 'Borrower': 'Sarah Williams', 'Address': '892 Oak Ln, Dallas, TX 75201', 'Orig Balance': '310,000.00', 'Current Balance': '295,112.44', 'Rate': '4.875%', 'Maturity': '03/01/2053', 'Orig Date': '03/15/2023', 'Type': 'FHA', 'Occupancy Status': 'Primary Residence', 'Servicer': 'Carrington', 'Pool ID': 'CRT-2025-Q1' },
  { 'Loan #': '2048119303', 'Borrower': 'Chen Wei', 'Address': '567 Pine St, Houston, TX 77002', 'Orig Balance': '550,000.00', 'Current Balance': '532,890.67', 'Rate': '5.375%', 'Maturity': '11/01/2052', 'Orig Date': '11/20/2022', 'Type': 'Conventional', 'Occupancy Status': 'Investment', 'Servicer': 'Carrington', 'Pool ID': 'CRT-2025-Q1' },
  { 'Loan #': '2048119304', 'Borrower': 'Michael Johnson', 'Address': '234 Maple Ave, San Antonio, TX 78201', 'Orig Balance': '275,000.00', 'Current Balance': '261,445.90', 'Rate': '4.750%', 'Maturity': '06/01/2053', 'Orig Date': '06/10/2023', 'Type': 'VA', 'Occupancy Status': 'Primary Residence', 'Servicer': 'Carrington', 'Pool ID': 'CRT-2025-Q1' },
  { 'Loan #': '2048119305', 'Borrower': 'Emily Davis', 'Address': '789 Cedar Blvd, Fort Worth, TX 76102', 'Orig Balance': '380,000.00', 'Current Balance': '372,100.33', 'Rate': '5.000%', 'Maturity': '09/01/2054', 'Orig Date': '09/01/2024', 'Type': 'Conventional', 'Occupancy Status': 'Second Home', 'Servicer': 'Carrington', 'Pool ID': 'CRT-2025-Q1' },
  { 'Loan #': '2048119306', 'Borrower': 'Robert Anderson', 'Address': '456 Birch Rd, Austin, TX 78702', 'Orig Balance': '490,000.00', 'Current Balance': '478,223.15', 'Rate': '5.250%', 'Maturity': '01/01/2054', 'Orig Date': '01/15/2024', 'Type': 'Conventional', 'Occupancy Status': 'Primary Residence', 'Servicer': 'Carrington', 'Pool ID': 'CRT-2025-Q1' },
];

export const MOCK_DOC_AUDIT_AUTO_MAPPINGS: LoanTapeCsvColumnMapping[] = [
  { csvHeader: 'Loan #', mappedField: 'Loan Number', confidence: 96 },
  { csvHeader: 'Borrower', mappedField: 'Borrower Name', confidence: 93 },
  { csvHeader: 'Address', mappedField: 'Property Address', confidence: 94 },
  { csvHeader: 'Orig Balance', mappedField: 'Original Balance', confidence: 92 },
  { csvHeader: 'Current Balance', mappedField: 'Current UPB', confidence: 91 },
  { csvHeader: 'Rate', mappedField: 'Interest Rate', confidence: 95 },
  { csvHeader: 'Maturity', mappedField: 'Maturity Date', confidence: 94 },
  { csvHeader: 'Orig Date', mappedField: 'Origination Date', confidence: 90 },
  { csvHeader: 'Type', mappedField: 'Loan Type', confidence: 88 },
  { csvHeader: 'Occupancy Status', mappedField: 'Occupancy', confidence: 87 },
  { csvHeader: 'Servicer', mappedField: '-- Unmapped --', confidence: 0 },
  { csvHeader: 'Pool ID', mappedField: '-- Unmapped --', confidence: 0 },
];

export const MOCK_DOC_AUDIT_MAPPING_TEMPLATES: LoanTapeMappingTemplate[] = [
  {
    id: 'damt1',
    name: 'Carrington Loan Tape Standard',
    description: 'Default column mapping for Carrington servicer loan tape exports',
    mappings: [
      { csvHeader: 'Loan #', mappedField: 'Loan Number', confidence: 100 },
      { csvHeader: 'Borrower', mappedField: 'Borrower Name', confidence: 100 },
      { csvHeader: 'Address', mappedField: 'Property Address', confidence: 100 },
      { csvHeader: 'Orig Balance', mappedField: 'Original Balance', confidence: 100 },
      { csvHeader: 'Current Balance', mappedField: 'Current UPB', confidence: 100 },
      { csvHeader: 'Rate', mappedField: 'Interest Rate', confidence: 100 },
      { csvHeader: 'Maturity', mappedField: 'Maturity Date', confidence: 100 },
      { csvHeader: 'Orig Date', mappedField: 'Origination Date', confidence: 100 },
      { csvHeader: 'Type', mappedField: 'Loan Type', confidence: 100 },
      { csvHeader: 'Occupancy Status', mappedField: 'Occupancy', confidence: 100 },
    ],
    lastModified: '01/25/2025',
  },
  {
    id: 'damt2',
    name: 'Wellington Transfer Format',
    description: 'Column mapping for Wellington loan tape CSV files',
    mappings: [
      { csvHeader: 'Loan #', mappedField: 'Loan Number', confidence: 100 },
      { csvHeader: 'Borrower', mappedField: 'Borrower Name', confidence: 100 },
      { csvHeader: 'Address', mappedField: 'Property Address', confidence: 100 },
      { csvHeader: 'Orig Balance', mappedField: 'Original Balance', confidence: 100 },
      { csvHeader: 'Current Balance', mappedField: 'Current UPB', confidence: 100 },
      { csvHeader: 'Rate', mappedField: 'Interest Rate', confidence: 100 },
      { csvHeader: 'Maturity', mappedField: 'Maturity Date', confidence: 100 },
      { csvHeader: 'Orig Date', mappedField: 'Origination Date', confidence: 100 },
      { csvHeader: 'Type', mappedField: 'Loan Type', confidence: 100 },
      { csvHeader: 'Occupancy Status', mappedField: 'Occupancy', confidence: 100 },
    ],
    lastModified: '12/20/2024',
  },
];

export const MOCK_EXISTING_DOC_BATCHES: ExistingDocBatch[] = [
  { id: 'eb1', name: 'Carrington Transfer 2025', uploadDate: '06/05/2025', totalFiles: 645, totalDocuments: 1250, loanCount: 48, status: 'Complete' },
  { id: 'eb2', name: 'Wellington Final Loan Package', uploadDate: '12/10/2024', totalFiles: 200, totalDocuments: 245, loanCount: 32, status: 'Complete' },
  { id: 'eb3', name: 'Bourguignon Transfer Package 2024', uploadDate: '11/15/2024', totalFiles: 645, totalDocuments: 512, loanCount: 64, status: 'Complete' },
  { id: 'eb4', name: 'Pacific West Onboarding Q1', uploadDate: '02/01/2025', totalFiles: 120, totalDocuments: 310, loanCount: 15, status: 'In progress' },
];
