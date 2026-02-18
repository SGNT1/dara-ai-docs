import React, { useState } from 'react';
import { ArrowLeft, ArrowUp, FileText, Trash2, Check, ChevronDown, Sparkles, Database, Upload, FolderOpen } from 'lucide-react';
import {
  MOCK_DOC_AUDIT_AUTO_MAPPINGS, MOCK_DOC_AUDIT_MAPPING_TEMPLATES,
  MOCK_DOC_AUDIT_CSV_ROWS, MOCK_DOC_AUDIT_CSV_HEADERS, DOC_AUDIT_TARGET_FIELDS,
  MOCK_EXISTING_DOC_BATCHES,
} from '../constants';
import { LoanTapeCsvColumnMapping, LoanTapeTargetField } from '../types';

interface DocAuditUploadWizardProps {
  onBack: () => void;
  onComplete: () => void;
}

type WizardStep = 1 | 2 | 3;

const REQUIRED_FIELDS: LoanTapeTargetField[] = ['Loan Number', 'Borrower Name', 'Property Address', 'Original Balance', 'Interest Rate'];

const STEP_LABELS = ['Upload Loan Tape', 'Associate Documents', 'Review & Submit'];

const StepIndicator: React.FC<{ currentStep: WizardStep }> = ({ currentStep }) => (
  <div className="flex items-center justify-center py-6" role="group" aria-label="Wizard progress">
    {STEP_LABELS.map((label, i) => {
      const step = (i + 1) as WizardStep;
      const isActive = step === currentStep;
      const isCompleted = step < currentStep;
      return (
        <React.Fragment key={step}>
          {i > 0 && (
            <div className={`w-16 h-0.5 mx-2 ${isCompleted ? 'bg-[#1e8e3e]' : 'bg-slate-300'}`} aria-hidden="true" />
          )}
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                isCompleted ? 'bg-[#1e8e3e] text-white'
                : isActive ? 'bg-[#4f46e5] text-white'
                : 'bg-slate-200 text-slate-500'
              }`}
              aria-current={isActive ? 'step' : undefined}
            >
              {isCompleted ? <Check size={14} aria-hidden="true" /> : step}
            </div>
            <span className={`text-[10px] mt-1.5 font-medium ${isActive ? 'text-[#4f46e5]' : isCompleted ? 'text-[#1e8e3e]' : 'text-slate-400'}`}>
              {label}
            </span>
          </div>
        </React.Fragment>
      );
    })}
  </div>
);

const getConfidenceBadge = (confidence: number) => {
  if (confidence >= 90) return 'bg-[#e6f4ea] text-[#1e8e3e]';
  if (confidence >= 70) return 'bg-[#e3f2fd] text-[#0077c8]';
  if (confidence > 0) return 'bg-[#fff8e1] text-[#f9a825]';
  return 'bg-slate-100 text-slate-400';
};

type DocSourceMode = 'existing' | 'upload' | null;

export const DocAuditUploadWizard: React.FC<DocAuditUploadWizardProps> = ({ onBack, onComplete }) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);

  // Step 1: Loan Tape CSV
  const [csvFileName, setCsvFileName] = useState('');
  const [csvDataLoaded, setCsvDataLoaded] = useState(false);
  const [columnMappings, setColumnMappings] = useState<LoanTapeCsvColumnMapping[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const [auditName, setAuditName] = useState('');

  // Step 2: Document Association
  const [docSourceMode, setDocSourceMode] = useState<DocSourceMode>(null);
  const [selectedExistingBatchId, setSelectedExistingBatchId] = useState<string | null>(null);
  const [uploadedDocFiles, setUploadedDocFiles] = useState<string[]>([]);

  // Step 3: Review
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [showToast, setShowToast] = useState(false);

  // ── Step 1 handlers ──
  const handleCsvDropZone = () => {
    if (!csvFileName) {
      setCsvFileName('Carrington_Loan_Tape_Q1_2025.csv');
      setCsvDataLoaded(true);
      setAuditName('Carrington Q1 2025');
      setColumnMappings(MOCK_DOC_AUDIT_CSV_HEADERS.map(h => ({ csvHeader: h, mappedField: '-- Unmapped --' as LoanTapeTargetField, confidence: 0 })));
    }
  };

  const handleAiMap = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setColumnMappings(MOCK_DOC_AUDIT_AUTO_MAPPINGS.map(m => ({ ...m })));
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleMappingChange = (csvHeader: string, newField: LoanTapeTargetField) => {
    setColumnMappings(prev => prev.map(m => m.csvHeader === csvHeader ? { ...m, mappedField: newField, confidence: 100 } : m));
  };

  const handleLoadTemplate = (templateId: string) => {
    const tpl = MOCK_DOC_AUDIT_MAPPING_TEMPLATES.find(t => t.id === templateId);
    if (tpl) {
      setColumnMappings(prev => prev.map(m => {
        const match = tpl.mappings.find(tm => tm.csvHeader === m.csvHeader);
        return match ? { ...m, mappedField: match.mappedField, confidence: 100 } : m;
      }));
    }
    setShowTemplateDropdown(false);
  };

  const handleRemoveCsv = () => {
    setCsvFileName('');
    setCsvDataLoaded(false);
    setColumnMappings([]);
  };

  // ── Step 2 handlers ──
  const handleDocUploadDropZone = () => {
    if (uploadedDocFiles.length === 0) {
      setUploadedDocFiles([
        'Carrington_Loan_Docs_Batch1.zip',
        'Carrington_Loan_Docs_Batch2.zip',
        'Carrington_Supplemental_Docs.pdf',
      ]);
    }
  };

  const handleRemoveDocFile = (index: number) => {
    setUploadedDocFiles(prev => prev.filter((_, i) => i !== index));
  };

  // ── Validation ──
  const mappedRequiredFields = REQUIRED_FIELDS.filter(rf => columnMappings.some(m => m.mappedField === rf));
  const allRequiredMapped = mappedRequiredFields.length === REQUIRED_FIELDS.length;
  const hasMappings = columnMappings.some(m => m.mappedField !== '-- Unmapped --');
  const canProceedStep1 = csvFileName && allRequiredMapped;
  const canProceedStep2 = (docSourceMode === 'existing' && selectedExistingBatchId) || (docSourceMode === 'upload' && uploadedDocFiles.length > 0);

  const selectedBatch = MOCK_EXISTING_DOC_BATCHES.find(b => b.id === selectedExistingBatchId);
  const loanTapeRowCount = MOCK_DOC_AUDIT_CSV_ROWS.length;

  const handleSubmit = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      onComplete();
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-[#f4f7fa]">
      {/* Toast */}
      <div aria-live="assertive" className="fixed top-4 right-4 z-50">
        {showToast && (
          <div role="alert" className="bg-[#1e8e3e] text-white px-5 py-3 rounded shadow-lg flex items-center space-x-2 text-sm font-medium">
            <Check size={16} aria-hidden="true" />
            <span>Audit created successfully</span>
          </div>
        )}
      </div>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 lg:px-6 pt-5 pb-0">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center text-xs text-slate-500 mb-2 font-medium list-none p-0">
            <li><span className="text-[#4f46e5]">Doc Audit</span></li>
            <li aria-hidden="true" className="mx-2">/</li>
            <li>
              <button className="text-[#4f46e5] cursor-pointer hover:underline" onClick={onBack}>Dashboard</button>
            </li>
            <li aria-hidden="true" className="mx-2">/</li>
            <li aria-current="page">New Audit</li>
          </ol>
        </nav>
        <div className="flex items-center mb-4">
          <button onClick={onBack} aria-label="Back to dashboard" className="mr-3 text-slate-400 hover:text-slate-600">
            <ArrowLeft size={18} aria-hidden="true" />
          </button>
          <h1 className="text-xl font-bold text-slate-800">New Doc Audit</h1>
        </div>
        <StepIndicator currentStep={currentStep} />
      </header>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto">

          {/* ── Step 1: Upload Loan Tape CSV ── */}
          {currentStep === 1 && (
            <div className="space-y-6">
              {/* Audit Name */}
              <div className="bg-white rounded shadow-sm border border-slate-200 p-6">
                <h2 className="text-sm font-bold text-slate-700 mb-4">Audit Details</h2>
                <div className="max-w-md">
                  <label htmlFor="wiz-audit-name" className="block text-[10px] font-bold text-slate-500 mb-1">Audit Name</label>
                  <input
                    id="wiz-audit-name"
                    type="text"
                    value={auditName}
                    onChange={(e) => setAuditName(e.target.value)}
                    placeholder="e.g. Carrington Q1 2025"
                    className="w-full border border-slate-300 rounded-sm p-2 text-xs text-slate-700 focus:border-[#4f46e5] outline-none"
                  />
                </div>
              </div>

              {/* CSV Upload */}
              {!csvDataLoaded && (
                <div className="bg-white rounded shadow-sm border border-slate-200 p-6">
                  <h2 className="text-sm font-bold text-slate-700 mb-4">Loan Tape CSV</h2>
                  <div
                    onClick={handleCsvDropZone}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCsvDropZone(); } }}
                    role="button"
                    tabIndex={0}
                    aria-label="Select a loan tape CSV file to upload. Drag and drop or press Enter to browse."
                    className="border-2 border-dashed border-slate-300 rounded-lg h-36 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full border-2 border-[#4f46e5] flex items-center justify-center mb-3 text-[#4f46e5] group-hover:scale-110 transition-transform" aria-hidden="true">
                      <ArrowUp size={20} strokeWidth={2.5} />
                    </div>
                    <p className="text-xs text-slate-600 font-medium">Drag and Drop Loan Tape CSV or <span className="text-[#4f46e5] font-bold">Browse to Select</span></p>
                    <p className="text-[10px] text-slate-400 mt-1">Supported: .csv</p>
                  </div>
                </div>
              )}

              {/* CSV Data Preview + Mapping */}
              {csvDataLoaded && (
                <div className="bg-white rounded shadow-sm border border-slate-200">
                  {/* Toolbar */}
                  <div className="px-5 py-3 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <FileText size={14} className="text-[#1e8e3e]" aria-hidden="true" />
                        <span className="text-xs font-medium text-slate-700">{csvFileName}</span>
                        <span className="text-[10px] text-slate-400">({loanTapeRowCount} loans, {MOCK_DOC_AUDIT_CSV_HEADERS.length} columns)</span>
                      </div>
                      <button onClick={handleRemoveCsv} aria-label={`Remove ${csvFileName}`} className="text-slate-400 hover:text-red-500">
                        <Trash2 size={13} aria-hidden="true" />
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      {/* Load Template */}
                      <div className="relative">
                        <button
                          onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
                          className="border border-slate-300 hover:border-slate-400 bg-white px-3 py-1.5 rounded text-xs font-bold text-slate-600 flex items-center transition-colors"
                          aria-haspopup="listbox"
                          aria-expanded={showTemplateDropdown}
                        >
                          Load Template
                          <ChevronDown size={12} className="ml-1.5" aria-hidden="true" />
                        </button>
                        {showTemplateDropdown && (
                          <div role="listbox" aria-label="Saved mapping templates" className="absolute right-0 top-full mt-1 w-64 bg-white border border-slate-200 shadow-lg rounded z-20">
                            {MOCK_DOC_AUDIT_MAPPING_TEMPLATES.map(tpl => (
                              <div
                                key={tpl.id}
                                role="option"
                                aria-selected={false}
                                className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0"
                                onClick={() => handleLoadTemplate(tpl.id)}
                              >
                                <div className="text-xs font-medium text-slate-700">{tpl.name}</div>
                                <div className="text-[10px] text-slate-400">{tpl.description}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      {/* Map with AI */}
                      <button
                        onClick={handleAiMap}
                        disabled={isAnalyzing}
                        className={`px-3 py-1.5 rounded text-xs font-bold flex items-center shadow-sm transition-colors ${
                          isAnalyzing
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-[#4f46e5] hover:bg-[#4338ca] text-white'
                        }`}
                      >
                        {isAnalyzing ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1.5" aria-hidden="true" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Sparkles size={13} className="mr-1.5" aria-hidden="true" />
                            Map with AI
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Data grid with mapping header row */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-[11px] text-left min-w-[1100px]">
                      {/* Mapping row */}
                      <thead>
                        <tr className="bg-[#ede9fe]/50 border-b-2 border-[#4f46e5]/20">
                          {MOCK_DOC_AUDIT_CSV_HEADERS.map((header) => {
                            const mapping = columnMappings.find(m => m.csvHeader === header);
                            const mapped = mapping && mapping.mappedField !== '-- Unmapped --';
                            return (
                              <th key={header} scope="col" className="px-3 py-2.5 min-w-[110px]">
                                <div className="space-y-1.5">
                                  <label className="sr-only" htmlFor={`da-map-${header}`}>Map field for {header}</label>
                                  <select
                                    id={`da-map-${header}`}
                                    value={mapping?.mappedField || '-- Unmapped --'}
                                    onChange={(e) => handleMappingChange(header, e.target.value as LoanTapeTargetField)}
                                    className={`w-full border rounded-sm p-1 text-[10px] font-bold outline-none bg-white ${
                                      mapped ? 'border-[#4f46e5] text-[#4f46e5]' : 'border-slate-300 text-slate-400'
                                    } focus:border-[#4f46e5]`}
                                  >
                                    {DOC_AUDIT_TARGET_FIELDS.map(f => (
                                      <option key={f} value={f}>{f}</option>
                                    ))}
                                  </select>
                                  {mapping && mapping.confidence > 0 && (
                                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold ${getConfidenceBadge(mapping.confidence)}`}>
                                      {mapping.confidence}%
                                    </span>
                                  )}
                                </div>
                              </th>
                            );
                          })}
                        </tr>
                        {/* Column headers from CSV */}
                        <tr className="bg-[#f8fafc] border-b border-slate-200">
                          {MOCK_DOC_AUDIT_CSV_HEADERS.map(header => (
                            <th key={header} scope="col" className="px-3 py-2 text-slate-500 font-semibold text-[10px] uppercase tracking-wide">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {MOCK_DOC_AUDIT_CSV_ROWS.map((row, rowIdx) => (
                          <tr key={rowIdx} className="hover:bg-slate-50/50 transition-colors">
                            {MOCK_DOC_AUDIT_CSV_HEADERS.map(header => (
                              <td key={header} className="px-3 py-2 text-slate-600 whitespace-nowrap">
                                {row[header]}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Footer: row count + required fields checklist */}
                  <div className="px-5 py-3 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">Showing {loanTapeRowCount} of {loanTapeRowCount} loans</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Required:</span>
                      {REQUIRED_FIELDS.map(field => {
                        const isMapped = columnMappings.some(m => m.mappedField === field);
                        return (
                          <div key={field} className="flex items-center space-x-1">
                            <div className={`w-3 h-3 rounded-full flex items-center justify-center ${isMapped ? 'bg-[#1e8e3e]' : 'bg-slate-300'}`} aria-hidden="true">
                              {isMapped && <Check size={7} className="text-white" />}
                            </div>
                            <span className={`text-[10px] font-medium ${isMapped ? 'text-slate-700' : 'text-slate-400'}`}>{field}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Hint when data is loaded but no mappings yet */}
              {csvDataLoaded && !hasMappings && !isAnalyzing && (
                <div className="bg-[#ede9fe]/50 border border-[#4f46e5]/20 rounded p-4 flex items-start space-x-3">
                  <Sparkles size={16} className="text-[#4f46e5] mt-0.5 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="text-xs font-medium text-slate-700">Review your loan tape data, then map columns</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Use the dropdowns above each column to manually assign fields, click <strong>Map with AI</strong> for automatic suggestions, or <strong>Load Template</strong> to apply a saved mapping.</p>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex justify-end space-x-3">
                <button onClick={onBack} className="px-6 py-2 border border-slate-300 rounded-sm text-xs font-bold text-slate-600 hover:bg-white hover:border-slate-400 transition-colors">
                  Cancel
                </button>
                <button
                  onClick={() => setCurrentStep(2)}
                  disabled={!canProceedStep1}
                  className={`px-6 py-2 rounded-sm text-xs font-bold transition-colors shadow-sm ${canProceedStep1 ? 'bg-[#4f46e5] hover:bg-[#4338ca] text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* ── Step 2: Associate Documents ── */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="bg-white rounded shadow-sm border border-slate-200 p-6">
                <h2 className="text-sm font-bold text-slate-700 mb-2">Document Source</h2>
                <p className="text-xs text-slate-500 mb-5">Choose how to associate loan documents with this audit. Documents will be matched to loans from your loan tape by loan number.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Option A: Existing AI Docs Batch */}
                  <button
                    onClick={() => { setDocSourceMode('existing'); setUploadedDocFiles([]); }}
                    className={`p-5 rounded-lg border-2 text-left transition-all ${
                      docSourceMode === 'existing'
                        ? 'border-[#4f46e5] bg-[#ede9fe]/30'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${docSourceMode === 'existing' ? 'bg-[#4f46e5] text-white' : 'bg-slate-100 text-slate-400'}`}>
                        <Database size={20} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-700">Use Existing Batch</div>
                        <div className="text-[10px] text-slate-500">Select from previously classified AI Docs batches</div>
                      </div>
                    </div>
                    {docSourceMode === 'existing' && (
                      <div className="flex items-center space-x-1 text-[10px] text-[#4f46e5] font-bold">
                        <Check size={10} />
                        <span>Selected</span>
                      </div>
                    )}
                  </button>

                  {/* Option B: Upload New */}
                  <button
                    onClick={() => { setDocSourceMode('upload'); setSelectedExistingBatchId(null); }}
                    className={`p-5 rounded-lg border-2 text-left transition-all ${
                      docSourceMode === 'upload'
                        ? 'border-[#4f46e5] bg-[#ede9fe]/30'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${docSourceMode === 'upload' ? 'bg-[#4f46e5] text-white' : 'bg-slate-100 text-slate-400'}`}>
                        <Upload size={20} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-700">Upload New Documents</div>
                        <div className="text-[10px] text-slate-500">Upload document files for Pyro AI classification</div>
                      </div>
                    </div>
                    {docSourceMode === 'upload' && (
                      <div className="flex items-center space-x-1 text-[10px] text-[#4f46e5] font-bold">
                        <Check size={10} />
                        <span>Selected</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* Existing Batch Selector */}
              {docSourceMode === 'existing' && (
                <div className="bg-white rounded shadow-sm border border-slate-200">
                  <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50">
                    <h2 className="text-sm font-bold text-slate-700">Select an AI Docs Batch</h2>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {MOCK_EXISTING_DOC_BATCHES.map(batch => (
                      <button
                        key={batch.id}
                        onClick={() => setSelectedExistingBatchId(batch.id)}
                        className={`w-full px-5 py-4 flex items-center justify-between text-left transition-colors ${
                          selectedExistingBatchId === batch.id ? 'bg-[#ede9fe]/30' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedExistingBatchId === batch.id ? 'border-[#4f46e5] bg-[#4f46e5]' : 'border-slate-300'
                          }`}>
                            {selectedExistingBatchId === batch.id && <Check size={10} className="text-white" />}
                          </div>
                          <div>
                            <div className="text-xs font-medium text-slate-700">{batch.name}</div>
                            <div className="text-[10px] text-slate-400">
                              Uploaded {batch.uploadDate} &middot; {batch.totalFiles} files &middot; {batch.totalDocuments} docs &middot; {batch.loanCount} loans
                            </div>
                          </div>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold ${
                          batch.status === 'Complete' ? 'bg-[#e6f4ea] text-[#1e8e3e]' : 'bg-[#fff8e1] text-[#f9a825]'
                        }`}>
                          {batch.status}
                        </span>
                      </button>
                    ))}
                  </div>
                  {selectedExistingBatchId && selectedBatch && (
                    <div className="px-5 py-3 border-t border-slate-200 bg-[#ede9fe]/20 flex items-center space-x-2">
                      <FolderOpen size={14} className="text-[#4f46e5]" aria-hidden="true" />
                      <span className="text-xs text-slate-600">
                        <strong className="text-slate-700">{selectedBatch.name}</strong> — {selectedBatch.loanCount} loans, {selectedBatch.totalDocuments} classified documents available for matching
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Upload New Documents */}
              {docSourceMode === 'upload' && (
                <div className="bg-white rounded shadow-sm border border-slate-200 p-6">
                  <h2 className="text-sm font-bold text-slate-700 mb-4">Upload Document Files</h2>
                  <div
                    onClick={handleDocUploadDropZone}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleDocUploadDropZone(); } }}
                    role="button"
                    tabIndex={0}
                    aria-label="Select document files to upload. Drag and drop or press Enter to browse."
                    className="border-2 border-dashed border-slate-300 rounded-lg h-36 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full border-2 border-[#4f46e5] flex items-center justify-center mb-3 text-[#4f46e5] group-hover:scale-110 transition-transform" aria-hidden="true">
                      <ArrowUp size={20} strokeWidth={2.5} />
                    </div>
                    <p className="text-xs text-slate-600 font-medium">Drag and Drop Files Here or <span className="text-[#4f46e5] font-bold">Browse to Select</span></p>
                    <p className="text-[10px] text-slate-400 mt-1">Supported: .pdf, .tiff, .zip (loan document packages)</p>
                  </div>

                  {uploadedDocFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {uploadedDocFiles.map((file, i) => (
                        <div key={i} className="border border-slate-200 rounded p-2.5 flex items-center justify-between bg-slate-50">
                          <div className="flex items-center space-x-3 overflow-hidden">
                            <div className="bg-white p-1.5 border border-slate-200 rounded" aria-hidden="true">
                              <FileText size={14} className="text-[#4f46e5]" />
                            </div>
                            <span className="text-xs text-slate-700 font-medium truncate">{file}</span>
                          </div>
                          <button onClick={() => handleRemoveDocFile(i)} aria-label={`Remove ${file}`} className="text-slate-400 hover:text-red-500">
                            <Trash2 size={14} aria-hidden="true" />
                          </button>
                        </div>
                      ))}
                      <div className="bg-[#ede9fe]/30 border border-[#4f46e5]/20 rounded p-3 flex items-start space-x-2 mt-3">
                        <Sparkles size={14} className="text-[#4f46e5] mt-0.5 shrink-0" aria-hidden="true" />
                        <p className="text-[10px] text-slate-600">Documents will be classified by <strong>Pyro AI</strong> and matched to loans by loan number. Classification runs automatically after submission.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Footer */}
              <div className="flex justify-between">
                <button onClick={() => setCurrentStep(1)} className="px-6 py-2 border border-slate-300 rounded-sm text-xs font-bold text-slate-600 hover:bg-white hover:border-slate-400 transition-colors">
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  disabled={!canProceedStep2}
                  className={`px-6 py-2 rounded-sm text-xs font-bold transition-colors shadow-sm ${canProceedStep2 ? 'bg-[#4f46e5] hover:bg-[#4338ca] text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: Review & Submit ── */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Audit Summary */}
              <div className="bg-white rounded shadow-sm border border-slate-200 p-6">
                <h2 className="text-sm font-bold text-slate-700 mb-4">Audit Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded p-4">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Audit Name</div>
                    <div className="text-sm font-bold text-slate-700">{auditName || 'Untitled'}</div>
                  </div>
                  <div className="bg-slate-50 rounded p-4">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Loans in Tape</div>
                    <div className="text-sm font-bold text-slate-700">{loanTapeRowCount}</div>
                  </div>
                  <div className="bg-slate-50 rounded p-4">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Document Source</div>
                    <div className="text-sm font-bold text-slate-700">
                      {docSourceMode === 'existing' && selectedBatch ? selectedBatch.name : `${uploadedDocFiles.length} file(s) uploaded`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Loan Tape CSV review */}
              <div className="bg-white rounded shadow-sm border border-slate-200 p-6">
                <h2 className="text-sm font-bold text-slate-700 mb-3">Loan Tape Mapping</h2>
                <div className="flex items-center space-x-2 mb-4 text-xs text-slate-600">
                  <FileText size={12} className="text-[#1e8e3e]" aria-hidden="true" />
                  <span>{csvFileName}</span>
                </div>
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#f8fafc] text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th scope="col" className="px-4 py-2.5">CSV Header</th>
                      <th scope="col" className="px-4 py-2.5">Mapped To</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {columnMappings.filter(m => m.mappedField !== '-- Unmapped --').map(m => (
                      <tr key={m.csvHeader}>
                        <td className="px-4 py-2.5 text-slate-600">{m.csvHeader}</td>
                        <td className="px-4 py-2.5 font-medium text-slate-700">{m.mappedField}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Document Association review */}
              <div className="bg-white rounded shadow-sm border border-slate-200 p-6">
                <h2 className="text-sm font-bold text-slate-700 mb-3">Document Association</h2>
                {docSourceMode === 'existing' && selectedBatch ? (
                  <div className="flex items-center space-x-3">
                    <Database size={16} className="text-[#4f46e5]" aria-hidden="true" />
                    <div>
                      <div className="text-xs font-medium text-slate-700">{selectedBatch.name}</div>
                      <div className="text-[10px] text-slate-400">{selectedBatch.totalDocuments} classified documents &middot; {selectedBatch.loanCount} loans</div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {uploadedDocFiles.map((file, i) => (
                      <div key={i} className="flex items-center space-x-2 text-xs text-slate-600">
                        <FileText size={12} className="text-[#4f46e5]" aria-hidden="true" />
                        <span>{file}</span>
                      </div>
                    ))}
                    <p className="text-[10px] text-slate-400 mt-2">Documents will be classified by Pyro AI after submission.</p>
                  </div>
                )}
              </div>

              {/* Save as template */}
              <div className="bg-white rounded shadow-sm border border-slate-200 p-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={saveAsTemplate}
                    onChange={(e) => setSaveAsTemplate(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#4f46e5] focus:ring-[#4f46e5]"
                  />
                  <span className="text-xs font-bold text-slate-700">Save loan tape column mapping as template</span>
                </label>
                {saveAsTemplate && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                    <div>
                      <label htmlFor="da-save-tpl-name" className="block text-[10px] font-bold text-slate-500 mb-1">Template Name *</label>
                      <input
                        id="da-save-tpl-name"
                        type="text"
                        aria-required="true"
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        placeholder="e.g. Carrington Loan Tape Standard"
                        className="w-full border border-slate-300 rounded-sm p-2 text-xs text-slate-700 focus:border-[#4f46e5] outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="da-save-tpl-desc" className="block text-[10px] font-bold text-slate-500 mb-1">Description</label>
                      <input
                        id="da-save-tpl-desc"
                        type="text"
                        value={templateDescription}
                        onChange={(e) => setTemplateDescription(e.target.value)}
                        placeholder="Optional description"
                        className="w-full border border-slate-300 rounded-sm p-2 text-xs text-slate-700 focus:border-[#4f46e5] outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Next Steps info */}
              <div className="bg-[#ede9fe]/30 border border-[#4f46e5]/20 rounded p-4">
                <h3 className="text-xs font-bold text-slate-700 mb-2">What happens next</h3>
                <ol className="space-y-1.5 text-[10px] text-slate-600 list-decimal list-inside">
                  <li>{docSourceMode === 'upload' ? 'Pyro AI classifies and extracts fields from uploaded documents' : 'Documents from selected batch are matched to loan tape entries by loan number'}</li>
                  <li>System auto-suggests Source of Truth (SOT) document versions for each loan</li>
                  <li>Human reviewer confirms or adjusts SOT designations</li>
                  <li>Field-by-field comparison runs: loan tape vs SOT document data</li>
                  <li>Exceptions (mismatches, low confidence) are flagged for human review</li>
                </ol>
              </div>

              {/* Footer */}
              <div className="flex justify-between">
                <button onClick={() => setCurrentStep(2)} className="px-6 py-2 border border-slate-300 rounded-sm text-xs font-bold text-slate-600 hover:bg-white hover:border-slate-400 transition-colors">
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-[#1e8e3e] hover:bg-[#177332] text-white rounded-sm text-xs font-bold transition-colors shadow-sm"
                >
                  Create Audit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
