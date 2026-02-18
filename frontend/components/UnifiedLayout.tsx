import React from 'react';
import {
  Search,
  Shield,
  Box,
  Files,
  LayoutGrid,
  ArrowRightLeft,
  UserCircle,
  MessageSquare
} from 'lucide-react';
import { ActiveService, DocAuditTab } from '../types';

interface UnifiedLayoutProps {
  children: React.ReactNode;
  activeService: ActiveService;
  onServiceChange: (service: ActiveService) => void;
  reconTab: 'Dashboard' | 'Access Controls' | 'Configurations';
  onReconTabChange: (tab: 'Dashboard' | 'Access Controls' | 'Configurations') => void;
  docAuditTab: DocAuditTab;
  onDocAuditTabChange: (tab: DocAuditTab) => void;
}

const SidebarItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean }> = ({ icon, label, active }) => (
  <button
    className={`flex flex-col items-center justify-center py-3 cursor-pointer transition-all duration-200 w-16 mx-auto rounded-lg mb-2 border-0 bg-transparent ${active ? 'bg-white text-[#0077c8]' : 'text-white hover:bg-[#0066b0]'}`}
    aria-current={active ? 'page' : undefined}
    title={label}
  >
    <div className="mb-1" aria-hidden="true">{icon}</div>
    <span className="text-[10px] font-medium tracking-wide">{label}</span>
  </button>
);

const SERVICE_CONFIG: { key: ActiveService; label: string; color: string }[] = [
  { key: 'aiDocs', label: 'AI Docs', color: '#0077c8' },
  { key: 'advancedRecon', label: 'Advanced Recon', color: '#334155' },
  { key: 'docAudit', label: 'Doc Audit', color: '#4f46e5' },
];

export const UnifiedLayout: React.FC<UnifiedLayoutProps> = ({
  children,
  activeService,
  onServiceChange,
  reconTab,
  onReconTabChange,
  docAuditTab,
  onDocAuditTabChange,
}) => {
  const activeColor = SERVICE_CONFIG.find(s => s.key === activeService)?.color ?? '#0077c8';

  return (
    <div className="flex h-screen bg-[#f4f7fa] overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-20 bg-[#0077c8] flex flex-col flex-shrink-0 overflow-y-auto no-scrollbar items-center py-4" aria-label="Main navigation">
        <div className="mb-6 text-white">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Dara home">
            <path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2Z" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M7 12H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>

        <nav className="flex-1 w-full">
          <SidebarItem icon={<Search size={20} strokeWidth={1.5} />} label="Search" />
          <SidebarItem icon={<Shield size={20} strokeWidth={1.5} />} label="Compliance" />
          <SidebarItem icon={<Box size={20} strokeWidth={1.5} />} label="Core" />
          <SidebarItem icon={<Files size={20} strokeWidth={1.5} />} label="Docs" active />
          <SidebarItem icon={<LayoutGrid size={20} strokeWidth={1.5} />} label="Default" />
          <SidebarItem icon={<ArrowRightLeft size={20} strokeWidth={1.5} />} label="Transfer" />
          <SidebarItem icon={<UserCircle size={20} strokeWidth={1.5} />} label="Profile" />
          <SidebarItem icon={<MessageSquare size={20} strokeWidth={1.5} />} label="Messages" />
        </nav>
      </aside>

      {/* Main Content */}
      <main id="main-content" tabIndex={-1} className="flex-1 flex flex-col overflow-hidden">
        {/* Service Selector Bar */}
        <div className="bg-white border-b border-slate-200 px-6 py-2 flex items-center space-x-2">
          {SERVICE_CONFIG.map(({ key, label, color }) => (
            <button
              key={key}
              onClick={() => onServiceChange(key)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors border-0 cursor-pointer ${
                activeService === key
                  ? 'text-white shadow-sm'
                  : 'bg-transparent text-slate-600 hover:bg-slate-100'
              }`}
              style={activeService === key ? { backgroundColor: color } : undefined}
              aria-current={activeService === key ? 'true' : undefined}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Service-Specific Tab Bar */}
        {activeService === 'advancedRecon' && (
          <div className="bg-white border-b border-slate-200 px-6 py-0 flex items-end">
            <div className="flex space-x-8" role="tablist" aria-label="Reconciliation views">
              {(['Dashboard', 'Access Controls', 'Configurations'] as const).map((tab) => (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={reconTab === tab}
                  onClick={() => onReconTabChange(tab)}
                  className={`py-3 text-sm font-medium border-b-2 transition-colors border-0 bg-transparent cursor-pointer ${
                    reconTab === tab
                      ? 'border-[#0077c8] text-slate-800 font-semibold'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeService === 'docAudit' && (
          <div className="bg-white border-b border-slate-200 px-6 py-0 flex items-end">
            <div className="flex space-x-8" role="tablist" aria-label="Doc Audit views">
              {(['Dashboard', 'SOT Management', 'Settings'] as const).map((tab) => (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={docAuditTab === tab}
                  onClick={() => onDocAuditTabChange(tab)}
                  className={`py-3 text-sm font-medium border-b-2 transition-colors border-0 bg-transparent cursor-pointer ${
                    docAuditTab === tab
                      ? 'border-[#4f46e5] text-slate-800 font-semibold'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
};
