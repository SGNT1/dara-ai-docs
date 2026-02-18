import React, { useState, useMemo } from 'react';
import { ArrowLeft, FileText, ChevronDown, ChevronRight, X, Check, Flag, Edit3, Eye, ZoomIn, ZoomOut } from 'lucide-react';
import { MOCK_DOC_AUDIT_LOANS, MOCK_DOCUMENT_VERSIONS, MOCK_LOAN_TAPE_FIELDS } from '../constants';
import { LoanTapeField, DocumentVersion } from '../types';

interface DocAuditLoanDetailProps {
  selectedLoanId: string | null;
  onBack: () => void;
}

type DetailTab = 'sourceDetails' | 'versionHistory';

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Match':
      return 'bg-[#e6f4ea] text-[#1e8e3e]';
    case 'Mismatch':
      return 'bg-[#fce8e6] text-[#d93025]';
    case 'Missing':
      return 'bg-slate-100 text-slate-500';
    case 'Low Confidence':
      return 'bg-[#fff8e1] text-[#f9a825]';
    default:
      return 'bg-slate-100 text-slate-500';
  }
};

const getActionBadge = (action: string) => {
  switch (action) {
    case 'Accepted':
      return 'bg-[#e6f4ea] text-[#1e8e3e]';
    case 'Flagged':
      return 'bg-[#fce8e6] text-[#d93025]';
    case 'Overridden':
      return 'bg-[#e3f2fd] text-[#0077c8]';
    case 'Pending':
      return 'bg-[#fff8e1] text-[#f9a825]';
    default:
      return 'bg-slate-100 text-slate-500';
  }
};

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 95) return 'text-[#1e8e3e]';
  if (confidence >= 85) return 'text-[#0077c8]';
  if (confidence >= 70) return 'text-[#f9a825]';
  return 'text-[#d93025]';
};

