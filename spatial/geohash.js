// The standard 32-character alphabet used for Geohashing
const BASE32 = "0123456789bcdefghjkmnpqrstuvwxyz";

export function encodeGeohash(latitude, longitude, precision = 7) {
  let isEven = true;
  let latRange = [-90.0, 90.0];
  let lonRange = [-180.0, 180.0];
  let bit = 0;
  let ch = 0;
  let geohash = "";

  // Loop until we hit the requested precision (length of the string)
  while (geohash.length < precision) {
    if (isEven) {
      let mid = (lonRange[0] + lonRange[1]) / 2;
      if (longitude > mid) {
        ch |= (1 << (4 - bit));
        lonRange[0] = mid;
      } else {
        lonRange[1] = mid;
      }
    } else {
      let mid = (latRange[0] + latRange[1]) / 2;
      if (latitude > mid) {
        ch |= (1 << (4 - bit));
        latRange[0] = mid;
      } else {
        latRange[1] = mid;
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

// 2. Helper function to combine Step 1 (Risk Data) with Step 2 (Location Data)
export function attachLocationData(analyzedCall, lat, lon) {
  // Precision 7 generates a grid square roughly 150 meters wide
  const hash = encodeGeohash(lat, lon, 7); 
  
  return {
    ...analyzedCall,
    latitude: lat,
    longitude: lon,
    geohash: hash,
    gridURL: `https://www.google.com/maps?q=${lat},${lon}` // Instant map link for rescuers
  };
}

// ==========================================
// TEST EXAMPLE 
// ==========================================
// const dummyCall = { riskScore: 25, needsCategory: ["boat_rescue"] };
// // Coordinates for somewhere in Kathmandu
// console.log(attachLocationData(dummyCall, 27.7172, 85.3240));