export enum AppView {
  SEARCH = 'SEARCH',
  NOTEBOOK = 'NOTEBOOK',
  STUDY = 'STUDY'
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export interface Example {
  target: string;
  native: string;
}

export interface DictionaryEntry {
  id: string;
  term: string;
  phonetic?: string;
  definition: string;
  examples: Example[];
  usageNote: string;
  imageUrl?: string; // base64
  nativeLang: string;
  targetLang: string;
  createdAt: number;
}

export interface DictionaryResponse {
  definition: string;
  phonetic: string;
  examples: Example[];
  usageNote: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'pt', name: 'Portuguese', flag: '🇧🇷' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
];