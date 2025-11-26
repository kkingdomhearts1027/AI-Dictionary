import React, { useState } from 'react';
import { Volume2, Loader2 } from 'lucide-react';
import { generateAudio, playAudioFromBase64 } from '../services/geminiService';

interface Props {
  text: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const AudioButton: React.FC<Props> = ({ text, size = 'md', className = '' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [cachedAudio, setCachedAudio] = useState<string | null>(null);

  const handlePlay = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLoading) return;

    if (cachedAudio) {
      await playAudioFromBase64(cachedAudio);
      return;
    }

    setIsLoading(true);
    try {
      const audioData = await generateAudio(text);
      if (audioData) {
        setCachedAudio(audioData);
        await playAudioFromBase64(audioData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3'
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 24
  };

  return (
    <button
      onClick={handlePlay}
      className={`rounded-full bg-pop-blue/10 text-pop-blue hover:bg-pop-blue hover:text-white transition-all duration-200 flex items-center justify-center ${sizeClasses[size]} ${className}`}
      aria-label="Play audio"
    >
      {isLoading ? (
        <Loader2 size={iconSizes[size]} className="animate-spin" />
      ) : (
        <Volume2 size={iconSizes[size]} />
      )}
    </button>
  );
};

export default AudioButton;