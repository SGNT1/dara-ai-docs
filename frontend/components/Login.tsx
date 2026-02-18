import React from 'react';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <main id="main-content" className="min-h-screen flex items-center justify-center bg-[#f4f7fa]">
      <div className="bg-white p-10 rounded shadow-sm border border-slate-200 w-[400px] flex flex-col items-center">
        {/* Logo */}
        <div className="mb-10 flex flex-col items-center">
          <div className="w-16 h-16 mb-2 text-[#33b5e5]">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full" role="img" aria-label="Dara logo">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M8 11h8" />
                <path d="M12 7v8" />
             </svg>
          </div>
          <h1 className="text-4xl font-bold text-slate-700 tracking-tight mb-1">Dara</h1>
          <p className="text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase">By SAGENT</p>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="w-full space-y-6">
          <div>
            <label htmlFor="email-input" className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Email ID *</label>
            <input
              id="email-input"
              type="email"
              placeholder="user@company.com"
              aria-required="true"
              className="w-full border border-slate-300 rounded-sm p-2.5 text-sm text-slate-700 focus:outline-none focus:border-[#0077c8] transition-colors placeholder-slate-400"
            />
          </div>

          <button
            type="button"
            onClick={onLogin}
            className="w-full bg-[#0077c8] hover:bg-[#0066b0] text-white font-bold py-2.5 rounded-sm transition-colors text-sm shadow-sm"
          >
            Sign In
          </button>
        </form>
      </div>
    </main>
  );
};
