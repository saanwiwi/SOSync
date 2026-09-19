/**
 * Spatial Engine: Geohash supply depot lookup, Web Speech API command processor,
 * and 1-click Disaster Simulation script.
 */

import { routingEngine } from './GraphRoutingEngine';
import { triageEngine, generateMockSOS } from './TriageEngine';

// Kathmandu Emergency Supply Depots
export const SUPPLY_DEPOTS = [
  { id: "DEPOT-NORTH", name: "Tribhuvan University Teaching Hospital", lat: 27.7366, lng: 85.3308, geohash: "tu5k4", bloodUnits: 450, medicalKits: 1200, fleet: 6 },
  { id: "DEPOT-CENTRAL", name: "Bir Hospital Staging Depot", lat: 27.7058, lng: 85.3134, geohash: "tu54h", bloodUnits: 820, medicalKits: 2500, fleet: 14 },
  { id: "DEPOT-SOUTH", name: "Patan Hospital Logistics Center", lat: 27.6681, lng: 85.3204, geohash: "tu54e", bloodUnits: 310, medicalKits: 950, fleet: 8 },
  { id: "DEPOT-EAST", name: "Bhaktapur Regional Medical Base", lat: 27.6715, lng: 85.4285, geohash: "tu572", bloodUnits: 190, medicalKits: 600, fleet: 4 },
  { id: "DEPOT-WEST", name: "Armed Police Force Headquarters", lat: 27.6912, lng: 85.2915, geohash: "tu549", bloodUnits: 500, medicalKits: 1800, fleet: 10 },
];

/**
 * Lightweight Geohash encoding
 */
export function encodeGeohash(lat, lng, precision = 5) {
  const BITS = [16, 8, 4, 2, 1];
  const BASE32 = "0123456789bcdefghjkmnpqrstuvwxyz";
  let isEven = true;
  let latMin = -90, latMax = 90;
  let lonMin = -180, lonMax = 180;
  let bit = 0;
  let ch = 0;
  let geohash = "";

  while (geohash.length < precision) {
    let mid;
    if (isEven) {
      mid = (lonMin + lonMax) / 2;
      if (lng > mid) {
        ch |= BITS[bit];
        lonMin = mid;
      } else {
        lonMax = mid;
      }
    } else {
      mid = (latMin + latMax) / 2;
      if (lat > mid) {
        ch |= BITS[bit];
        latMin = mid;
      } else {
        latMax = mid;
      }
    }

    isEven = !isEven;
    if (bit < 4) {
      bit++;
    } else {
      geohash += BASE32[ch];
      bit = 0;
      ch = 0;
    }
  }
  return geohash;
}

/**
 * 2D Spatial KD-Tree node for O(log N) nearest supply depot lookup
 */
class KDNode {
  constructor(point, axis) {
    this.point = point;
    this.axis = axis; // 0 for lat, 1 for lng
    this.left = null;
    this.right = null;
  }
}

export class SpatialDepotTree {
  constructor(depots = SUPPLY_DEPOTS) {
    this.root = this.buildTree(depots, 0);
  }

  buildTree(points, depth) {
    if (!points || points.length === 0) return null;
    const axis = depth % 2;
    const sorted = [...points].sort((a, b) => (axis === 0 ? a.lat - b.lat : a.lng - b.lng));
    const median = Math.floor(sorted.length / 2);
    const node = new KDNode(sorted[median], axis);
    node.left = this.buildTree(sorted.slice(0, median), depth + 1);
    node.right = this.buildTree(sorted.slice(median + 1), depth + 1);
    return node;
  }

  findNearest(targetLat, targetLng) {
    let best = null;
    let bestDist = Infinity;

    const distance = (a, bLat, bLng) => {
      const dLat = a.lat - bLat;
      const dLng = a.lng - bLng;
      return dLat * dLat + dLng * dLng;
    };

    const search = (node) => {
      if (!node) return;
      const d = distance(node.point, targetLat, targetLng);
      if (d < bestDist) {
        bestDist = d;
        best = node.point;
      }

      const axisVal = node.axis === 0 ? targetLat - node.point.lat : targetLng - node.point.lng;
      const first = axisVal < 0 ? node.left : node.right;
      const second = axisVal < 0 ? node.right : node.left;

      search(first);
      if (axisVal * axisVal < bestDist) {
        search(second);
      }
    };

    search(this.root);
    return best;
  }
}

export const depotTree = new SpatialDepotTree();

/**
 * Web Speech API Voice Command Controller
 */
export class VoiceCommander {
  constructor(onCommand) {
    this.onCommand = onCommand;
    this.recognition = null;
    this.isListening = false;
    this.init();
  }

  init() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        if (this.onCommand) this.onCommand(transcript);
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };
    }
  }

  start() {
    if (this.recognition && !this.isListening) {
      try {
        this.recognition.start();
        this.isListening = true;
        return true;
      } catch (err) {
        console.warn("Speech recognition error:", err);
      }
    }
    return false;
  }

  stop() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
}

/**
 * 1-Click "Trigger Disaster" Simulation
 * - Inundates Bagmati River nodes in RoutingEngine
 * - Generates high-urgency SOS distress signals in TriageHeap
 * - Triggers alarm status
 */
export function triggerDisasterSimulation(callback) {
  // 1. Flood Bagmati river crossings
  routingEngine.toggleFlood("A", "C", true);
  routingEngine.toggleFlood("C", "E", true);

  // 2. Generate 3 emergency high-threat casualties
  const sos1 = generateMockSOS();
  sos1.medical = 10;
  sos1.threat = 10;
  sos1.elapsedMinutes = 1;
  sos1.injury = "M9.1 Catastrophic Liquefaction & Bridge Severance";
  triageEngine.insertSOS(sos1);

  const sos2 = generateMockSOS();
  sos2.medical = 9;
  sos2.threat = 9;
  triageEngine.insertSOS(sos2);

  // 3. Find optimal detour path around flooded sectors
  const newPath = routingEngine.findPath("A", "D");

  if (callback) {
    callback({
      status: "DISASTER_TRIGGERED",
      event: "M7.8 Seismic Rupture // Bagmati Inundation",
      floodedEdges: ["A-C", "C-E"],
      topCasualty: triageEngine.peek(),
      newPath,
    });
  }

  return { newPath, topCasualty: triageEngine.peek() };
}
