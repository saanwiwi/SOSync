import React, { useState } from 'react';
import { routingEngine } from '../services/GraphRoutingEngine';

export default function RoutingPanel({ onRouteCalculated }) {
  const [startNode, setStartNode] = useState('A');
  const [targetNode, setTargetNode] = useState('C');
  const [floodEdge, setFloodEdge] = useState({ from: 'A', to: 'B' });
  const [isFlooded, setIsFlooded] = useState(false);
  const [activePath, setActivePath] = useState(null);

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

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl space-y-4 font-mono text-xs shadow-2xl text-slate-100">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <span className="font-bold text-yellow-400">⚡ A* GRAPH ROUTING ENGINE</span>
        <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">ONLINE</span>
      </div>

      {/* Pathfinding Controls */}
      <div className="space-y-3">
        <div className="text-[10px] text-slate-400 tracking-wider">DEPLOYMENT ROUTING MATRIX</div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] text-slate-500 block mb-1">ORIGIN NODE</label>
            <input 
              type="text" 
              value={startNode} 
              onChange={(e) => setStartNode(e.target.value.toUpperCase())}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-center text-white font-bold"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-500 block mb-1">TARGET NODE</label>
            <input 
              type="text" 
              value={targetNode} 
              onChange={(e) => setTargetNode(e.target.value.toUpperCase())}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-center text-white font-bold"
            />
          </div>
        </div>

        <button 
          onClick={handleCalculate}
          className="w-full py-2.5 bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-bold rounded-lg transition-all cursor-pointer shadow-lg"
        >
          COMPUTE OPTIMAL ROUTE
        </button>
      </div>

      {/* Flood Hazard Simulation Controls */}
      <div className="border-t border-slate-800 pt-4 space-y-3">
        <div className="text-[10px] text-slate-400 tracking-wider">HAZARD OVERRIDE SIMULATOR</div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] text-slate-500 block mb-1">EDGE (FROM - TO)</label>
            <div className="flex gap-1">
              <input 
                type="text" 
                value={floodEdge.from} 
                onChange={(e) => setFloodEdge({...floodEdge, from: e.target.value.toUpperCase()})}
                className="w-1/2 bg-slate-950 border border-slate-800 rounded-lg p-2 text-center text-white"
              />
              <input 
                type="text" 
                value={floodEdge.to} 
                onChange={(e) => setFloodEdge({...floodEdge, to: e.target.value.toUpperCase()})}
                className="w-1/2 bg-slate-950 border border-slate-800 rounded-lg p-2 text-center text-white"
              />
            </div>
          </div>
          <div className="flex items-end">
            <button 
              onClick={handleToggleFlood}
              className={`w-full py-2.5 rounded-lg font-bold transition-all cursor-pointer border ${
                isFlooded 
                  ? 'bg-red-950 border-red-700 text-red-400 shadow-[0_0_15px_rgba(153,27,27,0.4)]' 
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              {isFlooded ? 'FLOODED (ACTIVE)' : 'MARK FLOODED'}
            </button>
          </div>
        </div>
      </div>

      {/* Output Status */}
      {activePath && (
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] font-mono">
          <span className="text-emerald-400 font-bold">ROUTE FOUND:</span>{' '}
          <span className="text-slate-300">{activePath.length} coordinate waypoints mapped.</span>
        </div>
      )}
    </div>
  );
}