import React from 'react';
import { MoreVertical, Plus } from 'lucide-react';
import { MOCK_RECON_BATCHES } from '../constants';

interface ReconDashboardProps {
  onNavigateToBatch: (batchId: string) => void;
  onNavigateToUpload: () => void;
}

const DonutChart: React.FC<{ percentage: number; color: string; label: string; size?: number }> = ({ percentage, color, label, size = 120 }) => {
  const radius = (size - 16) / 2;
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
        strokeWidth="12"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="12"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
      />
    </svg>
  );
};

export const ReconDashboard: React.FC<ReconDashboardProps> = ({ onNavigateToBatch, onNavigateToUpload }) => {
  const totalLoans = MOCK_RECON_BATCHES.reduce((sum, b) => sum + b.loans, 0);
  const totalDocuments = MOCK_RECON_BATCHES.reduce((sum, b) => sum + b.documents, 0);
  const totalMatched = MOCK_RECON_BATCHES.reduce((sum, b) => sum + b.matched, 0);
  const batchAuditedPct = totalLoans > 0 ? Math.round((totalMatched / totalLoans) * 100) : 0;
  const invoiceAuditedPct = totalDocuments > 0 ? Math.round((totalDocuments * 0.97) / totalDocuments * 100) : 0;

  return (
    <div className="flex flex-col h-full bg-[#f4f7fa]">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 lg:px-6 pt-5 pb-0">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center text-xs text-slate-500 mb-2 font-medium list-none p-0">
            <li><span className="text-[#0077c8]">Advanced Recon</span></li>
            <li aria-hidden="true" className="mx-2">/</li>
            <li aria-current="page">Dashboard</li>
          </ol>
        </nav>
        <h1 className="text-xl font-bold text-slate-800 mb-6">Corporate Advance Reconciliation</h1>
      </header>

      {/* Content */}
      <div className="flex-1 p-4 lg:p-6 overflow-auto">
        {/* Summary Cards */}
        <h2 className="text-sm font-bold text-slate-700 mb-4">Corporate Advance Summary</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Batch Audited Card */}
          <div className="bg-white rounded shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Batch Audited</h3>
                <p className="text-3xl font-bold text-slate-800">{totalLoans.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-1">Total Loans</p>
              </div>
              <div className="relative">
                <DonutChart percentage={batchAuditedPct} color="#0077c8" label="Batch audited" />
                <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                  <span className="text-lg font-bold text-slate-700 transform rotate-0">{batchAuditedPct}%</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-6 mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#0077c8]" aria-hidden="true"></div>
                <span className="text-[10px] text-slate-500">Matched</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#e2e8f0]" aria-hidden="true"></div>
                <span className="text-[10px] text-slate-500">Unmatched</span>
              </div>
            </div>
          </div>

          {/* Invoices Audited Card */}
          <div className="bg-white rounded shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Invoices Audited</h3>
                <p className="text-3xl font-bold text-slate-800">{totalDocuments.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-1">Total Documents</p>
              </div>
              <div className="relative">
                <DonutChart percentage={invoiceAuditedPct} color="#1e8e3e" label="Invoices audited" />
                <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                  <span className="text-lg font-bold text-slate-700 transform rotate-0">{invoiceAuditedPct}%</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-6 mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#1e8e3e]" aria-hidden="true"></div>
                <span className="text-[10px] text-slate-500">Audited</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#e2e8f0]" aria-hidden="true"></div>
                <span className="text-[10px] text-slate-500">Pending</span>
              </div>
            </div>
          </div>
        </div>

        {/* Batch Pipeline Table */}
        <div className="bg-white rounded shadow-sm border border-slate-200">
          <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-base font-bold text-slate-700">Batch Pipeline</h2>
            <button
              onClick={onNavigateToUpload}
              className="bg-[#0077c8] hover:bg-[#0066b0] text-white px-4 py-1.5 rounded text-xs font-bold flex items-center shadow-sm"
            >
              <Plus size={14} className="mr-1.5" strokeWidth={3} aria-hidden="true" />
              Upload
            </button>
          </div>

          <table className="w-full text-xs text-left">
            <thead className="bg-[#f8fafc] text-slate-500 font-semibold border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th scope="col" className="px-5 py-3">Transfer Name</th>
                <th scope="col" className="px-5 py-3">Transfer Date</th>
                <th scope="col" className="px-5 py-3">Batch ID</th>
                <th scope="col" className="px-5 py-3">Status</th>
                <th scope="col" className="px-5 py-3">Loans</th>
                <th scope="col" className="px-5 py-3">Documents</th>
                <th scope="col" className="px-5 py-3">Matched</th>
                <th scope="col" className="px-5 py-3">Unmatched</th>
                <th scope="col" className="px-5 py-3">Upload Date/Time</th>
                <th scope="col" className="px-5 py-3 w-10"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_RECON_BATCHES.map((batch) => (
                <tr key={batch.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => batch.status === 'Complete' ? onNavigateToBatch(batch.id) : null}
                      className={`font-medium text-left ${batch.status === 'Complete' ? 'text-[#0077c8] hover:underline' : 'text-slate-700'}`}
                      aria-disabled={batch.status !== 'Complete'}
                    >
                      {batch.transferName}
                    </button>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 font-medium">{batch.transferDate}</td>
                  <td className="px-5 py-3.5 text-slate-600 font-medium font-mono text-[10px]">{batch.batchId}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                      batch.status === 'Complete'
                        ? 'bg-[#e6f4ea] text-[#1e8e3e]'
                        : batch.status === 'In Progress'
                        ? 'bg-[#fff8e1] text-[#f9a825]'
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                      {batch.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 font-medium">{batch.status === 'Pending' ? '--' : batch.loans}</td>
                  <td className="px-5 py-3.5 text-slate-600 font-medium">{batch.status === 'Pending' ? '--' : batch.documents.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-slate-600 font-medium">{batch.status === 'Pending' ? '--' : batch.matched}</td>
                  <td className="px-5 py-3.5 text-slate-600 font-medium">{batch.status === 'Pending' ? '--' : batch.unmatched}</td>
                  <td className="px-5 py-3.5 text-slate-600 font-medium text-[10px]">{batch.uploadDateTime}</td>
                  <td className="px-5 py-3.5">
                    <button aria-label={`More options for ${batch.transferName}`} className="text-slate-400 cursor-pointer hover:text-slate-600">
                      <MoreVertical size={16} aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <nav aria-label="Batch pipeline pagination" className="px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
            <div className="flex items-center space-x-6">
              <div className="flex space-x-1 text-slate-400">
                <button aria-label="First page" className="hover:text-slate-600">{'<<'}</button>
                <button aria-label="Previous page" className="hover:text-slate-600">{'<'}</button>
                <button aria-label="Next page" className="hover:text-slate-600">{'>'}</button>
                <button aria-label="Last page" className="hover:text-slate-600">{'>>'}</button>
              </div>
              <span>Page 1 of 1</span>
              <span>Rows 1-7 of 7</span>
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="recon-dash-rows">Rows per page</label>
              <select id="recon-dash-rows" className="border border-slate-300 rounded p-1 bg-white focus:outline-none focus:border-[#0077c8]">
                <option>10</option>
              </select>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};
