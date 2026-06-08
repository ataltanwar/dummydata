import { Moon, Sun } from 'lucide-react';
import Notch from './Notch';

interface NavbarProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export default function Navbar({ isDark, onToggleTheme }: NavbarProps) {

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border-primary bg-bg-base-translucent backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* logo */}
          <div className="relative flex items-center">
            <span className="absolute left-0 -top-4.5 tracking-tight text-[19px] font-semibold text-text-primary leading-none" style={{ fontFamily: "Unbounded" }}>
              dummy <br /> Data
              <Notch className="relative bottom-5 left-15 w-6 h-5.5" />
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleTheme}
              className={`inline-flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3d5afe]/60 ${
                isDark
                  ? 'bg-bg-surface border-border-primary text-text-slate-200 hover:text-text-primary hover:border-[#ffd230]/20'
                  : 'bg-bg-surface border-border-primary text-text-slate-200 hover:text-text-primary hover:border-[#615fff]/50'
              }`}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-300" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-500" />
              )}
              <span className="hidden sm:inline">{isDark ? 'Light' : 'Dark'}</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
