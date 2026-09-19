import React, { useState } from 'react';
import { routingEngine } from '../services/GraphRoutingEngine';
import { triageEngine, generateMockSOS } from '../services/TriageEngine';
import { triggerDisasterSimulation, VoiceCommander } from '../services/SpatialEngine';

export default function RoutingPanel({ onRouteCalculated }) {
  const [startNode, setStartNode] = useState('A');
  const [targetNode, setTargetNode] = useState('C');
  const [floodEdge, setFloodEdge] = useState({ from: 'A', to: 'B' });
  const [isFlooded, setIsFlooded] = useState(false);
  const [activePath, setActivePath] = useState(null);
  const [triageList, setTriageList] = useState(triageEngine.getAllSorted());
  const [voiceStatus, setVoiceStatus] = useState(null);

  const handleCalculate = () => {
    const path = routingEngine.findPath(startNode, targetNode);
    setActivePath(path);
    if (onRouteCalculated) {
      onRouteCalculated(path);
    }
  };

  const handleToggleFlood = () => {
    const nextState = !isFlooded;
    setIsFlooded(nextState);
    routingEngine.toggleFlood(floodEdge.from, floodEdge.to, nextState);
    handleCalculate();
  };

  const handleInsertSOS = () => {
    const sos = generateMockSOS();
    triageEngine.insertSOS(sos);
    setTriageList(triageEngine.getAllSorted());
  };

  const handleExtractMax = () => {
    const max = triageEngine.extractMax();
    if (max) {
      alert(`🚑 DISPATCHING UNIT TO:\n${max.id} (${max.locationName})\nPriority Score: ${max.score}\nInjury: ${max.injury}`);
    }
    setTriageList(triageEngine.getAllSorted());
  };

  const handleTriggerDisaster = () => {
    const result = triggerDisasterSimulation();
    setIsFlooded(true);
    setTriageList(triageEngine.getAllSorted());
    if (result.newPath) {
      setActivePath(result.newPath);
      if (onRouteCalculated) onRouteCalculated(result.newPath);
    }
    alert("⚠️ 1-CLICK DISASTER ACTIVE:\nBagmati River crossings inundated!\nA* rerouting computed with bypass corridor.");
  };

  const handleVoiceCommand = () => {
    const commander = new VoiceCommander((transcript) => {
      setVoiceStatus(`Command: "${transcript}"`);
      if (transcript.includes("disaster") || transcript.includes("earthquake")) {
        handleTriggerDisaster();
      } else {
        handleInsertSOS();
      }
    });

    const started = commander.start();
    if (started) {
      setVoiceStatus("Listening... ('Deploy 3 units' / 'Trigger disaster')");
    } else {
      setVoiceStatus("Voice command simulated");
      handleInsertSOS();
    }
  };

  return (
    <div className="p-4 rounded-2xl bg-[#022c22]/95 border border-emerald-500/30 backdrop-blur-xl space-y-4 font-mono text-xs shadow-2xl text-emerald-100">
      {/* Panel Header */}
      <div className="flex justify-between items-center border-b border-emerald-500/20 pb-3">
        <span className="font-bold text-yellow-400">⚡ TACTICAL ENGINE SUITE</span>
        <span className="text-[10px] text-emerald-300 bg-[#064e3b] px-2 py-0.5 rounded border border-emerald-500/40">ONLINE</span>
      </div>

      {/* Pathfinding Controls */}
      <div className="space-y-2.5">
        <div className="text-[10px] text-emerald-400 font-bold tracking-wider">A* ROUTING ENGINE</div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[9px] text-emerald-400/70 block mb-1">ORIGIN</label>
            <input 
              type="text" 
              value={startNode} 
              onChange={(e) => setStartNode(e.target.value.toUpperCase())}
              className="w-full bg-[#011a14] border border-emerald-500/30 rounded-lg p-2 text-center text-white font-bold"
            />
          </div>
          <div>
            <label className="text-[9px] text-emerald-400/70 block mb-1">TARGET</label>
            <input 
              type="text" 
              value={targetNode} 
              onChange={(e) => setTargetNode(e.target.value.toUpperCase())}
              className="w-full bg-[#011a14] border border-emerald-500/30 rounded-lg p-2 text-center text-white font-bold"
            />
          </div>
        </div>

        <button 
          onClick={handleCalculate}
          className="w-full py-2 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold rounded-lg transition-all cursor-pointer shadow-md active:scale-95"
        >
          COMPUTE OPTIMAL ROUTE
        </button>
      </div>

      {/* Priority Max-Heap Triage Controls */}
      <div className="border-t border-emerald-500/20 pt-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-emerald-400 font-bold tracking-wider">MAX-HEAP TRIAGE QUEUE</span>
          <span className="text-[10px] font-bold text-yellow-400">{triageList.length} IN QUEUE</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleInsertSOS}
            className="py-1.5 px-2 rounded-lg bg-[#064e3b] hover:bg-[#047857] border border-emerald-500/40 text-[10px] text-emerald-200 font-bold transition-all cursor-pointer"
          >
            + INJECT SOS
          </button>
          <button
            onClick={handleExtractMax}
            className="py-1.5 px-2 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-700/50 text-[10px] text-red-300 font-bold transition-all cursor-pointer shadow-sm"
          >
            EXTRACT MAX PRIORITY
          </button>
        </div>

        {/* Top Triage Item Preview */}
        {triageList[0] && (
          <div className="p-2 rounded-lg bg-[#011a14] border border-emerald-500/20 text-[10px] space-y-0.5">
            <div className="flex justify-between font-bold">
              <span className="text-white">{triageList[0].id} - {triageList[0].locationName}</span>
              <span className="text-yellow-400">Score: {triageList[0].score}</span>
            </div>
            <div className="text-emerald-400/70 truncate">{triageList[0].injury}</div>
          </div>
        )}
      </div>

      {/* 1-Click Simulation & Voice Commands */}
      <div className="border-t border-emerald-500/20 pt-3 space-y-2">
        <div className="text-[10px] text-emerald-400 font-bold tracking-wider">DEMO & SPATIAL CONTROLS</div>
        
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleTriggerDisaster}
            className="py-2 px-2 rounded-lg bg-red-950 hover:bg-red-900 border border-red-700 text-[10px] text-red-200 font-black transition-all cursor-pointer shadow-lg active:scale-95 text-center"
          >
            ⚡ TRIGGER DISASTER
          </button>
          <button
            onClick={handleVoiceCommand}
            className="py-2 px-2 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-500/50 text-[10px] text-emerald-200 font-bold transition-all cursor-pointer text-center"
          >
            🎙️ VOICE COMMAND
          </button>
        </div>

        {voiceStatus && (
          <div className="text-[9px] text-yellow-300 italic truncate">
            {voiceStatus}
          </div>
        )}
      </div>

      {/* Route Found Feedback */}
      {activePath && (
        <div className="bg-[#011a14] p-2 rounded-lg border border-emerald-500/30 text-[10px] font-mono">
          <span className="text-emerald-400 font-bold">ROUTE ACTIVE:</span>{' '}
          <span className="text-slate-300">{activePath.length} waypoints via A*</span>
        </div>
      )}
    </div>
  );
}