import React, { useState, useRef } from 'react';
import { ArrowLeft, Plus, Trash2, Check, ChevronUp, ChevronDown, GripVertical } from 'lucide-react';
import { MOCK_FILE_INDEX_TEMPLATES, SUPPORTED_DOCUMENT_TYPES } from '../constants';
import { FileIndexTemplate, FileIndexDocRule } from '../types';

interface FileIndexTemplateEditorProps {
  templateId: string | null;
  onBack: () => void;
  onSave: () => void;
}

const blankTemplate: FileIndexTemplate = {
  id: '',
  name: '',
  description: '',
  documentRules: [],
  lastModified: '',
  createdDate: '',
  status: 'Draft',
};

let nextRuleId = 100;

export const FileIndexTemplateEditor: React.FC<FileIndexTemplateEditorProps> = ({ templateId, onBack, onSave }) => {
  const existingTemplate = templateId ? MOCK_FILE_INDEX_TEMPLATES.find(t => t.id === templateId) : null;
  const [template, setTemplate] = useState<FileIndexTemplate>(existingTemplate ? { ...existingTemplate, documentRules: existingTemplate.documentRules.map(r => ({ ...r })) } : { ...blankTemplate });
  const [showToast, setShowToast] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragNodeRef = useRef<HTMLTableRowElement | null>(null);

  const handleFieldChange = (field: keyof FileIndexTemplate, value: string) => {
    setTemplate(prev => ({ ...prev, [field]: value }));
  };

  // Document types already used (to filter the dropdown)
  const usedDocTypes = template.documentRules.map(r => r.documentTypeName);

  const handleAddRule = () => {
    // Find first unused doc type
    const firstAvailable = SUPPORTED_DOCUMENT_TYPES.find(dt => !usedDocTypes.includes(dt)) || '';
    const newRule: FileIndexDocRule = {
      id: `new-${nextRuleId++}`,
      documentTypeName: firstAvailable,
      required: false,
      signatureRequired: false,
      stampRequired: false,
      recordedRequired: false,
    };
    setTemplate(prev => ({ ...prev, documentRules: [...prev.documentRules, newRule] }));
  };

  const handleRemoveRule = (ruleId: string) => {
    setTemplate(prev => ({ ...prev, documentRules: prev.documentRules.filter(r => r.id !== ruleId) }));
  };

  const handleRuleChange = (ruleId: string, field: keyof FileIndexDocRule, value: string | boolean) => {
    setTemplate(prev => ({
      ...prev,
      documentRules: prev.documentRules.map(r => r.id === ruleId ? { ...r, [field]: value } : r),
    }));
  };

  const handleMoveRule = (index: number, direction: 'up' | 'down') => {
    setTemplate(prev => {
      const rules = [...prev.documentRules];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= rules.length) return prev;
      [rules[index], rules[targetIndex]] = [rules[targetIndex], rules[index]];
      return { ...prev, documentRules: rules };
    });
  };

  const handleDragStart = (index: number, e: React.DragEvent<HTMLTableRowElement>) => {
    setDragIndex(index);
    dragNodeRef.current = e.currentTarget;
    e.dataTransfer.effectAllowed = 'move';
    // Make the drag image slightly transparent
    requestAnimationFrame(() => {
      if (dragNodeRef.current) dragNodeRef.current.style.opacity = '0.4';
    });
  };

  const handleDragOver = (index: number, e: React.DragEvent<HTMLTableRowElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragIndex === null || index === dragIndex) return;
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    if (dragNodeRef.current) dragNodeRef.current.style.opacity = '1';
    if (dragIndex !== null && dragOverIndex !== null && dragIndex !== dragOverIndex) {
      setTemplate(prev => {
        const rules = [...prev.documentRules];
        const [moved] = rules.splice(dragIndex, 1);
        rules.splice(dragOverIndex, 0, moved);
        return { ...prev, documentRules: rules };
      });
    }
    setDragIndex(null);
    setDragOverIndex(null);
    dragNodeRef.current = null;
  };

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      onSave();
    }, 1500);
  };

  const templateTitle = templateId ? template.name || 'Edit Template' : 'New Template';
  const allDocTypesUsed = usedDocTypes.length >= SUPPORTED_DOCUMENT_TYPES.length;

  return (
    <div className="flex flex-col h-full bg-[#f4f7fa]">
      {/* Toast */}
      <div aria-live="assertive" className="fixed top-4 right-4 z-50">
        {showToast && (
          <div role="alert" className="bg-[#1e8e3e] text-white px-5 py-3 rounded shadow-lg flex items-center space-x-2 text-sm font-medium">
            <Check size={16} aria-hidden="true" />
            <span>Template saved successfully</span>
          </div>
        )}
      </div>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 lg:px-6 pt-5 pb-4">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center text-xs text-slate-500 mb-2 font-medium list-none p-0">
            <li><span className="text-[#0077c8]">AI Docs</span></li>
            <li aria-hidden="true" className="mx-2">/</li>
            <li>
              <button className="text-[#0077c8] cursor-pointer hover:underline" onClick={onBack}>
                File Index Templates
              </button>
            </li>
            <li aria-hidden="true" className="mx-2">/</li>
            <li aria-current="page">{templateTitle}</li>
          </ol>
        </nav>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={onBack} aria-label="Back to templates" className="mr-3 text-slate-400 hover:text-slate-600">
              <ArrowLeft size={18} aria-hidden="true" />
            </button>
            <h1 className="text-xl font-bold text-slate-800">{templateTitle}</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="px-5 py-1.5 border border-slate-300 rounded text-xs font-bold text-slate-600 hover:bg-white hover:border-slate-400 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-[#0077c8] hover:bg-[#0066b0] text-white px-5 py-1.5 rounded text-xs font-bold shadow-sm transition-colors"
            >
              Save Template
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="space-y-6">
          {/* Template Details */}
          <fieldset className="bg-white rounded shadow-sm border border-slate-200">
            <legend className="px-5 py-4 border-b border-slate-200 bg-slate-50/50 text-base font-bold text-slate-700 w-full block">
              Template Details
            </legend>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="col-span-1">
                  <label htmlFor="template-name" className="block text-[10px] font-bold text-slate-500 mb-1">Template Name *</label>
                  <input
                    id="template-name"
                    type="text"
                    aria-required="true"
                    value={template.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    placeholder="e.g. Loan Onboarding QC"
                    className="w-full border border-slate-300 rounded-sm p-2 text-xs text-slate-700 focus:border-[#0077c8] outline-none"
                  />
                </div>
                <div className="col-span-1">
                  <label htmlFor="template-status" className="block text-[10px] font-bold text-slate-500 mb-1">Status</label>
                  <select
                    id="template-status"
                    value={template.status}
                    onChange={(e) => handleFieldChange('status', e.target.value)}
                    className="w-full border border-slate-300 rounded-sm p-2 text-xs text-slate-700 focus:border-[#0077c8] outline-none bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="template-description" className="block text-[10px] font-bold text-slate-500 mb-1">Description</label>
                <input
                  id="template-description"
                  type="text"
                  value={template.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  placeholder="Describe the purpose of this template"
                  className="w-full border border-slate-300 rounded-sm p-2 text-xs text-slate-700 focus:border-[#0077c8] outline-none"
                />
              </div>
            </div>
          </fieldset>

          {/* Document Type Rules */}
          <div className="bg-white rounded shadow-sm border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-base font-bold text-slate-700">Document Stacking Order</h2>
                <p className="text-[10px] text-slate-400 mt-0.5">Define required document types and their package order. Drag rows or use arrows to reorder.</p>
              </div>
              <button
                onClick={handleAddRule}
                disabled={allDocTypesUsed}
                className={`px-4 py-1.5 rounded text-xs font-bold flex items-center shadow-sm ${
                  allDocTypesUsed
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-[#0077c8] hover:bg-[#0066b0] text-white'
                }`}
              >
                <Plus size={14} className="mr-1.5" strokeWidth={3} aria-hidden="true" />
                Add Document Type
              </button>
            </div>

            {template.documentRules.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No document types added. Click "Add Document Type" to define the stacking order.
              </div>
            ) : (
              <table className="w-full text-xs text-left">
                <thead className="bg-[#f8fafc] text-slate-500 font-semibold border-b border-slate-200 sticky top-0 z-10">
                  <tr>
                    <th scope="col" className="w-8 px-1 py-3"><span className="sr-only">Drag</span></th>
                    <th scope="col" className="px-3 py-3 w-16 text-center">Order</th>
                    <th scope="col" className="px-4 py-3">Document Type</th>
                    <th scope="col" className="px-4 py-3 text-center">Required</th>
                    <th scope="col" className="px-4 py-3 text-center">Signature</th>
                    <th scope="col" className="px-4 py-3 text-center">Stamp</th>
                    <th scope="col" className="px-4 py-3 text-center">Recorded</th>
                    <th scope="col" className="px-3 py-3 w-20"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {template.documentRules.map((rule, index) => (
                    <tr
                      key={rule.id}
                      draggable
                      onDragStart={(e) => handleDragStart(index, e)}
                      onDragOver={(e) => handleDragOver(index, e)}
                      onDragEnd={handleDragEnd}
                      onDragLeave={() => setDragOverIndex(null)}
                      className={`transition-colors ${
                        dragOverIndex === index && dragIndex !== index
                          ? 'bg-blue-50 border-t-2 border-t-[#0077c8]'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      {/* Drag Handle */}
                      <td className="w-8 px-1 py-2.5 text-center">
                        <span className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500" aria-label={`Drag to reorder ${rule.documentTypeName || 'document'}`}>
                          <GripVertical size={14} aria-hidden="true" />
                        </span>
                      </td>
                      {/* Order + Move */}
                      <td className="px-3 py-2.5 text-center">
                        <div className="flex flex-col items-center space-y-0.5">
                          <button
                            onClick={() => handleMoveRule(index, 'up')}
                            disabled={index === 0}
                            aria-label={`Move ${rule.documentTypeName || 'document'} up`}
                            className={`p-0.5 rounded ${index === 0 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-[#0077c8] hover:bg-slate-100'}`}
                          >
                            <ChevronUp size={12} aria-hidden="true" />
                          </button>
                          <span className="text-[10px] font-bold text-slate-400 w-5 text-center">{index + 1}</span>
                          <button
                            onClick={() => handleMoveRule(index, 'down')}
                            disabled={index === template.documentRules.length - 1}
                            aria-label={`Move ${rule.documentTypeName || 'document'} down`}
                            className={`p-0.5 rounded ${index === template.documentRules.length - 1 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-[#0077c8] hover:bg-slate-100'}`}
                          >
                            <ChevronDown size={12} aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                      {/* Document Type Dropdown */}
                      <td className="px-4 py-2.5">
                        <label className="sr-only" htmlFor={`rule-type-${rule.id}`}>Document type</label>
                        <select
                          id={`rule-type-${rule.id}`}
                          value={rule.documentTypeName}
                          onChange={(e) => handleRuleChange(rule.id, 'documentTypeName', e.target.value)}
                          className="w-full border border-slate-300 rounded-sm p-2 text-xs text-slate-700 focus:border-[#0077c8] outline-none bg-white"
                        >
                          {!rule.documentTypeName && <option value="">-- Select Document Type --</option>}
                          {SUPPORTED_DOCUMENT_TYPES.map(dt => {
                            const isUsedByOther = usedDocTypes.includes(dt) && dt !== rule.documentTypeName;
                            return (
                              <option key={dt} value={dt} disabled={isUsedByOther}>
                                {dt}{isUsedByOther ? ' (already added)' : ''}
                              </option>
                            );
                          })}
                        </select>
                      </td>
                      {/* Toggle pills */}
                      <td className="px-4 py-2.5 text-center">
                        <TogglePill
                          checked={rule.required}
                          onChange={(v) => handleRuleChange(rule.id, 'required', v)}
                          label={`${rule.documentTypeName || 'Document'} required`}
                        />
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <TogglePill
                          checked={rule.signatureRequired}
                          onChange={(v) => handleRuleChange(rule.id, 'signatureRequired', v)}
                          label={`${rule.documentTypeName || 'Document'} signature required`}
                        />
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <TogglePill
                          checked={rule.stampRequired}
                          onChange={(v) => handleRuleChange(rule.id, 'stampRequired', v)}
                          label={`${rule.documentTypeName || 'Document'} stamp required`}
                        />
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <TogglePill
                          checked={rule.recordedRequired}
                          onChange={(v) => handleRuleChange(rule.id, 'recordedRequired', v)}
                          label={`${rule.documentTypeName || 'Document'} recorded required`}
                        />
                      </td>
                      {/* Remove */}
                      <td className="px-3 py-2.5 text-center">
                        <button
                          onClick={() => handleRemoveRule(rule.id)}
                          aria-label={`Remove ${rule.documentTypeName || 'document type'}`}
                          className="text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Summary footer */}
            {template.documentRules.length > 0 && (
              <div className="px-5 py-3 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between text-[10px] text-slate-500">
                <span>{template.documentRules.length} document type{template.documentRules.length !== 1 ? 's' : ''} in stacking order</span>
                <span>{template.documentRules.filter(r => r.required).length} required</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Toggle pill sub-component
const TogglePill: React.FC<{ checked: boolean; onChange: (v: boolean) => void; label: string }> = ({ checked, onChange, label }) => (
  <label className="inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="sr-only"
      aria-label={label}
    />
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold transition-colors ${
        checked ? 'bg-[#0077c8] text-white' : 'bg-slate-200 text-slate-500'
      }`}
      aria-hidden="true"
    >
      {checked ? 'Yes' : 'No'}
    </span>
  </label>
);
