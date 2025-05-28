// DOM Elements
const algorithmSelect = document.getElementById('algorithm');
const sizeSlider = document.getElementById('size');
const sizeValue = document.getElementById('sizeValue');
const speedSlider = document.getElementById('speed');
const speedValue = document.getElementById('speedValue');
const generateBtn = document.getElementById('generate');
const sortBtn = document.getElementById('sort');
const visualization = document.getElementById('visualization');
const currentAlgorithm = document.getElementById('currentAlgorithm');
const comparisonsDisplay = document.getElementById('comparisons');
const swapsDisplay = document.getElementById('swaps');
const timeDisplay = document.getElementById('time');

// State
let array = [];
let bars = [];
let sorting = false;
let speed = 100 - speedSlider.value;
let comparisons = 0;
let swaps = 0;
let startTime = 0;

// Initialize
function init() {
  updateSize();
  updateSpeed();
  generateArray();
  
  // Event Listeners
  sizeSlider.addEventListener('input', updateSize);
  speedSlider.addEventListener('input', updateSpeed);
  generateBtn.addEventListener('click', generateArray);
  sortBtn.addEventListener('click', startSorting);
  algorithmSelect.addEventListener('change', () => {
    currentAlgorithm.textContent = algorithmSelect.options[algorithmSelect.selectedIndex].text;
  });
}

function updateSize() {
  sizeValue.textContent = sizeSlider.value;
}

function updateSpeed() {
  speed = 105 - speedSlider.value;
  speedValue.textContent = speedSlider.value;
}

function generateArray() {
  if (sorting) return;
  
  array = [];
  const size = parseInt(sizeSlider.value);
  for (let i = 0; i < size; i++) {
    array.push(Math.floor(Math.random() * 100) + 1);
  }
  
  renderBars();
  resetStats();
}

function renderBars() {
  visualization.innerHTML = '';
  bars = [];
  
  const maxHeight = Math.max(...array);
  const containerHeight = visualization.clientHeight;
  const barWidth = (visualization.clientWidth / array.length) - 2;
  
  array.forEach((value, index) => {
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.height = `${(value / maxHeight) * containerHeight}px`;
    bar.style.width = `${barWidth}px`;
    visualization.appendChild(bar);
    bars.push(bar);
  });
}

function resetStats() {
  comparisons = 0;
  swaps = 0;
  updateStats();
}

async function startSorting() {
  if (sorting || array.length === 0) return;
  
  sorting = true;
  resetStats();
  startTime = performance.now();
  
  const algorithm = algorithmSelect.value;
  
  // Reset all bars to default color
  bars.forEach(bar => {
    bar.classList.remove('highlight', 'sorted');
  });
  
  try {
    switch (algorithm) {
      case 'bubbleSort':
        await bubbleSort();
        break;
      case 'selectionSort':
        await selectionSort();
        break;
      case 'insertionSort':
        await insertionSort();
        break;
      case 'mergeSort':
        await mergeSortHelper();
        break;
      case 'quickSortLomuto':
        await quickSortLomuto(0, array.length - 1);
        break;
      case 'quickSortHoare':
        await quickSortHoare(0, array.length - 1);
        break;
      case 'cycleSort':
        await cycleSort();
        break;
      case 'heapSort':
        await heapSort();
        break;
      case 'countingSort':
        countingSort();
        break;
      case 'radixSort':
        radixSort();
        break;
      case 'bucketSort':
        bucketSort();
        break;
    }
  } catch (error) {
    console.error("Sorting error:", error);
  } finally {
    if (sorting) {
      markAllSorted();
    }
    sorting = false;
  }
}

// Utility functions
async function sleep() {
  return new Promise(resolve => setTimeout(resolve, speed));
}

function updateStats() {
  comparisonsDisplay.textContent = comparisons;
  swapsDisplay.textContent = swaps;
  timeDisplay.textContent = (performance.now() - startTime).toFixed(2);
}

function markAllSorted() {
  bars.forEach(bar => bar.classList.add('sorted'));
}

// ======================
// Sorting Algorithms
// ======================

async function bubbleSort() {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      comparisons++;
      updateStats();
      
      bars[j].classList.add('highlight');
      bars[j + 1].classList.add('highlight');
      await sleep();
      
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        swaps++;
        updateStats();
        renderBars();
      }
      
      bars[j].classList.remove('highlight');
      bars[j + 1].classList.remove('highlight');
    }
    bars[array.length - i - 1].classList.add('sorted');
  }
}

async function selectionSort() {
  for (let i = 0; i < array.length - 1; i++) {
    let minIndex = i;
    
    for (let j = i + 1; j < array.length; j++) {
      comparisons++;
      updateStats();
      
      bars[j].classList.add('highlight');
      bars[minIndex].classList.add('highlight');
      await sleep();
      
      if (array[j] < array[minIndex]) {
        minIndex = j;
      }
      
      bars[j].classList.remove('highlight');
      bars[minIndex].classList.remove('highlight');
    }
    
    if (minIndex !== i) {
      [array[i], array[minIndex]] = [array[minIndex], array[i]];
      swaps++;
      updateStats();
      renderBars();
    }
    
    bars[i].classList.add('sorted');
  }
  bars[array.length - 1].classList.add('sorted');
}

