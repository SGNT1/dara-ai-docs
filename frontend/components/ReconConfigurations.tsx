import React from 'react';
import { Save, Trash2, Edit3 } from 'lucide-react';
import { MOCK_CSV_MAPPING_TEMPLATES } from '../constants';

const CONFIG_SECTIONS = [
  {
    title: 'Matching Thresholds',
    fields: [
      { label: 'Amount Match Tolerance (%)', id: 'amount-tolerance', value: '5', type: 'number' as const },
      { label: 'Date Match Window (days)', id: 'date-window', value: '30', type: 'number' as const },
      { label: 'Auto-Approve Threshold (%)', id: 'auto-approve', value: '95', type: 'number' as const },
    ],
  },
  {
    title: 'Document Classification',
    fields: [
      { label: 'Confidence Threshold (%)', id: 'confidence-threshold', value: '85', type: 'number' as const },
      { label: 'Default Document Type', id: 'default-doc-type', value: 'Invoice', type: 'text' as const },
      { label: 'OCR Language', id: 'ocr-language', value: 'English', type: 'text' as const },
    ],
  },
  {
    title: 'Notification Settings',
    fields: [
      { label: 'Email Notifications', id: 'email-notif', value: 'Enabled', type: 'text' as const },
      { label: 'Batch Complete Alert', id: 'batch-alert', value: 'Enabled', type: 'text' as const },
      { label: 'Unmatched Threshold Alert (%)', id: 'unmatch-alert', value: '10', type: 'number' as const },
    ],
  },
];

export const ReconConfigurations: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-[#f4f7fa]">
      <header className="bg-white border-b border-slate-200 px-4 lg:px-6 pt-5 pb-4">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center text-xs text-slate-500 mb-2 font-medium list-none p-0">
            <li><span className="text-[#0077c8]">Advanced Recon</span></li>
            <li aria-hidden="true" className="mx-2">/</li>
            <li aria-current="page">Configurations</li>
          </ol>
        </nav>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">Configurations</h1>
          <button className="bg-[#0077c8] hover:bg-[#0066b0] text-white px-4 py-1.5 rounded text-xs font-bold flex items-center shadow-sm">
            <Save size={14} className="mr-1.5" aria-hidden="true" />
            Save Changes
          </button>
        </div>
      </header>

      <div className="flex-1 p-4 lg:p-6 overflow-auto">
        <div className="max-w-5xl space-y-6">
          {CONFIG_SECTIONS.map((section) => (
            <fieldset key={section.title} className="bg-white rounded shadow-sm border border-slate-200">
              <legend className="px-5 py-4 border-b border-slate-200 bg-slate-50/50 text-base font-bold text-slate-700 w-full block">
                {section.title}
              </legend>
              <div className="p-5 space-y-4">
                {section.fields.map((field) => (
                  <div key={field.id} className="flex items-center justify-between">
                    <label htmlFor={field.id} className="text-xs font-medium text-slate-700">{field.label}</label>
                    <input
                      id={field.id}
                      type={field.type}
                      defaultValue={field.value}
                      className="w-48 border border-slate-300 rounded-sm p-2 text-xs text-slate-700 focus:border-[#0077c8] outline-none"
                    />
                  </div>
                ))}
              </div>
            </fieldset>
          ))}

          {/* CSV Mapping Templates */}
          <div className="bg-white rounded shadow-sm border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50">
              <h2 className="text-base font-bold text-slate-700">CSV Mapping Templates</h2>
            </div>
            <table className="w-full text-xs text-left">
              <thead className="bg-[#f8fafc] text-slate-500 font-semibold border-b border-slate-200 sticky top-0 z-10">
                <tr>
                  <th scope="col" className="px-5 py-3">Template Name</th>
                  <th scope="col" className="px-5 py-3">Description</th>
                  <th scope="col" className="px-5 py-3">Mapped Fields</th>
                  <th scope="col" className="px-5 py-3">Last Modified</th>
                  <th scope="col" className="px-5 py-3 w-20"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_CSV_MAPPING_TEMPLATES.map((tpl) => (
                  <tr key={tpl.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-slate-700">{tpl.name}</td>
                    <td className="px-5 py-3.5 text-slate-600">{tpl.description}</td>
                    <td className="px-5 py-3.5 text-slate-600 font-medium">{tpl.mappings.length}</td>
                    <td className="px-5 py-3.5 text-slate-600 font-medium">{tpl.lastModified}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center space-x-2">
                        <button aria-label={`Edit ${tpl.name}`} className="text-slate-400 hover:text-[#0077c8]">
                          <Edit3 size={14} aria-hidden="true" />
                        </button>
                        <button aria-label={`Delete ${tpl.name}`} className="text-slate-400 hover:text-red-500">
                          <Trash2 size={14} aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
