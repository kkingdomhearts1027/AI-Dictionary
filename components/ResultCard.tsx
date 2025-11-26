import React from 'react';
import { DictionaryEntry } from '../types';
import { BookMarked, Share2 } from 'lucide-react';
import AudioButton from './AudioButton';

interface Props {
  entry: DictionaryEntry;
  onSave: (entry: DictionaryEntry) => void;
  isSaved: boolean;
}

const ResultCard: React.FC<Props> = ({ entry, onSave, isSaved }) => {
  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Image */}
      <div className="relative h-48 sm:h-64 bg-pop-cream flex items-center justify-center overflow-hidden">
        {entry.imageUrl ? (
          <img 
            src={entry.imageUrl} 
            alt={entry.term} 
            className="w-full h-full object-cover"
          />
        ) : (
           <div className="text-gray-400 font-medium">No image generated</div>
        )}
        <div className="absolute top-4 right-4 flex space-x-2">
            <button 
                onClick={() => onSave(entry)}
                className={`p-3 rounded-full shadow-lg backdrop-blur-sm transition-all ${
                    isSaved 
                    ? 'bg-pop-yellow text-pop-dark hover:bg-yellow-500' 
                    : 'bg-white/80 text-gray-600 hover:bg-white'
                }`}
            >
                <BookMarked size={20} className={isSaved ? "fill-current" : ""} />
            </button>
        </div>
      </div>

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3">
                <h2 className="text-4xl font-extrabold text-pop-dark tracking-tight">{entry.term}</h2>
                <AudioButton text={entry.term} size="lg" />
            </div>
            {entry.phonetic && (
              <p className="text-gray-500 font-mono mt-1 text-lg">{entry.phonetic}</p>
            )}
          </div>
        </div>

        {/* Definition */}
        <div className="mb-8">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Meaning</h3>
            <p className="text-xl text-gray-800 font-medium leading-relaxed">{entry.definition}</p>
        </div>

        {/* Examples */}
        <div className="mb-8 bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Examples</h3>
            <div className="space-y-4">
                {entry.examples.map((ex, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                    <AudioButton text={ex.target} size="sm" className="mt-1 shrink-0" />
                    <div>
                    <p className="text-pop-dark font-semibold text-lg">{ex.target}</p>
                    <p className="text-gray-500">{ex.native}</p>
                    </div>
                </div>
                ))}
            </div>
        </div>

        {/* Usage Note */}
        <div className="bg-pop-purple/5 border border-pop-purple/10 rounded-2xl p-5">
           <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">💡</span>
                <h3 className="text-sm font-bold text-pop-purple uppercase tracking-widest">The Vibe Check</h3>
           </div>
           <p className="text-gray-700 italic leading-relaxed">
            "{entry.usageNote}"
           </p>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;