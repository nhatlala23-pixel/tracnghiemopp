import { allQuestions, CHAPTERS_INFO, chaptersData } from '../data/questionIndex';
import { storageService } from './storageService';
import { pickRandomQuestions } from '../utils/shuffle';

export const questionService = {
  /**
   * Lấy toàn bộ câu hỏi hiện có trong ngân hàng (tổng hợp 6 chương)
   */
  getAllQuestions() {
    return allQuestions;
  },

  /**
   * Lấy tổng số lượng câu hỏi hiện có (hoàn toàn động)
   */
  getQuestionCount() {
    return allQuestions.length;
  },

  /**
   * Lấy danh sách 6 chương kèm số lượng câu thực tế của từng chương
   */
  getChapters() {
    return chaptersData.map(ch => ({
      chapter: ch.chapter,
      name: ch.name,
      shortName: ch.shortName,
      count: ch.questions ? ch.questions.length : 0,
    }));
  },

  /**
   * Lấy câu hỏi theo số chương (1 đến 6)
   */
  getQuestionsByChapter(chapter) {
    if (!chapter || chapter === 'all') return allQuestions;
    const numChapter = Number(chapter);
    return allQuestions.filter(q => q.chapter === numChapter);
  },

  /**
   * Tìm câu hỏi theo string ID duy nhất (ví dụ: "CH1-Q001")
   */
  getQuestionById(id) {
    if (!id) return null;
    const strId = String(id).trim().toUpperCase();
    return allQuestions.find(q => String(q.id).trim().toUpperCase() === strId) || null;
  },

  /**
   * Lấy ngẫu nhiên N câu hỏi từ toàn bộ ngân hàng
   */
  getRandomQuestions(count = 90) {
    return pickRandomQuestions(allQuestions, count);
  },

  /**
   * Lấy ngẫu nhiên N câu hỏi từ một chương cụ thể
   */
  getRandomQuestionsByChapter(chapter, count) {
    const chapterQuestions = this.getQuestionsByChapter(chapter);
    return pickRandomQuestions(chapterQuestions, count);
  },

  /**
   * Lấy câu hỏi theo độ khó (easy / medium / hard)
   */
  getQuestionsByDifficulty(difficulty) {
    if (!difficulty || difficulty === 'all') return allQuestions;
    return allQuestions.filter(q => q.difficulty === difficulty);
  },

  /**
   * Lấy danh sách các câu hỏi từng làm sai
   */
  getWrongQuestions() {
    const wrongIds = storageService.getWrongQuestions();
    const wrongSet = new Set(wrongIds.map(id => String(id).toUpperCase()));
    return allQuestions.filter(q => wrongSet.has(String(q.id).toUpperCase()));
  },

  /**
   * Lấy danh sách các câu hỏi đã được đánh dấu Bookmark
   */
  getBookmarkedQuestions() {
    const bookmarkIds = storageService.getBookmarks();
    const bookmarkSet = new Set(bookmarkIds.map(id => String(id).toUpperCase()));
    return allQuestions.filter(q => bookmarkSet.has(String(q.id).toUpperCase()));
  },

  /**
   * Thống kê chi tiết theo 6 chương (Chương 1 .. Chương 6)
   * Phân tích: tổng số câu, đã làm, đúng, sai, chưa làm, accuracy
   */
  getChapterStatistics() {
    const progress = storageService.getProgress();
    const answeredMap = progress.answered || {};

    return CHAPTERS_INFO.map(info => {
      const chapterQuestions = this.getQuestionsByChapter(info.chapter);
      const total = chapterQuestions.length;
      let answered = 0;
      let correct = 0;
      let wrong = 0;

      chapterQuestions.forEach(q => {
        const record = answeredMap[q.id];
        if (record) {
          answered++;
          if (record.isCorrect) {
            correct++;
          } else {
            wrong++;
          }
        }
      });

      const unanswered = Math.max(0, total - answered);
      const accuracy = answered > 0 ? Number(((correct / answered) * 100).toFixed(1)) : 0;

      return {
        chapter: info.chapter,
        name: info.name,
        shortName: info.shortName,
        total,
        answered,
        correct,
        wrong,
        unanswered,
        accuracy,
      };
    });
  },

  /**
   * Lọc câu hỏi theo chương, trạng thái và độ khó
   */
  filterQuestions({ chapter = 'all', status = 'all', difficulty = 'all', searchQuery = '' } = {}) {
    let filtered = [...allQuestions];

    // Lọc theo chương
    if (chapter && chapter !== 'all') {
      const numChapter = Number(chapter);
      filtered = filtered.filter(q => q.chapter === numChapter);
    }

    // Lọc theo độ khó
    if (difficulty && difficulty !== 'all') {
      filtered = filtered.filter(q => q.difficulty === difficulty);
    }

    // Lọc theo trạng thái
    const progress = storageService.getProgress();
    const answeredMap = progress.answered || {};

    if (status === 'unanswered') {
      filtered = filtered.filter(q => !answeredMap[q.id]);
    } else if (status === 'answered') {
      filtered = filtered.filter(q => !!answeredMap[q.id]);
    } else if (status === 'wrong') {
      const wrongSet = new Set(storageService.getWrongQuestions().map(id => String(id).toUpperCase()));
      filtered = filtered.filter(q => wrongSet.has(String(q.id).toUpperCase()));
    } else if (status === 'bookmarked') {
      const bookmarkSet = new Set(storageService.getBookmarks().map(id => String(id).toUpperCase()));
      filtered = filtered.filter(q => bookmarkSet.has(String(q.id).toUpperCase()));
    }

    // Lọc theo từ khóa tìm kiếm
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(q =>
        q.question.toLowerCase().includes(query) ||
        (q.explanation && q.explanation.toLowerCase().includes(query)) ||
        String(q.id).toLowerCase().includes(query)
      );
    }

    return filtered;
  }
};
