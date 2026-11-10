"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import { ChevronRight, Loader2, Globe, Cpu, Sprout, Activity, Mic } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

// --- MEMORY-SAFE ANIMATED COUNTER ---
const AnimatedCounter = ({ end, suffix = "", duration = 2000 }: { end: number, suffix?: string, duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let observer: IntersectionObserver;
    let animationFrameId: number;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      setCount(Math.floor(end * percentage));

      if (progress < duration) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        animationFrameId = requestAnimationFrame(animate);
        observer.disconnect();
      }
    }, { threshold: 0.1 });

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (observer) observer.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [end, duration]);

  return <span ref={ref} data-no-translate="true">{count.toLocaleString()}{suffix}</span>;
};

interface WavingWheatProps {
  className?: string;
  duration?: string;
  delay?: string;
  rotation?: string;
  reverse?: boolean;
  style?: React.CSSProperties;
}

const WavingWheat = ({ className, duration = "4s", delay = "0s", rotation = "5deg", reverse = false, style }: WavingWheatProps) => (
  <svg viewBox="0 0 100 400" className={`absolute bottom-0 origin-bottom ${className}`} style={{ ...style, animation: `sway ${duration} ease-in-out ${delay} infinite alternate`, ['--sway-angle' as any]: rotation }} preserveAspectRatio="xMidYMax meet">
    <g fill="currentColor" transform={reverse ? "translate(100, 0) scale(-1, 1)" : ""}>
      <path d="M50 400 Q 80 200, 50 80" stroke="currentColor" strokeWidth="7" fill="none" />
      <path d="M60 350 Q 25 310, 20 230 Q 40 290, 60 310" opacity="0.95" />
      <path d="M62 280 Q 95 240, 100 160 Q 80 220, 62 240" opacity="0.95" />
      <path d="M58 200 Q 25 170, 20 100 Q 40 150, 58 170" opacity="0.95" />
      <g transform="translate(4, 5) rotate(10 50 50) scale(1.1)">
        <path d="M50 80 C 40 70, 40 50, 50 40 C 60 50, 60 70, 50 80 Z" />
        <path d="M50 60 C 40 50, 40 30, 50 20 C 60 30, 60 50, 50 60 Z" />
        <path d="M50 40 C 42 30, 42 15, 50 5 C 58 15, 58 30, 50 40 Z" />
      </g>
      <path d="M48 60 Q 25 30, 20 15 M 58 60 Q 80 30, 85 15 M 48 40 Q 28 10, 25 -5 M 58 40 Q 78 10, 80 -5 M 50 20 Q 45 -10, 40 -25 M 56 20 Q 60 -10, 65 -25" stroke="currentColor" strokeWidth="2.5" fill="none" opacity="0.9" />
    </g>
  </svg>
);

