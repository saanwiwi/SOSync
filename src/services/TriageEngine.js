/**
 * Priority Max-Heap for Emergency Disaster Triage
 * Urgency Score Formula: (Medical Priority [1-10] * Threat Level [1-10]) / Elapsed Time (min)
 */

export class PriorityMaxHeap {
  constructor() {
    this.heap = [];
  }

  // Calculate dynamic urgency score: (Medical * Threat) / Time
  static calculateUrgencyScore(medical, threat, elapsedMinutes = 1) {
    const timeFactor = Math.max(0.5, elapsedMinutes);
    return Number(((medical * threat) / timeFactor).toFixed(2));
  }

  parentIndex(i) {
    return Math.floor((i - 1) / 2);
  }

  leftChildIndex(i) {
    return 2 * i + 1;
  }

  rightChildIndex(i) {
    return 2 * i + 2;
  }

  swap(i, j) {
    const temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }

  // Insert a new SOS distress payload into the max-heap: O(log N)
  insertSOS(sos) {
    // Ensure urgency score is calculated
    if (sos.score === undefined) {
      sos.score = PriorityMaxHeap.calculateUrgencyScore(
        sos.medical || 5,
        sos.threat || 5,
        sos.elapsedMinutes || 1
      );
    }

    this.heap.push(sos);
    this.bubbleUp(this.heap.length - 1);
    return sos;
  }

  bubbleUp(index) {
    while (index > 0) {
      const parent = this.parentIndex(index);
      if (this.heap[index].score > this.heap[parent].score) {
        this.swap(index, parent);
        index = parent;
      } else {
        break;
      }
    }
  }

  // Extract the highest-priority casualty from the max-heap: O(log N)
  extractMax() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const max = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.bubbleDown(0);
    return max;
  }

  bubbleDown(index) {
    const length = this.heap.length;
    while (this.leftChildIndex(index) < length) {
      let largest = this.leftChildIndex(index);
      const right = this.rightChildIndex(index);

      if (right < length && this.heap[right].score > this.heap[largest].score) {
        largest = right;
      }

      if (this.heap[largest].score > this.heap[index].score) {
        this.swap(index, largest);
        index = largest;
      } else {
        break;
      }
    }
  }

  peek() {
    return this.heap[0] || null;
  }

  size() {
    return this.heap.length;
  }

  getAllSorted() {
    return [...this.heap].sort((a, b) => b.score - a.score);
  }
}

// Mock SOS Generator for Kathmandu Basin
const KATHMANDU_ZONES = [
  { name: "Thamel District", lat: 27.7154, lng: 85.3123 },
  { name: "Patan Durbar Area", lat: 27.6744, lng: 85.326 },
  { name: "Boudhanath Corridor", lat: 27.7215, lng: 85.362 },
  { name: "Swayambhunath Hill", lat: 27.7149, lng: 85.2904 },
  { name: "Bagmati Riverside", lat: 27.6938, lng: 85.3211 },
  { name: "Bhaktapur Ancient Gate", lat: 27.671, lng: 85.4298 },
  { name: "Kalanki Overpass", lat: 27.6934, lng: 85.2818 },
  { name: "Tribhuvan Airfield East", lat: 27.6966, lng: 85.359 },
];

const INJURY_TYPES = [
  "Crush Injury (Severe)",
  "Compound Fracture",
  "Pneumothorax / Smoke Inhalation",
  "Traumatic Brain Injury",
  "Severe Hemorrhage",
  "Entrapment Under Masonry",
];

export function generateMockSOS(id = Math.floor(Math.random() * 9000 + 1000)) {
  const zone = KATHMANDU_ZONES[Math.floor(Math.random() * KATHMANDU_ZONES.length)];
  const injury = INJURY_TYPES[Math.floor(Math.random() * INJURY_TYPES.length)];
  const medical = Math.floor(Math.random() * 6) + 5; // 5-10
  const threat = Math.floor(Math.random() * 6) + 5; // 5-10
  const elapsedMinutes = Math.floor(Math.random() * 8) + 1; // 1-8 min
  const score = PriorityMaxHeap.calculateUrgencyScore(medical, threat, elapsedMinutes);

  return {
    id: `SOS-${id}`,
    locationName: zone.name,
    lat: zone.lat + (Math.random() - 0.5) * 0.006,
    lng: zone.lng + (Math.random() - 0.5) * 0.006,
    injury,
    medical,
    threat,
    elapsedMinutes,
    score,
    timestamp: new Date().toLocaleTimeString(),
    status: "PENDING_EXTRACTION",
  };
}

export const triageEngine = new PriorityMaxHeap();

// Seed initial triage casualties
[
  { id: "SOS-901", locationName: "Bagmati Riverbank", lat: 27.6938, lng: 85.3211, injury: "Traumatic Asphyxiation", medical: 10, threat: 9, elapsedMinutes: 2 },
  { id: "SOS-902", locationName: "Thamel Bazaar", lat: 27.7154, lng: 85.3123, injury: "Masonry Collapse Entrapment", medical: 9, threat: 8, elapsedMinutes: 3 },
  { id: "SOS-903", locationName: "Patan West Gate", lat: 27.6744, lng: 85.326, injury: "Femoral Fracture", medical: 8, threat: 7, elapsedMinutes: 4 },
  { id: "SOS-904", locationName: "Kalanki Corridor", lat: 27.6934, lng: 85.2818, injury: "Crush Injury", medical: 7, threat: 6, elapsedMinutes: 5 },
].forEach((item) => triageEngine.insertSOS(item));
