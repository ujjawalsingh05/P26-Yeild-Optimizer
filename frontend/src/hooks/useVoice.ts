import { useState } from 'react';

export function useVoice() {
  const [isPlaying, setIsPlaying] = useState(false);

  const playVoice = async (text: string) => {
    if (isPlaying) return;
    setIsPlaying(true);
    
    try {
      const audio = new Audio(`http://localhost:8000/voice?text=${encodeURIComponent(text)}`);
      audio.onended = () => setIsPlaying(false);
      await audio.play();
    } catch (error) {
      console.error("Failed to play audio:", error);
      setIsPlaying(false);
    }
  };

  return { playVoice, isPlaying };
}