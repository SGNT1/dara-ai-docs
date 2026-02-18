import React, { useState, useCallback } from 'react';
import { Search, MoreVertical, Download, ChevronLeft, ChevronRight, Minus, Plus, Maximize, Plus as PlusIcon, ArrowUpDown, Filter, Copy, ExternalLink } from 'lucide-react';
import { MOCK_DOCUMENTS, MOCK_BATCH_FILES, MOCK_BATCHES } from '../constants';
import { ResizeDivider } from './ResizeDivider';

interface DocumentViewerProps {
  selectedBatchId: string | null;
  selectedFileId: string | null;
  onBack: () => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ selectedBatchId, selectedFileId, onBack }) => {
  const activeBatch = MOCK_BATCHES.find(b => b.id === selectedBatchId) || MOCK_BATCHES[0];
  const activeFile = MOCK_BATCH_FILES.find(f => f.id === selectedFileId) || MOCK_BATCH_FILES[0];
  const [leftWidth, setLeftWidth] = useState(55);
  const handleResize = useCallback((delta: number) => {
    setLeftWidth(prev => Math.min(75, Math.max(30, prev + (delta / window.innerWidth) * 100)));
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
          <li><button className="text-[#0077c8] cursor-pointer hover:underline" onClick={onBack}>{activeBatch.name}</button></li>
          <li aria-hidden="true" className="mx-2 text-slate-400">/</li>
          <li aria-current="page"><span className="text-slate-800">{activeFile.name}</span></li>
        </ol>
      </nav>

      {/* Content */}
      <div className="flex-1 p-4 lg:p-6 overflow-hidden flex">
        {/* Left Panel: Document List */}
        <div style={{ width: `${leftWidth}%` }} className="min-w-0 bg-white rounded shadow-sm border border-slate-200 flex flex-col flex-shrink-0">
           <div className="px-4 py-4 border-b border-slate-200 flex justify-between items-center">
              <h2 className="font-bold text-lg text-slate-800">{activeFile.name}</h2>
              <button className="bg-[#0077c8] text-white text-xs font-bold px-4 py-2 rounded flex items-center hover:bg-[#0066b0] transition-colors">
                 <PlusIcon size={14} className="mr-2" strokeWidth={2.5} aria-hidden="true"/> Add Document
              </button>
           </div>
           <div className="p-4 border-b border-slate-200">
              <div className="relative">
                 <label htmlFor="doc-search" className="sr-only">Search documents</label>
                 <input id="doc-search" type="text" placeholder="Search" className="w-full pl-3 pr-8 py-2 border border-slate-300 rounded text-xs focus:border-[#0077c8] outline-none" />
                 <Search size={16} className="absolute right-2.5 top-2 text-slate-400" aria-hidden="true" />
              </div>
           </div>

           <div className="flex-1 overflow-auto">
              <table className="w-full text-[11px] text-left">
                 <thead className="bg-white text-slate-800 font-bold sticky top-0 border-b border-slate-200 z-10">
                    <tr>
                       <th scope="col" className="px-3 py-3 w-6"><span className="sr-only">Selected</span></th>
                       <th scope="col" className="px-3 py-3">Processed File Name</th>
                       <th scope="col" className="px-2 py-3"><span className="flex items-center">Status <ArrowUpDown size={10} className="ml-1" aria-hidden="true"/><Filter size={10} className="ml-1" aria-hidden="true"/></span></th>
                       <th scope="col" className="px-2 py-3"><span className="flex items-center">Version <ArrowUpDown size={10} className="ml-1" aria-hidden="true"/><Filter size={10} className="ml-1" aria-hidden="true"/></span></th>
                       <th scope="col" className="px-2 py-3"><span className="flex items-center">Extracted Fields <ArrowUpDown size={10} className="ml-1" aria-hidden="true"/><Filter size={10} className="ml-1" aria-hidden="true"/></span></th>
                       <th scope="col" className="px-2 py-3"><span className="flex items-center">Pages <ArrowUpDown size={10} className="ml-1" aria-hidden="true"/><Filter size={10} className="ml-1" aria-hidden="true"/></span></th>
                       <th scope="col" className="px-2 py-3 w-6"><span className="sr-only">Actions</span></th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {MOCK_DOCUMENTS.map((doc, idx) => (
                       <tr
                         key={doc.id}
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
                          <td className={`px-3 py-3 font-medium ${idx === 0 ? 'text-[#0077c8]' : 'text-slate-700'}`}>{doc.name}</td>
                          <td className="px-2 py-3">
                             <span className={`px-2 py-1 rounded text-[10px] font-bold text-white ${
                                doc.status === 'Classified' ? 'bg-[#1e8e3e]' : 'bg-[#f59e0b]'
                             }`}>
                                {doc.status}
                             </span>
                          </td>
                          <td className="px-2 py-3 text-slate-600">{doc.version}</td>
                          <td className="px-2 py-3 text-slate-600">{doc.extractedFields}</td>
                          <td className="px-2 py-3 text-slate-600">{doc.pages}</td>
                          <td className="px-2 py-3">
                             <button aria-label={`More options for ${doc.name}`} className="text-slate-400 hover:text-slate-600">
                                <MoreVertical size={14} aria-hidden="true"/>
                             </button>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
           <nav aria-label="Document list pagination" className="p-3 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
              <div className="flex space-x-2">
                 <button aria-label="First page" className="hover:text-slate-700">{'<<'}</button>
                 <button aria-label="Previous page" className="hover:text-slate-700">{'<'}</button>
                 <button aria-label="Next page" className="hover:text-slate-700">{'>'}</button>
                 <button aria-label="Last page" className="hover:text-slate-700">{'>>'}</button>
              </div>
              <div className="flex space-x-4">
                 <span>Page 1 of 1</span>
                 <span>Rows 1-20 of 20</span>
                 <div className="flex items-center space-x-2">
                    <label htmlFor="doc-rows-per-page">Rows per page</label>
                    <select id="doc-rows-per-page" className="border border-slate-300 rounded p-1 bg-white">
                       <option>20</option>
                    </select>
                 </div>
              </div>
           </nav>
        </div>

        <ResizeDivider onResize={handleResize} />

        {/* Right Panel: Document Preview */}
        <div className="flex-1 min-w-0 bg-white rounded shadow-sm border border-slate-200 flex flex-col overflow-hidden">
           <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800">Document 1</h3>
              <button className="text-[#0077c8] border border-[#0077c8] px-4 py-2 rounded text-xs font-bold flex items-center hover:bg-sky-50 transition-colors">
                 <Download size={14} className="mr-2" aria-hidden="true" /> Download
              </button>
           </div>

           {/* Toolbar */}
           <div className="bg-white border-b border-slate-200 p-2 flex justify-center items-center space-x-4 text-slate-600" role="toolbar" aria-label="Document viewer controls">
              <button aria-label="Previous page" className="p-1 hover:bg-slate-100 rounded"><ChevronLeft size={16} aria-hidden="true"/></button>
              <span className="text-xs font-medium">Page <span className="border border-slate-300 px-2 py-0.5 rounded">1</span> of 2</span>
              <button aria-label="Next page" className="p-1 hover:bg-slate-100 rounded"><ChevronRight size={16} aria-hidden="true"/></button>
              <div className="h-4 w-px bg-slate-300 mx-2" aria-hidden="true"></div>
              <button aria-label="Zoom out" className="p-1 hover:bg-slate-100 rounded"><Minus size={16} aria-hidden="true"/></button>
              <span className="text-xs font-medium border border-slate-300 px-2 py-0.5 rounded">100%</span>
              <button aria-label="Zoom in" className="p-1 hover:bg-slate-100 rounded"><Plus size={16} aria-hidden="true"/></button>
              <div className="h-4 w-px bg-slate-300 mx-2" aria-hidden="true"></div>
              <button aria-label="Full screen" className="p-1 hover:bg-slate-100 rounded"><Maximize size={16} aria-hidden="true"/></button>
              <button aria-label="Copy" className="p-1 hover:bg-slate-100 rounded"><Copy size={16} aria-hidden="true"/></button>
              <button aria-label="Open in new tab" className="p-1 hover:bg-slate-100 rounded"><ExternalLink size={16} aria-hidden="true"/></button>
           </div>

           {/* Document Content (Invoice Mock) */}
           <div className="flex-1 overflow-auto bg-slate-100 p-8 flex justify-center">
              <div className="flex space-x-4">
              <div className="bg-white shadow-lg w-[600px] min-h-[800px] p-10 text-[10px] text-slate-800 font-serif relative">
                 {/* Invoice Header */}
                 <div className="flex justify-between mb-8">
                    <div>
                       <h1 className="font-bold text-sm mb-1">Mortgage Contracting Services, LLC</h1>
                       <p>P.O. Box 737196</p>
                       <p>Dallas, TX 75373 7176</p>
                       <p>Phone No: (813) 874-2177</p>
                       <p>Fax No: (813) 258-5729</p>
                    </div>
                    <div className="text-right">
                       <div className="border border-slate-300 p-2 mb-2 inline-block">
                          <div className="w-16 h-20 bg-slate-50 border border-slate-200"></div>
                       </div>
                    </div>
                 </div>

                 <div className="text-center mb-6">
                    <h2 className="font-bold text-sm text-[#0077c8]">Property Insp. - Property Inspection Services - INVOICE</h2>
                 </div>

                 <div className="flex justify-between mb-6">
                    <div className="w-1/3">
                       <p className="font-bold mb-2">Carrington Mortgage Services, LLC</p>
                       <p className="mb-4">Re: SARAH J COONEY</p>
                       <p>11212 BAYRIDGE CIRCLE</p>
                       <p>INDIANAPOLIS, IN 46236</p>

                       <div className="grid grid-cols-2 gap-1 mt-4">
                          <span className="font-bold">Loan #:</span> <span>2000199373</span>
                          <span className="font-bold">Loan Type:</span> <span>FHA</span>
                          <span className="font-bold">Inv. ID / Cat. ID:</span> <span>00082 / 12721</span>
                          <span className="font-bold">Cost Center:</span> <span></span>
                          <span className="font-bold">FHA Case No:</span> <span>FR1565825710703</span>
                       </div>
                    </div>
                    <div className="w-1/3">
                       <div className="grid grid-cols-2 gap-1">
                          <span className="font-bold">Invoice #:</span> <span>61352130_00512</span>
                          <span className="font-bold">Invoice Status:</span> <span>Check Requested</span>
                          <span className="font-bold">Input By:</span> <span>Amalia Inaty</span>
                          <span className="font-bold">Date Submitted:</span> <span>10/25/2023</span>
                          <span className="font-bold">Invoice Date:</span> <span>10/24/2023</span>
                          <span className="font-bold">Vendor Ref #:</span> <span>61352130_00512</span>
                          <span className="font-bold">Vendor Code:</span> <span>MCSERV</span>
                          <span className="font-bold">Payee Code:</span> <span>62171</span>
                          <span className="font-bold">Type:</span> <span>Non Judicial</span>
                          <span className="font-bold">Order Date:</span> <span>10/17/2023</span>
                          <span className="font-bold">Order Complete Date:</span> <span>10/23/2023</span>
                       </div>
                    </div>
                 </div>

                 <div className="mb-8">
                    <div className="grid grid-cols-2 gap-8 mb-4">
                       <div><span className="font-bold">Invoice ID:</span> 326130438</div>
                    </div>

                    <table className="w-full border-t border-b border-black mb-4">
                       <thead>
                          <tr className="font-bold border-b border-black">
                             <th scope="col" className="text-left py-1">Cost Description(s)</th>
                             <th scope="col" className="text-right py-1">W/H</th>
                             <th scope="col" className="text-right py-1">Aff.Ind</th>
                             <th scope="col" className="text-right py-1">Item Date</th>
                             <th scope="col" className="text-right py-1">Qty</th>
                             <th scope="col" className="text-right py-1">Item Price</th>
                             <th scope="col" className="text-right py-1">Orig. Billed</th>
                             <th scope="col" className="text-right py-1">Adjust</th>
                          </tr>
                       </thead>
                       <tbody>
                          <tr>
                             <td className="py-2">
                                <p className="font-bold">Property Services - Photos</p>
                                <p className="italic">Note: Photos</p>
                             </td>
                             <td className="text-right"></td>
                             <td className="text-right"></td>
                             <td className="text-right">10/23/2023</td>
                             <td className="text-right">1</td>
                             <td className="text-right">$30.00</td>
                             <td className="text-right">$30.00</td>
                             <td className="text-right">$0.00</td>
                          </tr>
                          <tr>
                             <td className="py-2">
                                <p className="font-bold">Property Services - Insp - Occupancy Inspection</p>
                                <p className="italic">Note: VERIFY OCCUPANCY</p>
                             </td>
                             <td className="text-right"></td>
                             <td className="text-right"></td>
                             <td className="text-right">10/23/2023</td>
                             <td className="text-right">1</td>
                             <td className="text-right">$20.00</td>
                             <td className="text-right">$20.00</td>
                             <td className="text-right">$0.00</td>
                          </tr>
                       </tbody>
                    </table>

                    <div className="flex justify-end mb-2">
                       <div className="w-1/3 bg-slate-200 p-1 flex justify-between font-bold">
                          <span>Total:</span>
                          <span>$50.00</span>
                          <span>$0.00</span>
                       </div>
                    </div>
                 </div>

                 <div className="mb-4">
                    <p className="font-bold underline">Invoice Level Exceptions</p>
                    <p className="text-red-500">None</p>
                 </div>

                 <div className="mb-4">
                    <p className="font-bold underline">Invoice Level Comment</p>
                    <p>None</p>
                 </div>

                 <div className="absolute bottom-10 left-10 text-[9px]">
                    Execution Date Time: 09/18/2024 08:17:32 AM
                 </div>
                 <div className="absolute bottom-10 right-10 text-[9px]">
                    Pages: 1/2
                 </div>
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