export default function HomePage() {
  const { lang, setLang, isTranslating } = useLanguage();
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]); 

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  // PRO FEATURES DATA (Now using Lucide React Components)
  const features = [
    { title: "AI Yield Prediction", description: "Leverage Random Forest and LSTM models to forecast crop production accurately.", icon: Cpu, color: "text-[#FBC02D]" },
    { title: "Soil Optimization", description: "Analyze NPK and temperature metrics to receive actionable agricultural insights.", icon: Sprout, color: "text-[#10893E]" },
    { title: "Real-Time Tracking", description: "Monitor active conditions and optimize resource allocation seamlessly.", icon: Activity, color: "text-[#FBC02D]" },
    { title: "Voice Assistance", description: "Get insights delivered instantly via the integrated Jarvis AI text-to-speech engine.", icon: Mic, color: "text-[#10893E]" },
  ];

  const backgroundWheat = Array.from({ length: 24 }).map((_, i) => ({
    left: `${(i * 4.6) - 5}%`, height: `${45 + (i % 3)*5}vh`,
    duration: `${5 + (i % 3)}s`, delay: `-${i % 4}s`, rotation: `${3 + (i % 2)}deg`, 
    color: "text-[#B8A369] opacity-[0.25]",
    reverse: i % 2 === 0 
  }));
  
  const midgroundWheat = Array.from({ length: 26 }).map((_, i) => ({
    left: `${(i * 3.9) - 2}%`, height: `${35 + (i % 4)*4}vh`,
    duration: `${4 + (i % 3)}s`, delay: `-${i % 5}s`, rotation: `${4 + (i % 3)}deg`, 
    color: "text-[#8CA77F] opacity-[0.35]",
    reverse: i % 2 !== 0 
  }));
  
  const foregroundWheat = Array.from({ length: 26 }).map((_, i) => ({
    left: `${(i * 4) - 4}%`, height: `${25 + (i % 3)*4}vh`,
    duration: `${2.8 + (i % 2)}s`, delay: `-${i % 3}s`, rotation: `${6 + (i % 4)}deg`,
    color: "text-[#0C6B2E] opacity-[0.5]",
    reverse: i % 2 === 0 
  }));

  return (
    <main className="min-h-screen bg-[#FDF8EE] overflow-hidden selection:bg-[#FBC02D] selection:text-[#0A2F1D]" style={{ fontFamily: "'Manrope', sans-serif" }}>
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700;9..144,900&family=Manrope:wght@500;700;800&display=swap');
        body { font-family: 'Manrope', sans-serif; }
        @keyframes ticker { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        .animate-ticker { display: inline-block; white-space: nowrap; animation: ticker 30s linear infinite; }
        .animate-ticker:hover { animation-play-state: paused; }
        @keyframes rolling-shine { 0% { background-position: 200% center; } 100% { background-position: -200% center; } }
        .intelligence-effect {
          font-family: 'Fraunces', serif;
          background: linear-gradient(to right, #0A2F1D 20%, #10893E 35%, #FBC02D 50%, #10893E 65%, #0A2F1D 80%);
          background-size: 200% auto; 
          color: transparent; 
          -webkit-background-clip: text; 
          background-clip: text;
          animation: rolling-shine 6s linear infinite;
        }
        .heading-serif { font-family: 'Fraunces', serif; }
        @keyframes sway {
          0% { transform: rotate(calc(-1 * var(--sway-angle))); }
          100% { transform: rotate(var(--sway-angle)); }
        }
      `}} />

      {/* NAVBAR */}
      <motion.nav initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease: "easeOut" }} className="absolute top-0 w-full flex justify-between items-center p-6 z-50">
        <div className="flex items-center gap-3 ml-2 sm:ml-4">
          <Image 
            src="/assets/logo4.png" 
            onError={(e) => { e.currentTarget.src = "/logo4.png"; }}
            alt="KisanPulse Logo" 
            width={48} 
            height={48} 
            className="drop-shadow-md rounded-xl"
          />
          <span className="text-2xl font-black tracking-tight text-[#0A2F1D]" style={{ fontFamily: "'Fraunces', serif" }}>
            <span>Kisan</span><span className="text-[#10893E]">Pulse</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          {isTranslating && <Loader2 size={18} className="animate-spin text-[#10893E]" />}
          
          <div className="relative group flex items-center bg-white/60 backdrop-blur-xl border border-[#0A2F1D]/10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-full px-2 py-1 transition-all hover:bg-white hover:shadow-md">
            <Globe size={18} className="text-[#10893E] ml-2 group-hover:animate-pulse" />
            <select 
              value={lang} 
              onChange={(e) => setLang(e.target.value)}
              data-no-translate="true"
              className="appearance-none bg-transparent text-[#0A2F1D] font-black text-sm rounded-full px-3 py-1.5 outline-none cursor-pointer pr-6"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
            </select>
            <div className="absolute right-3 pointer-events-none text-[#0A2F1D]/50 text-[10px]">▼</div>
          </div>
        </div>
      </motion.nav>

      {/* LIVE AI ACCURACY TICKER */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="absolute top-24 w-full bg-[#0A2F1D] text-[#FBC02D] py-2.5 overflow-hidden z-40 shadow-xl border-y border-[#10893E]/50 backdrop-blur-sm">
        <div className="animate-ticker font-bold tracking-wider text-sm">
          <span>🚨 SYSTEM ONLINE: </span>
          <span className="mx-4 text-white/50">•</span> <span>Random Forest R2: 0.991</span> <span className="text-green-400">▲ Optimal</span>
          <span className="mx-4 text-white/50">•</span> <span>XGBoost R2: 0.988</span> <span className="text-green-400">▲ Optimal</span>
          <span className="mx-4 text-white/50">•</span> <span>LSTM Engine R2: 0.876</span> <span className="text-green-400">▲ Active</span>
        </div>
      </motion.div>

      {/* HERO SECTION */}
      <section className="relative min-h-[100vh] flex flex-col items-center justify-center text-center px-4 pt-32 pb-32 perspective-[1200px] overflow-hidden">
        
        <motion.div style={{ y: yBg }} className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          <div className="absolute top-[15%] left-[-5%] w-[500px] h-[500px] bg-[#10893E] rounded-full mix-blend-multiply filter blur-[120px] opacity-10 animate-pulse"></div>
          <div className="absolute bottom-[5%] right-[-5%] w-[600px] h-[600px] bg-[#FBC02D] rounded-full mix-blend-multiply filter blur-[120px] opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </motion.div>

        {/* WHEAT ANIMATION CONTAINER */}
        <div className="absolute bottom-0 w-full h-[60vh] pointer-events-none z-0 overflow-hidden">
          {[...backgroundWheat, ...midgroundWheat, ...foregroundWheat].map((wheat, idx) => (
            <WavingWheat 
              key={idx}
              className={wheat.color}
              duration={wheat.duration}
              delay={wheat.delay}
              rotation={wheat.rotation}
              reverse={wheat.reverse}
              style={{ left: wheat.left, height: wheat.height, width: "auto" }}
            />
          ))}
        </div>

        {/* SOFT GRADIENT FADE FOR WHEAT ROOTS */}
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-b from-transparent to-[#F5F0E1] z-10 pointer-events-none"></div>

        {/* HERO CONTENT CONTAINER */}
        <motion.div 
          onMouseMove={handleMouseMove} 
          onMouseLeave={handleMouseLeave} 
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative z-20 flex flex-col items-center justify-center w-full max-w-5xl cursor-default py-10 -mt-12"
        >
          <div className="relative flex items-center justify-center" style={{ transform: "translateZ(60px)" }}>
            <motion.img 
              animate={{ rotate: 360 }} 
              transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
              src="/assets/logo4.png" 
              onError={(e) => { e.currentTarget.src = "/logo4.png"; }}
              alt="Watermark" 
              className="absolute w-[340px] h-[340px] md:w-[480px] md:h-[480px] opacity-15 mix-blend-darken grayscale pointer-events-none select-none object-contain -z-10" 
            />

            <motion.h1 
              initial={{ scale: 0.8, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              transition={{ type: "spring", damping: 15, stiffness: 100 }}
              className="heading-serif intelligence-effect text-6xl md:text-[6rem] font-black tracking-tighter drop-shadow-[0_15px_15px_rgba(10,47,29,0.15)] pb-2 pr-4 leading-none relative z-10"
            >
              KisanPulse
            </motion.h1>
          </div>

          <div style={{ transform: "translateZ(40px)" }} className="relative z-10">
            <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="text-lg md:text-xl text-[#2D503C] font-semibold max-w-xl mb-8 mt-4 drop-shadow-sm">
              Empowering the modern farmer. Forecast crop yields instantly with intelligent machine learning.
            </motion.p>
          </div>

          <div style={{ transform: "translateZ(80px)" }} className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 relative z-10">
            <Link href="/dashboard" className="group relative overflow-hidden px-8 py-4 bg-gradient-to-b from-[#14A049] to-[#10893E] text-white text-base font-bold rounded-2xl shadow-[0_12px_25px_rgba(16,137,62,0.3)] hover:shadow-[0_20px_40px_rgba(16,137,62,0.5)] transform hover:-translate-y-1 transition-all duration-300">
              <span className="absolute inset-0 w-full h-full -translate-x-[150%] skew-x-[-25deg] bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:translate-x-[150%] transition-transform duration-700 ease-out z-0"></span>
              <span className="relative z-10 flex items-center justify-center">
                <span>Enter Dashboard</span>
                <ChevronRight className="ml-2 group-hover:translate-x-1.5 transition-transform" />
              </span>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* STATS SECTION */}
      <section className="py-24 bg-[#F5F0E1] relative z-10 border-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            {[
              { end: 2076, suffix: "", label: "Data Points Analyzed" },
              { end: 5, suffix: "", label: "Soil & Weather Features" },
              { end: 99, suffix: "%", label: "Model Accuracy" }
            ].map((stat, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: idx * 0.2 }}>
                <h3 className="heading-serif text-6xl md:text-7xl font-black text-[#0A2F1D] mb-2 drop-shadow-sm">
                  <AnimatedCounter end={stat.end} suffix={stat.suffix} duration={2500} />
                </h3>
                <p className="text-[#10893E] font-bold text-lg md:text-xl uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PREMIUM FEATURES SECTION (GREEN SECTION) */}
      <section className="pt-40 pb-32 bg-[#0A2F1D] relative z-10 text-[#FDF8EE] overflow-hidden">
        
        {/* BLURRY GRADIENT SEPARATION */}
        <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-[#F5F0E1] to-transparent pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#10893E]/10 via-[#0A2F1D] to-[#0A2F1D] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-24">
            <h2 className="heading-serif text-5xl md:text-6xl font-black text-[#FBC02D] mb-6 drop-shadow-[0_0_15px_rgba(251,192,45,0.15)]">Everything you need to thrive</h2>
            <p className="text-xl md:text-2xl text-[#E2DFD3] max-w-3xl mx-auto font-medium">Enterprise-level machine learning, simplified for the fields.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 40 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true, margin: "-50px" }} 
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative bg-[#0D3823]/60 backdrop-blur-xl p-8 sm:p-10 rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden cursor-default transition-all duration-500 hover:-translate-y-1 hover:border-[#10893E]/40"
              >
                {/* Premium Subtle Hover Glow Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#10893E]/0 to-[#10893E]/0 group-hover:from-[#10893E]/10 group-hover:to-transparent transition-all duration-500 pointer-events-none"></div>
                
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-inner transition-all duration-500 group-hover:scale-110 group-hover:bg-[#10893E]/20 group-hover:border-[#10893E]/30" data-no-translate="true">
                    <feature.icon size={26} className={feature.color} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-black tracking-tight text-white mb-4 group-hover:text-[#FBC02D] transition-colors duration-300">{feature.title}</h3>
                  <p className="text-[#9BAE9F] leading-relaxed font-medium text-[1.05rem]">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}