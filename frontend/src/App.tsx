import { useState, type CSSProperties } from 'react';
import { Dices, Moon, Sun } from 'lucide-react';

const toolbarItems = ['Pen', 'Text', 'Shapes', 'Math', 'Erase'];

const themeFamilies = [
  { name: 'Crimson', hue: 350 },
  { name: 'Rose', hue: 330 },
  { name: 'Fuchsia', hue: 300 },
  { name: 'Violet', hue: 275 },
  { name: 'Indigo', hue: 250 },
  { name: 'Azure', hue: 230 },
  { name: 'Blue', hue: 210 },
  { name: 'Cyan', hue: 190 },
  { name: 'Teal', hue: 175 },
  { name: 'Emerald', hue: 155 },
  { name: 'Green', hue: 135 },
  { name: 'Lime', hue: 105 },
  { name: 'Gold', hue: 52 },
  { name: 'Amber', hue: 38 },
  { name: 'Coral', hue: 15 },
] as const;

const themeProfiles = [
  { name: 'Muted', saturation: 48 },
  { name: 'Soft', saturation: 60 },
  { name: 'Balanced', saturation: 72 },
  { name: 'Vivid', saturation: 84 },
  { name: 'Electric', saturation: 96 },
] as const;

const themes = themeFamilies.flatMap((family) =>
  themeProfiles.map((profile) => ({
    name: `${family.name} · ${profile.name}`,
    hue: family.hue,
    saturation: profile.saturation,
  })),
);

type ThemeMode = 'day' | 'night';
type Theme = { name: string; hue: number; saturation: number; mode: ThemeMode };
type ThemeCSSProperties = CSSProperties & { [property: `--${string}`]: string | number };

const darkThemes: Theme[] = themes.map((theme) => ({ ...theme, mode: 'night' }));
const lightThemes: Theme[] = themes.map((theme) => ({ ...theme, mode: 'day' }));
const defaultTheme = lightThemes.find((theme) => theme.name === 'Violet · Balanced') ?? lightThemes[0];

const getThemeStyle = (theme: Theme, mode: ThemeMode): ThemeCSSProperties => ({
  '--theme-hue': theme.hue,
  '--theme-saturation': `${theme.saturation}%`,
  '--app-bg': mode === 'night' ? `hsl(${theme.hue} 24% 5%)` : `hsl(${theme.hue} 25% 96%)`,
  '--shell-bg': mode === 'night' ? `hsl(${theme.hue} 28% 10%)` : `hsl(${theme.hue} 28% 92%)`,
  '--header-bg': mode === 'night' ? `hsl(${theme.hue} 30% 8% / 0.9)` : `hsl(${theme.hue} 35% 98% / 0.94)`,
  '--panel-bg': mode === 'night' ? `hsl(${theme.hue} 28% 12% / 0.94)` : `hsl(${theme.hue} 30% 99% / 0.94)`,
  '--tool-bg': mode === 'night' ? `hsl(${theme.hue} 22% 10% / 0.94)` : `hsl(${theme.hue} 22% 94% / 0.96)`,
  '--canvas-bg': mode === 'night' ? `hsl(${theme.hue} 20% 16% / 0.9)` : `hsl(${theme.hue} 30% 100% / 0.82)`,
  '--text-primary': mode === 'night' ? '#f4f4f5' : '#18181b',
  '--text-secondary': mode === 'night' ? '#d4d4d8' : '#3f3f46',
  '--text-muted': mode === 'night' ? '#a1a1aa' : '#52525b',
  '--status-text': mode === 'night' ? '#6ee7b7' : '#047857',
  '--accent-bg': mode === 'night' ? `hsl(${theme.hue} ${theme.saturation}% 22%)` : `hsl(${theme.hue} ${theme.saturation}% 90%)`,
  '--accent-border': mode === 'night' ? `hsl(${theme.hue} ${theme.saturation}% 70% / 0.55)` : `hsl(${theme.hue} ${theme.saturation}% 38% / 0.65)`,
  '--accent-glow': mode === 'night' ? `hsl(${theme.hue} ${theme.saturation}% 55% / 0.16)` : `hsl(${theme.hue} ${theme.saturation}% 48% / 0.1)`,
});

