import React, { useState } from 'react';
import LiveMap from './components/LiveMap';
import WaterBackground from './components/WaterBackground';
import Earth3DHero from './components/Earth3DHero';
import RoutingPanel from './components/RoutingPanel';
import EmergencyBanner from './components/ui/StickyBanner';
import CanvasRevealEffectDemo from './components/ui/CanvasRevealEffectDemo';
import BackgroundBoxesDemo from './components/ui/background-boxes';
import SVGMaskEffect from './components/ui/SVGMaskEffect';
import TimelineSection from './components/ui/TimelineSection';

// --- BACKEND IMPORTS ---
import { analyzeDistressCall } from '../spatial/resourceSearch.js';
import { attachLocationData } from '../spatial/geohash.js';
import { PriorityQueue } from '../spatial/btree.js';

// Initialize the max-heap outside the component so the data persists across renders
const emergencyQueue = new PriorityQueue();

export default function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [routePath, setRoutePath] = useState(null);
  
  // --- TRIAGE STATE ---
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [alerts, setAlerts] = useState([]); 

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // --- TRIAGE FUNCTION ---
  const handleSimulateCall = (e) => {
    if (e) e.preventDefault();
    if (!transcript.trim()) return;

    // 1. Analyze text for risk score
    const analyzedData = analyzeDistressCall(transcript);

    // 2. Mock GPS coordinates for Kathmandu region and generate Geohash
    const mockLat = 27.7172 + (Math.random() * 0.05 - 0.025);
    const mockLon = 85.3240 + (Math.random() * 0.05 - 0.025);
    const finalEmergencyData = attachLocationData(analyzedData, mockLat, mockLon);

    // 3. Push to Max-Heap Priority Queue
    emergencyQueue.insert(finalEmergencyData);

    // 4. Update the UI state with sorted array
    setAlerts(emergencyQueue.getQueueForUI());
    setTranscript(""); // Clear input
  };

  // --- VOICE AI LISTENING FUNCTION ---
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support the Web Speech API. Please use Google Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event) => {
      const currentText = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      setTranscript(currentText);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  if (currentView === 'landing') {
    return (
      <WaterBackground>
        {/* Sticky Urgent Relief Banner */}
        <EmergencyBanner />

        <div className="min-h-screen flex flex-col justify-between selection:bg-emerald-400 selection:text-slate-950 bg-[#020817]">
          
          {/* Top Navbar */}
          <header className="max-w-7xl mx-auto w-full px-6 md:px-8 py-6 flex justify-between items-center relative z-20">
            <div className="flex items-center gap-3">
              <div className="font-mono tracking-tighter font-black text-2xl text-white flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-yellow-400 animate-pulse" />
                SOSYNC
              </div>
            </div>

            <nav className="hidden lg:flex items-center gap-6 font-mono text-xs font-bold tracking-wider text-emerald-200">
              <button onClick={() => scrollToSection('leads-section')} className="hover:text-yellow-400 transition-colors uppercase cursor-pointer">CORE LEADS</button>
              <button onClick={() => scrollToSection('matrix-section')} className="hover:text-yellow-400 transition-colors uppercase cursor-pointer">SENSOR MATRIX</button>
              <button onClick={() => scrollToSection('reveal-section')} className="hover:text-yellow-400 transition-colors uppercase cursor-pointer">OPTICAL RADAR</button>
              <button onClick={() => scrollToSection('timeline-section')} className="hover:text-yellow-400 transition-colors uppercase cursor-pointer">TIMELINE</button>
            </nav>

            <button 
              onClick={() => setCurrentView('command-center')}
              className="px-5 py-2.5 rounded-full border-2 border-yellow-400 text-xs font-mono font-bold tracking-widest text-yellow-400 hover:bg-yellow-400 hover:text-slate-950 transition-all cursor-pointer shadow-lg shadow-yellow-400/10 active:scale-95"
            >
              LAUNCH COMMAND →
            </button>
          </header>

          {/* Hero Section */}
          <main className="max-w-7xl mx-auto w-full px-6 md:px-8 py-10 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-block font-mono text-xs font-bold tracking-widest uppercase bg-yellow-400 text-slate-950 px-3 py-1 rounded shadow-md">
                DISASTER TRIAGE & EMERGENCY PLATFORM // KATHMANDU
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight leading-[0.95] text-white">
                Rescuing <span className="italic font-serif font-normal text-emerald-400">lives</span> when earth moves.
              </h1>
              
              <p className="text-emerald-100/90 text-base lg:text-lg font-medium max-w-xl leading-relaxed">
                SOSync delivers real-time geospatial telemetry and automated max-heap priority routing for high-risk disaster zones across the Kathmandu Basin.
              </p>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button 
                  onClick={() => setCurrentView('command-center')}
                  className="px-8 py-4 rounded-xl bg-yellow-400 text-slate-950 font-mono font-bold text-xs tracking-widest hover:bg-yellow-500 transition-all shadow-xl shadow-yellow-400/20 cursor-pointer active:scale-95"
                >
                  ▶ INITIATE COMMAND CENTER
                </button>
                <button 
                  onClick={() => scrollToSection('leads-section')}
                  className="px-6 py-4 rounded-xl bg-[#022c22] border border-emerald-500/40 text-emerald-300 font-mono font-semibold text-xs tracking-wider hover:bg-[#064e3b] transition-all cursor-pointer"
                >
                  EXPLORE ARCHITECTURE ↓
                </button>
              </div>
            </div>

            {/* Right Side: 3D Globe */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <Earth3DHero />
            </div>
          </main>

          {/* Feature Sections */}
          <div id="leads-section"><CanvasRevealEffectDemo onOpenCommandCenter={() => setCurrentView('command-center')} /></div>
          <div id="matrix-section"><BackgroundBoxesDemo /></div>
          <div id="reveal-section"><SVGMaskEffect /></div>
          <div id="timeline-section"><TimelineSection /></div>

          {/* Footer */}
          <footer className="max-w-7xl mx-auto w-full px-6 md:px-8 py-8 border-t border-emerald-500/20 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono font-bold text-emerald-300/80 backdrop-blur-md bg-[#022c22]/90 relative z-20 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>VINHACK 2026 // KATHMANDU OPERATIONAL PROTOCOL</span>
            </div>
            <span>THE GOLD STANDARD IN EMERGENCY RESPONSE</span>
          </footer>
        </div>
      </WaterBackground>
    );
  }

  // --- COMMAND CENTER VIEW ---
  return (
    <WaterBackground>
      <div className="min-h-screen flex flex-col md:flex-row bg-[#020817]">
        
        {/* Sidebar */}
        <aside className="w-full md:w-88 border-b md:border-b-0 md:border-r border-emerald-500/20 p-6 flex flex-col justify-between bg-[#022c22]/95 backdrop-blur-xl relative z-20 shadow-2xl">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-mono tracking-wider font-extrabold text-white text-base">SOSYNC<span className="text-yellow-400">.CC</span></span>
                <div className="text-[10px] font-mono text-emerald-400/80">NEPAL_OP // v1.0</div>
              </div>
              <button 
                onClick={() => setCurrentView('landing')} 
                className="px-3 py-1.5 rounded bg-[#064e3b] border border-emerald-500/50 text-[11px] font-mono font-bold text-emerald-200 hover:text-white hover:border-yellow-400 transition-all cursor-pointer"
              >
                ← BACK TO HOME
              </button>
            </div>
            
            <nav className="space-y-1.5 text-xs font-mono">
              <div className="px-4 py-3 rounded-xl bg-yellow-400 text-slate-950 font-extrabold cursor-pointer flex items-center justify-between shadow-md">
                <span>01. SEISMIC MAP & A*</span>
                <span className="h-2 w-2 rounded-full bg-slate-950 animate-pulse" />
              </div>
              <div className="px-4 py-3 rounded-xl text-emerald-300 hover:text-white hover:bg-[#064e3b] cursor-pointer transition-colors font-semibold">
                02. SURFACE ROUTING
              </div>
              <div className="px-4 py-3 rounded-xl text-emerald-300 hover:text-white hover:bg-[#064e3b] cursor-pointer transition-colors font-semibold">
                03. FLEET TELEMETRY
              </div>
            </nav>

            {/* Embedded A* Routing Engine */}
            <div className="pt-1">
              <RoutingPanel onRouteCalculated={(path) => setRoutePath(path)} />
            </div>
          </div>
          
          <div className="p-4 rounded-xl bg-[#064e3b]/60 border border-emerald-500/30 text-[10px] font-mono space-y-1 mt-6 md:mt-0">
            <div className="text-emerald-300 font-bold flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              SYSTEM ONLINE // AES-256
            </div>
            <div className="text-emerald-400/70">BAGMATI PROVINCIAL NODE</div>
          </div>
        </aside>

        {/* Main Stage */}
        <main className="flex-1 p-4 md:p-8 flex flex-col gap-6 relative z-10 overflow-hidden">
          
          {/* Telemetry Header Cards */}
          <header className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
             <div className="p-5 rounded-2xl bg-[#022c22]/90 border border-emerald-500/30 backdrop-blur-xl shadow-xl">
                <div className="text-[10px] text-emerald-400/80 tracking-widest mb-1 font-bold">ACTIVE ANOMALIES</div>
                <div className="text-3xl font-extrabold text-red-400">{alerts.length}</div>
             </div>
             
             <div className="p-5 rounded-2xl bg-[#022c22]/90 border border-emerald-500/30 backdrop-blur-xl shadow-xl">
                <div className="text-[10px] text-emerald-400/80 tracking-widest mb-1 font-bold">RESCUE UNITS</div>
                <div className="text-3xl font-extrabold text-emerald-300">8<span className="text-sm font-normal text-emerald-600">/12</span></div>
             </div>
             
             <div className="p-5 rounded-2xl bg-[#022c22]/90 border border-emerald-500/30 backdrop-blur-xl shadow-xl">
                <div className="text-[10px] text-emerald-400/80 tracking-widest mb-1 font-bold">BAGMATI H2O LEVEL</div>
                <div className="text-3xl font-extrabold text-yellow-400">+1.2M</div>
             </div>
             
             <div className="p-5 rounded-2xl bg-[#022c22]/90 border border-red-900/40 backdrop-blur-xl shadow-xl flex items-center justify-center">
                <button 
                  onClick={() => alert("TACTICAL OVERRIDE: Emergency broadcasts initiated to all field squads.")}
                  className="w-full h-full py-2 bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 rounded-xl text-xs font-bold tracking-wider transition-all cursor-pointer shadow-[0_0_20px_rgba(153,27,27,0.4)] active:scale-95"
                >
                  INITIATE OVERRIDE
                </button>
             </div>
          </header>

          {/* LOWER SECTION: Map & Triage Board Grid */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[500px]">
            
            {/* Map Container (Takes up 2/3 of the screen) */}
            <div className="lg:col-span-2 rounded-2xl border border-emerald-500/30 bg-[#022c22]/90 backdrop-blur-xl overflow-hidden flex flex-col shadow-2xl">
              <div className="p-3.5 px-6 bg-[#011a14] border-b border-emerald-500/20 flex flex-wrap justify-between items-center text-xs font-mono gap-2">
                <span className="text-emerald-300 flex items-center gap-2 font-semibold">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> DIGITAL TWIN & FLOOD RADAR
                </span>
                <span className="text-emerald-400/70">LAT: 27.7172 // LNG: 85.3240</span>
              </div>
              <div className="flex-1 relative min-h-[420px]">
                <LiveMap routePath={routePath} showFlood={true} />
              </div>
            </div>

            {/* Max-Heap Triage Engine (Takes up 1/3 of the screen) */}
            <div className="lg:col-span-1 flex flex-col gap-6 h-[500px]">
              
              {/* LIVE VOICE AI TELEMETRY */}
              <div className="p-5 rounded-2xl bg-[#022c22]/90 border border-emerald-500/30 backdrop-blur-xl shadow-xl flex flex-col gap-3">
                <div className="text-xs font-mono text-emerald-400/80 font-bold flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${isListening ? 'bg-red-500 animate-ping' : 'bg-yellow-400'}`} />
                  LIVE VOICE AI TELEMETRY
                </div>

                <div className="flex flex-col gap-2">
                  <div className={`w-full h-24 bg-[#011a14] border ${isListening ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-emerald-500/30'} rounded-xl p-3 text-sm text-emerald-100 transition-all font-mono overflow-y-auto relative`}>
                    {transcript || (
                      <span className="text-emerald-700">
                        {isListening ? "Listening for distress signal..." : "Awaiting vocal input..."}
                      </span>
                    )}
                    
                    {isListening && (
                      <span className="absolute bottom-2 right-2 flex gap-1">
                         <span className="h-1.5 w-1.5 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}/>
                         <span className="h-1.5 w-1.5 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}/>
                         <span className="h-1.5 w-1.5 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}/>
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button 
                      type="button"
                      onClick={startListening}
                      className={`flex-1 font-bold font-mono text-xs py-2.5 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 ${
                        isListening 
                          ? 'bg-red-950/50 text-red-400 border border-red-500/50 cursor-not-allowed' 
                          : 'bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-500/50'
                      }`}
                    >
                      {isListening ? '🔴 INTERCEPTING...' : '🎤 INITIATE MIC'}
                    </button>
                    
                    <button 
                      onClick={handleSimulateCall}
                      disabled={!transcript.trim() || isListening}
                      className={`flex-1 font-bold font-mono text-xs py-2.5 rounded-xl transition-all shadow-lg active:scale-95 ${
                        !transcript.trim() || isListening 
                          ? 'bg-[#011a14] border border-emerald-500/20 text-emerald-700 cursor-not-allowed' 
                          : 'bg-yellow-400 hover:bg-yellow-500 text-slate-950 shadow-yellow-400/10'
                      }`}
                    >
                      PROCESS DATA
                    </button>
                  </div>
                </div>
              </div>

              {/* Live Triage Queue */}
              <div className="flex-1 rounded-2xl bg-[#022c22]/90 border border-emerald-500/30 backdrop-blur-xl shadow-xl overflow-hidden flex flex-col">
                <div className="p-3.5 px-5 bg-[#011a14] border-b border-emerald-500/20 flex justify-between items-center text-xs font-mono">
                  <span className="text-red-400 font-bold flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" /> 
                    MAX-HEAP PRIORITY QUEUE
                  </span>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                  {alerts.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-center text-xs font-mono text-emerald-600/50 border border-dashed border-emerald-800/30 rounded-xl p-6">
                      AWAITING INBOUND DISTRESS SIGNALS...
                    </div>
                  ) : (
                    alerts.map((alert, index) => (
                      <div 
                        key={index} 
                        className={`p-4 rounded-xl border font-mono shadow-md ${
                          alert.riskScore >= 10 
                            ? "bg-red-950/40 border-red-500/50" 
                            : alert.riskScore >= 5 
                            ? "bg-yellow-950/40 border-yellow-500/50" 
                            : "bg-[#064e3b]/40 border-emerald-500/30"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex gap-3 items-center">
                            <span className={`text-2xl font-black ${alert.riskScore >= 10 ? 'text-red-400' : alert.riskScore >= 5 ? 'text-yellow-400' : 'text-emerald-400'}`}>
                              {alert.riskScore}
                            </span>
                            <div>
                              <h3 className="font-bold text-[10px] tracking-wider text-emerald-100">
                                GEOHASH: <span className="text-yellow-400">{alert.geohash}</span>
                              </h3>
                              <p className="text-[9px] text-emerald-400/60">{new Date(alert.timestamp).toLocaleTimeString()}</p>
                            </div>
                          </div>
                          <a 
                            href={alert.gridURL} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-[9px] font-bold tracking-widest bg-[#011a14] border border-emerald-500/30 hover:border-yellow-400 text-emerald-300 px-2 py-1 rounded transition-colors"
                          >
                            GRID →
                          </a>
                        </div>
                        
                        <p className="text-[11px] text-emerald-50 italic mb-3 opacity-90">"{alert.originalText}"</p>
                        
                        <div className="flex flex-wrap gap-1.5">
                          {alert.needsCategory.map(need => (
                            <span key={need} className="text-[9px] uppercase font-bold tracking-wider bg-[#011a14] border border-emerald-500/30 text-emerald-300 px-1.5 py-0.5 rounded">
                              {need.replace('_', ' ')}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </WaterBackground>
  );
}