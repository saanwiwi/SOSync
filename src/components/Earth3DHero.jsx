import React, { Suspense, lazy } from 'react';
import GlobeDemo from './ui/globe-demo';

export default function Earth3DHero() {
  return (
    <div className="w-full h-[420px] lg:h-[500px] relative flex items-center justify-center">
      {/* Tactical Radar Ring Accents */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[380px] h-[380px] rounded-full border border-emerald-500/20 animate-pulse" />
        <div className="absolute w-[440px] h-[440px] rounded-full border border-sky-500/10" />
      </div>

      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center gap-2 font-mono text-xs text-emerald-400">
            <span className="h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
            <span>ESTABLISHING SATELLITE 3D TELEMETRY...</span>
          </div>
        }
      >
        <GlobeDemo />
      </Suspense>

      {/* Center Beacon Label */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[10px] text-emerald-300/80 bg-[#022c22]/90 border border-emerald-500/40 px-3 py-1 rounded-full backdrop-blur-md shadow-lg pointer-events-none flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse" />
        <span>EPICENTER: KATHMANDU BASIN [27.7172° N, 85.3240° E]</span>
      </div>
    </div>
  );
}