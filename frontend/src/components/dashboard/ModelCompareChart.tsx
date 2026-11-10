import { BarChart2 } from 'lucide-react';

interface CompareProps {
  data: {
    random_forest: number;
    xgboost: number;
    lstm: number;
    recommended_model: string;
  } | null;
}

export default function ModelCompareChart({ data }: CompareProps) {
  if (!data) return null;

  return (
    <div className="mt-6">
      <h3 className="flex items-center gap-2 font-bold text-[#0A2F1D] mb-4 border-b border-[#0A2F1D]/10 pb-2">
        <BarChart2 size={20} className="text-[#10893E]" /> Model Comparison
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
          <span className="font-semibold">Random Forest</span>
          <span className="font-black text-[#10893E]">{data.random_forest} t/ha</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
          <span className="font-semibold">XGBoost</span>
          <span className="font-black text-blue-600">{data.xgboost} t/ha</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
          <span className="font-semibold">LSTM (Deep Learning)</span>
          <span className="font-black text-purple-600">{data.lstm} t/ha</span>
        </div>
      </div>
      <p className="mt-4 text-sm text-[#0A2F1D]/70 font-medium text-center">
        Recommended: <span className="font-bold text-[#10893E]">{data.recommended_model}</span>
      </p>
    </div>
  );
}