import cityData from '../data/cityGraph.json';

class SpatialTree {
	constructor() {
		this.nodes = Object.values(cityData.nodes);
		this.tree = [];
		this.buildTree();
	}

	// Convert latitude and longitude into a simple spatial key
	getSpatialKey(lat, lng) {
		return `${lat.toFixed(3)}_${lng.toFixed(3)}`;
	}

	// Build a sorted spatial index
	buildTree() {
		this.tree = this.nodes
			.map(node => ({
				...node,
				key: this.getSpatialKey(node.lat, node.lng)
			}))
			.sort((a, b) => a.key.localeCompare(b.key));

		console.log('Spatial Tree built:', this.tree);
	}

	// Calculate distance between two coordinates
	distance(lat1, lng1, lat2, lng2) {
		const dLat = lat1 - lat2;
		const dLng = lng1 - lng2;

		return Math.sqrt(
			dLat * dLat +
			dLng * dLng
		);
	}

	// Find the nearest location
	findNearest(lat, lng) {
		if (this.tree.length === 0) {
			return null;
		}

		let nearest = this.tree[0];
		let minDistance = this.distance(
			lat,
			lng,
			nearest.lat,
			nearest.lng
		);

		this.tree.forEach(node => {
			const currentDistance = this.distance(
				lat,
				lng,
				node.lat,
				node.lng
			);

			if (currentDistance < minDistance) {
				minDistance = currentDistance;
				nearest = node;
			}
		});

		return {
			...nearest,
			distance: minDistance
		};
	}

	// Search locations by name
	searchByName(name) {
		const query = name.toLowerCase();

		return this.tree.filter(node =>
			node.name.toLowerCase().includes(query)
		);
	}

	// Get all indexed locations
	getAllLocations() {
		return this.tree;
	}
}

export default SpatialTree;
