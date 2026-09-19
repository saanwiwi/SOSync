import React, { useState } from "react";
import { CanvasRevealEffect, LeadCard } from "./canvas-reveal-effect";
import { triageEngine, generateMockSOS } from "../../services/TriageEngine";
import { triggerDisasterSimulation, VoiceCommander, depotTree } from "../../services/SpatialEngine";

export default function CanvasRevealEffectDemo({ onOpenCommandCenter }) {
  const [triageStatus, setTriageStatus] = useState("4 CASUALTIES IN HEAP");
  const [spatialStatus, setSpatialStatus] = useState("READY FOR VOICE / TRIGGER");
  const [twinStatus, setTwinStatus] = useState("TERRAIN & FLOOD READY");
  const [voiceActive, setVoiceActive] = useState(false);

  // Digital Twin action
  const handleDigitalTwin = () => {
    setTwinStatus("INSPECTING KATHMANDU BASIN...");
    if (onOpenCommandCenter) onOpenCommandCenter();
  };

  // Triage Engine action: insert an SOS and extract the max
  const handleTriageAction = () => {
    const newSOS = generateMockSOS();
    triageEngine.insertSOS(newSOS);
    const max = triageEngine.peek();
    setTriageStatus(`TOP: ${max.locationName} (Score: ${max.score})`);
    alert(
      `🚨 PRIORITY MAX-HEAP UPDATED:\n• New SOS: ${newSOS.locationName}\n• Extracted Max Priority: ${max.locationName}\n• Urgency Score: ${max.score} (Medical: ${max.medical} × Threat: ${max.threat} / ${max.elapsedMinutes}m)`
    );
  };

  // Spatial Engine action: Trigger 1-click disaster simulation
  const handleDisasterSimulation = () => {
    setSpatialStatus("DISASTER TRIGGERED: BAGMATI FLOODED!");
    const result = triggerDisasterSimulation();
    alert(
      `🌊 1-CLICK DISASTER TRIGGERED:\n• Seismic Event: M7.8 epicenter\n• Inundation: Bagmati River edges flooded (weight = Infinity)\n• A* reroute calculated with bypass!\n• High-priority casualty added: ${result.topCasualty.injury}`
    );
    if (onOpenCommandCenter) onOpenCommandCenter();
  };

  // Voice command test
  const handleVoiceTest = () => {
    const commander = new VoiceCommander((transcript) => {
      setSpatialStatus(`VOICE: "${transcript}"`);
      alert(`🎙️ VOICE COMMAND DETECTED: "${transcript}"\nExecuting command via Spatial Engine...`);
      setVoiceActive(false);
    });

    const started = commander.start();
    if (started) {
      setVoiceActive(true);
      setSpatialStatus("LISTENING... Say 'Deploy 3 units'");
    } else {
      // Fallback if mic not permitted or SpeechRecognition unavailable
      const mockCommands = ["Deploy 3 units to Patan Gate", "Calculate route to Bir Hospital", "Trigger Bagmati Flood Alert"];
      const chosen = mockCommands[Math.floor(Math.random() * mockCommands.length)];
      setSpatialStatus(`VOICE SIMULATED: "${chosen}"`);
      alert(`🎙️ WEB SPEECH API (Simulated):\nCommand: "${chosen}"\nDispatching rescue units to nearest depot via KD-Tree!`);
    }
  };

  return (
    <section className="py-20 relative w-full bg-[#020817] border-t border-emerald-500/20 z-20">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 mb-12 text-center space-y-3">
        <div className="inline-block font-mono text-[10px] font-bold tracking-widest uppercase bg-yellow-400 text-slate-950 px-3 py-1 rounded shadow-md">
          CORE OPERATIONAL LEADS & ENGINES
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
          Next-Gen Disaster Response Architecture
        </h2>
        <p className="text-sm md:text-base text-emerald-300/80 font-mono max-w-2xl mx-auto">
          Hover over each specialized engineering pillar to activate the real-time neural dot-matrix shader and inspect operational telemetry.
        </p>
      </div>

      {/* 3 Lead Cards with Canvas Reveal Shaders */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Card 1: Digital Twin Lead */}
        <LeadCard
          badge="LEAD 01 // GIS"
          role="Digital Twin Lead"
          title="3D Terrain & Flood Sim"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
            </svg>
          }
          bullets={[
            "3D Mapbox GL JS with elevation & terrain",
            "3D building extrusions & camera rotations",
            "Visual flood simulation layer (Bagmati wave spread)",
            "Dynamic route polylines & animated vehicle markers",
          ]}
          actionLabel="LAUNCH DIGITAL TWIN"
          onAction={handleDigitalTwin}
        >
          <CanvasRevealEffect
            animationSpeed={3.2}
            containerClassName="bg-[#022c22]"
            colors={[
              [16, 185, 129],
              [52, 211, 153],
            ]}
            dotSize={2.5}
          />
        </LeadCard>

        {/* Card 2: Triage Engine Lead */}
        <LeadCard
          badge="LEAD 02 // ALGORITHMS"
          role="Triage Engine Lead"
          title="Priority Max-Heap"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          bullets={[
            "Priority Max-Heap class in JavaScript",
            "Dynamic urgency: (Medical × Threat) / Time",
            "Mock SOS payload generator (Himalayan grid)",
            "Expose insertSOS() and extractMax() for UI",
          ]}
          actionLabel="SIMULATE MAX-HEAP EXTRACT"
          onAction={handleTriageAction}
        >
          <CanvasRevealEffect
            animationSpeed={2.8}
            containerClassName="bg-[#042f2e]"
            colors={[
              [250, 204, 21],
              [16, 185, 129],
            ]}
            dotSize={2.5}
          />
        </LeadCard>

        {/* Card 3: Spatial Engine & Demo Lead */}
        <LeadCard
          badge="LEAD 03 // DISPATCH"
          role="Spatial Engine Lead"
          title="Geohash & Voice AI"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15a3 3 0 01-3-3V4.5a3 3 0 116 0v7.5a3 3 0 01-3 3z" />
            </svg>
          }
          bullets={[
            "Geohash + KD-Tree for depot lookup (O(log N))",
            "Web Speech API: 'Deploy 3 units'",
            "1-Click 'Trigger Disaster' simulation script",
            "Pitch deck and live operational telemetry",
          ]}
          actionLabel="⚡ 1-CLICK TRIGGER DISASTER"
          onAction={handleDisasterSimulation}
        >
          <CanvasRevealEffect
            animationSpeed={3.0}
            containerClassName="bg-[#021f1e]"
            colors={[
              [14, 165, 233],
              [52, 211, 153],
            ]}
            dotSize={2.5}
          />
        </LeadCard>

      </div>

      {/* Voice Commander Quick Bar */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 mt-10">
        <div className="p-4 rounded-xl bg-[#022c22]/90 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-emerald-200">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-emerald-950 border border-emerald-600/40 text-yellow-400">🎙️</span>
            <div>
              <span className="font-bold text-white uppercase">Tactical Voice Commander:</span>{" "}
              <span className="text-emerald-300">{spatialStatus}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleVoiceTest}
              className="px-4 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
            >
              {voiceActive ? "LISTENING..." : "TEST VOICE COMMAND"}
            </button>
            <button
              onClick={handleDisasterSimulation}
              className="px-4 py-2 rounded-lg bg-red-950 hover:bg-red-900 border border-red-700/60 text-red-300 font-bold tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
            >
              TRIGGER DISASTER
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
