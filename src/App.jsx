import React, { useState } from 'react';
import LiveMap from './components/LiveMap';
import WaterBackground from './components/WaterBackground';
import Earth3DHero from './components/Earth3DHero';
import RoutingPanel from './components/RoutingPanel';

export default function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [routePath, setRoutePath] = useState(null);

  if (currentView === 'landing') {
    return (
      <WaterBackground>
        <div className="min-h-screen flex flex-col justify-between selection:bg-emerald-400 selection:text-black">
          
          {/* Top Navbar */}
          <header className="max-w-7xl mx-auto w-full px-8 py-8 flex justify-between items-center relative z-10">
            <div className="flex items-center gap-3">
              <span className="font-mono tracking-tighter font-black text-2xl text-white">SOSYNC</span>
            </div>

            <nav className="hidden md:flex items-center gap-8 font-mono text-xs font-bold tracking-wider text-emerald-100">
              <span className="cursor-pointer hover:text-yellow-400 transition-colors">WORKS</span>
              <span className="cursor-pointer hover:text-yellow-400 transition-colors">TELEMETRY</span>
              <span className="cursor-pointer hover:text-yellow-400 transition-colors">SYSTEMS</span>
            </nav>

            <button 
              onClick={() => setCurrentView('command-center')}
              className="px-6 py-3 rounded-full border-2 border-yellow-400 text-xs font-mono font-bold tracking-widest text-yellow-400 hover:bg-yellow-400 hover:text-slate-950 transition-all cursor-pointer shadow-md"
            >
              LAUNCH COMMAND →
            </button>
          </header>

          {/* Hero Section */}
          <main className="max-w-7xl mx-auto w-full px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-block font-mono text-xs font-bold tracking-widest uppercase bg-yellow-400 text-slate-950 px-3 py-1 rounded">
                DISASTER TRIAGE & EMERGENCY PLATFORM
              </div>
              
              <h1 className="text-6xl lg:text-8xl font-black tracking-tight leading-[0.95] text-white">
                Rescuing <span className="italic font-serif font-normal text-emerald-400">lives</span> when earth moves.
              </h1>
              
              <p className="text-emerald-100/80 text-base lg:text-lg font-medium max-w-xl leading-relaxed">
                SOSync delivers real-time geospatial telemetry and automated max-heap priority routing for high-risk disaster zones like the Kathmandu Basin.
              </p>

              <div className="pt-4 flex items-center gap-4">
                <button 
                  onClick={() => setCurrentView('command-center')}
                  className="px-8 py-4 rounded-xl bg-yellow-400 text-slate-950 font-mono font-bold text-xs tracking-widest hover:bg-yellow-500 transition-all shadow-xl cursor-pointer"
                >
                  ▶ INITIATE COMMAND CENTER
                </button>
              </div>
            </div>

            {/* Right Side: 3D Interactive Tilting Hardware Module */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <Earth3DHero />
            </div>
          </main>

          {/* Footer */}
          <footer className="max-w-7xl mx-auto w-full px-8 py-8 border-t border-emerald-500/20 flex justify-between items-center text-xs font-mono font-bold text-emerald-400/60 backdrop-blur-md bg-[#021a12]/80">
            <span>VINHACK 2026 // KATHMANDU OP</span>
            <span>THE GOLD STANDARD IN EMERGENCY RESPONSE</span>
          </footer>
        </div>
      </WaterBackground>
    );
  }

  // --- COMMAND CENTER VIEW ---
  return (
    <WaterBackground>
      <div className="min-h-screen flex">
        
        {/* Sidebar */}
        <aside className="w-80 border-r border-emerald-500/20 p-6 flex flex-col justify-between bg-[#021a12]/90 backdrop-blur-xl">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-mono tracking-wider font-extrabold text-white text-base">SOSYNC<span className="text-yellow-400">.CC</span></span>
                <div className="text-[10px] font-mono text-emerald-400/70">NEPAL_OP // v1.0</div>
              </div>
              <button 
                onClick={() => setCurrentView('landing')} 
                className="px-2.5 py-1 rounded bg-emerald-950 border border-emerald-700/50 text-[10px] font-mono font-bold text-emerald-400 hover:text-white transition-colors cursor-pointer"
              >
                ← HOME
              </button>
            </div>
            
            <nav className="space-y-1.5 text-xs font-mono">
              <div className="px-4 py-3 rounded-xl bg-yellow-400 text-slate-950 font-extrabold cursor-pointer flex items-center justify-between shadow-md">
                <span>01. SEISMIC MAP & A*</span>
                <span className="h-2 w-2 rounded-full bg-slate-950 animate-pulse"></span>
              </div>
              <div className="px-4 py-3 rounded-xl text-emerald-400/60 hover:text-emerald-300 hover:bg-emerald-950/40 cursor-pointer transition-colors font-semibold">
                02. SURFACE ROUTING
              </div>
              <div className="px-4 py-3 rounded-xl text-emerald-400/60 hover:text-emerald-300 hover:bg-emerald-950/40 cursor-pointer transition-colors font-semibold">
                03. FLEET TELEMETRY
              </div>
            </nav>

            {/* Embedded A* Routing Engine Control Panel */}
            <div className="pt-2">
              <RoutingPanel onRouteCalculated={(path) => setRoutePath(path)} />
            </div>
          </div>
          
          <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/20 text-[10px] font-mono space-y-1">
            <div className="text-emerald-400 font-bold flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              SYSTEM ONLINE
            </div>
            <div className="text-emerald-500/70">ENCRYPTION: AES-256</div>
          </div>
        </aside>

        {/* Main Stage */}
        <main className="flex-1 p-8 flex flex-col gap-6">
          
          {/* Telemetry Header Cards */}
          <header className="grid grid-cols-4 gap-4 font-mono">
             <div className="p-5 rounded-2xl bg-[#032419]/80 border border-emerald-500/20 backdrop-blur-xl shadow-xl">
                <div className="text-[10px] text-emerald-400/70 tracking-widest mb-1 font-bold">ACTIVE ANOMALIES</div>
                <div className="text-3xl font-extrabold text-red-400">24</div>
             </div>
             
             <div className="p-5 rounded-2xl bg-[#032419]/80 border border-emerald-500/20 backdrop-blur-xl shadow-xl">
                <div className="text-[10px] text-emerald-400/70 tracking-widest mb-1 font-bold">RESCUE UNITS</div>
                <div className="text-3xl font-extrabold text-emerald-400">8<span className="text-sm font-normal text-emerald-600">/12</span></div>
             </div>
             
             <div className="p-5 rounded-2xl bg-[#032419]/80 border border-emerald-500/20 backdrop-blur-xl shadow-xl">
                <div className="text-[10px] text-emerald-400/70 tracking-widest mb-1 font-bold">BAGMATI H2O LEVEL</div>
                <div className="text-3xl font-extrabold text-yellow-400">+1.2M</div>
             </div>
             
             <div className="p-5 rounded-2xl bg-[#032419]/80 border border-red-900/40 backdrop-blur-xl shadow-xl flex items-center justify-center">
                <button className="w-full h-full py-2 bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 rounded-xl text-xs font-bold tracking-wider transition-all cursor-pointer shadow-[0_0_20px_rgba(153,27,27,0.4)]">
                  INITIATE OVERRIDE
                </button>
             </div>
          </header>

          {/* Map Container */}
          <div className="flex-1 rounded-2xl border border-emerald-500/30 bg-[#032419]/80 backdrop-blur-xl overflow-hidden flex flex-col shadow-2xl">
             <div className="p-3.5 px-6 bg-[#021a12] border-b border-emerald-500/20 flex justify-between items-center text-xs font-mono">
               <span className="text-emerald-300 flex items-center gap-2 font-semibold">
                 <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span> SEISMIC SATELLITE UPLINK: KATHMANDU BASIN
               </span>
               <span className="text-emerald-400/60">LAT: 27.7172 // LNG: 85.3240</span>
             </div>
             
             <div className="flex-1 relative">
               <LiveMap routePath={routePath} />
             </div>
          </div>
        </main>
        
      </div>
    </WaterBackground>
  );
}