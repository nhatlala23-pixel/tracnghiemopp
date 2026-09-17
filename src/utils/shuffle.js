/**
 * Fisher-Yates shuffle algorithm
 * @param {Array} array 
 * @returns {Array} Shuffled copy of array
 */
export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Lấy ngẫu nhiên N phần tử không trùng lặp từ mảng
 * @param {Array} array 
 * @param {number} count 
 * @returns {Array}
 */
export function pickRandomQuestions(array, count) {
  if (!array || array.length === 0) return [];
  if (count >= array.length) return shuffleArray(array);
  
  const shuffled = shuffleArray(array);
  return shuffled.slice(0, count);
}
