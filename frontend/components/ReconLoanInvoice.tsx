import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronRight, ZoomIn, ZoomOut, Copy, ExternalLink, MousePointer, Edit3, Tag, CheckCircle, X } from 'lucide-react';
import { MOCK_RECON_LOANS, MOCK_INVOICES, MOCK_LEDGER_ENTRIES } from '../constants';

interface ReconLoanInvoiceProps {
  selectedLoanId: string | null;
  onBack: () => void;
}

type DocTab = 'Note' | 'Version 3' | '1 Pages' | '6 Extractions';

export const ReconLoanInvoice: React.FC<ReconLoanInvoiceProps> = ({ selectedLoanId, onBack }) => {
  const [expandedInvoice, setExpandedInvoice] = useState<string | null>(MOCK_INVOICES[0]?.id || null);
  const [activeDocTab, setActiveDocTab] = useState<DocTab>('Note');
  const [showToast, setShowToast] = useState(false);
  const [zoom, setZoom] = useState(100);

  const loan = MOCK_RECON_LOANS.find(l => l.id === selectedLoanId) || MOCK_RECON_LOANS[0];

  const handleApprove = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="flex flex-col h-full bg-[#f4f7fa] relative">
      {/* Toast - persistent live region */}
      <div aria-live="assertive" className="absolute top-4 right-4 z-50">
        {showToast && (
          <div role="alert" className="bg-[#1e8e3e] text-white px-4 py-3 rounded shadow-lg flex items-center space-x-3 animate-fade-in">
            <CheckCircle size={18} aria-hidden="true" />
            <span className="text-sm font-medium">Reconciliation approved successfully</span>
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
            <li aria-current="page">Loan Invoice</li>
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
            onClick={handleApprove}
            className="bg-[#1e8e3e] hover:bg-[#157a2e] text-white px-5 py-2 rounded text-xs font-bold shadow-sm"
          >
            Approve Reconciliation
          </button>
        </div>

        {/* Loan Information Bar */}
        <div className="mt-4 bg-slate-50 border border-slate-200 rounded p-3 flex items-center space-x-8 text-xs">
          <div>
            <span className="text-slate-500 font-medium">Loan #: </span>
            <span className="text-slate-700 font-bold">{loan.loanNumber}</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Invoices: </span>
            <span className="text-slate-700 font-bold">{loan.invoicesCount}</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Ledger Entries: </span>
            <span className="text-slate-700 font-bold">{loan.ledgerEntries}</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Matched: </span>
            <span className="text-[#1e8e3e] font-bold">{loan.matchedPct}%</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Unmatched: </span>
            <span className={`font-bold ${loan.unmatchedPct > 0 ? 'text-[#f9a825]' : 'text-slate-700'}`}>{loan.unmatchedPct}%</span>
          </div>
        </div>
      </header>

      {/* 3-Panel Content */}
      <div className="flex-1 flex overflow-hidden p-3 lg:p-4 space-x-3 lg:space-x-4">
        {/* Left Panel - Invoices */}
        <div className="w-80 flex-shrink-0 bg-white rounded shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-700">Invoices ({MOCK_INVOICES.length})</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {MOCK_INVOICES.map((invoice) => (
              <div key={invoice.id} className="border-b border-slate-100">
                <button
                  onClick={() => setExpandedInvoice(expandedInvoice === invoice.id ? null : invoice.id)}
                  aria-expanded={expandedInvoice === invoice.id}
                  aria-controls={`invoice-detail-${invoice.id}`}
                  className={`w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-50 transition-colors ${expandedInvoice === invoice.id ? 'bg-slate-50' : ''}`}
                >
                  <div className="flex items-center space-x-2 overflow-hidden">
                    {expandedInvoice === invoice.id ? (
                      <ChevronDown size={14} className="text-slate-400 flex-shrink-0" aria-hidden="true" />
                    ) : (
                      <ChevronRight size={14} className="text-slate-400 flex-shrink-0" aria-hidden="true" />
                    )}
                    <span className="text-xs font-medium text-slate-700 truncate">{invoice.payeeName}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex-shrink-0 ml-2 ${
                    invoice.status === 'Matched' ? 'bg-[#e6f4ea] text-[#1e8e3e]' :
                    invoice.status === 'Unmatched' ? 'bg-[#fff8e1] text-[#f9a825]' :
                    'bg-[#e3f2fd] text-[#0077c8]'
                  }`}>
                    {invoice.status}
                  </span>
                </button>
                {expandedInvoice === invoice.id && (
                  <div id={`invoice-detail-${invoice.id}`} className="px-4 pb-3 pl-9 space-y-1.5">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-400">Date</span>
                      <span className="text-slate-600 font-medium">{invoice.invoiceDate}</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-400">Amount</span>
                      <span className="text-slate-600 font-medium">${invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-400">Description</span>
                      <span className="text-slate-600 font-medium text-right max-w-[120px] truncate">{invoice.description}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Center Panel - Ledger Entry Table */}
        <div className="flex-1 bg-white rounded shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-700">Ledger Entry</h3>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#f8fafc] text-slate-500 font-semibold border-b border-slate-200 sticky top-0">
                <tr>
                  <th scope="col" className="px-4 py-2.5">Date</th>
                  <th scope="col" className="px-4 py-2.5">Payee</th>
                  <th scope="col" className="px-4 py-2.5">Exp Descrip</th>
                  <th scope="col" className="px-4 py-2.5 text-right">Amount</th>
                  <th scope="col" className="px-4 py-2.5 text-center">%</th>
                  <th scope="col" className="px-4 py-2.5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_LEDGER_ENTRIES.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-2.5 text-slate-600 font-medium whitespace-nowrap">{entry.date}</td>
                    <td className="px-4 py-2.5 text-slate-700 font-medium truncate max-w-[200px]">{entry.payee}</td>
                    <td className="px-4 py-2.5 text-slate-600 truncate max-w-[200px]">{entry.expDescrip}</td>
                    <td className="px-4 py-2.5 text-slate-700 font-medium text-right whitespace-nowrap">
                      ${entry.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        entry.percentage === 100 ? 'bg-[#e6f4ea] text-[#1e8e3e]' :
                        entry.percentage > 0 ? 'bg-[#e3f2fd] text-[#0077c8]' :
                        'bg-[#fff8e1] text-[#f9a825]'
                      }`}>
                        {entry.percentage}%
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`text-[10px] font-bold ${
                        entry.action === 'Approved' ? 'text-[#1e8e3e]' :
                        entry.action === 'Pending' ? 'text-[#f9a825]' :
                        'text-[#0077c8]'
                      }`}>
                        {entry.action}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <nav aria-label="Ledger entry pagination" className="px-4 py-2.5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
            <div className="flex items-center space-x-4">
              <div className="flex space-x-1 text-slate-400">
                <button aria-label="First page" className="hover:text-slate-600">{'<<'}</button>
                <button aria-label="Previous page" className="hover:text-slate-600">{'<'}</button>
                <button aria-label="Next page" className="hover:text-slate-600">{'>'}</button>
                <button aria-label="Last page" className="hover:text-slate-600">{'>>'}</button>
              </div>
              <span>Page 1 of 1</span>
              <span>Rows 1-{MOCK_LEDGER_ENTRIES.length} of {MOCK_LEDGER_ENTRIES.length}</span>
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="ledger-rows">Rows per page</label>
              <select id="ledger-rows" className="border border-slate-300 rounded p-1 bg-white focus:outline-none focus:border-[#0077c8]">
                <option>10</option>
              </select>
            </div>
          </nav>
        </div>

        {/* Right Panel - Document Viewer */}
        <div className="flex-[2] min-w-[320px] bg-white rounded shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          {/* Doc Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50/50" role="tablist" aria-label="Document details">
            {(['Note', 'Version 3', '1 Pages', '6 Extractions'] as const).map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeDocTab === tab}
                onClick={() => setActiveDocTab(tab)}
                className={`flex-1 py-2.5 text-[10px] font-medium border-b-2 transition-colors ${
                  activeDocTab === tab
                    ? 'border-[#0077c8] text-[#0077c8] font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Doc Toolbar */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 bg-white" role="toolbar" aria-label="Document tools">
            <div className="flex items-center space-x-2">
              <button aria-label="Select" className="p-1 hover:bg-slate-100 rounded text-slate-500">
                <MousePointer size={14} aria-hidden="true" />
              </button>
              <button aria-label="Annotate" className="p-1 hover:bg-slate-100 rounded text-slate-500">
                <Edit3 size={14} aria-hidden="true" />
              </button>
              <button aria-label="Show tags" className="p-1 hover:bg-slate-100 rounded text-slate-500">
                <Tag size={14} aria-hidden="true" />
              </button>
              <div className="w-px h-4 bg-slate-200 mx-1" aria-hidden="true"></div>
              <button onClick={() => setZoom(Math.max(25, zoom - 25))} aria-label="Zoom out" className="p-1 hover:bg-slate-100 rounded text-slate-500">
                <ZoomOut size={14} aria-hidden="true" />
              </button>
              <span className="text-[10px] text-slate-500 font-medium min-w-[35px] text-center" aria-live="polite">{zoom}%</span>
              <button onClick={() => setZoom(Math.min(200, zoom + 25))} aria-label="Zoom in" className="p-1 hover:bg-slate-100 rounded text-slate-500">
                <ZoomIn size={14} aria-hidden="true" />
              </button>
            </div>
            <div className="flex items-center space-x-1">
              <button aria-label="Copy" className="p-1 hover:bg-slate-100 rounded text-slate-500">
                <Copy size={14} aria-hidden="true" />
              </button>
              <button aria-label="Open in new tab" className="p-1 hover:bg-slate-100 rounded text-slate-500">
                <ExternalLink size={14} aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Document Preview */}
          <div className="flex flex-1 overflow-hidden">
            <div className="flex-1 p-3 overflow-auto bg-slate-100">
              <div className="bg-white border border-slate-200 rounded shadow-sm min-h-[400px] flex items-center justify-center">
                <div className="text-center text-slate-400">
                  <div className="w-16 h-20 bg-slate-100 rounded mx-auto mb-3 flex items-center justify-center border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-medium">PDF</span>
                  </div>
                  <p className="text-xs">Document Preview</p>
                  <p className="text-[10px] mt-1">Invoice document for</p>
                  <p className="text-[10px] font-medium text-slate-500">{MOCK_INVOICES.find(i => i.id === expandedInvoice)?.payeeName || 'Select an invoice'}</p>
                </div>
              </div>
            </div>

            {/* Page Thumbnails */}
            <div className="w-16 bg-slate-50 border-l border-slate-200 p-2 flex flex-col items-center space-y-2 overflow-y-auto">
              <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider mb-1">Pages</span>
              <button aria-label="Page 1" aria-current="page" className="w-10 h-14 bg-white border-2 border-[#0077c8] rounded shadow-sm flex items-center justify-center">
                <span className="text-[8px] text-slate-400">1</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
