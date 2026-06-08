import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Identifiers from './pages/Identifiers';
import Notch from './components/Notch';
import { ToastProvider } from './components/Toast';
import { motion, AnimatePresence } from 'motion/react';
import { CodeXml } from 'lucide-react';
import AtalLogo from './components/AtalLogo';

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  const isDark = theme === 'dark';

  return (
    <ToastProvider>
      <div className="flex-1 bg-bg-base text-text-primary flex flex-col font-sans selection:bg-indigo-500/30">
        
        <Navbar
          isDark={isDark}
          onToggleTheme={() => setTheme(isDark ? 'light' : 'dark')}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <Identifiers />
        </main>

        <footer className="border-t border-border-primary bg-bg-footer py-6 text-xs text-text-slate-500 font-sans select-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="font-semibold text-text-primary flex opacity-40">
                <span className='font-[Unbounded] leading-none ml-1 mt-0.5'> dummy <br/> Data </span> 
                <Notch className="relative top-4.5 right-4 w-3.5 flex" fill="currentColor" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-text-primary opacity-40">
                <span>Copyright &copy; 2026</span>
              </div>
              <div className="flex items-center gap-1 font-medium">
                <a 
                  href="https://ataltanwar.vercel.app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center gap-1.5 text-text-primary opacity-40 transition-colors">
                  <span>Developed by</span>
                  <AtalLogo className="h-4.5 w-5 -ml-1 -mt-0.5 group-hover:text-green-400  transition-colors" />
                </a>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </ToastProvider>
  );
}
