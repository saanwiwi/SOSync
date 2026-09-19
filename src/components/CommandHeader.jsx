import React from 'react';

export default function CommandHeader() {
  return (
    <header className="grid grid-cols-4 gap-4 font-mono animate-fade-in w-full">
       {/* Active Anomalies Card */}
       <div className="p-5 rounded-2xl glass-panel animate-pulse-glow bg-slate-900/70 backdrop-blur-xl border border-slate-800/80">
          <div className="text-[10px] text-slate-400 font-bold tracking-widest mb-1">ACTIVE ANOMALIES</div>
          <div className="text-3xl font-extrabold text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.4)]">24</div>
       </div>
       
       {/* Rescue Units Card */}
       <div className="p-5 rounded-2xl glass-panel bg-slate-900/70 backdrop-blur-xl border border-slate-800/80">
          <div className="text-[10px] text-slate-400 font-bold tracking-widest mb-1">RESCUE UNITS</div>
          <div className="text-3xl font-extrabold text-emerald-400">8<span className="text-sm font-normal text-slate-500">/12</span></div>
       </div>
       
       {/* Bagmati H2O Level Card */}
       <div className="p-5 rounded-2xl glass-panel bg-slate-900/70 backdrop-blur-xl border border-slate-800/80">
          <div className="text-[10px] text-slate-400 font-bold tracking-widest mb-1">BAGMATI H2O LEVEL</div>
          <div className="text-3xl font-extrabold text-yellow-400">+1.2M</div>
       </div>
       
       {/* Override Button Card */}
       <div className="p-5 rounded-2xl glass-panel border-red-500/30 bg-slate-900/70 backdrop-blur-xl flex items-center justify-center">
          <button 
            onClick={() => alert('Emergency Override Initiated')}
            className="w-full h-full py-2 bg-red-950/60 hover:bg-red-900 text-red-400 border border-red-700/60 rounded-xl text-xs font-bold tracking-wider transition-all duration-300 cursor-pointer shadow-lg active:scale-95"
          >
            INITIATE OVERRIDE
          </button>
       </div>
    </header>
  );
}