import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, ChevronDown, MoreVertical, FileText, Trash2, ArrowUp } from 'lucide-react';
import { MOCK_BATCHES } from '../constants';
import { ActivityTab } from './ActivityTab';

interface BatchListProps {
  onNavigateToDetails: (batchId: string) => void;
  onNavigateToTemplates?: () => void;
}

export const BatchList: React.FC<BatchListProps> = ({ onNavigateToDetails, onNavigateToTemplates }) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadStep, setUploadStep] = useState<'initial' | 'fileSelected'>('initial');
  const [selectedBatchType, setSelectedBatchType] = useState<'new' | 'existing'>('new');
  const [showBatchDropdown, setShowBatchDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState<'extraction' | 'activity'>('extraction');
  const modalRef = useRef<HTMLDivElement>(null);

  // Modal focus trap
  useEffect(() => {
    if (!isUploadModalOpen) return;
    const dialog = modalRef.current;
    if (!dialog) return;
    const previouslyFocused = document.activeElement as HTMLElement;
    const focusableEls = dialog.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstEl = focusableEls[0];
    const lastEl = focusableEls[focusableEls.length - 1];
    firstEl?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setIsUploadModalOpen(false); return; }
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === firstEl) { e.preventDefault(); lastEl?.focus(); }
      } else {
        if (document.activeElement === lastEl) { e.preventDefault(); firstEl?.focus(); }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [isUploadModalOpen]);

  const handleFileSelect = () => {
    setUploadStep('fileSelected');
  };

  const handleUpload = () => {
    setIsUploadModalOpen(false);
    setUploadStep('initial');
  };

  return (
    <div className="flex flex-col h-full bg-[#f4f7fa]">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 lg:px-6 pt-5 pb-0">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center text-xs text-slate-500 mb-2 font-medium list-none p-0">
            <li><span className="text-[#0077c8]">AI Docs</span></li>
            <li aria-hidden="true" className="mx-2">/</li>
            <li aria-current="page">Batch Processing</li>
          </ol>
        </nav>
        <h1 className="text-xl font-bold text-slate-800 mb-6">Batch Processing</h1>

        <div className="flex space-x-8" role="tablist" aria-label="Batch processing views">
          <button
            role="tab"
            id="tab-extraction"
            aria-selected={activeTab === 'extraction'}
            aria-controls="panel-extraction"
            onClick={() => setActiveTab('extraction')}
            className={`pb-3 border-b-2 text-sm ${activeTab === 'extraction' ? 'border-[#0077c8] text-slate-800 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-700 font-medium'}`}
          >
            Data Extraction
          </button>
          <button
            role="tab"
            id="tab-activity"
            aria-selected={activeTab === 'activity'}
            aria-controls="panel-activity"
            onClick={() => setActiveTab('activity')}
            className={`pb-3 border-b-2 text-sm ${activeTab === 'activity' ? 'border-[#0077c8] text-slate-800 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-700 font-medium'}`}
          >
            Activity
          </button>
          <button
            role="tab"
            aria-selected={false}
            onClick={() => onNavigateToTemplates?.()}
            className="pb-3 border-b-2 border-transparent text-slate-500 hover:text-slate-700 font-medium text-sm"
          >
            File Index Templates
          </button>
        </div>
      </header>

      {/* Activity Tab */}
      {activeTab === 'activity' && <ActivityTab />}

      {/* Data Extraction Tab */}
      {activeTab === 'extraction' && (
        <div role="tabpanel" id="panel-extraction" aria-labelledby="tab-extraction" className="flex-1 p-6 overflow-auto">
          <div className="bg-white rounded shadow-sm border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-base font-bold text-slate-700">Uploaded Batches</h2>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="bg-[#0077c8] hover:bg-[#0066b0] text-white px-4 py-1.5 rounded text-xs font-bold flex items-center shadow-sm"
              >
                <Plus size={14} className="mr-1.5" strokeWidth={3} aria-hidden="true" />
                Upload
              </button>
            </div>

            <table className="w-full text-xs text-left">
              <thead className="bg-[#f8fafc] text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th scope="col" className="px-5 py-3 w-1/3">Batch Name</th>
                  <th scope="col" className="px-5 py-3">Upload Status</th>
                  <th scope="col" className="px-5 py-3">Total Files</th>
                  <th scope="col" className="px-5 py-3">Total Documents</th>
                  <th scope="col" className="px-5 py-3">Upload Date</th>
                  <th scope="col" className="px-5 py-3 w-10"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_BATCHES.map((batch) => (
                  <tr key={batch.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => batch.status === 'Complete' ? onNavigateToDetails(batch.id) : null}
                        aria-disabled={batch.status !== 'Complete'}
                        className={`font-medium text-left truncate max-w-xs ${batch.status === 'Complete' ? 'text-[#0077c8] hover:underline' : 'text-slate-700 cursor-default'}`}
                      >
                        {batch.name}
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                        batch.status === 'Complete'
                          ? 'bg-[#e6f4ea] text-[#1e8e3e]'
                          : 'bg-slate-200 text-slate-600'
                      }`}>
                        {batch.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 font-medium">{batch.status === 'In progress' ? '--' : (batch.totalFiles || '-')}</td>
                    <td className="px-5 py-3.5 text-slate-600 font-medium">{batch.status === 'In progress' ? '--' : (batch.totalDocuments || '-')}</td>
                    <td className="px-5 py-3.5 text-slate-600 font-medium">{batch.uploadDate}</td>
                    <td className="px-5 py-3.5">
                      <button aria-label={`More options for ${batch.name}`} className="text-slate-400 hover:text-slate-600">
                        <MoreVertical size={16} aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <nav aria-label="Batch list pagination" className="px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
              <div className="flex items-center space-x-6">
                <div className="flex space-x-1 text-slate-400" role="group" aria-label="Page navigation">
                  <button aria-label="First page" className="hover:text-slate-600">{'<<'}</button>
                  <button aria-label="Previous page" className="hover:text-slate-600">{'<'}</button>
                  <button aria-label="Next page" className="hover:text-slate-600">{'>'}</button>
                  <button aria-label="Last page" className="hover:text-slate-600">{'>>'}</button>
                </div>
                <span>Page 1 of 2</span>
                <span>Rows 1-10 of 20</span>
              </div>
              <div className="flex items-center space-x-2">
                <label htmlFor="rows-per-page-batchlist">Rows per page</label>
                <select id="rows-per-page-batchlist" className="border border-slate-300 rounded p-1 bg-white focus:outline-none focus:border-[#0077c8]">
                  <option>10</option>
                </select>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-[1px]" role="presentation">
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="upload-modal-title"
            className="bg-white rounded shadow-2xl w-[650px] max-w-full overflow-hidden"
          >
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200">
              <h3 id="upload-modal-title" className="text-base font-bold text-slate-800">{uploadStep === 'fileSelected' ? 'Upload Batch' : 'Upload'}</h3>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-400 hover:text-slate-600" aria-label="Close upload dialog">
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <div className="p-8">
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-700 mb-2">Select Your File *</label>

                {uploadStep === 'initial' ? (
                  <div
                    onClick={handleFileSelect}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleFileSelect(); } }}
                    role="button"
                    tabIndex={0}
                    aria-label="Select a file to upload. Drag and drop or press Enter to browse."
                    className="border-2 border-dashed border-slate-300 rounded-lg h-40 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full border-2 border-[#0077c8] flex items-center justify-center mb-3 text-[#0077c8] group-hover:scale-110 transition-transform" aria-hidden="true">
                      <ArrowUp size={20} strokeWidth={2.5} />
                    </div>
                    <p className="text-xs text-slate-600 font-medium">Drag and Drop Your File Here or <span className="text-[#0077c8] font-bold">Browse to Select</span></p>
                  </div>
                ) : (
                  <div className="border border-slate-200 rounded p-3 flex items-center justify-between bg-slate-50">
                    <div className="flex items-center space-x-3 overflow-hidden">
                       <div className="bg-white p-1.5 border border-slate-200 rounded" aria-hidden="true">
                         <FileText size={16} className="text-[#0077c8]" />
                       </div>
                       <span className="text-xs text-slate-700 font-medium truncate">FCI - Final Loan Package - Loan 2024128_3_Generated_1748359257335.pdf</span>
                    </div>
                    <button onClick={() => setUploadStep('initial')} className="text-slate-400 hover:text-red-500" aria-label="Remove selected file">
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </div>
                )}
                <p className="text-[10px] text-slate-400 mt-2">Supported Format(s): .zip, .pdf and TIFF</p>
              </div>

              <div className="grid grid-cols-1 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Upload to: *</label>
                  <div className="flex space-x-6">
                    <label className="flex items-center space-x-2 cursor-pointer group">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedBatchType === 'new' ? 'border-[#0077c8]' : 'border-slate-300'}`} aria-hidden="true">
                        {selectedBatchType === 'new' && <div className="w-2 h-2 rounded-full bg-[#0077c8]"></div>}
                      </div>
                      <input
                        type="radio"
                        name="batchType"
                        value="new"
                        checked={selectedBatchType === 'new'}
                        onChange={() => setSelectedBatchType('new')}
                        className="sr-only"
                      />
                      <span className="text-xs text-slate-700 font-medium">New Batch</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer group">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedBatchType === 'existing' ? 'border-[#0077c8]' : 'border-slate-300'}`} aria-hidden="true">
                        {selectedBatchType === 'existing' && <div className="w-2 h-2 rounded-full bg-[#0077c8]"></div>}
                      </div>
                      <input
                        type="radio"
                        name="batchType"
                        value="existing"
                        checked={selectedBatchType === 'existing'}
                        onChange={() => setSelectedBatchType('existing')}
                        className="sr-only"
                      />
                      <span className="text-xs text-slate-700 font-medium">Existing Batch</span>
                    </label>
                  </div>
                </div>

                {selectedBatchType === 'new' ? (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                      <label htmlFor="new-batch-name" className="block text-[10px] font-bold text-slate-500 mb-1">Batch Name *</label>
                      <input id="new-batch-name" type="text" aria-required="true" placeholder={uploadStep === 'fileSelected' ? 'Carrington Transfer 2025' : ''} className="w-full border border-slate-300 rounded-sm p-2 text-xs text-slate-700 focus:border-[#0077c8] outline-none" defaultValue={uploadStep === 'fileSelected' ? 'Carrington Transfer 2025' : ''} />
                    </div>
                    <div className="col-span-1">
                      <label htmlFor="new-batch-id" className="block text-[10px] font-bold text-slate-500 mb-1">Batch ID</label>
                      <input id="new-batch-id" type="text" className="w-full border border-slate-300 rounded-sm p-2 text-xs text-slate-700 focus:border-[#0077c8] outline-none" defaultValue={uploadStep === 'fileSelected' ? 'AI-011525' : ''} />
                    </div>
                    <div className="col-span-1">
                      <label htmlFor="new-batch-desc" className="block text-[10px] font-bold text-slate-500 mb-1">Description</label>
                      <input id="new-batch-desc" type="text" className="w-full border border-slate-300 rounded-sm p-2 text-xs text-slate-700 focus:border-[#0077c8] outline-none" />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                     <div className="col-span-1 relative">
                        <label htmlFor="existing-batch-select" className="block text-[10px] font-bold text-slate-500 mb-1">Batch Name *</label>
                        <div
                          id="existing-batch-select"
                          role="combobox"
                          aria-expanded={showBatchDropdown}
                          aria-haspopup="listbox"
                          aria-label="Select batch"
                          tabIndex={0}
                          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setShowBatchDropdown(!showBatchDropdown); } }}
                          className="w-full border border-slate-300 rounded-sm p-2 text-xs text-slate-700 flex justify-between items-center cursor-pointer bg-white"
                          onClick={() => setShowBatchDropdown(!showBatchDropdown)}
                        >
                           <span>--Select Batch--</span>
                           <ChevronDown size={12} aria-hidden="true" />
                        </div>
                        {showBatchDropdown && (
                           <div role="listbox" className="absolute top-full left-0 w-full bg-white border border-slate-200 shadow-lg rounded mt-1 z-10 max-h-40 overflow-y-auto">
                              {MOCK_BATCHES.map(b => (
                                 <div key={b.id} role="option" aria-selected={false} className="px-3 py-2 hover:bg-slate-50 text-xs cursor-pointer" onClick={() => setShowBatchDropdown(false)}>
                                    {b.name}
                                 </div>
                              ))}
                           </div>
                        )}
                     </div>
                     <div className="col-span-1">
                      <label htmlFor="existing-batch-id" className="block text-[10px] font-bold text-slate-500 mb-1">Batch ID</label>
                      <input id="existing-batch-id" type="text" className="w-full border border-slate-300 rounded-sm p-2 text-xs bg-slate-50 text-slate-500" disabled aria-disabled="true" />
                    </div>
                    <div className="col-span-1">
                      <label htmlFor="existing-batch-desc" className="block text-[10px] font-bold text-slate-500 mb-1">Description</label>
                      <input id="existing-batch-desc" type="text" className="w-full border border-slate-300 rounded-sm p-2 text-xs bg-slate-50 text-slate-500" disabled aria-disabled="true" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex justify-end space-x-3 bg-slate-50/50">
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="px-6 py-2 border border-slate-300 rounded-sm text-xs font-bold text-slate-600 hover:bg-white hover:border-slate-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                className="px-6 py-2 bg-[#0077c8] hover:bg-[#0066b0] text-white rounded-sm text-xs font-bold transition-colors shadow-sm"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
