import React from 'react';
import { Plus, Search } from 'lucide-react';

const MOCK_USERS = [
  { id: '1', name: 'John Smith', email: 'john.smith@servicer.com', role: 'Admin', status: 'Active', lastLogin: '02/10/2025' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah.j@servicer.com', role: 'Analyst', status: 'Active', lastLogin: '02/09/2025' },
  { id: '3', name: 'Mike Chen', email: 'mike.chen@servicer.com', role: 'Viewer', status: 'Active', lastLogin: '02/08/2025' },
  { id: '4', name: 'Emily Davis', email: 'emily.d@servicer.com', role: 'Analyst', status: 'Inactive', lastLogin: '01/15/2025' },
  { id: '5', name: 'Robert Wilson', email: 'r.wilson@servicer.com', role: 'Admin', status: 'Active', lastLogin: '02/10/2025' },
];

export const ReconAccessControls: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-[#f4f7fa]">
      <header className="bg-white border-b border-slate-200 px-4 lg:px-6 pt-5 pb-4">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center text-xs text-slate-500 mb-2 font-medium list-none p-0">
            <li><span className="text-[#0077c8]">Advanced Recon</span></li>
            <li aria-hidden="true" className="mx-2">/</li>
            <li aria-current="page">Access Controls</li>
          </ol>
        </nav>
        <h1 className="text-xl font-bold text-slate-800">Access Controls</h1>
      </header>

      <div className="flex-1 p-4 lg:p-6 overflow-auto">
        <div className="bg-white rounded shadow-sm border border-slate-200">
          <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-base font-bold text-slate-700">Users & Permissions</h2>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <label htmlFor="search-users" className="sr-only">Search users</label>
                <input id="search-users" type="text" placeholder="Search users..." className="pl-3 pr-8 py-1.5 border border-slate-300 rounded text-xs focus:border-[#0077c8] outline-none w-56" />
                <Search size={14} className="absolute right-2.5 top-2 text-slate-400" aria-hidden="true" />
              </div>
              <button className="bg-[#0077c8] hover:bg-[#0066b0] text-white px-4 py-1.5 rounded text-xs font-bold flex items-center shadow-sm">
                <Plus size={14} className="mr-1.5" strokeWidth={3} aria-hidden="true" />
                Add User
              </button>
            </div>
          </div>

          <table className="w-full text-xs text-left">
            <thead className="bg-[#f8fafc] text-slate-500 font-semibold border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th scope="col" className="px-5 py-3">Name</th>
                <th scope="col" className="px-5 py-3">Email</th>
                <th scope="col" className="px-5 py-3">Role</th>
                <th scope="col" className="px-5 py-3">Status</th>
                <th scope="col" className="px-5 py-3">Last Login</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_USERS.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-700">{user.name}</td>
                  <td className="px-5 py-3.5 text-slate-600">{user.email}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                      user.role === 'Admin' ? 'bg-[#e3f2fd] text-[#0077c8]' :
                      user.role === 'Analyst' ? 'bg-[#f3e8ff] text-[#7c3aed]' :
                      'bg-slate-200 text-slate-600'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                      user.status === 'Active' ? 'bg-[#e6f4ea] text-[#1e8e3e]' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 font-medium">{user.lastLogin}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <nav aria-label="Users pagination" className="px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
            <div className="flex items-center space-x-6">
              <div className="flex space-x-1 text-slate-400" role="group" aria-label="Page navigation">
                <button aria-label="First page" className="hover:text-slate-600">{'<<'}</button>
                <button aria-label="Previous page" className="hover:text-slate-600">{'<'}</button>
                <button aria-label="Next page" className="hover:text-slate-600">{'>'}</button>
                <button aria-label="Last page" className="hover:text-slate-600">{'>>'}</button>
              </div>
              <span>Page 1 of 1</span>
              <span>Rows 1-5 of 5</span>
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="rows-per-page-users">Rows per page</label>
              <select id="rows-per-page-users" className="border border-slate-300 rounded p-1 bg-white focus:outline-none focus:border-[#0077c8]">
                <option>10</option>
              </select>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};
