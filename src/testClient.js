
async function runTests() {
  console.log("=== TESTING SOSYNC LIVE API ===");

  // 1. Submit an SOS Call
  const response = await fetch('http://localhost:3000/api/triage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: "SOS-API-01",
      type: "Severe Flooding",
      medicalSeverity: 8,
      threatLevel: 9,
      timestamp: Date.now() - 120000,
      details: "Water level rising rapidly",
      lat: 13.0827,
      lng: 80.2707
    })
  });
  const result = await response.json();
  console.log("POST /api/triage Response:", result);

  // 2. Fetch Next Priority Dispatch
  const nextResponse = await fetch('http://localhost:3000/api/triage/next');
  const nextCall = await nextResponse.json();
  console.log("GET /api/triage/next Response:", nextCall);
}

runTests();