const BASE32 = "0123456789bcdefghjkmnpqrstuvwxyz";

function encodeGeohash(latitude, longitude, precision = 6) {
    let latRange = [-90, 90];
    let lonRange = [-180, 180];

    let hash = "";
    let bits = 0;
    let bitCount = 0;
    let even = true;

    while (hash.length < precision) {
        if (even) {
            const mid = (lonRange[0] + lonRange[1]) / 2;

            if (longitude >= mid) {
                bits = (bits << 1) | 1;
                lonRange[0] = mid;
            } else {
                bits = bits << 1;
                lonRange[1] = mid;
            }
        } else {
            const mid = (latRange[0] + latRange[1]) / 2;

            if (latitude >= mid) {
                bits = (bits << 1) | 1;
                latRange[0] = mid;
            } else {
                bits = bits << 1;
                latRange[1] = mid;
            }
        }

        even = !even;
        bitCount++;

        if (bitCount === 5) {
            hash += BASE32[bits];
            bitCount = 0;
            bits = 0;
        }
    }

    return hash;
}

console.log(encodeGeohash(12.9716, 77.5946));
module.exports = { encodeGeohash };
