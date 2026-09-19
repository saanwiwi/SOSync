import express from 'express';
import { TriageMaxHeap } from './priorityHeap.js';
import { AStarRouter } from './graphRouter.js';
import { SpatialGrid } from './spatialSearch.js';

const app = express();
app.use(express.json());

// Initialize core engine instances
const triageHeap = new TriageMaxHeap();
const router = new AStarRouter(10, 10);
const spatialGrid = new SpatialGrid();

// 1. Triage Endpoint: Submit a new SOS call
app.post('/api/triage', (req, res) => {
  const sosCall = req.body; // Expects { id, type, medicalSeverity, threatLevel, timestamp, details, lat, lng }
  if (!sosCall.id || !sosCall.medicalSeverity) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  triageHeap.insert(sosCall);
  spatialGrid.addCall(sosCall);

  res.json({ message: "SOS call ingested successfully", assignedScore: sosCall.priorityScore });
});

// 2. Triage Endpoint: Get the next highest priority emergency to dispatch
app.get('/api/triage/next', (req, res) => {
  const nextCall = triageHeap.extractMax();
  if (!nextCall) {
    return res.status(404).json({ message: "No active emergencies in queue" });
  }
  res.json({ dispatchTarget: nextCall });
});

// 3. Routing Endpoint: Calculate safe path around hazards
app.post('/api/route', (req, res) => {
  const { start, goal, hazards } = req.body; // hazards = [{x, y}, ...]
  
  // Clear previous blocks and apply current hazards
  router.blockedNodes.clear();
  if (hazards && Array.isArray(hazards)) {
    hazards.forEach(h => router.blockNode(h.x, h.y));
  }

  const path = router.findPath(start, goal);
  if (!path) {
    return res.status(404).json({ error: "No safe path found around hazards" });
  }

  res.json({ safePath: path });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 SOSync Command Backend running at http://localhost:${PORT}`);
});