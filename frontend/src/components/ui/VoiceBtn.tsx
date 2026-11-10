import { Mic, Volume2 } from 'lucide-react';
import { useVoice } from '../../hooks/useVoice';

export default function VoiceBtn({ textToRead }: { textToRead: string }) {
  const { playVoice, isPlaying } = useVoice();

  return (
    <button 
      onClick={() => playVoice(textToRead)}
      disabled={isPlaying}
      className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all shadow-md
        ${isPlaying 
          ? 'bg-[#FBC02D] text-[#0A2F1D] animate-pulse' 
          : 'bg-[#10893E] text-white hover:bg-[#14A049]'
        }`}
    >
      {isPlaying ? <Volume2 size={18} /> : <Mic size={18} />}
      {isPlaying ? 'Speaking...' : 'Listen to Insights'}
    </button>
  );
}