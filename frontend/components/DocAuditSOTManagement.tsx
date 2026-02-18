import React from 'react';
import { MOCK_FIELD_SOURCE_RULES } from '../constants';

export const DocAuditSOTManagement: React.FC = () => {
  return (
    <div className="flex-1 p-6 overflow-auto bg-[#f4f7fa]">
      <header className="mb-6">
        <h1 className="text-xl font-bold text-slate-800">SOT Management</h1>
        <p className="text-sm text-slate-500 mt-1">Configure which document types and extraction fields map to each loan tape field.</p>
      </header>

      <div className="bg-white rounded shadow-sm border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-base font-bold text-slate-700">Field Source Rules</h2>
          <button className="bg-[#4f46e5] hover:bg-[#4338ca] text-white px-4 py-1.5 rounded text-xs font-bold shadow-sm">
            Save as Template
          </button>
        </div>

        <table className="w-full text-xs text-left">
          <thead className="bg-[#f8fafc] text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th scope="col" className="px-5 py-3">Loan Tape Field</th>
              <th scope="col" className="px-5 py-3">Source Document Type</th>
              <th scope="col" className="px-5 py-3">Extraction Field</th>
              <th scope="col" className="px-5 py-3">Fallback Document Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_FIELD_SOURCE_RULES.map((rule, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3.5 font-medium text-slate-700">{rule.loanTapeField}</td>
                <td className="px-5 py-3.5">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded bg-[#ede9fe] text-[#4f46e5] text-[10px] font-bold">
                    {rule.sourceDocType}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-slate-600">{rule.sourceExtractionField}</td>
                <td className="px-5 py-3.5 text-slate-400">
                  {rule.fallbackDocType ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold">
                      {rule.fallbackDocType}
                    </span>
                  ) : (
                    '—'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
