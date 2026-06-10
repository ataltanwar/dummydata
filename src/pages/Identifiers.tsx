import { useState, useEffect, useRef } from 'react';
import { generateIdentifiers, identifierConfigs, IdentifierType, FormattedIdentifier } from '../generators/workforce';
import CopyButton from '../components/CopyButton';
import { downloadFile } from '../utils/csvExport';
import { useToast } from '../components/Toast';
import {
  List,
  Download,
  Terminal,
  Grid,
  Info,
  Sliders,
  ChevronRight,
  ChevronDown,
  Database,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const popularBanks = [
  { code: 'SBIN', name: 'State Bank of India' },
  { code: 'HDFC', name: 'HDFC Bank' },
  { code: 'ICIC', name: 'ICICI Bank' },
  { code: 'UTIB', name: 'Axis Bank' },
  { code: 'BARB', name: 'Bank of Baroda' },
  { code: 'KKBK', name: 'Kotak Mahindra Bank' }
];

export default function Identifiers() {
  const [selectedType, setSelectedType] = useState<IdentifierType>('PAN');
  const [quantity, setQuantity] = useState<number>(10);
  const [generatedList, setGeneratedList] = useState<FormattedIdentifier[]>([]);
  const [isCopiedAll, setIsCopiedAll] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [srMessage, setSrMessage] = useState<string>('');

  const { success, info } = useToast();
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up copy timer on unmount
  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  // Bank Account / IFSC Configurations
  const [selectedBankCode, setSelectedBankCode] = useState<string>('SBIN');
  const [bankDigits, setBankDigits] = useState<number>(12);

  const presets = [1, 10, 50, 100];
  const isCustomQty = !presets.includes(quantity);

  // Handle generation action
  const handleGenerate = (isManual = false) => {
    const freshData = generateIdentifiers(
      selectedType,
      quantity,
      {
        bankCode: selectedType === 'IFSC' ? selectedBankCode : undefined,
        bankDigits: selectedType === 'BANK_ACCOUNT' ? bankDigits : 12
      }
    );
    setGeneratedList(freshData);
    setSrMessage(`Successfully generated ${quantity} ${identifierConfigs[selectedType].label} identifiers.`);
    if (isManual) {
      success(`Generated ${quantity} ${identifierConfigs[selectedType].tooltip} values`);
    }
  };

  // Generate on initial render
  useEffect(() => {
    handleGenerate(false);
  }, [selectedType]);

  // Bulk copy
  const handleCopyAll = async () => {
    if (generatedList.length === 0) return;
    try {
      const bulkString = generatedList.map(item => item.rawValue).join('\n');
      await navigator.clipboard.writeText(bulkString);
      setIsCopiedAll(true);
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
      copyTimeoutRef.current = setTimeout(() => setIsCopiedAll(false), 2000);
      setSrMessage('Copied all identifiers to clipboard.');
      success('Copied all identifiers to clipboard!');
    } catch (err) {
      console.error('Failed to copy list', err);
    }
  };

  // Export List as single column CSV
  const handleDownloadCSV = () => {
    if (generatedList.length === 0) return;
    const header = identifierConfigs[selectedType].label;
    const csvContent = `${header}\n${generatedList.map(item => item.rawValue).join('\n')}`;
    const filename = `dummy_${selectedType.toLowerCase()}_list.csv`;
    downloadFile(csvContent, filename, 'text/csv');
    success(`Exported CSV successfully!`);
  };

  // Reset Configuration to default state
  const handleReset = () => {
    setSelectedType('PAN');
    setQuantity(10);
    setSelectedBankCode('SBIN');
    setBankDigits(12);
    setIsRulesOpen(false);
    setSrMessage('Configuration reset to defaults.');
    info('Configuration reset to defaults.');
  };

  const currentConfig = identifierConfigs[selectedType];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-primary font-sans">
          Generate Production-Like Test Data in Seconds
        </h1>
        <p className="text-sm text-text-slate-400 max-w-3xl leading-relaxed">
          Create format-valid compliance and workforce identifiers for development, QA, demos, and staging environments.
        </p>
      </div>

      {/* screen reader */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {srMessage}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* control panel*/}
      <div className="lg:col-span-4 space-y-8 self-start">
        <div className="bg-bg-surface border border-border-primary rounded-[20px] p-5 shadow-theme-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-border-primary">
            <Sliders className="w-5 h-5 text-[#1973FC]" />
            <h3 className="font-semibold text-text-primary text-base">Configuration Pane</h3>
          </div>

          {/* identifier options */}
          <div className="space-y-2">
            <label htmlFor="identifier-type-select" className="block text-xs font-semibold text-text-slate-500 uppercase tracking-wider">
              Identifier Category
            </label>
            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as IdentifierType)}
                className="w-full text-sm bg-bg-neutral border border-border-primary hover:border-[#1973FC]/30 text-text-primary rounded-xl py-2.5 pl-3.5 pr-10 focus:ring-1 focus:ring-[#1973FC]/30 focus:outline-hidden font-medium cursor-pointer appearance-none"
                id="identifier-type-select"
              >
                {Object.entries(identifierConfigs).map(([key, config]) => (
                  <option key={key} value={key} className="bg-bg-surface text-text-primary">
                    {config.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
                <ChevronDown className="w-4 h-4 text-text-slate-400" />
              </div>
            </div>
          </div>

          {/* other options */}
          {selectedType === 'IFSC' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-2 pt-1"
            >
              <label htmlFor="bank-code-select" className="block text-xs font-semibold text-text-slate-500 uppercase tracking-wider">
                Preferred Bank Alias
              </label>
              <div className="relative">
                <select
                  value={selectedBankCode}
                  onChange={(e) => setSelectedBankCode(e.target.value)}
                  className="w-full text-sm bg-bg-neutral border border-border-primary hover:border-[#1973FC]/40 text-text-primary rounded-xl py-2.5 pl-3.5 pr-10 focus:ring-1 focus:ring-[#1973FC] focus:outline-hidden appearance-none cursor-pointer"
                  id="bank-code-select"
                >
                  {popularBanks.map((b) => (
                    <option key={b.code} value={b.code} className="bg-bg-surface text-text-primary">
                      {b.name} ({b.code})
                    </option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
                  <ChevronDown className="w-4 h-4 text-text-slate-400" />
                </div>
              </div>
            </motion.div>
          )}

          {selectedType === 'BANK_ACCOUNT' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-2 pt-1"
            >
              <div className="flex justify-between items-center">
                <label htmlFor="bank-digits" className="block text-xs font-semibold text-text-slate-500 uppercase tracking-wider">
                  Digit Count
                </label>
                <span className="text-xs text-text-slate-500 font-bold font-mono">
                  {bankDigits} Digits (9-18)
                </span>
              </div>
              <input
                type="range"
                min="9"
                max="18"
                value={bankDigits}
                onChange={(e) => setBankDigits(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-bg-neutral rounded-lg appearance-none cursor-pointer accent-[#1973FC]"
                id="bank-digits"
              />
            </motion.div>
          )}

          {/* quantity options */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-text-slate-500 uppercase tracking-wider">
              Quantity Count
            </label>
            <div className="grid grid-cols-5 gap-1.5" id="qty-presets" role="group" aria-label="Quantity presets">
              {presets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setQuantity(preset)}
                  aria-pressed={quantity === preset}
                  className={`py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer border qty-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3d5afe]/60 ${
                    quantity === preset
                      ? 'bg-[#1973FC] border-[#1973FC] text-inverse font-bold'
                      : 'bg-bg-neutral border-border-primary hover:bg-bg-neutral-hover'
                  }`}
                >
                  {preset}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setQuantity(20)}
                aria-pressed={isCustomQty}
                className={`py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer border qty-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3d5afe]/60 ${
                  isCustomQty
                    ? 'bg-[#1973FC] border-[#1973FC] text-inverse font-bold'
                    : 'bg-bg-neutral border-border-primary hover:bg-bg-neutral-hover'
                }`}
              >
                Custom
              </button>
            </div>

            {/* custom ranger */}
            <AnimatePresence>
              {isCustomQty && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 pt-2.5"
                >
                  <label htmlFor="custom-qty" className="block text-xs font-medium text-text-slate-400">
                    Specify Custom Amount (Max 500)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10) || 1;
                      setQuantity(Math.min(500, Math.max(1, val)));
                    }}
                    className="w-full text-sm bg-bg-neutral border border-border-primary text-text-primary rounded-xl py-2 px-3 focus:ring-1 focus:ring-[#1973FC] focus:outline-hidden"
                    id="custom-qty"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-3 pt-2">

            {/* btns */}
            <button
              onClick={() => handleGenerate(true)}
              type="button"
              className="w-full py-3 px-4 rounded-[100px] bg-[#1973FC] hover:bg-[#1974fcdc] text-inverse font-semibold text-sm transition-all duration-200 shadow-theme-indigo inline-flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3d5afe]/70"
              id="generator-action-btn"
            >
              <Database className="w-4 h-4" />
              Generate Compliance Set
            </button>

            {/* reset btn */}
            <button
              onClick={handleReset}
              type="button"
              className="w-full py-3 px-4 rounded-[100px] bg-bg-neutral hover:bg-bg-neutral-hover border border-border-primary text-text-primary font-semibold text-sm transition-all duration-200 inline-flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3d5afe]/60"
              id="reset-config-btn"
            >
              <RotateCcw className="w-4 h-4 text-[#1973FC]" />
              Reset Configuration
            </button>
          </div>
        </div>

        {/* rules */}
        <div className="bg-bg-surface border border-border-primary rounded-[20px] overflow-hidden">
          <button
            type="button"
            onClick={() => setIsRulesOpen(!isRulesOpen)}
            className="w-full flex items-center justify-between p-5 text-left font-semibold text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1973FC]/50 group cursor-pointer"
            aria-expanded={isRulesOpen}
            aria-controls="format-rules-content"
          >
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0 text-[#1973FC]" />
              <span className="text-text-primary font-semibold">Format Rules</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-text-slate-400 transition-transform duration-200 group-hover:text-text-primary ${
                isRulesOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
          <AnimatePresence initial={false}>
            {isRulesOpen && (
              <motion.div
                id="format-rules-content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 pt-0 space-y-2.5 font-sans text-xs text-text-slate-400 leading-relaxed">
                  <p className="mt-2.5">
                    <strong className="text-text-primary">Rule Scheme: </strong>
                    <code className="inline-flex items-center bg-bg-surface-accent rounded border border-border-primary px-2 py-0.5 font-mono text-text-slate-350 font-semibold">
                      {currentConfig.pattern}
                    </code>
                  </p>
                  <p>
                    <strong className="text-text-primary">Description: </strong> <br />
                    <span className="text-text-slate-300 block mt-0.5"> {currentConfig.description} </span>
                  </p>
                  <p>
                    <strong className="text-text-primary">Valid Syntax Sample: </strong>
                    <span className="font-mono bg-bg-surface-accent px-1 py-0.5 rounded border border-border-primary text-text-slate-300 select-all font-semibold">
                      {currentConfig.example}
                    </span>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* workbench */}
      <div className="lg:col-span-8 bg-bg-surface border border-border-primary rounded-[20px] overflow-hidden shadow-theme-xs flex flex-col min-h-125 self-start">
        
        {/* quick actions */}
        <div className="p-5 border-b border-border-primary flex flex-col lg:flex-row gap-4 justify-between items-center lg:items-center bg-bg-surface-accent-translucent">
          <div className="flex items-center gap-2.5">
            <div className="bg-bg-badge border border-border-primary p-2 rounded-lg text-[#1973FC]">
              <List className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-text-primary text-sm">
                Generated {currentConfig.label} Values
              </h4>
              <p className="text-xs text-text-slate-500 mt-0.5">
                Total instances compiled: <strong className="text-[#1973FC] font-bold font-mono">{generatedList.length}</strong>
              </p>
            </div>
          </div>

          {/* Quick Actions Buttons */}
          <div className="flex flex-wrap gap-3 w-full lg:w-auto self-stretch lg:self-auto shrink-0 justify-center lg:justify-end" id="output-actions">
            <button
              onClick={handleCopyAll}
              disabled={generatedList.length === 0}
              type="button"
              aria-live="polite"
              className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-[100px] border cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3d5afe]/60 disabled:opacity-60 disabled:cursor-not-allowed ${
                isCopiedAll
                  ? 'text-[#10b981] border-emerald-500/30'
                  : 'bg-bg-neutral hover:bg-bg-neutral-hover border border-border-primary text-text-primary'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-[#1973FC]" />
              {isCopiedAll ? 'All Copied' : 'Copy All Raw'}
            </button>
            <button
              onClick={handleDownloadCSV}
              disabled={generatedList.length === 0}
              type="button"
              className="active:bg-blue-900/20 inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-[100px] bg-bg-neutral text-text-primary hover:bg-bg-neutral-hover border border-border-primary transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3d5afe]/60 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Download className="w-3.5 h-3.5 text-[#1973FC]" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Workbench Window */}
        <div className="p-6 flex-1 divide-y divide-border-primary">
          {generatedList.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
              <Grid className="w-10 h-10 text-text-slate-600 stroke-1" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-text-slate-400">Empty Workbench</p>
                <p className="text-xs text-text-slate-500">Configure parameters on the left and hit generate.</p>
              </div>
            </div>
          ) : (
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3" aria-label={`List of generated ${currentConfig.label} values`}>
              {generatedList.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-3 rounded-xl border border-border-primary bg-bg-surface-accent hover:border-[#1973FC]/30 hover:bg-bg-neutral transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-5.5 h-5.5 text-[9px] font-mono font-bold rounded-md bg-bg-badge text-text-slate-500 border border-border-primary shrink-0 select-none" aria-hidden="true">
                      {index + 1}
                    </span>
                    <span className="font-mono text-xs sm:text-sm font-semibold text-text-primary tracking-wider select-all">
                      <span className="sr-only">Value {index + 1}: </span>
                      {item.displayValue}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 transition-all duration-150">
                    <span className="text-[10px] text-text-slate-500 font-mono hidden xl:inline">
                      Quick Copy
                    </span>
                    <CopyButton value={item.rawValue} label={`${currentConfig.label} ${index + 1} (${item.displayValue})`} />
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="p-4 border-t border-border-primary bg-bg-surface-accent text-[11px] text-text-slate-500 flex flex-col lg:flex-row items-center lg:justify-between lg:items-center gap-2 md:gap-3 lg:gap-4 text-center lg:text-left font-sans">
          <span className="flex items-center justify-center lg:justify-start gap-1">
            <ChevronRight className="w-3.5 h-3.5 text-[#1973FC]" /> Click to copy the data.
          </span>
          <span className="font-mono text-[10px] text-[#1973FC] text-center lg:text-right">
            Generated {currentConfig.tooltip} value is synthetic and intended for testing only.
          </span>
        </div>

      </div>

    </div>

    </div>
  );
}
