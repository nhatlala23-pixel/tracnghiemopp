/**
 * Bộ kiểm tra (Validator) tính toàn vẹn và hợp lệ của ngân hàng câu hỏi OOP
 * Không tự động sửa dữ liệu, xuất thông báo lỗi chính xác để người dùng kiểm tra.
 */

export function validateQuestion(q) {
  const errors = [];

  if (!q || typeof q !== 'object') {
    return ['Dữ liệu câu hỏi không phải là một object hợp lệ'];
  }

  // 1. Kiểm tra ID
  if (!q.id || typeof q.id !== 'string' || !q.id.trim()) {
    errors.push('Thiếu hoặc sai định dạng trường id');
  }

  // 2. Kiểm tra Chapter
  if (!q.chapter || typeof q.chapter !== 'number' || q.chapter < 1 || q.chapter > 6) {
    errors.push(`Trường chapter không hợp lệ: "${q.chapter}". Yêu cầu số nguyên từ 1 đến 6`);
  }

  // 3. Kiểm tra questionNumber
  if (!q.questionNumber || typeof q.questionNumber !== 'number' || q.questionNumber < 1) {
    errors.push(`Trường questionNumber không hợp lệ: "${q.questionNumber}"`);
  }

  // 4. Kiểm tra nội dung câu hỏi
  if (!q.question || typeof q.question !== 'string' || !q.question.trim()) {
    errors.push('Nội dung question bị rỗng hoặc không phải chuỗi');
  }

  // 5. Kiểm tra options A, B, C, D
  if (!q.options || typeof q.options !== 'object') {
    errors.push('Thiếu trường options hoặc options không phải object');
  } else {
    ['A', 'B', 'C', 'D'].forEach((letter) => {
      if (!q.options[letter] || typeof q.options[letter] !== 'string' || !q.options[letter].trim()) {
        errors.push(`Thiếu hoặc rỗng lựa chọn ${letter} (Missing option ${letter})`);
      }
    });
  }

  // 6. Kiểm tra correctAnswer
  if (!['A', 'B', 'C', 'D'].includes(q.correctAnswer)) {
    errors.push(`Đáp án đúng không hợp lệ: "${q.correctAnswer}" (Invalid correctAnswer: ${q.correctAnswer}). Yêu cầu A, B, C hoặc D`);
  }

  // 7. Kiểm tra difficulty
  if (q.difficulty && !['easy', 'medium', 'hard'].includes(q.difficulty)) {
    errors.push(`Độ khó không hợp lệ: "${q.difficulty}". Yêu cầu easy, medium hoặc hard`);
  }

  return errors;
}

/**
 * Kiểm tra toàn bộ ngân hàng câu hỏi
 * @param {Array} questions Danh sách câu hỏi
 * @returns {Object} { isValid: boolean, errors: string[], summary: Object }
 */
export function validateQuestionBank(questions = []) {
  const errors = [];
  const seenIds = new Set();
  const chapterCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

  if (!Array.isArray(questions)) {
    return {
      isValid: false,
      errors: ['Ngân hàng câu hỏi không phải là một mảng.'],
      summary: null,
    };
  }

  questions.forEach((q, index) => {
    const qIdentifier = q?.id ? `Question ${q.id}` : `Question index #${index}`;

    // Kiểm tra từng câu
    const qErrors = validateQuestion(q);
    qErrors.forEach(err => errors.push(`${qIdentifier}: ${err}`));

    // Kiểm tra trùng ID
    if (q?.id) {
      if (seenIds.has(q.id)) {
        errors.push(`${qIdentifier}: Trùng lặp ID "${q.id}"`);
      }
      seenIds.add(q.id);
    }

    if (q?.chapter && chapterCounts[q.chapter] !== undefined) {
      chapterCounts[q.chapter]++;
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    summary: {
      totalQuestions: questions.length,
      uniqueIds: seenIds.size,
      chapterCounts,
    },
  };
}
