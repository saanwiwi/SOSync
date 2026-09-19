export class AStarRouter {
  constructor(gridWidth, gridHeight) {
    this.width = gridWidth;
    this.height = gridHeight;
    this.blockedNodes = new Set(); // Stores coordinates like "x,y" that are impassable
  }

  // Mark a zone (like a flood zone or collapsed bridge) as blocked
  blockNode(x, y) {
    this.blockedNodes.add(`${x},${y}`);
  }

  unblockNode(x, y) {
    this.blockedNodes.delete(`${x},${y}`);
  }

  // Manhattan distance heuristic for grid navigation
  heuristic(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }

  // Find the safest, shortest path from start {x, y} to goal {x, y}
  findPath(start, goal) {
    const openSet = [ { ...start, g: 0, h: this.heuristic(start, goal), f: 0, parent: null } ];
    openSet[0].f = openSet[0].g + openSet[0].h;
    
    const closedSet = new Set();

    while (openSet.length > 0) {
      // Sort openSet to get the node with the lowest 'f' score
      openSet.sort((a, b) => a.f - b.f);
      const currentNode = openSet.shift();

      // Check if we reached the goal
      if (currentNode.x === goal.x && currentNode.y === goal.y) {
        let path = [];
        let curr = currentNode;
        while (curr) {
          path.push({ x: curr.x, y: curr.y });
          curr = curr.parent;
        }
        return path.reverse(); // Return path from start to goal
      }

      closedSet.add(`${currentNode.x},${currentNode.y}`);

      // Explore neighbors (Up, Down, Left, Right)
      const neighbors = [
        { x: currentNode.x, y: currentNode.y - 1 },
        { x: currentNode.x, y: currentNode.y + 1 },
        { x: currentNode.x - 1, y: currentNode.y },
        { x: currentNode.x + 1, y: currentNode.y }
      ];

      for (const neighbor of neighbors) {
        // Check boundaries
        if (neighbor.x < 0 || neighbor.x >= this.width || neighbor.y < 0 || neighbor.y >= this.height) {
          continue;
        }

        const neighborKey = `${neighbor.x},${neighbor.y}`;

        // Skip if blocked or already evaluated
        if (this.blockedNodes.has(neighborKey) || closedSet.has(neighborKey)) {
          continue;
        }

        const tentativeG = currentNode.g + 1; // Cost to move 1 step

        let existingNeighbor = openSet.find(n => n.x === neighbor.x && n.y === neighbor.y);

        if (!existingNeighbor) {
          const h = this.heuristic(neighbor, goal);
          openSet.push({
            x: neighbor.x,
            y: neighbor.y,
            g: tentativeG,
            h: h,
            f: tentativeG + h,
            parent: currentNode
          });
        } else if (tentativeG < existingNeighbor.g) {
          existingNeighbor.g = tentativeG;
          existingNeighbor.f = existingNeighbor.g + existingNeighbor.h;
          existingNeighbor.parent = currentNode;
        }
      }
    }

    return null; // Return null if no path exists around hazards
  }
}