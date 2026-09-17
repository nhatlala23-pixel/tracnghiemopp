import { questionService } from './questionService';
import { storageService } from './storageService';
import { calculateQuizResult } from '../utils/calculateResult';
import { QUESTIONS_PER_TEST, QUIZ_DURATION, QUIZ_MODES } from '../utils/constants';

export const quizService = {
  /**
   * Khởi tạo một phiên thi mới
   * @param {Object} options { mode, count, chapter, questionIds, duration }
   */
  createQuiz({
    mode = QUIZ_MODES.EXAM,
    count = QUESTIONS_PER_TEST,
    chapter = 'all',
    questionIds = null,
    duration = QUIZ_DURATION,
  } = {}) {
    let questions = [];
    const totalAvailable = questionService.getQuestionCount();

    // 1. Nếu là chế độ thi thử (EXAM) 90 câu
    if (mode === QUIZ_MODES.EXAM) {
      if (totalAvailable < count) {
        // Báo lỗi rõ ràng nếu chưa đủ 90 câu thật
        const errorMsg = `Ngân hàng câu hỏi chưa đủ ${count} câu để tạo bài thi (hiện có ${totalAvailable} câu). Vui lòng thêm câu hỏi thật vào các file chương trước khi thi thử.`;
        throw new Error(errorMsg);
      }
      questions = questionService.getRandomQuestions(count);
    } else if (questionIds && questionIds.length > 0) {
      // Chỉ định cụ thể danh sách ID (ví dụ: làm lại câu sai hoặc bookmark)
      const idSet = new Set(questionIds.map(id => String(id).toUpperCase()));
      questions = questionService.getAllQuestions().filter(q => idSet.has(String(q.id).toUpperCase()));
    } else if (mode === QUIZ_MODES.WRONG_RETRIAL) {
      questions = questionService.getWrongQuestions();
    } else if (mode === QUIZ_MODES.BOOKMARK_PRACTICE) {
      questions = questionService.getBookmarkedQuestions();
    } else {
      // Chế độ ôn tập theo chương
      const filtered = questionService.filterQuestions({ chapter });
      questions = filtered.slice(0, count === 'all' ? filtered.length : count);
    }

    if (questions.length === 0) {
      throw new Error('Không có câu hỏi nào thỏa mãn điều kiện để bắt đầu làm bài.');
    }

    const quizSession = {
      id: 'quiz_' + Date.now(),
      mode,
      chapter,
      questions,
      totalQuestions: questions.length,
      currentQuestionIndex: 0,
      userAnswers: {},
      markedQuestions: [],
      duration: mode === QUIZ_MODES.EXAM ? duration : null,
      timeRemaining: mode === QUIZ_MODES.EXAM ? duration : null,
      startTime: Date.now(),
      isSubmitted: false,
    };

    // Lưu bài thi dở dang vào localStorage
    storageService.saveCurrentQuiz(quizSession);

    return quizSession;
  },

  /**
   * Tính toán kết quả bài thi
   */
  calculateResult(questions, userAnswers, timeSpentSeconds) {
    return calculateQuizResult(questions, userAnswers, timeSpentSeconds);
  },

  /**
   * Lưu kết quả bài thi và cập nhật tiến độ
   */
  saveQuizResult(result, mode = QUIZ_MODES.EXAM) {
    storageService.saveQuizHistory({ ...result, mode });

    // Lưu các câu sai vào ngân hàng câu hỏi sai (chỉ lưu ID)
    if (result.wrongQuestionIds && result.wrongQuestionIds.length > 0) {
      storageService.addWrongQuestions(result.wrongQuestionIds);
    }

    // Cập nhật tiến độ học
    result.questionReviews.forEach((review) => {
      if (review.isAnswered) {
        storageService.updateProgress(review.id, review.userAnswer, review.isCorrect);
      }
    });

    // Xóa phiên làm dở
    storageService.clearCurrentQuiz();

    return result;
  },

  loadQuizHistory() {
    return storageService.getQuizHistory();
  },

  getActiveQuiz() {
    return storageService.getCurrentQuiz();
  },

  discardActiveQuiz() {
    return storageService.clearCurrentQuiz();
  }
};
