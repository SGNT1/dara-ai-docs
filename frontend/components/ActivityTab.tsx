import React from 'react';

const MOCK_ACTIVITIES = [
  { id: '1', timestamp: '02/10/2025 10:30 AM', action: 'Batch uploaded', detail: 'Carrington Transfer 2025 (645 files)', user: 'John Smith' },
  { id: '2', timestamp: '02/10/2025 10:32 AM', action: 'Processing started', detail: 'Carrington Transfer 2025 — classification in progress', user: 'System' },
  { id: '3', timestamp: '02/10/2025 11:45 AM', action: 'Classification complete', detail: '1,200 of 1,250 documents classified', user: 'System' },
  { id: '4', timestamp: '02/09/2025 03:15 PM', action: 'Batch uploaded', detail: 'Wellington Final Loan Package (200 files)', user: 'Sarah Johnson' },
  { id: '5', timestamp: '02/09/2025 03:20 PM', action: 'Extraction started', detail: 'Wellington Final Loan Package — extracting fields', user: 'System' },
  { id: '6', timestamp: '02/09/2025 04:00 PM', action: 'Processing complete', detail: 'Wellington Final Loan Package — 245 documents extracted', user: 'System' },
  { id: '7', timestamp: '02/08/2025 09:00 AM', action: 'Document re-classified', detail: 'Document 8 reclassified from Unknown to Classified', user: 'Mike Chen' },
  { id: '8', timestamp: '02/08/2025 08:30 AM', action: 'Report downloaded', detail: 'Processing Report for Carrington Transfer 2025', user: 'John Smith' },
];

export const ActivityTab: React.FC = () => {
  return (
    <div role="tabpanel" id="panel-activity" aria-labelledby="tab-activity" className="flex-1 p-6 overflow-auto">
      <div className="bg-white rounded shadow-sm border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50">
          <h2 className="text-base font-bold text-slate-700">Recent Activity</h2>
        </div>
        <table className="w-full text-xs text-left">
          <thead className="bg-[#f8fafc] text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th scope="col" className="px-5 py-3">Timestamp</th>
              <th scope="col" className="px-5 py-3">Action</th>
              <th scope="col" className="px-5 py-3">Detail</th>
              <th scope="col" className="px-5 py-3">User</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_ACTIVITIES.map((activity) => (
              <tr key={activity.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3.5 text-slate-600 font-medium whitespace-nowrap">{activity.timestamp}</td>
                <td className="px-5 py-3.5 text-slate-700 font-medium">{activity.action}</td>
                <td className="px-5 py-3.5 text-slate-600">{activity.detail}</td>
                <td className="px-5 py-3.5 text-slate-600">{activity.user}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <nav aria-label="Activity pagination" className="px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
          <div className="flex items-center space-x-6">
            <div className="flex space-x-1 text-slate-400" role="group" aria-label="Page navigation">
              <button aria-label="First page" className="hover:text-slate-600">{'<<'}</button>
              <button aria-label="Previous page" className="hover:text-slate-600">{'<'}</button>
              <button aria-label="Next page" className="hover:text-slate-600">{'>'}</button>
              <button aria-label="Last page" className="hover:text-slate-600">{'>>'}</button>
            </div>
            <span>Page 1 of 1</span>
            <span>Rows 1-8 of 8</span>
          </div>
          <div className="flex items-center space-x-2">
            <label htmlFor="rows-per-page-activity">Rows per page</label>
            <select id="rows-per-page-activity" className="border border-slate-300 rounded p-1 bg-white focus:outline-none focus:border-[#0077c8]">
              <option>10</option>
            </select>
          </div>
        </nav>
      </div>
    </div>
  );
};
