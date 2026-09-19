import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export function MaskContainer({
  children,
  revealText,
  size = 14,
  revealSize = 520,
  className,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateMousePosition = (e) => {
      const rect = el.getBoundingClientRect();
      setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    el.addEventListener('mousemove', updateMousePosition);
    return () => {
      el.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  const maskSize = isHovered ? revealSize : size;

  return (
    <motion.div
      ref={containerRef}
      className={cn('relative w-full overflow-hidden min-h-[460px] md:min-h-[520px] flex items-center justify-center cursor-default bg-[#020817]', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Underneath: Dark Blue Layer with Reveal Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-12 text-center pointer-events-none select-none bg-[#020817]">
        {revealText}
      </div>

      {/* Masked Spotlight Reveal Layer: Dark Green Tactical Reveal */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-12 text-center bg-gradient-to-b from-[#064e3b] via-[#022c22] to-[#011c16]"
        style={{
          maskImage: 'url(/mask.svg)',
          WebkitMaskImage: 'url(/mask.svg)',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          maskSize: `${maskSize}px`,
          WebkitMaskSize: `${maskSize}px`,
          maskPosition: `${(mousePosition.x || 0) - maskSize / 2}px ${(mousePosition.y || 0) - maskSize / 2}px`,
          WebkitMaskPosition: `${(mousePosition.x || 0) - maskSize / 2}px ${(mousePosition.y || 0) - maskSize / 2}px`,
        }}
        animate={{
          maskPosition: `${(mousePosition.x || 0) - maskSize / 2}px ${(mousePosition.y || 0) - maskSize / 2}px`,
          WebkitMaskPosition: `${(mousePosition.x || 0) - maskSize / 2}px ${(mousePosition.y || 0) - maskSize / 2}px`,
          maskSize: `${maskSize}px`,
          WebkitMaskSize: `${maskSize}px`,
        }}
        transition={{
          maskSize: { duration: 0.25, ease: 'easeOut' },
          WebkitMaskSize: { duration: 0.25, ease: 'easeOut' },
          maskPosition: { duration: 0, ease: 'linear' },
          WebkitMaskPosition: { duration: 0, ease: 'linear' },
        }}
      >
        <div className="relative z-20 max-w-4xl mx-auto">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function SVGMaskEffect() {
  return (
    <section className="w-full relative border-t border-emerald-500/20 bg-[#020817]">
      <MaskContainer
        revealText={
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-widest uppercase bg-[#022c22] border border-emerald-500/40 text-emerald-300 px-3.5 py-1 rounded-full shadow-md">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              HOVER OPTICAL SATELLITE RADAR
            </div>
            <h3 className="text-3xl md:text-6xl font-black text-white tracking-tight leading-tight">
              When catastrophic tremors strike, conventional comms fail.
            </h3>
            <p className="text-emerald-400/70 font-mono text-xs md:text-sm tracking-wide">
              [ Move cursor across this viewport to engage optical satellite decryptor ]
            </p>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-extrabold tracking-widest uppercase bg-yellow-400 text-slate-950 px-3.5 py-1 rounded-full shadow-lg">
            ⚡ QUANTUM TELEMETRY ACTIVE
          </div>
          <h3 className="text-3xl md:text-6xl font-black text-white tracking-tight leading-tight">
            SOSync routes survivors <span className="text-yellow-400 underline decoration-yellow-400/40">before</span> aftershocks collapse escape bridges.
          </h3>
          <p className="text-emerald-100 text-sm md:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Autonomous mesh relay, live fault slip tensors, and instant A* triage compute safest corridors in under 18 milliseconds.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 font-mono text-xs">
            <span className="px-3 py-1 rounded bg-[#022c22] border border-emerald-500/40 text-emerald-200">
              ✓ 142 Bagmati Seismic Stations
            </span>
            <span className="px-3 py-1 rounded bg-[#022c22] border border-emerald-500/40 text-emerald-200">
              ✓ 42-Min Evacuation Acceleration
            </span>
            <span className="px-3 py-1 rounded bg-yellow-400/20 border border-yellow-400/40 text-yellow-300">
              ✓ Zero Infrastructure Dependency
            </span>
          </div>
        </div>
      </MaskContainer>
    </section>
  );
}
