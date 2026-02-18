import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { MOCK_DOC_AUDITS, MOCK_DOC_AUDIT_LOANS } from '../constants';

interface DocAuditLoanListProps {
  selectedAuditId: string | null;
  onNavigateToLoan: (loanId: string) => void;
  onBack: () => void;
}

type FilterTab = 'All' | 'Needs Review' | 'Pass' | 'Missing Docs';

const MatchDonut: React.FC<{ percentage: number; label: string; size?: number }> = ({ percentage, label, size = 160 }) => {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90" role="img" aria-label={`${label}: ${percentage}%`}>
      <title>{`${label}: ${percentage}%`}</title>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e2e8f0" strokeWidth="14" />
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#4f46e5" strokeWidth="14" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
    </svg>
  );
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Pass':
      return 'bg-[#e6f4ea] text-[#1e8e3e]';
    case 'Needs Review':
      return 'bg-[#fff8e1] text-[#f9a825]';
    case 'Missing Docs':
      return 'bg-[#fce8e6] text-[#d93025]';
    default:
      return 'bg-slate-100 text-slate-500';
  }
};

export const DocAuditLoanList: React.FC<DocAuditLoanListProps> = ({ selectedAuditId, onNavigateToLoan, onBack }) => {
  const [activeTab, setActiveTab] = useState<FilterTab>('All');

  const audit = MOCK_DOC_AUDITS.find(a => a.id === selectedAuditId) || MOCK_DOC_AUDITS[0];
  const allLoans = MOCK_DOC_AUDIT_LOANS.filter(l => l.auditId === audit.id);

  const filteredLoans = allLoans.filter(loan => {
    if (activeTab === 'All') return true;
    return loan.status === activeTab;
  });

  const passCount = allLoans.filter(l => l.status === 'Pass').length;
  const reviewCount = allLoans.filter(l => l.status === 'Needs Review').length;
  const missingCount = allLoans.filter(l => l.status === 'Missing Docs').length;
  const matchPct = allLoans.length > 0
    ? Math.round((passCount / allLoans.length) * 100)
    : 0;

  return (
    <div className="flex flex-col h-full bg-[#f4f7fa]">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 lg:px-6 pt-5 pb-0">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center text-xs text-slate-500 mb-2 font-medium list-none p-0">
            <li><span className="text-[#4f46e5]">Doc Audit</span></li>
            <li aria-hidden="true" className="mx-2">/</li>
            <li><button className="text-[#4f46e5] cursor-pointer hover:underline" onClick={onBack}>Dashboard</button></li>
            <li aria-hidden="true" className="mx-2">/</li>
            <li aria-current="page">{audit.name}</li>
          </ol>
        </nav>
        <div className="flex items-center mb-4">
          <button onClick={onBack} aria-label="Back to dashboard" className="mr-3 text-slate-400 hover:text-slate-600">
            <ArrowLeft size={18} aria-hidden="true" />
          </button>
          <h1 className="text-xl font-bold text-slate-800">{audit.name}</h1>
        </div>

        <div className="flex space-x-8" role="tablist" aria-label="Loan status filter">
          {(['All', 'Needs Review', 'Pass', 'Missing Docs'] as const).map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 border-b-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'border-[#4f46e5] text-slate-800 font-semibold'
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
            <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50">
              <h2 className="text-base font-bold text-slate-700">Loans</h2>
            </div>

            <table className="w-full text-xs text-left">
              <thead className="bg-[#f8fafc] text-slate-500 font-semibold border-b border-slate-200 sticky top-0 z-10">
                <tr>
                  <th scope="col" className="px-5 py-3">Loan Number</th>
                  <th scope="col" className="px-5 py-3">Borrower</th>
                  <th scope="col" className="px-5 py-3">Fields</th>
                  <th scope="col" className="px-5 py-3">Matched</th>
                  <th scope="col" className="px-5 py-3">Mismatched</th>
                  <th scope="col" className="px-5 py-3">Missing</th>
                  <th scope="col" className="px-5 py-3">Low Conf</th>
                  <th scope="col" className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-slate-50 transition-colors cursor-pointer group" onClick={() => onNavigateToLoan(loan.id)}>
                    <td className="px-5 py-3.5">
                      <span className="font-medium text-[#4f46e5] group-hover:underline">{loan.loanNumber}</span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">{loan.borrowerName}</td>
                    <td className="px-5 py-3.5 text-slate-600 font-medium">{loan.fieldsCompared}</td>
                    <td className="px-5 py-3.5">
                      <span className="text-[#1e8e3e] font-bold">{loan.matched}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      {loan.mismatched > 0 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#fce8e6] text-[#d93025] text-[10px] font-bold">{loan.mismatched}</span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      {loan.missing > 0 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px] font-bold">{loan.missing}</span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      {loan.lowConfidence > 0 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#fff8e1] text-[#f9a825] text-[10px] font-bold">{loan.lowConfidence}</span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold ${getStatusBadge(loan.status)}`}>
                        {loan.status}
                      </span>
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
                <label htmlFor="doc-audit-loan-rows">Rows per page</label>
                <select id="doc-audit-loan-rows" className="border border-slate-300 rounded p-1 bg-white focus:outline-none focus:border-[#4f46e5]">
                  <option>10</option>
                </select>
              </div>
            </nav>
          </div>

          {/* Match Rate Donut Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0 bg-white rounded shadow-sm border border-slate-200 p-5 h-fit">
            <h3 className="text-sm font-bold text-slate-700 mb-4">Audit Summary</h3>
            <div className="flex justify-center mb-4 relative">
              <MatchDonut percentage={matchPct} label="Pass rate" />
              <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                <span className="text-2xl font-bold text-slate-700">{matchPct}%</span>
              </div>
            </div>
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#1e8e3e]" aria-hidden="true"></div>
                  <span className="text-xs text-slate-500">Pass</span>
                </div>
                <span className="text-xs font-bold text-slate-700">{passCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#f9a825]" aria-hidden="true"></div>
                  <span className="text-xs text-slate-500">Needs Review</span>
                </div>
                <span className="text-xs font-bold text-slate-700">{reviewCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#d93025]" aria-hidden="true"></div>
                  <span className="text-xs text-slate-500">Missing Docs</span>
                </div>
                <span className="text-xs font-bold text-slate-700">{missingCount}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <span className="text-xs text-slate-500 font-medium">Total</span>
                <span className="text-xs font-bold text-slate-700">{allLoans.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
