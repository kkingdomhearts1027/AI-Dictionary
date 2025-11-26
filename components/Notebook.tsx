import React, { useState } from 'react';
import { DictionaryEntry } from '../types';
import { Trash2, Sparkles, BookOpen, Download } from 'lucide-react';
import { generateStory } from '../services/geminiService';
import AudioButton from './AudioButton';

interface Props {
  entries: DictionaryEntry[];
  onDelete: (id: string) => void;
  nativeLang: string;
  targetLang: string;
}

const Notebook: React.FC<Props> = ({ entries, onDelete, nativeLang, targetLang }) => {
  const [story, setStory] = useState<string | null>(null);
  const [loadingStory, setLoadingStory] = useState(false);

  const handleGenerateStory = async () => {
    if (entries.length === 0) return;
    setLoadingStory(true);
    try {
        const words = entries.map(e => e.term);
        const result = await generateStory(words, nativeLang, targetLang);
        setStory(result);
    } catch (e) {
        console.error(e);
    } finally {
        setLoadingStory(false);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(entries, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'lingopop-notebook.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (entries.length === 0) {
    return (
      <div className="text-center py-20 px-6">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen size={40} className="text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Your notebook is empty</h3>
        <p className="text-gray-500">Search for words and save them here to study later!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24">
      <div className="flex justify-between items-center px-2 flex-wrap gap-4">
        <h2 className="text-3xl font-extrabold text-pop-dark">My Notebook <span className="text-pop-purple">({entries.length})</span></h2>
        <div className="flex gap-2">
            <button 
                onClick={handleExport}
                className="flex items-center gap-2 bg-white text-pop-dark border-2 border-gray-100 px-4 py-2.5 rounded-full font-bold shadow-sm hover:bg-gray-50 transition-all"
                title="Export Notebook"
            >
                <Download size={18} />
                <span className="hidden sm:inline">Export</span>
            </button>
            <button 
                onClick={handleGenerateStory}
                disabled={loadingStory}
                className="flex items-center gap-2 bg-gradient-to-r from-pop-pink to-pop-purple text-white px-5 py-2.5 rounded-full font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 active:scale-95"
            >
                {loadingStory ? <Sparkles className="animate-spin" size={18} /> : <Sparkles size={18} />}
                <span>{loadingStory ? 'Writing...' : 'Make a Story'}</span>
            </button>
        </div>
      </div>

      {story && (
        <div className="bg-gradient-to-br from-pop-yellow/20 to-pop-pink/20 border-2 border-pop-pink/20 rounded-3xl p-6 relative overflow-hidden animate-in fade-in zoom-in duration-300">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles size={100} />
             </div>
            <h3 className="text-xl font-bold text-pop-dark mb-4 flex items-center gap-2">
                <span className="text-2xl">📖</span> AI Story Time
            </h3>
            <div className="prose prose-lg text-gray-800 leading-relaxed whitespace-pre-line font-medium">
                {story}
            </div>
            <button 
                onClick={() => setStory(null)}
                className="mt-6 text-sm font-bold text-gray-500 hover:text-pop-dark underline"
            >
                Close Story
            </button>
        </div>
      )}

      <div className="grid gap-4">
        {entries.map(entry => (
          <div key={entry.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group">
            <div className="flex items-center gap-4">
                {entry.imageUrl && (
                    <img src={entry.imageUrl} alt="" className="w-16 h-16 rounded-xl object-cover bg-gray-100" />
                )}
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-pop-dark">{entry.term}</h3>
                        <AudioButton text={entry.term} size="sm" />
                    </div>
                    <p className="text-gray-500">{entry.definition}</p>
                </div>
            </div>
            <button 
                onClick={() => onDelete(entry.id)}
                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            >
                <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notebook;