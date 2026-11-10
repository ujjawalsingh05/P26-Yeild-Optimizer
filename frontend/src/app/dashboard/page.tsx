"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Cpu, Loader2, Activity, ArrowRight, Sparkles, BarChart3, ShieldCheck, Zap, ArrowLeft, Droplets, MapPin, Sun, ThermometerSun, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { api } from '../../lib/api';
import WhatIfSimulator from '../../components/dashboard/WhatIfSimulator';
import ResourceOptimizer from '../../components/dashboard/ResourceOptimizer';
import { useLanguage } from '../../context/LanguageContext';

// --- DYNAMIC NUMBER COUNTER FOR FLOATS ---
const AnimatedFloat = ({ value, duration = 1500 }: { value: number, duration?: number }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(value * easeProgress);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };
    window.requestAnimationFrame(step);
  }, [value, duration]);

  return <span>{displayValue.toFixed(2)}</span>;
};

export default function Dashboard() {
  const { lang, isTranslating } = useLanguage();

  const [formData, setFormData] = useState({
    Fertilizer: 80,
    temp: 28,
    N: 80,
    P: 24,
    K: 20
  });
  
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Initializing ML pipelines...");

  useEffect(() => {
    if (loading) {
      const steps = [
        "Initializing machine learning pipelines...",
        "Analyzing NPK soil ratios...",
        "Evaluating thermal stress factors...",
        "Compiling multi-model forecast..."
      ];
      let step = 0;
      const interval = setInterval(() => {
        step = (step + 1) % steps.length;
        setLoadingText(steps[step]);
      }, 600);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const handlePredict = async () => {
    setLoading(true);
    try {
      const res = await api.post('/predict', { ...formData, lang });
      setTimeout(() => {
        setPrediction(res.data);
        setLoading(false);
      }, 2000); 
    } catch (error) {
      console.error("API Error:", error);
      setLoading(false);
    }
  };

  const maxYield = prediction ? Math.max(
    prediction.all_predictions.random_forest || 0,
    prediction.all_predictions.xgboost || 0,
    prediction.all_predictions.lstm > 0 ? prediction.all_predictions.lstm : 0
  ) : 100;

  // --- QUICK SCENARIOS DATA ---
  const applyScenario = (scenario: any) => {
    setFormData(scenario);
  };

  return (
    <main className="min-h-screen relative flex flex-col bg-transparent text-[#0A2F1D] overflow-x-hidden" style={{ fontFamily: "'Manrope', sans-serif" }}>
      
      {/* NAVBAR */}
      <nav className="w-full p-4 sm:p-6 absolute top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-4 sm:gap-6">
          <Link 
            href="/" 
            className="flex items-center justify-center w-10 h-10 bg-white/70 hover:bg-white rounded-full backdrop-blur-md border border-white shadow-sm transition-all text-[#0A2F1D] group"
            title="Return to Home"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
          </Link>
          <div className="flex items-center gap-2 border-l-2 border-[#0A2F1D]/10 pl-4 sm:pl-6">
            <Image src="/assets/logo4.png" alt="KisanPulse Logo" width={32} height={32} className="rounded-lg shadow-sm" />
            <span className="font-black tracking-tight text-xl hidden sm:block" style={{ fontFamily: "'Fraunces', serif" }}>
              <span>Kisan</span><span className="text-[#10893E]">Pulse</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isTranslating && <Loader2 size={18} className="animate-spin text-[#10893E]" />}
          <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full border border-white shadow-sm backdrop-blur-md">
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </div>
            <span className="text-xs font-black tracking-widest uppercase text-[#0A2F1D]/80">System Active</span>
          </div>
        </div>
      </nav>

      {/* DYNAMIC AMBIENT BACKGROUND WITH DARKER & THICKER SWAYING LEAVES */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#E8E4D9]">
        {/* Glowing Orbs */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }} 
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-15%] right-[-10%] w-[700px] h-[700px] bg-gradient-to-br from-[#10893E]/30 to-transparent rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} 
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-gradient-to-tr from-[#FBC02D]/30 to-transparent rounded-full blur-[150px]" 
        />
        
        {/* Tech Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

        {/* Restored Swaying Background Leaves - DARKER AND MORE VISIBLE */}
        <div className="absolute bottom-[-5%] w-full flex justify-around opacity-[0.18]">
          {[...Array(5)].map((_, i) => (
            <motion.div key={i} animate={{ rotate: [-4, 4, -4] }} transition={{ repeat: Infinity, duration: 4 + (i % 2), ease: "easeInOut" }} className="origin-bottom">
              <Leaf size={450} color="#0A2F1D" strokeWidth={1.2} />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-[1400px] mx-auto pt-24 pb-8 px-4 sm:px-6 lg:px-8 z-10 flex-grow flex flex-col">
        
        {/* HEADER */}
        <div className="mb-6 flex flex-col lg:flex-row justify-between items-end gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight drop-shadow-sm mb-2" style={{ fontFamily: "'Fraunces', serif" }}>
              <span>AI Yield</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10893E] to-[#14A049]">Optimizer</span>
            </h1>
            <p className="text-sm text-[#0A2F1D]/70 font-bold max-w-2xl uppercase tracking-wider">
              Comparative Analysis: Random Forest • XGBoost • LSTM
            </p>
          </div>
          
          <div className="hidden lg:flex gap-3">
            <div className="bg-white/60 px-3 py-1.5 rounded-lg border border-white shadow-sm flex items-center gap-1.5 text-xs font-bold text-[#0A2F1D]/60"><MapPin size={14}/> Simulation Mode</div>
            <div className="bg-white/60 px-3 py-1.5 rounded-lg border border-white shadow-sm flex items-center gap-1.5 text-xs font-bold text-[#0A2F1D]/60"><Droplets size={14}/> NPK Tuning</div>
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 flex-grow">
          
          {/* LEFT COLUMN: CONTROLS */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col h-full">
            <div className="flex-grow flex flex-col bg-white/70 backdrop-blur-2xl rounded-3xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden relative">
              
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#14A049] via-[#FBC02D] to-[#10893E]"></div>

              <div className="p-6 sm:p-8 flex-grow flex flex-col">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#0A2F1D]/5">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-[#10893E]/10 rounded-xl text-[#10893E]">
                      <Cpu size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black tracking-tight">Simulation Engine</h2>
                      <p className="text-xs text-[#0A2F1D]/50 font-bold tracking-wider uppercase mt-0.5">Parameters</p>
                    </div>
                  </div>
                </div>
                
                {/* SLIDERS */}
                <div>
                  <WhatIfSimulator formData={formData} setFormData={setFormData} />
                </div>

                {/* QUICK SCENARIOS */}
                <div className="mt-auto pt-8">
                  <div className="border-t border-[#0A2F1D]/5 pt-6">
                    <h3 className="text-xs font-black uppercase text-[#0A2F1D]/40 tracking-widest mb-4 flex items-center gap-2">
                      <Sparkles size={14} /> Quick Scenarios
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      
                      <button 
                        onClick={() => applyScenario({ Fertilizer: 100, temp: 24, N: 110, P: 40, K: 35 })}
                        className="flex flex-col items-center justify-center p-3 bg-white hover:bg-[#10893E]/5 border border-[#0A2F1D]/10 rounded-2xl transition-all hover:border-[#10893E]/30 hover:-translate-y-1 shadow-sm group"
                      >
                        <Sun size={20} className="text-[#10893E] mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-[11px] font-bold text-[#0A2F1D] text-center">Optimal Growth</span>
                      </button>
                      
                      <button 
                        onClick={() => applyScenario({ Fertilizer: 60, temp: 38, N: 60, P: 25, K: 20 })}
                        className="flex flex-col items-center justify-center p-3 bg-white hover:bg-orange-50 border border-[#0A2F1D]/10 rounded-2xl transition-all hover:border-orange-300 hover:-translate-y-1 shadow-sm group"
                      >
                        <ThermometerSun size={20} className="text-orange-500 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-[11px] font-bold text-[#0A2F1D] text-center">Heat Stress</span>
                      </button>
                      
                      <button 
                        onClick={() => applyScenario({ Fertilizer: 30, temp: 28, N: 30, P: 15, K: 15 })}
                        className="flex flex-col items-center justify-center p-3 bg-white hover:bg-red-50 border border-[#0A2F1D]/10 rounded-2xl transition-all hover:border-red-300 hover:-translate-y-1 shadow-sm group"
                      >
                        <AlertTriangle size={20} className="text-red-500 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-[11px] font-bold text-[#0A2F1D] text-center">Nutrient Deficit</span>
                      </button>

                    </div>
                  </div>
                </div>
              </div>

              {/* FLUSH BUTTON AT BOTTOM */}
              <button 
                onClick={handlePredict}
                disabled={loading}
                className="w-full bg-[#0A2F1D] text-white py-5 font-black text-lg hover:bg-[#10893E] transition-colors flex items-center justify-center gap-3 group relative overflow-hidden shrink-0"
              >
                <span className="absolute inset-0 w-full h-full -translate-x-[150%] skew-x-[-25deg] bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-[150%] transition-transform duration-700 ease-out z-0"></span>
                <span className="relative z-10 flex items-center gap-2">
                  <Zap size={20} className={`${loading ? 'animate-pulse text-[#FBC02D]' : 'text-[#FBC02D]'}`} />
                  <span>{loading ? "Processing Data..." : "Run AI Prediction"}</span>
                  {!loading && <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />}
                </span>
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: DYNAMIC RESULTS */}
          <div className="lg:col-span-6 xl:col-span-7 h-full min-h-[600px]">
            <AnimatePresence mode="wait">
              
              {/* STATE 1: IDLE */}
              {!loading && !prediction && (
                <motion.div 
                  key="idle" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                  className="h-full flex flex-col items-center justify-center p-10 bg-white/40 backdrop-blur-xl rounded-3xl border-2 border-dashed border-[#0A2F1D]/15 text-center"
                >
                  <div className="w-24 h-24 bg-white/80 rounded-full flex items-center justify-center mb-6 shadow-sm border border-white">
                    <BarChart3 size={40} className="text-[#0A2F1D]/30" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-black mb-2 tracking-tight">System Standby</h3>
                  <p className="text-[#0A2F1D]/50 font-medium leading-relaxed max-w-sm">
                    Adjust the agronomy sliders and initialize the prediction engine to generate analytics.
                  </p>
                </motion.div>
              )}

              {/* STATE 2: LOADING */}
              {loading && (
                <motion.div 
                  key="loading" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -20 }}
                  className="h-full flex flex-col items-center justify-center p-10 bg-[#0A2F1D] text-white rounded-3xl shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-20 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none"></div>
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-[#10893E] blur-[40px] opacity-40 rounded-full animate-pulse" />
                    <div className="w-20 h-20 border-4 border-[#10893E]/30 border-t-[#10893E] rounded-full animate-spin flex items-center justify-center">
                      <Cpu size={28} className="text-[#10893E] animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Compiling Metrics</h3>
                  <div className="bg-black/30 px-5 py-2 rounded-lg border border-white/10">
                    <p className="text-[#FBC02D] font-mono text-xs tracking-wider animate-pulse">{loadingText}</p>
                  </div>
                </motion.div>
              )}

              {/* STATE 3: RESULTS */}
              {!loading && prediction && (
                <motion.div 
                  key="results" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 100 }}
                  className="bg-white/90 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-white shadow-xl h-full flex flex-col relative"
                >
                  <div className="absolute top-6 right-6 bg-[#FBC02D]/20 text-[#0A2F1D] border border-[#FBC02D]/50 font-black text-[10px] sm:text-xs px-3 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-[#D49A1C]" /> <span>Analysis Complete</span>
                  </div>

                  <h3 className="text-xs font-black uppercase text-[#0A2F1D]/40 tracking-widest mb-1">Optimal Forecast</h3>
                  
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-6xl sm:text-[5rem] font-black text-[#0A2F1D] tracking-tighter" data-no-translate="true">
                      <AnimatedFloat value={prediction.predicted_yield} />
                    </span>
                    <span className="text-xl font-bold text-[#0A2F1D]/50 mb-2">t/ha</span>
                  </div>

                  <div className="bg-gradient-to-r from-[#10893E]/10 to-transparent p-4 rounded-xl border-l-4 border-[#10893E] mb-6">
                    <div className="flex items-start gap-2">
                      <Sparkles size={18} className="text-[#10893E] shrink-0 mt-0.5" />
                      <p className="text-[#0A2F1D]/80 text-sm font-medium leading-relaxed">
                        <span>Based on current soil and temperature parameters, the</span>{" "}
                        <strong className="text-[#0A2F1D]">{prediction.model}</strong>{" "}
                        <span>model determined this optimal yield forecast.</span>
                      </p>
                    </div>
                  </div>

                  <ResourceOptimizer insight={prediction.insight} />
                  
                  <div className="flex-grow mt-2 pt-6 border-t border-[#0A2F1D]/10">
                    <h3 className="text-xs font-black uppercase text-[#0A2F1D]/40 tracking-widest mb-5">Model Comparison Graph</h3>
                    
                    <div className="space-y-4">
                      {/* Random Forest Bar */}
                      <div className="relative">
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-[#0A2F1D]">Random Forest</span>
                          <span className="text-[#0A2F1D]/60" data-no-translate="true">{prediction.all_predictions.random_forest.toFixed(2)} t/ha</span>
                        </div>
                        <div className="w-full bg-[#0A2F1D]/5 rounded-full h-3 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: `${(prediction.all_predictions.random_forest / maxYield) * 100}%` }} 
                            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                            className={`h-full rounded-full ${prediction.model === "Random Forest" ? 'bg-gradient-to-r from-[#10893E] to-[#14A049]' : 'bg-[#0A2F1D]/30'}`}
                          />
                        </div>
                      </div>

                      {/* XGBoost Bar */}
                      <div className="relative">
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-[#0A2F1D]">XGBoost</span>
                          <span className="text-[#0A2F1D]/60" data-no-translate="true">{prediction.all_predictions.xgboost.toFixed(2)} t/ha</span>
                        </div>
                        <div className="w-full bg-[#0A2F1D]/5 rounded-full h-3 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: `${(prediction.all_predictions.xgboost / maxYield) * 100}%` }} 
                            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                            className={`h-full rounded-full ${prediction.model === "XGBoost" ? 'bg-gradient-to-r from-[#10893E] to-[#14A049]' : 'bg-[#0A2F1D]/30'}`}
                          />
                        </div>
                      </div>

                      {/* LSTM Bar */}
                      <div className="relative">
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-[#0A2F1D]">LSTM (Deep Learning)</span>
                          <span className="text-[#0A2F1D]/60" data-no-translate="true">
                            {prediction.all_predictions.lstm > 0 ? `${prediction.all_predictions.lstm.toFixed(2)} t/ha` : 'Offline'}
                          </span>
                        </div>
                        <div className="w-full bg-[#0A2F1D]/5 rounded-full h-3 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: `${prediction.all_predictions.lstm > 0 ? (prediction.all_predictions.lstm / maxYield) * 100 : 0}%` }} 
                            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                            className={`h-full rounded-full ${prediction.model === "LSTM" ? 'bg-gradient-to-r from-[#10893E] to-[#14A049]' : 'bg-[#0A2F1D]/30'}`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}