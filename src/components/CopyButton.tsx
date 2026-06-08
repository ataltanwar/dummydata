import { useState, useEffect, useRef, type MouseEvent } from 'react';
import { Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useToast } from './Toast';

interface CopyButtonProps {
  value: string;
  className?: string;
  iconOnly?: boolean;
  label?: string;
}

export default function CopyButton({ value, className = '', iconOnly = true, label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const { success } = useToast();
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const handleCopy = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
      success(label ? `Copied to clipboard` : 'Copied to clipboard');
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  if (iconOnly) {
    return (
      <button
        onClick={handleCopy}
        className={`relative p-1.5 rounded-lg border border-border-primary hover:border-[#3d5afe]/40 bg-bg-surface-accent text-text-slate-400 hover:text-text-primary transition-colors shadow-theme-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3d5afe]/60 ${className}`}
        title={label ? `Copy ${label}` : 'Copy to clipboard'}
        aria-label={label ? `Copy ${label}` : 'Copy to clipboard'}
        type="button"
      >
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.div
              key="check"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            </motion.div>
          ) : (
            <motion.div
              key="copy"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Copy className="w-3.5 h-3.5" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    );
  }

  return (
    <button
      onClick={handleCopy}
      type="button"
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-bg-surface-accent hover:bg-bg-neutral text-text-slate-200 transition-colors shadow-theme-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3d5afe]/60 ${className}`}
      aria-label={label ? `Copy ${label}` : 'Copy'}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-emerald-600">{label ? `${label} Copied!` : 'Copied!'}</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          <span>{label || 'Copy'}</span>
        </>
      )}
    </button>
  );
}
