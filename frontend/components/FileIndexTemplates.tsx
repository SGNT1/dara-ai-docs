import React from 'react';
import { Plus, MoreVertical } from 'lucide-react';
import { MOCK_FILE_INDEX_TEMPLATES } from '../constants';

interface FileIndexTemplatesProps {
  onNavigateToEditor: (templateId: string | null) => void;
  onBack: () => void;
}

export const FileIndexTemplates: React.FC<FileIndexTemplatesProps> = ({ onNavigateToEditor, onBack }) => {
  return (
    <div className="flex flex-col h-full bg-[#f4f7fa]">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 lg:px-6 pt-5 pb-4">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center text-xs text-slate-500 mb-2 font-medium list-none p-0">
            <li><span className="text-[#0077c8]">AI Docs</span></li>
            <li aria-hidden="true" className="mx-2">/</li>
            <li>
              <button className="text-[#0077c8] cursor-pointer hover:underline" onClick={onBack}>
                Batch Processing
              </button>
            </li>
            <li aria-hidden="true" className="mx-2">/</li>
            <li aria-current="page">File Index Templates</li>
          </ol>
        </nav>
        <h1 className="text-xl font-bold text-slate-800">File Index Templates</h1>
      </header>

      {/* Content */}
      <div className="flex-1 p-4 lg:p-6 overflow-auto">
        <div className="bg-white rounded shadow-sm border border-slate-200">
          <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-base font-bold text-slate-700">Saved Templates</h2>
            <button
              onClick={() => onNavigateToEditor(null)}
              className="bg-[#0077c8] hover:bg-[#0066b0] text-white px-4 py-1.5 rounded text-xs font-bold flex items-center shadow-sm"
            >
              <Plus size={14} className="mr-1.5" strokeWidth={3} aria-hidden="true" />
              New Template
            </button>
          </div>

          <table className="w-full text-xs text-left">
            <thead className="bg-[#f8fafc] text-slate-500 font-semibold border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th scope="col" className="px-5 py-3">Template Name</th>
                <th scope="col" className="px-5 py-3">Description</th>
                <th scope="col" className="px-5 py-3">Document Types</th>
                <th scope="col" className="px-5 py-3">Status</th>
                <th scope="col" className="px-5 py-3">Last Modified</th>
                <th scope="col" className="px-5 py-3 w-10"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_FILE_INDEX_TEMPLATES.map((template) => (
                <tr key={template.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => onNavigateToEditor(template.id)}
                      className="font-medium text-[#0077c8] hover:underline text-left"
                    >
                      {template.name}
                    </button>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{template.description}</td>
                  <td className="px-5 py-3.5 text-slate-600 font-medium">{template.documentRules.length}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                      template.status === 'Active'
                        ? 'bg-[#e6f4ea] text-[#1e8e3e]'
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                      {template.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 font-medium">{template.lastModified}</td>
                  <td className="px-5 py-3.5">
                    <button aria-label={`More options for ${template.name}`} className="text-slate-400 hover:text-slate-600">
                      <MoreVertical size={16} aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <nav aria-label="Template list pagination" className="px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
            <div className="flex items-center space-x-6">
              <div className="flex space-x-1 text-slate-400" role="group" aria-label="Page navigation">
                <button aria-label="First page" className="hover:text-slate-600">{'<<'}</button>
                <button aria-label="Previous page" className="hover:text-slate-600">{'<'}</button>
                <button aria-label="Next page" className="hover:text-slate-600">{'>'}</button>
                <button aria-label="Last page" className="hover:text-slate-600">{'>>'}</button>
              </div>
              <span>Page 1 of 1</span>
              <span>Rows 1-{MOCK_FILE_INDEX_TEMPLATES.length} of {MOCK_FILE_INDEX_TEMPLATES.length}</span>
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="fit-rows-per-page">Rows per page</label>
              <select id="fit-rows-per-page" className="border border-slate-300 rounded p-1 bg-white focus:outline-none focus:border-[#0077c8]">
                <option>10</option>
              </select>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};
