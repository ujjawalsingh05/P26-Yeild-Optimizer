"use client";

import { useState, useRef } from 'react';
import { Volume2, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function ResourceOptimizer({ insight }: { insight: string }) {
  const { lang } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const insightRef = useRef<HTMLParagraphElement>(null);

  const handlePlayAudio = () => {
    if (isPlaying) return;
    setIsPlaying(true);

    const textToRead = insightRef.current?.innerText?.trim() || insight;

    const url = `http://localhost:8000/tts?text=${encodeURIComponent(textToRead)}&lang=${lang}&t=${Date.now()}`;
    const audio = new Audio(url);
    
    audio.play().catch(() => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(textToRead);
        const langMap: Record<string, string> = { en: 'en-IN', hi: 'hi-IN', pa: 'pa-IN' };
        utterance.lang = langMap[lang] || 'en-IN';
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
      } else {
        setIsPlaying(false);
      }
    });

    audio.onended = () => setIsPlaying(false);
  };

  return (
    <div className="bg-gradient-to-br from-[#10893E]/5 to-transparent p-5 rounded-2xl border border-[#10893E]/20 mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between relative overflow-hidden">
      
      {/* Decorative background glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex-grow pr-4 relative z-10">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-bold text-[#10893E] uppercase tracking-wider flex items-center gap-1">
            <AlertCircle size={14} /> <span>Optimization Strategy</span>
          </h4>
          
          {/* GEMINI AI BADGE */}
          <div className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2 py-0.5 rounded-full shadow-sm" data-no-translate="true">
            <Sparkles size={10} className="animate-pulse" />
            <span className="text-[9px] font-black tracking-widest uppercase">Gemini AI</span>
          </div>
        </div>
        
        <p ref={insightRef} className="text-[#0A2F1D] font-medium leading-relaxed text-sm">
          {insight}
        </p>
      </div>
      
      <button 
        onClick={handlePlayAudio}
        disabled={isPlaying}
        className={`relative z-10 shrink-0 flex items-center gap-2 px-4 py-3 rounded-xl font-bold transition-all shadow-sm ${
          isPlaying 
            ? "bg-[#0A2F1D] text-white cursor-wait" 
            : "bg-[#10893E] text-white hover:bg-[#0A2F1D] hover:-translate-y-0.5 shadow-[0_4px_15px_rgba(16,137,62,0.2)]"
        }`}
      >
        {isPlaying ? <Loader2 size={18} className="animate-spin" /> : <Volume2 size={18} />}
        <span>{isPlaying ? "Playing..." : "Listen to Insights"}</span>
      </button>
    </div>
  );
}