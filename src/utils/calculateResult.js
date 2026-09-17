import { CHAPTERS_INFO } from '../data/questionIndex';

/**
 * Phân tích và chấm điểm kết quả bài thi theo 6 chương
 * @param {Array} questions Danh sách câu hỏi trong bài
 * @param {Object} userAnswers Map { [questionId]: 'A' | 'B' | 'C' | 'D' }
 * @param {number} timeSpentSeconds Thời gian hoàn thành (giây)
 * @returns {Object} Chi tiết kết quả thi
 */
export function calculateQuizResult(questions = [], userAnswers = {}, timeSpentSeconds = 0) {
  const total = questions.length;
  let correct = 0;
  let wrong = 0;
  let skipped = 0;

  // Khởi tạo map cho 6 chương
  const chapterMap = {};
  CHAPTERS_INFO.forEach(ch => {
    chapterMap[ch.chapter] = {
      chapter: ch.chapter,
      name: ch.name,
      shortName: ch.shortName,
      total: 0,
      correct: 0,
      wrong: 0,
      skipped: 0,
    };
  });

  const wrongQuestionIds = [];
  const questionReviews = [];

  questions.forEach((q) => {
    const userAnswer = userAnswers[q.id] || null;
    const isAnswered = userAnswer !== null && userAnswer !== undefined;
    const isCorrect = isAnswered && String(userAnswer).trim().toUpperCase() === String(q.correctAnswer).trim().toUpperCase();
    const isWrong = isAnswered && !isCorrect;

    if (!isAnswered) {
      skipped++;
    } else if (isCorrect) {
      correct++;
    } else {
      wrong++;
      wrongQuestionIds.push(q.id);
    }

    // Thống kê theo chương
    const chNum = q.chapter || 1;
    if (!chapterMap[chNum]) {
      chapterMap[chNum] = {
        chapter: chNum,
        name: `Chương ${chNum}`,
        shortName: `Chương ${chNum}`,
        total: 0,
        correct: 0,
        wrong: 0,
        skipped: 0,
      };
    }

    chapterMap[chNum].total++;
    if (!isAnswered) {
      chapterMap[chNum].skipped++;
    } else if (isCorrect) {
      chapterMap[chNum].correct++;
    } else {
      chapterMap[chNum].wrong++;
    }

    // Chi tiết từng câu cho phần Review Answers
    questionReviews.push({
      ...q,
      userAnswer,
      isCorrect,
      isWrong,
      isAnswered,
    });
  });

  const accuracy = total > 0 ? Number(((correct / total) * 100).toFixed(2)) : 0;

  // Lọc các chương thực sự có câu hỏi trong đề thi này
  const chapterAnalysis = Object.values(chapterMap)
    .filter(ch => ch.total > 0)
    .map((ch) => {
      const chAccuracy = ch.total > 0 ? Number(((ch.correct / ch.total) * 100).toFixed(1)) : 0;
      let classification = 'normal';
      if (chAccuracy >= 80) classification = 'good';
      else if (chAccuracy < 70) classification = 'needs_review';

      return {
        ...ch,
        accuracy: chAccuracy,
        classification,
      };
    });

  return {
    total,
    correct,
    wrong,
    skipped,
    accuracy,
    timeSpentSeconds,
    formattedTime: formatDuration(timeSpentSeconds),
    chapterAnalysis,
    wrongQuestionIds,
    questionReviews,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Định dạng số giây sang định dạng mm:ss hoặc hh:mm:ss
 */
export function formatDuration(seconds = 0) {
  const s = Math.max(0, Math.floor(seconds));
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;

  const pad = (n) => String(n).padStart(2, '0');

  if (hrs > 0) {
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }
  return `${pad(mins)}:${pad(secs)}`;
}
