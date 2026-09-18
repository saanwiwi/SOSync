import cityData from '../data/cityGraph.json';

class GraphRoutingEngine {
  constructor() {
    this.nodes = cityData.nodes;
    this.edges = cityData.edges;
    this.adjacencyList = {};
    this.buildAdjacencyList();
  }

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

  heuristic(nodeAId, nodeBId) {
    const a = this.nodes[nodeAId];
    const b = this.nodes[nodeBId];
    if (!a || !b) return 0;

    return Math.sqrt(
      Math.pow(a.lat - b.lat, 2) +
      Math.pow(a.lng - b.lng, 2)
    );
  }

  findPath(startId, targetId) {
    if (!this.nodes[startId] || !this.nodes[targetId]) return null;
    
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
      openSet.sort((a, b) => fScore[a] - fScore[b]);
      let current = openSet.shift();

      if (current === targetId) {
        return this.reconstructPath(cameFrom, current);
      }

      for (let neighborObj of this.adjacencyList[current] || []) {
        let neighbor = neighborObj.node;
        let weight = neighborObj.weight;

        if (weight === Infinity) {
          continue;
        }

        let tentativeGScore = gScore[current] + weight;

        if (tentativeGScore < gScore[neighbor]) {
          cameFrom[neighbor] = current;
          gScore[neighbor] = tentativeGScore;
          fScore[neighbor] = gScore[neighbor] + this.heuristic(neighbor, targetId);

          if (!openSet.includes(neighbor)) {
            openSet.push(neighbor);
          }
        }
      }
    }

    return null;
  }

  reconstructPath(cameFrom, current) {
    let totalPathNodeIds = [current];

    while (current in cameFrom) {
      current = cameFrom[current];
      totalPathNodeIds.unshift(current);
    }

    return totalPathNodeIds.map(id => [
      this.nodes[id].lng,
      this.nodes[id].lat
    ]);
  }

  toggleFlood(fromNode, toNode, isFlooded) {
    const edge = this.edges.find(
      e =>
        (e.from === fromNode && e.to === toNode) ||
        (e.from === toNode && e.to === fromNode)
    );

    if (edge) {
      edge.flooded = isFlooded;
      this.buildAdjacencyList();
    }
  }
}

export const routingEngine = new GraphRoutingEngine();