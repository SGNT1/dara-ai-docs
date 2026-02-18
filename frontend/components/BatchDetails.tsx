import React, { useState, useCallback } from 'react';
import { Search, MoreVertical, Upload, ExternalLink, ChevronLeft, ChevronRight, Filter, ArrowUpDown } from 'lucide-react';
import { MOCK_BATCH_FILES, MOCK_BATCHES } from '../constants';
import { ResizeDivider } from './ResizeDivider';

interface BatchDetailsProps {
  selectedBatchId: string | null;
  onNavigateToReport: () => void;
  onNavigateToDocument: (fileId: string) => void;
  onBack: () => void;
  onSelectBatch: (batchId: string) => void;
}

export const BatchDetails: React.FC<BatchDetailsProps> = ({
  selectedBatchId,
  onNavigateToReport,
  onNavigateToDocument,
  onBack,
  onSelectBatch
}) => {
  const activeBatch = MOCK_BATCHES.find(b => b.id === selectedBatchId) || MOCK_BATCHES[0];
  const [leftWidth, setLeftWidth] = useState(60);
  const handleResize = useCallback((delta: number) => {
    setLeftWidth(prev => Math.min(80, Math.max(30, prev + (delta / window.innerWidth) * 100)));
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#f4f7fa]">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 lg:px-6 pt-4 pb-0">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center text-xs text-slate-500 mb-2 font-medium list-none p-0">
            <li><span className="text-[#0077c8]">AI Docs</span></li>
            <li aria-hidden="true" className="mx-2">/</li>
            <li aria-current="page"><span className="text-slate-800">Document Management</span></li>
          </ol>
        </nav>
        <h1 className="text-xl font-bold text-slate-800 mb-4">AI Docs</h1>

        <div className="flex space-x-8" role="tablist" aria-label="AI Docs views">
          <button role="tab" aria-selected="true" className="pb-3 border-b-2 border-[#0077c8] text-slate-800 font-semibold text-sm">Batch Processing</button>
          <button role="tab" aria-selected="false" className="pb-3 border-b-2 border-transparent text-slate-500 hover:text-slate-700 font-medium text-sm">Activity</button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 p-4 lg:p-6 overflow-hidden flex">
        {/* Left Panel: Batches List */}
        <div style={{ width: `${leftWidth}%` }} className="min-w-0 bg-white rounded shadow-sm border border-slate-200 flex flex-col flex-shrink-0">
           <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center">
              <h2 className="font-bold text-base text-slate-800">Batches</h2>
              <button className="bg-[#0077c8] text-white text-xs font-bold px-4 py-2 rounded flex items-center hover:bg-[#0066b0] transition-colors">
                 <Upload size={14} className="mr-2" strokeWidth={2.5} aria-hidden="true"/> Upload
              </button>
           </div>
           <div className="overflow-auto flex-1">
              <table className="w-full text-xs text-left">
                 <thead className="bg-white text-slate-800 font-bold border-b border-slate-200 sticky top-0 z-10">
                    <tr>
                       <th scope="col" className="px-4 py-3 w-8"><span className="sr-only">Selected</span></th>
                       <th scope="col" className="px-4 py-3">Name</th>
                       <th scope="col" className="px-4 py-3">Upload Status</th>
                       <th scope="col" className="px-4 py-3">Total Files</th>
                       <th scope="col" className="px-4 py-3">Total Documents</th>
                       <th scope="col" className="px-4 py-3"><span className="flex items-center">Upload Date <ArrowUpDown size={12} className="ml-1 text-slate-400" aria-hidden="true"/></span></th>
                       <th scope="col" className="px-4 py-3 w-8"><span className="sr-only">Actions</span></th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {MOCK_BATCHES.map((batch) => {
                       const isActive = batch.id === activeBatch.id;
                       return (
                         <tr
                           key={batch.id}
                           role="radio"
                           aria-checked={isActive}
                           onClick={() => onSelectBatch(batch.id)}
                           onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectBatch(batch.id); } }}
                           tabIndex={0}
                           className={`hover:bg-slate-50 cursor-pointer transition-colors ${isActive ? 'bg-sky-50/30' : ''}`}
                         >
                            <td className="px-4 py-4">
                               <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isActive ? 'border-[#0077c8]' : 'border-slate-300'}`} aria-hidden="true">
                                  {isActive && <div className="w-2 h-2 rounded-full bg-[#0077c8]"></div>}
                               </div>
                            </td>
                            <td className={`px-4 py-4 font-medium ${isActive ? 'text-[#0077c8]' : 'text-[#0077c8]'} underline`}>{batch.name}</td>
                            <td className="px-4 py-4">
                               <span className={`px-3 py-1 rounded text-[10px] font-bold text-white ${
                                  batch.status === 'Complete' ? 'bg-[#1e8e3e]' : 'bg-slate-600'
                               }`}>
                                  {batch.status}
                               </span>
                            </td>
                            <td className="px-4 py-4 text-slate-600">{batch.totalFiles || '--'}</td>
                            <td className="px-4 py-4 text-slate-600">{batch.totalDocuments || '--'}</td>
                            <td className="px-4 py-4 text-slate-600">{batch.uploadDate}</td>
                            <td className="px-4 py-4">
                               <button aria-label={`More options for ${batch.name}`} className="text-slate-400 hover:text-slate-600">
                                  <MoreVertical size={16} aria-hidden="true"/>
                               </button>
                            </td>
                         </tr>
                       );
                    })}
                 </tbody>
              </table>
           </div>
           <nav aria-label="Batch list pagination" className="p-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <div className="flex space-x-2">
                 <button aria-label="First page" className="hover:text-slate-700">{'<<'}</button>
                 <button aria-label="Previous page" className="hover:text-slate-700">{'<'}</button>
                 <button aria-label="Next page" className="hover:text-slate-700">{'>'}</button>
                 <button aria-label="Last page" className="hover:text-slate-700">{'>>'}</button>
              </div>
              <div className="flex space-x-4">
                 <span>Page 1 of 2</span>
                 <span>Rows 1-10 of 20</span>
                 <div className="flex items-center space-x-2">
                    <label htmlFor="batch-rows-per-page">Rows per page</label>
                    <select id="batch-rows-per-page" className="border border-slate-300 rounded p-1 bg-white">
                       <option>10</option>
                    </select>
                 </div>
              </div>
           </nav>
        </div>

        <ResizeDivider onResize={handleResize} />

        {/* Right Panel: Details & Files */}
        <div className="flex-1 min-w-0 flex flex-col space-y-4 overflow-hidden">
           {/* Stats Card */}
           <div className="bg-white rounded shadow-sm border border-slate-200 p-5 flex-shrink-0">
              <div className="flex justify-between items-start mb-4 border-b border-slate-100 pb-2">
                 <h2 className="text-base font-bold text-slate-800">{activeBatch.name}</h2>
              </div>

              <dl className="grid grid-cols-1 xl:grid-cols-2 gap-x-8 gap-y-3 text-xs">
                 <div className="flex justify-between"><dt className="text-slate-800 font-bold">Batch Uploaded Date</dt> <dd className="text-slate-600">{activeBatch.uploadDate}</dd></div>
                 <div className="flex justify-between"><dt className="text-slate-800 font-bold">Duplicated Documents</dt> <dd className="text-slate-600">0</dd></div>

                 <div className="flex justify-between"><dt className="text-slate-800 font-bold">Total Files</dt> <dd className="text-slate-600">{activeBatch.totalFiles || 0}</dd></div>
                 <div className="flex justify-between"><dt className="text-slate-800 font-bold">Total Failures</dt> <dd className="text-slate-600">30</dd></div>

                 <div className="flex justify-between"><dt className="text-slate-800 font-bold">Total Documents</dt> <dd className="text-slate-600">{activeBatch.totalDocuments || 0}</dd></div>
                 <div className="flex justify-between items-center">
                    <dt className="text-slate-800 font-bold">Process Report</dt>
                    <dd><button onClick={onNavigateToReport} className="text-[#0077c8] hover:underline font-medium">Open</button></dd>
                 </div>

                 <div className="flex justify-between"><dt className="text-slate-800 font-bold">Classified Documents</dt> <dd className="text-slate-600">1,200</dd></div>
                 <div className="flex justify-between"><dt className="text-slate-800 font-bold">Unknown Documents</dt> <dd className="text-slate-600">56</dd></div>

                 <div className="flex justify-between"><dt className="text-slate-800 font-bold">Unknown Documents</dt> <dd className="text-slate-600">20</dd></div>
              </dl>
           </div>

           {/* Files List */}
           <div className="bg-white rounded shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200">
                 <h3 className="font-bold text-base text-slate-800 mb-3">Batch Files</h3>
                 <div className="relative">
                    <label htmlFor="batch-file-search" className="sr-only">Search batch files</label>
                    <input id="batch-file-search" type="text" placeholder="Search" className="w-64 pl-3 pr-8 py-2 border border-slate-300 rounded text-xs focus:border-[#0077c8] outline-none" />
                    <Search size={14} className="absolute right-2.5 top-2.5 text-slate-400" aria-hidden="true" />
                 </div>
              </div>

              <div className="flex-1 overflow-auto">
                 <table className="w-full text-xs text-left">
                    <thead className="bg-white text-slate-800 font-bold border-b border-slate-200 sticky top-0 z-10">
                       <tr>
                          <th scope="col" className="px-5 py-3"><span className="flex items-center">Processed File Name <ArrowUpDown size={12} className="ml-1 text-slate-400" aria-hidden="true"/> <Filter size={12} className="ml-1 text-slate-400" aria-hidden="true"/></span></th>
                          <th scope="col" className="px-5 py-3"><span className="flex items-center">Total Documents <ArrowUpDown size={12} className="ml-1 text-slate-400" aria-hidden="true"/> <Filter size={12} className="ml-1 text-slate-400" aria-hidden="true"/></span></th>
                          <th scope="col" className="px-5 py-3 w-10"><span className="sr-only">Actions</span></th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {MOCK_BATCH_FILES.map((file) => (
                          <tr key={file.id} className="hover:bg-slate-50 transition-colors">
                             <td className="px-5 py-3">
                                <button
                                   onClick={() => onNavigateToDocument(file.id)}
                                   className="text-[#0077c8] hover:underline font-medium"
                                >
                                   {file.name}
                                </button>
                             </td>
                             <td className="px-5 py-3 text-slate-600">{file.totalDocuments}</td>
                             <td className="px-5 py-3">
                                <button aria-label={`More options for ${file.name}`} className="text-slate-400 cursor-pointer hover:text-slate-600">
                                   <MoreVertical size={16} aria-hidden="true"/>
                                </button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>

              <div className="px-5 py-3 border-t border-slate-200 text-xs text-slate-500 flex flex-col space-y-2">
                 <span>Rows 6-10 of 2894</span>
                 <button className="w-full border border-slate-300 rounded py-2 text-[#0077c8] font-bold flex items-center justify-center hover:bg-slate-50 transition-colors">
                    View Full Page <ExternalLink size={12} className="ml-1" aria-hidden="true"/>
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
