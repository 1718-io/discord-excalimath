import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
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
              Applicable under French Law
            </span>
          </div>

          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Privacy Policy</h1>
              <p className="text-xs text-slate-400 mt-1">Last updated: October 16, 2026</p>
            </div>
          </div>

          {/* Legal Content */}
          <div className="mt-8 space-y-8 text-slate-300 text-sm leading-relaxed">
            <section className="bg-slate-950/40 p-5 rounded-2xl border border-slate-800/50">
              <h2 className="text-base font-semibold text-white mb-2">1. Preamble & Nature of the Service</h2>
              <p className="text-slate-400">
                This application is a free, non-commercial collaborative whiteboard tool designed strictly for 
                <strong className="text-slate-200"> academic, educational, and experimental usage</strong> within Discord. It is provided &quot;as is&quot; 
                and &quot;as available&quot; by an independent developer for educational and community collaboration purposes.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold text-white">2. Data Collection & Processing (GDPR Compliance)</h2>
              <p className="text-slate-400">
                In accordance with Regulation (EU) 2016/679 (GDPR) and French data protection laws (Loi Informatique et Libertés), data collection is strictly minimized:
              </p>
              <ul className="space-y-2 text-slate-400 pl-4 border-l-2 border-indigo-500/30">
                <li><strong className="text-slate-200">Discord User Identity:</strong> Temporary SDK identifiers (such as user IDs or avatars) are processed transiently solely for real-time collaboration.</li>
                <li><strong className="text-slate-200">Whiteboard Content:</strong> Drawings, equations, and canvas notes are processed in real time. We do not monetize, profile, or permanently archive content.</li>
                <li><strong className="text-slate-200">Cookies & Trackers:</strong> No tracking cookies, analytics pixels, or advertising trackers are used.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-white">3. Hosting & Infrastructure</h2>
              <p className="text-slate-400">
                Frontend and backend services rely on third-party cloud infrastructure (e.g., Cloudflare, Render). Technical access logs are processed strictly as necessary for secure operation under European standards.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-white">4. User Rights</h2>
              <p className="text-slate-400">
                Given the academic and ephemeral nature of the service, cached data is minimal. Inquiries regarding data processing can be directed through community and repository channels.
              </p>
            </section>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-xs text-slate-500 flex justify-center gap-4">
          <a href="/terms" className="hover:text-slate-400 transition-colors">Terms of Service</a>
          <span>•</span>
          <span>Academic & Non-Commercial Activity</span>
        </footer>

      </div>
    </div>
  );
};