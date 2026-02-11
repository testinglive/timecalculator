
import React, { useState, useCallback, useMemo } from 'react';
import { CalculationInputs, CalculationResult } from './types';
import { calculateFreedomTime } from './logic';

const App: React.FC = () => {
  const [inputs, setInputs] = useState<CalculationInputs>({
    completedHrs: '',
    completedMins: '',
    lastInHrs: '',
    lastInMins: ''
  });
  const [result, setResult] = useState<CalculationResult | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value.length > 2) return;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleCalculate = useCallback(() => {
    const res = calculateFreedomTime(inputs);
    setResult(res);
  }, [inputs]);

  const progress = useMemo(() => {
    const h = parseInt(inputs.completedHrs) || 0;
    const m = parseInt(inputs.completedMins) || 0;
    const totalMins = (h * 60) + m;
    const targetMins = 8 * 60;
    return Math.min(100, Math.max(0, (totalMins / targetMins) * 100));
  }, [inputs.completedHrs, inputs.completedMins]);

  // Analog Clock Calculations
  const clockAngles = useMemo(() => {
    if (!result || !result.isValid) return { hr: 0, min: 0 };
    const hr = ((result.hours % 12) / 12) * 360 + (result.minutes / 60) * 30;
    const min = (result.minutes / 60) * 360;
    return { hr, min };
  }, [result]);

  return (
    <div className="h-screen w-screen flex items-center justify-center p-4 md:p-8 font-['JetBrains_Mono',monospace] text-cyan-500 overflow-hidden relative selection:bg-cyan-500/30">
      
      {/* Corner Brackets Decorations */}
      <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-cyan-500/40 pointer-events-none"></div>
      <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-cyan-500/40 pointer-events-none"></div>
      <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-cyan-500/40 pointer-events-none"></div>
      <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-cyan-500/40 pointer-events-none"></div>

      {/* Main Console Container */}
      <div className="relative w-full max-w-5xl h-full flex flex-col justify-between py-4">
        
        {/* Top Header Section */}
        <div className="flex justify-between items-start border-b border-cyan-500/20 pb-4">
          <div>
            <div className="text-[10px] font-bold tracking-[0.4em] opacity-60 mb-1">TERMINAL: EXTRACTION_AUTH_V5.0</div>
            <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase font-['Orbitron'] text-white">
              Tactical <span className="text-cyan-500">HUD</span>
            </h1>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-[10px] opacity-40 font-bold uppercase tracking-widest">Sector: Logistical Independence</div>
            <div className="text-[10px] opacity-40">ENCRYPTION: QUANTUM-SHIFTED-RSA</div>
          </div>
        </div>

        {/* Middle Interactive Zone */}
        <div className="flex-grow flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 py-4 overflow-hidden">
          
          {/* Left: Dynamic Circular Gauge / Analog Clock */}
          <div className="relative w-64 h-64 md:w-80 md:h-80 flex-shrink-0">
            {/* The outer decorative ring */}
            <div className="absolute inset-0 border-[1px] border-cyan-500/20 rounded-full scale-[1.05] animate-pulse"></div>
            
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Transition logic for Gauge vs Clock */}
              <div className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${result?.isValid ? 'opacity-0 scale-75 rotate-90 pointer-events-none' : 'opacity-100 scale-100 rotate-0'}`}>
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="50%" cy="50%" r="45%"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="opacity-10"
                  />
                  <circle
                    cx="50%" cy="50%" r="45%"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeDasharray="283%"
                    strokeDashoffset={`${283 - (progress * 2.83)}%`}
                    className={`transition-all duration-1000 ease-out ${progress >= 100 ? 'text-green-500' : 'text-cyan-400'}`}
                    strokeLinecap="round"
                    style={{ strokeDasharray: '283 283' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-5xl md:text-6xl font-black font-['Orbitron'] text-white drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                    {Math.round(progress)}<span className="text-xl">%</span>
                  </div>
                  <div className="text-[10px] font-bold tracking-[0.3em] opacity-40 uppercase">Sync Rate</div>
                </div>
              </div>

              {/* The Analog Tactical Clock */}
              <div className={`absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] transform ${result?.isValid ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-125 -rotate-90 pointer-events-none'}`}>
                <div className="relative w-full h-full border-2 border-cyan-500/30 rounded-full shadow-[0_0_30px_rgba(6,182,212,0.1)]">
                  {/* Clock Face Details */}
                  {[...Array(12)].map((_, i) => (
                    <div 
                      key={i} 
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                      style={{ transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-120px)` }}
                    >
                      <div className={`h-3 w-1 ${i % 3 === 0 ? 'bg-cyan-500 h-5 w-[2px]' : 'bg-cyan-500/30'}`}></div>
                    </div>
                  ))}
                  
                  {/* Hour Hand */}
                  <div 
                    className="absolute top-1/2 left-1/2 w-1.5 h-20 bg-white rounded-full origin-bottom -translate-x-1/2 -translate-y-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                    style={{ transform: `translate(-50%, -100%) rotate(${clockAngles.hr}deg)` }}
                  >
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full blur-[2px]"></div>
                  </div>
                  
                  {/* Minute Hand */}
                  <div 
                    className="absolute top-1/2 left-1/2 w-1 h-28 bg-cyan-400 rounded-full origin-bottom -translate-x-1/2 -translate-y-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(34,211,238,0.5)]"
                    style={{ transform: `translate(-50%, -100%) rotate(${clockAngles.min}deg)` }}
                  >
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-6 bg-cyan-400/50 rounded-full animate-pulse"></div>
                  </div>

                  {/* Center Dot */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-cyan-500 rounded-full border-2 border-black z-10 shadow-[0_0_10px_rgba(6,182,212,1)]"></div>
                  
                  {/* Target Time Text */}
                  <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-[10px] font-black tracking-widest text-cyan-500/60 uppercase text-center w-full">
                    Target Lock: {result?.formatted}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Input Control Panel */}
          <div className="w-full max-w-sm space-y-6">
            <div className="space-y-4">
              <div className="relative p-5 bg-cyan-500/5 border-l-4 border-cyan-500 group transition-all hover:bg-cyan-500/10 rounded-r-lg">
                <div className="flex justify-between items-center mb-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-70">Shift Duration Logged</label>
                    <div className="text-[10px] text-cyan-500/30">ID: COMP_01</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <input 
                      type="number" 
                      name="completedHrs" 
                      placeholder="00" 
                      value={inputs.completedHrs} 
                      onChange={handleInputChange}
                      className="w-full bg-black/40 border border-cyan-500/30 rounded-lg px-3 py-3 text-2xl font-bold text-white outline-none focus:border-cyan-500 transition-colors text-center font-['Orbitron']"
                    />
                    <div className="text-[9px] mt-1 text-center font-bold opacity-30">HOURS</div>
                  </div>
                  <div className="text-2xl font-bold opacity-20">:</div>
                  <div className="flex-1">
                    <input 
                      type="number" 
                      name="completedMins" 
                      placeholder="00" 
                      value={inputs.completedMins} 
                      onChange={handleInputChange}
                      className="w-full bg-black/40 border border-cyan-500/30 rounded-lg px-3 py-3 text-2xl font-bold text-white outline-none focus:border-cyan-500 transition-colors text-center font-['Orbitron']"
                    />
                    <div className="text-[9px] mt-1 text-center font-bold opacity-30">MINUTES</div>
                  </div>
                </div>
              </div>

              <div className="relative p-5 bg-purple-500/5 border-l-4 border-purple-500 group transition-all hover:bg-purple-500/10 rounded-r-lg">
                <div className="flex justify-between items-center mb-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-70">Infiltration Pulse (Last In)</label>
                    <div className="text-[10px] text-purple-500/30">ID: ENTRY_02</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <input 
                      type="number" 
                      name="lastInHrs" 
                      placeholder="00" 
                      value={inputs.lastInHrs} 
                      onChange={handleInputChange}
                      className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-3 py-3 text-2xl font-bold text-white outline-none focus:border-purple-500 transition-colors text-center font-['Orbitron']"
                    />
                    <div className="text-[9px] mt-1 text-center font-bold opacity-30">HOURS</div>
                  </div>
                  <div className="text-2xl font-bold opacity-20">:</div>
                  <div className="flex-1">
                    <input 
                      type="number" 
                      name="lastInMins" 
                      placeholder="00" 
                      value={inputs.lastInMins} 
                      onChange={handleInputChange}
                      className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-3 py-3 text-2xl font-bold text-white outline-none focus:border-purple-500 transition-colors text-center font-['Orbitron']"
                    />
                    <div className="text-[9px] mt-1 text-center font-bold opacity-30">MINUTES</div>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={handleCalculate}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black py-5 uppercase tracking-[0.3em] rounded-md transform active:scale-[0.98] transition-all shadow-[0_0_25px_rgba(6,182,212,0.4)] text-sm font-['Orbitron']"
            >
              Initialize Sync
            </button>
          </div>
        </div>

        {/* Bottom Result Segment */}
        <div className="h-32 md:h-40 border-t border-cyan-500/20 pt-4 md:pt-6 relative">
          {!result?.isValid ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-cyan-500/20 animate-pulse">
              <div className="flex items-center gap-4">
                  <div className="w-12 h-[1px] bg-cyan-500/40"></div>
                  <div className="text-xs font-bold tracking-[0.4em] uppercase italic">Standby Mode</div>
                  <div className="w-12 h-[1px] bg-cyan-500/40"></div>
              </div>
              <div className="text-[9px] font-medium tracking-[0.2em] uppercase">Awaiting mission parameters for calculation...</div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row items-center justify-between h-full bg-cyan-500/[0.03] p-6 rounded-2xl border border-cyan-500/10 animate-[fadeIn_0.5s_ease-out] relative group">
              <div className="absolute top-0 left-4 -translate-y-1/2 bg-[#050505] px-3 text-[10px] font-black tracking-widest text-cyan-400">EXTRACTION_COORDINATES</div>
              
              <div className="flex items-center gap-8">
                <div className="hidden lg:block border-r border-cyan-500/10 pr-8">
                    <div className="text-[9px] font-black opacity-40 mb-1 uppercase tracking-widest">Efficiency Status</div>
                    <div className="text-xs font-black px-3 py-1 bg-cyan-500 text-black rounded-sm skew-x-[-12deg]">OPTIMAL</div>
                </div>
                <div className="text-6xl md:text-8xl font-black font-['Orbitron'] text-white leading-none drop-shadow-[0_0_20px_rgba(6,182,212,0.4)] select-all">
                  {result.formatted}
                </div>
              </div>
              
              <div className="text-center md:text-right mt-4 md:mt-0">
                <div className="text-[11px] font-black tracking-[0.2em] mb-1 text-cyan-400 flex items-center justify-center md:justify-end gap-2">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-ping"></div>
                    TARGET ACQUIRED
                </div>
                <div className={`text-sm md:text-lg font-black uppercase italic ${progress >= 100 ? 'text-green-500' : 'text-white'}`}>
                  {progress >= 100 ? 'Extraction Authorized' : 'Protocol Sustained'}
                </div>
                <div className="text-[9px] opacity-40 mt-1 font-bold">LINK_STRENGTH: 0.999 // PKT_DROP: 0%</div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Background Decor Layer */}
      <div className="fixed inset-0 pointer-events-none opacity-20 pointer-events-none">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-cyan-500/10"></div>
          <div className="absolute left-1/2 top-0 h-full w-[1px] bg-cyan-500/10"></div>
      </div>

      {/* Floating Meta Stats */}
      <div className="fixed bottom-3 left-6 text-[10px] opacity-30 font-black pointer-events-none uppercase tracking-widest">
        Buffer: {inputs.completedHrs || '00'}.{inputs.completedMins || '00'} // Ref: {inputs.lastInHrs || '00'}.{inputs.lastInMins || '00'}
      </div>
      <div className="fixed bottom-3 right-6 text-[10px] opacity-30 font-black pointer-events-none uppercase tracking-[0.3em]">
        KEKA_FREEDOM_HUD v5.0.1
      </div>
      
    </div>
  );
};

export default App;
