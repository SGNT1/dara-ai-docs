import React, { useState } from 'react';
import { ArrowLeft, ArrowUp, FileText, Trash2, Check, ChevronDown, Sparkles } from 'lucide-react';
import { MOCK_AUTO_MAPPINGS, MOCK_CSV_MAPPING_TEMPLATES, MOCK_CSV_ROWS, MOCK_PARSED_CSV_HEADERS, CSV_TARGET_FIELDS } from '../constants';
import { CsvColumnMapping, CsvTargetField } from '../types';

interface ReconUploadWizardProps {
  onBack: () => void;
  onComplete: () => void;
}

type WizardStep = 1 | 2 | 3;

const REQUIRED_FIELDS: CsvTargetField[] = ['Date', 'Payee', 'Expense Description', 'Amount', 'Loan Number', 'Invoice ID'];

const STEP_LABELS = ['Upload Invoices', 'Map CSV Columns', 'Review & Submit'];

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
                : isActive ? 'bg-[#0077c8] text-white'
                : 'bg-slate-200 text-slate-500'
              }`}
              aria-current={isActive ? 'step' : undefined}
            >
              {isCompleted ? <Check size={14} aria-hidden="true" /> : step}
            </div>
            <span className={`text-[10px] mt-1.5 font-medium ${isActive ? 'text-[#0077c8]' : isCompleted ? 'text-[#1e8e3e]' : 'text-slate-400'}`}>
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

export const ReconUploadWizard: React.FC<ReconUploadWizardProps> = ({ onBack, onComplete }) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [invoiceFiles, setInvoiceFiles] = useState<string[]>([]);
  const [transferName, setTransferName] = useState('');
  const [batchId, setBatchId] = useState('');
  const [csvFileName, setCsvFileName] = useState('');
  const [csvDataLoaded, setCsvDataLoaded] = useState(false);
  const [columnMappings, setColumnMappings] = useState<CsvColumnMapping[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);

  // Step 1: Simulate adding invoice files
  const handleInvoiceDropZone = () => {
    if (invoiceFiles.length === 0) {
      setInvoiceFiles([
        'Invoice_Batch_2025Q1_001.pdf',
        'Invoice_Batch_2025Q1_002.pdf',
        'Invoice_Batch_2025Q1_003.tiff',
      ]);
      setTransferName('Servicer ABC T3');
      setBatchId('FF2H9G22-092K');
    }
  };

  const handleRemoveInvoiceFile = (index: number) => {
    setInvoiceFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Step 2: CSV upload shows data immediately (no auto-mapping)
  const handleCsvDropZone = () => {
    if (!csvFileName) {
      setCsvFileName('Advance_Ledger_2025Q1.csv');
      setCsvDataLoaded(true);
      // Initialize mappings as all unmapped
      setColumnMappings(MOCK_PARSED_CSV_HEADERS.map(h => ({ csvHeader: h, mappedField: '-- Unmapped --' as CsvTargetField, confidence: 0 })));
    }
  };

  // Explicit AI mapping triggered by button
  const handleAiMap = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setColumnMappings(MOCK_AUTO_MAPPINGS.map(m => ({ ...m })));
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleMappingChange = (csvHeader: string, newField: CsvTargetField) => {
    setColumnMappings(prev => prev.map(m => m.csvHeader === csvHeader ? { ...m, mappedField: newField, confidence: 100 } : m));
  };

  const handleLoadTemplate = (templateId: string) => {
    const tpl = MOCK_CSV_MAPPING_TEMPLATES.find(t => t.id === templateId);
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

  // Validation
  const mappedRequiredFields = REQUIRED_FIELDS.filter(rf => columnMappings.some(m => m.mappedField === rf));
  const allRequiredMapped = mappedRequiredFields.length === REQUIRED_FIELDS.length;
  const hasMappings = columnMappings.some(m => m.mappedField !== '-- Unmapped --');
  const canProceedStep1 = invoiceFiles.length > 0;
  const canProceedStep2 = csvFileName && allRequiredMapped;

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
            <span>Upload submitted successfully</span>
          </div>
        )}
      </div>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 lg:px-6 pt-5 pb-0">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center text-xs text-slate-500 mb-2 font-medium list-none p-0">
            <li><span className="text-[#0077c8]">Advanced Recon</span></li>
            <li aria-hidden="true" className="mx-2">/</li>
            <li>
              <button className="text-[#0077c8] cursor-pointer hover:underline" onClick={onBack}>Dashboard</button>
            </li>
            <li aria-hidden="true" className="mx-2">/</li>
            <li aria-current="page">Upload Wizard</li>
          </ol>
        </nav>
        <div className="flex items-center mb-4">
          <button onClick={onBack} aria-label="Back to dashboard" className="mr-3 text-slate-400 hover:text-slate-600">
            <ArrowLeft size={18} aria-hidden="true" />
          </button>
          <h1 className="text-xl font-bold text-slate-800">Upload Invoices & Advance Data</h1>
        </div>
        <StepIndicator currentStep={currentStep} />
      </header>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto">

          {/* ── Step 1: Upload Invoices ── */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="bg-white rounded shadow-sm border border-slate-200 p-6">
                <h2 className="text-sm font-bold text-slate-700 mb-4">Invoice Files</h2>
                <div
                  onClick={handleInvoiceDropZone}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleInvoiceDropZone(); } }}
                  role="button"
                  tabIndex={0}
                  aria-label="Select invoice files to upload. Drag and drop or press Enter to browse."
                  className="border-2 border-dashed border-slate-300 rounded-lg h-36 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full border-2 border-[#0077c8] flex items-center justify-center mb-3 text-[#0077c8] group-hover:scale-110 transition-transform" aria-hidden="true">
                    <ArrowUp size={20} strokeWidth={2.5} />
                  </div>
                  <p className="text-xs text-slate-600 font-medium">Drag and Drop Files Here or <span className="text-[#0077c8] font-bold">Browse to Select</span></p>
                  <p className="text-[10px] text-slate-400 mt-1">Supported: .pdf, .tiff, .zip</p>
                </div>

                {invoiceFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {invoiceFiles.map((file, i) => (
                      <div key={i} className="border border-slate-200 rounded p-2.5 flex items-center justify-between bg-slate-50">
                        <div className="flex items-center space-x-3 overflow-hidden">
                          <div className="bg-white p-1.5 border border-slate-200 rounded" aria-hidden="true">
                            <FileText size={14} className="text-[#0077c8]" />
                          </div>
                          <span className="text-xs text-slate-700 font-medium truncate">{file}</span>
                        </div>
                        <button onClick={() => handleRemoveInvoiceFile(i)} aria-label={`Remove ${file}`} className="text-slate-400 hover:text-red-500">
                          <Trash2 size={14} aria-hidden="true" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded shadow-sm border border-slate-200 p-6">
                <h2 className="text-sm font-bold text-slate-700 mb-4">Batch Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="wiz-transfer-name" className="block text-[10px] font-bold text-slate-500 mb-1">Transfer Name</label>
                    <input
                      id="wiz-transfer-name"
                      type="text"
                      value={transferName}
                      onChange={(e) => setTransferName(e.target.value)}
                      placeholder="e.g. Servicer ABC T3"
                      className="w-full border border-slate-300 rounded-sm p-2 text-xs text-slate-700 focus:border-[#0077c8] outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="wiz-batch-id" className="block text-[10px] font-bold text-slate-500 mb-1">Batch ID</label>
                    <input
                      id="wiz-batch-id"
                      type="text"
                      value={batchId}
                      onChange={(e) => setBatchId(e.target.value)}
                      placeholder="Auto-generated or custom"
                      className="w-full border border-slate-300 rounded-sm p-2 text-xs text-slate-700 focus:border-[#0077c8] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end space-x-3">
                <button onClick={onBack} className="px-6 py-2 border border-slate-300 rounded-sm text-xs font-bold text-slate-600 hover:bg-white hover:border-slate-400 transition-colors">
                  Cancel
                </button>
                <button
                  onClick={() => setCurrentStep(2)}
                  disabled={!canProceedStep1}
                  className={`px-6 py-2 rounded-sm text-xs font-bold transition-colors shadow-sm ${canProceedStep1 ? 'bg-[#0077c8] hover:bg-[#0066b0] text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* ── Step 2: Map CSV Columns ── */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {/* CSV Upload */}
              {!csvDataLoaded && (
                <div className="bg-white rounded shadow-sm border border-slate-200 p-6">
                  <h2 className="text-sm font-bold text-slate-700 mb-4">Advance Data CSV</h2>
                  <div
                    onClick={handleCsvDropZone}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCsvDropZone(); } }}
                    role="button"
                    tabIndex={0}
                    aria-label="Select a CSV file to upload. Drag and drop or press Enter to browse."
                    className="border-2 border-dashed border-slate-300 rounded-lg h-28 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-full border-2 border-[#0077c8] flex items-center justify-center mb-2 text-[#0077c8] group-hover:scale-110 transition-transform" aria-hidden="true">
                      <ArrowUp size={16} strokeWidth={2.5} />
                    </div>
                    <p className="text-xs text-slate-600 font-medium">Drop CSV file or <span className="text-[#0077c8] font-bold">Browse</span></p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Supported: .csv</p>
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
                        <span className="text-[10px] text-slate-400">({MOCK_CSV_ROWS.length} rows, {MOCK_PARSED_CSV_HEADERS.length} columns)</span>
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
                            {MOCK_CSV_MAPPING_TEMPLATES.map(tpl => (
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
                            : 'bg-[#0077c8] hover:bg-[#0066b0] text-white'
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
                    <table className="w-full text-[11px] text-left min-w-[900px]">
                      {/* Mapping row - dropdowns + confidence */}
                      <thead>
                        <tr className="bg-[#f0f4ff] border-b-2 border-[#0077c8]/20">
                          {MOCK_PARSED_CSV_HEADERS.map((header) => {
                            const mapping = columnMappings.find(m => m.csvHeader === header);
                            const mapped = mapping && mapping.mappedField !== '-- Unmapped --';
                            return (
                              <th key={header} scope="col" className="px-3 py-2.5 min-w-[120px]">
                                <div className="space-y-1.5">
                                  <label className="sr-only" htmlFor={`map-${header}`}>Map field for {header}</label>
                                  <select
                                    id={`map-${header}`}
                                    value={mapping?.mappedField || '-- Unmapped --'}
                                    onChange={(e) => handleMappingChange(header, e.target.value as CsvTargetField)}
                                    className={`w-full border rounded-sm p-1 text-[10px] font-bold outline-none bg-white ${
                                      mapped ? 'border-[#0077c8] text-[#0077c8]' : 'border-slate-300 text-slate-400'
                                    } focus:border-[#0077c8]`}
                                  >
                                    {CSV_TARGET_FIELDS.map(f => (
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
                          {MOCK_PARSED_CSV_HEADERS.map(header => (
                            <th key={header} scope="col" className="px-3 py-2 text-slate-500 font-semibold text-[10px] uppercase tracking-wide">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {MOCK_CSV_ROWS.map((row, rowIdx) => (
                          <tr key={rowIdx} className="hover:bg-slate-50/50 transition-colors">
                            {MOCK_PARSED_CSV_HEADERS.map(header => (
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
                    <span className="text-[10px] text-slate-400">Showing {MOCK_CSV_ROWS.length} of {MOCK_CSV_ROWS.length} rows</span>
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
                <div className="bg-[#f0f4ff] border border-[#0077c8]/20 rounded p-4 flex items-start space-x-3">
                  <Sparkles size={16} className="text-[#0077c8] mt-0.5 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="text-xs font-medium text-slate-700">Review your data, then map columns</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Use the dropdowns above each column to manually assign fields, click <strong>Map with AI</strong> for automatic suggestions, or <strong>Load Template</strong> to apply a saved mapping.</p>
                  </div>
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
                  className={`px-6 py-2 rounded-sm text-xs font-bold transition-colors shadow-sm ${canProceedStep2 ? 'bg-[#0077c8] hover:bg-[#0066b0] text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: Review & Submit ── */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Invoice files review */}
              <div className="bg-white rounded shadow-sm border border-slate-200 p-6">
                <h2 className="text-sm font-bold text-slate-700 mb-3">Invoice Files</h2>
                <div className="space-y-1.5">
                  {invoiceFiles.map((file, i) => (
                    <div key={i} className="flex items-center space-x-2 text-xs text-slate-600">
                      <FileText size={12} className="text-[#0077c8]" aria-hidden="true" />
                      <span>{file}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
                  <span className="font-medium">Transfer:</span> {transferName} &middot; <span className="font-medium">Batch ID:</span> {batchId}
                </div>
              </div>

              {/* CSV & Mapping review */}
              <div className="bg-white rounded shadow-sm border border-slate-200 p-6">
                <h2 className="text-sm font-bold text-slate-700 mb-3">CSV Column Mapping</h2>
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

              {/* Save as template */}
              <div className="bg-white rounded shadow-sm border border-slate-200 p-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={saveAsTemplate}
                    onChange={(e) => setSaveAsTemplate(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#0077c8] focus:ring-[#0077c8]"
                  />
                  <span className="text-xs font-bold text-slate-700">Save column mapping as template</span>
                </label>
                {saveAsTemplate && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                    <div>
                      <label htmlFor="save-tpl-name" className="block text-[10px] font-bold text-slate-500 mb-1">Template Name *</label>
                      <input
                        id="save-tpl-name"
                        type="text"
                        aria-required="true"
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        placeholder="e.g. Servicer ABC Standard Format"
                        className="w-full border border-slate-300 rounded-sm p-2 text-xs text-slate-700 focus:border-[#0077c8] outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="save-tpl-desc" className="block text-[10px] font-bold text-slate-500 mb-1">Description</label>
                      <input
                        id="save-tpl-desc"
                        type="text"
                        value={templateDescription}
                        onChange={(e) => setTemplateDescription(e.target.value)}
                        placeholder="Optional description"
                        className="w-full border border-slate-300 rounded-sm p-2 text-xs text-slate-700 focus:border-[#0077c8] outline-none"
                      />
                    </div>
                  </div>
                )}
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
                  Submit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
