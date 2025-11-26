import React from 'react';
import { Language, SUPPORTED_LANGUAGES } from '../types';
import { ChevronDown, ArrowRightLeft } from 'lucide-react';

interface Props {
  nativeLang: Language;
  targetLang: Language;
  setNativeLang: (l: Language) => void;
  setTargetLang: (l: Language) => void;
}

const LanguageSelector: React.FC<Props> = ({ nativeLang, targetLang, setNativeLang, setTargetLang }) => {
  const handleSwap = () => {
    const temp = nativeLang;
    setNativeLang(targetLang);
    setTargetLang(temp);
  };

  const Select = ({ value, onChange, label }: { value: Language, onChange: (l: Language) => void, label: string }) => (
    <div className="relative group flex-1">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">{label}</label>
        <div className="relative mt-1">
            <select
                value={value.code}
                onChange={(e) => {
                const selected = SUPPORTED_LANGUAGES.find(l => l.code === e.target.value);
                if (selected) onChange(selected);
                }}
                className="appearance-none w-full bg-white border-2 border-pop-purple/20 text-gray-800 py-3 pl-4 pr-10 rounded-2xl focus:outline-none focus:border-pop-purple font-bold shadow-sm transition-all"
            >
                {SUPPORTED_LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-pop-purple">
                <ChevronDown size={20} />
            </div>
        </div>
    </div>
  );

  return (
    <div className="flex items-end space-x-2 bg-white p-4 rounded-3xl shadow-sm mb-6">
      <Select value={nativeLang} onChange={setNativeLang} label="I speak" />
      
      <button 
        onClick={handleSwap}
        className="mb-2 p-2 bg-pop-cream rounded-full hover:bg-pop-yellow transition-colors border-2 border-pop-yellow text-pop-dark"
      >
        <ArrowRightLeft size={20} />
      </button>

      <Select value={targetLang} onChange={setTargetLang} label="I'm learning" />
    </div>
  );
};

export default LanguageSelector;