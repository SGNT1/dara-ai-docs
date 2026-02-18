import React, { useState } from 'react';
import { Login } from './components/Login';
import { UnifiedLayout } from './components/UnifiedLayout';
import { BatchList } from './components/BatchList';
import { BatchDetails } from './components/BatchDetails';
import { ProcessingReport } from './components/ProcessingReport';
import { DocumentViewer } from './components/DocumentViewer';
import { ReconDashboard } from './components/ReconDashboard';
import { ReconBatchDetail } from './components/ReconBatchDetail';
import { ReconLoanInvoice } from './components/ReconLoanInvoice';
import { ReconLoanInvoiceV2 } from './components/ReconLoanInvoiceV2';
import { ReconAccessControls } from './components/ReconAccessControls';
import { ReconConfigurations } from './components/ReconConfigurations';
import { FileIndexTemplates } from './components/FileIndexTemplates';
import { FileIndexTemplateEditor } from './components/FileIndexTemplateEditor';
import { ReconUploadWizard } from './components/ReconUploadWizard';
import { DocAuditDashboard } from './components/DocAuditDashboard';
import { DocAuditLoanList } from './components/DocAuditLoanList';
import { DocAuditLoanDetail } from './components/DocAuditLoanDetail';
import { DocAuditSOTManagement } from './components/DocAuditSOTManagement';
import { DocAuditSettings } from './components/DocAuditSettings';
import { DocAuditUploadWizard } from './components/DocAuditUploadWizard';
import { ViewState, ActiveService, DocAuditTab } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('login');
  const [activeService, setActiveService] = useState<ActiveService>('aiDocs');
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [selectedReconBatchId, setSelectedReconBatchId] = useState<string | null>(null);
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);
  const [reconTab, setReconTab] = useState<'Dashboard' | 'Access Controls' | 'Configurations'>('Dashboard');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [selectedAuditId, setSelectedAuditId] = useState<string | null>(null);
  const [selectedAuditLoanId, setSelectedAuditLoanId] = useState<string | null>(null);
  const [docAuditTab, setDocAuditTab] = useState<DocAuditTab>('Dashboard');

  // ── Service Switching ──
  const handleServiceChange = (service: ActiveService) => {
    setActiveService(service);
    if (service === 'aiDocs') setCurrentView('batchList');
    if (service === 'advancedRecon') { setCurrentView('reconDashboard'); setReconTab('Dashboard'); }
    if (service === 'docAudit') { setCurrentView('docAuditDashboard'); setDocAuditTab('Dashboard'); }
  };

  // ── Login ──
  const handleLogin = () => {
    setActiveService('aiDocs');
    setCurrentView('batchList');
  };

  // ── AI Docs Handlers ──
  const handleNavigateToBatchDetails = (batchId: string) => {
    setSelectedBatchId(batchId);
    setCurrentView('batchDetails');
  };

  const handleNavigateToReport = () => {
    setCurrentView('processingReport');
  };

  const handleNavigateToDocument = (fileId: string) => {
    setSelectedFileId(fileId);
    setCurrentView('documentViewer');
  };

  const handleBackToBatchList = () => {
    setCurrentView('batchList');
    setSelectedBatchId(null);
  };

  const handleBackToBatchDetails = () => {
    setCurrentView('batchDetails');
    setSelectedFileId(null);
  };

  // ── Advanced Recon Handlers ──
  const handleNavigateToReconBatch = (batchId: string) => {
    setSelectedReconBatchId(batchId);
    setCurrentView('reconBatchDetail');
  };

  const handleNavigateToReconLoan = (loanId: string) => {
    setSelectedLoanId(loanId);
    setCurrentView('reconLoanInvoice');
  };

  const handleBackToReconDashboard = () => {
    setCurrentView('reconDashboard');
    setSelectedReconBatchId(null);
  };

  const handleNavigateToReconLoanV2 = (loanId: string) => {
    setSelectedLoanId(loanId);
    setCurrentView('reconLoanInvoiceV2');
  };

  const handleBackToReconBatchDetail = () => {
    setCurrentView('reconBatchDetail');
    setSelectedLoanId(null);
  };

  // ── File Index Template Handlers ──
  const handleNavigateToFileIndexTemplates = () => {
    setCurrentView('fileIndexTemplates');
  };

  const handleNavigateToFileIndexTemplateEditor = (templateId: string | null) => {
    setSelectedTemplateId(templateId);
    setCurrentView('fileIndexTemplateEditor');
  };

  const handleBackToFileIndexTemplates = () => {
    setCurrentView('fileIndexTemplates');
    setSelectedTemplateId(null);
  };

  const handleFileIndexTemplateSave = () => {
    setCurrentView('fileIndexTemplates');
    setSelectedTemplateId(null);
  };

  // ── Recon Upload Handlers ──
  const handleNavigateToReconUpload = () => {
    setCurrentView('reconUploadWizard');
  };

  const handleReconUploadComplete = () => {
    setCurrentView('reconDashboard');
  };

  // ── Doc Audit Handlers ──
  const handleNavigateToDocAudit = (auditId: string) => {
    setSelectedAuditId(auditId);
    setCurrentView('docAuditLoanList');
  };

  const handleNavigateToDocAuditLoan = (loanId: string) => {
    setSelectedAuditLoanId(loanId);
    setCurrentView('docAuditLoanDetail');
  };

  const handleBackToDocAuditDashboard = () => {
    setCurrentView('docAuditDashboard');
    setSelectedAuditId(null);
  };

  const handleBackToDocAuditLoanList = () => {
    setCurrentView('docAuditLoanList');
    setSelectedAuditLoanId(null);
  };

  const handleNavigateToDocAuditUpload = () => {
    setCurrentView('docAuditUploadWizard');
  };

  const handleDocAuditUploadComplete = () => {
    setCurrentView('docAuditDashboard');
  };

  // Skip navigation link
  const skipNav = (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-[#0077c8] focus:rounded focus:shadow-lg"
    >
      Skip to main content
    </a>
  );

  if (currentView === 'login') {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <>
      {skipNav}
      <UnifiedLayout
        activeService={activeService}
        onServiceChange={handleServiceChange}
        reconTab={reconTab}
        onReconTabChange={setReconTab}
        docAuditTab={docAuditTab}
        onDocAuditTabChange={setDocAuditTab}
      >
        {/* ── AI Docs Views ── */}
        {activeService === 'aiDocs' && (
          <>
            {currentView === 'batchList' && (
              <BatchList onNavigateToDetails={handleNavigateToBatchDetails} onNavigateToTemplates={handleNavigateToFileIndexTemplates} />
            )}
            {currentView === 'fileIndexTemplates' && (
              <FileIndexTemplates onNavigateToEditor={handleNavigateToFileIndexTemplateEditor} onBack={handleBackToBatchList} />
            )}
            {currentView === 'fileIndexTemplateEditor' && (
              <FileIndexTemplateEditor templateId={selectedTemplateId} onBack={handleBackToFileIndexTemplates} onSave={handleFileIndexTemplateSave} />
            )}
            {currentView === 'batchDetails' && (
              <BatchDetails
                selectedBatchId={selectedBatchId}
                onNavigateToReport={handleNavigateToReport}
                onNavigateToDocument={handleNavigateToDocument}
                onBack={handleBackToBatchList}
                onSelectBatch={handleNavigateToBatchDetails}
              />
            )}
            {currentView === 'processingReport' && (
              <ProcessingReport
                selectedBatchId={selectedBatchId}
                onBack={handleBackToBatchDetails}
              />
            )}
            {currentView === 'documentViewer' && (
              <DocumentViewer
                selectedBatchId={selectedBatchId}
                selectedFileId={selectedFileId}
                onBack={handleBackToBatchDetails}
              />
            )}
          </>
        )}

        {/* ── Advanced Recon Views ── */}
        {activeService === 'advancedRecon' && (
          <>
            {reconTab === 'Access Controls' && <ReconAccessControls />}
            {reconTab === 'Configurations' && <ReconConfigurations />}
            {reconTab === 'Dashboard' && (
              <>
                {currentView === 'reconDashboard' && (
                  <ReconDashboard onNavigateToBatch={handleNavigateToReconBatch} onNavigateToUpload={handleNavigateToReconUpload} />
                )}
                {currentView === 'reconUploadWizard' && (
                  <ReconUploadWizard onBack={handleBackToReconDashboard} onComplete={handleReconUploadComplete} />
                )}
                {currentView === 'reconBatchDetail' && (
                  <ReconBatchDetail
                    selectedBatchId={selectedReconBatchId}
                    onNavigateToLoan={handleNavigateToReconLoan}
                    onNavigateToLoanV2={handleNavigateToReconLoanV2}
                    onBack={handleBackToReconDashboard}
                  />
                )}
                {currentView === 'reconLoanInvoice' && (
                  <ReconLoanInvoice
                    selectedLoanId={selectedLoanId}
                    onBack={handleBackToReconBatchDetail}
                  />
                )}
                {currentView === 'reconLoanInvoiceV2' && (
                  <ReconLoanInvoiceV2
                    selectedLoanId={selectedLoanId}
                    onBack={handleBackToReconBatchDetail}
                  />
                )}
              </>
            )}
          </>
        )}

        {/* ── Doc Audit Views ── */}
        {activeService === 'docAudit' && (
          <>
            {docAuditTab === 'SOT Management' && <DocAuditSOTManagement />}
            {docAuditTab === 'Settings' && <DocAuditSettings />}
            {docAuditTab === 'Dashboard' && (
              <>
                {currentView === 'docAuditDashboard' && (
                  <DocAuditDashboard onNavigateToAudit={handleNavigateToDocAudit} onNavigateToUpload={handleNavigateToDocAuditUpload} />
                )}
                {currentView === 'docAuditUploadWizard' && (
                  <DocAuditUploadWizard onBack={handleBackToDocAuditDashboard} onComplete={handleDocAuditUploadComplete} />
                )}
                {currentView === 'docAuditLoanList' && (
                  <DocAuditLoanList
                    selectedAuditId={selectedAuditId}
                    onNavigateToLoan={handleNavigateToDocAuditLoan}
                    onBack={handleBackToDocAuditDashboard}
                  />
                )}
                {currentView === 'docAuditLoanDetail' && (
                  <DocAuditLoanDetail
                    selectedLoanId={selectedAuditLoanId}
                    onBack={handleBackToDocAuditLoanList}
                  />
                )}
              </>
            )}
          </>
        )}
      </UnifiedLayout>
    </>
  );
};

export default App;
