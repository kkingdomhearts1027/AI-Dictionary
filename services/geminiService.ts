import { GoogleGenAI, Type, Modality } from "@google/genai";
import { DictionaryResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to decode audio
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export const lookupWord = async (
  term: string,
  nativeLang: string,
  targetLang: string
): Promise<DictionaryResponse> => {
  const prompt = `
    Analyze the text "${term}". 
    Target Language: ${targetLang}. 
    User's Native Language: ${nativeLang}.

    Provide a JSON response with:
    1. "definition": A natural language definition in ${nativeLang}.
    2. "phonetic": Phonetic transcription if applicable.
    3. "examples": Array of 2 objects, each with "target" (sentence in ${targetLang}) and "native" (translation in ${nativeLang}).
    4. "usageNote": A fun, lively, casual explanation (like a friend explaining) of cultural nuance, tone, or common confusion. CRITICAL: You MUST mention related words (synonyms or words that look similar) and briefly explain how they differ in usage. Keep it concise. No greetings.

    Return ONLY JSON.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          definition: { type: Type.STRING },
          phonetic: { type: Type.STRING },
          examples: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                target: { type: Type.STRING },
                native: { type: Type.STRING },
              },
            },
          },
          usageNote: { type: Type.STRING },
        },
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("No text response from Gemini");
  return JSON.parse(text) as DictionaryResponse;
};

export const generateIllustration = async (term: string): Promise<string | undefined> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: `Create a bright, fun, vector-art style illustration representing the concept of: "${term}". Minimalist, colorful, flat design.`,
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return undefined;
  } catch (error) {
    console.error("Image generation failed", error);
    return undefined;
  }
};

export const generateAudio = async (text: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // Kore is usually good for clear TTS
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio || null;
  } catch (error) {
    console.error("Audio generation failed", error);
    return null;
  }
};

export const playAudioFromBase64 = async (base64Audio: string) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const audioBuffer = await audioContext.decodeAudioData(decode(base64Audio).buffer);
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start();
};

export const generateStory = async (words: string[], nativeLang: string, targetLang: string): Promise<string> => {
    const prompt = `
        Create a short, funny story (max 150 words) in ${targetLang} using these words: ${words.join(', ')}.
        After the story, provide a brief summary in ${nativeLang}.
        Highlight the used words in bold (markdown) if possible.
        Keep it simple and educational.
    `;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
    });
    
    return response.text || "Could not generate story.";
}