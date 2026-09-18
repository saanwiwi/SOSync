import { TriageMaxHeap } from './priorityHeap.js';

const triageHeap = new TriageMaxHeap();

const sampleCalls = [
  { id: "SOS-LOW", type: "Minor Water Leak", medicalSeverity: 1, threatLevel: 2, timestamp: Date.now() - 300000, details: "Water on driveway" },
  { id: "SOS-CRITICAL", type: "Structural Collapse", medicalSeverity: 10, threatLevel: 10, timestamp: Date.now() - 60000, details: "Trapped under debris" },
  { id: "SOS-MEDIUM", type: "Stranded Vehicle", medicalSeverity: 4, threatLevel: 6, timestamp: Date.now() - 600000, details: "Stuck in 2ft water" }
];

console.log("=== INGESTING SOS CALLS ===");
sampleCalls.forEach((call) => {
  triageHeap.insert(call);
  console.log(`Inserted: ${call.id} | Score: ${call.priorityScore}`);
});

console.log("\n=== TESTING DISPATCH EXTRACTION (MAX-HEAP) ===");
while (triageHeap.peek() !== null) {
  const topPriorityCall = triageHeap.extractMax();
  console.log(`🚨 DISPATCHING TO: [${topPriorityCall.id}] - ${topPriorityCall.type}`);
}