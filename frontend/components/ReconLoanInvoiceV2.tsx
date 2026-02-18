import React, { useState, useMemo } from 'react';
import { ArrowLeft, CheckCircle, X, AlertTriangle, XCircle, ZoomIn, ZoomOut, Copy, ExternalLink, MousePointer, Edit3, Tag, ChevronRight, Check, FileText } from 'lucide-react';
import { MOCK_RECON_LOANS, MOCK_INVOICES_V2, MOCK_LEDGER_ENTRIES_V2 } from '../constants';
import { InvoiceV2 } from '../types';

interface ReconLoanInvoiceV2Props {
  selectedLoanId: string | null;
  onBack: () => void;
}

type DetailTab = 'extractions' | 'matchDetails';

const getConfidenceColor = (confidence: number): string => {
  if (confidence >= 90) return 'bg-[#e6f4ea] text-[#1e8e3e]';
  if (confidence >= 70) return 'bg-[#e3f2fd] text-[#0077c8]';
  if (confidence > 0) return 'bg-[#fff8e1] text-[#f9a825]';
  return 'bg-slate-100 text-slate-400';
};

const getStatusColor = (status: string): string => {
  if (status === 'Matched') return 'bg-[#e6f4ea] text-[#1e8e3e]';
  if (status === 'Unmatched') return 'bg-[#fff8e1] text-[#f9a825]';
  return 'bg-[#e3f2fd] text-[#0077c8]';
};

const fmtCurrency = (n: number) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2 });