export const DocAuditLoanDetail: React.FC<DocAuditLoanDetailProps> = ({ selectedLoanId, onBack }) => {
  const [selectedDocType, setSelectedDocType] = useState<string | null>(null);
  const [expandedDocType, setExpandedDocType] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>('sourceDetails');
  const [showDocDrawer, setShowDocDrawer] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [fields, setFields] = useState<LoanTapeField[]>([...MOCK_LOAN_TAPE_FIELDS]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const loan = MOCK_DOC_AUDIT_LOANS.find(l => l.id === selectedLoanId) || MOCK_DOC_AUDIT_LOANS[0];
  const versions = MOCK_DOCUMENT_VERSIONS.filter(v => v.loanId === loan.id);

  // Group documents by type
  const docTypeGroups = useMemo(() => {
    const groups: Record<string, DocumentVersion[]> = {};
    versions.forEach(v => {
      if (!groups[v.documentType]) groups[v.documentType] = [];
      groups[v.documentType].push(v);
    });
    // Sort versions within each group
    Object.values(groups).forEach(arr => arr.sort((a, b) => b.version - a.version));
    return groups;
  }, [versions]);

  const docTypes = Object.keys(docTypeGroups);

  // Auto-select first doc type
  const activeDocType = selectedDocType || docTypes[0] || null;
  const activeVersions = activeDocType ? (docTypeGroups[activeDocType] || []) : [];
  const sotVersion = activeVersions.find(v => v.isSot);

  // Field comparison stats
  const matchedCount = fields.filter(f => f.status === 'Match').length;
  const exceptionCount = fields.filter(f => f.status !== 'Match').length;

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const handleAction = (fieldId: string, action: 'Accepted' | 'Flagged' | 'Overridden') => {
    setFields(prev => prev.map(f => f.id === fieldId ? { ...f, action } : f));
    showToast(`Field ${action.toLowerCase()} successfully`);
  };

  return (
    <div className="flex flex-col h-full bg-[#f4f7fa]">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 lg:px-6 py-4 flex-shrink-0">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center text-xs text-slate-500 mb-2 font-medium list-none p-0">
            <li><span className="text-[#4f46e5]">Doc Audit</span></li>
            <li aria-hidden="true" className="mx-2">/</li>
            <li><button className="text-[#4f46e5] cursor-pointer hover:underline" onClick={onBack}>Loan List</button></li>
            <li aria-hidden="true" className="mx-2">/</li>
            <li aria-current="page">{loan.loanNumber}</li>
          </ol>
        </nav>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={onBack} aria-label="Back to loan list" className="mr-3 text-slate-400 hover:text-slate-600">
              <ArrowLeft size={18} aria-hidden="true" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-slate-800">Loan {loan.loanNumber} — {loan.borrowerName}</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-slate-500">Fields:</span>
              <span className="font-bold text-[#1e8e3e]">{matchedCount} matched</span>
              <span className="text-slate-300">|</span>
              <span className="font-bold text-[#f9a825]">{exceptionCount} exceptions</span>
            </div>
            <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#4f46e5] rounded-full" style={{ width: `${loan.fieldsCompared > 0 ? Math.round((matchedCount / loan.fieldsCompared) * 100) : 0}%` }} />
            </div>
          </div>
        </div>
      </header>

      {/* 2-Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel — Document List */}
        <aside className="w-72 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 overflow-y-auto">
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50/50">
            <h2 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Documents</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {docTypes.map(docType => {
              const typeVersions = docTypeGroups[docType];
              const typeSot = typeVersions.find(v => v.isSot);
              const isExpanded = expandedDocType === docType;
              const isActive = activeDocType === docType;

              return (
                <div key={docType} className="border-b border-slate-100">
                  {/* Doc Type Header */}
                  <button
                    onClick={() => {
                      setSelectedDocType(docType);
                      if (typeVersions.length > 1) {
                        setExpandedDocType(isExpanded ? null : docType);
                      }
                    }}
                    className={`w-full px-4 py-3 flex items-center justify-between text-left transition-colors ${
                      isActive ? 'bg-[#ede9fe] border-l-2 border-[#4f46e5]' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2 min-w-0">
                      <FileText size={14} className="text-slate-400 flex-shrink-0" aria-hidden="true" />
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-slate-700 truncate">{docType}</div>
                        <div className="text-[10px] text-slate-400">
                          {typeVersions.length} version{typeVersions.length > 1 ? 's' : ''}
                          {typeSot && (
                            <span className="ml-1.5 inline-flex items-center px-1.5 py-0 rounded bg-[#4f46e5] text-white text-[9px] font-bold">SOT v{typeSot.version}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {typeVersions.length > 1 && (
                      <span className="text-slate-400 flex-shrink-0">
                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </span>
                    )}
                  </button>

                  {/* Expanded Version List */}
                  {isExpanded && typeVersions.length > 1 && (
                    <div className="bg-slate-50 border-t border-slate-100">
                      {typeVersions.map(ver => (
                        <div key={ver.id} className="px-4 py-2 pl-10 flex items-center justify-between text-[10px]">
                          <div>
                            <span className="font-medium text-slate-600">v{ver.version}</span>
                            <span className="text-slate-400 ml-2">{ver.documentDate}</span>
                            <span className="text-slate-400 ml-2">{ver.source}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`font-bold ${getConfidenceColor(ver.pyroConfidence)}`}>{ver.pyroConfidence}%</span>
                            {ver.isSot && (
                              <span className="inline-flex items-center px-1.5 py-0 rounded bg-[#4f46e5] text-white text-[9px] font-bold">SOT</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Main Panel */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Field Comparison Table */}
          <div className="flex-1 overflow-auto">
            <div className="bg-white m-4 rounded shadow-sm border border-slate-200">
              <div className="px-5 py-3 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-sm font-bold text-slate-700">Field Comparison — Loan Tape vs Document</h2>
                <button
                  onClick={() => setShowDocDrawer(true)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-bold bg-[#4f46e5] hover:bg-[#4338ca] text-white shadow-sm transition-colors"
                >
                  <Eye size={12} aria-hidden="true" />
                  <span>View Document</span>
                </button>
              </div>

              <table className="w-full text-xs text-left">
                <thead className="bg-[#f8fafc] text-slate-500 font-semibold border-b border-slate-200 sticky top-0 z-10">
                  <tr>
                    <th scope="col" className="px-4 py-2.5">Field</th>
                    <th scope="col" className="px-4 py-2.5">Tape Value</th>
                    <th scope="col" className="px-4 py-2.5">Doc Value</th>
                    <th scope="col" className="px-4 py-2.5">Source</th>
                    <th scope="col" className="px-4 py-2.5 text-center">Conf</th>
                    <th scope="col" className="px-4 py-2.5 text-center">Status</th>
                    <th scope="col" className="px-4 py-2.5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {fields.map(field => (
                    <tr key={field.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-2.5 font-medium text-slate-700">{field.fieldName}</td>
                      <td className="px-4 py-2.5 text-slate-600 font-mono text-[11px]">{field.loanTapeValue}</td>
                      <td className="px-4 py-2.5 font-mono text-[11px]">
                        {field.documentValue ? (
                          <span className={field.status === 'Mismatch' ? 'text-[#d93025] font-bold' : 'text-slate-600'}>
                            {field.documentValue}
                          </span>
                        ) : (
                          <span className="text-slate-300 italic">No data</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#ede9fe] text-[#4f46e5] text-[10px] font-bold">
                          {field.sourceDocType} v{field.sourceDocVersion}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <span className={`font-bold ${getConfidenceColor(field.confidence)}`}>{field.confidence}%</span>
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${getStatusBadge(field.status)}`}>
                          {field.status}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        {field.status !== 'Match' ? (
                          field.action === 'Pending' ? (
                            <div className="flex items-center justify-center space-x-1">
                              <button
                                onClick={() => handleAction(field.id, 'Accepted')}
                                className="p-1 rounded hover:bg-[#e6f4ea] text-slate-400 hover:text-[#1e8e3e] transition-colors"
                                title="Accept"
                              >
                                <Check size={12} />
                              </button>
                              <button
                                onClick={() => handleAction(field.id, 'Flagged')}
                                className="p-1 rounded hover:bg-[#fce8e6] text-slate-400 hover:text-[#d93025] transition-colors"
                                title="Flag"
                              >
                                <Flag size={12} />
                              </button>
                              <button
                                onClick={() => handleAction(field.id, 'Overridden')}
                                className="p-1 rounded hover:bg-[#e3f2fd] text-slate-400 hover:text-[#0077c8] transition-colors"
                                title="Override"
                              >
                                <Edit3 size={12} />
                              </button>
                            </div>
                          ) : (
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${getActionBadge(field.action)}`}>
                              {field.action}
                            </span>
                          )
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Detail Panel */}
          <div className="h-56 border-t border-slate-200 bg-white flex flex-col flex-shrink-0">
            <div className="flex border-b border-slate-200 px-4" role="tablist" aria-label="Detail view tabs">
              <button
                role="tab"
                aria-selected={detailTab === 'sourceDetails'}
                onClick={() => setDetailTab('sourceDetails')}
                className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                  detailTab === 'sourceDetails'
                    ? 'border-[#4f46e5] text-slate-800 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                Source Details
              </button>
              <button
                role="tab"
                aria-selected={detailTab === 'versionHistory'}
                onClick={() => setDetailTab('versionHistory')}
                className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                  detailTab === 'versionHistory'
                    ? 'border-[#4f46e5] text-slate-800 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                Version History
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4">
              {detailTab === 'sourceDetails' && sotVersion && (
                <div>
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-xs font-bold text-slate-700">{activeDocType} — v{sotVersion.version} (SOT)</h3>
                    <span className="text-[10px] text-slate-400">{sotVersion.source} · {sotVersion.documentDate}</span>
                    <span className={`text-[10px] font-bold ${getConfidenceColor(sotVersion.pyroConfidence)}`}>
                      Overall: {sotVersion.pyroConfidence}%
                    </span>
                  </div>
                  <table className="w-full text-xs">
                    <thead className="text-slate-500 font-semibold">
                      <tr>
                        <th className="text-left px-3 py-1.5">Extracted Field</th>
                        <th className="text-left px-3 py-1.5">Value</th>
                        <th className="text-center px-3 py-1.5">Confidence</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {sotVersion.extractions.map((ext, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="px-3 py-1.5 font-medium text-slate-600">{ext.fieldName}</td>
                          <td className="px-3 py-1.5 text-slate-700 font-mono text-[11px]">{ext.extractedValue}</td>
                          <td className="px-3 py-1.5 text-center">
                            <span className={`font-bold ${getConfidenceColor(ext.confidence)}`}>{ext.confidence}%</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {detailTab === 'versionHistory' && (
                <div>
                  <h3 className="text-xs font-bold text-slate-700 mb-3">{activeDocType} — All Versions</h3>
                  <table className="w-full text-xs">
                    <thead className="text-slate-500 font-semibold">
                      <tr>
                        <th className="text-left px-3 py-1.5">Version</th>
                        <th className="text-left px-3 py-1.5">Document Date</th>
                        <th className="text-left px-3 py-1.5">Upload Date</th>
                        <th className="text-left px-3 py-1.5">Source</th>
                        <th className="text-center px-3 py-1.5">Confidence</th>
                        <th className="text-center px-3 py-1.5">SOT</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {activeVersions.map(ver => (
                        <tr key={ver.id} className={`hover:bg-slate-50 ${ver.isSot ? 'bg-[#ede9fe]/30' : ''}`}>
                          <td className="px-3 py-1.5 font-medium text-slate-700">v{ver.version}</td>
                          <td className="px-3 py-1.5 text-slate-600">{ver.documentDate}</td>
                          <td className="px-3 py-1.5 text-slate-600">{ver.uploadDate}</td>
                          <td className="px-3 py-1.5 text-slate-600">{ver.source}</td>
                          <td className="px-3 py-1.5 text-center">
                            <span className={`font-bold ${getConfidenceColor(ver.pyroConfidence)}`}>{ver.pyroConfidence}%</span>
                          </td>
                          <td className="px-3 py-1.5 text-center">
                            {ver.isSot ? (
                              <span className="inline-flex items-center px-1.5 py-0 rounded bg-[#4f46e5] text-white text-[9px] font-bold">SOT</span>
                            ) : (
                              <span className="text-slate-300">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Document Viewer Slide-Over Drawer */}
      {showDocDrawer && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setShowDocDrawer(false)} aria-hidden="true" />
          <div className="fixed right-0 top-0 h-full w-[480px] bg-white shadow-2xl z-50 flex flex-col animate-slide-in">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-700">
                {activeDocType} {sotVersion ? `— v${sotVersion.version}` : ''}
              </h3>
              <div className="flex items-center space-x-2">
                <button onClick={() => setZoom(z => Math.max(50, z - 25))} className="p-1 rounded hover:bg-slate-200 text-slate-500" title="Zoom out">
                  <ZoomOut size={14} />
                </button>
                <span className="text-[10px] text-slate-500 w-8 text-center">{zoom}%</span>
                <button onClick={() => setZoom(z => Math.min(200, z + 25))} className="p-1 rounded hover:bg-slate-200 text-slate-500" title="Zoom in">
                  <ZoomIn size={14} />
                </button>
                <button onClick={() => setShowDocDrawer(false)} className="p-1 rounded hover:bg-slate-200 text-slate-500" title="Close">
                  <X size={14} />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-slate-100 flex items-center justify-center overflow-auto p-4">
              <div
                className="bg-white shadow-md rounded flex items-center justify-center"
                style={{ width: `${3.4 * zoom}px`, height: `${4.4 * zoom}px` }}
              >
                <div className="text-center text-slate-400">
                  <FileText size={48} className="mx-auto mb-2" />
                  <p className="text-xs font-medium">Document Preview</p>
                  <p className="text-[10px]">{activeDocType}</p>
                  {sotVersion && <p className="text-[10px]">Version {sotVersion.version} · {sotVersion.source}</p>}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-lg shadow-lg text-xs font-bold text-white ${
          toast.type === 'success' ? 'bg-[#1e8e3e]' : 'bg-[#4f46e5]'
        }`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};
