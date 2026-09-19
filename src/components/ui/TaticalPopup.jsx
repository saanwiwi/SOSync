import React from 'react';

export default function TacticalPopup({ transcript, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100] bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-[#022c22]/95 border-2 border-emerald-500/50 rounded-xl p-6 max-w-lg w-full shadow-[0_0_40px_rgba(16,185,129,0.2)] font-mono flex flex-col gap-4 relative overflow-hidden">
        
        {/* Animated Scanning Line Effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-400/50 animate-[scan_2s_ease-in-out_infinite]" />

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-emerald-500/30 pb-3">
          <span className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
          <h3 className="text-red-400 font-black tracking-widest text-sm uppercase">
            Voice Telemetry Intercepted
          </h3>
        </div>

        {/* The Raw Voice Input */}
        <div className="bg-[#011a14] border border-emerald-500/20 p-3 rounded-lg">
          <div className="text-[10px] text-emerald-500/70 mb-1 font-bold">RAW AUDIO TRANSCRIPT:</div>
          <div className="text-emerald-100 text-sm italic opacity-90">
            "{transcript || "i'm stuck on the roof and the water levels are rising i think i'm gonna sink"}"
          </div>
        </div>

        {/* The "What is it doing?" Breakdown */}
        <div className="space-y-2 text-xs text-emerald-300 font-semibold bg-[#064e3b]/30 p-4 rounded-lg border border-emerald-500/20">
  <p className="flex justify-between">
    <span>&gt; PARSING NLP RISK TRIGGERS...</span>
    <span className="text-red-400">CRITICAL MATCH</span>
  </p>
  <p className="flex justify-between">
    <span>&gt; EXTRACTING SPATIAL DATA...</span>
    <span className="text-yellow-400">GEOHASH ENCODED</span>
  </p>
  <p className="flex justify-between">
    <span>&gt; IDENTIFYING RESOURCE NEEDS...</span>
    <span className="text-emerald-400">BOAT RESCUE REQUIRED</span>
  </p>
  <p className="pt-2 text-yellow-400 animate-pulse border-t border-emerald-500/20 mt-2">
    &gt; PUSHING TO MAX-HEAP PRIORITY QUEUE...
  </p>
</div>

        {/* Tactical Close Button */}
        <button 
          onClick={onClose}
          className="mt-2 w-full bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-bold tracking-widest py-3 rounded-lg transition-all active:scale-95 text-xs shadow-lg shadow-yellow-400/10"
        >
          ACKNOWLEDGE & ROUTE COMMAND
        </button>
      </div>
    </div>
  );
}