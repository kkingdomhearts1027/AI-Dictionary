import React, { useState } from 'react';
import { DictionaryEntry } from '../types';
import { RotateCw, CheckCircle, ArrowRight, BookOpen } from 'lucide-react';
import AudioButton from './AudioButton';

interface Props {
  entries: DictionaryEntry[];
}

const StudyMode: React.FC<Props> = ({ entries }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (entries.length === 0) {
    return (
       <div className="text-center py-20 px-6">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen size={40} className="text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">No words to study</h3>
        <p className="text-gray-500">Add words to your notebook first!</p>
      </div>
    );
  }

  const currentCard = entries[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % entries.length);
    }, 200);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] pb-24 px-4">
      <div className="mb-8 flex items-center gap-2">
         <span className="bg-pop-dark text-white text-xs font-bold px-3 py-1 rounded-full">
            {currentIndex + 1} / {entries.length}
         </span>
         <h2 className="text-2xl font-bold text-pop-dark">Flashcards</h2>
      </div>

      <div 
        className="relative w-full max-w-sm aspect-[3/4] cursor-pointer perspective-1000"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`relative w-full h-full duration-500 transform-style-3d transition-all ${isFlipped ? 'rotate-y-180' : ''}`}>
          
          {/* Front */}
          <div className="absolute w-full h-full bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center backface-hidden border-2 border-pop-blue/10">
            {currentCard.imageUrl && (
                <div className="w-32 h-32 mb-8 rounded-full overflow-hidden border-4 border-pop-cream shadow-inner">
                    <img src={currentCard.imageUrl} alt="" className="w-full h-full object-cover" />
                </div>
            )}
            <h3 className="text-4xl font-extrabold text-pop-dark text-center mb-4">{currentCard.term}</h3>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Tap to reveal</p>
          </div>

          {/* Back */}
          <div className="absolute w-full h-full bg-gradient-to-br from-pop-blue to-blue-600 rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center backface-hidden rotate-y-180 text-white">
             <div className="absolute top-4 right-4" onClick={(e) => e.stopPropagation()}>
                 <AudioButton text={currentCard.term} className="bg-white/20 hover:bg-white/40 text-white" />
             </div>
             
             <h3 className="text-3xl font-bold mb-2 text-center">{currentCard.term}</h3>
             <p className="text-blue-100 font-mono mb-6">{currentCard.phonetic}</p>
             
             <div className="bg-white/10 rounded-xl p-4 w-full mb-6 backdrop-blur-sm">
                <p className="text-lg font-medium text-center leading-relaxed">
                    {currentCard.definition}
                </p>
             </div>

             {currentCard.examples[0] && (
                 <div className="text-center opacity-80 text-sm">
                     <p className="italic">"{currentCard.examples[0].target}"</p>
                 </div>
             )}
          </div>

        </div>
      </div>

      <div className="mt-10 flex gap-4">
        <button 
            onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(!isFlipped);
            }}
            className="p-4 rounded-full bg-white shadow-lg text-gray-600 hover:text-pop-blue transition-colors"
        >
            <RotateCw size={24} />
        </button>
        <button 
            onClick={handleNext}
            className="flex items-center gap-2 px-8 py-4 bg-pop-dark text-white rounded-full font-bold shadow-lg hover:bg-gray-800 transition-all active:scale-95"
        >
            <span>Next Word</span>
            <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default StudyMode;