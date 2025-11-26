import React, { useState, useEffect } from 'react';
import { AppView, DictionaryEntry, Language, SUPPORTED_LANGUAGES } from './types';
import LanguageSelector from './components/LanguageSelector';
import ResultCard from './components/ResultCard';
import Notebook from './components/Notebook';
import StudyMode from './components/StudyMode';
import { lookupWord, generateIllustration } from './services/geminiService';
import { Search, Book, GraduationCap, Sparkles, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.SEARCH);
  const [nativeLang, setNativeLang] = useState<Language>(SUPPORTED_LANGUAGES[0]); // English default
  const [targetLang, setTargetLang] = useState<Language>(SUPPORTED_LANGUAGES[1]); // Spanish default
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<DictionaryEntry | null>(null);
  
  const [notebook, setNotebook] = useState<DictionaryEntry[]>(() => {
    const saved = localStorage.getItem('lingopop-notebook');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('lingopop-notebook', JSON.stringify(notebook));
  }, [notebook]);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    setCurrentResult(null);
    setView(AppView.SEARCH);

    try {
      // Parallel execution for speed
      const [textData, imageUrl] = await Promise.all([
        lookupWord(searchTerm, nativeLang.name, targetLang.name),
        generateIllustration(searchTerm)
      ]);

      const newEntry: DictionaryEntry = {
        id: crypto.randomUUID(),
        term: searchTerm, // or refine with textData.term if provided
        definition: textData.definition,
        phonetic: textData.phonetic,
        examples: textData.examples,
        usageNote: textData.usageNote,
        imageUrl: imageUrl,
        nativeLang: nativeLang.code,
        targetLang: targetLang.code,
        createdAt: Date.now(),
      };

      setCurrentResult(newEntry);
    } catch (error) {
      console.error("Search failed", error);
      alert("Oops! Something went wrong finding that word. Try again!");
    } finally {
      setIsLoading(false);
    }
  };

  const saveToNotebook = (entry: DictionaryEntry) => {
    if (!notebook.find(n => n.id === entry.id)) {
      setNotebook([entry, ...notebook]);
    }
  };

  const removeFromNotebook = (id: string) => {
    setNotebook(notebook.filter(n => n.id !== id));
  };

  const isCurrentSaved = currentResult ? notebook.some(n => n.term.toLowerCase() === currentResult.term.toLowerCase()) : false;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0 font-sans text-gray-900">
      
      {/* Top Navigation / Header */}
      <header className="bg-white sticky top-0 z-30 border-b border-gray-100 px-4 py-3 shadow-sm">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2" onClick={() => setView(AppView.SEARCH)}>
                <div className="w-8 h-8 bg-pop-pink rounded-lg flex items-center justify-center text-white transform rotate-3">
                    <Sparkles size={18} />
                </div>
                <h1 className="text-xl font-extrabold tracking-tight cursor-pointer">
                    Lingo<span className="text-pop-pink">Pop</span>
                </h1>
            </div>
            {/* Desktop Nav */}
            <nav className="hidden md:flex gap-1 bg-gray-100 p-1 rounded-full">
                <button 
                    onClick={() => setView(AppView.SEARCH)}
                    className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${view === AppView.SEARCH ? 'bg-white shadow-sm text-pop-dark' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Search
                </button>
                <button 
                    onClick={() => setView(AppView.NOTEBOOK)}
                    className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${view === AppView.NOTEBOOK ? 'bg-white shadow-sm text-pop-dark' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Notebook
                </button>
                <button 
                    onClick={() => setView(AppView.STUDY)}
                    className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${view === AppView.STUDY ? 'bg-white shadow-sm text-pop-dark' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Study
                </button>
            </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 md:p-6 min-h-[calc(100vh-140px)]">
        
        {view === AppView.SEARCH && (
          <div className="space-y-6">
            <LanguageSelector 
                nativeLang={nativeLang} 
                targetLang={targetLang} 
                setNativeLang={setNativeLang} 
                setTargetLang={setTargetLang} 
            />

            <form onSubmit={handleSearch} className="relative group z-10">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-6 w-6 text-gray-400 group-focus-within:text-pop-pink transition-colors" />
                </div>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={`Type a word or phrase in ${targetLang.name}...`}
                    className="block w-full pl-12 pr-4 py-4 bg-white border-2 border-transparent focus:border-pop-pink rounded-3xl text-lg font-semibold placeholder-gray-400 shadow-lg shadow-pop-pink/5 focus:outline-none focus:ring-0 transition-all"
                />
                <button 
                    type="submit" 
                    disabled={isLoading || !searchTerm}
                    className="absolute right-2 top-2 bottom-2 bg-pop-pink text-white px-6 rounded-2xl font-bold hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Go'}
                </button>
            </form>

            {/* Results Area */}
            <div className="mt-8">
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-pop-pink/20 border-t-pop-pink rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Sparkles size={20} className="text-pop-purple animate-pulse" />
                            </div>
                        </div>
                        <p className="text-gray-500 font-medium animate-pulse">Consulting the linguistic spirits...</p>
                    </div>
                )}

                {!isLoading && currentResult && (
                    <ResultCard 
                        entry={currentResult} 
                        onSave={saveToNotebook} 
                        isSaved={isCurrentSaved} 
                    />
                )}

                {!isLoading && !currentResult && (
                    <div className="text-center py-10 opacity-60">
                         <p className="text-lg font-medium text-gray-400">Ready to learn something new?</p>
                    </div>
                )}
            </div>
          </div>
        )}

        {view === AppView.NOTEBOOK && (
            <Notebook 
                entries={notebook} 
                onDelete={removeFromNotebook} 
                nativeLang={nativeLang.name} 
                targetLang={targetLang.name} 
            />
        )}

        {view === AppView.STUDY && (
            <StudyMode entries={notebook} />
        )}

      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around p-3 pb-6 z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button 
            onClick={() => setView(AppView.SEARCH)}
            className={`flex flex-col items-center gap-1 ${view === AppView.SEARCH ? 'text-pop-pink' : 'text-gray-400'}`}
        >
            <Search size={24} strokeWidth={view === AppView.SEARCH ? 3 : 2} />
            <span className="text-[10px] font-bold">Search</span>
        </button>
        <button 
            onClick={() => setView(AppView.NOTEBOOK)}
            className={`flex flex-col items-center gap-1 ${view === AppView.NOTEBOOK ? 'text-pop-purple' : 'text-gray-400'}`}
        >
            <Book size={24} strokeWidth={view === AppView.NOTEBOOK ? 3 : 2} />
            <span className="text-[10px] font-bold">Notebook</span>
        </button>
        <button 
            onClick={() => setView(AppView.STUDY)}
            className={`flex flex-col items-center gap-1 ${view === AppView.STUDY ? 'text-pop-blue' : 'text-gray-400'}`}
        >
            <GraduationCap size={24} strokeWidth={view === AppView.STUDY ? 3 : 2} />
            <span className="text-[10px] font-bold">Study</span>
        </button>
      </nav>

    </div>
  );
};

export default App;