export default function App() {
  const [mode, setMode] = useState<ThemeMode>('day');
  const [activeTheme, setActiveTheme] = useState<Theme>(defaultTheme);
  const themeStyle = getThemeStyle(activeTheme, mode);

  const chooseRandomTheme = () => {
    const availableThemes = mode === 'day' ? lightThemes : darkThemes;
    const alternatives = availableThemes.filter((theme) => theme.name !== activeTheme.name);
    const nextTheme = alternatives[Math.floor(Math.random() * alternatives.length)];

    if (nextTheme) {
      setActiveTheme(nextTheme);
    }
  };

  const toggleMode = () => {
    const nextMode = mode === 'day' ? 'night' : 'day';
    const nextThemes = nextMode === 'day' ? lightThemes : darkThemes;
    const matchingTheme = nextThemes.find((theme) => theme.name === activeTheme.name);

    setMode(nextMode);
    if (matchingTheme) {
      setActiveTheme(matchingTheme);
    }
  };

  return (
    <main
      data-theme={`${mode}-${activeTheme.name}`}
      data-theme-mode={mode}
      style={themeStyle}
      className="h-[100vh] w-[100vw] overflow-hidden bg-[var(--app-bg)] text-[var(--text-primary)] antialiased"
    >
      <div className="relative flex h-full w-full flex-col overflow-hidden bg-[var(--shell-bg)]">
        <div className="absolute inset-0 [background:radial-gradient(circle_at_top,hsl(var(--theme-hue)_var(--theme-saturation)_55%_/_0.18),transparent_30%),linear-gradient(180deg,var(--shell-bg)_0%,var(--app-bg)_100%)]" />

        <header className="relative z-10 flex items-center justify-between border-b border-black/10 bg-[var(--header-bg)] px-4 py-3 backdrop-blur-sm sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-bg)] text-xs font-semibold text-[var(--text-primary)]">
              E
            </div>
            <div>
              <p className="max-[359px]:hidden text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Voice room</p>
              <h1 className="text-sm font-semibold text-[var(--text-primary)]">ExcaliMath</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={chooseRandomTheme}
              aria-label={`Choose a random ${mode === 'day' ? 'light' : 'dark'} theme. Current theme: ${activeTheme.name}`}
              title={`Random ${mode === 'day' ? 'light' : 'dark'} theme`}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/15 bg-[var(--accent-bg)] text-[var(--text-primary)] transition hover:border-[var(--accent-border)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--text-primary)]"
            >
              <Dices aria-hidden="true" size={16} strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={toggleMode}
              aria-label={`Switch to ${mode === 'day' ? 'night dark' : 'day light'} mode`}
              title={`Switch to ${mode === 'day' ? 'night' : 'day'} mode`}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/15 bg-[var(--panel-bg)] text-[var(--text-secondary)] transition hover:text-[var(--text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--text-primary)]"
            >
              {mode === 'day' ? (
                <Moon aria-hidden="true" size={16} strokeWidth={2} />
              ) : (
                <Sun aria-hidden="true" size={16} strokeWidth={2} />
              )}
            </button>
            <span className="sr-only" role="status" aria-live="polite">
              {mode === 'day' ? 'Day light mode' : 'Night dark mode'}, theme {activeTheme.name}
            </span>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-700/40 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--status-text)]">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="max-[359px]:hidden">Room live</span>
            </div>
          </div>
        </header>

        <div className="relative z-10 flex flex-1 flex-col gap-3 overflow-hidden p-3 pb-4 sm:gap-4 sm:p-5 max-[359px]:gap-2 max-[359px]:p-2 md:flex-row">
          <aside className="w-full shrink-0 rounded-2xl border border-black/10 bg-[var(--panel-bg)] p-3 shadow-2xl shadow-black/10 backdrop-blur-sm md:w-[220px]">
            <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)] md:mb-3">
              <span>Tools</span>
              <span>12</span>
            </div>

            <div className="flex flex-row flex-wrap gap-2 max-[359px]:gap-1 md:flex-col">
              {toolbarItems.map((tool) => (
                <button
                  key={tool}
                  type="button"
                  className="flex min-w-0 flex-1 items-center justify-between rounded-xl border border-black/10 bg-[var(--tool-bg)] px-3 py-2 text-left text-sm text-[var(--text-secondary)] transition hover:border-[var(--accent-border)] hover:text-[var(--text-primary)] max-[420px]:justify-center max-[420px]:px-1 max-[420px]:text-xs md:flex-initial md:min-w-0 md:justify-between md:px-3 md:text-sm"
                >
                  <span className="max-[420px]:hidden md:inline">{tool}</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">{tool[0]}</span>
                </button>
              ))}
            </div>
          </aside>

          <section className="relative min-h-[120px] min-w-0 flex-1 overflow-hidden rounded-[2rem] border border-[var(--accent-border)] bg-[var(--canvas-bg)] shadow-[0_0_80px_var(--accent-glow)] backdrop-blur-[1px] md:min-h-[240px]">
            <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:28px_28px]" />

            <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center pb-6">
              <div className="rounded-full border border-black/10 bg-[var(--header-bg)] px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-[var(--text-secondary)] shadow-lg shadow-black/10">
                Collaborative sketch surface
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
