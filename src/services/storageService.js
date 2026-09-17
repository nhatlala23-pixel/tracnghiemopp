import { STORAGE_KEYS } from '../utils/constants';

/**
 * Storage service an toàn, không gây crash nếu LocalStorage bị đầy hoặc bị vô hiệu hóa
 */
export const storageService = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error(`Error reading key "${key}" from localStorage:`, e);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`Error writing key "${key}" to localStorage:`, e);
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error(`Error removing key "${key}" from localStorage:`, e);
      return false;
    }
  },

  // 1. Tiến độ học tập (câu đã làm, đúng, sai)
  getProgress() {
    return this.get(STORAGE_KEYS.PROGRESS, {
      answered: {}, // { [questionId]: { answer: 'A', isCorrect: true, updatedAt: '...' } }
      totalAnswered: 0,
      totalCorrect: 0,
    });
  },

  updateProgress(questionId, selectedAnswer, isCorrect) {
    const progress = this.getProgress();
    const prev = progress.answered[questionId];

    progress.answered[questionId] = {
      answer: selectedAnswer,
      isCorrect,
      updatedAt: new Date().toISOString(),
    };

    // Tính lại số câu đã làm và số câu đúng
    const answeredEntries = Object.values(progress.answered);
    progress.totalAnswered = answeredEntries.length;
    progress.totalCorrect = answeredEntries.filter(entry => entry.isCorrect).length;

    this.set(STORAGE_KEYS.PROGRESS, progress);
    return progress;
  },

  // 2. Lịch sử bài thi
  getQuizHistory() {
    return this.get(STORAGE_KEYS.HISTORY, []);
  },

  saveQuizHistory(result) {
    const history = this.getQuizHistory();
    const newEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      total: result.total,
      correct: result.correct,
      wrong: result.wrong,
      skipped: result.skipped,
      accuracy: result.accuracy,
      timeSpentSeconds: result.timeSpentSeconds,
      formattedTime: result.formattedTime,
      mode: result.mode || 'exam',
      topicAnalysis: result.topicAnalysis,
    };
    history.unshift(newEntry); // Đưa lên đầu
    // Giữ tối đa 50 bài thi gần nhất
    const trimmed = history.slice(0, 50);
    this.set(STORAGE_KEYS.HISTORY, trimmed);
    return newEntry;
  },

  // 3. Ngân hàng câu hỏi sai
  getWrongQuestions() {
    return this.get(STORAGE_KEYS.WRONG_QUESTIONS, []); // Mảng ID các câu hỏi sai
  },

  addWrongQuestions(questionIds = []) {
    const current = new Set(this.getWrongQuestions());
    questionIds.forEach(id => current.add(id));
    const updated = Array.from(current);
    this.set(STORAGE_KEYS.WRONG_QUESTIONS, updated);
    return updated;
  },

  removeWrongQuestion(questionId) {
    const current = this.getWrongQuestions().filter(id => id !== questionId);
    this.set(STORAGE_KEYS.WRONG_QUESTIONS, current);
    return current;
  },

  clearWrongQuestions() {
    this.set(STORAGE_KEYS.WRONG_QUESTIONS, []);
    return [];
  },

  // 4. Bookmark câu hỏi
  getBookmarks() {
    return this.get(STORAGE_KEYS.BOOKMARKS, []); // Mảng ID câu hỏi được đánh dấu
  },

  toggleBookmark(questionId) {
    const bookmarks = new Set(this.getBookmarks());
    if (bookmarks.has(questionId)) {
      bookmarks.delete(questionId);
    } else {
      bookmarks.add(questionId);
    }
    const updated = Array.from(bookmarks);
    this.set(STORAGE_KEYS.BOOKMARKS, updated);
    return updated;
  },

  isBookmarked(questionId) {
    const bookmarks = this.getBookmarks();
    return bookmarks.includes(questionId);
  },

  // 5. Bài thi đang làm dở (Resilience against refresh / tab close)
  getCurrentQuiz() {
    return this.get(STORAGE_KEYS.CURRENT_QUIZ, null);
  },

  saveCurrentQuiz(quizState) {
    return this.set(STORAGE_KEYS.CURRENT_QUIZ, quizState);
  },

  clearCurrentQuiz() {
    return this.remove(STORAGE_KEYS.CURRENT_QUIZ);
  },

  // 6. Thống kê tổng quan
  getStatistics() {
    const history = this.getQuizHistory();
    const progress = this.getProgress();
    const wrongQuestions = this.getWrongQuestions();

    const totalTests = history.length;
    const scores = history.map(h => h.accuracy);
    const bestScore = scores.length > 0 ? Math.max(...scores) : 0;
    const avgScore = scores.length > 0 ? Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)) : 0;

    return {
      totalAnswered: progress.totalAnswered,
      totalCorrect: progress.totalCorrect,
      overallAccuracy: progress.totalAnswered > 0 ? Number(((progress.totalCorrect / progress.totalAnswered) * 100).toFixed(1)) : 0,
      totalTests,
      bestScore,
      avgScore,
      wrongCount: wrongQuestions.length,
    };
  },

  // 7. Theme
  getTheme() {
    return this.get(STORAGE_KEYS.THEME, 'light');
  },

  saveTheme(theme) {
    return this.set(STORAGE_KEYS.THEME, theme);
  },

  // Xóa toàn bộ dữ liệu người dùng (Reset)
  clearAllUserData() {
    Object.values(STORAGE_KEYS).forEach(key => {
      if (key !== STORAGE_KEYS.THEME) {
        this.remove(key);
      }
    });
  }
};
