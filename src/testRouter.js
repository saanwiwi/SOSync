import { AStarRouter } from './graphRouter.js';

// Create a 10x10 city grid
const router = new AStarRouter(10, 10);

// Simulate a blocked disaster zone (e.g., a collapsed highway or severe flooding wall)
console.log("=== SETUP HAZARD ZONES ===");
router.blockNode(3, 1);
router.blockNode(3, 2);
router.blockNode(3, 3);
router.blockNode(3, 4);
console.log("Blocked path at column x=3 from y=1 to y=4.");

const startCoord = { x: 1, y: 2 };
const goalCoord = { x: 5, y: 2 };

console.log(`\nCalculating rescue route from (${startCoord.x}, ${startCoord.y}) to (${goalCoord.x}, ${goalCoord.y})...`);

const path = router.findPath(startCoord, goalCoord);

if (path) {
  console.log("✅ PATH FOUND AROUND HAZARDS:");
  path.forEach((step, index) => {
    console.log(`Step ${index}: -> (${step.x}, ${step.y})`);
  });
} else {
  console.log("❌ No safe path available!");
}