export const ReconLoanInvoiceV2: React.FC<ReconLoanInvoiceV2Props> = ({ selectedLoanId, onBack }) => {
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [selectedLedgerIds, setSelectedLedgerIds] = useState<Set<string>>(new Set());
  const [detailTab, setDetailTab] = useState<DetailTab>('extractions');
  const [invoices, setInvoices] = useState<InvoiceV2[]>(MOCK_INVOICES_V2);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showDocDrawer, setShowDocDrawer] = useState(false);
  const [zoom, setZoom] = useState(100);

  const loan = MOCK_RECON_LOANS.find(l => l.id === selectedLoanId) || MOCK_RECON_LOANS[0];

  const sortedInvoices = useMemo(() => {
    const order: Record<string, number> = { Unmatched: 0, Partial: 1, Matched: 2 };
    return [...invoices].sort((a, b) => order[a.status] - order[b.status]);
  }, [invoices]);

  const selectedInvoice = invoices.find(inv => inv.id === selectedInvoiceId) || null;
  const unmatchedCount = invoices.filter(inv => inv.status !== 'Matched').length;
  const matchedCount = invoices.filter(inv => inv.status === 'Matched').length;

  const sortedLedgerEntries = useMemo(() => {
    if (!selectedInvoiceId) return [];
    return [...MOCK_LEDGER_ENTRIES_V2].sort((a, b) => {
      const confA = a.confidenceByInvoice[selectedInvoiceId] ?? 0;
      const confB = b.confidenceByInvoice[selectedInvoiceId] ?? 0;
      return confB - confA;
    });
  }, [selectedInvoiceId]);

  const selectedTotal = useMemo(() => {
    return MOCK_LEDGER_ENTRIES_V2
      .filter(le => selectedLedgerIds.has(le.id))
      .reduce((sum, le) => sum + le.amount, 0);
  }, [selectedLedgerIds]);

  const matchQuality = useMemo<'exact' | 'close' | 'far' | null>(() => {
    if (!selectedInvoice || selectedLedgerIds.size === 0) return null;
    const invoiceAmt = selectedInvoice.amount;
    if (Math.abs(selectedTotal - invoiceAmt) < 0.01) return 'exact';
    if (Math.abs(selectedTotal - invoiceAmt) / invoiceAmt <= 0.05) return 'close';
    return 'far';
  }, [selectedInvoice, selectedTotal, selectedLedgerIds]);

  const handleSelectInvoice = (invoiceId: string) => {
    setSelectedInvoiceId(invoiceId);
    setSelectedLedgerIds(new Set());
  };

  const handleToggleLedger = (ledgerId: string) => {
    setSelectedLedgerIds(prev => {
      const next = new Set(prev);
      if (next.has(ledgerId)) next.delete(ledgerId);
      else next.add(ledgerId);
      return next;
    });
  };

  const handleReviewNext = () => {
    const nextUnmatched = sortedInvoices.find(inv => inv.status === 'Unmatched' && inv.id !== selectedInvoiceId);
    if (nextUnmatched) {
      handleSelectInvoice(nextUnmatched.id);
    } else {
      const nextPartial = sortedInvoices.find(inv => inv.status === 'Partial' && inv.id !== selectedInvoiceId);
      if (nextPartial) handleSelectInvoice(nextPartial.id);
      else { setSelectedInvoiceId(null); setSelectedLedgerIds(new Set()); }
    }
  };

  const handleConfirmMatch = () => {
    if (!selectedInvoiceId || selectedLedgerIds.size === 0) return;
    setInvoices(prev => prev.map(inv => {
      if (inv.id !== selectedInvoiceId) return inv;
      return {
        ...inv,
        status: matchQuality === 'exact' ? 'Matched' as const : 'Partial' as const,
        linkedLedgerEntryIds: [...inv.linkedLedgerEntryIds, ...Array.from(selectedLedgerIds)],
      };
    }));
    setToastMessage(`Match confirmed for ${selectedInvoice?.payeeName}`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    handleReviewNext();
  };

  const handleApproveAll = () => {
    setToastMessage('All reconciliation matches approved');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const selectedAmountBreakdown = MOCK_LEDGER_ENTRIES_V2
    .filter(le => selectedLedgerIds.has(le.id))
    .map(le => fmtCurrency(le.amount))
    .join(' + ');

  const progressPct = invoices.length > 0 ? Math.round((matchedCount / invoices.length) * 100) : 0;

  return (
    <div className="flex flex-col h-full bg-[#f4f7fa] relative">
      {/* Toast */}
      <div aria-live="assertive" className="absolute top-4 right-4 z-50">
        {showToast && (
          <div role="alert" className="bg-[#1e8e3e] text-white px-4 py-3 rounded shadow-lg flex items-center space-x-3 animate-fade-in">
            <CheckCircle size={18} aria-hidden="true" />
            <span className="text-sm font-medium">{toastMessage}</span>
            <button onClick={() => setShowToast(false)} aria-label="Dismiss notification" className="ml-2 hover:opacity-80">
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 lg:px-6 pt-5 pb-4">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center text-xs text-slate-500 mb-2 font-medium list-none p-0">
            <li><span className="text-[#0077c8]">Advanced Recon</span></li>
            <li aria-hidden="true" className="mx-2">/</li>
            <li><button className="text-[#0077c8] cursor-pointer hover:underline" onClick={onBack}>Batch Detail</button></li>
            <li aria-hidden="true" className="mx-2">/</li>
            <li aria-current="page">Loan Invoice V2</li>
          </ol>
        </nav>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={onBack} aria-label="Back to batch detail" className="mr-3 text-slate-400 hover:text-slate-600">
              <ArrowLeft size={18} aria-hidden="true" />
            </button>
            <h1 className="text-xl font-bold text-slate-800">Loan {loan.loanNumber}</h1>
          </div>
          <button
            onClick={handleApproveAll}
            className="bg-[#1e8e3e] hover:bg-[#157a2e] text-white px-5 py-2 rounded text-xs font-bold shadow-sm"
          >
            Approve All Matches
          </button>
        </div>

        {/* Loan info bar with progress */}
        <div className="mt-4 bg-slate-50 border border-slate-200 rounded p-3 flex items-center space-x-8 text-xs">
          <div>
            <span className="text-slate-500 font-medium">Loan #: </span>
            <span className="text-slate-700 font-bold">{loan.loanNumber}</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Invoices: </span>
            <span className="text-slate-700 font-bold">{invoices.length}</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Advances: </span>
            <span className="text-slate-700 font-bold">{MOCK_LEDGER_ENTRIES_V2.length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-slate-500 font-medium">{matchedCount} of {invoices.length} matched</span>
            <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div style={{ width: `${progressPct}%` }} className="h-2 bg-[#1e8e3e] rounded-full transition-all" />
            </div>
          </div>
          {unmatchedCount > 0 && (
            <div>
              <span className="text-[#f9a825] font-bold">{unmatchedCount} need review</span>
            </div>
          )}
        </div>
      </header>

      {/* 2-Panel Content */}
      <div className="flex-1 flex overflow-hidden p-3 lg:p-4 space-x-3 lg:space-x-4">

        {/* Left Panel - Invoices */}
        <div className="w-72 flex-shrink-0 bg-white rounded shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-700">Invoices</h3>
            {unmatchedCount > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#fff8e1] text-[#f9a825]">
                {unmatchedCount} of {invoices.length} need review
              </span>
            )}
          </div>
          {unmatchedCount > 0 && (
            <div className="px-4 py-2 border-b border-slate-100">
              <button
                onClick={handleReviewNext}
                className="w-full flex items-center justify-center space-x-1.5 bg-[#0077c8] hover:bg-[#0066b0] text-white px-3 py-1.5 rounded text-xs font-bold shadow-sm"
              >
                <span>Review Next</span>
                <ChevronRight size={14} aria-hidden="true" />
              </button>
            </div>
          )}
          <div className="flex-1 overflow-y-auto">
            {sortedInvoices.map(invoice => (
              <button
                key={invoice.id}
                onClick={() => handleSelectInvoice(invoice.id)}
                className={`w-full px-4 py-3 flex items-center text-left border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                  selectedInvoiceId === invoice.id
                    ? 'border-l-4 border-l-[#0077c8] bg-[#f0f7ff]'
                    : 'border-l-4 border-l-transparent'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-slate-700 truncate">{invoice.payeeName}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{invoice.invoiceDate} &middot; {invoice.invoiceNumber}</div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <div className="text-xs font-bold text-slate-700">{fmtCurrency(invoice.amount)}</div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getStatusColor(invoice.status)}`}>
                    {invoice.status}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Panel - Candidates + Detail */}
        <div className="flex-1 flex flex-col overflow-hidden space-y-3 lg:space-y-4">

          {/* Top: Advance Candidates Table */}
          <div className="flex-1 bg-white rounded shadow-sm border border-slate-200 flex flex-col overflow-hidden min-h-0">
            <div className="px-4 py-3 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-700">
                Advance Candidates {selectedInvoice ? `(${sortedLedgerEntries.length})` : ''}
              </h3>
              <div className="flex items-center space-x-3">
                {selectedInvoice && (
                  <span className="text-[10px] text-slate-400">
                    Sorted by AI confidence for <span className="font-medium text-slate-500">{selectedInvoice.payeeName}</span>
                  </span>
                )}
                {selectedInvoice && (
                  <button
                    onClick={() => setShowDocDrawer(true)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                  >
                    <FileText size={13} aria-hidden="true" />
                    <span>View Document</span>
                  </button>
                )}
              </div>
            </div>

            {!selectedInvoice ? (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
                <div className="text-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <ArrowLeft size={20} className="text-slate-300" aria-hidden="true" />
                  </div>
                  <p>Select an invoice to see matching candidates</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#f8fafc] text-slate-500 font-semibold border-b border-slate-200 sticky top-0 z-10">
                      <tr>
                        <th scope="col" className="px-3 py-2.5 w-8"><span className="sr-only">Select</span></th>
                        <th scope="col" className="px-3 py-2.5">Date</th>
                        <th scope="col" className="px-3 py-2.5">Payee</th>
                        <th scope="col" className="px-3 py-2.5">Description</th>
                        <th scope="col" className="px-3 py-2.5 text-right">Amount</th>
                        <th scope="col" className="px-3 py-2.5 text-center">Confidence</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sortedLedgerEntries.map(entry => {
                        const confidence = entry.confidenceByInvoice[selectedInvoiceId!] ?? 0;
                        const isChecked = selectedLedgerIds.has(entry.id);
                        return (
                          <tr
                            key={entry.id}
                            onClick={() => handleToggleLedger(entry.id)}
                            className={`hover:bg-slate-50 transition-colors cursor-pointer ${isChecked ? 'bg-[#f0f7ff]' : ''}`}
                          >
                            <td className="px-3 py-2.5">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleToggleLedger(entry.id)}
                                onClick={e => e.stopPropagation()}
                                className="w-3.5 h-3.5 rounded border-slate-300 text-[#0077c8] focus:ring-[#0077c8]"
                                aria-label={`Select ${entry.payee} ${fmtCurrency(entry.amount)}`}
                              />
                            </td>
                            <td className="px-3 py-2.5 text-slate-600 font-medium whitespace-nowrap">{entry.date}</td>
                            <td className="px-3 py-2.5 text-slate-700 font-medium">{entry.payee}</td>
                            <td className="px-3 py-2.5 text-slate-600">{entry.expDescrip}</td>
                            <td className="px-3 py-2.5 text-slate-700 font-medium text-right whitespace-nowrap">{fmtCurrency(entry.amount)}</td>
                            <td className="px-3 py-2.5 text-center">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${getConfidenceColor(confidence)}`}>
                                {confidence}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Running Total Bar */}
                <div className="px-4 py-3 border-t border-slate-200 bg-slate-50">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-slate-600 min-w-0">
                      {selectedLedgerIds.size > 0 ? (
                        <span>Selected: <span className="font-bold text-slate-700">{selectedAmountBreakdown} = {fmtCurrency(selectedTotal)}</span></span>
                      ) : (
                        <span className="text-slate-400">No advances selected</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 flex-shrink-0">
                      <div className="text-xs flex items-center space-x-1">
                        <span className="text-slate-500">Invoice:</span>
                        <span className="font-bold text-slate-700">{fmtCurrency(selectedInvoice.amount)}</span>
                        {matchQuality === 'exact' && <CheckCircle size={14} className="text-[#1e8e3e]" aria-label="Exact match" />}
                        {matchQuality === 'close' && <AlertTriangle size={14} className="text-[#f9a825]" aria-label="Close match" />}
                        {matchQuality === 'far' && <XCircle size={14} className="text-red-500" aria-label="Amount mismatch" />}
                      </div>
                      <button
                        onClick={handleConfirmMatch}
                        disabled={selectedLedgerIds.size === 0}
                        className={`px-4 py-2 rounded text-xs font-bold shadow-sm transition-colors ${
                          selectedLedgerIds.size > 0
                            ? 'bg-[#0077c8] hover:bg-[#0066b0] text-white'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        Confirm Match
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Bottom: Extractions & Match Details */}
          {selectedInvoice && (
            <div className="h-56 flex-shrink-0 bg-white rounded shadow-sm border border-slate-200 flex flex-col overflow-hidden">
              {/* Tab bar */}
              <div className="flex border-b border-slate-200 bg-slate-50/50" role="tablist" aria-label="Invoice detail tabs">
                {([
                  { key: 'extractions' as DetailTab, label: 'Extracted Fields' },
                  { key: 'matchDetails' as DetailTab, label: 'Match Details' },
                ]).map(tab => (
                  <button
                    key={tab.key}
                    role="tab"
                    aria-selected={detailTab === tab.key}
                    onClick={() => setDetailTab(tab.key)}
                    className={`px-5 py-2 text-[11px] font-medium border-b-2 transition-colors ${
                      detailTab === tab.key
                        ? 'border-[#0077c8] text-[#0077c8] font-bold'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {tab.label}
                    {tab.key === 'matchDetails' && selectedLedgerIds.size > 0 && (
                      <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-[#0077c8] text-white text-[9px] font-bold">
                        {selectedLedgerIds.size}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="flex-1 overflow-auto">
                {detailTab === 'extractions' && (
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th scope="col" className="text-left py-2 px-4 text-slate-500 font-semibold">Field</th>
                        <th scope="col" className="text-left py-2 px-4 text-slate-500 font-semibold">Extracted Value</th>
                        <th scope="col" className="text-center py-2 px-4 text-slate-500 font-semibold">Confidence</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedInvoice.extractions.map(field => (
                        <tr key={field.fieldName} className="hover:bg-slate-50">
                          <td className="py-2 px-4 text-slate-500 font-medium">{field.fieldName}</td>
                          <td className="py-2 px-4 text-slate-700 font-medium">{field.extractedValue}</td>
                          <td className="py-2 px-4 text-center">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${getConfidenceColor(field.confidence)}`}>
                              {field.confidence}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {detailTab === 'matchDetails' && (
                  <>
                    {selectedLedgerIds.size === 0 ? (
                      <div className="flex items-center justify-center text-slate-400 text-xs p-6 h-full">
                        Check rows in the Advance Candidates table to compare fields
                      </div>
                    ) : (
                      <div className="p-3 space-y-3">
                        {Array.from(selectedLedgerIds).map(ledgerId => {
                          const entry = MOCK_LEDGER_ENTRIES_V2.find(le => le.id === ledgerId);
                          if (!entry) return null;
                          const confidence = entry.confidenceByInvoice[selectedInvoiceId!] ?? 0;
                          const dateMatch = selectedInvoice.invoiceDate === entry.date;
                          const payeeMatch = selectedInvoice.payeeName.toLowerCase().includes(entry.payee.toLowerCase().substring(0, 8));
                          const amountMatch = Math.abs(selectedInvoice.amount - entry.amount) < 0.01;
                          const descMatch = selectedInvoice.description.toLowerCase().includes(entry.expDescrip.toLowerCase().substring(0, 8));
                          return (
                            <div key={ledgerId} className="border border-slate-200 rounded overflow-hidden">
                              <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-700">{entry.payee} &mdash; {fmtCurrency(entry.amount)}</span>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${getConfidenceColor(confidence)}`}>
                                  {confidence}%
                                </span>
                              </div>
                              <div className="grid grid-cols-4 text-[10px]">
                                {[
                                  { field: 'Date', invoice: selectedInvoice.invoiceDate, ledger: entry.date, match: dateMatch },
                                  { field: 'Payee', invoice: selectedInvoice.payeeName, ledger: entry.payee, match: payeeMatch },
                                  { field: 'Amount', invoice: fmtCurrency(selectedInvoice.amount), ledger: fmtCurrency(entry.amount), match: amountMatch },
                                  { field: 'Description', invoice: selectedInvoice.description, ledger: entry.expDescrip, match: descMatch },
                                ].map(row => (
                                  <div key={row.field} className="px-3 py-1.5 border-r border-slate-100 last:border-r-0">
                                    <div className="font-bold text-slate-400 mb-0.5">{row.field}</div>
                                    <div className="text-slate-700 truncate" title={row.invoice}>{row.invoice}</div>
                                    <div className={`truncate flex items-center space-x-1 ${row.match ? 'text-[#1e8e3e]' : 'text-[#f9a825]'}`}>
                                      <span title={row.ledger}>{row.ledger}</span>
                                      {row.match ? (
                                        <Check size={10} className="flex-shrink-0" aria-label="Match" />
                                      ) : (
                                        <AlertTriangle size={10} className="flex-shrink-0" aria-label="Mismatch" />
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Document Viewer Slide-Over Drawer */}
      {showDocDrawer && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 z-40 transition-opacity"
            onClick={() => setShowDocDrawer(false)}
            aria-hidden="true"
          />
          {/* Drawer */}
          <div
            className="fixed top-0 right-0 h-full w-[480px] bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200"
            role="dialog"
            aria-label="Invoice document viewer"
          >
            {/* Drawer header */}
            <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-slate-700 truncate">
                  {selectedInvoice ? selectedInvoice.payeeName : 'Invoice Document'}
                </h3>
                {selectedInvoice && (
                  <p className="text-[10px] text-slate-400 mt-0.5">{selectedInvoice.invoiceNumber} &middot; {fmtCurrency(selectedInvoice.amount)}</p>
                )}
              </div>
              <button
                onClick={() => setShowDocDrawer(false)}
                aria-label="Close document viewer"
                className="p-1.5 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 bg-white" role="toolbar" aria-label="Document tools">
              <div className="flex items-center space-x-2">
                <button aria-label="Select" className="p-1 hover:bg-slate-100 rounded text-slate-500"><MousePointer size={14} aria-hidden="true" /></button>
                <button aria-label="Annotate" className="p-1 hover:bg-slate-100 rounded text-slate-500"><Edit3 size={14} aria-hidden="true" /></button>
                <button aria-label="Show tags" className="p-1 hover:bg-slate-100 rounded text-slate-500"><Tag size={14} aria-hidden="true" /></button>
                <div className="w-px h-4 bg-slate-200 mx-1" aria-hidden="true"></div>
                <button onClick={() => setZoom(Math.max(25, zoom - 25))} aria-label="Zoom out" className="p-1 hover:bg-slate-100 rounded text-slate-500"><ZoomOut size={14} aria-hidden="true" /></button>
                <span className="text-[10px] text-slate-500 font-medium min-w-[35px] text-center" aria-live="polite">{zoom}%</span>
                <button onClick={() => setZoom(Math.min(200, zoom + 25))} aria-label="Zoom in" className="p-1 hover:bg-slate-100 rounded text-slate-500"><ZoomIn size={14} aria-hidden="true" /></button>
              </div>
              <div className="flex items-center space-x-1">
                <button aria-label="Copy" className="p-1 hover:bg-slate-100 rounded text-slate-500"><Copy size={14} aria-hidden="true" /></button>
                <button aria-label="Open in new tab" className="p-1 hover:bg-slate-100 rounded text-slate-500"><ExternalLink size={14} aria-hidden="true" /></button>
              </div>
            </div>

            {/* Document preview + page thumbnails */}
            <div className="flex-1 flex overflow-hidden">
              <div className="flex-1 p-4 overflow-auto bg-slate-100">
                <div className="bg-white border border-slate-200 rounded shadow-sm min-h-full flex items-center justify-center">
                  <div className="text-center text-slate-400">
                    <div className="w-20 h-24 bg-slate-100 rounded mx-auto mb-3 flex items-center justify-center border border-slate-200">
                      <span className="text-xs text-slate-400 font-medium">PDF</span>
                    </div>
                    <p className="text-sm font-medium">Invoice Document Preview</p>
                    {selectedInvoice && (
                      <>
                        <p className="text-xs mt-2 font-medium text-slate-500">{selectedInvoice.payeeName}</p>
                        <p className="text-xs text-slate-400">{selectedInvoice.invoiceNumber}</p>
                        <p className="text-xs text-slate-400">{fmtCurrency(selectedInvoice.amount)}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              {/* Page Thumbnails */}
              <div className="w-16 bg-slate-50 border-l border-slate-200 p-2 flex flex-col items-center space-y-2 overflow-y-auto">
                <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider mb-1">Pages</span>
                <button aria-label="Page 1" aria-current="page" className="w-10 h-14 bg-white border-2 border-[#0077c8] rounded shadow-sm flex items-center justify-center">
                  <span className="text-[8px] text-slate-400">1</span>
                </button>
                <button aria-label="Page 2" className="w-10 h-14 bg-white border border-slate-200 rounded shadow-sm flex items-center justify-center hover:border-[#0077c8]">
                  <span className="text-[8px] text-slate-400">2</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
