<<<<<<< HEAD
export class SpatialGrid {
  constructor() {
    this.sectors = new Map(); // Maps sector codes (e.g., "SEC-7-4") to arrays of SOS calls
  }

  // Simple spatial hashing function converting lat/lng into a grid sector string
  getSectorKey(lat, lng, precision = 1) {
    const latGrid = Math.floor(lat * Math.pow(10, precision));
    const lngGrid = Math.floor(lng * Math.pow(10, precision));
    return `SEC-${latGrid}-${lngGrid}`;
  }

  // Add an emergency call into its appropriate spatial sector
  addCall(sosCall) {
    const sector = this.getSectorKey(sosCall.lat, sosCall.lng);
    if (!this.sectors.has(sector)) {
      this.sectors.set(sector, []);
    }
    this.sectors.get(sector).push(sosCall);
  }

  // Retrieve all emergency calls within a specific sector
  getCallsInSector(lat, lng) {
    const sector = this.getSectorKey(lat, lng);
    return this.sectors.get(sector) || [];
  }
=======
export class SpatialGrid {
  constructor() {
    this.sectors = new Map(); // Maps sector codes (e.g., "SEC-7-4") to arrays of SOS calls
  }

  // Simple spatial hashing function converting lat/lng into a grid sector string
  getSectorKey(lat, lng, precision = 1) {
    const latGrid = Math.floor(lat * Math.pow(10, precision));
    const lngGrid = Math.floor(lng * Math.pow(10, precision));
    return `SEC-${latGrid}-${lngGrid}`;
  }

  // Add an emergency call into its appropriate spatial sector
  addCall(sosCall) {
    const sector = this.getSectorKey(sosCall.lat, sosCall.lng);
    if (!this.sectors.has(sector)) {
      this.sectors.set(sector, []);
    }
    this.sectors.get(sector).push(sosCall);
  }

  // Retrieve all emergency calls within a specific sector
  getCallsInSector(lat, lng) {
    const sector = this.getSectorKey(lat, lng);
    return this.sectors.get(sector) || [];
  }
>>>>>>> e061da99571e1f8bc61c7cd7233a860644494525
}