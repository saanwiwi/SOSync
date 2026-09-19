import React, { useEffect, useRef, useState } from 'react';
import {
  useScroll,
  useTransform,
  motion,
} from 'motion/react';

export function Timeline({ data = [] }) {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 15%', 'end 75%'],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full font-sans md:px-10 border-t border-emerald-500/20 relative z-20 bg-[#020817]"
      ref={containerRef}
    >
      {/* Section Header */}
      <div className="max-w-7xl mx-auto py-16 px-4 md:px-8 lg:px-10">
        <div className="inline-block font-mono text-[10px] font-bold tracking-widest uppercase bg-yellow-400 text-slate-950 px-3 py-1 rounded mb-4 shadow-md">
          MISSION TELEMETRY TIMELINE
        </div>
        <h2 className="text-3xl md:text-5xl mb-4 text-white font-black tracking-tight">
          How SOSync saves lives in seconds
        </h2>
        <p className="text-emerald-300/80 text-sm md:text-base max-w-xl font-medium leading-relaxed">
          From micro-tremor sensor ingest to optimal last-mile evacuation paths — experience our autonomous response pipeline in real time.
        </p>
      </div>

      {/* Timeline Items */}
      <div ref={ref} className="relative max-w-7xl mx-auto pb-24">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 md:pt-28 md:gap-10"
          >
            {/* Sticky Title Column */}
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-36 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-[#020817] border border-emerald-500/40 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <div className="h-4 w-4 rounded-full bg-yellow-400 animate-pulse" />
              </div>
              <h3 className="hidden md:block text-xl md:pl-20 md:text-4xl font-black text-emerald-400 font-mono tracking-tight">
                {item.title}
              </h3>
            </div>

            {/* Content Column */}
            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3 className="md:hidden block text-xl mb-4 text-left font-black text-emerald-400 font-mono">
                {item.title}
              </h3>
              {item.content}
            </div>
          </div>
        ))}

        {/* Animated Progress Line */}
        <div
          style={{ height: height + 'px' }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px]"
        >
          {/* Background track */}
          <div className="absolute inset-0 w-full bg-gradient-to-b from-transparent via-[#064e3b]/60 to-transparent" />
          
          {/* Animated fill */}
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-yellow-400 via-emerald-400 to-transparent from-[0%] via-[20%] rounded-full shadow-[0_0_12px_rgba(250,204,21,0.8)]"
          />
        </div>
      </div>
    </div>
  );
}

