import React, { useState } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { MOCK_RECON_BATCHES, MOCK_RECON_LOANS } from '../constants';

interface ReconBatchDetailProps {
  selectedBatchId: string | null;
  onNavigateToLoan: (loanId: string) => void;
  onNavigateToLoanV2?: (loanId: string) => void;
  onBack: () => void;
}

type TabType = 'Unmatched' | 'Matched' | 'All';

const MatchDonut: React.FC<{ percentage: number; label: string; size?: number }> = ({ percentage, label, size = 160 }) => {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90" role="img" aria-label={`${label}: ${percentage}%`}>
      <title>{`${label}: ${percentage}%`}</title>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#e2e8f0"
        strokeWidth="14"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#0077c8"
        strokeWidth="14"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
      />
    </svg>
  );
};

const getPctBgColor = (pct: number, type: 'unmatched' | 'matched') => {
  if (type === 'unmatched') {
    if (pct === 0) return '';
    return 'bg-[#fff8e1] text-[#f9a825]';
  }
  if (pct === 100) return 'bg-[#e6f4ea] text-[#1e8e3e]';
  if (pct > 0) return 'bg-[#e3f2fd] text-[#0077c8]';
  return '';
};

export const ReconBatchDetail: React.FC<ReconBatchDetailProps> = ({ selectedBatchId, onNavigateToLoan, onNavigateToLoanV2, onBack }) => {
  const [activeTab, setActiveTab] = useState<TabType>('Unmatched');

  const batch = MOCK_RECON_BATCHES.find(b => b.id === selectedBatchId) || MOCK_RECON_BATCHES[0];
  const matchedPct = batch.loans > 0 ? Math.round((batch.matched / batch.loans) * 100) : 0;
  const incomplete = batch.unmatched;
  const complete = batch.matched;
  const total = batch.loans;

  const filteredLoans = MOCK_RECON_LOANS.filter(loan => {
    if (activeTab === 'Unmatched') return loan.unmatchedPct > 0;
    if (activeTab === 'Matched') return loan.matchedPct === 100;
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-[#f4f7fa]">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 lg:px-6 pt-5 pb-0">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center text-xs text-slate-500 mb-2 font-medium list-none p-0">
            <li><span className="text-[#0077c8]">Advanced Recon</span></li>
            <li aria-hidden="true" className="mx-2">/</li>
            <li><button className="text-[#0077c8] cursor-pointer hover:underline" onClick={onBack}>Dashboard</button></li>
            <li aria-hidden="true" className="mx-2">/</li>
            <li aria-current="page">Batch Detail</li>
          </ol>
        </nav>
        <div className="flex items-center mb-4">
          <button onClick={onBack} aria-label="Back to dashboard" className="mr-3 text-slate-400 hover:text-slate-600">
            <ArrowLeft size={18} aria-hidden="true" />
          </button>
          <h1 className="text-xl font-bold text-slate-800">
            Batch - {batch.transferName} - {batch.transferDate} - {batch.batchId}
          </h1>
        </div>

        <div className="flex space-x-8" role="tablist" aria-label="Loan match filter">
          {(['Unmatched', 'Matched', 'All'] as const).map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 border-b-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'border-[#0077c8] text-slate-800 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Loan Table */}
          <div className="flex-1 bg-white rounded shadow-sm border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-base font-bold text-slate-700">Loans</h2>
              <button className="bg-[#0077c8] hover:bg-[#0066b0] text-white px-4 py-1.5 rounded text-xs font-bold flex items-center shadow-sm">
                <Plus size={14} className="mr-1.5" strokeWidth={3} aria-hidden="true" />
                Add Loan
              </button>
            </div>

            <table className="w-full text-xs text-left">
              <thead className="bg-[#f8fafc] text-slate-500 font-semibold border-b border-slate-200 sticky top-0 z-10">
                <tr>
                  <th scope="col" className="px-5 py-3">Loan Number</th>
                  <th scope="col" className="px-5 py-3">Unmatched %</th>
                  <th scope="col" className="px-5 py-3">Matched %</th>
                  <th scope="col" className="px-5 py-3">Invoices</th>
                  <th scope="col" className="px-5 py-3">Ledger Entries</th>
                  <th scope="col" className="px-5 py-3"><span className="sr-only">Layout</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => onNavigateToLoan(loan.id)}>
                    <td className="px-5 py-3.5">
                      <span className="font-medium text-[#0077c8] hover:underline">{loan.loanNumber}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold ${getPctBgColor(loan.unmatchedPct, 'unmatched')}`}>
                        {loan.unmatchedPct > 0 ? `${loan.unmatchedPct}%` : '-'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold ${getPctBgColor(loan.matchedPct, 'matched')}`}>
                        {loan.matchedPct}%
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 font-medium">{loan.invoicesCount}</td>
                    <td className="px-5 py-3.5 text-slate-600 font-medium">{loan.ledgerEntries}</td>
                    <td className="px-5 py-3.5">
                      {onNavigateToLoanV2 && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onNavigateToLoanV2(loan.id); }}
                          className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#e3f2fd] text-[#0077c8] hover:bg-[#0077c8] hover:text-white transition-colors"
                        >
                          V2
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <nav aria-label="Loan list pagination" className="px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
              <div className="flex items-center space-x-6">
                <div className="flex space-x-1 text-slate-400">
                  <button aria-label="First page" className="hover:text-slate-600">{'<<'}</button>
                  <button aria-label="Previous page" className="hover:text-slate-600">{'<'}</button>
                  <button aria-label="Next page" className="hover:text-slate-600">{'>'}</button>
                  <button aria-label="Last page" className="hover:text-slate-600">{'>>'}</button>
                </div>
                <span>Page 1 of 1</span>
                <span>Rows 1-{filteredLoans.length} of {filteredLoans.length}</span>
              </div>
              <div className="flex items-center space-x-2">
                <label htmlFor="recon-batch-rows">Rows per page</label>
                <select id="recon-batch-rows" className="border border-slate-300 rounded p-1 bg-white focus:outline-none focus:border-[#0077c8]">
                  <option>10</option>
                </select>
              </div>
            </nav>
          </div>

          {/* Matched Donut Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0 bg-white rounded shadow-sm border border-slate-200 p-5 h-fit">
            <h3 className="text-sm font-bold text-slate-700 mb-4">Matched</h3>
            <div className="flex justify-center mb-4 relative">
              <MatchDonut percentage={matchedPct} label="Matched loans" />
              <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                <span className="text-2xl font-bold text-slate-700">{matchedPct}%</span>
              </div>
            </div>
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#f9a825]" aria-hidden="true"></div>
                  <span className="text-xs text-slate-500">Incomplete</span>
                </div>
                <span className="text-xs font-bold text-slate-700">{incomplete}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#0077c8]" aria-hidden="true"></div>
                  <span className="text-xs text-slate-500">Complete</span>
                </div>
                <span className="text-xs font-bold text-slate-700">{complete}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <span className="text-xs text-slate-500 font-medium">Total</span>
                <span className="text-xs font-bold text-slate-700">{total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