async function insertionSort() {
  for (let i = 1; i < array.length; i++) {
    let j = i;
    
    while (j > 0 && array[j] < array[j - 1]) {
      comparisons++;
      updateStats();
      
      bars[j].classList.add('highlight');
      bars[j - 1].classList.add('highlight');
      await sleep();
      
      [array[j], array[j - 1]] = [array[j - 1], array[j]];
      swaps++;
      updateStats();
      renderBars();
      
      bars[j].classList.remove('highlight');
      bars[j - 1].classList.remove('highlight');
      j--;
    }
  }
  markAllSorted();
}

// Merge Sort
async function mergeSortHelper() {
  await mergeSort(0, array.length - 1);
  markAllSorted();
}

async function mergeSort(l, r) {
  if (l >= r) return;
  
  const m = Math.floor((l + r) / 2);
  await mergeSort(l, m);
  await mergeSort(m + 1, r);
  await merge(l, m, r);
}

async function merge(l, m, r) {
  const n1 = m - l + 1;
  const n2 = r - m;
  
  const L = new Array(n1);
  const R = new Array(n2);
  
  for (let i = 0; i < n1; i++) {
    L[i] = array[l + i];
  }
  for (let j = 0; j < n2; j++) {
    R[j] = array[m + 1 + j];
  }
  
  let i = 0, j = 0, k = l;
  
  while (i < n1 && j < n2) {
    comparisons++;
    updateStats();
    
    bars[l + i]?.classList.add('highlight');
    bars[m + 1 + j]?.classList.add('highlight');
    await sleep();
    
    if (L[i] <= R[j]) {
      array[k] = L[i];
      i++;
    } else {
      array[k] = R[j];
      j++;
    }
    
    swaps++;
    updateStats();
    renderBars();
    
    bars[l + i - 1]?.classList.remove('highlight');
    bars[m + 1 + j - 1]?.classList.remove('highlight');
    k++;
  }
  
  while (i < n1) {
    array[k] = L[i];
    i++;
    k++;
    swaps++;
    updateStats();
    renderBars();
  }
  
  while (j < n2) {
    array[k] = R[j];
    j++;
    k++;
    swaps++;
    updateStats();
    renderBars();
  }
}

// Quick Sort (Lomuto Partition)
async function quickSortLomuto(low, high) {
  if (low < high) {
    const pi = await partitionLomuto(low, high);
    await quickSortLomuto(low, pi - 1);
    await quickSortLomuto(pi + 1, high);
  }
  if (low >= 0 && high < array.length) {
    for (let i = low; i <= high; i++) {
      bars[i].classList.add('sorted');
    }
  }
}

async function partitionLomuto(low, high) {
  const pivot = array[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    comparisons++;
    updateStats();
    
    bars[j].classList.add('highlight');
    bars[high].classList.add('highlight');
    await sleep();
    
    if (array[j] < pivot) {
      i++;
      [array[i], array[j]] = [array[j], array[i]];
      swaps++;
      updateStats();
      renderBars();
    }
    
    bars[j].classList.remove('highlight');
    bars[high].classList.remove('highlight');
  }
  
  [array[i + 1], array[high]] = [array[high], array[i + 1]];
  swaps++;
  updateStats();
  renderBars();
  
  return i + 1;
}

// Quick Sort (Hoare Partition)
async function quickSortHoare(low, high) {
  if (low < high) {
    const pi = await partitionHoare(low, high);
    await quickSortHoare(low, pi);
    await quickSortHoare(pi + 1, high);
  }
  if (low >= 0 && high < array.length) {
    for (let i = low; i <= high; i++) {
      bars[i].classList.add('sorted');
    }
  }
}

async function partitionHoare(low, high) {
  const pivot = array[Math.floor((low + high) / 2)];
  let i = low - 1;
  let j = high + 1;
  
  while (true) {
    do {
      i++;
      comparisons++;
      updateStats();
    } while (array[i] < pivot);
    
    do {
      j--;
      comparisons++;
      updateStats();
    } while (array[j] > pivot);
    
    if (i >= j) return j;
    
    bars[i].classList.add('highlight');
    bars[j].classList.add('highlight');
    await sleep();
    
    [array[i], array[j]] = [array[j], array[i]];
    swaps++;
    updateStats();
    renderBars();
    
    bars[i].classList.remove('highlight');
    bars[j].classList.remove('highlight');
  }
}