const defaultTimelineData = [
  {
    title: "01. SEISMIC RADAR",
    content: (
      <div className="space-y-4">
        <div className="p-6 md:p-8 rounded-2xl bg-[#022c22]/90 border border-emerald-500/30 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <span className="text-xs font-mono font-bold text-yellow-400 tracking-widest uppercase">P-WAVE EARLY WARNING</span>
            <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-[#064e3b] border border-emerald-500/40 text-emerald-200">
              NETWORK LATENCY: 380MS
            </span>
          </div>
          <h4 className="text-xl md:text-2xl font-bold text-white mb-2">Sub-Second Epicenter Triangulation</h4>
          <p className="text-sm text-emerald-100/70 leading-relaxed mb-6">
            Autonomous ingestion of Himalayan seismic station feeds across Bagmati Province. Micro-tremor filtering detects primary P-waves up to 45 seconds prior to violent surface shear waves.
          </p>
          <div className="grid grid-cols-3 gap-3 font-mono text-center">
            <div className="p-3 rounded-xl bg-[#064e3b]/70 border border-emerald-500/30">
              <div className="text-[10px] text-emerald-300 uppercase font-semibold">PEAK MAGNITUDE</div>
              <div className="text-xl font-black text-red-400">7.8 Mw</div>
            </div>
            <div className="p-3 rounded-xl bg-[#064e3b]/70 border border-emerald-500/30">
              <div className="text-[10px] text-emerald-300 uppercase font-semibold">STATION NODES</div>
              <div className="text-xl font-black text-emerald-300">142 LIVE</div>
            </div>
            <div className="p-3 rounded-xl bg-[#064e3b]/70 border border-emerald-500/30">
              <div className="text-[10px] text-emerald-300 uppercase font-semibold">COVERAGE RADIUS</div>
              <div className="text-xl font-black text-yellow-400">65 KM</div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "02. A* ROUTING",
    content: (
      <div className="space-y-4">
        <div className="p-6 md:p-8 rounded-2xl bg-[#022c22]/90 border border-emerald-500/30 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <span className="text-xs font-mono font-bold text-yellow-400 tracking-widest uppercase">DYNAMIC EVACUATION</span>
            <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-[#064e3b] border border-emerald-500/40 text-emerald-200">
              SOLVE TIME: 18MS
            </span>
          </div>
          <h4 className="text-xl md:text-2xl font-bold text-white mb-2">Obstacle & Rubble Evasion Engine</h4>
          <p className="text-sm text-emerald-100/70 leading-relaxed mb-6">
            Our custom A* pathfinder dynamically factors in collapsed masonry, severed bridges, and road elevation slopes to guide field ambulances and civilians along the safest traversable routes.
          </p>
          <div className="grid grid-cols-3 gap-3 font-mono text-center">
            <div className="p-3 rounded-xl bg-[#064e3b]/70 border border-emerald-500/30">
              <div className="text-[10px] text-emerald-300 uppercase font-semibold">TRANSIT DELAY</div>
              <div className="text-xl font-black text-emerald-400">-42 MIN</div>
            </div>
            <div className="p-3 rounded-xl bg-[#064e3b]/70 border border-emerald-500/30">
              <div className="text-[10px] text-emerald-300 uppercase font-semibold">RUBBLE BYPASS</div>
              <div className="text-xl font-black text-red-400">31 BLOCKS</div>
            </div>
            <div className="p-3 rounded-xl bg-[#064e3b]/70 border border-emerald-500/30">
              <div className="text-[10px] text-emerald-300 uppercase font-semibold">DATA STRUCTURE</div>
              <div className="text-xl font-black text-yellow-400">MAX-HEAP</div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "03. FLOOD MAPPING",
    content: (
      <div className="space-y-4">
        <div className="p-6 md:p-8 rounded-2xl bg-[#022c22]/90 border border-emerald-500/30 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <span className="text-xs font-mono font-bold text-yellow-400 tracking-widest uppercase">HYDROLOGIC TELEMETRY</span>
            <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-[#064e3b] border border-emerald-500/40 text-emerald-200">
              BAGMATI SURGE: +1.2M
            </span>
          </div>
          <h4 className="text-xl md:text-2xl font-bold text-white mb-2">Real-Time Inundation Overlay</h4>
          <p className="text-sm text-emerald-100/70 leading-relaxed mb-6">
            Ultrasonic river sensors cross-reference soil saturation models to pinpoint imminent flood surges along the Bagmati basin, projecting exclusion zones instantly onto the tactical map.
          </p>
          <div className="grid grid-cols-3 gap-3 font-mono text-center">
            <div className="p-3 rounded-xl bg-[#064e3b]/70 border border-emerald-500/30">
              <div className="text-[10px] text-emerald-300 uppercase font-semibold">CREST HEIGHT</div>
              <div className="text-xl font-black text-yellow-400">+1.2M</div>
            </div>
            <div className="p-3 rounded-xl bg-[#064e3b]/70 border border-emerald-500/30">
              <div className="text-[10px] text-emerald-300 uppercase font-semibold">THREAT LEVEL</div>
              <div className="text-xl font-black text-red-400">HIGH</div>
            </div>
            <div className="p-3 rounded-xl bg-[#064e3b]/70 border border-emerald-500/30">
              <div className="text-[10px] text-emerald-300 uppercase font-semibold">SAFE HAVENS</div>
              <div className="text-xl font-black text-emerald-400">18 VERIFIED</div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "04. COMMAND SYNC",
    content: (
      <div className="space-y-4">
        <div className="p-6 md:p-8 rounded-2xl bg-[#022c22]/90 border border-emerald-500/30 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <span className="text-xs font-mono font-bold text-yellow-400 tracking-widest uppercase">TACTICAL DISPATCH</span>
            <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-[#064e3b] border border-emerald-500/40 text-emerald-200">
              SECURE AES-256
            </span>
          </div>
          <h4 className="text-xl md:text-2xl font-bold text-white mb-2">Unified First Responder Terminal</h4>
          <p className="text-sm text-emerald-100/70 leading-relaxed mb-6">
            Paramedic and search-and-rescue teams receive synchronized triage queues, real-time hospital bed counters, and encrypted field dispatches on an offline-first resilient client.
          </p>
          <div className="grid grid-cols-3 gap-3 font-mono text-center">
            <div className="p-3 rounded-xl bg-[#064e3b]/70 border border-emerald-500/30">
              <div className="text-[10px] text-emerald-300 uppercase font-semibold">ACTIVE SQUADS</div>
              <div className="text-xl font-black text-emerald-400">8 / 12 TEAMS</div>
            </div>
            <div className="p-3 rounded-xl bg-[#064e3b]/70 border border-emerald-500/30">
              <div className="text-[10px] text-emerald-300 uppercase font-semibold">TRIAGE HEAP</div>
              <div className="text-xl font-black text-yellow-400">PRIORITY 1</div>
            </div>
            <div className="p-3 rounded-xl bg-[#064e3b]/70 border border-emerald-500/30">
              <div className="text-[10px] text-emerald-300 uppercase font-semibold">EST. LIVES SAVED</div>
              <div className="text-xl font-black text-emerald-300">1,490+</div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
];

export default function TimelineSection({ data = defaultTimelineData }) {
  return <Timeline data={data} />;
}
