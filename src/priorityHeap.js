export class TriageMaxHeap {
  constructor() {
    this.heap = [];
  }

  calculateScore(sosCall) {
    const timeWaiting = Math.floor((Date.now() - sosCall.timestamp) / 60000);
    return (sosCall.medicalSeverity * 10) + (sosCall.threatLevel * 10) - timeWaiting;
  }

  insert(sosCall) {
    sosCall.priorityScore = this.calculateScore(sosCall);
    this.heap.push(sosCall);
    this.heapifyUp(this.heap.length - 1);
  }

  extractMax() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();
    const max = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.heapifyDown(0);
    return max;
  }

  heapifyUp(index) {
    let currentIndex = index;
    let parentIndex = Math.floor((currentIndex - 1) / 2);
    while (currentIndex > 0 && this.heap[currentIndex].priorityScore > this.heap[parentIndex].priorityScore) {
      [this.heap[currentIndex], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[currentIndex]];
      currentIndex = parentIndex;
      parentIndex = Math.floor((currentIndex - 1) / 2);
    }
  }

  heapifyDown(index) {
    let currentIndex = index;
    let leftChildIndex = 2 * currentIndex + 1;
    let rightChildIndex = 2 * currentIndex + 2;
    let largestIndex = currentIndex;
    const length = this.heap.length;

    if (leftChildIndex < length && this.heap[leftChildIndex].priorityScore > this.heap[largestIndex].priorityScore) {
      largestIndex = leftChildIndex;
    }
    if (rightChildIndex < length && this.heap[rightChildIndex].priorityScore > this.heap[largestIndex].priorityScore) {
      largestIndex = rightChildIndex;
    }
    if (largestIndex !== currentIndex) {
      [this.heap[currentIndex], this.heap[largestIndex]] = [this.heap[largestIndex], this.heap[currentIndex]];
      this.heapifyDown(largestIndex);
    }
  }

  peek() {
    return this.heap.length > 0 ? this.heap[0] : null;
  }
}