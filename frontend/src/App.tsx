const toolbarItems = ['Pen', 'Text', 'Shapes', 'Math', 'Erase'];

export default function App() {
  return (
    <main className="h-[100vh] w-[100vw] overflow-hidden bg-[#090b10] text-zinc-100 antialiased">
      <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#111827]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.18),_transparent_30%),linear-gradient(180deg,#0b1020_0%,#111827_100%)]" />

        <header className="relative z-10 flex items-center justify-between border-b border-white/10 bg-[#0b1020]/80 px-4 py-3 backdrop-blur-sm sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/20 text-xs font-semibold text-violet-200">
              E
            </div>
            <div>
              <p className="max-[359px]:hidden text-[10px] uppercase tracking-[0.2em] text-zinc-400">Voice room</p>
              <h1 className="text-sm font-semibold text-white">ExcaliMath</h1>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="max-[359px]:hidden">Room live</span>
          </div>
        </header>

        <div className="relative z-10 flex flex-1 flex-col gap-3 overflow-hidden p-3 pb-4 sm:gap-4 sm:p-5 max-[359px]:gap-2 max-[359px]:p-2 md:flex-row">
          <aside className="w-full shrink-0 rounded-2xl border border-white/10 bg-[#111827]/90 p-3 shadow-2xl shadow-black/20 backdrop-blur-sm md:w-[220px]">
            <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-zinc-400 md:mb-3">
              <span>Tools</span>
              <span>12</span>
            </div>

            <div className="flex flex-row flex-wrap gap-2 max-[359px]:gap-1 md:flex-col">
              {toolbarItems.map((tool) => (
                <button
                  key={tool}
                  type="button"
                  className="flex min-w-0 flex-1 items-center justify-between rounded-xl border border-white/5 bg-zinc-900/90 px-3 py-2 text-left text-sm text-zinc-200 transition hover:border-violet-500/40 hover:text-white max-[420px]:justify-center max-[420px]:px-1 max-[420px]:text-xs md:flex-initial md:min-w-0 md:justify-between md:px-3 md:text-sm"
                >
                  <span className="max-[420px]:hidden md:inline">{tool}</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">{tool[0]}</span>
                </button>
              ))}
            </div>
          </aside>

          <section className="relative min-h-[120px] min-w-0 flex-1 overflow-hidden rounded-[2rem] border border-violet-500/30 bg-white/5 shadow-[0_0_80px_rgba(139,92,246,0.16)] backdrop-blur-[1px] md:min-h-[240px]">
            <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:28px_28px]" />

            <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center pb-6">
              <div className="rounded-full border border-white/10 bg-[#0f172a]/80 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-zinc-300 shadow-lg shadow-black/20">
                Collaborative sketch surface
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
