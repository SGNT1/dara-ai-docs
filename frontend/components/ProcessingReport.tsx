import React, { useState, useCallback } from 'react';
import { Search, Download, ChevronLeft, ChevronRight, Check, X, FileText, Plus, ArrowUpDown, Filter, Info, Minus, Copy, ExternalLink, Maximize } from 'lucide-react';
import { MOCK_BATCH_FILES, MOCK_BATCHES } from '../constants';
import { ResizeDivider } from './ResizeDivider';

interface ProcessingReportProps {
  selectedBatchId: string | null;
  onBack: () => void;
}

export const ProcessingReport: React.FC<ProcessingReportProps> = ({ selectedBatchId, onBack }) => {
  const activeBatch = MOCK_BATCHES.find(b => b.id === selectedBatchId) || MOCK_BATCHES[0];
  const [leftWidth, setLeftWidth] = useState(45);
  const handleResize = useCallback((delta: number) => {
    setLeftWidth(prev => Math.min(70, Math.max(25, prev + (delta / window.innerWidth) * 100)));
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
          <button role="tab" aria-selected="true" onClick={onBack} className="pb-3 border-b-2 border-[#0077c8] text-slate-800 font-semibold text-sm">Batch Processing</button>
          <button role="tab" aria-selected="false" className="pb-3 border-b-2 border-transparent text-slate-500 hover:text-slate-700 font-medium text-sm">Activity</button>
        </div>
      </header>

      {/* Breadcrumb Sub-header */}
      <nav aria-label="File breadcrumb" className="bg-white border-b border-slate-200 px-6 py-3">
        <ol className="flex items-center text-xs font-bold list-none p-0">
          <li><button className="text-[#0077c8] cursor-pointer hover:underline" onClick={onBack}>Batches</button></li>
          <li aria-hidden="true" className="mx-2 text-slate-400">/</li>
          <li aria-current="page"><span className="text-slate-800">{activeBatch.name}</span></li>
        </ol>
      </nav>

      {/* Content */}
      <div className="flex-1 p-4 lg:p-6 overflow-hidden flex">
        {/* Left Panel: File List */}
        <div style={{ width: `${leftWidth}%` }} className="min-w-0 bg-white rounded shadow-sm border border-slate-200 flex flex-col flex-shrink-0">
           <div className="px-4 py-4 border-b border-slate-200 flex justify-between items-center">
              <h2 className="font-bold text-lg text-slate-800">{activeBatch.name}</h2>
              <button className="bg-[#0077c8] text-white text-xs font-bold px-4 py-2 rounded flex items-center hover:bg-[#0066b0] transition-colors">
                 <Plus size={14} className="mr-2" strokeWidth={2.5} aria-hidden="true"/> Add Document
              </button>
           </div>
           <div className="p-4 border-b border-slate-200">
              <div className="relative">
                 <label htmlFor="report-file-search" className="sr-only">Search files</label>
                 <input id="report-file-search" type="text" placeholder="Search" className="w-full pl-3 pr-8 py-2 border border-slate-300 rounded text-xs focus:border-[#0077c8] outline-none" />
                 <Search size={16} className="absolute right-2.5 top-2 text-slate-400" aria-hidden="true" />
              </div>
           </div>

           <div className="flex-1 overflow-auto">
              <table className="w-full text-[11px] text-left">
                 <thead className="bg-white text-slate-800 font-bold sticky top-0 border-b border-slate-200 z-10">
                    <tr>
                       <th scope="col" className="px-3 py-3 w-6"><span className="sr-only">Selected</span></th>
                       <th scope="col" className="px-2 py-3">Processed File Name</th>
                       <th scope="col" className="px-2 py-3">Total Documents</th>
                       <th scope="col" className="px-2 py-3"><span className="flex items-center">Classified <ArrowUpDown size={10} className="ml-1" aria-hidden="true"/><Filter size={10} className="ml-1" aria-hidden="true"/></span></th>
                       <th scope="col" className="px-2 py-3"><span className="flex items-center">Unknown <ArrowUpDown size={10} className="ml-1" aria-hidden="true"/><Filter size={10} className="ml-1" aria-hidden="true"/></span></th>
                       <th scope="col" className="px-2 py-3"><span className="flex items-center">Duplicates <ArrowUpDown size={10} className="ml-1" aria-hidden="true"/><Filter size={10} className="ml-1" aria-hidden="true"/></span></th>
                       <th scope="col" className="px-2 py-3"><span className="flex items-center">Failures <ArrowUpDown size={10} className="ml-1" aria-hidden="true"/><Filter size={10} className="ml-1" aria-hidden="true"/></span></th>
                       <th scope="col" className="px-2 py-3 w-6"><span className="sr-only">Sort</span></th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {MOCK_BATCH_FILES.map((file, idx) => (
                       <tr
                         key={file.id}
                         role="radio"
                         aria-checked={idx === 0}
                         tabIndex={0}
                         className={`hover:bg-slate-50 transition-colors cursor-pointer ${idx === 0 ? 'bg-sky-50/30' : ''}`}
                       >
                          <td className="px-3 py-3">
                             <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${idx === 0 ? 'border-[#0077c8]' : 'border-slate-300'}`} aria-hidden="true">
                                {idx === 0 && <div className="w-2 h-2 rounded-full bg-[#0077c8]"></div>}
                             </div>
                          </td>
                          <td className={`px-2 py-3 font-medium ${idx === 0 ? 'text-[#0077c8]' : 'text-slate-700'}`}>{file.name}</td>
                          <td className="px-2 py-3 text-slate-600">{file.totalDocuments}</td>
                          <td className="px-2 py-3 text-slate-600">{file.classified}</td>
                          <td className="px-2 py-3 text-slate-600">{file.unknown}</td>
                          <td className="px-2 py-3 text-slate-600">{file.duplicates}</td>
                          <td className="px-2 py-3 text-slate-600">{file.failures}</td>
                          <td className="px-2 py-3 text-slate-400"><ArrowUpDown size={14} aria-hidden="true"/></td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
           <nav aria-label="File list pagination" className="p-3 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
              <div className="flex space-x-2">
                 <button aria-label="First page" className="hover:text-slate-700">{'<<'}</button>
                 <button aria-label="Previous page" className="hover:text-slate-700">{'<'}</button>
                 <button aria-label="Next page" className="hover:text-slate-700">{'>'}</button>
                 <button aria-label="Last page" className="hover:text-slate-700">{'>>'}</button>
              </div>
              <div className="flex space-x-4">
                 <span>Page 1 of 1</span>
                 <span>Rows 1-16 of 16</span>
                 <div className="flex items-center space-x-2">
                    <label htmlFor="report-rows-per-page">Rows per page</label>
                    <select id="report-rows-per-page" className="border border-slate-300 rounded p-1 bg-white">
                       <option>20</option>
                    </select>
                 </div>
              </div>
           </nav>
        </div>

        <ResizeDivider onResize={handleResize} />

        {/* Right Panel: Report */}
        <div className="flex-1 min-w-0 bg-white rounded shadow-sm border border-slate-200 flex flex-col overflow-hidden">
           <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800">Processing Report</h3>
              <button className="text-[#0077c8] border border-[#0077c8] px-4 py-2 rounded text-xs font-bold flex items-center hover:bg-sky-50 transition-colors">
                 <Download size={14} className="mr-2" aria-hidden="true" /> Download
              </button>
           </div>

           <div className="flex-1 overflow-auto p-6 bg-slate-50">
              {/* Toolbar */}
              <div className="flex justify-center items-center space-x-4 mb-4 bg-white p-2 rounded border border-slate-200 w-fit mx-auto" role="toolbar" aria-label="Report viewer controls">
                 <button aria-label="Previous page" className="p-1 hover:bg-slate-100 rounded"><ChevronLeft size={16} className="text-slate-500" aria-hidden="true"/></button>
                 <span className="text-xs text-slate-600">Page <span className="border border-slate-300 px-2 py-0.5 rounded">1</span> of 2</span>
                 <button aria-label="Next page" className="p-1 hover:bg-slate-100 rounded"><ChevronRight size={16} className="text-slate-500" aria-hidden="true"/></button>
                 <div className="h-4 w-px bg-slate-300" aria-hidden="true"></div>
                 <button aria-label="Zoom out" className="p-1 hover:bg-slate-100 rounded"><Minus size={16} className="text-slate-500" aria-hidden="true"/></button>
                 <span className="text-xs text-slate-600 border border-slate-300 px-2 py-0.5 rounded">100%</span>
                 <button aria-label="Zoom in" className="p-1 hover:bg-slate-100 rounded"><Plus size={16} className="text-slate-500" aria-hidden="true"/></button>
                 <div className="h-4 w-px bg-slate-300" aria-hidden="true"></div>
                 <button aria-label="Full screen" className="p-1 hover:bg-slate-100 rounded"><Maximize size={16} className="text-slate-500" aria-hidden="true"/></button>
                 <button aria-label="Copy" className="p-1 hover:bg-slate-100 rounded"><Copy size={16} className="text-slate-500" aria-hidden="true"/></button>
                 <button aria-label="Open in new tab" className="p-1 hover:bg-slate-100 rounded"><ExternalLink size={16} className="text-slate-500" aria-hidden="true"/></button>
              </div>

              <div className="flex space-x-4 mx-auto">
              <div className="border border-slate-200 shadow-sm p-10 flex-1 bg-white min-h-[800px]">
                 {/* Report Header */}
                 <div className="flex justify-between items-start mb-8 border-b-4 border-[#0077c8] pb-4">
                    <div className="flex items-center text-[#0077c8] font-bold text-2xl">
                       <div className="mr-2">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" role="img" aria-label="Dara logo"><title>Dara logo</title><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
                       </div>
                       dara
                    </div>
                    <div className="text-[10px] font-medium text-slate-500">Processed by Dara AI Docs</div>
                 </div>

                 <h2 className="text-lg font-bold text-slate-800 mb-6">508233-Retail Servicing File</h2>

                 <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="border border-slate-200 rounded p-4">
                       <h4 className="text-xs font-bold text-slate-800 mb-3 flex items-center"><Info size={14} className="mr-2 text-slate-400" aria-hidden="true"/> Processing Summary</h4>
                       <div className="text-[10px] space-y-2">
                          <div className="grid grid-cols-2"><span className="text-slate-500 font-bold">Folder</span> <span className="text-[#0077c8]">Retail Servicing/508233</span></div>
                          <div className="grid grid-cols-2"><span className="text-slate-500 font-bold">File Uploaded</span> <span className="text-[#0077c8] underline">508233 - Retail Servicing.pdf</span></div>
                          <div className="grid grid-cols-2"><span className="text-slate-500 font-bold">Processing finished Date</span> <span className="text-slate-700">10/20/2025</span></div>
                          <div className="grid grid-cols-2"><span className="text-slate-500 font-bold">Processing Report File</span> <span className="text-[#0077c8] underline cursor-pointer">Open report</span></div>
                       </div>
                    </div>
                    <div className="border border-slate-200 rounded p-4">
                       <h4 className="text-xs font-bold text-slate-800 mb-3 flex items-center"><Info size={14} className="mr-2 text-slate-400" aria-hidden="true"/> Results Summary</h4>
                       <div className="text-[10px] space-y-2">
                          <div className="grid grid-cols-2"><span className="text-slate-500 font-bold">Processed Pages</span> <span className="text-slate-700">1,250 pages</span></div>
                          <div className="grid grid-cols-2"><span className="text-slate-500 font-bold">Classified Documents</span> <span className="text-slate-700">1,110/1,250</span></div>
                          <div className="grid grid-cols-2"><span className="text-slate-500 font-bold">Failed Processing Documents</span> <span className="text-slate-700">140/1,250</span></div>
                       </div>
                    </div>
                 </div>

                 <div className="bg-[#eef6fc] px-4 py-2 mb-0">
                    <h4 className="text-xs font-bold text-slate-800">125 Extracted Documents</h4>
                 </div>
                 <table className="w-full text-[10px] text-left mb-8">
                    <thead className="text-slate-500 font-bold border-b border-slate-200 bg-white">
                       <tr>
                          <th scope="col" className="py-2 pl-2">Document Name</th>
                          <th scope="col" className="py-2">Page</th>
                          <th scope="col" className="py-2 text-center">Signature</th>
                          <th scope="col" className="py-2 text-center">Stamp</th>
                          <th scope="col" className="py-2">PDF</th>
                          <th scope="col" className="py-2">JSON</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {[
                          {name: 'Finalization Guidelines', page: 342, sig: true, stamp: true},
                          {name: 'Project Completion Checklist', page: 789, sig: true, stamp: true},
                          {name: 'Document Title', page: 215, sig: true, stamp: false},
                          {name: 'File Name', page: 456, sig: false, stamp: false},
                          {name: 'Report Title', page: 1023, sig: false, stamp: false},
                          {name: 'Summary Document', page: 678, sig: false, stamp: true, fail: true},
                          {name: 'Analysis Report', page: 934, sig: true, stamp: false},
                          {name: 'Presentation Outline', page: 118, sig: true, stamp: false},
                          {name: 'Meeting Notes', page: 845, sig: true, stamp: false},
                       ].map((row, i) => (
                          <tr key={i} className="hover:bg-slate-50">
                             <td className="py-2.5 pl-2 text-slate-700 font-medium">{row.name}</td>
                             <td className="py-2.5 text-slate-500">{row.page}</td>
                             <td className="py-2.5 text-center">{row.sig ? <Check size={12} className="text-slate-500 inline" aria-label="Yes"/> : (row.fail ? <X size={12} className="text-red-500 inline" aria-label="Failed"/> : <span aria-label="No"></span>)}</td>
                             <td className="py-2.5 text-center">{row.stamp ? <Check size={12} className="text-slate-500 inline" aria-label="Yes"/> : <span aria-label="No"></span>}</td>
                             <td className="py-2.5 text-[#0077c8] font-bold cursor-pointer underline">Open PDF</td>
                             <td className="py-2.5 text-[#0077c8] font-bold cursor-pointer underline">Open JSON</td>
                          </tr>
                       ))}
                    </tbody>
                 </table>

                 <div className="bg-[#eef6fc] px-4 py-2 mb-0">
                    <h4 className="text-xs font-bold text-slate-800">2 Duplicate Documents</h4>
                 </div>
                 <table className="w-full text-[10px] text-left">
                    <thead className="text-slate-500 font-bold border-b border-slate-200 bg-white">
                       <tr>
                          <th scope="col" className="py-2 pl-2">Document Name</th>
                          <th scope="col" className="py-2">Original</th>
                          <th scope="col" className="py-2">Duplicate</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       <tr>
                          <td className="py-2.5 pl-2 text-slate-700 font-medium">Finalization Guidelines</td>
                          <td className="py-2.5 text-[#0077c8] font-bold cursor-pointer underline">Open</td>
                          <td className="py-2.5 text-[#0077c8] font-bold cursor-pointer underline">Open</td>
                       </tr>
                       <tr>
                          <td className="py-2.5 pl-2 text-slate-700 font-medium">Project Completion Checklist</td>
                          <td className="py-2.5 text-[#0077c8] font-bold cursor-pointer underline">Open</td>
                          <td className="py-2.5 text-[#0077c8] font-bold cursor-pointer underline">Open</td>
                       </tr>
                    </tbody>
                 </table>
              </div>

              {/* Page Thumbnails */}
              <div className="w-24 flex-shrink-0">
                 <h4 className="text-[10px] font-bold text-slate-600 mb-2">Pages (2)</h4>
                 <div className="space-y-2">
                    <button aria-label="Page 1" aria-current="page" className="border-2 border-[#0077c8] rounded cursor-pointer w-full">
                       <div className="bg-white h-28 w-full rounded-sm flex items-center justify-center">
                          <span className="text-[8px] text-slate-400">Page 1</span>
                       </div>
                    </button>
                    <button aria-label="Page 2" className="border border-slate-200 rounded cursor-pointer hover:border-slate-400 w-full">
                       <div className="bg-white h-28 w-full rounded-sm flex items-center justify-center">
                          <span className="text-[8px] text-slate-400">Page 2</span>
                       </div>
                    </button>
                 </div>
              </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