// Cycle Sort
async function cycleSort() {
  for (let cycleStart = 0; cycleStart < array.length - 1; cycleStart++) {
    let item = array[cycleStart];
    let pos = cycleStart;
    
    for (let i = cycleStart + 1; i < array.length; i++) {
      comparisons++;
      updateStats();
      
      bars[i].classList.add('highlight');
      bars[cycleStart].classList.add('highlight');
      await sleep();
      
      if (array[i] < item) {
        pos++;
      }
      
      bars[i].classList.remove('highlight');
      bars[cycleStart].classList.remove('highlight');
    }
    
    if (pos === cycleStart) continue;
    
    while (item === array[pos]) {
      pos++;
    }
    
    [item, array[pos]] = [array[pos], item];
    swaps++;
    updateStats();
    renderBars();
    
    while (pos !== cycleStart) {
      pos = cycleStart;
      
      for (let i = cycleStart + 1; i < array.length; i++) {
        comparisons++;
        updateStats();
        
        bars[i].classList.add('highlight');
        bars[cycleStart].classList.add('highlight');
        await sleep();
        
        if (array[i] < item) {
          pos++;
        }
        
        bars[i].classList.remove('highlight');
        bars[cycleStart].classList.remove('highlight');
      }
      
      while (item === array[pos]) {
        pos++;
      }
      
      if (item !== array[pos]) {
        [item, array[pos]] = [array[pos], item];
        swaps++;
        updateStats();
        renderBars();
      }
    }
  }
  markAllSorted();
}

// Heap Sort
async function heapSort() {
  const n = array.length;
  
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    await heapify(n, i);
  }
  
  for (let i = n - 1; i > 0; i--) {
    [array[0], array[i]] = [array[i], array[0]];
    swaps++;
    updateStats();
    renderBars();
    
    bars[i].classList.add('sorted');
    await heapify(i, 0);
  }
  
  markAllSorted();
}

async function heapify(n, i) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;
  
  if (left < n) {
    comparisons++;
    updateStats();
    
    bars[left].classList.add('highlight');
    bars[largest].classList.add('highlight');
    await sleep();
    
    if (array[left] > array[largest]) {
      largest = left;
    }
    
    bars[left].classList.remove('highlight');
    bars[largest].classList.remove('highlight');
  }
  
  if (right < n) {
    comparisons++;
    updateStats();
    
    bars[right].classList.add('highlight');
    bars[largest].classList.add('highlight');
    await sleep();
    
    if (array[right] > array[largest]) {
      largest = right;
    }
    
    bars[right].classList.remove('highlight');
    bars[largest].classList.remove('highlight');
  }
  
  if (largest !== i) {
    [array[i], array[largest]] = [array[largest], array[i]];
    swaps++;
    updateStats();
    renderBars();
    
    await heapify(n, largest);
  }
}

// Counting Sort
function countingSort() {
  const max = Math.max(...array);
  const min = Math.min(...array);
  const range = max - min + 1;
  const count = new Array(range).fill(0);
  const output = new Array(array.length);
  
  for (let i = 0; i < array.length; i++) {
    count[array[i] - min]++;
  }
  
  for (let i = 1; i < count.length; i++) {
    count[i] += count[i - 1];
  }
  
  for (let i = array.length - 1; i >= 0; i--) {
    output[count[array[i] - min] - 1] = array[i];
    count[array[i] - min]--;
  }
  
  for (let i = 0; i < array.length; i++) {
    array[i] = output[i];
    renderBars();
  }
  
  markAllSorted();
}

// Radix Sort
function radixSort() {
  const max = Math.max(...array);
  
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    countingSortForRadix(exp);
  }
  
  markAllSorted();
}

function countingSortForRadix(exp) {
  const output = new Array(array.length);
  const count = new Array(10).fill(0);
  
  for (let i = 0; i < array.length; i++) {
    count[Math.floor(array[i] / exp) % 10]++;
  }
  
  for (let i = 1; i < 10; i++) {
    count[i] += count[i - 1];
  }
  
  for (let i = array.length - 1; i >= 0; i--) {
    output[count[Math.floor(array[i] / exp) % 10] - 1] = array[i];
    count[Math.floor(array[i] / exp) % 10]--;
  }
  
  for (let i = 0; i < array.length; i++) {
    array[i] = output[i];
    renderBars();
  }
}

// Bucket Sort
function bucketSort() {
  const bucketSize = 5;
  const min = Math.min(...array);
  const max = Math.max(...array);
  const bucketCount = Math.floor((max - min) / bucketSize) + 1;
  const buckets = new Array(bucketCount);
  
  for (let i = 0; i < buckets.length; i++) {
    buckets[i] = [];
  }
  
  for (let i = 0; i < array.length; i++) {
    const bucketIndex = Math.floor((array[i] - min) / bucketSize);
    buckets[bucketIndex].push(array[i]);
  }
  
  array = [];
  for (let i = 0; i < buckets.length; i++) {
    insertionSortForBucket(buckets[i]);
    array.push(...buckets[i]);
    renderBars();
  }
  
  markAllSorted();
}

function insertionSortForBucket(bucket) {
  for (let i = 1; i < bucket.length; i++) {
    let j = i;
    while (j > 0 && bucket[j] < bucket[j - 1]) {
      [bucket[j], bucket[j - 1]] = [bucket[j - 1], bucket[j]];
      j--;
    }
  }
}

// Initialize the app
init();