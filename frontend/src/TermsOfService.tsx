import React from 'react';
import { FileText, ArrowLeft } from 'lucide-react';

export const TermsOfService: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto scroll-smooth custom-scrollbar bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Background Gradient Orbs */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-indigo-500/10 blur-[120px] rounded-full" />

      <div className="relative min-h-full flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        
        {/* Main Content Card */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800/80 shadow-2xl shadow-slate-950/50 rounded-3xl p-6 sm:p-12 transition-all">
          
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-8 mb-8 border-b border-slate-800">
            <a 
              href="/" 
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-400 hover:text-indigo-400 transition-colors w-fit group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back to Whiteboard
            </a>

            <span className="text-xs font-mono text-slate-500 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-800 w-fit">
              Governed by French Law
            </span>
          </div>

          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Terms of Service</h1>
              <p className="text-xs text-slate-400 mt-1">Academic & Non-Commercial License • Updated Oct 2026</p>
            </div>
          </div>

          {/* Legal Content */}
          <div className="mt-8 space-y-8 text-slate-300 text-sm leading-relaxed">
            <section className="bg-slate-950/40 p-5 rounded-2xl border border-slate-800/50">
              <h2 className="text-base font-semibold text-white mb-2">1. Scope & Purpose</h2>
              <p className="text-slate-400">
                These terms govern access to this Discord Activity whiteboard application. Access is provided exclusively for 
                <strong className="text-slate-200"> academic, educational, and experimental purposes</strong>.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold text-white">2. Limitation of Liability (French Law / Articles 1231-1 Code Civil)</h2>
              <p className="text-slate-400">
                To the maximum extent permitted by French law:
              </p>
              <ul className="space-y-2 text-slate-400 pl-4 border-l-2 border-indigo-500/30">
                <li><strong className="text-slate-200">Free Service:</strong> Offered on a benevolent, free-of-charge (&quot;à titre gratuit&quot;) and &quot;AS IS&quot; basis without warranties of uptime, performance, or availability.</li>
                <li><strong className="text-slate-200">No Direct/Indirect Liability:</strong> The developer is exempt from liability for any data loss, service interruptions, or classroom disruptions.</li>
                <li><strong className="text-slate-200">User Content:</strong> Users hold full responsibility for drawings, math equations, and materials shared during sessions.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-white">3. Acceptable Conduct</h2>
              <p className="text-slate-400">
                Harassment, malicious code execution, or unauthorized uploading of copyrighted material is strictly prohibited. Access may be suspended at any time in case of misuse.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-white">4. Jurisdiction & Governing Law</h2>
              <p className="text-slate-400">
                These terms are governed exclusively by the <strong className="text-slate-200">laws of France</strong>. Any legal dispute shall be submitted to the exclusive jurisdiction of the competent French courts (Paris, France).
              </p>
            </section>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-xs text-slate-500 flex justify-center gap-4">
          <a href="/privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
          <span>•</span>
          <span>Academic & Non-Commercial Activity</span>
        </footer>

      </div>
    </div>
  );
};