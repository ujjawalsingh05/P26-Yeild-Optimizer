interface SimulatorProps {
  formData: any;
  setFormData: (data: any) => void;
}

export default function WhatIfSimulator({ formData, setFormData }: SimulatorProps) {
  const handleChange = (field: string, value: number) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="font-bold text-[#0A2F1D] text-sm">Fertilizer (kg/ha): {formData.Fertilizer}</label>
        <input type="range" min="0" max="150" value={formData.Fertilizer} onChange={(e) => handleChange('Fertilizer', Number(e.target.value))} className="w-full accent-[#10893E]" />
      </div>
      <div className="space-y-2">
        <label className="font-bold text-[#0A2F1D] text-sm">Temperature (°C): {formData.temp}</label>
        <input type="range" min="15" max="45" value={formData.temp} onChange={(e) => handleChange('temp', Number(e.target.value))} className="w-full accent-orange-500" />
      </div>
      <div className="space-y-2">
        <label className="font-bold text-blue-700 text-sm">Nitrogen (N): {formData.N}</label>
        <input type="range" min="0" max="150" value={formData.N} onChange={(e) => handleChange('N', Number(e.target.value))} className="w-full accent-blue-600" />
      </div>
      <div className="space-y-2">
        <label className="font-bold text-red-700 text-sm">Phosphorus (P): {formData.P}</label>
        <input type="range" min="0" max="100" value={formData.P} onChange={(e) => handleChange('P', Number(e.target.value))} className="w-full accent-red-600" />
      </div>
      <div className="space-y-2 md:col-span-2 md:w-1/2 md:mx-auto">
        <label className="font-bold text-yellow-700 text-sm">Potassium (K): {formData.K}</label>
        <input type="range" min="0" max="100" value={formData.K} onChange={(e) => handleChange('K', Number(e.target.value))} className="w-full accent-yellow-600" />
      </div>
    </div>
  );
}