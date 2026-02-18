import React from 'react';

export const DocAuditSettings: React.FC = () => {
  return (
    <div className="flex-1 p-6 overflow-auto bg-[#f4f7fa]">
      <header className="mb-6">
        <h1 className="text-xl font-bold text-slate-800">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Configure Doc Audit thresholds, SOT selection rules, and notifications.</p>
      </header>

      <div className="space-y-6">
        {/* Matching Thresholds */}
        <section className="bg-white rounded shadow-sm border border-slate-200 p-5">
          <h2 className="text-sm font-bold text-slate-700 mb-4">Matching Thresholds</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="confidence-threshold" className="block text-xs font-medium text-slate-600 mb-1">Confidence Threshold (%)</label>
              <input id="confidence-threshold" type="number" defaultValue={85} min={0} max={100} className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4f46e5]" />
            </div>
            <div>
              <label htmlFor="fuzzy-match" className="block text-xs font-medium text-slate-600 mb-1">Fuzzy Match Threshold (%)</label>
              <input id="fuzzy-match" type="number" defaultValue={90} min={0} max={100} className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4f46e5]" />
            </div>
            <div>
              <label htmlFor="auto-accept" className="block text-xs font-medium text-slate-600 mb-1">Auto-Accept Threshold (%)</label>
              <input id="auto-accept" type="number" defaultValue={95} min={0} max={100} className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4f46e5]" />
            </div>
          </div>
        </section>

        {/* SOT Selection Rules */}
        <section className="bg-white rounded shadow-sm border border-slate-200 p-5">
          <h2 className="text-sm font-bold text-slate-700 mb-4">SOT Selection Rules</h2>
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input type="checkbox" defaultChecked className="rounded border-slate-300 text-[#4f46e5] focus:ring-[#4f46e5]" />
              <span className="text-sm text-slate-600">Auto-select latest version as SOT candidate</span>
            </label>
            <label className="flex items-center space-x-3">
              <input type="checkbox" defaultChecked className="rounded border-slate-300 text-[#4f46e5] focus:ring-[#4f46e5]" />
              <span className="text-sm text-slate-600">Prefer recorded documents over unrecorded</span>
            </label>
            <label className="flex items-center space-x-3">
              <input type="checkbox" className="rounded border-slate-300 text-[#4f46e5] focus:ring-[#4f46e5]" />
              <span className="text-sm text-slate-600">Require minimum confidence of 90% for SOT designation</span>
            </label>
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-white rounded shadow-sm border border-slate-200 p-5">
          <h2 className="text-sm font-bold text-slate-700 mb-4">Notifications</h2>
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input type="checkbox" defaultChecked className="rounded border-slate-300 text-[#4f46e5] focus:ring-[#4f46e5]" />
              <span className="text-sm text-slate-600">Email notification when audit completes</span>
            </label>
            <label className="flex items-center space-x-3">
              <input type="checkbox" defaultChecked className="rounded border-slate-300 text-[#4f46e5] focus:ring-[#4f46e5]" />
              <span className="text-sm text-slate-600">Alert when exception rate exceeds threshold</span>
            </label>
            <label className="flex items-center space-x-3">
              <input type="checkbox" className="rounded border-slate-300 text-[#4f46e5] focus:ring-[#4f46e5]" />
              <span className="text-sm text-slate-600">Daily digest of pending reviews</span>
            </label>
          </div>
        </section>

        <div className="flex justify-end">
          <button className="bg-[#4f46e5] hover:bg-[#4338ca] text-white px-6 py-2 rounded text-sm font-bold shadow-sm">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
