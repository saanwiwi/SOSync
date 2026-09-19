export class PriorityQueue {
  constructor() {
    this.heap = [];
  }

  // Insert a new distress call and bubble it up to its proper rank
  insert(callObject) {
    this.heap.push(callObject);
    this.heapifyUp();
  }

  // Pulls the absolute highest-risk emergency from the system
  extractMax() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const max = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.heapifyDown();
    return max;
  }

  // Utility to get the current list for your React Dashboard
  getQueueForUI() {
    // Returns a safely sorted array for your frontend to display
    return [...this.heap].sort((a, b) => b.riskScore - a.riskScore);
  }

  // --- Internal Heap Mechanics ---
  getLeftChildIndex(parentIndex) { return 2 * parentIndex + 1; }
  getRightChildIndex(parentIndex) { return 2 * parentIndex + 2; }
  getParentIndex(childIndex) { return Math.floor((childIndex - 1) / 2); }

  heapifyUp() {
    let index = this.heap.length - 1;
    while (
      index > 0 && 
      this.heap[index].riskScore > this.heap[this.getParentIndex(index)].riskScore
    ) {
      this.swap(index, this.getParentIndex(index));
      index = this.getParentIndex(index);
    }
  }

  heapifyDown() {
    let index = 0;
    while (this.getLeftChildIndex(index) < this.heap.length) {
      let largerChildIndex = this.getLeftChildIndex(index);
      
      if (
        this.getRightChildIndex(index) < this.heap.length &&
        this.heap[this.getRightChildIndex(index)].riskScore > this.heap[largerChildIndex].riskScore
      ) {
        largerChildIndex = this.getRightChildIndex(index);
      }

      if (this.heap[index].riskScore >= this.heap[largerChildIndex].riskScore) {
        break;
      } else {
        this.swap(index, largerChildIndex);
        index = largerChildIndex;
      }
    }
  }

  swap(index1, index2) {
    const temp = this.heap[index1];
    this.heap[index1] = this.heap[index2];
    this.heap[index2] = temp;
  }
}

// ==========================================
// TEST EXAMPLE 
// ==========================================
// const queue = new PriorityQueue();
// queue.insert({ riskScore: 2, geohash: "low_risk_call" });
// queue.insert({ riskScore: 25, geohash: "critical_roof_rescue" });
// queue.insert({ riskScore: 10, geohash: "medium_risk_call" });
// 
// console.log("Next to rescue:", queue.extractMax()); 
// Output will automatically be the "critical_roof_rescue" object.