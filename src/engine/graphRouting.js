import cityData from '../data/cityGraph.json';

class GraphRoutingEngine {
  constructor() {
    this.nodes = cityData.nodes;
    this.edges = cityData.edges;
    this.adjacencyList = {};
    this.buildAdjacencyList();
  }

  // Convert raw edge list into an Adjacency List
  buildAdjacencyList() {
    Object.keys(this.nodes).forEach(nodeId => {
      this.adjacencyList[nodeId] = [];
    });

    this.edges.forEach(edge => {
      const weight = edge.flooded ? Infinity : edge.weight;

      this.adjacencyList[edge.from].push({
        node: edge.to,
        weight: weight
      });

      this.adjacencyList[edge.to].push({
        node: edge.from,
        weight: weight
      });
    });
  }

  // Heuristic function
  heuristic(nodeAId, nodeBId) {
    const a = this.nodes[nodeAId];
    const b = this.nodes[nodeBId];

    return Math.sqrt(
      Math.pow(a.lat - b.lat, 2) +
      Math.pow(a.lng - b.lng, 2)
    );
  }

  // A* Search Algorithm
  findPath(startId, targetId) {
    let openSet = [startId];
    let cameFrom = {};

    let gScore = {};
    let fScore = {};

    Object.keys(this.nodes).forEach(id => {
      gScore[id] = Infinity;
      fScore[id] = Infinity;
    });

    gScore[startId] = 0;
    fScore[startId] = this.heuristic(startId, targetId);

    while (openSet.length > 0) {

      // Get node with lowest fScore
      openSet.sort((a, b) => fScore[a] - fScore[b]);

      let current = openSet.shift();

      // Target reached
      if (current === targetId) {
        return this.reconstructPath(cameFrom, current);
      }

      for (let neighborObj of this.adjacencyList[current]) {

        let neighbor = neighborObj.node;
        let weight = neighborObj.weight;

        // Skip flooded roads
        if (weight === Infinity) {
          continue;
        }

        let tentativeGScore =
          gScore[current] + weight;

        if (tentativeGScore < gScore[neighbor]) {

          cameFrom[neighbor] = current;

          gScore[neighbor] = tentativeGScore;

          fScore[neighbor] =
            gScore[neighbor] +
            this.heuristic(neighbor, targetId);

          if (!openSet.includes(neighbor)) {
            openSet.push(neighbor);
          }
        }
      }
    }

    // No path found
    return null;
  }

  // Reconstruct path
  reconstructPath(cameFrom, current) {

    let totalPathNodeIds = [current];

    while (current in cameFrom) {
      current = cameFrom[current];
      totalPathNodeIds.unshift(current);
    }

    // Convert to Mapbox [lng, lat] coordinates
    return totalPathNodeIds.map(id => [
      this.nodes[id].lng,
      this.nodes[id].lat
    ]);
  }

  // Flood hazard override
  toggleFlood(fromNode, toNode, isFlooded) {

    const edge = this.edges.find(
      e =>
        (e.from === fromNode && e.to === toNode) ||
        (e.from === toNode && e.to === fromNode)
    );

    if (edge) {
      edge.flooded = isFlooded;

      // Rebuild adjacency list
      this.buildAdjacencyList();
    }
  }
}

export const routingEngine = new GraphRoutingEngine();